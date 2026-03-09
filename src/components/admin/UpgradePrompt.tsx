import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import type { PlanConfig, FeatureKey } from "@/lib/subscription-plans";
import { FEATURE_LABELS } from "@/lib/subscription-plans";

interface UpgradePromptProps {
  feature: FeatureKey;
  requiredPlan: PlanConfig;
  onUpgrade?: () => void;
}

export default function UpgradePrompt({ feature, requiredPlan, onUpgrade }: UpgradePromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center space-y-3"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Lock className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-sm font-bold text-foreground">
        {FEATURE_LABELS[feature]} — Piano {requiredPlan.name}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Questa funzione è disponibile dal piano <strong>{requiredPlan.name}</strong> (€{requiredPlan.price}/mese).
        Passa a un piano superiore per sbloccarla.
      </p>
      {onUpgrade && (
        <motion.button
          onClick={onUpgrade}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold min-h-[44px]"
          whileTap={{ scale: 0.97 }}
        >
          <Sparkles className="w-4 h-4" />
          Upgrade a {requiredPlan.name}
        </motion.button>
      )}
    </motion.div>
  );
}
