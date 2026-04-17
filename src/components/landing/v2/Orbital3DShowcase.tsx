import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

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
  {
    brand: "COTE Miami",
    sector: "Hospitality premium",
    metric: "+34%",
    metricLabel: "scontrino medio",
    img: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`,
    accent: "215 90% 62%",
    tagline: "Korean BBQ Michelin · ordini tableside",
  },
  {
    brand: "Aura Milano Spa",
    sector: "Wellness boutique",
    metric: "+218%",
    metricLabel: "prenotazioni online",
    img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`,
    accent: "248 80% 70%",
    tagline: "Spa luxury · booking & loyalty integrato",
  },
  {
    brand: "DIMORA Milano",
    sector: "Real estate luxury",
    metric: "+187%",
    metricLabel: "lead qualificati",
    img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`,
    accent: "38 80% 62%",
    tagline: "Immobiliare premium · CRM AI integrato",
  },
  {
    brand: "Neo Nails Brickell",
    sector: "Beauty studio",
    metric: "3.2×",
    metricLabel: "retention clienti",
    img: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`,
    accent: "325 75% 66%",
    tagline: "Beauty studio · agenda + upsell automatico",
  },
  {
    brand: "FAR Medical",
    sector: "Healthcare premium",
    metric: "GDPR",
    metricLabel: "compliance totale",
    img: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`,
    accent: "172 80% 58%",
    tagline: "Studio medico · cartella crittografata",
  },
  {
    brand: "Paperfish Sushi",
    sector: "Fine dining",
    metric: "+92%",
    metricLabel: "coperti weekend",
    img: `${S}/Paperfish%20Sushi/b-luxury-dark-home.png`,
    accent: "338 70% 64%",
    tagline: "Omakase japanese · prenotazioni AI",
  },
  {
    brand: "La Vang Vietnamese",
    sector: "Luxury restaurant",
    metric: "+156%",
    metricLabel: "reorder mensile",
    img: `${S}/La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png`,
    accent: "45 85% 60%",
    tagline: "Asian fusion · loyalty + recensioni shield",
  },
  {
    brand: "Batey Cevicheria",
    sector: "Casual premium",
    metric: "−42%",
    metricLabel: "no-show",
    img: `${S}/Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-home.png`,
    accent: "192 78% 56%",
    tagline: "Cevicheria urbana · QR ordering smart",
  },
];

export default function Orbital3DShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.6 });

  const scrollRotation = useTransform(smooth, [0, 1], [0, 360]);
  const titleY = useTransform(smooth, [0, 0.32], [44, 0]);
  const titleOpacity = useTransform(smooth, [0, 0.2], [0, 1]);
  const stageScale = useTransform(smooth, [0, 0.5, 1], [0.94, 1, 1.03]);

  useEffect(() => {
    if (hovering) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % MOCKUPS.length);
    }, 3200);
    return () => clearInterval(id);
  }, [hovering]);

  const active = MOCKUPS[activeIndex];

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="landing-section relative overflow-hidden"
      style={{ height: "220svh" }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 transition-[background] duration-700"
            style={{
              background: `
                radial-gradient(ellipse 50% 40% at 50% 50%, hsl(${active.accent} / 0.20), transparent 60%),
                radial-gradient(ellipse 35% 25% at 15% 20%, hsl(${active.accent} / 0.10), transparent 70%),
                radial-gradient(ellipse 35% 25% at 85% 80%, hsl(248 70% 60% / 0.10), transparent 70%)
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

        <motion.div style={{ scale: stageScale }} className="relative mx-auto flex h-full max-w-[1280px] flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          <motion.div
            style={{ y: titleY, opacity: titleOpacity }}
            className="mx-auto mb-6 max-w-[720px] text-center sm:mb-8"
          >
            <div
              className="landing-pill mx-auto mb-3 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.26em] sm:px-4 sm:py-2 sm:text-[10px]"
              data-tone="violet"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Portfolio cinematografico
            </div>
            <h2 className="mb-3 font-heading text-[clamp(1.8rem,5.4vw,3.2rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-foreground">
              <span className="block">Mockup reali in orbita.</span>
              <span className="block landing-heading-gradient">Preview che restano impresse.</span>
            </h2>
            <p className="mx-auto max-w-[540px] text-[clamp(0.86rem,1.7vw,1rem)] leading-[1.6] text-foreground/76">
              Qui lo scroll non scappa via: la scena resta fissata, ruota e mette al centro il progetto attivo.
            </p>
          </motion.div>

          <div
            className="relative mx-auto flex h-[390px] w-full max-w-[620px] items-center justify-center sm:h-[470px] lg:h-[540px]"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{ perspective: "1400px" }}
          >
            <div
              className="absolute inset-0 m-auto rounded-full border border-foreground/10"
              style={{
                width: "min(82vw, 500px)",
                height: "min(82vw, 500px)",
                boxShadow: `0 0 80px hsl(${active.accent} / 0.15) inset`,
                transition: "box-shadow 0.7s ease",
              }}
            />
            <div
              className="absolute inset-0 m-auto rounded-full border border-dashed border-foreground/8"
              style={{ width: "min(66vw, 380px)", height: "min(66vw, 380px)" }}
            />

            <motion.div
              className="absolute inset-0"
              style={{ rotate: scrollRotation, transformStyle: "preserve-3d" }}
            >
              {MOCKUPS.map((m, i) => {
                const angle = (i * 360) / MOCKUPS.length;
                const isActive = i === activeIndex;
                return (
                  <button
                    key={m.brand}
                    onClick={() => setActiveIndex(i)}
                    className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(min(33vw, 210px) * -1)) rotate(-${angle}deg)`,
                    }}
                    aria-label={`Vedi ${m.brand}`}
                  >
                    <motion.div style={{ rotate: useTransform(scrollRotation, (v) => -v) }}>
                      <div
                        className="relative aspect-[9/19] w-[48px] overflow-hidden rounded-[10px] border border-border/60 bg-card/80 backdrop-blur-md transition-all duration-500 sm:w-[60px] sm:rounded-[12px] lg:w-[72px] lg:rounded-[14px]"
                        style={{
                          boxShadow: isActive
                            ? `0 18px 50px -10px hsl(${m.accent} / 0.7), 0 0 0 2px hsl(${m.accent} / 0.6)`
                            : `0 10px 30px -10px hsl(${m.accent} / 0.4)`,
                          transform: isActive ? "scale(1.16)" : "scale(1)",
                        }}
                      >
                        <img
                          src={m.img}
                          alt={m.brand}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover object-top"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(0_0%_100%/0.10),transparent_40%)]" />
                      </div>
                    </motion.div>
                  </button>
                );
              })}
            </motion.div>

            <motion.div
              key={active.brand}
              initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-20"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="relative aspect-[9/19.5] w-[150px] rounded-[1.9rem] border border-border/80 bg-card/80 sm:w-[185px] sm:rounded-[2.1rem] lg:w-[220px] lg:rounded-[2.3rem]"
                style={{
                  boxShadow: `0 50px 140px -30px hsl(${active.accent} / 0.7), 0 0 0 1px hsl(${active.accent} / 0.5)`,
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
                <div className="pointer-events-none absolute inset-0 rounded-[1.9rem] bg-[linear-gradient(150deg,hsl(var(--foreground)/0.14),transparent_30%,transparent_70%,hsl(var(--gold)/0.08))] sm:rounded-[2.1rem] lg:rounded-[2.3rem]" />
              </div>

              <div
                className="absolute -bottom-5 left-1/2 h-[28px] w-[80%] -translate-x-1/2 rounded-full blur-2xl transition-[background] duration-700"
                style={{ background: `radial-gradient(ellipse, hsl(${active.accent} / 0.55), transparent 70%)` }}
              />
            </motion.div>
          </div>

          <motion.div
            key={`info-${active.brand}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 grid max-w-[820px] grid-cols-1 items-center gap-4 rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-xl sm:mt-8 sm:grid-cols-[1fr_auto] sm:p-5"
            style={{ boxShadow: `0 30px 80px -40px hsl(${active.accent} / 0.4)` }}
          >
            <div className="text-center sm:text-left">
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] sm:text-[11px]" style={{ color: `hsl(${active.accent})` }}>
                {active.sector}
              </div>
              <div className="mt-1 font-heading text-lg font-extrabold text-foreground sm:text-2xl lg:text-3xl">{active.brand}</div>
              <p className="mt-1.5 text-xs text-foreground/78 sm:text-sm">{active.tagline}</p>
            </div>
            <div className="flex items-center justify-center gap-3 border-t border-border/40 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <div className="text-center">
                <div className="font-heading text-2xl font-extrabold leading-none sm:text-3xl" style={{ color: `hsl(${active.accent})` }}>
                  {active.metric}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-foreground/68 sm:text-[11px]">
                  {active.metricLabel}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:mt-6">
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
        </motion.div>
      </div>
    </section>
  );
}
