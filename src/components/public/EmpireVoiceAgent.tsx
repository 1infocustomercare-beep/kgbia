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
  tech: "Sotto il cofano c'è un'architettura neurale di ultima generazione: sicurezza AES-256, intelligenza artificiale predittiva e un motore che lavora per te ventiquattr'ore su ventiquattro.",
  pain: "Lo sai quanto perdi ogni mese in commissioni e processi manuali? Empire elimina il problema alla radice — il tuo brand, le tue regole, il tuo profitto.",
  services: "Menu digitale, CRM, prenotazioni, fatturazione, marketing automation, agenti IA — tutto incluso, tutto integrato. Zero complessità.",
  process: "Tre step per partire: scegli il tuo settore, personalizza la tua app, e sei online. Il nostro team ti configura tutto in ventiquattr'ore.",
  app: "Guarda la tua app in azione — dashboard in tempo reale, gestione completa, analytics IA. Tutto dal tuo smartphone.",
  calculator: "Fai due conti: con Empire risparmi fino a quindicimila euro l'anno rispetto alle piattaforme tradizionali. Il ROI è immediato.",
  testimonials: "Non devi crederci sulla parola — ascolta chi ha già scelto Empire e ha trasformato il proprio business.",
  pricing: "Un solo pagamento, nessun canone mensile. Duemilanovecentonovantasette euro e il sistema è tuo per sempre. Solo il due percento sulle transazioni.",
  partner: "Vuoi guadagnare vendendo Empire? Novecentonovantasette euro per ogni vendita chiusa, bonus fino a millecinquecento al mese. Zero rischio, zero investimento.",
};

const SECTION_ORDER = ["hero", "industries", "tech", "pain", "services", "process", "app", "calculator", "testimonials", "pricing", "partner"];

// ── TTS helper ──
async function speakText(
  text: string,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  abortRef: React.MutableRefObject<boolean>,
): Promise<void> {
  if (abortRef.current) return;
  try {
    const resp = await fetch(TTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ text }),
    });
    if (!resp.ok) throw new Error("TTS failed");
    if (abortRef.current) return;
    const { audioContent } = await resp.json();
    if (abortRef.current) return;

    return new Promise((resolve) => {
      const audio = new Audio(`data:audio/mpeg;base64,${audioContent}`);
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  } catch {
    return;
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
  const [pulseIntensity, setPulseIntensity] = useState(0);
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

  // Sync refs
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);
  useEffect(() => { autoNarratingRef.current = autoNarrating; }, [autoNarrating]);

  // Auto-scroll chat
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Pulse animation
  useEffect(() => {
    if (!isSpeaking || isPaused) { setPulseIntensity(0); return; }
    const interval = setInterval(() => setPulseIntensity(Math.random() * 0.6 + 0.4), 150);
    return () => clearInterval(interval);
  }, [isSpeaking, isPaused]);

  // ── Intersection Observer — track visible section ──
  useEffect(() => {
    const sectionIds = ["hero", "industries", "services", "process", "app", "calculator", "testimonials", "pricing", "partner"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setCurrentSection(id);
            }
          });
        },
        { threshold: [0.3, 0.6] }
      );
      obs.observe(el);
      observers.push(obs);
    });

    // Also detect "tech" and "pain" sections by checking nearby elements
    const allSections = document.querySelectorAll("section[id]");
    allSections.forEach((sec) => {
      const id = sec.getAttribute("id");
      if (id && !sectionIds.includes(id)) {
        const obs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.intersectionRatio > 0.3 && id) {
                setCurrentSection(id);
              }
            });
          },
          { threshold: [0.3] }
        );
        obs.observe(sec);
        observers.push(obs);
      }
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ── Stop everything ──
  const stopAll = useCallback(() => {
    abortRef.current = true;
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
      audioRef.current.play();
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  // ── Narrate a single section (local script, no API call) ──
  const narrateSection = useCallback(async (sectionId: string) => {
    const script = SECTION_SCRIPTS[sectionId];
    if (!script || !voiceEnabledRef.current) return;
    if (narratedRef.current.has(sectionId)) return;

    narratedRef.current.add(sectionId);
    setNarratedSections(new Set(narratedRef.current));

    // Add as assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: script }]);

    // Speak it
    setIsSpeaking(true);
    abortRef.current = false;
    await speakText(script, audioRef, abortRef);
    if (!abortRef.current) {
      setIsSpeaking(false);
    }
  }, []);

  // ── Auto-narrate on section change ──
  useEffect(() => {
    if (!autoNarratingRef.current) return;
    if (!currentSection) return;
    if (narratedRef.current.has(currentSection)) return;
    if (isSpeaking && !isPaused) return; // wait until current narration finishes

    // Small delay so user settles on the section
    const timer = setTimeout(() => {
      if (autoNarratingRef.current && !narratedRef.current.has(currentSection)) {
        narrateSection(currentSection);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [currentSection, isSpeaking, isPaused, narrateSection]);

  // ── Auto-start: show button only (chat stays CLOSED) ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Auto-narrate hero WITHOUT opening the chat panel
      setAutoNarrating(true);
      narrateSection("hero");
    }, 2500);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      {/* Floating Avatar Button */}
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.button
            className="fixed bottom-20 sm:bottom-6 right-4 z-[100] group"
            onClick={toggleOpen}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg border border-white/10">
              <Sparkles className="w-6 h-6 text-white" />
              {/* Small speaking indicator dot */}
              {isSpeaking && !isPaused && (
                <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-background animate-pulse" />
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
                    animate={{
                      opacity: isSpeaking && !isPaused ? pulseIntensity : 0.2,
                      scale: isSpeaking && !isPaused ? 1 + pulseIntensity * 0.3 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                  />
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                      isPaused ? "bg-amber-400" :
                      isSpeaking ? "bg-green-400 animate-pulse" :
                      isListening ? "bg-amber-400 animate-pulse" :
                      isLoading ? "bg-blue-400 animate-pulse" :
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
                    if (autoNarrating) { stopAll(); }
                    else { setAutoNarrating(true); narrateSection(currentSection); }
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
                  onClick={() => { stopAll(); setIsOpen(false); }}
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
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full bg-primary/50"
                    animate={{ height: [4, 4 + Math.random() * 20, 4] }}
                    transition={{ duration: 0.3 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.03 }}
                  />
                ))}
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
