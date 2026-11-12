/* ratio-mixer — the quiz's eight-family formula bar. Seven pointer/keyboard
   handles move only their two neighboring shares; every formula totals 100%. */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  const D = window.VSP_DATA;
  const KEYS = D.families.map(function (f) { return f.key; });

  function normalize(raw) {
    raw = raw || {};
    let sum = 0;
    const values = KEYS.map(function (key) {
      const value = Math.max(0, Number(raw[key]) || 0);
      sum += value;
      return value;
    });
    if (!sum) {
      sum = KEYS.length;
      for (let i = 0; i < values.length; i++) values[i] = 1;
    }
    const extra = 100 - KEYS.length;
    const rows = values.map(function (value, i) {
      const exact = extra * value / sum;
      const base = 1 + Math.floor(exact);
      return { key: KEYS[i], value: base, fraction: exact - Math.floor(exact), index: i };
    });
    let remainder = 100 - rows.reduce(function (total, row) { return total + row.value; }, 0);
    rows.slice().sort(function (a, b) {
      return b.fraction - a.fraction || a.index - b.index;
    }).forEach(function (row) {
      if (remainder > 0) {
        const target = rows[row.index];
        target.value++;
        remainder--;
      }
    });
    const out = {};
    rows.forEach(function (row) { out[row.key] = row.value; });
    return out;
  }

  function move(weights, index, requestedLeft) {
    const next = Object.assign({}, weights);
    const leftKey = KEYS[index], rightKey = KEYS[index + 1];
    if (!leftKey || !rightKey) return next;
    const pairTotal = weights[leftKey] + weights[rightKey];
    const left = Math.max(1, Math.min(pairTotal - 1, Math.round(requestedLeft)));
    next[leftKey] = left;
    next[rightKey] = pairTotal - left;
    return next;
  }

  function fromQuiz(answers) {
    const raw = {};
    KEYS.forEach(function (key) { raw[key] = 1; });
    D.quiz.forEach(function (q) {
      if (q.id === "families") return;
      const selected = answers[q.id] || [];
      q.options.forEach(function (option) {
        if (selected.indexOf(option.id) < 0 || !option.families) return;
        Object.keys(option.families).forEach(function (key) {
          if (raw[key] != null) raw[key] += option.families[key] * 8;
        });
      });
    });
    return normalize(raw);
  }

  function family(key) {
    return D.families.filter(function (f) { return f.key === key; })[0];
  }

  function create(container, options) {
    const t = VSP.i18n.t, fmt = VSP.i18n.fmt;
    let weights = normalize(options.weights);
    let trackWidth = 0;
    let frame = 0;
    let drag = null;

    const root = document.createElement("div");
    root.className = "ratio-mixer";
    const hint = document.createElement("p");
    hint.className = "ratio-hint";
    hint.textContent = t("quiz.ratioHint");
    root.appendChild(hint);

    const track = document.createElement("div");
    track.className = "ratio-track";
    track.setAttribute("role", "group");
    track.setAttribute("aria-label", t("q.families"));
    root.appendChild(track);

    const segments = {};
    KEYS.forEach(function (key, i) {
      const fam = family(key);
      const segment = document.createElement("div");
      segment.className = "ratio-segment";
      const previous = VSP.icons.color(KEYS[Math.max(0, i - 1)]);
      const current = VSP.icons.color(key);
      const next = VSP.icons.color(KEYS[Math.min(KEYS.length - 1, i + 1)]);
      segment.style.background = "linear-gradient(90deg," + previous + " -25%," + current + " 22%," + current + " 78%," + next + " 125%)";
      segment.innerHTML = VSP.icons.svg(key, "ratio-segment-icon") +
        '<span class="ratio-segment-label">' + (VSP.i18n.current() === "zh" ? fam.zh : fam.en) + "</span>";
      track.appendChild(segment);
      segments[key] = segment;
    });

    const handles = [];
    for (let i = 0; i < KEYS.length - 1; i++) {
      const handle = document.createElement("button");
      handle.type = "button";
      handle.className = "ratio-handle";
      handle.setAttribute("role", "slider");
      handle.setAttribute("aria-orientation", "horizontal");
      handle.innerHTML = '<span class="ratio-stopper" aria-hidden="true"></span>';
      track.appendChild(handle);
      handles.push(handle);
      bindPointer(handle, i);
      handle.addEventListener("keydown", function (event) {
        const direction = event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 :
          event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 0;
        if (!direction && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        const leftKey = KEYS[i], rightKey = KEYS[i + 1];
        const pairTotal = weights[leftKey] + weights[rightKey];
        let nextLeft = weights[leftKey];
        if (direction) nextLeft += direction * (event.shiftKey ? 5 : 1);
        else nextLeft = event.key === "Home" ? 1 : pairTotal - 1;
        weights = move(weights, i, nextLeft);
        update();
        commit(true);
        announce(leftKey);
      });
    }

    const readout = document.createElement("div");
    readout.className = "ratio-readout";
    const numbers = {};
    KEYS.forEach(function (key) {
      const fam = family(key);
      const item = document.createElement("div");
      item.className = "ratio-readout-item";
      item.innerHTML = '<span class="ratio-readout-name">' + VSP.icons.svg(key, "ratio-readout-icon") +
        '<span>' + fam.en + ' <span lang="zh">' + fam.zh + "</span></span></span>" +
        '<strong class="ratio-number"></strong>';
      readout.appendChild(item);
      numbers[key] = item.querySelector(".ratio-number");
    });
    root.appendChild(readout);

    const foot = document.createElement("div");
    foot.className = "ratio-tools";
    const total = document.createElement("span");
    total.textContent = t("quiz.ratioTotal");
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "btn btn-mini btn-outline";
    reset.textContent = t("quiz.ratioReset");
    reset.addEventListener("click", function () {
      weights = normalize({});
      update();
      commit(true);
      announce(KEYS[0]);
    });
    foot.appendChild(total);
    foot.appendChild(reset);
    root.appendChild(foot);

    const live = document.createElement("p");
    live.className = "sr-only";
    live.setAttribute("aria-live", "polite");
    live.setAttribute("aria-atomic", "true");
    root.appendChild(live);
    container.appendChild(root);

    function commit(done) {
      if (options.onChange) options.onChange(Object.assign({}, weights), done);
    }

    function announce(key) {
      const fam = family(key);
      live.textContent = fmt(t("quiz.ratioAnnounce"), {
        f: VSP.i18n.current() === "zh" ? fam.zh : fam.en,
        n: weights[key],
      });
    }

    function update() {
      let boundary = 0;
      KEYS.forEach(function (key, i) {
        const weight = weights[key];
        const segment = segments[key];
        segment.style.width = weight + "%";
        segment.classList.toggle("narrow", weight < 11);
        const fam = family(key);
        segment.title = fam.en + " / " + fam.zh + " — " + weight + "%";
        const icon = segment.querySelector(".ratio-segment-icon");
        const scale = Math.max(0.62, Math.min(1.15, weight / 13));
        icon.style.transform = "scale(" + scale + ")";
        numbers[key].textContent = weight + "%";
        boundary += weight;
        if (i < handles.length) {
          const handle = handles[i];
          const leftKey = KEYS[i], rightKey = KEYS[i + 1];
          const leftFam = family(leftKey), rightFam = family(rightKey);
          const lang = VSP.i18n.current();
          handle.style.transform = "translate(" + (boundary / 100 * trackWidth) + "px,-50%) translateX(-50%)";
          handle.setAttribute("aria-valuemin", "1");
          handle.setAttribute("aria-valuemax", String(weight + weights[rightKey] - 1));
          handle.setAttribute("aria-valuenow", String(weight));
          handle.setAttribute("aria-valuetext", weight + "% " + (lang === "zh" ? leftFam.zh : leftFam.en));
          handle.setAttribute("aria-label", fmt(t("quiz.ratioBoundary"), {
            a: lang === "zh" ? leftFam.zh : leftFam.en,
            b: lang === "zh" ? rightFam.zh : rightFam.en,
          }));
        }
      });
    }

    function measure() {
      trackWidth = track.getBoundingClientRect().width;
      update();
    }

    function bindPointer(handle, index) {
      handle.addEventListener("pointerdown", function (event) {
        if (event.button !== 0 && event.pointerType === "mouse") return;
        event.preventDefault();
        handle.focus();
        handle.setPointerCapture(event.pointerId);
        const rect = track.getBoundingClientRect();
        trackWidth = rect.width;
        drag = {
          id: event.pointerId,
          index: index,
          startX: event.clientX,
          startLeft: weights[KEYS[index]],
          width: rect.width,
          pending: weights[KEYS[index]],
        };
        handle.classList.add("dragging");
      });
      handle.addEventListener("pointermove", function (event) {
        if (!drag || drag.id !== event.pointerId || drag.index !== index) return;
        drag.pending = drag.startLeft + (event.clientX - drag.startX) / drag.width * 100;
        if (!frame) {
          frame = requestAnimationFrame(function () {
            frame = 0;
            if (!drag) return;
            weights = move(weights, drag.index, drag.pending);
            update();
            commit(false);
          });
        }
      });
      function finish(event) {
        if (!drag || drag.id !== event.pointerId || drag.index !== index) return;
        if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
          weights = move(weights, drag.index, drag.pending);
          update();
        }
        drag = null;
        handle.classList.remove("dragging");
        if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
        commit(true);
        announce(KEYS[index]);
      }
      handle.addEventListener("pointerup", finish);
      handle.addEventListener("pointercancel", finish);
    }

    function onResize() {
      if (!root.isConnected) {
        window.removeEventListener("resize", onResize);
        return;
      }
      measure();
    }
    window.addEventListener("resize", onResize);
    measure();
    requestAnimationFrame(measure);
    commit(false);

    return {
      getWeights: function () { return Object.assign({}, weights); },
      refresh: measure,
    };
  }

  VSP.ratioMixer = { create: create, normalize: normalize, move: move, fromQuiz: fromQuiz };
})(window.VSP);
