import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEmpireScrollDirector } from "../ScrollDirector";
import PrestigePhone from "./PrestigePhone";
import PrestigeHeroImmersive from "./PrestigeHeroImmersive";
import { useT, PrestigeLangToggle } from "./PrestigeLang";
import { SECTOR_MOCKUPS } from "@/data/sector-mockups";

// Hero auto-carousel — selezione curata a mano dei mockup studio migliori
// (dark luxury + editoriali) in ordine cinematografico, così la hero non mostra
// più il primo mockup disponibile per settore ma solo i flagship approvati.
const HERO_PICKS = [
  "ncc-aurora-drive",
  "food-onyx-brace",
  "hosp-palazzo-novecento",
  "beauty-serena-spa",
  "health-aurora",
  "fit-iron-box",
  "food-ryo-sushi",
];

const HERO_SCREENS = (() => {
  const flat = SECTOR_MOCKUPS.flatMap((g) => g.variants.map((v) => ({ g, v })));
  const picks: { label: string; brand: string; image: string }[] = [];
  for (const id of HERO_PICKS) {
    const hit = flat.find(({ v }) => v.id === id);
    const img = hit?.v.screens?.[0]?.image ?? hit?.v.screen;
    if (hit && img) picks.push({ label: hit.g.label, brand: hit.v.brand, image: img });
  }
  if (picks.length) return picks;
  const fb = flat[0];
  return [{ label: fb?.g.label ?? "Empire", brand: fb?.v.brand ?? "Empire", image: fb?.v.screen ?? "" }];
})();
const HERO_LABELS = HERO_SCREENS.map((s) => `${s.label} · ${s.brand}`);
const ROTATE_MS = 3200;

/**
 * PrestigeHero — hero cinematografico mobile-first.
 * Effetti interattivi:
 *  - parallasse su fasci di luce oro guidata da --empire-progress
 *  - stack di 3 iPhone in prospettiva 3D con crossfade continuo
 *  - inclinazione dei telefoni dal movimento del puntatore
 *  - reveal a scaglioni del testo appena la sezione entra in viewport
 *  - counter di supporto (proof) appena sotto la CTA
 *  - collasso in mobile: telefono più piccolo, testo centrato, niente overflow
 */
