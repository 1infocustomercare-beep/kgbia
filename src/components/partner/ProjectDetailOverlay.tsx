import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Layers, ExternalLink, Monitor, Smartphone, Zap, Tablet } from "lucide-react";
import { SECTOR_PORTFOLIO, type SectorPortfolio, type MockupStyle } from "@/data/sector-mockup-images";
import { PORTFOLIO_PROJECTS } from "@/data/portfolio-showcase-data";
import { UNIVERSAL_FEATURES, SECTOR_SPECIFIC_FEATURES, UNIVERSAL_AGENTS } from "@/config/sectorFeatures";

/* ═══════════════════════════════════════════
   Demo slug mapping
   ═══════════════════════════════════════════ */
const SECTOR_DEMO_SLUGS: Record<string, string> = {
  food: "food", beauty: "beauty", ncc: "ncc", fitness: "fitness",
  healthcare: "healthcare", hotel: "hotel", beach: "beach", retail: "retail",
  plumber: "plumber", electrician: "electrician", veterinary: "veterinary",
  childcare: "childcare", construction: "construction", agriturismo: "agriturismo",
  cleaning: "cleaning", legal: "legal", accounting: "accounting", garage: "garage",
  photography: "photography", gardening: "gardening", tattoo: "tattoo",
  education: "education", events: "events", logistics: "logistics", hospitality: "hospitality",
};

type DeviceType = "mobile" | "tablet" | "desktop";

/* ═══════════════════════════════════════════
   Device Frames
   ═══════════════════════════════════════════ */

