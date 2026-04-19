// AriannaLeadScoutPanel — pannello live Arianna integrato dentro Lead Scout.
// Quando attiva: pilota la pagina (autocompila city/sector → handleSearch → apre Demo Factory
// sul top lead → genera bozza messaggio → la mette in coda approvazioni inline).
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Bot, Play, Pause, Loader2, Activity, ChevronDown, ChevronUp, Send,
  Sparkles, CheckCircle2, XCircle, Search, Wand2, MessageSquare, Mail, Phone,
  Settings as SettingsIcon, Zap, Target, TrendingUp,
} from "lucide-react";

/* ─── Types ─── */
type ActionRow = {
  id: string;
  action_type: string;
  channel: string | null;
  status: string;
  title: string;
  description: string | null;
  payload: any;
  created_at: string;
  duration_ms: number | null;
};

type ApprovalRow = {
  id: string;
  channel: string;
  draft_subject: string | null;
  draft_body: string;
  reasoning: string | null;
  recipient: string | null;
  status: string;
  created_at: string;
  lead_id: string | null;
};

type ConfigRow = {
  is_active: boolean;
  autonomy_mode: string;
  total_jobs_run: number;
  total_messages_sent: number;
  total_meetings_booked: number;
  total_conversions: number;
};

export interface AriannaTarget {
  city: string;
  sector: string;
}

export interface AriannaPilot {
  /** Imposta city e sector nei controlli reali della pagina */
  setSearchInputs: (city: string, sector: string) => void;
  /** Lancia la ricerca lead (handleSearch) */
  triggerSearch: () => Promise<void>;
  /** Lancia la Demo Factory sul lead specificato (per indice nei results) */
  triggerDemoFactoryOnTopLead: () => Promise<void>;
  /** Numero di lead attualmente caricati */
  getResultsCount: () => number;
  /** Top lead disponibile (nome + sector) per generare messaggio */
  getTopLead: () => { name: string; phone: string | null; email: string | null; sector: string } | null;
}

interface Props {
  pilot: AriannaPilot;
  defaultTarget?: AriannaTarget;
}

const channelIcon = (c: string | null) => {
  switch (c) {
    case "email": return <Mail className="w-3 h-3" />;
    case "whatsapp": return <MessageSquare className="w-3 h-3" />;
    case "voice": return <Phone className="w-3 h-3" />;
    default: return <Sparkles className="w-3 h-3" />;
  }
};

const actionEmoji = (t: string, status: string) => {
  if (status === "running") return "⚡";
  if (status === "failed") return "✗";
  if (status === "needs_approval") return "✋";
  if (status === "success") return "✓";
  switch (t) {
    case "search": case "scrape": return "🔍";
    case "enrich": case "score": return "🧠";
    case "draft": return "✨";
    case "send_email": case "send_whatsapp": case "send_linkedin": return "📤";
    case "call": return "📞";
    default: return "⚙️";
  }
};

const SECTORS_QUICK = [
  { value: "food", label: "Ristorazione" },
  { value: "beauty", label: "Beauty" },
  { value: "ncc", label: "NCC / Transfer" },
  { value: "fitness", label: "Fitness" },
  { value: "hospitality", label: "Hotel" },
  { value: "healthcare", label: "Medico" },
  { value: "plumber", label: "Idraulico" },
  { value: "electrician", label: "Elettricista" },
];

const CITIES_QUICK = ["Roma", "Milano", "Napoli", "Torino", "Firenze", "Bologna", "Bari", "Palermo"];

