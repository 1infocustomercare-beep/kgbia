import { forwardRef } from "react";
import { motion } from "framer-motion";
import { DollarSign, ArrowUpRight, Crown, CreditCard, Calendar, CheckCircle } from "lucide-react";

const mockSales = [
  { id: 1, restaurant: "Trattoria Da Mario", date: "2026-02-20", amount: 2997, plan: "Full Pay", status: "paid", commission: 997 },
  { id: 2, restaurant: "Pizzeria Vesuvio", date: "2026-02-15", amount: 1050, plan: "3 Rate", status: "paid", commission: 332 },
  { id: 3, restaurant: "Sushi Zen Milano", date: "2026-02-10", amount: 2997, plan: "Full Pay", status: "paid", commission: 997 },
  { id: 4, restaurant: "Osteria del Porto", date: "2026-02-05", amount: 550, plan: "6 Rate", status: "pending", commission: 166 },
  { id: 5, restaurant: "Café Parisien", date: "2026-01-28", amount: 2997, plan: "Full Pay", status: "paid", commission: 997 },
];

const PartnerEarnings = forwardRef<HTMLDivElement>((_, ref) => {
  const totalEarned = mockSales.filter(s => s.status === "paid").reduce((s, i) => s + i.commission, 0);
  const pendingEarnings = mockSales.filter(s => s.status === "pending").reduce((s, i) => s + i.commission, 0);
  const totalSales = mockSales.length;

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
      <h2 className="text-lg font-display font-bold text-foreground">I tuoi Guadagni</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-amber-500/10 border border-primary/20">
          <DollarSign className="w-5 h-5 text-primary mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">€{totalEarned.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">Guadagnato</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50">
          <CreditCard className="w-5 h-5 text-amber-400 mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">€{pendingEarnings.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">In Attesa</p>
        </div>
      </div>

      {/* Split Breakdown Visual */}
      <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-3">
        <h3 className="text-sm font-bold text-foreground">Split per Vendita (€2.997)</h3>
        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-primary" /> Platform Revenue (Kevin)
              </span>
              <span className="font-bold text-foreground">€2.000</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500"
                initial={{ width: 0 }} animate={{ width: "66.7%" }} transition={{ delay: 0.3, duration: 0.8 }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Your Commission (Partner)
              </span>
              <span className="font-bold text-foreground">€997</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                initial={{ width: 0 }} animate={{ width: "33.3%" }} transition={{ delay: 0.5, duration: 0.8 }} />
            </div>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-1">
          Rate 3 mesi: €350 x 3 | Rate 6 mesi: €166 x 6 (pro-rata via Stripe Connect)
        </p>
      </div>

      {/* Recent Sales Table */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-foreground">Vendite Recenti</h3>
        {mockSales.map((sale, i) => (
          <motion.div key={sale.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${sale.status === "paid" ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
              {sale.status === "paid" ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Calendar className="w-4 h-4 text-amber-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{sale.restaurant}</p>
              <p className="text-[10px] text-muted-foreground">{sale.plan} · {new Date(sale.date).toLocaleDateString("it-IT")}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-primary">+€{sale.commission}</p>
              <p className="text-[10px] text-muted-foreground">
                {sale.status === "paid" ? "Ricevuto" : "In attesa"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

PartnerEarnings.displayName = "PartnerEarnings";

export default PartnerEarnings;
