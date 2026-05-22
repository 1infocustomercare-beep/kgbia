import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface SectorAIChatBubbleProps {
  sector: string;
  sectorLabel: string;
  sectorEmoji: string;
  accentColor: string;
  companyName?: string;
}

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sector-ai-agent`;

async function streamChat({
  messages,
  sector,
  companyName,
  onDelta,
  onDone,
  onError,
  signal,
}: {
  messages: Msg[];
  sector: string;
  companyName?: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
  signal?: AbortSignal;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages, sector, companyName }),
      signal,
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      onError(errData.error || `Errore ${resp.status}`);
      return;
    }

    if (!resp.body) { onError("Nessuna risposta"); return; }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let done = false;

    while (!done) {
      const { done: d, value } = await reader.read();
      if (d) break;
      buf += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buf.indexOf("\n")) !== -1) {
        let line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || !line.trim()) continue;
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { done = true; break; }
        try {
          const p = JSON.parse(json);
          const c = p.choices?.[0]?.delta?.content;
          if (c) onDelta(c);
        } catch {
          buf = line + "\n" + buf;
          break;
        }
      }
    }

    // flush
    if (buf.trim()) {
      for (let raw of buf.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (!raw.startsWith("data: ")) continue;
        const j = raw.slice(6).trim();
        if (j === "[DONE]") continue;
        try {
          const p = JSON.parse(j);
          const c = p.choices?.[0]?.delta?.content;
          if (c) onDelta(c);
        } catch {}
      }
    }
    onDone();
  } catch (e: any) {
    if (e.name === "AbortError") return;
    onError(e.message || "Errore di connessione");
  }
}

const GREETING_MESSAGES: Record<string, string> = {
  food: "Ciao! 👋 Stai valutando una soluzione digitale per il tuo ristorante? Sono qui per mostrarti come possiamo trasformare la tua attività.",
  ncc: "Ciao! 👋 Cerchi una piattaforma per digitalizzare il tuo servizio NCC? Ti mostro come possiamo ottimizzare prenotazioni e gestione flotta.",
  beauty: "Ciao! 👋 Vuoi portare il tuo salone nel futuro? Ti spiego come Empire può automatizzare appuntamenti, clienti e marketing.",
  healthcare: "Ciao! 👋 Stai cercando una soluzione digitale per il tuo studio? Posso mostrarti come semplificare agenda, cartelle e fatturazione.",
  retail: "Ciao! 👋 Vuoi far crescere il tuo negozio con il digitale? Ti mostro e-commerce, CRM e analytics su misura.",
  fitness: "Ciao! 👋 Cerchi un sistema per gestire la tua palestra? Ti spiego come automatizzare iscrizioni, corsi e pagamenti.",
  hospitality: "Ciao! 👋 Vuoi aumentare le prenotazioni dirette del tuo hotel? Ti mostro come eliminare le commissioni OTA.",
  default: "Ciao! 👋 Sono l'assistente AI di Empire. Come posso aiutarti a digitalizzare la tua attività?",
};

export default function SectorAIChatBubble({ sector, sectorLabel, sectorEmoji, accentColor, companyName }: SectorAIChatBubbleProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const greeting = GREETING_MESSAGES[sector] || GREETING_MESSAGES.default;

  useEffect(() => {
    const t = setTimeout(() => setShowPulse(false), 8000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;
    setInput("");

    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    let assistantSoFar = "";
    const controller = new AbortController();
    abortRef.current = controller;

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamChat({
      messages: [...messages, userMsg],
      sector,
      companyName,
      onDelta: upsert,
      onDone: () => setIsStreaming(false),
      onError: (err) => {
        setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${err}` }]);
        setIsStreaming(false);
      },
      signal: controller.signal,
    });
  }, [isStreaming, messages, sector, companyName]);

  const send = useCallback(() => sendMessage(input), [input, sendMessage]);

  const quickQuestions = [
    "Cosa potete fare per il mio business?",
    "Quanto costa la piattaforma?",
    "Potete personalizzare tutto?",
    "Come funziona la demo?",
  ];

  return (
    <>
      {/* Bubble */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-110"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
          >
            <MessageCircle className="w-6 h-6" />
            {showPulse && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-black animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 right-4 z-[95] w-[360px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-32px)] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{ border: `1px solid ${accentColor}30`, background: "#0a0a0a" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10" style={{ background: `linear-gradient(135deg, ${accentColor}20, transparent)` }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: `${accentColor}30` }}>
                {sectorEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Empire AI Advisor</p>
                <p className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online • {sectorLabel}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
              {/* Greeting */}
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs" style={{ background: `${accentColor}30` }}>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
                </div>
                <div className="bg-white/5 rounded-2xl rounded-tl-md px-3 py-2.5 max-w-[85%]">
                  <p className="text-xs text-white/80 leading-relaxed">{greeting}</p>
                </div>
              </div>

              {/* Quick questions if no messages */}
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-[10px] px-2.5 py-1.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Conversation */}
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs" style={{ background: `${accentColor}30` }}>
                      <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-3 py-2.5 max-w-[85%] text-xs leading-relaxed ${
                      m.role === "user"
                        ? "rounded-tr-md text-white"
                        : "rounded-tl-md bg-white/5 text-white/80"
                    }`}
                    style={m.role === "user" ? { background: `${accentColor}90` } : {}}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1 [&>li]:my-0.5 text-xs">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{m.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Streaming indicator */}
              {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: `${accentColor}30` }}>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: accentColor }} />
                  </div>
                  <div className="bg-white/5 rounded-2xl rounded-tl-md px-3 py-2.5">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/10 bg-black/50">
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Chiedi qualcosa..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/70 focus:outline-none focus:border-white/20 transition"
                  disabled={isStreaming}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-30 transition-all hover:scale-105"
                  style={{ background: input.trim() && !isStreaming ? accentColor : `${accentColor}40` }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[8px] text-white/65 text-center mt-1.5">
                Powered by Empire AI • Risposte personalizzate per {sectorLabel}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
