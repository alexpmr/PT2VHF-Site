<?php
/**
 * PT2VHF — formulário de contato da página /contato.
 *
 * Recebe por POST: nome, email, assunto (opcional), mensagem, lang e website (armadilha anti-robô).
 * Envia a mensagem ao mantenedor por e-mail (Reply-To = e-mail de quem escreveu). Se o envio falhar, a mensagem
 * fica guardada em ../pt2vhf-private-data/contact-messages.jsonl (fora do site) para não se perder; o /stats mostra
 * só a quantidade. Fora isso, só o contador anti-abuso é gravado: no máximo 5 mensagens por IP e 60 no total por dia; o IP vira um
 * HMAC com chave que muda a cada dia UTC (mesmo esquema do testers.php), nunca fica em claro.
 * Resposta: redireciona para /contato?lang=..&contato=ok|erro|limite|falha#formulario,
 * ou JSON {status} quando o pedido aceita application/json.
 */
declare(strict_types=1);

const PT2VHF_CONTACT_TO = 'alexpmr@gmail.com';
const PT2VHF_CONTACT_FROM = 'PT2VHF <nao-responda@pt2vhf.com>';
const PT2VHF_CONTACT_PER_IP_DAY = 5;
const PT2VHF_CONTACT_PER_DAY = 60;
const PT2VHF_CONTACT_LANGS = array('pt', 'en', 'es', 'fr', 'de', 'it', 'zh');

$lang = strtolower(substr(trim((string)($_POST['lang'] ?? 'pt')), 0, 2));
if (!in_array($lang, PT2VHF_CONTACT_LANGS, true)) $lang = 'pt';

function pt2vhf_contact_reply(string $status, string $lang, string $stage = ''): void {
    if (strpos((string)($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json') !== false) {
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode($stage !== '' ? array('status' => $status, 'stage' => $stage) : array('status' => $status));
    } else {
        header('Location: /contato?lang=' . $lang . '&contato=' . rawurlencode($status) . '#formulario', true, 303);
    }
    exit;
}

/** Texto de uma linha: sem quebras nem caracteres de controle, cortado no limite. */
function pt2vhf_contact_line(string $name, int $max): string {
    $v = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', (string)($_POST[$name] ?? ''));
    return trim(mb_substr(trim((string)$v), 0, $max));
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Método não permitido.');
}
if (trim((string)($_POST['website'] ?? '')) !== '') pt2vhf_contact_reply('ok', $lang); // robô: finge sucesso

$name = pt2vhf_contact_line('nome', 120);
$email = strtolower(pt2vhf_contact_line('email', 254));
$subject = pt2vhf_contact_line('assunto', 180);
$message = str_replace("\r\n", "\n", trim(mb_substr((string)($_POST['mensagem'] ?? ''), 0, 10000)));
$message = (string)preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $message);
if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) pt2vhf_contact_reply('erro', $lang);

// Limite anti-abuso (HMAC do IP com chave diária; nada de IP em claro)
$dir = dirname(__DIR__) . '/pt2vhf-private-data';
if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) pt2vhf_contact_reply('erro', $lang, 'storage');
$fh = @fopen($dir . '/contact-limits.json', 'c+');
if (!$fh || !flock($fh, LOCK_EX)) pt2vhf_contact_reply('erro', $lang, 'storage');
$today = gmdate('Y-m-d');
$limits = json_decode((string)stream_get_contents($fh), true);
if (!is_array($limits) || ($limits['day'] ?? '') !== $today || !is_string($limits['key'] ?? null)) {
    $limits = array('day' => $today, 'key' => bin2hex(random_bytes(16)), 'total' => 0, 'ip' => array());
}
$ipKey = substr(hash_hmac('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? ''), $limits['key']), 0, 16);
$blocked = (int)($limits['ip'][$ipKey] ?? 0) >= PT2VHF_CONTACT_PER_IP_DAY || (int)($limits['total'] ?? 0) >= PT2VHF_CONTACT_PER_DAY;
if (!$blocked) {
    $limits['ip'][$ipKey] = (int)($limits['ip'][$ipKey] ?? 0) + 1;
    $limits['total'] = (int)($limits['total'] ?? 0) + 1;
    rewind($fh);
    ftruncate($fh, 0);
    fwrite($fh, (string)json_encode($limits));
    fflush($fh);
}
flock($fh, LOCK_UN);
fclose($fh);
if ($blocked) pt2vhf_contact_reply('limite', $lang);

$title = 'Contato pelo site: ' . ($subject !== '' ? $subject : $name);
$body = "Mensagem enviada pelo formulário de www.pt2vhf.com/contato.\n"
    . "Responda este e-mail para falar com quem escreveu.\n\n"
    . "Nome: $name\n"
    . "E-mail: $email\n"
    . 'Assunto: ' . ($subject !== '' ? $subject : '(sem assunto)') . "\n"
    . "Idioma da página: $lang\n"
    . 'Data (UTC): ' . gmdate('Y-m-d H:i') . "\n\n"
    . "Mensagem:\n$message\n";
$headers = implode("\r\n", array(
    'From: ' . PT2VHF_CONTACT_FROM,
    'Reply-To: ' . '=?UTF-8?B?' . base64_encode($name) . '?= <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
));
$encodedTitle = '=?UTF-8?B?' . base64_encode($title) . '?=';
$stage = 'mail-f';
$sent = @mail(PT2VHF_CONTACT_TO, $encodedTitle, $body, $headers, '-fnao-responda@pt2vhf.com');
if (!$sent) { // algumas hospedagens recusam o remetente de envelope (-f)
    $stage = 'mail';
    $sent = @mail(PT2VHF_CONTACT_TO, $encodedTitle, $body, $headers);
}
if ($sent) pt2vhf_contact_reply('ok', $lang, $stage);

// O servidor não enviou: guarda a mensagem (fora do site) para o mantenedor ler depois.
$line = json_encode(array('date' => gmdate('c'), 'lang' => $lang, 'name' => $name, 'email' => $email,
    'subject' => $subject, 'message' => $message), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$stored = is_string($line) && @file_put_contents($dir . '/contact-messages.jsonl', $line . "\n", FILE_APPEND | LOCK_EX) !== false;
pt2vhf_contact_reply($stored ? 'ok' : 'falha', $lang, $stored ? 'stored' : 'mail-failed');
