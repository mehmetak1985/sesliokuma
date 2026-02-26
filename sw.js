const CACHE_NAME = 'minik-okur-v1';
const ASSETS = [
  '/sesliokuma/',
  '/sesliokuma/index.html',
  '/sesliokuma/manifest.json',
  '/sesliokuma/icon-192.png',
  '/sesliokuma/icon-512.png',
  '/sesliokuma/screenshot-mobile.png',
  '/sesliokuma/screenshot-desktop.png'
];

// Kurulum: Dosyaları önbelleğe al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Aktivasyon: Eski önbellekleri temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// İstekleri Yakalama: Önce önbelleğe bak, yoksa internetten getir
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
