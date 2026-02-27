import { motion } from "framer-motion";

interface Props {
  salesCount: number;
  milestone: number;
  label: string;
  reward: string;
  unlocked: boolean;
}

const BonusProgressRing = ({ salesCount, milestone, label, reward, unlocked }: Props) => {
  const progress = Math.min(salesCount / milestone, 1);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={unlocked ? "hsl(142 71% 45%)" : "hsl(var(--primary))"}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {unlocked ? (
            <span className="text-lg">✓</span>
          ) : (
            <>
              <span className="text-lg font-display font-bold text-foreground">{salesCount}</span>
              <span className="text-[9px] text-muted-foreground">/ {milestone}</span>
            </>
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold text-foreground">{label}</p>
        <p className="text-[9px] text-primary font-semibold">{reward}</p>
      </div>
    </div>
  );
};

export default BonusProgressRing;
