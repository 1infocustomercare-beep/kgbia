import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Slider,
} from "@/components/ui/slider";
import {
  AlertTriangle, Shield, Sparkles, ShoppingCart,
  Plus, Minus, Bell, Info, Coffee, Wallet, TrendingUp, Gift
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  { id: "9", name: "Smoothie Bowl Tropicale", price: 11.00, category: "Bevande", image: "🥤", popular: false },
  { id: "10", name: "Focaccia Gourmet Burrata", price: 15.50, category: "Pranzo", image: "🫓", popular: true },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

const PartnerSandbox = () => {
  const [priceMultiplier, setPriceMultiplier] = useState(0); // -30 to +30 percent
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showWalletPush, setShowWalletPush] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [roiTipIndex, setRoiTipIndex] = useState(0);

  const roiTips = [
    { emoji: "💰", text: "Con €2.997 risparmi €30.000+/anno" },
    { emoji: "📊", text: "ROI in meno di 2 mesi" },
    { emoji: "🚫", text: "Zero canoni mensili — è TUO" },
    { emoji: "⚡", text: "2% vs 30% — risparmi il 93%" },
  ];

  useEffect(() => {
    const t = setInterval(() => setRoiTipIndex(p => (p + 1) % roiTips.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Check for dessert → suggest coffee
  useEffect(() => {
    const hasDessert = cart.some(i => ["3", "7"].includes(i.id));
    const hasCoffee = cart.some(i => i.id === "4");
    setShowUpsell(hasDessert && !hasCoffee);
  }, [cart]);

  const getAdjustedPrice = (base: number) => {
    return Math.max(0.5, base * (1 + priceMultiplier / 100));
  };

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

  const salesInfoCards = [
    { feature: "Panic Mode", icon: <AlertTriangle className="w-4 h-4" />, tip: "Massimizza i profitti durante i picchi di lavoro senza cambiare i menù cartacei." },
    { feature: "AI-Mary Fisco", icon: <Shield className="w-4 h-4" />, tip: "Evita multe salate e automatizza la burocrazia del 2026." },
    { feature: "Smart Upselling", icon: <TrendingUp className="w-4 h-4" />, tip: "Aumenta lo scontrino medio del 22% con suggerimenti automatici." },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-foreground">Sales Sandbox</h2>
        <span className="text-xs text-primary font-medium">Modalità Demo</span>
      </div>

      {/* ROI Tip Overlay */}
      <AnimatePresence mode="wait">
        <motion.div key={roiTipIndex} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
          className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20 flex items-center gap-3">
          <span className="text-2xl">{roiTips[roiTipIndex].emoji}</span>
          <p className="text-sm font-medium text-foreground flex-1">{roiTips[roiTipIndex].text}</p>
          <span className="text-[10px] text-muted-foreground">ROI</span>
        </motion.div>
      </AnimatePresence>

      {/* ============ ADMIN COCKPIT ============ */}
      <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Admin Cockpit</h3>
        </div>

        {/* Panic Mode Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-foreground">Panic Mode</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[220px] text-xs">
                  {salesInfoCards[0].tip}
                </TooltipContent>
              </Tooltip>
            </div>
            <span className={`text-sm font-bold ${priceMultiplier > 0 ? "text-emerald-400" : priceMultiplier < 0 ? "text-red-400" : "text-muted-foreground"}`}>
              {priceMultiplier > 0 ? "+" : ""}{priceMultiplier}%
            </span>
          </div>
          <Slider
            value={[priceMultiplier]}
            onValueChange={([v]) => setPriceMultiplier(v)}
            min={-30}
            max={30}
            step={1}
            className="w-full"
          />
          <p className="text-[10px] text-muted-foreground text-center">Trascina per modificare i prezzi in tempo reale ↕</p>
        </div>

        {/* AI-Mary Status */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-50" />
            </div>
            <div>
              <span className="text-xs font-bold text-foreground">AI-Mary: Fisco 2026 Protetto</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help inline ml-1.5" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[220px] text-xs">
                  {salesInfoCards[1].tip}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Shield className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Wallet Push Simulation */}
        <button onClick={() => { setShowWalletPush(true); setTimeout(() => setShowWalletPush(false), 4000); }}
          className="w-full py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-semibold tracking-wider uppercase hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
          <Wallet className="w-4 h-4" /> Simula Push Wallet
        </button>
      </div>

      {/* ============ IPHONE MOCKUP ============ */}
      <div className="relative mx-auto" style={{ maxWidth: 320 }}>
        {/* Phone frame */}
        <div className="rounded-[2.5rem] border-[6px] border-foreground/10 bg-background overflow-hidden shadow-2xl">
          {/* Notch */}
          <div className="h-7 bg-background flex justify-center items-end pb-0.5">
            <div className="w-24 h-5 rounded-b-2xl bg-foreground/10" />
          </div>

          {/* Wallet Push Notification Overlay */}
          <AnimatePresence>
            {showWalletPush && (
              <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }}
                className="absolute top-8 left-3 right-3 z-20 p-3 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground">Empire Bakery Gourmet</p>
                  <p className="text-[11px] text-muted-foreground">Un regalo per te! Sconto 20% nel tuo Wallet. 🎁</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* App Content */}
          <div className="px-4 py-3 space-y-3 max-h-[500px] overflow-y-auto">
            {/* Mini Header */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-display font-bold text-foreground">Empire Bakery Gourmet</h4>
                <p className="text-[10px] text-muted-foreground">Premium Artisan Bakery</p>
              </div>
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {cart.reduce((s, i) => s + i.qty, 0)}
                  </span>
                )}
              </div>
            </div>

            {/* Menu Items */}
            {bakeryMenu.map((item) => (
              <motion.div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/30"
                layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                <span className="text-2xl flex-shrink-0">{item.image}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                  <div className="flex items-center gap-2">
                    <motion.p key={priceMultiplier} className="text-xs font-bold text-primary"
                      initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      €{getAdjustedPrice(item.price).toFixed(2)}
                    </motion.p>
                    {priceMultiplier !== 0 && (
                      <span className="text-[10px] text-muted-foreground line-through">€{item.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </motion.div>
            ))}

            {/* Cart */}
            {cart.length > 0 && (
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5" /> Carrello
                </p>
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{item.image} {item.name}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(item.id)} className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-foreground font-medium">{item.qty}</span>
                      <button onClick={() => addToCart(bakeryMenu.find(m => m.id === item.id)!)} className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-primary w-14 text-right">€{(getAdjustedPrice(item.price) * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                ))}

                {/* Upsell */}
                <AnimatePresence>
                  {showUpsell && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-foreground">Aggiungi un Caffè Arabica?</p>
                          <p className="text-[9px] text-muted-foreground">Perfetto con il dessert — €{getAdjustedPrice(4.50).toFixed(2)}</p>
                        </div>
                        <button onClick={() => addToCart(bakeryMenu[3])} className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-bold">
                          +Aggiungi
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <span className="text-xs font-bold text-foreground">Totale</span>
                  <motion.span key={cartTotal} className="text-sm font-bold text-primary" initial={{ scale: 1.15 }} animate={{ scale: 1 }}>
                    €{cartTotal.toFixed(2)}
                  </motion.span>
                </div>
              </div>
            )}
          </div>

          {/* Home indicator */}
          <div className="h-5 flex justify-center items-center">
            <div className="w-28 h-1 rounded-full bg-foreground/20" />
          </div>
        </div>
      </div>

      {/* Sales Info Cards */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Punti Vendita Chiave</h3>
        {salesInfoCards.map((card, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{card.icon}</div>
            <div>
              <p className="text-xs font-bold text-foreground">{card.feature}</p>
              <p className="text-[11px] text-muted-foreground">{card.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PartnerSandbox;
