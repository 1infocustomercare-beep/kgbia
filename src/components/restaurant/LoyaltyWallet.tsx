import { motion } from "framer-motion";
import { Wallet, Star, Gift, Trophy, ChevronRight } from "lucide-react";

const LoyaltyWallet = () => {
  const points = 420;
  const nextReward = 500;
  const progress = (points / nextReward) * 100;

  const rewards = [
    { name: "Dessert gratis", points: 200, redeemed: true },
    { name: "Sconto 10%", points: 350, redeemed: true },
    { name: "Antipasto omaggio", points: 500, redeemed: false },
    { name: "Cena per 2 -20%", points: 1000, redeemed: false },
  ];

  return (
    <div className="space-y-4">
      {/* Points card */}
      <motion.div
        className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 via-card to-primary/5 border border-primary/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">Loyalty Wallet</span>
        </div>
        
        <p className="text-4xl font-display font-bold text-gold-gradient">{points}</p>
        <p className="text-xs text-muted-foreground">punti fedeltà</p>

        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Prossimo premio</span>
            <span className="text-primary">{nextReward - points} punti</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <button className="mt-4 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2">
          <Wallet className="w-4 h-4" />
          Aggiungi al Wallet
        </button>
      </motion.div>

      {/* Rewards list */}
      <div>
        <h4 className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2">Premi disponibili</h4>
        <div className="space-y-2">
          {rewards.map((reward, i) => (
            <motion.div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                reward.redeemed ? "bg-primary/5 border border-primary/10" : "bg-card"
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                reward.redeemed ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
              }`}>
                {reward.redeemed ? <Trophy className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{reward.name}</p>
                <p className="text-xs text-muted-foreground">{reward.points} punti</p>
              </div>
              {reward.redeemed ? (
                <span className="text-xs text-primary">✓ Riscattato</span>
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyWallet;
