import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type RevealVariant = "fade-up" | "fade" | "scale" | "slide-left" | "slide-right";

export interface RevealCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Animation style. Default "fade-up". */
  variant?: RevealVariant;
  /** Stagger index — multiplies a small base delay so siblings cascade. */
  index?: number;
  /** Override the per-step delay in ms (default 90). */
  stepDelayMs?: number;
  /** Re-trigger every time it enters/leaves (default false). */
  repeat?: boolean;
  /** IntersectionObserver threshold (default 0.15). */
  threshold?: number;
  /** Render as a different element. Default "div". */
  as?: keyof JSX.IntrinsicElements;
}

const VARIANT_HIDDEN: Record<RevealVariant, string> = {
  "fade-up":     "opacity-0 translate-y-6",
  "fade":        "opacity-0",
  "scale":       "opacity-0 scale-95",
  "slide-left":  "opacity-0 -translate-x-6",
  "slide-right": "opacity-0 translate-x-6",
};

const VARIANT_VISIBLE = "opacity-100 translate-x-0 translate-y-0 scale-100";

/**
 * RevealCard — wraps any content (KPI, card, section) and animates it in
 * when it scrolls into view. Cascades when used in a list via `index`.
 * Automatically disables animation under `prefers-reduced-motion`.
 */
export const RevealCard = forwardRef<HTMLDivElement, RevealCardProps>(
  ({ children, variant = "fade-up", index = 0, stepDelayMs = 90, repeat = false,
     threshold = 0.15, as = "div", className, style, ...rest }, _ref) => {
    const { ref, isRevealed } = useScrollReveal<HTMLDivElement>({
      once: !repeat,
      threshold,
      delay: index * stepDelayMs,
    });

    const Tag = as as React.ElementType;
    return (
      <Tag
        ref={ref}
        data-revealed={isRevealed ? "true" : "false"}
        className={cn(
          "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none",
          isRevealed ? VARIANT_VISIBLE : VARIANT_HIDDEN[variant],
          className
        )}
        style={style}
        {...rest}
      >
        {children}
      </Tag>
    );
  }
);
RevealCard.displayName = "RevealCard";
