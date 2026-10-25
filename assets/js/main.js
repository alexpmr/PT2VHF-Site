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

  function downloadButtons(p) {
    return p.files
      .map(function (f) {
        if (!f.url) {
          return (
            '<span class="btn btn-disabled" aria-disabled="true">' +
            esc(f.os) + " · Em breve</span>"
          );
        }
        return (
          '<a class="btn btn-primary" href="' + esc(f.url) + '" download>' +
          "Baixar para " + esc(f.os) +
          (f.size ? ' <span class="btn-meta">' + esc(f.size) + "</span>" : "") +
          "</a>"
        );
      })
      .join("");
  }

  function renderProducts(el) {
    el.innerHTML = products
      .map(function (p) {
        return (
          '<article class="product" id="' + esc(p.id) + '">' +
          '<div class="product-head">' +
          '<div class="product-icon">' + icon(p.icon) + "</div>" +
          '<span class="badge">' + versionLabel(p) + "</span>" +
          "</div>" +
          "<h3>" + esc(p.name) + "</h3>" +
          '<p class="tagline">' + esc(p.tagline) + "</p>" +
          "<p>" + esc(p.description) + "</p>" +
          '<ul class="features">' +
          p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") +
          "</ul>" +
          '<div class="product-actions">' + downloadButtons(p) + "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderDownloads(el) {
    var rows = [];
    products.forEach(function (p) {
      p.files.forEach(function (f) {
        rows.push(
          "<tr>" +
          '<td data-label="Programa"><a href="#' + esc(p.id) + '">' + esc(p.name) + "</a></td>" +
          '<td data-label="Versão">' + versionLabel(p) + "</td>" +
          '<td data-label="Sistema">' + esc(f.os) + "</td>" +
          '<td data-label="Data">' + (formatDate(p.date) || "—") + "</td>" +
          '<td data-label="Tamanho">' + (esc(f.size) || "—") + "</td>" +
          '<td data-label="">' +
          (f.url
            ? '<a class="btn btn-primary btn-sm" href="' + esc(f.url) + '" download>Baixar</a>'
            : '<span class="btn btn-disabled btn-sm" aria-disabled="true">Em breve</span>') +
          "</td>" +
          "</tr>" +
          (f.sha256
            ? '<tr class="hash-row"><td colspan="6"><span>SHA-256</span> <code>' + esc(f.sha256) + "</code></td></tr>"
            : "")
        );
      });
    });
    el.innerHTML = rows.join("");
  }

  var productsEl = document.getElementById("product-list");
  if (productsEl) renderProducts(productsEl);

  var downloadsEl = document.getElementById("download-rows");
  if (downloadsEl) renderDownloads(downloadsEl);

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
