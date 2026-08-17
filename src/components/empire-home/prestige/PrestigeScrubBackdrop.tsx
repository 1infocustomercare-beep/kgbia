import { useEffect, useRef, useState } from "react";
import { applyPerfTier } from "@/lib/perf-tier";

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
  const [tier, setTier] = useState<"lite" | "full">("full");

  useEffect(() => {
    const el = rootRef.current;
    const root = document.documentElement;
    if (!el) return;

    // Classe del dispositivo: su hardware modesto niente spotlight/grain/blur.
    const current = applyPerfTier();
    setTier(current);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const trackPointer = current === "full" && !coarsePointer;

    // target (input) e current (smoothed) per un movimento inerziale elegante
    let tx = 0.5, ty = 0.35, cx = 0.5, cy = 0.35, scroll = 0;
    let raf = 0;
    let running = false;

    const write = () => {
      root.style.setProperty("--pr-mx", cx.toFixed(4));
      root.style.setProperty("--pr-my", cy.toFixed(4));
      root.style.setProperty("--pr-scroll", scroll.toFixed(4));
    };

    /**
     * rAF *autoterminante*: gira solo mentre c'è davvero movimento da
     * interpolare. A riposo il loop si spegne e la GPU/CPU tornano libere
     * (prima girava a 60fps per tutta la vita della pagina).
     */
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      write();
      if (Math.abs(tx - cx) < 0.0015 && Math.abs(ty - cy) < 0.0015) {
        running = false;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth;
      ty = e.clientY / window.innerHeight;
      kick();
    };

    // Lo scroll aggiorna una sola custom property: scrittura diretta,
    // coalescata dal browser, senza entrare nel loop di interpolazione.
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        scroll = Math.min(1, window.scrollY / max);
        root.style.setProperty("--pr-scroll", scroll.toFixed(4));
      });
    };

    write();
    if (trackPointer) window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (trackPointer) window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      // cleanup: non lasciare custom properties orfane su <html>
      root.style.removeProperty("--pr-mx");
      root.style.removeProperty("--pr-my");
      root.style.removeProperty("--pr-scroll");
    };
  }, []);

  const lite = tier === "lite";

  return (
    <div ref={rootRef} className="prestige-scrub-backdrop" aria-hidden="true">
      <div className="prestige-scrub-aura prestige-scrub-aura--violet" />
      <div className="prestige-scrub-aura prestige-scrub-aura--gold" />
      <div className="prestige-scrub-grid" />
      {/* Spotlight in mix-blend-mode: costa un layer full-screen ricomposto a
          ogni movimento → montato solo su dispositivi "full" con puntatore fine. */}
      {!lite && <div className="prestige-scrub-spot" />}
      <div className="prestige-scrub-vignette" />
    </div>
  );
}
