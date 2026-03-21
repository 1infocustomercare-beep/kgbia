import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { DEMO_INDUSTRY_DATA, DEMO_SLUGS } from "@/data/demo-industries";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Search, ArrowRight, ChevronDown, ChevronUp, Crown,
  ChefHat, Car, Scissors, Heart, Store, Dumbbell, Building,
  Umbrella, Wrench, Zap, Wheat, SprayCan, Scale, Calculator,
  Settings, Camera, HardHat, Flower2, Stethoscope, Pen,
  Baby, GraduationCap, PartyPopper, Truck, Puzzle, Sparkles
} from "lucide-react";
import IndustryPhoneShowcase from "@/components/public/IndustryPhoneShowcase";

const ALL_INDUSTRIES = Object.keys(INDUSTRY_CONFIGS) as IndustryId[];

/* ═══ Lucide icon mapping — w-4 h-4 for compact premium nodes ═══ */
const INDUSTRY_ICONS: Record<string, React.ReactNode> = {
  ChefHat: <ChefHat className="w-4 h-4" />,
  Car: <Car className="w-4 h-4" />,
  Scissors: <Scissors className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Store: <Store className="w-4 h-4" />,
  Dumbbell: <Dumbbell className="w-4 h-4" />,
  Building: <Building className="w-4 h-4" />,
  Umbrella: <Umbrella className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Wheat: <Wheat className="w-4 h-4" />,
  SprayCan: <SprayCan className="w-4 h-4" />,
  Scale: <Scale className="w-4 h-4" />,
  Calculator: <Calculator className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
  Camera: <Camera className="w-4 h-4" />,
  HardHat: <HardHat className="w-4 h-4" />,
  Flower2: <Flower2 className="w-4 h-4" />,
  Stethoscope: <Stethoscope className="w-4 h-4" />,
  Pen: <Pen className="w-4 h-4" />,
  Baby: <Baby className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  PartyPopper: <PartyPopper className="w-4 h-4" />,
  Truck: <Truck className="w-4 h-4" />,
  Puzzle: <Puzzle className="w-4 h-4" />,
};

function getIcon(iconName: string) {
  return INDUSTRY_ICONS[iconName] || <Puzzle className="w-4 h-4" />;
}

/* ═══ FEATURED DEMOS ═══ */
const FEATURED_DEMOS = [
  { id: "food" as IndustryId, name: "Food & Ristorazione", tagline: "Menu Digitale · Ordini · QR · Cucina Live", route: "/r/impero-roma", color: "#e85d04" },
  { id: "ncc" as IndustryId, name: "NCC & Trasporto Premium", tagline: "Flotta · Tratte · Booking · Autisti", route: "/b/amalfi-luxury-transfer", color: "#C9A84C" },
];

