import { motion, useInView, AnimatePresence, LayoutGroup } from "framer-motion";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import {
  Bot, Brain, Zap, TrendingUp, Shield, Sparkles,
  ChefHat, Car, Scissors, Heart, Store, Dumbbell, Building,
  Clock, Target, Wallet, Users, BarChart3, Bell, Cpu,
  Workflow, ArrowRight, Crown, Rocket, Eye, Radio,
  MessageSquare, Layers, Fingerprint, Globe, Timer,
  Calendar, FileText, Star, Umbrella, QrCode, MonitorSmartphone,
  CreditCard, Package, MapPin, ClipboardCheck, Headphones,
  Lock, Wifi, Database, Network, CircuitBoard, Activity,
  Settings, Receipt, ScanLine, Camera, X, ChevronDown, ChevronUp,
  Wrench, Briefcase, Truck, Leaf, Dog, Baby, GraduationCap,
  PartyPopper, Warehouse, Scale, Calculator, Hammer, Droplets,
  Palette as PaletteIcon, Lightbulb, Stethoscope, Bed, Utensils,
  BookOpen, Megaphone, HandCoins, ShieldCheck, Gauge,
  Anchor, Music, Plane, Coffee, Pill, Bike, Gem, Shirt,
  Glasses, Mic, Printer, Plug, Flame, Wind, TreePine, Scan,
  Smartphone, Mail, Phone, Video, Clapperboard, PenTool
} from "lucide-react";

/* ═══ COUNTER ═══ */
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

/* ═══ AGENT DATA ═══ */
interface FeatureNode {
  id: string; name: string; desc: string; icon: React.ReactNode;
}

interface AgentNode {
  id: string; name: string; role: string; desc: string; whyNeed: string;
  icon: React.ReactNode; gradient: string; glow: string;
  stat: { value: number; suffix: string; label: string };
  capabilities: string[]; category: string; sectors: string[];
  connections: string[];
  features?: FeatureNode[];
}

