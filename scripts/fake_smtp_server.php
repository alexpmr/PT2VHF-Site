<?php
/**
 * Servidor SMTP falso para os testes (sem TLS): php fake_smtp_server.php <porta> <usuário> <senha> <pasta-de-saída>
 * Aceita AUTH PLAIN e LOGIN, recusa senha errada com 535 e grava cada mensagem em <pasta>/NNN.eml.
 */
declare(strict_types=1);
[, $port, $user, $pass, $out] = $argv;
$srv = stream_socket_server('tcp://127.0.0.1:' . $port, $errno, $errstr);
if (!$srv) { fwrite(STDERR, $errstr); exit(1); }
$n = 0;
while ($c = @stream_socket_accept($srv, 600)) {
    $say = function (string $s) use ($c) { fwrite($c, $s . "\r\n"); };
    $say('220 fake ESMTP');
    $authed = false;
    $loginStep = 0; $loginUser = '';
    while (($line = fgets($c)) !== false) {
        $line = rtrim($line, "\r\n");
        if ($loginStep === 1) { $loginUser = base64_decode($line); $loginStep = 2; $say('334 UGFzc3dvcmQ6'); continue; }
        if ($loginStep === 2) { $loginStep = 0; $authed = $loginUser === $user && base64_decode($line) === $pass; $say($authed ? '235 ok' : '535 5.7.8 Username and Password not accepted'); continue; }
        $cmd = strtoupper(substr($line, 0, 4));
        if ($cmd === 'EHLO') { $say('250-fake'); $say('250-AUTH LOGIN PLAIN'); $say('250 8BITMIME'); }
        elseif (stripos($line, 'AUTH PLAIN ') === 0) {
            $p = explode("\0", base64_decode(substr($line, 11)));
            $authed = ($p[1] ?? '') === $user && ($p[2] ?? '') === $pass;
            $say($authed ? '235 ok' : '535 5.7.8 Username and Password not accepted');
        }
        elseif (stripos($line, 'AUTH LOGIN') === 0) { $loginStep = 1; $say('334 VXNlcm5hbWU6'); }
        elseif ($cmd === 'MAIL') { $say($authed ? '250 ok' : '530 auth required'); }
        elseif ($cmd === 'RCPT') { $say('250 ok'); }
        elseif ($cmd === 'DATA') {
            $say('354 go');
            $data = '';
            while (($l = fgets($c)) !== false && rtrim($l, "\r\n") !== '.') $data .= $l;
            file_put_contents(sprintf('%s/%03d.eml', $out, ++$n), $data);
            $say('250 queued');
        }
        elseif ($cmd === 'QUIT') { $say('221 bye'); break; }
        else { $say('250 ok'); }
    }
    fclose($c);
}
