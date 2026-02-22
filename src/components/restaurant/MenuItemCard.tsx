import { motion } from "framer-motion";
import { Plus, Flame } from "lucide-react";
import type { MenuItem } from "@/types/restaurant";
import { useCart } from "@/context/CartContext";

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
}

const allergenIcons: Record<string, string> = {
  glutine: "🌾",
  uova: "🥚",
  latticini: "🧀",
  pesce: "🐟",
  arachidi: "🥜",
};

const MenuItemCard = ({ item, index }: MenuItemCardProps) => {
  const { addItem } = useCart();

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl food-card-shadow bg-card cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

        {/* Popular badge */}
        {item.isPopular && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full glass text-xs font-medium text-primary">
            <Flame className="w-3 h-3" />
            Popolare
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 -mt-6 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
              {item.name}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex gap-1 mt-2">
            {item.allergens.map((a) => (
              <span key={a} className="text-xs" title={a}>
                {allergenIcons[a] || "⚠️"}
              </span>
            ))}
          </div>
        )}

        {/* Price & Add */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-display font-bold text-primary">
            €{item.price.toFixed(2)}
          </span>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              addItem(item);
            }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
