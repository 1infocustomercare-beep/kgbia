import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, X, MessageSquare, Sparkles, Send, Play, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-voice-agent`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-tts`;

// ── Stream chat helper ──
async function streamChat({
  messages, mode, onDelta, onDone,
}: {
  messages: Msg[]; mode?: string;
  onDelta: (t: string) => void; onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, mode }),
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

// ── TTS helper ──
async function speak(text: string, audioRef: React.MutableRefObject<HTMLAudioElement | null>, onEnd: () => void) {
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
    const { audioContent } = await resp.json();
    const url = `data:audio/mpeg;base64,${audioContent}`;
    if (audioRef.current) { audioRef.current.pause(); }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = onEnd;
    audio.onerror = onEnd;
    await audio.play();
  } catch {
    onEnd();
  }
}

// ── SpeechRecognition ──
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const EmpireVoiceAgent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"voice" | "chat">("voice");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inputText, setInputText] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Pulse animation while speaking
  useEffect(() => {
    if (!isSpeaking) { setPulseIntensity(0); return; }
    const interval = setInterval(() => {
      setPulseIntensity(Math.random() * 0.6 + 0.4);
    }, 150);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Stop everything
  const stopAll = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; }
    setIsSpeaking(false);
    setIsListening(false);
    setLiveTranscript("");
  }, []);

  // Send message
  const sendMessage = useCallback(async (text: string, msgMode?: string) => {
    if (!text.trim() || isLoading) return;
    stopAll();

    const userMsg: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setInputText("");

    let full = "";
    const upsert = (chunk: string) => {
      full += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: full } : m);
        }
        return [...prev, { role: "assistant", content: full }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        mode: msgMode,
        onDelta: upsert,
        onDone: () => {
          setIsLoading(false);
          // Speak the response if voice enabled
          if (voiceEnabled && full.length > 0 && full.length < 1500) {
            setIsSpeaking(true);
            speak(full, audioRef, () => setIsSpeaking(false));
          }
        },
      });
    } catch {
      setIsLoading(false);
    }
  }, [messages, isLoading, voiceEnabled, stopAll]);

  // Start narration
  const startNarration = useCallback(() => {
    sendMessage("Presentami Empire in modo coinvolgente", "narrate");
  }, [sendMessage]);

  // Start listening via SpeechRecognition
  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    stopAll();
    const recognition = new SpeechRecognition();
    recognition.lang = "it-IT";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setLiveTranscript(interim);
      if (final) {
        setLiveTranscript("");
        setIsListening(false);
        sendMessage(final);
      }
    };
    recognition.onerror = () => { setIsListening(false); setLiveTranscript(""); };
    recognition.onend = () => { setIsListening(false); setLiveTranscript(""); };
    recognition.start();
    setIsListening(true);
  }, [sendMessage, stopAll]);

  // Toggle open
  const toggleOpen = useCallback(() => {
    if (isOpen) {
      stopAll();
      setIsOpen(false);
    } else {
      setIsOpen(true);
      if (messages.length === 0) {
        // Auto-start narration
        setTimeout(() => startNarration(), 500);
      }
    }
  }, [isOpen, messages.length, startNarration, stopAll]);

  // Toggle visibility
  if (!isVisible) {
    return (
      <motion.button
        className="fixed bottom-20 sm:bottom-6 right-4 z-[100] w-14 h-14 rounded-full flex items-center justify-center border border-primary/20 bg-background/80 backdrop-blur-xl shadow-[0_0_30px_hsla(265,85%,65%,0.15)]"
        onClick={() => setIsVisible(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 3, duration: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-6 h-6 text-primary" />
      </motion.button>
    );
  }

  return (
    <>
      {/* Floating Avatar Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="fixed bottom-20 sm:bottom-6 right-4 z-[100] group"
            onClick={toggleOpen}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Outer glow rings */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, hsla(265,85%,65%,0.2), transparent 70%)" }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_30px_hsla(265,85%,65%,0.3)] border border-white/10">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {/* Label */}
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full bg-background/90 backdrop-blur border border-primary/20 text-[0.55rem] font-heading font-bold text-primary tracking-wider uppercase"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              ATLAS AI
            </motion.div>
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
                {/* Avatar with pulse */}
                <div className="relative">
                  <motion.div
                    className="absolute -inset-1 rounded-full bg-primary/20 blur-sm"
                    animate={{ opacity: isSpeaking ? pulseIntensity : 0.2, scale: isSpeaking ? 1 + pulseIntensity * 0.3 : 1 }}
                    transition={{ duration: 0.15 }}
                  />
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  {/* Status dot */}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${isSpeaking ? "bg-green-400" : isListening ? "bg-amber-400" : "bg-primary/60"}`} />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground">ATLAS</h3>
                  <p className="text-[0.55rem] text-foreground/40 font-heading tracking-wider uppercase">
                    {isSpeaking ? "Sta parlando..." : isListening ? "Ti ascolta..." : isLoading ? "Sta pensando..." : "Empire AI Agent"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Voice toggle */}
                <button
                  onClick={() => { setVoiceEnabled(!voiceEnabled); if (voiceEnabled) stopAll(); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05] transition-all"
                  title={voiceEnabled ? "Disattiva voce" : "Attiva voce"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                {/* Mode toggle */}
                <button
                  onClick={() => setMode(mode === "voice" ? "chat" : "voice")}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05] transition-all"
                  title={mode === "voice" ? "Passa a chat" : "Passa a voce"}
                >
                  {mode === "voice" ? <MessageSquare className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                {/* Hide */}
                <button
                  onClick={() => { setIsVisible(false); stopAll(); setIsOpen(false); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05] transition-all"
                  title="Nascondi agente"
                >
                  <X className="w-4 h-4" />
                </button>
                {/* Close panel */}
                <button
                  onClick={toggleOpen}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05] transition-all"
                  title="Chiudi"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[400px]">
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-primary" />
                  </motion.div>
                  <p className="text-xs text-foreground/30 text-center max-w-[200px] font-heading">
                    Ciao! Sono ATLAS, il tuo consulente Empire. Chiedimi tutto.
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
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-2 h-2 rounded-full bg-primary/40"
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

            {/* Voice Wave Visualizer (when speaking) */}
            {isSpeaking && (
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

            {/* Input area */}
            <div className="p-3 border-t border-foreground/[0.06]">
              {mode === "voice" ? (
                <div className="flex items-center justify-center gap-4">
                  {/* Narrate button */}
                  <button
                    onClick={startNarration}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-[0.65rem] font-heading font-bold tracking-wider uppercase hover:bg-primary/15 transition-all disabled:opacity-30"
                  >
                    <Play className="w-3.5 h-3.5" /> Racconta
                  </button>

                  {/* Mic button */}
                  <button
                    onClick={isListening ? stopAll : startListening}
                    disabled={isLoading || !SpeechRecognition}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                      isListening
                        ? "bg-red-500/20 border-2 border-red-400 text-red-400"
                        : "bg-gradient-to-br from-primary to-accent text-white hover:shadow-primary/30"
                    } disabled:opacity-30`}
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>

                  {/* Stop speaking */}
                  {isSpeaking && (
                    <button
                      onClick={stopAll}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/[0.05] text-foreground/50 text-[0.65rem] font-heading font-bold tracking-wider uppercase hover:bg-foreground/[0.08] transition-all"
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
                  Il riconoscimento vocale non è supportato da questo browser. Usa la chat testuale.
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
