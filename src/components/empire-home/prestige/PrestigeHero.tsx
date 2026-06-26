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

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-5 lg:grid-cols-12 lg:gap-12 lg:px-10">
        {/* LEFT — Copy */}
        <div className="lg:col-span-7 min-w-0">
          <div className="prestige-eyebrow inline-flex max-w-full items-start gap-2 pr-16 sm:pr-24" style={{ color: "hsl(var(--pr-gold-light))" }}>
            <Sparkles size={14} className="mt-[2px] shrink-0" />
            <span className="whitespace-normal leading-snug text-[10px] sm:text-xs">{t({ it: "Empire · Agency AI per la tua azienda", en: "Empire · AI Agency for your business" })}</span>
          </div>



          <h1 className="prestige-display mt-5 text-[clamp(1.75rem,5.5vw,4.5rem)] font-semibold leading-[1.05] break-words">
            {t({
              it: "Trasformiamo la tua azienda in un ",
              en: "We turn your business into a ",
            })}
            <span className="prestige-gold-text italic">
              {t({ it: "impero digitale", en: "digital empire" })}
            </span>{" "}
            {t({ it: "che lavora 24/7.", en: "that works 24/7." })}
          </h1>


          <p
            className="mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
            style={{ color: "hsl(var(--pr-muted-on-dark))" }}
          >
            {t({
              it: "Sito web, app, prenotazioni, WhatsApp, telefonate e pagamenti — tutto gestito da un'unica ",
              en: "Website, app, bookings, WhatsApp, calls and payments — all driven by a single ",
            })}
            <strong className="font-semibold" style={{ color: "hsl(var(--pr-text-on-dark))" }}>
              {t({ it: "AI personalizzata", en: "tailored AI" })}
            </strong>
            {t({
              it: " sul tuo settore. Niente staff al telefono, niente clienti persi. Solo crescita.",
              en: " for your industry. No staff on the phone, no lost customers. Just growth.",
            })}
          </p>

          {/* Trust strip */}
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
            <span>★ ★ ★ ★ ★ <span className="ml-1 font-semibold" style={{ color: "hsl(var(--pr-gold-light))" }}>4.9/5</span></span>
            <span>· {t({ it: "3.500+ aziende attive", en: "3,500+ active businesses" })}</span>
            <span>· {t({ it: "Setup in 7 giorni", en: "7-day setup" })}</span>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
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

        </div>

        {/* RIGHT — iPhone stage */}
        <div className="lg:col-span-5 pb-10 lg:pb-0 overflow-hidden">
          <div
            ref={stageRef}
            className="prestige-hero-phone-stage relative mx-auto will-change-transform"
            style={{
              perspective: "1400px",
              width: "min(86vw, 320px)",
              aspectRatio: "9 / 19.5",
              // Clamped parallax: max ±20px so the phone never overflows the section.
              transform:
                "translate3d(0, clamp(-20px, calc(var(--empire-progress, 0) * -28px), 20px), 0)",
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

          {/* Indicators — moved below the phone stage to avoid overflow/clipping */}
          <div className="mt-6 flex justify-center gap-1.5">
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
