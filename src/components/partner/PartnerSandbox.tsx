import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import {
  AlertTriangle, Shield, Sparkles, ShoppingCart,
  Plus, Minus, Coffee, Wallet, Gift,
  Eye, Compass, ChefHat, Volume2, Star,
  TrendingUp, DollarSign, Users, CalendarDays,
  MessageSquare, Bell, QrCode, Utensils, MapPin,
  Clock, Check, Package, Send, BarChart3,
  Smartphone, Monitor, CookingPot, UserCheck,
  CircleDot, Phone, Mail, Zap, Layers
} from "lucide-react";
import GuidedDemoOverlay from "./GuidedDemoOverlay";

// Import real dish images
import dishBruschetta from "@/assets/dish-bruschetta.jpg";
import dishPasta from "@/assets/dish-pasta.jpg";
import dishPizza from "@/assets/dish-pizza.jpg";
import dishSteak from "@/assets/dish-steak.jpg";
import dishTiramisu from "@/assets/dish-tiramisu.jpg";
import dishBurrata from "@/assets/dish-burrata.jpg";
import dishRisotto from "@/assets/dish-risotto.jpg";
import dishCacioPepe from "@/assets/dish-cacio-pepe.jpg";
import dishDiavola from "@/assets/dish-diavola.jpg";
import dishBranzino from "@/assets/dish-branzino.jpg";
import dishCannolo from "@/assets/dish-cannolo.jpg";
import dishProsecco from "@/assets/dish-prosecco.jpg";

// Demo menu with real images
const demoMenu = [
  { id: "1", name: "Bruschetta Classica", price: 8.50, category: "Antipasti", image: dishBruschetta, popular: true },
  { id: "2", name: "Burrata Pugliese", price: 14.00, category: "Antipasti", image: dishBurrata, popular: true },
  { id: "3", name: "Tagliatelle al Tartufo", price: 22.00, category: "Primi", image: dishPasta, popular: true },
  { id: "4", name: "Risotto allo Zafferano", price: 20.00, category: "Primi", image: dishRisotto, popular: false },
  { id: "5", name: "Cacio e Pepe", price: 16.00, category: "Primi", image: dishCacioPepe, popular: true },
  { id: "6", name: "Margherita DOP", price: 14.00, category: "Pizze", image: dishPizza, popular: false },
  { id: "7", name: "Diavola Infernale", price: 16.00, category: "Pizze", image: dishDiavola, popular: true },
  { id: "8", name: "Ribeye alla Griglia", price: 38.00, category: "Secondi", image: dishSteak, popular: true },
  { id: "9", name: "Branzino al Sale", price: 32.00, category: "Secondi", image: dishBranzino, popular: false },
  { id: "10", name: "Tiramisù della Nonna", price: 10.00, category: "Dolci", image: dishTiramisu, popular: false },
  { id: "11", name: "Cannolo Siciliano", price: 8.00, category: "Dolci", image: dishCannolo, popular: true },
  { id: "12", name: "Prosecco DOC", price: 8.00, category: "Bevande", image: dishProsecco, popular: false },
];

const categories = ["Popolari", "Antipasti", "Primi", "Pizze", "Secondi", "Dolci", "Bevande"];

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface KitchenOrderItem {
  id: string;
  items: { name: string; qty: number; image: string }[];
  table: number;
  time: string;
  status: "new" | "preparing" | "ready" | "delivered";
  orderType: string;
  customerName: string;
}

type DemoView = "customer" | "admin" | "kitchen";

// Profit card pop-ups data
const profitCards = [
  { trigger: "wallet", icon: <Wallet className="w-4 h-4 text-primary" />, title: "Recupera il 30% dei clienti persi", text: "Clicca qui per riportarli nel tuo locale senza spendere 1€ in pubblicità." },
  { trigger: "ai-mary", icon: <Shield className="w-4 h-4 text-emerald-400" />, title: "Fisco 2026: Sei al Sicuro", text: "Questa luce verde significa che sei protetto dalle multe. Il software lavora, tu cucini." },
  { trigger: "panic", icon: <AlertTriangle className="w-4 h-4 text-amber-400" />, title: "Margini in 1 Secondo", text: "Niente più menù cartacei da ristampare. Un gesto e i prezzi si aggiornano ovunque." },
];

