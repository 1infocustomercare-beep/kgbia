import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import {
  Bot, Brain, Zap, TrendingUp, Shield, Sparkles,
  ChefHat, Car, Scissors, Heart, Store, Dumbbell, Building,
  Clock, Target, Wallet, Users, BarChart3, Bell, Cpu,
  Workflow, ArrowRight, Crown, Rocket, Eye, Radio,
  MessageSquare, Layers, Fingerprint, Globe, Timer,
  Calendar, FileText, Star, Umbrella, QrCode, MonitorSmartphone,
  CreditCard, Package, MapPin, ClipboardCheck, Headphones,
  Lock, Wifi, Database, Network, CircuitBoard, Activity,
  Settings, Receipt, ScanLine, Camera
} from "lucide-react";
import { getAgentImage } from "@/lib/agent-images";

/* ── Animated counter ── */
const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  const started = useRef(false);
  if (isInView && !started.current) {
    started.current = true;
    let s = 0;
    const step = (ts: number) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 2000, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  return <span ref={ref}>{n}{suffix}</span>;
};

/* ═══════════════════════════════════════════
   AGENT DATA — All agents with photos
   ═══════════════════════════════════════════ */
interface AgentNode {
  id: string; name: string; role: string; desc: string; whyNeed: string;
  icon: React.ReactNode; gradient: string; glow: string;
  stat: { value: number; suffix: string; label: string };
  capabilities: string[]; category: string; sectors: string[];
}

