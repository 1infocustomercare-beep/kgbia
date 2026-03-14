import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { DEMO_INDUSTRY_DATA, DEMO_SLUGS } from "@/data/demo-industries";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import IndustryPhoneShowcase from "@/components/public/IndustryPhoneShowcase";

const ALL_INDUSTRIES = Object.keys(INDUSTRY_CONFIGS) as IndustryId[];

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
      <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="p-2 rounded-lg hover:bg-white/10 transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Demo Live per Settore</h1>
            <p className="text-xs text-white/50">{ALL_INDUSTRIES.length} settori · 4 preview per ciascuno</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
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

        {/* Grid */}
        <div className="space-y-4">
          {filtered.map((id, i) => {
            const cfg = INDUSTRY_CONFIGS[id];
            const demo = DEMO_INDUSTRY_DATA[id];
            const isExpanded = expandedSector === id;

            return (
              <motion.div key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <Card className="bg-white/[0.03] border-white/10 hover:border-white/20 transition-all overflow-hidden">
                  <CardContent className="p-0">
                    {/* Header row */}
                    <div className="flex items-center gap-3 p-4 cursor-pointer"
                      onClick={() => setExpandedSector(isExpanded ? null : id)}>
                      <span className="text-2xl">{cfg.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm">{cfg.label}</h3>
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
