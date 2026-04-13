import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const HERO_PHONES = [
  { img: `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`, alt: "Flame Kebab" },
  { img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, alt: "Aura Spa" },
  { img: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`, alt: "Neo Nails" },
  { img: `${S}/Top%20Golf%20Bay%20App/a-official-home.png`, alt: "Top Golf Bay" },
  { img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, alt: "DIMORA Milano" },
];

const CAROUSEL_SETS = [
  [
    `${S}/flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png`,
    `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`,
    `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`,
    `${S}/Top%20Golf%20Bay%20App/a-official-home.png`,
    `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`,
  ],
  [
    `${S}/COTE%20Miami/a-obsidian-mobile-home.png`,
    `${S}/City%20Padel%20Milano/mobile-sage-luxe-home.png`,
    `${S}/Paperfish%20Sushi/b-luxury-dark-home.png`,
    `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`,
    `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`,
  ],
  [
    `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png`,
    `${S}/Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png`,
    `${S}/Miami%20Watersports/style-a-mobile-home.png`,
    `${S}/Tatush%20Hair%20Fragrance/mobile-home.png`,
    `${S}/Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png`,
  ],
];

const PHONE_LAYOUT = [
  { x: -150, y: 35, rot: -12, z: 4, s: 0.95, xm: -80, ym: 15, sm: 0.82 },
  { x: -75, y: -18, rot: -6, z: 7, s: 1.02, xm: -40, ym: -8, sm: 0.88 },
  { x: 0, y: -35, rot: 0, z: 10, s: 1.08, xm: 0, ym: -15, sm: 0.92 },
  { x: 75, y: -18, rot: 6, z: 7, s: 1.02, xm: 40, ym: -8, sm: 0.88 },
  { x: 150, y: 35, rot: 12, z: 4, s: 0.95, xm: 80, ym: 15, sm: 0.82 },
];

export default function LandingHero() {
  const navigate = useNavigate();
  const [setIdx, setSetIdx] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

  useEffect(() => {
    const t = setInterval(() => setSetIdx((p) => (p + 1) % CAROUSEL_SETS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const currentSet = CAROUSEL_SETS[setIdx];

  return (
    <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-[120px] pb-16 lg:pb-20 px-5 lg:px-10"
      onMouseMove={(e) => {
        if (isMobile) return;
        const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        setMousePos({ x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy });
      }}>
      
      {/* Grid background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent)",
        }} />
      </div>

      {/* Glows */}
      <motion.div className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-[1]"
        style={{ background: "#6c3ce0", top: "5%", right: "-5%", opacity: 0.08 }}
        animate={{ x: [0, 20, 0], y: [0, 15, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none z-[1]"
        style={{ background: "#7eb7be", bottom: "10%", right: "15%", opacity: 0.06 }}
        animate={{ x: [0, -20, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }} />
      <motion.div className="absolute w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none z-[1]"
        style={{ background: "#d4a855", top: "50%", left: "-5%", opacity: 0.04 }}
        animate={{ x: [0, 15, 0], y: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }} />

      <div className="relative z-[2] flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-[1320px] mx-auto w-full">
        {/* Left - Text */}
        <div className="flex-1 max-w-[580px] text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-[rgba(126,183,190,0.2)] bg-[rgba(126,183,190,0.04)]">
            <span className="w-[7px] h-[7px] rounded-full bg-green-500 shadow-[0_0_6px_#22c55e] animate-pulse" />
            <span className="text-[11px] tracking-[3px] uppercase text-[#7eb7be] font-semibold font-heading">Piattaforma AI Italiana · 25+ Settori</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
            className="text-[clamp(2.4rem,5.5vw,5.2rem)] font-heading font-extrabold leading-[0.94] tracking-tight mb-6">
            <motion.span className="block text-white" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} transition={{ delay: 0.5, duration: 1.1, ease: "easeOut" }}>
              TRASFORMIAMO
            </motion.span>
            <motion.span className="block" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.3)", color: "transparent" }}
              initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ delay: 0.7, duration: 1.1, ease: "easeOut" }}>
              LE IMPRESE
            </motion.span>
            <motion.span className="block text-white" initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ delay: 0.9, duration: 1.1, ease: "easeOut" }}>
              CON L'<span className="bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">IA</span>
            </motion.span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
            className="text-white/55 text-[17px] leading-[1.8] mb-10 max-w-[460px] mx-auto lg:mx-0">
            La prima piattaforma AI all-in-one che gestisce, automatizza e fa crescere il tuo business. 98+ agenti IA, 25+ settori.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
            <button onClick={() => navigate("/demo")}
              className="group px-8 py-4 rounded-full text-white font-semibold text-sm font-heading inline-flex items-center gap-2 transition-all hover:-translate-y-[3px]"
              style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", boxShadow: "0 16px 48px rgba(126,183,190,0.25)" }}>
              Scopri i Progetti →
            </button>
            <button onClick={() => document.getElementById("prezzi")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 rounded-full text-white font-semibold text-sm border border-white/[0.14] bg-transparent hover:border-[#7eb7be] hover:text-[#7eb7be] transition-all">
              Piani & Prezzi
            </button>
          </motion.div>
        </div>

        {/* Right - 5 Phones */}
        <div className="flex-1 flex justify-center items-center min-h-[300px] lg:min-h-[500px] relative" style={{ perspective: "1600px" }}>
          <AnimatePresence mode="wait">
            <motion.div key={setIdx} className="relative w-full h-full flex justify-center items-center" 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              {currentSet.map((img, i) => {
                const p = PHONE_LAYOUT[i];
                const parallaxX = mousePos.x * (i === 2 ? 10 : i === 1 || i === 3 ? 7 : 4);
                const parallaxY = mousePos.y * (i === 2 ? 10 : i === 1 || i === 3 ? 7 : 4) * 0.5;
                return (
                  <motion.div key={i}
                    className="absolute overflow-hidden"
                    style={{
                      width: isMobile ? "130px" : "180px",
                      borderRadius: isMobile ? "18px" : "26px",
                      border: `${isMobile ? 3 : 4}px solid rgba(255,255,255,0.08)`,
                      zIndex: p.z,
                      boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
                    }}
                    initial={{ scale: 0, y: 200, opacity: 0, rotation: p.rot * 2 }}
                    animate={{
                      x: isMobile ? p.xm : p.x,
                      y: isMobile ? p.ym : p.y,
                      scale: isMobile ? p.sm : p.s,
                      opacity: 1,
                      rotation: p.rot,
                      rotateY: parallaxX,
                      rotateX: -parallaxY,
                    }}
                    transition={{ 
                      scale: { delay: 0.8 + i * 0.12, duration: 1.4, type: "spring", stiffness: 60 },
                      opacity: { delay: 0.8 + i * 0.12, duration: 0.6 },
                      x: { delay: 0.8 + i * 0.12, duration: 1.4, type: "spring" },
                      y: { delay: 0.8 + i * 0.12, duration: 1.4, type: "spring" },
                      rotateY: { duration: 0.6 },
                      rotateX: { duration: 0.6 },
                    }}
                    whileHover={{ scale: (isMobile ? p.sm : p.s) * 1.08, zIndex: 20, boxShadow: "0 40px 100px rgba(126,183,190,0.3), 0 0 0 2px rgba(126,183,190,0.2)" }}
                  >
                    <img src={img} alt={`Preview ${i}`} className="w-full block" loading="eager" />
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Carousel dots */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {CAROUSEL_SETS.map((_, i) => (
              <button key={i} onClick={() => setSetIdx(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ background: i === setIdx ? "#7eb7be" : "rgba(255,255,255,0.2)", transform: i === setIdx ? "scale(1.4)" : "scale(1)" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-[3]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <span className="text-[10px] tracking-[3px] uppercase text-white/20">scroll</span>
        <motion.div className="w-[1px] h-8" style={{ background: "linear-gradient(#7eb7be, transparent)" }}
          animate={{ scaleY: [1, 0.4, 1], opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      </motion.div>
    </section>
  );
}
