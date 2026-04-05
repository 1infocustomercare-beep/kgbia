import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, Star, Globe, Phone, Mail, TrendingUp, Users, Zap, Target,
  AlertTriangle, ArrowRight, Copy, Check, RefreshCw, Shield, Sparkles,
  Edit3, Save, MessageCircle, Instagram, Send, ChevronRight, Eye,
  Bookmark, ExternalLink
} from "lucide-react";
import { MockLead, SECTOR_OPTIONS, DIGITAL_STATUS_LABELS } from "@/data/mock-leads-data";
import { toast } from "sonner";

interface Props {
  lead: MockLead;
  onClose: () => void;
  onSave?: (lead: MockLead) => void;
  initialTab?: "analyze" | "message";
}

// ── Score Bar ──
const ScoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-[10px] font-medium w-28 flex-shrink-0" style={{ color: "#9ca3af" }}>{label}</span>
    <div className="flex-1 h-1.5 rounded-full bg-white/5">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full" style={{ background: color }} />
    </div>
    <span className="text-[10px] font-bold w-8 text-right" style={{ color }}>{value}</span>
  </div>
);

// ── Channels ──
const CHANNELS = [
  { id: "whatsapp", icon: MessageCircle, label: "WhatsApp", color: "#25d366" },
  { id: "email", icon: Mail, label: "Email", color: "#3b82f6" },
  { id: "instagram", icon: Instagram, label: "DM", color: "#e4405f" },
  { id: "phone", icon: Phone, label: "Telefono", color: "#f59e0b" },
];

const TONES = [
  { id: "professional", label: "Formale" },
  { id: "friendly", label: "Amichevole" },
  { id: "direct", label: "Diretto" },
  { id: "story", label: "Storytelling" },
];

const APPROACHES = [
  { id: "value", label: "Valore Gratis", emoji: "🎁" },
  { id: "case", label: "Case Study", emoji: "📊" },
  { id: "question", label: "Domanda", emoji: "❓" },
  { id: "audit", label: "Audit Free", emoji: "🔍" },
];

