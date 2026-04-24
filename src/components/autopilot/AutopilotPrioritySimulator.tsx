// ══════════════════════════════════════════════════════════════
// AutopilotPrioritySimulator — Dry-run del motore di priorità
// Mostra quali lead partirebbero adesso e quanti scartati per motivo.
// Nessuna azione reale: solo anteprima.
// ══════════════════════════════════════════════════════════════
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Activity,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Target,
  Layers,
  Clock,
  AlertCircle,
  Sparkles,
} from "lucide-react";

type ScoredLead = {
  id: string;
  name: string;
  sector: string;
  city: string;
  pain_score: number;
  roi_eur: number;
  score: number;
  score_breakdown: { pain: number; roi: number; sector: number; recency: number };
  decision: "selected" | "skipped";
  reason?: string;
  reason_label?: string;
  already_in_conversation?: boolean;
};

type SimResult = {
  success: boolean;
  snapshot_at: string;
  config_summary: {
    weights: { pain: number; roi: number; sector: number; recency: number };
    min_pain: number;
    min_roi_eur: number;
    preferred_sectors: string[];
    blocked_sectors: string[];
    max_new_per_run: number;
    max_concurrent: number;
    active_conversations: number;
    concurrency_slots: number;
    daily_cap: number;
    daily_used: number;
    daily_remaining: number;
    hard_limit_this_run: number;
  };
  totals: {
    candidates: number;
    eligible: number;
    would_start: number;
    skipped: number;
  };
  skip_reasons: Record<string, number>;
  would_start: ScoredLead[];
  skipped: ScoredLead[];
};

