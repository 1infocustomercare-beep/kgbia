import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Zap, Sparkles, AlertTriangle, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SubscriptionData {
  id: string;
  plan: string;
  status: string;
  trial_start: string;
  trial_end: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

const PLANS = [
  {
    id: "essential",
    name: "Essential",
    price: 29,
    icon: <Zap className="w-5 h-5" />,
    features: ["Menù digitale QR", "Ordini illimitati", "Dashboard base", "Supporto email"],
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/30",
    badge: "",
  },
  {
    id: "smart_ia",
    name: "Smart IA",
    price: 59,
    icon: <Sparkles className="w-5 h-5" />,
    features: ["Tutto di Essential", "Assistente IA", "Gettoni IA mensili", "Traduzioni automatiche", "Analytics avanzati"],
    color: "from-primary/20 to-primary/5",
    border: "border-primary/40",
    badge: "Popolare",
  },
  {
    id: "empire_pro",
    name: "Empire Pro",
    price: 89,
    icon: <Crown className="w-5 h-5" />,
    features: ["Tutto di Smart IA", "Prenotazioni illimitate", "CRM clienti", "Push notifications", "Priorità supporto", "Multi-lingua illimitato"],
    color: "from-amber-500/20 to-amber-600/5",
    border: "border-amber-500/40",
    badge: "Premium",
  },
];

export default function SubscriptionSection({ restaurantId }: { restaurantId: string }) {
  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("restaurant_subscriptions")
        .select("id, plan, status, trial_start, trial_end, current_period_end, cancel_at_period_end")
        .eq("restaurant_id", restaurantId)
        .maybeSingle();
      if (data) setSub(data as SubscriptionData);
      setLoading(false);
    };
    fetch();

    const channel = supabase
      .channel("sub-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "restaurant_subscriptions", filter: `restaurant_id=eq.${restaurantId}` }, () => fetch())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [restaurantId]);

  const daysLeft = sub ? Math.max(0, Math.ceil((new Date(sub.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;
  const isTrialing = sub?.status === "trialing";
  const isExpired = isTrialing && daysLeft <= 0;
  const isWarning = isTrialing && daysLeft <= 14 && daysLeft > 0;

  const handleUpgrade = async (planId: string) => {
    setUpgrading(planId);
    try {
      const { data, error } = await supabase.functions.invoke("subscription-checkout", {
        body: { restaurant_id: restaurantId, plan: planId },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast({ title: "Piano aggiornato!", description: `Ora sei su ${PLANS.find(p => p.id === planId)?.name}` });
      }
    } catch (err: any) {
      toast({ title: "Errore", description: err.message || "Riprova più tardi", variant: "destructive" });
    }
    setUpgrading(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Status Banner */}
      {isTrialing && (
        <motion.div
          className={`rounded-2xl p-4 border ${
            isExpired
              ? "bg-destructive/10 border-destructive/30"
              : isWarning
              ? "bg-amber-500/10 border-amber-500/30"
              : "bg-primary/10 border-primary/30"
          }`}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <div className="flex items-start gap-3">
            {isExpired ? (
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            ) : isWarning ? (
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${
                isExpired ? "text-destructive" : isWarning ? "text-amber-600 dark:text-amber-400" : "text-foreground"
              }`}>
                {isExpired
                  ? "Prova gratuita scaduta"
                  : isWarning
                  ? `Prova gratuita: ${daysLeft} giorni rimasti`
                  : `Prova gratuita: ${daysLeft} giorni rimasti`}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isExpired
                  ? "Scegli un piano per continuare ad usare Empire."
                  : `La tua prova gratuita di 3 mesi scade il ${new Date(sub!.trial_end).toLocaleDateString("it-IT")}.`}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Active subscription info */}
      {sub?.status === "active" && (
        <div className="rounded-2xl p-4 border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Piano {PLANS.find(p => p.id === sub.plan)?.name} — Attivo
              </p>
              <p className="text-xs text-muted-foreground">
                €{PLANS.find(p => p.id === sub.plan)?.price}/mese · Rinnovo automatico
                {sub.current_period_end && ` il ${new Date(sub.current_period_end).toLocaleDateString("it-IT")}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid gap-3">
        {PLANS.map((plan, i) => {
          const isCurrent = sub?.plan === plan.id && sub?.status === "active";
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border p-4 relative overflow-hidden ${
                isCurrent ? "border-primary bg-primary/5" : `${plan.border} bg-gradient-to-br ${plan.color}`
              }`}
            >
              {plan.badge && (
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                  {plan.badge}
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-background/80 flex items-center justify-center text-primary">
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{plan.name}</h3>
                  <p className="text-lg font-display font-bold text-foreground">
                    €{plan.price}<span className="text-xs font-normal text-muted-foreground">/mese</span>
                  </p>
                </div>
              </div>

              <ul className="space-y-1 mb-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-2.5 rounded-xl bg-primary/10 text-center text-xs font-semibold text-primary">
                  Piano attuale
                </div>
              ) : (
                <motion.button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={!!upgrading}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold min-h-[44px] disabled:opacity-50"
                  whileTap={{ scale: 0.97 }}
                >
                  {upgrading === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : isTrialing ? (
                    "Attiva ora"
                  ) : (
                    "Passa a questo piano"
                  )}
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="text-[10px] text-center text-muted-foreground/60 px-4">
        Pagamento sicuro con Stripe. Puoi annullare in qualsiasi momento.
      </p>
    </motion.div>
  );
}
