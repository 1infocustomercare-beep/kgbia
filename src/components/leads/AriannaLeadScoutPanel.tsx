// AriannaLeadScoutPanel — Autopilot Adattivo.
// Arianna sceglie da sola zone+settori, scansiona, filtra solo lead "caldi"
// (no sito + no social + rating ≥4.0/20+ rec + settori premium) e impara dai risultati.
// ZERO selettori manuali: il venditore accende l'interruttore e basta.
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Bot, Loader2, Activity, ChevronDown, ChevronUp, Brain,
  Sparkles, MapPin, Layers, Zap, TrendingUp, Target, Clock, Flame, Settings2,
} from "lucide-react";
import AriannaCriteriaOverrideDialog from "./AriannaCriteriaOverrideDialog";

interface AutopilotState {
  is_running: boolean;
  current_city: string | null;
  current_sector: string | null;
  cycles_completed: number;
  hot_leads_found: number;
  last_cycle_at: string | null;
  next_cycle_at: string | null;
  zone_sector_weights: Record<string, number>;
  auto_tune_enabled?: boolean;
  last_tuned_at?: string | null;
  quality_filters: {
    require_no_website: boolean;
    require_no_social: boolean;
    min_rating: number;
    min_reviews: number;
    premium_sectors_only: boolean;
    premium_sectors?: string[];
  };
}

interface LearningRow {
  id: string;
  city: string;
  sector: string;
  cycle_number: number;
  leads_scanned: number;
  leads_passed_filters: number;
  leads_saved_to_pipeline: number;
  decision_reasoning: string | null;
  status: string;
  created_at: string;
}

// Pilot legacy (kept for back-compat, ma non più usato dall'autopilot adattivo)
export interface AriannaPilot {
  setSearchInputs?: (city: string, sector: string) => void;
  triggerSearch?: () => Promise<void>;
  triggerDemoFactoryOnTopLead?: () => Promise<void>;
  getResultsCount?: () => number;
  getTopLead?: () => any;
}

interface Props {
  pilot?: AriannaPilot;
  defaultTarget?: { city: string; sector: string };
}

