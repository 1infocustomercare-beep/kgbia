import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmpireScrollDirector } from "../ScrollDirector";
import PrestigePhone, { PHONE_VIEWS, type PhoneView } from "./PrestigePhone";
import { useT, PrestigeLangToggle } from "./PrestigeLang";
import { getEmpireScreens } from "./EmpireMockupScreens";

const HERO_LABELS: PhoneView[] = PHONE_VIEWS;
const HERO_SCREENS = HERO_LABELS.map((view) => getEmpireScreens("restaurant", view));
const ROTATE_MS = 3600;

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
  const [mounted, setMounted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [phoneW, setPhoneW] = useState(260);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive phone width + breakpoint
  useEffect(() => {
    const compute = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setPhoneW(mobile ? Math.min(220, window.innerWidth * 0.58) : 300);
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
    <section
      ref={ref}
      data-section="prestige-hero"
      className={`prestige-section prestige-dark prestige-hero-root relative flex items-center overflow-hidden ${mounted ? "is-mounted" : ""}`}
      style={{
        paddingTop: "clamp(104px, 13svh, 148px)",
        paddingBottom: "clamp(72px, 9svh, 112px)",
        minHeight: "min(100svh, 900px)",
      }}
    >
      {/* Cinematic gold beams — parallax by scroll */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="prestige-hero-beam prestige-hero-beam--a"
          style={{ transform: `translate3d(calc(var(--empire-progress, 0) * -60px), calc(var(--empire-progress, 0) * -30px), 0) rotate(-14deg)` }}
        />
        <div
          className="prestige-hero-beam prestige-hero-beam--b"
          style={{ transform: `translate3d(calc(var(--empire-progress, 0) * 40px), calc(var(--empire-progress, 0) * 20px), 0) rotate(10deg)` }}
        />
        {/* Aurora gold halo */}
        <div
          className="prestige-hero-halo"
          style={{ transform: `translate(-50%, calc(-50% + calc(var(--empire-progress, 0) * -40px))) scale(${1 + progress * 0.15})` }}
        />
      </div>

      {/* Floating lang toggle */}
      <div className="prestige-hero-lang-floating absolute right-3 top-[76px] z-20 scale-90 origin-top-right sm:right-6 sm:top-[96px] sm:scale-100">
        <PrestigeLangToggle />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-4 gap-y-12 px-4 sm:px-6 lg:gap-x-8 lg:px-10">
        {/* ── LEFT — Editorial copy ── */}
        <div className="col-span-12 lg:col-span-7 min-w-0 relative text-center lg:text-left">
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
            className="prestige-display prestige-hero-headline mt-7"
            style={{ fontSize: "clamp(2.2rem, 6.8vw, 5.8rem)" }}
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
            className="prestige-hero-stagger prestige-hero-stagger--4 mt-8 max-w-2xl text-base leading-relaxed sm:text-lg mx-auto lg:mx-0"
            style={{ color: "hsl(var(--pr-muted-on-dark))", fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
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
          <div className="prestige-hero-stagger prestige-hero-stagger--5 mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3">
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
          <div className="prestige-hero-stagger prestige-hero-stagger--6 mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.22em]"
               style={{ color: "hsl(var(--pr-muted-on-dark))", fontWeight: 600 }}>
            <span>{t({ it: "★ 4.9/5", en: "★ 4.9/5" })}</span>
            <span aria-hidden="true">·</span>
            <span>{t({ it: "3.500+ aziende attive", en: "3,500+ active businesses" })}</span>
            <span aria-hidden="true">·</span>
            <span>{t({ it: "Setup in 7 giorni", en: "7-day setup" })}</span>
          </div>
        </div>

        {/* ── RIGHT — Phone cinematic stage ── */}
        <div className="prestige-hero-stagger prestige-hero-stagger--stage col-span-12 lg:col-span-5 relative flex flex-col items-center justify-center lg:items-end">
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
              // depth stack: front / behind-right / behind-left / back
              const stackTransform = isActive
                ? `translate3d(0, 0, 0) rotateY(calc(var(--mx, 0) * 14deg)) rotateX(calc(var(--my, 0) * -10deg)) scale(1)`
                : modDist === 1
                  ? `translate3d(28%, 6%, -120px) rotateY(-18deg) scale(.9)`
                  : modDist === HERO_SCREENS.length - 1
                    ? `translate3d(-28%, 6%, -120px) rotateY(18deg) scale(.9)`
                    : `translate3d(0, 10%, -220px) rotateY(0deg) scale(.8)`;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Mostra mockup ${i + 1}: ${HERO_LABELS[i]}`}
                  className="absolute inset-0 flex items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] focus:outline-none"
                  style={{
                    opacity: isActive ? 1 : 0.55,
                    transform: stackTransform,
                    transformStyle: "preserve-3d",
                    pointerEvents: isActive ? "auto" : "auto",
                    zIndex: isActive ? 3 : modDist === 1 || modDist === HERO_SCREENS.length - 1 ? 2 : 1,
                    filter: isActive ? "none" : "blur(2px) saturate(.85)",
                  }}
                >
                  <PrestigePhone
                    screen={screen}
                    alt={`Mockup ${HERO_LABELS[i]}`}
                    label={isActive ? HERO_LABELS[i] : undefined}
                    width={phoneW}
                    loading="eager"
                  />
                </button>
              );
            })}
          </div>

          {/* Dot indicators */}
          <div className="mt-10 flex justify-center gap-2" role="tablist" aria-label="Cambia mockup">
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
      </div>

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
        .prestige-hero-stagger {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1);
          will-change: transform, opacity;
        }
        .prestige-hero-root.is-mounted .prestige-hero-stagger { opacity: 1; transform: translateY(0); }
        .prestige-hero-root.is-mounted .prestige-hero-stagger--1 { transition-delay: 60ms; }
        .prestige-hero-root.is-mounted .prestige-hero-stagger--2 { transition-delay: 180ms; }
        .prestige-hero-root.is-mounted .prestige-hero-stagger--3 { transition-delay: 320ms; }
        .prestige-hero-root.is-mounted .prestige-hero-stagger--4 { transition-delay: 480ms; }
        .prestige-hero-root.is-mounted .prestige-hero-stagger--5 { transition-delay: 620ms; }
        .prestige-hero-root.is-mounted .prestige-hero-stagger--6 { transition-delay: 760ms; }
        .prestige-hero-root.is-mounted .prestige-hero-stagger--stage { transition-delay: 260ms; }

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
        }

        @media (prefers-reduced-motion: reduce) {
          .prestige-hero-stagger { transition: none !important; opacity: 1 !important; transform: none !important; }
          .prestige-hero-beam, .prestige-hero-halo { transform: none !important; }
          .prestige-hero-scroll-line { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
