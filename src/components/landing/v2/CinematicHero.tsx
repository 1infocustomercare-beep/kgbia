import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

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

function SplitText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ y: 28, opacity: 0, filter: "blur(8px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ delay, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.span>
  );
}

export default function CinematicHero() {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.7 });

  // Auto-rotate scenes (ambient cinematic)
  useEffect(() => {
    const id = setInterval(() => setActiveScene((s) => (s + 1) % SCENES.length), 3800);
    return () => clearInterval(id);
  }, []);

  // Rotating word in headline
  useEffect(() => {
    const id = setInterval(() => setWordIdx((w) => (w + 1) % ROTATING_WORDS.length), 2200);
    return () => clearInterval(id);
  }, []);

  // Text scroll-out (fades + lifts as user scrolls past hero)
  const titleY = useTransform(smooth, [0, 1], [0, -120]);
  const titleOpacity = useTransform(smooth, [0, 0.55, 1], [1, 0.5, 0]);
  const titleBlur = useTransform(smooth, [0, 1], ["blur(0px)", "blur(6px)"]);

  // Background depth layers
  const layer1Y = useTransform(smooth, [0, 1], [0, -50]);
  const layer2Y = useTransform(smooth, [0, 1], [0, -110]);
  const layer3Y = useTransform(smooth, [0, 1], [0, -180]);
  const meshScale = useTransform(smooth, [0, 1], [1, 1.25]);
  const meshRotate = useTransform(smooth, [0, 1], [0, 10]);

  // Phone scroll choreography: enters, hovers, exits with depth
  const phoneScale = useTransform(smooth, [0, 0.4, 1], [0.92, 1.04, 0.78]);
  const phoneY = useTransform(smooth, [0, 0.4, 1], [40, 0, -160]);
  const phoneRotateX = useTransform(smooth, [0, 0.4, 1], [12, 0, -16]);
  const phoneRotateZ = useTransform(smooth, [0, 0.4, 1], [-3, 0, 4]);
  const phoneOpacity = useTransform(smooth, [0, 0.15, 0.85, 1], [0, 1, 1, 0.2]);

  const active = SCENES[activeScene];

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-[100svh]"
      style={{ perspective: "1800px" }}
    >
      {/* Cinematic depth background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div style={{ scale: meshScale, rotate: meshRotate }} className="absolute -inset-[20%]">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background: `
                radial-gradient(ellipse 60% 45% at 22% 18%, hsl(${active.accent} / 0.34), transparent 60%),
                radial-gradient(ellipse 55% 40% at 78% 32%, hsl(248 80% 64% / 0.24), transparent 60%),
                radial-gradient(ellipse 60% 50% at 50% 88%, hsl(38 80% 60% / 0.16), transparent 65%)
              `,
              transition: "background 1.4s cubic-bezier(.22,1,.36,1)",
            }}
          />
        </motion.div>

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

        {/* Vignette top/bottom for cinematic feel */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Hero stage */}
      <div className="relative flex min-h-[100svh] flex-col overflow-hidden pt-20 sm:pt-24 lg:pt-28">
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
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_14px_hsl(var(--accent)/0.85)]" />
              Empire AI · Webapp + 4 Agenti AI
            </motion.div>

            <h1 className="mx-auto mb-4 max-w-[18ch] font-heading text-[clamp(2rem,7.6vw,5.4rem)] font-extrabold leading-[0.94] tracking-[-0.04em] text-foreground sm:mb-5 lg:mx-0 lg:max-w-[14ch]">
              <span className="block"><SplitText text="Sostituisci" delay={0.15} /></span>
              <span className="block landing-heading-gradient"><SplitText text="i dipendenti." delay={0.3} /></span>
              <span className="block mt-1 text-[clamp(1.05rem,3.4vw,2rem)] font-semibold text-foreground/85">
                <SplitText text="L'AI gestisce" delay={0.5} />{" "}
                <span className="relative inline-block align-baseline">
                  <motion.span
                    key={wordIdx}
                    initial={{ y: 14, opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block landing-heading-gradient font-extrabold"
                  >
                    {ROTATING_WORDS[wordIdx]}
                  </motion.span>
                </span>{" "}
                <SplitText text="mentre dormi." delay={0.7} />
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
              <button
                onClick={() => navigate("/demo")}
                className="landing-button-primary group w-full max-w-[300px] px-7 py-3.5 text-sm font-semibold sm:w-auto sm:text-[15px]"
              >
                Prenota call gratuita
                <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
              <button
                onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
                className="landing-button-secondary w-full max-w-[300px] px-7 py-3.5 text-sm font-semibold sm:w-auto"
              >
                Vedi 12 progetti live
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-1.5 sm:gap-2 lg:justify-start"
            >
              {TRUST.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border/70 bg-card/30 px-2.5 py-1 text-[10px] font-medium text-foreground/65 backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-[11px]"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Phone showcase column — scroll-cinematic */}
          <motion.div
            style={{
              scale: phoneScale,
              y: phoneY,
              rotateX: phoneRotateX,
              rotateZ: phoneRotateZ,
              opacity: phoneOpacity,
              transformStyle: "preserve-3d",
            }}
            className="relative mx-auto flex h-[44svh] w-full max-w-[420px] items-center justify-center sm:h-[52svh] lg:h-[68svh]"
          >
            {/* Floating sector chip */}
            <motion.div
              key={`chip-${active.brand}`}
              initial={{ opacity: 0, y: -10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-2 z-30 rounded-2xl border border-border/70 bg-card/75 px-3 py-2 backdrop-blur-xl sm:px-3.5 sm:py-2.5"
              style={{ boxShadow: `0 16px 40px hsl(${active.accent} / 0.32)` }}
            >
              <div className="text-[8px] font-bold uppercase tracking-[0.2em] sm:text-[9px]" style={{ color: `hsl(${active.accent})` }}>
                {active.sector}
              </div>
              <div className="mt-0.5 text-xs font-semibold text-foreground sm:text-sm">{active.brand}</div>
            </motion.div>

            {/* Floating metric chip */}
            <motion.div
              key={`metric-${active.brand}`}
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-2 right-0 z-30 rounded-2xl border border-border/70 bg-card/75 px-3 py-2 backdrop-blur-xl sm:px-3.5 sm:py-2.5"
              style={{ boxShadow: `0 16px 40px hsl(${active.accent} / 0.32)` }}
            >
              <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-foreground/55 sm:text-[9px]">Risultato</div>
              <div className="mt-0.5 flex items-end gap-1.5">
                <span className="font-heading text-lg font-extrabold leading-none text-foreground sm:text-xl">{active.metric}</span>
                <span className="pb-0.5 text-[9px] text-foreground/60 sm:text-[10px]">{active.metricLabel}</span>
              </div>
            </motion.div>

            {/* Live AI pill (top-right, subtle pulse) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="absolute right-1 top-2 z-30 flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-2.5 py-1 backdrop-blur-xl sm:right-3 sm:px-3 sm:py-1.5"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/75 sm:text-[10px]">AI Live</span>
            </motion.div>

            {/* Phone */}
            <div className="relative z-10">
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
                        scale: i === activeScene ? 1 : 1.06,
                      }}
                      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  ))}
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

            {/* Scene indicators */}
            <div className="absolute -bottom-1 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
              {SCENES.map((s, i) => (
                <button
                  key={s.brand}
                  onClick={() => setActiveScene(i)}
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: i === activeScene ? 22 : 6,
                    background: i === activeScene ? `hsl(${s.accent})` : "hsl(var(--foreground) / 0.2)",
                  }}
                  aria-label={`Vedi ${s.brand}`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          style={{ opacity: useTransform(smooth, [0, 0.2], [1, 0]) }}
          className="relative z-20 flex flex-col items-center gap-1.5 pb-3 text-foreground/45 sm:pb-4"
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
