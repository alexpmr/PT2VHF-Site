(function () {
  "use strict";

  var baseProducts = window.PT2VHF_PRODUCTS || [];
  var products = baseProducts.slice();
  var programId = document.body.getAttribute("data-program") || "";
  var LANGS = ["pt", "en", "es", "fr", "de", "it", "zh"];
  var LOCALES = { pt:"pt-BR", en:"en-US", es:"es-ES", fr:"fr-FR", de:"de-DE", it:"it-IT", zh:"zh-CN" };
  var LANG_DICT = window.PT2VHF_I18N || {};
  var selectedLang = "pt";
  var manifestData = null;

  function normalizeLanguage(value) {
    var code = String(value || "").toLowerCase().split("-")[0];
    return LANGS.indexOf(code) !== -1 ? code : "pt";
  }
  (function () {
    var urlLang = new URLSearchParams(location.search).get("lang");
    var stored = "";
    try { stored = localStorage.getItem("pt2vhf-language") || ""; } catch (e) {}
    selectedLang = normalizeLanguage(urlLang || stored || navigator.language || "pt");
  })();

  function t(key) {
    var own = LANG_DICT[selectedLang] && LANG_DICT[selectedLang].ui;
    var fallback = LANG_DICT.pt && LANG_DICT.pt.ui;
    return (own && own[key]) || (fallback && fallback[key]) || key;
  }
  window.PT2VHF_I18N_T = t;
  window.PT2VHF_I18N_CAPTION = function (shot) {
    var key = shot.captionId;
    var own = LANG_DICT[selectedLang] && LANG_DICT[selectedLang].captions;
    var fallback = LANG_DICT.pt && LANG_DICT.pt.captions;
    return (own && own[key]) || (fallback && fallback[key]) || shot.caption;
  };
  function applyLocaleProducts() {
    var tr = (LANG_DICT[selectedLang] && LANG_DICT[selectedLang].products) || {};
    var order = ["aprs", "prop", "mesh", "sat", "prog"];
    products = baseProducts.map(function (p) {
      return Object.assign({}, p, tr[p.id] || {});
    }).sort(function (a, b) { return order.indexOf(a.id) - order.indexOf(b.id); });
    document.documentElement.lang = LOCALES[selectedLang];
  }

  function textAt(selector, key) {
    var el = document.querySelector(selector);
    if (el) el.textContent = t(key);
  }
  function localizeStatic() {
    var heroCaption = document.getElementById("prop-hero-caption");
    if (heroCaption) {
      var heroText = window.PT2VHF_I18N_CAPTION({captionId:"propLive",caption:"Mapa de calor e monitoramento de bandas em operação"});
      heroCaption.textContent = heroText;
      var heroImage = document.querySelector(".prop-hero-screenshot img");
      if (heroImage) heroImage.alt = heroText;
      var heroLink = document.querySelector(".prop-hero-screenshot a");
      if (heroLink) heroLink.setAttribute("aria-label", heroText);
    }
    if (!programId) {
      var home = {
        ".hero .eyebrow":"homeEyebrow", ".hero h1":"homeTitle",
        ".hero .lead":"homeLead", ".hero-actions a:first-child":"homeExplore",
        ".hero-actions a:nth-child(2)":"homeKnow", "#visao-geral-titulo":"catalogTitle",
        ".catalog-heading > div > p":"catalogIntro", "#instalacao-titulo":"installationTitle",
        ".steps li:nth-child(1) h3":"step1Title", ".steps li:nth-child(1) p":"step1Desc",
        ".steps li:nth-child(2) h3":"step2Title", ".steps li:nth-child(2) p":"step2Desc",
        ".steps li:nth-child(3) h3":"step3Title", ".steps li:nth-child(3) p":"step3Desc",
        "#instalacao .note":"downloadWarning", "#sobre-titulo":"aboutTitle",
        ".about > div:first-child p:nth-of-type(1)":"aboutText1",
        ".about > div:first-child p:nth-of-type(2)":"aboutText2",
        "#contato-titulo":"contactTitle", ".contact p":"contactIntro"
      };
      Object.keys(home).forEach(function (sel) { textAt(sel, home[sel]); });
    } else {
      var selectors = {
        ".breadcrumb a":"detailHome",
        ".hero-actions a:first-child":"downloadsButton",
        ".hero-actions a:nth-child(2)":"featuresButton",
        "#related-title":"relatedTitle", ".related-projects .section-head p":"relatedDesc",
        ".all-projects a":"allProjects", "#project-contact-title":"helpTitle",
        ".project-contact p":"helpDesc", ".project-contact .btn":"helpButton"
      };
      Object.keys(selectors).forEach(function (sel) { textAt(sel, selectors[sel]); });
      var current = products.filter(function (p) { return p.id === programId; })[0];
      if (current) {
        var lead = document.querySelector(".program-hero .lead");
        if (lead) lead.textContent = current.summary || current.tagline;
      }
    }
    textAt('.site-nav a[href^="#instalacao"]', "navInstallation");
    textAt('.site-nav a[href^="#contato"]', "navContact");
    textAt('.site-nav a[href^="/#contato"]', "navContact");
    var footer = document.querySelector(".footer-inner p:first-child");
    if (footer && footer.lastChild && footer.lastChild.nodeType === 3) {
      footer.lastChild.textContent = " PT2VHF. " + t("footerRights");
    }
    syncQuickLanguageButtons();
    var meta = document.querySelector('meta[name="description"]');
    var currentProduct = products.filter(function (p) { return p.id === programId; })[0];
    if (currentProduct) {
      var suffixes = { pt:"Recursos e downloads", en:"Features and downloads", es:"Funciones y descargas", fr:"Fonctions et téléchargements", de:"Funktionen und Downloads", it:"Funzioni e download", zh:"功能与下载" };
      document.title = currentProduct.name + " — " + suffixes[selectedLang];
      if (meta) meta.setAttribute("content", currentProduct.summary || currentProduct.tagline);
    } else {
      document.title = "PT2VHF — " + t("catalogTitle");
      if (meta) meta.setAttribute("content", t("homeLead"));
    }
    // Preserve the selected language when navigating between project pages.
    Array.prototype.forEach.call(document.querySelectorAll('a[href^="/"]'), function (link) {
      var href = link.getAttribute("href");
      if (!/^\/(?:$|aprs(?:[?#]|$)|prop(?:[?#]|$)|mesh(?:[?#]|$)|sat(?:[?#]|$)|prog(?:[?#]|$)|#)/.test(href)) return;
      var url = new URL(href, location.origin);
      url.searchParams.set("lang", selectedLang);
      link.setAttribute("href", url.pathname + url.search + url.hash);
    });
  }
  function setLanguage(lang) {
    selectedLang = normalizeLanguage(lang);
    try { localStorage.setItem("pt2vhf-language", selectedLang); } catch (e) {}
    var url = new URL(location.href);
    url.searchParams.set("lang", selectedLang);
    history.replaceState(null, "", url.pathname + url.search + url.hash);
    applyLocaleProducts();
    merge(manifestData);
    render();
  }
  applyLocaleProducts();
  var galleryData = window.PT2VHF_GALLERIES || {};

  var ICONS = {
    prog:
      '<rect x="7" y="9" width="18" height="20" rx="3"/><path d="M11 9V3"/><path d="M11 14h10M11 18h10M11 22h6"/>',
    prop:
      '<path d="M3 27l7-9 5 5 6-11 8 15"/><path d="M6 10a14 14 0 0 1 20 0"/><path d="M10 14a8 8 0 0 1 12 0"/>',
    mesh:
      '<circle cx="16" cy="6" r="3"/><circle cx="6" cy="24" r="3"/><circle cx="26" cy="24" r="3"/><circle cx="16" cy="17" r="2.5"/><path d="M16 9v5.5M14 18.5l-6 4M18 18.5l6 4M9 24h14"/>',
    aprs:
      '<path d="M16 29s-9-8.5-9-15a9 9 0 0 1 18 0c0 6.5-9 15-9 15z"/><circle cx="16" cy="14" r="3"/>',
    sat:
      '<circle cx="16" cy="16" r="4"/><ellipse cx="16" cy="16" rx="14" ry="7" transform="rotate(-28 16 16)"/><path d="M24 3l5 5M24 8l5-5"/>'
  };

  function icon(name) {
    return (
      '<svg class="icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || "") +
      "</svg>"
    );
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function formatDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    if (p.length !== 3) return iso;
    var date = new Date(iso + "T12:00:00Z");
    return new Intl.DateTimeFormat(LOCALES[selectedLang], { day:"2-digit", month:"short", year:"numeric", timeZone:"UTC" }).format(date);
  }

  function versionLabel(p) {
    if (p.version) return "v" + esc(p.version);
    return p.loadError ? "—" : t("unreleased");
  }

  function shortName(p) {
    return p.name.replace(/^PT2VHF\s+/, "");
  }

  // Categorias de updates.json, na ordem em que aparecem na tabela
  // O catálogo público mostra apenas pacotes instaláveis ou portáteis.
  // Metadados do manifest (SHA-256 e demais arquivos) permanecem intactos
  // para compatibilidade com verificadores e atualizadores existentes.
  var CATEGORIES = [
    { id: "windows-installer", label: "Windows — Instalador" },
    { id: "windows-portable", label: "Windows — Portátil" },
    { id: "linux-deb", label: "Linux — .deb (Debian/Ubuntu)" },
    { id: "linux-targz", label: "Linux — .tar.gz" },
    { id: "linux-appimage", label: "Linux — AppImage" },
    { id: "macos", label: "macOS" }
  ];
  var CATEGORY_IDS = CATEGORIES.map(function (c) { return c.id; });

  // Links do próprio site viram relativos, para funcionar também em testes locais
  var SITE = "https://www.pt2vhf.com/";

  function localUrl(url) {
    url = String(url || "");
    return url.indexOf(SITE) === 0 ? "/" + url.slice(SITE.length) : url;
  }

  function fileName(url) {
    return decodeURIComponent(String(url).split("/").pop());
  }

  function publicDownloadUrl(p, f) {
    return p.id === "aprs" && f.name
      ? "/download.php?product=aprs&file=" + encodeURIComponent(f.name)
      : localUrl(f.url);
  }

  function humanSize(bytes) {
    if (typeof bytes !== "number" || !isFinite(bytes)) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
    var mb = bytes / (1024 * 1024);
    return (mb < 100 ? mb.toFixed(1).replace(".", ",") : Math.round(mb)) + " MB";
  }

  function sortedFiles(p) {
    function rank(f) {
      var i = CATEGORY_IDS.indexOf(f.category);
      return i < 0 ? CATEGORIES.length : i;
    }
    return (p.files || [])
      .filter(function (f) { return f.url && CATEGORY_IDS.indexOf(f.category) !== -1; })
      .map(function (f, i) { return { f: f, i: i }; })
      .sort(function (a, b) { return rank(a.f) - rank(b.f) || a.i - b.i; })
      .map(function (x) { return x.f; });
  }

  function categoryLabel(f) {
    var i = CATEGORY_IDS.indexOf(f.category);
    var keys = { "windows-installer":"winInstaller", "windows-portable":"winPortable", "linux-deb":"linuxDeb", "linux-targz":"linuxTar", "linux-appimage":"linuxAppImage", "macos":"macOS" };
    return (keys[f.category] ? t(keys[f.category]) : (f.label || f.category)) + (f.architecture ? " · " + f.architecture : "");
  }

  function downloadTable(p) {
    if (p.loadError) {
      return '<p class="soon load-error">' + esc(t("loadError")) + '</p>';
    }
    var files = sortedFiles(p);
    if (!files.length && p.id === "aprs" && Array.isArray(p.plannedFiles) && p.plannedFiles.length) {
      var rows = p.plannedFiles.map(function (f) {
        var key = esc(f.counterKey || f.category);
        return '<tr><th scope="row">' + esc(categoryLabel(f)) + '</th>' +
          '<td><span class="file-name">' + esc(f.name) + '</span></td>' +
          '<td class="mono">' + (p.developmentVersion ? 'v' + esc(p.developmentVersion) : '—') +
          '</td><td>—</td><td><span class="badge">' + esc(t("releasePending")) + '</span> ' +
          '<span class="download-count" data-count-product="aprs" data-count-category="' + key +
          '" aria-live="polite">—</span></td></tr>';
      }).join("");
      return '<div class="unreleased"><p class="status-detail">' + esc(t("statAprs")) + '</p>' +
        '<div class="table-wrap"><table class="downloads"><thead><tr><th>' + esc(t("catCategory")) +
        '</th><th>' + esc(t("catFile")) + '</th><th>' + esc(t("catVersion")) +
        '</th><th>' + esc(t("catSize")) + '</th><th>' + esc(t("downloadsCount")) +
        '</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
    }
    if (!files.length) {
      var statusKey = "stat" + p.id.charAt(0).toUpperCase() + p.id.slice(1);
      return '<div class="unreleased"><span class="badge">' + esc(t("releasePending")) + '</span>' +
        '<p class="status-detail">' + esc(t(statusKey)) + '</p>' +
        (p.developmentVersion ? '<p class="build-version">' + esc(t("versionCode")) + ' <strong>v' + esc(p.developmentVersion) + '</strong> · ' + esc(t("notReleased")) + '</p>' : '') +
        (p.ciUrl ? '<a class="build-reference" href="' + esc(p.ciUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(t("ciLink")) + '</a>' : '') +
        '</div>';
    }
    var detailKeys = { "windows-installer":"detailsProgInstaller", "windows-portable":"detailsProgPortable", "linux-deb":"detailsProgDeb", "linux-targz":"detailsProgTar" };
    var rows = files
      .map(function (f, i) {
        var detail = p.id === "prog" && detailKeys[f.category] ? t(detailKeys[f.category]) : f.detail;
        return (
          "<tr>" +
          '<th scope="row" data-label="' + esc(t("catCategory")) + '">' + esc(categoryLabel(f)) + "</th>" +
          '<td data-label="' + esc(t("catFile")) + '"><span class="file-cell"><span class="file-name">' + esc(f.name || fileName(f.url)) + "</span>" +
          (detail ? '<span class="file-label">' + esc(detail) + "</span>" : "") +
          "</span></td>" +
          '<td data-label="' + esc(t("catVersion")) + '" class="mono">' + versionLabel(p) + "</td>" +
          '<td data-label="' + esc(t("catSize")) + '" class="nowrap">' + (humanSize(f.size) || "—") + "</td>" +
          '<td class="action"><div class="download-action"><a class="btn btn-sm ' + (i === 0 ? "btn-primary" : "btn-secondary") + '" href="' + esc(publicDownloadUrl(p, f)) + '"' +
          ' data-counter-product="' + esc(p.id) + '" data-counter-category="' + esc(f.counterKey || f.category) + '"' +
          (p.id === "aprs" ? "" : " download") + '>' + esc(t("download")) +
          '<span class="sr-only"> ' + esc(f.name || fileName(f.url)) + "</span></a>" +
          '<span class="download-count" data-count-product="' + esc(p.id) + '" data-count-category="' + esc(f.counterKey || f.category) + '" aria-live="polite">—</span></div></td>' +
          "</tr>"
        );
      })
      .join("");
    return (
      '<div class="table-wrap">' +
      '<table class="downloads">' +
      "<caption class=\"sr-only\">" + esc(t("downloadsTitle")) + " — " + esc(p.name) + "</caption>" +
      "<thead><tr>" +
      '<th scope="col">' + esc(t("catCategory")) + '</th><th scope="col">' + esc(t("catFile")) + '</th><th scope="col">' + esc(t("catVersion")) + '</th>' +
      '<th scope="col">' + esc(t("catSize")) + '</th><th scope="col"><span class="sr-only">' + esc(t("download")) + '</span></th>' +
      "</tr></thead>" +
      "<tbody>" + rows + "</tbody>" +
      "</table>" +
      "</div>"
    );
  }

  function screenshotGallery(p) {
    var images = galleryData[p.id] || [];
    var heading = window.PT2VHF_I18N_T ? window.PT2VHF_I18N_T("screenshots") : "Capturas de tela";
    if (!images.length) {
      return '<section class="screenshots" id="capturas"><h3>' + esc(heading) + '</h3>' +
        '<p class="screenshots-empty">' + esc(window.PT2VHF_I18N_T ? window.PT2VHF_I18N_T("screenshotsPending") : "Capturas reais deste projeto ainda não foram publicadas.") + '</p></section>';
    }
    var real = images.some(function (shot) { return shot.type === "screenshot"; });
    var intro = real
      ? (window.PT2VHF_I18N_T ? window.PT2VHF_I18N_T("screenshotsIntro") : "Imagens reais da aplicação.")
      : (window.PT2VHF_I18N_T ? window.PT2VHF_I18N_T("visualIdentityOnly") : "Identidade visual do projeto; capturas de tela ainda não publicadas.");
    return '<section class="screenshots" id="capturas"><h3>' + esc(heading) + '</h3><p class="screenshots-intro">' + esc(intro) + '</p>' +
      '<div class="screenshot-grid">' + images.map(function (shot) {
        var caption = (window.PT2VHF_I18N_CAPTION ? window.PT2VHF_I18N_CAPTION(shot) : shot.caption) || p.name;
        return '<figure class="screenshot-card"><a href="' + esc(shot.src) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(caption) + '">' +
          '<img src="' + esc(shot.src) + '" alt="' + esc(caption) + '" loading="lazy"></a>' +
          '<figcaption>' + esc(caption) + '</figcaption></figure>';
      }).join("") + "</div></section>";
  }

  function listBlock(title, items, render) {
    if (!items || !items.length) return "";
    return (
      '<div class="info-block">' +
      "<h3>" + title + "</h3>" +
      '<ul class="info-list">' + items.map(render).join("") + "</ul>" +
      "</div>"
    );
  }

  function renderOverview(el) {
    var otherOnly = el.getAttribute("data-overview-other") === "true";
    el.innerHTML = products
      .filter(function (p) { return !otherOnly || p.id !== programId; })
      .map(function (p) {
        return (
          '<a class="ov-card" href="/' + esc(p.id) + '">' +
          '<span class="product-icon">' + icon(p.icon) + "</span>" +
          '<span class="ov-text"><strong>' + esc(shortName(p)) + "</strong>" +
          '<span class="ov-tagline">' + esc(p.summary || p.tagline || "") + "</span>" +
          '<span class="ov-version' + (p.version ? "" : " is-soon") + '">' + versionLabel(p) + "</span>" +
          (!p.version && p.developmentVersion ? '<span class="ov-dev">Código v' + esc(p.developmentVersion) + '</span>' : '') +
          '<span class="ov-cta">' + esc(t("cardOpen")) + '</span></span>' +
          "</a>"
        );
      })
      .join("");
  }

  function renderSections(el) {
    el.innerHTML = products
      .filter(function (p) { return p.id === programId; })
      .map(function (p, i) {
        var paragraphs = [].concat(p.description || []);
        var aside =
          listBlock(esc(t("supportedTitle")), p.supported, function (s) {
            return typeof s === "string"
              ? "<li>" + esc(s) + "</li>"
              : "<li><strong>" + esc(s.name) + "</strong>" + (s.detail ? "<span>" + esc(s.detail) + "</span>" : "") + "</li>";
          }) +
          listBlock(esc(t("requirementsTitle")), p.requirements, function (r) { return "<li>" + esc(r) + "</li>"; });
        return (
          '<section class="section program' + (i % 2 ? " section-alt" : "") + '" id="' + esc(p.id) + '" aria-labelledby="' + esc(p.id) + '-titulo">' +
          '<div class="container">' +
          '<div class="program-head">' +
          '<div class="product-icon">' + icon(p.icon) + "</div>" +
          "<div>" +
          '<h2 id="' + esc(p.id) + '-titulo">' + esc(p.name) + "</h2>" +
          '<p class="program-meta"><span class="badge">' + versionLabel(p) + "</span>" +
          (p.date ? " <span>" + esc(t("launchDate")) + " " + formatDate(p.date) + "</span>" : "") +
          (!p.version && p.developmentVersion ? ' <span>' + esc(t("versionCode")) + ' v' + esc(p.developmentVersion) + '</span>' : '') +
          "</p>" +
          "</div>" +
          "</div>" +
          '<p class="tagline">' + esc(p.tagline) + "</p>" +
          '<div class="program-body' + (aside ? "" : " no-aside") + '">' +
          '<div class="program-main">' +
          '<div class="description">' + paragraphs.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div>" +
          '<h3 id="recursos">' + esc(t("featuresTitle")) + '</h3>' +
          '<ul class="features">' +
          p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") +
          "</ul>" +
          "</div>" +
          (aside ? '<aside class="program-aside">' + aside + "</aside>" : "") +
          "</div>" +
          screenshotGallery(p) +
          '<div class="program-downloads" id="' + esc(p.id) + '-downloads">' +
          '<h3 id="downloads">' + esc(t("downloadsTitle")) + '</h3>' +
          downloadTable(p) +
          "</div>" +
          "</div>" +
          "</section>"
        );
      })
      .join("");
  }

  // Junta os textos de products.js com versões e arquivos de updates.json
  var catalogUpdated = "";
  function merge(data) {
    manifestData = data;
    catalogUpdated = (data && data.updated) || "";
    var list = (data && data.products) || null;
    products.forEach(function (p) {
      var u = list && list[p.id];
      p.loadError = !list;
      p.version = (u && u.version) || "";
      p.date = (u && u.version && u.date) || "";
      p.files = (u && u.version && Array.isArray(u.files)) ? u.files : [];
      p.developmentVersion = (u && u.developmentVersion) || "";
      p.releaseStatus = (u && u.releaseStatus) || "";
      p.ciUrl = (u && u.ciUrl) || "";
      p.ciLabel = (u && u.ciLabel) || "";
    });
  }

  function render() {
    localizeStatic();
    var updatedEl = document.getElementById("catalog-updated");
    if (updatedEl && catalogUpdated) updatedEl.textContent = t("catalogUpdated") + " " + formatDate(catalogUpdated);
    var overviewEl = document.getElementById("overview-list");
    if (overviewEl) renderOverview(overviewEl);

    var sectionsEl = document.getElementById("program-sections");
    if (sectionsEl) renderSections(sectionsEl);
    renderDownloadCounters();

    // Âncora na URL (ex.: /#prop): rola depois que as seções existem
    if (location.hash) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
  }

  function load() {
    if (!window.fetch) return Promise.reject(new Error("fetch indisponível"));
    return fetch("/updates.json", { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  // Estatísticas por tipo de instalador, acumuladas independentemente da versão.
  // A API PHP usa armazenamento fora da raiz pública. Em hospedagem puramente
  // estática, os contadores permanecem indisponíveis (nunca inventar números).
  var cachedCounters = null;
  function renderDownloadCounters() {
    if (!cachedCounters) return;
    var elements = document.querySelectorAll("[data-count-product][data-count-category]");
    Array.prototype.forEach.call(elements, function (el) {
      var p = el.getAttribute("data-count-product");
      var c = el.getAttribute("data-count-category");
      if (!cachedCounters.counts || !cachedCounters.counts[p]) return;
      var n = cachedCounters.counts[p][c] || 0;
      el.textContent = new Intl.NumberFormat(document.documentElement.lang || "pt-BR").format(n) + " " +
        (window.PT2VHF_I18N_T ? window.PT2VHF_I18N_T("downloadsCount") : "downloads acumulados");
    });
  }
  function loadDownloadCounters() {
    return fetch("/download.php?mode=stats", { cache: "no-store" }).then(function (response) {
      if (!response.ok) throw new Error("Counter unavailable");
      return response.json();
    }).then(function (data) {
      if (!data || data.schema !== 1 || !data.counts) throw new Error("Invalid counters");
      cachedCounters = data;
      renderDownloadCounters();
    }).catch(function () {
      Array.prototype.forEach.call(document.querySelectorAll(".download-count"), function (el) {
        el.textContent = window.PT2VHF_I18N_T ? window.PT2VHF_I18N_T("counterUnavailable") : "Contador indisponível";
      });
    });
  }

  // APRS: o servidor registra a solicitação antes de servir o arquivo.
  // Jamais emitir um segundo POST no mesmo clique.
  document.addEventListener("click", function (event) {
    var a = event.target.closest ? event.target.closest("a[data-counter-product][data-counter-category]") : null;
    if (!a) return;
    if (a.getAttribute("data-counter-product") === "aprs") {
      setTimeout(loadDownloadCounters, 900);
      setTimeout(loadDownloadCounters, 2800);
    } else if (window.navigator) {
      var form = new FormData();
      form.append("action", "count");
      form.append("product", a.getAttribute("data-counter-product"));
      form.append("category", a.getAttribute("data-counter-category"));
      if (navigator.sendBeacon) navigator.sendBeacon("/download.php", form);
      else if (window.fetch) fetch("/download.php", { method:"POST", body:form, keepalive:true, cache:"no-store" }).catch(function () {});
      setTimeout(loadDownloadCounters, 900);
    }
  }, true);
  window.addEventListener("focus", function () { if (programId) loadDownloadCounters(); });
  document.addEventListener("visibilitychange", function () {
    if (programId && !document.hidden) loadDownloadCounters();
  });

  // Preserva os favoritos antigos com âncoras no catálogo anterior.
  if (!programId) {
    var oldLink = /^#(aprs|prop|mesh|sat|prog)(-downloads)?$/.exec(location.hash);
    if (oldLink) window.location.replace("/" + oldLink[1] + "?lang=" + selectedLang + (oldLink[2] ? "#downloads" : ""));
  }

  load()
    .then(merge, function (err) {
      if (window.console) console.warn("updates.json:", err);
      merge(null);
    })
    .then(function () {
      render();
      if (programId) loadDownloadCounters();
    });

  // Fiel ao seletor do APRS Client: botão de idioma atual + menu vertical.
  var languageMeta = {
    pt: {name:"Português (Brasil)",file:"br.svg",alt:"Brasil"},
    en: {name:"English",file:"gb.svg",alt:"Reino Unido"},
    es: {name:"Español",file:"es.svg",alt:"Espanha"},
    fr: {name:"Français",file:"fr.svg",alt:"França"},
    de: {name:"Deutsch",file:"de.svg",alt:"Alemanha"},
    it: {name:"Italiano",file:"it.svg",alt:"Itália"},
    zh: {name:"简体中文",file:"cn.svg",alt:"China"}
  };
  var languageSwitch = document.getElementById("languageQuickSwitch");
  var languageCurrent = document.getElementById("languageQuickCurrent");
  var languageMenu = document.getElementById("languageQuickMenu");
  var languageOptions = Array.prototype.slice.call(document.querySelectorAll(".language-quick-option"));
  function syncQuickLanguageButtons() {
    var meta = languageMeta[selectedLang] || languageMeta.pt;
    var label = document.getElementById("languageQuickCurrentLabel");
    var flag = document.getElementById("languageQuickCurrentFlag");
    if (label) label.textContent = meta.name;
    if (flag) {
      flag.src = "/assets/img/flags/" + meta.file;
      flag.alt = meta.alt;
    }
    if (languageSwitch) languageSwitch.setAttribute("aria-label", t("language"));
    if (languageCurrent) {
      languageCurrent.setAttribute("title", t("language"));
      languageCurrent.setAttribute("aria-label", t("language") + ": " + meta.name);
    }
    languageOptions.forEach(function (option) {
      var isActive = option.getAttribute("data-language") === selectedLang;
      option.classList.toggle("active", isActive);
      option.setAttribute("aria-checked", isActive ? "true" : "false");
    });
  }
  function setLanguageMenuOpen(open, focusChoice) {
    if (!languageMenu || !languageCurrent) return;
    languageMenu.hidden = !open;
    languageCurrent.setAttribute("aria-expanded", open ? "true" : "false");
    if (open && focusChoice) {
      var active = languageOptions.filter(function (option) {
        return option.getAttribute("aria-checked") === "true";
      })[0] || languageOptions[0];
      if (active) active.focus();
    }
  }
  if (languageSwitch && languageCurrent && languageMenu) {
    languageCurrent.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setLanguageMenuOpen(languageMenu.hidden);
    });
    languageCurrent.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" || event.key === "Enter" && !languageMenu.hidden) {
        event.preventDefault();
        setLanguageMenuOpen(true, true);
      }
    });
    languageOptions.forEach(function (option) {
      option.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var targetLang = option.getAttribute("data-language");
        if (targetLang && targetLang !== selectedLang) setLanguage(targetLang);
        setLanguageMenuOpen(false);
        languageCurrent.focus();
      });
    });
    languageMenu.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setLanguageMenuOpen(false);
        languageCurrent.focus();
        return;
      }
      if (["ArrowDown","ArrowUp","Home","End"].indexOf(event.key) === -1) return;
      event.preventDefault();
      var index = languageOptions.indexOf(document.activeElement);
      var nextIndex = index;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = languageOptions.length - 1;
      if (event.key === "ArrowDown") nextIndex = (index + 1) % languageOptions.length;
      if (event.key === "ArrowUp") nextIndex = (index < 0 ? 0 : (index - 1 + languageOptions.length) % languageOptions.length);
      if (languageOptions[nextIndex]) languageOptions[nextIndex].focus();
    });
    document.addEventListener("click", function (event) {
      if (!languageSwitch.contains(event.target)) setLanguageMenuOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !languageMenu.hidden) {
        setLanguageMenuOpen(false);
        languageCurrent.focus();
      }
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Menu móvel
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