const PartnerSandbox = () => {
  const [priceMultiplier, setPriceMultiplier] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showWalletPush, setShowWalletPush] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [guidedMode, setGuidedMode] = useState(false);
  const [activeView, setActiveView] = useState<DemoView>("customer");
  const [activeProfitCard, setActiveProfitCard] = useState<string | null>(null);
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrderItem[]>([]);
  const [guidedStepId, setGuidedStepId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Popolari");
  const [selectedItem, setSelectedItem] = useState<typeof demoMenu[0] | null>(null);
  const [showReservation, setShowReservation] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [adminTab, setAdminTab] = useState<"overview" | "menu" | "orders" | "tables" | "settings">("overview");
  const [tableStatuses, setTableStatuses] = useState<Record<number, "free" | "occupied" | "calling">>({
    1: "free", 2: "occupied", 3: "free", 4: "occupied", 5: "calling", 6: "free", 7: "occupied", 8: "free",
  });
  const [orderPlacedFlash, setOrderPlacedFlash] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check for dessert → suggest coffee
  useEffect(() => {
    const hasDessert = cart.some(i => ["10", "11"].includes(i.id));
    const hasCoffee = cart.some(i => i.id === "12");
    setShowUpsell(hasDessert && !hasCoffee);
  }, [cart]);

  // Auto-show profit cards based on guided step
  useEffect(() => {
    if (guidedStepId === "panic") setActiveProfitCard("panic");
    else if (guidedStepId === "shield") setActiveProfitCard("ai-mary");
    else if (guidedStepId === "wallet") setActiveProfitCard("wallet");
    else setActiveProfitCard(null);
  }, [guidedStepId]);

  const getAdjustedPrice = (base: number) => Math.max(0.5, +(base * (1 + priceMultiplier / 100)).toFixed(2));

  const addToCart = (item: typeof demoMenu[0]) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1, image: item.image }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0));
  };

  const cartTotal = cart.reduce((s, i) => s + getAdjustedPrice(i.price) * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const placeOrder = () => {
    if (cart.length === 0) return;
    const newOrder: KitchenOrderItem = {
      id: Date.now().toString(),
      items: cart.map(c => ({ name: c.name, qty: c.qty, image: c.image })),
      table: Math.floor(Math.random() * 8) + 1,
      time: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }),
      status: "new",
      orderType: "Tavolo",
      customerName: "Marco R.",
    };
    setKitchenOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setOrderPlacedFlash(true);
    setTimeout(() => setOrderPlacedFlash(false), 2000);
    // Auto-switch to kitchen after a moment to show the magic
    setTimeout(() => {
      setActiveView("kitchen");
    }, 800);
  };

  const updateOrderStatus = (orderId: string, status: KitchenOrderItem["status"]) => {
    setKitchenOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const filteredMenu = selectedCategory === "Popolari"
    ? demoMenu.filter(i => i.popular)
    : demoMenu.filter(i => i.category === selectedCategory);

  // Demo stats for admin
  const demoStats = {
    todayRevenue: 1847 + cartTotal,
    todayOrders: 23 + kitchenOrders.length,
    activeOrders: kitchenOrders.filter(o => o.status !== "delivered").length + 3,
    avgRating: 4.8,
    reservationsToday: 7,
    menuItems: demoMenu.length,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
      {/* Header with Guided Demo Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-display font-bold text-foreground">Demo Live Completa</h2>
        <motion.button
          onClick={() => setGuidedMode(!guidedMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            guidedMode ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary border border-primary/30"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <Compass className="w-3.5 h-3.5" />
          {guidedMode ? "Tour Attivo" : "Guided Demo"}
        </motion.button>
      </div>

      {/* 3-Way View Switcher */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/30 border border-border/30">
        {([
          { id: "customer" as DemoView, label: "📱 App Cliente", icon: <Smartphone className="w-3.5 h-3.5" /> },
          { id: "admin" as DemoView, label: "💻 Admin", icon: <Monitor className="w-3.5 h-3.5" /> },
          { id: "kitchen" as DemoView, label: "🍳 Cucina", icon: <CookingPot className="w-3.5 h-3.5" /> },
        ]).map(v => (
          <button key={v.id} onClick={() => setActiveView(v.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-[11px] font-semibold transition-all relative ${
              activeView === v.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}>
            {v.label}
            {v.id === "kitchen" && kitchenOrders.filter(o => o.status === "new").length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center animate-pulse">
                {kitchenOrders.filter(o => o.status === "new").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Profit Card Pop-up */}
      <AnimatePresence>
        {activeProfitCard && (
          <motion.div
            key={activeProfitCard}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/25 shadow-lg shadow-primary/5"
          >
            {(() => {
              const card = profitCards.find(c => c.trigger === activeProfitCard);
              if (!card) return null;
              return (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center flex-shrink-0">{card.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">{card.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{card.text}</p>
                  </div>
                  <button onClick={() => setActiveProfitCard(null)} className="text-muted-foreground text-xs">✕</button>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== PHONE FRAME ===== */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-[340px]">
          {/* Phone bezel */}
          <div className="bg-foreground/90 rounded-[36px] p-[8px] shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[22px] bg-foreground/90 rounded-b-2xl z-10" />
            {/* Status bar */}
            <div className="absolute top-[5px] left-[22px] z-10">
              <span className="text-[8px] text-background/60 font-medium">9:41</span>
            </div>
            {/* Screen */}
            <div className="w-full rounded-[28px] overflow-hidden bg-background relative">
              {/* Order placed flash */}
              <AnimatePresence>
                {orderPlacedFlash && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
                  >
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl mb-2"
                      >🎉</motion.div>
                      <p className="text-sm font-display font-bold text-foreground">Ordine Inviato!</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Guarda nella Cucina →</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ===== CUSTOMER VIEW ===== */}
              {activeView === "customer" && (
                <div className="h-[560px] overflow-y-auto">
                  {/* Header */}
                  <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/30 px-3 pt-7 pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-display font-bold text-foreground">Impero Roma</p>
                        <p className="text-[9px] text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" /> Via del Corso 42, Roma · <Star className="w-2.5 h-2.5 text-primary fill-primary" /> 4.8
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setShowChat(true)} className="w-8 h-8 rounded-full bg-card border border-border/30 flex items-center justify-center">
                          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button className="relative w-8 h-8 rounded-full bg-card border border-border/30 flex items-center justify-center">
                          <ShoppingCart className="w-3.5 h-3.5 text-foreground" />
                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center">
                              {cartCount}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Push Notification */}
                  <AnimatePresence>
                    {showWalletPush && (
                      <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}
                        className="mx-3 mt-2 p-2.5 rounded-xl bg-card/95 backdrop-blur-xl border border-primary/30 shadow-2xl flex items-center gap-2.5 z-20 relative">
                        <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Gift className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-foreground">🎁 Impero Roma</p>
                          <p className="text-[10px] text-muted-foreground">Sconto 20% nel tuo Wallet! Valido 7 giorni.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Category Tabs */}
                  <div className="flex gap-1.5 px-3 py-2.5 overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all ${
                          selectedCategory === cat
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border border-border/30 text-muted-foreground"
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Menu Items */}
                  <div className="px-3 space-y-2 pb-3">
                    {filteredMenu.map((item) => (
                      <motion.div key={item.id} layout
                        className="flex gap-2.5 p-2 rounded-xl bg-card border border-border/20 cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <img src={item.image} alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0 py-0.5">
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-[11px] font-semibold text-foreground leading-tight">{item.name}</p>
                            {item.popular && (
                              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[7px] font-bold flex-shrink-0">TOP</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <motion.span key={priceMultiplier + item.id} className="text-xs font-bold text-primary"
                              initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                              €{getAdjustedPrice(item.price).toFixed(2)}
                            </motion.span>
                            <button onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                              className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {priceMultiplier !== 0 && (
                            <span className="text-[9px] text-muted-foreground line-through">€{item.price.toFixed(2)}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Upsell */}
                  <AnimatePresence>
                    {showUpsell && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden px-3 pb-2">
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5">
                          <Coffee className="w-5 h-5 text-amber-400 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-[11px] font-bold text-foreground">Un caffè col dessert? ☕</p>
                            <p className="text-[10px] text-muted-foreground">Prosecco DOC — €{getAdjustedPrice(8).toFixed(2)}</p>
                          </div>
                          <button onClick={() => addToCart(demoMenu[11])}
                            className="px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold">
                            Aggiungi
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Quick Actions Bar */}
                  <div className="px-3 pb-2 grid grid-cols-3 gap-1.5">
                    <button onClick={() => setShowReservation(true)}
                      className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-card border border-border/20 text-center">
                      <CalendarDays className="w-4 h-4 text-primary" />
                      <span className="text-[9px] font-medium text-muted-foreground">Prenota</span>
                    </button>
                    <button onClick={() => setShowReview(true)}
                      className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-card border border-border/20 text-center">
                      <Star className="w-4 h-4 text-primary" />
                      <span className="text-[9px] font-medium text-muted-foreground">Recensione</span>
                    </button>
                    <button onClick={() => setShowChat(true)}
                      className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-card border border-border/20 text-center">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <span className="text-[9px] font-medium text-muted-foreground">Chat</span>
                    </button>
                  </div>

                  {/* Item Detail Sheet */}
                  <AnimatePresence>
                    {selectedItem && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-background" onClick={() => setSelectedItem(null)}>
                        <div onClick={e => e.stopPropagation()}>
                          <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-44 object-cover" />
                          <div className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <h3 className="text-base font-display font-bold text-foreground">{selectedItem.name}</h3>
                              <button onClick={() => setSelectedItem(null)} className="text-muted-foreground text-sm">✕</button>
                            </div>
                            <p className="text-xs text-muted-foreground">Ingredienti freschi di prima qualità, preparazione artigianale con materie prime italiane DOP.</p>
                            <div className="flex items-center justify-between">
                              <motion.span key={priceMultiplier} className="text-xl font-display font-bold text-primary"
                                initial={{ scale: 1.2 }} animate={{ scale: 1 }}>
                                €{getAdjustedPrice(selectedItem.price).toFixed(2)}
                              </motion.span>
                              <motion.button onClick={() => { addToCart(selectedItem); setSelectedItem(null); }}
                                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold"
                                whileTap={{ scale: 0.95 }}>
                                Aggiungi al Carrello
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reservation Sheet */}
                  <AnimatePresence>
                    {showReservation && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-background flex flex-col" onClick={() => setShowReservation(false)}>
                        <div className="p-4 space-y-4" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-display font-bold text-foreground">Prenota un Tavolo</h3>
                            <button onClick={() => setShowReservation(false)} className="text-muted-foreground">✕</button>
                          </div>
                          <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-card border border-border/30">
                              <p className="text-[10px] text-muted-foreground mb-1">Nome</p>
                              <p className="text-sm text-foreground">Marco Rossi</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-3 rounded-xl bg-card border border-border/30">
                                <p className="text-[10px] text-muted-foreground mb-1">Data</p>
                                <p className="text-sm text-foreground">Oggi</p>
                              </div>
                              <div className="p-3 rounded-xl bg-card border border-border/30">
                                <p className="text-[10px] text-muted-foreground mb-1">Ora</p>
                                <p className="text-sm text-foreground">20:30</p>
                              </div>
                            </div>
                            <div className="p-3 rounded-xl bg-card border border-border/30">
                              <p className="text-[10px] text-muted-foreground mb-1">Ospiti</p>
                              <p className="text-sm text-foreground">4 persone</p>
                            </div>
                            <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
                              Conferma Prenotazione
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Review Sheet */}
                  <AnimatePresence>
                    {showReview && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-background flex flex-col" onClick={() => setShowReview(false)}>
                        <div className="p-4 space-y-4" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-display font-bold text-foreground">Lascia una Recensione</h3>
                            <button onClick={() => setShowReview(false)} className="text-muted-foreground">✕</button>
                          </div>
                          <div className="flex justify-center gap-2 py-3">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className="w-8 h-8 text-primary fill-primary cursor-pointer" />
                            ))}
                          </div>
                          <p className="text-center text-xs text-muted-foreground">
                            Le recensioni ≤3 stelle restano private.<br />Solo ≥4 stelle vanno su Google.
                          </p>
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                            <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                            <p className="text-[10px] font-bold text-foreground">Review Shield™ Attivo</p>
                            <p className="text-[9px] text-muted-foreground">Protegge il rating del ristorante</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Chat Sheet */}
                  <AnimatePresence>
                    {showChat && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-background flex flex-col" onClick={() => setShowChat(false)}>
                        <div className="p-4 space-y-3 flex-1" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-display font-bold text-foreground">Chat con Impero Roma</h3>
                            <button onClick={() => setShowChat(false)} className="text-muted-foreground">✕</button>
                          </div>
                          <div className="space-y-2 flex-1">
                            <div className="p-2.5 rounded-xl bg-card border border-border/20 max-w-[80%]">
                              <p className="text-[11px] text-foreground">Benvenuto! Come possiamo aiutarti?</p>
                              <p className="text-[8px] text-muted-foreground mt-1">14:30</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 max-w-[80%] ml-auto">
                              <p className="text-[11px] text-foreground">Avete tavoli liberi per stasera?</p>
                              <p className="text-[8px] text-muted-foreground mt-1">14:31</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-card border border-border/20 max-w-[80%]">
                              <p className="text-[11px] text-foreground">Certo! Per quante persone? Posso prenotarle subito dal menù 🍽️</p>
                              <p className="text-[8px] text-muted-foreground mt-1">14:31</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 px-3 py-2 rounded-xl bg-card border border-border/30 text-xs text-muted-foreground">
                              Scrivi un messaggio...
                            </div>
                            <button className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                              <Send className="w-4 h-4 text-primary-foreground" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ===== ADMIN VIEW ===== */}
              {activeView === "admin" && (
                <div className="h-[560px] overflow-y-auto">
                  {/* Admin Header */}
                  <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/30 px-3 pt-7 pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-display font-bold text-foreground">Admin Dashboard</p>
                        <p className="text-[9px] text-muted-foreground">Impero Roma — Gestione Locale</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="relative">
                          <Bell className="w-4 h-4 text-foreground" />
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 text-white text-[7px] font-bold flex items-center justify-center">3</span>
                        </div>
                      </div>
                    </div>
                    {/* Admin Sub-tabs */}
                    <div className="flex gap-1 mt-2 overflow-x-auto no-scrollbar">
                      {([
                        { id: "overview" as const, label: "Overview", icon: <BarChart3 className="w-3 h-3" /> },
                        { id: "menu" as const, label: "Menu", icon: <Utensils className="w-3 h-3" /> },
                        { id: "orders" as const, label: "Ordini", icon: <Package className="w-3 h-3" /> },
                        { id: "tables" as const, label: "Tavoli", icon: <Layers className="w-3 h-3" /> },
                        { id: "settings" as const, label: "Studio", icon: <Sparkles className="w-3 h-3" /> },
                      ]).map(t => (
                        <button key={t.id} onClick={() => setAdminTab(t.id)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold whitespace-nowrap transition-all ${
                            adminTab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                          }`}>
                          {t.icon} {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-3 py-3 space-y-3">
                    {/* ---- OVERVIEW TAB ---- */}
                    {adminTab === "overview" && (
                      <>
                        {/* KPIs */}
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { label: "Incasso Oggi", value: `€${demoStats.todayRevenue.toFixed(0)}`, icon: <DollarSign className="w-4 h-4" />, color: "text-primary" },
                            { label: "Ordini Oggi", value: demoStats.todayOrders.toString(), icon: <ShoppingCart className="w-4 h-4" />, color: "text-emerald-400" },
                            { label: "Ordini Attivi", value: demoStats.activeOrders.toString(), icon: <Clock className="w-4 h-4" />, color: "text-amber-400" },
                            { label: "Rating Medio", value: `${demoStats.avgRating} ★`, icon: <Star className="w-4 h-4" />, color: "text-primary" },
                          ].map((s, i) => (
                            <div key={i} className="p-3 rounded-xl bg-card border border-border/30">
                              <div className={`${s.color} mb-1`}>{s.icon}</div>
                              <p className="text-lg font-display font-bold text-foreground">{s.value}</p>
                              <p className="text-[9px] text-muted-foreground">{s.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* Panic Mode */}
                        <div className="p-3 rounded-xl bg-card border border-border/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-amber-400" />
                              <span className="text-xs font-bold text-foreground">Panic Mode</span>
                            </div>
                            <span className={`text-sm font-bold ${priceMultiplier > 0 ? "text-emerald-400" : priceMultiplier < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                              {priceMultiplier > 0 ? "+" : ""}{priceMultiplier}%
                            </span>
                          </div>
                          <Slider
                            value={[priceMultiplier]}
                            onValueChange={([v]) => { setPriceMultiplier(v); if (!activeProfitCard) setActiveProfitCard("panic"); }}
                            min={-30} max={30} step={1}
                          />
                          <p className="text-[9px] text-muted-foreground text-center">
                            Muovi lo slider → i prezzi cambiano <span className="text-primary font-bold">in tempo reale</span> nell'App Cliente
                          </p>
                        </div>

                        {/* AI-Mary */}
                        <button onClick={() => setActiveProfitCard("ai-mary")}
                          className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                          <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-40" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="text-xs font-bold text-foreground">AI-Mary: Fisco 2026 ✓</span>
                            <p className="text-[9px] text-muted-foreground">Registratore collegato, conforme.</p>
                          </div>
                          <Shield className="w-4 h-4 text-emerald-400" />
                        </button>

                        {/* Wallet Push */}
                        <button onClick={() => { setShowWalletPush(true); setActiveProfitCard("wallet"); setTimeout(() => setShowWalletPush(false), 4000); }}
                          className="w-full py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold flex items-center justify-center gap-2">
                          <Wallet className="w-4 h-4" /> Invia Push Wallet ai Clienti
                        </button>

                        {/* Quick stats */}
                        <div className="p-3 rounded-xl bg-card border border-border/30 space-y-2">
                          <h4 className="text-xs font-bold text-foreground">Oggi in Sintesi</h4>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground">Prenotazioni oggi</span>
                            <span className="font-bold text-foreground">{demoStats.reservationsToday}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground">Piatti nel menu</span>
                            <span className="font-bold text-foreground">{demoStats.menuItems}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground">Clienti ritornati (wallet)</span>
                            <span className="font-bold text-emerald-400">+12 questa settimana</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* ---- MENU TAB ---- */}
                    {adminTab === "menu" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-foreground">Gestione Menu</h4>
                          <button className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Aggiungi
                          </button>
                        </div>
                        {demoMenu.slice(0, 8).map(item => (
                          <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border/20">
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-semibold text-foreground truncate">{item.name}</p>
                              <p className="text-[9px] text-muted-foreground">{item.category}</p>
                            </div>
                            <span className="text-[10px] font-bold text-primary">€{getAdjustedPrice(item.price).toFixed(2)}</span>
                            <div className="w-7 h-4 rounded-full bg-emerald-400/20 flex items-center justify-end px-0.5">
                              <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ---- ORDERS TAB ---- */}
                    {adminTab === "orders" && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-foreground">Ordini in Tempo Reale</h4>
                        {kitchenOrders.length === 0 && (
                          <div className="py-8 text-center">
                            <Package className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">Vai nell'App Cliente, ordina, e l'ordine apparirà qui!</p>
                          </div>
                        )}
                        {/* Show demo + real orders */}
                        {[
                          { id: "demo-1", items: [{ name: "Cacio e Pepe", qty: 2, image: dishCacioPepe }, { name: "Tiramisù", qty: 1, image: dishTiramisu }], table: 4, time: "13:45", status: "preparing" as const, orderType: "Tavolo", customerName: "Laura B." },
                          { id: "demo-2", items: [{ name: "Margherita DOP", qty: 1, image: dishPizza }, { name: "Prosecco", qty: 2, image: dishProsecco }], table: 2, time: "13:38", status: "ready" as const, orderType: "Takeaway", customerName: "Andrea M." },
                          ...kitchenOrders,
                        ].map(order => (
                          <div key={order.id} className={`p-2.5 rounded-xl border ${
                            order.status === "new" ? "bg-red-500/5 border-red-500/20" :
                            order.status === "preparing" ? "bg-amber-500/5 border-amber-500/20" :
                            order.status === "ready" ? "bg-emerald-500/5 border-emerald-500/20" :
                            "bg-card border-border/20"
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-foreground">{order.customerName} · Tav.{order.table}</span>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                                order.status === "new" ? "bg-red-500/20 text-red-400" :
                                order.status === "preparing" ? "bg-amber-500/20 text-amber-400" :
                                order.status === "ready" ? "bg-emerald-500/20 text-emerald-400" :
                                "bg-muted text-muted-foreground"
                              }`}>{
                                order.status === "new" ? "NUOVO" :
                                order.status === "preparing" ? "IN PREP." :
                                order.status === "ready" ? "PRONTO" : "CONSEGNATO"
                              }</span>
                            </div>
                            <div className="space-y-0.5">
                              {order.items.map((item, i) => (
                                <p key={i} className="text-[9px] text-muted-foreground">{item.qty}x {item.name}</p>
                              ))}
                            </div>
                            <p className="text-[8px] text-muted-foreground mt-1">{order.time} · {order.orderType}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ---- TABLES TAB ---- */}
                    {adminTab === "tables" && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-foreground">Mappa Tavoli</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(tableStatuses).map(([num, status]) => (
                            <button key={num}
                              onClick={() => setTableStatuses(prev => ({
                                ...prev,
                                [num]: status === "free" ? "occupied" : status === "occupied" ? "calling" : "free"
                              }))}
                              className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border text-center transition-all ${
                                status === "free" ? "bg-emerald-500/10 border-emerald-500/20" :
                                status === "occupied" ? "bg-amber-500/10 border-amber-500/20" :
                                "bg-red-500/10 border-red-500/20 animate-pulse"
                              }`}>
                              <span className="text-sm font-bold text-foreground">{num}</span>
                              <span className={`text-[7px] font-bold ${
                                status === "free" ? "text-emerald-400" :
                                status === "occupied" ? "text-amber-400" :
                                "text-red-400"
                              }`}>
                                {status === "free" ? "LIBERO" : status === "occupied" ? "OCCUPATO" : "🔔 CHIAMA"}
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-3 justify-center">
                          {[
                            { color: "bg-emerald-400", label: "Libero" },
                            { color: "bg-amber-400", label: "Occupato" },
                            { color: "bg-red-400", label: "Chiamata" },
                          ].map(l => (
                            <div key={l.label} className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${l.color}`} />
                              <span className="text-[8px] text-muted-foreground">{l.label}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-[9px] text-muted-foreground text-center">Tocca un tavolo per cambiare stato</p>
                      </div>
                    )}

                    {/* ---- SETTINGS / STUDIO TAB ---- */}
                    {adminTab === "settings" && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-foreground">Design Studio</h4>
                        <div className="p-3 rounded-xl bg-card border border-border/30 space-y-2">
                          <p className="text-[10px] font-semibold text-foreground">Colore Brand</p>
                          <div className="flex gap-2">
                            {["#C8922A", "#E74C3C", "#2ECC71", "#3498DB", "#9B59B6", "#1A1A2E"].map(c => (
                              <div key={c} className="w-7 h-7 rounded-full border-2 border-border/30 cursor-pointer"
                                style={{ backgroundColor: c }} />
                            ))}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-card border border-border/30 space-y-2">
                          <p className="text-[10px] font-semibold text-foreground">QR Code Menu</p>
                          <div className="w-24 h-24 mx-auto bg-foreground/5 rounded-xl flex items-center justify-center">
                            <QrCode className="w-12 h-12 text-foreground/20" />
                          </div>
                          <p className="text-[9px] text-muted-foreground text-center">Scarica e stampa per ogni tavolo</p>
                        </div>
                        <div className="p-3 rounded-xl bg-card border border-border/30 space-y-1">
                          <p className="text-[10px] font-semibold text-foreground">Orari di Apertura</p>
                          {["Lun-Ven: 12:00-15:00 · 19:00-23:30", "Sabato: 12:00-24:00", "Domenica: Chiuso"].map((h, i) => (
                            <p key={i} className="text-[9px] text-muted-foreground">{h}</p>
                          ))}
                        </div>
                        <div className="p-3 rounded-xl bg-card border border-border/30 flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-[10px] font-semibold text-foreground">Contatti</p>
                            <p className="text-[9px] text-muted-foreground">+39 06 1234567 · info@impero.it</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===== KITCHEN VIEW ===== */}
              {activeView === "kitchen" && (
                <div className="h-[560px] overflow-y-auto">
                  {/* Kitchen Header */}
                  <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/30 px-3 pt-7 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ChefHat className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-display font-bold text-foreground">Kitchen View</p>
                          <p className="text-[9px] text-muted-foreground">Impero Roma — Cucina</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold flex items-center gap-1">
                          <CircleDot className="w-2.5 h-2.5" /> LIVE
                        </div>
                      </div>
                    </div>
                    {/* Kitchen Stats */}
                    <div className="flex gap-2 mt-2">
                      {[
                        { label: "Nuovi", count: kitchenOrders.filter(o => o.status === "new").length + 1, color: "bg-red-500/10 text-red-400 border-red-500/20" },
                        { label: "In Prep.", count: kitchenOrders.filter(o => o.status === "preparing").length + 2, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                        { label: "Pronti", count: kitchenOrders.filter(o => o.status === "ready").length + 1, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                      ].map(s => (
                        <div key={s.label} className={`flex-1 py-1.5 rounded-lg border text-center ${s.color}`}>
                          <p className="text-base font-bold">{s.count}</p>
                          <p className="text-[8px] font-semibold">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-3 py-3 space-y-2">
                    {/* Demo orders + real orders */}
                    {[
                      { id: "k-demo-1", items: [{ name: "Tagliatelle al Tartufo", qty: 1, image: dishPasta }, { name: "Bruschetta Classica", qty: 2, image: dishBruschetta }], table: 5, time: "14:02", status: "new" as const, orderType: "Tavolo", customerName: "Sofia G." },
                      { id: "k-demo-2", items: [{ name: "Ribeye alla Griglia", qty: 1, image: dishSteak }, { name: "Risotto Zafferano", qty: 1, image: dishRisotto }], table: 3, time: "13:55", status: "preparing" as const, orderType: "Tavolo", customerName: "Paolo V." },
                      { id: "k-demo-3", items: [{ name: "Diavola Infernale", qty: 2, image: dishDiavola }], table: 7, time: "13:48", status: "preparing" as const, orderType: "Delivery", customerName: "Giulia T." },
                      { id: "k-demo-4", items: [{ name: "Cacio e Pepe", qty: 3, image: dishCacioPepe }, { name: "Prosecco DOC", qty: 3, image: dishProsecco }], table: 1, time: "13:40", status: "ready" as const, orderType: "Tavolo", customerName: "Gruppo Aziendale" },
                      ...kitchenOrders,
                    ].sort((a, b) => {
                      const order = { new: 0, preparing: 1, ready: 2, delivered: 3 };
                      return order[a.status] - order[b.status];
                    }).map(order => (
                      <motion.div key={order.id}
                        layout
                        initial={order.id.startsWith("k-demo") ? undefined : { opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-xl border ${
                          order.status === "new" ? "bg-red-500/5 border-red-500/25 shadow-sm shadow-red-500/10" :
                          order.status === "preparing" ? "bg-amber-500/5 border-amber-500/20" :
                          order.status === "ready" ? "bg-emerald-500/5 border-emerald-500/20" :
                          "bg-muted/30 border-border/20 opacity-50"
                        }`}>
                        {/* Order Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {order.status === "new" && (
                              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                                <Volume2 className="w-4 h-4 text-red-400" />
                              </motion.div>
                            )}
                            <span className="text-xs font-bold text-foreground">{order.customerName}</span>
                            <span className="text-[8px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">Tav.{order.table}</span>
                          </div>
                          <span className="text-[8px] text-muted-foreground">{order.time}</span>
                        </div>

                        {/* Items */}
                        <div className="space-y-1.5 mb-2.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                              <span className="text-[11px] text-foreground font-medium">{item.qty}x {item.name}</span>
                            </div>
                          ))}
                        </div>

                        {/* Status buttons */}
                        <div className="flex gap-1.5">
                          {order.status === "new" && (
                            <button onClick={() => updateOrderStatus(order.id, "preparing")}
                              className="flex-1 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center gap-1">
                              <CookingPot className="w-3.5 h-3.5" /> In Preparazione
                            </button>
                          )}
                          {order.status === "preparing" && (
                            <button onClick={() => updateOrderStatus(order.id, "ready")}
                              className="flex-1 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Pronto!
                            </button>
                          )}
                          {order.status === "ready" && (
                            <button onClick={() => updateOrderStatus(order.id, "delivered")}
                              className="flex-1 py-2 rounded-lg bg-muted text-muted-foreground text-[10px] font-bold flex items-center justify-center gap-1">
                              <UserCheck className="w-3.5 h-3.5" /> Consegnato
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Floating Cart Button (Customer view) */}
              {activeView === "customer" && cartCount > 0 && !selectedItem && !showReservation && !showReview && !showChat && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute bottom-3 left-3 right-3 z-20"
                >
                  <button onClick={placeOrder}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
                    <ShoppingCart className="w-4 h-4" />
                    Ordina · €{cartTotal.toFixed(2)} ({cartCount} {cartCount === 1 ? "piatto" : "piatti"})
                  </button>
                </motion.div>
              )}

              {/* Home bar */}
              <div className="absolute bottom-0 left-0 right-0 h-5 flex justify-center items-center bg-background/80 backdrop-blur-sm z-10">
                <div className="w-20 h-1 rounded-full bg-foreground/15" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Explanation */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-primary/5 to-amber-500/5 border border-primary/10 text-center">
        <p className="text-[10px] text-muted-foreground">
          <Zap className="w-3 h-3 inline text-primary mr-1" />
          <span className="font-bold text-foreground">Sincronizzazione Reale:</span> Cambia prezzo in Admin → si aggiorna nell'App Cliente. Ordina nell'App → arriva in Cucina.
        </p>
      </div>

      {/* Guided Demo Overlay */}
      <GuidedDemoOverlay
        active={guidedMode}
        onClose={() => setGuidedMode(false)}
        onStepChange={(id) => setGuidedStepId(id)}
      />
    </motion.div>
  );
};

export default PartnerSandbox;
