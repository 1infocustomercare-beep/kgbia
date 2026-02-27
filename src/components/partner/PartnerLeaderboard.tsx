import { motion } from "framer-motion";
import { Trophy, Crown, Medal, TrendingUp } from "lucide-react";

// Demo leaderboard data for psychological motivation
const leaderboardData = [
  { rank: 1, name: "Alessandro V.", sales: 12, earnings: "€11.964", badge: "👑" },
  { rank: 2, name: "Martina C.", sales: 9, earnings: "€8.973", badge: "🥈" },
  { rank: 3, name: "Luca D.", sales: 7, earnings: "€6.979", badge: "🥉" },
  { rank: 4, name: "Chiara B.", sales: 5, earnings: "€4.985", badge: "" },
  { rank: 5, name: "Marco F.", sales: 4, earnings: "€3.988", badge: "" },
];

interface Props {
  currentUserSales: number;
}

const PartnerLeaderboard = ({ currentUserSales }: Props) => {
  // Find where the current user would rank
  const userRank = leaderboardData.filter(p => p.sales > currentUserSales).length + 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" /> Leaderboard Partner
        </h3>
        <span className="text-[10px] text-muted-foreground">Questo mese</span>
      </div>

      <div className="space-y-2">
        {leaderboardData.map((partner, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              i === 0
                ? "bg-gradient-to-r from-primary/10 to-amber-500/10 border-primary/30"
                : "bg-card border-border/50"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
              i === 0 ? "bg-primary text-primary-foreground" :
              i === 1 ? "bg-muted text-foreground" :
              i === 2 ? "bg-amber-800/30 text-amber-400" :
              "bg-muted/50 text-muted-foreground"
            }`}>
              {partner.badge || partner.rank}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{partner.name}</p>
              <p className="text-[10px] text-muted-foreground">{partner.sales} vendite</p>
            </div>
            <span className="text-xs font-display font-bold text-primary">{partner.earnings}</span>
          </motion.div>
        ))}
      </div>

      {/* Your position */}
      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
          {userRank > 5 ? `#${userRank}` : `#${userRank}`}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-foreground">Tu</p>
          <p className="text-[10px] text-muted-foreground">{currentUserSales} vendite</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-primary font-semibold">
          <TrendingUp className="w-3 h-3" />
          {currentUserSales < leaderboardData[leaderboardData.length - 1].sales
            ? `${leaderboardData[leaderboardData.length - 1].sales - currentUserSales + 1} per Top 5`
            : "In classifica!"}
        </div>
      </div>
    </div>
  );
};

export default PartnerLeaderboard;
