import { ReactNode } from "react";

/**
 * Realistic iPhone 15 Pro frame — Dynamic Island, titanium bezel, glass reflection.
 * Used by Hero & Portfolio sections. Supports a label badge (Home / Admin / App / AI).
 */

export type PhoneView = "Home sito" | "Admin" | "App cliente" | "AI WhatsApp";

interface Props {
  src: string;
  alt?: string;
  label?: PhoneView;
  /** Width in px. Default 280. */
  width?: number;
  className?: string;
  children?: ReactNode;
  loading?: "eager" | "lazy";
}

export default function PrestigePhone({
  src,
  alt = "Mockup iPhone",
  label,
  width = 280,
  className = "",
  children,
  loading = "lazy",
}: Props) {
  const h = Math.round(width * (19 / 9));

  return (
    <div
      className={`prestige-phone relative ${className}`}
      style={{ width, height: h }}
    >
      {/* Outer titanium frame */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: `${width * 0.16}px`,
          padding: `${Math.max(7, width * 0.028)}px`,
          background:
            "linear-gradient(145deg, hsl(0 0% 18%) 0%, hsl(0 0% 6%) 35%, hsl(0 0% 14%) 65%, hsl(0 0% 4%) 100%)",
          boxShadow:
            "0 40px 80px -20px hsl(var(--pr-emerald-deep) / 0.85), 0 0 0 1.2px hsl(var(--pr-gold) / 0.32), inset 0 1px 0 hsl(0 0% 100% / 0.08)",
        }}
      >
        {/* Inner screen */}
        <div
          className="relative h-full w-full overflow-hidden bg-black"
          style={{ borderRadius: `${width * 0.13}px` }}
        >
          <img
            src={src}
            alt={alt}
            loading={loading}
            draggable={false}
            className="h-full w-full object-cover"
          />

          {/* Glass reflection overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(125deg, hsl(0 0% 100% / 0.18) 0%, transparent 22%, transparent 70%, hsl(0 0% 100% / 0.06) 100%)",
              mixBlendMode: "overlay",
            }}
          />

          {/* Dynamic island */}
          <div
            className="absolute left-1/2 z-20 -translate-x-1/2"
            style={{
              top: `${width * 0.04}px`,
              width: `${width * 0.32}px`,
              height: `${width * 0.075}px`,
              background: "#000",
              borderRadius: 9999,
              boxShadow: "inset 0 0 0 1px hsl(0 0% 14%), 0 0 12px hsl(0 0% 0% / 0.6)",
            }}
          >
            {/* Camera lens dot */}
            <span
              className="absolute right-[18%] top-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: `${width * 0.022}px`,
                height: `${width * 0.022}px`,
                background: "radial-gradient(circle at 30% 30%, hsl(220 60% 30%), #000 70%)",
                boxShadow: "inset 0 0 0 1px hsl(220 30% 18%)",
              }}
            />
          </div>

          {/* iOS status bar (time + signal + battery) */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-center justify-between"
            style={{
              padding: `${width * 0.045}px ${width * 0.075}px ${width * 0.02}px`,
              fontSize: `${Math.max(9, width * 0.04)}px`,
              color: "#fff",
              fontWeight: 600,
              fontFamily: "-apple-system, 'SF Pro Display', system-ui, sans-serif",
              textShadow: "0 1px 2px hsl(0 0% 0% / 0.5)",
              letterSpacing: "-0.01em",
            }}
          >
            <span>9:41</span>
            <span style={{ width: `${width * 0.32}px` }} />
            <span className="flex items-center gap-1">
              {/* signal bars */}
              <span className="flex items-end gap-[1px]">
                {[0.3, 0.5, 0.75, 1].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      width: `${width * 0.008}px`,
                      height: `${width * 0.025 * h}px`,
                      background: "#fff",
                      borderRadius: 1,
                    }}
                  />
                ))}
              </span>
              {/* battery */}
              <span
                className="relative inline-block"
                style={{
                  width: `${width * 0.07}px`,
                  height: `${width * 0.032}px`,
                  border: "1px solid #fff",
                  borderRadius: `${width * 0.008}px`,
                  padding: `${width * 0.004}px`,
                }}
              >
                <span
                  className="block h-full rounded-[1px]"
                  style={{ width: "82%", background: "#fff" }}
                />
              </span>
            </span>
          </div>

          {/* Home indicator */}
          <div
            className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-full"
            style={{
              bottom: `${width * 0.025}px`,
              width: `${width * 0.36}px`,
              height: `${width * 0.013}px`,
              background: "hsl(0 0% 100% / 0.85)",
              boxShadow: "0 0 6px hsl(0 0% 0% / 0.4)",
            }}
          />

          {children}
        </div>
      </div>

      {/* Side buttons — silent/volume left, power right */}
      <div
        className="absolute"
        style={{
          left: -2,
          top: `18%`,
          width: 3,
          height: `7%`,
          background: "hsl(0 0% 22%)",
          borderRadius: "2px 0 0 2px",
        }}
      />
      <div
        className="absolute"
        style={{
          left: -2,
          top: `28%`,
          width: 3,
          height: `11%`,
          background: "hsl(0 0% 22%)",
          borderRadius: "2px 0 0 2px",
        }}
      />
      <div
        className="absolute"
        style={{
          left: -2,
          top: `42%`,
          width: 3,
          height: `11%`,
          background: "hsl(0 0% 22%)",
          borderRadius: "2px 0 0 2px",
        }}
      />
      <div
        className="absolute"
        style={{
          right: -2,
          top: `30%`,
          width: 3,
          height: `14%`,
          background: "hsl(0 0% 22%)",
          borderRadius: "0 2px 2px 0",
        }}
      />

      {/* View label badge */}
      {label && (
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            background: "hsl(var(--pr-gold))",
            color: "hsl(var(--pr-emerald-deep))",
            boxShadow: "0 6px 20px -6px hsl(var(--pr-gold) / 0.6)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

export const PHONE_VIEWS: PhoneView[] = ["Home sito", "Admin", "App cliente", "AI WhatsApp"];
