import * as React from "react";
import { cn } from "@/lib/utils";

export type GlassCardVariant = "default" | "soft" | "panel";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `default` = vetro pieno Empire, `soft` = vetro leggero, `panel` = superficie contenuti densi */
  variant?: GlassCardVariant;
  /** hover lift + glow aqua */
  lift?: boolean;
  /** reveal morbido all'ingresso in viewport */
  reveal?: boolean;
  asChild?: never;
}

const VARIANT_CLASS: Record<GlassCardVariant, string> = {
  default: "pglass",
  soft: "pglass-soft",
  panel: "pglass-soft partner-text-surface",
};

/**
 * GlassCard — superficie "Liquid Glass Empire" riusabile.
 * Usa le utility globali definite in PrestigeGlassSkin (pglass / pglass-soft / pglass-lift).
 */
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", lift = true, reveal = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        VARIANT_CLASS[variant],
        lift && "pglass-lift",
        reveal && "pglass-reveal",
        "text-foreground",
        className,
      )}
      {...props}
    />
  ),
);
GlassCard.displayName = "GlassCard";

export default GlassCard;
export { GlassCard };
