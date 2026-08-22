import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
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

  const left = gallery.filter((_, i) => [0, 3, 6, 9, 12].includes(i));
  const middle = gallery.filter((_, i) => [1, 4, 7].includes(i));
  const right = gallery.filter((_, i) => [2, 5, 8, 11, 14].includes(i));

  const FigureCard = ({
    item,
    index,
    layout,
    tall,
  }: {
    item: (typeof gallery)[number];
    index: number;
    layout?: "left" | "right" | "center";
    tall?: boolean;
  }) => {
    const delay = layout === "center" ? (index % 3) * 0.12 : (index % 5) * 0.08;
    return (
      <motion.figure
        key={item.key}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        className="group relative w-full cursor-pointer overflow-hidden rounded-2xl"
        style={{ aspectRatio: tall ? "9 / 16" : "9 / 19.5" }}
        onClick={() => navigate(`/portfolio/${item.sectorId}?style=${item.styleId}`)}
      >
        <img
          src={item.src}
          alt={`${item.brand} — ${item.label}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/80">
            {item.sectorLabel}
          </div>
          <div className="text-sm font-semibold text-white sm:text-base">{item.brand}</div>
        </div>
      </motion.figure>
    );
  };

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

        {/* Mobile: flat 2-col masonry */}
        <div className="mx-auto mt-14 max-w-7xl px-1 sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            {gallery.map((item, i) => (
              <motion.figure
                key={item.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: (i % 4) * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative w-full cursor-pointer overflow-hidden rounded-xl"
                style={{ aspectRatio: "9 / 19.5" }}
                onClick={() => navigate(`/portfolio/${item.sectorId}?style=${item.styleId}`)}
              >
                <img
                  src={item.src}
                  alt={`${item.brand} — ${item.label}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/80">
                    {item.sectorLabel}
                  </div>
                  <div className="text-xs font-semibold text-white">{item.brand}</div>
                </div>
              </motion.figure>
            ))}
          </div>
        </div>

        {/* Desktop: sticky masonry gallery */}
        <div className="relative mx-auto mt-14 hidden max-w-7xl grid-cols-12 gap-5 px-4 pb-16 sm:grid lg:gap-7 lg:px-8">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-20"
            style={{
              background:
                "linear-gradient(to right, hsl(var(--pr-gold) / 0.10) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--pr-gold) / 0.10) 1px, transparent 1px)",
              backgroundSize: "54px 54px",
              maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
            }}
          />

          {/* Left column */}
          <div className="grid gap-5 sm:col-span-4 lg:gap-7">
            {left.map((item, i) => (
              <FigureCard key={item.key} item={item} index={i} layout="left" tall />
            ))}
          </div>

          {/* Middle sticky column */}
          <div className="relative sm:col-span-4">
            <div className="sticky top-28 grid h-[calc(100svh-8rem)] grid-rows-3 gap-5 lg:gap-7">
              {middle.map((item, i) => (
                <FigureCard key={item.key} item={item} index={i} layout="center" />
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="grid gap-5 sm:col-span-4 lg:gap-7">
            {right.map((item, i) => (
              <FigureCard key={item.key} item={item} index={i} layout="right" tall />
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {filtered.length > 12 && (
            <button onClick={() => setExpanded((v) => !v)} className="pglass-btn-ghost">
              {expanded ? (
                <>
                  Mostra meno <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Vedi tutti i {filtered.length} settori <ChevronDown size={16} />
                </>
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
