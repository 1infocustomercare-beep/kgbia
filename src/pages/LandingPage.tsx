import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { 
  Crown, ChevronRight, Check, Calculator, Star, 
  Zap, Shield, Smartphone, TrendingUp, X,
  Sparkles, Lock, Menu, Target, DollarSign, Brain,
  ChefHat, AlertTriangle, Banknote, ArrowDown, ArrowRight,
  MessageCircle, HelpCircle, ChevronDown, Eye, Play, Gem,
  Users, Rocket, CreditCard, Gift, Trophy, Award, Handshake,
  Quote
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LivePreview from "@/components/restaurant/LivePreview";
import { InfoGuide } from "@/components/ui/info-guide";

// Animated counter
const AnimatedNumber = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{display.toLocaleString("it-IT")}{suffix}</span>;
};

// Floating orb background
const GlowOrb = ({ className }: { className?: string }) => (
  <div className={`absolute rounded-full blur-[120px] opacity-20 pointer-events-none ${className}`} />
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [monthlyOrders, setMonthlyOrders] = useState(500);
  const [avgOrder, setAvgOrder] = useState(25);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeAudience, setActiveAudience] = useState<"ristoratore" | "partner">("ristoratore");

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const navLinks = [
    { id: "home", href: "#hero", label: "Home" },
    { id: "features", href: "#features", label: "Funzioni" },
    { id: "pricing", href: "#pricing", label: "Prezzo" },
    { id: "partner", href: "#partner", label: "Partner" },
    { id: "contact", href: "#contact", label: "Contatti" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["contact", "testimonials", "partner", "pricing", "calculator", "features", "pain", "vision", "hero"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
                if (id === "hero" || id === "vision" || id === "pain") setActiveSection("home");
                else if (id === "calculator" || id === "testimonials") setActiveSection("features");
            else setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ROI — updated prices
  const setupCost = 2997;
  const justEatFee = 0.30;
  const empireFee = 0.02;
  const monthlyRevenue = monthlyOrders * avgOrder;
  const justEatCost = monthlyRevenue * justEatFee;
  const empireCost = monthlyRevenue * empireFee;
  const monthlySaving = justEatCost - empireCost;
  const roiMonths = monthlySaving > 0 ? Math.ceil(setupCost / monthlySaving) : 0;
  const yearSaving = monthlySaving * 12;
  const justEatBarWidth = 100;
  const empireBarWidth = Math.max(5, (empireCost / justEatCost) * 100);

  const featureCards = [
    { icon: <Brain className="w-6 h-6" />, title: "AI Menu Creator", benefit: "Elimina €2.000+ costi fotografi", desc: "Carica una foto del menu. L'IA estrae testi, prezzi e genera foto food-porn in 60 secondi.", tag: "IA", gradient: "from-violet-500/20 to-fuchsia-500/20" },
    { icon: <ChefHat className="w-6 h-6" />, title: "Kitchen View", benefit: "Zero errori, zero perdite", desc: "Ordini in tempo reale con notifiche sonore, stati ordine e stampa ticket integrata.", tag: "STAFF", gradient: "from-amber-500/20 to-orange-500/20" },
    { icon: <AlertTriangle className="w-6 h-6" />, title: "Panic Mode", benefit: "Margini protetti in 2 sec", desc: "Uno slider per modificare tutti i prezzi in percentuale. Sincronizzazione real-time su tutti i dispositivi.", tag: "MARGINI", gradient: "from-red-500/20 to-rose-500/20" },
    { icon: <Lock className="w-6 h-6" />, title: "Vault Fiscale", benefit: "Fiscalità 100% compliant", desc: "Chiavi criptate AES-256, isolamento per tenant. L'agente AI-Mary guida il setup API fiscali.", tag: "FISCO", gradient: "from-emerald-500/20 to-teal-500/20" },
    { icon: <Shield className="w-6 h-6" />, title: "Review Shield", benefit: "Solo 4-5★ su Google", desc: "Filtro intelligente: recensioni 1-3★ nel tuo archivio privato. Solo le migliori costruiscono la tua reputazione.", tag: "BRAND", gradient: "from-sky-500/20 to-blue-500/20" },
    { icon: <Smartphone className="w-6 h-6" />, title: "PWA White Label", benefit: "Asset Digitale di Proprietà", desc: "App installabile come nativa. Logo, colori, dominio personalizzato. Zero commissioni marketplace.", tag: "BRAND", gradient: "from-primary/20 to-amber-500/20" },
  ];

  const faqs = [
    { q: "È difficile da usare?", a: "No. Se sai usare Instagram, sai usare Empire. L'interfaccia è progettata per ristoratori, non per programmatori. L'IA fa il lavoro pesante: carica una foto del menu e in 60 secondi hai il catalogo digitale completo." },
    { q: "Come arrivano i soldi?", a: "I pagamenti dei clienti arrivano direttamente sul TUO conto Stripe. Non tocchiamo mai i tuoi soldi. L'unica trattenuta è il 2% automatico — 15 volte meno di JustEat. Trasparenza totale." },
    { q: "Quanto costa davvero Empire?", a: "€2.997 una tantum (o in comode rate). Dopodiché €0/mese per sempre. Solo il 2% sulle transazioni per mantenere infrastruttura, IA e aggiornamenti. Un ristorante con 500 ordini/mese a €25 risparmia oltre €40.000/anno rispetto a JustEat." },
    { q: "La fiscalità è sicura?", a: "Assolutamente. Le tue chiavi API fiscali sono criptate con standard bancario AES-256 nel Vault privato. Nessuno può vederle, nemmeno il nostro team. L'agente AI-Mary valida la connessione e mostra solo lo stato operativo." },
    { q: "Cosa succede ai miei clienti di JustEat?", a: "Li recuperi. Con il QR Code sui tavoli e il tuo link diretto, i clienti ordinano dalla TUA app. Ogni ordine che sposti da JustEat a Empire ti fa risparmiare il 28% netto." },
    { q: "Come funziona il Partner Program?", a: "Diventi Partner gratis. Ricevi €997 per ogni vendita chiusa + €50 override da Team Leader dalla 4ª vendita di ogni membro. Bonus mensili fino a €1.500. Pagamenti istantanei via Stripe Connect." },
  ];

  const scrollToPricing = () => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  const scrollToPartner = () => document.getElementById("partner")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden overflow-y-auto relative">
      {/* Global ambient orbs */}
      <GlowOrb className="w-[600px] h-[600px] bg-primary top-0 -left-60" />
      <GlowOrb className="w-[500px] h-[500px] bg-accent top-[80vh] -right-40" />
      <GlowOrb className="w-[400px] h-[400px] bg-violet-500 top-[200vh] left-1/2" />

      {/* ====== NAV — Glassmorphism ====== */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-3 mt-3 rounded-2xl glass-strong border border-border/20">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="#hero" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Crown className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display font-bold text-sm text-foreground tracking-[0.12em] uppercase">Empire</span>
            </a>
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-muted/40">
              {navLinks.map((link) => (
                <a key={link.id} href={link.href}
                  className={`relative px-3 py-2 text-xs font-medium tracking-[0.1em] uppercase rounded-lg transition-all duration-300
                    ${activeSection === link.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {activeSection === link.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 bg-primary rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/r/impero-roma")}
                className="hidden md:inline-flex px-4 py-2 rounded-xl bg-foreground/5 border border-border/50 text-foreground text-xs font-medium tracking-widest uppercase hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                <Play className="w-3.5 h-3.5 mr-2" /> Demo
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-foreground" aria-label="Menu">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="lg:hidden mx-3 mt-1 rounded-2xl glass-strong border border-border/20 overflow-hidden">
              <div className="flex flex-col items-center gap-1 py-4">
                {navLinks.map((link) => (
                  <a key={link.id} href={link.href} onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-center py-3 text-sm font-medium tracking-[0.15em] uppercase transition-colors rounded-lg mx-2
                      ${activeSection === link.id ? "text-primary bg-primary/5" : "text-muted-foreground"}`}>
                    {link.label}
                  </a>
                ))}
                <button onClick={() => { navigate("/r/impero-roma"); setMobileMenuOpen(false); }}
                  className="mt-2 mx-5 w-[calc(100%-2.5rem)] py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium tracking-widest uppercase">
                  Demo Live
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ====== 1. HERO ====== */}
      <section id="hero" ref={heroRef} className="relative min-h-[92vh] sm:min-h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[350px] sm:h-[500px] bg-primary/10 rounded-full blur-[150px]" />

        <motion.div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-14 px-4 max-w-6xl w-full pt-24 sm:pt-28 pb-8 sm:pb-16"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}>
          
          {/* Left */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-primary/20 mb-4 sm:mb-8">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] sm:text-xs font-medium text-primary tracking-wider uppercase">La Rivoluzione per i Ristoratori</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
              className="text-[2rem] leading-[1.1] sm:text-6xl lg:text-7xl font-display font-bold text-foreground tracking-tight">
              Riprenditi il tuo{" "}
              <span className="relative inline-block">
                <span className="text-gold-gradient">Impero</span>
                <motion.span className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.2, duration: 0.8 }} />
              </span>
            </motion.h1>

            <motion.p className="mt-3 sm:mt-6 text-sm sm:text-xl text-foreground/60 max-w-xl leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              L'Asset Digitale di Proprietà che ti libera dal 30% di commissioni.{" "}
              <span className="text-foreground font-medium">€2.997 una volta. Per sempre.</span>
            </motion.p>

            {/* Audience toggle */}
            <motion.div className="mt-4 sm:mt-6 flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/30"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              {(["ristoratore", "partner"] as const).map((aud) => (
                <button key={aud} onClick={() => { setActiveAudience(aud); if (aud === "partner") scrollToPartner(); else scrollToPricing(); }}
                  className={`relative px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all
                    ${activeAudience === aud ? "text-primary-foreground" : "text-muted-foreground"}`}>
                  {activeAudience === aud && (
                    <motion.span layoutId="aud-pill" className="absolute inset-0 bg-primary rounded-lg" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {aud === "ristoratore" ? <><ChefHat className="w-3.5 h-3.5" /> Ristoratore</> : <><Handshake className="w-3.5 h-3.5" /> Partner</>}
                  </span>
                </button>
              ))}
            </motion.div>

            <motion.div className="mt-5 sm:mt-8 flex flex-row items-center gap-3 w-full sm:w-auto justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <motion.button onClick={scrollToPricing}
                className="group relative flex-1 sm:flex-none px-6 sm:px-10 py-3.5 sm:py-4 bg-primary text-primary-foreground font-semibold text-xs sm:text-sm tracking-widest uppercase rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Inizia Ora <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-primary via-amber-400 to-primary bg-[length:200%_100%]"
                  animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
              </motion.button>
              <button onClick={() => navigate("/r/impero-roma")}
                className="group flex-1 sm:flex-none px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl glass border border-foreground/10 text-foreground text-xs sm:text-sm tracking-widest uppercase hover:border-primary/40 transition-all duration-300 flex items-center justify-center gap-2">
                <Play className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-primary" /> Demo
              </button>
            </motion.div>

            {/* Trust */}
            <motion.div className="mt-4 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[10px] sm:text-xs text-foreground/40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              {[
                { icon: <Lock className="w-3 h-3" />, text: "AES-256" },
                { icon: <Zap className="w-3 h-3" />, text: "Setup 60s" },
                { icon: <Gem className="w-3 h-3" />, text: "Zero Canoni" },
                { icon: <Shield className="w-3 h-3" />, text: "GDPR Compliant" },
              ].map((badge, i) => (
                <span key={i} className="flex items-center gap-1">{badge.icon} {badge.text}</span>
              ))}
            </motion.div>
          </div>

          {/* Right: Live Preview */}
          <motion.div className="flex-shrink-0"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 1 }}>
            <div className="relative">
              <div className="absolute -inset-8 bg-primary/15 rounded-[60px] blur-[60px]" />

              {/* Annotations — Desktop only */}
              {[
                { label: "Menu Digitale AI", emoji: "🤖", top: "4%", delay: 1.5 },
                { label: "Ordini Real-Time", emoji: "⚡", top: "28%", delay: 2.2 },
                { label: "Zero Commissioni", emoji: "💰", top: "52%", delay: 2.9 },
                { label: "Kitchen View", emoji: "👨‍🍳", top: "76%", delay: 3.4 },
              ].map((ann, i) => (
                <motion.div key={`l-${i}`}
                  className="absolute hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl glass border border-primary/20 shadow-lg whitespace-nowrap"
                  style={{ top: ann.top, right: "calc(100% + 20px)" }}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ann.delay, duration: 0.6 }}>
                  <span className="text-sm">{ann.emoji}</span>
                  <span className="text-[11px] font-medium text-foreground">{ann.label}</span>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-4 h-px bg-primary/30" />
                </motion.div>
              ))}

              {[
                { label: "PWA Installabile", emoji: "📱", top: "10%", delay: 1.8 },
                { label: "Review Shield", emoji: "🛡️", top: "34%", delay: 2.5 },
                { label: "Chat Privata", emoji: "💬", top: "58%", delay: 3.0 },
                { label: "Pagamenti Sicuri", emoji: "🔒", top: "82%", delay: 3.6 },
              ].map((ann, i) => (
                <motion.div key={`r-${i}`}
                  className="absolute hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl glass border border-primary/20 shadow-lg whitespace-nowrap"
                  style={{ top: ann.top, left: "calc(100% + 20px)" }}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ann.delay, duration: 0.6 }}>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-4 h-px bg-primary/30" />
                  <span className="text-sm">{ann.emoji}</span>
                  <span className="text-[11px] font-medium text-foreground">{ann.label}</span>
                </motion.div>
              ))}

              {/* Mobile annotations */}
              <motion.div className="flex xl:hidden flex-wrap justify-center gap-1.5 mt-3 px-1"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.6 }}>
                {[
                  { label: "Menu AI", emoji: "🤖" },
                  { label: "Real-Time", emoji: "⚡" },
                  { label: "0 Commissioni", emoji: "💰" },
                  { label: "Kitchen", emoji: "👨‍🍳" },
                  { label: "PWA", emoji: "📱" },
                  { label: "Review Shield", emoji: "🛡️" },
                  { label: "Chat", emoji: "💬" },
                  { label: "Pagamenti", emoji: "🔒" },
                ].map((ann, i) => (
                  <motion.span key={i}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-card/80 border border-primary/10 text-[9px] font-medium text-foreground/80 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 + i * 0.1, duration: 0.3 }}>
                    <span>{ann.emoji}</span>{ann.label}
                  </motion.span>
                ))}
              </motion.div>

              <div className="w-[280px] sm:w-[300px]">
                <LivePreview slug="impero-roma" primaryColor="#C8963E" compact />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
          <span className="text-[9px] sm:text-[10px] text-foreground/30 tracking-widest uppercase">Scopri</span>
          <ArrowDown className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-primary/40" />
        </motion.div>
      </section>

      {/* ====== 2. PROBLEM ====== */}
      <section id="pain" className="relative py-12 sm:py-24 px-4">
        <GlowOrb className="w-[400px] h-[400px] bg-accent -top-40 right-0" />
        <div className="max-w-5xl mx-auto relative">
          <motion.div className="text-center mb-8 sm:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-[10px] sm:text-xs font-medium text-accent tracking-wider uppercase mb-3">
              <AlertTriangle className="w-3 h-3" /> Il Problema
            </span>
            <h2 className="text-2xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
              Ogni mese, <span className="text-accent">regali migliaia</span><br className="hidden sm:block" /> di euro
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
            {[
              { icon: <Banknote className="w-7 h-7" />, amount: "€7.500", label: "Margini erosi / mese", sub: "su 1000 ordini a €25" },
              { icon: <DollarSign className="w-7 h-7" />, amount: "€90.000", label: "Dispersi ogni anno", sub: "capitale che alimenta i competitor" },
              { icon: <Target className="w-7 h-7" />, amount: "€0", label: "Proprietà clienti", sub: "il marketplace possiede i tuoi dati" },
            ].map((item, i) => (
              <motion.div key={i}
                className="group relative p-5 sm:p-7 rounded-2xl glass border border-border/30 hover:border-accent/30 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-3">{item.icon}</div>
                  <p className="text-3xl sm:text-4xl font-display font-bold text-accent">{item.amount}</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground mt-1.5">{item.label}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="text-center mt-8 sm:mt-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-sm sm:text-lg text-muted-foreground">E se potessi trattenere <strong className="text-primary">il 98%</strong> dei tuoi margini?</p>
            <ArrowDown className="w-4 sm:w-5 h-4 sm:h-5 text-primary mx-auto mt-3 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ====== 3. STATS ====== */}
      <section id="vision" className="relative py-12 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-8 sm:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-[10px] sm:text-xs font-medium text-primary tracking-wider uppercase mb-3">
              <Sparkles className="w-3 h-3" /> La Soluzione
            </span>
            <h2 className="text-2xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
              Il tuo <span className="text-gold-gradient">controllo totale</span>
            </h2>
            <p className="mt-2 sm:mt-4 text-xs sm:text-base text-muted-foreground max-w-md mx-auto">
              Una suite che ti libera dalle piattaforme e protegge i tuoi margini.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: 2, suffix: "%", label: "Fee totale", icon: <TrendingUp className="w-4 h-4" /> },
              { value: 0, prefix: "€", label: "Canone mensile", icon: <Banknote className="w-4 h-4" /> },
              { value: 60, suffix: "s", label: "Menu IA pronto", icon: <Zap className="w-4 h-4" /> },
              { value: 98, suffix: "%", label: "Margini salvati", icon: <Shield className="w-4 h-4" /> },
            ].map((s, i) => (
              <motion.div key={i}
                className="relative p-4 sm:p-6 rounded-2xl glass border border-border/30 text-center overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">{s.icon}</div>
                <p className="text-2xl sm:text-4xl font-display font-bold text-primary">
                  <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 4. FEATURES ====== */}
      <section id="features" className="relative py-12 sm:py-24 px-4">
        <GlowOrb className="w-[500px] h-[500px] bg-violet-500 -top-20 left-1/4" />
        <div className="max-w-5xl mx-auto relative">
          <motion.div className="text-center mb-8 sm:mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-[10px] sm:text-xs font-medium text-primary tracking-wider uppercase mb-3">
              <Zap className="w-3 h-3" /> L'Arsenale
            </span>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl sm:text-5xl font-display font-bold text-foreground">
                Ogni funzione, un <span className="text-gold-gradient">vantaggio</span>
              </h2>
              <InfoGuide
                title="Arsenale Funzionalità"
                description="Ogni card rappresenta una funzione inclusa nel tuo abbonamento Empire. Nessun costo aggiuntivo."
                steps={[
                  "Leggi il beneficio economico di ogni funzione (es. 'Elimina €2.000+ costi fotografi')",
                  "Clicca sulla Demo in alto per vedere le funzioni in azione",
                  "Tutte le funzioni sono attive dal giorno 1 del tuo abbonamento",
                ]}
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {featureCards.map((feat, i) => (
              <motion.div key={i}
                className={`group relative p-4 sm:p-6 rounded-2xl glass border border-border/30 hover:border-primary/30 transition-all duration-500 overflow-hidden
                  ${i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}`}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                      {feat.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display text-sm sm:text-base font-bold text-foreground">{feat.title}</h3>
                        <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold tracking-wider">{feat.tag}</span>
                      </div>
                      <p className="text-[10px] sm:text-xs font-semibold text-primary mt-0.5">💰 {feat.benefit}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 5. ROI CALCULATOR ====== */}
      <section id="calculator" className="relative py-12 sm:py-24 px-4">
        <div className="max-w-2xl mx-auto relative">
          <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-[10px] sm:text-xs font-medium text-primary tracking-wider uppercase mb-3">
              <Calculator className="w-3 h-3" /> ROI Calculator
            </span>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl sm:text-5xl font-display font-bold text-foreground">
                Il tuo <span className="text-gold-gradient">risparmio reale</span>
              </h2>
              <InfoGuide
                title="Calcolatore ROI"
                description="Confronta quanto paghi oggi con i marketplace (30% di commissione) rispetto a Empire (solo 2%). Il calcolatore mostra il risparmio reale basato sui tuoi dati."
                steps={[
                  "Sposta gli slider per inserire i tuoi ordini mensili e lo scontrino medio",
                  "Il grafico mostra il confronto visivo tra le commissioni marketplace vs Empire",
                  "In basso vedi il risparmio mensile, annuale e in quanti mesi recuperi l'investimento",
                ]}
              />
            </div>
          </motion.div>

          <motion.div className="p-5 sm:p-8 rounded-2xl glass border border-border/30 space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            
            {[
              { label: "Ordini al mese", value: monthlyOrders, min: 100, max: 3000, step: 50, display: monthlyOrders.toString(), onChange: setMonthlyOrders },
              { label: "Scontrino medio", value: avgOrder, min: 10, max: 80, step: 5, display: `€${avgOrder}`, onChange: setAvgOrder },
            ].map((slider, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span className="text-muted-foreground">{slider.label}</span>
                  <span className="text-foreground font-bold text-base sm:text-lg font-display">{slider.display}</span>
                </div>
                <input type="range" min={slider.min} max={slider.max} step={slider.step} value={slider.value}
                  onChange={(e) => slider.onChange(Number(e.target.value))} className="w-full accent-primary h-2 rounded-full" />
              </div>
            ))}

            <div className="space-y-3 pt-4 border-t border-border/30">
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                  <span className="text-muted-foreground">💸 Marketplace (30%)</span>
                  <span className="text-accent font-display font-bold">-€{justEatCost.toLocaleString("it-IT", { maximumFractionDigits: 0 })}/mese</span>
                </div>
                <div className="h-8 sm:h-10 rounded-xl bg-accent/10 overflow-hidden relative">
                  <motion.div className="h-full bg-gradient-to-r from-accent/40 to-accent/60 rounded-xl flex items-center justify-end pr-3"
                    initial={{ width: 0 }} animate={{ width: `${justEatBarWidth}%` }} transition={{ duration: 1, delay: 0.3 }}>
                    <span className="text-xs font-bold text-foreground">-30%</span>
                  </motion.div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                  <span className="text-muted-foreground">👑 Empire (2%)</span>
                  <span className="text-primary font-display font-bold">-€{empireCost.toLocaleString("it-IT", { maximumFractionDigits: 0 })}/mese</span>
                </div>
                <div className="h-8 sm:h-10 rounded-xl bg-primary/10 overflow-hidden relative">
                  <motion.div className="h-full bg-gradient-to-r from-primary/30 to-primary/50 rounded-xl flex items-center justify-end pr-3"
                    initial={{ width: 0 }} animate={{ width: `${empireBarWidth}%` }} transition={{ duration: 1, delay: 0.5 }}>
                    <span className="text-xs font-bold text-foreground">-2%</span>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium text-xs sm:text-sm">Risparmi al mese</span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-primary">
                  €{monthlySaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium text-xs sm:text-sm">Risparmi all'anno</span>
                <span className="text-2xl sm:text-3xl font-display font-bold text-gold-gradient">
                  €{yearSaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                <span className="text-muted-foreground text-xs sm:text-sm">ROI completo in</span>
                <span className="text-foreground font-display font-bold text-base sm:text-lg">{roiMonths} {roiMonths === 1 ? "mese" : "mesi"}</span>
              </div>
            </div>

            <motion.button onClick={scrollToPricing}
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm tracking-wide"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              Inizia il tuo Impero · €2.997
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ====== 6. PRICING — Updated to €2.997 ====== */}
      <section id="pricing" className="relative py-12 sm:py-24 px-4">
        <GlowOrb className="w-[600px] h-[400px] bg-primary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div className="text-center mb-8 sm:mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-[10px] sm:text-xs font-medium text-primary tracking-wider uppercase mb-3">
              <Crown className="w-3 h-3" /> Investimento
            </span>
            <h2 className="text-2xl sm:text-5xl font-display font-bold text-foreground">
              Scegli il tuo <span className="text-gold-gradient">piano</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Un unico investimento. Nessun canone mensile. L'app è tua per sempre.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-8">
            {/* 6 Rate */}
            <motion.div className="relative p-5 sm:p-7 rounded-2xl glass border border-border/30 hover:border-primary/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}>
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">6 Rate</p>
              <p className="text-3xl sm:text-4xl font-display font-bold text-foreground">€549<span className="text-base sm:text-lg text-muted-foreground font-normal">/mese</span></p>
              <p className="text-xs text-muted-foreground mt-1">Totale: €3.294 · IVA inclusa</p>
              <div className="mt-4 sm:mt-6 space-y-2">
                {["Tutte le funzionalità", "Pagamento dilazionato", "Attivazione immediata", "Massima flessibilità"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-foreground/70">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/admin")}
                className="mt-4 sm:mt-6 w-full py-3 rounded-xl border border-primary/30 text-primary font-semibold text-xs sm:text-sm tracking-wide hover:bg-primary hover:text-primary-foreground transition-all min-h-[44px]">
                Scegli 6 Rate
              </button>
            </motion.div>

            {/* Full — HERO */}
            <motion.div className="relative p-5 sm:p-7 rounded-2xl glass border-2 border-primary/40 overflow-hidden md:-mt-4 md:mb-0"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] sm:text-xs font-semibold text-primary tracking-wider uppercase">Pagamento Unico</p>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[9px] sm:text-[10px] font-bold text-primary">BEST VALUE</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl sm:text-5xl font-display font-bold text-foreground">€2.997</p>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">IVA 22% inclusa · Una volta sola</p>
                <div className="mt-4 sm:mt-6 space-y-1.5">
                  {[
                    "Asset Digitale di Proprietà",
                    "AI Menu Creator + OCR",
                    "Kitchen View real-time",
                    "Vault Fiscale AES-256",
                    "Panic Mode + Review Shield",
                    "PWA White Label",
                    "Chat Privata + Notifiche Push",
                    "Mappa Tavoli Interattiva",
                    "Assistenza a vita",
                    "Zero canoni mensili",
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-foreground/80">
                      <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-primary" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
                <motion.button onClick={() => navigate("/admin")}
                  className="mt-4 sm:mt-6 w-full py-3.5 sm:py-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm tracking-wide relative overflow-hidden min-h-[48px]"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <span className="relative z-10">Inizia il tuo Impero</span>
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-primary via-amber-400 to-primary bg-[length:200%_100%]"
                    animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                </motion.button>
                <p className="mt-3 text-[10px] text-center text-muted-foreground">Dopo: €0/mese · Solo 2% sulle transazioni</p>
              </div>
            </motion.div>

            {/* 3 Rate */}
            <motion.div className="relative p-5 sm:p-7 rounded-2xl glass border border-border/30 hover:border-primary/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">3 Rate</p>
              <p className="text-3xl sm:text-4xl font-display font-bold text-foreground">€1.099<span className="text-base sm:text-lg text-muted-foreground font-normal">/mese</span></p>
              <p className="text-xs text-muted-foreground mt-1">Totale: €3.297 · IVA inclusa</p>
              <div className="mt-4 sm:mt-6 space-y-2">
                {["Tutte le funzionalità", "Massima flessibilità", "Attivazione immediata", "Chiusura rapida"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-foreground/70">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/admin")}
                className="mt-4 sm:mt-6 w-full py-3 rounded-xl border border-primary/30 text-primary font-semibold text-xs sm:text-sm tracking-wide hover:bg-primary hover:text-primary-foreground transition-all min-h-[44px]">
                Scegli 3 Rate
              </button>
            </motion.div>
          </div>

          {/* Fee transparency */}
          <motion.div className="text-center p-4 rounded-2xl glass border border-border/20"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-xs sm:text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">Dopo l'attivazione:</span> €0/mese di canone · Solo <span className="text-primary font-bold">2%</span> sulle transazioni per manutenzione tecnica, IA e aggiornamenti
            </p>
          </motion.div>
        </div>
      </section>

      {/* ====== 7. PARTNER PROGRAM ====== */}
      <section id="partner" className="relative py-12 sm:py-24 px-4 overflow-hidden">
        <GlowOrb className="w-[500px] h-[500px] bg-amber-500 top-0 -right-40" />
        <div className="max-w-5xl mx-auto relative">
          <motion.div className="text-center mb-8 sm:mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-[10px] sm:text-xs font-medium text-primary tracking-wider uppercase mb-3">
              <Users className="w-3 h-3" /> Partner Program
            </span>
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                Costruisci il tuo <span className="text-gold-gradient">Impero</span>
              </h2>
              <InfoGuide
                title="Partner Program"
                description="Il programma partner ti permette di guadagnare vendendo Empire ai ristoratori. Nessun investimento iniziale, commissioni alte e pagamenti istantanei via Stripe."
                steps={[
                  "Registrati gratis come Partner dalla pagina dedicata",
                  "Usa la Sandbox Demo per mostrare l'app ai ristoratori",
                  "Guadagni €997 per ogni vendita + bonus mensili + override come Team Leader",
                ]}
              />
            </div>
            <p className="mt-2 sm:mt-4 text-xs sm:text-base text-muted-foreground max-w-lg mx-auto">
              Diventa Partner Empire e guadagna €997 per ogni vendita. Zero rischi, strumenti elite, pagamenti istantanei.
            </p>
          </motion.div>

          {/* Earnings breakdown */}
          <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {[
              { value: "€997", label: "Per vendita", icon: <Trophy className="w-4 h-4" />, sub: "Commissione Partner" },
              { value: "€50", label: "Override TL", icon: <Award className="w-4 h-4" />, sub: "Dalla 4ª vendita" },
              { value: "€500", label: "Bonus 3 vendite", icon: <Gift className="w-4 h-4" />, sub: "Bonus mensile" },
              { value: "€1.500", label: "Bonus 5 vendite", icon: <Rocket className="w-4 h-4" />, sub: "Bonus Elite" },
            ].map((s, i) => (
              <motion.div key={i} className="p-3 sm:p-5 rounded-2xl glass border border-border/30 text-center"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto mb-1.5">{s.icon}</div>
                <p className="text-xl sm:text-2xl font-display font-bold text-primary">{s.value}</p>
                <p className="text-[10px] sm:text-xs font-semibold text-foreground mt-0.5">{s.label}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground">{s.sub}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Career path */}
          <motion.div className="p-4 sm:p-6 rounded-2xl glass border border-primary/20 mb-6 sm:mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="font-display font-bold text-base sm:text-lg text-foreground text-center mb-4">Percorso di Carriera</h3>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 justify-between">
              {[
                { step: "1", title: "Partner", desc: "€997/vendita", icon: <Handshake className="w-5 h-5" /> },
                { step: "2", title: "3 Vendite", desc: "Promozione automatica", icon: <TrendingUp className="w-5 h-5" /> },
                { step: "3", title: "Team Leader", desc: "+€50 override dalla 4ª vendita", icon: <Crown className="w-5 h-5" /> },
              ].map((s, i) => (
                <div key={i} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{s.icon}</div>
                  <div className="text-left sm:text-center">
                    <p className="text-xs font-bold text-foreground">{s.title}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  {i < 2 && <ArrowRight className="hidden sm:block w-5 h-5 text-primary/30 mx-4 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
            {[
              {
                icon: <Trophy className="w-6 h-6" />,
                title: "Guadagni High-Ticket",
                desc: "€997 per ogni singola vendita. Con soli 5 contratti al mese guadagni €4.985 + €1.500 bonus = €6.485/mese.",
                highlight: "€997 / vendita",
                gradient: "from-primary/20 to-amber-500/20",
              },
              {
                icon: <CreditCard className="w-6 h-6" />,
                title: "Pagamenti Istantanei",
                desc: "Grazie a Stripe Connect, ricevi la provvigione automaticamente al momento del pagamento del cliente. Zero attese.",
                highlight: "Payout Automatico",
                gradient: "from-sky-500/20 to-blue-500/20",
              },
              {
                icon: <Rocket className="w-6 h-6" />,
                title: "Sandbox Demo",
                desc: "Ti diamo una demo perfetta pre-configurata con dati reali. Non spieghi l'app, la mostri. Si vende da sola.",
                highlight: "Demo Chiavi in Mano",
                gradient: "from-violet-500/20 to-fuchsia-500/20",
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: "Bonus Acceleratori",
                desc: "3 vendite/mese = €500 bonus. 5 vendite/mese = €1.500 bonus. Cumulabili con commissioni e override.",
                highlight: "Fino a €1.500/mese",
                gradient: "from-emerald-500/20 to-teal-500/20",
              },
            ].map((card, i) => (
              <motion.div key={i}
                className="group relative p-5 sm:p-7 rounded-2xl glass border border-border/30 hover:border-primary/30 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">{card.icon}</div>
                    <div>
                      <h3 className="font-display text-sm sm:text-base font-bold text-foreground">{card.title}</h3>
                      <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold tracking-wider">{card.highlight}</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scenario di guadagno */}
          <motion.div className="mt-6 sm:mt-10 p-4 sm:p-6 rounded-2xl glass border border-primary/20 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="font-display font-bold text-sm sm:text-base text-foreground text-center mb-3">📊 Scenario: 5 vendite al mese</h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">5× Commissioni Partner</span><span className="text-foreground font-bold">€4.985</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Bonus Elite mensile</span><span className="text-foreground font-bold">€1.500</span></div>
              <div className="flex justify-between pt-2 border-t border-primary/20">
                <span className="text-foreground font-semibold">Totale mensile</span>
                <span className="text-xl font-display font-bold text-primary">€6.485</span>
              </div>
              <p className="text-[10px] text-muted-foreground text-center pt-1">+ override €50/vendita come Team Leader dalla 4ª vendita di ogni membro del team</p>
            </div>
          </motion.div>

          {/* CTA Partner */}
          <motion.div className="mt-6 sm:mt-10 text-center"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Gift className="w-7 h-7 text-primary mx-auto mb-2" />
            <h3 className="font-display font-bold text-base sm:text-lg text-foreground mb-1">Zero Costi di Ingresso</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">Nessun investimento iniziale. Paghiamo solo il tuo talento.</p>
            <button onClick={() => navigate("/partner/register")}
              className="px-6 sm:px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm tracking-wide min-h-[44px]">
              Diventa Partner
            </button>
          </motion.div>
        </div>
      </section>

      {/* ====== 8. FAQ ====== */}
      <section className="py-12 sm:py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div className="text-center mb-8 sm:mb-14" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-[10px] sm:text-xs font-medium text-primary tracking-wider uppercase mb-3">
              <HelpCircle className="w-3 h-3" /> FAQ
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-foreground">
              Domande? <span className="text-gold-gradient">Risposte.</span>
            </h2>
          </motion.div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <motion.div key={i} className="rounded-xl glass border border-border/30 overflow-hidden"
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-5 text-left hover:bg-foreground/[0.02] transition-colors min-h-[48px]">
                  <span className="text-xs sm:text-sm font-semibold text-foreground pr-3">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}
                    className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ChevronDown className="w-4 h-4 text-primary" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}>
                      <p className="px-3.5 sm:px-5 pb-3.5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section id="testimonials" className="py-12 sm:py-24 px-4 relative overflow-hidden">
        <GlowOrb className="w-[500px] h-[400px] bg-amber-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-5xl mx-auto relative">
          <motion.div className="text-center mb-8 sm:mb-14" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-[10px] sm:text-xs font-medium text-primary tracking-wider uppercase mb-3">
              <Star className="w-3 h-3" /> Social Proof
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-foreground">
              Chi usa Empire, <span className="text-gold-gradient">non torna indietro</span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Ristoratori e Partner raccontano i risultati concreti ottenuti
            </p>
          </motion.div>

          {/* Ristoratori */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-10">
            {[
              {
                name: "Marco Pellegrini",
                role: "Titolare — Trattoria da Marco, Roma",
                quote: "In 3 mesi ho spostato il 60% degli ordini da JustEat alla mia app. Risparmio €3.200/mese netti. Il ROI si è ripagato in 3 settimane.",
                stars: 5,
                metric: "−€3.200/mese commissioni",
                gradient: "from-primary/10 to-amber-500/10",
              },
              {
                name: "Giulia Ferretti",
                role: "Chef & Owner — Osteria Ferretti, Milano",
                quote: "Kitchen View ha eliminato gli errori in cucina. Prima perdevamo 4-5 ordini a settimana per incomprensioni. Ora zero. Il setup ha richiesto 10 minuti.",
                stars: 5,
                metric: "Zero errori in cucina",
                gradient: "from-emerald-500/10 to-teal-500/10",
              },
              {
                name: "Antonio Russo",
                role: "Pizzeria Napoli Verace, Napoli",
                quote: "Review Shield è geniale. Le recensioni negative restano nel mio archivio, su Google ho solo 4.8★. I clienti nuovi arrivano grazie al rating perfetto.",
                stars: 5,
                metric: "4.8★ media su Google",
                gradient: "from-sky-500/10 to-blue-500/10",
              },
            ].map((t, i) => (
              <motion.div key={i}
                className={`relative p-5 sm:p-7 rounded-2xl glass border border-border/30 hover:border-primary/30 transition-all duration-500 group`}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${t.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <Quote className="w-6 h-6 text-primary/30 mb-3" />
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-4 italic">"{t.quote}"</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-[9px] sm:text-[10px] text-primary font-bold mb-4">
                    <TrendingUp className="w-3 h-3" /> {t.metric}
                  </div>
                  <div className="border-t border-border/30 pt-3">
                    <p className="text-xs sm:text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Partner */}
          <motion.div className="text-center mb-5 sm:mb-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 text-[10px] sm:text-xs font-medium text-violet-400 tracking-wider uppercase">
              <Handshake className="w-3 h-3" /> Testimonianze Partner
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {[
              {
                name: "Luca Marini",
                role: "Partner Empire · Team Leader — Roma",
                quote: "In 4 mesi ho chiuso 14 contratti e costruito un team di 3 persone. Guadagno tra commissioni, bonus e override circa €8.000/mese. Non avrei mai pensato fosse possibile senza investimento iniziale.",
                stars: 5,
                metric: "14 contratti in 4 mesi",
                highlight: "~€8.000/mese",
                gradient: "from-violet-500/10 to-fuchsia-500/10",
              },
              {
                name: "Sara Colombo",
                role: "Partner Empire — Milano",
                quote: "La sandbox demo si vende da sola. Mostro l'app al ristoratore, gli faccio vedere i suoi piatti col menu AI e firma in 20 minuti. Il payout arriva istantaneamente su Stripe.",
                stars: 5,
                metric: "Chiusura media: 20 min",
                highlight: "€997/vendita",
                gradient: "from-primary/10 to-amber-500/10",
              },
            ].map((t, i) => (
              <motion.div key={i}
                className="relative p-5 sm:p-7 rounded-2xl glass border border-border/30 hover:border-violet-500/30 transition-all duration-500 group"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${t.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <Quote className="w-6 h-6 text-violet-400/30" />
                    <span className="text-xs sm:text-sm font-display font-bold text-primary">{t.highlight}</span>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-4 italic">"{t.quote}"</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 text-[9px] sm:text-[10px] text-violet-400 font-bold mb-4">
                    <Trophy className="w-3 h-3" /> {t.metric}
                  </div>
                  <div className="border-t border-border/30 pt-3">
                    <p className="text-xs sm:text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust bar */}
          <motion.div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {[
              { value: "150+", label: "Ristoranti attivi" },
              { value: "4.9★", label: "Rating medio" },
              { value: "€2.1M", label: "Risparmi generati" },
              { value: "45+", label: "Partner attivi" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-lg sm:text-2xl font-display font-bold text-primary">{stat.value}</p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====== 9. CTA FINALE ====== */}
      <section className="relative py-12 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center relative">
          <GlowOrb className="w-[400px] h-[300px] bg-primary top-0 left-1/2 -translate-x-1/2" />
          <motion.div className="relative" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Crown className="w-10 sm:w-14 h-10 sm:h-14 mx-auto text-primary mb-4 drop-shadow-[0_0_40px_hsla(38,75%,55%,0.4)]" />
            <h2 className="text-2xl sm:text-5xl font-display font-bold text-foreground leading-tight">
              Ogni giorno senza Empire,<br />
              <span className="text-gold-gradient">regali margini</span>
            </h2>
            <p className="mt-2 sm:mt-4 text-xs sm:text-base text-muted-foreground max-w-md mx-auto">
              I tuoi competitor stanno costruendo il loro impero digitale. Tu stai ancora alimentando i marketplace.
            </p>
            <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button onClick={() => navigate("/admin")}
                className="w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm sm:text-lg tracking-wide relative overflow-hidden min-h-[48px]"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Sono un Ristoratore <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                </span>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-primary via-amber-400 to-primary bg-[length:200%_100%]"
                  animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
              </motion.button>
              <button onClick={() => navigate("/partner/register")}
                className="w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-5 rounded-2xl glass border border-primary/30 text-foreground font-bold text-sm sm:text-lg tracking-wide hover:border-primary transition-all min-h-[48px]">
                Diventa Partner
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer id="contact" className="border-t border-border/30 py-8 sm:py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6 sm:mb-10">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-primary" />
                </div>
                <span className="font-display font-bold text-foreground tracking-[0.1em] uppercase text-sm">Empire</span>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                L'unico Asset Digitale di Proprietà che libera i ristoratori dalle commissioni predatorie.
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Contatti</p>
              <div className="space-y-1.5 text-[10px] sm:text-xs text-muted-foreground">
                <p>📧 info@empire-suite.it</p>
                <p>📞 +39 06 1234 5678</p>
                <p>📍 Roma, Italia</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Risorse</p>
              <div className="space-y-1.5 text-[10px] sm:text-xs text-muted-foreground">
                <a href="#features" className="block hover:text-primary transition-colors">Arsenale Funzionalità</a>
                <a href="#calculator" className="block hover:text-primary transition-colors">Calcolatore ROI</a>
                <a href="#pricing" className="block hover:text-primary transition-colors">Investimento</a>
              </div>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Legale</p>
              <div className="space-y-1.5 text-[10px] sm:text-xs text-muted-foreground">
                <a href="/privacy" className="block hover:text-primary transition-colors">Privacy Policy</a>
                <a href="/cookie-policy" className="block hover:text-primary transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border/30 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-muted-foreground">
            <p>© 2026 Empire Restaurant Suite. Tutti i diritti riservati.</p>
            <p>P.IVA IT12345678901</p>
          </div>
        </div>
      </footer>

      {/* ====== STICKY CTA MOBILE ====== */}
      <motion.div className="fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] glass-strong border-t border-border/20 md:hidden"
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 2, type: "spring", damping: 25 }}>
        <div className="flex gap-2">
          <motion.button onClick={scrollToPricing}
            className="flex-1 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm tracking-wider min-h-[48px] relative overflow-hidden"
            whileTap={{ scale: 0.97 }}>
            <span className="relative z-10">€2.997 · Inizia Ora</span>
            <motion.div className="absolute inset-0 bg-gradient-to-r from-primary via-amber-400 to-primary bg-[length:200%_100%]"
              animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
          </motion.button>
          <button onClick={() => navigate("/r/impero-roma")}
            className="px-4 py-3.5 rounded-2xl glass border border-primary/30 text-primary font-bold text-sm min-h-[48px]">
            <Play className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
