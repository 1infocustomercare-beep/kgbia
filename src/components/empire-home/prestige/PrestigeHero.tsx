import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmpireScrollDirector } from "../ScrollDirector";
import { createMockupPool } from "@/lib/mockup-pool";
import PrestigePhone, { PHONE_VIEWS, type PhoneView } from "./PrestigePhone";
import { useT, PrestigeLangToggle } from "./PrestigeLang";

const pool = createMockupPool();
const HERO_MOCKS = pool.images(4);
const HERO_LABELS: PhoneView[] = PHONE_VIEWS;

const ROTATE_MS = 3200;

export default function PrestigeHero() {
  const t = useT();
  const navigate = useNavigate();
  const { ref } = useEmpireScrollDirector<HTMLDivElement>("prestige-hero", { steps: 4 });
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % HERO_MOCKS.length);
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
      className="prestige-section prestige-dark relative min-h-[100svh] flex items-center"
      style={{ paddingTop: "max(92px, 12svh)", paddingBottom: "8svh" }}
    >
      {/* Aurora gold glow that follows scroll */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--pr-gold) / 0.18), transparent 60%)",
          filter: "blur(80px)",
          transform: `translate(-50%, calc(var(--empire-progress, 0) * -40px))`,
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-12 lg:gap-12 lg:px-10">
        {/* LEFT — Copy */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3">
            <div className="prestige-eyebrow flex items-center gap-3" style={{ color: "hsl(var(--pr-gold-light))" }}>
              <Sparkles size={14} />
              <span>{t({ it: "Empire · Agency AI per la tua azienda", en: "Empire · AI Agency for your business" })}</span>
            </div>
            <PrestigeLangToggle className="ml-auto lg:ml-0" />
          </div>

          <h1 className="prestige-display mt-5 text-4xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
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
            <span>· {t({ it: "Setup in 24h", en: "24h setup" })}</span>
            <span>· {t({ it: "90 giorni gratis", en: "90 days free" })}</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="prestige-cta" onClick={() => navigate("/onboarding")}>
              {t({ it: "Inizia la tua trasformazione", en: "Start your transformation" })} <ArrowRight size={16} />
            </button>
            <button
              className="prestige-cta-ghost"
              onClick={() => document.getElementById("prestige-mockups")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Play size={14} /> {t({ it: "Vedi i casi reali", en: "See real cases" })}
            </button>
          </div>
        </div>

        {/* RIGHT — iPhone stage */}
        <div className="lg:col-span-5">
          <div
            ref={stageRef}
            className="relative mx-auto"
            style={{
              perspective: "1400px",
              transform: `translateY(calc(var(--empire-progress, 0) * -24px))`,
              width: "min(86vw, 320px)",
              aspectRatio: "9 / 19.5",
            }}
          >
            {HERO_MOCKS.map((src, i) => {
              const isActive = i === active;
              return (
                <div
                  key={src + i}
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
                    src={src}
                    alt={`Vista ${HERO_LABELS[i]}`}
                    label={HERO_LABELS[i]}
                    width={Math.min(320, typeof window !== "undefined" ? window.innerWidth * 0.78 : 280)}
                    loading="eager"
                  />
                </div>
              );
            })}

            {/* Indicators */}
            <div className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 gap-1.5">
              {HERO_MOCKS.map((_, i) => (
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
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em]" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
        SCORRI PER SCOPRIRE ↓
      </div>
    </section>
  );
}
