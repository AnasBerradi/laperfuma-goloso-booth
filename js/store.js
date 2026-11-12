/* store — favorites & settings in localStorage only. No data leaves the device. */
window.VSP = window.VSP || {};
(function (VSP) {
  "use strict";

  const C = window.VSP_CONFIG;
  const K = C.storageKeys;

  function get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* private mode: ignore */ }
  }

  /* ---- favorites ---- */
  function favs() { return get(K.favorites, []); }
  function isFav(id) { return favs().indexOf(id) >= 0; }
  function toggleFav(id) {
    const list = favs();
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1); else list.push(id);
    set(K.favorites, list);
    document.dispatchEvent(new CustomEvent("vsp:favs"));
    return i < 0;
  }
  function clearFavs() {
    set(K.favorites, []);
    document.dispatchEvent(new CustomEvent("vsp:favs"));
  }

  /* ---- quiz memory (so a lost tap doesn't lose the session) ---- */
  function quizAnswers() { return get(K.quiz, {}); }
  function saveQuizAnswers(a) { set(K.quiz, a); }
  function clearQuiz() { set(K.quiz, {}); }

  VSP.store = {
    get: get, set: set,
    favs: favs, isFav: isFav, toggleFav: toggleFav, clearFavs: clearFavs,
    quizAnswers: quizAnswers, saveQuizAnswers: saveQuizAnswers, clearQuiz: clearQuiz,
  };
})(window.VSP);