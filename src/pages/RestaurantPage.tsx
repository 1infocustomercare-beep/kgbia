import { useState, useMemo, useCallback } from "react";
import { demoRestaurant, demoMenu, menuCategories } from "@/data/demo-restaurant";
import SplashScreen from "@/components/restaurant/SplashScreen";
import CategoryTabs from "@/components/restaurant/CategoryTabs";
import MenuItemCard from "@/components/restaurant/MenuItemCard";
import CartDrawer from "@/components/restaurant/CartDrawer";
import FloatingCartButton from "@/components/restaurant/FloatingCartButton";
import ItemDetailSheet from "@/components/restaurant/ItemDetailSheet";
import PrivateChat from "@/components/restaurant/PrivateChat";
import LoyaltyWallet from "@/components/restaurant/LoyaltyWallet";
import ReviewShield from "@/components/restaurant/ReviewShield";
import restaurantLogo from "@/assets/restaurant-logo.png";
import { Search, Settings, Wallet, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { MenuItem } from "@/types/restaurant";

type ExtraPanel = null | "loyalty" | "reviews";

const RestaurantPage = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [extraPanel, setExtraPanel] = useState<ExtraPanel>(null);

  const filteredItems = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return demoMenu.filter(
        (i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    return demoMenu.filter((i) => i.category === activeCategory);
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={restaurantLogo} alt={demoRestaurant.name} className="w-11 h-11 rounded-xl object-contain" />
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">{demoRestaurant.name}</h1>
              <p className="text-xs text-muted-foreground">{demoRestaurant.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExtraPanel(extraPanel === "loyalty" ? null : "loyalty")}
              className={`p-2 rounded-full transition-colors ${extraPanel === "loyalty" ? "bg-primary/20 text-primary" : "hover:bg-secondary text-muted-foreground"}`}
            >
              <Wallet className="w-5 h-5" />
            </button>
            <button
              onClick={() => setExtraPanel(extraPanel === "reviews" ? null : "reviews")}
              className={`p-2 rounded-full transition-colors ${extraPanel === "reviews" ? "bg-primary/20 text-primary" : "hover:bg-secondary text-muted-foreground"}`}
            >
              <Star className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
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

      {/* Extra panels */}
      <AnimatePresence mode="wait">
        {extraPanel && (
          <motion.div
            key={extraPanel}
            className="px-5 mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                {extraPanel === "loyalty" ? "Loyalty Wallet" : "Recensioni"}
              </h3>
              <button onClick={() => setExtraPanel(null)} className="p-1 rounded-full hover:bg-secondary">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {extraPanel === "loyalty" && <LoyaltyWallet />}
            {extraPanel === "reviews" && <ReviewShield />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category tabs */}
      {!search.trim() && !extraPanel && (
        <CategoryTabs categories={menuCategories} active={activeCategory} onSelect={setActiveCategory} />
      )}

      {/* Menu grid */}
      {!extraPanel && (
        <div className="px-5 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map((item, i) => (
            <MenuItemCard key={item.id} item={item} index={i} onSelect={() => setSelectedItem(item)} />
          ))}
        </div>
      )}

      {!extraPanel && filteredItems.length === 0 && (
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
          Nessun piatto trovato
        </div>
      )}

      {/* Item detail */}
      <ItemDetailSheet item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Private Chat */}
      <PrivateChat />

      {/* Cart */}
      <FloatingCartButton onClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default RestaurantPage;