const ALL_AGENTS: AgentNode[] = [
  { id: "ghost-manager", name: "GhostManager™", role: "Direttore Operativo IA", desc: "Manager virtuale che monitora ordini, ottimizza turni, rileva anomalie e prende decisioni operative in tempo reale — 24/7.", whyNeed: "Senza un manager IA, perdi ore in micro-decisioni. Con GhostManager™ tutto funziona da solo.", icon: <Bot className="w-4 h-4" />, gradient: "from-violet-500 to-purple-600", glow: "hsl(265,80%,60%)", stat: { value: 24, suffix: "/7", label: "Operativo" }, capabilities: ["Gestione ordini autonoma", "Ottimizzazione turni", "Alert anomalie", "Decisioni predittive"], category: "operations", sectors: ["all"] },
  { id: "concierge-ai", name: "Concierge AI", role: "Assistente Clienti 24/7", desc: "Risponde ai clienti via chat in 12+ lingue, gestisce prenotazioni, suggerisce prodotti e risolve problemi istantaneamente.", whyNeed: "Ogni cliente senza risposta è un cliente perso. Concierge AI risponde in 3 secondi, 24/7.", icon: <MessageSquare className="w-4 h-4" />, gradient: "from-sky-500 to-blue-600", glow: "hsl(210,80%,55%)", stat: { value: 12, suffix: "+", label: "Lingue" }, capabilities: ["Chat multilingue", "Prenotazioni auto", "Upselling IA", "Risoluzione problemi"], category: "concierge", sectors: ["all"] },
  { id: "predictive-engine", name: "Predictive Engine", role: "Analista Predittivo", desc: "Analizza pattern di vendita, previsione domanda, trend stagionali e comportamento clienti. Ti dice PRIMA cosa succederà.", whyNeed: "Senza dati predittivi navighi alla cieca. Predictive Engine ti dice cosa succederà PRIMA.", icon: <BarChart3 className="w-4 h-4" />, gradient: "from-emerald-500 to-teal-600", glow: "hsl(160,70%,45%)", stat: { value: 45, suffix: "%", label: "↑ Revenue" }, capabilities: ["Previsione domanda", "Analisi trend", "Segmentazione clienti", "Report IA"], category: "analytics", sectors: ["all"] },
  { id: "autopilot-marketing", name: "AutoPilot Marketing", role: "Growth Hacker Autonomo", desc: "Campagne email, WhatsApp e push basate su comportamenti reali. Recupera clienti persi, premia i fedeli — tutto in automatico.", whyNeed: "Il 68% dei clienti non torna senza follow-up. AutoPilot li riattiva a costo zero.", icon: <Rocket className="w-4 h-4" />, gradient: "from-amber-400 to-orange-500", glow: "hsl(35,90%,55%)", stat: { value: 3, suffix: "×", label: "ROI Marketing" }, capabilities: ["Campagne comportamentali", "Recupero clienti", "Push & WhatsApp auto", "A/B testing"], category: "content", sectors: ["all"] },
  { id: "chef-intelligence", name: "Chef Intelligence", role: "Assistente Culinario IA", desc: "Menu completi con foto, allergeni, traduzioni e prezzi ottimizzati. Food cost automatico per ogni piatto.", whyNeed: "Ogni errore nel menu costa clienti. Chef Intelligence crea menu perfetti in 60 secondi.", icon: <ChefHat className="w-4 h-4" />, gradient: "from-orange-500 to-amber-500", glow: "hsl(30,90%,55%)", stat: { value: 60, suffix: "s", label: "Menu pronto" }, capabilities: ["Menu IA in 60s", "Food cost auto", "Allergeni & traduzioni", "Foto piatti pro"], category: "operations", sectors: ["food", "bakery"] },
  { id: "kitchen-commander", name: "Kitchen Commander", role: "Gestione Cucina Live", desc: "Dashboard cucina in tempo reale con priorità ordini, timer intelligenti e coordinamento automatico delle comande.", whyNeed: "Una cucina caotica brucia margini. Kitchen Commander elimina errori e coordina tutto.", icon: <Clock className="w-4 h-4" />, gradient: "from-red-500 to-rose-600", glow: "hsl(0,80%,55%)", stat: { value: 40, suffix: "%", label: "↓ Tempi attesa" }, capabilities: ["Ordini prioritizzati", "Timer intelligenti", "Comande coordinate", "Alert ritardi"], category: "operations", sectors: ["food"] },
  { id: "sommelier-ia", name: "Sommelier IA", role: "Esperto Abbinamenti", desc: "Suggerisce abbinamenti vino-piatto perfetti, aumentando lo scontrino medio con upselling naturale.", whyNeed: "Il 70% dei clienti non ordina vino perché non sa scegliere. Sommelier IA aumenta lo scontrino del 35%.", icon: <Target className="w-4 h-4" />, gradient: "from-purple-500 to-violet-600", glow: "hsl(270,70%,55%)", stat: { value: 35, suffix: "%", label: "↑ Scontrino" }, capabilities: ["Abbinamenti vino-piatto", "Upselling naturale", "Carta vini dinamica", "Suggerimenti AI"], category: "sales", sectors: ["food"] },
  { id: "review-shield", name: "Review Shield™", role: "Protezione Reputazione", desc: "Intercetta le recensioni negative PRIMA che arrivino su Google. Solo i feedback positivi vengono pubblicati online.", whyNeed: "Una sola recensione negativa costa 30 clienti. Review Shield™ le intercetta prima.", icon: <Shield className="w-4 h-4" />, gradient: "from-emerald-500 to-green-600", glow: "hsl(150,70%,45%)", stat: { value: 95, suffix: "%", label: "★ Positive" }, capabilities: ["Intercettazione feedback", "Filtro recensioni", "Alert negativi", "Boost positivi"], category: "compliance", sectors: ["all"] },
  { id: "smart-dispatcher", name: "Smart Dispatcher", role: "Assegnazione Intelligente", desc: "Assegna corse all'autista perfetto per posizione, lingua, veicolo e disponibilità — in 3 secondi.", whyNeed: "Assegnare corse manualmente crea ritardi. Smart Dispatcher trova l'autista perfetto in 3 secondi.", icon: <Car className="w-4 h-4" />, gradient: "from-amber-400 to-yellow-500", glow: "hsl(40,90%,55%)", stat: { value: 30, suffix: "%", label: "↑ Efficienza" }, capabilities: ["Assegnazione automatica", "Matching veicolo-cliente", "Percorsi ottimali", "Disponibilità real-time"], category: "operations", sectors: ["ncc"] },
  { id: "dynamic-pricing", name: "Dynamic Pricing", role: "Tariffe Intelligenti", desc: "Tariffe dinamiche basate su distanza, traffico, domanda, stagione ed eventi — massimizzando i ricavi per corsa.", whyNeed: "Tariffe fisse = soldi persi. Dynamic Pricing adatta i prezzi alla domanda reale.", icon: <Wallet className="w-4 h-4" />, gradient: "from-emerald-500 to-teal-500", glow: "hsl(160,70%,50%)", stat: { value: 25, suffix: "%", label: "↑ Revenue" }, capabilities: ["Prezzi dinamici", "Surge pricing eventi", "Analisi concorrenza", "Margine ottimizzato"], category: "analytics", sectors: ["ncc", "beach", "hotel"] },
  { id: "smart-agenda", name: "Smart Agenda", role: "Ottimizzatore Appuntamenti", desc: "Riempie i buchi in agenda, previene no-show con reminder intelligenti e accetta prenotazioni 24/7 online.", whyNeed: "Ogni buco in agenda è fatturato perso. Smart Agenda riduce i no-show dell'85%.", icon: <Calendar className="w-4 h-4" />, gradient: "from-pink-500 to-rose-500", glow: "hsl(340,80%,55%)", stat: { value: 85, suffix: "%", label: "↓ No-show" }, capabilities: ["Anti no-show 85%", "Buchi riempiti", "Reminder multicanale", "Booking 24/7"], category: "operations", sectors: ["beauty", "healthcare"] },
  { id: "loyalty-angel", name: "Loyalty Angel", role: "Fidelizzazione Clienti", desc: "Identifica clienti a rischio abbandono e attiva campagne automatiche di riattivazione con offerte personalizzate.", whyNeed: "Acquisire un nuovo cliente costa 7× di più che mantenerne uno. Loyalty Angel li riattiva prima che vadano via.", icon: <Heart className="w-4 h-4" />, gradient: "from-rose-400 to-pink-500", glow: "hsl(350,75%,60%)", stat: { value: 3, suffix: "×", label: "Tasso ritorno" }, capabilities: ["Alert clienti inattivi", "Offerte personalizzate", "Compleanno auto", "WhatsApp marketing"], category: "sales", sectors: ["beauty", "retail", "fitness"] },
  { id: "social-creator", name: "Social Creator", role: "Generatore Contenuti", desc: "Crea post Instagram, stories e newsletter automaticamente con descrizioni accattivanti e hashtag ottimizzati.", whyNeed: "Senza social costanti diventi invisibile. Social Creator pubblica per te ogni giorno — 5× engagement.", icon: <Globe className="w-4 h-4" />, gradient: "from-violet-500 to-indigo-500", glow: "hsl(260,70%,55%)", stat: { value: 5, suffix: "×", label: "Engagement" }, capabilities: ["Post Instagram auto", "Stories template", "Newsletter", "Hashtag ottimizzati"], category: "content", sectors: ["all"] },
  { id: "triage-ia", name: "Triage IA", role: "Pre-valutazione Intelligente", desc: "Pre-valuta le richieste dei pazienti, assegna priorità e indirizza allo specialista corretto.", whyNeed: "Pazienti indirizzati male = tempo sprecato. Triage IA assegna lo specialista giusto al primo contatto.", icon: <Heart className="w-4 h-4" />, gradient: "from-teal-500 to-cyan-500", glow: "hsl(180,70%,50%)", stat: { value: 70, suffix: "%", label: "↓ Attese" }, capabilities: ["Pre-screening", "Priorità auto", "Routing specialista", "Riduzione attese"], category: "operations", sectors: ["healthcare"] },
  { id: "revenue-manager", name: "Revenue Manager IA", role: "Tariffe Dinamiche Hotel", desc: "Tariffe ottimali basate su domanda, eventi, meteo, competitor — massimizzando il RevPAR automaticamente.", whyNeed: "Tariffe fisse = soldi persi ogni notte. Revenue Manager ottimizza i prezzi in tempo reale.", icon: <TrendingUp className="w-4 h-4" />, gradient: "from-amber-400 to-yellow-500", glow: "hsl(45,90%,55%)", stat: { value: 35, suffix: "%", label: "↑ RevPAR" }, capabilities: ["Yield management", "Competitor analysis", "Evento detection", "RevPAR ottimizzato"], category: "analytics", sectors: ["hotel"] },
  { id: "retention-ai", name: "Retention AI", role: "Anti-Abbandono Soci", desc: "Identifica soci a rischio cancellazione e attiva campagne di retention automatiche — prima che se ne vadano.", whyNeed: "Il 40% dei soci abbandona nei primi 3 mesi. Retention AI li identifica PRIMA.", icon: <Users className="w-4 h-4" />, gradient: "from-lime-500 to-green-500", glow: "hsl(100,70%,50%)", stat: { value: 60, suffix: "%", label: "↓ Churn" }, capabilities: ["Previsione churn", "Alert soci inattivi", "Campagne automatiche", "Win-back personalizzato"], category: "sales", sectors: ["fitness"] },
  { id: "field-dispatcher", name: "Field Dispatcher", role: "Coordinamento Interventi", desc: "Assegna interventi al tecnico più vicino, ottimizza percorsi e invia conferme automatiche ai clienti.", whyNeed: "Senza routing ottimizzato i tecnici perdono ore nel traffico. Field Dispatcher fa 40% interventi in più.", icon: <Workflow className="w-4 h-4" />, gradient: "from-blue-500 to-indigo-500", glow: "hsl(230,70%,55%)", stat: { value: 40, suffix: "%", label: "↑ Interventi/giorno" }, capabilities: ["Assegnazione smart", "Ottimizzazione percorsi", "GPS tracking", "Conferme auto"], category: "operations", sectors: ["trades"] },
  { id: "beach-booker", name: "Beach Booker IA", role: "Prenotazioni Spiaggia", desc: "Mappa interattiva con disponibilità real-time. Prenotazione ombrellone, lettino e servizi 24/7 — zero telefonate.", whyNeed: "Ogni telefonata = 3 minuti persi × 50/giorno = 2.5 ore sprecate. Beach Booker elimina l'80%.", icon: <Umbrella className="w-4 h-4" />, gradient: "from-cyan-500 to-blue-500", glow: "hsl(190,80%,55%)", stat: { value: 80, suffix: "%", label: "↓ Telefonate" }, capabilities: ["Mappa interattiva", "Booking 24/7", "Pagamento anticipato", "Conferme auto"], category: "operations", sectors: ["beach"] },
  { id: "stock-intelligence", name: "Stock Intelligence", role: "Inventario Predittivo", desc: "Monitora scorte in tempo reale, prevede la domanda e genera ordini di riassortimento automatici.", whyNeed: "Ogni prodotto esaurito = vendita persa. Stock Intelligence prevede e riordina PRIMA.", icon: <Package className="w-4 h-4" />, gradient: "from-cyan-500 to-blue-500", glow: "hsl(200,75%,55%)", stat: { value: 0, suffix: "", label: "Rotture stock" }, capabilities: ["Alert scorte minime", "Riordino auto", "Previsione domanda", "Analytics prodotto"], category: "operations", sectors: ["retail"] },
];

