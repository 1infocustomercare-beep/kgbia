// Kill-switch service worker.
// Replaces the previous vite-plugin-pwa / Workbox app-shell SW that was
// caching old Empire homepages and serving them to returning visitors even
// after the app was rebuilt. Ships at the same path (/sw.js) so browsers
// pick it up on their next SW update check, then it clears the old app
// caches, reloads open tabs onto the fresh build, and unregisters itself.
//
// Cache Storage is origin-scoped, so we ONLY delete caches this SW created
// (Workbox precache/runtime buckets scoped to this registration). Other
// origin caches (Firebase Messaging, OneSignal, etc.) are left alone.

function isWorkboxCacheForThisRegistration(name) {
  const hasWorkboxBucket = /(^|-)precache-v\d+-|(^|-)runtime-|(^|-)googleAnalytics-/.test(name);
  return hasWorkboxBucket && name.endsWith(self.registration.scope);
}

// Also nuke the named runtime caches the previous vite.config used, since
// they were created by our own old SW and are safe to remove regardless of
// suffix matching.
const LEGACY_APP_CACHE_NAMES = new Set([
  "pages-runtime",
  "static-runtime",
  "media-runtime",
  "fonts-runtime",
]);

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const toDelete = cacheNames.filter(
          (name) => isWorkboxCacheForThisRegistration(name) || LEGACY_APP_CACHE_NAMES.has(name),
        );
        await Promise.allSettled(toDelete.map((name) => caches.delete(name)));
        await self.clients.claim();
        const windowClients = await self.clients.matchAll({ type: "window" });
        await Promise.allSettled(windowClients.map((client) => client.navigate(client.url)));
      } finally {
        await self.registration.unregister();
      }
    })(),
  ),
);

// While alive, do not intercept anything — let the network serve the fresh
// build. No fetch handler = default browser networking.
