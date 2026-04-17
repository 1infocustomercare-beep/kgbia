import { useEffect, useMemo, useRef, useState } from "react";
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

  // Pinned section: each mockup gets ~80svh of scroll. Keeps it premium without infinite black space.
  const sectionHeight = useMemo(() => `${MOCKUPS.length * 80 + 40}svh`, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.55 });

  // Drive the active index from scroll progress
  useEffect(() => {
    const unsub = smooth.on("change", (v) => {
      // Use 0.05..0.95 as the "active scrolling band" so first/last frames feel intentional
      const clamped = Math.max(0, Math.min(0.999, (v - 0.04) / 0.92));
      const idx = Math.min(MOCKUPS.length - 1, Math.floor(clamped * MOCKUPS.length));
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    });
    return () => unsub();
  }, [smooth]);

  // Cinematic transforms
  const headerY = useTransform(smooth, [0, 0.08], [30, 0]);
  const headerOpacity = useTransform(smooth, [0, 0.06, 0.95, 1], [0, 1, 1, 0.85]);
  const stageScale = useTransform(smooth, [0, 0.1, 0.9, 1], [0.94, 1, 1, 0.96]);
  const decorY = useTransform(smooth, [0, 1], [-30, 30]);

  const active = MOCKUPS[activeIndex];
  const progressPct = ((activeIndex + 1) / MOCKUPS.length) * 100;

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="landing-section relative"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
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
          <div
            className="absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--foreground) / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.4) 1px, transparent 1px)",
              backgroundSize: "120px 120px",
              maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent)",
            }}
          />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        <motion.div
          style={{ scale: stageScale }}
          className="relative mx-auto flex h-full max-w-[1240px] flex-col px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-10 lg:px-8 lg:pt-14"
        >
          {/* Header */}
          <motion.div
            style={{ y: headerY, opacity: headerOpacity }}
            className="mx-auto mb-4 max-w-[720px] flex-shrink-0 text-center sm:mb-6 lg:mb-8"
          >
            <div
              className="landing-pill mx-auto mb-2.5 inline-flex items-center gap-2 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.26em] sm:mb-3 sm:px-4 sm:py-2 sm:text-[10px]"
              data-tone="violet"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Portfolio · Selezione 2024
            </div>
            <h2 className="mb-2 font-heading text-[clamp(1.45rem,4.6vw,2.6rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-foreground sm:mb-3">
              <span className="block">Mockup reali. Brand premium.</span>
              <span className="block landing-heading-gradient">Lo scroll guida la galleria.</span>
            </h2>
            <p className="mx-auto hidden max-w-[520px] text-[13px] leading-[1.55] text-foreground/72 sm:block">
              La sezione resta fissata: ogni scroll cambia progetto. Quando finisce, la pagina riprende.
            </p>
          </motion.div>

          {/* Stage */}
          <div className="relative flex flex-1 items-center justify-center">
            {/* ====================== DESKTOP LAYOUT (md+) ====================== */}
            <div className="hidden h-full w-full md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8 lg:gap-12">
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

              {/* Center hero phone */}
              <div className="relative flex items-center justify-center" style={{ perspective: "2000px" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`hero-${active.brand}`}
                    initial={{ opacity: 0, scale: 0.92, y: 14, rotateY: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10, rotateY: 6 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-20"
                    style={{ transformStyle: "preserve-3d" }}
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
                      <div className="pointer-events-none absolute inset-0 rounded-[2.3rem] bg-[linear-gradient(150deg,hsl(var(--foreground)/0.18),transparent_30%,transparent_70%,hsl(var(--gold)/0.10))] lg:rounded-[2.5rem]" />
                    </div>
                    <div
                      className="absolute -bottom-6 left-1/2 h-[36px] w-[88%] -translate-x-1/2 rounded-full blur-2xl"
                      style={{ background: `radial-gradient(ellipse, hsl(${active.accent} / 0.55), transparent 70%)` }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Preload all mockup images invisibly */}
                <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
                  {MOCKUPS.map((m) => (
                    <img key={m.brand} src={m.img} alt="" loading="lazy" decoding="async" />
                  ))}
                </div>
              </div>

              {/* Right thumbnails column */}
              <div className="flex flex-col gap-2.5">
                <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-foreground/50">
                  Galleria · {String(activeIndex + 1).padStart(2, "0")} / {String(MOCKUPS.length).padStart(2, "0")}
                </div>
                <div className="flex max-h-[440px] flex-col gap-2 overflow-y-auto pr-1">
                  {MOCKUPS.map((m, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <button
                        key={m.brand}
                        onClick={() => {
                          // Scroll to the part of the section that activates this index
                          if (!sectionRef.current) return;
                          const rect = sectionRef.current.getBoundingClientRect();
                          const sectionTop = window.scrollY + rect.top;
                          const sectionH = sectionRef.current.offsetHeight - window.innerHeight;
                          const target = sectionTop + ((i + 0.5) / MOCKUPS.length) * sectionH;
                          window.scrollTo({ top: target, behavior: "smooth" });
                        }}
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
            <div className="flex h-full w-full flex-col items-center justify-center md:hidden">
              {/* Hero phone */}
              <div className="relative flex justify-center">
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
                      className="relative aspect-[9/19.5] w-[180px] rounded-[1.85rem] border border-border/80 bg-card/80 sm:w-[210px] sm:rounded-[2.05rem]"
                      style={{
                        boxShadow: `0 40px 100px -30px hsl(${active.accent} / 0.7), 0 0 0 1px hsl(${active.accent} / 0.45), 0 0 50px hsl(${active.accent} / 0.22)`,
                        transition: "box-shadow 0.8s ease",
                      }}
                    >
                      <div className="absolute left-1/2 top-[1.6%] z-20 h-[2.2%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
                      <div className="absolute inset-[5px] overflow-hidden rounded-[1.55rem] bg-background sm:rounded-[1.75rem]">
                        <img
                          src={active.img}
                          alt={active.brand}
                          loading="eager"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover object-top"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--foreground)/0.10),transparent_30%,transparent_70%,hsl(var(--primary)/0.10))]" />
                      </div>
                      <div className="pointer-events-none absolute inset-0 rounded-[1.85rem] bg-[linear-gradient(150deg,hsl(var(--foreground)/0.18),transparent_30%,transparent_70%,hsl(var(--gold)/0.10))] sm:rounded-[2.05rem]" />
                    </div>
                    <div
                      className="absolute -bottom-4 left-1/2 h-[24px] w-[78%] -translate-x-1/2 rounded-full blur-2xl"
                      style={{ background: `radial-gradient(ellipse, hsl(${active.accent} / 0.55), transparent 70%)` }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Info card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`m-info-${active.brand}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto mt-6 w-full max-w-[380px] rounded-2xl border border-border/60 bg-card/60 p-3.5 text-center backdrop-blur-xl"
                  style={{ boxShadow: `0 30px 80px -40px hsl(${active.accent} / 0.5)` }}
                >
                  <div
                    className="text-[9.5px] font-bold uppercase tracking-[0.28em]"
                    style={{ color: `hsl(${active.accent})` }}
                  >
                    {active.sector}
                  </div>
                  <div className="mt-1 font-heading text-[18px] font-extrabold leading-tight text-foreground">
                    {active.brand}
                  </div>
                  <p className="mt-1 text-[11.5px] leading-[1.5] text-foreground/72">
                    {active.tagline}
                  </p>
                  <div className="mt-2.5 flex items-center justify-center gap-2 border-t border-border/40 pt-2.5">
                    <div
                      className="font-heading text-xl font-extrabold leading-none tracking-[-0.02em]"
                      style={{ color: `hsl(${active.accent})` }}
                    >
                      {active.metric}
                    </div>
                    <div className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-foreground/64">
                      {active.metricLabel}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Counter + progress bar */}
              <div className="mt-4 w-full max-w-[280px]">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-[0.24em] text-foreground/55">
                  <span>{String(activeIndex + 1).padStart(2, "0")} / {String(MOCKUPS.length).padStart(2, "0")}</span>
                  <span>Scrolla per continuare</span>
                </div>
                <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-foreground/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `hsl(${active.accent})`,
                      width: `${progressPct}%`,
                      boxShadow: `0 0 12px hsl(${active.accent} / 0.7)`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop progress dots */}
          <div className="mt-4 hidden flex-shrink-0 items-center justify-center gap-2 md:flex">
            {MOCKUPS.map((m, i) => (
              <button
                key={m.brand}
                onClick={() => {
                  if (!sectionRef.current) return;
                  const rect = sectionRef.current.getBoundingClientRect();
                  const sectionTop = window.scrollY + rect.top;
                  const sectionH = sectionRef.current.offsetHeight - window.innerHeight;
                  const target = sectionTop + ((i + 0.5) / MOCKUPS.length) * sectionH;
                  window.scrollTo({ top: target, behavior: "smooth" });
                }}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === activeIndex ? 32 : 8,
                  background: i === activeIndex ? `hsl(${m.accent})` : "hsl(var(--foreground) / 0.18)",
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
