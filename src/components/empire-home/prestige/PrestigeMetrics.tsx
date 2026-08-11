/**
 * PrestigeMetrics — fascia numeri REALI con contatori animati.
 *
 * Ispirata alla stats band del competitor (Apps Launched / Clients / Years)
 * ma alimentata dai nostri dati veri: il registry mockup.
 * Nessun numero inventato: tutto derivato da SECTOR_MOCKUPS.
 *
 * ADDITIVO: nuovo componente, nessuna sezione esistente modificata.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { SECTOR_MOCKUPS } from "@/data/sector-mockups";

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

export default function PrestigeMetrics() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const stats = useMemo(() => {
    const sectors = SECTOR_MOCKUPS.length;
    let projects = 0;
    let styles = 0;
    let screens = 0;
    const brands = new Set<string>();
    for (const g of SECTOR_MOCKUPS) {
      for (const v of g.variants) {
        styles += 1;
        screens += v.screens?.length ?? 1;
        brands.add(`${g.id}::${v.brand}`);
      }
    }
    projects = brands.size;
    return { sectors, projects, styles, screens };
  }, []);

  const sectors = useCountUp(stats.sectors, active);
  const projects = useCountUp(stats.projects, active);
  const styles = useCountUp(stats.styles, active);
  const screens = useCountUp(stats.screens, active);

  const items = [
    { value: sectors, suffix: "+", label: "Settori coperti" },
    { value: projects, suffix: "+", label: "Progetti in vetrina" },
    { value: styles, suffix: "+", label: "Stili di design pronti" },
    { value: screens, suffix: "+", label: "Schermate disegnate" },
  ];

  return (
    <section
      ref={ref}
      id="prestige-metrics"
      data-section="prestige-metrics"
      className="prestige-section prestige-dark py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
          {items.map((it) => (
            <div key={it.label} className="flex min-w-0 flex-col items-center gap-2 text-center">
              <span
                className="prestige-display text-4xl leading-none tabular-nums sm:text-5xl lg:text-6xl"
                style={{ color: "hsl(var(--pr-gold-light))" }}
              >
                {it.value}
                <span className="prestige-gold-text">{it.suffix}</span>
              </span>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px]"
                style={{ color: "hsl(var(--pr-muted-on-dark))" }}
              >
                {it.label}
              </span>
            </div>
          ))}
        </div>

        <div
          className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-2 rounded-2xl px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] sm:text-xs"
          style={{
            border: "1px solid hsl(var(--pr-gold) / 0.28)",
            background: "hsl(var(--pr-emerald-deep) / 0.5)",
            color: "hsl(var(--pr-muted-on-dark))",
          }}
        >
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "hsl(var(--pr-gold))" }}
            aria-hidden
          />
          Risposta entro 2–4 ore lavorative · Consulenza senza impegno · Team e hosting in UE
        </div>
      </div>
    </section>
  );
}
