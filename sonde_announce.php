<?php
/**
 * PT2VHF Sonde Finder — anúncio de versão nova para todos os inscritos (testers-sonde.csv), em cópia oculta.
 *
 * Chamado (POST, sem parâmetros) pelo workflow sync-sonde-release.yml depois que a versão nova já está no ar.
 * Anuncia a versão que o site publica (updates.json e o link do APK de sonde_apk_lib.php), uma vez só: o estado em
 * pt2vhf-private-data/sonde-announce.json guarda a versão e quem já recebeu. Chamar de novo só completa o que faltou
 * (ex.: falha no meio) e nunca repete, então não precisa de chave. Versões até PT2VHF_SONDE_ANNOUNCE_FROM não são
 * anunciadas (ponto de partida: os inscritos até ali receberam essa versão no e-mail de cadastro).
 * Envio: Para = mantenedor, CCO = inscritos, em lotes de 40, com pausa entre lotes (a Hostinger recusa logins
 * SMTP seguidos). Resposta JSON sem dados dos inscritos: {status: sent|partial|already|skipped|error, version}.
 */
declare(strict_types=1);
require_once __DIR__ . '/mail_lib.php';
require_once __DIR__ . '/sonde_apk_lib.php';

const PT2VHF_SONDE_ANNOUNCE_FROM = '1.12.0';
const PT2VHF_SONDE_ANNOUNCE_BATCH = 40;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

function pt2vhf_announce_reply(int $code, string $status, string $version, string $error = ''): void {
    http_response_code($code);
    $r = array('status' => $status, 'version' => $version);
    if ($error !== '') $r['error'] = $error;
    echo json_encode($r, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') pt2vhf_announce_reply(405, 'error', '', 'POST');

// Versão publicada: updates.json e o link do APK dos e-mails precisam concordar.
$doc = json_decode((string)@file_get_contents(__DIR__ . '/updates.json'), true);
$entry = $doc['products']['sonde'] ?? null;
$version = is_array($entry) ? (string)($entry['version'] ?? '') : '';
if (!preg_match('/^\d+\.\d+\.\d+$/D', $version) || strpos(PT2VHF_SONDE_APK_URL, "-v$version.apk") === false) {
    pt2vhf_announce_reply(409, 'error', $version, 'versão do site inconsistente');
}
if (!PT2VHF_SONDE_APK_ACTIVE) pt2vhf_announce_reply(200, 'skipped', $version, 'APK provisório desligado');
if (version_compare($version, PT2VHF_SONDE_ANNOUNCE_FROM, '<=')) pt2vhf_announce_reply(200, 'skipped', $version);
$notes = trim((string)($entry['notes'] ?? ''));

$dir = pt2vhf_mail_private_dir();
$emails = array();
foreach (preg_split('/\r?\n/', (string)@file_get_contents($dir . '/testers-sonde.csv')) as $line) {
    $e = strtolower(trim(explode(',', $line)[0]));
    if ($e !== '' && filter_var($e, FILTER_VALIDATE_EMAIL)) $emails[$e] = true;
}
$emails = array_keys($emails);

$lock = @fopen($dir . '/sonde-announce.json', 'c+');
if (!$lock || !flock($lock, LOCK_EX)) pt2vhf_announce_reply(500, 'error', $version, 'estado');
$state = json_decode((string)stream_get_contents($lock), true);
if (!is_array($state)) $state = array('version' => '', 'sent' => array());
$last = (string)($state['version'] ?? '');
if ($last !== '' && version_compare($version, $last, '<')) pt2vhf_announce_reply(200, 'already', $version);
$done = $last === $version ? array_fill_keys((array)($state['sent'] ?? array()), true) : array();
$pending = array_values(array_filter($emails, static fn($e) => !isset($done[$e])));
if (!$pending) pt2vhf_announce_reply(200, 'already', $version);

$link = pt2vhf_sonde_dl_url();
$subject = "PT2VHF Sonde Finder $version: nova versão";
$body = "Olá,\n\nSaiu a versão $version do PT2VHF Sonde Finder.\n\n"
    . "O que mudou:\n$notes\n\n"
    . "Como atualizar pelo próprio app (APK do site):\n"
    . "1. Abra o Sonde Finder e toque no ⓘ no alto da tela.\n"
    . "2. Toque em \"Verificar atualizações\". Aparece \"Nova versão disponível\": toque em \"Baixar\".\n"
    . "3. O app baixa a versão nova, confere o arquivo e abre o instalador do Android: toque em \"Atualizar\".\n"
    . "   (Na primeira vez, o Android pode pedir para autorizar o Sonde Finder a instalar apps: toque em\n"
    . "   \"Configurações\", ative a opção, volte e verifique de novo.)\n"
    . "O app também verifica sozinho uma vez por dia e avisa quando há versão nova.\n\n"
    . "Se preferir, baixe o APK direto:\n   $link\n\n"
    . "Ainda está com a versão 1.9.0? Desinstale-a antes de instalar: a assinatura do app mudou e ela não atualiza por cima.\n\n"
    . "---\n"
    . "Version $version of PT2VHF Sonde Finder is out. To update: open the app, tap ⓘ › \"Check for updates\" › "
    . "\"Download\", then \"Update\" in the Android installer. APK: $link\n\n"
    . "73,\nPT2VHF\nhttps://www.pt2vhf.com/sonde\n\n"
    . "Você recebeu esta mensagem porque se inscreveu para testar o Sonde Finder em www.pt2vhf.com. "
    . "Para sair da lista, responda pedindo a exclusão.\n";

$error = '';
@set_time_limit(300);
foreach (array_chunk($pending, PT2VHF_SONDE_ANNOUNCE_BATCH) as $i => $batch) {
    if ($i > 0) sleep(3);
    $err = null; $via = null;
    if (!pt2vhf_send_mail(PT2VHF_MAINTAINER_EMAIL, $subject, $body, PT2VHF_MAINTAINER_EMAIL, 'PT2VHF', $err, $via, $batch)) {
        $error = (string)$err;
        break;
    }
    foreach ($batch as $e) $done[$e] = true;
    ftruncate($lock, 0); rewind($lock);
    fwrite($lock, json_encode(array('version' => $version, 'sent' => array_keys($done), 'at' => gmdate('Y-m-d\TH:i:s\Z')), JSON_UNESCAPED_SLASHES));
    fflush($lock);
}
flock($lock, LOCK_UN);
fclose($lock);
if ($error !== '') pt2vhf_announce_reply(502, 'partial', $version, $error);
pt2vhf_announce_reply(200, 'sent', $version);
