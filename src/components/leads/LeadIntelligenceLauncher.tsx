// LeadIntelligenceLauncher — bottone universale "Analizza con Intelligence" (3 crediti).
// Trigger lead-intelligence-analyzer per un lead specifico, mostra inline il report risultante.
// Usato sia nella ricerca manuale (LeadsPage) sia nella card espansa del CRM (SellerCRM).
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Brain, Loader2, Sparkles } from "lucide-react";
import LeadIntelligenceCard, { type IntelligenceReport } from "./LeadIntelligenceCard";

export interface LeadInputForIntelligence {
  name: string;
  city?: string | null;
  full_address?: string | null;
  sector?: string | null;
  website?: string | null;
  phone?: string | null;
  instagram?: string | null;
  google_rating?: number | null;
  google_reviews_count?: number | null;
}

interface Props {
  lead: LeadInputForIntelligence;
  /** Stile compatto (icon-only) o full button */
  variant?: "compact" | "full";
  /** Mostra inline il report sotto al bottone una volta generato */
  showInlineReport?: boolean;
  /** Callback quando il report è pronto (per refresh UI parent) */
  onReportReady?: (report: IntelligenceReport) => void;
  className?: string;
}

export default function LeadIntelligenceLauncher({
  lead, variant = "full", showInlineReport = true, onReportReady, className,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<IntelligenceReport | null>(null);
  const [checking, setChecking] = useState(true);

  // Cerca un report già esistente per questo lead (evita ri-spendere crediti)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: u } = await supabase.auth.getUser();
        if (!u?.user) { setChecking(false); return; }
        const { data } = await supabase
          .from("lead_intelligence_reports")
          .select("*")
          .eq("owner_id", u.user.id)
          .ilike("lead_name", lead.name)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!cancelled && data) setReport(data as any);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [lead.name]);

  const runAnalysis = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("lead-intelligence-analyzer", {
        body: { lead },
      });
      if (error) throw error;
      if (!data?.success) {
        if (data?.error === "insufficient_credits") {
          toast.error("Crediti insufficienti (servono 3 crediti per analisi Intelligence)");
        } else {
          toast.error(data?.error || "Errore analisi Intelligence");
        }
        return;
      }
      const r = data.report as IntelligenceReport;
      setReport(r);
      onReportReady?.(r);
      toast.success(data.cached ? "Report già esistente caricato" : "Report Intelligence generato ✨");
    } catch (e: any) {
      toast.error(e?.message || "Errore analisi");
    } finally {
      setLoading(false);
    }
  };

  const hasReport = !!report;
  const btnLabel = hasReport ? "Report pronto · Apri" : "Analizza con Intelligence (3)";
  const btnIcon = loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : hasReport ? <Sparkles className="w-3.5 h-3.5" /> : <Brain className="w-3.5 h-3.5" />;

  if (variant === "compact") {
    return (
      <>
        <button
          onClick={hasReport ? () => setReport(r => r ? { ...r } : r) : runAnalysis}
          disabled={loading || checking}
          title={btnLabel}
          className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[9px] font-bold transition-all hover:scale-[1.03] disabled:opacity-50 ${className ?? ""}`}
          style={{
            background: hasReport ? "rgba(124,58,237,0.18)" : "linear-gradient(135deg, rgba(124,58,237,0.14), rgba(236,72,153,0.1))",
            border: `1px solid ${hasReport ? "rgba(124,58,237,0.45)" : "rgba(124,58,237,0.3)"}`,
            color: hasReport ? "#e9d5ff" : "#c4b5fd",
          }}
        >
          {btnIcon}
          {hasReport ? "Report" : "AI"}
        </button>
        {showInlineReport && (
          <AnimatePresence>
            {report && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2">
                <LeadIntelligenceCard report={report} defaultExpanded onUpdate={(r) => { setReport(r); onReportReady?.(r); }} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={runAnalysis}
        disabled={loading || checking}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold transition-all disabled:opacity-60 hover:opacity-90"
        style={{
          background: hasReport
            ? "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(124,58,237,0.12))"
            : "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(236,72,153,0.14))",
          border: `1px solid ${hasReport ? "rgba(16,185,129,0.35)" : "rgba(124,58,237,0.35)"}`,
          color: hasReport ? "#a7f3d0" : "#e9d5ff",
        }}
      >
        {btnIcon}
        {loading ? "Analisi in corso…" : hasReport ? "Rigenera report Intelligence (3 crediti)" : btnLabel}
      </button>
      {showInlineReport && (
        <AnimatePresence>
          {report && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2.5">
              <LeadIntelligenceCard report={report} defaultExpanded onUpdate={(r) => { setReport(r); onReportReady?.(r); }} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
