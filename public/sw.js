// Kill-switch service worker.
// Replaces the previous vite-plugin-pwa / Workbox app-shell SW that was
// caching old Empire homepages and serving them to returning visitors even
// after the app was rebuilt. Ships at the same path (/sw.js) so browsers
// pick it up on their next SW update check, then it clears the old app
// caches, reloads open tabs onto the fresh build, and unregisters itself.
//
// This app no longer uses Cache Storage. Delete every origin-scoped bucket:
// legacy builds used several changing Workbox prefixes, so filtering by a
// partial name could leave an old index.html/app shell alive.

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.allSettled(cacheNames.map((name) => caches.delete(name)));
        await self.clients.claim();
        if (cacheNames.length > 0) {
          const windowClients = await self.clients.matchAll({ type: "window" });
          await Promise.allSettled(windowClients.map((client) => client.navigate(client.url)));
        }
      } finally {
        await self.registration.unregister();
      }
    })(),
  ),
);

// While alive, do not intercept anything — let the network serve the fresh
// build. No fetch handler = default browser networking.
