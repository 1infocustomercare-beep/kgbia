import { useState, useMemo, useRef, useEffect, FormEvent, lazy, Suspense } from "react";
import BackButton from "@/components/BackButton";
const EmpireVoiceAgent = lazy(() => import("@/components/public/EmpireVoiceAgent"));
import DemoFeaturesSection from "@/components/demo/DemoFeaturesSection";
import DemoAgentsSection from "@/components/demo/DemoAgentsSection";
import DemoPricingSection from "@/components/demo/DemoPricingSection";
import DemoFooterSection from "@/components/demo/DemoFooterSection";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_INDUSTRY_DATA, DEMO_SLUGS } from "@/data/demo-industries";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import IndustryPhoneShowcase from "@/components/public/IndustryPhoneShowcase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, ArrowLeft, Shield, Zap,
  Heart, Award, Users, Sparkles, ChevronRight, Send, CheckCircle,
  Menu as MenuIcon, X, Calendar, Globe, Package,
  Settings, TrendingUp, CreditCard, Layers,
  ArrowRight, MessageCircle, BarChart3, QrCode, Bell, Bot,
  Smartphone, Lock, Eye, ChefHat,
  Scissors, Building, Car, Store, Monitor, Wrench, FileText,
  Palette, Image, Camera, Truck
} from "lucide-react";

/* ═══════════════════════════════════════════
   SECTOR HERO CONFIGS — Empire-centric messaging
   ═══════════════════════════════════════════ */

interface SectorTheme {
  gradient: string;
  accent: string;
  accentRgb: string;
  bgFrom: string;
  bgTo: string;
  heroEmoji: string;
  heroVideo: string;
  headline: string;
  subheadline: string;
  benefits: { emoji: string; title: string; desc: string }[];
  stats: { value: number; suffix: string; label: string }[];
  whyEmpire: { icon: React.ReactNode; title: string; desc: string }[];
  problemsWeSolve: string[];
}

const makeBenefits = (items: { emoji: string; title: string; desc: string }[]) => items;
const makeStats = (items: { value: number; suffix: string; label: string }[]) => items;

