import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const SCENES = [
  { sector: "Hospitality premium", brand: "COTE Miami", metric: "+34%", metricLabel: "scontrino medio", img: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, accent: "215 90% 62%" },
  { sector: "Wellness boutique", brand: "Aura Milano Spa", metric: "+218%", metricLabel: "prenotazioni online", img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, accent: "248 80% 70%" },
  { sector: "Real estate luxury", brand: "DIMORA Milano", metric: "+187%", metricLabel: "lead qualificati", img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, accent: "38 80% 62%" },
  { sector: "Beauty studio", brand: "Neo Nails", metric: "3.2×", metricLabel: "retention clienti", img: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`, accent: "325 75% 66%" },
  { sector: "Healthcare premium", brand: "FAR Medical", metric: "GDPR", metricLabel: "compliance totale", img: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, accent: "172 80% 58%" },
];

const TRUST = ["847+ business attivi", "98 agenti AI", "25+ verticali", "Go-live 14 giorni"];
const ROTATING_WORDS = ["telefonate", "ordini", "prenotazioni", "recensioni", "clienti"];
const MARQUEE = ["VOICE AI", "WHATSAPP", "WEBAPP", "AUTOMATION", "CRM", "REVIEWS", "BOOKING", "PAYMENTS"];
const SCENE_DURATION = 4200;

/** Word entering with blur + lift, char-stagger feel without splitting DOM. */
function RevealWord({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ y: 32, opacity: 0, filter: "blur(10px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.span>
  );
}

/** Magnetic CTA wrapper — pointer attraction + gloss sweep. */
function MagneticCTA({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = e.clientX - (r.left + r.width / 2);
    const cy = e.clientY - (r.top + r.height / 2);
    x.set(cx * 0.18);
    y.set(cy * 0.28);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base = variant === "primary" ? "landing-button-primary" : "landing-button-secondary";

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      className={`${base} group relative overflow-hidden ${className}`}
    >
      <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,hsl(var(--foreground)/0.18),transparent)] transition-transform duration-[900ms] ease-out group-hover:translate-x-full" />
    </motion.button>
  );
}

export default function CinematicHero() {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const lite = isMobile || prefersReducedMotion;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.7 });

  // Pointer for spotlight + 3D tilt
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const tiltX = useSpring(useTransform(pointerY, [0, 1], [10, -10]), { stiffness: 120, damping: 20 });
  const tiltY = useSpring(useTransform(pointerX, [0, 1], [-12, 12]), { stiffness: 120, damping: 20 });
  const spotlightX = useTransform(pointerX, (v) => `${v * 100}%`);
  const spotlightY = useTransform(pointerY, (v) => `${v * 100}%`);

  // Auto-rotate scenes
  useEffect(() => {
    const id = setInterval(() => setActiveScene((s) => (s + 1) % SCENES.length), SCENE_DURATION);
    return () => clearInterval(id);
  }, []);

  // Rotating word
  useEffect(() => {
    const id = setInterval(() => setWordIdx((w) => (w + 1) % ROTATING_WORDS.length), 2200);
    return () => clearInterval(id);
  }, []);

  // Pointer tracking — DESKTOP ONLY (skip on mobile to save perf, drop gyro)
  useEffect(() => {
    if (lite) return;
    const el = stageRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointerX.set(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
      pointerY.set(Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)));
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [lite, pointerX, pointerY]);

  // Scroll choreography — disabled/softened on mobile to prevent text/phone overlap & jank
  const titleY = useTransform(smooth, [0, 1], lite ? [0, 0] : [0, -130]);
  const titleOpacity = useTransform(smooth, [0, 0.55, 1], lite ? [1, 0.85, 0.45] : [1, 0.5, 0]);
  const titleBlur = useTransform(smooth, [0, 1], lite ? ["blur(0px)", "blur(0px)"] : ["blur(0px)", "blur(8px)"]);

  const layer1Y = useTransform(smooth, [0, 1], lite ? [0, -20] : [0, -60]);
  const layer2Y = useTransform(smooth, [0, 1], lite ? [0, -40] : [0, -130]);
  const layer3Y = useTransform(smooth, [0, 1], lite ? [0, -60] : [0, -200]);
  const meshScale = useTransform(smooth, [0, 1], lite ? [1, 1.08] : [1, 1.3]);
  const meshRotate = useTransform(smooth, [0, 1], lite ? [0, 0] : [0, 12]);

  const phoneScale = useTransform(smooth, [0, 0.4, 1], lite ? [0.96, 1, 0.92] : [0.9, 1.05, 0.74]);
  const phoneY = useTransform(smooth, [0, 0.4, 1], lite ? [10, 0, -40] : [50, 0, -200]);
  const phoneRotateXScroll = useTransform(smooth, [0, 0.4, 1], lite ? [0, 0, 0] : [14, 0, -20]);
  const phoneRotateZ = useTransform(smooth, [0, 0.4, 1], lite ? [0, 0, 0] : [-3, 0, 5]);
  const phoneOpacity = useTransform(smooth, [0, 0.15, 0.85, 1], lite ? [1, 1, 1, 0.6] : [0, 1, 1, 0.15]);
  const phoneBlurScroll = useTransform(smooth, [0, 0.85, 1], ["blur(0px)", "blur(0px)", lite ? "blur(0px)" : "blur(4px)"]);

  // Marquee scroll-tied speed (desktop only — mobile keeps base loop)
  const marqueeX = useTransform(smooth, [0, 1], lite ? ["0%", "0%"] : ["0%", "-30%"]);

  const active = SCENES[activeScene];

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-[100svh] overflow-hidden"
      style={{ perspective: "1800px" }}
    >
      {/* Cinematic depth background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div style={{ scale: meshScale, rotate: meshRotate }} className="absolute -inset-[20%]">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background: `
                radial-gradient(ellipse 60% 45% at 22% 18%, hsl(${active.accent} / 0.36), transparent 60%),
                radial-gradient(ellipse 55% 40% at 78% 32%, hsl(248 80% 64% / 0.26), transparent 60%),
                radial-gradient(ellipse 60% 50% at 50% 88%, hsl(38 80% 60% / 0.18), transparent 65%)
              `,
              transition: "background 1.4s cubic-bezier(.22,1,.36,1)",
            }}
          />
        </motion.div>

        {/* Pointer-driven spotlight (desktop wow factor) */}
        <motion.div
          className="absolute inset-0 hidden md:block"
          style={{
            background: useTransform(
              [spotlightX, spotlightY] as any,
              ([x, y]: any) =>
                `radial-gradient(circle 380px at ${x} ${y}, hsl(${active.accent} / 0.22), transparent 70%)`
            ),
          }}
        />

        {/* Floating depth orbs */}
        <motion.div
          style={{ y: layer1Y }}
          className="absolute left-[10%] top-[18%] h-[280px] w-[280px] rounded-full blur-3xl opacity-50"
          animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-full w-full rounded-full" style={{ background: `hsl(${active.accent} / 0.45)`, transition: "background 1.4s ease" }} />
        </motion.div>
        <motion.div
          style={{ y: layer2Y }}
          className="absolute right-[8%] top-[42%] h-[340px] w-[340px] rounded-full blur-3xl opacity-40"
          animate={{ x: [0, -28, 0], y: [0, 22, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-full w-full rounded-full bg-empire-violet/45" />
        </motion.div>
        <motion.div
          style={{ y: layer3Y }}
          className="absolute left-[40%] bottom-[10%] h-[260px] w-[260px] rounded-full blur-3xl opacity-30"
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-full w-full rounded-full bg-gold/40" />
        </motion.div>

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground) / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.4) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent)",
          }}
        />

        {/* Film grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' /></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/85 to-transparent" />
      </div>

      {/* Hero stage */}
      <div ref={stageRef} className="relative flex min-h-[100svh] flex-col pt-20 sm:pt-24 lg:pt-28">
        <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-center gap-6 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10">
          {/* Text column */}
          <motion.div
            style={{ y: titleY, opacity: titleOpacity, filter: titleBlur }}
            className="relative z-20 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="landing-pill mx-auto mb-4 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.26em] sm:mb-5 sm:px-4 sm:py-2 sm:text-[10px] lg:mx-0"
              data-tone="gold"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_14px_hsl(var(--accent)/0.9)]" />
              </span>
              Empire AI · Webapp + 4 Agenti AI
            </motion.div>

            <h1 className="mx-auto mb-4 max-w-[18ch] font-heading text-[clamp(2rem,7.6vw,5.4rem)] font-extrabold leading-[0.94] tracking-[-0.04em] text-foreground sm:mb-5 lg:mx-0 lg:max-w-[14ch]">
              <span className="block"><RevealWord text="Sostituisci" delay={0.15} /></span>
              <span className="block landing-heading-gradient"><RevealWord text="i dipendenti." delay={0.3} /></span>
              <span className="block mt-1 text-[clamp(1.05rem,3.4vw,2rem)] font-semibold text-foreground/85">
                <RevealWord text="L'AI gestisce" delay={0.5} />{" "}
                <span className="relative inline-block min-w-[8ch] text-left align-baseline">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIdx}
                      initial={{ y: 18, opacity: 0, filter: "blur(8px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: -18, opacity: 0, filter: "blur(8px)" }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-block landing-heading-gradient font-extrabold"
                    >
                      {ROTATING_WORDS[wordIdx]}
                    </motion.span>
                  </AnimatePresence>
                </span>{" "}
                <RevealWord text="mentre dormi." delay={0.7} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="mx-auto mb-5 max-w-[480px] text-[clamp(0.9rem,2vw,1.1rem)] leading-[1.6] text-foreground/72 sm:mb-6 lg:mx-0"
            >
              Webapp su misura + agenti AI che <span className="font-semibold text-foreground">rispondono al telefono, vendono, prenotano</span> e raccolgono recensioni — 24/7, in tutte le lingue. Setup in 14 giorni. 25+ verticali coperti.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.7 }}
              className="mb-5 flex flex-col items-center gap-2.5 sm:flex-row sm:gap-3 lg:items-start lg:justify-start"
            >
              <MagneticCTA
                onClick={() => navigate("/demo")}
                variant="primary"
                className="w-full max-w-[300px] px-7 py-3.5 text-sm font-semibold sm:w-auto sm:text-[15px]"
              >
                Prenota call gratuita
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </MagneticCTA>
              <MagneticCTA
                onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
                variant="secondary"
                className="w-full max-w-[300px] px-7 py-3.5 text-sm font-semibold sm:w-auto"
              >
                Vedi 12 progetti live
              </MagneticCTA>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-1.5 sm:gap-2 lg:justify-start"
            >
              {TRUST.map((item) => (
                <motion.span
                  key={item}
                  whileHover={{ y: -2, scale: 1.04 }}
                  className="cursor-default rounded-full border border-border/70 bg-card/30 px-2.5 py-1 text-[10px] font-medium text-foreground/65 backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-[11px]"
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Phone showcase column — scroll-cinematic + tilt 3D */}
          <motion.div
            style={{
              scale: phoneScale,
              y: phoneY,
              rotateX: phoneRotateXScroll,
              rotateZ: phoneRotateZ,
              opacity: phoneOpacity,
              filter: phoneBlurScroll,
              transformStyle: "preserve-3d",
            }}
            className="relative mx-auto flex h-[44svh] w-full max-w-[420px] items-center justify-center sm:h-[52svh] lg:h-[68svh]"
          >
            {/* Tilt wrapper (mouse + gyro) */}
            <motion.div
              style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
              className="relative h-full w-full"
            >
              {/* Floating sector chip */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`chip-${active.brand}`}
                  initial={{ opacity: 0, y: -14, scale: 0.9, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(6px)" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 top-2 z-30 rounded-2xl border border-border/70 bg-card/75 px-3 py-2 backdrop-blur-xl sm:px-3.5 sm:py-2.5"
                  style={{ boxShadow: `0 16px 40px hsl(${active.accent} / 0.32)`, transform: "translateZ(40px)" }}
                >
                  <div className="text-[8px] font-bold uppercase tracking-[0.2em] sm:text-[9px]" style={{ color: `hsl(${active.accent})` }}>
                    {active.sector}
                  </div>
                  <div className="mt-0.5 text-xs font-semibold text-foreground sm:text-sm">{active.brand}</div>
                </motion.div>
              </AnimatePresence>

              {/* Floating metric chip */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`metric-${active.brand}`}
                  initial={{ opacity: 0, y: 14, scale: 0.9, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(6px)" }}
                  transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-2 right-0 z-30 rounded-2xl border border-border/70 bg-card/75 px-3 py-2 backdrop-blur-xl sm:px-3.5 sm:py-2.5"
                  style={{ boxShadow: `0 16px 40px hsl(${active.accent} / 0.32)`, transform: "translateZ(50px)" }}
                >
                  <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-foreground/55 sm:text-[9px]">Risultato</div>
                  <div className="mt-0.5 flex items-end gap-1.5">
                    <span className="font-heading text-lg font-extrabold leading-none text-foreground sm:text-xl">{active.metric}</span>
                    <span className="pb-0.5 text-[9px] text-foreground/60 sm:text-[10px]">{active.metricLabel}</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Live AI pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="absolute right-1 top-2 z-30 flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-2.5 py-1 backdrop-blur-xl sm:right-3 sm:px-3 sm:py-1.5"
                style={{ transform: "translateZ(60px)" }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/75 sm:text-[10px]">AI Live</span>
              </motion.div>

              {/* Phone */}
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="relative" style={{ transform: "translateZ(80px)" }}>
                  <div
                    className="relative aspect-[9/19.5] w-[210px] rounded-[2.4rem] border border-border/80 bg-card/70 sm:w-[260px] lg:w-[300px]"
                    style={{ boxShadow: `0 50px 120px -32px hsl(${active.accent} / 0.6), 0 0 0 1px hsl(var(--foreground) / 0.05)` }}
                  >
                    <div className="absolute left-1/2 top-[1.6%] z-20 h-[2.2%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
                    <div className="absolute inset-[4px] overflow-hidden rounded-[2.1rem] bg-background">
                      {SCENES.map((scene, i) => (
                        <motion.img
                          key={scene.brand}
                          src={scene.img}
                          alt={`Preview ${scene.brand}`}
                          loading={i === 0 ? "eager" : "lazy"}
                          decoding="async"
                          initial={false}
                          animate={{
                            opacity: i === activeScene ? 1 : 0,
                            scale: i === activeScene ? 1 : 1.08,
                          }}
                          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-0 h-full w-full object-cover object-top"
                        />
                      ))}
                      {/* Specular sweep */}
                      <motion.div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: `linear-gradient(115deg, transparent 35%, hsl(var(--foreground) / 0.18) 50%, transparent 65%)`,
                        }}
                        animate={{ x: ["-110%", "110%"] }}
                        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--foreground)/0.12),transparent_28%,transparent_72%,hsl(var(--primary)/0.1))]" />
                    </div>
                    <div className="pointer-events-none absolute inset-0 rounded-[2.4rem] bg-[linear-gradient(150deg,hsl(var(--foreground)/0.14),transparent_28%,transparent_70%,hsl(var(--gold)/0.08))]" />
                    <div className="absolute bottom-[1.3%] left-1/2 h-[1%] w-[28%] -translate-x-1/2 rounded-full bg-foreground/22" />
                  </div>

                  {/* Reflection */}
                  <div
                    className="absolute -bottom-6 left-1/2 h-[40px] w-[80%] -translate-x-1/2 rounded-full blur-2xl"
                    style={{ background: `radial-gradient(ellipse, hsl(${active.accent} / 0.5), transparent 70%)`, transition: "background 1.2s ease" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Scene indicators with progress */}
            <div className="absolute -bottom-1 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
              {SCENES.map((s, i) => (
                <button
                  key={s.brand}
                  onClick={() => setActiveScene(i)}
                  className="relative h-1 overflow-hidden rounded-full transition-all duration-500"
                  style={{
                    width: i === activeScene ? 28 : 6,
                    background: i === activeScene ? `hsl(${s.accent} / 0.25)` : "hsl(var(--foreground) / 0.18)",
                  }}
                  aria-label={`Vedi ${s.brand}`}
                >
                  {i === activeScene && (
                    <motion.span
                      key={`prog-${activeScene}`}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: SCENE_DURATION / 1000, ease: "linear" }}
                      className="absolute left-0 top-0 h-full"
                      style={{ background: `hsl(${s.accent})` }}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Kinetic typography marquee — scroll-tied */}
        <div className="relative z-10 mt-6 overflow-hidden border-y border-border/40 bg-background/30 py-3 backdrop-blur-md sm:mt-8 sm:py-4">
          <motion.div
            style={{ x: marqueeX }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap will-change-transform"
          >
            {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((w, i) => (
              <span
                key={`${w}-${i}`}
                className="mx-6 font-heading text-2xl font-black uppercase tracking-[-0.02em] text-foreground/12 sm:mx-10 sm:text-4xl lg:text-5xl"
                style={{
                  WebkitTextStroke: "1px hsl(var(--foreground) / 0.35)",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {w} <span className="mx-3 text-accent/50">●</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          style={{ opacity: useTransform(smooth, [0, 0.2], [1, 0]) }}
          className="relative z-20 flex flex-col items-center gap-1.5 pb-3 pt-3 text-foreground/45 sm:pb-4"
        >
          <span className="text-[9px] uppercase tracking-[0.36em] sm:text-[10px]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="h-8 w-px bg-[linear-gradient(180deg,hsl(var(--gold)/0.7),transparent)]"
          />
        </motion.div>
      </div>
    </section>
  );
}