export default function AriannaLeadScoutPanel(_props: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [state, setState] = useState<AutopilotState | null>(null);
  const [history, setHistory] = useState<LearningRow[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [criteriaDialogOpen, setCriteriaDialogOpen] = useState(false);
  const cycleTimerRef = useRef<number | null>(null);

  /* ─── Load state + live stream ─── */
  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const { data: st } = await supabase
      .from("arianna_autopilot_state" as any)
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!st) {
      const { data: created } = await supabase
        .from("arianna_autopilot_state" as any)
        .insert({ user_id: user.id, is_running: false })
        .select("*")
        .single();
      setState(created as any);
    } else {
      setState(st as any);
    }

    const { data: hist } = await supabase
      .from("arianna_learning_log" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(15);
    setHistory((hist ?? []) as any);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase.channel("arianna-autopilot-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "arianna_autopilot_state" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "arianna_learning_log" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  /* ─── Countdown live al prossimo ciclo ─── */
  useEffect(() => {
    if (!state?.is_running || !state.next_cycle_at) {
      setCountdown(0);
      return;
    }
    const update = () => {
      const diff = Math.max(0, Math.floor((new Date(state.next_cycle_at!).getTime() - Date.now()) / 1000));
      setCountdown(diff);
    };
    update();
    const t = window.setInterval(update, 1000);
    return () => window.clearInterval(t);
  }, [state?.is_running, state?.next_cycle_at]);

  /* ─── Loop automatico: chiama edge function quando countdown finisce ─── */
  useEffect(() => {
    if (!state?.is_running || !userId) {
      if (cycleTimerRef.current) { window.clearTimeout(cycleTimerRef.current); cycleTimerRef.current = null; }
      return;
    }
    const nextAt = state.next_cycle_at ? new Date(state.next_cycle_at).getTime() : Date.now();
    const delay = Math.max(1000, nextAt - Date.now());
    cycleTimerRef.current = window.setTimeout(() => {
      runCycle(false);
    }, delay);
    return () => {
      if (cycleTimerRef.current) window.clearTimeout(cycleTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.is_running, state?.next_cycle_at, userId]);

  /* ─── Esegui ciclo ─── */
  const runCycle = useCallback(async (showToast = true) => {
    if (!userId || loading) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("arianna-autopilot", {
        body: { user_id: userId, action: "run_cycle" },
      });
      if (error) {
        toast.error("Arianna: " + error.message);
      } else if (data?.success) {
        if (showToast) {
          if (data.leads_saved > 0) {
            toast.success(`🔥 ${data.leads_saved} lead caldi salvati`, {
              description: `${data.target.city} · ${data.target.sector} (ciclo #${data.cycle})`,
            });
          } else {
            toast.info(`🔍 Ciclo #${data.cycle} completato`, {
              description: `${data.target.city} · ${data.target.sector}: nessun lead caldo trovato`,
            });
          }
        }
      } else if (data?.error === "insufficient_credits") {
        toast.error("Crediti insufficienti per Arianna autopilot", {
          description: "Ricarica i crediti dalla sezione abbonamento per continuare.",
        });
      }
      load();
    } catch (e: any) {
      console.error("[Arianna autopilot]", e);
      toast.error("Errore ciclo Arianna");
    } finally {
      setLoading(false);
    }
  }, [userId, loading, load]);

  /* ─── Toggle ON/OFF ─── */
  const toggleActive = async (val: boolean) => {
    if (!userId) return;
    if (val) {
      await supabase.functions.invoke("arianna-autopilot", {
        body: { user_id: userId, action: "start" },
      });
      toast.success("🤖 Arianna è in autopilota — sceglie zone e settori da sola");
      // Lancia subito il primo ciclo
      setTimeout(() => runCycle(true), 1500);
    } else {
      await supabase.functions.invoke("arianna-autopilot", {
        body: { user_id: userId, action: "stop" },
      });
      toast.info("⏸️ Arianna in pausa");
    }
    load();
  };

  const isActive = state?.is_running === true;

  // Top zone performanti (per mostrare al venditore cosa Arianna ha imparato)
  const topZones = Object.entries(state?.zone_sector_weights ?? {})
    .map(([key, w]) => ({ key, weight: w }))
    .filter(z => z.weight > 1.1)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: isActive
          ? "linear-gradient(135deg, rgba(167,139,250,0.18), rgba(20,184,166,0.10))"
          : "linear-gradient(135deg, rgba(30,30,40,0.7), rgba(20,20,28,0.7))",
        border: isActive ? "1px solid rgba(167,139,250,0.45)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: isActive ? "0 0 24px rgba(167,139,250,0.25)" : "none",
      }}
    >
      {/* Header */}
      <button onClick={() => setCollapsed(c => !c)} className="w-full p-3 flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: isActive ? "linear-gradient(135deg, #a78bfa, #14b8a6)" : "rgba(255,255,255,0.05)" }}
            >
              <Bot className="w-5 h-5" style={{ color: isActive ? "#fff" : "#a78bfa" }} />
            </div>
            {isActive && (
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                className="absolute inset-0 rounded-xl"
                style={{ background: "rgba(167,139,250,0.4)", zIndex: -1 }}
              />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-foreground">Arianna</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold" style={{
                background: "rgba(167,139,250,0.18)", color: "#c4b5fd",
              }}>
                AUTOPILOT ADATTIVO
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{
                background: isActive ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)",
                color: isActive ? "#4ade80" : "#9ca3af",
              }}>
                {isActive ? (loading ? "⚡ AL LAVORO" : "🟢 ATTIVA") : "⚪ STANDBY"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              {isActive && state?.current_city
                ? <>Sto scansionando <span className="text-foreground font-semibold">{state.current_city}</span> · <span className="text-foreground font-semibold">{state.current_sector}</span></>
                : "Accendimi: scelgo zone e settori da sola, trovo solo lead caldi"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); toggleActive(!isActive); }}
            className="relative w-11 h-6 rounded-full transition-all"
            style={{ background: isActive ? "linear-gradient(90deg, #a78bfa, #14b8a6)" : "rgba(255,255,255,0.1)" }}
          >
            <motion.div animate={{ x: isActive ? 22 : 2 }} className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow" />
          </button>
          {collapsed ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Body espanso */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3 border-t border-white/5 pt-3">

              {/* Stato live: cosa sta facendo Arianna ora */}
              {isActive && (
                <div className="rounded-lg p-2.5 space-y-1.5" style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.25)" }}>
                  <div className="flex items-center gap-2 text-[11px] font-bold" style={{ color: "#c4b5fd" }}>
                    <Brain className="w-3.5 h-3.5" />
                    Cervello adattivo in azione
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-violet-300" />
                      <span className="text-muted-foreground">Zona:</span>
                      <span className="font-bold text-foreground">{state?.current_city || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-violet-300" />
                      <span className="text-muted-foreground">Settore:</span>
                      <span className="font-bold text-foreground">{state?.current_sector || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-violet-300" />
                      <span className="text-muted-foreground">Prossimo ciclo:</span>
                      <span className="font-bold text-foreground">
                        {countdown > 0 ? `${countdown}s` : loading ? "ora…" : "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Target className="w-3 h-3 text-violet-300" />
                      <span className="text-muted-foreground">Filtri:</span>
                      <span className="font-bold text-foreground">solo lead caldi</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Filtri qualità — dinamici, AI-tunable + override manuale */}
              <div className="rounded-lg p-2 space-y-1.5" style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold flex items-center gap-1.5 text-muted-foreground">
                    <Flame className="w-3 h-3 text-orange-400" />
                    Criteri lead caldi
                    {state?.auto_tune_enabled !== false ? (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: "rgba(167,139,250,0.18)", color: "#c4b5fd" }}>
                        AI auto
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: "rgba(251,191,36,0.18)", color: "#fbbf24" }}>
                        manuale
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCriteriaDialogOpen(true)}
                    className="flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors text-violet-300"
                  >
                    <Settings2 className="w-3 h-3" />
                    Personalizza
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px] text-foreground/70">
                  {state?.quality_filters?.require_no_website && <div>❌ Senza sito web</div>}
                  {state?.quality_filters?.require_no_social && <div>📱 Senza social</div>}
                  <div>⭐ Rating ≥ {(state?.quality_filters?.min_rating ?? 4).toFixed(1)}</div>
                  <div>💬 ≥ {state?.quality_filters?.min_reviews ?? 20} recensioni</div>
                  {state?.quality_filters?.premium_sectors_only && (
                    <div className="col-span-2">
                      💰 Settori: {state?.quality_filters?.premium_sectors?.join(", ") || "food, beauty, fitness, healthcare"}
                    </div>
                  )}
                </div>
                {state?.last_tuned_at && (
                  <div className="text-[8px] text-muted-foreground italic pt-0.5">
                    Ultima calibrazione AI: {new Date(state.last_tuned_at).toLocaleDateString("it-IT")}
                  </div>
                )}
              </div>

              {/* KPI */}
              {state && (
                <div className="grid grid-cols-3 gap-1.5">
                  <Kpi icon={<Activity className="w-3 h-3" />} value={state.cycles_completed} label="cicli" />
                  <Kpi icon={<Flame className="w-3 h-3" />} value={state.hot_leads_found} label="lead caldi" highlight />
                  <Kpi icon={<TrendingUp className="w-3 h-3" />} value={topZones.length} label="zone top" />
                </div>
              )}

              {/* Zone performanti (cosa Arianna ha imparato) */}
              {topZones.length > 0 && (
                <div className="rounded-lg p-2" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.18)" }}>
                  <div className="text-[10px] font-bold mb-1 flex items-center gap-1.5" style={{ color: "#4ade80" }}>
                    <Brain className="w-3 h-3" />
                    Cosa ho imparato (zone top)
                  </div>
                  <div className="space-y-0.5">
                    {topZones.map(z => {
                      const [city, sector] = z.key.split("|");
                      return (
                        <div key={z.key} className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-foreground/80 flex-1">{city} · {sector}</span>
                          <span className="font-bold text-emerald-300">×{z.weight.toFixed(1)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Storia recente (ultimi cicli) */}
              {history.length > 0 && (
                <div className="rounded-lg p-2" style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[10px] font-bold mb-1.5 flex items-center gap-1.5 text-muted-foreground">
                    <Activity className={`w-3 h-3 ${isActive ? "text-primary animate-pulse" : ""}`} />
                    Stream live cicli ({history.length})
                  </div>
                  <div className="space-y-0.5 max-h-44 overflow-y-auto">
                    <AnimatePresence initial={false}>
                      {history.slice(0, 10).map(h => (
                        <motion.div
                          key={h.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-1.5 text-[10px] py-0.5"
                        >
                          <span className="w-4 text-center">
                            {h.status === "failed" ? "✗" : h.leads_saved_to_pipeline > 0 ? "🔥" : "🔍"}
                          </span>
                          <span className="flex-1 truncate text-foreground/80">
                            #{h.cycle_number} {h.city}/{h.sector}
                            {h.leads_saved_to_pipeline > 0 && (
                              <span className="ml-1 text-emerald-300 font-bold">+{h.leads_saved_to_pipeline}</span>
                            )}
                          </span>
                          <span className="text-muted-foreground text-[9px]">
                            {new Date(h.created_at).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Esegui ciclo manuale */}
              <button
                onClick={() => runCycle(true)}
                disabled={loading || !userId}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 rounded-lg transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #a78bfa, #14b8a6)", color: "#fff" }}
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                {loading ? "Sto scansionando…" : "Esegui ciclo ora (manuale)"}
              </button>

              {/* Empty */}
              {history.length === 0 && !isActive && (
                <div className="text-center py-2 text-[10px] text-muted-foreground">
                  Accendi Arianna ↑ per partire — sceglie tutto da sola
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog override criteri lead caldi */}
      {userId && state && (
        <AriannaCriteriaOverrideDialog
          open={criteriaDialogOpen}
          onOpenChange={setCriteriaDialogOpen}
          userId={userId}
          initialFilters={state.quality_filters}
          initialAutoTune={state.auto_tune_enabled !== false}
          onSaved={({ filters, auto_tune_enabled }) =>
            setState((prev) => prev ? { ...prev, quality_filters: filters, auto_tune_enabled } : prev)
          }
        />
      )}
    </motion.div>
  );
}

function Kpi({ icon, value, label, highlight }: { icon: React.ReactNode; value: number; label: string; highlight?: boolean }) {
  return (
    <div className="rounded p-1.5 text-center" style={{
      background: highlight ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${highlight ? "rgba(249,115,22,0.25)" : "rgba(255,255,255,0.06)"}`,
    }}>
      <div className="flex items-center justify-center gap-1 mb-0.5" style={{ color: highlight ? "#fb923c" : undefined }}>{icon}</div>
      <div className="text-sm font-bold leading-none" style={{ color: highlight ? "#fb923c" : undefined }}>{value.toLocaleString("it-IT")}</div>
      <div className="text-[8px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
