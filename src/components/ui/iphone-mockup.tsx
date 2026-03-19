import React from "react";
import { cn } from "@/lib/utils";

interface IPhoneMockupProps {
  children: React.ReactNode;
  accentColor?: string;
  className?: string;
  scale?: "sm" | "md" | "lg";
}

/**
 * CSS-only iPhone mockup frame with Dynamic Island, status bar, and home indicator.
 * Displays any content inside a realistic phone frame.
 */
export function IPhoneMockup({ children, accentColor = "#C8963E", className, scale = "md" }: IPhoneMockupProps) {
  const sizes = {
    sm: "w-[140px] h-[285px]",
    md: "w-[200px] h-[408px]",
    lg: "w-[260px] h-[530px]",
  };

  return (
    <div className={cn("relative", sizes[scale], className)}>
      {/* Phone frame */}
      <div
        className="absolute inset-0 rounded-[2rem] border-2 overflow-hidden"
        style={{
          borderColor: `${accentColor}30`,
          background: "linear-gradient(180deg, #0d0d1a 0%, #0a0a12 100%)",
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${accentColor}08, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 pt-2 pb-1 relative z-10">
          <span className="text-[7px] text-white/40 font-bold">9:41</span>
          {/* Dynamic Island */}
          <div className="w-16 h-4 rounded-full bg-black border border-white/10" />
          <div className="flex items-center gap-1">
            <div className="w-3 h-2 border border-white/30 rounded-[1px]">
              <div className="w-1.5 h-1 bg-white/40 rounded-[0.5px] ml-auto mr-px mt-px" />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="absolute inset-x-0 top-7 bottom-4 overflow-hidden rounded-b-[1.8rem]">
          {children}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[35%] h-1 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

/**
 * Pre-built iPhone mockup content for different sector types
 */
export function SectorPhoneContent({ sector, accentColor = "#C8963E" }: { sector: string; accentColor?: string }) {
  const contents: Record<string, React.ReactNode> = {
    food: (
      <div className="h-full p-3 space-y-2" style={{ background: "#0d0d1a" }}>
        <div className="text-center py-2">
          <span className="text-lg">🍽️</span>
          <p className="text-[8px] font-bold text-white mt-1">Menu Digitale</p>
        </div>
        {["Carbonara", "Margherita", "Tiramisù"].map((item, i) => (
          <div key={item} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}15` }}>
            <div className="w-8 h-8 rounded-lg" style={{ background: `${accentColor}20` }} />
            <div className="flex-1">
              <p className="text-[7px] font-bold text-white/80">{item}</p>
              <p className="text-[6px] text-white/30">€{[14, 12, 7][i]}</p>
            </div>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px]" style={{ background: accentColor, color: "white" }}>+</div>
          </div>
        ))}
      </div>
    ),
    beauty: (
      <div className="h-full p-3 space-y-2" style={{ background: "#0d0d1a" }}>
        <div className="text-center py-2">
          <span className="text-lg">💅</span>
          <p className="text-[8px] font-bold text-white mt-1">Prenota Trattamento</p>
        </div>
        {["Taglio + Colore", "Manicure Spa", "Trattamento Viso"].map((item, i) => (
          <div key={item} className="p-2 rounded-xl" style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}15` }}>
            <p className="text-[7px] font-bold text-white/80">{item}</p>
            <p className="text-[6px] text-white/30">€{[85, 35, 120][i]} · {["60 min", "45 min", "90 min"][i]}</p>
          </div>
        ))}
      </div>
    ),
    ncc: (
      <div className="h-full p-3 space-y-2" style={{ background: "#0d0d1a" }}>
        <div className="text-center py-2">
          <span className="text-lg">🚗</span>
          <p className="text-[8px] font-bold text-white mt-1">Prenota Transfer</p>
        </div>
        <div className="p-2 rounded-xl space-y-1.5" style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}15` }}>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p className="text-[6px] text-white/50">Partenza</p>
          </div>
          <p className="text-[7px] font-bold text-white/80 pl-2.5">Aeroporto Napoli</p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <p className="text-[6px] text-white/50">Arrivo</p>
          </div>
          <p className="text-[7px] font-bold text-white/80 pl-2.5">Positano</p>
        </div>
        <div className="flex gap-1.5">
          {["Sedan", "SUV", "Van"].map(v => (
            <div key={v} className="flex-1 p-1.5 rounded-lg text-center" style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}15` }}>
              <p className="text-[6px] font-bold text-white/60">{v}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  // Generic content for sectors without specific mockup
  const generic = (
    <div className="h-full p-3 space-y-2" style={{ background: "#0d0d1a" }}>
      <div className="text-center py-2">
        <div className="w-8 h-8 rounded-xl mx-auto flex items-center justify-center" style={{ background: `${accentColor}20` }}>
          <span className="text-xs">⚡</span>
        </div>
        <p className="text-[8px] font-bold text-white mt-1">Dashboard</p>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {["Clienti", "Ordini", "Revenue", "Rating"].map(label => (
          <div key={label} className="p-2 rounded-lg text-center" style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}10` }}>
            <p className="text-[8px] font-bold text-white/70">24</p>
            <p className="text-[5px] text-white/30">{label}</p>
          </div>
        ))}
      </div>
      <div className="p-2 rounded-lg" style={{ background: `${accentColor}05` }}>
        <div className="flex items-end gap-0.5 h-6">
          {[4, 6, 5, 8, 7, 9, 8, 10].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ height: `${h * 10}%`, background: i >= 6 ? accentColor : `${accentColor}30` }} />
          ))}
        </div>
      </div>
    </div>
  );

  return <>{contents[sector] || generic}</>;
}
