import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, Star, Globe, Phone, Mail, TrendingUp, Users, Zap, Target,
  AlertTriangle, ArrowRight,
  MessageCircle, Instagram, Eye,
  Bookmark, ExternalLink, Sparkles
} from "lucide-react";
import { MockLead, SECTOR_OPTIONS, DIGITAL_STATUS_LABELS } from "@/data/mock-leads-data";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  lead: MockLead;
  onClose: () => void;
  onSave?: (lead: MockLead) => void;
}

// ── Score Bar ──
const ScoreBar = forwardRef<HTMLDivElement, { label: string; value: number; color: string }>(
  ({ label, value, color }, ref) => (
    <div ref={ref} className="flex items-center gap-3">
      <span className="text-[10px] font-medium w-28 flex-shrink-0" style={{ color: "#d1d5db" }}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full" style={{ background: color }} />
      </div>
      <span className="text-[10px] font-bold w-8 text-right" style={{ color }}>{value}</span>
    </div>
  )
);
ScoreBar.displayName = "ScoreBar";

const CHANNELS = [
  { id: "whatsapp", icon: MessageCircle, label: "WhatsApp", color: "#25d366" },
  { id: "email", icon: Mail, label: "Email", color: "#3b82f6" },
  { id: "instagram", icon: Instagram, label: "DM", color: "#e4405f" },
  { id: "phone", icon: Phone, label: "Telefono", color: "#f59e0b" },
];

const APPROACHES = [
  { id: "value", label: "Valore Gratis", emoji: "🎁" },
  { id: "case", label: "Case Study", emoji: "📊" },
  { id: "question", label: "Domanda", emoji: "❓" },
  { id: "audit", label: "Audit Free", emoji: "🔍" },
];