/* ═══ iPhone Preview ═══ */
function LivePhonePreview({ route, color, name }: { route: string; color: string; name: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative flex-shrink-0">
      <div className="absolute -inset-4 rounded-[36px] blur-3xl opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}50, transparent 70%)` }} />
      <div className="relative rounded-[26px] overflow-hidden w-[160px] sm:w-[200px]"
        style={{
          border: "2.5px solid rgba(255,255,255,0.15)",
          background: "linear-gradient(180deg, #2c2c2e 0%, #1c1c1e 3%, #0a0a0a 100%)",
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.1)`,
          aspectRatio: "9/19.2",
        }}>
        <div className="flex items-center justify-between px-3 pt-1.5 pb-0">
          <span className="text-[5.5px] font-semibold text-white/60 tracking-tight" style={{ fontFamily: "system-ui" }}>9:41</span>
          <div className="flex items-center gap-[3px]">
            <span className="text-[5px] text-white/50 font-medium">5G</span>
            <svg viewBox="0 0 25 12" className="w-[14px] h-[7px]">
              <rect x="0" y="0.5" width="21" height="11" rx="2" stroke="white" strokeOpacity="0.35" strokeWidth="1" fill="none" />
              <rect x="1.5" y="2" width="14" height="8" rx="1" fill="white" fillOpacity="0.5" />
            </svg>
          </div>
        </div>
        <div className="flex justify-center pt-0.5 pb-0.5">
          <div className="w-[46px] h-[13px] bg-black rounded-full" style={{ boxShadow: "0 0 0 0.5px rgba(255,255,255,0.06)" }} />
        </div>
        <div className="relative mx-[3px] mb-[3px] rounded-b-[22px] overflow-hidden" style={{ height: "calc(100% - 30px)" }}>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
              <motion.div className="w-5 h-5 rounded-full border-2 border-t-transparent" style={{ borderColor: color }}
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
            </div>
          )}
          <iframe src={route} title={name}
            className="w-[375px] h-[812px] origin-top-left border-0"
            style={{ transform: `scale(${160 / 375})`, transformOrigin: "top left", pointerEvents: "none" }}
            onLoad={() => setLoaded(true)} loading="lazy" />
        </div>
      </div>
    </div>
  );
}

/* ═══ SECTOR CATEGORIES for grouping ═══ */
const SECTOR_CATEGORIES = [
  { label: "In Evidenza", ids: ["food", "ncc"] as IndustryId[] },
  { label: "Benessere & Salute", ids: ["beauty", "healthcare", "fitness", "veterinary"] as IndustryId[] },
  { label: "Ospitalità", ids: ["hospitality", "beach", "agriturismo"] as IndustryId[] },
  { label: "Commercio", ids: ["retail"] as IndustryId[] },
  { label: "Servizi Professionali", ids: ["legal", "accounting", "photography", "education", "childcare"] as IndustryId[] },
  { label: "Artigianato & Tecnici", ids: ["plumber", "electrician", "construction", "gardening", "cleaning", "garage", "tattoo"] as IndustryId[] },
  { label: "Trasporti & Logistica", ids: ["logistics"] as IndustryId[] },
  { label: "Eventi & Altro", ids: ["events", "custom"] as IndustryId[] },
];

export default function DemoDirectoryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expandedSector, setExpandedSector] = useState<IndustryId | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_INDUSTRIES;
    const q = search.toLowerCase();
    return ALL_INDUSTRIES.filter(id => {
      const cfg = INDUSTRY_CONFIGS[id];
      const demo = DEMO_INDUSTRY_DATA[id];
      return cfg.label.toLowerCase().includes(q) || cfg.description.toLowerCase().includes(q) || demo.companyName.toLowerCase().includes(q);
    });
  }, [search]);

  const navigateToDemo = (id: IndustryId) => {
    const slug = DEMO_SLUGS[id];
    if (id === "food") navigate(`/r/${slug}`);
    else navigate(`/demo/${slug}`);
  };

  const isFeatured = (id: IndustryId) => FEATURED_DEMOS.some(f => f.id === id);
  const getFeatured = (id: IndustryId) => FEATURED_DEMOS.find(f => f.id === id);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#050508" }}>
      {/* ═══ PREMIUM BACKGROUND — fully opaque, no DNA bleed ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Rich gradient base */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(165deg, #08070e 0%, #0d0b18 20%, #0a0912 40%, #0e0c15 60%, #080710 80%, #050508 100%)"
        }} />

        {/* Ambient orbs — deep, rich, luxurious */}
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, hsla(265,45%,25%,0.12), transparent 60%)", filter: "blur(180px)" }} />
        <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, hsla(38,40%,22%,0.1), transparent 60%)", filter: "blur(160px)" }} />
        <div className="absolute top-[40%] left-[50%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, hsla(200,35%,20%,0.06), transparent 60%)", filter: "blur(140px)" }} />

        {/* Subtle geometric grid */}
        <div className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `linear-gradient(hsla(265,40%,60%,0.08) 1px, transparent 1px), linear-gradient(90deg, hsla(265,40%,60%,0.08) 1px, transparent 1px)`,
            backgroundSize: "80px 80px"
          }} />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 10%, hsla(265,50%,50%,0.15) 30%, hsla(38,45%,50%,0.12) 50%, hsla(265,50%,50%,0.1) 70%, transparent 90%)" }} />
      </div>

      {/* ═══ HEADER ═══ */}
      <div className="sticky top-0 z-40 border-b"
        style={{
          background: "linear-gradient(180deg, hsla(240,20%,5%,0.97), hsla(240,18%,4%,0.95))",
          backdropFilter: "blur(30px) saturate(1.6)",
          borderColor: "hsla(265,30%,30%,0.12)"
        }}>
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button onClick={() => navigate("/home")}
            className="p-2 rounded-xl transition-all duration-200 hover:scale-105"
            style={{ background: "hsla(265,30%,30%,0.12)", border: "1px solid hsla(265,30%,40%,0.1)" }}>
            <ArrowLeft className="w-4 h-4 text-foreground/60" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-foreground font-heading tracking-tight">Esplora i Settori</h1>
            <p className="text-[0.6rem] text-foreground/30 tracking-wide">{ALL_INDUSTRIES.length} demo live · Preview interattive</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: "hsla(150,40%,40%,0.08)", border: "1px solid hsla(150,40%,40%,0.1)" }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "hsla(150,60%,50%,0.8)" }} />
            <span className="text-[0.5rem] font-semibold tracking-wider" style={{ color: "hsla(150,50%,55%,0.7)" }}>LIVE</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 relative z-10">
        {/* ═══ SEARCH ═══ */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/20" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca settore..."
            className="pl-10 h-11 min-h-[44px] text-foreground placeholder:text-foreground/20 text-sm"
            style={{
              background: "hsla(240,18%,8%,0.95)",
              border: "1px solid hsla(265,25%,25%,0.15)",
              borderRadius: "0.875rem"
            }}
          />
        </div>

        {/* ═══ CONTENT ═══ */}
        {search.trim() ? (
          /* Flat filtered list */
          <div className="space-y-2">
            {filtered.map((id, i) => (
              <SectorCard key={id} id={id} index={i} isExpanded={expandedSector === id}
                onToggle={() => setExpandedSector(expandedSector === id ? null : id)}
                onNavigate={navigateToDemo} isFeatured={isFeatured(id)} featured={getFeatured(id)} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-foreground/30 text-sm">Nessun settore trovato per "{search}"</p>
              </div>
            )}
          </div>
        ) : (
          /* Categorized view */
          <div className="space-y-8">
            {SECTOR_CATEGORIES.map((cat, ci) => {
              const categoryIndustries = cat.ids.filter(id => ALL_INDUSTRIES.includes(id));
              if (categoryIndustries.length === 0) return null;
              return (
                <motion.div key={cat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.06 }}>
                  {/* Category header */}
                  <div className="flex items-center gap-2.5 mb-3 px-1">
                    <div className="h-px flex-1 max-w-[20px]"
                      style={{ background: "linear-gradient(90deg, hsla(265,40%,50%,0.25), transparent)" }} />
                    <span className="text-[0.55rem] font-bold tracking-[2.5px] uppercase text-foreground/50">{cat.label}</span>
                    <div className="h-px flex-1"
                      style={{ background: "linear-gradient(90deg, transparent, hsla(265,30%,40%,0.08))" }} />
                  </div>

                  <div className="space-y-2">
                    {categoryIndustries.map((id, i) => (
                      <SectorCard key={id} id={id} index={i} isExpanded={expandedSector === id}
                        onToggle={() => setExpandedSector(expandedSector === id ? null : id)}
                        onNavigate={navigateToDemo} isFeatured={isFeatured(id)} featured={getFeatured(id)} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ SECTOR CARD COMPONENT ═══ */
function SectorCard({ id, index, isExpanded, onToggle, onNavigate, isFeatured, featured }: {
  id: IndustryId;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (id: IndustryId) => void;
  isFeatured: boolean;
  featured?: { name: string; tagline: string; route: string; color: string };
}) {
  const navigate = useNavigate();
  const cfg = INDUSTRY_CONFIGS[id];
  const demo = DEMO_INDUSTRY_DATA[id];
  const color = featured?.color || cfg.defaultPrimaryColor;
  const label = featured?.name || cfg.label;
  const subtitle = featured?.tagline || `${demo.companyName} · ${cfg.description}`;
  const route = featured?.route || (id === "food" ? `/r/${DEMO_SLUGS[id]}` : `/b/${DEMO_SLUGS[id]}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025 }}>
      <div
        className={`relative rounded-2xl overflow-hidden group transition-all duration-300 ${isExpanded ? "ring-1" : ""}`}
        style={{
          background: isFeatured
            ? `linear-gradient(155deg, hsla(240,16%,10%,1), hsla(240,20%,7%,1))`
            : `linear-gradient(155deg, hsla(240,14%,9%,1), hsla(240,18%,6%,1))`,
          border: `1px solid ${isFeatured ? `${color}20` : "hsla(265,20%,22%,0.12)"}`,
          ...(isExpanded ? { boxShadow: `0 0 0 1px ${color}30` } : {}),
        }}>

        {/* Top accent — featured only */}
        {isFeatured && (
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, ${color}50, ${color}20, transparent)` }} />
        )}

        {/* Main row */}
        <div className="flex items-center gap-3 p-3.5 sm:p-4 cursor-pointer" onClick={onToggle}>
          {/* Icon node — premium circle with gradient ring */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            style={{
              background: `linear-gradient(145deg, ${color}18, ${color}08)`,
              boxShadow: `0 0 0 1px ${color}20, 0 2px 8px ${color}06`,
              color: color
            }}>
            {getIcon(cfg.icon)}
            {/* Subtle pulse for featured */}
            {isFeatured && (
              <motion.div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ border: `1px solid ${color}15` }}
                animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }} />
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-[0.8rem] sm:text-sm text-foreground font-heading truncate">{label}</h3>
              {isFeatured && (
                <span className="text-[0.45rem] px-1.5 py-0.5 rounded-full font-bold tracking-[1.5px] uppercase flex items-center gap-0.5 flex-shrink-0"
                  style={{ background: `${color}12`, color: color, border: `1px solid ${color}18` }}>
                  <Crown className="w-2 h-2" /> PREMIUM
                </span>
              )}
            </div>
            <p className="text-[0.58rem] sm:text-[0.65rem] text-foreground/60 truncate">{subtitle}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <motion.button
              onClick={(e) => { e.stopPropagation(); isFeatured ? navigate(route) : onNavigate(id); }}
              className="px-3 py-1.5 rounded-xl text-[0.55rem] sm:text-[0.6rem] font-semibold transition-all hidden sm:flex items-center gap-1 hover:scale-105"
              style={isFeatured ? {
                backgroundColor: color,
                color: "#fff",
                boxShadow: `0 3px 12px ${color}25`
              } : {
                background: "hsla(265,20%,20%,0.2)",
                border: "1px solid hsla(265,20%,25%,0.15)",
                color: "hsla(0,0%,100%,0.8)"
              }}
              whileTap={{ scale: 0.95 }}>
              {isFeatured ? "Demo Live" : "Apri Demo"} <ArrowRight className="w-2.5 h-2.5" />
            </motion.button>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "hsla(265,20%,20%,0.1)" }}>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-foreground/25" /> : <ChevronDown className="w-3.5 h-3.5 text-foreground/25" />}
            </div>
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-4 pb-5 pt-1">
                {/* Separator */}
                <div className="h-px mb-4" style={{ background: `linear-gradient(90deg, transparent, ${color}15, transparent)` }} />

                <div className="flex justify-center mb-4">
                  <LivePhonePreview route={route} color={color} name={label} />
                </div>
                <IndustryPhoneShowcase industryId={id} />

                {/* CTA */}
                <div className="flex justify-center mt-4">
                  <motion.button onClick={() => isFeatured ? navigate(route) : onNavigate(id)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 min-h-[40px] transition-all hover:scale-105"
                    style={{ backgroundColor: color, boxShadow: `0 4px 16px ${color}20` }} whileTap={{ scale: 0.95 }}>
                    <Sparkles className="w-3.5 h-3.5" />
                    Apri Demo Live <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
