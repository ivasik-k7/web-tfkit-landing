// // TFKit Service Worker v1.0
// const CACHE_NAME = "tfkit-v1.0.0";
// const APP_SHELL_CACHE = "tfkit-shell-v1";

// // Core assets to cache immediately
// const STATIC_ASSETS = [
//   "/",
//   "/index.html",
//   "/manifest.json",
//   "/favicon.ico",
//   "/favicon-32x32.png",
//   "/favicon-16x16.png",
//   "/apple-touch-icon.png",
// ];

// // Install event - cache core assets
// self.addEventListener("install", (event) => {
//   console.log("🛠️ TFKit Service Worker installing...");

//   event.waitUntil(
//     caches
//       .open(APP_SHELL_CACHE)
//       .then((cache) => {
//         console.log("📦 Caching app shell");
//         return cache.addAll(STATIC_ASSETS);
//       })
//       .then(() => {
//         console.log("✅ TFKit Service Worker installed");
//         return self.skipWaiting();
//       })
//   );
// });

// // Activate event - clean up old caches
// self.addEventListener("activate", (event) => {
//   console.log("🎯 TFKit Service Worker activating...");

//   event.waitUntil(
//     caches
//       .keys()
//       .then((cacheNames) => {
//         return Promise.all(
//           cacheNames.map((cacheName) => {
//             // Delete old caches
//             if (cacheName !== CACHE_NAME && cacheName !== APP_SHELL_CACHE) {
//               console.log("🧹 Deleting old cache:", cacheName);
//               return caches.delete(cacheName);
//             }
//           })
//         );
//       })
//       .then(() => {
//         console.log("✅ TFKit Service Worker activated");
//         return self.clients.claim();
//       })
//   );
// });

// // Fetch event - serve from cache, fallback to network
// self.addEventListener("fetch", (event) => {
//   // Skip non-GET requests
//   if (event.request.method !== "GET") return;

//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       // Return cached version if available
//       if (cachedResponse) {
//         return cachedResponse;
//       }

//       return fetch(event.request)
//         .then((response) => {
//           if (
//             !response ||
//             response.status !== 200 ||
//             response.type !== "basic"
//           ) {
//             return response;
//           }

//           const responseToCache = response.clone();

//           caches.open(CACHE_NAME).then((cache) => {
//             if (event.request.url.startsWith(self.location.origin)) {
//               cache.put(event.request, responseToCache);
//             }
//           });

//           return response;
//         })
//         .catch(() => {
//           if (event.request.mode === "navigate") {
//             return caches.match("/index.html");
//           }
//         });
//     })
//   );
// });

// self.addEventListener("message", (event) => {
//   if (event.data && event.data.type === "SKIP_WAITING") {
//     self.skipWaiting();
//   }
// });

// Empty service worker - immediately unregisters itself
self.addEventListener("install", function (e) {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
      .then(function () {
        return self.registration.unregister();
      })
  );
});