export default function LeadCommandPanel({ lead, onClose, onSave }: Props) {
  const navigate = useNavigate();
  const sectorLabel = SECTOR_OPTIONS.find(s => s.value === lead.sector)?.label?.replace(/^[^\s]+\s/, "") || lead.sector;

  const needScore = lead.digitalStatus === "none" ? 92 : lead.digitalStatus === "obsolete" ? 75 : lead.digitalStatus === "basic" ? 50 : 25;
  const budgetScore = lead.opportunityScore > 70 ? 78 : lead.opportunityScore > 50 ? 55 : 35;
  const urgencyScore = lead.googleRating < 3.5 ? 85 : lead.googleRating < 4 ? 60 : 35;
  const conversionScore = needScore > 70 ? 72 : 45;
  const lifetimeScore = Math.min(95, lead.opportunityScore + 15);
  const recommendedPlan = lead.opportunityScore >= 70 ? "Empire Domination" : lead.opportunityScore >= 45 ? "Growth AI" : "Digital Start";
  const planColor = lead.opportunityScore >= 70 ? "#a78bfa" : lead.opportunityScore >= 45 ? "#3b82f6" : "#10b981";
  const scoreColor = lead.opportunityScore >= 70 ? "#10b981" : lead.opportunityScore >= 45 ? "#f59e0b" : "#ef4444";

  const bestChannel = lead.digitalStatus === "none" ? "whatsapp" : lead.googleRating < 3.5 ? "email" : "instagram";
  const bestApproach = lead.opportunityScore >= 70 ? "audit" : lead.opportunityScore >= 45 ? "case" : "value";

  const handleGenerateMessage = () => {
    // Navigate to PartnerDashboard with lead data pre-filled
    const params = new URLSearchParams();
    params.set("sector", lead.sector);
    if (lead.instagram) params.set("ig", lead.instagram);
    if (lead.website) params.set("website", lead.website);
    params.set("channel", bestChannel);
    params.set("lead_name", lead.businessName);
    navigate(`/partner?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-y-0 right-0 w-full sm:w-[460px] z-50 flex flex-col"
      style={{ background: "rgba(8,8,18,0.98)", borderLeft: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(24px)" }}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ background: `${scoreColor}15`, color: scoreColor, border: `1px solid ${scoreColor}30` }}>
          {lead.opportunityScore}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold truncate" style={{ color: "#f3f4f6" }}>{lead.businessName}</h3>
          <p className="text-[10px] truncate" style={{ color: "#9ca3af" }}>{sectorLabel} · {lead.city}, {lead.zone}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-white/10 transition" style={{ background: "rgba(255,255,255,0.05)" }}>
          <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
        </button>
      </div>

      {/* Title */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 pt-3 pb-1">
        <Eye className="w-4 h-4" style={{ color: "#10b981" }} />
        <span className="text-xs font-bold" style={{ color: "#e5e7eb" }}>Analisi AI Lead</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Quick Info */}
        <div className="flex items-center gap-3 flex-wrap text-[10px]" style={{ color: "#d1d5db" }}>
          <span className="flex items-center gap-1"><Star className="w-3 h-3" style={{ color: "#fbbf24" }} /> {lead.googleRating} ({lead.reviewCount})</span>
          {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>}
          {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>}
          {lead.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {lead.website}</span>}
          {lead.instagram && <span className="flex items-center gap-1"><Instagram className="w-3 h-3" style={{ color: "#e4405f" }} /> {lead.instagram}</span>}
        </div>

        {/* Digital Status */}
        <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 mb-2">
            {lead.digitalStatus === "none" ? <AlertTriangle className="w-4 h-4" style={{ color: "#ef4444" }} /> : <Globe className="w-4 h-4" style={{ color: "#3b82f6" }} />}
            <span className="text-xs font-bold" style={{ color: "#e5e7eb" }}>Stato: {DIGITAL_STATUS_LABELS[lead.digitalStatus]}</span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: "#d1d5db" }}>
            {lead.digitalStatus === "none" ? `${lead.businessName} non ha sito web. Chi cerca "${sectorLabel}" a ${lead.city} non lo trova. Opportunità enorme.`
              : lead.digitalStatus === "obsolete" ? `Sito datato e non responsive. Non converte visite in clienti.`
              : lead.digitalStatus === "basic" ? `Sito basico senza prenotazioni online, CRM o automazioni.`
              : `Presenza digitale discreta ma mancano automazioni AI e CRM avanzato.`}
          </p>
        </div>

        {/* Scores */}
        <div className="p-3 rounded-xl space-y-2.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
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
            <span className="text-[11px] font-bold" style={{ color: "#e5e7eb" }}>Competizione</span>
          </div>
          <p className="text-[10px]" style={{ color: "#d1d5db" }}>
            <strong style={{ color: "#fbbf24" }}>{lead.competitors} attività</strong> nella zona {lead.zone} con presenza digitale superiore.
          </p>
        </div>

        {/* Pain Points */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#9ca3af" }}>Pain Points</span>
          {lead.painPoints.map((pp, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.08)" }}>
              <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#ef4444" }} />
              <span className="text-[10px]" style={{ color: "#e5e7eb" }}>{pp}</span>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        <div className="p-3 rounded-xl" style={{ background: `${planColor}08`, border: `1px solid ${planColor}20` }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5" style={{ color: planColor }} />
              <span className="text-[11px] font-bold" style={{ color: "#e5e7eb" }}>Pacchetto Consigliato</span>
            </div>
            <span className="text-xs font-bold" style={{ color: planColor }}>{recommendedPlan}</span>
          </div>
          <p className="text-[10px]" style={{ color: "#d1d5db" }}>Budget: {lead.estimatedBudget}</p>
        </div>

        {/* Strategy */}
        <div className="p-3 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
            <span className="text-[11px] font-bold" style={{ color: "#e5e7eb" }}>Strategia Consigliata</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-1 rounded-md text-[9px] font-bold" style={{ background: CHANNELS.find(c => c.id === bestChannel)?.color + "18", color: CHANNELS.find(c => c.id === bestChannel)?.color }}>
              📱 {CHANNELS.find(c => c.id === bestChannel)?.label}
            </span>
            <span className="text-[9px]" style={{ color: "#6b7280" }}>+</span>
            <span className="px-2 py-1 rounded-md text-[9px] font-bold" style={{ background: "rgba(124,58,237,0.12)", color: "#c4b5fd" }}>
              {APPROACHES.find(a => a.id === bestApproach)?.emoji} {APPROACHES.find(a => a.id === bestApproach)?.label}
            </span>
          </div>
          <p className="text-[10px] mt-2" style={{ color: "#d1d5db" }}>
            {bestChannel === "whatsapp" ? "WhatsApp: canale più diretto. Risposta media entro 2h."
              : bestChannel === "email" ? "Email formale per stabilire credibilità prima del contatto."
              : "DM Instagram: il profilo dimostra attenzione al visual."}
          </p>
        </div>

        {/* Recommended Preview — sector-specific */}
        <div className="p-3 rounded-xl" style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.12)" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <ExternalLink className="w-3.5 h-3.5" style={{ color: "#c4b5fd" }} />
            <span className="text-[10px] font-bold" style={{ color: "#e5e7eb" }}>Preview da Allegare</span>
          </div>
          <p className="text-[10px]" style={{ color: "#d1d5db" }}>
            {lead.sector === "food" ? `🍽️ Demo Ristorante — menu QR, prenotazioni, ordini, CRM clienti`
              : lead.sector === "beauty" ? `💅 Demo Beauty — booking online, promemoria, loyalty, galleria servizi`
              : lead.sector === "fitness" ? `💪 Demo Palestra — iscrizioni, prenotazione corsi, app membri`
              : lead.sector === "ncc" ? `🚗 Demo NCC — prenotazioni, fleet tracking, tariffe, fatturazione`
              : lead.sector === "hospitality" ? `🏨 Demo Hotel — booking diretto, check-in, upselling, guest CRM`
              : lead.sector === "plumber" ? `🔧 Demo Idraulico — richieste intervento, preventivi, portfolio lavori`
              : lead.sector === "electrician" ? `⚡ Demo Elettricista — preventivi online, calendario, portfolio`
              : lead.sector === "healthcare" ? `🏥 Demo Clinica — prenotazione visite, telemedicina, schede pazienti`
              : lead.sector === "retail" ? `🛍️ Demo Negozio — catalogo online, e-commerce, inventario, loyalty`
              : lead.sector === "construction" ? `🏗️ Demo Edilizia — portfolio progetti, timeline, preventivi`
              : lead.sector === "veterinary" ? `🐾 Demo Veterinario — visite, cartelle cliniche, vaccini, shop`
              : lead.sector === "beach" ? `🏖️ Demo Stabilimento — mappa ombrelloni, prenotazioni, abbonamenti`
              : lead.sector === "tattoo" ? `🎨 Demo Tattoo — portfolio artisti, booking, galleria, consensi`
              : lead.sector === "photography" ? `📷 Demo Fotografo — portfolio, booking sessioni, galleria clienti`
              : lead.sector === "gardening" ? `🌿 Demo Giardinaggio — catalogo servizi, preventivi, portfolio`
              : lead.sector === "legal" ? `⚖️ Demo Studio Legale — consulenze online, gestione pratiche`
              : lead.sector === "accounting" ? `📊 Demo Commercialista — portale clienti, scadenzario fiscale`
              : lead.sector === "garage" ? `🔩 Demo Officina — prenotazione tagliandi, storico interventi`
              : lead.sector === "cleaning" ? `🧹 Demo Pulizie — preventivi istantanei, booking, abbonamenti`
              : lead.sector === "events" ? `🎉 Demo Eventi — catalogo, booking location, preventivi wedding`
              : `📱 Preview "${sectorLabel}" — sito + app + admin + AI integrata`}
          </p>
          <p className="text-[9px] mt-1 font-mono" style={{ color: "#9ca3af" }}>
            empireia.lovable.app/demo/{lead.sector}
          </p>
        </div>

        {/* CTA */}
        <div className="flex gap-2">
          {onSave && (
            <button onClick={() => { onSave(lead); toast.success("Salvato nella Pipeline!"); }} className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-[10px] font-semibold" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd" }}>
              <Bookmark className="w-3.5 h-3.5" /> Salva
            </button>
          )}
          <button onClick={handleGenerateMessage}
            className="flex-1 py-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 text-white"
            style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}>
            Genera Messaggio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
