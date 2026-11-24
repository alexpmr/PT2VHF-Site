<?php
/**
 * PT2VHF — envio de e-mail do site (formulário de contato, avisos de testadores, teste no /stats).
 *
 * A Hostinger não entrega o mail() do PHP, então o envio é feito por SMTP autenticado (SSL na porta 465 ou
 * STARTTLS na 587). As credenciais NUNCA ficam no repositório. Vêm de variáveis de ambiente:
 *
 *   SMTP_HOST=smtp.hostinger.com     SMTP_PORT=465      SMTP_SECURE=true   (true = SSL/TLS; starttls = 587)
 *   SMTP_USER=alex@pt2vhf.com        SMTP_PASSWORD=...  SMTP_FROM=alex@pt2vhf.com (opcional; padrão = SMTP_USER)
 *   SMTP_FROM_NAME=PT2VHF (opcional) CONTACT_RECIPIENT=alexpmr@gmail.com
 *
 * Na hospedagem compartilhada não há painel de variáveis para o PHP; por isso, o que não vier do ambiente é lido
 * do arquivo ../pt2vhf-private-data/smtp.env (mesmo formato NOME=valor, fora do public_html, criado pelo
 * mantenedor no Gerenciador de arquivos do hPanel). Modelo sem senha em .env.example. Sem SMTP configurado,
 * tenta o mail() do PHP. Erros devolvidos nunca contêm a senha.
 */
declare(strict_types=1);

const PT2VHF_MAIL_FALLBACK_FROM = 'nao-responda@pt2vhf.com';
const PT2VHF_MAINTAINER_EMAIL = 'alexpmr@gmail.com';
const PT2VHF_MAIL_ENV_KEYS = array('SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM',
    'SMTP_FROM_NAME', 'CONTACT_RECIPIENT');

function pt2vhf_mail_private_dir(): string {
    $env = getenv('PT2VHF_PRIVATE_DIR');
    return is_string($env) && $env !== '' ? rtrim($env, '/') : dirname(__DIR__) . '/pt2vhf-private-data';
}

/** Variáveis do envio: ambiente do servidor primeiro, depois o arquivo privado smtp.env. */
function pt2vhf_mail_env(): array {
    $vars = array();
    $file = pt2vhf_mail_private_dir() . '/smtp.env';
    if (is_file($file)) {
        foreach ((array)@file($file, FILE_IGNORE_NEW_LINES) as $line) {
            $line = trim((string)$line);
            if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) continue;
            [$k, $v] = array_map('trim', explode('=', $line, 2));
            if (strlen($v) >= 2 && ($v[0] === '"' || $v[0] === "'") && substr($v, -1) === $v[0]) $v = substr($v, 1, -1);
            if (in_array($k, PT2VHF_MAIL_ENV_KEYS, true)) $vars[$k] = $v;
        }
    }
    foreach (PT2VHF_MAIL_ENV_KEYS as $k) {
        $v = getenv($k);
        if (!is_string($v) || $v === '') $v = (string)($_SERVER[$k] ?? $_ENV[$k] ?? '');
        if ($v !== '') $vars[$k] = $v;
    }
    return $vars;
}

/** Destinatário do formulário de contato (CONTACT_RECIPIENT; padrão = e-mail do mantenedor). */
function pt2vhf_contact_recipient(): string {
    $to = trim((string)(pt2vhf_mail_env()['CONTACT_RECIPIENT'] ?? ''));
    return filter_var($to, FILTER_VALIDATE_EMAIL) ? $to : PT2VHF_MAINTAINER_EMAIL;
}

/**
 * Configuração SMTP. Devolve null quando não há SMTP configurado ($problem = null) ou quando a configuração
 * está incompleta/inválida ($problem explica, sem a senha).
 */
function pt2vhf_smtp_config(?string &$problem = null): ?array {
    $problem = null;
    $e = pt2vhf_mail_env();
    if (($e['SMTP_HOST'] ?? '') === '' && ($e['SMTP_USER'] ?? '') === '' && ($e['SMTP_PASSWORD'] ?? '') === '') return null;
    $port = (int)($e['SMTP_PORT'] ?? 465);
    $secure = strtolower(trim((string)($e['SMTP_SECURE'] ?? 'true')));
    $security = in_array($secure, array('true', '1', 'yes', 'ssl', 'tls'), true) ? 'ssl'
        : ($secure === 'starttls' ? 'starttls' : ($secure === 'none' ? 'none' : ($port === 587 ? 'starttls' : 'none')));
    $c = array(
        'host' => trim((string)($e['SMTP_HOST'] ?? '')),
        'port' => $port,
        'security' => $security,
        'username' => trim((string)($e['SMTP_USER'] ?? '')),
        'password' => (string)($e['SMTP_PASSWORD'] ?? ''),
        'from' => trim((string)($e['SMTP_FROM'] ?? '')) ?: trim((string)($e['SMTP_USER'] ?? '')),
        'fromName' => trim((string)($e['SMTP_FROM_NAME'] ?? '')) ?: 'PT2VHF',
    );
    if ($c['host'] === '' || $c['username'] === '' || $c['password'] === '') { $problem = 'faltam SMTP_HOST, SMTP_USER ou SMTP_PASSWORD'; return null; }
    if ($c['port'] < 1 || $c['port'] > 65535) { $problem = 'SMTP_PORT inválida'; return null; }
    if ($c['security'] === 'none' && !in_array($c['host'], array('127.0.0.1', 'localhost'), true)) {
        $problem = 'SMTP_SECURE precisa ser true (porta 465) ou starttls (porta 587)'; return null;
    }
    if (!filter_var($c['from'], FILTER_VALIDATE_EMAIL)) { $problem = 'SMTP_FROM inválido'; return null; }
    return $c;
}

