/**
 * AureliaLivePhone — telaio iPhone 17 Pro Max che ospita CONTENUTO VIVO
 * (non un'immagine). Serve a mostrare la webapp mobile reale, navigabile,
 * esattamente come appare nei mockup del portfolio.
 *
 * Additivo: non sostituisce IPhoneProMaxFrame (che resta per le immagini).
 * Regola rispettata: un solo iPhone, nessun telefono dentro un altro telefono.
 */

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Larghezza del telaio in px (default 390 = viewport reale iPhone Pro Max) */
  width?: number;
  /** Altezza logica dello schermo */
  screenHeight?: number;
  className?: string;
  glow?: boolean;
};

export default function AureliaLivePhone({
  children,
  width = 390,
  screenHeight = 844,
  className = "",
  glow = true,
}: Props) {
  const bezel = Math.max(8, Math.round(width * 0.032));
  const outerRadius = Math.round(width * 0.155);
  const innerRadius = Math.max(8, outerRadius - Math.round(bezel * 0.5));
  const islandW = Math.round(width * 0.3);
  const islandH = Math.round(width * 0.075);

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width: width + bezel * 2, height: screenHeight + bezel * 2 }}
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: -40,
            width: Math.round(width * 0.9),
            height: 110,
            background: "radial-gradient(ellipse, hsl(var(--primary) / 0.45), transparent 70%)",
            filter: "blur(38px)",
          }}
        />
      )}

      {/* telaio titanio */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: outerRadius,
          background:
            "linear-gradient(150deg, #4a4a4c 0%, #1a1a1c 22%, #0a0a0b 48%, #24242a 78%, #3a3a3d 100%)",
          padding: bezel,
          boxShadow:
            "0 50px 140px -45px rgba(0,0,0,0.9), 0 10px 26px -8px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden bg-black"
          style={{ borderRadius: innerRadius }}
        >
          {/* schermo vivo */}
          <div className="absolute inset-0 overflow-hidden">{children}</div>

          {/* Dynamic Island */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2"
            style={{
              top: Math.round(width * 0.028),
              width: islandW,
              height: islandH,
              background: "#000",
              borderRadius: 9999,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 2px rgba(0,0,0,0.65)",
            }}
          />

          {/* home indicator */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-2 left-1/2 z-30 h-1 -translate-x-1/2 rounded-full bg-white/60"
            style={{ width: Math.round(width * 0.34) }}
          />

          {/* riflesso vetro */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                "linear-gradient(118deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.05) 100%)",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>
    </div>
  );
}
