<?php
/**
 * PT2VHF Sonde Finder — APK provisório enquanto o teste fechado do Google Play não é liberado.
 *
 * Um só lugar para o link e o texto de instalação, usado pela confirmação de cadastro de testadores
 * (testers.php) e pela resposta automática do formulário de contato (enviar-contato.php).
 * O link é atualizado pelo workflow sync-sonde-release.yml a cada versão assinada publicada no GitHub.
 * Quando o Google Play liberar o teste, PT2VHF_SONDE_APK_ACTIVE vira false e os textos deixam de citar o APK.
 */
declare(strict_types=1);

const PT2VHF_SONDE_APK_ACTIVE = true;
const PT2VHF_SONDE_APK_URL = 'https://www.pt2vhf.com/downloads/sonde-finder/PT2VHF-Sonde-Finder-v1.9.0.apk';

/** Parágrafo com o link do APK, o motivo e como instalar ('' quando o APK provisório está desligado). */
function pt2vhf_sonde_apk_text(string $lang): string {
    if (!PT2VHF_SONDE_APK_ACTIVE) return '';
    $url = PT2VHF_SONDE_APK_URL;
    if ($lang === 'pt') {
        return "Enquanto isso, você já pode usar o app pelo APK provisório:\n   $url\n\n"
            . "Por que um APK? O teste fechado do Google Play ainda está em análise pelo Google, o que pode levar alguns dias. "
            . "O APK é a mesma versão, para você não precisar esperar.\n\n"
            . "Como instalar:\n"
            . "1. No celular Android, abra o link acima e baixe o arquivo.\n"
            . "2. Toque no arquivo baixado (na notificação ou em Arquivos > Downloads).\n"
            . "3. Se o Android pedir, permita instalar apps desta fonte (navegador ou Arquivos) e toque em Instalar.\n"
            . "4. Se o Play Protect avisar que o app é desconhecido, toque em \"Mais detalhes\" > \"Instalar mesmo assim\".\n\n"
            . "Quando o teste do Google Play for liberado, desinstale o APK e instale pela Play Store, para receber as atualizações pela loja.\n\n";
    }
    if ($lang === 'es') {
        return "Mientras tanto, ya puedes usar la app con el APK provisional:\n   $url\n\n"
            . "¿Por qué un APK? Google todavía está revisando la prueba cerrada de Google Play, lo que puede tardar algunos días. "
            . "El APK es la misma versión, para que no tengas que esperar.\n\n"
            . "Cómo instalar:\n"
            . "1. En el teléfono Android, abre el enlace y descarga el archivo.\n"
            . "2. Toca el archivo descargado (en la notificación o en Archivos > Descargas).\n"
            . "3. Si Android lo pide, permite instalar apps de esta fuente (navegador o Archivos) y toca Instalar.\n"
            . "4. Si Play Protect avisa que la app es desconocida, toca \"Más detalles\" > \"Instalar de todos modos\".\n\n"
            . "Cuando se libere la prueba de Google Play, desinstala el APK e instala desde Play Store para recibir las actualizaciones de la tienda.\n\n";
    }
    return "Meanwhile, you can already use the app with the temporary APK:\n   $url\n\n"
        . "Why an APK? Google is still reviewing the Google Play closed test, which can take a few days. "
        . "The APK is the same version, so you don't have to wait.\n\n"
        . "How to install:\n"
        . "1. On your Android phone, open the link above and download the file.\n"
        . "2. Tap the downloaded file (in the notification or in Files > Downloads).\n"
        . "3. If Android asks, allow installing apps from this source (browser or Files) and tap Install.\n"
        . "4. If Play Protect warns that the app is unknown, tap \"More details\" > \"Install anyway\".\n\n"
        . "Once the Google Play test opens, uninstall the APK and install from Play Store to get updates from the store.\n\n";
}

/** A mensagem do formulário de contato é sobre o Sonde Finder? (produto escolhido ou "sonda/sonde" no texto) */
function pt2vhf_sonde_is_about(string $productKey, string $text): bool {
    return $productKey === 'sonde' || preg_match('/\b(radios{1,2}|s)ond[ae]s?\b/iu', $text) === 1; // sonda(s), sonde(s), radiossonda, radiosonde
}

/** Resposta automática ao visitante que escreveu sobre o Sonde Finder pelo formulário de contato. */
function pt2vhf_sonde_contact_autoreply(string $lang, string $name): array {
    $page = 'https://www.pt2vhf.com/sonde';
    $apk = pt2vhf_sonde_apk_text($lang);
    if ($lang === 'pt') {
        return array('PT2VHF Sonde Finder: recebemos sua mensagem',
            "Olá $name,\n\nObrigado pela mensagem! Ela chegou e vou responder em breve.\n\n"
            . "Para testar o PT2VHF Sonde Finder no Google Play, cadastre o e-mail da sua conta Google em $page#testadores "
            . "(se já se cadastrou, não precisa repetir).\n\n" . $apk
            . "73,\nPT2VHF\n$page\n");
    }
    if ($lang === 'es') {
        return array('PT2VHF Sonde Finder: recibimos tu mensaje',
            "Hola $name,\n\n¡Gracias por tu mensaje! Llegó y responderé pronto.\n\n"
            . "Para probar PT2VHF Sonde Finder en Google Play, registra el correo de tu cuenta de Google en $page#testadores "
            . "(si ya te registraste, no hace falta repetir).\n\n" . $apk
            . "73,\nPT2VHF\n$page\n");
    }
    return array('PT2VHF Sonde Finder: we received your message',
        "Hello $name,\n\nThank you for your message! It arrived and I will reply soon.\n\n"
        . "To test PT2VHF Sonde Finder on Google Play, register your Google account e-mail at $page#testadores "
        . "(no need to repeat if you already did).\n\n" . $apk
        . "73,\nPT2VHF\n$page\n");
}
