import { motion, useInView, AnimatePresence } from "framer-motion";
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
  Settings, Receipt, ScanLine, Camera, X, ChevronDown
} from "lucide-react";

/* ═══ PROFESSIONAL TRADE PHOTOS ═══ */
const AGENT_PHOTOS: Record<string, string> = {
  "ghost-manager": "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600",
  "concierge-ai": "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=600",
  "predictive-engine": "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=600",
  "autopilot-marketing": "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=600",
  "chef-intelligence": "https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=600",
  "kitchen-commander": "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg?auto=compress&cs=tinysrgb&w=600",
  "sommelier-ia": "https://images.pexels.com/photos/3171815/pexels-photo-3171815.jpeg?auto=compress&cs=tinysrgb&w=600",
  "review-shield": "https://images.pexels.com/photos/4350099/pexels-photo-4350099.jpeg?auto=compress&cs=tinysrgb&w=600",
  "smart-dispatcher": "https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=600",
  "dynamic-pricing": "https://images.pexels.com/photos/6120214/pexels-photo-6120214.jpeg?auto=compress&cs=tinysrgb&w=600",
  "smart-agenda": "https://images.pexels.com/photos/3985338/pexels-photo-3985338.jpeg?auto=compress&cs=tinysrgb&w=600",
  "loyalty-angel": "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=600",
  "social-creator": "https://images.pexels.com/photos/3585088/pexels-photo-3585088.jpeg?auto=compress&cs=tinysrgb&w=600",
  "triage-ia": "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=600",
  "revenue-manager": "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600",
  "retention-ai": "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600",
  "field-dispatcher": "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=600",
  "beach-booker": "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=600",
  "stock-intelligence": "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=600",
};

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
interface AgentNode {
  id: string; name: string; role: string; desc: string; whyNeed: string;
  icon: React.ReactNode; gradient: string; glow: string;
  stat: { value: number; suffix: string; label: string };
  capabilities: string[]; category: string; sectors: string[];
  connections: string[];
}

