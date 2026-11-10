// Service worker Rekapan Tagihan: supaya aplikasi bisa dibuka saat offline
var C = 'rekapan-v2';
self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(function (c) { return c.addAll(['./','manifest.json','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png']); }).catch(function () {}));
});
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var u = new URL(r.url);
  if (u.hostname === 'script.google.com' || u.hostname.endsWith('googleusercontent.com')) return;
  e.respondWith(
    fetch(r).then(function (res) {
      if (res && (res.ok || res.type === 'opaque')) { var cp = res.clone(); caches.open(C).then(function (c) { c.put(r, cp); }); }
      return res;
    }).catch(function () {
      return caches.match(r, { ignoreSearch: true })
        .then(function (m) { return m || caches.match('./'); })
        .then(function (m) { return m || caches.match('index.html'); });
    })
  );
});
