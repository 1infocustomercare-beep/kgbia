import { motion } from "framer-motion";
import { X, MapPin, Star, Globe, Phone, Mail, TrendingUp, Users, Zap, Target, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { MockLead, DIGITAL_STATUS_LABELS } from "@/data/mock-leads-data";
import { SECTOR_OPTIONS } from "@/data/mock-leads-data";

interface Props {
  lead: MockLead;
  onClose: () => void;
  onMessage: (lead: MockLead) => void;
}

const ScoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between">
      <span className="text-[10px] font-medium" style={{ color: "#9ca3af" }}>{label}</span>
      <span className="text-[10px] font-bold" style={{ color }}>{value}/100</span>
    </div>
    <div className="h-1.5 rounded-full bg-white/5">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-full rounded-full" style={{ background: color }} />
    </div>
  </div>
);

export default function LeadAnalysisPanel({ lead, onClose, onMessage }: Props) {
  const sectorLabel = SECTOR_OPTIONS.find(s => s.value === lead.sector)?.label || lead.sector;
  const needScore = lead.digitalStatus === "none" ? 92 : lead.digitalStatus === "obsolete" ? 75 : lead.digitalStatus === "basic" ? 50 : 25;
  const budgetScore = lead.opportunityScore > 70 ? 78 : lead.opportunityScore > 50 ? 55 : 35;
  const urgencyScore = lead.googleRating < 3.5 ? 85 : lead.googleRating < 4 ? 60 : 35;
  const conversionScore = needScore > 70 ? 72 : 45;
  const lifetimeScore = Math.min(95, lead.opportunityScore + 15);

  const recommendedPlan = lead.opportunityScore >= 70 ? "Empire Domination" : lead.opportunityScore >= 45 ? "Growth AI" : "Digital Start";
  const planColor = lead.opportunityScore >= 70 ? "#a78bfa" : lead.opportunityScore >= 45 ? "#3b82f6" : "#10b981";

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="fixed inset-y-0 right-0 w-full sm:w-[440px] z-50 overflow-y-auto"
      style={{ background: "rgba(10,10,20,0.98)", borderLeft: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>

      <div className="sticky top-0 z-10 flex items-center justify-between p-4" style={{ background: "rgba(10,10,20,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-sm font-bold text-white">Analisi Lead</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)" }}>
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Header */}
        <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h4 className="text-base font-bold text-white mb-1">{lead.businessName}</h4>
          <p className="text-xs" style={{ color: "#9ca3af" }}>{sectorLabel} · {lead.city}, {lead.zone}</p>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="flex items-center gap-1 text-[10px]" style={{ color: "#fbbf24" }}><Star className="w-3 h-3 fill-current" /> {lead.googleRating} ({lead.reviewCount} recensioni)</span>
            {lead.website && <span className="flex items-center gap-1 text-[10px]" style={{ color: "#6b7280" }}><Globe className="w-3 h-3" /> {lead.website}</span>}
          </div>
        </div>

        {/* Analisi Digitale */}
        <div>
          <h5 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "#9ca3af" }}>Analisi Digitale AI</h5>
          <div className="space-y-2 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex items-center gap-2">
              {lead.digitalStatus === "none" ? <AlertTriangle className="w-4 h-4" style={{ color: "#ef4444" }} /> : <Globe className="w-4 h-4" style={{ color: "#3b82f6" }} />}
              <span className="text-xs text-white font-medium">Stato: {DIGITAL_STATUS_LABELS[lead.digitalStatus]}</span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: "#9ca3af" }}>
              {lead.digitalStatus === "none" ? `${lead.businessName} non ha alcun sito web. I potenziali clienti che cercano "${sectorLabel}" a ${lead.city} non lo trovano online. Opportunità enorme.`
                : lead.digitalStatus === "obsolete" ? `Il sito di ${lead.businessName} è datato e non responsive. Non converte visite in clienti e danneggia la percezione del brand.`
                : lead.digitalStatus === "basic" ? `${lead.businessName} ha un sito basico ma manca di funzionalità chiave: nessuna prenotazione online, nessun CRM, nessuna automazione.`
                : `${lead.businessName} ha una presenza digitale discreta, ma mancano automazioni AI e CRM avanzato per massimizzare il valore di ogni cliente.`}
            </p>
          </div>
        </div>

        {/* Score Card */}
        <div>
          <h5 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "#9ca3af" }}>Score Card</h5>
          <div className="space-y-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <ScoreBar label="Necessità Digitale" value={needScore} color="#ef4444" />
            <ScoreBar label="Budget Stimato" value={budgetScore} color="#3b82f6" />
            <ScoreBar label="Urgenza" value={urgencyScore} color="#f59e0b" />
            <ScoreBar label="Facilità Conversione" value={conversionScore} color="#10b981" />
            <ScoreBar label="Valore Lifetime" value={lifetimeScore} color="#a78bfa" />
          </div>
        </div>

        {/* Competitor */}
        <div className="p-3 rounded-xl" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4" style={{ color: "#f59e0b" }} />
            <span className="text-xs font-bold text-white">Analisi Competitiva</span>
          </div>
          <p className="text-[11px]" style={{ color: "#d1d5db" }}>
            Nella zona {lead.zone}, {lead.city} ci sono <strong>{lead.competitors} attività</strong> dello stesso settore con presenza digitale superiore. {lead.businessName} rischia di perdere clienti ogni giorno.
          </p>
        </div>

        {/* Pain Points */}
        <div>
          <h5 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "#9ca3af" }}>Pain Points Identificati</h5>
          <div className="space-y-2">
            {lead.painPoints.map((pp, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.08)" }}>
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#ef4444" }} />
                <span className="text-[11px]" style={{ color: "#d1d5db" }}>{pp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-4 rounded-xl" style={{ background: `${planColor}10`, border: `1px solid ${planColor}25` }}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4" style={{ color: planColor }} />
            <span className="text-xs font-bold text-white">Pacchetto Consigliato</span>
          </div>
          <p className="text-base font-bold mb-1" style={{ color: planColor }}>{recommendedPlan}</p>
          <p className="text-[11px]" style={{ color: "#9ca3af" }}>
            {lead.opportunityScore >= 70 ? `${lead.businessName} ha urgente bisogno di digitalizzazione completa. Il pacchetto ${recommendedPlan} copre tutte le lacune e garantisce ROI immediato.`
              : lead.opportunityScore >= 45 ? `Investimento moderato con crescita graduale. La componente AI del pacchetto ${recommendedPlan} automatizzerà i processi più critici.`
              : `Approccio graduale: partire dalle basi digitali per costruire fiducia e poi scalare.`}
          </p>
          <p className="text-xs font-bold mt-2" style={{ color: "#d1d5db" }}>Budget stimato: {lead.estimatedBudget}</p>
        </div>

        {/* CTA */}
        <button onClick={() => onMessage(lead)} className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)", color: "#ffffff" }}>
          Genera Messaggio Personalizzato <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
