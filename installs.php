<?php
/**
 * Resumo público da contagem aproximada de instalações ativas de um aplicativo PT2VHF:
 *   installs.php?product=aprs
 * Visitantes únicos por dia no update.php (inclui versões antigas). Somente leitura.
 */
declare(strict_types=1);
require_once __DIR__ . '/installs_lib.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex');
$product = (string)($_GET['product'] ?? '');
if (!in_array($product, PT2VHF_INSTALLS_PRODUCTS, true)) {
    http_response_code(400);
    echo json_encode(array('error' => 'Produto invalido'));
    exit;
}
$summary = pt2vhf_installs_summary($product);
if ($summary === null) {
    http_response_code(503);
    echo json_encode(array('error' => 'Contagem indisponivel'));
    exit;
}
echo json_encode($summary, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
