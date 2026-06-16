import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MockupLightbox } from "@/components/ui/mockup-lightbox";
import { X, ChevronRight, Eye } from "lucide-react";

const S = "/__empire-cover-removed";

interface PortfolioItem {
  name: string;
  description: string;
  category: string;
  subCategory: string;
  accent: string;
  screens: string[];
}

const PORTFOLIO: PortfolioItem[] = [
  {
    name: "Onyx Brace Steakhouse",
    description: "Michelin-starred Korean steakhouse — 6 luxury design styles fusing Korean BBQ with Miami aesthetics.",
    category: "food", subCategory: "Korean Steakhouse", accent: "#c87533",
    screens: [`${S}/Onyx%20Brace%20Steakhouse/a-obsidian-mobile-home.png`, `${S}/Onyx%20Brace%20Steakhouse/a-obsidian-mobile-menu.png`, `${S}/Onyx%20Brace%20Steakhouse/a-obsidian-mobile-detail.png`],
  },
  {
    name: "Sakura Atelier",
    description: "Contemporary Japanese & Nikkei sushi — 12 unique visual styles from sakura to luxury marble.",
    category: "food", subCategory: "Sushi", accent: "#e8a0bf",
    screens: [`${S}/Sakura%20Atelier/a-sakura-home.png`, `${S}/Sakura%20Atelier/a-sakura-menu.png`, `${S}/Sakura%20Atelier/a-sakura-detail.png`],
  },
  {
    name: "Brace Kebab",
    description: "Premium kebab chain — vibrant food ordering with real-time tracking and customization.",
    category: "food", subCategory: "Kebab", accent: "#e85d04",
    screens: [`${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`, `${S}/flame-kebab/c31559c3-67cf-4f62-b4e7-74833046eda7.png`, `${S}/flame-kebab/730290ed-5bf6-485f-b999-b75602a57d11.png`],
  },
  {
    name: "Indocina Noir",
    description: "Beverly Hills luxury Vietnamese — 8 stili mobile + 4 desktop, from Noir Saigon to Obsidian Gold.",
    category: "food", subCategory: "Vietnamese", accent: "#c9a84c",
    screens: [`${S}/Indocina%20Noir/a-noir-saigon-home.png`, `${S}/Indocina%20Noir/a-noir-saigon-menu.png`, `${S}/Indocina%20Noir/a-noir-saigon-detail.png`],
  },
  {
    name: "Aurora Nail Atelier",
    description: "Premium nail salon with frosted glass design — glassmorphism, Apple Vision Pro aesthetic.",
    category: "App Design", subCategory: "Nails", accent: "#c084fc",
    screens: [`${S}/Aurora%20Nail%20Atelier/frosted-glass-home.png`, `${S}/Aurora%20Nail%20Atelier/frosted-glass-servizi.png`, `${S}/Aurora%20Nail%20Atelier/frosted-glass-dettaglio.png`],
  },
  {
    name: "Cala Vento Charter",
    description: "Luxury charter booking for Sardinia — deep azure + warm gold, Costa Smeralda aesthetic.",
    category: "App Design", subCategory: "Mediterranean Luxury", accent: "#2563eb",
    screens: [`${S}/Cala%20Vento%20Charter/home.png`, `${S}/Cala%20Vento%20Charter/escursioni.png`, `${S}/Cala%20Vento%20Charter/dettaglio-tour.png`],
  },
  {
    name: "Centro Padel Brera",
    description: "Premium padel court booking — iOS 18 style, sistema prenotazione campi, profili maestri.",
    category: "App Design", subCategory: "UI/UX", accent: "#22c55e",
    screens: [`${S}/Centro%20Padel%20Brera/mobile-fresh-azzurro-home.png`, `${S}/Centro%20Padel%20Brera/mobile-fresh-azzurro-prenota.png`, `${S}/Centro%20Padel%20Brera/mobile-fresh-azzurro-maestri.png`],
  },
  {
    name: "Marina Riviera",
    description: "Luxury yacht & boat rental — 80+ boats, 5 design styles from Miami Sunset to Ice Turquoise.",
    category: "App Design", subCategory: "Boat Rental", accent: "#0ea5e9",
    screens: [`${S}/Marina%20Riviera/A-mobile-home.png`, `${S}/Marina%20Riviera/A-mobile-fleet.png`, `${S}/Marina%20Riviera/A-mobile-yacht-detail.png`],
  },
  {
    name: "Pacifico Ceviche",
    description: "Peruvian cevicheria in Milan — 4 styles: Costa del Pacifico, Casa Nostra, Bianco & Memoria.",
    category: "food", subCategory: "Peruvian", accent: "#38bdf8",
    screens: [`${S}/Pacifico%20Ceviche/costa-pacifico-mobile-home.png`, `${S}/Pacifico%20Ceviche/costa-pacifico-mobile-menu.png`, `${S}/Pacifico%20Ceviche/costa-pacifico-mobile-detail.png`],
  },
  {
    name: "Aura Milano Spa",
    description: "Luxury spa wellness — 4 stili x 4 schermate x 2 versioni. 32 mockup premium.",
    category: "App Design", subCategory: "Wellness", accent: "#a78bfa",
    screens: [`${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, `${S}/Aura%20Milano%20Spa/mobile-luce-pura-trattamenti.png`, `${S}/Aura%20Milano%20Spa/mobile-luce-pura-dettaglio.png`],
  },
  {
    name: "Stelle Nursery",
    description: "Premium nursery app for Dubai — playful, vivace e child-friendly con qualità premium.",
    category: "education", subCategory: "Nursery", accent: "#facc15",
    screens: [`${S}/Stelle%20Nursery%20-%20Playful%20Colorful/home.png`, `${S}/Stelle%20Nursery%20-%20Playful%20Colorful/programs-activities.png`, `${S}/Stelle%20Nursery%20-%20Playful%20Colorful/team-tour.png`],
  },
  {
    name: "Arcobaleno Playhouse",
    description: "Drop-in childcare Austin TX — iOS 18 design with 4 autumn-themed styles.",
    category: "App Design", subCategory: "Childcare", accent: "#f97316",
    screens: [`${S}/Ashley's%20Playhouse/stile-a-home.png`, `${S}/Ashley's%20Playhouse/stile-a-programs.png`, `${S}/Ashley's%20Playhouse/stile-a-book.png`],
  },
  {
    name: "Idro Pronto",
    description: "Home services booking app — Houston TX. Clean White + Green and Dark Premium Amber.",
    category: "App Design", subCategory: "Home Services", accent: "#22c55e",
    screens: [`${S}/Nick's%20Plumbing%20&%20AC/stile-a-home.png`, `${S}/Nick's%20Plumbing%20&%20AC/stile-a-services.png`, `${S}/Nick's%20Plumbing%20&%20AC/stile-a-detail.png`],
  },
  {
    name: "DIMORA Milano",
    description: "App immobiliare premium — 6 proposte di stile da Eleganza Milanese a Bianco Puro.",
    category: "App Design", subCategory: "Real Estate", accent: "#64748b",
    screens: [`${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, `${S}/DIMORA%20Milano/eleganza-milanese-annunci-mobile.png`, `${S}/DIMORA%20Milano/eleganza-milanese-dettaglio-mobile.png`],
  },
  {
    name: "Velluto Hair Lab",
    description: "Premium hair fragrance brand — Fresh Minimal Blanc: bianco puro, rosa cipria, rose gold.",
    category: "E-Commerce", subCategory: "Beauty", accent: "#f9a8d4",
    screens: [`${S}/Velluto%20Hair%20Lab/mobile-home.png`, `${S}/Velluto%20Hair%20Lab/mobile-shop.png`, `${S}/Velluto%20Hair%20Lab/mobile-detail.png`],
  },
  {
    name: "Onda Sport Club",
    description: "Jet ski, parasailing, flyboard — 4 design styles from Tropical Energy to Miami Riviera Luxe.",
    category: "App Design", subCategory: "Watersports", accent: "#06b6d4",
    screens: [`${S}/Onda%20Sport%20Club/style-a-mobile-home.png`, `${S}/Onda%20Sport%20Club/style-a-mobile-activities.png`, `${S}/Onda%20Sport%20Club/style-a-mobile-detail.png`],
  },
  {
    name: "Tropico Pet Resort",
    description: "Premium pet care booking — live camera feeds, pet profiles, resort management.",
    category: "lifestyle", subCategory: "Pet Care", accent: "#f472b6",
    screens: [`${S}/Tropico%20Pet%20Resort/mobile-a-home.png`, `${S}/Tropico%20Pet%20Resort/mobile-a-services.png`, `${S}/Tropico%20Pet%20Resort/mobile-a-detail.png`],
  },
  {
    name: "Lumen Clinic",
    description: "Medical devices webapp — 4 stili light mode premium: Ethereal Glass, Azure Gradient Flow.",
    category: "App Design", subCategory: "Medical", accent: "#60a5fa",
    screens: [`${S}/Lumen%20Clinic/a-ethereal-glass-mobile-home.png`, `${S}/Lumen%20Clinic/a-ethereal-glass-mobile-servizi.png`, `${S}/Lumen%20Clinic/a-ethereal-glass-mobile-prodotti.png`],
  },
];

const CATEGORIES = ["All", "food", "App Design", "E-Commerce", "lifestyle", "education"];
const CATEGORY_LABELS: Record<string, string> = {
  All: "All", food: "Food", "App Design": "App Design", "E-Commerce": "E-Commerce",
  lifestyle: "Lifestyle", education: "Education"
};

/* iPhone Frame */
function PhoneMockup({ src, alt, accent }: { src: string; alt: string; accent: string }) {
  return (
    <div className="relative w-[100px] sm:w-[120px] aspect-[9/19.5] rounded-[18px] sm:rounded-[22px] border-[2px] overflow-hidden flex-shrink-0"
      style={{ borderColor: `${accent}30`, background: "#0a0a0f", boxShadow: `0 12px 40px hsla(0,0%,0%,0.5), 0 0 20px ${accent}08` }}>
      <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[34%] max-w-[40px] h-[9px] bg-black rounded-full z-20"
        style={{ boxShadow: "0 0 0 1px hsla(0,0%,100%,0.05)" }} />
      <div className="absolute inset-[2px] rounded-[16px] sm:rounded-[20px] overflow-hidden">
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
      </div>
      <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[28%] h-[3px] bg-white/15 rounded-full z-20" />
    </div>
  );
}

/* Detail Overlay */
function ProjectDetail({ item, onClose }: { item: PortfolioItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="relative max-w-[90vw] max-h-[85vh] overflow-auto rounded-3xl p-6 sm:p-8"
        style={{ background: "hsl(228 22% 8%)", border: `1px solid ${item.accent}20`, boxShadow: `0 30px 80px hsla(0,0%,0%,0.6), 0 0 40px ${item.accent}08` }}
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-white/50" />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wider uppercase" style={{ background: `${item.accent}18`, color: item.accent, border: `1px solid ${item.accent}25` }}>
            {item.subCategory}
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wider uppercase bg-white/5 text-white/80">
            {item.category}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2">{item.name}</h3>
        <p className="text-sm text-white/50 max-w-md mb-6">{item.description}</p>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 snap-x justify-center">
          {item.screens.map((screen, i) => (
            <MockupLightbox key={i} imageSrc={screen} imageAlt={`${item.name} screen ${i + 1}`}>
              <PhoneMockup src={screen} alt={`${item.name} ${i + 1}`} accent={item.accent} />
            </MockupLightbox>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const items = activeFilter === "All" ? PORTFOLIO : PORTFOLIO.filter(p => p.category === activeFilter);
    return showAll ? items : items.slice(0, 12);
  }, [activeFilter, showAll]);

  const totalFiltered = useMemo(() => {
    return activeFilter === "All" ? PORTFOLIO.length : PORTFOLIO.filter(p => p.category === activeFilter).length;
  }, [activeFilter]);

  return (
    <section id="portfolio" className="relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, hsl(228 22% 7%) 0%, hsl(232 20% 9%) 50%, hsl(228 22% 7%) 100%)" }}>

      {/* Ambient glows */}
      <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsla(265,60%,50%,0.06), transparent 65%)", filter: "blur(120px)" }} />
      <div className="absolute bottom-[20%] left-[15%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsla(38,55%,50%,0.04), transparent 65%)", filter: "blur(100px)" }} />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: "hsla(0,0%,100%,0.04)", border: "1px solid hsla(0,0%,100%,0.08)" }}
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Eye className="w-3 h-3 text-white/80" />
            <span className="text-[11px] font-heading font-semibold tracking-[3px] uppercase text-white/80">Our Portfolio</span>
          </motion.div>

          <motion.h2 className="text-[clamp(1.8rem,5vw,3.5rem)] font-heading font-bold text-white leading-[1.05] mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Mobile App{" "}
            <span style={{
              background: "linear-gradient(135deg, hsl(250 70% 65%), hsl(200 80% 60%), hsl(170 60% 55%))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>Development</span>
          </motion.h2>
          <motion.p className="text-sm text-white/80 max-w-lg mx-auto"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            Progetti reali realizzati per clienti in tutto il mondo. Design premium, funzionalità avanzate.
          </motion.p>
        </div>

        {/* Category Filters */}
        <motion.div className="flex items-center justify-center gap-2 mb-10 flex-wrap"
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {CATEGORIES.map(cat => {
            const count = cat === "All" ? PORTFOLIO.length : PORTFOLIO.filter(p => p.category === cat).length;
            return (
              <button key={cat} onClick={() => { setActiveFilter(cat); setShowAll(false); }}
                className={`px-4 py-2 rounded-full text-[11px] font-heading font-semibold tracking-wider uppercase transition-all ${
                  activeFilter === cat
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-white/70 hover:text-white/50 border border-transparent"
                }`}>
                {CATEGORY_LABELS[cat] || cat}
                <span className="ml-1.5 text-[10px] opacity-50">{count}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div key={item.name}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => setSelectedItem(item)}
                className="group cursor-pointer relative rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(160deg, hsl(228 20% 12% / 0.95), hsl(232 22% 10% / 0.9))",
                  border: "1px solid hsla(0,0%,100%,0.06)",
                  boxShadow: "0 4px 24px hsla(0,0%,0%,0.3)"
                }}>

                {/* Phone Mockups — 3 phones */}
                <div className="relative p-5 pb-3 flex items-end justify-center gap-2 min-h-[220px] sm:min-h-[260px]"
                  style={{ background: `linear-gradient(180deg, ${item.accent}05 0%, transparent 60%)` }}>
                  
                  {/* Ambient glow behind phones */}
                  <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[200px] h-[120px] rounded-full opacity-30 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${item.accent}25, transparent 70%)`, filter: "blur(40px)" }} />

                  {item.screens.slice(0, 3).map((screen, si) => {
                    const isCenter = si === 0;
                    return (
                      <motion.div key={si}
                        className="relative"
                        style={{
                          zIndex: isCenter ? 10 : 5 - si,
                          marginBottom: isCenter ? 0 : si === 1 ? "8px" : "4px",
                          marginRight: si === 1 ? "-8px" : undefined,
                          marginLeft: si === 2 ? "-8px" : undefined,
                        }}
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 + si * 0.1 }}>
                        <PhoneMockup
                          src={screen}
                          alt={`${item.name} ${si + 1}`}
                          accent={item.accent}
                        />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Info */}
                <div className="px-5 pb-5 pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase"
                      style={{ background: `${item.accent}15`, color: item.accent, border: `1px solid ${item.accent}20` }}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-white/25">{item.subCategory}</span>
                  </div>
                  <h3 className="text-sm font-heading font-bold text-white mb-1 group-hover:text-white/90 transition-colors">{item.name}</h3>
                  <p className="text-[11px] text-white/35 leading-relaxed line-clamp-2">{item.description}</p>

                  {/* View button */}
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-heading font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: item.accent }}>
                    VIEW <ChevronRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Hover border glow */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: `inset 0 0 0 1px ${item.accent}20, 0 0 30px ${item.accent}08` }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Show More */}
        {!showAll && totalFiltered > 12 && (
          <motion.div className="text-center mt-8"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <button onClick={() => setShowAll(true)}
              className="px-6 py-3 rounded-full text-[0.7rem] font-heading font-semibold tracking-wider uppercase text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all">
              Mostra Tutti ({totalFiltered})
            </button>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div className="flex items-center justify-center gap-8 sm:gap-14 mt-12"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {[
            { value: `${PORTFOLIO.length}+`, label: "Apps Launched" },
            { value: "50+", label: "Clients Worldwide" },
            { value: "5", label: "Years of Excellence" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl sm:text-3xl font-heading font-bold text-white">{stat.value}</p>
              <p className="text-[11px] text-white/70 tracking-wider uppercase mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedItem && <ProjectDetail item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </section>
  );
}
