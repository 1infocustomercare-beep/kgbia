import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const S = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups";

const PROJECTS = [
  { brand: "COTE Miami", sector: "Steakhouse premium", img: `${S}/COTE%20Miami/a-obsidian-mobile-home.png`, tone: "gold", result: "+34%", metric: "scontrino medio" },
  { brand: "Aura Spa", sector: "Wellness boutique", img: `${S}/Aura%20Milano%20Spa/mobile-luce-pura-home.png`, tone: "violet", result: "+218%", metric: "prenotazioni online" },
  { brand: "Neo Nails", sector: "Beauty studio", img: `${S}/Neo%20Nails%20Brickell/frosted-glass-home.png`, tone: "blue", result: "3.2×", metric: "retention clienti" },
  { brand: "City Padel", sector: "Sport club", img: `${S}/City%20Padel%20Milano/mobile-fresh-azzurro-home.png`, tone: "emerald", result: "94%", metric: "occupazione campi" },
  { brand: "DIMORA", sector: "Real estate luxury", img: `${S}/DIMORA%20Milano/eleganza-milanese-home-mobile.png`, tone: "gold", result: "+187%", metric: "lead qualificati" },
  { brand: "Paperfish", sector: "Sushi omakase", img: `${S}/Paperfish%20Sushi/a-sakura-home.png`, tone: "violet", result: "Sold-out", metric: "3 mesi in anticipo" },
  { brand: "FAR Medical", sector: "Healthcare premium", img: `${S}/FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png`, tone: "blue", result: "GDPR", metric: "compliance totale" },
];

