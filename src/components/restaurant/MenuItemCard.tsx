import { motion } from "framer-motion";
import { Plus, Flame } from "lucide-react";
import type { MenuItem } from "@/types/restaurant";
import { useCart } from "@/context/CartContext";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  onSelect?: () => void;
}

const allergenIcons: Record<string, string> = {
  glutine: "🌾",
  uova: "🥚",
  latticini: "🧀",
  pesce: "🐟",
  arachidi: "🥜",
  "frutta a guscio": "🌰",
};

const MenuItemCard = ({ item, index, onSelect }: MenuItemCardProps) => {
  const { addItem } = useCart();

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl cote-card cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      {/* Full-width image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(20_8%_8%)] via-transparent to-transparent" />

        {/* Popular badge */}
        {item.isPopular && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full glass text-xs font-medium text-primary">
            <Flame className="w-3 h-3" />
            Signature
          </div>
        )}

        {/* Quick add — large touchable button */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); addItem(item); }}
          className="absolute bottom-3 right-3 flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base font-semibold text-foreground leading-tight">
              {item.name}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
          <span className="text-lg font-display font-bold text-primary flex-shrink-0">
            €{item.price.toFixed(2)}
          </span>
        </div>

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex gap-1 mt-2">
            {item.allergens.map((a) => (
              <span key={a} className="text-[11px]" title={a}>
                {allergenIcons[a] || "⚠️"}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
