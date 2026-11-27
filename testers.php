<?php
/**
 * PT2VHF — cadastro de testadores dos apps Android no teste fechado do Google Play
 * (PT2VHF APRS Client, PT2VHF Speed Alert e PT2VHF Sonde Finder).
 *
 * Recebe por POST: email, call (opcional), lang (opcional), product ("aprs-android", "speed" ou "sonde"; sem product =
 * aprs-android, como nas versões anteriores) e website (armadilha anti-robô).
 * Grava em pt2vhf-private-data/testers-<product>.csv (fora de public_html, preservado em deploys), uma linha por
 * e-mail, no formato que a Play Console aceita para a lista de testadores (primeira coluna = e-mail).
 * E-mail repetido no mesmo app não é gravado de novo.
 * Nenhum IP é gravado: o limite por IP usa HMAC com chave diária, como em stations_lib.php.
 * Cadastro novo gera um aviso por e-mail ao mantenedor (que inclui o inscrito na lista de testadores da Play Console;
 * pendentes em testers_export.php?app=<product>) e uma confirmação ao inscrito com as instruções do teste.
 * Resposta: redireciona de volta para a página do app com ?testers=ok|dup|erro#<âncora>,
 * ou JSON {status} quando o pedido aceita application/json.
 */
declare(strict_types=1);
require_once __DIR__ . '/mail_lib.php';

const PT2VHF_TESTERS_PER_IP_DAY = 5;
const PT2VHF_TESTERS_MAX = 5000;
const PT2VHF_TESTERS_BCC = 'alexpmr@gmail.com';
const PT2VHF_TESTERS_APPS = array(
    'aprs-android' => array('name' => 'PT2VHF APRS Client', 'package' => 'com.pt2vhf.aprs', 'csv' => 'testers-aprs-android.csv',
        'page' => '/aprs-android', 'anchor' => 'google-play', 'apk_over' => true),
    'speed' => array('name' => 'PT2VHF Speed Alert', 'package' => 'com.pt2vhf.speedalert', 'csv' => 'testers-speed.csv',
        'page' => '/speed', 'anchor' => 'testadores', 'apk_over' => false),
    // Sonde Finder: teste fechado ainda em análise no Google Play. A inscrição recebe a confirmação de recebimento
    // com o APK provisório ('apk'); as instruções do Play seguem depois ('instructions' => false até a aprovação).
    'sonde' => array('name' => 'PT2VHF Sonde Finder', 'package' => 'com.pt2vhf.sondefinder', 'csv' => 'testers-sonde.csv',
        'page' => '/sonde', 'anchor' => 'testadores', 'apk_over' => false, 'instructions' => false,
        'apk' => 'https://www.pt2vhf.com/downloads/sonde-finder/PT2VHF-Sonde-Finder-v1.9.0.apk'),
);

