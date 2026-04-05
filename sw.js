const CACHE_NAME = 'mg-nav-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/mardi-gras-deck-plan.pdf', // Your local PDF
  // Add your compiled JS/CSS paths here
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
