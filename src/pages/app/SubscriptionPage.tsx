import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { useSubscription } from "@/hooks/useSubscription";
import { motion } from "framer-motion";
import {
  Crown, CheckCircle2, Zap, Shield, Star, Sparkles,
  ArrowRight, CreditCard, Gem, Lock, TrendingUp,
  Bot, Globe, Headphones, Users, BarChart3, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const PLANS = [
  {
    key: "essential",
    name: "Essential",
    price: 29,
    yearlyPrice: 24,
    icon: Zap,
    tagline: "Per iniziare con il digitale",
    gradient: "from-[hsl(210,60%,50%)] to-[hsl(230,60%,40%)]",
    glowColor: "hsla(220,70%,55%,0.15)",
    borderColor: "border-[hsl(220,50%,40%)]/30",
    features: [
      { text: "Dashboard completa", included: true },
      { text: "Menu / Catalogo digitale", included: true },
      { text: "Ordini e prenotazioni", included: true },
      { text: "CRM clienti base", included: true },
      { text: "50 gettoni IA/mese", included: true },
      { text: "2 membri team", included: true },
      { text: "Sito pubblico base", included: true },
      { text: "Supporto email", included: true },
      { text: "Automazioni avanzate", included: false },
      { text: "Agent IA", included: false },
      { text: "Multi-lingua", included: false },
    ],
  },
  {
    key: "smart_ia",
    name: "Smart IA",
    price: 59,
    yearlyPrice: 49,
    icon: Sparkles,
    tagline: "Il più scelto dai professionisti",
    popular: true,
    gradient: "from-[hsl(var(--primary))] to-[hsl(280,60%,50%)]",
    glowColor: "hsla(265,70%,60%,0.2)",
    borderColor: "border-primary/40",
    features: [
      { text: "Tutto di Essential", included: true },
      { text: "IA avanzata — 200 gettoni", included: true },
      { text: "10 membri team", included: true },
      { text: "Dominio personalizzato", included: true },
      { text: "Automazioni WhatsApp", included: true },
      { text: "Report e analytics avanzati", included: true },
      { text: "Review Shield™", included: true },
      { text: "Supporto prioritario", included: true },
      { text: "1 Agent IA incluso", included: true },
      { text: "Multi-sede", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    key: "empire_pro",
    name: "Empire Pro",
    price: 89,
    yearlyPrice: 74,
    icon: Crown,
    tagline: "Per chi vuole dominare il mercato",
    gradient: "from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))]",
    glowColor: "hsla(35,60%,50%,0.2)",
    borderColor: "border-[hsl(var(--gold))]/40",
    features: [
      { text: "Tutto di Smart IA", included: true },
      { text: "500 gettoni IA/mese", included: true },
      { text: "Team illimitato", included: true },
      { text: "Multi-sede", included: true },
      { text: "API access completo", included: true },
      { text: "3 Agent IA inclusi", included: true },
      { text: "Account manager dedicato", included: true },
      { text: "Funzioni custom prioritarie", included: true },
      { text: "Cross-selling IA", included: true },
      { text: "Programma fedeltà avanzato", included: true },
      { text: "SLA garantito", included: true },
    ],
  },
];

const AI_TOKEN_COSTS: Record<string, { label: string; cost: number; icon: typeof Bot }> = {
  menu_description: { label: "Descrizione piatto IA", cost: 5, icon: Bot },
  translate_menu: { label: "Traduzione menu", cost: 10, icon: Globe },
  seo_text: { label: "Testo SEO", cost: 10, icon: BarChart3 },
  auto_reply_review: { label: "Risposta recensione", cost: 3, icon: Star },
  forecast: { label: "Previsione revenue", cost: 5, icon: TrendingUp },
};

export default function SubscriptionPage() {
  const { company } = useIndustry();
  const { plan, trialEnd, status } = useSubscription(company?.id);
  const isTrialing = status === "trialing";
  const daysLeft = trialEnd ? Math.max(0, Math.ceil((new Date(trialEnd).getTime() - Date.now()) / 86400000)) : 0;
  const [aiUsed, setAiUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const currentPlan = PLANS.find(p => p.key === plan) || PLANS[0];
  const aiLimit = currentPlan.key === "empire_pro" ? 500 : currentPlan.key === "smart_ia" ? 200 : 50;

  useEffect(() => {
    if (!company?.id) return;
    loadAiUsage();
  }, [company?.id]);

  async function loadAiUsage() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { data } = await supabase
      .from('ai_usage_logs')
      .select('input_tokens, output_tokens')
      .eq('company_id', company?.id || '')
      .gte('created_at', startOfMonth);
    const total = data?.reduce((sum, r) => sum + (r.input_tokens || 0) + (r.output_tokens || 0), 0) || 0;
    setAiUsed(Math.floor(total / 100));
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-96" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-6xl mx-auto pb-24">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary-foreground" />
          </div>
          Il Tuo Abbonamento
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-lg">
          Gestisci il tuo piano, monitora i gettoni IA e sblocca funzionalità avanzate per far crescere la tua attività.
        </p>
      </motion.div>

      {/* ── Trial / Status Banner ── */}
      {isTrialing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative rounded-2xl p-5 border overflow-hidden ${
            daysLeft <= 7
              ? "border-destructive/40 bg-destructive/5"
              : daysLeft <= 30
              ? "border-[hsl(var(--gold))]/40 bg-[hsl(var(--gold))]/5"
              : "border-primary/30 bg-primary/5"
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">
                  Prova Gratuita — {daysLeft > 0 ? `${daysLeft} giorni rimasti` : "Scaduta"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {daysLeft > 0
                    ? `Tutte le funzionalità sbloccate fino al ${new Date(trialEnd || '').toLocaleDateString('it-IT')}. Scegli il piano ideale prima della scadenza.`
                    : "La tua prova è terminata. Scegli un piano per continuare a crescere con Empire."}
                </p>
              </div>
            </div>
            {daysLeft <= 14 && (
              <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground whitespace-nowrap">
                <Sparkles className="w-4 h-4" /> Attiva Ora
              </Button>
            )}
          </div>
          {/* Progress bar for trial */}
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>Giorno {90 - daysLeft} di 90</span>
              <span>{daysLeft} giorni rimasti</span>
            </div>
            <Progress value={((90 - daysLeft) / 90) * 100} className="h-1.5" />
          </div>
        </motion.div>
      )}

      {/* ── AI Tokens Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Gettoni IA</h3>
              <p className="text-[11px] text-muted-foreground">Consumo mensile</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">{aiUsed}<span className="text-sm text-muted-foreground font-normal">/{aiLimit}</span></p>
          </div>
        </div>
        <Progress value={(aiUsed / aiLimit) * 100} className="h-2" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {Object.entries(AI_TOKEN_COSTS).map(([key, val]) => {
            const Icon = val.icon;
            return (
              <div key={key} className="bg-muted/20 rounded-xl p-2.5 text-center border border-border/30">
                <Icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
                <p className="text-[10px] text-muted-foreground leading-tight">{val.label}</p>
                <p className="text-xs font-bold mt-0.5">{val.cost}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Billing toggle ── */}
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-bold">Scegli il Piano Perfetto</h2>
        <p className="text-sm text-muted-foreground">Scala quando vuoi. Nessun vincolo.</p>
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-muted/30 border border-border/30 mt-3">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              billingCycle === "monthly"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mensile
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              billingCycle === "yearly"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annuale
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[9px] px-1.5 py-0">
              -17%
            </Badge>
          </button>
        </div>
      </div>

      {/* ── Plan Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((p, i) => {
          const isCurrent = p.key === plan && !isTrialing;
          const Icon = p.icon;
          const displayPrice = billingCycle === "yearly" ? p.yearlyPrice : p.price;
          const planIndex = PLANS.findIndex(x => x.key === plan);

          return (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className={`relative rounded-2xl overflow-hidden group ${
                p.popular
                  ? "ring-2 ring-primary/50 shadow-[0_0_40px_hsla(265,70%,60%,0.12)]"
                  : ""
              }`}
            >
              {/* Top gradient line */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${p.gradient}`} />

              {/* Popular badge */}
              {p.popular && (
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1.5 rounded-b-xl bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-bold tracking-wider uppercase">
                    ⭐ Più Popolare
                  </div>
                </div>
              )}

              <div className={`h-full p-6 border rounded-2xl ${
                isCurrent
                  ? "border-primary/50 bg-primary/[0.04]"
                  : `${p.borderColor} bg-card/40 backdrop-blur-sm`
              } flex flex-col`}>
                {/* Plan header */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-4 ${p.popular ? "mt-4" : ""}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 mb-4">{p.tagline}</p>

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">€{displayPrice}</span>
                    <span className="text-sm text-muted-foreground">/mese</span>
                  </div>
                  {billingCycle === "yearly" && (
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Risparmi €{(p.price - p.yearlyPrice) * 12}/anno
                    </p>
                  )}
                </div>

                {/* Features list */}
                <div className="space-y-2.5 flex-1 mb-6">
                  {p.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2.5 text-[13px]">
                      {f.included ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={f.included ? "text-foreground/80" : "text-muted-foreground/40 line-through"}>
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {isCurrent ? (
                  <div className="w-full py-3 rounded-xl bg-primary/10 text-center text-sm font-semibold text-primary border border-primary/20">
                    ✓ Piano Attuale
                  </div>
                ) : (
                  <motion.button
                    className={`w-full py-3.5 rounded-xl text-sm font-bold min-h-[48px] transition-all ${
                      p.popular
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30"
                        : p.key === "empire_pro"
                        ? "bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-background hover:brightness-110"
                        : "bg-muted/40 border border-border/50 text-foreground hover:bg-muted/60"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {i > planIndex || isTrialing ? (
                      <span className="flex items-center justify-center gap-2">
                        {isTrialing ? "Attiva" : "Upgrade a"} {p.name}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    ) : (
                      "Cambia piano"
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Trust badges ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground/40 text-[11px] pt-4"
      >
        {[
          { icon: Shield, text: "Pagamento sicuro SSL" },
          { icon: CreditCard, text: "Stripe certificato" },
          { icon: Gem, text: "Annulla quando vuoi" },
          { icon: Headphones, text: "Assistenza 7/7" },
        ].map((b, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <b.icon className="w-3.5 h-3.5" />
            <span>{b.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
