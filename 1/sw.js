/* Service worker — précache, puis réseau d'abord pour le HTML,
   cache d'abord pour les ressources statiques. */
const VERSION = 'atelier-plaidoyer-v2.0.0';
const RESSOURCES = [
  './', './index.html', './manifest.webmanifest',
  './css/app.css',
  './js/app.js', './js/store.js', './js/ui.js', './js/views.js', './js/ateliers.js', './js/content.js',
  './assets/fonts/bricolage-var.woff2', './assets/fonts/publicsans-var.woff2', './assets/fonts/jetbrains-var.woff2',
  './icons/icone.svg', './icons/icone-192.png', './icons/icone-512.png', './icons/icone-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(RESSOURCES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(cles => Promise.all(cles.filter(c => c !== VERSION).map(c => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  const estPage = req.mode === 'navigate';
  if (estPage) {
    e.respondWith(
      fetch(req).then(r => {
        const copie = r.clone();
        caches.open(VERSION).then(c => c.put(req, copie));
        return r;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cache => cache || fetch(req).then(r => {
      if (r.ok && r.type === 'basic') {
        const copie = r.clone();
        caches.open(VERSION).then(c => c.put(req, copie));
      }
      return r;
    }))
  );
});
