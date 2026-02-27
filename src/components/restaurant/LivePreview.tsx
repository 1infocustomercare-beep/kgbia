import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone, RotateCcw, ExternalLink, ChefHat, LayoutDashboard, Users,
  Star, ShoppingCart, TrendingUp, Bell, Volume2, Printer, Sparkles,
  MapPin, Phone, Clock, Search, Plus, UtensilsCrossed, Crown,
  Palette, Globe, Shield, AlertTriangle, BarChart3, QrCode,
  MessageSquare, Wallet, CalendarDays, ChevronDown, X, Info,
  Lock, Package, GraduationCap, Settings, ShieldBan, Bot, Send,
  DollarSign, Wand2, Upload, Eye, Move, Key, Download, CheckCircle2,
  XCircle, FileCheck, Ban, Mail, Zap
} from "lucide-react";

// Demo images
import dishBruschetta from "@/assets/dish-bruschetta.jpg";
import dishPasta from "@/assets/dish-pasta.jpg";
import dishTiramisu from "@/assets/dish-tiramisu.jpg";
import dishPizza from "@/assets/dish-pizza.jpg";
import dishRisotto from "@/assets/dish-risotto.jpg";
import dishSteak from "@/assets/dish-steak.jpg";
import heroVideo from "@/assets/hero-restaurant.mp4";
import storyInterior from "@/assets/story-interior.jpg";
import restaurantLogo from "@/assets/restaurant-logo.png";

interface LivePreviewProps {
  slug: string;
  primaryColor?: string;
  compact?: boolean;
}

type PreviewView = "customer" | "admin" | "kitchen";

interface Tooltip {
  id: string;
  text: string;
  position: "top" | "bottom" | "left" | "right";
}

const DEMO_MENU = [
  { name: "Bruschetta Classica", price: 8, cat: "Antipasti", img: dishBruschetta, popular: true },
  { name: "Spaghetti Carbonara", price: 14, cat: "Primi", img: dishPasta, popular: true },
  { name: "Pizza Margherita", price: 12, cat: "Pizze", img: dishPizza, popular: true },
  { name: "Risotto ai Funghi", price: 16, cat: "Primi", img: dishRisotto, popular: false },
  { name: "Tagliata di Manzo", price: 22, cat: "Secondi", img: dishSteak, popular: false },
  { name: "Tiramisù", price: 7, cat: "Dolci", img: dishTiramisu, popular: true },
];

const DEMO_ORDERS = [
  { id: "a1b2c3d4", status: "pending", customer: "Marco R.", type: "table", table: 5, items: [{ name: "Carbonara", qty: 2, price: 14 }, { name: "Bruschetta", qty: 1, price: 8 }], total: 36, time: "14:23", notes: "Senza pepe" },
  { id: "e5f6g7h8", status: "preparing", customer: "Laura B.", type: "delivery", table: null, items: [{ name: "Pizza Margherita", qty: 2, price: 12 }, { name: "Tiramisù", qty: 2, price: 7 }], total: 38, time: "14:18", notes: "" },
  { id: "i9j0k1l2", status: "ready", customer: "Giovanni P.", type: "takeaway", table: null, items: [{ name: "Risotto", qty: 1, price: 16 }, { name: "Tagliata", qty: 1, price: 22 }], total: 38, time: "14:05", notes: "Extra limone" },
];

const VIEWS: PreviewView[] = ["customer", "admin", "kitchen"];
const VIEW_LABELS = { customer: "👤 Cliente", admin: "⚙️ Admin", kitchen: "👨‍🍳 Cucina" };

