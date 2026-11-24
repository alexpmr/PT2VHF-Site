<?php
/**
 * PT2VHF — envio do formulário de contato (/contato).
 *
 * Recebe por POST: nome, email, assunto, mensagem (todos obrigatórios), lang, ts (hora em que a página abriu) e
 * website (armadilha anti-robô, invisível). Envia por SMTP com mail_lib.php: remetente = SMTP_FROM
 * (alex@pt2vhf.com), destinatário = CONTACT_RECIPIENT, Reply-To = e-mail do visitante. As credenciais vêm das
 * variáveis de ambiente ou de pt2vhf-private-data/smtp.env (fora do site); nada de senha no repositório.
 *
 * Proteções: HTML e scripts removidos dos campos, tamanho máximo por campo, armadilha anti-robô, envio rápido
 * demais (menos de 3 s após abrir a página) tratado como robô, e limite por IP sem gravar o IP (HMAC com chave
 * diária): 5 mensagens enviadas e 15 tentativas por dia, 60 mensagens por dia no total.
 * Falhas técnicas vão só para o log do servidor (error_log), nunca para o visitante.
 *
 * Resposta JSON (pedido com Accept: application/json): {"status": "ok" | "invalid" | "limit" | "error",
 * "fields": [...campos inválidos]}. Sem JavaScript: redireciona para /contato?contato=ok|erro|limite|falha#formulario.
 */
declare(strict_types=1);
require_once __DIR__ . '/mail_lib.php';

const PT2VHF_CONTACT_MAX = array('nome' => 100, 'email' => 254, 'assunto' => 150, 'mensagem' => 5000);
const PT2VHF_CONTACT_SENT_PER_IP_DAY = 5;
const PT2VHF_CONTACT_TRIES_PER_IP_DAY = 15;
const PT2VHF_CONTACT_SENT_PER_DAY = 60;
const PT2VHF_CONTACT_MIN_SECONDS = 3;

function pt2vhf_contact_reply(string $status, array $fields = array()): void {
    $map = array('ok' => 'ok', 'invalid' => 'erro', 'limit' => 'limite', 'error' => 'falha');
    header('Cache-Control: no-store');
    if (strpos((string)($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json') !== false) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($fields ? array('status' => $status, 'fields' => $fields) : array('status' => $status));
    } else {
        header('Location: /contato?contato=' . ($map[$status] ?? 'falha') . '#formulario', true, 303);
    }
    exit;
}

/** Texto limpo: sem HTML/scripts e sem caracteres de controle; $multiline mantém as quebras de linha. */
function pt2vhf_contact_clean(string $name, bool $multiline = false): string {
    $v = (string)($_POST[$name] ?? '');
    if (!mb_check_encoding($v, 'UTF-8')) return '';
    $v = (string)preg_replace('#<(script|style)\b[^>]*>.*?</\1\s*>#is', '', $v);
    $v = strip_tags($v);
    $v = str_replace(array("\r\n", "\r"), "\n", $v);
    $v = $multiline ? (string)preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v)
                    : (string)preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v);
    return trim($v);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Método não permitido.');
}

// Robôs: armadilha preenchida ou envio rápido demais. Recebem "ok" e nada é enviado.
if (trim((string)($_POST['website'] ?? '')) !== '') pt2vhf_contact_reply('ok');
$ts = (int)($_POST['ts'] ?? 0);
if ($ts > 0 && (int)(microtime(true) * 1000) - $ts < PT2VHF_CONTACT_MIN_SECONDS * 1000) pt2vhf_contact_reply('ok');

$lang = strtolower(substr(trim((string)($_POST['lang'] ?? 'pt')), 0, 2));
if (!in_array($lang, array('pt', 'en', 'es', 'fr', 'de', 'it', 'zh'), true)) $lang = 'pt';
$raw = array();
foreach (PT2VHF_CONTACT_MAX as $f => $_) $raw[$f] = (string)($_POST[$f] ?? '');
$name = pt2vhf_contact_clean('nome');
$email = strtolower(pt2vhf_contact_clean('email'));
$subject = pt2vhf_contact_clean('assunto');
$message = pt2vhf_contact_clean('mensagem', true);

