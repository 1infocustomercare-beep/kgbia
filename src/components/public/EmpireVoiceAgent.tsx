// ATLAS Voice Agent v3 — Scroll-tracking auto-narration
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, X, MessageSquare, Sparkles, Send, Play, Square, Pause } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-voice-agent`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-tts`;

// ── Section narration scripts (short, persuasive, natural) ──
const SECTION_SCRIPTS: Record<string, string> = {
  hero: "Benvenuto in Empire — il sistema operativo che trasforma qualsiasi attività in un business digitale di nuova generazione. Pronto a scoprire come?",
  industries: "Venticinque settori, un'unica piattaforma. Dal ristorante al medico, dall'NCC al beauty — ogni modulo è costruito su misura per il tuo business.",
  services: "Menu digitale, CRM, prenotazioni, fatturazione, marketing automation, agenti IA — tutto incluso, tutto integrato. Zero complessità.",
  process: "Tre step per partire: scegli il tuo settore, personalizza la tua app, e sei online. Il nostro team ti configura tutto in ventiquattr'ore.",
  app: "Guarda la tua app in azione — dashboard in tempo reale, gestione completa, analytics IA. Tutto dal tuo smartphone.",
  calculator: "Fai due conti: con Empire risparmi fino a quindicimila euro l'anno rispetto alle piattaforme tradizionali. Il ROI è immediato.",
  testimonials: "Non devi crederci sulla parola — ascolta chi ha già scelto Empire e ha trasformato il proprio business.",
  pricing: "Un investimento chiaro, scalabile e sostenibile: Empire cresce con te e aumenta il valore della tua azienda mese dopo mese.",
  partner: "Vuoi guadagnare vendendo Empire? Novecentonovantasette euro per ogni vendita chiusa, bonus fino a millecinquecento al mese. Zero rischio, zero investimento.",
  contact: "Se vuoi, ora possiamo passare all'azione: ti mostro la demo del tuo settore e costruiamo subito la tua versione personalizzata.",
};

const SECTION_ORDER = ["hero", "industries", "services", "process", "app", "calculator", "testimonials", "pricing", "partner", "contact"];

