const CACHE_NAME = 'version1';

importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

// Esto es para que el SW no se quede esperando
self.addEventListener("message", event => {
    if (event.data && event.data.type == "SKIP_WAITING"){
        self.skipWaiting();
    }
});

// Esto lo que hace es "cachear" los recursos a medida que navegamos
workbox.routing.registerRoute(
    new RegExp('/*'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: CACHE_NAME
    })
);