/* ═══════════════════════════════════════════
   PLATFORM FEATURES — All 14+ core modules
   ═══════════════════════════════════════════ */
interface FeatureNode {
  id: string; name: string; desc: string; icon: React.ReactNode;
  gradient: string; connectedAgents: string[];
}

const PLATFORM_FEATURES: FeatureNode[] = [
  { id: "menu-qr", name: "Menu QR & Ordini", desc: "Ordinazioni digitali con catalogo, foto e pagamento integrato", icon: <QrCode className="w-3.5 h-3.5" />, gradient: "from-orange-500 to-amber-400", connectedAgents: ["chef-intelligence", "sommelier-ia", "ghost-manager"] },
  { id: "kitchen-display", name: "Kitchen Display", desc: "Comande in tempo reale per la cucina con priorità e timer", icon: <MonitorSmartphone className="w-3.5 h-3.5" />, gradient: "from-red-500 to-rose-500", connectedAgents: ["kitchen-commander", "ghost-manager"] },
  { id: "crm", name: "CRM & Clienti 360°", desc: "Storico completo, segmentazione e comunicazione omnicanale", icon: <Users className="w-3.5 h-3.5" />, gradient: "from-blue-500 to-indigo-500", connectedAgents: ["concierge-ai", "loyalty-angel", "autopilot-marketing"] },
  { id: "booking", name: "Prenotazioni Smart", desc: "Booking online 24/7 con conferme, reminder e anti no-show", icon: <Calendar className="w-3.5 h-3.5" />, gradient: "from-pink-500 to-rose-400", connectedAgents: ["smart-agenda", "concierge-ai", "beach-booker"] },
  { id: "analytics", name: "Analytics Predittivi", desc: "Dashboard AI con previsioni, trend e KPI in tempo reale", icon: <BarChart3 className="w-3.5 h-3.5" />, gradient: "from-emerald-500 to-teal-500", connectedAgents: ["predictive-engine", "revenue-manager", "dynamic-pricing"] },
  { id: "loyalty", name: "Loyalty & Fidelity", desc: "Punti, cashback, livelli e premi personalizzati automatici", icon: <Wallet className="w-3.5 h-3.5" />, gradient: "from-amber-400 to-yellow-500", connectedAgents: ["loyalty-angel", "autopilot-marketing"] },
  { id: "reviews", name: "Review Shield™", desc: "Intercetta negativi, amplifica positivi — reputazione protetta", icon: <Shield className="w-3.5 h-3.5" />, gradient: "from-green-500 to-emerald-500", connectedAgents: ["review-shield"] },
  { id: "whatsapp", name: "WhatsApp Business", desc: "Chat automatiche, notifiche, promozioni e supporto via WhatsApp", icon: <MessageSquare className="w-3.5 h-3.5" />, gradient: "from-green-400 to-emerald-500", connectedAgents: ["concierge-ai", "autopilot-marketing", "loyalty-angel"] },
  { id: "inventory", name: "Inventario Smart", desc: "Stock sincronizzato con alert scorte e riordino predittivo", icon: <Package className="w-3.5 h-3.5" />, gradient: "from-cyan-500 to-blue-400", connectedAgents: ["stock-intelligence", "ghost-manager"] },
  { id: "fleet", name: "Gestione Flotta", desc: "Veicoli, scadenze, GPS live e assegnazione autisti automatica", icon: <Car className="w-3.5 h-3.5" />, gradient: "from-amber-500 to-yellow-500", connectedAgents: ["smart-dispatcher", "dynamic-pricing"] },
  { id: "payments", name: "Pagamenti & Fatturazione", desc: "POS cloud, pagamenti digitali, fatture automatiche e fiscalità", icon: <CreditCard className="w-3.5 h-3.5" />, gradient: "from-violet-500 to-purple-500", connectedAgents: ["ghost-manager", "predictive-engine"] },
  { id: "social", name: "Social Media IA", desc: "Post, stories e contenuti generati dall'IA per ogni piattaforma", icon: <Globe className="w-3.5 h-3.5" />, gradient: "from-fuchsia-500 to-pink-500", connectedAgents: ["social-creator", "autopilot-marketing"] },
  { id: "staff", name: "Staff & Turni", desc: "Gestione personale, timbrature, turni e payroll integrato", icon: <ClipboardCheck className="w-3.5 h-3.5" />, gradient: "from-slate-500 to-gray-600", connectedAgents: ["ghost-manager", "field-dispatcher"] },
  { id: "voice", name: "Voice Agent IA", desc: "Assistente vocale che risponde al telefono e gestisce richieste", icon: <Headphones className="w-3.5 h-3.5" />, gradient: "from-sky-400 to-blue-500", connectedAgents: ["concierge-ai"] },
];

