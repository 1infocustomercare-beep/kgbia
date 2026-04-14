import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
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

/* ── Mockup phone ── */
function MockupPhone({ m, i, total, progress, isMobile }: {
  m: typeof MOCKUPS[0]; i: number; total: number; progress: number; isMobile: boolean;
}) {
  const center = (total - 1) / 2;
  const offset = i - center;
  const spreadX = isMobile ? 44 : 76;
  const spreadY = isMobile ? 3 : 8;
  const rot = offset * (isMobile ? 4 : 5.5);
  const phoneW = isMobile ? 85 : 150;

  const stagger = Math.abs(offset) * 0.1;
  const localP = Math.max(0, Math.min(1, (progress - stagger) / (1 - stagger)));
  const eased = 1 - Math.pow(1 - localP, 3);

  const x = eased * offset * spreadX;
  const y = 180 * (1 - eased) + (-Math.abs(offset) * spreadY * eased);
  const opacity = Math.min(1, localP * 3);
  const scale = 0.55 + eased * (0.45 - Math.abs(offset) * 0.03);
  const rotate = eased * rot;

  return (
    <div
      className="absolute bottom-0 cursor-pointer"
      style={{
        width: phoneW,
        zIndex: total - Math.abs(offset) + (i === Math.round(center) ? 10 : 0),
        transform: `translateX(${x}px) translateY(${y}px) rotate(${rotate}deg) scale(${scale})`,
        opacity,
        willChange: "transform, opacity",
      }}
    >
      <div
        className="relative aspect-[9/19.5] rounded-[18%/8%] border-[2.5px] overflow-hidden"
        style={{
          borderColor: "rgba(255,255,255,0.12)",
          background: "#0a0a14",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[28%] h-[3%] bg-black rounded-full z-20" />
        <div className="absolute inset-[2px] rounded-[16%/7%] overflow-hidden">
          <img src={m.src} alt={m.label} loading="eager" className="w-full h-full object-cover object-top" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
        <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[26%] h-[1.5%] bg-white/15 rounded-full z-20" />
      </div>
      <div
        className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-center transition-opacity duration-500"
        style={{ opacity: localP > 0.85 ? 1 : 0 }}
      >
        <p className="text-[10px] font-semibold text-white">{m.label}</p>
        <p className="text-[8px] text-white/50">{m.cat}</p>
      </div>
    </div>
  );
}

export default function LandingHero() {
  const navigate = useNavigate();
  const outerRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

  /* ── Scroll tracking on the tall outer wrapper ── */
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  /* ── Title: cinematic depth on scroll (0→0.2) ── */
  const titleScale = useTransform(scrollYProgress, [0, 0.2, 0.75, 1], [0.88, 1, 1, 0.95]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0.4, 1, 1, 0.6]);
  const titleY = useTransform(scrollYProgress, [0, 0.2, 0.75, 1], [40, 0, 0, -30]);
  const titleBlurVal = useTransform(scrollYProgress, [0, 0.15], [4, 0]);
  const titleBlurFilter = useTransform(titleBlurVal, v => `blur(${v}px)`);

  /* ── Mockup fan progress (0.1 → 0.6 of scroll) ── */
  const [fanProgress, setFanProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setFanProgress(Math.max(0, Math.min(1, (v - 0.1) / 0.5)));
  });

  /* ── Typing effect ── */
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
    /* 
      Outer wrapper = 280vh tall → creates the scroll runway.
      Inner sticky div = pinned at top for 180vh of scrolling.
    */
    <section ref={outerRef} id="hero" style={{ height: "280vh" }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ── BG ── */}
        <div className="absolute inset-0 z-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(13,13,30,0.95) 0%, #020204 70%)",
        }} />
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(126,183,190,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(126,183,190,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent)",
          }} />
        </div>
        {/* Glow */}
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none z-[1]"
          style={{ background: "radial-gradient(circle, rgba(126,183,190,0.13), transparent 70%)", top: "5%", right: "-10%" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none z-[1]"
          style={{ background: "radial-gradient(circle, rgba(108,60,224,0.10), transparent 70%)", bottom: "10%", left: "-8%" }} />

        {/* ── CONTENT ── */}
        <div className="relative z-[2] h-full flex flex-col justify-center items-center px-5 pt-16">

          {/* Title block — cinematic depth driven by scroll */}
          <motion.div
            className="text-center max-w-[900px] mx-auto mb-4 lg:mb-8"
            style={{
              scale: titleScale,
              opacity: titleOpacity,
              y: titleY,
              filter: titleBlurFilter,
            }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-7 border border-[rgba(126,183,190,0.25)] bg-[rgba(126,183,190,0.06)] backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#22c55e] animate-pulse" />
              <span className="text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-bold">
                Piattaforma AI #1 in Italia
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-[clamp(2.4rem,6vw,5.6rem)] font-heading font-extrabold leading-[0.92] tracking-[-0.02em] mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="block text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.1)]">
                Il Tuo Business.
              </span>
              <span className="block bg-gradient-to-r from-[#7eb7be] via-[#9b8ade] to-[#6c3ce0] bg-clip-text text-transparent">
                Completamente Automatizzato.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-white/65 text-[clamp(0.95rem,1.8vw,1.2rem)] leading-[1.7] max-w-[580px] mx-auto mb-7 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              {typed}
              <span className="inline-block w-[2px] h-[1em] bg-[#7eb7be] ml-0.5 animate-pulse align-text-bottom" />
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <button
                onClick={() => navigate("/demo")}
                className="group px-10 py-4 rounded-full text-white font-semibold text-sm font-heading inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-[2px] hover:shadow-[0_20px_60px_rgba(126,183,190,0.35)]"
                style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", boxShadow: "0 16px 48px rgba(126,183,190,0.3)" }}
              >
                Vedi i Progetti
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
              <button
                onClick={() => document.getElementById("prezzi")?.scrollIntoView({ behavior: "smooth" })}
                className="px-10 py-4 rounded-full text-white/90 font-semibold text-sm border border-white/[0.15] hover:border-[#7eb7be]/50 hover:text-white hover:bg-white/[0.03] transition-all"
              >
                Scopri i Piani
              </button>
            </motion.div>

            {/* Trust */}
            <motion.div
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.5 }}
            >
              {TRUST.map((t) => (
                <span key={t} className="text-[11px] text-white/40 font-medium tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7eb7be]/50" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── MOCKUP FAN — scroll-driven, reversible ── */}
          <div className="relative w-full max-w-[1100px] mx-auto flex-shrink-0">
            <div
              className="relative flex justify-center items-end"
              style={{ height: isMobile ? "200px" : "340px", perspective: "1800px" }}
            >
              {MOCKUPS.map((m, i) => (
                <MockupPhone key={i} m={m} i={i} total={MOCKUPS.length} progress={fanProgress} isMobile={isMobile} />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#020204] to-transparent z-[20] pointer-events-none" />
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-[3]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          <span className="text-[9px] tracking-[3px] uppercase text-white/25 font-semibold">Scorri per scoprire</span>
          <motion.div
            className="w-[1px] h-6"
            style={{ background: "linear-gradient(#7eb7be, transparent)" }}
            animate={{ scaleY: [1, 0.3, 1], opacity: [0.8, 0.15, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
