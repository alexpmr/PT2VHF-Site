<?php
/**
 * PT2VHF — contagem acumulada de solicitações de download por projeto e
 * categoria. Independente do número da versão; sem cookies, endereços IP
 * ou identificadores pessoais. Requer PHP 7.4+ na hospedagem Hostinger.
 *
 * Arquivo de dados fora de public_html, preservado em novos deploys.
 */
declare(strict_types=1);
require_once __DIR__ . '/prop_parts.php';

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Robots-Tag: noindex, nofollow');

$allowed = array(
    'windows-installer', 'windows-portable', 'linux-deb', 'linux-targz', 'linux-appimage', 'macos',
    'win-setup-x64','win-portable-x64','win-setup-arm64','win-portable-arm64',
    'linux-appimage-x64','linux-appimage-arm64','linux-deb-x64','linux-deb-arm64',
    'linux-tar-x64','linux-tar-arm64','mac-dmg-x64','mac-dmg-arm64','mac-dmg-intel-legacy',
    'win7-setup-x64','win7-portable-x64',
    'android-apk'
);
$products = array('aprs', 'prop', 'mesh', 'sat', 'prog', 'qsl', 'aprs-android');
// Baseline histórico do GitHub em 26/10/2026, antes dos downloads pelo site.
// Contagens auditáveis: github.com/alexpmr/PT2VHF-Prop-Tool (ramo badges).
$propHistoricalCounts = array('win-setup-x64' => 48, 'win-portable-x64' => 23);
$manifestPath = __DIR__ . '/updates.json';

function pt2vhf_error(int $status, string $msg): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array('error' => $msg), JSON_UNESCAPED_UNICODE);
    exit;
}
function pt2vhf_read_document($stream): array {
    rewind($stream);
    $contents = stream_get_contents($stream);
    if (!is_string($contents) || trim($contents) === '') {
        return array('schema' => 1, 'started' => gmdate('Y-m-d'), 'counts' => array());
    }
    $data = json_decode($contents, true);
    if (!is_array($data) || ($data['schema'] ?? null) !== 1 || !is_array($data['counts'] ?? null)) {
        pt2vhf_error(503, 'Arquivo de contadores inválido; nenhuma contagem efetuada');
    }
    return $data;
}

