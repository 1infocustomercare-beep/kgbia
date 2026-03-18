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
  Settings, Receipt, ScanLine, Camera, X, ChevronDown
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
interface AgentNode {
  id: string; name: string; role: string; desc: string; whyNeed: string;
  icon: React.ReactNode; gradient: string; glow: string;
  stat: { value: number; suffix: string; label: string };
  capabilities: string[]; category: string; sectors: string[];
  connections: string[];
}

const ALL_AGENTS: AgentNode[] = [
  { id: "ghost-manager", name: "GhostManager™", role: "Direttore Operativo IA", desc: "Manager virtuale che monitora ordini, ottimizza turni, rileva anomalie e prende decisioni operative in tempo reale — 24/7.", whyNeed: "Senza un manager IA, perdi ore in micro-decisioni. Con GhostManager™ tutto funziona da solo.", icon: <Bot className="w-5 h-5" />, gradient: "from-violet-500 to-purple-600", glow: "hsla(265,80%,60%,1)", stat: { value: 24, suffix: "/7", label: "Operativo" }, capabilities: ["Gestione ordini autonoma", "Ottimizzazione turni", "Alert anomalie", "Decisioni predittive"], category: "operations", sectors: ["all"], connections: ["kitchen-commander", "predictive-engine", "concierge-ai"] },
  { id: "concierge-ai", name: "Concierge AI", role: "Assistente Clienti 24/7", desc: "Risponde ai clienti via chat in 12+ lingue, gestisce prenotazioni, suggerisce prodotti e risolve problemi istantaneamente.", whyNeed: "Ogni cliente senza risposta è un cliente perso. Concierge AI risponde in 3 secondi, 24/7.", icon: <MessageSquare className="w-5 h-5" />, gradient: "from-sky-500 to-blue-600", glow: "hsla(210,80%,55%,1)", stat: { value: 12, suffix: "+", label: "Lingue" }, capabilities: ["Chat multilingue", "Prenotazioni auto", "Upselling IA", "Risoluzione problemi"], category: "concierge", sectors: ["all"], connections: ["ghost-manager", "loyalty-angel", "autopilot-marketing"] },
  { id: "predictive-engine", name: "Predictive Engine", role: "Analista Predittivo", desc: "Analizza pattern di vendita, previsione domanda, trend stagionali e comportamento clienti. Ti dice PRIMA cosa succederà.", whyNeed: "Senza dati predittivi navighi alla cieca. Predictive Engine ti dice cosa succederà PRIMA.", icon: <BarChart3 className="w-5 h-5" />, gradient: "from-emerald-500 to-teal-600", glow: "hsla(160,70%,45%,1)", stat: { value: 45, suffix: "%", label: "↑ Revenue" }, capabilities: ["Previsione domanda", "Analisi trend", "Segmentazione clienti", "Report IA"], category: "analytics", sectors: ["all"], connections: ["ghost-manager", "autopilot-marketing", "dynamic-pricing"] },
  { id: "autopilot-marketing", name: "AutoPilot Marketing", role: "Growth Hacker Autonomo", desc: "Campagne email, WhatsApp e push basate su comportamenti reali. Recupera clienti persi, premia i fedeli — tutto in automatico.", whyNeed: "Il 68% dei clienti non torna senza follow-up. AutoPilot li riattiva a costo zero.", icon: <Rocket className="w-5 h-5" />, gradient: "from-amber-400 to-orange-500", glow: "hsla(35,90%,55%,1)", stat: { value: 3, suffix: "×", label: "ROI Marketing" }, capabilities: ["Campagne comportamentali", "Recupero clienti", "Push & WhatsApp auto", "A/B testing"], category: "content", sectors: ["all"], connections: ["predictive-engine", "loyalty-angel", "social-creator", "concierge-ai"] },
  { id: "chef-intelligence", name: "Chef Intelligence", role: "Assistente Culinario IA", desc: "Menu completi con foto, allergeni, traduzioni e prezzi ottimizzati. Food cost automatico per ogni piatto.", whyNeed: "Ogni errore nel menu costa clienti. Chef Intelligence crea menu perfetti in 60 secondi.", icon: <ChefHat className="w-5 h-5" />, gradient: "from-orange-500 to-amber-500", glow: "hsla(30,90%,55%,1)", stat: { value: 60, suffix: "s", label: "Menu pronto" }, capabilities: ["Menu IA in 60s", "Food cost auto", "Allergeni & traduzioni", "Foto piatti pro"], category: "operations", sectors: ["food", "bakery"], connections: ["kitchen-commander", "sommelier-ia"] },
  { id: "kitchen-commander", name: "Kitchen Commander", role: "Gestione Cucina Live", desc: "Dashboard cucina in tempo reale con priorità ordini, timer intelligenti e coordinamento automatico delle comande.", whyNeed: "Una cucina caotica brucia margini. Kitchen Commander elimina errori e coordina tutto.", icon: <Clock className="w-5 h-5" />, gradient: "from-red-500 to-rose-600", glow: "hsla(0,80%,55%,1)", stat: { value: 40, suffix: "%", label: "↓ Tempi attesa" }, capabilities: ["Ordini prioritizzati", "Timer intelligenti", "Comande coordinate", "Alert ritardi"], category: "operations", sectors: ["food"], connections: ["ghost-manager", "chef-intelligence"] },
  { id: "sommelier-ia", name: "Sommelier IA", role: "Esperto Abbinamenti", desc: "Suggerisce abbinamenti vino-piatto perfetti, aumentando lo scontrino medio con upselling naturale.", whyNeed: "Il 70% dei clienti non ordina vino perché non sa scegliere. Sommelier IA aumenta lo scontrino del 35%.", icon: <Target className="w-5 h-5" />, gradient: "from-purple-500 to-violet-600", glow: "hsla(270,70%,55%,1)", stat: { value: 35, suffix: "%", label: "↑ Scontrino" }, capabilities: ["Abbinamenti vino-piatto", "Upselling naturale", "Carta vini dinamica", "Suggerimenti AI"], category: "sales", sectors: ["food"], connections: ["chef-intelligence", "concierge-ai"] },
  { id: "review-shield", name: "Review Shield™", role: "Protezione Reputazione", desc: "Intercetta le recensioni negative PRIMA che arrivino su Google. Solo i feedback positivi vengono pubblicati online.", whyNeed: "Una sola recensione negativa costa 30 clienti. Review Shield™ le intercetta prima.", icon: <Shield className="w-5 h-5" />, gradient: "from-emerald-500 to-green-600", glow: "hsla(150,70%,45%,1)", stat: { value: 95, suffix: "%", label: "★ Positive" }, capabilities: ["Intercettazione feedback", "Filtro recensioni", "Alert negativi", "Boost positivi"], category: "compliance", sectors: ["all"], connections: ["concierge-ai", "autopilot-marketing"] },
  { id: "smart-dispatcher", name: "Smart Dispatcher", role: "Assegnazione Intelligente", desc: "Assegna corse all'autista perfetto per posizione, lingua, veicolo e disponibilità — in 3 secondi.", whyNeed: "Assegnare corse manualmente crea ritardi. Smart Dispatcher trova l'autista perfetto in 3 secondi.", icon: <Car className="w-5 h-5" />, gradient: "from-amber-400 to-yellow-500", glow: "hsla(40,90%,55%,1)", stat: { value: 30, suffix: "%", label: "↑ Efficienza" }, capabilities: ["Assegnazione automatica", "Matching veicolo-cliente", "Percorsi ottimali", "Disponibilità real-time"], category: "operations", sectors: ["ncc"], connections: ["dynamic-pricing", "ghost-manager"] },
  { id: "dynamic-pricing", name: "Dynamic Pricing", role: "Tariffe Intelligenti", desc: "Tariffe dinamiche basate su distanza, traffico, domanda, stagione ed eventi — massimizzando i ricavi per corsa.", whyNeed: "Tariffe fisse = soldi persi. Dynamic Pricing adatta i prezzi alla domanda reale.", icon: <Wallet className="w-5 h-5" />, gradient: "from-emerald-500 to-teal-500", glow: "hsla(160,70%,50%,1)", stat: { value: 25, suffix: "%", label: "↑ Revenue" }, capabilities: ["Prezzi dinamici", "Surge pricing eventi", "Analisi concorrenza", "Margine ottimizzato"], category: "analytics", sectors: ["ncc", "beach", "hotel"], connections: ["predictive-engine", "smart-dispatcher", "revenue-manager"] },
  { id: "smart-agenda", name: "Smart Agenda", role: "Ottimizzatore Appuntamenti", desc: "Riempie i buchi in agenda, previene no-show con reminder intelligenti e accetta prenotazioni 24/7 online.", whyNeed: "Ogni buco in agenda è fatturato perso. Smart Agenda riduce i no-show dell'85%.", icon: <Calendar className="w-5 h-5" />, gradient: "from-pink-500 to-rose-500", glow: "hsla(340,80%,55%,1)", stat: { value: 85, suffix: "%", label: "↓ No-show" }, capabilities: ["Anti no-show 85%", "Buchi riempiti", "Reminder multicanale", "Booking 24/7"], category: "operations", sectors: ["beauty", "healthcare"], connections: ["concierge-ai", "autopilot-marketing"] },
  { id: "loyalty-angel", name: "Loyalty Angel", role: "Fidelizzazione Clienti", desc: "Identifica clienti a rischio abbandono e attiva campagne automatiche di riattivazione con offerte personalizzate.", whyNeed: "Acquisire un nuovo cliente costa 7× di più che mantenerne uno. Loyalty Angel li riattiva prima che vadano via.", icon: <Heart className="w-5 h-5" />, gradient: "from-rose-400 to-pink-500", glow: "hsla(350,75%,60%,1)", stat: { value: 3, suffix: "×", label: "Tasso ritorno" }, capabilities: ["Alert clienti inattivi", "Offerte personalizzate", "Compleanno auto", "WhatsApp marketing"], category: "sales", sectors: ["beauty", "retail", "fitness"], connections: ["concierge-ai", "autopilot-marketing", "predictive-engine"] },
  { id: "social-creator", name: "Social Creator", role: "Generatore Contenuti", desc: "Crea post Instagram, stories e newsletter automaticamente con descrizioni accattivanti e hashtag ottimizzati.", whyNeed: "Senza social costanti diventi invisibile. Social Creator pubblica per te ogni giorno — 5× engagement.", icon: <Globe className="w-5 h-5" />, gradient: "from-violet-500 to-indigo-500", glow: "hsla(260,70%,55%,1)", stat: { value: 5, suffix: "×", label: "Engagement" }, capabilities: ["Post Instagram auto", "Stories template", "Newsletter", "Hashtag ottimizzati"], category: "content", sectors: ["all"], connections: ["autopilot-marketing", "chef-intelligence"] },
  { id: "triage-ia", name: "Triage IA", role: "Pre-valutazione Intelligente", desc: "Pre-valuta le richieste dei pazienti, assegna priorità e indirizza allo specialista corretto.", whyNeed: "Pazienti indirizzati male = tempo sprecato. Triage IA assegna lo specialista giusto al primo contatto.", icon: <Heart className="w-5 h-5" />, gradient: "from-teal-500 to-cyan-500", glow: "hsla(180,70%,50%,1)", stat: { value: 70, suffix: "%", label: "↓ Attese" }, capabilities: ["Pre-screening", "Priorità auto", "Routing specialista", "Riduzione attese"], category: "operations", sectors: ["healthcare"], connections: ["smart-agenda", "concierge-ai"] },
  { id: "revenue-manager", name: "Revenue Manager IA", role: "Tariffe Dinamiche Hotel", desc: "Tariffe ottimali basate su domanda, eventi, meteo, competitor — massimizzando il RevPAR automaticamente.", whyNeed: "Tariffe fisse = soldi persi ogni notte. Revenue Manager ottimizza i prezzi in tempo reale.", icon: <TrendingUp className="w-5 h-5" />, gradient: "from-amber-400 to-yellow-500", glow: "hsla(45,90%,55%,1)", stat: { value: 35, suffix: "%", label: "↑ RevPAR" }, capabilities: ["Yield management", "Competitor analysis", "Evento detection", "RevPAR ottimizzato"], category: "analytics", sectors: ["hotel"], connections: ["dynamic-pricing", "predictive-engine"] },
  { id: "retention-ai", name: "Retention AI", role: "Anti-Abbandono Soci", desc: "Identifica soci a rischio cancellazione e attiva campagne di retention automatiche — prima che se ne vadano.", whyNeed: "Il 40% dei soci abbandona nei primi 3 mesi. Retention AI li identifica PRIMA.", icon: <Users className="w-5 h-5" />, gradient: "from-lime-500 to-green-500", glow: "hsla(100,70%,50%,1)", stat: { value: 60, suffix: "%", label: "↓ Churn" }, capabilities: ["Previsione churn", "Alert soci inattivi", "Campagne automatiche", "Win-back personalizzato"], category: "sales", sectors: ["fitness"], connections: ["loyalty-angel", "autopilot-marketing"] },
  { id: "field-dispatcher", name: "Field Dispatcher", role: "Coordinamento Interventi", desc: "Assegna interventi al tecnico più vicino, ottimizza percorsi e invia conferme automatiche ai clienti.", whyNeed: "Senza routing ottimizzato i tecnici perdono ore nel traffico. Field Dispatcher fa 40% interventi in più.", icon: <Workflow className="w-5 h-5" />, gradient: "from-blue-500 to-indigo-500", glow: "hsla(230,70%,55%,1)", stat: { value: 40, suffix: "%", label: "↑ Interventi/giorno" }, capabilities: ["Assegnazione smart", "Ottimizzazione percorsi", "GPS tracking", "Conferme auto"], category: "operations", sectors: ["trades"], connections: ["smart-dispatcher", "ghost-manager"] },
  { id: "beach-booker", name: "Beach Booker IA", role: "Prenotazioni Spiaggia", desc: "Mappa interattiva con disponibilità real-time. Prenotazione ombrellone, lettino e servizi 24/7 — zero telefonate.", whyNeed: "Ogni telefonata = 3 minuti persi × 50/giorno = 2.5 ore sprecate. Beach Booker elimina l'80%.", icon: <Umbrella className="w-5 h-5" />, gradient: "from-cyan-500 to-blue-500", glow: "hsla(190,80%,55%,1)", stat: { value: 80, suffix: "%", label: "↓ Telefonate" }, capabilities: ["Mappa interattiva", "Booking 24/7", "Pagamento anticipato", "Conferme auto"], category: "operations", sectors: ["beach"], connections: ["concierge-ai", "dynamic-pricing"] },
  { id: "stock-intelligence", name: "Stock Intelligence", role: "Inventario Predittivo", desc: "Monitora scorte in tempo reale, prevede la domanda e genera ordini di riassortimento automatici.", whyNeed: "Ogni prodotto esaurito = vendita persa. Stock Intelligence prevede e riordina PRIMA.", icon: <Package className="w-5 h-5" />, gradient: "from-cyan-500 to-blue-500", glow: "hsla(200,75%,55%,1)", stat: { value: 0, suffix: "", label: "Rotture stock" }, capabilities: ["Alert scorte minime", "Riordino auto", "Previsione domanda", "Analytics prodotto"], category: "operations", sectors: ["retail"], connections: ["predictive-engine", "ghost-manager"] },
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

const TOTAL_AGENTS_COUNT = 95;

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
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feFlood floodColor="hsl(var(--primary))" floodOpacity="0.15" result="flood" />
          <feComposite in="flood" in2="blur" operator="in" result="colorBlur" />
          <feMerge>
            <feMergeNode in="colorBlur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="line-glow-soft">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="line-gradient-idle" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(215 60% 65%)" stopOpacity="0.15" />
          <stop offset="50%" stopColor="hsl(215 60% 70%)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(215 60% 65%)" stopOpacity="0.15" />
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

        /* ── Always visible: idle = softer/slower, active = bright/fast ── */
        const lineOpacity = isActive ? 0.7 : 0.35;
        const lineWidth = isActive ? 2 : 0.9;
        const dash = isActive ? "8 5" : "3 6";
        const particleColor = isActive ? line.color : "hsla(215,50%,65%,0.55)";
        const lineColor = isActive ? line.color : "hsla(215,35%,55%,0.4)";
        const junctionR = isActive ? 3 : 2;
        const junctionOpacity = isActive ? 0.65 : 0.3;
        const particleDur = isActive ? "1.6s" : "5s";
        const particleR = isActive ? 3.5 : 2;
        const stagger = `${(li * 0.6) % 3}s`;

        return (
          <g key={line.id}>
            {/* Glow line — always on, stronger when active */}
            <path d={pathD} fill="none" stroke={lineColor}
              strokeWidth={isActive ? 5 : 3}
              opacity={isActive ? 0.12 : 0.04}
              filter="url(#line-glow)" />

            {/* Main connection line — always visible */}
            <path d={pathD} fill="none" stroke={lineColor}
              strokeWidth={lineWidth}
              strokeDasharray={dash}
              opacity={lineOpacity}
              filter="url(#line-glow-soft)"
            />

            {/* Junction dots — always visible */}
            <circle cx={line.x1} cy={line.y1} r={junctionR}
              fill={lineColor} opacity={junctionOpacity} />
            <circle cx={line.x2} cy={line.y2} r={junctionR}
              fill={lineColor} opacity={junctionOpacity} />

            {/* Flowing particle — always animating */}
            <circle r={particleR} fill={particleColor}
              filter={isActive ? "url(#line-glow)" : "url(#line-glow-soft)"}>
              <animateMotion dur={particleDur} repeatCount="indefinite" path={pathD} begin={stagger} />
            </circle>

            {/* Reverse particle — always present, faster when active */}
            <circle r={isActive ? 2.5 : 1.5} fill={particleColor} opacity={isActive ? 0.55 : 0.3}>
              <animateMotion dur={isActive ? "2.2s" : "7s"} repeatCount="indefinite"
                path={reversePath} begin={`${(li * 0.9 + 1.2) % 4}s`} />
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

    {[0, 1].map((i) => (
      <motion.div key={i} className="absolute left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.08), transparent)" }}
        animate={{ top: ["-5%", "105%"] }}
        transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear", delay: i * 4 }}
      />
    ))}

    {[15, 50, 85].map((x, i) => (
      <div key={i} className="absolute top-0 bottom-0 w-px opacity-[0.03]" style={{ left: `${x}%`, background: "hsl(var(--primary))" }}>
        <motion.div className="absolute h-16 w-full left-0 rounded-full"
          style={{ background: "hsl(var(--primary))", opacity: 0.6 }}
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 12 + i * 3, repeat: Infinity, ease: "linear", delay: i * 2 }}
        />
      </div>
    ))}

    <div className="absolute w-[500px] h-[500px] rounded-full blur-[200px] opacity-[0.04] top-1/4 left-1/4" style={{ background: "hsl(var(--primary))" }} />
    <div className="absolute w-[400px] h-[400px] rounded-full blur-[180px] opacity-[0.03] bottom-1/4 right-1/4" style={{ background: "hsl(var(--accent))" }} />
  </div>
);