/** Confirmação de recebimento, sem links do Play (teste ainda não liberado); com 'apk', inclui o APK provisório. */
function pt2vhf_testers_received_mail(array $app, string $email, string $lang): bool {
    $name = $app['name'];
    $page = 'https://www.pt2vhf.com' . $app['page'];
    $apkUrl = $app['apk'] ?? '';
    if ($lang === 'pt') {
        $subject = "$name: cadastro recebido";
        $apk = $apkUrl === '' ? '' : "Enquanto isso, você já pode usar o app pelo APK provisório:\n   $apkUrl\n\n"
            . "Por que um APK? O teste fechado do Google Play ainda está em análise pelo Google, o que pode levar alguns dias. "
            . "O APK é a mesma versão, para você não precisar esperar.\n\n"
            . "Como instalar:\n"
            . "1. No celular Android, abra o link acima e baixe o arquivo.\n"
            . "2. Toque no arquivo baixado (na notificação ou em Arquivos > Downloads).\n"
            . "3. Se o Android pedir, permita instalar apps desta fonte (navegador ou Arquivos) e toque em Instalar.\n"
            . "4. Se o Play Protect avisar que o app é desconhecido, toque em \"Mais detalhes\" > \"Instalar mesmo assim\".\n\n"
            . "Quando o teste do Google Play for liberado, desinstale o APK e instale pela Play Store, para receber as atualizações pela loja.\n\n";
        $body = "Olá,\n\nRecebemos o seu cadastro para testar o $name no Google Play.\n\n"
            . "Assim que este e-mail for incluído no teste fechado, você recebe outra mensagem com o link e os passos para instalar.\n\n"
            . $apk
            . "73,\nPT2VHF\n$page\n\n"
            . "Você recebeu esta mensagem porque cadastrou este e-mail em www.pt2vhf.com. Para sair da lista, responda pedindo a exclusão.\n";
    } elseif ($lang === 'es') {
        $subject = "$name: registro recibido";
        $body = "Hola,\n\nRecibimos tu registro para probar $name en Google Play.\n\n"
            . "Cuando este correo se incluya en la prueba cerrada, recibirás otro mensaje con el enlace y los pasos para instalar.\n\n"
            . ($apkUrl === '' ? '' : "Mientras tanto, ya puedes usar la app con el APK provisional:\n   $apkUrl\n\n"
            . "¿Por qué un APK? Google todavía está revisando la prueba cerrada de Google Play, lo que puede tardar algunos días. "
            . "El APK es la misma versión, para que no tengas que esperar.\n\n"
            . "Cómo instalar:\n"
            . "1. En el teléfono Android, abre el enlace y descarga el archivo.\n"
            . "2. Toca el archivo descargado (en la notificación o en Archivos > Descargas).\n"
            . "3. Si Android lo pide, permite instalar apps de esta fuente (navegador o Archivos) y toca Instalar.\n"
            . "4. Si Play Protect avisa que la app es desconocida, toca \"Más detalles\" > \"Instalar de todos modos\".\n\n"
            . "Cuando se libere la prueba de Google Play, desinstala el APK e instala desde Play Store para recibir las actualizaciones de la tienda.\n\n")
            . "73,\nPT2VHF\n$page\n\n"
            . "Recibiste este mensaje porque registraste este correo en www.pt2vhf.com. Para salir de la lista, responde pidiendo la baja.\n";
    } else {
        $subject = "$name: sign-up received";
        $body = "Hello,\n\nWe received your sign-up to test $name on Google Play.\n\n"
            . "As soon as this e-mail is added to the closed test, you will get another message with the link and the steps to install.\n\n"
            . ($apkUrl === '' ? '' : "Meanwhile, you can already use the app with the temporary APK:\n   $apkUrl\n\n"
            . "Why an APK? Google is still reviewing the Google Play closed test, which can take a few days. "
            . "The APK is the same version, so you don't have to wait.\n\n"
            . "How to install:\n"
            . "1. On your Android phone, open the link above and download the file.\n"
            . "2. Tap the downloaded file (in the notification or in Files > Downloads).\n"
            . "3. If Android asks, allow installing apps from this source (browser or Files) and tap Install.\n"
            . "4. If Play Protect warns that the app is unknown, tap \"More details\" > \"Install anyway\".\n\n"
            . "Once the Google Play test opens, uninstall the APK and install from Play Store to get updates from the store.\n\n")
            . "73,\nPT2VHF\n$page\n\n"
            . "You received this message because this e-mail was registered at www.pt2vhf.com. To leave the list, reply asking for removal.\n";
    }
    return pt2vhf_send_mail($email, $subject, $body, PT2VHF_TESTERS_BCC, 'PT2VHF');
}