export default function HorizontalPortfolio() {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.7 });

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const viewport = window.innerWidth;
      setMaxX(Math.max(track.scrollWidth - viewport + 24, 0));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => { window.removeEventListener("resize", measure); ro.disconnect(); };
  }, []);

  const x = useTransform(smooth, [0, 1], [0, -maxX]);

  return (
    <section ref={ref} id="portfolio" className="landing-section relative overflow-hidden" data-theme="dark" style={{ height: `${PROJECTS.length * 22 + 80}vh` }}>
      <div className="sticky top-0 flex h-[100svh] overflow-hidden">
        <div className="absolute inset-0 landing-section-glow" data-tone="gold" />

        <div className="relative mx-auto flex w-full max-w-[1600px] flex-col justify-center px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-2 flex flex-col gap-2 sm:mb-3 lg:mb-4 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-[760px]" data-tone="gold">
              <span className="landing-pill mb-2 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.26em] sm:mb-2 sm:px-3.5 sm:py-1.5 sm:text-[10px]">Portfolio live</span>
              <h2 className="max-w-[18ch] font-heading text-[clamp(1.3rem,3.6vw,2.6rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground">
                Preview reali che <span className="landing-heading-gradient">comunicano valore</span> in 3 secondi.
              </h2>
            </div>

            <div className="hidden items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/58 lg:flex">
              <span>Scroll orizzontale fisso</span>
              <div className="h-px w-12 bg-border/80" />
            </div>
          </motion.div>

          <motion.div ref={trackRef} style={{ x }} className="flex w-max items-stretch gap-4 pr-6 will-change-transform sm:gap-5 lg:gap-6 lg:pr-12">
            {PROJECTS.map((project, idx) => (
              <ProjectCard key={project.brand} project={project} index={idx} />
            ))}
          </motion.div>

          <div className="mt-2 flex flex-col gap-2 sm:mt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[11px] leading-[1.5] text-foreground/68 sm:text-[12px]">
              Ogni progetto include design premium, funnel persuasivo e proof of value.
            </div>
            <button onClick={() => navigate("/demo")} className="landing-button-secondary self-start px-4 py-2 text-[13px] font-semibold sm:self-auto sm:px-5 sm:py-2.5">
              Esplora tutti i progetti →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, rotateY: 4, rotateX: -2 }}
      style={{ transformStyle: "preserve-3d", perspective: "1400px" }}
      className="landing-surface group relative flex h-[82svh] w-[78vw] min-w-[280px] max-w-[340px] flex-col overflow-hidden rounded-[24px] p-3 sm:h-[84svh] sm:w-[52vw] sm:max-w-[380px] sm:rounded-[28px] sm:p-4 lg:h-[86svh] lg:w-[32vw] lg:max-w-[420px] lg:p-5"
      data-tone={project.tone}
    >
      {/* Header compatto */}
      <div className="mb-2 flex items-start justify-between gap-2 px-1 sm:mb-2.5">
        <div className="min-w-0">
          <div className="text-[8px] font-semibold uppercase tracking-[0.22em] text-foreground/65 sm:text-[9px]">{project.sector}</div>
          <h3 className="mt-0.5 truncate font-heading text-[clamp(1rem,2vw,1.5rem)] font-extrabold leading-[1] tracking-[-0.04em] text-foreground">
            {project.brand}
          </h3>
        </div>
        <span className="landing-pill shrink-0 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.18em] sm:text-[8px]">case</span>
      </div>

      {/* Mockup stage — iPhone INTERO visibile */}
      <div
        className="relative mx-auto flex flex-1 w-full items-center justify-center overflow-hidden rounded-[20px] sm:rounded-[24px]"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 30%, hsl(var(--landing-accent, var(--primary)) / 0.22), transparent 70%), linear-gradient(160deg, hsl(228 22% 8% / 0.4), hsl(228 22% 5% / 0.7))`,
        }}
      >
        {/* Glow halo */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-90"
          style={{ background: "radial-gradient(circle, hsl(var(--landing-accent, var(--primary)) / 0.4), transparent 65%)" }}
        />

        {/* iPhone frame INTERO — h-full per riempire lo stage */}
        <motion.div
          whileHover={{ scale: 1.03, y: -2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex h-full items-center justify-center py-3"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="relative aspect-[9/19.5] h-full max-h-full rounded-[1.8rem] border border-border/70 bg-card/80 sm:rounded-[2rem] lg:rounded-[2.2rem]"
            style={{
              boxShadow:
                "0 40px 100px -28px hsl(var(--landing-accent, var(--primary)) / 0.55), 0 0 0 1px hsl(var(--foreground) / 0.06)",
            }}
          >
            {/* Notch */}
            <div className="absolute left-1/2 top-[1.5%] z-20 h-[2.2%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
            {/* Screen */}
            <div className="absolute inset-[5px] overflow-hidden rounded-[1.5rem] bg-background sm:rounded-[1.7rem] lg:rounded-[1.9rem]">
              <img
                src={project.img}
                alt={`Preview premium ${project.brand}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
              />
              {/* Screen sheen */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,hsl(0_0%_100%/0.10),transparent_30%,transparent_72%,hsl(var(--landing-accent,var(--primary))/0.18))]" />
            </div>
            {/* Outer reflection */}
            <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] bg-[linear-gradient(150deg,hsl(0_0%_100%/0.16),transparent_30%,transparent_70%,hsl(0_0%_100%/0.06))] sm:rounded-[2rem] lg:rounded-[2.2rem]" />
          </div>

          {/* Floating result chip top-right */}
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.05, duration: 0.55 }}
            className="absolute right-1 top-[10%] z-20 rounded-2xl border border-border/70 bg-card/90 px-2.5 py-1.5 backdrop-blur-xl sm:right-2 sm:px-3 sm:py-2"
            style={{ boxShadow: "0 16px 40px -10px hsl(var(--landing-accent, var(--primary)) / 0.55)" }}
          >
            <div className="text-[7px] font-bold uppercase tracking-[0.18em] text-foreground/65 sm:text-[8px]">Risultato</div>
            <div className="mt-0.5 font-heading text-sm font-extrabold leading-none text-foreground sm:text-base">{project.result}</div>
          </motion.div>

          {/* Floating tag chip bottom-left */}
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 + index * 0.05, duration: 0.55 }}
            className="absolute left-1 bottom-[10%] z-20 rounded-2xl border border-border/70 bg-card/90 px-2.5 py-1.5 backdrop-blur-xl sm:left-2 sm:px-3 sm:py-2"
            style={{ boxShadow: "0 16px 40px -10px hsl(var(--empire-violet) / 0.45)" }}
          >
            <div className="text-[7px] font-bold uppercase tracking-[0.18em] text-foreground/65 sm:text-[8px]">Live</div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              <span className="text-[9px] font-semibold text-foreground sm:text-[10px]">{project.metric}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Reflection under phone */}
        <div className="pointer-events-none absolute bottom-1 left-1/2 h-[16px] w-[55%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,hsl(var(--landing-accent,var(--primary))/0.5),transparent_70%)] blur-2xl" />
      </div>

      {/* Footer CTA strip compatto */}
      <div className="mt-2 flex items-center justify-between gap-2 px-1 sm:mt-2.5">
        <div className="min-w-0">
          <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/65">Stack completo</div>
          <div className="mt-0.5 truncate text-[11px] text-foreground/85 sm:text-[12px]">Sito · Dashboard · AI · WhatsApp</div>
        </div>
        <span className="shrink-0 rounded-full border border-border/70 bg-background/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-foreground/85 backdrop-blur-md transition-colors group-hover:border-primary/60 group-hover:text-foreground">
          0{index + 1}
        </span>
      </div>
    </motion.article>
  );
}
