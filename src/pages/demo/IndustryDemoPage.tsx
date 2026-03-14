import { useState, useMemo, useRef, useEffect, FormEvent, lazy, Suspense } from "react";
import BackButton from "@/components/BackButton";
const DemoSalesAgent = lazy(() => import("@/components/public/DemoSalesAgent"));
import { useParams, useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_INDUSTRY_DATA, DEMO_SLUGS, type DemoService } from "@/data/demo-industries";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import IndustryPhoneShowcase from "@/components/public/IndustryPhoneShowcase";
import NCCPublicSite from "@/pages/public/NCCPublicSite";
import BeautyPublicSite from "@/pages/public/BeautyPublicSite";
import HealthcarePublicSite from "@/pages/public/HealthcarePublicSite";
import RetailPublicSite from "@/pages/public/RetailPublicSite";
import FitnessPublicSite from "@/pages/public/FitnessPublicSite";
import HotelPublicSite from "@/pages/public/HotelPublicSite";
import BeachPublicSite from "@/pages/public/BeachPublicSite";
import FoodPublicSite from "@/pages/public/FoodPublicSite";
import TradesPublicSite from "@/pages/public/TradesPublicSite";
import LuxuryPublicSite from "@/pages/public/LuxuryPublicSite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, ArrowLeft, Shield, Zap,
  Heart, Award, Users, Sparkles, ChevronRight, Send, CheckCircle,
  Menu as MenuIcon, X, Leaf, Camera, Truck, GraduationCap,
  Calendar, Globe, Package, Coffee, Sun, Waves, Baby, BookOpen,
  Settings, TrendingUp, Calculator, Palette, Image, Monitor,
  Wrench, FileText, HardHat, Bike, Wine, Stethoscope, Dumbbell,
  ArrowRight, MessageCircle, BarChart3, QrCode, Bell, Bot,
  Smartphone, CreditCard, Lock, Layers, Radio, Eye, ChefHat,
  Scissors, Building, Car, Store, Dumbbell as Gym
} from "lucide-react";

/* ═══════════════════════════════════════════
   SECTOR-SPECIFIC THEME CONFIGS
   ═══════════════════════════════════════════ */

interface SectorTheme {
  gradient: string;
  accent: string;
  accentRgb: string;
  bgFrom: string;
  bgTo: string;
  heroEmoji: string;
  platformFeatures: { icon: React.ReactNode; title: string; desc: string }[];
}

