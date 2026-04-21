import { useEffect } from "react";

/**
 * Auto-reveal hook: observes all `.partner-reveal` elements within the partner shell
 * and toggles `is-visible` when they enter the viewport. Pure CSS handles the animation.
 * Skips when prefers-reduced-motion is enabled (CSS already neutralizes the styles).
 *
 * Mounted once at the layout level — covers every partner subpage automatically.
 */
export function usePartnerReveal(rootSelector = ".partner-mobile-content-safe") {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.querySelector(rootSelector);
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const scan = () => {
      root.querySelectorAll<HTMLElement>(".partner-reveal:not(.is-visible)").forEach((el) => {
        io.observe(el);
      });
    };

    scan();

    // Re-scan when subpages mount/unmount new content
    const mo = new MutationObserver(() => scan());
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [rootSelector]);
}
