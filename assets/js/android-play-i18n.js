/* PT2VHF — traduções da seção Google Play / testadores / iOS da página /aprs-android.
   O main.js troca o idioma sem recarregar; aqui reaplicamos quando <html lang> muda. */
(function () {
  var PLAY = "https://play.google.com/intl/en_us/badges/static/images/badges/";
  var T = {
    pt: {
      badge: "pt-br", badgeAlt: "Disponível no Google Play",
      heroNotice: 'Novidade: daqui para frente o app se chama <strong>PT2VHF APRS Client</strong> e as novas versões para Android serão distribuídas somente pelo <strong>Google Play</strong>. Cadastre-se abaixo para testar antes de todos.',
      playTitle: "Disponível no Google Play (teste fechado)",
      playIntro: "As versões do PT2VHF APRS Client para Android agora são distribuídas somente pelo <strong>Google Play</strong>, com atualização automática pela loja. O app está em teste fechado: se o seu e-mail já está na lista de testadores, toque no selo, entre como testador e instale pela Play Store. Se ainda não está, cadastre-se abaixo. Quem já usa o APK pode instalar a versão da loja por cima, sem perder as configurações.",
      playNote: "Algum problema para instalar ou entrar no teste? Fale comigo pelo <a href=\"https://wa.me/5561984023634\" target=\"_blank\" rel=\"noopener\">WhatsApp (+55 61 98402 3634)</a> ou pelo e-mail <a href=\"mailto:alexpmr@gmail.com\">alexpmr@gmail.com</a>.",
      testersTitle: "Quero testar as novas versões",
      testersIntro: "O Google Play exige um teste fechado antes de liberar o app para todos. Deixe seu e-mail (de preferência o da sua conta Google, usada no Play) e eu incluo você na lista de testadores.",
      emailLabel: "E-mail da conta Google", callLabel: "Indicativo (opcional)", submit: "Quero testar",
      privacyNote: 'Seu e-mail é usado só para o teste do Google Play. Veja a <a href="/privacidade">política de privacidade</a>.',
      ok: "Cadastro recebido! Vou incluir seu e-mail na lista de testadores; depois é só tocar no selo do Google Play acima.",
      dup: "Este e-mail já está cadastrado.", erro: "Não foi possível cadastrar. Confira o e-mail e tente de novo.",
      iosTitle: "iPhone e iPad (iOS)",
      iosP1: 'Versão nativa para iOS 17 ou mais novo, em fase de testes: mapa (padrão, escuro, satélite e híbrido), APRS-IS, estações, mensagens com confirmação, beacon por GPS com rastreador e TNC KISS por <strong>Bluetooth LE</strong>. TNCs Bluetooth clássico (SPP), USB e modem por áudio não funcionam no iPhone.',
      iosP2: 'A Apple não permite instalar aplicativos baixados de sites, como o APK do Android. A versão iOS será distribuída pelo <strong>TestFlight</strong> (beta gratuito da Apple) e o link de instalação aparecerá aqui assim que o teste for liberado.'
    },
    en: {
      badge: "en", badgeAlt: "Get it on Google Play",
      heroNotice: 'New: from now on the app is called <strong>PT2VHF APRS Client</strong> and new Android versions will be distributed only through <strong>Google Play</strong>. Sign up below to test them first.',
      playTitle: "Available on Google Play (closed test)",
      playIntro: "PT2VHF APRS Client for Android is now distributed only through <strong>Google Play</strong>, with automatic updates from the store. The app is in a closed test: if your e-mail is already on the tester list, tap the badge, become a tester and install it from the Play Store. If not, sign up below. If you already use the APK, the store version installs over it and keeps your settings.",
      playNote: "Any trouble installing or joining the test? Contact me on <a href=\"https://wa.me/5561984023634\" target=\"_blank\" rel=\"noopener\">WhatsApp (+55 61 98402 3634)</a> or by e-mail at <a href=\"mailto:alexpmr@gmail.com\">alexpmr@gmail.com</a>.",
      testersTitle: "I want to test new versions",
      testersIntro: "Google Play requires a closed test before releasing the app to everyone. Leave your e-mail (preferably the one of the Google account you use on Play) and I will add you to the tester list.",
      emailLabel: "Google account e-mail", callLabel: "Callsign (optional)", submit: "I want to test",
      privacyNote: 'Your e-mail is used only for the Google Play test. See the <a href="/privacidade">privacy policy</a>.',
      ok: "Sign-up received! I will add your e-mail to the tester list; then just tap the Google Play badge above.",
      dup: "This e-mail is already registered.", erro: "Could not sign you up. Check the e-mail and try again.",
      iosTitle: "iPhone and iPad (iOS)",
      iosP1: 'Native version for iOS 17 or newer, in testing: map (standard, dark, satellite and hybrid), APRS-IS, stations, messages with acknowledgement, GPS beacon with tracker and KISS TNC over <strong>Bluetooth LE</strong>. Classic Bluetooth (SPP), USB and audio-modem TNCs do not work on the iPhone.',
      iosP2: 'Apple does not allow installing apps downloaded from websites, like the Android APK. The iOS version will be distributed through <strong>TestFlight</strong> (Apple\'s free beta program) and the install link will appear here as soon as the test opens.'
    },
    es: {
      badge: "es", badgeAlt: "Disponible en Google Play",
      heroNotice: 'Novedad: a partir de ahora la app se llama <strong>PT2VHF APRS Client</strong> y las nuevas versiones para Android se distribuirán solo a través de <strong>Google Play</strong>. Regístrate abajo para probarlas antes que nadie.',
      playTitle: "Disponible en Google Play (prueba cerrada)",
      playIntro: "PT2VHF APRS Client para Android ahora se distribuye solo a través de <strong>Google Play</strong>, con actualización automática desde la tienda. La app está en prueba cerrada: si tu correo ya está en la lista de testers, toca la insignia, hazte tester e instálala desde Play Store. Si no lo está, regístrate abajo. Si ya usas el APK, la versión de la tienda se instala encima sin perder la configuración.",
      playNote: "¿Algún problema para instalar o entrar en la prueba? Escríbeme por <a href=\"https://wa.me/5561984023634\" target=\"_blank\" rel=\"noopener\">WhatsApp (+55 61 98402 3634)</a> o al correo <a href=\"mailto:alexpmr@gmail.com\">alexpmr@gmail.com</a>.",
      testersTitle: "Quiero probar las nuevas versiones",
      testersIntro: "Google Play exige una prueba cerrada antes de liberar la app para todos. Deja tu correo (preferiblemente el de tu cuenta de Google usada en Play) y te incluiré en la lista de testers.",
      emailLabel: "Correo de la cuenta de Google", callLabel: "Indicativo (opcional)", submit: "Quiero probar",
      privacyNote: 'Tu correo se usa solo para la prueba de Google Play. Consulta la <a href="/privacidade">política de privacidad</a>.',
      ok: "¡Registro recibido! Incluiré tu correo en la lista de testers; después solo toca la insignia de Google Play de arriba.",
      dup: "Este correo ya está registrado.", erro: "No se pudo registrar. Revisa el correo e inténtalo de nuevo.",
      iosTitle: "iPhone y iPad (iOS)",
      iosP1: 'Versión nativa para iOS 17 o posterior, en pruebas: mapa (estándar, oscuro, satélite e híbrido), APRS-IS, estaciones, mensajes con confirmación, baliza por GPS con rastreador y TNC KISS por <strong>Bluetooth LE</strong>. Los TNC Bluetooth clásico (SPP), USB y módem de audio no funcionan en el iPhone.',
      iosP2: 'Apple no permite instalar apps descargadas de sitios web, como el APK de Android. La versión iOS se distribuirá por <strong>TestFlight</strong> (beta gratuita de Apple) y el enlace de instalación aparecerá aquí en cuanto se abra la prueba.'
    },
    fr: {
      badge: "fr", badgeAlt: "Disponible sur Google Play",
      heroNotice: 'Nouveau : désormais l\'application s\'appelle <strong>PT2VHF APRS Client</strong> et les nouvelles versions Android seront distribuées uniquement via <strong>Google Play</strong>. Inscrivez-vous ci-dessous pour les tester en avant-première.',
      playTitle: "Disponible sur Google Play (test fermé)",
      playIntro: "PT2VHF APRS Client pour Android est désormais distribué uniquement via <strong>Google Play</strong>, avec mise à jour automatique par la boutique. L'app est en test fermé : si votre e-mail figure déjà sur la liste des testeurs, touchez le badge, devenez testeur et installez-la depuis le Play Store. Sinon, inscrivez-vous ci-dessous. Si vous utilisez déjà l'APK, la version de la boutique s'installe par-dessus en conservant vos réglages.",
      playNote: "Un problème pour installer ou rejoindre le test ? Contactez-moi sur <a href=\"https://wa.me/5561984023634\" target=\"_blank\" rel=\"noopener\">WhatsApp (+55 61 98402 3634)</a> ou par e-mail à <a href=\"mailto:alexpmr@gmail.com\">alexpmr@gmail.com</a>.",
      testersTitle: "Je veux tester les nouvelles versions",
      testersIntro: "Google Play exige un test fermé avant de publier l'app pour tous. Laissez votre e-mail (de préférence celui de votre compte Google utilisé sur Play) et je vous ajouterai à la liste des testeurs.",
      emailLabel: "E-mail du compte Google", callLabel: "Indicatif (facultatif)", submit: "Je veux tester",
      privacyNote: 'Votre e-mail sert uniquement au test Google Play. Consultez la <a href="/privacidade">politique de confidentialité</a>.',
      ok: "Inscription reçue ! J'ajouterai votre e-mail à la liste des testeurs ; il suffira ensuite de toucher le badge Google Play ci-dessus.",
      dup: "Cet e-mail est déjà inscrit.", erro: "Inscription impossible. Vérifiez l'e-mail et réessayez.",
      iosTitle: "iPhone et iPad (iOS)",
      iosP1: 'Version native pour iOS 17 ou plus récent, en test : carte (standard, sombre, satellite et hybride), APRS-IS, stations, messages avec accusé de réception, balise GPS avec suivi et TNC KISS en <strong>Bluetooth LE</strong>. Les TNC Bluetooth classique (SPP), USB et modem audio ne fonctionnent pas sur l\'iPhone.',
      iosP2: 'Apple ne permet pas d\'installer des applications téléchargées depuis des sites, comme l\'APK Android. La version iOS sera distribuée via <strong>TestFlight</strong> (bêta gratuite d\'Apple) et le lien d\'installation apparaîtra ici dès l\'ouverture du test.'
    },
    de: {
      badge: "de", badgeAlt: "Jetzt bei Google Play",
      heroNotice: 'Neu: Ab sofort heißt die App <strong>PT2VHF APRS Client</strong>, und neue Android-Versionen werden nur noch über <strong>Google Play</strong> verteilt. Melden Sie sich unten an, um sie als Erste zu testen.',
      playTitle: "Bei Google Play verfügbar (geschlossener Test)",
      playIntro: "PT2VHF APRS Client für Android wird jetzt nur noch über <strong>Google Play</strong> verteilt, mit automatischen Updates aus dem Store. Die App befindet sich im geschlossenen Test: Wenn Ihre E-Mail bereits auf der Testerliste steht, tippen Sie auf das Badge, werden Sie Tester und installieren Sie die App aus dem Play Store. Andernfalls melden Sie sich unten an. Wer bereits die APK nutzt, kann die Store-Version darüber installieren, die Einstellungen bleiben erhalten.",
      playNote: "Probleme bei der Installation oder beim Beitritt zum Test? Schreiben Sie mir über <a href=\"https://wa.me/5561984023634\" target=\"_blank\" rel=\"noopener\">WhatsApp (+55 61 98402 3634)</a> oder per E-Mail an <a href=\"mailto:alexpmr@gmail.com\">alexpmr@gmail.com</a>.",
      testersTitle: "Ich möchte neue Versionen testen",
      testersIntro: "Google Play verlangt einen geschlossenen Test, bevor die App für alle freigegeben wird. Hinterlassen Sie Ihre E-Mail (am besten die Ihres Google-Kontos für Play), und ich nehme Sie in die Testerliste auf.",
      emailLabel: "E-Mail des Google-Kontos", callLabel: "Rufzeichen (optional)", submit: "Ich möchte testen",
      privacyNote: 'Ihre E-Mail wird nur für den Google-Play-Test verwendet. Siehe <a href="/privacidade">Datenschutzerklärung</a>.',
      ok: "Anmeldung erhalten! Ich nehme Ihre E-Mail in die Testerliste auf; danach einfach oben auf das Google-Play-Badge tippen.",
      dup: "Diese E-Mail ist bereits registriert.", erro: "Anmeldung nicht möglich. Bitte E-Mail prüfen und erneut versuchen.",
      iosTitle: "iPhone und iPad (iOS)",
      iosP1: 'Native Version für iOS 17 oder neuer, im Test: Karte (Standard, dunkel, Satellit und Hybrid), APRS-IS, Stationen, Nachrichten mit Bestätigung, GPS-Bake mit Tracker und KISS-TNC über <strong>Bluetooth LE</strong>. TNCs mit klassischem Bluetooth (SPP), USB und Audio-Modem funktionieren auf dem iPhone nicht.',
      iosP2: 'Apple erlaubt keine Installation von Apps, die von Websites geladen werden, wie die Android-APK. Die iOS-Version wird über <strong>TestFlight</strong> (kostenlose Beta von Apple) verteilt; der Installationslink erscheint hier, sobald der Test startet.'
    },
    it: {
      badge: "it", badgeAlt: "Disponibile su Google Play",
      heroNotice: 'Novità: d\'ora in poi l\'app si chiama <strong>PT2VHF APRS Client</strong> e le nuove versioni Android saranno distribuite solo tramite <strong>Google Play</strong>. Iscriviti qui sotto per provarle per primo.',
      playTitle: "Disponibile su Google Play (test chiuso)",
      playIntro: "PT2VHF APRS Client per Android ora è distribuito solo tramite <strong>Google Play</strong>, con aggiornamento automatico dallo store. L'app è in test chiuso: se la tua e-mail è già nella lista dei tester, tocca il badge, diventa tester e installala dal Play Store. Altrimenti, iscriviti qui sotto. Se usi già l'APK, la versione dello store si installa sopra mantenendo le impostazioni.",
      playNote: "Problemi a installare o a entrare nel test? Contattami su <a href=\"https://wa.me/5561984023634\" target=\"_blank\" rel=\"noopener\">WhatsApp (+55 61 98402 3634)</a> o via e-mail a <a href=\"mailto:alexpmr@gmail.com\">alexpmr@gmail.com</a>.",
      testersTitle: "Voglio provare le nuove versioni",
      testersIntro: "Google Play richiede un test chiuso prima di pubblicare l'app per tutti. Lascia la tua e-mail (preferibilmente quella dell'account Google usato su Play) e ti aggiungerò alla lista dei tester.",
      emailLabel: "E-mail dell'account Google", callLabel: "Nominativo (facoltativo)", submit: "Voglio provare",
      privacyNote: 'La tua e-mail è usata solo per il test di Google Play. Vedi l\'<a href="/privacidade">informativa sulla privacy</a>.',
      ok: "Iscrizione ricevuta! Aggiungerò la tua e-mail alla lista dei tester; poi basta toccare il badge Google Play qui sopra.",
      dup: "Questa e-mail è già registrata.", erro: "Impossibile registrarsi. Controlla l'e-mail e riprova.",
      iosTitle: "iPhone e iPad (iOS)",
      iosP1: 'Versione nativa per iOS 17 o successivo, in fase di test: mappa (standard, scura, satellite e ibrida), APRS-IS, stazioni, messaggi con conferma, beacon GPS con tracker e TNC KISS via <strong>Bluetooth LE</strong>. I TNC Bluetooth classico (SPP), USB e modem audio non funzionano su iPhone.',
      iosP2: 'Apple non consente di installare app scaricate da siti web, come l\'APK Android. La versione iOS sarà distribuita tramite <strong>TestFlight</strong> (beta gratuita di Apple) e il link di installazione apparirà qui appena il test sarà aperto.'
    },
    zh: {
      badge: "zh-cn", badgeAlt: "在 Google Play 上获取",
      heroNotice: '新消息：今后应用名称为 <strong>PT2VHF APRS Client</strong>，新的 Android 版本将只通过 <strong>Google Play</strong> 发布。请在下方报名，抢先测试。',
      playTitle: "已在 Google Play 上架（封闭测试）",
      playIntro: "PT2VHF APRS Client Android 版现在只通过 <strong>Google Play</strong> 分发，并由商店自动更新。应用正处于封闭测试：如果你的邮箱已在测试人员名单中，点按徽章，成为测试人员并从 Play 商店安装。如果还不在名单中，请在下方登记。已在使用 APK 的用户可以直接覆盖安装商店版本，设置不会丢失。",
      playNote: "安装或加入测试遇到问题？请通过 <a href=\"https://wa.me/5561984023634\" target=\"_blank\" rel=\"noopener\">WhatsApp (+55 61 98402 3634)</a> 或电子邮件 <a href=\"mailto:alexpmr@gmail.com\">alexpmr@gmail.com</a> 联系我。",
      testersTitle: "我想测试新版本",
      testersIntro: "Google Play 要求在向所有人发布应用之前进行封闭测试。留下你的邮箱（最好是你在 Play 上使用的 Google 账号邮箱），我会把你加入测试人员名单。",
      emailLabel: "Google 账号电子邮件", callLabel: "呼号（可选）", submit: "我想测试",
      privacyNote: '您的电子邮件仅用于 Google Play 测试。请参阅<a href="/privacidade">隐私政策</a>。',
      ok: "已收到登记！我会把你的邮箱加入测试人员名单；之后点按上方的 Google Play 徽章即可。",
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
    // Link do teste no idioma da página (hl do Google Play).
    var HL = { pt: "pt-BR", en: "en", es: "es", fr: "fr", de: "de", it: "it", zh: "zh-CN" };
    Array.prototype.forEach.call(document.querySelectorAll('a.gp-badge[href*="/apps/testing/"]'), function (a) {
      a.href = "https://play.google.com/apps/testing/com.pt2vhf.aprs?hl=" + (HL[code] || "pt-BR");
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
