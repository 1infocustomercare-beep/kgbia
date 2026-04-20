import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useVoiceOrchestrator, type VoiceState } from "@/hooks/useVoiceOrchestrator";
import { Mic, Loader2, Volume2, X, CheckCircle2, AlertTriangle, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Voice Orchestrator FAB per Partner / Seller.
 * - Visibile a partner / team_leader (NON super admin: quello ha già il suo FAB).
 * - Sfrutta lo stesso hook useVoiceOrchestrator → l'edge function `voice-orchestrator-query`
 *   applica già lo scope `owner_id = user.id` per chi NON è super_admin,
 *   garantendo massima privacy: il venditore vede e comanda SOLO i propri dati.
 */

const STATE_LABEL: Record<VoiceState, string> = {
  idle: "Tocca e parla",
  listening: "Ti ascolto...",
  thinking: "Sto ragionando...",
  speaking: "Sto parlando...",
  awaiting_confirmation: "Dì SI o NO",
  executing: "Eseguo...",
  error: "Errore",
};

const STATE_COLOR: Record<VoiceState, string> = {
  idle: "from-violet-500 to-fuchsia-700",
  listening: "from-rose-500 to-rose-700",
  thinking: "from-violet-500 to-violet-700",
  speaking: "from-sky-500 to-sky-700",
  awaiting_confirmation: "from-emerald-500 to-emerald-700",
  executing: "from-indigo-500 to-indigo-700",
  error: "from-red-500 to-red-700",
};

export default function PartnerVoiceOrchestratorFAB() {
  const { isPartner, isTeamLeader, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const { state, transcript, interimTranscript, currentPlan, supported, startSession, cancel } =
    useVoiceOrchestrator((p: string) => navigate(p));

  // Solo partner/seller — non duplicare per super admin
  if (isSuperAdmin) return null;
  if (!isPartner && !isTeamLeader) return null;

  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path === "/" || path === "/home" || path.startsWith("/r/") || path.startsWith("/b/")) {
      return null;
    }
  }

  const isActive = state !== "idle";
  const Icon: any =
    state === "idle" ? Mic :
    state === "speaking" ? Volume2 :
    state === "error" ? AlertTriangle :
    (state === "executing" || state === "thinking") ? Loader2 :
    Mic;

  const handleClick = () => {
    if (state === "idle") startSession();
    else cancel();
  };

  return (
    <>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm pointer-events-none"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed bottom-24 left-3 right-3 z-[9999] max-w-md mx-auto"
          >
            <div className="rounded-2xl border border-violet-500/30 bg-zinc-950/95 backdrop-blur-xl p-4 shadow-2xl shadow-violet-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${STATE_COLOR[state]} animate-pulse`} />
                <span className="text-[11px] uppercase tracking-wider text-violet-300 font-bold">
                  {STATE_LABEL[state]}
                </span>
                <span className="ml-auto flex items-center gap-1 text-[9px] uppercase tracking-wider text-emerald-400 font-bold">
                  <Shield className="w-3 h-3" /> Solo i tuoi dati
                </span>
              </div>

              {(transcript || interimTranscript) && (
                <p className="text-sm text-zinc-200 mb-2">
                  <span className="text-zinc-500">Tu: </span>
                  {transcript || interimTranscript}
                </p>
              )}

              {currentPlan?.reply_text && (
                <p className="text-sm text-violet-200 mb-2">
                  <span className="text-violet-400/70">Arianna: </span>
                  {currentPlan.reply_text}
                </p>
              )}

              {currentPlan?.actions && currentPlan.actions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {currentPlan.actions.map((a, i) => (
                    <div key={i} className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {a.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed right-4 lg:right-5 z-[9999] flex items-center justify-end gap-2.5 partner-voice-fab">
        <div className="max-w-[170px] rounded-2xl border border-violet-400/20 bg-zinc-950/92 px-3 py-2 text-right shadow-xl backdrop-blur-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">Microfono AI</p>
          <p className="mt-0.5 text-[10px] leading-relaxed text-zinc-300">
            Comandi vocali: esegue task, apre sezioni e risponde sui tuoi dati.
          </p>
        </div>

        <motion.button
          type="button"
          onClick={handleClick}
          disabled={!supported && state === "idle"}
          whileTap={{ scale: 0.92 }}
          animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={isActive ? { repeat: Infinity, duration: 1.4 } : {}}
          className={`z-[9999] w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${STATE_COLOR[state]} shadow-2xl flex items-center justify-center text-white border-2 border-white/20 ${!supported && state === "idle" ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-label="Microfono AI per task vocali"
          title={supported ? "Microfono AI — esegue task e risponde con la voce sui tuoi dati" : "Voice non supportato in questo browser"}
          style={{ touchAction: "manipulation" }}
        >
          {(() => {
            const s: string = state;
            if (isActive && s !== "speaking" && s !== "error") {
              if (s === "thinking" || s === "executing") {
                return <Loader2 className="w-6 h-6 animate-spin" />;
              }
              return <X className="w-6 h-6" />;
            }
            return <Icon className={`w-6 h-6 ${s === "executing" || s === "thinking" ? "animate-spin" : ""}`} />;
          })()}
        </motion.button>
      </div>
    </>
  );
}
