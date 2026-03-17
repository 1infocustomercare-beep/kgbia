import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-assistant`;

type Msg = { role: "user" | "assistant"; content: string };

interface EmpireAssistantProps {
  restaurantId?: string;
  companyId?: string;
}

const SECTOR_WELCOME: Record<string, string> = {
  ristorazione: "🍽️ Posso **eseguire comandi** per te! Prova:\n• _\"Togli la lasagna dal menu\"_\n• _\"Aumenta il prezzo della carbonara di 3€\"_\n• _\"Conferma la prenotazione di Marco\"_",
  food: "🍽️ Posso **eseguire comandi** per te! Prova:\n• _\"Togli la lasagna dal menu\"_\n• _\"Aumenta il prezzo della carbonara di 3€\"_\n• _\"Conferma la prenotazione di Marco\"_",
  ncc: "🚗 Posso **gestire la tua flotta** via chat! Prova:\n• _\"Disattiva la Mercedes Classe S\"_\n• _\"Conferma la prenotazione di Rossi\"_\n• _\"Metti autista Marco in pausa\"_",
  beauty: "💅 Posso **gestire il tuo salone** via chat! Prova:\n• _\"Conferma l'appuntamento di Laura\"_\n• _\"Cambia prezzo taglio donna a 35€\"_\n• _\"Aggiungi cliente Anna Verdi\"_",
  healthcare: "🏥 Posso **gestire il tuo studio** via chat! Prova:\n• _\"Conferma visita di Bianchi\"_\n• _\"Aggiungi nota clinica per Rossi\"_\n• _\"Aggiorna prezzo ecografia a 80€\"_",
  retail: "🛍️ Posso **gestire il tuo negozio** via chat! Prova:\n• _\"Aggiorna prezzo t-shirt a 29€\"_\n• _\"Disattiva prodotto scarpe rosse\"_\n• _\"Aggiungi prodotto borsa pelle 120€\"_",
  fitness: "🏋️ Posso **gestire la tua palestra** via chat! Prova:\n• _\"Disattiva corso yoga\"_\n• _\"Conferma appuntamento di Marco\"_\n• _\"Cambia prezzo personal training a 50€\"_",
  hospitality: "🏨 Posso **gestire il tuo hotel** via chat! Prova:\n• _\"Aggiorna prezzo suite a 250€\"_\n• _\"Metti camera deluxe in manutenzione\"_\n• _\"Conferma prenotazione di Rossi\"_",
  beach: "🏖️ Posso **gestire il tuo stabilimento** via chat! Prova:\n• _\"Aggiorna prezzo fila A a 30€\"_\n• _\"Disattiva ombrellone B5\"_\n• _\"Conferma prenotazione di Marco\"_",
  agriturismo: "🌿 Posso **gestire il tuo agriturismo** via chat! Prova:\n• _\"Aggiungi piatto bruschetta 8€\"_\n• _\"Conferma prenotazione Bianchi\"_\n• _\"Togli la ribollita dal menu\"_",
  default: "🎯 Posso anche **eseguire comandi** per te! Prova:\n• _\"Conferma appuntamento di Marco\"_\n• _\"Aggiungi un nuovo cliente\"_\n• _\"Aggiorna le informazioni dell'attività\"_",
};

const getSectorWelcome = (industry: string): string => {
  return SECTOR_WELCOME[industry] || SECTOR_WELCOME.default;
};

const EmpireAssistant = ({ restaurantId, companyId }: EmpireAssistantProps) => {
  const { industry } = useIndustry();
  const welcomeMessage = useMemo(() => {
    const sectorTips = getSectorWelcome(industry || "default");
    return `Ciao! 👋 Sono **Empire Assistant**, il tuo supporto tecnico 24/7.\n\n${sectorTips}\n\nCome posso aiutarti?`;
  }, [industry]);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: welcomeMessage }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      // Get current user for tenant_id
      const { data: { user } } = await supabase.auth.getUser();

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          restaurant_id: restaurantId || null,
          tenant_id: user?.id || null,
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Errore di connessione" }));
        upsertAssistant(err.error || "Si è verificato un errore. Riprova.");
        setIsLoading(false);
        return;
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
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { /* ignore */ }
        }
      }

      if (!assistantSoFar) {
        upsertAssistant("Non sono riuscito a generare una risposta. Riprova.");
      }
    } catch (e) {
      console.error("Empire Assistant error:", e);
      upsertAssistant("Errore di connessione. Verifica la tua rete e riprova.");
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simple markdown-like rendering (bold only for chat)
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* FAB — positioned above bottom nav (bottom-nav is ~60px + safe-bottom) */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center"
            style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 76px)", right: "16px" }}
            whileTap={{ scale: 0.9 }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window — full-width on mobile, positioned above bottom nav */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-x-3 z-50 flex flex-col rounded-2xl bg-card border border-border/50 shadow-2xl overflow-hidden"
            style={{
              bottom: "calc(env(safe-area-inset-bottom, 0px) + 72px)",
              maxHeight: "calc(100dvh - env(safe-area-inset-bottom, 0px) - 140px)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-card flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-display font-bold text-foreground truncate">Empire Assistant</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block flex-shrink-0" />
                    Online · 24/7
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center flex-shrink-0">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    msg.role === "assistant" ? "bg-primary/15" : "bg-secondary"
                  }`}>
                    {msg.role === "assistant" ? <Bot className="w-3 h-3 text-primary" /> : <User className="w-3 h-3 text-muted-foreground" />}
                  </div>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-[13px] leading-relaxed break-words ${
                    msg.role === "assistant"
                      ? "bg-secondary/50 text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="whitespace-pre-wrap">{renderContent(msg.content)}</div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-secondary/50">
                    <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/30 bg-card flex-shrink-0">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Chiedi qualcosa..."
                  disabled={isLoading}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-background border border-border/40 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 disabled:opacity-50 min-h-[44px] min-w-0"
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 flex-shrink-0"
                  whileTap={{ scale: 0.9 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmpireAssistant;
