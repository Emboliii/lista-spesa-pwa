const CACHE_NAME = 'lista-della-spesa-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/stile.css',
    '/funzioni.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
    );

});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});