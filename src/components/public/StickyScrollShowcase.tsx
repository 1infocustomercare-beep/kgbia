import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { ArrowRight, Sparkles } from "lucide-react";

import sectorHeroFood from "@/assets/sector-hero-food.jpg";
import sectorHeroNcc from "@/assets/sector-hero-ncc.jpg";
import sectorHeroBeauty from "@/assets/sector-hero-beauty.jpg";
import sectorHeroHealthcare from "@/assets/sector-hero-healthcare.jpg";
import sectorHeroRetail from "@/assets/sector-hero-retail.jpg";
import sectorHeroFitness from "@/assets/sector-hero-fitness.jpg";
import sectorHeroHotel from "@/assets/sector-hero-hotel.jpg";

const SECTORS = [
  { id: "food", name: "Food & Ristorazione", desc: "Menu digitale, ordini QR, cucina live, delivery integrato, loyalty program", color: "hsl(20 95% 46%)", image: sectorHeroFood, stats: "4.200+ ristoranti" },
  { id: "ncc", name: "NCC & Trasporto", desc: "Gestione flotta, tratte, booking automatico, tracking autisti in tempo reale", color: "hsl(44 52% 54%)", image: sectorHeroNcc, stats: "680+ flotte" },
  { id: "beauty", name: "Beauty & Wellness", desc: "Agenda smart, clienti, trattamenti, fidelity card, marketing automatico", color: "hsl(326 82% 52%)", image: sectorHeroBeauty, stats: "2.100+ saloni" },
  { id: "healthcare", name: "Healthcare", desc: "Schede paziente, agenda medica, fatturazione elettronica, telemedicina", color: "hsl(199 89% 49%)", image: sectorHeroHealthcare, stats: "950+ studi" },
  { id: "retail", name: "Retail & Negozi", desc: "Catalogo digitale, inventario AI, POS integrato, promozioni smart", color: "hsl(262 83% 64%)", image: sectorHeroRetail, stats: "1.800+ negozi" },
  { id: "fitness", name: "Fitness & Sport", desc: "Abbonamenti, corsi, check-in, pagamenti ricorrenti, app membri", color: "hsl(24 95% 58%)", image: sectorHeroFitness, stats: "720+ palestre" },
  { id: "hospitality", name: "Hospitality", desc: "Camere, booking, gestione ospiti, concierge digitale, housekeeping", color: "hsl(160 84% 39%)", image: sectorHeroHotel, stats: "1.400+ strutture" },
];

