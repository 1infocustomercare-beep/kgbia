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
    <section ref={ref} id="portfolio" className="landing-section relative overflow-hidden" data-theme="dark" style={{ height: `${PROJECTS.length * 24 + 90}vh` }}>
      <div className="sticky top-0 flex h-[100svh] overflow-hidden">
        <div className="absolute inset-0 landing-section-glow" data-tone="gold" />

        <div className="relative mx-auto flex w-full max-w-[1500px] flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-5 flex flex-col gap-4 sm:mb-6 lg:mb-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-[760px]" data-tone="gold">
              <span className="landing-pill mb-3 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.26em] sm:mb-4 sm:px-4 sm:py-2 sm:text-[10px]">Portfolio live</span>
              <h2 className="max-w-[15ch] font-heading text-[clamp(1.6rem,5vw,4rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-foreground">
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

          <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[12px] leading-[1.65] text-foreground/68 sm:text-[13px]">
              Ogni progetto include design premium, funnel persuasivo e proof of value.
            </div>
            <button onClick={() => navigate("/demo")} className="landing-button-secondary self-start px-5 py-2.5 text-sm font-semibold sm:self-auto sm:px-6 sm:py-3">
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
      className="landing-surface group relative flex h-[72svh] w-[80vw] min-w-[290px] max-w-[360px] flex-col overflow-hidden rounded-[28px] p-4 sm:h-[74svh] sm:w-[58vw] sm:max-w-[420px] sm:rounded-[32px] sm:p-5 lg:h-[76svh] lg:w-[36vw] lg:max-w-[480px] lg:p-6"
      data-tone={project.tone}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3 px-1 sm:mb-4">
        <div className="min-w-0">
          <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-foreground/65 sm:text-[10px]">{project.sector}</div>
          <h3 className="mt-1 truncate font-heading text-[clamp(1.2rem,2.5vw,2rem)] font-extrabold leading-[1] tracking-[-0.04em] text-foreground">
            {project.brand}
          </h3>
        </div>
        <span className="landing-pill shrink-0 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.18em] sm:text-[9px]">case study</span>
      </div>

      {/* Mockup stage — full visible iPhone with floating chips */}
      <div
        className="relative mx-auto flex flex-1 w-full items-center justify-center overflow-hidden rounded-[22px] sm:rounded-[26px]"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 30%, hsl(var(--landing-accent, var(--primary)) / 0.22), transparent 70%), linear-gradient(160deg, hsl(228 22% 8% / 0.4), hsl(228 22% 5% / 0.7))`,
        }}
      >
        {/* Glow halo */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-90"
          style={{ background: "radial-gradient(circle, hsl(var(--landing-accent, var(--primary)) / 0.4), transparent 65%)" }}
        />

        {/* iPhone frame — entire device visible, centered */}
        <motion.div
          whileHover={{ scale: 1.04, y: -4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 my-3"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="relative aspect-[9/19.5] h-[42svh] rounded-[2rem] border border-border/70 bg-card/80 sm:h-[46svh] sm:rounded-[2.2rem] lg:h-[50svh] lg:rounded-[2.4rem]"
            style={{
              boxShadow:
                "0 40px 100px -28px hsl(var(--landing-accent, var(--primary)) / 0.55), 0 0 0 1px hsl(var(--foreground) / 0.06)",
            }}
          >
            {/* Notch */}
            <div className="absolute left-1/2 top-[1.5%] z-20 h-[2.2%] w-[28%] -translate-x-1/2 rounded-full bg-black" />
            {/* Screen */}
            <div className="absolute inset-[5px] overflow-hidden rounded-[1.7rem] bg-background sm:rounded-[1.9rem] lg:rounded-[2.1rem]">
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
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(150deg,hsl(0_0%_100%/0.16),transparent_30%,transparent_70%,hsl(0_0%_100%/0.06))] sm:rounded-[2.2rem] lg:rounded-[2.4rem]" />
          </div>

          {/* Floating result chip top-right */}
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.05, duration: 0.55 }}
            className="absolute -right-2 top-[14%] z-20 rounded-2xl border border-border/70 bg-card/85 px-3 py-2 backdrop-blur-xl sm:-right-4 sm:px-3.5 sm:py-2.5"
            style={{ boxShadow: "0 16px 40px -10px hsl(var(--landing-accent, var(--primary)) / 0.55)" }}
          >
            <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-foreground/65 sm:text-[9px]">Risultato</div>
            <div className="mt-0.5 font-heading text-base font-extrabold leading-none text-foreground sm:text-lg">{project.result}</div>
          </motion.div>

          {/* Floating tag chip bottom-left */}
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 + index * 0.05, duration: 0.55 }}
            className="absolute -left-2 bottom-[12%] z-20 rounded-2xl border border-border/70 bg-card/85 px-3 py-2 backdrop-blur-xl sm:-left-4 sm:px-3.5 sm:py-2.5"
            style={{ boxShadow: "0 16px 40px -10px hsl(var(--empire-violet) / 0.45)" }}
          >
            <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-foreground/65 sm:text-[9px]">Live</div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              <span className="text-[10px] font-semibold text-foreground sm:text-[11px]">{project.metric}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Reflection under phone */}
        <div className="pointer-events-none absolute bottom-2 left-1/2 h-[20px] w-[55%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,hsl(var(--landing-accent,var(--primary))/0.5),transparent_70%)] blur-2xl" />
      </div>

      {/* Footer CTA strip */}
      <div className="mt-3 flex items-center justify-between gap-3 px-1 sm:mt-4">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/65">Stack completo</div>
          <div className="mt-0.5 truncate text-[12px] text-foreground/85 sm:text-[13px]">Sito · Dashboard · Agenti AI · WhatsApp</div>
        </div>
        <span className="shrink-0 rounded-full border border-border/70 bg-background/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/85 backdrop-blur-md transition-colors group-hover:border-primary/60 group-hover:text-foreground">
          0{index + 1}
        </span>
      </div>
    </motion.article>
  );
}
