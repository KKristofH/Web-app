const CACHE_NAME = 'galeria-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './sw.js'
];

// Telepítéskor elmenti a fájlokat a telefon gyorsítótárába
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Amikor megnyitod az appot, a gyorsítótárból tölti be a net helyett
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Ha megvan a telefonon, onnan adja, ha nincs, csak akkor megy a netre
        return response || fetch(event.request);
      })
  );
});

// Feleslegessé vált régi cache-ek törlése
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
