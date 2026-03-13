import { useState, useEffect, useRef, forwardRef } from "react";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import { PremiumCarousel } from "@/components/public/PremiumCarousel";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import {
  Crown, Check, Star, Zap, Shield, Smartphone,
  TrendingUp, X, Sparkles, Lock, Menu, Target, DollarSign, Brain,
  ChefHat, AlertTriangle, Banknote, ArrowDown, ArrowRight,
  ChevronDown, Play, Gem, Users, Rocket,
  Gift, Trophy, Award, Handshake, Quote,
  BarChart3, QrCode, Bell, Wallet, MapPin, Eye, Bot,
  Palette, Mail, Car, Scissors, Heart, Store, Dumbbell, Building,
  Calendar, Package, CreditCard, Route, ClipboardCheck, Headphones,
  Layers, Globe, Radio, MonitorSmartphone, Cpu, Fingerprint,
  ChevronRight, CircleCheck, Minus, Activity, ServerCog, Gauge,
  Workflow, ScanLine, Database, Wifi, Timer, LineChart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DEMO_SLUGS } from "@/data/demo-industries";
import heroLanding from "@/assets/hero-landing.jpg";
import videoHero from "@/assets/video-hero-empire.mp4";
import heroTechCommand from "@/assets/hero-tech-command.jpg";
import heroAiPlatform from "@/assets/hero-ai-platform.jpg";
import heroPartnerLuxury from "@/assets/hero-partner-luxury.jpg";
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
    const dur = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);
  return <span ref={ref}>{prefix}{display.toLocaleString("it-IT")}{suffix}</span>;
};

const Section = forwardRef<HTMLElement, { id?: string; children: React.ReactNode; className?: string }>(
  ({ id, children, className = "" }, ref) => (
    <section ref={ref} id={id} className={`relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden ${className}`}>
      <div className="max-w-[1100px] mx-auto relative z-10">{children}</div>
    </section>
  )
);
Section.displayName = "Section";

const SectionLabel = forwardRef<HTMLDivElement, { text: string; icon?: React.ReactNode }>(
  ({ text, icon }, ref) => (
    <motion.div
      ref={ref}
      className="inline-flex items-center gap-2.5 mb-5"
      initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full premium-label">
        {icon || <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />}
        <span className="text-[0.65rem] font-heading font-semibold tracking-[3px] uppercase text-primary/90">{text}</span>
      </div>
    </motion.div>
  )
);
SectionLabel.displayName = "SectionLabel";

const smoothEase = [0.22, 1, 0.36, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smoothEase } } };
const fadeScale = { hidden: { opacity: 0, y: 15, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: smoothEase } } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const staggerFast = { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const slideInLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: smoothEase } } };
const slideInRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: smoothEase } } };
const popIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 24 } } };

