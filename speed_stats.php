<?php
declare(strict_types=1);
require_once __DIR__.'/speed_installs_lib.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    header('Allow: GET');http_response_code(405);exit;
}
echo json_encode(speed_summary(),JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
