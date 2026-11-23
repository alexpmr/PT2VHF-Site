/* Estatística de visitas do PT2VHF: um beacon por página, sem cookies.
 * Envia só o caminho, o domínio de origem externo, o idioma e o fuso do navegador. */
(function () {
  try {
    if (!navigator.sendBeacon || navigator.webdriver) return;
    var ref = "";
    try {
      var r = document.referrer ? new URL(document.referrer).hostname : "";
      if (r && r !== location.hostname) ref = r;
    } catch (e) {}
    var tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
    var body = new URLSearchParams();
    body.set("p", location.pathname);
    body.set("r", ref);
    body.set("l", navigator.language || "");
    body.set("z", tz);
    navigator.sendBeacon("/visit.php", body);
  } catch (e) {}
})();
