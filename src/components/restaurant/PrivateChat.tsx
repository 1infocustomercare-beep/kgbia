import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageSquare, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  sender: "customer" | "restaurant";
  timestamp: Date;
}

interface PrivateChatProps {
  restaurantId?: string;
  isRestaurantView?: boolean;
}

const PrivateChat = ({ restaurantId, isRestaurantView = false }: PrivateChatProps) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [senderId] = useState(() => {
    // Generate anonymous session ID for non-auth customers
    let sid = sessionStorage.getItem("chat_session_id");
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem("chat_session_id", sid);
    }
    return sid;
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!restaurantId || !open) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) {
        setMessages(data.map(m => ({
          id: m.id,
          text: m.message,
          sender: m.is_from_restaurant ? "restaurant" : "customer",
          timestamp: new Date(m.created_at),
        })));
      }
    };
    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel(`chat-${restaurantId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `restaurant_id=eq.${restaurantId}`,
      }, (payload) => {
        const m = payload.new as any;
        setMessages(prev => {
          if (prev.some(p => p.id === m.id)) return prev;
          return [...prev, {
            id: m.id,
            text: m.message,
            sender: m.is_from_restaurant ? "restaurant" : "customer",
            timestamp: new Date(m.created_at),
          }];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [restaurantId, open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim() || !restaurantId) return;
    const text = input.trim();
    setInput("");

    const { error } = await supabase.from("chat_messages").insert({
      restaurant_id: restaurantId,
      message: text,
      is_from_restaurant: isRestaurantView,
      sender_id: null,
      sender_name: isRestaurantView ? "Ristorante" : "Cliente",
    } as any);

    if (error) {
      console.error("Chat send error:", error);
    }
  };

  if (!restaurantId) return null;

  // Restaurant admin view - inline panel
  if (isRestaurantView) {
    return (
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-foreground">Private Connect — Chat Clienti</span>
          <Lock className="w-3 h-3 text-muted-foreground ml-auto" />
        </div>
        <div ref={scrollRef} className="h-64 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Nessun messaggio — i clienti possono scriverti dalla PWA</p>
          )}
          {messages.map((msg) => (
            <motion.div key={msg.id} className={`flex ${msg.sender === "restaurant" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.sender === "restaurant"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-secondary-foreground rounded-bl-md"
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="p-3 border-t border-border flex gap-2">
          <input type="text" placeholder="Rispondi al cliente..." value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-3 py-2.5 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
          <motion.button onClick={handleSend}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center min-w-[44px] min-h-[44px]" whileTap={{ scale: 0.9 }}>
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    );
  }

  // Customer FAB view
  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-5 z-30 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg gold-glow"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            whileTap={{ scale: 0.9 }}>
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)} />
            <motion.div
              className="fixed bottom-0 inset-x-0 z-50 max-h-[75vh] bg-card rounded-t-3xl flex flex-col"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <h3 className="font-display font-bold text-foreground">Private Connect</h3>
                  <p className="text-xs text-primary flex items-center gap-1"><Lock className="w-3 h-3" /> Chat criptata</p>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-secondary">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {messages.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">Scrivi al ristorante — la tua privacy è protetta 🔐</p>
                )}
                {messages.map((msg) => (
                  <motion.div key={msg.id} className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === "customer"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input type="text" placeholder="Scrivi un messaggio..." value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <motion.button onClick={handleSend}
                    className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}>
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PrivateChat;
