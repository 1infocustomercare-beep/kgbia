import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, X, Wine, Crown, Loader2 } from "lucide-react";
import type { MenuItem } from "@/types/restaurant";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";

// ─── Fallback pairing rules (used when AI is unavailable) ───
const PAIRING_RULES: Record<string, { categories: string[]; message: string }> = {
  Pizze: { categories: ["Bevande", "Antipasti", "Dolci"], message: "Questa pizza è perfetta con..." },
  Primi: { categories: ["Bevande", "Dolci", "Contorni"], message: "Completa il primo piatto con..." },
  "PRIMI PIATTI DI MARE": { categories: ["Bevande", "Vini bianchi", "Vino bianco", "Bollicine", "Dolci"], message: "Con il pesce consigliamo..." },
  "PRIMI PIATTI DI TERRA": { categories: ["Bevande", "Vini rossi", "Vino rosso", "Dolci", "CONTORNI"], message: "Un rosso strutturato si abbina perfettamente..." },
  "SECONDI PIATTI DI MARE": { categories: ["Bevande", "Vini bianchi", "Vino bianco", "Bollicine", "CONTORNI"], message: "Per esaltare il pesce, prova..." },
  "SECONDI PIATTI DI TERRA": { categories: ["Bevande", "Vini rossi", "Vino rosso", "CONTORNI", "Dolci"], message: "Un contorno o un vino per completare..." },
  Secondi: { categories: ["Bevande", "Dolci", "Contorni"], message: "Completa il piatto con..." },
  Antipasti: { categories: ["Primi", "Bevande"], message: "Continua l'esperienza con..." },
  Dolci: { categories: ["Bevande"], message: "Un drink perfetto per il dolce..." },
  Bevande: { categories: ["Antipasti", "Dolci"], message: "Da sgranocchiare insieme..." },
};

type AIMode = "sommelier" | "maitre" | "fallback";
interface AISuggestion {
  menu_item_id: string;
  name: string;
  price: number;
  reason: string;
  pairing_reason?: string;
  sommelier_note?: string;
  course_position?: string;
}

interface UpsellingSuggestionProps {
  allMenuItems: MenuItem[];
  lastAddedCategory?: string;
  onClose: () => void;
  visible: boolean;
  restaurantId?: string;
}

