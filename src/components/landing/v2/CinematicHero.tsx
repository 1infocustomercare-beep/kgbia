import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const SCREENS = [
  `${S}/COTE%20Miami/a-obsidian-mobile-home.png`,
  `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`,
  `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`,
];

const TRUST = ["847+ Imprese", "98 Agenti AI", "25+ Settori", "Garanzia 90 Giorni"];

function SplitTextReveal({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden align-bottom mr-[0.25em] last:mr-0">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            transition={{
              delay: delay + wi * 0.06,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function CinematicHero() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Smooth spring for buttery 3D
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 28, mass: 0.6 });

  const phoneRotateY = useTransform(smooth, [0, 1], [0, 540]);
  const phoneRotateX = useTransform(smooth, [0, 0.5, 1], [8, 0, -6]);
  const phoneScale = useTransform(smooth, [0, 0.4, 1], [0.85, 1.05, 0.7]);
  const phoneY = useTransform(smooth, [0, 1], [0, -180]);
  const phoneZ = useTransform(smooth, [0, 0.5, 1], [0, 60, -100]);

  const titleY = useTransform(smooth, [0, 1], [0, -260]);
  const titleOpacity = useTransform(smooth, [0, 0.5, 0.85], [1, 0.6, 0]);
  const subOpacity = useTransform(smooth, [0, 0.4, 0.7], [1, 0.4, 0]);

  const bgGlowScale = useTransform(smooth, [0, 1], [1, 2.4]);
  const bgGlowOpacity = useTransform(smooth, [0, 0.5, 1], [0.5, 1, 0.2]);

  // Screen index based on rotation
  const screenIdx = useTransform(phoneRotateY, (v) => Math.floor(((v % 360) + 360) / 120) % 3);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-[220svh]"
      style={{ perspective: "1800px" }}
    >
      {/* Atmospheric depth layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient mesh */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(124,58,237,0.22), transparent 60%), radial-gradient(ellipse 60% 50% at 30% 70%, rgba(212,175,55,0.12), transparent 60%), radial-gradient(ellipse 60% 50% at 70% 60%, rgba(168,85,247,0.14), transparent 60%)",
            scale: bgGlowScale,
            opacity: bgGlowOpacity,
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.16) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
          }}
        />
        {/* Noise grain */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
      </div>

      {/* Sticky stage */}
      <div className="sticky top-0 h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-[1400px] mx-auto px-5 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center z-10">
          {/* TEXT SIDE */}
          <motion.div
            style={{ y: titleY, opacity: titleOpacity }}
            className="relative text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-7 border backdrop-blur-md"
              style={{
                borderColor: "rgba(212,175,55,0.32)",
                background: "linear-gradient(135deg, rgba(212,175,55,0.1), rgba(124,58,237,0.06))",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] tracking-[3px] uppercase font-bold" style={{ color: "#D4AF37" }}>
                Empire AI · Piattaforma #1 in Italia
              </span>
            </motion.div>

            <h1 className="font-heading font-extrabold leading-[0.88] tracking-[-0.045em] mb-7 text-[clamp(2.6rem,7.5vw,6rem)]">
              <span className="block text-white">
                <SplitTextReveal text="Il tuo business." delay={0.2} />
              </span>
              <span className="block">
                <SplitTextReveal
                  text="Completamente"
                  delay={0.45}
                  className="bg-gradient-to-r from-[#D4AF37] via-[#a78bfa] to-[#7C3AED] bg-clip-text text-transparent"
                />
              </span>
              <span className="block">
                <SplitTextReveal
                  text="autonomo."
                  delay={0.7}
                  className="bg-gradient-to-r from-[#D4AF37] via-[#a78bfa] to-[#7C3AED] bg-clip-text text-transparent"
                />
              </span>
            </h1>

            <motion.p
              style={{ opacity: subOpacity }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-white/75 text-[clamp(1rem,1.6vw,1.18rem)] leading-[1.65] max-w-[560px] mx-auto lg:mx-0 mb-8 font-light"
            >
              98 agenti AI specializzati prendono in carico ordini, prenotazioni, marketing, fiscalità e acquisizione clienti.
              <span className="text-white font-medium"> Tu decidi la strategia. Tutto il resto, lo facciamo noi.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10"
            >
              <button
                onClick={() => navigate("/demo")}
                className="group relative px-8 py-4 rounded-full text-white font-semibold text-sm font-heading inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-[3px] overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #D4AF37 0%, #7C3AED 100%)",
                  boxShadow: "0 20px 60px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <span className="relative z-10">Vedi una Demo Live</span>
                <span className="relative z-10 inline-block transition-transform group-hover:translate-x-1.5">→</span>
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #7C3AED 0%, #D4AF37 100%)" }}
                />
              </button>
              <button
                onClick={() => document.getElementById("manifesto")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 rounded-full text-white/90 font-semibold text-sm border border-white/15 hover:border-[#D4AF37]/60 hover:bg-white/[0.04] transition-all backdrop-blur-md"
              >
                Scopri come funziona
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2.5"
            >
              {TRUST.map((t) => (
                <span key={t} className="text-[11px] text-white/50 font-medium tracking-wide flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37]" style={{ boxShadow: "0 0 8px #D4AF37" }} />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* PHONE SIDE - 3D rotating */}
          <div className="relative h-[80svh] flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
            {/* Ambient glow */}
            <motion.div
              className="absolute w-[420px] h-[420px] rounded-full blur-[100px]"
              style={{
                background: "radial-gradient(circle, rgba(212,175,55,0.4), rgba(124,58,237,0.3) 50%, transparent 70%)",
                scale: bgGlowScale,
                opacity: bgGlowOpacity,
              }}
            />

            <motion.div
              style={{
                rotateY: phoneRotateY,
                rotateX: phoneRotateX,
                scale: phoneScale,
                y: phoneY,
                z: phoneZ,
                transformStyle: "preserve-3d",
              }}
              className="relative"
            >
              {/* The phone - all 3 faces */}
              {SCREENS.map((src, i) => (
                <PhoneFace key={i} src={src} faceIndex={i} currentIdx={screenIdx} />
              ))}
            </motion.div>

            {/* Floating metric chips orbiting */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, type: "spring" }}
              className="absolute top-[15%] -left-2 sm:left-4 px-3.5 py-2.5 rounded-2xl backdrop-blur-xl border z-30 hidden sm:block"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.25), rgba(0,0,0,0.7))",
                borderColor: "rgba(212,175,55,0.4)",
                boxShadow: "0 16px 48px rgba(212,175,55,0.3)",
              }}
            >
              <div className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF37]">Live Now</div>
              <div className="text-sm font-heading font-extrabold text-white mt-0.5">+34% Revenue</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, type: "spring" }}
              className="absolute bottom-[20%] -right-2 sm:right-4 px-3.5 py-2.5 rounded-2xl backdrop-blur-xl border z-30 hidden sm:block"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(0,0,0,0.7))",
                borderColor: "rgba(124,58,237,0.4)",
                boxShadow: "0 16px 48px rgba(124,58,237,0.3)",
              }}
            >
              <div className="text-[9px] font-bold uppercase tracking-wider text-[#a78bfa]">AI Agent</div>
              <div className="text-sm font-heading font-extrabold text-white mt-0.5">Always-On</div>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, y: { repeat: Infinity, duration: 2 } }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/45"
        >
          <span className="text-[10px] uppercase tracking-[4px] font-medium">Scroll · Esplora</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-[#D4AF37]/60 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

function PhoneFace({
  src,
  faceIndex,
  currentIdx,
}: {
  src: string;
  faceIndex: number;
  currentIdx: ReturnType<typeof useTransform<number, number>>;
}) {
  const opacity = useTransform(currentIdx, (v) => (v === faceIndex ? 1 : 0.85));
  const angle = faceIndex * 120;

  return (
    <motion.div
      style={{
        opacity,
        transform: `rotateY(${angle}deg) translateZ(160px)`,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div
        className="relative w-[260px] sm:w-[300px] aspect-[9/19.5] rounded-[44px] overflow-hidden"
        style={{
          border: "2px solid rgba(212,175,55,0.4)",
          background: "#0a0a14",
          boxShadow:
            "0 50px 120px rgba(124,58,237,0.45), 0 0 0 1px rgba(212,175,55,0.25), inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-[1.8%] left-1/2 -translate-x-1/2 w-[30%] h-[2.4%] bg-black rounded-full z-20" />
        {/* Screen */}
        <div className="absolute inset-[3px] rounded-[42px] overflow-hidden">
          <img src={src} alt="" loading="eager" decoding="async" className="w-full h-full object-cover object-top" />
        </div>
        {/* Glass highlights */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent pointer-events-none rounded-[44px]" />
        <div className="absolute inset-0 bg-gradient-to-tl from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none rounded-[44px] mix-blend-overlay" />
        {/* Home indicator */}
        <div className="absolute bottom-[1.2%] left-1/2 -translate-x-1/2 w-[28%] h-[1.2%] bg-white/20 rounded-full z-20" />
      </div>
      {/* Phone reflection */}
      <div
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[260px] sm:w-[300px] h-[80px] rounded-full blur-2xl"
        style={{ background: "radial-gradient(ellipse, rgba(212,175,55,0.4), transparent 70%)" }}
      />
    </motion.div>
  );
}
