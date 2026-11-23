<?php
/**
 * PT2VHF — estatísticas de visitas ao site (uso exclusivo do mantenedor em /stats).
 *
 * Cada página carrega assets/js/visit.js, que envia um beacon para visit.php com o caminho,
 * a origem (só o domínio externo), o idioma e o fuso horário do navegador. Sem cookies.
 * Visitante único por dia = hash HMAC de (IP + User-Agent) com uma chave aleatória do dia;
 * a chave e os hashes somem na virada do dia UTC. Nenhum IP ou User-Agent é gravado:
 * do User-Agent ficam só as categorias (dispositivo, navegador, sistema).
 *
 * Dados fora de public_html (preservados em novos deploys):
 *   ../pt2vhf-private-data/visits-state.json      chave e hashes do dia
 *   ../pt2vhf-private-data/visits-AAAA-MM.json     totais diários do mês
 * Qualquer falha na coleta é silenciosa.
 */
declare(strict_types=1);

const PT2VHF_VISITS_MAX_VISITORS_PER_DAY = 100000;
const PT2VHF_VISITS_MAX_VIEWS_PER_VISITOR = 300;
const PT2VHF_VISITS_MAX_KEYS = 300; // teto de itens distintos por dimensão por dia

function pt2vhf_private_dir(): string {
    $env = getenv('PT2VHF_PRIVATE_DIR');
    return is_string($env) && $env !== '' ? rtrim($env, '/') : dirname(__DIR__) . '/pt2vhf-private-data';
}

function pt2vhf_visits_month_file(string $day): string {
    return pt2vhf_private_dir() . '/visits-' . substr($day, 0, 7) . '.json';
}

function pt2vhf_visits_is_bot(string $agent): bool {
    if ($agent === '') return true;
    return (bool)preg_match('/bot|crawl|spider|slurp|scrap|headless|lighthouse|pagespeed|preview|monitor|uptime|curl|wget|python|httpclient|java\/|go-http|facebookexternalhit|embedly|whatsapp|telegram|discord|skype|bing|yandex|baidu|semrush|ahrefs|mj12|petal|gptbot|claude|perplexity|bytespider/i', $agent);
}

function pt2vhf_visits_device(string $ua): string {
    if (preg_match('/iPad|Tablet|Android(?!.*Mobile)/i', $ua)) return 'Tablet';
    if (preg_match('/Mobi|iPhone|iPod|Android/i', $ua)) return 'Celular';
    return 'Computador';
}

function pt2vhf_visits_browser(string $ua): string {
    $map = array(
        'Edge' => '/Edg(e|A|iOS)?\//', 'Opera' => '/OPR\/|Opera/', 'Samsung Internet' => '/SamsungBrowser/',
        'Firefox' => '/Firefox\/|FxiOS/', 'Chrome' => '/Chrome\/|CriOS/', 'Safari' => '/Safari\//',
    );
    foreach ($map as $name => $re) if (preg_match($re, $ua)) return $name;
    return 'Outro';
}

function pt2vhf_visits_os(string $ua): string {
    $map = array(
        'Android' => '/Android/', 'iOS' => '/iPhone|iPad|iPod/', 'Windows' => '/Windows/',
        'macOS' => '/Mac OS X|Macintosh/', 'ChromeOS' => '/CrOS/', 'Linux' => '/Linux|X11/',
    );
    foreach ($map as $name => $re) if (preg_match($re, $ua)) return $name;
    return 'Outro';
}

/** Limpa um texto vindo do navegador: curto, só caracteres seguros. */
function pt2vhf_visits_clean(string $value, string $pattern, int $max): string {
    $value = trim(substr($value, 0, $max));
    return preg_match($pattern, $value) ? $value : '';
}

function pt2vhf_visits_bump(array &$bucket, string $key, int $by = 1): void {
    if ($key === '') return;
    if (!isset($bucket[$key]) && count($bucket) >= PT2VHF_VISITS_MAX_KEYS) $key = '(outros)';
    $bucket[$key] = (int)($bucket[$key] ?? 0) + $by;
}

/** Abre um JSON com trava exclusiva e devolve [handle, dados] ou null. */
function pt2vhf_visits_open(string $path, array $empty): ?array {
    $dir = dirname($path);
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) return null;
    $fh = @fopen($path, 'c+');
    if ($fh === false) return null;
    if (!flock($fh, LOCK_EX)) { fclose($fh); return null; }
    $raw = stream_get_contents($fh);
    if (!is_string($raw) || trim($raw) === '') return array($fh, $empty);
    $data = json_decode($raw, true);
    if (!is_array($data) || ($data['schema'] ?? null) !== 1) { // inválido: nunca sobrescrever
        flock($fh, LOCK_UN);
        fclose($fh);
        return null;
    }
    return array($fh, $data);
}

