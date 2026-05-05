import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RealisticIPhonePreview from "@/components/empire-home/RealisticIPhonePreview";

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

import { pickMockup } from "@/lib/mockup-rotation";

const CARDS: ReelCard[] = SECTOR_LIST.map((s) => {
  const list = SECTOR_MOCKUP_IMAGES[s.id] ?? [];
  // Slot "reel" garantisce immagini diverse da hero/showcase/case
  const img = pickMockup(s.id, "reel") ?? list[0] ?? "";
  return { ...s, image: img };
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
                  className="group relative flex shrink-0 snap-start flex-col items-center overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-background/85 px-5 pb-5 pt-6 text-left shadow-[0_18px_60px_-34px_hsl(0_0%_0%)] transition-all duration-500 active:scale-[0.98]"
                  style={{
                    width: "min(78vw, 300px)",
                    minHeight: "520px",
                    boxShadow: isActive
                      ? `0 30px 80px -24px ${card.accent}, 0 0 0 1px ${card.accent.replace("hsl(", "hsla(").replace(")", " / 0.35)")}`
                      : "0 18px 50px -28px hsl(0 0% 0% / 0.85)",
                    transform: isActive ? "scale(1)" : "scale(0.95)",
                    opacity: isActive ? 1 : 0.82,
                  }}
                  aria-label={`Apri demo ${card.label}`}
                >
                  {/* Badge top */}
                  <div className="absolute left-3 top-3 z-20">
                    <span
                      className="rounded-full px-2 py-1 text-[8px] font-bold uppercase tracking-[2px]"
                      style={{
                        background: `${card.accent.replace("hsl(", "hsla(").replace(")", " / 0.22)")}`,
                        color: card.accent,
                        border: `1px solid ${card.accent.replace("hsl(", "hsla(").replace(")", " / 0.45)")}`,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <RealisticIPhonePreview
                    src={card.image}
                    alt={card.label}
                    size="lg"
                    className="mt-2 transition-transform duration-700 group-hover:-translate-y-1"
                  />

                  {/* Copy separato: non copre mai il mockup */}
                  <div className="mt-5 w-full text-center">
                    <div
                      className="text-[9px] font-bold uppercase tracking-[2px]"
                      style={{ color: card.accent }}
                    >
                      {card.tag}
                    </div>
                    <h3 className="mt-1 font-heading text-base font-black uppercase leading-tight text-foreground sm:text-lg">
                      {card.label}
                    </h3>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[2px] text-foreground/80">
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
