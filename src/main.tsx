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

// Universal cleanup (v3): any service worker or Cache Storage entry left on
// this origin can still serve an OLD Empire homepage after a refresh.
// This pass unregisters every SW and deletes EVERY cache on the origin, on all
// hosts (dev, preview, iframe, production), then reloads after a successful
// purge so the fresh build definitively takes over.
if (typeof window !== "undefined") {
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

    if (foundStale) window.location.reload();
  })();
}

// Kill-switch: register the cleanup worker on every production origin,
// including preview hosts. This is essential because the duplicate legacy
// home was being served specifically from preview-origin app-shell caches.
if (typeof window !== "undefined" && "serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).catch(() => undefined);
  });
}


