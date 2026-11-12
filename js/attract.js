/* attract — after 45 s of no touch, loop through the vials with large
   visuals and a "Touch to begin / 点击开始" prompt. Any touch exits. */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  const D = window.VSP_DATA, C = window.VSP_CONFIG;
  const t = VSP.i18n.t;

  let idleTimer = null;
  let slideTimer = null;
  let running = false;
  let idx = 0;
  let order = [];

  const $ = function (id) { return document.getElementById(id); };

  /* any interaction resets the idle countdown and exits attract mode */
  function notifyActivity() {
    if (running) stop();
    schedule();
  }

  function schedule() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(start, C.kiosk.attractIdleSeconds * 1000);
  }

  function start() {
    if (running) return;
    running = true;
    idx = 0;
    order = D.vials.slice();
    // sort so the featured season vials lead the loop
    order.sort(function (a, b) { return (b.season ? 1 : 0) - (a.season ? 1 : 0); });

    // close any open overlay so the next visitor sees the loop cleanly
    try { VSP.cards.close(); VSP.share.close(); } catch (e) { /* not ready yet */ }

    const ov = $("attractOverlay");
    ov.hidden = false;
    slide();
    slideTimer = setInterval(slide, C.kiosk.attractSlideSeconds * 1000);
  }

  function slide() {
    const v = order[idx % order.length];
    idx++;
    const lang = VSP.i18n.current();
    const photo = $("attractPhoto");
    const textEl = document.querySelector(".attract-text");

    photo.classList.remove("show");
    if (textEl) textEl.classList.remove("show");

    setTimeout(function () {
      photo.src = C.assets.vialPhoto.replace("{ID}", v.id);
      photo.alt = "";
      photo.style.setProperty("--aura", VSP.icons ? VSP.icons.auraColor(v.intensity) : "#C9A227");
      $("attractNo").textContent = t("cards.vialNo") + " " + v.id;
      $("attractNameEn").textContent = v.name_en;
      $("attractNameZh").textContent = v.name_zh;
      const poem = (lang === "zh" ? v.poem_zh : v.poem_en).split("\n");
      $("attractPoem").textContent = poem.slice(0, 6).join("\n");
      photo.classList.add("show");
      if (textEl) textEl.classList.add("show");
    }, 420);
  }

  function stop() {
    if (!running) return;
    running = false;
    clearTimeout(slideTimer);
    clearTimeout(idleTimer);
    const ov = $("attractOverlay");
    if (ov) ov.hidden = true;
    schedule();
  }

  const ACTIVITY = ["pointerdown", "touchstart", "keydown", "wheel", "mousedown"];

  function init() {
    $("attractQr").src = C.assets.qr;
    $("attractQr").alt = t("a11y.qr");
    ACTIVITY.forEach(function (ev) {
      document.addEventListener(ev, notifyActivity, { passive: true });
    });
    schedule();
  }

  VSP.attract = { init: init, notifyActivity: notifyActivity, stop: stop };
})(window.VSP);