function pt2vhf_mail_header_text(string $v): string {
    return trim((string)preg_replace('/[\r\n\x00-\x1F\x7F]+/', ' ', $v));
}

function pt2vhf_mail_encode(string $v): string {
    $v = pt2vhf_mail_header_text($v);
    return preg_match('/[^\x20-\x7E]/', $v) ? '=?UTF-8?B?' . base64_encode($v) . '?=' : $v;
}

function pt2vhf_mail_address(string $email, string $name = ''): string {
    $email = pt2vhf_mail_header_text($email);
    if ($name === '') return '<' . $email . '>';
    $n = pt2vhf_mail_header_text($name);
    $n = preg_match('/[^\x20-\x7E]/', $n) ? '=?UTF-8?B?' . base64_encode($n) . '?=' : '"' . str_replace(array('\\', '"'), '', $n) . '"';
    return $n . ' <' . $email . '>';
}

/**
 * Envia um e-mail de texto. $replyTo/$replyName opcionais. $error recebe o motivo da falha (sem a senha) e
 * $via diz o caminho usado ("smtp" ou "mail").
 */
function pt2vhf_send_mail(string $to, string $subject, string $body, string $replyTo = '', string $replyName = '',
                          ?string &$error = null, ?string &$via = null): bool {
    $error = null;
    $to = pt2vhf_mail_header_text($to);
    $replyTo = pt2vhf_mail_header_text($replyTo);
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) { $error = 'destinatário inválido'; return false; }
    if ($replyTo !== '' && !filter_var($replyTo, FILTER_VALIDATE_EMAIL)) $replyTo = '';
    $body = str_replace(array("\r\n", "\r"), "\n", $body);

    $problem = null;
    $smtp = pt2vhf_smtp_config($problem);
    if ($smtp !== null) {
        $via = 'smtp';
        return pt2vhf_smtp_send($smtp, $to, $subject, $body, $replyTo, $replyName, $error);
    }
    $via = 'mail';
    $headers = array(
        'From: ' . pt2vhf_mail_address(PT2VHF_MAIL_FALLBACK_FROM, 'PT2VHF'),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    );
    if ($replyTo !== '') $headers[] = 'Reply-To: ' . pt2vhf_mail_address($replyTo, $replyName);
    $h = implode("\r\n", $headers);
    $s = pt2vhf_mail_encode($subject);
    if (@mail($to, $s, $body, $h, '-f' . PT2VHF_MAIL_FALLBACK_FROM) || @mail($to, $s, $body, $h)) return true;
    $error = $problem !== null ? $problem : 'SMTP não configurado (variáveis SMTP_* ou smtp.env) e o mail() do PHP não enviou';
    return false;
}

/** Lê uma resposta SMTP (multilinha). Devolve [código, texto]. */
function pt2vhf_smtp_read($fp): array {
    $text = '';
    while (($line = fgets($fp, 1024)) !== false) {
        $text .= $line;
        if (strlen($line) < 4 || $line[3] !== '-') break;
    }
    return array((int)substr($text, 0, 3), trim($text));
}

