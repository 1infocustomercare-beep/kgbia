/**
 * PremiumMockupGallery — /portfolio replacement gallery.
 *
 * - Sector filter chips
 * - Grid of cards, each card = ONE iPhone Pro Max frame (real webapp inside)
 * - Click any card → MockupLightbox with all variants of that sector
 * - No iPhone-in-iPhone, no double frames
 */

import { useMemo, useState } from "react";
import { Sparkles, Layers } from "lucide-react";
import IPhoneProMaxFrame from "./IPhoneProMaxFrame";
import LiveMockupScreen from "./LiveMockupScreen";
import MockupLightbox from "./MockupLightbox";
import { SECTOR_MOCKUPS, type SectorMockupVariant } from "@/data/sector-mockups";

type Selection = {
  sectorId: string;
  sectorLabel: string;
  variants: SectorMockupVariant[];
  index: number;
} | null;

export default function PremiumMockupGallery() {
  const [activeSector, setActiveSector] = useState<string>("all");
  const [selection, setSelection] = useState<Selection>(null);

  const sectors = useMemo(
    () => [{ id: "all", label: "Tutti" }, ...SECTOR_MOCKUPS.map((s) => ({ id: s.id, label: s.label }))],
    [],
  );

  const cards = useMemo(() => {
    const groups = activeSector === "all" ? SECTOR_MOCKUPS : SECTOR_MOCKUPS.filter((g) => g.id === activeSector);
    return groups.flatMap((g) =>
      g.variants.map((v, i) => ({ ...v, sectorId: g.id, sectorLabel: g.label, group: g, index: i })),
    );
  }, [activeSector]);

  return (
    <section className="min-h-screen overflow-x-hidden bg-[#0a0b12] pb-32 pt-20 text-white sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-10">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/80">
            <Sparkles size={12} />
            Portfolio Empire · webapp reali
          </div>
          <h1 className="font-heading text-3xl font-black leading-[1.05] sm:text-5xl md:text-6xl">
            Un mockup per ogni settore.
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
              Uno stile per ogni esigenza.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            Ogni card è un iPhone Pro Max singolo che mostra la webapp del cliente. Colore, layout, componenti e funzioni sono pensati sul settore. Tocca un mockup per aprirlo a schermo intero e navigare le varianti.
          </p>
        </div>

        {/* Sector filter */}
        <div className="mb-10 flex max-w-full flex-wrap gap-2">
          {sectors.map((s) => {
            const active = s.id === activeSector;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSector(s.id)}
                className="min-h-11 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition sm:px-4 sm:text-xs"
                style={
                  active
                    ? { background: "white", color: "#0a0b12", borderColor: "white" }
                    : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)", borderColor: "rgba(255,255,255,0.15)" }
                }
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((c) => (
            <article key={`${c.sectorId}-${c.id}`} className="group flex flex-col items-center">
              <div
                className="relative flex w-full justify-center"
                onClick={() =>
                  setSelection({
                    sectorId: c.sectorId,
                    sectorLabel: c.sectorLabel,
                    variants: c.group.variants,
                    index: c.index,
                  })
                }
              >
                <div className="transition-transform duration-500 group-hover:-translate-y-1">
                  <IPhoneProMaxFrame
                    alt={`${c.brand} — ${c.style}`}
                    width={typeof window !== "undefined" && window.innerWidth < 390 ? 220 : 240}
                    onClick={() =>
                      setSelection({
                        sectorId: c.sectorId,
                        sectorLabel: c.sectorLabel,
                        variants: c.group.variants,
                        index: c.index,
                      })
                    }
                  >
                    <LiveMockupScreen variant={c} screen={c.screens[0]} compact />
                  </IPhoneProMaxFrame>
                </div>
              </div>

              <div className="mt-5 flex w-full max-w-[280px] flex-col items-center text-center">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
                  {c.sectorLabel}
                </div>
                <h3 className="mt-1 text-base font-semibold text-white">{c.brand}</h3>
                <div className="mt-0.5 text-xs text-white/60">{c.style} · {c.palette}</div>
                {c.group.variants.length > 1 && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/70">
                    <Layers size={10} />
                    {c.group.variants.length} stili
                  </div>
                )}
              </div>
            </article>
          ))}
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
