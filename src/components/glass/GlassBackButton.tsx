import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface GlassBackButtonProps {
  /** etichetta mostrata accanto alla freccia */
  label?: string;
  /** rotta di destinazione; se assente usa history back con fallback su "/" */
  to?: string;
  /** `floating` = pillola fissa in alto a sinistra, `inline` = dentro il flusso, `bar` = barra sticky con titolo */
  variant?: "floating" | "inline" | "bar";
  /** titolo mostrato accanto al bottone nella variante `bar` */
  title?: string;
  className?: string;
}

/**
 * GlassBackButton — unico controllo "Indietro" della webapp Empire.
 * Stile Liquid Glass, touch target 44px, stati hover/active/focus-visible coerenti.
 */
export default function GlassBackButton({
  label = "Indietro",
  to,
  variant = "floating",
  title,
  className,
}: GlassBackButtonProps) {
  const navigate = useNavigate();

  const goBack = React.useCallback(() => {
    if (to) {
      navigate(to);
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  }, [navigate, to]);

  const button = (
    <button
      type="button"
      onClick={goBack}
      aria-label={`Torna indietro${title ? ` da ${title}` : ""}`}
      className={cn(
        "pglass-btn-ghost pglass-press inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm font-semibold",
        variant === "floating" && "shadow-lg",
        variant !== "bar" && className,
      )}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );

  if (variant === "bar") {
    return (
      <div className={cn("pglass-stickybar sticky top-0 z-40 flex items-center gap-3 px-4 py-3", className)}>
        {button}
        {title ? <span className="truncate text-sm font-semibold text-foreground/85">{title}</span> : null}
      </div>
    );
  }

  if (variant === "floating") {
    return <div className="fixed left-4 top-4 z-50 md:left-6 md:top-6">{button}</div>;
  }

  return button;
}

export { GlassBackButton };
