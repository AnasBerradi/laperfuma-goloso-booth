/* ambience — OPTIONAL sound, OFF by default, enabled only by a tap on
   the chime toggle. Fully synthesized with Web Audio (no audio files):
   a very low warm drone plus sparse soft chimes in a pentatonic set.
   Never autoplays; nothing is fetched. */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  let ctx = null, master = null, drone = [], chimeTimer = null, on = false;

  const CHIME_NOTES = [523.25, 587.33, 659.25, 783.99, 880];   // C5 D5 E5 G5 A5
  const DRONE_NOTES = [65.41, 98];                              // C2, G2

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function startDrone() {
    DRONE_NOTES.forEach(function (f, i) {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.05 : 0.02;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.03;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.015;
      lfo.connect(lfoGain).connect(g.gain);
      osc.connect(g).connect(master);
      osc.start(); lfo.start();
      drone.push(osc, lfo);
    });
  }

  function chime() {
    if (!on || !ctx) return;
    const f = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)];
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f * (Math.random() < 0.3 ? 2 : 1);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.055, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
    osc.connect(g).connect(master);
    osc.start(now);
    osc.stop(now + 3.4);
  }

  function scheduleChimes() {
    clearTimeout(chimeTimer);
    (function loop() {
      chimeTimer = setTimeout(function () {
        chime();
        loop();
      }, 4000 + Math.random() * 8000);
    })();
  }

  function toggle() {
    if (!ensureCtx()) return false;
    on = !on;
    const now = ctx.currentTime;
    if (on) {
      if (!drone.length) startDrone();
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0.9, now + 1.2);
      scheduleChimes();
    } else {
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0.0001, now + 0.8);
      clearTimeout(chimeTimer);
    }
    return on;
  }

  function init() {
    const btn = document.getElementById("ambienceToggle");
    if (!btn) return;
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", function () {
      const nowOn = toggle();
      btn.setAttribute("aria-pressed", nowOn ? "true" : "false");
      const label = VSP.i18n.t("a11y.ambienceToggle");
      btn.setAttribute("aria-label", label);
      VSP.attract.notifyActivity();
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && ctx && on) ctx.suspend();
      else if (ctx && on) ctx.resume();
    });
  }

  VSP.ambience = { init: init, toggle: toggle, isOn: function () { return on; } };
})(window.VSP);