const LivePreview = ({ slug, primaryColor, compact = false }: LivePreviewProps) => {
  const [view, setView] = useState<PreviewView>("customer");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [autoTourActive, setAutoTourActive] = useState(false);
  const [autoTourStep, setAutoTourStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<1 | -1>(1);

  // Customer sub-state
  const [customerSection, setCustomerSection] = useState<"hero" | "menu" | "story" | "contact">("hero");
  const [selectedCat, setSelectedCat] = useState("Antipasti");

  // Admin sub-state  
  const [adminTab, setAdminTab] = useState<"home" | "studio" | "orders" | "profit" | "more">("home");
  const [adminStudioSub, setAdminStudioSub] = useState<"menu" | "design" | "ai" | "lang">("menu");
  const [adminOrdersSub, setAdminOrdersSub] = useState<"orders" | "tables" | "channels" | "reservations">("orders");
  const [adminProfitSub, setAdminProfitSub] = useState<"panic" | "clients" | "reviews">("panic");
  const [adminMoreSection, setAdminMoreSection] = useState<"grid" | "qr" | "vault" | "chat" | "blacklist" | "inventory" | "academy" | "settings">("grid");

  // Kitchen sub-state
  const [kitchenOrders, setKitchenOrders] = useState(DEMO_ORDERS);

  const previewUrl = `${window.location.origin}/r/${slug}`;

  // Tooltip definitions per view+section
  const tooltips: Record<string, Tooltip> = {
    // Customer
    "hero-video": { id: "hero-video", text: "Video hero a schermo intero — il cliente viene subito immerso nell'esperienza", position: "bottom" },
    "hero-cta": { id: "hero-cta", text: "Call-to-action — porta al menu per ordinare", position: "top" },
    "menu-categories": { id: "menu-categories", text: "Categorie scrollabili — filtro istantaneo", position: "bottom" },
    "menu-item": { id: "menu-item", text: "Foto HD IA, prezzo e badge 'Popolare'", position: "bottom" },
    "menu-add": { id: "menu-add", text: "Aggiunta al carrello con un tap", position: "left" },
    "story-section": { id: "story-section", text: "Sezione 'Chi Siamo' — crea connessione col brand", position: "bottom" },
    "contact-info": { id: "contact-info", text: "Indirizzo, telefono e orari sempre visibili", position: "top" },
    "loyalty-wallet": { id: "loyalty-wallet", text: "Wallet fedeltà — coupon salvati nel telefono", position: "top" },
    "table-qr": { id: "table-qr", text: "QR per tavolo — ordina senza cameriere", position: "bottom" },
    "reservation": { id: "reservation", text: "Prenotazione tavolo con conferma istantanea", position: "top" },
    // Admin — Home
    "admin-kpis": { id: "admin-kpis", text: "KPI real-time: incasso, ordini attivi, piatti, gettoni IA", position: "bottom" },
    "admin-reviews-home": { id: "admin-reviews-home", text: "Review Shield™ — recensioni negative intercettate", position: "bottom" },
    "admin-tokens": { id: "admin-tokens", text: "Gettoni IA — Menu Creator, Foto, Traduzioni", position: "bottom" },
    "admin-quick-actions": { id: "admin-quick-actions", text: "Azioni rapide: menu live, vista cucina", position: "bottom" },
    // Admin — Studio
    "admin-studio-menu": { id: "admin-studio-menu", text: "Gestione menu — aggiungi, modifica, elimina con foto IA", position: "bottom" },
    "admin-studio-ai": { id: "admin-studio-ai", text: "AI Menu Creator — OCR del menu cartaceo in 60s", position: "bottom" },
    "admin-studio-design": { id: "admin-studio-design", text: "Design Studio — colore, logo, tagline, preview live", position: "bottom" },
    "admin-studio-lang": { id: "admin-studio-lang", text: "Traduzioni IA — menu in 8+ lingue con un click", position: "bottom" },
    // Admin — Orders
    "admin-orders": { id: "admin-orders", text: "Ordini con stati: Attesa → Preparazione → Pronto → Consegnato", position: "bottom" },
    "admin-tables": { id: "admin-tables", text: "Mappa tavoli interattiva — stato real-time", position: "bottom" },
    "admin-channels": { id: "admin-channels", text: "Canali attivi: Delivery, Asporto, Tavolo — toggle on/off", position: "bottom" },
    "admin-reservations": { id: "admin-reservations", text: "Prenotazioni — conferma o rifiuta con un tap", position: "bottom" },
    // Admin — Profit
    "admin-profit-panic": { id: "admin-profit-panic", text: "Panic Mode — slider ±30% su tutti i prezzi istantaneamente", position: "bottom" },
    "admin-profit-lost": { id: "admin-profit-lost", text: "Clienti Persi — push con sconto a chi non torna", position: "bottom" },
    "admin-profit-reviews": { id: "admin-profit-reviews", text: "Review Shield™ — solo 4-5★ finiscono su Google", position: "bottom" },
    // Admin — More
    "admin-more-grid": { id: "admin-more-grid", text: "Menu strumenti: QR, Vault, Chat, Blacklist, AI Scorte, Academy, Settings", position: "bottom" },
    "admin-more-qr": { id: "admin-more-qr", text: "QR Code per tavolo — genera e stampa", position: "bottom" },
    "admin-more-vault": { id: "admin-more-vault", text: "Vault Fiscale — chiavi criptate AES-256 + AI-Mary", position: "bottom" },
    "admin-more-chat": { id: "admin-more-chat", text: "Chat privata ristorante-cliente in tempo reale", position: "bottom" },
    "admin-more-blacklist": { id: "admin-more-blacklist", text: "Blacklist clienti — blocca numeri problematici", position: "bottom" },
    "admin-more-inventory": { id: "admin-more-inventory", text: "AI Inventory — analisi scorte e piatto del giorno", position: "bottom" },
    "admin-more-academy": { id: "admin-more-academy", text: "Academy — corsi di marketing per ristoratori", position: "bottom" },
    "admin-more-settings": { id: "admin-more-settings", text: "Impostazioni: contatti, orari, filtri, policy", position: "bottom" },
    "admin-empire-assistant": { id: "admin-empire-assistant", text: "Empire Assistant — chatbot IA 24/7 per supporto tecnico", position: "top" },
    // Kitchen
    "kitchen-header": { id: "kitchen-header", text: "Header cucina con contatore ordini e toggle audio", position: "bottom" },
    "kitchen-counters": { id: "kitchen-counters", text: "Contatori real-time: attesa, preparazione, pronti", position: "bottom" },
    "kitchen-order": { id: "kitchen-order", text: "Dettagli ordine: cliente, tipo, piatti, note, orario", position: "bottom" },
    "kitchen-actions": { id: "kitchen-actions", text: "Bottoni touch per cambiare stato ordine", position: "top" },
    "kitchen-print": { id: "kitchen-print", text: "Stampa ticket per stampante termica", position: "left" },
    "kitchen-realtime": { id: "kitchen-realtime", text: "Alert sonori differenziati per nuovi ordini", position: "bottom" },
  };

  // Auto-tour logic
  const tourSequences: Record<PreviewView, string[]> = {
    customer: ["hero-video", "hero-cta", "menu-categories", "menu-item", "menu-add", "story-section", "contact-info", "loyalty-wallet", "table-qr", "reservation"],
    admin: ["admin-kpis", "admin-tokens", "admin-reviews-home", "admin-quick-actions", "admin-studio-menu", "admin-studio-ai", "admin-studio-design", "admin-studio-lang", "admin-orders", "admin-tables", "admin-channels", "admin-reservations", "admin-profit-panic", "admin-profit-lost", "admin-profit-reviews", "admin-more-grid", "admin-empire-assistant"],
    kitchen: ["kitchen-header", "kitchen-counters", "kitchen-order", "kitchen-actions", "kitchen-print", "kitchen-realtime"],
  };

  const viewSectionMap: Record<string, () => void> = {
    "hero-video": () => setCustomerSection("hero"),
    "hero-cta": () => setCustomerSection("hero"),
    "menu-categories": () => setCustomerSection("menu"),
    "menu-item": () => setCustomerSection("menu"),
    "menu-add": () => setCustomerSection("menu"),
    "story-section": () => setCustomerSection("story"),
    "contact-info": () => setCustomerSection("contact"),
    "loyalty-wallet": () => setCustomerSection("contact"),
    "table-qr": () => setCustomerSection("contact"),
    "reservation": () => setCustomerSection("contact"),
    "admin-kpis": () => setAdminTab("home"),
    "admin-reviews-home": () => setAdminTab("home"),
    "admin-tokens": () => setAdminTab("home"),
    "admin-quick-actions": () => setAdminTab("home"),
    "admin-studio-menu": () => { setAdminTab("studio"); setAdminStudioSub("menu"); },
    "admin-studio-ai": () => { setAdminTab("studio"); setAdminStudioSub("ai"); },
    "admin-studio-design": () => { setAdminTab("studio"); setAdminStudioSub("design"); },
    "admin-studio-lang": () => { setAdminTab("studio"); setAdminStudioSub("lang"); },
    "admin-orders": () => { setAdminTab("orders"); setAdminOrdersSub("orders"); },
    "admin-tables": () => { setAdminTab("orders"); setAdminOrdersSub("tables"); },
    "admin-channels": () => { setAdminTab("orders"); setAdminOrdersSub("channels"); },
    "admin-reservations": () => { setAdminTab("orders"); setAdminOrdersSub("reservations"); },
    "admin-profit-panic": () => { setAdminTab("profit"); setAdminProfitSub("panic"); },
    "admin-profit-lost": () => { setAdminTab("profit"); setAdminProfitSub("clients"); },
    "admin-profit-reviews": () => { setAdminTab("profit"); setAdminProfitSub("reviews"); },
    "admin-more-grid": () => { setAdminTab("more"); setAdminMoreSection("grid"); },
    "admin-empire-assistant": () => setAdminTab("more"),
  };

  useEffect(() => {
    if (!autoTourActive) return;
    const seq = tourSequences[view];
    if (autoTourStep >= seq.length) {
      setAutoTourActive(false);
      setAutoTourStep(0);
      setActiveTooltip(null);
      setHighlightedElement(null);
      return;
    }
    const tipId = seq[autoTourStep];
    viewSectionMap[tipId]?.();
    setTimeout(() => {
      setActiveTooltip(tipId);
      setHighlightedElement(tipId);
    }, 200);
    const timer = setTimeout(() => setAutoTourStep(s => s + 1), 3500);
    return () => clearTimeout(timer);
  }, [autoTourActive, autoTourStep, view]);

  const startTour = () => {
    setAutoTourStep(0);
    setAutoTourActive(true);
  };

  const stopTour = () => {
    setAutoTourActive(false);
    setActiveTooltip(null);
    setHighlightedElement(null);
  };

  const toggleTooltip = (id: string) => {
    if (autoTourActive) return;
    setActiveTooltip(prev => prev === id ? null : id);
  };

  // Tooltip bubble component
  const TipBubble = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const tip = tooltips[id];
    if (!tip) return <>{children}</>;
    const isActive = activeTooltip === id;
    const isHighlighted = highlightedElement === id;
    return (
      <div className="relative">
        <div onClick={() => toggleTooltip(id)} className="cursor-pointer relative">
          {children}
          <AnimatePresence>
            {isHighlighted && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 pointer-events-none rounded-xl">
                <motion.div
                  animate={{ boxShadow: ["0 0 0 0px hsl(var(--primary) / 0.4)", "0 0 0 4px hsl(var(--primary) / 0.2)", "0 0 0 0px hsl(var(--primary) / 0.4)"] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 rounded-xl border-2 border-primary/60" />
                <motion.div animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 rounded-xl bg-primary/20" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: tip.position === "top" ? 8 : tip.position === "bottom" ? -8 : 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`absolute z-50 w-48 p-2 rounded-xl bg-primary text-primary-foreground text-[9px] leading-snug font-medium shadow-xl border border-primary-foreground/20 ${
                tip.position === "top" ? "bottom-full mb-2 left-1/2 -translate-x-1/2" :
                tip.position === "bottom" ? "top-full mt-2 left-1/2 -translate-x-1/2" :
                tip.position === "left" ? "right-full mr-2 top-1/2 -translate-y-1/2" :
                "left-full ml-2 top-1/2 -translate-y-1/2"
              }`}>
              <div className="flex items-start gap-1.5">
                <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                <span>{tip.text}</span>
              </div>
              <div className={`absolute w-2 h-2 bg-primary rotate-45 ${
                tip.position === "top" ? "top-full -mt-1 left-1/2 -translate-x-1/2" :
                tip.position === "bottom" ? "bottom-full -mb-1 left-1/2 -translate-x-1/2" :
                tip.position === "left" ? "left-full -ml-1 top-1/2 -translate-y-1/2" :
                "right-full -mr-1 top-1/2 -translate-y-1/2"
              }`} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Mini sub-tab component
  const MiniTabs = ({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) => (
    <div className="flex gap-0.5 overflow-x-auto scrollbar-hide mb-1.5 px-0.5">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`px-2 py-1 rounded-lg text-[7px] font-medium whitespace-nowrap transition-colors ${
            active === t.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
          }`}>
          {t.label}
        </button>
      ))}
    </div>
  );

  // ===== CUSTOMER VIEW =====
  const CustomerView = () => (
    <div className="h-full overflow-y-auto bg-background text-foreground text-[10px]">
      <div className="flex gap-0.5 px-1.5 py-1 bg-card/80 border-b border-border/30 sticky top-0 z-20">
        {([["hero", "🏠"], ["menu", "🍽️"], ["story", "📖"], ["contact", "📍"]] as [string, string][]).map(([id, icon]) => (
          <button key={id} onClick={() => setCustomerSection(id as any)}
            className={`flex-1 py-1.5 rounded-lg text-[9px] font-medium transition-colors ${customerSection === id ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            {icon}
          </button>
        ))}
      </div>

      {customerSection === "hero" && (
        <div className="relative">
          <TipBubble id="hero-video">
            <div className="relative h-44 overflow-hidden">
              <video src={heroVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <img src={restaurantLogo} alt="" className="w-10 h-10 rounded-xl mb-2" />
                <p className="font-display font-bold text-sm text-foreground tracking-widest uppercase">
                  {slug?.replace(/-/g, " ") || "Impero Roma"}
                </p>
                <p className="text-[8px] text-foreground/60 tracking-[0.2em] uppercase mt-0.5">Cucina Italiana d'Eccellenza</p>
              </div>
            </div>
          </TipBubble>
          <TipBubble id="hero-cta">
            <div className="flex justify-center -mt-4 relative z-10">
              <div className="px-6 py-2 border border-foreground/20 text-foreground text-[9px] tracking-widest uppercase font-medium bg-background/80 backdrop-blur-sm">
                Ordina Ora
              </div>
            </div>
          </TipBubble>
          <div className="px-2 py-3">
            <p className="text-[8px] text-primary uppercase tracking-widest font-medium mb-2">⭐ I più amati</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {DEMO_MENU.filter(i => i.popular).map((item, idx) => (
                <div key={idx} className="flex-shrink-0 w-20">
                  <img src={item.img} alt="" className="w-20 h-16 rounded-lg object-cover" />
                  <p className="text-[8px] font-medium mt-0.5 truncate">{item.name}</p>
                  <p className="text-[8px] text-primary font-bold">€{item.price}</p>
                </div>
              ))}
            </div>
          </div>
          <TipBubble id="table-qr">
            <div className="mx-2 p-2 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-[9px] font-bold text-foreground">🪑 Tavolo 5</p>
                <p className="text-[8px] text-muted-foreground">Ordina dal QR</p>
              </div>
              <Bell className="w-3.5 h-3.5 text-primary" />
            </div>
          </TipBubble>
        </div>
      )}

      {customerSection === "menu" && (
        <div className="px-2 py-2">
          <TipBubble id="menu-categories">
            <div className="flex gap-1 overflow-x-auto pb-2 mb-2">
              {["Antipasti", "Primi", "Pizze", "Secondi", "Dolci"].map(cat => (
                <button key={cat} onClick={() => setSelectedCat(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[8px] font-medium whitespace-nowrap ${selectedCat === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </TipBubble>
          <div className="space-y-1.5">
            {DEMO_MENU.filter(i => i.cat === selectedCat).map((item, idx) => (
              <TipBubble key={idx} id={idx === 0 ? "menu-item" : `item-${idx}`}>
                <div className="flex gap-2 p-2 rounded-xl bg-card">
                  <img src={item.img} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-[9px] font-medium truncate">{item.name}</p>
                      {item.popular && <Star className="w-2.5 h-2.5 text-primary fill-primary flex-shrink-0" />}
                    </div>
                    <p className="text-[8px] text-muted-foreground">Ingredienti freschi</p>
                    <p className="text-[9px] font-bold text-primary mt-0.5">€{item.price.toFixed(2)}</p>
                  </div>
                  <TipBubble id={idx === 0 ? "menu-add" : `add-${idx}`}>
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center self-center flex-shrink-0">
                      <Plus className="w-3 h-3 text-primary-foreground" />
                    </div>
                  </TipBubble>
                </div>
              </TipBubble>
            ))}
            {DEMO_MENU.filter(i => i.cat === selectedCat).length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-[9px]">Nessun piatto</div>
            )}
          </div>
        </div>
      )}

      {customerSection === "story" && (
        <TipBubble id="story-section">
          <div className="px-2 py-3">
            <p className="text-[8px] text-primary uppercase tracking-widest font-medium mb-1">La Nostra Storia</p>
            <p className="text-[10px] font-display font-bold mb-2">Passione per la cucina autentica</p>
            <img src={storyInterior} alt="" className="w-full h-28 rounded-xl object-cover mb-2" />
            <p className="text-[8px] text-muted-foreground leading-relaxed">
              Nel cuore della città, l'ospitalità italiana incontra l'eccellenza culinaria.
            </p>
          </div>
        </TipBubble>
      )}

      {customerSection === "contact" && (
        <div className="px-2 py-2 space-y-2">
          <TipBubble id="reservation">
            <div className="p-2.5 rounded-xl bg-card border border-border/30">
              <p className="text-[9px] font-bold mb-1.5 flex items-center gap-1"><CalendarDays className="w-3 h-3 text-primary" /> Prenota un Tavolo</p>
              <div className="grid grid-cols-2 gap-1 mb-1.5">
                <div className="px-2 py-1.5 rounded-lg bg-secondary text-[8px] text-muted-foreground">📅 Data</div>
                <div className="px-2 py-1.5 rounded-lg bg-secondary text-[8px] text-muted-foreground">⏰ Ora</div>
                <div className="px-2 py-1.5 rounded-lg bg-secondary text-[8px] text-muted-foreground">👤 Nome</div>
                <div className="px-2 py-1.5 rounded-lg bg-secondary text-[8px] text-muted-foreground">📱 Tel</div>
              </div>
              <div className="w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-center text-[8px] font-medium">Prenota</div>
            </div>
          </TipBubble>
          <TipBubble id="contact-info">
            <div className="p-2.5 rounded-xl bg-card border border-border/30 space-y-1.5">
              <p className="text-[9px] font-bold">📍 Contatti & Orari</p>
              <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground"><MapPin className="w-3 h-3 text-primary" /> Via del Corso 42, Roma</div>
              <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground"><Phone className="w-3 h-3 text-primary" /> +39 06 1234 5678</div>
              <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground"><Clock className="w-3 h-3 text-primary" /> Lun-Ven 12-15 · 19-23:30</div>
            </div>
          </TipBubble>
          <TipBubble id="loyalty-wallet">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-[9px] font-bold text-foreground">Wallet Fedeltà</p>
                  <p className="text-[8px] text-muted-foreground">Coupon nel telefono</p>
                </div>
              </div>
              <div className="flex gap-1 mt-1.5">
                <div className="flex-1 py-1 rounded-lg bg-primary/10 text-center text-[7px] text-primary font-medium">🎫 -10%</div>
                <div className="flex-1 py-1 rounded-lg bg-primary/10 text-center text-[7px] text-primary font-medium">🎂 Dessert</div>
              </div>
            </div>
          </TipBubble>
        </div>
      )}
    </div>
  );

  // ===== ADMIN VIEW =====
  const AdminView = () => (
    <div className="h-full flex flex-col bg-background text-foreground text-[10px]">
      {/* Admin header */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/30 bg-card/50 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <img src={restaurantLogo} alt="" className="w-5 h-5 rounded-lg flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[9px] font-bold truncate">Impero Roma</p>
            <p className="text-[7px] text-primary">{["Home", "Studio", "Ordini", "Profitto", "Altro"][["home", "studio", "orders", "profit", "more"].indexOf(adminTab)]}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2 py-2 pb-10 min-h-0">
        {/* ===== HOME ===== */}
        {adminTab === "home" && (
          <div className="space-y-2">
            <TipBubble id="admin-kpis">
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Incasso Oggi", value: "€847", icon: "💰" },
                  { label: "Ordini Attivi", value: "3", icon: "📦", dot: true },
                  { label: "Piatti Menu", value: "24", icon: "🍽️" },
                  { label: "In Cucina", value: "2", icon: "👨‍🍳", dot: true },
                ].map((kpi, i) => (
                  <div key={i} className="p-2 rounded-xl bg-card border border-border/30">
                    <p className="text-[7px] text-muted-foreground">{kpi.icon} {kpi.label}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-display font-bold text-foreground">{kpi.value}</p>
                      {kpi.dot && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                    </div>
                  </div>
                ))}
              </div>
            </TipBubble>
            <TipBubble id="admin-reviews-home">
              <div className="grid grid-cols-2 gap-1.5">
                <div className="p-2 rounded-xl bg-card border border-border/30">
                  <div className="flex items-center gap-1 mb-0.5"><Star className="w-2.5 h-2.5 text-primary" /><span className="text-[7px] text-muted-foreground">Reviews</span></div>
                  <p className="text-sm font-display font-bold text-primary">4.8</p>
                  <p className="text-[6px] text-muted-foreground">(32)</p>
                </div>
                <div className="p-2 rounded-xl bg-card border border-border/30">
                  <div className="flex items-center gap-1 mb-0.5"><CalendarDays className="w-2.5 h-2.5 text-primary" /><span className="text-[7px] text-muted-foreground">Prenotazioni</span></div>
                  <p className="text-sm font-display font-bold text-foreground">4</p>
                  <div className="flex items-center gap-0.5"><div className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" /><span className="text-[6px] text-amber-400">2 da confermare</span></div>
                </div>
              </div>
            </TipBubble>
            <TipBubble id="admin-tokens">
              <div className="p-2 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0"><Sparkles className="w-3 h-3 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[8px] font-medium">Gettoni IA</p>
                  <p className="text-[6px] text-muted-foreground truncate">Menu, Foto, Traduzioni</p>
                </div>
                <span className="text-sm font-display font-bold text-primary flex-shrink-0">5</span>
                <div className="px-1.5 py-0.5 rounded-lg bg-primary text-primary-foreground text-[7px] font-bold flex-shrink-0">+50</div>
              </div>
            </TipBubble>
            <TipBubble id="admin-quick-actions">
              <div className="grid grid-cols-2 gap-1">
                <div className="p-2 rounded-xl bg-secondary/50 flex items-center gap-1.5 text-[8px]">
                  <ExternalLink className="w-3 h-3 text-primary flex-shrink-0" /> Vedi Menu
                </div>
                <div className="p-2 rounded-xl bg-secondary/50 flex items-center gap-1.5 text-[8px]">
                  <ChefHat className="w-3 h-3 text-primary flex-shrink-0" /> Cucina
                </div>
              </div>
            </TipBubble>
          </div>
        )}

        {/* ===== STUDIO ===== */}
        {adminTab === "studio" && (
          <div className="space-y-2">
            <MiniTabs tabs={[
              { id: "menu", label: "Menu" },
              { id: "design", label: "Design" },
              { id: "ai", label: "IA" },
              { id: "lang", label: "Lingue" },
            ]} active={adminStudioSub} onChange={id => setAdminStudioSub(id as any)} />

            {adminStudioSub === "menu" && (
              <TipBubble id="admin-studio-menu">
                <div className="p-2 rounded-xl bg-card border border-border/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[8px] font-bold flex items-center gap-1"><UtensilsCrossed className="w-3 h-3 text-primary" /> Menu</p>
                    <div className="flex items-center gap-1">
                      <div className="px-1.5 py-0.5 rounded-lg bg-secondary text-[7px]"><Search className="w-2 h-2 inline" /> Cerca</div>
                      <div className="px-1.5 py-0.5 rounded-lg bg-primary text-primary-foreground text-[7px]">+ Nuovo</div>
                    </div>
                  </div>
                  {DEMO_MENU.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 py-1 border-b border-border/10 last:border-0">
                      <img src={item.img} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[8px] font-medium truncate">{item.name}</p>
                        <p className="text-[7px] text-primary font-bold">€{item.price}</p>
                      </div>
                      <div className="flex gap-0.5 flex-shrink-0">
                        <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center"><span className="text-[7px]">✏️</span></div>
                        <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center"><Wand2 className="w-2.5 h-2.5 text-primary" /></div>
                        <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center"><span className="text-[7px]">🗑️</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </TipBubble>
            )}

            {adminStudioSub === "design" && (
              <TipBubble id="admin-studio-design">
                <div className="p-2 rounded-xl bg-card border border-border/30">
                  <p className="text-[8px] font-bold mb-1.5 flex items-center gap-1"><Palette className="w-3 h-3 text-primary" /> Design</p>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-xl border-2 border-primary" style={{ backgroundColor: primaryColor || "#C8963E" }} />
                    <div className="flex gap-1 flex-wrap">
                      {["#C8963E", "#E74C3C", "#2ECC71", "#3498DB", "#9B59B6", "#1ABC9C"].map(c => (
                        <div key={c} className="w-4 h-4 rounded-full border border-border/30" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="px-2 py-1.5 rounded-lg bg-secondary text-[7px] text-muted-foreground flex items-center gap-1"><Upload className="w-2.5 h-2.5" /> Logo</div>
                    <div className="px-2 py-1.5 rounded-lg bg-secondary text-[7px] text-muted-foreground">📝 Tagline...</div>
                  </div>
                  <div className="mt-1.5 w-full py-1.5 rounded-lg bg-primary/10 text-primary text-center text-[7px] font-medium flex items-center justify-center gap-1"><Eye className="w-2.5 h-2.5" /> Preview Live</div>
                </div>
              </TipBubble>
            )}

            {adminStudioSub === "ai" && (
              <TipBubble id="admin-studio-ai">
                <div className="p-2 rounded-xl bg-card border border-primary/20 border-dashed text-center">
                  <Sparkles className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-[8px] font-bold">AI Menu Creator</p>
                  <p className="text-[7px] text-muted-foreground">📸 Foto → OCR → Menu in 60s</p>
                  <div className="mt-1.5 w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-[8px] font-medium">📷 Scatta o Carica</div>
                </div>
              </TipBubble>
            )}

            {adminStudioSub === "lang" && (
              <TipBubble id="admin-studio-lang">
                <div className="p-2 rounded-xl bg-card border border-border/30">
                  <p className="text-[8px] font-bold mb-1.5 flex items-center gap-1"><Globe className="w-3 h-3 text-primary" /> Lingue</p>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { flag: "🇮🇹", code: "IT", active: true }, { flag: "🇬🇧", code: "EN", active: true },
                      { flag: "🇩🇪", code: "DE", active: false }, { flag: "🇫🇷", code: "FR", active: false },
                      { flag: "🇪🇸", code: "ES", active: false }, { flag: "🇨🇳", code: "中", active: false },
                      { flag: "🇯🇵", code: "日", active: false }, { flag: "🇸🇦", code: "عر", active: false },
                    ].map(l => (
                      <div key={l.code} className={`p-1.5 rounded-lg text-center ${l.active ? "bg-primary/10 border border-primary/30" : "bg-secondary"}`}>
                        <span className="text-sm">{l.flag}</span>
                        <p className="text-[6px] mt-0.5">{l.code}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-1.5 w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-[7px] font-medium text-center">🤖 Traduci Selezionate</div>
                </div>
              </TipBubble>
            )}
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {adminTab === "orders" && (
          <div className="space-y-2">
            <MiniTabs tabs={[
              { id: "orders", label: "Cucina" },
              { id: "tables", label: "Tavoli" },
              { id: "channels", label: "Canali" },
              { id: "reservations", label: "Prenota" },
            ]} active={adminOrdersSub} onChange={id => setAdminOrdersSub(id as any)} />

            {adminOrdersSub === "orders" && (
              <TipBubble id="admin-orders">
                <div className="space-y-1.5">
                  {/* Kitchen PIN */}
                  <div className="p-2 rounded-xl bg-secondary/50">
                    <p className="text-[7px] text-muted-foreground flex items-center gap-1"><Key className="w-2.5 h-2.5" /> PIN Staff</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] font-mono text-foreground">4821</span>
                      <span className="text-[6px] text-green-400">Operativo</span>
                    </div>
                  </div>
                  {DEMO_ORDERS.map((order, i) => (
                    <div key={i} className={`p-2 rounded-xl border ${order.status === "pending" ? "border-amber-500/20 bg-amber-500/5" : order.status === "preparing" ? "border-blue-500/20 bg-blue-500/5" : "border-green-500/20 bg-green-500/5"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] font-bold">#{order.id.slice(0, 6)}</span>
                          <span className={`px-1 py-0.5 rounded text-[6px] font-medium ${order.status === "pending" ? "bg-amber-500/20 text-amber-400" : order.status === "preparing" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}`}>
                            {order.status === "pending" ? "⏳ Attesa" : order.status === "preparing" ? "🔥 Prep." : "✅ Pronto"}
                          </span>
                        </div>
                        <span className="text-[7px] text-muted-foreground">{order.time}</span>
                      </div>
                      <p className="text-[7px] text-muted-foreground truncate">{order.customer} · {order.type === "table" ? `Tav.${order.table}` : order.type === "delivery" ? "🛵" : "🥡"}</p>
                      <div className={`mt-1 w-full py-1.5 rounded-lg text-center text-[7px] font-bold ${
                        order.status === "pending" ? "bg-blue-500/20 text-blue-400" :
                        order.status === "preparing" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
                      }`}>
                        {order.status === "pending" ? "🔥 Prepara" : order.status === "preparing" ? "✅ Pronto" : "📦 Consegnato"}
                      </div>
                    </div>
                  ))}
                </div>
              </TipBubble>
            )}

            {adminOrdersSub === "tables" && (
              <TipBubble id="admin-tables">
                <div className="p-2 rounded-xl bg-card border border-border/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[8px] font-bold">🗺️ Mappa Tavoli</p>
                    <div className="flex gap-1">
                      <div className="px-1.5 py-0.5 rounded bg-secondary text-[6px]"><Move className="w-2 h-2 inline" /> Layout</div>
                      <div className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[6px]">+ Tavolo</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {[1,2,3,4,5,6,7,8].map(t => (
                      <div key={t} className={`p-1.5 rounded-lg text-center text-[7px] font-medium ${t === 5 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : t === 3 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
                        T{t}
                        {t === 3 && <span className="block text-[6px]">🔔</span>}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-1 text-[6px] text-muted-foreground">
                    <span>🟢 Libero</span><span>🟡 Occupato</span><span>🔴 Chiamata</span>
                  </div>
                  {/* Table QR download row */}
                  <div className="mt-1.5 flex items-center gap-1.5 p-1.5 rounded-lg bg-secondary/50">
                    <QrCode className="w-3 h-3 text-primary flex-shrink-0" />
                    <span className="text-[7px] flex-1">QR per ogni tavolo</span>
                    <Download className="w-3 h-3 text-primary" />
                  </div>
                </div>
              </TipBubble>
            )}

            {adminOrdersSub === "channels" && (
              <TipBubble id="admin-channels">
                <div className="space-y-1.5">
                  {[
                    { label: "🚗 Consegna", on: true },
                    { label: "🥡 Asporto", on: true },
                    { label: "🪑 Tavolo", on: true },
                  ].map(ch => (
                    <div key={ch.label} className="flex items-center justify-between p-2 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${ch.on ? "bg-green-400" : "bg-red-400"}`} />
                        <span className="text-[8px] font-medium">{ch.label}</span>
                      </div>
                      <div className={`w-7 h-4 rounded-full flex items-center px-0.5 ${ch.on ? "bg-primary/30 justify-end" : "bg-muted justify-start"}`}>
                        <div className={`w-3 h-3 rounded-full ${ch.on ? "bg-primary" : "bg-muted-foreground/40"}`} />
                      </div>
                    </div>
                  ))}
                  <div className="p-2 rounded-xl bg-card border border-border/30">
                    <p className="text-[7px] text-muted-foreground flex items-center gap-1 mb-1"><BarChart3 className="w-2.5 h-2.5" /> Fonti Ordini</p>
                    <div className="space-y-0.5">
                      {[{ s: "Diretto", c: 45 }, { s: "QR Tavolo", c: 32 }, { s: "Google", c: 18 }].map(f => (
                        <div key={f.s} className="flex items-center gap-1.5">
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${f.c}%` }} /></div>
                          <span className="text-[6px] text-muted-foreground w-8 text-right">{f.s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TipBubble>
            )}

            {adminOrdersSub === "reservations" && (
              <TipBubble id="admin-reservations">
                <div className="space-y-1.5">
                  <div className="grid grid-cols-3 gap-1">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-center"><p className="text-sm font-bold text-amber-400">2</p><p className="text-[6px] text-muted-foreground">Attesa</p></div>
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-center"><p className="text-sm font-bold text-emerald-400">4</p><p className="text-[6px] text-muted-foreground">Confermate</p></div>
                    <div className="p-1.5 rounded-lg bg-red-500/10 text-center"><p className="text-sm font-bold text-red-400">1</p><p className="text-[6px] text-muted-foreground">Rifiutate</p></div>
                  </div>
                  {[
                    { name: "Marco R.", date: "Oggi", time: "20:30", guests: 4, status: "pending" },
                    { name: "Laura B.", date: "Domani", time: "21:00", guests: 2, status: "pending" },
                    { name: "Giovanni P.", date: "Ven 28", time: "20:00", guests: 6, status: "confirmed" },
                  ].map((res, i) => (
                    <div key={i} className={`p-2 rounded-xl border ${res.status === "pending" ? "border-amber-500/30 bg-amber-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`}>
                      <div className="flex justify-between items-start mb-0.5">
                        <p className="text-[8px] font-bold truncate">{res.name}</p>
                        <p className="text-[8px] font-bold text-primary flex-shrink-0">{res.date}</p>
                      </div>
                      <p className="text-[7px] text-muted-foreground">🕐 {res.time} · 👥 {res.guests} ospiti</p>
                      {res.status === "pending" && (
                        <div className="flex gap-1 mt-1">
                          <div className="flex-1 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-center text-[7px] font-bold flex items-center justify-center gap-0.5"><CheckCircle2 className="w-2.5 h-2.5" /> Sì</div>
                          <div className="flex-1 py-1 rounded-lg bg-red-500/20 text-red-400 text-center text-[7px] font-bold flex items-center justify-center gap-0.5"><XCircle className="w-2.5 h-2.5" /> No</div>
                        </div>
                      )}
                      {res.status === "confirmed" && (
                        <div className="mt-1 flex items-center gap-1 text-[6px] text-emerald-400"><CheckCircle2 className="w-2.5 h-2.5" /> Confermata</div>
                      )}
                    </div>
                  ))}
                </div>
              </TipBubble>
            )}
          </div>
        )}

        {/* ===== PROFIT ===== */}
        {adminTab === "profit" && (
          <div className="space-y-2">
            <MiniTabs tabs={[
              { id: "panic", label: "Panic" },
              { id: "clients", label: "Clienti" },
              { id: "reviews", label: "Reviews" },
            ]} active={adminProfitSub} onChange={id => setAdminProfitSub(id as any)} />

            {adminProfitSub === "panic" && (
              <TipBubble id="admin-profit-panic">
                <div className="p-2 rounded-xl bg-card border border-border/30">
                  <p className="text-[8px] font-bold mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-400" /> Panic Mode</p>
                  <p className="text-[7px] text-muted-foreground mb-1.5">Variazione % istantanea su tutti i prezzi</p>
                  <div className="text-center mb-1.5">
                    <span className="text-lg font-display font-bold text-amber-400">-15%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[7px]">-30%</span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full relative">
                      <div className="absolute left-[25%] top-0 h-full w-[25%] bg-amber-500 rounded-full" />
                      <div className="absolute left-[25%] top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full border-2 border-background" />
                    </div>
                    <span className="text-[7px]">+30%</span>
                  </div>
                  <div className="mt-1.5 w-full py-1.5 rounded-lg bg-red-500/20 text-red-400 text-center text-[8px] font-bold">⚡ Applica a 24 piatti</div>
                </div>
              </TipBubble>
            )}

            {adminProfitSub === "clients" && (
              <TipBubble id="admin-profit-lost">
                <div className="p-2 rounded-xl bg-card border border-border/30">
                  <p className="text-[8px] font-bold mb-1 flex items-center gap-1"><Users className="w-3 h-3 text-red-400" /> Clienti Persi</p>
                  <div className="space-y-1">
                    {[{ name: "Luca M.", days: 45, spent: "€320" }, { name: "Sara T.", days: 38, spent: "€180" }, { name: "Paolo V.", days: 62, spent: "€450" }].map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-red-500/5">
                        <div className="min-w-0">
                          <p className="text-[8px] font-medium truncate">{c.name}</p>
                          <p className="text-[6px] text-muted-foreground">{c.days}gg · {c.spent}</p>
                        </div>
                        <div className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[6px] font-medium flex-shrink-0">📲 Push</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TipBubble>
            )}

            {adminProfitSub === "reviews" && (
              <TipBubble id="admin-profit-reviews">
                <div className="p-2 rounded-xl bg-card border border-border/30">
                  <p className="text-[8px] font-bold mb-1 flex items-center gap-1"><Shield className="w-3 h-3 text-primary" /> Review Shield™</p>
                  <div className="grid grid-cols-3 gap-1 mb-1.5">
                    <div className="p-1 rounded-lg bg-card text-center"><p className="text-sm font-bold text-primary">4.8</p><p className="text-[6px] text-muted-foreground">Media</p></div>
                    <div className="p-1 rounded-lg bg-card text-center"><p className="text-sm font-bold text-foreground">32</p><p className="text-[6px] text-muted-foreground">Totali</p></div>
                    <div className="p-1 rounded-lg bg-card text-center"><p className="text-sm font-bold text-green-400">94%</p><p className="text-[6px] text-muted-foreground">Positive</p></div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-green-500/5">
                      <div className="flex items-center gap-1"><div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-2 h-2 text-primary fill-primary" />)}</div><span className="text-[7px]">Marco R.</span></div>
                      <span className="text-[6px] text-green-400 flex items-center gap-0.5"><ExternalLink className="w-2 h-2" /> Google</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-red-500/5">
                      <div className="flex items-center gap-1"><div className="flex">{[...Array(2)].map((_, i) => <Star key={i} className="w-2 h-2 text-destructive fill-destructive" />)}{[...Array(3)].map((_, i) => <Star key={i} className="w-2 h-2 text-muted-foreground" />)}</div><span className="text-[7px]">Anna L.</span></div>
                      <span className="text-[6px] text-red-400">🔒 Privata</span>
                    </div>
                  </div>
                </div>
              </TipBubble>
            )}
          </div>
        )}

        {/* ===== MORE ===== */}
        {adminTab === "more" && (
          <div className="space-y-2">
            {adminMoreSection === "grid" && (
              <TipBubble id="admin-more-grid">
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "qr" as const, icon: <QrCode className="w-4 h-4" />, label: "QR Code", color: "text-primary" },
                    { id: "vault" as const, icon: <Lock className="w-4 h-4" />, label: "Vault", color: "text-green-400" },
                    { id: "chat" as const, icon: <MessageSquare className="w-4 h-4" />, label: "Chat", color: "text-blue-400" },
                    { id: "blacklist" as const, icon: <ShieldBan className="w-4 h-4" />, label: "Blacklist", color: "text-red-400" },
                    { id: "inventory" as const, icon: <Package className="w-4 h-4" />, label: "AI Scorte", color: "text-purple-400" },
                    { id: "academy" as const, icon: <GraduationCap className="w-4 h-4" />, label: "Academy", color: "text-amber-400" },
                    { id: "settings" as const, icon: <Settings className="w-4 h-4" />, label: "Settings", color: "text-muted-foreground" },
                  ].map(item => (
                    <button key={item.id} onClick={() => setAdminMoreSection(item.id)}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl bg-card border border-border/30 hover:border-primary/20">
                      <span className={item.color}>{item.icon}</span>
                      <span className="text-[7px] font-medium text-foreground">{item.label}</span>
                    </button>
                  ))}
                </div>
              </TipBubble>
            )}

            {adminMoreSection !== "grid" && (
              <button onClick={() => setAdminMoreSection("grid")} className="flex items-center gap-1 text-[8px] text-muted-foreground mb-1">
                <ChevronDown className="w-2.5 h-2.5 rotate-90" /> Menu
              </button>
            )}

            {adminMoreSection === "qr" && (
              <TipBubble id="admin-more-qr">
                <div className="p-2 rounded-xl bg-card border border-border/30 text-center space-y-1.5">
                  <QrCode className="w-6 h-6 mx-auto text-primary" />
                  <p className="text-[8px] font-bold">QR Code Menu</p>
                  <div className="w-16 h-16 mx-auto bg-white rounded-lg p-1"><div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] bg-cover rounded" /></div>
                  <div className="flex gap-1">
                    <div className="flex-1 py-1 rounded-lg bg-primary text-primary-foreground text-[7px] font-medium">📥 Scarica</div>
                    <div className="flex-1 py-1 rounded-lg bg-secondary text-[7px]">🔗 Apri</div>
                  </div>
                  <p className="text-[6px] text-muted-foreground">+ QR dedicato per ogni tavolo</p>
                </div>
              </TipBubble>
            )}

            {adminMoreSection === "vault" && (
              <TipBubble id="admin-more-vault">
                <div className="space-y-1.5">
                  <div className="p-2 rounded-xl bg-green-500/5 border border-green-500/20 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400 flex-shrink-0" />
                    <div className="min-w-0"><p className="text-[8px] font-medium">Vault operativo</p><p className="text-[6px] text-muted-foreground truncate">Scontrino.it · AES-256</p></div>
                  </div>
                  <div className="p-2 rounded-xl bg-card border border-border/30">
                    <div className="flex items-center gap-1.5 mb-1"><Bot className="w-3 h-3 text-primary" /><span className="text-[8px] font-bold">AI-Mary</span></div>
                    <div className="space-y-0.5">
                      <div className="px-2 py-1 rounded-lg bg-secondary text-[7px] text-muted-foreground max-w-[85%]">Come configuro Aruba?</div>
                      <div className="px-2 py-1 rounded-lg bg-primary/10 text-[7px] text-foreground max-w-[85%] ml-auto">📋 Accedi a fatturaaruba.it...</div>
                    </div>
                  </div>
                </div>
              </TipBubble>
            )}

            {adminMoreSection === "chat" && (
              <TipBubble id="admin-more-chat">
                <div className="p-2 rounded-xl bg-card border border-border/30">
                  <p className="text-[8px] font-bold mb-1.5 flex items-center gap-1"><MessageSquare className="w-3 h-3 text-blue-400" /> Chat Privata</p>
                  <div className="space-y-1 mb-1.5">
                    <div className="px-2 py-1 rounded-lg bg-secondary text-[7px] max-w-[80%]">Ciao, posso prenotare per 8?</div>
                    <div className="px-2 py-1 rounded-lg bg-primary text-primary-foreground text-[7px] max-w-[80%] ml-auto">Certo! Per quando?</div>
                    <div className="px-2 py-1 rounded-lg bg-secondary text-[7px] max-w-[80%]">Venerdì sera alle 21</div>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex-1 h-6 rounded-lg bg-secondary" />
                    <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center"><Send className="w-2.5 h-2.5 text-primary-foreground" /></div>
                  </div>
                </div>
              </TipBubble>
            )}

            {adminMoreSection === "blacklist" && (
              <TipBubble id="admin-more-blacklist">
                <div className="p-2 rounded-xl bg-card border border-border/30">
                  <p className="text-[8px] font-bold mb-1.5 flex items-center gap-1"><ShieldBan className="w-3 h-3 text-red-400" /> Blacklist</p>
                  <div className="space-y-1 mb-1.5">
                    {[{ phone: "+39 333 ****", name: "Cliente X", reason: "No-show ripetuti" }].map((b, i) => (
                      <div key={i} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-red-500/5">
                        <ShieldBan className="w-3 h-3 text-red-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0"><p className="text-[7px] font-medium truncate">{b.name}</p><p className="text-[6px] text-muted-foreground truncate">{b.reason}</p></div>
                        <span className="text-[6px] text-primary">Sblocca</span>
                      </div>
                    ))}
                  </div>
                  <div className="w-full py-1 rounded-lg bg-red-500/10 text-red-400 text-center text-[7px] font-medium">🚫 Blocca Numero</div>
                </div>
              </TipBubble>
            )}

            {adminMoreSection === "inventory" && (
              <TipBubble id="admin-more-inventory">
                <div className="p-2 rounded-xl bg-card border border-border/30 text-center">
                  <Package className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                  <p className="text-[8px] font-bold">AI Inventory</p>
                  <p className="text-[7px] text-muted-foreground mb-1.5">Analisi scorte e piatto del giorno</p>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between p-1 rounded-lg bg-red-500/5">
                      <span className="text-[7px]">🔴 Mozzarella</span>
                      <span className="text-[6px] text-muted-foreground">~2gg</span>
                    </div>
                    <div className="flex items-center justify-between p-1 rounded-lg bg-amber-500/5">
                      <span className="text-[7px]">🟡 Basilico</span>
                      <span className="text-[6px] text-muted-foreground">~5gg</span>
                    </div>
                  </div>
                  <div className="mt-1.5 p-1.5 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-[6px] text-primary uppercase tracking-wider">🍽️ Piatto del Giorno</p>
                    <p className="text-[8px] font-bold">Caprese Speciale</p>
                  </div>
                </div>
              </TipBubble>
            )}

            {adminMoreSection === "academy" && (
              <TipBubble id="admin-more-academy">
                <div className="p-2 rounded-xl bg-card border border-border/30">
                  <p className="text-[8px] font-bold mb-1.5 flex items-center gap-1"><GraduationCap className="w-3 h-3 text-amber-400" /> Academy</p>
                  {[
                    { t: "📸 Fotografare piatti", done: true },
                    { t: "✍️ Copywriting", done: true },
                    { t: "📱 Instagram Stories", done: false },
                    { t: "🔥 Promozioni flash", done: false },
                  ].map((l, i) => (
                    <div key={i} className={`flex items-center gap-1.5 p-1.5 rounded-lg mb-0.5 ${l.done ? "bg-primary/10" : "bg-secondary/50"}`}>
                      <span className="text-[7px] flex-1">{l.t}</span>
                      {l.done && <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </TipBubble>
            )}

            {adminMoreSection === "settings" && (
              <TipBubble id="admin-more-settings">
                <div className="p-2 rounded-xl bg-card border border-border/30 space-y-1.5">
                  <p className="text-[8px] font-bold flex items-center gap-1"><Settings className="w-3 h-3 text-muted-foreground" /> Impostazioni</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-secondary/50"><Phone className="w-2.5 h-2.5 text-primary" /><span className="text-[7px]">+39 06 1234 5678</span></div>
                    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-secondary/50"><Mail className="w-2.5 h-2.5 text-primary" /><span className="text-[7px]">info@impero.it</span></div>
                    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-secondary/50"><MapPin className="w-2.5 h-2.5 text-primary" /><span className="text-[7px]">Via del Corso 42</span></div>
                    <div className="flex items-center gap-1.5 p-1 rounded-lg bg-secondary/50"><Clock className="w-2.5 h-2.5 text-primary" /><span className="text-[7px]">Lun-Ven 12-23:30</span></div>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 rounded-lg bg-green-500/5 border border-green-500/20">
                    <FileCheck className="w-2.5 h-2.5 text-green-400" /><span className="text-[7px] text-green-400">Policy accettate ✓</span>
                  </div>
                </div>
              </TipBubble>
            )}
          </div>
        )}
      </div>

      {/* Empire Assistant FAB */}
      <TipBubble id="admin-empire-assistant">
        <div className="absolute bottom-9 right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg z-20">
          <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      </TipBubble>

      {/* Admin bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 flex bg-card/95 border-t border-border/30 backdrop-blur-sm">
        {([
          { id: "home", icon: <LayoutDashboard className="w-3.5 h-3.5" />, label: "Home" },
          { id: "studio", icon: <UtensilsCrossed className="w-3.5 h-3.5" />, label: "Studio" },
          { id: "orders", icon: <ShoppingCart className="w-3.5 h-3.5" />, label: "Ordini" },
          { id: "profit", icon: <TrendingUp className="w-3.5 h-3.5" />, label: "Profitto" },
          { id: "more", icon: <Crown className="w-3.5 h-3.5" />, label: "Altro" },
        ] as { id: typeof adminTab; icon: React.ReactNode; label: string }[]).map(tab => (
          <button key={tab.id} onClick={() => { setAdminTab(tab.id); if (tab.id === "more") setAdminMoreSection("grid"); }}
            className={`flex-1 flex flex-col items-center py-1.5 ${adminTab === tab.id ? "text-primary" : "text-muted-foreground"}`}>
            {tab.icon}
            <span className="text-[7px] mt-0.5">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ===== KITCHEN VIEW =====
  const KitchenViewDemo = () => (
    <div className="h-full overflow-y-auto bg-background text-foreground text-[10px]">
      <TipBubble id="kitchen-header">
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/30 sticky top-0 bg-background z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
              <ChefHat className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-[9px] font-bold">Cucina</p>
              <p className="text-[7px] text-primary">3 ordini attivi</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
              <Volume2 className="w-3 h-3 text-primary" />
            </div>
          </div>
        </div>
      </TipBubble>

      <TipBubble id="kitchen-counters">
        <div className="grid grid-cols-3 gap-1 px-2 py-1.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-center"><p className="text-sm font-bold text-amber-400">1</p><p className="text-[7px] text-muted-foreground">Attesa</p></div>
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-center"><p className="text-sm font-bold text-blue-400">1</p><p className="text-[7px] text-muted-foreground">Preparazione</p></div>
          <div className="p-1.5 rounded-lg bg-green-500/10 text-center"><p className="text-sm font-bold text-green-400">1</p><p className="text-[7px] text-muted-foreground">Pronto</p></div>
        </div>
      </TipBubble>

      <TipBubble id="kitchen-realtime">
        <div className="mx-2 mb-1.5 p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-center">
          <p className="text-[7px] text-primary font-medium">🔴 Live — Real-time con alert sonori</p>
        </div>
      </TipBubble>

      <div className="px-2 space-y-1.5 pb-4">
        {DEMO_ORDERS.map((order, i) => (
          <TipBubble key={i} id={i === 0 ? "kitchen-order" : `korder-${i}`}>
            <div className={`p-2 rounded-xl border ${order.status === "pending" ? "border-amber-500/20 bg-amber-500/5" : order.status === "preparing" ? "border-blue-500/20 bg-blue-500/5" : "border-green-500/20 bg-green-500/5"}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-bold">#{order.id.slice(0, 6)}</span>
                  <span className={`px-1 py-0.5 rounded text-[6px] font-medium ${order.status === "pending" ? "bg-amber-500/20 text-amber-400" : order.status === "preparing" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400"}`}>
                    {order.status === "pending" ? "⏳ Attesa" : order.status === "preparing" ? "🔥 Prep." : "✅ Pronto"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <TipBubble id={i === 0 ? "kitchen-print" : `kprint-${i}`}>
                    <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center">
                      <Printer className="w-2.5 h-2.5 text-muted-foreground" />
                    </div>
                  </TipBubble>
                  <span className="text-[7px] text-muted-foreground">{order.time}</span>
                </div>
              </div>
              <p className="text-[7px] text-muted-foreground mb-1 truncate">
                {order.customer} · {order.type === "table" ? `🪑 Tav.${order.table}` : order.type === "delivery" ? "🛵 Delivery" : "🥡 Asporto"}
              </p>
              <div className="space-y-0.5 mb-1.5">
                {order.items.map((item, j) => (
                  <div key={j} className="flex justify-between text-[8px]">
                    <span className="font-medium">{item.qty}× {item.name}</span>
                    <span className="text-muted-foreground">€{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {order.notes && <p className="text-[7px] text-amber-400 bg-amber-500/10 px-1.5 py-1 rounded-lg mb-1.5">📝 {order.notes}</p>}
              <TipBubble id={i === 0 ? "kitchen-actions" : `kaction-${i}`}>
                <div className={`w-full py-2 rounded-xl text-center text-[8px] font-bold ${
                  order.status === "pending" ? "bg-blue-500/20 text-blue-400" :
                  order.status === "preparing" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
                }`}>
                  {order.status === "pending" ? "🔥 Inizia Preparazione" : order.status === "preparing" ? "✅ Pronto" : "📦 Consegnato"}
                </div>
              </TipBubble>
            </div>
          </TipBubble>
        ))}
      </div>
    </div>
  );

  const swipeToView = (direction: 1 | -1) => {
    const currentIdx = VIEWS.indexOf(view);
    const nextIdx = currentIdx + direction;
    if (nextIdx >= 0 && nextIdx < VIEWS.length) {
      setSwipeDirection(direction);
      setView(VIEWS[nextIdx]);
      setActiveTooltip(null);
      setHighlightedElement(null);
      stopTour();
    }
  };

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 50;
    if (info.offset.x < -threshold || info.velocity.x < -200) {
      swipeToView(1);
    } else if (info.offset.x > threshold || info.velocity.x > 200) {
      swipeToView(-1);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const currentViewIndex = VIEWS.indexOf(view);

  return (
    <motion.div className={compact ? "space-y-2" : "space-y-3 mt-2"} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header — only in full mode */}
      {!compact && (
        <div className="text-center py-1">
          <Smartphone className="w-8 h-8 mx-auto mb-1 text-primary" />
          <h3 className="text-base font-display font-bold text-foreground">Live Preview Completa</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Swipe per cambiare vista · Tocca per i dettagli</p>
        </div>
      )}

      {/* Swipe dot indicators + labels */}
      <div className="flex items-center justify-center gap-3">
        {VIEWS.map((v, i) => (
          <button key={v}
            onClick={() => { setSwipeDirection(i > currentViewIndex ? 1 : -1); setView(v); setActiveTooltip(null); setHighlightedElement(null); stopTour(); }}
            className={`flex items-center gap-1.5 transition-all ${view === v ? "opacity-100" : "opacity-40"}`}>
            <div className={`rounded-full transition-all ${view === v ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-muted-foreground"}`} />
            <span className={`text-[9px] font-medium transition-all ${view === v ? "text-primary" : "text-muted-foreground"}`}>
              {VIEW_LABELS[v]}
            </span>
          </button>
        ))}
      </div>

      {/* Auto-tour & open app buttons — only in full mode */}
      {!compact && (
        <div className="flex justify-center gap-2">
          <button onClick={autoTourActive ? stopTour : startTour}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium min-h-[36px] ${
              autoTourActive ? "bg-destructive text-destructive-foreground" : "bg-primary/10 text-primary border border-primary/20"
            }`}>
            {autoTourActive ? <><X className="w-3 h-3" /> Stop Tour</> : <><Info className="w-3 h-3" /> Tour Guidato</>}
          </button>
          <button onClick={() => window.open(previewUrl, "_blank")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium min-h-[36px]">
            <ExternalLink className="w-3.5 h-3.5" /> Apri App
          </button>
        </div>
      )}

      {/* iPhone Frame with swipe */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-[260px] h-[520px] bg-[#1a1a1a] rounded-[36px] p-[8px] shadow-2xl border border-[#333]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[24px] bg-[#1a1a1a] rounded-b-2xl z-30" />
            <div className="absolute top-[5px] left-[24px] z-30">
              <span className="text-[8px] text-white/60 font-medium">9:41</span>
            </div>
            <div className="w-full h-full rounded-[28px] overflow-hidden bg-background relative">
              <AnimatePresence mode="wait" custom={swipeDirection}>
                <motion.div
                  key={view}
                  custom={swipeDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 touch-pan-y"
                >
                  {view === "customer" && <CustomerView />}
                  {view === "admin" && <AdminView />}
                  {view === "kitchen" && <KitchenViewDemo />}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[80px] h-[3px] rounded-full bg-white/20" />
          </div>
          {currentViewIndex > 0 && (
            <motion.div animate={{ x: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute left-[-16px] top-1/2 -translate-y-1/2 text-muted-foreground/40">
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </motion.div>
          )}
          {currentViewIndex < VIEWS.length - 1 && (
            <motion.div animate={{ x: [2, -2, 2] }} transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute right-[-16px] top-1/2 -translate-y-1/2 text-muted-foreground/40">
              <ChevronDown className="w-4 h-4 rotate-90" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom hint — only in full mode */}
      {!compact && (
        <p className="text-[10px] text-muted-foreground text-center">
          👆 Swipe per cambiare vista · 💡 Tocca un elemento per la spiegazione
        </p>
      )}
    </motion.div>
  );
};

export default LivePreview;
