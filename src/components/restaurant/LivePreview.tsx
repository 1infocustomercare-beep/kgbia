import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone, RotateCcw, ExternalLink, ChefHat, LayoutDashboard, Users,
  Star, ShoppingCart, TrendingUp, Bell, Volume2, Printer, Sparkles,
  MapPin, Phone, Clock, Search, Plus, UtensilsCrossed, Crown,
  Palette, Globe, Shield, AlertTriangle, BarChart3, QrCode,
  MessageSquare, Wallet, CalendarDays, ChevronDown, X, Info
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

const LivePreview = ({ slug, primaryColor }: LivePreviewProps) => {
  const [view, setView] = useState<PreviewView>("customer");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [autoTourActive, setAutoTourActive] = useState(false);
  const [autoTourStep, setAutoTourStep] = useState(0);

  // Customer sub-state
  const [customerSection, setCustomerSection] = useState<"hero" | "menu" | "story" | "contact">("hero");
  const [selectedCat, setSelectedCat] = useState("Antipasti");

  // Admin sub-state  
  const [adminTab, setAdminTab] = useState<"home" | "studio" | "orders" | "profit" | "more">("home");

  // Kitchen sub-state
  const [kitchenOrders, setKitchenOrders] = useState(DEMO_ORDERS);

  const previewUrl = `${window.location.origin}/r/${slug}`;

  // Tooltip definitions per view+section
  const tooltips: Record<string, Tooltip> = {
    // Customer
    "hero-video": { id: "hero-video", text: "Video hero a schermo intero con parallax — il cliente viene subito immerso nell'esperienza del ristorante", position: "bottom" },
    "hero-cta": { id: "hero-cta", text: "Call-to-action prominente — porta il cliente direttamente al menu per ordinare", position: "top" },
    "menu-categories": { id: "menu-categories", text: "Categorie scrollabili — il cliente filtra istantaneamente antipasti, primi, pizze, dolci", position: "bottom" },
    "menu-item": { id: "menu-item", text: "Ogni piatto ha foto HD generata dall'IA, descrizione, prezzo e badge 'Popolare'", position: "bottom" },
    "menu-add": { id: "menu-add", text: "Aggiunta al carrello con un tap — zero attrito per il cliente", position: "left" },
    "story-section": { id: "story-section", text: "Sezione 'Chi Siamo' con foto e storytelling — crea connessione emotiva col brand", position: "bottom" },
    "contact-info": { id: "contact-info", text: "Indirizzo, telefono e orari sempre visibili — il cliente trova tutto senza cercare", position: "top" },
    "loyalty-wallet": { id: "loyalty-wallet", text: "Wallet fedeltà integrato — coupon e sconti salvati direttamente nel telefono del cliente", position: "top" },
    "table-qr": { id: "table-qr", text: "QR Code per tavolo — il cliente scansiona e ordina senza aspettare il cameriere", position: "bottom" },
    "reservation": { id: "reservation", text: "Prenotazione tavolo integrata — data, ora, numero ospiti con conferma istantanea", position: "top" },
    // Admin
    "admin-kpis": { id: "admin-kpis", text: "KPI in tempo reale — incasso giornaliero, ordini attivi, piatti nel menu e gettoni IA rimanenti", position: "bottom" },
    "admin-reviews": { id: "admin-reviews", text: "Review Shield™ — le recensioni negative vengono intercettate prima di finire su Google", position: "bottom" },
    "admin-studio-menu": { id: "admin-studio-menu", text: "Gestione menu completa — aggiungi, modifica, elimina piatti con foto IA", position: "bottom" },
    "admin-studio-ai": { id: "admin-studio-ai", text: "AI Menu Creator — fotografa il menu cartaceo, l'OCR lo digitalizza in 60 secondi", position: "bottom" },
    "admin-studio-design": { id: "admin-studio-design", text: "Design Studio — cambia colore brand, logo e tagline con preview live in tempo reale", position: "bottom" },
    "admin-orders": { id: "admin-orders", text: "Pannello ordini con stati: In Attesa → In Preparazione → Pronto → Consegnato", position: "bottom" },
    "admin-tables": { id: "admin-tables", text: "Mappa tavoli interattiva — stato in tempo reale (libero/occupato/chiamata cameriere)", position: "bottom" },
    "admin-profit-panic": { id: "admin-profit-panic", text: "Panic Mode — abbassa tutti i prezzi con uno slider per riempire i coperti vuoti", position: "bottom" },
    "admin-profit-lost": { id: "admin-profit-lost", text: "Clienti Persi — individua chi non torna da 30+ giorni e manda push con sconto", position: "bottom" },
    "admin-profit-reviews": { id: "admin-profit-reviews", text: "Review Shield™ — filtra recensioni negative prima che finiscano online", position: "bottom" },
    "admin-more-qr": { id: "admin-more-qr", text: "QR Code per tavolo — genera e stampa codici univoci per ogni tavolo", position: "bottom" },
    "admin-more-fisco": { id: "admin-more-fisco", text: "Cassetto Fiscale (AI-Mary) — integrazione con registratore di cassa telematico", position: "bottom" },
    "admin-more-translate": { id: "admin-more-translate", text: "Traduzione IA — menu in 8+ lingue con un click (inglese, tedesco, francese...)", position: "bottom" },
    // Kitchen
    "kitchen-header": { id: "kitchen-header", text: "Header cucina con contatore ordini attivi e toggle audio per alert sonori", position: "bottom" },
    "kitchen-counters": { id: "kitchen-counters", text: "Contatori in tempo reale — quanti ordini in attesa, in preparazione e pronti", position: "bottom" },
    "kitchen-order": { id: "kitchen-order", text: "Ogni ordine mostra: cliente, tipo (tavolo/delivery/asporto), piatti, note e orario", position: "bottom" },
    "kitchen-actions": { id: "kitchen-actions", text: "Bottoni grandi ottimizzati per touch — un tap per cambiare stato dell'ordine", position: "top" },
    "kitchen-print": { id: "kitchen-print", text: "Stampa ticket cartaceo — comanda pronta per la stampante termica", position: "left" },
    "kitchen-realtime": { id: "kitchen-realtime", text: "Aggiornamento in tempo reale — nuovi ordini appaiono con alert sonoro differenziato", position: "bottom" },
  };

  // Auto-tour logic
  const tourSequences: Record<PreviewView, string[]> = {
    customer: ["hero-video", "hero-cta", "menu-categories", "menu-item", "menu-add", "story-section", "contact-info", "loyalty-wallet", "table-qr", "reservation"],
    admin: ["admin-kpis", "admin-reviews", "admin-studio-menu", "admin-studio-ai", "admin-studio-design", "admin-orders", "admin-tables", "admin-profit-panic", "admin-profit-lost", "admin-more-qr", "admin-more-fisco"],
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
    "admin-reviews": () => setAdminTab("home"),
    "admin-studio-menu": () => setAdminTab("studio"),
    "admin-studio-ai": () => setAdminTab("studio"),
    "admin-studio-design": () => setAdminTab("studio"),
    "admin-orders": () => setAdminTab("orders"),
    "admin-tables": () => setAdminTab("orders"),
    "admin-profit-panic": () => setAdminTab("profit"),
    "admin-profit-lost": () => setAdminTab("profit"),
    "admin-profit-reviews": () => setAdminTab("profit"),
    "admin-more-qr": () => setAdminTab("more"),
    "admin-more-fisco": () => setAdminTab("more"),
    "admin-more-translate": () => setAdminTab("more"),
  };

  useEffect(() => {
    if (!autoTourActive) return;
    const seq = tourSequences[view];
    if (autoTourStep >= seq.length) {
      setAutoTourActive(false);
      setAutoTourStep(0);
      setActiveTooltip(null);
      return;
    }
    const tipId = seq[autoTourStep];
    // Navigate to correct sub-section
    viewSectionMap[tipId]?.();
    setTimeout(() => setActiveTooltip(tipId), 200);
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
    return (
      <div className="relative">
        <div onClick={() => toggleTooltip(id)} className="cursor-pointer">
          {children}
        </div>
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: tip.position === "top" ? 8 : tip.position === "bottom" ? -8 : 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`absolute z-50 w-52 p-2.5 rounded-xl bg-primary text-primary-foreground text-[10px] leading-snug font-medium shadow-xl border border-primary-foreground/20 ${
                tip.position === "top" ? "bottom-full mb-2 left-1/2 -translate-x-1/2" :
                tip.position === "bottom" ? "top-full mt-2 left-1/2 -translate-x-1/2" :
                tip.position === "left" ? "right-full mr-2 top-1/2 -translate-y-1/2" :
                "left-full ml-2 top-1/2 -translate-y-1/2"
              }`}
            >
              <div className="flex items-start gap-1.5">
                <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span>{tip.text}</span>
              </div>
              {/* Arrow */}
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

  // ===== CUSTOMER VIEW =====
  const CustomerView = () => (
    <div className="h-full overflow-y-auto bg-background text-foreground text-[10px]">
      {/* Customer nav tabs */}
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
          {/* Popular items preview */}
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
                <p className="text-[8px] text-muted-foreground">Ordina dal QR e chiama il cameriere</p>
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
                      {item.popular && <Star className="w-2.5 h-2.5 text-primary fill-primary" />}
                    </div>
                    <p className="text-[8px] text-muted-foreground">Ingredienti freschi selezionati</p>
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
              <div className="text-center py-6 text-muted-foreground text-[9px]">Nessun piatto in questa categoria</div>
            )}
          </div>
        </div>
      )}

      {customerSection === "story" && (
        <TipBubble id="story-section">
          <div className="px-2 py-3">
            <p className="text-[8px] text-primary uppercase tracking-widest font-medium mb-1">La Nostra Storia</p>
            <p className="text-[10px] font-display font-bold mb-2">Una passione per la cucina autentica</p>
            <img src={storyInterior} alt="" className="w-full h-28 rounded-xl object-cover mb-2" />
            <p className="text-[8px] text-muted-foreground leading-relaxed">
              Nel cuore della città vi attende un luogo dove l'ospitalità italiana incontra l'eccellenza culinaria. 
              La nostra cucina unisce ricette tradizionali con accenti moderni, utilizzando solo gli ingredienti più pregiati.
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
                <div className="px-2 py-1.5 rounded-lg bg-secondary text-[8px] text-muted-foreground">📱 Telefono</div>
              </div>
              <div className="w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-center text-[8px] font-medium">Prenota</div>
            </div>
          </TipBubble>
          <TipBubble id="contact-info">
            <div className="p-2.5 rounded-xl bg-card border border-border/30 space-y-1.5">
              <p className="text-[9px] font-bold">📍 Contatti & Orari</p>
              <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground">
                <MapPin className="w-3 h-3 text-primary" /> Via del Corso 42, Roma
              </div>
              <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground">
                <Phone className="w-3 h-3 text-primary" /> +39 06 1234 5678
              </div>
              <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground">
                <Clock className="w-3 h-3 text-primary" /> Lun-Ven 12-15 · 19-23:30
              </div>
            </div>
          </TipBubble>
          <TipBubble id="loyalty-wallet">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-[9px] font-bold text-foreground">Wallet Fedeltà</p>
                  <p className="text-[8px] text-muted-foreground">Salva coupon e sconti nel telefono</p>
                </div>
              </div>
              <div className="flex gap-1 mt-1.5">
                <div className="flex-1 py-1 rounded-lg bg-primary/10 text-center text-[7px] text-primary font-medium">🎫 -10% Benvenuto</div>
                <div className="flex-1 py-1 rounded-lg bg-primary/10 text-center text-[7px] text-primary font-medium">🎂 Dessert Gratis</div>
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
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/30 bg-card/50">
        <div className="flex items-center gap-1.5">
          <img src={restaurantLogo} alt="" className="w-5 h-5 rounded-lg" />
          <div>
            <p className="text-[9px] font-bold truncate">Impero Roma</p>
            <p className="text-[7px] text-primary">{["Home", "Studio", "Ordini", "Profitto", "Altro"][["home", "studio", "orders", "profit", "more"].indexOf(adminTab)]}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2 py-2 pb-10">
        {adminTab === "home" && (
          <div className="space-y-2">
            <TipBubble id="admin-kpis">
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Incasso Oggi", value: "€847", icon: "💰" },
                  { label: "Ordini Attivi", value: "3", icon: "📦" },
                  { label: "Piatti Menu", value: "24", icon: "🍽️" },
                  { label: "Gettoni IA", value: "5", icon: "🤖" },
                ].map((kpi, i) => (
                  <div key={i} className="p-2 rounded-xl bg-card border border-border/30">
                    <p className="text-[7px] text-muted-foreground">{kpi.icon} {kpi.label}</p>
                    <p className="text-sm font-display font-bold text-foreground">{kpi.value}</p>
                  </div>
                ))}
              </div>
            </TipBubble>
            <TipBubble id="admin-reviews">
              <div className="p-2 rounded-xl bg-card border border-border/30">
                <p className="text-[8px] font-bold mb-1.5 flex items-center gap-1"><Shield className="w-3 h-3 text-primary" /> Review Shield™</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-green-500/5">
                    <div className="flex items-center gap-1">
                      <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-2 h-2 text-primary fill-primary" />)}</div>
                      <span className="text-[7px]">Marco R.</span>
                    </div>
                    <span className="text-[7px] text-green-400">✓ Pubblica</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-red-500/5">
                    <div className="flex items-center gap-1">
                      <div className="flex">{[...Array(2)].map((_, i) => <Star key={i} className="w-2 h-2 text-destructive fill-destructive" />)}{[...Array(3)].map((_, i) => <Star key={i} className="w-2 h-2 text-muted-foreground" />)}</div>
                      <span className="text-[7px]">Anna L.</span>
                    </div>
                    <span className="text-[7px] text-red-400">⚠ Intercettata</span>
                  </div>
                </div>
              </div>
            </TipBubble>
            {/* Quick actions */}
            <div className="grid grid-cols-3 gap-1">
              <div className="p-2 rounded-xl bg-primary/10 text-center"><CalendarDays className="w-3.5 h-3.5 mx-auto text-primary mb-0.5" /><p className="text-[7px]">Prenotazioni</p></div>
              <div className="p-2 rounded-xl bg-primary/10 text-center"><MessageSquare className="w-3.5 h-3.5 mx-auto text-primary mb-0.5" /><p className="text-[7px]">Chat</p></div>
              <div className="p-2 rounded-xl bg-primary/10 text-center"><BarChart3 className="w-3.5 h-3.5 mx-auto text-primary mb-0.5" /><p className="text-[7px]">Analytics</p></div>
            </div>
          </div>
        )}

        {adminTab === "studio" && (
          <div className="space-y-2">
            <TipBubble id="admin-studio-menu">
              <div className="p-2 rounded-xl bg-card border border-border/30">
                <p className="text-[8px] font-bold mb-1.5 flex items-center gap-1"><UtensilsCrossed className="w-3 h-3 text-primary" /> Gestione Menu</p>
                {DEMO_MENU.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 py-1 border-b border-border/10 last:border-0">
                    <img src={item.img} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-medium truncate">{item.name}</p>
                      <p className="text-[7px] text-primary font-bold">€{item.price}</p>
                    </div>
                    <div className="flex gap-0.5">
                      <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center"><span className="text-[8px]">✏️</span></div>
                      <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center"><span className="text-[8px]">🗑️</span></div>
                    </div>
                  </div>
                ))}
                <div className="mt-1.5 w-full py-1.5 rounded-lg bg-primary/10 text-primary text-center text-[8px] font-medium">+ Aggiungi Piatto</div>
              </div>
            </TipBubble>
            <TipBubble id="admin-studio-ai">
              <div className="p-2 rounded-xl bg-card border border-primary/20 border-dashed text-center">
                <Sparkles className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-[8px] font-bold">AI Menu Creator</p>
                <p className="text-[7px] text-muted-foreground">📸 Foto → OCR → Menu in 60s</p>
              </div>
            </TipBubble>
            <TipBubble id="admin-studio-design">
              <div className="p-2 rounded-xl bg-card border border-border/30">
                <p className="text-[8px] font-bold mb-1.5 flex items-center gap-1"><Palette className="w-3 h-3 text-primary" /> Design Studio</p>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-xl" style={{ backgroundColor: primaryColor || "#C8963E" }} />
                  <div className="flex gap-1">
                    {["#C8963E", "#E74C3C", "#2ECC71", "#3498DB", "#9B59B6"].map(c => (
                      <div key={c} className="w-4 h-4 rounded-full border border-border/30" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <p className="text-[7px] text-muted-foreground">Colore, logo e tagline con preview live</p>
              </div>
            </TipBubble>
          </div>
        )}

        {adminTab === "orders" && (
          <div className="space-y-2">
            <TipBubble id="admin-orders">
              <div className="space-y-1.5">
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
                    <p className="text-[7px] text-muted-foreground">{order.customer} · {order.type === "table" ? `Tavolo ${order.table}` : order.type === "delivery" ? "🛵 Delivery" : "🥡 Asporto"}</p>
                    <p className="text-[8px] font-bold text-primary mt-0.5">€{order.total}</p>
                  </div>
                ))}
              </div>
            </TipBubble>
            <TipBubble id="admin-tables">
              <div className="p-2 rounded-xl bg-card border border-border/30">
                <p className="text-[8px] font-bold mb-1.5">🗺️ Mappa Tavoli</p>
                <div className="grid grid-cols-4 gap-1">
                  {[1,2,3,4,5,6,7,8].map(t => (
                    <div key={t} className={`p-1.5 rounded-lg text-center text-[7px] font-medium ${t === 5 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : t === 3 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-green-500/10 text-green-400 border border-green-500/20"}`}>
                      T{t}
                      {t === 3 && <span className="block text-[6px]">🔔</span>}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-1.5 text-[6px] text-muted-foreground">
                  <span>🟢 Libero</span><span>🟡 Occupato</span><span>🔴 Chiamata</span>
                </div>
              </div>
            </TipBubble>
          </div>
        )}

        {adminTab === "profit" && (
          <div className="space-y-2">
            <TipBubble id="admin-profit-panic">
              <div className="p-2 rounded-xl bg-card border border-border/30">
                <p className="text-[8px] font-bold mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-400" /> Panic Mode</p>
                <p className="text-[7px] text-muted-foreground mb-1.5">Abbassa i prezzi per riempire i coperti vuoti</p>
                <div className="flex items-center gap-2">
                  <span className="text-[7px]">0%</span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full relative">
                    <div className="absolute left-0 top-0 h-full w-1/4 bg-amber-500 rounded-full" />
                    <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full border-2 border-background" />
                  </div>
                  <span className="text-[7px]">50%</span>
                </div>
                <p className="text-[7px] text-amber-400 text-center mt-1">-25% su tutti i piatti attivo</p>
              </div>
            </TipBubble>
            <TipBubble id="admin-profit-lost">
              <div className="p-2 rounded-xl bg-card border border-border/30">
                <p className="text-[8px] font-bold mb-1 flex items-center gap-1"><Users className="w-3 h-3 text-red-400" /> Clienti Persi</p>
                <div className="space-y-1">
                  {[{ name: "Luca M.", days: 45, spent: "€320" }, { name: "Sara T.", days: 38, spent: "€180" }].map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-1.5 rounded-lg bg-red-500/5">
                      <div>
                        <p className="text-[8px] font-medium">{c.name}</p>
                        <p className="text-[6px] text-muted-foreground">{c.days}gg assente · {c.spent} spesi</p>
                      </div>
                      <div className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[6px] font-medium">📲 Push</div>
                    </div>
                  ))}
                </div>
              </div>
            </TipBubble>
            <TipBubble id="admin-profit-reviews">
              <div className="p-2 rounded-xl bg-card border border-border/30">
                <p className="text-[8px] font-bold mb-1 flex items-center gap-1"><Shield className="w-3 h-3 text-primary" /> Review Shield™</p>
                <p className="text-[7px] text-muted-foreground">8 positive pubblicate · 2 negative intercettate</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 text-primary fill-primary" />)}</div>
                  <span className="text-[8px] font-bold">4.8</span>
                </div>
              </div>
            </TipBubble>
          </div>
        )}

        {adminTab === "more" && (
          <div className="space-y-2">
            <TipBubble id="admin-more-qr">
              <div className="grid grid-cols-2 gap-1.5">
                <div className="p-2 rounded-xl bg-card border border-border/30 text-center">
                  <QrCode className="w-5 h-5 mx-auto text-primary mb-0.5" />
                  <p className="text-[8px] font-bold">QR Tavoli</p>
                  <p className="text-[6px] text-muted-foreground">Genera & stampa</p>
                </div>
                <div className="p-2 rounded-xl bg-card border border-border/30 text-center">
                  <Globe className="w-5 h-5 mx-auto text-primary mb-0.5" />
                  <p className="text-[8px] font-bold">Traduzioni IA</p>
                  <p className="text-[6px] text-muted-foreground">8+ lingue</p>
                </div>
              </div>
            </TipBubble>
            <TipBubble id="admin-more-fisco">
              <div className="grid grid-cols-2 gap-1.5">
                <div className="p-2 rounded-xl bg-card border border-border/30 text-center">
                  <Crown className="w-5 h-5 mx-auto text-primary mb-0.5" />
                  <p className="text-[8px] font-bold">AI-Mary</p>
                  <p className="text-[6px] text-muted-foreground">Cassetto Fiscale</p>
                </div>
                <div className="p-2 rounded-xl bg-card border border-border/30 text-center">
                  <Shield className="w-5 h-5 mx-auto text-primary mb-0.5" />
                  <p className="text-[8px] font-bold">Blacklist</p>
                  <p className="text-[6px] text-muted-foreground">Blocca clienti</p>
                </div>
              </div>
            </TipBubble>
            <TipBubble id="admin-more-translate">
              <div className="p-2 rounded-xl bg-card border border-border/30">
                <p className="text-[8px] font-bold mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3 text-primary" /> Altre Funzioni</p>
                <div className="grid grid-cols-3 gap-1">
                  <div className="p-1.5 rounded-lg bg-secondary text-center text-[7px]">📊 Report</div>
                  <div className="p-1.5 rounded-lg bg-secondary text-center text-[7px]">🎓 Academy</div>
                  <div className="p-1.5 rounded-lg bg-secondary text-center text-[7px]">⚙️ Settings</div>
                </div>
              </div>
            </TipBubble>
          </div>
        )}
      </div>

      {/* Admin bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 flex bg-card/95 border-t border-border/30 backdrop-blur-sm">
        {([
          { id: "home", icon: <LayoutDashboard className="w-3.5 h-3.5" />, label: "Home" },
          { id: "studio", icon: <UtensilsCrossed className="w-3.5 h-3.5" />, label: "Studio" },
          { id: "orders", icon: <ShoppingCart className="w-3.5 h-3.5" />, label: "Ordini" },
          { id: "profit", icon: <TrendingUp className="w-3.5 h-3.5" />, label: "Profitto" },
          { id: "more", icon: <Crown className="w-3.5 h-3.5" />, label: "Altro" },
        ] as { id: typeof adminTab; icon: React.ReactNode; label: string }[]).map(tab => (
          <button key={tab.id} onClick={() => setAdminTab(tab.id)}
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
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-center">
            <p className="text-sm font-bold text-amber-400">1</p>
            <p className="text-[7px] text-muted-foreground">Attesa</p>
          </div>
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-center">
            <p className="text-sm font-bold text-blue-400">1</p>
            <p className="text-[7px] text-muted-foreground">Preparazione</p>
          </div>
          <div className="p-1.5 rounded-lg bg-green-500/10 text-center">
            <p className="text-sm font-bold text-green-400">1</p>
            <p className="text-[7px] text-muted-foreground">Pronto</p>
          </div>
        </div>
      </TipBubble>

      <TipBubble id="kitchen-realtime">
        <div className="mx-2 mb-1.5 p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-center">
          <p className="text-[7px] text-primary font-medium">🔴 Live — Aggiornamento in tempo reale con alert sonori</p>
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
              <p className="text-[7px] text-muted-foreground mb-1">
                {order.customer} · {order.type === "table" ? `🪑 Tavolo ${order.table}` : order.type === "delivery" ? "🛵 Delivery" : "🥡 Asporto"}
              </p>
              <div className="space-y-0.5 mb-1.5">
                {order.items.map((item, j) => (
                  <div key={j} className="flex justify-between text-[8px]">
                    <span className="font-medium">{item.qty}× {item.name}</span>
                    <span className="text-muted-foreground">€{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {order.notes && (
                <p className="text-[7px] text-amber-400 bg-amber-500/10 px-1.5 py-1 rounded-lg mb-1.5">📝 {order.notes}</p>
              )}
              <TipBubble id={i === 0 ? "kitchen-actions" : `kaction-${i}`}>
                <div className={`w-full py-2 rounded-xl text-center text-[8px] font-bold ${
                  order.status === "pending" ? "bg-blue-500/20 text-blue-400" :
                  order.status === "preparing" ? "bg-green-500/20 text-green-400" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {order.status === "pending" ? "🔥 Inizia Preparazione" :
                   order.status === "preparing" ? "✅ Pronto" :
                   "📦 Consegnato"}
                </div>
              </TipBubble>
            </div>
          </TipBubble>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div className="space-y-3 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="text-center py-1">
        <Smartphone className="w-8 h-8 mx-auto mb-1 text-primary" />
        <h3 className="text-base font-display font-bold text-foreground">Live Preview Completa</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Tutte le interfacce dell'app — tocca gli elementi per i dettagli</p>
      </div>

      {/* View tabs */}
      <div className="flex gap-1 justify-center">
        {([
          { id: "customer" as const, label: "👤 Cliente", icon: <Users className="w-3.5 h-3.5" /> },
          { id: "admin" as const, label: "⚙️ Admin", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
          { id: "kitchen" as const, label: "👨‍🍳 Cucina", icon: <ChefHat className="w-3.5 h-3.5" /> },
        ]).map(tab => (
          <button key={tab.id} onClick={() => { setView(tab.id); setActiveTooltip(null); stopTour(); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors min-h-[36px] ${
              view === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Auto-tour button */}
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

      {/* iPhone Frame */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-[260px] h-[520px] bg-[#1a1a1a] rounded-[36px] p-[8px] shadow-2xl border border-[#333]">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[24px] bg-[#1a1a1a] rounded-b-2xl z-30" />
            {/* Status bar */}
            <div className="absolute top-[5px] left-[24px] z-30">
              <span className="text-[8px] text-white/60 font-medium">9:41</span>
            </div>
            {/* Screen */}
            <div className="w-full h-full rounded-[28px] overflow-hidden bg-background relative">
              <AnimatePresence mode="wait">
                {view === "customer" && (
                  <motion.div key="customer" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <CustomerView />
                  </motion.div>
                )}
                {view === "admin" && (
                  <motion.div key="admin" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <AdminView />
                  </motion.div>
                )}
                {view === "kitchen" && (
                  <motion.div key="kitchen" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <KitchenViewDemo />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Home indicator */}
            <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[80px] h-[3px] rounded-full bg-white/20" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <p className="text-[10px] text-muted-foreground text-center">
        💡 Tocca qualsiasi elemento per una spiegazione · Usa il "Tour Guidato" per una demo automatica
      </p>
    </motion.div>
  );
};

export default LivePreview;
