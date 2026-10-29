<?php
/**
 * Integração PHP do QSL Manager: pacote remontado a partir das partes, contado uma vez por download
 * (site e OTA), HEAD/Range sem contagem e anúncio no update.php. Ambiente isolado em /tmp.
 */
declare(strict_types=1);

function check(bool $ok, string $message): void {
    if (!$ok) throw new RuntimeException($message);
}
// Catálogo real: todo arquivo publicado do produto qsl tem chave de contador aceita e passa pelo download.php.
$repo = dirname(__DIR__);
$catalog = json_decode((string)file_get_contents($repo . '/updates.json'), true);
$ht = (string)file_get_contents($repo . '/.htaccess');
$dl = (string)file_get_contents($repo . '/download.php');
check(strpos($ht, 'download.php?product=qsl&file=$1') !== false, '.htaccess: links diretos (OTA) do qsl passam pelo download.php');
check(strpos($ht, 'downloads/qsl-analyzer/.*\\.part') !== false, '.htaccess: partes avulsas bloqueadas');
foreach ($catalog['products']['qsl']['files'] ?? array() as $f) {
    check(isset($f['counterKey']) && strpos($dl, "'" . $f['counterKey'] . "'") !== false, 'counterKey aceito: ' . ($f['name'] ?? '?'));
    check(strpos((string)$f['url'], 'https://www.pt2vhf.com/downloads/qsl-analyzer/') === 0, 'URL oficial: ' . ($f['name'] ?? '?'));
    check(is_file($repo . '/downloads/qsl-analyzer/' . $f['name'] . '.parts.json'), 'Partes publicadas: ' . $f['name']);
}
$tmp = sys_get_temp_dir() . '/pt2vhf-qsl-test-' . getmypid();
$public = $tmp . '/public_html';
$downloads = $public . '/downloads/qsl-analyzer';
check(@mkdir($downloads, 0700, true) || is_dir($downloads), 'Criar fixture');
foreach (array('download.php', 'prop_parts.php', 'update.php') as $f) copy(__DIR__ . '/../' . $f, $public . '/' . $f);
$name = 'pt2vhf-qsl-analyzer_9.9.9_amd64.deb';
$contents = "!<arch>\n" . random_bytes(21000000);
$half = intdiv(strlen($contents), 2);
$parts = array();
foreach (array(substr($contents, 0, $half), substr($contents, $half)) as $i => $block) {
    $part = $name . '.part' . str_pad((string)$i, 2, '0', STR_PAD_LEFT);
    file_put_contents($downloads . '/' . $part, $block);
    $parts[] = array('name' => $part, 'size' => strlen($block), 'sha256' => hash('sha256', $block));
}
$sha = hash('sha256', $contents);
file_put_contents($downloads . '/' . $name . '.parts.json', json_encode(array('name' => $name, 'size' => strlen($contents), 'sha256' => $sha, 'parts' => $parts)));
file_put_contents($public . '/updates.json', json_encode(array('schema' => 1, 'products' => array('qsl' => array(
    'version' => '9.9.9', 'date' => '2026-10-29', 'page' => 'https://www.pt2vhf.com/qsl', 'notes' => 'teste',
    'files' => array(array('category' => 'linux-deb', 'counterKey' => 'linux-deb-x64', 'kind' => 'deb', 'platform' => 'linux-x64',
        'name' => $name, 'size' => strlen($contents), 'sha256' => $sha, 'url' => 'https://www.pt2vhf.com/downloads/qsl-analyzer/' . $name)))))));
$port = random_int(20000, 50000);
$base = 'http://127.0.0.1:' . $port;
$log = $tmp . '/server.log';
$proc = proc_open(escapeshellarg(PHP_BINARY) . ' -S 127.0.0.1:' . $port . ' -t ' . escapeshellarg($public), array(0 => array('pipe', 'r'), 1 => array('file', $log, 'w'), 2 => array('file', $log, 'a')), $pipes);
check(is_resource($proc), 'Servidor PHP não iniciou');
fclose($pipes[0]);
function request(string $url, string $method = 'GET', string $agent = 'teste', string $extra = ''): array {
    $ctx = stream_context_create(array('http' => array('method' => $method, 'ignore_errors' => true, 'follow_location' => 0, 'timeout' => 20,
        'header' => "User-Agent: " . $agent . "\r\n" . $extra)));
    $body = @file_get_contents($url, false, $ctx);
    $headers = $http_response_header ?? array();
    $status = preg_match('/^HTTP\/\S+\s+(\d{3})/', $headers[0] ?? '', $m) ? (int)$m[1] : 0;
    return array($status, (string)$body, $headers);
}
try {
    $status = 0;
    for ($i = 0; $i < 40 && $status !== 200; ++$i) { usleep(100000); [$status] = request($base . '/download.php?mode=stats'); }
    $count = function () use ($base) { [, $json] = request($base . '/download.php?mode=stats'); return json_decode($json, true)['counts']['qsl']['linux-deb-x64'] ?? null; };
    check($count() === 0, 'Contador inicial zero');
    $url = $base . '/download.php?product=qsl&file=' . rawurlencode($name);
    [$status, $body] = request($url);
    check($status === 200 && $body === $contents, 'Download remontado byte a byte');
    check($count() === 1, 'Download do site contado');
    [$status] = request($url, 'HEAD');
    check($status === 200 && $count() === 1, 'HEAD não contabilizado');
    [$status, $body] = request($url, 'GET', 'teste', "Range: bytes=10-19\r\n");
    check($status === 206 && $body === substr($contents, 10, 10) && $count() === 1, 'Range parcial sem contagem');
    [$status, $body] = request($url, 'GET', 'PT2VHF-QSL-Manager/0.4.0');
    check($status === 200 && $count() === 2, 'Download OTA (novo nome) contado uma vez');
    [, $json] = request($base . '/download.php?mode=stats');
    check((json_decode($json, true)['ota']['qsl']['linux-deb-x64'] ?? 0) >= 1, 'OTA registrado à parte');
    [$status, $body] = request($url, 'GET', 'PT2VHF-QSL-Analyzer/0.3.0');
    check($status === 200 && strlen($body) === strlen($contents) && $count() === 3, 'Download OTA (nome antigo) contado uma vez');
    [$status] = request($base . '/download.php?product=qsl&file=' . rawurlencode($name . '.part00'));
    check($status === 404 && $count() === 3, 'Parte avulsa não é servida');
    [$status, $json] = request($base . '/update.php?product=qsl&platform=linux-x64');
    $update = json_decode($json, true);
    check($status === 200 && ($update['status'] ?? '') === 'available' && ($update['version'] ?? '') === '9.9.9' && count($update['files']) === 1, 'update.php anuncia a versão');
    [, $json] = request($base . '/update.php?product=qsl&platform=windows-x64');
    check(json_decode($json, true)['status'] === 'unpublished', 'Plataforma sem pacote não é anunciada');
    echo "OK: QSL Manager remontado das partes, site +1, OTA +1, HEAD/Range +0, parte avulsa 404 e update.php.\n";
} finally {
    proc_terminate($proc);
    proc_close($proc);
    exec('rm -rf ' . escapeshellarg($tmp));
}
