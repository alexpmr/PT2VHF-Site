<?php
/**
 * Integração: indicativo enviado na consulta de versão (update.php?call=)
 * é registrado sem alterar a resposta, uma vez por dia, sem guardar IP,
 * e aparece no resumo público stations.php. Ambiente isolado em /tmp.
 */
declare(strict_types=1);

function check(bool $ok, string $message): void {
    if (!$ok) throw new RuntimeException($message);
}
$tmp = sys_get_temp_dir() . '/pt2vhf-stations-test-' . getmypid();
$public = $tmp . '/public_html';
check(@mkdir($public, 0700, true) || is_dir($public), 'Criar fixture');
foreach (array('update.php', 'prop_parts.php', 'stations_lib.php', 'stations_prefixes.php', 'stations.php', 'updates.json') as $f) {
    copy(__DIR__ . '/../' . $f, $public . '/' . $f);
}
$data = $tmp . '/pt2vhf-private-data/stations.json';
$port = random_int(20000, 50000);
$base = 'http://127.0.0.1:' . $port;
$log = $tmp . '/server.log';
$cmd = escapeshellarg(PHP_BINARY) . ' -S 127.0.0.1:' . $port . ' -t ' . escapeshellarg($public);
$proc = proc_open($cmd, array(0=>array('pipe','r'),1=>array('file',$log,'w'),2=>array('file',$log,'a')), $pipes);
check(is_resource($proc), 'Servidor PHP não iniciou');
fclose($pipes[0]);
function get(string $url): array {
    $ctx = stream_context_create(array('http' => array('ignore_errors' => true, 'follow_location' => 0)));
    $body = @file_get_contents($url, false, $ctx);
    $status = isset($http_response_header[0]) ? (int)explode(' ', $http_response_header[0])[1] : 0;
    return array($status, (string)$body);
}
try {
    for ($i = 0; $i < 50; $i++) { if (@fsockopen('127.0.0.1', $port)) break; usleep(100000); }
    [$s0, $plain] = get($base . '/update.php?product=sat');
    check($s0 === 200, 'update.php sem call deveria responder 200');
    [$s1, $withCall] = get($base . '/update.php?product=sat&call=py2xyz');
    check($s1 === 200 && $withCall === $plain, 'A resposta com call deve ser idêntica à sem call');
    check(is_file($data), 'Registro não foi criado');
    $first = file_get_contents($data);
    get($base . '/update.php?product=sat&call=PY2XYZ');
    check(file_get_contents($data) === $first, 'Segunda consulta no mesmo dia não deve regravar');
    check(strpos($first, '127.0.0.1') === false, 'IP não pode ser gravado');

    get($base . '/update.php?product=sat&call=' . rawurlencode('CT/PY2ABC/P'));
    foreach (array('N0CALL', '<script>', 'PY2XYZ/AB/CD/EF', str_repeat('A1', 9), 'ABCDEF') as $bad) {
        [$sb, $bodyBad] = get($base . '/update.php?product=sat&call=' . rawurlencode($bad));
        check($sb === 200 && $bodyBad === $plain, 'Indicativo inválido não pode alterar a resposta: ' . $bad);
    }
    get($base . '/update.php?product=mesh&call=PY2MESH'); // produto sem registro

    [$ss, $summary] = get($base . '/stations.php?product=sat');
    $j = json_decode($summary, true);
    check($ss === 200 && $j['schema'] === 1 && $j['total'] === 2, 'Resumo deveria ter 2 estações: ' . $summary);
    $byCc = array();
    foreach ($j['countries'] as $c) $byCc[$c['cc']] = $c['calls'];
    check(($byCc['BR'] ?? null) === array('PY2XYZ'), 'PY2XYZ deveria estar no Brasil');
    check(($byCc['PT'] ?? null) === array('CT/PY2ABC/P'), 'CT/PY2ABC/P deveria estar em Portugal');
    check(strpos($summary, 'MESH') === false && strpos($summary, 'N0CALL') === false, 'Registro indevido no resumo');
    [$sx] = get($base . '/stations.php?product=xyz');
    check($sx === 400, 'Produto inválido no resumo deveria dar 400');

    // Prop Tool: mesmo registro, lista separada por produto, resposta do update.php inalterada.
    [$sp0, $propPlain] = get($base . '/update.php?product=prop');
    [$sp1, $propCall] = get($base . '/update.php?product=prop&call=pu2abc');
    check($sp0 === 200 && $sp1 === 200 && $propCall === $propPlain, 'Resposta do Prop Tool com call deve ser idêntica');
    get($base . '/update.php?product=prop&call=' . rawurlencode('EA/PY2XYZ'));
    $jp = json_decode(get($base . '/stations.php?product=prop')[1], true);
    $propCc = array();
    foreach ($jp['countries'] as $c) $propCc[$c['cc']] = $c['calls'];
    check($jp['product'] === 'prop' && $jp['total'] === 2, 'Prop Tool deveria ter 2 estações: ' . json_encode($jp));
    check(($propCc['BR'] ?? null) === array('PU2ABC') && ($propCc['ES'] ?? null) === array('EA/PY2XYZ'), 'Países do Prop Tool');
    check(strpos(json_encode($jp), 'PY2OLD') === false, 'Listas de produtos não podem se misturar');
    $doc = json_decode(file_get_contents($data), true);
    check(!isset($doc['products']['prop']['PU2ABC']['ip']) && strpos(file_get_contents($data), '127.0.0.1') === false, 'Sem IP no registro do Prop Tool');

    // Limite de indicativos novos por IP por dia, comum aos produtos (4 já usados: 2 SAT + 2 Prop).
    for ($i = 1; $i <= 12; $i++) get($base . '/update.php?product=sat&call=PY' . $i . 'LIM');
    $j = json_decode(get($base . '/stations.php?product=sat')[1], true);
    check($j['total'] === 8, 'Limite por IP deveria parar em 10 novos/dia (8 no SAT), total ' . $j['total']);
    // Estação já conhecida continua sendo atualizada mesmo acima do limite.
    $doc = json_decode(file_get_contents($data), true);
    $doc['products']['sat']['PY2XYZ']['last'] = '2026-01-01';
    file_put_contents($data, json_encode($doc));
    get($base . '/update.php?product=sat&call=PY2XYZ');
    $doc = json_decode(file_get_contents($data), true);
    check($doc['products']['sat']['PY2XYZ']['last'] === gmdate('Y-m-d'), 'last deveria ser atualizado');

    // Registro antigo (5 anos sem consulta) nunca expira nem some do resumo.
    $doc = json_decode(file_get_contents($data), true);
    $doc['products']['sat']['PY2OLD'] = array('cc' => 'BR', 'entity' => 'Brazil', 'first' => '2020-01-01', 'last' => '2020-01-01');
    file_put_contents($data, json_encode($doc));
    get($base . '/update.php?product=sat&call=PY2XYZ');
    $doc['products']['sat']['PY2XYZ']['last'] = '2026-01-02';
    file_put_contents($data, json_encode($doc));
    get($base . '/update.php?product=sat&call=PY2XYZ'); // força uma gravação
    check(isset(json_decode(file_get_contents($data), true)['products']['sat']['PY2OLD']), 'Registro antigo não pode ser apagado');
    check(strpos(get($base . '/stations.php?product=sat')[1], 'PY2OLD') !== false, 'Registro antigo deve aparecer no resumo');

    // Arquivo corrompido: nunca sobrescrever, resposta inalterada.
    file_put_contents($data, '{corrompido');
    [$sc, $bodyC] = get($base . '/update.php?product=sat&call=PY9NEW');
    check($sc === 200 && $bodyC === $plain && file_get_contents($data) === '{corrompido', 'Arquivo inválido não pode ser sobrescrito');
    check(get($base . '/stations.php?product=sat')[0] === 503, 'Resumo com arquivo inválido deveria dar 503');
    echo "Registro de estações: OK\n";
} finally {
    proc_terminate($proc);
    proc_close($proc);
    exec('rm -rf ' . escapeshellarg($tmp));
}