/* ═══ Floating Particle ═══ */
const Particle = ({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) => (
  <motion.div
    className="absolute rounded-full"
    style={{ width: size, height: size, left: x, top: y, background: delay % 2 === 0 ? "hsl(42, 80%, 55%)" : "hsl(265, 70%, 60%)" }}
    animate={{ y: [0, -25, 0], opacity: [0.1, 0.35, 0.1], scale: [1, 1.3, 1] }}
    transition={{ duration: 5 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

/* ═══ Section Divider ═══ */
const SectionDivider = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="section-connector">
    <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, hsla(42, 80%, 55%, 0.15) 20%, hsla(265, 70%, 60%, 0.3) 50%, hsla(42, 80%, 55%, 0.15) 80%, transparent 100%)" }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: "hsl(42, 80%, 55%)", boxShadow: "0 0 12px hsla(42, 80%, 55%, 0.6), 0 0 30px hsla(265, 70%, 60%, 0.3)" }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  </div>
));
SectionDivider.displayName = "SectionDivider";

/* ═══ Comparison Row ═══ */
const CompRow = ({ label, empire, others }: { label: string; empire: string; others: string }) => (
  <motion.div className="grid grid-cols-3 py-3 border-b border-border/30 items-center text-xs sm:text-sm"
    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
    <span className="text-foreground/50 font-medium">{label}</span>
    <span className="text-center text-foreground font-bold flex items-center justify-center gap-1.5">
      <CircleCheck className="w-3.5 h-3.5 text-primary" /> {empire}
    </span>
    <span className="text-center text-foreground/30">{others}</span>
  </motion.div>
);

/* ═══════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════ */

const LandingPage = () => {
  const navigate = useNavigate();
  const [monthlyOrders, setMonthlyOrders] = useState(500);
  const [avgOrder, setAvgOrder] = useState(25);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [premiumGrid, setPremiumGrid] = useState(true); // kept for type safety

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 80]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  useEffect(() => {
    const h = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveIndustry(p => (p + 1) % 7), 3000);
    return () => clearInterval(timer);
  }, []);

  const setupCost = 2997;
  const monthlyRevenue = monthlyOrders * avgOrder;
  const thirdPartyCost = monthlyRevenue * 0.30;
  const empireCost = monthlyRevenue * 0.02;
  const monthlySaving = thirdPartyCost - empireCost;
  const roiMonths = monthlySaving > 0 ? Math.ceil(setupCost / monthlySaving) : 0;
  const yearSaving = monthlySaving * 12;

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  /* ═══ DATA ═══ */

  const industries = [
    { id: "food" as const, icon: <ChefHat className="w-5 h-5" />, title: "Food & Ristorazione", desc: "Ristoranti, pizzerie, bar, pasticcerie, sushi bar", gradient: "from-orange-500 to-amber-400", emoji: "🍽️", modules: "Menu Digitale · Ordini · QR · Cucina Live" },
    { id: "ncc" as const, icon: <Car className="w-5 h-5" />, title: "NCC & Trasporto", desc: "Noleggio con conducente, transfer, limousine", gradient: "from-sky-500 to-blue-500", emoji: "🚘", modules: "Flotta · Tratte · Booking · Autisti" },
    { id: "beauty" as const, icon: <Scissors className="w-5 h-5" />, title: "Beauty & Wellness", desc: "Saloni, centri estetici, SPA, barbieri", gradient: "from-pink-500 to-rose-400", emoji: "💅", modules: "Agenda · Clienti · Reminder · Trattamenti" },
    { id: "healthcare" as const, icon: <Heart className="w-5 h-5" />, title: "Healthcare", desc: "Studi medici, dentisti, fisioterapisti", gradient: "from-emerald-500 to-teal-400", emoji: "🏥", modules: "Schede Paziente · Agenda · Fatturazione" },
    { id: "retail" as const, icon: <Store className="w-5 h-5" />, title: "Retail & Negozi", desc: "Negozi, boutique, e-commerce locale", gradient: "from-cyan-500 to-blue-400", emoji: "🛍️", modules: "Catalogo · Inventario · POS · Promozioni" },
    { id: "fitness" as const, icon: <Dumbbell className="w-5 h-5" />, title: "Fitness & Sport", desc: "Palestre, centri sportivi, personal trainer", gradient: "from-lime-500 to-green-400", emoji: "💪", modules: "Abbonamenti · Corsi · Check-in · Pagamenti" },
    { id: "hospitality" as const, icon: <Building className="w-5 h-5" />, title: "Hospitality", desc: "Hotel, B&B, agriturismi, resort", gradient: "from-amber-400 to-orange-400", emoji: "🏨", modules: "Camere · Booking · Ospiti · Concierge" },
  ];

  const services = [
    { icon: <Brain className="w-5 h-5" />, title: "AI Business Engine", desc: "L'IA analizza il tuo business, genera cataloghi, ottimizza prezzi e automatizza le operazioni quotidiane.", tag: "IA", color: "from-blue-500 to-cyan-500" },
    { icon: <Smartphone className="w-5 h-5" />, title: "App White Label", desc: "App professionale installabile con il TUO brand, colori e dominio. Nessun logo di terzi, mai.", tag: "APP", color: "from-sky-500 to-blue-500" },
    { icon: <Calendar className="w-5 h-5" />, title: "Prenotazioni & Ordini", desc: "Gestisci appuntamenti, ordini, prenotazioni corse o camere da un unico pannello centralizzato.", tag: "OPS", color: "from-emerald-500 to-green-500" },
    { icon: <Shield className="w-5 h-5" />, title: "Review Shield™", desc: "Le recensioni negative restano nel tuo archivio privato. Solo le migliori costruiscono la tua reputazione online.", tag: "BRAND", color: "from-amber-500 to-orange-500" },
    { icon: <Users className="w-5 h-5" />, title: "CRM & Fidelizzazione", desc: "Storico acquisti, preferenze, wallet fedeltà digitale. Trasforma i visitatori in clienti ricorrenti.", tag: "GROWTH", color: "from-pink-500 to-rose-500" },
    { icon: <BarChart3 className="w-5 h-5" />, title: "Analytics & Finance", desc: "Dashboard fatturato, margini, performance staff, trend e fatturazione elettronica integrata.", tag: "FINANCE", color: "from-cyan-500 to-teal-500" },
    { icon: <Package className="w-5 h-5" />, title: "Inventario & HACCP", desc: "Monitora scorte, ricevi alert automatici, registra controlli igienico-sanitari e conformità.", tag: "OPS", color: "from-indigo-500 to-blue-600" },
    { icon: <Bell className="w-5 h-5" />, title: "Marketing Automation", desc: "Push notification, campagne email/WhatsApp, promozioni mirate e segmentazione clienti avanzata.", tag: "MARKETING", color: "from-fuchsia-500 to-pink-500" },
    { icon: <Lock className="w-5 h-5" />, title: "Sicurezza Enterprise", desc: "Crittografia AES-256, GDPR compliant, backup automatici, accessi multi-ruolo e audit trail.", tag: "SECURITY", color: "from-slate-500 to-gray-600" },
  ];

  const metrics = [
    { value: 200, suffix: "+", label: "Attività Attive" },
    { value: 25, suffix: "+", label: "Settori Coperti" },
    { value: 45, suffix: "%", prefix: "+", label: "Aumento Fatturato" },
    { value: 98, suffix: "%", label: "Soddisfazione" },
  ];

  const testimonials = [
    { name: "Marco Pellegrini", role: "Trattoria da Marco · Roma", quote: "In 3 mesi ho spostato il 60% degli ordini dalla piattaforma alla mia app. Risparmio €3.200 al mese netti.", metric: "−€3.200/mese", industry: "Food", emoji: "🍽️" },
    { name: "Alessandra Conti", role: "NCC Premium Transfer · Milano", quote: "Prima gestivo le prenotazioni via WhatsApp. Ora ho un sistema automatizzato con flotta, tratte e pagamenti integrati.", metric: "+40% fatturato", industry: "NCC", emoji: "🚘" },
    { name: "Valentina Rossi", role: "Beauty Lab · Firenze", quote: "I clienti prenotano dall'app, ricevono promemoria automatici e il no-show è crollato del 70%.", metric: "−70% no-show", industry: "Beauty", emoji: "💅" },
    { name: "Dr. Luca Bianchi", role: "Studio Dentistico · Torino", quote: "Agenda digitale, schede paziente, fatturazione elettronica. Ho eliminato 2 ore di burocrazia al giorno.", metric: "−2h/giorno", industry: "Healthcare", emoji: "🏥" },
    { name: "Simone Moretti", role: "CrossFit Arena · Bologna", quote: "Gestione corsi, abbonamenti e pagamenti in un'unica piattaforma. Il tasso di rinnovo è salito all'87%.", metric: "87% rinnovi", industry: "Fitness", emoji: "💪" },
    { name: "Giulia De Luca", role: "Boutique Eleganza · Napoli", quote: "Il catalogo digitale ha trasformato il mio negozio. Le vendite online sono il 35% del totale.", metric: "+35% vendite", industry: "Retail", emoji: "🛍️" },
  ];

  const faqs = [
    { q: "Per quali settori funziona Empire?", a: "Empire copre oltre 25 settori: ristoranti, NCC, saloni di bellezza, studi medici, negozi, palestre, hotel, idraulici, elettricisti, agriturismi, lidi, e molti altri. Ogni settore ha moduli, terminologia e flussi dedicati che si attivano automaticamente." },
    { q: "È difficile da usare?", a: "No. Se sai usare Instagram, sai usare Empire. L'interfaccia si adatta al tuo settore. L'IA fa il lavoro pesante: carica una foto e in 60 secondi hai il tuo catalogo digitale completo." },
    { q: "Come funzionano i pagamenti?", a: "I pagamenti arrivano direttamente sul TUO conto via Stripe Connect. Non tocchiamo mai i tuoi soldi. L'unica trattenuta è il 2% automatico — 15× meno delle piattaforme tradizionali." },
    { q: "Quanto costa davvero?", a: "€2.997 una tantum (o 3 rate da €1.099). Dopodiché €0/mese per sempre. Solo il 2% sulle transazioni. Nessun vincolo, nessun costo nascosto." },
    { q: "I miei dati sono al sicuro?", a: "Sì. Crittografia AES-256, conformità GDPR, backup automatici e accessi multi-ruolo. Standard enterprise anche per la piccola attività. I tuoi dati sono di tua proprietà." },
    { q: "Come funziona il Partner Program?", a: "Diventi Partner gratis. Guadagni €997 per ogni vendita + bonus fino a €1.500/mese. Pagamenti istantanei via Stripe Connect. Nessun rischio, nessun investimento iniziale." },
    { q: "Quanto tempo serve per essere operativi?", a: "24 ore. Il nostro team configura tutto: branding, menu/catalogo, integrazioni. Formazione inclusa. Sei operativo dal giorno 1." },
    { q: "Posso personalizzare tutto?", a: "Assolutamente. Logo, colori, dominio, moduli attivi, flussi operativi, notifiche, template email — tutto è personalizzabile senza toccare codice." },
  ];

  const navLinks = [
    { href: "#industries", label: "Settori" },
    { href: "#services", label: "Funzionalità" },
    { href: "#pricing", label: "Prezzi" },
    { href: "#partner", label: "Partner" },
  ];

  const whyUs = [
    { icon: <Cpu className="w-5 h-5" />, title: "Tecnologia Proprietaria", desc: "Stack tecnologico sviluppato internamente. Non rivendiamo software altrui." },
    { icon: <Workflow className="w-5 h-5" />, title: "Automazione Totale", desc: "Ogni processo ripetitivo viene eliminato. Dal primo contatto alla fatturazione." },
    { icon: <Gauge className="w-5 h-5" />, title: "Performance Garantite", desc: "99.9% uptime, <200ms latenza, scaling automatico fino a milioni di utenti." },
    { icon: <ServerCog className="w-5 h-5" />, title: "Aggiornamenti Continui", desc: "Nuove funzionalità ogni settimana. Il tuo sistema non invecchia mai." },
    { icon: <Database className="w-5 h-5" />, title: "I Tuoi Dati, Per Sempre", desc: "Proprietà totale dei dati. Esporta tutto in qualsiasi momento. Zero lock-in." },
    { icon: <Headphones className="w-5 h-5" />, title: "Supporto Dedicato", desc: "Team italiano disponibile 7/7. Non un chatbot, persone vere che risolvono." },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative noise-overlay">

      {/* ═══════ AMBIENT BACKGROUND ═══════ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 aurora-mesh opacity-25" />
        {/* Large violet ambient orbs */}
        <div className="absolute w-[700px] h-[700px] rounded-full blur-[250px] opacity-[0.06] bg-primary -top-[200px] left-1/4 animate-float-glow" />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[200px] opacity-[0.04] bg-accent top-[50vh] -right-[100px] animate-float-glow-slow" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[180px] opacity-[0.035] top-[80vh] left-[10%] animate-float-glow-delay"
          style={{ background: "hsl(280, 45%, 60%)" }} />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[150px] opacity-[0.03] top-[120vh] right-[20%]"
          style={{ background: "hsl(265, 60%, 50%)" }} />
        {/* Particles */}
        <Particle delay={0} size={2} x="10%" y="30%" />
        <Particle delay={1} size={3} x="85%" y="20%" />
        <Particle delay={2} size={3} x="70%" y="60%" />
        <Particle delay={0.5} size={2} x="25%" y="75%" />
        <Particle delay={1.5} size={2} x="50%" y="45%" />
        <Particle delay={3} size={2} x="90%" y="80%" />
        <Particle delay={2.2} size={2} x="15%" y="55%" />
        <Particle delay={0.8} size={3} x="60%" y="15%" />
        {/* Subtle global data rain */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`global-rain-${i}`} className="absolute top-0 w-px opacity-[0.08]"
            style={{
              left: `${15 + i * 18}%`,
              height: "80px",
              background: "linear-gradient(180deg, transparent, hsla(265, 70%, 60%, 0.3), transparent)",
              animation: `data-rain ${6 + i * 2}s linear infinite`,
              animationDelay: `${i * 1.5}s`,
            }} />
        ))}
      </div>

      {/* ═══════ NAVIGATION ═══════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navScrolled ? "bg-background/70 backdrop-blur-xl border-b border-border/10 py-1.5" : "py-2.5"}`}>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex items-center justify-between h-11">
          <a href="#hero" className="flex items-center gap-2 group">
            <motion.div
              className="relative w-8 h-8 rounded-xl bg-vibrant-gradient flex items-center justify-center shadow-[0_0_25px_hsla(265,70%,60%,0.3)] overflow-hidden"
              whileHover={{ rotate: 8, scale: 1.1 }}
              animate={{ boxShadow: ["0 0 20px hsla(265,70%,60%,0.2)", "0 0 35px hsla(265,70%,60%,0.45)", "0 0 20px hsla(265,70%,60%,0.2)"] }}
              transition={{ boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 pointer-events-none" />
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="w-4 h-4 text-primary-foreground drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
              </motion.div>
            </motion.div>
            <span className="font-heading font-bold text-xs tracking-[0.15em] uppercase text-foreground">
              Empire<span className="text-shimmer">.AI</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map(link => (
              <a key={link.href} href={link.href}
                className="relative text-[0.75rem] font-medium text-foreground/40 hover:text-foreground transition-colors duration-300 tracking-wide group">
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-vibrant-gradient group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <motion.button
              onClick={() => scrollTo("contact")}
              className="px-5 py-1.5 rounded-full bg-vibrant-gradient text-primary-foreground text-[0.7rem] font-bold font-heading tracking-wider uppercase"
              whileHover={{ scale: 1.03, boxShadow: "0 8px 30px hsla(265,70%,60%,0.25)" }}
              whileTap={{ scale: 0.97 }}
            >
              Inizia Ora
            </motion.button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-1.5 text-foreground" aria-label="Menu">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-background/95 backdrop-blur-2xl border-t border-border/10 overflow-hidden">
              <div className="flex flex-col items-center gap-0.5 py-3 px-5">
                {navLinks.map(link => (
                  <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-xs font-medium text-foreground/50 hover:text-foreground transition-colors font-heading tracking-widest uppercase">
                    {link.label}
                  </a>
                ))}
                <button onClick={() => { scrollTo("contact"); setMobileMenuOpen(false); }}
                  className="mt-2 w-full py-2.5 rounded-xl bg-vibrant-gradient text-primary-foreground text-xs font-bold tracking-widest uppercase font-heading">
                  Inizia Ora
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO
         ═══════════════════════════════════════════ */}
      <motion.section ref={heroRef} id="hero" className="relative min-h-[100dvh] flex items-center overflow-hidden px-5 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16"
        style={{ opacity: heroOpacity }}>

        {/* ═══ LAYER 0: Video background — very subtle ═══ */}
        <div className="absolute inset-0">
          <video src={videoHero} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-[0.18]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        {/* ═══ LAYER 1: Minimal perspective grid ═══ */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-[50vh] origin-bottom"
            style={{
              backgroundImage: `linear-gradient(hsla(42, 80%, 55%, 0.03) 1px, transparent 1px), linear-gradient(90deg, hsla(265, 70%, 60%, 0.03) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute bottom-[25vh] left-0 right-0 h-[1px] opacity-30" style={{ background: "linear-gradient(90deg, transparent 15%, hsla(42, 80%, 55%, 0.2) 50%, transparent 85%)" }} />
        </div>

        {/* ═══ LAYER 2: Dual ambient glow — violet + gold ═══ */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full blur-[200px] opacity-[0.08]"
            style={{ background: "radial-gradient(circle, hsl(265, 70%, 55%), transparent 70%)" }} />
        </div>
        <div className="absolute top-[30%] left-[35%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full blur-[180px] opacity-[0.06]"
            style={{ background: "radial-gradient(circle, hsl(42, 80%, 55%), transparent 70%)" }} />
        </div>

        {/* ═══ LAYER 3: Crown icon — gold pulse ═══ */}
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
            style={{ background: "radial-gradient(circle, hsla(42, 80%, 55%, 0.1) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Crown className="w-7 h-7 sm:w-9 sm:h-9 drop-shadow-[0_0_20px_hsla(42,80%,55%,0.4)]" style={{ color: "hsl(42, 80%, 60%)" }} />
          </motion.div>
        </div>

        {/* ═══ LAYER 4: Gold corner accents ═══ */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[80px] h-[1px]" style={{ background: "linear-gradient(90deg, hsla(42,80%,55%,0.25), transparent)" }} />
          <div className="absolute top-0 left-0 w-[1px] h-[80px]" style={{ background: "linear-gradient(180deg, hsla(42,80%,55%,0.25), transparent)" }} />
          <div className="absolute top-0 right-0 w-[80px] h-[1px]" style={{ background: "linear-gradient(270deg, hsla(42,80%,55%,0.25), transparent)" }} />
          <div className="absolute top-0 right-0 w-[1px] h-[80px]" style={{ background: "linear-gradient(180deg, hsla(42,80%,55%,0.25), transparent)" }} />
        </div>

        {/* ═══ Gold vertical light beam ═══ */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[30vh]" style={{ background: "linear-gradient(180deg, hsla(42, 80%, 55%, 0.3), hsla(265, 70%, 60%, 0.1), transparent)" }} />

        <motion.div className="relative z-10 max-w-[1100px] mx-auto w-full" style={{ y: heroY, scale: heroScale }}>
          <div className="flex flex-col items-center text-center max-w-[900px] mx-auto">

            {/* Clean badge — gold accent */}
            <motion.div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-gold/10 bg-gold/[0.03] backdrop-blur-sm mb-7"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[0.6rem] font-heading font-semibold text-gold/80 tracking-[2px] uppercase">Il Sistema Operativo per il Tuo Business</span>
            </motion.div>

            {/* Headline — gold shimmer */}
            <motion.h1 className="text-[2.2rem] leading-[1.05] sm:text-[3.5rem] md:text-[4.2rem] lg:text-[5rem] font-heading font-bold tracking-[-0.03em]"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: smoothEase }}>
              <span className="text-foreground">Modernizziamo</span>
              <br />
              <span className="text-gold-shimmer">Qualsiasi Business</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p className="mt-5 sm:mt-6 text-sm sm:text-lg text-foreground/45 max-w-[560px] leading-[1.7] sm:leading-[1.8] font-light px-2 sm:px-0"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}>
              La piattaforma AI più completa al mondo.
              <span className="text-foreground/60 font-normal"> 25+ settori, automazione totale, app white-label, zero commissioni predatorie.</span>
            </motion.p>

            {/* CTA */}
            <motion.div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-2 sm:px-0"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
              <motion.button
                onClick={() => scrollTo("pricing")}
                className="group relative w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gold-gradient text-deep-black font-bold text-sm font-heading tracking-wider uppercase overflow-hidden"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 40px hsla(42,80%,55%,0.25)" }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-foreground/0 via-foreground/10 to-foreground/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  Prenota Demo Gratuita <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              <motion.button
                onClick={() => navigate("/demo")}
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full border border-foreground/8 text-foreground/60 text-sm font-semibold font-heading tracking-wide hover:border-primary/20 hover:text-foreground hover:bg-primary/[0.03] transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.01 }}
              >
                <Play className="w-4 h-4 text-primary/60" /> Vedi Demo Live
              </motion.button>
            </motion.div>

            {/* Metrics — clean minimal cards */}
            <motion.div className="mt-16 w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
              {metrics.map((m, i) => (
                <motion.div key={i} className="rounded-2xl p-4 sm:p-5 text-center border border-gold/[0.08] bg-deep-black/40 backdrop-blur-sm"
                  whileHover={{ y: -3, borderColor: "hsla(42, 80%, 55%, 0.15)" }}
                  transition={{ duration: 0.2 }}>
                  <p className="text-2xl sm:text-3xl font-heading font-bold text-gold-gradient">
                    <AnimatedNumber value={m.value} prefix={m.prefix} suffix={m.suffix} />
                  </p>
                  <p className="text-[0.6rem] text-foreground/30 mt-1.5 tracking-[2px] uppercase font-heading">{m.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <span className="text-[8px] text-gold-muted/40 tracking-[4px] uppercase font-heading">Scopri</span>
          <div className="w-5 h-8 rounded-full border border-gold/15 flex items-start justify-center p-1">
            <motion.div className="w-1 h-1.5 rounded-full bg-gold/50"
              animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
          </div>
        </motion.div>
      </motion.section>

      {/* ═══════ TRUST MARQUEE ═══════ */}
      <div className="relative py-5 border-y border-gold/[0.08] overflow-hidden bg-deep-black/60 backdrop-blur-sm">
        <div className="flex animate-marquee-scroll whitespace-nowrap">
          {[...Array(2)].map((_, repeat) => (
            <div key={repeat} className="flex items-center gap-12 px-6">
              {[
                { icon: <CreditCard className="w-3 h-3" />, text: "Stripe Connect" },
                { icon: <Lock className="w-3 h-3" />, text: "AES-256" },
                { icon: <Smartphone className="w-3 h-3" />, text: "PWA Certified" },
                { icon: <Shield className="w-3 h-3" />, text: "GDPR Compliant" },
                { icon: <Zap className="w-3 h-3" />, text: "99.9% Uptime" },
                { icon: <Cpu className="w-3 h-3" />, text: "AI-Powered" },
                { icon: <MapPin className="w-3 h-3" />, text: "Made in Italy" },
                { icon: <Fingerprint className="w-3 h-3" />, text: "White Label" },
                { icon: <Globe className="w-3 h-3" />, text: "25+ Settori" },
                { icon: <Timer className="w-3 h-3" />, text: "Attivo in 24h" },
                { icon: <LineChart className="w-3 h-3" />, text: "Updates Settimanali" },
              ].map((t, i) => (
                <span key={i} className="text-[0.6rem] text-foreground/20 font-heading tracking-[3px] uppercase flex items-center gap-2">
                  <span className="text-gold/35">{t.icon}</span>
                  {t.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          IL PROBLEMA — Pain Points
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="text-center mb-10 sm:mb-14">
          <SectionLabel text="Il Problema" icon={<AlertTriangle className="w-3 h-3 text-accent" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Il Tuo Business Sta <span className="text-shimmer">Perdendo Soldi</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[550px] mx-auto text-sm leading-[1.7]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Ogni giorno senza un sistema moderno è un giorno di clienti persi, processi lenti e margini erosi.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {[
            { icon: <Banknote className="w-5 h-5" />, title: "30% di Commissioni", desc: "Le piattaforme terze divorano i tuoi margini. Su €10.000/mese perdi €3.000 in commissioni.", stat: "-30%", color: "from-red-500 to-orange-500" },
            { icon: <Users className="w-5 h-5" />, title: "Clienti Non Fidelizzati", desc: "Senza CRM e loyalty, il 70% dei clienti non torna. Paghi per acquisirli ma non li trattieni.", stat: "70%", color: "from-amber-500 to-yellow-500" },
            { icon: <Smartphone className="w-5 h-5" />, title: "Zero Presenza Digitale", desc: "I tuoi competitor hanno app, ordini online, prenotazioni. Tu stai ancora usando carta e WhatsApp.", stat: "0 App", color: "from-orange-500 to-red-500" },
            { icon: <ClipboardCheck className="w-5 h-5" />, title: "Processi Manuali", desc: "Ordini a voce, prenotazioni su agenda, contabilità su Excel. Ogni errore costa tempo e denaro.", stat: "4h/giorno", color: "from-rose-500 to-pink-500" },
            { icon: <Eye className="w-5 h-5" />, title: "Recensioni Incontrollate", desc: "Una sola recensione negativa su Google può costare migliaia di euro in clienti persi.", stat: "-€5K", color: "from-red-600 to-rose-500" },
            { icon: <Target className="w-5 h-5" />, title: "Marketing Inefficace", desc: "Spendi in pubblicità senza tracciare i risultati. Zero segmentazione, zero automazione, zero ROI.", stat: "0% ROI", color: "from-amber-600 to-orange-500" },
          ].map((pain, i) => (
            <motion.div key={i} className="relative p-6 rounded-2xl border border-accent/10 bg-accent/[0.02] group hover:border-accent/20 transition-all"
              variants={fadeUp} whileHover={{ y: -3 }}>
              <div className="absolute top-2 right-3 text-[0.5rem] font-heading font-bold text-accent/40 tracking-wider">{pain.stat}</div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pain.color} flex items-center justify-center text-white mb-4 opacity-80`}>
                {pain.icon}
              </div>
              <h3 className="font-heading text-sm font-semibold text-foreground mb-2">{pain.title}</h3>
              <p className="text-xs text-foreground/35 leading-[1.7]">{pain.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="mt-10 text-center"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/15 bg-primary/[0.04]">
            <ArrowDown className="w-4 h-4 text-primary animate-bounce" />
            <span className="text-xs font-heading font-semibold text-foreground/60">La Soluzione Esiste. <span className="text-primary">Scoprila Ora.</span></span>
          </div>
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          VIDEO HERO — Business Transformation
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="text-center mb-8">
          <SectionLabel text="Scopri Empire" icon={<Play className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.08] mb-3"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Non Siamo un Software. <span className="text-shimmer">Siamo il Futuro.</span>
          </motion.h2>
          <motion.p className="text-foreground/50 max-w-[520px] mx-auto text-sm leading-[1.7]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Dashboard IA, gestione flotta, menu digitali, CRM avanzato, automazioni, fatturazione, analytics — tutto in un ecosistema white-label che si evolve ogni settimana.
          </motion.p>
        </div>
        <motion.div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden glow-card"
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <div className="absolute -inset-8 bg-primary/[0.05] rounded-[60px] blur-[80px] pointer-events-none" />
          <video src={videoHero} autoPlay muted loop playsInline className="w-full aspect-video object-cover rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none rounded-2xl" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-primary/10">
              <span className="text-[0.6rem] font-heading font-bold text-primary tracking-wider uppercase">Dashboard IA • CRM • Automazioni • Fatturazione</span>
            </div>
          </div>
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          SETTORI
         ═══════════════════════════════════════════ */}
      <Section id="industries">
        <div className="text-center mb-10 sm:mb-12">
          <SectionLabel text="Multi-Settore" icon={<Globe className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Qualsiasi Settore. <span className="text-shimmer">Un Unico Sistema.</span>
          </motion.h2>
          <motion.p className="text-foreground/50 max-w-[550px] mx-auto leading-[1.7] text-sm px-2 sm:px-0"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Empire si adatta automaticamente alla tua industria. Terminologia, moduli, dashboard e flussi operativi cambiano in base al settore.
          </motion.p>
        </div>

        {/* ═══ Mobile: Premium Carousel — iPhone frames ═══ */}
        <div className="sm:hidden">
          <PremiumCarousel speed="normal" itemWidth={160}>
            {industries.map((ind, i) => {
              const slug = DEMO_SLUGS[ind.id];
              const demoPath = ind.id === "food" ? `/r/${slug}` : `/demo/${slug}`;
              return (
                <div key={i} className="group cursor-pointer" onClick={() => navigate(demoPath)}>
                  {/* iPhone shell */}
                  <div className="relative w-[160px] h-[290px] rounded-[28px] border-[2.5px] border-foreground/15 bg-foreground/[0.03] shadow-[0_12px_40px_hsla(0,0%,0%,0.4)] overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]">
                    {/* Notch */}
                    <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[48px] h-[14px] bg-foreground/80 rounded-full z-20" />
                    {/* Inner screen */}
                    <div className="absolute inset-[3px] rounded-[24px] overflow-hidden flex flex-col items-center justify-center text-center p-4 pt-7"
                      style={{ background: `linear-gradient(160deg, hsl(var(--background)), hsl(var(--card)))` }}>
                      {/* Gradient glow */}
                      <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${ind.gradient} opacity-10 rounded-t-[24px]`} />
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="relative mb-3">
                          {/* Outer glow ring */}
                          <div className={`absolute -inset-1.5 rounded-2xl bg-gradient-to-br ${ind.gradient} opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-700 animate-pulse`} />
                          {/* Logo container */}
                          <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${ind.gradient} flex items-center justify-center text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-all duration-500 overflow-hidden`}>
                            {/* Shimmer sweep */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            {/* Inner border luxury */}
                            <div className="absolute inset-[1.5px] rounded-[14px] border border-white/20" />
                            <span className="relative z-10 drop-shadow-md">{ind.icon}</span>
                          </div>
                          {/* Gold accent dot */}
                          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_6px_rgba(217,170,56,0.6)] z-30" />
                        </div>
                        <h3 className="font-heading text-[11px] font-bold text-foreground mb-1 leading-tight">{ind.title}</h3>
                        <p className="text-[8px] text-foreground/35 leading-[1.4] mb-2 px-1">{ind.desc}</p>
                        <p className="text-[7px] text-primary/50 font-heading tracking-wider mb-3">{ind.modules}</p>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary/70 group-hover:text-primary transition-colors">
                          Demo <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                    {/* Home indicator */}
                    <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[40px] h-[4px] bg-foreground/20 rounded-full z-20" />
                  </div>
                </div>
              );
            })}
          </PremiumCarousel>
        </div>

        {/* ═══ Desktop: iPhone Grid ═══ */}
        <motion.div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 justify-items-center"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {industries.map((ind, i) => {
            const slug = DEMO_SLUGS[ind.id];
            const demoPath = ind.id === "food" ? `/r/${slug}` : `/demo/${slug}`;
            return (
              <motion.div key={i}
                className="group cursor-pointer"
                variants={fadeScale}
                onClick={() => navigate(demoPath)}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                {/* iPhone shell */}
                <div className="relative w-[180px] h-[340px] rounded-[32px] border-[2.5px] border-foreground/15 bg-foreground/[0.03] shadow-[0_16px_50px_hsla(0,0%,0%,0.45)] overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_20px_60px_hsla(265,70%,60%,0.15)]">
                  {/* Notch */}
                  <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[54px] h-[16px] bg-foreground/80 rounded-full z-20" />
                  {/* Inner screen */}
                  <div className="absolute inset-[3px] rounded-[28px] overflow-hidden flex flex-col items-center justify-center text-center p-5 pt-8"
                    style={{ background: `linear-gradient(160deg, hsl(var(--background)), hsl(var(--card)))` }}>
                    {/* Gradient glow */}
                    <div className={`absolute top-0 left-0 right-0 h-28 bg-gradient-to-b ${ind.gradient} opacity-[0.08] rounded-t-[28px]`} />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="relative mb-4">
                        {/* Outer glow ring */}
                        <div className={`absolute -inset-2 rounded-2xl bg-gradient-to-br ${ind.gradient} opacity-25 blur-lg group-hover:opacity-50 transition-opacity duration-700 animate-pulse`} />
                        {/* Logo container */}
                        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${ind.gradient} flex items-center justify-center text-white shadow-[0_6px_24px_rgba(0,0,0,0.35)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 overflow-hidden`}>
                          {/* Shimmer sweep */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          {/* Inner border luxury */}
                          <div className="absolute inset-[2px] rounded-[14px] border border-white/20" />
                          <span className="relative z-10 drop-shadow-md">{ind.icon}</span>
                        </div>
                        {/* Gold accent dot */}
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_8px_rgba(217,170,56,0.6)] z-30" />
                      </div>
                      <h3 className="font-heading text-sm font-bold text-foreground mb-1.5">{ind.title}</h3>
                      <p className="text-[10px] text-foreground/35 leading-[1.5] mb-2">{ind.desc}</p>
                      <p className="text-[8px] text-primary/50 font-heading tracking-wider mb-4">{ind.modules}</p>
                      <motion.span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary/60 group-hover:text-primary transition-colors"
                        whileHover={{ x: 3 }}>
                        Vedi Demo <ArrowRight className="w-3 h-3" />
                      </motion.span>
                    </div>
                  </div>
                  {/* Home indicator */}
                  <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[44px] h-[4px] bg-foreground/20 rounded-full z-20" />
                </div>
              </motion.div>
            );
          })}
          <motion.div
            className="group cursor-pointer"
            variants={fadeScale}
            onClick={() => scrollTo("contact")}
            whileHover={{ y: -4 }}
          >
            <div className="relative w-[180px] h-[340px] rounded-[32px] border-[2.5px] border-dashed border-foreground/10 hover:border-primary/20 transition-all duration-500 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-7 h-7 text-foreground/15 mb-3 group-hover:text-primary/60 transition-colors" />
              <p className="text-xs font-heading font-semibold text-foreground/35 group-hover:text-foreground/60 transition-colors">+18 altri settori</p>
              <p className="text-[0.6rem] text-primary/40 mt-1.5">Scopri tutti →</p>
            </div>
          </motion.div>
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          AI AGENTS SHOWCASE
         ═══════════════════════════════════════════ */}
      <AIAgentsShowcase />

      <SectionDivider />

      {/*
          VIDEO INDUSTRIES + WHY US
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }} className="text-center lg:text-left order-2 lg:order-1">
            <SectionLabel text="Perché Empire" icon={<Crown className="w-3 h-3 text-accent" />} />
            <h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-heading font-bold text-foreground leading-[1.08] mb-5">
              I Più Completi. <span className="text-shimmer">I Più Avanzati.</span>
            </h2>
            <p className="text-foreground/40 text-sm leading-[1.7] mb-6 max-w-md mx-auto lg:mx-0">
              Non siamo un gestionale generico. Siamo un ecosistema AI che modernizza, digitalizza e automatizza qualsiasi tipo di attività. Sempre in evoluzione, sempre un passo avanti.
            </p>
            <div className="space-y-3 max-w-md mx-auto lg:mx-0">
              {[
                { title: "25+ Settori Supportati", desc: "Ogni industria ha moduli dedicati che si attivano automaticamente" },
                { title: "Aggiornamenti Settimanali", desc: "Nuove funzionalità ogni settimana senza costi aggiuntivi" },
                { title: "IA Integrata Ovunque", desc: "Generazione catalogo, analytics predittivi, automazioni intelligenti" },
                { title: "100% White Label", desc: "Il tuo brand, i tuoi colori, il tuo dominio. Zero marchi terzi" },
              ].map((f, i) => (
                <motion.div key={i} className="flex gap-3 items-start group"
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="w-5 h-5 min-w-[20px] rounded-full bg-primary/15 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">{f.title}</p>
                    <p className="text-[0.65rem] text-foreground/35 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }} className="order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden glow-card">
              <img src={heroTechCommand} alt="Empire AI Command Center" className="w-full aspect-video object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-l from-background/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="text-center mb-10 sm:mb-12">
          <SectionLabel text="Vantaggi" icon={<Zap className="w-3 h-3 text-accent" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Perché Siamo <span className="text-shimmer">N°1 al Mondo</span>
          </motion.h2>
        </div>

        {/* ═══ Mobile: Premium Carousel ═══ */}
        <div className="sm:hidden">
          <PremiumCarousel speed="fast" itemWidth={220}>
            {whyUs.map((item, i) => (
              <div key={i} className="group relative p-5 rounded-2xl h-full overflow-hidden border border-border/10 bg-card/60 backdrop-blur-sm">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                {/* Corner glow */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/[0.06] blur-2xl group-hover:bg-primary/[0.12] transition-all duration-700" />
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center text-primary mb-3 ring-1 ring-primary/10 group-hover:scale-110 group-hover:ring-primary/25 transition-all duration-500">
                    {item.icon}
                  </div>
                  <h3 className="font-heading text-xs font-bold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-[0.65rem] text-foreground/40 leading-[1.6]">{item.desc}</p>
                </div>
              </div>
            ))}
          </PremiumCarousel>
        </div>

        {/* ═══ Desktop: Grid ═══ */}
        <motion.div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {whyUs.map((item, i) => (
            <motion.div key={i}
              className="group relative p-7 rounded-2xl overflow-hidden border border-border/10 bg-card/60 backdrop-blur-sm"
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Corner glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/[0.05] blur-3xl group-hover:bg-primary/[0.12] transition-all duration-700" />
              <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-accent/[0.04] blur-2xl group-hover:bg-accent/[0.08] transition-all duration-700" />
              {/* Number watermark */}
              <span className="absolute top-3 right-4 text-[3rem] font-heading font-black text-foreground/[0.03] leading-none select-none group-hover:text-primary/[0.06] transition-colors duration-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center text-primary mb-5 ring-1 ring-primary/10 group-hover:scale-110 group-hover:rotate-3 group-hover:ring-primary/25 group-hover:shadow-[0_0_20px_hsla(265,85%,65%,0.15)] transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="font-heading text-sm font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-foreground/40 leading-[1.7]">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Duplicate pain section removed — already present above */}

      {/* ═══════════════════════════════════════════
          COMPARISON TABLE — Empire vs Others
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="text-center mb-10">
          <SectionLabel text="Confronto" icon={<Activity className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-heading font-bold text-foreground leading-[1.08] mb-3"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Empire vs <span className="text-shimmer">Tutto il Resto</span>
          </motion.h2>
        </div>
        <motion.div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl glow-card"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {/* Header */}
          <div className="grid grid-cols-3 pb-3 border-b border-border/50 mb-1">
            <span className="text-[0.6rem] font-heading text-foreground/30 tracking-wider uppercase">Funzionalità</span>
            <span className="text-center text-[0.6rem] font-heading font-bold text-primary tracking-wider uppercase">Empire.AI</span>
            <span className="text-center text-[0.6rem] font-heading text-foreground/30 tracking-wider uppercase">Altri</span>
          </div>
          <CompRow label="Costo mensile" empire="€0/mese" others="€200-500/mese" />
          <CompRow label="Commissioni" empire="Solo 2%" others="15-30%" />
          <CompRow label="Settori supportati" empire="25+" others="1-3" />
          <CompRow label="App White Label" empire="Inclusa" others="€extra/mese" />
          <CompRow label="IA Integrata" empire="Completa" others="Base o assente" />
          <CompRow label="Proprietà dati" empire="100% tuoi" others="Del provider" />
          <CompRow label="Aggiornamenti" empire="Settimanali" others="Trimestrali" />
          <CompRow label="Supporto" empire="7/7 dedicato" others="Email lenta" />
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          TECH DNA — Neural Network Visualization
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="text-center mb-10 sm:mb-14">
          <SectionLabel text="Tecnologia" icon={<Cpu className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Il DNA Tecnologico di <span className="text-shimmer">Empire</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[550px] mx-auto text-sm leading-[1.7]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Un'architettura neurale che connette ogni modulo in tempo reale. Non software separati — un organismo digitale vivente.
          </motion.p>
        </div>

        {/* Neural Network Visualization */}
        <motion.div className="relative max-w-3xl mx-auto h-[280px] sm:h-[350px] rounded-2xl overflow-hidden holo-panel"
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          
          {/* Animated grid background */}
          <div className="absolute inset-0 animated-grid-bg opacity-30" />
          
          {/* Neural nodes */}
          {[
            { x: "50%", y: "50%", label: "AI CORE", size: 16, primary: true },
            { x: "20%", y: "25%", label: "CRM", size: 10, primary: false },
            { x: "80%", y: "25%", label: "ORDINI", size: 10, primary: false },
            { x: "15%", y: "70%", label: "ANALYTICS", size: 10, primary: false },
            { x: "85%", y: "70%", label: "PAGAMENTI", size: 10, primary: false },
            { x: "35%", y: "15%", label: "CATALOGO", size: 8, primary: false },
            { x: "65%", y: "15%", label: "BOOKING", size: 8, primary: false },
            { x: "35%", y: "85%", label: "STAFF", size: 8, primary: false },
            { x: "65%", y: "85%", label: "MARKETING", size: 8, primary: false },
          ].map((node, i) => (
            <motion.div key={i} className="absolute flex flex-col items-center z-10"
              style={{ left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 200 }}>
              <div
                className={`rounded-full neural-node ${node.primary ? "bg-gradient-to-br from-primary to-accent" : "bg-gradient-to-br from-primary/40 to-accent/20"}`}
                style={{
                  width: node.size * (node.primary ? 1.5 : 1),
                  height: node.size * (node.primary ? 1.5 : 1),
                  "--node-delay": `${i * 0.3}s`,
                  boxShadow: node.primary
                    ? "0 0 30px hsla(265,85%,65%,0.6), 0 0 60px hsla(265,85%,65%,0.3)"
                    : "0 0 12px hsla(265,85%,65%,0.3)",
                } as React.CSSProperties}
              />
              <span className={`mt-1.5 text-[6px] sm:text-[8px] font-heading font-bold tracking-[2px] uppercase ${node.primary ? "text-primary" : "text-foreground/30"}`}>
                {node.label}
              </span>
            </motion.div>
          ))}

          {/* Connection lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {[
              { x1: "50%", y1: "50%", x2: "20%", y2: "25%" },
              { x1: "50%", y1: "50%", x2: "80%", y2: "25%" },
              { x1: "50%", y1: "50%", x2: "15%", y2: "70%" },
              { x1: "50%", y1: "50%", x2: "85%", y2: "70%" },
              { x1: "50%", y1: "50%", x2: "35%", y2: "15%" },
              { x1: "50%", y1: "50%", x2: "65%", y2: "15%" },
              { x1: "50%", y1: "50%", x2: "35%", y2: "85%" },
              { x1: "50%", y1: "50%", x2: "65%", y2: "85%" },
            ].map((line, i) => (
              <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="url(#neural-gradient)" strokeWidth="1" opacity="0.25"
                strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="8" to="0" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
              </line>
            ))}
            <defs>
              <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsla(265, 70%, 60%, 0.6)" />
                <stop offset="100%" stopColor="hsla(280, 50%, 65%, 0.4)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating data packets along connections */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={`packet-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary z-20"
              style={{
                left: "50%", top: "50%",
                boxShadow: "0 0 8px hsla(265,70%,60%,0.8)",
              }}
              animate={{
                x: [0, (Math.cos(i * Math.PI / 3) * 150)],
                y: [0, (Math.sin(i * Math.PI / 3) * 120)],
                opacity: [1, 0],
                scale: [1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            />
          ))}

          {/* HUD corners */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-primary/30 rounded-tl" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-primary/30 rounded-tr" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-primary/30 rounded-bl" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-primary/30 rounded-br" />

          {/* Tech readout overlays */}
          <div className="absolute top-3 left-10 text-[6px] sm:text-[8px] font-heading font-bold text-primary/40 tracking-[3px] uppercase">
            NEURAL MESH v4.2
          </div>
          <div className="absolute bottom-3 right-10 text-[6px] sm:text-[8px] font-heading text-foreground/15 tracking-wider">
            NODES: 9 • LATENCY: &lt;2ms • STATUS: <span className="text-emerald-400/60">OPTIMAL</span>
          </div>
        </motion.div>

        {/* Tech specs row */}
        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-3xl mx-auto"
          variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {[
            { label: "Architettura", value: "Edge-First", icon: <Wifi className="w-3.5 h-3.5" /> },
            { label: "Crittografia", value: "AES-256", icon: <Lock className="w-3.5 h-3.5" /> },
            { label: "Deploy", value: "< 24h", icon: <Zap className="w-3.5 h-3.5" /> },
            { label: "Evoluzione", value: "Settimanale", icon: <Radio className="w-3.5 h-3.5" /> },
          ].map((spec, i) => (
            <motion.div key={i} className="p-4 rounded-xl holo-panel text-center" variants={popIn}>
              <div className="text-primary/50 mb-2 flex justify-center">{spec.icon}</div>
              <p className="text-xs font-heading font-bold text-foreground">{spec.value}</p>
              <p className="text-[0.55rem] text-foreground/30 mt-0.5 tracking-wider uppercase">{spec.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          3 INTERFACCE — Mockup Showcase
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="text-center mb-10 sm:mb-14">
          <SectionLabel text="Esperienza" icon={<MonitorSmartphone className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            3 Interfacce, <span className="text-shimmer">Un Ecosistema</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[550px] mx-auto text-sm leading-[1.7]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Ogni attore ha la sua interfaccia dedicata. Cliente, proprietario e staff operano in sinergia perfetta.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {[
            { img: mockupCliente, title: "App Cliente", desc: "Prenota, ordina, paga e ricevi notifiche. Un'esperienza premium per i clienti di qualsiasi settore.", tag: "FRONT-END", features: ["Prenotazioni & Ordini", "Loyalty & Cashback", "Push Notification", "Chat Diretta"] },
            { img: mockupAdmin, title: "Dashboard Admin", desc: "Pannello completo con analytics IA, CRM, gestione team, fatturazione e marketing automation per ogni settore.", tag: "BACK-OFFICE", features: ["Analytics predittivi", "CRM & Segmentazione", "Fatturazione elettronica", "Marketing automatizzato"] },
            { img: mockupCucina, title: "Pannello Operativo", desc: "Vista operativa real-time: gestisci interventi, appuntamenti, flotta, staff e postazioni dal campo.", tag: "OPERATIONS", features: ["Live tracking operativo", "Gestione turni & team", "Compliance & controlli", "Notifiche smart"] },
          ].map((mock, i) => (
            <motion.div key={i} className="group" variants={fadeScale}>
              <div className="relative rounded-2xl overflow-hidden glow-card mb-5">
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full holo-badge text-[0.5rem] font-heading font-bold text-primary/70 tracking-[2px]">{mock.tag}</div>
                <img src={mock.img} alt={mock.title} className="w-full aspect-[4/3] object-cover group-hover:scale-[1.03] transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-heading text-base font-bold text-foreground mb-1">{mock.title}</h3>
                  <p className="text-[0.65rem] text-foreground/40 leading-[1.6]">{mock.desc}</p>
                </div>
              </div>
              <div className="space-y-2 px-1">
                {mock.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2.5 text-xs text-foreground/40">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          VIDEO FEATURES
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <div className="relative rounded-2xl overflow-hidden glow-card">
              <img src={heroAiPlatform} alt="Empire AI Platform" className="w-full aspect-video object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }} className="text-center lg:text-left">
            <SectionLabel text="Capacità" icon={<Cpu className="w-3 h-3 text-primary" />} />
            <h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-heading font-bold text-foreground leading-[1.08] mb-5">
              Creiamo <span className="text-shimmer">Qualsiasi Cosa</span><br />Tu Possa Immaginare
            </h2>
            <div className="space-y-4 text-left max-w-md mx-auto lg:mx-0">
              {[
                { title: "Gestione Telefonica Umana", desc: "Servizio reception e booking telefonico professionale dedicato" },
                { title: "WhatsApp Business Automatizzato", desc: "Conferme, reminder, promozioni e assistenza clienti 24/7" },
                { title: "Intelligenza Artificiale Integrata", desc: "Catalogo generato in 60s, suggerimenti upselling, analytics predittivi" },
                { title: "Qualsiasi Integrazione Custom", desc: "API esterne, POS, gestionali esistenti — integriamo tutto" },
              ].map((f, i) => (
                <motion.div key={i} className="flex gap-3 items-start group"
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="w-2 h-2 min-w-[8px] rounded-full bg-primary mt-2" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">{f.title}</p>
                    <p className="text-[0.65rem] text-foreground/35 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          SERVIZI
         ═══════════════════════════════════════════ */}
      <Section id="services">
        <div className="text-center mb-10 sm:mb-12">
          <SectionLabel text="Funzionalità" icon={<Layers className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Tutto Ciò Che Serve,<br className="hidden sm:block" />
            <span className="text-shimmer">in un Unico Posto</span>
          </motion.h2>
          <motion.p className="text-foreground/50 max-w-[500px] mx-auto text-sm leading-[1.7] px-2 sm:px-0"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Ogni modulo è stato progettato per eliminare un problema specifico. Nessun software esterno, nessun costo aggiuntivo.
          </motion.p>
        </div>

        {/* ═══ Mobile: Premium Carousel ═══ */}
        <div className="sm:hidden">
          <PremiumCarousel speed="normal" itemWidth={260}>
            {services.map((s, i) => (
              <div key={i} className="group relative p-5 rounded-2xl glow-card scan-card h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white`}>
                    {s.icon}
                  </div>
                  <span className="text-[0.5rem] px-2 py-0.5 rounded-full holo-badge text-primary/80 font-bold tracking-[2px] font-heading">{s.tag}</span>
                </div>
                <h3 className="font-heading text-xs font-semibold text-foreground mb-1.5">{s.title}</h3>
                <p className="text-[0.65rem] text-foreground/40 leading-[1.6]">{s.desc}</p>
              </div>
            ))}
          </PremiumCarousel>
        </div>

        {/* ═══ Desktop: Grid ═══ */}
        <motion.div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {services.map((s, i) => (
            <motion.div key={i}
              className="group relative p-6 rounded-2xl glow-card scan-card"
              variants={fadeUp}
              whileHover={{ y: -4 }}
            >
              {/* Futuristic corner brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-primary/20 rounded-tl-sm pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-primary/20 rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-primary/20 rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-primary/20 rounded-br-sm pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {s.icon}
                </div>
                <span className="text-[0.55rem] px-2.5 py-1 rounded-full holo-badge text-primary/80 font-bold tracking-[2px] font-heading">{s.tag}</span>
              </div>
              <h3 className="font-heading text-sm sm:text-base font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-xs sm:text-sm text-foreground/40 leading-[1.7]">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
         ═══════════════════════════════════════════ */}
      <Section id="process">
        <div className="text-center mb-12">
          <SectionLabel text="Processo" icon={<Zap className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08]"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Attivo in <span className="text-shimmer">4 Step</span>
          </motion.h2>
        </div>

        <motion.div className="relative grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+36px)] right-[calc(12.5%+36px)] h-px bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 z-0" />
          {[
            { step: "01", title: "Scegli il Settore", desc: "Empire configura moduli e flussi dedicati automaticamente.", icon: <Globe className="w-5 h-5" /> },
            { step: "02", title: "Personalizza Brand", desc: "Logo, colori, dominio. L'IA genera il catalogo in 60 secondi.", icon: <Palette className="w-5 h-5" /> },
            { step: "03", title: "Lancia il Sistema", desc: "App attiva, team formato, QR code installati. Operativo in 24h.", icon: <Rocket className="w-5 h-5" /> },
            { step: "04", title: "Cresci con i Dati", desc: "Analytics real-time, suggerimenti IA, campagne automatizzate.", icon: <TrendingUp className="w-5 h-5" /> },
          ].map((s, i) => (
            <motion.div key={i} className="relative text-center z-10" variants={popIn}>
              <motion.div
                className="relative w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-2xl glow-card flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <div className="text-primary">{s.icon}</div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-vibrant-gradient flex items-center justify-center text-[0.55rem] font-bold text-primary-foreground font-heading">{s.step}</span>
              </motion.div>
              <h3 className="font-heading text-xs sm:text-sm font-bold text-foreground mb-1.5">{s.title}</h3>
              <p className="text-[0.65rem] sm:text-xs text-foreground/40 leading-[1.6]">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          APP SHOWCASE
         ═══════════════════════════════════════════ */}
      <Section id="app">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center lg:text-left order-2 lg:order-1">
            <SectionLabel text="Ecosistema" icon={<MonitorSmartphone className="w-3 h-3 text-primary" />} />
            <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-5">
              Ecosistema Completo,<br /><span className="text-shimmer">di Tua Proprietà</span>
            </h2>
            <p className="text-foreground/40 leading-[1.7] max-w-lg mx-auto lg:mx-0 mb-7 text-sm">
              App cliente, pannello gestionale e vista operativa — tutto white-label con il tuo brand. Dal menu digitale alla gestione flotta, dal CRM alla fatturazione.
            </p>
            <div className="space-y-4 mb-8 text-left max-w-md mx-auto lg:mx-0">
              {[
                { title: "Ordini, Prenotazioni & Appuntamenti", desc: "Un unico sistema per ogni tipo di transazione", icon: <Calendar className="w-3 h-3" /> },
                { title: "CRM & Programma Fedeltà", desc: "Wallet pass, reward, storico cliente completo", icon: <Wallet className="w-3 h-3" /> },
                { title: "Comunicazione Diretta", desc: "Push notification, chat, promozioni mirate", icon: <Bell className="w-3 h-3" /> },
                { title: "Dashboard Operativa Real-Time", desc: "Cucina, autisti, staff — live senza errori", icon: <BarChart3 className="w-3 h-3" /> },
              ].map((f, i) => (
                <motion.div key={i} className="flex gap-3.5 items-start group"
                  initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="w-8 h-8 min-w-[32px] rounded-xl bg-primary/10 flex items-center justify-center mt-0.5 group-hover:bg-primary/20 transition-colors">
                    <span className="text-primary">{f.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-foreground font-semibold">{f.title}</p>
                    <p className="text-[0.65rem] text-foreground/35 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              onClick={() => navigate("/r/impero-roma")}
              className="group px-7 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2"
              whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(265,70%,60%,0.2)" }}
              whileTap={{ scale: 0.97 }}
            >
              Prova la Demo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </motion.div>

          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="order-1 lg:order-2">
            <div className="flex justify-center items-end gap-2 sm:gap-4 relative">
              <div className="absolute -inset-16 bg-primary/[0.04] rounded-[80px] blur-[100px] pointer-events-none" />
              {[
                { label: "Cliente", img: mockupCliente, delay: 0 },
                { label: "Gestionale", img: mockupAdmin, delay: 0.1 },
                { label: "Operativo", img: mockupCucina, delay: 0.2 },
              ].map((phone, i) => {
                const isCenter = i === 1;
                return (
                  <motion.div key={i}
                    className="relative"
                    initial={{ y: 30 + i * 10, opacity: 0 }}
                    whileInView={{ y: isCenter ? -10 : 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + phone.delay, duration: 0.8, ease: smoothEase }}
                    whileHover={{ y: isCenter ? -16 : -6, scale: 1.03 }}
                  >
                    <div className={`relative ${isCenter ? "w-[110px] sm:w-[160px]" : "w-[90px] sm:w-[130px]"} ${isCenter ? "h-[224px] sm:h-[326px]" : "h-[184px] sm:h-[265px]"} rounded-[18px] sm:rounded-[24px] border-[2px] border-foreground/15 bg-foreground/5 shadow-[0_20px_60px_hsla(0,0%,0%,0.5)] overflow-hidden`}>
                      <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[36px] h-[11px] sm:w-[50px] sm:h-[14px] bg-foreground rounded-full z-20" />
                      <div className="absolute inset-[2px] rounded-[16px] sm:rounded-[22px] overflow-hidden">
                        <img src={phone.img} alt={phone.label} className="w-full h-full object-cover object-top" loading="lazy" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none z-10" />
                      <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[36px] h-[3px] bg-foreground/25 rounded-full z-20" />
                    </div>
                    <p className="text-center text-[0.5rem] sm:text-[0.55rem] font-heading font-bold tracking-[2px] uppercase text-foreground/50 mt-2">{phone.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          ROI CALCULATOR
         ═══════════════════════════════════════════ */}
      <Section id="calculator">
        <div className="text-center mb-12">
          <SectionLabel text="ROI Calculator" icon={<TrendingUp className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Calcola Quanto <span className="text-shimmer">Stai Perdendo</span>
          </motion.h2>
        </div>

        <motion.div className="max-w-xl mx-auto p-7 sm:p-9 rounded-2xl glow-card space-y-6"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {[
            { label: "Transazioni / mese", value: monthlyOrders, min: 100, max: 3000, step: 50, display: monthlyOrders.toString(), onChange: setMonthlyOrders },
            { label: "Valore medio", value: avgOrder, min: 10, max: 80, step: 5, display: `€${avgOrder}`, onChange: setAvgOrder },
          ].map((sl, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-foreground/40 font-heading text-xs tracking-wider uppercase">{sl.label}</span>
                <span className="text-foreground font-bold font-heading text-sm">{sl.display}</span>
              </div>
              <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.value}
                onChange={e => sl.onChange(Number(e.target.value))} className="w-full" />
            </div>
          ))}

          <div className="space-y-3.5 pt-6 border-t border-border/30">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-foreground/35">Piattaforme terze (30%)</span>
                <span className="text-accent font-heading font-bold">-€{thirdPartyCost.toLocaleString("it-IT", { maximumFractionDigits: 0 })}/mese</span>
              </div>
              <div className="h-3 rounded-full bg-foreground/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-accent/50 to-accent/80"
                  initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-foreground/35">Empire (2%)</span>
                <span className="text-primary font-heading font-bold">-€{empireCost.toLocaleString("it-IT", { maximumFractionDigits: 0 })}/mese</span>
              </div>
              <div className="h-3 rounded-full bg-foreground/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-primary/50 to-primary/80"
                  initial={{ width: 0 }} whileInView={{ width: `${Math.max(5, (empireCost / thirdPartyCost) * 100)}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/[0.06] to-accent/[0.03] border border-primary/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-foreground/50 font-heading">Risparmi / mese</span>
              <span className="text-2xl font-heading font-bold text-primary">€{monthlySaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-foreground/50 font-heading">Risparmi / anno</span>
              <span className="text-2xl font-heading font-bold text-vibrant-gradient">€{yearSaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-primary/10">
              <span className="text-[0.65rem] text-foreground/35">ROI completo in</span>
              <span className="text-foreground font-heading font-bold text-base">{roiMonths} {roiMonths === 1 ? "mese" : "mesi"}</span>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS — Auto-scroll carousel
         ═══════════════════════════════════════════ */}
      <Section id="testimonials">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, hsl(265,70%,60%), transparent 70%)" }} />
        </div>

        <div className="text-center mb-14 sm:mb-16">
          <SectionLabel text="Storie di Successo" icon={<Star className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Risultati Reali, <span className="text-shimmer">Settori Diversi</span>
          </motion.h2>
          <motion.p className="text-foreground/35 max-w-[440px] mx-auto text-sm leading-relaxed"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-30px" }}>
            Imprenditori come te che hanno trasformato il loro business
          </motion.p>
        </div>

        <PremiumCarousel speed="slow" itemWidth={340} fullWidth>
          {testimonials.map((t, i) => (
            <div key={i} className="group relative h-full">
              {/* Card */}
              <div className="relative p-7 sm:p-8 rounded-2xl h-full flex flex-col border border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-500 group-hover:border-primary/20 group-hover:shadow-[0_0_40px_-12px_hsla(265,70%,60%,0.12)]">
                {/* Top accent line */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                
                {/* Quote icon */}
                <div className="mb-5">
                  <Quote className="w-5 h-5 text-primary/25" />
                </div>

                {/* Testimonial text */}
                <blockquote className="text-[0.8rem] sm:text-sm text-foreground/55 leading-[1.85] mb-6 flex-1">
                  {t.quote}
                </blockquote>

                {/* Metric badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary/[0.06] border border-primary/10 text-[0.65rem] text-primary font-semibold font-heading tracking-wider mb-5 self-start">
                  <TrendingUp className="w-3 h-3" /> {t.metric}
                </div>

                {/* Divider */}
                <div className="h-px bg-border/30 mb-5" />

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-primary/15 bg-primary/[0.05] flex items-center justify-center text-foreground/50 text-xs font-bold font-heading">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-heading text-xs font-semibold text-foreground/80">{t.name}</h4>
                    <p className="text-[0.6rem] text-foreground/30 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </PremiumCarousel>
      </Section>

      {/* ═══════════════════════════════════════════
          PRICING
         ═══════════════════════════════════════════ */}
      <Section id="pricing">
        <div className="text-center mb-12">
          <SectionLabel text="Investimento" icon={<Gem className="w-3 h-3 text-accent" />} />
          <motion.h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Un Solo Pagamento,<br /><span className="text-shimmer">Valore Per Sempre</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[440px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Niente canoni mensili. Niente vincoli. Il tuo asset digitale di proprietà.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {/* Main plan */}
          <motion.div className="relative p-7 sm:p-9 rounded-2xl overflow-hidden border border-gold/20 bg-gradient-to-b from-gold/[0.04] via-deep-black/60 to-background"
            variants={fadeScale} whileHover={{ y: -4 }}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold-gradient" />
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold-gradient text-[0.55rem] font-bold text-deep-black tracking-[2px] font-heading uppercase">Più Scelto</div>
            <span className="text-[0.6rem] font-heading font-semibold text-gold/70 tracking-[3px] uppercase">Pagamento Unico</span>
            <p className="text-5xl sm:text-6xl font-heading font-bold text-foreground mt-3">€2.997</p>
            <p className="text-[0.65rem] text-foreground/35 mt-1.5">IVA 22% inclusa · Una volta sola</p>
            <ul className="mt-7 space-y-3 mb-7">
              {[
                "Asset Digitale di Tua Proprietà",
                "App White Label completa",
                "AI Engine — catalogo in 60s",
                "25+ settori con moduli dedicati",
                "CRM, Loyalty & Push Notification",
                "Analytics & Fatturazione",
                "Review Shield™",
                "Sicurezza AES-256 & GDPR",
                "Aggiornamenti settimanali inclusi",
                "Assistenza dedicata 7/7 a vita",
                "Zero canoni mensili per sempre",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-foreground/50">
                  <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <motion.button onClick={() => navigate("/admin")}
              className="w-full py-4 rounded-full bg-gold-gradient text-deep-black font-bold text-sm font-heading tracking-wider uppercase"
              whileHover={{ scale: 1.02, boxShadow: "0 15px 50px hsla(42,80%,55%,0.3)" }}
              whileTap={{ scale: 0.97 }}
            >
              Inizia il Tuo Impero
            </motion.button>
            <p className="mt-3 text-[0.6rem] text-center text-foreground/25">Dopo: €0/mese · Solo 2% sulle transazioni</p>
          </motion.div>

          {/* Installment plan */}
          <motion.div className="relative p-7 sm:p-9 rounded-2xl glow-card"
            variants={fadeScale} whileHover={{ y: -4 }}>
            <span className="text-[0.6rem] font-heading font-semibold text-foreground/35 tracking-[3px] uppercase">3 Rate Comode</span>
            <p className="text-4xl sm:text-5xl font-heading font-bold text-foreground mt-3">€1.099<span className="text-sm text-foreground/35 font-normal">/mese</span></p>
            <p className="text-[0.65rem] text-foreground/35 mt-1.5">Totale: €3.297 · IVA inclusa</p>
            <ul className="mt-7 space-y-3 mb-7">
              {["Tutte le funzionalità incluse", "Massima flessibilità", "Attivazione immediata", "Cancella quando vuoi"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-foreground/40">
                  <div className="w-5 h-5 rounded-lg bg-foreground/[0.05] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-foreground/35" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <motion.button onClick={() => navigate("/admin")}
              className="w-full py-4 rounded-full border border-primary/15 text-primary font-bold text-sm font-heading tracking-wider uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Scegli 3 Rate
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.p className="text-center mt-7 text-[0.65rem] text-foreground/25 max-w-lg mx-auto"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Dopo l'attivazione: €0/mese · Solo <span className="text-primary font-bold">2%</span> sulle transazioni per infrastruttura, IA e aggiornamenti continui.
        </motion.p>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="text-center mb-8">
          <SectionLabel text="Opportunità" icon={<Play className="w-3 h-3 text-accent" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-heading font-bold text-foreground leading-[1.08] mb-3"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Scopri l'Opportunità <span className="text-shimmer">Partner Empire</span>
          </motion.h2>
        </div>
        <motion.div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden glow-card"
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <img src={heroPartnerLuxury} alt="Empire Partner Program" className="w-full aspect-video object-cover rounded-2xl" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none rounded-2xl" />
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          PARTNER PROGRAM
         ═══════════════════════════════════════════ */}
      <Section id="partner">
        <div className="text-center mb-12">
          <SectionLabel text="Partner Program" icon={<Handshake className="w-3 h-3 text-accent" />} />
          <motion.h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Guadagna Vendendo <span className="text-shimmer">Empire</span>
          </motion.h2>
        </div>

        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
          variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {[
            { value: "€997", label: "Per vendita", icon: <Trophy className="w-5 h-5" /> },
            { value: "€50", label: "Override TL", icon: <Award className="w-5 h-5" /> },
            { value: "€500", label: "Bonus 3 vendite", icon: <Gift className="w-5 h-5" /> },
            { value: "€1.500", label: "Bonus Elite", icon: <Rocket className="w-5 h-5" /> },
          ].map((s, i) => (
            <motion.div key={i} className="p-5 sm:p-6 rounded-2xl glow-card text-center"
              variants={popIn} whileHover={{ y: -4 }}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">{s.icon}</div>
              <p className="text-xl sm:text-2xl font-heading font-bold text-vibrant-gradient">{s.value}</p>
              <p className="text-[0.55rem] sm:text-[0.6rem] text-foreground/40 mt-1 tracking-wider uppercase font-heading">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Career path */}
        <motion.div className="p-6 rounded-2xl glow-card mb-10"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="font-heading font-bold text-[0.6rem] text-foreground/50 text-center mb-6 tracking-[3px] uppercase">Percorso di Carriera</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-0">
            {[
              { title: "Partner", desc: "€997 per ogni vendita chiusa", icon: <Handshake className="w-5 h-5" /> },
              { title: "3 Vendite", desc: "Promozione automatica", icon: <TrendingUp className="w-5 h-5" /> },
              { title: "Team Leader", desc: "+€50 override per vendita team", icon: <Crown className="w-5 h-5" /> },
            ].map((s, i) => (
              <div key={i} className="flex sm:flex-col items-center gap-3.5 text-center w-full sm:w-auto">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {s.icon}
                </motion.div>
                <div className="text-left sm:text-center">
                  <p className="text-sm font-bold text-foreground font-heading">{s.title}</p>
                  <p className="text-[0.6rem] text-foreground/35">{s.desc}</p>
                </div>
                {i < 2 && <ArrowRight className="hidden sm:block w-5 h-5 text-primary/15 mx-6 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scenario */}
        <motion.div className="p-6 rounded-2xl glow-card max-w-sm mx-auto"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="font-heading font-bold text-[0.6rem] text-foreground/50 text-center mb-4 tracking-[3px] uppercase">Scenario: 5 vendite/mese</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-foreground/35 text-xs">5× Commissioni</span><span className="font-bold text-foreground text-sm">€4.985</span></div>
            <div className="flex justify-between"><span className="text-foreground/35 text-xs">Bonus Elite (5+)</span><span className="font-bold text-foreground text-sm">€1.500</span></div>
            <div className="flex justify-between pt-3 border-t border-border/30">
              <span className="font-semibold text-foreground text-sm">Totale mensile</span>
              <span className="text-2xl font-heading font-bold text-vibrant-gradient">€6.485</span>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <motion.button
            onClick={() => navigate("/partner/register")}
            className="px-8 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2"
            whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(265,70%,60%,0.2)" }}
            whileTap={{ scale: 0.97 }}
          >
            Diventa Partner <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          FAQ
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-start">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center lg:text-left">
            <SectionLabel text="FAQ" />
            <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4">
              Domande<br /><span className="text-shimmer">Frequenti</span>
            </h2>
            <p className="text-sm text-foreground/35 leading-[1.7] max-w-xs mx-auto lg:mx-0">
              Tutto su Empire: settori, costi, sicurezza, capacità e partnership.
            </p>
          </motion.div>

          <motion.div className="space-y-3 w-full"
            variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {faqs.map((faq, i) => (
              <motion.div key={i} className="rounded-xl glow-card overflow-hidden" variants={fadeUp}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-foreground/[0.02] transition-colors">
                  <span className="text-xs sm:text-sm font-semibold text-foreground pr-3 font-heading">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    className="w-7 h-7 rounded-full bg-primary/[0.08] flex items-center justify-center flex-shrink-0 text-primary text-sm font-heading font-bold"
                  >
                    +
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="px-5 pb-5 text-xs sm:text-sm text-foreground/40 leading-[1.7]">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          PERCHÉ SIAMO N°1 — Dense Benefits Grid
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="text-center mb-10 sm:mb-14">
          <SectionLabel text="Supremazia" icon={<Crown className="w-3 h-3 text-accent" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Perché Siamo <span className="text-shimmer">N°1</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[500px] mx-auto text-sm leading-[1.7]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Non è marketing. Sono fatti. Ecco perché nessun competitor può offrire quello che offriamo noi.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {[
            { icon: <Brain className="w-4 h-4" />, title: "IA Proprietaria", desc: "Non rivendiamo ChatGPT. Engine AI custom." },
            { icon: <Globe className="w-4 h-4" />, title: "25+ Settori", desc: "Dal ristorante all'hotel, dalla palestra al medico." },
            { icon: <Smartphone className="w-4 h-4" />, title: "PWA Nativa", desc: "Installabile come app. No App Store, no costi." },
            { icon: <Fingerprint className="w-4 h-4" />, title: "100% White Label", desc: "Il tuo brand, zero marchi terzi." },
            { icon: <Zap className="w-4 h-4" />, title: "Attivo in 24h", desc: "Non mesi. Un giorno e sei operativo." },
            { icon: <Shield className="w-4 h-4" />, title: "GDPR & AES-256", desc: "Sicurezza enterprise per tutti." },
            { icon: <Workflow className="w-4 h-4" />, title: "Automazione Totale", desc: "Dal primo contatto alla fattura." },
            { icon: <Radio className="w-4 h-4" />, title: "Updates Settimanali", desc: "Il sistema si evolve. Sempre gratis." },
            { icon: <DollarSign className="w-4 h-4" />, title: "Solo 2% Fee", desc: "15× meno di qualsiasi piattaforma." },
            { icon: <Database className="w-4 h-4" />, title: "Dati Tuoi", desc: "Proprietà totale. Zero lock-in." },
            { icon: <Bot className="w-4 h-4" />, title: "Concierge AI", desc: "Assistente 24/7 per i tuoi clienti." },
            { icon: <Headphones className="w-4 h-4" />, title: "Supporto 7/7", desc: "Persone vere, non chatbot." },
          ].map((b, i) => (
            <motion.div key={i} className="p-4 rounded-xl holo-panel text-center group hover:border-primary/15 transition-all"
              variants={popIn} whileHover={{ y: -3 }}>
              <div className="text-primary/50 mb-2 flex justify-center group-hover:text-primary/80 transition-colors">{b.icon}</div>
              <h4 className="text-[0.7rem] font-heading font-bold text-foreground mb-1">{b.title}</h4>
              <p className="text-[0.55rem] text-foreground/30 leading-[1.5]">{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          GARANZIA TOTALE — Risk Reversal
         ═══════════════════════════════════════════ */}
      <Section>
        <motion.div className="relative max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] via-background to-accent/[0.03] text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <div className="absolute inset-0 premium-holo-grid opacity-20 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}>
              <Shield className="w-14 h-14 mx-auto text-primary mb-5 drop-shadow-[0_0_30px_hsla(265,70%,60%,0.3)]" />
            </motion.div>
            <h2 className="text-[clamp(1.5rem,4vw,2.4rem)] font-heading font-bold text-foreground leading-[1.08] mb-4">
              Garanzia <span className="text-shimmer">Soddisfatti o Rimborsati</span>
            </h2>
            <p className="text-sm text-foreground/40 max-w-md mx-auto leading-[1.8] mb-6">
              Se entro 30 giorni dall'attivazione non sei completamente soddisfatto, ti rimborsiamo il 100% senza domande. Zero rischio, zero burocrazia.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                { icon: <Check className="w-4 h-4" />, text: "30 giorni di prova" },
                { icon: <Check className="w-4 h-4" />, text: "Rimborso 100%" },
                { icon: <Check className="w-4 h-4" />, text: "Nessuna domanda" },
              ].map((g, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-foreground/50">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">{g.icon}</div>
                  <span className="font-heading font-semibold">{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════ FINAL CTA ═══════ */}
      <Section>
        <div className="relative text-center p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-gold/[0.06] via-deep-black/80 to-primary/[0.04] border border-gold/15 overflow-hidden animated-border">
          <div className="absolute inset-0 aurora-mesh opacity-30" />
          {/* Gold ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px]" style={{ background: "linear-gradient(90deg, transparent, hsla(42,80%,55%,0.5), transparent)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[40px] blur-[30px]" style={{ background: "hsla(42, 80%, 55%, 0.15)" }} />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Crown className="w-12 h-12 mx-auto mb-6" style={{ color: "hsl(42, 80%, 60%)", filter: "drop-shadow(0 0 40px hsla(42,80%,55%,0.3))" }} />
            </motion.div>
            <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4">
              Pronto a Costruire il Tuo <span className="text-gold-shimmer">Impero?</span>
            </h2>
            <p className="text-sm text-foreground/35 max-w-md mx-auto mb-8">
              25+ settori, automazione totale, IA integrata, aggiornamenti settimanali. I tuoi competitor si stanno digitalizzando. Non restare indietro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button onClick={() => navigate("/admin")}
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-gold-gradient text-deep-black font-bold text-sm font-heading tracking-wider uppercase flex items-center justify-center gap-2"
                whileHover={{ scale: 1.03, boxShadow: "0 20px 60px hsla(42,80%,55%,0.3)" }}
                whileTap={{ scale: 0.97 }}
              >
                Sono un Imprenditore <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button onClick={() => navigate("/partner/register")}
                className="w-full sm:w-auto px-9 py-4 rounded-full border border-foreground/10 text-foreground/70 font-bold text-sm font-heading tracking-wide hover:border-primary/30 hover:text-foreground transition-all backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                Diventa Partner
              </motion.button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ FOOTER ═══════ */}
      <footer id="contact" className="border-t border-border/30 py-14 pb-8 px-5 sm:px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10 mb-12">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-[0_0_15px_hsla(42,80%,55%,0.2)]">
                  <Crown className="w-3.5 h-3.5 text-deep-black" />
                </div>
                <span className="font-heading font-bold text-foreground tracking-[0.12em] uppercase text-xs">Empire<span className="text-gold">.AI</span></span>
              </div>
              <p className="text-[0.65rem] text-foreground/30 leading-[1.7] max-w-[240px] mb-5">
                La piattaforma AI più completa al mondo. Modernizziamo qualsiasi business con tecnologia proprietaria e automazione intelligente.
              </p>
              <div className="flex gap-2">
                {["In", "𝕏", "IG"].map((s, i) => (
                  <motion.div key={i}
                    className="w-8 h-8 rounded-lg border border-foreground/[0.06] flex items-center justify-center text-[0.6rem] text-foreground/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                  >
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.6rem] font-semibold text-foreground/40 mb-4 tracking-[3px] uppercase">Settori</h4>
              <div className="space-y-2.5 text-[0.65rem] text-foreground/30">
                <p>Food & Ristorazione</p>
                <p>NCC & Trasporto</p>
                <p>Beauty & Wellness</p>
                <p>Healthcare</p>
                <p>Retail, Fitness, Hospitality</p>
                <p>+18 altri settori</p>
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.6rem] font-semibold text-foreground/40 mb-4 tracking-[3px] uppercase">Risorse</h4>
              <div className="space-y-2.5 text-[0.65rem]">
                {[
                  { label: "Funzionalità", href: "#services" },
                  { label: "ROI Calculator", href: "#calculator" },
                  { label: "Prezzi", href: "#pricing" },
                  { label: "Partner Program", href: "#partner" },
                ].map((link, i) => (
                  <a key={i} href={link.href} className="block text-foreground/30 hover:text-primary transition-colors">{link.label}</a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.6rem] font-semibold text-foreground/40 mb-4 tracking-[3px] uppercase">Contatti & Legale</h4>
              <div className="space-y-2.5 text-[0.65rem]">
                <p className="text-foreground/30 flex items-center gap-2"><Mail className="w-3 h-3" /> info@empire-suite.it</p>
                <p className="text-foreground/30 flex items-center gap-2"><MapPin className="w-3 h-3" /> Roma, Italia</p>
                <a href="/privacy" className="block text-foreground/30 hover:text-primary transition-colors mt-3">Privacy Policy</a>
                <a href="/cookie-policy" className="block text-foreground/30 hover:text-primary transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.6rem] text-foreground/20">
            <p>© 2026 Empire AI · Piattaforma Multi-Settore · Sempre in Evoluzione</p>
            <div className="flex gap-5">
              <a href="/privacy" className="hover:text-foreground/40 transition-colors">Privacy</a>
              <a href="/cookie-policy" className="hover:text-foreground/40 transition-colors">Cookie</a>
              <span>P.IVA IT12345678901</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════ STICKY CTA MOBILE ═══════ */}
      <motion.div className="fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] bg-background/80 backdrop-blur-2xl border-t border-border/20 md:hidden"
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 2, type: "spring", damping: 25 }}>
        <div className="flex gap-2">
          <motion.button onClick={() => scrollTo("pricing")}
            className="flex-1 py-3.5 rounded-xl bg-gold-gradient text-deep-black font-bold text-sm tracking-wider font-heading uppercase"
            whileTap={{ scale: 0.97 }}
          >
            Inizia Ora
          </motion.button>
          <motion.button onClick={() => navigate("/r/impero-roma")}
            className="px-4 py-3.5 rounded-xl border border-primary/15 text-primary"
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
