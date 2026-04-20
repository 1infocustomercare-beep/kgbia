import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { claimVoiceAgent, releaseVoiceAgent } from "@/lib/voice-agent-mutex";

/**
 * Empire Voice Orchestrator hook
 *
 * Pipeline:
 *   user voice → Web Speech API STT → voice-orchestrator (Gemini) → plan
 *     → TTS reply (ElevenLabs) → user voice "SI" / "NO" confirmation
 *     → execute actions (navigate / db / agents / query)
 *     → TTS final report
 */

export type VoiceAction =
  | { type: "navigate"; path: string; description: string }
  | { type: "db_command"; command: string; description: string }
  | { type: "trigger_agent"; agent: string; payload?: Record<string, unknown>; description: string }
  | { type: "query"; table: string; filters?: Record<string, unknown>; summary_question?: string; description: string }
  | { type: "report"; description: string };

export type VoicePlan = {
  intent_summary: string;
  actions: VoiceAction[];
  reply_text: string;
  confirmation_required: boolean;
  confirmation_question?: string;
  destructive?: boolean;
  needs_clarification?: boolean;
};

export type VoiceState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "awaiting_confirmation"
  | "executing"
  | "error";

export interface VoiceLogEntry {
  id: string;
  timestamp: number;
  transcript: string;
  intent_summary?: string;
  reply_text?: string;
  status: "success" | "cancelled" | "error" | "executing";
  actions_executed?: { description: string; ok: boolean }[];
  error?: string;
}

const MUTEX_ID = "empire-voice-orchestrator";

/* ---------------------- Browser STT helpers ---------------------- */

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getSpeechRecognition(): { new (): SpeechRecognitionLike } | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

/* ---------------------- Hook ---------------------- */

