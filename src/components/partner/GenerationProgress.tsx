import { Loader2, CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export type GenerationPhase =
  | "idle"
  | "loading"      // 5-10% — caricamento dati / brand / lead
  | "preview"      // 30%   — anteprima istantanea pronta
  | "generating"   // 60%   — generazione contenuti / mockup AI in corso
  | "building"     // 85%   — costruzione sito / asset finali
  | "finalizing"   // 95%   — upload, validazione, salvataggio
  | "complete";    // 100%

export interface GenerationStep {
  key: string;
  label: string;
}

interface Props {
  /** Fase attuale del processo. */
  phase: GenerationPhase;
  /** Etichetta riga principale (titolo). Se assente viene derivata dalla fase. */
  label?: string;
  /** Sottoetichetta esplicativa (1 riga). Se assente viene derivata dalla fase. */
  sub?: string;
  /** Percentuale 0-100 esplicita (sovrascrive il default mappato dalla fase). */
  percent?: number;
  /** Lista di step da mostrare come checklist. Se omessa usa default. */
  steps?: GenerationStep[];
  /** Variante compatta (no checklist, no sub). */
  compact?: boolean;
  /** Mostra lock-info finale ("Impostazioni bloccate…"). */
  showLockNotice?: boolean;
  /** Classi extra wrapper. */
  className?: string;
}

const DEFAULT_STEPS: GenerationStep[] = [
  { key: "loading", label: "Caricamento dati" },
  { key: "preview", label: "Anteprima istantanea" },
  { key: "generating", label: "Generazione AI" },
  { key: "building", label: "Costruzione output" },
  { key: "complete", label: "Pronto" },
];

const PHASE_DEFAULTS: Record<GenerationPhase, { pct: number; label: string; sub: string }> = {
  idle:       { pct: 0,   label: "In attesa…",          sub: "" },
  loading:    { pct: 8,   label: "Caricamento dati…",   sub: "Estraggo informazioni e prepara il contesto" },
  preview:    { pct: 30,  label: "Anteprima pronta",    sub: "Avvio l'elaborazione AI ad alta fedeltà" },
  generating: { pct: 60,  label: "Generazione AI…",     sub: "Modello al lavoro · può richiedere 1-3 minuti" },
  building:   { pct: 85,  label: "Costruzione…",        sub: "Compongo le pagine, gli asset e i contenuti finali" },
  finalizing: { pct: 95,  label: "Finalizzazione…",     sub: "Upload e validazione in corso" },
  complete:   { pct: 100, label: "Pronto",              sub: "Tutto completato con successo" },
};

const PHASE_ORDER: GenerationPhase[] = ["loading", "preview", "generating", "building", "finalizing", "complete"];

function isStepDone(stepKey: string, currentPhase: GenerationPhase): boolean {
  const stepIdx = PHASE_ORDER.indexOf(stepKey as GenerationPhase);
  const curIdx = PHASE_ORDER.indexOf(currentPhase);
  if (stepIdx < 0 || curIdx < 0) return false;
  return stepIdx < curIdx;
}

function isStepActive(stepKey: string, currentPhase: GenerationPhase): boolean {
  if (stepKey === currentPhase) return true;
  // alias: "generating" copre anche eventuali step custom "ai"
  if (stepKey === "generating" && (currentPhase === "generating" || currentPhase === "preview")) {
    return stepKey === currentPhase;
  }
  return false;
}

/**
 * Barra di avanzamento standardizzata per tutti i flussi di generazione lunghi
 * della piattaforma Partner (mockup AI, sito 1:1, factory demo, ecc).
 *
 * Mostra:
 *  • Riga superiore: spinner + label + percentuale
 *  • Progress bar
 *  • Checklist step (Caricamento → Anteprima → AI → Costruzione → Pronto)
 *  • Note lock opzionale
 */
export function GenerationProgress({
  phase,
  label,
  sub,
  percent,
  steps = DEFAULT_STEPS,
  compact = false,
  showLockNotice = false,
  className = "",
}: Props) {
  if (phase === "idle") return null;

  const def = PHASE_DEFAULTS[phase];
  const pct = typeof percent === "number" ? Math.max(0, Math.min(100, percent)) : def.pct;
  const titleText = label || def.label;
  const subText = sub ?? def.sub;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={phase !== "complete"}
      className={`rounded-xl border border-primary/40 bg-primary/[0.06] p-3 space-y-3 ${className}`}
    >
      <div className="flex items-start gap-2">
        {phase === "complete" ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
        ) : (
          <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="font-semibold text-xs leading-tight">{titleText}</p>
            <span className="text-[10px] font-mono tabular-nums text-primary">{pct}%</span>
          </div>
          {!compact && subText && (
            <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{subText}</p>
          )}
        </div>
      </div>

      <Progress value={pct} className="h-1.5" aria-label={`Avanzamento: ${pct}%`} />

      {!compact && steps.length > 0 && (
        <ol className={`grid grid-cols-2 sm:grid-cols-${Math.min(steps.length, 5)} gap-1.5`}>
          {steps.map((s) => {
            const done = isStepDone(s.key, phase);
            const active = isStepActive(s.key, phase);
            return (
              <li
                key={s.key}
                className={`flex items-center gap-1.5 rounded-md border px-1.5 py-1 text-[10px] leading-tight transition-colors ${
                  active
                    ? "border-primary/60 bg-primary/10 text-foreground font-medium"
                    : done
                    ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
                    : "border-border/50 bg-muted/30 text-muted-foreground"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                ) : active ? (
                  <Loader2 className="h-3 w-3 shrink-0 animate-spin text-primary" />
                ) : (
                  <Circle className="h-3 w-3 shrink-0" />
                )}
                <span className="truncate">{s.label}</span>
              </li>
            );
          })}
        </ol>
      )}

      {showLockNotice && phase !== "complete" && (
        <p className="text-[9px] text-muted-foreground leading-snug pt-0.5 border-t border-border/40">
          🔒 Impostazioni bloccate durante la generazione per garantire risultati coerenti.
        </p>
      )}
    </div>
  );
}
