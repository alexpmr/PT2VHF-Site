<?php
/**
 * PT2VHF — envio de e-mail do site (formulário de contato, avisos de testadores, teste no /stats).
 *
 * A Hostinger não entrega o mail() do PHP. Quando existe ../pt2vhf-private-data/smtp.json, o envio é feito por
 * SMTP autenticado (SSL na porta 465 ou STARTTLS na 587). O arquivo é criado pelo mantenedor no Gerenciador de
 * arquivos do hPanel, fica fora do public_html e nunca vai para o repositório:
 *
 *   {
 *     "host": "smtp.gmail.com",          (ou "smtp.hostinger.com" para uma caixa do domínio)
 *     "port": 465,
 *     "security": "ssl",                 ("ssl" na 465, "starttls" na 587)
 *     "username": "conta@exemplo.com",
 *     "password": "senha de app ou da caixa",
 *     "from": "conta@exemplo.com",       (opcional; padrão = username)
 *     "fromName": "PT2VHF"               (opcional)
 *   }
 *
 * Sem o arquivo, tenta o mail() do PHP como antes. Erros devolvidos nunca contêm a senha.
 */
declare(strict_types=1);

const PT2VHF_MAIL_FALLBACK_FROM = 'nao-responda@pt2vhf.com';
const PT2VHF_MAINTAINER_EMAIL = 'alexpmr@gmail.com';

function pt2vhf_mail_private_dir(): string {
    $env = getenv('PT2VHF_PRIVATE_DIR');
    return is_string($env) && $env !== '' ? rtrim($env, '/') : dirname(__DIR__) . '/pt2vhf-private-data';
}

/** Lê smtp.json. Devolve null se não existir; lança erro descritivo se estiver incompleto. */
function pt2vhf_smtp_config(?string &$problem = null): ?array {
    $problem = null;
    $path = pt2vhf_mail_private_dir() . '/smtp.json';
    if (!is_file($path)) return null;
    $c = json_decode((string)@file_get_contents($path), true);
    if (!is_array($c)) { $problem = 'smtp.json não é um JSON válido'; return null; }
    $c['host'] = trim((string)($c['host'] ?? ''));
    $c['port'] = (int)($c['port'] ?? 465);
    $c['security'] = strtolower(trim((string)($c['security'] ?? ($c['port'] === 587 ? 'starttls' : 'ssl'))));
    $c['username'] = trim((string)($c['username'] ?? ''));
    $c['password'] = (string)($c['password'] ?? '');
    $c['from'] = trim((string)($c['from'] ?? '')) ?: $c['username'];
    $c['fromName'] = trim((string)($c['fromName'] ?? 'PT2VHF')) ?: 'PT2VHF';
    if ($c['host'] === '' || $c['username'] === '' || $c['password'] === '') { $problem = 'smtp.json sem host, username ou password'; return null; }
    if (!in_array($c['security'], array('ssl', 'starttls', 'none'), true)) { $problem = 'security deve ser "ssl" ou "starttls"'; return null; }
    if ($c['security'] === 'none' && !in_array($c['host'], array('127.0.0.1', 'localhost'), true)) { $problem = 'security "none" só é aceito em testes locais'; return null; }
    if (!filter_var($c['from'], FILTER_VALIDATE_EMAIL)) { $problem = 'from inválido'; return null; }
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
    $error = $problem !== null ? $problem : 'o servidor não enviou pelo mail() do PHP e o smtp.json não existe';
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
            . 'Idioma da página: ' . ($m['lang'] ?? '') . "\n\n"
            . "Mensagem:\n" . ($m['message'] ?? '') . "\n";
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