const ALL_AGENTS: AgentNode[] = [
  { id: "ghost-manager", name: "GhostManager™", role: "Direttore Operativo IA", desc: "Manager virtuale che monitora ordini, ottimizza turni, rileva anomalie e prende decisioni operative in tempo reale — 24/7.", whyNeed: "Senza un manager IA, perdi ore in micro-decisioni. Con GhostManager™ tutto funziona da solo.", icon: <Bot className="w-4 h-4" />, gradient: "from-violet-500 to-purple-600", glow: "hsla(265,80%,60%,1)", stat: { value: 24, suffix: "/7", label: "Operativo" }, capabilities: ["Gestione ordini autonoma", "Ottimizzazione turni", "Alert anomalie", "Decisioni predittive"], category: "operations", sectors: ["all"], connections: ["kitchen-commander", "predictive-engine", "concierge-ai"] },
  { id: "concierge-ai", name: "Concierge AI", role: "Assistente Clienti 24/7", desc: "Risponde ai clienti via chat in 12+ lingue, gestisce prenotazioni, suggerisce prodotti e risolve problemi istantaneamente.", whyNeed: "Ogni cliente senza risposta è un cliente perso. Concierge AI risponde in 3 secondi, 24/7.", icon: <MessageSquare className="w-4 h-4" />, gradient: "from-sky-500 to-blue-600", glow: "hsla(210,80%,55%,1)", stat: { value: 12, suffix: "+", label: "Lingue" }, capabilities: ["Chat multilingue", "Prenotazioni auto", "Upselling IA", "Risoluzione problemi"], category: "concierge", sectors: ["all"], connections: ["ghost-manager", "loyalty-angel", "autopilot-marketing"] },
  { id: "predictive-engine", name: "Predictive Engine", role: "Analista Predittivo", desc: "Analizza pattern di vendita, previsione domanda, trend stagionali e comportamento clienti. Ti dice PRIMA cosa succederà.", whyNeed: "Senza dati predittivi navighi alla cieca. Predictive Engine ti dice cosa succederà PRIMA.", icon: <BarChart3 className="w-4 h-4" />, gradient: "from-emerald-500 to-teal-600", glow: "hsla(160,70%,45%,1)", stat: { value: 45, suffix: "%", label: "↑ Revenue" }, capabilities: ["Previsione domanda", "Analisi trend", "Segmentazione clienti", "Report IA"], category: "analytics", sectors: ["all"], connections: ["ghost-manager", "autopilot-marketing", "dynamic-pricing"] },
  { id: "autopilot-marketing", name: "AutoPilot Marketing", role: "Growth Hacker Autonomo", desc: "Campagne email, WhatsApp e push basate su comportamenti reali. Recupera clienti persi, premia i fedeli — tutto in automatico.", whyNeed: "Il 68% dei clienti non torna senza follow-up. AutoPilot li riattiva a costo zero.", icon: <Rocket className="w-4 h-4" />, gradient: "from-amber-400 to-orange-500", glow: "hsla(35,90%,55%,1)", stat: { value: 3, suffix: "×", label: "ROI Marketing" }, capabilities: ["Campagne comportamentali", "Recupero clienti", "Push & WhatsApp auto", "A/B testing"], category: "content", sectors: ["all"], connections: ["predictive-engine", "loyalty-angel", "social-creator", "concierge-ai"] },
  { id: "chef-intelligence", name: "Chef Intelligence", role: "Assistente Culinario IA", desc: "Menu completi con foto, allergeni, traduzioni e prezzi ottimizzati. Food cost automatico per ogni piatto.", whyNeed: "Ogni errore nel menu costa clienti. Chef Intelligence crea menu perfetti in 60 secondi.", icon: <ChefHat className="w-4 h-4" />, gradient: "from-orange-500 to-amber-500", glow: "hsla(30,90%,55%,1)", stat: { value: 60, suffix: "s", label: "Menu pronto" }, capabilities: ["Menu IA in 60s", "Food cost auto", "Allergeni & traduzioni", "Foto piatti pro"], category: "operations", sectors: ["food", "bakery"], connections: ["kitchen-commander", "sommelier-ia"] },
  { id: "kitchen-commander", name: "Kitchen Commander", role: "Gestione Cucina Live", desc: "Dashboard cucina in tempo reale con priorità ordini, timer intelligenti e coordinamento automatico delle comande.", whyNeed: "Una cucina caotica brucia margini. Kitchen Commander elimina errori e coordina tutto.", icon: <Clock className="w-4 h-4" />, gradient: "from-red-500 to-rose-600", glow: "hsla(0,80%,55%,1)", stat: { value: 40, suffix: "%", label: "↓ Tempi attesa" }, capabilities: ["Ordini prioritizzati", "Timer intelligenti", "Comande coordinate", "Alert ritardi"], category: "operations", sectors: ["food"], connections: ["ghost-manager", "chef-intelligence"] },
  { id: "sommelier-ia", name: "Sommelier IA", role: "Esperto Abbinamenti", desc: "Suggerisce abbinamenti vino-piatto perfetti, aumentando lo scontrino medio con upselling naturale.", whyNeed: "Il 70% dei clienti non ordina vino perché non sa scegliere. Sommelier IA aumenta lo scontrino del 35%.", icon: <Target className="w-4 h-4" />, gradient: "from-purple-500 to-violet-600", glow: "hsla(270,70%,55%,1)", stat: { value: 35, suffix: "%", label: "↑ Scontrino" }, capabilities: ["Abbinamenti vino-piatto", "Upselling naturale", "Carta vini dinamica", "Suggerimenti AI"], category: "sales", sectors: ["food"], connections: ["chef-intelligence", "concierge-ai"] },
  { id: "review-shield", name: "Review Shield™", role: "Protezione Reputazione", desc: "Intercetta le recensioni negative PRIMA che arrivino su Google. Solo i feedback positivi vengono pubblicati online.", whyNeed: "Una sola recensione negativa costa 30 clienti. Review Shield™ le intercetta prima.", icon: <Shield className="w-4 h-4" />, gradient: "from-emerald-500 to-green-600", glow: "hsla(150,70%,45%,1)", stat: { value: 95, suffix: "%", label: "★ Positive" }, capabilities: ["Intercettazione feedback", "Filtro recensioni", "Alert negativi", "Boost positivi"], category: "compliance", sectors: ["all"], connections: ["concierge-ai", "autopilot-marketing"] },
  { id: "smart-dispatcher", name: "Smart Dispatcher", role: "Assegnazione Intelligente", desc: "Assegna corse all'autista perfetto per posizione, lingua, veicolo e disponibilità — in 3 secondi.", whyNeed: "Assegnare corse manualmente crea ritardi. Smart Dispatcher trova l'autista perfetto in 3 secondi.", icon: <Car className="w-4 h-4" />, gradient: "from-amber-400 to-yellow-500", glow: "hsla(40,90%,55%,1)", stat: { value: 30, suffix: "%", label: "↑ Efficienza" }, capabilities: ["Assegnazione automatica", "Matching veicolo-cliente", "Percorsi ottimali", "Disponibilità real-time"], category: "operations", sectors: ["ncc"], connections: ["dynamic-pricing", "ghost-manager"] },
  { id: "dynamic-pricing", name: "Dynamic Pricing", role: "Tariffe Intelligenti", desc: "Tariffe dinamiche basate su distanza, traffico, domanda, stagione ed eventi — massimizzando i ricavi per corsa.", whyNeed: "Tariffe fisse = soldi persi. Dynamic Pricing adatta i prezzi alla domanda reale.", icon: <Wallet className="w-4 h-4" />, gradient: "from-emerald-500 to-teal-500", glow: "hsla(160,70%,50%,1)", stat: { value: 25, suffix: "%", label: "↑ Revenue" }, capabilities: ["Prezzi dinamici", "Surge pricing eventi", "Analisi concorrenza", "Margine ottimizzato"], category: "analytics", sectors: ["ncc", "beach", "hotel"], connections: ["predictive-engine", "smart-dispatcher", "revenue-manager"] },
  { id: "smart-agenda", name: "Smart Agenda", role: "Ottimizzatore Appuntamenti", desc: "Riempie i buchi in agenda, previene no-show con reminder intelligenti e accetta prenotazioni 24/7 online.", whyNeed: "Ogni buco in agenda è fatturato perso. Smart Agenda riduce i no-show dell'85%.", icon: <Calendar className="w-4 h-4" />, gradient: "from-pink-500 to-rose-500", glow: "hsla(340,80%,55%,1)", stat: { value: 85, suffix: "%", label: "↓ No-show" }, capabilities: ["Anti no-show 85%", "Buchi riempiti", "Reminder multicanale", "Booking 24/7"], category: "operations", sectors: ["beauty", "healthcare"], connections: ["concierge-ai", "autopilot-marketing"] },
  { id: "loyalty-angel", name: "Loyalty Angel", role: "Fidelizzazione Clienti", desc: "Identifica clienti a rischio abbandono e attiva campagne automatiche di riattivazione con offerte personalizzate.", whyNeed: "Acquisire un nuovo cliente costa 7× di più che mantenerne uno. Loyalty Angel li riattiva prima che vadano via.", icon: <Heart className="w-4 h-4" />, gradient: "from-rose-400 to-pink-500", glow: "hsla(350,75%,60%,1)", stat: { value: 3, suffix: "×", label: "Tasso ritorno" }, capabilities: ["Alert clienti inattivi", "Offerte personalizzate", "Compleanno auto", "WhatsApp marketing"], category: "sales", sectors: ["beauty", "retail", "fitness"], connections: ["concierge-ai", "autopilot-marketing", "predictive-engine"] },
  { id: "social-creator", name: "Social Creator", role: "Generatore Contenuti", desc: "Crea post Instagram, stories e newsletter automaticamente con descrizioni accattivanti e hashtag ottimizzati.", whyNeed: "Senza social costanti diventi invisibile. Social Creator pubblica per te ogni giorno — 5× engagement.", icon: <Globe className="w-4 h-4" />, gradient: "from-violet-500 to-indigo-500", glow: "hsla(260,70%,55%,1)", stat: { value: 5, suffix: "×", label: "Engagement" }, capabilities: ["Post Instagram auto", "Stories template", "Newsletter", "Hashtag ottimizzati"], category: "content", sectors: ["all"], connections: ["autopilot-marketing", "chef-intelligence"] },
  { id: "triage-ia", name: "Triage IA", role: "Pre-valutazione Intelligente", desc: "Pre-valuta le richieste dei pazienti, assegna priorità e indirizza allo specialista corretto.", whyNeed: "Pazienti indirizzati male = tempo sprecato. Triage IA assegna lo specialista giusto al primo contatto.", icon: <Heart className="w-4 h-4" />, gradient: "from-teal-500 to-cyan-500", glow: "hsla(180,70%,50%,1)", stat: { value: 70, suffix: "%", label: "↓ Attese" }, capabilities: ["Pre-screening", "Priorità auto", "Routing specialista", "Riduzione attese"], category: "operations", sectors: ["healthcare"], connections: ["smart-agenda", "concierge-ai"] },
  { id: "revenue-manager", name: "Revenue Manager IA", role: "Tariffe Dinamiche Hotel", desc: "Tariffe ottimali basate su domanda, eventi, meteo, competitor — massimizzando il RevPAR automaticamente.", whyNeed: "Tariffe fisse = soldi persi ogni notte. Revenue Manager ottimizza i prezzi in tempo reale.", icon: <TrendingUp className="w-4 h-4" />, gradient: "from-amber-400 to-yellow-500", glow: "hsla(45,90%,55%,1)", stat: { value: 35, suffix: "%", label: "↑ RevPAR" }, capabilities: ["Yield management", "Competitor analysis", "Evento detection", "RevPAR ottimizzato"], category: "analytics", sectors: ["hotel"], connections: ["dynamic-pricing", "predictive-engine"] },
  { id: "retention-ai", name: "Retention AI", role: "Anti-Abbandono Soci", desc: "Identifica soci a rischio cancellazione e attiva campagne di retention automatiche — prima che se ne vadano.", whyNeed: "Il 40% dei soci abbandona nei primi 3 mesi. Retention AI li identifica PRIMA.", icon: <Users className="w-4 h-4" />, gradient: "from-lime-500 to-green-500", glow: "hsla(100,70%,50%,1)", stat: { value: 60, suffix: "%", label: "↓ Churn" }, capabilities: ["Previsione churn", "Alert soci inattivi", "Campagne automatiche", "Win-back personalizzato"], category: "sales", sectors: ["fitness"], connections: ["loyalty-angel", "autopilot-marketing"] },
  { id: "field-dispatcher", name: "Field Dispatcher", role: "Coordinamento Interventi", desc: "Assegna interventi al tecnico più vicino, ottimizza percorsi e invia conferme automatiche ai clienti.", whyNeed: "Senza routing ottimizzato i tecnici perdono ore nel traffico. Field Dispatcher fa 40% interventi in più.", icon: <Workflow className="w-4 h-4" />, gradient: "from-blue-500 to-indigo-500", glow: "hsla(230,70%,55%,1)", stat: { value: 40, suffix: "%", label: "↑ Interventi/giorno" }, capabilities: ["Assegnazione smart", "Ottimizzazione percorsi", "GPS tracking", "Conferme auto"], category: "operations", sectors: ["trades"], connections: ["smart-dispatcher", "ghost-manager"] },
  { id: "beach-booker", name: "Beach Booker IA", role: "Prenotazioni Spiaggia", desc: "Mappa interattiva con disponibilità real-time. Prenotazione ombrellone, lettino e servizi 24/7 — zero telefonate.", whyNeed: "Ogni telefonata = 3 minuti persi × 50/giorno = 2.5 ore sprecate. Beach Booker elimina l'80%.", icon: <Umbrella className="w-4 h-4" />, gradient: "from-cyan-500 to-blue-500", glow: "hsla(190,80%,55%,1)", stat: { value: 80, suffix: "%", label: "↓ Telefonate" }, capabilities: ["Mappa interattiva", "Booking 24/7", "Pagamento anticipato", "Conferme auto"], category: "operations", sectors: ["beach"], connections: ["concierge-ai", "dynamic-pricing"] },
  { id: "stock-intelligence", name: "Stock Intelligence", role: "Inventario Predittivo", desc: "Monitora scorte in tempo reale, prevede la domanda e genera ordini di riassortimento automatici.", whyNeed: "Ogni prodotto esaurito = vendita persa. Stock Intelligence prevede e riordina PRIMA.", icon: <Package className="w-4 h-4" />, gradient: "from-cyan-500 to-blue-500", glow: "hsla(200,75%,55%,1)", stat: { value: 0, suffix: "", label: "Rotture stock" }, capabilities: ["Alert scorte minime", "Riordino auto", "Previsione domanda", "Analytics prodotto"], category: "operations", sectors: ["retail"], connections: ["predictive-engine", "ghost-manager"] },
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
];

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
          color: isActive && activeId === agent.id ? agent.glow : isActive ? connAgent.glow : "hsla(265,50%,60%,0.25)",
          id: pairKey,
          isActive,
        });
      });
    });
    setLines(newLines);
  }, [agents, activeId, containerRef]);

  useEffect(() => {
    compute();
    const t = setTimeout(compute, 200);
    const onResize = () => { cancelAnimationFrame(frameRef.current); frameRef.current = requestAnimationFrame(compute); };
    window.addEventListener("resize", onResize);
    return () => { clearTimeout(t); window.removeEventListener("resize", onResize); cancelAnimationFrame(frameRef.current); };
  }, [compute]);

  if (!lines.length) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible", zIndex: 1 }}>
      <defs>
        <filter id="line-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {lines.map((line) => {
        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;
        const mx = (line.x1 + line.x2) / 2 + dy * 0.12;
        const my = (line.y1 + line.y2) / 2 - dx * 0.12;
        const pathD = `M ${line.x1} ${line.y1} Q ${mx} ${my} ${line.x2} ${line.y2}`;
        const baseOpacity = line.isActive ? 0.6 : 0.12;
        const particleColor = line.isActive ? line.color : "hsla(265,60%,65%,0.5)";

        return (
          <g key={line.id}>
            {/* Glow line */}
            {line.isActive && (
              <path d={pathD} fill="none" stroke={line.color} strokeWidth="3"
                opacity="0.15" filter="url(#line-glow)" />
            )}

            {/* Main dashed line */}
            <path d={pathD} fill="none" stroke={line.color} strokeWidth={line.isActive ? 1.5 : 0.7}
              strokeDasharray={line.isActive ? "6 4" : "3 8"} opacity={baseOpacity} />

            {/* Flowing particle */}
            <circle r={line.isActive ? 3 : 1.5} fill={particleColor}
              filter={line.isActive ? "url(#line-glow)" : undefined}>
              <animateMotion dur={line.isActive ? "2s" : "5s"} repeatCount="indefinite" path={pathD} />
            </circle>

            {/* Second particle reverse for active */}
            {line.isActive && (
              <circle r={2} fill={particleColor} opacity="0.4">
                <animateMotion dur="3s" repeatCount="indefinite"
                  path={`M ${line.x2} ${line.y2} Q ${mx} ${my} ${line.x1} ${line.y1}`} />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/* ═══ CIRCUIT GRID BACKGROUND ═══ */
const CircuitBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circuit-hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse" patternTransform="scale(1.8)">
          <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit-hex)" />
    </svg>

    {/* Horizontal scan lines */}
    {[0, 1].map((i) => (
      <motion.div key={i} className="absolute left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.08), transparent)" }}
        animate={{ top: ["-5%", "105%"] }}
        transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear", delay: i * 4 }}
      />
    ))}

    {/* Vertical pulse columns */}
    {[15, 50, 85].map((x, i) => (
      <div key={i} className="absolute top-0 bottom-0 w-px opacity-[0.03]" style={{ left: `${x}%`, background: "hsl(var(--primary))" }}>
        <motion.div className="absolute h-16 w-full left-0 rounded-full"
          style={{ background: "hsl(var(--primary))", opacity: 0.6 }}
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 12 + i * 3, repeat: Infinity, ease: "linear", delay: i * 2 }}
        />
      </div>
    ))}

    {/* Ambient glows */}
    <div className="absolute w-[500px] h-[500px] rounded-full blur-[200px] opacity-[0.04] top-1/4 left-1/4" style={{ background: "hsl(var(--primary))" }} />
    <div className="absolute w-[400px] h-[400px] rounded-full blur-[180px] opacity-[0.03] bottom-1/4 right-1/4" style={{ background: "hsl(var(--accent))" }} />
  </div>
);