function pt2vhf_testers_mail(array $app, string $email, string $call, string $lang): bool {
    $hi = $call !== '' ? ' ' . $call : '';
    $name = $app['name'];
    $hl = ['pt' => 'pt-BR', 'en' => 'en', 'es' => 'es', 'fr' => 'fr', 'de' => 'de', 'it' => 'it', 'zh' => 'zh-CN'];
    $optin = 'https://play.google.com/apps/testing/' . $app['package'] . '?hl=' . ($hl[$lang] ?? 'en');
    $store = 'https://play.google.com/store/apps/details?id=' . $app['package'];
    $page = 'https://www.pt2vhf.com' . $app['page'];
    if ($lang === 'pt') {
        $subject = "$name: como testar no Google Play";
        $apk = $app['apk_over'] ? "Se você já usa o APK do site, a versão do Google Play instala por cima, sem perder as configurações.\n\n"
                                : "Se você instalou o APK do site, talvez seja preciso desinstalá-lo antes de instalar pela Play Store.\n\n";
        $body = "Olá$hi,\n\nObrigado por se cadastrar para testar o $name no Google Play.\n\n"
            . "Como participar:\n"
            . "1. Vamos incluir este e-mail na lista de testadores do Google Play (em até 1 dia).\n"
            . "2. No celular Android, abra o link abaixo e toque em \"Tornar-se testador\":\n   $optin\n"
            . "3. Instale o app pela página da loja:\n   $store\n\n"
            . "Os links funcionam assim que o seu e-mail estiver na lista de testadores.\n" . $apk
            . "Para o app ser publicado, o Google pede que os testadores fiquem no teste por pelo menos 14 dias.\n"
            . "Use o app normalmente e mande sugestões ou problemas respondendo a este e-mail.\n\n"
            . "73,\nPT2VHF\n$page\n\n"
            . "Você recebeu esta mensagem porque cadastrou este e-mail em www.pt2vhf.com. Para sair da lista, responda pedindo a exclusão.\n";
    } elseif ($lang === 'es') {
        $subject = "$name: cómo probar en Google Play";
        $apk = $app['apk_over'] ? "Si ya usas el APK del sitio, la versión de Google Play se instala encima sin perder la configuración.\n\n"
                                : "Si instalaste el APK del sitio, quizá debas desinstalarlo antes de instalar desde Play Store.\n\n";
        $body = "Hola$hi,\n\nGracias por registrarte para probar $name en Google Play.\n\n"
            . "Cómo participar:\n"
            . "1. Incluiremos este correo en la lista de testers de Google Play (en hasta 1 día).\n"
            . "2. En el teléfono Android, abre el enlace y toca \"Convertirse en tester\":\n   $optin\n"
            . "3. Instala la app desde la página de la tienda:\n   $store\n\n"
            . "Los enlaces funcionan cuando tu correo esté en la lista de testers.\n" . $apk
            . "Para publicar la app, Google pide que los testers permanezcan en la prueba al menos 14 días.\n"
            . "Usa la app con normalidad y envía sugerencias o problemas respondiendo a este correo.\n\n"
            . "73,\nPT2VHF\n$page\n\n"
            . "Recibiste este mensaje porque registraste este correo en www.pt2vhf.com. Para salir de la lista, responde pidiendo la baja.\n";
    } else {
        $subject = "$name: how to test on Google Play";
        $apk = $app['apk_over'] ? "If you already use the APK from the website, the Google Play version installs over it and keeps your settings.\n\n"
                                : "If you installed the APK from the website, you may need to uninstall it before installing from Play Store.\n\n";
        $body = "Hello$hi,\n\nThank you for signing up to test $name on Google Play.\n\n"
            . "How to join:\n"
            . "1. We will add this e-mail to the Google Play testers list (within 1 day).\n"
            . "2. On your Android phone, open the link below and tap \"Become a tester\":\n   $optin\n"
            . "3. Install the app from the store page:\n   $store\n\n"
            . "The links work once your e-mail is on the testers list.\n" . $apk
            . "To publish the app, Google asks testers to stay in the test for at least 14 days.\n"
            . "Use the app normally and send suggestions or problems by replying to this e-mail.\n\n"
            . "73,\nPT2VHF\n$page\n\n"
            . "You received this message because this e-mail was registered at www.pt2vhf.com. To leave the list, reply asking for removal.\n";
    }
    return pt2vhf_send_mail($email, $subject, $body, PT2VHF_TESTERS_BCC, 'PT2VHF');
}

