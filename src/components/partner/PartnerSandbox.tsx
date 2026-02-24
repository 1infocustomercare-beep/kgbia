import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import {
  AlertTriangle, Shield, Sparkles, ShoppingCart,
  Plus, Minus, Coffee, Wallet, Gift,
  Eye, Compass, ChefHat, Volume2, VolumeX, Star,
  TrendingUp, DollarSign, Users, CalendarDays,
  MessageSquare, Bell, QrCode, Utensils, MapPin,
  Clock, Check, Package, Send, BarChart3,
  Smartphone, Monitor, CookingPot, UserCheck,
  CircleDot, Phone, Mail, Zap, Layers,
  ImagePlus, Type, X, Palette, Lock, ShieldBan,
  GraduationCap, Settings, Bot, Camera, Wand2,
  Globe, Languages, Printer, Power, ExternalLink,
  UserX, ChevronDown, Search, Heart, Share2,
  Key, Save, Edit, Trash2, Image as ImageIcon,
  Upload, Move, Download
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
import dishTagliere from "@/assets/dish-tagliere.jpg";
import dishCarpaccio from "@/assets/dish-carpaccio.jpg";
import dishPannaCotta from "@/assets/dish-panna-cotta.jpg";
import heroVideo from "@/assets/hero-restaurant.mp4";
import storyInterior from "@/assets/story-interior.jpg";
import storyPasta from "@/assets/story-pasta.jpg";
import storyWine from "@/assets/story-wine.jpg";
import storyDish from "@/assets/story-dish.jpg";

// Demo menu with real images
const demoMenu = [
  { id: "1", name: "Bruschetta Classica", price: 8.50, category: "Antipasti", image: dishBruschetta, popular: true, description: "Pane croccante con pomodorini, basilico fresco e olio EVO" },
  { id: "2", name: "Burrata Pugliese", price: 14.00, category: "Antipasti", image: dishBurrata, popular: true, description: "Burrata DOP su letto di rucola con pomodorini confit" },
  { id: "13", name: "Carpaccio di Manzo", price: 16.00, category: "Antipasti", image: dishCarpaccio, popular: false, description: "Manzo piemontese con rucola, parmigiano e tartufo" },
  { id: "14", name: "Tagliere Misto", price: 22.00, category: "Antipasti", image: dishTagliere, popular: false, description: "Selezione di salumi e formaggi con miele e mostarda" },
  { id: "3", name: "Tagliatelle al Tartufo", price: 22.00, category: "Primi", image: dishPasta, popular: true, description: "Pasta fresca all'uovo con tartufo nero pregiato" },
  { id: "4", name: "Risotto allo Zafferano", price: 20.00, category: "Primi", image: dishRisotto, popular: false, description: "Riso Carnaroli mantecato con zafferano iraniano" },
  { id: "5", name: "Cacio e Pepe", price: 16.00, category: "Primi", image: dishCacioPepe, popular: true, description: "Tonnarelli con pecorino romano DOP e pepe nero" },
  { id: "6", name: "Margherita DOP", price: 14.00, category: "Pizze", image: dishPizza, popular: false, description: "Mozzarella di bufala, pomodoro San Marzano, basilico" },
  { id: "7", name: "Diavola Infernale", price: 16.00, category: "Pizze", image: dishDiavola, popular: true, description: "Salame piccante, nduja calabrese, peperoncino fresco" },
  { id: "8", name: "Ribeye alla Griglia", price: 38.00, category: "Secondi", image: dishSteak, popular: true, description: "Ribeye Angus 300g con verdure grigliate e salsa chimichurri" },
  { id: "9", name: "Branzino al Sale", price: 32.00, category: "Secondi", image: dishBranzino, popular: false, description: "Branzino selvaggio in crosta di sale con erbe aromatiche" },
  { id: "10", name: "Tiramisù della Nonna", price: 10.00, category: "Dolci", image: dishTiramisu, popular: false, description: "Ricetta tradizionale con mascarpone e caffè espresso" },
  { id: "11", name: "Cannolo Siciliano", price: 8.00, category: "Dolci", image: dishCannolo, popular: true, description: "Cialda croccante con ricotta di pecora e pistacchio" },
  { id: "15", name: "Panna Cotta", price: 9.00, category: "Dolci", image: dishPannaCotta, popular: false, description: "Panna cotta alla vaniglia con coulis di frutti di bosco" },
  { id: "12", name: "Prosecco DOC", price: 8.00, category: "Bevande", image: dishProsecco, popular: false, description: "Prosecco Valdobbiadene DOCG brut" },
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
type AdminTab = "overview" | "menu" | "orders" | "tables" | "settings";
type AdminMore = "grid" | "qr" | "vault" | "blacklist" | "inventory" | "academy" | "settings-detail";
type StudioSection = "menu" | "ai" | "design" | "translate";
type ProfitSection = "panic" | "clients" | "reviews";
type OrdersSection = "orders" | "tables" | "traffic" | "reservations";

// Profit card pop-ups data
const profitCards = [
  { trigger: "wallet", icon: <Wallet className="w-4 h-4 text-primary" />, title: "Recupera il 30% dei clienti persi", text: "Clicca qui per riportarli nel tuo locale senza spendere 1€ in pubblicità." },
  { trigger: "ai-mary", icon: <Shield className="w-4 h-4 text-emerald-400" />, title: "Fisco 2026: Sei al Sicuro", text: "Questa luce verde significa che sei protetto dalle multe. Il software lavora, tu cucini." },
  { trigger: "panic", icon: <AlertTriangle className="w-4 h-4 text-amber-400" />, title: "Margini in 1 Secondo", text: "Niente più menù cartacei da ristampare. Un gesto e i prezzi si aggiornano ovunque." },
];

// Demo reviews
const demoReviews = [
  { id: "r1", customer_name: "Marco R.", rating: 5, comment: "Migliore cacio e pepe di Roma! Servizio impeccabile.", is_public: true, created_at: "2026-02-20" },
  { id: "r2", customer_name: "Laura B.", rating: 5, comment: "Ambiente fantastico, torneremo sicuramente.", is_public: true, created_at: "2026-02-18" },
  { id: "r3", customer_name: "Andrea M.", rating: 2, comment: "Attesa troppo lunga per un venerdì sera.", is_public: false, created_at: "2026-02-15" },
  { id: "r4", customer_name: "Sofia G.", rating: 4, comment: "Ottimi primi, dolci nella media.", is_public: true, created_at: "2026-02-12" },
  { id: "r5", customer_name: "Paolo V.", rating: 5, comment: "Tartufo eccezionale! Porzioni generose.", is_public: true, created_at: "2026-02-10" },
  { id: "r6", customer_name: "Giulia T.", rating: 3, comment: "Buono ma niente di speciale.", is_public: false, created_at: "2026-02-08" },
];

// Demo lost customers
const demoLostCustomers = [
  { name: "Francesca D.", phone: "+39 333 ****12", lastOrder: "45 giorni fa", totalSpent: "€320", orders: 8 },
  { name: "Roberto M.", phone: "+39 347 ****89", lastOrder: "38 giorni fa", totalSpent: "€180", orders: 5 },
  { name: "Chiara L.", phone: "+39 320 ****56", lastOrder: "52 giorni fa", totalSpent: "€450", orders: 12 },
];

// Demo reservations
const demoReservations = [
  { id: "res1", customer_name: "Marco B.", customer_phone: "+39 333 1234", guests: 4, reservation_date: "2026-02-24", reservation_time: "20:30", status: "confirmed" },
  { id: "res2", customer_name: "Laura S.", customer_phone: "+39 347 5678", guests: 2, reservation_date: "2026-02-24", reservation_time: "21:00", status: "pending" },
  { id: "res3", customer_name: "Gruppo Aziendale", customer_phone: "+39 06 9876", guests: 12, reservation_date: "2026-02-25", reservation_time: "13:00", status: "confirmed" },
];

// Demo blacklist
const demoBlacklist = [
  { id: "bl1", customer_name: "Mario X.", customer_phone: "+39 333 000111", reason: "No-show ripetuti", blocked_at: "2026-02-01" },
];

// Demo order analytics
const demoOrderAnalytics = [
  { source: "QR Tavolo", count: 145 },
  { source: "Link Diretto", count: 89 },
  { source: "Instagram", count: 67 },
  { source: "Google Maps", count: 43 },
  { source: "WhatsApp", count: 31 },
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
  const [adminTab, setAdminTab] = useState<AdminTab>("overview");
  const [tableStatuses, setTableStatuses] = useState<Record<number, "free" | "occupied" | "calling">>({
    1: "free", 2: "occupied", 3: "free", 4: "occupied", 5: "calling", 6: "free", 7: "occupied", 8: "free",
  });
  const [orderPlacedFlash, setOrderPlacedFlash] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Customization state
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [demoRestaurantName, setDemoRestaurantName] = useState("Impero Roma");
  const [demoLogoUrl, setDemoLogoUrl] = useState<string | null>(null);
  const [demoAddress, setDemoAddress] = useState("Via del Corso 42, Roma");
  const [demoPhone, setDemoPhone] = useState("+39 06 1234567");
  const [demoEmail, setDemoEmail] = useState("info@impero.it");
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Admin sub-states
  const [adminMore, setAdminMore] = useState<AdminMore>("grid");
  const [studioSection, setStudioSection] = useState<StudioSection>("menu");
  const [profitSection, setProfitSection] = useState<ProfitSection>("panic");
  const [ordersSection, setOrdersSection] = useState<OrdersSection>("orders");
  const [kitchenSoundOn, setKitchenSoundOn] = useState(true);

  // Customer sub-states
  const [customerSection, setCustomerSection] = useState<"menu" | "hero" | "story" | "contact">("hero");
  const [showWallet, setShowWallet] = useState(false);
  const [showNotifOptIn, setShowNotifOptIn] = useState(false);
  const [tableQR, setTableQR] = useState<number | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setDemoLogoUrl(ev.target?.result as string); };
    reader.readAsDataURL(file);
  };

  // Check for dessert → suggest coffee
  useEffect(() => {
    const hasDessert = cart.some(i => ["10", "11", "15"].includes(i.id));
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
      table: tableQR || Math.floor(Math.random() * 8) + 1,
      time: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }),
      status: "new",
      orderType: tableQR ? "Tavolo" : "Takeaway",
      customerName: "Marco R.",
    };
    setKitchenOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setOrderPlacedFlash(true);
    setTimeout(() => setOrderPlacedFlash(false), 2000);
    setTimeout(() => { setActiveView("kitchen"); }, 800);
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
    aiTokens: 5,
  };

  const avgReviewRating = (demoReviews.reduce((s, r) => s + r.rating, 0) / demoReviews.length).toFixed(1);
  const positivePercent = Math.round((demoReviews.filter(r => r.rating >= 4).length / demoReviews.length) * 100);

  // Reusable logo element
  const LogoElement = ({ size = "sm" }: { size?: "sm" | "md" }) => {
    if (demoLogoUrl) {
      return <img src={demoLogoUrl} alt="Logo" className={`${size === "sm" ? "w-6 h-6" : "w-8 h-8"} rounded-lg object-cover`} />;
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
      {/* Header with Customizer + Guided Demo Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm sm:text-base font-display font-bold text-foreground">Demo Live</h2>
        <div className="flex items-center gap-1.5">
          <motion.button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all ${
              showCustomizer ? "bg-accent text-accent-foreground" : "bg-accent/10 text-accent-foreground/70 border border-accent/30"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Personalizza
          </motion.button>
          <motion.button
            onClick={() => setGuidedMode(!guidedMode)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all ${
              guidedMode ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary border border-primary/30"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{guidedMode ? "Tour Attivo" : "Guided Demo"}</span>
            <span className="sm:hidden">{guidedMode ? "Tour" : "Demo"}</span>
          </motion.button>
        </div>
      </div>

      {/* ===== CUSTOMIZER PANEL ===== */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-3 sm:p-4 rounded-xl bg-card border border-border/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">Personalizza per il Cliente</span>
                </div>
                <button onClick={() => setShowCustomizer(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-[10px] text-muted-foreground">Inserisci il nome e il logo del ristorante del tuo potenziale cliente per una demo su misura.</p>
              <div className="flex items-center gap-3">
                <button onClick={() => logoInputRef.current?.click()} className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 flex items-center justify-center transition-all overflow-hidden flex-shrink-0">
                  {demoLogoUrl ? <img src={demoLogoUrl} alt="Logo" className="w-full h-full object-cover" /> : <ImagePlus className="w-5 h-5 text-muted-foreground" />}
                </button>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                <div className="flex-1 space-y-1.5">
                  <div>
                    <label className="text-[9px] text-muted-foreground font-medium">Nome Ristorante</label>
                    <input type="text" value={demoRestaurantName} onChange={e => setDemoRestaurantName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border/40 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50" placeholder="es. Trattoria Da Mario" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-muted-foreground font-medium">Indirizzo</label>
                  <input type="text" value={demoAddress} onChange={e => setDemoAddress(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border/40 text-xs text-foreground focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-[9px] text-muted-foreground font-medium">Telefono</label>
                  <input type="text" value={demoPhone} onChange={e => setDemoPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border/40 text-xs text-foreground focus:outline-none focus:border-primary/50" />
                </div>
              </div>
              {(demoRestaurantName !== "Impero Roma" || demoLogoUrl) && (
                <button onClick={() => { setDemoRestaurantName("Impero Roma"); setDemoLogoUrl(null); setDemoAddress("Via del Corso 42, Roma"); setDemoPhone("+39 06 1234567"); setDemoEmail("info@impero.it"); }}
                  className="text-[10px] text-muted-foreground hover:text-foreground underline">Ripristina valori default</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3-Way View Switcher */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/30 border border-border/30">
        {([
          { id: "customer" as DemoView, label: "App Cliente", shortLabel: "Cliente", icon: <Smartphone className="w-3.5 h-3.5" /> },
          { id: "admin" as DemoView, label: "Admin", shortLabel: "Admin", icon: <Monitor className="w-3.5 h-3.5" /> },
          { id: "kitchen" as DemoView, label: "Cucina", shortLabel: "Cucina", icon: <CookingPot className="w-3.5 h-3.5" /> },
        ]).map(v => (
          <button key={v.id} onClick={() => setActiveView(v.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 sm:py-2.5 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-all relative ${
              activeView === v.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}>
            {v.icon}
            <span className="hidden sm:inline">{v.label}</span>
            <span className="sm:hidden">{v.shortLabel}</span>
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
          <motion.div key={activeProfitCard} initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/25 shadow-lg shadow-primary/5">
            {(() => {
              const card = profitCards.find(c => c.trigger === activeProfitCard);
              if (!card) return null;
              return (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-card flex items-center justify-center flex-shrink-0">{card.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-bold text-foreground">{card.title}</p>
                    <p className="text-[9px] sm:text-[11px] text-muted-foreground leading-relaxed mt-0.5">{card.text}</p>
                  </div>
                  <button onClick={() => setActiveProfitCard(null)} className="text-muted-foreground text-xs flex-shrink-0">✕</button>
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
          <div className="bg-foreground/90 rounded-[32px] sm:rounded-[36px] p-[6px] sm:p-[8px] shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] sm:w-[100px] h-[18px] sm:h-[22px] bg-foreground/90 rounded-b-2xl z-10" />
            <div className="absolute top-[4px] sm:top-[5px] left-[18px] sm:left-[22px] z-10">
              <span className="text-[7px] sm:text-[8px] text-background/60 font-medium">9:41</span>
            </div>
            {/* Screen */}
            <div className="w-full rounded-[26px] sm:rounded-[28px] overflow-hidden bg-background relative">
              {/* Order placed flash */}
              <AnimatePresence>
                {orderPlacedFlash && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                      <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }} className="text-4xl sm:text-5xl mb-2">🎉</motion.div>
                      <p className="text-xs sm:text-sm font-display font-bold text-foreground">Ordine Inviato!</p>
                      <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">Guarda nella Cucina →</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ===== CUSTOMER VIEW ===== */}
              {activeView === "customer" && (
                <div className="h-[500px] sm:h-[560px] overflow-y-auto">
                  {/* Table QR Banner */}
                  {tableQR && (
                    <div className="sticky top-0 z-30 bg-primary/90 text-primary-foreground px-3 py-1.5 flex items-center justify-between text-[10px] font-medium">
                      <span>🪑 Tavolo {tableQR}</span>
                      <button className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary-foreground/20 text-[9px] font-semibold">
                        <Bell className="w-2.5 h-2.5" /> Chiama Cameriere
                      </button>
                    </div>
                  )}

                  {/* Header */}
                  <div className={`sticky ${tableQR ? "top-6" : "top-0"} z-20 bg-background/95 backdrop-blur-xl border-b border-border/30 px-3 pt-6 sm:pt-7 pb-2`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <LogoElement size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-display font-bold text-foreground truncate">{demoRestaurantName}</p>
                          <p className="text-[8px] sm:text-[9px] text-muted-foreground flex items-center gap-1 truncate">
                            <MapPin className="w-2.5 h-2.5 flex-shrink-0" /> {demoAddress} · <Star className="w-2.5 h-2.5 text-primary fill-primary flex-shrink-0" /> 4.8
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => setShowChat(true)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-card border border-border/30 flex items-center justify-center">
                          <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground" />
                        </button>
                        <button className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-card border border-border/30 flex items-center justify-center">
                          <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-foreground" />
                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center">{cartCount}</span>
                          )}
                        </button>
                      </div>
                    </div>
                    {/* Customer Nav */}
                    <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
                      {(["hero", "menu", "story", "contact"] as const).map(sec => (
                        <button key={sec} onClick={() => setCustomerSection(sec)}
                          className={`px-2 py-1 rounded-lg text-[8px] sm:text-[9px] font-semibold whitespace-nowrap transition-all ${
                            customerSection === sec ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                          }`}>
                          {sec === "hero" ? "Home" : sec === "menu" ? "Menù" : sec === "story" ? "Chi Siamo" : "Contatti"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wallet Push Notification */}
                  <AnimatePresence>
                    {showWalletPush && (
                      <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}
                        className="mx-3 mt-2 p-2 sm:p-2.5 rounded-xl bg-card/95 backdrop-blur-xl border border-primary/30 shadow-2xl flex items-center gap-2 z-20 relative">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] sm:text-[11px] font-bold text-foreground truncate">🎁 {demoRestaurantName}</p>
                          <p className="text-[9px] sm:text-[10px] text-muted-foreground">Sconto 20% nel tuo Wallet! Valido 7 giorni.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* HERO Section */}
                  {customerSection === "hero" && (
                    <div className="space-y-3 pb-3">
                      <div className="relative h-40 sm:h-48 overflow-hidden">
                        <video src={heroVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <h2 className="text-lg sm:text-xl font-display font-bold text-foreground tracking-[0.1em] uppercase">{demoRestaurantName}</h2>
                            <p className="text-[9px] sm:text-[10px] text-foreground/70 tracking-[0.15em] uppercase mt-1">Cucina Autentica Italiana</p>
                            <button onClick={() => setCustomerSection("menu")} className="mt-3 px-4 py-1.5 border border-foreground/30 text-foreground text-[9px] tracking-[0.15em] uppercase font-medium hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all">
                              Ordina Ora
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Popular items preview */}
                      <div className="px-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">⭐ I Più Amati</p>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                          {demoMenu.filter(i => i.popular).slice(0, 5).map(item => (
                            <div key={item.id} className="flex-shrink-0 w-24 sm:w-28 cursor-pointer" onClick={() => { setSelectedItem(item); setCustomerSection("menu"); }}>
                              <img src={item.image} alt={item.name} className="w-full h-16 sm:h-20 rounded-lg object-cover" />
                              <p className="text-[9px] font-semibold text-foreground mt-1 truncate">{item.name}</p>
                              <p className="text-[8px] font-bold text-primary">€{item.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Notification opt-in */}
                      <div className="mx-3 p-2.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-foreground">Attiva Notifiche</p>
                          <p className="text-[8px] text-muted-foreground">Ricevi offerte esclusive e aggiornamenti</p>
                        </div>
                        <button className="px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[9px] font-bold flex-shrink-0">Attiva</button>
                      </div>
                      {/* Loyalty wallet */}
                      <div className="mx-3 p-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20 flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-foreground">Il tuo Wallet</p>
                          <p className="text-[8px] text-muted-foreground">1 coupon attivo · -20% sul prossimo ordine</p>
                        </div>
                        <span className="text-[10px] font-bold text-primary">🎟️</span>
                      </div>
                      {/* Quick actions */}
                      <div className="px-3 grid grid-cols-4 gap-1.5">
                        {[
                          { icon: <Utensils className="w-3.5 h-3.5" />, label: "Menù", action: () => setCustomerSection("menu") },
                          { icon: <CalendarDays className="w-3.5 h-3.5" />, label: "Prenota", action: () => setShowReservation(true) },
                          { icon: <Star className="w-3.5 h-3.5" />, label: "Recensione", action: () => setShowReview(true) },
                          { icon: <Phone className="w-3.5 h-3.5" />, label: "Chiama", action: () => {} },
                        ].map((a, i) => (
                          <button key={i} onClick={a.action} className="flex flex-col items-center gap-0.5 py-2 rounded-xl bg-card border border-border/20 text-center">
                            <span className="text-primary">{a.icon}</span>
                            <span className="text-[7px] font-medium text-muted-foreground">{a.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STORY Section */}
                  {customerSection === "story" && (
                    <div className="space-y-3 p-3">
                      <p className="text-[9px] text-primary uppercase tracking-[0.3em] font-medium">La Nostra Storia</p>
                      <h3 className="text-sm font-display font-bold text-foreground leading-tight">Una passione per la cucina autentica</h3>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Nel cuore della città vi attende {demoRestaurantName} — un luogo dove l'ospitalità italiana incontra l'eccellenza culinaria.
                        La nostra cucina unisce ricette tradizionali con accenti moderni.
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[storyInterior, storyPasta, storyWine, storyDish].map((img, i) => (
                          <img key={i} src={img} alt="" className="w-full h-20 rounded-lg object-cover" />
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Dalla pasta fatta a mano alle carni selezionate, dai vini della nostra enoteca ai dolci della tradizione — ogni visita diventa un'esperienza indimenticabile.
                      </p>
                    </div>
                  )}

                  {/* CONTACT Section */}
                  {customerSection === "contact" && (
                    <div className="space-y-3 p-3">
                      <h3 className="text-sm font-display font-bold text-foreground">Contatti & Orari</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card border border-border/20">
                          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-semibold text-foreground">{demoAddress}</p>
                            <p className="text-[9px] text-muted-foreground">Roma, Italia</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card border border-border/20">
                          <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                          <p className="text-[10px] font-semibold text-foreground">{demoPhone}</p>
                        </div>
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-card border border-border/20">
                          <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                          <p className="text-[10px] font-semibold text-foreground">{demoEmail}</p>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-card border border-border/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <p className="text-[10px] font-semibold text-foreground">Orari di Apertura</p>
                        </div>
                        {[
                          { day: "Lunedì - Venerdì", hours: "12:00 - 15:00 · 19:00 - 23:30" },
                          { day: "Sabato", hours: "12:00 - 15:30 · 19:00 - 24:00" },
                          { day: "Domenica", hours: "Chiuso" },
                        ].map((h, i) => (
                          <div key={i} className="flex justify-between text-[9px] py-0.5">
                            <span className="text-muted-foreground">{h.day}</span>
                            <span className="text-foreground font-medium">{h.hours}</span>
                          </div>
                        ))}
                      </div>
                      {/* Table QR simulation toggle */}
                      <button onClick={() => setTableQR(tableQR ? null : 5)}
                        className="w-full py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-[10px] font-semibold flex items-center justify-center gap-1.5">
                        <QrCode className="w-3.5 h-3.5" />
                        {tableQR ? "Disattiva Modalità Tavolo" : "Simula Scansione QR Tavolo"}
                      </button>
                    </div>
                  )}

                  {/* MENU Section */}
                  {customerSection === "menu" && (
                    <>
                      {/* Category Tabs */}
                      <div className="flex gap-1 sm:gap-1.5 px-3 py-2 sm:py-2.5 overflow-x-auto no-scrollbar">
                        {categories.map(cat => (
                          <button key={cat} onClick={() => setSelectedCategory(cat)}
                            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-semibold whitespace-nowrap transition-all ${
                              selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-card border border-border/30 text-muted-foreground"
                            }`}>{cat}</button>
                        ))}
                      </div>

                      {/* Menu Items */}
                      <div className="px-3 space-y-1.5 sm:space-y-2 pb-3">
                        {filteredMenu.map((item) => (
                          <motion.div key={item.id} layout
                            className="flex gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl bg-card border border-border/20 cursor-pointer"
                            onClick={() => setSelectedItem(item)} whileTap={{ scale: 0.98 }}>
                            <img src={item.image} alt={item.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0 py-0.5">
                              <div className="flex items-start justify-between gap-1">
                                <p className="text-[10px] sm:text-[11px] font-semibold text-foreground leading-tight truncate">{item.name}</p>
                                {item.popular && <span className="px-1 py-0.5 rounded-full bg-primary/10 text-primary text-[6px] font-bold flex-shrink-0">TOP</span>}
                              </div>
                              <p className="text-[8px] text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                              <div className="flex items-center justify-between mt-1.5">
                                <motion.span key={priceMultiplier + item.id} className="text-[11px] sm:text-xs font-bold text-primary"
                                  initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                                  €{getAdjustedPrice(item.price).toFixed(2)}
                                </motion.span>
                                <button onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                </button>
                              </div>
                              {priceMultiplier !== 0 && <span className="text-[8px] text-muted-foreground line-through">€{item.price.toFixed(2)}</span>}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Upsell */}
                      <AnimatePresence>
                        {showUpsell && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-3 pb-2">
                            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                              <Coffee className="w-4 h-4 text-amber-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-foreground">Un caffè col dessert? ☕</p>
                                <p className="text-[9px] text-muted-foreground">Prosecco DOC — €{getAdjustedPrice(8).toFixed(2)}</p>
                              </div>
                              <button onClick={() => addToCart(demoMenu.find(i => i.id === "12")!)} className="px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[9px] font-bold flex-shrink-0">Aggiungi</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  {/* Item Detail Sheet */}
                  <AnimatePresence>
                    {selectedItem && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 bg-background" onClick={() => setSelectedItem(null)}>
                        <div onClick={e => e.stopPropagation()}>
                          <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-36 sm:h-44 object-cover" />
                          <div className="p-3 sm:p-4 space-y-2.5">
                            <div className="flex items-start justify-between">
                              <h3 className="text-sm sm:text-base font-display font-bold text-foreground">{selectedItem.name}</h3>
                              <button onClick={() => setSelectedItem(null)} className="text-muted-foreground text-sm">✕</button>
                            </div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">{selectedItem.description}</p>
                            <div className="flex items-center justify-between">
                              <motion.span key={priceMultiplier} className="text-lg sm:text-xl font-display font-bold text-primary"
                                initial={{ scale: 1.2 }} animate={{ scale: 1 }}>€{getAdjustedPrice(selectedItem.price).toFixed(2)}</motion.span>
                              <motion.button onClick={() => { addToCart(selectedItem); setSelectedItem(null); }}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold" whileTap={{ scale: 0.95 }}>Aggiungi</motion.button>
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
                        <div className="p-3 space-y-3" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-display font-bold text-foreground">Prenota un Tavolo</h3>
                            <button onClick={() => setShowReservation(false)} className="text-muted-foreground">✕</button>
                          </div>
                          <div className="space-y-2">
                            <div className="p-2.5 rounded-xl bg-card border border-border/30"><p className="text-[9px] text-muted-foreground mb-1">Nome</p><p className="text-xs text-foreground">Marco Rossi</p></div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <div className="p-2.5 rounded-xl bg-card border border-border/30"><p className="text-[9px] text-muted-foreground mb-1">Data</p><p className="text-xs text-foreground">Oggi</p></div>
                              <div className="p-2.5 rounded-xl bg-card border border-border/30"><p className="text-[9px] text-muted-foreground mb-1">Ora</p><p className="text-xs text-foreground">20:30</p></div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-card border border-border/30"><p className="text-[9px] text-muted-foreground mb-1">Ospiti</p><p className="text-xs text-foreground">4 persone</p></div>
                            <button className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold">Conferma Prenotazione</button>
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
                        <div className="p-3 space-y-3" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-display font-bold text-foreground">Lascia una Recensione</h3>
                            <button onClick={() => setShowReview(false)} className="text-muted-foreground">✕</button>
                          </div>
                          <div className="flex justify-center gap-1.5 py-2">{[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-6 h-6 text-primary fill-primary cursor-pointer" />)}</div>
                          <p className="text-center text-[10px] text-muted-foreground">Le recensioni ≤3 stelle restano private.<br/>Solo ≥4 stelle vanno su Google.</p>
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                            <Shield className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                            <p className="text-[9px] font-bold text-foreground">Review Shield™ Attivo</p>
                            <p className="text-[8px] text-muted-foreground">Protegge il rating del ristorante</p>
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
                        <div className="p-3 space-y-2 flex-1" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-display font-bold text-foreground truncate">Chat con {demoRestaurantName}</h3>
                            <button onClick={() => setShowChat(false)} className="text-muted-foreground flex-shrink-0">✕</button>
                          </div>
                          <div className="space-y-2 flex-1">
                            <div className="p-2 rounded-xl bg-card border border-border/20 max-w-[80%]"><p className="text-[10px] text-foreground">Benvenuto! Come possiamo aiutarti?</p><p className="text-[7px] text-muted-foreground mt-1">14:30</p></div>
                            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 max-w-[80%] ml-auto"><p className="text-[10px] text-foreground">Avete tavoli liberi per stasera?</p><p className="text-[7px] text-muted-foreground mt-1">14:31</p></div>
                            <div className="p-2 rounded-xl bg-card border border-border/20 max-w-[80%]"><p className="text-[10px] text-foreground">Certo! Per quante persone? Posso prenotarle subito 🍽️</p><p className="text-[7px] text-muted-foreground mt-1">14:31</p></div>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1 px-2.5 py-1.5 rounded-xl bg-card border border-border/30 text-[10px] text-muted-foreground">Scrivi un messaggio...</div>
                            <button className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center"><Send className="w-3.5 h-3.5 text-primary-foreground" /></button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ===== ADMIN VIEW ===== */}
              {activeView === "admin" && (
                <div className="h-[500px] sm:h-[560px] overflow-y-auto">
                  {/* Admin Header */}
                  <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/30 px-3 pt-6 sm:pt-7 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <LogoElement size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-display font-bold text-foreground truncate">{demoRestaurantName}</p>
                          <p className="text-[8px] sm:text-[9px] text-primary">
                            {adminTab === "overview" ? "Dashboard" : adminTab === "menu" ? "Studio" : adminTab === "orders" ? "Ordini" : adminTab === "tables" ? "Profitto" : "Altro"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className="relative">
                          <Bell className="w-4 h-4 text-foreground" />
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 text-white text-[7px] font-bold flex items-center justify-center">3</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-2.5 space-y-2.5">
                    {/* ---- DASHBOARD TAB ---- */}
                    {adminTab === "overview" && (
                      <>
                        <div className="text-center py-1">
                          <p className="text-[9px] text-muted-foreground">Panoramica giornaliera</p>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { label: "Incasso Oggi", value: `€${demoStats.todayRevenue.toFixed(0)}`, icon: <DollarSign className="w-3.5 h-3.5" />, color: "text-primary" },
                            { label: "Ordini Oggi", value: demoStats.todayOrders.toString(), icon: <ShoppingCart className="w-3.5 h-3.5" />, color: "text-emerald-400" },
                            { label: "In Cucina", value: demoStats.activeOrders.toString(), icon: <ChefHat className="w-3.5 h-3.5" />, color: "text-amber-400" },
                            { label: "Piatti Menu", value: demoStats.menuItems.toString(), icon: <TrendingUp className="w-3.5 h-3.5" />, color: "text-primary" },
                          ].map((s, i) => (
                            <div key={i} className="p-2.5 rounded-xl bg-card border border-border/30">
                              <div className={`${s.color} mb-0.5`}>{s.icon}</div>
                              <p className="text-base font-display font-bold text-foreground">{s.value}</p>
                              <p className="text-[8px] text-muted-foreground">{s.label}</p>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="p-2 rounded-xl bg-card border border-border/30">
                            <div className="flex items-center gap-1 mb-0.5"><Star className="w-3 h-3 text-primary" /><span className="text-[8px] text-muted-foreground">Recensioni</span></div>
                            <div className="flex items-baseline gap-1"><span className="text-lg font-display font-bold text-primary">{avgReviewRating}</span><span className="text-[8px] text-muted-foreground">({demoReviews.length})</span></div>
                          </div>
                          <div className="p-2 rounded-xl bg-card border border-border/30">
                            <div className="flex items-center gap-1 mb-0.5"><CalendarDays className="w-3 h-3 text-primary" /><span className="text-[8px] text-muted-foreground">Prenotazioni</span></div>
                            <div className="flex items-baseline gap-1"><span className="text-lg font-display font-bold text-foreground">{demoStats.reservationsToday}</span><span className="text-[8px] text-muted-foreground">oggi</span></div>
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-primary" /></div>
                          <div className="flex-1"><p className="text-[10px] font-medium text-foreground">Gettoni IA</p><p className="text-[8px] text-muted-foreground">Menu Creator, Foto, Traduzioni</p></div>
                          <span className="text-base font-display font-bold text-primary">{demoStats.aiTokens}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button className="flex items-center gap-1.5 p-2 rounded-xl bg-secondary/50 text-[10px] text-foreground"><ExternalLink className="w-3 h-3 text-primary" /> Vedi Menu</button>
                          <button className="flex items-center gap-1.5 p-2 rounded-xl bg-secondary/50 text-[10px] text-foreground"><ChefHat className="w-3 h-3 text-primary" /> Cucina</button>
                        </div>
                      </>
                    )}

                    {/* ---- STUDIO TAB ---- */}
                    {adminTab === "menu" && (
                      <div className="space-y-2">
                        <div className="flex gap-1 overflow-x-auto no-scrollbar">
                          {([
                            { id: "menu" as StudioSection, label: "Menu", icon: <Utensils className="w-3 h-3" /> },
                            { id: "ai" as StudioSection, label: "IA", icon: <Sparkles className="w-3 h-3" /> },
                            { id: "design" as StudioSection, label: "Design", icon: <Palette className="w-3 h-3" /> },
                            { id: "translate" as StudioSection, label: "Lingue", icon: <Globe className="w-3 h-3" /> },
                          ]).map(s => (
                            <button key={s.id} onClick={() => setStudioSection(s.id)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-semibold whitespace-nowrap ${
                                studioSection === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                              }`}>{s.icon} {s.label}</button>
                          ))}
                        </div>

                        {studioSection === "menu" && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[10px] font-bold text-foreground">{demoMenu.length} piatti</h4>
                              <button className="px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[9px] font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Aggiungi</button>
                            </div>
                            {demoMenu.slice(0, 6).map(item => (
                              <div key={item.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-card border border-border/20">
                                <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[9px] font-semibold text-foreground truncate">{item.name}</p>
                                  <p className="text-[8px] text-muted-foreground">{item.category}</p>
                                </div>
                                <span className="text-[9px] font-bold text-primary flex-shrink-0">€{getAdjustedPrice(item.price).toFixed(2)}</span>
                                <div className="flex gap-0.5">
                                  <Edit className="w-3 h-3 text-muted-foreground" />
                                  <Wand2 className="w-3 h-3 text-primary" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {studioSection === "ai" && (
                          <div className="space-y-2 text-center">
                            <Camera className="w-8 h-8 mx-auto text-muted-foreground" />
                            <h4 className="text-[11px] font-display font-bold text-foreground">AI Menu Creator</h4>
                            <p className="text-[9px] text-muted-foreground">Foto → OCR → Menu in 60 secondi</p>
                            <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 text-center">
                              <Camera className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-[9px] font-medium text-foreground">Scatta o carica il menu cartaceo</p>
                              <p className="text-[8px] text-muted-foreground mt-1">Costa 1 gettone IA</p>
                            </div>
                            <button className="w-full py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center gap-1">
                              <Wand2 className="w-3 h-3" /> Rigenera Foto con IA
                            </button>
                          </div>
                        )}

                        {studioSection === "design" && (
                          <div className="space-y-2">
                            <div className="p-2.5 rounded-xl bg-card border border-border/30 space-y-2">
                              <p className="text-[9px] font-semibold text-foreground">Colore Brand</p>
                              <div className="flex gap-1.5">{["#C8922A", "#E74C3C", "#2ECC71", "#3498DB", "#9B59B6", "#1A1A2E"].map(c => <div key={c} className="w-6 h-6 rounded-full border-2 border-border/30 cursor-pointer" style={{ backgroundColor: c }} />)}</div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-card border border-border/30 space-y-1.5">
                              <p className="text-[9px] font-semibold text-foreground">Logo</p>
                              <button className="w-full py-2 rounded-xl bg-primary/10 text-primary text-[9px] font-semibold flex items-center justify-center gap-1"><Upload className="w-3 h-3" /> Carica Logo</button>
                              <p className="text-[8px] text-muted-foreground text-center">Colore brand estratto automaticamente</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-card border border-border/30 space-y-1">
                              <p className="text-[9px] font-semibold text-foreground">Tagline</p>
                              <p className="text-[8px] text-muted-foreground italic">"Cucina Autentica Italiana"</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                              <p className="text-[9px] font-bold text-foreground">📱 Anteprima Live</p>
                              <p className="text-[8px] text-muted-foreground">Ogni modifica è visibile in tempo reale nell'app cliente</p>
                            </div>
                          </div>
                        )}

                        {studioSection === "translate" && (
                          <div className="space-y-2 text-center">
                            <Globe className="w-8 h-8 mx-auto text-primary" />
                            <h4 className="text-[11px] font-display font-bold text-foreground">Traduzione Menu</h4>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {["🇮🇹 IT", "🇬🇧 EN", "🇫🇷 FR", "🇩🇪 DE", "🇪🇸 ES", "🇯🇵 JA", "🇨🇳 ZH"].map(l => (
                                <span key={l} className="px-2 py-1 rounded-lg bg-card border border-border/30 text-[8px] font-medium text-foreground cursor-pointer">{l}</span>
                              ))}
                            </div>
                            <button className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center gap-1"><Languages className="w-3 h-3" /> Traduci Menu con IA</button>
                            <p className="text-[8px] text-muted-foreground">Il menu si traduce automaticamente in base alla lingua del browser del cliente</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ---- ORDERS TAB ---- */}
                    {adminTab === "orders" && (
                      <div className="space-y-2">
                        <div className="flex gap-1 overflow-x-auto no-scrollbar">
                          {([
                            { id: "orders" as OrdersSection, label: "Cucina" },
                            { id: "tables" as OrdersSection, label: "Tavoli" },
                            { id: "traffic" as OrdersSection, label: "Canali" },
                            { id: "reservations" as OrdersSection, label: "Prenota" },
                          ]).map(s => (
                            <button key={s.id} onClick={() => setOrdersSection(s.id)}
                              className={`px-2 py-1 rounded-lg text-[8px] font-semibold whitespace-nowrap ${
                                ordersSection === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                              }`}>{s.label}</button>
                          ))}
                        </div>

                        {ordersSection === "orders" && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[10px] font-bold text-foreground">{demoStats.activeOrders} ordini attivi</h4>
                              <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[8px] font-medium"><ExternalLink className="w-3 h-3" /> Vista Cucina</button>
                            </div>
                            <div className="p-2 rounded-xl bg-secondary/50 space-y-1.5">
                              <p className="text-[8px] text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Key className="w-3 h-3" /> PIN Staff</p>
                              <div className="flex items-center justify-between p-1.5 rounded-lg bg-card"><span className="text-[10px] font-mono text-foreground">4521</span><span className="text-[8px] text-green-400">Operativo</span></div>
                            </div>
                            {[
                              { id: "d1", items: [{ name: "Cacio e Pepe", qty: 2, image: dishCacioPepe }, { name: "Tiramisù", qty: 1, image: dishTiramisu }], table: 4, time: "13:45", status: "preparing" as const, customerName: "Laura B.", orderType: "Tavolo" },
                              { id: "d2", items: [{ name: "Margherita DOP", qty: 1, image: dishPizza }, { name: "Prosecco", qty: 2, image: dishProsecco }], table: 2, time: "13:38", status: "ready" as const, customerName: "Andrea M.", orderType: "Takeaway" },
                              ...kitchenOrders,
                            ].map(order => (
                              <div key={order.id} className={`p-2 rounded-xl border ${order.status === "new" ? "bg-red-500/5 border-red-500/20" : order.status === "preparing" ? "bg-amber-500/5 border-amber-500/20" : "bg-emerald-500/5 border-emerald-500/20"}`}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[9px] font-bold text-foreground">{order.customerName} · Tav.{order.table}</span>
                                  <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${order.status === "new" ? "bg-red-500/20 text-red-400" : order.status === "preparing" ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                                    {order.status === "new" ? "NUOVO" : order.status === "preparing" ? "IN PREP." : "PRONTO"}
                                  </span>
                                </div>
                                <div className="space-y-0.5">{order.items.map((item, i) => <p key={i} className="text-[8px] text-muted-foreground">{item.qty}x {item.name}</p>)}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {ordersSection === "tables" && (
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-foreground">Mappa Tavoli</h4>
                            <div className="grid grid-cols-4 gap-1.5">
                              {Object.entries(tableStatuses).map(([num, status]) => (
                                <button key={num} onClick={() => setTableStatuses(prev => ({ ...prev, [num]: status === "free" ? "occupied" : status === "occupied" ? "calling" : "free" }))}
                                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 border transition-all ${
                                    status === "free" ? "bg-emerald-500/10 border-emerald-500/20" : status === "occupied" ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20 animate-pulse"
                                  }`}>
                                  <span className="text-xs font-bold text-foreground">{num}</span>
                                  <span className={`text-[6px] font-bold ${status === "free" ? "text-emerald-400" : status === "occupied" ? "text-amber-400" : "text-red-400"}`}>
                                    {status === "free" ? "LIBERO" : status === "occupied" ? "OCCUPATO" : "🔔"}
                                  </span>
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-2 justify-center">{[{ color: "bg-emerald-400", label: "Libero" }, { color: "bg-amber-400", label: "Occupato" }, { color: "bg-red-400", label: "Chiamata" }].map(l => (
                              <div key={l.label} className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full ${l.color}`} /><span className="text-[7px] text-muted-foreground">{l.label}</span></div>
                            ))}</div>
                            <button className="w-full py-1.5 rounded-lg bg-primary/10 text-primary text-[9px] font-medium flex items-center justify-center gap-1"><Move className="w-3 h-3" /> Layout Drag & Drop</button>
                          </div>
                        )}

                        {ordersSection === "traffic" && (
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-foreground">Canali di Vendita</h4>
                            {[
                              { label: "🚗 Consegna", enabled: true },
                              { label: "🥡 Asporto", enabled: true },
                              { label: "🪑 Tavolo", enabled: true },
                            ].map((ch, i) => (
                              <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-secondary/50">
                                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-400" /><span className="text-[10px] font-medium text-foreground">{ch.label}</span></div>
                                <div className="w-8 h-4 rounded-full bg-green-400/20 flex items-center justify-end px-0.5"><div className="w-3 h-3 rounded-full bg-green-400" /></div>
                              </div>
                            ))}
                            <p className="text-[8px] text-muted-foreground uppercase tracking-wider mt-2">📊 Fonti Ordini</p>
                            {demoOrderAnalytics.map((item, idx) => (
                              <div key={item.source} className="flex items-center gap-2 p-1.5 rounded-lg bg-secondary/50">
                                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: `hsl(${38 + idx * 45}, 70%, 55%)` }} />
                                <span className="text-[9px] font-medium text-foreground flex-1">{item.source}</span>
                                <span className="text-[9px] text-primary font-semibold">{item.count}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {ordersSection === "reservations" && (
                          <div className="space-y-1.5">
                            <h4 className="text-[10px] font-bold text-foreground">Prenotazioni</h4>
                            {demoReservations.map(res => (
                              <div key={res.id} className={`p-2 rounded-xl border ${res.status === "confirmed" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"}`}>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-bold text-foreground">{res.customer_name}</span>
                                  <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${res.status === "confirmed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                                    {res.status === "confirmed" ? "CONFERMATA" : "IN ATTESA"}
                                  </span>
                                </div>
                                <p className="text-[8px] text-muted-foreground mt-0.5">{res.reservation_date} · {res.reservation_time} · {res.guests} ospiti</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ---- PROFIT TAB ---- */}
                    {adminTab === "tables" && (
                      <div className="space-y-2">
                        <div className="flex gap-1 overflow-x-auto no-scrollbar">
                          {([
                            { id: "panic" as ProfitSection, label: "Panic" },
                            { id: "clients" as ProfitSection, label: "Clienti" },
                            { id: "reviews" as ProfitSection, label: "Reviews" },
                          ]).map(s => (
                            <button key={s.id} onClick={() => setProfitSection(s.id)}
                              className={`px-2 py-1 rounded-lg text-[8px] font-semibold whitespace-nowrap ${
                                profitSection === s.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                              }`}>{s.label}</button>
                          ))}
                        </div>

                        {profitSection === "panic" && (
                          <>
                            <div className="p-2.5 rounded-xl bg-card border border-border/30 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-amber-400" /><span className="text-[10px] font-bold text-foreground">Panic Mode</span></div>
                                <span className={`text-xs font-bold ${priceMultiplier > 0 ? "text-emerald-400" : priceMultiplier < 0 ? "text-red-400" : "text-muted-foreground"}`}>{priceMultiplier > 0 ? "+" : ""}{priceMultiplier}%</span>
                              </div>
                              <Slider value={[priceMultiplier]} onValueChange={([v]) => { setPriceMultiplier(v); if (!activeProfitCard) setActiveProfitCard("panic"); }} min={-30} max={30} step={1} />
                              <p className="text-[8px] text-muted-foreground text-center">Muovi lo slider → prezzi cambiano <span className="text-primary font-bold">in tempo reale</span></p>
                            </div>
                            <button onClick={() => setActiveProfitCard("ai-mary")} className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                              <div className="relative flex-shrink-0"><div className="w-3 h-3 rounded-full bg-emerald-400" /><div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-40" /></div>
                              <div className="flex-1 text-left min-w-0"><span className="text-[10px] font-bold text-foreground">AI-Mary: Fisco 2026 ✓</span><p className="text-[8px] text-muted-foreground">Registratore collegato, conforme.</p></div>
                              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            </button>
                            <button onClick={() => { setShowWalletPush(true); setActiveProfitCard("wallet"); setTimeout(() => setShowWalletPush(false), 4000); }}
                              className="w-full py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-[10px] font-semibold flex items-center justify-center gap-2">
                              <Wallet className="w-3.5 h-3.5" /> Invia Push Wallet ai Clienti
                            </button>
                          </>
                        )}

                        {profitSection === "clients" && (
                          <div className="space-y-2">
                            <div className="text-center py-1">
                              <UserX className="w-8 h-8 mx-auto text-accent mb-1" />
                              <h4 className="text-[11px] font-display font-bold text-foreground">Clienti Persi</h4>
                              <p className="text-[8px] text-muted-foreground">Clienti che non ordinano da 30+ giorni</p>
                            </div>
                            {demoLostCustomers.map((c, i) => (
                              <div key={i} className="p-2 rounded-xl bg-card border border-border/30 flex items-center gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold text-foreground">{c.name}</p>
                                  <p className="text-[8px] text-muted-foreground">{c.lastOrder} · {c.orders} ordini · {c.totalSpent}</p>
                                </div>
                                <button className="px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[8px] font-bold flex-shrink-0">📲 Recupera</button>
                              </div>
                            ))}
                            <p className="text-[8px] text-muted-foreground text-center">Invia sconto push automatico per recuperarli</p>
                          </div>
                        )}

                        {profitSection === "reviews" && (
                          <div className="space-y-2">
                            <div className="p-2 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-primary" />
                              <div><p className="text-[10px] font-bold text-foreground">Review Shield™</p><p className="text-[8px] text-muted-foreground">1-3★ private · 4-5★ su Google</p></div>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              <div className="p-2 rounded-xl bg-card text-center"><p className="text-lg font-display font-bold text-primary">{avgReviewRating}</p><p className="text-[7px] text-muted-foreground">Media</p></div>
                              <div className="p-2 rounded-xl bg-card text-center"><p className="text-lg font-display font-bold text-foreground">{demoReviews.length}</p><p className="text-[7px] text-muted-foreground">Totali</p></div>
                              <div className="p-2 rounded-xl bg-card text-center"><p className="text-lg font-display font-bold text-green-400">{positivePercent}%</p><p className="text-[7px] text-muted-foreground">Positive</p></div>
                            </div>
                            {demoReviews.slice(0, 4).map(review => (
                              <div key={review.id} className={`p-2 rounded-xl ${review.is_public ? "bg-card" : "bg-accent/5 border border-accent/15"}`}>
                                <div className="flex justify-between items-center mb-0.5">
                                  <span className="text-[9px] font-medium text-foreground">{review.customer_name}</span>
                                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`w-2.5 h-2.5 ${j < review.rating ? "text-primary fill-primary" : "text-muted"}`} />)}</div>
                                </div>
                                <p className="text-[8px] text-muted-foreground">{review.comment}</p>
                                {review.is_public ? <span className="text-[7px] text-green-400">✓ Su Google</span> : <span className="text-[7px] text-accent">🔒 Privata</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ---- MORE MENU TAB ---- */}
                    {adminTab === "settings" && (
                      <div className="space-y-2">
                        {adminMore === "grid" && (
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { id: "qr" as AdminMore, label: "QR Code", icon: <QrCode className="w-5 h-5" />, color: "text-primary" },
                              { id: "vault" as AdminMore, label: "Vault Fiscale", icon: <Lock className="w-5 h-5" />, color: "text-green-400" },
                              { id: "blacklist" as AdminMore, label: "Black-List", icon: <ShieldBan className="w-5 h-5" />, color: "text-accent" },
                              { id: "inventory" as AdminMore, label: "AI Scorte", icon: <Package className="w-5 h-5" />, color: "text-purple-400" },
                              { id: "academy" as AdminMore, label: "Academy", icon: <GraduationCap className="w-5 h-5" />, color: "text-amber-400" },
                              { id: "settings-detail" as AdminMore, label: "Impostazioni", icon: <Settings className="w-5 h-5" />, color: "text-muted-foreground" },
                            ].map(item => (
                              <button key={item.id} onClick={() => setAdminMore(item.id)}
                                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card border border-border/30 hover:border-primary/30 transition-colors">
                                <span className={item.color}>{item.icon}</span>
                                <span className="text-[8px] font-medium text-foreground">{item.label}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {adminMore !== "grid" && (
                          <div className="space-y-2">
                            <button onClick={() => setAdminMore("grid")} className="text-[9px] text-muted-foreground hover:text-foreground">← Torna al menu</button>

                            {adminMore === "qr" && (
                              <div className="text-center space-y-2">
                                <QrCode className="w-8 h-8 mx-auto text-primary" />
                                <h4 className="text-[11px] font-display font-bold text-foreground">QR Code Menu</h4>
                                <div className="p-3 rounded-xl bg-white mx-auto w-24 h-24 flex items-center justify-center"><QrCode className="w-16 h-16 text-foreground/20" /></div>
                                <div className="flex gap-1.5">
                                  <button className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-[9px] font-medium flex items-center justify-center gap-1"><Download className="w-3 h-3" /> Scarica</button>
                                  <button className="flex-1 py-2 rounded-xl bg-secondary text-[9px] font-medium flex items-center justify-center gap-1"><ExternalLink className="w-3 h-3" /> Apri</button>
                                </div>
                                <p className="text-[8px] text-muted-foreground">QR dedicati per ogni tavolo disponibili nella sezione Tavoli</p>
                              </div>
                            )}

                            {adminMore === "vault" && (
                              <div className="space-y-2">
                                <div className="p-2.5 rounded-xl bg-green-500/5 border border-green-500/20 flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.5)]" />
                                  <div><p className="text-[10px] font-medium text-foreground">Vault operativo</p><p className="text-[8px] text-muted-foreground">Provider: Scontrino.it</p></div>
                                </div>
                                <div className="rounded-xl bg-card border border-border overflow-hidden">
                                  <div className="px-3 py-1.5 border-b border-border flex items-center gap-1.5"><Bot className="w-3 h-3 text-primary" /><span className="text-[9px] font-medium text-foreground">AI-Mary</span></div>
                                  <div className="h-24 p-2 space-y-1.5">
                                    <div className="p-1.5 rounded-lg bg-secondary text-[8px] text-foreground max-w-[85%]">Benvenuto nella Cassaforte Fiscale. Sono Mary. La tua configurazione è attiva e conforme. 🔐</div>
                                    <div className="p-1.5 rounded-lg bg-primary/10 text-[8px] text-foreground max-w-[85%] ml-auto">È tutto a norma?</div>
                                    <div className="p-1.5 rounded-lg bg-secondary text-[8px] text-foreground max-w-[85%]">✅ Sì! Criptazione AES-256, audit trail completo. Sei al sicuro.</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {adminMore === "blacklist" && (
                              <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-foreground">Black-List Clienti</h4>
                                <div className="p-2 rounded-xl bg-secondary/50 space-y-1.5">
                                  <input type="text" placeholder="Telefono" className="w-full px-2 py-1.5 rounded-lg bg-background text-[10px] text-foreground" readOnly />
                                  <button className="w-full py-2 rounded-xl bg-accent text-accent-foreground text-[9px] font-bold">🚫 Blocca</button>
                                </div>
                                {demoBlacklist.map(b => (
                                  <div key={b.id} className="flex items-center gap-2 p-2 rounded-xl bg-accent/5 border border-accent/20">
                                    <ShieldBan className="w-3 h-3 text-accent flex-shrink-0" />
                                    <div className="flex-1 min-w-0"><p className="text-[9px] font-medium text-foreground">{b.customer_name}</p><p className="text-[8px] text-muted-foreground">{b.reason}</p></div>
                                    <button className="text-[8px] text-primary">Sblocca</button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {adminMore === "inventory" && (
                              <div className="space-y-2 text-center">
                                <Package className="w-8 h-8 mx-auto text-primary" />
                                <h4 className="text-[11px] font-display font-bold text-foreground">AI Inventory</h4>
                                <p className="text-[9px] text-muted-foreground">Analisi predittiva delle scorte basata su ordini e trend</p>
                                <button className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-[10px] font-bold">🤖 Analizza Scorte</button>
                                <div className="space-y-1 text-left">
                                  {[
                                    { item: "Mozzarella di Bufala", alert: "⚠️ In esaurimento", urgency: "text-amber-400" },
                                    { item: "Tartufo Nero", alert: "🔴 Critico — riordina", urgency: "text-red-400" },
                                    { item: "Farina 00", alert: "✅ Stock OK", urgency: "text-emerald-400" },
                                  ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-card">
                                      <span className="text-[9px] text-foreground">{s.item}</span>
                                      <span className={`text-[8px] font-medium ${s.urgency}`}>{s.alert}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {adminMore === "academy" && (
                              <div className="space-y-2 text-center">
                                <GraduationCap className="w-8 h-8 mx-auto text-amber-400" />
                                <h4 className="text-[11px] font-display font-bold text-foreground">Empire Academy</h4>
                                <p className="text-[9px] text-muted-foreground">Guide e tutorial per sfruttare al massimo Empire</p>
                                {[
                                  { title: "🎥 Come creare il menu perfetto", duration: "5 min" },
                                  { title: "📊 Leggere le analytics", duration: "3 min" },
                                  { title: "💰 Panic Mode: guida avanzata", duration: "4 min" },
                                  { title: "📱 Configurare i QR per tavolo", duration: "2 min" },
                                ].map((v, i) => (
                                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border/30 text-left">
                                    <div className="flex-1"><p className="text-[9px] font-semibold text-foreground">{v.title}</p><p className="text-[8px] text-muted-foreground">{v.duration}</p></div>
                                    <ExternalLink className="w-3 h-3 text-primary flex-shrink-0" />
                                  </div>
                                ))}
                              </div>
                            )}

                            {adminMore === "settings-detail" && (
                              <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-foreground">Impostazioni Ristorante</h4>
                                <div className="p-2.5 rounded-xl bg-card border border-border/30 space-y-1.5">
                                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-primary" /><div><p className="text-[9px] font-semibold text-foreground">Telefono</p><p className="text-[8px] text-muted-foreground">{demoPhone}</p></div></div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-card border border-border/30 space-y-1.5">
                                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary" /><div><p className="text-[9px] font-semibold text-foreground">Email</p><p className="text-[8px] text-muted-foreground">{demoEmail}</p></div></div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-card border border-border/30 space-y-1.5">
                                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /><div><p className="text-[9px] font-semibold text-foreground">Indirizzo</p><p className="text-[8px] text-muted-foreground">{demoAddress}</p></div></div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-card border border-border/30 space-y-1">
                                  <p className="text-[9px] font-semibold text-foreground flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> Orari</p>
                                  {["Lun-Ven: 12-15 · 19-23:30", "Sab: 12-24", "Dom: Chiuso"].map((h, i) => <p key={i} className="text-[8px] text-muted-foreground">{h}</p>)}
                                </div>
                                <button className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center gap-1"><Save className="w-3 h-3" /> Salva Impostazioni</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Admin Bottom Nav */}
                  <div className="sticky bottom-5 z-20 mx-2 mt-2">
                    <div className="flex gap-0.5 p-1 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/30 shadow-lg">
                      {([
                        { id: "overview" as AdminTab, label: "Home", icon: <BarChart3 className="w-4 h-4" /> },
                        { id: "menu" as AdminTab, label: "Studio", icon: <Utensils className="w-4 h-4" /> },
                        { id: "orders" as AdminTab, label: "Ordini", icon: <ShoppingCart className="w-4 h-4" /> },
                        { id: "tables" as AdminTab, label: "Profitto", icon: <TrendingUp className="w-4 h-4" /> },
                        { id: "settings" as AdminTab, label: "Altro", icon: <Settings className="w-4 h-4" /> },
                      ]).map(t => (
                        <button key={t.id} onClick={() => { setAdminTab(t.id); if (t.id === "settings") setAdminMore("grid"); }}
                          className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all ${
                            adminTab === t.id ? "text-primary" : "text-muted-foreground"
                          }`}>
                          {t.icon}
                          <span className="text-[7px] font-semibold">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== KITCHEN VIEW ===== */}
              {activeView === "kitchen" && (
                <div className="h-[500px] sm:h-[560px] overflow-y-auto">
                  {/* Kitchen Header */}
                  <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/30 px-3 pt-6 sm:pt-7 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-display font-bold text-foreground truncate">Kitchen View</p>
                          <p className="text-[8px] sm:text-[9px] text-muted-foreground truncate">{demoRestaurantName} — Cucina</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => setKitchenSoundOn(!kitchenSoundOn)} className="p-1 rounded-lg hover:bg-secondary">
                          {kitchenSoundOn ? <Volume2 className="w-3.5 h-3.5 text-primary" /> : <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />}
                        </button>
                        <div className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-bold flex items-center gap-1">
                          <CircleDot className="w-2 h-2" /> LIVE
                        </div>
                      </div>
                    </div>
                    {/* Kitchen Stats */}
                    <div className="flex gap-1.5 mt-2">
                      {[
                        { label: "Nuovi", count: kitchenOrders.filter(o => o.status === "new").length + 1, color: "bg-red-500/10 text-red-400 border-red-500/20" },
                        { label: "In Prep.", count: kitchenOrders.filter(o => o.status === "preparing").length + 2, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                        { label: "Pronti", count: kitchenOrders.filter(o => o.status === "ready").length + 1, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                      ].map(s => (
                        <div key={s.label} className={`flex-1 py-1 rounded-lg border text-center ${s.color}`}>
                          <p className="text-sm font-bold">{s.count}</p>
                          <p className="text-[7px] font-semibold">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-3 py-2.5 space-y-1.5">
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
                      <motion.div key={order.id} layout
                        initial={order.id.startsWith("k-demo") ? undefined : { opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-2.5 rounded-xl border ${
                          order.status === "new" ? "bg-red-500/5 border-red-500/25 shadow-sm shadow-red-500/10" :
                          order.status === "preparing" ? "bg-amber-500/5 border-amber-500/20" :
                          order.status === "ready" ? "bg-emerald-500/5 border-emerald-500/20" :
                          "bg-muted/30 border-border/20 opacity-50"
                        }`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {order.status === "new" && (
                              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                                <Volume2 className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                              </motion.div>
                            )}
                            <span className="text-[10px] font-bold text-foreground truncate">{order.customerName}</span>
                            <span className="text-[7px] text-muted-foreground px-1 py-0.5 rounded bg-muted flex-shrink-0">Tav.{order.table}</span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Printer className="w-3 h-3 text-muted-foreground cursor-pointer" />
                            <span className="text-[7px] text-muted-foreground">{order.time}</span>
                          </div>
                        </div>
                        <div className="space-y-1 mb-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <img src={item.image} alt={item.name} className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
                              <span className="text-[10px] text-foreground font-medium truncate">{item.qty}x {item.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-1">
                          {order.status === "new" && (
                            <button onClick={() => updateOrderStatus(order.id, "preparing")}
                              className="flex-1 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-[9px] font-bold flex items-center justify-center gap-1">
                              <CookingPot className="w-3 h-3" /> In Prep.
                            </button>
                          )}
                          {order.status === "preparing" && (
                            <button onClick={() => updateOrderStatus(order.id, "ready")}
                              className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-[9px] font-bold flex items-center justify-center gap-1">
                              <Check className="w-3 h-3" /> Pronto!
                            </button>
                          )}
                          {order.status === "ready" && (
                            <button onClick={() => updateOrderStatus(order.id, "delivered")}
                              className="flex-1 py-1.5 rounded-lg bg-muted text-muted-foreground text-[9px] font-bold flex items-center justify-center gap-1">
                              <UserCheck className="w-3 h-3" /> Consegnato
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Floating Cart Button (Customer view) */}
              {activeView === "customer" && cartCount > 0 && !selectedItem && !showReservation && !showReview && !showChat && customerSection === "menu" && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-3 left-3 right-3 z-20">
                  <button onClick={placeOrder}
                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Ordina · €{cartTotal.toFixed(2)} ({cartCount})
                  </button>
                </motion.div>
              )}

              {/* Home bar */}
              <div className="absolute bottom-0 left-0 right-0 h-4 sm:h-5 flex justify-center items-center bg-background/80 backdrop-blur-sm z-10">
                <div className="w-16 sm:w-20 h-1 rounded-full bg-foreground/15" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Explanation */}
      <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-primary/5 to-amber-500/5 border border-primary/10 text-center">
        <p className="text-[9px] sm:text-[10px] text-muted-foreground">
          <Zap className="w-3 h-3 inline text-primary mr-1" />
          <span className="font-bold text-foreground">Sync Reale:</span> Prezzi Admin → App Cliente. Ordini App → Cucina.
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
