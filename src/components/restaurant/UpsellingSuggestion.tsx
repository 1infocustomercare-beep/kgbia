import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, X, ChefHat } from "lucide-react";
import type { MenuItem } from "@/types/restaurant";
import { useCart } from "@/context/CartContext";

// Extended category-based pairing rules with Italian cuisine logic
const PAIRING_RULES: Record<string, { categories: string[]; message: string }> = {
  Pizze: {
    categories: ["Bevande", "Antipasti", "Dolci"],
    message: "Questa pizza è perfetta con...",
  },
  Primi: {
    categories: ["Bevande", "Dolci", "Contorni"],
    message: "Completa il primo piatto con...",
  },
  "PRIMI PIATTI DI MARE": {
    categories: ["Bevande", "Vini bianchi", "Vino bianco", "Bollicine", "Dolci"],
    message: "Con il pesce consigliamo...",
  },
  "PRIMI PIATTI DI TERRA": {
    categories: ["Bevande", "Vini rossi", "Vino rosso", "Dolci", "CONTORNI"],
    message: "Un rosso strutturato si abbina perfettamente...",
  },
  "SECONDI PIATTI DI MARE": {
    categories: ["Bevande", "Vini bianchi", "Vino bianco", "Bollicine", "CONTORNI"],
    message: "Per esaltare il pesce, prova...",
  },
  "SECONDI PIATTI DI TERRA": {
    categories: ["Bevande", "Vini rossi", "Vino rosso", "CONTORNI", "Dolci"],
    message: "Un contorno o un vino per completare...",
  },
  Secondi: {
    categories: ["Bevande", "Dolci", "Contorni"],
    message: "Completa il piatto con...",
  },
  "ANTIPASTI DI MARE": {
    categories: ["PRIMI PIATTI DI MARE", "Bollicine", "Vino bianco", "Bevande"],
    message: "Dopo l'antipasto, continua con...",
  },
  "ANTIPASTI DI TERRA": {
    categories: ["PRIMI PIATTI DI TERRA", "Vini rossi", "Bevande"],
    message: "Per seguire, ti consigliamo...",
  },
  Antipasti: {
    categories: ["Primi", "Bevande"],
    message: "Continua l'esperienza con...",
  },
  APERITIVE: {
    categories: ["ANTIPASTI DI MARE", "ANTIPASTI DI TERRA", "Antipasti", "Bollicine"],
    message: "Perfetto da accompagnare con...",
  },
  Dolci: {
    categories: ["Bevande"],
    message: "Un drink perfetto per il dolce...",
  },
  CONTORNI: {
    categories: ["Bevande", "Dolci"],
    message: "Per chiudere in bellezza...",
  },
  Bevande: {
    categories: ["Antipasti", "Dolci"],
    message: "Da sgranocchiare insieme...",
  },
  "Vini rossi": {
    categories: ["SECONDI PIATTI DI TERRA", "PRIMI PIATTI DI TERRA", "Antipasti"],
    message: "Un piatto che esalta questo vino...",
  },
  "Vino bianco": {
    categories: ["SECONDI PIATTI DI MARE", "PRIMI PIATTI DI MARE", "ANTIPASTI DI MARE"],
    message: "Perfetto abbinamento pesce e bianco...",
  },
  Bollicine: {
    categories: ["ANTIPASTI DI MARE", "Antipasti", "APERITIVE"],
    message: "Le bollicine stanno bene con...",
  },
};

interface UpsellingSuggestionProps {
  allMenuItems: MenuItem[];
  lastAddedCategory?: string;
  onClose: () => void;
  visible: boolean;
}

const UpsellingSuggestion = ({ allMenuItems, lastAddedCategory, onClose, visible }: UpsellingSuggestionProps) => {
  const { addItem, items: cartItems } = useCart();

  if (!lastAddedCategory || !visible) return null;

  // Find matching rule (exact match first, then case-insensitive)
  const ruleKey = Object.keys(PAIRING_RULES).find(
    k => k === lastAddedCategory || k.toLowerCase() === lastAddedCategory.toLowerCase()
  );
  const rule = ruleKey ? PAIRING_RULES[ruleKey] : null;
  
  if (!rule) return null;

  const cartItemIds = new Set(cartItems.map(i => i.id));
  const suggestions = allMenuItems
    .filter(item => {
      if (cartItemIds.has(item.id)) return false;
      return rule.categories.some(
        c => c.toLowerCase() === item.category.toLowerCase()
      );
    })
    .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
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
          {/* Header gradient bar */}
          <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <ChefHat className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Lo Chef Consiglia
                </span>
              </div>
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