export default function PrestigeHero() {
  const t = useT();
  const navigate = useNavigate();
  const { ref, progress } = useEmpireScrollDirector<HTMLDivElement>("prestige-hero", { steps: 4 });
  const [active, setActive] = useState(0);
  const [labelIdx, setLabelIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [phoneW, setPhoneW] = useState(260);
  const [isMobile, setIsMobile] = useState(false);

  // Cinematic scroll senza pin: la hero accompagna l'uscita ma non trattiene
  // il documento, evitando vuoti, sovrapposizioni e contenuti tagliati.
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.92, 1], [1, 1, 0.92]);
  const heroBorderRadius = useTransform(scrollYProgress, [0, 1], ["0px", "24px"]);
  // Camera dolly cinematografica: il blocco contenuti si inclina in 3D e
  // "sprofonda" mentre la hero esce, sincronizzato col warp tunnel dietro.
  const heroRotateX = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const heroLift = useTransform(scrollYProgress, [0, 1], [0, -70]);


  // Responsive phone width + breakpoint
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);
      // Tablet (768–1023) usa un telefono più contenuto: la colonna è a piena
      // larghezza e un phone da 262px rendeva la tile sproporzionata.
      setPhoneW(mobile ? Math.min(210, w * 0.56) : w < 1024 ? 224 : 262);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Staggered reveal on mount
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 80);
    return () => window.clearTimeout(id);
  }, []);

  // Auto-rotate phones
  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % HERO_SCREENS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  // L'etichetta segue il telefono con il ritardo del crossfade (evita che
  // testo e mockup mostrino settori diversi a metà transizione).
  useEffect(() => {
    const id = window.setTimeout(() => setLabelIdx(active), 380);
    return () => window.clearTimeout(id);
  }, [active]);

  // Pointer tilt for the stack (desktop only)
  useEffect(() => {
    const el = stageRef.current;
    if (!el || isMobile) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width - 0.5;
      const my = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--mx", mx.toFixed(3));
      el.style.setProperty("--my", my.toFixed(3));
    };
    const onLeave = () => {
      el.style.setProperty("--mx", "0");
      el.style.setProperty("--my", "0");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [isMobile]);

  return (
    <div ref={scrollContainerRef} className="relative isolate z-0">
    <motion.section
      ref={ref}
      data-section="prestige-hero"
      className={`prestige-section prestige-dark prestige-hero-root flex min-h-[100svh] items-center overflow-hidden ${mounted ? "is-mounted" : ""}`}
      style={{
        scale: heroScale,
        opacity: heroOpacity,
        borderRadius: heroBorderRadius,
        transformOrigin: "center top",
        paddingTop: "clamp(112px, 14svh, 156px)",
        paddingBottom: "clamp(56px, 8svh, 96px)",
        willChange: "transform, opacity",
      }}
    >

      {/* BACKDROP HERO — pulito: un solo gradiente piatto, nessun glow/blend
          (rimosso il mix FUI + warp tunnel + beam oro che su mobile sbiancava
          la sezione e pesava sul rendering). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--pr-bg)) 0%, hsl(var(--pr-bg)) 55%, hsl(var(--pr-surface)) 100%)",
        }}
      />


      {/* Lang toggle: vive solo nella navbar (evita doppione sovrapposto in desktop) */}
      <div className="prestige-hero-lang-floating absolute right-3 top-[76px] z-20 scale-90 origin-top-right lg:hidden">
        <PrestigeLangToggle />
      </div>

      <motion.div
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-4 gap-y-10 px-4 sm:px-6 lg:gap-x-8 lg:gap-y-6 lg:px-10"
        style={{
          perspective: 1400,
          transformStyle: "preserve-3d",
          rotateX: heroRotateX,
          y: heroLift,
          willChange: "transform",
        }}
      >
        {/* ── LEFT — Editorial copy ── */}
        <div className="prestige-bento col-span-12 lg:col-span-7 min-w-0 relative text-center lg:text-left p-6 sm:p-9 lg:p-12">
          {/* Eyebrow */}
          <div
            className="prestige-hero-stagger prestige-hero-stagger--1 inline-flex items-center gap-3 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] sm:text-[11px]"
            style={{ color: "hsl(var(--pr-gold-light))", borderColor: "hsl(var(--pr-gold) / 0.4)", background: "hsl(var(--pr-emerald-mid) / 0.4)" }}
          >
            <Sparkles size={12} />
            <span>{t({ it: "Empire · Agency AI per la tua azienda", en: "Empire · AI Agency for your business" })}</span>
          </div>

          {/* Monumental headline */}
          <h1
            className="prestige-display prestige-hero-headline mt-6"
            style={{ fontSize: "clamp(2.2rem, 6.3vw, 5.35rem)" }}
          >
            <span className="prestige-hero-stagger prestige-hero-stagger--2 block">
              {t({ it: "Trasformiamo la tua azienda", en: "We turn your business" })}
            </span>
            <span
              className="prestige-hero-stagger prestige-hero-stagger--3 block prestige-italic mt-2"
              style={{ fontSize: "clamp(1.4rem, 4.6vw, 3.6rem)" }}
            >
              {t({ it: "in un impero digitale che lavora 24/7.", en: "into a digital empire that works 24/7." })}
            </span>
          </h1>

          {/* Subcopy */}
          <p
            className="prestige-hero-stagger prestige-hero-stagger--4 mt-6 max-w-2xl text-base leading-relaxed sm:text-lg mx-auto lg:mx-0"
            style={{ color: "hsl(var(--pr-muted-on-dark))", fontFamily: "'Manrope', sans-serif", fontWeight: 400 }}
          >
            {t({
              it: "Siti, web app, gestionali e agenti AI su misura per ",
              en: "Websites, web apps, backoffice and AI agents tailored to ",
            })}
            <strong className="font-semibold" style={{ color: "hsl(var(--pr-text-on-dark))" }}>
              {t({ it: "ristoranti, idraulici, hotel, spa, immobiliari e altri 20+ settori", en: "restaurants, plumbers, hotels, spas, real-estate and 20+ industries" })}
            </strong>
            {t({ it: ". Il tuo sistema lavora, vende e risponde al posto tuo.", en: ". Your system works, sells and replies for you." })}
          </p>

          {/* CTAs */}
          <div className="prestige-hero-stagger prestige-hero-stagger--5 mt-7 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3">
            <button
              className="prestige-cta justify-center w-full sm:w-auto"
              onClick={() => navigate("/onboarding")}
              aria-label={t({ it: "Inizia ora", en: "Start now" })}
            >
              <span>{t({ it: "Inizia ora", en: "Start now" })}</span> <ArrowRight size={16} className="shrink-0" />
            </button>
            <button
              className="prestige-cta-ghost justify-center w-full sm:w-auto"
              onClick={() => document.getElementById("lead")?.scrollIntoView({ behavior: "smooth" })}
              aria-label={t({ it: "Parla con un consulente", en: "Talk to a consultant" })}
            >
              <Play size={14} className="shrink-0" /> <span>{t({ it: "Parla con un consulente", en: "Talk to a consultant" })}</span>
            </button>
          </div>

          {/* Trust strip */}
          <div className="prestige-hero-stagger prestige-hero-stagger--6 mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.18em] sm:gap-x-6 sm:text-[11px] sm:tracking-[0.22em]"
               style={{ color: "hsl(var(--pr-muted-on-dark))", fontWeight: 600 }}>
            <span>{t({ it: "Setup in 7 giorni", en: "7-day setup" })}</span>
            <span aria-hidden="true">·</span>
            <span>{t({ it: "IA multilingua 24/7", en: "Multilingual AI 24/7" })}</span>
            <span aria-hidden="true">·</span>
            <span>{t({ it: "90 giorni senza impegno", en: "90 days no commitment" })}</span>
          </div>
        </div>

        {/* ── RIGHT — Phone cinematic stage ── */}
        <div className="prestige-bento prestige-hero-stagger prestige-hero-stagger--stage col-span-12 lg:col-span-5 relative flex flex-col items-center justify-center lg:items-center overflow-hidden lg:overflow-visible p-6 sm:p-8">
          {/* Wrapper dedicato al float idle: il figlio conserva il transform di
              parallasse, così animazione e scroll non si sovrascrivono. */}
          <div className="prestige-hero-float mx-auto">
          <div
            ref={stageRef}
            className="prestige-hero-phone-stage relative will-change-transform mx-auto"
            style={{
              perspective: "1600px",
              width: phoneW + 60,
              aspectRatio: "9 / 19.5",
              transform: `translate3d(0, calc(var(--empire-progress, 0) * -30px), 0)`,
            }}
          >


            {/* Floor reflection */}
            <div
              aria-hidden
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                bottom: -32,
                width: "82%",
                height: 60,
                background: "radial-gradient(ellipse at center, hsl(var(--pr-gold) / 0.35), transparent 70%)",
                filter: "blur(14px)",
              }}
            />

            {HERO_SCREENS.map((screen, i) => {
              const isActive = i === active;
              const dist = i - active;
              const modDist = ((dist % HERO_SCREENS.length) + HERO_SCREENS.length) % HERO_SCREENS.length;
              const isRight = modDist === 1;
              const isLeft = modDist === HERO_SCREENS.length - 1;
              // Solo attivo + 2 vicini restano visibili: gli altri escono di scena,
              // così i telefoni non si accavallano più sopra quello in primo piano.
              const side = isMobile ? 26 : 30;
              const stackTransform = isActive
                ? `translate3d(0, 0, 0) rotateY(calc(var(--mx, 0) * 12deg)) rotateX(calc(var(--my, 0) * -8deg)) scale(1)`
                : isRight
                  ? `translate3d(${side}%, 7%, -260px) rotateY(-20deg) scale(.82)`
                  : isLeft
                    ? `translate3d(-${side}%, 7%, -260px) rotateY(20deg) scale(.82)`
                    : `translate3d(0, 12%, -420px) scale(.7)`;

              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActive(i)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActive(i);
                    }
                  }}
                  aria-label={`Mostra mockup ${i + 1}: ${HERO_LABELS[i]}`}
                  className="absolute inset-0 flex items-center justify-center transition-all duration-[700ms] ease-[cubic-bezier(.22,1,.36,1)] focus:outline-none"
                  style={{
                    opacity: isActive ? 1 : isRight || isLeft ? 0.3 : 0,
                    transform: stackTransform,
                    transformStyle: "preserve-3d",
                    pointerEvents: isActive || isRight || isLeft ? "auto" : "none",
                    zIndex: isActive ? 3 : isRight || isLeft ? 2 : 1,
                    filter: isActive ? "none" : "blur(4px) saturate(.7) brightness(.65)",
                  }}
                >

                  <PrestigePhone
                    src={screen.image}
                    alt={`Mockup ${HERO_LABELS[i]}`}
                    width={phoneW}
                    loading="eager"
                  />

                </div>
              );
            })}
          </div>
          </div>



          {/* Etichetta mockup attivo + dot indicators.
              L'etichetta cambia in ritardo rispetto allo scatto di stato così
              non descrive mai il telefono sbagliato durante il crossfade. */}
          <div
            className="mt-6 min-h-[1.2em] text-center text-[10px] font-semibold uppercase tracking-[0.26em]"
            style={{ color: "hsl(var(--pr-gold-light))" }}
            aria-live="polite"
          >
            <span key={labelIdx} className="prestige-hero-label inline-block">
              {HERO_LABELS[labelIdx]}
            </span>
          </div>
          <div className="mt-3 flex justify-center gap-2" role="tablist" aria-label="Cambia mockup">
            {HERO_SCREENS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                role="tab"
                aria-selected={i === active}
                aria-label={`Mockup ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === active ? 28 : 8,
                  background: i === active ? "hsl(var(--pr-gold))" : "hsl(var(--pr-gold) / 0.28)",
                  boxShadow: i === active ? "0 0 12px hsl(var(--pr-gold) / 0.55)" : "none",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div
        aria-hidden
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.32em]"
        style={{ color: "hsl(var(--pr-muted-on-dark))", opacity: Math.max(0, 1 - progress * 4) }}
      >
        <span>Scroll</span>
        <span className="prestige-hero-scroll-line" />
      </div>

      <style>{`
        /* ── Staggered reveal on mount ─────────────────────────────── */
        /* Solo transform+opacity (compositing GPU): nessun layout/paint
           per frame, quindi il costo su mobile resta prossimo a zero.
           Il blur d'ingresso è desktop-only e one-shot. */
        .prestige-hero-stagger {
          opacity: 0;
          transform: translate3d(0, 26px, 0) scale(.985);
          transition:
            opacity .95s cubic-bezier(.16,1,.3,1),
            transform 1.05s cubic-bezier(.16,1,.3,1),
            filter .95s cubic-bezier(.16,1,.3,1);
          will-change: transform, opacity;
        }
        @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
          .prestige-hero-stagger { filter: blur(10px); }
          .prestige-hero-root.is-mounted .prestige-hero-stagger { filter: blur(0); }
        }
        .prestige-hero-root.is-mounted .prestige-hero-stagger {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }
        /* Libera la GPU al termine del reveal */
        .prestige-hero-root.is-mounted .prestige-hero-stagger { will-change: auto; }

        .prestige-hero-root.is-mounted .prestige-hero-stagger--1 { transition-delay: 60ms; }
        .prestige-hero-root.is-mounted .prestige-hero-stagger--2 { transition-delay: 180ms; }
        .prestige-hero-root.is-mounted .prestige-hero-stagger--3 { transition-delay: 320ms; }
        .prestige-hero-root.is-mounted .prestige-hero-stagger--4 { transition-delay: 480ms; }
        .prestige-hero-root.is-mounted .prestige-hero-stagger--5 { transition-delay: 620ms; }
        .prestige-hero-root.is-mounted .prestige-hero-stagger--6 { transition-delay: 760ms; }
        .prestige-hero-root.is-mounted .prestige-hero-stagger--stage { transition-delay: 260ms; }

        /* ── Etichetta mockup: fade-in sincronizzato col crossfade ──── */
        .prestige-hero-label { animation: prestige-hero-label-in 420ms ease-out both; }
        @keyframes prestige-hero-label-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Float idle dello stage telefoni (solo desktop/tablet) ──── */
        .prestige-hero-float { transform: translateZ(0); }
        @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
          .prestige-hero-float {
            animation: prestige-hero-float 7.5s cubic-bezier(.45,0,.55,1) infinite;
            will-change: transform;
          }
        }
        @keyframes prestige-hero-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -12px, 0); }
        }

        /* ── Shimmer del titolo in oro/violetto ────────────────────── */
        @media (prefers-reduced-motion: no-preference) {
          .prestige-hero-root.is-mounted .prestige-hero-headline .prestige-italic {
            background-image: linear-gradient(
              100deg,
              hsl(var(--pr-gold-light)) 0%,
              hsl(var(--pr-gold)) 34%,
              hsl(0 0% 100% / 0.92) 50%,
              hsl(var(--pr-gold)) 66%,
              hsl(var(--pr-gold-light)) 100%
            );
            background-size: 260% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: prestige-hero-shimmer 9s ease-in-out 1.4s infinite;
          }
        }
        @keyframes prestige-hero-shimmer {
          0%, 100% { background-position: 130% 50%; }
          50%      { background-position: -30% 50%; }
        }

        /* ── Sheen sulla CTA primaria (solo puntatore fine) ────────── */
        @media (hover: hover) and (pointer: fine) {
          .prestige-hero-root .prestige-cta {
            position: relative;
            overflow: hidden;
            transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s ease;
          }
          .prestige-hero-root .prestige-cta::after {
            content: "";
            position: absolute;
            inset: 0;
            transform: translate3d(-120%, 0, 0);
            background: linear-gradient(100deg, transparent, hsl(0 0% 100% / 0.38), transparent);
            pointer-events: none;
          }
          .prestige-hero-root .prestige-cta:hover { transform: translate3d(0, -2px, 0); }
          .prestige-hero-root .prestige-cta:hover::after {
            animation: prestige-hero-sheen .85s cubic-bezier(.22,1,.36,1);
          }
          .prestige-hero-root .prestige-cta-ghost {
            transition: transform .45s cubic-bezier(.16,1,.3,1), border-color .45s ease, background .45s ease;
          }
          .prestige-hero-root .prestige-cta-ghost:hover { transform: translate3d(0, -2px, 0); }
        }
        @keyframes prestige-hero-sheen {
          to { transform: translate3d(120%, 0, 0); }
        }



        /* ── Gold beams — cinematic light ──────────────────────────── */
        .prestige-hero-beam {
          position: absolute;
          top: -20%;
          height: 140%;
          width: 260px;
          filter: blur(60px);
          opacity: 0.6;
          pointer-events: none;
          mix-blend-mode: screen;
          will-change: transform;
        }
        .prestige-hero-beam--a {
          left: -6%;
          background: linear-gradient(180deg, transparent, hsl(var(--pr-gold) / 0.35), transparent);
        }
        .prestige-hero-beam--b {
          right: -6%;
          background: linear-gradient(180deg, transparent, hsl(var(--pr-emerald-glow) / 0.35), transparent);
        }
        .prestige-hero-halo {
          position: absolute;
          top: 42%; left: 50%;
          width: 70vh; height: 70vh;
          max-width: 900px; max-height: 900px;
          border-radius: 999px;
          background: radial-gradient(circle, hsl(var(--pr-gold) / 0.22), transparent 62%);
          filter: blur(50px);
          pointer-events: none;
          will-change: transform;
        }

        /* ── Scroll cue tick ───────────────────────────────────────── */
        .prestige-hero-scroll-line {
          display: block;
          width: 1px; height: 40px;
          background: linear-gradient(180deg, hsl(var(--pr-gold) / 0.7), transparent);
          animation: prestige-hero-scroll-drop 2.2s ease-in-out infinite;
        }
        @keyframes prestige-hero-scroll-drop {
          0%, 100% { transform: scaleY(1); transform-origin: top; opacity: .7; }
          50%      { transform: scaleY(0.4); opacity: 1; }
        }

        /* ── Mobile centering ──────────────────────────────────────── */
        @media (max-width: 767px) {
          .prestige-hero-root { text-align: center; }
          .prestige-hero-phone-stage { margin: 0 auto; }
          .prestige-hero-root {
            padding-top: 92px !important;
            padding-bottom: 56px !important;
          }
          .prestige-hero-lang-floating { top: 78px; }

          .prestige-hero-headline { overflow-wrap: anywhere; }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .prestige-hero-root {
            padding-top: 128px !important;
            padding-bottom: 72px !important;
          }
        }



        @media (prefers-reduced-motion: reduce) {
          .prestige-hero-stagger { transition: none !important; opacity: 1 !important; transform: none !important; filter: none !important; }
          .prestige-hero-beam, .prestige-hero-halo { transform: none !important; }
          .prestige-hero-scroll-line { animation: none !important; }
          .prestige-hero-goldring { animation: none !important; }
          .prestige-hero-float { animation: none !important; }
        }


      `}</style>
    </motion.section>
    </div>
  );
}
