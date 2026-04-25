/**
 * Portfolio Public Showcase — stile Lowengeld Agency.
 * Hero "Our Work / Portfolio" + chip categorie + griglia card a 2 iPhone.
 * Click su una card → apre <ProjectDetailOverlay /> con tutti i dettagli.
 *
 * Mobile-first, layout centrato, sfondo coerente con il tema dark dell'app.
 */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { PORTFOLIO_PROJECTS } from "@/data/portfolio-showcase-data";
import { SECTOR_PORTFOLIO } from "@/data/sector-mockup-images";

/* ─────────── Categorie macro (chip header — ispirate a Lowengeld) ─────────── */
type Category =
  | "Tutti"
  | "Food"
  | "Hospitality"
  | "Beauty"
  | "Travel"
  | "Health"
  | "Services"
  | "Retail"
  | "Education"
  | "Sport";

const CATEGORY_MAP: Record<IndustryId, Exclude<Category, "Tutti">> = {
  food: "Food",
  hospitality: "Hospitality",
  agriturismo: "Hospitality",
  hotel: "Hospitality" as any,
  beach: "Travel",
  beauty: "Beauty",
  tattoo: "Beauty",
  ncc: "Travel",
  fitness: "Sport",
  healthcare: "Health",
  veterinary: "Health",
  childcare: "Health",
  plumber: "Services",
  electrician: "Services",
  cleaning: "Services",
  garage: "Services",
  construction: "Services",
  gardening: "Services",
  legal: "Services",
  accounting: "Services",
  photography: "Services",
  retail: "Retail",
  education: "Education",
  events: "Hospitality",
  logistics: "Services",
  custom: "Services",
};

const CATEGORIES: Category[] = [
  "Tutti", "Food", "Hospitality", "Beauty", "Travel", "Health", "Services", "Retail", "Education", "Sport",
];

interface PortfolioPublicShowcaseProps {
  onSelect: (sectorId: string) => void;
}

export default function PortfolioPublicShowcase({ onSelect }: PortfolioPublicShowcaseProps) {
  const [activeCat, setActiveCat] = useState<Category>("Tutti");

  // Costruisce le card — solo settori che hanno PORTFOLIO_PROJECTS + immagini reali
  const cards = useMemo(() => {
    return (Object.keys(INDUSTRY_CONFIGS) as IndustryId[])
      .map((id) => {
        const project = PORTFOLIO_PROJECTS[id];
        const portfolio = SECTOR_PORTFOLIO.find((p) => p.sectorId === id);
        if (!project || !portfolio) return null;

        // Prendi le 2 schermate "hero" del primo brand/style
        const firstStyle = portfolio.brands[0]?.styles[0];
        const screens: string[] = (firstStyle?.screens || []).slice(0, 2);
        if (screens.length < 1) return null;

        const cfg = INDUSTRY_CONFIGS[id];
        const cat = CATEGORY_MAP[id] || "Services";
        const brandsCount = portfolio.brands.length;
        const stylesCount = portfolio.brands.reduce((sum, b) => sum + b.styles.length, 0);

        return {
          id,
          name: project.name,
          description: project.description,
          tags: project.tags,
          accent: project.accent,
          screens,
          category: cat,
          emoji: cfg.emoji,
          brandsCount,
          stylesCount,
        };
      })
      .filter(Boolean) as Array<{
        id: IndustryId;
        name: string;
        description: string;
        tags: string[];
        accent: string;
        screens: string[];
        category: Category;
        emoji: string;
        brandsCount: number;
        stylesCount: number;
      }>;
  }, []);

  const filtered = useMemo(() => {
    if (activeCat === "Tutti") return cards;
    return cards.filter((c) => c.category === activeCat);
  }, [cards, activeCat]);

  return (
    <section className="space-y-6">
      {/* ═══ HERO ═══ */}
      <div className="relative overflow-hidden rounded-3xl partner-card-isolated"
        style={{
          background:
            "linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(34,211,238,0.06) 50%, rgba(10,10,20,0.4) 100%)",
          border: "1px solid rgba(167,139,250,0.18)",
        }}
      >
        {/* Glow decorativo */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.5), transparent 70%)" }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.4), transparent 70%)" }} />

        <div className="relative px-5 sm:px-8 py-7 sm:py-10">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-violet-300/80 mb-2 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Our Work
          </p>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-foreground tracking-tight">
            Portfolio
          </h1>
          <p className="text-[12px] sm:text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
            Tutti i siti demo pronti da mostrare al cliente — ogni progetto è una replica 1:1 dei mockup approvati.
            Tap su un progetto per vedere tutte le schermate, gli stili disponibili e i dettagli completi.
          </p>

          {/* ═══ Chip categorie ═══ */}
          <div className="mt-5 flex flex-wrap gap-1.5 sm:gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all"
                  style={{
                    background: active
                      ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                      : "rgba(255,255,255,0.04)",
                    color: active ? "#fff" : "#9ca3af",
                    border: `1px solid ${active ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: active ? "0 4px 14px rgba(124,58,237,0.35)" : "none",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ GRID PROGETTI ═══ */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-2xl text-center text-sm text-muted-foreground"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
          Nessun progetto in questa categoria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((card, i) => (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
              onClick={() => onSelect(card.id)}
              className="group relative text-left rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 active:scale-[0.98] partner-card-isolated"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${card.accent}28`,
                boxShadow: `0 8px 32px -12px ${card.accent}30`,
              }}
            >
              {/* Preview area: 2 iPhone affiancati */}
              <div
                className="relative h-[220px] sm:h-[260px] flex items-end justify-center gap-3 px-4 pt-6 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${card.accent}1F 0%, rgba(8,8,16,0.95) 100%)`,
                }}
              >
                {/* Pattern punti decorativo */}
                <div className="absolute inset-0 opacity-[0.07]" style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1.5px)",
                  backgroundSize: "16px 16px",
                }} />

                {card.screens.slice(0, 2).map((src, j) => (
                  <div
                    key={j}
                    className={`relative shrink-0 transition-transform group-hover:scale-[1.04] ${j === 0 ? "translate-y-2 rotate-[-3deg]" : "-rotate-[3deg]"}`}
                    style={{ width: 110 }}
                  >
                    <div
                      className="aspect-[9/19.5] rounded-[18px] overflow-hidden border-[2px] relative"
                      style={{
                        borderColor: "rgba(255,255,255,0.18)",
                        background: "#0a0a14",
                        boxShadow: `0 18px 40px -8px ${card.accent}45, 0 6px 18px rgba(0,0,0,0.4)`,
                      }}
                    >
                      {/* Notch */}
                      <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[34px] h-[8px] bg-black rounded-full z-10" />
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                      />
                      {/* Home indicator */}
                      <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[30%] h-[3px] bg-white/25 rounded-full z-10" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Info area */}
              <div className="px-5 pt-4 pb-5 space-y-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {card.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider"
                      style={{ background: `${card.accent}20`, color: card.accent }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-base sm:text-lg font-display font-bold text-foreground leading-tight">
                  {card.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {card.description}
                </p>

                <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/5">
                  <span className="text-[10px] text-muted-foreground/80">
                    {card.brandsCount} brand · {card.stylesCount} stili
                  </span>
                  <span
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors group-hover:gap-2"
                    style={{ color: card.accent }}
                  >
                    Vedi progetto <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </section>
  );
}
