/**
 * IPhoneProMaxFrame — single, unified iPhone 15 Pro Max frame.
 *
 * RULES (per user request):
 * - Only ONE iPhone frame ever. Never render a phone image inside another phone.
 * - The `screen` prop is the raw webapp screenshot / mockup PNG. It is placed
 *   flush inside the display area with the correct rounded corners.
 * - Dynamic Island rendered as a real overlay pill.
 * - Scales fluidly to its container width; keeps the true 19.5:9 aspect ratio.
 *
 * Additive only — does not replace existing frames until callers migrate.
 */

import type { CSSProperties } from "react";

type IPhoneProMaxFrameProps = {
  src: string;
  alt: string;
  /** Container width in px. Height is derived from the true device aspect. */
  width?: number;
  /** Extra classes for the outer wrapper */
  className?: string;
  /** Show a soft glow under the phone (looks great on dark bg) */
  glow?: boolean;
  /** `eager` for above-the-fold, `lazy` otherwise */
  loading?: "eager" | "lazy";
  /** Optional onClick — used by lightbox triggers */
  onClick?: () => void;
  style?: CSSProperties;
};

// Real iPhone 15 Pro Max: 77 × 159.9 mm → aspect 0.4816 (≈ 9 : 19.5)
const ASPECT = 19.5 / 9;

export default function IPhoneProMaxFrame({
  src,
  alt,
  width = 300,
  className = "",
  glow = true,
  loading = "lazy",
  onClick,
  style,
}: IPhoneProMaxFrameProps) {
  const height = Math.round(width * ASPECT);
  // Bezel thickness scales with width (real device ≈ 2.5 mm on 77 mm → ~3.2%).
  const bezel = Math.max(6, Math.round(width * 0.036));
  const outerRadius = Math.round(width * 0.155); // ≈ 55px on 355 wide
  const innerRadius = Math.max(6, outerRadius - Math.round(bezel * 0.5));
  const islandW = Math.round(width * 0.33);
  const islandH = Math.round(width * 0.085);
  const islandTop = Math.round(bezel + width * 0.02);

  const clickable = Boolean(onClick);

  return (
    <div
      className={`relative select-none ${clickable ? "cursor-zoom-in" : ""} ${className}`}
      style={{ width, height, ...style }}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      aria-label={clickable ? `Apri ${alt} a schermo intero` : undefined}
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: `-${Math.round(height * 0.06)}px`,
            width: `${Math.round(width * 0.85)}px`,
            height: `${Math.round(height * 0.12)}px`,
            background:
              "radial-gradient(ellipse, hsl(var(--primary,262 60% 55%) / 0.55), transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      )}

      {/* Outer titanium bezel */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: outerRadius,
          background:
            "linear-gradient(150deg, #4a4a4c 0%, #1a1a1c 22%, #0a0a0b 48%, #24242a 78%, #3a3a3d 100%)",
          padding: bezel,
          boxShadow:
            "0 40px 120px -40px rgba(0,0,0,0.85), 0 8px 24px -8px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Inner black bezel ring */}
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            borderRadius: innerRadius,
            background: "#000",
            boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.04)",
          }}
        >
          {/* Screen — the webapp render itself */}
          <img
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />

          {/* Dynamic Island */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 z-20"
            style={{
              top: islandTop,
              width: islandW,
              height: islandH,
              background: "#000",
              borderRadius: 9999,
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 0 2px rgba(0,0,0,0.6)",
            }}
          />

          {/* Subtle screen sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0) 78%, rgba(255,255,255,0.06) 100%)",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>
    </div>
  );
}
