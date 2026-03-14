// DemoSalesAgent — Interactive AI sales agent with live voice conversation
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, X, Sparkles, Pause, Play, MessageCircle, Send, Mic, MicOff, Square } from "lucide-react";
import ReactMarkdown from "react-markdown";

const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-tts`;
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-voice-agent`;

type Msg = { role: "user" | "assistant"; content: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// Sector-specific pitches
const SECTOR_PITCHES: Record<string, string[]> = {
  default: [
    "Ciao! Quello che stai guardando è solo un assaggio di quello che Empire può fare per il tuo business.",
    "Ogni elemento che vedi è completamente personalizzabile. Colori, logo, contenuti: tutto su misura per te.",
    "Non è un template generico: è un sistema operativo completo che automatizza ordini, marketing, fidelizzazione e molto altro.",
    "Puoi essere operativo in ventiquattro ore. Vuoi saperne di più? Parla con me oppure scrivimi!",
  ],
  food: [
    "Benvenuto! Stai esplorando la demo di un ristorante Empire — ma questa è solo la punta dell'iceberg.",
    "Menu digitale, ordini al tavolo, delivery integrato, Kitchen Display, recensioni, programma fedeltà — tutto in un'unica piattaforma.",
    "Con l'intelligenza artificiale, il tuo ristorante suggerisce i piatti giusti, gestisce le scorte e comunica automaticamente con i clienti.",
    "Questa è una bozza: la tua versione avrà il tuo brand, il tuo menu, i tuoi colori. Chiedimi qualsiasi cosa!",
  ],
  ncc: [
    "Benvenuto nel futuro del trasporto premium! Quello che vedi è una demo del sistema Empire per servizi NCC.",
    "Gestione flotta, prenotazioni in tempo reale, assegnazione autisti, tariffario dinamico, CRM clienti VIP — tutto integrato.",
    "Ogni aspetto è personalizzabile: i tuoi veicoli, le tue tratte, il tuo brand luxury.",
    "Questa è solo una bozza dimostrativa. Parla con me per saperne di più!",
  ],
  beauty: [
    "Ciao! Stai guardando una demo del sistema Empire per centri estetici e saloni di bellezza.",
    "Prenotazioni online, agenda condivisa, schede cliente, CRM, programma fedeltà, marketing automatizzato — tutto in un sistema elegante.",
    "Con l'IA, il sistema suggerisce trattamenti personalizzati e fidelizza i clienti con offerte mirate.",
    "Questo è solo un esempio: possiamo creare il sito perfetto per il tuo salone. Chiedimi come!",
  ],
  healthcare: [
    "Benvenuto! Questa è la demo Empire per studi medici e professionisti della salute.",
    "Prenotazioni pazienti, cartelle digitali, telemedicina, promemoria appuntamenti — un ecosistema completo.",
    "L'intelligenza artificiale gestisce le comunicazioni e ottimizza l'agenda dello studio.",
    "Possiamo personalizzare tutto per il tuo studio. Parlami dei tuoi bisogni!",
  ],
  fitness: [
    "Ciao! Ecco la demo Empire per palestre e centri fitness.",
    "Gestione abbonamenti, prenotazione corsi, check-in digitale, comunicazione automatica — tutto integrato.",
    "L'IA analizza i dati dei tuoi iscritti e ti aiuta a ridurre il churn.",
    "Questa è solo una bozza: chiedimi qualsiasi cosa!",
  ],
  hospitality: [
    "Benvenuto! Demo Empire per hotel e strutture ricettive.",
    "Gestione camere, prenotazioni dirette, check-in digitale, concierge IA — tutto in una piattaforma premium.",
    "Con Empire, riduci la dipendenza dalle OTA e aumenti le prenotazioni dirette.",
    "Ogni dettaglio sarà personalizzato. Parla con me!",
  ],
  hotel: [
    "Benvenuto! Demo Empire per hotel e strutture ricettive.",
    "Gestione camere, prenotazioni dirette, check-in digitale, concierge IA — tutto premium.",
    "Con Empire, riduci le OTA e aumenti le prenotazioni dirette.",
    "Contattaci o parlami per saperne di più!",
  ],
  beach: [
    "Ciao! Demo Empire per stabilimenti balneari.",
    "Mappa interattiva ombrelloni, prenotazioni online, abbonamenti, bar integrato — tutto digitale.",
    "L'IA ottimizza le prenotazioni e massimizza l'occupazione.",
    "La tua spiaggia merita il meglio. Chiedimi come!",
  ],
  retail: [
    "Benvenuto nella demo Empire per negozi e retail!",
    "Catalogo digitale, e-commerce, inventario, CRM, fedeltà, marketing — tutto unificato.",
    "L'IA suggerisce riordini e automatizza le comunicazioni.",
    "Possiamo creare il negozio digitale perfetto per te. Parlami!",
  ],
  plumber: [
    "Ciao! Demo Empire per artigiani e professionisti.",
    "Gestione interventi, preventivi, schede cliente, calendario, fatturazione — tutto dal telefono.",
    "L'IA organizza la tua agenda e invia promemoria ai clienti.",
    "Questa è una bozza: la tua app sarà su misura. Parla con me!",
  ],
};

const getSectorPitch = (industry: string): string[] =>
  SECTOR_PITCHES[industry] || SECTOR_PITCHES.default;

// TTS
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
    if (!resp.ok || abortRef.current) return false;
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

// Chat stream
async function streamChat({
  messages, onDelta, onDone, industry,
}: {
  messages: Msg[]; onDelta: (t: string) => void; onDone: () => void; industry: string;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, mode: "demo-sales", sectionId: industry }),
  });
  if (!resp.ok || !resp.body) throw new Error("Stream failed");
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(); return; }
      try {
        const c = JSON.parse(json).choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch { buf = line + "\n" + buf; break; }
    }
  }
  onDone();
}

