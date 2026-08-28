import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IPhoneProMaxFrame from "@/components/mockups/IPhoneProMaxFrame";
import { SECTOR_MOCKUPS } from "@/data/sector-mockups";

export default function PrestigeIndustries() {
  const navigate = useNavigate();
  const [active, setActive] = useState<string>(SECTOR_MOCKUPS[0]?.id ?? "");

  const sectors = SECTOR_MOCKUPS;
  const selected = useMemo(
    () => sectors.find((s) => s.id === active) ?? sectors[0],
    [active, sectors],
  );

  const hero = useMemo(() => {
    if (!selected) return null;
    const studio = selected.variants.filter(
      (v) => v.source === "studio" || v.tier === "primary",
    );
    const pool = studio.length ? studio : selected.variants;
    const ranked = [...pool].sort(
      (a, b) => (b.screens?.length ?? 1) - (a.screens?.length ?? 1),
    );
    return ranked[0] ?? null;
  }, [selected]);

  return (
    <section
      id="sectors"
      data-section="prestige-industries"
      className="prestige-section prestige-dark"
    >
      <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-16 sm:px-5 sm:pt-24 lg:px-10">
        <div className="text-center">
          <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
            <Sparkles size={12} className="mr-1 inline-block" /> Il caso tuo
          </div>
          <h2 className="prestige-display mt-3 text-3xl font-semibold sm:text-4xl lg:text-6xl">
            Empire parla la lingua del{" "}
            <span className="prestige-gold-text italic">tuo settore</span>
          </h2>
          <div className="prestige-divider mx-auto mt-4 sm:mt-5" />
          <p
            className="mx-auto mt-4 max-w-2xl text-sm sm:text-base md:text-lg"
            style={{ color: "hsl(var(--pr-muted-on-dark))" }}
          >
            Esplora i settori. Ogni mockup è un prodotto navigabile pensato per risolvere i
            problemi della tua giornata-tipo.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-8 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {sectors.map((s) => {
              const on = active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(s.id)}
                  className="rounded-full px-4 py-2 text-sm font-medium transition-all"
                  style={
                    on
                      ? {
                          background: "hsl(var(--pr-gold))",
                          color: "hsl(var(--pr-emerald-deep))",
                        }
                      : {
                          background: "hsl(0 0% 100% / 0.05)",
                          color: "hsl(var(--pr-muted-on-dark))",
                        }
                  }
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Showcase */}
      <div className="mx-auto mt-10 max-w-6xl px-4 pb-20 sm:px-5 lg:px-10">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md text-center lg:text-left"
          >
            <div
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "hsl(var(--pr-gold-light))" }}
            >
              {selected.label}
            </div>
            <h3
              className="prestige-display mt-2 text-2xl font-semibold sm:text-3xl"
              style={{ color: "hsl(var(--pr-text-on-dark))" }}
            >
              {hero?.brand ?? "Prossimamente"}
            </h3>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "hsl(var(--pr-muted-on-dark))" }}
            >
              {selected.tagline}
            </p>
            {hero?.description && (
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: "hsl(var(--pr-muted-on-dark))" }}
              >
                {hero.description}
              </p>
            )}
            {hero && (
              <button
                type="button"
                onClick={() => navigate(`/portfolio?sector=${selected.id}&style=${hero.id}`)}
                className="pglass-btn mt-6"
              >
                Vedi il caso studio <ArrowUpRight size={16} />
              </button>
            )}
          </motion.div>

          <motion.div
            key={hero?.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0"
          >
            {hero && (
              <IPhoneProMaxFrame
                src={hero.screen}
                alt={`${hero.brand} — ${hero.style}`}
                width={260}
                onClick={() => navigate(`/portfolio?sector=${selected.id}&style=${hero.id}`)}
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
