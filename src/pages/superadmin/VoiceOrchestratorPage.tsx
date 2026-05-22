import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useVoiceOrchestrator } from "@/hooks/useVoiceOrchestrator";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mic, MicOff, Loader2, Volume2, X, CheckCircle2, AlertTriangle, History, Trash2, Sparkles, Brain, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface DbLogEntry {
  id: string;
  transcript: string;
  intent: any;
  actions_planned: any[];
  reply_text: string | null;
  status: string;
  created_at: string;
}

const EXAMPLES = [
  { icon: Zap, text: "Vai alla pagina Lead Scout" },
  { icon: Brain, text: "Quanti lead nuovi oggi?" },
  { icon: Sparkles, text: "Aggiungi al menu del demo Pizza Margherita a 10 euro" },
  { icon: ShieldCheck, text: "Lancia Arianna sul lead numero 1" },
  { icon: Brain, text: "Quanti ristoranti attivi abbiamo?" },
  { icon: Zap, text: "Apri la pagina crediti" },
];

export default function VoiceOrchestratorPage() {
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const { state, transcript, interimTranscript, currentPlan, history, supported, startSession, cancel } =
    useVoiceOrchestrator((p: string) => navigate(p));

  const [dbHistory, setDbHistory] = useState<DbLogEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!isSuperAdmin) return;
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("voice_command_log")
        .select("id, transcript, intent, actions_planned, reply_text, status, created_at")
        .order("created_at", { ascending: false })
        .limit(30);
      if (mounted && data) setDbHistory(data as any);
      setLoadingHistory(false);
    })();
    return () => { mounted = false; };
  }, [isSuperAdmin, history.length]);

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <p>Accesso riservato al Super Admin.</p>
      </div>
    );
  }

  const isActive = state !== "idle";

  const stateColor: Record<string, string> = {
    idle: "from-amber-500 to-amber-700",
    listening: "from-rose-500 to-rose-700",
    thinking: "from-violet-500 to-violet-700",
    speaking: "from-sky-500 to-sky-700",
    awaiting_confirmation: "from-emerald-500 to-emerald-700",
    executing: "from-indigo-500 to-indigo-700",
    error: "from-red-500 to-red-700",
  };

  const stateLabel: Record<string, string> = {
    idle: "Pronta — tocca per parlare",
    listening: "Ti sto ascoltando...",
    thinking: "Sto ragionando...",
    speaking: "Sto parlando...",
    awaiting_confirmation: "Aspetto conferma — dì SI o NO",
    executing: "Eseguo le azioni...",
    error: "Errore",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-zinc-950/80 border-b border-amber-500/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/superadmin")}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Empire Voice Orchestrator
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">
              Comando vocale full-spectrum • Super Admin
            </p>
          </div>
          {supported ? (
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              Online
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-red-400 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/30">
              Browser non supportato
            </span>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6 pb-32">
        {/* Mic cockpit */}
        <section className="relative rounded-3xl border border-amber-500/20 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 p-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(251,191,36,0.08),transparent_60%)] pointer-events-none" />

          <div className="relative flex flex-col items-center text-center">
            <p className="text-[11px] uppercase tracking-[2px] text-amber-400 mb-1">{stateLabel[state]}</p>
            <h2 className="text-lg sm:text-xl font-bold mb-6">
              Parla con Arianna. Esegue tutto.
            </h2>

            {/* Mic button */}
            <motion.button
              type="button"
              onClick={() => (state === "idle" ? startSession() : cancel())}
              disabled={!supported && state === "idle"}
              whileTap={{ scale: 0.92 }}
              animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={isActive ? { repeat: Infinity, duration: 1.4 } : {}}
              className={`relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br ${stateColor[state]} shadow-2xl flex items-center justify-center text-white border-4 border-white/10 ${!supported && state === "idle" ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {state === "idle" ? (
                <Mic className="w-14 h-14" />
              ) : state === "thinking" || state === "executing" ? (
                <Loader2 className="w-14 h-14 animate-spin" />
              ) : state === "speaking" ? (
                <Volume2 className="w-14 h-14" />
              ) : state === "error" ? (
                <AlertTriangle className="w-14 h-14" />
              ) : (
                <X className="w-14 h-14" />
              )}

              {isActive && (
                <>
                  <span className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                  <span className="absolute inset-[-12px] rounded-full border border-white/15 animate-pulse" />
                </>
              )}
            </motion.button>

            {/* Live transcript */}
            <div className="mt-6 w-full max-w-lg space-y-3">
              {(transcript || interimTranscript) && (
                <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 p-3 text-left">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Tu hai detto</p>
                  <p className="text-sm text-zinc-100">{transcript || interimTranscript}</p>
                </div>
              )}

              {currentPlan?.reply_text && (
                <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-left">
                  <p className="text-[10px] uppercase tracking-wider text-amber-400 mb-1">Arianna</p>
                  <p className="text-sm text-amber-100">{currentPlan.reply_text}</p>
                  {currentPlan.actions && currentPlan.actions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-amber-500/10 space-y-1">
                      {currentPlan.actions.map((a, i) => (
                        <div key={i} className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          {a.description}
                        </div>
                      ))}
                    </div>
                  )}
                  {currentPlan.destructive && (
                    <div className="mt-2 text-[10px] text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Azione distruttiva — richiede conferma
                    </div>
                  )}
                </div>
              )}
            </div>

            {!supported && (
              <p className="mt-4 text-xs text-zinc-500 max-w-sm">
                Il riconoscimento vocale richiede Chrome desktop o Android. Su iOS Safari non è disponibile.
              </p>
            )}
          </div>
        </section>

        {/* Examples */}
        {state === "idle" && (
          <section>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-3 px-1">
              Prova a dire
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLES.map((ex, i) => {
                const Icon = ex.icon;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 flex items-center gap-2"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <p className="text-xs text-muted-foreground">"{ex.text}"</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Capabilities */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Navigazione", icon: Zap },
            { label: "CRUD reale", icon: Sparkles },
            { label: "Lancia agenti", icon: Brain },
            { label: "Query dati", icon: ShieldCheck },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-center">
                <Icon className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-[11px] text-muted-foreground font-medium">{c.label}</p>
              </div>
            );
          })}
        </section>

        {/* History */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">
              Cronologia comandi
            </p>
            <span className="text-[10px] text-zinc-600">
              {dbHistory.length} totali
            </span>
          </div>

          {loadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
            </div>
          ) : dbHistory.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
              <History className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">Nessun comando ancora. Tocca il microfono per iniziare.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {dbHistory.map((entry) => {
                const statusColor =
                  entry.status === "success" ? "text-emerald-400" :
                  entry.status === "cancelled" ? "text-zinc-500" :
                  entry.status === "error" ? "text-red-400" : "text-amber-400";
                return (
                  <div key={entry.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-zinc-100 flex-1">{entry.transcript}</p>
                      <span className={`text-[10px] uppercase ${statusColor}`}>{entry.status}</span>
                    </div>
                    {entry.reply_text && (
                      <p className="text-[11px] text-zinc-500 mb-1">{entry.reply_text}</p>
                    )}
                    {Array.isArray(entry.actions_planned) && entry.actions_planned.length > 0 && (
                      <div className="space-y-0.5 mt-1">
                        {entry.actions_planned.slice(0, 3).map((a: any, i: number) => (
                          <p key={i} className="text-[10px] text-zinc-600">→ {a.description}</p>
                        ))}
                      </div>
                    )}
                    <p className="text-[10px] text-zinc-700 mt-1">
                      {new Date(entry.created_at).toLocaleString("it-IT")}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
