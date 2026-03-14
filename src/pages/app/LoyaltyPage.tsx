import { useIndustry } from "@/hooks/useIndustry";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Gift, Star, Users, TrendingUp, Crown } from "lucide-react";
import { motion } from "framer-motion";

const LEVELS = [
  { name: "Bronze", min: 0, max: 200, color: "text-amber-700", bg: "bg-amber-700/10" },
  { name: "Silver", min: 200, max: 500, color: "text-slate-400", bg: "bg-slate-400/10" },
  { name: "Gold", min: 500, max: 1000, color: "text-amber-400", bg: "bg-amber-400/10" },
  { name: "Diamond", min: 1000, max: Infinity, color: "text-violet-400", bg: "bg-violet-400/10" },
];

const REWARDS = [
  { name: "Sconto 10%", points: 100, icon: "🎫" },
  { name: "Trattamento gratuito", points: 300, icon: "💆" },
  { name: "Prodotto omaggio", points: 200, icon: "🎁" },
  { name: "VIP Experience", points: 500, icon: "👑" },
  { name: "Gift Card €50", points: 800, icon: "💳" },
];

export default function LoyaltyPage() {
  const { companyId } = useIndustry();

  const { data: clients = [] } = useQuery({
    queryKey: ["loyalty-clients", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("crm_clients").select("*")
        .eq("company_id", companyId!).order("total_spent", { ascending: false }).limit(20);
      return data || [];
    },
  });

  const getLevel = (spent: number) => LEVELS.find(l => spent >= l.min && spent < l.max) || LEVELS[0];
  const getPoints = (spent: number) => Math.round(spent / 10);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-400" />
          Programma Fedeltà
        </h1>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Clienti iscritti", value: clients.length, icon: Users },
          { label: "Punti emessi", value: clients.reduce((s: number, c: any) => s + getPoints(c.total_spent || 0), 0).toLocaleString("it"), icon: Star },
          { label: "VIP (Gold+)", value: clients.filter((c: any) => (c.total_spent || 0) >= 500).length, icon: Crown },
          { label: "Premi riscossi", value: "23", icon: Gift },
        ].map(s => (
          <Card key={s.label} className="border-border/30">
            <CardContent className="p-3 text-center">
              <s.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rules */}
      <Card className="border-border/30">
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-3">Regole Accumulo</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-muted/20">1 punto ogni €10 spesi</div>
            <div className="p-3 rounded-lg bg-muted/20">50 punti bonus per referral</div>
            <div className="p-3 rounded-lg bg-muted/20">Punti doppi il giorno del compleanno</div>
            <div className="p-3 rounded-lg bg-muted/20">25 punti per social share</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Rewards catalog */}
        <div>
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Gift className="w-4 h-4" />Catalogo Premi</h3>
          <div className="space-y-2">
            {REWARDS.map(r => (
              <Card key={r.name} className="border-border/30 hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="p-3 flex items-center gap-3">
                  <span className="text-2xl">{r.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.points} punti</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{r.points} pts</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* VIP Leaderboard */}
        <div>
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" />Classifica VIP</h3>
          <div className="space-y-2">
            {clients.slice(0, 10).map((c: any, i: number) => {
              const level = getLevel(c.total_spent || 0);
              const points = getPoints(c.total_spent || 0);
              const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
              const progress = nextLevel ? ((points - level.min / 10) / ((nextLevel.min - level.min) / 10)) * 100 : 100;
              return (
                <Card key={c.id} className="border-border/30">
                  <CardContent className="p-3 flex items-center gap-3">
                    <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{c.first_name} {c.last_name || ""}</p>
                        <Badge className={`${level.bg} ${level.color} text-[10px] border-0`}>{level.name}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={Math.min(progress, 100)} className="h-1 flex-1" />
                        <span className="text-[10px] text-muted-foreground">{points} pts</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {clients.length === 0 && <p className="text-sm text-muted-foreground text-center p-6">Nessun cliente ancora</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
