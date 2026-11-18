<?php
/**
 * PT2VHF — cadastro de testadores do PT2VHF APRS Client no Google Play.
 *
 * Recebe por POST: email, call (opcional), product (só "aprs-android"), website (armadilha anti-robô).
 * Grava em pt2vhf-private-data/testers-aprs-android.csv (fora de public_html, preservado em deploys),
 * uma linha por e-mail, no formato que a Play Console aceita para a lista de testadores
 * (primeira coluna = e-mail). E-mail repetido não é gravado de novo.
 * Nenhum IP é gravado: o limite por IP usa HMAC com chave diária, como em stations_lib.php.
 * Resposta: redireciona de volta para a página com ?testers=ok|dup|erro#google-play,
 * ou JSON {status} quando o pedido aceita application/json.
 */
declare(strict_types=1);

const PT2VHF_TESTERS_PER_IP_DAY = 5;
const PT2VHF_TESTERS_MAX = 5000;

function pt2vhf_testers_reply(string $status): void {
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    if (strpos($accept, 'application/json') !== false) {
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode(array('status' => $status));
    } else {
        header('Location: /aprs-android?testers=' . rawurlencode($status) . '#google-play', true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit;
}
if (($_POST['product'] ?? 'aprs-android') !== 'aprs-android') pt2vhf_testers_reply('erro');
if (trim((string)($_POST['website'] ?? '')) !== '') pt2vhf_testers_reply('ok'); // robô: finge sucesso

$email = strtolower(trim((string)($_POST['email'] ?? '')));
if ($email === '' || strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) pt2vhf_testers_reply('erro');
$call = strtoupper(trim((string)($_POST['call'] ?? '')));
if ($call !== '' && !preg_match('~^[A-Z0-9/]{3,16}(-[0-9]{1,2})?$~D', $call)) $call = '';

$dir = dirname(__DIR__) . '/pt2vhf-private-data';
if (!is_dir($dir) && !@mkdir($dir, 0700, true)) pt2vhf_testers_reply('erro');
$path = $dir . '/testers-aprs-android.csv';
$limitsPath = $dir . '/testers-limits.json';

$fh = @fopen($path, 'c+');
if (!$fh) pt2vhf_testers_reply('erro');
try {
    if (!flock($fh, LOCK_EX)) pt2vhf_testers_reply('erro');

    // Limite por IP (HMAC com chave que muda a cada dia UTC; nada de IP em claro).
    $today = gmdate('Y-m-d');
    $limits = json_decode((string)@file_get_contents($limitsPath), true);
    if (!is_array($limits) || ($limits['day'] ?? '') !== $today) {
        $limits = array('day' => $today, 'key' => bin2hex(random_bytes(16)), 'ip' => array());
    }
    $ipKey = substr(hash_hmac('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? ''), $limits['key']), 0, 16);
    if (($limits['ip'][$ipKey] ?? 0) >= PT2VHF_TESTERS_PER_IP_DAY) pt2vhf_testers_reply('erro');

    $rows = array();
    $contents = stream_get_contents($fh);
    foreach (preg_split('/\r?\n/', (string)$contents) as $line) {
        $first = strtolower(trim(explode(',', $line)[0]));
        if ($first !== '') $rows[$first] = true;
    }
    if (isset($rows[$email])) pt2vhf_testers_reply('dup');
    if (count($rows) >= PT2VHF_TESTERS_MAX) pt2vhf_testers_reply('erro');

    fseek($fh, 0, SEEK_END);
    // Formato aceito pela Play Console: e-mail na primeira coluna. Indicativo e data ajudam o mantenedor.
    fwrite($fh, $email . ',' . $call . ',' . gmdate('Y-m-d\TH:i:s\Z') . "\n");
    fflush($fh);

    $limits['ip'][$ipKey] = ($limits['ip'][$ipKey] ?? 0) + 1;
    @file_put_contents($limitsPath, json_encode($limits), LOCK_EX);
} finally {
    flock($fh, LOCK_UN);
    fclose($fh);
}
pt2vhf_testers_reply('ok');
