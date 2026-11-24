<?php
/**
 * Integração: formulário de contato (/contato + enviar-contato.php). Usa um sendmail falso que grava
 * o e-mail em arquivo. Confere envio, Reply-To, assunto UTF-8, armadilha anti-robô, validação,
 * limite por IP sem gravar IP, e que a página mantém menu, idiomas e o formulário traduzido.
 */
declare(strict_types=1);

function check(bool $ok, string $message): void {
    if (!$ok) throw new RuntimeException($message);
}
$root = dirname(__DIR__);
$tmp = sys_get_temp_dir() . '/pt2vhf-contact-test-' . getmypid();
$public = $tmp . '/public_html';
check(@mkdir($public, 0700, true) || is_dir($public), 'Criar fixture');
copy($root . '/enviar-contato.php', $public . '/enviar-contato.php');
copy($root . '/mail_lib.php', $public . '/mail_lib.php');
$mailLog = $tmp . '/mail.log';
$fake = $tmp . '/sendmail.sh';
file_put_contents($fake, "#!/bin/sh\necho \"ARGS: \$*\" >> " . escapeshellarg($mailLog) . "\ncat >> " . escapeshellarg($mailLog) . "\necho '=====' >> " . escapeshellarg($mailLog) . "\n");
chmod($fake, 0700);
$port = random_int(20000, 50000);
$base = 'http://127.0.0.1:' . $port;
$cmd = escapeshellarg(PHP_BINARY) . ' -d sendmail_path=' . escapeshellarg($fake) . ' -S 127.0.0.1:' . $port . ' -t ' . escapeshellarg($public);
$proc = proc_open($cmd, array(0=>array('pipe','r'),1=>array('file',$tmp . '/server.log','w'),2=>array('file',$tmp . '/server.log','a')), $pipes);
check(is_resource($proc), 'Servidor PHP não iniciou');
fclose($pipes[0]);

function post(string $url, array $data): array {
    $ctx = stream_context_create(array('http' => array('method' => 'POST', 'ignore_errors' => true, 'follow_location' => 0,
        'header' => 'Content-Type: application/x-www-form-urlencoded', 'content' => http_build_query($data))));
    $body = @file_get_contents($url, false, $ctx);
    $status = isset($http_response_header[0]) ? (int)explode(' ', $http_response_header[0])[1] : 0;
    $loc = '';
    foreach ($http_response_header ?? array() as $h) if (stripos($h, 'Location:') === 0) $loc = trim(substr($h, 9));
    return array($status, $loc, (string)$body);
}
function mails(string $log): int { return is_file($log) ? substr_count((string)file_get_contents($log), '=====') : 0; }

