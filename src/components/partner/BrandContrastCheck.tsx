/**
 * BrandContrastCheck — Indicatore WCAG live per il colore brand.
 *
 * Mostra in tempo reale:
 *  • contrasto del brand su SFONDO SCURO (#0A0A0A — tipico hero/background app)
 *  • contrasto del brand su SUPERFICIE CHIARA (#FFFFFF — tipico card/modal)
 *  • contrasto del FOREGROUND CTA (testo bianco/nero auto-scelto) sopra il brand
 *
 * Se uno dei valori non passa AA (4.5:1) suggerisce un colore alternativo
 * con la stessa tonalità ma luminosità corretta (un click per applicarlo).
 */
import { useMemo } from "react";
import { CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import {
  bestForegroundOn,
  evaluateContrast,
  suggestAccessibleBrand,
  wcagBadgeLabel,
  type ContrastEvaluation,
} from "@/lib/wcag-contrast";

interface Props {
  /** Colore brand corrente (hex #RRGGBB) */
  brandHex: string;
  /** Callback quando l'utente applica il suggerimento */
  onApplySuggestion?: (hex: string) => void;
  /** Sfondo "dark" di riferimento (default Empire luxury #0A0A0A) */
  darkSurface?: string;
  /** Sfondo "light" di riferimento (default white) */
  lightSurface?: string;
}

interface Row {
  label: string;
  fg: string;
  bg: string;
  result: ContrastEvaluation;
}

const levelColor = (r: ContrastEvaluation) => {
  if (r.passesAAA) return "text-emerald-500";
  if (r.passesAA) return "text-emerald-400";
  if (r.passesAALarge) return "text-amber-500";
  return "text-red-500";
};

export function BrandContrastCheck({
  brandHex,
  onApplySuggestion,
  darkSurface = "#0A0A0A",
  lightSurface = "#FFFFFF",
}: Props) {
  const ctaForeground = useMemo(() => bestForegroundOn(brandHex), [brandHex]);

  const rows: Row[] = useMemo(
    () => [
      {
        label: "Brand su sfondo scuro",
        fg: brandHex,
        bg: darkSurface,
        result: evaluateContrast(brandHex, darkSurface),
      },
      {
        label: "Brand su superficie chiara",
        fg: brandHex,
        bg: lightSurface,
        result: evaluateContrast(brandHex, lightSurface),
      },
      {
        label: "Testo CTA sopra brand",
        fg: ctaForeground,
        bg: brandHex,
        result: evaluateContrast(ctaForeground, brandHex),
      },
    ],
    [brandHex, ctaForeground, darkSurface, lightSurface]
  );

  // Worst row determines whether we propose a fix.
  const worst = rows.reduce((acc, r) => (r.result.ratio < acc.result.ratio ? r : acc), rows[0]);
  const needsFix = !worst.result.passesAA;

  // Auto-suggest using the dark surface as primary canvas (admin/preview luxury dark).
  const suggestion = useMemo(
    () => (needsFix ? suggestAccessibleBrand(brandHex, darkSurface, 4.5) : null),
    [needsFix, brandHex, darkSurface]
  );

  return (
    <div className="rounded-xl border bg-muted/30 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {needsFix ? (
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          )}
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
            Leggibilità WCAG
          </span>
        </div>
        <span
          className={`text-[10px] font-mono font-semibold ${
            needsFix ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {needsFix ? "Da rivedere" : "OK"}
        </span>
      </div>

      <ul className="space-y-1">
        {rows.map((r, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-2 text-[11px] py-1 px-2 rounded-md bg-background/50 border border-border/40"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="inline-block w-5 h-5 rounded border border-border/60 shrink-0"
                style={{
                  background: r.bg,
                  boxShadow: `inset 0 0 0 6px ${r.fg}`,
                }}
                title={`fg ${r.fg} · bg ${r.bg}`}
              />
              <span className="truncate text-foreground/90">{r.label}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`font-mono font-bold ${levelColor(r.result)}`}>
                {r.result.ratio.toFixed(2)}:1
              </span>
              <span
                className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  r.result.passesAA
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : r.result.passesAALarge
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-red-500/15 text-red-600 dark:text-red-400"
                }`}
              >
                {wcagBadgeLabel(r.result.level)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {needsFix && suggestion && suggestion.adjusted && (
        <button
          type="button"
          onClick={() => onApplySuggestion?.(suggestion.hex)}
          className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 transition-colors group"
          title="Applica una variante del brand color che supera WCAG AA (4.5:1)"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-[11px] text-foreground/90 truncate">
              Suggerimento: usa{" "}
              <span className="font-mono font-bold">{suggestion.hex.toUpperCase()}</span>{" "}
              <span className="text-muted-foreground">
                ({suggestion.ratio.toFixed(2)}:1)
              </span>
            </span>
          </div>
          <span
            className="inline-block w-5 h-5 rounded-full border-2 border-amber-500/60 shrink-0 group-hover:scale-110 transition-transform"
            style={{ background: suggestion.hex }}
          />
        </button>
      )}
    </div>
  );
}
