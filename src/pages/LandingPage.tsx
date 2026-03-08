import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import {
  Crown, Check, Calculator, Star, Zap, Shield, Smartphone,
  TrendingUp, X, Sparkles, Lock, Menu, Target, DollarSign, Brain,
  ChefHat, AlertTriangle, Banknote, ArrowDown, ArrowRight,
  MessageCircle, HelpCircle, ChevronDown, Play, Gem, Users, Rocket,
  CreditCard, Gift, Trophy, Award, Handshake, Quote, Globe,
  BarChart3, QrCode, Bell, Wallet, MapPin, Eye, Bot, Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LivePreview from "@/components/restaurant/LivePreview";
import mockupCliente from "@/assets/mockup-cliente.jpg";
import mockupAdmin from "@/assets/mockup-admin.jpg";
import mockupCucina from "@/assets/mockup-cucina.jpg";

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

const AnimatedNumber = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const dur = 1500;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setDisplay(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);
  return <span ref={ref}>{prefix}{display.toLocaleString("it-IT")}{suffix}</span>;
};

/* Animated blob */
const Blob = ({ className = "", color = "bg-primary" }: { className?: string; color?: string }) => (
  <div className={`absolute rounded-full blur-[140px] opacity-[0.18] pointer-events-none ${color} ${className}`} />
);

/* Section wrapper */
const Section = ({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`relative py-16 sm:py-32 px-5 sm:px-6 overflow-hidden ${className}`}>
    <div className="max-w-6xl mx-auto relative z-10">{children}</div>
  </section>
);

/* Section label */
const SectionLabel = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <motion.div
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
  >
    {icon}
    <span className="text-xs font-semibold text-accent tracking-[3px] uppercase font-heading">{text}</span>
  </motion.div>
);

