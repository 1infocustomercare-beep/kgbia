import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEmpireScrollDirector } from "../ScrollDirector";
import IPhoneProMaxFrame from "@/components/mockups/IPhoneProMaxFrame";
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
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("prestige-mockups", { steps: 4 });
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 0.35], [45, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.92, 1]);

  // UNA CARD PER OGNI IDENTITÀ STUDIO — la home mostra tutti i mockup premium
  // generati dal nostro studio (le varianti reference restano su /portfolio).
  const cards = useMemo(
    () =>
      SECTOR_MOCKUPS.flatMap((g) => {
        const primary = g.variants.filter((v) => v.tier === "primary" && v.source === "studio");
        return primary.map((v, i) => ({
          key: `${g.id}-${v.id}`,
          sectorId: g.id,
          sectorLabel: g.label,
          tagline: v.description || g.tagline,
          variants: primary,
          index: i,
          hero: v as SectorMockupVariant,
        }));
      }),
    [],
  );

  const sectors = useMemo(() => {
    const map = new Map<string, { id: string; label: string; count: number }>();
    cards.forEach((c) => {
      const row = map.get(c.sectorId) ?? { id: c.sectorId, label: c.sectorLabel, count: 0 };
      row.count += 1;
      map.set(c.sectorId, row);
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [cards]);

  /** Chip di filtro per settore con conteggio stili. */
  const chips = useMemo(
    () => [{ id: "all", label: "Tutti", count: cards.length }, ...sectors],
    [cards, sectors],
  );

  const filtered = useMemo(
    () => (filter === "all" ? cards : cards.filter((c) => c.sectorId === filter)),
    [cards, filter],
  );
  const visible = expanded ? filtered : filtered.slice(0, 12);


  return (
    <section
      ref={ref}
      id="prestige-mockups"
      data-section="prestige-mockups"
      className="prestige-section prestige-light py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="prestige-eyebrow flex items-center gap-2" style={{ color: "hsl(var(--pr-gold-deep))" }}>
              <Sparkles size={12} /> Portfolio · webapp reali su iPhone
            </div>
            <h2
              className="prestige-display mt-3 text-4xl font-semibold sm:text-5xl lg:text-6xl"
              style={{ color: "hsl(var(--pr-text-on-light))" }}
            >
              Casi reali.
              <br />
              <span className="prestige-gold-text">Uno stile per settore.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm sm:text-base" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
            Tocca un mockup per vederlo a schermo intero e navigare tutte le varianti stilistiche pensate per quel settore.
          </p>
        </div>

        {/* FILTRI PER SETTORE con conteggio stili */}
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
                  className="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all"
                  style={{
                    background: on ? "hsl(var(--pr-emerald))" : "transparent",
                    color: on ? "hsl(var(--pr-gold-light))" : "hsl(var(--pr-text-on-light))",
                    border: `1px solid ${on ? "hsl(var(--pr-gold) / 0.45)" : "hsl(var(--pr-emerald) / 0.28)"}`,
                  }}
                >
                  {c.label}
                  <span
                    className="rounded-full px-1.5 text-[10px] tabular-nums"
                    style={{
                      background: on ? "hsl(var(--pr-gold) / 0.25)" : "hsl(var(--pr-emerald) / 0.1)",
                      color: on ? "hsl(var(--pr-gold-light))" : "hsl(var(--pr-emerald))",
                    }}
                  >
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>


        {/* PRIMARY GRID — cinematic 3D reveal + column parallax */}
        <div
          ref={gridRef}
          className="mt-14"
          style={{ perspective: "1400px" }}
        >
          <motion.div
            style={{
              rotateX,
              scale,
              transformOrigin: "center top",
              transformStyle: "preserve-3d",
            }}
            className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6"
          >
            {visible.map((h) => (
                    <article
                      key={h.key}
                      className="group flex w-full flex-col items-center"
                    >
                      <div className="relative transition-transform duration-500 group-hover:-translate-y-1">
                        <IPhoneProMaxFrame
                          src={h.hero!.screen}
                          alt={`${h.hero!.brand} — ${h.hero!.style}`}
                          width={220}
                          onClick={() => navigate(`/portfolio/${h.sectorId}?style=${h.hero!.id}`)}
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background: "hsl(var(--pr-gold))",
                            color: "hsl(var(--pr-emerald-deep))",
                          }}
                        >
                          Vedi il caso
                        </span>
                      </div>

                      {/* Anteprime schermate collegate (Menu / Dettaglio / Prenota) */}
                      {h.hero!.screens?.length > 1 && (
                        <div className="mt-3 flex items-center justify-center gap-2">
                          {h.hero!.screens.slice(1, 4).map((s, si) => (
                            <button
                              key={s.image}
                              type="button"
                              title={s.label}
                              onClick={() =>
                                setSelection({
                                  sectorId: h.sectorId,
                                  sectorLabel: h.sectorLabel,
                                  variants: h.variants,
                                  index: h.index,
                                })
                              }
                              className="overflow-hidden rounded-[10px] transition-transform duration-300 hover:-translate-y-0.5"
                              style={{
                                width: 46,
                                height: 92,
                                border: "1px solid hsl(var(--pr-gold) / 0.3)",
                                background: "hsl(var(--pr-emerald-deep))",
                                animationDelay: `${si * 60}ms`,
                              }}
                            >
                              <img
                                src={s.image}
                                alt={`${h.hero!.brand} — ${s.label}`}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover object-top"
                              />
                            </button>
                          ))}
                        </div>
                      )}


                      <div className="mt-4 flex w-full max-w-[280px] flex-col items-center text-center">
                        <div
                          className="text-[10px] font-bold uppercase tracking-[0.24em]"
                          style={{ color: "hsl(var(--pr-gold-deep))" }}
                        >
                          {h.sectorLabel}
                        </div>
                        <h3
                          className="prestige-display mt-1 text-lg"
                          style={{ color: "hsl(var(--pr-text-on-light))" }}
                        >
                          {h.hero!.brand}
                        </h3>
                        <p
                          className="mt-1 text-xs leading-snug"
                          style={{ color: "hsl(var(--pr-muted-on-light))" }}
                        >
                          {h.tagline}
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate(`/portfolio/${h.sectorId}?style=${h.hero!.id}`)}
                          className="mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all hover:gap-2"
                          style={{
                            background: "hsl(var(--pr-gold) / 0.18)",
                            color: "hsl(var(--pr-gold-deep))",
                            border: "1px solid hsl(var(--pr-gold) / 0.35)",
                          }}
                        >
                          {h.variants.length > 1
                            ? `Confronta ${h.variants.length} stili`
                            : "Apri il caso studio"}
                          <ArrowUpRight size={11} />
                        </button>

                      </div>
                    </article>
            ))}
          </motion.div>
        </div>



        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {filtered.length > 12 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all"
              style={{
                background: "hsl(var(--pr-emerald))",
                color: "hsl(var(--pr-gold-light))",
                border: "1px solid hsl(var(--pr-gold) / 0.35)",
              }}
            >
              {expanded ? (
                <>Mostra meno <ChevronUp size={16} /></>
              ) : (
                <>Vedi tutti i {filtered.length} mockup <ChevronDown size={16} /></>
              )}
            </button>
          )}
          <button
            onClick={() => navigate("/demo")}
            className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:gap-3"
            style={{
              background: "hsl(var(--pr-gold))",
              color: "hsl(var(--pr-emerald-deep))",
              border: "1px solid hsl(var(--pr-gold) / 0.6)",
              boxShadow: "0 14px 40px -18px hsl(var(--pr-gold) / 0.7)",
            }}
          >
            Apri i siti demo live <ArrowUpRight size={16} />
          </button>
          <button
            onClick={() => navigate("/portfolio")}
            className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:gap-3"
            style={{
              background: "transparent",
              color: "hsl(var(--pr-emerald-deep))",
              border: "1px solid hsl(var(--pr-emerald) / 0.45)",
            }}
          >
            Portfolio mockup completo <ArrowUpRight size={16} />
          </button>
        </div>


        {/* Homepage = solo studio mockups Empire. Le varianti Lowengeld/reference vivono su /portfolio. */}
      </div>

      <MockupLightbox
        open={!!selection}
        onClose={() => setSelection(null)}
        sectorLabel={selection?.sectorLabel ?? ""}
        variants={selection?.variants ?? []}
        initialIndex={selection?.index ?? 0}
      />

      <style>{`
        @keyframes prestigeSlideUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
