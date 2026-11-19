<?php
/**
 * PT2VHF — cadastro de testadores do PT2VHF APRS Client no Google Play.
 *
 * Recebe por POST: email, call (opcional), lang (opcional), product (só "aprs-android"), website (armadilha anti-robô).
 * Grava em pt2vhf-private-data/testers-aprs-android.csv (fora de public_html, preservado em deploys),
 * uma linha por e-mail, no formato que a Play Console aceita para a lista de testadores
 * (primeira coluna = e-mail). E-mail repetido não é gravado de novo.
 * Nenhum IP é gravado: o limite por IP usa HMAC com chave diária, como em stations_lib.php.
 * Cadastro novo gera um aviso por e-mail ao mantenedor (que inclui o inscrito no Grupo do Google)
 * e uma confirmação ao inscrito com as instruções do teste no Google Play.
 * Resposta: redireciona de volta para a página com ?testers=ok|dup|erro#google-play,
 * ou JSON {status} quando o pedido aceita application/json.
 */
declare(strict_types=1);

const PT2VHF_TESTERS_PER_IP_DAY = 5;
const PT2VHF_TESTERS_MAX = 5000;
const PT2VHF_TESTERS_BCC = 'alexpmr@gmail.com';
const PT2VHF_TESTERS_FROM = 'PT2VHF <nao-responda@pt2vhf.com>';
// Grupo do Google ligado ao teste fechado; vazio = o mantenedor inclui o e-mail na lista da Play Console.
// Vazio: o mantenedor recebe um aviso por e-mail e inclui o inscrito no Grupo do Google manualmente.
const PT2VHF_TESTERS_GROUP_URL = '';
const PT2VHF_PLAY_OPTIN_URL = 'https://play.google.com/apps/testing/com.pt2vhf.aprs';
const PT2VHF_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.pt2vhf.aprs';

