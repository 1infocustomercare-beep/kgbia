// ATLAS Voice Agent v5 — ElevenLabs Conversational AI SDK + fallback
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, X, MessageSquare, Send, Play, Square, Pause, Phone, PhoneOff } from "lucide-react";
import voiceAgentAvatar from "@/assets/voice-agent-avatar.png";
import ReactMarkdown from "react-markdown";
import { useConversation } from "@elevenlabs/react";
import { supabase } from "@/integrations/supabase/client";
import { stopSplashNarration } from "@/lib/splash-narration";

type Msg = { role: "user" | "assistant"; content: string };
type VoiceMode = "legacy" | "elevenlabs";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-voice-agent`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-tts`;

// ── Section narration scripts ──
const SECTION_SCRIPTS: Record<string, string> = {
  hero: "Ciao! Sono Arianna, la tua consulente digitale Empire. Hai tra le mani il sistema operativo più avanzato d'Italia per far crescere il tuo business. In pochi minuti ti mostro come Empire può aumentare i tuoi ricavi del trenta per cento e tagliare i costi operativi — senza cambiare nulla di quello che fai oggi. Vuoi scoprire come funziona per il tuo settore?",
  industries: "Empire copre venticinque settori — ristorazione, hotel, beauty, NCC, healthcare, edilizia e molti altri. Ogni modulo è costruito su misura con funzionalità specifiche per il tuo mercato. Non è un software generico: è come avere un team tech dedicato, a una frazione del costo.",
  services: "Menu digitale con QR, CRM clienti, prenotazioni automatiche, fatturazione elettronica, marketing automation, agenti IA che lavorano per te ventiquattr'ore su ventiquattro — tutto in un'unica piattaforma. Zero integrazioni esterne, zero mal di testa tecnici.",
  process: "Tre passi e sei operativo: scegli il settore, personalizza la tua app, e vai online. Il nostro team configura tutto in ventiquattr'ore. Nessuna competenza tecnica richiesta — ci pensiamo noi a tutto.",
  app: "Guarda la tua app in azione: dashboard in tempo reale, gestione completa degli ordini, analytics predittivi con intelligenza artificiale. Tutto dal tuo smartphone, ovunque ti trovi. I tuoi competitor ancora usano carta e penna.",
  calculator: "I numeri parlano chiaro: con Empire risparmi fino a quindicimila euro l'anno rispetto alle soluzioni tradizionali. Il ritorno sull'investimento è già dal primo mese. Vuoi che faccia un calcolo personalizzato per la tua attività?",
  testimonials: "Non devi credermi sulla parola — i risultati parlano da soli. Centinaia di imprenditori hanno già scelto Empire e hanno aumentato fatturato e clienti in meno di novanta giorni.",
  pricing: "Un investimento chiaro, prevedibile e scalabile: Empire cresce con te. Niente sorprese, niente costi nascosti. Ogni euro investito genera valore misurabile per la tua azienda.",
  partner: "Vuoi guadagnare vendendo Empire? Commissioni fino a novecentonovantasette euro per ogni vendita chiusa, bonus ricorrenti fino a millecinquecento al mese. Zero rischio, zero investimento iniziale. Il programma partner più vantaggioso del settore.",
  contact: "Perfetto — se vuoi possiamo passare all'azione adesso. Ti preparo una demo personalizzata per il tuo settore e in dieci minuti vedi Empire in funzione con i tuoi dati. Cosa ne dici?",
};

const SECTION_ORDER = ["hero", "industries", "services", "process", "app", "calculator", "testimonials", "pricing", "partner", "contact"];

const normalizeTextForSpeech = (text: string) =>
  text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/#{1,6}\s?/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/[>*_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 700);

// ── Best Italian female voice from Web Speech API ──
let cachedItalianVoice: SpeechSynthesisVoice | null = null;

function getBestItalianFemaleVoice(): SpeechSynthesisVoice | null {
  if (cachedItalianVoice) return cachedItalianVoice;
  
  const voices = window.speechSynthesis?.getVoices() || [];
  
  // Priority order for natural-sounding Italian female voices
  const priorities = [
    // iOS / macOS premium voices
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /alice/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /federica/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /elsa/i.test(v.name),
    // Google / Android premium
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /google.*italiano.*female/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /google/i.test(v.name),
    // Microsoft voices
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /elsa|isabella|cosimo/i.test(v.name),
    // Any Italian female
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /femal|donna|woman/i.test(v.name),
    // Any Italian voice
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it"),
  ];
  
  for (const test of priorities) {
    const match = voices.find(test);
    if (match) {
      cachedItalianVoice = match;
      return match;
    }
  }
  return null;
}

// Preload voices
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedItalianVoice = null;
    getBestItalianFemaleVoice();
  };
}

// ── Web Speech API fallback TTS ──
const SPEECH_START_GUARD_MS = 5000;
const SPEECH_HARD_TIMEOUT_MS = 60000;
const SPEECH_VOICE_WARMUP_RETRIES = 12;
const BROWSER_ONLY_TTS_KEY = "empire_voice_browser_only";
const BROWSER_ONLY_TTS_TTL_MS = 15 * 60 * 1000;

