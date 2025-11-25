// =============================
//   SERVICE WORKER v3.6 PRO
//   قاموس الطالب — أبو عبدالله
//   يدعم PWA / Offline بالكامل
// =============================

const CACHE_NAME = "dictionary-app-v3.7";
const CORE_ASSETS = [
  "/", 
  "/index.html",
  "/students.html",
  "/dictionary.html",
  "/quiz.html",
  "/help.html",
  "/about.html",
  "/splash.html",
  "/styles.css",
  "/modals.js",
  "/manifest.json",
  "/icons/app-icon.png",
  "/icons/app-icon-192.png",
  "/icons/app-icon-512.png"
];

// =============================
//  تثبيت Service Worker
// =============================
self.addEventListener("install", event => {
  console.log("Service Worker installed");

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );

  // تفعيل التحديث مباشرة بدون انتظار
  self.skipWaiting();
});

// =============================
//  تفعيل Service Worker
// =============================
self.addEventListener("activate", event => {
  console.log("Service Worker activated");

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );

  self.clients.claim();
});

// =============================
//  إستراتيجية الجلب: cache-first
// =============================
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      // عاد من الكاش إن وجد
      if (cacheRes) return cacheRes;

      // لو مش موجود، نجلب من الشبكة ونخزّنه
      return fetch(event.request)
        .then(networkRes => {
          return caches.open(CACHE_NAME).then(cache => {
            // لا نخزن طلبات غير آمنة أو تحوي errors
            if (event.request.url.startsWith("http")) {
              cache.put(event.request, networkRes.clone());
            }
            return networkRes;
          });
        })
        .catch(() => {
          // لو Offline بالكامل
          if (event.request.url.endsWith(".html")) {
            return caches.match("/index.html");
          }
        });
    })
  );
});

