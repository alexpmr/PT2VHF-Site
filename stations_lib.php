<?php
/**
 * PT2VHF — registro das estações (indicativos) que usam os aplicativos.
 *
 * O aplicativo envia somente o indicativo na consulta de versão:
 *   update.php?product=sat&call=PY2XYZ   (SAT Tool)
 *   update.php?product=prop&call=PY2XYZ  (Prop Tool)
 * Guardamos indicativo, país (pelo prefixo DXCC) e datas da primeira/última
 * consulta. Nenhum endereço IP é gravado: o limite por IP usa um hash HMAC
 * com chave aleatória que é descartada (junto com os hashes) a cada dia UTC.
 * Os registros são permanentes: uma estação vista uma única vez fica na lista.
 * Arquivo de dados fora de public_html, preservado em novos deploys.
 * Qualquer falha aqui é silenciosa: a resposta do update.php não muda.
 */
declare(strict_types=1);

const PT2VHF_STATION_PRODUCTS = array('sat', 'prop');   // SAT Tool (v1.8.0) e Prop Tool
const PT2VHF_STATION_NEW_PER_IP_DAY = 10;   // indicativos novos por IP por dia
const PT2VHF_STATION_NEW_PER_DAY = 300;     // indicativos novos por dia, total
const PT2VHF_STATION_MAX = 50000;           // teto de registros por produto

function pt2vhf_station_file(): string {
    return dirname(__DIR__) . '/pt2vhf-private-data/stations.json';
}

/** Normaliza e valida; devolve null se não parecer um indicativo. */
function pt2vhf_station_normalize($raw): ?string {
    if (!is_string($raw)) return null;
    $call = strtoupper(trim($raw));
    if ($call === '' || strlen($call) > 16) return null;
    if (!preg_match('~^(?=.*[0-9])(?=.*[A-Z])[A-Z0-9]{1,8}(?:/[A-Z0-9]{1,8}){0,2}$~D', $call)) return null;
    $base = pt2vhf_station_base($call);
    if (in_array($base, array('NOCALL', 'N0CALL', 'MYCALL', 'CALLSIGN', 'TEST', 'PY0XXX'), true)) return null;
    return $call;
}

/** Parte do indicativo sem os sufixos /P, /M, /QRP etc. (a mais longa). */
function pt2vhf_station_base(string $call): string {
    $parts = explode('/', $call);
    usort($parts, function ($a, $b) { return strlen($b) - strlen($a); });
    return $parts[0];
}

/** Parte que define o país: CT/PY2XYZ/P -> CT; W1AW/KH6 -> KH6; PY2XYZ/P -> PY2XYZ. */
function pt2vhf_station_country_part(string $call): string {
    $suffixes = array('P', 'M', 'MM', 'AM', 'QRP', 'QRPP', 'A', 'B', 'R', 'LH', 'J', 'E', 'T');
    $parts = array_values(array_filter(explode('/', $call), function ($p) use ($suffixes) {
        return !in_array($p, $suffixes, true) && !preg_match('/^[0-9]$/D', $p);
    }));
    if (!$parts) return explode('/', $call)[0];
    usort($parts, function ($a, $b) { return strlen($a) - strlen($b); });
    return $parts[0];
}

/** [ISO 3166-1, entidade DXCC] pelo prefixo mais longo, ou null. */
function pt2vhf_station_country(string $call): ?array {
    static $table = null;
    if ($table === null) $table = require __DIR__ . '/stations_prefixes.php';
    $part = pt2vhf_station_country_part($call);
    for ($n = min(strlen($part), 6); $n >= 1; $n--) {
        $prefix = substr($part, 0, $n);
        if (isset($table[$prefix])) return $table[$prefix];
    }
    return null;
}

function pt2vhf_station_empty(): array {
    return array('schema' => 1, 'products' => array(), 'limits' => array());
}

function pt2vhf_station_decode($contents): ?array {
    if (!is_string($contents) || trim($contents) === '') return pt2vhf_station_empty();
    $data = json_decode($contents, true);
    if (!is_array($data) || ($data['schema'] ?? null) !== 1 || !is_array($data['products'] ?? null)) return null;
    if (!is_array($data['limits'] ?? null)) $data['limits'] = array();
    return $data;
}

/**
 * Chamado pelo update.php. Uma gravação por indicativo por dia: as consultas
 * de 15 em 15 minutos só atualizam a data da última consulta.
 */
