import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@fontsource/urbanist/400.css";
import "@fontsource/urbanist/600.css";
import "@fontsource/urbanist/800.css";
import "@fontsource/urbanist/900.css";
import "@fontsource/epilogue/300.css";
import "@fontsource/epilogue/400.css";
import "@fontsource/epilogue/500.css";
import "@fontsource/epilogue/600.css";
import "@fontsource/dm-serif-display/400.css";
import "@fontsource/fira-sans/300.css";
import "@fontsource/fira-sans/400.css";
import "@fontsource/fira-sans/500.css";
import "@fontsource/fira-sans/600.css";
import "@fontsource/fira-sans/700.css";




// Performance: ensure root renders immediately
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}

// Universal cleanup (v2): any service worker or Cache Storage entry left on
// this origin can still serve an OLD Empire homepage after a refresh.
// This pass unregisters every SW and deletes EVERY cache on the origin, on all
// hosts (dev, preview, iframe, production), then reloads once per browser
// (localStorage flag) so the fresh build definitively takes over.
if (typeof window !== "undefined") {
  const PURGE_FLAG = "empire_cache_purge_v2";
  const alreadyPurged = (() => {
    try {
      return localStorage.getItem(PURGE_FLAG) === "1";
    } catch {
      return false;
    }
  })();

  (async () => {
    let foundStale = false;
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        if (regs.length) {
          foundStale = true;
          await Promise.allSettled(regs.map((r) => r.unregister()));
        }
      }
      if ("caches" in window) {
        const names = await caches.keys();
        if (names.length) {
          foundStale = true;
          await Promise.allSettled(names.map((n) => caches.delete(n)));
        }
      }
    } catch {
      // ignore
    }

    if (!alreadyPurged) {
      try {
        localStorage.setItem(PURGE_FLAG, "1");
      } catch {}
      if (foundStale) window.location.reload();
    }
  })();
}

// Kill-switch: force registration of /sw.js on production so returning
// visitors (even without an existing SW) fetch the cleanup worker, which
// clears legacy caches, reloads open tabs onto the fresh build, and then
// unregisters itself. Skipped in dev, iframes, and Lovable preview hosts.
if (typeof window !== "undefined" && "serviceWorker" in navigator && import.meta.env.PROD) {
  const host = window.location.hostname;
  const inIframe = window.self !== window.top;
  const isPreview =
    host.startsWith("id-preview--") ||
    host.startsWith("preview--") ||
    host === "lovableproject.com" ||
    host.endsWith(".lovableproject.com") ||
    host === "lovableproject-dev.com" ||
    host.endsWith(".lovableproject-dev.com") ||
    host === "beta.lovable.dev" ||
    host.endsWith(".beta.lovable.dev");
  if (!inIframe && !isPreview) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    });
  }
}


