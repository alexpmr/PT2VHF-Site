<?php
/**
 * Integração PHP: solicitações reais aumentam a contagem uma única vez.
 * Ambiente totalmente isolado em /tmp; não altera contadores de produção.
 */
declare(strict_types=1);

function check(bool $ok, string $message): void {
    if (!$ok) throw new RuntimeException($message);
}
$tmp = sys_get_temp_dir() . '/pt2vhf-counter-test-' . getmypid();
$public = $tmp . '/public_html';
$downloads = $public . '/downloads/aprs-client';
check(@mkdir($downloads, 0700, true) || is_dir($downloads), 'Criar fixture');
copy(__DIR__ . '/../download.php', $public . '/download.php');
$name = 'PT2VHF_APRS_Client_Setup_x64_v99.exe';
$contents = "MZ-example-binary";
file_put_contents($downloads . '/' . $name, $contents);
$manifest = array(
    'schema' => 1,
    'products' => array(
        'aprs' => array('files' => array(array(
            'name' => $name, 'size' => strlen($contents),
            'category' => 'windows-installer',
            'counterKey' => 'win-setup-x64',
            'url' => 'https://www.pt2vhf.com/downloads/aprs-client/' . $name
        )))
    )
);
file_put_contents($public . '/updates.json', json_encode($manifest));
$port = random_int(20000, 50000);
$base = 'http://127.0.0.1:' . $port;
$log = $tmp . '/server.log';
$cmd = escapeshellarg(PHP_BINARY) . ' -S 127.0.0.1:' . $port . ' -t ' . escapeshellarg($public);
$proc = proc_open($cmd, array(
    0=>array('pipe','r'),1=>array('file',$log,'w'),2=>array('file',$log,'a')
), $pipes);
check(is_resource($proc), 'Servidor PHP não iniciou');
fclose($pipes[0]);

function request(string $url, string $method = 'GET', string $body = ''): array {
    $opts = array('http'=>array(
        'method'=>$method, 'content'=>$body, 'ignore_errors'=>true, 'follow_location'=>0,
        'timeout'=>3, 'header'=>"Content-Type: application/x-www-form-urlencoded\r\n"
    ));
    $result = @file_get_contents($url, false, stream_context_create($opts));
    $headers = $http_response_header ?? array();
    $status = preg_match('/^HTTP\/\S+\s+(\d{3})/', $headers[0] ?? '', $m) ? (int)$m[1] : 0;
    return array($status, (string)$result, $headers);
}
try {
    $status = 0;
    for ($i=0; $i<40; ++$i) {
        usleep(100000);
        [$status] = request($base . '/download.php?mode=stats');
        if ($status === 200) break;
    }
    check($status === 200, 'Estatísticas HTTP 200');
    $getStats = function () use ($base) {
        [$status,$json] = request($base . '/download.php?mode=stats');
        check($status === 200, 'Estatísticas disponíveis');
        return json_decode($json, true)['counts']['aprs']['win-setup-x64'] ?? null;
    };
    check($getStats() === 0, 'Contador inicial zero');
    $url = $base . '/download.php?product=aprs&file=' . rawurlencode($name);
    [$status,,$headers] = request($url);
    check($status === 302, 'GET retorna 302');
    check(in_array('Location: /downloads/aprs-client/' . $name . '?pt2vhf_raw=1', $headers, true), 'Redirecionamento seguro');
    check($getStats() === 1, 'GET contabilizado');
    [$status] = request($url, 'HEAD');
    check($status === 302 && $getStats() === 1, 'HEAD não contabilizado');
    [$status] = request($base . '/download.php', 'POST', 'action=count&product=aprs&category=win-setup-x64');
    check($status === 204 && $getStats() === 1, 'POST legado não duplica');
    [$status] = request($base . '/download.php?product=aprs&file=inexistente.exe');
    check($status === 404 && $getStats() === 1, 'Arquivo inválido não contabilizado');
    [$status] = request($url);
    check($status === 302 && $getStats() === 2, 'Contagem cumulativa');
    echo "OK: GET +1, HEAD +0, POST legado +0, arquivo inexistente +0.\n";
} finally {
    proc_terminate($proc);
    proc_close($proc);
    @unlink($log);
    @unlink($downloads . '/' . $name);
    @unlink($public . '/updates.json');
    @unlink($public . '/download.php');
    @unlink($tmp . '/pt2vhf-private-data/downloads.json');
    @rmdir($tmp . '/pt2vhf-private-data');
    @rmdir($downloads);
    @rmdir($public . '/downloads');
    @rmdir($public);
    @rmdir($tmp);
}
