import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  invalid?: boolean;
  loading?: boolean;
  wrapperClassName?: string;
}

/**
 * GlassSelect — select nativa con superficie Empire Liquid Glass e stati completi
 * (hover, focus-within, focus-visible, disabled, invalid, loading).
 */
const GlassSelect = React.forwardRef<HTMLSelectElement, GlassSelectProps>(
  (
    { className, wrapperClassName, label, error, hint, invalid, loading = false, disabled, id, children, ...props },
    ref,
  ) => {
    const autoId = React.useId();
    const fieldId = id ?? `glass-select-${autoId}`;
    const messageId = `${fieldId}-msg`;
    const isInvalid = Boolean(error) || Boolean(invalid);

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={fieldId} className="pglass-field-label">
            {label}
          </label>
        ) : null}
        <div
          data-invalid={isInvalid ? "true" : undefined}
          data-disabled={disabled ? "true" : undefined}
          data-loading={loading ? "true" : undefined}
          className={cn(
            "pglass-field relative flex items-center gap-2 rounded-2xl border px-4",
            "min-h-[48px] transition-all duration-300",
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
          <select
            ref={ref}
            id={fieldId}
            disabled={disabled || loading}
            aria-invalid={isInvalid || undefined}
            aria-busy={loading || undefined}
            aria-describedby={error || hint ? messageId : undefined}
            className={cn(
              "w-full flex-1 appearance-none bg-transparent py-3 pr-6 text-sm text-foreground outline-none",
              "disabled:cursor-not-allowed",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          {loading ? (
            <span className="pglass-spinner shrink-0 text-foreground/70" aria-hidden="true" />
          ) : (
            <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 shrink-0 text-foreground/55" aria-hidden="true" />
          )}
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
GlassSelect.displayName = "GlassSelect";

export default GlassSelect;
export { GlassSelect };
