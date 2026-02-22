import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface FloatingCartButtonProps {
  onClick: () => void;
}

const FloatingCartButton = ({ onClick }: FloatingCartButtonProps) => {
  const { itemCount, total } = useCart();

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.button
          onClick={onClick}
          className="fixed bottom-6 left-4 right-4 z-30 flex items-center justify-between px-5 py-3.5 rounded-2xl bg-primary text-primary-foreground gold-glow safe-bottom"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <motion.span
                key={itemCount}
                className="absolute -top-1.5 -right-2 w-4.5 h-4.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
              >
                {itemCount}
              </motion.span>
            </div>
            <span className="font-semibold text-sm">Vedi carrello</span>
          </div>
          <span className="font-display font-bold text-lg">€{total.toFixed(2)}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingCartButton;
