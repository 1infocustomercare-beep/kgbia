/**
 * PersonalizableBadge
 * ─────────────────────────────────────────────────────────────────────
 * Badge "Esempio personalizzabile" da agganciare a moduli, sezioni o
 * elenchi popolati con seed automatico nella demo. Comunica al lead
 * che i dati sono REALI ma di esempio, modificabili in 1 click.
 *
 * Stile coerente con il sistema design "Luxury Dark Empire" + variante
 * chiara per i siti pubblici.
 */
import { Sparkles, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  label?: string;
  tooltip?: string;
  variant?: "dark" | "light" | "subtle";
  size?: "sm" | "md";
  className?: string;
  /** opzionale: callback per aprire l'editor del modulo */
  onEdit?: () => void;
}

const PALETTES = {
  dark: "bg-amber-500/10 text-amber-200 border-amber-500/30 hover:bg-amber-500/15",
  light: "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100",
  subtle: "bg-foreground/5 text-foreground/70 border-foreground/15 hover:bg-foreground/10",
};

const SIZES = {
  sm: "text-[10px] px-1.5 py-0.5 gap-1",
  md: "text-[11px] px-2 py-1 gap-1.5",
};

export function PersonalizableBadge({
  label = "Esempio personalizzabile",
  tooltip = "Dati di esempio realistici per il tuo settore. Modificabili in 1 click dal pannello.",
  variant = "dark",
  size = "sm",
  className,
  onEdit,
}: Props) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium leading-none whitespace-nowrap select-none",
        PALETTES[variant],
        SIZES[size],
        onEdit && "cursor-pointer",
        className,
      )}
      onClick={onEdit}
      role={onEdit ? "button" : undefined}
      tabIndex={onEdit ? 0 : undefined}
    >
      <Sparkles className="w-3 h-3 shrink-0" />
      <span>{label}</span>
      {onEdit && <Pencil className="w-2.5 h-2.5 shrink-0 opacity-70" />}
    </span>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-[260px] text-xs leading-snug">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default PersonalizableBadge;
