<?php
/**
 * www.pt2vhf.com/stats — painel de visitas do site para o mantenedor.
 * Sem senha, a pedido do mantenedor: não tem link no site, fica fora do sitemap e pede aos buscadores
 * para não indexar. Dados de visits_lib.php, downloads.json e installs.json.
 */
declare(strict_types=1);
require_once __DIR__ . '/visits_lib.php';
require_once __DIR__ . '/installs_lib.php';
require_once __DIR__ . '/mail_lib.php';

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

function h($s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function n($v): string { return number_format((float)$v, 0, ',', '.'); }

// Botão "Testar e-mail do site": envia um teste ao mantenedor e reenvia as mensagens de contato guardadas.
// Só envia para o e-mail fixo do mantenedor; no máximo 10 vezes por dia (a página não tem senha).
$mailResult = null;
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['action'] ?? '') === 'mailtest') {
    $limitPath = pt2vhf_private_dir() . '/stats-mailtest.json';
    $lim = json_decode((string)@file_get_contents($limitPath), true);
    $today = gmdate('Y-m-d');
    $count = (is_array($lim) && ($lim['day'] ?? '') === $today) ? (int)($lim['count'] ?? 0) : 0;
    if ($count >= 10) {
        $mailResult = array('ok' => false, 'text' => 'Limite de 10 testes por dia atingido. Tente amanhã.');
    } else {
        @file_put_contents($limitPath, json_encode(array('day' => $today, 'count' => $count + 1)), LOCK_EX);
        $err = null; $via = '';
        $ok = pt2vhf_send_mail(pt2vhf_contact_recipient(), 'PT2VHF: teste do e-mail do site',
            "Este é um teste do envio de e-mail do site www.pt2vhf.com, pedido no painel /stats.\n"
            . "Se chegou, o formulário de contato e os avisos de testadores também chegam.\n\n"
            . 'Data (UTC): ' . gmdate('Y-m-d H:i') . "\n", '', '', $err, $via);
        $text = $ok ? 'E-mail de teste enviado para ' . pt2vhf_contact_recipient() . ' (via ' . ($via === 'smtp' ? 'SMTP' : 'mail() do PHP') . ').'
                    : 'O envio falhou: ' . $err . '.';
        if ($ok) {
            $flush = pt2vhf_contact_flush_stored(pt2vhf_contact_recipient());
            if ($flush['sent'] > 0) $text .= ' Mensagens guardadas reenviadas: ' . $flush['sent'] . '.';
            if ($flush['left'] > 0) $text .= ' Continuam guardadas: ' . $flush['left'] . ($flush['error'] ? ' (' . $flush['error'] . ')' : '') . '.';
        }
        $mailResult = array('ok' => $ok, 'text' => $text);
    }
}

// ---- Dados do período ----
$periods = array(1 => 'Hoje', 7 => '7 dias', 30 => '30 dias', 90 => '90 dias', 365 => '1 ano');
$days = (int)($_GET['d'] ?? 30);
if (!isset($periods[$days])) $days = 30;
$range = pt2vhf_visits_range($days);
$today = gmdate('Y-m-d');

$totals = array('views' => 0, 'visitors' => 0);
$dims = array();
foreach (array('pages', 'entries', 'refs', 'countries', 'tz', 'langs', 'devices', 'browsers', 'os', 'hours') as $k) $dims[$k] = array();
foreach ($range as $d) {
    $totals['views'] += (int)($d['views'] ?? 0);
    $totals['visitors'] += (int)($d['visitors'] ?? 0);
    foreach ($dims as $k => $_) {
        foreach ((array)($d[$k] ?? array()) as $key => $v) $dims[$k][$key] = ($dims[$k][$key] ?? 0) + (int)$v;
    }
}
$firstDay = null;
foreach ($range as $day => $d) if (!empty($d)) { $firstDay = $day; break; }
$activeDays = $firstDay === null ? 0 : count(array_filter(array_keys($range), function ($d) use ($firstDay) { return $d >= $firstDay; }));
$avg = $activeDays ? $totals['visitors'] / $activeDays : 0;
$todayVisitors = (int)($range[$today]['visitors'] ?? 0);
$pagesPerVisitor = $totals['visitors'] ? $totals['views'] / $totals['visitors'] : 0;

