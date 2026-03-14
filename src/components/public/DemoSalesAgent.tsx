// DemoSalesAgent — Auto-narrating AI sales pitch for every demo page
import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, X, Sparkles, Pause, Play, MessageCircle, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-tts`;
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-voice-agent`;

type Msg = { role: "user" | "assistant"; content: string };

// Sector-specific pitches — persuasive, natural Italian
const SECTOR_PITCHES: Record<string, string[]> = {
  default: [
    "Ciao! Quello che stai guardando è solo un assaggio di quello che Empire può fare per il tuo business.",
    "Ogni elemento che vedi — dal design al menu, dalle prenotazioni al CRM — è completamente personalizzabile. Colori, logo, contenuti: tutto su misura per te.",
    "Non è un template generico: è un sistema operativo completo che automatizza ordini, marketing, fidelizzazione e molto altro. Il tuo business, potenziato dall'intelligenza artificiale.",
    "La parte migliore? Puoi essere operativo in ventiquattro ore. Nessun costo nascosto, nessuna commissione sugli ordini. Vuoi saperne di più? Contattaci e ti costruiamo la tua versione personalizzata.",
  ],
  food: [
    "Benvenuto! Stai esplorando la demo di un ristorante Empire — ma questa è solo la punta dell'iceberg.",
    "Menu digitale con QR code, ordini al tavolo, take-away e delivery integrati, Kitchen Display per la cucina, gestione delle recensioni, programma fedeltà — tutto in un'unica piattaforma.",
    "E con l'intelligenza artificiale, il tuo ristorante suggerisce i piatti giusti, gestisce le scorte e comunica automaticamente con i clienti. Zero stress, più profitto.",
    "Questa è una bozza: la tua versione avrà il tuo brand, il tuo menu, i tuoi colori. Possiamo costruirla insieme in un giorno. Contattaci!",
  ],
  ncc: [
    "Benvenuto nel futuro del trasporto premium! Quello che vedi è una demo del sistema Empire per servizi NCC.",
    "Gestione flotta, prenotazioni in tempo reale, assegnazione autisti, tariffario dinamico, CRM clienti VIP, tour in barca e molto altro — tutto integrato.",
    "Ogni aspetto è personalizzabile: i tuoi veicoli, le tue tratte, il tuo brand luxury. L'intelligenza artificiale ottimizza le operazioni e massimizza i ricavi.",
    "Questa è solo una bozza dimostrativa. La tua versione sarà unica, costruita su misura per la tua azienda. Contattaci per partire!",
  ],
  beauty: [
    "Ciao! Stai guardando una demo del sistema Empire per centri estetici e saloni di bellezza.",
    "Prenotazioni online, agenda condivisa, schede cliente, CRM, programma fedeltà, marketing automatizzato, recensioni gestite — tutto in un sistema elegante e intuitivo.",
    "Con l'IA, il sistema suggerisce trattamenti personalizzati, invia promemoria automatici e fidelizza i clienti con offerte mirate.",
    "Questo è solo un esempio: possiamo creare il sito e l'app perfetti per il tuo salone, con il tuo stile e i tuoi servizi. Parliamone!",
  ],
  healthcare: [
    "Benvenuto! Questa è la demo Empire per studi medici e professionisti della salute.",
    "Prenotazioni pazienti, cartelle digitali, telemedicina, promemoria appuntamenti, fatturazione elettronica — un ecosistema completo per la sanità moderna.",
    "L'intelligenza artificiale gestisce le comunicazioni con i pazienti e ottimizza l'agenda dello studio, liberando il tuo tempo per ciò che conta davvero.",
    "Possiamo personalizzare tutto per il tuo studio. Il design, i servizi, il flusso delle prenotazioni — tutto su misura. Contattaci!",
  ],
  fitness: [
    "Ciao! Ecco la demo Empire per palestre e centri fitness.",
    "Gestione abbonamenti, prenotazione corsi, check-in digitale, schede allenamento, comunicazione automatica con i membri — tutto integrato.",
    "L'IA analizza i dati dei tuoi iscritti e ti aiuta a ridurre il churn e aumentare le iscrizioni con campagne mirate.",
    "Questa è solo una bozza: la tua palestra avrà un'app personalizzata con il tuo brand. Parliamone!",
  ],
  hospitality: [
    "Benvenuto! Questa è una demo del sistema Empire per hotel e strutture ricettive.",
    "Gestione camere, prenotazioni dirette, check-in digitale, concierge IA, upselling automatico, recensioni gestite — tutto in una piattaforma premium.",
    "Con Empire, riduci la dipendenza dalle OTA e aumenti le prenotazioni dirette fino al quaranta percento.",
    "Ogni dettaglio sarà personalizzato per la tua struttura. Dal design alle funzionalità: costruiamo il tuo hotel digitale insieme!",
  ],
  hotel: [
    "Benvenuto! Questa è una demo del sistema Empire per hotel e strutture ricettive.",
    "Gestione camere, prenotazioni dirette, check-in digitale, concierge IA, upselling automatico, recensioni gestite — tutto in una piattaforma premium.",
    "Con Empire, riduci la dipendenza dalle OTA e aumenti le prenotazioni dirette fino al quaranta percento.",
    "Ogni dettaglio sarà personalizzato per la tua struttura. Contattaci!",
  ],
  beach: [
    "Ciao! Stai esplorando la demo Empire per stabilimenti balneari.",
    "Mappa interattiva degli ombrelloni, prenotazioni online, gestione abbonamenti stagionali, bar e ristorante integrati, programma fedeltà — tutto digitale.",
    "L'IA ottimizza le prenotazioni e massimizza l'occupazione, anche nei giorni più tranquilli.",
    "La tua spiaggia merita un sistema all'avanguardia. Questa è una bozza — la tua sarà su misura!",
  ],
  retail: [
    "Benvenuto nella demo Empire per negozi e retail!",
    "Catalogo digitale, e-commerce integrato, gestione inventario, CRM clienti, programma fedeltà, marketing automatizzato — tutto in un'unica piattaforma.",
    "L'intelligenza artificiale ti suggerisce riordini, analizza le tendenze e automatizza le comunicazioni con i clienti.",
    "Possiamo creare il negozio digitale perfetto per te, con il tuo brand e i tuoi prodotti. Contattaci!",
  ],
  plumber: [
    "Ciao! Ecco la demo Empire per artigiani e professionisti.",
    "Gestione interventi, preventivi digitali, schede cliente, calendario condiviso, foto-documentazione lavori, fatturazione — tutto dal telefono.",
    "L'IA organizza la tua agenda, invia promemoria ai clienti e ti aiuta a non perdere mai un'opportunità di lavoro.",
    "Questa è solo una bozza dimostrativa. La tua app sarà costruita su misura per la tua attività. Parliamone!",
  ],
};

