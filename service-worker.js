const CACHE_NAME = 'lista-della-spesa-v7';
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
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
    );

});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if(key !== CACHE_NAME){
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    clients.claim();
})

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});