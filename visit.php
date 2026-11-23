<?php
/**
 * Coletor de visitas do site (beacon de assets/js/visit.js). Responde sempre 204.
 * Ver visits_lib.php para o que é e o que não é gravado.
 */
declare(strict_types=1);
require_once __DIR__ . '/visits_lib.php';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
http_response_code(204);

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') exit;
if (($_COOKIE['pt2vhf_nostats'] ?? '') === '1') exit; // navegador do mantenedor
// Só aceita beacons enviados pelas páginas do próprio site.
$origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '' && !preg_match('#^https?://(www\.)?pt2vhf\.com$|^http://(127\.0\.0\.1|localhost)(:\d+)?$#i', $origin)) exit;

$path = strtolower(pt2vhf_visits_clean((string)($_POST['p'] ?? ''), '#^/[A-Za-z0-9_-]{0,40}(\.html)?/?$#', 60));
$path = $path === '' ? '(outra)' : (preg_replace('#(\.html|/)$#', '', $path) ?: '/');
if ($path === '/index') $path = '/';

$ref = strtolower(pt2vhf_visits_clean((string)($_POST['r'] ?? ''), '#^[A-Za-z0-9.-]{1,80}$#', 80));
$ref = preg_replace('#^(www|m|l|lm)\.#', '', $ref);
if (preg_match('#(^|\.)pt2vhf\.com$#', $ref)) $ref = '';

$lang = pt2vhf_visits_clean((string)($_POST['l'] ?? ''), '#^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})?$#', 15);
$tz = pt2vhf_visits_clean((string)($_POST['z'] ?? ''), '#^[A-Za-z_]{2,20}(/[A-Za-z0-9_+-]{1,30}){0,2}$#', 60);

$country = '';
foreach (array('HTTP_CF_IPCOUNTRY', 'HTTP_X_COUNTRY_CODE', 'GEOIP_COUNTRY_CODE', 'HTTP_X_VERCEL_IP_COUNTRY') as $h) {
    $v = strtoupper((string)($_SERVER[$h] ?? ''));
    if (preg_match('/^[A-Z]{2}$/', $v) && $v !== 'XX' && $v !== 'T1') { $country = $v; break; }
}

pt2vhf_visits_record(
    array('path' => $path, 'ref' => $ref, 'lang' => $lang, 'tz' => $tz, 'country' => $country),
    (string)($_SERVER['REMOTE_ADDR'] ?? ''),
    (string)($_SERVER['HTTP_USER_AGENT'] ?? '')
);
