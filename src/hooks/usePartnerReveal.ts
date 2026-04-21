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

    let root = document.querySelector(rootSelector);
    let rootWatcher: MutationObserver | null = null;
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;

    const setup = (targetRoot: Element) => {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io?.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );

      const scan = () => {
        targetRoot.querySelectorAll<HTMLElement>(".partner-reveal:not(.is-visible)").forEach((el) => {
          io?.observe(el);
        });
      };

      scan();

      // Re-scan when subpages mount/unmount new content
      mo = new MutationObserver(() => scan());
      mo.observe(targetRoot, { childList: true, subtree: true });
    };

    if (root) {
      setup(root);
    } else {
      rootWatcher = new MutationObserver(() => {
        root = document.querySelector(rootSelector);
        if (!root) return;
        rootWatcher?.disconnect();
        setup(root);
      });
      rootWatcher.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      rootWatcher?.disconnect();
      io?.disconnect();
      mo?.disconnect();
    };
  }, [rootSelector]);
}
