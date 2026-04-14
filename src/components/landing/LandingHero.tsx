import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";
const DESKTOP_HEADER_OFFSET = 76;
const MOBILE_HEADER_OFFSET = 84;

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

function MockupPhone({ m, i, total, progress, isMobile }: {
  m: typeof MOCKUPS[0]; i: number; total: number; progress: number; isMobile: boolean;
}) {
  const center = (total - 1) / 2;
  const offset = i - center;
  const spreadX = isMobile ? 38 : 104;
  const spreadY = isMobile ? 4 : 12;
  const rot = offset * (isMobile ? 4 : 7);
  const phoneW = isMobile ? 80 : 148;

  const stagger = Math.abs(offset) * 0.1;
  const localP = Math.max(0, Math.min(1, (progress - stagger) / (1 - stagger)));
  const eased = 1 - Math.pow(1 - localP, 3);

  const x = eased * offset * spreadX;
  const y = (isMobile ? 74 : 92) * (1 - eased) + (-Math.abs(offset) * spreadY * eased);
  const depth = (isMobile ? 18 : 46) - Math.abs(offset) * (isMobile ? 5 : 10);
  const opacity = Math.min(1, (isMobile ? 0.34 : 0.42) + localP * 0.5 + (i === Math.round(center) ? 0.08 : 0));
  const scale = 0.7 + eased * (0.24 - Math.abs(offset) * 0.018);
  const rotate = eased * rot;

  return (
    <div
      className="absolute bottom-0 cursor-pointer"
      style={{
        width: phoneW,
        zIndex: total - Math.abs(offset) + (i === Math.round(center) ? 10 : 0),
        transform: `translateX(${x}px) translateY(${y}px) translateZ(${depth}px) rotate(${rotate}deg) scale(${scale})`,
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
          <img src={m.src} alt={m.label} loading={i < 3 ? "eager" : "lazy"} decoding="async" className="w-full h-full object-cover object-top" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
        <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[26%] h-[1.5%] bg-white/15 rounded-full z-20" />
      </div>
      <div
        className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-center transition-opacity duration-300"
        style={{ opacity: localP > 0.34 ? 1 : 0 }}
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

  const [fanProgress, setFanProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const basePreviewProgress = isMobile ? 0.12 : 0.18;
    const travelProgress = Math.max(0, Math.min(1, v / (isMobile ? 0.74 : 0.58)));
    setFanProgress(Math.max(basePreviewProgress, basePreviewProgress + travelProgress * (1 - basePreviewProgress)));
  });

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

  const headerOffset = isMobile ? MOBILE_HEADER_OFFSET : DESKTOP_HEADER_OFFSET;
  const sectionHeight = isMobile ? "220svh" : "320vh";
  const stickyTop = `${headerOffset}px`;
  const stickyHeight = `calc(100svh - ${headerOffset}px)`;
  const headlineTop = isMobile ? "clamp(0.35rem, 1.5vh, 0.75rem)" : "clamp(0.75rem, 2.2vh, 1.5rem)";
  const stageBottom = isMobile ? "0.25rem" : "0.5rem";
  const mockupHeight = isMobile ? "208px" : "340px";

  return (
    <section ref={outerRef} id="hero" style={{ height: sectionHeight }} className="relative">
      <div className="sticky w-full overflow-hidden" style={{ top: stickyTop, height: stickyHeight }}>
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
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none z-[1]"
          style={{ background: "radial-gradient(circle, rgba(126,183,190,0.13), transparent 70%)", top: "5%", right: "-10%" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none z-[1]"
          style={{ background: "radial-gradient(circle, rgba(108,60,224,0.10), transparent 70%)", bottom: "10%", left: "-8%" }} />

        <div className="relative z-[2] h-full w-full max-w-[1280px] mx-auto px-5">
          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[920px]" style={{ top: headlineTop }}>
          <motion.div
            className="w-full text-center"
            style={{ scale: titleScale, y: titleY, opacity: titleOpacity, filter: titleFilter }}
          >
            <motion.div
              aria-hidden
              className="absolute inset-x-[8%] top-[8%] h-[62%] rounded-full blur-[42px] pointer-events-none -z-10"
              style={{
                opacity: titleGlowOpacity,
                scale: titleGlowScale,
                background: "linear-gradient(135deg, rgba(126,183,190,0.26), rgba(108,60,224,0.22), rgba(255,255,255,0.06))",
              }}
            />
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 border border-[rgba(126,183,190,0.25)] bg-[rgba(126,183,190,0.06)] backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#22c55e] animate-pulse" />
              <span className="text-[11px] tracking-[2.5px] uppercase text-[#7eb7be] font-bold">Piattaforma AI #1 in Italia</span>
            </motion.div>

            <motion.h1
              className="text-[clamp(2.2rem,6.2vw,4.5rem)] font-heading font-extrabold leading-[0.9] tracking-[-0.04em] mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="block text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.1)]">Il Tuo Business.</span>
              <span className="block bg-gradient-to-r from-[#a6d8df] via-[#b6a7ef] to-[#7d51eb] bg-clip-text text-transparent">Completamente Automatizzato.</span>
            </motion.h1>

            <motion.p
              className="text-white/88 text-[clamp(0.98rem,2.4vw,1.08rem)] leading-[1.55] max-w-[580px] mx-auto mb-5 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {typed}
              <span className="inline-block w-[2px] h-[1em] bg-[#7eb7be] ml-0.5 animate-pulse align-text-bottom" />
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
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

            <motion.div
              className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
            >
              {TRUST.map((t) => (
                <span key={t} className="text-[11px] text-white/48 font-medium tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7eb7be]/50" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[1080px]" style={{ bottom: stageBottom }}>
          <motion.div
            className="w-full"
            style={{ y: stageY, scale: stageScale, opacity: stageOpacity }}
          >
            <div
              className="absolute inset-x-[8%] bottom-[8%] h-[30%] rounded-full blur-[56px] pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(126,183,190,0.2) 0%, rgba(108,60,224,0.18) 42%, transparent 74%)" }}
            />
            <div
              className="absolute inset-x-[5%] bottom-[3%] h-[62%] rounded-[38px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] backdrop-blur-[6px] pointer-events-none"
              style={{ boxShadow: "0 40px 120px rgba(0,0,0,0.45)" }}
            />
            <div className="relative flex justify-center items-end overflow-visible" style={{ height: mockupHeight, perspective: "2200px", transformStyle: "preserve-3d" }}>
              {MOCKUPS.map((m, i) => (
                <MockupPhone key={i} m={m} i={i} total={MOCKUPS.length} progress={fanProgress} isMobile={isMobile} />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020204] via-[#020204]/80 to-transparent z-[20] pointer-events-none" />
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
