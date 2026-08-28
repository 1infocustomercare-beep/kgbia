import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import MockupLightbox from "@/components/mockups/MockupLightbox";
import { SECTOR_MOCKUPS, type SectorMockupVariant } from "@/data/sector-mockups";

type Selection = {
  sectorId: string;
  sectorLabel: string;
  variants: SectorMockupVariant[];
  index: number;
} | null;

export default function PrestigePortfolio() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [selection, setSelection] = useState<Selection>(null);

  const cards = useMemo(
    () =>
      SECTOR_MOCKUPS.map((g) => {
        const studio = g.variants.filter((v) => v.source === "studio");
        const pool = studio.length ? studio : g.variants;
        const ranked = [...pool].sort(
          (a, b) => (b.screens?.length ?? 1) - (a.screens?.length ?? 1),
        );
        const hero = ranked[0];
        if (!hero) return null;
        return {
          key: `${g.id}-${hero.id}`,
          sectorId: g.id,
          sectorLabel: g.label,
          tagline: g.tagline,
          variants: ranked,
          index: 0,
          hero: hero as SectorMockupVariant,
        };
      }).filter((c): c is NonNullable<typeof c> => c !== null),
    [],
  );

  const sectors = useMemo(
    () =>
      cards
        .map((c) => ({ id: c.sectorId, label: c.sectorLabel, count: c.variants.length }))
        .sort((a, b) => b.count - a.count),
    [cards],
  );

  const chips = useMemo(
    () => [{ id: "all", label: "Tutti i settori", count: cards.length }, ...sectors],
    [cards, sectors],
  );

  const filtered = useMemo(
    () => (filter === "all" ? cards : cards.filter((c) => c.sectorId === filter)),
    [cards, filter],
  );

  const visible = expanded ? filtered : filtered.slice(0, 12);

  const gallery = useMemo(() => {
    const list = visible
      .flatMap((c) => {
        const items = [
          {
            src: c.hero.screen,
            sectorId: c.sectorId,
            sectorLabel: c.sectorLabel,
            brand: c.hero.brand,
            styleId: c.hero.id,
            label: "Home",
            key: `${c.key}-home`,
          },
          ...c.hero.screens
            .filter((s) => !!s.image)
            .slice(1, 4)
            .map((s, i) => ({
              src: s.image,
              sectorId: c.sectorId,
              sectorLabel: c.sectorLabel,
              brand: c.hero.brand,
              styleId: c.hero.id,
              label: s.label,
              key: `${c.key}-screen-${i + 2}`,
            })),
        ];
        return items;
      })
      .filter((i) => i.src);
    return list.slice(0, 15);
  }, [visible]);

  // ---- Coverflow 3D rail (mobile + desktop, stesso effetto) ----
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const rafRef = useRef<number | null>(null);

  const paint = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const railCenter = rail.scrollLeft + rail.clientWidth / 2;
    cardRefs.current.forEach((el) => {
      if (!el) return;
      const cardCenter = el.offsetLeft + el.offsetWidth / 2;
      const raw = (cardCenter - railCenter) / (rail.clientWidth * 0.5);
      const d = Math.max(-1.6, Math.min(1.6, raw));
      const abs = Math.abs(d);
      const rotate = -d * 16;
      const scale = 1 - Math.min(abs, 1) * 0.14;
      const depth = -Math.min(abs, 1.6) * 120;
      el.style.transform = `perspective(1400px) translateZ(${depth}px) rotateY(${rotate}deg) scale(${scale})`;
      el.style.opacity = String(Math.max(0.35, 1 - abs * 0.45));
      el.style.zIndex = String(100 - Math.round(abs * 50));
      const glow = el.querySelector<HTMLElement>("[data-glow]");
      if (glow) glow.style.opacity = String(Math.max(0, 1 - abs * 1.6));
    });
  }, []);

  const schedulePaint = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      paint();
    });
  }, [paint]);

  useEffect(() => {
    const rl = railRef.current;
    const first = cardRefs.current[0];
    if (rl && first) {
      rl.scrollLeft = first.offsetLeft + first.offsetWidth / 2 - rl.clientWidth / 2;
    }
    schedulePaint();
    window.addEventListener("resize", schedulePaint);
    return () => {
      window.removeEventListener("resize", schedulePaint);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [schedulePaint, gallery.length]);

  const nudge = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const step = (cardRefs.current[0]?.offsetWidth ?? 280) + 28;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const rail = (
    <div className="relative mt-12">
      <div
        ref={railRef}
        onScroll={schedulePaint}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain px-[12vw] pb-8 pt-4 [scrollbar-width:none] sm:gap-8 sm:px-[26vw] [&::-webkit-scrollbar]:hidden"
        style={{ perspective: "1400px", scrollBehavior: "smooth" }}
      >
        {gallery.map((item, i) => (
          <figure
            key={item.key}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="group relative h-[58svh] max-h-[560px] min-h-[380px] w-auto flex-none cursor-pointer snap-center overflow-hidden rounded-[2rem] shadow-2xl will-change-transform"
            style={{
              aspectRatio: "9 / 19.5",
              transformStyle: "preserve-3d",
              transition: "transform 220ms linear, opacity 220ms linear",
            }}
            onClick={() => navigate(`/portfolio/${item.sectorId}?style=${item.styleId}`)}
          >
            <img
              src={item.src}
              alt={`${item.brand} — ${item.label}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div
              data-glow
              className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset"
              style={{
                boxShadow: "0 0 60px hsl(var(--pr-gold) / 0.28)",
                // @ts-expect-error css var ring color
                "--tw-ring-color": "hsl(var(--pr-gold) / 0.45)",
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/75" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                {item.sectorLabel}
              </div>
              <div className="text-sm font-semibold text-white sm:text-base">{item.brand}</div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-white/60">
                {item.label}
              </div>
            </div>
          </figure>
        ))}
      </div>

      {/* Controlli */}
      <div className="mt-2 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Mockup precedente"
          onClick={() => nudge(-1)}
          className="pglass-btn-ghost !h-11 !w-11 !min-w-11 !rounded-full !p-0"
        >
          <ChevronLeft size={18} />
        </button>
        <span
          className="text-[11px] uppercase tracking-[0.2em]"
          style={{ color: "hsl(var(--pr-muted-on-light))" }}
        >
          Scorri · {gallery.length} schermate
        </span>
        <button
          type="button"
          aria-label="Mockup successivo"
          onClick={() => nudge(1)}
          className="pglass-btn-ghost !h-11 !w-11 !min-w-11 !rounded-full !p-0"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <section
      id="prestige-mockups"
      data-section="prestige-mockups"
      className="prestige-section prestige-light py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div
              className="prestige-eyebrow flex items-center gap-2"
              style={{ color: "hsl(var(--pr-gold-deep))" }}
            >
              <Sparkles size={12} /> Portfolio · webapp reali su iPhone
            </div>
            <h2
              className="prestige-display mt-3 text-4xl font-semibold sm:text-5xl lg:text-6xl"
              style={{ color: "hsl(var(--pr-text-on-light))" }}
            >
              Casi reali.
              <br />
              <span className="pglass-aqua-text">Decine di stili per settore.</span>
            </h2>
          </div>
          <p
            className="max-w-sm text-sm sm:text-base"
            style={{ color: "hsl(var(--pr-muted-on-light))" }}
          >
            Apri un settore per vedere il caso studio completo: tutti gli stili a confronto, con la
            sequenza integrale delle schermate su iPhone Pro Max.
          </p>
        </div>

        {/* FILTRI PER SETTORE */}
        <div className="mt-8 -mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0">
          <div className="flex w-max items-center gap-2 lg:w-auto lg:flex-wrap">
            {chips.map((c) => {
              const on = filter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFilter(c.id)}
                  aria-pressed={on}
                  className="pglass-chip"
                >
                  {c.label}
                  <span className="pglass-chip-count">{c.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* COVERFLOW 3D — full-bleed */}
      {rail}

      <div className="mx-auto max-w-7xl px-5 lg:px-10">

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => navigate("/portfolio")} className="pglass-btn">
            Portfolio mockup completo <ArrowUpRight size={16} />
          </button>
          <button onClick={() => navigate("/demo")} className="pglass-btn-ghost">
            Siti demo live <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      <MockupLightbox
        open={!!selection}
        onClose={() => setSelection(null)}
        sectorLabel={selection?.sectorLabel ?? ""}
        variants={selection?.variants ?? []}
        initialIndex={selection?.index ?? 0}
      />
    </section>
  );
}
