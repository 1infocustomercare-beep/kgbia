import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { UtensilsCrossed, Soup, Pizza, Beef, IceCreamCone, Wine } from "lucide-react";

interface CategoryTabsProps {
  categories: string[];
  active: string;
  onSelect: (cat: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Antipasti: <UtensilsCrossed className="w-4 h-4" />,
  Primi: <Soup className="w-4 h-4" />,
  Pizze: <Pizza className="w-4 h-4" />,
  Secondi: <Beef className="w-4 h-4" />,
  Dolci: <IceCreamCone className="w-4 h-4" />,
  Bevande: <Wine className="w-4 h-4" />,
};

const CategoryTabs = ({ categories, active, onSelect }: CategoryTabsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const scrollLeft = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [active]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-1.5 overflow-x-auto scrollbar-hide px-5 pb-3"
    >
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            ref={isActive ? activeRef : undefined}
            onClick={() => onSelect(cat)}
            className="relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
          >
            {isActive && (
              <motion.div
                layoutId="activeCat"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              />
            )}
            <span className={`relative z-10 flex items-center gap-1.5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}>
              {categoryIcons[cat] || <UtensilsCrossed className="w-4 h-4" />}
              {cat}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
