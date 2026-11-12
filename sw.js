/* service worker — offline-first app shell + assets cache.
   Bump CACHE_VERSION whenever you change any file. */
const CACHE_VERSION = "vsp-v16";

const VIAL_PHOTOS = [
  "assets/vials/LPG003.jpg","assets/vials/LPG004.jpg","assets/vials/LPG005.jpg",
  "assets/vials/LPG006.jpg","assets/vials/LPG008.jpg","assets/vials/LPG015.jpg",
  "assets/vials/LPG021.jpg","assets/vials/LPG026.jpg","assets/vials/LPG033.jpg",
  "assets/vials/LPG036.jpg","assets/vials/LPG037.jpg","assets/vials/LPG042.jpg",
  "assets/vials/LPG043A.jpg","assets/vials/LPG043B.jpg","assets/vials/LPG049.jpg",
  "assets/vials/LPG050.jpg","assets/vials/LPG051.jpg","assets/vials/LPG055.jpg",
  "assets/vials/LPG056.jpg","assets/vials/LPG060.jpg","assets/vials/LPG064.jpg",
  "assets/vials/LPG065.jpg","assets/vials/LPG066.jpg","assets/vials/LPG069.jpg",
  "assets/vials/LPG078.jpg",
];

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./theme.js",
  "./config.js",
  "./data.js",
  "./css/styles.css",
  "./js/i18n.js",
  "./js/store.js",
  "./js/audio.js",
  "./js/icons.js",
  "./js/share.js",
  "./js/cards.js",
  "./js/ratio-mixer.js",
  "./js/quiz.js",
  "./js/screens.js",
  "./js/attract.js",
  "./js/kiosk.js",
  "./js/motes.js",
  "./js/ambience.js",
  "./js/app.js",
  "./assets/logo.svg",
  "./assets/fonts/serif-400.woff",
  "./assets/fonts/serif-700.woff",
  "./assets/fonts/serif-400i.woff",
  "./assets/fonts/script-400.woff",
  "./assets/fonts/song-400.woff",
  "./assets/fonts/brush-400.woff",
  "./assets/fonts/kai-400.woff",
  "./assets/fonts/hei-400.woff",
  "./assets/fonts/hei-700.woff",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/qr/vsp-wechat.jpg",
].concat(VIAL_PHOTOS);

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(function (cache) { return cache.addAll(APP_SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys
          .filter(function (k) { return k !== CACHE_VERSION; })
          .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

/* cache-first for everything (vials, fonts, QRs); no network calls ever. */
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(function (cache) {
          try { cache.put(e.request, copy); } catch (err) { /* opaque responses: ignore */ }
        });
        return res;
      }).catch(function () {
        return caches.match("./index.html");
      });
    })
  );
});