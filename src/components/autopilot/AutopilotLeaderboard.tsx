// ══════════════════════════════════════════════════════════════
// AutopilotLeaderboard — Classifica venditori real-time (DB)
// ══════════════════════════════════════════════════════════════
import { motion } from "framer-motion";
import { Crown, Trophy, Medal, TrendingUp } from "lucide-react";
import { useGlobalLeaderboard, useMyLeaderboardRow } from "@/hooks/useAutopilot";
import { useAuth } from "@/context/AuthContext";

export default function AutopilotLeaderboard() {
  const { user } = useAuth();
  const { data: rowsRaw = [], isLoading } = useGlobalLeaderboard();
  const { data: meRaw } = useMyLeaderboardRow();
  const rows = rowsRaw as any[];
  const me = meRaw as any;

  const podium = (i: number) =>
    i === 0 ? <Crown className="w-4 h-4 text-amber-400" /> :
    i === 1 ? <Medal className="w-4 h-4 text-muted-foreground" /> :
    i === 2 ? <Medal className="w-4 h-4 text-amber-700" /> : null;

  return (
    <div className="partner-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Empire Leaderboard</h3>
            <p className="text-[10px] text-muted-foreground">Top venditori · XP · Badge · Rank globale</p>
          </div>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold">Live</span>
      </div>

      <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
        {isLoading ? (
          <div className="text-xs text-muted-foreground py-6 text-center">Caricamento classifica…</div>
        ) : rows.length === 0 ? (
          <div className="text-xs text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
            Classifica vuota. Inizia a chiudere clienti per scalare la leaderboard!
          </div>
        ) : (
          rows.map((r: any, i: number) => {
            const isMe = r.user_id === user?.id;
            return (
              <motion.div
                key={r.user_id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                  isMe
                    ? "bg-primary/10 border-primary/40 ring-1 ring-primary/30"
                    : i === 0
                      ? "bg-gradient-to-r from-amber-500/10 to-primary/5 border-amber-500/30"
                      : "bg-card border-border/50"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? "bg-amber-500 text-background" :
                  i === 1 ? "bg-slate-400 text-background" :
                  i === 2 ? "bg-amber-700 text-background" :
                  "bg-muted text-foreground"
                }`}>
                  {podium(i) || `#${i + 1}`}
                </div>

                {r.avatar_url ? (
                  <img src={r.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-muted flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {r.display_name || "Venditore"} {isMe && <span className="text-primary">(tu)</span>}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>Lv.{r.level || 1}</span>
                    <span>·</span>
                    <span>{r.deals_closed_month || 0} deal/mese</span>
                    {(r.streak_days || 0) > 0 && <><span>·</span><span>{r.streak_days}🔥</span></>}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-display font-bold text-amber-500">
                    {Number(r.total_xp || 0).toLocaleString("it-IT")}
                  </p>
                  <p className="text-[9px] text-muted-foreground">XP</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* La tua posizione (se fuori dai 50) */}
      {me && !rows.find((r: any) => r.user_id === user?.id) && (
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
            #{me.global_rank || "—"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground">Tu</p>
            <p className="text-[10px] text-muted-foreground">Lv.{me.level || 1} · {me.total_xp || 0} XP</p>
          </div>
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
        </div>
      )}
    </div>
  );
}
