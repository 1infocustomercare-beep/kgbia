import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";

const S = "/__empire-cover-removed";

type Mockup = {
  brand: string;
  sector: string;
  metric: string;
  metricLabel: string;
  img: string;
  accent: string; // HSL components
  tagline: string;
  features: string[];
};

const MOCKUPS: Mockup[] = [
  { brand: "Onyx Brace Steakhouse", sector: "Hospitality premium", metric: "+34%", metricLabel: "scontrino medio", img: `${S}/Onyx%20Brace%20Steakhouse/a-obsidian-mobile-home.png`, accent: "215 90% 62%", tagline: "Korean BBQ Michelin · ordini tableside", features: ["Ordini al tavolo AI", "Loyalty premium", "Recensioni shield"] },
  { brand: "Aura Milano Spa", sector: "Wellness boutique", metric: "+218%", metricLabel: "prenotazioni online", img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, accent: "248 80% 70%", tagline: "Spa luxury · booking & loyalty integrato", features: ["Booking smart", "Memberships", "Upsell wellness"] },
  { brand: "DIMORA Milano", sector: "Real estate luxury", metric: "+187%", metricLabel: "lead qualificati", img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, accent: "38 80% 62%", tagline: "Immobiliare premium · CRM AI integrato", features: ["CRM AI", "Lead scoring", "Tour virtuali"] },
  { brand: "Aurora Nail Atelier", sector: "Beauty studio", metric: "3.2×", metricLabel: "retention clienti", img: `${S}/Aurora%20Nail%20Atelier/frosted-glass-home.png`, accent: "325 75% 66%", tagline: "Beauty studio · agenda + upsell automatico", features: ["Agenda smart", "Upsell auto", "Reminder AI"] },
  { brand: "FAR Medical", sector: "Healthcare premium", metric: "GDPR", metricLabel: "compliance totale", img: `${S}/Lumen%20Clinic/a-ethereal-glass-mobile-home.png`, accent: "172 80% 58%", tagline: "Studio medico · cartella crittografata", features: ["Cartella crypto", "Telemedicina", "GDPR ready"] },
  { brand: "Sakura Atelier", sector: "Fine dining", metric: "+92%", metricLabel: "coperti weekend", img: `${S}/Sakura%20Atelier/b-luxury-dark-home.png`, accent: "338 70% 64%", tagline: "Omakase japanese · prenotazioni AI", features: ["Prenotazioni AI", "Omakase menu", "VIP table"] },
  { brand: "Indocina Noir", sector: "Luxury restaurant", metric: "+156%", metricLabel: "reorder mensile", img: `${S}/Indocina%20Noir/a-noir-saigon-home.png`, accent: "45 85% 60%", tagline: "Asian fusion · loyalty + recensioni shield", features: ["Loyalty fusion", "Reorder smart", "Reviews shield"] },
  { brand: "Pacifico Ceviche", sector: "Casual premium", metric: "−42%", metricLabel: "no-show", img: `${S}/Pacifico%20Ceviche/costa-pacifico-mobile-home.png`, accent: "192 78% 56%", tagline: "Cevicheria urbana · QR ordering smart", features: ["QR ordering", "Anti no-show", "Pay smart"] },
];

const AUTOPLAY_MS = 4200;

