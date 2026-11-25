/* app — bootstrap: theme, wiring, service worker, toast. */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  const C = window.VSP_CONFIG;
  const K = C.storageKeys.theme;

  /* ---------- theme (light / dark) ---------- */
  function applyTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", mode === "dark" ? "#22101F" : "#3A0D2D");
  }
  function currentThemePref() {
    const saved = VSP.store.get(K, null);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function initTheme() {
    // ?theme=light|dark — deep-link preset (also handy for QR codes), persisted
    const p = /[?&]theme=(light|dark)/.exec(location.search);
    if (p) VSP.store.set(K, p[1]);
    applyTheme(currentThemePref());
    const btn = document.getElementById("themeToggle");
    btn.addEventListener("click", function () {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      VSP.store.set(K, next);
      applyTheme(next);
    });
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (VSP.store.get(K, null) == null) applyTheme(e.matches ? "dark" : "light");
      });
    }
  }

  /* ---------- toast ---------- */
  let toastTimer = null;
  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 3200);
  }

  /* ---------- boot ---------- */
  function init() {
    VSP.icons.init();
    VSP.i18n.init();
    initTheme();
    VSP.motes.init();

    VSP.share.init();
    VSP.cards.init();
    VSP.quiz.init();
    VSP.screens.init();
    VSP.kiosk.init();
    VSP.ambience.init();
    VSP.attract.init();

    // ?screen=home|quiz|collection|seasons|picks — deep-link entry point
    const s = /[?&]screen=(home|quiz|collection|seasons|picks)/.exec(location.search);
    VSP.screens.show(s ? s[1] : "home");

    // ?vial=LPG042 — open one card directly (QR posters at the booth)
    const v = /[?&]vial=([A-Za-z0-9]+)/.exec(location.search);
    if (v && window.VSP_DATA.byId(v[1])) VSP.cards.openById(v[1]);

    // service worker: offline first, installable (http/https only)
    if ("serviceWorker" in navigator &&
        (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
      try {
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", function () {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });
        navigator.serviceWorker.register("sw.js")
          .then(function (registration) { return registration.update(); })
          .catch(function () { /* offline via USB still works without SW */ });
      } catch (e) { /* file:// — skip */ }
    }
  }

  VSP.toast = toast;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window.VSP);