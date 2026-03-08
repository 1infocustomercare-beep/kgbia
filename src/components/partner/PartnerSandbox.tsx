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
import PartnerFullDemo from "./PartnerFullDemo";

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
  const [fullDemoOpen, setFullDemoOpen] = useState(false);

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

  // ===== RENDER FUNCTIONS (Full-Width) =====

  const renderMenuSection = () => (
    <div className="px-4 sm:px-6 py-4 space-y-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}>{cat}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredMenu.map(item => (
          <motion.div key={item.id} layout className="flex gap-3 p-3 rounded-xl bg-card border border-border/30 hover:border-primary/30 transition-all cursor-pointer group"
            onClick={() => setSelectedItem(item)} whileTap={{ scale: 0.98 }}>
            <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0 group-hover:ring-2 ring-primary transition-all" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{item.name}</p>
                  {item.popular && <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">⭐ Popolare</span>}
                </div>
                <span className="text-sm font-display font-bold text-primary whitespace-nowrap">€{getAdjustedPrice(item.price).toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-2 mt-2">
                {cart.find(c => c.id === item.id) ? (
                  <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); removeFromCart(item.id); }} className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                    <span className="text-xs font-bold w-4 text-center">{cart.find(c => c.id === item.id)?.qty}</span>
                    <button onClick={e => { e.stopPropagation(); addToCart(item); }} className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                  </div>
                ) : (
                  <button onClick={e => { e.stopPropagation(); addToCart(item); }} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                    <Plus className="w-3 h-3 inline mr-1" />Aggiungi
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {showUpsell && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20 flex items-center gap-3">
            <Coffee className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">Aggiungi un Prosecco? 🥂</p>
              <p className="text-[10px] text-muted-foreground">Perfetto con il dolce — solo €8</p>
            </div>
            <button onClick={() => addToCart(demoMenu.find(i => i.id === "12")!)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold">+€8</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderStorySection = () => (
    <div className="px-4 sm:px-6 py-4 space-y-4">
      <h3 className="text-lg font-display font-bold text-foreground">La Nostra Storia</h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          { img: storyInterior, title: "Il Locale", desc: "Un angolo di Roma autentica dal 1965" },
          { img: storyPasta, title: "La Pasta", desc: "Fatta a mano ogni mattina con semola di grano duro" },
          { img: storyWine, title: "I Vini", desc: "Selezione curata dalle migliori cantine italiane" },
          { img: storyDish, title: "La Cucina", desc: "Ingredienti freschi, ricette della tradizione" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-border/30">
            <img src={s.img} alt="" className="w-full h-28 sm:h-36 object-cover" />
            <div className="p-2.5">
              <p className="text-xs font-bold text-foreground">{s.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="px-4 sm:px-6 py-4 space-y-4">
      <h3 className="text-lg font-display font-bold text-foreground">Contatti</h3>
      <div className="space-y-3">
        {[
          { icon: <MapPin className="w-4 h-4 text-primary" />, label: "Indirizzo", value: demoAddress },
          { icon: <Phone className="w-4 h-4 text-primary" />, label: "Telefono", value: demoPhone },
          { icon: <Mail className="w-4 h-4 text-primary" />, label: "Email", value: demoEmail },
          { icon: <Clock className="w-4 h-4 text-primary" />, label: "Orari", value: "Lun-Dom 12:00 - 23:00" },
        ].map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/30">
            {c.icon}
            <div>
              <p className="text-[10px] text-muted-foreground">{c.label}</p>
              <p className="text-sm font-medium text-foreground">{c.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModals = () => (
    <>
      <AnimatePresence>
        {showReservation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-md p-6 rounded-2xl bg-card border border-border/30 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-display font-bold text-foreground">Prenota un Tavolo</h3>
                <button onClick={() => setShowReservation(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <div className="space-y-3">
                <input placeholder="Nome" className="w-full p-3 rounded-xl bg-background border border-border/40 text-sm" />
                <input placeholder="Telefono" className="w-full p-3 rounded-xl bg-background border border-border/40 text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" className="p-3 rounded-xl bg-background border border-border/40 text-sm" />
                  <input type="time" className="p-3 rounded-xl bg-background border border-border/40 text-sm" />
                </div>
                <select className="w-full p-3 rounded-xl bg-background border border-border/40 text-sm">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} ospiti</option>)}
                </select>
                <button onClick={() => setShowReservation(false)} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm">Conferma Prenotazione</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showChat && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} className="w-full max-w-md rounded-2xl bg-card border border-border/30 shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-border/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Chat con {demoRestaurantName}</span>
                </div>
                <button onClick={() => setShowChat(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">💬 Chat privata attiva</div>
              <div className="p-3 border-t border-border/30 flex gap-2">
                <input placeholder="Scrivi un messaggio..." className="flex-1 p-2.5 rounded-xl bg-background border border-border/40 text-sm" />
                <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold"><Send className="w-4 h-4" /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showReview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-md p-6 rounded-2xl bg-card border border-border/30 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-display font-bold text-foreground">Lascia una Recensione</h3>
                <button onClick={() => setShowReview(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2 justify-center">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-8 h-8 text-primary cursor-pointer hover:fill-primary transition-all" />)}
                </div>
                <textarea placeholder="Racconta la tua esperienza..." className="w-full p-3 rounded-xl bg-background border border-border/40 text-sm h-24 resize-none" />
                <button onClick={() => setShowReview(false)} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm">Invia Recensione</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setSelectedItem(null)}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-card border border-border/30 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <img src={selectedItem.image} alt="" className="w-full h-48 sm:h-56 object-cover" />
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-display font-bold text-foreground">{selectedItem.name}</h3>
                  <span className="text-xl font-display font-bold text-primary">€{getAdjustedPrice(selectedItem.price).toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{selectedItem.description}</p>
                <button onClick={() => { addToCart(selectedItem); setSelectedItem(null); }} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                  <Plus className="w-4 h-4 inline mr-2" />Aggiungi al Carrello
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  const renderAdminView = () => (
    <div className="max-h-[70vh] overflow-y-auto">
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoElement size="md" />
            <div>
              <p className="text-base font-display font-bold text-foreground">{demoRestaurantName}</p>
              <p className="text-xs text-muted-foreground">Pannello Amministrazione</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-muted-foreground">Online</span>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
          {([
            { id: "overview" as AdminTab, label: "Dashboard", icon: <BarChart3 className="w-3.5 h-3.5" /> },
            { id: "menu" as AdminTab, label: "Studio", icon: <Edit className="w-3.5 h-3.5" /> },
            { id: "orders" as AdminTab, label: "Ordini", icon: <ShoppingCart className="w-3.5 h-3.5" /> },
            { id: "tables" as AdminTab, label: "Profitto", icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { id: "settings" as AdminTab, label: "Altro", icon: <Settings className="w-3.5 h-3.5" /> },
          ]).map(t => (
            <button key={t.id} onClick={() => setAdminTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                adminTab === t.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              }`}>{t.icon} {t.label}</button>
          ))}
        </div>
        {adminTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Incasso Oggi", value: `€${demoStats.todayRevenue.toFixed(0)}`, icon: <DollarSign className="w-4 h-4 text-emerald-400" />, bg: "bg-emerald-500/10 border-emerald-500/20" },
                { label: "Ordini", value: demoStats.todayOrders.toString(), icon: <ShoppingCart className="w-4 h-4 text-primary" />, bg: "bg-primary/10 border-primary/20" },
                { label: "Prenotazioni", value: demoStats.reservationsToday.toString(), icon: <CalendarDays className="w-4 h-4 text-amber-400" />, bg: "bg-amber-500/10 border-amber-500/20" },
                { label: "Rating", value: demoStats.avgRating.toString(), icon: <Star className="w-4 h-4 text-primary fill-primary" />, bg: "bg-primary/10 border-primary/20" },
              ].map((s, i) => (
                <div key={i} className={`p-3 rounded-xl border ${s.bg}`}>
                  <div className="flex items-center gap-2 mb-1">{s.icon}<span className="text-[10px] text-muted-foreground">{s.label}</span></div>
                  <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-accent/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-foreground">Panic Mode — Margini in tempo reale</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Modifica tutti i prezzi con uno slider. Si aggiorna su tutti i dispositivi.</p>
              <div className="flex items-center gap-4">
                <Slider value={[priceMultiplier]} onValueChange={v => setPriceMultiplier(v[0])} min={-30} max={30} step={1} className="flex-1" />
                <span className={`text-lg font-display font-bold min-w-[60px] text-right ${priceMultiplier > 0 ? "text-emerald-400" : priceMultiplier < 0 ? "text-accent" : "text-foreground"}`}>
                  {priceMultiplier > 0 ? "+" : ""}{priceMultiplier}%
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/30">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-bold text-foreground">Review Shield™</h4>
                <span className="text-xs text-muted-foreground ml-auto">{avgReviewRating} ⭐ · {positivePercent}% positive</span>
              </div>
              <div className="space-y-2">
                {demoReviews.slice(0, 4).map(r => (
                  <div key={r.id} className={`p-2.5 rounded-lg border text-xs ${r.is_public ? "bg-emerald-500/5 border-emerald-500/20" : "bg-accent/5 border-accent/20"}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">{r.customer_name}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 text-primary fill-primary" />)}
                        <span className={`ml-2 text-[9px] px-1.5 py-0.5 rounded-full ${r.is_public ? "bg-emerald-500/20 text-emerald-400" : "bg-accent/20 text-accent"}`}>
                          {r.is_public ? "Pubblica" : "Nascosta"}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-1">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/30">
              <div className="flex items-center gap-2 mb-3">
                <UserX className="w-5 h-5 text-accent" />
                <h4 className="text-sm font-bold text-foreground">Clienti Persi</h4>
                <button onClick={() => { setShowWalletPush(true); setTimeout(() => setShowWalletPush(false), 4000); }}
                  className="ml-auto px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                  <Send className="w-3 h-3 inline mr-1" />Invia Sconto
                </button>
              </div>
              <div className="space-y-2">
                {demoLostCustomers.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border/20 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{c.name}</p>
                      <p className="text-muted-foreground">{c.lastOrder} · {c.orders} ordini · {c.totalSpent}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {adminTab === "menu" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground">Gestione Menu ({demoMenu.length} piatti)</h4>
              <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold"><Plus className="w-3 h-3 inline mr-1" />Nuovo</button>
            </div>
            <div className="space-y-2">
              {demoMenu.slice(0, 6).map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border/30">
                  <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.category}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">€{item.price.toFixed(2)}</span>
                  <div className="flex gap-1">
                    <button className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center"><Edit className="w-3 h-3 text-muted-foreground" /></button>
                    <button className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center"><Trash2 className="w-3 h-3 text-accent" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
                <Camera className="w-5 h-5 text-violet-400 mb-2" />
                <p className="text-xs font-bold text-foreground">AI Menu Creator</p>
                <p className="text-[10px] text-muted-foreground mt-1">Fotografa il menu cartaceo → digitalizzato in 60 secondi con OCR + foto IA</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/20">
                <Languages className="w-5 h-5 text-sky-400 mb-2" />
                <p className="text-xs font-bold text-foreground">Traduci Menu</p>
                <p className="text-[10px] text-muted-foreground mt-1">8+ lingue con un click: inglese, tedesco, francese, spagnolo...</p>
              </div>
            </div>
          </div>
        )}
        {adminTab === "orders" && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-bold text-foreground">Ordini Attivi</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">{kitchenOrders.length + 3}</span>
            </div>
            {kitchenOrders.map(order => (
              <div key={order.id} className="p-3 rounded-xl bg-card border border-border/30">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-xs font-bold text-foreground">{order.customerName}</p>
                    <p className="text-[10px] text-muted-foreground">{order.orderType} {order.table ? `· Tavolo ${order.table}` : ""} · {order.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    order.status === "new" ? "bg-primary/10 text-primary" :
                    order.status === "preparing" ? "bg-amber-500/10 text-amber-400" :
                    order.status === "ready" ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"
                  }`}>
                    {order.status === "new" ? "Nuovo" : order.status === "preparing" ? "In Prep." : order.status === "ready" ? "Pronto" : "Consegnato"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {order.items.map((it, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 rounded-lg bg-secondary text-foreground">{it.qty}x {it.name}</span>
                  ))}
                </div>
              </div>
            ))}
            <div className="p-4 rounded-xl bg-card border border-border/30">
              <h4 className="text-sm font-bold text-foreground mb-3">Mappa Tavoli</h4>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(tableStatuses).map(([num, status]) => (
                  <button key={num} onClick={() => {
                    setTableStatuses(prev => ({ ...prev, [+num]: status === "free" ? "occupied" : status === "occupied" ? "calling" : "free" }));
                    if (status === "free") { setTableQR(+num); setActiveView("customer"); }
                  }}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                      status === "free" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      status === "occupied" ? "bg-primary/10 text-primary border border-primary/20" :
                      "bg-accent/10 text-accent border border-accent/20 animate-pulse"
                    }`}>
                    <span className="text-lg">{num}</span>
                    <span className="text-[8px]">{status === "free" ? "Libero" : status === "occupied" ? "Occupato" : "Chiama!"}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {(adminTab === "tables" || adminTab === "settings") && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { icon: <QrCode className="w-5 h-5 text-primary" />, title: "QR Code Tavoli", desc: "Genera e stampa codici QR univoci per ogni tavolo", bg: "bg-primary/5 border-primary/20" },
                { icon: <Lock className="w-5 h-5 text-emerald-400" />, title: "Vault Fiscale", desc: "Chiavi API criptate AES-256 — AI-Mary guida il setup", bg: "bg-emerald-500/5 border-emerald-500/20" },
                { icon: <ShieldBan className="w-5 h-5 text-accent" />, title: "Blacklist Clienti", desc: `${demoBlacklist.length} cliente bloccato per no-show ripetuti`, bg: "bg-accent/5 border-accent/20" },
                { icon: <Bot className="w-5 h-5 text-violet-400" />, title: "Gettoni IA", desc: `${demoStats.aiTokens} gettoni rimanenti per generazione foto e traduzioni`, bg: "bg-violet-500/5 border-violet-500/20" },
                { icon: <Palette className="w-5 h-5 text-amber-400" />, title: "Design Studio", desc: "Colore brand, logo, tagline — tutto personalizzabile", bg: "bg-amber-500/5 border-amber-500/20" },
                { icon: <Globe className="w-5 h-5 text-sky-400" />, title: "Multi-Lingua", desc: "Menu tradotto automaticamente in 8+ lingue con IA", bg: "bg-sky-500/5 border-sky-500/20" },
              ].map((card, i) => (
                <div key={i} className={`p-4 rounded-xl border ${card.bg}`}>
                  <div className="flex items-center gap-2 mb-2">{card.icon}<h4 className="text-xs font-bold text-foreground">{card.title}</h4></div>
                  <p className="text-[10px] text-muted-foreground">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderKitchenView = () => (
    <div className="max-h-[70vh] overflow-y-auto">
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-base font-display font-bold text-foreground">Cucina</h3>
              <p className="text-xs text-muted-foreground">{kitchenOrders.filter(o => o.status !== "delivered").length} ordini attivi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setKitchenSoundOn(!kitchenSoundOn)}
              className={`p-2 rounded-lg ${kitchenSoundOn ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
              {kitchenSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button className="p-2 rounded-lg bg-secondary text-muted-foreground"><Printer className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "In Attesa", count: kitchenOrders.filter(o => o.status === "new").length, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
            { label: "In Preparazione", count: kitchenOrders.filter(o => o.status === "preparing").length, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { label: "Pronti", count: kitchenOrders.filter(o => o.status === "ready").length, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
          ].map((s, i) => (
            <div key={i} className={`p-3 rounded-xl border text-center ${s.bg}`}>
              <p className={`text-2xl font-display font-bold ${s.color}`}>{s.count}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        {kitchenOrders.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">Nessun ordine — fai un ordine dalla vista Cliente!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {kitchenOrders.map(order => (
              <motion.div key={order.id} layout className={`p-4 rounded-xl border ${
                order.status === "new" ? "border-primary/30 bg-primary/5" :
                order.status === "preparing" ? "border-amber-500/30 bg-amber-500/5" :
                order.status === "ready" ? "border-emerald-500/30 bg-emerald-500/5" :
                "border-border/30 bg-secondary/30 opacity-60"
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.orderType} {order.table ? `· Tavolo ${order.table}` : ""} · {order.time}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    order.status === "new" ? "bg-primary/20 text-primary" :
                    order.status === "preparing" ? "bg-amber-500/20 text-amber-400" :
                    order.status === "ready" ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"
                  }`}>
                    {order.status === "new" ? "⏳ Nuovo" : order.status === "preparing" ? "🔥 In Prep." : order.status === "ready" ? "✅ Pronto" : "📦 Consegnato"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {order.items.map((it, i) => (
                    <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-card border border-border/30">
                      <img src={it.image} alt="" className="w-6 h-6 rounded object-cover" />
                      <span className="text-xs font-medium text-foreground">{it.qty}x {it.name}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {order.status === "new" && (
                    <button onClick={() => updateOrderStatus(order.id, "preparing")} className="flex-1 py-2.5 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/30 transition-all">🔥 Inizia Preparazione</button>
                  )}
                  {order.status === "preparing" && (
                    <button onClick={() => updateOrderStatus(order.id, "ready")} className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 transition-all">✅ Segna Pronto</button>
                  )}
                  {order.status === "ready" && (
                    <button onClick={() => updateOrderStatus(order.id, "delivered")} className="flex-1 py-2.5 rounded-xl bg-primary/20 text-primary text-xs font-bold hover:bg-primary/30 transition-all">📦 Consegnato</button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
      {/* Fullscreen Presentation CTA */}
      <motion.button
        onClick={() => setFullDemoOpen(true)}
        className="w-full p-4 rounded-2xl bg-vibrant-gradient text-primary-foreground flex items-center justify-between group hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.4)] transition-all"
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold font-heading">Presentazione Vendita</p>
            <p className="text-[10px] opacity-80">App reale + script di vendita step-by-step</p>
          </div>
        </div>
        <ExternalLink className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </motion.button>

      {/* Header with Customizer + Guided Demo Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm sm:text-base font-display font-bold text-foreground">Demo Interattiva</h2>
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

      {/* ===== FULL-WIDTH DEMO ===== */}
      <div className="w-full">
        <div className="w-full rounded-2xl border border-border/30 overflow-hidden bg-background relative shadow-xl">
          {/* Order placed flash */}
          <AnimatePresence>
            {orderPlacedFlash && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                  <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }} className="text-5xl mb-3">🎉</motion.div>
                  <p className="text-base font-display font-bold text-foreground">Ordine Inviato!</p>
                  <p className="text-xs text-muted-foreground mt-1">Guarda nella Cucina →</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== CUSTOMER VIEW ===== */}
          {activeView === "customer" && (
            <div className="max-h-[70vh] overflow-y-auto">
              {/* Table QR Banner */}
              {tableQR && (
                <div className="sticky top-0 z-30 bg-primary/90 text-primary-foreground px-4 py-2 flex items-center justify-between text-xs font-medium">
                  <span>🪑 Tavolo {tableQR}</span>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/20 text-xs font-semibold">
                    <Bell className="w-3 h-3" /> Chiama Cameriere
                  </button>
                </div>
              )}

              {/* Header */}
              <div className={`sticky ${tableQR ? "top-8" : "top-0"} z-20 bg-background/95 backdrop-blur-xl border-b border-border/30 px-4 sm:px-6 pt-4 pb-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <LogoElement size="md" />
                    <div className="min-w-0">
                      <p className="text-base sm:text-lg font-display font-bold text-foreground truncate">{demoRestaurantName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" /> {demoAddress} · <Star className="w-3 h-3 text-primary fill-primary flex-shrink-0" /> 4.8
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setShowChat(true)} className="w-9 h-9 rounded-full bg-card border border-border/30 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="relative w-9 h-9 rounded-full bg-card border border-border/30 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-foreground" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">{cartCount}</span>
                      )}
                    </button>
                  </div>
                </div>
                {/* Customer Nav */}
                <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                  {(["hero", "menu", "story", "contact"] as const).map(sec => (
                    <button key={sec} onClick={() => setCustomerSection(sec)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        customerSection === sec ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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
                    className="mx-4 mt-3 p-3 rounded-xl bg-card/95 backdrop-blur-xl border border-primary/30 shadow-2xl flex items-center gap-3 z-20 relative">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">🎁 {demoRestaurantName}</p>
                      <p className="text-xs text-muted-foreground">Sconto 20% nel tuo Wallet! Valido 7 giorni.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* HERO Section */}
              {customerSection === "hero" && (
                <div className="space-y-4 pb-4">
                  <div className="relative h-56 sm:h-72 overflow-hidden">
                    <video src={heroVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-[0.1em] uppercase">{demoRestaurantName}</h2>
                        <p className="text-sm text-foreground/70 tracking-[0.15em] uppercase mt-1">Cucina Autentica Italiana</p>
                        <button onClick={() => setCustomerSection("menu")} className="mt-4 px-6 py-2 border border-foreground/30 text-foreground text-xs tracking-[0.15em] uppercase font-medium hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all">
                          Ordina Ora
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Popular items preview */}
                  <div className="px-4 sm:px-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">⭐ I Più Amati</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">{demoMenu.filter(i => i.popular).map((item, idx) => (
                        <div key={idx} className="cursor-pointer group" onClick={() => addToCart(item)}>
                          <img src={item.image} alt="" className="w-full h-24 sm:h-28 rounded-xl object-cover group-hover:ring-2 ring-primary transition-all" />
                          <p className="text-xs font-medium mt-1.5 truncate">{item.name}</p>
                          <p className="text-xs text-primary font-bold">€{getAdjustedPrice(item.price).toFixed(2)}</p>
                        </div>
                      ))}</div>
                  </div>
                  {/* Notification Opt-in */}
                  <div className="mx-4 sm:mx-6 p-3 rounded-xl bg-card border border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs font-bold text-foreground">Attiva Notifiche</p>
                        <p className="text-[10px] text-muted-foreground">Ricevi offerte esclusive e aggiornamenti</p>
                      </div>
                    </div>
                    <button onClick={() => setShowNotifOptIn(true)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold">Attiva</button>
                  </div>
                  {/* Wallet */}
                  <div className="mx-4 sm:mx-6 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs font-bold text-foreground">Il tuo Wallet</p>
                        <p className="text-[10px] text-muted-foreground">1 coupon attivo · -20% sul prossimo ordine</p>
                      </div>
                    </div>
                    <span className="text-lg">🎟️</span>
                  </div>
                  {/* Bottom actions */}
                  <div className="grid grid-cols-4 gap-2 px-4 sm:px-6">
                    {[
                      { icon: <Utensils className="w-4 h-4" />, label: "Menù", action: () => setCustomerSection("menu") },
                      { icon: <CalendarDays className="w-4 h-4" />, label: "Prenota", action: () => setShowReservation(true) },
                      { icon: <Star className="w-4 h-4" />, label: "Recensione", action: () => setShowReview(true) },
                      { icon: <Phone className="w-4 h-4" />, label: "Chiama", action: () => {} },
                    ].map((act, i) => (
                      <button key={i} onClick={act.action} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card border border-border/30 hover:border-primary/30 transition-all">
                        <span className="text-foreground">{act.icon}</span>
                        <span className="text-[10px] font-medium text-muted-foreground">{act.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* MENU Section */}
              {customerSection === "menu" && renderMenuSection()}

              {/* STORY Section */}
              {customerSection === "story" && renderStorySection()}

              {/* CONTACT Section */}
              {customerSection === "contact" && renderContactSection()}

              {/* Modals */}
              {renderModals()}
            </div>
          )}

          {/* ===== ADMIN VIEW ===== */}
          {activeView === "admin" && renderAdminView()}

          {/* ===== KITCHEN VIEW ===== */}
          {activeView === "kitchen" && renderKitchenView()}

          {/* Cart floating */}
          {activeView === "customer" && cartCount > 0 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="sticky bottom-0 mx-4 mb-3 p-3 rounded-xl bg-primary text-primary-foreground flex items-center justify-between z-30 shadow-lg">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs font-bold">{cartCount} articoli</span>
              </div>
              <button onClick={placeOrder} className="px-4 py-2 rounded-lg bg-primary-foreground text-primary text-xs font-bold">
                Ordina €{cartTotal.toFixed(2)}
              </button>
            </motion.div>
          )}
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
