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
};

const MenuItemCard = ({ item, index, onSelect }: MenuItemCardProps) => {
  const { addItem } = useCart();

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-card cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      style={{
        boxShadow: "0 4px 20px hsla(0,0%,0%,0.3), 0 1px 4px hsla(0,0%,0%,0.2)",
      }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />

        {/* Popular badge */}
        {item.isPopular && (
          <motion.div
            className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full glass text-xs font-medium text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.06 + 0.3 }}
          >
            <Flame className="w-3 h-3" />
            Signature
          </motion.div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 right-12 px-2 py-0.5 rounded-full glass text-[10px] font-medium text-foreground/80 uppercase tracking-wider">
          {item.category}
        </div>

        {/* Quick add button overlaid on image */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            addItem(item);
          }}
          className="absolute bottom-3 right-3 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 -mt-4 relative z-10">
        {/* Allergens inline */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex gap-1 mb-1.5">
            {item.allergens.map((a) => (
              <span key={a} className="text-[11px]" title={a}>
                {allergenIcons[a] || "⚠️"}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-display text-base font-semibold text-foreground leading-tight">
          {item.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Price */}
        <div className="mt-2.5">
          <span className="text-lg font-display font-bold text-primary">
            €{item.price.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
