import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

/**
 * InteractiveSectorReel
 * Carosello scroll interattivo con mockup di vari settori.
 * - Mobile/tablet: scroll orizzontale nativo con snap, tilt CSS, drag fluido.
 * - Desktop ≥1024px: scroll verticale → traduzione orizzontale via GSAP scrub
 *   limitata a ~85vh di altezza, così NON occupa tutta la homepage.
 * - Card 3D con parallax sull'immagine al passaggio in viewport.
 */

type Sector = {
  id: keyof typeof DEMO_SLUGS;
  label: string;
  tag: string;
  accent: string;
};

const SECTOR_LIST: Sector[] = [
  { id: "food", label: "Food luxury", tag: "Menu vivi", accent: "hsl(42 94% 62%)" },
  { id: "beauty", label: "Beauty & spa", tag: "Booking smart", accent: "hsl(325 85% 58%)" },
  { id: "ncc", label: "NCC charter", tag: "Flotta premium", accent: "hsl(195 100% 55%)" },
  { id: "fitness", label: "Fitness", tag: "Coach AI", accent: "hsl(160 70% 55%)" },
  { id: "healthcare", label: "Medical", tag: "Agenda 24/7", accent: "hsl(180 70% 55%)" },
  { id: "hospitality", label: "Hospitality", tag: "Concierge", accent: "hsl(265 80% 65%)" },
  { id: "beach", label: "Beach club", tag: "Lettini live", accent: "hsl(35 100% 60%)" },
  { id: "veterinary", label: "Veterinaria", tag: "Cartelle pet", accent: "hsl(140 60% 55%)" },
  { id: "retail", label: "Retail", tag: "Vetrine smart", accent: "hsl(220 80% 65%)" },
  { id: "construction", label: "Edilizia", tag: "Cantieri live", accent: "hsl(28 80% 55%)" },
  { id: "events", label: "Eventi", tag: "Inviti AI", accent: "hsl(295 75% 60%)" },
  { id: "tattoo", label: "Tattoo", tag: "Portfolio", accent: "hsl(0 75% 55%)" },
];

type ReelCard = Sector & { image: string };

// Indice per settore: prendiamo varianti diverse da hero/showcase per massima varietà visiva
const SECTOR_IMG_IDX: Partial<Record<keyof typeof DEMO_SLUGS, number>> = {
  food: 6, beauty: 2, ncc: 4, fitness: 4, healthcare: 2,
  hospitality: 3, beach: 1, veterinary: 4, retail: 2,
  construction: 0, events: 0, tattoo: 0,
};

const CARDS: ReelCard[] = SECTOR_LIST.map((s) => {
  const list = SECTOR_MOCKUP_IMAGES[s.id] ?? [];
  const idx = SECTOR_IMG_IDX[s.id] ?? 0;
  return { ...s, image: list[idx] ?? list[0] ?? "" };
}).filter((c) => Boolean(c.image));