const ALL_AGENTS: AgentNode[] = [
  /* ═══ UNIVERSALI (all sectors) ═══ */
  { id: "ghost-manager", name: "GhostManager™", role: "Direttore Operativo IA", desc: "Manager virtuale che monitora ordini, ottimizza turni, rileva anomalie e prende decisioni operative in tempo reale — 24/7.", whyNeed: "Senza un manager IA, perdi ore in micro-decisioni.", icon: <Bot className="w-5 h-5" />, gradient: "from-violet-500 to-purple-600", glow: "hsla(265,80%,60%,1)", stat: { value: 24, suffix: "/7", label: "Operativo" }, capabilities: ["Gestione ordini autonoma", "Ottimizzazione turni", "Alert anomalie", "Decisioni predittive"], category: "operations", sectors: ["all"], connections: ["kitchen-commander", "predictive-engine", "concierge-ai"], features: [{ id: "gm-auto-orders", name: "Gestione Ordini Autonoma", desc: "Processa ordini senza intervento umano", icon: <ClipboardCheck className="w-3.5 h-3.5" /> }, { id: "gm-shift-opt", name: "Ottimizzazione Turni", desc: "Bilancia carichi di lavoro", icon: <Clock className="w-3.5 h-3.5" /> }] },
  { id: "concierge-ai", name: "Concierge AI", role: "Assistente Clienti 24/7", desc: "Risponde ai clienti via chat in 12+ lingue, gestisce prenotazioni e risolve problemi.", whyNeed: "Ogni cliente senza risposta è un cliente perso.", icon: <MessageSquare className="w-5 h-5" />, gradient: "from-sky-500 to-blue-600", glow: "hsla(210,80%,55%,1)", stat: { value: 12, suffix: "+", label: "Lingue" }, capabilities: ["Chat multilingue", "Prenotazioni auto", "Upselling IA", "Risoluzione problemi"], category: "concierge", sectors: ["all"], connections: ["ghost-manager", "loyalty-angel", "autopilot-marketing"], features: [{ id: "con-multilang", name: "Chat Multilingue", desc: "Risponde in 12+ lingue", icon: <Globe className="w-3.5 h-3.5" /> }] },
  { id: "predictive-engine", name: "Predictive Engine", role: "Analista Predittivo", desc: "Analizza pattern di vendita, previsione domanda e trend stagionali.", whyNeed: "Senza dati predittivi navighi alla cieca.", icon: <BarChart3 className="w-5 h-5" />, gradient: "from-emerald-500 to-teal-600", glow: "hsla(160,70%,45%,1)", stat: { value: 45, suffix: "%", label: "↑ Revenue" }, capabilities: ["Previsione domanda", "Analisi trend", "Segmentazione clienti", "Report IA"], category: "analytics", sectors: ["all"], connections: ["ghost-manager", "autopilot-marketing", "dynamic-pricing"], features: [{ id: "pred-demand", name: "Previsione Domanda", desc: "Predice volumi di vendita", icon: <TrendingUp className="w-3.5 h-3.5" /> }] },
  { id: "autopilot-marketing", name: "AutoPilot Marketing", role: "Growth Hacker Autonomo", desc: "Campagne email, WhatsApp e push basate su comportamenti reali.", whyNeed: "Il 68% dei clienti non torna senza follow-up.", icon: <Rocket className="w-5 h-5" />, gradient: "from-amber-400 to-orange-500", glow: "hsla(35,90%,55%,1)", stat: { value: 3, suffix: "×", label: "ROI Marketing" }, capabilities: ["Campagne comportamentali", "Recupero clienti", "Push & WhatsApp auto", "A/B testing"], category: "content", sectors: ["all"], connections: ["predictive-engine", "loyalty-angel", "social-creator", "concierge-ai"], features: [{ id: "mkt-recover", name: "Recupero Clienti Persi", desc: "Riattiva clienti inattivi", icon: <Heart className="w-3.5 h-3.5" /> }] },
  { id: "review-shield", name: "Review Shield™", role: "Protezione Reputazione", desc: "Intercetta le recensioni negative PRIMA che arrivino su Google.", whyNeed: "Una sola recensione negativa costa 30 clienti.", icon: <Shield className="w-5 h-5" />, gradient: "from-emerald-500 to-green-600", glow: "hsla(150,70%,45%,1)", stat: { value: 95, suffix: "%", label: "★ Positive" }, capabilities: ["Intercettazione feedback", "Filtro recensioni", "Alert negativi", "Boost positivi"], category: "compliance", sectors: ["all"], connections: ["concierge-ai", "autopilot-marketing"], features: [] },
  { id: "social-creator", name: "Social Creator", role: "Generatore Contenuti", desc: "Crea post Instagram, stories e newsletter automaticamente.", whyNeed: "Senza social costanti diventi invisibile.", icon: <Globe className="w-5 h-5" />, gradient: "from-violet-500 to-indigo-500", glow: "hsla(260,70%,55%,1)", stat: { value: 5, suffix: "×", label: "Engagement" }, capabilities: ["Post Instagram auto", "Stories template", "Newsletter", "Hashtag ottimizzati"], category: "content", sectors: ["all"], connections: ["autopilot-marketing", "chef-intelligence"], features: [] },
  { id: "loyalty-angel", name: "Loyalty Angel", role: "Fidelizzazione Clienti", desc: "Identifica clienti a rischio abbandono e attiva riattivazione automatica.", whyNeed: "Acquisire un nuovo cliente costa 7× di più.", icon: <Heart className="w-5 h-5" />, gradient: "from-rose-400 to-pink-500", glow: "hsla(350,75%,60%,1)", stat: { value: 3, suffix: "×", label: "Tasso ritorno" }, capabilities: ["Alert clienti inattivi", "Offerte personalizzate", "Compleanno auto", "WhatsApp marketing"], category: "sales", sectors: ["all"], connections: ["concierge-ai", "autopilot-marketing", "predictive-engine"], features: [] },
  { id: "invoice-ai", name: "Invoice AI", role: "Fatturazione Automatica", desc: "Genera fatture elettroniche, gestisce IVA, codice univoco e PEC.", whyNeed: "Ogni fattura manuale costa 15 minuti.", icon: <Receipt className="w-5 h-5" />, gradient: "from-blue-500 to-cyan-500", glow: "hsla(200,70%,55%,1)", stat: { value: 2, suffix: "s", label: "Per fattura" }, capabilities: ["Fatturazione elettronica", "Gestione IVA", "SDI automatico", "Report fiscali"], category: "compliance", sectors: ["all"], connections: ["ghost-manager", "predictive-engine"], features: [] },
  { id: "smart-notifier", name: "Smart Notifier", role: "Notifiche Intelligenti", desc: "Invia push, SMS e WhatsApp al momento giusto con il messaggio giusto.", whyNeed: "Il timing delle notifiche vale il 40% del tasso apertura.", icon: <Bell className="w-5 h-5" />, gradient: "from-yellow-400 to-amber-500", glow: "hsla(45,90%,55%,1)", stat: { value: 92, suffix: "%", label: "Open rate" }, capabilities: ["Push intelligenti", "SMS timing ottimale", "WhatsApp broadcast", "Segmentazione auto"], category: "content", sectors: ["all"], connections: ["autopilot-marketing", "concierge-ai"], features: [] },
  { id: "data-guardian", name: "Data Guardian", role: "Privacy & GDPR", desc: "Gestisce consensi GDPR, cancellazione dati e compliance automatica.", whyNeed: "Una violazione GDPR costa fino a €20M.", icon: <Lock className="w-5 h-5" />, gradient: "from-gray-500 to-slate-600", glow: "hsla(220,20%,50%,1)", stat: { value: 100, suffix: "%", label: "GDPR" }, capabilities: ["Gestione consensi", "Diritto oblio", "Audit trail", "Cookie compliance"], category: "compliance", sectors: ["all"], connections: ["ghost-manager", "invoice-ai"], features: [] },
  { id: "voice-assistant", name: "Voice Assistant", role: "Assistente Vocale", desc: "Rispondi ai clienti con una voce naturale IA — telefonate, ordini, info.", whyNeed: "Il 35% dei clienti preferisce chiamare.", icon: <Phone className="w-5 h-5" />, gradient: "from-indigo-500 to-purple-500", glow: "hsla(250,70%,55%,1)", stat: { value: 35, suffix: "%", label: "Chiamate gestite" }, capabilities: ["Risposte vocali IA", "Ordini telefonici", "IVR intelligente", "Multilingue"], category: "concierge", sectors: ["all"], connections: ["concierge-ai", "ghost-manager"], features: [] },
  { id: "qr-genius", name: "QR Genius", role: "Generatore QR Smart", desc: "QR code dinamici per menu, pagamenti, feedback e promozioni.", whyNeed: "Un QR ben piazzato aumenta le interazioni del 300%.", icon: <QrCode className="w-5 h-5" />, gradient: "from-cyan-500 to-teal-500", glow: "hsla(180,70%,50%,1)", stat: { value: 300, suffix: "%", label: "↑ Interazioni" }, capabilities: ["QR menu digitale", "QR pagamenti", "QR feedback", "QR promozioni"], category: "operations", sectors: ["all"], connections: ["concierge-ai", "review-shield"], features: [] },
  { id: "translate-pro", name: "Translate Pro", role: "Traduttore Universale", desc: "Traduce menu, sito, comunicazioni in 30+ lingue con contesto settoriale.", whyNeed: "Il turismo vale il 40% del fatturato italiano.", icon: <Globe className="w-5 h-5" />, gradient: "from-blue-400 to-sky-500", glow: "hsla(200,75%,55%,1)", stat: { value: 30, suffix: "+", label: "Lingue" }, capabilities: ["Traduzione menu", "Sito multilingue", "Chat tradotta", "Contesto settoriale"], category: "operations", sectors: ["all"], connections: ["concierge-ai", "social-creator"], features: [] },
  { id: "analytics-brain", name: "Analytics Brain", role: "Dashboard IA", desc: "Dashboard unificata con KPI, trend e suggerimenti automatici per decisioni rapide.", whyNeed: "Senza una dashboard intelligente voli alla cieca.", icon: <Brain className="w-5 h-5" />, gradient: "from-purple-500 to-violet-600", glow: "hsla(270,70%,55%,1)", stat: { value: 50, suffix: "+", label: "KPI" }, capabilities: ["KPI real-time", "Trend analysis", "Suggerimenti IA", "Report automatici"], category: "analytics", sectors: ["all"], connections: ["predictive-engine", "ghost-manager"], features: [] },
  { id: "payment-hub", name: "Payment Hub", role: "Pagamenti Unificati", desc: "Gestisce tutti i metodi di pagamento: carta, contanti, Satispay, Apple Pay.", whyNeed: "Ogni metodo mancante è un 5% di vendite perse.", icon: <CreditCard className="w-5 h-5" />, gradient: "from-green-500 to-emerald-500", glow: "hsla(150,65%,50%,1)", stat: { value: 12, suffix: "+", label: "Metodi" }, capabilities: ["Multi-gateway", "Riconciliazione auto", "Split payment", "Refund IA"], category: "operations", sectors: ["all"], connections: ["invoice-ai", "ghost-manager"], features: [] },
  { id: "staff-scheduler", name: "Staff Scheduler", role: "Turni & Presenze", desc: "Genera turni ottimali, gestisce ferie, malattie e straordinari in un tap.", whyNeed: "Fare turni manualmente richiede 4h/settimana.", icon: <Users className="w-5 h-5" />, gradient: "from-teal-500 to-cyan-600", glow: "hsla(185,70%,50%,1)", stat: { value: 4, suffix: "h", label: "Risparmiate/sett" }, capabilities: ["Turni automatici", "Gestione ferie", "Presenze digitali", "Costo lavoro"], category: "operations", sectors: ["all"], connections: ["ghost-manager", "predictive-engine"], features: [] },

  /* ═══ FOOD & BAKERY ═══ */
  { id: "chef-intelligence", name: "Chef Intelligence", role: "Assistente Culinario IA", desc: "Menu completi con foto, allergeni, traduzioni e prezzi ottimizzati.", whyNeed: "Ogni errore nel menu costa clienti.", icon: <ChefHat className="w-5 h-5" />, gradient: "from-orange-500 to-amber-500", glow: "hsla(30,90%,55%,1)", stat: { value: 60, suffix: "s", label: "Menu pronto" }, capabilities: ["Menu IA in 60s", "Food cost auto", "Allergeni & traduzioni", "Foto piatti pro"], category: "operations", sectors: ["food", "bakery"], connections: ["kitchen-commander", "sommelier-ia"], features: [] },
  { id: "kitchen-commander", name: "Kitchen Commander", role: "Gestione Cucina Live", desc: "Dashboard cucina in tempo reale con priorità ordini e timer intelligenti.", whyNeed: "Una cucina caotica brucia margini.", icon: <Clock className="w-5 h-5" />, gradient: "from-red-500 to-rose-600", glow: "hsla(0,80%,55%,1)", stat: { value: 40, suffix: "%", label: "↓ Tempi attesa" }, capabilities: ["Ordini prioritizzati", "Timer intelligenti", "Comande coordinate", "Alert ritardi"], category: "operations", sectors: ["food"], connections: ["ghost-manager", "chef-intelligence"], features: [] },
  { id: "sommelier-ia", name: "Sommelier IA", role: "Esperto Abbinamenti", desc: "Suggerisce abbinamenti vino-piatto perfetti.", whyNeed: "Il 70% dei clienti non ordina vino.", icon: <Target className="w-5 h-5" />, gradient: "from-purple-500 to-violet-600", glow: "hsla(270,70%,55%,1)", stat: { value: 35, suffix: "%", label: "↑ Scontrino" }, capabilities: ["Abbinamenti vino-piatto", "Upselling naturale", "Carta vini dinamica"], category: "sales", sectors: ["food"], connections: ["chef-intelligence", "concierge-ai"], features: [] },
  { id: "haccp-guardian", name: "HACCP Guardian", role: "Conformità Igienico-Sanitaria", desc: "Automatizza registrazioni HACCP, monitora temperature.", whyNeed: "Ogni multa HACCP costa migliaia.", icon: <ClipboardCheck className="w-5 h-5" />, gradient: "from-green-500 to-emerald-600", glow: "hsla(140,70%,45%,1)", stat: { value: 100, suffix: "%", label: "Compliance" }, capabilities: ["Registri digitali", "Monitor temperature", "Report ispezioni"], category: "compliance", sectors: ["food", "bakery"], connections: ["ghost-manager", "kitchen-commander"], features: [] },
  { id: "table-master", name: "Table Master", role: "Gestione Tavoli IA", desc: "Mappa tavoli interattiva con assegnazione intelligente e rotazione ottimale.", whyNeed: "Tavoli mal gestiti = clienti in attesa inutile.", icon: <MapPin className="w-5 h-5" />, gradient: "from-amber-500 to-orange-600", glow: "hsla(30,85%,55%,1)", stat: { value: 25, suffix: "%", label: "↑ Coperti" }, capabilities: ["Mappa tavoli", "Rotazione smart", "Attese ridotte", "Walk-in manager"], category: "operations", sectors: ["food"], connections: ["kitchen-commander", "concierge-ai"], features: [] },
  { id: "delivery-optimizer", name: "Delivery Optimizer", role: "Consegne Intelligenti", desc: "Ottimizza ordini delivery con tracking, ETA e gestione rider.", whyNeed: "Delivery lente = recensioni negative.", icon: <Truck className="w-5 h-5" />, gradient: "from-blue-500 to-indigo-500", glow: "hsla(225,70%,55%,1)", stat: { value: 20, suffix: "min", label: "ETA media" }, capabilities: ["Tracking live", "ETA predittiva", "Gestione rider", "Zone ottimizzate"], category: "operations", sectors: ["food", "bakery"], connections: ["kitchen-commander", "ghost-manager"], features: [] },
  { id: "menu-photographer", name: "Menu Photographer", role: "Foto Piatti IA", desc: "Genera foto professionali dei piatti con IA generativa.", whyNeed: "Un piatto senza foto vende il 70% in meno.", icon: <Camera className="w-5 h-5" />, gradient: "from-pink-500 to-rose-500", glow: "hsla(340,75%,55%,1)", stat: { value: 70, suffix: "%", label: "↑ Ordini" }, capabilities: ["Foto IA piatti", "Styling automatico", "Multi-angolo", "Background pro"], category: "content", sectors: ["food", "bakery"], connections: ["chef-intelligence", "social-creator"], features: [] },
  { id: "waste-tracker", name: "Waste Tracker", role: "Anti-Spreco Alimentare", desc: "Monitora scadenze, sprechi e suggerisce porzioni ottimali.", whyNeed: "Lo spreco alimentare costa il 10% del fatturato.", icon: <Leaf className="w-5 h-5" />, gradient: "from-green-400 to-lime-500", glow: "hsla(100,70%,50%,1)", stat: { value: 30, suffix: "%", label: "↓ Spreco" }, capabilities: ["Alert scadenze", "Porzioni smart", "Donazione surplus", "Report sprechi"], category: "operations", sectors: ["food", "bakery", "hotel"], connections: ["chef-intelligence", "predictive-engine"], features: [] },
  { id: "reservation-ai", name: "Reservation AI", role: "Prenotazioni Ristorante", desc: "Gestisce prenotazioni online, walk-in, liste d'attesa e conferme automatiche.", whyNeed: "Il 30% dei no-show si evita con conferme smart.", icon: <Calendar className="w-5 h-5" />, gradient: "from-indigo-400 to-blue-500", glow: "hsla(220,70%,55%,1)", stat: { value: 30, suffix: "%", label: "↓ No-show" }, capabilities: ["Booking online 24/7", "Lista attesa", "Conferme auto", "Gestione no-show"], category: "operations", sectors: ["food"], connections: ["concierge-ai", "table-master"], features: [] },

  /* ═══ NCC & TRASPORTO ═══ */
  { id: "smart-dispatcher", name: "Smart Dispatcher", role: "Assegnazione Intelligente", desc: "Assegna corse all'autista perfetto in 3 secondi.", whyNeed: "Assegnare corse manualmente crea ritardi.", icon: <Car className="w-5 h-5" />, gradient: "from-amber-400 to-yellow-500", glow: "hsla(40,90%,55%,1)", stat: { value: 30, suffix: "%", label: "↑ Efficienza" }, capabilities: ["Assegnazione automatica", "Matching veicolo", "Percorsi ottimali"], category: "operations", sectors: ["ncc"], connections: ["dynamic-pricing", "ghost-manager", "fleet-ai"], features: [] },
  { id: "dynamic-pricing", name: "Dynamic Pricing", role: "Tariffe Intelligenti", desc: "Tariffe dinamiche basate su distanza, traffico e domanda.", whyNeed: "Tariffe fisse = soldi persi.", icon: <Wallet className="w-5 h-5" />, gradient: "from-emerald-500 to-teal-500", glow: "hsla(160,70%,50%,1)", stat: { value: 25, suffix: "%", label: "↑ Revenue" }, capabilities: ["Prezzi dinamici", "Surge pricing", "Analisi concorrenza"], category: "analytics", sectors: ["ncc", "beach", "hotel"], connections: ["predictive-engine", "smart-dispatcher", "revenue-manager"], features: [] },
  { id: "fleet-ai", name: "Fleet AI", role: "Gestione Flotta IA", desc: "Monitora stato veicoli, scadenze e manutenzione.", whyNeed: "Un veicolo fermo = corse perse.", icon: <Truck className="w-5 h-5" />, gradient: "from-slate-500 to-zinc-600", glow: "hsla(220,30%,50%,1)", stat: { value: 0, suffix: "", label: "Fermi imprevisti" }, capabilities: ["Monitor veicoli", "Alert scadenze", "Manutenzione predittiva"], category: "operations", sectors: ["ncc"], connections: ["smart-dispatcher", "ghost-manager"], features: [] },
  { id: "passenger-concierge", name: "Passenger Concierge", role: "Concierge Passeggero", desc: "Info turistiche, prenotazioni ristoranti e suggerimenti per i passeggeri.", whyNeed: "Il servizio premium aumenta le recensioni.", icon: <Crown className="w-5 h-5" />, gradient: "from-yellow-400 to-amber-500", glow: "hsla(45,90%,55%,1)", stat: { value: 5, suffix: "★", label: "Rating" }, capabilities: ["Info turistiche", "Booking ristoranti", "Suggerimenti locali", "Multilingue"], category: "concierge", sectors: ["ncc"], connections: ["concierge-ai", "smart-dispatcher"], features: [] },
  { id: "driver-coach", name: "Driver Coach IA", role: "Formazione Autisti", desc: "Monitora stile di guida, suggerisce miglioramenti e gestisce formazione.", whyNeed: "Autisti migliori = meno incidenti e più clienti.", icon: <GraduationCap className="w-5 h-5" />, gradient: "from-blue-500 to-indigo-600", glow: "hsla(230,70%,55%,1)", stat: { value: 40, suffix: "%", label: "↓ Reclami" }, capabilities: ["Analisi guida", "Formazione continua", "Score autista", "Feedback clienti"], category: "operations", sectors: ["ncc"], connections: ["fleet-ai", "ghost-manager"], features: [] },

  /* ═══ BEAUTY & WELLNESS ═══ */
  { id: "smart-agenda", name: "Smart Agenda", role: "Ottimizzatore Appuntamenti", desc: "Riempie buchi in agenda e previene no-show con reminder intelligenti.", whyNeed: "Ogni buco in agenda è fatturato perso.", icon: <Calendar className="w-5 h-5" />, gradient: "from-pink-500 to-rose-500", glow: "hsla(340,80%,55%,1)", stat: { value: 85, suffix: "%", label: "↓ No-show" }, capabilities: ["Anti no-show 85%", "Buchi riempiti", "Reminder multicanale", "Booking 24/7"], category: "operations", sectors: ["beauty", "healthcare", "tattoo", "veterinary"], connections: ["concierge-ai", "autopilot-marketing"], features: [] },
  { id: "beauty-advisor", name: "Beauty Advisor IA", role: "Consulente Estetica", desc: "Analizza preferenze e suggerisce trattamenti personalizzati.", whyNeed: "Il 60% dei clienti non conosce tutti i tuoi servizi.", icon: <Scissors className="w-5 h-5" />, gradient: "from-pink-400 to-fuchsia-500", glow: "hsla(320,75%,58%,1)", stat: { value: 40, suffix: "%", label: "↑ Cross-sell" }, capabilities: ["Suggerimenti trattamenti", "Pacchetti personalizzati", "Storico preferenze"], category: "sales", sectors: ["beauty", "tattoo"], connections: ["smart-agenda", "loyalty-angel"], features: [] },
  { id: "skin-analyzer", name: "Skin Analyzer IA", role: "Analisi Pelle", desc: "Analizza la pelle tramite foto e suggerisce trattamenti mirati.", whyNeed: "Diagnosi precise = trattamenti mirati = clienti soddisfatti.", icon: <Scan className="w-5 h-5" />, gradient: "from-fuchsia-400 to-pink-500", glow: "hsla(310,75%,55%,1)", stat: { value: 95, suffix: "%", label: "Precisione" }, capabilities: ["Analisi foto pelle", "Diagnosi automatica", "Trattamenti suggeriti", "Storico evoluzione"], category: "analytics", sectors: ["beauty"], connections: ["beauty-advisor", "concierge-ai"], features: [] },
  { id: "product-recommender", name: "Product Recommender", role: "Vendita Prodotti", desc: "Suggerisce prodotti retail in base ai trattamenti effettuati.", whyNeed: "Il retail in salone vale il 20% del fatturato mancante.", icon: <Store className="w-5 h-5" />, gradient: "from-purple-400 to-violet-500", glow: "hsla(270,70%,55%,1)", stat: { value: 20, suffix: "%", label: "↑ Retail" }, capabilities: ["Cross-sell prodotti", "Storico acquisti", "Promozioni mirate", "Stock alert"], category: "sales", sectors: ["beauty"], connections: ["beauty-advisor", "loyalty-angel"], features: [] },

  /* ═══ HEALTHCARE ═══ */
  { id: "triage-ia", name: "Triage IA", role: "Pre-valutazione Intelligente", desc: "Pre-valuta richieste pazienti e assegna priorità.", whyNeed: "Pazienti indirizzati male = tempo sprecato.", icon: <Stethoscope className="w-5 h-5" />, gradient: "from-teal-500 to-cyan-500", glow: "hsla(180,70%,50%,1)", stat: { value: 70, suffix: "%", label: "↓ Attese" }, capabilities: ["Pre-screening", "Priorità auto", "Routing specialista"], category: "operations", sectors: ["healthcare"], connections: ["smart-agenda", "concierge-ai"], features: [] },
  { id: "patient-followup", name: "Patient Follow-Up", role: "Follow-Up Pazienti", desc: "Invia reminder terapie, controlli e richiami vaccinali.", whyNeed: "Il 40% dei pazienti dimentica i follow-up.", icon: <Heart className="w-5 h-5" />, gradient: "from-red-400 to-rose-500", glow: "hsla(350,75%,55%,1)", stat: { value: 40, suffix: "%", label: "↑ Aderenza" }, capabilities: ["Reminder terapie", "Richiami vaccinali", "Controlli periodici", "Telemedicina"], category: "operations", sectors: ["healthcare"], connections: ["triage-ia", "smart-agenda"], features: [] },
  { id: "medical-records", name: "Medical Records IA", role: "Cartelle Cliniche", desc: "Digitalizza e organizza cartelle cliniche con ricerca intelligente.", whyNeed: "Cartelle cartacee = errori e ritardi.", icon: <FileText className="w-5 h-5" />, gradient: "from-blue-500 to-cyan-600", glow: "hsla(200,70%,55%,1)", stat: { value: 0, suffix: "", label: "Errori cartelle" }, capabilities: ["Digitalizzazione", "Ricerca IA", "Storico completo", "Condivisione sicura"], category: "operations", sectors: ["healthcare"], connections: ["triage-ia", "data-guardian"], features: [] },
  { id: "pharma-stock", name: "Pharma Stock", role: "Gestione Farmaci", desc: "Monitora scorte farmaci, scadenze e riordino automatico.", whyNeed: "Un farmaco scaduto è un rischio legale.", icon: <Pill className="w-5 h-5" />, gradient: "from-green-400 to-teal-500", glow: "hsla(160,65%,50%,1)", stat: { value: 100, suffix: "%", label: "Tracciabilità" }, capabilities: ["Scadenze auto", "Riordino smart", "Tracciabilità lotti", "Alert stock"], category: "operations", sectors: ["healthcare", "veterinary"], connections: ["ghost-manager", "invoice-ai"], features: [] },

  /* ═══ HOTEL & HOSPITALITY ═══ */
  { id: "revenue-manager", name: "Revenue Manager IA", role: "Tariffe Dinamiche Hotel", desc: "Tariffe ottimali basate su domanda, eventi e competitor.", whyNeed: "Tariffe fisse = soldi persi ogni notte.", icon: <TrendingUp className="w-5 h-5" />, gradient: "from-amber-400 to-yellow-500", glow: "hsla(45,90%,55%,1)", stat: { value: 35, suffix: "%", label: "↑ RevPAR" }, capabilities: ["Yield management", "Competitor analysis", "Evento detection"], category: "analytics", sectors: ["hotel"], connections: ["dynamic-pricing", "predictive-engine"], features: [] },
  { id: "room-master", name: "Room Master IA", role: "Gestione Camere", desc: "Assegna camere in base a preferenze e stato pulizia.", whyNeed: "Assegnare camere manualmente genera errori.", icon: <Bed className="w-5 h-5" />, gradient: "from-indigo-500 to-blue-600", glow: "hsla(230,70%,55%,1)", stat: { value: 98, suffix: "%", label: "Guest satisfaction" }, capabilities: ["Assegnazione smart", "Piano pulizie", "Upgrade automatici"], category: "operations", sectors: ["hotel"], connections: ["revenue-manager", "concierge-ai"], features: [] },
  { id: "minibar-ai", name: "Minibar AI", role: "Minibar Intelligente", desc: "Monitora consumo minibar, riordina automaticamente e suggerisce preferenze.", whyNeed: "Un minibar trascurato perde €50/camera/mese.", icon: <Coffee className="w-5 h-5" />, gradient: "from-amber-500 to-orange-500", glow: "hsla(30,85%,55%,1)", stat: { value: 50, suffix: "€", label: "↑/camera/mese" }, capabilities: ["Tracking consumo", "Riordino auto", "Preferenze ospite", "Revenue analytics"], category: "operations", sectors: ["hotel"], connections: ["room-master", "predictive-engine"], features: [] },
  { id: "guest-experience", name: "Guest Experience", role: "Esperienza Ospite", desc: "Personalizza il soggiorno con preferenze, richieste speciali e servizi.", whyNeed: "Un ospite felice spende il 30% in più.", icon: <Star className="w-5 h-5" />, gradient: "from-yellow-400 to-amber-400", glow: "hsla(45,85%,55%,1)", stat: { value: 30, suffix: "%", label: "↑ Spesa" }, capabilities: ["Profilo ospite", "Richieste speciali", "Servizi personalizzati", "Welcome message"], category: "concierge", sectors: ["hotel"], connections: ["room-master", "concierge-ai"], features: [] },
  { id: "housekeeping-ai", name: "Housekeeping AI", role: "Pulizie Camere", desc: "Ottimizza turni housekeeping, priorità pulizie e controllo qualità.", whyNeed: "Pulizie disorganizzate = check-in ritardati.", icon: <Droplets className="w-5 h-5" />, gradient: "from-cyan-400 to-sky-500", glow: "hsla(195,75%,55%,1)", stat: { value: 25, suffix: "%", label: "↑ Efficienza" }, capabilities: ["Turni ottimizzati", "Priorità check-out", "QC digitale", "Alert manutenzione"], category: "operations", sectors: ["hotel"], connections: ["room-master", "ghost-manager"], features: [] },

  /* ═══ FITNESS ═══ */
  { id: "retention-ai", name: "Retention AI", role: "Anti-Abbandono Soci", desc: "Identifica soci a rischio cancellazione e attiva retention automatica.", whyNeed: "Il 40% dei soci abbandona nei primi 3 mesi.", icon: <Users className="w-5 h-5" />, gradient: "from-lime-500 to-green-500", glow: "hsla(100,70%,50%,1)", stat: { value: 60, suffix: "%", label: "↓ Churn" }, capabilities: ["Previsione churn", "Alert soci inattivi", "Campagne automatiche"], category: "sales", sectors: ["fitness"], connections: ["loyalty-angel", "autopilot-marketing"], features: [] },
  { id: "workout-ai", name: "Workout AI", role: "Trainer Virtuale", desc: "Genera schede allenamento personalizzate e monitora progressi.", whyNeed: "Schede generiche non funzionano.", icon: <Dumbbell className="w-5 h-5" />, gradient: "from-orange-500 to-red-500", glow: "hsla(15,80%,55%,1)", stat: { value: 3, suffix: "×", label: "Risultati" }, capabilities: ["Schede personalizzate", "Monitoraggio progressi", "Adattamento automatico"], category: "operations", sectors: ["fitness"], connections: ["retention-ai", "concierge-ai"], features: [] },
  { id: "class-booking", name: "Class Booking IA", role: "Prenotazione Corsi", desc: "Gestisce iscrizioni corsi, liste attesa e notifiche posti liberi.", whyNeed: "Corsi pieni senza lista attesa = clienti persi.", icon: <Calendar className="w-5 h-5" />, gradient: "from-blue-400 to-indigo-500", glow: "hsla(225,70%,55%,1)", stat: { value: 95, suffix: "%", label: "Riempimento" }, capabilities: ["Booking corsi", "Lista attesa", "Alert posti", "Cancellazione smart"], category: "operations", sectors: ["fitness"], connections: ["smart-agenda", "retention-ai"], features: [] },
  { id: "nutrition-ai", name: "Nutrition AI", role: "Piano Nutrizionale", desc: "Genera piani alimentari personalizzati integrati con l'allenamento.", whyNeed: "L'80% dei risultati fitness dipende dall'alimentazione.", icon: <Utensils className="w-5 h-5" />, gradient: "from-green-400 to-lime-500", glow: "hsla(110,70%,50%,1)", stat: { value: 80, suffix: "%", label: "Risultati" }, capabilities: ["Piani personalizzati", "Macro tracking", "Ricette suggerite", "Integrazione training"], category: "operations", sectors: ["fitness"], connections: ["workout-ai", "concierge-ai"], features: [] },

  /* ═══ TRADES (Artigiani, Edilizia) ═══ */
  { id: "field-dispatcher", name: "Field Dispatcher", role: "Coordinamento Interventi", desc: "Assegna interventi al tecnico più vicino con percorsi ottimizzati.", whyNeed: "Senza routing ottimizzato perdi ore.", icon: <Workflow className="w-5 h-5" />, gradient: "from-blue-500 to-indigo-500", glow: "hsla(230,70%,55%,1)", stat: { value: 40, suffix: "%", label: "↑ Interventi/giorno" }, capabilities: ["Assegnazione smart", "Ottimizzazione percorsi", "GPS tracking"], category: "operations", sectors: ["trades", "construction"], connections: ["smart-dispatcher", "ghost-manager"], features: [] },
  { id: "quote-builder", name: "Quote Builder IA", role: "Preventivi Intelligenti", desc: "Genera preventivi dettagliati in 2 minuti.", whyNeed: "Preventivi lenti = clienti persi.", icon: <Hammer className="w-5 h-5" />, gradient: "from-amber-500 to-orange-600", glow: "hsla(30,85%,55%,1)", stat: { value: 2, suffix: "min", label: "Per preventivo" }, capabilities: ["Calcolo materiali", "Stima manodopera", "Template pro", "Firma digitale"], category: "sales", sectors: ["trades", "construction"], connections: ["field-dispatcher", "invoice-ai"], features: [] },
  { id: "tool-tracker", name: "Tool Tracker", role: "Gestione Attrezzature", desc: "Traccia posizione e stato di attrezzi e macchinari del team.", whyNeed: "Attrezzi persi costano €5K+/anno.", icon: <Wrench className="w-5 h-5" />, gradient: "from-gray-500 to-zinc-600", glow: "hsla(220,25%,50%,1)", stat: { value: 5, suffix: "K€", label: "Risparmiati/anno" }, capabilities: ["GPS attrezzi", "Stato manutenzione", "Assegnazione team", "Alert smarrimento"], category: "operations", sectors: ["trades", "construction"], connections: ["field-dispatcher", "ghost-manager"], features: [] },
  { id: "safety-inspector", name: "Safety Inspector", role: "Sicurezza Cantiere", desc: "Checklist sicurezza digitali, DPI e documentazione obbligatoria.", whyNeed: "Ogni incidente costa fino a €100K.", icon: <ShieldCheck className="w-5 h-5" />, gradient: "from-red-500 to-orange-600", glow: "hsla(15,80%,55%,1)", stat: { value: 100, suffix: "%", label: "Compliance" }, capabilities: ["Checklist DPI", "Documentazione", "Formazione", "Reporting incidenti"], category: "compliance", sectors: ["trades", "construction"], connections: ["ghost-manager", "field-dispatcher"], features: [] },

  /* ═══ BEACH ═══ */
  { id: "beach-booker", name: "Beach Booker IA", role: "Prenotazioni Spiaggia", desc: "Mappa interattiva con disponibilità real-time per ombrelloni.", whyNeed: "Ogni telefonata = 3 minuti persi.", icon: <Umbrella className="w-5 h-5" />, gradient: "from-cyan-500 to-blue-500", glow: "hsla(190,80%,55%,1)", stat: { value: 80, suffix: "%", label: "↓ Telefonate" }, capabilities: ["Mappa interattiva", "Booking 24/7", "Pagamento anticipato"], category: "operations", sectors: ["beach"], connections: ["concierge-ai", "dynamic-pricing"], features: [] },
  { id: "beach-bar-ai", name: "Beach Bar AI", role: "Ordini Spiaggia", desc: "Ordini food & drink direttamente dall'ombrellone via QR.", whyNeed: "Il 50% degli ospiti non va al bar per pigrizia.", icon: <Coffee className="w-5 h-5" />, gradient: "from-amber-400 to-yellow-500", glow: "hsla(40,90%,55%,1)", stat: { value: 50, suffix: "%", label: "↑ Ordini bar" }, capabilities: ["QR ordering", "Delivery ombrellone", "Menu digitale", "Pagamento integrato"], category: "sales", sectors: ["beach"], connections: ["beach-booker", "kitchen-commander"], features: [] },
  { id: "weather-guard", name: "Weather Guard", role: "Meteo & Alert", desc: "Previsioni meteo integrate con gestione automatica di aperture e chiusure.", whyNeed: "Condizioni meteo impreviste = danni e reclami.", icon: <Wind className="w-5 h-5" />, gradient: "from-sky-400 to-blue-500", glow: "hsla(200,75%,55%,1)", stat: { value: 0, suffix: "", label: "Sorprese meteo" }, capabilities: ["Previsioni integrate", "Alert temporali", "Apertura/chiusura auto", "Notifiche clienti"], category: "operations", sectors: ["beach"], connections: ["ghost-manager", "beach-booker"], features: [] },

  /* ═══ RETAIL ═══ */
  { id: "stock-intelligence", name: "Stock Intelligence", role: "Inventario Predittivo", desc: "Monitora scorte e prevede la domanda con riordino automatico.", whyNeed: "Ogni prodotto esaurito = vendita persa.", icon: <Package className="w-5 h-5" />, gradient: "from-cyan-500 to-blue-500", glow: "hsla(200,75%,55%,1)", stat: { value: 0, suffix: "", label: "Rotture stock" }, capabilities: ["Alert scorte", "Riordino auto", "Previsione domanda"], category: "operations", sectors: ["retail"], connections: ["predictive-engine", "ghost-manager"], features: [] },
  { id: "shelf-optimizer", name: "Shelf Optimizer", role: "Layout Scaffali IA", desc: "Analizza vendite per posizione e suggerisce layout ottimali.", whyNeed: "Il posizionamento influenza il 30% delle vendite.", icon: <Store className="w-5 h-5" />, gradient: "from-indigo-400 to-violet-500", glow: "hsla(250,70%,55%,1)", stat: { value: 22, suffix: "%", label: "↑ Vendite/mq" }, capabilities: ["Heatmap vendite", "Layout ottimale", "A/B scaffali"], category: "analytics", sectors: ["retail"], connections: ["stock-intelligence", "predictive-engine"], features: [] },
  { id: "cashier-ai", name: "Cashier AI", role: "Cassa Intelligente", desc: "POS con suggerimenti upselling, sconti automatici e fidelizzazione.", whyNeed: "Ogni transazione è un'occasione di vendita persa.", icon: <CreditCard className="w-5 h-5" />, gradient: "from-green-500 to-emerald-500", glow: "hsla(150,65%,50%,1)", stat: { value: 15, suffix: "%", label: "↑ Scontrino" }, capabilities: ["Upselling cassa", "Sconti auto", "Fidelity integrata", "Analytics real-time"], category: "sales", sectors: ["retail"], connections: ["stock-intelligence", "loyalty-angel"], features: [] },
  { id: "visual-merchandiser", name: "Visual Merchandiser", role: "Vetrina IA", desc: "Suggerisce allestimenti vetrina basati su trend, stagione e stock.", whyNeed: "La vetrina è il primo venditore del negozio.", icon: <Eye className="w-5 h-5" />, gradient: "from-pink-400 to-rose-500", glow: "hsla(345,75%,55%,1)", stat: { value: 35, suffix: "%", label: "↑ Foot traffic" }, capabilities: ["Trend analysis", "Layout stagionale", "Rotazione prodotti", "A/B vetrine"], category: "content", sectors: ["retail"], connections: ["shelf-optimizer", "social-creator"], features: [] },

  /* ═══ LEGAL & ACCOUNTING ═══ */
  { id: "doc-analyzer", name: "Doc Analyzer IA", role: "Analisi Documenti", desc: "Legge contratti, estrae dati chiave e segnala clausole critiche.", whyNeed: "Leggere documenti manualmente richiede ore.", icon: <Scale className="w-5 h-5" />, gradient: "from-slate-500 to-gray-600", glow: "hsla(220,20%,50%,1)", stat: { value: 30, suffix: "s", label: "Per documento" }, capabilities: ["OCR intelligente", "Estrazione dati", "Alert clausole"], category: "operations", sectors: ["legal", "accounting"], connections: ["invoice-ai", "ghost-manager"], features: [] },
  { id: "contract-builder", name: "Contract Builder", role: "Generatore Contratti", desc: "Genera contratti personalizzati da template con clausole IA.", whyNeed: "Un contratto mal scritto è una causa in tribunale.", icon: <FileText className="w-5 h-5" />, gradient: "from-indigo-500 to-blue-600", glow: "hsla(230,70%,55%,1)", stat: { value: 5, suffix: "min", label: "Per contratto" }, capabilities: ["Template IA", "Clausole smart", "Firma digitale", "Archiviazione"], category: "operations", sectors: ["legal"], connections: ["doc-analyzer", "data-guardian"], features: [] },
  { id: "tax-advisor", name: "Tax Advisor IA", role: "Consulente Fiscale", desc: "Suggerisce ottimizzazioni fiscali e calcola scadenze tributarie.", whyNeed: "Ogni scadenza mancata = sanzione.", icon: <Calculator className="w-5 h-5" />, gradient: "from-emerald-500 to-teal-600", glow: "hsla(160,70%,45%,1)", stat: { value: 0, suffix: "", label: "Scadenze mancate" }, capabilities: ["Scadenze fiscali", "Ottimizzazione F24", "Bilancio previsionale", "Alert IVA"], category: "compliance", sectors: ["accounting", "legal"], connections: ["invoice-ai", "doc-analyzer"], features: [] },

  /* ═══ CONSTRUCTION ═══ */
  { id: "site-monitor", name: "Site Monitor IA", role: "Monitoraggio Cantiere", desc: "Traccia avanzamento lavori, materiali e sicurezza.", whyNeed: "Cantieri senza controllo generano ritardi.", icon: <Hammer className="w-5 h-5" />, gradient: "from-orange-600 to-amber-600", glow: "hsla(25,85%,50%,1)", stat: { value: 35, suffix: "%", label: "↓ Ritardi" }, capabilities: ["Gantt automatico", "Tracking materiali", "Sicurezza cantiere"], category: "operations", sectors: ["construction"], connections: ["field-dispatcher", "quote-builder"], features: [] },
  { id: "bim-assistant", name: "BIM Assistant", role: "Assistente BIM", desc: "Integra modelli BIM con gestione cantiere e documentazione.", whyNeed: "Il BIM riduce gli errori di costruzione del 40%.", icon: <Building className="w-5 h-5" />, gradient: "from-blue-600 to-indigo-600", glow: "hsla(230,75%,50%,1)", stat: { value: 40, suffix: "%", label: "↓ Errori" }, capabilities: ["Modelli 3D", "Clash detection", "Documentazione auto", "Computi metrici"], category: "operations", sectors: ["construction"], connections: ["site-monitor", "doc-analyzer"], features: [] },

  /* ═══ VETERINARY ═══ */
  { id: "pet-care-ai", name: "Pet Care AI", role: "Assistente Veterinario", desc: "Gestisce cartelle cliniche animali, vaccinazioni e reminder.", whyNeed: "Dimenticare un richiamo è pericoloso.", icon: <Dog className="w-5 h-5" />, gradient: "from-green-500 to-teal-500", glow: "hsla(155,70%,50%,1)", stat: { value: 0, suffix: "", label: "Richiami persi" }, capabilities: ["Cartelle cliniche", "Vaccinazioni auto", "Reminder richiami"], category: "operations", sectors: ["veterinary"], connections: ["smart-agenda", "concierge-ai"], features: [] },
  { id: "pet-nutrition", name: "Pet Nutrition AI", role: "Nutrizione Animale", desc: "Piani alimentari personalizzati per ogni animale in base a razza e patologie.", whyNeed: "L'alimentazione sbagliata causa il 60% delle patologie.", icon: <Utensils className="w-5 h-5" />, gradient: "from-lime-400 to-green-500", glow: "hsla(100,65%,50%,1)", stat: { value: 60, suffix: "%", label: "↓ Patologie" }, capabilities: ["Diete personalizzate", "Integratori suggeriti", "Allergie animali", "Monitoraggio peso"], category: "operations", sectors: ["veterinary"], connections: ["pet-care-ai", "pharma-stock"], features: [] },

  /* ═══ EDUCATION & CHILDCARE ═══ */
  { id: "class-manager", name: "Class Manager IA", role: "Gestione Corsi", desc: "Organizza classi, turni insegnanti e comunicazioni genitori.", whyNeed: "Gestire classi manualmente spreca 3h/giorno.", icon: <GraduationCap className="w-5 h-5" />, gradient: "from-blue-400 to-indigo-500", glow: "hsla(225,70%,55%,1)", stat: { value: 3, suffix: "h/g", label: "Risparmiate" }, capabilities: ["Gestione classi", "Presenze digitali", "Comunicazioni genitori"], category: "operations", sectors: ["education", "childcare"], connections: ["smart-agenda", "concierge-ai"], features: [] },
  { id: "elearning-ai", name: "E-Learning AI", role: "Formazione Online", desc: "Crea corsi online, quiz e certificazioni con IA generativa.", whyNeed: "Creare un corso richiede settimane, non più.", icon: <BookOpen className="w-5 h-5" />, gradient: "from-purple-400 to-indigo-500", glow: "hsla(260,70%,55%,1)", stat: { value: 10, suffix: "×", label: "Più veloce" }, capabilities: ["Corsi generati IA", "Quiz automatici", "Certificazioni", "Progress tracking"], category: "content", sectors: ["education"], connections: ["class-manager", "social-creator"], features: [] },
  { id: "parent-portal", name: "Parent Portal", role: "Portale Genitori", desc: "Comunicazioni, pagamenti, presenze e diario giornaliero per i genitori.", whyNeed: "I genitori vogliono trasparenza totale.", icon: <Baby className="w-5 h-5" />, gradient: "from-pink-400 to-rose-500", glow: "hsla(345,75%,55%,1)", stat: { value: 100, suffix: "%", label: "Trasparenza" }, capabilities: ["Diario giornaliero", "Foto & video", "Pagamenti online", "Chat sicura"], category: "concierge", sectors: ["childcare"], connections: ["class-manager", "payment-hub"], features: [] },

  /* ═══ EVENTS ═══ */
  { id: "event-orchestrator", name: "Event Orchestrator", role: "Gestione Eventi IA", desc: "Coordina logistica eventi: timeline, fornitori, ospiti e budget.", whyNeed: "Un evento mal organizzato distrugge la reputazione.", icon: <PartyPopper className="w-5 h-5" />, gradient: "from-pink-500 to-purple-500", glow: "hsla(300,70%,55%,1)", stat: { value: 100, suffix: "%", label: "On-Time" }, capabilities: ["Timeline automatica", "Gestione fornitori", "Budget tracker"], category: "operations", sectors: ["events"], connections: ["ghost-manager", "concierge-ai"], features: [] },
  { id: "ticketing-ai", name: "Ticketing AI", role: "Biglietteria Smart", desc: "Vendita biglietti online con pricing dinamico e anti-frode.", whyNeed: "Biglietteria manuale perde il 30% delle vendite.", icon: <CreditCard className="w-5 h-5" />, gradient: "from-violet-500 to-purple-600", glow: "hsla(265,75%,55%,1)", stat: { value: 30, suffix: "%", label: "↑ Vendite" }, capabilities: ["E-ticketing", "Dynamic pricing", "Anti-frode", "Check-in QR"], category: "sales", sectors: ["events"], connections: ["event-orchestrator", "dynamic-pricing"], features: [] },
  { id: "catering-planner", name: "Catering Planner", role: "Pianificazione Catering", desc: "Gestisce menu, quantità, allergeni e logistica per eventi.", whyNeed: "Catering mal pianificato = spreco e insoddisfazione.", icon: <ChefHat className="w-5 h-5" />, gradient: "from-orange-400 to-amber-500", glow: "hsla(35,85%,55%,1)", stat: { value: 0, suffix: "", label: "Sprechi" }, capabilities: ["Menu eventi", "Calcolo porzioni", "Allergeni auto", "Logistica integrata"], category: "operations", sectors: ["events"], connections: ["chef-intelligence", "event-orchestrator"], features: [] },

  /* ═══ LOGISTICS ═══ */
  { id: "route-optimizer", name: "Route Optimizer IA", role: "Ottimizzazione Consegne", desc: "Calcola percorsi ottimali per flotte di consegna.", whyNeed: "Percorsi non ottimizzati sprecano il 25% del carburante.", icon: <Truck className="w-5 h-5" />, gradient: "from-blue-600 to-cyan-600", glow: "hsla(200,75%,50%,1)", stat: { value: 25, suffix: "%", label: "↓ Carburante" }, capabilities: ["Routing multipoint", "Ottimizzazione carburante", "ETA predittiva"], category: "operations", sectors: ["logistics"], connections: ["fleet-ai", "ghost-manager"], features: [] },
  { id: "warehouse-ai", name: "Warehouse AI", role: "Gestione Magazzino", desc: "Ottimizza picking, stoccaggio e inventario con IA.", whyNeed: "Un magazzino caotico raddoppia i tempi di evasione.", icon: <Warehouse className="w-5 h-5" />, gradient: "from-slate-500 to-gray-600", glow: "hsla(220,25%,50%,1)", stat: { value: 50, suffix: "%", label: "↓ Tempi picking" }, capabilities: ["Picking ottimizzato", "Stoccaggio smart", "Inventario live", "Barcode scanner"], category: "operations", sectors: ["logistics", "retail"], connections: ["stock-intelligence", "route-optimizer"], features: [] },
  { id: "last-mile-ai", name: "Last Mile AI", role: "Ultimo Miglio", desc: "Ottimizza le consegne dell'ultimo miglio con tracking live.", whyNeed: "L'ultimo miglio è il 53% del costo logistico.", icon: <MapPin className="w-5 h-5" />, gradient: "from-green-500 to-teal-500", glow: "hsla(160,65%,50%,1)", stat: { value: 53, suffix: "%", label: "↓ Costi" }, capabilities: ["Tracking live", "Proof of delivery", "Ottimizzazione percorsi", "Notifiche cliente"], category: "operations", sectors: ["logistics"], connections: ["route-optimizer", "concierge-ai"], features: [] },

  /* ═══ CLEANING ═══ */
  { id: "clean-scheduler", name: "Clean Scheduler IA", role: "Pianificazione Pulizie", desc: "Organizza turni pulizia con percorsi e priorità ottimizzate.", whyNeed: "Turni manuali creano zone dimenticate.", icon: <Droplets className="w-5 h-5" />, gradient: "from-cyan-400 to-sky-500", glow: "hsla(195,80%,55%,1)", stat: { value: 100, suffix: "%", label: "Copertura" }, capabilities: ["Turni ottimizzati", "Checklist aree", "Report qualità"], category: "operations", sectors: ["cleaning"], connections: ["ghost-manager", "field-dispatcher"], features: [] },
  { id: "quality-check", name: "Quality Check AI", role: "Controllo Qualità", desc: "Verifica pulizie con foto, rating e feedback automatico.", whyNeed: "Senza controllo qualità i reclami aumentano.", icon: <ClipboardCheck className="w-5 h-5" />, gradient: "from-green-400 to-emerald-500", glow: "hsla(145,65%,50%,1)", stat: { value: 0, suffix: "", label: "Reclami" }, capabilities: ["Foto verifica", "Rating zone", "Feedback cliente", "Report trend"], category: "compliance", sectors: ["cleaning"], connections: ["clean-scheduler", "ghost-manager"], features: [] },

  /* ═══ PHOTOGRAPHY ═══ */
  { id: "photo-studio-ai", name: "Photo Studio IA", role: "Assistente Fotografo", desc: "Gestisce sessioni, editing automatico e consegna gallerie.", whyNeed: "Post-produzione manuale ruba il 50% del tempo.", icon: <Camera className="w-5 h-5" />, gradient: "from-pink-500 to-rose-600", glow: "hsla(345,75%,55%,1)", stat: { value: 50, suffix: "%", label: "↓ Post-prod" }, capabilities: ["Editing IA batch", "Gallerie online", "Booking sessioni"], category: "operations", sectors: ["photography"], connections: ["smart-agenda", "social-creator"], features: [] },
  { id: "video-editor-ai", name: "Video Editor AI", role: "Montaggio Video", desc: "Montaggio automatico video con musica, titoli e color grading.", whyNeed: "Il video è il formato più richiesto dai clienti.", icon: <Clapperboard className="w-5 h-5" />, gradient: "from-red-500 to-orange-500", glow: "hsla(15,80%,55%,1)", stat: { value: 10, suffix: "×", label: "Più veloce" }, capabilities: ["Montaggio auto", "Color grading IA", "Musica royalty-free", "Export multi-formato"], category: "content", sectors: ["photography", "events"], connections: ["photo-studio-ai", "social-creator"], features: [] },

  /* ═══ AGRITURISMO ═══ */
  { id: "farm-manager", name: "Farm Manager IA", role: "Gestione Agriturismo", desc: "Combina camere, ristorante, attività e produzione agricola.", whyNeed: "Un agriturismo ha 4 business in 1.", icon: <Leaf className="w-5 h-5" />, gradient: "from-green-500 to-lime-500", glow: "hsla(120,65%,50%,1)", stat: { value: 4, suffix: " in 1", label: "Business" }, capabilities: ["Camere + ristorante", "Attività esperienziali", "Vendita prodotti"], category: "operations", sectors: ["agriturismo"], connections: ["revenue-manager", "chef-intelligence", "concierge-ai"], features: [] },
  { id: "harvest-tracker", name: "Harvest Tracker", role: "Tracciamento Raccolto", desc: "Monitora colture, stagionalità e produzione per la vendita diretta.", whyNeed: "Sapere cosa hai in campo = zero sprechi.", icon: <TreePine className="w-5 h-5" />, gradient: "from-lime-500 to-green-600", glow: "hsla(110,70%,45%,1)", stat: { value: 30, suffix: "%", label: "↓ Sprechi" }, capabilities: ["Calendario colture", "Previsione raccolto", "Vendita diretta", "Tracciabilità km0"], category: "operations", sectors: ["agriturismo"], connections: ["farm-manager", "stock-intelligence"], features: [] },

  /* ═══ TATTOO ═══ */
  { id: "tattoo-designer", name: "Tattoo Designer IA", role: "Design Tatuaggi", desc: "Genera bozzetti tattoo da descrizioni testuali con stili personalizzabili.", whyNeed: "I clienti vogliono vedere il design prima di prenotare.", icon: <PenTool className="w-5 h-5" />, gradient: "from-gray-600 to-zinc-700", glow: "hsla(0,0%,40%,1)", stat: { value: 60, suffix: "s", label: "Per bozzetto" }, capabilities: ["Generazione bozzetti", "Stili multipli", "Preview su corpo", "Archivio design"], category: "content", sectors: ["tattoo"], connections: ["smart-agenda", "social-creator"], features: [] },
  { id: "aftercare-ai", name: "Aftercare AI", role: "Cura Post-Tattoo", desc: "Invia istruzioni di cura personalizzate e reminder follow-up.", whyNeed: "Un tattoo mal curato = reclamo e ritocco gratuito.", icon: <ShieldCheck className="w-5 h-5" />, gradient: "from-teal-400 to-cyan-500", glow: "hsla(180,70%,50%,1)", stat: { value: 0, suffix: "", label: "Ritocchi gratis" }, capabilities: ["Istruzioni personalizzate", "Reminder cura", "Follow-up foto", "Garanzia digitale"], category: "operations", sectors: ["tattoo"], connections: ["concierge-ai", "smart-agenda"], features: [] },

  /* ═══ COWORKING ═══ */
  { id: "space-manager", name: "Space Manager IA", role: "Gestione Spazi", desc: "Prenotazione scrivanie, sale riunioni e gestione accessi.", whyNeed: "Spazi mal gestiti = clienti insoddisfatti.", icon: <Building className="w-5 h-5" />, gradient: "from-indigo-400 to-blue-500", glow: "hsla(225,70%,55%,1)", stat: { value: 90, suffix: "%", label: "Occupazione" }, capabilities: ["Booking scrivanie", "Sale riunioni", "Accessi smart", "Fatturazione auto"], category: "operations", sectors: ["coworking"], connections: ["concierge-ai", "payment-hub"], features: [] },
  { id: "community-ai", name: "Community AI", role: "Networking Coworker", desc: "Facilita connessioni tra coworker basate su competenze e interessi.", whyNeed: "La community è il valore #1 di un coworking.", icon: <Users className="w-5 h-5" />, gradient: "from-violet-400 to-purple-500", glow: "hsla(270,65%,55%,1)", stat: { value: 3, suffix: "×", label: "Networking" }, capabilities: ["Matching competenze", "Eventi community", "Board annunci", "Chat gruppi"], category: "concierge", sectors: ["coworking"], connections: ["space-manager", "event-orchestrator"], features: [] },

  /* ═══ PHARMACY ═══ */
  { id: "rx-manager", name: "RX Manager", role: "Gestione Ricette", desc: "Gestisce ricette elettroniche, disponibilità farmaci e prenotazioni.", whyNeed: "Code in farmacia = clienti persi.", icon: <Pill className="w-5 h-5" />, gradient: "from-green-500 to-emerald-600", glow: "hsla(150,70%,45%,1)", stat: { value: 70, suffix: "%", label: "↓ Attese" }, capabilities: ["Ricette elettroniche", "Disponibilità real-time", "Prenotazione farmaci", "Reminder terapie"], category: "operations", sectors: ["pharmacy"], connections: ["pharma-stock", "concierge-ai"], features: [] },

  /* ═══ MUSIC & ENTERTAINMENT ═══ */
  { id: "booking-agent", name: "Booking Agent IA", role: "Prenotazione Artisti", desc: "Gestisce calendario artisti, rider tecnici e contratti.", whyNeed: "Gestire booking manualmente perde il 40% delle opportunità.", icon: <Music className="w-5 h-5" />, gradient: "from-purple-500 to-pink-500", glow: "hsla(300,70%,55%,1)", stat: { value: 40, suffix: "%", label: "↑ Booking" }, capabilities: ["Calendario artisti", "Rider tecnici", "Contratti auto", "Pagamenti split"], category: "operations", sectors: ["entertainment"], connections: ["event-orchestrator", "invoice-ai"], features: [] },

  /* ═══ TRAVEL & TOURISM ═══ */
  { id: "tour-planner", name: "Tour Planner IA", role: "Pianificazione Tour", desc: "Crea itinerari personalizzati con trasporti, hotel e attività.", whyNeed: "Tour personalizzati vendono il 50% in più.", icon: <Plane className="w-5 h-5" />, gradient: "from-sky-500 to-blue-600", glow: "hsla(210,80%,55%,1)", stat: { value: 50, suffix: "%", label: "↑ Vendite" }, capabilities: ["Itinerari IA", "Booking integrato", "Transfer auto", "Multilingue"], category: "sales", sectors: ["tourism"], connections: ["concierge-ai", "smart-dispatcher"], features: [] },
  { id: "excursion-ai", name: "Excursion AI", role: "Gestione Escursioni", desc: "Prenotazione escursioni, guide e attività outdoor.", whyNeed: "Le escursioni sono il margine più alto del turismo.", icon: <Anchor className="w-5 h-5" />, gradient: "from-teal-500 to-cyan-600", glow: "hsla(180,70%,50%,1)", stat: { value: 45, suffix: "%", label: "Margine" }, capabilities: ["Booking escursioni", "Guide multilingue", "Meteo integrato", "Gruppo management"], category: "operations", sectors: ["tourism"], connections: ["tour-planner", "weather-guard"], features: [] },

  /* ═══ FASHION ═══ */
  { id: "style-advisor", name: "Style Advisor IA", role: "Personal Shopper", desc: "Suggerisce outfit e accessori basati su preferenze e trend.", whyNeed: "Il personal shopping aumenta lo scontrino del 45%.", icon: <Shirt className="w-5 h-5" />, gradient: "from-rose-400 to-pink-500", glow: "hsla(345,75%,55%,1)", stat: { value: 45, suffix: "%", label: "↑ Scontrino" }, capabilities: ["Outfit suggestions", "Trend analysis", "Taglia smart", "Wishlist IA"], category: "sales", sectors: ["fashion"], connections: ["visual-merchandiser", "loyalty-angel"], features: [] },
  { id: "size-predictor", name: "Size Predictor", role: "Predizione Taglie", desc: "Predice la taglia corretta riducendo resi e insoddisfazione.", whyNeed: "Il 30% dei resi è per taglia sbagliata.", icon: <Glasses className="w-5 h-5" />, gradient: "from-indigo-400 to-violet-500", glow: "hsla(250,70%,55%,1)", stat: { value: 30, suffix: "%", label: "↓ Resi" }, capabilities: ["Predizione taglia", "Storico clienti", "Comparazione brand", "Virtual try-on"], category: "analytics", sectors: ["fashion"], connections: ["style-advisor", "stock-intelligence"], features: [] },

  /* ═══ JEWELRY ═══ */
  { id: "gem-advisor", name: "Gem Advisor IA", role: "Consulente Gioielli", desc: "Suggerisce gioielli per occasione, budget e stile personale.", whyNeed: "L'acquisto di gioielli è emotivo — serve guida.", icon: <Gem className="w-5 h-5" />, gradient: "from-yellow-400 to-amber-500", glow: "hsla(45,85%,55%,1)", stat: { value: 40, suffix: "%", label: "↑ Conversione" }, capabilities: ["Suggerimenti occasione", "Budget advisor", "Personalizzazione", "Certificazioni"], category: "sales", sectors: ["jewelry"], connections: ["concierge-ai", "loyalty-angel"], features: [] },

  /* ═══ PET GROOMING ═══ */
  { id: "grooming-ai", name: "Grooming AI", role: "Toelettatura Smart", desc: "Gestisce prenotazioni, schede animali e suggerimenti per razza.", whyNeed: "Ogni razza ha esigenze diverse di toelettatura.", icon: <Dog className="w-5 h-5" />, gradient: "from-amber-400 to-orange-500", glow: "hsla(30,85%,55%,1)", stat: { value: 100, suffix: "%", label: "Per razza" }, capabilities: ["Schede per razza", "Prenotazioni", "Storico trattamenti", "Prodotti suggeriti"], category: "operations", sectors: ["pet-grooming"], connections: ["smart-agenda", "concierge-ai"], features: [] },

  /* ═══ SPA & THERMAL ═══ */
  { id: "spa-journey", name: "Spa Journey IA", role: "Percorso Benessere", desc: "Crea percorsi spa personalizzati con tempistiche e abbinamenti.", whyNeed: "Un percorso ben costruito raddoppia il tempo di permanenza.", icon: <Sparkles className="w-5 h-5" />, gradient: "from-purple-400 to-violet-500", glow: "hsla(270,70%,55%,1)", stat: { value: 2, suffix: "×", label: "Permanenza" }, capabilities: ["Percorsi personalizzati", "Timing ottimale", "Abbinamenti trattamenti", "Upgrade auto"], category: "operations", sectors: ["spa"], connections: ["smart-agenda", "beauty-advisor"], features: [] },

  /* ═══ REAL ESTATE ═══ */
  { id: "property-matcher", name: "Property Matcher", role: "Matching Immobili", desc: "Abbina acquirenti a immobili basandosi su preferenze e budget.", whyNeed: "Il matching manuale spreca settimane.", icon: <Building className="w-5 h-5" />, gradient: "from-slate-500 to-gray-600", glow: "hsla(220,25%,50%,1)", stat: { value: 70, suffix: "%", label: "Match rate" }, capabilities: ["Matching IA", "Virtual tour", "Comparazione", "Alert nuovi immobili"], category: "sales", sectors: ["real-estate"], connections: ["concierge-ai", "doc-analyzer"], features: [] },
  { id: "virtual-tour-ai", name: "Virtual Tour AI", role: "Tour Virtuali", desc: "Crea tour virtuali interattivi degli immobili con IA.", whyNeed: "Il 70% degli acquirenti inizia la ricerca online.", icon: <Video className="w-5 h-5" />, gradient: "from-blue-500 to-cyan-500", glow: "hsla(200,70%,55%,1)", stat: { value: 3, suffix: "×", label: "Visite" }, capabilities: ["Tour 360°", "Staging virtuale", "Planimetrie IA", "Condivisione link"], category: "content", sectors: ["real-estate"], connections: ["property-matcher", "social-creator"], features: [] },

  /* ═══ BIKE & MOBILITY ═══ */
  { id: "bike-rental-ai", name: "Bike Rental AI", role: "Noleggio Bici/Scooter", desc: "Gestisce flotta, prenotazioni e manutenzione mezzi leggeri.", whyNeed: "Il noleggio senza sistema perde il 30% dei ricavi.", icon: <Bike className="w-5 h-5" />, gradient: "from-lime-500 to-green-500", glow: "hsla(100,70%,50%,1)", stat: { value: 30, suffix: "%", label: "↑ Ricavi" }, capabilities: ["Booking online", "Tracking GPS", "Manutenzione auto", "Pricing dinamico"], category: "operations", sectors: ["mobility"], connections: ["dynamic-pricing", "concierge-ai"], features: [] },

  /* ═══ PRINTING ═══ */
  { id: "print-manager", name: "Print Manager IA", role: "Gestione Stampa", desc: "Gestisce ordini stampa, preventivi automatici e tracking produzione.", whyNeed: "Ordini stampa mal gestiti = ritardi e resi.", icon: <Printer className="w-5 h-5" />, gradient: "from-gray-500 to-slate-600", glow: "hsla(220,20%,50%,1)", stat: { value: 0, suffix: "", label: "Ritardi" }, capabilities: ["Preventivi auto", "Tracking produzione", "File check IA", "Consegna tracking"], category: "operations", sectors: ["printing"], connections: ["invoice-ai", "ghost-manager"], features: [] },

  /* ═══ ENERGY ═══ */
  { id: "energy-monitor", name: "Energy Monitor IA", role: "Monitoraggio Energetico", desc: "Monitora consumi, suggerisce risparmi e gestisce pannelli solari.", whyNeed: "L'energia è il 20% dei costi operativi.", icon: <Plug className="w-5 h-5" />, gradient: "from-yellow-500 to-amber-600", glow: "hsla(40,85%,55%,1)", stat: { value: 20, suffix: "%", label: "↓ Consumi" }, capabilities: ["Monitor real-time", "Suggerimenti risparmio", "Gestione solare", "Report CO2"], category: "analytics", sectors: ["energy"], connections: ["predictive-engine", "ghost-manager"], features: [] },
];

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
  { id: "construction", label: "Edilizia", icon: <Hammer className="w-3 h-3" /> },
  { id: "legal", label: "Legale", icon: <Scale className="w-3 h-3" /> },
  { id: "accounting", label: "Contabilità", icon: <Calculator className="w-3 h-3" /> },
  { id: "veterinary", label: "Veterinario", icon: <Dog className="w-3 h-3" /> },
  { id: "events", label: "Eventi", icon: <PartyPopper className="w-3 h-3" /> },
  { id: "logistics", label: "Logistica", icon: <Truck className="w-3 h-3" /> },
  { id: "education", label: "Formazione", icon: <GraduationCap className="w-3 h-3" /> },
  { id: "childcare", label: "Infanzia", icon: <Baby className="w-3 h-3" /> },
  { id: "photography", label: "Fotografia", icon: <Camera className="w-3 h-3" /> },
  { id: "agriturismo", label: "Agriturismo", icon: <Leaf className="w-3 h-3" /> },
  { id: "cleaning", label: "Pulizie", icon: <Droplets className="w-3 h-3" /> },
  { id: "tattoo", label: "Tattoo", icon: <PenTool className="w-3 h-3" /> },
  { id: "coworking", label: "Coworking", icon: <Building className="w-3 h-3" /> },
  { id: "pharmacy", label: "Farmacia", icon: <Pill className="w-3 h-3" /> },
  { id: "tourism", label: "Turismo", icon: <Plane className="w-3 h-3" /> },
  { id: "fashion", label: "Fashion", icon: <Shirt className="w-3 h-3" /> },
  { id: "jewelry", label: "Gioielleria", icon: <Gem className="w-3 h-3" /> },
  { id: "pet-grooming", label: "Toelettatura", icon: <Dog className="w-3 h-3" /> },
  { id: "spa", label: "Spa", icon: <Sparkles className="w-3 h-3" /> },
  { id: "real-estate", label: "Immobiliare", icon: <Building className="w-3 h-3" /> },
  { id: "mobility", label: "Mobilità", icon: <Bike className="w-3 h-3" /> },
  { id: "entertainment", label: "Spettacolo", icon: <Music className="w-3 h-3" /> },
  { id: "printing", label: "Stampa", icon: <Printer className="w-3 h-3" /> },
  { id: "energy", label: "Energia", icon: <Plug className="w-3 h-3" /> },
  { id: "bakery", label: "Bakery", icon: <ChefHat className="w-3 h-3" /> },
];

