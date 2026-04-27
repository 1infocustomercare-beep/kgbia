import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTOR_PORTFOLIO } from "@/data/sector-mockup-images";

gsap.registerPlugin(ScrollTrigger);

const COLORS = ["#22d3ee", "#4ade80", "#a78bfa", "#ec4899", "#fbbf24", "#38bdf8", "#fb7185", "#84cc16"];

function buildVault() {
  return SECTOR_PORTFOLIO.flatMap((sector, sectorIndex) =>
    sector.brands.flatMap((brand) =>
      brand.styles.map((style, styleIndex) => ({
        key: `${sector.sectorId}-${brand.name}-${style.name}`,
        sector: sector.sectorLabel,
        brand: brand.name,
        style: style.name,
        img: style.thumbnail,
        color: COLORS[(sectorIndex + styleIndex) % COLORS.length],
      }))
    )
  ).filter((item) => item.img?.startsWith("http"));
}

export default function MockupShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const vault = useMemo(() => buildVault(), []);
  const featured = useMemo(() => vault.filter((_, i) => [0, 7, 31, 41, 49, 55, 63, 72].includes(i)).slice(0, 8), [vault]);
  const catalog = useMemo(() => vault.slice(0, 40), [vault]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    const st = stage.current;
    if (!el || !st || !featured.length) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;

      gsap.from(q("[data-mks-title] .word"), {
        y: 82,
        opacity: 0,
        rotateX: -55,
        stagger: 0.055,
        duration: 0.95,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 76%" },
      });

      gsap.from(q("[data-catalog-card]"), {
        y: isMobile ? 44 : 90,
        opacity: 0,
        scale: 0.92,
        rotate: (i) => (i % 2 ? 2 : -2),
        duration: 0.8,
        stagger: 0.025,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-catalog-grid]", start: "top 82%" },
      });

      const cards = q("[data-featured-card]") as HTMLElement[];
      if (reduceMotion || isMobile) {
        gsap.from(cards, {
          y: 70,
          opacity: 0,
          scale: 0.88,
          rotate: (i) => [-5, 4, -3, 5][i % 4],
          stagger: 0.08,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: st, start: "top 78%" },
        });
        return;
      }

      cards.forEach((card, i) => {
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          x: (i - 2) * 140,
          y: i % 2 ? 60 : -36,
          rotateY: (i - 2) * -12,
          rotateZ: (i - 2) * 4,
          scale: i === 0 ? 0.98 : 0.78,
          opacity: i < 5 ? 1 : 0,
          zIndex: featured.length - i,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: st,
          start: "top top",
          end: () => `+=${window.innerHeight * 3.4}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (trigger) => setActive(Math.min(featured.length - 1, Math.floor(trigger.progress * featured.length))),
        },
      });

      cards.forEach((card, i) => {
        tl.to(card, {
          x: (i - 3) * 82,
          y: i % 2 ? -14 : 20,
          scale: i === 3 ? 1.06 : 0.88,
          rotateY: 0,
          rotateZ: (i - 3) * 2,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
        }, 0.05 * i)
          .to(card, {
            x: (i - 3) * 118,
            y: i % 2 ? 60 : -54,
            rotateY: (i - 3) * 13,
            rotateZ: (i - 3) * -3,
            scale: i === active ? 1.05 : 0.86,
            duration: 0.8,
            ease: "none",
          }, 0.9 + i * 0.08);
      });
    }, root);

    return () => ctx.revert();
  }, [active, featured.length]);

  return (
    <section ref={root} id="mockups" className="relative overflow-hidden py-20 sm:py-28" style={{ perspective: "1500px", background: "linear-gradient(180deg, transparent, rgba(8,19,39,0.72) 35%, rgba(19,8,31,0.62) 72%, transparent)" }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 75% 45% at 50% 22%, rgba(34,211,238,0.18), transparent 62%), radial-gradient(ellipse 55% 38% at 70% 70%, rgba(236,72,153,0.15), transparent 65%)" }} />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-5">
        <div className="mb-10 max-w-[880px]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[3px] text-white/78">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#4ade80", boxShadow: "0 0 12px #4ade80" }} />
            Mockup vault ufficiale · stili non duplicati
          </div>
          <h2 data-mks-title className="font-heading text-[clamp(2.25rem,6.5vw,5.8rem)] font-black uppercase leading-[0.9] text-white" style={{ textShadow: "0 18px 70px rgba(0,0,0,0.45)" }}>
            <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block">Non</span></span>{" "}
            <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block">template.</span></span>{" "}
            <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block" style={{ background: "linear-gradient(90deg, #22d3ee, #4ade80, #a78bfa)", WebkitBackgroundClip: "text", color: "transparent" }}>prove visive.</span></span>
          </h2>
          <p className="mt-5 max-w-[620px] text-sm leading-7 text-white/62 sm:text-base">
            Una parete di interfacce reali: ogni settore ha un linguaggio diverso, così il cliente vede subito il suo futuro prodotto.
          </p>
        </div>
      </div>

      <div ref={stage} className="relative mx-auto min-h-[720px] max-w-[1320px] px-4 sm:px-5 md:h-screen md:min-h-[760px]">
        <div className="absolute inset-x-4 top-4 z-[2] hidden justify-between md:flex">
          <div className="font-mono text-[10px] uppercase tracking-[3px] text-white/35">Scroll scrub · mockup wall</div>
          <div className="font-mono text-[10px] uppercase tracking-[3px] text-white/35">{String(active + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}</div>
        </div>

        <div className="relative grid min-h-[640px] grid-cols-2 gap-4 md:absolute md:inset-0 md:block">
          {featured.map((item, i) => (
            <article key={item.key} data-featured-card className="relative md:absolute md:left-1/2 md:top-1/2" style={{ transformStyle: "preserve-3d" }}>
              <div className="mx-auto w-full max-w-[190px] rounded-[30px] border-[8px] border-black bg-black shadow-2xl sm:max-w-[230px]" style={{ aspectRatio: "9 / 19", boxShadow: `0 42px 110px -34px ${item.color}aa, 0 0 0 1px rgba(255,255,255,0.12)` }}>
                <div className="relative h-full overflow-hidden rounded-[22px] bg-black">
                  <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />
                  <img src={item.img} alt={`${item.brand} ${item.style}`} className="h-full w-full object-cover" loading={i < 3 ? "eager" : "lazy"} draggable={false} />
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center md:bg-black/50">
                <div className="text-[10px] font-bold uppercase tracking-[2px]" style={{ color: item.color }}>{item.sector}</div>
                <div className="mt-1 text-xs font-semibold text-white">{item.brand}</div>
                <div className="text-[10px] text-white/45">{item.style}</div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-[1320px] px-4 sm:px-5 md:mt-20">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[3px] text-white/40">Catalogo intero · anteprima stili</div>
            <h3 className="mt-2 font-heading text-3xl font-black uppercase text-white sm:text-5xl">40 schermate diverse.</h3>
          </div>
          <div className="text-sm text-white/50">Nessun testo sopra i mockup: preview pulita, leggibile, vendibile.</div>
        </div>

        <div data-catalog-grid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8">
          {catalog.map((item, i) => (
            <article key={item.key} data-catalog-card className="group rounded-2xl border border-white/10 bg-white/[0.035] p-2 transition-transform duration-300 hover:-translate-y-1">
              <div className="overflow-hidden rounded-xl bg-black" style={{ aspectRatio: "9 / 16" }}>
                <img src={item.img} alt={`${item.brand} ${item.style}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" draggable={false} />
              </div>
              <div className="px-1 py-2">
                <div className="truncate text-[10px] font-bold uppercase tracking-[1.6px]" style={{ color: item.color }}>{item.brand}</div>
                <div className="truncate text-[10px] text-white/50">{item.style}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