export default function InteractiveSectorReel() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const current = useMemo(
    () => CARDS[Math.min(active, CARDS.length - 1)] ?? CARDS[0],
    [active]
  );

  useEffect(() => {
    const el = root.current;
    const st = stage.current;
    const tr = track.current;
    if (!el || !st || !tr || !CARDS.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const cards = q("[data-reel-card]") as HTMLElement[];

      gsap.set(cards, { opacity: 1, y: 0, rotateY: 0, scale: 1 });

      if (reduceMotion) return;

      // Reveal iniziale headline
      gsap.from(q("[data-reel-title] .word"), {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 82%" },
      });

      if (!isDesktop) {
        // Mobile/tablet: solo reveal stagger, scroll orizzontale gestito dal CSS snap
        cards.forEach((c, i) => {
          gsap.from(c, {
            y: 50,
            opacity: 0,
            scale: 0.94,
            duration: 0.7,
            ease: "expo.out",
            delay: i * 0.05,
            scrollTrigger: { trigger: el, start: "top 80%" },
          });
        });
        return;
      }

      // Desktop: scroll verticale → traduzione orizzontale, pin limitato all'altezza dello stage
      const getDistance = () => Math.max(1, tr.scrollWidth - st.clientWidth + 48);

      gsap.to(tr, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: st,
          start: "top top+=80",
          end: () => `+=${getDistance()}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (CARDS.length - 1));
            setActive(idx);
          },
        },
      });

      // Tilt 3D parallax sulle card
      gsap.to(cards, {
        rotateY: (i) => (i % 2 === 0 ? -6 : 6),
        ease: "none",
        scrollTrigger: {
          trigger: st,
          start: "top top+=80",
          end: () => `+=${getDistance()}`,
          scrub: 1,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  if (!CARDS.length) return null;

  return (
    <section
      ref={root}
      id="sector-reel"
      className="relative overflow-hidden py-16 sm:py-20"
    >
      {/* Glow di sfondo dinamico */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse 55% 50% at 30% 30%, ${current.accent.replace("hsl(", "hsla(").replace(")", " / 0.16)")}, transparent 65%), radial-gradient(ellipse 55% 50% at 70% 70%, hsl(var(--primary) / 0.14), transparent 65%), linear-gradient(180deg, hsl(var(--background)), hsl(var(--deep-black)))`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[3px] text-foreground/75 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Settori che serviamo
          </div>
          <h2
            data-reel-title
            className="font-heading font-black uppercase leading-[0.95] tracking-tight text-foreground"
            style={{
              fontSize: "clamp(1.9rem, 6vw, 4rem)",
              textShadow: "0 4px 30px hsl(0 0% 0% / 0.7)",
            }}
          >
            <span className="inline-block overflow-hidden align-bottom">
              <span className="word inline-block">Specialisti</span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom">
              <span className="word inline-block">in 12+</span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom">
              <span className="word inline-block bg-[linear-gradient(110deg,hsl(var(--gold)),hsl(var(--primary)),hsl(var(--accent)))] bg-clip-text text-transparent">
                mercati verticali.
              </span>
            </span>
          </h2>
          <p className="mt-3 max-w-[640px] text-[13px] leading-[1.7] text-foreground/65 sm:text-[15px]">
            Non siamo generalisti: per ogni settore abbiamo template, integrazioni e agenti AI già pronti. Scorri per trovare il tuo e provare la demo dal vivo.
          </p>
        </div>

        {/* Stage carosello */}
        <div
          ref={stage}
          className="relative"
          style={{ minHeight: "min(75vh, 620px)", perspective: "1500px" }}
        >
          <div
            ref={track}
            className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-6 sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              transformStyle: "preserve-3d",
              scrollPaddingLeft: "1rem",
            }}
          >
            {CARDS.map((card, i) => {
              const isActive = i === active;
              return (
                <button
                  key={card.id}
                  type="button"
                  data-reel-card
                  onClick={() => navigate(`/demo/${DEMO_SLUGS[card.id]}`)}
                  className="group relative shrink-0 snap-start overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-background/40 text-left backdrop-blur-md transition-all duration-500 active:scale-[0.98]"
                  style={{
                    width: "min(72vw, 280px)",
                    aspectRatio: "9 / 16",
                    boxShadow: isActive
                      ? `0 30px 80px -24px ${card.accent}, 0 0 0 1px ${card.accent.replace("hsl(", "hsla(").replace(")", " / 0.35)")}`
                      : "0 18px 50px -28px hsl(0 0% 0% / 0.85)",
                    transform: isActive ? "scale(1)" : "scale(0.95)",
                    opacity: isActive ? 1 : 0.82,
                  }}
                  aria-label={`Apri demo ${card.label}`}
                >
                  {/* Mockup */}
                  <div className="absolute inset-0">
                    <img
                      src={card.image}
                      alt={card.label}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      draggable={false}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, hsl(0 0% 0% / 0) 30%, hsl(0 0% 0% / 0.55) 75%, hsl(0 0% 0% / 0.95) 100%)",
                      }}
                    />
                  </div>

                  {/* Badge top */}
                  <div className="absolute left-3 top-3">
                    <span
                      className="rounded-full px-2 py-1 text-[8px] font-bold uppercase tracking-[2px] backdrop-blur-md"
                      style={{
                        background: `${card.accent.replace("hsl(", "hsla(").replace(")", " / 0.22)")}`,
                        color: card.accent,
                        border: `1px solid ${card.accent.replace("hsl(", "hsla(").replace(")", " / 0.45)")}`,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Copy */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div
                      className="text-[9px] font-bold uppercase tracking-[2px]"
                      style={{ color: card.accent }}
                    >
                      {card.tag}
                    </div>
                    <h3 className="mt-1 font-heading text-base font-black uppercase leading-tight text-white sm:text-lg">
                      {card.label}
                    </h3>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[2px] text-white/85">
                      Apri demo
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {CARDS.map((c, i) => (
            <span
              key={c.id}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === active ? 24 : 6,
                background: i === active ? c.accent : "hsl(var(--foreground) / 0.22)",
                boxShadow: i === active ? `0 0 12px ${c.accent}` : "none",
              }}
            />
          ))}
        </div>

        {/* Hint */}
        <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[3px] text-foreground/45 lg:hidden">
          ← Scorri per esplorare →
        </p>
        <p className="mt-4 hidden text-center text-[10px] font-semibold uppercase tracking-[3px] text-foreground/45 lg:block">
          ↓ Scrolla per scorrere il reel
        </p>
      </div>
    </section>
  );
}