const SECTOR_THEMES: Record<string, SectorTheme> = {
  food: {
    gradient: "from-orange-500 via-red-500 to-rose-600",
    accent: "#e85d04",
    accentRgb: "232, 93, 4",
    bgFrom: "#1a0a00",
    bgTo: "#0d0d0d",
    heroEmoji: "🍽️",
    platformFeatures: [
      { icon: <QrCode className="w-5 h-5" />, title: "Menu Digitale QR", desc: "I clienti scansionano e ordinano dal tavolo" },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Dashboard Vendite", desc: "Revenue, piatti top e trend in tempo reale" },
      { icon: <Bell className="w-5 h-5" />, title: "Ordini in Cucina", desc: "Display cucina con priorità e tempi" },
      { icon: <Bot className="w-5 h-5" />, title: "AI Upselling", desc: "Suggerimenti intelligenti basati sullo storico" },
      { icon: <Users className="w-5 h-5" />, title: "CRM Clienti", desc: "Storico ordini, preferenze e fidelizzazione" },
      { icon: <CreditCard className="w-5 h-5" />, title: "Pagamenti Online", desc: "Stripe integrato, commissioni zero" },
    ],
  },
  ncc: {
    gradient: "from-amber-400 via-yellow-500 to-amber-600",
    accent: "#D4A017",
    accentRgb: "212, 160, 23",
    bgFrom: "#1A1A2E",
    bgTo: "#0d0d0d",
    heroEmoji: "🚘",
    platformFeatures: [
      { icon: <Car className="w-5 h-5" />, title: "Gestione Flotta", desc: "Veicoli, scadenze, manutenzione in un click" },
      { icon: <Calendar className="w-5 h-5" />, title: "Prenotazioni Online", desc: "Booking automatico con conferma istantanea" },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Pricing Dinamico", desc: "Tariffe per tratta, veicolo e stagione" },
      { icon: <Users className="w-5 h-5" />, title: "Gestione Autisti", desc: "Assegnazione, licenze e rating" },
      { icon: <Globe className="w-5 h-5" />, title: "Sito Web Premium", desc: "Landing page professionale inclusa" },
      { icon: <MessageCircle className="w-5 h-5" />, title: "WhatsApp Integrato", desc: "Comunicazione diretta con i clienti" },
    ],
  },
  beauty: {
    gradient: "from-pink-400 via-rose-500 to-fuchsia-600",
    accent: "#ec4899",
    accentRgb: "236, 72, 153",
    bgFrom: "#1a0a14",
    bgTo: "#0d0d0d",
    heroEmoji: "💅",
    platformFeatures: [
      { icon: <Calendar className="w-5 h-5" />, title: "Agenda Intelligente", desc: "Prenotazioni online con slot automatici" },
      { icon: <Users className="w-5 h-5" />, title: "Schede Clienti", desc: "Storico trattamenti, allergie, preferenze" },
      { icon: <Bell className="w-5 h-5" />, title: "Reminder Automatici", desc: "SMS/WhatsApp prima dell'appuntamento" },
      { icon: <TrendingUp className="w-5 h-5" />, title: "Analytics Salone", desc: "Servizi top, orari di punta, revenue" },
      { icon: <CreditCard className="w-5 h-5" />, title: "Pagamenti & Fidelity", desc: "Tessera punti digitale integrata" },
      { icon: <Smartphone className="w-5 h-5" />, title: "App Clienti", desc: "Prenota, paga e accumula punti dal telefono" },
    ],
  },
  healthcare: {
    gradient: "from-cyan-400 via-teal-500 to-emerald-600",
    accent: "#14b8a6",
    accentRgb: "20, 184, 166",
    bgFrom: "#0a1a1a",
    bgTo: "#0d0d0d",
    heroEmoji: "🏥",
    platformFeatures: [
      { icon: <Calendar className="w-5 h-5" />, title: "Agenda Medica", desc: "Prenotazioni online con slot per specialità" },
      { icon: <FileText className="w-5 h-5" />, title: "Cartelle Pazienti", desc: "Storico visite, referti e prescrizioni" },
      { icon: <Bell className="w-5 h-5" />, title: "Reminder Visite", desc: "Notifiche automatiche pre-appuntamento" },
      { icon: <Lock className="w-5 h-5" />, title: "GDPR Compliant", desc: "Dati sanitari protetti e criptati" },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Report & Analytics", desc: "Visite, revenue e statistiche studio" },
      { icon: <CreditCard className="w-5 h-5" />, title: "Fatturazione", desc: "Fatture elettroniche automatiche" },
    ],
  },
  retail: {
    gradient: "from-violet-400 via-purple-500 to-indigo-600",
    accent: "#8b5cf6",
    accentRgb: "139, 92, 246",
    bgFrom: "#0d0a1a",
    bgTo: "#0d0d0d",
    heroEmoji: "🛍️",
    platformFeatures: [
      { icon: <Package className="w-5 h-5" />, title: "Catalogo Prodotti", desc: "Gestisci inventario con foto e varianti" },
      { icon: <Store className="w-5 h-5" />, title: "E-Commerce", desc: "Negozio online integrato con spedizioni" },
      { icon: <QrCode className="w-5 h-5" />, title: "QR Vetrina", desc: "I clienti acquistano scannerizzando" },
      { icon: <Users className="w-5 h-5" />, title: "CRM Clienti", desc: "Preferenze, ordini e programma fedeltà" },
      { icon: <TrendingUp className="w-5 h-5" />, title: "Analytics Vendite", desc: "Bestseller, margini e previsioni" },
      { icon: <Bell className="w-5 h-5" />, title: "Marketing Auto", desc: "Email e offerte personalizzate" },
    ],
  },
  fitness: {
    gradient: "from-lime-400 via-green-500 to-emerald-600",
    accent: "#22c55e",
    accentRgb: "34, 197, 94",
    bgFrom: "#0a1a0a",
    bgTo: "#0d0d0d",
    heroEmoji: "💪",
    platformFeatures: [
      { icon: <Calendar className="w-5 h-5" />, title: "Prenotazione Corsi", desc: "Iscrizione online a lezioni e personal" },
      { icon: <Users className="w-5 h-5" />, title: "Gestione Iscritti", desc: "Abbonamenti, scadenze e check-in" },
      { icon: <CreditCard className="w-5 h-5" />, title: "Pagamenti Ricorrenti", desc: "Addebito automatico abbonamenti" },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Dashboard Palestra", desc: "Iscritti attivi, revenue, retention" },
      { icon: <Smartphone className="w-5 h-5" />, title: "App Membri", desc: "Prenota, check-in e tracking allenamenti" },
      { icon: <Bell className="w-5 h-5" />, title: "Notifiche Smart", desc: "Reminder scadenze e nuovi corsi" },
    ],
  },
  hospitality: {
    gradient: "from-amber-300 via-orange-400 to-rose-500",
    accent: "#f59e0b",
    accentRgb: "245, 158, 11",
    bgFrom: "#1a140a",
    bgTo: "#0d0d0d",
    heroEmoji: "🏨",
    platformFeatures: [
      { icon: <Calendar className="w-5 h-5" />, title: "Booking Engine", desc: "Prenotazioni dirette senza commissioni OTA" },
      { icon: <Building className="w-5 h-5" />, title: "Gestione Camere", desc: "Disponibilità, tariffe e pulizie" },
      { icon: <Users className="w-5 h-5" />, title: "Guest Management", desc: "Check-in digitale e preferenze ospiti" },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Revenue Management", desc: "Occupancy, ADR e RevPAR in tempo reale" },
      { icon: <Globe className="w-5 h-5" />, title: "Sito Web & SEO", desc: "Sito multilingue ottimizzato per Google" },
      { icon: <Star className="w-5 h-5" />, title: "Recensioni", desc: "Gestione reputazione e risposte automatiche" },
    ],
  },
};

