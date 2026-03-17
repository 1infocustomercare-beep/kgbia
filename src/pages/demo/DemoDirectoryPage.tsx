import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { DEMO_INDUSTRY_DATA, DEMO_SLUGS } from "@/data/demo-industries";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, ArrowRight, ChevronDown, ChevronUp, Star, Crown } from "lucide-react";
import IndustryPhoneShowcase from "@/components/public/IndustryPhoneShowcase";

const ALL_INDUSTRIES = Object.keys(INDUSTRY_CONFIGS) as IndustryId[];

/* ═══ FEATURED DEMOS — fully customized public sites ═══ */
const FEATURED_DEMOS = [
  {
    id: "food" as IndustryId,
    name: "Impero Roma",
    tagline: "Ristorante Premium · Roma",
    route: "/r/impero-roma",
    emoji: "🍽️",
    color: "#e85d04",
    gradient: "linear-gradient(135deg, #e85d0420, #ff6b3508)",
    border: "#e85d0430",
  },
  {
    id: "ncc" as IndustryId,
    name: "Amalfi Luxury Transfer",
    tagline: "NCC Premium · Costiera Amalfitana",
    route: "/b/amalfi-luxury-transfer",
    emoji: "🚗",
    color: "#C9A84C",
    gradient: "linear-gradient(135deg, #C9A84C20, #8B6F2E08)",
    border: "#C9A84C30",
  },
];