const TOTAL_AGENTS_COUNT = ALL_AGENTS.length;
const INITIAL_VISIBLE = 16;

/* ═══ ALWAYS-ON SVG NETWORK LINES ═══ */
const AlwaysOnNetwork = ({
  agents,
  activeId,
  containerRef,
}: {
  agents: AgentNode[];
  activeId: string | null;
  containerRef: React.RefObject<HTMLDivElement>;
}) => {
  const [lines, setLines] = useState<{
    x1: number; y1: number; x2: number; y2: number;
    color: string; id: string; isActive: boolean;
  }[]>([]);
  const frameRef = useRef(0);

  const compute = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const processed = new Set<string>();
    const newLines: typeof lines = [];

    agents.forEach((agent) => {
      const el = c.querySelector(`[data-agent-id="${agent.id}"]`);
      if (!el) return;
      const aRect = el.getBoundingClientRect();
      const ax = aRect.left + aRect.width / 2 - rect.left;
      const ay = aRect.top + aRect.height / 2 - rect.top;

      agent.connections.forEach((connId) => {
        const pairKey = [agent.id, connId].sort().join("-");
        if (processed.has(pairKey)) return;
        const connAgent = agents.find((a) => a.id === connId);
        if (!connAgent) return;
        const connEl = c.querySelector(`[data-agent-id="${connId}"]`);
        if (!connEl) return;
        processed.add(pairKey);

        const bRect = connEl.getBoundingClientRect();
        const bx = bRect.left + bRect.width / 2 - rect.left;
        const by = bRect.top + bRect.height / 2 - rect.top;

        const isActive = activeId === agent.id || activeId === connId;
        newLines.push({
          x1: ax, y1: ay, x2: bx, y2: by,
          color: isActive && activeId === agent.id ? agent.glow : isActive ? connAgent.glow : "hsla(265,50%,60%,0.35)",
          id: pairKey,
          isActive,
        });
      });
    });
    setLines(newLines);
  }, [agents, activeId, containerRef]);

  useEffect(() => {
    compute();
    const t1 = setTimeout(compute, 150);
    const t2 = setTimeout(compute, 500);
    const onResize = () => { cancelAnimationFrame(frameRef.current); frameRef.current = requestAnimationFrame(compute); };
    window.addEventListener("resize", onResize);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("resize", onResize); cancelAnimationFrame(frameRef.current); };
  }, [compute]);

  if (!lines.length) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible", zIndex: 1 }}>
      <defs>
        <filter id="line-glow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feFlood floodColor="hsl(215 60% 60%)" floodOpacity="0.25" result="flood" />
          <feComposite in="flood" in2="blur" operator="in" result="colorBlur" />
          <feMerge>
            <feMergeNode in="colorBlur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="line-glow-soft">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="particle-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="hsl(200 80% 70%)" floodOpacity="0.4" result="flood" />
          <feComposite in="flood" in2="blur" operator="in" result="colorBlur" />
          <feMerge>
            <feMergeNode in="colorBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="line-gradient-idle" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(200 60% 60%)" stopOpacity="0.05" />
          <stop offset="30%" stopColor="hsl(215 60% 65%)" stopOpacity="0.4" />
          <stop offset="50%" stopColor="hsl(210 70% 72%)" stopOpacity="0.6" />
          <stop offset="70%" stopColor="hsl(215 60% 65%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(200 60% 60%)" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {lines.map((line, li) => {
        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;
        const mx = (line.x1 + line.x2) / 2 + dy * 0.15;
        const my = (line.y1 + line.y2) / 2 - dx * 0.15;
        const pathD = `M ${line.x1} ${line.y1} Q ${mx} ${my} ${line.x2} ${line.y2}`;
        const reversePath = `M ${line.x2} ${line.y2} Q ${mx} ${my} ${line.x1} ${line.y1}`;
        const isActive = line.isActive;

        /* ── Idle = cool cyber-blue, active = agent glow color ── */
        const lineOpacity = isActive ? 0.9 : 0.55;
        const lineWidth = isActive ? 2.8 : 1.5;
        const dash = isActive ? "12 3" : "5 4";
        const particleColor = isActive ? line.color : "hsla(200,70%,75%,0.85)";
        const lineColor = isActive ? line.color : "hsla(210,50%,65%,0.55)";
        const junctionR = isActive ? 4.5 : 3;
        const junctionOpacity = isActive ? 0.85 : 0.5;
        const particleDur = isActive ? "1.4s" : "4s";
        const particleR = isActive ? 4.5 : 2.8;
        const stagger = `${(li * 0.6) % 3}s`;

        return (
          <g key={line.id}>
            {/* Wide glow layer — always visible, professional shimmer */}
            <path d={pathD} fill="none" stroke={lineColor}
              strokeWidth={isActive ? 8 : 5}
              opacity={isActive ? 0.15 : 0.06}
              filter="url(#line-glow)" />

            {/* Main connection line — always visible, solid + professional */}
            <path d={pathD} fill="none" stroke={lineColor}
              strokeWidth={lineWidth}
              strokeDasharray={dash}
              opacity={lineOpacity}
              filter="url(#line-glow-soft)"
              strokeLinecap="round"
            />

            {/* Solid underline — gives permanence to idle connections */}
            {!isActive && (
              <path d={pathD} fill="none" stroke="url(#line-gradient-idle)"
                strokeWidth={0.6}
                opacity={0.6}
              />
            )}

            {/* Junction dots — always visible */}
            <circle cx={line.x1} cy={line.y1} r={junctionR}
              fill={lineColor} opacity={junctionOpacity} />
            <circle cx={line.x2} cy={line.y2} r={junctionR}
              fill={lineColor} opacity={junctionOpacity} />

            {/* Flowing particle — always animating, with tech glow */}
            <circle r={particleR} fill={particleColor}
              filter="url(#particle-glow)">
              <animateMotion dur={particleDur} repeatCount="indefinite" path={pathD} begin={stagger} />
            </circle>

            {/* Reverse particle — bidirectional data flow */}
            <circle r={isActive ? 3 : 1.8} fill={particleColor} opacity={isActive ? 0.6 : 0.4}>
              <animateMotion dur={isActive ? "2s" : "6s"} repeatCount="indefinite"
                path={reversePath} begin={`${(li * 0.9 + 1.2) % 4}s`} />
            </circle>

            {/* Third micro-particle — gives tech density */}
            <circle r={1} fill="hsla(200,80%,80%,0.5)" opacity={0.35}>
              <animateMotion dur={isActive ? "3s" : "8s"} repeatCount="indefinite"
                path={pathD} begin={`${(li * 1.3 + 0.7) % 5}s`} />
            </circle>

            {/* Extra particles on active — intense burst */}
            {isActive && (
              <>
                <circle r={1.8} fill="hsla(0,0%,100%,0.7)">
                  <animateMotion dur="2.8s" repeatCount="indefinite" path={pathD} begin="0.5s" />
                </circle>
                <circle r={1.2} fill={particleColor} opacity="0.4">
                  <animateMotion dur="3.2s" repeatCount="indefinite" path={reversePath} begin="1.1s" />
                </circle>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/* ═══ CIRCUIT GRID BACKGROUND — Advanced Tech ═══ */
const CircuitBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Hexagonal circuit pattern */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circuit-hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse" patternTransform="scale(1.8)">
          <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="hsl(215 50% 55%)" strokeWidth="0.4" />
          <circle cx="30" cy="0" r="1.2" fill="hsl(215 50% 55%)" opacity="0.5" />
          <circle cx="60" cy="15" r="1.2" fill="hsl(215 50% 55%)" opacity="0.5" />
          <circle cx="0" cy="15" r="1.2" fill="hsl(215 50% 55%)" opacity="0.5" />
        </pattern>
        {/* Micro-grid for tech density */}
        <pattern id="micro-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(215 40% 50%)" strokeWidth="0.15" opacity="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit-hex)" />
      <rect width="100%" height="100%" fill="url(#micro-grid)" opacity="0.3" />
    </svg>

    {/* Horizontal scan lines — tech feel */}
    {[0, 1, 2].map((i) => (
      <motion.div key={`h-${i}`} className="absolute left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent 5%, hsla(215,50%,60%,0.15) 30%, hsla(215,50%,70%,0.25) 50%, hsla(215,50%,60%,0.15) 70%, transparent 95%)` }}
        animate={{ top: ["-5%", "105%"] }}
        transition={{ duration: 12 + i * 4, repeat: Infinity, ease: "linear", delay: i * 3 }}
      />
    ))}

    {/* Vertical data streams */}
    {[12, 30, 50, 70, 88].map((x, i) => (
      <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px" style={{ left: `${x}%`, background: `hsla(215,40%,50%,0.04)` }}>
        <motion.div className="absolute h-24 w-full left-0 rounded-full"
          style={{ background: `linear-gradient(180deg, transparent, hsla(215,60%,65%,0.4), transparent)` }}
          animate={{ top: ["-15%", "115%"] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear", delay: i * 1.5 }}
        />
      </div>
    ))}

    {/* Data nodes — pulsing tech dots at intersections */}
    {[
      { x: 12, y: 20 }, { x: 30, y: 45 }, { x: 50, y: 15 }, { x: 70, y: 65 }, { x: 88, y: 35 },
      { x: 20, y: 75 }, { x: 60, y: 85 }, { x: 40, y: 55 },
    ].map((pos, i) => (
      <motion.div key={`node-${i}`} className="absolute w-1 h-1 rounded-full"
        style={{ left: `${pos.x}%`, top: `${pos.y}%`, background: `hsla(215,60%,65%,0.35)`, boxShadow: `0 0 6px hsla(215,60%,65%,0.2)` }}
        animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.8, 1.3, 0.8] }}
        transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
      />
    ))}

    {/* Ambient glow orbs */}
    <div className="absolute w-[600px] h-[600px] rounded-full blur-[250px] opacity-[0.05] top-1/4 left-1/4" style={{ background: "hsl(215 50% 50%)" }} />
    <div className="absolute w-[500px] h-[500px] rounded-full blur-[200px] opacity-[0.04] bottom-1/4 right-1/4" style={{ background: "hsl(225 40% 45%)" }} />
    <div className="absolute w-[300px] h-[300px] rounded-full blur-[150px] opacity-[0.03] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: "hsl(var(--primary))" }} />
  </div>
);

/* ═══ ROBOT AVATAR — gradient icon node with FULL CIRCUIT ═══ */
const RobotAvatar = ({ agent, size = 72, isActive, isConnected }: {
  agent: AgentNode; size?: number; isActive: boolean; isConnected: boolean;
}) => {
  const ringClass = isActive
    ? "ring-[3px] ring-primary shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
    : isConnected
      ? "ring-2 ring-primary/40 shadow-[0_0_15px_hsl(var(--primary)/0.15)]"
      : "ring-[1.5px] ring-foreground/15 group-hover:ring-primary/30 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)]";

  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${ringClass}`}
      style={{ width: size, height: size }}>
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-90`} />

      {/* Green tech glow background */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(circle at 50% 50%, hsla(150,60%,30%,0.25), transparent 80%)`,
      }} />

      {/* Clean single-path circuit overlay */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 60 60">
        {/* Simple orthogonal circuit — one clean path per icon */}
        <path d="M0,30 L18,30 L18,15 L42,15 L42,30 L60,30" fill="none" stroke="hsla(150,80%,65%,0.35)" strokeWidth="0.6" />
        <path d="M30,0 L30,20 M30,40 L30,60" fill="none" stroke="hsla(150,80%,65%,0.2)" strokeWidth="0.4" />
        
        {/* Junction nodes — only at intersections */}
        <circle cx="18" cy="30" r="1.5" fill="hsla(150,80%,65%,0.5)" />
        <circle cx="42" cy="30" r="1.5" fill="hsla(150,80%,65%,0.5)" />
        <circle cx="18" cy="15" r="1.2" fill="hsla(150,80%,65%,0.4)" />
        <circle cx="42" cy="15" r="1.2" fill="hsla(150,80%,65%,0.4)" />
        <circle cx="30" cy="20" r="1" fill="hsla(150,80%,65%,0.3)" />

        {/* Single clean data particle */}
        <circle r="1.2" fill="hsla(150,90%,70%,0.8)">
          <animateMotion dur={isActive ? "1.8s" : "3.5s"} repeatCount="indefinite"
            path="M0,30 L18,30 L18,15 L42,15 L42,30 L60,30" />
        </circle>
      </svg>

      {/* Inner glow */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(circle at 35% 35%, hsla(0,0%,100%,0.2), transparent 60%)`,
      }} />

      {/* Icon */}
      <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        {agent.icon}
      </div>

      {/* Bottom edge shine */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{
        background: `linear-gradient(90deg, transparent, hsla(0,0%,100%,0.4), transparent)`,
      }} />
    </div>
  );
};

/* ═══ NETWORK NODE ═══ */
const NetworkNode = ({
  agent, isActive, isConnected, onClick, index,
}: {
  agent: AgentNode; isActive: boolean; isConnected: boolean; onClick: () => void; index: number;
}) => {
  return (
    <motion.div
      layout
      layoutId={agent.id}
      onClick={onClick}
      className="group cursor-pointer relative flex flex-col items-center"
      data-agent-id={agent.id}
      style={{ zIndex: isActive ? 30 : isConnected ? 20 : 10 }}
      transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
    >
      {/* Outer circuit glow ring */}
      {(isActive || isConnected) && (
        <motion.div
          className="absolute rounded-xl pointer-events-none"
          style={{
            width: isActive ? 64 : 54,
            height: isActive ? 64 : 54,
            top: "50%", left: "50%", transform: "translate(-50%, -55%)",
            background: `radial-gradient(circle, ${agent.glow}18 0%, transparent 70%)`,
            boxShadow: isActive ? `0 0 30px ${agent.glow}20` : `0 0 15px ${agent.glow}12`,
          }}
          animate={isActive ? { scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] } : { opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Green tech circuit connector lines */}
      <svg className="absolute pointer-events-none z-[1]" style={{ width: 70, height: 70, top: "50%", left: "50%", transform: "translate(-50%, -55%)" }} viewBox="0 0 70 70">
        {/* Clean cardinal traces */}
        <line x1="0" y1="35" x2="10" y2="35" stroke={isActive ? "hsla(150,80%,55%,0.8)" : "hsla(150,60%,50%,0.2)"} strokeWidth="0.7" />
        <line x1="60" y1="35" x2="70" y2="35" stroke={isActive ? "hsla(150,80%,55%,0.8)" : "hsla(150,60%,50%,0.2)"} strokeWidth="0.7" />
        <line x1="35" y1="0" x2="35" y2="10" stroke={isActive ? "hsla(150,80%,55%,0.8)" : "hsla(150,60%,50%,0.2)"} strokeWidth="0.7" />
        <line x1="35" y1="60" x2="35" y2="70" stroke={isActive ? "hsla(150,80%,55%,0.8)" : "hsla(150,60%,50%,0.2)"} strokeWidth="0.7" />
        {/* Corner junction dots */}
        <circle cx="0" cy="35" r="1.2" fill={isActive ? "hsla(150,80%,55%,0.9)" : "hsla(150,60%,50%,0.25)"} />
        <circle cx="70" cy="35" r="1.2" fill={isActive ? "hsla(150,80%,55%,0.9)" : "hsla(150,60%,50%,0.25)"} />
        <circle cx="35" cy="0" r="1.2" fill={isActive ? "hsla(150,80%,55%,0.9)" : "hsla(150,60%,50%,0.25)"} />
        <circle cx="35" cy="70" r="1.2" fill={isActive ? "hsla(150,80%,55%,0.9)" : "hsla(150,60%,50%,0.25)"} />
      </svg>

      {/* Robot avatar node */}
      <div className="relative z-10 mb-1">
        <RobotAvatar agent={agent} size={38} isActive={isActive} isConnected={isConnected} />

        {/* Status pulse */}
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full z-20"
          style={{
            background: `radial-gradient(circle, hsla(160,80%,55%,1), hsla(160,80%,40%,1))`,
            boxShadow: "0 0 6px hsla(160,80%,55%,0.6)",
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.12 }}
        />

        {/* Stat badge */}
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 px-1 py-[1px] rounded-full text-[0.38rem] font-bold whitespace-nowrap z-20 border border-foreground/10"
          style={{ background: "hsla(var(--background) / 0.92)", backdropFilter: "blur(6px)", color: agent.glow }}>
          <Counter value={agent.stat.value} suffix={agent.stat.suffix} />{" "}
          <span className="text-foreground/60 text-[0.3rem]">{agent.stat.label}</span>
        </div>

        {/* Cardinal connection dots — green tech */}
        {(["top", "bottom", "left", "right"] as const).map((pos) => (
          <motion.div key={pos}
            className="absolute w-1 h-1 rounded-full z-20"
            style={{
              background: isActive || isConnected ? "hsla(150,80%,55%,0.9)" : "hsla(150,60%,50%,0.2)",
              boxShadow: isActive ? "0 0 6px hsla(150,80%,55%,0.7)" : "none",
              ...(pos === "top" ? { top: -1, left: "50%", marginLeft: -2 } : {}),
              ...(pos === "bottom" ? { bottom: -1, left: "50%", marginLeft: -2 } : {}),
              ...(pos === "left" ? { left: -1, top: "50%", marginTop: -2 } : {}),
              ...(pos === "right" ? { right: -1, top: "50%", marginTop: -2 } : {}),
            }}
            animate={isActive ? { scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: ["top", "right", "bottom", "left"].indexOf(pos) * 0.25 }}
          />
        ))}

        {/* Rotating orbit ring */}
        {isActive && (
          <motion.svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none" viewBox="0 0 100 100">
            <motion.rect x="2" y="2" width="96" height="96" rx="20" fill="none"
              stroke={agent.glow} strokeWidth="0.5"
              strokeDasharray="8 6" strokeLinecap="round"
              animate={{ strokeDashoffset: [0, -100] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </motion.svg>
        )}
      </div>

      {/* Name + role */}
      <div className="text-center max-w-[60px] sm:max-w-[100px]">
        <h3 className="font-bold text-[0.42rem] sm:text-[0.6rem] text-foreground leading-tight truncate">
          {agent.name}
        </h3>
        <p className="text-[0.32rem] sm:text-[0.44rem] text-primary/85 tracking-wider uppercase truncate leading-tight">
          {agent.role}
        </p>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT — SPATIAL NETWORK
   ═══════════════════════════════════════════ */
export function AIAgentsShowcase({ sector }: { sector?: string } = {}) {
  const sectionRef = useRef(null);
  const networkRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeSector, setActiveSector] = useState(sector || "all");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filteredAgents = useMemo(() => {
    const base = activeSector === "all" ? ALL_AGENTS : ALL_AGENTS.filter((a) => a.sectors.includes("all") || a.sectors.includes(activeSector));
    if (showAll || activeSector !== "all") return base;
    return base.slice(0, INITIAL_VISIBLE);
  }, [activeSector, showAll]);

  const totalFiltered = useMemo(() => {
    if (activeSector === "all") return ALL_AGENTS.length;
    return ALL_AGENTS.filter((a) => a.sectors.includes("all") || a.sectors.includes(activeSector)).length;
  }, [activeSector]);

  const activeAgent = useMemo(() => ALL_AGENTS.find((a) => a.id === expandedAgent), [expandedAgent]);
  const connectedIds = useMemo(() => new Set(activeAgent?.connections || []), [activeAgent]);

  return (
    <section ref={sectionRef} className="relative py-8 sm:py-24 px-3 sm:px-6 overflow-hidden isolate z-10"
      style={{
        background: `linear-gradient(180deg, 
          hsl(220 25% 5%) 0%, 
          hsl(225 30% 7%) 25%, 
          hsl(230 28% 9%) 50%, 
          hsl(225 30% 7%) 75%, 
          hsl(220 25% 5%) 100%)`,
      }}
    >
      {/* Professional dark background overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle radial glow — center focal point */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, hsla(215,50%,30%,0.12), transparent 70%)`
        }} />
        {/* Top edge fade */}
        <div className="absolute top-0 left-0 right-0 h-24" style={{
          background: `linear-gradient(180deg, hsla(220,25%,4%,0.8), transparent)`
        }} />
        {/* Bottom edge fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{
          background: `linear-gradient(0deg, hsla(220,25%,4%,0.8), transparent)`
        }} />
        {/* Side vignettes */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at center, transparent 50%, hsla(220,25%,4%,0.5) 100%)`
        }} />
      </div>
      <CircuitBackground />

      <div className="max-w-[1300px] mx-auto relative z-10">
        {/* ══════ HEADER ══════ */}
        <div className="text-center mb-5 sm:mb-12">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-card/90 backdrop-blur-sm mb-4">
            <Network className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[0.6rem] font-bold text-primary tracking-[0.15em] uppercase">Rete Neurale Operativa</span>
            <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">Oltre {TOTAL_AGENTS_COUNT} Agenti IA</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
            className="text-[clamp(1.4rem,4.5vw,3rem)] font-bold text-foreground leading-[1.05] mb-3">
            Oltre {TOTAL_AGENTS_COUNT} Agenti IA{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              Autonomi
            </span>
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
            className="text-foreground/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed mb-5">
            Un ecosistema di <strong className="text-foreground">intelligenza connessa</strong> che gestisce il tuo business.
            Si parlano, si scambiano dati, prendono decisioni <strong className="text-foreground">in autonomia</strong> —
            come un team di specialisti che non dorme mai.
          </motion.p>

          {/* Value props */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-2">
            {[
              { icon: <Zap className="w-3 h-3" />, text: "Decisioni in tempo reale" },
              { icon: <Network className="w-3 h-3" />, text: "Comunicano tra loro" },
              { icon: <Brain className="w-3 h-3" />, text: "Apprendono dal tuo business" },
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/25 bg-card/85 backdrop-blur-sm">
                <div className="text-primary/90">{v.icon}</div>
                <span className="text-[0.55rem] text-foreground/85 font-medium">{v.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══════ WHY SECTION ══════ */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-xl border border-primary/25 bg-card/85 backdrop-blur-sm p-3 sm:p-6 mb-5 sm:mb-12 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px">
            <motion.div className="absolute w-full h-full"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.35), transparent)" }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">Perché la Rete IA Cambia Tutto</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { title: "Il Problema", desc: "Il tuo business ha 50+ attività quotidiane che rubano tempo. Ordini, clienti, marketing, inventario — tutto manuale, tutto lento.", color: "hsla(0,70%,55%,0.9)", icon: <Clock className="w-4 h-4" /> },
                { title: "La Soluzione", desc: "Ogni attività diventa un nodo della rete. Gli agenti lavorano in parallelo, si scambiano dati e decidono — come un team di specialisti, a costo zero.", color: "hsl(var(--primary))", icon: <CircuitBoard className="w-4 h-4" /> },
                { title: "Il Risultato", desc: "80% meno lavoro manuale. 45% più fatturato. 3× clienti che tornano. Tutto misurabile, tutto garantito.", color: "hsla(150,70%,50%,0.9)", icon: <TrendingUp className="w-4 h-4" /> },
              ].map((block, i) => (
                <div key={i} className="rounded-lg border border-border bg-background/85 p-3.5 sm:p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div style={{ color: block.color }}>{block.icon}</div>
                    <span className="text-[0.6rem] sm:text-xs font-bold tracking-wider uppercase" style={{ color: block.color }}>{block.title}</span>
                  </div>
                  <p className="text-[0.55rem] sm:text-xs text-foreground/80 leading-[1.5]">{block.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══════ SECTOR FILTER ══════ */}
        <div className="flex gap-0.5 justify-center flex-wrap mb-4 sm:mb-8 px-1">
          {SECTOR_TABS.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveSector(tab.id); setExpandedAgent(null); }}
              className={`flex items-center gap-0.5 px-1.5 py-1 rounded-md text-[0.42rem] sm:text-[0.55rem] font-semibold tracking-wider uppercase transition-all border ${
                activeSector === tab.id
                  ? "text-foreground border-primary/40 bg-primary/15"
                  : "text-foreground/70 border-border hover:text-foreground"
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ══════ NETWORK LABEL ══════ */}
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
          className="mb-3 flex items-center gap-2 px-1">
          <div className="relative">
            <div className="w-6 h-6 rounded bg-primary/15 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-primary" />
            </div>
            <motion.div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/60"
              animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
          <div className="flex-1 relative h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent" />
            <motion.div className="absolute w-6 h-full bg-primary/40 rounded-full"
              animate={{ left: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
          </div>
          <span className="text-[0.5rem] font-bold text-primary/90 tracking-[3px] uppercase whitespace-nowrap">
            {filteredAgents.length} Nodi Attivi · Clicca per esplorare connessioni
          </span>
          <div className="flex-1 relative h-px">
            <div className="absolute inset-0 bg-gradient-to-l from-primary/30 to-transparent" />
          </div>
        </motion.div>

        {/* ══════ EXPANDED AGENT DETAIL ══════ */}
        <AnimatePresence>
          {activeAgent && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden">
              <div className="rounded-xl border overflow-hidden" style={{
                borderColor: `${activeAgent.glow}45`,
                background: "linear-gradient(145deg, hsla(265,18%,13%,0.99), hsla(265,25%,9%,1))"
              }}>
                <div className="relative h-[3px] overflow-hidden">
                  <motion.div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${activeAgent.glow}, transparent)` }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
                  <motion.div className="absolute w-8 h-full" style={{ background: activeAgent.glow }}
                    animate={{ left: ["-10%", "110%"] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <RobotAvatar agent={activeAgent} size={56} isActive={true} isConnected={false} />
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">{activeAgent.name}</h3>
                        <p className="text-[0.5rem] text-primary/85 uppercase tracking-widest">{activeAgent.role}</p>
                      </div>
                    </div>
                    <button onClick={() => setExpandedAgent(null)} className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary/40 transition-colors">
                      <X className="w-3.5 h-3.5 text-foreground/80" />
                    </button>
                  </div>

                  <p className="text-xs text-foreground/80 leading-relaxed mb-3">{activeAgent.desc}</p>

                  <div className="rounded-lg border p-3 mb-4" style={{ borderColor: `${activeAgent.glow}55`, background: `${activeAgent.glow}1A` }}>
                    <p className="text-xs leading-[1.6]">
                      <strong className="text-foreground">⚡ Perché ti serve:</strong>{" "}
                      <span className="text-foreground/90">{activeAgent.whyNeed}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 mb-4">
                    {activeAgent.capabilities.map((cap, ci) => (
                      <div key={ci} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-border bg-background/60">
                        <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: activeAgent.glow }}
                          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: ci * 0.2 }} />
                        <span className="text-[0.55rem] text-foreground/85">{cap}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <Network className="w-3 h-3 text-primary/80" />
                    <span className="text-[0.5rem] font-bold text-primary/80 tracking-widest uppercase">
                      Connesso a {activeAgent.connections.length} agenti
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeAgent.connections.map((connId) => {
                      const conn = ALL_AGENTS.find((a) => a.id === connId);
                      if (!conn) return null;
                      return (
                        <button key={connId} onClick={(e) => { e.stopPropagation(); setExpandedAgent(connId); }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary/25 bg-primary/[0.09] hover:bg-primary/[0.14] transition-colors">
                          <div className={`w-5 h-5 rounded-md overflow-hidden bg-gradient-to-br ${conn.gradient} flex items-center justify-center`}>
                            <div className="text-white scale-[0.5]">{conn.icon}</div>
                          </div>
                          <span className="text-[0.5rem] font-semibold text-foreground/90">{conn.name}</span>
                          <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════
           SPATIAL NETWORK GRID — with layout animation
           ═══════════════════════════════════ */}
        <div className="relative" ref={networkRef}>
          <AlwaysOnNetwork agents={filteredAgents} activeId={expandedAgent} containerRef={networkRef} />

          <LayoutGroup>
            <motion.div
              className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-2 gap-y-3 sm:gap-x-8 sm:gap-y-10 lg:gap-x-12 lg:gap-y-14 mb-4 relative z-[5]"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredAgents.map((agent, i) => (
                  <motion.div key={agent.id}
                    layout
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1, marginTop: i % 2 === 1 ? 14 : 0 }}
                    exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.7 }}
                  >
                    <NetworkNode
                      agent={agent}
                      isActive={expandedAgent === agent.id}
                      isConnected={connectedIds.has(agent.id)}
                      onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                      index={i}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>

        {/* ══════ EXPAND / COLLAPSE BUTTON ══════ */}
        {activeSector === "all" && totalFiltered > INITIAL_VISIBLE && (
          <motion.div className="flex justify-center my-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.button
              onClick={() => setShowAll(!showAll)}
              className="group relative flex items-center gap-2.5 px-6 py-3 rounded-full border border-primary/30 bg-card/90 backdrop-blur-sm hover:border-primary/50 transition-all overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Scanning beam */}
              <motion.div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent 30%, hsla(215,60%,60%,0.08) 50%, transparent 70%)" }}
                animate={{ x: ["-200%", "300%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <CircuitBoard className="w-4 h-4 text-primary/80" />
              <span className="text-xs font-bold text-foreground/90 tracking-wider uppercase relative z-10">
                {showAll ? "Mostra Principali" : `Mostra Tutti i ${totalFiltered} Agenti`}
              </span>
              {showAll
                ? <ChevronUp className="w-4 h-4 text-primary/70" />
                : <ChevronDown className="w-4 h-4 text-primary/70 group-hover:translate-y-0.5 transition-transform" />
              }
              <motion.div className="w-2 h-2 rounded-full bg-primary/60"
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          </motion.div>
        )}

        {/* ══════ NEURAL BUS ══════ */}
        <motion.div className="relative h-8 sm:h-16 my-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-primary/20" />

          {[8, 22, 36, 50, 64, 78, 92].map((x, i) => (
            <motion.div key={i}
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-primary/30"
              style={{ left: `${x}%`, background: "hsl(var(--background))" }}
              animate={{ borderColor: ["hsl(var(--primary) / 0.2)", "hsl(var(--primary) / 0.5)", "hsl(var(--primary) / 0.2)"] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              <motion.div className="absolute inset-[2px] rounded-full bg-primary/45"
                animate={{ scale: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            </motion.div>
          ))}

          {[0, 1, 2].map((i) => (
            <motion.div key={i}
              className="absolute top-1/2 -translate-y-1/2 w-4 h-[2px] rounded-full"
              style={{ background: "hsl(var(--primary))", boxShadow: "0 0 8px hsl(var(--primary) / 0.5)" }}
              animate={{ left: ["-3%", "103%"] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "linear", delay: i * 1.5 }}
            />
          ))}

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-card/95 backdrop-blur-sm">
            <motion.div className="w-2 h-2 rounded-full bg-primary/70"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }} />
            <CircuitBoard className="w-3.5 h-3.5 text-primary/90" />
            <span className="text-[0.5rem] font-bold text-primary/90 tracking-[2px] uppercase">Neural Bus</span>
            <motion.div className="w-2 h-2 rounded-full bg-accent/70"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }} />
          </div>
        </motion.div>

        {/* ══════ IMPACT STATS ══════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-xl border border-border bg-card/80 backdrop-blur-sm p-3 sm:p-8 overflow-hidden mb-5 mt-2">
          <div className="absolute top-0 left-0 right-0 h-px">
            <motion.div className="absolute w-12 h-full bg-primary/40"
              animate={{ left: ["-10%", "110%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
          </div>
          <div className="text-center mb-5">
            <h3 className="font-bold text-sm sm:text-lg text-foreground mb-1">Output della Rete</h3>
            <p className="text-foreground/75 text-[0.6rem] sm:text-xs">Risultati misurabili — garantiti per contratto</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {[
              { icon: <Timer className="w-5 h-5" />, value: 80, suffix: "%", label: "Tempo Risparmiato", desc: "sulle operazioni manuali" },
              { icon: <TrendingUp className="w-5 h-5" />, value: 45, suffix: "%", label: "Aumento Revenue", desc: "nei primi 90 giorni" },
              { icon: <Users className="w-5 h-5" />, value: 3, suffix: "×", label: "Clienti Fidelizzati", desc: "tasso di ritorno" },
              { icon: <Shield className="w-5 h-5" />, value: 99, suffix: ".9%", label: "Uptime Garantito", desc: "disponibilità continua" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-3 rounded-xl border border-border bg-background/70 hover:border-primary/30 transition-colors">
                <div className="text-primary/80 flex justify-center mb-1.5">{stat.icon}</div>
                <div className="text-xl sm:text-3xl font-bold text-foreground mb-0.5">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[0.55rem] sm:text-xs font-semibold text-foreground/90">{stat.label}</div>
                <div className="text-[0.45rem] sm:text-[0.55rem] text-foreground/75 mt-0.5">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════ EVOLVING NETWORK FOOTER ══════ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center py-4">
          <p className="text-foreground/90 text-xs sm:text-sm font-semibold mb-3">
            Una Rete che Evolve per Sempre.
          </p>
          <p className="text-foreground/60 text-[0.6rem] sm:text-xs max-w-md mx-auto mb-4">
            Ogni settimana nuovi nodi, nuove connessioni, nuove automazioni. Il tuo circuito IA diventa più intelligente ogni giorno.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Nuovi Agenti Settimanali", "Auto-Discovery Connessioni", "Zero Costi Extra", "Evoluzione Perpetua"].map((label) => (
              <div key={label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/20 bg-card/80">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[0.5rem] text-foreground/80 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
