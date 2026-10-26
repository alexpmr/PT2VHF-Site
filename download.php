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

// Downloads APRS: valida, registra e redireciona no servidor. HEAD não conta.
// POST de versões antigas do JS é ignorado para evitar duplicação com GET.
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
    ($isFileRequest && (!in_array($product, array('aprs', 'prop', 'mesh'), true) || preg_match('/^[a-zA-Z0-9_.-]+$/D', $requestedFile) !== 1)) ||
    (!$isFileRequest && !in_array($category, $allowed, true))) {
    fclose($file);
    pt2vhf_error(400, 'Projeto, categoria ou arquivo inválidos');
}
if (!$isFileRequest && $product === 'aprs') {
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
    if ($isFileRequest && $path !== '/downloads/' . ($product === 'prop' ? 'prop-tool' : ($product === 'mesh' ? 'mesh-analyzer' : 'aprs-client')) . '/' . $requestedFile) continue;
    $size = $entry['size'] ?? null;
    if ($product === 'prop') {
        $chunks = pt2vhf_prop_parts($entry);
        if ($chunks !== false) {
            $found = true;
            if ($isFileRequest) { $category = $key; $propChunks = $chunks; $propSize = $size; }
            break;
        }
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
    if ($product === 'prop') pt2vhf_serve_prop($requestedFile, $propSize, $propChunks, true);
    header('Location: ' . $redirectPath . '?pt2vhf_raw=1', true, 302);
    exit;
}
// Download continuation/range requests must not inflate the accumulated counter.
if ($isFileRequest && $product === 'prop' && isset($_SERVER['HTTP_RANGE'])) {
    fclose($file);
    pt2vhf_serve_prop($requestedFile, $propSize, $propChunks);
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
if ($isFileRequest) {
    if ($product === 'prop') pt2vhf_serve_prop($requestedFile, $propSize, $propChunks);
    header('Location: ' . $redirectPath . '?pt2vhf_raw=1', true, 302);
    exit;
}
http_response_code(204);
