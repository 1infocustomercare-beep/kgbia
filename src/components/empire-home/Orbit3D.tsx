import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { ArrowUpRight, Building2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

type ShowcaseSector = {
  id: keyof typeof DEMO_SLUGS;
  title: string;
  line: string;
  accent: string;
  images: string[];
};

const SECTORS: ShowcaseSector[] = [
  { id: "food", title: "Food luxury", line: "menu, ordini, loyalty", accent: "hsl(var(--gold))", images: SECTOR_MOCKUP_IMAGES.food?.slice(0, 4) ?? [] },
  { id: "beauty", title: "Beauty & spa", line: "booking, CRM, reminder", accent: "hsl(var(--neon-magenta))", images: SECTOR_MOCKUP_IMAGES.beauty?.slice(0, 4) ?? [] },
  { id: "ncc", title: "NCC & charter", line: "flotta, tratte, preventivi", accent: "hsl(var(--neon-cyan))", images: SECTOR_MOCKUP_IMAGES.ncc?.slice(0, 4) ?? [] },
  { id: "fitness", title: "Fitness", line: "coach, abbonamenti, classi", accent: "hsl(var(--accent))", images: SECTOR_MOCKUP_IMAGES.fitness?.slice(0, 4) ?? [] },
  { id: "healthcare", title: "Medical", line: "agenda, anamnesi, follow-up", accent: "hsl(var(--neon-emerald))", images: SECTOR_MOCKUP_IMAGES.healthcare?.slice(0, 4) ?? [] },
  { id: "hospitality", title: "Hospitality", line: "esperienze, upsell, concierge", accent: "hsl(var(--empire-violet-glow))", images: SECTOR_MOCKUP_IMAGES.hospitality?.slice(0, 4) ?? [] },
].filter((sector) => sector.images.length > 0);

export default function Orbit3D() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const current = useMemo(() => SECTORS[Math.min(active, SECTORS.length - 1)] ?? SECTORS[0], [active]);

  useEffect(() => {
    const el = root.current;
    const stageEl = stage.current;
    if (!el || !stageEl || !SECTORS.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 900px)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const frames = q("[data-sector-frame]") as HTMLElement[];
      const cards = q("[data-sector-card]") as HTMLElement[];
      const copy = q("[data-sector-copy]") as HTMLElement[];

      gsap.set([frames, cards, copy].flat(), { opacity: 1, clearProps: "filter" });
      gsap.set(frames, { y: 0, rotate: 0, rotateY: 0, scale: 1 });

      if (reduceMotion) return;

      gsap.from(q("[data-matrix-title] .word"), {
        y: 72,
        opacity: 0,
        duration: 0.95,
        stagger: 0.055,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 78%" },
      });

      if (!wide) {
        frames.forEach((frame, i) => {
          gsap.from(frame, {
            y: 58,
            opacity: 0,
            scale: 0.92,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: {
              trigger: frame,
              start: "top 88%",
              onEnter: () => setActive(Math.floor(i / 4)),
            },
          });
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.4}`,
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (st) => setActive(Math.min(SECTORS.length - 1, Math.round(st.progress * (SECTORS.length - 1)))),
        },
      });

      tl.to(stageEl, { xPercent: -68, ease: "none", duration: 1 }, 0)
        .to(frames, {
          y: (i) => [-38, 24, -18, 32][i % 4],
          rotate: (i) => [-2.5, 1.5, -1, 2][i % 4],
          scale: (i) => (i % 4 === 1 ? 1.06 : 0.98),
          ease: "none",
          stagger: 0.01,
          duration: 1,
        }, 0);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="portfolio" className="relative overflow-hidden py-24 sm:min-h-[100svh] sm:py-0">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 48% 58% at 18% 45%, hsl(var(--gold) / 0.14), transparent 68%), radial-gradient(ellipse 48% 58% at 82% 50%, hsl(var(--primary) / 0.16), transparent 68%), linear-gradient(180deg, hsl(var(--background)), hsl(var(--deep-black)))",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1380px] flex-col justify-center px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div data-sector-copy className="lg:sticky lg:top-28">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[3px] text-foreground/75 backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Portfolio scroll system
            </div>
            <h2 data-matrix-title className="font-heading font-black uppercase leading-[0.92] tracking-normal text-foreground" style={{ fontSize: "clamp(2.35rem, 7vw, 5.8rem)", textShadow: "0 4px 30px hsl(0 0% 0% / 0.68)" }}>
              <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block">Modelli</span></span>{" "}
              <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block">che</span></span>{" "}
              <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block bg-[linear-gradient(110deg,hsl(var(--gold)),hsl(var(--primary)),hsl(var(--accent)))] bg-clip-text text-transparent">arrivano.</span></span>
            </h2>
            <p className="mt-5 max-w-[560px] text-[14px] leading-[1.8] text-foreground/68 sm:text-[16px]">
              Prima vedi il concept, poi lo scroll porta in scena preview reali per settore: dritte, leggibili, grandi abbastanza da far percepire design e qualità.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-foreground/10 bg-background/70 p-5 shadow-[0_24px_70px_hsl(0_0%_0%_/_0.28)] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-foreground/10 bg-foreground/5">
                  <Building2 className="h-5 w-5" style={{ color: current.accent }} />
                </div>
                <div>
                  <div className="font-heading text-lg font-black uppercase text-foreground">{current.title}</div>
                  <div className="text-[11px] uppercase tracking-[2px] text-foreground/45">{current.line}</div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/demo/${DEMO_SLUGS[current.id]}`)}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[2px] text-primary-foreground"
                style={{ background: current.accent, boxShadow: `0 18px 50px -18px ${current.accent}` }}
              >
                Apri settore <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden lg:-mr-[40vw]">
            <div ref={stage} className="flex w-max gap-4 pr-8 will-change-transform sm:gap-6 lg:pr-[40vw]">
              {SECTORS.map((sector, sectorIndex) => (
                <article key={sector.id} data-sector-card className="w-[min(78vw,420px)] shrink-0 sm:w-[520px]">
                  <div className="mb-4 flex items-center justify-between px-1">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[3px]" style={{ color: sector.accent }}>{String(sectorIndex + 1).padStart(2, "0")}</div>
                      <h3 className="font-heading text-2xl font-black uppercase text-foreground sm:text-3xl">{sector.title}</h3>
                    </div>
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: sector.accent, boxShadow: `0 0 22px ${sector.accent}` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {sector.images.map((src, imageIndex) => (
                      <div
                        key={`${sector.id}-${src}`}
                        data-sector-frame
                        className="relative overflow-hidden rounded-[1.45rem] border-[7px] border-background bg-background shadow-2xl"
                        style={{
                          aspectRatio: "9 / 19.5",
                          boxShadow: imageIndex === 0 ? `0 32px 90px -28px ${sector.accent}` : "0 22px 60px -34px hsl(0 0% 0% / 0.9)",
                        }}
                      >
                        <img src={src} alt={`Preview ${sector.title} ${imageIndex + 1}`} className="h-full w-full object-cover" loading="lazy" draggable={false} />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-background/28" />
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
