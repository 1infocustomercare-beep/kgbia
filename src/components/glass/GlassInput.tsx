import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** icona a sinistra (opzionale) */
  icon?: React.ReactNode;
  /** slot a destra (bottone, contatore, ecc.) */
  trailing?: React.ReactNode;
  wrapperClassName?: string;
  /** label sopra il campo */
  label?: string;
  /** messaggio d'errore: attiva anche lo stato invalid */
  error?: string;
  /** testo di aiuto sotto il campo (mostrato se non c'è error) */
  hint?: string;
  /** forza lo stato invalid senza messaggio */
  invalid?: boolean;
  /** stato di caricamento (validazione async, ricerca in corso) */
  loading?: boolean;
}

/**
 * GlassInput — campo di input Empire Liquid Glass.
 * Stati completi: hover, focus-within, focus-visible, disabled, readonly, invalid, loading.
 * NB: per i form di autenticazione restano obbligatori i campi bianchi ad alto contrasto,
 * quindi qui il vetro è pensato per ricerche/filtri/pannelli della webapp.
 */
const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      className,
      icon,
      trailing,
      wrapperClassName,
      label,
      error,
      hint,
      invalid,
      loading = false,
      disabled,
      readOnly,
      id,
      ...props
    },
    ref,
  ) => {
    const autoId = React.useId();
    const inputId = id ?? `glass-input-${autoId}`;
    const messageId = `${inputId}-msg`;
    const isInvalid = Boolean(error) || Boolean(invalid);

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={inputId} className="pglass-field-label">
            {label}
          </label>
        ) : null}
        <div
          data-invalid={isInvalid ? "true" : undefined}
          data-disabled={disabled ? "true" : undefined}
          data-readonly={readOnly ? "true" : undefined}
          data-loading={loading ? "true" : undefined}
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
            id={inputId}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={isInvalid || undefined}
            aria-busy={loading || undefined}
            aria-describedby={error || hint ? messageId : undefined}
            className={cn(
              "w-full flex-1 bg-transparent py-3 text-sm text-foreground outline-none",
              "placeholder:text-foreground/45",
              "disabled:cursor-not-allowed",
              className,
            )}
            {...props}
          />
          {loading ? (
            <span className="pglass-spinner shrink-0 text-foreground/70" aria-hidden="true" />
          ) : null}
          {trailing ? <span className="shrink-0">{trailing}</span> : null}
        </div>
        {error ? (
          <p id={messageId} className="pglass-field-error" role="alert">
            {error}
          </p>
        ) : hint ? (
          <p id={messageId} className="pglass-field-hint">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
GlassInput.displayName = "GlassInput";

export default GlassInput;
export { GlassInput };