// Downloads acumulados (todas as datas) e instalações ativas (média de 7 dias)
$products = array();
$manifest = json_decode((string)@file_get_contents(__DIR__ . '/updates.json'), true);
foreach ((array)($manifest['products'] ?? array()) as $id => $p) $products[$id] = (string)($p['name'] ?? $id);
$downloads = array();
$dl = json_decode((string)@file_get_contents(pt2vhf_private_dir() . '/downloads.json'), true);
foreach ((array)($dl['counts'] ?? array()) as $id => $cats) {
    $downloads[$id] = array_sum(array_map('intval', (array)$cats));
}
arsort($downloads);
$installs = array();
foreach (PT2VHF_INSTALLS_PRODUCTS as $id) {
    $s = pt2vhf_installs_summary($id);
    if ($s) $installs[$id] = array('avg' => $s['average7'], 'today' => $s['today']);
}
uasort($installs, function ($a, $b) { return $b['avg'] <=> $a['avg']; });

function product_name(string $id, array $products): string {
    return preg_replace('/^PT2VHF\s+/', '', $products[$id] ?? $id);
}

function rank_table(string $title, string $col, array $rows, string $unit, int $limit = 12, ?callable $label = null, ?callable $html = null, string $note = ''): string {
    arsort($rows);
    $total = array_sum($rows);
    $out = '<section class="panel"><h2>' . h($title) . '</h2>';
    $foot = $note !== '' ? '<p class="note">' . $note . '</p>' : '';
    if (!$rows) return $out . '<p class="empty">Sem dados no período.</p>' . $foot . '</section>';
    $max = max($rows);
    $out .= '<table><thead><tr><th scope="col">' . h($col) . '</th><th scope="col" class="num">' . h($unit) . '</th><th scope="col" class="num">%</th></tr></thead><tbody>';
    foreach (array_slice($rows, 0, $limit, true) as $k => $v) {
        $w = $max ? max(1, round($v / $max * 100)) : 0;
        $out .= '<tr><td><span class="bar" style="--w:' . $w . '%"></span><span class="lbl">' . ($html ? $html((string)$k) : h($label ? $label((string)$k) : $k)) . '</span></td>'
            . '<td class="num">' . n($v) . '</td><td class="num muted">' . ($total ? number_format($v / $total * 100, 1, ',', '.') : '0') . '</td></tr>';
    }
    $rest = array_slice($rows, $limit, null, true);
    if ($rest) $out .= '<tr class="rest"><td>Mais ' . count($rest) . '</td><td class="num">' . n(array_sum($rest)) . '</td><td></td></tr>';
    return $out . '</tbody></table>' . $foot . '</section>';
}

// País: bandeira (assets/img/flags/country) e nome em português; sem a extensão intl, o nome sai pelo navegador.
$countryCell = function (string $cc): string {
    if (!preg_match('/^[A-Z]{2}$/', $cc)) return h($cc);
    $flag = is_file(__DIR__ . '/assets/img/flags/country/' . strtolower($cc) . '.svg')
        ? '<img class="flag" src="/assets/img/flags/country/' . strtolower($cc) . '.svg" alt="" width="20" height="15" loading="lazy">' : '';
    $name = class_exists('Locale') ? (string)\Locale::getDisplayRegion('-' . $cc, 'pt_BR') : '';
    return $flag . '<span data-cc="' . $cc . '">' . h($name !== '' && $name !== $cc ? $name : $cc) . '</span>';
};
$pageName = function (string $p): string { return $p === '/' ? '/ (início)' : $p; };
$dateBr = function (string $d): string { return substr($d, 8, 2) . '/' . substr($d, 5, 2) . '/' . substr($d, 0, 4); };

// Gráfico de visitantes por dia (SVG, uma série)
$series = array();
foreach ($range as $day => $d) $series[] = array($day, (int)($d['visitors'] ?? 0), (int)($d['views'] ?? 0));
$maxV = max(1, max(array_column($series, 1)));
$step = $maxV <= 5 ? 1 : ($maxV <= 20 ? 5 : ($maxV <= 100 ? 20 : ($maxV <= 500 ? 100 : ($maxV <= 2000 ? 500 : 1000))));
$top = (int)(ceil($maxV / $step) * $step);
$W = 1000; $H = 240; $padL = 44; $padB = 26; $padT = 8;
$plotW = $W - $padL - 6; $plotH = $H - $padB - $padT;
$cnt = count($series);
$slot = $plotW / max(1, $cnt);
$gap = $cnt > 120 ? 0.5 : 2;
$barW = max(1, $slot - $gap);

