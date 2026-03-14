import { motion } from "framer-motion";
import { Lock, Sparkles, ArrowRight, Crown, Zap } from "lucide-react";
import type { PlanConfig, FeatureKey } from "@/lib/subscription-plans";
import { FEATURE_LABELS } from "@/lib/subscription-plans";

interface UpgradePromptProps {
  feature: FeatureKey;
  requiredPlan: PlanConfig;
  onUpgrade?: () => void;
}

const PLAN_ICON: Record<string, typeof Zap> = {
  Essential: Zap,
  "Smart IA": Sparkles,
  "Empire Pro": Crown,
};

const PLAN_GRADIENT: Record<string, string> = {
  Essential: "from-blue-500 to-blue-600",
  "Smart IA": "from-primary to-accent",
  "Empire Pro": "from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))]",
};

export default function UpgradePrompt({ feature, requiredPlan, onUpgrade }: UpgradePromptProps) {
  const Icon = PLAN_ICON[requiredPlan.name] || Sparkles;
  const gradient = PLAN_GRADIENT[requiredPlan.name] || "from-primary to-accent";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card/60 to-accent/[0.02] p-6 text-center space-y-4 overflow-hidden"
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient}`} />

      {/* Animated glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsla(265,70%,60%,0.06),transparent_70%)] pointer-events-none" />

      {/* Lock icon with pulse */}
      <div className="relative mx-auto">
        <motion.div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto shadow-lg`}
          animate={{ boxShadow: ["0 4px 20px hsla(265,70%,60%,0.15)", "0 4px 30px hsla(265,70%,60%,0.3)", "0 4px 20px hsla(265,70%,60%,0.15)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Lock className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-foreground">
          {FEATURE_LABELS[feature]}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xs mx-auto">
          Questa funzionalità è disponibile con il piano{" "}
          <span className="font-semibold text-foreground">{requiredPlan.name}</span>.
          Sblocca tutto il potenziale della tua attività.
        </p>
      </div>

      {/* Plan preview */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/30 border border-border/30">
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-bold">{requiredPlan.name}</span>
        <span className="text-sm text-muted-foreground">€{requiredPlan.price}/mese</span>
      </div>

      {/* CTA */}
      {onUpgrade && (
        <motion.button
          onClick={onUpgrade}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-bold min-h-[48px] shadow-lg`}
          whileHover={{ scale: 1.03, boxShadow: "0 10px 30px hsla(265,70%,60%,0.25)" }}
          whileTap={{ scale: 0.97 }}
        >
          <Sparkles className="w-4 h-4" />
          Upgrade a {requiredPlan.name}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
}
