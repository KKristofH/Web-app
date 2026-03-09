const CACHE_NAME = 'galeria-cache-v13';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './appstore.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

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
    }).then(() => self.clients.claim())
  );
});

// Agresszív offline stratégia
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 1. Ha megvan a fájl a memóriában, azonnal adjuk vissza (OFFLINE mód)
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // 2. Ha nincs meg, megpróbáljuk letölteni a netről
      return fetch(event.request).catch(() => {
        // 3. HA A NET HALOTT (vagy repülőn vagy), és egy oldalt próbál betölteni az iOS, 
        // erőszakkal adjuk vissza neki az index.html-t.
        if (event.request.mode === 'navigate' || event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
