// ══════════════════════════════════════════════════════════════
// ROIDossier — Visualizza calcoli ROI e payback
// ══════════════════════════════════════════════════════════════
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Clock, Sparkles } from "lucide-react";
import { useROICalculations } from "@/hooks/useAutopilot";

export default function ROIDossier() {
  const { data: rois = [], isLoading } = useROICalculations();

  return (
    <div className="partner-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <Calculator className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Dossier ROI €€€</h3>
            <p className="text-[10px] text-muted-foreground">Quanto guadagna il cliente con Empire</p>
          </div>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-emerald-500 font-bold">Auto</span>
      </div>

      {isLoading ? (
        <div className="text-xs text-muted-foreground py-6 text-center">Caricamento…</div>
      ) : rois.length === 0 ? (
        <div className="text-xs text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
          I dossier ROI vengono generati automaticamente dopo ogni Pain Scan.
        </div>
      ) : (
        <div className="space-y-2 max-h-[420px] overflow-y-auto">
          {rois.slice(0, 8).map((r: any, i: number) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-3 rounded-xl bg-card border border-border/50 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-foreground truncate">
                  {r.business_name || r.url || "Cliente"}
                </p>
                <span className="text-[9px] uppercase tracking-widest text-emerald-500 font-bold">
                  {r.confidence_score || 0}% conf.
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="text-center">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Recupero/m</p>
                  <p className="text-sm font-display font-bold text-emerald-500">
                    +€{Number(r.estimated_monthly_gain_eur || 0).toLocaleString("it-IT")}
                  </p>
                </div>
                <div className="text-center border-x border-border/40">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider">ROI 12m</p>
                  <p className="text-sm font-display font-bold text-primary">
                    {Number(r.roi_12_months_pct || 0).toFixed(0)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Payback</p>
                  <p className="text-sm font-display font-bold text-foreground flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Number(r.payback_months || 0).toFixed(1)}m
                  </p>
                </div>
              </div>

              {r.headline_pitch && (
                <div className="flex items-start gap-1.5 pt-2 border-t border-border/40">
                  <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-muted-foreground italic line-clamp-2">{r.headline_pitch}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-2 border-t border-border/40">
        <TrendingUp className="w-3 h-3 text-emerald-500" />
        Mostralo al cliente: chiusure più veloci e ticket più alto.
      </div>
    </div>
  );
}
