/* ============================================================
   Velveteen's Secret Potions — La Perfuma Goloso booth app
   CONFIG — brand strings, asset paths, tunables.
   Swap QR codes, photos and copy here; no code changes needed.
   ============================================================ */

window.VSP_CONFIG = {
  brand: {
    studio_en: "Velveteen's Secret Potions",
    studio_zh: "天鹅绒的秘方药房",                       // REVIEW: native speaker
    line_en: "La Perfuma Goloso by VSP",
    line_zh: "VSP 出品 · 贪婪之香",                      // REVIEW: native speaker
    collection_en: "The VSPellbinding Eightfold",
    collection_zh: "八重诱惑",
    subtitle_en: "Love-potion oils & elixir balms",
    subtitle_zh: "爱情魔油 ~ 灵药香脂",
    incantation_en: "Yeelorya!",
    incantation_zz: "耶洛里亚!",
  },

  // Brand assets — swap files at these paths (see README).
  assets: {
    logo: "assets/logo.svg",
    vialPhoto: "assets/vials/{ID}.jpg",   // {ID} = vial id, e.g. LPG003
    qr: "assets/qr/vsp-wechat.jpg", // verified VSP WeChat Official Account QR
  },

  // Featured "Seasons set" four-vial bundle (ids are editable).
  seasons: [
    { id: "LPG042", key: "spring" },
    { id: "LPG060", key: "summer" },
    { id: "LPG069", key: "autumn" },
    { id: "LPG078", key: "winter" },
  ],

  // Booth behaviour tunables.
  kiosk: {
    attractIdleSeconds: 45,   // no-touch delay before attract mode
    attractSlideSeconds: 7,   // seconds per vial in attract loop
    adminHoldSeconds: 3,      // long-press on logo to reveal admin reset
    cursorHidden: true,       // hide mouse cursor in kiosk mode
  },

  audio: {
    toneSeconds: 4.4,         // scent-driven incantation duration
    fadeSeconds: 0.4,         // fade in / out
    gain: 0.12,               // master volume (0..1, kept low)
    foldAboveHz: 2000,        // frequencies above this get folded down
    foldTargetMaxHz: 1000,    // ...into the 200–1000 Hz range
    foldTargetMinHz: 200,
  },

  // localStorage keys (no data ever leaves the device).
  storageKeys: {
    lang: "vsp.lang",
    theme: "vsp.theme",
    favorites: "vsp.favorites",
    quiz: "vsp.quiz",
  },
};