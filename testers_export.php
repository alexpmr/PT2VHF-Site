<?php
/**
 * PT2VHF — lista das inscrições do teste fechado dos apps Android (testers.php), em HTML simples.
 * ?app=aprs-android (padrão), ?app=speed ou ?app=sonde escolhe o app; o mesmo vale para as ações por POST.
 * Substitui o aviso por e-mail (o domínio não entrega e-mail): o mantenedor abre esta página,
 * inclui os inscritos na lista de testadores da Play Console e marca como atendidos.
 * Acesso: ?key=<chave>. Só o SHA-256 da chave fica no repositório; a chave fica com o mantenedor.
 * Lê pt2vhf-private-data/testers-<app>.csv (fora de public_html).
 * Colunas do CSV: e-mail, indicativo, data UTC e, opcional, data UTC em que foi atendido
 * (convite ou aviso enviado). Linhas atendidas aparecem riscadas.
 * Sem botões na página. Ações por POST (mesma chave), usadas pelo Claude: remove=<e-mail> apaga a linha; done=<e-mails separados por vírgula>
 * marca como atendidos; undone=<e-mail> desmarca.
 * ?format=txt devolve texto simples (e-mail,indicativo,data,atendido) para uso em scripts.
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
const PT2VHF_TESTERS_EXPORT_APPS = array('aprs-android' => 'PT2VHF APRS Client', 'speed' => 'PT2VHF Speed Alert', 'sonde' => 'PT2VHF Sonde Finder');
$appId = (string)($_GET['app'] ?? $_POST['app'] ?? 'aprs-android');
if (!isset(PT2VHF_TESTERS_EXPORT_APPS[$appId])) $appId = 'aprs-android';
$appName = PT2VHF_TESTERS_EXPORT_APPS[$appId];
$path = dirname(__DIR__) . '/pt2vhf-private-data/testers-' . $appId . '.csv';

/** Lista de e-mails em minúsculas a partir de um campo com vírgulas, espaços ou quebras de linha. */
function pt2vhf_testers_emails(string $s): array {
    return array_values(array_filter(array_map(
        static fn($e) => strtolower(trim($e)),
        preg_split('/[\s,;]+/', $s)
    )));
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && is_file($path)) {
    $remove = pt2vhf_testers_emails((string)($_POST['remove'] ?? ''));
    $done = pt2vhf_testers_emails((string)($_POST['done'] ?? ''));
    $undone = pt2vhf_testers_emails((string)($_POST['undone'] ?? ''));
    $now = gmdate('Y-m-d\TH:i:s\Z');
    $fh = @fopen($path, 'c+');
    if ($fh && flock($fh, LOCK_EX)) {
        $keep = array();
        foreach (preg_split('/\r?\n/', (string)stream_get_contents($fh)) as $line) {
            if (trim($line) === '') continue;
            $cols = explode(',', $line);
            $email = strtolower(trim($cols[0]));
            if (in_array($email, $remove, true)) continue;
            $cols = array_pad(array_slice($cols, 0, 4), 4, '');
            if (in_array($email, $done, true) && trim($cols[3]) === '') $cols[3] = $now;
            if (in_array($email, $undone, true)) $cols[3] = '';
            $keep[] = implode(',', trim($cols[3]) === '' ? array_slice($cols, 0, 3) : $cols);
        }
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, $keep ? implode("\n", $keep) . "\n" : '');
        fflush($fh);
        flock($fh, LOCK_UN);
    }
    if ($fh) fclose($fh);
    if (strpos((string)($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json') !== false) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array('status' => 'ok'));
        exit;
    }
    header('Location: ?key=' . rawurlencode($key) . '&app=' . rawurlencode($appId), true, 303);
    exit;
}

$data = is_file($path) ? (string)@file_get_contents($path) : '';
$rows = array();
foreach (preg_split('/\r?\n/', $data) as $line) {
    $line = trim($line);
    if ($line === '') continue;
    $parts = explode(',', $line);
    $rows[] = array($parts[0] ?? '', $parts[1] ?? '', $parts[2] ?? '', $parts[3] ?? '');
}
$rows = array_reverse($rows); // mais recente primeiro

if (($_GET['format'] ?? '') === 'txt') {
    header('Content-Type: text/plain; charset=utf-8');
    foreach ($rows as $r) echo implode(',', $r) . "\n";
    exit;
}

$pending = array_values(array_filter($rows, static fn($r) => trim($r[3]) === ''));
header('Content-Type: text/html; charset=utf-8');
$h = static fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
$date = static fn(string $s): string => str_replace(array('T', 'Z'), array(' ', ''), $s);
?><!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Inscritos no teste — <?= $h($appName) ?></title>
<style>
  body { font: 15px/1.45 system-ui, sans-serif; margin: 16px; color: #1b1b1b; background: #fff; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  p { margin: 0 0 12px; color: #555; }
  table { border-collapse: collapse; width: 100%; max-width: 860px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #ddd; }
  th { font-size: 13px; color: #555; }
  td.n { color: #888; width: 2em; }
  tr.done td.d { text-decoration: line-through; color: #888; }
  textarea { width: 100%; max-width: 860px; height: 5em; margin-top: 8px; font: 13px monospace; }
  @media (prefers-color-scheme: dark) {
    body { color: #eee; background: #121212; } p, th { color: #aaa; } th, td { border-color: #333; }
    tr.done td.d { color: #777; }
    textarea { background: #1e1e1e; color: #eee; border-color: #333; }
  }
</style>
</head>
<body>
<p class="apps"><?php foreach (PT2VHF_TESTERS_EXPORT_APPS as $id => $label): ?><?= $id === $appId ? '<b>' . $h($label) . '</b>' : '<a href="?key=' . $h(rawurlencode($key)) . '&amp;app=' . $h($id) . '">' . $h($label) . '</a>' ?> &nbsp; <?php endforeach; ?></p>
<h1>Inscritos no teste fechado do <?= $h($appName) ?></h1>
<p><?= count($rows) ?> inscrições pelo formulário do site, <?= count($pending) ?> ainda não atendidas.
Linhas riscadas já foram atendidas (incluídas no Google Play e avisadas por e-mail). Mais recentes primeiro, datas em UTC.</p>
<table>
<thead><tr><th>#</th><th>E-mail</th><th>Indicativo</th><th>Inscrição</th><th>Atendido</th></tr></thead>
<tbody>
<?php $n = count($rows); foreach ($rows as $r): $isDone = trim($r[3]) !== ''; ?>
<tr<?= $isDone ? ' class="done"' : '' ?>><td class="n d"><?= $n-- ?></td><td class="d"><?= $h($r[0]) ?></td><td class="d"><?= $h($r[1]) ?></td><td class="d"><?= $h($date($r[2])) ?></td><td class="d"><?= $h($date($r[3])) ?></td></tr>
<?php endforeach; ?>
</tbody>
</table>
<p style="margin-top:16px">E-mails ainda não atendidos, separados por vírgula, para colar na lista da Play Console:</p>
<textarea readonly><?= $h(implode(', ', array_map(static fn($r) => $r[0], $pending))) ?></textarea>
</body>
</html>