const REASON_LABELS: Record<string, string> = {
  sector_blocked: "Settore in pausa / escluso",
  below_min_pain: "Sotto soglia Pain",
  below_min_roi: "Sotto soglia ROI",
  already_in_conversation: "Già in conversazione",
  no_channel: "Nessun canale di contatto",
  limit_reached: "Sopra limite per run",
  unknown: "Altro",
};

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function LeadRow({ lead, selected }: { lead: ScoredLead; selected: boolean }) {
  return (
    <div
      className={`partner-soft-tile rounded-xl p-3 border ${
        selected ? "border-emerald-500/40" : "border-border/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {selected ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            )}
            <span className="font-semibold text-sm text-foreground truncate">
              {lead.name}
            </span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground">
              {lead.sector}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {lead.city} · Pain {lead.pain_score} · ROI €
            {lead.roi_eur.toLocaleString("it-IT")}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold text-foreground leading-none">
            {lead.score.toFixed(1)}
          </div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
            score
          </div>
        </div>
      </div>

      {selected ? (
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/40">
          <div>
            <div className="text-[9px] uppercase text-muted-foreground mb-0.5">
              Pain
            </div>
            <ScoreBar value={lead.score_breakdown.pain} color="bg-rose-500" />
          </div>
          <div>
            <div className="text-[9px] uppercase text-muted-foreground mb-0.5">
              ROI
            </div>
            <ScoreBar value={lead.score_breakdown.roi} color="bg-amber-500" />
          </div>
          <div>
            <div className="text-[9px] uppercase text-muted-foreground mb-0.5">
              Sett.
            </div>
            <ScoreBar
              value={lead.score_breakdown.sector}
              color="bg-primary"
            />
          </div>
          <div>
            <div className="text-[9px] uppercase text-muted-foreground mb-0.5">
              Nuovo
            </div>
            <ScoreBar
              value={lead.score_breakdown.recency}
              color="bg-emerald-500"
            />
          </div>
        </div>
      ) : (
        <div className="text-[11px] flex items-center gap-1.5 text-rose-400 pt-2 border-t border-border/40">
          <AlertCircle className="w-3 h-3" />
          {lead.reason_label || REASON_LABELS[lead.reason || "unknown"]}
        </div>
      )}
    </div>
  );
}

export default function AutopilotPrioritySimulator() {
  const [result, setResult] = useState<SimResult | null>(null);
  const [showAllSkipped, setShowAllSkipped] = useState(false);

  const sim = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "autopilot-priority-simulate",
        { body: {} },
      );
      if (error) throw error;
      return data as SimResult;
    },
    onSuccess: (d) => setResult(d),
  });

  return (
    <div className="partner-card rounded-2xl p-4 lg:p-5 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-foreground">
              Simula priorità
            </h3>
            <p className="text-xs text-muted-foreground">
              Vedi quali lead partirebbero adesso, con score trasparente. Nessuna azione reale.
            </p>
          </div>
        </div>
        <Button
          onClick={() => sim.mutate()}
          disabled={sim.isPending}
          size="sm"
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {sim.isPending ? "Calcolo..." : result ? "Ricalcola" : "Simula adesso"}
        </Button>
      </div>

      {sim.isError && (
        <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
          Errore: {(sim.error as Error)?.message || "simulazione fallita"}
        </div>
      )}

      {!result && !sim.isPending && (
        <div className="text-center py-8 text-xs text-muted-foreground border border-dashed border-border/40 rounded-xl">
          Clicca <strong>Simula adesso</strong> per vedere chi partirebbe in questo momento.
        </div>
      )}

      {result && (
        <>
          {/* KPI tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="partner-kpi rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                <Layers className="w-3 h-3" /> Candidati
              </div>
              <div className="text-2xl font-bold text-foreground">
                {result.totals.candidates}
              </div>
            </div>
            <div className="partner-kpi rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-500 mb-1">
                <CheckCircle2 className="w-3 h-3" /> Partirebbero
              </div>
              <div className="text-2xl font-bold text-emerald-500">
                {result.totals.would_start}
              </div>
            </div>
            <div className="partner-kpi rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-amber-500 mb-1">
                <Target className="w-3 h-3" /> Eleggibili
              </div>
              <div className="text-2xl font-bold text-amber-500">
                {result.totals.eligible}
              </div>
            </div>
            <div className="partner-kpi rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-rose-500 mb-1">
                <XCircle className="w-3 h-3" /> Scartati
              </div>
              <div className="text-2xl font-bold text-rose-500">
                {result.totals.skipped}
              </div>
            </div>
          </div>

          {/* Limiti applicati */}
          <div className="partner-soft-tile rounded-xl p-3 grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                <Clock className="w-3 h-3" /> Cap giornaliero
              </div>
              <div className="font-semibold text-foreground">
                {result.config_summary.daily_used} / {result.config_summary.daily_cap}
                <span className="text-muted-foreground font-normal">
                  {" "}
                  · {result.config_summary.daily_remaining} liberi
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                <TrendingUp className="w-3 h-3" /> Concorrenza
              </div>
              <div className="font-semibold text-foreground">
                {result.config_summary.active_conversations} /{" "}
                {result.config_summary.max_concurrent}
                <span className="text-muted-foreground font-normal">
                  {" "}· {result.config_summary.concurrency_slots} slot
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                <Sparkles className="w-3 h-3" /> Max per run
              </div>
              <div className="font-semibold text-foreground">
                {result.config_summary.max_new_per_run}
                <span className="text-muted-foreground font-normal">
                  {" "}· effettivo {result.config_summary.hard_limit_this_run}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
                <Target className="w-3 h-3" /> Pesi
              </div>
              <div className="font-semibold text-foreground text-[11px]">
                P{result.config_summary.weights.pain} · R{result.config_summary.weights.roi}{" "}
                · S{result.config_summary.weights.sector} · N
                {result.config_summary.weights.recency}
              </div>
            </div>
          </div>

          {/* Skip reasons */}
          {Object.keys(result.skip_reasons).length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Motivi di scarto
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(result.skip_reasons).map(([k, v]) => (
                  <span
                    key={k}
                    className="text-[11px] px-2 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  >
                    {REASON_LABELS[k] || k}: <strong>{v}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Would start */}
          {result.would_start.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-emerald-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Partirebbero ora ({result.would_start.length})
                </h4>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {result.would_start.map((l) => (
                  <LeadRow key={l.id} lead={l} selected />
                ))}
              </div>
            </div>
          )}

          {/* Skipped */}
          {result.skipped.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Scartati ({result.skipped.length})
                </h4>
                {result.skipped.length > 6 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAllSkipped((v) => !v)}
                    className="h-7 text-[11px]"
                  >
                    {showAllSkipped ? "Nascondi" : `Mostra tutti`}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {(showAllSkipped ? result.skipped : result.skipped.slice(0, 6)).map(
                  (l) => (
                    <LeadRow key={l.id} lead={l} selected={false} />
                  ),
                )}
              </div>
            </div>
          )}

          {result.totals.candidates === 0 && (
            <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border/40 rounded-xl">
              Nessun lead disponibile da valutare. Cattura nuovi lead nella fase 1.
            </div>
          )}

          <div className="text-[10px] text-muted-foreground text-right">
            Snapshot: {new Date(result.snapshot_at).toLocaleString("it-IT")}
          </div>
        </>
      )}
    </div>
  );
}
