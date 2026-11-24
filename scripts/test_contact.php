<?php
/**
 * Integração do formulário de contato (/contato + enviar-contato.php), com um sendmail falso que grava o
 * e-mail em arquivo (caminho sem SMTP). Confere: envio, Reply-To, assunto UTF-8, campos obrigatórios e
 * tamanhos, remoção de HTML/scripts, armadilha anti-robô, envio rápido demais, respostas JSON e sem
 * JavaScript, falha do servidor (erro amigável, nada guardado), reenvio após erro, limite por IP sem gravar
 * IP, e que a página mantém menu, idiomas e o formulário traduzido.
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
$okMail = "#!/bin/sh\necho \"ARGS: \$*\" >> " . escapeshellarg($mailLog) . "\ncat >> " . escapeshellarg($mailLog) . "\necho '=====' >> " . escapeshellarg($mailLog) . "\n";
file_put_contents($fake, $okMail);
chmod($fake, 0700);
$port = random_int(20000, 50000);
$base = 'http://127.0.0.1:' . $port;
$cmd = escapeshellarg(PHP_BINARY) . ' -d sendmail_path=' . escapeshellarg($fake) . ' -d log_errors=1 -d error_log=' . escapeshellarg($tmp . '/php-error.log')
    . ' -S 127.0.0.1:' . $port . ' -t ' . escapeshellarg($public);
$proc = proc_open($cmd, array(0=>array('pipe','r'),1=>array('file',$tmp . '/server.log','w'),2=>array('file',$tmp . '/server.log','a')), $pipes);
check(is_resource($proc), 'Servidor PHP não iniciou');
fclose($pipes[0]);

function post(string $url, array $data, bool $json = true): array {
    $ctx = stream_context_create(array('http' => array('method' => 'POST', 'ignore_errors' => true, 'follow_location' => 0,
        'header' => "Content-Type: application/x-www-form-urlencoded\r\nAccept: " . ($json ? 'application/json' : 'text/html'),
        'content' => http_build_query($data))));
    $body = (string)@file_get_contents($url, false, $ctx);
    $status = isset($http_response_header[0]) ? (int)explode(' ', $http_response_header[0])[1] : 0;
    $loc = '';
    foreach ($http_response_header ?? array() as $h) if (stripos($h, 'Location:') === 0) $loc = trim(substr($h, 9));
    return array($status, $loc, json_decode($body, true), $body);
}
function mails(string $log): int { return is_file($log) ? substr_count((string)file_get_contents($log), '=====') : 0; }

try {
    for ($i = 0; $i < 50; $i++) { if (@fsockopen('127.0.0.1', $port)) break; usleep(100000); }
    $url = $base . '/enviar-contato.php';
    $ctx = stream_context_create(array('http' => array('ignore_errors' => true)));
    @file_get_contents($url, false, $ctx);
    check((int)explode(' ', $http_response_header[0])[1] === 405, 'GET deveria dar 405');

    $old = (string)((int)(microtime(true) * 1000) - 10000); // página aberta há 10 s
    $ok = array('nome' => 'José da Silva', 'email' => 'PY2XYZ@Example.com', 'assunto' => 'Dúvida no APRS',
        'mensagem' => "Olá!\nLinha 2", 'lang' => 'en', 'website' => '', 'ts' => $old);

    // Envio válido (JSON)
    [$s, , $r] = post($url, $ok);
    check($s === 200 && ($r['status'] ?? '') === 'ok', 'Envio válido deveria dar ok, veio ' . json_encode($r));
    $log = (string)file_get_contents($mailLog);
    check(strpos($log, 'To: alexpmr@gmail.com') !== false, 'Destinatário');
    check(strpos($log, 'Subject: =?UTF-8?B?' . base64_encode('[Site PT2VHF] Dúvida no APRS') . '?=') !== false, 'Assunto em UTF-8');
    check(strpos($log, 'Reply-To: =?UTF-8?B?' . base64_encode('José da Silva') . '?= <py2xyz@example.com>') !== false, 'Reply-To com o e-mail do visitante');
    check(strpos($log, "Nome: José da Silva") !== false && strpos($log, "Olá!\nLinha 2") !== false, 'Corpo da mensagem');

    check(strpos($log, 'Indicativo: (não informado)') !== false, 'Sem indicativo, o e-mail diz não informado');

    // Indicativo opcional: inválidos são recusados; válido vai em maiúsculas no assunto e no corpo
    foreach (array('PY', 'ABC', 'PY2#XYZ', '<b>abc</b>', str_repeat('A1', 11), 'PY 2-XYZ-999') as $bad) {
        [, , $r] = post($url, array_merge($ok, array('indicativo' => $bad)));
        check(($r['fields'] ?? array()) === array('indicativo'), "Indicativo inválido deveria ser recusado: $bad");
    }
    $before = mails($mailLog);
    [, , $r] = post($url, array_merge($ok, array('indicativo' => ' pp5/py2xyz-9 ', 'mensagem' => 'Com indicativo')));
    check(($r['status'] ?? '') === 'ok' && mails($mailLog) === $before + 1, 'Indicativo válido deveria ser aceito');
    $log = (string)file_get_contents($mailLog);
    check(strpos($log, 'Indicativo: PP5/PY2XYZ-9') !== false, 'Indicativo em maiúsculas no corpo');
    check(strpos($log, base64_encode('[Site PT2VHF] Dúvida no APRS — PP5/PY2XYZ-9')) !== false, 'Indicativo no assunto');

    // Sem JavaScript: redireciona com o resultado
    [$s, $loc] = post($url, $ok, false);
    check($s === 303 && $loc === '/contato?contato=ok#formulario', "Sem JavaScript deveria redirecionar com ok, veio $s $loc");

    // Validação
    foreach (array('nome', 'email', 'assunto', 'mensagem') as $f) {
        [, , $r] = post($url, array_merge($ok, array($f => '   ')));
        check(($r['status'] ?? '') === 'invalid' && in_array($f, $r['fields'] ?? array(), true), "Campo $f vazio deveria ser recusado");
    }
    [, , $r] = post($url, array_merge($ok, array('email' => "a@b.com\r\nBcc: x@y.com")));
    check(($r['fields'] ?? array()) === array('email'), 'E-mail com quebra de linha é recusado');
    [, , $r] = post($url, array_merge($ok, array('mensagem' => str_repeat('a', 5001), 'nome' => str_repeat('b', 101))));
    check(($r['status'] ?? '') === 'invalid' && in_array('mensagem', $r['fields'], true) && in_array('nome', $r['fields'], true), 'Tamanho máximo');
    [, , $r] = post($url, array_merge($ok, array('mensagem' => '<script>alert(1)</script>')));
    check(($r['fields'] ?? array()) === array('mensagem'), 'Mensagem só com script deve ficar vazia e ser recusada');
    $before = mails($mailLog);
    [, , $r] = post($url, array_merge($ok, array('assunto' => "Oi\r\nBcc: x@y.com", 'mensagem' => 'Texto <b>negrito</b> <script>roubar()</script>fim')));
    check(($r['status'] ?? '') === 'ok' && mails($mailLog) === $before + 1, 'Envio com HTML deveria passar limpo');
    $last = (string)file_get_contents($mailLog);
    check(strpos($last, "\nBcc:") === false, 'Assunto sem injeção de cabeçalho');
    check(strpos($last, 'Texto negrito fim') !== false && strpos($last, 'roubar') === false && strpos($last, '<b>') === false, 'HTML e scripts removidos');

    // Robôs: armadilha e envio rápido demais recebem ok e nada é enviado
    $before = mails($mailLog);
    [, , $r] = post($url, array_merge($ok, array('website' => 'http://spam')));
    check(($r['status'] ?? '') === 'ok' && mails($mailLog) === $before, 'Armadilha: ok e nada enviado');
    [, , $r] = post($url, array_merge($ok, array('ts' => (string)(int)(microtime(true) * 1000))));
    check(($r['status'] ?? '') === 'ok' && mails($mailLog) === $before, 'Envio instantâneo: ok e nada enviado');

    // Falha do servidor: erro amigável, nada guardado; depois, o reenvio funciona
    file_put_contents($fake, "#!/bin/sh\ncat > /dev/null\nexit 1\n");
    [, , $r] = post($url, array_merge($ok, array('mensagem' => 'Vai falhar')));
    check(($r['status'] ?? '') === 'error', 'Falha do servidor deveria dar error, veio ' . json_encode($r));
    [, $loc] = post($url, array_merge($ok, array('mensagem' => 'Vai falhar')), false);
    check($loc === '/contato?contato=falha#formulario', 'Sem JavaScript, falha redireciona com falha');
    check(!is_file($tmp . '/pt2vhf-private-data/contact-messages.jsonl'), 'Nada deve ser guardado na falha');
    check(strpos((string)@file_get_contents($tmp . '/php-error.log'), '[pt2vhf contato] envio falhou') !== false, 'Falha registrada no log do servidor');
    file_put_contents($fake, $okMail);
    [, , $r] = post($url, array_merge($ok, array('mensagem' => 'Reenvio após erro')));
    check(($r['status'] ?? '') === 'ok' && strpos((string)file_get_contents($mailLog), 'Reenvio após erro') !== false, 'Reenvio após erro');

    // Limite: 5 mensagens enviadas por IP por dia
    $sentSoFar = mails($mailLog);
    check($sentSoFar === 5, 'Deveriam ser 5 e-mails enviados até aqui, veio ' . $sentSoFar);
    [, , $r] = post($url, $ok);
    check(($r['status'] ?? '') === 'limit' && mails($mailLog) === 5, 'Sexta mensagem do mesmo IP no dia é bloqueada');
    $limits = (string)file_get_contents($tmp . '/pt2vhf-private-data/contact-limits.json');
    check(strpos($limits, '127.0.0.1') === false, 'IP não pode ser gravado');

    // Página: mantém o site completo e o formulário traduzido
    $html = (string)file_get_contents($root . '/contato.html');
    foreach (array('site-nav-projects', 'languageQuickSwitch', 'wa.me/', 'contact-help-list', 'visit.js', 'action="/enviar-contato.php"',
                   'name="website"', 'name="ts"', 'name="indicativo"', 'id="formulario"', 'name="assunto" maxlength="150" required') as $needle) {
        check(strpos($html, $needle) !== false, "contato.html deveria conter $needle");
    }
    $js = (string)file_get_contents($root . '/assets/js/contact-data.js');
    preg_match_all('/data-contact="([A-Za-z0-9]+)"/', $html, $m);
    $keys = array_unique(array_merge($m[1], array('formSent', 'formError', 'formLimit', 'formFailed', 'formSending', 'formCallsign')));
    foreach (array('pt', 'en', 'es', 'fr', 'de', 'it', 'zh') as $lang) {
        check(preg_match('/\n  "' . $lang . '": \{(.*?)\n  \}/s', $js, $b) === 1, "Bloco $lang");
        foreach ($keys as $k) check(strpos($b[1], '"' . $k . '":') !== false, "Falta $k em $lang");
    }
    check(strpos($js, '"formSent": "Mensagem enviada com sucesso. Obrigado pelo contato."') !== false, 'Texto de sucesso em português');
    check(strpos($js, '"formFailed": "Não foi possível enviar sua mensagem agora. Tente novamente mais tarde."') !== false, 'Texto de erro em português');
    echo "OK: formulário de contato\n";
} finally {
    proc_terminate($proc);
    exec('rm -rf ' . escapeshellarg($tmp));
}
