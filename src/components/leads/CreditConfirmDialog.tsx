import { motion, AnimatePresence } from "framer-motion";
import { Coins, AlertTriangle, X, Sparkles } from "lucide-react";
import type { SellerActionCost } from "@/hooks/useSellerCredits";

interface Props {
  open: boolean;
  cost: SellerActionCost | undefined;
  balance: number;
  onConfirm: () => void;
  onCancel: () => void;
  contextLabel?: string;
}

/**
 * Modal di conferma prima di un'azione che consuma crediti reali.
 * Mostra: cosa fa, quanto costa (crediti + €), saldo dopo.
 */
export default function CreditConfirmDialog({ open, cost, balance, onConfirm, onCancel, contextLabel }: Props) {
  if (!cost) return null;
  const remaining = balance - cost.credit_cost;
  const insufficient = remaining < 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="w-full max-w-sm rounded-3xl bg-card border border-border/60 shadow-2xl overflow-hidden"
            initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-5 bg-gradient-to-br from-amber-500/15 via-card to-card border-b border-amber-500/20">
              <button onClick={onCancel} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted transition">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{cost.label}</h3>
                  {contextLabel && <p className="text-[11px] text-muted-foreground">{contextLabel}</p>}
                </div>
              </div>
              {cost.description && (
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{cost.description}</p>
              )}
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <span className="text-xs text-muted-foreground">Costo azione</span>
                <span className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Coins className="w-3.5 h-3.5" /> {cost.credit_cost} crediti
                  {cost.cost_eur_estimate > 0 && (
                    <span className="text-[10px] text-muted-foreground font-normal">
                      (~€{cost.cost_eur_estimate.toFixed(2)})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <span className="text-xs text-muted-foreground">Saldo attuale</span>
                <span className="font-semibold text-foreground">{balance} crediti</span>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-xl ${insufficient ? "bg-red-500/10 border border-red-500/30" : "bg-emerald-500/10 border border-emerald-500/20"}`}>
                <span className="text-xs text-muted-foreground">Saldo dopo</span>
                <span className={`font-bold ${insufficient ? "text-red-400" : "text-emerald-400"}`}>
                  {Math.max(0, remaining)} crediti
                </span>
              </div>

              {insufficient && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-red-300 leading-relaxed">
                    Crediti insufficienti. Servono {cost.credit_cost - balance} crediti in più. Ricarica dal tuo profilo.
                  </p>
                </div>
              )}
            </div>

            <div className="p-5 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-sm font-semibold text-foreground hover:bg-muted transition"
              >
                Annulla
              </button>
              <button
                onClick={onConfirm}
                disabled={insufficient}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/30 transition"
              >
                Conferma
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