function pt2vhf_visits_close($fh, ?array $data): void {
    if ($data !== null) {
        $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if (is_string($json)) {
            rewind($fh);
            ftruncate($fh, 0);
            fwrite($fh, $json);
            fflush($fh);
        }
    }
    flock($fh, LOCK_UN);
    fclose($fh);
}

/**
 * Registra uma visualização de página. $hit: path, ref (domínio), lang, tz, country.
 * Devolve true quando contou.
 */
function pt2vhf_visits_record(array $hit, string $ip, string $agent, ?int $now = null): bool {
    if ($ip === '' || pt2vhf_visits_is_bot($agent)) return false;
    $now = $now ?? time();
    $day = gmdate('Y-m-d', $now);

    $state = pt2vhf_visits_open(pt2vhf_private_dir() . '/visits-state.json', array('schema' => 1));
    if ($state === null) return false;
    [$sfh, $s] = $state;
    if (($s['day'] ?? '') !== $day || !is_string($s['key'] ?? null) || strlen($s['key']) !== 64) {
        $s = array('schema' => 1, 'day' => $day, 'key' => bin2hex(random_bytes(32)), 'seen' => array());
    }
    if (!is_array($s['seen'] ?? null)) $s['seen'] = array();
    $hash = substr(hash_hmac('sha256', $ip . "\n" . substr($agent, 0, 300), $s['key']), 0, 16);
    $views = (int)($s['seen'][$hash] ?? 0);
    $isNew = $views === 0;
    if ($views >= PT2VHF_VISITS_MAX_VIEWS_PER_VISITOR || ($isNew && count($s['seen']) >= PT2VHF_VISITS_MAX_VISITORS_PER_DAY)) {
        pt2vhf_visits_close($sfh, null);
        return false;
    }
    $s['seen'][$hash] = $views + 1;
    pt2vhf_visits_close($sfh, $s);

    $month = pt2vhf_visits_open(pt2vhf_visits_month_file($day), array('schema' => 1, 'days' => array()));
    if ($month === null) return false;
    [$mfh, $m] = $month;
    if (!is_array($m['days'] ?? null)) $m['days'] = array();
    $d = is_array($m['days'][$day] ?? null) ? $m['days'][$day] : array();
    foreach (array('pages', 'entries', 'refs', 'hours', 'devices', 'browsers', 'os', 'langs', 'tz', 'countries') as $k) {
        if (!is_array($d[$k] ?? null)) $d[$k] = array();
    }
    $d['views'] = (int)($d['views'] ?? 0) + 1;
    pt2vhf_visits_bump($d['pages'], (string)($hit['path'] ?? ''));
    // Hora em Brasília (UTC-3, sem horário de verão desde 2019)
    pt2vhf_visits_bump($d['hours'], (string)(int)gmdate('G', $now - 3 * 3600));
    if ($isNew) {
        $d['visitors'] = (int)($d['visitors'] ?? 0) + 1;
        pt2vhf_visits_bump($d['entries'], (string)($hit['path'] ?? ''));
        pt2vhf_visits_bump($d['refs'], (string)($hit['ref'] ?? '') !== '' ? (string)$hit['ref'] : '(direto)');
        pt2vhf_visits_bump($d['devices'], pt2vhf_visits_device($agent));
        pt2vhf_visits_bump($d['browsers'], pt2vhf_visits_browser($agent));
        pt2vhf_visits_bump($d['os'], pt2vhf_visits_os($agent));
        pt2vhf_visits_bump($d['langs'], (string)($hit['lang'] ?? '') ?: '(desconhecido)');
        pt2vhf_visits_bump($d['tz'], (string)($hit['tz'] ?? '') ?: '(desconhecido)');
        if (($hit['country'] ?? '') !== '') pt2vhf_visits_bump($d['countries'], (string)$hit['country']);
    }
    $m['days'][$day] = $d;
    pt2vhf_visits_close($mfh, $m);
    return true;
}

/** Totais diários do período [hoje - $days + 1, hoje], em ordem cronológica. */
function pt2vhf_visits_range(int $days, ?int $now = null): array {
    $now = $now ?? time();
    $months = array();
    $out = array();
    for ($i = $days - 1; $i >= 0; $i--) {
        $day = gmdate('Y-m-d', $now - $i * 86400);
        $ym = substr($day, 0, 7);
        if (!array_key_exists($ym, $months)) {
            $raw = @file_get_contents(pt2vhf_visits_month_file($day));
            $json = is_string($raw) ? json_decode($raw, true) : null;
            $months[$ym] = is_array($json['days'] ?? null) ? $json['days'] : array();
        }
        $out[$day] = is_array($months[$ym][$day] ?? null) ? $months[$ym][$day] : array();
    }
    return $out;
}
