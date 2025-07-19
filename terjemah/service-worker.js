const CACHE_NAME = 'poster-quran-v10'; // 🔥 Ganti versi biar refresh
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  // Tambahkan file JS, CSS, font, gambar, dll jika perlu
];

self.addEventListener('install', event => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Precaching files');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // ⬅️ Paksa SW baru aktif segera
});

self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Hapus cache lama:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim(); // ⬅️ Kontrol semua tab segera
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // 👍 Pakai cache
      }
      return fetch(event.request); // 🌐 Fallback ke network
    })
  );
});
