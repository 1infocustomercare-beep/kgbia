import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

interface CategoryTabsProps {
  categories: string[];
  active: string;
  onSelect: (cat: string) => void;
}

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
      className="flex gap-2 overflow-x-auto scrollbar-hide px-5 py-3 sticky top-0 z-20 glass-strong"
    >
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            ref={isActive ? activeRef : undefined}
            onClick={() => onSelect(cat)}
            className="relative px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0"
          >
            {isActive && (
              <motion.div
                layoutId="activeCat"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              />
            )}
            <span className={`relative z-10 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}>
              {cat}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