const getSectorPitch = (industry: string): string[] => {
  return SECTOR_PITCHES[industry] || SECTOR_PITCHES.default;
};

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
  messages, onDelta, onDone, industry
}: {
  messages: Msg[]; onDelta: (t: string) => void; onDone: () => void; industry: string;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({
      messages,
      mode: "demo-sales",
      sectionId: industry,
    }),
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const pitch = getSectorPitch(industry);

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
    };
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const startNarration = useCallback(async () => {
    abortRef.current = false;
    setIsSpeaking(true);
    for (let i = 0; i < pitch.length; i++) {
      if (abortRef.current) break;
      setCurrentLine(i);
      const ok = await speakText(pitch[i], audioRef, abortRef);
      if (!ok || abortRef.current) break;
      // Small pause between lines
      await new Promise(r => setTimeout(r, 600));
    }
    setIsSpeaking(false);
  }, [pitch]);

  const stopNarration = useCallback(() => {
    abortRef.current = true;
    audioRef.current?.pause();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

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
    stopNarration();
    setDismissed(true);
    setIsVisible(false);
    setIsOpen(false);
  }, [stopNarration]);

  const sendChat = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: inputText.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInputText("");
    setIsLoading(true);

    let assistantSoFar = "";
    try {
      await streamChat({
        messages: allMessages,
        industry,
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
            }
            return [...prev, { role: "assistant", content: assistantSoFar }];
          });
        },
        onDone: () => setIsLoading(false),
      });
    } catch {
      setIsLoading(false);
    }
  }, [inputText, messages, isLoading, industry]);

  if (dismissed || !isVisible) return null;

  const gold = accentColor;

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
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Volume2 className="w-6 h-6 text-black" />
            </motion.div>
          ) : (
            <Sparkles className="w-6 h-6 text-black" />
          )}
          {/* Audio wave indicator */}
          {isSpeaking && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full"
              style={{ background: gold }}
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
          className="fixed bottom-20 right-4 z-[9999] w-[340px] max-h-[480px] rounded-2xl overflow-hidden flex flex-col"
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
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${gold}20` }}>
                <Sparkles className="w-4 h-4" style={{ color: gold }} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Empire AI</p>
                <p className="text-[10px] text-white/40">Sales Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isSpeaking && (
                <button onClick={togglePause} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                  {isPaused ? <Play className="w-3.5 h-3.5 text-white/60" /> : <Pause className="w-3.5 h-3.5 text-white/60" />}
                </button>
              )}
              <button onClick={() => { stopNarration(); setChatMode(!chatMode); }} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                <MessageCircle className="w-3.5 h-3.5 text-white/60" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                <VolumeX className="w-3.5 h-3.5 text-white/60" />
              </button>
              <button onClick={handleDismiss} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                <X className="w-3.5 h-3.5 text-white/60" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "340px" }}>
            {!chatMode ? (
              <>
                {/* Narration lines */}
                {pitch.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: i <= currentLine || !isSpeaking ? 1 : 0.3,
                      x: 0,
                    }}
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
                {/* Replay button */}
                {!isSpeaking && hasStarted && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => { abortRef.current = false; startNarration(); }}
                    className="mt-2 text-[11px] font-semibold flex items-center gap-1 hover:opacity-80 transition"
                    style={{ color: gold }}
                  >
                    <Play className="w-3 h-3" /> Riascolta
                  </motion.button>
                )}
              </>
            ) : (
              <>
                {/* Chat messages */}
                {messages.length === 0 && (
                  <p className="text-xs text-white/30 text-center py-4">
                    Chiedimi qualsiasi cosa su Empire e su cosa possiamo fare per "{companyName}"
                  </p>
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

          {/* Chat input */}
          {chatMode && (
            <div className="p-3 border-t flex gap-2" style={{ borderColor: `${gold}15` }}>
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Scrivi un messaggio..."
                className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none border border-white/10 focus:border-white/20"
              />
              <button
                onClick={sendChat}
                disabled={isLoading || !inputText.trim()}
                className="p-2 rounded-lg transition disabled:opacity-30"
                style={{ background: `${gold}20` }}
              >
                <Send className="w-3.5 h-3.5" style={{ color: gold }} />
              </button>
            </div>
          )}

          {/* Bottom CTA */}
          {!chatMode && (
            <div className="p-3 border-t" style={{ borderColor: `${gold}15` }}>
              <button
                onClick={() => { stopNarration(); setChatMode(true); }}
                className="w-full py-2.5 rounded-xl text-xs font-bold transition hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${gold}, ${gold}cc)`, color: "#000" }}
              >
                💬 Chiedimi di più su Empire
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoSalesAgent;
