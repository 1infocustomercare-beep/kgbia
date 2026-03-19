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
  Baby, GraduationCap, PartyPopper, Truck, Puzzle
} from "lucide-react";
import IndustryPhoneShowcase from "@/components/public/IndustryPhoneShowcase";

const ALL_INDUSTRIES = Object.keys(INDUSTRY_CONFIGS) as IndustryId[];

/* ═══ Lucide icon mapping by industry ═══ */
const INDUSTRY_ICONS: Record<string, React.ReactNode> = {
  ChefHat: <ChefHat className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  Scissors: <Scissors className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Store: <Store className="w-5 h-5" />,
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  Building: <Building className="w-5 h-5" />,
  Umbrella: <Umbrella className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Wheat: <Wheat className="w-5 h-5" />,
  SprayCan: <SprayCan className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Calculator: <Calculator className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  Camera: <Camera className="w-5 h-5" />,
  HardHat: <HardHat className="w-5 h-5" />,
  Flower2: <Flower2 className="w-5 h-5" />,
  Stethoscope: <Stethoscope className="w-5 h-5" />,
  Pen: <Pen className="w-5 h-5" />,
  Baby: <Baby className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  PartyPopper: <PartyPopper className="w-5 h-5" />,
  Truck: <Truck className="w-5 h-5" />,
  Puzzle: <Puzzle className="w-5 h-5" />,
};

