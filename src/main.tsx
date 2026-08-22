import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { purgeLegacyAppShell } from "./lib/legacy-shell-purge";
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

// Legacy app-shell purge — single source of truth (src/lib/legacy-shell-purge.ts).
// Any old Workbox/PWA service worker on this origin can still serve the OLD
// Empire homepage from Cache Storage after a refresh: unregister + wipe caches,
// then reload exactly once per tab session.
void purgeLegacyAppShell();
