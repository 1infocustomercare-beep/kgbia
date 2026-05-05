import { useEffect, useRef, useState, type CSSProperties } from "react";
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

// Tempi di rotazione condivisi (vista + transizione coerenti)
const DWELL_MS = 3600;        // tempo di permanenza di ogni mockup completamente visibile
const TRANSITION_MS = 700;    // deve combaciare con duration-700 della transizione CSS

export default function EmpireHeroV3() {
  const navigate = useNavigate();
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [effectStep, setEffectStep] = useState(0);

  // Effetti scroll sempre attivi anche su mobile: niente pin, niente GSAP fragile.
  // Aggiorna CSS variables + step operativo evidenziato in modo sincronizzato allo scroll reale.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = Math.min(Math.max((vh * 0.82 - rect.top) / (rect.height + vh * 0.24), 0), 1);
      section.style.setProperty("--hero-scroll", progress.toFixed(3));
      section.style.setProperty("--hero-glow-y", `${Math.round(progress * -34)}px`);
      const nextStep = Math.min(HERO_FLOW.length - 1, Math.floor(progress * HERO_FLOW.length));
      setEffectStep((current) => (current === nextStep ? current : nextStep));
    };

    const requestUpdate = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Rotazione robusta. Pausa automatica quando:
  //  - hero fuori viewport (IntersectionObserver)
  //  - tab in background (visibilitychange)
  //  - hover / focus utente (isPaused)
  //  - prefers-reduced-motion attivo
  // Riprogramma SOLO dopo TRANSITION_MS, così ogni mockup resta DWELL_MS reali.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (HERO_PHONES.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeoutId: number | null = null;
    let inView = true;
    let tabVisible = !document.hidden;

    const clear = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const schedule = () => {
      clear();
      if (!inView || !tabVisible || isPaused) return;
      timeoutId = window.setTimeout(() => {
        setActive((i) => (i + 1) % HERO_PHONES.length);
        timeoutId = window.setTimeout(schedule, TRANSITION_MS);
      }, DWELL_MS);
    };

    const onVisibility = () => {
      tabVisible = !document.hidden;
      schedule();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        inView = e.isIntersecting && e.intersectionRatio > 0.15;
        schedule();
      },
      { threshold: [0, 0.15, 0.5] }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    document.addEventListener("visibilitychange", onVisibility);

    schedule();

    return () => {
      clear();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isPaused]);

  // Selezione manuale: cambia mockup E resetta il timer in modo pulito,
  // così il nuovo mockup riceve l'intero DWELL_MS prima del prossimo scatto.
  const selectMockup = (idx: number) => {
    setActive(idx);
    setIsPaused(true);
    window.setTimeout(() => setIsPaused(false), 60); // toggle → useEffect re-run → schedule pulito
  };

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
        stage.style.setProperty("--mx", xv.toFixed(3));
        stage.style.setProperty("--my", yv.toFixed(3));
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
      ref={sectionRef}
      id="hero-v3"
      className="relative isolate w-full overflow-hidden bg-background text-foreground"
      style={{ "--hero-scroll": 0, "--hero-glow-y": "0px", "--mx": 0, "--my": 0 } as CSSProperties}
    >
      {/* Aurora background statico (no WebGL) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div
            className="absolute -left-[20%] -top-[10%] h-[70vh] w-[70vh] rounded-full opacity-45 transition-transform duration-300"
            style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 62%)", filter: "blur(110px)", transform: "translate3d(calc(var(--hero-scroll) * 28px), var(--hero-glow-y), 0) scale(calc(1 + var(--hero-scroll) * 0.08))" }}
        />
        <div
            className="absolute -right-[20%] top-[30%] h-[70vh] w-[70vh] rounded-full opacity-35 transition-transform duration-300"
            style={{ background: "radial-gradient(circle, hsl(var(--empire-violet-glow)) 0%, transparent 62%)", filter: "blur(110px)", transform: "translate3d(calc(var(--hero-scroll) * -30px), calc(var(--hero-scroll) * 24px), 0) scale(calc(1 + var(--hero-scroll) * 0.1))" }}
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

      {/* CONTAINER — flex verticale pulito, gap garantito tra blocchi (no sovrapposizioni) */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-start px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:min-h-[100svh] lg:pt-28">
        {/* 1. EYEBROW */}
        <div className="mb-4 inline-flex max-w-[92vw] items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/80 sm:mb-5 sm:px-4 sm:py-1.5 sm:text-[11px] sm:tracking-[0.25em]">
          <Sparkles className="h-3 w-3 shrink-0 text-primary sm:h-3.5 sm:w-3.5" />
          <span className="truncate">Empire AI · Sistema Operativo per Aziende</span>
        </div>

        {/* 2. HEADLINE — clamp specifico per mobile per evitare overflow su 320-375px */}
        <h1
          className="max-w-5xl text-center font-black leading-[0.95] tracking-tight text-foreground sm:leading-[0.92] sm:tracking-normal"
          style={{ fontSize: "clamp(2rem, 9vw, 6.2rem)", textShadow: "0 10px 44px hsl(0 0% 0% / 0.72)" }}
        >
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

        {/* 3. SUBHEADLINE — gap fisso da titolo + max-width controllata su mobile */}
        <p
          className="mx-auto mt-4 max-w-[34ch] px-1 text-center text-foreground/76 sm:mt-5 sm:max-w-3xl sm:px-0"
          style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.15rem)", lineHeight: 1.55 }}
        >
          Costruiamo webapp, agenti vocali, WhatsApp automation, CRM e dashboard che seguono il processo reale del cliente: richiesta, risposta, preventivo, prenotazione, pagamento e follow-up.
          <span className="mt-2 block text-[0.85em] text-foreground/55">
            Ristoranti · NCC · Beauty · Fitness · Hospitality · altri verticali configurabili.
          </span>
        </p>

        {/* 4. CTA — full-width stack su mobile, inline su sm+ */}
        <div className="mt-6 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-7 sm:max-w-none sm:flex-row sm:justify-center">
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

        {/* 4B. FLOW GRID — 2 col mobile, 4 col desktop, padding ridotto su mobile */}
        <div className="mt-6 grid w-full max-w-5xl grid-cols-2 gap-2 sm:mt-7 sm:gap-3 sm:grid-cols-4">
          {HERO_FLOW.map((item, index) => {
            const Icon = item.icon;
            const isLit = index <= effectStep;
            return (
              <div
                key={item.label}
                className={`rounded-2xl border p-2.5 text-left shadow-[0_18px_55px_-38px_hsl(0_0%_0%)] transition-all duration-500 sm:p-4 ${isLit ? "border-primary/45 bg-primary/10 translate-y-0 opacity-100" : "border-foreground/10 bg-background/72 translate-y-1 opacity-72"}`}
              >
                <Icon className={`mb-1.5 h-4 w-4 transition-colors duration-500 sm:mb-2 ${isLit ? "text-primary" : "text-foreground/45"}`} />
                <div className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground sm:text-[11px] sm:tracking-[0.18em]">
                  {item.label}
                </div>
                <p className={`mt-1 text-[10.5px] leading-snug transition-colors duration-500 sm:text-[11px] ${isLit ? "text-foreground/78" : "text-foreground/55"}`}>
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* 5. iPhone — gap GENEROSO sopra, padding-bottom per dots/scroll-hint, nessuna sovrapposizione */}
        <div
          ref={stageRef}
          className="relative mt-12 flex w-full max-w-6xl items-center justify-center pb-20 transition-transform duration-300 ease-out will-change-transform sm:mt-14 sm:pb-24 lg:mt-16"
          style={{
            perspective: "1600px",
            minHeight: "clamp(440px, 78vw, 620px)",
            transform: "perspective(1600px) rotateY(calc(var(--mx) * 3.5deg)) rotateX(calc(var(--my) * -2.5deg)) translateY(calc(var(--hero-scroll) * -18px))",
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => {
            // riprendi dopo un breve delay per consentire il tap sui dot
            window.setTimeout(() => setIsPaused(false), 1200);
          }}
        >
          <div aria-hidden className="absolute inset-x-8 bottom-16 h-16 rounded-full bg-primary/20 blur-3xl sm:bottom-20" />
          {HERO_PHONES.map((phone, index) => {
            const isActive = index === active;
            return (
              <button
                key={phone.label}
                type="button"
                onClick={() => selectMockup(index)}
                className={`${isActive ? "relative block" : "hidden"} lg:absolute lg:block ${phone.x} ${phone.y} ${phone.rotate} transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${isActive ? "z-30 scale-100 lg:scale-110 opacity-100" : "z-10 scale-90 opacity-72 hover:opacity-100"}`}
                aria-label={`Mostra mockup ${phone.label}`}
              >
                <RealisticIPhonePreview
                  src={phone.src}
                  alt={`Mockup iPhone ${phone.label}`}
                  label={phone.label}
                  size={phone.size}
                  priority={index < 2}
                />
              </button>
            );
          })}

          {/* Dots indicator — fissati al fondo del contenitore, MAI sovrapposti al telefono */}
          <div className="absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-foreground/10 bg-background/85 px-3 py-2 backdrop-blur-sm sm:bottom-10">
            {HERO_PHONES.map((_, i) => (
              <button
                key={i}
                onClick={() => selectMockup(i)}
                aria-label={`Mostra mockup ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === active ? 24 : 6,
                  background:
                    i === active
                      ? "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))"
                      : "hsl(var(--foreground) / 0.25)",
                }}
              />
            ))}
          </div>

          {/* Scroll hint — sotto i dots, no overlap */}
          <div className="absolute bottom-0 flex flex-col items-center gap-1 text-[9px] uppercase tracking-[0.35em] text-foreground/40 sm:text-[10px] sm:tracking-[0.4em]">
            <span>Scopri come</span>
            <span className="h-6 w-px animate-pulse bg-gradient-to-b from-foreground/50 to-transparent sm:h-7" />
          </div>
        </div>
      </div>
    </section>
  );
}
