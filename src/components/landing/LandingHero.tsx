import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";
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
  const spreadX = isMobile ? 32 : 76;
  const spreadY = isMobile ? 2 : 8;
  const rot = offset * (isMobile ? 3 : 5.5);
  const phoneW = isMobile ? 72 : 150;

  const stagger = Math.abs(offset) * 0.1;
  const localP = Math.max(0, Math.min(1, (progress - stagger) / (1 - stagger)));
  const eased = 1 - Math.pow(1 - localP, 3);

  const x = eased * offset * spreadX;
  const y = 150 * (1 - eased) + (-Math.abs(offset) * spreadY * eased);
  const opacity = Math.min(1, localP * 3);
  const scale = 0.58 + eased * (0.42 - Math.abs(offset) * 0.028);
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
          borderColor: "rgba(255,255,255,0.1)",
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
        className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-center transition-opacity duration-300"
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

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.02, 0.97]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -24]);

  const [fanProgress, setFanProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setFanProgress(Math.max(0, Math.min(1, v / (isMobile ? 0.82 : 0.7))));
  });

  const [typed, setTyped] = useState("");
  const fullText = "Automatizziamo il tuo business con l'Intelligenza Artificiale. App, gestionali e 98 agenti IA — tutto personalizzato per il tuo settore.";
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTyped(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(timer);
    }, 22);
    return () => clearInterval(timer);
  }, []);

  const sectionHeight = isMobile ? "190vh" : "250vh";
  const stickyTop = isMobile ? `${MOBILE_HEADER_OFFSET}px` : "0px";
  const stickyHeight = isMobile ? `calc(100svh - ${MOBILE_HEADER_OFFSET}px)` : "100vh";
  const contentTopPadding = isMobile ? "0.75rem" : "4rem";
  const contentBottomPadding = isMobile ? "2rem" : "0px";
  const mockupHeight = isMobile ? "190px" : "340px";

  return (
    <section ref={outerRef} id="hero" style={{ height: sectionHeight }} className="relative">
      <div className="sticky w-full overflow-hidden" style={{ top: stickyTop, height: stickyHeight }}>
        <div className="absolute inset-0 z-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(10,12,32,0.95) 0%, #020204 70%)",
        }} />
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent)",
          }} />
        </div>
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none z-[1]"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.08), transparent 70%)", top: "5%", right: "-10%" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none z-[1]"
          style={{ background: "radial-gradient(circle, rgba(96,165,250,0.06), transparent 70%)", bottom: "10%", left: "-8%" }} />

        <div
          className="relative z-[2] h-full flex flex-col items-center px-5"
          style={{ paddingTop: contentTopPadding, paddingBottom: contentBottomPadding, justifyContent: isMobile ? "space-between" : "center" }}
        >
          <motion.div
            className="text-center max-w-[900px] mx-auto mb-4 lg:mb-8"
            style={{ scale: titleScale, y: titleY }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 border border-[#c9a84c]/25 bg-[#c9a84c]/5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#22c55e] animate-pulse" />
              <span className="text-[11px] tracking-[2.5px] uppercase text-[#c9a84c] font-bold">Piattaforma AI #1 in Italia</span>
            </motion.div>

            <motion.h1
              className="text-[clamp(2.2rem,8vw,5.6rem)] font-heading font-extrabold leading-[0.94] tracking-[-0.03em] mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="block text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.08)]">Il Tuo Business.</span>
              <span className="block text-[#c9a84c]">Completamente Automatizzato.</span>
            </motion.h1>

            <motion.p
              className="text-white/70 text-[clamp(1rem,3.9vw,1.15rem)] leading-[1.7] max-w-[600px] mx-auto mb-6 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {typed}
              <span className="inline-block w-[2px] h-[1em] bg-[#c9a84c] ml-0.5 animate-pulse align-text-bottom" />
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <button
                onClick={() => navigate("/demo")}
                className="group px-8 py-4 rounded-full text-black font-bold text-sm font-heading inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-[2px]"
                style={{ background: "linear-gradient(135deg, #c9a84c, #e8c47a)", boxShadow: "0 16px 48px rgba(201,168,76,0.3)" }}
              >
                Vedi i Progetti
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
              <button
                onClick={() => document.getElementById("prezzi")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 rounded-full text-white/85 font-semibold text-sm border border-white/[0.12] hover:border-[#c9a84c]/40 hover:text-white transition-all"
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
                <span key={t} className="text-[11px] text-white/45 font-medium tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]/50" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <div className="relative w-full max-w-[1100px] mx-auto flex-shrink-0">
            <div className="relative flex justify-center items-end" style={{ height: mockupHeight, perspective: "1800px" }}>
              {MOCKUPS.map((m, i) => (
                <MockupPhone key={i} m={m} i={i} total={MOCKUPS.length} progress={fanProgress} isMobile={isMobile} />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#020204] to-transparent z-[20] pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