// ── TTS helper ──
async function speakText(
  text: string,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  abortRef: React.MutableRefObject<boolean>,
): Promise<boolean> {
  if (abortRef.current) return false;

  try {
    const resp = await fetch(TTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!resp.ok) return false;
    if (abortRef.current) return false;

    const { audioContent } = await resp.json();
    if (!audioContent || abortRef.current) return false;

    return await new Promise<boolean>((resolve) => {
      const audio = new Audio(`data:audio/mpeg;base64,${audioContent}`);
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = audio;

      audio.onended = () => resolve(true);
      audio.onerror = () => resolve(false);
      audio.play().catch(() => resolve(false));
    });
  } catch {
    return false;
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
  if (!resp.ok || !resp.body) throw new Error(`Stream failed: ${resp.status}`);

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const c = JSON.parse(json).choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch { buf = line + "\n" + buf; break; }
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

  // Sync refs
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);
  useEffect(() => { autoNarratingRef.current = autoNarrating; }, [autoNarrating]);

  // Auto-scroll chat
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ── Intersection Observer — stable tracking of known landing sections ──
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
      {
        threshold: [0.25, 0.4, 0.6],
        rootMargin: "-10% 0px -45% 0px",
      }
    );

    observedIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ── Follow click navigation (menu links / CTA with #section) ──
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

  // ── Queue processor for robust section narration (no freezes) ──
  const processNarrationQueue = useCallback(async () => {
    if (queueProcessingRef.current) return;
    queueProcessingRef.current = true;

    while (sectionQueueRef.current.length > 0) {
      if (abortRef.current || !autoNarratingRef.current) break;

      const sectionId = sectionQueueRef.current.shift();
      if (!sectionId) continue;

      const script = SECTION_SCRIPTS[sectionId];
      if (!script || !voiceEnabledRef.current) continue;
      if (narratedRef.current.has(sectionId)) continue;

      setMessages((prev) => [...prev, { role: "assistant", content: script }]);
      setIsSpeaking(true);
      setIsPaused(false);
      abortRef.current = false;

      const played = await speakText(script, audioRef, abortRef);

      if (played && !abortRef.current) {
        narratedRef.current.add(sectionId);
        setNarratedSections(new Set(narratedRef.current));
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

  // ── Stop everything ──
  const stopAll = useCallback(() => {
    abortRef.current = true;
    sectionQueueRef.current = [];
    queueProcessingRef.current = false;

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
    if (!audioRef.current) return;

    if (isPaused) {
      audioRef.current.play().catch(() => undefined);
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  // ── Auto-narrate on section change ──
  useEffect(() => {
    if (!autoNarrating) return;
    if (!currentSection || !SECTION_SCRIPTS[currentSection]) return;

    enqueueSectionNarration(currentSection);
  }, [autoNarrating, currentSection, enqueueSectionNarration]);

  // ── Auto-start: show button only (chat stays CLOSED) ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setAutoNarrating(true);
      enqueueSectionNarration("hero", true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [enqueueSectionNarration]);

  // ── Send user message (chat / voice) ──
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
        onDelta: upsert,
        onDone: () => {
          setIsLoading(false);
          if (voiceEnabledRef.current && full.length > 0 && full.length < 2000 && !abortRef.current) {
            setIsSpeaking(true);
            speakText(full, audioRef, abortRef).then(() => {
              if (!abortRef.current) setIsSpeaking(false);
            });
          }
        },
      });
    } catch {
      setIsLoading(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "Mi scuso, c'è stato un problema. Riprova tra un momento." }]);
    }
  }, [isLoading, stopAll]);

  // ── Voice recognition ──
  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    stopAll();
    abortRef.current = false;
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
    recognition.start();
    setIsListening(true);
  }, [sendMessage, stopAll]);

  // ── Toggle panel (does NOT stop audio — voice keeps playing) ──
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // ── Render ──
  return (
    <>
      {/* Floating Avatar Button — always visible, toggles chat open/close */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            className="fixed bottom-20 sm:bottom-6 right-4 z-[201] group"
            onClick={toggleOpen}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg border border-white/10">
              {isOpen ? <X className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
              {isSpeaking && !isPaused && !isOpen && (
                <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-background" />
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Agent Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-0 sm:bottom-4 right-0 sm:right-4 z-[200] w-full sm:w-[380px] max-h-[85vh] sm:max-h-[600px] flex flex-col rounded-t-2xl sm:rounded-2xl border border-foreground/[0.08] bg-background/95 backdrop-blur-2xl shadow-[0_0_60px_hsla(265,85%,65%,0.15)]"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
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
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
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
                  <h3 className="text-sm font-bold text-foreground">ATLAS</h3>
                  <p className="text-[0.55rem] text-foreground/40 tracking-wider uppercase">
                    {isPaused ? "⏸ In pausa" :
                     isSpeaking ? "🔊 Sta parlando..." :
                     isListening ? "🎙️ Ti ascolta..." :
                     isLoading ? "💭 Sta pensando..." :
                     autoNarrating ? `📍 ${currentSection}` :
                     "Empire AI Agent"}
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[400px]">
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-primary" />
                  </motion.div>
                  <p className="text-xs text-foreground/30 text-center max-w-[200px]">
                    Ciao! Sono ATLAS. Ti guido attraverso Empire mentre scorri la pagina.
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
            {isSpeaking && !isPaused && (
              <div className="flex items-center justify-center gap-[3px] py-2 px-4">
                {Array.from({ length: 20 }).map((_, i) => {
                  const peak = 8 + ((i * 7) % 14);
                  const speed = 0.6 + ((i % 4) * 0.12);
                  return (
                    <motion.div
                      key={i}
                      className="w-[3px] rounded-full bg-primary/50"
                      animate={{ height: [4, peak, 4] }}
                      transition={{ duration: speed, repeat: Infinity, delay: i * 0.03, ease: "easeInOut" }}
                    />
                  );
                })}
              </div>
            )}

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
                  {/* Pause / Resume */}
                  {isSpeaking && (
                    <button
                      onClick={togglePause}
                      className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[0.6rem] font-bold tracking-wider uppercase transition-all ${
                        isPaused
                          ? "bg-green-500/10 text-green-400 hover:bg-green-500/15"
                          : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/15"
                      }`}
                    >
                      {isPaused ? <><Play className="w-3.5 h-3.5" /> Riprendi</> : <><Pause className="w-3.5 h-3.5" /> Pausa</>}
                    </button>
                  )}

                  {/* Mic button */}
                  {!isSpeaking && (
                    <button
                      onClick={isListening ? stopAll : startListening}
                      disabled={isLoading || !SpeechRecognition}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                        isListening
                          ? "bg-red-500/20 border-2 border-red-400 text-red-400"
                          : "bg-gradient-to-br from-primary to-accent text-white hover:shadow-primary/30"
                      } disabled:opacity-30`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
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