/* Hero with Parallax */
const HeroParallax = ({ navigate, scrollTo }: { navigate: (path: string) => void; scrollTo: (id: string) => void }) => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="hero" ref={heroRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden px-5 sm:px-6">
      {/* Parallax background layers */}
      <motion.div className="absolute inset-0 overflow-hidden" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[900px] h-[400px] sm:h-[600px] bg-primary/15 rounded-full blur-[180px]" />
        <div className="absolute inset-0 pointer-events-none hidden sm:block">
          <div className="absolute w-[300px] h-[300px] rounded-full border border-foreground/[0.04] top-[10%] right-[5%] animate-blob-float" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-accent/[0.08] bottom-[20%] right-[15%] animate-blob-float-reverse" />
        </div>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16 pt-24 sm:pt-32 pb-16 sm:pb-12">
        {/* Left */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 mb-5 sm:mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="text-[10px] sm:text-xs font-medium text-primary/80 tracking-wider uppercase font-heading">AI-Powered Restaurant Suite</span>
          </motion.div>

          <motion.h1
            className="text-[2rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15 }}>
            Trasforma il Tuo Ristorante con l'
            <span className="text-vibrant-gradient">Intelligenza Artificiale</span>
          </motion.h1>

          <motion.p className="mt-4 sm:mt-7 text-sm sm:text-lg text-foreground/60 max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            PWA di proprietà, menu AI, kitchen view, review shield e molto altro.
            Tutto ciò di cui hai bisogno per <strong className="text-foreground">dominare il digitale</strong> e liberarti dal 30% di commissioni.
          </motion.p>

          <motion.div className="mt-6 sm:mt-9 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <button onClick={() => scrollTo("pricing")}
              className="group relative w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm tracking-widest uppercase font-heading overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.4)]">
              Prenota una Demo <ArrowRight className="inline w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate("/r/impero-roma")}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full glass text-foreground text-sm font-bold tracking-widest uppercase font-heading hover:border-primary/40 transition-all flex items-center justify-center gap-2">
              <Play className="w-4 h-4 text-accent" /> Scopri i Servizi
            </button>
          </motion.div>

          {/* Mobile Live Preview — fully visible iPhone frame */}
          <motion.div className="mt-8 relative lg:hidden w-full flex justify-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <div className="absolute -inset-8 bg-primary/10 rounded-[40px] blur-[60px] pointer-events-none" />
            <div className="relative" style={{ width: 234, height: 468 }}>
              <div className="absolute inset-0 origin-top-left" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
                <LivePreview slug="impero-roma" primaryColor="#7C3AED" compact />
              </div>
            </div>
          </motion.div>

          {/* Hero stats */}
          <motion.div className="mt-8 sm:mt-14 grid grid-cols-3 gap-4 sm:gap-12 pt-6 sm:pt-8 border-t border-border/30 w-full"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            {[
              { value: "200+", label: "Ristoranti Serviti" },
              { value: "98%", label: "Soddisfazione Clienti" },
              { value: "+45%", label: "Aumento Ordini" },
            ].map((s, i) => (
              <div key={i} className="text-center lg:text-left">
                <p className="text-lg sm:text-3xl font-heading font-bold text-vibrant-gradient">{s.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Live Preview — desktop only */}
        <motion.div className="flex-shrink-0 relative hidden lg:block"
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 1 }}>
          <div className="absolute -inset-10 bg-primary/15 rounded-[60px] blur-[80px]" />
          <div className="relative w-[280px] sm:w-[300px]">
            <LivePreview slug="impero-roma" primaryColor="#7C3AED" compact />
          </div>
        </motion.div>
      </div>
      <motion.div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10"
        style={{ opacity: opacityFade }}
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
        <span className="text-[9px] text-foreground/30 tracking-widest uppercase font-heading">Scopri</span>
        <ArrowDown className="w-4 h-4 text-primary/40" />
      </motion.div>
    </section>
  );
};

/* Stagger container */
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

const LandingPage = () => {
  const navigate = useNavigate();
  const [monthlyOrders, setMonthlyOrders] = useState(500);
  const [avgOrder, setAvgOrder] = useState(25);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const ids = ["contact", "testimonials", "partner", "pricing", "calculator", "features", "how", "pain", "hero"];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) {
          if (["hero", "pain"].includes(id)) setActiveSection("home");
          else if (["calculator", "testimonials", "how"].includes(id)) setActiveSection("features");
          else setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ROI
  const setupCost = 2997;
  const monthlyRevenue = monthlyOrders * avgOrder;
  const justEatCost = monthlyRevenue * 0.30;
  const empireCost = monthlyRevenue * 0.02;
  const monthlySaving = justEatCost - empireCost;
  const roiMonths = monthlySaving > 0 ? Math.ceil(setupCost / monthlySaving) : 0;
  const yearSaving = monthlySaving * 12;

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const navLinks = [
    { id: "home", href: "#hero", label: "Home" },
    { id: "features", href: "#features", label: "Servizi" },
    { id: "pricing", href: "#pricing", label: "Prezzi" },
    { id: "partner", href: "#partner", label: "Partner" },
    { id: "contact", href: "#contact", label: "Contatti" },
  ];

  /* ═══════════════════════════════════════════
     DATA
     ═══════════════════════════════════════════ */

  const services = [
    { icon: <Brain className="w-7 h-7" />, title: "AI Menu Creator", desc: "Carica una foto del menu cartaceo. L'IA estrae testi, prezzi e genera foto food-porn professionali in 60 secondi. Elimina €2.000+ di costi fotografi.", tag: "IA" },
    { icon: <Smartphone className="w-7 h-7" />, title: "PWA White Label", desc: "App installabile come nativa con il TUO brand. Logo, colori, dominio personalizzato. I clienti la scaricano dal browser — zero commissioni marketplace.", tag: "APP" },
    { icon: <ChefHat className="w-7 h-7" />, title: "Kitchen View Real-Time", desc: "Dashboard cucina con ordini in tempo reale, notifiche sonore, stati ordine e stampa ticket. Zero errori, zero perdite.", tag: "STAFF" },
    { icon: <Shield className="w-7 h-7" />, title: "Review Shield™", desc: "Filtro intelligente: recensioni 1-3★ vanno nel tuo archivio privato. Solo le 4-5★ costruiscono la tua reputazione su Google.", tag: "BRAND" },
    { icon: <Lock className="w-7 h-7" />, title: "Vault Fiscale AES-256", desc: "Le tue chiavi API fiscali criptate con standard bancario. L'agente AI-Mary guida il setup completo. Nessuno può accedere ai tuoi dati.", tag: "FISCO" },
    { icon: <AlertTriangle className="w-7 h-7" />, title: "Panic Mode", desc: "Uno slider per modificare TUTTI i prezzi in percentuale. Sincronizzazione real-time su ogni dispositivo. Margini protetti in 2 secondi.", tag: "MARGINI" },
    { icon: <MapPin className="w-7 h-7" />, title: "Mappa Tavoli Interattiva", desc: "Gestisci la sala con drag-and-drop. Tavoli liberi, occupati, prenotati — tutto visuale, tutto in tempo reale.", tag: "SALA" },
    { icon: <MessageCircle className="w-7 h-7" />, title: "Chat Privata & Push", desc: "Comunicazione diretta con i clienti. Notifiche push per promozioni, sconti e aggiornamenti ordine.", tag: "MARKETING" },
    { icon: <Wallet className="w-7 h-7" />, title: "Wallet Pass & Loyalty", desc: "Pass sconto digitali nel wallet del cliente. Programma fedeltà automatizzato che aumenta il ritorno.", tag: "FIDELITY" },
  ];

  const howItWorks = [
    { step: "01", title: "Discovery & Setup", desc: "Analizziamo il tuo ristorante, creiamo il tuo profilo digitale e configuriamo la suite in 24 ore.", icon: <Eye className="w-6 h-6" /> },
    { step: "02", title: "AI Menu & Branding", desc: "L'IA crea il menu digitale e personalizza la tua app con logo, colori e identità del tuo brand.", icon: <Sparkles className="w-6 h-6" /> },
    { step: "03", title: "Lancio & Formazione", desc: "Attiviamo la PWA, formiamo il tuo staff sulla Kitchen View e installiamo i QR Code sui tavoli.", icon: <Rocket className="w-6 h-6" /> },
    { step: "04", title: "Crescita & Supporto", desc: "Monitoriamo le performance, ottimizziamo i margini e ti supportiamo con aggiornamenti continui.", icon: <TrendingUp className="w-6 h-6" /> },
  ];

  const testimonials = [
    { name: "Marco Pellegrini", role: "Trattoria da Marco, Roma", quote: "In 3 mesi ho spostato il 60% degli ordini da JustEat alla mia app. Risparmio €3.200/mese netti.", metric: "−€3.200/mese", stars: 5 },
    { name: "Giulia Ferretti", role: "Osteria Ferretti, Milano", quote: "Kitchen View ha eliminato gli errori in cucina. Prima perdevamo 4-5 ordini a settimana. Ora zero.", metric: "Zero errori cucina", stars: 5 },
    { name: "Antonio Russo", role: "Pizzeria Napoli Verace", quote: "Review Shield è geniale. Su Google ho solo 4.8★. I clienti nuovi arrivano grazie al rating perfetto.", metric: "4.8★ su Google", stars: 5 },
  ];

  const faqs = [
    { q: "È difficile da usare?", a: "No. Se sai usare Instagram, sai usare Empire. L'interfaccia è progettata per ristoratori, non per programmatori. L'IA fa il lavoro pesante: carica una foto del menu e in 60 secondi hai il catalogo digitale completo." },
    { q: "Come arrivano i soldi?", a: "I pagamenti dei clienti arrivano direttamente sul TUO conto Stripe. Non tocchiamo mai i tuoi soldi. L'unica trattenuta è il 2% automatico — 15 volte meno di JustEat." },
    { q: "Quanto costa davvero?", a: "€2.997 una tantum (o 3 rate da €1.099). Dopodiché €0/mese per sempre. Solo il 2% sulle transazioni per infrastruttura, IA e aggiornamenti." },
    { q: "La fiscalità è sicura?", a: "Le tue chiavi API fiscali sono criptate AES-256 nel Vault privato. Nessuno può vederle, nemmeno il nostro team." },
    { q: "Cosa succede ai miei clienti di JustEat?", a: "Li recuperi. Con il QR Code sui tavoli e il link diretto, i clienti ordinano dalla TUA app. Ogni ordine risparmiato = 28% netto recuperato." },
    { q: "Come funziona il Partner Program?", a: "Diventi Partner gratis. €997 per vendita + bonus mensili fino a €1.500. Pagamenti istantanei via Stripe Connect. Dalla 4ª vendita del tuo team ricevi €50 di override." },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">

      {/* ═══════ GLOBAL BLOBS ═══════ */}
      <Blob className="w-[600px] h-[600px] top-0 -left-60 animate-blob-float" color="bg-violet-600" />
      <Blob className="w-[500px] h-[500px] top-[80vh] -right-40 animate-blob-float-reverse" color="bg-orange-500" />
      <Blob className="w-[400px] h-[400px] top-[200vh] left-1/2 animate-blob-float-slow" color="bg-pink-500" />
      <Blob className="w-[500px] h-[500px] top-[350vh] -left-40 animate-blob-float" color="bg-violet-600" />
      <Blob className="w-[400px] h-[400px] top-[500vh] right-0 animate-blob-float-reverse" color="bg-orange-500" />

      {/* ═══════════════════════════════════════════
          NAVIGATION
         ═══════════════════════════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-3 sm:mx-4 mt-3 rounded-2xl glass-strong">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <a href="#hero" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-vibrant-gradient flex items-center justify-center">
                <Crown className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-sm tracking-[0.15em] uppercase text-foreground">Empire</span>
            </a>

            <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-secondary/60">
              {navLinks.map(link => (
                <a key={link.id} href={link.href}
                  className={`relative px-4 py-2 text-xs font-medium tracking-[0.12em] uppercase rounded-lg transition-all duration-300 font-heading
                    ${activeSection === link.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {activeSection === link.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 bg-vibrant-gradient rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/r/impero-roma")}
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-foreground text-xs font-semibold tracking-widest uppercase font-heading hover:bg-primary/10 hover:border-primary/30 transition-all">
                <Play className="w-3.5 h-3.5 text-accent" /> Demo Live
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
              className="lg:hidden mx-3 mt-1 rounded-2xl glass-strong overflow-hidden">
              <div className="flex flex-col items-center gap-1 py-4">
                {navLinks.map(link => (
                  <a key={link.id} href={link.href} onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-center py-3 text-sm font-medium tracking-[0.15em] uppercase font-heading transition-colors
                      ${activeSection === link.id ? "text-primary" : "text-muted-foreground"}`}>
                    {link.label}
                  </a>
                ))}
                <button onClick={() => { navigate("/r/impero-roma"); setMobileMenuOpen(false); }}
                  className="mt-2 mx-5 w-[calc(100%-2.5rem)] py-3.5 rounded-xl bg-vibrant-gradient text-primary-foreground text-sm font-bold tracking-widest uppercase font-heading">
                  Demo Live
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════════════════════════════════
          1. HERO — with Parallax
         ═══════════════════════════════════════════ */}
      <HeroParallax navigate={navigate} scrollTo={scrollTo} />

      {/* ═══════════════════════════════════════════
          2. PROBLEMA
         ═══════════════════════════════════════════ */}
      <Section id="pain">
        <Blob className="w-[400px] h-[400px] -top-40 right-0 animate-blob-float-reverse" color="bg-orange-500" />
        <div className="text-center mb-12 sm:mb-16">
          <SectionLabel icon={<AlertTriangle className="w-3.5 h-3.5 text-accent" />} text="Il Problema" />
          <motion.h2 className="text-2xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Ogni mese, <span className="text-vibrant-gradient">regali migliaia</span> di euro
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {[
            { icon: <Banknote className="w-8 h-8" />, amount: "€7.500", label: "Margini erosi / mese", sub: "Su 1000 ordini a €25 con marketplace" },
            { icon: <DollarSign className="w-8 h-8" />, amount: "€90.000", label: "Dispersi ogni anno", sub: "Capitale che alimenta i tuoi competitor" },
            { icon: <Target className="w-8 h-8" />, amount: "€0", label: "Proprietà clienti", sub: "Il marketplace possiede i TUOI dati" },
          ].map((item, i) => (
            <motion.div key={i}
              className="group relative p-6 sm:p-8 rounded-3xl glass border border-border/30 hover:border-accent/30 transition-all duration-500 text-center"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mx-auto mb-4">{item.icon}</div>
                <p className="text-4xl sm:text-5xl font-heading font-bold text-accent">{item.amount}</p>
                <p className="text-sm font-semibold text-foreground mt-2">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p className="text-center mt-12 text-base sm:text-lg text-muted-foreground"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          E se potessi trattenere <strong className="text-primary">il 98%</strong> dei tuoi margini?
        </motion.p>
        <ArrowDown className="w-5 h-5 text-primary mx-auto mt-4 animate-bounce" />
      </Section>

      {/* ═══════════════════════════════════════════
          3. SERVIZI — L'ARSENALE COMPLETO
         ═══════════════════════════════════════════ */}
      <Section id="features">
        <Blob className="w-[500px] h-[500px] -top-20 left-1/4 animate-blob-float" color="bg-pink-500" />
        <div className="text-center mb-12 sm:mb-16">
          <SectionLabel icon={<Zap className="w-3.5 h-3.5 text-accent" />} text="I Nostri Servizi" />
          <motion.h2 className="text-2xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Tutto Ciò di Cui il Tuo <br className="hidden sm:block" />
            <span className="text-vibrant-gradient">Ristorante Ha Bisogno</span>
          </motion.h2>
          <motion.p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Soluzioni end-to-end per portare il tuo ristorante nell'era digitale con stile e intelligenza.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ staggerChildren: 0.08 }}
        >
          {services.map((s, i) => (
            <motion.div key={i}
              className="group relative p-6 sm:p-7 rounded-3xl glass border border-border/30 hover:border-primary/25 hover:bg-foreground/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_hsla(263,70%,58%,0.12)] transition-all duration-500"
              variants={fadeUp}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/15 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                {s.icon}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground">{s.title}</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold tracking-wider font-heading">{s.tag}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-accent font-heading group-hover:gap-2 transition-all">
                Scopri di più <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          4. COME FUNZIONA
         ═══════════════════════════════════════════ */}
      <Section id="how">
        <div className="text-center mb-12 sm:mb-16">
          <SectionLabel icon={<Sparkles className="w-3.5 h-3.5 text-accent" />} text="Come Funziona" />
          <motion.h2 className="text-2xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Dal Concept al <span className="text-vibrant-gradient">Lancio in 4 Step</span>
          </motion.h2>
          <motion.p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Un processo collaudato per trasformare la tua visione in realtà digitale.
          </motion.p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+36px)] right-[calc(12.5%+36px)] h-0.5 bg-gradient-to-r from-primary/30 via-pink-500/30 to-accent/30 z-0" />

          {howItWorks.map((s, i) => (
            <motion.div key={i} className="relative text-center z-10"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
              <div className="relative w-[72px] h-[72px] rounded-full bg-vibrant-gradient flex items-center justify-center mx-auto mb-5">
                <span className="font-heading font-bold text-lg text-primary-foreground">{s.step}</span>
                <div className="absolute -inset-1 rounded-full border-2 border-primary/25" />
              </div>
              <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px] mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          5. APP SHOWCASE — 3 Phone Mockups
         ═══════════════════════════════════════════ */}
      <Section>
        <Blob className="w-[500px] h-[500px] bottom-0 right-0 animate-blob-float" color="bg-violet-600" />
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-center">
          <motion.div className="flex-1" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionLabel icon={<Smartphone className="w-3.5 h-3.5 text-accent" />} text="App Personalizzate" />
            <h2 className="text-2xl sm:text-5xl font-heading font-bold text-foreground leading-tight">
              La Tua App, <br /><span className="text-vibrant-gradient">Il Tuo Brand</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              Cliente, Admin e Cucina — tutto in un ecosistema unico, white-label, di tua proprietà.
            </p>
            <div className="mt-5 space-y-3">
              {[
                { title: "Ordini Online", desc: "Menu interattivo con pagamento integrato" },
                { title: "Programma Fedeltà", desc: "Wallet pass, reward e offerte AI" },
                { title: "Push & Chat", desc: "Comunicazione diretta con i clienti" },
                { title: "Kitchen View", desc: "Ordini real-time in cucina, zero errori" },
              ].map((f, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 min-w-[24px] rounded-full bg-gradient-to-br from-primary/25 to-accent/15 flex items-center justify-center text-accent text-[10px] font-bold">✓</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/r/impero-roma")}
              className="mt-6 px-8 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm tracking-widest uppercase font-heading hover:-translate-y-0.5 hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.4)] transition-all">
              Richiedi una Demo <ArrowRight className="inline w-4 h-4 ml-2" />
            </button>
          </motion.div>

          {/* 3 Phone Mockups */}
          <motion.div className="flex-shrink-0 w-full lg:w-auto"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="flex justify-center items-end gap-3 sm:gap-5 relative">
              <div className="absolute -inset-10 bg-violet-600/10 rounded-[60px] blur-[80px] pointer-events-none" />
              
              {[
                { label: "👤 Cliente", img: mockupCliente, title: "Vista Cliente" },
                { label: "⚙️ Admin", img: mockupAdmin, title: "Pannello Admin" },
                { label: "🍳 Cucina", img: mockupCucina, title: "Kitchen View" },
              ].map((phone, i) => (
                <div key={i} className="relative flex flex-col items-center flex-1 max-w-[160px] lg:max-w-[150px]">
                  <span className="text-[9px] sm:text-[10px] font-heading font-bold text-accent tracking-widest uppercase mb-2">{phone.label}</span>
                  <div className="relative w-full aspect-[9/19] bg-card rounded-[18px] sm:rounded-[28px] border-2 border-foreground/10 overflow-hidden shadow-[0_20px_50px_hsla(0,0%,0%,0.4),0_0_40px_hsla(263,70%,58%,0.12)]">
                    <div className="w-[40%] h-3 sm:h-4 bg-background rounded-b-[10px] sm:rounded-b-[14px] mx-auto relative z-20" />
                    <img
                      src={phone.img}
                      alt={phone.title}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          6. STATS
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="text-center mb-12">
          <SectionLabel icon={<BarChart3 className="w-3.5 h-3.5 text-accent" />} text="I Numeri" />
          <motion.h2 className="text-2xl sm:text-5xl font-heading font-bold text-foreground"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Il tuo <span className="text-vibrant-gradient">vantaggio competitivo</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { value: 2, suffix: "%", label: "Fee totale", icon: <TrendingUp className="w-5 h-5" /> },
            { value: 0, prefix: "€", label: "Canone mensile", icon: <Banknote className="w-5 h-5" /> },
            { value: 60, suffix: "s", label: "Menu IA pronto", icon: <Zap className="w-5 h-5" /> },
            { value: 98, suffix: "%", label: "Margini salvati", icon: <Shield className="w-5 h-5" /> },
          ].map((s, i) => (
            <motion.div key={i} className="relative p-5 sm:p-7 rounded-2xl sm:rounded-3xl glass border border-border/30 text-center overflow-hidden"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">{s.icon}</div>
              <p className="text-3xl sm:text-4xl font-heading font-bold text-primary">
                <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium font-heading">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          7. ROI CALCULATOR
         ═══════════════════════════════════════════ */}
      <Section id="calculator">
        <div className="text-center mb-12">
          <SectionLabel icon={<Calculator className="w-3.5 h-3.5 text-accent" />} text="ROI Calculator" />
          <motion.h2 className="text-2xl sm:text-5xl font-heading font-bold text-foreground"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Il tuo <span className="text-vibrant-gradient">risparmio reale</span>
          </motion.h2>
        </div>

        <motion.div className="max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl glass border border-border/30 space-y-6"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {[
            { label: "Ordini al mese", value: monthlyOrders, min: 100, max: 3000, step: 50, display: monthlyOrders.toString(), onChange: setMonthlyOrders },
            { label: "Scontrino medio", value: avgOrder, min: 10, max: 80, step: 5, display: `€${avgOrder}`, onChange: setAvgOrder },
          ].map((sl, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground font-heading">{sl.label}</span>
                <span className="text-foreground font-bold text-lg font-heading">{sl.display}</span>
              </div>
              <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.value}
                onChange={e => sl.onChange(Number(e.target.value))} className="w-full accent-primary h-2 rounded-full" />
            </div>
          ))}

          <div className="space-y-3 pt-4 border-t border-border/30">
            {[
              { label: "💸 Marketplace (30%)", value: justEatCost, color: "accent", width: 100 },
              { label: "👑 Empire (2%)", value: empireCost, color: "primary", width: Math.max(5, (empireCost / justEatCost) * 100) },
            ].map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">{bar.label}</span>
                  <span className={`text-${bar.color} font-heading font-bold`}>-€{bar.value.toLocaleString("it-IT", { maximumFractionDigits: 0 })}/mese</span>
                </div>
                <div className={`h-10 rounded-xl bg-${bar.color}/10 overflow-hidden`}>
                  <motion.div className={`h-full bg-gradient-to-r from-${bar.color}/30 to-${bar.color}/50 rounded-xl flex items-center justify-end pr-3`}
                    initial={{ width: 0 }} whileInView={{ width: `${bar.width}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 + i * 0.2 }}>
                    <span className="text-xs font-bold text-foreground">-{i === 0 ? "30" : "2"}%</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-foreground font-medium text-sm">Risparmi al mese</span>
              <span className="text-2xl sm:text-3xl font-heading font-bold text-primary">€{monthlySaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground font-medium text-sm">Risparmi all'anno</span>
              <span className="text-2xl sm:text-3xl font-heading font-bold text-vibrant-gradient">€{yearSaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-primary/20">
              <span className="text-muted-foreground text-sm">ROI completo in</span>
              <span className="text-foreground font-heading font-bold text-lg">{roiMonths} {roiMonths === 1 ? "mese" : "mesi"}</span>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          8. PRICING
         ═══════════════════════════════════════════ */}
      <Section id="pricing">
        <div className="text-center mb-12 sm:mb-16">
          <SectionLabel icon={<CreditCard className="w-3.5 h-3.5 text-accent" />} text="Prezzi" />
          <motion.h2 className="text-2xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Un Investimento, <span className="text-vibrant-gradient">Zero Canoni</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Full */}
          <motion.div className="relative p-6 sm:p-8 rounded-3xl glass border border-primary/30 overflow-hidden"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-vibrant-gradient" />
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-accent tracking-wider uppercase font-heading">Pagamento Unico</span>
                <span className="px-2.5 py-1 rounded-full bg-vibrant-gradient text-[10px] font-bold text-primary-foreground tracking-wider font-heading">PIÙ POPOLARE</span>
              </div>
              <p className="text-4xl sm:text-5xl font-heading font-bold text-foreground">€2.997</p>
              <p className="text-xs text-muted-foreground mt-1">IVA 22% inclusa · Una volta sola</p>
              <div className="mt-6 space-y-2">
                {[
                  "Asset Digitale di Proprietà", "AI Menu Creator + OCR", "Kitchen View real-time",
                  "Vault Fiscale AES-256", "Panic Mode + Review Shield", "PWA White Label",
                  "Chat Privata + Notifiche Push", "Mappa Tavoli Interattiva", "Assistenza a vita", "Zero canoni mensili",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-foreground/80">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/admin")}
                className="mt-7 w-full py-4 rounded-2xl bg-vibrant-gradient text-primary-foreground font-bold text-sm tracking-wide font-heading transition-transform hover:scale-[1.02] active:scale-[0.97]">
                Inizia il tuo Impero
              </button>
              <p className="mt-3 text-[10px] text-center text-muted-foreground">Dopo: €0/mese · Solo 2% sulle transazioni</p>
            </div>
          </motion.div>

          {/* 3 Rate */}
          <motion.div className="relative p-6 sm:p-8 rounded-3xl glass border border-border/30 hover:border-primary/30 transition-all duration-500"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase font-heading mb-3 block">3 Rate</span>
            <p className="text-3xl sm:text-4xl font-heading font-bold text-foreground">€1.099<span className="text-base text-muted-foreground font-normal">/mese</span></p>
            <p className="text-xs text-muted-foreground mt-1">Totale: €3.297 · IVA inclusa</p>
            <div className="mt-6 space-y-2.5">
              {["Tutte le funzionalità", "Massima flessibilità", "Attivazione immediata", "Chiusura rapida"].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-foreground/70">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/admin")}
              className="mt-7 w-full py-4 rounded-2xl border-2 border-primary/30 text-primary font-bold text-sm tracking-wide font-heading hover:bg-primary hover:text-primary-foreground transition-all">
              Scegli 3 Rate
            </button>
          </motion.div>
        </div>

        <motion.div className="text-center mt-8 p-5 rounded-2xl glass border border-border/20 max-w-2xl mx-auto"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">Dopo l'attivazione:</span> €0/mese · Solo <span className="text-primary font-bold">2%</span> sulle transazioni per infrastruttura, IA e aggiornamenti
          </p>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          9. PARTNER PROGRAM
         ═══════════════════════════════════════════ */}
      <Section id="partner">
        <Blob className="w-[500px] h-[500px] top-0 -right-40 animate-blob-float-reverse" color="bg-orange-500" />
        <div className="text-center mb-12 sm:mb-16">
          <SectionLabel icon={<Users className="w-3.5 h-3.5 text-accent" />} text="Partner Program" />
          <motion.h2 className="text-2xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Costruisci il tuo <span className="text-vibrant-gradient">Impero</span>
          </motion.h2>
          <motion.p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Diventa Partner e guadagna €997 per ogni vendita. Zero rischi, strumenti elite, pagamenti istantanei.
          </motion.p>
        </div>

        {/* Earnings */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-10">
          {[
            { value: "€997", label: "Per vendita", icon: <Trophy className="w-5 h-5" />, sub: "Commissione Partner" },
            { value: "€50", label: "Override TL", icon: <Award className="w-5 h-5" />, sub: "Dalla 4ª vendita" },
            { value: "€500", label: "Bonus 3 vendite", icon: <Gift className="w-5 h-5" />, sub: "Bonus mensile" },
            { value: "€1.500", label: "Bonus 5 vendite", icon: <Rocket className="w-5 h-5" />, sub: "Bonus Elite" },
          ].map((s, i) => (
            <motion.div key={i} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass border border-border/30 text-center"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">{s.icon}</div>
              <p className="text-xl sm:text-2xl font-heading font-bold text-primary">{s.value}</p>
              <p className="text-xs font-semibold text-foreground mt-1">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Career path */}
        <motion.div className="p-5 sm:p-7 rounded-3xl glass border border-primary/20 mb-10"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="font-heading font-bold text-base sm:text-lg text-foreground text-center mb-5">Percorso di Carriera</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            {[
              { title: "Partner", desc: "€997/vendita", icon: <Handshake className="w-5 h-5" /> },
              { title: "3 Vendite", desc: "Promozione automatica", icon: <TrendingUp className="w-5 h-5" /> },
              { title: "Team Leader", desc: "+€50 override", icon: <Crown className="w-5 h-5" /> },
            ].map((s, i) => (
              <div key={i} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center w-full sm:w-auto">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{s.icon}</div>
                <div className="text-left sm:text-center">
                  <p className="text-sm font-bold text-foreground font-heading">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                {i < 2 && <ArrowRight className="hidden sm:block w-5 h-5 text-primary/30 mx-6 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scenario */}
        <motion.div className="p-5 sm:p-7 rounded-3xl glass border border-primary/20 max-w-xl mx-auto mb-10"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="font-heading font-bold text-sm sm:text-base text-foreground text-center mb-4">📊 Scenario: 5 vendite al mese</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">5× Commissioni Partner</span><span className="font-bold text-foreground">€4.985</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Bonus Elite mensile</span><span className="font-bold text-foreground">€1.500</span></div>
            <div className="flex justify-between pt-3 border-t border-primary/20">
              <span className="font-semibold text-foreground">Totale mensile</span>
              <span className="text-xl font-heading font-bold text-vibrant-gradient">€6.485</span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div className="text-center" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Gift className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-foreground mb-2">Zero Costi di Ingresso</h3>
          <p className="text-sm text-muted-foreground mb-5">Nessun investimento iniziale. Paghiamo solo il tuo talento.</p>
          <button onClick={() => navigate("/partner/register")}
            className="px-8 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm tracking-widest uppercase font-heading hover:-translate-y-0.5 hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.4)] transition-all">
            Diventa Partner
          </button>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          10. TESTIMONIALS
         ═══════════════════════════════════════════ */}
      <Section id="testimonials">
        <Blob className="w-[500px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blob-float-slow" color="bg-pink-500" />
        <div className="text-center mb-12 sm:mb-16">
          <SectionLabel icon={<Star className="w-3.5 h-3.5 text-accent" />} text="Testimoniali" />
          <motion.h2 className="text-2xl sm:text-5xl font-heading font-bold text-foreground"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Chi lo <span className="text-vibrant-gradient">Usa, Cresce</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={i} className="group relative p-6 sm:p-7 rounded-3xl glass border border-border/30 hover:border-primary/25 transition-all duration-500"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Quote className="w-7 h-7 text-primary/25 mb-4" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.stars }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-accent fill-accent" />)}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-5 italic">"{t.quote}"</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-[10px] text-primary font-bold mb-4 font-heading">
                <TrendingUp className="w-3 h-3" /> {t.metric}
              </div>
              <div className="border-t border-border/30 pt-3">
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust bar */}
        <motion.div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          {[
            { value: "150+", label: "Ristoranti attivi" },
            { value: "4.9★", label: "Rating medio" },
            { value: "€2.1M", label: "Risparmi generati" },
            { value: "45+", label: "Partner attivi" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-xl sm:text-2xl font-heading font-bold text-vibrant-gradient">{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-heading">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          11. FAQ
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel icon={<HelpCircle className="w-3.5 h-3.5 text-accent" />} text="FAQ" />
            <motion.h2 className="text-2xl sm:text-4xl font-heading font-bold text-foreground"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              Domande? <span className="text-vibrant-gradient">Risposte.</span>
            </motion.h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} className="rounded-2xl glass border border-border/30 overflow-hidden"
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-foreground/[0.02] transition-colors">
                  <span className="text-sm sm:text-base font-semibold text-foreground pr-4 font-heading">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}
                    className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <ChevronDown className="w-4 h-4 text-primary" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          12. CTA FINALE
         ═══════════════════════════════════════════ */}
      <Section>
        <Blob className="w-[500px] h-[400px] top-0 left-1/2 -translate-x-1/2" color="bg-violet-600" />
        <div className="relative max-w-3xl mx-auto text-center p-8 sm:p-16 rounded-[28px] sm:rounded-[32px] bg-gradient-to-br from-primary/15 to-accent/8 border border-primary/20 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,hsla(263,70%,58%,0.12)_0%,transparent_50%),radial-gradient(circle_at_70%_70%,hsla(24,95%,53%,0.08)_0%,transparent_50%)] animate-blob-float-slow pointer-events-none" />
          <div className="relative z-10">
            <Crown className="w-12 h-12 mx-auto text-primary mb-5 drop-shadow-[0_0_40px_hsla(263,70%,58%,0.4)]" />
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground leading-tight">
              Pronto a Dominare <br /> il <span className="text-vibrant-gradient">Digitale?</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              I tuoi competitor stanno costruendo il loro impero digitale. Inizia il tuo oggi.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => navigate("/admin")}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm sm:text-base tracking-wide font-heading hover:-translate-y-0.5 hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.4)] transition-all flex items-center justify-center gap-2">
                Sono un Ristoratore <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate("/partner/register")}
                className="w-full sm:w-auto px-10 py-4 rounded-full glass border border-primary/30 text-foreground font-bold text-sm sm:text-base tracking-wide font-heading hover:border-primary transition-all">
                Diventa Partner
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          FOOTER
         ═══════════════════════════════════════════ */}
      <footer id="contact" className="border-t border-border/30 py-12 sm:py-16 px-5 sm:px-6 pb-28 sm:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-vibrant-gradient flex items-center justify-center">
                  <Crown className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-foreground tracking-[0.12em] uppercase text-sm">Empire</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[250px]">
                L'unico Asset Digitale di Proprietà che libera i ristoratori dalle commissioni predatorie.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 font-heading">Contatti</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>📧 info@empire-suite.it</p>
                <p>📞 +39 06 1234 5678</p>
                <p>📍 Roma, Italia</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 font-heading">Risorse</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <a href="#features" className="block hover:text-primary transition-colors">Servizi</a>
                <a href="#calculator" className="block hover:text-primary transition-colors">Calcolatore ROI</a>
                <a href="#pricing" className="block hover:text-primary transition-colors">Prezzi</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 font-heading">Legale</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <a href="/privacy" className="block hover:text-primary transition-colors">Privacy Policy</a>
                <a href="/cookie-policy" className="block hover:text-primary transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© 2026 Empire Restaurant Suite. Tutti i diritti riservati.</p>
            <p>P.IVA IT12345678901</p>
          </div>
        </div>
      </footer>

      {/* ═══════ STICKY CTA MOBILE ═══════ */}
      <motion.div className="fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] glass-strong border-t border-border/20 md:hidden"
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 2, type: "spring", damping: 25 }}>
        <div className="flex gap-2">
          <button onClick={() => scrollTo("pricing")}
            className="flex-1 py-3.5 rounded-2xl bg-vibrant-gradient text-primary-foreground font-bold text-sm tracking-wider font-heading relative overflow-hidden">
            €2.997 · Inizia Ora
          </button>
          <button onClick={() => navigate("/r/impero-roma")}
            className="px-4 py-3.5 rounded-2xl glass border border-primary/30 text-primary font-bold text-sm">
            <Play className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
