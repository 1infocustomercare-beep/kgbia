import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTOR_PORTFOLIO, type SectorPortfolio, type MockupStyle } from "@/data/sector-mockup-images";
import { ChevronDown, ChevronRight, Layers, X } from "lucide-react";

/* ═══════════════════════════════════════════
   iPhone 16 Pro Mockup Frame (reusable)
   ═══════════════════════════════════════════ */
function IPhoneFrame({ src, alt, size = "sm" }: { src: string; alt: string; size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "w-[180px]" : size === "md" ? "w-[140px]" : "w-[110px]";
  return (
    <div className={`${dims} aspect-[9/19.5] rounded-[22px] border-[2px] overflow-hidden flex-shrink-0 relative`}
      style={{ borderColor: "hsl(220 12% 80%)", background: "#0a0a12", boxShadow: "0 12px 32px hsla(0,0%,0%,0.18)" }}>
      <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[36px] h-[10px] bg-black rounded-full z-10" />
      <div className="absolute inset-[2px] rounded-[20px] overflow-hidden bg-background">
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
      </div>
      <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[30%] h-[3px] bg-white/20 rounded-full z-10" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Style Detail Overlay — shows all 4 screens
   ═══════════════════════════════════════════ */
function StyleDetailOverlay({ style, brandName, onClose }: { style: MockupStyle; brandName: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-2xl border border-border/60 p-4 max-w-[95vw] max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">{brandName}</h3>
            <p className="text-[10px] text-muted-foreground">Stile: {style.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-muted/50 hover:bg-muted">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {style.screens.map((screen, i) => (
            <IPhoneFrame key={i} src={screen} alt={`${brandName} ${style.name} screen ${i + 1}`} size="lg" />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Sector Card — expandable with brand/styles
   ═══════════════════════════════════════════ */
function SectorPortfolioCard({ sector }: { sector: SectorPortfolio }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<{ style: MockupStyle; brandName: string } | null>(null);

  const totalStyles = sector.brands.reduce((acc, b) => acc + b.styles.length, 0);
  const previewImages = sector.brands.slice(0, 3).map(b => b.styles[0]?.thumbnail).filter(Boolean);

  return (
    <>
      <motion.div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "hsl(var(--border) / 0.5)", background: "hsl(var(--card))" }}
        layout
      >
        {/* Header — always visible */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/30 transition-colors"
        >
          {/* 3 mini thumbnails stacked */}
          <div className="relative w-[52px] h-[52px] flex-shrink-0">
            {previewImages.slice(0, 3).map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="absolute w-[36px] h-[36px] rounded-lg object-cover border border-background shadow-sm"
                style={{ top: i * 4, left: i * 6, zIndex: 3 - i }}
                loading="lazy"
              />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{sector.sectorLabel}</p>
            <p className="text-[10px] text-muted-foreground">{sector.brands.length} brand • {totalStyles} stili</p>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-3">
                {sector.brands.map((brand, bi) => (
                  <div key={bi}>
                    <p className="text-[11px] font-semibold text-foreground/80 mb-2 flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-primary/60" />
                      {brand.name}
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
                      {brand.styles.map((style, si) => (
                        <button
                          key={si}
                          onClick={() => setSelectedStyle({ style, brandName: brand.name })}
                          className="flex-shrink-0 group"
                        >
                          <div className="relative">
                            <IPhoneFrame src={style.thumbnail} alt={`${brand.name} ${style.name}`} size="sm" />
                            <div className="absolute inset-0 rounded-[22px] bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <ChevronRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p className="text-[8px] text-muted-foreground text-center mt-1 max-w-[110px] truncate">{style.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Style detail overlay */}
      <AnimatePresence>
        {selectedStyle && (
          <StyleDetailOverlay
            style={selectedStyle.style}
            brandName={selectedStyle.brandName}
            onClose={() => setSelectedStyle(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════
   MAIN EXPORT — Partner Portfolio Section
   ═══════════════════════════════════════════ */
export default function PartnerPortfolio() {
  const totalBrands = SECTOR_PORTFOLIO.reduce((acc, s) => acc + s.brands.length, 0);
  const totalStyles = SECTOR_PORTFOLIO.reduce((acc, s) => acc + s.brands.reduce((a, b) => a + b.styles.length, 0), 0);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-display font-bold text-foreground">Portfolio Settori</h2>
        <p className="text-xs text-muted-foreground">
          {totalBrands} brand reali • {totalStyles} stili design • Mockup Lowengeld Agency
        </p>
      </div>

      <div className="space-y-2">
        {SECTOR_PORTFOLIO.map((sector) => (
          <SectorPortfolioCard key={sector.sectorId} sector={sector} />
        ))}
      </div>
    </div>
  );
}