function generateMessage(lead: MockLead, channel: string, tone: string, approach: string, variant: number): { subject: string; body: string; score: number } {
  const sectorLabel = SECTOR_OPTIONS.find(s => s.value === lead.sector)?.label || lead.sector;
  const bn = lead.businessName;
  const city = lead.city;
  const rating = lead.googleRating;
  const reviews = lead.reviewCount;
  const pp0 = lead.painPoints[0] || "gestione non digitalizzata";

  const hooks: Record<string, string[]> = {
    value: [
      `${bn}, vi offro un'analisi digitale gratuita del vostro business`,
      `Ho preparato un report personalizzato per ${bn} — è vostro, gratis`,
      `${bn}: 3 opportunità che state perdendo (e come recuperarle in 48h)`,
    ],
    case: [
      `Come un'attività simile a ${bn} ha aumentato i clienti del 35%`,
      `${sectorLabel} a ${city}: il caso studio che sta facendo scuola`,
      `Da ${rating}⭐ a 4.8⭐: la trasformazione digitale nel vostro settore`,
    ],
    question: [
      `${bn}, quanti clienti perdete ogni settimana senza saperlo?`,
      `Domanda per ${bn}: quanto vi costa NON essere online nel 2025?`,
      `${bn}: sapevate che il 73% dei clienti cerca online prima di venire?`,
    ],
    audit: [
      `Audit digitale gratuito per ${bn} — risultati in 24h`,
      `Ho analizzato ${bn}: ecco cosa ho trovato`,
      `${bn}: analisi competitiva nella zona ${city}`,
    ],
  };

  const subject = (hooks[approach] || hooks.value)[variant % 3];

  const bodies: Record<string, Record<string, string[]>> = {
    whatsapp: {
      professional: [
        `Buongiorno! 👋\n\nSono [Nome] di Empire AI Group.\n\nHo notato ${bn} a ${city} e ho un'idea per voi:\n\n📊 Nella vostra zona, ${lead.competitors} attività simili hanno già un sistema digitale per gestire clienti, prenotazioni e marketing.\n\n${approach === "value" ? "Vi offro un'analisi gratuita della vostra visibilità online — vi mostro esattamente dove state perdendo clienti e come recuperarli." : approach === "case" ? `Abbiamo appena lanciato un progetto simile — pensate a un'app tipo "City Padel Milano" ma per ${sectorLabel}. Il cliente ha visto +35% in 60 giorni.` : approach === "question" ? `Vi chiedo: quanti clienti al giorno cercano "${sectorLabel} ${city}" su Google? Oggi trovano ${lead.competitors} vostri competitor prima di voi.` : `Ho preparato un'analisi digitale personalizzata per ${bn}. I risultati sono pronti — ve li invio?`}\n\nNessun costo, nessun impegno. Solo dati concreti.\n\nVi mando il link alla demo? 🎯`,
        `Ciao! 😊\n\n${bn} — ${rating}⭐ con ${reviews} recensioni. Complimenti, si vede la qualità!\n\nUna domanda veloce: ${pp0.toLowerCase()}?\n\nAbbiamo una soluzione che si ripaga da sola:\n✅ App personalizzata con il vostro brand\n✅ Prenotazioni e ordini 24/7\n✅ CRM + programma fedeltà automatico\n✅ Marketing AI che lavora per voi\n\n90 giorni gratis per provare. Vi mando la preview? 📱`,
      ],
      friendly: [
        `Ciao ${bn}! 🤩\n\nChe bello scoprire le vostre attività a ${city}!\n\nAbbiamo un'idea per voi: pensate a un'app come quelle dei grandi brand, ma tutta vostra — con il vostro logo, i vostri colori.\n\nI clienti prenotano, ordinano, guadagnano punti fedeltà... tutto automatico.\n\n${approach === "case" ? `Abbiamo appena fatto qualcosa di simile per un ${sectorLabel} a ${city} — vi mando la preview? È incredibile!` : `Vi mando il link per vedere come funzionerebbe per ${bn}?`}\n\nZero impegno, promesso! 🙏`,
      ],
      direct: [
        `${bn} — dati rapidi:\n\n📉 ${lead.competitors} competitor nella vostra zona con presenza digitale\n📉 ${pp0}\n📈 Soluzione: app brandizzata + CRM + marketing AI\n💰 Da €79/mese — si ripaga con 2-3 clienti in più\n\n90 giorni gratis. Link demo? ⚡`,
      ],
      story: [
        `Vi racconto una storia breve 📖\n\nUn ${sectorLabel} a ${city}, situazione simile alla vostra: ${rating}⭐, ${pp0.toLowerCase()}.\n\nOggi? App personalizzata, prenotazioni automatiche, marketing AI. Risultato: +35% clienti in 2 mesi.\n\nLa cosa bella? Si è configurato tutto in 5 minuti.\n\nVi mostro come funzionerebbe per ${bn}? 🚀`,
      ],
    },
    email: {
      professional: [
        `Gentile titolare di ${bn},\n\nMi chiamo [Nome] e mi occupo di consulenza per la digitalizzazione nel settore ${sectorLabel}.\n\nHo analizzato la vostra attività a ${city} e ho identificato ${lead.painPoints.length} aree dove state perdendo opportunità concrete:\n\n${lead.painPoints.map(p => `• ${p}`).join("\n")}\n\nNella vostra zona ci sono ${lead.competitors} attività concorrenti con una presenza digitale più strutturata. Questo significa che potenziali clienti scelgono loro.\n\n${approach === "value" ? "Vi offro una consulenza gratuita di 15 minuti per mostrarvi esattamente quanto fatturato state lasciando sul tavolo." : approach === "case" ? `Un'attività simile alla vostra a ${city} ha visto un aumento del 35% nelle prenotazioni dopo aver implementato la nostra soluzione — vi allego la preview.` : approach === "question" ? `Vi chiedo: quanti clienti al giorno cercano "${sectorLabel} ${city}" su Google? Oggi trovano i vostri competitor.` : `Ho preparato un'analisi digitale personalizzata per ${bn}. I risultati sono pronti — ve li invio?`}\n\nNessun impegno. Nessuna pressione. Solo dati.\n\nResta a disposizione per una breve call quando è più comodo per Lei.\n\nCordiali saluti,\n[Nome]\nEmpire AI Group`,
        `Buongiorno,\n\nSeguo con interesse ${bn} — ${rating}⭐ su Google con ${reviews} recensioni dimostra la qualità del vostro servizio.\n\nTuttavia, ho notato che ${pp0.toLowerCase()}. Nel 2025, questo significa perdere il 30-40% dei potenziali clienti che cercano online.\n\nLa nostra piattaforma risolve esattamente questo:\n\n✅ App brandizzata con il vostro logo\n✅ Prenotazioni automatiche 24/7\n✅ CRM clienti con storico completo\n✅ Marketing automatizzato basato su IA\n\n💰 Investimento: da €79/mese — si ripaga con 2-3 clienti in più al mese.\n📊 90 giorni di prova gratuita. Zero rischi.\n\nLe va un caffè virtuale di 10 minuti per mostrarle una demo?\n\n[Nome] — Empire AI Group`,
      ],
      friendly: [
        `Ciao!\n\nHo scoperto ${bn} navigando online e devo farvi i complimenti — si vede che c'è passione in quello che fate!\n\nPerò ho notato una cosa: ${pp0.toLowerCase()}. E questo, purtroppo, vi sta facendo perdere clienti senza che ve ne accorgiate.\n\nVi racconto in 30 secondi cosa facciamo: diamo alle attività come la vostra un'app completamente personalizzata (con il VOSTRO brand, non il nostro) dove i clienti prenotano, ordinano, e tornano grazie a un programma fedeltà automatico.\n\nIl bello? Si configura in 5 minuti e i primi 90 giorni sono gratis.\n\nVi mando il link alla demo? Nessun impegno, promesso! 😊\n\n[Nome]`,
      ],
      direct: [
        `Oggetto: ${bn} — dati che dovreste vedere\n\nBuongiorno,\n\nVado al punto:\n\n📊 ${lead.competitors} competitor nella vostra zona con presenza digitale attiva\n📉 ${lead.painPoints.slice(0, 3).join(", ")}\n📈 Soluzione testata: app brandizzata + CRM + automazioni AI\n\n90 giorni gratuiti. ROI dal primo mese.\n\nInteressati a una demo di 5 minuti?\n\n[Nome] — Empire AI Group`,
      ],
      story: [
        `Buongiorno,\n\nVi racconto una storia che vi riguarda.\n\nUn ${sectorLabel} a ${city} — rating ${rating}⭐, ${reviews} recensioni, ${pp0.toLowerCase()}. Situazione familiare?\n\nDopo 60 giorni con la nostra piattaforma: prenotazioni automatiche, marketing AI, CRM integrato. Risultato: +35% clienti nuovi e -50% tempo in gestione.\n\nNon vendiamo software. Offriamo crescita misurabile.\n\nLe va di vedere come funzionerebbe per ${bn}?\n\nCordialmente,\n[Nome] — Empire AI Group`,
      ],
    },
    instagram: {
      professional: [
        `Ciao ${bn}! 🎯\n\nVi seguo da un po' e il vostro lavoro è davvero notevole.\n\nUna domanda veloce: ${pp0.toLowerCase()}?\n\nAbbiamo aiutato attività simili alla vostra a ${city} ad aumentare i clienti del 35% con un'app personalizzata.\n\nVi mando un link per vedere come funziona? Zero impegno! ✨`,
      ],
      friendly: [
        `Ciao ${bn}! 👋😍\n\nComplimenti per il profilo — si vede la qualità!\n\nAbbiamo un'idea che potrebbe piacervi: un'app tutta vostra (col vostro brand!) dove i clienti prenotano, ordinano e guadagnano punti.\n\nVi mando la preview in 2 minuti? 🚀`,
      ],
      direct: [
        `${bn} — vi scrivo perché ho un dato interessante:\n\n${lead.competitors} vostri competitor in zona hanno già un sistema digitale.\n\nVi mostro in 60 secondi come colmare il gap? ⚡`,
      ],
      story: [
        `Ciao! Vi racconto una cosa veloce 📖\n\nUn'attività come la vostra a ${city} ci ha provato e in 2 mesi ha visto +35% clienti grazie a un'app personalizzata.\n\nCuriosi di vedere come sarebbe per ${bn}? 🤩`,
      ],
    },
    phone: {
      professional: [
        `📞 SCRIPT TELEFONATA — ${bn}\n\n[APERTURA — 15 sec]\n"Buongiorno, parlo con il titolare di ${bn}? Mi chiamo [Nome], la chiamo per farle una domanda velocissima — 30 secondi."\n\n[HOOK]\n"Quanti clienti al giorno cercano '${sectorLabel} ${city}' su Google? Sono circa 150-300. Quanti arrivano da voi?"\n\n[PROBLEMA]\n"Il fatto è che ${pp0.toLowerCase()}. Nella vostra zona ci sono ${lead.competitors} attività con presenza online più forte."\n\n[SOLUZIONE]\n"Noi diamo alle attività un'app personalizzata — col vostro brand. Prenotazioni, CRM, marketing AI. Le faccio vedere dal telefono — 2 minuti."\n\n[CHIUSURA]\n"L'investimento è €79/mese — meno di un cliente perso al giorno. 90 giorni gratis. Quando le fa comodo?"\n\n[OBIEZIONI]\n• "Non ho tempo" → "Proprio per questo: automatizza tutto. Demo = 2 minuti."\n• "Costa troppo" → "€79/mese. Un cliente in più copre 3x il costo."\n• "Devo pensarci" → "Perfetto! Le mando il link, lo guarda con calma."`,
      ],
      friendly: [
        `📞 SCRIPT — ${bn} (Tono Amichevole)\n\n"Ciao! Parlo con il titolare di ${bn}? Perfetto! Mi chiamo [Nome], vi chiamo perché ho scoperto la vostra attività e devo dirvi: complimenti!"\n\n"Ho solo una curiosità: come gestite le prenotazioni oggi? ... Capisco!\n\nGuardate, noi abbiamo aiutato attività simili alla vostra a ${city} e il risultato è stato incredibile — +35% clienti in 2 mesi.\n\nVi mando una preview su WhatsApp? Ci metto 30 secondi e decidete voi con calma. Zero pressioni!"`,
      ],
      direct: [
        `📞 SCRIPT RAPIDO — ${bn}\n\n"Buongiorno, sono [Nome]. 30 secondi.\n\n${lead.competitors} vostri competitor hanno già un sistema digitale. Voi non ancora.\n\nSoluzione: app con il vostro brand, prenotazioni automatiche, marketing AI.\n90 giorni gratis, €79/mese dopo.\n\nLe mando la demo su WhatsApp?"`,
      ],
      story: [
        `📞 SCRIPT NARRATIVO — ${bn}\n\n"Buongiorno! Mi chiamo [Nome]. La chiamo perché abbiamo una storia che le piacerà.\n\nUn ${sectorLabel} a ${city}, situazione simile alla vostra. ${pp0}.\n\nDopo 2 mesi con noi: prenotazioni automatiche, clienti fidelizzati, marketing che gira da solo. +35% fatturato.\n\nLe faccio vedere in 2 minuti come sarebbe per ${bn}?"`,
      ],
    },
  };

  const channelBodies = bodies[channel] || bodies.whatsapp;
  const toneBodies = channelBodies[tone] || channelBodies.professional || Object.values(channelBodies)[0];
  const body = (toneBodies || [""])[variant % toneBodies.length] || "";
  const score = Math.min(99, 82 + Math.floor(Math.random() * 16));

  return { subject, body, score };
}

