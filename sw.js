/* Service worker — cache-first, mise à jour en arrière-plan */
const VERSION = 'atelier-plaidoyer-v1';
const RESSOURCES = [
  './',
  './index.html',
  './styles.css',
  './data.js',
  './app.js',
  './manifest.webmanifest',
  './icons/icone.svg',
  './icons/icone-192.png',
  './icons/icone-512.png',
  './icons/icone-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(RESSOURCES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cles => Promise.all(cles.filter(c => c !== VERSION).map(c => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(rep => {
      const reseau = fetch(e.request).then(r => {
        if (r && r.status === 200 && r.type === 'basic') {
          const copie = r.clone();
          caches.open(VERSION).then(c => c.put(e.request, copie));
        }
        return r;
      }).catch(() => rep || caches.match('./index.html'));
      return rep || reseau;
    })
  );
});
