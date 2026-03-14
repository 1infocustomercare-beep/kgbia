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
    "Fermati un secondo. Quello che stai guardando NON è un sito — è un sistema operativo completo per il tuo business. Con oltre duecento funzionalità integrate.",
    "Ti faccio un esempio concreto: un nostro cliente nel settore artigiani dormiva mentre l'IA gestiva un'emergenza notturna — diagnosi automatica, preventivo generato, appuntamento fissato. Si è svegliato con duecentoventi euro guadagnati senza fare nulla.",
    "Noi non vendiamo template. Il nostro team costruisce TUTTO su misura per te in ventiquattro ore: il tuo brand, i tuoi colori, le tue funzionalità. Tu non devi fare assolutamente nulla.",
    "Ogni settimana rilasciamo aggiornamenti gratuiti. Il tuo sistema diventa più intelligente ogni giorno. Zero costi mensili, per sempre. Parlami del tuo business e ti mostro esattamente come ti trasformiamo.",
  ],
  food: [
    "Quello che vedi è solo il cinque per cento di quello che Empire fa per un ristorante. Menu digitale, ordini al tavolo, Kitchen Display, Review Shield, fidelizzazione, marketing automatico — tutto in un unico sistema.",
    "Ti racconto cosa è successo a un nostro cliente: un habitué non tornava da venticinque giorni. L'IA se n'è accorta, gli ha mandato un messaggio WhatsApp con uno sconto sulla sua carbonara preferita. È tornato il giorno dopo con tutta la famiglia — quattro coperti invece di uno. Il ristoratore non ha fatto nulla.",
    "Un altro esempio: sabato sera, sala piena. Un cliente scrive una recensione da due stelle. Con i sistemi normali finisce su Google e ti distrugge la media. Con Empire? Review Shield la intercetta, la trasforma in feedback privato, e tu risolvi il problema PRIMA che diventi pubblico.",
    "Noi costruiamo tutto su misura in ventiquattro ore: il tuo menu, il tuo brand, oltre duecento funzionalità. Zero costi mensili per sempre. Chiedimi qualsiasi cosa!",
  ],
  ncc: [
    "Stai guardando il futuro del trasporto premium. Gestione flotta, prenotazioni real-time, assegnazione autisti automatica, CRM clienti VIP, tariffario dinamico, scadenzario documenti — tutto in un'unica piattaforma luxury.",
    "Esempio reale: il concierge del Grand Hotel chiama per un transfer urgente all'aeroporto. Tu sei in viaggio. Con Empire il concierge prenota dal sito, il sistema assegna l'autista più vicino, il cliente riceve conferma con nome e foto del veicolo. Tu ricevi solo la notifica: nuova corsa confermata, centoventi euro.",
    "Altro caso: un turista americano prenota un transfer Napoli-Positano. L'IA suggerisce automaticamente un tour in barca a Capri. Il cliente aggiunge trecentocinquanta euro al carrello. Cross-selling automatico, zero sforzo tuo.",
    "E lo scadenzario intelligente? L'IA ti avvisa quindici giorni prima che l'assicurazione della Mercedes scade. Un click e blocchi l'assegnazione. Nessun rischio, nessuna multa. Parliamo del tuo business!",
  ],
  beauty: [
    "Prenotazioni ventiquattro ore su ventiquattro, agenda multi-operatore, schede cliente, anti no-show, fidelizzazione, marketing IA — tutto in un sistema elegante come il tuo salone.",
    "Ti faccio un esempio: lunedì mattina, tre clienti non si presentano. Tre buchi in agenda, tre ore perse. Con Empire il sistema manda reminder automatici WhatsApp ventiquattro e due ore prima. Se il cliente non conferma, l'IA propone lo slot a chi è in lista d'attesa. Buchi in agenda? Zero.",
    "Un'altra storia: domani è il compleanno di Giulia, una tua cliente top. Senza Empire non lo sai nemmeno. Con Empire? Ieri l'IA le ha mandato un messaggio di auguri con un trattamento viso in omaggio. Giulia ha prenotato entusiasta e ha portato un'amica. Due clienti, zero sforzo.",
    "Sara non viene da quarantacinque giorni? L'IA lo nota e le manda un'offerta personalizzata. Sara torna. Senza di noi, l'avresti persa per sempre. Vuoi sapere come funziona per il tuo salone?",
  ],
  healthcare: [
    "Agenda pazienti, cartelle digitali, telemedicina, promemoria appuntamenti, fatturazione, comunicazioni automatiche — un ecosistema completo per il tuo studio medico.",
    "Esempio concreto: il signor Rossi dimentica sempre gli appuntamenti. Con Empire riceve un SMS quarantotto ore prima e un WhatsApp due ore prima. Se non conferma, lo slot viene liberato per un altro paziente. Zero buchi, zero stress per te.",
    "Altro caso: hai visitato quaranta pazienti questa settimana. Chi deve fare il follow-up? L'IA lo sa — manda automaticamente le istruzioni post-visita, ricorda i controlli successivi, tutto nella cartella digitale.",
    "Facciamo tutto noi su misura per il tuo studio in ventiquattro ore. Parlami delle tue esigenze!",
  ],
  fitness: [
    "Gestione abbonamenti, prenotazione corsi, check-in digitale, schede allenamento, pagamenti ricorrenti, app membri, analisi retention — tutto integrato per la tua palestra.",
    "Esempio: Luca ha l'abbonamento ma non viene da tre settimane. L'IA lo nota e gli manda un messaggio: il corso HIIT del martedì ha due posti, prenota ora! Luca torna. Senza Empire avrebbe disdetto il mese dopo.",
    "Il corso di yoga delle diciotto è sempre pieno? Senza Empire venti persone si presentano per quindici posti — caos totale. Con Empire prenotazione online con posti in tempo reale, lista d'attesa automatica. Tutti felici.",
    "Il tuo centro sportivo merita il meglio. Chiedimi come ti trasformiamo!",
  ],
  hospitality: [
    "Gestione camere, prenotazioni dirette, check-in digitale, concierge IA ventiquattro ore su ventiquattro, upselling automatico, housekeeping — tutto premium per il tuo hotel.",
    "Esempio che fa riflettere: un ospite trova il tuo hotel su Google. Normalmente va su Booking e tu paghi il diciotto per cento di commissione. Con Empire prenota direttamente dal tuo sito con solo il due per cento. Su cento notti a centocinquanta euro, risparmi ventiquattromila euro l'anno.",
    "Sono le ventitré. Un ospite guarda il menu del minibar sul tablet in camera. L'IA suggerisce la colazione in camera con upgrade a champagne. L'ospite clicca sì. Hai guadagnato mentre dormivi.",
    "Parliamo di come Empire trasforma il tuo hotel!",
  ],
  hotel: [
    "Il futuro dell'ospitalità è qui. Prenotazioni dirette, concierge IA, upselling notturno, housekeeping digitale — risparmi migliaia di euro in commissioni OTA.",
    "Su cento notti a centocinquanta euro, con Empire risparmi ventiquattromila euro l'anno rispetto a Booking. Solo il due per cento di commissione invece del diciotto.",
    "L'IA lavora per te anche alle tre di notte: suggerisce upgrade, risponde agli ospiti, gestisce le richieste. Tu dormi tranquillo.",
    "Costruiamo tutto su misura in ventiquattro ore. Parliamone!",
  ],
  beach: [
    "Mappa interattiva ombrelloni, prenotazioni online, abbonamenti stagionali, gestione bar, push notification, fidelizzazione — il tuo lido diventa digitale e premium.",
    "È lunedì, occupazione al trenta per cento. L'IA lo prevede dal giorno prima e lancia una push notification: domani ombrellone a metà prezzo! Risultato: occupazione al settanta per cento. Senza Empire avresti avuto un lunedì morto.",
    "Il cliente è sdraiato sotto l'ombrellone, ha sete, non vuole alzarsi. Apre l'app, ordina un Aperol Spritz, il barista lo porta. Cliente felice, tu incassi di più — tutto dal telefono.",
    "La tua spiaggia merita il sistema migliore. Chiedimi come!",
  ],
  retail: [
    "Catalogo digitale, e-commerce, inventario con barcode, CRM, fedeltà, marketing automatico, fatturazione, analytics — tutto unificato per il tuo negozio.",
    "Stai per rimanere senza le sneakers taglia quarantadue, il prodotto più venduto. Non te ne accorgi. Ma l'IA sì: alert scorte basse, suggerisce riordino di venti pezzi. Un click e l'ordine parte. Senza Empire? Cliente deluso, vendita persa.",
    "Maria ha speso cinquecento euro quest'anno. L'IA le manda: hai raggiunto cinquecento punti, ecco un buono da venticinque euro! Maria torna entro la settimana. Fidelizzazione automatica, zero sforzo.",
    "Vuoi sapere come trasformiamo il tuo negozio? Parliamone!",
  ],
  plumber: [
    "Gestione interventi, preventivi digitali con firma, schede cliente, calendario condiviso, foto prima e dopo, fatturazione, GPS dispatch, app cliente col TUO brand — tutto dal telefono.",
    "Esempio potentissimo: sono le tre di notte, il signor Bianchi ha un tubo rotto. Apre la TUA app, fa una foto, scrive nella chat. L'IA Concierge risponde immediatamente: gli dice di chiudere la valvola, genera un preventivo automatico, fissa l'appuntamento per le otto. Tu ti svegli e trovi tutto pronto — sai cosa portare, quanto costa, dove andare. Hai guadagnato duecentoventi euro dormendo.",
    "L'IA organizza anche la tua giornata: cinque interventi ottimizzati per percorso, risparmi due ore al giorno. Quarantaquattro ore al mese. Quasi sei giornate lavorative regalate dall'intelligenza artificiale.",
    "Tu dormi, l'IA lavora. Questo è Empire. Chiedimi qualsiasi cosa!",
  ],
};

