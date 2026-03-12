import { useState, useEffect, useRef, forwardRef } from "react";
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
  Layers, Globe, Radio
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(eased * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);
  return <span ref={ref}>{prefix}{display.toLocaleString("it-IT")}{suffix}</span>;
};

const Section = forwardRef<HTMLElement, { id?: string; children: React.ReactNode; className?: string }>(
  ({ id, children, className = "" }, ref) => (
    <section ref={ref} id={id} className={`relative py-16 sm:py-24 px-5 sm:px-6 overflow-hidden ${className}`}>
      <div className="max-w-[1100px] mx-auto relative z-10">{children}</div>
    </section>
  )
);
Section.displayName = "Section";

const SectionLabel = ({ text, icon }: { text: string; icon?: React.ReactNode }) => (
  <motion.div
    className="inline-flex items-center gap-2.5 mb-5"
    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
  >
    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/15 bg-primary/[0.04]">
      {icon || <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />}
      <span className="text-[0.65rem] font-heading font-semibold tracking-[3px] uppercase text-primary/80">{text}</span>
    </div>
  </motion.div>
);

const smoothEase = [0.22, 1, 0.36, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smoothEase } } };
const fadeScale = { hidden: { opacity: 0, y: 15, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: smoothEase } } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const staggerFast = { hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const slideInLeft = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: smoothEase } } };
const slideInRight = { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: smoothEase } } };
const popIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 24 } } };

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

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 80]);

  useEffect(() => {
    const h = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
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
    { icon: <ChefHat className="w-5 h-5" />, title: "Food & Ristorazione", desc: "Ristoranti, pizzerie, bar, pasticcerie, sushi bar", gradient: "from-orange-500 to-amber-400" },
    { icon: <Car className="w-5 h-5" />, title: "NCC & Trasporto", desc: "Noleggio con conducente, transfer, limousine", gradient: "from-blue-500 to-cyan-400" },
    { icon: <Scissors className="w-5 h-5" />, title: "Beauty & Wellness", desc: "Saloni, centri estetici, SPA, barbieri", gradient: "from-pink-500 to-rose-400" },
    { icon: <Heart className="w-5 h-5" />, title: "Healthcare", desc: "Studi medici, dentisti, fisioterapisti", gradient: "from-emerald-500 to-green-400" },
    { icon: <Store className="w-5 h-5" />, title: "Retail & Negozi", desc: "Negozi, boutique, e-commerce locale", gradient: "from-yellow-500 to-amber-400" },
    { icon: <Dumbbell className="w-5 h-5" />, title: "Fitness & Sport", desc: "Palestre, centri sportivi, personal trainer", gradient: "from-red-500 to-orange-400" },
    { icon: <Building className="w-5 h-5" />, title: "Hospitality", desc: "Hotel, B&B, agriturismi, resort", gradient: "from-sky-500 to-blue-400" },
  ];

  const services = [
    { icon: <Brain className="w-5 h-5" />, title: "AI Business Engine", desc: "L'IA analizza il tuo business, genera cataloghi, ottimizza prezzi e automatizza le operazioni. Risparmia ore ogni giorno.", tag: "IA" },
    { icon: <Smartphone className="w-5 h-5" />, title: "App White Label", desc: "App professionale installabile con il TUO brand, colori e dominio. Nessun logo di terzi — i clienti interagiscono solo con te.", tag: "APP" },
    { icon: <Calendar className="w-5 h-5" />, title: "Prenotazioni & Ordini", desc: "Gestisci appuntamenti, ordini, prenotazioni corse o camere da un unico pannello. Notifiche real-time, zero sovrapposizioni.", tag: "OPS" },
    { icon: <Shield className="w-5 h-5" />, title: "Review Shield™", desc: "Le recensioni negative restano nel tuo archivio privato. Solo le migliori costruiscono la tua reputazione pubblica.", tag: "BRAND" },
    { icon: <Users className="w-5 h-5" />, title: "CRM & Fidelizzazione", desc: "Storico acquisti, preferenze, wallet fedeltà. Trasforma i visitatori occasionali in clienti ricorrenti.", tag: "GROWTH" },
    { icon: <BarChart3 className="w-5 h-5" />, title: "Analytics & Finance", desc: "Dashboard fatturato, margini, performance staff, trend. Fatturazione elettronica integrata. Decisioni basate sui dati.", tag: "FINANCE" },
    { icon: <Package className="w-5 h-5" />, title: "Inventario & HACCP", desc: "Monitora scorte, ricevi alert automatici, registra controlli igienico-sanitari. Conformità normativa senza burocrazia.", tag: "OPS" },
    { icon: <Palette className="w-5 h-5" />, title: "Social & Marketing", desc: "Crea e programma post social. Campagne push notification e promozioni mirate per riempire l'agenda.", tag: "MARKETING" },
    { icon: <Lock className="w-5 h-5" />, title: "Sicurezza Enterprise", desc: "Crittografia AES-256, GDPR compliant, backup automatici, accessi multi-ruolo. I tuoi dati sono al sicuro.", tag: "SECURITY" },
  ];

  const metrics = [
    { value: 200, suffix: "+", label: "Attività Attive" },
    { value: 7, suffix: "", label: "Settori Coperti" },
    { value: 45, suffix: "%", prefix: "+", label: "Aumento Fatturato" },
    { value: 98, suffix: "%", label: "Soddisfazione" },
  ];

  const testimonials = [
    { name: "Marco Pellegrini", role: "Trattoria da Marco · Roma", quote: "In 3 mesi ho spostato il 60% degli ordini dalla piattaforma alla mia app. Risparmio €3.200 al mese netti.", metric: "−€3.200/mese", industry: "Food" },
    { name: "Alessandra Conti", role: "NCC Premium Transfer · Milano", quote: "Prima gestivo le prenotazioni via WhatsApp. Ora ho un sistema automatizzato con flotta, tratte e pagamenti integrati.", metric: "+40% fatturato", industry: "NCC" },
    { name: "Valentina Rossi", role: "Beauty Lab · Firenze", quote: "I clienti prenotano dall'app, ricevono promemoria automatici e il no-show è crollato del 70%.", metric: "−70% no-show", industry: "Beauty" },
    { name: "Dr. Luca Bianchi", role: "Studio Dentistico · Torino", quote: "Agenda digitale, schede paziente, fatturazione elettronica. Ho eliminato 2 ore di burocrazia al giorno.", metric: "−2h/giorno", industry: "Healthcare" },
    { name: "Simone Moretti", role: "CrossFit Arena · Bologna", quote: "Gestione corsi, abbonamenti e pagamenti in un'unica piattaforma. Il tasso di rinnovo è salito all'87%.", metric: "87% rinnovi", industry: "Fitness" },
    { name: "Giulia De Luca", role: "Boutique Eleganza · Napoli", quote: "Il catalogo digitale ha trasformato il mio negozio. Le vendite online sono il 35% del totale.", metric: "+35% vendite", industry: "Retail" },
  ];

  const faqs = [
    { q: "Per quali settori funziona Empire?", a: "Empire è multi-settore: ristoranti, NCC, saloni di bellezza, studi medici, negozi, palestre e hotel. Ogni settore ha moduli, terminologia e flussi dedicati che si attivano automaticamente." },
    { q: "È difficile da usare?", a: "No. Se sai usare Instagram, sai usare Empire. L'interfaccia si adatta al tuo settore. L'IA fa il lavoro pesante: carica una foto e in 60 secondi hai il tuo catalogo digitale." },
    { q: "Come funzionano i pagamenti?", a: "I pagamenti arrivano direttamente sul TUO conto via Stripe Connect. Non tocchiamo mai i tuoi soldi. L'unica trattenuta è il 2% automatico — 15× meno delle piattaforme tradizionali." },
    { q: "Quanto costa davvero?", a: "€2.997 una tantum (o 3 rate da €1.099). Dopodiché €0/mese per sempre. Solo il 2% sulle transazioni. Nessun vincolo, nessun costo nascosto." },
    { q: "I miei dati sono al sicuro?", a: "Sì. Crittografia AES-256, conformità GDPR, backup automatici e accessi multi-ruolo. Standard enterprise anche per la piccola attività." },
    { q: "Come funziona il Partner Program?", a: "Diventi Partner gratis. Guadagni €997 per ogni vendita + bonus fino a €1.500/mese. Pagamenti istantanei via Stripe Connect. Nessun rischio, nessun investimento." },
  ];

  const navLinks = [
    { href: "#industries", label: "Settori" },
    { href: "#services", label: "Funzionalità" },
    { href: "#pricing", label: "Prezzi" },
    { href: "#partner", label: "Partner" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">

      {/* ═══════ AMBIENT ═══════ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[200px] opacity-[0.06] bg-primary -top-[200px] left-1/2 -translate-x-1/2 animate-blob-float" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.04] bg-accent top-[60vh] -right-[100px] animate-blob-float-reverse" />
        <div className="absolute w-[350px] h-[350px] rounded-full blur-[140px] opacity-[0.03] bg-primary bottom-[10vh] -left-[100px] animate-blob-float-slow" />
      </div>

      {/* ═══════ NAVIGATION ═══════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${navScrolled ? "bg-background/85 backdrop-blur-2xl border-b border-primary/[0.06] py-2.5" : "py-4"}`}>
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-vibrant-gradient flex items-center justify-center shadow-[0_0_20px_hsla(263,70%,58%,0.25)] group-hover:shadow-[0_0_30px_hsla(263,70%,58%,0.4)] transition-shadow">
              <Crown className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-sm tracking-[0.12em] uppercase text-foreground">Empire<span className="text-primary">.AI</span></span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link.href} href={link.href}
                className="relative text-[0.8rem] font-medium text-foreground/40 hover:text-foreground transition-colors duration-300 tracking-wide group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <button onClick={() => scrollTo("contact")}
              className="px-5 py-2 rounded-full bg-vibrant-gradient text-primary-foreground text-xs font-bold font-heading tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_10px_30px_hsla(263,70%,58%,0.3)] transition-all duration-300">
              Inizia Ora
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-foreground" aria-label="Menu">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-background/95 backdrop-blur-2xl border-t border-border/10 overflow-hidden">
              <div className="flex flex-col items-center gap-1 py-5 px-5">
                {navLinks.map(link => (
                  <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors font-heading tracking-widest uppercase">
                    {link.label}
                  </a>
                ))}
                <button onClick={() => { scrollTo("contact"); setMobileMenuOpen(false); }}
                  className="mt-3 w-full py-3 rounded-xl bg-vibrant-gradient text-primary-foreground text-sm font-bold tracking-widest uppercase font-heading">
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
      <motion.section ref={heroRef} id="hero" className="relative min-h-[100dvh] flex items-center overflow-hidden px-5 sm:px-6 pt-20 pb-16"
        style={{ opacity: heroOpacity }}>
        {/* Cyber grid background */}
        <div className="absolute inset-0 cyber-grid opacity-40" />
        
        {/* Radial glow center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full bg-[radial-gradient(circle,hsla(263,70%,58%,0.08)_0%,transparent_70%)] pointer-events-none" />

        <motion.div className="relative z-10 max-w-[1100px] mx-auto w-full" style={{ y: heroY }}>
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
            
            {/* Badge */}
            <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/15 bg-primary/[0.05] mb-6"
              initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }}>
              <Radio className="w-3 h-3 text-primary animate-pulse-dot" />
              <span className="text-[0.65rem] font-heading font-medium text-primary/80 tracking-[2px] uppercase">Piattaforma AI Multi-Settore</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-[2.2rem] leading-[1.08] sm:text-[3.2rem] md:text-[3.8rem] lg:text-[4.2rem] font-heading font-bold text-foreground tracking-[-0.025em]"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: smoothEase }}>
              Il Tuo Business
              <br />
              <span className="text-vibrant-gradient neon-text">Merita un Impero</span>
            </motion.h1>

            {/* Sub */}
            <motion.p className="mt-5 text-[0.95rem] sm:text-base text-foreground/45 max-w-[520px] leading-[1.75] font-light"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }}>
              Ristorante, salone, studio medico, NCC o negozio — 
              <span className="text-foreground/65 font-normal"> un ecosistema digitale completo con IA integrata. Zero commissioni predatorie.</span>
            </motion.p>

            {/* CTA */}
            <motion.div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <button onClick={() => scrollTo("pricing")}
                className="group relative w-full sm:w-auto px-7 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_15px_50px_hsla(263,70%,58%,0.3)]">
                <span className="absolute inset-0 bg-gradient-to-r from-foreground/0 via-foreground/10 to-foreground/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">Prenota Demo Gratuita <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></span>
              </button>
              <button onClick={() => navigate("/r/impero-roma")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-border/20 text-foreground/70 text-sm font-semibold font-heading tracking-wide hover:border-primary/25 hover:text-foreground hover:bg-primary/[0.04] transition-all flex items-center justify-center gap-2">
                <Play className="w-3.5 h-3.5 text-primary" /> Vedi Demo Live
              </button>
            </motion.div>

            {/* Metrics */}
            <motion.div className="mt-12 w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              {metrics.map((m, i) => (
                <div key={i} className="counter-card rounded-2xl p-4 text-center">
                  <p className="text-xl sm:text-2xl font-heading font-bold text-vibrant-gradient">
                    <AnimatedNumber value={m.value} prefix={m.prefix} suffix={m.suffix} />
                  </p>
                  <p className="text-[0.6rem] text-foreground/35 mt-1 tracking-[2px] uppercase font-heading">{m.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
          animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <span className="text-[8px] text-foreground/20 tracking-[3px] uppercase font-heading">Scopri</span>
          <ArrowDown className="w-3.5 h-3.5 text-primary/25" />
        </motion.div>
      </motion.section>

      {/* ═══════ TRUST MARQUEE ═══════ */}
      <div className="relative py-4 border-y border-primary/[0.06] overflow-hidden">
        <div className="flex animate-marquee-scroll whitespace-nowrap">
          {[...Array(2)].map((_, repeat) => (
            <div key={repeat} className="flex items-center gap-10 px-5">
              {["Stripe Connect", "AES-256", "PWA Certified", "GDPR Compliant", "99.9% Uptime", "AI-Powered", "Made in Italy", "White Label", "7 Industrie"].map((t, i) => (
                <span key={i} className="text-[0.6rem] text-foreground/15 font-heading tracking-[3px] uppercase flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/20" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          SETTORI
         ═══════════════════════════════════════════ */}
      <Section id="industries">
        <div className="text-center mb-10">
          <SectionLabel text="Multi-Settore" icon={<Globe className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.1] mb-3"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Una Piattaforma, <span className="text-vibrant-gradient">Ogni Settore</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[480px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Empire si adatta automaticamente alla tua industria: terminologia, moduli e dashboard cambiano in base al settore.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {industries.map((ind, i) => (
            <motion.div key={i}
              className="group relative p-5 sm:p-6 rounded-2xl future-card hover:-translate-y-1.5 transition-all duration-500 text-center"
              variants={fadeScale}>
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${ind.gradient} flex items-center justify-center text-primary-foreground mx-auto mb-3 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500`}>
                {ind.icon}
              </div>
              <h3 className="font-heading text-xs sm:text-sm font-bold text-foreground mb-1">{ind.title}</h3>
              <p className="text-[0.6rem] sm:text-[0.65rem] text-foreground/35 leading-[1.5]">{ind.desc}</p>
            </motion.div>
          ))}
          <motion.div
            className="group relative p-5 sm:p-6 rounded-2xl border border-dashed border-primary/15 hover:border-primary/30 transition-all duration-500 text-center flex flex-col items-center justify-center cursor-pointer"
            variants={fadeScale}
            onClick={() => scrollTo("contact")}>
            <Sparkles className="w-6 h-6 text-primary/30 mb-2 group-hover:text-primary transition-colors" />
            <p className="text-xs font-heading font-semibold text-foreground/40 group-hover:text-foreground transition-colors">Il tuo settore?</p>
            <p className="text-[0.6rem] text-primary/50 mt-0.5">Contattaci →</p>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          PROBLEMA
         ═══════════════════════════════════════════ */}
      <Section id="problem">
        <div className="text-center mb-10">
          <SectionLabel text="Il Problema" icon={<AlertTriangle className="w-3 h-3 text-accent" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.1] mb-3"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Stai Pagando Troppo per <span className="text-vibrant-gradient">Strumenti Sbagliati</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[480px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Commissioni marketplace, canoni di 5 software diversi, gestione manuale caotica. Il tuo margine si dissolve.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {[
            { icon: <Banknote className="w-6 h-6" />, amount: "30%", label: "Margini erosi dai marketplace", sub: "Commissioni predatorie su ogni transazione", gradient: "from-red-500 to-orange-500" },
            { icon: <DollarSign className="w-6 h-6" />, amount: "€500+", label: "Canoni mensili software", sub: "5 abbonamenti separati per funzioni base", gradient: "from-amber-500 to-yellow-500" },
            { icon: <Target className="w-6 h-6" />, amount: "0%", label: "Controllo sui dati clienti", sub: "I tuoi clienti appartengono alla piattaforma", gradient: "from-purple-500 to-pink-500" },
          ].map((item, i) => (
            <motion.div key={i}
              className="group relative p-6 sm:p-7 rounded-2xl future-card hover:-translate-y-1.5 transition-all duration-500 text-center"
              variants={fadeScale}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-primary-foreground mx-auto mb-4 group-hover:scale-110 transition-transform duration-500`}>
                {item.icon}
              </div>
              <p className="text-3xl sm:text-4xl font-heading font-bold text-vibrant-gradient mb-1.5">{item.amount}</p>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-[0.65rem] text-foreground/35 mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          SERVIZI
         ═══════════════════════════════════════════ */}
      <Section id="services">
        <div className="text-center mb-10">
          <SectionLabel text="Funzionalità" icon={<Layers className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.1] mb-3"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Tutto Ciò Che Serve,<br className="hidden sm:block" />
            <span className="text-vibrant-gradient">in un Unico Posto</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[480px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Ogni modulo si attiva in base al tuo settore. Nessun software esterno, nessuna integrazione complessa.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {services.map((s, i) => (
            <motion.div key={i}
              className="group relative p-5 sm:p-6 rounded-2xl future-card hover:-translate-y-1.5 transition-all duration-500"
              variants={fadeUp}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  {s.icon}
                </div>
                <span className="text-[0.55rem] px-2 py-0.5 rounded-full border border-primary/10 text-primary/60 font-bold tracking-[2px] font-heading">{s.tag}</span>
              </div>
              <h3 className="font-heading text-sm sm:text-base font-semibold text-foreground mb-1.5">{s.title}</h3>
              <p className="text-xs sm:text-sm text-foreground/40 leading-[1.65]">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          COME FUNZIONA
         ═══════════════════════════════════════════ */}
      <Section id="process">
        <div className="text-center mb-10">
          <SectionLabel text="Processo" icon={<Zap className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.1]"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Attivo in <span className="text-vibrant-gradient">4 Step</span>
          </motion.h2>
        </div>

        <motion.div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-[44px] left-[calc(12.5%+32px)] right-[calc(12.5%+32px)] h-px bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 z-0" />

          {[
            { step: "01", title: "Scegli il Settore", desc: "Empire configura moduli e flussi dedicati automaticamente." },
            { step: "02", title: "Personalizza Brand", desc: "Logo, colori, dominio. L'IA genera il catalogo in 60 secondi." },
            { step: "03", title: "Lancia il Sistema", desc: "App attiva, team formato, QR code installati. Operativo in 24h." },
            { step: "04", title: "Cresci con i Dati", desc: "Analytics real-time, suggerimenti IA, campagne automatizzate." },
          ].map((s, i) => (
            <motion.div key={i} className="relative text-center z-10" variants={popIn}>
              <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl future-card flex items-center justify-center mx-auto mb-4">
                <span className="font-heading font-bold text-lg text-primary/70">{s.step}</span>
              </div>
              <h3 className="font-heading text-xs sm:text-sm font-bold text-foreground mb-1.5">{s.title}</h3>
              <p className="text-[0.65rem] sm:text-xs text-foreground/40 leading-[1.55]">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          APP SHOWCASE
         ═══════════════════════════════════════════ */}
      <Section id="app">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center lg:text-left order-2 lg:order-1">
            <SectionLabel text="Ecosistema" icon={<Smartphone className="w-3 h-3 text-primary" />} />
            <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.1] mb-4">
              Ecosistema Completo,<br /><span className="text-vibrant-gradient">di Tua Proprietà</span>
            </h2>
            <p className="text-foreground/40 leading-[1.7] max-w-lg mx-auto lg:mx-0 mb-6 text-sm">
              App cliente, pannello gestionale e vista operativa — tutto white-label con il tuo brand. Dal menu digitale alla gestione flotta.
            </p>
            <div className="space-y-3 mb-6 text-left max-w-md mx-auto lg:mx-0">
              {[
                { title: "Ordini, Prenotazioni & Appuntamenti", desc: "Un unico sistema per ogni tipo di transazione" },
                { title: "CRM & Programma Fedeltà", desc: "Wallet pass, reward, storico cliente completo" },
                { title: "Comunicazione Diretta", desc: "Push notification, chat, promozioni mirate" },
                { title: "Dashboard Operativa Real-Time", desc: "Cucina, autisti, staff — live senza errori" },
              ].map((f, i) => (
                <motion.div key={i} className="flex gap-3 items-start"
                  initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="w-5 h-5 min-w-[20px] rounded-md bg-primary/10 flex items-center justify-center mt-0.5">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-foreground font-medium">{f.title}</p>
                    <p className="text-[0.65rem] text-foreground/35 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button onClick={() => navigate("/r/impero-roma")}
              className="group px-6 py-3 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_10px_30px_hsla(263,70%,58%,0.3)] transition-all inline-flex items-center gap-2">
              Prova la Demo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="order-1 lg:order-2">
            <div className="flex justify-center items-end gap-2.5 sm:gap-4 relative">
              <div className="absolute -inset-10 bg-primary/[0.05] rounded-[60px] blur-[80px] pointer-events-none" />
              {[
                { label: "Cliente", img: mockupCliente, h: "h-[260px] sm:h-[340px]", delay: 0 },
                { label: "Gestionale", img: mockupAdmin, h: "h-[300px] sm:h-[380px]", delay: 0.1 },
                { label: "Operativo", img: mockupCucina, h: "h-[260px] sm:h-[340px]", delay: 0.2 },
              ].map((phone, i) => (
                <motion.div key={i}
                  className={`relative w-[90px] sm:w-[120px] ${phone.h} rounded-[16px] sm:rounded-[20px] overflow-hidden border border-foreground/[0.06] bg-card shadow-[0_15px_50px_hsla(0,0%,0%,0.5)]`}
                  initial={{ y: 25 + i * 8 }} whileInView={{ y: i === 1 ? -8 : 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.15 + phone.delay, duration: 0.7, ease: smoothEase }}>
                  <img src={phone.img} alt={phone.label} className="w-full h-full object-cover object-top" loading="lazy" />
                  <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-background/90 to-transparent" />
                  <span className="absolute bottom-2 left-0 right-0 text-center text-[0.55rem] font-heading font-bold tracking-[2px] uppercase text-foreground/40">{phone.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          ROI CALCULATOR
         ═══════════════════════════════════════════ */}
      <Section id="calculator">
        <div className="text-center mb-10">
          <SectionLabel text="ROI Calculator" icon={<TrendingUp className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.1] mb-3"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Calcola Quanto <span className="text-vibrant-gradient">Stai Perdendo</span>
          </motion.h2>
        </div>

        <motion.div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl future-card space-y-5"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {[
            { label: "Transazioni / mese", value: monthlyOrders, min: 100, max: 3000, step: 50, display: monthlyOrders.toString(), onChange: setMonthlyOrders },
            { label: "Valore medio", value: avgOrder, min: 10, max: 80, step: 5, display: `€${avgOrder}`, onChange: setAvgOrder },
          ].map((sl, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground/40 font-heading text-xs tracking-wider uppercase">{sl.label}</span>
                <span className="text-foreground font-bold font-heading text-sm">{sl.display}</span>
              </div>
              <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.value}
                onChange={e => sl.onChange(Number(e.target.value))} className="w-full" />
            </div>
          ))}

          <div className="space-y-3 pt-5 border-t border-primary/[0.08]">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-foreground/35">Piattaforme terze (30%)</span>
                <span className="text-accent font-heading font-bold">-€{thirdPartyCost.toLocaleString("it-IT", { maximumFractionDigits: 0 })}/mese</span>
              </div>
              <div className="h-2.5 rounded-full bg-foreground/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-accent/50 to-accent/70"
                  initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-foreground/35">Empire (2%)</span>
                <span className="text-primary font-heading font-bold">-€{empireCost.toLocaleString("it-IT", { maximumFractionDigits: 0 })}/mese</span>
              </div>
              <div className="h-2.5 rounded-full bg-foreground/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-primary/50 to-primary/70"
                  initial={{ width: 0 }} whileInView={{ width: `${Math.max(5, (empireCost / thirdPartyCost) * 100)}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-primary/[0.06] to-accent/[0.03] border border-primary/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-foreground/50">Risparmi / mese</span>
              <span className="text-xl font-heading font-bold text-primary">€{monthlySaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-foreground/50">Risparmi / anno</span>
              <span className="text-xl font-heading font-bold text-vibrant-gradient">€{yearSaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-primary/10">
              <span className="text-[0.65rem] text-foreground/35">ROI completo in</span>
              <span className="text-foreground font-heading font-bold text-sm">{roiMonths} {roiMonths === 1 ? "mese" : "mesi"}</span>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
         ═══════════════════════════════════════════ */}
      <Section id="testimonials">
        <div className="text-center mb-10">
          <SectionLabel text="Storie di Successo" icon={<Star className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.1] mb-3"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Risultati Reali, <span className="text-vibrant-gradient">Settori Diversi</span>
          </motion.h2>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {testimonials.map((t, i) => (
            <motion.div key={i} className="group p-5 sm:p-6 rounded-2xl future-card hover:-translate-y-1.5 transition-all duration-500"
              variants={fadeUp}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-3 h-3 text-primary fill-primary" />)}
                </div>
                <span className="text-[0.55rem] px-2 py-0.5 rounded-full bg-primary/[0.06] text-primary/60 font-bold tracking-wider font-heading">{t.industry}</span>
              </div>
              <Quote className="w-4 h-4 text-primary/15 mb-2" />
              <blockquote className="text-xs sm:text-sm text-foreground/50 leading-[1.65] mb-4">"{t.quote}"</blockquote>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/[0.06] text-[0.6rem] text-primary font-bold mb-4 font-heading tracking-wider">
                <TrendingUp className="w-2.5 h-2.5" /> {t.metric}
              </div>
              <div className="flex items-center gap-2.5 border-t border-primary/[0.06] pt-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-foreground/50 text-[0.65rem] font-bold font-heading">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-heading text-[0.7rem] font-semibold text-foreground">{t.name}</h4>
                  <p className="text-[0.6rem] text-foreground/30">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          PRICING
         ═══════════════════════════════════════════ */}
      <Section id="pricing">
        <div className="text-center mb-10">
          <SectionLabel text="Investimento" icon={<Gem className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.1] mb-3"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Un Solo Pagamento,<br /><span className="text-vibrant-gradient">Valore Per Sempre</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[440px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Niente canoni mensili. Niente vincoli. Il tuo asset digitale di proprietà.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-2xl mx-auto"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {/* Main plan */}
          <motion.div className="relative p-6 sm:p-8 rounded-2xl overflow-hidden border border-primary/15 bg-gradient-to-b from-primary/[0.06] to-background"
            variants={fadeScale}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-vibrant-gradient" />
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-vibrant-gradient text-[0.55rem] font-bold text-primary-foreground tracking-[2px] font-heading uppercase">Più Scelto</div>
            <span className="text-[0.6rem] font-heading font-semibold text-primary/60 tracking-[3px] uppercase">Pagamento Unico</span>
            <p className="text-4xl sm:text-5xl font-heading font-bold text-foreground mt-2">€2.997</p>
            <p className="text-[0.65rem] text-foreground/35 mt-1">IVA 22% inclusa · Una volta sola</p>
            <ul className="mt-6 space-y-2.5 mb-6">
              {[
                "Asset Digitale di Tua Proprietà",
                "App White Label completa",
                "AI Engine — catalogo in 60s",
                "Moduli adattivi per settore",
                "CRM, Loyalty & Push Notification",
                "Analytics & Fatturazione",
                "Review Shield™",
                "Sicurezza AES-256 & GDPR",
                "Assistenza dedicata a vita",
                "Zero canoni mensili per sempre",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/50">
                  <div className="w-4 h-4 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate("/admin")}
              className="w-full py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase hover:shadow-[0_10px_30px_hsla(263,70%,58%,0.3)] hover:-translate-y-0.5 transition-all">
              Inizia il Tuo Impero
            </button>
            <p className="mt-2 text-[0.6rem] text-center text-foreground/25">Dopo: €0/mese · Solo 2% sulle transazioni</p>
          </motion.div>

          {/* Installment plan */}
          <motion.div className="relative p-6 sm:p-8 rounded-2xl future-card"
            variants={fadeScale}>
            <span className="text-[0.6rem] font-heading font-semibold text-foreground/35 tracking-[3px] uppercase">3 Rate Comode</span>
            <p className="text-3xl sm:text-4xl font-heading font-bold text-foreground mt-2">€1.099<span className="text-sm text-foreground/35 font-normal">/mese</span></p>
            <p className="text-[0.65rem] text-foreground/35 mt-1">Totale: €3.297 · IVA inclusa</p>
            <ul className="mt-6 space-y-2.5 mb-6">
              {["Tutte le funzionalità incluse", "Massima flessibilità", "Attivazione immediata", "Cancella quando vuoi"].map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/40">
                  <div className="w-4 h-4 rounded-md bg-foreground/[0.05] flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-foreground/35" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate("/admin")}
              className="w-full py-3.5 rounded-full border border-primary/15 text-primary font-bold text-sm font-heading tracking-wider uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Scegli 3 Rate
            </button>
          </motion.div>
        </motion.div>

        <motion.p className="text-center mt-6 text-[0.65rem] text-foreground/25 max-w-lg mx-auto"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Dopo l'attivazione: €0/mese · Solo <span className="text-primary font-bold">2%</span> sulle transazioni per infrastruttura, IA e aggiornamenti continui.
        </motion.p>
      </Section>

      {/* ═══════════════════════════════════════════
          PARTNER PROGRAM
         ═══════════════════════════════════════════ */}
      <Section id="partner">
        <div className="text-center mb-10">
          <SectionLabel text="Partner Program" icon={<Handshake className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.1] mb-3"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Guadagna Vendendo <span className="text-vibrant-gradient">Empire</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[440px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Presenta Empire a qualsiasi tipo di attività. Guadagna su ogni vendita. Zero investimento, zero rischi.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {[
            { value: "€997", label: "Per vendita", icon: <Trophy className="w-4 h-4" /> },
            { value: "€50", label: "Override TL", icon: <Award className="w-4 h-4" /> },
            { value: "€500", label: "Bonus 3 vendite", icon: <Gift className="w-4 h-4" /> },
            { value: "€1.500", label: "Bonus Elite", icon: <Rocket className="w-4 h-4" /> },
          ].map((s, i) => (
            <motion.div key={i} className="p-4 sm:p-5 rounded-2xl future-card text-center hover:-translate-y-1.5 transition-all duration-500"
              variants={popIn}>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">{s.icon}</div>
              <p className="text-lg sm:text-xl font-heading font-bold text-vibrant-gradient">{s.value}</p>
              <p className="text-[0.55rem] sm:text-[0.6rem] text-foreground/40 mt-0.5 tracking-wider uppercase font-heading">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Career path */}
        <motion.div className="p-5 rounded-2xl future-card mb-8"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="font-heading font-bold text-[0.6rem] text-foreground/50 text-center mb-5 tracking-[3px] uppercase">Percorso di Carriera</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            {[
              { title: "Partner", desc: "€997 per ogni vendita chiusa", icon: <Handshake className="w-4 h-4" /> },
              { title: "3 Vendite", desc: "Promozione automatica", icon: <TrendingUp className="w-4 h-4" /> },
              { title: "Team Leader", desc: "+€50 override per vendita team", icon: <Crown className="w-4 h-4" /> },
            ].map((s, i) => (
              <div key={i} className="flex sm:flex-col items-center gap-3 text-center w-full sm:w-auto">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{s.icon}</div>
                <div className="text-left sm:text-center">
                  <p className="text-xs sm:text-sm font-bold text-foreground font-heading">{s.title}</p>
                  <p className="text-[0.6rem] text-foreground/35">{s.desc}</p>
                </div>
                {i < 2 && <ArrowRight className="hidden sm:block w-4 h-4 text-primary/15 mx-6 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scenario */}
        <motion.div className="p-5 rounded-2xl future-card max-w-sm mx-auto"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="font-heading font-bold text-[0.6rem] text-foreground/50 text-center mb-3 tracking-[3px] uppercase">Scenario: 5 vendite/mese</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-foreground/35 text-xs">5× Commissioni</span><span className="font-bold text-foreground text-sm">€4.985</span></div>
            <div className="flex justify-between"><span className="text-foreground/35 text-xs">Bonus Elite (5+)</span><span className="font-bold text-foreground text-sm">€1.500</span></div>
            <div className="flex justify-between pt-3 border-t border-primary/[0.06]">
              <span className="font-semibold text-foreground text-sm">Totale mensile</span>
              <span className="text-xl font-heading font-bold text-vibrant-gradient">€6.485</span>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-6">
          <button onClick={() => navigate("/partner/register")}
            className="px-7 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_10px_30px_hsla(263,70%,58%,0.3)] transition-all inline-flex items-center gap-2">
            Diventa Partner <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          FAQ
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-14 items-start">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center lg:text-left">
            <SectionLabel text="FAQ" />
            <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.1] mb-3">
              Domande<br /><span className="text-vibrant-gradient">Frequenti</span>
            </h2>
            <p className="text-sm text-foreground/35 leading-[1.7] max-w-xs mx-auto lg:mx-0">
              Tutto su Empire: settori, costi, sicurezza e partnership.
            </p>
          </motion.div>

          <motion.div className="space-y-2.5 w-full"
            variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {faqs.map((faq, i) => (
              <motion.div key={i} className="rounded-xl future-card overflow-hidden" variants={fadeUp}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-foreground/[0.02] transition-colors">
                  <span className="text-xs sm:text-sm font-semibold text-foreground pr-3 font-heading">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }}
                    className="w-6 h-6 rounded-full bg-primary/[0.06] flex items-center justify-center flex-shrink-0 text-primary text-xs font-heading">
                    +
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="px-4 pb-4 text-xs sm:text-sm text-foreground/40 leading-[1.65]">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ═══════ FINAL CTA ═══════ */}
      <Section>
        <div className="relative text-center p-8 sm:p-14 rounded-2xl bg-gradient-to-br from-primary/[0.08] to-accent/[0.03] border border-primary/10 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,hsla(263,70%,58%,0.06)_0%,transparent_50%)] animate-blob-float-slow pointer-events-none" />
          <div className="relative z-10">
            <Crown className="w-10 h-10 mx-auto text-primary mb-5 drop-shadow-[0_0_30px_hsla(263,70%,58%,0.25)]" />
            <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.1] mb-3">
              Pronto a Costruire il Tuo <span className="text-vibrant-gradient">Impero?</span>
            </h2>
            <p className="text-xs sm:text-sm text-foreground/35 max-w-md mx-auto mb-6">
              Ristoranti, saloni, studi medici, NCC, negozi, palestre, hotel — i competitor si stanno digitalizzando. Non restare indietro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => navigate("/admin")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_15px_50px_hsla(263,70%,58%,0.3)] transition-all flex items-center justify-center gap-2">
                Sono un Imprenditore <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => navigate("/partner/register")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-border/20 text-foreground/70 font-bold text-sm font-heading tracking-wide hover:border-primary/25 hover:text-foreground transition-all">
                Diventa Partner
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ FOOTER ═══════ */}
      <footer id="contact" className="border-t border-primary/[0.06] py-12 pb-8 px-5 sm:px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-10 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-vibrant-gradient flex items-center justify-center shadow-[0_0_12px_hsla(263,70%,58%,0.2)]">
                  <Crown className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-foreground tracking-[0.12em] uppercase text-xs">Empire<span className="text-primary">.AI</span></span>
              </div>
              <p className="text-[0.65rem] text-foreground/30 leading-[1.7] max-w-[240px] mb-4">
                La piattaforma AI multi-settore che trasforma qualsiasi attività in un impero digitale di proprietà.
              </p>
              <div className="flex gap-2">
                {["In", "𝕏", "IG"].map((s, i) => (
                  <div key={i} className="w-7 h-7 rounded-md border border-primary/[0.08] flex items-center justify-center text-[0.6rem] text-foreground/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer">{s}</div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.6rem] font-semibold text-foreground/40 mb-3 tracking-[3px] uppercase">Settori</h4>
              <div className="space-y-2 text-[0.65rem] text-foreground/30">
                <p>Food & Ristorazione</p>
                <p>NCC & Trasporto</p>
                <p>Beauty & Wellness</p>
                <p>Healthcare</p>
                <p>Retail, Fitness, Hospitality</p>
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.6rem] font-semibold text-foreground/40 mb-3 tracking-[3px] uppercase">Risorse</h4>
              <div className="space-y-2 text-[0.65rem]">
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
              <h4 className="font-heading text-[0.6rem] font-semibold text-foreground/40 mb-3 tracking-[3px] uppercase">Contatti & Legale</h4>
              <div className="space-y-2 text-[0.65rem]">
                <p className="text-foreground/30 flex items-center gap-1.5"><Mail className="w-2.5 h-2.5" /> info@empire-suite.it</p>
                <p className="text-foreground/30 flex items-center gap-1.5"><MapPin className="w-2.5 h-2.5" /> Roma, Italia</p>
                <a href="/privacy" className="block text-foreground/30 hover:text-primary transition-colors mt-2">Privacy Policy</a>
                <a href="/cookie-policy" className="block text-foreground/30 hover:text-primary transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>

          <div className="border-t border-primary/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.6rem] text-foreground/20">
            <p>© 2026 Empire AI · Piattaforma Multi-Settore</p>
            <div className="flex gap-5">
              <a href="/privacy" className="hover:text-foreground/40 transition-colors">Privacy</a>
              <a href="/cookie-policy" className="hover:text-foreground/40 transition-colors">Cookie</a>
              <span>P.IVA IT12345678901</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════ STICKY CTA MOBILE ═══════ */}
      <motion.div className="fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] bg-background/85 backdrop-blur-2xl border-t border-primary/[0.06] md:hidden"
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 2, type: "spring", damping: 25 }}>
        <div className="flex gap-2">
          <button onClick={() => scrollTo("pricing")}
            className="flex-1 py-3 rounded-xl bg-vibrant-gradient text-primary-foreground font-bold text-sm tracking-wider font-heading uppercase">
            Inizia Ora
          </button>
          <button onClick={() => navigate("/r/impero-roma")}
            className="px-3.5 py-3 rounded-xl border border-primary/15 text-primary">
            <Play className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
