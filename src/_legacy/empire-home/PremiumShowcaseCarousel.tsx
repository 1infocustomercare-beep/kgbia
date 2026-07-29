import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

/**
 * PREMIUM SHOWCASE CAROUSEL
 * Ispirato motionsites.ai: scroll fluido, snap, transizioni eleganti.
 * Niente pin GSAP rigido → zero bug su mobile e zero scroll-lock.
 * Usa CSS scroll-snap nativo + GSAP solo per reveal e tilt parallax.
 */

type Slide = {
  id: keyof typeof DEMO_SLUGS;
  label: string;
  title: string;
  sub: string;
  accent: string;
  image: string;
};

const SOURCE: Array<Omit<Slide, "image">> = [
  { id: "food", label: "Food luxury", title: "Menu vivi & ordini smart", sub: "Cucina, sala, loyalty in un'unica app.", accent: "hsl(var(--gold))" },
  { id: "beauty", label: "Beauty & spa", title: "Booking che converte", sub: "Reminder, no-show killer, CRM premium.", accent: "hsl(var(--neon-magenta))" },
  { id: "ncc", label: "NCC & charter", title: "Flotta sotto controllo", sub: "Tratte, preventivi, pagamento in 1 tap.", accent: "hsl(var(--neon-cyan))" },
  { id: "fitness", label: "Fitness", title: "Coach & community", sub: "Classi, abbonamenti, sfide gamificate.", accent: "hsl(var(--accent))" },
  { id: "healthcare", label: "Medical", title: "Agenda viva 24/7", sub: "Anamnesi digitali e follow-up automatici.", accent: "hsl(var(--neon-emerald))" },
  { id: "hospitality", label: "Hospitality", title: "Concierge AI", sub: "Esperienze, upsell, recensioni curate.", accent: "hsl(var(--empire-violet-glow))" },
];

const SLIDES: Slide[] = SOURCE
  .map((s) => ({ ...s, image: SECTOR_MOCKUP_IMAGES[s.id]?.[0] ?? "" }))
  .filter((s) => Boolean(s.image));

