import { useState, useEffect, useRef, forwardRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Crown, Check, Star, Zap, Shield, Smartphone,
  TrendingUp, X, Sparkles, Lock, Menu, Target, DollarSign, Brain,
  ChefHat, AlertTriangle, Banknote, ArrowDown, ArrowRight,
  MessageCircle, ChevronDown, Play, Gem, Users, Rocket,
  Gift, Trophy, Award, Handshake, Quote,
  BarChart3, QrCode, Bell, Wallet, MapPin, Eye, Bot,
  Palette, Mail, Car, Scissors, Heart, Store, Dumbbell, Building,
  Calendar, Package, CreditCard, Route, ClipboardCheck, Headphones
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
    <section ref={ref} id={id} className={`relative py-20 sm:py-28 px-6 overflow-hidden ${className}`}>
      <div className="max-w-[1200px] mx-auto relative z-10">{children}</div>
    </section>
  )
);
Section.displayName = "Section";

const SectionLabel = ({ text }: { text: string }) => (
  <motion.div
    className="inline-flex items-center gap-2 mb-6"
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
  >
    <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/60" />
    <span className="text-[0.7rem] font-heading font-semibold tracking-[4px] uppercase text-primary/80">{text}</span>
    <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/60" />
  </motion.div>
);

const smoothEase = [0.22, 1, 0.36, 1] as const;
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } } };
const fadeScale = { hidden: { opacity: 0, y: 20, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: smoothEase } } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } };
const staggerFast = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const slideInLeft = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: smoothEase } } };
const slideInRight = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: smoothEase } } };
const popIn = { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 180, damping: 22 } } };

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
    { icon: <ChefHat className="w-6 h-6" />, title: "Food & Ristorazione", desc: "Ristoranti, pizzerie, bar, pasticcerie, sushi bar", color: "from-orange-500/20 to-amber-500/10" },
    { icon: <Car className="w-6 h-6" />, title: "NCC & Trasporto", desc: "Noleggio con conducente, transfer, limousine service", color: "from-blue-500/20 to-cyan-500/10" },
    { icon: <Scissors className="w-6 h-6" />, title: "Beauty & Wellness", desc: "Saloni, centri estetici, SPA, barbieri", color: "from-pink-500/20 to-rose-500/10" },
    { icon: <Heart className="w-6 h-6" />, title: "Healthcare", desc: "Studi medici, dentisti, fisioterapisti, cliniche", color: "from-emerald-500/20 to-green-500/10" },
    { icon: <Store className="w-6 h-6" />, title: "Retail & Negozi", desc: "Negozi, boutique, e-commerce locale", color: "from-yellow-500/20 to-amber-500/10" },
    { icon: <Dumbbell className="w-6 h-6" />, title: "Fitness & Sport", desc: "Palestre, centri sportivi, personal trainer", color: "from-red-500/20 to-orange-500/10" },
    { icon: <Building className="w-6 h-6" />, title: "Hospitality", desc: "Hotel, B&B, agriturismi, resort", color: "from-sky-500/20 to-blue-500/10" },
  ];

  const services = [
    { icon: <Brain className="w-6 h-6" />, title: "AI Business Engine", desc: "L'intelligenza artificiale analizza il tuo business, genera cataloghi, ottimizza prezzi e automatizza le operazioni ripetitive. Risparmia ore ogni giorno.", tag: "IA" },
    { icon: <Smartphone className="w-6 h-6" />, title: "App White Label", desc: "Un'app professionale installabile con il TUO brand, i tuoi colori, il tuo dominio. Nessun logo di terzi. I clienti interagiscono solo con te.", tag: "APP" },
    { icon: <Calendar className="w-6 h-6" />, title: "Prenotazioni & Ordini", desc: "Gestisci appuntamenti, ordini, prenotazioni corse o camere da un unico pannello. Notifiche in tempo reale, zero sovrapposizioni.", tag: "OPS" },
    { icon: <Shield className="w-6 h-6" />, title: "Review Shield™", desc: "Le recensioni negative restano nel tuo archivio privato. Solo le migliori costruiscono la tua reputazione pubblica. Protezione totale del brand.", tag: "BRAND" },
    { icon: <Users className="w-6 h-6" />, title: "CRM & Fidelizzazione", desc: "Conosci ogni cliente per nome: storico acquisti, preferenze, wallet fedeltà. Trasforma i visitatori occasionali in clienti ricorrenti.", tag: "GROWTH" },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Analytics & Finance", desc: "Dashboard fatturato, margini, performance staff, trend di vendita. Fatturazione elettronica integrata. Decisioni basate sui dati, non sull'istinto.", tag: "FINANCE" },
    { icon: <Package className="w-6 h-6" />, title: "Inventario & HACCP", desc: "Monitora scorte, ricevi alert automatici, registra controlli igienico-sanitari. Conformità normativa senza burocrazia.", tag: "COMPLIANCE" },
    { icon: <Palette className="w-6 h-6" />, title: "Social & Marketing", desc: "Crea e programma post per Instagram, Facebook e Google. Campagne push notification e promozioni mirate per riempire l'agenda.", tag: "MARKETING" },
    { icon: <Lock className="w-6 h-6" />, title: "Sicurezza Enterprise", desc: "Crittografia AES-256, GDPR compliant, backup automatici, accessi multi-ruolo. I tuoi dati e quelli dei tuoi clienti sono al sicuro.", tag: "SECURITY" },
  ];

  const metrics = [
    { value: 200, suffix: "+", label: "Attività Attive" },
    { value: 7, suffix: "", label: "Settori Coperti" },
    { value: 45, suffix: "%", prefix: "+", label: "Aumento Fatturato" },
    { value: 98, suffix: "%", label: "Soddisfazione Clienti" },
  ];

  const testimonials = [
    { name: "Marco Pellegrini", role: "Trattoria da Marco · Roma", quote: "In 3 mesi ho spostato il 60% degli ordini dalla piattaforma alla mia app. Risparmio €3.200 al mese netti, e i clienti sono finalmente MIEI.", metric: "−€3.200/mese", industry: "Food" },
    { name: "Alessandra Conti", role: "NCC Premium Transfer · Milano", quote: "Prima gestivo le prenotazioni via WhatsApp. Ora ho un sistema automatizzato con flotta, tratte e pagamenti integrati. Il fatturato è cresciuto del 40%.", metric: "+40% fatturato", industry: "NCC" },
    { name: "Valentina Rossi", role: "Beauty Lab · Firenze", quote: "I clienti prenotano direttamente dall'app, ricevono promemoria automatici e il no-show è crollato del 70%. Non tornerei mai indietro.", metric: "−70% no-show", industry: "Beauty" },
    { name: "Dr. Luca Bianchi", role: "Studio Dentistico Bianchi · Torino", quote: "Agenda digitale, schede paziente, fatturazione elettronica. Ho eliminato 2 ore di burocrazia al giorno. Il mio team è finalmente libero di lavorare.", metric: "−2h/giorno", industry: "Healthcare" },
    { name: "Simone Moretti", role: "CrossFit Arena · Bologna", quote: "Gestione corsi, abbonamenti e pagamenti in un'unica piattaforma. I membri si iscrivono dall'app e il tasso di rinnovo è salito all'87%.", metric: "87% rinnovi", industry: "Fitness" },
    { name: "Giulia De Luca", role: "Boutique Eleganza · Napoli", quote: "Il catalogo digitale ha trasformato il mio negozio. I clienti sfogliano i prodotti dall'app, ordinano e ritirano. Le vendite online sono il 35% del totale.", metric: "+35% vendite", industry: "Retail" },
  ];

  const faqs = [
    { q: "Per quali settori funziona Empire?", a: "Empire è una piattaforma multi-settore: ristoranti, NCC e trasporti, saloni di bellezza, studi medici, negozi, palestre e hotel. Ogni settore ha moduli, terminologia e flussi dedicati che si attivano automaticamente." },
    { q: "È difficile da usare?", a: "No. Se sai usare Instagram, sai usare Empire. L'interfaccia si adatta al tuo settore con terminologia e funzionalità specifiche. L'IA fa il lavoro pesante: carica una foto e in 60 secondi hai il tuo catalogo digitale." },
    { q: "Come funzionano i pagamenti?", a: "I pagamenti arrivano direttamente sul TUO conto via Stripe Connect. Non tocchiamo mai i tuoi soldi. L'unica trattenuta è il 2% automatico — 15× meno delle piattaforme tradizionali." },
    { q: "Quanto costa davvero?", a: "€2.997 una tantum (o 3 rate da €1.099). Dopodiché €0/mese per sempre. Solo il 2% sulle transazioni per infrastruttura, IA e aggiornamenti continui. Nessun vincolo, nessun costo nascosto." },
    { q: "I miei dati sono al sicuro?", a: "Sì. Crittografia AES-256, conformità GDPR, backup automatici e accessi multi-ruolo. Standard enterprise anche per la piccola attività." },
    { q: "Posso provare prima di comprare?", a: "Certo. Offriamo una demo live gratuita dove configuriamo la piattaforma per il tuo settore specifico. Vedi esattamente come funzionerà per la tua attività prima di investire." },
    { q: "Come funziona il Partner Program?", a: "Diventi Partner gratis. Guadagni €997 per ogni vendita completata + bonus fino a €1.500/mese. Pagamenti istantanei via Stripe Connect. Nessun rischio, nessun investimento." },
  ];

  const navLinks = [
    { href: "#industries", label: "Settori" },
    { href: "#services", label: "Funzionalità" },
    { href: "#pricing", label: "Prezzi" },
    { href: "#partner", label: "Partner" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">

      {/* ═══════ AMBIENT LIGHT ═══════ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[800px] h-[800px] rounded-full blur-[200px] opacity-[0.07] bg-primary -top-[400px] -left-[200px] animate-blob-float" />
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.05] bg-accent top-[50vh] -right-[200px] animate-blob-float-reverse" />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.04] bg-primary bottom-[20vh] left-[30%] animate-blob-float-slow" />
      </div>

      {/* ═══════ NAVIGATION ═══════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${navScrolled ? "bg-background/80 backdrop-blur-2xl border-b border-border/20 py-3" : "py-5"}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-vibrant-gradient flex items-center justify-center shadow-[0_0_20px_hsla(263,70%,58%,0.3)] group-hover:shadow-[0_0_30px_hsla(263,70%,58%,0.5)] transition-shadow">
              <Crown className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-sm tracking-[0.15em] uppercase text-foreground">Empire<span className="text-primary">.AI</span></span>
          </a>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map(link => (
              <a key={link.href} href={link.href}
                className="relative text-[0.82rem] font-medium text-foreground/50 hover:text-foreground transition-colors duration-300 group tracking-wide">
                {link.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[1.5px] bg-primary group-hover:w-full transition-all duration-400" />
              </a>
            ))}
            <button onClick={() => scrollTo("contact")}
              className="px-6 py-2.5 rounded-full bg-vibrant-gradient text-primary-foreground text-xs font-bold font-heading tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.35)] transition-all duration-300">
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
              <div className="flex flex-col items-center gap-1 py-6 px-6">
                {navLinks.map(link => (
                  <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3.5 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors font-heading tracking-widest uppercase">
                    {link.label}
                  </a>
                ))}
                <button onClick={() => { scrollTo("contact"); setMobileMenuOpen(false); }}
                  className="mt-4 w-full py-3.5 rounded-xl bg-vibrant-gradient text-primary-foreground text-sm font-bold tracking-widest uppercase font-heading">
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
      <section id="hero" className="relative min-h-[100dvh] flex items-center overflow-hidden px-6 pt-24 pb-20">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(hsla(210,40%,97%,0.1) 1px, transparent 1px), linear-gradient(90deg, hsla(210,40%,97%,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="relative z-10 max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col items-center text-center max-w-[900px] mx-auto">
            <motion.div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-8"
              initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
              <span className="text-[0.7rem] font-heading font-medium text-primary/90 tracking-[2px] uppercase">Piattaforma AI Multi-Settore</span>
            </motion.div>

            <motion.h1
              className="text-[2.5rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-heading font-bold text-foreground tracking-[-0.02em]"
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.15, ease: smoothEase }}>
              La Tua Attività Merita
              <br />
              <span className="text-vibrant-gradient">il Suo Impero Digitale</span>
            </motion.h1>

            <motion.p className="mt-6 text-base sm:text-lg text-foreground/50 max-w-[640px] leading-[1.8] font-light"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
              Che tu gestisca un ristorante, un servizio NCC, un salone di bellezza, uno studio medico o un negozio —
              <span className="text-foreground/70 font-normal"> Empire ti dà un ecosistema digitale completo, con IA integrata, senza commissioni predatorie.</span>
            </motion.p>

            <motion.div className="mt-10 flex flex-col sm:flex-row items-center gap-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <button onClick={() => scrollTo("pricing")}
                className="group relative w-full sm:w-auto px-8 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_hsla(263,70%,58%,0.35)]">
                <span className="absolute inset-0 bg-gradient-to-r from-foreground/0 via-foreground/10 to-foreground/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative flex items-center gap-2.5">Prenota una Demo Gratuita <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
              </button>
              <button onClick={() => navigate("/r/impero-roma")}
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-border/30 text-foreground/80 text-sm font-semibold font-heading tracking-wide hover:border-primary/30 hover:text-foreground hover:bg-primary/[0.04] transition-all flex items-center justify-center gap-2.5">
                <Play className="w-3.5 h-3.5 text-primary" /> Vedi Demo Live
              </button>
            </motion.div>

            <motion.div className="mt-16 w-full grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-border/20"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              {metrics.map((m, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl sm:text-3xl font-heading font-bold text-vibrant-gradient">
                    <AnimatedNumber value={m.value} prefix={m.prefix} suffix={m.suffix} />
                  </p>
                  <p className="text-[0.7rem] text-foreground/40 mt-1 tracking-wider uppercase font-heading">{m.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          <span className="text-[9px] text-foreground/25 tracking-[4px] uppercase font-heading">Scopri</span>
          <ArrowDown className="w-4 h-4 text-primary/30" />
        </motion.div>
      </section>

      {/* ═══════ TRUST MARQUEE ═══════ */}
      <div className="relative py-6 border-y border-border/10 overflow-hidden bg-foreground/[0.01]">
        <div className="flex animate-marquee-scroll whitespace-nowrap">
          {[...Array(2)].map((_, repeat) => (
            <div key={repeat} className="flex items-center gap-12 px-6">
              {["Stripe Connect", "AES-256 Encryption", "PWA Certified", "GDPR Compliant", "99.9% Uptime", "AI-Powered", "Made in Italy", "White Label", "Multi-Settore", "7 Industrie"].map((t, i) => (
                <span key={i} className="text-[0.7rem] text-foreground/20 font-heading tracking-[3px] uppercase flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/30" />
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
        <div className="text-center mb-14">
          <SectionLabel text="Multi-Settore" />
          <motion.h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1] mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Una Piattaforma, <span className="text-vibrant-gradient">Ogni Settore</span>
          </motion.h2>
          <motion.p className="text-foreground/45 max-w-[560px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Empire si adatta automaticamente alla tua industria: terminologia, moduli, flussi operativi e dashboard cambiano in base al settore. Un solo investimento, infinite possibilità.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {industries.map((ind, i) => (
            <motion.div key={i}
              className="group relative p-6 rounded-3xl luxury-card hover:-translate-y-2 transition-all duration-500 text-center"
              variants={fadeScale}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ind.color} border border-primary/10 flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-500`}>
                {ind.icon}
              </div>
              <h3 className="font-heading text-sm font-bold text-foreground mb-1.5">{ind.title}</h3>
              <p className="text-[0.7rem] text-foreground/40 leading-[1.5]">{ind.desc}</p>
            </motion.div>
          ))}
          {/* CTA card */}
          <motion.div
            className="group relative p-6 rounded-3xl border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all duration-500 text-center flex flex-col items-center justify-center cursor-pointer"
            variants={fadeScale}
            onClick={() => scrollTo("contact")}>
            <Sparkles className="w-8 h-8 text-primary/40 mb-3 group-hover:text-primary transition-colors" />
            <p className="text-sm font-heading font-semibold text-foreground/50 group-hover:text-foreground transition-colors">Il tuo settore?</p>
            <p className="text-[0.65rem] text-primary/60 mt-1">Contattaci →</p>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          PROBLEMA
         ═══════════════════════════════════════════ */}
      <Section id="problem">
        <div className="text-center mb-14">
          <SectionLabel text="Il Problema" />
          <motion.h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1] mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Stai Pagando Troppo per <span className="text-vibrant-gradient">Strumenti Sbagliati</span>
          </motion.h2>
          <motion.p className="text-foreground/45 max-w-[560px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Commissioni dei marketplace, canoni mensili di 5 software diversi, gestione manuale caotica. Il tuo margine di profitto si dissolve ogni mese.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {[
            { icon: <Banknote className="w-7 h-7" />, amount: "30%", label: "Margini erosi dai marketplace", sub: "Commissioni predatorie su ogni transazione" },
            { icon: <DollarSign className="w-7 h-7" />, amount: "€500+", label: "Canoni mensili software", sub: "Booking, CRM, fatture, marketing: 5 abbonamenti separati" },
            { icon: <Target className="w-7 h-7" />, amount: "0%", label: "Controllo sui dati clienti", sub: "I tuoi clienti appartengono alla piattaforma, non a te" },
          ].map((item, i) => (
            <motion.div key={i}
              className="group relative p-8 rounded-3xl luxury-card hover:-translate-y-2 transition-all duration-500 text-center"
              variants={fadeScale}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/15 flex items-center justify-center text-primary mx-auto mb-5 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
              <p className="text-4xl font-heading font-bold text-vibrant-gradient mb-2">{item.amount}</p>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-foreground/40 mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          SERVIZI / FUNZIONALITÀ
         ═══════════════════════════════════════════ */}
      <Section id="services">
        <div className="text-center mb-14">
          <SectionLabel text="Funzionalità" />
          <motion.h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1] mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Tutto Ciò Che Serve al Tuo<br className="hidden sm:block" />
            <span className="text-vibrant-gradient">Business, in un Unico Posto</span>
          </motion.h2>
          <motion.p className="text-foreground/45 max-w-[560px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Ogni modulo si attiva automaticamente in base al tuo settore. Nessun software esterno, nessuna integrazione complessa.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {services.map((s, i) => (
            <motion.div key={i}
              className="group relative p-7 rounded-3xl luxury-card hover:-translate-y-2 transition-all duration-500"
              variants={fadeUp}>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/15 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  {s.icon}
                </div>
                <span className="text-[0.6rem] px-2.5 py-1 rounded-full border border-primary/15 text-primary/70 font-bold tracking-[2px] font-heading">{s.tag}</span>
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-foreground/45 leading-[1.7]">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          COME FUNZIONA
         ═══════════════════════════════════════════ */}
      <Section id="process">
        <div className="text-center mb-14">
          <SectionLabel text="Processo" />
          <motion.h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1]"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Attivo in <span className="text-vibrant-gradient">4 Semplici Step</span>
          </motion.h2>
        </div>

        <motion.div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          <div className="hidden lg:block absolute top-[36px] left-[calc(12.5%+36px)] right-[calc(12.5%+36px)] h-[1px] bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 z-0" />

          {[
            { step: "01", title: "Scegli il Settore", desc: "Seleziona la tua industria. Empire configura automaticamente moduli, terminologia e flussi operativi dedicati." },
            { step: "02", title: "Personalizza il Brand", desc: "Logo, colori, nome, dominio. L'IA genera catalogo e contenuti in 60 secondi. La tua identità, zero compromessi." },
            { step: "03", title: "Lancia & Forma il Team", desc: "Attiviamo la tua app, formiamo il personale e installiamo QR code o link diretti. Operativo in 24 ore." },
            { step: "04", title: "Cresci con i Dati", desc: "Analytics in tempo reale, suggerimenti IA, campagne automatizzate. Il tuo business evolve ogni giorno." },
          ].map((s, i) => (
            <motion.div key={i} className="relative text-center z-10" variants={popIn}>
              <div className="relative w-[72px] h-[72px] rounded-full bg-background border-2 border-primary/20 flex items-center justify-center mx-auto mb-5 group">
                <span className="font-heading font-bold text-xl text-primary/60">{s.step}</span>
                <div className="absolute inset-0 rounded-full bg-primary/5" />
              </div>
              <h3 className="font-heading text-sm font-bold text-foreground mb-2 tracking-wide">{s.title}</h3>
              <p className="text-xs text-foreground/45 leading-[1.6]">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          APP SHOWCASE
         ═══════════════════════════════════════════ */}
      <Section id="app">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionLabel text="Ecosistema" />
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1] mb-5">
              Un Ecosistema Completo,<br /><span className="text-vibrant-gradient">di Tua Proprietà</span>
            </h2>
            <p className="text-foreground/45 leading-[1.7] max-w-lg mb-8 text-sm">
              App cliente, pannello gestionale e vista operativa — tutto white-label con il tuo brand. Funziona per ogni settore: dal menu digitale alla gestione flotta, dagli appuntamenti alle prenotazioni camere.
            </p>
            <div className="space-y-4 mb-8">
              {[
                { title: "Ordini, Prenotazioni & Appuntamenti", desc: "Un unico sistema per gestire transazioni di qualsiasi tipo — adattato al tuo settore" },
                { title: "CRM & Programma Fedeltà", desc: "Wallet pass, reward automatici, storico cliente. Trasforma ogni visita in un ritorno" },
                { title: "Comunicazione Diretta", desc: "Push notification, chat privata, promozioni mirate. I tuoi clienti, il tuo canale" },
                { title: "Pannello Operativo Real-Time", desc: "Cucina, autisti, operatori, staff — dashboard live per eliminare errori e ritardi" },
              ].map((f, i) => (
                <motion.div key={i} className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="w-6 h-6 min-w-[24px] rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-medium">{f.title}</p>
                    <p className="text-xs text-foreground/40 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button onClick={() => navigate("/r/impero-roma")}
              className="group px-7 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.35)] transition-all inline-flex items-center gap-2.5">
              Prova la Demo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex justify-center items-end gap-3 sm:gap-5 relative">
              <div className="absolute -inset-16 bg-primary/[0.06] rounded-[80px] blur-[100px] pointer-events-none" />
              {[
                { label: "Cliente", img: mockupCliente, h: "h-[320px] sm:h-[380px]" },
                { label: "Gestionale", img: mockupAdmin, h: "h-[360px] sm:h-[420px]" },
                { label: "Operativo", img: mockupCucina, h: "h-[320px] sm:h-[380px]" },
              ].map((phone, i) => (
                <motion.div key={i}
                  className={`relative w-[100px] sm:w-[130px] ${phone.h} rounded-[20px] sm:rounded-[24px] overflow-hidden border-2 border-foreground/[0.08] bg-card shadow-[0_20px_60px_hsla(0,0%,0%,0.5)]`}
                  initial={{ y: 30 + i * 10 }} whileInView={{ y: i === 1 ? -10 : 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.8, ease: smoothEase }}>
                  <img src={phone.img} alt={phone.label} className="w-full h-full object-cover object-top" loading="lazy" />
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-background/90 to-transparent" />
                  <span className="absolute bottom-2.5 left-0 right-0 text-center text-[0.6rem] font-heading font-bold tracking-[2px] uppercase text-foreground/50">{phone.label}</span>
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
        <div className="text-center mb-12">
          <SectionLabel text="ROI Calculator" />
          <motion.h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1] mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Calcola Quanto <span className="text-vibrant-gradient">Stai Perdendo</span>
          </motion.h2>
          <motion.p className="text-foreground/45 max-w-[500px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Inserisci i dati della tua attività e scopri quanto risparmi passando a Empire.
          </motion.p>
        </div>

        <motion.div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl luxury-card space-y-6"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {[
            { label: "Transazioni al mese", value: monthlyOrders, min: 100, max: 3000, step: 50, display: monthlyOrders.toString(), onChange: setMonthlyOrders },
            { label: "Valore medio transazione", value: avgOrder, min: 10, max: 80, step: 5, display: `€${avgOrder}`, onChange: setAvgOrder },
          ].map((sl, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-foreground/50 font-heading text-xs tracking-wider uppercase">{sl.label}</span>
                <span className="text-foreground font-bold font-heading">{sl.display}</span>
              </div>
              <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.value}
                onChange={e => sl.onChange(Number(e.target.value))} className="w-full accent-primary h-1.5 rounded-full bg-border/30" />
            </div>
          ))}

          <div className="space-y-4 pt-6 border-t border-border/15">
            {[
              { label: "Piattaforme terze (30%)", value: thirdPartyCost, pct: "30%", width: 100, color: "accent" },
              { label: "Empire (2%)", value: empireCost, pct: "2%", width: Math.max(5, (empireCost / thirdPartyCost) * 100), color: "primary" },
            ].map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground/40 text-xs">{bar.label}</span>
                  <span className={`text-${bar.color} font-heading font-bold text-sm`}>-€{bar.value.toLocaleString("it-IT", { maximumFractionDigits: 0 })}/mese</span>
                </div>
                <div className="h-3 rounded-full bg-foreground/[0.04] overflow-hidden">
                  <motion.div className={`h-full rounded-full bg-gradient-to-r from-${bar.color}/40 to-${bar.color}/60`}
                    initial={{ width: 0 }} whileInView={{ width: `${bar.width}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 + i * 0.2 }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/[0.06] to-accent/[0.03] border border-primary/15 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/60">Risparmi / mese</span>
              <span className="text-2xl font-heading font-bold text-primary">€{monthlySaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/60">Risparmi / anno</span>
              <span className="text-2xl font-heading font-bold text-vibrant-gradient">€{yearSaving.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-primary/15">
              <span className="text-xs text-foreground/40">ROI completo in</span>
              <span className="text-foreground font-heading font-bold">{roiMonths} {roiMonths === 1 ? "mese" : "mesi"}</span>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
         ═══════════════════════════════════════════ */}
      <Section id="testimonials">
        <div className="text-center mb-14">
          <SectionLabel text="Storie di Successo" />
          <motion.h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1] mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Risultati Reali, <span className="text-vibrant-gradient">Settori Diversi</span>
          </motion.h2>
          <motion.p className="text-foreground/45 max-w-[500px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Imprenditori come te che hanno trasformato la loro attività con Empire.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {testimonials.map((t, i) => (
            <motion.div key={i} className="group p-7 rounded-3xl luxury-card hover:-translate-y-2 transition-all duration-500"
              variants={fadeUp}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />)}
                </div>
                <span className="text-[0.6rem] px-2 py-0.5 rounded-full bg-primary/[0.08] text-primary/70 font-bold tracking-wider font-heading">{t.industry}</span>
              </div>
              <Quote className="w-5 h-5 text-primary/20 mb-3" />
              <blockquote className="text-sm text-foreground/60 leading-[1.7] mb-6">"{t.quote}"</blockquote>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/[0.08] text-[0.65rem] text-primary font-bold mb-5 font-heading tracking-wider">
                <TrendingUp className="w-3 h-3" /> {t.metric}
              </div>
              <div className="flex items-center gap-3 border-t border-border/10 pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center text-foreground/60 text-xs font-bold font-heading">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-heading text-xs font-semibold text-foreground">{t.name}</h4>
                  <p className="text-[0.65rem] text-foreground/40">{t.role}</p>
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
        <div className="text-center mb-14">
          <SectionLabel text="Investimento" />
          <motion.h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1] mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Un Solo Pagamento,<br /><span className="text-vibrant-gradient">Valore Per Sempre</span>
          </motion.h2>
          <motion.p className="text-foreground/45 max-w-[520px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Niente canoni mensili. Niente vincoli. Il tuo asset digitale di proprietà, per qualsiasi settore.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {/* Main plan */}
          <motion.div className="relative p-8 sm:p-10 rounded-3xl overflow-hidden bg-gradient-to-b from-primary/[0.08] to-background border border-primary/20"
            variants={fadeScale}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-vibrant-gradient" />
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-vibrant-gradient text-[0.6rem] font-bold text-primary-foreground tracking-[2px] font-heading uppercase">Più Scelto</div>
            <span className="text-[0.65rem] font-heading font-semibold text-primary/70 tracking-[3px] uppercase">Pagamento Unico</span>
            <p className="text-5xl font-heading font-bold text-foreground mt-3">€2.997</p>
            <p className="text-xs text-foreground/40 mt-1">IVA 22% inclusa · Una volta sola</p>
            <ul className="mt-8 space-y-3 mb-8">
              {[
                "Asset Digitale di Tua Proprietà",
                "App White Label (logo, colori, dominio)",
                "AI Engine — catalogo automatico in 60s",
                "Moduli adattivi per il tuo settore",
                "CRM, Loyalty, Push Notification",
                "Dashboard Analytics & Fatturazione",
                "Review Shield™ & Protezione Brand",
                "Sicurezza AES-256 & GDPR",
                "Assistenza dedicata a vita",
                "Zero canoni mensili per sempre",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-foreground/60">
                  <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate("/admin")}
              className="w-full py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.35)] hover:-translate-y-0.5 transition-all">
              Inizia il Tuo Impero
            </button>
            <p className="mt-3 text-[0.65rem] text-center text-foreground/30">Dopo: €0/mese · Solo 2% sulle transazioni</p>
          </motion.div>

          {/* Installment plan */}
          <motion.div className="relative p-8 sm:p-10 rounded-3xl luxury-card"
            variants={fadeScale}>
            <span className="text-[0.65rem] font-heading font-semibold text-foreground/40 tracking-[3px] uppercase">3 Rate Comode</span>
            <p className="text-4xl font-heading font-bold text-foreground mt-3">€1.099<span className="text-base text-foreground/40 font-normal">/mese</span></p>
            <p className="text-xs text-foreground/40 mt-1">Totale: €3.297 · IVA inclusa</p>
            <ul className="mt-8 space-y-3 mb-8">
              {["Tutte le funzionalità incluse", "Massima flessibilità di pagamento", "Attivazione immediata alla prima rata", "Nessun vincolo, cancella quando vuoi"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-foreground/50">
                  <div className="w-4 h-4 rounded-full bg-foreground/[0.06] flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-foreground/40" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate("/admin")}
              className="w-full py-4 rounded-full border border-primary/20 text-primary font-bold text-sm font-heading tracking-wider uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Scegli 3 Rate
            </button>
          </motion.div>
        </motion.div>

        <motion.p className="text-center mt-8 text-xs text-foreground/30 max-w-xl mx-auto"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <span className="text-foreground/50 font-semibold">Dopo l'attivazione:</span> €0/mese · Solo <span className="text-primary font-bold">2%</span> sulle transazioni per infrastruttura, IA e aggiornamenti continui.
        </motion.p>
      </Section>

      {/* ═══════════════════════════════════════════
          PARTNER PROGRAM
         ═══════════════════════════════════════════ */}
      <Section id="partner">
        <div className="text-center mb-14">
          <SectionLabel text="Partner Program" />
          <motion.h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1] mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Guadagna Vendendo <span className="text-vibrant-gradient">Empire</span>
          </motion.h2>
          <motion.p className="text-foreground/45 max-w-[520px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Diventa partner commerciale. Presenta Empire a ristoranti, saloni, studi medici, NCC e negozi. Guadagna su ogni vendita chiusa. Zero investimento, zero rischi.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
          variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {[
            { value: "€997", label: "Per vendita", icon: <Trophy className="w-5 h-5" /> },
            { value: "€50", label: "Override TL", icon: <Award className="w-5 h-5" /> },
            { value: "€500", label: "Bonus 3 vendite", icon: <Gift className="w-5 h-5" /> },
            { value: "€1.500", label: "Bonus Elite", icon: <Rocket className="w-5 h-5" /> },
          ].map((s, i) => (
            <motion.div key={i} className="p-6 rounded-3xl luxury-card text-center hover:-translate-y-2 transition-all duration-500"
              variants={popIn}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">{s.icon}</div>
              <p className="text-xl font-heading font-bold text-vibrant-gradient">{s.value}</p>
              <p className="text-[0.65rem] text-foreground/50 mt-1 tracking-wider uppercase font-heading">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Career path */}
        <motion.div className="p-6 rounded-3xl luxury-card mb-10"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="font-heading font-bold text-xs text-foreground/60 text-center mb-6 tracking-[3px] uppercase">Percorso di Carriera</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0">
            {[
              { title: "Partner", desc: "€997 per ogni vendita chiusa", icon: <Handshake className="w-5 h-5" /> },
              { title: "3 Vendite", desc: "Promozione automatica", icon: <TrendingUp className="w-5 h-5" /> },
              { title: "Team Leader", desc: "+€50 override su ogni vendita del team", icon: <Crown className="w-5 h-5" /> },
            ].map((s, i) => (
              <div key={i} className="flex sm:flex-col items-center gap-3 text-center w-full sm:w-auto">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{s.icon}</div>
                <div className="text-left sm:text-center">
                  <p className="text-sm font-bold text-foreground font-heading">{s.title}</p>
                  <p className="text-xs text-foreground/40">{s.desc}</p>
                </div>
                {i < 2 && <ArrowRight className="hidden sm:block w-5 h-5 text-primary/20 mx-8 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scenario card */}
        <motion.div className="p-6 rounded-3xl luxury-card max-w-md mx-auto"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="font-heading font-bold text-xs text-foreground/60 text-center mb-4 tracking-[3px] uppercase">Scenario: 5 vendite/mese</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-foreground/40">5× Commissioni</span><span className="font-bold text-foreground">€4.985</span></div>
            <div className="flex justify-between"><span className="text-foreground/40">Bonus Elite (5+ vendite)</span><span className="font-bold text-foreground">€1.500</span></div>
            <div className="flex justify-between pt-4 border-t border-border/15">
              <span className="font-semibold text-foreground">Totale mensile</span>
              <span className="text-2xl font-heading font-bold text-vibrant-gradient">€6.485</span>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <button onClick={() => navigate("/partner/register")}
            className="px-8 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_12px_40px_hsla(263,70%,58%,0.35)] transition-all inline-flex items-center gap-2.5">
            Diventa Partner <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          FAQ
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionLabel text="FAQ" />
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1] mb-4">
              Domande<br /><span className="text-vibrant-gradient">Frequenti</span>
            </h2>
            <p className="text-sm text-foreground/40 leading-[1.7]">
              Tutto quello che devi sapere su Empire: settori, costi, sicurezza e partnership.
            </p>
          </motion.div>

          <motion.div className="space-y-3"
            variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {faqs.map((faq, i) => (
              <motion.div key={i} className="rounded-2xl luxury-card overflow-hidden" variants={fadeUp}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-foreground/[0.02] transition-colors">
                  <span className="text-sm font-semibold text-foreground pr-4 font-heading">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }}
                    className="w-7 h-7 rounded-full bg-primary/[0.08] flex items-center justify-center flex-shrink-0 text-primary text-sm font-heading">
                    +
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <p className="px-5 pb-5 text-sm text-foreground/45 leading-[1.7]">{faq.a}</p>
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
        <div className="relative text-center p-10 sm:p-16 rounded-[32px] bg-gradient-to-br from-primary/[0.1] to-accent/[0.04] border border-primary/15 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,hsla(263,70%,58%,0.08)_0%,transparent_50%)] animate-blob-float-slow pointer-events-none" />
          <div className="relative z-10">
            <Crown className="w-12 h-12 mx-auto text-primary mb-6 drop-shadow-[0_0_40px_hsla(263,70%,58%,0.3)]" />
            <h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1] mb-4">
              Pronto a Costruire il Tuo <span className="text-vibrant-gradient">Impero Digitale?</span>
            </h2>
            <p className="text-sm text-foreground/40 max-w-md mx-auto mb-8">
              Ristoranti, saloni, studi medici, NCC, negozi, palestre, hotel — i tuoi competitor si stanno già digitalizzando. Non restare indietro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate("/admin")}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase hover:-translate-y-1 hover:shadow-[0_20px_60px_hsla(263,70%,58%,0.35)] transition-all flex items-center justify-center gap-2.5">
                Sono un Imprenditore <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate("/partner/register")}
                className="w-full sm:w-auto px-10 py-4 rounded-full border border-border/25 text-foreground/80 font-bold text-sm font-heading tracking-wide hover:border-primary/30 hover:text-foreground transition-all">
                Diventa Partner
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ FOOTER ═══════ */}
      <footer id="contact" className="border-t border-border/10 py-16 pb-10 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-12 mb-12">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-vibrant-gradient flex items-center justify-center shadow-[0_0_15px_hsla(263,70%,58%,0.25)]">
                  <Crown className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-foreground tracking-[0.15em] uppercase text-xs">Empire<span className="text-primary">.AI</span></span>
              </div>
              <p className="text-xs text-foreground/35 leading-[1.7] max-w-[260px] mb-5">
                La piattaforma AI multi-settore che trasforma qualsiasi attività in un impero digitale di proprietà. Zero commissioni predatorie. Zero canoni mensili.
              </p>
              <div className="flex gap-2">
                {["In", "𝕏", "IG"].map((s, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border border-border/20 flex items-center justify-center text-xs text-foreground/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer">{s}</div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.65rem] font-semibold text-foreground/50 mb-4 tracking-[3px] uppercase">Settori</h4>
              <div className="space-y-2.5 text-xs text-foreground/35">
                <p>Food & Ristorazione</p>
                <p>NCC & Trasporto</p>
                <p>Beauty & Wellness</p>
                <p>Healthcare</p>
                <p>Retail, Fitness, Hospitality</p>
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.65rem] font-semibold text-foreground/50 mb-4 tracking-[3px] uppercase">Risorse</h4>
              <div className="space-y-2.5 text-xs">
                {[
                  { label: "Funzionalità", href: "#services" },
                  { label: "ROI Calculator", href: "#calculator" },
                  { label: "Prezzi", href: "#pricing" },
                  { label: "Partner Program", href: "#partner" },
                ].map((link, i) => (
                  <a key={i} href={link.href} className="block text-foreground/35 hover:text-primary transition-colors">{link.label}</a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.65rem] font-semibold text-foreground/50 mb-4 tracking-[3px] uppercase">Contatti & Legale</h4>
              <div className="space-y-2.5 text-xs">
                <p className="text-foreground/35 flex items-center gap-2"><Mail className="w-3 h-3" /> info@empire-suite.it</p>
                <p className="text-foreground/35 flex items-center gap-2"><MapPin className="w-3 h-3" /> Roma, Italia</p>
                <a href="/privacy" className="block text-foreground/35 hover:text-primary transition-colors mt-3">Privacy Policy</a>
                <a href="/cookie-policy" className="block text-foreground/35 hover:text-primary transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.65rem] text-foreground/25">
            <p>© 2026 Empire AI · Piattaforma Multi-Settore. Tutti i diritti riservati.</p>
            <div className="flex gap-6">
              <a href="/privacy" className="hover:text-foreground/50 transition-colors">Privacy</a>
              <a href="/cookie-policy" className="hover:text-foreground/50 transition-colors">Cookie</a>
              <span>P.IVA IT12345678901</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════ STICKY CTA MOBILE ═══════ */}
      <motion.div className="fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] bg-background/80 backdrop-blur-2xl border-t border-border/10 md:hidden"
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 2, type: "spring", damping: 25 }}>
        <div className="flex gap-2">
          <button onClick={() => scrollTo("pricing")}
            className="flex-1 py-3.5 rounded-2xl bg-vibrant-gradient text-primary-foreground font-bold text-sm tracking-wider font-heading uppercase">
            Demo Gratuita · Inizia Ora
          </button>
          <button onClick={() => navigate("/r/impero-roma")}
            className="px-4 py-3.5 rounded-2xl border border-primary/20 text-primary">
            <Play className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
