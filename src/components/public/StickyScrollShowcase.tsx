import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DEMO_SLUGS } from "@/data/demo-industries";

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
    <div className={`relative aspect-[9/19.5] rounded-[32px] sm:rounded-[40px] overflow-hidden ${className}`}
      style={{
        border: "2px solid hsla(0,0%,100%,0.12)",
        background: "#050508",
        boxShadow: "0 40px 100px hsla(0,0%,0%,0.6), 0 8px 32px hsla(250,40%,30%,0.15), inset 0 1px 0 hsla(0,0%,100%,0.08)",
      }}>
      <div className="absolute top-[7px] sm:top-[9px] left-1/2 -translate-x-1/2 w-[36%] max-w-[52px] h-[12px] sm:h-[15px] bg-black rounded-full z-30"
        style={{ boxShadow: "0 0 0 1px hsla(0,0%,100%,0.05)" }} />
      <div className="absolute inset-[3px] rounded-[29px] sm:rounded-[37px] overflow-hidden bg-black">
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
        <div className="absolute inset-x-0 top-0 h-10" style={{ background: "linear-gradient(to bottom, hsla(0,0%,0%,0.35), transparent)" }} />
      </div>
      <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[28%] h-[3px] bg-white/15 rounded-full z-20" />
      <div className="absolute inset-0 rounded-[32px] sm:rounded-[40px] pointer-events-none" style={{ background: "linear-gradient(135deg, hsla(0,0%,100%,0.06) 0%, transparent 35%)" }} />
    </div>
  );
}

/**
 * StickyScrollShowcase — Active Theory inspired
 * Each sector phone enters from a unique direction with dramatic 3D transforms
 */
