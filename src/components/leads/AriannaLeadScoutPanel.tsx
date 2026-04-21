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
  Globe, Share2, Star, MessageSquare, Gem, AlertCircle, Search as SearchIcon,
  CircleDot,
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
  auto_send_messages?: boolean;
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
              <span className="text-sm font-bold text-foreground tracking-tight">Arianna Autopilot</span>
              <span
                className="partner-badge-pro text-[10px]"
                data-tone={isActive ? (loading ? "primary" : "success") : "muted"}
              >
                {isActive ? (
                  loading ? (
                    <>
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      In esecuzione
                    </>
                  ) : (
                    <>
                      <span className="partner-status-dot" aria-hidden />
                      Attiva
                    </>
                  )
                ) : (
                  <>
                    <CircleDot className="w-2.5 h-2.5 opacity-70" />
                    In pausa
                  </>
                )}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              {isActive && state?.current_city
                ? <>Sto analizzando <span className="text-foreground font-semibold">{state.current_city}</span> · settore <span className="text-foreground font-semibold">{state.current_sector}</span></>
                : "AI che trova nuovi clienti per te 24/7. Accendi l'interruttore →"}
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
            <div className="px-3 pb-3 space-y-2.5 border-t border-white/5 pt-3">

              {/* COME FUNZIONA — visibile solo quando spenta, per orientare il venditore */}
              {!isActive && (
                <div className="rounded-lg p-2.5" style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.2)" }}>
                  <div className="text-[10px] font-bold mb-1.5 text-violet-300">Come funziona — 3 step</div>
                  <div className="space-y-1.5 text-[10px] text-foreground/85 leading-snug">
                    <div className="flex gap-1.5">
                      <span className="text-violet-400 font-bold shrink-0">1.</span>
                      <span><b>Scelta target.</b> Arianna decide città e settore con il maggior potenziale, basandosi sui tuoi risultati passati.</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-violet-400 font-bold shrink-0">2.</span>
                      <span><b>Scansione.</b> Cerca su Google Maps e tiene solo i lead che rispettano i tuoi criteri di qualità.</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-violet-400 font-bold shrink-0">3.</span>
                      <span><b>Salva (e contatta).</b> Mette i lead caldi in pipeline. Se attivi l'invio auto, li contatta su WhatsApp/email da sola.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ────────── 1. STATO LIVE ────────── */}
              {isActive && (
                <SectionCard title="Cosa sta facendo adesso" tone="violet" step={1}>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px]">
                    <Row icon={<MapPin className="w-3 h-3 text-violet-300" />} label="Città" value={state?.current_city || "—"} />
                    <Row icon={<Layers className="w-3 h-3 text-violet-300" />} label="Settore" value={state?.current_sector || "—"} />
                    <Row icon={<Clock className="w-3 h-3 text-violet-300" />} label="Prossima scansione" value={countdown > 0 ? `tra ${countdown}s` : loading ? "in corso…" : "a breve"} />
                    <Row icon={<Target className="w-3 h-3 text-violet-300" />} label="Cosa fa al lead" value={state?.auto_send_messages ? "salva + contatta" : "solo salva"} />
                  </div>
                </SectionCard>
              )}

              {/* ────────── 2. CRITERI LEAD CALDI ────────── */}
              <SectionCard
                title="Quali lead considera “caldi”"
                step={isActive ? 2 : 1}
                badge={state?.auto_tune_enabled !== false
                  ? { label: "AI decide da sola", color: "#c4b5fd", bg: "rgba(167,139,250,0.18)" }
                  : { label: "criteri tuoi", color: "#fbbf24", bg: "rgba(251,191,36,0.18)" }}
                action={
                  <button
                    type="button"
                    onClick={() => setCriteriaDialogOpen(true)}
                    className="flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded hover:bg-white/5 transition-colors text-violet-300"
                  >
                    <Settings2 className="w-3 h-3" />
                    Modifica
                  </button>
                }
              >
                <p className="text-[9px] text-muted-foreground mb-1 leading-snug">
                  Un lead viene salvato solo se rispetta <b>tutti</b> questi requisiti:
                </p>
                <ul className="grid grid-cols-1 gap-y-1 text-[10px] text-foreground/85">
                  {state?.quality_filters?.require_no_website && (
                    <li className="flex items-start gap-1.5">
                      <Globe className="w-3 h-3 mt-px text-violet-300/80 shrink-0" />
                      <span><b>Nessun sito web</b> — alto bisogno di presenza digitale</span>
                    </li>
                  )}
                  {state?.quality_filters?.require_no_social && (
                    <li className="flex items-start gap-1.5">
                      <Share2 className="w-3 h-3 mt-px text-violet-300/80 shrink-0" />
                      <span><b>Nessun profilo social</b> — visibilità da costruire</span>
                    </li>
                  )}
                  <li className="flex items-start gap-1.5">
                    <Star className="w-3 h-3 mt-px text-amber-300/80 shrink-0" />
                    <span><b>Rating ≥ {(state?.quality_filters?.min_rating ?? 4).toFixed(1)}</b> — reputazione consolidata</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <MessageSquare className="w-3 h-3 mt-px text-emerald-300/80 shrink-0" />
                    <span><b>≥ {state?.quality_filters?.min_reviews ?? 20} recensioni</b> — base clienti attiva</span>
                  </li>
                  {state?.quality_filters?.premium_sectors_only && (
                    <li className="flex items-start gap-1.5">
                      <Gem className="w-3 h-3 mt-px text-cyan-300/80 shrink-0" />
                      <span className="truncate"><b>Settori premium:</b> {state?.quality_filters?.premium_sectors?.join(", ") || "food, beauty, fitness, healthcare"}</span>
                    </li>
                  )}
                </ul>
                {state?.last_tuned_at && (
                  <div className="text-[8px] text-muted-foreground italic mt-1">
                    Ultima volta che l'AI ha ricalibrato: {new Date(state.last_tuned_at).toLocaleDateString("it-IT")}
                  </div>
                )}
              </SectionCard>

              {/* ────────── 3. INVIO AUTO ────────── */}
              <SectionCard
                title={state?.auto_send_messages ? "Contatto automatico — ATTIVO" : "Contatto manuale (consigliato all'inizio)"}
                step={isActive ? 3 : 2}
                tone={state?.auto_send_messages ? "green" : "neutral"}
                action={
                  <button
                    type="button"
                    onClick={async () => {
                      if (!userId) return;
                      const next = !(state?.auto_send_messages ?? false);

                      // Quando si vuole ATTIVARE → preflight obbligatorio
                      if (next) {
                        const probeToast = toast.loading("Verifico canali di invio…");
                        try {
                          const { data: probe, error: probeErr } = await supabase.functions.invoke(
                            "arianna-autopilot",
                            { body: { user_id: userId, action: "probe_outreach" } },
                          );
                          toast.dismiss(probeToast);
                          if (probeErr || !probe?.operational) {
                            toast.error("⚠️ Invio automatico NON disponibile", {
                              description: probe?.message
                                || "I canali di invio (email/WhatsApp) non sono ancora configurati. Il toggle resta spento.",
                              duration: 8000,
                            });
                            return; // toggle resta OFF
                          }
                          toast.success(`✅ Canali pronti: ${(probe.channels || []).join(" + ")}`);
                        } catch (e: any) {
                          toast.dismiss(probeToast);
                          toast.error("⚠️ Impossibile verificare l'invio automatico", {
                            description: e?.message || "Riprova fra qualche secondo.",
                            duration: 8000,
                          });
                          return;
                        }
                      }

                      const { error } = await supabase
                        .from("arianna_autopilot_state" as any)
                        .update({ auto_send_messages: next })
                        .eq("user_id", userId);
                      if (error) { toast.error("Errore aggiornamento"); return; }
                      setState(prev => prev ? { ...prev, auto_send_messages: next } : prev);
                      toast.success(next ? "📤 Contatto automatico attivato" : "💾 Solo salvataggio in pipeline");
                    }}
                    className="relative w-9 h-5 rounded-full transition-all shrink-0"
                    style={{ background: state?.auto_send_messages ? "#22c55e" : "rgba(255,255,255,0.15)" }}
                  >
                    <motion.div animate={{ x: state?.auto_send_messages ? 18 : 2 }} className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow" />
                  </button>
                }
              >
                <p className="text-[10px] text-muted-foreground leading-snug">
                  {state?.auto_send_messages
                    ? "Appena trova un lead caldo, Arianna gli invia direttamente il messaggio personalizzato su WhatsApp/email."
                    : "I lead vengono solo salvati in pipeline. Decidi tu quando contattarli — più sicuro all'inizio."}
                </p>
              </SectionCard>

              {/* ────────── 4. RISULTATI (KPI) ────────── */}
              {state && (() => {
                const cycles = state.cycles_completed || 0;
                const hot = state.hot_leads_found || 0;
                const conv = cycles > 0 ? Math.round((hot / cycles) * 100) : 0;
                return (
                  <SectionCard title="I tuoi risultati" step={isActive ? 4 : 3}>
                    <div className="grid grid-cols-3 gap-1.5">
                      <Kpi icon={<Activity className="w-3 h-3" />} value={cycles} label="scansioni fatte" />
                      <Kpi icon={<Flame className="w-3 h-3" />} value={hot} label="lead caldi salvati" highlight />
                      <Kpi icon={<TrendingUp className="w-3 h-3" />} value={conv} label="% di successo" suffix="%" />
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-1.5 leading-snug">
                      In media <b>{cycles > 0 ? (hot / cycles).toFixed(1) : "0"} lead caldi per scansione</b>. Più Arianna lavora, più impara dove trovarli.
                    </p>
                  </SectionCard>
                );
              })()}

              {/* ────────── 5. ZONE TOP (apprese) ────────── */}
              {topZones.length > 0 && (
                <SectionCard title="Zone più redditizie (apprese dall'AI)" tone="green">
                  <p className="text-[9px] text-muted-foreground mb-1 leading-snug">
                    Combinazioni dove Arianna trova più lead caldi. Le scansionerà più spesso.
                  </p>
                  <div className="space-y-0.5">
                    {topZones.map(z => {
                      const [city, sector] = z.key.split("|");
                      const priorityPct = Math.round((z.weight - 1) * 100);
                      return (
                        <div key={z.key} className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-foreground/85 flex-1 truncate">{city} · {sector}</span>
                          <span className="font-bold text-emerald-300 text-[9px]" title={`Priorità ×${z.weight.toFixed(2)}`}>
                            +{priorityPct}% priorità
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              )}

              {/* ────────── 6. STREAM CICLI ────────── */}
              {history.length > 0 && (
                <SectionCard title={`Cronologia scansioni (${history.length})`}>
                  <div className="flex items-center gap-3 mb-1.5 text-[9px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Flame className="w-2.5 h-2.5 text-orange-400" /> con lead</span>
                    <span className="inline-flex items-center gap-1"><SearchIcon className="w-2.5 h-2.5 opacity-70" /> nessun lead</span>
                    <span className="inline-flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5 text-rose-400" /> errore</span>
                  </div>
                  <div className="space-y-0.5 max-h-40 overflow-y-auto">
                    <AnimatePresence initial={false}>
                      {history.slice(0, 10).map(h => (
                        <motion.div
                          key={h.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-1.5 text-[10px] py-0.5"
                        >
                          <span
                            className="w-4 inline-flex items-center justify-center"
                            title={
                              h.status === "failed" ? "Errore" :
                              h.leads_saved_to_pipeline > 0 ? `${h.leads_saved_to_pipeline} lead salvati` :
                              "Nessun lead caldo trovato"
                            }
                          >
                            {h.status === "failed" ? (
                              <AlertCircle className="w-3 h-3 text-rose-400" />
                            ) : h.leads_saved_to_pipeline > 0 ? (
                              <Flame className="w-3 h-3 text-orange-400" />
                            ) : (
                              <SearchIcon className="w-3 h-3 opacity-60" />
                            )}
                          </span>
                          <span className="flex-1 truncate text-foreground/80">
                            <span className="text-muted-foreground">#{h.cycle_number}</span> {h.city} · {h.sector}
                            {h.leads_saved_to_pipeline > 0 && (
                              <span className="ml-1 text-emerald-300 font-bold">+{h.leads_saved_to_pipeline} lead</span>
                            )}
                          </span>
                          <span className="text-muted-foreground text-[9px]">
                            {new Date(h.created_at).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </SectionCard>
              )}

              {/* Esegui ciclo manuale */}
              <button
                onClick={() => runCycle(true)}
                disabled={loading || !userId}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 rounded-lg transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #a78bfa, #14b8a6)", color: "#fff" }}
                title="Lancia subito una scansione di test, senza aspettare il ciclo automatico"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                {loading ? "Sto scansionando…" : "Prova adesso una scansione"}
              </button>

              {/* Empty */}
              {history.length === 0 && !isActive && (
                <div className="text-center py-2 text-[10px] text-muted-foreground">
                  Accendi l'interruttore in alto per iniziare ↑
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

function Kpi({ icon, value, label, highlight, suffix }: { icon: React.ReactNode; value: number; label: string; highlight?: boolean; suffix?: string }) {
  return (
    <div className="rounded p-1.5 text-center" style={{
      background: highlight ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${highlight ? "rgba(249,115,22,0.25)" : "rgba(255,255,255,0.06)"}`,
    }}>
      <div className="flex items-center justify-center gap-1 mb-0.5" style={{ color: highlight ? "#fb923c" : undefined }}>{icon}</div>
      <div className="text-sm font-bold leading-none" style={{ color: highlight ? "#fb923c" : undefined }}>
        {value.toLocaleString("it-IT")}{suffix ?? ""}
      </div>
      <div className="text-[8px] uppercase tracking-wider text-muted-foreground leading-tight">{label}</div>
    </div>
  );
}

/* ─── SectionCard: card titolata uniforme con badge step opzionale ─── */
function SectionCard({
  title,
  step,
  badge,
  action,
  tone = "neutral",
  children,
}: {
  title: string;
  step?: number;
  badge?: { label: string; color: string; bg: string };
  action?: React.ReactNode;
  tone?: "neutral" | "violet" | "green";
  children: React.ReactNode;
}) {
  const palette = {
    neutral: { bg: "rgba(0,0,0,0.25)", border: "rgba(255,255,255,0.06)", title: undefined as string | undefined, stepBg: "rgba(255,255,255,0.08)", stepColor: "#9ca3af" },
    violet: { bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.25)", title: "#c4b5fd", stepBg: "rgba(167,139,250,0.25)", stepColor: "#c4b5fd" },
    green: { bg: "rgba(34,197,94,0.06)", border: "rgba(34,197,94,0.18)", title: "#4ade80", stepBg: "rgba(34,197,94,0.25)", stepColor: "#4ade80" },
  }[tone];
  return (
    <div className="rounded-lg p-2.5 space-y-1.5" style={{ background: palette.bg, border: `1px solid ${palette.border}` }}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {step !== undefined && (
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0" style={{ background: palette.stepBg, color: palette.stepColor }}>
              {step}
            </span>
          )}
          <span className="text-[11px] font-bold truncate" style={{ color: palette.title }}>{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0" style={{ background: badge.bg, color: badge.color }}>
              {badge.label}
            </span>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ─── Row: riga icona + label + valore ─── */
function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      {icon}
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-bold text-foreground truncate">{value}</span>
    </div>
  );
}
