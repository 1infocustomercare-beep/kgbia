import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useEmpireScrollDirector } from "../ScrollDirector";
import IPhoneProMaxFrame from "@/components/mockups/IPhoneProMaxFrame";
import MockupLightbox from "@/components/mockups/MockupLightbox";
import { SECTOR_MOCKUPS, type SectorMockupVariant } from "@/data/sector-mockups";
import {
  ContainerScroll,
  ContainerSticky,
  GalleryContainer,
  GalleryCol,
  ContainerStagger,
  ContainerAnimated,
} from "@/components/ui/container-scroll";

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

        {/* PRIMARY GRID — cinematic 3D scroll gallery */}
        <ContainerScroll className="mt-14 h-[220vh]">
          <ContainerSticky className="flex h-screen items-center justify-center">
            <GalleryContainer className="grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
              {[0, 1, 2, 3].map((colIdx) => {
                const items = visible.filter((_, i) => i % 4 === colIdx);
                const ranges: [string, string][] = [
                  ["0%", "-12%"],
                  ["0%", "-6%"],
                  ["0%", "-16%"],
                  ["0%", "-9%"],
                ];
                // On smaller grids (2/3 cols) hide overflow columns gracefully
                const hideClass =
                  colIdx === 3
                    ? "hidden lg:flex"
                    : colIdx === 2
                    ? "hidden sm:flex"
                    : "flex";
                return (
                  <GalleryCol
                    key={colIdx}
                    yRange={ranges[colIdx]}
                    className={`${hideClass} items-center gap-8`}
                  >
                    {items.map((h) => (
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
                  </GalleryCol>
                );
              })}
            </GalleryContainer>
          </ContainerSticky>
        </ContainerScroll>


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