function setBrowserOnlyTTS(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (enabled) {
      const until = Date.now() + BROWSER_ONLY_TTS_TTL_MS;
      window.localStorage.setItem(BROWSER_ONLY_TTS_KEY, String(until));
    } else {
      window.localStorage.removeItem(BROWSER_ONLY_TTS_KEY);
    }
  } catch {
    // noop
  }
}

function isBrowserOnlyTTS(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(BROWSER_ONLY_TTS_KEY);
    if (!raw) return false;

    const until = Number(raw);
    const isExpired = !Number.isFinite(until) || Date.now() > until;

    if (isExpired) {
      window.localStorage.removeItem(BROWSER_ONLY_TTS_KEY);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function speakWithBrowserTTS(
  text: string,
  abortRef: React.MutableRefObject<boolean>,
  options?: { preferImmediate?: boolean },
): Promise<boolean> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis || abortRef.current) {
      resolve(false);
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    let settled = false;
    let started = false;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(startGuardTimer);
      window.clearTimeout(hardTimer);
      utterance.onstart = null;
      utterance.onend = null;
      utterance.onerror = null;
      resolve(ok);
    };

    const speakNow = () => {
      if (abortRef.current || settled) {
        finish(false);
        return;
      }

      const voice = getBestItalianFemaleVoice();
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = "it-IT";
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        started = true;
        console.log("[Arianna TTS] ▶ Speech started");
      };
      utterance.onend = () => { console.log("[Arianna TTS] ✅ Speech ended"); finish(true); };
      utterance.onerror = (e) => { console.warn("[Arianna TTS] ❌ Speech error", e); finish(false); };

      const runSpeak = () => {
        if (abortRef.current || settled) {
          finish(false);
          return;
        }
        try {
          synth.speak(utterance);
        } catch {
          finish(false);
        }
      };

      try {
        if (synth.speaking || synth.pending) {
          synth.cancel();
        }

        // If we are inside a direct user gesture, speak immediately to satisfy iOS autoplay policies.
        const gestureActive =
          (navigator as Navigator & { userActivation?: { isActive?: boolean } }).userActivation?.isActive === true;

        if (options?.preferImmediate || gestureActive) {
          runSpeak();
        } else {
          // Let engine reset after cancel (important on iOS/Safari when not in gesture context)
          window.setTimeout(runSpeak, 80);
        }
      } catch {
        finish(false);
      }
    };

    const warmupVoices = (attempt = 0) => {
      // In direct gesture context (mobile autoplay unlock), speak immediately.
      // Waiting for voice warmup would move execution outside gesture and get blocked on iOS.
      if (options?.preferImmediate) {
        speakNow();
        return;
      }

      const voices = synth.getVoices();
      if (voices.length > 0 || attempt >= SPEECH_VOICE_WARMUP_RETRIES) {
        speakNow();
        return;
      }
      window.setTimeout(() => warmupVoices(attempt + 1), 250);
    };

    const startGuardTimer = window.setTimeout(() => {
      if (started) return;
      try {
        synth.cancel();
      } catch {
        // noop
      }
      finish(false);
    }, SPEECH_START_GUARD_MS);

    const hardTimer = window.setTimeout(() => {
      try {
        synth.cancel();
      } catch {
        // noop
      }
      finish(false);
    }, SPEECH_HARD_TIMEOUT_MS);

    warmupVoices();
  });
}

// ── TTS helper — browser-first for reliable auto-start on landing/splash ──
// Premium audio element playback can be blocked by autoplay policies on mobile.
const PREMIUM_SECTIONS = new Set<string>();

async function speakText(
  text: string,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  abortRef: React.MutableRefObject<boolean>,
  useBrowserFallbackRef: React.MutableRefObject<boolean>,
  sectionId?: string,
  options?: { preferImmediate?: boolean },
): Promise<boolean> {
  if (abortRef.current) return false;

  const normalizedText = normalizeTextForSpeech(text);
  if (!normalizedText) return false;

  if (isBrowserOnlyTTS()) {
    useBrowserFallbackRef.current = true;
  }

  // Use browser TTS first for reliability, then fallback to premium for hero when needed.
  const isPremiumSection = sectionId ? PREMIUM_SECTIONS.has(sectionId) : false;
  if (!isPremiumSection || useBrowserFallbackRef.current) {
    const playedInBrowser = await speakWithBrowserTTS(normalizedText, abortRef, options);
    if (playedInBrowser || abortRef.current) return playedInBrowser;

    // If browser speech is blocked, always allow premium fallback for hero.
    if (sectionId !== "hero") {
      return false;
    }
  }

  // Premium voice (ElevenLabs) — fallback path for blocked hero autoplay
  try {
    const resp = await fetch(TTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ text: normalizedText }),
    });

    if (!resp.ok || abortRef.current) {
      // Transient API/network errors should not permanently force browser-only mode.
      useBrowserFallbackRef.current = true;
      return speakWithBrowserTTS(normalizedText, abortRef, options);
    }

    const data = await resp.json();

    if (data?.error || data?.fallback || !data?.audioContent || abortRef.current) {
      useBrowserFallbackRef.current = true;
      if (data?.error === "quota_exceeded" || data?.fallback) {
        setBrowserOnlyTTS(true);
      }
      return speakWithBrowserTTS(normalizedText, abortRef, options);
    }

    // Premium path worked: allow future premium attempts again
    setBrowserOnlyTTS(false);

    return await new Promise<boolean>((resolve) => {
      const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
      audio.preload = "auto";

      if (audioRef.current) audioRef.current.pause();
      audioRef.current = audio;

      audio.onended = () => resolve(true);
      audio.onerror = () => {
        useBrowserFallbackRef.current = true;
        speakWithBrowserTTS(normalizedText, abortRef, options).then(resolve);
      };

      if (abortRef.current) {
        audio.pause();
        resolve(false);
        return;
      }

      audio.play().catch(() => {
        useBrowserFallbackRef.current = true;
        speakWithBrowserTTS(normalizedText, abortRef, options).then(resolve);
      });
    });
  } catch {
    useBrowserFallbackRef.current = true;
    return speakWithBrowserTTS(normalizedText, abortRef, options);
  }
}

