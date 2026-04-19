import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check, Image as ImageIcon, Layers, Eye, Copy, Send } from "lucide-react";
import { SECTOR_PORTFOLIO, SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { INDUSTRY_CONFIGS } from "@/config/industry-config";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { toast } from "sonner";

export interface ManualPreviewSelection {
  sectorId: string;
  sectorLabel: string;
  brandName: string;
  styleName: string;
  imageUrl: string;
  demoLink: string;
  isManualOverride: true;
}

interface ManualPreviewPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (sel: ManualPreviewSelection) => void;
  /** Pre-select a sector when opening */
  initialSector?: string;
}

const getDemoSiteUrl = (sectorId: string) => {
  if (sectorId === "food") return "/r/impero-roma";
  if (sectorId === "ncc") return "/b/amalfi-luxury-transfer";
  const slug = DEMO_SLUGS[sectorId as keyof typeof DEMO_SLUGS] || sectorId;
  return `/demo/${slug}`;
};

export default function ManualPreviewPicker({ open, onClose, onSelect, initialSector }: ManualPreviewPickerProps) {
  const [search, setSearch] = useState("");
  const [activeSector, setActiveSector] = useState<string>(initialSector || "food");
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  // Filtered sectors by search
  const filteredSectors = useMemo(() => {
    if (!search.trim()) return SECTOR_PORTFOLIO;
    const q = search.toLowerCase();
    return SECTOR_PORTFOLIO.filter(s =>
      s.sectorLabel.toLowerCase().includes(q) ||
      s.sectorId.toLowerCase().includes(q) ||
      s.brands.some(b => b.name.toLowerCase().includes(q) || b.styles.some(st => st.name.toLowerCase().includes(q)))
    );
  }, [search]);

  const currentSector = useMemo(() => SECTOR_PORTFOLIO.find(s => s.sectorId === activeSector), [activeSector]);
  const currentBrand = useMemo(() => activeBrand ? currentSector?.brands.find(b => b.name === activeBrand) : null, [activeBrand, currentSector]);

  // Fallback flat mockups for sectors without portfolio brands
  const fallbackImages = useMemo(() => {
    if (currentSector) return [];
    const imgs = SECTOR_MOCKUP_IMAGES[activeSector as keyof typeof SECTOR_MOCKUP_IMAGES];
    return imgs || [];
  }, [activeSector, currentSector]);

  const totalMockups = useMemo(() => {
    let count = 0;
    SECTOR_PORTFOLIO.forEach(s => s.brands.forEach(b => b.styles.forEach(st => { count += st.screens.length; })));
    Object.values(SECTOR_MOCKUP_IMAGES).forEach(arr => { count += (arr as string[])?.length || 0; });
    return count;
  }, []);

  const handlePick = (brandName: string, styleName: string, imageUrl: string) => {
    const sectorLabel = currentSector?.sectorLabel || INDUSTRY_CONFIGS[activeSector as keyof typeof INDUSTRY_CONFIGS]?.label || activeSector;
    const demoLink = `${window.location.origin}${getDemoSiteUrl(activeSector)}`;
    onSelect({
      sectorId: activeSector,
      sectorLabel,
      brandName,
      styleName,
      imageUrl,
      demoLink,
      isManualOverride: true,
    });
    toast.success(`Preview "${brandName} ${styleName}" selezionata`);
    onClose();
  };

  // Available sectors list (portfolio + fallback only)
  const allAvailableSectors = useMemo(() => {
    const portfolioIds = new Set(SECTOR_PORTFOLIO.map(s => s.sectorId));
    const fallbackOnly = Object.keys(SECTOR_MOCKUP_IMAGES).filter(id => !portfolioIds.has(id as any));
    return [
      ...SECTOR_PORTFOLIO.map(s => ({ id: s.sectorId, label: s.sectorLabel, count: s.brands.reduce((acc, b) => acc + b.styles.length, 0) })),
      ...fallbackOnly.map(id => ({
        id,
        label: INDUSTRY_CONFIGS[id as keyof typeof INDUSTRY_CONFIGS]?.label || id,
        count: SECTOR_MOCKUP_IMAGES[id as keyof typeof SECTOR_MOCKUP_IMAGES]?.length || 0,
      })),
    ];
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-x-2 top-3 bottom-3 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:top-6 lg:bottom-6 lg:w-[1000px] z-50 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            style={{ background: "linear-gradient(160deg, #0a0a14, #0d0a1f 50%, #14091a)" }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between"
              style={{ background: "linear-gradient(90deg, rgba(167,139,250,0.08), rgba(20,184,166,0.05))" }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center shadow-lg shrink-0">
                  <Layers className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm lg:text-base font-black text-white tracking-tight truncate">
                    Galleria Preview Manuale
                  </h2>
                  <p className="text-[0.6rem] lg:text-[0.65rem] text-white/45">
                    {totalMockups}+ mockup • {SECTOR_PORTFOLIO.length} settori premium • Brand reali
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-2.5 border-b border-white/[0.05] shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cerca settore, brand o stile (es. food, COTE, obsidian)..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/40"
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sector sidebar */}
              <div className="w-[120px] lg:w-[180px] border-r border-white/[0.06] overflow-y-auto p-2 space-y-1 shrink-0"
                style={{ background: "rgba(0,0,0,0.35)" }}>
                <p className="text-[0.55rem] uppercase tracking-wider text-white/30 font-bold px-2 pt-1 pb-1">Settori</p>
                {allAvailableSectors
                  .filter(s => !search.trim() || s.label.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search.toLowerCase()))
                  .map(s => {
                  const isActive = activeSector === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => { setActiveSector(s.id); setActiveBrand(null); }}
                      className={`w-full text-left p-2 rounded-lg transition-all ${
                        isActive ? "bg-purple-500/15 border border-purple-500/30" : "hover:bg-white/[0.04] border border-transparent"
                      }`}
                    >
                      <p className={`text-[0.65rem] font-bold truncate ${isActive ? "text-purple-200" : "text-white/70"}`}>
                        {s.label}
                      </p>
                      <p className="text-[0.55rem] text-white/35">{s.count} stili</p>
                    </button>
                  );
                })}
              </div>

              {/* Brand + style + screens */}
              <div className="flex-1 overflow-y-auto p-3 lg:p-4">
                {currentSector ? (
                  <>
                    {/* Brand list */}
                    <div className="mb-3">
                      <p className="text-[0.6rem] uppercase tracking-wider text-white/40 font-bold mb-2">
                        Brand · {currentSector.brands.length}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => setActiveBrand(null)}
                          className={`px-2.5 py-1 rounded-lg text-[0.65rem] font-bold transition ${
                            !activeBrand ? "bg-purple-500/20 text-purple-200 border border-purple-500/40" : "bg-white/[0.04] text-white/55 border border-white/[0.06] hover:bg-white/[0.08]"
                          }`}
                        >
                          Tutti
                        </button>
                        {currentSector.brands.map(b => (
                          <button
                            key={b.name}
                            onClick={() => setActiveBrand(b.name)}
                            className={`px-2.5 py-1 rounded-lg text-[0.65rem] font-bold transition ${
                              activeBrand === b.name ? "bg-teal-500/20 text-teal-200 border border-teal-500/40" : "bg-white/[0.04] text-white/55 border border-white/[0.06] hover:bg-white/[0.08]"
                            }`}
                          >
                            {b.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Brands grid */}
                    {(currentBrand ? [currentBrand] : currentSector.brands).map(brand => (
                      <div key={brand.name} className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500/30 to-teal-500/30 flex items-center justify-center">
                            <ImageIcon className="w-3 h-3 text-white/70" />
                          </div>
                          <p className="text-xs font-black text-white">{brand.name}</p>
                          <span className="text-[0.6rem] text-white/40">{brand.styles.length} stili</span>
                        </div>
                        <div className="space-y-3">
                          {brand.styles.map(style => (
                            <div key={style.name} className="rounded-xl p-2.5 bg-white/[0.02] border border-white/[0.05]">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[0.65rem] font-bold text-purple-200">
                                  Stile: <span className="text-white">{style.name}</span>
                                </p>
                                <span className="text-[0.55rem] text-white/35">{style.screens.length} screen</span>
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                                {style.screens.map((src, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handlePick(brand.name, style.name, src)}
                                    className="group relative rounded-lg overflow-hidden aspect-[9/16] border border-white/10 hover:border-purple-400/60 hover:scale-[1.03] transition-all"
                                  >
                                    <img src={src} alt={`${brand.name} ${style.name} ${i + 1}`} loading="lazy" className="w-full h-full object-cover object-top" />
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent transition-opacity flex items-end justify-center pb-1.5">
                                      <span className="px-1.5 py-0.5 rounded-md bg-white/95 text-purple-900 text-[0.55rem] font-black flex items-center gap-1">
                                        <Check className="w-2.5 h-2.5" /> Usa
                                      </span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                ) : fallbackImages.length > 0 ? (
                  <>
                    <p className="text-[0.6rem] uppercase tracking-wider text-white/40 font-bold mb-2">
                      Mockup disponibili · {fallbackImages.length}
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {fallbackImages.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => handlePick(INDUSTRY_CONFIGS[activeSector as keyof typeof INDUSTRY_CONFIGS]?.label || activeSector, `Screen ${i + 1}`, src)}
                          className="group relative rounded-lg overflow-hidden aspect-[9/16] border border-white/10 hover:border-purple-400/60 hover:scale-[1.03] transition-all"
                        >
                          <img src={src} alt={`Preview ${i + 1}`} loading="lazy" className="w-full h-full object-cover object-top" />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-purple-900/90 to-transparent transition-opacity flex items-end justify-center pb-1.5">
                            <span className="px-1.5 py-0.5 rounded-md bg-white/95 text-purple-900 text-[0.55rem] font-black">Usa</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-white/40 text-xs">
                    Nessun mockup per questo settore.
                  </div>
                )}
              </div>
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-white/[0.06] flex items-center justify-between"
              style={{ background: "rgba(0,0,0,0.35)" }}>
              <p className="text-[0.6rem] text-white/40 flex items-center gap-1.5">
                <Eye className="w-3 h-3" /> Tap su un mockup per allegarlo al messaggio
              </p>
              <button onClick={onClose} className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[0.65rem] text-white/70 font-bold">
                Chiudi
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