try {
    for ($i = 0; $i < 50; $i++) { if (@fsockopen('127.0.0.1', $port)) break; usleep(100000); }
    $url = $base . '/enviar-contato.php';
    [$s] = (function ($u) { $b = @file_get_contents($u, false, stream_context_create(array('http' => array('ignore_errors' => true)))); return array((int)explode(' ', $http_response_header[0])[1]); })($url);
    check($s === 405, 'GET deveria dar 405');

    $ok = array('nome' => 'José da Silva', 'email' => 'PY2XYZ@Example.com', 'assunto' => 'Dúvida no APRS', 'mensagem' => "Olá!\nLinha 2", 'lang' => 'en', 'website' => '');
    [$s, $loc] = post($url, $ok);
    check($s === 303 && $loc === '/contato?lang=en&contato=ok#formulario', "Envio válido deveria redirecionar com ok, veio $s $loc");
    $log = (string)file_get_contents($mailLog);
    check(strpos($log, 'To: alexpmr@gmail.com') !== false, 'Destinatário');
    check(strpos($log, 'Subject: =?UTF-8?B?' . base64_encode('Contato pelo site: Dúvida no APRS') . '?=') !== false, 'Assunto em UTF-8');
    check(strpos($log, '<py2xyz@example.com>') !== false && strpos($log, 'Reply-To:') !== false, 'Reply-To com o e-mail de quem escreveu');
    check(strpos($log, "Nome: José da Silva") !== false && strpos($log, "Olá!\nLinha 2") !== false, 'Corpo da mensagem');
    check(strpos($log, 'ARGS: -fnao-responda@pt2vhf.com') !== false, 'Remetente do envelope');

    [$s, $loc] = post($url, array_merge($ok, array('website' => 'http://spam')));
    check(strpos($loc, 'contato=ok') !== false && mails($mailLog) === 1, 'Robô recebe ok e nada é enviado');
    [, $loc] = post($url, array_merge($ok, array('email' => "a@b.com\r\nBcc: x@y.com")));
    check(strpos($loc, 'contato=erro') !== false && mails($mailLog) === 1, 'E-mail com quebra de linha é recusado');
    [, $loc] = post($url, array_merge($ok, array('mensagem' => '  ')));
    check(strpos($loc, 'contato=erro') !== false, 'Mensagem vazia é recusada');
    [, $loc] = post($url, array_merge($ok, array('lang' => 'xx', 'nome' => '')));
    check(strpos($loc, 'lang=pt&contato=erro') !== false, 'Idioma inválido vira pt');
    [, $loc] = post($url, array_merge($ok, array('assunto' => "Oi\r\nBcc: x@y.com")));
    check(strpos($loc, 'contato=ok') !== false && strpos((string)file_get_contents($mailLog), "\nBcc:") === false, 'Assunto sem injeção de cabeçalho');

    for ($i = 0; $i < 3; $i++) post($url, $ok);
    check(mails($mailLog) === 5, 'Deveriam ser 5 e-mails até aqui, veio ' . mails($mailLog));
    [, $loc] = post($url, $ok);
    check(strpos($loc, 'contato=limite') !== false && mails($mailLog) === 5, 'Sexta mensagem do mesmo IP no dia é bloqueada');
    $limits = (string)file_get_contents($tmp . '/pt2vhf-private-data/contact-limits.json');
    check(strpos($limits, '127.0.0.1') === false, 'IP não pode ser gravado');

    // Página: mantém o site completo e o formulário traduzido
    $html = (string)file_get_contents($root . '/contato.html');
    foreach (array('site-nav-projects', 'languageQuickSwitch', 'wa.me/', 'contact-help-list', 'visit.js', 'action="/enviar-contato.php"', 'name="website"', 'id="formulario"') as $needle) {
        check(strpos($html, $needle) !== false, "contato.html deveria conter $needle");
    }
    $js = (string)file_get_contents($root . '/assets/js/contact-data.js');
    preg_match_all('/data-contact="([A-Za-z0-9]+)"/', $html, $m);
    $keys = array_unique(array_merge($m[1], array('formSent', 'formError', 'formLimit', 'formFailed')));
    foreach (array('pt', 'en', 'es', 'fr', 'de', 'it', 'zh') as $lang) {
        check(preg_match('/\n  "' . $lang . '": \{(.*?)\n  \}/s', $js, $b) === 1, "Bloco $lang");
        foreach ($keys as $k) check(strpos($b[1], '"' . $k . '":') !== false, "Falta $k em $lang");
    }
    // Servidor sem envio de e-mail: a mensagem fica guardada fora do site e o visitante recebe ok.
    file_put_contents($fake, "#!/bin/sh\ncat > /dev/null\nexit 1\n");
    @unlink($tmp . '/pt2vhf-private-data/contact-limits.json');
    [, $loc] = post($url, array_merge($ok, array('mensagem' => 'Mensagem guardada')));
    check(strpos($loc, 'contato=ok') !== false, 'Falha de envio com mensagem guardada deve responder ok, veio ' . $loc);
    $saved = (string)@file_get_contents($tmp . '/pt2vhf-private-data/contact-messages.jsonl');
    check(strpos($saved, 'Mensagem guardada') !== false && strpos($saved, 'py2xyz@example.com') !== false, 'Mensagem deveria ficar guardada');
    check(strpos($saved, '127.0.0.1') === false, 'IP não pode ser gravado junto da mensagem');
    echo "OK: formulário de contato\n";
} finally {
    proc_terminate($proc);
    exec('rm -rf ' . escapeshellarg($tmp));
}
