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
import dishBurrata from "@/assets/dish-burrata.jpg";
import { Search, Wallet, Star, X, ChevronDown, Crown, Home, UtensilsCrossed, ClipboardList, User, ShoppingBag, Plus } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import type { MenuItem } from "@/types/restaurant";
import { useCart } from "@/context/CartContext";

type ExtraPanel = null | "loyalty" | "reviews";
type BottomTab = "home" | "menu" | "orders" | "profile";

const RestaurantPage = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [extraPanel, setExtraPanel] = useState<ExtraPanel>(null);
  const [activeTab, setActiveTab] = useState<BottomTab>("home");
  const heroRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

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

  const popularItems = useMemo(() => demoMenu.filter(i => i.isPopular), []);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  if (showSplash) {
    return <SplashScreen restaurantName={demoRestaurant.name} onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ========== TOP NAVBAR — ARIA STYLE ========== */}
      <div className="sticky top-0 z-40 glass-strong safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo + Crown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <img src={restaurantLogo} alt="" className="w-9 h-9 rounded-xl object-contain" />
              <Crown className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-foreground leading-tight">{demoRestaurant.name}</p>
              <p className="text-[10px] text-muted-foreground">{demoRestaurant.tagline}</p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExtraPanel(extraPanel === "reviews" ? null : "reviews")}
              className={`p-2 rounded-full transition-colors ${extraPanel === "reviews" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
            >
              <Star className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 rounded-full text-muted-foreground relative"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========== HERO IMAGE — Dish of the Day ========== */}
      {activeTab === "home" && (
        <motion.div
          ref={heroRef}
          className="relative h-[50vh] overflow-hidden"
          style={{ opacity: heroOpacity }}
        >
          <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
            <img
              src={dishBurrata}
              alt="Piatto del giorno"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          <div className="absolute bottom-6 left-5 right-5 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="inline-block px-3 py-1 rounded-full glass text-[10px] font-medium text-primary uppercase tracking-wider mb-2">
                Piatto del Giorno
              </span>
              <h2 className="text-3xl font-display font-bold text-foreground leading-tight">
                Burrata Pugliese
              </h2>
              <p className="text-sm text-foreground/70 mt-1">Burrata freschissima di Andria con pomodorini confit</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xl font-display font-bold text-primary">€14.00</span>
                <motion.button
                  onClick={() => {
                    const burrata = demoMenu.find(i => i.id === "7");
                    if (burrata) addItem(burrata);
                  }}
                  className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold tracking-wider uppercase"
                  whileTap={{ scale: 0.95 }}
                >
                  Aggiungi
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ========== SEARCH BAR ========== */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Cerca nel menu..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveTab("menu"); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/60 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {/* ========== CATEGORY HORIZONTAL SCROLL ========== */}
      {!search.trim() && !extraPanel && (
        <CategoryTabs categories={menuCategories} active={activeCategory} onSelect={(cat) => { setActiveCategory(cat); setActiveTab("menu"); }} />
      )}

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

      {/* ========== HOME: Popular Items ========== */}
      {activeTab === "home" && !extraPanel && !search.trim() && (
        <div className="px-4 mt-2">
          <h3 className="text-lg font-display font-bold text-foreground mb-3">🔥 I più amati</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {popularItems.map((item) => (
              <motion.div
                key={item.id}
                className="flex-shrink-0 w-40 rounded-2xl bg-card overflow-hidden food-card-shadow"
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  <motion.button
                    onClick={(e) => { e.stopPropagation(); addItem(item); }}
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                    whileTap={{ scale: 0.85 }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-display font-semibold text-foreground line-clamp-1">{item.name}</p>
                  <p className="text-sm font-display font-bold text-primary mt-0.5">€{item.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ========== MENU GRID — ARIA STYLE Full Width Cards ========== */}
      {!extraPanel && (activeTab === "menu" || activeTab === "home") && (
        <div className="px-4 mt-4">
          {!search.trim() && (
            <motion.div
              className="mb-3 px-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={activeCategory}
            >
              <h2 className="text-2xl font-display font-bold text-foreground">{activeCategory}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{filteredItems.length} piatti</p>
            </motion.div>
          )}

          <div className="space-y-4">
            {filteredItems.map((item, i) => (
              <MenuItemCard key={item.id} item={item} index={i} onSelect={() => setSelectedItem(item)} />
            ))}
          </div>
        </div>
      )}

      {/* ========== ORDERS TAB ========== */}
      {activeTab === "orders" && (
        <div className="flex flex-col items-center justify-center py-20 px-5">
          <ClipboardList className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-foreground font-display font-semibold">I tuoi ordini</p>
          <p className="text-sm text-muted-foreground mt-1 text-center">Nessun ordine ancora. Inizia a esplorare il menu!</p>
        </div>
      )}

      {/* ========== PROFILE TAB ========== */}
      {activeTab === "profile" && (
        <div className="flex flex-col items-center justify-center py-20 px-5">
          <User className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-foreground font-display font-semibold">Profilo</p>
          <p className="text-sm text-muted-foreground mt-1 text-center">Accedi per salvare i tuoi ordini e guadagnare punti fedeltà.</p>
          <button className="mt-4 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            Accedi / Registrati
          </button>
        </div>
      )}

      {!extraPanel && filteredItems.length === 0 && (activeTab === "menu" || activeTab === "home") && (
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

      {/* ========== BOTTOM NAV — ARIA STYLE ========== */}
      <nav className="fixed bottom-0 inset-x-0 z-40 glass-strong border-t border-border/30 safe-bottom">
        <div className="flex items-center justify-around py-2">
          {([
            { id: "home" as BottomTab, icon: Home, label: "Home" },
            { id: "menu" as BottomTab, icon: UtensilsCrossed, label: "Menu" },
            { id: "orders" as BottomTab, icon: ClipboardList, label: "Ordini" },
            { id: "profile" as BottomTab, icon: User, label: "Profilo" },
          ]).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-0.5 py-1 px-3 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomTabIndicator"
                    className="absolute -top-0.5 w-6 h-0.5 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default RestaurantPage;
