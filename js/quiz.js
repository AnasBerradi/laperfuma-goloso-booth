/* quiz — "Which spell are you?" Four tap questions plus a draggable
   family-ratio formula, scored against each vial's notes and intensity.
   Shows the top match and a runner-up. Answers persist per session. */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  const D = window.VSP_DATA;
  const t = VSP.i18n.t, fmt = VSP.i18n.fmt;

  let answers = {};   // { questionId: [optionIds] }

  const root = document.getElementById("quizRoot");

  /* ---------- rendering ---------- */

  function render() {
    const step = firstUnanswered();
    const begun = Object.keys(answers).some(function (k) { return answers[k] && answers[k].length; });
    if (!begun) { renderIntro(); return; }
    if (step >= D.quiz.length) { renderResult(); return; }
    renderQuestion(step);
  }

  /* beat 1 — the invitation: a crystal ball waits */
  function renderIntro() {
    root.innerHTML = "";
    const intro = document.createElement("div");
    intro.className = "divination-intro";
    intro.innerHTML =
      '<div class="crystal" aria-hidden="true"><svg><use href="#crystal-ball"/></svg></div>' +
      '<h2>' + t("quiz.title") + "</h2>" +
      '<p class="quiz-intro-line">' + t("quiz.intro") + "</p>";
    const cta = document.createElement("button");
    cta.className = "btn btn-seal";
    cta.type = "button";
    cta.textContent = t("quiz.introCta");
    cta.addEventListener("click", function () { renderQuestion(0); });
    intro.appendChild(cta);
    root.appendChild(intro);
  }

  /* the moon cycles through its phases as the cards are drawn */
  function moonTrack(idx) {
    const track = document.createElement("div");
    track.className = "moon-track";
    track.setAttribute("aria-hidden", "true");
    for (let i = 0; i < D.quiz.length; i++) {
      const dot = document.createElement("span");
      dot.className = "moon-dot" + (i < idx ? " done" : i === idx ? " current" : "");
      track.appendChild(dot);
    }
    return track;
  }

  function firstUnanswered() {
    for (let i = 0; i < D.quiz.length; i++) {
      if (!answers[D.quiz[i].id] || answers[D.quiz[i].id].length === 0) return i;
    }
    return D.quiz.length;
  }

  function renderQuestion(idx) {
    const q = D.quiz[idx];
    const multi = q.id === "families";
    const sel = answers[q.id] || [];

    root.innerHTML = "";

    const head = document.createElement("div");
    head.className = "quiz-head";
    head.innerHTML =
      '<h2 class="quiz-title">' + t("quiz.title") + "</h2>" +
      '<p class="quiz-sub">' + t("quiz.subtitle") + "</p>";
    root.appendChild(head);
    root.appendChild(moonTrack(idx));
    const prog = document.createElement("p");
    prog.className = "quiz-progress";
    prog.textContent = fmt(t("quiz.progress"), { a: idx + 1, b: D.quiz.length });
    root.appendChild(prog);

    const qh = document.createElement("h3");
    qh.className = "quiz-q";
    qh.textContent = t("q." + q.id);
    root.appendChild(qh);

    if (multi) {
      const initial = answers.familyRatios || VSP.ratioMixer.fromQuiz(answers);
      answers.familyRatios = initial;
      answers.families = D.families.map(function (f) { return f.key; });
      VSP.store.saveQuizAnswers(answers);
      const mixerMount = document.createElement("div");
      root.appendChild(mixerMount);
      VSP.ratioMixer.create(mixerMount, {
        weights: initial,
        onChange: function (weights, done) {
          answers.familyRatios = weights;
          answers.families = D.families.filter(function (f) { return weights[f.key] > 0; }).map(function (f) { return f.key; });
          if (done) VSP.store.saveQuizAnswers(answers);
        },
      });
    } else {
      const opts = document.createElement("div");
      opts.className = "quiz-opts";
      q.options.forEach(function (o) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "quiz-opt";
        const pressed = sel.indexOf(o.id) >= 0;
        b.setAttribute("aria-pressed", pressed ? "true" : "false");
        const label = VSP.i18n.current() === "zh" ? o.zh : o.en;
        b.innerHTML = '<span class="opt-dot"></span><span>' + label + "</span>";
        b.addEventListener("click", function () {
          answers[q.id] = [o.id];
          VSP.store.saveQuizAnswers(answers);
          setTimeout(render, 220);   // tiny beat so the tap feels acknowledged
        });
        opts.appendChild(b);
      });
      root.appendChild(opts);
    }

    const foot = document.createElement("div");
    foot.className = "quiz-foot";
    const back = document.createElement("button");
    back.className = "btn btn-outline btn-mini";
    back.type = "button";
    back.textContent = t("quiz.back");
    back.disabled = Object.keys(answers).length === 0;
    back.addEventListener("click", function () {
      // drop the most recently answered question and show it again
      const order = D.quiz.map(function (x) { return x.id; });
      const done = order.filter(function (id) { return answers[id] && answers[id].length; });
      const target = multi && idx > 0 ? D.quiz[idx - 1].id : done[done.length - 1];
      if (target) {
        delete answers[target];
        if (target === "families") delete answers.familyRatios;
        VSP.store.saveQuizAnswers(answers);
      }
      render();
    });
    foot.appendChild(back);
    if (multi) {
      // ratio question: an explicit Continue button advances
      const next = document.createElement("button");
      next.className = "btn btn-gold";
      next.type = "button";
      next.textContent = t("quiz.next");
      next.disabled = !answers[q.id] || answers[q.id].length === 0;
      next.addEventListener("click", render);
      foot.appendChild(next);
    }
    const skip = document.createElement("button");
    skip.className = "btn btn-mini";
    skip.type = "button";
    skip.textContent = t("quiz.skip");
    skip.addEventListener("click", function () {
      answers = {};
      VSP.store.saveQuizAnswers(answers);
      VSP.screens.show("home");
    });
    foot.appendChild(skip);
    root.appendChild(foot);
  }

  /* ---------- scoring ---------- */

  function vialFamilyWeight(v, fam) {
    for (const n of v.notes) if (n.family === fam) return n.weight;
    return 0;
  }

  function computeScores() {
    const scores = D.vials.map(function (v) { return { v: v, s: 0, why: [] }; });

    D.quiz.forEach(function (q) {
      const sel = answers[q.id] || [];
      const chosen = q.options.filter(function (o) { return sel.indexOf(o.id) >= 0; });
      if (!chosen.length) return;

      if (q.id === "families") {
        const ratios = answers.familyRatios;
        const fams = ratios ? Object.keys(ratios).sort(function (a, b) { return ratios[b] - ratios[a]; }) : sel;
        scores.forEach(function (row) {
          let dot = 0, hit = 0;
          fams.forEach(function (f) {
            const w = vialFamilyWeight(row.v, f);
            if (w > 0) {
              dot += ratios ? w * ratios[f] / 100 : w;
              hit++;
            }
          });
          if (dot > 0) {
            row.s += (ratios ? dot / 20 : dot / 40) * 1.6;
            const matching = fams.filter(function (f) { return vialFamilyWeight(row.v, f) > 0; }).slice(0, 2);
            if (matching.length) row.why.push({ kind: "fam", fams: matching });
          }
        });
        return;
      }

      chosen.forEach(function (o) {
        // intensity affinity
        if (o.intensity) {
          Object.keys(o.intensity).forEach(function (k) {
            scores.forEach(function (row) {
              if (row.v.intensity === k) {
                row.s += o.intensity[k] * 2.2;
                row.why.push({ kind: "int", key: k, w: o.intensity[k] });
              }
            });
          });
        }
        // family affinity
        if (o.families) {
          Object.keys(o.families).forEach(function (f) {
            scores.forEach(function (row) {
              const w = vialFamilyWeight(row.v, f);
              if (w > 0) row.s += w / 40 * o.families[f];
            });
          });
        }
        // season affinity
        if (o.season) {
          scores.forEach(function (row) {
            if (row.v.season === o.season) {
              row.s += 3;
              row.why.push({ kind: "season", season: o.season });
            }
          });
        }
      });
    });

    scores.sort(function (a, b) { return b.s - a.s; });
    return scores;
  }

  function reasonFor(row) {
    const lang = VSP.i18n.current();
    const bits = [];
    const famWhy = row.why.find(function (w) { return w.kind === "fam"; });
    const intWhy = row.why.filter(function (w) { return w.kind === "int"; }).sort(function (a, b) { return b.w - a.w; })[0];
    const seaWhy = row.why.find(function (w) { return w.kind === "season"; });

    if (intWhy) bits.push(fmt(t("quiz.matchIntensity"), { i: intensityLabel(intWhy.key, lang) }));
    if (famWhy && famWhy.fams.length) {
      const names = famWhy.fams.slice(0, 2).map(function (f) { return familyLabel(f, lang); }).join(lang === "zh" ? "与" : " & ");
      bits.push(fmt(t("quiz.matchNoteFam"), { f: names }));
    }
    if (seaWhy) bits.push(t("quiz.matchSeason"));
    if (!bits.length) bits.push(t("quiz.matchDefault"));
    return bits.slice(0, 2).join(lang === "zh" ? "；" : "; ");
  }

  function intensityLabel(key, lang) {
    for (const i of D.intensities) if (i.key === key) return lang === "zh" ? i.zh : i.en;
    return key;
  }
  function familyLabel(key, lang) {
    for (const f of D.families) if (f.key === key) return lang === "zh" ? f.zh : f.en;
    return key;
  }

  /* ---------- result ---------- */

  function renderResult() {
    const scores = computeScores();
    const top = scores[0], second = scores[1];
    const lang = VSP.i18n.current();

    root.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "quiz-result";

    const crown = document.createElement("p");
    crown.className = "crown";
    crown.textContent = "✦ " + t("quiz.reveal") + " ✦";
    wrap.appendChild(crown);

    const row = document.createElement("div");
    row.className = "quiz-result-names";

    [[top, t("quiz.yourSpell"), true], [second, t("quiz.runnerUp"), false]].forEach(function (pair) {
      const r = pair[0];
      if (!r) return;
      const box = document.createElement("div");
      box.className = "result-vial" + (pair[2] ? " main-vial" : " shadow-vial");
      box.style.setProperty("--aura", VSP.icons.auraColor(r.v.intensity));
      const img = document.createElement("img");
      img.src = window.VSP_CONFIG.assets.vialPhoto.replace("{ID}", r.v.id);
      img.alt = fmt(t("a11y.vialPhoto"), { name: lang === "zh" ? r.v.name_zh : r.v.name_en });
      const rank = document.createElement("p");
      rank.className = "rank";
      rank.textContent = pair[1];
      const nm = document.createElement("p");
      nm.className = "rname";
      nm.textContent = r.v.name_en;
      const nmzh = document.createElement("p");
      nmzh.className = "rname-zh";
      nmzh.textContent = r.v.name_zh + " · " + r.v.id;
      box.appendChild(img); box.appendChild(rank); box.appendChild(nm); box.appendChild(nmzh);

      // the spell is revealed word by word, as if read aloud
      const spellP = document.createElement("p");
      spellP.className = "spell spell-words";
      const spellText = lang === "zh" ? r.v.spell_zh : r.v.spell_en;
      const words = spellText.split(" ");
      words.forEach(function (w, wi) {
        const s = document.createElement("span");
        s.textContent = w;
        spellP.appendChild(s);
        spellP.appendChild(document.createTextNode(" "));
        setTimeout(function () { s.classList.add("w"); }, (pair[2] ? 700 : 1300) + wi * 180);
      });
      box.appendChild(spellP);

      const why = document.createElement("p");
      why.className = "result-reason";
      why.textContent = t("quiz.reason") + reasonFor(r);
      box.appendChild(why);

      box.tabIndex = 0;
      box.setAttribute("role", "button");
      box.addEventListener("click", function () { VSP.cards.openById(r.v.id); });
      box.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); VSP.cards.openById(r.v.id); }
      });
      row.appendChild(box);
    });
    wrap.appendChild(row);

    const actions = document.createElement("div");
    actions.className = "result-actions";
    const again = document.createElement("button");
    again.className = "btn btn-outline";
    again.type = "button";
    again.textContent = t("quiz.restart");
    again.addEventListener("click", function () {
      answers = {};
      VSP.store.saveQuizAnswers(answers);
      render();
    });
    actions.appendChild(again);
    const browse = document.createElement("button");
    browse.className = "btn btn-gold";
    browse.type = "button";
    browse.textContent = t("nav.collection");
    browse.addEventListener("click", function () { VSP.screens.show("collection"); });
    actions.appendChild(browse);
    wrap.appendChild(actions);

    root.appendChild(wrap);
  }

  /* ---------- lifecycle ---------- */

  function enter() {
    answers = VSP.store.quizAnswers() || {};
    render();
  }

  function init() {
    document.addEventListener("vsp:lang", function () {
      if (!document.getElementById("screen-quiz").hidden) render();
    });
  }

  VSP.quiz = { init: init, enter: enter };
})(window.VSP);