export function useVoiceOrchestrator(navigate: (path: string) => void) {
  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [currentPlan, setCurrentPlan] = useState<VoicePlan | null>(null);
  const [history, setHistory] = useState<VoiceLogEntry[]>([]);
  const [supported] = useState<boolean>(() => !!getSpeechRecognition());

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopRequestedRef = useRef(false);
  const confirmationResolverRef = useRef<((yes: boolean) => void) | null>(null);

  /* --- Audio playback (TTS) --- */
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch { /* noop */ }
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch { /* noop */ }
    }
  }, []);

  const speakBrowser = useCallback((text: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        resolve();
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "it-IT";
        utter.rate = 1.05;
        let done = false;
        const finish = () => { if (!done) { done = true; resolve(); } };
        utter.onend = finish;
        utter.onerror = finish;
        // Safety timeout — some browsers never fire onend if voice not loaded
        const estimatedMs = Math.max(1500, text.length * 65);
        const t = setTimeout(finish, estimatedMs + 4000);
        utter.onend = () => { clearTimeout(t); finish(); };
        utter.onerror = () => { clearTimeout(t); finish(); };
        window.speechSynthesis.speak(utter);
      } catch {
        resolve();
      }
    });
  }, []);

  const speak = useCallback(async (text: string): Promise<void> => {
    if (!text?.trim()) return;
    stopAudio();
    setState("speaking");

    try {
      const { data, error } = await supabase.functions.invoke("voice-orchestrator-tts", {
        body: { text },
      });
      if (error) throw new Error(error.message || "TTS invoke failed");
      if (data?.fallback || !data?.audio_base64) {
        // Server signaled fallback (quota / auth) — use browser TTS
        console.warn("[VoiceOrch] TTS fallback:", data?.error);
        await speakBrowser(text);
        return;
      }

      await new Promise<void>((resolve) => {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audio_base64}`);
        audioRef.current = audio;
        let done = false;
        const finish = () => { if (!done) { done = true; resolve(); } };
        audio.onended = finish;
        audio.onerror = finish;
        audio.play().catch(finish);
      });
    } catch (e) {
      console.warn("[VoiceOrch] TTS failed, falling back to browser TTS:", e);
      await speakBrowser(text);
    }
  }, [stopAudio, speakBrowser]);

  /* --- STT --- */
  const stopListening = useCallback(() => {
    stopRequestedRef.current = true;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* noop */ }
    }
  }, []);

  const listenOnce = useCallback((options?: { silent?: boolean }): Promise<string> => {
    return new Promise((resolve, reject) => {
      const SR = getSpeechRecognition();
      if (!SR) {
        reject(new Error("Speech recognition non supportato in questo browser"));
        return;
      }

      const recog = new SR();
      recog.lang = "it-IT";
      recog.continuous = false;
      recog.interimResults = true;
      recognitionRef.current = recog;
      stopRequestedRef.current = false;

      let finalText = "";
      let interimText = "";

      recog.onresult = (e: any) => {
        finalText = "";
        interimText = "";
        for (let i = 0; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) finalText += r[0].transcript;
          else interimText += r[0].transcript;
        }
        if (!options?.silent) setInterimTranscript(interimText || finalText);
      };

      recog.onerror = (e: any) => {
        console.warn("[VoiceOrch] STT error:", e?.error);
        if (e?.error === "no-speech" || e?.error === "aborted") {
          resolve("");
        } else {
          reject(new Error(`STT error: ${e?.error || "unknown"}`));
        }
      };

      recog.onend = () => {
        recognitionRef.current = null;
        if (!options?.silent) setInterimTranscript("");
        resolve(finalText.trim());
      };

      try {
        recog.start();
      } catch (err) {
        reject(err);
      }
    });
  }, []);

  /* --- Action executors --- */
  const executeAction = useCallback(async (action: VoiceAction): Promise<{ ok: boolean; note?: string }> => {
    try {
      switch (action.type) {
        case "navigate": {
          navigate(action.path || "/");
          return { ok: true, note: `Navigato a ${action.path}` };
        }
        case "db_command": {
          const { data, error } = await supabase.functions.invoke("ai-command-agent", {
            body: { command: action.command, source: "voice" },
          });
          if (error) throw error;
          return { ok: true, note: data?.message_it || "Comando eseguito" };
        }
        case "trigger_agent": {
          const { data, error } = await supabase.functions.invoke(action.agent, {
            body: action.payload || {},
          });
          if (error) throw error;
          return { ok: true, note: data?.message || `Agente ${action.agent} avviato` };
        }
        case "query": {
          const { data, error } = await supabase.functions.invoke("voice-orchestrator-query", {
            body: { table: action.table, filters: action.filters, summary_question: action.summary_question },
          });
          if (error) throw error;
          return { ok: true, note: data?.summary || `Trovati ${data?.count ?? 0} risultati` };
        }
        case "report":
          return { ok: true };
        default:
          return { ok: false, note: "Tipo azione sconosciuto" };
      }
    } catch (e) {
      console.error("[VoiceOrch] action failed:", action, e);
      return { ok: false, note: e instanceof Error ? e.message : "Errore esecuzione" };
    }
  }, [navigate]);

  /* --- Confirmation listener (parses SI/NO) --- */
  const waitVoiceConfirmation = useCallback(async (question: string): Promise<boolean> => {
    await speak(question);
    setState("awaiting_confirmation");

    // Try up to 2 times
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const reply = await listenOnce();
        const normalized = reply.toLowerCase().trim();
        if (/(^|\s)(si|sì|conferma|conferm[oa]|ok|va bene|d['’]accordo|esegui|procedi|fallo)(\s|$|\.|\,|!|\?)/i.test(normalized) ||
            normalized === "si" || normalized === "sì" || normalized === "ok") {
          return true;
        }
        if (/(^|\s)(no|annulla|stop|ferma|interrompi|cancella|negativo)(\s|$|\.|\,|!|\?)/i.test(normalized) ||
            normalized === "no") {
          return false;
        }
        if (attempt === 0) {
          await speak("Non ho capito. Dimmi solo SI per procedere o NO per annullare.");
        }
      } catch {
        await speak("Non sono riuscita a sentirti. Riprova.");
      }
    }

    await speak("Conferma non ricevuta. Annullo.");
    return false;
  }, [speak, listenOnce]);

  /* --- Cancel / abort --- */
  const cancel = useCallback(() => {
    stopRequestedRef.current = true;
    stopListening();
    stopAudio();
    if (confirmationResolverRef.current) {
      confirmationResolverRef.current(false);
      confirmationResolverRef.current = null;
    }
    setState("idle");
    setInterimTranscript("");
    setCurrentPlan(null);
    releaseVoiceAgent(MUTEX_ID);
  }, [stopListening, stopAudio]);

  /* --- Main flow --- */
  const startSession = useCallback(async () => {
    if (!supported) {
      toast({ title: "Riconoscimento vocale non disponibile", description: "Usa Chrome desktop o Android per parlare. Su iOS Safari non è supportato.", variant: "destructive" });
      return;
    }

    claimVoiceAgent(MUTEX_ID, () => cancel());

    try {
      // 1. Listen to user
      setState("listening");
      setTranscript("");
      setInterimTranscript("");
      setCurrentPlan(null);
      const userText = await listenOnce();
      if (!userText) {
        setState("idle");
        releaseVoiceAgent(MUTEX_ID);
        return;
      }
      setTranscript(userText);

      // 2. Plan via Gemini
      setState("thinking");
      const context = `URL attuale: ${window.location.pathname}`;
      const { data: planResp, error: planErr } = await supabase.functions.invoke("voice-orchestrator", {
        body: { transcript: userText, context },
      });
      if (planErr || !planResp?.success) {
        const msg = planErr?.message || planResp?.error || "Errore pianificazione";
        await speak(`Errore: ${msg}`);
        setState("error");
        setHistory(prev => [{
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          transcript: userText,
          status: "error" as const,
          error: msg,
        }, ...prev].slice(0, 50));
        releaseVoiceAgent(MUTEX_ID);
        return;
      }

      const plan: VoicePlan = planResp.plan;
      setCurrentPlan(plan);

      // 3. Speak the proposal
      await speak(plan.reply_text);

      // 4. If clarification needed → stop here
      if (plan.needs_clarification || plan.actions.length === 0) {
        setState("idle");
        setHistory(prev => [{
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          transcript: userText,
          intent_summary: plan.intent_summary,
          reply_text: plan.reply_text,
          status: "success" as const,
          actions_executed: [],
        }, ...prev].slice(0, 50));
        releaseVoiceAgent(MUTEX_ID);
        return;
      }

      // 5. Voice confirmation (always required per user choice)
      const question = plan.confirmation_question || `Confermi: ${plan.intent_summary}? Dì SI o NO.`;
      const confirmed = await waitVoiceConfirmation(question);

      if (!confirmed) {
        await speak("Annullato.");
        setState("idle");
        setHistory(prev => [{
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          transcript: userText,
          intent_summary: plan.intent_summary,
          reply_text: plan.reply_text,
          status: "cancelled" as const,
        }, ...prev].slice(0, 50));
        releaseVoiceAgent(MUTEX_ID);
        return;
      }

      // 6. Execute actions in order
      setState("executing");
      const results: { description: string; ok: boolean; note?: string }[] = [];
      for (const action of plan.actions) {
        const r = await executeAction(action);
        results.push({ description: action.description, ok: r.ok, note: r.note });
        if (!r.ok) break;
      }

      // 7. Final voice report
      const okCount = results.filter(r => r.ok).length;
      const failCount = results.length - okCount;
      let finalReport = "";
      if (failCount === 0) {
        // If query, prefer the data summary
        const querySummary = results.find(r => r.note && plan.actions.some(a => a.type === "query"))?.note;
        finalReport = querySummary || `Fatto. ${okCount} azion${okCount === 1 ? "e" : "i"} eseguit${okCount === 1 ? "a" : "e"}.`;
      } else {
        finalReport = `Eseguite ${okCount} su ${results.length}. Errore: ${results.find(r => !r.ok)?.note || "sconosciuto"}.`;
      }
      await speak(finalReport);

      setHistory(prev => [{
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        transcript: userText,
        intent_summary: plan.intent_summary,
        reply_text: finalReport,
        status: (failCount === 0 ? "success" : "error") as "success" | "error",
        actions_executed: results.map(r => ({ description: r.description, ok: r.ok })),
      }, ...prev].slice(0, 50));

      setState("idle");
    } catch (e) {
      console.error("[VoiceOrch] session error:", e);
      const msg = e instanceof Error ? e.message : "Errore sconosciuto";
      await speak(`Si è verificato un errore: ${msg}`);
      setState("error");
    } finally {
      releaseVoiceAgent(MUTEX_ID);
    }
  }, [supported, listenOnce, speak, executeAction, waitVoiceConfirmation, cancel]);

  useEffect(() => {
    return () => {
      stopAudio();
      stopListening();
      releaseVoiceAgent(MUTEX_ID);
    };
  }, [stopAudio, stopListening]);

  return {
    state,
    transcript,
    interimTranscript,
    currentPlan,
    history,
    supported,
    startSession,
    cancel,
  };
}
