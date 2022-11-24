// Chequeo si el Browser soporta Service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js').then((message)=> {
        console.log('Service Worker esta listo!!!');
    });
} else {
    console.log('Service Worker no esta soportado en este browser');
}