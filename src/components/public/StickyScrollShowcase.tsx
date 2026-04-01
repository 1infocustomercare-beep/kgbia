import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { ArrowRight } from "lucide-react";

import sectorHeroFood from "@/assets/sector-hero-food.jpg";
import sectorHeroNcc from "@/assets/sector-hero-ncc.jpg";
import sectorHeroBeauty from "@/assets/sector-hero-beauty.jpg";
import sectorHeroHealthcare from "@/assets/sector-hero-healthcare.jpg";
import sectorHeroRetail from "@/assets/sector-hero-retail.jpg";
import sectorHeroFitness from "@/assets/sector-hero-fitness.jpg";
import sectorHeroHotel from "@/assets/sector-hero-hotel.jpg";

const SECTORS = [
  { id: "food", name: "Food & Ristorazione", desc: "Menu digitale, ordini, QR, cucina live", color: "#e85d04", image: sectorHeroFood },
  { id: "ncc", name: "NCC & Trasporto", desc: "Flotta, tratte, booking, autisti", color: "#C9A84C", image: sectorHeroNcc },
  { id: "beauty", name: "Beauty & Wellness", desc: "Agenda, clienti, trattamenti, fidelity", color: "#e91e8c", image: sectorHeroBeauty },
  { id: "healthcare", name: "Healthcare", desc: "Schede paziente, agenda, fatturazione", color: "#0ea5e9", image: sectorHeroHealthcare },
  { id: "retail", name: "Retail & Negozi", desc: "Catalogo, inventario, POS, promozioni", color: "#8b5cf6", image: sectorHeroRetail },
  { id: "fitness", name: "Fitness & Sport", desc: "Abbonamenti, corsi, check-in, pagamenti", color: "#f97316", image: sectorHeroFitness },
  { id: "hospitality", name: "Hospitality", desc: "Camere, booking, ospiti, concierge", color: "#10b981", image: sectorHeroHotel },
];

