<?php
/**
 * PT2VHF — contagem acumulada de solicitações de download por projeto e
 * categoria. Independente do número da versão; sem cookies, endereços IP
 * ou identificadores pessoais. Requer PHP 7.4+ na hospedagem Hostinger.
 *
 * Arquivo de dados fora de public_html, preservado em novos deploys.
 */
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Robots-Tag: noindex, nofollow');

$allowed = array(
    'windows-installer', 'windows-portable', 'linux-deb', 'linux-targz', 'linux-appimage', 'macos',
    'win-setup-x64','win-portable-x64','win-setup-arm64','win-portable-arm64',
    'linux-appimage-x64','linux-appimage-arm64','linux-deb-x64','linux-deb-arm64',
    'linux-tar-x64','linux-tar-arm64','mac-dmg-x64','mac-dmg-arm64'
);
$products = array('aprs', 'prop', 'mesh', 'sat', 'prog');
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
                $data['counts'][$product][$category] = 0;
            }
        }
    }
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || ($_POST['action'] ?? '') !== 'count') {
    fclose($file);
    pt2vhf_error(405, 'Método ou ação inválidos');
}
$product = (string)($_POST['product'] ?? '');
$category = (string)($_POST['category'] ?? '');
if (!in_array($product, $products, true) || !in_array($category, $allowed, true)) {
    fclose($file);
    pt2vhf_error(400, 'Projeto ou categoria inválidos');
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
foreach ($files as $entry) {
    if ((($entry['counterKey'] ?? null) ?: ($entry['category'] ?? '')) !== $category) continue;
    $url = (string)($entry['url'] ?? '');
    $path = (string)(parse_url($url, PHP_URL_PATH) ?: '');
    $host = strtolower((string)(parse_url($url, PHP_URL_HOST) ?: ''));
    if ($host !== 'www.pt2vhf.com' || strpos($path, '/downloads/') !== 0) continue;
    $root = realpath(__DIR__ . '/downloads');
    $target = realpath(__DIR__ . $path);
    if ($root !== false && $target !== false && strncmp($target, $root . DIRECTORY_SEPARATOR, strlen($root) + 1) === 0 && is_file($target)) {
        $found = true;
        break;
    }
}
if (!$found) {
    fclose($file);
    pt2vhf_error(404, 'Arquivo da categoria não está disponível');
}

if (!flock($file, LOCK_EX)) {
    fclose($file);
    pt2vhf_error(503, 'Não foi possível bloquear a contagem');
}
$data = pt2vhf_read_document($file);
if (!isset($data['counts'][$product]) || !is_array($data['counts'][$product])) {
    $data['counts'][$product] = array();
}
$current = (int)($data['counts'][$product][$category] ?? 0);
$data['counts'][$product][$category] = $current + 1;
$data['updated'] = gmdate('c');
$output = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if (!is_string($output) || ftruncate($file, 0) === false || rewind($file) === false || fwrite($file, $output) !== strlen($output) || fflush($file) === false) {
    flock($file, LOCK_UN);
    fclose($file);
    pt2vhf_error(503, 'Não foi possível registrar a contagem');
}
flock($file, LOCK_UN);
fclose($file);
http_response_code(204);
