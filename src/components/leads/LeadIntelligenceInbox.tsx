// LeadIntelligenceInbox — pannello "report Intelligence" per il venditore.
// Lista tutti i lead analizzati, ordinati per score, filtrabili per categoria.
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Loader2, RefreshCw, Flame, Zap, Thermometer, Snowflake } from "lucide-react";
import LeadIntelligenceCard, { type IntelligenceReport } from "./LeadIntelligenceCard";

type CatFilter = "all" | "hot" | "warm" | "tiepido" | "freddo";

export default function LeadIntelligenceInbox() {
  const [reports, setReports] = useState<IntelligenceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CatFilter>("all");

  const load = async () => {
    setLoading(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u?.user) { setReports([]); return; }
      const { data } = await supabase
        .from("lead_intelligence_reports")
        .select("*")
        .eq("owner_id", u.user.id)
        .order("vendibility_score", { ascending: false })
        .limit(100);
      setReports((data as any) ?? []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Realtime: refresh quando l'autopilot inserisce nuovi report
  useEffect(() => {
    const ch = supabase
      .channel("lead_intelligence_reports_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "lead_intelligence_reports" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return reports;
    return reports.filter(r => r.category === filter);
  }, [reports, filter]);

  const counts = useMemo(() => ({
    all: reports.length,
    hot: reports.filter(r => r.category === "hot").length,
    warm: reports.filter(r => r.category === "warm").length,
    tiepido: reports.filter(r => r.category === "tiepido").length,
    freddo: reports.filter(r => r.category === "freddo").length,
  }), [reports]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-5"
      style={{ background: "rgba(15,15,30,0.6)", border: "1px solid rgba(124,58,237,0.18)", backdropFilter: "blur(20px)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <Brain className="w-5 h-5 text-violet-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Intelligence Inbox</h3>
            <p className="text-[11px] text-white/50">Lead analizzati con report, script vendita e proposta su misura</p>
          </div>
        </div>
        <button onClick={load} disabled={loading} className="p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin text-white/60" /> : <RefreshCw className="w-4 h-4 text-white/60" />}
        </button>
      </div>

      {/* Filtri categoria */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label={`Tutti (${counts.all})`} color="#9ca3af" />
        <FilterChip active={filter === "hot"} onClick={() => setFilter("hot")} label={`HOT ${counts.hot}`} color="#ef4444" Icon={Flame} />
        <FilterChip active={filter === "warm"} onClick={() => setFilter("warm")} label={`WARM ${counts.warm}`} color="#f59e0b" Icon={Zap} />
        <FilterChip active={filter === "tiepido"} onClick={() => setFilter("tiepido")} label={`TIEPIDO ${counts.tiepido}`} color="#3b82f6" Icon={Thermometer} />
        <FilterChip active={filter === "freddo"} onClick={() => setFilter("freddo")} label={`FREDDO ${counts.freddo}`} color="#9ca3af" Icon={Snowflake} />
      </div>

      {/* Lista report */}
      {loading && reports.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-white/50 text-xs">
          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Caricamento report…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-white/40 text-xs">
          Nessun lead analizzato in questa categoria.
          <br />
          <span className="text-[10px] text-white/30">Avvia l'Autopilot di Arianna o analizza manualmente i lead per popolare questa inbox.</span>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
          {filtered.map(r => (
            <LeadIntelligenceCard key={r.id} report={r} onUpdate={(updated) => setReports(prev => prev.map(x => x.id === updated.id ? updated : x))} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function FilterChip({ active, onClick, label, color, Icon }: { active: boolean; onClick: () => void; label: string; color: string; Icon?: any }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
      style={{
        background: active ? `${color}25` : "rgba(255,255,255,0.025)",
        border: `1px solid ${active ? color + "60" : "rgba(255,255,255,0.06)"}`,
        color: active ? color : "rgba(255,255,255,0.55)",
      }}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </button>
  );
}