/* ═══ NETWORK NODE ═══ */
const NetworkNode = ({
  agent, isActive, isConnected, onClick, index,
}: {
  agent: AgentNode; isActive: boolean; isConnected: boolean; onClick: () => void; index: number;
}) => {
  const photo = AGENT_PHOTOS[agent.id] || AGENT_PHOTOS["ghost-manager"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.035, type: "spring", stiffness: 200, damping: 20 }}
      onClick={onClick}
      className="group cursor-pointer relative flex flex-col items-center"
      data-agent-id={agent.id}
      style={{ zIndex: isActive ? 30 : isConnected ? 20 : 10 }}
    >
      {/* Outer glow */}
      {(isActive || isConnected) && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: isActive ? 130 : 110,
            height: isActive ? 130 : 110,
            top: "50%", left: "50%", transform: "translate(-50%, -55%)",
            background: `radial-gradient(circle, ${agent.glow}15 0%, transparent 70%)`,
            boxShadow: isActive ? `0 0 50px ${agent.glow}20, 0 0 100px ${agent.glow}08` : `0 0 25px ${agent.glow}12`,
          }}
          animate={isActive ? { scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] } : { opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Photo node */}
      <div className="relative z-10 mb-2">
        <div className={`relative w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full overflow-hidden transition-all duration-500 ${
          isActive
            ? "ring-[3px] ring-primary shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
            : isConnected
              ? "ring-2 ring-primary/40 shadow-[0_0_15px_hsl(var(--primary)/0.15)]"
              : "ring-[1.5px] ring-foreground/10 group-hover:ring-primary/30 group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)]"
        }`}>
          <img src={photo} alt={agent.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

          {/* Status pulse */}
          <motion.div
            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-300/50"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.15 }}
            style={{ boxShadow: "0 0 8px hsla(160,80%,55%,0.6)" }}
          />

          {/* Stat badge */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[0.5rem] font-bold whitespace-nowrap"
            style={{ background: "hsla(0,0%,0%,0.75)", backdropFilter: "blur(4px)", color: agent.glow }}>
            <Counter value={agent.stat.value} suffix={agent.stat.suffix} />{" "}
            <span className="text-white/40 text-[0.4rem]">{agent.stat.label}</span>
          </div>
        </div>

        {/* Cardinal connection dots */}
        {(["top", "bottom", "left", "right"] as const).map((pos) => (
          <motion.div key={pos}
            className="absolute w-[5px] h-[5px] rounded-full z-20"
            style={{
              background: isActive || isConnected ? agent.glow : "hsla(var(--primary) / 0.12)",
              boxShadow: isActive ? `0 0 8px ${agent.glow}` : "none",
              ...(pos === "top" ? { top: -2, left: "50%", marginLeft: -2.5 } : {}),
              ...(pos === "bottom" ? { bottom: -2, left: "50%", marginLeft: -2.5 } : {}),
              ...(pos === "left" ? { left: -2, top: "50%", marginTop: -2.5 } : {}),
              ...(pos === "right" ? { right: -2, top: "50%", marginTop: -2.5 } : {}),
            }}
            animate={isActive ? { scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: ["top", "right", "bottom", "left"].indexOf(pos) * 0.3 }}
          />
        ))}

        {/* Rotating orbit ring */}
        {isActive && (
          <motion.svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none" viewBox="0 0 100 100">
            <motion.circle cx="50" cy="50" r="48" fill="none" stroke={agent.glow} strokeWidth="0.4"
              strokeDasharray="6 10" strokeLinecap="round"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            />
          </motion.svg>
        )}
      </div>

      {/* Name + role */}
      <div className="text-center max-w-[100px] sm:max-w-[120px]">
        <h3 className="font-bold text-[0.58rem] sm:text-[0.68rem] text-foreground leading-tight truncate">
          {agent.name}
        </h3>
        <p className="text-[0.44rem] sm:text-[0.5rem] text-primary/40 tracking-wider uppercase truncate">
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

  const filteredAgents = useMemo(() => {
    if (activeSector === "all") return ALL_AGENTS;
    return ALL_AGENTS.filter((a) => a.sectors.includes("all") || a.sectors.includes(activeSector));
  }, [activeSector]);

  const activeAgent = useMemo(() => ALL_AGENTS.find((a) => a.id === expandedAgent), [expandedAgent]);
  const connectedIds = useMemo(() => new Set(activeAgent?.connections || []), [activeAgent]);

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      <CircuitBackground />

      <div className="max-w-[1300px] mx-auto relative z-10">
        {/* ══════ HEADER ══════ */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/[0.06] backdrop-blur-sm mb-4">
            <Network className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[0.6rem] font-bold text-primary/80 tracking-[0.15em] uppercase">Rete Neurale Operativa</span>
            <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-bold">{ALL_AGENTS.length} Agenti</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
            className="text-[clamp(1.4rem,4.5vw,3rem)] font-bold text-foreground leading-[1.05] mb-3">
            Un Ecosistema di{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              Intelligenza Connessa
            </span>
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
            className="text-foreground/45 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed mb-5">
            Ogni agente è un <strong className="text-foreground/70">nodo intelligente</strong> della tua rete operativa.
            Si parlano, si scambiano dati, prendono decisioni <strong className="text-foreground/70">in autonomia</strong> —
            come un team di 20 specialisti che non dorme mai.
          </motion.p>

          {/* Value props */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-2">
            {[
              { icon: <Zap className="w-3 h-3" />, text: "Decisioni in tempo reale" },
              { icon: <Network className="w-3 h-3" />, text: "Comunicano tra loro" },
              { icon: <Brain className="w-3 h-3" />, text: "Apprendono dal tuo business" },
            ].map((v, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/10 bg-primary/[0.03]">
                <div className="text-primary/60">{v.icon}</div>
                <span className="text-[0.55rem] text-foreground/50 font-medium">{v.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══════ WHY SECTION ══════ */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-xl border border-primary/10 bg-primary/[0.02] p-4 sm:p-6 mb-8 sm:mb-12 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px">
            <motion.div className="absolute w-full h-full"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.2), transparent)" }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-foreground">Perché la Rete IA Cambia Tutto</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { title: "Il Problema", desc: "Il tuo business ha 50+ attività quotidiane che rubano tempo. Ordini, clienti, marketing, inventario — tutto manuale, tutto lento.", color: "hsla(0,70%,55%,0.8)", icon: <Clock className="w-4 h-4" /> },
                { title: "La Soluzione", desc: "Ogni attività diventa un nodo della rete. Gli agenti lavorano in parallelo, si scambiano dati e decidono — come un team di 20 persone, a costo zero.", color: "hsl(var(--primary))", icon: <CircuitBoard className="w-4 h-4" /> },
                { title: "Il Risultato", desc: "80% meno lavoro manuale. 45% più fatturato. 3× clienti che tornano. Tutto misurabile, tutto garantito.", color: "hsla(150,70%,50%,0.8)", icon: <TrendingUp className="w-4 h-4" /> },
              ].map((block, i) => (
                <div key={i} className="rounded-lg border border-foreground/[0.06] bg-background/40 p-3.5 sm:p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div style={{ color: block.color }}>{block.icon}</div>
                    <span className="text-[0.6rem] sm:text-xs font-bold tracking-wider uppercase" style={{ color: block.color }}>{block.title}</span>
                  </div>
                  <p className="text-[0.55rem] sm:text-xs text-foreground/40 leading-[1.5]">{block.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══════ SECTOR FILTER ══════ */}
        <div className="flex gap-1 justify-center flex-wrap mb-6 sm:mb-8 px-2">
          {SECTOR_TABS.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveSector(tab.id); setExpandedAgent(null); }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[0.5rem] sm:text-[0.55rem] font-semibold tracking-wider uppercase transition-all border ${
                activeSector === tab.id
                  ? "text-foreground border-primary/30 bg-primary/8"
                  : "text-foreground/25 border-transparent hover:text-foreground/45"
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ══════ NETWORK LABEL ══════ */}
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}
          className="mb-5 flex items-center gap-2 px-1">
          <div className="relative">
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-primary" />
            </div>
            <motion.div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/40"
              animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
          <div className="flex-1 relative h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
            <motion.div className="absolute w-6 h-full bg-primary/30 rounded-full"
              animate={{ left: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
          </div>
          <span className="text-[0.5rem] font-bold text-primary/50 tracking-[3px] uppercase whitespace-nowrap">
            {filteredAgents.length} Nodi Attivi · Clicca per esplorare
          </span>
          <div className="flex-1 relative h-px">
            <div className="absolute inset-0 bg-gradient-to-l from-primary/20 to-transparent" />
          </div>
        </motion.div>

        {/* ══════ EXPANDED AGENT DETAIL ══════ */}
        <AnimatePresence>
          {activeAgent && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden">
              <div className="rounded-xl border overflow-hidden" style={{
                borderColor: `${activeAgent.glow}30`,
                background: "linear-gradient(145deg, hsla(265,18%,13%,0.98), hsla(265,25%,9%,0.99))"
              }}>
                {/* Animated top bar */}
                <div className="relative h-[3px] overflow-hidden">
                  <motion.div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${activeAgent.glow}, transparent)` }}
                    animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
                  <motion.div className="absolute w-8 h-full" style={{ background: activeAgent.glow }}
                    animate={{ left: ["-10%", "110%"] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2" style={{ borderColor: `${activeAgent.glow}50` }}>
                        <img src={AGENT_PHOTOS[activeAgent.id]} alt={activeAgent.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">{activeAgent.name}</h3>
                        <p className="text-[0.5rem] text-primary/50 uppercase tracking-widest">{activeAgent.role}</p>
                      </div>
                    </div>
                    <button onClick={() => setExpandedAgent(null)} className="w-7 h-7 rounded-full border border-foreground/10 flex items-center justify-center hover:border-foreground/20 transition-colors">
                      <X className="w-3.5 h-3.5 text-foreground/40" />
                    </button>
                  </div>

                  <p className="text-xs text-foreground/45 leading-relaxed mb-3">{activeAgent.desc}</p>

                  {/* Why you need — persuasive */}
                  <div className="rounded-lg border p-3 mb-4" style={{ borderColor: `${activeAgent.glow}15`, background: `${activeAgent.glow}08` }}>
                    <p className="text-xs leading-[1.6]">
                      <strong className="text-foreground/80">⚡ Perché ti serve:</strong>{" "}
                      <span className="text-foreground/55">{activeAgent.whyNeed}</span>
                    </p>
                  </div>

                  {/* Capabilities */}
                  <div className="grid grid-cols-2 gap-1.5 mb-4">
                    {activeAgent.capabilities.map((cap, ci) => (
                      <div key={ci} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-foreground/[0.05] bg-foreground/[0.02]">
                        <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: activeAgent.glow }}
                          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: ci * 0.2 }} />
                        <span className="text-[0.55rem] text-foreground/50">{cap}</span>
                      </div>
                    ))}
                  </div>

                  {/* Connected agents */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <Network className="w-3 h-3 text-primary/40" />
                    <span className="text-[0.5rem] font-bold text-primary/40 tracking-widest uppercase">
                      Connesso a {activeAgent.connections.length} agenti
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeAgent.connections.map((connId) => {
                      const conn = ALL_AGENTS.find((a) => a.id === connId);
                      if (!conn) return null;
                      return (
                        <button key={connId} onClick={(e) => { e.stopPropagation(); setExpandedAgent(connId); }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary/15 bg-primary/[0.04] hover:bg-primary/[0.08] transition-colors">
                          <div className="w-5 h-5 rounded-full overflow-hidden border" style={{ borderColor: `${conn.glow}40` }}>
                            <img src={AGENT_PHOTOS[conn.id]} alt={conn.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[0.5rem] font-semibold text-foreground/60">{conn.name}</span>
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
           SPATIAL NETWORK GRID — spread out
           ═══════════════════════════════════ */}
        <div className="relative" ref={networkRef}>
          <AlwaysOnNetwork agents={filteredAgents} activeId={expandedAgent} containerRef={networkRef} />

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-10 sm:gap-x-12 sm:gap-y-14 lg:gap-x-16 lg:gap-y-16 mb-8 relative z-[5]"
            style={{
              /* Offset alternating rows for honeycomb / network feel */
            }}
          >
            {filteredAgents.map((agent, i) => (
              <div key={agent.id}
                style={{
                  /* Offset every other item vertically for spatial feel */
                  marginTop: i % 2 === 1 ? "28px" : "0",
                }}
              >
                <NetworkNode
                  agent={agent}
                  isActive={expandedAgent === agent.id}
                  isConnected={connectedIds.has(agent.id)}
                  onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                  index={i}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ══════ NEURAL BUS ══════ */}
        <motion.div className="relative h-12 sm:h-16 my-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-primary/10" />

          {[8, 22, 36, 50, 64, 78, 92].map((x, i) => (
            <motion.div key={i}
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-primary/20"
              style={{ left: `${x}%`, background: "hsl(var(--background))" }}
              animate={{ borderColor: ["hsl(var(--primary) / 0.15)", "hsl(var(--primary) / 0.4)", "hsl(var(--primary) / 0.15)"] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              <motion.div className="absolute inset-[2px] rounded-full bg-primary/30"
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

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-background/90 backdrop-blur-sm">
            <motion.div className="w-2 h-2 rounded-full bg-primary/50"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }} />
            <CircuitBoard className="w-3.5 h-3.5 text-primary/50" />
            <span className="text-[0.5rem] font-bold text-primary/50 tracking-[2px] uppercase">Neural Bus</span>
            <motion.div className="w-2 h-2 rounded-full bg-accent/50"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }} />
          </div>
        </motion.div>

        {/* ══════ IMPACT STATS ══════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-xl border border-foreground/[0.06] bg-card/30 backdrop-blur-sm p-5 sm:p-8 overflow-hidden mb-8 mt-4">
          <div className="absolute top-0 left-0 right-0 h-px">
            <motion.div className="absolute w-12 h-full bg-primary/30"
              animate={{ left: ["-10%", "110%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
          </div>
          <div className="text-center mb-5">
            <h3 className="font-bold text-sm sm:text-lg text-foreground mb-1">Impatto Misurabile</h3>
            <p className="text-foreground/35 text-[0.6rem] sm:text-xs">Risultati reali dei nostri clienti nei primi 90 giorni</p>
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
                className="text-center p-3 rounded-xl border border-foreground/[0.06] bg-background/40 hover:border-primary/15 transition-colors">
                <div className="text-primary/50 flex justify-center mb-1.5">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-0.5">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[0.55rem] sm:text-xs font-semibold text-foreground/60">{stat.label}</div>
                <div className="text-[0.45rem] sm:text-[0.55rem] text-foreground/30 mt-0.5">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
