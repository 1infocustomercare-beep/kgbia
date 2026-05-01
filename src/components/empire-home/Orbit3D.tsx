import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { ArrowUpRight, Building2, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

type ShowcaseSector = {
  id: keyof typeof DEMO_SLUGS;
  title: string;
  line: string;
  accent: string;
  images: string[];
};

const SECTOR_SOURCE: ShowcaseSector[] = [
  { id: "food", title: "Food luxury", line: "menu, ordini, loyalty", accent: "hsl(var(--gold))", images: SECTOR_MOCKUP_IMAGES.food?.slice(0, 3) ?? [] },
  { id: "beauty", title: "Beauty & spa", line: "booking, CRM, reminder", accent: "hsl(var(--neon-magenta))", images: SECTOR_MOCKUP_IMAGES.beauty?.slice(0, 3) ?? [] },
  { id: "ncc", title: "NCC & charter", line: "flotta, tratte, preventivi", accent: "hsl(var(--neon-cyan))", images: SECTOR_MOCKUP_IMAGES.ncc?.slice(0, 3) ?? [] },
  { id: "fitness", title: "Fitness", line: "coach, abbonamenti, classi", accent: "hsl(var(--accent))", images: SECTOR_MOCKUP_IMAGES.fitness?.slice(0, 3) ?? [] },
  { id: "healthcare", title: "Medical", line: "agenda, anamnesi, follow-up", accent: "hsl(var(--neon-emerald))", images: SECTOR_MOCKUP_IMAGES.healthcare?.slice(0, 3) ?? [] },
  { id: "hospitality", title: "Hospitality", line: "esperienze, upsell, concierge", accent: "hsl(var(--empire-violet-glow))", images: SECTOR_MOCKUP_IMAGES.hospitality?.slice(0, 3) ?? [] },
];

const SECTORS = SECTOR_SOURCE.filter((sector) => sector.images.length > 0);

type ZoomItem = { sector: ShowcaseSector; src: string; index: number } | null;

export default function Orbit3D() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<ZoomItem>(null);
  const navigate = useNavigate();

  const current = useMemo(
    () => SECTORS[Math.min(active, SECTORS.length - 1)] ?? SECTORS[0],
    [active]
  );

  useEffect(() => {
    const el = root.current;
    if (!el || !SECTORS.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const cards = q("[data-orbit-card]") as HTMLElement[];
      const titleWords = q("[data-matrix-title] .word") as HTMLElement[];

      // Sempre visibili come fallback
      gsap.set(cards, { opacity: 1, y: 0, rotateY: 0, scale: 1 });
      gsap.set(titleWords, { opacity: 1, y: 0 });

      if (reduceMotion) return;

      gsap.from(titleWords, {
        y: 60,
        opacity: 0,
        duration: 0.85,
        stagger: 0.05,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 82%" },
      });

      // Reveal a cascata + leggero tilt 3D
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          rotateY: i % 2 === 0 ? -22 : 22,
          scale: 0.9,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            onEnter: () => setActive(i),
          },
        });

        // Float continuo sottile
        gsap.to(card, {
          y: "+=10",
          duration: 3 + (i % 3) * 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.15,
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  // ESC chiude zoom
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoom]);

  return (
    <section
      ref={root}
      id="portfolio"
      className="relative overflow-hidden py-20"
      style={{ perspective: "1400px" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 20%, hsl(var(--gold) / 0.10), transparent 65%), radial-gradient(ellipse 60% 50% at 80% 80%, hsl(var(--primary) / 0.14), transparent 65%), linear-gradient(180deg, hsl(var(--background)), hsl(var(--deep-black)))",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[3px] text-foreground/75 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Portfolio Orbit 3D
          </div>
          <h2
            data-matrix-title
            className="mx-auto max-w-[880px] font-heading font-black uppercase leading-[0.95] tracking-tight text-foreground"
            style={{
              fontSize: "clamp(2rem, 8vw, 4.6rem)",
              textShadow: "0 4px 30px hsl(0 0% 0% / 0.7)",
            }}
          >
            <span className="inline-block overflow-hidden align-bottom">
              <span className="word inline-block">Sei</span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom">
              <span className="word inline-block">settori,</span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom">
              <span className="word inline-block bg-[linear-gradient(110deg,hsl(var(--gold)),hsl(var(--primary)),hsl(var(--accent)))] bg-clip-text text-transparent">
                un'orbita.
              </span>
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-[620px] text-[14px] leading-[1.7] text-foreground/70 sm:text-[16px]">
            Tap su una preview per zoomarla. Tutto reale, leggibile, pronto da mostrare al cliente.
          </p>
        </div>

        {/* Griglia Orbit 3D */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {SECTORS.map((sector, sectorIndex) => (
            <article
              key={sector.id}
              data-orbit-card
              className="group relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Header card */}
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="min-w-0">
                  <div
                    className="text-[9px] font-bold uppercase tracking-[3px]"
                    style={{ color: sector.accent }}
                  >
                    {String(sectorIndex + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-heading text-base font-black uppercase leading-tight text-foreground sm:text-xl">
                    {sector.title}
                  </h3>
                </div>
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: sector.accent, boxShadow: `0 0 18px ${sector.accent}` }}
                />
              </div>

              {/* Stack di 3 mockup orbitanti */}
              <button
                type="button"
                onClick={() => setZoom({ sector, src: sector.images[0], index: 0 })}
                className="relative block w-full overflow-hidden rounded-[1.4rem] border border-foreground/10 bg-background/40 p-3 backdrop-blur-md transition-all duration-300 hover:border-foreground/25 active:scale-[0.98]"
                style={{
                  aspectRatio: "3 / 4",
                  boxShadow: `0 24px 70px -28px ${sector.accent}`,
                }}
                aria-label={`Apri preview ${sector.title}`}
              >
                {sector.images.slice(0, 3).map((src, i) => {
                  const offsets = [
                    { x: "0%", y: "0%", r: 0, z: 30, scale: 1 },
                    { x: "16%", y: "8%", r: 6, z: 10, scale: 0.78 },
                    { x: "-14%", y: "10%", r: -7, z: 0, scale: 0.74 },
                  ][i];
                  return (
                    <div
                      key={src}
                      className="absolute inset-3 overflow-hidden rounded-[1.1rem] border-[5px] border-background bg-background shadow-2xl"
                      style={{
                        transform: `translate(${offsets.x}, ${offsets.y}) rotate(${offsets.r}deg) scale(${offsets.scale})`,
                        zIndex: offsets.z,
                        boxShadow:
                          i === 0
                            ? `0 22px 60px -22px ${sector.accent}`
                            : "0 14px 40px -22px hsl(0 0% 0% / 0.85)",
                      }}
                    >
                      <img
                        src={src}
                        alt={`${sector.title} preview ${i + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        draggable={false}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/5 via-transparent to-background/30" />
                    </div>
                  );
                })}

                {/* Badge tap-to-zoom */}
                <div
                  className="absolute bottom-3 left-3 right-3 z-40 flex items-center justify-between rounded-full border border-foreground/15 bg-background/85 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[2px] text-foreground/80 backdrop-blur-md"
                  style={{ pointerEvents: "none" }}
                >
                  <span>Tap per zoom</span>
                  <ArrowUpRight className="h-3 w-3" style={{ color: sector.accent }} />
                </div>
              </button>

              <p className="mt-3 px-1 text-[11px] leading-snug text-foreground/55 sm:text-[12px]">
                {sector.line}
              </p>
            </article>
          ))}
        </div>

        {/* CTA settore attivo */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate(`/demo/${DEMO_SLUGS[current.id]}`)}
            className="inline-flex min-h-12 items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[2px] text-primary-foreground transition-transform active:scale-95"
            style={{
              background: current.accent,
              boxShadow: `0 22px 60px -20px ${current.accent}`,
            }}
          >
            <Building2 className="h-4 w-4" />
            Apri demo {current.title}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lightbox tap-to-zoom */}
      {zoom && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/92 p-4 backdrop-blur-2xl animate-fade-in"
          onClick={() => setZoom(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setZoom(null)}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-foreground/20 bg-background/80 text-foreground backdrop-blur-md"
            aria-label="Chiudi"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative flex w-full max-w-[420px] flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div
                className="text-[10px] font-bold uppercase tracking-[3px]"
                style={{ color: zoom.sector.accent }}
              >
                {zoom.sector.title}
              </div>
              <div className="text-[11px] uppercase tracking-[2px] text-foreground/55">
                {zoom.sector.line}
              </div>
            </div>

            <div
              className="relative w-full overflow-hidden rounded-[1.8rem] border-[8px] border-background bg-background shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
              style={{
                aspectRatio: "9 / 19.5",
                boxShadow: `0 40px 120px -28px ${zoom.sector.accent}`,
              }}
            >
              <img
                src={zoom.src}
                alt={`${zoom.sector.title} zoom`}
                className="h-full w-full object-cover animate-scale-in"
                draggable={false}
              />
            </div>

            {/* Thumbnail switch */}
            <div className="flex gap-2">
              {zoom.sector.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setZoom({ sector: zoom.sector, src, index: i })}
                  className="h-14 w-10 overflow-hidden rounded-lg border-2 transition-all"
                  style={{
                    borderColor: i === zoom.index ? zoom.sector.accent : "hsl(var(--foreground) / 0.15)",
                  }}
                  aria-label={`Preview ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setZoom(null);
                navigate(`/demo/${DEMO_SLUGS[zoom.sector.id]}`);
              }}
              className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[2px] text-primary-foreground"
              style={{
                background: zoom.sector.accent,
                boxShadow: `0 18px 50px -18px ${zoom.sector.accent}`,
              }}
            >
              Apri demo live <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
