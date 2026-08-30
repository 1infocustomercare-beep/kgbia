/**
 * DesktopBrowserFrame — cornice browser desktop (macOS-like) per mostrare
 * la stessa webapp in versione desktop accanto al mockup iPhone.
 *
 * Additivo: nessun impatto sui componenti esistenti.
 */
import type { CSSProperties } from "react";

interface Props {
  src: string;
  alt: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  /** true quando `src` è già uno screenshot desktop nativo (nessun ritaglio) */
  native?: boolean;
}

export default function DesktopBrowserFrame({ src, alt, label, className = "", style, onClick, native = false }: Props) {

  return (
    <div
      className={`overflow-hidden rounded-xl border border-[hsl(var(--pr-gold-light)/0.14)] bg-[hsl(var(--pr-emerald-deep))] shadow-2xl ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={style}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* barra finestra */}
      <div className="flex items-center gap-2 border-b border-[hsl(var(--pr-gold-light)/0.1)] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--pr-gold)/0.55)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--pr-gold-light)/0.22)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--pr-gold-light)/0.22)]" />
        <span
          className="ml-2 truncate rounded-md px-2 py-0.5 text-[10px] tracking-wide"
          style={{
            background: "hsl(var(--pr-gold-light) / 0.06)",
            color: "hsl(var(--pr-gold-light) / 0.6)",
          }}
        >
          {label ?? "empire-ia.app"}
        </span>
      </div>
      <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-[1.55] object-cover object-top"
        />
      </div>
    </div>
  );
}
