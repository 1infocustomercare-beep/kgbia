import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Timer, Target, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pickMockup } from "@/lib/mockup-rotation";

/**
 * CaseStudySliders — Interactive case study.
 * 3 misurabili guidati da slider: l'utente "muove" la leva e vede in tempo reale
 * l'impatto economico stimato sul proprio business.
 * Mockup ruotato dal sistema di rotation (slot="case") per non ripetere immagini.
 */

type Metric = {
  id: "orders" | "ops" | "conv";
  label: string;
  unit: string;
  min: number;
  max: number;
  default: number;
  baseline: number;
  baselineLabel: string;
  Icon: typeof TrendingUp;
  accent: string;
  copy: (delta: number) => string;
};

const METRICS: Metric[] = [
  {
    id: "orders",
    label: "Ordini in più al mese",
    unit: "%",
    min: 8,
    max: 60,
    default: 38,
    baseline: 1200,
    baselineLabel: "ordini/mese baseline",
    Icon: TrendingUp,
    accent: "hsl(42 94% 62%)",
    copy: (d) => `Scenario: fino a ${Math.round(1200 * (d / 100))} ordini o richieste gestibili con agenti AI, upsell guidati e recupero conversazioni.`,
  },
  {
    id: "ops",
    label: "Tempo operativo risparmiato",
    unit: "%",
    min: 20,
    max: 75,
    default: 55,
    baseline: 32,
    baselineLabel: "ore/settimana team",
    Icon: Timer,
    accent: "hsl(195 100% 55%)",
    copy: (d) => `Scenario: circa ${Math.round(32 * (d / 100))} ore/settimana spostabili da attività manuali a processi automatizzati e controllabili.`,
  },
  {
    id: "conv",
    label: "Conversione lead → cliente",
    unit: "%",
    min: 5,
    max: 35,
    default: 22,
    baseline: 100,
    baselineLabel: "lead/mese",
    Icon: Target,
    accent: "hsl(265 80% 65%)",
    copy: (d) => `Scenario: fino a ${Math.round(100 * (d / 100))} lead ogni 100 lavorati con risposta rapida, qualifica AI e follow-up multi-canale.`,
  },
];

