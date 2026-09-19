// Guarda la app en el móvil para que abra aunque no haya cobertura.
// Si cambias index.html, sube también este archivo cambiando la versión.
const CACHE = "compra-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const put = res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; };

  if (url.origin === location.origin) {
    // Primero la red (para recibir mejoras); si no hay, lo guardado.
    e.respondWith(fetch(e.request).then(put).catch(() =>
      caches.match(e.request).then(r => r || caches.match("./index.html"))));
  } else if ((url.hostname === "www.gstatic.com" && url.pathname.startsWith("/firebasejs/")) ||
             url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    // Librerías y tipografía: lo guardado primero.
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(put)));
  }
});
