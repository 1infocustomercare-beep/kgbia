import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Bot, Brain, Zap, TrendingUp, Shield, Sparkles,
  ChefHat, Car, Scissors, Heart, Store, Dumbbell, Building,
  Clock, Target, Wallet, Users, BarChart3, Bell, Cpu,
  Workflow, ArrowRight, Crown, Rocket, Eye, Radio,
  MessageSquare, Layers, Fingerprint, Globe, Timer
} from "lucide-react";

/* ── Animated counter ── */
const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let s = 0;
    const step = (ts: number) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 2000, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);
  return <span ref={ref}>{n}{suffix}</span>;
};

/* ── Neural pulse line ── */
const NeuralPulse = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
    style={{ width: "100%", top: "50%" }}
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
    transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

/* ── Data ── */
interface AgentData {
  id: string; icon: React.ReactNode; name: string; role: string; desc: string;
  capabilities: string[]; gradient: string; glow: string;
  stat: { value: number; suffix: string; label: string };
  whyNeed: string;
}

const GENERIC_AGENTS: AgentData[] = [
  {
    id: "ghost-manager", icon: <Bot className="w-5 h-5" />, name: "GhostManager™", role: "Direttore Operativo Autonomo",
    desc: "Il tuo manager virtuale che non dorme mai. Monitora ordini, ottimizza turni, rileva anomalie e prende decisioni operative in tempo reale.",
    capabilities: ["Gestione ordini autonoma", "Ottimizzazione turni staff", "Alert anomalie istantanei", "Decisioni predittive"],
    gradient: "from-violet-500 to-purple-600", glow: "hsl(265, 80%, 60%)",
    stat: { value: 24, suffix: "/7", label: "Operativo" },
    whyNeed: "Senza un manager IA, perdi ore ogni giorno in micro-decisioni operative. Con GhostManager™, tutto funziona da solo — anche quando dormi."
  },
  {
    id: "concierge-ai", icon: <MessageSquare className="w-5 h-5" />, name: "Concierge AI", role: "Assistente Clienti Intelligente",
    desc: "Risponde ai clienti in tempo reale via chat, gestisce prenotazioni, suggerisce prodotti e risolve problemi — parlando 12+ lingue.",
    capabilities: ["Chat multilingue 24/7", "Prenotazioni automatiche", "Upselling intelligente", "Risoluzione problemi"],
    gradient: "from-sky-500 to-blue-600", glow: "hsl(210, 80%, 55%)",
    stat: { value: 12, suffix: "+", label: "Lingue" },
    whyNeed: "Ogni cliente senza risposta è un cliente perso. Concierge AI risponde in 3 secondi, 24/7, in ogni lingua — convertendo richieste in prenotazioni."
  },
  {
    id: "analytics-engine", icon: <BarChart3 className="w-5 h-5" />, name: "Predictive Engine", role: "Analista Predittivo",
    desc: "Analizza pattern di vendita, previsione domanda, trend stagionali e comportamento clienti. Ti dice PRIMA cosa succederà.",
    capabilities: ["Previsione domanda", "Analisi trend automatica", "Segmentazione clienti AI", "Report generati da IA"],
    gradient: "from-emerald-500 to-teal-600", glow: "hsl(160, 70%, 45%)",
    stat: { value: 45, suffix: "%", label: "↑ Revenue" },
    whyNeed: "Senza dati predittivi, navighi alla cieca. Con Predictive Engine, sai PRIMA cosa succederà — e agisci per massimizzare i ricavi."
  },
  {
    id: "auto-marketing", icon: <Rocket className="w-5 h-5" />, name: "AutoPilot Marketing", role: "Growth Hacker Autonomo",
    desc: "Lancia campagne email, WhatsApp e push basate su comportamenti reali. Recupera clienti persi, premia i fedeli — tutto in automatico.",
    capabilities: ["Campagne comportamentali", "Recupero clienti inattivi", "Push & WhatsApp auto", "A/B testing continuo"],
    gradient: "from-amber-400 to-orange-500", glow: "hsl(35, 90%, 55%)",
    stat: { value: 3, suffix: "×", label: "ROI Marketing" },
    whyNeed: "Il 68% dei clienti non torna senza follow-up. AutoPilot li riattiva automaticamente, generando revenue ricorrente a costo zero."
  },
];