$hours = array();
for ($i = 0; $i < 24; $i++) $hours[$i] = (int)($dims['hours'][(string)$i] ?? 0);
$maxH = max(1, max($hours));
?><!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>PT2VHF — Estatísticas</title>
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<style>
:root{--bg:#f6f8fb;--surface:#fff;--text:#0f1b2d;--muted:#5a6a80;--border:#d5deea;--grid:#e6ecf3;--accent:#0a7f6f;--accent-soft:#d8f2ee;--on-accent:#fff;--warn:#b45309}
@media (prefers-color-scheme:dark){:root{--bg:#0b1220;--surface:#131e33;--text:#e6edf8;--muted:#9fb0c8;--border:#23314b;--grid:#1c2940;--accent:#35d6b6;--accent-soft:#123a3a;--on-accent:#062520;--warn:#f0b35a}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:20px 16px 60px}
header{display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;justify-content:space-between;margin-bottom:18px}
h1{font-size:1.35rem;margin:0}
nav.periods{display:flex;gap:4px;flex-wrap:wrap}
nav.periods a{padding:6px 12px;border-radius:6px;color:var(--text);text-decoration:none;border:1px solid var(--border);background:var(--surface);font-size:.9rem}
nav.periods a[aria-current]{background:var(--accent);border-color:var(--accent);color:var(--on-accent);font-weight:600}
a:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:12px}
.kpi{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 16px}
.kpi b{display:block;font-size:1.8rem;line-height:1.15;font-variant-numeric:tabular-nums}
.kpi span{color:var(--muted);font-size:.85rem}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px;min-width:0}
.panel h2{font-size:1rem;margin:0 0 10px}
.note{color:var(--muted);font-size:.85rem;margin:6px 0 0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px;margin-top:12px}
.chart{position:relative}
.chart{overflow-x:auto}
.chart svg{display:block;width:100%;min-width:640px;height:auto}
.chart .tick{fill:var(--muted);font-size:12px}
.chart .gl{stroke:var(--grid);stroke-width:1}
.chart .b{fill:var(--accent)}
.chart .hit{fill:transparent;cursor:default}
.chart .hit:hover+.b,.chart .b.on{opacity:.75}
.tip{position:absolute;pointer-events:none;background:var(--text);color:var(--bg);padding:6px 9px;border-radius:6px;font-size:.82rem;white-space:nowrap;transform:translate(-50%,-110%);display:none}
table{width:100%;border-collapse:collapse;font-size:.9rem}
th{font-weight:600;color:var(--muted);text-align:left;font-size:.8rem;padding:4px 6px;border-bottom:1px solid var(--border)}
td{padding:5px 6px;border-bottom:1px solid var(--grid);position:relative}
td:first-child{max-width:0;width:100%}
.lbl{position:relative;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.flag{vertical-align:-2px;margin-right:8px;border-radius:2px;box-shadow:0 0 0 1px var(--border)}
.note a{color:inherit}
.bar{position:absolute;left:0;top:3px;bottom:3px;width:var(--w);background:var(--accent-soft);border-radius:0 4px 4px 0}
.num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.muted{color:var(--muted)}
tr.rest td{color:var(--muted)}
.empty{color:var(--muted);margin:0}
.hours{display:grid;grid-template-columns:repeat(24,1fr);gap:2px;align-items:end;height:110px;margin-top:6px}
.hours div{background:var(--accent);border-radius:3px 3px 0 0;min-height:1px}
.hours-x{display:grid;grid-template-columns:repeat(24,1fr);gap:2px;color:var(--muted);font-size:.7rem;text-align:center}
.settings{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;margin-top:12px}
button{padding:8px 14px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:var(--on-accent);font:inherit;font-weight:600;cursor:pointer}
button.ghost{background:transparent;color:var(--text);border-color:var(--border);font-weight:500}
.switch{display:flex;gap:10px;align-items:center;margin-top:6px}
.mail-result{padding:8px 12px;border-radius:6px;border:1px solid var(--border)}
.mail-result.is-ok{border-color:var(--accent)}
.mail-result.is-err{border-color:#d97706}
code{font-size:.85em;overflow-wrap:anywhere}
@media (max-width:560px){.kpi{padding:12px}.kpi b{font-size:1.4rem}.grid{grid-template-columns:1fr}}
</style></head><body><div class="wrap">
<header>
  <h1>Visitas ao www.pt2vhf.com</h1>
  <nav class="periods" aria-label="Período">
    <?php foreach ($periods as $k => $label): ?><a href="/stats?d=<?= $k ?>"<?= $k === $days ? ' aria-current="page"' : '' ?>><?= h($label) ?></a><?php endforeach; ?>
  </nav>
</header>

<div class="kpis">
  <div class="kpi"><b><?= n($totals['visitors']) ?></b><span>visitantes (soma dos dias)</span></div>
  <div class="kpi"><b><?= n($totals['views']) ?></b><span>páginas vistas</span></div>
  <div class="kpi"><b><?= number_format($avg, $avg < 10 ? 1 : 0, ',', '.') ?></b><span>visitantes por dia, em média</span></div>
  <div class="kpi"><b><?= number_format($pagesPerVisitor, 1, ',', '.') ?></b><span>páginas por visitante</span></div>
  <div class="kpi"><b><?= n($todayVisitors) ?></b><span>visitantes hoje (desde 0h UTC)</span></div>
</div>

<?php if ($days > 1): ?>
<section class="panel">
  <h2>Visitantes por dia</h2>
  <div class="chart" id="chart">
    <svg viewBox="0 0 <?= $W ?> <?= $H ?>" role="img" aria-label="Visitantes por dia nos últimos <?= $days ?> dias">
      <?php for ($y = 0; $y <= $top; $y += $step): $py = $padT + $plotH - $y / $top * $plotH; ?>
        <line class="gl" x1="<?= $padL ?>" x2="<?= $W ?>" y1="<?= round($py, 1) ?>" y2="<?= round($py, 1) ?>"/>
        <text class="tick" x="<?= $padL - 8 ?>" y="<?= round($py + 4, 1) ?>" text-anchor="end"><?= n($y) ?></text>
      <?php endfor; ?>
      <?php $labelEvery = max(1, (int)ceil($cnt / 8));
      foreach ($series as $i => [$day, $v, $views]):
        $x = $padL + $i * $slot + $gap / 2; $bh = $v / $top * $plotH; $by = $padT + $plotH - $bh; ?>
        <rect class="hit" x="<?= round($padL + $i * $slot, 2) ?>" y="<?= $padT ?>" width="<?= round($slot, 2) ?>" height="<?= $plotH ?>" data-t="<?= h($dateBr($day) . ' — ' . n($v) . ' visitantes, ' . n($views) . ' páginas') ?>"/>
        <?php if ($v > 0): ?><path class="b" d="M<?= round($x, 2) ?> <?= round($padT + $plotH, 2) ?>V<?= round($by + min(4, $bh), 2) ?>q0 -<?= round(min(4, $bh), 2) ?> <?= round(min(4, $barW / 2), 2) ?> -<?= round(min(4, $bh), 2) ?>H<?= round($x + $barW - min(4, $barW / 2), 2) ?>q<?= round(min(4, $barW / 2), 2) ?> 0 <?= round(min(4, $barW / 2), 2) ?> <?= round(min(4, $bh), 2) ?>V<?= round($padT + $plotH, 2) ?>Z"/><?php endif; ?>
        <?php if ($i % $labelEvery === 0): ?><text class="tick" x="<?= round($x + $barW / 2, 2) ?>" y="<?= $H - 6 ?>" text-anchor="middle"><?= h(substr($day, 8, 2) . '/' . substr($day, 5, 2)) ?></text><?php endif; ?>
      <?php endforeach; ?>
    </svg>
    <div class="tip" id="tip"></div>
  </div>
  <p class="note">Visitante = combinação de IP e navegador num dia (UTC). A mesma pessoa em dias diferentes conta em cada dia; por isso o total do período é a soma dos dias.</p>
</section>
<?php endif; ?>

<div class="grid">
  <?= rank_table('Páginas mais vistas', 'Página', $dims['pages'], 'Vistas', 15, $pageName) ?>
  <?= rank_table('Página de entrada', 'Página', $dims['entries'], 'Visitantes', 10, $pageName) ?>
  <?= rank_table('Origem', 'Site', $dims['refs'], 'Visitantes', 15) ?>
  <?= rank_table('País', 'País', $dims['countries'], 'Visitantes', 20, null, $countryCell, 'País estimado pelo IP na hora da visita (o IP não é gravado). <a href="https://db-ip.com/">IP Geolocation by DB-IP</a>.') ?>
  <?= rank_table('Fuso horário do navegador', 'Fuso', $dims['tz'], 'Visitantes', 15) ?>
  <?= rank_table('Idioma do navegador', 'Idioma', $dims['langs'], 'Visitantes', 12) ?>
  <?= rank_table('Dispositivo', 'Tipo', $dims['devices'], 'Visitantes') ?>
  <?= rank_table('Navegador', 'Nome', $dims['browsers'], 'Visitantes') ?>
  <?= rank_table('Sistema', 'Nome', $dims['os'], 'Visitantes') ?>
  <section class="panel">
    <h2>Horário das visitas (Brasília)</h2>
    <?php if (array_sum($hours) === 0): ?><p class="empty">Sem dados no período.</p><?php else: ?>
    <div class="hours" role="img" aria-label="Páginas vistas por hora do dia, horário de Brasília">
      <?php foreach ($hours as $hr => $v): ?><div style="height:<?= max(1, round($v / $maxH * 100)) ?>%" title="<?= sprintf('%02dh', $hr) ?>: <?= n($v) ?> páginas"></div><?php endforeach; ?>
    </div>
    <div class="hours-x" aria-hidden="true"><?php for ($i = 0; $i < 24; $i++): ?><span><?= $i % 3 === 0 ? $i : '' ?></span><?php endfor; ?></div>
    <?php endif; ?>
  </section>
</div>

<div class="grid">
  <section class="panel">
    <h2>Downloads acumulados (todas as datas)</h2>
    <?php if (!$downloads): ?><p class="empty">Contador de downloads indisponível.</p><?php else: ?>
    <table><thead><tr><th scope="col">Projeto</th><th scope="col" class="num">Downloads</th></tr></thead><tbody>
      <?php foreach ($downloads as $id => $v): ?><tr><td><span class="lbl"><?= h(product_name((string)$id, $products)) ?></span></td><td class="num"><?= n($v) ?></td></tr><?php endforeach; ?>
      <tr><td><b>Total</b></td><td class="num"><b><?= n(array_sum($downloads)) ?></b></td></tr>
    </tbody></table>
    <p class="note">Site e atualizações automáticas, uma vez por download.</p>
    <?php endif; ?>
  </section>
  <section class="panel">
    <h2>Instalações ativas por dia</h2>
    <?php if (!$installs): ?><p class="empty">Contagem indisponível.</p><?php else: ?>
    <table><thead><tr><th scope="col">Projeto</th><th scope="col" class="num">Média 7 dias</th><th scope="col" class="num">Hoje</th></tr></thead><tbody>
      <?php foreach ($installs as $id => $r): ?><tr><td><span class="lbl"><?= h(product_name((string)$id, $products)) ?></span></td><td class="num"><?= n($r['avg']) ?></td><td class="num muted"><?= n($r['today']) ?></td></tr><?php endforeach; ?>
    </tbody></table>
    <p class="note">Aplicativos que consultaram atualização (update.php), por IP e navegador.</p>
    <?php endif; ?>
  </section>
</div>

<div class="settings">
  <?php
  $msgFile = pt2vhf_private_dir() . '/contact-messages.jsonl';
  $msgLines = is_file($msgFile) ? array_values(array_filter(array_map('trim', (array)@file($msgFile)))) : array();
  $msgLast = $msgLines ? json_decode((string)end($msgLines), true) : null;
  ?>
  <?php $smtpProblem = null; $smtp = pt2vhf_smtp_config($smtpProblem); ?>
  <section class="panel" id="email">
    <h2>E-mail do site</h2>
    <?php if ($smtp): ?>
      <p>Envio por SMTP: <b><?= h($smtp['host']) ?></b>, porta <?= (int)$smtp['port'] ?> (<?= h(strtoupper($smtp['security'])) ?>), conta <?= h(preg_replace('/^(.).*(@.*)$/', '$1***$2', $smtp['username'])) ?>, remetente <?= h($smtp['from']) ?>, destino do formulário <?= h(pt2vhf_contact_recipient()) ?>.</p>
    <?php elseif ($smtpProblem): ?>
      <p>A configuração de e-mail tem um problema: <b><?= h($smtpProblem) ?></b>. Confira o arquivo <code>pt2vhf-private-data/smtp.env</code>.</p>
    <?php else:
      $misplaced = array();
      foreach (array(__DIR__ . '/smtp.env', __DIR__ . '/smtp.env.txt', __DIR__ . '/.env', __DIR__ . '/pt2vhf-private-data/smtp.env', pt2vhf_private_dir() . '/smtp.env.txt', pt2vhf_private_dir() . '/.env') as $f) {
          if (is_file($f)) $misplaced[] = basename(dirname($f)) . '/' . basename($f);
      } ?>
      <p>Sem SMTP configurado: o site tenta o <code>mail()</code> do PHP, que a Hostinger não entrega. Crie <code>pt2vhf-private-data/smtp.env</code> (modelo em <code>.env.example</code>).</p>
      <?php if ($misplaced): ?><p class="mail-result is-err">Achei um arquivo de configuração no lugar ou nome errado: <code><?= h(implode(', ', $misplaced)) ?></code>. Ele precisa se chamar <code>smtp.env</code> e ficar em <code>pt2vhf-private-data</code>, na pasta acima do <code>public_html</code>.</p><?php endif; ?>
    <?php endif; ?>
    <?php if ($mailResult): ?><p class="mail-result <?= $mailResult['ok'] ? 'is-ok' : 'is-err' ?>" role="status"><?= h($mailResult['text']) ?></p><?php endif; ?>
    <form method="post" action="/stats#email"><input type="hidden" name="action" value="mailtest">
      <button type="submit">Enviar e-mail de teste</button></form>
    <p class="note">Envia só para <?= h(pt2vhf_contact_recipient()) ?>. Se der certo, também reenvia as mensagens de contato guardadas.</p>
  </section>
  <section class="panel">
    <h2>Mensagens de contato guardadas</h2>
    <?php if (!$msgLines): ?><p class="empty">Nenhuma.</p>
    <?php else: ?><p><b><?= n(count($msgLines)) ?></b> mensage<?= count($msgLines) === 1 ? 'm' : 'ns' ?> que o servidor não conseguiu enviar por e-mail<?= is_array($msgLast) && isset($msgLast['date']) ? ' (última em ' . h($dateBr(substr((string)$msgLast['date'], 0, 10))) . ')' : '' ?>.</p>
    <p class="note">O conteúdo não aparece aqui porque esta página não tem senha. Leia no hPanel, em Gerenciador de arquivos: <code>pt2vhf-private-data/contact-messages.jsonl</code> (fora do public_html).</p><?php endif; ?>
  </section>
  <section class="panel">
    <h2>Seus acessos</h2>
    <p class="note" id="optout-state"></p>
    <div class="switch"><button type="button" class="ghost" id="optout"></button></div>
    <p class="note">Vale só para este navegador. Faça o mesmo no celular e nos outros computadores.</p>
  </section>
</div>
</div>
<script>
(function () {
  var chart = document.getElementById("chart"), tip = document.getElementById("tip");
  if (chart && tip) {
    chart.addEventListener("mousemove", function (e) {
      var t = e.target.getAttribute && e.target.getAttribute("data-t");
      if (!t) { tip.style.display = "none"; return; }
      var box = chart.getBoundingClientRect();
      tip.textContent = t; tip.style.display = "block";
      tip.style.left = Math.min(Math.max(e.clientX - box.left, 90), box.width - 90) + "px";
      tip.style.top = (e.clientY - box.top) + "px";
    });
    chart.addEventListener("mouseleave", function () { tip.style.display = "none"; });
  }
  if (window.Intl && Intl.DisplayNames) {
    var names = new Intl.DisplayNames(["pt-BR"], { type: "region" });
    document.querySelectorAll("[data-cc]").forEach(function (el) {
      if (el.textContent === el.getAttribute("data-cc")) { try { el.textContent = names.of(el.textContent); } catch (e) {} }
    });
  }
  var btn = document.getElementById("optout"), state = document.getElementById("optout-state");
  function off() { return /(?:^|;\s*)pt2vhf_nostats=1/.test(document.cookie); }
  function paint() {
    state.textContent = off() ? "Este navegador não entra nas estatísticas." : "Este navegador está sendo contado nas estatísticas.";
    btn.textContent = off() ? "Voltar a contar este navegador" : "Não contar este navegador";
  }
  btn.addEventListener("click", function () {
    document.cookie = off() ? "pt2vhf_nostats=; Max-Age=0; Path=/; SameSite=Lax; Secure"
                            : "pt2vhf_nostats=1; Max-Age=34560000; Path=/; SameSite=Lax; Secure";
    paint();
  });
  paint();
})();
</script>
</body></html>