/* ═══════════════════════════════════════════
   SECTOR TABS for filtering
   ═══════════════════════════════════════════ */
const SECTOR_TABS = [
  { id: "all", label: "Tutti", icon: <Layers className="w-3 h-3" /> },
  { id: "food", label: "Food", icon: <ChefHat className="w-3 h-3" /> },
  { id: "ncc", label: "NCC", icon: <Car className="w-3 h-3" /> },
  { id: "beauty", label: "Beauty", icon: <Scissors className="w-3 h-3" /> },
  { id: "healthcare", label: "Salute", icon: <Heart className="w-3 h-3" /> },
  { id: "hotel", label: "Hotel", icon: <Building className="w-3 h-3" /> },
  { id: "fitness", label: "Fitness", icon: <Dumbbell className="w-3 h-3" /> },
  { id: "retail", label: "Retail", icon: <Store className="w-3 h-3" /> },
  { id: "beach", label: "Beach", icon: <Umbrella className="w-3 h-3" /> },
  { id: "trades", label: "Artigiani", icon: <Workflow className="w-3 h-3" /> },
];

const impactStats = [
  { icon: <Timer className="w-5 h-5" />, value: 80, suffix: "%", label: "Tempo Risparmiato", desc: "sulle operazioni manuali" },
  { icon: <TrendingUp className="w-5 h-5" />, value: 45, suffix: "%", label: "Aumento Revenue", desc: "nei primi 90 giorni" },
  { icon: <Users className="w-5 h-5" />, value: 3, suffix: "×", label: "Clienti Fidelizzati", desc: "tasso di ritorno" },
  { icon: <Shield className="w-5 h-5" />, value: 99, suffix: ".9%", label: "Uptime Garantito", desc: "disponibilità continua" },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export function AIAgentsShowcase({ sector }: { sector?: string } = {}) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeSector, setActiveSector] = useState(sector || "all");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const filteredAgents = useMemo(() => {
    if (activeSector === "all") return ALL_AGENTS;
    return ALL_AGENTS.filter(a => a.sectors.includes("all") || a.sectors.includes(activeSector));
  }, [activeSector]);

  const connectedFeatures = useMemo(() => {
    if (!expandedAgent) return new Set<string>();
    return new Set(PLATFORM_FEATURES.filter(f => f.connectedAgents.includes(expandedAgent)).map(f => f.id));
  }, [expandedAgent]);

  const connectedAgentsForFeature = useMemo(() => {
    if (!expandedAgent) return new Set<string>();
    return new Set([expandedAgent]);
  }, [expandedAgent]);

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[200px] opacity-[0.1] bg-primary top-0 left-1/2 -translate-x-1/2" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[150px] opacity-[0.07] bg-accent bottom-0 right-0" />
        {/* Neural grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dna-grid-v2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="0.8" fill="hsl(var(--primary))" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dna-grid-v2)" />
        </svg>
        {/* DNA Helix strands */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 3000">
          <defs>
            <linearGradient id="dna2-s1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              <stop offset="30%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="70%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="dna2-s2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0" />
              <stop offset="30%" stopColor="hsl(var(--accent))" stopOpacity="0.25" />
              <stop offset="70%" stopColor="hsl(var(--accent))" stopOpacity="0.25" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={`M 100 0 ${Array.from({ length: 25 }, (_, i) => `Q ${100 + Math.sin(i * 0.5) * 100} ${i * 120 + 60}, ${100 + Math.sin((i + 1) * 0.5) * 100} ${(i + 1) * 120}`).join(' ')}`}
            fill="none" stroke="url(#dna2-s1)" strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.path
            d={`M 1100 0 ${Array.from({ length: 25 }, (_, i) => `Q ${1100 - Math.sin(i * 0.5) * 100} ${i * 120 + 60}, ${1100 - Math.sin((i + 1) * 0.5) * 100} ${(i + 1) * 120}`).join(' ')}`}
            fill="none" stroke="url(#dna2-s2)" strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 3, delay: 0.3, ease: "easeInOut" }}
          />
          {/* Rungs */}
          {Array.from({ length: 20 }, (_, i) => (
            <motion.line key={i} x1="80" y1={80 + i * 145} x2="1120" y2={80 + i * 145}
              stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="3 10" strokeOpacity="0.15"
              initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.05 }}
            />
          ))}
        </svg>
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">

        {/* ══════ HEADER ══════ */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/[0.06] backdrop-blur-sm mb-4">
            <Bot className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[0.6rem] font-heading font-bold text-primary/80 tracking-[0.15em] uppercase">Ecosistema IA Completo</span>
            <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-bold">{ALL_AGENTS.length}+ Agenti</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
            className="text-[clamp(1.4rem,4.5vw,3rem)] font-heading font-bold text-foreground leading-[1.05] mb-3">
            Agenti IA + Funzionalità{" "}
            <span className="text-shimmer">Interconnessi</span>
          </motion.h2>
          <p className="text-foreground/40 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Ogni agente IA è collegato alle funzionalità della piattaforma. Insieme formano un ecosistema autonomo che gestisce,
            analizza e fa crescere il tuo business — 24/7.
          </p>
        </div>

        {/* ══════ SECTOR FILTER ══════ */}
        <div className="flex gap-1 justify-center flex-wrap mb-6 sm:mb-8 px-2">
          {SECTOR_TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveSector(tab.id); setExpandedAgent(null); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.5rem] sm:text-[0.55rem] font-heading font-semibold tracking-wider uppercase transition-all border ${
                activeSector === tab.id
                  ? "text-foreground border-primary/30 bg-primary/8"
                  : "text-foreground/25 border-transparent hover:text-foreground/45"
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ══════ NEURAL MAP: Agents + Features ══════ */}
        <div className="relative">

          {/* ── AGENTS SECTION ── */}
          <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
            className="mb-3 flex items-center gap-2 px-1">
            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
              <Brain className="w-3 h-3 text-primary" />
            </div>
            <span className="text-[0.55rem] font-heading font-bold text-primary/60 tracking-[3px] uppercase">Agenti IA Autonomi</span>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/15 to-transparent" />
            <span className="text-[0.5rem] text-foreground/20 font-mono">{filteredAgents.length} attivi</span>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5 mb-8">
            {filteredAgents.map((agent, i) => {
              const agentImg = getAgentImage(agent.name, agent.category, agent.sectors);
              const isExpanded = expandedAgent === agent.id;
              const isConnected = connectedAgentsForFeature.has(agent.id);

              return (
                <motion.div key={agent.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 200, damping: 20 }}
                  onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                  className="group cursor-pointer"
                >
                  <div className={`relative rounded-xl border overflow-hidden transition-all duration-400 ${
                    isExpanded
                      ? "border-primary/40 shadow-[0_0_25px_hsl(var(--primary)/0.12)]"
                      : isConnected
                        ? "border-primary/20 bg-primary/[0.02]"
                        : "border-foreground/[0.06] hover:border-primary/15"
                  }`}
                    style={{ background: isExpanded ? "linear-gradient(135deg, hsla(265,20%,12%,0.95), hsla(265,30%,8%,0.98))" : undefined }}>

                    {/* Agent photo + header */}
                    <div className="relative h-16 sm:h-20 overflow-hidden">
                      <img src={agentImg} alt={agent.name}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        loading="lazy" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsla(260,15%,8%,0.95), hsla(260,15%,8%,0.3))" }} />
                      {/* Status dot */}
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)] animate-pulse" />
                      {/* Stat badge */}
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[0.5rem] font-heading font-bold"
                        style={{ background: "hsla(0,0%,0%,0.5)", backdropFilter: "blur(4px)", color: agent.glow }}>
                        <Counter value={agent.stat.value} suffix={agent.stat.suffix} /> {agent.stat.label}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-2.5 sm:p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-5 h-5 min-w-[20px] rounded-md bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white`}>
                          {agent.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-heading font-bold text-[0.65rem] sm:text-[0.7rem] text-foreground leading-tight truncate">{agent.name}</h3>
                          <p className="text-[0.45rem] sm:text-[0.5rem] text-primary/50 tracking-wider uppercase truncate">{agent.role}</p>
                        </div>
                      </div>

                      <p className="text-[0.55rem] text-foreground/35 leading-[1.45] line-clamp-2 mb-1.5">{agent.desc}</p>

                      {/* Capabilities pills */}
                      <div className="flex flex-wrap gap-0.5">
                        {agent.capabilities.slice(0, isExpanded ? 4 : 2).map((cap, ci) => (
                          <span key={ci} className="text-[0.45rem] px-1.5 py-0.5 rounded-full bg-foreground/[0.04] text-foreground/30 border border-foreground/[0.04]">
                            {cap}
                          </span>
                        ))}
                        {!isExpanded && agent.capabilities.length > 2 && (
                          <span className="text-[0.45rem] px-1 text-primary/40">+{agent.capabilities.length - 2}</span>
                        )}
                      </div>

                      {/* Expanded: Why you need + connected features */}
                      {isExpanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2">
                          <div className="px-2 py-1.5 rounded-lg bg-primary/[0.04] border border-primary/10 mb-2">
                            <p className="text-[0.5rem] text-primary/70 leading-[1.45]">
                              💡 <strong className="text-primary/90">Perché ti serve:</strong> {agent.whyNeed}
                            </p>
                          </div>
                          {/* Connected features indicator */}
                          <div className="flex items-center gap-1">
                            <Network className="w-2.5 h-2.5 text-primary/40" />
                            <span className="text-[0.45rem] text-primary/40">Collegato a {PLATFORM_FEATURES.filter(f => f.connectedAgents.includes(agent.id)).length} funzionalità</span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Connection line indicator */}
                    {isExpanded && (
                      <motion.div className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${agent.glow}, transparent)` }}
                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── CONNECTION LINES VISUAL ── */}
          <motion.div className="relative my-6 sm:my-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 justify-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/[0.04]">
                <motion.div className="w-2 h-2 rounded-full bg-primary/40"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }} />
                <CircuitBoard className="w-3.5 h-3.5 text-primary/50" />
                <span className="text-[0.5rem] font-heading font-bold text-primary/50 tracking-widest uppercase">Neural Link Attivo</span>
                <motion.div className="w-2 h-2 rounded-full bg-accent/40"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            </div>
            {/* Animated data flow lines */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 overflow-hidden pointer-events-none">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="absolute h-[1px] top-1/2"
                  style={{ background: `linear-gradient(90deg, transparent, hsl(var(--primary) / ${0.15 + i * 0.05}), transparent)`, width: "30%" }}
                  animate={{ left: ["-30%", "130%"] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.8, ease: "linear" }}
                />
              ))}
            </div>
          </motion.div>

          {/* ── FEATURES SECTION ── */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mb-3 flex items-center gap-2 px-1">
            <div className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center">
              <Settings className="w-3 h-3 text-accent" />
            </div>
            <span className="text-[0.55rem] font-heading font-bold text-accent/60 tracking-[3px] uppercase">Funzionalità Piattaforma</span>
            <div className="flex-1 h-px bg-gradient-to-r from-accent/15 to-transparent" />
            <span className="text-[0.5rem] text-foreground/20 font-mono">{PLATFORM_FEATURES.length} moduli</span>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2 mb-10">
            {PLATFORM_FEATURES.map((feat, i) => {
              const isHighlighted = connectedFeatures.has(feat.id);
              return (
                <motion.div key={feat.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: i * 0.03 }}
                  className="group"
                >
                  <div className={`relative rounded-lg border p-2.5 sm:p-3 overflow-hidden transition-all duration-400 ${
                    isHighlighted
                      ? "border-primary/30 bg-primary/[0.04] shadow-[0_0_15px_hsl(var(--primary)/0.08)]"
                      : "border-foreground/[0.05] hover:border-foreground/10 bg-card/20"
                  }`}>
                    {/* Top accent */}
                    <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${feat.gradient} ${isHighlighted ? "opacity-50" : "opacity-0 group-hover:opacity-30"} transition-opacity`} />

                    <div className="flex items-start gap-2">
                      <div className={`w-7 h-7 min-w-[28px] rounded-lg bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white shadow-sm ${isHighlighted ? "shadow-[0_0_12px_hsl(var(--primary)/0.2)]" : ""}`}>
                        {feat.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-heading font-bold text-[0.6rem] sm:text-[0.65rem] text-foreground leading-tight mb-0.5">{feat.name}</h4>
                        <p className="text-[0.5rem] text-foreground/30 leading-[1.4] line-clamp-2">{feat.desc}</p>
                      </div>
                    </div>

                    {/* Connected agents indicator */}
                    {isHighlighted && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="mt-1.5 flex items-center gap-1">
                        <Activity className="w-2.5 h-2.5 text-primary/40" />
                        <span className="text-[0.45rem] text-primary/40 font-heading">Connesso</span>
                      </motion.div>
                    )}

                    {/* Data flow lines on highlighted */}
                    {isHighlighted && (
                      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <motion.div className="absolute h-[1px] w-full top-1/2"
                          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.2), transparent)" }}
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ══════ IMPACT STATS ══════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-xl border border-foreground/[0.06] bg-card/30 backdrop-blur-sm p-5 sm:p-7 overflow-hidden mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-accent/[0.03]" />

          <div className="relative z-10 text-center mb-5">
            <div className="inline-flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-primary" />
              <span className="font-heading font-bold text-foreground text-sm sm:text-base">L'Impatto sui Tuoi Risultati</span>
            </div>
            <p className="text-foreground/30 text-[0.6rem] max-w-md mx-auto">Numeri reali, misurabili — risultati garantiti per contratto</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 relative z-10">
            {impactStats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                className="text-center">
                <div className="w-8 h-8 rounded-lg bg-primary/[0.08] border border-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
                  {stat.icon}
                </div>
                <div className="text-lg sm:text-xl font-heading font-bold text-foreground mb-0.5">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-[0.6rem] font-heading font-semibold text-foreground/60">{stat.label}</p>
                <p className="text-[0.5rem] text-foreground/25">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════ FOREVER ADVANTAGE ══════ */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center">
          <Sparkles className="w-6 h-6 text-primary mx-auto mb-3" />
          <h3 className="text-[clamp(1.1rem,3vw,1.8rem)] font-heading font-bold text-foreground leading-[1.15] mb-2">
            Sempre Avanti. <span className="text-shimmer">Per Sempre.</span>
          </h3>
          <p className="text-foreground/35 text-xs max-w-md mx-auto leading-relaxed mb-4">
            Ogni settimana nuovi agenti, nuove automazioni, nuove integrazioni.
            <strong className="text-foreground/55"> Il tuo business evolve per sempre.</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {["Aggiornamenti Settimanali", "Nuovi Agenti IA", "Zero Costi Extra", "Evoluzione Perpetua"].map((t, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.06 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-primary/12 bg-primary/[0.03] text-[0.5rem] font-heading font-semibold text-primary/60">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
