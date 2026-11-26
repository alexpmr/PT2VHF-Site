<?php
/** Sonde Finder HTTPS POST endpoint (version check ping), no raw ID persistence. */
declare(strict_types=1);
require_once __DIR__.'/sonde_installs_lib.php';
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');http_response_code(405);exit;
}
$length=(int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if($length<1 || $length>600) {http_response_code(413);exit;}
$input=file_get_contents('php://input',false,null,0,601);
if(!is_string($input) || strlen($input)>600) {http_response_code(400);exit;}
$data=json_decode($input,true);
if(!is_array($data)
  || ($data['product'] ?? '') !== 'sonde-finder'
  || !in_array(($data['platform'] ?? ''), array('android','ios'), true)
  || ($data['event'] ?? '') !== 'update_check') {http_response_code(400);exit;}
$id=strtolower((string)($data['install_id'] ?? ''));
$ver=(string)($data['version'] ?? '');
if(!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/D',$id)
 || !preg_match('/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}(?:[-+][A-Za-z0-9.-]{1,30})?$/D',$ver)) {
    http_response_code(400);exit;
}
if(!sonde_record($id,$ver,(string)$data['platform'])) {http_response_code(503);exit;}
http_response_code(204);
