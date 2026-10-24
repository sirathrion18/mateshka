/* Матешка: funciona sin conexión. Subí VERSION en cada cambio para que el celu baje la versión nueva. */
const VERSION = "mateshka-v1";
const CORE = ["./", "index.html", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // La página: primero la red (para recibir cambios), si no hay señal, la copia guardada.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(k => k.put("index.html", c)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  // Tipografías y archivos propios: la copia guardada, y se actualiza en segundo plano.
  if (url.origin === location.origin || url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")) {
    e.respondWith(caches.match(req).then(hit => {
      const net = fetch(req).then(r => { if (r.ok || r.type === "opaque") { const c = r.clone(); caches.open(VERSION).then(k => k.put(req, c)); } return r; }).catch(() => hit);
      return hit || net;
    }));
  }
});
