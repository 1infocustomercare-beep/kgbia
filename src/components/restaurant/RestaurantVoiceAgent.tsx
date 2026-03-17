import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, X, MessageSquare, Send, Bot, ShoppingBag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import type { MenuItem } from "@/types/restaurant";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/restaurant-voice-agent`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-tts`;

// ── Stream chat helper ──
async function streamChat({
  messages, restaurantName, menuItems, onDelta, onDone,
}: {
  messages: Msg[]; restaurantName: string; menuItems: any[];
  onDelta: (t: string) => void; onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, restaurantName, menuItems }),
  });
  if (!resp.ok || !resp.body) {
    if (resp.status === 429) { toast({ title: "Troppi messaggi", description: "Riprova tra qualche secondo.", variant: "destructive" }); }
    if (resp.status === 402) { toast({ title: "Crediti esauriti", description: "Contatta il ristorante.", variant: "destructive" }); }
    throw new Error(`Stream failed: ${resp.status}`);
  }

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
    const cleanText = text.replace(/```order[\s\S]*?```/g, "").trim();
    if (!cleanText) { onEnd(); return; }
    const resp = await fetch(TTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ text: cleanText }),
    });
    const data = await resp.json();
    if (data.fallback || !data.audioContent) {
      // Fallback to Web Speech API
      const synth = window.speechSynthesis;
      const utter = new SpeechSynthesisUtterance(cleanText);
      utter.lang = "it-IT";
      utter.rate = 0.95;
      utter.onend = onEnd;
      utter.onerror = () => onEnd();
      synth.speak(utter);
      return;
    }
    const url = `data:audio/mpeg;base64,${data.audioContent}`;
    if (audioRef.current) { audioRef.current.pause(); }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = onEnd;
    audio.onerror = onEnd;
    await audio.play();
  } catch { onEnd(); }
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface Props {
  restaurantName: string;
  menuItems: MenuItem[];
  primaryColor?: string;
}

const RestaurantVoiceAgent: React.FC<Props> = ({ restaurantName, menuItems, primaryColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"voice" | "chat">("chat");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inputText, setInputText] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  // Stop homepage voice agent on mount to prevent overlap
  useEffect(() => {
    if ((window as any).__empireVoiceAgentStopAll) {
      (window as any).__empireVoiceAgentStopAll();
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Parse order from assistant message
  const parseOrder = useCallback((content: string) => {
    const match = content.match(/```order\s*\n?([\s\S]*?)\n?```/);
    if (!match) return null;
    try {
      const items = JSON.parse(match[1]);
      if (Array.isArray(items) && items.length > 0) return items;
    } catch { /* ignore */ }
    return null;
  }, []);

  // Add order items to cart
  const addOrderToCart = useCallback((orderItems: { name: string; qty: number; price: number }[]) => {
    let addedCount = 0;
    for (const orderItem of orderItems) {
      const menuMatch = menuItems.find(
        m => m.name.toLowerCase() === orderItem.name.toLowerCase()
      );
      if (menuMatch) {
        for (let i = 0; i < orderItem.qty; i++) {
          addItem(menuMatch);
          addedCount++;
        }
      }
    }
    if (addedCount > 0) {
      toast({
        title: "🛒 Ordine aggiunto al carrello!",
        description: `${addedCount} articol${addedCount > 1 ? "i" : "o"} aggiunt${addedCount > 1 ? "i" : "o"}.`,
      });
    }
  }, [menuItems, addItem]);

  // Check last assistant message for order
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant" && !isLoading) {
      const order = parseOrder(lastMsg.content);
      if (order) addOrderToCart(order);
    }
  }, [messages, isLoading, parseOrder, addOrderToCart]);

  const simplifiedMenu = menuItems.map(m => ({
    name: m.name, price: m.price, category: m.category, description: m.description || "",
  }));

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputText("");
    setIsLoading(true);

    let assistantSoFar = "";
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

    try {
      await streamChat({
        messages: updated,
        restaurantName,
        menuItems: simplifiedMenu,
        onDelta: upsert,
        onDone: () => {
          setIsLoading(false);
          if (voiceEnabled && assistantSoFar) {
            setIsSpeaking(true);
            speak(assistantSoFar, audioRef, () => setIsSpeaking(false));
          }
        },
      });
    } catch {
      setIsLoading(false);
    }
  }, [messages, isLoading, restaurantName, simplifiedMenu, voiceEnabled]);

  // Voice recognition
  const toggleListening = useCallback(() => {
    if (!SpeechRecognition) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "it-IT";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setLiveTranscript(interim);
      if (final) {
        setLiveTranscript("");
        sendMessage(final);
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  }, [isListening, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const accentColor = primaryColor || "hsl(var(--primary))";

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white"
            style={{ background: accentColor, boxShadow: `0 8px 30px ${accentColor}44` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bot className="w-6 h-6" />
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: accentColor }}
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[380px] z-50 rounded-2xl overflow-hidden border border-border/30 shadow-2xl"
            style={{ background: "hsl(var(--background))", maxHeight: "75vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/20"
              style={{ background: accentColor }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{restaurantName}</p>
                  <p className="text-white/70 text-[10px]">Assistente AI · Ordina qui</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                  {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => { setIsOpen(false); if (audioRef.current) audioRef.current.pause(); }}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ maxHeight: "45vh", minHeight: "200px" }}>
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-sm font-medium text-foreground/60">Ciao! 👋</p>
                  <p className="text-xs text-muted-foreground mt-1">Chiedimi il menu o dimmi cosa vorresti ordinare</p>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                    {["Cosa mi consigli?", "Vorrei ordinare", "Menu del giorno"].map(q => (
                      <button key={q} onClick={() => sendMessage(q)}
                        className="px-3 py-1.5 rounded-full text-[11px] font-medium border border-border/30 text-foreground/50 hover:text-foreground hover:border-border/60 transition-colors">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.6] ${
                    msg.role === "user"
                      ? "text-white rounded-br-sm"
                      : "bg-muted/50 text-foreground rounded-bl-sm"
                  }`}
                    style={msg.role === "user" ? { background: accentColor } : undefined}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:m-0 [&_ul]:my-1 [&_li]:my-0">
                        <ReactMarkdown>{msg.content.replace(/```order[\s\S]*?```/g, "").trim()}</ReactMarkdown>
                        {/* Show order confirmation badge */}
                        {msg.content.includes("```order") && !isLoading && (
                          <div className="mt-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-medium">
                            <ShoppingBag className="w-3.5 h-3.5" /> Ordine aggiunto al carrello
                          </div>
                        )}
                      </div>
                    ) : msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-foreground/30"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {liveTranscript && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-[13px] text-white/60 italic"
                    style={{ background: `${accentColor}88` }}>
                    {liveTranscript}...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-border/20 p-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                {SpeechRecognition && (
                  <button type="button" onClick={toggleListening}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isListening ? "text-white" : "bg-muted/50 text-foreground/40 hover:text-foreground/60"
                    }`}
                    style={isListening ? { background: accentColor } : undefined}
                  >
                    {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                )}
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Scrivi il tuo ordine..."
                  className="flex-1 bg-muted/30 border border-border/20 rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border/40"
                />
                <button type="submit" disabled={!inputText.trim() || isLoading}
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white disabled:opacity-30 transition-opacity"
                  style={{ background: accentColor }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {isSpeaking && (
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
                  <Volume2 className="w-3 h-3 animate-pulse" /> L'assistente sta parlando...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RestaurantVoiceAgent;
