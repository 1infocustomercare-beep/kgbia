import { Search, Sparkles, ListChecks, Briefcase, LucideIcon } from "lucide-react";

/**
 * WorkflowSectionHeader — intestazione visuale coerente per le 4 sezioni del
 * flusso venditore (Ricerca, Intelligence, Risultati, Pipeline). Additiva:
 * non altera contenuti né logica, uniforma solo tipografia e spaziatura tra
 * sezioni per un look professionale e riconoscibile.
 */

type StepKey = "search" | "intel" | "results" | "pipeline";

const STEP_META: Record<StepKey, { n: string; label: string; icon: LucideIcon; accent: string; tint: string }> = {
  search:   { n: "1", label: "Ricerca",      icon: Search,     accent: "#5eead4", tint: "rgba(20,184,166,0.14)" },
  intel:    { n: "2", label: "Intelligence", icon: Sparkles,   accent: "#c4b5fd", tint: "rgba(167,139,250,0.16)" },
  results:  { n: "3", label: "Risultati",    icon: ListChecks, accent: "#fbbf24", tint: "rgba(245,158,11,0.14)" },
  pipeline: { n: "4", label: "Pipeline",     icon: Briefcase,  accent: "#f9a8d4", tint: "rgba(236,72,153,0.14)" },
};

interface Props {
  step: StepKey;
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export default function WorkflowSectionHeader({ step, title, subtitle, right }: Props) {
  const m = STEP_META[step];
  const Icon = m.icon;
  return (
    <header className="flex items-center justify-between gap-3 px-1 pt-1 pb-2 md:pb-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className="inline-flex items-center justify-center rounded-full w-7 h-7 md:w-8 md:h-8 text-[11px] md:text-[12px] font-black shrink-0"
          style={{ background: m.tint, color: m.accent, border: `1px solid ${m.accent}30` }}
        >
          {m.n}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" style={{ color: m.accent }} />
            <h2 className="text-[13px] md:text-[15px] font-black tracking-tight text-white truncate">
              {title ?? m.label}
            </h2>
          </div>
          {subtitle && (
            <p className="text-[10px] md:text-[11px] leading-snug mt-0.5" style={{ color: "#9ca3af" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  );
}
