import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const PROJECTS = [
  { brand: "COTE Miami", sector: "Steakhouse premium", img: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, accent: "215 90% 62%", tone: "gold", result: "+34%", metric: "scontrino medio", quote: "Esperienza obsidian che alza il perceived value." },
  { brand: "Aura Spa", sector: "Wellness boutique", img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, accent: "248 80% 70%", tone: "violet", result: "+218%", metric: "prenotazioni online", quote: "Funnel zen, conversione massima." },
  { brand: "Neo Nails", sector: "Beauty studio", img: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`, accent: "325 75% 66%", tone: "blue", result: "3.2×", metric: "retention clienti", quote: "Frosted glass UI, retention da boutique." },
  { brand: "City Padel", sector: "Sport club", img: `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`, accent: "172 80% 58%", tone: "emerald", result: "94%", metric: "occupazione campi", quote: "Booking smart, campi sempre pieni." },
  { brand: "DIMORA", sector: "Real estate luxury", img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, accent: "38 80% 62%", tone: "gold", result: "+187%", metric: "lead qualificati", quote: "Eleganza milanese, lead alto-spendenti." },
  { brand: "Paperfish", sector: "Sushi omakase", img: `${S}/Paperfish%20Sushi/a-sakura-home.png`, accent: "330 70% 64%", tone: "violet", result: "Sold-out", metric: "3 mesi in anticipo", quote: "Omakase digitale che vende il rito." },
  { brand: "FAR Medical", sector: "Healthcare premium", img: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, accent: "172 80% 58%", tone: "blue", result: "GDPR", metric: "compliance totale", quote: "Estetica ethereal con compliance totale." },
];

const AUTOPLAY_MS = 4200;

export default function HorizontalPortfolio() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const intervalRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const total = PROJECTS.length;
  const active = PROJECTS[index];

  const goTo = useCallback((next: number, dir: 1 | -1 = 1) => {
    setDirection(dir);
    setIndex(((next % total) + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(index + 1, 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1, -1), [index, goTo]);

  // Autoplay (pauses on hover/touch/inactive tab)
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = window.setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isPaused, total]);

  // Pause when tab not visible
  useEffect(() => {
    const onVis = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
    // resume after a beat
    window.setTimeout(() => setIsPaused(false), 800);
  };

  // Side previews (prev/next) for cinematic feel on tablet+
  const prevIdx = (index - 1 + total) % total;
  const nextIdx = (index + 1) % total;

  // Pre-warm next image
  useEffect(() => {
    const img = new Image();
    img.src = PROJECTS[nextIdx].img;
  }, [nextIdx]);

  const variants = useMemo(() => ({
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.94 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, scale: 0.94 }),
  }), []);

  return (
    <section
      id="portfolio"
      className="landing-section relative overflow-hidden"
      data-theme="dark"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient cinematic glow that follows the active scene */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          key={`glow-${active.brand}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 50% 25%, hsl(${active.accent} / 0.32), transparent 65%),
              radial-gradient(ellipse 50% 40% at 15% 80%, hsl(${active.accent} / 0.18), transparent 70%),
              radial-gradient(ellipse 50% 40% at 85% 80%, hsl(248 80% 64% / 0.16), transparent 70%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)/0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 60% 60% at 50% 40%, black, transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-8 max-w-[820px] text-center sm:mb-10 lg:mb-14"
          data-tone="gold"
        >
          <span className="landing-pill mb-3 inline-flex items-center gap-2 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.26em]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Cinematic Reel · {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <h2 className="font-heading text-[clamp(1.75rem,5vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-foreground">
            Preview reali che <span className="landing-heading-gradient">comunicano valore</span> in 3 secondi.
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-[13px] leading-[1.6] text-foreground/65 sm:mt-4 sm:text-[15px]">
            Ogni brand parte da zero e atterra con un'esperienza che vende. Scorri o lascia partire l'autoplay.
          </p>
        </motion.div>

        {/* Stage */}
        <div
          className="relative mx-auto flex w-full items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Side previews (desktop only) */}
          <button
            aria-label={`Vai a ${PROJECTS[prevIdx].brand}`}
            onClick={prev}
            className="hidden lg:block absolute left-0 z-10 h-full w-[22%] cursor-pointer"
          >
            <SidePhone project={PROJECTS[prevIdx]} side="left" />
          </button>

          {/* Main phone */}
          <div className="relative z-20 flex w-full max-w-[420px] flex-col items-center px-2 sm:max-w-[460px] lg:max-w-[420px]">
            <div className="relative w-full">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={active.brand}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative mx-auto w-full"
                >
                  <PhoneCard project={active} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Brand caption (animated) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`cap-${active.brand}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45 }}
                className="mt-6 w-full text-center"
              >
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.28em]"
                  style={{ color: `hsl(${active.accent})` }}
                >
                  {active.sector}
                </div>
                <h3 className="mt-1.5 font-heading text-[clamp(1.4rem,4vw,2rem)] font-extrabold tracking-[-0.03em] text-foreground">
                  {active.brand}
                </h3>
                <p className="mx-auto mt-2 max-w-[420px] text-[13px] italic leading-[1.55] text-foreground/68 sm:text-[14px]">
                  "{active.quote}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            aria-label={`Vai a ${PROJECTS[nextIdx].brand}`}
            onClick={next}
            className="hidden lg:block absolute right-0 z-10 h-full w-[22%] cursor-pointer"
          >
            <SidePhone project={PROJECTS[nextIdx]} side="right" />
          </button>
        </div>

        {/* Controls + progress */}
        <div className="mx-auto mt-8 flex w-full max-w-[680px] flex-col items-center gap-4 sm:mt-10">
          {/* Progress bar */}
          <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-foreground/10">
            <motion.div
              key={`bar-${index}-${isPaused ? "p" : "r"}`}
              initial={{ width: "0%" }}
              animate={{ width: isPaused ? "0%" : "100%" }}
              transition={{ duration: isPaused ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, hsl(${active.accent}/0.5), hsl(${active.accent}), hsl(${active.accent}/0.5))`,
                boxShadow: `0 0 18px hsl(${active.accent}/0.55)`,
              }}
            />
          </div>

          {/* Dots + arrows */}
          <div className="flex w-full items-center justify-between gap-3">
            <button
              onClick={prev}
              aria-label="Progetto precedente"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-foreground/80 backdrop-blur-md transition-all hover:scale-105 hover:border-primary/60 hover:text-primary sm:h-10 sm:w-10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>

            <div className="flex flex-1 items-center justify-center gap-1.5">
              {PROJECTS.map((p, i) => (
                <button
                  key={p.brand}
                  aria-label={`Vai a ${p.brand}`}
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === index
                      ? "w-7 sm:w-8"
                      : "w-1.5 bg-foreground/22 hover:bg-foreground/45"
                  }`}
                  style={
                    i === index
                      ? {
                          background: `hsl(${p.accent})`,
                          boxShadow: `0 0 12px hsl(${p.accent}/0.7)`,
                        }
                      : undefined
                  }
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Progetto successivo"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-foreground/80 backdrop-blur-md transition-all hover:scale-105 hover:border-primary/60 hover:text-primary sm:h-10 sm:w-10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          <button
            onClick={() => navigate("/demo")}
            className="landing-button-secondary mt-2 px-5 py-2.5 text-[12px] font-semibold sm:text-[13px]"
          >
            Esplora tutti i {total}+ progetti live →
          </button>
        </div>
      </div>
    </section>
  );
}

function PhoneCard({ project }: { project: (typeof PROJECTS)[number] }) {
  return (
    <div className="relative mx-auto flex w-full justify-center">
      {/* Floating sector chip */}
      <motion.div
        initial={{ opacity: 0, x: -16, y: -6 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.15, duration: 0.55 }}
        className="absolute -left-1 top-4 z-30 max-w-[55%] rounded-2xl border border-border/70 bg-card/85 px-3 py-2 backdrop-blur-xl sm:-left-3 sm:px-3.5"
        style={{ boxShadow: `0 18px 40px hsl(${project.accent}/0.32)` }}
      >
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] sm:text-[9px]" style={{ color: `hsl(${project.accent})` }}>
          {project.sector}
        </div>
        <div className="mt-0.5 text-xs font-semibold text-foreground sm:text-sm">{project.brand}</div>
      </motion.div>

      {/* Floating result chip */}
      <motion.div
        initial={{ opacity: 0, x: 16, y: 6 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.28, duration: 0.55 }}
        className="absolute -right-1 bottom-6 z-30 rounded-2xl border border-border/70 bg-card/85 px-3 py-2 backdrop-blur-xl sm:-right-3 sm:px-3.5"
        style={{ boxShadow: `0 18px 40px hsl(${project.accent}/0.32)` }}
      >
        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-foreground/55 sm:text-[9px]">Risultato</div>
        <div className="mt-0.5 flex items-end gap-1.5">
          <span className="font-heading text-base font-extrabold leading-none text-foreground sm:text-lg">{project.result}</span>
          <span className="pb-0.5 text-[9px] text-foreground/60 sm:text-[10px]">{project.metric}</span>
        </div>
      </motion.div>

      {/* Phone */}
      <div
        className="relative aspect-[9/19.5] w-[230px] rounded-[2.4rem] border border-border/80 bg-card/70 sm:w-[270px] lg:w-[290px]"
        style={{
          boxShadow: `0 60px 130px -30px hsl(${project.accent}/0.6), 0 0 0 1px hsl(var(--foreground)/0.05)`,
        }}
      >
        <div className="absolute left-1/2 top-[1.6%] z-20 h-[2.2%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
        <div className="absolute inset-[4px] overflow-hidden rounded-[2.1rem] bg-background">
          <img
            src={project.img}
            alt={`Preview ${project.brand}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(0_0%_100%/0.10),transparent_28%,transparent_72%,hsl(var(--primary)/0.12))]" />
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-[2.4rem] bg-[linear-gradient(150deg,hsl(0_0%_100%/0.16),transparent_30%,transparent_70%,hsl(var(--gold)/0.1))]" />
      </div>

      {/* Reflection */}
      <div
        className="pointer-events-none absolute -bottom-2 left-1/2 h-[44px] w-[78%] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `radial-gradient(ellipse, hsl(${project.accent}/0.55), transparent 70%)` }}
      />
    </div>
  );
}

function SidePhone({ project, side }: { project: (typeof PROJECTS)[number]; side: "left" | "right" }) {
  return (
    <div className={`relative flex h-full w-full items-center ${side === "left" ? "justify-start pl-2" : "justify-end pr-2"}`}>
      <div
        className={`relative aspect-[9/19.5] w-[160px] rounded-[1.8rem] border border-border/60 bg-card/50 opacity-40 transition-all duration-500 hover:opacity-70 ${
          side === "left" ? "-rotate-6" : "rotate-6"
        }`}
        style={{
          boxShadow: `0 30px 80px -24px hsl(${project.accent}/0.4)`,
        }}
      >
        <div className="absolute inset-[3px] overflow-hidden rounded-[1.6rem] bg-background">
          <img
            src={project.img}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-background/30" />
        </div>
      </div>
    </div>
  );
}
