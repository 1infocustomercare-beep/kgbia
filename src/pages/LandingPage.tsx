import { useState, useEffect, useRef, forwardRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import {
  Crown, Check, Calculator, Star, Zap, Shield, Smartphone,
  TrendingUp, X, Sparkles, Lock, Menu, Target, DollarSign, Brain,
  ChefHat, AlertTriangle, Banknote, ArrowDown, ArrowRight,
  MessageCircle, HelpCircle, ChevronDown, Play, Gem, Users, Rocket,
  CreditCard, Gift, Trophy, Award, Handshake, Quote, Globe,
  BarChart3, QrCode, Bell, Wallet, MapPin, Eye, Bot, Phone,
  BookOpen, Palette, Cpu, Mail, MapPinIcon
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
const Blob = forwardRef<HTMLDivElement, { className?: string; color?: string }>(
  ({ className = "", color = "bg-primary" }, ref) => (
    <div ref={ref} className={`absolute rounded-full blur-[140px] opacity-[0.18] pointer-events-none ${color} ${className}`} />
  )
);
Blob.displayName = "Blob";

/* Section wrapper */
const Section = forwardRef<HTMLElement, { id?: string; children: React.ReactNode; className?: string }>(
  ({ id, children, className = "" }, ref) => (
    <section ref={ref} id={id} className={`relative py-14 sm:py-20 px-6 overflow-hidden ${className}`}>
      <div className="max-w-[1200px] mx-auto relative z-10">{children}</div>
    </section>
  )
);
Section.displayName = "Section";

/* Section label — orange uppercase tracking */
const SectionLabel = ({ text }: { text: string }) => (
  <motion.span
    className="inline-block text-[0.85rem] font-heading font-semibold tracking-[3px] uppercase text-accent mb-4"
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
  >
    {text}
  </motion.span>
);

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
  const [navScrolled, setNavScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Scroll spy for nav
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 60);
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
    { step: "01", title: "Discovery & Setup", desc: "Analizziamo il tuo ristorante, creiamo il tuo profilo digitale e configuriamo la suite in 24 ore." },
    { step: "02", title: "AI Menu & Branding", desc: "L'IA crea il menu digitale e personalizza la tua app con logo, colori e identità del tuo brand." },
    { step: "03", title: "Lancio & Formazione", desc: "Attiviamo la PWA, formiamo il tuo staff sulla Kitchen View e installiamo i QR Code sui tavoli." },
    { step: "04", title: "Crescita & Supporto", desc: "Monitoriamo le performance, ottimizziamo i margini e ti supportiamo con aggiornamenti continui." },
  ];

  const portfolioItems = [
    { name: "Trattoria da Marco", desc: "PWA + AI Menu + Kitchen View", tags: "Roma" },
    { name: "Sushi Master Tokyo", desc: "PWA + Delivery + Wallet Pass", tags: "Milano" },
    { name: "Pizzeria Napoli Verace", desc: "Review Shield + Panic Mode", tags: "Napoli" },
  ];

  const testimonials = [
    { name: "Marco Pellegrini", role: "Trattoria da Marco, Roma", quote: "In 3 mesi ho spostato il 60% degli ordini da JustEat alla mia app. Risparmio €3.200/mese netti.", metric: "−€3.200/mese", stars: 5 },
    { name: "Giulia Ferretti", role: "Osteria Ferretti, Milano", quote: "Kitchen View ha eliminato gli errori in cucina. Prima perdevamo 4-5 ordini a settimana. Ora zero.", metric: "Zero errori cucina", stars: 5 },
    { name: "Antonio Russo", role: "Pizzeria Napoli Verace", quote: "Review Shield è geniale. Su Google ho solo 4.8★. I clienti nuovi arrivano grazie al rating perfetto.", metric: "4.8★ su Google", stars: 5 },
  ];

  const blogPosts = [
    { tag: "AI", date: "28 Febbraio 2026", title: "Come l'AI Sta Rivoluzionando la Ristorazione nel 2026", desc: "Scopri le 5 applicazioni AI più impattanti per il settore food & beverage." },
    { tag: "STRATEGY", date: "22 Febbraio 2026", title: "Liberarsi dal 30% di Commissioni: La Guida Completa", desc: "Best practices per costruire il proprio canale digitale e trattenere i margini." },
    { tag: "GROWTH", date: "15 Febbraio 2026", title: "Da 0 a 500 Ordini/Mese: Il Caso di Trattoria da Marco", desc: "Come un ristorante romano ha triplicato gli ordini online in 90 giorni." },
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
          NAVIGATION — Professional fixed nav
         ═══════════════════════════════════════════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navScrolled ? "bg-background/85 backdrop-blur-xl border-b border-border/30 py-3.5" : "py-5"}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-vibrant-gradient flex items-center justify-center">
              <Crown className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-base tracking-[0.12em] uppercase text-foreground">Empire<span className="text-accent">.AI</span></span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-9">
            {[
              { href: "#services", label: "Servizi" },
              { href: "#portfolio", label: "Portfolio" },
              { href: "#app", label: "App" },
              { href: "#pricing", label: "Prezzi" },
              { href: "#partner", label: "Partner" },
            ].map(link => (
              <a key={link.href} href={link.href}
                className="relative text-[0.92rem] font-medium text-foreground/60 hover:text-foreground transition-colors group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-vibrant-gradient group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <button onClick={() => scrollTo("contact")}
              className="px-6 py-2.5 rounded-full bg-vibrant-gradient text-primary-foreground text-sm font-semibold font-heading hover:-translate-y-0.5 hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.4)] transition-all">
              Inizia Ora
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-foreground" aria-label="Menu">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border/20 overflow-hidden">
              <div className="flex flex-col items-center gap-1 py-5 px-6">
                {["Servizi", "Portfolio", "App", "Prezzi", "Partner"].map(label => (
                  <a key={label} href={`#${label.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors font-heading tracking-wider uppercase">
                    {label}
                  </a>
                ))}
                <button onClick={() => { scrollTo("contact"); setMobileMenuOpen(false); }}
                  className="mt-3 w-full py-3.5 rounded-xl bg-vibrant-gradient text-primary-foreground text-sm font-bold tracking-widest uppercase font-heading">
                  Inizia Ora
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════════════════════════════════
          1. HERO
         ═══════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-[90dvh] flex items-center overflow-hidden px-6 pt-24 pb-16">
        {/* Floating shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[300px] h-[300px] rounded-full border border-foreground/[0.04] top-[10%] right-[5%] animate-blob-float hidden sm:block" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-accent/[0.08] bottom-[20%] right-[15%] animate-blob-float-reverse hidden sm:block" />
          <div className="absolute w-[150px] h-[150px] rounded-full border border-foreground/[0.04] top-[40%] right-[25%] animate-blob-float-slow hidden sm:block" />
        </div>

        <Blob className="w-[500px] h-[500px] -top-[100px] -right-[200px] animate-blob-float" color="bg-violet-600" />
        <Blob className="w-[400px] h-[400px] -bottom-[150px] -left-[100px] animate-blob-float-reverse" color="bg-orange-500" />
        <Blob className="w-[350px] h-[350px] top-1/2 left-[30%] animate-blob-float-slow" color="bg-pink-500" />

        <div className="relative z-10 max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left — Content */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-[720px]">
            <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.12] border border-primary/25 mb-5"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
              <span className="text-xs font-medium text-primary/80 tracking-wider font-heading">AI-Powered Restaurant Suite</span>
            </motion.div>

            <motion.h1
              className="text-[2rem] leading-[1.1] sm:text-4xl md:text-5xl lg:text-[3.5rem] font-heading font-bold text-foreground tracking-tight"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15 }}>
              Trasforma il Tuo Ristorante con l'
              <span className="text-vibrant-gradient">Intelligenza Artificiale</span>
            </motion.h1>

            <motion.p className="mt-4 text-sm sm:text-base text-foreground/60 max-w-[500px] leading-[1.7]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              PWA di proprietà, menu AI, kitchen view, review shield e molto altro.
              Tutto ciò di cui hai bisogno per <strong className="text-foreground">dominare il digitale</strong> e liberarti dal 30% di commissioni.
            </motion.p>

            <motion.div className="mt-7 flex flex-col sm:flex-row items-center gap-3"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <button onClick={() => scrollTo("pricing")}
                className="group relative w-full sm:w-auto px-7 py-3 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.4)]">
                <span className="absolute inset-0 bg-gradient-to-br from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">Prenota una Demo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></span>
              </button>
              <button onClick={() => navigate("/r/impero-roma")}
                className="w-full sm:w-auto px-7 py-3 rounded-full border-2 border-border/30 text-foreground text-sm font-semibold font-heading hover:border-primary/40 hover:bg-primary/[0.06] transition-all flex items-center justify-center gap-2">
                <Play className="w-3.5 h-3.5 text-accent" /> Scopri i Servizi
              </button>
            </motion.div>

            {/* Mobile Live Preview */}
            <motion.div className="mt-10 relative lg:hidden w-full flex justify-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <div className="absolute -inset-8 bg-primary/10 rounded-[40px] blur-[60px] pointer-events-none" />
              <div className="relative overflow-hidden rounded-[32px]" style={{ width: 221, height: 442 }}>
                <div className="absolute top-0 left-1/2" style={{ width: 260, height: 520, transform: 'translateX(-50%) scale(0.85)', transformOrigin: 'top center' }}>
                  <LivePreview slug="impero-roma" primaryColor="#7C3AED" compact />
                </div>
              </div>
            </motion.div>

            {/* Hero stats */}
            <motion.div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-8 pt-6 border-t border-border/30 w-full"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              {[
                { value: "200+", label: "Ristoranti Serviti" },
                { value: "98%", label: "Soddisfazione Clienti" },
                { value: "+45%", label: "Aumento Ordini Online" },
              ].map((s, i) => (
                <div key={i} className="text-center lg:text-left">
                  <p className="text-xl sm:text-2xl font-heading font-bold text-vibrant-gradient">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
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

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <span className="text-[9px] text-foreground/30 tracking-widest uppercase font-heading">Scopri</span>
          <ArrowDown className="w-4 h-4 text-primary/40" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          2. PROBLEMA — Il costo nascosto
         ═══════════════════════════════════════════ */}
      <Section id="problem">
        <div className="text-center mb-16">
          <SectionLabel text="Il Problema" />
          <motion.h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.15] mb-5"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Ogni mese, <span className="text-vibrant-gradient">regali migliaia</span> di euro
          </motion.h2>
          <motion.p className="text-[1.15rem] text-foreground/60 max-w-[600px] mx-auto leading-[1.7]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Le piattaforme di delivery assorbono fino al 30% del tuo fatturato. È ora di riprendere il controllo.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: <Banknote className="w-8 h-8" />, amount: "€7.500", label: "Margini erosi / mese", sub: "Su 1000 ordini a €25 con marketplace" },
            { icon: <DollarSign className="w-8 h-8" />, amount: "€90.000", label: "Dispersi ogni anno", sub: "Capitale che alimenta i tuoi competitor" },
            { icon: <Target className="w-8 h-8" />, amount: "€0", label: "Proprietà clienti", sub: "Il marketplace possiede i TUOI dati" },
          ].map((item, i) => (
            <motion.div key={i}
              className="group relative p-10 rounded-3xl glass border border-border/30 hover:border-accent/25 hover:-translate-y-1 hover:shadow-[0_20px_60px_hsla(263,70%,58%,0.12)] transition-all duration-500 text-center"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/15 border border-primary/20 flex items-center justify-center text-accent mx-auto mb-5">{item.icon}</div>
              <p className="text-5xl font-heading font-bold text-accent">{item.amount}</p>
              <p className="text-sm font-semibold text-foreground mt-3">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        <motion.p className="text-center mt-14 text-lg text-muted-foreground"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          E se potessi trattenere <strong className="text-primary">il 98%</strong> dei tuoi margini?
        </motion.p>
      </Section>

      {/* ═══════════════════════════════════════════
          3. SERVIZI — L'arsenale completo
         ═══════════════════════════════════════════ */}
      <Section id="services">
        <div className="text-center mb-[72px]">
          <SectionLabel text="I Nostri Servizi" />
          <motion.h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.15] mb-5"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Tutto Ciò di Cui il Tuo<br className="hidden sm:block" />
            <span className="text-vibrant-gradient">Ristorante Ha Bisogno</span>
          </motion.h2>
          <motion.p className="text-[1.15rem] text-foreground/60 max-w-[600px] mx-auto leading-[1.7]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Soluzioni end-to-end per portare il tuo ristorante nell'era digitale con stile e intelligenza.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ staggerChildren: 0.08 }}
        >
          {services.map((s, i) => (
            <motion.div key={i}
              className="group relative p-8 rounded-3xl glass border border-border/30 hover:bg-foreground/[0.03] hover:border-primary/20 hover:-translate-y-1 hover:shadow-[0_20px_60px_hsla(263,70%,58%,0.12)] transition-all duration-500"
              variants={fadeUp}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/15 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                {s.icon}
              </div>
              <div className="flex items-center gap-2.5 mb-3">
                <h3 className="font-heading text-[1.3rem] font-semibold text-foreground">{s.title}</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold tracking-wider font-heading">{s.tag}</span>
              </div>
              <p className="text-[0.95rem] text-foreground/60 leading-[1.7]">{s.desc}</p>
              <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-accent font-heading group-hover:gap-3 transition-all">
                Scopri di più <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          4. COME FUNZIONA
         ═══════════════════════════════════════════ */}
      <Section id="process">
        <div className="text-center mb-20">
          <SectionLabel text="Come Funziona" />
          <motion.h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.15] mb-5"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Dal Concept al <span className="text-vibrant-gradient">Lancio in 4 Step</span>
          </motion.h2>
          <motion.p className="text-[1.15rem] text-foreground/60 max-w-[600px] mx-auto leading-[1.7]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Un processo collaudato per trasformare la tua visione in realtà digitale.
          </motion.p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-[36px] left-[calc(12.5%+36px)] right-[calc(12.5%+36px)] h-0.5 bg-gradient-to-r from-primary/30 via-pink-500/30 to-accent/30 z-0" />

          {howItWorks.map((s, i) => (
            <motion.div key={i} className="relative text-center z-10"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
              <div className="relative w-[72px] h-[72px] rounded-full bg-vibrant-gradient flex items-center justify-center mx-auto mb-6">
                <span className="font-heading font-bold text-[1.5rem] text-primary-foreground">{s.step}</span>
                <div className="absolute -inset-1 rounded-full border-2 border-primary/25" />
              </div>
              <h3 className="font-heading text-[1.15rem] font-semibold text-foreground mb-2.5">{s.title}</h3>
              <p className="text-[0.9rem] text-foreground/60 leading-[1.6]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          5. PORTFOLIO
         ═══════════════════════════════════════════ */}
      <Section id="portfolio">
        <div className="text-center mb-[72px]">
          <SectionLabel text="Portfolio" />
          <motion.h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.15] mb-5"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Progetti che <span className="text-vibrant-gradient">Parlano da Soli</span>
          </motion.h2>
          <motion.p className="text-[1.15rem] text-foreground/60 max-w-[600px] mx-auto leading-[1.7]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Ogni ristorante è unico. Ecco come abbiamo trasformato la presenza digitale dei nostri clienti.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
          {portfolioItems.map((item, i) => (
            <motion.div key={i}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] glass border border-border/30 cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_20px_60px_hsla(263,70%,58%,0.2)] transition-all duration-500"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              {/* Mockup browser */}
              <div className="absolute inset-0 bg-gradient-to-br from-card to-background flex items-center justify-center">
                <div className="w-[80%] h-[70%] rounded-2xl bg-background/60 border border-border/40 overflow-hidden">
                  <div className="h-6 bg-foreground/[0.04] flex items-center gap-1.5 px-3">
                    <span className="w-2 h-2 rounded-full bg-destructive/60" />
                    <span className="w-2 h-2 rounded-full bg-accent/60" />
                    <span className="w-2 h-2 rounded-full bg-green-500/60" />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="h-1.5 w-[60%] rounded-full bg-vibrant-gradient opacity-40" />
                    <div className="h-1.5 w-[80%] rounded-full bg-foreground/[0.06]" />
                    <div className="h-1.5 w-[45%] rounded-full bg-foreground/[0.06]" />
                  </div>
                </div>
              </div>
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent flex items-end p-7 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{item.name}</h3>
                  <p className="text-sm text-foreground/60">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          6. APP SHOWCASE — 3 Phone Mockups
         ═══════════════════════════════════════════ */}
      <Section id="app">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionLabel text="App Personalizzate" />
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.15] mb-5">
              La Tua App, <br /><span className="text-vibrant-gradient">Il Tuo Brand</span>
            </h2>
            <p className="text-[1.15rem] text-foreground/60 leading-[1.7] max-w-lg mb-8">
              Cliente, Admin e Cucina — tutto in un ecosistema unico, white-label, di tua proprietà.
            </p>
            <div className="space-y-5 mb-10">
              {[
                { title: "Ordini Online", desc: "Menu interattivo con pagamento integrato Stripe" },
                { title: "Programma Fedeltà", desc: "Wallet pass, reward e offerte personalizzate AI" },
                { title: "Push & Chat", desc: "Comunicazione diretta e campagne marketing push" },
                { title: "Kitchen View", desc: "Ordini real-time in cucina, zero errori garantiti" },
              ].map((f, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-7 h-7 min-w-[28px] rounded-full bg-gradient-to-br from-primary/25 to-accent/15 flex items-center justify-center text-accent text-xs font-bold mt-0.5">✓</div>
                  <div>
                    <p className="text-[0.95rem] text-foreground"><strong>{f.title}</strong> — {f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/r/impero-roma")}
              className="group px-9 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-base font-heading hover:-translate-y-0.5 hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.4)] transition-all inline-flex items-center gap-2.5">
              Richiedi una Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* 3 Phone Mockups */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="flex justify-center items-end gap-4 sm:gap-5 relative">
              <div className="absolute -inset-10 bg-violet-600/10 rounded-[60px] blur-[80px] pointer-events-none" />
              {[
                { label: "👤 Cliente", img: mockupCliente, title: "Vista Cliente" },
                { label: "⚙️ Admin", img: mockupAdmin, title: "Pannello Admin" },
                { label: "🍳 Cucina", img: mockupCucina, title: "Kitchen View" },
              ].map((phone, i) => (
                <div key={i} className="relative flex flex-col items-center flex-1 max-w-[160px]">
                  <span className="text-[10px] font-heading font-bold text-accent tracking-widest uppercase mb-2">{phone.label}</span>
                  <div className="relative w-full aspect-[9/19] bg-card rounded-[20px] sm:rounded-[28px] border-[3px] border-foreground/10 overflow-hidden shadow-[0_40px_80px_hsla(0,0%,0%,0.5),0_0_80px_hsla(263,70%,58%,0.15)]">
                    <div className="w-[40%] h-3 sm:h-[28px] bg-background rounded-b-[14px] mx-auto relative z-20" />
                    <img src={phone.img} alt={phone.title} className="absolute inset-0 w-full h-full object-cover object-top" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          7. STATS + CHI SIAMO
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* About text */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionLabel text="Chi Siamo" />
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.15] mb-5">
              Il Team Dietro <br /><span className="text-vibrant-gradient">la Magia</span>
            </h2>
            <p className="text-base text-foreground/60 leading-[1.8] mb-8">
              Siamo un team di designer, sviluppatori e specialisti AI con una passione: rivoluzionare il modo in cui i ristoranti interagiscono con i loro clienti attraverso la tecnologia.
            </p>
            <div className="grid grid-cols-2 gap-5">
              {[
                { value: "5+", label: "Anni di Esperienza" },
                { value: "15", label: "Esperti nel Team" },
                { value: "200+", label: "Progetti Completati" },
                { value: "12", label: "Città Servite" },
              ].map((c, i) => (
                <div key={i} className="p-6 rounded-2xl glass border border-border/30">
                  <p className="text-2xl font-heading font-bold text-vibrant-gradient">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Team grid */}
          <motion.div className="grid grid-cols-2 gap-5"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
            {[
              { name: "Marco R.", role: "CEO & AI Strategist" },
              { name: "Sofia L.", role: "Lead Designer" },
              { name: "Luca B.", role: "CTO & Full-Stack Dev" },
              { name: "Elena M.", role: "Marketing & Growth" },
            ].map((m, i) => (
              <div key={i} className="p-8 rounded-3xl glass border border-border/30 text-center hover:border-primary/20 hover:-translate-y-1 transition-all duration-500">
                <div className="w-20 h-20 rounded-full bg-vibrant-gradient opacity-30 mx-auto mb-4 relative">
                  <div className="absolute -inset-[3px] rounded-full border-2 border-primary/25" />
                </div>
                <h4 className="font-heading text-base font-semibold text-foreground mb-1">{m.name}</h4>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          8. ROI CALCULATOR
         ═══════════════════════════════════════════ */}
      <Section id="calculator">
        <div className="text-center mb-[72px]">
          <SectionLabel text="ROI Calculator" />
          <motion.h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.15]"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Il tuo <span className="text-vibrant-gradient">risparmio reale</span>
          </motion.h2>
        </div>

        <motion.div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl glass border border-border/30 space-y-6"
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

          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-foreground font-medium">Risparmi al mese</span>
              <span className="text-2xl sm:text-3xl font-heading font-bold text-primary">€{monthlySaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground font-medium">Risparmi all'anno</span>
              <span className="text-2xl sm:text-3xl font-heading font-bold text-vibrant-gradient">€{yearSaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-primary/20">
              <span className="text-muted-foreground text-sm">ROI completo in</span>
              <span className="text-foreground font-heading font-bold text-lg">{roiMonths} {roiMonths === 1 ? "mese" : "mesi"}</span>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          9. TESTIMONIALS
         ═══════════════════════════════════════════ */}
      <Section id="testimonials">
        <div className="text-center mb-[72px]">
          <SectionLabel text="Testimonianze" />
          <motion.h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.15] mb-5"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            I Nostri Clienti <span className="text-vibrant-gradient">Parlano</span>
          </motion.h2>
          <motion.p className="text-[1.15rem] text-foreground/60 max-w-[600px] mx-auto leading-[1.7]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Ecco cosa dicono i ristoratori che hanno scelto Empire per la loro trasformazione digitale.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {testimonials.map((t, i) => (
            <motion.div key={i} className="group relative p-8 rounded-3xl glass border border-border/30 hover:border-primary/20 hover:-translate-y-1 hover:shadow-[0_20px_60px_hsla(263,70%,58%,0.12)] transition-all duration-500"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.stars }).map((_, j) => <Star key={j} className="w-4 h-4 text-accent fill-accent" />)}
              </div>
              <blockquote className="text-[0.95rem] text-foreground/70 leading-[1.7] mb-6 italic">"{t.quote}"</blockquote>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-[10px] text-primary font-bold mb-5 font-heading">
                <TrendingUp className="w-3 h-3" /> {t.metric}
              </div>
              <div className="flex items-center gap-3 border-t border-border/30 pt-4">
                <div className="w-11 h-11 rounded-full bg-vibrant-gradient opacity-40" />
                <div>
                  <h4 className="font-heading text-sm font-semibold text-foreground">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          10. PRICING
         ═══════════════════════════════════════════ */}
      <Section id="pricing">
        <div className="text-center mb-[72px]">
          <SectionLabel text="Prezzi" />
          <motion.h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.15] mb-5"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Piani <span className="text-vibrant-gradient">Trasparenti</span>
          </motion.h2>
          <motion.p className="text-[1.15rem] text-foreground/60 max-w-[600px] mx-auto leading-[1.7]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Un investimento una tantum. Zero canoni. Il tuo asset digitale per sempre.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 max-w-3xl mx-auto">
          {/* Full */}
          <motion.div className="relative p-8 sm:p-10 rounded-3xl glass border border-primary/25 overflow-hidden bg-gradient-to-br from-primary/[0.12] to-accent/[0.06]"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-vibrant-gradient" />
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-vibrant-gradient text-[10px] font-bold text-primary-foreground tracking-wider font-heading">PIÙ POPOLARE</span>
            <div className="relative">
              <span className="text-xs font-semibold text-accent tracking-wider uppercase font-heading">Pagamento Unico</span>
              <p className="text-[3rem] font-heading font-bold text-foreground mt-2">€2.997</p>
              <p className="text-sm text-muted-foreground">IVA 22% inclusa · Una volta sola</p>
              <ul className="mt-8 space-y-3 mb-9">
                {[
                  "Asset Digitale di Proprietà", "AI Menu Creator + OCR", "Kitchen View real-time",
                  "Vault Fiscale AES-256", "Panic Mode + Review Shield", "PWA White Label",
                  "Chat Privata + Notifiche Push", "Mappa Tavoli Interattiva", "Assistenza a vita", "Zero canoni mensili",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[0.9rem] text-foreground/70 py-1 border-b border-border/20 last:border-0">
                    <span className="text-accent font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/admin")}
                className="w-full py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-base font-heading hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.4)] transition-all">
                Inizia il tuo Impero
              </button>
              <p className="mt-3 text-xs text-center text-muted-foreground">Dopo: €0/mese · Solo 2% sulle transazioni</p>
            </div>
          </motion.div>

          {/* 3 Rate */}
          <motion.div className="relative p-8 sm:p-10 rounded-3xl glass border border-border/30 hover:border-primary/25 transition-all duration-500"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase font-heading">3 Rate</span>
            <p className="text-[2.5rem] font-heading font-bold text-foreground mt-2">€1.099<span className="text-base text-muted-foreground font-normal">/mese</span></p>
            <p className="text-sm text-muted-foreground">Totale: €3.297 · IVA inclusa</p>
            <ul className="mt-8 space-y-3 mb-9">
              {["Tutte le funzionalità incluse", "Massima flessibilità di pagamento", "Attivazione immediata del servizio", "Chiusura rapida senza vincoli"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-[0.9rem] text-foreground/60 py-1 border-b border-border/20 last:border-0">
                  <span className="text-accent font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate("/admin")}
              className="w-full py-4 rounded-full border-2 border-primary/25 text-primary font-bold text-base font-heading hover:bg-primary hover:text-primary-foreground transition-all">
              Scegli 3 Rate
            </button>
          </motion.div>
        </div>

        <motion.p className="text-center mt-10 text-sm text-muted-foreground max-w-xl mx-auto"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <span className="text-foreground font-semibold">Dopo l'attivazione:</span> €0/mese · Solo <span className="text-primary font-bold">2%</span> sulle transazioni per infrastruttura, IA e aggiornamenti continui.
        </motion.p>
      </Section>

      {/* ═══════════════════════════════════════════
          11. PARTNER PROGRAM
         ═══════════════════════════════════════════ */}
      <Section id="partner">
        <div className="text-center mb-[72px]">
          <SectionLabel text="Partner Program" />
          <motion.h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.15] mb-5"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Costruisci il tuo <span className="text-vibrant-gradient">Impero</span>
          </motion.h2>
          <motion.p className="text-[1.15rem] text-foreground/60 max-w-[600px] mx-auto leading-[1.7]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Diventa Partner e guadagna €997 per ogni vendita. Zero rischi, strumenti elite, pagamenti istantanei.
          </motion.p>
        </div>

        {/* Earnings grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-12">
          {[
            { value: "€997", label: "Per vendita", icon: <Trophy className="w-5 h-5" />, sub: "Commissione Partner" },
            { value: "€50", label: "Override TL", icon: <Award className="w-5 h-5" />, sub: "Dalla 4ª vendita" },
            { value: "€500", label: "Bonus 3 vendite", icon: <Gift className="w-5 h-5" />, sub: "Bonus mensile" },
            { value: "€1.500", label: "Bonus 5 vendite", icon: <Rocket className="w-5 h-5" />, sub: "Bonus Elite" },
          ].map((s, i) => (
            <motion.div key={i} className="p-6 rounded-3xl glass border border-border/30 text-center hover:border-primary/20 hover:-translate-y-1 transition-all duration-500"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">{s.icon}</div>
              <p className="text-2xl font-heading font-bold text-primary">{s.value}</p>
              <p className="text-xs font-semibold text-foreground mt-1">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Career path */}
        <motion.div className="p-7 rounded-3xl glass border border-primary/20 mb-12"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="font-heading font-bold text-lg text-foreground text-center mb-6">Percorso di Carriera</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
            {[
              { title: "Partner", desc: "€997/vendita", icon: <Handshake className="w-5 h-5" /> },
              { title: "3 Vendite", desc: "Promozione automatica", icon: <TrendingUp className="w-5 h-5" /> },
              { title: "Team Leader", desc: "+€50 override", icon: <Crown className="w-5 h-5" /> },
            ].map((s, i) => (
              <div key={i} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center w-full sm:w-auto">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{s.icon}</div>
                <div className="text-left sm:text-center">
                  <p className="text-sm font-bold text-foreground font-heading">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                {i < 2 && <ArrowRight className="hidden sm:block w-5 h-5 text-primary/30 mx-8 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scenario */}
        <motion.div className="p-7 rounded-3xl glass border border-primary/20 max-w-xl mx-auto mb-12"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="font-heading font-bold text-base text-foreground text-center mb-5">📊 Scenario: 5 vendite al mese</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">5× Commissioni Partner</span><span className="font-bold text-foreground">€4.985</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Bonus Elite mensile</span><span className="font-bold text-foreground">€1.500</span></div>
            <div className="flex justify-between pt-4 border-t border-primary/20">
              <span className="font-semibold text-foreground">Totale mensile</span>
              <span className="text-2xl font-heading font-bold text-vibrant-gradient">€6.485</span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div className="text-center" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="font-heading font-bold text-xl text-foreground mb-3">Zero Costi di Ingresso</h3>
          <p className="text-base text-muted-foreground mb-6">Nessun investimento iniziale. Paghiamo solo il tuo talento.</p>
          <button onClick={() => navigate("/partner/register")}
            className="px-10 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-base font-heading hover:-translate-y-0.5 hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.4)] transition-all">
            Diventa Partner
          </button>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          12. BLOG
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="text-center mb-[72px]">
          <SectionLabel text="Blog & Risorse" />
          <motion.h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.15] mb-5"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Insights per il <span className="text-vibrant-gradient">Tuo Business</span>
          </motion.h2>
          <motion.p className="text-[1.15rem] text-foreground/60 max-w-[600px] mx-auto leading-[1.7]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Guide, trend e best practices per ristoratori che vogliono innovare.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {blogPosts.map((post, i) => (
            <motion.div key={i}
              className="group rounded-3xl glass border border-border/30 overflow-hidden hover:border-primary/20 hover:-translate-y-1 hover:shadow-[0_20px_60px_hsla(263,70%,58%,0.12)] transition-all duration-500 cursor-pointer"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              {/* Thumbnail */}
              <div className="h-[200px] bg-gradient-to-br from-card to-background relative overflow-hidden">
                <div className="absolute inset-0 bg-vibrant-gradient opacity-[0.08]" />
                <span className="absolute top-4 left-4 px-3.5 py-1.5 bg-background/60 backdrop-blur-xl rounded-full text-[0.7rem] font-bold uppercase tracking-wider text-accent font-heading">{post.tag}</span>
              </div>
              {/* Body */}
              <div className="p-7">
                <p className="text-xs text-muted-foreground mb-2.5">{post.date}</p>
                <h3 className="font-heading text-[1.15rem] font-semibold text-foreground leading-snug mb-2.5">{post.title}</h3>
                <p className="text-[0.9rem] text-foreground/60 leading-[1.6]">{post.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          13. FAQ — Side-by-side layout
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20 items-start">
          {/* Left text */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionLabel text="FAQ" />
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.15] mb-5">
              Domande? <span className="text-vibrant-gradient">Risposte.</span>
            </h2>
            <p className="text-base text-foreground/60 leading-[1.8]">
              Tutto quello che devi sapere su Empire, dai costi alla tecnologia. Non trovi la tua domanda? Scrivici.
            </p>
          </motion.div>

          {/* Right — FAQ items */}
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} className="rounded-3xl glass border border-border/30 overflow-hidden"
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-foreground/[0.02] transition-colors">
                  <span className="text-[1.05rem] font-semibold text-foreground pr-4 font-heading">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }}
                    className="w-8 h-8 rounded-full bg-primary/[0.12] flex items-center justify-center flex-shrink-0 text-primary text-lg font-heading">
                    +
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <p className="px-6 pb-6 text-[0.92rem] text-foreground/60 leading-[1.7]">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          14. CTA + NEWSLETTER
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="relative text-center p-12 sm:p-20 rounded-[32px] bg-gradient-to-br from-primary/[0.15] to-accent/[0.08] border border-primary/20 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,hsla(263,70%,58%,0.12)_0%,transparent_50%),radial-gradient(circle_at_70%_70%,hsla(24,95%,53%,0.08)_0%,transparent_50%)] animate-blob-float-slow pointer-events-none" />
          <div className="relative z-10">
            <Crown className="w-12 h-12 mx-auto text-primary mb-6 drop-shadow-[0_0_40px_hsla(263,70%,58%,0.4)]" />
            <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] font-heading font-bold text-foreground leading-[1.15] mb-5">
              Pronto a Dominare <br /> il <span className="text-vibrant-gradient">Digitale?</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-md mx-auto mb-10">
              I tuoi competitor stanno costruendo il loro impero digitale. Inizia il tuo oggi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => navigate("/admin")}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-base font-heading hover:-translate-y-0.5 hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.4)] transition-all flex items-center justify-center gap-2">
                Sono un Ristoratore <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate("/partner/register")}
                className="w-full sm:w-auto px-10 py-4 rounded-full border-2 border-border/30 text-foreground font-bold text-base font-heading hover:border-primary/40 transition-all">
                Diventa Partner
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          FOOTER — Professional 4-column
         ═══════════════════════════════════════════ */}
      <footer id="contact" className="border-t border-border/30 py-20 pb-10 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-12 mb-16">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-vibrant-gradient flex items-center justify-center">
                  <Crown className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-foreground tracking-[0.12em] uppercase text-sm">Empire<span className="text-accent">.AI</span></span>
              </div>
              <p className="text-sm text-foreground/60 leading-[1.7] max-w-[280px] mb-6">
                L'unico Asset Digitale di Proprietà che libera i ristoratori dalle commissioni predatorie dei marketplace.
              </p>
              {/* Social links */}
              <div className="flex gap-3">
                {["In", "𝕏", "IG"].map((s, i) => (
                  <div key={i} className="w-10 h-10 rounded-full glass border border-border/30 flex items-center justify-center text-sm text-foreground/60 hover:bg-vibrant-gradient hover:text-primary-foreground hover:border-transparent hover:-translate-y-0.5 transition-all cursor-pointer">{s}</div>
                ))}
              </div>
            </div>

            {/* Contatti */}
            <div>
              <h4 className="font-heading text-[0.95rem] font-semibold text-foreground mb-5">Contatti</h4>
              <div className="space-y-3 text-sm text-foreground/60">
                <p>📧 info@empire-suite.it</p>
                <p>📞 +39 06 1234 5678</p>
                <p>📍 Roma, Italia</p>
              </div>
            </div>

            {/* Risorse */}
            <div>
              <h4 className="font-heading text-[0.95rem] font-semibold text-foreground mb-5">Risorse</h4>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Servizi", href: "#services" },
                  { label: "Portfolio", href: "#portfolio" },
                  { label: "Calcolatore ROI", href: "#calculator" },
                  { label: "Prezzi", href: "#pricing" },
                ].map((link, i) => (
                  <a key={i} href={link.href} className="block text-foreground/60 hover:text-accent hover:pl-1 transition-all">{link.label}</a>
                ))}
              </div>
            </div>

            {/* Legale */}
            <div>
              <h4 className="font-heading text-[0.95rem] font-semibold text-foreground mb-5">Legale</h4>
              <div className="space-y-3 text-sm">
                <a href="/privacy" className="block text-foreground/60 hover:text-accent hover:pl-1 transition-all">Privacy Policy</a>
                <a href="/cookie-policy" className="block text-foreground/60 hover:text-accent hover:pl-1 transition-all">Cookie Policy</a>
                <a href="#" className="block text-foreground/60 hover:text-accent hover:pl-1 transition-all">Termini di Servizio</a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2026 Empire Restaurant Suite. Tutti i diritti riservati.</p>
            <div className="flex gap-6">
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="/cookie-policy" className="hover:text-foreground transition-colors">Cookie</a>
              <span>P.IVA IT12345678901</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════ STICKY CTA MOBILE ═══════ */}
      <motion.div className="fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] glass-strong border-t border-border/20 md:hidden"
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 2, type: "spring", damping: 25 }}>
        <div className="flex gap-2">
          <button onClick={() => scrollTo("pricing")}
            className="flex-1 py-3.5 rounded-2xl bg-vibrant-gradient text-primary-foreground font-bold text-sm tracking-wider font-heading">
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
