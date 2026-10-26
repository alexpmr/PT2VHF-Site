<?php
/**
 * API oficial de atualizacoes PT2VHF.
 * Le /updates.json do proprio dominio, sem usar GitLab nem GitHub.
 * PHP 7.4+.
 */
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Origin: *');
header('Referrer-Policy: no-referrer');
function reply(int $code, array $payload): void {
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    header('Allow: GET');
    reply(405, array('error' => 'Somente GET e permitido'));
}
$names = array('mesh','aprs','prop','sat','prog');
$product = (string)($_GET['product'] ?? 'mesh');
if (!in_array($product, $names, true)) reply(400, array('error' => 'Produto invalido'));
$platform = (string)($_GET['platform'] ?? '');
$kind = (string)($_GET['kind'] ?? '');
$platforms = array('', 'windows-x64', 'windows-arm64', 'linux-x64', 'linux-arm64', 'macos-x64', 'macos-arm64');
$kinds = array('', 'installer', 'portable', 'deb', 'tar.gz', 'appimage', 'dmg');
if (!in_array($platform, $platforms, true) || !in_array($kind, $kinds, true)) {
    reply(400, array('error' => 'Plataforma ou tipo invalido'));
}
$raw = @file_get_contents(__DIR__ . '/updates.json');
$catalog = is_string($raw) ? json_decode($raw, true) : null;
if (!is_array($catalog) || ($catalog['schema'] ?? null) !== 1 || !is_array($catalog['products'] ?? null)) {
    reply(503, array('error' => 'Catalogo de atualizacoes indisponivel'));
}
$entry = $catalog['products'][$product] ?? null;
if (!is_array($entry)) reply(404, array('error' => 'Produto nao cadastrado'));
$version = $entry['version'] ?? null;
$ready = is_string($version) && preg_match('/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/D', $version) === 1;
$mapping = array('windows-installer' => 'installer', 'windows-portable' => 'portable',
                 'linux-deb' => 'deb', 'linux-targz' => 'tar.gz',
                 'linux-appimage' => 'appimage', 'macos' => 'dmg');
$directories = array('mesh'=>'mesh-analyzer', 'aprs'=>'aprs-client', 'prop'=>'prop-tool',
                     'sat'=>'sat-tool', 'prog'=>'prog-tool');
$prefix = '/downloads/' . $directories[$product] . '/';
$root = realpath(__DIR__ . '/downloads');
$assets = array();
if ($ready && is_array($entry['files'] ?? null) && $root !== false) {
    foreach ($entry['files'] as $file) {
        if (!is_array($file)) continue;
        $category = (string)($file['category'] ?? '');
        if (!isset($mapping[$category])) continue;
        $fileKind = $mapping[$category];
        $filePlatform = (string)($file['platform'] ?? '');
        // Nunca inferir arquitetura do Mesh.
        if ($product === 'mesh' && ($filePlatform === '' || !in_array($filePlatform, $platforms, true))) continue;
        if ($platform !== '' && $platform !== $filePlatform) continue;
        if ($kind !== '' && $kind !== $fileKind) continue;
        $url = (string)($file['url'] ?? '');
        $parts = parse_url($url);
        if (!is_array($parts) || ($parts['scheme'] ?? '') !== 'https'
            || strtolower((string)($parts['host'] ?? '')) !== 'www.pt2vhf.com'
            || isset($parts['user']) || isset($parts['pass']) || isset($parts['port'])
            || isset($parts['query']) || isset($parts['fragment'])) continue;
        $path = (string)($parts['path'] ?? '');
        if (strpos($path, $prefix) !== 0 || strpos($path, '%') !== false) continue;
        $name = basename($path);
        if ($name !== (string)($file['name'] ?? '') || !preg_match('/^[a-zA-Z0-9_.-]+$/D', $name)) continue;
        $real = realpath(__DIR__ . $path);
        if ($real === false || strncmp($real, $root . DIRECTORY_SEPARATOR, strlen($root) + 1) !== 0
            || !is_file($real) || !is_readable($real)) continue;
        $size = $file['size'] ?? null;
        $sha = (string)($file['sha256'] ?? '');
        if (!is_int($size) || $size <= 0 || filesize($real) !== $size || !preg_match('/^[a-f0-9]{64}$/D', $sha)) continue;
        $assets[] = array('category'=>$category, 'kind'=>$fileKind, 'platform'=>$filePlatform,
                          'name'=>$name, 'url'=>$url, 'size'=>$size, 'sha256'=>$sha);
    }
}
$status = $ready && count($assets) > 0 ? 'available' : 'unpublished';
reply(200, array(
    'schema'=>1, 'source'=>'https://www.pt2vhf.com', 'product'=>$product,
    'status'=>$status, 'version'=>$status === 'available' ? $version : null,
    'date'=>$status === 'available' ? ($entry['date'] ?? null) : null,
    'notes'=>$status === 'available' ? ($entry['notes'] ?? '') : '',
    'page'=>(string)($entry['page'] ?? ('https://www.pt2vhf.com/' . $product)),
    'files'=>$assets
));
