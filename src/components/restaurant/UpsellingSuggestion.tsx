import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, X } from "lucide-react";
import type { MenuItem } from "@/types/restaurant";
import { useCart } from "@/context/CartContext";

// Category-based pairing rules
const PAIRING_RULES: Record<string, string[]> = {
  Pizze: ["Bevande"],
  Primi: ["Bevande", "Dolci"],
  Secondi: ["Bevande", "Dolci"],
  Antipasti: ["Primi", "Bevande"],
  Dolci: ["Bevande"],
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

  const suggestedCategories = PAIRING_RULES[lastAddedCategory] || [];
  if (suggestedCategories.length === 0) return null;

  const cartItemIds = new Set(cartItems.map(i => i.id));
  const suggestions = allMenuItems
    .filter(item => suggestedCategories.includes(item.category) && !cartItemIds.has(item.id))
    .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
    .slice(0, 3);

  if (suggestions.length === 0) return null;

  const pairingText: Record<string, string> = {
    Pizze: "Questa pizza sta benissimo con...",
    Primi: "Il piatto perfetto insieme a...",
    Secondi: "Completa la tua esperienza con...",
    Antipasti: "Continua con...",
    Dolci: "Un drink perfetto per il finale...",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="mx-5 mb-3 p-4 rounded-2xl bg-primary/5 border border-primary/20"
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wider uppercase">Suggerimento</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-secondary transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm text-foreground mb-3">{pairingText[lastAddedCategory] || "Ti potrebbe piacere anche..."}</p>
          <div className="space-y-2">
            {suggestions.map((item) => (
              <motion.div
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-xl bg-card/60 hover:bg-card transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-primary font-display font-semibold">€{item.price.toFixed(2)}</p>
                </div>
                <motion.button
                  onClick={() => addItem(item)}
                  className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  whileTap={{ scale: 0.85 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpsellingSuggestion;
