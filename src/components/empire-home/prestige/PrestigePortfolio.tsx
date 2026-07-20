import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useEmpireScrollDirector } from "../ScrollDirector";
import IPhoneProMaxFrame from "@/components/mockups/IPhoneProMaxFrame";
import LiveMockupScreen from "@/components/mockups/LiveMockupScreen";
import MockupLightbox from "@/components/mockups/MockupLightbox";
import { SECTOR_MOCKUPS, type SectorMockupVariant } from "@/data/sector-mockups";

type Selection = {
  sectorId: string;
  sectorLabel: string;
  variants: SectorMockupVariant[];
  index: number;
} | null;

export default function PrestigePortfolio() {
  const [expanded, setExpanded] = useState(false);
  const [selection, setSelection] = useState<Selection>(null);
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("prestige-mockups", { steps: 4 });

  // Hero card per sector (variant 0). Show 8 by default, all when expanded.
  const heroes = useMemo(
    () =>
      SECTOR_MOCKUPS.map((g) => ({
        sectorId: g.id,
        sectorLabel: g.label,
        tagline: g.tagline,
        variants: g.variants,
        hero: g.variants[0],
      })),
    [],
  );
  const visible = expanded ? heroes : heroes.slice(0, 8);

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

        {/* Grid */}
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((h, i) => (
            <article
              key={h.sectorId}
              className="group flex flex-col items-center"
              style={{ animation: `prestigeSlideUp .7s ${(i % 4) * 0.08}s cubic-bezier(.22,1,.36,1) backwards` }}
            >
              <div className="transition-transform duration-500 group-hover:-translate-y-1">
                <IPhoneProMaxFrame
                  alt={`${h.hero.brand} — ${h.hero.style}`}
                  width={220}
                  onClick={() =>
                    setSelection({
                      sectorId: h.sectorId,
                      sectorLabel: h.sectorLabel,
                      variants: h.variants,
                      index: 0,
                    })
                  }
                >
                  <LiveMockupScreen variant={h.hero} screen={h.hero.screens[0]} />
                </IPhoneProMaxFrame>
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
                  {h.hero.brand}
                </h3>
                <p className="mt-1 text-xs leading-snug" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
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
        </div>

        {heroes.length > 8 && (
          <div className="mt-14 flex justify-center">
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
          </div>
        )}
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