const SECTOR_AGENTS: Record<string, AgentData[]> = {
  food: [
    { id: "chef-ai", icon: <ChefHat className="w-5 h-5" />, name: "Chef Intelligence", role: "Assistente Culinario IA", desc: "Genera menu completi con foto, allergeni, traduzioni e suggerimenti di prezzo. Analizza il food cost per piatto e suggerisce ottimizzazioni.", capabilities: ["Menu IA in 60 secondi", "Food cost automatico", "Allergeni & traduzioni", "Foto piatti professionali"], gradient: "from-orange-500 to-amber-500", glow: "hsl(30, 90%, 55%)", stat: { value: 60, suffix: "s", label: "Menu pronto" }, whyNeed: "Ogni errore nel menu costa clienti. Chef Intelligence crea menu perfetti con foto, allergeni e traduzioni automatiche — in 60 secondi." },
    { id: "kitchen-ops", icon: <Clock className="w-5 h-5" />, name: "Kitchen Commander", role: "Gestione Cucina Live", desc: "Dashboard cucina in tempo reale con priorità ordini, timer intelligenti, notifiche e coordinamento automatico delle comande.", capabilities: ["Ordini prioritizzati", "Timer intelligenti", "Coordinamento comande", "Alert ritardi"], gradient: "from-red-500 to-rose-600", glow: "hsl(0, 80%, 55%)", stat: { value: 40, suffix: "%", label: "↓ Tempi attesa" }, whyNeed: "Una cucina caotica brucia margini. Kitchen Commander elimina errori, riduce i tempi e coordina ogni piatto — zero comande perse." },
    { id: "sommelier", icon: <Target className="w-5 h-5" />, name: "Sommelier IA", role: "Esperto Abbinamenti", desc: "Suggerisce abbinamenti vino-piatto perfetti ai clienti, aumentando lo scontrino medio con upselling intelligente e naturale.", capabilities: ["Abbinamenti vino-piatto", "Upselling naturale", "Carta vini dinamica", "Suggerimenti personalizzati"], gradient: "from-purple-500 to-violet-600", glow: "hsl(270, 70%, 55%)", stat: { value: 35, suffix: "%", label: "↑ Scontrino" }, whyNeed: "Il 70% dei clienti non ordina vino perché non sa cosa scegliere. Il Sommelier IA suggerisce l'abbinamento perfetto — aumentando lo scontrino del 35%." },
    { id: "review-shield", icon: <Shield className="w-5 h-5" />, name: "Review Shield™", role: "Protezione Reputazione", desc: "Intercetta le recensioni negative prima che arrivino su Google. Solo i feedback positivi vengono pubblicati, proteggendo la tua reputazione online.", capabilities: ["Intercettazione feedback", "Filtro recensioni", "Alert negativi", "Boost positivi"], gradient: "from-emerald-500 to-green-600", glow: "hsl(150, 70%, 45%)", stat: { value: 95, suffix: "%", label: "★ Positive" }, whyNeed: "Una sola recensione negativa può costare 30 clienti. Review Shield™ le intercetta PRIMA — e trasforma i clienti insoddisfatti in fan." },
  ],
  beauty: [
    { id: "agenda-ai", icon: <Calendar className="w-5 h-5" />, name: "Smart Agenda", role: "Ottimizzatore Appuntamenti", desc: "Gestisce l'agenda automaticamente, riempie i buchi, previene i no-show con reminder intelligenti e suggerisce orari alternativi ai clienti.", capabilities: ["Anti no-show 85%", "Buchi agenda riempiti", "Reminder multicanale", "Prenotazione online 24/7"], gradient: "from-pink-500 to-rose-500", glow: "hsl(340, 80%, 55%)", stat: { value: 85, suffix: "%", label: "↓ No-show" }, whyNeed: "Ogni buco in agenda è fatturato perso. Smart Agenda riempie gli spazi vuoti e riduce i no-show dell'85% — automaticamente." },
    { id: "beauty-upsell", icon: <Sparkles className="w-5 h-5" />, name: "Beauty Advisor IA", role: "Consulente Trattamenti", desc: "Analizza lo storico trattamenti di ogni cliente e suggerisce servizi complementari perfetti, aumentando lo scontrino medio in modo naturale.", capabilities: ["Suggerimenti trattamenti", "Storico skin-care", "Pacchetti personalizzati", "Cross-selling naturale"], gradient: "from-fuchsia-500 to-purple-500", glow: "hsl(300, 70%, 55%)", stat: { value: 40, suffix: "%", label: "↑ Scontrino" }, whyNeed: "Le clienti vogliono consigli personalizzati. Beauty Advisor analizza lo storico e suggerisce il trattamento perfetto — aumentando la spesa del 40%." },
    { id: "beauty-retention", icon: <Heart className="w-5 h-5" />, name: "Loyalty Angel", role: "Fidelizzazione Clienti", desc: "Identifica le clienti a rischio abbandono e attiva campagne automatiche di riattivazione con offerte personalizzate su WhatsApp.", capabilities: ["Alert clienti inattive", "Offerte personalizzate", "Compleanno automatico", "WhatsApp marketing"], gradient: "from-rose-400 to-pink-500", glow: "hsl(350, 75%, 60%)", stat: { value: 3, suffix: "×", label: "Tasso ritorno" }, whyNeed: "Acquisire una nuova cliente costa 7× di più che mantenerne una. Loyalty Angel le riattiva automaticamente — prima che vadano dalla concorrenza." },
    { id: "beauty-social", icon: <Globe className="w-5 h-5" />, name: "Social Creator", role: "Generatore Contenuti", desc: "Crea post Instagram, stories e newsletter automaticamente con foto dei tuoi lavori, descrizioni accattivanti e hashtag ottimizzati.", capabilities: ["Post Instagram auto", "Stories template", "Newsletter settimanali", "Hashtag ottimizzati"], gradient: "from-violet-500 to-indigo-500", glow: "hsl(260, 70%, 55%)", stat: { value: 5, suffix: "×", label: "Engagement" }, whyNeed: "Senza social costanti, il tuo salone diventa invisibile. Social Creator pubblica per te ogni giorno — 5× più engagement con zero fatica." },
  ],
  ncc: [
    { id: "ncc-dispatcher", icon: <Car className="w-5 h-5" />, name: "Smart Dispatcher", role: "Assegnazione Intelligente", desc: "Assegna automaticamente le corse all'autista più adatto basandosi su posizione, lingua del cliente, tipo veicolo e disponibilità in tempo reale.", capabilities: ["Assegnazione automatica", "Matching veicolo-cliente", "Ottimizzazione percorsi", "Disponibilità real-time"], gradient: "from-amber-400 to-yellow-500", glow: "hsl(40, 90%, 55%)", stat: { value: 30, suffix: "%", label: "↑ Efficienza" }, whyNeed: "Assegnare corse manualmente crea ritardi e errori. Smart Dispatcher trova l'autista perfetto in 3 secondi — massimizzando ogni corsa." },
    { id: "ncc-pricing", icon: <Wallet className="w-5 h-5" />, name: "Dynamic Pricing", role: "Tariffe Intelligenti", desc: "Calcola tariffe dinamiche basate su distanza, traffico, domanda, stagione ed eventi speciali — massimizzando i ricavi per ogni corsa.", capabilities: ["Prezzi dinamici", "Surge pricing eventi", "Analisi concorrenza", "Margine ottimizzato"], gradient: "from-emerald-500 to-teal-500", glow: "hsl(160, 70%, 50%)", stat: { value: 25, suffix: "%", label: "↑ Revenue" }, whyNeed: "Tariffe fisse = soldi persi. Dynamic Pricing adatta i prezzi alla domanda reale — guadagni di più nei momenti di picco, senza perdere clienti." },
    { id: "ncc-concierge", icon: <MessageSquare className="w-5 h-5" />, name: "Travel Concierge", role: "Assistente VIP Multilingue", desc: "Risponde ai clienti internazionali in 12+ lingue, gestisce prenotazioni, suggerisce upgrade e offre un servizio concierge premium 24/7.", capabilities: ["Chat 12+ lingue", "Booking automatico", "Upgrade suggerimenti", "VIP service 24/7"], gradient: "from-sky-400 to-blue-500", glow: "hsl(210, 80%, 55%)", stat: { value: 12, suffix: "+", label: "Lingue" }, whyNeed: "I turisti di lusso pretendono risposte immediate nella loro lingua. Travel Concierge risponde in 12 lingue, 24/7 — trasformando richieste in prenotazioni premium." },
    { id: "ncc-fleet", icon: <Shield className="w-5 h-5" />, name: "Fleet Guardian", role: "Controllo Flotta & Scadenze", desc: "Monitora scadenze assicurazioni, revisioni, CQC e manutenzioni. Alert automatici 30/15/7 giorni prima della scadenza — zero sanzioni.", capabilities: ["Scadenze monitorate", "Alert automatici", "Manutenzione predittiva", "Compliance garantita"], gradient: "from-red-500 to-rose-500", glow: "hsl(0, 75%, 55%)", stat: { value: 0, suffix: "€", label: "Sanzioni" }, whyNeed: "Una patente scaduta o un'assicurazione mancata = fermo veicolo e sanzioni. Fleet Guardian ti avvisa PRIMA — zero sorprese, zero sanzioni." },
  ],
  fitness: [
    { id: "fit-churn", icon: <Users className="w-5 h-5" />, name: "Retention AI", role: "Anti-Abbandono Soci", desc: "Identifica i soci a rischio di cancellazione analizzando frequenza, pattern e comportamento. Attiva campagne di retention automatiche.", capabilities: ["Previsione churn", "Alert soci inattivi", "Campagne automatiche", "Win-back personalizzato"], gradient: "from-lime-500 to-green-500", glow: "hsl(100, 70%, 50%)", stat: { value: 60, suffix: "%", label: "↓ Churn" }, whyNeed: "Il 40% dei soci abbandona nei primi 3 mesi. Retention AI li identifica PRIMA e li riattiva — risparmiandoti migliaia di euro in acquisizione." },
    { id: "fit-schedule", icon: <Calendar className="w-5 h-5" />, name: "Class Optimizer", role: "Ottimizzatore Palinsesto", desc: "Analizza i dati di partecipazione e suggerisce il palinsesto perfetto: quali corsi, a che ora, con quale istruttore.", capabilities: ["Analisi partecipazione", "Orari ottimali", "Corsi più richiesti", "Bilanciamento carichi"], gradient: "from-cyan-500 to-blue-500", glow: "hsl(200, 80%, 55%)", stat: { value: 90, suffix: "%", label: "Occupazione" }, whyNeed: "Corsi vuoti = soldi persi, corsi pieni = clienti persi. Class Optimizer trova l'equilibrio perfetto — 90% occupazione su ogni fascia oraria." },
    { id: "fit-personal", icon: <Target className="w-5 h-5" />, name: "PT Assistant", role: "Assistente Personal Trainer", desc: "Genera schede allenamento personalizzate, traccia progressi e invia motivazione automatica — mantenendo i soci coinvolti e motivati.", capabilities: ["Schede personalizzate", "Tracking progressi", "Motivazione automatica", "Obiettivi smart"], gradient: "from-orange-500 to-amber-500", glow: "hsl(30, 85%, 55%)", stat: { value: 4, suffix: "×", label: "Engagement" }, whyNeed: "I soci senza guida abbandonano. PT Assistant li segue quotidianamente con schede, progressi e motivazione — 4× più coinvolgimento." },
    { id: "fit-sales", icon: <Rocket className="w-5 h-5" />, name: "Membership Booster", role: "Acceleratore Iscrizioni", desc: "Converte i lead da social e sito in iscrizioni con follow-up automatico, offerte personalizzate e percorso di onboarding guidato.", capabilities: ["Lead nurturing", "Offerte smart", "Trial automatici", "Onboarding guidato"], gradient: "from-purple-500 to-violet-500", glow: "hsl(270, 70%, 55%)", stat: { value: 50, suffix: "%", label: "↑ Conversioni" }, whyNeed: "Il 70% dei lead non si iscrive per mancanza di follow-up. Membership Booster li nutre automaticamente — convertendo il 50% in più." },
  ],
  healthcare: [
    { id: "health-triage", icon: <Heart className="w-5 h-5" />, name: "Triage IA", role: "Pre-valutazione Intelligente", desc: "Pre-valuta le richieste dei pazienti, assegna priorità e indirizza allo specialista corretto — riducendo i tempi di attesa e migliorando l'efficienza.", capabilities: ["Pre-screening pazienti", "Priorità automatiche", "Routing specialista", "Riduzione attese"], gradient: "from-teal-500 to-cyan-500", glow: "hsl(180, 70%, 50%)", stat: { value: 70, suffix: "%", label: "↓ Attese" }, whyNeed: "Pazienti indirizzati male = tempo sprecato e costi alti. Triage IA assegna il giusto specialista al primo contatto — 70% meno attese." },
    { id: "health-followup", icon: <Bell className="w-5 h-5" />, name: "Care Companion", role: "Follow-up Automatico", desc: "Invia reminder per controlli periodici, referti pronti, istruzioni pre/post intervento e follow-up personalizzati basati sulla patologia.", capabilities: ["Reminder controlli", "Istruzioni pre-op", "Follow-up post-visita", "Aderenza terapeutica"], gradient: "from-blue-500 to-indigo-500", glow: "hsl(230, 70%, 55%)", stat: { value: 85, suffix: "%", label: "Aderenza" }, whyNeed: "I pazienti dimenticano controlli e terapie. Care Companion li segue automaticamente — 85% aderenza terapeutica e zero buchi in agenda." },
    { id: "health-docs", icon: <FileText className="w-5 h-5" />, name: "DocuMed IA", role: "Documentazione Automatica", desc: "Digitalizza referti, genera consensi informati, organizza la documentazione clinica e garantisce la conformità GDPR e normative sanitarie.", capabilities: ["Referti digitali", "Consensi informati", "Audit trail", "Conformità GDPR"], gradient: "from-emerald-500 to-green-500", glow: "hsl(150, 65%, 50%)", stat: { value: 90, suffix: "%", label: "↓ Carta" }, whyNeed: "La carta rallenta tutto e crea errori. DocuMed IA digitalizza tutto — dal referto al consenso — garantendo conformità legale al 100%." },
    { id: "health-rep", icon: <Star className="w-5 h-5" />, name: "MedReputation", role: "Gestione Reputazione Medica", desc: "Raccoglie feedback post-visita, gestisce le recensioni Google Health e monitora la reputazione online dello studio con alert in tempo reale.", capabilities: ["Feedback automatico", "Google Health sync", "Alert negativi", "NPS continuo"], gradient: "from-violet-500 to-purple-500", glow: "hsl(270, 70%, 55%)", stat: { value: 4.9, suffix: "★", label: "Rating medio" }, whyNeed: "I pazienti scelgono online. MedReputation garantisce un rating 4.9★ — intercettando i negativi e amplificando i positivi automaticamente." },
  ],
  retail: [
    { id: "retail-inventory", icon: <Store className="w-5 h-5" />, name: "Stock Intelligence", role: "Inventario Predittivo", desc: "Monitora le scorte in tempo reale, prevede la domanda e genera ordini di riassortimento automatici prima che un prodotto finisca.", capabilities: ["Alert scorte minime", "Riordino automatico", "Previsione domanda", "Analytics prodotto"], gradient: "from-cyan-500 to-blue-500", glow: "hsl(200, 75%, 55%)", stat: { value: 0, suffix: "", label: "Rotture stock" }, whyNeed: "Ogni prodotto esaurito = vendita persa. Stock Intelligence prevede la domanda e riordina PRIMA — zero scaffali vuoti, zero sprechi." },
    { id: "retail-personal", icon: <Users className="w-5 h-5" />, name: "Personal Shopper IA", role: "Raccomandazioni Smart", desc: "Analizza gli acquisti di ogni cliente e suggerisce prodotti perfetti via WhatsApp, email e sul sito — aumentando il carrello medio.", capabilities: ["Raccomandazioni 1-to-1", "Cross-selling smart", "Wishlist automatiche", "Trigger comportamentali"], gradient: "from-amber-500 to-orange-500", glow: "hsl(35, 85%, 55%)", stat: { value: 35, suffix: "%", label: "↑ Carrello" }, whyNeed: "Il 65% dei clienti compra di più con suggerimenti personalizzati. Personal Shopper IA conosce ogni cliente e suggerisce — aumentando il carrello del 35%." },
    { id: "retail-loyalty", icon: <Wallet className="w-5 h-5" />, name: "Loyalty Engine", role: "Fidelizzazione Automatica", desc: "Gestisce punti, livelli, cashback e premi. I clienti fedeli spendono 67% in più — e Loyalty Engine li coltiva automaticamente.", capabilities: ["Punti & livelli", "Cashback automatico", "Premi personalizzati", "Gamification"], gradient: "from-emerald-500 to-teal-500", glow: "hsl(160, 70%, 50%)", stat: { value: 67, suffix: "%", label: "↑ Spesa fedeli" }, whyNeed: "Senza fidelizzazione, i clienti comprano una volta e spariscono. Loyalty Engine li trasforma in clienti abituali — 67% di spesa in più per cliente." },
    { id: "retail-catalog", icon: <Sparkles className="w-5 h-5" />, name: "Catalog Creator", role: "Generatore Catalogo IA", desc: "Fotografa i prodotti e l'IA genera titolo, descrizione SEO, categoria e prezzo suggerito. Catalogo online pronto in minuti, non giorni.", capabilities: ["Foto → catalogo", "Descrizioni SEO", "Categorie auto", "Pricing intelligente"], gradient: "from-purple-500 to-violet-500", glow: "hsl(270, 70%, 55%)", stat: { value: 10, suffix: "×", label: "Più veloce" }, whyNeed: "Creare un catalogo online a mano richiede settimane. Catalog Creator lo fa in minuti — 10× più veloce con qualità professionale." },
  ],
  hotel: [
    { id: "hotel-revenue", icon: <TrendingUp className="w-5 h-5" />, name: "Revenue Manager IA", role: "Tariffe Dinamiche", desc: "Calcola le tariffe ottimali basandosi su domanda, eventi, meteo, competitor e storico — massimizzando il RevPAR automaticamente.", capabilities: ["Yield management", "Competitor analysis", "Evento detection", "RevPAR ottimizzato"], gradient: "from-amber-400 to-yellow-500", glow: "hsl(45, 90%, 55%)", stat: { value: 35, suffix: "%", label: "↑ RevPAR" }, whyNeed: "Tariffe fisse = soldi persi ogni notte. Revenue Manager IA ottimizza i prezzi in tempo reale — 35% in più di RevPAR, zero camere sottovalutate." },
    { id: "hotel-concierge", icon: <MessageSquare className="w-5 h-5" />, name: "Digital Concierge", role: "Concierge Virtuale 24/7", desc: "Risponde agli ospiti in ogni lingua prima, durante e dopo il soggiorno. Gestisce richieste, prenotazioni ristorante, spa e escursioni.", capabilities: ["Multilingue 24/7", "Room service digitale", "Prenotazioni interne", "Guest satisfaction"], gradient: "from-sky-500 to-blue-500", glow: "hsl(210, 80%, 55%)", stat: { value: 95, suffix: "%", label: "Soddisfazione" }, whyNeed: "Gli ospiti vogliono risposte immediate. Digital Concierge risponde in 3 secondi in ogni lingua — 95% soddisfazione, zero stress per il tuo staff." },
    { id: "hotel-upsell", icon: <Rocket className="w-5 h-5" />, name: "Experience Upseller", role: "Vendita Servizi Aggiuntivi", desc: "Propone automaticamente upgrade camera, spa, escursioni e cena romantica al momento perfetto — quando l'ospite è più ricettivo.", capabilities: ["Upgrade automatici", "Timing intelligente", "Pacchetti dinamici", "Extra personalizzati"], gradient: "from-rose-500 to-pink-500", glow: "hsl(350, 75%, 55%)", stat: { value: 45, suffix: "%", label: "↑ Revenue extra" }, whyNeed: "Il 60% degli ospiti comprerebbe extra se glieli suggerissi al momento giusto. Experience Upseller lo fa — 45% revenue extra per soggiorno." },
    { id: "hotel-review", icon: <Star className="w-5 h-5" />, name: "Guest Reputation", role: "Gestione Recensioni", desc: "Intercetta feedback negativi prima di Booking/TripAdvisor, risolve problemi in tempo reale e amplifica le recensioni positive.", capabilities: ["Intercettazione negativi", "Risoluzione real-time", "Boost positivi", "Monitoraggio OTA"], gradient: "from-emerald-500 to-green-500", glow: "hsl(150, 65%, 50%)", stat: { value: 4.8, suffix: "★", label: "Rating OTA" }, whyNeed: "Una recensione negativa su Booking costa decine di prenotazioni. Guest Reputation la intercetta PRIMA — proteggendo il tuo rating e i tuoi ricavi." },
  ],
  beach: [
    { id: "beach-booking", icon: <Umbrella className="w-5 h-5" />, name: "Beach Booker IA", role: "Prenotazioni Intelligenti", desc: "Mappa interattiva con disponibilità real-time. I clienti prenotano ombrellone, lettino e servizi extra 24/7 — zero telefonate.", capabilities: ["Mappa interattiva", "Booking 24/7", "Pagamento anticipato", "Conferme automatiche"], gradient: "from-cyan-500 to-blue-500", glow: "hsl(190, 80%, 55%)", stat: { value: 80, suffix: "%", label: "↓ Telefonate" }, whyNeed: "Ogni telefonata = 3 minuti persi × 50 chiamate/giorno = 2.5 ore sprecate. Beach Booker elimina l'80% delle telefonate — tu gestisci, non rispondi." },
    { id: "beach-weather", icon: <Eye className="w-5 h-5" />, name: "Weather Revenue", role: "Pricing Meteo-Dinamico", desc: "Adatta le tariffe in base a meteo, giorno, affluenza e domanda. Nei giorni di sole il prezzo sale, nei giorni misti crea offerte last-minute.", capabilities: ["Pricing meteo-based", "Offerte last-minute", "Surge pricing sole", "Alert affluenza"], gradient: "from-amber-400 to-orange-500", glow: "hsl(35, 85%, 55%)", stat: { value: 30, suffix: "%", label: "↑ Revenue" }, whyNeed: "Lo stesso ombrellone vale 50€ col sole e 20€ col vento. Weather Revenue adatta i prezzi automaticamente — 30% più ricavi sulla stagione." },
    { id: "beach-bar", icon: <Bot className="w-5 h-5" />, name: "Beach Service Bot", role: "Ordini dall'Ombrellone", desc: "I clienti scansionano il QR dall'ombrellone e ordinano dal bar/ristorante senza alzarsi. Ordini diretti in cucina — zero errori.", capabilities: ["QR dall'ombrellone", "Menu digitale", "Ordini diretti cucina", "Pagamento digitale"], gradient: "from-lime-500 to-green-500", glow: "hsl(100, 70%, 50%)", stat: { value: 3, suffix: "×", label: "Ordini bar" }, whyNeed: "I clienti non ordinano perché non vogliono alzarsi. Con il QR dall'ombrellone, gli ordini bar triplicano — revenue passiva sotto il sole." },
    { id: "beach-crm", icon: <Users className="w-5 h-5" />, name: "Season Pass Manager", role: "Gestione Abbonamenti", desc: "Gestisce abbonamenti stagionali, giornalieri e settimanali con rinnovi automatici, scadenze e promozioni fedeltà personalizzate.", capabilities: ["Abbonamenti digitali", "Rinnovi automatici", "Scadenze monitorate", "Loyalty program"], gradient: "from-blue-500 to-indigo-500", glow: "hsl(230, 70%, 55%)", stat: { value: 45, suffix: "%", label: "Rinnovi auto" }, whyNeed: "Tracciare abbonamenti su carta = errori e dispute. Season Pass Manager gestisce tutto digitalmente — 45% dei rinnovi avvengono in automatico." },
  ],
  trades: [
    { id: "trades-dispatch", icon: <Workflow className="w-5 h-5" />, name: "Field Dispatcher", role: "Coordinamento Interventi", desc: "Assegna interventi al tecnico più vicino e disponibile, ottimizza i percorsi e invia conferme automatiche ai clienti.", capabilities: ["Assegnazione smart", "Ottimizzazione percorsi", "GPS tracking", "Conferme automatiche"], gradient: "from-blue-500 to-indigo-500", glow: "hsl(230, 70%, 55%)", stat: { value: 40, suffix: "%", label: "↑ Interventi/giorno" }, whyNeed: "Senza routing ottimizzato, i tecnici perdono ore nel traffico. Field Dispatcher trova il percorso migliore — 40% più interventi al giorno." },
    { id: "trades-quote", icon: <FileText className="w-5 h-5" />, name: "Instant Quote IA", role: "Preventivi Automatici", desc: "Genera preventivi dettagliati in 30 secondi basandosi su tipo intervento, materiali necessari e storico prezzi della zona.", capabilities: ["Preventivo in 30s", "Listino materiali", "Storico prezzi", "Firma digitale"], gradient: "from-emerald-500 to-teal-500", glow: "hsl(160, 70%, 50%)", stat: { value: 30, suffix: "s", label: "Preventivo pronto" }, whyNeed: "Un preventivo inviato dopo 24h perde il 60% dei clienti. Instant Quote lo genera in 30 secondi — mentre sei ancora dal cliente." },
    { id: "trades-maintain", icon: <Bell className="w-5 h-5" />, name: "Maintenance Reminder", role: "Manutenzioni Ricorrenti", desc: "Invia reminder automatici ai clienti per manutenzioni periodiche (caldaia, impianto elettrico, ecc.) — generando lavoro ricorrente garantito.", capabilities: ["Scadenze tracciate", "Reminder WhatsApp", "Rinnovo annuale", "Revenue ricorrente"], gradient: "from-amber-500 to-orange-500", glow: "hsl(35, 80%, 55%)", stat: { value: 35, suffix: "%", label: "Revenue ricorrente" }, whyNeed: "La manutenzione dimenticata = cliente perso. Maintenance Reminder genera lavoro ricorrente automatico — 35% del fatturato diventa prevedibile." },
    { id: "trades-photo", icon: <Eye className="w-5 h-5" />, name: "WorkProof IA", role: "Documentazione Lavori", desc: "Foto prima/dopo con timestamp GPS, note tecniche automatiche e report generato dall'IA. Documentazione inattaccabile per ogni intervento.", capabilities: ["Foto georeferenziate", "Report automatico", "Note tecniche IA", "Storico impianti"], gradient: "from-violet-500 to-purple-500", glow: "hsl(270, 70%, 55%)", stat: { value: 100, suffix: "%", label: "Tracciabilità" }, whyNeed: "Senza documentazione, ogni contestazione è una tua parola contro la loro. WorkProof IA crea prove inattaccabili — zero dispute, zero problemi legali." },
  ],
  bakery: [
    { id: "bakery-production", icon: <Clock className="w-5 h-5" />, name: "Production Planner", role: "Pianificazione Produzione", desc: "Analizza storico vendite, meteo e giorno per prevedere esattamente quanti prodotti preparare — zero sprechi, zero mancanze.", capabilities: ["Previsione domanda", "Riduzione sprechi", "Planning giornaliero", "Ottimizzazione ingredienti"], gradient: "from-amber-500 to-yellow-500", glow: "hsl(40, 85%, 55%)", stat: { value: 30, suffix: "%", label: "↓ Sprechi" }, whyNeed: "Ogni cornetto invenduto è un costo. Production Planner ti dice esattamente quanti prepararne — 30% meno sprechi, margini più alti." },
    { id: "bakery-orders", icon: <Store className="w-5 h-5" />, name: "Order Genius", role: "Ordini & Torte Online", desc: "Catalogo online con configuratore torte, ordini per ritiro/consegna e pagamento anticipato. I clienti ordinano 24/7 senza telefonare.", capabilities: ["Catalogo digitale", "Configuratore torte", "Ritiro/consegna", "Pagamento online"], gradient: "from-pink-400 to-rose-500", glow: "hsl(340, 75%, 55%)", stat: { value: 50, suffix: "%", label: "↑ Ordini" }, whyNeed: "Le telefonate limitano gli ordini alle ore di apertura. Order Genius accetta ordini 24/7 online — 50% più ordini senza lavoro extra." },
    { id: "bakery-loyalty", icon: <Wallet className="w-5 h-5" />, name: "Sweet Rewards", role: "Fidelizzazione Golosa", desc: "Tessera punti digitale, promo compleanno e cashback automatico. Dopo 10 caffè, l'11° è gratis — e il cliente torna ogni mattina.", capabilities: ["Tessera punti digitale", "Promo compleanno", "Cashback automatico", "Gamification"], gradient: "from-emerald-500 to-green-500", glow: "hsl(150, 65%, 50%)", stat: { value: 3, suffix: "×", label: "Tasso ritorno" }, whyNeed: "I clienti hanno 5 pasticcerie nel raggio di 1km. Sweet Rewards li fidelizza con punti e premi — tornano 3× più spesso della concorrenza." },
    { id: "bakery-photo", icon: <Sparkles className="w-5 h-5" />, name: "FoodShot IA", role: "Foto Prodotti Professionali", desc: "Scatta una foto col telefono e l'IA la trasforma in un'immagine da catalogo professionale con sfondo, luci e styling automatici.", capabilities: ["Foto → professionale", "Background automatico", "Styling IA", "Catalogo pronto"], gradient: "from-violet-500 to-purple-500", glow: "hsl(270, 70%, 55%)", stat: { value: 60, suffix: "s", label: "Foto pronta" }, whyNeed: "I prodotti con foto professionali vendono 3× di più. FoodShot IA le crea in 60 secondi dal tuo telefono — zero fotografo, qualità magazine." },
  ],
};

