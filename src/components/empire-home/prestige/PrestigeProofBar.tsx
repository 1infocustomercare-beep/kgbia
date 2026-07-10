import { useEffect, useRef, useState } from "react";

/**
 * PrestigeProofBar — sottile fascia di prova sociale onesta.
 * Numeri consentiti: 4.9/5 · 3.500+ aziende · setup 7 giorni.
 * Counter animato all'ingresso in viewport.
 */
function useCountUp(target: number, run: boolean, duration = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased * 10) / 10);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return n;
}

export default function PrestigeProofBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (e) => e.forEach((x) => x.isIntersecting && setRun(true)),
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const rating = useCountUp(4.9, run, 1200);
  const clients = useCountUp(3500, run, 1600);
  const days = useCountUp(7, run, 900);

  const Item = ({ big, label }: { big: string; label: string }) => (
    <div className="flex flex-col items-center gap-1 text-center min-w-0">
      <span
        className="prestige-display text-3xl sm:text-4xl md:text-5xl leading-none"
        style={{ color: "hsl(var(--pr-text-on-light))" }}
      >
        {big}
      </span>
      <span
        className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-semibold"
        style={{ color: "hsl(var(--pr-muted-on-light))" }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <section
      id="proof"
      data-section="prestige-proof-bar"
      className="prestige-section prestige-light py-10 sm:py-14 border-y"
      style={{ borderColor: "hsl(var(--pr-gold) / 0.22)" }}
    >
      <div
        ref={ref}
        className="mx-auto grid max-w-5xl grid-cols-3 gap-4 px-4 sm:gap-10 sm:px-8"
      >
        <Item big={rating.toFixed(1) + "/5"} label="Valutazione media" />
        <Item
          big={new Intl.NumberFormat("it-IT").format(Math.round(clients)) + "+"}
          label="Aziende attive"
        />
        <Item big={Math.round(days) + " giorni"} label="Setup medio" />
      </div>
    </section>
  );
}