$invalid = array();
if ($name === '' || mb_strlen($raw['nome']) > PT2VHF_CONTACT_MAX['nome']) $invalid[] = 'nome';
if ($email === '' || strlen($raw['email']) > PT2VHF_CONTACT_MAX['email'] || !filter_var($email, FILTER_VALIDATE_EMAIL)) $invalid[] = 'email';
if ($subject === '' || mb_strlen($raw['assunto']) > PT2VHF_CONTACT_MAX['assunto']) $invalid[] = 'assunto';
if ($message === '' || mb_strlen($raw['mensagem']) > PT2VHF_CONTACT_MAX['mensagem']) $invalid[] = 'mensagem';
if ($invalid) pt2vhf_contact_reply('invalid', $invalid);

// Limite por IP e por dia (HMAC do IP com chave diária; nada de IP em claro)
$dir = pt2vhf_mail_private_dir();
if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
    error_log('[pt2vhf contato] pasta privada indisponível');
    pt2vhf_contact_reply('error');
}
$fh = @fopen($dir . '/contact-limits.json', 'c+');
if (!$fh || !flock($fh, LOCK_EX)) {
    error_log('[pt2vhf contato] contador de limite indisponível');
    pt2vhf_contact_reply('error');
}
$today = gmdate('Y-m-d');
$limits = json_decode((string)stream_get_contents($fh), true);
if (!is_array($limits) || ($limits['day'] ?? '') !== $today || !is_string($limits['key'] ?? null)) {
    $limits = array('day' => $today, 'key' => bin2hex(random_bytes(16)), 'total' => 0, 'ip' => array());
}
$ipKey = substr(hash_hmac('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? ''), $limits['key']), 0, 16);
$mine = is_array($limits['ip'][$ipKey] ?? null) ? $limits['ip'][$ipKey] : array('sent' => 0, 'tries' => 0);
$blocked = (int)$mine['sent'] >= PT2VHF_CONTACT_SENT_PER_IP_DAY || (int)$mine['tries'] >= PT2VHF_CONTACT_TRIES_PER_IP_DAY
    || (int)($limits['total'] ?? 0) >= PT2VHF_CONTACT_SENT_PER_DAY;

$sent = false;
if (!$blocked) {
    $mine['tries'] = (int)$mine['tries'] + 1;
    $title = '[Site PT2VHF] ' . $subject;
    $body = "Mensagem enviada pelo formulário de contato de www.pt2vhf.com.\n"
        . "Responda este e-mail para falar diretamente com quem escreveu.\n\n"
        . "Nome: $name\n"
        . "E-mail: $email\n"
        . "Assunto: $subject\n"
        . "Idioma da página: $lang\n"
        . 'Data (UTC): ' . gmdate('Y-m-d H:i') . "\n\n"
        . "Mensagem:\n$message\n";
    $err = null;
    $sent = pt2vhf_send_mail(pt2vhf_contact_recipient(), $title, $body, $email, $name, $err);
    if ($sent) {
        $mine['sent'] = (int)$mine['sent'] + 1;
        $limits['total'] = (int)($limits['total'] ?? 0) + 1;
    } else {
        error_log('[pt2vhf contato] envio falhou: ' . $err);
    }
    $limits['ip'][$ipKey] = $mine;
    rewind($fh);
    ftruncate($fh, 0);
    fwrite($fh, (string)json_encode($limits));
    fflush($fh);
}
flock($fh, LOCK_UN);
fclose($fh);

if ($blocked) pt2vhf_contact_reply('limit');
pt2vhf_contact_reply($sent ? 'ok' : 'error');
