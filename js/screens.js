/* screens — navigation between the five screens: home, quiz, collection
   (with the two filter rows), seasons set and my picks. */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  const D = window.VSP_DATA, C = window.VSP_CONFIG;
  const t = VSP.i18n.t, fmt = VSP.i18n.fmt;

  const SCREENS = ["home", "quiz", "collection", "seasons", "picks"];
  let active = "home";

  /* filter state */
  let famSel = [];            // array of family keys
  let intensitySel = null;    // intensity key or null (= all)

  const $ = function (id) { return document.getElementById(id); };

  function show(name) {
    if (SCREENS.indexOf(name) < 0) name = "home";
    active = name;
    SCREENS.forEach(function (s) {
      $("screen-" + s).hidden = s !== name;
    });
    document.querySelectorAll(".navbtn").forEach(function (b) {
      const target = b.getAttribute("data-nav");
      if (SCREENS.indexOf(target) >= 0) {
        if (target === name) b.setAttribute("aria-current", "page");
        else b.removeAttribute("aria-current");
      }
    });
    const main = $("main");
    if (main) main.scrollTop = 0;
    const el = $("screen-" + name);
    if (el) {
      el.classList.remove("enter");
      void el.offsetWidth;               // restart the rise-in animation
      el.classList.add("enter");
    }
    if (name === "quiz") VSP.quiz.enter();
    if (name === "picks") renderPicks();
    VSP.attract.notifyActivity();
  }

  /* ---------------- HOME ---------------- */

  /* constellation arc: 5 vials in octagonal frames, faint gold lines */
  const CONST_POS = [
    { x: 12, y: 80 }, { x: 31, y: 56 }, { x: 50, y: 44 }, { x: 69, y: 56 }, { x: 88, y: 80 },
  ];

  function renderHome() {
    const shelf = $("heroShelf");
    shelf.innerHTML = "";
    shelf.classList.add("constellation");

    const featured = ["LPG042", "LPG060", "LPG003", "LPG069", "LPG078"]
      .map(function (id) { return D.byId(id); })
      .filter(Boolean);

    // faint constellation lines between the nodes
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "const-lines");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    let path = "";
    for (let i = 0; i < CONST_POS.length - 1; i++) {
      path += "M" + CONST_POS[i].x + " " + CONST_POS[i].y +
              " Q" + (CONST_POS[i].x + CONST_POS[i + 1].x) / 2 + " " +
              (Math.min(CONST_POS[i].y, CONST_POS[i + 1].y) - 8) + " " +
              CONST_POS[i + 1].x + " " + CONST_POS[i + 1].y + " ";
    }
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", path);
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "currentColor");
    p.setAttribute("stroke-width", "0.35");
    p.setAttribute("stroke-dasharray", "1.4 1.6");
    svg.appendChild(p);
    shelf.appendChild(svg);

    featured.forEach(function (v, i) {
      const node = document.createElement("div");
      node.className = "const-node";
      node.style.left = CONST_POS[i].x + "%";
      node.style.top = CONST_POS[i].y + "%";
      node.style.setProperty("--aura", VSP.icons.auraColor(v.intensity));
      const octo = document.createElement("div");
      octo.className = "octo";
      const im = document.createElement("img");
      im.src = C.assets.vialPhoto.replace("{ID}", v.id);
      im.alt = "";
      im.loading = "lazy";
      octo.appendChild(im);
      node.appendChild(octo);
      shelf.appendChild(node);
    });

    inkTitle();
    updateHeartsLine();
  }

  /* the title is inked in gold, letter by letter (~1.5 s, once) */
  function inkTitle() {
    const h1 = $("heroTitle");
    if (!h1) return;
    const span = h1.querySelector("span");
    if (!span) return;
    const text = span.textContent || "";
    span.textContent = "";
    const letters = [];
    for (const ch of text) {
      const el = document.createElement("span");
      el.className = "letter";
      el.textContent = ch;
      span.appendChild(el);
      letters.push(el);
    }
    const per = Math.min(120, 1500 / Math.max(1, letters.length));
    letters.forEach(function (el, i) {
      setTimeout(function () { el.classList.add("inked"); }, 200 + i * per);
    });
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function updateHeartsLine() {
    const n = VSP.store.favs().length;
    const el = $("heroHearts");
    if (n) el.textContent = fmt(t("home.hearts"), { n: n });
    else el.textContent = "";
    const pc = $("pickCount");
    pc.textContent = n;
    pc.hidden = n === 0;
  }

  /* ---------------- FILTERS + GRID ---------------- */

  function renderFilters() {
    const famRow = $("famChips");
    // remove old chips
    famRow.querySelectorAll(".chip").forEach(function (c) { c.remove(); });
    D.families.forEach(function (f) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.setAttribute("aria-pressed", famSel.indexOf(f.key) >= 0 ? "true" : "false");
      chip.setAttribute("aria-label", fmt(t("a11y.filterChip"), { f: VSP.i18n.current() === "zh" ? f.zh : f.en }));
      chip.innerHTML =
        '<span style="color:' + VSP.icons.color(f.key) + '">' + VSP.icons.svg(f.key) + "</span>" +
        "<span>" + (VSP.i18n.current() === "zh" ? f.zh : f.en) + "</span>";
      chip.addEventListener("click", function () {
        const i = famSel.indexOf(f.key);
        if (i >= 0) famSel.splice(i, 1); else famSel.push(f.key);
        chip.setAttribute("aria-pressed", famSel.indexOf(f.key) >= 0 ? "true" : "false");
        applyFilters();
      });
      famRow.appendChild(chip);
    });

    const intRow = $("intTabs");
    intRow.querySelectorAll(".tab").forEach(function (c) { c.remove(); });
    const allTab = document.createElement("button");
    allTab.type = "button";
    allTab.className = "tab";
    allTab.setAttribute("role", "tab");
    allTab.setAttribute("aria-selected", intensitySel == null ? "true" : "false");
    allTab.textContent = t("filters.all");
    allTab.addEventListener("click", function () { intensitySel = null; applyFilters(); renderFilters(); });
    intRow.appendChild(allTab);

    D.intensities.forEach(function (i) {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "tab";
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", intensitySel === i.key ? "true" : "false");
      const label = VSP.i18n.current() === "zh" ? i.zh : i.en;
      tab.textContent = label;
      tab.addEventListener("click", function () {
        intensitySel = i.key;
        applyFilters();
        renderFilters();
      });
      intRow.appendChild(tab);
    });
  }

  function applyFilters() {
    let list = D.vials.slice();
    if (intensitySel) list = list.filter(function (v) { return v.intensity === intensitySel; });
    if (famSel.length) {
      list = list.filter(function (v) {
        return v.notes.some(function (n) { return famSel.indexOf(n.family) >= 0; });
      });
    }
    VSP.cards.renderGrid(list);
    const cnt = $("filterCount");
    cnt.textContent = list.length ? fmt(t("filters.shown"), { n: list.length }) : t("filters.none");
    $("filterClear").hidden = famSel.length === 0 && intensitySel == null;
  }

  function clearFilters() {
    famSel = [];
    intensitySel = null;
    renderFilters();
    applyFilters();
  }

  /* ---------------- SEASONS: wheel of the year ---------------- */

  const SEASON_COLORS = { spring: "var(--season-spring)", summer: "var(--season-summer)", autumn: "var(--season-autumn)", winter: "var(--season-winter)" };

  function renderSeasons() {
    const root = $("seasonsRoot");
    root.innerHTML = "";

    const head = document.createElement("div");
    head.className = "seasons-head";
    head.innerHTML =
      '<h2 class="seasons-title">' + t("seasons.title") + "</h2>" +
      '<p class="seasons-sub">' + t("seasons.subtitle") + "</p>";
    root.appendChild(head);

    const wheel = document.createElement("div");
    wheel.className = "wheel";

    const center = document.createElement("div");
    center.className = "wheel-center";
    center.setAttribute("aria-hidden", "true");
    center.innerHTML = '<svg><use href="#sigil-circle"/></svg>';
    wheel.appendChild(center);

    C.seasons.forEach(function (s, i) {
      const v = D.byId(s.id);
      if (!v) return;
      const meta = D.seasons.filter(function (x) { return x.key === s.key; })[0] || {};
      const lang = VSP.i18n.current();
      const card = document.createElement("article");
      card.className = "wheel-card pos-" + i;
      card.style.setProperty("--season", SEASON_COLORS[s.key] || "var(--gold-bright)");
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", v.name_en + " · " + v.name_zh);
      card.innerHTML =
        '<img src="' + C.assets.vialPhoto.replace("{ID}", v.id) + '" alt="' + fmt(t("a11y.vialPhoto"), { name: lang === "zh" ? v.name_zh : v.name_en }) + '">' +
        '<h3 class="season-name">' + (lang === "zh" ? meta.zh + " · " + meta.tag_zh : meta.en + " · " + meta.tag_en) + "</h3>" +
        '<p class="season-name-zh">' + (lang === "zh" ? v.name_zh : v.name_en) + " · " + v.id + "</p>" +
        '<p class="season-blurb">' + (lang === "zh" ? meta.blurb_zh : meta.blurb_en) + "</p>";
      card.addEventListener("click", function () { VSP.cards.openById(v.id); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); VSP.cards.openById(v.id); }
      });
      wheel.appendChild(card);
    });
    root.appendChild(wheel);

    const order = document.createElement("p");
    order.className = "seasons-order";
    const ids = C.seasons.map(function (s) { return s.id; }).join(" · ");
    order.textContent = fmt(t("seasons.order"), { ids: ids });
    root.appendChild(order);
  }

  /* ---------------- PICKS ---------------- */

  function renderPicks() {
    const root = $("picksRoot");
    root.innerHTML = "";
    const ids = VSP.store.favs();
    const lang = VSP.i18n.current();

    const head = document.createElement("div");
    head.className = "picks-head";
    head.innerHTML =
      '<h2 class="picks-title">' + t("picks.title") + "</h2>" +
      '<p class="picks-sub">' + t("picks.subtitle") + "</p>";
    root.appendChild(head);

    if (!ids.length) {
      const empty = document.createElement("p");
      empty.className = "picks-empty";
      empty.textContent = t("picks.empty");
      root.appendChild(empty);
    } else {
      const list = document.createElement("div");
      list.className = "picklist";
      let shelfRow = null;
      ids.forEach(function (id, i) {
        const v = D.byId(id);
        if (!v) return;
        if (i % 2 === 0) {
          shelfRow = document.createElement("div");
          shelfRow.className = "shelf-row";
          list.appendChild(shelfRow);
        }
        const row = document.createElement("div");
        row.className = "pick-row";
        row.innerHTML =
          '<img src="' + C.assets.vialPhoto.replace("{ID}", v.id) + '" alt="' + fmt(t("a11y.vialPhoto"), { name: lang === "zh" ? v.name_zh : v.name_en }) + '">' +
          '<div><p class="pick-name">' + v.name_en + "</p>" +
          '<p class="pick-name-zh">' + v.name_zh + "</p>" +
          '<p class="pick-no">' + t("cards.vialNo") + " " + v.id + " · " + v.hz + " Hz</p></div>";
        const actions = document.createElement("div");
        actions.className = "pick-actions";
        const openB = document.createElement("button");
        openB.className = "btn btn-mini btn-outline";
        openB.type = "button";
        openB.textContent = t("picks.open");
        openB.addEventListener("click", function () { VSP.cards.openById(v.id); });
        const rm = document.createElement("button");
        rm.className = "btn btn-mini";
        rm.type = "button";
        rm.textContent = t("picks.remove");
        rm.addEventListener("click", function () {
          // the vial leaves in a puff of smoke, then the seal is broken
          row.classList.add("puffing");
          setTimeout(function () { VSP.store.toggleFav(id); }, 640);
        });
        actions.appendChild(openB); actions.appendChild(rm);
        row.appendChild(actions);
        shelfRow.appendChild(row);
      });
      root.appendChild(list);

      // the scroll of numbers — show this at the counter
      const scroll = document.createElement("div");
      scroll.className = "picks-scroll";
      scroll.innerHTML =
        '<span class="scroll-label">' + t("picks.scroll") + "</span>" +
        ids.join(" · ");
      root.appendChild(scroll);
    }

    const foot = document.createElement("div");
    foot.className = "picks-foot";
    const note = document.createElement("p");
    note.className = "picks-note";
    note.textContent = t("picks.note");
    foot.appendChild(note);
    if (ids.length) {
      const clear = document.createElement("button");
      clear.className = "btn btn-mini btn-outline";
      clear.type = "button";
      clear.textContent = t("picks.clear");
      clear.addEventListener("click", function () { VSP.store.clearFavs(); });
      foot.appendChild(clear);
    }
    root.appendChild(foot);
  }

  /* ---------------- init ---------------- */

  function init() {
    document.querySelectorAll("[data-nav]").forEach(function (b) {
      b.addEventListener("click", function () { show(b.getAttribute("data-nav")); });
    });
    $("filterClear").addEventListener("click", clearFilters);

    document.addEventListener("vsp:lang", function () {
      renderHome();
      renderFilters();
      applyFilters();
      renderSeasons();
      if (active === "picks") renderPicks();
    });
    document.addEventListener("vsp:favs", function () {
      updateHeartsLine();
      if (active === "picks") renderPicks();
    });

    renderHome();
    renderFilters();
    applyFilters();
    renderSeasons();
    updateHeartsLine();
  }

  VSP.screens = { init: init, show: show };
})(window.VSP);