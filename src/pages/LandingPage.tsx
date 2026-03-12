import { useState, useEffect, useRef, forwardRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import {
  Crown, Check, Star, Zap, Shield, Smartphone,
  TrendingUp, X, Sparkles, Lock, Menu, Target, DollarSign, Brain,
  ChefHat, AlertTriangle, Banknote, ArrowDown, ArrowRight,
  MessageCircle, ChevronDown, Play, Gem, Users, Rocket,
  Gift, Trophy, Award, Handshake, Quote,
  BarChart3, QrCode, Bell, Wallet, MapPin, Eye, Bot,
  Palette, Mail
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
  const justEatCost = monthlyRevenue * 0.30;
  const empireCost = monthlyRevenue * 0.02;
  const monthlySaving = justEatCost - empireCost;
  const roiMonths = monthlySaving > 0 ? Math.ceil(setupCost / monthlySaving) : 0;
  const yearSaving = monthlySaving * 12;

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  /* ═══ DATA ═══ */
  const services = [
    { icon: <Brain className="w-6 h-6" />, title: "AI Menu & Catalogo", desc: "Carica una foto del tuo menu o listino. L'IA estrae testi, prezzi, allergeni e genera immagini professionali in 60 secondi. Traduzione multilingua automatica inclusa.", tag: "IA" },
    { icon: <Smartphone className="w-6 h-6" />, title: "PWA White Label", desc: "App installabile come nativa con il TUO brand — logo, colori, dominio personalizzato. Ordini online, prenotazioni, catalogo prodotti. Zero commissioni marketplace.", tag: "APP" },
    { icon: <ChefHat className="w-6 h-6" />, title: "Kitchen View & Operations", desc: "Dashboard operativa real-time con notifiche sonore, stati ordine live e stampa ticket. Per cucine, magazzini o centri operativi — zero errori garantiti.", tag: "OPS" },
    { icon: <Shield className="w-6 h-6" />, title: "Review Shield™ & Reputazione", desc: "Filtro intelligente recensioni: le negative restano private, le 4-5★ costruiscono la tua reputazione su Google. CRM clienti con blacklist e segmentazione automatica.", tag: "BRAND" },
    { icon: <Users className="w-6 h-6" />, title: "Staff, Turni & Payroll", desc: "Gestione completa del personale: profili, turni, timbrature, buste paga, straordinari. Tutto centralizzato con calcolo automatico delle ore lavorate.", tag: "HR" },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Finance, Fatture & HACCP", desc: "Dashboard finanziaria completa, fatturazione B2B elettronica, fee piattaforma trasparenti e registro HACCP digitale con conformità automatica.", tag: "FINANCE" },
    { icon: <Wallet className="w-6 h-6" />, title: "Wallet Pass & Loyalty", desc: "Pass sconto digitali nel wallet del cliente. Programma fedeltà automatizzato con push notification e campagne marketing mirate che aumentano il ritorno del 40%.", tag: "GROWTH" },
    { icon: <MapPin className="w-6 h-6" />, title: "Mappa Tavoli & Prenotazioni", desc: "Gestisci la sala con drag-and-drop visuale o il calendario prenotazioni. Flotta veicoli, tratte e assegnazione autisti per il settore NCC.", tag: "GESTIONE" },
    { icon: <Bot className="w-6 h-6" />, title: "AI Concierge & Social Manager", desc: "Assistente AI integrato per supporto clienti e decisioni strategiche. Gestione post social multi-piattaforma con pubblicazione programmata.", tag: "AI+" },
  ];

  const metrics = [
    { value: 200, suffix: "+", label: "Attività Gestite" },
    { value: 98, suffix: "%", label: "Soddisfazione Clienti" },
    { value: 45, suffix: "%", prefix: "+", label: "Aumento Revenue" },
    { value: 7, suffix: "", label: "Settori Supportati" },
  ];

  const testimonials = [
    { name: "Marco Pellegrini", role: "Trattoria da Marco · Roma", quote: "In 3 mesi ho spostato il 60% degli ordini dal marketplace alla mia app. Risparmio €3.200/mese netti. La Kitchen View ha azzerato gli errori in cucina.", metric: "−€3.200/mese" },
    { name: "Giulia Ferretti", role: "Salone Bellezza Ferretti · Milano", quote: "Gestisco appuntamenti, clienti e paghe del personale da un'unica dashboard. Prima usavo 4 software diversi. Ora tutto è in un solo posto.", metric: "−4 software" },
    { name: "Antonio De Luca", role: "NCC Premium · Napoli", quote: "Flotta, prenotazioni, autisti e fatturazione — tutto automatizzato. I clienti prenotano online e ricevono conferma istantanea. Revenue +35% in 60 giorni.", metric: "+35% revenue" },
  ];

  const faqs = [
    { q: "Per quali settori funziona?", a: "Empire è una piattaforma multi-settore: Ristorazione, NCC & Trasporto, Beauty & Wellness, Healthcare, Retail, Fitness e Hospitality. La suite si adatta automaticamente al tuo settore con terminologia, moduli e funzionalità specifiche." },
    { q: "È difficile da usare?", a: "Assolutamente no. Se sai usare Instagram, sai usare Empire. L'interfaccia si adatta al tuo settore e l'IA fa il lavoro pesante: dal menu digitale alla gestione turni, tutto è guidato e intuitivo." },
    { q: "Come arrivano i pagamenti?", a: "I pagamenti dei clienti arrivano direttamente sul TUO conto tramite Stripe Connect. Non tocchiamo mai i tuoi soldi. L'unica trattenuta è il 2% automatico per infrastruttura e IA — 15× meno dei marketplace." },
    { q: "Quanto costa e cosa include?", a: "€2.997 una tantum (o 3 rate da €1.099). Include: PWA personalizzata, AI, CRM, Staff & Payroll, Finance, HACCP, Loyalty, Social Manager, Kitchen View e tutti i moduli del tuo settore. Dopo: €0/mese, solo 2% sulle transazioni." },
    { q: "La sicurezza dei dati è garantita?", a: "Sì. Crittografia AES-256 per i dati fiscali, GDPR compliance nativa, RLS (Row Level Security) su ogni tabella e backup automatici. I tuoi dati sono più sicuri che in banca." },
    { q: "Come funziona il Partner Program?", a: "Diventi Partner gratis e guadagni €997 per ogni vendita, con bonus mensili fino a €1.500 e override da Team Leader di €50 per vendita del tuo team. Pagamenti istantanei via Stripe Connect." },
  ];

  const navLinks = [
    { href: "#services", label: "Servizi" },
    { href: "#app", label: "App" },
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
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(hsla(210,40%,97%,0.1) 1px, transparent 1px), linear-gradient(90deg, hsla(210,40%,97%,0.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="relative z-10 max-w-[1200px] mx-auto w-full">
          <div className="flex flex-col items-center text-center max-w-[900px] mx-auto">
            {/* Badge */}
            <motion.div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-8"
              initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
              <span className="text-[0.7rem] font-heading font-medium text-primary/90 tracking-[2px] uppercase">AI-Powered Business Management Suite</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-[2.5rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-heading font-bold text-foreground tracking-[-0.02em]"
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.15, ease: smoothEase }}>
              La Suite AI Che
              <br />
              <span className="text-vibrant-gradient">Gestisce il Tuo Business</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p className="mt-6 text-base sm:text-lg text-foreground/50 max-w-[600px] leading-[1.8] font-light"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
              Un'unica piattaforma per ristorazione, NCC, beauty, healthcare, retail e hospitality.
              <span className="text-foreground/70 font-normal"> PWA di proprietà, AI integrata, staff & payroll, CRM, finance e 30+ moduli — tutto incluso.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div className="mt-10 flex flex-col sm:flex-row items-center gap-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <button onClick={() => scrollTo("pricing")}
                className="group relative w-full sm:w-auto px-8 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_hsla(263,70%,58%,0.35)]">
                <span className="absolute inset-0 bg-gradient-to-r from-foreground/0 via-foreground/10 to-foreground/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative flex items-center gap-2.5">Prenota una Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
              </button>
              <button onClick={() => navigate("/r/impero-roma")}
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-border/30 text-foreground/80 text-sm font-semibold font-heading tracking-wide hover:border-primary/30 hover:text-foreground hover:bg-primary/[0.04] transition-all flex items-center justify-center gap-2.5">
                <Play className="w-3.5 h-3.5 text-primary" /> Vedi Live Demo
              </button>
            </motion.div>

            {/* Metrics Row */}
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

        {/* Scroll indicator */}
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
              {["Stripe Connect", "AES-256 Encryption", "PWA Certified", "GDPR Compliant", "99.9% Uptime", "AI-Powered", "Made in Italy", "White Label", "Real-Time Analytics"].map((t, i) => (
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
          PROBLEMA
         ═══════════════════════════════════════════ */}
      <Section id="problem">
        <div className="text-center mb-14">
          <SectionLabel text="Il Problema" />
          <motion.h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1] mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Ogni mese, <span className="text-vibrant-gradient">regali migliaia</span> di euro
          </motion.h2>
          <motion.p className="text-foreground/45 max-w-[550px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Marketplace con commissioni al 30%, software separati per ogni funzione, dati dispersi. Il risultato? Margini erosi e zero controllo sul tuo business.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {[
            { icon: <Banknote className="w-7 h-7" />, amount: "€7.500", label: "Margini erosi / mese", sub: "Su 1000 ordini a €25" },
            { icon: <DollarSign className="w-7 h-7" />, amount: "€90.000", label: "Dispersi ogni anno", sub: "Capitale che alimenta i competitor" },
            { icon: <Target className="w-7 h-7" />, amount: "€0", label: "Proprietà clienti", sub: "Il marketplace possiede i TUOI dati" },
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
          SERVIZI
         ═══════════════════════════════════════════ */}
      <Section id="services">
        <div className="text-center mb-14">
          <SectionLabel text="L'Arsenale" />
          <motion.h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1] mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Tutto Ciò Che Serve al Tuo<br className="hidden sm:block" />
            <span className="text-vibrant-gradient">Impero Digitale</span>
          </motion.h2>
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
              <div className="mt-5 pt-4 border-t border-border/10">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary/70 font-heading group-hover:text-primary group-hover:gap-3 transition-all">
                  Scopri di più <ArrowRight className="w-3 h-3" />
                </span>
              </div>
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
            Dal Concept al <span className="text-vibrant-gradient">Lancio in 4 Step</span>
          </motion.h2>
        </div>

        <motion.div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {/* Connection line */}
          <div className="hidden lg:block absolute top-[36px] left-[calc(12.5%+36px)] right-[calc(12.5%+36px)] h-[1px] bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 z-0" />

          {[
            { step: "01", title: "Discovery & Setup", desc: "Analizziamo il tuo ristorante e configuriamo la suite in 24 ore." },
            { step: "02", title: "AI Menu & Branding", desc: "L'IA crea il menu digitale e personalizza la tua app con il tuo brand." },
            { step: "03", title: "Lancio & Formazione", desc: "Attiviamo la PWA, formiamo lo staff e installiamo i QR Code." },
            { step: "04", title: "Crescita Continua", desc: "Monitoriamo le performance e ottimizziamo i margini costantemente." },
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
              Tre App,<br /><span className="text-vibrant-gradient">Un Solo Impero</span>
            </h2>
            <p className="text-foreground/45 leading-[1.7] max-w-lg mb-8 text-sm">
              Cliente, Admin e Cucina — un ecosistema white-label completo, di tua proprietà.
            </p>
            <div className="space-y-4 mb-8">
              {[
                { title: "Ordini Online", desc: "Menu interattivo con pagamento Stripe integrato" },
                { title: "Programma Fedeltà", desc: "Wallet pass, reward e offerte personalizzate AI" },
                { title: "Push & Chat", desc: "Comunicazione diretta e campagne marketing push" },
                { title: "Kitchen View", desc: "Ordini real-time in cucina, zero errori garantiti" },
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

          {/* 3 Phone Mockups */}
          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex justify-center items-end gap-3 sm:gap-5 relative">
              <div className="absolute -inset-16 bg-primary/[0.06] rounded-[80px] blur-[100px] pointer-events-none" />
              {[
                { label: "Cliente", img: mockupCliente, h: "h-[320px] sm:h-[380px]" },
                { label: "Admin", img: mockupAdmin, h: "h-[360px] sm:h-[420px]" },
                { label: "Cucina", img: mockupCucina, h: "h-[320px] sm:h-[380px]" },
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
          <motion.h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1]"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Calcola il Tuo <span className="text-vibrant-gradient">Risparmio Reale</span>
          </motion.h2>
        </div>

        <motion.div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl luxury-card space-y-6"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {[
            { label: "Ordini al mese", value: monthlyOrders, min: 100, max: 3000, step: 50, display: monthlyOrders.toString(), onChange: setMonthlyOrders },
            { label: "Scontrino medio", value: avgOrder, min: 10, max: 80, step: 5, display: `€${avgOrder}`, onChange: setAvgOrder },
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
              { label: "Marketplace (30%)", value: justEatCost, pct: "30%", width: 100, color: "accent" },
              { label: "Empire (2%)", value: empireCost, pct: "2%", width: Math.max(5, (empireCost / justEatCost) * 100), color: "primary" },
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
          <SectionLabel text="Testimonianze" />
          <motion.h2 className="text-[clamp(1.8rem,4vw,3rem)] font-heading font-bold text-foreground leading-[1.1] mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Risultati <span className="text-vibrant-gradient">Misurabili</span>
          </motion.h2>
        </div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {testimonials.map((t, i) => (
            <motion.div key={i} className="group p-7 rounded-3xl luxury-card hover:-translate-y-2 transition-all duration-500"
              variants={fadeUp}>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />)}
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
          <motion.p className="text-foreground/45 max-w-[500px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Zero canoni mensili. Il tuo asset digitale di proprietà.
          </motion.p>
        </div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {/* Main plan */}
          <motion.div className="relative p-8 sm:p-10 rounded-3xl overflow-hidden bg-gradient-to-b from-primary/[0.08] to-background border border-primary/20"
            variants={fadeScale}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-vibrant-gradient" />
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-vibrant-gradient text-[0.6rem] font-bold text-primary-foreground tracking-[2px] font-heading uppercase">Popolare</div>
            <span className="text-[0.65rem] font-heading font-semibold text-primary/70 tracking-[3px] uppercase">Pagamento Unico</span>
            <p className="text-5xl font-heading font-bold text-foreground mt-3">€2.997</p>
            <p className="text-xs text-foreground/40 mt-1">IVA 22% inclusa · Una volta sola</p>
            <ul className="mt-8 space-y-3 mb-8">
              {["Asset Digitale di Proprietà", "AI Menu Creator + OCR", "Kitchen View real-time", "Vault Fiscale AES-256", "Panic Mode + Review Shield", "PWA White Label", "Chat Privata + Push", "Mappa Tavoli", "Assistenza a vita", "Zero canoni mensili"].map((f, i) => (
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
              Inizia il tuo Impero
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
              {["Tutte le funzionalità incluse", "Massima flessibilità di pagamento", "Attivazione immediata", "Chiusura senza vincoli"].map((f, i) => (
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
          <span className="text-foreground/50 font-semibold">Dopo l'attivazione:</span> €0/mese · Solo <span className="text-primary font-bold">2%</span> sulle transazioni per infrastruttura, IA e aggiornamenti.
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
            Costruisci il Tuo <span className="text-vibrant-gradient">Impero</span>
          </motion.h2>
          <motion.p className="text-foreground/45 max-w-[500px] mx-auto leading-[1.7] text-sm"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            €997 per ogni vendita. Zero rischi. Pagamenti istantanei.
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
              { title: "Partner", desc: "€997/vendita", icon: <Handshake className="w-5 h-5" /> },
              { title: "3 Vendite", desc: "Promozione auto", icon: <TrendingUp className="w-5 h-5" /> },
              { title: "Team Leader", desc: "+€50 override", icon: <Crown className="w-5 h-5" /> },
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
            <div className="flex justify-between"><span className="text-foreground/40">Bonus Elite</span><span className="font-bold text-foreground">€1.500</span></div>
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
              Tutto quello che devi sapere su Empire, dai costi alla tecnologia.
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
              Pronto a Dominare il <span className="text-vibrant-gradient">Digitale?</span>
            </h2>
            <p className="text-sm text-foreground/40 max-w-md mx-auto mb-8">
              I tuoi competitor stanno costruendo il loro impero digitale. Inizia il tuo oggi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate("/admin")}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase hover:-translate-y-1 hover:shadow-[0_20px_60px_hsla(263,70%,58%,0.35)] transition-all flex items-center justify-center gap-2.5">
                Sono un Ristoratore <ArrowRight className="w-4 h-4" />
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
                L'unico Asset Digitale di Proprietà che libera i ristoratori dalle commissioni predatorie.
              </p>
              <div className="flex gap-2">
                {["In", "𝕏", "IG"].map((s, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border border-border/20 flex items-center justify-center text-xs text-foreground/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer">{s}</div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.65rem] font-semibold text-foreground/50 mb-4 tracking-[3px] uppercase">Contatti</h4>
              <div className="space-y-2.5 text-xs text-foreground/35">
                <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> info@empire-suite.it</p>
                <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> Roma, Italia</p>
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.65rem] font-semibold text-foreground/50 mb-4 tracking-[3px] uppercase">Risorse</h4>
              <div className="space-y-2.5 text-xs">
                {[
                  { label: "Servizi", href: "#services" },
                  { label: "ROI Calculator", href: "#calculator" },
                  { label: "Prezzi", href: "#pricing" },
                  { label: "Partner", href: "#partner" },
                ].map((link, i) => (
                  <a key={i} href={link.href} className="block text-foreground/35 hover:text-primary transition-colors">{link.label}</a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.65rem] font-semibold text-foreground/50 mb-4 tracking-[3px] uppercase">Legale</h4>
              <div className="space-y-2.5 text-xs">
                <a href="/privacy" className="block text-foreground/35 hover:text-primary transition-colors">Privacy Policy</a>
                <a href="/cookie-policy" className="block text-foreground/35 hover:text-primary transition-colors">Cookie Policy</a>
                <a href="#" className="block text-foreground/35 hover:text-primary transition-colors">Termini di Servizio</a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.65rem] text-foreground/25">
            <p>© 2026 Empire Restaurant Suite. Tutti i diritti riservati.</p>
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
            €2.997 · Inizia Ora
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
