/* Service worker — cache statique versionné, priorité au cache */
const CACHE = "plaidoyer-ultime-v1";
const FICHIERS = [
  "./", "./index.html", "./css/styles.css", "./js/data.js", "./js/atelier.js", "./js/app.js",
  "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(cles => Promise.all(cles.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(rep =>
      rep || fetch(e.request).then(net => {
        // met en cache les polices et autres GET même origine ou fonts
        const url = new URL(e.request.url);
        if (net.ok && (url.origin === location.origin || url.hostname.includes("fonts."))) {
          const copie = net.clone();
          caches.open(CACHE).then(c => c.put(e.request, copie));
        }
        return net;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
