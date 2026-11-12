/* i18n — instant EN / ZH switching, persisted between sessions. */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  const D = window.VSP_DATA, C = window.VSP_CONFIG;
  const K = C.storageKeys.lang;

  function current() {
    return (localStorage.getItem(K) === "zh") ? "zh" : "en";
  }

  /* t('nav.home') → string in current language */
  function t(path) {
    let node = D.i18n;
    for (const part of path.split(".")) {
      if (!node) return path;
      node = node[part];
    }
    if (node == null) return path;
    return typeof node === "string" ? node : (node[current()] || node.en || "");
  }

  /* fmt('Question {a} of {b}', {a:1,b:5}) */
  function fmt(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (m, key) {
      return vars && vars[key] != null ? vars[key] : m;
    });
  }

  function applyStatic() {
    const lang = current();
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.body.classList.toggle("lang-zh", lang === "zh");
    document.body.classList.toggle("lang-en", lang !== "zh");

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-text]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n-text"));
    });

    // brand strings (statically bilingual)
    const bl = document.getElementById("brandLine");
    if (bl) bl.textContent = C.brand.line_en;
    const bc = document.getElementById("brandCollection");
    if (bc) bc.textContent = C.brand.collection_en + " " + C.brand.collection_zh;

    const lt = document.getElementById("langToggle");
    if (lt) {
      lt.textContent = lang === "zh" ? "EN" : "中文";
      lt.setAttribute("lang", lang === "zh" ? "en" : "zh-CN");
    }
  }

  function toggle() {
    localStorage.setItem(K, current() === "zh" ? "en" : "zh");
    applyStatic();
    document.dispatchEvent(new CustomEvent("vsp:lang"));
  }

  function init() {
    // ?lang=zh|en — deep-link preset (also handy for QR codes), persisted
    const p = /[?&]lang=(en|zh)/.exec(location.search);
    if (p) localStorage.setItem(K, p[1] === "zh" ? "zh" : "en");
    applyStatic();
    const lt = document.getElementById("langToggle");
    if (lt) lt.addEventListener("click", toggle);
  }

  VSP.i18n = { current: current, t: t, fmt: fmt, toggle: toggle, applyStatic: applyStatic, init: init };
})(window.VSP);