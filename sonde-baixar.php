<?php
/**
 * PT2VHF Sonde Finder — página de download, aberta só depois do formulário de /sonde (testers.php envia o passe).
 * Sem passe válido (ou com o APK provisório desligado), volta para o formulário.
 */
declare(strict_types=1);
require_once __DIR__ . '/sonde_apk_lib.php';

$token = is_string($_GET['t'] ?? null) ? $_GET['t'] : '';
if (!PT2VHF_SONDE_APK_ACTIVE || !pt2vhf_sonde_dl_valid($token)) {
    header('Location: /sonde#testadores', true, 303);
    exit;
}
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

$lang = is_string($_GET['lang'] ?? null) ? $_GET['lang'] : 'pt';
if (!in_array($lang, array('pt', 'es', 'en'), true)) $lang = 'en';
$url = pt2vhf_sonde_dl_url();
$version = preg_match('/-v([0-9.]+)\.apk$/', PT2VHF_SONDE_APK_URL, $m) ? $m[1] : '';

$T = array(
    'pt' => array('html' => 'pt-BR', 'title' => 'Baixar o PT2VHF Sonde Finder', 'thanks' => 'Cadastro recebido. Obrigado!',
        'intro' => 'Baixe o app no celular Android (8 ou mais novo). O link e estes passos também foram para o seu e-mail.',
        'btn' => 'Baixar o APK', 'how' => 'Como instalar',
        'steps' => array('Toque em “Baixar o APK” no celular e espere terminar.',
            'Toque no arquivo baixado (na notificação ou em Arquivos › Downloads).',
            'Se o Android pedir, permita instalar apps desta fonte e toque em Instalar.',
            'Se o Play Protect avisar que o app é desconhecido, toque em “Mais detalhes” › “Instalar mesmo assim”.',
            'Se você tinha o APK 1.9.0, desinstale-o antes: a assinatura do app mudou.'),
        'play' => 'Quando o teste fechado do Google Play for liberado, você recebe por e-mail as instruções para instalar pela loja.',
        'back' => 'Voltar para a página do app'),
    'es' => array('html' => 'es', 'title' => 'Descargar PT2VHF Sonde Finder', 'thanks' => 'Registro recibido. ¡Gracias!',
        'intro' => 'Descarga la app en el teléfono Android (8 o más nuevo). El enlace y estos pasos también se enviaron a tu correo.',
        'btn' => 'Descargar el APK', 'how' => 'Cómo instalar',
        'steps' => array('Toca “Descargar el APK” en el teléfono y espera a que termine.',
            'Toca el archivo descargado (en la notificación o en Archivos › Descargas).',
            'Si Android lo pide, permite instalar apps de esta fuente y toca Instalar.',
            'Si Play Protect avisa que la app es desconocida, toca “Más detalles” › “Instalar de todos modos”.',
            'Si tenías el APK 1.9.0, desinstálalo antes: la firma de la app cambió.'),
        'play' => 'Cuando se libere la prueba cerrada de Google Play, recibirás por correo las instrucciones para instalar desde la tienda.',
        'back' => 'Volver a la página de la app'),
    'en' => array('html' => 'en', 'title' => 'Download PT2VHF Sonde Finder', 'thanks' => 'Sign-up received. Thank you!',
        'intro' => 'Download the app on your Android phone (8 or newer). The link and these steps were also sent to your e-mail.',
        'btn' => 'Download the APK', 'how' => 'How to install',
        'steps' => array('Tap “Download the APK” on your phone and wait for it to finish.',
            'Tap the downloaded file (in the notification or in Files › Downloads).',
            'If Android asks, allow installing apps from this source and tap Install.',
            'If Play Protect warns that the app is unknown, tap “More details” › “Install anyway”.',
            'If you had the 1.9.0 APK, uninstall it first: the app signature changed.'),
        'play' => 'When the Google Play closed test opens, you will get the instructions to install from the store by e-mail.',
        'back' => 'Back to the app page'),
);
$t = $T[$lang];
function h(string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }
?><!doctype html>
<html lang="<?= h($t['html']) ?>">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title><?= h($t['title']) ?></title>
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/css/style.css?v=20261124-speed">
  <style>
    .dl{max-width:680px;margin:48px auto;padding:0 20px}
    .dl .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:28px}
    .dl h1{margin:0 0 6px;font-size:1.7rem}.dl .ok{color:#3ddc84;font-weight:600;margin:0 0 14px}
    .dl .btn{font-size:1.15rem;padding:14px 28px;margin:12px 0 4px}
    .dl ol{line-height:1.7;color:var(--muted);padding-left:1.2rem}.dl .v{color:var(--muted);font-size:.9rem}
  </style>
</head>
<body>
  <main class="dl">
    <div class="card">
      <p class="ok"><?= h($t['thanks']) ?></p>
      <h1><?= h($t['title']) ?></h1>
      <p><?= h($t['intro']) ?></p>
      <p><a class="btn btn-primary" href="<?= h($url) ?>" rel="nofollow"><?= h($t['btn']) ?></a></p>
      <?php if ($version !== ''): ?><p class="v">PT2VHF Sonde Finder <?= h($version) ?> · Android 8+</p><?php endif; ?>
      <h2><?= h($t['how']) ?></h2>
      <ol><?php foreach ($t['steps'] as $s): ?><li><?= h($s) ?></li><?php endforeach; ?></ol>
      <p><?= h($t['play']) ?></p>
      <p><a href="/sonde"><?= h($t['back']) ?></a></p>
    </div>
  </main>
</body>
</html>