export default function CaseStudySliders() {
  const navigate = useNavigate();
  const [values, setValues] = useState<Record<Metric["id"], number>>({
    orders: 38,
    ops: 55,
    conv: 22,
  });
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const heroImg = pickMockup("food", "case") || pickMockup("ncc", "case");

  return (
    <section
      ref={ref}
      id="case-study"
      className="relative overflow-hidden py-20 sm:py-28"
    >
      {/* BG */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 20%, hsla(42,94%,62%,0.10), transparent 60%), radial-gradient(ellipse 50% 50% at 80% 80%, hsla(195,100%,55%,0.10), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6">
        <div
          className={`mb-10 transition-all duration-700 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[3px] text-[#22d3ee] backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22d3ee]" />
            Caso studio interattivo
          </div>
          <h2
            className="font-heading text-[clamp(1.9rem,5.5vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] text-white"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}
          >
            Muovi le leve.{" "}
            <span className="bg-[linear-gradient(110deg,hsl(42,94%,62%),hsl(195,100%,55%),hsl(265,80%,65%))] bg-clip-text text-transparent">
              Vedi l'impatto reale.
            </span>
          </h2>
          <p className="mt-3 max-w-[640px] text-[13px] leading-[1.7] text-white/65 sm:text-[15px]">
            Simulatore commerciale: sposta gli slider per capire quali leve operative possiamo progettare per il tuo settore — ogni leva attiva agenti,
            automazioni e flussi che costruiamo per te.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          {/* SLIDERS */}
          <div className="space-y-5">
            {METRICS.map((m, idx) => {
              const v = values[m.id];
              const Icon = m.Icon;
              return (
                <div
                  key={m.id}
                  className={`group rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-500 hover:border-white/25 hover:bg-white/[0.06] focus-within:border-white/40 sm:p-6`}
                  style={{
                    transitionDelay: `${revealed ? idx * 80 : 0}ms`,
                    transform: revealed ? "translateY(0)" : "translateY(20px)",
                    opacity: revealed ? 1 : 0,
                    boxShadow: `0 20px 60px -30px ${m.accent}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: `${m.accent.replace("hsl(", "hsla(").replace(")", " / 0.15)")}`,
                          borderColor: `${m.accent.replace("hsl(", "hsla(").replace(")", " / 0.45)")}`,
                          color: m.accent,
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-[2px] text-white/55">
                          Leva {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div className="font-heading text-base font-black uppercase text-white sm:text-lg">
                          {m.label}
                        </div>
                      </div>
                    </div>
                    <div
                      className="font-mono text-2xl font-black tabular-nums transition-all duration-300 sm:text-3xl"
                      style={{
                        color: m.accent,
                        textShadow: `0 0 24px ${m.accent}`,
                      }}
                    >
                      +{v}
                      {m.unit}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Slider
                      value={[v]}
                      min={m.min}
                      max={m.max}
                      step={1}
                      onValueChange={(val) =>
                        setValues((s) => ({ ...s, [m.id]: val[0] }))
                      }
                      aria-label={m.label}
                    />
                    <div className="mt-1.5 flex justify-between text-[10px] font-semibold uppercase tracking-[2px] text-white/35">
                      <span>+{m.min}{m.unit}</span>
                      <span>{m.baselineLabel}</span>
                      <span>+{m.max}{m.unit}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-[13px] leading-[1.6] text-white/75">
                    {m.copy(v)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* IMPACT PREVIEW */}
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 backdrop-blur-md sm:p-8"
            style={{
              transform: revealed ? "translateY(0)" : "translateY(24px)",
              opacity: revealed ? 1 : 0,
              transition: "all 0.7s ease 0.25s",
            }}
          >
            {heroImg && (
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 hidden h-[280px] w-[160px] rotate-6 overflow-hidden rounded-[2rem] border-[6px] border-black opacity-50 shadow-2xl sm:block"
                style={{
                  boxShadow: "0 30px 80px -20px hsla(42,94%,62%,0.4)",
                }}
              >
                <img
                  src={heroImg}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className="relative">
              <div className="text-[10px] font-bold uppercase tracking-[3px] text-white/55">
                Scenario operativo stimato
              </div>
              <div
                className="mt-2 font-heading text-4xl font-black uppercase leading-none tracking-[-0.02em] text-white sm:text-5xl"
                style={{
                  textShadow: "0 0 40px hsla(42,94%,62%,0.5)",
                }}
              >
                €{Math.round(
                  (values.orders / 100) * 1200 * 18 +
                    (values.ops / 100) * 32 * 4 * 28 +
                    (values.conv / 100) * 100 * 85
                ).toLocaleString("it-IT")}
              </div>
              <div className="mt-1 text-xs text-white/55">
                valore potenziale da validare in consulenza
              </div>

              <div className="mt-6 space-y-2.5">
                {METRICS.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2 transition-colors hover:bg-white/[0.08]"
                  >
                    <span className="text-xs text-white/70">{m.label}</span>
                    <span
                      className="font-mono text-sm font-bold tabular-nums"
                      style={{ color: m.accent }}
                    >
                      +{values[m.id]}
                      {m.unit}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/demo")}
                className="group/btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[hsl(42,94%,62%)] via-[hsl(195,100%,55%)] to-[hsl(265,80%,65%)] px-6 py-3.5 text-sm font-black uppercase tracking-wide text-black shadow-[0_20px_50px_-15px_hsla(195,100%,55%,0.6)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Voglio questi numeri per la mia azienda
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
              <p className="mt-3 text-center text-[10px] uppercase tracking-[2px] text-white/40">
                Analisi guidata · tempi definiti dopo audit
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
