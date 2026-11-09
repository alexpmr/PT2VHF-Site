<?php
declare(strict_types=1);
require_once __DIR__ . '/prop_parts.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
$raw = @file_get_contents(__DIR__ . '/updates.json');
$data = $raw ? json_decode($raw, true) : null;
$product = is_array($data) ? ($data['products']['aprs-android'] ?? null) : null;
$entry = is_array($product) ? ($product['files'][0] ?? null) : null;
$name = is_array($entry) ? (string)($entry['name'] ?? '') : '';
$directory = __DIR__ . '/downloads/aprs-android';
$sidecar = $directory . '/' . $name . '.parts.json';
$sidecarInfo = is_file($sidecar) ? json_decode((string)file_get_contents($sidecar), true) : null;
$parts = is_array($sidecarInfo) ? ($sidecarInfo['parts'] ?? []) : [];
$present = 0;
$totalSize = 0;
$firstMissing = null;
foreach ($parts as $part) {
    $filename = (string)($part['name'] ?? '');
    $full = $directory . '/' . $filename;
    if (is_file($full)) { $present++; $totalSize += filesize($full); }
    elseif ($firstMissing === null) $firstMissing = $filename;
}
$spec = pt2vhf_segmented_products()['aprs-android'] ?? null;
echo json_encode([
    'manifestVersion' => $product['version'] ?? null,
    'expectedSize' => $entry['size'] ?? null,
    'hasDirectory' => is_dir($directory),
    'hasSidecar' => is_file($sidecar),
    'manifestMatchesRegex' => is_array($spec) && preg_match($spec['pattern'], $name) === 1,
    'sidecarCount' => is_array($parts) ? count($parts) : 0,
    'partsPresent' => $present,
    'sizePresent' => $totalSize,
    'firstMissing' => $firstMissing,
    'helperRecognizes' => is_array($entry) ? pt2vhf_prop_parts($entry, 'aprs-android') !== false : false,
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