export default function StickyScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const sectorCount = SECTORS.length;

  return (
    <div ref={containerRef} className="relative" style={{ height: `${(sectorCount + 1.5) * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "linear-gradient(180deg, hsl(228 24% 4%) 0%, hsl(235 22% 6%) 50%, hsl(228 24% 4%) 100%)" }}>

        {/* Ambient orbs — refined */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute w-[800px] h-[800px] rounded-full blur-[250px] opacity-[0.04]"
            style={{ background: "hsl(250 55% 55%)", top: "5%", left: "0%" }}
            animate={{ x: [0, 40, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute w-[600px] h-[600px] rounded-full blur-[220px] opacity-[0.03]"
            style={{ background: "hsl(320 60% 50%)", bottom: "5%", right: "0%" }}
            animate={{ x: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: "linear-gradient(hsla(250,50%,70%,0.3) 1px, transparent 1px), linear-gradient(90deg, hsla(250,50%,70%,0.3) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        </div>

        {/* Title — always visible at top */}
        <div className="absolute top-[7%] sm:top-[9%] left-1/2 -translate-x-1/2 text-center z-20 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ background: "hsla(0,0%,100%,0.04)", border: "1px solid hsla(0,0%,100%,0.08)" }}>
            <span className="text-[0.55rem] font-heading font-semibold tracking-[3px] uppercase text-white/50">I nostri settori</span>
          </div>
          <h2 className="text-[clamp(1.5rem,4.5vw,3.2rem)] font-heading font-bold text-white leading-[1.05]">
            Un sistema.{" "}
            <span style={{
              background: "linear-gradient(135deg, hsl(195 100% 60%), hsl(250 85% 65%), hsl(320 70% 55%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Infiniti settori.</span>
          </h2>
        </div>

        {/* Active sector info — bottom */}
        <SectorIndicator scrollProgress={scrollYProgress} sectors={SECTORS} />

        {/* Phone stack — center with 3D perspective */}
        <div className="relative z-10 flex items-center justify-center" style={{ perspective: "1400px", perspectiveOrigin: "50% 45%" }}>
          {SECTORS.map((sector, i) => (
            <ScrollPhone key={sector.id} index={i} total={sectorCount} scrollProgress={scrollYProgress} sector={sector} navigate={navigate} />
          ))}
        </div>

        {/* Active sector panel — left side on desktop */}
        <ActiveSectorPanel scrollProgress={scrollYProgress} sectors={SECTORS} navigate={navigate} />
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

  // More dramatic 3D entry from alternating sides
  const fromRight = index % 2 === 0;
  const spreadX = (index - total / 2) * 22;

  const y = useTransform(scrollProgress, [entryStart, entryMid, stayEnd, exitEnd], [250, 0, 0, -200]);
  const x = useTransform(scrollProgress, [entryStart, entryMid, stayEnd, exitEnd], [fromRight ? 120 : -120, spreadX, spreadX, fromRight ? -80 : 80]);
  const scale = useTransform(scrollProgress, [entryStart, entryMid, stayEnd, exitEnd], [0.5, 0.82 + (total - index) * 0.025, 0.82 + (total - index) * 0.025, 0.4]);
  const opacity = useTransform(scrollProgress, [entryStart, entryStart + segmentSize * 0.15, stayEnd - segmentSize * 0.1, exitEnd], [0, 1, 1, 0]);
  const rotateY = useTransform(scrollProgress, [entryStart, entryMid], [fromRight ? 35 : -35, -2 + index * 1.5]);
  const rotateZ = useTransform(scrollProgress, [entryStart, entryMid], [fromRight ? 12 : -12, -1 + index * 0.8]);
  const rotateX = useTransform(scrollProgress, [entryStart, entryMid], [10, 0]);
  const zIndex = total - index;

  const slug = DEMO_SLUGS[sector.id as keyof typeof DEMO_SLUGS];
  const demoPath = sector.id === "food" ? `/r/${slug}` : `/demo/${slug}`;

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{ y, x, scale, opacity, rotateY, rotateZ, rotateX, zIndex, transformStyle: "preserve-3d", willChange: "transform" }}
      onClick={() => navigate(demoPath)}
      whileHover={{ scale: 0.88 }}>

      <div className="relative">
        <PhoneFrame src={sector.image} alt={sector.name} className="w-[150px] sm:w-[195px] lg:w-[220px]" />

        {/* Label overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 pt-8 rounded-b-[32px] sm:rounded-b-[40px] z-20"
          style={{ background: "linear-gradient(to top, hsla(0,0%,0%,0.9) 25%, transparent)" }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sector.color, boxShadow: `0 0 8px ${sector.color}` }} />
            <span className="text-[7px] font-heading font-bold tracking-wider uppercase text-white/50">Live Preview</span>
          </div>
          <p className="text-[10px] sm:text-[12px] font-bold text-white leading-tight">{sector.name}</p>
          <p className="text-[7px] sm:text-[8px] text-white/35 mt-0.5">{sector.desc}</p>
        </div>

        {/* Color glow behind phone — more refined */}
        <div className="absolute -inset-6 rounded-[50px] -z-10 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"
          style={{ background: sector.color }} />
      </div>
    </motion.div>
  );
}

/* Active sector panel — shows on the left when a sector is active */
function ActiveSectorPanel({ scrollProgress, sectors, navigate }: { scrollProgress: any; sectors: typeof SECTORS; navigate: any }) {
  const segmentSize = 1 / (sectors.length + 1.5);

  return (
    <div className="absolute left-[5%] sm:left-[8%] top-1/2 -translate-y-1/2 z-20 hidden lg:block">
      {sectors.map((sector, i) => {
        const start = i * segmentSize;
        const end = (i + 1) * segmentSize;
        return <SectorPanel key={sector.id} sector={sector} start={start} end={end} scrollProgress={scrollProgress} navigate={navigate} />;
      })}
    </div>
  );
}

function SectorPanel({ sector, start, end, scrollProgress, navigate }: any) {
  const opacity = useTransform(scrollProgress, [start, start + 0.03, end - 0.03, end], [0, 1, 1, 0]);
  const y = useTransform(scrollProgress, [start, start + 0.03, end - 0.03, end], [20, 0, 0, -20]);

  const slug = DEMO_SLUGS[sector.id as keyof typeof DEMO_SLUGS];
  const demoPath = sector.id === "food" ? `/r/${slug}` : `/demo/${slug}`;

  return (
    <motion.div className="absolute top-0 left-0" style={{ opacity, y }}>
      <div className="w-[200px]">
        <div className="w-8 h-1 rounded-full mb-4" style={{ background: sector.color }} />
        <p className="text-[0.6rem] font-heading font-bold tracking-[3px] uppercase mb-2" style={{ color: sector.color }}>{sector.name}</p>
        <p className="text-[0.75rem] text-white/40 leading-[1.7] mb-4">{sector.desc}</p>
        <button
          onClick={() => navigate(demoPath)}
          className="text-[0.6rem] font-heading font-semibold tracking-wider uppercase text-white/50 hover:text-white transition-colors flex items-center gap-1.5">
          Esplora →
        </button>
      </div>
    </motion.div>
  );
}

function SectorIndicator({ scrollProgress, sectors }: { scrollProgress: any; sectors: typeof SECTORS }) {
  const segmentSize = 1 / (sectors.length + 1.5);
  return (
    <div className="absolute bottom-[7%] sm:bottom-[9%] left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
      {sectors.map((sector, i) => {
        const start = i * segmentSize;
        const end = (i + 1) * segmentSize;
        return <SectorDot key={sector.id} sector={sector} start={start} end={end} scrollProgress={scrollProgress} />;
      })}
    </div>
  );
}

function SectorDot({ sector, start, end, scrollProgress }: any) {
  const dotScale = useTransform(scrollProgress, [start, start + 0.02, end - 0.02, end], [1, 1.5, 1.5, 1]);
  const dotOpacity = useTransform(scrollProgress, [start, start + 0.02, end - 0.02, end], [0.25, 1, 1, 0.25]);
  const barWidth = useTransform(scrollProgress, [start, start + 0.02, end - 0.02, end], ["0%", "100%", "100%", "0%"]);

  return (
    <motion.div className="flex flex-col items-center gap-1.5" style={{ opacity: dotOpacity, scale: dotScale }}>
      <div className="relative w-6 h-1 rounded-full overflow-hidden" style={{ background: `${sector.color}20` }}>
        <motion.div className="absolute inset-0 rounded-full" style={{ background: sector.color, width: barWidth }} />
      </div>
      <span className="text-[6px] sm:text-[7px] font-heading font-bold tracking-wider uppercase text-white/40 hidden sm:block whitespace-nowrap">
        {sector.name.split(" ")[0]}
      </span>
    </motion.div>
  );
}
