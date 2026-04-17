import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

type Mockup = {
  brand: string;
  sector: string;
  metric: string;
  metricLabel: string;
  img: string;
  accent: string; // HSL components
  tagline: string;
};

const MOCKUPS: Mockup[] = [
  { brand: "COTE Miami", sector: "Hospitality premium", metric: "+34%", metricLabel: "scontrino medio", img: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, accent: "215 90% 62%", tagline: "Korean BBQ Michelin · ordini tableside" },
  { brand: "Aura Milano Spa", sector: "Wellness boutique", metric: "+218%", metricLabel: "prenotazioni online", img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, accent: "248 80% 70%", tagline: "Spa luxury · booking & loyalty integrato" },
  { brand: "DIMORA Milano", sector: "Real estate luxury", metric: "+187%", metricLabel: "lead qualificati", img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, accent: "38 80% 62%", tagline: "Immobiliare premium · CRM AI integrato" },
  { brand: "Neo Nails Brickell", sector: "Beauty studio", metric: "3.2×", metricLabel: "retention clienti", img: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`, accent: "325 75% 66%", tagline: "Beauty studio · agenda + upsell automatico" },
  { brand: "FAR Medical", sector: "Healthcare premium", metric: "GDPR", metricLabel: "compliance totale", img: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, accent: "172 80% 58%", tagline: "Studio medico · cartella crittografata" },
  { brand: "Paperfish Sushi", sector: "Fine dining", metric: "+92%", metricLabel: "coperti weekend", img: `${S}/Paperfish%20Sushi/b-luxury-dark-home.png`, accent: "338 70% 64%", tagline: "Omakase japanese · prenotazioni AI" },
  { brand: "La Vang Vietnamese", sector: "Luxury restaurant", metric: "+156%", metricLabel: "reorder mensile", img: `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png`, accent: "45 85% 60%", tagline: "Asian fusion · loyalty + recensioni shield" },
  { brand: "Batey Cevicheria", sector: "Casual premium", metric: "−42%", metricLabel: "no-show", img: `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-home.png`, accent: "192 78% 56%", tagline: "Cevicheria urbana · QR ordering smart" },
];

export default function Orbital3DShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.6 });

  const titleY = useTransform(smooth, [0, 0.3], [40, 0]);
  const titleOpacity = useTransform(smooth, [0, 0.25], [0, 1]);
  const stageY = useTransform(smooth, [0, 0.5], [60, 0]);
  const stageOpacity = useTransform(smooth, [0.05, 0.35], [0, 1]);
  const decorY = useTransform(smooth, [0, 1], [-40, 40]);

  // Auto-advance carousel
  useEffect(() => {
    if (hovering) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % MOCKUPS.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [hovering]);

  const active = MOCKUPS[activeIndex];

  // Compute previous and next indices for the side stack
  const prevIndex = (activeIndex - 1 + MOCKUPS.length) % MOCKUPS.length;
  const nextIndex = (activeIndex + 1) % MOCKUPS.length;

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="landing-section relative overflow-hidden py-20 sm:py-24 lg:py-32"
    >
      {/* Ambient luxury backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          style={{ y: decorY }}
          className="absolute inset-0 transition-[background] duration-[1200ms]"
        >
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 70% 50% at 50% 35%, hsl(${active.accent} / 0.20), transparent 65%),
                radial-gradient(ellipse 50% 35% at 15% 85%, hsl(${active.accent} / 0.10), transparent 70%),
                radial-gradient(ellipse 50% 35% at 85% 15%, hsl(248 70% 60% / 0.10), transparent 70%)
              `,
            }}
          />
        </motion.div>
        {/* Premium grid texture */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground) / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.4) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent)",
          }}
        />
        {/* Vignette top/bottom for clean separation */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="mx-auto mb-10 max-w-[720px] text-center sm:mb-14 lg:mb-16"
        >
          <div
            className="landing-pill mx-auto mb-4 inline-flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em] sm:text-[11px]"
            data-tone="violet"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Portfolio · Selezione 2024
          </div>
          <h2 className="mb-4 font-heading text-[clamp(1.85rem,5.2vw,3rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-foreground">
            <span className="block">Mockup reali.</span>
            <span className="block landing-heading-gradient">Brand premium curati a mano.</span>
          </h2>
          <p className="mx-auto max-w-[560px] text-[clamp(0.9rem,1.7vw,1.02rem)] leading-[1.6] text-foreground/72">
            Ogni progetto è disegnato come un editoriale: tipografia, palette e copy custom. Esplora la galleria — autoplay intelligente, swipe libero.
          </p>
        </motion.div>

        {/* Stage */}
        <motion.div
          style={{ y: stageY, opacity: stageOpacity }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="relative"
        >
          {/* ====================== DESKTOP LAYOUT (md+) ====================== */}
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8 lg:gap-12">
            {/* Left info panel */}
            <div className="flex justify-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`info-${active.brand}`}
                  initial={{ opacity: 0, x: -24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-[340px] text-right"
                >
                  <div
                    className="text-[11px] font-bold uppercase tracking-[0.32em]"
                    style={{ color: `hsl(${active.accent})` }}
                  >
                    {active.sector}
                  </div>
                  <div className="mt-3 font-heading text-3xl font-extrabold leading-[1.05] tracking-[-0.02em] text-foreground lg:text-4xl">
                    {active.brand}
                  </div>
                  <p className="mt-3 text-[14px] leading-[1.6] text-foreground/72">
                    {active.tagline}
                  </p>
                  <div className="mt-6 flex justify-end">
                    <div
                      className="rounded-2xl border border-border/50 bg-card/40 px-5 py-3 text-right backdrop-blur-md"
                      style={{ boxShadow: `0 20px 60px -30px hsl(${active.accent} / 0.55)` }}
                    >
                      <div
                        className="font-heading text-[2.4rem] font-extrabold leading-none tracking-[-0.03em]"
                        style={{ color: `hsl(${active.accent})` }}
                      >
                        {active.metric}
                      </div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/64">
                        {active.metricLabel}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Center: hero phone with side preview phones */}
            <div className="relative flex items-center justify-center" style={{ perspective: "2000px" }}>
              {/* Previous phone (left, smaller, dimmed) */}
              <motion.button
                onClick={() => setActiveIndex(prevIndex)}
                className="absolute left-[-110px] top-1/2 z-10 -translate-y-1/2 cursor-pointer focus:outline-none"
                whileHover={{ scale: 1.05, x: 4 }}
                aria-label={`Vedi ${MOCKUPS[prevIndex].brand}`}
              >
                <div
                  className="relative aspect-[9/19] w-[120px] overflow-hidden rounded-[1.4rem] border border-border/50 bg-card/60 opacity-60 backdrop-blur-md transition-opacity hover:opacity-90"
                  style={{
                    transform: "rotateY(18deg) translateZ(-30px)",
                    boxShadow: `0 30px 80px -20px hsl(${MOCKUPS[prevIndex].accent} / 0.4)`,
                  }}
                >
                  <img
                    src={MOCKUPS[prevIndex].img}
                    alt={MOCKUPS[prevIndex].brand}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--background)/0.3),transparent_60%)]" />
                </div>
              </motion.button>

              {/* Next phone (right, smaller, dimmed) */}
              <motion.button
                onClick={() => setActiveIndex(nextIndex)}
                className="absolute right-[-110px] top-1/2 z-10 -translate-y-1/2 cursor-pointer focus:outline-none"
                whileHover={{ scale: 1.05, x: -4 }}
                aria-label={`Vedi ${MOCKUPS[nextIndex].brand}`}
              >
                <div
                  className="relative aspect-[9/19] w-[120px] overflow-hidden rounded-[1.4rem] border border-border/50 bg-card/60 opacity-60 backdrop-blur-md transition-opacity hover:opacity-90"
                  style={{
                    transform: "rotateY(-18deg) translateZ(-30px)",
                    boxShadow: `0 30px 80px -20px hsl(${MOCKUPS[nextIndex].accent} / 0.4)`,
                  }}
                >
                  <img
                    src={MOCKUPS[nextIndex].img}
                    alt={MOCKUPS[nextIndex].brand}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(-90deg,hsl(var(--background)/0.3),transparent_60%)]" />
                </div>
              </motion.button>

              {/* Hero phone */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`hero-${active.brand}`}
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -8 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-20"
                >
                  <div
                    className="relative aspect-[9/19.5] w-[230px] rounded-[2.3rem] border border-border/80 bg-card/80 lg:w-[260px] lg:rounded-[2.5rem]"
                    style={{
                      boxShadow: `0 60px 140px -30px hsl(${active.accent} / 0.7), 0 0 0 1px hsl(${active.accent} / 0.45), 0 0 80px hsl(${active.accent} / 0.22)`,
                      transition: "box-shadow 0.8s ease",
                    }}
                  >
                    <div className="absolute left-1/2 top-[1.6%] z-20 h-[2.2%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
                    <div className="absolute inset-[5px] overflow-hidden rounded-[2rem] bg-background lg:rounded-[2.2rem]">
                      <img
                        src={active.img}
                        alt={active.brand}
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover object-top"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--foreground)/0.10),transparent_30%,transparent_70%,hsl(var(--primary)/0.10))]" />
                    </div>
                    {/* Glass shine */}
                    <div className="pointer-events-none absolute inset-0 rounded-[2.3rem] bg-[linear-gradient(150deg,hsl(var(--foreground)/0.18),transparent_30%,transparent_70%,hsl(var(--gold)/0.10))] lg:rounded-[2.5rem]" />
                  </div>
                  {/* Reflection */}
                  <div
                    className="absolute -bottom-6 left-1/2 h-[36px] w-[88%] -translate-x-1/2 rounded-full blur-2xl"
                    style={{ background: `radial-gradient(ellipse, hsl(${active.accent} / 0.55), transparent 70%)` }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right thumbnails column */}
            <div className="flex flex-col gap-2.5">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-foreground/50">
                Galleria · {String(activeIndex + 1).padStart(2, "0")} / {String(MOCKUPS.length).padStart(2, "0")}
              </div>
              <div className="flex max-h-[460px] flex-col gap-2 overflow-y-auto pr-1">
                {MOCKUPS.map((m, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={m.brand}
                      onClick={() => setActiveIndex(i)}
                      className="group flex items-center gap-3 rounded-xl border bg-card/40 p-2 text-left backdrop-blur-md transition-all duration-300"
                      style={{
                        borderColor: isActive ? `hsl(${m.accent} / 0.6)` : "hsl(var(--border) / 0.4)",
                        boxShadow: isActive ? `0 14px 40px -16px hsl(${m.accent} / 0.5)` : "none",
                        background: isActive ? `linear-gradient(135deg, hsl(${m.accent} / 0.08), hsl(var(--card) / 0.6))` : undefined,
                      }}
                    >
                      <div
                        className="relative aspect-[9/19] w-[36px] flex-shrink-0 overflow-hidden rounded-[8px] border border-border/40"
                        style={{ boxShadow: isActive ? `0 0 0 1.5px hsl(${m.accent} / 0.7)` : undefined }}
                      >
                        <img
                          src={m.img}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover object-top"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className="truncate text-[10px] font-bold uppercase tracking-[0.16em]"
                          style={{ color: isActive ? `hsl(${m.accent})` : "hsl(var(--foreground) / 0.5)" }}
                        >
                          {m.sector}
                        </div>
                        <div className="truncate text-[13px] font-semibold text-foreground">{m.brand}</div>
                      </div>
                      <div
                        className="text-[12px] font-extrabold tabular-nums"
                        style={{ color: isActive ? `hsl(${m.accent})` : "hsl(var(--foreground) / 0.4)" }}
                      >
                        {m.metric}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ====================== MOBILE LAYOUT (<md) ====================== */}
          <div className="md:hidden">
            {/* Hero phone — centered, large enough */}
            <div className="relative mx-auto flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`m-hero-${active.brand}`}
                  initial={{ opacity: 0, scale: 0.94, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -10 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div
                    className="relative aspect-[9/19.5] w-[210px] rounded-[2rem] border border-border/80 bg-card/80 sm:w-[235px] sm:rounded-[2.2rem]"
                    style={{
                      boxShadow: `0 50px 120px -30px hsl(${active.accent} / 0.7), 0 0 0 1px hsl(${active.accent} / 0.45), 0 0 60px hsl(${active.accent} / 0.22)`,
                      transition: "box-shadow 0.8s ease",
                    }}
                  >
                    <div className="absolute left-1/2 top-[1.6%] z-20 h-[2.2%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
                    <div className="absolute inset-[5px] overflow-hidden rounded-[1.7rem] bg-background sm:rounded-[1.9rem]">
                      <img
                        src={active.img}
                        alt={active.brand}
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover object-top"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--foreground)/0.10),transparent_30%,transparent_70%,hsl(var(--primary)/0.10))]" />
                    </div>
                    <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(150deg,hsl(var(--foreground)/0.18),transparent_30%,transparent_70%,hsl(var(--gold)/0.10))] sm:rounded-[2.2rem]" />
                  </div>
                  <div
                    className="absolute -bottom-5 left-1/2 h-[28px] w-[80%] -translate-x-1/2 rounded-full blur-2xl"
                    style={{ background: `radial-gradient(ellipse, hsl(${active.accent} / 0.55), transparent 70%)` }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Info card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`m-info-${active.brand}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mt-10 max-w-[420px] rounded-2xl border border-border/60 bg-card/60 p-4 text-center backdrop-blur-xl"
                style={{ boxShadow: `0 30px 80px -40px hsl(${active.accent} / 0.5)` }}
              >
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.28em]"
                  style={{ color: `hsl(${active.accent})` }}
                >
                  {active.sector}
                </div>
                <div className="mt-1.5 font-heading text-xl font-extrabold leading-tight text-foreground">
                  {active.brand}
                </div>
                <p className="mt-1.5 text-[12.5px] leading-[1.55] text-foreground/72">
                  {active.tagline}
                </p>
                <div className="mt-3 flex items-center justify-center gap-2 border-t border-border/40 pt-3">
                  <div
                    className="font-heading text-2xl font-extrabold leading-none tracking-[-0.02em]"
                    style={{ color: `hsl(${active.accent})` }}
                  >
                    {active.metric}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/64">
                    {active.metricLabel}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile thumbnail strip — horizontal scroll */}
            <div className="mt-6 -mx-4 px-4">
              <div className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {MOCKUPS.map((m, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={m.brand}
                      onClick={() => setActiveIndex(i)}
                      className="group relative flex-shrink-0 snap-center focus:outline-none"
                      aria-label={`Vedi ${m.brand}`}
                    >
                      <div
                        className="relative aspect-[9/19] w-[58px] overflow-hidden rounded-[10px] border bg-card/60 transition-all duration-400"
                        style={{
                          borderColor: isActive ? `hsl(${m.accent} / 0.7)` : "hsl(var(--border) / 0.5)",
                          boxShadow: isActive
                            ? `0 14px 30px -10px hsl(${m.accent} / 0.6), 0 0 0 1.5px hsl(${m.accent} / 0.6)`
                            : `0 6px 18px -8px hsl(${m.accent} / 0.3)`,
                          transform: isActive ? "scale(1.1) translateY(-3px)" : "scale(1)",
                          opacity: isActive ? 1 : 0.62,
                        }}
                      >
                        <img
                          src={m.img}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover object-top"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress indicator (both layouts) */}
          <div className="mt-8 flex items-center justify-center gap-2 sm:mt-10">
            {MOCKUPS.map((m, i) => (
              <button
                key={m.brand}
                onClick={() => setActiveIndex(i)}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === activeIndex ? 32 : 8,
                  background:
                    i === activeIndex ? `hsl(${m.accent})` : "hsl(var(--foreground) / 0.18)",
                  boxShadow: i === activeIndex ? `0 0 12px hsl(${m.accent} / 0.6)` : "none",
                }}
                aria-label={`Vai a ${m.brand}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
