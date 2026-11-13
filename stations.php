<?php
/**
 * Resumo público das estações que usam um aplicativo PT2VHF:
 *   stations.php?product=sat
 * Países em ordem de quantidade e todos os indicativos já registrados
 * (permanentes). Somente leitura; os registros vêm do update.php.
 */
declare(strict_types=1);
require_once __DIR__ . '/stations_lib.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex');
$product = (string)($_GET['product'] ?? '');
if (!in_array($product, PT2VHF_STATION_PRODUCTS, true)) {
    http_response_code(400);
    echo json_encode(array('error' => 'Produto invalido'));
    exit;
}
$summary = pt2vhf_station_summary($product);
if ($summary === null) {
    http_response_code(503);
    echo json_encode(array('error' => 'Registro de estacoes indisponivel'));
    exit;
}
echo json_encode($summary, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
