<?php
/**
 * Integração do envio de e-mail (mail_lib.php) com um SMTP falso: formulário de contato, aviso de testadores,
 * senha errada (mensagem fica guardada), botão de teste do /stats que reenvia as guardadas, e smtp.json inválido.
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
$procs[] = proc_open(array(PHP_BINARY, __DIR__ . '/fake_smtp_server.php', (string)$smtpPort, 'conta@exemplo.com', 'senha-certa', $box),
    array(0 => array('pipe', 'r'), 1 => array('file', $tmp . '/smtp.log', 'w'), 2 => array('file', $tmp . '/smtp.log', 'a')), $p1);
$procs[] = proc_open(escapeshellarg(PHP_BINARY) . ' -d sendmail_path=' . escapeshellarg($failMail) . ' -S 127.0.0.1:' . $webPort . ' -t ' . escapeshellarg($public),
    array(0 => array('pipe', 'r'), 1 => array('file', $tmp . '/web.log', 'w'), 2 => array('file', $tmp . '/web.log', 'a')), $p2);
$base = 'http://127.0.0.1:' . $webPort;

function smtp_json(string $private, int $port, string $pass, string $host = '127.0.0.1'): void {
    file_put_contents($private . '/smtp.json', json_encode(array('host' => $host, 'port' => $port, 'security' => 'none',
        'username' => 'conta@exemplo.com', 'password' => $pass, 'from' => 'conta@exemplo.com', 'fromName' => 'PT2VHF')));
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
    $msg = array('nome' => 'José da Silva', 'email' => 'py2xyz@example.com', 'assunto' => 'Dúvida', 'mensagem' => 'Olá, tudo bem?', 'lang' => 'pt');

    // 1) Sem smtp.json: mail() falha, a mensagem fica guardada
    [, $r] = post($base . '/enviar-contato.php', $msg);
    check(($r['stage'] ?? '') === 'stored', 'Sem smtp.json deveria guardar, veio ' . json_encode($r));

    // 2) Com smtp.json certo: envia por SMTP
    smtp_json($private, $smtpPort, 'senha-certa');
    [, $r] = post($base . '/enviar-contato.php', array_merge($msg, array('mensagem' => 'Mensagem por SMTP')));
    check(($r['status'] ?? '') === 'ok' && ($r['stage'] ?? '') === 'smtp', 'Com smtp.json deveria enviar por SMTP, veio ' . json_encode($r));
    $e = emails($box);
    check(count($e) === 1, 'Servidor SMTP deveria ter 1 mensagem');
    check(strpos($e[0], 'From: "PT2VHF" <conta@exemplo.com>') !== false, 'From');
    check(strpos($e[0], 'To: <alexpmr@gmail.com>') !== false, 'To');
    check(strpos($e[0], 'Reply-To: =?UTF-8?B?' . base64_encode('José da Silva') . '?= <py2xyz@example.com>') !== false, 'Reply-To');
    check(strpos($e[0], 'Subject: =?UTF-8?B?' . base64_encode('Contato pelo site: Dúvida') . '?=') !== false, 'Assunto UTF-8');
    check(strpos(decoded($e[0]), 'Mensagem por SMTP') !== false, 'Corpo');
    check(strpos($e[0], 'senha-certa') === false, 'Senha não pode aparecer na mensagem');

    // 3) Senha errada: guarda e o /stats mostra o motivo sem a senha
    smtp_json($private, $smtpPort, 'senha-errada');
    [, $r] = post($base . '/enviar-contato.php', array_merge($msg, array('mensagem' => 'Guardada com senha errada')));
    check(($r['stage'] ?? '') === 'stored', 'Senha errada deveria guardar');
    [$html] = post($base . '/stats.php', array('action' => 'mailtest'), false);
    check(strpos($html, 'login (usuário ou senha) recusado') !== false, 'Painel deveria mostrar o motivo do erro');
    check(strpos($html, 'senha-errada') === false, 'Painel não pode mostrar a senha');
    check(strpos($html, '<b>2</b> mensagens') !== false, 'Painel deveria contar 2 mensagens guardadas');

    // 4) Senha corrigida: o botão envia o teste e reenvia as guardadas
    smtp_json($private, $smtpPort, 'senha-certa');
    [$html] = post($base . '/stats.php', array('action' => 'mailtest'), false);
    check(strpos($html, 'E-mail de teste enviado') !== false && strpos($html, 'reenviadas: 2') !== false, 'Teste e reenvio no painel');
    check(trim((string)@file_get_contents($private . '/contact-messages.jsonl')) === '', 'Guardadas devem sair do arquivo');
    $all = implode("\n", array_map('decoded', emails($box)));
    check(strpos($all, 'Guardada com senha errada') !== false && strpos($all, 'Olá, tudo bem?') !== false, 'Guardadas reenviadas');
    check(count(emails($box)) === 4, 'Deveriam ser 4 mensagens no SMTP (1 + teste + 2 guardadas)');

    // 5) Testadores: aviso ao mantenedor e confirmação ao inscrito pelo SMTP
    post($base . '/testers.php', array('email' => 'tester@example.com', 'call' => 'PY2ABC', 'lang' => 'pt', 'product' => 'aprs-android'));
    $last = array_slice(emails($box), -2);
    check(count(emails($box)) === 6, 'Testadores deveriam gerar 2 e-mails');
    check(strpos($last[0] . $last[1], 'To: <alexpmr@gmail.com>') !== false && strpos($last[0] . $last[1], 'To: <tester@example.com>') !== false, 'Destinatários dos testadores');

    // 6) smtp.json inválido não envia e o painel explica
    smtp_json($private, $smtpPort, 'senha-certa', 'smtp.exemplo.com');
    [$html] = post($base . '/stats.php', array('action' => 'mailtest'), false);
    check(strpos($html, 'só é aceito em testes locais') !== false, 'Painel deveria explicar o smtp.json inválido');
    echo "OK: envio de e-mail por SMTP (contato, testadores, painel)\n";
} finally {
    foreach ($procs as $p) if (is_resource($p)) proc_terminate($p);
    exec('rm -rf ' . escapeshellarg($tmp));
}
