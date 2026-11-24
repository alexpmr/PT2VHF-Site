<?php
/**
 * Integração do envio de e-mail (mail_lib.php) com um SMTP falso: configuração por smtp.env e por variáveis de
 * ambiente (com prioridade), formulário de contato (From fixo, Reply-To do visitante), aviso de testadores,
 * senha errada (erro amigável, senha nunca exposta), botão de teste do /stats que reenvia mensagens guardadas
 * por versões anteriores, e configuração inválida.
 */
declare(strict_types=1);

function check(bool $ok, string $message): void {
    if (!$ok) throw new RuntimeException($message);
}
$root = dirname(__DIR__);
$tmp = sys_get_temp_dir() . '/pt2vhf-mail-test-' . getmypid();
$public = $tmp . '/public_html';
$private = $tmp . '/pt2vhf-private-data';
$box = $tmp . '/smtp-box';
foreach (array($public, $private, $box) as $d) check(@mkdir($d, 0700, true) || is_dir($d), "Criar $d");
foreach (array('enviar-contato.php', 'mail_lib.php', 'testers.php', 'stats.php', 'visits_lib.php', 'installs_lib.php', 'updates.json') as $f) {
    copy($root . '/' . $f, $public . '/' . $f);
}
$failMail = $tmp . '/sendmail-fail.sh';
file_put_contents($failMail, "#!/bin/sh\ncat > /dev/null\nexit 1\n");
chmod($failMail, 0700);

$smtpPort = random_int(20000, 30000);
$webPort = random_int(30001, 50000);
$procs = array();
$procs[] = proc_open(array(PHP_BINARY, __DIR__ . '/fake_smtp_server.php', (string)$smtpPort, 'alex@pt2vhf.com', 'senha-certa', $box),
    array(0 => array('pipe', 'r'), 1 => array('file', $tmp . '/smtp.log', 'w'), 2 => array('file', $tmp . '/smtp.log', 'a')), $p1);
$procs[] = proc_open(escapeshellarg(PHP_BINARY) . ' -d sendmail_path=' . escapeshellarg($failMail) . ' -S 127.0.0.1:' . $webPort . ' -t ' . escapeshellarg($public),
    array(0 => array('pipe', 'r'), 1 => array('file', $tmp . '/web.log', 'w'), 2 => array('file', $tmp . '/web.log', 'a')), $p2);
$base = 'http://127.0.0.1:' . $webPort;

function smtp_env(string $private, int $port, string $pass, string $host = '127.0.0.1'): void {
    file_put_contents($private . '/smtp.env', "# teste\nSMTP_HOST=$host\nSMTP_PORT=$port\nSMTP_SECURE=none\nSMTP_USER=alex@pt2vhf.com\n"
        . "SMTP_PASSWORD=\"$pass\"\nSMTP_FROM=alex@pt2vhf.com\nSMTP_FROM_NAME=PT2VHF\nCONTACT_RECIPIENT=alexpmr@gmail.com\n");
}
function post(string $url, array $data, bool $json = true): array {
    $ctx = stream_context_create(array('http' => array('method' => 'POST', 'ignore_errors' => true, 'follow_location' => 0,
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n" . ($json ? 'Accept: application/json' : 'Accept: text/html'),
        'content' => http_build_query($data))));
    $body = (string)@file_get_contents($url, false, $ctx);
    return array($body, json_decode($body, true));
}
function emails(string $box): array {
    $out = array();
    foreach (glob($box . '/*.eml') as $f) $out[] = (string)file_get_contents($f);
    return $out;
}
function decoded(string $eml): string {
    [, $b] = explode("\r\n\r\n", $eml, 2) + array('', '');
    return (string)base64_decode(str_replace("\r\n", '', $b));
}

