(function () {
  "use strict";

  var products = window.PT2VHF_PRODUCTS || [];
  var programId = document.body.getAttribute("data-program") || "";

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
    return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : iso;
  }

  function versionLabel(p) {
    if (p.version) return "v" + esc(p.version);
    return p.loadError ? "—" : "Instalador pendente";
  }

  function shortName(p) {
    return p.name.replace(/^PT2VHF\s+/, "");
  }

  // Categorias de updates.json, na ordem em que aparecem na tabela
  var CATEGORIES = [
    { id: "windows-installer", label: "Windows — Instalador" },
    { id: "windows-portable", label: "Windows — Portátil" },
    { id: "linux-deb", label: "Linux — .deb (Debian/Ubuntu)" },
    { id: "linux-targz", label: "Linux — .tar.gz" },
    { id: "macos", label: "macOS" },
    { id: "source", label: "Código-fonte" },
    { id: "checksums", label: "Somas de verificação" }
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
      .filter(function (f) { return f.url; })
      .map(function (f, i) { return { f: f, i: i }; })
      .sort(function (a, b) { return rank(a.f) - rank(b.f) || a.i - b.i; })
      .map(function (x) { return x.f; });
  }

  function categoryLabel(f) {
    var i = CATEGORY_IDS.indexOf(f.category);
    return i < 0 ? f.label || f.category : CATEGORIES[i].label;
  }

  function downloadTable(p) {
    if (p.loadError) {
      return '<p class="soon load-error">Não foi possível carregar a lista de downloads agora. Recarregue a página em instantes.</p>';
    }
    var files = sortedFiles(p);
    if (!files.length) {
      return '<div class="unreleased"><span class="badge">Publicação pendente</span>' +
        '<p class="status-detail">' + esc(p.releaseStatus || "Ainda não há instalador público para este projeto.") + '</p>' +
        (p.developmentVersion ? '<p class="build-version">Versão identificada no código: <strong>v' + esc(p.developmentVersion) + '</strong> · não é uma versão distribuída neste site.</p>' : '') +
        (p.ciUrl ? '<a class="build-reference" href="' + esc(p.ciUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(p.ciLabel || "Ver build no GitLab (acesso restrito)") + '</a>' : '') +
        '</div>';
    }
    var rows = files
      .map(function (f, i) {
        return (
          "<tr>" +
          '<th scope="row" data-label="Categoria">' + esc(categoryLabel(f)) + "</th>" +
          '<td data-label="Arquivo"><span class="file-cell"><span class="file-name">' + esc(f.name || fileName(f.url)) + "</span>" +
          (f.detail ? '<span class="file-label">' + esc(f.detail) + "</span>" : "") +
          "</span></td>" +
          '<td data-label="Versão" class="mono">' + versionLabel(p) + "</td>" +
          '<td data-label="Tamanho" class="nowrap">' + (humanSize(f.size) || "—") + "</td>" +
          '<td data-label="SHA-256" class="hash">' + (f.sha256 ? "<code>" + esc(String(f.sha256).toLowerCase()) + "</code>" : "—") + "</td>" +
          '<td class="action"><a class="btn btn-sm ' + (i === 0 ? "btn-primary" : "btn-secondary") + '" href="' + esc(localUrl(f.url)) + '" download>Baixar' +
          '<span class="sr-only"> ' + esc(f.name || fileName(f.url)) + "</span></a></td>" +
          "</tr>"
        );
      })
      .join("");
    return (
      '<div class="table-wrap">' +
      '<table class="downloads">' +
      "<caption class=\"sr-only\">Downloads do " + esc(p.name) + "</caption>" +
      "<thead><tr>" +
      '<th scope="col">Categoria</th><th scope="col">Arquivo</th><th scope="col">Versão</th>' +
      '<th scope="col">Tamanho</th><th scope="col">SHA-256</th><th scope="col"><span class="sr-only">Baixar</span></th>' +
      "</tr></thead>" +
      "<tbody>" + rows + "</tbody>" +
      "</table>" +
      "</div>"
    );
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
          '<span class="ov-tagline">' + esc(p.tagline || "") + "</span>" +
          '<span class="ov-version' + (p.version ? "" : " is-soon") + '">' + versionLabel(p) + "</span>" +
          (!p.version && p.developmentVersion ? '<span class="ov-dev">Código v' + esc(p.developmentVersion) + '</span>' : '') +
          '<span class="ov-cta">Abrir projeto</span></span>' +
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
          listBlock("Rádios e equipamentos suportados", p.supported, function (s) {
            return typeof s === "string"
              ? "<li>" + esc(s) + "</li>"
              : "<li><strong>" + esc(s.name) + "</strong>" + (s.detail ? "<span>" + esc(s.detail) + "</span>" : "") + "</li>";
          }) +
          listBlock("Requisitos", p.requirements, function (r) { return "<li>" + esc(r) + "</li>"; });
        return (
          '<section class="section program' + (i % 2 ? " section-alt" : "") + '" id="' + esc(p.id) + '" aria-labelledby="' + esc(p.id) + '-titulo">' +
          '<div class="container">' +
          '<div class="program-head">' +
          '<div class="product-icon">' + icon(p.icon) + "</div>" +
          "<div>" +
          '<h2 id="' + esc(p.id) + '-titulo">' + esc(p.name) + "</h2>" +
          '<p class="program-meta"><span class="badge">' + versionLabel(p) + "</span>" +
          (p.date ? " <span>Lançado em " + formatDate(p.date) + "</span>" : "") +
          (!p.version && p.developmentVersion ? ' <span>Código v' + esc(p.developmentVersion) + '</span>' : '') +
          "</p>" +
          "</div>" +
          "</div>" +
          '<p class="tagline">' + esc(p.tagline) + "</p>" +
          '<div class="program-body' + (aside ? "" : " no-aside") + '">' +
          '<div class="program-main">' +
          '<div class="description">' + paragraphs.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div>" +
          '<h3 id="recursos">Recursos</h3>' +
          '<ul class="features">' +
          p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") +
          "</ul>" +
          "</div>" +
          (aside ? '<aside class="program-aside">' + aside + "</aside>" : "") +
          "</div>" +
          '<div class="program-downloads" id="' + esc(p.id) + '-downloads">' +
          '<h3 id="downloads">Downloads</h3>' +
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
    var updatedEl = document.getElementById("catalog-updated");
    if (updatedEl && catalogUpdated) updatedEl.textContent = "Catálogo conferido em " + formatDate(catalogUpdated);
    var overviewEl = document.getElementById("overview-list");
    if (overviewEl) renderOverview(overviewEl);

    var sectionsEl = document.getElementById("program-sections");
    if (sectionsEl) renderSections(sectionsEl);

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

  // Preserva os favoritos antigos com âncoras no catálogo anterior.
  if (!programId) {
    var oldLink = /^#(aprs|prop|mesh|sat|prog)(-downloads)?$/.exec(location.hash);
    if (oldLink) window.location.replace("/" + oldLink[1] + (oldLink[2] ? "#downloads" : ""));
  }

  load()
    .then(merge, function (err) {
      if (window.console) console.warn("updates.json:", err);
      merge(null);
    })
    .then(render);

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
