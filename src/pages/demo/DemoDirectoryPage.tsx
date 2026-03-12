import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { DEMO_INDUSTRY_DATA, DEMO_SLUGS } from "@/data/demo-industries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, ArrowRight } from "lucide-react";

const ALL_INDUSTRIES = Object.keys(INDUSTRY_CONFIGS) as IndustryId[];

export default function DemoDirectoryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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
            <p className="text-xs text-white/50">{ALL_INDUSTRIES.length} settori disponibili</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((id, i) => {
            const cfg = INDUSTRY_CONFIGS[id];
            const demo = DEMO_INDUSTRY_DATA[id];
            const slug = DEMO_SLUGS[id];

            return (
              <motion.div key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  className="bg-white/5 border-white/10 hover:border-white/25 transition-all cursor-pointer group hover:scale-[1.02]"
                  onClick={() => {
                    // food uses /r/impero-roma, ncc uses /ncc-demo/slug, others use /demo/slug
                    if (id === "food") navigate(`/r/${slug}`);
                    else navigate(`/demo/${slug}`);
                  }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{cfg.emoji}</span>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{cfg.label}</h3>
                    <p className="text-xs text-white/50 mb-3 line-clamp-2">{cfg.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.defaultPrimaryColor }} />
                      <span className="text-[10px] text-white/40 font-medium">{demo.companyName}</span>
                    </div>
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
