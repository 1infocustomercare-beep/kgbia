import { cn } from "@/lib/utils";

/**
 * Skeleton — variante "glass" coerente con la skin Liquid Glass Empire.
 * Usa lo shimmer aqua definito in PrestigeGlassSkin (.pglass-skeleton).
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pglass-skeleton", className)} {...props} />;
}

export { Skeleton };
