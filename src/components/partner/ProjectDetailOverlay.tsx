import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Smartphone, Monitor, Layers } from "lucide-react";
import { SECTOR_PORTFOLIO, type SectorPortfolio, type MockupStyle } from "@/data/sector-mockup-images";
import { PORTFOLIO_PROJECTS } from "@/data/portfolio-showcase-data";

/* ═══════════════════════════════════════════
   iPhone Frame
   ═══════════════════════════════════════════ */
function IPhoneFrame({ src, alt, onClick, size = "md" }: { src: string; alt: string; onClick?: () => void; size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "w-[200px]" : size === "md" ? "w-[130px]" : "w-[100px]";
  return (
    <button onClick={onClick} className={`${dims} aspect-[9/19.5] rounded-[22px] border-[2px] overflow-hidden flex-shrink-0 relative group transition-transform hover:scale-105`}
      style={{ borderColor: "rgba(255,255,255,0.15)", background: "#0a0a12", boxShadow: "0 12px 32px rgba(0,0,0,0.3)" }}>
      <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[36px] h-[10px] bg-black rounded-full z-10" />
      <div className="absolute inset-[2px] rounded-[20px] overflow-hidden bg-black">
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
      </div>
      {onClick && (
        <div className="absolute inset-0 rounded-[20px] bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
          </div>
        </div>
      )}
      <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[30%] h-[3px] bg-white/20 rounded-full z-10" />
    </button>
  );
}

/* ═══════════════════════════════════════════
   Fullscreen Image Lightbox
   ═══════════════════════════════════════════ */
function ImageLightbox({ src, alt, onClose, onPrev, onNext, hasPrev, hasNext }: {
  src: string; alt: string; onClose: () => void;
  onPrev?: () => void; onNext?: () => void;
  hasPrev?: boolean; hasNext?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
      onClick={onClose}>
      {/* Close */}
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
        <X className="w-5 h-5 text-white" />
      </button>
      {/* Prev */}
      {hasPrev && onPrev && (
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-3 z-10 p-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}
      {/* Next */}
      {hasNext && onNext && (
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-3 z-10 p-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}
      {/* Image in iPhone frame */}
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
        onClick={e => e.stopPropagation()} className="max-h-[82vh] w-auto">
        <div className="w-[280px] sm:w-[320px] aspect-[9/19.5] rounded-[36px] border-[3px] overflow-hidden relative mx-auto"
          style={{ borderColor: "rgba(255,255,255,0.2)", background: "#0a0a12", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
          <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[55px] h-[16px] bg-black rounded-full z-10" />
          <div className="absolute inset-[3px] rounded-[33px] overflow-hidden bg-black">
            <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
          </div>
          <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[30%] h-[4px] bg-white/20 rounded-full z-10" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Project Detail Overlay — brands + styles + screens
   ═══════════════════════════════════════════ */
export default function ProjectDetailOverlay({ sectorId, onClose }: { sectorId: string; onClose: () => void }) {
  const portfolio = SECTOR_PORTFOLIO.find(sp => sp.sectorId === sectorId);
  const project = PORTFOLIO_PROJECTS[sectorId as keyof typeof PORTFOLIO_PROJECTS];
  const [lightbox, setLightbox] = useState<{ screens: string[]; index: number } | null>(null);

  if (!portfolio || !project) return null;

  const allScreensFlat: string[] = [];
  portfolio.brands.forEach(b => b.styles.forEach(s => s.screens.forEach(sc => allScreensFlat.push(sc))));

  const handleOpenLightbox = (screens: string[], index: number) => {
    setLightbox({ screens, index });
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col"
        style={{ background: "#0a0a14" }}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(10,10,20,0.97)" }}>
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onClose} className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white truncate">{project.name}</h2>
              <p className="text-[10px]" style={{ color: "#6b7280" }}>{portfolio.brands.length} brand · {portfolio.brands.reduce((a, b) => a + b.styles.length, 0)} stili</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          {/* Project description */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                  style={{ background: `${project.accent}20`, color: project.accent }}>{tag}</span>
              ))}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#d1d5db" }}>{project.description}</p>
          </div>

          {/* Brands */}
          {portfolio.brands.map((brand, bi) => (
            <div key={bi} className="max-w-5xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${project.accent}15` }}>
                  <Layers className="w-4 h-4" style={{ color: project.accent }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{brand.name}</h3>
                  <p className="text-[10px]" style={{ color: "#6b7280" }}>{brand.styles.length} stili disponibili</p>
                </div>
              </div>

              {/* Styles grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {brand.styles.map((style, si) => (
                  <StyleCard key={si} style={style} brandName={brand.name} accent={project.accent}
                    onScreenClick={(idx) => handleOpenLightbox(style.screens, idx)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <ImageLightbox
            src={lightbox.screens[lightbox.index]}
            alt={`Screen ${lightbox.index + 1}`}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox(prev => prev ? { ...prev, index: prev.index - 1 } : null)}
            onNext={() => setLightbox(prev => prev ? { ...prev, index: prev.index + 1 } : null)}
            hasPrev={lightbox.index > 0}
            hasNext={lightbox.index < lightbox.screens.length - 1}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════
   Style Card — shows all screens in a horizontal row
   ═══════════════════════════════════════════ */
function StyleCard({ style, brandName, accent, onScreenClick }: {
  style: MockupStyle; brandName: string; accent: string;
  onScreenClick: (index: number) => void;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Style name */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-white">{style.name}</p>
          <p className="text-[9px]" style={{ color: "#6b7280" }}>{brandName}</p>
        </div>
        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${accent}15`, color: accent }}>
          {style.screens.length} schermate
        </span>
      </div>
      {/* Screens row */}
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto snap-x">
        {style.screens.map((screen, i) => (
          <IPhoneFrame key={i} src={screen} alt={`${brandName} ${style.name} ${i + 1}`} size="sm"
            onClick={() => onScreenClick(i)} />
        ))}
      </div>
    </div>
  );
}
