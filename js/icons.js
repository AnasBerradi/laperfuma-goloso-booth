/* icons — hand-drawn-style SVG sigils for the 8 note families,
   plus the 5 intensity auras. Single-line gold style: strokes use
   currentColor; family colours come from COLORS, aura colours from
   theme.js. Family colours are injected as --fam-* CSS properties. */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  const D = window.VSP_DATA;

  /* family key → colour (used by formula tube + chips) */
  const COLORS = {
    wood:    "#F5D5AC",
    fruit:   "#CCF46A",
    greens:  "#A3CB4E",
    spices:  "#E1B216",
    citrus:  "#DCAD5F",
    floral:  "#F826A2",
    musk:    "#EEB2CD",
    resins:  "#C2D7B8",
  };

  /* family key → single-line sigil (stroke follows currentColor) */
  const GLYPHS = {
    wood:    '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="5.4" opacity=".7"/><circle cx="12" cy="12" r="2.6" opacity=".7"/>',
    fruit:   '<circle cx="9" cy="15.5" r="4.6"/><circle cx="15.6" cy="15.5" r="4.6"/><path d="M9 11.4C9.4 8 11 5.6 13.6 4.2M15.6 11.4c-.3-2.4-1.1-4-2.5-5.2"/>',
    greens:  '<path d="M5 15C5 9.5 9 5.5 15 5c-.2 6-3.6 9.6-8.6 10L5 15z"/><path d="M8 19c1.5-4.6 4.4-7.6 8.7-9.2"/>',
    spices:  '<path d="M12 3.4l1.7 4.3 4.4-1.3-2.7 3.7 4 2.1-4.4.9 1.3 4.4-3.7-2.7-2.1 4-0.9-4.4-4.4 1.3 2.7-3.7-4-2.1 4.4-.9L8.6 3.4l3.7 2.7z"/>',
    citrus:  '<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="1.2"/><path d="M12 3.6v7.2M12 13.2v7.2M3.6 12h7.2M13.2 12h7.2M6.1 6.1l5.1 5.1M12.8 12.8l5.1 5.1M17.9 6.1l-5.1 5.1M11.2 12.8l-5.1 5.1" opacity=".8"/>',
    floral:  '<circle cx="12" cy="12" r="2.4"/><path d="M12 4.2a3.8 3.8 0 0 1 0 7.6M17 8.4a3.8 3.8 0 0 1-3.3 6.6M15.8 16.8a3.8 3.8 0 0 1-7.6 0M8.4 15a3.8 3.8 0 0 1-3.3-6.6"/>',
    musk:    '<path d="M6.5 4.5c7.5-1.5 11.5 3 9.5 8.5-1.3 3.6-5.2 4.9-8 3.4-2.3-1.2-2.6-4.4-.5-5.6 1.7-1 3.6.2 3.5 1.9"/><path d="M13.8 19.5c3.6.6 6.2-.9 7.2-3.8"/>',
    resins:  '<path d="M12 3.6c3.2 3.4 5.4 6.4 5.4 9.4a5.4 5.4 0 0 1-10.8 0c0-3 2.2-6 5.4-9.4z"/><path d="M9.8 13.6l1.6 1.8 1.9-2.4 1.7 2.6" opacity=".75"/>',
  };

  function svg(key, cls) {
    return '<svg class="' + (cls || "fam-ic") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + GLYPHS[key] + "</svg>";
  }

  function color(key) { return COLORS[key] || "#8A681C"; }

  function family(key) {
    for (const f of D.families) if (f.key === key) return f;
    return { key: key, en: key, zh: key };
  }

  /* ---- intensity auras (colours from theme.js) ---- */
  function aura(key) {
    const T = window.VSP_THEME;
    if (T && T.aura && T.aura[key]) return T.aura[key];
    return { color: "#C9A227", name: "gold" };
  }
  function auraColor(key) { return aura(key).color; }

  function init() {
    const root = document.documentElement;
    Object.keys(COLORS).forEach(function (k) {
      root.style.setProperty("--fam-" + k, COLORS[k]);
    });
  }

  VSP.icons = { svg: svg, color: color, family: family, aura: aura, auraColor: auraColor, COLORS: COLORS, init: init };
})(window.VSP);