const SECTOR_THEMES: Record<string, SectorTheme> = {
  food: {
    gradient: "from-orange-500 via-red-500 to-rose-600",
    accent: "#e85d04",
    accentRgb: "232, 93, 4",
    bgFrom: "#1a0a00",
    bgTo: "#0d0d0d",
    heroEmoji: "🍽️",
    heroVideo: "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4",
    headline: "Rivoluziona il Tuo Ristorante con l'AI",
    subheadline: "Menu digitale QR, ordini automatizzati, CRM clienti, agenti AI che vendono per te — tutto in un'unica piattaforma. Aumenta i coperti del 40% e taglia i costi operativi.",
    benefits: makeBenefits([
      { emoji: "📲", title: "Menu QR Interattivo", desc: "I clienti scansionano, sfogliano e ordinano dal tavolo. Zero errori, +30% velocità servizio." },
      { emoji: "🤖", title: "AI Sommelier & Upselling", desc: "L'AI suggerisce abbinamenti e promozioni personalizzate. +22% scontrino medio." },
      { emoji: "📊", title: "Dashboard Vendite Live", desc: "Revenue, piatti top, food cost e trend — tutto in tempo reale sul tuo smartphone." },
      { emoji: "💬", title: "WhatsApp Marketing Auto", desc: "Recupera clienti persi, invia offerte e ricevi ordini via WhatsApp con chatbot AI." },
      { emoji: "👨‍🍳", title: "Display Cucina Smart", desc: "Ordini in cucina con priorità, tempi e note — elimina i comandi cartacei." },
      { emoji: "💳", title: "Pagamenti & Fatturazione", desc: "Incassi digitali, split bill, fattura elettronica automatica." },
    ]),
    stats: makeStats([{ value: 40, suffix: "%", label: "Più Coperti" }, { value: 22, suffix: "%", label: "Scontrino Medio" }, { value: 70, suffix: "%", label: "Meno No-Show" }]),
    problemsWeSolve: ["Ordini confusi su carta", "Clienti persi senza follow-up", "Zero dati sulle vendite", "Gestione prenotazioni manuale", "Food cost non tracciato", "Nessuna fidelizzazione"],
    whyEmpire: [
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
    heroVideo: "https://videos.pexels.com/video-files/5765383/5765383-uhd_2560_1440_25fps.mp4",
    headline: "Digitalizza il Tuo Servizio NCC",
    subheadline: "Prenotazioni online 24/7, gestione flotta completa, pricing per tratta e sito web premium che converte — tutto automatizzato con AI.",
    benefits: makeBenefits([
      { emoji: "📅", title: "Booking Automatico 24/7", desc: "Prenotazioni online con conferma istantanea e assegnazione autista intelligente." },
      { emoji: "🚗", title: "Gestione Flotta Completa", desc: "Veicoli, scadenze assicurative, manutenzione e documenti — tutto in un click." },
      { emoji: "💰", title: "Pricing Dinamico", desc: "Tariffe per tratta, veicolo, stagione — il cliente vede il prezzo e prenota subito." },
      { emoji: "👤", title: "Gestione Autisti", desc: "Assegnazione intelligente, licenze, rating e tracking in tempo reale." },
      { emoji: "🌐", title: "Sito Web Premium", desc: "Landing page professionale che converte visitatori in prenotazioni." },
      { emoji: "💬", title: "WhatsApp Integrato", desc: "Comunicazione diretta con i clienti e conferme automatiche." },
    ]),
    stats: makeStats([{ value: 60, suffix: "%", label: "Più Prenotazioni" }, { value: 35, suffix: "%", label: "Meno Chiamate" }, { value: 90, suffix: "%", label: "Clienti Soddisfatti" }]),
    problemsWeSolve: ["Prenotazioni solo telefoniche", "Nessun listino online", "Flotta non monitorata", "Zero visibilità web", "Gestione autisti caotica"],
    whyEmpire: [
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
    heroVideo: "https://videos.pexels.com/video-files/6724370/6724370-uhd_2560_1440_25fps.mp4",
    headline: "Il Tuo Salone, Potenziato dall'AI",
    subheadline: "Agenda smart, reminder automatici, fidelity digitale e app per i tuoi clienti — riduci i no-show del 70% e fai tornare ogni cliente.",
    benefits: makeBenefits([
      { emoji: "📅", title: "Agenda Intelligente", desc: "Prenotazioni online con slot automatici e conferma istantanea." },
      { emoji: "💆", title: "Schede Clienti Complete", desc: "Storico trattamenti, allergie, preferenze — ogni dettaglio ricordato." },
      { emoji: "📱", title: "Reminder Automatici", desc: "SMS/WhatsApp prima dell'appuntamento — no-show -70%." },
      { emoji: "⭐", title: "Fidelity Card Digitale", desc: "Tessera punti nel telefono del cliente — tornano più spesso." },
      { emoji: "📊", title: "Analytics Salone", desc: "Servizi top, orari di punta, revenue per operatore." },
      { emoji: "🎨", title: "App Personalizzata", desc: "I clienti prenotano, pagano e accumulano punti dal telefono." },
    ]),
    stats: makeStats([{ value: 70, suffix: "%", label: "Meno No-Show" }, { value: 45, suffix: "%", label: "Più Ritorni" }, { value: 30, suffix: "%", label: "Revenue +30%" }]),
    problemsWeSolve: ["Appuntamenti mancati", "Nessuno storico trattamenti", "Clienti che non tornano", "Agenda cartacea", "Zero marketing"],
    whyEmpire: [
      { icon: <Calendar className="w-5 h-5" />, title: "Agenda Intelligente", desc: "Prenotazioni online con slot automatici" },
      { icon: <Users className="w-5 h-5" />, title: "Schede Clienti", desc: "Storico trattamenti, allergie, preferenze" },
      { icon: <Bell className="w-5 h-5" />, title: "Reminder Automatici", desc: "SMS/WhatsApp prima dell'appuntamento" },
      { icon: <TrendingUp className="w-5 h-5" />, title: "Analytics Salone", desc: "Servizi top, orari di punta, revenue" },
      { icon: <CreditCard className="w-5 h-5" />, title: "Pagamenti & Fidelity", desc: "Tessera punti digitale integrata" },
      { icon: <Smartphone className="w-5 h-5" />, title: "App Clienti", desc: "Prenota, paga e accumula punti dal telefono" },
    ],
  },
};

const getTheme = (industry: string): SectorTheme => {
  if (SECTOR_THEMES[industry]) return SECTOR_THEMES[industry];
  // Generate generic theme for any sector
  return {
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
    accent: "#6366f1",
    accentRgb: "99, 102, 241",
    bgFrom: "#0a0a1a",
    bgTo: "#0d0d0d",
    heroEmoji: "⚡",
    heroVideo: "https://videos.pexels.com/video-files/3255275/3255275-uhd_2560_1440_25fps.mp4",
    headline: "Rivoluziona il Tuo Business con Empire AI",
    subheadline: "Piattaforma completa con sito web, gestionale, CRM, automazioni AI e app personalizzata — tutto su misura per la tua attività.",
    benefits: [
      { emoji: "🎯", title: "Sito Web & App Premium", desc: "Design professionale su misura che converte visitatori in clienti." },
      { emoji: "🤖", title: "Agenti AI 24/7", desc: "Assistenti virtuali che rispondono, vendono e gestiscono per te." },
      { emoji: "📊", title: "Dashboard Analytics", desc: "KPI, revenue e insight predittivi in tempo reale." },
      { emoji: "📅", title: "CRM & Prenotazioni", desc: "Gestione clienti e agenda smart con reminder automatici." },
      { emoji: "💳", title: "Pagamenti & Fatturazione", desc: "Incassi digitali e fatturazione elettronica automatica." },
      { emoji: "📣", title: "Marketing Automatizzato", desc: "Campagne, notifiche push e recupero clienti persi." },
    ],
    stats: [{ value: 40, suffix: "%", label: "Più Clienti" }, { value: 60, suffix: "%", label: "Meno Lavoro Manuale" }, { value: 95, suffix: "%", label: "Soddisfazione" }],
    problemsWeSolve: ["Gestione manuale inefficiente", "Zero presenza digitale", "Clienti persi senza follow-up", "Nessun dato sul business", "Marketing inesistente"],
    whyEmpire: [
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
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function IndustryDemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const brandOverride = searchParams.get("brand");
  const colorOverride = searchParams.get("color");
  const taglineOverride = searchParams.get("tagline");
  const logoOverride = searchParams.get("logo");
  const isPartnerBranded = !!brandOverride;

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

  const resolvedIndustry: IndustryId | null = useMemo(() => {
    if (company?.industry) return company.industry as IndustryId;
    for (const [ind, s] of Object.entries(DEMO_SLUGS)) {
      if (s === slug) return ind as IndustryId;
    }
    if (slug && slug in INDUSTRY_CONFIGS) return slug as IndustryId;
    return null;
  }, [company, slug]);

  const safeIndustry: IndustryId = resolvedIndustry || "custom";
  const industryConfig = INDUSTRY_CONFIGS[safeIndustry];
  const demoData = DEMO_INDUSTRY_DATA[safeIndustry];
  const theme = getTheme(safeIndustry);
  const companyName = brandOverride || company?.name || demoData?.companyName || "Empire AI";
  const tagline = taglineOverride || company?.tagline || demoData?.tagline || "";
  const accentColor = colorOverride || industryConfig?.defaultPrimaryColor || theme.accent;

  // Parallax hero
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  if (!resolvedIndustry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <span className="text-4xl">🔍</span>
        <p className="text-xl font-bold text-foreground">Demo non trovata</p>
        <p className="text-sm text-muted-foreground max-w-md text-center">
          Lo slug <strong>"{slug}"</strong> non corrisponde a nessuna demo disponibile.
        </p>
        <Link to="/demo" className="text-sm font-medium text-primary underline hover:no-underline">
          ← Sfoglia tutte le 25 demo
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) { toast.error("Inserisci nome e telefono"); return; }
    setBookingSubmitted(true);
    toast.success("Richiesta inviata! Ti contatteremo a breve.");
    setFormData({});
    setTimeout(() => setBookingSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: `linear-gradient(180deg, ${theme.bgFrom} 0%, ${theme.bgTo} 100%)` }}>
      <BackButton to="/demo" label="Tutte le Demo" variant="floating" theme="glass" />

      {/* Partner branding banner */}
      {isPartnerBranded && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {logoOverride && <img src={logoOverride} alt="" className="w-7 h-7 rounded-lg object-cover border border-white/10" />}
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{brandOverride}</p>
              <p className="text-[9px] text-white/80">Bozza demo — Empire Platform</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
        </div>
      )}

      {/* ═══════════════════════════════════════
         HERO — Empire capabilities for this sector
         ═══════════════════════════════════════ */}
      <section ref={heroRef} className="relative pt-0">
        <div className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
          {/* Video Background with parallax */}
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover scale-110"
              src={theme.heroVideo} />
            <div className="absolute inset-0 bg-black/70" />
            <div className="absolute inset-0 opacity-40"
              style={{ background: `linear-gradient(135deg, ${theme.accent}50 0%, transparent 50%, ${theme.accent}30 100%)` }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${theme.bgFrom} 0%, transparent 50%)` }} />
          </motion.div>

          <motion.div className="relative text-center px-6 py-24 max-w-4xl mx-auto" style={{ opacity: heroOpacity }}>
            {/* Empire Badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-sm mb-6">
                <span className="text-lg">{theme.heroEmoji}</span>
                <span className="text-xs font-bold tracking-wider uppercase text-white/60">Empire AI × {industryConfig?.label}</span>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }} />
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-[1.05] tracking-tight"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            >
              {theme.headline.split(" ").map((word, i, arr) => (
                <span key={i}>
                  {i >= arr.length - 2 ? (
                    <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>{word} </span>
                  ) : (
                    <>{word} </>
                  )}
                </span>
              ))}
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            >
              {theme.subheadline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Button onClick={() => document.getElementById("consulenza")?.scrollIntoView({ behavior: "smooth" })}
                size="lg" className="h-14 px-10 font-bold rounded-2xl text-white border-0 text-base shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)`, boxShadow: `0 12px 40px ${theme.accent}40` }}>
                Richiedi Consulenza Gratuita <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button onClick={() => document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" })}
                size="lg" variant="outline"
                className="h-14 px-10 font-bold rounded-2xl border-white/20 text-white/80 hover:bg-white/10 text-base backdrop-blur-sm">
                <Eye className="w-5 h-5 mr-2" /> Vedi le Preview
              </Button>
            </motion.div>

            {/* Animated Stats */}
            <motion.div className="grid grid-cols-3 gap-6 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              {theme.stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl sm:text-4xl font-black" style={{ color: theme.accent }}>
                    <AnimatedNumber value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-[10px] text-white/70 uppercase tracking-[2px] mt-1 font-semibold">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-white/50"
                animate={{ y: [0, 16, 0] }} transition={{ duration: 2, repeat: Infinity }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TRUST BAR ═══════ */}
      <div className="border-y border-white/5 py-4" style={{ background: `linear-gradient(90deg, ${theme.accent}08, transparent, ${theme.accent}08)` }}>
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-8 flex-wrap px-4">
          {[
            { icon: <Shield className="w-4 h-4" />, label: "GDPR Compliant" },
            { icon: <Zap className="w-4 h-4" />, label: "Setup in 48h" },
            { icon: <Bot className="w-4 h-4" />, label: "AI Integrata" },
            { icon: <Lock className="w-4 h-4" />, label: "100% Sicuro" },
            { icon: <Smartphone className="w-4 h-4" />, label: "Mobile First" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-white/70 text-xs font-semibold">
              <span style={{ color: theme.accent }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ PROBLEMS WE SOLVE ═══════ */}
      <AnimSection className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 text-xs border-0" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
              ⚠️ Ti Riconosci?
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              I Problemi che <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Eliminiamo</span>
            </h2>
            <p className="text-sm text-white/80 max-w-lg mx-auto">
              Ogni giorno migliaia di attività nel settore {industryConfig?.label} perdono clienti e fatturato per questi motivi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {theme.problemsWeSolve.map((problem, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
                <div className="p-5 rounded-2xl border border-red-500/10 bg-red-500/[0.03] group hover:border-red-500/20 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 text-red-400 text-sm font-bold">✗</div>
                    <div>
                      <p className="text-sm font-semibold text-white/80">{problem}</p>
                      <p className="text-xs text-white/70 mt-1">Empire lo risolve automaticamente</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimSection>

      {/* ═══════ WHAT WE BUILD FOR YOU ═══════ */}
      <AnimSection className="py-20 px-4" style={{ background: `linear-gradient(180deg, transparent, ${theme.accent}06, transparent)` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 text-xs border-0" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
              🚀 La Soluzione Completa
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Cosa Creiamo per il Tuo{" "}
              <span style={{ color: theme.accent }}>{industryConfig?.label}</span>
            </h2>
            <p className="text-sm text-white/80 max-w-xl mx-auto">
              Non un semplice sito web — un ecosistema digitale completo che lavora per te 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {theme.benefits.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
                <div className="group relative p-6 rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-500 h-full overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${theme.accent}08, transparent)` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at center, ${theme.accent}12, transparent 70%)` }} />
                  <div className="relative">
                    <span className="text-3xl block mb-3">{item.emoji}</span>
                    <h3 className="font-bold text-base text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Extra: "Tutto personalizzabile" */}
          <motion.div className="mt-10 p-6 rounded-2xl border border-white/5 text-center"
            style={{ background: `linear-gradient(135deg, ${theme.accent}05, transparent)` }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Sparkles className="w-6 h-6 mx-auto mb-3" style={{ color: theme.accent }} />
            <h3 className="font-bold text-lg text-white mb-2">Tutto Personalizzabile al 100%</h3>
            <p className="text-sm text-white/80 max-w-lg mx-auto">
              Design, funzionalità, workflow — ogni aspetto è costruito su misura per le tue esigenze specifiche.
              <br />Non trovi una funzione? <strong style={{ color: theme.accent }}>Chiedi ad Arianna</strong> — la nostra AI trova soluzioni a qualsiasi problema.
            </p>
          </motion.div>
        </div>
      </AnimSection>

      {/* ═══════ PHONE SHOWCASE PREVIEW ═══════ */}
      <AnimSection id="preview" className="py-16 px-3 sm:px-4" style={{ background: `linear-gradient(180deg, ${theme.bgFrom}, ${theme.accent}06, ${theme.bgTo})` }}>
        <div className="max-w-4xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-3">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.accent }} />
            <span className="text-[9px] font-bold tracking-[3px] uppercase text-white/50">PREVIEW REALI · DESIGN SU MISURA</span>
          </div>
          <motion.h3 className="text-xl sm:text-3xl font-bold text-white/90"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Ecco Come Potrebbe Essere la Tua{" "}
            <span style={{ color: theme.accent }}>App</span>
          </motion.h3>
          <motion.p className="text-xs sm:text-sm text-white/35 mt-2 max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Dalla vetrina al gestionale, ogni schermata progettata per{" "}
            <span className="font-semibold" style={{ color: theme.accent }}>{industryConfig?.label}</span>
            — dashboard, prenotazioni, analytics e agenti AI
          </motion.p>
        </div>
        <IndustryPhoneShowcase industryId={resolvedIndustry!} />
      </AnimSection>

      {/* ═══════ PLATFORM CAPABILITIES GRID ═══════ */}
      <AnimSection id="platform" className="py-20 px-4"
        style={{ background: `linear-gradient(180deg, transparent, ${theme.accent}06, transparent)` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 text-xs border-0" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
              ⚡ La Piattaforma
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">
              Un Ecosistema che <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Lavora per Te</span>
            </h2>
            <p className="text-white/80 max-w-lg mx-auto text-sm">
              Non servono 10 strumenti diversi. Tutto è integrato, automatizzato e sempre attivo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {theme.whyEmpire.map((feat, i) => (
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
                    <p className="text-xs text-white/80 leading-relaxed">{feat.desc}</p>
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
              { emoji: "⚡", label: "Setup Veloce" },
            ].map((b, i) => (
              <div key={i} className="text-center p-4 rounded-xl border border-white/5" style={{ background: `${theme.accent}04` }}>
                <span className="text-xl block mb-1">{b.emoji}</span>
                <span className="text-[10px] text-white/80 font-semibold uppercase tracking-wider">{b.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </AnimSection>

      {/* ═══════ FULL FEATURES & AGENTS ═══════ */}
      <DemoFeaturesSection sector={resolvedIndustry!} accentColor={accentColor} sectorName={industryConfig?.label || ""} />
      <DemoAgentsSection sector={resolvedIndustry!} accentColor={accentColor} sectorName={industryConfig?.label || ""} />
      <DemoPricingSection sector={resolvedIndustry!} accentColor={accentColor} sectorName={industryConfig?.label || ""} />

      {/* ═══════ CONSULENZA GRATUITA FORM ═══════ */}
      <AnimSection id="consulenza" className="py-20 px-4"
        style={{ background: `linear-gradient(180deg, transparent, ${theme.accent}08, transparent)` }}>
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-3 text-xs border-0" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
              🎯 Consulenza Gratuita
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Scopri Come Possiamo Trasformare il Tuo Business
            </h2>
            <p className="text-sm text-white/80">
              Compila il form — ti chiamiamo noi per una consulenza personalizzata gratuita
            </p>
          </div>

          {bookingSubmitted ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${theme.accent}20` }}>
                <CheckCircle className="w-10 h-10" style={{ color: theme.accent }} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Richiesta Inviata!</h3>
              <p className="text-sm text-white/80">Ti contatteremo entro 24 ore per la tua consulenza gratuita.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 p-8 rounded-2xl border border-white/10 backdrop-blur-sm"
              style={{ background: `linear-gradient(135deg, ${theme.accent}08, ${theme.accent}03)` }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "name", label: "Nome e Cognome *", type: "text" },
                  { key: "phone", label: "Telefono *", type: "tel" },
                  { key: "email", label: "Email", type: "email" },
                  { key: "business", label: "Nome Attività", type: "text" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-white/80 mb-1.5 block font-medium">{f.label}</label>
                    <Input
                      type={f.type}
                      value={formData[f.key] || ""}
                      onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/65 h-11 focus:border-white/20"
                      placeholder={f.label.replace(" *", "")}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs text-white/80 mb-1.5 block font-medium">Raccontaci le tue esigenze</label>
                <Textarea
                  value={formData.notes || ""}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/65 min-h-[80px] focus:border-white/20"
                  placeholder="Cosa vorresti migliorare nel tuo business? Quali funzionalità ti servono?"
                />
              </div>
              <Button type="submit" className="w-full h-13 font-bold rounded-xl text-white border-0 text-base shadow-xl"
                style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)`, boxShadow: `0 8px 30px ${theme.accent}30` }}>
                <Send className="w-5 h-5 mr-2" /> Richiedi Consulenza Gratuita
              </Button>
              <p className="text-[10px] text-white/65 text-center flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> I tuoi dati sono al sicuro — niente spam, lo promettiamo.
              </p>
            </form>
          )}
        </div>
      </AnimSection>

      {/* ═══════ FOOTER ═══════ */}
      <DemoFooterSection sector={resolvedIndustry!} accentColor={accentColor} sectorName={industryConfig?.label || ""} companyName={companyName} tagline={tagline} />

      {/* ═══════ FLOATING CTA ═══════ */}
      <div className="fixed bottom-6 right-4 z-50">
        <motion.button
          onClick={() => document.getElementById("consulenza")?.scrollIntoView({ behavior: "smooth" })}
          className="h-12 px-5 rounded-full flex items-center gap-2 shadow-2xl font-bold text-sm text-white border-0"
          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)`, boxShadow: `0 8px 25px ${theme.accent}40` }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Consulenza Gratuita</span>
        </motion.button>
      </div>

      {/* ═══════ FLOATING BACK BUTTON (mobile) ═══════ */}
      <div className="fixed bottom-6 left-4 z-50 sm:hidden">
        <button onClick={() => navigate("/home")}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border border-white/10 backdrop-blur-xl"
          style={{ background: `${theme.bgFrom}ee` }}>
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>
      </div>

      <Suspense fallback={null}>
        <EmpireVoiceAgent />
      </Suspense>
    </div>
  );
}