/** Avisa o mantenedor de cada inscrição nova, para ele incluir o e-mail na lista de testadores da Play Console. */
function pt2vhf_testers_notify_admin(string $product, array $app, string $email, string $call, string $lang): bool {
    $subject = '[Testador · ' . preg_replace('/^PT2VHF\s+/', '', $app['name']) . '] ' . $email . ($call !== '' ? ' — ' . $call : '');
    $body = "Nova inscrição para o teste fechado do {$app['name']} no Google Play.\n\n"
        . "E-mail: $email\n"
        . 'Indicativo: ' . ($call !== '' ? $call : '(não informado)') . "\n"
        . "Idioma: $lang\n\n"
        . "Incluir na Play Console: {$app['package']} → Testes → Teste fechado → Testadores.\n"
        . "Pendentes deste app: www.pt2vhf.com/testers_export.php?app=$product (com a chave).\n";
    return pt2vhf_send_mail(PT2VHF_TESTERS_BCC, $subject, $body, $email);
}

$product = is_string($_POST['product'] ?? null) ? $_POST['product'] : 'aprs-android';
$app = PT2VHF_TESTERS_APPS[$product] ?? null;

function pt2vhf_testers_reply(string $status, ?array $app): void {
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    if (strpos($accept, 'application/json') !== false) {
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode(array('status' => $status));
    } else {
        $app = $app ?? PT2VHF_TESTERS_APPS['aprs-android'];
        header('Location: ' . $app['page'] . '?testers=' . rawurlencode($status) . '#' . $app['anchor'], true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit;
}
if ($app === null) pt2vhf_testers_reply('erro', null);
if (trim((string)($_POST['website'] ?? '')) !== '') pt2vhf_testers_reply('ok', $app); // robô: finge sucesso

$email = strtolower(trim((string)($_POST['email'] ?? '')));
if ($email === '' || strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) pt2vhf_testers_reply('erro', $app);
$call = strtoupper(trim((string)($_POST['call'] ?? '')));
if ($call !== '' && !preg_match('~^[A-Z0-9/]{3,16}(-[0-9]{1,2})?$~D', $call)) $call = '';
$lang = strtolower(substr(trim((string)($_POST['lang'] ?? 'pt')), 0, 2));

$dir = dirname(__DIR__) . '/pt2vhf-private-data';
if (!is_dir($dir) && !@mkdir($dir, 0700, true)) pt2vhf_testers_reply('erro', $app);
$path = $dir . '/' . $app['csv'];
$limitsPath = $dir . '/testers-limits.json';

$fh = @fopen($path, 'c+');
if (!$fh) pt2vhf_testers_reply('erro', $app);
try {
    if (!flock($fh, LOCK_EX)) pt2vhf_testers_reply('erro', $app);

    // Limite por IP (HMAC com chave que muda a cada dia UTC; nada de IP em claro), somando os dois apps.
    $today = gmdate('Y-m-d');
    $limits = json_decode((string)@file_get_contents($limitsPath), true);
    if (!is_array($limits) || ($limits['day'] ?? '') !== $today) {
        $limits = array('day' => $today, 'key' => bin2hex(random_bytes(16)), 'ip' => array());
    }
    $ipKey = substr(hash_hmac('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? ''), $limits['key']), 0, 16);
    if (($limits['ip'][$ipKey] ?? 0) >= PT2VHF_TESTERS_PER_IP_DAY) pt2vhf_testers_reply('erro', $app);

    $rows = array();
    $contents = stream_get_contents($fh);
    foreach (preg_split('/\r?\n/', (string)$contents) as $line) {
        $first = strtolower(trim(explode(',', $line)[0]));
        if ($first !== '') $rows[$first] = true;
    }
    if (isset($rows[$email])) pt2vhf_testers_reply('dup', $app);
    if (count($rows) >= PT2VHF_TESTERS_MAX) pt2vhf_testers_reply('erro', $app);

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
pt2vhf_testers_notify_admin($product, $app, $email, $call, $lang); // aviso ao mantenedor para incluir na Play Console
// confirmação ao inscrito; falha de envio não desfaz o cadastro
if ($app['instructions'] ?? true) pt2vhf_testers_mail($app, $email, $call, $lang);
else pt2vhf_testers_received_mail($app, $email, $lang);
pt2vhf_testers_reply('ok', $app);
