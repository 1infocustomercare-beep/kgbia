import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import {
  AlertTriangle, Shield, Sparkles, ShoppingCart,
  Plus, Minus, Bell, Coffee, Wallet, TrendingUp, Gift,
  Eye, Compass, ChefHat, Volume2
} from "lucide-react";
import GuidedDemoOverlay from "./GuidedDemoOverlay";

// Demo bakery menu data
const bakeryMenu = [
  { id: "1", name: "Croissant al Pistacchio Oro", price: 8.50, category: "Pasticceria", image: "🥐", popular: true },
  { id: "2", name: "Sourdough Pastrami Sandwich", price: 18.00, category: "Pranzo", image: "🥪", popular: true },
  { id: "3", name: "Tiramisù Artigianale", price: 9.00, category: "Dolci", image: "🍰", popular: false },
  { id: "4", name: "Caffè Arabica Selection", price: 4.50, category: "Bevande", image: "☕", popular: false },
  { id: "5", name: "Pain au Chocolat Premium", price: 7.00, category: "Pasticceria", image: "🍫", popular: true },
  { id: "6", name: "Avocado Toast Deluxe", price: 14.00, category: "Pranzo", image: "🥑", popular: false },
  { id: "7", name: "Cheesecake al Passion Fruit", price: 10.00, category: "Dolci", image: "🍋", popular: false },
  { id: "8", name: "Brioche al Tartufo Nero", price: 12.00, category: "Pasticceria", image: "🍄", popular: true },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

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
  const [activeView, setActiveView] = useState<"split" | "customer" | "admin">("split");
  const [activeProfitCard, setActiveProfitCard] = useState<string | null>(null);
  const [kitchenOrder, setKitchenOrder] = useState<{ items: string[]; time: string } | null>(null);
  const [guidedStepId, setGuidedStepId] = useState<string | null>(null);

  // Check for dessert → suggest coffee
  useEffect(() => {
    const hasDessert = cart.some(i => ["3", "7"].includes(i.id));
    const hasCoffee = cart.some(i => i.id === "4");
    setShowUpsell(hasDessert && !hasCoffee);
  }, [cart]);

  // Auto-show profit cards based on guided step
  useEffect(() => {
    if (guidedStepId === "panic") setActiveProfitCard("panic");
    else if (guidedStepId === "shield") setActiveProfitCard("ai-mary");
    else if (guidedStepId === "wallet") setActiveProfitCard("wallet");
    else setActiveProfitCard(null);
  }, [guidedStepId]);

  const getAdjustedPrice = (base: number) => Math.max(0.5, base * (1 + priceMultiplier / 100));

  const addToCart = (item: typeof bakeryMenu[0]) => {
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

  const simulateOrder = () => {
    const items = cart.map(c => `${c.image} ${c.name} x${c.qty}`);
    setKitchenOrder({ items, time: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) });
    setTimeout(() => setKitchenOrder(null), 6000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
      {/* Header with Guided Demo Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-foreground">Sales Sandbox</h2>
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

      {/* View Switcher */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/30 border border-border/30">
        {([
          { id: "split", label: "Split View", icon: <Eye className="w-3.5 h-3.5" /> },
          { id: "admin", label: "Admin", icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: "customer", label: "Cliente", icon: <ShoppingCart className="w-3.5 h-3.5" /> },
        ] as const).map(v => (
          <button key={v.id} onClick={() => setActiveView(v.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-semibold transition-all ${
              activeView === v.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}>
            {v.icon} {v.label}
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
            className="p-3.5 rounded-xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/25 shadow-lg shadow-primary/5"
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

      {/* ============ SPLIT / DUAL VIEW ============ */}
      <div className={`${activeView === "split" ? "grid grid-cols-2 gap-2" : ""}`}>
        
        {/* ADMIN PANEL */}
        {(activeView === "split" || activeView === "admin") && (
          <div className={`p-3 rounded-2xl bg-card border border-border/50 space-y-3 ${activeView === "split" ? "text-[10px]" : ""}`}>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className={`font-bold text-foreground ${activeView === "split" ? "text-[10px]" : "text-sm"}`}>Admin Cockpit</span>
            </div>

            {/* Panic Mode */}
            <div className="space-y-1.5" data-section="panic-mode">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-semibold text-foreground">Panic Mode</span>
                </div>
                <span className={`text-xs font-bold ${priceMultiplier > 0 ? "text-emerald-400" : priceMultiplier < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                  {priceMultiplier > 0 ? "+" : ""}{priceMultiplier}%
                </span>
              </div>
              <Slider
                value={[priceMultiplier]}
                onValueChange={([v]) => { setPriceMultiplier(v); if (!activeProfitCard) setActiveProfitCard("panic"); }}
                min={-30} max={30} step={1}
                className="w-full"
              />
            </div>

            {/* AI-Mary */}
            <button
              onClick={() => setActiveProfitCard("ai-mary")}
              className="w-full flex items-center gap-2 p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
              data-section="ai-mary"
            >
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-50" />
              </div>
              <span className="text-[10px] font-bold text-foreground flex-1 text-left">AI-Mary: Fisco OK</span>
              <Shield className="w-3 h-3 text-emerald-400" />
            </button>

            {/* Wallet Push */}
            <button
              onClick={() => { setShowWalletPush(true); setActiveProfitCard("wallet"); setTimeout(() => setShowWalletPush(false), 4000); }}
              className="w-full py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-[10px] font-semibold flex items-center justify-center gap-1.5"
              data-section="wallet-push"
            >
              <Wallet className="w-3.5 h-3.5" /> Push Wallet
            </button>

            {/* Send to Kitchen CTA */}
            {cart.length > 0 && (
              <motion.button
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                onClick={simulateOrder}
                className="w-full py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold flex items-center justify-center gap-1.5"
              >
                <ChefHat className="w-3.5 h-3.5" /> Invia in Cucina
              </motion.button>
            )}
          </div>
        )}

        {/* CUSTOMER PWA */}
        {(activeView === "split" || activeView === "customer") && (
          <div className={`rounded-2xl border border-foreground/10 bg-background overflow-hidden shadow-xl ${activeView === "customer" ? "mx-auto max-w-[320px]" : ""}`}
            data-section="customer-pwa">
            {/* Mini notch */}
            <div className="h-5 bg-background flex justify-center items-end pb-0.5">
              <div className="w-16 h-3 rounded-b-xl bg-foreground/10" />
            </div>

            {/* Wallet Push Overlay */}
            <AnimatePresence>
              {showWalletPush && (
                <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}
                  className="mx-2 mb-2 p-2.5 rounded-xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl flex items-center gap-2 z-20 relative">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-foreground">Empire Bakery</p>
                    <p className="text-[9px] text-muted-foreground">Sconto 20% nel tuo Wallet 🎁</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* App Content */}
            <div className="px-2.5 py-2 space-y-1.5 max-h-[400px] overflow-y-auto">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-[11px] font-display font-bold text-foreground">Empire Bakery Gourmet</p>
                  <p className="text-[8px] text-muted-foreground">Premium Artisan Bakery</p>
                </div>
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 text-foreground" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground text-[7px] font-bold flex items-center justify-center">
                      {cart.reduce((s, i) => s + i.qty, 0)}
                    </span>
                  )}
                </div>
              </div>

              {bakeryMenu.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border/20">
                  <span className="text-lg flex-shrink-0">{item.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-foreground truncate">{item.name}</p>
                    <div className="flex items-center gap-1">
                      <motion.span key={priceMultiplier} className="text-[10px] font-bold text-primary"
                        initial={{ scale: 1.3, color: "hsl(var(--primary))" }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}>
                        €{getAdjustedPrice(item.price).toFixed(2)}
                      </motion.span>
                      {priceMultiplier !== 0 && (
                        <span className="text-[8px] text-muted-foreground line-through">€{item.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => addToCart(item)} className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Cart */}
              {cart.length > 0 && (
                <div className="p-2 rounded-lg bg-primary/5 border border-primary/15 space-y-1">
                  <p className="text-[10px] font-bold text-foreground flex items-center gap-1">
                    <ShoppingCart className="w-3 h-3" /> Carrello
                  </p>
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-[9px]">
                      <span className="text-foreground truncate max-w-[100px]">{item.image} {item.name}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => removeFromCart(item.id)} className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                          <Minus className="w-2 h-2" />
                        </button>
                        <span className="text-foreground font-medium w-3 text-center">{item.qty}</span>
                        <button onClick={() => addToCart(bakeryMenu.find(m => m.id === item.id)!)} className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <Plus className="w-2 h-2" />
                        </button>
                        <span className="font-bold text-primary w-10 text-right">€{(getAdjustedPrice(item.price) * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}

                  {/* Upsell */}
                  <AnimatePresence>
                    {showUpsell && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="p-2 rounded-md bg-amber-500/10 border border-amber-500/15 flex items-center gap-1.5">
                          <Coffee className="w-3 h-3 text-amber-400 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-[9px] font-bold text-foreground">+ Caffè Arabica?</p>
                            <p className="text-[8px] text-muted-foreground">€{getAdjustedPrice(4.50).toFixed(2)}</p>
                          </div>
                          <button onClick={() => addToCart(bakeryMenu[3])} className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[8px] font-bold">
                            +
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between pt-1 border-t border-border/20">
                    <span className="text-[10px] font-bold text-foreground">Totale</span>
                    <motion.span key={cartTotal} className="text-xs font-bold text-primary" initial={{ scale: 1.15 }} animate={{ scale: 1 }}>
                      €{cartTotal.toFixed(2)}
                    </motion.span>
                  </div>
                </div>
              )}
            </div>

            {/* Home bar */}
            <div className="h-4 flex justify-center items-center">
              <div className="w-20 h-0.5 rounded-full bg-foreground/15" />
            </div>
          </div>
        )}
      </div>

      {/* ============ KITCHEN SIMULATION ============ */}
      <AnimatePresence>
        {kitchenOrder && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <motion.div className="absolute inset-0" animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}>
                  <Volume2 className="w-4 h-4 text-amber-400" />
                </motion.div>
              </div>
              <span className="text-xs font-bold text-foreground">🍳 Kitchen View — Nuovo Ordine!</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{kitchenOrder.time}</span>
            </div>
            {kitchenOrder.items.map((item, i) => (
              <p key={i} className="text-[11px] text-foreground pl-6">{item}</p>
            ))}
            <div className="flex gap-2 pl-6">
              <button className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-[10px] font-semibold">In Preparazione</button>
              <button className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">Pronto</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
