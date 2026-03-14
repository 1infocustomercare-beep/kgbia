import { motion } from "framer-motion";
import { Crown, DollarSign, Zap, CreditCard, Shield, Rocket, Trophy, Users, Gift, TrendingUp, Star } from "lucide-react";

const pillars = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Guadagni da €997 a Vendita",
    desc: "Guadagna quasi €1.000 per ogni singola vendita chiusa. Con soli 2 contratti al mese, superi lo stipendio di un dirigente.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Rendita Passiva",
    desc: "Ottieni una parte della rendita costante grazie alla gestione della flotta. Ogni ristorante che converte genera reddito ricorrente dal 2% sugli ordini.",
    gradient: "from-sky-500/20 to-blue-500/20",
    iconColor: "text-sky-400",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Payout Automatici",
    desc: "Niente attese. Grazie a Stripe Connect, ricevi la tua provvigione istantaneamente al momento del pagamento del cliente.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Strumenti d'Élite",
    desc: "Ti forniamo noi la 'Sandbox Demo' perfetta. Non devi spiegare l'app, devi solo mostrarla. Si vende da sola.",
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Zero Rischio",
    desc: "Nessun costo di ingresso. Paghiamo solo il tuo talento. Nessuna fee, nessun deposito, nessun vincolo.",
    gradient: "from-primary/20 to-amber-500/20",
    iconColor: "text-primary",
  },
];

const milestones = [
  { sales: 2, monthly: "€1.994", label: "Stipendio Dirigente", icon: <Star className="w-4 h-4" /> },
  { sales: 3, monthly: "€3.491", label: "€2.991 + €500 Bonus", icon: <Gift className="w-4 h-4" /> },
  { sales: 4, monthly: "€3.988", label: "€3.988 + Sblocco Team Leader", icon: <Crown className="w-4 h-4" /> },
  { sales: 5, monthly: "€6.485", label: "€4.985 + €1.500 Bonus", icon: <Trophy className="w-4 h-4" /> },
  { sales: 10, monthly: "€11.470", label: "Libertà Finanziaria", icon: <Crown className="w-4 h-4" /> },
];

const PartnerRecruitment = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      {/* Hero */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-amber-500/10 border border-primary/20 text-center">
        <Crown className="w-10 h-10 text-primary mx-auto mb-3" />
        <h2 className="text-2xl font-display font-bold text-foreground">Costruisci il tuo Impero</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
          Diventa un partner Empire e trasforma ogni conversazione in un guadagno di quasi €1.000.
        </p>
      </div>

      {/* Pillars */}
      <div className="space-y-3">
        {pillars.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-2xl bg-gradient-to-r ${p.gradient} border border-border/30`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center flex-shrink-0 ${p.iconColor}`}>
                {p.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{p.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Milestone Calculator */}
      <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-3">
        <h3 className="text-sm font-bold text-foreground text-center">📊 Calcolatore Guadagni</h3>
        <div className="space-y-2">
          {milestones.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.15 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">{m.icon}</div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">{m.sales} vendite/mese</p>
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
              </div>
              <span className="text-sm font-display font-bold text-primary">{m.monthly}/mo</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div className="p-5 rounded-2xl bg-gradient-to-r from-primary/20 to-amber-500/20 border border-primary/30 text-center space-y-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Gift className="w-8 h-8 text-primary mx-auto" />
        <h3 className="text-base font-display font-bold text-foreground">Pronto a iniziare?</h3>
        <p className="text-xs text-muted-foreground">
          Vendi l'unica app che si presenta da sola. Guadagna €1.000 a contratto senza essere un venditore.
        </p>
        <div className="p-3 rounded-xl bg-card/50 border border-border/30 mt-2">
          <p className="text-sm font-display font-bold text-primary">Tua Commissione: €997/vendita</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Payout istantaneo via Stripe Connect. Zero rischio, zero costi d'ingresso.
          </p>
        </div>
        <p className="text-[10px] text-muted-foreground/70 italic">
          "Il modo più elegante per guadagnare €10.000 al mese è vendere qualcosa che si vende da solo."
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PartnerRecruitment;
