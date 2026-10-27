<?php
/** Validate a segmented Prop/Sat Tool installer without reading large files on every request. */
declare(strict_types=1);
/** Products whose >100 MiB Windows EXEs are stored as Git-sized parts. */
function pt2vhf_segmented_products(): array {
    return array(
        'prop' => array('folder' => 'prop-tool',
                        'pattern' => '/^PT2VHF-Prop-Tool-[0-9]+\.[0-9]+\.[0-9]+-x64-(setup|portable)\.exe$/D'),
        'sat' => array('folder' => 'sat-tool',
                       'pattern' => '/^PT2VHF-Sat-Tool-v[0-9]+\.[0-9]+\.[0-9]+-Win11-x64-(Setup|Portable)\.exe$/D'),
    );
}
function pt2vhf_prop_parts(array $entry, string $product = 'prop') {
    $products = pt2vhf_segmented_products();
    if (!isset($products[$product])) return false;
    $name = (string)($entry['name'] ?? '');
    if (preg_match($products[$product]['pattern'], $name) !== 1) return false;
    $expectedSize = $entry['size'] ?? null;
    $expectedHash = (string)($entry['sha256'] ?? '');
    if (!is_int($expectedSize) || $expectedSize < 50000000 || $expectedSize > 700000000 ||
        preg_match('/^[a-f0-9]{64}$/D', $expectedHash) !== 1) return false;
    $folder = realpath(__DIR__ . '/downloads/' . $products[$product]['folder']);
    if ($folder === false) return false;
    $sidecar = $folder . DIRECTORY_SEPARATOR . $name . '.parts.json';
    if (!is_file($sidecar) || !is_readable($sidecar)) return false;
    $raw = @file_get_contents($sidecar);
    $meta = is_string($raw) ? json_decode($raw, true) : null;
    if (!is_array($meta) || ($meta['name'] ?? null) !== $name ||
        ($meta['size'] ?? null) !== $expectedSize || ($meta['sha256'] ?? null) !== $expectedHash) return false;
    $parts = $meta['parts'] ?? null;
    if (!is_array($parts) || count($parts) < 2 || count($parts) > 16) return false;
    $files = array();
    $total = 0;
    foreach ($parts as $i => $part) {
        if (!is_array($part)) return false;
        $chunkName = $name . '.part' . str_pad((string)$i, 2, '0', STR_PAD_LEFT);
        $length = $part['size'] ?? null;
        if (($part['name'] ?? null) !== $chunkName || !is_int($length) || $length <= 0 ||
            preg_match('/^[a-f0-9]{64}$/D', (string)($part['sha256'] ?? '')) !== 1) return false;
        $path = realpath($folder . DIRECTORY_SEPARATOR . $chunkName);
        if ($path === false || dirname($path) !== $folder || !is_file($path) ||
            !is_readable($path) || filesize($path) !== $length) return false;
        $total += $length;
        $files[] = array('path' => $path, 'size' => $length);
    }
    return $total === $expectedSize ? $files : false;
}
/** Serve a reconstructed PE file through PHP, with streaming and single-range support. */
function pt2vhf_serve_prop(string $name, int $size, array $chunks, bool $head = false): void {
    $start = 0;
    $end = $size - 1;
    $range = (string)($_SERVER['HTTP_RANGE'] ?? '');
    if ($range !== '') {
        if (preg_match('/^bytes=([0-9]*)-([0-9]*)$/D', $range, $m) !== 1 ||
            ($m[1] === '' && $m[2] === '')) {
            header('Content-Range: bytes */' . $size);
            http_response_code(416);
            exit;
        }
        if ($m[1] === '') {
            $suffix = (int)$m[2];
            $start = max(0, $size - $suffix);
        } else {
            $start = (int)$m[1];
            if ($m[2] !== '') $end = min($end, (int)$m[2]);
        }
        if ($start > $end || $start >= $size) {
            header('Content-Range: bytes */' . $size);
            http_response_code(416);
            exit;
        }
        http_response_code(206);
        header('Content-Range: bytes ' . $start . '-' . $end . '/' . $size);
    }
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $name . '"');
    header('Content-Length: ' . ($end - $start + 1));
    header('Accept-Ranges: bytes');
    header('X-Content-Type-Options: nosniff');
    if ($head) exit;
    @set_time_limit(0);
    @ini_set('zlib.output_compression', '0');
    while (ob_get_level() > 0) @ob_end_flush();
    $offset = 0;
    foreach ($chunks as $chunk) {
        $pieceStart = $offset;
        $pieceEnd = $offset + $chunk['size'] - 1;
        $offset += $chunk['size'];
        if ($end < $pieceStart || $start > $pieceEnd) continue;
        $begin = max(0, $start - $pieceStart);
        $remaining = min($pieceEnd, $end) - $pieceStart - $begin + 1;
        $handle = @fopen($chunk['path'], 'rb');
        if ($handle === false) exit;
        if (fseek($handle, $begin) !== 0) { fclose($handle); exit; }
        while ($remaining > 0 && !feof($handle)) {
            $piece = fread($handle, min(1048576, $remaining));
            if ($piece === false || $piece === '') break;
            echo $piece;
            $remaining -= strlen($piece);
            flush();
            if (connection_aborted()) break;
        }
        fclose($handle);
        if ($remaining > 0 || connection_aborted()) exit;
    }
    exit;
}
