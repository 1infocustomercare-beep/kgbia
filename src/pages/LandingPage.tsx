import { useState, useEffect, useRef, forwardRef, lazy, Suspense } from "react";
const EmpireVoiceAgent = lazy(() => import("@/components/public/EmpireVoiceAgent"));
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
import nccHeroBg from "@/assets/ncc-hero-bg-amalfi.jpg";
import nccPremiumCoast from "@/assets/ncc-premium-coast.jpg";
import nccPremiumInterior from "@/assets/ncc-premium-interior.jpg";
import nccFleetShowcase from "@/assets/ncc-fleet-showcase.jpg";
import cartoonFood from "@/assets/cartoon-sector-food.png";
import cartoonNcc from "@/assets/cartoon-sector-ncc.png";
import cartoonBeauty from "@/assets/cartoon-sector-beauty.png";
import cartoonHealthcare from "@/assets/cartoon-sector-healthcare.png";
import cartoonRetail from "@/assets/cartoon-sector-retail.png";
import cartoonFitness from "@/assets/cartoon-sector-fitness.png";
import cartoonHotel from "@/assets/cartoon-sector-hotel.png";

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

const Section = forwardRef<HTMLElement, { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }>(
  ({ id, children, className = "", style }, ref) => (
    <section ref={ref} id={id} className={`relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden ${className}`} style={style}>
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
      <div className="relative flex items-center gap-2 px-4 py-2 rounded-full premium-label overflow-hidden" style={{ borderLeft: "1px solid hsla(35,45%,50%,0.15)" }}>
        {/* Scanning beam — gold tint */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 30%, hsla(35,45%,55%,0.12) 50%, transparent 70%)" }}
          animate={{ x: ["-150%", "250%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
        />
        {icon || <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(35,45%,50%)" }} animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />}
        <span className="text-[0.65rem] font-heading font-semibold tracking-[3px] uppercase text-primary/90 relative z-10">{text}</span>
      </div>
    </motion.div>
  )
);
SectionLabel.displayName = "SectionLabel";

/* ═══ Animated Premium Icon ═══ */
const PremiumIcon = ({ children, gradient, size = "md", delay = 0 }: { children: React.ReactNode; gradient: string; size?: "sm" | "md" | "lg"; delay?: number }) => {
  const sizeClasses = size === "sm" ? "w-8 h-8 sm:w-10 sm:h-10 rounded-xl" : size === "lg" ? "w-12 h-12 rounded-2xl" : "w-10 h-10 rounded-xl";
  return (
    <motion.div className="relative group/icon" whileHover={{ scale: 1.15, rotate: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      {/* Ambient glow */}
      <motion.div
        className={`absolute -inset-2 ${sizeClasses} opacity-0 group-hover/icon:opacity-100 transition-opacity duration-700 blur-xl`}
        style={{ background: `linear-gradient(135deg, hsla(265,70%,60%,0.3), hsla(280,50%,60%,0.2))` }}
      />
      {/* Outer pulse ring */}
      <motion.div
        className={`absolute -inset-1.5 ${sizeClasses} pointer-events-none`}
        style={{ border: "1px solid hsla(265,80%,70%,0.15)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: delay * 0.5, ease: "easeInOut" }}
      />
      {/* Rotating ring */}
      <motion.div
        className={`absolute -inset-0.5 ${sizeClasses}`}
        style={{ border: "1.5px solid transparent", borderTopColor: "hsla(265,80%,70%,0.4)", borderRightColor: "hsla(300,50%,70%,0.2)" }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", delay }}
      />
      {/* Counter ring */}
      <motion.div
        className={`absolute inset-0 ${sizeClasses}`}
        style={{ border: "1px solid transparent", borderBottomColor: "hsla(280,60%,75%,0.2)" }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: delay + 1 }}
      />
      {/* Main container */}
      <div className={`relative ${sizeClasses} bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg overflow-hidden`}
        style={{ boxShadow: "0 4px 20px hsla(265,70%,60%,0.15), inset 0 1px 1px rgba(255,255,255,0.15)" }}>
        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.35) 50%, transparent 65%)" }}
          animate={{ x: ["-150%", "250%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 + delay, ease: "easeInOut" }}
        />
        {/* Inner glow */}
        <div className="absolute inset-px rounded-[inherit] border border-white/10 pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};

/* ═══ Premium Animated Card ═══ */
const PremiumCard = ({ children, className = "", hover = true, glow = false, scan = false, delay = 0 }: { children: React.ReactNode; className?: string; hover?: boolean; glow?: boolean; scan?: boolean; delay?: number }) => (
  <motion.div
    className={`relative rounded-2xl border border-primary/[0.08] overflow-hidden group/card ${className}`}
    style={{ background: "hsla(265,20%,8%,0.6)", backdropFilter: "blur(8px)" }}
    whileHover={hover ? { y: -5, borderColor: "hsla(265,70%,60%,0.2)", transition: { duration: 0.3 } } : undefined}
  >
    {/* Top accent line — gold hint */}
    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(35,45%,50%,0.18), hsla(265,70%,60%,0.15), transparent)" }} />
    {/* Corner accents — gold */}
    <div className="absolute top-2 left-2 w-3 h-3 border-t border-l rounded-tl-sm pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" style={{ borderColor: "hsla(35,45%,50%,0.2)" }} />
    <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r rounded-br-sm pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" style={{ borderColor: "hsla(35,45%,50%,0.2)" }} />
    {/* Scanning beam */}
    {scan && (
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "linear-gradient(180deg, transparent 40%, hsla(265,80%,70%,0.04) 50%, transparent 60%)" }}
        animate={{ y: ["-100%", "200%"] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 + delay, ease: "easeInOut" }}
      />
    )}
    {/* Ambient glow on hover */}
    {glow && (
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
        style={{ background: "radial-gradient(circle, hsla(265,70%,60%,0.08), transparent)" }} />
    )}
    {/* Bottom accent */}
    <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">{children}</div>
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

/* ═══ Floating Particle ═══ */
const Particle = ({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) => (
  <motion.div
    className="absolute rounded-full"
    style={{ width: size, height: size, left: x, top: y, background: delay % 2 === 0 ? "hsl(265, 70%, 60%)" : "hsl(280, 50%, 65%)" }}
    animate={{ y: [0, -25, 0], opacity: [0.1, 0.35, 0.1], scale: [1, 1.3, 1] }}
    transition={{ duration: 5 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

/* ═══ Section Divider ═══ */
const SectionDivider = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="section-connector">
    <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, hsla(35,45%,50%,0.08) 15%, hsla(265, 70%, 60%, 0.15) 35%, hsla(35,45%,50%,0.2) 50%, hsla(265, 70%, 60%, 0.15) 65%, hsla(35,45%,50%,0.08) 85%, transparent 100%)" }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: "linear-gradient(135deg, hsl(35,45%,50%), hsl(265, 70%, 60%))", boxShadow: "0 0 10px hsla(35,45%,50%,0.4), 0 0 24px hsla(265, 70%, 60%, 0.3)" }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
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
  const [sectorSheetOpen, setSectorSheetOpen] = useState(false);

  const industries = [
    { id: "food" as const, icon: <ChefHat className="w-5 h-5" />, title: "Food & Ristorazione", desc: "Ristoranti, pizzerie, bar, pasticcerie, sushi bar", gradient: "from-violet-500 to-purple-400", emoji: "🍽️", modules: "Menu Digitale · Ordini · QR · Cucina Live", image: cartoonFood },
    { id: "ncc" as const, icon: <Car className="w-5 h-5" />, title: "NCC & Trasporto", desc: "Noleggio con conducente, transfer, limousine", gradient: "from-purple-500 to-indigo-400", emoji: "🚘", modules: "Flotta · Tratte · Booking · Autisti", image: cartoonNcc },
    { id: "beauty" as const, icon: <Scissors className="w-5 h-5" />, title: "Beauty & Wellness", desc: "Saloni, centri estetici, SPA, barbieri", gradient: "from-fuchsia-500/80 to-violet-400", emoji: "💅", modules: "Agenda · Clienti · Reminder · Trattamenti", image: cartoonBeauty },
    { id: "healthcare" as const, icon: <Heart className="w-5 h-5" />, title: "Healthcare", desc: "Studi medici, dentisti, fisioterapisti", gradient: "from-indigo-400 to-violet-500", emoji: "🏥", modules: "Schede Paziente · Agenda · Fatturazione", image: cartoonHealthcare },
    { id: "retail" as const, icon: <Store className="w-5 h-5" />, title: "Retail & Negozi", desc: "Negozi, boutique, e-commerce locale", gradient: "from-purple-400 to-fuchsia-400/80", emoji: "🛍️", modules: "Catalogo · Inventario · POS · Promozioni", image: cartoonRetail },
    { id: "fitness" as const, icon: <Dumbbell className="w-5 h-5" />, title: "Fitness & Sport", desc: "Palestre, centri sportivi, personal trainer", gradient: "from-violet-400 to-indigo-500", emoji: "💪", modules: "Abbonamenti · Corsi · Check-in · Pagamenti", image: cartoonFitness },
    { id: "hospitality" as const, icon: <Building className="w-5 h-5" />, title: "Hospitality", desc: "Hotel, B&B, agriturismi, resort", gradient: "from-purple-500/80 to-violet-400", emoji: "🏨", modules: "Camere · Booking · Ospiti · Concierge", image: cartoonHotel },
  ];

  const extraSectors = [
    { icon: "🎓", title: "Formazione & Coaching", desc: "Corsi, tutoring, certificazioni", gradient: "from-violet-500 to-purple-400" },
    { icon: "🏖️", title: "Stabilimenti Balneari", desc: "Ombrelloni, lettini, bar spiaggia", gradient: "from-indigo-400 to-violet-400" },
    { icon: "🐾", title: "Veterinari & Pet Care", desc: "Cliniche, toelettature, pensioni", gradient: "from-purple-400 to-fuchsia-400/80" },
    { icon: "🔧", title: "Artigiani & Impiantisti", desc: "Idraulici, elettricisti, caldaisti", gradient: "from-indigo-500 to-purple-400" },
    { icon: "🎨", title: "Studi Creativi", desc: "Fotografi, designer, architetti", gradient: "from-fuchsia-500/80 to-violet-400" },
    { icon: "🏋️", title: "CrossFit & Functional", desc: "Box, classi, WOD, membership", gradient: "from-purple-500 to-indigo-400" },
    { icon: "🧘", title: "Yoga & Pilates", desc: "Studi, ritiri, classi online", gradient: "from-violet-400 to-purple-300" },
    { icon: "🚿", title: "Lavanderie & Stirerie", desc: "Ritiro, consegna, abbonamenti", gradient: "from-indigo-400 to-violet-300" },
    { icon: "🎵", title: "Scuole di Musica", desc: "Lezioni, sale prove, eventi", gradient: "from-purple-500 to-violet-400" },
    { icon: "🏠", title: "Agenzie Immobiliari", desc: "Annunci, visite, CRM clienti", gradient: "from-indigo-500 to-violet-500" },
    { icon: "⚖️", title: "Studi Legali", desc: "Pratiche, clienti, parcelle", gradient: "from-slate-500 to-violet-400/60" },
    { icon: "🏗️", title: "Edilizia & Costruzioni", desc: "Cantieri, preventivi, SAL", gradient: "from-purple-500/80 to-indigo-400" },
    { icon: "🎭", title: "Eventi & Catering", desc: "Booking, menu, staff, logistica", gradient: "from-violet-500 to-purple-400" },
    { icon: "🚗", title: "Autofficine & Carrozzerie", desc: "Interventi, ricambi, preventivi", gradient: "from-indigo-400/80 to-violet-400/60" },
    { icon: "📦", title: "Logistica & Spedizioni", desc: "Tracking, magazzino, consegne", gradient: "from-purple-400 to-indigo-400" },
    { icon: "🌿", title: "Giardinaggio & Vivaisti", desc: "Interventi, manutenzione, vendita", gradient: "from-violet-400 to-purple-400" },
    { icon: "🎪", title: "Intrattenimento", desc: "Parchi, escape room, bowling", gradient: "from-fuchsia-400/80 to-violet-400" },
    { icon: "🏫", title: "Asili & Doposcuola", desc: "Iscrizioni, presenze, comunicazioni", gradient: "from-indigo-400 to-purple-300" },
  ];

  const services = [
    { icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />, title: "AI Business Engine", desc: "L'IA analizza il tuo business, genera cataloghi, ottimizza prezzi e automatizza le operazioni quotidiane.", tag: "IA", color: "from-primary to-accent" },
    { icon: <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />, title: "App White Label", desc: "App professionale installabile con il TUO brand, colori e dominio. Nessun logo di terzi, mai.", tag: "APP", color: "from-violet-500 to-primary" },
    { icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Prenotazioni & Ordini", desc: "Gestisci appuntamenti, ordini, prenotazioni corse o camere da un unico pannello centralizzato.", tag: "OPS", color: "from-indigo-400 to-violet-500" },
    { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Review Shield™", desc: "Le recensioni negative restano nel tuo archivio privato. Solo le migliori costruiscono la tua reputazione online.", tag: "BRAND", color: "from-purple-400 to-violet-500" },
    { icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />, title: "CRM & Fidelizzazione", desc: "Storico acquisti, preferenze, wallet fedeltà digitale. Trasforma i visitatori in clienti ricorrenti.", tag: "GROWTH", color: "from-fuchsia-500/80 to-purple-500" },
    { icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Analytics & Finance", desc: "Dashboard fatturato, margini, performance staff, trend e fatturazione elettronica integrata.", tag: "FINANCE", color: "from-indigo-500 to-violet-400" },
    { icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Inventario & HACCP", desc: "Monitora scorte, ricevi alert automatici, registra controlli igienico-sanitari e conformità.", tag: "OPS", color: "from-purple-500 to-primary" },
    { icon: <Bell className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Marketing Automation", desc: "Push notification, campagne email/WhatsApp, promozioni mirate e segmentazione clienti avanzata.", tag: "MARKETING", color: "from-accent to-violet-500" },
    { icon: <Lock className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Sicurezza Enterprise", desc: "Crittografia AES-256, GDPR compliant, backup automatici, accessi multi-ruolo e audit trail.", tag: "SECURITY", color: "from-violet-400/60 to-indigo-400/60" },
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
        {/* Subtle violet ambient orbs */}
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[250px] opacity-[0.04] bg-primary -top-[200px] left-1/4" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[200px] opacity-[0.03] bg-accent top-[50vh] -right-[100px]" />
        {/* Particles - reduced */}
        <Particle delay={0} size={2} x="10%" y="30%" />
        <Particle delay={2} size={2} x="70%" y="60%" />
        <Particle delay={1.5} size={2} x="50%" y="45%" />
      </div>

      {/* ═══════ NAVIGATION ═══════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${navScrolled ? "py-1" : "py-3"}`}>
        {/* Glassmorphism background */}
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            backgroundColor: navScrolled ? "hsla(265,20%,6%,0.7)" : "hsla(265,20%,6%,0)",
            backdropFilter: navScrolled ? "blur(24px) saturate(1.4)" : "blur(0px) saturate(1)",
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
        {/* Bottom edge — animated gradient line */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ 
            background: navScrolled 
              ? "linear-gradient(90deg, transparent 5%, hsla(265,80%,65%,0.4) 30%, hsla(300,60%,70%,0.3) 50%, hsla(265,80%,65%,0.4) 70%, transparent 95%)" 
              : "transparent" 
          }}
        />
        {/* Scanning beam across nav */}
        {navScrolled && (
          <motion.div
            className="absolute bottom-0 left-0 h-px w-32 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, hsla(265,90%,75%,0.8), transparent)" }}
            animate={{ x: ["-10vw", "110vw"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          />
        )}

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          
          {/* ═══ Left Nav Links (desktop) ═══ */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {navLinks.slice(0, Math.ceil(navLinks.length / 2)).map((link, i) => (
              <motion.a key={link.href} href={link.href}
                className="relative px-4 py-2 text-[0.7rem] font-medium text-foreground/40 hover:text-foreground transition-all duration-400 tracking-[0.15em] uppercase group rounded-lg"
                whileHover={{ backgroundColor: "hsla(265,70%,60%,0.06)" }}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.2 }}
              >
                {link.label}
                <motion.span 
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full origin-center"
                  style={{ background: "linear-gradient(90deg, hsla(265,80%,65%,0.8), hsla(300,60%,70%,0.6))" }}
                  initial={{ width: 0 }}
                  whileHover={{ width: "70%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </motion.a>
            ))}
          </div>

          {/* ═══ Centered Logo ═══ */}
          <a href="#hero" className="flex items-center gap-2.5 group relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 z-10">
            {/* Ambient glow behind logo */}
            <motion.div
              className="absolute -inset-6 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsla(265,70%,60%,0.15), transparent 70%)" }}
            />
            {/* Logo container — futuristic hexagonal */}
            <motion.div
              className="relative w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                background: "linear-gradient(135deg, hsla(265,75%,58%,1), hsla(280,65%,50%,1), hsla(300,50%,45%,1))",
                boxShadow: "0 0 28px hsla(265,70%,60%,0.4), 0 0 8px hsla(265,70%,60%,0.2), inset 0 1px 2px rgba(255,255,255,0.3)",
              }}
              whileHover={{ rotate: -6, scale: 1.1 }}
              animate={{
                boxShadow: [
                  "0 0 20px hsla(265,70%,60%,0.25), inset 0 1px 1px rgba(255,255,255,0.2)",
                  "0 0 40px hsla(265,70%,60%,0.55), inset 0 1px 2px rgba(255,255,255,0.4)",
                  "0 0 20px hsla(265,70%,60%,0.25), inset 0 1px 1px rgba(255,255,255,0.2)",
                ],
              }}
              transition={{ boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            >
              {/* Rotating orbital ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: "1px solid transparent", borderTopColor: "hsla(265,90%,80%,0.5)", borderRightColor: "hsla(300,60%,75%,0.2)" }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              {/* Second counter-rotating ring */}
              <motion.div
                className="absolute inset-1 rounded-xl"
                style={{ border: "1px solid transparent", borderBottomColor: "hsla(300,70%,80%,0.3)", borderLeftColor: "hsla(265,60%,70%,0.15)" }}
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              />
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)" }}
                animate={{ x: ["-150%", "250%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
              />
              {/* Glass inner border */}
              <div className="absolute inset-px rounded-[15px] border border-white/10 pointer-events-none" />
              {/* Crown icon */}
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="w-5 h-5 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
              </motion.div>
              {/* Status dot */}
              <motion.div 
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full z-10"
                style={{ backgroundColor: "hsla(140,70%,50%,1)", boxShadow: "0 0 8px hsla(140,70%,50%,0.6)" }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            {/* Brand text */}
            <div className="flex flex-col leading-none">
              <motion.span 
                className="font-heading font-bold text-[0.9rem] tracking-[0.3em] uppercase text-foreground"
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                EMPIRE
              </motion.span>
              <span className="text-[0.5rem] tracking-[0.45em] uppercase font-semibold"
                style={{
                  background: "linear-gradient(90deg, hsla(265,70%,65%,1), hsla(300,50%,75%,1), hsla(265,70%,65%,1))",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "gradient-shift 3s ease infinite",
                }}>
                AUTONOMOUS AI
              </span>
            </div>
          </a>

          {/* ═══ Right Nav Links + CTA (desktop) ═══ */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-end">
            {navLinks.slice(Math.ceil(navLinks.length / 2)).map((link, i) => (
              <motion.a key={link.href} href={link.href}
                className="relative px-4 py-2 text-[0.7rem] font-medium text-foreground/40 hover:text-foreground transition-all duration-400 tracking-[0.15em] uppercase group rounded-lg"
                whileHover={{ backgroundColor: "hsla(265,70%,60%,0.06)" }}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.4 }}
              >
                {link.label}
                <motion.span 
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full origin-center"
                  style={{ background: "linear-gradient(90deg, hsla(265,80%,65%,0.8), hsla(300,60%,70%,0.6))" }}
                  initial={{ width: 0 }}
                  whileHover={{ width: "70%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </motion.a>
            ))}
            <motion.button
              onClick={() => scrollTo("contact")}
              className="ml-4 px-7 py-2.5 rounded-full text-primary-foreground text-[0.68rem] font-bold font-heading tracking-[0.2em] uppercase relative overflow-hidden"
              style={{ 
                background: "linear-gradient(135deg, hsla(265,75%,58%,1), hsla(280,65%,50%,1))",
                boxShadow: "0 4px 20px hsla(265,70%,60%,0.25)",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 36px hsla(265,70%,60%,0.4)" }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Animated shimmer */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.25) 50%, transparent 65%)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              />
              {/* Pulsing border glow */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ border: "1px solid hsla(265,80%,75%,0.3)" }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="relative z-10">Inizia Ora</span>
            </motion.button>
          </div>

          {/* ═══ Mobile hamburger ═══ */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-foreground rounded-xl hover:bg-primary/[0.06] transition-colors" aria-label="Menu">
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* ═══ Mobile menu ═══ */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
              style={{ backgroundColor: "hsla(265,20%,6%,0.92)", backdropFilter: "blur(24px) saturate(1.4)" }}>
              {/* Top accent line */}
              <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, hsla(265,80%,65%,0.3), transparent)" }} />
              <div className="flex flex-col items-center gap-0.5 py-5 px-5">
                {navLinks.map((link, i) => (
                  <motion.a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="w-full text-center py-3 text-xs font-medium text-foreground/50 hover:text-foreground hover:bg-primary/[0.06] rounded-xl transition-all font-heading tracking-widest uppercase">
                    {link.label}
                  </motion.a>
                ))}
                <motion.button onClick={() => { scrollTo("contact"); setMobileMenuOpen(false); }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 w-full py-3 rounded-xl text-primary-foreground text-xs font-bold tracking-widest uppercase font-heading relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, hsla(265,70%,55%,1), hsla(280,60%,50%,1))" }}>
                  {/* Mobile shimmer */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.2) 50%, transparent 65%)" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                  />
                  <span className="relative z-10">Inizia Ora</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO
         ═══════════════════════════════════════════ */}
      <motion.section ref={heroRef} id="hero" className="relative min-h-[100dvh] flex items-center overflow-hidden px-5 sm:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16"
        style={{ opacity: heroOpacity }}>

        {/* ═══ LAYER 0: Video background with cinematic overlay ═══ */}
        <div className="absolute inset-0">
          <video src={videoHero} autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-[0.25]"
          />
          {/* Cinematic dark-to-transparent gradient overlays */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsla(260,18%,7%,0.5) 30%, hsla(260,18%,7%,0.3) 60%, hsl(var(--background)) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, hsl(var(--background)) 100%)" }} />
        </div>

        {/* ═══ LAYER 1: Dramatic radial glow — more visible ═══ */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div className="w-[600px] h-[600px] sm:w-[1000px] sm:h-[1000px] rounded-full blur-[200px]"
            style={{ background: "radial-gradient(circle, hsla(265,70%,55%,0.12), hsla(280,50%,50%,0.06), transparent 70%)" }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* ═══ LAYER 2: Horizontal light streaks — behind content, blurred ═══ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]" style={{ filter: "blur(1.5px)" }}>
          <motion.div className="absolute top-[35%] left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent 5%, hsla(265,70%,60%,0.15) 30%, hsla(280,50%,65%,0.25) 50%, hsla(265,70%,60%,0.15) 70%, transparent 95%)" }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div className="absolute top-[65%] left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent 10%, hsla(265,70%,60%,0.1) 35%, hsla(280,50%,65%,0.18) 55%, transparent 90%)" }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        {/* ═══ LAYER 3: Floating orbs — brighter ═══ */}
        <motion.div className="absolute top-[25%] right-[12%] w-3 h-3 rounded-full pointer-events-none"
          style={{ background: "hsla(265,70%,65%,0.5)", boxShadow: "0 0 30px hsla(265,70%,60%,0.4), 0 0 60px hsla(265,70%,60%,0.15)" }}
          animate={{ y: [0, -35, 0], x: [0, 12, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div className="absolute top-[55%] left-[8%] w-2 h-2 rounded-full pointer-events-none"
          style={{ background: "hsla(280,50%,70%,0.4)", boxShadow: "0 0 25px hsla(280,50%,60%,0.3)" }}
          animate={{ y: [0, -25, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div className="absolute top-[70%] right-[25%] w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{ background: "hsla(265,60%,75%,0.35)", boxShadow: "0 0 15px hsla(265,60%,60%,0.2)" }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* ═══ LAYER 4: Subtle floating particles ═══ */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          {[
            { top: "8%", left: "15%", size: 4, delay: 0 },
            { top: "22%", right: "10%", size: 3, delay: 1.5 },
            { top: "70%", left: "8%", size: 2.5, delay: 3 },
            { top: "55%", right: "18%", size: 3.5, delay: 2 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                top: p.top, left: (p as any).left, right: (p as any).right,
                width: p.size, height: p.size,
                background: "hsla(35,45%,55%,0.3)",
                boxShadow: "0 0 12px hsla(35,45%,55%,0.15)",
              }}
              animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            />
          ))}
        </div>

        <motion.div className="relative z-10 max-w-[1100px] mx-auto w-full" style={{ y: heroY, scale: heroScale }}>
          <div className="flex flex-col items-center text-center max-w-[900px] mx-auto">

            {/* Clean badge — gold accent */}
            <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-primary/[0.04] backdrop-blur-sm mb-5 sm:mb-7"
              style={{ borderColor: "hsla(35,45%,50%,0.2)" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(35,45%,50%)" }} />
              <span className="text-[0.55rem] sm:text-[0.6rem] font-heading font-semibold tracking-[2px] uppercase" style={{ color: "hsla(35,45%,55%,0.85)" }}>Il Sistema Operativo per il Tuo Business</span>
            </motion.div>

            {/* Headline — gold shimmer */}
            <motion.h1 className="text-[1.7rem] leading-[1.08] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.8rem] font-heading font-bold tracking-[-0.03em] px-4 sm:px-0"
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
                className="group relative w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase overflow-hidden"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 40px hsla(265,70%,60%,0.25)" }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-foreground/0 via-foreground/10 to-foreground/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  Prenota Demo Gratuita <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              <motion.button
                onClick={() => navigate("/demo")}
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-foreground/60 text-sm font-semibold font-heading tracking-wide hover:text-foreground hover:bg-primary/[0.03] transition-all flex items-center justify-center gap-2"
                style={{ border: "1px solid hsla(35,45%,50%,0.12)" }}
                whileHover={{ scale: 1.01, borderColor: "hsla(35,45%,50%,0.25)" }}
              >
                <Play className="w-4 h-4" style={{ color: "hsla(35,45%,55%,0.6)" }} /> Vedi Demo Live
              </motion.button>
            </motion.div>

            {/* Metrics — clean minimal cards with gold accents */}
            <motion.div className="mt-16 w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
              {metrics.map((m, i) => (
                <motion.div key={i} className="relative rounded-2xl p-4 sm:p-5 text-center bg-deep-black/40 backdrop-blur-sm overflow-hidden"
                  style={{ border: "1px solid hsla(35,45%,50%,0.08)" }}
                  whileHover={{ y: -3, borderColor: "hsla(35,45%,50%,0.2)" }}
                  transition={{ duration: 0.2 }}>
                  {/* Scanning line */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(180deg, transparent 40%, hsla(35,45%,55%,0.04) 50%, transparent 60%)" }}
                    animate={{ y: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 + i, ease: "easeInOut" }}
                  />
                  {/* Corner accents — gold */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l rounded-tl-sm" style={{ borderColor: "hsla(35,45%,50%,0.15)" }} />
                  <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r rounded-br-sm" style={{ borderColor: "hsla(35,45%,50%,0.15)" }} />
                  <p className="text-2xl sm:text-3xl font-heading font-bold text-vibrant-gradient relative z-10">
                    <AnimatedNumber value={m.value} prefix={m.prefix} suffix={m.suffix} />
                  </p>
                  <p className="text-[0.6rem] mt-1.5 tracking-[2px] uppercase font-heading relative z-10" style={{ color: "hsla(35,45%,55%,0.35)" }}>{m.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          style={{ filter: "drop-shadow(0 0 8px hsla(260,20%,4%,0.8))" }}>
          <span className="text-[8px] text-foreground/30 tracking-[4px] uppercase font-heading">Scopri</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4 text-primary/40" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══════ TRUST MARQUEE ═══════ */}
      <div className="relative py-5 border-y border-primary/[0.08] overflow-hidden bg-deep-black/60 backdrop-blur-sm">
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
                <span key={i} className="text-[0.6rem] text-foreground/20 font-heading tracking-[3px] uppercase flex items-center gap-2 group/trust">
                  <motion.span
                    className="text-primary/40 group-hover/trust:text-primary/70 transition-colors"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                  >
                    {t.icon}
                  </motion.span>
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

        <motion.div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {[
            { icon: <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Commissioni", desc: "Piattaforme terze che divorano i margini. Su €10K/mese, €3K vanno in fee.", stat: "-30%", color: "from-red-500/80 to-orange-500/80" },
            { icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Clienti Persi", desc: "Senza CRM e loyalty il 70% non torna. Li acquisisci e li perdi.", stat: "70%", color: "from-amber-500/80 to-yellow-500/80" },
            { icon: <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Zero Digitale", desc: "Competitor con app e booking online. Tu ancora con carta e WhatsApp.", stat: "0", color: "from-orange-500/80 to-red-500/80" },
            { icon: <ClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Processi Manuali", desc: "Ordini a voce, agenda cartacea, Excel. Ogni errore costa tempo e denaro.", stat: "4h/g", color: "from-rose-500/80 to-pink-500/80" },
            { icon: <Eye className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Reputazione", desc: "Una recensione negativa costa migliaia in clienti persi.", stat: "-€5K", color: "from-red-600/80 to-rose-500/80" },
            { icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Marketing Cieco", desc: "Pubblicità senza tracking. Zero segmentazione, zero automazione.", stat: "0%", color: "from-amber-600/80 to-orange-500/80" },
          ].map((pain, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.02 }}>
              <PremiumCard glow scan delay={i} className="p-4 sm:p-6">
                {/* Stat badge */}
                <motion.div className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-background border border-primary/15 text-[0.55rem] sm:text-[0.6rem] font-heading font-bold text-accent/60 tracking-wider shadow-lg z-20 overflow-hidden"
                  animate={{ borderColor: ["hsla(265,70%,60%,0.1)", "hsla(265,70%,60%,0.3)", "hsla(265,70%,60%,0.1)"] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>
                  <motion.div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)" }}
                    animate={{ x: ["-150%", "250%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }} />
                  <span className="relative z-10">{pain.stat}</span>
                </motion.div>
                <PremiumIcon gradient={pain.color} size="sm" delay={i * 0.3}>
                  {pain.icon}
                </PremiumIcon>
                <div className="mt-3 sm:mt-4">
                  <h3 className="font-heading text-xs sm:text-sm font-semibold text-foreground mb-1 sm:mb-2">{pain.title}</h3>
                  <p className="text-[0.65rem] sm:text-xs text-foreground/35 leading-[1.6] sm:leading-[1.7]">{pain.desc}</p>
                </div>
              </PremiumCard>
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
            Dashboard IA, gestione flotta, prenotazioni, cataloghi digitali, CRM avanzato, automazioni, fatturazione, analytics — tutto in un ecosistema white-label per qualsiasi settore.
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

        {/* CTA buttons under video */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <motion.button
            onClick={() => scrollTo("pricing")}
            className="group px-7 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2"
            whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(265,70%,60%,0.25)" }}
            whileTap={{ scale: 0.97 }}
          >
            Prenota Demo Gratuita <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            onClick={() => navigate("/demo")}
            className="px-7 py-3.5 rounded-full border border-foreground/8 text-foreground/60 text-sm font-semibold font-heading tracking-wide hover:border-primary/20 hover:text-foreground hover:bg-primary/[0.03] transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.01 }}
          >
            <Play className="w-4 h-4 text-primary/60" /> Esplora le Demo
          </motion.button>
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          SETTORI
         ═══════════════════════════════════════════ */}
      <Section id="industries" style={{ background: "linear-gradient(180deg, hsla(260,16%,10%,1) 0%, hsla(265,18%,9%,1) 50%, hsla(260,16%,10%,1) 100%)" }}>
        {/* Subtle violet side glows */}
        <div className="absolute top-0 left-0 w-[300px] h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at left, hsla(265,70%,60%,0.04), transparent 70%)" }} />
        <div className="absolute top-0 right-0 w-[300px] h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at right, hsla(265,70%,60%,0.04), transparent 70%)" }} />
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
                     <div className="absolute inset-[3px] rounded-[24px] overflow-hidden flex flex-col items-center text-center"
                       style={{ background: `linear-gradient(160deg, hsl(var(--background)), hsl(var(--card)))` }}>
                       {/* Cartoon image */}
                       <div className="relative w-full h-[130px] overflow-hidden rounded-t-[24px]">
                         <img src={ind.image} alt={ind.title} className="w-full h-full object-cover" loading="lazy" />
                         <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                       </div>
                       <div className="relative z-10 flex flex-col items-center px-3 -mt-4">
                         <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ind.gradient} flex items-center justify-center text-white shadow-lg mb-2`}>
                           <span className="text-[13px]">{ind.icon}</span>
                         </div>
                         <h3 className="font-heading text-[11px] font-bold text-foreground mb-1 leading-tight">{ind.title}</h3>
                         <p className="text-[7px] text-primary/50 font-heading tracking-wider mb-2">{ind.modules}</p>
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
                <div className="absolute inset-[3px] rounded-[28px] overflow-hidden flex flex-col items-center text-center"
                    style={{ background: `linear-gradient(160deg, hsl(var(--background)), hsl(var(--card)))` }}>
                    {/* Cartoon image */}
                    <div className="relative w-full h-[150px] overflow-hidden rounded-t-[28px]">
                      <img src={ind.image} alt={ind.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center px-4 -mt-5">
                      <div className="relative mb-3">
                        <div className={`absolute -inset-1.5 rounded-2xl bg-gradient-to-br ${ind.gradient} opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-700`} />
                        <div className={`relative w-11 h-11 rounded-2xl bg-gradient-to-br ${ind.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-500 overflow-hidden`}>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          <span className="relative z-10 drop-shadow-md">{ind.icon}</span>
                        </div>
                      </div>
                      <h3 className="font-heading text-sm font-bold text-foreground mb-1">{ind.title}</h3>
                      <p className="text-[8px] text-primary/50 font-heading tracking-wider mb-3">{ind.modules}</p>
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
            onClick={() => setSectorSheetOpen(true)}
            whileHover={{ y: -4 }}
          >
            <div className="relative w-[180px] h-[340px] rounded-[32px] border-[2.5px] border-dashed border-foreground/10 hover:border-primary/20 transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <Sparkles className="w-7 h-7 text-foreground/15 mb-3 group-hover:text-primary/60 transition-colors" />
              </motion.div>
              <p className="text-xs font-heading font-semibold text-foreground/35 group-hover:text-foreground/60 transition-colors">+18 altri settori</p>
              <p className="text-[0.6rem] text-primary/40 mt-1.5">Esplora tutti →</p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA buttons under sectors */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 sm:mt-14"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <motion.button
            onClick={() => scrollTo("pricing")}
            className="group px-7 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2"
            whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(265,70%,60%,0.25)" }}
            whileTap={{ scale: 0.97 }}
          >
            Inizia Ora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            onClick={() => navigate("/demo")}
            className="px-7 py-3.5 rounded-full border border-foreground/8 text-foreground/60 text-sm font-semibold font-heading tracking-wide hover:border-primary/20 hover:text-foreground hover:bg-primary/[0.03] transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.01 }}
          >
            <Play className="w-4 h-4 text-primary/60" /> Prova Tutte le Demo
          </motion.button>
        </motion.div>

        {/* ═══ Sector Selector Sheet (iPhone style) ═══ */}
        <AnimatePresence>
          {sectorSheetOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSectorSheetOpen(false)}
              />
              {/* Sheet */}
              <motion.div
                className="fixed z-50 inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[420px] sm:max-h-[85vh]"
                style={{ maxHeight: "85vh" }}
                initial={{ y: "100%", x: 0, opacity: 0 }}
                animate={{ y: 0, x: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                <div className="sm:relative sm:-translate-x-1/2 sm:-translate-y-1/2 rounded-t-[28px] sm:rounded-[28px] overflow-hidden border border-foreground/10"
                  style={{ background: "hsla(260,20%,6%,0.97)", backdropFilter: "blur(40px)", boxShadow: "0 -10px 60px hsla(0,0%,0%,0.5), 0 0 40px hsla(265,70%,60%,0.08)" }}>
                  {/* Handle bar */}
                  <div className="flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-10 h-1 rounded-full" style={{ background: "hsla(0,0%,100%,0.15)" }} />
                  </div>
                  {/* Header */}
                  <div className="px-6 pt-4 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-foreground text-sm tracking-wide">Tutti i Settori</h3>
                      <p className="text-[0.6rem] text-foreground/30 mt-0.5">25+ industrie supportate da Empire</p>
                    </div>
                    <motion.button
                      onClick={() => setSectorSheetOpen(false)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "hsla(0,0%,100%,0.06)", border: "1px solid hsla(0,0%,100%,0.08)" }}
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-3.5 h-3.5 text-foreground/50" />
                    </motion.button>
                  </div>
                  {/* Accent line */}
                  <div className="mx-6 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.2), transparent)" }} />
                  {/* Scrollable content */}
                  <div className="overflow-y-auto px-4 py-4 space-y-2" style={{ maxHeight: "60vh" }}>
                    {/* Active sectors with demos */}
                    <p className="text-[0.55rem] font-heading font-bold text-primary/50 tracking-[3px] uppercase px-2 mb-2">Con Demo Live</p>
                    {industries.map((ind, i) => {
                      const slug = DEMO_SLUGS[ind.id];
                      const demoPath = ind.id === "food" ? `/r/${slug}` : `/demo/${slug}`;
                      return (
                        <motion.div key={`main-${i}`}
                          className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all"
                          style={{ background: "hsla(0,0%,100%,0.02)", border: "1px solid hsla(0,0%,100%,0.04)" }}
                          whileHover={{ background: "hsla(265,70%,60%,0.06)", borderColor: "hsla(265,70%,60%,0.15)", scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setSectorSheetOpen(false); navigate(demoPath); }}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        >
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ind.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                            {ind.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-heading font-bold text-foreground truncate">{ind.title}</p>
                            <p className="text-[0.6rem] text-foreground/30 truncate">{ind.desc}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-[0.5rem] font-heading font-bold text-primary/60 tracking-wider uppercase">Demo</span>
                            <ArrowRight className="w-3 h-3 text-primary/40" />
                          </div>
                        </motion.div>
                      );
                    })}
                    {/* Divider */}
                    <div className="py-3">
                      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.12), transparent)" }} />
                    </div>
                    {/* Extra sectors */}
                    <p className="text-[0.55rem] font-heading font-bold text-foreground/25 tracking-[3px] uppercase px-2 mb-2">In Arrivo & Su Richiesta</p>
                    {extraSectors.map((sec, i) => (
                      <motion.div key={`extra-${i}`}
                        className="flex items-center gap-3 p-3 rounded-2xl transition-all"
                        style={{ background: "hsla(0,0%,100%,0.01)", border: "1px solid hsla(0,0%,100%,0.03)" }}
                        whileHover={{ background: "hsla(0,0%,100%,0.03)", scale: 1.01 }}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.02 }}
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sec.gradient} flex items-center justify-center text-lg shadow-lg flex-shrink-0 opacity-70`}>
                          {sec.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-heading font-bold text-foreground/60 truncate">{sec.title}</p>
                          <p className="text-[0.6rem] text-foreground/20 truncate">{sec.desc}</p>
                        </div>
                        <span className="text-[0.5rem] font-heading text-foreground/15 tracking-wider uppercase flex-shrink-0">Presto</span>
                      </motion.div>
                    ))}
                  </div>
                  {/* Bottom CTA */}
                  <div className="px-6 py-4" style={{ borderTop: "1px solid hsla(0,0%,100%,0.05)" }}>
                    <motion.button
                      onClick={() => { setSectorSheetOpen(false); scrollTo("contact"); }}
                      className="w-full py-3 rounded-xl font-heading font-bold text-xs tracking-wider uppercase text-primary-foreground"
                      style={{ background: "linear-gradient(135deg, hsla(265,70%,60%,1), hsla(280,60%,50%,1))", boxShadow: "0 8px 30px hsla(265,70%,60%,0.2)" }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    >
                      Non trovi il tuo? Contattaci →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          AI AGENTS SHOWCASE
         ═══════════════════════════════════════════ */}
      <AIAgentsShowcase />

      <SectionDivider />

      {/*
          PERCHÉ EMPIRE — Unified Section
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14">
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
                  <motion.div className="w-5 h-5 min-w-[20px] rounded-full bg-primary/15 flex items-center justify-center mt-0.5"
                    animate={{ boxShadow: ["0 0 0px hsla(265,70%,60%,0)", "0 0 12px hsla(265,70%,60%,0.3)", "0 0 0px hsla(265,70%,60%,0)"] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}>
                    <Check className="w-3 h-3 text-primary" />
                  </motion.div>
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

        {/* Benefits Grid — compact 6-col */}
        <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {whyUs.map((item, i) => (
            <motion.div key={i} variants={popIn}>
              <PremiumCard scan delay={i * 0.3} className="p-4 text-center">
                <motion.div className="text-primary/50 mb-2 flex justify-center"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}>{item.icon}</motion.div>
                <h4 className="text-[0.65rem] font-heading font-bold text-foreground mb-1">{item.title}</h4>
                <p className="text-[0.5rem] text-foreground/30 leading-[1.5]">{item.desc}</p>
              </PremiumCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

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
            <motion.div key={i} variants={popIn}>
              <PremiumCard scan delay={i} className="p-4 text-center">
                <motion.div className="text-primary mb-2 flex justify-center"
                  animate={{ y: [0, -4, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
                >{spec.icon}</motion.div>
                <p className="text-xs font-heading font-bold text-foreground">{spec.value}</p>
                <p className="text-[0.55rem] text-foreground/30 mt-0.5 tracking-wider uppercase">{spec.label}</p>
              </PremiumCard>
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

        {/* Auto-scrolling carousel */}
        {(() => {
          const mockups = [
            { img: mockupCliente, title: "App Cliente", desc: "Prenota servizi, gestisci appuntamenti e ricevi aggiornamenti in tempo reale.", tag: "FRONT-END", sector: "Beauty & Wellness", features: ["Prenotazioni online", "Loyalty & Cashback", "Push Notification", "Chat Diretta"] },
            { img: mockupAdmin, title: "Dashboard Admin", desc: "Analytics IA, CRM, gestione team, fatturazione e marketing automation per ogni settore.", tag: "BACK-OFFICE", sector: "Multi-Settore", features: ["Analytics predittivi", "CRM & Segmentazione", "Fatturazione elettronica", "Marketing automatizzato"] },
            { img: mockupCucina, title: "Pannello Operativo", desc: "Vista operativa real-time: interventi, appuntamenti, flotta, staff e postazioni.", tag: "OPERATIONS", sector: "NCC & Trasporti", features: ["Live tracking operativo", "Gestione turni & team", "Compliance & controlli", "Notifiche smart"] },
            { img: mockupCliente, title: "Booking Engine", desc: "Prenotazione ombrelloni, lettini e servizi spiaggia con mappa interattiva.", tag: "FRONT-END", sector: "Beach & Hospitality", features: ["Mappa interattiva", "Pagamento anticipato", "QR Code accesso", "Meteo integrato"] },
            { img: mockupAdmin, title: "Fleet Manager", desc: "Gestione veicoli, autisti, tratte e pricing dinamico con tracking GPS.", tag: "BACK-OFFICE", sector: "NCC Premium", features: ["GPS live tracking", "Pricing dinamico", "Scadenzario docs", "Revenue analytics"] },
            { img: mockupCucina, title: "Agenda Smart", desc: "Calendario appuntamenti, gestione slot e notifiche automatiche per clienti.", tag: "OPERATIONS", sector: "Healthcare & Fitness", features: ["Agenda drag & drop", "Reminder automatici", "Schede paziente", "Report periodici"] },
          ];
          return (
            <div className="relative overflow-hidden -mx-5 sm:-mx-6 px-5 sm:px-6">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, hsl(var(--background)), transparent)" }} />
              <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, hsl(var(--background)), transparent)" }} />
              
              <div className="flex gap-6 sm:gap-8"
                style={{
                  animation: "carousel-scroll 35s linear infinite",
                  width: "max-content",
                }}>
                {[...mockups, ...mockups].map((mock, i) => (
                  <div key={i} className="group flex flex-col items-center flex-shrink-0 w-[220px]">
                    {/* iPhone frame */}
                    <div className="relative mb-5">
                      {/* Ambient glow */}
                      <div className="absolute -inset-4 rounded-[52px] opacity-15 blur-2xl pointer-events-none bg-primary group-hover:opacity-25 transition-opacity duration-700" />
                      
                      {/* Phone body */}
                      <div className="relative w-[200px] h-[410px] rounded-[38px] border-[3px] border-foreground/15 bg-foreground/5 shadow-[0_16px_50px_hsla(0,0%,0%,0.45)] overflow-hidden transition-all duration-500 group-hover:shadow-[0_20px_60px_hsla(265,70%,60%,0.15)]">
                        {/* Dynamic Island */}
                        <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[70px] h-[20px] bg-foreground/80 rounded-full z-20" />
                        
                        {/* Tag badge */}
                        <div className="absolute top-[34px] left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-full border border-primary/20 bg-background/70 backdrop-blur-sm">
                          <span className="text-[0.45rem] font-heading font-bold text-primary/70 tracking-[2px]">{mock.tag}</span>
                        </div>

                        {/* Sector badge */}
                        <div className="absolute top-[54px] left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-full bg-primary/10 backdrop-blur-sm">
                          <span className="text-[0.4rem] font-heading text-primary/60 tracking-wider">{mock.sector}</span>
                        </div>

                        {/* Screen */}
                        <div className="absolute inset-[3px] rounded-[34px] overflow-hidden bg-background">
                          <img src={mock.img} alt={mock.title} className="w-full h-full object-cover object-top group-hover:scale-[1.05] transition-transform duration-700" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent pointer-events-none" />
                          {/* Title overlay */}
                          <div className="absolute bottom-8 left-4 right-4 z-10">
                            <h3 className="font-heading text-sm font-bold text-foreground mb-1">{mock.title}</h3>
                            <p className="text-[0.55rem] text-foreground/45 leading-[1.5]">{mock.desc}</p>
                          </div>
                        </div>

                        {/* Home indicator */}
                        <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[80px] h-[4px] bg-foreground/20 rounded-full z-20" />
                      </div>
                    </div>

                    {/* Features below */}
                    <div className="space-y-2 w-full max-w-[200px]">
                      {mock.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-2 text-[0.65rem] text-foreground/40">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          BUILD ANYTHING — Streamlined Conversion Section
         ═══════════════════════════════════════════ */}
      <Section style={{ background: "linear-gradient(180deg, hsla(260,18%,8%,1) 0%, hsla(265,22%,7%,1) 50%, hsla(260,18%,8%,1) 100%)" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none" style={{ background: "radial-gradient(ellipse, hsla(265,70%,60%,0.05), transparent 70%)" }} />

        <div className="text-center mb-14">
          <SectionLabel text="Su Misura" icon={<Sparkles className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.8rem,5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.05] mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Costruiamo <span className="text-shimmer">Qualsiasi Cosa</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[500px] mx-auto text-sm leading-[1.8]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Nessun pacchetto standard. Analizziamo il tuo business, progettiamo la soluzione perfetta e la costruiamo su misura.
          </motion.p>
        </div>

        {/* ═══ 3 Pillars ═══ */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-14"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {[
            { icon: <Palette className="w-5 h-5" />, title: "100% White Label", desc: "Colori, font, logo, layout — ogni pixel è il tuo brand.", accent: "Il TUO brand" },
            { icon: <Workflow className="w-5 h-5" />, title: "Automazione Totale", desc: "Booking, fatture, reminder, marketing — tutto in autopilot.", accent: "Zero lavoro manuale" },
            { icon: <Rocket className="w-5 h-5" />, title: "Sviluppo Custom", desc: "Moduli dedicati, integrazioni, logiche proprietarie su richiesta.", accent: "Nessun limite" },
          ].map((card, i) => (
            <motion.div key={i} variants={fadeScale}>
              <PremiumCard glow scan delay={i} className="p-6">
                <PremiumIcon gradient="from-primary/20 to-accent/15" size="md" delay={i * 0.6}>
                  <span className="text-primary">{card.icon}</span>
                </PremiumIcon>
                <div className="mt-4"></div>
                <h3 className="font-heading text-sm font-bold text-foreground mb-2">{card.title}</h3>
                <p className="text-[0.7rem] text-foreground/35 leading-[1.7] mb-3">{card.desc}</p>
                <motion.span className="text-[0.6rem] font-heading font-semibold text-primary/60 tracking-wider inline-flex items-center gap-1.5"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  {card.accent}
                </motion.span>
              </PremiumCard>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══ Scrolling Capabilities Ticker ═══ */}
        <div className="relative mb-14 -mx-5 sm:-mx-6 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, hsla(260,18%,8%,1), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, hsla(260,18%,8%,1), transparent)" }} />
          {[0, 1].map(row => (
            <div key={row} className="flex whitespace-nowrap mb-2" style={{ animation: `carousel-scroll ${row === 0 ? "40s" : "45s"} linear infinite ${row === 1 ? "reverse" : ""}` }}>
              {[...Array(2)].map((_, rep) => (
                <div key={rep} className="flex gap-2 px-1">
                  {(row === 0
                    ? ["App White-Label", "Dashboard IA", "Menu QR", "Booking Online", "CRM Avanzato", "Push Notification", "Fatturazione", "Analytics", "Chat Clienti", "GPS Tracking", "Mappa Tavoli", "Gestione Staff"]
                    : ["Pagamenti", "Email Marketing", "WhatsApp Auto", "Inventario", "HACCP", "Review Shield™", "Agenda Smart", "Pricing Dinamico", "Landing SEO", "Cross-selling IA", "Programma Fedeltà", "Schede Paziente"]
                  ).map((cap, ci) => (
                    <span key={ci} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.6rem] font-heading tracking-wider"
                      style={{ background: "hsla(265,70%,60%,0.06)", border: "1px solid hsla(265,70%,60%,0.08)", color: "hsla(265,70%,65%,0.5)" }}>
                      <CircleCheck className="w-2.5 h-2.5" />
                      {cap}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ═══ Bottom Promise ═══ */}
        <motion.div className="max-w-2xl mx-auto text-center p-8 sm:p-10 rounded-2xl border border-primary/10 overflow-hidden relative"
          style={{ background: "hsla(265,20%,10%,0.4)" }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="absolute inset-0 premium-holo-grid opacity-[0.04] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.3), transparent)" }} />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              {[
                { val: "25+", label: "Settori" },
                { val: "100+", label: "Moduli" },
                { val: "∞", label: "Possibilità" },
              ].map((s, i) => (
                <motion.div key={i} className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <p className="text-xl sm:text-2xl font-heading font-bold text-shimmer">{s.val}</p>
                  <p className="text-[0.5rem] text-foreground/30 tracking-[2px] uppercase">{s.label}</p>
                </motion.div>
              ))}
            </div>
            <h3 className="text-base sm:text-lg font-heading font-bold text-foreground mb-2">
              "Se puoi immaginarlo, <span className="text-shimmer">noi lo costruiamo.</span>"
            </h3>
            <p className="text-[0.7rem] text-foreground/30 mb-6 max-w-md mx-auto">
              Il tuo business merita una soluzione costruita su misura. Non un compromesso.
            </p>
            <motion.button
              onClick={() => scrollTo("pricing")}
              className="px-7 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2"
              whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(265,70%,60%,0.25)" }}
              whileTap={{ scale: 0.97 }}
            >
              Inizia Ora <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </Section>

      <SectionDivider />

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

        {/* ═══ Mobile: 2-col compact grid ═══ */}
        <div className="sm:hidden">
          <motion.div className="grid grid-cols-2 gap-2.5"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }}>
            {services.map((s, i) => (
              <motion.div key={i} variants={fadeUp}
                className="group relative p-3.5 rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] backdrop-blur-sm hover:border-primary/20 transition-all duration-500 overflow-hidden">
                {/* Ambient glow */}
                <div className={`absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br ${s.color} opacity-[0.06] blur-xl group-hover:opacity-[0.12] transition-opacity duration-500 pointer-events-none`} />
                <div className="flex items-center gap-2 mb-2.5">
                  <PremiumIcon gradient={s.color} size="sm" delay={i * 0.2}>
                    {s.icon}
                  </PremiumIcon>
                  <span className="text-[0.4rem] px-1.5 py-0.5 rounded-full border border-primary/15 bg-primary/[0.06] text-primary/70 font-bold tracking-[1.5px] font-heading">{s.tag}</span>
                </div>
                <h3 className="font-heading text-[0.7rem] font-semibold text-foreground mb-1 leading-tight">{s.title}</h3>
                <p className="text-[0.58rem] text-foreground/35 leading-[1.5]">{s.desc}</p>
                {/* Bottom accent */}
                <div className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ═══ Desktop: Grid ═══ */}
        <motion.div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {services.map((s, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.01 }}>
              <PremiumCard glow scan delay={i} className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <PremiumIcon gradient={s.color} size="md" delay={i * 0.3}>
                    {s.icon}
                  </PremiumIcon>
                  <motion.span className="text-[0.5rem] px-2.5 py-1 rounded-full border border-primary/15 bg-primary/[0.06] text-primary/70 font-bold tracking-[2px] font-heading relative overflow-hidden"
                    animate={{ borderColor: ["hsla(265,70%,60%,0.1)", "hsla(265,70%,60%,0.25)", "hsla(265,70%,60%,0.1)"] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}>
                    <motion.div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)" }}
                      animate={{ x: ["-150%", "250%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }} />
                    <span className="relative z-10">{s.tag}</span>
                  </motion.span>
                </div>
                <h3 className="font-heading text-sm sm:text-base font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-foreground/40 leading-[1.7]">{s.desc}</p>
              </PremiumCard>
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
                className="relative w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 overflow-hidden"
                style={{ background: "hsla(265,20%,8%,0.6)", border: "1px solid hsla(265,70%,60%,0.1)", backdropFilter: "blur(8px)" }}
                whileHover={{ rotate: 5, scale: 1.08, borderColor: "hsla(265,70%,60%,0.25)" }}
              >
                {/* Scanning beam */}
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, transparent 40%, hsla(265,80%,70%,0.06) 50%, transparent 60%)" }}
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 + i, ease: "easeInOut" }} />
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.25), transparent)" }} />
                <div className="flex items-center justify-center w-full h-full text-primary relative z-10">{s.icon}</div>
                <motion.span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-vibrant-gradient flex items-center justify-center text-[0.55rem] font-bold text-primary-foreground font-heading z-20 overflow-hidden"
                  animate={{ boxShadow: ["0 0 10px hsla(265,70%,60%,0.2)", "0 0 25px hsla(265,70%,60%,0.5)", "0 0 10px hsla(265,70%,60%,0.2)"] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}>
                  <motion.div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)" }}
                    animate={{ x: ["-150%", "250%"] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }} />
                  <span className="relative z-10">{s.step}</span>
                </motion.span>
              </motion.div>
              <h3 className="font-heading text-xs sm:text-sm font-bold text-foreground mb-1.5">{s.title}</h3>
              <p className="text-[0.65rem] sm:text-xs text-foreground/40 leading-[1.6]">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          NCC & LUXURY TRANSPORT SHOWCASE — Compact
         ═══════════════════════════════════════════ */}
      <Section id="app" style={{ background: "linear-gradient(180deg, hsla(260,18%,8%,1) 0%, hsla(265,22%,7%,1) 50%, hsla(260,18%,8%,1) 100%)" }}>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center lg:text-left">
            <SectionLabel text="NCC & Trasporti" icon={<Car className="w-3 h-3 text-primary" />} />
            <h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-heading font-bold text-foreground leading-[1.08] mb-5">
              Trasporto Premium,<br /><span className="text-shimmer">Automatizzato al 100%</span>
            </h2>
            <p className="text-foreground/40 leading-[1.7] max-w-lg mx-auto lg:mx-0 mb-7 text-sm">
              Gestisci flotta NCC, prenotazioni e autisti con un sistema AI che automatizza tariffe, assegnazioni e comunicazioni — tutto con il tuo brand.
            </p>
            <div className="space-y-3 mb-8 text-left max-w-md mx-auto lg:mx-0">
              {[
                { title: "Booking Engine Intelligente", desc: "Prenotazioni con calcolo tariffe automatico per tratta e veicolo", icon: <Calendar className="w-3 h-3" /> },
                { title: "Gestione Flotta & Autisti", desc: "Monitora scadenze CQC, patenti e revisioni in tempo reale", icon: <Shield className="w-3 h-3" /> },
                { title: "Tariffe Dinamiche", desc: "Prezzi custom per tratta, extra notturno e festivi", icon: <TrendingUp className="w-3 h-3" /> },
                { title: "Tracking & Notifiche Live", desc: "Conferme, reminder e tracking in tempo reale per il cliente", icon: <Bell className="w-3 h-3" /> },
              ].map((f, i) => (
                <motion.div key={i} className="flex gap-3 items-start group"
                  initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="w-7 h-7 min-w-[28px] rounded-lg bg-primary/10 flex items-center justify-center mt-0.5 group-hover:bg-primary/20 transition-colors">
                    <span className="text-primary">{f.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{f.title}</p>
                    <p className="text-[0.6rem] text-foreground/35 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              onClick={() => navigate("/b/amalfi-luxury-transfer")}
              className="group px-7 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2"
              whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(265,70%,60%,0.2)" }}
              whileTap={{ scale: 0.97 }}
            >
              Scopri Demo NCC <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </motion.div>

          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="w-full">
            <div className="relative rounded-2xl overflow-hidden glow-card">
              <img src={nccFleetShowcase} alt="NCC Fleet Management" className="w-full aspect-[4/3] object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />
              {/* Overlay stats */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                {[
                  { label: "Flotta", val: "12 veicoli" },
                  { label: "Rating", val: "4.9★" },
                  { label: "Revenue", val: "+40%" },
                ].map((s, i) => (
                  <div key={i} className="flex-1 px-2 py-2 rounded-lg text-center" style={{ background: "hsla(0,0%,0%,0.6)", backdropFilter: "blur(8px)", border: "1px solid hsla(0,0%,100%,0.08)" }}>
                    <p className="text-[0.5rem] text-foreground/40 tracking-wider uppercase">{s.label}</p>
                    <p className="text-[0.65rem] font-heading font-bold text-foreground">{s.val}</p>
                  </div>
                ))}
              </div>
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
      <Section id="testimonials" style={{ background: "linear-gradient(180deg, hsla(260,18%,8%,1) 0%, hsla(265,20%,6%,1) 50%, hsla(260,18%,8%,1) 100%)" }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none" style={{ background: "radial-gradient(ellipse, hsla(265,70%,60%,0.04), transparent 70%)" }} />
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
          <motion.div className="relative p-7 sm:p-9 rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-b from-primary/[0.06] via-deep-black/60 to-background"
            variants={fadeScale} whileHover={{ y: -4 }}>
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-vibrant-gradient" />
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-vibrant-gradient text-[0.55rem] font-bold text-primary-foreground tracking-[2px] font-heading uppercase">Più Scelto</div>
            <span className="text-[0.6rem] font-heading font-semibold text-primary/70 tracking-[3px] uppercase">Pagamento Unico</span>
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
              className="w-full py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase"
              whileHover={{ scale: 1.02, boxShadow: "0 15px 50px hsla(265,70%,60%,0.25)" }}
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
            <motion.div key={i} variants={popIn}>
              <PremiumCard glow scan delay={i} className="p-5 sm:p-6 text-center">
                <div className="flex justify-center mb-3">
                  <PremiumIcon gradient="from-primary/20 to-accent/15" size="md" delay={i * 0.4}>
                    <span className="text-primary">{s.icon}</span>
                  </PremiumIcon>
                </div>
                <motion.p className="text-xl sm:text-2xl font-heading font-bold text-vibrant-gradient"
                  animate={{ textShadow: ["0 0 10px hsla(265,70%,60%,0)", "0 0 20px hsla(265,70%,60%,0.3)", "0 0 10px hsla(265,70%,60%,0)"] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>{s.value}</motion.p>
                <p className="text-[0.55rem] sm:text-[0.6rem] text-foreground/40 mt-1 tracking-wider uppercase font-heading">{s.label}</p>
              </PremiumCard>
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
      <Section style={{ background: "linear-gradient(180deg, hsla(260,18%,8%,1) 0%, hsla(265,22%,7%,1) 50%, hsla(260,18%,8%,1) 100%)" }}>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 20%, hsla(265,70%,60%,0.03), transparent 60%)" }} />
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
        <div className="relative text-center p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-primary/[0.08] via-deep-black/80 to-accent/[0.04] border border-primary/15 overflow-hidden animated-border">
          <div className="absolute inset-0 aurora-mesh opacity-30" />
          {/* Violet ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px]" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.4), transparent)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[40px] blur-[30px]" style={{ background: "hsla(265, 70%, 60%, 0.12)" }} />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Crown className="w-12 h-12 mx-auto mb-6 text-primary" style={{ filter: "drop-shadow(0 0 40px hsla(265,70%,60%,0.3))" }} />
            </motion.div>
            <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4">
              Pronto a Costruire il Tuo <span className="text-shimmer">Impero?</span>
            </h2>
            <p className="text-sm text-foreground/35 max-w-md mx-auto mb-8">
              25+ settori, automazione totale, IA integrata, aggiornamenti settimanali. I tuoi competitor si stanno digitalizzando. Non restare indietro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button onClick={() => navigate("/admin")}
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase flex items-center justify-center gap-2"
                whileHover={{ scale: 1.03, boxShadow: "0 20px 60px hsla(265,70%,60%,0.25)" }}
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
      <footer id="contact" className="relative py-20 pb-10 px-5 sm:px-6 overflow-hidden"
        style={{ background: "linear-gradient(180deg, hsla(260,25%,6%,1) 0%, hsla(265,30%,3%,1) 60%, hsla(260,20%,2%,1) 100%)" }}>
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 5%, hsla(265,70%,60%,0.3) 30%, hsla(280,45%,68%,0.4) 50%, hsla(265,70%,60%,0.3) 70%, transparent 95%)" }} />
        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[120px] blur-[80px] pointer-events-none" style={{ background: "hsla(265,70%,60%,0.06)" }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 premium-holo-grid opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 max-w-[1100px] mx-auto">
          {/* Top row: Logo + Newsletter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-16">
            <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl blur-md" style={{ background: "hsla(265,70%,60%,0.15)" }} />
                <div className="relative w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsla(265,70%,60%,1), hsla(280,60%,50%,1))", boxShadow: "0 0 25px hsla(265,70%,60%,0.25)" }}>
                  <Crown className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <span className="font-heading font-bold tracking-[0.2em] uppercase text-sm text-white">EMPIRE</span>
                <span className="text-[0.55rem] tracking-[0.3em] uppercase block" style={{ background: "linear-gradient(90deg, hsla(265,70%,65%,1), hsla(280,50%,75%,1))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AUTONOMOUS AI</span>
              </div>
            </motion.div>
            <motion.p className="text-[0.7rem] text-white/25 max-w-[340px] leading-[1.8] font-light"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              La piattaforma AI autonoma più completa al mondo. Tecnologia proprietaria che trasforma qualsiasi business in un impero digitale.
            </motion.p>
          </div>

          {/* Main grid */}
          <motion.div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-12 mb-16"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ staggerChildren: 0.1 }}>
            <div>
              <h4 className="font-heading text-[0.55rem] font-bold text-white/50 mb-5 tracking-[4px] uppercase flex items-center gap-2">
                <span className="w-4 h-px" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                Settori
              </h4>
              <div className="space-y-3 text-[0.65rem]">
                {["Food & Ristorazione", "NCC & Trasporto", "Beauty & Wellness", "Healthcare & Medical", "Retail & E-commerce", "Fitness & Sport"].map((s, i) => (
                  <p key={i} className="text-white/25 hover:text-white/60 transition-colors cursor-default flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                    {s}
                  </p>
                ))}
                <p className="text-[0.6rem] font-heading font-semibold mt-2" style={{ color: "hsla(265,70%,65%,0.5)" }}>+19 altri settori</p>
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.55rem] font-bold text-white/50 mb-5 tracking-[4px] uppercase flex items-center gap-2">
                <span className="w-4 h-px" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                Piattaforma
              </h4>
              <div className="space-y-3 text-[0.65rem]">
                {[
                  { label: "Funzionalità", href: "#services" },
                  { label: "Automazioni IA", href: "#capacita" },
                  { label: "ROI Calculator", href: "#calculator" },
                  { label: "Piani & Prezzi", href: "#pricing" },
                  { label: "Partner Program", href: "#partner" },
                  { label: "Demo Live", href: "/demo" },
                ].map((link, i) => (
                  <a key={i} href={link.href} className="block text-white/25 hover:text-white/60 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.55rem] font-bold text-white/50 mb-5 tracking-[4px] uppercase flex items-center gap-2">
                <span className="w-4 h-px" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                Tecnologia
              </h4>
              <div className="space-y-3 text-[0.65rem]">
                {["Engine AI Proprietario", "Automazione End-to-End", "PWA White-Label", "Analytics Predittivi", "GDPR & AES-256", "API & Integrazioni"].map((s, i) => (
                  <p key={i} className="text-white/25 hover:text-white/60 transition-colors cursor-default flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                    {s}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.55rem] font-bold text-white/50 mb-5 tracking-[4px] uppercase flex items-center gap-2">
                <span className="w-4 h-px" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                Contatti
              </h4>
              <div className="space-y-3 text-[0.65rem]">
                <p className="text-white/25 flex items-center gap-2.5"><Mail className="w-3.5 h-3.5" style={{ color: "hsla(265,70%,60%,0.5)" }} /> info@empire-suite.it</p>
                <p className="text-white/25 flex items-center gap-2.5"><MapPin className="w-3.5 h-3.5" style={{ color: "hsla(265,70%,60%,0.5)" }} /> Roma, Italia</p>
                <div className="pt-3">
                  <a href="/privacy" className="block text-white/20 hover:text-white/50 transition-colors mb-2">Privacy Policy</a>
                  <a href="/cookie-policy" className="block text-white/20 hover:text-white/50 transition-colors">Cookie Policy</a>
                </div>
              </div>
              {/* Social icons */}
              <div className="flex gap-2.5 mt-5">
                {["In", "𝕏", "IG"].map((s, i) => (
                  <motion.div key={i}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[0.6rem] text-white/20 cursor-pointer transition-all duration-300"
                    style={{ border: "1px solid hsla(265,70%,60%,0.1)", background: "hsla(265,70%,60%,0.03)" }}
                    whileHover={{ scale: 1.1, borderColor: "hsla(265,70%,60%,0.4)", color: "hsla(265,70%,65%,1)", background: "hsla(265,70%,60%,0.08)" }}
                  >
                    {s}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom bar */}
          <div className="relative pt-8">
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.12), transparent)" }} />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.6rem] text-white/15">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsla(130,60%,50%,0.5)", boxShadow: "0 0 6px hsla(130,60%,50%,0.3)" }} />
                <span className="text-white/25">Tutti i sistemi operativi</span>
                <span className="mx-2">·</span>
                © 2026 Empire AI · Piattaforma Multi-Settore
              </p>
              <div className="flex gap-6">
                <a href="/privacy" className="hover:text-white/40 transition-colors">Privacy</a>
                <a href="/cookie-policy" className="hover:text-white/40 transition-colors">Cookie</a>
                <span>P.IVA IT12345678901</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════ STICKY CTA MOBILE ═══════ */}
      <motion.div className="fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] bg-background/80 backdrop-blur-2xl border-t border-border/20 md:hidden"
        initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 2, type: "spring", damping: 25 }}>
        <div className="flex gap-2">
          <motion.button onClick={() => scrollTo("pricing")}
            className="flex-1 py-3.5 rounded-xl bg-vibrant-gradient text-primary-foreground font-bold text-sm tracking-wider font-heading uppercase"
            whileTap={{ scale: 0.97 }}
          >
            Inizia Ora
          </motion.button>
          <motion.button onClick={() => navigate("/demo")}
            className="px-4 py-3.5 rounded-xl border border-primary/15 text-primary"
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
      {/* ATLAS Voice Agent */}
      <Suspense fallback={null}>
        <EmpireVoiceAgent />
      </Suspense>
    </div>
  );
};

export default LandingPage;