export default function PremiumShowcaseCarousel() {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const current = useMemo(() => SLIDES[Math.min(active, SLIDES.length - 1)] ?? SLIDES[0], [active]);

  // Reveal + parallax tilt sui titoli (no pin)
  useEffect(() => {
    const el = root.current;
    if (!el || !SLIDES.length) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const cards = q("[data-pcard]") as HTMLElement[];
      const heading = q("[data-pheading] .word") as HTMLElement[];

      gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
      gsap.set(heading, { opacity: 1, y: 0 });

      if (reduceMotion) return;

      gsap.from(heading, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 80%" },
      });

      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 70,
          opacity: 0,
          scale: 0.94,
          duration: 0.85,
          ease: "expo.out",
          delay: i * 0.06,
          scrollTrigger: { trigger: el, start: "top 75%" },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  // Tracking slide attivo via IntersectionObserver
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    const cards = Array.from(sc.querySelectorAll<HTMLElement>("[data-pcard]"));
    if (!cards.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = cards.indexOf(visible.target as HTMLElement);
          if (idx >= 0) setActive(idx);
        }
      },
      { root: sc, threshold: [0.55, 0.75, 0.95] }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const scrollTo = (i: number) => {
    const sc = scroller.current;
    if (!sc) return;
    const card = sc.querySelectorAll<HTMLElement>("[data-pcard]")[i];
    if (!card) return;
    const left = card.offsetLeft - sc.offsetLeft - 16;
    sc.scrollTo({ left, behavior: "smooth" });
  };

  const prev = () => scrollTo(Math.max(0, active - 1));
  const next = () => scrollTo(Math.min(SLIDES.length - 1, active + 1));

  if (!SLIDES.length) return null;

  return (
    <section
      ref={root}
      id="showcase-carousel"
      className="relative overflow-hidden py-20"
    >
      {/* glow di sfondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 20% 30%, ${current.accent.replace("hsl(", "hsla(").replace(")", " / 0.18)")}, transparent 65%), radial-gradient(ellipse 60% 55% at 80% 70%, hsl(var(--primary) / 0.16), transparent 65%), linear-gradient(180deg, hsl(var(--background)), hsl(var(--deep-black)))`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[3px] text-foreground/75 backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              I nostri prodotti
            </div>
            <h2
              data-pheading
              className="font-heading font-black uppercase leading-[0.95] tracking-tight text-foreground"
              style={{
                fontSize: "clamp(2rem, 7vw, 4.4rem)",
                textShadow: "0 4px 30px hsl(0 0% 0% / 0.7)",
              }}
            >
              <span className="inline-block overflow-hidden align-bottom">
                <span className="word inline-block">Cosa</span>
              </span>{" "}
              <span className="inline-block overflow-hidden align-bottom">
                <span className="word inline-block">costruiamo</span>
              </span>{" "}
              <span className="inline-block overflow-hidden align-bottom">
                <span className="word inline-block bg-[linear-gradient(110deg,hsl(var(--gold)),hsl(var(--primary)),hsl(var(--accent)))] bg-clip-text text-transparent">
                  per te.
                </span>
              </span>
            </h2>
            <p className="mt-4 max-w-[600px] text-[14px] leading-[1.7] text-foreground/65 sm:text-[16px]">
              Sei soluzioni complete, una per ogni settore. Scorri il carosello per scoprire l'esperienza che il tuo cliente vivrà ogni giorno.
            </p>
          </div>

          {/* Nav desktop */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={prev}
              className="grid h-12 w-12 place-items-center rounded-full border border-foreground/15 bg-background/70 text-foreground backdrop-blur-md transition-colors hover:bg-foreground/10 disabled:opacity-40"
              disabled={active === 0}
              aria-label="Precedente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="grid h-12 w-12 place-items-center rounded-full border border-foreground/15 bg-background/70 text-foreground backdrop-blur-md transition-colors hover:bg-foreground/10 disabled:opacity-40"
              disabled={active === SLIDES.length - 1}
              aria-label="Successivo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scroller */}
        <div
          ref={scroller}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-6 sm:-mx-6 sm:gap-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollPaddingLeft: "1rem" }}
        >
          {SLIDES.map((slide, i) => (
            <article
              key={slide.id}
              data-pcard
              className="relative shrink-0 snap-start overflow-hidden rounded-[1.8rem] border border-foreground/10 bg-background/40 backdrop-blur-md transition-all duration-500"
              style={{
                width: "min(82vw, 360px)",
                aspectRatio: "9 / 14",
                boxShadow:
                  i === active
                    ? `0 36px 100px -28px ${slide.accent}, 0 0 0 1px ${slide.accent.replace("hsl(", "hsla(").replace(")", " / 0.35)")}`
                    : "0 22px 60px -32px hsl(0 0% 0% / 0.8)",
                transform: i === active ? "scale(1)" : "scale(0.96)",
                opacity: i === active ? 1 : 0.78,
              }}
            >
              {/* Mockup */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, hsl(0 0% 0% / 0) 35%, hsl(0 0% 0% / 0.55) 70%, hsl(0 0% 0% / 0.92) 100%)",
                  }}
                />
              </div>

              {/* Index */}
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[2px]"
                  style={{
                    background: `${slide.accent.replace("hsl(", "hsla(").replace(")", " / 0.18)")}`,
                    color: slide.accent,
                    border: `1px solid ${slide.accent.replace("hsl(", "hsla(").replace(")", " / 0.4)")}`,
                  }}
                >
                  {String(i + 1).padStart(2, "0")} · {slide.label}
                </span>
              </div>

              {/* Copy */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <h3 className="font-heading text-xl font-black uppercase leading-tight text-white sm:text-2xl">
                  {slide.title}
                </h3>
                <p className="mt-2 text-[12px] leading-snug text-white/75 sm:text-[13px]">
                  {slide.sub}
                </p>

                <button
                  type="button"
                  onClick={() => navigate(`/demo/${DEMO_SLUGS[slide.id]}`)}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2.5 text-[11px] font-bold uppercase tracking-[2px] text-primary-foreground transition-transform active:scale-95"
                  style={{
                    background: slide.accent,
                    boxShadow: `0 16px 40px -16px ${slide.accent}`,
                  }}
                >
                  Apri demo <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Dots progress */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Vai a ${s.label}`}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === active ? 28 : 8,
                background: i === active ? s.accent : "hsl(var(--foreground) / 0.25)",
                boxShadow: i === active ? `0 0 14px ${s.accent}` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
