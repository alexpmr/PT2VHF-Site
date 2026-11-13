<?php
/**
 * Diagnóstico temporário (13/11/2026): o registro de estações em produção parece rodar
 * código antigo. Mostra se os arquivos no disco são os da main e o que o PHP carrega.
 * Sem dados pessoais: só hashes, configurações do OPcache e contagens por produto.
 */
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Robots-Tag: noindex');
$out = array('time' => gmdate('c'), 'files' => array());
foreach (array('stations_lib.php', 'stations.php', 'update.php', 'updates.json') as $f) {
    $p = __DIR__ . '/' . $f;
    $raw = @file_get_contents($p);
    $out['files'][$f] = array(
        'exists' => is_file($p),
        'mtime' => is_file($p) ? gmdate('c', (int)filemtime($p)) : null,
        'sha1' => is_string($raw) ? sha1($raw) : null,
        'has_aprs_android' => is_string($raw) ? (strpos($raw, "'aprs-android'") !== false) : null,
        'has_windowDays' => is_string($raw) ? (strpos($raw, 'windowDays') !== false) : null,
    );
}
$out['opcache'] = array(
    'enable' => ini_get('opcache.enable'),
    'validate_timestamps' => ini_get('opcache.validate_timestamps'),
    'revalidate_freq' => ini_get('opcache.revalidate_freq'),
    'file_cache' => ini_get('opcache.file_cache'),
);
require_once __DIR__ . '/stations_lib.php';
$out['loaded_products'] = defined('PT2VHF_STATION_PRODUCTS') ? PT2VHF_STATION_PRODUCTS : null;
$out['data_file'] = array();
$data = function_exists('pt2vhf_station_file') ? @file_get_contents(pt2vhf_station_file()) : false;
if (is_string($data)) {
    $j = json_decode($data, true);
    $out['data_file']['readable'] = is_array($j);
    if (is_array($j['products'] ?? null)) foreach ($j['products'] as $k => $v) $out['data_file']['counts'][$k] = is_array($v) ? count($v) : 0;
} else {
    $out['data_file']['readable'] = false;
}
echo json_encode($out, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
