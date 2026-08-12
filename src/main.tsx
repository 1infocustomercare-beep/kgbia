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

// Universal cleanup: any service worker still registered on this origin can
// serve a cached (old) Empire homepage after a refresh. Unregister every SW
// and drop app-shell caches on ALL hosts (dev, preview, iframe, production),
// then reload once so the fresh build takes over.
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  const RELOAD_FLAG = "empire_sw_purged_v1";
  navigator.serviceWorker
    .getRegistrations()
    .then(async (regs) => {
      if (!regs.length) return;
      await Promise.allSettled(regs.map((r) => r.unregister()));
      if ("caches" in window) {
        const names = await caches.keys();
        await Promise.allSettled(
          names
            .filter((n) => /precache|runtime|workbox|pages|static|media|fonts/i.test(n))
            .map((n) => caches.delete(n)),
        );
      }
      if (!sessionStorage.getItem(RELOAD_FLAG)) {
        sessionStorage.setItem(RELOAD_FLAG, "1");
        window.location.reload();
      }
    })
    .catch(() => undefined);
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


