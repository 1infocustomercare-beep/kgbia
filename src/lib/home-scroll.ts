/**
 * Single helper for every in-page navigation on the Empire homepage.
 *
 * Why it exists: the home runs Lenis smooth-scroll. Native `href="#id"` jumps
 * and `scrollIntoView()` fight with Lenis, so several CTAs looked "dead" or
 * landed on the wrong block. Some anchors also pointed at ids that no longer
 * exist (`#lead` vs `#prestige-lead`), which made different buttons end up in
 * the same place.
 *
 * `scrollToSection` resolves aliases, offsets for the fixed nav and delegates
 * to Lenis when it is active.
 */
import { peekLenis } from "@/lib/lenis-singleton";

/** Legacy / duplicated ids kept working, mapped to the real section. */
const ALIASES: Record<string, string> = {
  "#lead": "#prestige-lead",
  "#prestige-lead": "#prestige-lead",
  "#contact": "#contatti",
  "#industries": "#sectors",
  "#settori": "#sectors",
  "#mockups": "#portfolio",
  "#prezzi": "#pricing",
  "#hero": "#hero",
};

const NAV_OFFSET = 92;

function resolveTarget(target: string): HTMLElement | null {
  const candidates = [ALIASES[target] ?? target, target, "#prestige-lead", "#contatti"];
  for (const sel of candidates) {
    if (!sel?.startsWith("#")) continue;
    const el = document.querySelector(sel) as HTMLElement | null;
    if (el) return el;
  }
  return null;
}

/** Smooth-scrolls to a homepage section. Returns false when it does not exist. */
export function scrollToSection(target: string, offset = NAV_OFFSET): boolean {
  if (typeof window === "undefined") return false;

  if (target === "#hero" || target === "#top") {
    const lenis = peekLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }

  const el = resolveTarget(target);
  if (!el) return false;

  const lenis = peekLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -offset, duration: 1.2 });
    return true;
  }

  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
  return true;
}