const UpsellingSuggestion = ({ allMenuItems, lastAddedCategory, onClose, visible, restaurantId }: UpsellingSuggestionProps) => {
  const { addItem, items: cartItems } = useCart();
  const [aiMode, setAiMode] = useState<AIMode>("fallback");
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [aiGreeting, setAiGreeting] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasCalledAI, setHasCalledAI] = useState(false);

  // Determine if cart has beverages to decide sommelier vs maître
  const hasBeverages = cartItems.some(i => 
    ["bevande", "vini", "cocktail", "birre", "drinks", "bollicine"].some(c => i.category?.toLowerCase().includes(c))
  );

  const callAISommelier = useCallback(async () => {
    if (!restaurantId || cartItems.length === 0 || loading) return;
    setLoading(true);

    try {
      // Decide: if no beverages yet, use sommelier. Otherwise use maître for food upsell.
      const action = !hasBeverages ? "sommelier-pairing" : "maitre-suggest";
      
      const { data, error } = await supabase.functions.invoke("ai-sommelier", {
        body: {
          action,
          cartItems: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, category: i.category })),
          menuItems: allMenuItems.map(m => ({ id: m.id, name: m.name, price: m.price, category: m.category, is_popular: m.isPopular, is_active: true })),
          restaurantId,
        },
      });

      if (error) throw error;

      const suggestions = data?.suggestions || [];
      if (suggestions.length > 0) {
        // Match AI suggestions to real menu items
        const matched = suggestions
          .map((s: AISuggestion) => {
            const menuItem = allMenuItems.find(m => m.id === s.menu_item_id);
            if (!menuItem) return null;
            return { ...s, _menuItem: menuItem };
          })
          .filter(Boolean)
          .slice(0, 3);

        if (matched.length > 0) {
          setAiSuggestions(matched);
          setAiGreeting(data?.greeting || data?.maitre_greeting || "");
          setAiMode(!hasBeverages ? "sommelier" : "maitre");
          setHasCalledAI(true);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error("AI sommelier/maitre error:", e);
    }

    // Fallback
    setAiMode("fallback");
    setLoading(false);
    setHasCalledAI(true);
  }, [restaurantId, cartItems, allMenuItems, hasBeverages, loading]);

  // Call AI when cart changes significantly (debounced)
  useEffect(() => {
    if (!visible || cartItems.length === 0) return;
    
    const timer = setTimeout(() => {
      if (!hasCalledAI || cartItems.length !== (aiSuggestions.length > 0 ? cartItems.length : 0)) {
        callAISommelier();
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [visible, cartItems.length]);

  // Reset when cart empties
  useEffect(() => {
    if (cartItems.length === 0) {
      setHasCalledAI(false);
      setAiSuggestions([]);
      setAiMode("fallback");
    }
  }, [cartItems.length]);

  if (!visible || cartItems.length === 0) return null;

  // ─── AI Mode rendering ───
  if (aiMode !== "fallback" && aiSuggestions.length > 0) {
    const isSommelier = aiMode === "sommelier";
    const Icon = isSommelier ? Wine : Crown;
    const label = isSommelier ? "Il Sommelier Consiglia" : "Il Maître Consiglia";
    const gradientFrom = isSommelier ? "from-[hsl(var(--primary))]/15" : "from-[hsl(var(--primary))]/15";

    return (
      <AnimatePresence>
        <motion.div
          className="mx-4 sm:mx-5 mb-3 rounded-2xl overflow-hidden border border-primary/20 shadow-lg"
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className={`bg-gradient-to-r ${gradientFrom} via-primary/10 to-primary/5 px-4 py-2.5 flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {label}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-secondary/50 transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>

          <div className="bg-card/60 backdrop-blur-sm px-4 py-3">
            {aiGreeting && (
              <p className="text-xs text-foreground/80 mb-3 font-medium italic">"{aiGreeting}"</p>
            )}
            <div className="space-y-2">
              {aiSuggestions.map((s: any, idx: number) => {
                const menuItem = allMenuItems.find(m => m.id === s.menu_item_id);
                if (!menuItem) return null;

                return (
                  <motion.div
                    key={s.menu_item_id}
                    className="flex items-center gap-3 p-2 rounded-xl bg-card hover:bg-secondary/40 transition-colors group"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {menuItem.image && (
                      <img src={menuItem.image} alt={menuItem.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-border/20" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground truncate">{menuItem.name}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2 mt-0.5">
                        {s.pairing_reason || s.reason || s.sommelier_note || ""}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-primary font-display font-bold">€{menuItem.price.toFixed(2)}</p>
                        {s.course_position && (
                          <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full uppercase tracking-wider font-medium">
                            {s.course_position}
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.button
                      onClick={() => addItem(menuItem)}
                      className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors flex-shrink-0"
                      whileTap={{ scale: 0.85 }}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ─── Loading state ───
  if (loading) {
    return (
      <motion.div
        className="mx-4 sm:mx-5 mb-3 rounded-2xl overflow-hidden border border-primary/10 p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-xs">Il sommelier sta preparando i suggerimenti...</span>
        </div>
      </motion.div>
    );
  }

  // ─── Fallback: rule-based ───
  if (!lastAddedCategory) return null;

  const ruleKey = Object.keys(PAIRING_RULES).find(
    k => k === lastAddedCategory || k.toLowerCase() === lastAddedCategory.toLowerCase()
  );
  const rule = ruleKey ? PAIRING_RULES[ruleKey] : null;
  if (!rule) return null;

  const cartItemIds = new Set(cartItems.map(i => i.id));
  const suggestions = allMenuItems
    .filter(item => {
      if (cartItemIds.has(item.id)) return false;
      return rule.categories.some(c => c.toLowerCase() === item.category.toLowerCase());
    })
    .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.price - a.price)
    .slice(0, 3);

  if (suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="mx-4 sm:mx-5 mb-3 rounded-2xl overflow-hidden border border-primary/20"
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <Wine className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Lo Chef Consiglia
              </span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-secondary/50 transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>

          <div className="bg-card/60 backdrop-blur-sm px-4 py-3">
            <p className="text-xs text-foreground/80 mb-3 font-medium">{rule.message}</p>
            <div className="space-y-2">
              {suggestions.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-xl bg-card hover:bg-secondary/40 transition-colors group"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-border/20" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground truncate">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-primary font-display font-bold">€{item.price.toFixed(2)}</p>
                      <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">{item.category}</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => addItem(item)}
                    className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors flex-shrink-0"
                    whileTap={{ scale: 0.85 }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpsellingSuggestion;
