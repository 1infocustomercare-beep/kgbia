/**
 * IPadProFrame — cornice iPad Pro 13" realistica (additiva).
 *
 * REGOLE (come per IPhoneProMaxFrame):
 * - Una sola cornice: mai un tablet dentro un altro device.
 * - Lo screenshot riempie ESATTAMENTE l'area display, con raggi corretti.
 * - Aspect reale iPad Pro 13": 4 / 3 (landscape) · 3 / 4 (portrait).
 * - Nessuno zoom arbitrario: `object-cover` centrato, così l'immagine
 *   "entra bene dentro" senza tagli strani.
 */
import type { CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  orientation?: "landscape" | "portrait";
  /** Sorgente già desktop nativa: allinea in alto (le UI web partono da sopra) */
  native?: boolean;
  className?: string;
  style?: CSSProperties;
  glow?: boolean;
  onClick?: () => void;
  loading?: "eager" | "lazy";
};

export default function IPadProFrame({
  src,
  alt,
  orientation = "landscape",
  native = false,
  className = "",
  style,
  glow = true,
  onClick,
  loading = "lazy",
}: Props) {
  const landscape = orientation === "landscape";
  const clickable = Boolean(onClick);

  return (
    <div
      className={`relative w-full select-none ${clickable ? "cursor-zoom-in" : ""} ${className}`}
      style={style}
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
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 -bottom-5 h-10 rounded-full"
          style={{
            background: "radial-gradient(ellipse, hsl(var(--acc, var(--pr-aqua)) / 0.5), transparent 70%)",
            filter: "blur(26px)",
          }}
        />
      )}

      {/* Scocca alluminio */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: landscape ? "4 / 3" : "3 / 4",
          borderRadius: landscape ? "clamp(18px, 3.2%, 34px)" : "clamp(18px, 4.2%, 34px)",
          padding: "3.1%",
          background:
            "linear-gradient(145deg, #5b6066 0%, #23262b 20%, #0c0d10 50%, #2a2e34 80%, #4a4f56 100%)",
          boxShadow:
            "0 40px 110px -50px rgba(0,0,0,0.85), 0 10px 26px -14px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.07)",
        }}
      >
        {/* Bezel nero + display */}
        <div
          className="relative h-full w-full overflow-hidden bg-black"
          style={{
            borderRadius: landscape ? "clamp(10px, 2%, 22px)" : "clamp(10px, 2.6%, 22px)",
            boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.05)",
          }}
        >
          <img
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            draggable={false}
            className={`absolute inset-0 h-full w-full object-cover ${native ? "object-top" : "object-center"}`}
          />

          {/* Sheen vetro */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 26%, rgba(255,255,255,0) 74%, rgba(255,255,255,0.07) 100%)",
              mixBlendMode: "screen",
            }}
          />
        </div>

        {/* Fotocamera frontale (lato lungo su landscape) */}
        <div
          aria-hidden
          className="absolute rounded-full"
          style={
            landscape
              ? { top: "50%", left: "1.1%", width: 6, height: 6, transform: "translateY(-50%)", background: "#0b0b0d", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }
              : { left: "50%", top: "1.1%", width: 6, height: 6, transform: "translateX(-50%)", background: "#0b0b0d", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }
          }
        />
      </div>
    </div>
  );
}
