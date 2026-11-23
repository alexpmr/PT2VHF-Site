<?php
/**
 * Integração: visit.php conta visitas sem gravar IP nem User-Agent, ignora robôs, o cookie de
 * exclusão e origens externas; /stats mostra os números sem indexação. Ambiente isolado em /tmp.
 */
declare(strict_types=1);

function check(bool $ok, string $message): void {
    if (!$ok) throw new RuntimeException($message);
}
$tmp = sys_get_temp_dir() . '/pt2vhf-visits-test-' . getmypid();
$public = $tmp . '/public_html';
check(@mkdir($public, 0700, true) || is_dir($public), 'Criar fixture');
foreach (array('visit.php', 'visits_lib.php', 'stats.php', 'installs_lib.php', 'updates.json') as $f) {
    copy(__DIR__ . '/../' . $f, $public . '/' . $f);
}
$private = $tmp . '/pt2vhf-private-data';
$port = random_int(20000, 50000);
$base = 'http://127.0.0.1:' . $port;
$log = $tmp . '/server.log';
$cmd = escapeshellarg(PHP_BINARY) . ' -S 127.0.0.1:' . $port . ' -t ' . escapeshellarg($public);
$proc = proc_open($cmd, array(0=>array('pipe','r'),1=>array('file',$log,'w'),2=>array('file',$log,'a')), $pipes);
check(is_resource($proc), 'Servidor PHP não iniciou');
fclose($pipes[0]);

const CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

function req(string $url, string $method = 'GET', array $post = array(), string $agent = CHROME, array $headers = array()): array {
    $h = array_merge(array('User-Agent: ' . $agent), $headers);
    $opts = array('method' => $method, 'ignore_errors' => true, 'follow_location' => 0, 'header' => '');
    if ($method === 'POST') {
        $h[] = 'Content-Type: application/x-www-form-urlencoded';
        $opts['content'] = http_build_query($post);
    }
    $opts['header'] = implode("\r\n", $h);
    $body = @file_get_contents($url, false, stream_context_create(array('http' => $opts)));
    $status = isset($http_response_header[0]) ? (int)explode(' ', $http_response_header[0])[1] : 0;
    return array($status, (string)$body, $http_response_header ?? array());
}
function hit(string $base, array $data, string $agent = CHROME, array $headers = array()): int {
    return req($base . '/visit.php', 'POST', $data, $agent, $headers)[0];
}

try {
    for ($i = 0; $i < 50; $i++) { if (@fsockopen('127.0.0.1', $port)) break; usleep(100000); }
    check(hit($base, array('p' => '/aprs', 'r' => 'www.google.com', 'l' => 'pt-BR', 'z' => 'America/Sao_Paulo')) === 204, 'visit.php deveria responder 204');
    hit($base, array('p' => '/aprs.html', 'r' => 'www.pt2vhf.com', 'l' => 'pt-BR', 'z' => 'America/Sao_Paulo'));
    hit($base, array('p' => '/', 'r' => '', 'l' => 'en-US', 'z' => 'America/New_York'), IPHONE);
    hit($base, array('p' => '/sat'), 'Googlebot/2.1 (+http://www.google.com/bot.html)');
    hit($base, array('p' => '/sat'), CHROME, array('Cookie: pt2vhf_nostats=1'));
    hit($base, array('p' => '/sat'), CHROME, array('Origin: https://example.com'));
    hit($base, array('p' => '/<script>', 'r' => 'evil"host', 'l' => 'x' . str_repeat('y', 50), 'z' => '../../etc'), CHROME . ' X');
    check(req($base . '/visit.php')[0] === 204, 'GET deveria ser ignorado com 204');

    $files = glob($private . '/visits-20*.json');
    check(count($files) === 1, 'Arquivo do mês não foi criado');
    $raw = file_get_contents($files[0]) . file_get_contents($private . '/visits-state.json');
    check(strpos($raw, '127.0.0.1') === false, 'IP não pode ser gravado');
    check(strpos($raw, 'Mozilla') === false && strpos($raw, 'Chrome/') === false, 'User-Agent não pode ser gravado');
    $month = json_decode(file_get_contents($files[0]), true);
    $day = $month['days'][gmdate('Y-m-d')];
    check($day['views'] === 4, 'Deveriam ser 4 páginas vistas, veio ' . $day['views']);
    check($day['visitors'] === 3, 'Deveriam ser 3 visitantes, veio ' . $day['visitors']);
    check(($day['pages']['/aprs'] ?? 0) === 2, '/aprs e /aprs.html são a mesma página');
    check(($day['pages']['/'] ?? 0) === 1, 'Página inicial');
    check(!isset($day['pages']['/sat']), 'Robô, cookie de exclusão e origem externa não contam');
    check(($day['refs']['google.com'] ?? 0) === 1 && ($day['refs']['(direto)'] ?? 0) === 2, 'Origens');
    check(($day['devices']['Celular'] ?? 0) === 1 && ($day['devices']['Computador'] ?? 0) === 2, 'Dispositivos');
    check(($day['os']['iOS'] ?? 0) === 1 && ($day['browsers']['Safari'] ?? 0) === 1, 'Sistema e navegador');
    check(($day['tz']['America/Sao_Paulo'] ?? 0) === 1 && ($day['tz']['(desconhecido)'] ?? 0) === 1, 'Fuso inválido vira desconhecido');
    check(!preg_match('/script|evil|etc/', file_get_contents($files[0])), 'Valores inválidos não podem ser gravados');

    check(($day['pages']['(outra)'] ?? 0) === 1, 'Caminho inválido vira (outra)');
    [$s, $body, $headers] = req($base . '/stats.php?d=7');
    check($s === 200 && strpos($body, 'páginas vistas') !== false, 'Painel deveria abrir');
    check(strpos($body, 'google.com') !== false && strpos($body, 'America/New_York') !== false, 'Painel deveria listar origem e fuso');
    check((bool)preg_grep('/^X-Robots-Tag: noindex/i', $headers), 'Painel não pode ser indexado');
    check(strpos($body, 'visit.js') === false, 'O painel não conta a si mesmo');
    echo "OK: visitas e painel /stats\n";
} finally {
    proc_terminate($proc);
    exec('rm -rf ' . escapeshellarg($tmp));
}
