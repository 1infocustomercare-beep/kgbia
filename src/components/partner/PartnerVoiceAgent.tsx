// PartnerVoiceAgent — Full-featured AI assistant for Partner & Team Leader dashboards
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, X, MessageSquare, Send, Play, Square, Pause, Sparkles, Bot } from "lucide-react";
import voiceAgentAvatar from "@/assets/voice-agent-avatar.png";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-voice-agent`;

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
  const priorities = [
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /alice/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /federica/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /google/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it") && /elsa|isabella/i.test(v.name),
    (v: SpeechSynthesisVoice) => v.lang.startsWith("it"),
  ];
  for (const test of priorities) {
    const match = voices.find(test);
    if (match) { cachedItalianVoice = match; return match; }
  }
  return null;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => { cachedItalianVoice = null; getBestItalianFemaleVoice(); };
}

function speakWithBrowserTTS(text: string, abortRef: React.MutableRefObject<boolean>): Promise<boolean> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis || abortRef.current) { resolve(false); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestItalianFemaleVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = "it-IT";
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);
    if (abortRef.current) { resolve(false); return; }
    window.speechSynthesis.speak(utterance);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// ── Stream chat helper ──
async function streamChat({ messages, onDelta, onDone }: {
  messages: Msg[];
  onDelta: (t: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, mode: "partner-assistant" }),
  });

  if (!resp.ok) {
    let errorMessage = `Errore (${resp.status})`;
    try { const err = await resp.json(); errorMessage = err?.error || errorMessage; } catch {}
    throw new Error(errorMessage);
  }
  if (!resp.body) throw new Error("Nessun flusso ricevuto");

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
      if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { streamDone = true; break; }
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
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "" || !raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {}
    }
  }
  onDone();
}

const PartnerVoiceAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"voice" | "chat">("chat");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Ciao! 👋 Sono **ATLAS PRO**, il tuo assistente IA dedicato a **massima potenza**. Conosco ogni dettaglio di Empire: vendite, commissioni, demo, obiezioni, dashboard, settori, tecniche avanzate, navigazione — **tutto**. Chiedimi qualsiasi cosa, ti guido passo-passo! 🚀" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inputText, setInputText] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");

  const recognitionRef = useRef<InstanceType<NonNullable<typeof SpeechRecognition>> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);
  const messagesRef = useRef<Msg[]>([]);
  const voiceEnabledRef = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (!SpeechRecognition) setMode("chat"); }, []);
  useEffect(() => { if (isOpen && mode === "chat") setTimeout(() => inputRef.current?.focus(), 150); }, [isOpen, mode]);

  const stopAll = useCallback(() => {
    abortRef.current = true;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    setIsSpeaking(false);
    setIsPaused(false);
    setIsListening(false);
    setLiveTranscript("");
  }, []);

  const togglePause = useCallback(() => {
    if (window.speechSynthesis) {
      if (isPaused) { window.speechSynthesis.resume(); setIsPaused(false); }
      else { window.speechSynthesis.pause(); setIsPaused(true); }
    }
  }, [isPaused]);

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
        onDone: async () => {
          setIsLoading(false);
          if (voiceEnabledRef.current && full.length > 0 && full.length < 2000 && !abortRef.current) {
            setIsSpeaking(true);
            const normalized = normalizeTextForSpeech(full);
            await speakWithBrowserTTS(normalized, abortRef);
            if (!abortRef.current) setIsSpeaking(false);
          }
        },
      });
    } catch (error) {
      setIsLoading(false);
      const msg = error instanceof Error ? error.message : "Errore, riprova.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    }
  }, [isLoading, stopAll]);

  const startListening = useCallback(async () => {
    if (!SpeechRecognition) { setMode("chat"); return; }
    stopAll();
    abortRef.current = false;

    try { await navigator.mediaDevices.getUserMedia({ audio: true }); } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Abilita l'accesso al microfono per usare la voce." }]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "it-IT";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setLiveTranscript(interim);
      if (final) { setLiveTranscript(""); setIsListening(false); sendMessage(final); }
    };
    recognition.onerror = () => { setIsListening(false); setLiveTranscript(""); };
    recognition.onend = () => { setIsListening(false); setLiveTranscript(""); };

    try { recognition.start(); setIsListening(true); } catch { setIsListening(false); }
  }, [sendMessage, stopAll]);

  // Quick action buttons for partners — comprehensive coverage
  const quickActions = [
    { label: "📊 Commissioni", prompt: "Spiegami nel dettaglio come funzionano le commissioni, i bonus Pro ed Elite, e i guadagni del Team Leader" },
    { label: "🎯 Script vendita", prompt: "Dammi uno script di vendita completo, parola per parola, per chiamare un potenziale cliente e chiudere la vendita" },
    { label: "❌ Obiezioni", prompt: "Elenca tutte le obiezioni comuni dei clienti e dammi le risposte killer per ognuna" },
    { label: "👑 Team Leader", prompt: "Come divento Team Leader? Quali sono i requisiti, i vantaggi e la roadmap completa?" },
    { label: "💡 Guida demo", prompt: "Guidami passo-passo su come fare una demo efficace al cliente usando la mia Dashboard" },
    { label: "🏪 Settori", prompt: "Quali settori sono più facili da vendere, perché, e cosa dico specificamente per ognuno?" },
    { label: "🧭 Dashboard", prompt: "Spiegami tutte le sezioni della mia Dashboard Partner e come usarle al meglio" },
    { label: "🔥 Motivami", prompt: "Ho bisogno di motivazione! Ricordami quanto posso guadagnare e dammi una strategia per questa settimana" },
  ];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-3 z-[201] touch-manipulation"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileTap={{ scale: 0.94 }}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-1.5 rounded-full bg-primary/25 blur-md"
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-xl border-2 border-primary/30 bg-background">
                <img src={voiceAgentAvatar} alt="ATLAS" className="w-full h-full object-cover" />
                {isSpeaking && !isPaused && (
                  <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-background" />
                )}
              </div>
              <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Agent Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-0 right-0 z-[200] w-full sm:w-[400px] sm:bottom-4 sm:right-4 max-h-[80dvh] sm:max-h-[650px] flex flex-col rounded-t-2xl sm:rounded-2xl border border-primary/10 bg-background/95 backdrop-blur-2xl shadow-[0_0_60px_hsla(var(--primary)/0.15)]"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <motion.div
                    className="absolute -inset-1 rounded-full bg-primary/20 blur-sm"
                    animate={isSpeaking && !isPaused ? { opacity: [0.25, 0.5, 0.25], scale: [1, 1.1, 1] } : { opacity: 0.15, scale: 1 }}
                    transition={{ duration: 1.4, repeat: isSpeaking ? Infinity : 0 }}
                  />
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30">
                    <img src={voiceAgentAvatar} alt="ATLAS" className="w-full h-full object-cover" />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                    isPaused ? "bg-amber-400" : isSpeaking ? "bg-green-400" : isListening ? "bg-amber-400" : isLoading ? "bg-blue-400" : "bg-primary/60"
                  }`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    ATLAS <span className="text-[0.55rem] font-normal text-primary/60 bg-primary/10 px-1.5 py-0.5 rounded-full">PRO</span>
                  </h3>
                  <p className="text-[0.55rem] text-muted-foreground tracking-wider uppercase">
                    {isPaused ? "⏸ In pausa" : isSpeaking ? "🔊 Sta parlando..." : isListening ? "🎙️ Ti ascolta..." : isLoading ? "💭 Sta pensando..." : "Assistente Partner IA"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {isSpeaking && (
                  <button onClick={togglePause}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05]">
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                )}
                {isSpeaking && (
                  <button onClick={stopAll}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-red-400 hover:bg-red-400/10">
                    <Square className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${voiceEnabled ? "text-primary bg-primary/10" : "text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05]"}`}
                  title={voiceEnabled ? "Disattiva voce" : "Attiva voce"}>
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                {SpeechRecognition && (
                  <button onClick={() => setMode(mode === "voice" ? "chat" : "voice")}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05]"
                    title={mode === "voice" ? "Passa a chat" : "Passa a voce"}>
                    {mode === "voice" ? <MessageSquare className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
                <button onClick={() => { stopAll(); setIsOpen(false); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05]">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && !isLoading && (
              <div className="px-3 pt-3 flex flex-wrap gap-1.5">
                {quickActions.map((action) => (
                  <motion.button key={action.label}
                    onClick={() => sendMessage(action.prompt)}
                    className="px-2.5 py-1.5 rounded-full text-[0.6rem] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/10"
                    whileTap={{ scale: 0.95 }}>
                    {action.label}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[120px] max-h-[350px] sm:max-h-[420px] overscroll-contain">
              {messages.map((msg, i) => (
                <motion.div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-[1.6] ${
                    msg.role === "user"
                      ? "bg-primary/15 text-foreground rounded-br-md"
                      : "bg-foreground/[0.04] text-foreground/80 rounded-bl-md border border-foreground/[0.05]"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:m-0 [&_p]:text-xs [&_strong]:text-primary/80 [&_li]:text-xs">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <motion.div className="flex gap-1.5 px-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-primary/40"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
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

            {/* Voice Wave */}
            {isSpeaking && !isPaused && (
              <div className="flex items-center justify-center gap-[3px] py-2 px-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div key={i} className="w-[3px] rounded-full bg-primary/50"
                    animate={{ height: [4, 8 + ((i * 7) % 14), 4] }}
                    transition={{ duration: 0.6 + ((i % 4) * 0.12), repeat: Infinity, delay: i * 0.03 }} />
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-border/30">
              {mode === "voice" ? (
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    onClick={isListening ? () => { recognitionRef.current?.stop(); setIsListening(false); } : startListening}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      isListening
                        ? "bg-red-500/20 text-red-400 border-2 border-red-500/40"
                        : "bg-primary/15 text-primary border-2 border-primary/30 hover:bg-primary/25"
                    }`}
                    whileTap={{ scale: 0.9 }}
                    disabled={isLoading}>
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </motion.button>
                  <p className="text-[0.6rem] text-muted-foreground max-w-[140px]">
                    {isListening ? "Sto ascoltando..." : "Tocca per parlare"}
                  </p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }}
                  className="flex items-center gap-2">
                  <input ref={inputRef} value={inputText} onChange={(e) => setInputText(e.target.value)}
                    placeholder="Chiedimi qualsiasi cosa..."
                    disabled={isLoading}
                    className="flex-1 bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary/30 min-h-[44px]" />
                  <motion.button type="submit" disabled={!inputText.trim() || isLoading}
                    className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center disabled:opacity-30 hover:bg-primary/25 transition-all"
                    whileTap={{ scale: 0.9 }}>
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PartnerVoiceAgent;