function PhoneFrame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative aspect-[9/19.5] overflow-hidden ${className}`}
      style={{
        borderRadius: "clamp(24px, 5vw, 44px)",
        border: "2.5px solid hsla(0,0%,100%,0.12)",
        background: "#050508",
        boxShadow: "0 40px 100px hsla(0,0%,0%,0.6), 0 8px 32px hsla(250,40%,30%,0.15), inset 0 1px 0 hsla(0,0%,100%,0.08)",
      }}>
      <div className="absolute top-[7px] sm:top-[9px] left-1/2 -translate-x-1/2 w-[36%] max-w-[56px] h-[14px] sm:h-[18px] bg-black rounded-full z-30"
        style={{ boxShadow: "0 0 0 1px hsla(0,0%,100%,0.05)" }} />
      <div className="absolute inset-[3px] overflow-hidden bg-black" style={{ borderRadius: "clamp(21px, 4.5vw, 41px)" }}>
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
        <div className="absolute inset-x-0 top-0 h-10" style={{ background: "linear-gradient(to bottom, hsla(0,0%,0%,0.35), transparent)" }} />
      </div>
      <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[28%] h-[3px] bg-white/15 rounded-full z-20" />
      <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: "clamp(24px, 5vw, 44px)", background: "linear-gradient(135deg, hsla(0,0%,100%,0.06) 0%, transparent 35%)" }} />
    </div>
  );
}

/**
 * StickyScrollShowcase — Active Theory inspired
 * Sticky scroll section where phones dramatically enter and stack with 3D transforms.
 * Works on BOTH mobile and desktop.
 */
export default function StickyScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const sectorCount = SECTORS.length;
  const [activeIdx, setActiveIdx] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const segSize = 1 / (sectorCount + 1);
    const idx = Math.min(Math.floor(v / segSize), sectorCount - 1);
    setActiveIdx(Math.max(0, idx));
  });

  return (
    <div ref={containerRef} className="relative" style={{ height: `${(sectorCount + 1.5) * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "linear-gradient(180deg, hsl(228 24% 4%) 0%, hsl(235 22% 6%) 50%, hsl(228 24% 4%) 100%)" }}>

        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute w-[800px] h-[800px] rounded-full blur-[250px] opacity-[0.04]"
            style={{ background: "hsl(250 55% 55%)", top: "5%", left: "0%" }}
            animate={{ x: [0, 40, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute w-[600px] h-[600px] rounded-full blur-[220px] opacity-[0.03]"
            style={{ background: "hsl(320 60% 50%)", bottom: "5%", right: "0%" }}
            animate={{ x: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }} />
          {/* Active sector color glow */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full blur-[200px] opacity-[0.08] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ background: SECTORS[activeIdx]?.color || "#8b5cf6" }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: "linear-gradient(hsla(250,50%,70%,0.3) 1px, transparent 1px), linear-gradient(90deg, hsla(250,50%,70%,0.3) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        </div>

        {/* Title */}
        <div className="absolute top-[5%] sm:top-[7%] left-1/2 -translate-x-1/2 text-center z-20 px-4 w-full max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3"
            style={{ background: "hsla(0,0%,100%,0.04)", border: "1px solid hsla(0,0%,100%,0.08)" }}>
            <span className="text-[0.55rem] font-heading font-semibold tracking-[3px] uppercase text-white/50">I nostri settori</span>
          </div>
          <h2 className="text-[clamp(1.4rem,4vw,2.8rem)] font-heading font-bold text-white leading-[1.05]">
            Un sistema.{" "}
            <span style={{
              background: "linear-gradient(135deg, hsl(195 100% 60%), hsl(250 85% 65%), hsl(320 70% 55%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Infiniti settori.</span>
          </h2>
        </div>

        {/* Phone stack — center with 3D perspective */}
        <div className="relative z-10 flex items-center justify-center" style={{ perspective: "1400px", perspectiveOrigin: "50% 45%" }}>
          {SECTORS.map((sector, i) => (
            <ScrollPhone key={sector.id} index={i} total={sectorCount} scrollProgress={scrollYProgress} sector={sector} navigate={navigate} />
          ))}
        </div>

        {/* Active sector info panel — desktop left, mobile bottom */}
        <ActiveSectorInfo sector={SECTORS[activeIdx]} navigate={navigate} />

        {/* Progress indicator */}
        <SectorIndicator scrollProgress={scrollYProgress} sectors={SECTORS} activeIdx={activeIdx} />
      </div>
    </div>
  );
}

function ScrollPhone({
  index, total, scrollProgress, sector, navigate
}: {
  index: number; total: number; scrollProgress: any; sector: typeof SECTORS[0]; navigate: any;
}) {
  const segmentSize = 1 / (total + 1.5);
  const entryStart = index * segmentSize;
  const entryMid = entryStart + segmentSize * 0.5;
  const stayEnd = (index + 1) * segmentSize;
  const exitEnd = Math.min(stayEnd + segmentSize * 0.5, 1);

  const fromRight = index % 2 === 0;
  const spreadX = (index - total / 2) * 18;

  const y = useTransform(scrollProgress, [entryStart, entryMid, stayEnd, exitEnd], [300, 0, 0, -250]);
  const x = useTransform(scrollProgress, [entryStart, entryMid, stayEnd, exitEnd], [fromRight ? 150 : -150, spreadX, spreadX, fromRight ? -100 : 100]);
  const scale = useTransform(scrollProgress, [entryStart, entryMid, stayEnd, exitEnd], [0.4, 0.85 + (total - index) * 0.02, 0.85 + (total - index) * 0.02, 0.3]);
  const opacity = useTransform(scrollProgress, [entryStart, entryStart + segmentSize * 0.12, stayEnd - segmentSize * 0.08, exitEnd], [0, 1, 1, 0]);
  const rotateY = useTransform(scrollProgress, [entryStart, entryMid], [fromRight ? 40 : -40, -2 + index * 1.5]);
  const rotateZ = useTransform(scrollProgress, [entryStart, entryMid], [fromRight ? 15 : -15, -1 + index * 0.8]);
  const rotateX = useTransform(scrollProgress, [entryStart, entryMid], [12, 0]);
  const zIndex = total - index;

  const slug = DEMO_SLUGS[sector.id as keyof typeof DEMO_SLUGS];
  const demoPath = sector.id === "food" ? `/r/${slug}` : `/demo/${slug}`;

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{ y, x, scale, opacity, rotateY, rotateZ, rotateX, zIndex, transformStyle: "preserve-3d", willChange: "transform" }}
      onClick={() => navigate(demoPath)}
      whileHover={{ scale: 0.9 }}>

      <div className="relative">
        <PhoneFrame src={sector.image} alt={sector.name} className="w-[160px] sm:w-[210px] lg:w-[250px]" />

        {/* Label overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 pt-10 z-20"
          style={{ borderRadius: "0 0 clamp(24px, 5vw, 44px) clamp(24px, 5vw, 44px)", background: "linear-gradient(to top, hsla(0,0%,0%,0.92) 30%, transparent)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: sector.color, boxShadow: `0 0 10px ${sector.color}` }} />
            <span className="text-[7px] sm:text-[8px] font-heading font-bold tracking-wider uppercase text-white/50">Live Preview</span>
          </div>
          <p className="text-[11px] sm:text-[13px] font-bold text-white leading-tight">{sector.name}</p>
          <p className="text-[7px] sm:text-[9px] text-white/35 mt-0.5">{sector.desc}</p>
        </div>

        {/* Color glow behind phone */}
        <div className="absolute -inset-8 rounded-[60px] -z-10 blur-[60px] opacity-25 group-hover:opacity-45 transition-opacity duration-500"
          style={{ background: sector.color }} />
      </div>
    </motion.div>
  );
}

/* Active sector info — shows at bottom on mobile, left on desktop */
function ActiveSectorInfo({ sector, navigate }: { sector: typeof SECTORS[0]; navigate: any }) {
  const slug = DEMO_SLUGS[sector.id as keyof typeof DEMO_SLUGS];
  const demoPath = sector.id === "food" ? `/r/${slug}` : `/demo/${slug}`;

  return (
    <>
      {/* Desktop — left panel */}
      <div className="absolute left-[5%] sm:left-[7%] top-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <motion.div
          key={sector.id}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 15 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-[220px]"
        >
          <div className="w-10 h-1.5 rounded-full mb-5" style={{ background: sector.color, boxShadow: `0 0 15px ${sector.color}60` }} />
          <p className="text-[0.65rem] font-heading font-bold tracking-[3px] uppercase mb-2.5" style={{ color: sector.color }}>{sector.name}</p>
          <p className="text-[0.8rem] text-white/45 leading-[1.7] mb-5">{sector.desc}</p>
          <button
            onClick={() => navigate(demoPath)}
            className="text-[0.65rem] font-heading font-semibold tracking-wider uppercase text-white/50 hover:text-white transition-colors flex items-center gap-2 group/btn">
            Esplora <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Mobile — bottom info bar */}
      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 z-20 lg:hidden px-4 w-full max-w-sm">
        <motion.div
          key={sector.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-[0.7rem] font-heading font-bold mb-1" style={{ color: sector.color }}>{sector.name}</p>
          <button
            onClick={() => navigate(demoPath)}
            className="text-[0.6rem] font-heading font-medium tracking-wider uppercase text-white/40 hover:text-white/70 transition-colors inline-flex items-center gap-1.5">
            Prova Demo <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>
      </div>
    </>
  );
}

function SectorIndicator({ scrollProgress, sectors, activeIdx }: { scrollProgress: any; sectors: typeof SECTORS; activeIdx: number }) {
  return (
    <div className="absolute bottom-[5%] sm:bottom-[6%] left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3">
      {sectors.map((sector, i) => (
        <div key={sector.id} className="flex flex-col items-center gap-1.5">
          <div className={`relative overflow-hidden rounded-full transition-all duration-500 ${i === activeIdx ? "w-7 h-2" : "w-2 h-2"}`}
            style={{ background: i === activeIdx ? sector.color : `${sector.color}40`, boxShadow: i === activeIdx ? `0 0 12px ${sector.color}60` : "none" }}
          />
          <span className={`text-[6px] sm:text-[7px] font-heading font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300 hidden sm:block ${i === activeIdx ? "text-white/60" : "text-white/20"}`}>
            {sector.name.split(" ")[0]}
          </span>
        </div>
      ))}
    </div>
  );
}