function pt2vhf_testers_mail(string $email, string $call, string $lang): bool {
    $hi = $call !== '' ? ' ' . $call : '';
    $group = PT2VHF_TESTERS_GROUP_URL;
    $optin = PT2VHF_PLAY_OPTIN_URL;
    $store = PT2VHF_PLAY_STORE_URL;
    if ($lang === 'pt') {
        $subject = 'PT2VHF APRS Client: como testar no Google Play';
        $step1 = $group !== ''
            ? "1. Entre no grupo de testadores, com a mesma conta Google do celular:\n   $group"
            : "1. Vamos incluir este e-mail na lista de testadores do Google Play (em até 1 dia).";
        $body = "Olá$hi,\n\nObrigado por se cadastrar para testar o PT2VHF APRS Client no Google Play.\n\n"
            . "Como participar:\n$step1\n"
            . "2. No celular Android, abra o link abaixo e toque em \"Tornar-se testador\":\n   $optin\n"
            . "3. Instale o app pela página da loja:\n   $store\n\n"
            . "Os links funcionam assim que o Google liberar o teste fechado (pode levar alguns dias após o cadastro).\n"
            . "Se você já usa o APK do site, a versão do Google Play instala por cima, sem perder as configurações.\n\n"
            . "Para o app ser publicado, o Google pede que os testadores fiquem no teste por pelo menos 14 dias.\n"
            . "Use o app normalmente e mande sugestões ou problemas respondendo a este e-mail.\n\n"
            . "73,\nPT2VHF\nhttps://www.pt2vhf.com/aprs-android\n\n"
            . "Você recebeu esta mensagem porque cadastrou este e-mail em www.pt2vhf.com. Para sair da lista, responda pedindo a exclusão.\n";
    } elseif ($lang === 'es') {
        $subject = 'PT2VHF APRS Client: cómo probar en Google Play';
        $step1 = $group !== ''
            ? "1. Únete al grupo de testers con la misma cuenta de Google del teléfono:\n   $group"
            : "1. Incluiremos este correo en la lista de testers de Google Play (en hasta 1 día).";
        $body = "Hola$hi,\n\nGracias por registrarte para probar PT2VHF APRS Client en Google Play.\n\n"
            . "Cómo participar:\n$step1\n"
            . "2. En el teléfono Android, abre el enlace y toca \"Convertirse en tester\":\n   $optin\n"
            . "3. Instala la app desde la página de la tienda:\n   $store\n\n"
            . "Los enlaces funcionan cuando Google habilite la prueba cerrada (puede tardar unos días).\n"
            . "Si ya usas el APK del sitio, la versión de Google Play se instala encima sin perder la configuración.\n\n"
            . "Para publicar la app, Google pide que los testers permanezcan en la prueba al menos 14 días.\n"
            . "Usa la app con normalidad y envía sugerencias o problemas respondiendo a este correo.\n\n"
            . "73,\nPT2VHF\nhttps://www.pt2vhf.com/aprs-android\n\n"
            . "Recibiste este mensaje porque registraste este correo en www.pt2vhf.com. Para salir de la lista, responde pidiendo la baja.\n";
    } else {
        $subject = 'PT2VHF APRS Client: how to test on Google Play';
        $step1 = $group !== ''
            ? "1. Join the testers group with the same Google account you use on your phone:\n   $group"
            : "1. We will add this e-mail to the Google Play testers list (within 1 day).";
        $body = "Hello$hi,\n\nThank you for signing up to test PT2VHF APRS Client on Google Play.\n\n"
            . "How to join:\n$step1\n"
            . "2. On your Android phone, open the link below and tap \"Become a tester\":\n   $optin\n"
            . "3. Install the app from the store page:\n   $store\n\n"
            . "The links work once Google opens the closed test (it may take a few days after sign-up).\n"
            . "If you already use the APK from the website, the Google Play version installs over it and keeps your settings.\n\n"
            . "To publish the app, Google asks testers to stay in the test for at least 14 days.\n"
            . "Use the app normally and send suggestions or problems by replying to this e-mail.\n\n"
            . "73,\nPT2VHF\nhttps://www.pt2vhf.com/aprs-android\n\n"
            . "You received this message because this e-mail was registered at www.pt2vhf.com. To leave the list, reply asking for removal.\n";
    }
    $headers = implode("\r\n", array(
        'From: ' . PT2VHF_TESTERS_FROM,
        'Reply-To: ' . PT2VHF_TESTERS_BCC,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ));
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    return @mail($email, $encodedSubject, $body, $headers, '-fnao-responda@pt2vhf.com');
}

/** Avisa o mantenedor de cada inscrição nova, para ele incluir o e-mail no Grupo do Google. */
function pt2vhf_testers_notify_admin(string $email, string $call, string $lang): bool {
    $subject = 'Novo testador APRS Client: ' . $email;
    $body = "Nova inscrição para o teste do PT2VHF APRS Client no Google Play.\n\n"
        . "E-mail: $email\n"
        . 'Indicativo: ' . ($call !== '' ? $call : '(não informado)') . "\n"
        . "Idioma: $lang\n"
        . 'Data (UTC): ' . gmdate('Y-m-d H:i') . "\n\n"
        . "Para incluir no grupo: https://groups.google.com/g/pt2vhf-aprs-testers/members\n"
        . "(Adicionar participantes -> colar o e-mail -> marcar \"Adicionar participantes diretamente\").\n";
    $headers = implode("\r\n", array(
        'From: ' . PT2VHF_TESTERS_FROM,
        'Reply-To: ' . $email,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ));
    return @mail(PT2VHF_TESTERS_BCC, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-fnao-responda@pt2vhf.com');
}

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
$lang = strtolower(substr(trim((string)($_POST['lang'] ?? 'pt')), 0, 2));

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
pt2vhf_testers_notify_admin($email, $call, $lang); // aviso ao mantenedor para incluir no grupo
pt2vhf_testers_mail($email, $call, $lang); // confirmação ao inscrito; falha de envio não desfaz o cadastro
pt2vhf_testers_reply('ok');
