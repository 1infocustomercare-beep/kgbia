import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";

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

// Counter-rotating satellite — extracted to use hooks legally per item
function OrbitSatellite({
  m,
  i,
  total,
  isActive,
  rotation,
  onSelect,
}: {
  m: Mockup;
  i: number;
  total: number;
  isActive: boolean;
  rotation: MotionValue<number>;
  onSelect: () => void;
}) {
  const angle = (i * 360) / total;
  const counter = useTransform(rotation, (v) => -v);
  return (
    <button
      onClick={onSelect}
      className="absolute left-1/2 top-1/2 cursor-pointer focus:outline-none"
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(min(36vw, 230px) * -1)) rotate(-${angle}deg)`,
      }}
      aria-label={`Vedi ${m.brand}`}
    >
      <motion.div style={{ rotate: counter }} className="will-change-transform">
        <div
          className="relative aspect-[9/19] w-[52px] overflow-hidden rounded-[11px] border border-border/60 bg-card/80 backdrop-blur-md transition-all duration-500 sm:w-[64px] sm:rounded-[13px] lg:w-[76px] lg:rounded-[15px]"
          style={{
            boxShadow: isActive
              ? `0 22px 60px -10px hsl(${m.accent} / 0.75), 0 0 0 2px hsl(${m.accent} / 0.65), 0 0 30px hsl(${m.accent} / 0.4)`
              : `0 12px 32px -10px hsl(${m.accent} / 0.45)`,
            transform: isActive ? "scale(1.22)" : "scale(1)",
          }}
        >
          <img
            src={m.img}
            alt={m.brand}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(0_0%_100%/0.12),transparent_45%)]" />
          {isActive && (
            <div
              className="pointer-events-none absolute inset-0 rounded-[11px] sm:rounded-[13px] lg:rounded-[15px]"
              style={{ boxShadow: `inset 0 0 14px hsl(${m.accent} / 0.45)` }}
            />
          )}
        </div>
      </motion.div>
    </button>
  );
}

export default function Orbital3DShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.65 });

  // Orbit rotates a full 540° across the pinned section (1.5 turns = cinematic)
  const scrollRotation = useTransform(smooth, [0, 1], [-30, 510]);
  // Subtle 3D tilt — orbit feels like a real disc
  const orbitTiltX = useTransform(smooth, [0, 0.5, 1], [18, 8, 14]);
  const titleY = useTransform(smooth, [0, 0.18], [40, 0]);
  const titleOpacity = useTransform(smooth, [0, 0.14], [0, 1]);
  const stageScale = useTransform(smooth, [0, 0.4, 0.85, 1], [0.92, 1, 1.02, 0.96]);
  const infoOpacity = useTransform(smooth, [0.05, 0.18, 0.92, 1], [0, 1, 1, 0.6]);

  // Drive the active mockup via scroll progress (so the user FEELS the scroll moves the showcase)
  useEffect(() => {
    const unsub = smooth.on("change", (v) => {
      // Map scroll progress [0..1] -> index, with a small lead-in
      const idx = Math.min(MOCKUPS.length - 1, Math.max(0, Math.floor(v * MOCKUPS.length * 0.98)));
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    });
    return () => unsub();
  }, [smooth]);

  // Auto-rotate ONLY when not actively scrolling and not hovering
  useEffect(() => {
    if (hovering) return;
    let lastY = window.scrollY;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let interval: ReturnType<typeof setInterval> | null = null;

    const startAuto = () => {
      if (interval) return;
      interval = setInterval(() => {
        setActiveIndex((i) => (i + 1) % MOCKUPS.length);
      }, 3600);
    };
    const stopAuto = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const onScroll = () => {
      if (Math.abs(window.scrollY - lastY) > 4) {
        stopAuto();
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(startAuto, 1400);
      }
      lastY = window.scrollY;
    };

    startAuto();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      stopAuto();
      if (idleTimer) clearTimeout(idleTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hovering]);

  const active = MOCKUPS[activeIndex];
  // Section is tall enough to give one full viewport per mockup of "feel" but compressed
  const sectionHeight = useMemo(() => `${MOCKUPS.length * 55 + 80}svh`, []);

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="landing-section relative overflow-hidden"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Ambient backdrop */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 transition-[background] duration-1000"
            style={{
              background: `
                radial-gradient(ellipse 60% 45% at 50% 50%, hsl(${active.accent} / 0.22), transparent 65%),
                radial-gradient(ellipse 40% 30% at 12% 18%, hsl(${active.accent} / 0.10), transparent 70%),
                radial-gradient(ellipse 40% 30% at 88% 82%, hsl(248 70% 60% / 0.10), transparent 70%)
              `,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--foreground) / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.4) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)",
            }}
          />
        </div>

        <motion.div
          style={{ scale: stageScale }}
          className="relative mx-auto flex h-full max-w-[1280px] flex-col justify-center px-3 py-3 sm:px-5 sm:py-4 lg:px-8 lg:py-5"
        >
          {/* Header */}
          <motion.div
            style={{ y: titleY, opacity: titleOpacity }}
            className="mx-auto mb-3 max-w-[720px] text-center sm:mb-4"
          >
            <div
              className="landing-pill mx-auto mb-2 inline-flex items-center gap-2 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.26em] sm:px-4 sm:py-2 sm:text-[10px]"
              data-tone="violet"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Portfolio cinematografico
            </div>
            <h2 className="mb-2 font-heading text-[clamp(1.5rem,4.4vw,2.6rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-foreground">
              <span className="block">Mockup reali in orbita.</span>
              <span className="block landing-heading-gradient">Lo scroll guida la scena.</span>
            </h2>
            <p className="mx-auto max-w-[520px] text-[clamp(0.82rem,1.55vw,0.95rem)] leading-[1.55] text-foreground/76">
              La sezione resta fissata: ogni scroll ruota l'orbita e mette al centro un nuovo progetto. Quando finisce, la pagina riprende.
            </p>
          </motion.div>

          {/* Orbit stage */}
          <div
            className="relative mx-auto flex h-[360px] w-full max-w-[680px] items-center justify-center sm:h-[440px] lg:h-[520px]"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{ perspective: "1600px" }}
          >
            {/* Orbital rings tilted in 3D */}
            <motion.div
              className="absolute inset-0 m-auto"
              style={{
                rotateX: orbitTiltX,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/12"
                style={{
                  width: "min(86vw, 540px)",
                  height: "min(86vw, 540px)",
                  boxShadow: `0 0 90px hsl(${active.accent} / 0.18) inset`,
                  transition: "box-shadow 0.8s ease",
                }}
              />
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-foreground/10"
                style={{ width: "min(70vw, 420px)", height: "min(70vw, 420px)" }}
              />
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/8"
                style={{ width: "min(54vw, 320px)", height: "min(54vw, 320px)" }}
              />

              {/* Rotating ring with satellites */}
              <motion.div
                className="absolute inset-0"
                style={{ rotate: scrollRotation, transformStyle: "preserve-3d" }}
              >
                {MOCKUPS.map((m, i) => (
                  <OrbitSatellite
                    key={m.brand}
                    m={m}
                    i={i}
                    total={MOCKUPS.length}
                    isActive={i === activeIndex}
                    rotation={scrollRotation}
                    onSelect={() => setActiveIndex(i)}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Center hero phone */}
            <motion.div
              key={active.brand}
              initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-20"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="relative aspect-[9/19.5] w-[160px] rounded-[1.9rem] border border-border/80 bg-card/80 sm:w-[195px] sm:rounded-[2.1rem] lg:w-[230px] lg:rounded-[2.3rem]"
                style={{
                  boxShadow: `0 60px 160px -30px hsl(${active.accent} / 0.75), 0 0 0 1px hsl(${active.accent} / 0.5), 0 0 80px hsl(${active.accent} / 0.25)`,
                  transition: "box-shadow 0.8s ease",
                }}
              >
                <div className="absolute left-1/2 top-[1.6%] z-20 h-[2.2%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
                <div className="absolute inset-[4px] overflow-hidden rounded-[1.6rem] bg-background sm:rounded-[1.8rem] lg:rounded-[2rem]">
                  {MOCKUPS.map((m, i) => (
                    <motion.img
                      key={m.brand}
                      src={m.img}
                      alt={m.brand}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      initial={false}
                      animate={{ opacity: i === activeIndex ? 1 : 0, scale: i === activeIndex ? 1 : 1.06 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  ))}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--foreground)/0.10),transparent_30%,transparent_70%,hsl(var(--primary)/0.10))]" />
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-[1.9rem] bg-[linear-gradient(150deg,hsl(var(--foreground)/0.16),transparent_30%,transparent_70%,hsl(var(--gold)/0.10))] sm:rounded-[2.1rem] lg:rounded-[2.3rem]" />
              </div>

              {/* Reflection */}
              <div
                className="absolute -bottom-5 left-1/2 h-[32px] w-[85%] -translate-x-1/2 rounded-full blur-2xl transition-[background] duration-700"
                style={{ background: `radial-gradient(ellipse, hsl(${active.accent} / 0.6), transparent 70%)` }}
              />
            </motion.div>
          </div>

          {/* Info card */}
          <motion.div
            style={{ opacity: infoOpacity }}
            className="mx-auto mt-4 w-full max-w-[820px] sm:mt-5"
          >
            <motion.div
              key={`info-${active.brand}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="grid grid-cols-1 items-center gap-3 rounded-2xl border border-border/60 bg-card/50 p-3 backdrop-blur-xl sm:grid-cols-[1fr_auto] sm:p-4"
              style={{ boxShadow: `0 30px 80px -40px hsl(${active.accent} / 0.45)` }}
            >
              <div className="text-center sm:text-left">
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.24em] sm:text-[11px]"
                  style={{ color: `hsl(${active.accent})` }}
                >
                  {active.sector}
                </div>
                <div className="mt-1 font-heading text-base font-extrabold text-foreground sm:text-xl lg:text-2xl">
                  {active.brand}
                </div>
                <p className="mt-1 text-xs text-foreground/78 sm:text-[13px]">{active.tagline}</p>
              </div>
              <div className="flex items-center justify-center gap-3 border-t border-border/40 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                <div className="text-center">
                  <div
                    className="font-heading text-2xl font-extrabold leading-none sm:text-3xl"
                    style={{ color: `hsl(${active.accent})` }}
                  >
                    {active.metric}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-foreground/68 sm:text-[11px]">
                    {active.metricLabel}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Progress dots */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:mt-4">
            {MOCKUPS.map((m, i) => (
              <button
                key={m.brand}
                onClick={() => setActiveIndex(i)}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === activeIndex ? 28 : 8,
                  background: i === activeIndex ? `hsl(${m.accent})` : "hsl(var(--foreground) / 0.18)",
                }}
                aria-label={`Vai a ${m.brand}`}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <motion.div
            style={{ opacity: useTransform(smooth, [0, 0.1, 0.85, 1], [0.7, 0.7, 0.7, 0]) }}
            className="mt-2 flex items-center justify-center gap-2 text-[9px] font-medium uppercase tracking-[0.28em] text-foreground/58 sm:text-[10px]"
          >
            <span className="h-px w-6 bg-border/80" />
            <span>Scrolla per ruotare l'orbita</span>
            <span className="h-px w-6 bg-border/80" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
