/* share — "My spell" result card: canvas image (1080×1350) with the vial
   name, spell and brand QR. Download / save for WeChat, Xiaohongshu,
   Instagram. Native share when the device offers it. */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  const D = window.VSP_DATA, C = window.VSP_CONFIG;
  const t = VSP.i18n.t, fmt = VSP.i18n.fmt;

  const W = 1080, H = 1350;
  const INK = "#3A0D2D", GOLD = "#A87D1F", BG = "#E9D9E8", PAPER = "#F7EEF4";

  function $(id) { return document.getElementById(id); }

  function loadImg(src) {
    return new Promise(function (resolve) {
      if (!src) { resolve(null); return; }
      const im = new Image();
      im.onload = function () { resolve(im); };
      im.onerror = function () { resolve(null); };
      im.src = src;
    });
  }

  function wrap(ctx, text, maxW) {
    const lines = [];
    String(text).split("\n").forEach(function (para) {
      const words = para.split(" ");
      let line = "";
      words.forEach(function (w) {
        const test = line ? line + " " + w : w;
        if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
        else line = test;
      });
      lines.push(line);
    });
    return lines;
  }

  function curls(ctx, x, y, flipX, flipY) {
    // small Victorian corner flourish
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.strokeStyle = GOLD; ctx.lineWidth = 5; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(14, 120); ctx.bezierCurveTo(14, 62, 40, 36, 96, 34);
    ctx.moveTo(32, 120); ctx.bezierCurveTo(32, 76, 52, 52, 96, 50);
    ctx.moveTo(14, 120); ctx.bezierCurveTo(52, 118, 70, 106, 70, 84);
    ctx.stroke();
    ctx.fillStyle = GOLD;
    ctx.beginPath(); ctx.arc(70, 84, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(96, 34, 7, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function frame(ctx) {
    // aged parchment with a soft vignette + speckle grain
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = PAPER; ctx.fillRect(70, 70, W - 140, H - 140);
    // grain speckles (drawn once, cheap)
    ctx.fillStyle = "rgba(58,13,45,.05)";
    for (let i = 0; i < 900; i++) {
      ctx.fillRect(70 + Math.random() * (W - 140), 70 + Math.random() * (H - 140), 1.6, 1.6);
    }
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(58,13,45,.14)");
    ctx.fillStyle = vig; ctx.fillRect(70, 70, W - 140, H - 140);
    // double gold rule
    ctx.strokeStyle = INK; ctx.lineWidth = 6;
    ctx.strokeRect(70, 70, W - 140, H - 140);
    ctx.strokeStyle = GOLD; ctx.lineWidth = 3;
    ctx.strokeRect(92, 92, W - 184, H - 184);
    ctx.strokeRect(102, 102, W - 204, H - 204);
    curls(ctx, 84, 84, false, false);
    curls(ctx, W - 84, 84, true, false);
    curls(ctx, 84, H - 84, false, true);
    curls(ctx, W - 84, H - 84, true, true);
  }

  function moonArc(ctx, cx, y, halfSpan, color) {
    ctx.fillStyle = color;
    for (let i = 0; i < 9; i++) {
      const x = cx - halfSpan + (i / 8) * halfSpan * 2;
      ctx.globalAlpha = 0.25 + 0.75 * (1 - Math.abs(i - 4) / 4);
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function octoPath(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x + s * 0.3, y); ctx.lineTo(x + s * 0.7, y);
    ctx.lineTo(x + s, y + s * 0.3); ctx.lineTo(x + s, y + s * 0.7);
    ctx.lineTo(x + s * 0.7, y + s); ctx.lineTo(x + s * 0.3, y + s);
    ctx.lineTo(x, y + s * 0.7); ctx.lineTo(x, y + s * 0.3);
    ctx.closePath();
  }

  function sealRect(ctx, x, y, s) {
    // a wax-seal frame around each QR
    ctx.save();
    ctx.fillStyle = "#8E1F3F";
    ctx.beginPath();
    ctx.arc(x + s / 2, y + s / 2, s * 0.78, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#6E1830"; ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x - 2, y - 2, s + 4, s + 4);
    ctx.restore();
  }

  function centerText(ctx, text, y, font, color) {
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = "center";
    ctx.fillText(text, W / 2, y);
  }

  function draw(ctx, v, photo, qr, lang) {
    const aura = VSP.icons ? VSP.icons.auraColor(v.intensity) : "#C9A227";
    frame(ctx);

    // header: studio, moon arc, talisman label
    centerText(ctx, C.brand.studio_en, 148, '30px "VSP Script", cursive', GOLD);
    moonArc(ctx, W / 2, 186, 170, GOLD);
    centerText(ctx, t("share.mySpell"), 248, '600 30px "VSP Hei", "VSP Serif", serif', INK);

    // names in both tongues
    centerText(ctx, v.name_en, 330, '64px "VSP Display", "VSP Script", cursive', INK);
    centerText(ctx, v.name_zh, 398, '48px "VSP Song", "VSP Kai", serif', INK);

    // octagonal vial photo inside its aura halo
    const size = 400, x = (W - size) / 2, y = 440;
    if (photo) {
      const halo = ctx.createRadialGradient(W / 2, y + size / 2, 40, W / 2, y + size / 2, size * 0.85);
      halo.addColorStop(0, aura + "66");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(x - 190, y - 190, size + 380, size + 380);
      ctx.save();
      octoPath(ctx, x, y, size);
      ctx.clip();
      ctx.drawImage(photo, x, y, size, size);
      ctx.restore();
      ctx.strokeStyle = INK; ctx.lineWidth = 5;
      octoPath(ctx, x, y, size);
      ctx.stroke();
    }

    // the spell, in calligraphy
    const spell = lang === "zh" ? v.spell_zh : v.spell_en;
    ctx.font = (lang === "zh" ? '40px "VSP Brush", "VSP Kai", serif' : '44px "VSP Script", cursive');
    ctx.fillStyle = INK; ctx.textAlign = "center";
    const lines = wrap(ctx, spell, 820);
    let sy = 930;
    lines.slice(0, 3).forEach(function (ln) { ctx.fillText(ln, W / 2, sy); sy += 62; });

    centerText(ctx, C.brand.incantation_en + " " + C.brand.incantation_zh, sy + 34, '46px "VSP Brush", "VSP Script", cursive', GOLD);

    if (qr) {
      const s = 140, qx = W - 280, qy = H - 340;
      sealRect(ctx, qx, qy, s);
      ctx.drawImage(qr, qx, qy, s, s);
    }

    centerText(ctx, C.brand.collection_en + " · " + C.brand.collection_zh, H - 145, '26px "VSP Hei", serif', INK);
    centerText(ctx, v.id + " · " + v.hz + " Hz", H - 110, '22px "VSP Serif", serif', GOLD);
  }

  /* ---------------- overlay ---------------- */

  let currentId = null;

  function open(id) {
    currentId = id;
    const v = D.byId(id);
    if (!v) return;
    const ov = $("shareOverlay");
    ov.hidden = false;
    document.body.classList.add("modal-open");
    VSP.attract.notifyActivity();

    const lang = VSP.i18n.current();
    const cv = $("shareCanvas");
    const ctx = cv.getContext("2d");

    $("qrWechat").src = C.assets.qr;
    $("qrWechat").alt = t("a11y.qr");
    $("shareHint").textContent = "";

    Promise.all([loadImg(C.assets.vialPhoto.replace("{ID}", v.id)), loadImg(C.assets.qr)])
      .then(function (imgs) {
        const photo = imgs[0], qr = imgs[1];
        const render = function () { draw(ctx, v, photo, qr, lang); };
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(render);
        } else {
          render();
        }
      });
  }

  function close() {
    const ov = $("shareOverlay");
    if (ov.hidden) return;
    ov.hidden = true;
    if ($("detailOverlay").hidden) document.body.classList.remove("modal-open");
  }

  function save() {
    const v = D.byId(currentId);
    if (!v) return;
    const cv = $("shareCanvas");
    try {
      const url = cv.toDataURL("image/jpeg", 0.92);
      const a = document.createElement("a");
      a.href = url;
      a.download = "VSP-MySpell-" + v.id + ".jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      $("shareHint").textContent = t("share.savedHint");
      VSP.toast(t("share.savedHint"));
    } catch (err) {
      // file:// canvas taint or blocked download — explain the fix
      $("shareHint").textContent =
        "Canvas export is blocked on file:// — serve the app over http (see README) and try again. " +
        "画布导出在 file:// 下受限——请通过 http 访问（见 README）后重试。";
    }
  }

  function init() {
    $("shareClose").addEventListener("click", close);
    $("shareSave").addEventListener("click", save);
    document.addEventListener("keydown", function (e) {
      if (!$("shareOverlay").hidden && e.key === "Escape") close();
    });
  }

  VSP.share = { open: open, close: close, init: init };
})(window.VSP);