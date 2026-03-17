import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import UpsellingSuggestion from "./UpsellingSuggestion";
import type { MenuItem } from "@/types/restaurant";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  allMenuItems?: MenuItem[];
  restaurantId?: string;
}

const CartDrawer = ({ open, onClose, allMenuItems = [], restaurantId }: CartDrawerProps) => {
  const { items, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [showUpsell, setShowUpsell] = useState(false);
  const [lastAddedCat, setLastAddedCat] = useState<string | undefined>();

  // Detect when a new item is added to show upselling
  const prevCountRef = useRef(items.length);
  useEffect(() => {
    if (items.length > prevCountRef.current && items.length > 0) {
      const lastItem = items[items.length - 1];
      setLastAddedCat(lastItem?.category);
      setShowUpsell(true);
    }
    prevCountRef.current = items.length;
  }, [items.length]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] bg-card rounded-t-3xl flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 pt-2">
              <h2 className="text-xl font-display font-bold text-foreground">Il tuo ordine</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Upselling Suggestion */}
            {allMenuItems.length > 0 && (
              <UpsellingSuggestion
                allMenuItems={allMenuItems}
                lastAddedCategory={lastAddedCat}
                onClose={() => setShowUpsell(false)}
                visible={showUpsell && items.length > 0}
                restaurantId={restaurantId}
              />
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 space-y-3 scrollbar-hide pb-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm">Il carrello è vuoto</p>
                </div>
              ) : (
                items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 p-3 rounded-2xl bg-secondary/40"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground truncate">{item.name}</h4>
                      <p className="text-primary font-display font-semibold mt-0.5">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2.5 mt-1.5">
                        <motion.button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"
                          whileTap={{ scale: 0.85 }}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </motion.button>
                        <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                        <motion.button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"
                          whileTap={{ scale: 0.85 }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="self-start p-1 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border/50 safe-bottom">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Totale</span>
                  <span className="text-2xl font-display font-bold text-primary">
                    €{total.toFixed(2)}
                  </span>
                </div>
                <motion.button
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base gold-glow flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    onClose();
                    const params = new URLSearchParams(window.location.search);
                    const tableParam = params.get("table");
                    navigate(`/r/${slug}/checkout${tableParam ? `?table=${tableParam}` : ""}`);
                  }}
                >
                  Ordina Ora
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
