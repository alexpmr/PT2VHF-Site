<?php
/**
 * PT2VHF — contagem aproximada de instalações ativas.
 *
 * Toda instalação consulta update.php?product=<produto> (na abertura e de tempos em tempos),
 * inclusive as versões antigas, que não mandam indicativo. Contamos os visitantes únicos
 * por dia e por produto: cada consulta vira um hash HMAC de (IP + User-Agent) com uma chave
 * aleatória do dia. A chave e os hashes são descartados na virada do dia UTC; só fica o
 * total do dia. Nenhum IP, indicativo ou User-Agent é gravado.
 *
 * É aproximado: duas instalações atrás do mesmo IP contam como uma, e uma instalação que
 * troca de IP no mesmo dia conta duas vezes. Qualquer falha aqui é silenciosa.
 * Arquivo de dados fora de public_html, preservado em novos deploys.
 */
declare(strict_types=1);

const PT2VHF_INSTALLS_PRODUCTS = array('mesh', 'aprs', 'prop', 'sat', 'sdr', 'prog', 'qsl', 'aprs-android');
const PT2VHF_INSTALLS_KEEP_DAYS = 400;      // histórico de totais diários
const PT2VHF_INSTALLS_MAX_PER_DAY = 200000; // teto de hashes por dia (todos os produtos)

function pt2vhf_installs_file(): string {
    return dirname(__DIR__) . '/pt2vhf-private-data/installs.json';
}

function pt2vhf_installs_decode($contents): ?array {
    if (!is_string($contents) || trim($contents) === '') {
        return array('schema' => 1, 'day' => '', 'key' => '', 'seen' => array(), 'daily' => array());
    }
    $data = json_decode($contents, true);
    if (!is_array($data) || ($data['schema'] ?? null) !== 1) return null;
    foreach (array('seen', 'daily') as $k) if (!is_array($data[$k] ?? null)) $data[$k] = array();
    return $data;
}

/** Chamado pelo update.php em toda consulta. */
function pt2vhf_installs_seen(string $product, string $ip, string $agent): void {
    if (!in_array($product, PT2VHF_INSTALLS_PRODUCTS, true) || $ip === '') return;
    $today = gmdate('Y-m-d');
    $path = pt2vhf_installs_file();
    $dir = dirname($path);
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) return;
    $fh = @fopen($path, 'c+');
    if ($fh === false) return;
    try {
        if (!flock($fh, LOCK_EX)) return;
        $data = pt2vhf_installs_decode(stream_get_contents($fh));
        if ($data === null) return; // arquivo inválido: nunca sobrescrever
        if (($data['day'] ?? '') !== $today || !is_string($data['key'] ?? null) || strlen($data['key']) !== 64) {
            // Virada do dia: chave nova; os hashes do dia anterior somem.
            $data['day'] = $today;
            $data['key'] = bin2hex(random_bytes(32));
            $data['seen'] = array();
        }
        $hash = substr(hash_hmac('sha256', $ip . "\n" . substr($agent, 0, 200), $data['key']), 0, 16);
        if (isset($data['seen'][$product][$hash])) return;
        $total = 0;
        foreach ($data['seen'] as $list) $total += is_array($list) ? count($list) : 0;
        if ($total >= PT2VHF_INSTALLS_MAX_PER_DAY) return;
        $data['seen'][$product][$hash] = 1;
        $data['daily'][$product][$today] = (int)($data['daily'][$product][$today] ?? 0) + 1;
        if (count($data['daily'][$product]) > PT2VHF_INSTALLS_KEEP_DAYS) {
            ksort($data['daily'][$product]);
            $data['daily'][$product] = array_slice($data['daily'][$product], -PT2VHF_INSTALLS_KEEP_DAYS, null, true);
        }
        $json = json_encode($data, JSON_UNESCAPED_SLASHES);
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

/**
 * Resumo público: totais diários dos últimos 30 dias, média dos 7 dias completos
 * mais recentes (sem o dia de hoje, que ainda está em andamento) e o maior dia.
 */
function pt2vhf_installs_summary(string $product): ?array {
    $raw = @file_get_contents(pt2vhf_installs_file());
    $data = pt2vhf_installs_decode($raw === false ? '' : $raw);
    if ($data === null) return null;
    $daily = is_array($data['daily'][$product] ?? null) ? $data['daily'][$product] : array();
    $today = gmdate('Y-m-d');
    $days = array();
    for ($i = 29; $i >= 0; $i--) {
        $d = gmdate('Y-m-d', time() - $i * 86400);
        $days[] = array('date' => $d, 'count' => (int)($daily[$d] ?? 0));
    }
    $complete = array_values(array_filter($days, function ($row) use ($today, $daily) {
        return $row['date'] !== $today && isset($daily[$row['date']]);
    }));
    $last7 = array_slice($complete, -7);
    $avg7 = $last7 ? (int)round(array_sum(array_column($last7, 'count')) / count($last7)) : 0;
    return array(
        'schema' => 1, 'product' => $product,
        'today' => (int)($daily[$today] ?? 0),
        'average7' => $avg7, 'averageDays' => count($last7),
        'max30' => $days ? max(array_column($days, 'count')) : 0,
        'days' => $days,
    );
}
