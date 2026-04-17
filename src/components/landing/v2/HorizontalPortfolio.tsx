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
  { brand: "Paperfish", sector: "Sushi omakase", img: `${S}/Paperfish%20Sushi/a-sakura-home.png`, tone: "violet", result: "Sold out", metric: "3 mesi in anticipo" },
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
      setMaxX(Math.max(track.scrollWidth - viewport + 32, 0));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const x = useTransform(smooth, [0, 1], [0, -maxX]);

  return (
    <section ref={ref} id="portfolio" className="relative" style={{ height: `${Math.max(PROJECTS.length * 95, 480)}vh` }}>
      <div className="sticky top-0 flex h-[100svh] overflow-hidden">
        <div className="absolute inset-0 landing-section-glow" data-tone="gold" />

        <div className="relative mx-auto flex w-full max-w-[1500px] flex-col justify-center px-4 py-20 sm:px-6 lg:px-10">
          <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]" data-tone="gold">
              <span className="landing-pill mb-5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.28em]">Portfolio live</span>
              <h2 className="max-w-[13ch] font-heading text-[clamp(2.1rem,5.6vw,4.8rem)] font-extrabold leading-[0.9] tracking-[-0.05em] text-foreground">
                Preview professionali che fanno percepire <span className="landing-heading-gradient">valore immediato.</span>
              </h2>
              <p className="mt-5 max-w-[620px] text-[clamp(0.98rem,1.6vw,1.08rem)] leading-[1.7] text-foreground/68">
                Lo scroll si ferma, il portfolio si apre in orizzontale e mostra casi reali per ogni verticale: design premium, struttura persuasiva, mockup credibili e risultati misurabili.
              </p>
            </div>

            <div className="hidden items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/46 lg:flex">
              <span>Sticky showcase</span>
              <div className="h-px w-12 bg-border/80" />
              <span>Scroll to explore</span>
            </div>
          </div>

          <motion.div ref={trackRef} style={{ x }} className="flex w-max items-stretch gap-5 pr-8 will-change-transform lg:gap-7 lg:pr-16">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.brand} project={project} />
            ))}
          </motion.div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm leading-[1.7] text-foreground/56">
              Ogni preview include brand positioning, gerarchia visiva, proof of value e casi d’uso ad alto tasso di conversione.
            </div>
            <button onClick={() => navigate("/demo")} className="landing-button-secondary self-start px-6 py-3 text-sm font-semibold sm:self-auto">
              Esplora tutti i progetti live
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: (typeof PROJECTS)[number] }) {
  return (
    <article
      className="landing-surface relative flex h-[72svh] w-[86vw] max-w-[430px] min-w-[320px] flex-col justify-between rounded-[34px] p-5 sm:h-[74svh] sm:w-[68vw] sm:max-w-[520px] lg:h-[76svh] lg:w-[42vw] lg:max-w-[640px] lg:p-7"
      data-tone={project.tone}
    >
      <div>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-foreground/48">{project.sector}</div>
            <h3 className="mt-2 font-heading text-[clamp(1.6rem,3vw,2.8rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-foreground">
              {project.brand}
            </h3>
          </div>
          <span className="landing-pill px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">case study</span>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-border/70 bg-background/50 p-2">
          <div className="absolute inset-x-0 top-0 h-14 bg-[linear-gradient(180deg,hsl(var(--foreground)/0.08),transparent)]" />
          <img src={project.img} alt={`Preview premium ${project.brand}`} loading="lazy" className="aspect-[4/5] w-full rounded-[22px] object-cover object-top" />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <p className="max-w-[28ch] text-[14px] leading-[1.7] text-foreground/64">
          Sito premium, funnel completo, dashboard operativa e automazioni AI integrate in una presentazione che comunica posizionamento alto fin dal primo secondo.
        </p>

        <div className="rounded-[24px] border border-border/80 bg-background/46 px-4 py-3 backdrop-blur-xl">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/48">Risultato</div>
          <div className="mt-1 flex items-end gap-2">
            <span className="font-heading text-3xl font-extrabold leading-none text-foreground">{project.result}</span>
            <span className="pb-1 text-[11px] uppercase tracking-[0.14em] text-foreground/50">{project.metric}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
