import { useEffect, useRef } from "react";

/**
 * PrestigeScrubBackdrop — sfondo globale della home Prestige.
 *
 * Sobrio ma *interattivo*: nessuna particella / canvas (effetto "screensaver"),
 * solo layer CSS che reagiscono a puntatore e scroll tramite custom properties:
 *  - base gradient profondo (PrestigeTheme)
 *  - due aure diffuse viola/oro in respiro lentissimo, in parallasse col mouse
 *  - spotlight morbido che segue il puntatore (o il touch)
 *  - griglia tecnica finissima con drift di parallasse legato allo scroll
 *  - vignette per il contrasto dei contenuti
 *
 * Un solo rAF passivo, scrittura di 3 CSS vars: costo trascurabile, nessun jank.
 * Rispetta prefers-reduced-motion (resta la composizione statica).
 */
export default function PrestigeScrubBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    const root = document.documentElement;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // target (input) e current (smoothed) per un movimento inerziale elegante
    let tx = 0.5, ty = 0.35, cx = 0.5, cy = 0.35, scroll = 0;
    let raf = 0;
    let dirty = true;

    const onPointer = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth;
      ty = e.clientY / window.innerHeight;
      dirty = true;
    };
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scroll = Math.min(1, window.scrollY / max);
      dirty = true;
    };

    const tick = () => {
      if (dirty) {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        root.style.setProperty("--pr-mx", cx.toFixed(4));
        root.style.setProperty("--pr-my", cy.toFixed(4));
        root.style.setProperty("--pr-scroll", scroll.toFixed(4));
        if (Math.abs(tx - cx) < 0.0015 && Math.abs(ty - cy) < 0.0015) dirty = false;
      }
      raf = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className="prestige-scrub-backdrop" aria-hidden="true">
      <div className="prestige-scrub-aura prestige-scrub-aura--violet" />
      <div className="prestige-scrub-aura prestige-scrub-aura--gold" />
      <div className="prestige-scrub-grid" />
      <div className="prestige-scrub-spot" />
      <div className="prestige-scrub-vignette" />
    </div>
  );
}
