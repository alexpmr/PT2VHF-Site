(function () {
  "use strict";

  var products = window.PT2VHF_PRODUCTS || [];

  var ICONS = {
    prog:
      '<rect x="7" y="9" width="18" height="20" rx="3"/><path d="M11 9V3"/><path d="M11 14h10M11 18h10M11 22h6"/>',
    prop:
      '<path d="M3 27l7-9 5 5 6-11 8 15"/><path d="M6 10a14 14 0 0 1 20 0"/><path d="M10 14a8 8 0 0 1 12 0"/>',
    mesh:
      '<circle cx="16" cy="6" r="3"/><circle cx="6" cy="24" r="3"/><circle cx="26" cy="24" r="3"/><circle cx="16" cy="17" r="2.5"/><path d="M16 9v5.5M14 18.5l-6 4M18 18.5l6 4M9 24h14"/>',
    aprs:
      '<path d="M16 29s-9-8.5-9-15a9 9 0 0 1 18 0c0 6.5-9 15-9 15z"/><circle cx="16" cy="14" r="3"/>'
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
    return p.version ? "v" + esc(p.version) : "Em breve";
  }

  function shortName(p) {
    return p.name.replace(/^PT2VHF\s+/, "");
  }

  var CATEGORIES = [
    "Windows — Instalador",
    "Windows — Portátil",
    "Linux — .deb (Debian/Ubuntu)",
    "Linux — .tar.gz",
    "macOS",
    "Código-fonte",
    "Somas de verificação"
  ];

  function fileName(url) {
    return decodeURIComponent(String(url).split("/").pop());
  }

  function sortedFiles(p) {
    function rank(f) {
      var i = CATEGORIES.indexOf(f.category);
      return i < 0 ? CATEGORIES.length : i;
    }
    return (p.files || [])
      .filter(function (f) { return f.url; })
      .map(function (f, i) { return { f: f, i: i }; })
      .sort(function (a, b) { return rank(a.f) - rank(b.f) || a.i - b.i; })
      .map(function (x) { return x.f; });
  }

  function downloadTable(p) {
    var files = sortedFiles(p);
    if (!files.length) {
      return '<p class="soon"><span class="badge">Em breve</span> Este programa ainda não tem versão publicada.</p>';
    }
    var rows = files
      .map(function (f, i) {
        return (
          "<tr>" +
          '<th scope="row" data-label="Categoria">' + esc(f.category) + "</th>" +
          '<td data-label="Arquivo"><span class="file-cell"><span class="file-name">' + esc(fileName(f.url)) + "</span>" +
          (f.label ? '<span class="file-label">' + esc(f.label) + "</span>" : "") +
          "</span></td>" +
          '<td data-label="Versão" class="mono">' + versionLabel(p) + "</td>" +
          '<td data-label="Tamanho" class="nowrap">' + (esc(f.size) || "—") + "</td>" +
          '<td data-label="SHA-256" class="hash">' + (f.sha256 ? "<code>" + esc(f.sha256) + "</code>" : "—") + "</td>" +
          '<td class="action"><a class="btn btn-sm ' + (i === 0 ? "btn-primary" : "btn-secondary") + '" href="' + esc(f.url) + '" download>Baixar' +
          '<span class="sr-only"> ' + esc(fileName(f.url)) + "</span></a></td>" +
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
    el.innerHTML = products
      .map(function (p) {
        return (
          '<a class="ov-card" href="#' + esc(p.id) + '">' +
          '<span class="product-icon">' + icon(p.icon) + "</span>" +
          '<span class="ov-text"><strong>' + esc(shortName(p)) + "</strong>" +
          '<span class="ov-version' + (p.version ? "" : " is-soon") + '">' + versionLabel(p) + "</span></span>" +
          "</a>"
        );
      })
      .join("");
  }

  function renderSections(el) {
    el.innerHTML = products
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
          "</p>" +
          "</div>" +
          "</div>" +
          '<p class="tagline">' + esc(p.tagline) + "</p>" +
          '<div class="program-body' + (aside ? "" : " no-aside") + '">' +
          '<div class="program-main">' +
          '<div class="description">' + paragraphs.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div>" +
          "<h3>Recursos</h3>" +
          '<ul class="features">' +
          p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") +
          "</ul>" +
          "</div>" +
          (aside ? '<aside class="program-aside">' + aside + "</aside>" : "") +
          "</div>" +
          '<div class="program-downloads">' +
          '<h3 id="' + esc(p.id) + '-downloads">Downloads</h3>' +
          downloadTable(p) +
          "</div>" +
          "</div>" +
          "</section>"
        );
      })
      .join("");
  }

  var overviewEl = document.getElementById("overview-list");
  if (overviewEl) renderOverview(overviewEl);

  var sectionsEl = document.getElementById("program-sections");
  if (sectionsEl) renderSections(sectionsEl);

  // Âncora na URL (ex.: /#prop): rola depois que as seções existem
  if (location.hash) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
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