function MobileFrame({ src, alt, onClick, size = "md" }: { src: string; alt: string; onClick?: () => void; size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "w-[180px]" : size === "md" ? "w-[120px]" : "w-[90px]";
  return (
    <button onClick={onClick} className={`${dims} aspect-[9/19.5] rounded-[18px] border-[2px] overflow-hidden flex-shrink-0 relative group transition-transform hover:scale-105`}
      style={{ borderColor: "rgba(255,255,255,0.15)", background: "#0a0a12", boxShadow: "0 12px 32px rgba(0,0,0,0.3)" }}>
      <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[30px] h-[8px] bg-black rounded-full z-10" />
      <div className="absolute inset-[2px] rounded-[16px] overflow-hidden bg-black">
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
      </div>
      {onClick && (
        <div className="absolute inset-0 rounded-[16px] bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
          </div>
        </div>
      )}
      <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[28%] h-[3px] bg-white/20 rounded-full z-10" />
    </button>
  );
}

function TabletFrame({ src, alt, onClick }: { src: string; alt: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-[160px] aspect-[3/4] rounded-[14px] border-[2.5px] overflow-hidden flex-shrink-0 relative group transition-transform hover:scale-105"
      style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0a0a12", boxShadow: "0 12px 32px rgba(0,0,0,0.3)" }}>
      <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[10px] h-[10px] rounded-full border border-white/10 z-10" />
      <div className="absolute inset-[3px] rounded-[11px] overflow-hidden bg-black">
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
      </div>
      {onClick && (
        <div className="absolute inset-0 rounded-[12px] bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
          </div>
        </div>
      )}
      <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[14px] h-[14px] rounded-full border border-white/10 z-10" />
    </button>
  );
}

function DesktopFrame({ src, alt, onClick }: { src: string; alt: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex-shrink-0 group relative transition-transform hover:scale-105" style={{ width: 220 }}>
      {/* Monitor bezel */}
      <div className="rounded-t-xl border-[2.5px] border-b-0 overflow-hidden relative"
        style={{ aspectRatio: "16/10", borderColor: "rgba(255,255,255,0.12)", background: "#0a0a12", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
        {/* Camera */}
        <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-white/10 z-10" />
        <div className="absolute inset-[3px] inset-t-[8px] overflow-hidden bg-black rounded-t-lg">
          <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
        </div>
        {onClick && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
            </div>
          </div>
        )}
      </div>
      {/* Stand */}
      <div className="flex flex-col items-center">
        <div className="w-full h-[3px] rounded-b-sm" style={{ background: "rgba(255,255,255,0.1)" }} />
        <div className="w-[30%] h-[12px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))" }} />
        <div className="w-[50%] h-[3px] rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════
   Adaptive Lightbox — shows correct device frame
   ═══════════════════════════════════════════ */
function DeviceLightbox({ src, alt, deviceType, onClose, onPrev, onNext, hasPrev, hasNext }: {
  src: string; alt: string; deviceType: DeviceType; onClose: () => void;
  onPrev?: () => void; onNext?: () => void;
  hasPrev?: boolean; hasNext?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
      onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
        <X className="w-5 h-5 text-white" />
      </button>
      {hasPrev && onPrev && (
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-3 z-10 p-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}
      {hasNext && onNext && (
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-3 z-10 p-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
        onClick={e => e.stopPropagation()} className="max-h-[85vh] w-auto flex items-center justify-center">

        {deviceType === "mobile" && (
          <div className="w-[280px] sm:w-[320px] aspect-[9/19.5] rounded-[36px] border-[3px] overflow-hidden relative mx-auto"
            style={{ borderColor: "rgba(255,255,255,0.2)", background: "#0a0a12", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
            <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[55px] h-[16px] bg-black rounded-full z-10" />
            <div className="absolute inset-[3px] rounded-[33px] overflow-hidden bg-black">
              <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
            </div>
            <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[30%] h-[4px] bg-white/20 rounded-full z-10" />
          </div>
        )}

        {deviceType === "tablet" && (
          <div className="w-[400px] sm:w-[480px] aspect-[3/4] rounded-[24px] border-[3px] overflow-hidden relative mx-auto"
            style={{ borderColor: "rgba(255,255,255,0.15)", background: "#0a0a12", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
            <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[14px] h-[14px] rounded-full border-2 border-white/10 z-10" />
            <div className="absolute inset-[4px] rounded-[20px] overflow-hidden bg-black">
              <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
            </div>
            <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full border-2 border-white/10 z-10" />
          </div>
        )}

        {deviceType === "desktop" && (
          <div className="mx-auto" style={{ width: "min(85vw, 800px)" }}>
            <div className="rounded-t-2xl border-[3px] border-b-0 overflow-hidden relative"
              style={{ aspectRatio: "16/10", borderColor: "rgba(255,255,255,0.15)", background: "#0a0a12", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
              <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] rounded-full bg-white/10 z-10" />
              {/* Browser chrome */}
              <div className="absolute top-0 left-0 right-0 h-[28px] flex items-center gap-1.5 px-3 z-10" style={{ background: "rgba(20,20,30,0.95)" }}>
                <div className="flex gap-1.5 ml-1">
                  <div className="w-[8px] h-[8px] rounded-full bg-red-500/60" />
                  <div className="w-[8px] h-[8px] rounded-full bg-yellow-500/60" />
                  <div className="w-[8px] h-[8px] rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4 h-[16px] rounded bg-white/5 flex items-center justify-center">
                  <span className="text-[8px] text-white/30 font-mono">empireaigroup.com</span>
                </div>
              </div>
              <div className="absolute inset-[3px] top-[28px] overflow-hidden bg-black rounded-b-xl">
                <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
              </div>
            </div>
            {/* Stand */}
            <div className="flex flex-col items-center">
              <div className="w-full h-[4px] rounded-b" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="w-[20%] h-[16px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))" }} />
              <div className="w-[35%] h-[4px] rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
          </div>
        )}
      </motion.div>

      {/* Device label */}
      <div className="absolute bottom-4 flex items-center gap-2">
        {deviceType === "mobile" && <Smartphone className="w-3.5 h-3.5 text-white/40" />}
        {deviceType === "tablet" && <Tablet className="w-3.5 h-3.5 text-white/40" />}
        {deviceType === "desktop" && <Monitor className="w-3.5 h-3.5 text-white/40" />}
        <p className="text-white/40 text-[10px] tracking-widest uppercase">{alt}</p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Project Detail Overlay
   ═══════════════════════════════════════════ */
type LightboxState = { screens: { src: string; device: DeviceType }[]; index: number } | null;

export default function ProjectDetailOverlay({ sectorId, onClose }: { sectorId: string; onClose: () => void }) {
  const portfolio = SECTOR_PORTFOLIO.find(sp => sp.sectorId === sectorId);
  const project = PORTFOLIO_PROJECTS[sectorId as keyof typeof PORTFOLIO_PROJECTS];
  const [lightbox, setLightbox] = useState<LightboxState>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "features">("preview");

  if (!portfolio || !project) return null;

  const demoSlug = SECTOR_DEMO_SLUGS[sectorId] || sectorId;
  const sectorFeatures = SECTOR_SPECIFIC_FEATURES[sectorId] || [];
  const topUniversal = UNIVERSAL_FEATURES.slice(0, 8);
  const topAgents = UNIVERSAL_AGENTS.slice(0, 4);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col"
        style={{ background: "#0a0a14" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(10,10,20,0.97)" }}>
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onClose} className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white truncate">{project.name}</h2>
              <p className="text-[10px]" style={{ color: "#6b7280" }}>
                {portfolio.brands.length} brand · {portfolio.brands.reduce((a, b) => a + b.styles.length, 0)} stili
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 px-4 py-2 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { id: "preview" as const, icon: Smartphone, label: "Preview & Stili" },
            { id: "features" as const, icon: Zap, label: "Funzionalità" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: activeTab === tab.id ? "rgba(167,139,250,0.12)" : "transparent",
                border: activeTab === tab.id ? "1px solid rgba(167,139,250,0.3)" : "1px solid transparent",
                color: activeTab === tab.id ? "#a78bfa" : "#6b7280",
              }}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Demo action buttons */}
        <div className="flex gap-2 px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <a href={`/demo/${demoSlug}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }}>
            <ExternalLink className="w-3.5 h-3.5" /> Sito Demo
          </a>
          <a href={`/demo/${demoSlug}/admin`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
            style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}>
            <Monitor className="w-3.5 h-3.5" /> Admin Demo
          </a>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

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

          {activeTab === "preview" ? (
            <>
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

                  <div className="space-y-4">
                    {brand.styles.map((style, si) => {
                      const desktopScreens: string[] = (style as any).desktopScreens || [];
                      const tabletScreens: string[] = (style as any).tabletScreens || [];

                      // Build unified screen list with device types
                      const allScreens: { src: string; device: DeviceType }[] = [
                        ...style.screens.map(s => ({ src: s, device: "mobile" as DeviceType })),
                        ...(tabletScreens.map(s => ({ src: s, device: "tablet" as DeviceType }))),
                        ...(desktopScreens.map(s => ({ src: s, device: "desktop" as DeviceType }))),
                      ];

                      const totalCount = allScreens.length;

                      return (
                        <div key={si} className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-white">{style.name}</p>
                              <p className="text-[9px]" style={{ color: "#6b7280" }}>{brand.name}</p>
                            </div>
                            <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${project.accent}15`, color: project.accent }}>
                              {totalCount} schermate
                            </span>
                          </div>

                          <div className="px-4 pb-4 space-y-3">
                            {/* Mobile screens */}
                            {style.screens.length > 0 && (
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Smartphone className="w-3 h-3" style={{ color: "#6b7280" }} />
                                  <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>
                                    iPhone ({style.screens.length})
                                  </p>
                                </div>
                                <div className="flex gap-2 overflow-x-auto snap-x pb-1">
                                  {style.screens.map((screen, i) => (
                                    <MobileFrame key={`m-${i}`} src={screen} alt={`${brand.name} ${style.name} iPhone ${i + 1}`} size="sm"
                                      onClick={() => setLightbox({ screens: allScreens, index: i })} />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Tablet screens */}
                            {tabletScreens.length > 0 && (
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Tablet className="w-3 h-3" style={{ color: "#6b7280" }} />
                                  <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>
                                    iPad ({tabletScreens.length})
                                  </p>
                                </div>
                                <div className="flex gap-3 overflow-x-auto snap-x pb-1">
                                  {tabletScreens.map((screen, i) => (
                                    <TabletFrame key={`t-${i}`} src={screen} alt={`${brand.name} ${style.name} iPad ${i + 1}`}
                                      onClick={() => setLightbox({ screens: allScreens, index: style.screens.length + i })} />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Desktop screens */}
                            {desktopScreens.length > 0 && (
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Monitor className="w-3 h-3" style={{ color: "#6b7280" }} />
                                  <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>
                                    Desktop ({desktopScreens.length})
                                  </p>
                                </div>
                                <div className="flex gap-3 overflow-x-auto snap-x pb-1">
                                  {desktopScreens.map((screen, i) => (
                                    <DesktopFrame key={`d-${i}`} src={screen} alt={`${brand.name} ${style.name} Desktop ${i + 1}`}
                                      onClick={() => setLightbox({ screens: allScreens, index: style.screens.length + tabletScreens.length + i })} />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          ) : (
            /* ═══ FEATURES TAB ═══ */
            <div className="max-w-3xl mx-auto space-y-8">
              {sectorFeatures.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4" style={{ color: project.accent }} />
                    Funzionalità Specifiche — {project.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sectorFeatures.map((f, i) => (
                      <div key={i} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm" style={{ background: `${project.accent}15` }}>
                            {f.icon === "QrCode" ? "📱" : f.icon === "ChefHat" ? "👨‍🍳" : f.icon === "Car" ? "🚗" : f.icon === "Camera" ? "📷" :
                             f.icon === "Video" ? "📹" : f.icon === "Wrench" ? "🔧" : f.icon === "ShoppingCart" ? "🛒" : f.icon === "Calendar" ? "📅" :
                             f.icon === "Ticket" ? "🎫" : f.icon === "Building" ? "🏨" : f.icon === "LayoutGrid" ? "🗺️" : "⚙️"}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{f.title}</p>
                            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "#9ca3af" }}>{f.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" style={{ color: "#a78bfa" }} />
                  Funzionalità Universali (Tutti i Settori)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {topUniversal.map((f, i) => (
                    <div key={i} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm" style={{ background: "rgba(167,139,250,0.1)" }}>
                          {f.icon === "Users" ? "👥" : f.icon === "Filter" ? "🔍" : f.icon === "Calendar" ? "📅" : f.icon === "CalendarClock" ? "⏰" :
                           f.icon === "MessageCircle" ? "💬" : f.icon === "Phone" ? "📱" : f.icon === "Mail" ? "📧" : "📊"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{f.title}</p>
                          <p className="text-[11px] mt-1 leading-relaxed" style={{ color: "#9ca3af" }}>{f.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  🤖 Agenti AI Inclusi
                </h3>
                <div className="space-y-3">
                  {topAgents.map((agent, i) => (
                    <div key={i} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl">{agent.emoji}</span>
                        <div>
                          <p className="text-xs font-bold text-white">{agent.name}</p>
                          {agent.hoursPerWeek && (
                            <p className="text-[10px]" style={{ color: "#6b7280" }}>
                              Risparmia {agent.hoursPerWeek}h/settimana · Accuratezza {agent.accuracy}%
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: "#9ca3af" }}>{agent.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {agent.capabilities.map((cap, ci) => (
                          <span key={ci} className="px-2 py-0.5 rounded text-[9px] font-semibold" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>{cap}</span>
                        ))}
                      </div>
                      {agent.example && (
                        <div className="mt-3 p-3 rounded-lg" style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.1)" }}>
                          <p className="text-[10px] font-semibold mb-1" style={{ color: "#a78bfa" }}>Esempio reale:</p>
                          <p className="text-[10px] leading-relaxed" style={{ color: "#d1d5db" }}>{agent.example}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center py-6 space-y-4">
                <p className="text-sm font-bold text-white">Vuoi vedere tutto in azione?</p>
                <div className="flex gap-3 justify-center">
                  <a href={`/demo/${demoSlug}`} target="_blank" rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold"
                    style={{ background: "#7c3aed", color: "#ffffff" }}>
                    🚀 Apri Sito Demo
                  </a>
                  <a href={`/demo/${demoSlug}/admin`} target="_blank" rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold"
                    style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa" }}>
                    ⚙️ Apri Admin Demo
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Lightbox — adaptive device frame */}
      <AnimatePresence>
        {lightbox && (
          <DeviceLightbox
            src={lightbox.screens[lightbox.index].src}
            alt={`Screen ${lightbox.index + 1} di ${lightbox.screens.length}`}
            deviceType={lightbox.screens[lightbox.index].device}
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
