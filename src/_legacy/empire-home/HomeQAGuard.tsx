import { useEffect } from "react";

/**
 * HomeQAGuard
 * - Cattura errori runtime (Error / unhandledrejection) e li logga con tag [HomeQA]
 *   per facilitare il debug di crash GSAP/TypeError nella home cinematografica.
 * - Failsafe visibilità: dopo 1.5s e di nuovo a 3s, rimuove opacity:0 / visibility:hidden
 *   da tutti gli elementi marcati con data-hero-*, data-pcard, data-orbit-card,
 *   data-w3card, data-sector-card, data-sector-frame, data-pheading, data-matrix-title.
 *   Se GSAP non è riuscito a settarli (HMR, race, throw), restano comunque visibili.
 * - Non distrugge animazioni in corso: agisce solo se opacity computed = 0.
 */
export default function HomeQAGuard() {
  useEffect(() => {
    const tag = "[HomeQA]";

    const onError = (e: ErrorEvent) => {
      // eslint-disable-next-line no-console
      console.warn(tag, "runtime error:", e.message, e.error);
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      // eslint-disable-next-line no-console
      console.warn(tag, "unhandled rejection:", e.reason);
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    const SELECTORS = [
      "[data-hero-word]",
      "[data-hero-sub]",
      "[data-hero-cta]",
      "[data-hero-meta]",
      "[data-hero-grid]",
      "[data-hero-orb]",
      "[data-hero-preview]",
      "[data-hero-content]",
      "[data-pcard]",
      "[data-pheading]",
      "[data-orbit-card]",
      "[data-w3card]",
      "[data-sector-card]",
      "[data-sector-frame]",
      "[data-matrix-title]",
    ].join(",");

    const forceVisible = () => {
      try {
        const nodes = document.querySelectorAll<HTMLElement>(SELECTORS);
        let healed = 0;
        nodes.forEach((node) => {
          const cs = window.getComputedStyle(node);
          const hidden =
            cs.opacity === "0" ||
            cs.visibility === "hidden" ||
            (cs.transform && cs.transform.includes("matrix") && parseFloat(cs.opacity) < 0.05);
          if (hidden) {
            node.style.opacity = "1";
            node.style.visibility = "visible";
            // Non resettiamo transform per non sfasare animazioni valide;
            // ma se è stato lasciato un translateY enorme, lo riportiamo a 0.
            if (cs.transform && cs.transform !== "none") {
              const m = cs.transform.match(/matrix.*\(([^)]+)\)/);
              if (m) {
                const parts = m[1].split(",").map((v) => parseFloat(v.trim()));
                const ty = parts[parts.length - 1];
                if (Math.abs(ty) > 200) node.style.transform = "none";
              }
            }
            healed++;
          }
        });
        if (healed > 0) {
          // eslint-disable-next-line no-console
          console.info(tag, `forced visibility on ${healed} hidden element(s).`);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(tag, "forceVisible failed:", err);
      }
    };

    const t1 = window.setTimeout(forceVisible, 1500);
    const t2 = window.setTimeout(forceVisible, 3000);
    const t3 = window.setTimeout(forceVisible, 6000);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return null;
}
