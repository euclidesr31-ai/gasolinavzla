const CACHE_NAME = 'gasvzla-v2';
// Lista de archivos que la app necesita para vivir offline
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;700&display=swap'
];

// 1. Instalar y Guardar en Caché
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cacheando archivos críticos...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Fuerza a que el nuevo SW tome el control
});

// 2. Activar y limpiar versiones viejas
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. Responder aunque no haya internet
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      // Si el archivo está en caché, úsalo. Si no, búscalo en internet.
      return cacheRes || fetch(evt.request).catch(() => {
        // Si fallan ambos (offline y no está en caché), opcionalmente podrías mostrar una página de error
        console.log('Error de red y no está en caché');
      });
    })
  );
});