try {
    foreach (array($smtpPort, $webPort) as $p) { for ($i = 0; $i < 50; $i++) { if (@fsockopen('127.0.0.1', $p)) break; usleep(100000); } }
    $ts = (string)((int)(microtime(true) * 1000) - 10000);
    $msg = array('nome' => 'José da Silva', 'email' => 'py2xyz@example.com', 'produto' => 'qsl', 'assunto' => 'Dúvida', 'mensagem' => 'Olá, tudo bem?', 'lang' => 'pt', 'ts' => $ts);

    // 1) Sem configuração SMTP e sem mail(): erro amigável, nada guardado
    [, $r] = post($base . '/enviar-contato.php', $msg);
    check(($r['status'] ?? '') === 'error', 'Sem SMTP deveria dar error, veio ' . json_encode($r));

    // 2) Com smtp.env: envia por SMTP com remetente fixo e Reply-To do visitante
    smtp_env($private, $smtpPort, 'senha-certa');
    [, $r] = post($base . '/enviar-contato.php', array_merge($msg, array('mensagem' => 'Mensagem por SMTP')));
    check(($r['status'] ?? '') === 'ok', 'Com smtp.env deveria enviar por SMTP, veio ' . json_encode($r));
    $e = emails($box);
    check(count($e) === 1, 'Servidor SMTP deveria ter 1 mensagem');
    check(strpos($e[0], 'From: "PT2VHF" <alex@pt2vhf.com>') !== false, 'From fixo alex@pt2vhf.com');
    check(strpos($e[0], 'To: <alexpmr@gmail.com>') !== false, 'To = CONTACT_RECIPIENT');
    check(strpos($e[0], 'Reply-To: =?UTF-8?B?' . base64_encode('José da Silva') . '?= <py2xyz@example.com>') !== false, 'Reply-To do visitante');
    check(strpos($e[0], 'Subject: =?UTF-8?B?' . base64_encode('[Site PT2VHF · QSL Manager] Dúvida') . '?=') !== false, 'Assunto UTF-8 com o produto');
    check(strpos(decoded($e[0]), 'Mensagem por SMTP') !== false, 'Corpo');
    check(strpos($e[0], 'senha-certa') === false, 'Senha não pode aparecer na mensagem');

    // 3) Variáveis de ambiente têm prioridade sobre o smtp.env (sem expor a senha)
    require_once $root . '/mail_lib.php';
    putenv('PT2VHF_PRIVATE_DIR=' . $private);
    putenv('SMTP_FROM=outro@pt2vhf.com');
    $cfg = pt2vhf_smtp_config();
    check(is_array($cfg) && $cfg['from'] === 'outro@pt2vhf.com' && $cfg['password'] === 'senha-certa' && $cfg['port'] === $smtpPort, 'Ambiente com prioridade sobre o arquivo');
    putenv('SMTP_FROM');
    putenv('SMTP_SECURE=true'); putenv('SMTP_HOST=smtp.hostinger.com'); putenv('SMTP_PORT=465');
    $cfg = pt2vhf_smtp_config();
    check($cfg['security'] === 'ssl' && $cfg['host'] === 'smtp.hostinger.com' && $cfg['port'] === 465, 'SMTP_SECURE=true = SSL na 465');
    putenv('SMTP_SECURE'); putenv('SMTP_HOST'); putenv('SMTP_PORT'); putenv('PT2VHF_PRIVATE_DIR');

    // 4) Senha errada: erro amigável; o /stats mostra o motivo sem a senha
    smtp_env($private, $smtpPort, 'senha-errada');
    [, $r] = post($base . '/enviar-contato.php', array_merge($msg, array('mensagem' => 'Senha errada')));
    check(($r['status'] ?? '') === 'error', 'Senha errada deveria dar error');
    check(strpos(json_encode($r), 'senha') === false && strpos(json_encode($r), '535') === false, 'Resposta ao visitante sem detalhes técnicos');
    file_put_contents($private . '/contact-messages.jsonl', json_encode(array('date' => '2026-11-24T01:00:00+00:00', 'lang' => 'pt',
        'name' => 'Visitante antigo', 'email' => 'antigo@example.com', 'subject' => 'Guardada', 'message' => 'Guardada por versão anterior')) . "\n");
    [$html] = post($base . '/stats.php', array('action' => 'mailtest'), false);
    check(strpos($html, 'login (usuário ou senha) recusado') !== false, 'Painel deveria mostrar o motivo do erro');
    check(strpos($html, 'senha-errada') === false, 'Painel não pode mostrar a senha');

    // Senha corrigida: o botão envia o teste e reenvia as guardadas
    smtp_env($private, $smtpPort, 'senha-certa');
    [$html] = post($base . '/stats.php', array('action' => 'mailtest'), false);
    check(strpos($html, 'E-mail de teste enviado') !== false && strpos($html, 'reenviadas: 1') !== false, 'Teste e reenvio no painel');
    check(trim((string)@file_get_contents($private . '/contact-messages.jsonl')) === '', 'Guardadas devem sair do arquivo');
    $all = implode("\n", array_map('decoded', emails($box)));
    check(strpos($all, 'Guardada por versão anterior') !== false, 'Guardada reenviada');
    check(count(emails($box)) === 3, 'Deveriam ser 3 mensagens no SMTP (1 + teste + 1 guardada), veio ' . count(emails($box)));

    // 5) Testadores: aviso ao mantenedor e confirmação ao inscrito pelo SMTP
    post($base . '/testers.php', array('email' => 'tester@example.com', 'call' => 'PY2ABC', 'lang' => 'pt', 'product' => 'aprs-android'));
    $last = array_slice(emails($box), -2);
    check(count(emails($box)) === 5, 'Testadores deveriam gerar 2 e-mails');
    $countBeforeSpeed = 5;
    check(strpos($last[0] . $last[1], 'To: <alexpmr@gmail.com>') !== false && strpos($last[0] . $last[1], 'To: <tester@example.com>') !== false, 'Destinatários dos testadores');
    check(strpos($last[0] . $last[1], 'Subject: =?UTF-8?B?' . base64_encode('[Testador · APRS Client] tester@example.com — PY2ABC') . '?=') !== false, 'Assunto do aviso do APRS');
    // Speed Alert: mesmo fluxo, lista própria e instruções com o pacote do Speed
    post($base . '/testers.php', array('email' => 'tester@example.com', 'call' => '', 'lang' => 'pt', 'product' => 'speed'));
    $last = array_slice(emails($box), -2);
    $both = $last[0] . $last[1] . decoded($last[0]) . decoded($last[1]);
    check(strpos($both, 'Subject: =?UTF-8?B?' . base64_encode('[Testador · Speed Alert] tester@example.com') . '?=') !== false, 'Assunto do aviso do Speed');
    check(strpos($both, 'apps/testing/com.pt2vhf.speedalert') !== false && strpos($both, 'www.pt2vhf.com/speed') !== false, 'Instruções do Speed');
    check(is_file($private . '/testers-speed.csv') && strpos((string)file_get_contents($private . '/testers-speed.csv'), 'tester@example.com') === 0, 'Lista própria do Speed');
    [, $r] = post($base . '/testers.php', array('email' => 'tester@example.com', 'lang' => 'pt', 'product' => 'speed'));
    check(($r['status'] ?? '') === 'dup', 'Mesmo e-mail no Speed é duplicado');
    [, $r] = post($base . '/testers.php', array('email' => 'outro@example.com', 'lang' => 'pt', 'product' => 'ios'));
    check(($r['status'] ?? '') === 'erro', 'App desconhecido é recusado');

    // 6) Configuração inválida (sem SSL fora do teste local) não envia e o painel explica
    smtp_env($private, $smtpPort, 'senha-certa', 'smtp.exemplo.com');
    [$html] = post($base . '/stats.php', array('action' => 'mailtest'), false);
    check(strpos($html, 'SMTP_SECURE precisa ser true') !== false, 'Painel deveria explicar a configuração inválida');
    echo "OK: envio de e-mail por SMTP (smtp.env, ambiente, contato, testadores, painel)\n";
} finally {
    foreach ($procs as $p) if (is_resource($p)) proc_terminate($p);
    exec('rm -rf ' . escapeshellarg($tmp));
}