export default function AriannaLeadScoutPanel({ pilot, defaultTarget }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [config, setConfig] = useState<ConfigRow | null>(null);
  const [actions, setActions] = useState<ActionRow[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRow[]>([]);
  const [running, setRunning] = useState(false);
  const [autoSend, setAutoSend] = useState(false);
  const [target, setTarget] = useState<AriannaTarget>(defaultTarget || { city: "Roma", sector: "food" });
  const [userId, setUserId] = useState<string | null>(null);
  const cycleTimerRef = useRef<number | null>(null);
  const isCyclingRef = useRef(false);

  /* ─── Load config + live stream ─── */
  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const { data: cfg } = await supabase
      .from("sales_agent_config" as any).select("*").eq("user_id", user.id).maybeSingle();
    if (!cfg) {
      const { data: created } = await supabase.from("sales_agent_config" as any).insert({
        user_id: user.id, is_active: false, autonomy_mode: "semi_auto",
      }).select("*").single();
      setConfig(created as any);
    } else {
      setConfig(cfg as any);
    }

    const { data: acts } = await supabase
      .from("sales_agent_actions" as any).select("*").eq("owner_id", user.id)
      .order("created_at", { ascending: false }).limit(20);
    setActions((acts ?? []) as any);

    const { data: appr } = await supabase
      .from("sales_agent_approvals" as any).select("*").eq("owner_id", user.id)
      .eq("status", "pending").order("created_at", { ascending: false });
    setApprovals((appr ?? []) as any);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase.channel("arianna-leadscout-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "sales_agent_actions" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "sales_agent_approvals" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  /* ─── Pilot: pilota la pagina LeadsPage ─── */
  const runVisibleCycle = useCallback(async (showToast = true) => {
    if (isCyclingRef.current) return;
    isCyclingRef.current = true;
    setRunning(true);

    try {
      // 1. Set inputs visibilmente
      pilot.setSearchInputs(target.city, target.sector);
      if (showToast) toast.info(`🤖 Arianna: cerco lead a ${target.city} (${target.sector})…`);
      await new Promise(r => setTimeout(r, 800));

      // 2. Trigger search
      await pilot.triggerSearch();
      await new Promise(r => setTimeout(r, 1500));

      const count = pilot.getResultsCount();
      if (count === 0) {
        toast.warning("Arianna: nessun lead trovato in questa zona");
        return;
      }

      // 3. Demo Factory sul top lead
      const top = pilot.getTopLead();
      if (top) {
        if (showToast) toast.info(`🪄 Arianna: genero demo per ${top.name}…`);
        await pilot.triggerDemoFactoryOnTopLead();
        await new Promise(r => setTimeout(r, 1200));
      }

      // 4. Genera bozza messaggio + manda a coda approvazioni
      if (top && userId) {
        try {
          const { data, error } = await supabase.functions.invoke("sales-agent-orchestrator", {
            body: {
              owner_id: userId,
              trigger_source: "leads_scout_panel",
              target_lead: top,
              auto_send: autoSend,
            },
          });
          if (!error && data) {
            if (showToast) {
              toast.success(autoSend
                ? `📤 Messaggio inviato a ${top.name}`
                : `✋ Bozza pronta per ${top.name} — approva qui sotto`);
            }
          }
        } catch (e: any) {
          console.warn("[Arianna] orchestrator error:", e);
        }
      }

      // Update kpi locali
      load();
    } catch (e: any) {
      toast.error("Arianna: errore nel ciclo");
      console.error(e);
    } finally {
      setRunning(false);
      isCyclingRef.current = false;
    }
  }, [target, pilot, autoSend, userId, load]);

  /* ─── Loop automatico quando attiva ─── */
  useEffect(() => {
    if (!config?.is_active) {
      if (cycleTimerRef.current) {
        window.clearInterval(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }
      return;
    }
    // Primo giro dopo 3s, poi ogni 3 minuti
    const firstRun = window.setTimeout(() => runVisibleCycle(false), 3000);
    cycleTimerRef.current = window.setInterval(() => runVisibleCycle(false), 3 * 60 * 1000);
    return () => {
      window.clearTimeout(firstRun);
      if (cycleTimerRef.current) window.clearInterval(cycleTimerRef.current);
    };
  }, [config?.is_active, runVisibleCycle]);

  /* ─── Toggle ON/OFF ─── */
  const toggleActive = async (val: boolean) => {
    if (!userId) return;
    await supabase.from("sales_agent_config" as any).update({ is_active: val }).eq("user_id", userId);
    setConfig(c => c ? { ...c, is_active: val } : c);
    toast.success(val ? "🤖 Arianna è ora ATTIVA — pilota Lead Scout in autonomia" : "⏸️ Arianna in pausa");
  };

  /* ─── Approvazioni ─── */
  const handleApproval = async (id: string, decision: "approve" | "reject") => {
    const { error } = await supabase.functions.invoke("sales-agent-send", {
      body: { approval_id: id, decision },
    });
    if (error) toast.error("Errore invio: " + error.message);
    else {
      toast.success(decision === "approve" ? "✅ Inviato al lead" : "❌ Bozza rifiutata");
      load();
    }
  };

  const isActive = config?.is_active === true;

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
      {/* Header sempre visibile */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full p-3 flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, #a78bfa, #14b8a6)"
                  : "rgba(255,255,255,0.05)",
              }}
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
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-foreground">Arianna</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{
                background: isActive ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)",
                color: isActive ? "#4ade80" : "#9ca3af",
              }}>
                {isActive ? (running ? "⚡ AL LAVORO" : "🟢 ATTIVA") : "⚪ STANDBY"}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              {isActive
                ? `Cerca a ${target.city} · ${target.sector} · ${autoSend ? "auto-invio" : "solo proposte"}`
                : "Sales Agent autonomo — accendimi per pilotare Lead Scout"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Switch ON/OFF */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleActive(!isActive); }}
            className="relative w-11 h-6 rounded-full transition-all"
            style={{
              background: isActive ? "linear-gradient(90deg, #a78bfa, #14b8a6)" : "rgba(255,255,255,0.1)",
            }}
          >
            <motion.div
              animate={{ x: isActive ? 22 : 2 }}
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
            />
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
              {/* Target + auto-send */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Città target</label>
                  <select
                    value={target.city}
                    onChange={(e) => setTarget(t => ({ ...t, city: e.target.value }))}
                    className="w-full text-xs px-2 py-1.5 rounded bg-background/50 border border-white/10 text-foreground focus:outline-none focus:border-primary"
                  >
                    {CITIES_QUICK.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Settore</label>
                  <select
                    value={target.sector}
                    onChange={(e) => setTarget(t => ({ ...t, sector: e.target.value }))}
                    className="w-full text-xs px-2 py-1.5 rounded bg-background/50 border border-white/10 text-foreground focus:outline-none focus:border-primary"
                  >
                    {SECTORS_QUICK.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <label className="flex items-center gap-1.5 text-[10px] font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoSend}
                    onChange={(e) => setAutoSend(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-primary"
                  />
                  <span className={autoSend ? "text-amber-300" : "text-muted-foreground"}>
                    {autoSend ? "🚀 Auto-invio attivo" : "✋ Solo proposte"}
                  </span>
                </label>

                <button
                  onClick={() => runVisibleCycle(true)}
                  disabled={running}
                  className="ml-auto flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #a78bfa, #14b8a6)",
                    color: "#fff",
                  }}
                >
                  {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                  {running ? "Sto pilotando…" : "Esegui ciclo ora"}
                </button>
              </div>

              {/* KPI */}
              {config && (
                <div className="grid grid-cols-4 gap-1.5">
                  <Kpi icon={<Activity className="w-3 h-3" />} value={config.total_jobs_run} label="cicli" />
                  <Kpi icon={<Send className="w-3 h-3" />} value={config.total_messages_sent} label="msg" />
                  <Kpi icon={<Phone className="w-3 h-3" />} value={config.total_meetings_booked} label="call" />
                  <Kpi icon={<TrendingUp className="w-3 h-3" />} value={config.total_conversions} label="conv" />
                </div>
              )}

              {/* Approvazioni in coda */}
              {approvals.length > 0 && (
                <div className="rounded-lg p-2 space-y-1.5" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
                  <div className="text-[10px] font-bold flex items-center gap-1.5" style={{ color: "#fbbf24" }}>
                    <Sparkles className="w-3 h-3" />
                    {approvals.length} bozza/e in attesa di approvazione
                  </div>
                  {approvals.slice(0, 3).map(a => (
                    <div key={a.id} className="rounded p-2 text-[10px]" style={{ background: "rgba(0,0,0,0.3)" }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {channelIcon(a.channel)}
                        <span className="font-bold text-foreground">{a.recipient || "—"}</span>
                      </div>
                      <p className="text-foreground/70 line-clamp-2 mb-1.5 whitespace-pre-wrap">{a.draft_body}</p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleApproval(a.id, "approve")}
                          className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold"
                          style={{ background: "rgba(34,197,94,0.2)", color: "#4ade80" }}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" /> Invia
                        </button>
                        <button
                          onClick={() => handleApproval(a.id, "reject")}
                          className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold"
                          style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}
                        >
                          <XCircle className="w-2.5 h-2.5" /> Rifiuta
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stream live azioni */}
              {actions.length > 0 && (
                <div className="rounded-lg p-2" style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[10px] font-bold mb-1.5 flex items-center gap-1.5 text-muted-foreground">
                    <Activity className={`w-3 h-3 ${isActive ? "text-primary animate-pulse" : ""}`} />
                    Stream live azioni Arianna
                  </div>
                  <div className="space-y-0.5 max-h-40 overflow-y-auto">
                    <AnimatePresence initial={false}>
                      {actions.slice(0, 8).map(a => (
                        <motion.div
                          key={a.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-1.5 text-[10px] py-0.5"
                        >
                          <span className="w-4 text-center">{actionEmoji(a.action_type, a.status)}</span>
                          <span className="flex-1 truncate text-foreground/80">{a.title}</span>
                          <span className="text-muted-foreground text-[9px]">
                            {new Date(a.created_at).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {actions.length === 0 && approvals.length === 0 && (
                <div className="text-center py-2 text-[10px] text-muted-foreground">
                  Nessuna attività ancora — accendi Arianna per partire
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Kpi({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="rounded p-1.5 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">{icon}</div>
      <div className="text-sm font-bold text-foreground leading-none">{value.toLocaleString("it-IT")}</div>
      <div className="text-[8px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
