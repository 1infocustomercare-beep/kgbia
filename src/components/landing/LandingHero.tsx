import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import videoHeroDefault from "@/assets/video-hero-empire.mp4";

const HERO_SECTORS = [
  { id: "food", label: "Ristorazione" },
  { id: "ncc", label: "NCC Premium" },
  { id: "beauty", label: "Beauty" },
  { id: "healthcare", label: "Salute" },
  { id: "fitness", label: "Fitness" },
  { id: "hospitality", label: "Hotel" },
  { id: "retail", label: "Retail" },
];

function getScreens(sectorId: string): [string, string, string] {
  const imgs = SECTOR_MOCKUP_IMAGES[sectorId];
  if (imgs && imgs.length >= 3) return [imgs[0], imgs[1], imgs[2]];
  if (imgs && imgs.length >= 1) return [imgs[0], imgs[0], imgs[0]];
  return ["", "", ""];
}

const PhoneFrame = ({ src, alt, sizeClass, zIndex, mb, mx }: { src: string; alt: string; sizeClass: string; zIndex: number; mb?: string; mx?: string }) => (
  <div className={`relative ${sizeClass} aspect-[9/19.5] rounded-[26px] sm:rounded-[36px] overflow-hidden`}
    style={{ border: "2.5px solid hsl(220 12% 82%)", background: "#0a0a12", zIndex, marginBottom: mb, marginLeft: mx, marginRight: mx, boxShadow: "0 30px 60px hsla(0,0%,0%,0.22), 0 8px 24px hsla(265,30%,30%,0.1)" }}>
    <div className="absolute top-[6px] sm:top-[8px] left-1/2 -translate-x-1/2 w-[34%] max-w-[48px] h-[10px] sm:h-[14px] bg-black rounded-full z-30" />
    <div className="absolute inset-[3px] rounded-[23px] sm:rounded-[33px] overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
    </div>
    <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[30%] h-[3px] bg-white/20 rounded-full z-20" />
    <div className="absolute inset-0 rounded-[26px] sm:rounded-[36px] pointer-events-none" style={{ background: "linear-gradient(135deg, hsla(0,0%,100%,0.08) 0%, transparent 40%)" }} />
  </div>
);

export default function LandingHero() {
  const navigate = useNavigate();
  const [sectorIdx, setSectorIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setInterval(() => setSectorIdx((p) => (p + 1) % HERO_SECTORS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const current = HERO_SECTORS[sectorIdx];
  const screens = getScreens(current.id);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-24 sm:pt-28 pb-16 px-5 overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-[0.06]" src={videoHeroDefault} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsla(230,24%,7%,0.7) 0%, hsla(230,24%,7%,0.4) 50%, hsla(230,24%,7%,0.95) 100%)" }} />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[200px] opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(ellipse, hsla(265,60%,55%,0.5), hsla(38,50%,50%,0.3), transparent)" }} />

      <div className="relative z-10 max-w-[1100px] mx-auto text-center">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: "hsla(38,50%,55%,0.08)", border: "1px solid hsla(38,50%,55%,0.15)" }}>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[0.6rem] font-heading font-bold tracking-[3px] uppercase text-white/60">Piattaforma AI Italiana · 25+ Settori</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-[clamp(2.2rem,7vw,5rem)] font-heading font-black leading-[1.02] tracking-tight mb-6">
          <span className="text-white">Trasformiamo</span>
          <br />
          <span className="text-white">il Digitale in </span>
          <span className="text-shimmer">Profitto</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-foreground/50 max-w-[600px] mx-auto text-sm sm:text-base leading-[1.8] mb-10">
          La prima piattaforma AI all-in-one che gestisce, automatizza e fa crescere il tuo business. 98+ agenti IA, ROI garantito in 90 giorni.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <motion.button onClick={() => navigate("/demo")} className="group px-8 py-4 rounded-2xl text-primary-foreground font-bold text-sm tracking-wider uppercase flex items-center gap-2 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsla(38,55%,48%,1), hsla(30,45%,38%,1))", boxShadow: "0 6px 30px hsla(38,55%,50%,0.3)" }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <motion.div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)" }} animate={{ x: ["-200%", "300%"] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />
            <span className="relative z-10 flex items-center gap-2">Scopri i Progetti <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </motion.button>
          <motion.button onClick={() => scrollTo("pricing")} className="px-8 py-4 rounded-2xl text-white/60 font-semibold text-sm tracking-wide flex items-center gap-2 hover:text-white transition-colors" style={{ border: "1px solid hsla(0,0%,100%,0.1)", background: "hsla(0,0%,100%,0.04)" }} whileHover={{ scale: 1.02 }}>
            <Play className="w-4 h-4" /> Piani & Prezzi
          </motion.button>
        </motion.div>

        {/* Phone Carousel */}
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1, duration: 1 }} className="relative flex flex-col items-center">
          <div className="absolute inset-[-25%] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, hsla(265,50%,50%,0.12), hsla(168,45%,45%,0.08), transparent 70%)" }} />
          <AnimatePresence mode="wait">
            <motion.div key={sectorIdx} className="flex items-end justify-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6 }}>
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5.5, repeat: Infinity, delay: 0.8 }} style={{ marginRight: "-16px", marginBottom: "28px" }}>
                <PhoneFrame src={screens[1]} alt={`${current.label} 2`} sizeClass="w-[120px] sm:w-[145px] lg:w-[175px]" zIndex={5} />
              </motion.div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} style={{ zIndex: 20 }}>
                <PhoneFrame src={screens[0]} alt={`${current.label} 1`} sizeClass="w-[155px] sm:w-[185px] lg:w-[225px]" zIndex={20} />
              </motion.div>
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 5.8, repeat: Infinity, delay: 1.5 }} style={{ marginLeft: "-16px", marginBottom: "18px" }}>
                <PhoneFrame src={screens[2]} alt={`${current.label} 3`} sizeClass="w-[125px] sm:w-[150px] lg:w-[180px]" zIndex={8} />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Label */}
          <AnimatePresence mode="wait">
            <motion.div key={sectorIdx} className="mt-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <span className="text-[0.65rem] sm:text-[0.75rem] font-heading font-bold tracking-[2px] uppercase text-primary">{current.label}</span>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap justify-center max-w-[260px]">
            {HERO_SECTORS.map((_, i) => (
              <button key={i} onClick={() => setSectorIdx(i)} className={`rounded-full transition-all duration-300 ${i === sectorIdx ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-foreground/15 hover:bg-foreground/25"}`} />
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="mt-12 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <motion.button onClick={() => scrollTo("industries")} className="text-foreground/20 hover:text-foreground/40 transition-colors" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
