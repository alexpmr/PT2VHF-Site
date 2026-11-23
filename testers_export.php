<?php
/**
 * PT2VHF — lista das inscrições do teste fechado do APRS Client (testers.php), em HTML simples.
 * Substitui o aviso por e-mail (o domínio não entrega e-mail): o mantenedor abre esta página e
 * inclui os inscritos na lista de testadores da Play Console.
 * Acesso: ?key=<chave>. Só o SHA-256 da chave fica no repositório; a chave fica com o mantenedor.
 * Lê pt2vhf-private-data/testers-aprs-android.csv (fora de public_html). Nada é alterado.
 * ?format=txt devolve texto simples (e-mail,indicativo,data) para uso em scripts.
 */
declare(strict_types=1);

const PT2VHF_TESTERS_EXPORT_SHA256 = '8d397d13635e1124fc550bb89001446bcc83e9b4c6412fa31a0ee9e58bea2402';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('Referrer-Policy: no-referrer');
$key = (string)($_GET['key'] ?? '');
if ($key === '' || !hash_equals(PT2VHF_TESTERS_EXPORT_SHA256, hash('sha256', $key))) {
    http_response_code(404);
    exit;
}
$path = dirname(__DIR__) . '/pt2vhf-private-data/testers-aprs-android.csv';
$data = is_file($path) ? (string)@file_get_contents($path) : '';
$rows = array();
foreach (preg_split('/\r?\n/', $data) as $line) {
    $line = trim($line);
    if ($line === '') continue;
    $parts = explode(',', $line);
    $rows[] = array($parts[0] ?? '', $parts[1] ?? '', $parts[2] ?? '');
}
$rows = array_reverse($rows); // mais recente primeiro

if (($_GET['format'] ?? '') === 'txt') {
    header('Content-Type: text/plain; charset=utf-8');
    foreach ($rows as $r) echo implode(',', $r) . "\n";
    exit;
}

header('Content-Type: text/html; charset=utf-8');
$h = static fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
?><!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Inscritos no teste</title>
<style>
  body { font: 15px/1.45 system-ui, sans-serif; margin: 16px; color: #1b1b1b; background: #fff; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  p { margin: 0 0 12px; color: #555; }
  table { border-collapse: collapse; width: 100%; max-width: 760px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #ddd; }
  th { font-size: 13px; color: #555; }
  td.n { color: #888; width: 2em; }
  textarea { width: 100%; max-width: 760px; height: 5em; margin-top: 16px; font: 13px monospace; }
  @media (prefers-color-scheme: dark) {
    body { color: #eee; background: #121212; } p, th { color: #aaa; } th, td { border-color: #333; }
    textarea { background: #1e1e1e; color: #eee; border-color: #333; }
  }
</style>
</head>
<body>
<h1>Inscritos no teste fechado do PT2VHF APRS Client</h1>
<p><?= count($rows) ?> inscrições pelo formulário do site, mais recentes primeiro. Datas em UTC.</p>
<table>
<thead><tr><th>#</th><th>E-mail</th><th>Indicativo</th><th>Data</th></tr></thead>
<tbody>
<?php $n = count($rows); foreach ($rows as $r): ?>
<tr><td class="n"><?= $n-- ?></td><td><?= $h($r[0]) ?></td><td><?= $h($r[1]) ?></td><td><?= $h(str_replace(array('T', 'Z'), array(' ', ''), $r[2])) ?></td></tr>
<?php endforeach; ?>
</tbody>
</table>
<p style="margin-top:16px">Todos os e-mails, separados por vírgula, para colar na lista da Play Console:</p>
<textarea readonly><?= $h(implode(', ', array_map(static fn($r) => $r[0], $rows))) ?></textarea>
</body>
</html>
