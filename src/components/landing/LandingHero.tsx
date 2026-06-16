import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "/__empire-cover-removed";
const DESKTOP_HEADER_OFFSET = 76;
const MOBILE_HEADER_OFFSET = 84;

const MOCKUPS = [
  { src: `${S}/Onyx%20Brace%20Steakhouse/a-obsidian-mobile-home.png`, label: "Onyx Brace Steakhouse", cat: "Restaurant", accent: "#f59e0b" },
  { src: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, label: "Aura Spa", cat: "Wellness", accent: "#ec4899" },
  { src: `${S}/Aurora%20Nail%20Atelier/frosted-glass-home.png`, label: "Neo Nails", cat: "Beauty", accent: "#a78bfa" },
  { src: `${S}/Centro%20Padel%20Brera/mobile-fresh-azzurro-home.png`, label: "City Padel", cat: "Sports", accent: "#22d3ee" },
  { src: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, label: "DIMORA", cat: "Real Estate", accent: "#c9a84c" },
  { src: `${S}/Sakura%20Atelier/a-sakura-home.png`, label: "Sakura Atelier", cat: "Sushi", accent: "#ef4444" },
  { src: `${S}/Tropico%20Pet%20Resort/mobile-a-home.png`, label: "Aloha Pets", cat: "Pet Care", accent: "#4ade80" },
  { src: `${S}/Lumen%20Clinic/a-ethereal-glass-mobile-home.png`, label: "FAR Medical", cat: "Healthcare", accent: "#60a5fa" },
];

const TRUST = ["847+ Imprese Attive", "24 Settori", "38 Agenti IA", "Garanzia 90 Giorni"];