/* ═══ ROBOT AVATAR — gradient icon node ═══ */
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

      {/* Circuit pattern overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" viewBox="0 0 60 60">
        <line x1="0" y1="15" x2="60" y2="15" stroke="white" strokeWidth="0.3" />
        <line x1="0" y1="30" x2="60" y2="30" stroke="white" strokeWidth="0.3" />
        <line x1="0" y1="45" x2="60" y2="45" stroke="white" strokeWidth="0.3" />
        <line x1="15" y1="0" x2="15" y2="60" stroke="white" strokeWidth="0.3" />
        <line x1="30" y1="0" x2="30" y2="60" stroke="white" strokeWidth="0.3" />
        <line x1="45" y1="0" x2="45" y2="60" stroke="white" strokeWidth="0.3" />
        <circle cx="15" cy="15" r="1.5" fill="white" opacity="0.4" />
        <circle cx="45" cy="15" r="1.5" fill="white" opacity="0.4" />
        <circle cx="15" cy="45" r="1.5" fill="white" opacity="0.4" />
        <circle cx="45" cy="45" r="1.5" fill="white" opacity="0.4" />
        <circle cx="30" cy="30" r="2" fill="white" opacity="0.3" />
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
      {/* Outer glow */}
      {(isActive || isConnected) && (
        <motion.div
          className="absolute rounded-xl pointer-events-none"
          style={{
            width: isActive ? 72 : 60,
            height: isActive ? 72 : 60,
            top: "50%", left: "50%", transform: "translate(-50%, -55%)",
            background: `radial-gradient(circle, ${agent.glow}18 0%, transparent 70%)`,
            boxShadow: isActive ? `0 0 30px ${agent.glow}20` : `0 0 15px ${agent.glow}12`,
          }}
          animate={isActive ? { scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] } : { opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Robot avatar node */}
      <div className="relative z-10 mb-1">
        <RobotAvatar agent={agent} size={44} isActive={isActive} isConnected={isConnected} />

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
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-[1px] rounded-full text-[0.42rem] font-bold whitespace-nowrap z-20 border border-foreground/10"
          style={{ background: "hsla(var(--background) / 0.92)", backdropFilter: "blur(6px)", color: agent.glow }}>
          <Counter value={agent.stat.value} suffix={agent.stat.suffix} />{" "}
          <span className="text-foreground/60 text-[0.35rem]">{agent.stat.label}</span>
        </div>

        {/* Cardinal connection dots */}
        {(["top", "bottom", "left", "right"] as const).map((pos) => (
          <motion.div key={pos}
            className="absolute w-1 h-1 rounded-full z-20"
            style={{
              background: isActive || isConnected ? agent.glow : "hsla(var(--primary) / 0.15)",
              boxShadow: isActive ? `0 0 6px ${agent.glow}` : "none",
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
      <div className="text-center max-w-[68px] sm:max-w-[100px]">
        <h3 className="font-bold text-[0.48rem] sm:text-[0.6rem] text-foreground leading-tight truncate">
          {agent.name}
        </h3>
        <p className="text-[0.36rem] sm:text-[0.44rem] text-primary/85 tracking-wider uppercase truncate">
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
          className="relative rounded-xl border border-primary/25 bg-card/85 backdrop-blur-sm p-4 sm:p-6 mb-8 sm:mb-12 overflow-hidden">
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
        <div className="flex gap-1 justify-center flex-wrap mb-6 sm:mb-8 px-2">
          {SECTOR_TABS.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveSector(tab.id); setExpandedAgent(null); }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[0.5rem] sm:text-[0.55rem] font-semibold tracking-wider uppercase transition-all border ${
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
          className="mb-5 flex items-center gap-2 px-1">
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
              className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-3 gap-y-5 sm:gap-x-8 sm:gap-y-10 lg:gap-x-12 lg:gap-y-14 mb-6 relative z-[5]"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredAgents.map((agent, i) => (
                  <motion.div key={agent.id}
                    layout
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1, marginTop: i % 2 === 1 ? 28 : 0 }}
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

        {/* ══════ NEURAL BUS ══════ */}
        <motion.div className="relative h-12 sm:h-16 my-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
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
          className="relative rounded-xl border border-border bg-card/80 backdrop-blur-sm p-5 sm:p-8 overflow-hidden mb-8 mt-4">
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
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-0.5">
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
          className="text-center py-6">
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