const getSectorPitch = (industry: string): string[] =>
  SECTOR_PITCHES[industry] || SECTOR_PITCHES.default;

// Web Speech API fallback TTS
function speakWithBrowserTTS(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(false); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "it-IT";
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    // Try to find an Italian voice
    const voices = window.speechSynthesis.getVoices();
    const itVoice = voices.find(v => v.lang.startsWith("it")) || voices[0];
    if (itVoice) utterance.voice = itVoice;
    utterance.onend = () => resolve(true);
    utterance.onerror = () => resolve(false);
    window.speechSynthesis.speak(utterance);
  });
}

// TTS with ElevenLabs + browser fallback
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
    if (!resp.ok || abortRef.current) {
      // Fallback to browser TTS
      if (!abortRef.current) return speakWithBrowserTTS(text);
      return false;
    }
    const data = await resp.json();
    const audioContent = data?.audioContent;
    if (!audioContent || abortRef.current) {
      if (!abortRef.current) return speakWithBrowserTTS(text);
      return false;
    }

    return await new Promise<boolean>((resolve) => {
      const audio = new Audio(`data:audio/mpeg;base64,${audioContent}`);
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = audio;
      audio.onended = () => resolve(true);
      audio.onerror = () => {
        // Fallback on audio error
        speakWithBrowserTTS(text).then(resolve);
      };
      audio.play().catch(() => {
        speakWithBrowserTTS(text).then(resolve);
      });
    });
  } catch {
    // Fallback to browser TTS
    if (!abortRef.current) return speakWithBrowserTTS(text);
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

  // Load voices early
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      abortRef.current = true;
      audioRef.current?.pause();
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
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
