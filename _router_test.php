<?php
$p = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#^/(aprs|android|prop|mesh|sat|prog|qsl|contato|sobre)/?$#', $p, $m)) { require __DIR__ . '/' . $m[1] . '.html'; return true; }
return false;
