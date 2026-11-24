<?php

declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Método não permitido.');
}

function field(string $name): string
{
    return trim((string)($_POST[$name] ?? ''));
}

// Campo invisível anti-spam. Bots que o preencherem não recebem resposta útil.
if (field('website') !== '') {
    header('Location: /contato?lang=pt&enviado=1');
    exit;
}

$name = field('nome');
$email = field('email');
$subject = field('assunto');
$message = field('mensagem');

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: /contato?lang=pt&erro=1');
    exit;
}

$name = mb_substr($name, 0, 120);
$email = mb_substr($email, 0, 254);
$subject = mb_substr($subject !== '' ? $subject : 'Mensagem pelo site PT2VHF', 0, 180);
$message = mb_substr($message, 0, 10000);

$body = "Nome: {$name}\nE-mail: {$email}\nAssunto: {$subject}\n\nMensagem:\n{$message}\n";
$headers = [
    'From: PT2VHF <noreply@pt2vhf.com>',
    'Reply-To: ' . str_replace(["\r", "\n"], '', $email),
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail(
    'alexpmr@gmail.com',
    'PT2VHF: ' . str_replace(["\r", "\n"], '', $subject),
    $body,
    implode("\r\n", $headers)
);

header('Location: /contato?lang=pt&' . ($sent ? 'enviado=1' : 'erro=1'));
exit;
