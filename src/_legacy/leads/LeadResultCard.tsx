import { motion } from "framer-motion";
import { Star, Globe, Phone, Mail, MapPin, Eye, MessageSquare, BookmarkPlus, Instagram, ExternalLink } from "lucide-react";
import { MockLead, DIGITAL_STATUS_LABELS } from "@/data/mock-leads-data";

const DIGITAL_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  none: { bg: "rgba(239,68,68,0.12)", text: "#ef4444" },
  obsolete: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b" },
  basic: { bg: "rgba(59,130,246,0.12)", text: "#3b82f6" },
  good: { bg: "rgba(16,185,129,0.12)", text: "#10b981" },
};

interface Props {
  lead: MockLead;
  index: number;
  onAnalyze: (lead: MockLead) => void;
  onMessage: (lead: MockLead) => void;
  onSave: (lead: MockLead) => void;
}

export default function LeadResultCard({ lead, index, onAnalyze, onMessage, onSave }: Props) {
  const statusStyle = DIGITAL_STATUS_COLORS[lead.digitalStatus];
  const scoreColor = lead.opportunityScore >= 70 ? "#10b981" : lead.opportunityScore >= 45 ? "#f59e0b" : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="rounded-xl p-4 transition-all hover:border-white/20 group"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold truncate" style={{ color: "#f3f4f6" }}>{lead.businessName}</h4>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold" style={{ background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.text}30` }}>
              {DIGITAL_STATUS_LABELS[lead.digitalStatus]}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-[10px]" style={{ color: "#d1d5db" }}>
              <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: "#9ca3af" }} /> {lead.zone}, {lead.city}
            </span>
            <span className="flex items-center gap-1 text-[10px]" style={{ color: "#fbbf24" }}>
              <Star className="w-3 h-3 fill-current" /> {lead.googleRating} ({lead.reviewCount})
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {lead.phone && (
              <span className="flex items-center gap-1 text-[10px]" style={{ color: "#9ca3af" }}>
                <Phone className="w-3 h-3" /> {lead.phone}
              </span>
            )}
            {lead.instagram && (
              <span className="flex items-center gap-1 text-[10px]" style={{ color: "#e4405f" }}>
                <Instagram className="w-3 h-3" /> {lead.instagram}
              </span>
            )}
            {lead.website && (
              <span className="flex items-center gap-1 text-[10px]" style={{ color: "#60a5fa" }}>
                <Globe className="w-3 h-3" /> {lead.website}
              </span>
            )}
          </div>
          {/* Pain points preview */}
          <div className="flex gap-1 mt-2 flex-wrap">
            {lead.painPoints.slice(0, 2).map((pp, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded text-[8px] font-medium" style={{ background: "rgba(239,68,68,0.08)", color: "#fca5a5" }}>
                ⚠️ {pp.length > 30 ? pp.slice(0, 30) + "…" : pp}
              </span>
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: `${scoreColor}15`, color: scoreColor, border: `1px solid ${scoreColor}30` }}>
            {lead.opportunityScore}
          </div>
          <span className="text-[8px] mt-1 font-bold uppercase tracking-wider" style={{ color: scoreColor }}>Score</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button onClick={() => onAnalyze(lead)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-semibold transition-all hover:opacity-80" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#c4b5fd" }}>
          <Eye className="w-3 h-3" /> Analizza
        </button>
        <button onClick={() => onMessage(lead)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-semibold transition-all hover:opacity-80" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#6ee7b7" }}>
          <MessageSquare className="w-3 h-3" /> Messaggio
        </button>
        {lead.googleMapsUrl && (
          <a href={lead.googleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg text-[10px] font-semibold transition-all hover:opacity-80"
            style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fbbf24" }}>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        <button onClick={() => onSave(lead)} className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg text-[10px] font-semibold transition-all hover:opacity-80" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#93c5fd" }}>
          <BookmarkPlus className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
