// ══════════════════════════════════════════════════════════════
// MockupPresetSelector
// Selettore visuale dei preset mockup (palette + tipografia + layout)
// usato in Custom Preview, Demo Factory (leads) e Demo Studio.
//
// Mostra:
//  • Filtro categoria + filtro layout
//  • Card preset con swatch palette + preview tipografia + badge layout
//  • Auto-suggest in base al settore del lead (se passato)
// ══════════════════════════════════════════════════════════════
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Wand2 } from "lucide-react";
import {
  MOCKUP_STYLE_PRESETS,
  suggestPresetForSector,
  type MockupStylePreset,
} from "@/lib/mockup-style-presets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LAYOUT_LABEL: Record<MockupStylePreset["layout"], string> = {
  "editorial-magazine": "Editorial Magazine",
  "split-luxury": "Split Luxury 50/50",
  "glass-overlay": "Glass Overlay",
  "centered-minimal": "Centered Minimal",
  "bento-grid": "Bento Grid",
  "magazine-stack": "Magazine Stack",
};

const LAYOUT_WIRE: Record<MockupStylePreset["layout"], JSX.Element> = {
  "editorial-magazine": (
    <svg viewBox="0 0 80 50" className="w-full h-full">
      <rect x="2" y="2" width="46" height="32" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="50" y="2" width="28" height="14" rx="2" fill="currentColor" opacity="0.4" />
      <rect x="50" y="18" width="28" height="16" rx="2" fill="currentColor" opacity="0.25" />
      <rect x="2" y="36" width="76" height="3" fill="currentColor" opacity="0.3" />
      <rect x="2" y="42" width="50" height="3" fill="currentColor" opacity="0.2" />
    </svg>
  ),
  "split-luxury": (
    <svg viewBox="0 0 80 50" className="w-full h-full">
      <rect x="2" y="2" width="36" height="46" rx="2" fill="currentColor" opacity="0.4" />
      <rect x="42" y="2" width="36" height="20" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="42" y="26" width="36" height="22" rx="2" fill="currentColor" opacity="0.15" />
    </svg>
  ),
  "glass-overlay": (
    <svg viewBox="0 0 80 50" className="w-full h-full">
      <rect x="0" y="0" width="80" height="50" fill="currentColor" opacity="0.08" />
      <rect x="6" y="6" width="68" height="38" rx="6" fill="currentColor" opacity="0.18" />
      <rect x="14" y="14" width="36" height="6" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="14" y="24" width="52" height="3" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="14" y="30" width="40" height="3" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  "centered-minimal": (
    <svg viewBox="0 0 80 50" className="w-full h-full">
      <rect x="20" y="8" width="40" height="6" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="14" y="20" width="52" height="3" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="20" y="26" width="40" height="3" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="30" y="36" width="20" height="6" rx="3" fill="currentColor" opacity="0.45" />
    </svg>
  ),
  "bento-grid": (
    <svg viewBox="0 0 80 50" className="w-full h-full">
      <rect x="2" y="2" width="36" height="22" rx="3" fill="currentColor" opacity="0.4" />
      <rect x="40" y="2" width="18" height="22" rx="3" fill="currentColor" opacity="0.2" />
      <rect x="60" y="2" width="18" height="22" rx="3" fill="currentColor" opacity="0.3" />
      <rect x="2" y="26" width="18" height="22" rx="3" fill="currentColor" opacity="0.25" />
      <rect x="22" y="26" width="36" height="22" rx="3" fill="currentColor" opacity="0.18" />
      <rect x="60" y="26" width="18" height="22" rx="3" fill="currentColor" opacity="0.35" />
    </svg>
  ),
  "magazine-stack": (
    <svg viewBox="0 0 80 50" className="w-full h-full">
      <rect x="2" y="2" width="76" height="14" rx="2" fill="currentColor" opacity="0.4" />
      <rect x="2" y="18" width="76" height="10" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="2" y="30" width="76" height="10" rx="2" fill="currentColor" opacity="0.25" />
      <rect x="2" y="42" width="76" height="6" rx="2" fill="currentColor" opacity="0.15" />
    </svg>
  ),
};

const CATEGORIES = [
  "Tutti",
  "Editorial Luxury",
  "Glassmorphism",
  "Mediterranean Luxury",
  "Dark Premium",
  "Warm Nature",
  "Light Minimal",
] as const;

interface Props {
  value?: string;
  onChange: (presetKey: string, preset: MockupStylePreset) => void;
  /** settore del lead per auto-suggest */
  sectorHint?: string | null;
  /** mostra anche selettore layout (default true) */
  showLayoutFilter?: boolean;
  /** mostra header con titolo + auto-suggest button */
  showHeader?: boolean;
  /** modalità compatta per dialog */
  compact?: boolean;
}

export function MockupPresetSelector({
  value,
  onChange,
  sectorHint,
  showLayoutFilter = true,
  showHeader = true,
  compact = false,
}: Props) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Tutti");
  const [layoutFilter, setLayoutFilter] = useState<MockupStylePreset["layout"] | "all">("all");

  // Auto-suggest al primo render se value vuoto e c'è un sector
  useEffect(() => {
    if (!value && sectorHint) {
      const suggested = suggestPresetForSector(sectorHint);
      onChange(suggested.key, suggested);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return MOCKUP_STYLE_PRESETS.filter((p) => {
      if (category !== "Tutti" && p.category !== category) return false;
      if (layoutFilter !== "all" && p.layout !== layoutFilter) return false;
      return true;
    });
  }, [category, layoutFilter]);

  const layouts = useMemo(() => {
    const set = new Set<MockupStylePreset["layout"]>();
    MOCKUP_STYLE_PRESETS.forEach((p) => set.add(p.layout));
    return Array.from(set);
  }, []);

  const handleAutoSuggest = () => {
    const suggested = suggestPresetForSector(sectorHint || "");
    onChange(suggested.key, suggested);
  };

  return (
    <div className="space-y-3">
      {showHeader && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              Stile mockup
            </p>
            <p className="text-[11px] text-muted-foreground">
              Palette + tipografia + layout architetturale (12 preset premium)
            </p>
          </div>
          {sectorHint && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAutoSuggest}
              className="h-7 text-[11px] gap-1"
            >
              <Wand2 className="w-3 h-3" />
              Auto-match per "{sectorHint}"
            </Button>
          )}
        </div>
      )}

      {/* Filtri */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition border ${
                category === c
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {showLayoutFilter && (
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setLayoutFilter("all")}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition border ${
                layoutFilter === "all"
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:bg-muted/40"
              }`}
            >
              Tutti i layout
            </button>
            {layouts.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLayoutFilter(l)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition border ${
                  layoutFilter === l
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:bg-muted/40"
                }`}
              >
                {LAYOUT_LABEL[l]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid preset */}
      <div
        className={`grid gap-2 ${
          compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {filtered.map((preset) => {
          const isActive = value === preset.key;
          return (
            <motion.button
              key={preset.key}
              type="button"
              onClick={() => onChange(preset.key, preset)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative text-left p-2.5 rounded-xl border-2 transition overflow-hidden ${
                isActive
                  ? "border-primary shadow-lg ring-2 ring-primary/30"
                  : "border-border hover:border-primary/50"
              }`}
              style={{
                background:
                  preset.palette.bg.startsWith("linear-gradient")
                    ? preset.palette.bg
                    : preset.palette.bg,
              }}
            >
              {isActive && (
                <span className="absolute top-1.5 right-1.5 z-10 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground shadow-md">
                  <Check className="w-3 h-3" />
                </span>
              )}

              {/* Preview tipografia inline */}
              <div className="mb-2" style={{ color: preset.palette.text }}>
                <p
                  className="text-base leading-tight font-bold truncate"
                  style={{
                    fontFamily: `"${preset.fonts.heading}", serif`,
                  }}
                >
                  {preset.label}
                </p>
                <p
                  className="text-[10px] mt-0.5 line-clamp-2"
                  style={{
                    fontFamily: `"${preset.fonts.body}", sans-serif`,
                    color: preset.palette.muted,
                  }}
                >
                  {preset.description}
                </p>
              </div>

              {/* Wireframe layout */}
              <div
                className="rounded-md overflow-hidden mb-2"
                style={{
                  background: preset.palette.surface.startsWith("rgba")
                    ? "rgba(0,0,0,0.04)"
                    : preset.palette.surface,
                  color: preset.palette.accent,
                  height: "44px",
                  padding: "3px",
                }}
              >
                {LAYOUT_WIRE[preset.layout]}
              </div>

              {/* Swatch palette */}
              <div className="flex gap-1 mb-1.5">
                {preset.swatch.map((c, i) => (
                  <span
                    key={i}
                    className="flex-1 h-3 rounded-sm border border-black/5"
                    style={{ background: c }}
                  />
                ))}
              </div>

              {/* Footer badges */}
              <div className="flex items-center justify-between gap-1 mt-1">
                <Badge
                  variant="outline"
                  className="text-[8px] py-0 h-4 px-1.5 font-bold"
                  style={{
                    borderColor: preset.palette.accent + "40",
                    color: preset.palette.accent,
                    background: preset.palette.accentSoft,
                  }}
                >
                  {LAYOUT_LABEL[preset.layout]}
                </Badge>
                <span
                  className="text-[8px] uppercase tracking-wider font-bold"
                  style={{ color: preset.palette.muted }}
                >
                  {preset.fonts.heading.split(" ")[0]} · {preset.fonts.body.split(" ")[0]}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-xs text-center text-muted-foreground py-6 border border-dashed rounded-lg">
          Nessun preset corrisponde ai filtri selezionati.
        </p>
      )}
    </div>
  );
}