function getAgentsForSector(sector?: string): AgentData[] {
  if (sector && SECTOR_AGENTS[sector]) return SECTOR_AGENTS[sector];
  return GENERIC_AGENTS;
}

export function AIAgentsShowcase({ sector }: { sector?: string } = {}) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const aiAgents = getAgentsForSector(sector);

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden">
      {/* ── DNA Helix Background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[800px] h-[800px] rounded-full blur-[250px] opacity-[0.12] bg-primary top-0 left-1/2 -translate-x-1/2" />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[180px] opacity-[0.09] bg-accent bottom-0 right-0" />
        <div className="absolute w-[300px] h-[600px] rounded-full blur-[200px] opacity-[0.07] bg-primary/80 top-1/3 left-0" />
        
        {/* DNA Double Helix SVG */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 2400">
          <defs>
            <linearGradient id="dna-s1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              <stop offset="20%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
              <stop offset="80%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="dna-s2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0" />
              <stop offset="20%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.45" />
              <stop offset="80%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="dna-rung" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
            </linearGradient>
            <filter id="dna-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Left helix strand */}
          <motion.path
            d={`M 150 0 ${Array.from({ length: 20 }, (_, i) => `Q ${150 + Math.sin(i * 0.55) * 140} ${i * 120 + 60}, ${150 + Math.sin((i + 1) * 0.55) * 140} ${(i + 1) * 120}`).join(' ')}`}
            fill="none" stroke="url(#dna-s1)" strokeWidth="2.5" filter="url(#dna-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
          {/* Right helix strand */}
          <motion.path
            d={`M 1050 0 ${Array.from({ length: 20 }, (_, i) => `Q ${1050 - Math.sin(i * 0.55) * 140} ${i * 120 + 60}, ${1050 - Math.sin((i + 1) * 0.55) * 140} ${(i + 1) * 120}`).join(' ')}`}
            fill="none" stroke="url(#dna-s2)" strokeWidth="2.5" filter="url(#dna-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 2.5, delay: 0.2, ease: "easeInOut" }}
          />
          {/* Rungs */}
          {Array.from({ length: 18 }, (_, i) => (
            <motion.line
              key={`rung-${i}`}
              x1="100" y1={100 + i * 130} x2="1100" y2={100 + i * 130}
              stroke="url(#dna-rung)" strokeWidth="1" strokeDasharray="4 8"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.5 }}
              style={{ transformOrigin: "center" }}
            />
          ))}
          {/* Floating data nodes */}
          {Array.from({ length: 30 }, (_, i) => (
            <motion.circle
              key={`node-${i}`}
              cx={60 + (i % 10) * 110} cy={50 + Math.floor(i / 10) * 400 + (i % 3) * 120}
              r="3" fill="hsl(var(--primary))"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: [0, 0.6, 0.25, 0.6], scale: [0, 1.2, 0.8, 1.2] } : {}}
              transition={{ delay: 0.8 + i * 0.05, duration: 5, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}
        </svg>
        
        {/* Neural grid dots */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.045]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="neural-grid-agents" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1" fill="hsl(var(--primary))" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid-agents)" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* ══════ HEADER ══════ */}
        <div className="text-center mb-12 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/[0.06] backdrop-blur-sm mb-5"
          >
            <Bot className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[0.65rem] font-heading font-bold text-primary/80 tracking-[0.15em] uppercase">Agenti IA Autonomi</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-[clamp(1.8rem,5vw,3.6rem)] font-heading font-bold text-foreground leading-[1.05] mb-4"
          >
            Il Tuo Esercito di{" "}
            <span className="relative inline-block">
              <span className="text-shimmer">Agenti IA</span>
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
            <br className="sm:hidden" />
            {" "}Lavora Per Te
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-foreground/45 max-w-[600px] mx-auto leading-[1.7] text-sm"
          >
            Mentre dormi, i tuoi agenti IA gestiscono clienti, ottimizzano operazioni, lanciano campagne
            e analizzano dati. <strong className="text-foreground/70">Il tuo business non si ferma mai.</strong>
          </motion.p>
        </div>

        {/* ══════ AI AGENTS — DNA HELIX ASSEMBLY ══════ */}
        <div className="relative mb-14 sm:mb-18">
          {/* Central DNA spine connector */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 hidden sm:block"
            style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--primary) / 0.25), hsl(var(--accent) / 0.18), transparent)" }}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          
          <div className="grid sm:grid-cols-2 gap-3">
            {aiAgents.map((agent, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={agent.id}
                  initial={{
                    opacity: 0,
                    x: isLeft ? -70 : 70,
                    y: 30,
                    rotateY: isLeft ? -20 : 20,
                    rotateZ: isLeft ? -2 : 2,
                    scale: 0.88,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    scale: 1,
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    delay: i * 0.15,
                    duration: 0.7,
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                  }}
                  className="group relative"
                  style={{ perspective: "1000px" }}
                >
                  {/* DNA connector node */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-primary/40 bg-primary/20 shadow-[0_0_10px_hsl(var(--primary)/0.3)] z-20 hidden sm:block"
                    style={{ [isLeft ? "right" : "left"]: "-6px" }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: [0, 1.4, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.5, duration: 0.4 }}
                  />

                  {/* Compact Card */}
                  <div className="relative rounded-xl border border-foreground/[0.06] bg-card/40 backdrop-blur-sm p-4 overflow-hidden transition-all duration-500 hover:border-primary/20 hover:shadow-[0_0_25px_rgba(139,92,246,0.08)]">
                    <NeuralPulse delay={i * 0.8} />
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${agent.gradient} opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-700 rounded-bl-full`} />

                    {/* Header */}
                    <div className="flex items-center gap-2.5 mb-2.5 relative z-10">
                      <div className="relative">
                        <div className={`absolute -inset-0.5 rounded-lg bg-gradient-to-br ${agent.gradient} opacity-25 blur-sm group-hover:opacity-45 transition-opacity duration-500`} />
                        <div className={`relative w-8 h-8 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white shadow-md`}>
                          {agent.icon}
                        </div>
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-[1.5px] border-card shadow-[0_0_6px_rgba(52,211,153,0.6)] animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-foreground text-[0.8rem] leading-tight">{agent.name}</h3>
                        <p className="text-[0.55rem] font-heading text-primary/55 tracking-wider uppercase">{agent.role}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-heading font-bold text-foreground leading-none">
                          <Counter value={agent.stat.value} suffix={agent.stat.suffix} />
                        </div>
                        <p className="text-[0.5rem] text-foreground/30 mt-0.5">{agent.stat.label}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[0.68rem] text-foreground/40 leading-[1.55] mb-2.5 relative z-10 line-clamp-2">{agent.desc}</p>

                    {/* Capabilities */}
                    <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 relative z-10">
                      {agent.capabilities.map((cap, ci) => (
                        <motion.span
                          key={ci}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + ci * 0.04 }}
                          className="flex items-center gap-1"
                        >
                          <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${agent.gradient}`} />
                          <span className="text-[0.58rem] text-foreground/40">{cap}</span>
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ══════ SECTOR CAPABILITIES — DNA ASSEMBLY ══════ */}
        <div className="mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h3 className="text-[clamp(1.3rem,3.5vw,2.2rem)] font-heading font-bold text-foreground leading-[1.1] mb-2">
              IA Dedicata Per <span className="text-shimmer">Ogni Settore</span>
            </h3>
            <p className="text-foreground/40 text-xs max-w-[450px] mx-auto">
              Ogni settore ha agenti specializzati che parlano la lingua del tuo business
            </p>
          </motion.div>

          <div className="relative">
            {/* Central DNA spine for sectors */}
            <motion.div
              className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 hidden sm:block z-0"
              style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--primary) / 0.4), hsl(var(--accent) / 0.3), transparent)" }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 relative z-10">
              {sectorCapabilities.map((s, i) => {
                const isLeft = i % 2 === 0;
                const row = Math.floor(i / 4);
                return (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      x: isLeft ? -50 : 50,
                      y: 20,
                      rotateY: isLeft ? -15 : 15,
                      rotateZ: isLeft ? -3 : 3,
                      scale: 0.8,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      rotateY: 0,
                      rotateZ: 0,
                      scale: 1,
                    }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 140,
                      damping: 16,
                    }}
                    className="group relative"
                    style={{ perspective: "800px" }}
                  >
                    {/* DNA connector dot */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/30 shadow-[0_0_8px_hsl(var(--primary)/0.4)] z-20 hidden sm:block"
                      style={{ [isLeft ? "right" : "left"]: "-5px" }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: [0, 1.5, 1] }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.4, duration: 0.35 }}
                    />

                    <div className="relative rounded-lg border border-foreground/[0.06] bg-card/30 backdrop-blur-sm p-2 sm:p-2.5 overflow-hidden hover:border-primary/20 transition-all duration-400 hover:shadow-[0_0_15px_hsl(var(--primary)/0.08)]">
                      <div className={`absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r ${s.color} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-5 h-5 min-w-[20px] rounded bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-sm`}>
                          <span className="scale-[0.7]">{s.icon}</span>
                        </div>
                        <h4 className="font-heading font-bold text-[0.65rem] text-foreground leading-tight truncate">{s.sector}</h4>
                      </div>
                      <p className="text-[0.5rem] text-foreground/35 leading-[1.35] line-clamp-2">{s.features}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══════ AUTONOMOUS PROCESSES ══════ */}
        <div className="mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/[0.06] mb-4">
              <Cpu className="w-3 h-3 text-accent animate-spin" style={{ animationDuration: "8s" }} />
              <span className="text-[0.6rem] font-heading font-bold text-accent/70 tracking-[0.15em] uppercase">Processi Autonomi</span>
            </div>
            <h3 className="text-[clamp(1.3rem,3.5vw,2.2rem)] font-heading font-bold text-foreground leading-[1.1] mb-3">
              L'IA che Lavora<br className="sm:hidden" /> <span className="text-shimmer">Mentre Tu Cresci</span>
            </h3>
            <p className="text-foreground/40 text-sm max-w-[550px] mx-auto leading-[1.7]">
              Non è un semplice software. È un ecosistema intelligente che si evolve, impara e agisce — rendendo la tua attività inarrestabile.
            </p>
          </motion.div>

          <div className="relative">
            {/* Central DNA spine */}
            <motion.div
              className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 hidden lg:block z-0"
              style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--primary) / 0.35), hsl(var(--accent) / 0.25), transparent)" }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2 relative z-10">
              {autonomousProcesses.map((p, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      x: isLeft ? -40 : 40,
                      y: 15,
                      rotateY: isLeft ? -12 : 12,
                      scale: 0.85,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      rotateY: 0,
                      scale: 1,
                    }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{
                      delay: i * 0.09,
                      duration: 0.55,
                      type: "spring",
                      stiffness: 150,
                      damping: 17,
                    }}
                    className="group relative"
                    style={{ perspective: "800px" }}
                  >
                    {/* DNA connector dot */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/25 shadow-[0_0_8px_hsl(var(--primary)/0.35)] z-20 hidden lg:block"
                      style={{ [isLeft ? "right" : "left"]: "-5px" }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: [0, 1.4, 1] }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.09 + 0.35, duration: 0.3 }}
                    />

                    <div className="relative rounded-xl border border-primary/10 bg-gradient-to-br from-[hsla(230,12%,13%,0.95)] via-[hsla(230,10%,11%,0.92)] to-primary/[0.06] backdrop-blur-md p-3 overflow-hidden hover:border-primary/25 transition-all duration-400 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)] shadow-[0_2px_12px_hsl(var(--background)/0.5)]">
                      <motion.div
                        className="absolute top-0 right-0 w-6 h-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                      >
                        <div className="absolute top-0 right-0 w-[1px] h-3 bg-gradient-to-b from-primary/25 to-transparent" />
                        <div className="absolute top-0 right-0 h-[1px] w-3 bg-gradient-to-l from-primary/25 to-transparent" />
                      </motion.div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 min-w-[28px] rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-400 shadow-[0_0_8px_hsl(var(--primary)/0.08)]">
                          <span className="scale-[0.85]">{p.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-[0.7rem] text-foreground mb-0.5 leading-tight tracking-wide">{p.title}</h4>
                          <p className="text-[0.55rem] text-foreground/55 leading-[1.5] line-clamp-2">{p.desc}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══════ IMPACT STATS ══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-foreground/[0.06] bg-card/30 backdrop-blur-sm p-6 sm:p-8 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-accent/[0.03]" />
          <NeuralPulse delay={0} />
          <NeuralPulse delay={1.5} />

          <div className="relative z-10 text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-gold" />
              <span className="font-heading font-bold text-foreground text-base sm:text-lg">L'Impatto Empire sui Tuoi Risultati</span>
            </div>
            <p className="text-foreground/35 text-xs max-w-[450px] mx-auto">
              Numeri reali, misurabili. Non promesse — risultati garantiti per contratto.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 relative z-10">
            {impactStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 300, damping: 25 }}
                className="text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/[0.08] border border-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
                  {stat.icon}
                </div>
                <div className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-0.5">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-[0.65rem] font-heading font-semibold text-foreground/70 mb-0.5">{stat.label}</p>
                <p className="text-[0.55rem] text-foreground/30">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ══════ FOREVER ADVANTAGE ══════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14 sm:mt-18"
        >
          <div className="relative inline-block">
            <motion.div
              className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <Sparkles className="w-7 h-7 text-primary relative z-10 mx-auto mb-3" />
          </div>
          <h3 className="text-[clamp(1.2rem,3vw,2rem)] font-heading font-bold text-foreground leading-[1.15] mb-3">
            Sempre Avanti. <span className="text-shimmer">Per Sempre.</span>
          </h3>
          <p className="text-foreground/40 text-sm max-w-[550px] mx-auto leading-[1.7] mb-5">
            Ogni settimana nuovi agenti, nuove automazioni, nuove integrazioni. Il tuo business
            non resta mai indietro — evolve costantemente, anni luce davanti alla concorrenza.
            <strong className="text-foreground/60"> Per tutta la vita.</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Aggiornamenti Settimanali", "Nuovi Agenti IA", "Zero Costi Extra", "Evoluzione Perpetua"].map((t, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/15 bg-primary/[0.04] text-[0.6rem] font-heading font-semibold text-primary/70"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
