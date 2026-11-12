/* audio — "Hear its incantation": a note-driven, softly reverberant soundscape.
   The printed Hz value is a visual label only. Never autoplayed. */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  const A = window.VSP_CONFIG.audio;
  let ctx = null;
  let playing = false;

  const FAMILY_VOICES = {
    wood:    { root: 45, fifth: 7,  wave: "sine",     cutoff: 850 },
    fruit:   { root: 69, fifth: 7,  wave: "triangle", cutoff: 2200 },
    greens:  { root: 64, fifth: 7,  wave: "sine",     cutoff: 2800 },
    spices:  { root: 52, fifth: 6,  wave: "triangle", cutoff: 1450 },
    citrus:  { root: 71, fifth: 7,  wave: "triangle", cutoff: 3400 },
    floral:  { root: 67, fifth: 7,  wave: "sine",     cutoff: 2300 },
    musk:    { root: 43, fifth: 7,  wave: "sine",     cutoff: 700 },
    resins:  { root: 40, fifth: 7,  wave: "triangle", cutoff: 1050 },
  };
  const INTENSITY_LIFTS = {
    exhilarating: 2,
    intriguing: -2,
    outstanding: 0,
    overstimulating: 5,
    invigorating: 3,
  };

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  /* Retained for data compatibility; incantations do not use the printed Hz. */
  function fold(hz) {
    let f = hz;
    if (f > A.foldAboveHz) {
      do { f = f / 2; } while (f > A.foldTargetMaxHz);
      if (f < A.foldTargetMinHz) f = A.foldTargetMinHz;
    }
    return Math.round(f * 10) / 10;
  }

  function pitch(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

  function impulse(c, seconds) {
    const length = Math.floor(c.sampleRate * seconds);
    const buffer = c.createBuffer(2, length, c.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const samples = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2.8);
        samples[i] = (Math.random() * 2 - 1) * decay;
      }
    }
    return buffer;
  }

  function addVoice(c, bus, sources, options) {
    const osc = c.createOscillator();
    const filter = c.createBiquadFilter();
    const gain = c.createGain();
    osc.type = options.wave;
    osc.frequency.value = pitch(options.midi);
    osc.detune.value = options.detune || 0;
    filter.type = "lowpass";
    filter.frequency.value = options.cutoff;
    filter.Q.value = 0.45;

    const attack = options.bell ? 0.025 : 0.45;
    const peak = options.start + attack;
    gain.gain.setValueAtTime(0.0001, options.start);
    gain.gain.exponentialRampToValueAtTime(options.volume, peak);
    if (!options.bell) gain.gain.setValueAtTime(options.volume * 0.72, options.start + options.length * 0.55);
    gain.gain.exponentialRampToValueAtTime(0.0001, options.start + options.length);

    osc.connect(filter).connect(gain);
    if (c.createStereoPanner) {
      const pan = c.createStereoPanner();
      pan.pan.value = options.pan;
      gain.connect(pan).connect(bus);
    } else {
      gain.connect(bus);
    }
    osc.start(options.start);
    osc.stop(options.stop);
    sources.push(osc);
  }

  function addAir(c, bus, sources, now, stop, family) {
    const length = Math.floor(c.sampleRate * (stop - now));
    const buffer = c.createBuffer(1, length, c.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) samples[i] = Math.random() * 2 - 1;
    const source = c.createBufferSource();
    const filter = c.createBiquadFilter();
    const gain = c.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = family === "spices" || family === "wood" ? 900 : 2600;
    filter.Q.value = 0.7;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.007, now + 1.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, stop);
    source.connect(filter).connect(gain).connect(bus);
    source.start(now);
    source.stop(stop);
    sources.push(source);
  }

  function playTone(vial, onEnd) {
    if (playing || !vial || !vial.notes || !vial.notes.length) return null;
    const c = ensureCtx();
    if (!c) return null;

    playing = true;
    document.dispatchEvent(new CustomEvent("vsp:tone", {
      detail: { state: "start", id: vial.id, orig: vial.hz },
    }));

    const dur = A.toneSeconds || 4.4;
    const fade = Math.min(A.fadeSeconds, dur / 3);
    const now = c.currentTime + 0.025;
    const stop = now + dur;
    const sources = [];
    const bus = c.createGain();
    const master = c.createGain();
    const compressor = c.createDynamicsCompressor();
    const reverb = c.createConvolver();
    const wet = c.createGain();

    compressor.threshold.value = -20;
    compressor.knee.value = 18;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.02;
    compressor.release.value = 0.35;
    reverb.buffer = impulse(c, 2.4);
    wet.gain.value = 0.32;
    bus.connect(master);
    bus.connect(reverb).connect(wet).connect(master);
    master.connect(compressor).connect(c.destination);
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(A.gain, now + fade);
    master.gain.setValueAtTime(A.gain, stop - Math.max(fade, 0.9));
    master.gain.exponentialRampToValueAtTime(0.0001, stop);

    const lift = INTENSITY_LIFTS[vial.intensity] || 0;
    const notes = vial.notes.slice(0, 3);
    notes.forEach(function (note, i) {
      const voice = FAMILY_VOICES[note.family] || FAMILY_VOICES.wood;
      const root = voice.root + lift;
      const start = now + i * 0.12;
      const length = dur - i * 0.12;
      const weight = note.weight / notes[0].weight;
      const volume = 0.045 + weight * 0.02;
      const pan = (i - (notes.length - 1) / 2) * 0.38;
      addVoice(c, bus, sources, {
        midi: root, wave: voice.wave, cutoff: voice.cutoff, start: start,
        length: length, stop: stop, volume: volume, pan: pan, detune: -3,
      });
      addVoice(c, bus, sources, {
        midi: root + voice.fifth, wave: "sine", cutoff: voice.cutoff * 1.35,
        start: start + 0.08, length: length - 0.08, stop: stop,
        volume: volume * 0.55, pan: -pan, detune: 3,
      });
      addVoice(c, bus, sources, {
        midi: root + 12 + voice.fifth, wave: "sine", cutoff: 4200,
        start: now + 0.65 + i * 0.72, length: 2.1, stop: stop,
        volume: 0.055, pan: i % 2 ? -0.55 : 0.55, bell: true,
      });
    });
    addAir(c, bus, sources, now, stop, notes[0].family);

    sources[sources.length - 1].onended = function () {
      playing = false;
      document.dispatchEvent(new CustomEvent("vsp:tone", { detail: { state: "end", id: vial.id } }));
      if (onEnd) onEnd();
    };

    return { id: vial.id, duration: dur, folded: false };
  }

  VSP.audio = { playTone: playTone, fold: fold, isPlaying: function () { return playing; } };
})(window.VSP);
