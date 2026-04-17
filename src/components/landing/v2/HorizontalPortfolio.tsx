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
    <section ref={ref} id="portfolio" className="relative" style={{ height: `${Math.max(PROJECTS.length * 70, 420)}vh` }}>
      <div className="sticky top-0 flex h-[100svh] overflow-hidden">
        <div className="absolute inset-0 landing-section-glow" data-tone="gold" />

        <div className="relative mx-auto flex w-full max-w-[1500px] flex-col justify-center px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-6 flex flex-col gap-4 sm:mb-8 lg:mb-10 lg:flex-row lg:items-end lg:justify-between"
          >
            <div className="max-w-[760px]" data-tone="gold">
              <span className="landing-pill mb-3 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.26em] sm:mb-4 sm:px-4 sm:py-2 sm:text-[10px]">Portfolio live</span>
              <h2 className="max-w-[15ch] font-heading text-[clamp(1.8rem,5.4vw,4.4rem)] font-extrabold leading-[0.9] tracking-[-0.05em] text-foreground">
                Preview reali che <span className="landing-heading-gradient">comunicano valore</span> in 3 secondi.
              </h2>
            </div>

            <div className="hidden items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-foreground/46 lg:flex">
              <span>Scroll orizzontale</span>
              <div className="h-px w-12 bg-border/80" />
            </div>
          </motion.div>

          <motion.div ref={trackRef} style={{ x }} className="flex w-max items-stretch gap-4 pr-6 will-change-transform sm:gap-5 lg:gap-6 lg:pr-12">
            {PROJECTS.map((project, idx) => (
              <ProjectCard key={project.brand} project={project} index={idx} />
            ))}
          </motion.div>

          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[12px] leading-[1.65] text-foreground/56 sm:text-[13px]">
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
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      className="landing-surface relative flex h-[68svh] w-[78vw] min-w-[280px] max-w-[400px] flex-col justify-between rounded-[28px] p-3 sm:h-[70svh] sm:w-[60vw] sm:max-w-[480px] sm:rounded-[32px] sm:p-4 lg:h-[72svh] lg:w-[40vw] lg:max-w-[600px] lg:p-6"
      data-tone={project.tone}
    >
      <div>
        <div className="mb-3 flex items-start justify-between gap-3 px-1 sm:mb-4">
          <div>
            <div className="text-[9px] uppercase tracking-[0.22em] text-foreground/50 sm:text-[10px]">{project.sector}</div>
            <h3 className="mt-1.5 font-heading text-[clamp(1.3rem,3vw,2.4rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground">
              {project.brand}
            </h3>
          </div>
          <span className="landing-pill px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.18em] sm:text-[9px]">case</span>
        </div>

        <div className="relative overflow-hidden rounded-[20px] border border-border/70 bg-background/50 sm:rounded-[24px]">
          <img src={project.img} alt={`Preview premium ${project.brand}`} loading="lazy" className="aspect-[3/4] w-full object-cover object-top" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_70%,hsl(var(--deep-black)/0.4))]" />
        </div>
      </div>

      <div className="mt-3 grid items-end gap-3 px-1 sm:mt-4 lg:grid-cols-[1fr_auto]">
        <p className="hidden max-w-[28ch] text-[12px] leading-[1.65] text-foreground/64 sm:block sm:text-[13px]">
          Design premium, funnel completo e dashboard operativa.
        </p>

        <div className="rounded-[18px] border border-border/80 bg-background/46 px-3 py-2 backdrop-blur-xl sm:rounded-[20px] sm:px-4 sm:py-3">
          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-foreground/48">Risultato</div>
          <div className="mt-0.5 flex items-end gap-1.5">
            <span className="font-heading text-xl font-extrabold leading-none text-foreground sm:text-2xl lg:text-3xl">{project.result}</span>
            <span className="pb-0.5 text-[10px] uppercase tracking-[0.14em] text-foreground/55">{project.metric}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
