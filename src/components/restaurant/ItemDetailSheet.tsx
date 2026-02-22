import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import type { MenuItem } from "@/types/restaurant";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const allergenLabels: Record<string, string> = {
  glutine: "🌾 Glutine",
  uova: "🥚 Uova",
  latticini: "🧀 Latticini",
  pesce: "🐟 Pesce",
  arachidi: "🥜 Arachidi",
};

interface ItemDetailSheetProps {
  item: MenuItem | null;
  onClose: () => void;
}

const ItemDetailSheet = ({ item, onClose }: ItemDetailSheetProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  if (!item) return null;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
    setQuantity(1);
    setNotes("");
    onClose();
  };

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] bg-card rounded-t-3xl overflow-hidden flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {/* Hero image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full glass flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>

              {/* Info */}
              <div className="px-5 -mt-6 relative z-10 pb-4">
                <h2 className="text-2xl font-display font-bold text-foreground">{item.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>

                {/* Allergens */}
                {item.allergens && item.allergens.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-2">Allergeni</p>
                    <div className="flex flex-wrap gap-2">
                      {item.allergens.map((a) => (
                        <span
                          key={a}
                          className="px-3 py-1.5 rounded-full bg-secondary/60 text-xs text-secondary-foreground"
                        >
                          {allergenLabels[a] || a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="mt-5">
                  <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mb-2">Note per la cucina</p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Es: senza cipolla, ben cotta..."
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 text-foreground text-base placeholder:text-muted-foreground/40 resize-none h-20 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>

            {/* Footer with quantity & add */}
            <div className="p-5 border-t border-border/50 bg-card safe-bottom">
              <div className="flex items-center justify-between">
                {/* Quantity selector */}
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
                    whileTap={{ scale: 0.85 }}
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="text-lg font-semibold w-6 text-center">{quantity}</span>
                  <motion.button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
                    whileTap={{ scale: 0.85 }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Add button */}
                <motion.button
                  onClick={handleAdd}
                  className="flex-1 ml-4 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base gold-glow"
                  whileTap={{ scale: 0.97 }}
                >
                  Aggiungi · €{(item.price * quantity).toFixed(2)}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ItemDetailSheet;
