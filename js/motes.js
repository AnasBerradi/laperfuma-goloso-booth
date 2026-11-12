/* motes — the atmosphere engine. ONE canvas behind everything:
   slow gold embers rising, stardust twinkles, drifting smoke wisps,
   plus a candle-flicker glow that follows the pointer.
   Capped particle counts, GPU-friendly, paused when the tab hides,
   silent under prefers-reduced-motion. Scaled by the --atmo dial
   (ATMOSPHERE_INTENSITY in theme.js). */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cv = null, ctx = null, W = 0, H = 0, raf = 0, running = false;
  let embers = [], stars = [], wisps = [];
  let glow = null, glowX = -600, glowY = -600, glowTX = -600, glowTY = -600;

  function atmo() {
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--atmo"));
    return isNaN(v) ? 1 : v;
  }

  function counts() {
    const a = atmo();
    const small = W < 700;
    return {
      embers: Math.round((small ? 10 : 18) * a),
      stars:  Math.round((small ? 8 : 16) * a),
      wisps:  Math.round((small ? 2 : 4) * a),
    };
  }

  function spawnEmber() {
    return {
      x: Math.random() * W, y: H + 10 + Math.random() * 40,
      r: 1 + Math.random() * 2.4,
      vy: -(0.1 + Math.random() * 0.28),
      drift: Math.random() * Math.PI * 2, ds: 0.001 + Math.random() * 0.005,
      tw: Math.random() * Math.PI * 2, ts: 0.006 + Math.random() * 0.02,
      a: 0.35 + Math.random() * 0.3,
    };
  }
  function spawnStar() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: 0.7 + Math.random() * 1.5,
      tw: Math.random() * Math.PI * 2, ts: 0.004 + Math.random() * 0.012,
      teal: Math.random() < 0.22,                 // a few moonlight-teal motes
      a: 0.25 + Math.random() * 0.4,
    };
  }
  function spawnWisp() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: 60 + Math.random() * 110,
      vx: (Math.random() - 0.5) * 0.12, vy: -(0.03 + Math.random() * 0.08),
      ph: Math.random() * Math.PI * 2, ps: 0.0015 + Math.random() * 0.003,
      a: 0.05 + Math.random() * 0.05,
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const c = counts();
    while (embers.length > c.embers) embers.pop();
    while (stars.length > c.stars) stars.pop();
    while (wisps.length > c.wisps) wisps.pop();
    while (embers.length < c.embers) embers.push(spawnEmber());
    while (stars.length < c.stars) stars.push(spawnStar());
    while (wisps.length < c.wisps) wisps.push(spawnWisp());
  }

  function drawWisp(w) {
    const x = w.x + Math.sin(w.ph) * 26;
    const y = w.y;
    const g = ctx.createRadialGradient(x, y, 0, x, y, w.r);
    const alpha = w.a * atmo();
    g.addColorStop(0, "rgba(210,190,205," + alpha.toFixed(3) + ")");
    g.addColorStop(1, "rgba(210,190,205,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, w.r, w.r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    const a = atmo();

    for (const w of wisps) {
      w.x += w.vx; w.y += w.vy; w.ph += w.ps;
      if (w.y < -w.r) { w.y = H + w.r; w.x = Math.random() * W; }
      if (w.x < -w.r) w.x = W + w.r; else if (w.x > W + w.r) w.x = -w.r;
      drawWisp(w);
    }

    for (const s of stars) {
      s.tw += s.ts;
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(s.tw));
      ctx.fillStyle = s.teal
        ? "rgba(127,224,208," + (s.a * tw * a).toFixed(3) + ")"
        : "rgba(240,220,160," + (s.a * tw * a).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const m of embers) {
      m.y += m.vy; m.drift += m.ds; m.tw += m.ts;
      if (m.y < -8) { Object.assign(m, spawnEmber()); m.y = H + 8; }
      const x = m.x + Math.sin(m.drift) * 16;
      const alpha = m.a * (0.5 + 0.5 * Math.abs(Math.sin(m.tw))) * a;
      const g = ctx.createRadialGradient(x, m.y, 0, x, m.y, m.r * 3.4);
      g.addColorStop(0, "rgba(201,162,39," + (alpha).toFixed(3) + ")");
      g.addColorStop(1, "rgba(201,162,39,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, m.y, m.r * 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,214,140," + (alpha * 0.9).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(x, m.y, m.r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }

    // candle glow eases toward the pointer
    glowX += (glowTX - glowX) * 0.06;
    glowY += (glowTY - glowY) * 0.06;
    glow.style.transform = "translate3d(" + glowX.toFixed(1) + "px," + glowY.toFixed(1) + "px,0)";

    raf = requestAnimationFrame(tick);
  }

  function start() { if (!running) { running = true; raf = requestAnimationFrame(tick); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  function onVisibility() {
    if (document.hidden) stop();
    else if (!reduce) start();
  }

  function onPointer(e) {
    glowTX = (e.clientX || 0) - 260;
    glowTY = (e.clientY || 0) - 260;
  }

  function init() {
    if (reduce) return;
    cv = document.createElement("canvas");
    cv.className = "motes-canvas";
    cv.setAttribute("aria-hidden", "true");
    document.body.appendChild(cv);
    ctx = cv.getContext("2d");

    glow = document.createElement("div");
    glow.className = "candle-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();
  }

  VSP.motes = { init: init };
})(window.VSP);
