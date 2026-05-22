import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { ArrowRight, Sparkles } from "lucide-react";
import ProjectDetailOverlay from "@/components/partner/ProjectDetailOverlay";

import sectorHeroFood from "@/assets/sector-hero-food.jpg";
import sectorHeroNcc from "@/assets/sector-hero-ncc.jpg";
import sectorHeroBeauty from "@/assets/sector-hero-beauty.jpg";
import sectorHeroHealthcare from "@/assets/sector-hero-healthcare.jpg";
import sectorHeroRetail from "@/assets/sector-hero-retail.jpg";
import sectorHeroFitness from "@/assets/sector-hero-fitness.jpg";
import sectorHeroHotel from "@/assets/sector-hero-hotel.jpg";

const SECTORS = [
  { id: "food", name: "Food & Ristorazione", desc: "Menu digitale, ordini QR, cucina live, delivery integrato, loyalty program", color: "#e85d04", image: sectorHeroFood, stats: "4.200+ ristoranti" },
  { id: "ncc", name: "NCC & Trasporto", desc: "Gestione flotta, tratte, booking automatico, tracking autisti in tempo reale", color: "#C9A84C", image: sectorHeroNcc, stats: "680+ flotte" },
  { id: "beauty", name: "Beauty & Wellness", desc: "Agenda smart, clienti, trattamenti, fidelity card, marketing automatico", color: "#e91e8c", image: sectorHeroBeauty, stats: "2.100+ saloni" },
  { id: "healthcare", name: "Healthcare", desc: "Schede paziente, agenda medica, fatturazione elettronica, telemedicina", color: "#0ea5e9", image: sectorHeroHealthcare, stats: "950+ studi" },
  { id: "retail", name: "Retail & Negozi", desc: "Catalogo digitale, inventario AI, POS integrato, promozioni smart", color: "#8b5cf6", image: sectorHeroRetail, stats: "1.800+ negozi" },
  { id: "fitness", name: "Fitness & Sport", desc: "Abbonamenti, corsi, check-in, pagamenti ricorrenti, app membri", color: "#f97316", image: sectorHeroFitness, stats: "720+ palestre" },
  { id: "hospitality", name: "Hospitality", desc: "Camere, booking, gestione ospiti, concierge digitale, housekeeping", color: "#10b981", image: sectorHeroHotel, stats: "1.400+ strutture" },
];

function PhoneFrame({ src, alt, className = "", glowColor }: { src: string; alt: string; className?: string; glowColor?: string }) {
  return (
    <div className={`relative aspect-[9/19.5] overflow-hidden ${className}`}
      style={{
        borderRadius: "clamp(20px, 4vw, 44px)",
        border: "2px solid hsla(0,0%,100%,0.1)",
        background: "#050508",
        boxShadow: glowColor
          ? `0 30px 80px hsla(0,0%,0%,0.6), 0 0 60px ${glowColor}20`
          : "0 30px 80px hsla(0,0%,0%,0.6)",
      }}>
      <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[34%] max-w-[50px] h-[12px] sm:h-[16px] bg-black rounded-full z-30"
        style={{ boxShadow: "0 0 0 1px hsla(0,0%,100%,0.05)" }} />
      <div className="absolute inset-[2px] overflow-hidden bg-black" style={{ borderRadius: "clamp(18px, 3.8vw, 42px)" }}>
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
      </div>
      <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[26%] h-[3px] bg-white/12 rounded-full z-20" />
    </div>
  );
}