/* ═══ iPhone Frame for iframe preview ═══ */
function LivePhonePreview({ route, color, name }: { route: string; color: string; name: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative flex-shrink-0">
      {/* Ambient glow */}
      <div className="absolute -inset-4 rounded-[36px] blur-3xl opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color}50, transparent 70%)` }} />

      {/* iPhone shell */}
      <div className="relative rounded-[26px] overflow-hidden w-[160px] sm:w-[200px]"
        style={{
          border: "2.5px solid rgba(255,255,255,0.15)",
          background: "linear-gradient(180deg, #2c2c2e 0%, #1c1c1e 3%, #0a0a0a 100%)",
          boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.08)`,
          aspectRatio: "9/19.2",
        }}>

        {/* Status bar */}
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

        {/* Dynamic Island */}
        <div className="flex justify-center pt-0.5 pb-0.5">
          <div className="w-[46px] h-[13px] bg-black rounded-full" style={{ boxShadow: "0 0 0 0.5px rgba(255,255,255,0.06)" }} />
        </div>

        {/* Live iframe */}
        <div className="relative mx-[3px] mb-[3px] rounded-b-[22px] overflow-hidden" style={{ height: "calc(100% - 30px)" }}>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
              <motion.div className="w-5 h-5 rounded-full border-2 border-t-transparent" style={{ borderColor: color }}
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
            </div>
          )}
          <iframe
            src={route}
            title={name}
            className="w-[375px] h-[812px] origin-top-left border-0"
            style={{
              transform: `scale(${160 / 375})`,
              transformOrigin: "top left",
              pointerEvents: "none",
            }}
            onLoad={() => setLoaded(true)}
            loading="lazy"
          />
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
      return cfg.label.toLowerCase().includes(q) ||
        cfg.description.toLowerCase().includes(q) ||
        demo.companyName.toLowerCase().includes(q);
    });
  }, [search]);

  const navigateToDemo = (id: IndustryId) => {
    const slug = DEMO_SLUGS[id];
    if (id === "food") navigate(`/r/${slug}`);
    else navigate(`/demo/${slug}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="p-2 rounded-lg hover:bg-white/10 transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Demo Live per Settore</h1>
            <p className="text-xs text-white/50">{ALL_INDUSTRIES.length} settori · Preview interattive</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ═══ FEATURED — Customized Premium Demos ═══ */}
        {!search.trim() && (
          <motion.div className="mb-10"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            <div className="flex items-center gap-2 mb-5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold tracking-[3px] uppercase text-amber-400/80">Showcase Premium</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURED_DEMOS.map((demo, i) => (
                <motion.div key={demo.id}
                  className="rounded-2xl overflow-hidden cursor-pointer group"
                  style={{
                    background: demo.gradient,
                    border: `1px solid ${demo.border}`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => navigate(demo.route)}
                >
                  <div className="flex items-start gap-4 p-4 sm:p-5">
                    {/* Phone mockup */}
                    <div className="flex-shrink-0 hidden sm:block">
                      <LivePhonePreview route={demo.route} color={demo.color} name={demo.name} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{demo.emoji}</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-bold tracking-[2px] uppercase"
                          style={{ background: `${demo.color}20`, color: demo.color, border: `1px solid ${demo.color}30` }}>
                          <Star className="w-2.5 h-2.5" fill="currentColor" /> Personalizzato
                        </div>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mb-1">{demo.name}</h3>
                      <p className="text-[11px] text-white/45 mb-4">{demo.tagline}</p>

                      {/* Mini phone on mobile */}
                      <div className="sm:hidden flex justify-center mb-4">
                        <LivePhonePreview route={demo.route} color={demo.color} name={demo.name} />
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          className="px-4 py-2 rounded-xl text-[11px] font-bold text-white flex items-center gap-1.5"
                          style={{ backgroundColor: demo.color }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => { e.stopPropagation(); navigate(demo.route); }}
                        >
                          Apri Demo Live <ArrowRight className="w-3 h-3" />
                        </motion.button>
                        <motion.button
                          className="px-3 py-2 rounded-xl text-[11px] font-semibold text-white/60 border border-white/10 hover:bg-white/5"
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => { e.stopPropagation(); setExpandedSector(demo.id); }}
                        >
                          Vedi Mockup
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca settore..."
            className="bg-white/5 border-white/10 text-white pl-10 h-11 min-h-[44px] placeholder:text-white/30"
          />
        </div>

        {/* ═══ All Sectors Grid ═══ */}
        <div className="space-y-4">
          {filtered.map((id, i) => {
            const cfg = INDUSTRY_CONFIGS[id];
            const demo = DEMO_INDUSTRY_DATA[id];
            const isExpanded = expandedSector === id;
            const isFeatured = FEATURED_DEMOS.some(f => f.id === id);

            return (
              <motion.div key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <Card className={`border-white/10 hover:border-white/20 transition-all overflow-hidden ${isFeatured ? 'bg-white/[0.05]' : 'bg-white/[0.03]'}`}>
                  <CardContent className="p-0">
                    {/* Header row */}
                    <div className="flex items-center gap-3 p-4 cursor-pointer"
                      onClick={() => setExpandedSector(isExpanded ? null : id)}>
                      <span className="text-2xl">{cfg.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm">{cfg.label}</h3>
                          {isFeatured && (
                            <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold tracking-wider uppercase"
                              style={{ background: `${cfg.defaultPrimaryColor}20`, color: cfg.defaultPrimaryColor, border: `1px solid ${cfg.defaultPrimaryColor}30` }}>
                              ★ Ready
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-white/40 truncate">{demo.companyName} · {cfg.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.defaultPrimaryColor }} />
                        <motion.button
                          onClick={(e) => { e.stopPropagation(); navigateToDemo(id); }}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-semibold border border-white/10 hover:bg-white/10 transition hidden sm:block"
                          whileTap={{ scale: 0.95 }}
                        >
                          Apri Demo
                        </motion.button>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                      </div>
                    </div>

                    {/* Expandable phone showcase */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-5 pt-1">
                            <IndustryPhoneShowcase industryId={id} />
                            <div className="flex justify-center mt-4">
                              <motion.button
                                onClick={() => navigateToDemo(id)}
                                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 min-h-[40px]"
                                style={{ backgroundColor: cfg.defaultPrimaryColor }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Apri Demo Live <ArrowRight className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
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