import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { MockupLightbox } from "@/components/ui/mockup-lightbox";
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

/* iPhone frame with Dynamic Island */
function PhoneFrame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative aspect-[9/19.5] rounded-[28px] sm:rounded-[36px] overflow-hidden ${className}`}
      style={{
        border: "2.5px solid hsl(220 10% 78%)",
        background: "#0a0a12",
        boxShadow: "0 30px 80px hsla(0,0%,0%,0.5), 0 8px 24px hsla(265,30%,30%,0.12), inset 0 1px 0 hsla(0,0%,100%,0.06)",
      }}>
      <div className="absolute top-[6px] sm:top-[8px] left-1/2 -translate-x-1/2 w-[34%] max-w-[48px] h-[10px] sm:h-[14px] bg-black rounded-full z-30"
        style={{ boxShadow: "0 0 0 1px hsla(0,0%,100%,0.06)" }} />
      <div className="absolute inset-[3px] rounded-[25px] sm:rounded-[33px] overflow-hidden bg-black">
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" style={{ borderRadius: 0 }} />
        <div className="absolute inset-x-0 top-0 h-8" style={{ background: "linear-gradient(to bottom, hsla(0,0%,0%,0.3), transparent)" }} />
      </div>
      <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[30%] h-[3px] bg-white/20 rounded-full z-20" />
      <div className="absolute inset-0 rounded-[28px] sm:rounded-[36px] pointer-events-none" style={{ background: "linear-gradient(135deg, hsla(0,0%,100%,0.08) 0%, transparent 40%)" }} />
    </div>
  );
}

/**
 * Sticky scroll showcase — activetheory.net inspired
 * As user scrolls through a tall container, phones animate in one by one with parallax
 */
export default function StickyScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // Each sector gets a segment of the scroll
  const sectorCount = SECTORS.length;

  return (
    <div ref={containerRef} className="relative" style={{ height: `${(sectorCount + 1) * 100}vh` }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "linear-gradient(180deg, hsl(228 22% 6%) 0%, hsl(235 20% 8%) 50%, hsl(228 22% 6%) 100%)" }}>

        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[200px] opacity-[0.04]"
            style={{ background: "hsl(265 55% 55%)", top: "10%", left: "5%" }} />
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[180px] opacity-[0.03]"
            style={{ background: "hsl(38 55% 50%)", bottom: "10%", right: "5%" }} />
        </div>

        {/* Section title */}
        <div className="absolute top-[8%] sm:top-[10%] left-1/2 -translate-x-1/2 text-center z-20 px-4">
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--empire-violet) / 0.06))",
              border: "1px solid hsl(var(--primary) / 0.12)",
            }}>
            <span className="text-[0.6rem] font-heading font-bold tracking-[3px] uppercase text-white/70">I NOSTRI SETTORI</span>
          </motion.div>
          <h2 className="text-[clamp(1.4rem,4vw,2.8rem)] font-heading font-bold text-white leading-[1.1]">
            Un sistema.<br />
            <span style={{
              background: "linear-gradient(135deg, hsl(210 100% 65%), hsl(250 85% 68%), hsl(172 80% 52%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Infiniti settori.</span>
          </h2>
        </div>

        {/* Active sector info — bottom */}
        <SectorIndicator scrollProgress={scrollYProgress} sectors={SECTORS} />

        {/* Phone stack — center */}
        <div className="relative z-10 flex items-center justify-center" style={{ perspective: "1200px" }}>
          {SECTORS.map((sector, i) => (
            <ScrollPhone
              key={sector.id}
              index={i}
              total={sectorCount}
              scrollProgress={scrollYProgress}
              sector={sector}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScrollPhone({
  index, total, scrollProgress, sector, navigate
}: {
  index: number; total: number; scrollProgress: any; sector: typeof SECTORS[0]; navigate: any;
}) {
  const segmentSize = 1 / (total + 1);
  const entryStart = index * segmentSize;
  const entryEnd = entryStart + segmentSize * 0.6;
  const stayEnd = (index + 1) * segmentSize;
  const exitEnd = stayEnd + segmentSize * 0.4;

  // Entry: slide in from bottom-right with rotation
  const y = useTransform(scrollProgress, [entryStart, entryEnd, stayEnd, Math.min(exitEnd, 1)], [200, 0, 0, -150]);
  const x = useTransform(scrollProgress, [entryStart, entryEnd, stayEnd, Math.min(exitEnd, 1)], [80 + index * 20, index * 15 - (total * 7.5), index * 15 - (total * 7.5), -80 - index * 20]);
  const scale = useTransform(scrollProgress, [entryStart, entryEnd, stayEnd, Math.min(exitEnd, 1)], [0.6, 0.85 + (total - index) * 0.02, 0.85 + (total - index) * 0.02, 0.5]);
  const opacity = useTransform(scrollProgress, [entryStart, entryStart + segmentSize * 0.2, stayEnd, Math.min(exitEnd, 1)], [0, 1, 1, 0]);
  const rotateY = useTransform(scrollProgress, [entryStart, entryEnd], [25 - index * 5, -2 + index * 2]);
  const rotateZ = useTransform(scrollProgress, [entryStart, entryEnd], [8, -1 + index * 0.5]);
  const zIndex = total - index;

  const slug = DEMO_SLUGS[sector.id as keyof typeof DEMO_SLUGS];
  const demoPath = sector.id === "food" ? `/r/${slug}` : `/demo/${slug}`;

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ y, x, scale, opacity, rotateY, rotateZ, zIndex, willChange: "transform" }}
      onClick={() => navigate(demoPath)}
      whileHover={{ scale: 0.92 }}>

      <div className="relative">
        <PhoneFrame src={sector.image} alt={sector.name} className="w-[140px] sm:w-[185px] lg:w-[210px]" />

        {/* Label overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 pt-6 rounded-b-[28px] sm:rounded-b-[36px] z-20"
          style={{ background: "linear-gradient(to top, hsla(0,0%,0%,0.85) 20%, transparent)" }}>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[6px] px-1.5 py-[2px] rounded-full font-bold tracking-wider uppercase"
              style={{ background: `${sector.color}30`, color: sector.color, border: `1px solid ${sector.color}40` }}>
              ★ Live
            </span>
          </div>
          <p className="text-[9px] sm:text-[11px] font-bold text-white leading-tight">{sector.name}</p>
          <p className="text-[6px] sm:text-[7px] text-white/40">{sector.desc}</p>
        </div>

        {/* Color glow behind phone */}
        <div className="absolute -inset-4 rounded-[40px] -z-10 blur-[40px] opacity-30"
          style={{ background: sector.color }} />
      </div>
    </motion.div>
  );
}

function SectorIndicator({ scrollProgress, sectors }: { scrollProgress: any; sectors: typeof SECTORS }) {
  const segmentSize = 1 / (sectors.length + 1);

  return (
    <div className="absolute bottom-[8%] sm:bottom-[10%] left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
      {sectors.map((sector, i) => {
        const start = i * segmentSize;
        const end = (i + 1) * segmentSize;
        return <SectorDot key={sector.id} sector={sector} index={i} start={start} end={end} scrollProgress={scrollProgress} />;
      })}
    </div>
  );
}

function SectorDot({ sector, index, start, end, scrollProgress }: any) {
  const isActive = useTransform(scrollProgress, (v: number) => v >= start && v < end);
  // We can't directly use isActive in className, so use opacity transform
  const dotScale = useTransform(scrollProgress, [start, start + 0.02, end - 0.02, end], [1, 1.4, 1.4, 1]);
  const dotOpacity = useTransform(scrollProgress, [start, start + 0.02, end - 0.02, end], [0.3, 1, 1, 0.3]);

  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      style={{ opacity: dotOpacity, scale: dotScale }}>
      <div className="w-2 h-2 rounded-full transition-colors" style={{ background: sector.color }} />
      <span className="text-[6px] sm:text-[7px] font-heading font-bold tracking-wider uppercase text-white/50 hidden sm:block whitespace-nowrap">
        {sector.name.split(" ")[0]}
      </span>
    </motion.div>
  );
}
