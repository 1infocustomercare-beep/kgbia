import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calculator, TrendingUp, DollarSign, CheckCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ROICalculator = ({ open, onClose }: Props) => {
  const [monthlyFees, setMonthlyFees] = useState(1500);
  const investmentTotal = 2997;
  const monthsToPayoff = Math.ceil(investmentTotal / monthlyFees);
  const yearSavings = monthlyFees * 12;
  const fiveYearSavings = monthlyFees * 60;
  const netProfit5Y = fiveYearSavings - investmentTotal;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-end justify-center"
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-md bg-card rounded-t-3xl border-t border-x border-border/50 p-5 pb-8 max-h-[85vh] overflow-y-auto"
        >
          <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4" />
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary text-muted-foreground">
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-foreground">Quanto Risparmi con Empire?</h2>
              <p className="text-xs text-muted-foreground">Inserisci le commissioni mensili attuali</p>
            </div>
          </div>

          {/* Input Slider */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Commissioni piattaforme/mese</span>
              <span className="text-lg font-display font-bold text-primary">€{monthlyFees.toLocaleString()}</span>
            </div>
            <Slider
              value={[monthlyFees]}
              onValueChange={([v]) => setMonthlyFees(v)}
              min={300}
              max={5000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>€300</span>
              <span>€5.000</span>
            </div>
          </div>

          {/* ROI Visualization */}
          <div className="space-y-3 mb-5">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-foreground">ROI Payoff</span>
              </div>
              <p className="text-3xl font-display font-bold text-emerald-400">{monthsToPayoff} {monthsToPayoff === 1 ? "mese" : "mesi"}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                L'investimento di €{investmentTotal.toLocaleString()} si ripaga in {monthsToPayoff} mesi.
                Tutto il resto è <span className="text-emerald-400 font-bold">profitto puro</span>.
              </p>
            </div>

            {/* Savings breakdown */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-card border border-border/50 text-center">
                <p className="text-xl font-display font-bold text-foreground">€{yearSavings.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Risparmio 1° Anno</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border/50 text-center">
                <p className="text-xl font-display font-bold text-primary">€{netProfit5Y.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Profitto Netto 5 Anni</p>
              </div>
            </div>

            {/* Payoff timeline bar */}
            <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
              <p className="text-[10px] text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Timeline 12 mesi</p>
              <div className="relative h-6 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-red-400 to-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (monthsToPayoff / 12) * 100)}%` }}
                  transition={{ duration: 0.6 }}
                />
                <motion.div
                  className="absolute top-0 h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                  style={{ left: `${Math.min(100, (monthsToPayoff / 12) * 100)}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, 100 - (monthsToPayoff / 12) * 100)}%` }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[9px] text-muted-foreground">
                <span className="text-red-400">← Investimento</span>
                <span className="text-emerald-400">Profitto Puro →</span>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="p-4 rounded-xl bg-card border border-border/50 space-y-2 mb-4">
            <h3 className="text-xs font-bold text-foreground">Empire vs Piattaforme Delivery</h3>
            {[
              { label: "Commissione Empire", value: "2% silenzioso", good: true },
              { label: "Commissione JustEat/Glovo", value: "15-30%", good: false },
              { label: "Canone mensile Empire", value: "€0", good: true },
              { label: "Canone mensile piattaforme", value: "€100-500", good: false },
              { label: "Proprietà dei dati clienti", value: "Tua 100%", good: true },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={`font-semibold ${row.good ? "text-emerald-400" : "text-red-400"}`}>
                  {row.good && <CheckCircle className="w-3 h-3 inline mr-1" />}
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center text-[10px] text-muted-foreground italic">
            "Questa è l'ultima app che comprerai nella tua vita."
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ROICalculator;
