import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
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
  const gridRef = useRef<HTMLDivElement>(null);

  /**
   * Effetto "deck 3D": la griglia si raddrizza entrando nel viewport.
   * La profondità è più marcata su desktop e volutamente lieve su mobile:
   * così l'effetto rimane visibile ovunque senza creare overflow.
   */
  const reduceMotion = useReducedMotion();
  const [deck3d, setDeck3d] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const sync = () => setDeck3d(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "start 35%"],
  });
  const eased = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const rotateX = useTransform(eased, [0, 1], [12, 0]);
  const deckScale = useTransform(eased, [0, 1], [0.975, 1]);
  const deckOpacity = useTransform(eased, [0, 0.32], [0.55, 1]);
  const use3d = deck3d && !reduceMotion;

  // UNA CARD PER SETTORE — la home mostra il mockup migliore (sequenza più
  // completa) di ogni settore e rimanda al caso studio con tutti gli stili a
  // confronto. Le varianti reference restano su /portfolio.
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

  /** Chip di filtro per settore con conteggio stili disponibili. */
  const chips = useMemo(
    () => [{ id: "all", label: "Tutti i settori", count: cards.length }, ...sectors],
    [cards, sectors],
  );


  const filtered = useMemo(
    () => (filter === "all" ? cards : cards.filter((c) => c.sectorId === filter)),
    [cards, filter],
  );
  const visible = expanded ? filtered : filtered.slice(0, 12);


  return (
    <section
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
              <span className="pglass-aqua-text">Decine di stili per settore.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm sm:text-base" style={{ color: "hsl(var(--pr-muted-on-light))" }}>
            Apri un settore per vedere il caso studio completo: tutti gli stili a confronto, con la sequenza
            integrale delle schermate su iPhone Pro Max.

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
                  className="pglass-chip"
                >
                  {c.label}
                  <span className="pglass-chip-count">{c.count}</span>
                </button>
              );
            })}

          </div>
        </div>


        {/* PRIMARY GRID — cinematic 3D reveal + column parallax */}
        <div
          ref={gridRef}
          className="mt-14 overflow-hidden"
          style={use3d ? { perspective: "1500px", perspectiveOrigin: "50% 0%" } : undefined}
        >
          <motion.div
            style={
              use3d
                ? {
                    rotateX,
                    scale: deckScale,
                    opacity: deckOpacity,
                    transformOrigin: "center top",
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                  }
                : undefined
            }
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
             {visible.map((h, cardIndex) => (
              <motion.article
                key={h.key}
                 initial={{ opacity: 0, y: 34, rotateY: cardIndex % 2 === 0 ? -4 : 4 }}
                 whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                 viewport={{ once: true, amount: 0.08, margin: "0px 0px -3% 0px" }}
                 transition={{ duration: 0.65, delay: (cardIndex % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group pglass-soft flex w-full flex-col items-center p-5"
              >
                <div className="relative transition-transform duration-500">
                  <IPhoneProMaxFrame
                    src={h.hero!.screen}
                    alt={`${h.hero!.brand} — ${h.hero!.style}`}
                    width={210}
                    onClick={() => navigate(`/portfolio/${h.sectorId}?style=${h.hero!.id}`)}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--pr-aqua) / 0.95), hsl(var(--pr-aqua-deep)))",
                      color: "hsl(0 0% 100%)",
                      boxShadow: "0 10px 26px -12px hsl(var(--pr-aqua) / 0.8)",
                    }}
                  >
                    Vedi il caso
                  </span>
                </div>

                {/* Anteprime schermate collegate (Menu / Dettaglio / Prenota) */}
                {h.hero!.screens?.length > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {h.hero!.screens.filter((s) => !!s.image).slice(1, 4).map((s) => (
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
                        className="overflow-hidden rounded-[12px] transition-transform duration-300 hover:-translate-y-0.5"
                        style={{
                          width: 46,
                          height: 92,
                          border: "1px solid hsl(var(--pr-aqua) / 0.3)",
                          background: "hsl(var(--pr-emerald-deep))",
                          boxShadow: "0 10px 22px -14px hsl(var(--pr-aqua-deep) / 0.7)",
                        }}
                      >
                        <img
                          src={s.image}
                          alt={`${h.hero!.brand} — ${s.label}`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover object-top"
                          onError={(e) => { (e.currentTarget.closest("button") as HTMLElement | null)?.style.setProperty("display", "none"); }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex w-full flex-col items-center text-center">
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.24em]"
                    style={{ color: "hsl(var(--pr-aqua-deep))" }}
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
                    className="mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold transition-all hover:gap-2"
                    style={{
                      background: "hsl(var(--pr-aqua) / 0.12)",
                      color: "hsl(var(--pr-aqua-deep))",
                      border: "1px solid hsl(var(--pr-aqua) / 0.32)",
                    }}
                  >
                    {h.variants.length > 1
                      ? `Confronta ${h.variants.length} stili`
                      : "Apri il caso studio"}
                    <ArrowUpRight size={11} />
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>



        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {filtered.length > 12 && (
            <button onClick={() => setExpanded((v) => !v)} className="pglass-btn-ghost">
              {expanded ? (
                <>Mostra meno <ChevronUp size={16} /></>
              ) : (
                <>Vedi tutti i {filtered.length} settori <ChevronDown size={16} /></>
              )}
            </button>
          )}
          <button onClick={() => navigate("/portfolio")} className="pglass-btn">
            Portfolio mockup completo <ArrowUpRight size={16} />
          </button>
          <button onClick={() => navigate("/demo")} className="pglass-btn-ghost">
            Siti demo live <ArrowUpRight size={16} />
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
