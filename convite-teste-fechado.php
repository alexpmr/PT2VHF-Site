<?php
/**
 * Envio único do convite para o teste fechado do PT2VHF APRS Client (aprovado pelo mantenedor em 2026-11-20).
 * Texto fixo; destinatários e chave chegam por POST (a chave fica fora do repositório, aqui só o SHA-256).
 * Envia uma única vez (trava em pt2vhf-private-data) e depois este arquivo é removido.
 */
declare(strict_types=1);
header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || !hash_equals('5683ecc40cd74c8a55b81e5a198af55032dfcea53b2a690b2b80dfa3dae0d4f4', hash('sha256', (string)($_POST['k'] ?? '')))) { http_response_code(404); exit; }
$bcc = (string)($_POST['bcc'] ?? '');
$list = array_values(array_filter(array_map('trim', explode(',', $bcc))));
foreach ($list as $e) { if (!filter_var($e, FILTER_VALIDATE_EMAIL)) { echo "email-invalido\n"; exit; } }
if (count($list) < 1 || count($list) > 60) { echo "quantidade-invalida\n"; exit; }
$bcc = implode(', ', $list);
$lock = dirname(__DIR__) . '/pt2vhf-private-data/convite-teste-fechado-2026-11-20.lock';
$fh = @fopen($lock, 'x');
if (!$fh) { echo "ja-enviado\n"; exit; }
$subject = 'Convite: participe do teste fechado do PT2VHF APRS Client no Google Play';
$body = "Olá, colega radioamador!\n\n"
    . "O PT2VHF APRS Client está chegando ao Google Play. Para o Google liberar o app para todos, precisamos de um número mínimo de testadores no teste fechado, usando o app por 2 semanas seguidas. Sua ajuda faz toda a diferença!\n\n"
    . "Já incluí este seu e-mail no grupo de testadores. Para participar:\n\n"
    . "1. No celular, entre na Play Store com a conta Google deste e-mail. Se usa outra conta no celular, me responda com ela.\n"
    . "2. Abra https://play.google.com/apps/testing/com.pt2vhf.aprs e toque em \"Tornar-se testador\".\n"
    . "3. Instale o app pela Play Store e use normalmente por pelo menos 2 semanas.\n\n"
    . "O Google ainda está terminando a análise do teste. Se o link mostrar \"item não encontrado\", tente de novo em um ou dois dias.\n\n"
    . "Obrigado pelo apoio e 73!\n\n"
    . "Alex PT2VHF\n";
$headers = implode("\r\n", array(
    'From: PT2VHF <nao-responda@pt2vhf.com>',
    'Reply-To: alexpmr@gmail.com',
    'Bcc: ' . $bcc,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
));
$ok = @mail('alexpmr@gmail.com', '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-fnao-responda@pt2vhf.com');
fwrite($fh, gmdate('c') . ' ' . ($ok ? 'ok' : 'falha') . ' ' . count(explode(',', $bcc)) . "\n");
fclose($fh);
echo ($ok ? 'enviado' : 'falha') . ' ' . count(explode(',', $bcc)) . "\n";
