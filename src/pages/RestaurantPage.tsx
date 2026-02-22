import { useState, useMemo, useCallback } from "react";
import { demoRestaurant, demoMenu, menuCategories } from "@/data/demo-restaurant";
import SplashScreen from "@/components/restaurant/SplashScreen";
import CategoryTabs from "@/components/restaurant/CategoryTabs";
import MenuItemCard from "@/components/restaurant/MenuItemCard";
import CartDrawer from "@/components/restaurant/CartDrawer";
import FloatingCartButton from "@/components/restaurant/FloatingCartButton";
import restaurantLogo from "@/assets/restaurant-logo.png";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const RestaurantPage = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    let items = demoMenu.filter((i) => i.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = demoMenu.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [activeCategory, search]);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  if (showSplash) {
    return <SplashScreen restaurantName={demoRestaurant.name} onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <motion.header
        className="px-5 pt-6 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <img src={restaurantLogo} alt={demoRestaurant.name} className="w-11 h-11 rounded-xl object-contain" />
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">{demoRestaurant.name}</h1>
            <p className="text-xs text-muted-foreground">{demoRestaurant.tagline}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cerca nel menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </motion.header>

      {/* Category tabs */}
      {!search.trim() && (
        <CategoryTabs categories={menuCategories} active={activeCategory} onSelect={setActiveCategory} />
      )}

      {/* Menu grid */}
      <div className="px-5 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredItems.map((item, i) => (
          <MenuItemCard key={item.id} item={item} index={i} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Nessun piatto trovato
        </div>
      )}

      {/* Cart */}
      <FloatingCartButton onClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default RestaurantPage;
