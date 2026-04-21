import { cn } from "@/lib/utils";

/**
 * Partner shared design tokens — composable className helpers for cards
 * and sections used across every Partner page (Home, Leads, Portfolio,
 * Earnings, Sandbox…).
 *
 * The actual styles live in `src/index.css` under the `.partner-card*`
 * and `.partner-section*` selectors. This module just gives a typed,
 * autocomplete-friendly API:
 *
 *   <div className={partnerCard({ padding: "lg", depth: 2, hover: "glow", interactive: true })}>
 *
 * which expands to:
 *
 *   "partner-card partner-card--padded-lg partner-card--depth-2
 *    partner-card--lift partner-card--glow partner-card--interactive"
 */

export type PartnerCardPadding = "none" | "sm" | "md" | "lg";
export type PartnerCardBorder = "default" | "bordered" | "accent" | "ghost";
export type PartnerCardDepth = 0 | 1 | 2 | 3;
export type PartnerCardHover = "none" | "lift" | "lift-lg" | "glow" | "lift-glow";

export interface PartnerCardOptions {
  padding?: PartnerCardPadding;
  border?: PartnerCardBorder;
  depth?: PartnerCardDepth;
  hover?: PartnerCardHover;
  interactive?: boolean;
  /** Disable transitions/hover entirely. */
  static?: boolean;
  className?: string;
}

const PADDING: Record<PartnerCardPadding, string> = {
  none: "",
  sm: "partner-card--padded-sm",
  md: "partner-card--padded",
  lg: "partner-card--padded-lg",
};

const BORDER: Record<PartnerCardBorder, string> = {
  default: "",
  bordered: "partner-card--bordered",
  accent: "partner-card--accent",
  ghost: "partner-card--ghost",
};

const DEPTH: Record<PartnerCardDepth, string> = {
  0: "",
  1: "partner-card--depth-1",
  2: "partner-card--depth-2",
  3: "partner-card--depth-3",
};

const HOVER: Record<PartnerCardHover, string> = {
  none: "",
  lift: "partner-card--lift",
  "lift-lg": "partner-card--lift-lg",
  glow: "partner-card--glow",
  "lift-glow": "partner-card--lift partner-card--glow",
};

export function partnerCard(opts: PartnerCardOptions = {}): string {
  const {
    padding = "md",
    border = "default",
    depth = 1,
    hover = "lift",
    interactive = false,
    static: isStatic = false,
    className,
  } = opts;

  return cn(
    "partner-card",
    PADDING[padding],
    BORDER[border],
    DEPTH[depth],
    isStatic ? "partner-card--static" : HOVER[hover],
    interactive && "partner-card--interactive",
    className
  );
}

export type PartnerSectionSpacing = "first" | "tight" | "cozy" | "roomy" | "spacious";

export interface PartnerSectionOptions {
  spacing?: PartnerSectionSpacing;
  className?: string;
}

const SPACING: Record<PartnerSectionSpacing, string> = {
  first: "",
  tight: "partner-section--tight",
  cozy: "partner-section--cozy",
  roomy: "partner-section--roomy",
  spacious: "partner-section--spacious",
};

export function partnerSection(opts: PartnerSectionOptions = {}): string {
  const { spacing = "cozy", className } = opts;
  return cn("partner-section", SPACING[spacing], className);
}

export type PartnerGridDensity = "tight" | "default" | "wide";

export function partnerGrid(density: PartnerGridDensity = "default", className?: string): string {
  return cn(
    "partner-grid",
    density === "tight" && "partner-grid--tight",
    density === "wide" && "partner-grid--wide",
    className
  );
}

/** Title of a partner section (uppercase muted label). */
export function partnerSectionTitle(className?: string): string {
  return cn("partner-section-title", className);
}