export default function LeadCommandPanel({ lead, onClose, onSave, initialTab = "analyze" }: Props) {
  const [activeTab, setActiveTab] = useState<"analyze" | "message">(initialTab);
  const [channel, setChannel] = useState("whatsapp");
  const [tone, setTone] = useState("professional");
  const [approach, setApproach] = useState("value");
  const [variant, setVariant] = useState(0);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedBody, setEditedBody] = useState("");

  const sectorLabel = SECTOR_OPTIONS.find(s => s.value === lead.sector)?.label || lead.sector;

  // ── Computed analysis scores ──
  const needScore = lead.digitalStatus === "none" ? 92 : lead.digitalStatus === "obsolete" ? 75 : lead.digitalStatus === "basic" ? 50 : 25;
  const budgetScore = lead.opportunityScore > 70 ? 78 : lead.opportunityScore > 50 ? 55 : 35;
  const urgencyScore = lead.googleRating < 3.5 ? 85 : lead.googleRating < 4 ? 60 : 35;
  const conversionScore = needScore > 70 ? 72 : 45;
  const lifetimeScore = Math.min(95, lead.opportunityScore + 15);
  const recommendedPlan = lead.opportunityScore >= 70 ? "Empire Domination" : lead.opportunityScore >= 45 ? "Growth AI" : "Digital Start";
  const planColor = lead.opportunityScore >= 70 ? "#a78bfa" : lead.opportunityScore >= 45 ? "#3b82f6" : "#10b981";
  const scoreColor = lead.opportunityScore >= 70 ? "#10b981" : lead.opportunityScore >= 45 ? "#f59e0b" : "#ef4444";

  // ── Message ──
  const msg = useMemo(() => generateMessage(lead, channel, tone, approach, variant), [lead, channel, tone, approach, variant]);
  const displayBody = editing ? editedBody : msg.body;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(channel === "email" ? `${msg.subject}\n\n${displayBody}` : displayBody);
    setCopied(true);
    toast.success("Messaggio copiato negli appunti!");
    setTimeout(() => setCopied(false), 2000);
  }, [msg, displayBody, channel]);

  const bestChannel = lead.digitalStatus === "none" ? "whatsapp" : lead.googleRating < 3.5 ? "email" : "instagram";
  const bestApproach = lead.opportunityScore >= 70 ? "audit" : lead.opportunityScore >= 45 ? "case" : "value";

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-y-0 right-0 w-full sm:w-[460px] z-50 flex flex-col"
      style={{ background: "rgba(8,8,18,0.98)", borderLeft: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(24px)" }}
    >
      {/* ── Header ── */}
      <div className="flex-shrink-0 p-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ background: `${scoreColor}15`, color: scoreColor, border: `1px solid ${scoreColor}30` }}>
          {lead.opportunityScore}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{lead.businessName}</h3>
          <p className="text-[10px] truncate" style={{ color: "#6b7280" }}>{sectorLabel} · {lead.city}, {lead.zone}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-white/10 transition" style={{ background: "rgba(255,255,255,0.05)" }}>
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex-shrink-0 flex gap-1 p-2 mx-4 mt-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
        {([
          { id: "analyze" as const, icon: Eye, label: "Analisi AI" },
          { id: "message" as const, icon: Send, label: "Genera Messaggio" },
        ]).map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold transition-all"
            style={{
              background: activeTab === t.id ? "rgba(16,185,129,0.12)" : "transparent",
              color: activeTab === t.id ? "#10b981" : "#6b7280",
            }}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === "analyze" ? (
            <motion.div key="analyze" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">

              {/* Quick Info */}
              <div className="flex items-center gap-3 flex-wrap text-[10px]" style={{ color: "#9ca3af" }}>
                <span className="flex items-center gap-1"><Star className="w-3 h-3" style={{ color: "#fbbf24" }} /> {lead.googleRating} ({lead.reviewCount})</span>
                {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>}
                {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>}
                {lead.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {lead.website}</span>}
              </div>

              {/* Digital Status */}
              <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-2 mb-2">
                  {lead.digitalStatus === "none" ? <AlertTriangle className="w-4 h-4" style={{ color: "#ef4444" }} /> : <Globe className="w-4 h-4" style={{ color: "#3b82f6" }} />}
                  <span className="text-xs font-bold text-white">Stato: {DIGITAL_STATUS_LABELS[lead.digitalStatus]}</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: "#9ca3af" }}>
                  {lead.digitalStatus === "none" ? `${lead.businessName} non ha sito web. I potenziali clienti che cercano "${sectorLabel}" a ${lead.city} non lo trovano. Opportunità enorme.`
                    : lead.digitalStatus === "obsolete" ? `Sito datato e non responsive. Non converte visite in clienti e danneggia la percezione del brand.`
                    : lead.digitalStatus === "basic" ? `Sito basico ma manca di funzionalità chiave: nessuna prenotazione online, nessun CRM, nessuna automazione.`
                    : `Presenza digitale discreta, ma mancano automazioni AI e CRM avanzato per massimizzare il valore di ogni cliente.`}
                </p>
              </div>

              {/* Score Card */}
              <div className="p-3 rounded-xl space-y-2.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <ScoreBar label="Necessità Digitale" value={needScore} color="#ef4444" />
                <ScoreBar label="Budget Stimato" value={budgetScore} color="#3b82f6" />
                <ScoreBar label="Urgenza" value={urgencyScore} color="#f59e0b" />
                <ScoreBar label="Conversione" value={conversionScore} color="#10b981" />
                <ScoreBar label="Lifetime Value" value={lifetimeScore} color="#a78bfa" />
              </div>

              {/* Competitor */}
              <div className="p-3 rounded-xl" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
                  <span className="text-[11px] font-bold text-white">Competizione</span>
                </div>
                <p className="text-[10px]" style={{ color: "#d1d5db" }}>
                  <strong>{lead.competitors} attività</strong> nella zona {lead.zone} con presenza digitale superiore. Ogni giorno {lead.businessName} perde clienti.
                </p>
              </div>

              {/* Pain Points */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>Pain Points</span>
                {lead.painPoints.map((pp, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.08)" }}>
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#ef4444" }} />
                    <span className="text-[10px]" style={{ color: "#d1d5db" }}>{pp}</span>
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <div className="p-3 rounded-xl" style={{ background: `${planColor}08`, border: `1px solid ${planColor}20` }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" style={{ color: planColor }} />
                    <span className="text-[11px] font-bold text-white">Pacchetto Consigliato</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: planColor }}>{recommendedPlan}</span>
                </div>
                <p className="text-[10px]" style={{ color: "#9ca3af" }}>Budget: {lead.estimatedBudget}</p>
              </div>

              {/* Best Strategy Suggestion */}
              <div className="p-3 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
                  <span className="text-[11px] font-bold text-white">Strategia Consigliata AI</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-1 rounded-md text-[9px] font-bold" style={{ background: CHANNELS.find(c => c.id === bestChannel)?.color + "18", color: CHANNELS.find(c => c.id === bestChannel)?.color }}>
                    📱 {CHANNELS.find(c => c.id === bestChannel)?.label}
                  </span>
                  <span className="text-[9px]" style={{ color: "#6b7280" }}>+</span>
                  <span className="px-2 py-1 rounded-md text-[9px] font-bold" style={{ background: "rgba(124,58,237,0.12)", color: "#a78bfa" }}>
                    {APPROACHES.find(a => a.id === bestApproach)?.emoji} {APPROACHES.find(a => a.id === bestApproach)?.label}
                  </span>
                </div>
                <p className="text-[10px] mt-2" style={{ color: "#9ca3af" }}>
                  {bestChannel === "whatsapp" ? "WhatsApp è il canale più diretto per questa tipologia di attività. Risposta media entro 2h."
                    : bestChannel === "email" ? "Email formale consigliata per stabilire credibilità prima del contatto diretto."
                    : "DM Instagram efficace — il profilo dimostra attenzione al visual."}
                </p>
              </div>

              {/* CTA → Switch to Message */}
              <div className="flex gap-2">
                {onSave && (
                  <button onClick={() => onSave(lead)} className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-[10px] font-semibold" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6" }}>
                    <Bookmark className="w-3.5 h-3.5" /> Salva
                  </button>
                )}
                <button onClick={() => { setActiveTab("message"); setChannel(bestChannel); setApproach(bestApproach); }}
                  className="flex-1 py-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)", color: "#fff" }}>
                  Genera Messaggio <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="message" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">

              {/* Channel */}
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "#6b7280" }}>Canale</span>
                <div className="flex gap-1.5 flex-wrap">
                  {CHANNELS.map(ch => (
                    <button key={ch.id} onClick={() => { setChannel(ch.id); setVariant(0); setEditing(false); }}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-[10px] font-semibold transition-all"
                      style={{
                        background: channel === ch.id ? `${ch.color}15` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${channel === ch.id ? `${ch.color}35` : "rgba(255,255,255,0.06)"}`,
                        color: channel === ch.id ? ch.color : "#6b7280",
                      }}>
                      <ch.icon className="w-3 h-3" /> {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone + Approach in compact grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "#6b7280" }}>Tono</span>
                  <div className="space-y-1">
                    {TONES.map(t => (
                      <button key={t.id} onClick={() => { setTone(t.id); setVariant(0); setEditing(false); }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                        style={{
                          background: tone === t.id ? "rgba(124,58,237,0.12)" : "transparent",
                          color: tone === t.id ? "#a78bfa" : "#6b7280",
                        }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: "#6b7280" }}>Approccio</span>
                  <div className="space-y-1">
                    {APPROACHES.map(a => (
                      <button key={a.id} onClick={() => { setApproach(a.id); setVariant(0); setEditing(false); }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                        style={{
                          background: approach === a.id ? "rgba(16,185,129,0.1)" : "transparent",
                          color: approach === a.id ? "#10b981" : "#6b7280",
                        }}>
                        {a.emoji} {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview + Recommended mockup */}
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center justify-between px-3 py-2" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3" style={{ color: "#a78bfa" }} />
                    <span className="text-[10px] font-bold text-white">Preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
                      <Shield className="w-3 h-3" /> Anti-Spam: {msg.score}/100
                    </span>
                  </div>
                </div>

                {channel === "email" && (
                  <div className="px-3 py-2" style={{ background: "rgba(59,130,246,0.03)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span className="text-[9px] font-semibold" style={{ color: "#3b82f6" }}>Oggetto: </span>
                    <span className="text-[10px] text-white">{msg.subject}</span>
                  </div>
                )}

                {/* WhatsApp style bubble */}
                {channel === "whatsapp" && (
                  <div className="p-3" style={{ background: "rgba(37,211,102,0.03)" }}>
                    {editing ? (
                      <textarea value={editedBody} onChange={e => setEditedBody(e.target.value)}
                        className="w-full min-h-[200px] text-[11px] leading-relaxed bg-transparent text-white/90 resize-none focus:outline-none" />
                    ) : (
                      <div className="rounded-xl p-3" style={{ background: "rgba(37,211,102,0.08)", borderRadius: "12px 12px 12px 2px" }}>
                        <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-sans" style={{ color: "#d1d5db" }}>{msg.body}</pre>
                      </div>
                    )}
                  </div>
                )}

                {channel === "instagram" && (
                  <div className="p-3" style={{ background: "rgba(228,64,95,0.03)" }}>
                    {editing ? (
                      <textarea value={editedBody} onChange={e => setEditedBody(e.target.value)}
                        className="w-full min-h-[200px] text-[11px] leading-relaxed bg-transparent text-white/90 resize-none focus:outline-none" />
                    ) : (
                      <div className="rounded-xl p-3" style={{ background: "rgba(228,64,95,0.06)" }}>
                        <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-sans" style={{ color: "#d1d5db" }}>{msg.body}</pre>
                      </div>
                    )}
                  </div>
                )}

                {(channel === "email" || channel === "phone") && (
                  <div className="p-3">
                    {editing ? (
                      <textarea value={editedBody} onChange={e => setEditedBody(e.target.value)}
                        className="w-full min-h-[250px] text-[11px] leading-relaxed bg-transparent text-white/90 resize-none focus:outline-none" />
                    ) : (
                      <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-sans" style={{ color: "#d1d5db" }}>{msg.body}</pre>
                    )}
                  </div>
                )}
              </div>

              {/* Recommended Preview to Send */}
              <div className="p-3 rounded-xl" style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.12)" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <ExternalLink className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
                  <span className="text-[10px] font-bold text-white">Preview Consigliata da Inviare</span>
                </div>
                <p className="text-[10px]" style={{ color: "#9ca3af" }}>
                  {lead.sector === "food" ? `🍽️ Invia la demo "Ristorante Bella Napoli" — mostra menu digitale, prenotazioni e CRM`
                    : lead.sector === "beauty" ? `💅 Invia la demo "Beauty Studio" — mostra booking, loyalty e automazioni`
                    : lead.sector === "fitness" ? `💪 Invia la demo "PowerGym" — mostra abbonamenti, corsi e app membri`
                    : lead.sector === "ncc" ? `🚗 Invia la demo "NCC Executive" — mostra fleet, booking e tracking`
                    : lead.sector === "hospitality" ? `🏨 Invia la demo "Hotel Bellavista" — mostra camere, check-in e upselling`
                    : `📱 Invia la preview del settore "${sectorLabel}" — mostra tutte le funzionalità chiave`}
                </p>
                <p className="text-[9px] mt-1" style={{ color: "#6b7280" }}>
                  Allega il link: empireia.lovable.app/demo/{lead.sector}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => { setVariant(v => v + 1); setEditing(false); }}
                  className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl text-[10px] font-semibold"
                  style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
                  <RefreshCw className="w-3 h-3" />
                </button>
                <button onClick={() => { if (!editing) setEditedBody(msg.body); setEditing(!editing); }}
                  className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl text-[10px] font-semibold"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}>
                  {editing ? <Save className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                </button>
                <button onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold"
                  style={{ background: copied ? "rgba(16,185,129,0.2)" : "linear-gradient(135deg, #10b981, #3b82f6)", color: "#fff" }}>
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copiato!</> : <><Copy className="w-3.5 h-3.5" /> Copia Messaggio</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
