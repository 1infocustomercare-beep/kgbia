/**
 * Single source of truth for killing the legacy Empire app-shell.
 *
 * Historically the project shipped a vite-plugin-pwa / Workbox service worker.
 * Any browser that visited the app back then can still be controlled by that
 * worker and be served the OLD homepage ("Il tuo business potenziato dall'AI")
 * from Cache Storage, even after a fresh build is deployed.
 *
 * Previously the same purge logic existed in three places (main.tsx and twice
 * in App.tsx) with different rules, and the purge reloaded the page without a
 * guard — which could loop. This module centralises it:
 *   1. unregister every service worker on the origin
 *   2. delete every Cache Storage bucket on the origin
 *   3. reload ONCE (guarded by sessionStorage) so the network build takes over
 */

const PURGE_FLAG = "empire.legacyShellPurged";

const alreadyPurged = () => {
  try {
    return window.sessionStorage.getItem(PURGE_FLAG) === "1";
  } catch {
    return false;
  }
};

const markPurged = () => {
  try {
    window.sessionStorage.setItem(PURGE_FLAG, "1");
  } catch {
    // storage unavailable (private mode / sandboxed iframe) — fine
  }
};

export async function purgeLegacyAppShell(): Promise<void> {
  if (typeof window === "undefined") return;

  let foundStale = false;

  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      if (regs.length > 0) {
        foundStale = true;
        await Promise.allSettled(regs.map((r) => r.unregister()));
      }
    }
  } catch {
    // ignore
  }

  try {
    if ("caches" in window) {
      const names = await caches.keys();
      if (names.length > 0) {
        foundStale = true;
        await Promise.allSettled(names.map((n) => caches.delete(n)));
      }
    }
  } catch {
    // ignore
  }

  if (!foundStale) return;

  // Reload at most once per tab session: without this guard a worker that
  // re-registers itself would put the tab in an endless reload cycle.
  if (alreadyPurged()) return;
  markPurged();
  window.location.reload();
}
