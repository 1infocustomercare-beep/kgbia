import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmpireScrollDirector } from "../ScrollDirector";
import PrestigePhone, { PHONE_VIEWS, type PhoneView } from "./PrestigePhone";
import { useT, PrestigeLangToggle } from "./PrestigeLang";
import { getEmpireScreens } from "./EmpireMockupScreens";

const HERO_LABELS: PhoneView[] = PHONE_VIEWS;
const HERO_SCREENS = HERO_LABELS.map((view) => getEmpireScreens("restaurant", view));

const ROTATE_MS = 3200;

export default function PrestigeHero() {
  const t = useT();
  const navigate = useNavigate();
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("prestige-hero", { steps: 4 });
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [phoneW, setPhoneW] = useState(280);

  // Responsive phone width
  useEffect(() => {
    const compute = () => {
      const isMobile = window.innerWidth < 640;
      setPhoneW(Math.round(Math.min(isMobile ? 240 : 320, window.innerWidth * (isMobile ? 0.62 : 0.78))));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % HERO_SCREENS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  // mouse parallax for the iPhone stage
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
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
  }, []);

  return (
    <section
      ref={ref}
      data-section="prestige-hero"
      className="prestige-section prestige-dark relative flex items-center overflow-hidden"
      style={{ paddingTop: "clamp(96px, 12svh, 140px)", paddingBottom: "clamp(64px, 8svh, 96px)", minHeight: "auto", overflowX: "hidden" }}
    >
      {/* Lang toggle — top-right floating; auto-hidden when LandingNav already mounts one (see PrestigeTheme) */}
      <div className="prestige-hero-lang-floating absolute right-3 top-[72px] z-20 scale-90 origin-top-right sm:right-6 sm:top-[92px] sm:scale-100">
        <PrestigeLangToggle />
      </div>

      {/* Aurora gold glow that follows scroll */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--pr-gold) / 0.18), transparent 60%)",
          filter: "blur(80px)",
          transform: `translate(-50%, calc(var(--empire-progress, 0) * -40px))`,
        }}
      />

      {/* Vertical editorial label — far right */}
      <div aria-hidden className="hidden lg:flex absolute right-6 top-1/2 z-10 -translate-y-1/2 items-center gap-3">
        <span className="prestige-vertical-label">Est. 2024 · Made in Italy</span>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-12 gap-x-4 gap-y-10 px-4 sm:px-5 lg:gap-x-8 lg:px-10">
        {/* LEFT — Editorial copy (broken grid: spans 12/8) */}
        <div className="col-span-12 lg:col-span-8 min-w-0 relative">
          {/* Indexed eyebrow */}
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.34em] sm:text-[11px]" style={{ color: "hsl(var(--pr-gold-light))" }}>
            <span className="border px-2 py-1 rounded-sm" style={{ borderColor: "hsl(var(--pr-gold) / 0.55)" }}>01</span>
            <span className="prestige-hairline" />
            <span className="inline-flex items-center gap-2"><Sparkles size={12} /> {t({ it: "Empire · Agency AI per la tua azienda", en: "Empire · AI Agency for your business" })}</span>
          </div>

          {/* Monumental Urbanist headline */}
          <h1 className="prestige-display mt-8" style={{ fontSize: "clamp(2.2rem, 6.4vw, 5.4rem)", wordBreak: "keep-all", hyphens: "none" }}>
            <span className="block">{t({ it: "Trasformiamo la tua azienda", en: "We turn your business" })}</span>
            <span className="block prestige-italic mt-2" style={{ fontSize: "clamp(1.3rem, 4.4vw, 3.4rem)" }}>
              {t({ it: "in un impero digitale che lavora 24/7.", en: "into a digital empire that works 24/7." })}
            </span>
          </h1>


          {/* Gold rule + subcopy */}
          <div className="mt-10 grid grid-cols-12 gap-6 items-start">
            <div className="col-span-12 sm:col-span-1 flex sm:block">
              <div className="prestige-rule-gold w-12 sm:w-full sm:h-[1px] mt-3" />
            </div>
            <p
              className="col-span-12 sm:col-span-9 lg:col-span-7 text-base leading-relaxed sm:text-lg"
              style={{ color: "hsl(var(--pr-muted-on-dark))", fontFamily: "Epilogue, sans-serif", fontWeight: 300 }}
            >
              {t({
                it: "Sito, vendite, operations, marketing e customer care unificati in un unico ",
                en: "Website, sales, operations, marketing and customer care unified in a single ",
              })}
              <strong className="font-semibold" style={{ color: "hsl(var(--pr-text-on-dark))" }}>
                {t({ it: "sistema AI cucito sul tuo settore", en: "AI system tailored to your industry" })}
              </strong>
              {t({ it: ".", en: "." })}
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
            <button className="prestige-cta justify-center w-full sm:w-auto" onClick={() => navigate("/onboarding")}>
              <span className="truncate">{t({ it: "Inizia ora", en: "Start now" })}</span> <ArrowRight size={16} className="shrink-0" />
            </button>
            <button
              className="prestige-cta-ghost justify-center w-full sm:w-auto"
              onClick={() => document.getElementById("prestige-lead-form")?.scrollIntoView({ behavior: "smooth" }) ?? document.getElementById("prestige-mockups")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Play size={14} className="shrink-0" /> <span className="truncate">{t({ it: "Parla con un consulente", en: "Talk to a consultant" })}</span>
            </button>
          </div>

          {/* Trust strip — onesto */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.22em]" style={{ color: "hsl(var(--pr-muted-on-dark))", fontWeight: 600 }}>
            <span>{t({ it: "Setup in 7 giorni", en: "7-day setup" })}</span>
            <span>· {t({ it: "Sistemi AI su misura per la tua azienda", en: "AI systems tailored to your business" })}</span>
          </div>
        </div>

        {/* RIGHT — Phone stage (broken grid: spans 12/4, overlaps left) */}
        <div className="col-span-12 lg:col-span-4 relative flex flex-col items-center lg:items-end lg:-mt-24 pb-10 lg:pb-0">
          <div
            ref={stageRef}
            className="prestige-hero-phone-stage relative will-change-transform"
            style={{
              perspective: "1400px",
              width: "min(82vw, 320px)",
              aspectRatio: "9 / 19.5",
              transform:
                "rotate(4deg) translate3d(0, clamp(-20px, calc(var(--empire-progress, 0) * -28px), 20px), 0)",
            }}
          >
            {HERO_SCREENS.map((screen, i) => {
              const isActive = i === active;
              return (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center transition-all duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)]"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? `rotateY(calc(var(--mx, 0) * 12deg)) rotateX(calc(var(--my, 0) * -10deg)) translateZ(0)`
                      : `rotateY(${i < active ? -25 : 25}deg) translateZ(-80px) scale(.92)`,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <PrestigePhone
                    screen={screen}
                    alt={`Vista ${HERO_LABELS[i]}`}
                    label={HERO_LABELS[i]}
                    width={phoneW}
                    loading="eager"
                  />
                </div>
              );
            })}

          </div>

          {/* Indicators */}
          <div className="mt-8 flex justify-center gap-1.5">
            {HERO_SCREENS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Mostra mockup ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === active ? 24 : 8,
                  background: i === active ? "hsl(var(--pr-gold))" : "hsl(var(--pr-gold) / 0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>

  );
}