function pt2vhf_station_seen(string $product, $rawCall, string $ip): void {
    if (!in_array($product, PT2VHF_STATION_PRODUCTS, true)) return;
    $call = pt2vhf_station_normalize($rawCall);
    if ($call === null) return;
    $today = gmdate('Y-m-d');
    $path = pt2vhf_station_file();

    // Caminho rápido: já visto hoje, nada a gravar.
    $existing = @file_get_contents($path);
    if (is_string($existing) && $existing !== '') {
        $data = pt2vhf_station_decode($existing);
        if ($data !== null && (($data['products'][$product][$call]['last'] ?? '') === $today)) return;
    }

    $dir = dirname($path);
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) return;
    $fh = @fopen($path, 'c+');
    if ($fh === false) return;
    try {
        if (!flock($fh, LOCK_EX)) return;
        $data = pt2vhf_station_decode(stream_get_contents($fh));
        if ($data === null) return; // arquivo inválido: nunca sobrescrever
        if (!is_array($data['products'][$product] ?? null)) $data['products'][$product] = array();
        $list =& $data['products'][$product];

        if (isset($list[$call])) {
            if (($list[$call]['last'] ?? '') === $today) return;
            $list[$call]['last'] = $today;
        } else {
            $country = pt2vhf_station_country($call);
            if ($country === null) return;
            $limits =& $data['limits'];
            if (($limits['day'] ?? '') !== $today || !is_string($limits['key'] ?? null)) {
                $limits = array('day' => $today, 'key' => bin2hex(random_bytes(32)), 'total' => 0, 'ip' => array());
            }
            $ipKey = substr(hash_hmac('sha256', $ip, $limits['key']), 0, 16);
            if (($limits['ip'][$ipKey] ?? 0) >= PT2VHF_STATION_NEW_PER_IP_DAY) return;
            if (($limits['total'] ?? 0) >= PT2VHF_STATION_NEW_PER_DAY) return;
            if (count($list) >= PT2VHF_STATION_MAX) return;
            $limits['ip'][$ipKey] = ($limits['ip'][$ipKey] ?? 0) + 1;
            $limits['total'] = ($limits['total'] ?? 0) + 1;
            unset($limits);
            $list[$call] = array('cc' => $country[0], 'entity' => $country[1], 'first' => $today, 'last' => $today);
        }

        unset($list);
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if (!is_string($json)) return;
        rewind($fh);
        ftruncate($fh, 0);
        fwrite($fh, $json);
        fflush($fh);
    } finally {
        @flock($fh, LOCK_UN);
        fclose($fh);
    }
}

/** Resumo público: países (ranking) e todos os indicativos já registrados (nunca expiram). */
function pt2vhf_station_summary(string $product): ?array {
    $raw = @file_get_contents(pt2vhf_station_file());
    $data = pt2vhf_station_decode($raw === false ? '' : $raw);
    if ($data === null) return null;
    $countries = array();
    $total = 0;
    foreach (($data['products'][$product] ?? array()) as $call => $row) {
        if (!is_array($row)) continue;
        $cc = (string)($row['cc'] ?? '');
        $key = $cc !== '' ? $cc : (string)($row['entity'] ?? '?');
        if (!isset($countries[$key])) {
            $countries[$key] = array('cc' => $cc, 'name' => (string)($row['entity'] ?? ''), 'count' => 0, 'calls' => array());
        }
        // Nome do país: a entidade principal (a com mais estações) dá o nome.
        $countries[$key]['entities'][(string)($row['entity'] ?? '')] = ($countries[$key]['entities'][(string)($row['entity'] ?? '')] ?? 0) + 1;
        $countries[$key]['count']++;
        $countries[$key]['calls'][] = (string)$call;
        $total++;
    }
    foreach ($countries as &$c) {
        arsort($c['entities']);
        $c['name'] = (string)array_key_first($c['entities']);
        unset($c['entities']);
        sort($c['calls'], SORT_STRING);
    }
    unset($c);
    $countries = array_values($countries);
    usort($countries, function ($a, $b) {
        return ($b['count'] <=> $a['count']) ?: strcmp($a['name'], $b['name']);
    });
    return array('schema' => 1, 'product' => $product, 'total' => $total, 'countries' => $countries);
}
