// ══════════════════════════════════════════════════════════════
// SalesCoachPanel — Insights AI + bottoni refresh
// ══════════════════════════════════════════════════════════════
import { motion } from "framer-motion";
import { Lightbulb, RefreshCw, Sparkles, Loader2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useSalesCoachInsights,
  useGenerateCoachInsight,
  useRefreshSalesStats,
  useMyLeaderboardRow,
} from "@/hooks/useAutopilot";

export default function SalesCoachPanel() {
  const { data: insights = [], isLoading } = useSalesCoachInsights();
  const { data: me } = useMyLeaderboardRow();
  const refreshStats = useRefreshSalesStats();
  const genInsight = useGenerateCoachInsight();

  return (
    <div className="partner-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Sales Coach AI</h3>
            <p className="text-[10px] text-muted-foreground">Micro-azioni per chiudere più clienti</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => refreshStats.mutate()} disabled={refreshStats.isPending} className="h-7 px-2">
            {refreshStats.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          </Button>
          <Button size="sm" onClick={() => genInsight.mutate()} disabled={genInsight.isPending} className="h-7 px-2 gap-1">
            {genInsight.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            <span className="text-[10px]">Nuovo tip</span>
          </Button>
        </div>
      </div>

      {/* Stats personali */}
      {me && (
        <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-primary/10 border border-amber-500/20">
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Livello</p>
            <p className="text-base font-display font-bold text-amber-500 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" />{me.level || 1}
            </p>
          </div>
          <div className="text-center border-l border-border/40">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">XP</p>
            <p className="text-base font-display font-bold text-primary">{Number(me.total_xp || 0).toLocaleString("it-IT")}</p>
          </div>
          <div className="text-center border-l border-border/40">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Streak</p>
            <p className="text-base font-display font-bold text-orange-500">{me.streak_days || 0}🔥</p>
          </div>
          <div className="text-center border-l border-border/40">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Rank</p>
            <p className="text-base font-display font-bold text-foreground">#{me.global_rank || "—"}</p>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[280px] overflow-y-auto">
        {isLoading ? (
          <div className="text-xs text-muted-foreground py-4 text-center">Caricamento insights…</div>
        ) : insights.length === 0 ? (
          <div className="text-xs text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
            Nessun insight ancora. Tocca "Nuovo tip" per ricevere un consiglio personalizzato dall'AI.
          </div>
        ) : (
          insights.map((ins: any, i: number) => (
            <motion.div
              key={ins.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-3 rounded-xl bg-card border border-border/50 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-widest font-bold text-amber-500">
                  {ins.insight_type || "tip"}
                </span>
                {ins.priority && (
                  <span className="text-[9px] text-muted-foreground">P{ins.priority}</span>
                )}
              </div>
              <p className="text-xs font-semibold text-foreground">{ins.title}</p>
              <p className="text-[11px] text-muted-foreground">{ins.message}</p>
              {ins.suggested_action && (
                <p className="text-[10px] text-primary font-semibold pt-1">→ {ins.suggested_action}</p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
