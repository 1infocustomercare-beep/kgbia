import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, MessageCircle, Instagram, Phone, Copy, Check, RefreshCw, Shield, Sparkles, Edit3, Save, Bookmark } from "lucide-react";
import { MockLead, SECTOR_OPTIONS } from "@/data/mock-leads-data";
import { toast } from "sonner";

interface Props {
  lead: MockLead;
  onClose: () => void;
}

const CHANNELS = [
  { id: "email", icon: Mail, label: "Email", color: "#3b82f6" },
  { id: "whatsapp", icon: MessageCircle, label: "WhatsApp", color: "#25d366" },
  { id: "instagram", icon: Instagram, label: "DM Instagram", color: "#e4405f" },
  { id: "phone", icon: Phone, label: "Script Telefonata", color: "#f59e0b" },
];

const TONES = [
  { id: "professional", label: "Professionale" },
  { id: "friendly", label: "Consulente Amichevole" },
  { id: "direct", label: "Diretto ma Rispettoso" },
  { id: "story", label: "Storytelling" },
];

const APPROACHES = [
  { id: "value", label: "Valore Immediato", desc: "Offri qualcosa gratis" },
  { id: "case", label: "Case Study", desc: "Mostra risultato simile" },
  { id: "question", label: "Domanda Provocatoria", desc: "Fai riflettere" },
  { id: "audit", label: "Analisi Gratuita", desc: "Offri audit" },
];

