/* cards — the collection browser: grid of vial cards, full-screen detail
   overlay with poem/spell flip, formula bar, incantation, heart, share. */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  const D = window.VSP_DATA, C = window.VSP_CONFIG;
  const t = VSP.i18n.t, fmt = VSP.i18n.fmt;

  let currentList = D.vials.slice();   // vials shown in grid (set by filters)
  let openIndex = -1;                  // index within currentList of open card
  let lastFocus = null;

  const $ = function (id) { return document.getElementById(id); };

  function photoURL(v) { return C.assets.vialPhoto.replace("{ID}", v.id); }

  /* ---------------- GRID ---------------- */

  function renderGrid(list) {
    if (list) currentList = list;
    const grid = $("vialGrid");
    if (!grid) return;
    grid.innerHTML = "";

    currentList.forEach(function (v, i) {
      const card = document.createElement("div");
      card.className = "vialcard";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", v.name_en + " · " + v.name_zh);
      card.style.setProperty("--aura", VSP.icons.auraColor(v.intensity));

      const fav = VSP.store.isFav(v.id);

      card.innerHTML =
        '<div class="corner tl" aria-hidden="true"><svg><use href="#corner-a"/></svg></div>' +
        '<div class="corner br" aria-hidden="true"><svg><use href="#corner-a"/></svg></div>' +
        '<button class="heartbtn" type="button" aria-pressed="' + fav + '" aria-label="' + (fav ? t("cards.favRemove") : t("cards.favAdd")) + '">' + HEART_SVG + "</button>" +
        '<p class="tarot-roman" aria-hidden="true">' + roman(D.vials.indexOf(v) + 1) + "</p>" +
        '<p class="vial-no">' + v.id + "</p>" +
        '<img class="vial-photo" src="' + photoURL(v) + '" alt="' + fmt(t("a11y.vialPhoto"), { name: (VSP.i18n.current() === "zh" ? v.name_zh : v.name_en) }) + '" loading="lazy" decoding="async" draggable="false">' +
        '<div class="tarot-ribbon">' +
          '<h3 class="vial-name">' + v.name_en + "</h3>" +
          '<p class="vial-name-zh">' + v.name_zh + "</p>" +
          '<div class="vial-fams" aria-hidden="true">' + v.notes.slice(0, 5).map(function (n) {
            return '<span style="color:' + VSP.icons.color(n.family) + '">' + VSP.icons.svg(n.family, "fam-ic") + "</span>";
          }).join("") + "</div>" +
        "</div>";

      card.addEventListener("click", function (e) {
        if (e.target.closest(".heartbtn")) return;
        open(i);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
      });
      const hb = card.querySelector(".heartbtn");
      hb.addEventListener("click", function (e) {
        e.stopPropagation();
        heartToggle(v.id, hb);
      });

      grid.appendChild(card);
    });
  }

  /* tarot numeral: I … XXV (order within the full collection) */
  function roman(n) {
    const table = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    let out = "";
    for (const [val, sym] of table) {
      while (n >= val) { out += sym; n -= val; }
    }
    return out;
  }

  function heartToggle(id, btn) {    const nowFav = VSP.store.toggleFav(id);
    if (btn) {
      btn.setAttribute("aria-pressed", nowFav ? "true" : "false");
      const label = nowFav ? t("cards.favRemove") : t("cards.favAdd");
      btn.setAttribute("aria-label", label);
      if (nowFav) popHeart(btn);
    }
    const hb = $("heartBtn");
    if (hb && openIndex >= 0 && currentList[openIndex] && currentList[openIndex].id === id) {
      hb.setAttribute("aria-pressed", nowFav ? "true" : "false");
      hb.setAttribute("aria-label", nowFav ? t("cards.favRemove") : t("cards.favAdd"));
      if (nowFav) popHeart(hb);
    }
  }

  function popHeart(btn) {
    btn.classList.remove("pop");
    void btn.offsetWidth;
    btn.classList.add("pop");
    btn.addEventListener("animationend", function onEnd() {
      btn.classList.remove("pop");
      btn.removeEventListener("animationend", onEnd);
    });
  }

  const HEART_SVG =
    '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5C7 16.6 3.6 13.4 3.6 9.9 3.6 7.2 5.7 5 8.3 5c1.5 0 2.9.8 3.7 2.1C12.8 5.8 14.2 5 15.7 5c2.6 0 4.7 2.2 4.7 4.9 0 3.5-3.4 6.7-8.4 10.6z"/></svg>';

  /* ---------------- DETAIL OVERLAY ---------------- */

  function open(indexInList) {
    openIndex = indexInList;
    lastFocus = document.activeElement;
    fill(currentList[openIndex]);
    const ov = $("detailOverlay");
    ov.hidden = false;
    const card = $("bigCard");
    card.classList.remove("opening");
    void card.offsetWidth;
    card.classList.add("opening");
    card.addEventListener("animationend", function onEnd() {
      card.classList.remove("opening");
      card.removeEventListener("animationend", onEnd);
    });
    document.body.classList.add("modal-open");
    $("detailClose").focus();
    VSP.attract.notifyActivity();
  }

  function close() {
    const ov = $("detailOverlay");
    if (!ov || ov.hidden) return;
    ov.hidden = true;
    unflip();
    document.body.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
    openIndex = -1;
  }

  function currentVial() { return openIndex >= 0 ? currentList[openIndex] : null; }

  function step(delta) {
    if (openIndex < 0) return;
    const n = currentList.length;
    openIndex = (openIndex + delta + n) % n;
    fill(currentList[openIndex]);
    VSP.attract.notifyActivity();
  }

  function intensityLabel(key) {
    const lang = VSP.i18n.current();
    for (const i of D.intensities) if (i.key === key) return lang === "zh" ? i.zh : i.en;
    return key;
  }

  function fill(v) {
    if (!v) return;
    const lang = VSP.i18n.current();

    // the vial's aura tints the whole card
    const aura = VSP.icons.auraColor(v.intensity);
    $("bigCard").style.setProperty("--aura", aura);
    $("cardFront").style.setProperty("--aura", aura);
    $("cardBack").style.setProperty("--aura", aura);

    $("cfNo").textContent = t("cards.vialNo") + " " + v.id;
    $("cfNameEn").textContent = v.name_en;
    $("cfNameZh").textContent = v.name_zh;
    $("cfNameZh").hidden = lang !== "zh" && v.name_zh === v.name_en;
    const ph = $("cfPhoto");
    ph.src = photoURL(v);
    ph.alt = fmt(t("a11y.vialPhoto"), { name: lang === "zh" ? v.name_zh : v.name_en });
    $("cfPoem").textContent = lang === "zh" ? v.poem_zh : v.poem_en;

    $("cbNo").textContent = t("cards.vialNo") + " " + v.id;
    $("cbSpell").textContent = lang === "zh" ? v.spell_zh : v.spell_en;
    $("cbIntensity").textContent = intensityLabel(v.intensity);
    $("cbHz").textContent = v.hz + " Hz";

    // formula bar: segments sized by note weight (order = prominence),
    // assembled with a small stagger so the blend "pours" together
    const fb = $("cbFormula");
    fb.innerHTML = "";
    const legend = document.createElement("div");
    legend.className = "formula-legend";
    const segs = [];
    v.notes.forEach(function (n, i) {
      const fam = VSP.icons.family(n.family);
      const seg = document.createElement("span");
      seg.className = "seg";
      seg.style.width = "0%";
      seg.style.background = VSP.icons.color(n.family);
      seg.style.transitionDelay = (0.15 + i * 0.07) + "s";
      seg.title = fam.en + " " + fam.zh + " " + n.weight + "%";
      fb.appendChild(seg);
      segs.push({ el: seg, w: n.weight + "%" });
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        segs.forEach(function (s) { s.el.style.width = s.w; });
      });
    });

    const hb = $("heartBtn");
    const fav = VSP.store.isFav(v.id);
    hb.setAttribute("aria-pressed", fav ? "true" : "false");
    hb.setAttribute("aria-label", fav ? t("cards.favRemove") : t("cards.favAdd"));

    $("foldNote").hidden = true;
    updateHearButton(false);
  }

  function updateHearButton(busy) {
    const b = $("hearBtn");
    if (!b) return;
    const span = b.querySelector("span") || b;
    span.textContent = busy ? t("cards.hearingHz") : t("cards.hearHz");
    b.disabled = !!busy;
    const rings = $("resonance");
    if (rings) rings.classList.toggle("on", !!busy);
  }

  /* ---- flip ---- */
  function flip() {
    const card = $("bigCard");
    const back = $("cardBack");
    const front = $("cardFront");
    const flipped = !card.classList.contains("flipped");
    card.classList.toggle("flipped", flipped);
    // keep a11y in sync: hide the face that is turned away
    front.setAttribute("aria-hidden", flipped ? "true" : "false");
    back.hidden = false;
    back.setAttribute("aria-hidden", flipped ? "false" : "true");
    const btn = $("flipBtn");
    btn.querySelector("span").textContent = flipped ? t("cards.unflip") : t("cards.flip");
    VSP.attract.notifyActivity();
  }
  function unflip() {
    const card = $("bigCard");
    card.classList.remove("flipped");
    const back = $("cardBack");
    const front = $("cardFront");
    back.setAttribute("aria-hidden", "true");
    front.setAttribute("aria-hidden", "false");
    $("flipBtn").querySelector("span").textContent = t("cards.flip");
  }

  /* ---------------- init / events ---------------- */

  function init() {
    $("detailClose").addEventListener("click", close);
    $("flipBtn").addEventListener("click", flip);
    $("detailPrev").addEventListener("click", function () { step(-1); });
    $("detailNext").addEventListener("click", function () { step(1); });
    $("heartBtn").addEventListener("click", function () {
      const v = currentVial();
      if (v) heartToggle(v.id, $("heartBtn"));
    });

    // swipe to flip (touch)
    let sx = 0, sy = 0;
    const stage = $("cardStage");
    stage.addEventListener("touchstart", function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 1.5) flip();
    }, { passive: true });

    // hear its scent-driven incantation (never autoplay: requires this tap)
    $("hearBtn").addEventListener("click", function () {
      const v = currentVial();
      if (!v || VSP.audio.isPlaying()) return;
      VSP.audio.playTone(v);
    });
    document.addEventListener("vsp:tone", function (e) {
      updateHearButton(e.detail.state === "start");
    });

    $("shareFromCard").addEventListener("click", function () {
      const v = currentVial();
      if (v) VSP.share.open(v.id);
    });

    // keyboard
    document.addEventListener("keydown", function (e) {
      if ($("detailOverlay").hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });

    document.addEventListener("vsp:lang", function () { renderGrid(); });
    document.addEventListener("vsp:favs", function () {
      // refresh heart states on visible cards without rebuilding layout
      document.querySelectorAll(".vialcard").forEach(function (card) {
        const hb = card.querySelector(".heartbtn");
        const img = card.querySelector(".vial-photo");
        if (!hb || !img) return;
        const id = (img.src || "").split("/").pop().replace(/\.\w+$/, "");
        const fav = VSP.store.isFav(id);
        hb.setAttribute("aria-pressed", fav ? "true" : "false");
      });
    });
  }

  VSP.cards = {
    init: init,
    renderGrid: renderGrid,
    openById: function (id) {
      const i = currentList.findIndex ? currentList.findIndex(function (v) { return v.id === id; }) : indexOfId(currentList, id);
      if (i >= 0) open(i);
      else {
        currentList = D.vials.slice();
        renderGrid();
        open(indexOfId(currentList, id));
      }
    },
    close: close,
  };

  function indexOfId(list, id) {
    for (let i = 0; i < list.length; i++) if (list[i].id === id) return i;
    return -1;
  }
})(window.VSP);