interface DemoSalesAgentProps {
  industry: string;
  companyName: string;
  accentColor?: string;
}

const DemoSalesAgent: React.FC<DemoSalesAgentProps> = ({ industry, companyName, accentColor = "#C9A84C" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<InstanceType<NonNullable<typeof SpeechRecognition>> | null>(null);
  const messagesRef = useRef<Msg[]>([]);

  const pitch = getSectorPitch(industry);

  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // Show after 2s
  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(t);
  }, [dismissed]);

  // Auto-start narration after 4s
  useEffect(() => {
    if (dismissed || hasStarted) return;
    const t = setTimeout(() => {
      setHasStarted(true);
      startNarration();
    }, 4000);
    return () => clearTimeout(t);
  }, [dismissed, hasStarted]);

  // Cleanup
  useEffect(() => {
    return () => {
      abortRef.current = true;
      audioRef.current?.pause();
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const stopAll = useCallback(() => {
    abortRef.current = true;
    audioRef.current?.pause();
    recognitionRef.current?.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    setIsListening(false);
    setLiveTranscript("");
  }, []);

  const startNarration = useCallback(async () => {
    abortRef.current = false;
    setIsSpeaking(true);
    for (let i = 0; i < pitch.length; i++) {
      if (abortRef.current) break;
      setCurrentLine(i);
      const ok = await speakText(pitch[i], audioRef, abortRef);
      if (!ok || abortRef.current) break;
      await new Promise(r => setTimeout(r, 600));
    }
    setIsSpeaking(false);
  }, [pitch]);

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

  const handleDismiss = useCallback(() => {
    stopAll();
    setDismissed(true);
    setIsVisible(false);
    setIsOpen(false);
  }, [stopAll]);

  // Send message (from text or voice)
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    stopAll();
    abortRef.current = false;

    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMessages = [...messagesRef.current, userMsg];
    setMessages(allMessages);
    setInputText("");
    setIsLoading(true);

    // Switch to chat mode
    if (!chatMode) setChatMode(true);

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
        messages: allMessages,
        industry,
        onDelta: upsert,
        onDone: () => {
          setIsLoading(false);
          // Speak the response if voice is enabled
          if (voiceEnabled && full.length > 0 && full.length < 2000 && !abortRef.current) {
            setIsSpeaking(true);
            speakText(full, audioRef, abortRef).then(() => {
              if (!abortRef.current) setIsSpeaking(false);
            });
          }
        },
      });
    } catch {
      setIsLoading(false);
      setMessages(prev => [...prev, { role: "assistant", content: "Mi scuso, c'è stato un problema. Riprova tra un momento." }]);
    }
  }, [isLoading, industry, chatMode, voiceEnabled, stopAll]);

  // Voice recognition
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

    // Open panel if closed
    if (!isOpen) setIsOpen(true);
  }, [sendMessage, stopAll, isOpen]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setLiveTranscript("");
  }, []);

  if (dismissed || !isVisible) return null;

  const gold = accentColor;
  const hasMic = !!SpeechRecognition;

  return (
    <AnimatePresence>
      {/* Floating bubble */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-[9999] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${gold}, ${gold}cc)`,
            boxShadow: `0 0 30px ${gold}40`,
          }}
        >
          {isSpeaking ? (
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Volume2 className="w-6 h-6 text-black" />
            </motion.div>
          ) : isListening ? (
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
              <Mic className="w-6 h-6 text-black" />
            </motion.div>
          ) : (
            <Sparkles className="w-6 h-6 text-black" />
          )}
          {(isSpeaking || isListening) && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full"
              style={{ background: isListening ? "#ef4444" : gold }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
        </motion.button>
      )}

      {/* Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-20 right-4 z-[9999] w-[360px] max-h-[520px] rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "rgba(15,15,15,0.97)",
            border: `1px solid ${gold}30`,
            backdropFilter: "blur(20px)",
            boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${gold}15`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: `${gold}20` }}>
            <div className="flex items-center gap-2">
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 rounded-full blur-sm"
                  style={{ background: `${gold}30` }}
                  animate={isSpeaking && !isPaused ? { opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] } : { opacity: 0.2, scale: 1 }}
                  transition={{ duration: 1.4, repeat: isSpeaking && !isPaused ? Infinity : 0 }}
                />
                <div className="relative w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${gold}20` }}>
                  <Sparkles className="w-4 h-4" style={{ color: gold }} />
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                  style={{
                    borderColor: "rgba(15,15,15,0.97)",
                    background: isListening ? "#ef4444" : isSpeaking ? "#22c55e" : isLoading ? "#3b82f6" : `${gold}60`,
                  }}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Empire AI</p>
                <p className="text-[10px]" style={{ color: `${gold}80` }}>
                  {isListening ? "🎙️ Ti sto ascoltando..." : isSpeaking ? "🔊 Sto parlando..." : isLoading ? "✨ Sto pensando..." : "Sales Assistant"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isSpeaking && (
                <button onClick={togglePause} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                  {isPaused ? <Play className="w-3.5 h-3.5 text-white/60" /> : <Pause className="w-3.5 h-3.5 text-white/60" />}
                </button>
              )}
              {isSpeaking && (
                <button onClick={stopAll} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                  <Square className="w-3.5 h-3.5 text-white/60" />
                </button>
              )}
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition"
                title={voiceEnabled ? "Disattiva voce" : "Attiva voce"}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-white/60" /> : <VolumeX className="w-3.5 h-3.5 text-white/60" />}
              </button>
              <button onClick={() => { stopAll(); setChatMode(!chatMode); }} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                <MessageCircle className="w-3.5 h-3.5 text-white/60" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                <X className="w-3.5 h-3.5 text-white/60" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "360px" }}>
            {!chatMode ? (
              <>
                {/* Narration lines */}
                {pitch.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: i <= currentLine || !isSpeaking ? 1 : 0.3, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="flex gap-2"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ background: `${gold}15` }}>
                      <Sparkles className="w-3 h-3" style={{ color: i === currentLine && isSpeaking ? gold : `${gold}60` }} />
                    </div>
                    <p className={`text-xs leading-relaxed ${i === currentLine && isSpeaking ? "text-white" : "text-white/60"}`}>
                      {line}
                    </p>
                  </motion.div>
                ))}
                {/* Replay / interact buttons */}
                {!isSpeaking && hasStarted && (
                  <div className="flex flex-col gap-2 mt-2">
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => { abortRef.current = false; startNarration(); }}
                      className="text-[11px] font-semibold flex items-center gap-1 hover:opacity-80 transition"
                      style={{ color: gold }}
                    >
                      <Play className="w-3 h-3" /> Riascolta
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Chat messages */}
                {messages.length === 0 && (
                  <div className="text-center py-4 space-y-2">
                    <p className="text-xs text-white/30">
                      Chiedimi qualsiasi cosa su Empire e su "{companyName}"
                    </p>
                    {hasMic && (
                      <p className="text-[10px] text-white/20">
                        🎙️ Premi il microfono per parlare con me a voce
                      </p>
                    )}
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[85%] rounded-xl px-3 py-2 text-xs"
                      style={{
                        background: m.role === "user" ? `${gold}25` : "rgba(255,255,255,0.05)",
                        color: "white",
                      }}
                    >
                      <div className="prose prose-xs prose-invert"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                    </div>
                  </div>
                ))}
                {/* Live transcript while listening */}
                {isListening && liveTranscript && (
                  <div className="flex justify-end">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="max-w-[85%] rounded-xl px-3 py-2 text-xs italic"
                      style={{ background: `${gold}15`, color: `${gold}cc` }}
                    >
                      🎙️ {liveTranscript}...
                    </motion.div>
                  </div>
                )}
                {isLoading && (
                  <div className="flex gap-1 px-2">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: gold }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input area */}
          {chatMode && (
            <div className="p-3 border-t flex items-center gap-2" style={{ borderColor: `${gold}15` }}>
              {/* Microphone button */}
              {hasMic && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: isListening ? "#ef4444" : `${gold}20`,
                    boxShadow: isListening ? "0 0 20px rgba(239,68,68,0.4)" : "none",
                  }}
                >
                  {isListening ? (
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                      <MicOff className="w-4 h-4 text-white" />
                    </motion.div>
                  ) : (
                    <Mic className="w-4 h-4" style={{ color: gold }} />
                  )}
                </button>
              )}
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(inputText)}
                placeholder={isListening ? "Sto ascoltando..." : "Scrivi o parla..."}
                className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none border border-white/10 focus:border-white/20"
                disabled={isListening}
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={isLoading || !inputText.trim() || isListening}
                className="p-2 rounded-lg transition disabled:opacity-30"
                style={{ background: `${gold}20` }}
              >
                <Send className="w-3.5 h-3.5" style={{ color: gold }} />
              </button>
            </div>
          )}

          {/* Bottom CTA when not in chat mode */}
          {!chatMode && (
            <div className="p-3 border-t space-y-2" style={{ borderColor: `${gold}15` }}>
              <div className="flex gap-2">
                {hasMic && (
                  <button
                    onClick={() => {
                      stopAll();
                      setChatMode(true);
                      setTimeout(() => startListening(), 300);
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold transition hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ background: `${gold}20`, color: gold, border: `1px solid ${gold}30` }}
                  >
                    <Mic className="w-3.5 h-3.5" /> Parla con me
                  </button>
                )}
                <button
                  onClick={() => { stopAll(); setChatMode(true); }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${gold}, ${gold}cc)`, color: "#000" }}
                >
                  💬 Chiedimi di più
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoSalesAgent;
