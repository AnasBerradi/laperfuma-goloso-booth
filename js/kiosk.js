/* kiosk — booth safety: disable selection & pull-to-refresh, hide the
   cursor, and a hidden staff reset (long-press the logo 3 s) that clears
   favorites between customers. Enable kiosk mode with ?kiosk=1. */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  const C = window.VSP_CONFIG;
  const K = "vsp.kiosk";

  const $ = function (id) { return document.getElementById(id); };

  let holdTimer = null;

  function isKiosk() {
    try { return localStorage.getItem(K) === "1"; } catch (e) { return false; }
  }

  function setKiosk(on) {
    try { localStorage.setItem(K, on ? "1" : "0"); } catch (e) { /* ignore */ }
    apply();
  }

  function apply() {
    document.body.setAttribute("data-kiosk", isKiosk() ? "on" : "off");
  }

  function toggleKiosk() { setKiosk(!isKiosk()); }

  /* ---- hidden staff panel: hold the logo for 3 seconds ---- */
  function holdStart(e) {
    clearTimeout(holdTimer);
    holdTimer = setTimeout(function () {
      $("adminOverlay").hidden = false;
      document.body.classList.add("modal-open");
      $("adminReset").focus();
    }, C.kiosk.adminHoldSeconds * 1000);
  }
  function holdEnd() {
    clearTimeout(holdTimer);
  }

  function closeAdmin() {
    $("adminOverlay").hidden = true;
    if ($("detailOverlay").hidden && $("shareOverlay").hidden) {
      document.body.classList.remove("modal-open");
    }
  }

  function init() {
    // URL param wins once, then persists: ?kiosk=1 / ?kiosk=0

    const p = /[?&]kiosk=([01])/.exec(location.search);
    if (p) setKiosk(p[1] === "1");
    apply();

    const logo = $("brandmark");
    logo.addEventListener("pointerdown", holdStart);
    logo.addEventListener("pointerup", holdEnd);
    logo.addEventListener("pointerleave", holdEnd);
    logo.addEventListener("pointercancel", holdEnd);
    // long-press on touch devices
    logo.addEventListener("touchstart", holdStart, { passive: true });
    logo.addEventListener("touchend", holdEnd);

    $("adminCancel").addEventListener("click", closeAdmin);
    $("adminReset").addEventListener("click", function () {
      VSP.store.clearFavs();
      VSP.store.clearQuiz();
      closeAdmin();
      VSP.toast(VSP.i18n.t("admin.done"));
    });
    document.addEventListener("keydown", function (e) {
      if (!$("adminOverlay").hidden && e.key === "Escape") closeAdmin();
    });

    // kiosk hygiene: no context menu, no accidental navigation
    document.addEventListener("contextmenu", function (e) {
      if (isKiosk()) e.preventDefault();
    });
    // pull-to-refresh / overscroll already blocked in CSS + meta;
    // also swallow gesture zoom in kiosk.
    document.addEventListener("gesturestart", function (e) {
      if (isKiosk()) e.preventDefault();
    });
  }


  VSP.kiosk = { init: init, isKiosk: isKiosk, toggle: toggleKiosk };
})(window.VSP);