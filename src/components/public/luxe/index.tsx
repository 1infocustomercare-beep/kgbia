/**
 * ═══ LUXE UI PRIMITIVES — premium frames & panels for demo sites ═══
 *
 * Reusable "last-generation web-app" chrome: hairline borders, corner
 * brackets, inner glow, subtle grain and glass panels.
 *
 * ADDITIVE ONLY — purely presentational wrappers, no logic.
 * All colours come from design tokens (primary / border / card / background).
 */
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ── Corner brackets: 4 thin L-shaped marks, VIP instrument-panel feel ── */
export function LuxeCorners({ className }: { className?: string }) {
  const base = "absolute h-4 w-4 border-primary/60";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <span className={cn(base, "left-0 top-0 border-l border-t")} />
      <span className={cn(base, "right-0 top-0 border-r border-t")} />
      <span className={cn(base, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(base, "bottom-0 right-0 border-b border-r")} />
    </div>
  );
}

/* ── Fine grain / noise veil to kill flat gradients ── */
export function LuxeGrain({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-overlay"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  /** Show corner brackets */
  corners?: boolean;
  /** Glass blur + translucent surface instead of solid card */
  glass?: boolean;
  /** Top hairline accent line */
  accentLine?: boolean;
  /** Soft outer glow in the primary hue */
  glow?: boolean;
};

/**
 * Premium surface: hairline border, optional glass, inner top highlight,
 * corner brackets and grain. The workhorse for all demo-site sections.
 */
export const LuxePanel = forwardRef<HTMLDivElement, PanelProps>(function LuxePanel(
  { children, className, corners = true, glass = false, accentLine = true, glow = false, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      {...rest}
      className={cn(
        "relative isolate overflow-hidden border border-border/60",
        glass ? "bg-background/45 backdrop-blur-2xl" : "bg-card/85",
        glow && "shadow-[0_28px_90px_-48px_hsl(var(--primary)/0.55)]",
        className,
      )}
    >
      {/* inner top highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent"
        style={{ opacity: accentLine ? 1 : 0 }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-20%,hsl(var(--primary)/0.10),transparent_60%)]"
      />
      <LuxeGrain opacity={0.04} />
      {corners && <LuxeCorners className="m-2" />}
      <div className="relative z-10">{children}</div>
    </div>
  );
});

/** Small uppercase label chip — "VIP instrument" tag. */
export function LuxeTag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border border-primary/45 bg-background/50 px-3 py-1.5",
        "text-[10px] font-semibold uppercase tracking-[0.26em] text-primary backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Hairline rule with a centred diamond marker. */
export function LuxeDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative my-10 h-px w-full bg-border/60", className)}>
      <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-primary" />
    </div>
  );
}

/** Data cell used in stat strips (fleet, KPI, service numbers). */
export function LuxeStat({
  value,
  label,
  className,
}: {
  value: ReactNode;
  label: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative px-5 py-7 text-center sm:px-7", className)}>
      <p className="font-heading text-3xl font-semibold leading-none sm:text-4xl">{value}</p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
    </div>
  );
}

/**
 * Full-bleed section shell with hairline framing — gives every demo site the
 * same "designed instrument" rhythm without touching its content.
 */
export function LuxeSection({
  children,
  className,
  framed = true,
  ...rest
}: HTMLAttributes<HTMLElement> & { framed?: boolean }) {
  return (
    <section {...rest} className={cn("relative", framed && "border-y border-border/50", className)}>
      {children}
    </section>
  );
}
