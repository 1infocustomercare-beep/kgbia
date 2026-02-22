import { useState, useMemo, useCallback, useRef } from "react";
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
import heroVideo from "@/assets/hero-restaurant.mp4";
import { Search, Wallet, Star, X, ChevronDown, Crown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import type { MenuItem } from "@/types/restaurant";

type ExtraPanel = null | "loyalty" | "reviews";

const RestaurantPage = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [extraPanel, setExtraPanel] = useState<ExtraPanel>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.1]);

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
      {/* ========== VIDEO HERO ========== */}
      <motion.div
        ref={heroRef}
        className="relative h-[85vh] overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster=""
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </motion.div>

        {/* Dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Crown className="w-8 h-8 text-primary mx-auto mb-3 drop-shadow-[0_0_20px_hsla(38,75%,55%,0.6)]" />
          </motion.div>

          <motion.img
            src={restaurantLogo}
            alt={demoRestaurant.name}
            className="w-20 h-20 rounded-2xl object-contain mb-4"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />

          <motion.h1
            className="text-4xl sm:text-5xl font-display font-bold text-foreground tracking-wide text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {demoRestaurant.name.split("").map((char, i) => (
              <span key={i} className={char === " " ? "" : ""}>{char}</span>
            ))}
          </motion.h1>

          <motion.div
            className="flex items-center gap-3 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="w-8 h-px bg-primary/60" />
            <p className="text-sm text-primary font-medium tracking-[0.2em] uppercase">
              {demoRestaurant.tagline}
            </p>
            <div className="w-8 h-px bg-primary/60" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">Menu</span>
          <ChevronDown className="w-5 h-5 text-primary/60" />
        </motion.div>
      </motion.div>

      {/* ========== STICKY HEADER + SEARCH ========== */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border/50">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <img src={restaurantLogo} alt="" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-display text-base font-bold text-foreground">{demoRestaurant.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExtraPanel(extraPanel === "loyalty" ? null : "loyalty")}
              className={`p-2 rounded-full transition-colors ${extraPanel === "loyalty" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
            >
              <Wallet className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setExtraPanel(extraPanel === "reviews" ? null : "reviews")}
              className={`p-2 rounded-full transition-colors ${extraPanel === "reviews" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
            >
              <Star className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Cerca nel menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/60 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>

        {/* Category tabs */}
        {!search.trim() && !extraPanel && (
          <CategoryTabs categories={menuCategories} active={activeCategory} onSelect={setActiveCategory} />
        )}
      </div>

      {/* ========== EXTRA PANELS ========== */}
      <AnimatePresence mode="wait">
        {extraPanel && (
          <motion.div
            key={extraPanel}
            className="px-5 py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-display font-semibold text-foreground">
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

      {/* ========== MENU GRID ========== */}
      {!extraPanel && (
        <div className="px-4 mt-5">
          {/* Section title */}
          {!search.trim() && (
            <motion.div
              className="mb-4 px-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={activeCategory}
            >
              <h2 className="text-2xl font-display font-bold text-foreground">{activeCategory}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{filteredItems.length} piatti</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item, i) => (
              <MenuItemCard key={item.id} item={item} index={i} onSelect={() => setSelectedItem(item)} />
            ))}
          </div>
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
