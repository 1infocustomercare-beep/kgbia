import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, Layers } from "lucide-react";
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

type ExtendedFlat = SectorMockupVariant & { sectorId: string; sectorLabel: string };

export default function PrestigePortfolio() {
  const [expanded, setExpanded] = useState(false);
  const [showExtended, setShowExtended] = useState(false);
  const [selection, setSelection] = useState<Selection>(null);
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("prestige-mockups", { steps: 4 });

  // Primary hero card per sector — first PRIMARY variant only (folder-based).
  const heroes = useMemo(
    () =>
      SECTOR_MOCKUPS
        .map((g) => {
          const primary = g.variants.filter((v) => v.tier === "primary");
          return {
            sectorId: g.id,
            sectorLabel: g.label,
            tagline: g.tagline,
            variants: primary.length ? primary : g.variants,
            hero: (primary[0] ?? g.variants[0]) as SectorMockupVariant | undefined,
          };
        })
        .filter((h) => !!h.hero),
    [],
  );
  const visible = expanded ? heroes : heroes.slice(0, 8);

  // Extended collection — all "extended" variants across sectors, deduped
  // against primary brands (case-insensitive brand-name match).
  const extended = useMemo<ExtendedFlat[]>(() => {
    const primaryBrands = new Set(
      SECTOR_MOCKUPS.flatMap((g) =>
        g.variants.filter((v) => v.tier === "primary").map((v) => v.brand.trim().toLowerCase()),
      ),
    );
    return SECTOR_MOCKUPS.flatMap((g) =>
      g.variants
        .filter((v) => v.tier === "extended" && !primaryBrands.has(v.brand.trim().toLowerCase()))
        .map((v) => ({ ...v, sectorId: g.id, sectorLabel: g.label })),
    );
  }, []);

  const openExtended = (v: ExtendedFlat) => {
    const group = SECTOR_MOCKUPS.find((g) => g.id === v.sectorId);
    if (!group) return;
    const variants = group.variants.filter((x) => x.tier === "extended");
    const index = Math.max(0, variants.findIndex((x) => x.id === v.id));
    setSelection({ sectorId: v.sectorId, sectorLabel: v.sectorLabel, variants, index });
  };

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

        {/* PRIMARY GRID — folder-based, curated */}
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((h, i) => (
            <article
              key={h.sectorId}
              className="group flex flex-col items-center"
              style={{ animation: `prestigeSlideUp .7s ${(i % 4) * 0.08}s cubic-bezier(.22,1,.36,1) backwards` }}
            >
              <div className="transition-transform duration-500 group-hover:-translate-y-1">
                <IPhoneProMaxFrame
                  src={h.hero!.screen}
                  alt={`${h.hero!.brand} — ${h.hero!.style}`}
                  width={240}
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
                <h3 className="prestige-display mt-1 text-lg" style={{ color: "hsl(var(--pr-text-on-light))" }}>
                  {h.hero!.brand}
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

        {/* ── EXTENDED COLLECTION ─────────────────────────────────── */}
        {extended.length > 0 && (
          <div className="mt-24 border-t pt-16" style={{ borderColor: "hsl(var(--pr-gold) / 0.25)" }}>
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <div
                  className="prestige-eyebrow flex items-center gap-2"
                  style={{ color: "hsl(var(--pr-gold-deep))" }}
                >
                  <Layers size={12} /> Collezione estesa
                </div>
                <h3
                  className="prestige-display mt-3 text-3xl font-semibold sm:text-4xl md:text-5xl"
                  style={{ color: "hsl(var(--pr-text-on-light))" }}
                >
                  Varianti aggiuntive per ampliare la scelta.
                </h3>
                <p
                  className="mt-3 max-w-2xl text-sm sm:text-base"
                  style={{ color: "hsl(var(--pr-muted-on-light))" }}
                >
                  Stili laterali per palette alternative, sotto-nicchie e concept da mixare. Le varianti duplicate
                  rispetto ai brand principali sono state rimosse: qui trovi solo idee nuove.
                </p>
              </div>
              <button
                onClick={() => setShowExtended((v) => !v)}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
                style={{
                  background: showExtended ? "hsl(var(--pr-emerald))" : "transparent",
                  color: showExtended ? "hsl(var(--pr-gold-light))" : "hsl(var(--pr-emerald))",
                  border: "1px solid hsl(var(--pr-emerald))",
                }}
              >
                {showExtended ? (
                  <>Nascondi <ChevronUp size={16} /></>
                ) : (
                  <>Mostra {extended.length} stili extra <ChevronDown size={16} /></>
                )}
              </button>
            </div>

            {showExtended && (
              <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
                {extended.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => openExtended(v)}
                    className="group flex flex-col items-center text-left focus:outline-none"
                    style={{ animation: `prestigeSlideUp .6s ${(i % 8) * 0.04}s cubic-bezier(.22,1,.36,1) backwards` }}
                  >
                    <IPhoneProMaxFrame
                      src={v.screen}
                      alt={`${v.brand} — ${v.style}`}
                      width={168}
                    />
                    <div className="mt-3 w-full max-w-[200px] text-center">
                      <div
                        className="text-[9px] font-bold uppercase tracking-[0.22em]"
                        style={{ color: "hsl(var(--pr-gold-deep))" }}
                      >
                        {v.sectorLabel}
                      </div>
                      <div
                        className="prestige-display mt-1 text-sm leading-tight"
                        style={{ color: "hsl(var(--pr-text-on-light))" }}
                      >
                        {v.brand}
                      </div>
                      <div
                        className="mt-0.5 text-[10px] uppercase tracking-[0.18em]"
                        style={{ color: "hsl(var(--pr-muted-on-light))" }}
                      >
                        {v.palette}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
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
