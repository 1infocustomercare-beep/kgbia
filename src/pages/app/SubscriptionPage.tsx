import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Crown, CheckCircle2, Zap, Shield, Star, Users, Globe,
  Headphones, Sparkles, ArrowRight, CreditCard, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const PLANS = [
  {
    key: "essential",
    name: "Essential",
    price: 29,
    emoji: "🥉",
    color: "border-zinc-500/30",
    features: ["Dashboard completa", "Menu/Catalogo digitale", "Ordini e prenotazioni", "CRM clienti base", "50 gettoni IA/mese", "2 membri team", "Sito pubblico base"],
  },
  {
    key: "smart_ia",
    name: "Smart IA",
    price: 59,
    emoji: "🥈",
    color: "border-blue-500/30",
    popular: true,
    features: ["Tutto di Essential", "IA avanzata (200 gettoni)", "10 membri team", "Dominio personalizzato", "Automazioni WhatsApp", "Report avanzati", "Supporto prioritario"],
  },
  {
    key: "empire_pro",
    name: "Empire Pro",
    price: 89,
    emoji: "🥇",
    color: "border-yellow-500/30",
    features: ["Tutto di Smart IA", "500 gettoni IA/mese", "Team illimitato", "Multi-sede", "API accesso", "Account manager dedicato", "Funzioni custom prioritarie"],
  },
];

const AI_TOKEN_COSTS: Record<string, { label: string; cost: number }> = {
  menu_description: { label: "Descrizione piatto IA", cost: 5 },
  translate_menu: { label: "Traduzione menu", cost: 10 },
  seo_text: { label: "Testo SEO", cost: 10 },
  auto_reply_review: { label: "Risposta recensione", cost: 3 },
  forecast: { label: "Previsione revenue", cost: 5 },
};

export default function SubscriptionPage() {
  const { company } = useIndustry();
  const { plan, trialEnd, isTrialing, daysLeft } = useSubscription();
  const [aiUsed, setAiUsed] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentPlan = PLANS.find(p => p.key === plan) || PLANS[0];
  const aiLimit = currentPlan.key === "empire_pro" ? 500 : currentPlan.key === "smart_ia" ? 200 : 50;

  useEffect(() => {
    if (!company?.id) return;
    loadAiUsage();
  }, [company?.id]);

  async function loadAiUsage() {
    // Count AI token usage from ai_token_history for this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    // Use existing ai_usage_logs or ai_token_history
    const { data } = await supabase
      .from('ai_usage_logs')
      .select('input_tokens, output_tokens')
      .eq('company_id', company?.id || '')
      .gte('created_at', startOfMonth);
    
    const total = data?.reduce((sum, r) => sum + (r.input_tokens || 0) + (r.output_tokens || 0), 0) || 0;
    setAiUsed(Math.floor(total / 100)); // normalize to "gettoni"
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-80" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-400" /> Abbonamento
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestisci il tuo piano e i moduli attivi
        </p>
      </div>

      {/* Current plan card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{currentPlan.emoji}</span>
                <h2 className="text-xl font-bold">{currentPlan.name}</h2>
                {isTrialing && (
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                    Trial {daysLeft}gg rimasti
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                €{currentPlan.price}/mese • {isTrialing ? `Scade il ${new Date(trialEnd || '').toLocaleDateString('it-IT')}` : 'Rinnovo automatico'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <CreditCard className="w-4 h-4" /> Fatture
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Token usage */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" /> Gettoni IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>{aiUsed} / {aiLimit} usati questo mese</span>
            <span className="text-muted-foreground">{Math.round((aiUsed / aiLimit) * 100)}%</span>
          </div>
          <Progress value={(aiUsed / aiLimit) * 100} className="h-2" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
            {Object.entries(AI_TOKEN_COSTS).map(([key, val]) => (
              <div key={key} className="bg-muted/30 rounded-lg p-2 text-center">
                <p className="text-[10px] text-muted-foreground">{val.label}</p>
                <p className="text-sm font-semibold">{val.cost} gettoni</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plans comparison */}
      <div>
        <h2 className="text-lg font-bold mb-4">Confronta Piani</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((p, i) => {
            const isCurrent = p.key === plan;
            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`relative h-full ${isCurrent ? 'border-primary ring-1 ring-primary/30' : p.color} ${p.popular ? 'ring-1 ring-blue-500/30' : ''}`}>
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white text-[10px]">Più Popolare</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <span className="text-3xl mb-2 block">{p.emoji}</span>
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                    <div className="text-3xl font-bold mt-1">
                      €{p.price}<span className="text-sm font-normal text-muted-foreground">/mese</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {p.features.map(f => (
                      <div key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                    <div className="pt-4">
                      {isCurrent ? (
                        <Button variant="outline" className="w-full" disabled>
                          Piano Attuale
                        </Button>
                      ) : (
                        <Button className="w-full gap-2" variant={p.popular ? "default" : "outline"}>
                          {PLANS.indexOf(currentPlan) < i ? "Upgrade" : "Downgrade"}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
