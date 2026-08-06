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

  // Primary hero card per sector — first PRIMARY studio variant only. Homepage
  // shows ONLY our own studio mockups (Lowengeld/reference variants live on
  // /portfolio, never here).
  const heroes = useMemo(
    () =>
      SECTOR_MOCKUPS
        .map((g) => {
          const primary = g.variants.filter((v) => v.tier === "primary" && v.source === "studio");
          return {
            sectorId: g.id,
            sectorLabel: g.label,
            tagline: g.tagline,
            variants: primary,
            hero: primary[0] as SectorMockupVariant | undefined,
          };
        })
        .filter((h) => !!h.hero),
    [],
  );
  /** Chip di filtro per settore con conteggio stili (come la barra categorie del competitor). */
  const chips = useMemo(
    () => [
      { id: "all", label: "Tutti", count: heroes.reduce((n, h) => n + h.variants.length, 0) },
      ...heroes.map((h) => ({ id: h.sectorId, label: h.sectorLabel, count: h.variants.length })),
    ],
    [heroes],
  );

  const filtered = useMemo(
    () => (filter === "all" ? heroes : heroes.filter((h) => h.sectorId === filter)),
    [heroes, filter],
  );
  const visible = expanded || filter !== "all" ? filtered : filtered.slice(0, 8);


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
              className="prestige-display mt-3 text-4xl font-semibold sm:text-5xl md:text-6xl"
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
                      key={h.sectorId}
                      className="group flex w-full flex-col items-center"
                    >
                      <div className="transition-transform duration-500 group-hover:-translate-y-1">
                        <IPhoneProMaxFrame
                          src={h.hero!.screen}
                          alt={`${h.hero!.brand} — ${h.hero!.style}`}
                          width={220}
                          onClick={() =>
                            setSelection({
                              sectorId: h.sectorId,
                              sectorLabel: h.sectorLabel,
                              variants: h.variants,
                              index: 0,
                            })
                          }
                        />
                      </div>
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
                        {h.variants.length > 1 && (
                          <div
                            className="mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{
                              background: "hsl(var(--pr-gold) / 0.18)",
                              color: "hsl(var(--pr-gold-deep))",
                              border: "1px solid hsl(var(--pr-gold) / 0.35)",
                            }}
                          >
                            {h.variants.length} stili premium
                          </div>
                        )}
                      </div>
                    </article>
            ))}
          </motion.div>
        </div>



        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {heroes.length > 8 && (
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
                <>Vedi tutti i {heroes.length} settori <ChevronDown size={16} /></>
              )}
            </button>
          )}
          <button
            onClick={() => navigate("/portfolio")}
            className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:gap-3"
            style={{
              background: "transparent",
              color: "hsl(var(--pr-emerald-deep))",
              border: "1px solid hsl(var(--pr-emerald) / 0.45)",
            }}
          >
            Vedi tutti i siti demo <ArrowUpRight size={16} />
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