const INTRO_END = 0.2;
const SECTORS_END = 0.9;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function PhoneFrame({ src, alt, className = "", glowColor }: { src: string; alt: string; className?: string; glowColor?: string }) {
  return (
    <div className={`relative aspect-[9/19.5] overflow-hidden ${className}`}
      style={{
        borderRadius: "clamp(20px, 4vw, 44px)",
        border: "2px solid hsl(0 0% 100% / 0.1)",
        background: "hsl(240 20% 4%)",
        boxShadow: glowColor
          ? `0 30px 80px hsl(0 0% 0% / 0.6), 0 0 60px ${glowColor}`
          : "0 30px 80px hsl(0 0% 0% / 0.6)",
      }}>
      <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[34%] max-w-[50px] h-[12px] sm:h-[16px] bg-black rounded-full z-30"
        style={{ boxShadow: "0 0 0 1px hsl(0 0% 100% / 0.05)" }} />
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
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const normalized = clamp(v);
    setProgress(normalized);

    if (normalized <= INTRO_END) {
      setActiveIdx(0);
      return;
    }

    const sectorProgress = clamp((normalized - INTRO_END) / (SECTORS_END - INTRO_END));
    const idx = Math.min(Math.floor(sectorProgress * SECTORS.length), SECTORS.length - 1);
    setActiveIdx(idx);
  });

  const activeSector = SECTORS[activeIdx];
  const slug = DEMO_SLUGS[activeSector.id as keyof typeof DEMO_SLUGS];
  const demoPath = activeSector.id === "food" ? `/r/${slug}` : `/demo/${slug}`;

  const introProgress = clamp(progress / INTRO_END);
  const galleryProgress = clamp((progress - 0.08) / 0.16);
  const infoProgress = clamp((progress - 0.15) / 0.12);

  const introOpacity = 1 - introProgress;
  const introTranslateY = introProgress * 44;
  const galleryOpacity = galleryProgress;
  const galleryTranslateY = 26 - galleryProgress * 26;

  return (
    <div ref={containerRef} className="relative" style={{ height: `${(SECTORS.length + 6) * 100}vh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden"
        style={{
          background:
            "radial-gradient(125% 90% at 50% -10%, hsl(var(--primary) / 0.22), transparent 58%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted) / 0.35) 50%, hsl(var(--background)) 100%)",
        }}>

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full blur-[200px] opacity-[0.07] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ background: activeSector.color }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: "linear-gradient(hsl(250 50% 70% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(250 50% 70% / 0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        {/* Hero text that comes back when scrolling up */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6 pointer-events-none"
          style={{ opacity: introOpacity, transform: `translateY(${introTranslateY}px)` }}
        >
          <div className="text-center max-w-[980px] mx-auto">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.09)" }}
            >
              <Sparkles className="w-3 h-3 text-white/50" />
              <span className="text-[0.55rem] font-heading font-semibold tracking-[3px] uppercase text-white/50">Empire AI Platform</span>
            </div>

            <h2 className="text-[clamp(1.5rem,6vw,4rem)] font-heading font-extrabold text-white leading-[1.06] tracking-tight mb-4">
              Trasformiamo le Imprese Italiane
              <br />
              <span
                style={{
                  background: "linear-gradient(125deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                con l&apos;Intelligenza Artificiale.
              </span>
            </h2>

            <p className="text-[0.78rem] sm:text-[1rem] text-white/65 max-w-[760px] mx-auto leading-relaxed mb-2">
              La prima piattaforma AI all-in-one che gestisce, automatizza e fa crescere il tuo business.
            </p>
            <p className="text-[0.68rem] sm:text-[0.82rem] text-white/45 tracking-wide uppercase">
              98+ agenti IA · 25+ settori · zero canone fisso
            </p>
          </div>
        </motion.div>

        {/* Sticky top heading after reveal */}
        <motion.div
          className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 text-center z-20 px-4 w-full max-w-lg"
          style={{ opacity: infoProgress }}
        >
          <h3 className="text-[clamp(1rem,3vw,1.9rem)] font-heading font-bold text-white leading-[1.15]">
            Tutte le preview dei settori
            <span
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {" "}
              in comparsa automatica
            </span>
          </h3>
        </motion.div>

        {/* ===== PHONE GALLERY — center area ===== */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 px-4"
          style={{
            opacity: galleryOpacity,
            transform: `translateY(${galleryTranslateY}px)`,
            perspective: "1400px",
            pointerEvents: galleryOpacity < 0.15 ? "none" : "auto",
          }}
        >
          
          {/* Mobile: show up to 7 stacked phones */}
          <div className="flex lg:hidden items-center justify-center relative"
            style={{ width: "100%", maxWidth: "390px", height: "62vh" }}>
            {SECTORS.map((sector, i) => {
              const isActive = i === activeIdx;
              const offset = i - activeIdx;
              const absOffset = Math.abs(offset);

              if (absOffset > 3) return null;

              return (
                <motion.div
                  key={sector.id}
                  className="absolute cursor-pointer"
                  animate={{
                    x: offset * 30,
                    y: absOffset * 16,
                    scale: isActive ? 0.92 : Math.max(0.56, 0.8 - absOffset * 0.08),
                    rotateY: offset * -9,
                    rotateZ: offset * 1.8,
                    opacity: isActive ? 1 : absOffset === 1 ? 0.7 : absOffset === 2 ? 0.45 : 0.2,
                    filter: absOffset > 2 ? "blur(1px)" : "blur(0px)",
                    zIndex: 30 - absOffset,
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 30 }}
                  onClick={() => navigate(
                    sector.id === "food" ? `/r/${DEMO_SLUGS[sector.id as keyof typeof DEMO_SLUGS]}` : `/demo/${DEMO_SLUGS[sector.id as keyof typeof DEMO_SLUGS]}`
                  )}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <PhoneFrame src={sector.image} alt={sector.name} className="w-[132px]" glowColor={isActive ? sector.color : undefined} />
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{ background: `color-mix(in srgb, ${sector.color} 28%, transparent)`, border: `1px solid color-mix(in srgb, ${sector.color} 42%, transparent)` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: sector.color }} />
                        <span className="text-[7px] font-heading font-bold text-white/70 uppercase tracking-wider">Preview live</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Desktop: show all phones with wider spread */}
          <div className="hidden lg:flex items-center justify-center relative"
            style={{ width: "1200px", height: "68vh" }}>
            {SECTORS.map((sector, i) => {
              const isActive = i === activeIdx;
              const offset = i - activeIdx;
              const absOffset = Math.abs(offset);

              if (absOffset > 4) return null;

              return (
                <motion.div
                  key={sector.id}
                  className="absolute cursor-pointer group"
                  animate={{
                    x: offset * 128,
                    y: absOffset * 18,
                    scale: isActive ? 1 : Math.max(0.48, 0.86 - absOffset * 0.1),
                    rotateY: offset * -11,
                    rotateZ: offset * 1.5,
                    opacity: isActive ? 1 : absOffset === 1 ? 0.72 : absOffset === 2 ? 0.46 : absOffset === 3 ? 0.26 : 0.14,
                    filter: absOffset > 2 ? "blur(1px)" : "blur(0px)",
                    zIndex: 40 - absOffset,
                  }}
                  transition={{ type: "spring", stiffness: 190, damping: 28 }}
                  onClick={() => navigate(
                    sector.id === "food" ? `/r/${DEMO_SLUGS[sector.id as keyof typeof DEMO_SLUGS]}` : `/demo/${DEMO_SLUGS[sector.id as keyof typeof DEMO_SLUGS]}`
                  )}
                  style={{ transformStyle: "preserve-3d" }}
                  whileHover={{ scale: isActive ? 1.04 : 0.9 }}
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
                        style={{ background: `color-mix(in srgb, ${sector.color} 24%, transparent)`, border: `1px solid color-mix(in srgb, ${sector.color} 40%, transparent)` }}>
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: sector.color }} />
                        <span className="text-[8px] font-heading font-bold text-white/75 uppercase tracking-wider">Preview live</span>
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
        </motion.div>

        {/* ===== PREVIEW STRIP (always all sectors visible) ===== */}
        <motion.div
          className="absolute z-20 left-1/2 -translate-x-1/2 w-[min(94vw,920px)] bottom-[14%] lg:bottom-[10%]"
          style={{ opacity: infoProgress, pointerEvents: infoProgress < 0.2 ? "none" : "auto" }}
        >
          <div
            className="flex items-center gap-2 overflow-x-auto py-2 px-2 rounded-2xl"
            style={{
              background: "hsl(0 0% 100% / 0.03)",
              border: "1px solid hsl(0 0% 100% / 0.08)",
            }}
          >
            {SECTORS.map((sector, i) => {
              const isActive = i === activeIdx;
              return (
                <button
                  key={`${sector.id}-thumb`}
                  onClick={() => {
                    if (!containerRef.current) return;
                    const totalH = containerRef.current.scrollHeight - window.innerHeight;
                    const targetScroll =
                      containerRef.current.offsetTop +
                      (INTRO_END + (i / SECTORS.length) * (SECTORS_END - INTRO_END)) * totalH;
                    window.scrollTo({ top: targetScroll, behavior: "smooth" });
                  }}
                  className="shrink-0 w-[54px] h-[88px] rounded-xl overflow-hidden transition-transform duration-300"
                  style={{
                    border: isActive ? `1px solid ${sector.color}` : "1px solid hsl(0 0% 100% / 0.14)",
                    boxShadow: isActive ? `0 0 20px color-mix(in srgb, ${sector.color} 40%, transparent)` : "none",
                    transform: isActive ? "translateY(-2px)" : "translateY(0)",
                  }}
                  aria-label={`Apri anteprima ${sector.name}`}
                >
                  <img src={sector.image} alt={sector.name} className="w-full h-full object-cover object-top" loading="lazy" />
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ===== SECTOR INFO ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSector.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: infoProgress, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="absolute z-20 px-4
              bottom-[26%] left-1/2 -translate-x-1/2 text-center w-full max-w-xs
              lg:bottom-auto lg:left-[6%] lg:translate-x-0 lg:top-1/2 lg:-translate-y-1/2 lg:text-left lg:max-w-[260px]"
          >
            <div className="w-8 h-1 rounded-full mb-3 mx-auto lg:mx-0"
              style={{ background: activeSector.color, boxShadow: `0 0 20px color-mix(in srgb, ${activeSector.color} 40%, transparent)` }} />
            <p className="text-[0.6rem] font-heading font-bold tracking-[3px] uppercase mb-1.5"
              style={{ color: activeSector.color }}>{activeSector.name}</p>
            <p className="text-[0.72rem] sm:text-[0.82rem] text-white/60 leading-relaxed mb-2 hidden sm:block">{activeSector.desc}</p>
            <p className="text-[0.62rem] text-white/40 mb-3">{activeSector.stats}</p>
            <button
              onClick={() => navigate(demoPath)}
              className="inline-flex items-center gap-1.5 text-[0.62rem] font-heading font-semibold tracking-wider uppercase text-white/55 hover:text-white transition-colors group/btn">
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
                  const targetScroll = containerRef.current.offsetTop + (INTRO_END + (i / SECTORS.length) * (SECTORS_END - INTRO_END)) * totalH;
                  window.scrollTo({ top: targetScroll, behavior: "smooth" });
                }
              }}>
              <div className={`rounded-full transition-all duration-400 ${i === activeIdx ? "w-6 sm:w-7 h-1.5 sm:h-2" : "w-1.5 sm:w-2 h-1.5 sm:h-2"}`}
                style={{
                  background: i === activeIdx ? sector.color : `color-mix(in srgb, ${sector.color} 28%, transparent)`,
                  boxShadow: i === activeIdx ? `0 0 12px color-mix(in srgb, ${sector.color} 48%, transparent)` : "none",
                }}
              />
              <span className={`text-[5px] sm:text-[6px] font-heading font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300
                ${i === activeIdx ? "text-white/60 scale-100" : "text-transparent sm:text-white/25 scale-90"}`}>
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
    </div>
  );
}
