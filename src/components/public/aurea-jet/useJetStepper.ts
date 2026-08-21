/**
 * ═══ JET STEPPER ═══
 * Comportamento unificato per tutte le sezioni "a passi" del sito Aurea Jet:
 * - avanzamento legato allo scroll (la sezione avanza mentre attraversa il viewport)
 * - swipe / drag orizzontale su mobile e desktop per andare avanti o indietro
 * - autoplay opzionale finché la sezione è a schermo, si ferma alla prima interazione
 *
 * ADDITIVO — solo presentazione/interazione.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, useScroll } from "framer-motion";

type Options = {
  count: number;
  initial?: number;
  /** ms tra un passo e l'altro; 0 = autoplay disattivato */
  autoplayMs?: number;
  /** lega l'indice al progresso di scroll della sezione */
  scrollLinked?: boolean;
  /** distanza minima in px per validare uno swipe */
  threshold?: number;
};

export function useJetStepper<T extends HTMLElement = HTMLElement>({
  count,
  initial = 0,
  autoplayMs = 0,
  scrollLinked = true,
  threshold = 48,
}: Options) {
  const ref = useRef<T | null>(null);
  const [index, setIndex] = useState(initial);
  const [engaged, setEngaged] = useState(false); // true dopo la prima interazione manuale
  const reduced = useReducedMotion();
  const inView = useInView(ref, { margin: "-25% 0px -25% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const go = useCallback(
    (next: number) => {
      setEngaged(true);
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  /* Autoplay finché la sezione è visibile e nessuno ha interagito */
  useEffect(() => {
    if (!autoplayMs || engaged || !inView || reduced) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, engaged, inView, reduced, count]);

  /* Scroll-linked: mappa il progresso della sezione sull'indice */
  useEffect(() => {
    if (!scrollLinked || engaged) return;
    const unsub = scrollYProgress.on("change", (p) => {
      // finestra centrale 0.25 → 0.85 per non scattare troppo presto
      const t = Math.min(1, Math.max(0, (p - 0.25) / 0.6));
      const i = Math.min(count - 1, Math.floor(t * count));
      setIndex((cur) => (cur === i ? cur : i));
    });
    return unsub;
  }, [scrollLinked, engaged, scrollYProgress, count]);

  /* Swipe / drag orizzontale */
  const drag = useRef({ active: false, x: 0, y: 0 });
  const swipeHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      drag.current = { active: true, x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.active = false;
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) next();
      else prev();
    },
    onPointerCancel: () => {
      drag.current.active = false;
    },
    style: { touchAction: "pan-y" as const },
  };

  return { ref, index, setIndex: go, next, prev, engaged, inView, reduced, swipeHandlers, scrollYProgress };
}
