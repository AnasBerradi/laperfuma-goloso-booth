/* ============================================================
   THEME — the alchemist's dials.
   Loaded first in <head> so tokens apply before first paint.

   ── The three dials ─────────────────────────────────────────
   ATMOSPHERE_INTENSITY : "low" | "medium" | "high"
     particles, smoke, candle glow, aura halos.
   ORNAMENT_DENSITY     : "low" | "medium" | "high"
     corner flourishes, frames, dividers, ribbons.
   MOTION_SPEED         : 0.6 (slow) … 1 (default) … 1.6 (quick)
     multiplies every animation duration (400–900 ms base).
     prefers-reduced-motion overrides this to near-zero.

   ── Theme tokens (all exposed as CSS custom properties) ──────
   Colors (light / dark):
     --velvet-0/-1/-2   near-black aubergine gradient stops
     --lilac-bg         base background (dusty lilac / dark plum)
     --lilac-bg-2       panel lilac
     --parchment        aged-parchment panel
     --paper            card face
     --ink              primary text (deep plum / pale lilac)
     --ink-soft/-faint  secondary text
     --plum             primary button (deep plum / pale lilac)
     --gold             antique gold (text-safe on both themes)
     --gold-bright      foil highlight
     --gold-line        hairline rules
     --wax              blood-red wax seal
     --moon             moonlight teal accent  #7FE0D0
   Fonts:
     --font-display  EN display (VSP Display — Gabriola slot, swappable)
     --font-song     ZH titles (VSP Song — Song-style)
     --font-brush    ZH calligraphic accent (VSP Brush — running script)
     --font-ui / --font-hei / --font-kai / --font-script  (as before)
   Auras (per intensity category, used for halos + accents):
     exhilarating    rose-gold   #E8A87C
     intriguing      crimson     #C22E5A
     outstanding     emerald-violet  #7C5FA8
     overstimulating electric gold  #E5C55B
     invigorating    moonlight teal  #7FE0D0
   ============================================================ */

window.VSP_THEME = (function () {
  "use strict";

  /* ── DIALS (tweak me) ─────────────────────────────────────── */
  const ATMOSPHERE_INTENSITY = "high";   // low | medium | high
  const ORNAMENT_DENSITY     = "high";   // low | medium | high
  const MOTION_SPEED         = 1;       // 0.6 slow … 1.6 quick
  /* ────────────────────────────────────────────────────────── */

  var AURA = {
    exhilarating:    { color: "#E8A87C", name: "rose-gold" },
    intriguing:     { color: "#C22E5A", name: "crimson" },
    outstanding:    { color: "#7C5FA8", name: "emerald-violet" },
    overstimulating:{ color: "#E5C55B", name: "electric-gold" },
    invigorating:   { color: "#7FE0D0", name: "moonlight-teal" },
  };

  var ATMO = { low: 0.35, medium: 0.65, high: 1 }[ATMOSPHERE_INTENSITY] || 1;
  var ORN  = { low: 0.35, medium: 0.65, high: 1 }[ORNAMENT_DENSITY] || 1;

  function apply() {
    var root = document.documentElement;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.style.setProperty("--atmo", String(ATMO));
    root.style.setProperty("--orn", String(ORN));
    root.style.setProperty("--motion", String(reduce ? 0.001 : MOTION_SPEED));
    Object.keys(AURA).forEach(function (k) {
      root.style.setProperty("--aura-" + k, AURA[k].color);
    });
  }

  apply();

  return {
    ATMOSPHERE_INTENSITY: ATMOSPHERE_INTENSITY,
    ORNAMENT_DENSITY: ORNAMENT_DENSITY,
    MOTION_SPEED: MOTION_SPEED,
    aura: AURA,
    atmosphere: ATMO,
    ornament: ORN,
    apply: apply,
  };
})();