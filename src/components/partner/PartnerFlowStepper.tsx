import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Palette, Target, Sparkles, ArrowRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * PartnerFlowStepper — riepilogo visuale del flusso end-to-end di vendita:
 *   1. Mockup su Misura  → costruisci a mano l'anteprima brandizzata del cliente
 *   2. Lead + Demo Auto  → l'AI scova il locale e genera in automatico il sito 1:1
 *   3. Pronta da Mostrare → apri la vetrina full-screen davanti al cliente
 *
 * Pensato per essere posizionato in cima a /partner/custom-preview e /partner/leads
 * così il venditore capisce SEMPRE in che fase è e dove andrà dopo.
 *
 * Lo step "currentStep" viene evidenziato (anello viola animato + label bold) e
 * gli altri restano cliccabili come scorciatoia diretta al passaggio.
 */

type StepKey = "mockup" | "leads" | "showcase";

interface FlowStep {
  key: StepKey;
  num: number;
  icon: LucideIcon;
  label: string;
  micro: string;
  path: string;
  accent: string; // hex
  glow: string;   // rgba
}

const STEPS: FlowStep[] = [
  {
    key: "mockup",
    num: 1,
    icon: Palette,
    label: "Mockup iPhone",
    micro: "Crea il visual",
    path: "/partner/custom-preview",
    accent: "#fb7185",
    glow: "rgba(251,113,133,0.35)",
  },
  {
    key: "leads",
    num: 2,
    icon: Target,
    label: "Caccia Lead",
    micro: "AI genera demo",
    path: "/partner/leads",
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.35)",
  },
  {
    key: "showcase",
    num: 3,
    icon: Sparkles,
    label: "Pronta da Mostrare",
    micro: "Vetrina cliente",
    path: "/partner/portfolio?present=1",
    accent: "#34d399",
    glow: "rgba(52,211,153,0.35)",
  },
];

interface Props {
  currentStep: StepKey;
  className?: string;
}

export default function PartnerFlowStepper({ currentStep, className = "" }: Props) {
  const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`partner-soft-tile rounded-2xl p-3 sm:p-4 ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(167,139,250,0.06), rgba(52,211,153,0.04))",
        border: "1px solid rgba(167,139,250,0.18)",
      }}
    >
      {/* Header micro */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Flusso vendita · 3 passi
        </p>
        <span className="text-[9px] font-semibold text-violet-300">
          Stai al passo {currentIdx + 1}/3
        </span>
      </div>

      {/* Steps row — mobile-first horizontal scroll fallback su <360px */}
      <div className="flex items-stretch gap-1.5 sm:gap-2">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = step.key === currentStep;
          const isDone = i < currentIdx;
          const isFuture = i > currentIdx;

          return (
            <div key={step.key} className="flex items-stretch flex-1 min-w-0">
              <Link
                to={step.path}
                className="flex-1 min-w-0 group relative rounded-xl p-2 sm:p-2.5 transition-all duration-300 active:scale-[0.97]"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${step.accent}22, ${step.accent}0a)`
                    : isDone
                      ? "rgba(52,211,153,0.06)"
                      : "rgba(255,255,255,0.025)",
                  border: isActive
                    ? `1.5px solid ${step.accent}`
                    : isDone
                      ? "1px solid rgba(52,211,153,0.25)"
                      : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: isActive ? `0 6px 20px ${step.glow}` : "none",
                }}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Passo ${step.num}: ${step.label}`}
              >
                {/* Active pulse ring */}
                {isActive && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ border: `1.5px solid ${step.accent}` }}
                    animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.015, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                <div className="relative flex flex-col items-center text-center gap-1">
                  {/* Step number badge + icon */}
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: isDone
                        ? "rgba(52,211,153,0.18)"
                        : isActive
                          ? `${step.accent}25`
                          : "rgba(255,255,255,0.05)",
                      border: `1px solid ${isActive ? step.accent : isDone ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {isDone ? (
                      <Check className="w-4 h-4" style={{ color: "#34d399" }} />
                    ) : (
                      <Icon
                        className="w-4 h-4"
                        style={{ color: isActive ? step.accent : isFuture ? "#6b7280" : step.accent }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <p
                    className={`text-[10px] sm:text-[11px] leading-tight truncate w-full ${isActive ? "font-bold text-foreground" : "font-semibold text-foreground/85"}`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[8.5px] sm:text-[9px] text-muted-foreground leading-tight truncate w-full hidden sm:block">
                    {step.micro}
                  </p>
                </div>
              </Link>

              {/* Connector arrow */}
              {i < STEPS.length - 1 && (
                <div className="flex items-center px-0.5 sm:px-1 shrink-0" aria-hidden>
                  <ArrowRight
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                    style={{
                      color: i < currentIdx ? "#34d399" : "rgba(255,255,255,0.2)",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
