import { motion } from "framer-motion";
import { Crown, CreditCard, Zap, Shield, CheckCircle, Star, Gift } from "lucide-react";

interface Props {
  onOpenROI: () => void;
}

const PricingClosing = ({ onOpenROI }: Props) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
      {/* Hero */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/15 via-card to-amber-500/10 border border-primary/20 text-center">
        <Crown className="w-10 h-10 text-primary mx-auto mb-3" />
        <h2 className="text-xl font-display font-bold text-foreground">Chiudi il Contratto</h2>
        <p className="text-sm text-muted-foreground mt-1">Mostra i piani al ristoratore</p>
      </div>

      {/* Plan A - Featured */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative p-5 rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/10 to-amber-500/5 overflow-hidden"
      >
        {/* Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center gap-1">
          <Star className="w-3 h-3" /> CONSIGLIATO
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Plan A — Full Ownership</h3>
        </div>

        <p className="text-4xl font-display font-bold text-foreground mb-1">€2.997</p>
        <p className="text-xs text-muted-foreground mb-4">IVA 22% inclusa. Pagamento unico.</p>

        <div className="space-y-2.5">
          {[
            "App Proprietaria tua per sempre",
            "Zero canoni mensili — MAI",
            "Solo 2% silenzioso sugli ordini",
            "AI-Mary Protezione Fiscale 2026",
            "Kitchen View + Push Wallet",
            "Aggiornamenti illimitati a vita",
            "Supporto prioritario Empire",
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="text-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
          <p className="text-[11px] text-foreground font-semibold">
            💡 Tua Commissione Partner: <span className="text-primary font-bold">€997</span>
          </p>
        </div>
      </motion.div>

      {/* Plan B - Installments */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="p-5 rounded-2xl bg-card border border-border/50"
      >
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Plan B — Rate</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-muted/30 border border-border/30 text-center">
            <p className="text-lg font-display font-bold text-foreground">€1.050</p>
            <p className="text-[10px] text-muted-foreground">x 3 mesi</p>
            <p className="text-[10px] text-primary font-semibold mt-1">Totale: €3.150</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/30 border border-border/30 text-center">
            <p className="text-lg font-display font-bold text-foreground">€550</p>
            <p className="text-[10px] text-muted-foreground">x 6 mesi</p>
            <p className="text-[10px] text-primary font-semibold mt-1">Totale: €3.300</p>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          Pagamento sicuro via Stripe. Attivazione immediata dalla prima rata.
        </p>
      </motion.div>

      {/* ROI Button */}
      <motion.button
        onClick={onOpenROI}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-amber-500 text-primary-foreground font-bold text-sm tracking-wide shadow-lg shadow-primary/20"
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        📊 Quanto Risparmi con Empire?
      </motion.button>

      {/* Final Quote */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/5 to-amber-500/5 border border-primary/10 text-center space-y-2">
        <Shield className="w-6 h-6 text-primary mx-auto" />
        <p className="text-sm font-display font-bold text-foreground">
          "Questa è l'ultima app che comprerai nella tua vita."
        </p>
        <p className="text-[10px] text-muted-foreground">
          Nessun canone. Nessun vincolo. Proprietà totale. Per sempre.
        </p>
      </div>

      {/* Partner Note */}
      <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-center">
        <p className="text-[10px] text-muted-foreground">
          <Gift className="w-3 h-3 inline text-emerald-400 mr-1" />
          Ricorda: ogni Plan A chiuso = <span className="text-emerald-400 font-bold">€997 in tasca</span>. Rate = commissione pro-rata.
        </p>
      </div>
    </motion.div>
  );
};

export default PricingClosing;
