import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useVoiceOrchestrator, type VoiceState } from "@/hooks/useVoiceOrchestrator";
import { Mic, MicOff, Loader2, Volume2, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Floating microphone button visible only to Super Admin.
 * Tap to start a voice command session.
 */

const STATE_LABEL: Record<VoiceState, string> = {
  idle: "Tocca per parlare",
  listening: "Ti sto ascoltando...",
  thinking: "Sto ragionando...",
  speaking: "Sto parlando...",
  awaiting_confirmation: "Dì SI o NO",
  executing: "Eseguo...",
  error: "Errore",
};

const STATE_COLOR: Record<VoiceState, string> = {
  idle: "from-amber-500 to-amber-700",
  listening: "from-rose-500 to-rose-700",
  thinking: "from-violet-500 to-violet-700",
  speaking: "from-sky-500 to-sky-700",
  awaiting_confirmation: "from-emerald-500 to-emerald-700",
  executing: "from-indigo-500 to-indigo-700",
  error: "from-red-500 to-red-700",
};

export default function VoiceOrchestratorFAB() {
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const { state, transcript, interimTranscript, currentPlan, supported, startSession, cancel } =
    useVoiceOrchestrator((p: string) => navigate(p));

  if (!isSuperAdmin) return null;

  // Hide on intro / public landing static iframes
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path === "/" || path === "/home" || path === "/index" || path.startsWith("/r/") || path.startsWith("/b/")) {
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
    if (state === "idle") {
      startSession();
    } else {
      cancel();
    }
  };

  // Global trigger — any component can dispatch `empire:voice-start` to open this session.
  if (typeof window !== "undefined") {
    (window as any).__empireVoiceStart = () => {
      if (state === "idle") startSession();
    };
  }

  return (
    <>
      {/* Backdrop overlay when active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Status panel — bottom sheet */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed bottom-24 left-3 right-3 z-[9999] max-w-md mx-auto"
          >
            <div className="rounded-2xl border border-amber-500/30 bg-zinc-950/95 backdrop-blur-xl p-4 shadow-2xl shadow-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${STATE_COLOR[state]} animate-pulse`} />
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                  {STATE_LABEL[state]}
                </span>
              </div>

              {(transcript || interimTranscript) && (
                <p className="text-sm text-zinc-200 mb-2">
                  <span className="text-zinc-500">Tu: </span>
                  {transcript || interimTranscript}
                </p>
              )}

              {currentPlan?.reply_text && (
                <p className="text-sm text-amber-200 mb-2">
                  <span className="text-amber-500/70">Arianna: </span>
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

      {/* FAB */}
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={!supported && state === "idle"}
        whileTap={{ scale: 0.92 }}
        animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={isActive ? { repeat: Infinity, duration: 1.4 } : {}}
        className={`fixed bottom-5 right-5 z-[9999] w-14 h-14 rounded-full bg-gradient-to-br ${STATE_COLOR[state]} shadow-2xl flex items-center justify-center text-white border-2 border-white/20 ${!supported && state === "idle" ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Empire Voice Orchestrator"
        title={supported ? "Empire Voice Orchestrator (parla)" : "Voice non supportato in questo browser"}
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
    </>
  );
}
