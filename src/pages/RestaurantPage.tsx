import { useState, useMemo, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { demoRestaurant, demoMenu, menuCategories as demoCats } from "@/data/demo-restaurant";
import { useRestaurantBySlug } from "@/hooks/useRestaurantBySlug";
import SplashScreen from "@/components/restaurant/SplashScreen";
import CartDrawer from "@/components/restaurant/CartDrawer";
import FloatingCartButton from "@/components/restaurant/FloatingCartButton";
import ItemDetailSheet from "@/components/restaurant/ItemDetailSheet";
import PrivateChat from "@/components/restaurant/PrivateChat";
import ReviewShield from "@/components/restaurant/ReviewShield";
import restaurantLogo from "@/assets/restaurant-logo.png";
import storyInterior from "@/assets/story-interior.jpg";
import storyPasta from "@/assets/story-pasta.jpg";
import storyWine from "@/assets/story-wine.jpg";
import storyDish from "@/assets/story-dish.jpg";
import heroVideo from "@/assets/hero-restaurant.mp4";
import { Search, Star, Crown, Phone, Mail, MapPin, Clock, ChevronDown, Plus, ShoppingBag, X, Menu as MenuIcon, CalendarDays } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import type { MenuItem } from "@/types/restaurant";
import { useCart } from "@/context/CartContext";

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

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "story", label: "Chi Siamo" },
    { id: "menu-section", label: "Menù" },
    { id: "contact", label: "Contatti" },
  ];

  if (showSplash) {
    return <SplashScreen restaurantName={restaurantName} onComplete={handleSplashComplete} />;
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
        <div className="fixed top-0 inset-x-0 z-[60] bg-primary/90 text-primary-foreground px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
          🪑 Tavolo {tableFromQR} — ordine assegnato automaticamente
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
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-bold text-foreground tracking-[0.15em] uppercase leading-none">
              {restaurantName.split(" ").map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h1>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="w-12 h-px bg-primary" />
              <p className="text-sm sm:text-base text-foreground/70 tracking-[0.2em] uppercase font-light">
                {restaurantTagline}
              </p>
              <span className="w-12 h-px bg-primary" />
            </div>
          </motion.div>

          <motion.button onClick={() => scrollToSection("menu-section")}
            className="mt-10 px-10 py-4 border-2 border-foreground/30 text-foreground text-sm tracking-[0.2em] uppercase font-medium hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            Ordina Ora
          </motion.button>
        </motion.div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <ChevronDown className="w-5 h-5 text-foreground/30" />
        </motion.div>
      </section>

      {/* ====== 2. LA NOSTRA STORIA ====== */}
      <section id="story" className="py-20 sm:py-28 px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">La Nostra Storia</span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-display font-bold text-foreground leading-tight">
              Una passione per la<br />
              <span className="text-gold-gradient">cucina autentica</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Nel cuore della città vi attende {restaurantName} — un luogo dove l'ospitalità italiana incontra l'eccellenza culinaria. 
              La nostra cucina unisce ricette tradizionali con accenti moderni, utilizzando solo gli ingredienti più pregiati d'Italia e del territorio.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Dalla nostra pasta fatta a mano alle carni selezionate, dai vini della nostra enoteca ai dolci della tradizione — 
              ogni visita diventa un'esperienza indimenticabile per tutti i sensi.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-display font-bold text-foreground">Chef & Proprietario</p>
                <p className="text-sm text-muted-foreground">{restaurantName}</p>
              </div>
            </div>
          </motion.div>

          {/* Photo Grid */}
          <motion.div className="grid grid-cols-2 gap-3" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            {[storyInterior, storyWine, storyPasta, storyDish].map((img, i) => (
              <motion.div key={i} className={`overflow-hidden rounded-2xl ${i === 0 ? "row-span-2" : ""}`}
                whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}>
                <img src={img} alt="Restaurant" className={`w-full object-cover ${i === 0 ? "h-full" : "h-48 sm:h-56"}`} loading="lazy" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== 3. MENU — Le Nostre Specialità ====== */}
      <section id="menu-section" className="py-20 sm:py-28 px-5 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">Le Nostre Specialità</span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-display font-bold text-foreground">Il Nostro Menù</h2>
          </motion.div>

          {/* Signature Dishes — Featured Grid */}
          {popularItems.length > 0 && (
            <div className="mb-16">
              <h3 className="text-lg font-display font-semibold text-foreground mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" /> Piatti Signature
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {popularItems.map((item, i) => (
                  <motion.div key={item.id}
                    className="group relative rounded-2xl overflow-hidden bg-card border border-border/30 hover:border-primary/30 transition-all duration-500 cursor-pointer"
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
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
                    <div className="p-5">
                      <h4 className="font-display text-lg font-bold text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xl font-display font-bold text-primary">€{item.price.toFixed(2)}</span>
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
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6">
              {menuCategories.map((cat) => (
                <button key={cat} onClick={() => setActiveMenuCat(cat)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300
                    ${effectiveCat === cat ? "bg-primary text-primary-foreground" : "glass border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Items grid */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" key={effectiveCat}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              {catItems.map((item, i) => (
                <motion.div key={item.id}
                  className="group flex gap-4 p-4 rounded-2xl bg-card border border-border/30 hover:border-primary/20 transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedItem(item)}>
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
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
          </div>
        </div>
      </section>

      {/* ====== 4. CONTATTI & ORARI ====== */}
      <section id="contact" className="py-20 sm:py-28 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-medium">Vieni a Trovarci</span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-display font-bold text-foreground">Contatti & Orari</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location */}
            <motion.div className="p-8 rounded-3xl glass border border-border/30"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold text-foreground mb-3">{restaurantCity}</h3>
              <p className="text-sm text-muted-foreground mb-4">{restaurantAddress}</p>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(restaurantAddress + " " + restaurantCity)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-primary font-semibold tracking-wider uppercase hover:underline">
                Apri su Google Maps →
              </a>
            </motion.div>

            {/* Contacts */}
            <motion.div className="p-8 rounded-3xl glass border border-border/30"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <Phone className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold text-foreground mb-3">Contatti</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <a href={`tel:${restaurantPhone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" /> {restaurantPhone}
                </a>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> info@{slug}.it
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {restaurantAddress}
                </p>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div className="p-8 rounded-3xl glass border border-border/30"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <Clock className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-display text-lg font-bold text-foreground mb-3">Orari di Apertura</h3>
              <div className="space-y-2 text-sm">
                {[
                  { day: "Lunedì - Venerdì", hours: "12:00 - 15:00 · 19:00 - 23:30" },
                  { day: "Sabato", hours: "12:00 - 15:30 · 19:00 - 24:00" },
                  { day: "Domenica", hours: "Chiuso" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-border/20 last:border-0">
                    <span className="text-foreground font-medium text-xs">{item.day}</span>
                    <span className={`text-xs ${item.hours === "Chiuso" ? "text-accent" : "text-muted-foreground"}`}>{item.hours}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-border/30 py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={restaurantLogoUrl} alt="" className="w-8 h-8 rounded-lg object-contain" />
            <span className="font-display font-bold text-foreground tracking-[0.08em] uppercase text-sm">{restaurantName}</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 {restaurantName}. Tutti i diritti riservati.</p>
          <p className="text-[10px] text-muted-foreground/50">Powered by Empire</p>
        </div>
      </footer>

      {/* ====== OVERLAYS ====== */}
      <ItemDetailSheet item={selectedItem} onClose={() => setSelectedItem(null)} />
      <PrivateChat />
      <FloatingCartButton onClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default RestaurantPage;