function pt2vhf_smtp_send(array $c, string $to, string $subject, string $body, string $replyTo, string $replyName, ?string &$error): bool {
    $host = $c['host'];
    $remote = ($c['security'] === 'ssl' ? 'ssl://' : 'tcp://') . $host . ':' . $c['port'];
    $ctx = stream_context_create(array('ssl' => array('peer_name' => $host, 'verify_peer' => true, 'verify_peer_name' => true)));
    $errno = 0; $errstr = '';
    $fp = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) { $error = "não conectou em $host:{$c['port']} ($errstr)"; return false; }
    stream_set_timeout($fp, 20);
    $step = function (?string $cmd, array $ok, string $what) use ($fp, &$error) {
        if ($cmd !== null) fwrite($fp, $cmd . "\r\n");
        [$code, $text] = pt2vhf_smtp_read($fp);
        if (!in_array($code, $ok, true)) {
            $error = "$what recusado pelo servidor: " . substr(preg_replace('/\s+/', ' ', $text), 0, 160);
            return null;
        }
        return $text;
    };
    try {
        $me = 'pt2vhf.com';
        if ($step(null, array(220), 'conexão') === null) return false;
        $ehlo = $step("EHLO $me", array(250), 'EHLO');
        if ($ehlo === null) return false;
        if ($c['security'] === 'starttls') {
            if ($step('STARTTLS', array(220), 'STARTTLS') === null) return false;
            if (!@stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT)) {
                $error = 'falha ao iniciar TLS';
                return false;
            }
            $ehlo = $step("EHLO $me", array(250), 'EHLO');
            if ($ehlo === null) return false;
        }
        if (preg_match('/AUTH[ =][^\n]*\bPLAIN\b/i', $ehlo)) {
            if ($step('AUTH PLAIN ' . base64_encode("\0" . $c['username'] . "\0" . $c['password']), array(235), 'login (usuário ou senha)') === null) return false;
        } else {
            if ($step('AUTH LOGIN', array(334), 'AUTH LOGIN') === null) return false;
            if ($step(base64_encode($c['username']), array(334), 'usuário') === null) return false;
            if ($step(base64_encode($c['password']), array(235), 'login (usuário ou senha)') === null) return false;
        }
        if ($step('MAIL FROM:<' . $c['from'] . '>', array(250), 'remetente') === null) return false;
        if ($step('RCPT TO:<' . $to . '>', array(250, 251), 'destinatário') === null) return false;
        if ($step('DATA', array(354), 'DATA') === null) return false;

        $domain = substr(strrchr($c['from'], '@') ?: '@pt2vhf.com', 1);
        $headers = array(
            'Date: ' . date(DATE_RFC2822),
            'From: ' . pt2vhf_mail_address($c['from'], $c['fromName']),
            'To: <' . $to . '>',
            'Subject: ' . pt2vhf_mail_encode($subject),
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $domain . '>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
        );
        if ($replyTo !== '') $headers[] = 'Reply-To: ' . pt2vhf_mail_address($replyTo, $replyName);
        $data = implode("\r\n", $headers) . "\r\n\r\n" . rtrim(chunk_split(base64_encode($body), 76, "\r\n")) . "\r\n.";
        if ($step($data, array(250), 'mensagem') === null) return false;
        fwrite($fp, "QUIT\r\n");
        return true;
    } finally {
        fclose($fp);
    }
}

/**
 * Reenvia ao mantenedor as mensagens do formulário de contato guardadas quando o envio falhou
 * (contact-messages.jsonl). As enviadas saem do arquivo; as que falharem continuam lá.
 * Devolve ['sent' => n, 'left' => n, 'error' => motivo da primeira falha ou null].
 */
function pt2vhf_contact_flush_stored(string $to): array {
    $path = pt2vhf_mail_private_dir() . '/contact-messages.jsonl';
    $result = array('sent' => 0, 'left' => 0, 'error' => null);
    $fh = @fopen($path, 'c+');
    if ($fh === false) return $result;
    if (!flock($fh, LOCK_EX)) { fclose($fh); return $result; }
    $keep = array();
    foreach (preg_split('/\n/', (string)stream_get_contents($fh)) as $line) {
        if (trim($line) === '') continue;
        $m = json_decode($line, true);
        if (!is_array($m)) { $keep[] = $line; continue; }
        $date = substr((string)($m['date'] ?? ''), 0, 16);
        $subject = (string)($m['subject'] ?? '');
        $body = "Mensagem do formulário de www.pt2vhf.com/contato recebida em $date UTC e guardada porque o\n"
            . "e-mail do site ainda não funcionava. Responda este e-mail para falar com quem escreveu.\n\n"
            . 'Nome: ' . ($m['name'] ?? '') . "\n"
            . 'E-mail: ' . ($m['email'] ?? '') . "\n"
            . 'Assunto: ' . ($subject !== '' ? $subject : '(sem assunto)') . "\n"
            . "\n"
            . ($m['message'] ?? '') . "\n";
        // A Hostinger recusa logins SMTP seguidos em poucos segundos: espera entre um envio e outro.
        sleep(2);
        $err = null;
        if (pt2vhf_send_mail($to, 'Contato pelo site (guardada): ' . ($subject !== '' ? $subject : (string)($m['name'] ?? '')),
                $body, (string)($m['email'] ?? ''), (string)($m['name'] ?? ''), $err)) {
            $result['sent']++;
        } else {
            $keep[] = $line;
            if ($result['error'] === null) $result['error'] = $err;
        }
    }
    rewind($fh);
    ftruncate($fh, 0);
    fwrite($fh, $keep ? implode("\n", $keep) . "\n" : '');
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);
    $result['left'] = count($keep);
    return $result;
}
