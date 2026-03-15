import { useRef } from "react";

interface Props {
  sectors: readonly string[];
  counts: Record<string, number>;
  active: string;
  onSelect: (s: string) => void;
}

const SECTOR_LABELS: Record<string, string> = {
  all: "Tutti", food: "Food", ncc: "NCC", beauty: "Beauty",
  healthcare: "Healthcare", construction: "Edilizia", retail: "Retail",
  fitness: "Fitness", hospitality: "Hotel", beach: "Spiaggia",
  plumber: "Idraulico", agriturismo: "Agriturismo", cleaning: "Pulizie",
  legal: "Legale", accounting: "Contabilità", garage: "Officina",
  photography: "Fotografia", gardening: "Giardinaggio", veterinary: "Veterinario",
  tattoo: "Tattoo", childcare: "Asilo", education: "Formazione",
  events: "Eventi", logistics: "Logistica",
};

export default function SectorTabs({ sectors, counts, active, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {sectors.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            active === s
              ? "bg-primary text-primary-foreground"
              : "bg-white/5 text-muted-foreground hover:bg-white/10"
          }`}
        >
          {SECTOR_LABELS[s] || s}
          <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-full ${
            active === s ? "bg-white/20" : "bg-white/10"
          }`}>
            {counts[s] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}
