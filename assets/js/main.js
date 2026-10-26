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

  function fileItem(f, primary) {
    return (
      '<li class="file">' +
      '<div class="file-info">' +
      '<span class="file-os">' + esc(f.os) + "</span>" +
      (f.label ? '<span class="file-label">' + esc(f.label) + "</span>" : "") +
      (f.size ? '<span class="file-size">' + esc(f.size) + "</span>" : "") +
      "</div>" +
      '<a class="btn ' + (primary ? "btn-primary" : "btn-secondary") + '" href="' + esc(f.url) + '" download>Baixar</a>' +
      (f.sha256
        ? '<p class="file-hash"><span>SHA-256</span> <code>' + esc(f.sha256) + "</code></p>"
        : "") +
      "</li>"
    );
  }

  function downloadPanel(p) {
    var files = p.files.filter(function (f) { return f.url; });
    var body = files.length
      ? '<ul class="file-list">' +
        files.map(function (f, i) { return fileItem(f, i === 0); }).join("") +
        "</ul>"
      : '<p class="soon">Em breve. Este programa ainda não tem versão publicada.</p>';
    return (
      '<div class="download-panel">' +
      "<h3>Downloads" + (p.version ? ' <span class="badge">v' + esc(p.version) + "</span>" : "") + "</h3>" +
      body +
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
        return (
          '<section class="section program' + (i % 2 ? " section-alt" : "") + '" id="' + esc(p.id) + '" aria-labelledby="' + esc(p.id) + '-titulo">' +
          '<div class="container program-inner">' +
          '<div class="program-info">' +
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
          '<p class="description">' + esc(p.description) + "</p>" +
          '<ul class="features">' +
          p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") +
          "</ul>" +
          "</div>" +
          downloadPanel(p) +
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