$storageDir = dirname(__DIR__) . '/pt2vhf-private-data';
if (!is_dir($storageDir) && !@mkdir($storageDir, 0700, true) && !is_dir($storageDir)) {
    pt2vhf_error(503, 'Armazenamento do contador indisponível');
}
$filename = $storageDir . '/downloads.json';
$file = @fopen($filename, 'c+');
if ($file === false) {
    pt2vhf_error(503, 'Arquivo de contadores inacessível');
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && ($_GET['mode'] ?? '') === 'stats') {
    if (!flock($file, LOCK_SH)) pt2vhf_error(503, 'Contagem indisponível');
    $data = pt2vhf_read_document($file);
    flock($file, LOCK_UN);
    fclose($file);

    foreach ($products as $product) {
        if (!isset($data['counts'][$product])) $data['counts'][$product] = array();
        foreach ($allowed as $category) {
            if (!isset($data['counts'][$product][$category])) {
                $data['counts'][$product][$category] = $product === 'prop' ? ($propHistoricalCounts[$category] ?? 0) : 0;
            }
        }
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Downloads APRS/Mesh: valida, conta GET inicial e redireciona.
// HEAD e Range não contam. O app Mesh antigo envia POST depois do GET:
// ignoramos esse POST para não duplicar contagens. O app novo não depende dele.
$method = (string)($_SERVER['REQUEST_METHOD'] ?? 'GET');
$isFileRequest = in_array($method, array('GET', 'HEAD'), true) && isset($_GET['file']);
if (!$isFileRequest && ($method !== 'POST' || ($_POST['action'] ?? '') !== 'count')) {
    fclose($file);
    pt2vhf_error(405, 'Método ou ação inválidos');
}
$product = (string)($isFileRequest ? ($_GET['product'] ?? '') : ($_POST['product'] ?? ''));
$category = (string)($isFileRequest ? '' : ($_POST['category'] ?? ''));
$requestedFile = $isFileRequest ? (string)($_GET['file'] ?? '') : '';
if (!in_array($product, $products, true) ||
    ($isFileRequest && (!in_array($product, array('aprs', 'prop', 'mesh', 'sat', 'prog', 'qsl', 'aprs-android'), true) || preg_match('/^[a-zA-Z0-9_.-]+$/D', $requestedFile) !== 1)) ||
    (!$isFileRequest && !in_array($category, $allowed, true))) {
    fclose($file);
    pt2vhf_error(400, 'Projeto, categoria ou arquivo inválidos');
}
// 29/10/2026: todo download conta uma vez, manual (site) ou OTA (por dentro do app), em todos os
// projetos — sempre no GET do arquivo, que todo atualizador faz. O POST de contagem que versões
// antigas dos apps enviam depois do download é ignorado (204) para não contar duas vezes; antes o
// OTA do APRS dependia só desse POST e deixava de contar quando ele falhava.
$agent = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
$isAprsUpdater = $product === 'aprs' && strncmp($agent, 'PT2VHF-APRS-Client', 18) === 0;
$isAppUpdater = strncasecmp($agent, 'PT2VHF', 6) === 0;
if (!$isFileRequest) {
    fclose($file);
    http_response_code(204);
    exit;
}

$manifest = @file_get_contents($manifestPath);
$updates = $manifest === false ? null : json_decode($manifest, true);
$files = $updates['products'][$product]['files'] ?? null;
if (!is_array($files)) {
    fclose($file);
    pt2vhf_error(404, 'Projeto não publicado');
}

// Só conta uma solicitação para uma categoria com arquivo publicado e
// efetivamente presente na hospedagem. Nunca aceita caminho enviado pelo cliente.
$found = false;
$redirectPath = '';
$propChunks = false;
$propSize = 0;
$folders = array('aprs' => 'aprs-client', 'prop' => 'prop-tool', 'mesh' => 'mesh-analyzer', 'sat' => 'sat-tool', 'prog' => 'prog-tool', 'qsl' => 'qsl-analyzer', 'aprs-android' => 'aprs-android');
$segmented = $product === 'prop' || $product === 'sat' || $product === 'qsl';
foreach ($files as $entry) {
    if (!is_array($entry)) continue;
    $key = (string)(($entry['counterKey'] ?? null) ?: ($entry['category'] ?? ''));
    if ($isFileRequest) {
        if (($entry['name'] ?? '') !== $requestedFile || !in_array($key, $allowed, true)) continue;
    } elseif ($key !== $category) continue;
    $url = (string)($entry['url'] ?? '');
    $parts = parse_url($url);
    if (!is_array($parts) || ($parts['scheme'] ?? '') !== 'https'
        || strtolower((string)($parts['host'] ?? '')) !== 'www.pt2vhf.com'
        || isset($parts['user']) || isset($parts['pass']) || isset($parts['port'])
        || isset($parts['query']) || isset($parts['fragment'])) continue;
    $path = (string)($parts['path'] ?? '');
    if (strpos($path, '/downloads/') !== 0 || strpos($path, '%') !== false) continue;
    if ($isFileRequest && $path !== '/downloads/' . $folders[$product] . '/' . $requestedFile) continue;
    $size = $entry['size'] ?? null;
    if ($segmented) {
        $chunks = pt2vhf_prop_parts($entry, $product);
        if ($chunks !== false) {
            $found = true;
            if ($isFileRequest) { $category = $key; $propChunks = $chunks; $propSize = $size; }
            break;
        }
        // Todos os binarios sao servidos pelo proprio dominio: sem partes
        // validadas em downloads/, o arquivo nao e oferecido (nunca redireciona).
    } else {
        $root = realpath(__DIR__ . '/downloads');
        $target = realpath(__DIR__ . $path);
        if ($root !== false && $target !== false &&
            strncmp($target, $root . DIRECTORY_SEPARATOR, strlen($root) + 1) === 0 &&
            is_file($target) && is_readable($target) &&
            is_int($size) && $size > 0 && filesize($target) === $size) {
            $found = true;
            if ($isFileRequest) { $category = $key; $redirectPath = $path; }
            break;
        }
    }
}
if (!$found) {
    fclose($file);
    pt2vhf_error(404, 'Arquivo da categoria não está disponível');
}
if ($isFileRequest && $method === 'HEAD') {
    fclose($file);
    if ($segmented) {
        if ($propChunks !== false) pt2vhf_serve_prop($requestedFile, $propSize, $propChunks, true);
        header('Location: ' . $redirectPath, true, 302);
        exit;
    }
    header('Location: ' . $redirectPath . '?pt2vhf_raw=1', true, 302);
    exit;
}
// Download continuation/range requests must not inflate the accumulated counter.
if ($isFileRequest && $segmented && isset($_SERVER['HTTP_RANGE'])) {
    fclose($file);
    if ($propChunks !== false) pt2vhf_serve_prop($requestedFile, $propSize, $propChunks);
    header('Location: ' . $redirectPath, true, 302);
    exit;
}

if (!flock($file, LOCK_EX)) {
    fclose($file);
    pt2vhf_error(503, 'Não foi possível bloquear a contagem');
}
$data = pt2vhf_read_document($file);
if (!isset($data['counts'][$product]) || !is_array($data['counts'][$product])) {
    $data['counts'][$product] = array();
}
$current = (int)($data['counts'][$product][$category] ?? ($product === 'prop' ? ($propHistoricalCounts[$category] ?? 0) : 0));
$data['counts'][$product][$category] = $current + 1;
// Quantos dos downloads vieram do atualizador dos apps (OTA), para conferência.
if ($isAppUpdater) {
    if (!isset($data['ota'][$product]) || !is_array($data['ota'][$product])) $data['ota'][$product] = array();
    $data['ota'][$product][$category] = (int)($data['ota'][$product][$category] ?? 0) + 1;
}
$data['updated'] = gmdate('c');
$output = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if (!is_string($output) || ftruncate($file, 0) === false || rewind($file) === false || fwrite($file, $output) !== strlen($output) || fflush($file) === false) {
    flock($file, LOCK_UN);
    fclose($file);
    pt2vhf_error(503, 'Não foi possível registrar a contagem');
}
flock($file, LOCK_UN);
fclose($file);
if ($isFileRequest && $isAprsUpdater && !$segmented) {
    // O atualizador do APRS não aceita redirecionamento: entrega o arquivo com HTTP 200 (já contado).
    $real = realpath(__DIR__ . $redirectPath);
    $size = $real === false ? false : filesize($real);
    if ($real === false || $size === false) pt2vhf_error(404, 'Arquivo indisponível');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($real) . '"');
    header('Content-Length: ' . $size);
    while (ob_get_level() > 0) ob_end_flush();
    readfile($real);
    exit;
}
if ($isFileRequest) {
    if ($segmented) {
        if ($propChunks !== false) pt2vhf_serve_prop($requestedFile, $propSize, $propChunks);
        header('Location: ' . $redirectPath, true, 302);
        exit;
    }
    header('Location: ' . $redirectPath . '?pt2vhf_raw=1', true, 302);
    exit;
}
http_response_code(204);
