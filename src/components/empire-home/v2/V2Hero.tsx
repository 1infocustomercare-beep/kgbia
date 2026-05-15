import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmpireScrollDirector } from "../ScrollDirector";
import { createMockupPool } from "@/lib/mockup-pool";
import PrestigePhone, { PHONE_VIEWS } from "../prestige/PrestigePhone";
import type { PhoneView } from "../prestige/PrestigePhone";

const pool = createMockupPool();
const HERO_MOCKS = pool.images(4);
const LABELS: PhoneView[] = PHONE_VIEWS;

const SLIDES: { eyebrow: string; title: string; gold: string; tail: string; desc: string }[] = [
  {
    eyebrow: "EMPIRE · AGENZIA AI PER LA TUA AZIENDA",
    title: "Il tuo business ",
    gold: "non dorme mai",
    tail: ".",
    desc: "Sito, app, prenotazioni, WhatsApp, telefonate, pagamenti — un'unica AI personalizzata sul tuo settore. Zero clienti persi, zero staff in linea.",
  },
  {
    eyebrow: "SISTEMA OPERATIVO COMPLETO",
    title: "Una piattaforma. ",
    gold: "Mille funzioni",
    tail: " su misura.",
    desc: "Dashboard pro, agenda, CRM, fatture, magazzino, fedeltà, recensioni: tutto attivo dal giorno 1, parlato dalla tua AI.",
  },
  {
    eyebrow: "APP CLIENTE BRANDIZZATA",
    title: "I tuoi clienti tornano. ",
    gold: "Spendono",
    tail: " di più.",
    desc: "Un'app sul loro telefono col tuo brand. Push, programma fedeltà, prenotazioni e ordini in 3 tap.",
  },
  {
    eyebrow: "AI CONVERSAZIONALE 24/7",
    title: "Risponde lei. ",
    gold: "Vende",
    tail: " lei.",
    desc: "Su WhatsApp, sito, telefono. Riconosce il cliente, prenota, propone upselling, gestisce reclami. Tu guardi i risultati.",
  },
];

const ROTATE_MS = 4200;

/**
 * Pinned cinematic hero (≈220svh tall): the iPhone stays centered while
 * 4 narrative slides crossfade. Scroll directs the rotation; auto-cycles
 * if the user pauses.
 */
export default function V2Hero() {
  const navigate = useNavigate();
  const stageRef = useRef<HTMLDivElement>(null);
  const { ref, step } = useEmpireScrollDirector<HTMLDivElement>("v2-hero", { steps: 4 });
  const [active, setActive] = useState(0);
  const [phoneW, setPhoneW] = useState(280);
  const userTouched = useRef(false);

  useEffect(() => {
    const compute = () => setPhoneW(Math.round(Math.min(310, window.innerWidth * 0.74)));
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Scroll-driven step
  useEffect(() => {
    if (userTouched.current) return;
    setActive(Math.min(step, SLIDES.length - 1));
  }, [step]);

  // Auto-rotate fallback (covers viewport users that don't scroll within the pinned section)
  useEffect(() => {
    const id = window.setInterval(() => {
      if (userTouched.current) return;
      setActive((v) => (v + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  // Mouse parallax
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
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

  const slide = SLIDES[active];

  return (
    <section
      ref={ref}
      data-section="v2-hero"
      className="relative"
      style={{ height: "220svh" }}
      aria-label="Hero cinematico Empire AI"
    >
      <div
        className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden"
        style={{ paddingTop: "max(96px, 12svh)" }}
      >
        {/* Aurora glow */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--v2-glow) / 0.16), transparent 60%)",
            filter: "blur(90px)",
            transform: `translate(-50%, calc(var(--empire-progress, 0) * -60px))`,
          }}
        />
        <div
          className="pointer-events-none absolute right-[-15vw] top-[20vh] h-[60vh] w-[60vh] rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--v2-gold) / 0.18), transparent 60%)",
            filter: "blur(80px)",
            transform: `translateY(calc(var(--empire-progress, 0) * 40px))`,
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-12 lg:gap-12 lg:px-10">
          {/* Copy */}
          <div className="lg:col-span-7">
            <div className="v2-eyebrow flex items-center gap-2">
              <Sparkles size={14} />
              <span key={slide.eyebrow} className="anim-fade">
                {slide.eyebrow}
              </span>
            </div>

            <h1 className="v2-display mt-5 text-[40px] font-semibold leading-[1.02] sm:text-5xl md:text-6xl lg:text-7xl">
              <span key={`t-${active}`} className="anim-fade-y">
                {slide.title}
                <em className="v2-gold-text not-italic">{slide.gold}</em>
                {slide.tail}
              </span>
            </h1>

            <p
              key={`d-${active}`}
              className="anim-fade-y mt-5 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: "hsl(var(--v2-text-muted))" }}
            >
              {slide.desc}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs" style={{ color: "hsl(var(--v2-text-muted))" }}>
              <span>★★★★★ <strong className="ml-1 v2-gold-text">4.9/5</strong></span>
              <span>· 3.500+ aziende attive</span>
              <span>· Setup in 24h</span>
              <span>· 90 giorni gratis</span>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button className="v2-cta" onClick={() => navigate("/onboarding")}>
                Inizia gratis 90 giorni <ArrowRight size={16} />
              </button>
              <button
                className="v2-ghost"
                onClick={() => document.getElementById("v2-portfolio")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Play size={14} /> Vedi i casi reali
              </button>
            </div>

            {/* Slide indicators */}
            <div className="mt-8 flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    userTouched.current = true;
                    setActive(i);
                  }}
                  aria-label={`Slide ${i + 1}`}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: i === active ? 36 : 10,
                    background: i === active ? "hsl(var(--v2-gold))" : "hsl(var(--v2-gold) / 0.25)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* iPhone stage */}
          <div className="lg:col-span-5">
            <div
              ref={stageRef}
              className="relative mx-auto"
              style={{
                perspective: "1400px",
                width: "min(82vw, 320px)",
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
                        ? `rotateY(calc(var(--mx, 0) * 14deg)) rotateX(calc(var(--my, 0) * -10deg)) scale(1)`
                        : `rotateY(${i < active ? -28 : 28}deg) translateZ(-100px) scale(.9)`,
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    <PrestigePhone
                      src={src}
                      label={LABELS[i]}
                      width={phoneW}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em]" style={{ color: "hsl(var(--v2-text-muted))" }}>
          Scorri ↓
        </div>
      </div>

      <style>{`
        .anim-fade { animation: v2-fade .55s ease-out both; }
        .anim-fade-y { animation: v2-fade-y .65s ease-out both; display: inline-block; }
        @keyframes v2-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes v2-fade-y { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
      `}</style>
    </section>
  );
}