function getIcon(iconName: string) {
  return INDUSTRY_ICONS[iconName] || <Puzzle className="w-5 h-5" />;
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

  return (
    <div className="min-h-screen relative" style={{ background: "linear-gradient(180deg, #06060a 0%, #0c0c14 30%, #0a0a10 60%, #080810 100%)" }}>
      {/* Premium subtle mesh background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] right-[10%] w-[600px] h-[600px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, hsla(265,60%,50%,0.5), transparent 65%)", filter: "blur(150px)" }} />
        <div className="absolute bottom-[20%] left-[5%] w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsla(38,55%,50%,0.4), transparent 65%)", filter: "blur(130px)" }} />
        <div className="absolute top-[50%] left-[40%] w-[400px] h-[400px] rounded-full opacity-[0.02]"
          style={{ background: "radial-gradient(circle, hsla(150,50%,45%,0.3), transparent 65%)", filter: "blur(120px)" }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsla(0,0%,100%,0.04) 1px, transparent 1px), linear-gradient(90deg, hsla(0,0%,100%,0.04) 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }} />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-2xl border-b"
        style={{ background: "hsla(230,20%,5%,0.88)", borderColor: "hsla(0,0%,100%,0.06)" }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/home")}
            className="p-2.5 rounded-xl transition-all duration-200 hover:scale-105"
            style={{ background: "hsla(0,0%,100%,0.05)", border: "1px solid hsla(0,0%,100%,0.08)" }}>
            <ArrowLeft className="w-4 h-4 text-white/70" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white font-heading tracking-tight">Demo Live per Settore</h1>
            <p className="text-[0.65rem] text-white/40 tracking-wide">{ALL_INDUSTRIES.length} settori · Preview interattive</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca settore..."
            className="pl-11 h-12 min-h-[48px] text-white placeholder:text-white/25"
            style={{
              background: "hsla(230,20%,8%,0.9)",
              border: "1px solid hsla(0,0%,100%,0.08)",
              borderRadius: "1rem"
            }}
          />
        </div>

        {/* ═══ Grid ═══ */}
        <div className="space-y-2.5">
          {/* Featured demos at top */}
          {!search.trim() && FEATURED_DEMOS.map((feat, i) => {
            const cfg = INDUSTRY_CONFIGS[feat.id];
            const isExpanded = expandedSector === feat.id;
            return (
              <motion.div key={`feat-${feat.id}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <div className="relative rounded-2xl overflow-hidden group transition-all duration-300"
                  style={{
                    background: "linear-gradient(145deg, hsla(230,18%,9%,0.98), hsla(235,22%,6%,0.98))",
                    border: `1px solid ${feat.color}25`,
                    boxShadow: `0 4px 30px ${feat.color}08`
                  }}>
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${feat.color}60, ${feat.color}30, transparent)` }} />

                  <div className="flex items-center gap-4 p-4 sm:p-5 cursor-pointer"
                    onClick={() => setExpandedSector(isExpanded ? null : feat.id)}>
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${feat.color}15`, color: feat.color, boxShadow: `0 0 20px ${feat.color}10` }}>
                      {getIcon(cfg.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-sm text-white font-heading">{feat.name}</h3>
                        <span className="text-[0.5rem] px-2 py-0.5 rounded-full font-bold tracking-[1.5px] uppercase flex items-center gap-1"
                          style={{ background: `${feat.color}15`, color: feat.color, border: `1px solid ${feat.color}25` }}>
                          <Crown className="w-2.5 h-2.5" /> PREMIUM
                        </span>
                      </div>
                      <p className="text-[0.65rem] text-white/40">{feat.tagline}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); navigate(feat.route); }}
                        className="px-4 py-2 rounded-xl text-[0.65rem] font-bold text-white hidden sm:flex items-center gap-1.5 transition-all duration-200 hover:scale-105"
                        style={{ backgroundColor: feat.color, boxShadow: `0 4px 16px ${feat.color}30` }}
                        whileTap={{ scale: 0.95 }}>
                        Demo Live <ArrowRight className="w-3 h-3" />
                      </motion.button>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-white/25" /> : <ChevronDown className="w-4 h-4 text-white/25" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="px-5 pb-6 pt-1">
                          <div className="flex justify-center mb-4">
                            <LivePhonePreview route={feat.route} color={feat.color} name={feat.name} />
                          </div>
                          <IndustryPhoneShowcase industryId={feat.id} />
                          <div className="flex justify-center mt-4">
                            <motion.button onClick={() => navigate(feat.route)}
                              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 min-h-[40px] transition-all hover:scale-105"
                              style={{ backgroundColor: feat.color, boxShadow: `0 4px 20px ${feat.color}30` }} whileTap={{ scale: 0.95 }}>
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
          })}

          {/* All other sectors */}
          {filtered.filter(id => !FEATURED_DEMOS.some(f => f.id === id) || search.trim()).map((id, i) => {
            const cfg = INDUSTRY_CONFIGS[id];
            const demo = DEMO_INDUSTRY_DATA[id];
            const isExpanded = expandedSector === id;
            const color = cfg.defaultPrimaryColor;

            return (
              <motion.div key={id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}>
                <div className="relative rounded-2xl overflow-hidden group transition-all duration-300 hover:border-white/15"
                  style={{
                    background: "linear-gradient(145deg, hsla(230,16%,9%,0.95), hsla(235,20%,6%,0.95))",
                    border: "1px solid hsla(0,0%,100%,0.07)"
                  }}>
                  <div className="flex items-center gap-3.5 p-4 cursor-pointer"
                    onClick={() => setExpandedSector(isExpanded ? null : id)}>
                    {/* Icon container */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${color}12`, color: color }}>
                      {getIcon(cfg.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-white font-heading">{cfg.label}</h3>
                      <p className="text-[0.6rem] text-white/35 truncate">{demo.companyName} · {cfg.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); navigateToDemo(id); }}
                        className="px-3.5 py-1.5 rounded-xl text-[0.6rem] font-semibold transition-all hidden sm:block hover:scale-105"
                        style={{ background: "hsla(0,0%,100%,0.06)", border: "1px solid hsla(0,0%,100%,0.1)", color: "hsla(0,0%,100%,0.7)" }}
                        whileTap={{ scale: 0.95 }}>
                        Apri Demo
                      </motion.button>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-white/25" /> : <ChevronDown className="w-4 h-4 text-white/25" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="px-4 pb-5 pt-1">
                          <div className="flex justify-center mb-4">
                            <LivePhonePreview
                              route={id === "food" ? `/r/${DEMO_SLUGS[id]}` : `/b/${DEMO_SLUGS[id]}`}
                              color={color} name={cfg.label} />
                          </div>
                          <IndustryPhoneShowcase industryId={id} />
                          <div className="flex justify-center mt-4">
                            <motion.button onClick={() => navigateToDemo(id)}
                              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 min-h-[40px] transition-all hover:scale-105"
                              style={{ backgroundColor: color, boxShadow: `0 4px 16px ${color}25` }} whileTap={{ scale: 0.95 }}>
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
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/40 text-sm">Nessun settore trovato per "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
