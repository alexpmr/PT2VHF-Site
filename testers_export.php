<?php
/**
 * PT2VHF — lista das inscrições do teste fechado (testers.php), só para o mantenedor.
 * Acesso: ?key=<chave>. Só o SHA-256 da chave fica no repositório; a chave fica com o mantenedor.
 * Lê pt2vhf-private-data/testers-aprs-android.csv (fora de public_html). Nada é alterado.
 * Saída: texto simples, uma inscrição por linha (e-mail, indicativo, data UTC), mais recente por último.
 */
declare(strict_types=1);

const PT2VHF_TESTERS_EXPORT_SHA256 = '8d397d13635e1124fc550bb89001446bcc83e9b4c6412fa31a0ee9e58bea2402';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
$key = (string)($_GET['key'] ?? '');
if ($key === '' || !hash_equals(PT2VHF_TESTERS_EXPORT_SHA256, hash('sha256', $key))) {
    http_response_code(404);
    exit;
}
header('Content-Type: text/plain; charset=utf-8');
$path = dirname(__DIR__) . '/pt2vhf-private-data/testers-aprs-android.csv';
$data = is_file($path) ? (string)@file_get_contents($path) : '';
$lines = array_values(array_filter(array_map('trim', preg_split('/\r?\n/', $data))));
echo 'Inscrições: ' . count($lines) . "\n\n";
echo implode("\n", $lines) . "\n";