/* ── Interactive Featured Phone ── */
function FeaturedPhone({ m, isActive, onClick }: { m: typeof MOCKUPS[0]; isActive: boolean; onClick: () => void }) {
  return (
    <motion.div
      className="relative cursor-pointer flex-shrink-0"
      style={{ width: isActive ? 156 : 100 }}
      onClick={onClick}
      layout
      transition={{ type: "spring", stiffness: 500, damping: 36 }}
    >
      {/* Glow ring */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute -inset-2 rounded-[22%/10%] z-0"
            style={{
              background: `linear-gradient(135deg, ${m.accent}55, transparent 60%)`,
              filter: "blur(16px)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="relative aspect-[9/19.5] rounded-[18%/8%] overflow-hidden z-10"
        style={{
          border: isActive ? `2px solid ${m.accent}88` : "2px solid rgba(255,255,255,0.1)",
          background: "#0a0a14",
          boxShadow: isActive
            ? `0 24px 80px ${m.accent}40, 0 0 0 1px ${m.accent}22`
            : "0 16px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
        animate={{
          scale: isActive ? 1 : 0.88,
          y: isActive ? -12 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        whileHover={{ scale: isActive ? 1.02 : 0.92, y: isActive ? -16 : -4 }}
      >
        {/* Notch */}
        <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[28%] h-[3%] bg-black rounded-full z-20" />
        <div className="absolute inset-[2px] rounded-[16%/7%] overflow-hidden">
          <img src={m.src} alt={m.label} loading="eager" decoding="async" className="w-full h-full object-cover object-top" />
        </div>
        {/* Glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent pointer-events-none" />
        {/* Home indicator */}
        <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[26%] h-[1.5%] bg-white/15 rounded-full z-20" />
      </motion.div>

      {/* Label */}
      <motion.div
        className="mt-3 text-center"
        animate={{ opacity: isActive ? 1 : 0.5 }}
      >
        <p className="text-[11px] font-bold text-white">{m.label}</p>
        <p className="text-[9px] font-medium" style={{ color: isActive ? m.accent : "rgba(255,255,255,0.4)" }}>{m.cat}</p>
      </motion.div>
    </motion.div>
  );
}

export default function LandingHero() {
  const navigate = useNavigate();
  const outerRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.2, 0.58, 1], [1, 1.03, 0.93, 0.84]);
  const titleY = useTransform(scrollYProgress, [0, 0.3, 0.65, 1], [0, -24, -110, -170]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 0.96, 0.74]);
  const titleFilter = useTransform(scrollYProgress, [0, 0.82, 1], ["blur(0px)", "blur(0px)", "blur(1.8px)"]);
  const titleGlowScale = useTransform(scrollYProgress, [0, 0.45, 1], [1, 1.08, 1.16]);
  const titleGlowOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [0.42, 0.32, 0.16]);
  const stageY = useTransform(scrollYProgress, [0, 0.28, 0.85, 1], [46, 6, -30, -54]);
  const stageScale = useTransform(scrollYProgress, [0, 0.3, 1], [0.92, 1, 1.06]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.12, 1], [0.9, 1, 1]);

  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-rotate featured phone
  useEffect(() => {
    const timer = setInterval(() => setActiveIdx((p) => (p + 1) % MOCKUPS.length), 3200);
    return () => clearInterval(timer);
  }, []);

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

  // Stagger entrance
  const [showPhones, setShowPhones] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowPhones(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const headerOffset = isMobile ? MOBILE_HEADER_OFFSET : DESKTOP_HEADER_OFFSET;
  const sectionHeight = isMobile ? "220svh" : "320vh";
  const stickyTop = `${headerOffset}px`;
  const stickyHeight = `calc(100svh - ${headerOffset}px)`;
  const headlineTop = isMobile ? "clamp(0.35rem, 1.5vh, 0.75rem)" : "clamp(0.75rem, 2.2vh, 1.5rem)";
  const stageBottom = isMobile ? "0.25rem" : "0.5rem";

  return (
    <section ref={outerRef} id="hero" style={{ height: sectionHeight }} className="relative">
      <div className="sticky w-full overflow-hidden" style={{ top: stickyTop, height: stickyHeight }}>
        {/* BG layers */}
        <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(13,13,30,0.95) 0%, #020204 70%)" }} />
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(126,183,190,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(126,183,190,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent)",
          }} />
        </div>
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none z-[1]"
          style={{ background: "radial-gradient(circle, rgba(126,183,190,0.13), transparent 70%)", top: "5%", right: "-10%" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none z-[1]"
          style={{ background: "radial-gradient(circle, rgba(108,60,224,0.10), transparent 70%)", bottom: "10%", left: "-8%" }} />

        <div className="relative z-[2] h-full w-full max-w-[1280px] mx-auto px-5">
          {/* ── Headline block ── */}
          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[920px]" style={{ top: headlineTop }}>
            <motion.div className="w-full text-center" style={{ scale: titleScale, y: titleY, opacity: titleOpacity, filter: titleFilter }}>
              <motion.div
                aria-hidden
                className="absolute inset-x-[8%] top-[8%] h-[62%] rounded-full blur-[42px] pointer-events-none -z-10"
                style={{ opacity: titleGlowOpacity, scale: titleGlowScale, background: "linear-gradient(135deg, rgba(126,183,190,0.26), rgba(108,60,224,0.22), rgba(255,255,255,0.06))" }}
              />
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 border border-[rgba(126,183,190,0.25)] bg-[rgba(126,183,190,0.06)] backdrop-blur-sm"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#22c55e] animate-pulse" />
                <span className="text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-bold">Piattaforma AI #1 in Italia</span>
              </motion.div>

              <motion.h1
                className="text-[clamp(2.2rem,6.2vw,4.5rem)] font-heading font-extrabold leading-[0.9] tracking-[-0.04em] mb-3"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="block text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.1)]">Il Tuo Business.</span>
                <span className="block bg-gradient-to-r from-[#a6d8df] via-[#b6a7ef] to-[#7d51eb] bg-clip-text text-transparent">Completamente Automatizzato.</span>
              </motion.h1>

              <motion.p
                className="text-white/88 text-[clamp(0.98rem,2.4vw,1.08rem)] leading-[1.55] max-w-[580px] mx-auto mb-5 font-light"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
              >
                {typed}
                <span className="inline-block w-[2px] h-[1em] bg-[#7eb7be] ml-0.5 animate-pulse align-text-bottom" />
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-3 justify-center" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
                <button
                  onClick={() => navigate("/demo")}
                  className="group px-8 py-4 rounded-full text-white font-semibold text-sm font-heading inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-[2px] hover:shadow-[0_20px_60px_rgba(126,183,190,0.35)]"
                  style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", boxShadow: "0 16px 48px rgba(126,183,190,0.3)" }}
                >
                  Vedi i Progetti
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </button>
                <button
                  onClick={() => document.getElementById("prezzi")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-8 py-4 rounded-full text-white/90 font-semibold text-sm border border-white/[0.15] hover:border-[#7eb7be]/50 hover:text-white hover:bg-white/[0.03] transition-all"
                >
                  Scopri i Piani
                </button>
              </motion.div>

              <motion.div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
                {TRUST.map((t) => (
                  <span key={t} className="text-[11px] text-white/48 font-medium tracking-wide flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7eb7be]/50" />
                    {t}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* ── Interactive Showcase Stage ── */}
          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[1080px]" style={{ bottom: stageBottom }}>
            <motion.div className="w-full" style={{ y: stageY, scale: stageScale, opacity: stageOpacity }}>
              {/* Stage glow */}
              <div
                className="absolute inset-x-[5%] bottom-[3%] h-[62%] rounded-[38px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] backdrop-blur-[6px] pointer-events-none"
                style={{ boxShadow: "0 40px 120px rgba(0,0,0,0.45)" }}
              />

              {/* Phone carousel */}
              <div className="relative flex justify-center items-end gap-1 sm:gap-2 overflow-visible pb-10" style={{ minHeight: isMobile ? "220px" : "360px" }}>
                <AnimatePresence mode="popLayout">
                  {showPhones && MOCKUPS.map((m, i) => (
                    <motion.div
                      key={m.label}
                      initial={{ opacity: 0, y: 60, scale: 0.7, rotateY: -15 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                      transition={{
                        delay: i * 0.09,
                        duration: 0.7,
                        type: "spring",
                        stiffness: 260,
                        damping: 24,
                      }}
                    >
                      <FeaturedPhone
                        m={m}
                        isActive={i === activeIdx}
                        onClick={() => setActiveIdx(i)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Active project label */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] backdrop-blur-md"
                  style={{ background: `linear-gradient(135deg, ${MOCKUPS[activeIdx].accent}15, rgba(0,0,0,0.4))` }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: MOCKUPS[activeIdx].accent }} />
                  <span className="text-[11px] font-bold text-white">{MOCKUPS[activeIdx].label}</span>
                  <span className="text-[10px] text-white/50">— {MOCKUPS[activeIdx].cat}</span>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#020204] to-transparent z-[20] pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
