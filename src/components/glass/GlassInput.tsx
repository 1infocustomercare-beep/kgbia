import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** icona a sinistra (opzionale) */
  icon?: React.ReactNode;
  /** slot a destra (bottone, contatore, ecc.) */
  trailing?: React.ReactNode;
  wrapperClassName?: string;
}

/**
 * GlassInput — campo di input Empire Liquid Glass.
 * NB: per i form di autenticazione restano obbligatori i campi bianchi ad alto contrasto,
 * quindi qui il vetro è pensato per ricerche/filtri/pannelli della webapp.
 */
const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, icon, trailing, wrapperClassName, ...props }, ref) => (
    <div
      className={cn(
        "pglass-field relative flex items-center gap-2 rounded-2xl px-4",
        "min-h-[48px] border transition-all duration-300",
        wrapperClassName,
      )}
      style={{
        background: "hsl(var(--background) / 0.42)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        borderColor: "hsl(var(--pr-aqua) / 0.24)",
        boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.06)",
      }}
    >
      {icon ? <span className="shrink-0 text-foreground/55">{icon}</span> : null}
      <input
        ref={ref}
        className={cn(
          "w-full flex-1 bg-transparent py-3 text-sm text-foreground outline-none",
          "placeholder:text-foreground/45",
          className,
        )}
        {...props}
      />
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
    </div>
  ),
);
GlassInput.displayName = "GlassInput";

export default GlassInput;
export { GlassInput };
