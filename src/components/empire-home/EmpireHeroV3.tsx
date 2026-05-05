import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { createMockupPool } from "@/lib/mockup-pool";

/**
 * Empire Hero V3 — hero PULITA, professionale, mobile-first.
 *
 * Architettura:
 *  - Layout flex verticale: nav-spacer → eyebrow → titolo → sub → CTA → iPhone
 *  - Niente pin/ScrollTrigger su questa sezione (evita conflitti con le sezioni sotto)
 *  - iPhone realistico UNICO al centro con rolodex auto di 8 mockup TUTTI DIVERSI
 *  - Mouse parallax sul telefono (solo desktop, no-op se reduced motion)
 *  - Zero sovrapposizioni: ogni elemento ha il suo spazio garantito
 */

const heroPool = createMockupPool();
// 8 mockup garantiti unici (il pool è interleaved tra i settori)
const HERO_PHONES = heroPool.images(8);

const PHONE_LABELS = [
  "Ristorante",
  "NCC",
  "Beauty",
  "Pizzeria",
  "Fitness",
  "Sushi",
  "Yacht",
  "Hotel",
];

export default function EmpireHeroV3() {
  const navigate = useNavigate();
  const phoneRef = useRef<HTMLDivElement>(null);
  const screensRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Auto-rotate del rolodex (mockup tutti diversi, ogni 2.6s)
  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % HERO_PHONES.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  // Sincronizza il translate del rolodex con l'index attivo
  useEffect(() => {
    if (screensRef.current) {
      screensRef.current.style.transform = `translateY(-${active * 100}%)`;
    }
  }, [active]);

  // Mouse parallax leggero (solo se desktop e no reduced motion)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return;

    const phone = phoneRef.current;
    if (!phone) return;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const xv = (e.clientX / window.innerWidth - 0.5) * 2;
        const yv = (e.clientY / window.innerHeight - 0.5) * 2;
        phone.style.transform = `perspective(1400px) rotateY(${xv * 6}deg) rotateX(${-yv * 4}deg) translateZ(0)`;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="hero-v3"
      className="relative isolate w-full overflow-hidden bg-[#05070d] text-white"
    >
      {/* Aurora background statico (no WebGL) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute -left-[20%] -top-[10%] h-[70vh] w-[70vh] rounded-full opacity-50"
          style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 60%)", filter: "blur(110px)" }}
        />
        <div
          className="absolute -right-[20%] top-[30%] h-[70vh] w-[70vh] rounded-full opacity-45"
          style={{ background: "radial-gradient(circle, #a78bfa 0%, transparent 60%)", filter: "blur(110px)" }}
        />
        <div
          className="absolute left-1/2 bottom-0 h-[40vh] w-[60vh] -translate-x-1/2 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #f472b6 0%, transparent 60%)", filter: "blur(120px)" }}
        />
        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)",
          }}
        />
      </div>

      {/* CONTAINER — flex verticale pulito */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-start px-4 pb-12 pt-24 sm:px-6 sm:pt-28 lg:pt-32">
        {/* 1. EYEBROW */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm sm:text-[11px]">
          <Sparkles className="h-3 w-3 text-cyan-300 sm:h-3.5 sm:w-3.5" />
          <span>Empire AI · Sistema Operativo per Aziende</span>
        </div>

        {/* 2. HEADLINE */}
        <h1
          className="text-center font-black leading-[0.92] tracking-[-0.03em]"
          style={{ fontSize: "clamp(2.4rem, 8vw, 5.5rem)" }}
        >
          <span
            className="block"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 6px 30px rgba(255,255,255,0.08)",
            }}
          >
            La tua azienda
          </span>
          <span
            className="mt-1 block"
            style={{
              background: "linear-gradient(135deg, #22d3ee 0%, #a78bfa 50%, #f472b6 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 24px rgba(34,211,238,0.25))",
            }}
          >
            su pilota automatico.
          </span>
        </h1>

        {/* 3. SUBHEADLINE */}
        <p
          className="mx-auto mt-5 max-w-2xl text-center text-white/70"
          style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)", lineHeight: 1.55 }}
        >
          WhatsApp, telefonate, prenotazioni e pagamenti gestiti da un'AI che parla la lingua del tuo settore.
          <span className="mt-1 block text-white/45">
            Ristoranti · NCC · Beauty · Fitness · 25+ verticali pronti.
          </span>
        </p>

        {/* 4. CTA */}
        <div className="mt-7 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate("/auth")}
            className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_50px_-10px_rgba(255,255,255,0.45)] sm:text-base"
          >
            Inizia ora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => navigate("/join")}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-7 text-sm font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/[0.12] sm:text-base"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            Diventa Partner
          </button>
        </div>

        {/* 5. iPhone REALISTICO unico — rolodex di 8 mockup TUTTI DIVERSI */}
        <div
          className="relative mt-10 flex flex-col items-center sm:mt-14"
          style={{ perspective: "1400px" }}
        >
          {/* Reflection ground */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-6 left-1/2 h-10 w-[80%] -translate-x-1/2 rounded-[100%] opacity-60"
            style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.35) 0%, transparent 70%)", filter: "blur(20px)" }}
          />

          {/* iPhone frame */}
          <div
            ref={phoneRef}
            className="relative transition-transform duration-300 ease-out will-change-transform"
            style={{
              width: "min(78vw, 290px)",
              aspectRatio: "9 / 19.5",
            }}
          >
            {/* Outer titanium bezel */}
            <div
              className="absolute inset-0 rounded-[44px]"
              style={{
                background: "linear-gradient(145deg, #2a2a2e 0%, #0a0a0c 50%, #1a1a1e 100%)",
                boxShadow:
                  "0 40px 80px -20px rgba(0,0,0,0.9), 0 20px 40px -10px rgba(34,211,238,0.15), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.5)",
              }}
            />
            {/* Inner black bezel */}
            <div
              className="absolute inset-[6px] rounded-[38px] bg-black"
              style={{ boxShadow: "inset 0 0 0 1.5px #0f0f12" }}
            />
            {/* Screen */}
            <div className="absolute inset-[10px] overflow-hidden rounded-[34px] bg-black">
              {/* Rolodex container */}
              <div
                ref={screensRef}
                className="relative h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateY(-${active * 100}%)` }}
              >
                {HERO_PHONES.map((src, i) => (
                  <div
                    key={src + i}
                    className="absolute left-0 h-full w-full"
                    style={{ top: `${i * 100}%` }}
                  >
                    <img
                      src={src}
                      alt={`Empire mockup ${PHONE_LABELS[i] ?? i + 1}`}
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    {/* dimming gradient bottom for label */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                ))}
              </div>

              {/* Glare diagonale fissa */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.04) 100%)",
                }}
              />

              {/* Dynamic Island */}
              <div className="absolute left-1/2 top-2.5 z-30 h-[26px] w-[90px] -translate-x-1/2 rounded-full bg-black ring-1 ring-zinc-900" />

              {/* Label settore corrente — DENTRO lo schermo, in basso, mai fuori */}
              <div className="absolute inset-x-0 bottom-3 z-30 flex justify-center px-3">
                <div className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm">
                  {PHONE_LABELS[active]}
                </div>
              </div>
            </div>

            {/* Hardware buttons — silenziatore + volume + power */}
            <div
              className="absolute -left-[3px] top-[18%] h-9 w-[3px] rounded-l"
              style={{ background: "linear-gradient(90deg, #2a2a2e, #0a0a0c)" }}
            />
            <div
              className="absolute -left-[3px] top-[28%] h-14 w-[3px] rounded-l"
              style={{ background: "linear-gradient(90deg, #2a2a2e, #0a0a0c)" }}
            />
            <div
              className="absolute -left-[3px] top-[40%] h-14 w-[3px] rounded-l"
              style={{ background: "linear-gradient(90deg, #2a2a2e, #0a0a0c)" }}
            />
            <div
              className="absolute -right-[3px] top-[32%] h-20 w-[3px] rounded-r"
              style={{ background: "linear-gradient(270deg, #2a2a2e, #0a0a0c)" }}
            />
          </div>

          {/* Dots indicator — SOTTO al telefono, mai sovrapposti */}
          <div className="mt-6 flex items-center gap-1.5">
            {HERO_PHONES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Mostra mockup ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === active ? 24 : 6,
                  background: i === active ? "linear-gradient(90deg, #22d3ee, #a78bfa)" : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <div className="mt-8 flex flex-col items-center gap-1.5 text-[10px] uppercase tracking-[0.4em] text-white/40">
            <span>Scopri come</span>
            <span className="h-7 w-px animate-pulse bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
