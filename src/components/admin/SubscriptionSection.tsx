import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Zap, Sparkles, AlertTriangle, Check, Loader2, Shield, ArrowRight, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { getIndustryPlanFeatures } from "@/lib/subscription-plans";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SubscriptionData {
  id: string;
  plan: string;
  status: string;
  trial_start: string;
  trial_end: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export default function SubscriptionSection({ restaurantId }: { restaurantId: string }) {
  const { industry, terminology } = useIndustry();
  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  // Industry-adaptive features
  const planFeatures = getIndustryPlanFeatures(industry);

  const PLANS = [
    {
      id: "essential",
      name: "Essential",
      price: 29,
      icon: Zap,
      tagline: "Per iniziare",
      gradient: "from-blue-500 to-blue-600",
      features: planFeatures.essential.filter(f => f.included).map(f => f.text).slice(0, 5),
    },
    {
      id: "smart_ia",
      name: "Smart IA",
      price: 59,
      icon: Sparkles,
      tagline: "Il più scelto",
      popular: true,
      gradient: "from-primary to-accent",
      features: planFeatures.smart_ia.filter(f => f.included).map(f => f.text).slice(0, 6),
    },
    {
      id: "empire_pro",
      name: "Empire Pro",
      price: 89,
      icon: Crown,
      tagline: "Per dominare",
      gradient: "from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))]",
      features: planFeatures.empire_pro.filter(f => f.included).map(f => f.text).slice(0, 6),
    },
  ];

  useEffect(() => {
    if (!restaurantId) return;
    const fetchSub = async () => {
      // Try business_subscriptions first (all sectors)
      const { data: bizSub } = await supabase
        .from("business_subscriptions")
        .select("id, plan, status, trial_start, trial_end, current_period_end, cancel_at_period_end")
        .eq("company_id", restaurantId)
        .maybeSingle();

      if (bizSub) {
        setSub(bizSub as SubscriptionData);
        setLoading(false);
        return;
      }

      // Fallback: restaurant_subscriptions (legacy food)
      const { data } = await supabase
        .from("restaurant_subscriptions")
        .select("id, plan, status, trial_start, trial_end, current_period_end, cancel_at_period_end")
        .eq("restaurant_id", restaurantId)
        .maybeSingle();
      if (data) setSub(data as SubscriptionData);
      setLoading(false);
    };
    fetchSub();

    const channels = [
      supabase
        .channel("biz-sub-section")
        .on("postgres_changes", { event: "*", schema: "public", table: "business_subscriptions", filter: `company_id=eq.${restaurantId}` }, () => fetchSub())
        .subscribe(),
      supabase
        .channel("rest-sub-section")
        .on("postgres_changes", { event: "*", schema: "public", table: "restaurant_subscriptions", filter: `restaurant_id=eq.${restaurantId}` }, () => fetchSub())
        .subscribe(),
    ];
    return () => { channels.forEach(ch => supabase.removeChannel(ch)); };
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Riprova più tardi";
      toast({ title: "Errore", description: message, variant: "destructive" });
    }
    setUpgrading(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Caricamento piano...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* ── Trial / Status Banner ── */}
      {isTrialing && (
        <motion.div
          className={`relative rounded-2xl p-4 border overflow-hidden ${
            isExpired
              ? "bg-destructive/5 border-destructive/30"
              : isWarning
              ? "bg-[hsl(var(--gold))]/5 border-[hsl(var(--gold))]/30"
              : "bg-primary/5 border-primary/30"
          }`}
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
            isExpired ? "from-destructive to-destructive/50" : isWarning ? "from-[hsl(var(--gold))] to-[hsl(var(--gold-light))]" : "from-primary to-accent"
          }`} />
          <div className="flex items-start gap-3">
            {isExpired ? (
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            ) : (
              <Rocket className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${
                isExpired ? "text-destructive" : "text-foreground"
              }`}>
                {isExpired
                  ? "Prova Gratuita Scaduta"
                  : `Prova Gratuita — ${daysLeft} giorni rimasti`}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isExpired
                  ? "Attiva un piano per continuare a crescere con Empire."
                  : `Tutte le funzionalità sbloccate fino al ${new Date(sub!.trial_end).toLocaleDateString("it-IT")}.`}
              </p>
              {!isExpired && (
                <div className="mt-2.5">
                  <Progress value={((90 - daysLeft) / 90) * 100} className="h-1" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Active plan info ── */}
      {sub?.status === "active" && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 border border-primary/30 bg-gradient-to-br from-primary/[0.06] to-transparent"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">
                Piano {PLANS.find(p => p.id === sub.plan)?.name}
                <Badge variant="outline" className="ml-2 text-[9px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Attivo</Badge>
              </p>
              <p className="text-xs text-muted-foreground">
                €{PLANS.find(p => p.id === sub.plan)?.price}/mese
                {sub.current_period_end && ` · Rinnovo il ${new Date(sub.current_period_end).toLocaleDateString("it-IT")}`}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Plan Cards ── */}
      <div className="grid gap-3">
        {PLANS.map((plan, i) => {
          const isCurrent = sub?.plan === plan.id && sub?.status === "active";
          const Icon = plan.icon;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-2xl border p-4 overflow-hidden transition-all ${
                isCurrent
                  ? "border-primary/50 bg-primary/[0.04] ring-1 ring-primary/20"
                  : plan.popular
                  ? "border-primary/30 bg-gradient-to-br from-primary/[0.04] to-transparent ring-1 ring-primary/10"
                  : "border-border/50 bg-card/30"
              }`}
            >
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${plan.gradient} opacity-60`} />

              {plan.popular && !isCurrent && (
                <div className="absolute top-2.5 right-3">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-[9px] px-2 py-0.5 border-0 shadow-lg shadow-primary/20">
                    ⭐ Consigliato
                  </Badge>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-bold">{plan.name}</h3>
                    <span className="text-[10px] text-muted-foreground">{plan.tagline}</span>
                  </div>
                  <p className="text-xl font-bold mt-0.5">
                    €{plan.price}<span className="text-xs font-normal text-muted-foreground">/mese</span>
                  </p>
                </div>
              </div>

              <ul className="mt-3 space-y-1.5 mb-4">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-2.5 rounded-xl bg-primary/10 text-center text-xs font-semibold text-primary border border-primary/20">
                  ✓ Piano Attuale
                </div>
              ) : (
                <motion.button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={!!upgrading}
                  className={`w-full py-3 rounded-xl text-xs font-bold min-h-[44px] disabled:opacity-50 flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/15"
                      : plan.id === "empire_pro"
                      ? "bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-background"
                      : "bg-muted/40 border border-border/50 text-foreground hover:bg-muted/60"
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  {upgrading === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {isTrialing ? "Attiva" : "Passa a"} {plan.name}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground/40 pt-1">
        <Shield className="w-3 h-3" />
        <span>Pagamento sicuro con Stripe · Annulla in qualsiasi momento</span>
      </div>
    </motion.div>
  );
}
