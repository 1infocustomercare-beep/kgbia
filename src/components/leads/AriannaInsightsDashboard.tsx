// AriannaInsightsDashboard — "Cosa ho imparato"
// Dashboard analytics che mostra al venditore le performance dell'autopilot Arianna:
// - Top zone × settore con conversion rate
// - Trend ultimi 7 giorni (cicli, lead caldi, crediti spesi)
// - Insights testuali generati lato client (es. "Milano/beauty rende il triplo della media")
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Brain, TrendingUp, Award, Flame, Coins, Sparkles,
  ChevronDown, ChevronUp, BarChart3, MapPin,
} from "lucide-react";

interface LearningRow {
  id: string;
  city: string;
  sector: string;
  cycle_number: number;
  leads_scanned: number;
  leads_passed_filters: number;
  leads_saved_to_pipeline: number;
  leads_replied: number;
  leads_converted: number;
  credits_spent: number;
  performance_score: number;
  status: string;
  created_at: string;
}

interface ZoneStats {
  key: string;
  city: string;
  sector: string;
  cycles: number;
  hotLeads: number;
  conversion: number; // pct
  creditsSpent: number;
  avgScore: number;
}

export default function AriannaInsightsDashboard() {
  const [rows, setRows] = useState<LearningRow[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("arianna_learning_log" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(200);
      if (!cancelled) {
        setRows((data ?? []) as any);
        setLoading(false);
      }
    })();

    const ch = supabase.channel("arianna-insights")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "arianna_learning_log" }, async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("arianna_learning_log" as any)
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(200);
        setRows((data ?? []) as any);
      })
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, []);

  /* ─── Aggregazioni ─── */
  const zoneStats: ZoneStats[] = useMemo(() => {
    const map = new Map<string, ZoneStats>();
    rows.forEach(r => {
      const key = `${r.city}|${r.sector}`;
      const cur = map.get(key) ?? {
        key, city: r.city, sector: r.sector,
        cycles: 0, hotLeads: 0, conversion: 0, creditsSpent: 0, avgScore: 0,
      };
      cur.cycles += 1;
      cur.hotLeads += r.leads_saved_to_pipeline;
      cur.creditsSpent += r.credits_spent;
      cur.avgScore += r.performance_score;
      map.set(key, cur);
    });
    return Array.from(map.values()).map(z => ({
      ...z,
      conversion: z.cycles > 0 ? Math.round((z.hotLeads / z.cycles) * 100) / 100 : 0,
      avgScore: z.cycles > 0 ? Math.round(z.avgScore / z.cycles) : 0,
    })).sort((a, b) => b.hotLeads - a.hotLeads).slice(0, 6);
  }, [rows]);

  const totals = useMemo(() => {
    const last7 = rows.filter(r => Date.now() - new Date(r.created_at).getTime() < 7 * 24 * 3600_000);
    return {
      cyclesTotal: rows.length,
      cycles7d: last7.length,
      hotLeadsTotal: rows.reduce((s, r) => s + r.leads_saved_to_pipeline, 0),
      hotLeads7d: last7.reduce((s, r) => s + r.leads_saved_to_pipeline, 0),
      creditsTotal: rows.reduce((s, r) => s + r.credits_spent, 0),
      credits7d: last7.reduce((s, r) => s + r.credits_spent, 0),
      avgPerformance: rows.length ? Math.round(rows.reduce((s, r) => s + r.performance_score, 0) / rows.length) : 0,
    };
  }, [rows]);

  const insights = useMemo<string[]>(() => {
    const out: string[] = [];
    if (zoneStats.length === 0) return out;
    const best = zoneStats[0];
    if (best && best.hotLeads > 0) {
      out.push(`🏆 ${best.city} · ${best.sector} è la tua zona top: ${best.hotLeads} lead caldi in ${best.cycles} cicli.`);
    }
    const avgConv = zoneStats.reduce((s, z) => s + z.conversion, 0) / Math.max(zoneStats.length, 1);
    const overperformer = zoneStats.find(z => z.conversion > avgConv * 1.8 && z.cycles >= 2);
    if (overperformer) {
      out.push(`📈 ${overperformer.city}/${overperformer.sector} converte il ${Math.round((overperformer.conversion / avgConv) * 100)}% sopra la media.`);
    }
    if (totals.cycles7d > 5 && totals.hotLeads7d === 0) {
      out.push(`⚠️ Ultimi 7 giorni: 0 lead caldi su ${totals.cycles7d} cicli — forse settori saturi, Arianna sta esplorando nuove zone.`);
    }
    if (totals.credits7d > 0 && totals.hotLeads7d > 0) {
      const cpl = (totals.credits7d / totals.hotLeads7d).toFixed(1);
      out.push(`💰 Costo medio per lead caldo: ${cpl} crediti negli ultimi 7 giorni.`);
    }
    return out.slice(0, 4);
  }, [zoneStats, totals]);

  if (loading) return null;
  if (rows.length === 0) return null; // niente da mostrare finché Arianna non ha lavorato

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(34,197,94,0.06), rgba(167,139,250,0.06))",
        border: "1px solid rgba(167,139,250,0.25)",
      }}
    >
      <button onClick={() => setCollapsed(c => !c)} className="w-full p-3 flex items-center justify-between text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
            background: "linear-gradient(135deg, #a78bfa, #4ade80)",
          }}>
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-foreground">Cosa ho imparato</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{
                background: "rgba(167,139,250,0.18)", color: "#c4b5fd",
              }}>INSIGHTS</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {totals.cyclesTotal} cicli analizzati · performance media {totals.avgPerformance}/100
            </p>
          </div>
        </div>
        {collapsed ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 space-y-3 border-t border-white/5 pt-3">
          {/* KPI 7gg */}
          <div className="grid grid-cols-4 gap-1.5">
            <Stat icon={<BarChart3 className="w-3 h-3" />} value={totals.cycles7d} label="cicli 7g" color="#a78bfa" />
            <Stat icon={<Flame className="w-3 h-3" />} value={totals.hotLeads7d} label="caldi 7g" color="#fb923c" />
            <Stat icon={<Coins className="w-3 h-3" />} value={totals.credits7d} label="crediti 7g" color="#fbbf24" />
            <Stat icon={<TrendingUp className="w-3 h-3" />} value={`${totals.avgPerformance}%`} label="performance" color="#4ade80" />
          </div>

          {/* Insights testuali */}
          {insights.length > 0 && (
            <div className="space-y-1">
              {insights.map((ins, i) => (
                <div key={i} className="text-[10.5px] leading-relaxed px-2 py-1.5 rounded" style={{
                  background: "rgba(167,139,250,0.08)", color: "#e9d5ff",
                }}>
                  {ins}
                </div>
              ))}
            </div>
          )}

          {/* Top zone */}
          {zoneStats.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground mb-1.5">
                <Award className="w-3 h-3 text-amber-400" />
                Top zone × settore (ordinato per lead caldi)
              </div>
              <div className="space-y-1">
                {zoneStats.map((z, i) => (
                  <div key={z.key} className="flex items-center gap-2 px-2 py-1.5 rounded text-[10.5px]" style={{
                    background: i === 0 ? "rgba(251,191,36,0.08)" : "rgba(0,0,0,0.25)",
                    border: i === 0 ? "1px solid rgba(251,191,36,0.25)" : "1px solid rgba(255,255,255,0.05)",
                  }}>
                    <span className="w-4 text-center font-bold" style={{ color: i === 0 ? "#fbbf24" : "#9ca3af" }}>
                      #{i + 1}
                    </span>
                    <MapPin className="w-3 h-3 text-violet-300 shrink-0" />
                    <span className="font-semibold text-foreground flex-1 truncate">
                      {z.city} <span className="text-muted-foreground">·</span> {z.sector}
                    </span>
                    <span className="text-[9px] text-muted-foreground">{z.cycles} cicli</span>
                    <span className="text-[9px] font-bold text-emerald-300">🔥 {z.hotLeads}</span>
                    <span className="text-[9px] text-amber-300">{z.creditsSpent}c</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-[9px] text-center text-muted-foreground/70 flex items-center justify-center gap-1 pt-1">
            <Sparkles className="w-2.5 h-2.5" />
            Arianna usa questi dati per decidere automaticamente dove cercare il prossimo ciclo
          </div>
        </div>
      )}
    </motion.div>
  );
}

function Stat({ icon, value, label, color }: { icon: React.ReactNode; value: number | string; label: string; color: string }) {
  return (
    <div className="text-center p-1.5 rounded" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="flex items-center justify-center gap-1" style={{ color }}>
        {icon}
        <span className="text-sm font-bold">{value}</span>
      </div>
      <div className="text-[8px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}
