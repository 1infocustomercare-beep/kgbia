import { useState, useMemo, useCallback, useRef, useEffect, FormEvent } from "react";
import CookieBanner from "@/components/gdpr/CookieBanner";
import { useParams, useSearchParams } from "react-router-dom";
import { demoRestaurant, demoMenu, menuCategories as demoCats } from "@/data/demo-restaurant";
import { useRestaurantBySlug } from "@/hooks/useRestaurantBySlug";
import SplashScreen from "@/components/restaurant/SplashScreen";
import CartDrawer from "@/components/restaurant/CartDrawer";
import FloatingCartButton from "@/components/restaurant/FloatingCartButton";
import ItemDetailSheet from "@/components/restaurant/ItemDetailSheet";
import PrivateChat from "@/components/restaurant/PrivateChat";
import ReviewShield from "@/components/restaurant/ReviewShield";
import ReviewForm from "@/components/restaurant/ReviewForm";
import LoyaltyWallet from "@/components/restaurant/LoyaltyWallet";
import NotificationOptIn from "@/components/restaurant/NotificationOptIn";
import restaurantLogo from "@/assets/restaurant-logo.png";
import storyInterior from "@/assets/story-interior.jpg";
import storyPasta from "@/assets/story-pasta.jpg";
import storyWine from "@/assets/story-wine.jpg";
import storyDish from "@/assets/story-dish.jpg";
import heroVideo from "@/assets/hero-restaurant.mp4";
import { Search, Star, Crown, Phone, Mail, MapPin, Clock, ChevronDown, Plus, ShoppingBag, X, Menu as MenuIcon, CalendarDays, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import type { MenuItem } from "@/types/restaurant";
import { useCart } from "@/context/CartContext";
import { applyBrandTheme, resetBrandTheme } from "@/lib/color-extract";

const RestaurantPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const tableFromQR = searchParams.get("table");
  const { restaurant: dbRestaurant, menuItems: dbMenu, categories: dbCats, loading: dbLoading, notFound } = useRestaurantBySlug(slug);

  const hasDbData = dbMenu.length > 0;
  const menu = hasDbData ? dbMenu : demoMenu;
  const menuCategories = hasDbData ? dbCats : demoCats;
  const restaurantName = dbRestaurant?.name || demoRestaurant.name;
  const restaurantTagline = dbRestaurant?.tagline || demoRestaurant.tagline;
  const restaurantLogoUrl = dbRestaurant?.logo_url || restaurantLogo;
  const restaurantPhone = dbRestaurant?.phone || "+39 06 1234 5678";
  const restaurantAddress = dbRestaurant?.address || "Via del Corso 42, Roma";
  const restaurantCity = dbRestaurant?.city || "Roma, Italia";
  const restaurantEmail = dbRestaurant?.email || `info@${slug}.it`;
  const defaultHours = [
    { day: "Lunedì - Venerdì", hours: "12:00 - 15:00 · 19:00 - 23:30" },
    { day: "Sabato", hours: "12:00 - 15:30 · 19:00 - 24:00" },
    { day: "Domenica", hours: "Chiuso" },
  ];
  const openingHours = dbRestaurant?.opening_hours || defaultHours;

  const [showSplash, setShowSplash] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenuCat, setActiveMenuCat] = useState("");
  const [activeNav, setActiveNav] = useState("home");
  const { addItem, itemCount } = useCart();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const effectiveCat = activeMenuCat || menuCategories[0] || "Antipasti";
  const popularItems = useMemo(() => menu.filter(i => i.isPopular).slice(0, 6), [menu]);
  const catItems = useMemo(() => menu.filter(i => i.category === effectiveCat), [menu, effectiveCat]);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  // Apply adaptive brand theme from restaurant's primary color
  useEffect(() => {
    if (dbRestaurant?.primary_color) {
      applyBrandTheme(dbRestaurant.primary_color);
    }
    return () => { resetBrandTheme(); };
  }, [dbRestaurant?.primary_color]);

  // Listen for live brand updates from admin preview (postMessage)
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "brand-update" && e.data.primaryColor) {
        applyBrandTheme(e.data.primaryColor);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Reservation form state
  const [resDate, setResDate] = useState("");
  const [resTime, setResTime] = useState("");
  const [resGuests, setResGuests] = useState("2");
  const [resName, setResName] = useState("");
  const [resPhone, setResPhone] = useState("");
  const [resSubmitted, setResSubmitted] = useState(false);
  const [waiterCalling, setWaiterCalling] = useState(false);

  const handleCallWaiter = async () => {
    if (!tableFromQR || waiterCalling) return;
    setWaiterCalling(true);
    try {
      const restaurantId = dbRestaurant?.id;
      if (!restaurantId) return;
      // Insert a waiter call as a special order
      await supabase.from("orders").insert({
        restaurant_id: restaurantId,
        order_type: "waiter_call",
        table_number: parseInt(tableFromQR),
        customer_name: "Chiamata Cameriere",
        items: [] as any,
        total: 0,
        status: "pending",
        notes: `🔔 Chiamata cameriere — Tavolo ${tableFromQR}`,
      } as any);
    } catch {}
    setTimeout(() => setWaiterCalling(false), 5000);
  };

  const handleReservation = async (e: FormEvent) => {
    e.preventDefault();
    if (!resName.trim() || !resPhone.trim() || !resDate || !resTime) return;
    try {
      const restaurantId = dbRestaurant?.id;
      if (restaurantId) {
        await supabase.from("reservations").insert({
          restaurant_id: restaurantId,
          customer_name: resName.trim(),
          customer_phone: resPhone.trim(),
          guests: parseInt(resGuests) || 2,
          reservation_date: resDate,
          reservation_time: resTime,
        } as any);
      }
      setResSubmitted(true);
      setResName(""); setResPhone(""); setResDate(""); setResTime(""); setResGuests("2");
      setTimeout(() => setResSubmitted(false), 5000);
    } catch {
      setResSubmitted(true);
      setTimeout(() => setResSubmitted(false), 4000);
    }
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "story", label: "Chi Siamo" },
    { id: "menu-section", label: "Menù" },
    { id: "reviews", label: "Recensioni" },
    { id: "reservation", label: "Prenota" },
    { id: "contact", label: "Contatti" },
  ];

  if (showSplash) {
    return <SplashScreen restaurantName={restaurantName} logoUrl={restaurantLogoUrl} onComplete={handleSplashComplete} />;
  }

  // Kill-switch: blocked restaurant
  if (dbRestaurant?.is_blocked) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
          <Crown className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">Servizio Sospeso</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
          {dbRestaurant.blocked_reason || "Questo ristorante è temporaneamente non disponibile."}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-4">Contatta il supporto Empire per assistenza.</p>
      </div>
    );
  }

  const isDemoSlug = slug === demoRestaurant.slug;
  if (notFound && !isDemoSlug) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <Crown className="w-16 h-16 text-muted-foreground/20 mb-4" />
        <h1 className="text-2xl font-display font-bold text-foreground">Ristorante non trovato</h1>
        <p className="text-sm text-muted-foreground mt-2">Questo ristorante non esiste o non è attivo.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* TABLE QR BANNER */}
      {tableFromQR && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-primary/90 text-primary-foreground px-4 py-2 flex items-center justify-between text-sm font-medium">
          <span>🪑 Tavolo {tableFromQR}</span>
          <motion.button
            onClick={handleCallWaiter}
            disabled={waiterCalling}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-semibold disabled:opacity-50"
            whileTap={{ scale: 0.9 }}
          >
            <Bell className="w-3.5 h-3.5" />
            {waiterCalling ? "Chiamata inviata ✓" : "Chiama Cameriere"}
          </motion.button>
        </div>
      )}

      {/* ====== NAVBAR — Website Style ====== */}
      <nav className={`fixed ${tableFromQR ? "top-9" : "top-0"} inset-x-0 z-50 transition-all`}>
        <div className="glass-strong border-b border-border/20">
          <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
            {/* Logo + Name */}
            <button onClick={() => scrollToSection("home")} className="flex items-center gap-3">
              <img src={restaurantLogoUrl} alt="" className="w-10 h-10 rounded-xl object-contain" />
              <span className="font-display font-bold text-lg text-foreground tracking-[0.08em] uppercase hidden sm:block">
                {restaurantName}
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.12em] uppercase">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => scrollToSection(link.id)}
                  className="text-muted-foreground hover:text-primary transition-colors py-1">
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <a href={`tel:${restaurantPhone}`} className="hidden md:flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-3.5 h-3.5" /> {restaurantPhone}
              </a>
              <button onClick={() => scrollToSection("menu-section")}
                className="hidden md:inline-flex px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors">
                Ordina Ora
              </button>
              {/* Cart button */}
              <button onClick={() => setCartOpen(true)} className="relative p-2 text-foreground">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              {/* Mobile hamburger */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-foreground">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden glass-strong border-b border-border/20 overflow-hidden">
              <div className="flex flex-col items-center py-4 gap-1">
                {navLinks.map((link) => (
                  <button key={link.id} onClick={() => scrollToSection(link.id)}
                    className="w-full text-center py-3 text-sm font-medium tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </button>
                ))}
                <button onClick={() => { scrollToSection("menu-section"); }}
                  className="mt-2 mx-5 w-[calc(100%-2.5rem)] py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold tracking-widest uppercase">
                  Ordina Ora
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ====== 1. HERO — Full Screen with Video/Image ====== */}
      <section id="home" ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          <video src={heroVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background/80" />

        <motion.div className="relative z-10 text-center px-5" style={{ opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold text-foreground tracking-[0.1em] sm:tracking-[0.15em] uppercase leading-none">
              {restaurantName.split(" ").map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h1>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="w-8 sm:w-12 h-px bg-primary" />
              <p className="text-xs sm:text-sm text-foreground/70 tracking-[0.15em] sm:tracking-[0.2em] uppercase font-light">
                {restaurantTagline}
              </p>
              <span className="w-8 sm:w-12 h-px bg-primary" />
            </div>
          </motion.div>

          <motion.button onClick={() => scrollToSection("menu-section")}
            className="mt-6 sm:mt-10 px-7 sm:px-10 py-3 sm:py-4 border-2 border-foreground/30 text-foreground text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            Ordina Ora
          </motion.button>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-foreground/30" />
        </motion.div>
      </section>

      {/* ====== SECTION DIVIDER ====== */}
      <div className="relative h-16 sm:h-24 overflow-hidden">
        <motion.div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-background/0 via-primary/[0.03] to-background/0"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-px bg-primary/30"
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} />
      </div>

      {/* ====== 2. LA NOSTRA STORIA ====== */}
      <section id="story" className="py-12 sm:py-20 lg:py-28 px-4 sm:px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <motion.span className="text-xs tracking-[0.3em] uppercase text-primary font-medium inline-block"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              La Nostra Storia
            </motion.span>
            <motion.h2 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              Una passione per la<br />
              <span className="text-gold-gradient">cucina autentica</span>
            </motion.h2>
            <motion.p className="mt-6 text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.45 }}>
              Nel cuore della città vi attende {restaurantName} — un luogo dove l'ospitalità italiana incontra l'eccellenza culinaria. 
              La nostra cucina unisce ricette tradizionali con accenti moderni, utilizzando solo gli ingredienti più pregiati d'Italia e del territorio.
            </motion.p>
            <motion.p className="mt-4 text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.55 }}>
              Dalla nostra pasta fatta a mano alle carni selezionate, dai vini della nostra enoteca ai dolci della tradizione — 
              ogni visita diventa un'esperienza indimenticabile per tutti i sensi.
            </motion.p>
            <motion.div className="mt-8 flex items-center gap-4"
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.65 }}>
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground">Chef & Proprietario</p>
                <p className="text-sm text-muted-foreground">{restaurantName}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[storyInterior, storyWine, storyPasta, storyDish].map((img, i) => (
              <motion.div key={i} className={`overflow-hidden rounded-2xl ${i === 0 ? "row-span-2" : ""}`}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: 0.15 * i + 0.2, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.03 }}>
                <img src={img} alt="Restaurant" className={`w-full object-cover ${i === 0 ? "h-full" : "h-48 sm:h-56"} transition-transform duration-700`} loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SECTION DIVIDER ====== */}
      <div className="relative h-16 sm:h-24 overflow-hidden">
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-px bg-primary/30"
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
      </div>

      {/* ====== 3. MENU — Le Nostre Specialità ====== */}
      <section id="menu-section" className="py-12 sm:py-20 lg:py-28 px-4 sm:px-5 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <motion.span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-primary font-medium inline-block"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15 }}>
              Le Nostre Specialità
            </motion.span>
            <h2 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">Il Nostro Menù</h2>
          </motion.div>

          {/* Signature Dishes — Featured Grid */}
          {popularItems.length > 0 && (
            <div className="mb-10 sm:mb-16">
              <h3 className="text-base sm:text-lg font-display font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary" /> Piatti Signature
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {popularItems.map((item, i) => (
                  <motion.div key={item.id}
                    className="group relative rounded-2xl overflow-hidden bg-card border border-border/30 hover:border-primary/30 transition-all duration-500 cursor-pointer"
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setSelectedItem(item)}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-semibold tracking-wider uppercase">Signature</span>
                        <span className="px-2 py-0.5 rounded-full glass text-foreground text-[10px] font-medium">{item.category}</span>
                      </div>
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); addItem(item); }}
                        className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileTap={{ scale: 0.85 }}>
                        <Plus className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <div className="p-3 sm:p-5">
                      <h4 className="font-display text-base sm:text-lg font-bold text-foreground">{item.name}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-2 sm:mt-3">
                        <span className="text-lg sm:text-xl font-display font-bold text-primary">€{item.price.toFixed(2)}</span>
                        <motion.button
                          onClick={(e) => { e.stopPropagation(); addItem(item); }}
                          className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
                          whileTap={{ scale: 0.95 }}>
                          Aggiungi
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Full Menu by Category */}
          <div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-6">Menu Completo</h3>
            
            {/* Category tabs */}
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4 sm:mb-6">
              {menuCategories.map((cat) => (
                <button key={cat} onClick={() => setActiveMenuCat(cat)}
                  className={`flex-shrink-0 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300
                    ${effectiveCat === cat ? "bg-primary text-primary-foreground" : "glass border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Items grid */}
            <AnimatePresence mode="wait">
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" key={effectiveCat}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                {catItems.map((item, i) => (
                  <motion.div key={item.id}
                    className="group flex gap-4 p-4 rounded-2xl bg-card border border-border/30 hover:border-primary/20 transition-all cursor-pointer"
                    initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setSelectedItem(item)}>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-foreground text-sm">{item.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-display font-bold text-primary">€{item.price.toFixed(2)}</span>
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); addItem(item); }}
                        className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        whileTap={{ scale: 0.85 }}>
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ====== SECTION DIVIDER ====== */}
      <div className="relative h-16 sm:h-24 overflow-hidden">
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-px bg-primary/30"
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
      </div>

      {/* ====== 4. CONTATTI & ORARI ====== */}
      <section id="contact" className="py-12 sm:py-20 lg:py-28 px-4 sm:px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-8 sm:mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-primary font-medium">Vieni a Trovarci</span>
            <h2 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">Contatti & Orari</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Location */}
            <motion.div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl glass border border-border/30"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, type: "spring", stiffness: 200 }}>
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-3" />
              </motion.div>
              <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-2">{restaurantCity}</h3>
              <p className="text-sm text-muted-foreground mb-3">{restaurantAddress}</p>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(restaurantAddress + " " + restaurantCity)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-primary font-semibold tracking-wider uppercase hover:underline">
                Apri su Google Maps →
              </a>
            </motion.div>

            {/* Contacts */}
            <motion.div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl glass border border-border/30"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, type: "spring", stiffness: 200 }}>
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-3" />
              </motion.div>
              <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-2">Contatti</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <a href={`tel:${restaurantPhone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" /> {restaurantPhone}
                </a>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {restaurantEmail}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {restaurantAddress}
                </p>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl glass border border-border/30"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.24, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, type: "spring", stiffness: 200 }}>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-3" />
              </motion.div>
              <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-2">Orari di Apertura</h3>
              <div className="space-y-2 text-sm">
                {openingHours.map((item, i) => (
                  <motion.div key={i} className="flex justify-between items-center py-1.5 border-b border-border/20 last:border-0"
                    initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.08 }}>
                    <span className="text-foreground font-medium text-xs">{item.day}</span>
                    <span className={`text-xs ${item.hours === "Chiuso" ? "text-accent" : "text-muted-foreground"}`}>{item.hours}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== SECTION DIVIDER ====== */}
      <div className="relative h-16 sm:h-24 overflow-hidden">
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-px bg-primary/30"
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
      </div>

      {/* ====== REVIEWS ====== */}
      <section id="reviews" className="py-12 px-4 sm:px-5">
        <div className="max-w-3xl mx-auto">
          <ReviewShield restaurantId={dbRestaurant?.id} />
        </div>
      </section>

      {/* ====== LOYALTY WALLET ====== */}
      <section className="py-12 px-4 sm:px-5 bg-card/30">
        <div className="max-w-md mx-auto">
          <motion.div className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-primary font-medium">Programma Fedeltà</span>
            <h2 className="mt-2 text-xl sm:text-2xl font-display font-bold text-foreground">I Tuoi Premi</h2>
          </motion.div>
          <LoyaltyWallet />
        </div>
      </section>

      {/* ====== 5. PRENOTAZIONE TAVOLO ====== */}
      <section id="reservation" className="py-12 sm:py-20 lg:py-28 px-4 sm:px-5 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <motion.div className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-primary font-medium">Riserva il Tuo Tavolo</span>
            <h2 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">Prenotazione</h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              Prenota il tuo tavolo in pochi secondi. Compila il form e ti confermeremo via telefono.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleReservation}
            className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl glass border border-border/30 space-y-5"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>

            {resSubmitted ? (
              <motion.div className="text-center py-8" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Prenotazione Inviata!</h3>
                <p className="text-sm text-muted-foreground mt-2">Ti contatteremo a breve per confermare.</p>
              </motion.div>
            ) : (
              <>
                {/* Row: Date + Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5 tracking-wider uppercase">Data</label>
                    <input type="date" required value={resDate} onChange={e => setResDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full h-11 px-3 rounded-xl bg-background border border-border/40 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5 tracking-wider uppercase">Ora</label>
                    <select required value={resTime} onChange={e => setResTime(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-background border border-border/40 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none">
                      <option value="">Seleziona orario</option>
                      {["12:00","12:30","13:00","13:30","14:00","14:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5 tracking-wider uppercase">Numero Ospiti</label>
                  <div className="flex gap-2 flex-wrap">
                    {["1","2","3","4","5","6","7","8+"].map(n => (
                      <button type="button" key={n} onClick={() => setResGuests(n)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                          ${resGuests === n ? "bg-primary text-primary-foreground" : "bg-background border border-border/40 text-muted-foreground hover:border-primary/40"}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row: Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5 tracking-wider uppercase">Nome</label>
                    <input type="text" required placeholder="Mario Rossi" value={resName} onChange={e => setResName(e.target.value)}
                      maxLength={100}
                      className="w-full h-11 px-3 rounded-xl bg-background border border-border/40 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5 tracking-wider uppercase">Telefono</label>
                    <input type="tel" required placeholder="+39 333 1234567" value={resPhone} onChange={e => setResPhone(e.target.value)}
                      maxLength={20}
                      className="w-full h-11 px-3 rounded-xl bg-background border border-border/40 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                  </div>
                </div>

                <motion.button type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
                  whileTap={{ scale: 0.98 }}>
                  <CalendarDays className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                  Prenota Ora
                </motion.button>
              </>
            )}
          </motion.form>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <motion.footer className="border-t border-border/30 py-6 sm:py-10 px-4 sm:px-5"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.div className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <img src={restaurantLogoUrl} alt="" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-display font-bold text-foreground tracking-[0.08em] uppercase text-sm">{restaurantName}</span>
          </motion.div>
          <p className="text-xs text-muted-foreground">© 2026 {restaurantName}. Tutti i diritti riservati.</p>
          <p className="text-[10px] text-muted-foreground/50">Powered by Empire</p>
        </div>
      </motion.footer>

      {/* ====== OVERLAYS ====== */}
      <ItemDetailSheet item={selectedItem} onClose={() => setSelectedItem(null)} />
      <PrivateChat restaurantId={dbRestaurant?.id} />
      {dbRestaurant?.id && <ReviewForm restaurantId={dbRestaurant.id} />}
      <NotificationOptIn restaurantId={dbRestaurant?.id} restaurantName={restaurantName} />
      <FloatingCartButton onClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} allMenuItems={menu} />
      <CookieBanner restaurantId={dbRestaurant?.id} />
    </div>
  );
};

export default RestaurantPage;
