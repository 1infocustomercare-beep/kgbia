/**
 * PrestigeStyleGallery — "Tutti gli stili · esplora e apri la demo"
 *
 * Directory premium browsabile: chip per settore + griglia di iPhone
 * mockup (uno per variante). Al click apre il sito demo live del settore.
 * Additiva: usa il registro esistente SECTOR_MOCKUPS.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Filter, Sparkles } from "lucide-react";
import PrestigePhone from "./PrestigePhone";
import { useT } from "./PrestigeLang";
import { SECTOR_MOCKUPS, type SectorMockupVariant } from "@/data/sector-mockups";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { getPublicSiteBasePath } from "@/lib/public-site-path";
import type { IndustryId } from "@/config/industry-config";

type FlatVariant = SectorMockupVariant & {
  sectorId: string;
  sectorLabel: string;
  demoHref: string | null;
};

function buildAll(): FlatVariant[] {
  return SECTOR_MOCKUPS.flatMap((g) => {
    const slug = DEMO_SLUGS[g.id as IndustryId];
    const base = getPublicSiteBasePath(g.id);
    const href = slug ? `/${base}/${slug}` : null;
    return g.variants
      .filter((v) => v.tier === "primary")
      .map((v) => ({
        ...v,
        sectorId: g.id,
        sectorLabel: g.label,
        demoHref: href,
      }));
  });
}

function VariantCard({ v, i, onOpen }: { v: FlatVariant; i: number; onOpen: (v: FlatVariant) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setVisible(true), io.unobserve(el)),
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      onClick={() => onOpen(v)}
      className="group relative flex flex-col items-center text-center transition-all duration-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--pr-gold))] rounded-[36px]"
      style={{
        transitionDelay: `${(i % 8) * 60}ms`,
        opacity: visible ? 1 : 0,
        transform: visible
          ? `translateY(0) perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
          : "translateY(28px)",
      }}
      onPointerMove={(e) => {
        const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width - 0.5;
        const my = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ rx: -my * 6, ry: mx * 8 });
      }}
      onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
    >
      {/* iPhone senza riquadro */}
      <div className="transition-transform duration-500 group-hover:-translate-y-1">
        <PrestigePhone src={v.screen} alt={`${v.brand} — ${v.style}`} width={200} loading="lazy" />
      </div>

      {/* meta sotto al telefono */}
      <div className="mt-6 w-full max-w-[240px]">
        <span
          className="inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em]"
          style={{
            color: "hsl(var(--pr-gold-light))",
            background: "hsl(var(--pr-emerald-deep) / 0.6)",
            border: "1px solid hsl(var(--pr-gold) / 0.3)",
          }}
        >
          {v.sectorLabel}
        </span>
        <h3
          className="prestige-italic mt-3 text-lg leading-tight"
          style={{ color: "hsl(var(--pr-text-on-dark))", fontFamily: "'Playfair Display', serif" }}
        >
          {v.brand}
        </h3>
        <p
          className="mt-1 text-[11px] uppercase tracking-[0.22em]"
          style={{ color: "hsl(var(--pr-gold-light))" }}
        >
          {v.style} · {v.palette}
        </p>
        <p
          className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed"
          style={{ color: "hsl(var(--pr-muted-on-dark))" }}
        >
          {v.description}
        </p>
        <div
          className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] opacity-90 transition-all duration-500 group-hover:opacity-100"
          style={{
            color: "hsl(var(--pr-emerald-deep))",
            background:
              "linear-gradient(90deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold)))",
          }}
        >
          <ArrowUpRight size={12} /> Apri demo live
        </div>
      </div>
    </button>
  );
}

export default function PrestigeStyleGallery() {
  const t = useT();
  const all = useMemo(() => buildAll(), []);
  const sectors = useMemo(
    () => [{ id: "all", label: "Tutti" }, ...SECTOR_MOCKUPS.map((g) => ({ id: g.id, label: g.label }))],
    [],
  );
  const [active, setActive] = useState<string>("all");
  const [openedFor, setOpenedFor] = useState<string | null>(null);

  const visible = useMemo(
    () => (active === "all" ? all : all.filter((v) => v.sectorId === active)),
    [active, all],
  );

  const openDemo = (v: FlatVariant) => {
    if (!v.demoHref) return;
    setOpenedFor(v.id);
    window.open(v.demoHref, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      data-section="prestige-style-gallery"
      className="prestige-section prestige-dark relative overflow-hidden"
      style={{ paddingTop: "clamp(72px, 9svh, 112px)", paddingBottom: "clamp(72px, 9svh, 112px)" }}
    >
      {/* atmosferici */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 10%, hsl(var(--pr-gold) / 0.10), transparent 60%), radial-gradient(60% 40% at 80% 90%, hsl(var(--pr-emerald-glow) / 0.15), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* eyebrow */}
        <div className="mx-auto mb-6 flex items-center justify-center gap-2">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em]"
            style={{
              color: "hsl(var(--pr-gold-light))",
              borderColor: "hsl(var(--pr-gold) / 0.4)",
              background: "hsl(var(--pr-emerald-mid) / 0.4)",
            }}
          >
            <Sparkles size={12} />
            {t({ it: "Archivio stili", en: "Style archive" })}
          </span>
        </div>

        {/* headline */}
        <h2
          className="prestige-display text-center"
          style={{
            fontSize: "clamp(2rem, 5.4vw, 4.2rem)",
            color: "hsl(var(--pr-text-on-dark))",
          }}
        >
          {t({ it: "Tutti gli stili che abbiamo creato.", en: "Every style we've crafted." })}
          <span
            className="prestige-italic mt-2 block"
            style={{ fontSize: "clamp(1.1rem, 3vw, 2.2rem)", color: "hsl(var(--pr-gold-light))" }}
          >
            {t({ it: "Scegli, clicca, apri la demo live.", en: "Pick, click, open the live demo." })}
          </span>
        </h2>

        <p
          className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed"
          style={{ color: "hsl(var(--pr-muted-on-dark))" }}
        >
          {t({
            it: "Ogni variante è un progetto reale del nostro studio: palette, tipografia e struttura studiate per il settore. Cliccala per aprire il sito navigabile in una nuova scheda.",
            en: "Each variant is real Empire work: palette, typography and structure tailored to the industry. Click to open the navigable site in a new tab.",
          })}
        </p>

        {/* filter chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span
            className="mr-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.24em]"
            style={{ color: "hsl(var(--pr-muted-on-dark))" }}
          >
            <Filter size={12} /> {t({ it: "Filtra", en: "Filter" })}
          </span>
          {sectors.map((s) => {
            const on = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className="rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] transition-all"
                style={{
                  color: on ? "hsl(var(--pr-emerald-deep))" : "hsl(var(--pr-gold-light))",
                  borderColor: on ? "hsl(var(--pr-gold))" : "hsl(var(--pr-gold) / 0.3)",
                  background: on
                    ? "linear-gradient(90deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold)))"
                    : "hsl(var(--pr-emerald-mid) / 0.35)",
                  boxShadow: on ? "0 10px 30px -14px hsl(var(--pr-gold) / 0.7)" : "none",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((v, i) => (
            <VariantCard key={v.id} v={v} i={i} onOpen={openDemo} />
          ))}
        </div>

        {openedFor && (
          <p
            className="mt-6 text-center text-[11px] uppercase tracking-[0.24em]"
            style={{ color: "hsl(var(--pr-gold-light))" }}
            aria-live="polite"
          >
            {t({ it: "Demo aperta in una nuova scheda", en: "Demo opened in a new tab" })}
          </p>
        )}
      </div>
    </section>
  );
}
