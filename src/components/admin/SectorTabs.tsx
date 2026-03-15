import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  sectors: readonly string[];
  counts: Record<string, number>;
  active: string;
  onSelect: (s: string) => void;
}

const SECTOR_LABELS: Record<string, { label: string; emoji: string }> = {
  all: { label: "Tutti", emoji: "🌐" },
  food: { label: "Food", emoji: "🍽️" },
  ncc: { label: "NCC", emoji: "🚗" },
  beauty: { label: "Beauty", emoji: "💅" },
  healthcare: { label: "Health", emoji: "🏥" },
  construction: { label: "Edilizia", emoji: "🏗️" },
  retail: { label: "Retail", emoji: "🛍️" },
  fitness: { label: "Fitness", emoji: "💪" },
  hospitality: { label: "Hotel", emoji: "🏨" },
  beach: { label: "Spiaggia", emoji: "🏖️" },
  plumber: { label: "Idraulico", emoji: "🔧" },
  agriturismo: { label: "Agritur.", emoji: "🌾" },
  cleaning: { label: "Pulizie", emoji: "🧹" },
  legal: { label: "Legale", emoji: "⚖️" },
  accounting: { label: "Contab.", emoji: "📊" },
  garage: { label: "Officina", emoji: "🔩" },
  photography: { label: "Foto", emoji: "📷" },
  gardening: { label: "Giardini", emoji: "🌿" },
  veterinary: { label: "Veterin.", emoji: "🐾" },
  tattoo: { label: "Tattoo", emoji: "🎨" },
  childcare: { label: "Asilo", emoji: "👶" },
  education: { label: "Formaz.", emoji: "📚" },
  events: { label: "Eventi", emoji: "🎉" },
  logistics: { label: "Logistica", emoji: "📦" },
};

export default function SectorTabs({ sectors, counts, active, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Split: "all" + top sectors (with agents) first row, rest in expanded
  const sortedSectors = [...sectors].sort((a, b) => {
    if (a === "all") return -1;
    if (b === "all") return 1;
    return (counts[b] || 0) - (counts[a] || 0);
  });

  const visibleCount = 8;
  const visible = sortedSectors.slice(0, visibleCount);
  const overflow = sortedSectors.slice(visibleCount);
  const activeInfo = SECTOR_LABELS[active] || { label: active, emoji: "📁" };

  return (
    <div className="space-y-1.5">
      {/* Main grid - always visible */}
      <div className="grid grid-cols-4 gap-1">
        {visible.map((s) => {
          const info = SECTOR_LABELS[s] || { label: s, emoji: "📁" };
          const isActive = active === s;
          return (
            <button
              key={s}
              onClick={() => onSelect(s)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-[0.55rem] font-medium transition-all min-h-[40px] ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60 border border-border/30"
              }`}
            >
              <span className="text-xs leading-none">{info.emoji}</span>
              <span className="truncate max-w-full">{info.label}</span>
              <span className={`text-[0.45rem] px-1 rounded-full leading-tight ${
                isActive ? "bg-primary-foreground/20" : "bg-foreground/10"
              }`}>
                {counts[s] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expand toggle */}
      {overflow.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 py-1 rounded-lg text-[0.6rem] font-medium text-muted-foreground hover:text-foreground bg-secondary/20 hover:bg-secondary/40 transition-colors border border-border/20"
        >
          {expanded ? "Meno settori" : `+${overflow.length} settori`}
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* Overflow grid */}
      {expanded && overflow.length > 0 && (
        <div className="grid grid-cols-4 gap-1">
          {overflow.map((s) => {
            const info = SECTOR_LABELS[s] || { label: s, emoji: "📁" };
            const isActive = active === s;
            return (
              <button
                key={s}
                onClick={() => { onSelect(s); setExpanded(false); }}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-[0.55rem] font-medium transition-all min-h-[40px] ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60 border border-border/30"
                }`}
              >
                <span className="text-xs leading-none">{info.emoji}</span>
                <span className="truncate max-w-full">{info.label}</span>
                <span className={`text-[0.45rem] px-1 rounded-full leading-tight ${
                  isActive ? "bg-primary-foreground/20" : "bg-foreground/10"
                }`}>
                  {counts[s] || 0}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