// ── Stream chat helper ──
async function streamChat({
  messages, mode, pageContent, sectionId, onDelta, onDone,
}: {
  messages: Msg[]; mode?: string; pageContent?: string; sectionId?: string;
  onDelta: (t: string) => void; onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, mode, pageContent, sectionId }),
  });

  if (!resp.ok) {
    let errorMessage = `Richiesta fallita (${resp.status})`;
    try {
      const errorBody = await resp.json();
      errorMessage = errorBody?.error || errorMessage;
    } catch {
      // noop
    }
    throw new Error(errorMessage);
  }

  if (!resp.body) {
    throw new Error("Nessun flusso di risposta ricevuto");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;

    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":")) continue;
      if (line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  if (textBuffer.trim()) {
    for (let rawLine of textBuffer.split("\n")) {
      if (!rawLine) continue;
      if (rawLine.endsWith("\r")) rawLine = rawLine.slice(0, -1);
      if (rawLine.startsWith(":")) continue;
      if (rawLine.trim() === "") continue;
      if (!rawLine.startsWith("data: ")) continue;

      const jsonStr = rawLine.slice(6).trim();
      if (jsonStr === "[DONE]") continue;

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        // ignore leftover partial
      }
    }
  }

  onDone();
}

// ── SpeechRecognition ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const EmpireVoiceAgent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"voice" | "chat">("voice");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inputText, setInputText] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [currentSection, setCurrentSection] = useState<string>("hero");
  const [narratedSections, setNarratedSections] = useState<Set<string>>(new Set());
  const [autoNarrating, setAutoNarrating] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mobilePromptShown, setMobilePromptShown] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // ElevenLabs Conversational AI states
  const [voiceMode, setVoiceMode] = useState<VoiceMode>("legacy");
  const [elevenlabsConnecting, setElevenlabsConnecting] = useState(false);
  const [elevenlabsAvailable, setElevenlabsAvailable] = useState<boolean | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<InstanceType<NonNullable<typeof SpeechRecognition>> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);
  const messagesRef = useRef<Msg[]>([]);
  const voiceEnabledRef = useRef(true);
  const autoNarratingRef = useRef(false);
  const narratedRef = useRef<Set<string>>(new Set());
  const sectionQueueRef = useRef<string[]>([]);
  const queueProcessingRef = useRef(false);
  const narrationAttemptsRef = useRef<Record<string, number>>({});
  const introStartedRef = useRef(false);
  const autoBootedRef = useRef(false);
  const useBrowserFallbackRef = useRef(isBrowserOnlyTTS());
  const isTouchDeviceRef = useRef(false);
  const userInteractedRef = useRef(false);
  const unlockInFlightRef = useRef(false);
  const preferImmediateNarrationRef = useRef(false);

  // ── ElevenLabs Conversational AI hook ──
  const conversation = useConversation({
    onConnect: () => {
      setMessages(prev => [...prev, { role: "assistant", content: "📞 Arianna in linea! Parlami pure, ti ascolto..." }]);
    },
    onDisconnect: () => {
      setVoiceMode("legacy");
    },
    onMessage: (message: any) => {
      if (message?.type === "user_transcript") {
        const text = message?.user_transcription_event?.user_transcript;
        if (text) setMessages(prev => [...prev, { role: "user", content: text }]);
      } else if (message?.type === "agent_response") {
        const text = message?.agent_response_event?.agent_response;
        if (text) setMessages(prev => [...prev, { role: "assistant", content: text }]);
      }
    },
    onError: () => {
      setElevenlabsAvailable(false);
      setVoiceMode("legacy");
    },
  });

  const getElevenlabsTokenSilently = useCallback(async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("elevenlabs-conversation-token", {
        body: {},
      });

      if (error || !data?.token) {
        setElevenlabsAvailable(false);
        return null;
      }

      return data.token as string;
    } catch {
      setElevenlabsAvailable(false);
      return null;
    }
  }, []);

  // Check ElevenLabs availability early (on mount) so the call button works immediately
  useEffect(() => {
    if (elevenlabsAvailable !== null) return;

    let mounted = true;
    // Delay check slightly to avoid blocking initial render
    const timer = setTimeout(async () => {
      const token = await getElevenlabsTokenSilently();
      if (!mounted) return;
      setElevenlabsAvailable(!!token);
    }, 2000);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [elevenlabsAvailable, getElevenlabsTokenSilently]);

  // Start ElevenLabs conversation
  const startElevenlabsConversation = useCallback(async () => {
    setElevenlabsConnecting(true);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const token = await getElevenlabsTokenSilently();
      if (!token) {
        setVoiceMode("legacy");
        return;
      }

      await conversation.startSession({
        conversationToken: token,
        connectionType: "webrtc",
      });

      setVoiceMode("elevenlabs");
    } catch {
      setElevenlabsAvailable(false);
      setVoiceMode("legacy");
    } finally {
      setElevenlabsConnecting(false);
    }
  }, [conversation, getElevenlabsTokenSilently]);

  const stopElevenlabsConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch {
      // silent fallback to legacy mode
    }
    setVoiceMode("legacy");
  }, [conversation]);

  // Sync refs
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);
  useEffect(() => { autoNarratingRef.current = autoNarrating; }, [autoNarrating]);
  useEffect(() => { isTouchDeviceRef.current = isTouchDevice; }, [isTouchDevice]);
  useEffect(() => { userInteractedRef.current = userInteracted; }, [userInteracted]);

  useEffect(() => {
    if (!SpeechRecognition) setMode("chat");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const updateTouchState = () => setIsTouchDevice(mediaQuery.matches);
    updateTouchState();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateTouchState);
      return () => mediaQuery.removeEventListener("change", updateTouchState);
    }
    mediaQuery.addListener(updateTouchState);
    return () => mediaQuery.removeListener(updateTouchState);
  }, []);

  // Auto-scroll chat
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ── Intersection Observer ──
  useEffect(() => {
    const observedIds = SECTION_ORDER.filter((id) => !!document.getElementById(id));
    if (observedIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!mostVisible) return;
        const sectionId = mostVisible.target.getAttribute("id");
        if (!sectionId) return;
        setCurrentSection((prev) => (prev === sectionId ? prev : sectionId));
      },
      { threshold: [0.25, 0.4, 0.6], rootMargin: "-10% 0px -45% 0px" }
    );

    observedIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ── Follow click navigation ──
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.replace("#", "")?.trim();
      if (!id || !SECTION_SCRIPTS[id]) return;

      setCurrentSection((prev) => (prev === id ? prev : id));
      if (!autoNarratingRef.current) return;

      narratedRef.current.delete(id);
      setNarratedSections(new Set(narratedRef.current));
      if (!sectionQueueRef.current.includes(id)) {
        sectionQueueRef.current.push(id);
      }
      void processNarrationQueue();
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // ── Queue processor ──
  const processNarrationQueue = useCallback(async () => {
    if (queueProcessingRef.current) return;
    queueProcessingRef.current = true;

    while (sectionQueueRef.current.length > 0) {
      if (abortRef.current) break;

      const sectionId = sectionQueueRef.current.shift();
      if (!sectionId) continue;

      const script = SECTION_SCRIPTS[sectionId];
      if (!script || !voiceEnabledRef.current) continue;
      if (narratedRef.current.has(sectionId)) continue;

      narrationAttemptsRef.current[sectionId] = (narrationAttemptsRef.current[sectionId] ?? 0) + 1;
      console.log(`[Arianna] Narrating "${sectionId}" attempt #${narrationAttemptsRef.current[sectionId]}`);

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content === script) {
          return prev;
        }
        return [...prev, { role: "assistant", content: script }];
      });
      setIsSpeaking(true);
      setIsPaused(false);
      abortRef.current = false;

      // No aggressive timeout race — let speakText finish naturally
      const preferImmediate = sectionId === "hero" && preferImmediateNarrationRef.current;
      const played = await speakText(script, audioRef, abortRef, useBrowserFallbackRef, sectionId, {
        preferImmediate,
      });
      if (preferImmediate) {
        preferImmediateNarrationRef.current = false;
      }

      if (played && !abortRef.current) {
        narrationAttemptsRef.current[sectionId] = 0;
        narratedRef.current.add(sectionId);
        setNarratedSections(new Set(narratedRef.current));
      } else if (!abortRef.current) {
        const attempts = narrationAttemptsRef.current[sectionId] ?? 0;
        console.warn(`[Arianna] Narration failed for "${sectionId}", attempt ${attempts}`);
        if (attempts < 3) {
          await new Promise(r => setTimeout(r, 2000));
          sectionQueueRef.current.push(sectionId);
        } else {
          // After 3 failures, mark as narrated to stop retrying and show text only
          console.log(`[Arianna] Giving up narration for "${sectionId}" after ${attempts} attempts — text shown in chat`);
          narratedRef.current.add(sectionId);
          setNarratedSections(new Set(narratedRef.current));
        }
      }

      setIsSpeaking(false);
    }

    queueProcessingRef.current = false;
  }, []);

  const enqueueSectionNarration = useCallback((sectionId: string, forceReplay = false) => {
    if (!SECTION_SCRIPTS[sectionId] || !voiceEnabledRef.current) return;

    if (forceReplay) {
      narratedRef.current.delete(sectionId);
      setNarratedSections(new Set(narratedRef.current));
    }

    if (narratedRef.current.has(sectionId)) return;
    if (sectionQueueRef.current.includes(sectionId)) return;

    sectionQueueRef.current.push(sectionId);
    void processNarrationQueue();
  }, [processNarrationQueue]);

  const startIntroNarration = useCallback(() => {
    if (introStartedRef.current || !voiceEnabledRef.current) return;

    introStartedRef.current = true;
    autoNarratingRef.current = true;
    setAutoNarrating(true);

    // Hard handoff: prevent splash TTS from blocking/canceling Arianna.
    stopSplashNarration();
    abortRef.current = false;

    enqueueSectionNarration("hero", true);
  }, [enqueueSectionNarration]);

  const stopAll = useCallback(() => {
    abortRef.current = true;
    autoNarratingRef.current = false;
    sectionQueueRef.current = [];
    queueProcessingRef.current = false;
    narrationAttemptsRef.current = {};

    // Stop browser TTS
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }

    setIsSpeaking(false);
    setIsPaused(false);
    setIsListening(false);
    setLiveTranscript("");
    setAutoNarrating(false);
  }, []);

  // ── Pause / Resume ──
  const togglePause = useCallback(() => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play().catch(() => undefined);
        setIsPaused(false);
      } else {
        audioRef.current.pause();
        setIsPaused(true);
      }
    } else if (window.speechSynthesis) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  }, [isPaused]);

  // ── Auto-narrate on section change ──
  useEffect(() => {
    if (!autoNarrating) return;
    if (!currentSection || !SECTION_SCRIPTS[currentSection]) return;
    enqueueSectionNarration(currentSection);
  }, [autoNarrating, currentSection, enqueueSectionNarration]);

  // ── Visibility ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // ── Auto-voice intro (hands-free) — waits for hero section to be visible (post-splash) ──
  useEffect(() => {
    if (autoBootedRef.current) return;

    const bootAttempt = () => {
      if (autoBootedRef.current) return;
      // Only boot once the hero section is actually rendered and visible (splash is done)
      const heroEl = document.getElementById("hero");
      if (!heroEl) return false;
      const rect = heroEl.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0 && rect.height > 0;
      if (!isVisible) return false;

      autoBootedRef.current = true;
      console.log("[Arianna] Boot attempt — hero visible, starting narration");
      startIntroNarration();
      if (!narratedRef.current.has("hero")) {
        enqueueSectionNarration("hero", true);
      }
      return true;
    };

    // Poll until hero section becomes visible (after splash completes)
    const pollInterval = window.setInterval(() => {
      if (bootAttempt()) {
        window.clearInterval(pollInterval);
      }
    }, 500);

    // Safety: stop polling after 30s
    const safety = window.setTimeout(() => {
      window.clearInterval(pollInterval);
      if (!autoBootedRef.current) {
        autoBootedRef.current = true;
        startIntroNarration();
      }
    }, 30000);

    return () => {
      window.clearInterval(pollInterval);
      window.clearTimeout(safety);
    };
  }, [startIntroNarration, enqueueSectionNarration]);

  // ── Recovery: autoplay restrictions on mobile browsers (retry inside first gestures, also after splash) ──
  // IMPORTANT: This only fires ONCE to unlock audio. After that, narration continues
  // on its own via the queue system. Touching the screen must NOT restart narration.
  const audioUnlockedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const unlockAndRetry = () => {
      if (!isMounted) return;
      // Only unlock ONCE — after that, narration is self-sustaining
      if (audioUnlockedRef.current) return;
      if (unlockInFlightRef.current) return;

      unlockInFlightRef.current = true;
      audioUnlockedRef.current = true;
      userInteractedRef.current = true;
      setUserInteracted(true);

      // Unlock speechSynthesis with a silent utterance inside gesture context
      if (window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const silent = new SpeechSynthesisUtterance(" ");
          silent.volume = 0;
          silent.lang = "it-IT";
          window.speechSynthesis.speak(silent);
        } catch {
          // noop
        }
      }

      // Force next hero narration attempt to run immediately in this gesture context
      preferImmediateNarrationRef.current = true;
      narrationAttemptsRef.current.hero = 0;

      stopSplashNarration();
      abortRef.current = false;
      startIntroNarration();
      if (!narratedRef.current.has("hero")) {
        enqueueSectionNarration("hero", true);
      }

      unlockInFlightRef.current = false;
    };

    const options = { passive: true } as const;
    window.addEventListener("empire-user-gesture", unlockAndRetry as EventListener);
    window.addEventListener("pointerdown", unlockAndRetry, options);
    window.addEventListener("touchstart", unlockAndRetry, options);
    window.addEventListener("touchend", unlockAndRetry, options);
    window.addEventListener("click", unlockAndRetry, options);
    window.addEventListener("keydown", unlockAndRetry);
    window.addEventListener("scroll", unlockAndRetry, options);

    const maybeActivated =
      (navigator as Navigator & { userActivation?: { hasBeenActive?: boolean } }).userActivation?.hasBeenActive;
    if (maybeActivated) {
      window.setTimeout(unlockAndRetry, 0);
      window.setTimeout(unlockAndRetry, 600);
      window.setTimeout(unlockAndRetry, 1800);
    }

    return () => {
      isMounted = false;
      unlockInFlightRef.current = false;
      window.removeEventListener("empire-user-gesture", unlockAndRetry as EventListener);
      window.removeEventListener("pointerdown", unlockAndRetry as EventListener);
      window.removeEventListener("touchstart", unlockAndRetry as EventListener);
      window.removeEventListener("touchend", unlockAndRetry as EventListener);
      window.removeEventListener("click", unlockAndRetry as EventListener);
      window.removeEventListener("keydown", unlockAndRetry as EventListener);
      window.removeEventListener("scroll", unlockAndRetry as EventListener);
    };
  }, [enqueueSectionNarration, startIntroNarration]);

  // ── Mobile: start speaking after user's tap on prompt ──
  const handleMobileActivate = useCallback(() => {
    userInteractedRef.current = true;
    setUserInteracted(true);
    setMobilePromptShown(false);
    setIsOpen(true);
    setTimeout(() => {
      startIntroNarration();
      if (!narratedRef.current.has("hero")) {
        enqueueSectionNarration("hero", true);
      }
    }, 50);
  }, [startIntroNarration, enqueueSectionNarration]);

  // ── Send user message ──
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    stopAll();
    abortRef.current = false;

    const userMsg: Msg = { role: "user", content: text };
    const allMessages = [...messagesRef.current, userMsg];
    setMessages(allMessages);
    setIsLoading(true);
    setInputText("");

    let full = "";
    const upsert = (chunk: string) => {
      full += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: full } : m));
        }
        return [...prev, { role: "assistant", content: full }];
      });
    };

    try {
      await streamChat({
        messages: allMessages,
        mode: "landing-assistant",
        sectionId: currentSection,
        onDelta: upsert,
        onDone: async () => {
          setIsLoading(false);
          const shouldSpeak = voiceEnabledRef.current && full.length > 0 && full.length < 2000 && !abortRef.current;
          if (!shouldSpeak) return;

          setIsSpeaking(true);
          await speakText(full, audioRef, abortRef, useBrowserFallbackRef);
          if (!abortRef.current) setIsSpeaking(false);
        },
      });
    } catch (error) {
      setIsLoading(false);
      const fallbackMessage = "Mi scuso, c'è stato un problema. Riprova tra un momento.";
      const message = error instanceof Error ? error.message : fallbackMessage;
      setMessages((prev) => [...prev, { role: "assistant", content: message || fallbackMessage }]);
    }
  }, [currentSection, isLoading, stopAll]);

  // ── Voice recognition ──
  const startListening = useCallback(async () => {
    if (!SpeechRecognition) {
      setMode("chat");
      return;
    }

    stopAll();
    abortRef.current = false;

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Per usare la voce su mobile, abilita l'accesso al microfono del browser e riprova." }
      ]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "it-IT";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setLiveTranscript(interim);
      if (final) { setLiveTranscript(""); setIsListening(false); sendMessage(final); }
    };
    recognition.onerror = () => { setIsListening(false); setLiveTranscript(""); };
    recognition.onend = () => { setIsListening(false); setLiveTranscript(""); };

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  }, [sendMessage, stopAll]);

  // ── Toggle panel — unlock audio on user gesture, then start narration ──
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        userInteractedRef.current = true;
        setUserInteracted(true);
        setMobilePromptShown(false);

        // Unlock speechSynthesis with a silent utterance inside the gesture context
        if (window.speechSynthesis) {
          try {
            const silent = new SpeechSynthesisUtterance("");
            silent.volume = 0;
            silent.lang = "it-IT";
            window.speechSynthesis.speak(silent);
          } catch {
            // noop
          }
        }

        // Start narration after short delay (audio context is now unlocked)
        setTimeout(() => {
          startIntroNarration();
          if (!narratedRef.current.has("hero")) {
            enqueueSectionNarration("hero", true);
          }
        }, 200);

        // Auto-start ElevenLabs conversation for instant phone call feel
        if (elevenlabsAvailable && voiceMode !== "elevenlabs") {
          setTimeout(() => startElevenlabsConversation(), 500);
        }
      } else {
        // Closing panel: stop narration and end ElevenLabs call
        stopAll();
        if (voiceMode === "elevenlabs" && conversation.status === "connected") {
          stopElevenlabsConversation();
        }
      }
      return next;
    });
  }, [startIntroNarration, enqueueSectionNarration, elevenlabsAvailable, voiceMode, startElevenlabsConversation, stopElevenlabsConversation, conversation.status, stopAll]);

  // ── Ring tone for phone call effect ──
  const ringToneRef = useRef<{ ctx: AudioContext; osc: OscillatorNode; gain: GainNode } | null>(null);

  const playRingTone = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 440;
      gain.gain.value = 0.15;
      osc.connect(gain).connect(ctx.destination);
      osc.start();

      // Ring pattern: beep-pause-beep
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.setValueAtTime(0, now + 0.4);
      gain.gain.setValueAtTime(0.15, now + 0.6);
      gain.gain.setValueAtTime(0, now + 1.0);
      gain.gain.setValueAtTime(0.15, now + 1.4);
      gain.gain.setValueAtTime(0, now + 1.8);

      ringToneRef.current = { ctx, osc, gain };

      // Auto-stop after 3s max
      setTimeout(() => stopRingTone(), 3000);
    } catch {
      // AudioContext not available
    }
  }, []);

  const stopRingTone = useCallback(() => {
    if (ringToneRef.current) {
      try {
        ringToneRef.current.osc.stop();
        ringToneRef.current.ctx.close();
      } catch { /* noop */ }
      ringToneRef.current = null;
    }
  }, []);

  const handleCallAction = useCallback(async () => {
    if (voiceMode === "elevenlabs" && conversation.status === "connected") {
      stopRingTone();
      void stopElevenlabsConversation();
      return;
    }

    // Stop any ongoing narration so the call takes over
    stopAll();
    abortRef.current = false;

    // Play ring tone for realistic phone feel
    playRingTone();

    // Show connecting message
    setMessages(prev => [...prev, { role: "assistant", content: "📞 Sto chiamando Arianna..." }]);
    setIsOpen(true);

    // Try ElevenLabs first if available
    if (elevenlabsAvailable !== false) {
      try {
        await startElevenlabsConversation();
        stopRingTone();
        return;
      } catch {
        // Fall through to legacy mode
      }
    }

    // Fallback: use legacy SpeechRecognition for a "call" experience
    stopRingTone();

    if (SpeechRecognition) {
      setMessages(prev => [...prev, { role: "assistant", content: "📞 Arianna in linea! Parlami pure, ti ascolto... 🎙️" }]);
      setMode("voice");

      // Small delay so the user sees the message before mic starts
      setTimeout(() => {
        startListening();
      }, 800);
    } else {
      // No mic available — switch to chat mode
      setMessages(prev => [...prev, { role: "assistant", content: "Ciao! Sono qui per aiutarti 💬 Scrivi pure la tua domanda qui sotto." }]);
      setMode("chat");
    }
  }, [voiceMode, conversation.status, stopElevenlabsConversation, elevenlabsAvailable, startElevenlabsConversation, stopAll, playRingTone, stopRingTone, startListening]);

  // ── Render ──
  return (
    <>
      {/* Voice agent — starts only on user interaction */}

      {/* Floating Phone Button — "Chiama Arianna" */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] sm:bottom-6 right-3 sm:right-4 z-[201] group touch-manipulation"
            onClick={toggleOpen}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            {/* Pulsing ring when speaking */}
            {(isSpeaking || (voiceMode === "elevenlabs" && conversation.status === "connected")) && !isOpen && (
              <motion.div
                className="absolute -inset-2 rounded-full border-2 border-primary/40"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-[0_0_30px_hsla(265,85%,65%,0.25)] border-2 border-primary/30">
              <img src={voiceAgentAvatar} alt="Arianna — Assistente Empire" className="w-full h-full object-cover" />
              {/* Active call indicator */}
              {(isSpeaking && !isPaused && !isOpen) && (
                <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-background" />
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Agent Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-0 right-0 z-[200] w-full sm:w-[380px] sm:bottom-4 sm:right-4 max-h-[70dvh] sm:max-h-[600px] flex flex-col rounded-t-2xl sm:rounded-2xl border border-foreground/[0.08] bg-background/95 backdrop-blur-2xl shadow-[0_0_60px_hsla(265,85%,65%,0.15)]"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-foreground/[0.06]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <motion.div
                    className="absolute -inset-1 rounded-full bg-primary/20 blur-sm"
                    animate={isSpeaking && !isPaused ? { opacity: [0.25, 0.45, 0.25], scale: [1, 1.08, 1] } : { opacity: 0.2, scale: 1 }}
                    transition={{ duration: 1.4, repeat: isSpeaking && !isPaused ? Infinity : 0, ease: "easeInOut" }}
                  />
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30">
                    <img src={voiceAgentAvatar} alt="Assistente vocale" className="w-full h-full object-cover" />
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                      isPaused ? "bg-amber-400" :
                      isSpeaking ? "bg-green-400" :
                      isListening ? "bg-amber-400" :
                      isLoading ? "bg-blue-400" :
                      autoNarrating ? "bg-green-400" :
                      "bg-primary/60"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Arianna</h3>
                  <p className="text-[0.55rem] text-foreground/40 tracking-wider uppercase">
                    {voiceMode === "elevenlabs" && conversation.status === "connected"
                      ? conversation.isSpeaking ? "🔊 Conversazione attiva" : "🎙️ Ti ascolta..."
                      : isPaused ? "⏸ In pausa"
                      : isSpeaking ? "🔊 Sta parlando..."
                      : isListening ? "🎙️ Ti ascolta..."
                      : isLoading ? "💭 Sta pensando..."
                      : autoNarrating ? `📍 ${currentSection}`
                      : "Empire AI Agent"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Auto-narration toggle */}
                <button
                  onClick={() => {
                    if (autoNarrating) {
                      stopAll();
                    } else {
                      autoNarratingRef.current = true;
                      setAutoNarrating(true);
                      enqueueSectionNarration(currentSection, true);
                    }
                  }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    autoNarrating ? "text-green-400 bg-green-400/10" : "text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05]"
                  }`}
                  title={autoNarrating ? "Ferma guida vocale" : "Avvia guida vocale"}
                >
                  {autoNarrating ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                {/* Mode toggle */}
                <button
                  onClick={() => setMode(mode === "voice" ? "chat" : "voice")}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05] transition-all"
                  title={mode === "voice" ? "Passa a chat" : "Passa a voce"}
                >
                  {mode === "voice" ? <MessageSquare className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-[120px] max-h-[300px] sm:max-h-[400px] overscroll-contain">
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <img src={voiceAgentAvatar} alt="Assistente" className="w-8 h-8 rounded-full object-cover" />
                  </motion.div>
                  <p className="text-xs text-foreground/30 text-center max-w-[220px] leading-relaxed">
                    Ciao! Sono <strong className="text-primary/60">Arianna</strong>, la tua consulente Empire. Ti spiego come far crescere il tuo business con l'IA — parla o scrivi.
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-[1.6] ${
                      msg.role === "user"
                        ? "bg-primary/15 text-foreground rounded-br-md"
                        : "bg-foreground/[0.04] text-foreground/80 rounded-bl-md border border-foreground/[0.05]"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:m-0 [&_p]:text-xs [&_strong]:text-primary/80 [&_li]:text-xs">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div className="flex gap-1.5 px-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary/40"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </motion.div>
              )}

              {liveTranscript && (
                <motion.div className="text-[0.65rem] text-foreground/30 italic px-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  🎙️ {liveTranscript}...
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Wave Visualizer */}
            {(isSpeaking && !isPaused) || (voiceMode === "elevenlabs" && conversation.status === "connected") ? (
              <div className="flex items-center justify-center gap-[3px] py-2 px-4">
                {Array.from({ length: 20 }).map((_, i) => {
                  const peak = 8 + ((i * 7) % 14);
                  const speed = 0.6 + ((i % 4) * 0.12);
                  const isActive = voiceMode === "elevenlabs" ? conversation.isSpeaking : true;
                  return (
                    <motion.div
                      key={i}
                      className="w-[3px] rounded-full bg-primary/50"
                      animate={isActive ? { height: [4, peak, 4] } : { height: 4 }}
                      transition={{ duration: speed, repeat: isActive ? Infinity : 0, delay: i * 0.03, ease: "easeInOut" }}
                    />
                  );
                })}
              </div>
            ) : null}

            {/* Paused indicator */}
            {isPaused && (
              <div className="flex items-center justify-center gap-2 py-2 px-4">
                <Pause className="w-3.5 h-3.5 text-amber-400/70" />
                <span className="text-[0.6rem] text-foreground/30 tracking-wider uppercase">In pausa — scorri per continuare</span>
              </div>
            )}

            {/* Input area */}
            <div className="p-3 border-t border-foreground/[0.06]">
              {mode === "voice" ? (
                <div className="flex items-center justify-center gap-3">
                  {/* ElevenLabs ConvAI Mode */}
                  {voiceMode === "elevenlabs" && conversation.status === "connected" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-2.5 h-2.5 rounded-full bg-emerald-400"
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-[0.6rem] text-foreground/50 uppercase tracking-wider font-medium">
                          {conversation.isSpeaking ? "🔊 Arianna parla..." : "🎙️ Ti ascolta..."}
                        </span>
                      </div>
                      <button
                        onClick={stopElevenlabsConversation}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive text-[0.6rem] font-bold tracking-wider uppercase hover:bg-destructive/20 transition-all"
                      >
                        <PhoneOff className="w-3.5 h-3.5" /> Chiudi
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Pause / Resume */}
                      {isSpeaking && (
                        <button
                          onClick={togglePause}
                          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[0.6rem] font-bold tracking-wider uppercase transition-all ${
                            isPaused
                              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15"
                              : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/15"
                          }`}
                        >
                          {isPaused ? <><Play className="w-3.5 h-3.5" /> Riprendi</> : <><Pause className="w-3.5 h-3.5" /> Pausa</>}
                        </button>
                      )}

                      {/* Call button (always visible) */}
                      {!isSpeaking && (
                        <button
                          onClick={handleCallAction}
                          disabled={elevenlabsConnecting || isLoading}
                          className="w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg touch-manipulation bg-gradient-to-br from-primary to-accent text-white hover:shadow-primary/30 disabled:opacity-30"
                          title="Chiama Arianna"
                        >
                          {elevenlabsConnecting ? (
                            <motion.div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                          ) : (
                            <Phone className="w-5 h-5" />
                          )}
                        </button>
                      )}

                      {/* Legacy Mic button (secondary) */}
                      {!isSpeaking && (
                        <button
                          onClick={isListening ? stopAll : startListening}
                          disabled={isLoading || !SpeechRecognition}
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg touch-manipulation bg-secondary text-foreground/60 hover:bg-secondary/80 disabled:opacity-30"
                          title="Parla"
                        >
                          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                      )}

                      {/* Stop */}
                      {isSpeaking && (
                        <button
                          onClick={stopAll}
                          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-foreground/[0.05] text-foreground/50 text-[0.6rem] font-bold tracking-wider uppercase hover:bg-foreground/[0.08] transition-all"
                        >
                          <Square className="w-3.5 h-3.5" /> Stop
                        </button>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }} className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Scrivi un messaggio..."
                    disabled={isLoading}
                    className="flex-1 bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-foreground/25 outline-none focus:border-primary/30 transition-all disabled:opacity-30"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputText.trim()}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-30"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}

              {!SpeechRecognition && mode === "voice" && (
                <p className="text-[0.5rem] text-foreground/20 text-center mt-2">
                  Il riconoscimento vocale non è supportato. Usa la chat testuale.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmpireVoiceAgent;