function generateMessage(lead: MockLead, channel: string, tone: string, approach: string, variant: number): { subject: string; body: string; score: number } {
  const sectorLabel = SECTOR_OPTIONS.find(s => s.value === lead.sector)?.label || lead.sector;
  const bn = lead.businessName;
  const city = lead.city;
  const rating = lead.googleRating;
  const reviews = lead.reviewCount;
  const painPoint = lead.painPoints[0] || "gestione non digitalizzata";

  const hooks: Record<string, string[]> = {
    value: [
      `${bn}, vi offro un'analisi digitale gratuita del vostro business`,
      `Ho preparato un report personalizzato per ${bn} — è vostro, gratis`,
      `${bn}: 3 opportunità che state perdendo (e come recuperarle in 48h)`,
    ],
    case: [
      `Come un'attività simile a ${bn} ha aumentato i clienti del 35%`,
      `${sectorLabel} a ${city}: il caso studio che sta facendo scuola`,
      `Da ${rating}⭐ a 4.8⭐: la trasformazione digitale di un vostro competitor`,
    ],
    question: [
      `${bn}, quanti clienti perdete ogni settimana senza saperlo?`,
      `Domanda per ${bn}: quanto vi costa NON essere online nel 2025?`,
      `${bn}: sapevate che il 73% dei clienti cerca online prima di venire da voi?`,
    ],
    audit: [
      `Audit digitale gratuito per ${bn} — risultati in 24h`,
      `Ho analizzato ${bn}: ecco cosa ho trovato (spoiler: ci sono ottime notizie)`,
      `${bn}: analisi competitiva nella zona ${city} — risultati riservati`,
    ],
  };

  const subject = (hooks[approach] || hooks.value)[variant % 3];

  const bodyTemplates: Record<string, Record<string, string[]>> = {
    email: {
      professional: [
        `Gentile titolare di ${bn},\n\nMi chiamo [Nome] e mi occupo di consulenza per la digitalizzazione nel settore ${sectorLabel}.\n\nHo analizzato la vostra attività a ${city} e ho identificato ${lead.painPoints.length} aree dove state perdendo opportunità concrete:\n\n${lead.painPoints.map(p => `• ${p}`).join("\n")}\n\nNella vostra zona ci sono ${lead.competitors} attività concorrenti con una presenza digitale più strutturata. Questo significa che potenziali clienti scelgono loro.\n\n${approach === "value" ? "Vi offro una consulenza gratuita di 15 minuti per mostrarvi esattamente quanto fatturato state lasciando sul tavolo." : approach === "case" ? `Un'attività simile alla vostra a ${city} ha visto un aumento del 35% nelle prenotazioni dopo aver implementato la nostra soluzione.` : approach === "question" ? `Vi chiedo: quanti clienti al giorno cercano "${sectorLabel} ${city}" su Google? Oggi trovano i vostri competitor.` : `Ho preparato un'analisi digitale personalizzata per ${bn}. I risultati sono pronti — ve li invio?`}\n\nNessun impegno. Nessuna pressione. Solo dati.\n\nResta a disposizione per una breve call quando è più comodo per Lei.\n\nCordiali saluti,\n[Nome]\nEmpire AI Group`,
        `Buongiorno,\n\nSeguo con interesse ${bn} — ${rating}⭐ su Google con ${reviews} recensioni dimostra la qualità del vostro servizio.\n\nTuttavia, ho notato che ${painPoint.toLowerCase()}. Nel 2025, questo significa perdere il 30-40% dei potenziali clienti che cercano online.\n\nLa nostra piattaforma risolve esattamente questo:\n\n✅ App brandizzata con il vostro logo\n✅ Prenotazioni automatiche 24/7\n✅ CRM clienti con storico completo\n✅ Marketing automatizzato basato su IA\n\n💰 Investimento: da €79/mese — si ripaga con 2-3 clienti in più al mese.\n📊 90 giorni di prova gratuita. Zero rischi.\n\nLe va un caffè virtuale di 10 minuti per mostrarle una demo?\n\n[Nome] — Empire AI Group`,
      ],
      friendly: [
        `Ciao!\n\nHo scoperto ${bn} navigando online e devo farvi i complimenti — si vede che c'è passione in quello che fate!\n\nPerò ho notato una cosa: ${painPoint.toLowerCase()}. E questo, purtroppo, vi sta facendo perdere clienti senza che ve ne accorgiate.\n\nVi racconto in 30 secondi cosa facciamo: diamo alle attività come la vostra un'app completamente personalizzata (con il VOSTRO brand, non il nostro) dove i clienti prenotano, ordinano, e tornano grazie a un programma fedeltà automatico.\n\nIl bello? Si configura in 5 minuti e i primi 90 giorni sono gratis.\n\nVi mando il link alla demo? Nessun impegno, promesso! 😊\n\n[Nome]`,
      ],
    },
    whatsapp: {
      professional: [
        `Buongiorno! 👋\n\nSono [Nome] di Empire AI Group.\n\nHo notato ${bn} a ${city} e volevo proporvi qualcosa di concreto:\n\n📊 Nella vostra zona, ${lead.competitors} attività simili hanno già un sistema digitale. Questo significa che i clienti che cercano online scelgono loro.\n\n${approach === "value" ? "Vi offro un'analisi gratuita della vostra visibilità online — vi mostro esattamente dove state perdendo clienti." : `Un'attività simile a ${city} ha visto +35% clienti dopo aver digitalizzato.`}\n\nNessun costo, nessun impegno. Solo dati.\n\nPosso mandarvi il link? 🎯`,
        `Buongiorno! Mi chiamo [Nome].\n\nHo visto ${bn} — ${rating}⭐ con ${reviews} recensioni, complimenti!\n\nUna domanda: ${painPoint.toLowerCase()}?\n\nAbbiamo una soluzione che risolve questo problema e si ripaga da sola:\n✅ App con il vostro brand\n✅ Prenotazioni 24/7\n✅ CRM + Fedeltà\n\n90 giorni gratis. Vi mando la demo? 📱`,
      ],
    },
    instagram: {
      professional: [
        `Ciao ${bn}! 🎯\n\nVi seguo da un po' e il vostro lavoro è davvero notevole.\n\nVolevo farvi una domanda: ${painPoint.toLowerCase()}?\n\nAbbiamo aiutato attività simili alla vostra a ${city} ad aumentare i clienti del 35% con un'app personalizzata.\n\nVi mando un link per vedere come funziona? Zero impegno! ✨`,
        `Ciao ${bn}! 👋\n\nComplimenti per il profilo — si vede la qualità!\n\nHo notato che non avete ${lead.digitalStatus === "none" ? "un sito web" : "un sistema di prenotazione online"}. Nel 2025, questo significa perdere clienti ogni giorno.\n\nPosso mostrarvi in 2 minuti come risolverlo? 🚀`,
      ],
    },
    phone: {
      professional: [
        `📞 SCRIPT TELEFONATA\n\n[APERTURA — 15 secondi]\n"Buongiorno, parlo con il titolare di ${bn}? Mi chiamo [Nome], chiamo per farle una domanda velocissima — le rubo solo 30 secondi."\n\n[DOMANDA CHIAVE]\n"Quanti clienti al giorno cercano '${sectorLabel} ${city}' su Google? Secondo i dati, sono circa 150-300. Quanti di questi arrivano da voi?"\n\n[PROBLEMA]\n"Il fatto è che ${painPoint.toLowerCase()}. E questo significa che quei clienti scelgono i vostri competitor — ce ne sono ${lead.competitors} nella vostra zona con una presenza online più forte."\n\n[SOLUZIONE]\n"Noi risolviamo questo problema con una piattaforma personalizzata per ${sectorLabel}. Le faccio vedere dal telefono — è una demo di 2 minuti."\n\n[CHIUSURA]\n"L'investimento è €79/mese — meno di un cliente perso al giorno. E i primi 90 giorni sono completamente gratis. Quando le fa più comodo? Anche 10 minuti bastano."\n\n[OBIEZIONI]\n• "Non ho tempo" → "Proprio per questo serve: automatizza tutto. La demo dura 2 minuti."\n• "Costa troppo" → "€79/mese. Un solo cliente in più al mese copre il costo 3 volte."\n• "Devo pensarci" → "Perfetto! Le mando il link — lo guarda con calma. La richiamo tra 2 giorni?"`,
      ],
    },
  };

  const channelBodies = bodyTemplates[channel] || bodyTemplates.email;
  const toneBodies = channelBodies[tone] || channelBodies.professional || Object.values(channelBodies)[0];
  const body = (toneBodies || [""])[variant % toneBodies.length] || "";
  const score = Math.floor(78 + Math.random() * 20);

  return { subject, body, score };
}

