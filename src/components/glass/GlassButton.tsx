import * as React from "react";
import { cn } from "@/lib/utils";

export type GlassButtonVariant = "primary" | "ghost" | "chip" | "icon";
export type GlassButtonSize = "sm" | "md" | "lg";

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  /** rende il bottone a piena larghezza */
  block?: boolean;
  /** stato di caricamento: mostra spinner, blocca i click, aria-busy */
  loading?: boolean;
  /** testo mostrato durante il loading (default: children) */
  loadingText?: React.ReactNode;
  /** icona a sinistra (sostituita dallo spinner in loading) */
  icon?: React.ReactNode;
}

const VARIANT_CLASS: Record<GlassButtonVariant, string> = {
  primary: "pglass-btn",
  ghost: "pglass-btn-ghost",
  chip: "pglass-chip",
  icon: "pglass-icon-btn",
};

const SIZE_CLASS: Record<GlassButtonSize, string> = {
  sm: "min-h-[40px] px-4 text-xs",
  md: "min-h-[48px] px-6 text-sm",
  lg: "min-h-[54px] px-8 text-base",
};

/**
 * GlassButton — CTA e azioni in stile Empire Liquid Glass.
 * Stati completi: hover, active, disabled, loading, focus-visible.
 * Touch target minimo 44px (48px default) come da standard mobile-first.
 */
const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      block,
      loading = false,
      loadingText,
      icon,
      disabled,
      type = "button",
      children,
      ...props
    },
    ref,
  ) => {
    const isBlocked = Boolean(disabled) || loading;
    return (
      <button
        ref={ref}
        type={type}
        disabled={isBlocked}
        aria-disabled={isBlocked || undefined}
        aria-busy={loading || undefined}
        data-loading={loading ? "true" : undefined}
        data-state={loading ? "loading" : isBlocked ? "disabled" : "idle"}
        className={cn(
          "pglass-press inline-flex items-center justify-center gap-2 font-semibold tracking-tight",
          "disabled:cursor-not-allowed",
          VARIANT_CLASS[variant],
          variant === "icon" ? "min-h-[44px] min-w-[44px]" : SIZE_CLASS[size],
          block && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="pglass-spinner" aria-hidden="true" />
        ) : icon ? (
          <span className="inline-flex shrink-0 items-center" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {loading && loadingText ? loadingText : children}
      </button>
    );
  },
);
GlassButton.displayName = "GlassButton";

export default GlassButton;
export { GlassButton };