export default function StickyScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const [activeIdx, setActiveIdx] = useState(0);
  const [detailSector, setDetailSector] = useState<string | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // First 8% = intro, then evenly split the rest
    const adjusted = Math.max(0, (v - 0.08) / 0.88);
    const idx = Math.min(Math.floor(adjusted * SECTORS.length), SECTORS.length - 1);
    setActiveIdx(Math.max(0, idx));
  });

  const activeSector = SECTORS[activeIdx];
  const slug = DEMO_SLUGS[activeSector.id as keyof typeof DEMO_SLUGS];
  const demoPath = activeSector.id === "food" ? `/r/${slug}` : `/demo/${slug}`;

  return (
    <div ref={containerRef} className="relative" style={{ height: `${(SECTORS.length + 2) * 100}vh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden"
        style={{ background: "linear-gradient(180deg, hsl(228 24% 4%) 0%, hsl(235 22% 6%) 50%, hsl(228 24% 4%) 100%)" }}>

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full blur-[200px] opacity-[0.07] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ background: activeSector.color }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: "linear-gradient(hsla(250,50%,70%,0.3) 1px, transparent 1px), linear-gradient(90deg, hsla(250,50%,70%,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        {/* Header */}
        <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 text-center z-20 px-4 w-full max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-2"
            style={{ background: "hsla(0,0%,100%,0.04)", border: "1px solid hsla(0,0%,100%,0.08)" }}>
            <Sparkles className="w-3 h-3 text-white/80" />
            <span className="text-[0.55rem] font-heading font-semibold tracking-[3px] uppercase text-white/80">I nostri settori</span>
          </div>
          <h2 className="text-[clamp(1.2rem,3.5vw,2.5rem)] font-heading font-bold text-white leading-[1.1]">
            Un sistema.{" "}
            <span style={{
              background: "linear-gradient(135deg, hsl(195 100% 60%), hsl(250 85% 65%), hsl(320 70% 55%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Infiniti settori.</span>
          </h2>
        </div>

        {/* ===== PHONE GALLERY — center area ===== */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4"
          style={{ perspective: "1200px" }}>
          
          {/* Mobile: show 3 stacked phones */}
          <div className="flex lg:hidden items-center justify-center relative"
            style={{ width: "100%", maxWidth: "340px", height: "55vh" }}>
            {SECTORS.map((sector, i) => {
              const isActive = i === activeIdx;
              const offset = i - activeIdx;
              const absOffset = Math.abs(offset);

              if (absOffset > 2) return null;

              return (
                <motion.div
                  key={sector.id}
                  className="absolute cursor-pointer"
                  animate={{
                    x: offset * 35,
                    y: absOffset * 12,
                    scale: isActive ? 0.85 : 0.65 - absOffset * 0.06,
                    rotateY: offset * -8,
                    rotateZ: offset * 2,
                    opacity: isActive ? 1 : absOffset === 1 ? 0.5 : 0.2,
                    zIndex: 10 - absOffset,
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 28 }}
                  onClick={() => setDetailSector(sector.id === "hospitality" ? "hospitality" : sector.id)}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <PhoneFrame src={sector.image} alt={sector.name} className="w-[140px]" glowColor={isActive ? sector.color : undefined} />
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{ background: `${sector.color}25`, border: `1px solid ${sector.color}40` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: sector.color }} />
                        <span className="text-[7px] font-heading font-bold text-white/60 uppercase tracking-wider">Live</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Desktop: show 5 phones spread out */}
          <div className="hidden lg:flex items-center justify-center relative"
            style={{ width: "900px", height: "65vh" }}>
            {SECTORS.map((sector, i) => {
              const isActive = i === activeIdx;
              const offset = i - activeIdx;
              const absOffset = Math.abs(offset);

              if (absOffset > 3) return null;

              return (
                <motion.div
                  key={sector.id}
                  className="absolute cursor-pointer group"
                  animate={{
                    x: offset * 95,
                    y: absOffset * 15,
                    scale: isActive ? 0.95 : 0.7 - absOffset * 0.05,
                    rotateY: offset * -10,
                    rotateZ: offset * 1.5,
                    opacity: isActive ? 1 : absOffset === 1 ? 0.6 : absOffset === 2 ? 0.3 : 0.15,
                    zIndex: 10 - absOffset,
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 26 }}
                  onClick={() => setDetailSector(sector.id === "hospitality" ? "hospitality" : sector.id)}
                  style={{ transformStyle: "preserve-3d" }}
                  whileHover={{ scale: isActive ? 1.0 : 0.75 }}
                >
                  <PhoneFrame src={sector.image} alt={sector.name} className="w-[220px]" glowColor={isActive ? sector.color : undefined} />
                  
                  {/* Label below active phone */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                        style={{ background: `${sector.color}20`, border: `1px solid ${sector.color}35` }}>
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: sector.color }} />
                        <span className="text-[8px] font-heading font-bold text-white/60 uppercase tracking-wider">Live Preview</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Glow */}
                  {isActive && (
                    <div className="absolute -inset-10 rounded-[60px] -z-10 blur-[80px] opacity-20"
                      style={{ background: sector.color }} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ===== SECTOR INFO ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSector.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="absolute z-20 px-4
              bottom-[15%] left-1/2 -translate-x-1/2 text-center w-full max-w-xs
              lg:bottom-auto lg:left-[6%] lg:translate-x-0 lg:top-1/2 lg:-translate-y-1/2 lg:text-left lg:max-w-[240px]"
          >
            <div className="w-8 h-1 rounded-full mb-3 mx-auto lg:mx-0"
              style={{ background: activeSector.color, boxShadow: `0 0 20px ${activeSector.color}50` }} />
            <p className="text-[0.6rem] font-heading font-bold tracking-[3px] uppercase mb-1.5"
              style={{ color: activeSector.color }}>{activeSector.name}</p>
            <p className="text-[0.7rem] sm:text-[0.8rem] text-white/80 leading-relaxed mb-2 hidden sm:block">{activeSector.desc}</p>
            <p className="text-[0.6rem] text-white/25 mb-3">{activeSector.stats}</p>
            <button
              onClick={() => navigate(demoPath)}
              className="inline-flex items-center gap-1.5 text-[0.6rem] font-heading font-semibold tracking-wider uppercase text-white/80 hover:text-white transition-colors group/btn">
              Esplora {activeSector.name.split(" ")[0]}
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </AnimatePresence>

        {/* ===== DOT INDICATORS ===== */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2.5">
          {SECTORS.map((sector, i) => (
            <button key={sector.id} className="flex flex-col items-center gap-1 group/dot"
              onClick={() => {
                // Scroll to the right position
                if (containerRef.current) {
                  const totalH = containerRef.current.scrollHeight - window.innerHeight;
                  const targetScroll = containerRef.current.offsetTop + (0.08 + (i / SECTORS.length) * 0.88) * totalH;
                  window.scrollTo({ top: targetScroll, behavior: "smooth" });
                }
              }}>
              <div className={`rounded-full transition-all duration-400 ${i === activeIdx ? "w-6 sm:w-7 h-1.5 sm:h-2" : "w-1.5 sm:w-2 h-1.5 sm:h-2"}`}
                style={{
                  background: i === activeIdx ? sector.color : `${sector.color}30`,
                  boxShadow: i === activeIdx ? `0 0 12px ${sector.color}50` : "none",
                }}
              />
              <span className={`text-[5px] sm:text-[6px] font-heading font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300
                ${i === activeIdx ? "text-white/50 scale-100" : "text-transparent sm:text-white/15 scale-90"}`}>
                {sector.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll hint at bottom */}
        <motion.div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-[1px] h-4 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </div>

      {/* ═══ PROJECT DETAIL OVERLAY ═══ */}
      <AnimatePresence>
        {detailSector && (
          <ProjectDetailOverlay sectorId={detailSector} onClose={() => setDetailSector(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
