<?php
/**
 * Integração: toda consulta ao update.php conta uma instalação ativa por dia
 * (visitante único por IP + User-Agent), sem gravar IP, User-Agent nem indicativo,
 * sem alterar a resposta, e o resumo sai em installs.php. Ambiente isolado em /tmp.
 */
declare(strict_types=1);

function check(bool $ok, string $message): void {
    if (!$ok) throw new RuntimeException($message);
}
$tmp = sys_get_temp_dir() . '/pt2vhf-installs-test-' . getmypid();
$public = $tmp . '/public_html';
check(@mkdir($public, 0700, true) || is_dir($public), 'Criar fixture');
foreach (array('update.php', 'prop_parts.php', 'stations_lib.php', 'stations_prefixes.php', 'installs_lib.php', 'installs.php', 'updates.json') as $f) {
    copy(__DIR__ . '/../' . $f, $public . '/' . $f);
}
$data = $tmp . '/pt2vhf-private-data/installs.json';
$port = random_int(20000, 50000);
$base = 'http://127.0.0.1:' . $port;
$log = $tmp . '/server.log';
$cmd = escapeshellarg(PHP_BINARY) . ' -S 127.0.0.1:' . $port . ' -t ' . escapeshellarg($public);
$proc = proc_open($cmd, array(0=>array('pipe','r'),1=>array('file',$log,'w'),2=>array('file',$log,'a')), $pipes);
check(is_resource($proc), 'Servidor PHP não iniciou');
fclose($pipes[0]);
function get(string $url, string $agent = 'PT2VHF-APRS-Client-Updater'): array {
    $ctx = stream_context_create(array('http' => array('ignore_errors' => true, 'follow_location' => 0, 'user_agent' => $agent)));
    $body = @file_get_contents($url, false, $ctx);
    $status = isset($http_response_header[0]) ? (int)explode(' ', $http_response_header[0])[1] : 0;
    return array($status, (string)$body);
}
try {
    for ($i = 0; $i < 50; $i++) { if (@fsockopen('127.0.0.1', $port)) break; usleep(100000); }
    [$s0, $first] = get($base . '/update.php?product=aprs');
    check($s0 === 200, 'update.php deveria responder 200');
    check(is_file($data), 'Contagem não foi criada');
    [, $again] = get($base . '/update.php?product=aprs&call=PY2XYZ');
    check($again === $first, 'A resposta não pode mudar com a contagem');
    get($base . '/update.php?product=aprs', 'outra-instalacao/1.0');
    get($base . '/update.php?product=sat');
    $stored = json_decode((string)file_get_contents($data), true);
    $today = gmdate('Y-m-d');
    check(($stored['daily']['aprs'][$today] ?? 0) === 2, 'Deveria contar 2 instalações aprs (mesmo IP+UA conta uma vez)');
    check(($stored['daily']['sat'][$today] ?? 0) === 1, 'Sat deveria contar 1');
    $raw = (string)file_get_contents($data);
    check(strpos($raw, '127.0.0.1') === false && strpos($raw, 'PT2VHF-APRS') === false && strpos($raw, 'PY2XYZ') === false,
        'IP, User-Agent e indicativo não podem ser gravados');
    // Virada do dia: hashes e chave antigos são descartados, o total do dia fica.
    $stored['day'] = '2000-01-01';
    $stored['daily']['aprs']['2000-01-01'] = 5;
    file_put_contents($data, json_encode($stored));
    get($base . '/update.php?product=aprs');
    $after = json_decode((string)file_get_contents($data), true);
    check($after['day'] === $today && $after['key'] !== $stored['key'], 'Chave deveria ser renovada no dia novo');
    check(($after['daily']['aprs'][$today] ?? 0) === 3, 'Após a virada, a mesma instalação conta de novo');
    check(($after['daily']['aprs']['2000-01-01'] ?? 0) === 5, 'Totais antigos ficam');
    [$s1, $summary] = get($base . '/installs.php?product=aprs');
    $json = json_decode($summary, true);
    check($s1 === 200 && ($json['today'] ?? null) === 3 && count($json['days'] ?? array()) === 30, 'Resumo inválido: ' . $summary);
    [$s2] = get($base . '/installs.php?product=xyz');
    check($s2 === 400, 'Produto inválido deveria dar 400');
    echo "INSTALLS_OK\n";
} finally {
    proc_terminate($proc);
    proc_close($proc);
    exec('rm -rf ' . escapeshellarg($tmp));
}
