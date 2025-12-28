const CACHE_NAME = "desc-cache-v3"; // Modifico manifest.json

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        "./",
        "index.html",
        "app.js",
        "style.css",
        "manifest.json"
      ])
    )
  );
  self.skipWaiting(); // fuerza a usar el nuevo SW
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim(); // toma control inmediato
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((resp) => resp || fetch(e.request))
  );
});

