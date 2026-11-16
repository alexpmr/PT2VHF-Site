<?php
/** PT2VHF Speed Alert opt-in installation activity. PHP >= 7.4.
 * No raw UUID, IP, User-Agent or position is stored.
 * Data and secret are kept outside public_html.
 */
declare(strict_types=1);

function speed_data_dir(): string {
    return dirname(__DIR__) . '/pt2vhf-private-data';
}
function speed_data_file(): string { return speed_data_dir() . '/speed_installs.json'; }
function speed_secret_file(): string { return speed_data_dir() . '/speed_secret.bin'; }
function speed_ensure_dir(): bool {
    $d = speed_data_dir();
    return is_dir($d) || (@mkdir($d, 0700, true) && is_dir($d));
}
function speed_secret(): ?string {
    if (!speed_ensure_dir()) return null;
    $f = @fopen(speed_secret_file(), 'c+b');
    if ($f === false) return null;
    try {
        if (!flock($f, LOCK_EX)) return null;
        rewind($f);
        $key = stream_get_contents($f);
        if (is_string($key) && strlen($key) === 32) return $key;
        $key = random_bytes(32);
        rewind($f);ftruncate($f, 0);fwrite($f, $key);fflush($f);
        @chmod(speed_secret_file(),0600);
        return $key;
    } finally {flock($f, LOCK_UN);fclose($f);}
}
function speed_country_code(): string {
    // Trusted GeoIP variables only. Never trust client-provided X-Forwarded-For
    // or arbitrary request country headers.
    foreach (array('GEOIP_COUNTRY_CODE','MM_COUNTRY_CODE','COUNTRY_CODE') as $k) {
        $c = strtoupper(trim((string)($_SERVER[$k] ?? '')));
        if (preg_match('/^[A-Z]{2}$/D',$c) && $c !== 'XX') return $c;
    }
    return 'ZZ'; // Unknown unless server GeoIP is configured.
}
function speed_decode($raw): array {
    $d = is_string($raw) ? json_decode($raw,true) : null;
    if (!is_array($d) || ($d['schema'] ?? null) !== 1 || !is_array($d['records'] ?? null))
        return array('schema'=>1,'records'=>array(),'totalEver'=>0);
    return $d;
}
function speed_record(string $uuid,string $version): bool {
    $secret = speed_secret();
    if ($secret === null) return false;
    $id = hash_hmac('sha256',$uuid,$secret);
    $p = speed_data_file();
    $f = @fopen($p,'c+');
    if ($f === false) return false;
    try {
        if (!flock($f,LOCK_EX)) return false;
        rewind($f);
        $raw = stream_get_contents($f);
        $data = speed_decode($raw);
        $now = time();
        // Limit retention of pseudonymous individual activity to 400 days.
        $cutoff = $now - 400*86400;
        foreach ($data['records'] as $k=>$row) {
            if (!is_array($row) || (int)($row['last'] ?? 0) < $cutoff)
                unset($data['records'][$k]);
        }
        $exists = isset($data['records'][$id]);
        if (!$exists && count($data['records']) >= 50000) return false;
        $row = $exists ? $data['records'][$id] : array('first'=>$now);
        // At most one update/hour per installation.
        if ($exists && $now - (int)($row['last'] ?? 0) < 3600) return true;
        if (!$exists) $data['totalEver'] = (int)($data['totalEver'] ?? 0) + 1;
        $data['records'][$id] = array(
            'first'=>(int)$row['first'], 'last'=>$now,
            'version'=>$version, 'country'=>speed_country_code()
        );
        $json = json_encode($data,JSON_UNESCAPED_SLASHES);
        if (!is_string($json)) return false;
        rewind($f);ftruncate($f,0);fwrite($f,$json);fflush($f);
        @chmod($p,0600);
        return true;
    } finally { flock($f,LOCK_UN);fclose($f); }
}
function speed_summary(): array {
    $raw = @file_get_contents(speed_data_file());
    $data = speed_decode($raw === false ? null : $raw);
    $now = time();
    $active7 = 0;$active30 = 0;$active24 = 0;
    $countries = array();$versions = array();
    foreach ($data['records'] as $row) {
        if (!is_array($row)) continue;
        $age = $now - (int)($row['last'] ?? 0);
        if ($age < 0 || $age > 400*86400) continue;
        if ($age <= 86400) ++$active24;
        if ($age <= 7*86400) ++$active7;
        if ($age <= 30*86400) ++$active30;
        $c = (string)($row['country'] ?? 'ZZ');
        if (!preg_match('/^[A-Z]{2}$/D',$c))$c='ZZ';
        $countries[$c] = ($countries[$c] ?? 0)+1;
        $v = (string)($row['version'] ?? '');
        if ($v !== '') $versions[$v] = ($versions[$v] ?? 0)+1;
    }
    arsort($countries);arsort($versions);
    $labels = array('BR'=>'Brasil','PT'=>'Portugal','NL'=>'Países Baixos','US'=>'Estados Unidos',
       'AR'=>'Argentina','CL'=>'Chile','UY'=>'Uruguai','ES'=>'Espanha','DE'=>'Alemanha',
       'FR'=>'França','IT'=>'Itália','GB'=>'Reino Unido','CA'=>'Canadá','JP'=>'Japão',
       'AU'=>'Austrália','ZZ'=>'País desconhecido');
    $rows=array();
    foreach($countries as $code=>$count)
        $rows[]=array('code'=>$code,'name'=>$labels[$code] ?? $code,'count'=>$count);
    $versionsList=array();
    foreach($versions as $version=>$count)
        $versionsList[]=array('version'=>$version,'count'=>$count);
    return array('schema'=>1,'product'=>'speed-alert','totalUnique'=>count($data['records']),
      'totalEver'=>(int)($data['totalEver'] ?? 0),
      'active24'=>$active24,'active7'=>$active7,'active30'=>$active30,
      'countryCount'=>count(array_filter(array_keys($countries),function($c){return $c !== 'ZZ';})),
      'countries'=>$rows,'versions'=>$versionsList);
}