export default function LeadMessageGenerator({ lead, onClose }: Props) {
  const [channel, setChannel] = useState("email");
  const [tone, setTone] = useState("professional");
  const [approach, setApproach] = useState("value");
  const [variant, setVariant] = useState(0);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedBody, setEditedBody] = useState("");

  const msg = generateMessage(lead, channel, tone, approach, variant);
  const displayBody = editing ? editedBody : msg.body;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${msg.subject}\n\n${displayBody}`);
    setCopied(true);
    toast.success("Messaggio copiato!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    if (!editing) setEditedBody(msg.body);
    setEditing(!editing);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="fixed inset-y-0 right-0 w-full sm:w-[480px] z-50 overflow-y-auto"
      style={{ background: "rgba(10,10,20,0.98)", borderLeft: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>

      <div className="sticky top-0 z-10 flex items-center justify-between p-4" style={{ background: "rgba(10,10,20,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-sm font-bold text-white">Genera Messaggio per {lead.businessName}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)" }}>
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Channel */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "#9ca3af" }}>Canale</label>
          <div className="flex gap-2 flex-wrap">
            {CHANNELS.map(ch => (
              <button key={ch.id} onClick={() => { setChannel(ch.id); setVariant(0); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-semibold transition-all"
                style={{
                  background: channel === ch.id ? `${ch.color}18` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${channel === ch.id ? `${ch.color}40` : "rgba(255,255,255,0.06)"}`,
                  color: channel === ch.id ? ch.color : "#9ca3af",
                }}>
                <ch.icon className="w-3.5 h-3.5" /> {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "#9ca3af" }}>Tono</label>
          <div className="flex gap-2 flex-wrap">
            {TONES.map(t => (
              <button key={t.id} onClick={() => { setTone(t.id); setVariant(0); }}
                className="px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                style={{
                  background: tone === t.id ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${tone === t.id ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}`,
                  color: tone === t.id ? "#a78bfa" : "#9ca3af",
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Approach */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider mb-2 block" style={{ color: "#9ca3af" }}>Approccio</label>
          <div className="grid grid-cols-2 gap-2">
            {APPROACHES.map(a => (
              <button key={a.id} onClick={() => { setApproach(a.id); setVariant(0); }}
                className="p-2.5 rounded-lg text-left transition-all"
                style={{
                  background: approach === a.id ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${approach === a.id ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)"}`,
                }}>
                <span className="text-[11px] font-semibold block" style={{ color: approach === a.id ? "#10b981" : "#d1d5db" }}>{a.label}</span>
                <span className="text-[9px]" style={{ color: "#6b7280" }}>{a.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Preview */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between p-3" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
              <span className="text-[10px] font-bold text-white">Preview Messaggio</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
                <Shield className="w-3 h-3" /> Anti-Spam: {msg.score}/100
              </span>
            </div>
          </div>

          {channel === "email" && (
            <div className="p-3" style={{ background: "rgba(59,130,246,0.03)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-[10px] font-semibold" style={{ color: "#3b82f6" }}>Oggetto: </span>
              <span className="text-[11px] text-white">{msg.subject}</span>
            </div>
          )}

          <div className="p-4">
            {editing ? (
              <textarea value={editedBody} onChange={e => setEditedBody(e.target.value)}
                className="w-full min-h-[300px] text-[11px] leading-relaxed bg-transparent text-white/90 resize-none focus:outline-none" />
            ) : (
              <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-sans" style={{ color: "#d1d5db" }}>{msg.body}</pre>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setVariant(v => v + 1)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-semibold" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
            <RefreshCw className="w-3 h-3" /> Nuova Variante
          </button>
          <button onClick={handleEdit} className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg text-[10px] font-semibold" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}>
            {editing ? <><Save className="w-3 h-3" /> Salva</> : <><Edit3 className="w-3 h-3" /> Modifica</>}
          </button>
          <button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-bold" style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)", color: "#fff" }}>
            {copied ? <><Check className="w-3.5 h-3.5" /> Copiato!</> : <><Copy className="w-3.5 h-3.5" /> Copia Messaggio</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