export default function Orbital3DShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // 3D tilt
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 120, damping: 18 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 120, damping: 18 });

  const sectionHeight = useMemo(() => `${MOCKUPS.length * 80 + 40}svh`, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.55 });

  // Drive index from scroll (when user scrolls, take over autoplay)
  useEffect(() => {
    const unsub = smooth.on("change", (v) => {
      const clamped = Math.max(0, Math.min(0.999, (v - 0.04) / 0.92));
      const idx = Math.min(MOCKUPS.length - 1, Math.floor(clamped * MOCKUPS.length));
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    });
    return () => unsub();
  }, [smooth]);

  // Track if section is in view (for autoplay only when visible)
  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio > 0.3),
      { threshold: [0, 0.3, 0.6, 1] }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Autoplay: advance every AUTOPLAY_MS when in view, not hovering, no user scroll interaction yet
  const [autoTick, setAutoTick] = useState(0);
  useEffect(() => {
    if (!isInView || isHovering || userInteracted) return;
    const id = setInterval(() => setAutoTick((t) => t + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isInView, isHovering, userInteracted]);

  useEffect(() => {
    if (autoTick === 0) return;
    setActiveIndex((i) => (i + 1) % MOCKUPS.length);
  }, [autoTick]);

  // Detect manual scroll inside section to disable autoplay
  useEffect(() => {
    const onWheel = () => {
      if (!isInView) return;
      setUserInteracted(true);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onWheel);
    };
  }, [isInView]);

  // Cinematic transforms
  const headerY = useTransform(smooth, [0, 0.08], [30, 0]);
  const headerOpacity = useTransform(smooth, [0, 0.06, 0.95, 1], [0, 1, 1, 0.85]);
  const stageScale = useTransform(smooth, [0, 0.1, 0.9, 1], [0.94, 1, 1, 0.96]);
  const decorY = useTransform(smooth, [0, 1], [-30, 30]);

  const active = MOCKUPS[activeIndex];
  const next = MOCKUPS[(activeIndex + 1) % MOCKUPS.length];
  const progressPct = ((activeIndex + 1) / MOCKUPS.length) * 100;

  // Auto-progress ring (resets each slide)
  const [ringProgress, setRingProgress] = useState(0);
  useEffect(() => {
    setRingProgress(0);
    if (!isInView || isHovering || userInteracted) return;
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / AUTOPLAY_MS);
      setRingProgress(p);
      if (p >= 1) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [activeIndex, isInView, isHovering, userInteracted]);

  // 3D tilt handler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!phoneRef.current) return;
    const rect = phoneRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    tiltY.set(dx * 14);
    tiltX.set(-dy * 14);
  };
  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    setIsHovering(false);
  };

  const goTo = (i: number) => {
    setUserInteracted(true);
    if (!sectionRef.current) {
      setActiveIndex(i);
      return;
    }
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const sectionH = sectionRef.current.offsetHeight - window.innerHeight;
    const target = sectionTop + ((i + 0.5) / MOCKUPS.length) * sectionH;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

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
            className="absolute inset-0 transition-[background] duration-1000"
          >
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 70% 50% at 50% 35%, hsl(${active.accent} / 0.22), transparent 65%),
                  radial-gradient(ellipse 50% 35% at 15% 85%, hsl(${active.accent} / 0.12), transparent 70%),
                  radial-gradient(ellipse 50% 35% at 85% 15%, hsl(248 70% 60% / 0.10), transparent 70%)
                `,
              }}
            />
          </motion.div>
          {/* Animated aurora light beam */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-[140%] w-[60%] -translate-x-1/2 -translate-y-1/2 opacity-40"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, transparent, hsl(${active.accent} / 0.18), transparent 30%, transparent 70%, hsl(${active.accent} / 0.12), transparent)`,
              filter: "blur(60px)",
            }}
          />
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
          className="relative mx-auto flex h-full max-w-[1240px] flex-col px-3 pb-3 pt-3 sm:px-6 sm:pb-6 sm:pt-8 lg:px-8 lg:pt-12"
        >
          {/* Header */}
          <motion.div
            style={{ y: headerY, opacity: headerOpacity }}
            className="mx-auto mb-2 max-w-[720px] flex-shrink-0 text-center sm:mb-5 lg:mb-7"
          >
            <div
              className="landing-pill mx-auto mb-1.5 inline-flex items-center gap-2 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.24em] sm:mb-3 sm:px-4 sm:py-2 sm:text-[10px]"
              data-tone="violet"
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: `hsl(${active.accent})`, boxShadow: `0 0 12px hsl(${active.accent})` }}
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              Live Showcase · Auto-Play
            </div>
            <h2 className="mb-1.5 font-heading text-[clamp(1.2rem,4.2vw,2.6rem)] font-extrabold leading-[1] tracking-[-0.03em] text-foreground sm:mb-3">
              <span className="block">Mockup reali. Brand premium.</span>
              <span className="block landing-heading-gradient">Cinematica live, 100% interattiva.</span>
            </h2>
            <p className="mx-auto hidden max-w-[520px] text-[13px] leading-[1.55] text-foreground/72 sm:block">
              Auto-play intelligente · Hover per il tilt 3D · Scroll o click per esplorare.
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
                    {/* Feature ticker */}
                    <div className="mt-4 flex flex-wrap justify-end gap-1.5">
                      {active.features.map((f, i) => (
                        <motion.span
                          key={f}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                          className="rounded-full border px-2.5 py-1 text-[10px] font-semibold"
                          style={{
                            borderColor: `hsl(${active.accent} / 0.4)`,
                            background: `hsl(${active.accent} / 0.08)`,
                            color: `hsl(${active.accent})`,
                          }}
                        >
                          ✦ {f}
                        </motion.span>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <div
                        className="rounded-2xl border border-border/50 bg-card/40 px-5 py-3 text-right backdrop-blur-md"
                        style={{ boxShadow: `0 20px 60px -30px hsl(${active.accent} / 0.55)` }}
                      >
                        <motion.div
                          key={`metric-${active.brand}`}
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 220, damping: 14 }}
                          className="font-heading text-[2.4rem] font-extrabold leading-none tracking-[-0.03em]"
                          style={{ color: `hsl(${active.accent})`, textShadow: `0 0 30px hsl(${active.accent} / 0.6)` }}
                        >
                          {active.metric}
                        </motion.div>
                        <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/64">
                          {active.metricLabel}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Center hero phone */}
              <div
                className="relative flex items-center justify-center"
                style={{ perspective: "2000px" }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={handleMouseLeave}
                ref={phoneRef}
              >
                {/* Auto-progress ring around phone */}
                <svg
                  className="pointer-events-none absolute z-10"
                  width="320"
                  height="320"
                  viewBox="0 0 320 320"
                  style={{ filter: `drop-shadow(0 0 18px hsl(${active.accent} / 0.5))` }}
                >
                  <circle cx="160" cy="160" r="150" fill="none" stroke={`hsl(${active.accent} / 0.12)`} strokeWidth="1.5" />
                  <circle
                    cx="160"
                    cy="160"
                    r="150"
                    fill="none"
                    stroke={`hsl(${active.accent})`}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 150}
                    strokeDashoffset={2 * Math.PI * 150 * (1 - ringProgress)}
                    transform="rotate(-90 160 160)"
                    style={{ transition: "stroke-dashoffset 40ms linear" }}
                  />
                </svg>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`hero-${active.brand}`}
                    initial={{ opacity: 0, scale: 0.92, y: 14, rotateY: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10, rotateY: 6 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-20"
                    style={{ transformStyle: "preserve-3d", rotateX: smoothTiltX, rotateY: smoothTiltY }}
                  >
                    <div
                      className="relative aspect-[9/19.5] w-[230px] rounded-[2.3rem] border border-border/80 bg-card/80 lg:w-[260px] lg:rounded-[2.5rem]"
                      style={{
                        boxShadow: `0 60px 140px -30px hsl(${active.accent} / 0.7), 0 0 0 1px hsl(${active.accent} / 0.45), 0 0 80px hsl(${active.accent} / 0.28)`,
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
                        {/* Animated shine sweep */}
                        <motion.div
                          key={`shine-${active.brand}`}
                          className="pointer-events-none absolute inset-0"
                          initial={{ x: "-120%" }}
                          animate={{ x: "120%" }}
                          transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
                          style={{
                            background: `linear-gradient(105deg, transparent 30%, hsl(${active.accent} / 0.35) 50%, transparent 70%)`,
                            mixBlendMode: "overlay",
                          }}
                        />
                        {/* LIVE badge */}
                        <div
                          className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full border px-2 py-0.5 backdrop-blur-md"
                          style={{
                            borderColor: `hsl(${active.accent} / 0.6)`,
                            background: `hsl(${active.accent} / 0.18)`,
                          }}
                        >
                          <motion.span
                            className="h-1 w-1 rounded-full"
                            style={{ background: `hsl(${active.accent})`, boxShadow: `0 0 6px hsl(${active.accent})` }}
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                          <span className="text-[7px] font-black uppercase tracking-[0.18em]" style={{ color: `hsl(${active.accent})` }}>Live</span>
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-0 rounded-[2.3rem] bg-[linear-gradient(150deg,hsl(var(--foreground)/0.18),transparent_30%,transparent_70%,hsl(var(--gold)/0.10))] lg:rounded-[2.5rem]" />
                    </div>
                    <div
                      className="absolute -bottom-6 left-1/2 h-[36px] w-[88%] -translate-x-1/2 rounded-full blur-2xl"
                      style={{ background: `radial-gradient(ellipse, hsl(${active.accent} / 0.55), transparent 70%)` }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Next-up peek (right side, behind) */}
                <motion.div
                  key={`peek-${next.brand}`}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 0.35, x: 130 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute z-0 hidden lg:block"
                  style={{ filter: "blur(2px)" }}
                >
                  <div
                    className="relative aspect-[9/19.5] w-[140px] rounded-[1.6rem] border border-border/40 bg-card/60"
                    style={{ boxShadow: `0 30px 80px -40px hsl(${next.accent} / 0.5)` }}
                  >
                    <div className="absolute inset-[3px] overflow-hidden rounded-[1.4rem] bg-background">
                      <img src={next.img} alt="" className="h-full w-full object-cover object-top opacity-70" />
                    </div>
                  </div>
                </motion.div>

                {/* Preload all mockup images invisibly */}
                <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0">
                  {MOCKUPS.map((m) => (
                    <img key={m.brand} src={m.img} alt="" loading="lazy" decoding="async" />
                  ))}
                </div>
              </div>

              {/* Right thumbnails column */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.28em] text-foreground/50">
                  <span>Galleria · {String(activeIndex + 1).padStart(2, "0")} / {String(MOCKUPS.length).padStart(2, "0")}</span>
                  <span
                    className="flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px]"
                    style={{
                      borderColor: userInteracted ? "hsl(var(--border) / 0.4)" : `hsl(${active.accent} / 0.5)`,
                      color: userInteracted ? "hsl(var(--foreground) / 0.5)" : `hsl(${active.accent})`,
                    }}
                  >
                    {userInteracted ? "Manual" : "● Auto"}
                  </span>
                </div>
                <div className="flex max-h-[440px] flex-col gap-2 overflow-y-auto pr-1">
                  {MOCKUPS.map((m, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <motion.button
                        key={m.brand}
                        onClick={() => goTo(i)}
                        whileHover={{ x: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group flex items-center gap-3 rounded-xl border bg-card/40 p-2 text-left backdrop-blur-md transition-colors duration-300"
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
                          {isActive && (
                            <motion.div
                              layoutId="thumb-glow"
                              className="absolute inset-0"
                              style={{ background: `linear-gradient(180deg, transparent, hsl(${m.accent} / 0.35))` }}
                            />
                          )}
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
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ====================== MOBILE LAYOUT (<md) ====================== */}
            <div className="flex h-full w-full flex-col items-center justify-center md:hidden">
              {/* Hero phone */}
              <div className="relative flex justify-center">
                {/* Mobile auto-progress ring */}
                <svg
                  className="pointer-events-none absolute z-10"
                  width="240"
                  height="240"
                  viewBox="0 0 240 240"
                  style={{ filter: `drop-shadow(0 0 12px hsl(${active.accent} / 0.5))` }}
                >
                  <circle cx="120" cy="120" r="112" fill="none" stroke={`hsl(${active.accent} / 0.12)`} strokeWidth="1.2" />
                  <circle
                    cx="120"
                    cy="120"
                    r="112"
                    fill="none"
                    stroke={`hsl(${active.accent})`}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 112}
                    strokeDashoffset={2 * Math.PI * 112 * (1 - ringProgress)}
                    transform="rotate(-90 120 120)"
                    style={{ transition: "stroke-dashoffset 40ms linear" }}
                  />
                </svg>

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
                        boxShadow: `0 40px 100px -30px hsl(${active.accent} / 0.7), 0 0 0 1px hsl(${active.accent} / 0.45), 0 0 50px hsl(${active.accent} / 0.28)`,
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
                        <motion.div
                          key={`m-shine-${active.brand}`}
                          className="pointer-events-none absolute inset-0"
                          initial={{ x: "-120%" }}
                          animate={{ x: "120%" }}
                          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.25 }}
                          style={{
                            background: `linear-gradient(105deg, transparent 30%, hsl(${active.accent} / 0.32) 50%, transparent 70%)`,
                            mixBlendMode: "overlay",
                          }}
                        />
                        <div
                          className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full border px-1.5 py-0.5 backdrop-blur-md"
                          style={{
                            borderColor: `hsl(${active.accent} / 0.6)`,
                            background: `hsl(${active.accent} / 0.18)`,
                          }}
                        >
                          <motion.span
                            className="h-1 w-1 rounded-full"
                            style={{ background: `hsl(${active.accent})` }}
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                          <span className="text-[6.5px] font-black uppercase tracking-[0.18em]" style={{ color: `hsl(${active.accent})` }}>Live</span>
                        </div>
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
                  {/* Mobile feature chips */}
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    {active.features.map((f, i) => (
                      <motion.span
                        key={f}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.06 }}
                        className="rounded-full border px-1.5 py-0.5 text-[8.5px] font-semibold"
                        style={{
                          borderColor: `hsl(${active.accent} / 0.4)`,
                          background: `hsl(${active.accent} / 0.08)`,
                          color: `hsl(${active.accent})`,
                        }}
                      >
                        {f}
                      </motion.span>
                    ))}
                  </div>
                  <div className="mt-2.5 flex items-center justify-center gap-2 border-t border-border/40 pt-2.5">
                    <motion.div
                      key={`m-metric-${active.brand}`}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 220, damping: 14 }}
                      className="font-heading text-xl font-extrabold leading-none tracking-[-0.02em]"
                      style={{ color: `hsl(${active.accent})`, textShadow: `0 0 18px hsl(${active.accent} / 0.5)` }}
                    >
                      {active.metric}
                    </motion.div>
                    <div className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-foreground/64">
                      {active.metricLabel}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Counter + progress bar + autoplay status */}
              <div className="mt-4 w-full max-w-[280px]">
                <div className="flex items-center justify-between text-[9.5px] font-bold uppercase tracking-[0.24em] text-foreground/55">
                  <span>{String(activeIndex + 1).padStart(2, "0")} / {String(MOCKUPS.length).padStart(2, "0")}</span>
                  <span
                    className="flex items-center gap-1"
                    style={{ color: userInteracted ? "hsl(var(--foreground) / 0.55)" : `hsl(${active.accent})` }}
                  >
                    {userInteracted ? "Manual" : "● Auto-Play"}
                  </span>
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
                onClick={() => goTo(i)}
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
