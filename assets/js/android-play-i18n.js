/* PT2VHF — traduções da seção Google Play / testadores / iOS da página /aprs-android.
   O main.js troca o idioma sem recarregar; aqui reaplicamos quando <html lang> muda. */
(function () {
  var PLAY = "https://play.google.com/intl/en_us/badges/static/images/badges/";
  var T = {
    pt: {
      badge: "pt-br", badgeAlt: "Disponível no Google Play",
      heroNotice: 'Novidade: daqui para frente o app se chama <strong>PT2VHF APRS Client</strong> e as novas versões para Android serão distribuídas somente pelo <strong>Google Play</strong>. Cadastre-se abaixo para testar antes de todos.',
      playTitle: "Em breve no Google Play",
      playIntro: 'A partir de agora, as novas versões do PT2VHF APRS Client para Android serão publicadas somente no <strong>Google Play</strong>, com atualização automática pela loja. O app está em teste fechado: cadastre-se abaixo para participar. Enquanto isso, o APK continua disponível abaixo; quando o app for liberado no Google Play, a versão da loja instala por cima, sem perder as configurações.',
      playNote: "O link da loja aparece aqui quando o Google liberar o app.",
      testersTitle: "Quero testar as novas versões",
      testersIntro: "O Google Play exige um teste fechado antes de publicar. Deixe seu e-mail (de preferência o da sua conta Google, usada no Play) e você receberá por e-mail as instruções para instalar as versões de teste direto da loja.",
      emailLabel: "E-mail da conta Google", callLabel: "Indicativo (opcional)", submit: "Quero testar",
      privacyNote: 'Seu e-mail é usado só para o teste do Google Play. Veja a <a href="/privacidade">política de privacidade</a>.',
      ok: "Cadastro recebido! Enviamos um e-mail com as instruções do teste no Google Play (confira também o spam).",
      dup: "Este e-mail já está cadastrado.", erro: "Não foi possível cadastrar. Confira o e-mail e tente de novo.",
      iosTitle: "iPhone e iPad (iOS)",
      iosP1: 'Versão nativa para iOS 17 ou mais novo, em fase de testes: mapa (padrão, escuro, satélite e híbrido), APRS-IS, estações, mensagens com confirmação, beacon por GPS com rastreador e TNC KISS por <strong>Bluetooth LE</strong>. TNCs Bluetooth clássico (SPP), USB e modem por áudio não funcionam no iPhone.',
      iosP2: 'A Apple não permite instalar aplicativos baixados de sites, como o APK do Android. A versão iOS será distribuída pelo <strong>TestFlight</strong> (beta gratuito da Apple) e o link de instalação aparecerá aqui assim que o teste for liberado.'
    },
    en: {
      badge: "en", badgeAlt: "Get it on Google Play",
      heroNotice: 'New: from now on the app is called <strong>PT2VHF APRS Client</strong> and new Android versions will be distributed only through <strong>Google Play</strong>. Sign up below to test them first.',
      playTitle: "Coming soon to Google Play",
      playIntro: 'From now on, new versions of PT2VHF APRS Client for Android will be published only on <strong>Google Play</strong>, with automatic updates through the store. The app is in a closed test: sign up below to join. Meanwhile, the APK is still available below; once the app is released on Google Play, the store version installs over it and keeps your settings.',
      playNote: "The store link will appear here once Google releases the app.",
      testersTitle: "I want to test new versions",
      testersIntro: "Google Play requires a closed test before publishing. Leave your e-mail (preferably the one of the Google account you use on Play) and you will receive instructions by e-mail to install the test versions straight from the store.",
      emailLabel: "Google account e-mail", callLabel: "Callsign (optional)", submit: "I want to test",
      privacyNote: 'Your e-mail is used only for the Google Play test. See the <a href="/privacidade">privacy policy</a>.',
      ok: "Sign-up received! We sent you an e-mail with the Google Play test instructions (please also check your spam folder).",
      dup: "This e-mail is already registered.", erro: "Could not sign you up. Check the e-mail and try again.",
      iosTitle: "iPhone and iPad (iOS)",
      iosP1: 'Native version for iOS 17 or newer, in testing: map (standard, dark, satellite and hybrid), APRS-IS, stations, messages with acknowledgement, GPS beacon with tracker and KISS TNC over <strong>Bluetooth LE</strong>. Classic Bluetooth (SPP), USB and audio-modem TNCs do not work on the iPhone.',
      iosP2: 'Apple does not allow installing apps downloaded from websites, like the Android APK. The iOS version will be distributed through <strong>TestFlight</strong> (Apple\'s free beta program) and the install link will appear here as soon as the test opens.'
    },
    es: {
      badge: "es", badgeAlt: "Disponible en Google Play",
      heroNotice: 'Novedad: a partir de ahora la app se llama <strong>PT2VHF APRS Client</strong> y las nuevas versiones para Android se distribuirán solo a través de <strong>Google Play</strong>. Regístrate abajo para probarlas antes que nadie.',
      playTitle: "Pronto en Google Play",
      playIntro: 'A partir de ahora, las nuevas versiones de PT2VHF APRS Client para Android se publicarán solo en <strong>Google Play</strong>, con actualización automática desde la tienda. La app está en prueba cerrada: regístrate abajo para participar. Mientras tanto, el APK sigue disponible abajo; cuando la app se publique en Google Play, la versión de la tienda se instala encima sin perder la configuración.',
      playNote: "El enlace de la tienda aparecerá aquí cuando Google libere la app.",
      testersTitle: "Quiero probar las nuevas versiones",
      testersIntro: "Google Play exige una prueba cerrada antes de publicar. Deja tu correo (preferiblemente el de tu cuenta de Google usada en Play) y recibirás por correo las instrucciones para instalar las versiones de prueba directamente desde la tienda.",
      emailLabel: "Correo de la cuenta de Google", callLabel: "Indicativo (opcional)", submit: "Quiero probar",
      privacyNote: 'Tu correo se usa solo para la prueba de Google Play. Consulta la <a href="/privacidade">política de privacidad</a>.',
      ok: "¡Registro recibido! Te enviamos un correo con las instrucciones de la prueba en Google Play (revisa también el spam).",
      dup: "Este correo ya está registrado.", erro: "No se pudo registrar. Revisa el correo e inténtalo de nuevo.",
      iosTitle: "iPhone y iPad (iOS)",
      iosP1: 'Versión nativa para iOS 17 o posterior, en pruebas: mapa (estándar, oscuro, satélite e híbrido), APRS-IS, estaciones, mensajes con confirmación, baliza por GPS con rastreador y TNC KISS por <strong>Bluetooth LE</strong>. Los TNC Bluetooth clásico (SPP), USB y módem de audio no funcionan en el iPhone.',
      iosP2: 'Apple no permite instalar apps descargadas de sitios web, como el APK de Android. La versión iOS se distribuirá por <strong>TestFlight</strong> (beta gratuita de Apple) y el enlace de instalación aparecerá aquí en cuanto se abra la prueba.'
    },
    fr: {
      badge: "fr", badgeAlt: "Disponible sur Google Play",
      heroNotice: 'Nouveau : désormais l\'application s\'appelle <strong>PT2VHF APRS Client</strong> et les nouvelles versions Android seront distribuées uniquement via <strong>Google Play</strong>. Inscrivez-vous ci-dessous pour les tester en avant-première.',
      playTitle: "Bientôt sur Google Play",
      playIntro: 'Désormais, les nouvelles versions de PT2VHF APRS Client pour Android seront publiées uniquement sur <strong>Google Play</strong>, avec mise à jour automatique par la boutique. L\'app est en test fermé : inscrivez-vous ci-dessous pour participer. En attendant, l\'APK reste disponible ci-dessous ; quand l\'app sera publiée sur Google Play, la version de la boutique s\'installera par-dessus en conservant vos réglages.',
      playNote: "Le lien de la boutique apparaîtra ici dès que Google publiera l\'app.",
      testersTitle: "Je veux tester les nouvelles versions",
      testersIntro: "Google Play exige un test fermé avant la publication. Laissez votre e-mail (de préférence celui de votre compte Google utilisé sur Play) et vous recevrez par e-mail les instructions pour installer les versions de test directement depuis la boutique.",
      emailLabel: "E-mail du compte Google", callLabel: "Indicatif (facultatif)", submit: "Je veux tester",
      privacyNote: 'Votre e-mail sert uniquement au test Google Play. Consultez la <a href="/privacidade">politique de confidentialité</a>.',
      ok: "Inscription reçue ! Nous vous avons envoyé un e-mail avec les instructions du test Google Play (vérifiez aussi les spams).",
      dup: "Cet e-mail est déjà inscrit.", erro: "Inscription impossible. Vérifiez l'e-mail et réessayez.",
      iosTitle: "iPhone et iPad (iOS)",
      iosP1: 'Version native pour iOS 17 ou plus récent, en test : carte (standard, sombre, satellite et hybride), APRS-IS, stations, messages avec accusé de réception, balise GPS avec suivi et TNC KISS en <strong>Bluetooth LE</strong>. Les TNC Bluetooth classique (SPP), USB et modem audio ne fonctionnent pas sur l\'iPhone.',
      iosP2: 'Apple ne permet pas d\'installer des applications téléchargées depuis des sites, comme l\'APK Android. La version iOS sera distribuée via <strong>TestFlight</strong> (bêta gratuite d\'Apple) et le lien d\'installation apparaîtra ici dès l\'ouverture du test.'
    },
    de: {
      badge: "de", badgeAlt: "Jetzt bei Google Play",
      heroNotice: 'Neu: Ab sofort heißt die App <strong>PT2VHF APRS Client</strong>, und neue Android-Versionen werden nur noch über <strong>Google Play</strong> verteilt. Melden Sie sich unten an, um sie als Erste zu testen.',
      playTitle: "Bald bei Google Play",
      playIntro: 'Ab sofort werden neue Versionen des PT2VHF APRS Client für Android nur noch bei <strong>Google Play</strong> veröffentlicht, mit automatischen Updates über den Store. Die App ist im geschlossenen Test: Melde dich unten an, um mitzumachen. Bis dahin ist die APK unten weiterhin verfügbar; sobald die App bei Google Play freigegeben ist, wird die Store-Version darüber installiert und behält deine Einstellungen.',
      playNote: "Der Store-Link erscheint hier, sobald Google die App freigibt.",
      testersTitle: "Ich möchte neue Versionen testen",
      testersIntro: "Google Play verlangt vor der Veröffentlichung einen geschlossenen Test. Hinterlassen Sie Ihre E-Mail (am besten die Ihres Google-Kontos, das Sie bei Play verwenden), und Sie erhalten per E-Mail die Anleitung, um die Testversionen direkt aus dem Store zu installieren.",
      emailLabel: "E-Mail des Google-Kontos", callLabel: "Rufzeichen (optional)", submit: "Ich möchte testen",
      privacyNote: 'Ihre E-Mail wird nur für den Google-Play-Test verwendet. Siehe <a href="/privacidade">Datenschutzerklärung</a>.',
      ok: "Anmeldung erhalten! Wir haben Ihnen eine E-Mail mit der Anleitung zum Google-Play-Test geschickt (bitte auch den Spam-Ordner prüfen).",
      dup: "Diese E-Mail ist bereits registriert.", erro: "Anmeldung nicht möglich. Bitte E-Mail prüfen und erneut versuchen.",
      iosTitle: "iPhone und iPad (iOS)",
      iosP1: 'Native Version für iOS 17 oder neuer, im Test: Karte (Standard, dunkel, Satellit und Hybrid), APRS-IS, Stationen, Nachrichten mit Bestätigung, GPS-Bake mit Tracker und KISS-TNC über <strong>Bluetooth LE</strong>. TNCs mit klassischem Bluetooth (SPP), USB und Audio-Modem funktionieren auf dem iPhone nicht.',
      iosP2: 'Apple erlaubt keine Installation von Apps, die von Websites geladen werden, wie die Android-APK. Die iOS-Version wird über <strong>TestFlight</strong> (kostenlose Beta von Apple) verteilt; der Installationslink erscheint hier, sobald der Test startet.'
    },
    it: {
      badge: "it", badgeAlt: "Disponibile su Google Play",
      heroNotice: 'Novità: d\'ora in poi l\'app si chiama <strong>PT2VHF APRS Client</strong> e le nuove versioni Android saranno distribuite solo tramite <strong>Google Play</strong>. Iscriviti qui sotto per provarle per primo.',
      playTitle: "Presto su Google Play",
      playIntro: 'D\'ora in poi, le nuove versioni di PT2VHF APRS Client per Android saranno pubblicate solo su <strong>Google Play</strong>, con aggiornamento automatico dallo store. L\'app è in test chiuso: iscriviti qui sotto per partecipare. Nel frattempo l\'APK resta disponibile qui sotto; quando l\'app sarà pubblicata su Google Play, la versione dello store si installerà sopra mantenendo le impostazioni.',
      playNote: "Il link dello store apparirà qui quando Google pubblicherà l\'app.",
      testersTitle: "Voglio provare le nuove versioni",
      testersIntro: "Google Play richiede un test chiuso prima della pubblicazione. Lascia la tua e-mail (preferibilmente quella dell'account Google usato su Play) e riceverai via e-mail le istruzioni per installare le versioni di prova direttamente dallo store.",
      emailLabel: "E-mail dell'account Google", callLabel: "Nominativo (facoltativo)", submit: "Voglio provare",
      privacyNote: 'La tua e-mail è usata solo per il test di Google Play. Vedi l\'<a href="/privacidade">informativa sulla privacy</a>.',
      ok: "Iscrizione ricevuta! Ti abbiamo inviato un'e-mail con le istruzioni del test su Google Play (controlla anche lo spam).",
      dup: "Questa e-mail è già registrata.", erro: "Impossibile registrarsi. Controlla l'e-mail e riprova.",
      iosTitle: "iPhone e iPad (iOS)",
      iosP1: 'Versione nativa per iOS 17 o successivo, in fase di test: mappa (standard, scura, satellite e ibrida), APRS-IS, stazioni, messaggi con conferma, beacon GPS con tracker e TNC KISS via <strong>Bluetooth LE</strong>. I TNC Bluetooth classico (SPP), USB e modem audio non funzionano su iPhone.',
      iosP2: 'Apple non consente di installare app scaricate da siti web, come l\'APK Android. La versione iOS sarà distribuita tramite <strong>TestFlight</strong> (beta gratuita di Apple) e il link di installazione apparirà qui appena il test sarà aperto.'
    },
    zh: {
      badge: "zh-cn", badgeAlt: "在 Google Play 上获取",
      heroNotice: '新消息：今后应用名称为 <strong>PT2VHF APRS Client</strong>，新的 Android 版本将只通过 <strong>Google Play</strong> 发布。请在下方报名，抢先测试。',
      playTitle: "即将登陆 Google Play",
      playIntro: '今后，PT2VHF APRS Client 的 Android 新版本将只在 <strong>Google Play</strong> 发布，并通过商店自动更新。应用目前处于封闭测试阶段：请在下方登记参与。 在此期间，仍可在下方下载 APK；应用在 Google Play 上线后，商店版本可直接覆盖安装并保留设置。',
      playNote: "Google 发布应用后，商店链接将显示在这里。",
      testersTitle: "我想测试新版本",
      testersIntro: "Google Play 要求发布前进行封闭测试。请留下您的电子邮件（最好是您在 Play 上使用的 Google 账号），我们会通过电子邮件发送直接从商店安装测试版的说明。",
      emailLabel: "Google 账号电子邮件", callLabel: "呼号（可选）", submit: "我想测试",
      privacyNote: '您的电子邮件仅用于 Google Play 测试。请参阅<a href="/privacidade">隐私政策</a>。',
      ok: "报名成功！我们已发送包含 Google Play 测试说明的电子邮件（也请检查垃圾邮件）。",
      dup: "该电子邮件已报名。", erro: "报名失败。请检查电子邮件后重试。",
      iosTitle: "iPhone 和 iPad（iOS）",
      iosP1: '适用于 iOS 17 或更高版本的原生应用，测试中：地图（标准、深色、卫星和混合）、APRS-IS、电台、带确认的消息、带轨迹的 GPS 信标，以及通过 <strong>Bluetooth LE</strong> 连接的 KISS TNC。经典蓝牙（SPP）、USB 和音频调制解调器 TNC 无法在 iPhone 上使用。',
      iosP2: 'Apple 不允许安装从网站下载的应用（例如 Android APK）。iOS 版本将通过 <strong>TestFlight</strong>（Apple 免费测试计划）发布，测试开放后安装链接将显示在这里。'
    }
  };

  function lang() {
    var code = (document.documentElement.lang || "pt").toLowerCase().split("-")[0];
    return T[code] ? code : "pt";
  }
  function apply() {
    var code = lang(), d = T[code];
    Array.prototype.forEach.call(document.querySelectorAll("[data-gp-i18n]"), function (el) {
      var key = el.getAttribute("data-gp-i18n");
      if (d[key]) el.innerHTML = d[key];
    });
    Array.prototype.forEach.call(document.querySelectorAll("img.gp-badge-img"), function (img) {
      img.src = PLAY + d.badge + "_badge_web_generic.png";
      img.alt = d.badgeAlt;
    });
    var langInput = document.querySelector('.testers-form input[name="lang"]');
    if (langInput) langInput.value = code;
    var st = new URLSearchParams(location.search).get("testers");
    var el = document.getElementById("testers-status");
    if (st && d[st] && el && (st === "ok" || st === "dup" || st === "erro")) { el.textContent = d[st]; el.hidden = false; }
  }
  apply();
  if (window.MutationObserver) {
    new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }
})();
