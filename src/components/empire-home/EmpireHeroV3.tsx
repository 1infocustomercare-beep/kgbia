import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Blocks, BrainCircuit, MessageCircle, Mic, Play, Sparkles } from "lucide-react";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import RealisticIPhonePreview from "@/components/empire-home/RealisticIPhonePreview";

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

const HERO_PHONES = [
  { label: "Ristorante", src: SECTOR_MOCKUP_IMAGES.food?.[0], x: "lg:left-[4%]", y: "lg:top-[14%]", rotate: "lg:-rotate-[10deg]", size: "md" as const },
  { label: "NCC / Charter", src: SECTOR_MOCKUP_IMAGES.ncc?.[0], x: "lg:left-[18%]", y: "lg:bottom-[2%]", rotate: "lg:rotate-[7deg]", size: "lg" as const },
  { label: "Beauty", src: SECTOR_MOCKUP_IMAGES.beauty?.[0], x: "lg:right-[20%]", y: "lg:bottom-[4%]", rotate: "lg:-rotate-[6deg]", size: "md" as const },
  { label: "Fitness", src: SECTOR_MOCKUP_IMAGES.fitness?.[0], x: "lg:right-[3%]", y: "lg:top-[17%]", rotate: "lg:rotate-[10deg]", size: "md" as const },
].filter((item): item is typeof item & { src: string } => Boolean(item.src));

const HERO_FLOW = [
  { icon: MessageCircle, label: "WhatsApp", detail: "risposte, preventivi, recupero richieste" },
  { icon: Mic, label: "Voice Agent", detail: "telefonate, prenotazioni, richieste urgenti" },
  { icon: Blocks, label: "Webapp", detail: "catalogo, booking, pagamenti, area clienti" },
  { icon: BrainCircuit, label: "CRM AI", detail: "storico cliente, follow-up, report operativi" },
];

