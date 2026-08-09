import empireLogoAsset from "@/assets/empire-logo.jpeg.asset.json";

/**
 * Single source of truth per l'identità visiva Empire AI.
 * Modifica qui e propaga a navbar, footer, splash, 404 e ovunque.
 */
export const EMPIRE_BRAND = {
  name: "Empire",
  suffix: ".AI",
  tagline: "Autonomous AI",
  logoUrl: empireLogoAsset.url,
  colors: {
    deep: "#0a0a1a",
    emerald: "#141432",
    gold: "#6366f1",
    cream: "#F4F4FB",
  },
} as const;

export type EmpireLogoSize = "sm" | "md" | "lg" | "xl";

const SIZE_PX: Record<EmpireLogoSize, number> = {
  sm: 28,
  md: 40,
  lg: 64,
  xl: 96,
};

/**
 * <EmpireLogo /> — logo ufficiale, sempre identico ovunque.
 */
export function EmpireLogo({
  size = "md",
  rounded = "lg",
  glow = false,
  className = "",
  alt = "Empire AI",
}: {
  size?: EmpireLogoSize | number;
  rounded?: "md" | "lg" | "xl" | "2xl" | "full";
  glow?: boolean;
  className?: string;
  alt?: string;
}) {
  const px = typeof size === "number" ? size : SIZE_PX[size];
  const radiusMap = { md: 8, lg: 12, xl: 16, "2xl": 20, full: 9999 };
  const radius = radiusMap[rounded];
  return (
    <span
      className={`inline-flex overflow-hidden ${className}`}
      style={{
        width: px,
        height: px,
        borderRadius: radius,
        boxShadow: glow
          ? `inset 0 0 0 1px rgba(99,102,241,0.45), 0 8px 28px -10px rgba(99,102,241,0.55)`
          : `inset 0 0 0 1px rgba(99,102,241,0.35)`,
        background: EMPIRE_BRAND.colors.emerald,
      }}
    >
      {/* Crisp vector monogram: the raster wordmark asset became illegible at
          small sizes (nav/footer), so the mark is drawn instead of cropped. */}
      <svg
        viewBox="0 0 48 48"
        role="img"
        aria-label={alt}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id="empire-mark-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={EMPIRE_BRAND.colors.gold} />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" fill={EMPIRE_BRAND.colors.emerald} />
        <g fill="url(#empire-mark-g)">
          <rect x="14" y="13" width="20" height="4.4" rx="2.2" />
          <rect x="14" y="21.8" width="14" height="4.4" rx="2.2" />
          <rect x="14" y="30.6" width="20" height="4.4" rx="2.2" />
        </g>
      </svg>
    </span>
  );
}



/**
 * Wordmark "EMPIRE.AI" con lo split gold sul suffisso.
 */
export function EmpireWordmark({
  size = 18,
  className = "",
  serif = false,
}: {
  size?: number;
  className?: string;
  serif?: boolean;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: serif
          ? "'DM Serif Display', Georgia, serif"
          : "Urbanist, Inter, sans-serif",
        color: EMPIRE_BRAND.colors.cream,
        fontSize: size,
        fontWeight: serif ? 400 : 900,
        letterSpacing: serif ? "0.14em" : "0.02em",
        lineHeight: 1,
      }}
    >
      {EMPIRE_BRAND.name}
      <span style={{ color: EMPIRE_BRAND.colors.gold }}>{EMPIRE_BRAND.suffix}</span>
    </span>
  );
}