const getTheme = (industry: string): SectorTheme => {
  return SECTOR_THEMES[industry] || {
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
    accent: "#6366f1",
    accentRgb: "99, 102, 241",
    bgFrom: "#0a0a1a",
    bgTo: "#0d0d0d",
    heroEmoji: "⚡",
    platformFeatures: [
      { icon: <Calendar className="w-5 h-5" />, title: "Prenotazioni", desc: "Sistema di booking integrato" },
      { icon: <Users className="w-5 h-5" />, title: "CRM Clienti", desc: "Gestione clientela completa" },
      { icon: <BarChart3 className="w-5 h-5" />, title: "Analytics", desc: "Dashboard con KPI in tempo reale" },
      { icon: <CreditCard className="w-5 h-5" />, title: "Pagamenti", desc: "Incassi online e fatturazione" },
      { icon: <Bell className="w-5 h-5" />, title: "Automazioni", desc: "Notifiche e reminder automatici" },
      { icon: <Globe className="w-5 h-5" />, title: "Sito Web", desc: "Presenza online professionale" },
    ],
  };
};

/* ═══════════════════════════════════════════
   ANIMATED HELPERS
   ═══════════════════════════════════════════ */

const AnimatedNumber = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref as any, { once: true });
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

function AnimSection({ id, children, className = "", delay = 0, style }: { id?: string; children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section id={id} ref={ref} className={className} style={style}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ICON RESOLVER
   ═══════════════════════════════════════════ */
const ICON_MAP: Record<string, any> = {
  Shield, Zap, Heart, Award, Users, Sparkles, Star, Clock,
  Leaf, Camera, Truck, GraduationCap, Calendar, Globe, Package,
  Coffee, Sun, Waves, Baby, BookOpen, Settings, TrendingUp,
  Calculator, Palette, Image, Monitor, Wrench, FileText, HardHat,
  Bike, Wine, Stethoscope, Dumbbell, Phone, Mail, MapPin, Send,
  ChefHat: Star, Scissors, Building, Car, Store,
};
const resolveIcon = (name: string) => ICON_MAP[name] || Star;

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

export default function IndustryDemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Try DB first
  const { data: company } = useQuery({
    queryKey: ["demo-company", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      return data as any;
    },
    enabled: !!slug,
  });

  const resolvedIndustry: IndustryId = useMemo(() => {
    if (company?.industry) return company.industry as IndustryId;
    for (const [ind, s] of Object.entries(DEMO_SLUGS)) {
      if (s === slug) return ind as IndustryId;
    }
    return "custom";
  }, [company, slug]);

  const industryConfig = INDUSTRY_CONFIGS[resolvedIndustry];
  const demoData = DEMO_INDUSTRY_DATA[resolvedIndustry];
  const theme = getTheme(resolvedIndustry);
  const companyName = company?.name || demoData.companyName;
  const tagline = company?.tagline || demoData.tagline;

  // Categories
  const categories = useMemo(() => {
    const cats: string[] = [];
    demoData.services.forEach(s => { if (!cats.includes(s.category)) cats.push(s.category); });
    return cats;
  }, [demoData]);

  const [activeCat, setActiveCat] = useState("");
  const effectiveCat = activeCat || categories[0] || "";
  const filteredServices = useMemo(
    () => demoData.services.filter(s => s.category === effectiveCat),
    [demoData, effectiveCat]
  );
  const popularServices = useMemo(
    () => demoData.services.filter(s => s.popular),
    [demoData]
  );

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) { toast.error("Inserisci nome e telefono"); return; }
    setBookingSubmitted(true);
    toast.success("Richiesta inviata con successo! (Demo)");
    setFormData({});
    setTimeout(() => setBookingSubmitted(false), 5000);
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "services", label: industryConfig.terminology.items || "Servizi" },
    { id: "platform", label: "La Piattaforma" },
    { id: "reviews", label: "Recensioni" },
    { id: "booking", label: demoData.bookingLabel },
    { id: "contact", label: "Contatti" },
  ];

  const fieldLabels: Record<string, string> = {
    name: "Nome *", phone: "Telefono *", email: "Email", date: "Data", time: "Ora",
    guests: "Ospiti", service: "Servizio", pickup: "Partenza", dropoff: "Destinazione",
    address: "Indirizzo", passengers: "Passeggeri", notes: "Note aggiuntive",
  };

  // ═══ PREMIUM TEMPLATE ROUTING ═══
  // Route sectors with dedicated premium templates to those templates
  const PREMIUM_TEMPLATES: Record<string, React.ComponentType<{ company: any }>> = {
    ncc: NCCPublicSite,
    beauty: BeautyPublicSite,
    healthcare: HealthcarePublicSite,
    retail: RetailPublicSite,
    fitness: FitnessPublicSite,
    hospitality: HotelPublicSite,
    hotel: HotelPublicSite,
    agriturismo: HotelPublicSite,
    beach: BeachPublicSite,
    food: FoodPublicSite,
    restaurant: FoodPublicSite,
    plumber: TradesPublicSite,
    electrician: TradesPublicSite,
    cleaning: TradesPublicSite,
    gardening: TradesPublicSite,
    construction: TradesPublicSite,
    garage: TradesPublicSite,
  };

  const PremiumTemplate = PREMIUM_TEMPLATES[resolvedIndustry];
  if (PremiumTemplate) {
    const demoCompany = company || {
      id: "00000000-0000-0000-0000-000000000001",
      name: demoData.companyName,
      slug: slug || "demo",
      industry: resolvedIndustry,
      tagline: demoData.tagline,
      primary_color: industryConfig.defaultPrimaryColor,
      address: demoData.address,
      city: demoData.city,
      phone: demoData.phone,
      email: demoData.email,
      opening_hours: demoData.hours,
      social_links: {},
    };
    const accentColor = demoCompany.primary_color || industryConfig.defaultPrimaryColor;
    return (
      <>
        <BackButton to="/demo" label="Tutte le Demo" variant="floating" theme="glass" />
        <PremiumTemplate company={demoCompany} />
        {/* Phone Preview Showcase — compact, mobile-first */}
        <div className="py-10 sm:py-14 px-3 sm:px-4" style={{ background: "linear-gradient(180deg, #0a0a0a, #111)" }}>
          <div className="max-w-4xl mx-auto text-center mb-5 sm:mb-8">
            <p className="text-[10px] font-bold tracking-[4px] uppercase mb-1.5" style={{ color: accentColor }}>Anteprima Interfacce</p>
            <h3 className="text-lg sm:text-2xl font-bold text-white/90">La Tua App in 4 Schermate</h3>
            <p className="text-[10px] sm:text-xs text-white/35 mt-1 max-w-md mx-auto">Home · Catalogo · Prenotazioni · Dashboard — {industryConfig.label}</p>
          </div>
          <IndustryPhoneShowcase industryId={resolvedIndustry} />
        </div>
        <Suspense fallback={null}>
          <DemoSalesAgent industry={resolvedIndustry} companyName={companyName} accentColor={accentColor} />
        </Suspense>
      </>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: `linear-gradient(180deg, ${theme.bgFrom} 0%, ${theme.bgTo} 100%)` }}>
      <BackButton to="/demo" label="Tutte le Demo" variant="floating" theme="glass" />

      {/* ═══════ NAVBAR ═══════ */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b border-white/5"
        style={{ background: `${theme.bgFrom}dd` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/home")} className="mr-2 p-1.5 rounded-lg hover:bg-white/10 transition" title="Torna alla Home">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-lg">{theme.heroEmoji}</span>
            <span className="font-bold text-sm truncate max-w-[150px] sm:max-w-none">{companyName}</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeSection === l.id
                    ? "text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
                style={activeSection === l.id ? { backgroundColor: `${theme.accent}30` } : {}}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-white/5" style={{ background: theme.bgFrom }}>
              {navLinks.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)}
                  className="block w-full text-left px-6 py-3.5 text-sm text-white/70 hover:text-white transition"
                  style={activeSection === l.id ? { color: theme.accent } : {}}>
                  {l.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section id="home" className="relative pt-14">
        <div className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
              style={{ background: theme.accent, top: "10%", right: "-10%" }}
              animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
              style={{ background: theme.accent, bottom: "10%", left: "-5%" }}
              animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: `linear-gradient(${theme.accent}40 1px, transparent 1px), linear-gradient(90deg, ${theme.accent}40 1px, transparent 1px)`, backgroundSize: "60px 60px" }}
          />

          <div className="relative text-center px-6 py-20 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}>
              <motion.span className="text-7xl sm:text-8xl block mb-6"
                animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                {theme.heroEmoji}
              </motion.span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}>
              <Badge className="mb-4 text-xs font-medium px-3 py-1 border-0"
                style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
                {industryConfig.emoji} {industryConfig.label}
              </Badge>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-5 leading-[1.05] tracking-tight">
                {demoData.heroTitle.split(" ").map((word, i, arr) => (
                  <span key={i}>
                    {i >= arr.length - 2 ? (
                      <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>{word} </span>
                    ) : (
                      <>{word} </>
                    )}
                  </span>
                ))}
              </h1>

              <p className="text-lg sm:text-xl text-white/50 mb-8 max-w-xl mx-auto leading-relaxed">
                {demoData.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => scrollTo("services")} size="lg"
                  className="h-13 px-8 font-bold rounded-xl text-white border-0 text-base"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)` }}>
                  {demoData.ctaLabel} <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
                <Button onClick={() => scrollTo("booking")} size="lg" variant="outline"
                  className="h-13 px-8 rounded-xl border-white/15 text-white hover:bg-white/5 text-base">
                  {demoData.bookingLabel}
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div className="mt-14 grid grid-cols-3 gap-4 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              {[
                { value: 500, suffix: "+", label: "Clienti" },
                { value: 98, suffix: "%", label: "Soddisfatti" },
                { value: 5, suffix: "★", label: "Rating" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold" style={{ color: theme.accent }}>
                    <AnimatedNumber value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronRight className="w-5 h-5 text-white/20 rotate-90" />
          </motion.div>
        </div>
      </section>

      {/* ═══════ PHONE SHOWCASE — Right after hero ═══════ */}
      <AnimSection className="py-14 px-4" style={{ background: `linear-gradient(180deg, ${theme.bgFrom}, ${theme.accent}06, ${theme.bgTo})` }}>
        <div className="max-w-4xl mx-auto text-center mb-8">
          <motion.p className="text-[10px] font-bold tracking-[4px] uppercase mb-2"
            style={{ color: theme.accent }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Anteprima Interfacce
          </motion.p>
          <motion.h3 className="text-xl sm:text-2xl font-bold text-white/90"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Le Tue 4 Schermate
          </motion.h3>
          <motion.p className="text-xs text-white/35 mt-2 max-w-md mx-auto"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Home · Catalogo · Prenotazioni · Dashboard IA — personalizzato per {industryConfig.label}
          </motion.p>
        </div>
        <IndustryPhoneShowcase industryId={resolvedIndustry} />
      </AnimSection>

      <AnimSection className="border-y border-white/5" style={{ background: `linear-gradient(180deg, ${theme.accent}08, transparent)` } as any}>
        <div className="max-w-5xl mx-auto py-10 px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {demoData.features.map((f, i) => {
            const Icon = resolveIcon(f.icon);
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${theme.accent}15`, border: `1px solid ${theme.accent}20` }}>
                  <Icon className="w-5 h-5" style={{ color: theme.accent }} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white mb-0.5">{f.label}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimSection>

      {/* ═══════ POPULAR / HIGHLIGHTS ═══════ */}
      {popularServices.length > 0 && (
        <AnimSection className="max-w-5xl mx-auto py-16 px-4">
          <div className="text-center mb-10">
            <Badge className="mb-3 text-xs border-0" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
              ⭐ I Più Richiesti
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {resolvedIndustry === "food" ? "I Più Amati dai Clienti" : "I Nostri Servizi Top"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularServices.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
                <div className="group relative p-5 rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-500 cursor-pointer overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}08, transparent)` }}>
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at center, ${theme.accent}10, transparent 70%)` }} />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{s.emoji || "📌"}</span>
                        <h3 className="font-bold text-sm text-white">{s.name}</h3>
                      </div>
                      <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{s.description}</p>
                      {s.duration && <p className="text-[10px] text-white/30 mt-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-lg" style={{ color: theme.accent }}>
                        {s.price === 0 ? "Gratis" : `€${s.price.toLocaleString("it-IT")}`}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimSection>
      )}

      {/* ═══════ FULL SERVICE LIST ═══════ */}
      <AnimSection id="services" className="max-w-5xl mx-auto py-16 px-4">
        <div className="text-center mb-10">
          <Badge className="mb-3 text-xs border-0" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
            📋 Catalogo Completo
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold">
            {industryConfig.terminology.items || "I Nostri Servizi"}
          </h2>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none justify-center flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)}
              className="whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-semibold transition-all min-h-[40px]"
              style={effectiveCat === cat
                ? { backgroundColor: theme.accent, color: "#000" }
                : { backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }
              }>
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((s, i) => (
              <motion.div key={s.name}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-white/15 transition-all group cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}04, transparent)` }}>
                  <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">{s.emoji || "📋"}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-white">{s.name}</h3>
                    <p className="text-xs text-white/40 mt-0.5">{s.description}</p>
                    {s.duration && !s.duration.startsWith("/") && (
                      <p className="text-[10px] text-white/30 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {s.duration}</p>
                    )}
                  </div>
                  <span className="font-bold text-sm shrink-0" style={{ color: theme.accent }}>
                    {s.price === 0 ? "Gratis" : `€${s.price.toLocaleString("it-IT")}`}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </AnimSection>

      {/* ═══════ PLATFORM CAPABILITIES ═══════ */}
      <AnimSection id="platform" className="py-20 px-4"
        style={{ background: `linear-gradient(180deg, transparent, ${theme.accent}06, transparent)` } as any}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 text-xs border-0" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
              🚀 La Piattaforma
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Tutto Ciò che <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Gestisce per Te</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-sm leading-relaxed">
              Un pannello di controllo completo che automatizza, organizza e fa crescere il tuo business. Zero complessità, risultati immediati.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {theme.platformFeatures.map((feat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }} viewport={{ once: true }}>
                <div className="group relative p-6 rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-500 h-full overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}06, transparent)` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at top left, ${theme.accent}12, transparent 60%)` }} />
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${theme.accent}15`, border: `1px solid ${theme.accent}20` }}>
                      <span style={{ color: theme.accent }}>{feat.icon}</span>
                    </div>
                    <h3 className="font-bold text-sm text-white mb-1">{feat.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Extra platform benefits */}
          <motion.div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {[
              { emoji: "🔒", label: "GDPR Compliant" },
              { emoji: "📱", label: "PWA Mobile" },
              { emoji: "🤖", label: "AI Integrata" },
              { emoji: "⚡", label: "Setup in 5 Min" },
            ].map((b, i) => (
              <div key={i} className="text-center p-4 rounded-xl border border-white/5" style={{ background: `${theme.accent}04` }}>
                <span className="text-xl block mb-1">{b.emoji}</span>
                <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">{b.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </AnimSection>

      {/* ═══════ REVIEWS ═══════ */}
      <AnimSection id="reviews" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="mb-3 text-xs border-0" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
              ⭐ Recensioni
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold">Cosa Dicono di Noi</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {demoData.reviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className="p-6 rounded-2xl border border-white/5 h-full relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}06, transparent)` }}>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(r.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    {[...Array(5 - r.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-white/10" />
                    ))}
                  </div>
                  <p className="text-sm text-white/60 mb-4 italic leading-relaxed">"{r.comment}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}>
                      {r.name[0]}
                    </div>
                    <span className="text-xs font-semibold text-white/80">{r.name}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimSection>

      {/* ═══════ BOOKING FORM ═══════ */}
      <AnimSection id="booking" className="py-20 px-4"
        style={{ background: `linear-gradient(180deg, transparent, ${theme.accent}08, transparent)` } as any}>
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-3 text-xs border-0" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
              📩 Contattaci
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{demoData.bookingLabel}</h2>
            <p className="text-sm text-white/40">Compila il form e ti ricontattiamo noi</p>
          </div>

          {bookingSubmitted ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${theme.accent}20` }}>
                <CheckCircle className="w-10 h-10" style={{ color: theme.accent }} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Richiesta Inviata!</h3>
              <p className="text-sm text-white/40">Ti ricontatteremo al più presto.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl border border-white/5"
              style={{ background: `linear-gradient(135deg, ${theme.accent}04, transparent)` }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {demoData.bookingFields.map(field => (
                  <div key={field} className={field === "notes" ? "sm:col-span-2" : ""}>
                    <label className="text-xs text-white/40 mb-1.5 block font-medium">{fieldLabels[field] || field}</label>
                    {field === "notes" ? (
                      <Textarea
                        value={formData[field] || ""}
                        onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px] focus:border-white/20"
                        placeholder="Note aggiuntive..."
                      />
                    ) : field === "service" ? (
                      <select
                        value={formData[field] || ""}
                        onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))}
                        className="w-full h-11 min-h-[44px] rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 focus:border-white/20 transition"
                      >
                        <option value="">Seleziona...</option>
                        {demoData.services.map((s, i) => (
                          <option key={i} value={s.name} className="bg-slate-900">{s.name}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type={field === "date" ? "date" : field === "time" ? "time" : field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                        value={formData[field] || ""}
                        onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 focus:border-white/20"
                        placeholder={fieldLabels[field]?.replace(" *", "")}
                      />
                    )}
                  </div>
                ))}
              </div>
              <Button type="submit" className="w-full h-12 font-bold rounded-xl text-white border-0 text-sm"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)` }}>
                <Send className="w-4 h-4 mr-2" /> Invia Richiesta
              </Button>
              <p className="text-[10px] text-white/20 text-center">Questo è un sito demo. Nessun dato viene salvato.</p>
            </form>
          )}
        </div>
      </AnimSection>

      {/* ═══════ CONTACT & HOURS ═══════ */}
      <AnimSection id="contact" className="py-16 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Info */}
          <div className="p-6 rounded-2xl border border-white/5" style={{ background: `${theme.accent}04` }}>
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: theme.accent }} /> Dove Siamo
            </h3>
            <p className="text-sm text-white/60 mb-2">{demoData.address}</p>
            <p className="text-sm text-white/60 mb-4">{demoData.city}</p>
            <div className="space-y-2">
              <a href={`tel:${demoData.phone}`} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition">
                <Phone className="w-4 h-4" style={{ color: theme.accent }} /> {demoData.phone}
              </a>
              <a href={`mailto:${demoData.email}`} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition">
                <Mail className="w-4 h-4" style={{ color: theme.accent }} /> {demoData.email}
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="p-6 rounded-2xl border border-white/5" style={{ background: `${theme.accent}04` }}>
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: theme.accent }} /> Orari
            </h3>
            <div className="space-y-2">
              {demoData.hours.map((h, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-white/60">{h.day}</span>
                  <span className="font-medium text-white/80">{h.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center"
            style={{ background: `linear-gradient(135deg, ${theme.accent}08, ${theme.accent}04)` }}>
            <span className="text-4xl mb-3">{theme.heroEmoji}</span>
            <h3 className="font-bold text-sm mb-2">Vuoi un Sito Così?</h3>
            <p className="text-xs text-white/40 mb-4">Questo è solo un assaggio. La piattaforma completa include gestionale, automazioni e molto altro.</p>
            <Button onClick={() => navigate("/home")} className="rounded-xl font-semibold text-xs h-10 border-0 text-white"
              style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)` }}>
              Scopri Empire <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </AnimSection>

      {/* Phone showcase moved to after hero */}

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-white/5 py-8 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-white/20 mb-2">
            {theme.heroEmoji} {companyName} — {tagline}
          </p>
          <p className="text-[10px] text-white/10">
            Powered by <button onClick={() => navigate("/home")} className="text-white/20 hover:text-white/40 transition underline">Empire Platform</button> · Sito Demo
          </p>
        </div>
      </footer>

      {/* ═══════ FLOATING BACK BUTTON (mobile) ═══════ */}
      <div className="fixed bottom-6 left-4 z-50 sm:hidden">
        <button onClick={() => navigate("/home")}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border border-white/10 backdrop-blur-xl"
          style={{ background: `${theme.bgFrom}ee` }}>
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* ═══════ FLOATING CTA ═══════ */}
      <div className="fixed bottom-6 right-4 z-50">
        <motion.button
          onClick={() => scrollTo("booking")}
          className="h-12 px-5 rounded-full flex items-center gap-2 shadow-2xl font-bold text-sm text-white border-0"
          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)` }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{demoData.bookingLabel}</span>
        </motion.button>
      </div>

      <Suspense fallback={null}>
        <DemoSalesAgent industry={resolvedIndustry} companyName={companyName} accentColor={theme.accent} />
      </Suspense>
    </div>
  );
}