export default function EmpireHeroV3() {
  const navigate = useNavigate();
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Auto-rotate del rolodex (mockup tutti diversi, ogni 2.6s)
  useEffect(() => {
    const id = window.setInterval(() => setActive((i) => (i + 1) % HERO_PHONES.length), 3200);
    return () => window.clearInterval(id);
  }, []);

  // Mouse parallax leggero (solo se desktop e no reduced motion)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return;

    const stage = stageRef.current;
    if (!stage) return;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const xv = (e.clientX / window.innerWidth - 0.5) * 2;
        const yv = (e.clientY / window.innerHeight - 0.5) * 2;
        stage.style.transform = `perspective(1600px) rotateY(${xv * 3.5}deg) rotateX(${-yv * 2.5}deg) translateZ(0)`;
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
      className="relative isolate w-full overflow-hidden bg-background text-foreground"
    >
      {/* Aurora background statico (no WebGL) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div
            className="absolute -left-[20%] -top-[10%] h-[70vh] w-[70vh] rounded-full opacity-45"
            style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 62%)", filter: "blur(110px)" }}
        />
        <div
            className="absolute -right-[20%] top-[30%] h-[70vh] w-[70vh] rounded-full opacity-35"
            style={{ background: "radial-gradient(circle, hsl(var(--empire-violet-glow)) 0%, transparent 62%)", filter: "blur(110px)" }}
        />
        <div
            className="absolute left-1/2 bottom-0 h-[40vh] w-[60vh] -translate-x-1/2 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 62%)", filter: "blur(120px)" }}
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
        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-start px-4 pb-14 pt-24 sm:px-6 sm:pt-28 lg:pt-28">
        {/* 1. EYEBROW */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/80 sm:text-[11px]">
            <Sparkles className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5" />
          <span>Empire AI · Sistema Operativo per Aziende</span>
        </div>

        {/* 2. HEADLINE */}
          <h1 className="max-w-5xl text-center font-black leading-[0.92] tracking-normal text-foreground" style={{ fontSize: "clamp(2.7rem, 8vw, 6.2rem)", textShadow: "0 10px 44px hsl(0 0% 0% / 0.72)" }}>
          <span
            className="block"
            style={{
                background: "linear-gradient(180deg, hsl(var(--foreground)) 0%, hsl(var(--foreground) / 0.72) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
              Trasforma l'azienda
          </span>
          <span
            className="mt-1 block"
            style={{
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--empire-violet-glow)) 52%, hsl(var(--accent)) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 26px hsl(var(--primary) / 0.34))",
            }}
          >
              in una macchina operativa AI.
          </span>
        </h1>

        {/* 3. SUBHEADLINE */}
          <p
            className="mx-auto mt-5 max-w-3xl text-center text-foreground/76"
          style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)", lineHeight: 1.55 }}
        >
            Costruiamo webapp, agenti vocali, WhatsApp automation, CRM e dashboard che seguono il processo reale del cliente: richiesta, risposta, preventivo, prenotazione, pagamento e follow-up.
            <span className="mt-1 block text-foreground/55">
              Ristoranti · NCC · Beauty · Fitness · Hospitality · altri verticali configurabili.
          </span>
        </p>

        {/* 4. CTA */}
        <div className="mt-7 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate("/auth")}
             className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_50px_-10px_hsl(var(--primary)/0.55)] sm:text-base"
          >
            Inizia ora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => navigate("/join")}
             className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-foreground/20 bg-foreground/[0.06] px-7 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-foreground/[0.12] sm:text-base"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Diventa Partner
          </button>
        </div>

        <div className="mt-7 grid w-full max-w-5xl grid-cols-2 gap-2 sm:grid-cols-4">
          {HERO_FLOW.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-foreground/10 bg-background/72 p-3 text-left shadow-[0_18px_55px_-38px_hsl(0_0%_0%)] sm:p-4">
                <Icon className="mb-2 h-4 w-4 text-primary" />
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-foreground">{item.label}</div>
                <p className="mt-1 text-[11px] leading-snug text-foreground/55">{item.detail}</p>
              </div>
            );
          })}
        </div>

        {/* 5. iPhone realistici — portfolio hero senza scritte sopra agli schermi */}
        <div
          ref={stageRef}
          className="relative mt-10 flex min-h-[360px] w-full max-w-6xl items-center justify-center transition-transform duration-300 ease-out will-change-transform sm:min-h-[430px] lg:min-h-[520px]"
          style={{ perspective: "1600px" }}
        >
          <div aria-hidden className="absolute inset-x-8 bottom-2 h-16 rounded-full bg-primary/20 blur-3xl" />
          {HERO_PHONES.map((phone, index) => {
            const isActive = index === active;
            return (
              <button
                key={phone.label}
                type="button"
                onClick={() => setActive(index)}
                className={`absolute ${phone.x} ${phone.y} ${phone.rotate} transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${isActive ? "z-30 scale-110 opacity-100" : "z-10 scale-90 opacity-72 hover:opacity-100"}`}
                aria-label={`Mostra mockup ${phone.label}`}
              >
                <RealisticIPhonePreview src={phone.src} alt={`Mockup iPhone ${phone.label}`} label={phone.label} size={phone.size} priority={index < 2} />
              </button>
            );
          })}

          {/* Dots indicator — SOTTO al telefono, mai sovrapposti */}
          <div className="absolute bottom-0 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-foreground/10 bg-background/80 px-3 py-2">
            {HERO_PHONES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Mostra mockup ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === active ? 24 : 6,
                  background: i === active ? "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))" : "hsl(var(--foreground) / 0.25)",
                }}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <div className="absolute -bottom-12 flex flex-col items-center gap-1.5 text-[10px] uppercase tracking-[0.4em] text-foreground/40">
            <span>Scopri come</span>
            <span className="h-7 w-px animate-pulse bg-gradient-to-b from-foreground/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
