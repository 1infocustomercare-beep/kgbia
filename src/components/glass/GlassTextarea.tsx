import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  invalid?: boolean;
  loading?: boolean;
  wrapperClassName?: string;
}

/**
 * GlassTextarea — area di testo Empire Liquid Glass con stati completi
 * (hover, focus-within, focus-visible, disabled, readonly, invalid, loading).
 */
const GlassTextarea = React.forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  (
    { className, wrapperClassName, label, error, hint, invalid, loading = false, disabled, readOnly, id, ...props },
    ref,
  ) => {
    const autoId = React.useId();
    const fieldId = id ?? `glass-textarea-${autoId}`;
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
          data-readonly={readOnly ? "true" : undefined}
          data-loading={loading ? "true" : undefined}
          className={cn("pglass-field relative rounded-2xl border px-4 py-2 transition-all duration-300", wrapperClassName)}
          style={{
            background: "hsl(var(--background) / 0.42)",
            backdropFilter: "blur(18px) saturate(140%)",
            WebkitBackdropFilter: "blur(18px) saturate(140%)",
            borderColor: "hsl(var(--pr-aqua) / 0.24)",
            boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.06)",
          }}
        >
          <textarea
            ref={ref}
            id={fieldId}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={isInvalid || undefined}
            aria-busy={loading || undefined}
            aria-describedby={error || hint ? messageId : undefined}
            className={cn(
              "min-h-[112px] w-full resize-y bg-transparent py-2 text-sm text-foreground outline-none",
              "placeholder:text-foreground/45 disabled:cursor-not-allowed",
              className,
            )}
            {...props}
          />
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
GlassTextarea.displayName = "GlassTextarea";

export default GlassTextarea;
export { GlassTextarea };
