import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const MOCKUPS = [
  { src: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, label: "COTE Miami", cat: "Restaurant" },
  { src: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, label: "Aura Spa", cat: "Wellness" },
  { src: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`, label: "Neo Nails", cat: "Beauty" },
  { src: `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`, label: "City Padel", cat: "Sports" },
  { src: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, label: "DIMORA", cat: "Real Estate" },
  { src: `${S}/Paperfish%20Sushi/a-sakura-home.png`, label: "Paperfish", cat: "Sushi" },
  { src: `${S}/Aloha%20Pet%20Resorts/mobile-a-home.png`, label: "Aloha Pets", cat: "Pet Care" },
  { src: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, label: "FAR Medical", cat: "Healthcare" },
];

const TRUST = ["847+ Imprese Attive", "25+ Settori", "98 Agenti IA", "Garanzia 90 Giorni"];

export default function LandingHero() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Typing effect
  const [typed, setTyped] = useState("");
  const fullText = "Automatizziamo il tuo business con l'Intelligenza Artificiale.";
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTyped(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(timer);
    }, 28);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[110vh] flex flex-col overflow-hidden"
      onMouseMove={(e) => {
        if (isMobile) return;
        const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        setMousePos({ x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy });
      }}
    >
      {/* Ambient grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(126,183,190,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(126,183,190,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent)",
        }} />
      </div>

      {/* Ambient glows */}
      <motion.div className="absolute w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none z-[1]"
        style={{ background: "radial-gradient(circle, rgba(126,183,190,0.12), transparent 70%)", top: "10%", right: "-10%" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none z-[1]"
        style={{ background: "radial-gradient(circle, rgba(108,60,224,0.1), transparent 70%)", bottom: "20%", left: "-8%" }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} />

      {/* MAIN CONTENT */}
      <div className="relative z-[2] flex-1 flex flex-col justify-center items-center pt-[140px] pb-8 px-5">
        <motion.div style={{ y: titleY }} className="text-center max-w-[900px] mx-auto mb-10 lg:mb-14">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-[rgba(126,183,190,0.2)] bg-[rgba(126,183,190,0.04)]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
            <span className="text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-semibold">Piattaforma AI #1 in Italia</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-[clamp(2.6rem,6vw,5.8rem)] font-heading font-extrabold leading-[0.92] tracking-[-0.02em] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <motion.span
              className="block text-white"
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            >
              Il Tuo Business.
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-[#7eb7be] via-[#9b8ade] to-[#6c3ce0] bg-clip-text text-transparent"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.8, duration: 1.1, ease: "easeOut" }}
            >
              Completamente Automatizzato.
            </motion.span>
          </motion.h1>

          {/* Typing subtitle */}
          <motion.p
            className="text-white/50 text-[clamp(1rem,1.8vw,1.25rem)] leading-[1.7] max-w-[600px] mx-auto mb-10 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {typed}
            <span className="inline-block w-[2px] h-[1em] bg-[#7eb7be] ml-0.5 animate-pulse align-text-bottom" />
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <button
              onClick={() => navigate("/demo")}
              className="group px-10 py-4 rounded-full text-white font-semibold text-sm font-heading inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-[2px]"
              style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", boxShadow: "0 16px 48px rgba(126,183,190,0.3)" }}
            >
              Vedi i Progetti
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={() => document.getElementById("prezzi")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-4 rounded-full text-white/80 font-semibold text-sm border border-white/[0.12] hover:border-[#7eb7be]/50 hover:text-white transition-all"
            >
              Scopri i Piani
            </button>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            {TRUST.map((t) => (
              <span key={t} className="text-[11px] text-white/25 font-medium tracking-wide flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#7eb7be]/40" />
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* SCROLL-REVEAL MOCKUP FAN — visible as user scrolls */}
        <motion.div
          style={{ y: mockupY }}
          className="relative w-full max-w-[1100px] mx-auto"
        >
          <div className="relative flex justify-center items-end" style={{ height: isMobile ? "220px" : "380px", perspective: "1800px" }}>
            {MOCKUPS.map((m, i) => {
              const total = MOCKUPS.length;
              const center = (total - 1) / 2;
              const offset = i - center;
              const spreadX = isMobile ? 42 : 72;
              const spreadY = isMobile ? 2 : 6;
              const rot = offset * (isMobile ? 4 : 5.5);
              const phoneW = isMobile ? 90 : 150;
              const pxX = mousePos.x * (Math.abs(offset) < 2 ? 8 : 4);
              const pxY = mousePos.y * 4;

              return (
                <motion.div
                  key={i}
                  className="absolute bottom-0 group cursor-pointer"
                  style={{
                    width: phoneW,
                    zIndex: total - Math.abs(offset) + (i === Math.round(center) ? 10 : 0),
                  }}
                  initial={{ y: 200, opacity: 0, scale: 0.7, rotate: rot * 2 }}
                  whileInView={{
                    y: -Math.abs(offset) * spreadY,
                    x: offset * spreadX,
                    opacity: 1,
                    scale: 1 - Math.abs(offset) * 0.03,
                    rotate: rot,
                    rotateY: pxX,
                    rotateX: -pxY * 0.3,
                  }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    delay: 0.15 + Math.abs(offset) * 0.08,
                    duration: 1.2,
                    type: "spring",
                    stiffness: 50,
                    damping: 14,
                  }}
                  whileHover={{ scale: 1.06, zIndex: 30, y: -20 }}
                >
                  {/* iPhone frame */}
                  <div
                    className="relative aspect-[9/19.5] rounded-[18%/8%] border-[2.5px] overflow-hidden"
                    style={{
                      borderColor: "rgba(255,255,255,0.1)",
                      background: "#0a0a14",
                      boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)`,
                    }}
                  >
                    <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[28%] h-[3%] bg-black rounded-full z-20" />
                    <div className="absolute inset-[2px] rounded-[16%/7%] overflow-hidden">
                      <img src={m.src} alt={m.label} loading="eager" className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                    <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[26%] h-[1.5%] bg-white/15 rounded-full z-20" />
                  </div>
                  {/* Hover label */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                    <p className="text-[10px] font-semibold text-white">{m.label}</p>
                    <p className="text-[8px] text-white/35">{m.cat}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {/* Reflection gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#020204] to-transparent z-[20] pointer-events-none" />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-[3]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <span className="text-[9px] tracking-[3px] uppercase text-white/15 font-medium">Scorri per scoprire</span>
        <motion.div
          className="w-[1px] h-7"
          style={{ background: "linear-gradient(#7eb7be, transparent)" }}
          animate={{ scaleY: [1, 0.3, 1], opacity: [0.8, 0.15, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
