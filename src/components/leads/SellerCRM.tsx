import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Briefcase, BarChart3, Bell, Calendar, MessageCircle, Phone, Mail,
  Globe, Instagram, Star, Trash2, Download, Send, Edit3, Save, Plus,
  TrendingUp, Award, Target, Clock, ChevronRight, Loader2, AlertCircle, Filter
} from "lucide-react";
import { toast } from "sonner";
import {
  PIPELINE_STAGES, getStageMeta, getOverdueFollowups, getTodayFollowups,
  type PipelineLead, type PipelineStageId, type Interaction
} from "@/hooks/useSellerPipeline";
import { exportLeadsToCSV, buildWhatsAppLink, buildOutreachMessage } from "@/lib/seller-export";
import LeadIntelligenceLauncher from "@/components/leads/LeadIntelligenceLauncher";
import WhatsAppABDialog, { type ABLeadInput } from "@/components/leads/WhatsAppABDialog";
import { FlaskConical } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  leads: PipelineLead[];
  loading: boolean;
  onUpdateStage: (id: string, status: PipelineStageId) => void;
  onAddInteraction: (id: string, interaction: Omit<Interaction, "ts">) => void;
  onScheduleFollowup: (id: string, days: number) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateValue: (id: string, value: number) => void;
  onDeleteLead: (id: string) => void;
}

type Tab = "pipeline" | "today" | "analytics" | "tutorial";

const FOLLOWUP_PRESETS = [
  { days: 1, label: "Domani" },
  { days: 3, label: "+3 giorni" },
  { days: 7, label: "+1 settimana" },
  { days: 14, label: "+2 settimane" },
];

export default function SellerCRM({
  open, onClose, leads, loading,
  onUpdateStage, onAddInteraction, onScheduleFollowup, onUpdateNotes, onUpdateValue, onDeleteLead,
}: Props) {
  const [tab, setTab] = useState<Tab>("pipeline");
  const [stageFilter, setStageFilter] = useState<PipelineStageId | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [abDialogLead, setAbDialogLead] = useState<ABLeadInput | null>(null);

  /* ─── Derived metrics: 100% real data, no fake values ─── */
  const metrics = useMemo(() => {
    const total = leads.length;
    const contacted = leads.filter(l => l.status !== "new").length;
    const replied = leads.filter(l => ["replied", "demo_booked", "negotiating", "won"].includes(l.status)).length;
    const won = leads.filter(l => l.status === "won").length;
    const lost = leads.filter(l => l.status === "lost").length;
    const inFlight = leads.filter(l => !["won", "lost"].includes(l.status));
    const pipelineValue = inFlight.reduce((sum, l) => sum + (l.estimated_value || 0), 0);
    const wonValue = leads.filter(l => l.status === "won").reduce((sum, l) => sum + (l.estimated_value || 0), 0);
    const replyRate = contacted > 0 ? Math.round((replied / contacted) * 100) : 0;
    const conversionRate = contacted > 0 ? Math.round((won / contacted) * 100) : 0;

    // Top sector by count
    const sectorCount: Record<string, number> = {};
    leads.forEach(l => { if (l.sector) sectorCount[l.sector] = (sectorCount[l.sector] || 0) + 1; });
    const topSector = Object.entries(sectorCount).sort((a, b) => b[1] - a[1])[0] || ["—", 0];

    // Channel that got the most replies
    const channelReplies: Record<string, number> = {};
    leads.forEach(l => {
      if (["replied", "demo_booked", "negotiating", "won"].includes(l.status) && l.channel_used) {
        channelReplies[l.channel_used] = (channelReplies[l.channel_used] || 0) + 1;
      }
    });
    const topChannel = Object.entries(channelReplies).sort((a, b) => b[1] - a[1])[0] || ["—", 0];

    // Activity last 7 days
    const weekAgo = Date.now() - 7 * 86400_000;
    const activityWeek = leads.reduce((acc, l) => {
      return acc + l.interactions.filter(i => new Date(i.ts).getTime() > weekAgo).length;
    }, 0);

    return { total, contacted, replied, won, lost, pipelineValue, wonValue, replyRate, conversionRate, topSector, topChannel, activityWeek };
  }, [leads]);

  const overdue = useMemo(() => getOverdueFollowups(leads), [leads]);
  const todayFollowups = useMemo(() => getTodayFollowups(leads), [leads]);

  /* ─── Stage-counted columns ─── */
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PIPELINE_STAGES.forEach(s => { counts[s.id] = leads.filter(l => l.status === s.id).length; });
    return counts;
  }, [leads]);

  const filteredLeads = stageFilter === "all" ? leads : leads.filter(l => l.status === stageFilter);

  /* ─── Bulk actions ─── */
  const handleExportCSV = () => {
    if (leads.length === 0) { toast.error("Nessun lead nel CRM"); return; }
    exportLeadsToCSV(leads, `empire-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    toast.success(`📥 ${leads.length} lead esportati in CSV`);
  };

  const handleBulkWhatsApp = () => {
    const targets = filteredLeads.filter(l => l.phone);
    if (targets.length === 0) { toast.error("Nessun lead con telefono nei filtri attuali"); return; }
    const demoLink = `${window.location.origin}/demo`;
    let openedCount = 0;
    targets.slice(0, 5).forEach((lead, idx) => {
      setTimeout(() => {
        const link = buildWhatsAppLink(lead.phone, buildOutreachMessage(lead, demoLink));
        if (link) {
          window.open(link, "_blank");
          openedCount++;
          onAddInteraction(lead.id, { channel: "whatsapp", direction: "out", text: "Bulk outreach", status: "opened" });
        }
      }, idx * 800);
    });
    toast.success(`📤 Apertura WhatsApp per ${Math.min(targets.length, 5)} lead`, {
      description: targets.length > 5 ? `(massimo 5 per volta — altri ${targets.length - 5} in coda)` : "Verifica e invia ogni messaggio"
    });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] overflow-hidden"
        style={{ background: "rgba(5,5,15,0.85)", backdropFilter: "blur(12px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 280 }}
          className="absolute inset-x-0 bottom-0 top-4 rounded-t-3xl overflow-hidden flex flex-col"
          style={{
            background: "linear-gradient(180deg, #0d0d18 0%, #0a0a14 100%)",
            border: "1px solid rgba(167,139,250,0.2)",
            boxShadow: "0 -20px 60px rgba(167,139,250,0.15)",
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* ═══ Header ═══ */}
          <div className="px-4 pt-3 pb-2 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-10 h-1 rounded-full mx-auto mb-3" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(20,184,166,0.15))", border: "1px solid rgba(167,139,250,0.3)" }}>
                  <Briefcase className="w-4 h-4" style={{ color: "#c4b5fd" }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">CRM Venditore</p>
                  <p className="text-[10px]" style={{ color: "#9ca3af" }}>{leads.length} lead · {metrics.activityWeek} azioni 7gg</p>
                </div>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* ═══ Tabs ═══ */}
            <div className="flex gap-1 overflow-x-auto -mx-1 px-1 pb-1 scrollbar-none">
              {([
                { id: "pipeline" as Tab, icon: Briefcase, label: "Pipeline", badge: leads.length, alert: false },
                { id: "today" as Tab, icon: Bell, label: "Oggi", badge: overdue.length + todayFollowups.length, alert: overdue.length > 0 },
                { id: "analytics" as Tab, icon: BarChart3, label: "Stats", badge: 0, alert: false },
                { id: "tutorial" as Tab, icon: AlertCircle, label: "Guida", badge: 0, alert: false },
              ]).map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all"
                  style={{
                    background: tab === t.id ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${tab === t.id ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.06)"}`,
                    color: tab === t.id ? "#c4b5fd" : "#9ca3af",
                  }}>
                  <t.icon className="w-3 h-3" />
                  {t.label}
                  {(t.badge ?? 0) > 0 && (
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full"
                      style={{
                        background: t.alert ? "#ef4444" : "rgba(167,139,250,0.3)",
                        color: "#fff", minWidth: 14, textAlign: "center"
                      }}>{t.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ═══ BODY ═══ */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {loading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#a78bfa" }} />
              </div>
            )}

            {!loading && tab === "pipeline" && (
              <PipelineTab
                leads={filteredLeads}
                stageCounts={stageCounts}
                stageFilter={stageFilter}
                setStageFilter={setStageFilter}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                onUpdateStage={onUpdateStage}
                onAddInteraction={onAddInteraction}
                onScheduleFollowup={onScheduleFollowup}
                onUpdateNotes={onUpdateNotes}
                onUpdateValue={onUpdateValue}
                onDeleteLead={onDeleteLead}
                onExportCSV={handleExportCSV}
                onBulkWhatsApp={handleBulkWhatsApp}
              />
            )}

            {!loading && tab === "today" && (
              <TodayTab
                overdue={overdue}
                todayFollowups={todayFollowups}
                onAddInteraction={onAddInteraction}
                onScheduleFollowup={onScheduleFollowup}
                setExpandedId={(id) => { setExpandedId(id); setTab("pipeline"); }}
              />
            )}

            {!loading && tab === "analytics" && <AnalyticsTab metrics={metrics} leads={leads} />}

            {!loading && tab === "tutorial" && <TutorialTab />}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PIPELINE TAB
   ═══════════════════════════════════════════════════════════════ */
function PipelineTab(props: {
  leads: PipelineLead[];
  stageCounts: Record<string, number>;
  stageFilter: PipelineStageId | "all";
  setStageFilter: (s: PipelineStageId | "all") => void;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onUpdateStage: (id: string, status: PipelineStageId) => void;
  onAddInteraction: (id: string, i: Omit<Interaction, "ts">) => void;
  onScheduleFollowup: (id: string, days: number) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateValue: (id: string, value: number) => void;
  onDeleteLead: (id: string) => void;
  onExportCSV: () => void;
  onBulkWhatsApp: () => void;
}) {
  const { leads, stageCounts, stageFilter, setStageFilter, expandedId, setExpandedId } = props;

  return (
    <div className="p-3 space-y-3">
      {/* Stage filter chips */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
        <button onClick={() => setStageFilter("all")}
          className="px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap"
          style={{
            background: stageFilter === "all" ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${stageFilter === "all" ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.06)"}`,
            color: stageFilter === "all" ? "#c4b5fd" : "#9ca3af",
          }}>
          Tutti · {leads.length}
        </button>
        {PIPELINE_STAGES.map(s => (
          <button key={s.id} onClick={() => setStageFilter(s.id)}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap flex items-center gap-1"
            style={{
              background: stageFilter === s.id ? `${s.color}22` : "rgba(255,255,255,0.03)",
              border: `1px solid ${stageFilter === s.id ? `${s.color}55` : "rgba(255,255,255,0.06)"}`,
              color: stageFilter === s.id ? s.color : "#9ca3af",
            }}>
            <span>{s.emoji}</span> {s.label} · {stageCounts[s.id] || 0}
          </button>
        ))}
      </div>

      {/* Bulk actions */}
      <div className="flex gap-2">
        <button onClick={props.onExportCSV}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#34d399" }}>
          <Download className="w-3 h-3" /> Esporta CSV
        </button>
        <button onClick={props.onBulkWhatsApp}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold"
          style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", color: "#25D366" }}>
          <Send className="w-3 h-3" /> Bulk WhatsApp
        </button>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <Briefcase className="w-10 h-10 mx-auto mb-2" style={{ color: "#4b5563" }} />
          <p className="text-xs font-bold text-white mb-1">Pipeline vuota</p>
          <p className="text-[10px]" style={{ color: "#6b7280" }}>
            Salva un lead dalla ricerca per iniziare a tracciarlo qui
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {leads.map(lead => (
            <LeadCard key={lead.id} lead={lead} expanded={expandedId === lead.id}
              onToggle={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
              onOpenAB={(props as any).onOpenAB}
              {...props}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── LeadCard with actions ─── */
function LeadCard({
  lead, expanded, onToggle,
  onUpdateStage, onAddInteraction, onScheduleFollowup, onUpdateNotes, onUpdateValue, onDeleteLead,
  onOpenAB,
}: {
  lead: PipelineLead; expanded: boolean; onToggle: () => void;
  onUpdateStage: (id: string, status: PipelineStageId) => void;
  onAddInteraction: (id: string, i: Omit<Interaction, "ts">) => void;
  onScheduleFollowup: (id: string, days: number) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateValue: (id: string, value: number) => void;
  onDeleteLead: (id: string) => void;
  onOpenAB?: (lead: ABLeadInput) => void;
}) {
  const stage = getStageMeta(lead.status);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(lead.notes || "");
  const [valueDraft, setValueDraft] = useState(String(lead.estimated_value || ""));
  const isOverdue = lead.next_followup_at && new Date(lead.next_followup_at).getTime() < Date.now();

  const saveNotes = () => { onUpdateNotes(lead.id, notesDraft); setEditingNotes(false); toast.success("Note salvate"); };
  const saveValue = () => { const n = Number(valueDraft) || 0; onUpdateValue(lead.id, n); toast.success(`Valore: €${n}`); };

  return (
    <motion.div layout
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${expanded ? `${stage.color}40` : "rgba(255,255,255,0.06)"}` }}>
      {/* Header — tap to expand */}
      <button onClick={onToggle} className="w-full p-3 text-left">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: `${stage.color}20`, border: `1px solid ${stage.color}40` }}>
            {stage.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-xs font-bold text-white truncate">{lead.name}</p>
              {lead.ai_score != null && (
                <span className="text-[8px] font-black px-1.5 py-0.5 rounded"
                  style={{
                    background: lead.ai_score >= 70 ? "rgba(34,197,94,0.15)" : lead.ai_score >= 45 ? "rgba(245,158,11,0.15)" : "rgba(107,114,128,0.15)",
                    color: lead.ai_score >= 70 ? "#22c55e" : lead.ai_score >= 45 ? "#f59e0b" : "#9ca3af",
                  }}>
                  {lead.ai_score}
                </span>
              )}
            </div>
            <p className="text-[10px]" style={{ color: "#9ca3af" }}>
              {[lead.sector, lead.city].filter(Boolean).join(" · ") || "—"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-bold" style={{ color: stage.color }}>{stage.label}</span>
              {isOverdue && (
                <span className="text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-1"
                  style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>
                  <AlertCircle className="w-2 h-2" /> Follow-up scaduto
                </span>
              )}
              {lead.estimated_value > 0 && (
                <span className="text-[9px] font-bold" style={{ color: "#34d399" }}>€{lead.estimated_value.toLocaleString("it-IT")}</span>
              )}
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`} style={{ color: "#6b7280" }} />
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="px-3 pb-3 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              {/* Quick actions */}
              <div className="grid grid-cols-4 gap-1.5 pt-3">
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} onClick={() => onAddInteraction(lead.id, { channel: "phone", direction: "out", text: "Chiamata avviata" })}
                    className="flex flex-col items-center gap-1 py-2 rounded-lg text-[8px] font-bold"
                    style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa" }}>
                    <Phone className="w-3 h-3" /> Chiama
                  </a>
                )}
                {lead.phone && (
                  <a href={buildWhatsAppLink(lead.phone, buildOutreachMessage(lead, `${window.location.origin}/demo`)) || "#"}
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => onAddInteraction(lead.id, { channel: "whatsapp", direction: "out", text: "WhatsApp aperto" })}
                    className="flex flex-col items-center gap-1 py-2 rounded-lg text-[8px] font-bold"
                    style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", color: "#25D366" }}>
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </a>
                )}
                {lead.email && (
                  <a href={`mailto:${lead.email}`} onClick={() => onAddInteraction(lead.id, { channel: "email", direction: "out", text: "Email aperta" })}
                    className="flex flex-col items-center gap-1 py-2 rounded-lg text-[8px] font-bold"
                    style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", color: "#93c5fd" }}>
                    <Mail className="w-3 h-3" /> Email
                  </a>
                )}
                {lead.instagram && (
                  <a href={lead.instagram.startsWith("http") ? lead.instagram : `https://instagram.com/${lead.instagram.replace("@", "")}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={() => onAddInteraction(lead.id, { channel: "instagram", direction: "out", text: "IG aperto" })}
                    className="flex flex-col items-center gap-1 py-2 rounded-lg text-[8px] font-bold"
                    style={{ background: "rgba(228,64,95,0.1)", border: "1px solid rgba(228,64,95,0.25)", color: "#E4405F" }}>
                    <Instagram className="w-3 h-3" /> IG
                  </a>
                )}
                {lead.website && (
                  <a href={lead.website} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 py-2 rounded-lg text-[8px] font-bold"
                    style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}>
                    <Globe className="w-3 h-3" /> Sito
                  </a>
                )}
              </div>

              {/* ═══ Test A/B WhatsApp — confronta 2 messaggi e traccia clic+risposte ═══ */}
              {lead.phone && onOpenAB && (
                <button
                  onClick={() => onOpenAB({ id: lead.id, name: lead.name, phone: lead.phone, city: lead.city, sector: lead.sector })}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold"
                  style={{
                    background: "linear-gradient(135deg, rgba(37,211,102,0.15), rgba(124,58,237,0.15))",
                    border: "1px solid rgba(124,58,237,0.4)",
                    color: "#c4b5fd",
                  }}>
                  <FlaskConical className="w-3 h-3" />
                  Test A/B WhatsApp · confronta 2 messaggi
                </button>
              )}

              {/* ═══ Intelligence Report — analisi profonda + script vendita ═══ */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#6b7280" }}>
                  🧠 Intelligence — analisi profonda & script vendita
                </p>
                <LeadIntelligenceLauncher
                  lead={{
                    name: lead.name,
                    city: lead.city,
                    sector: lead.sector,
                    website: lead.website,
                    phone: lead.phone,
                    instagram: lead.instagram,
                  }}
                  variant="full"
                />
              </div>

              {/* Move to stage */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#6b7280" }}>Sposta in stato</p>
                <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
                  {PIPELINE_STAGES.filter(s => s.id !== lead.status).map(s => (
                    <button key={s.id} onClick={() => onUpdateStage(lead.id, s.id)}
                      className="px-2 py-1 rounded-lg text-[9px] font-bold whitespace-nowrap flex items-center gap-1"
                      style={{ background: `${s.color}15`, border: `1px solid ${s.color}30`, color: s.color }}>
                      {s.emoji} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule follow-up */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#6b7280" }}>
                  Pianifica follow-up {lead.next_followup_at && (
                    <span className="ml-1" style={{ color: isOverdue ? "#ef4444" : "#a78bfa" }}>
                      · {new Date(lead.next_followup_at).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-4 gap-1">
                  {FOLLOWUP_PRESETS.map(p => (
                    <button key={p.days} onClick={() => onScheduleFollowup(lead.id, p.days)}
                      className="py-1.5 rounded-lg text-[9px] font-bold"
                      style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", color: "#c4b5fd" }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated value */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#6b7280" }}>Valore stimato vendita (€)</p>
                <div className="flex gap-1.5">
                  <input type="number" min="0" value={valueDraft} onChange={e => setValueDraft(e.target.value)}
                    placeholder="es. 1997"
                    className="flex-1 px-2.5 py-1.5 rounded-lg text-[11px] text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                  <button onClick={saveValue}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold"
                    style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#34d399" }}>
                    <Save className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#6b7280" }}>Note personali</p>
                  {!editingNotes && (
                    <button onClick={() => { setNotesDraft(lead.notes || ""); setEditingNotes(true); }}
                      className="text-[9px] font-bold flex items-center gap-1" style={{ color: "#a78bfa" }}>
                      <Edit3 className="w-2.5 h-2.5" /> Modifica
                    </button>
                  )}
                </div>
                {editingNotes ? (
                  <div className="space-y-1.5">
                    <textarea value={notesDraft} onChange={e => setNotesDraft(e.target.value)}
                      placeholder="Es. Preferisce essere chiamato di mattina, gestore Marco..."
                      rows={3}
                      className="w-full px-2.5 py-1.5 rounded-lg text-[11px] text-white outline-none resize-none"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
                    <div className="flex gap-1.5">
                      <button onClick={saveNotes} className="flex-1 py-1.5 rounded-lg text-[10px] font-bold"
                        style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#34d399" }}>Salva</button>
                      <button onClick={() => setEditingNotes(false)} className="flex-1 py-1.5 rounded-lg text-[10px] font-bold"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}>Annulla</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] p-2 rounded-lg whitespace-pre-wrap" style={{ background: "rgba(255,255,255,0.02)", color: lead.notes ? "#e5e7eb" : "#6b7280", border: "1px solid rgba(255,255,255,0.04)" }}>
                    {lead.notes || "Nessuna nota — aggiungi info sul contatto, orari migliori, dettagli rilevanti."}
                  </p>
                )}
              </div>

              {/* Interactions log */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#6b7280" }}>Cronologia ({lead.interactions.length})</p>
                {lead.interactions.length === 0 ? (
                  <p className="text-[10px] italic p-2 rounded-lg" style={{ color: "#6b7280", background: "rgba(255,255,255,0.02)" }}>
                    Nessuna interazione tracciata. Apri un canale qui sopra per iniziare.
                  </p>
                ) : (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {[...lead.interactions].reverse().slice(0, 10).map((i, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <span className="text-[10px] mt-0.5">
                          {i.channel === "whatsapp" ? "💬" : i.channel === "email" ? "📧" : i.channel === "phone" ? "📞" : i.channel === "instagram" ? "📸" : "📝"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-bold" style={{ color: i.direction === "in" ? "#34d399" : i.direction === "out" ? "#a78bfa" : "#9ca3af" }}>
                            {i.direction === "in" ? "← Ricevuto" : i.direction === "out" ? "→ Inviato" : "Nota"} · {new Date(i.ts).toLocaleString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </p>
                          <p className="text-[10px] truncate" style={{ color: "#e5e7eb" }}>{i.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Quick log inbound reply */}
                <button onClick={() => onAddInteraction(lead.id, { channel: "whatsapp", direction: "in", text: "Risposta ricevuta" })}
                  className="w-full mt-1.5 py-1.5 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1"
                  style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#34d399" }}>
                  <Plus className="w-2.5 h-2.5" /> Logga risposta ricevuta
                </button>
              </div>

              {/* Delete */}
              <button onClick={() => { if (confirm(`Rimuovere ${lead.name} dal CRM?`)) onDeleteLead(lead.id); }}
                className="w-full py-1.5 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1"
                style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444" }}>
                <Trash2 className="w-2.5 h-2.5" /> Rimuovi dal CRM
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TODAY TAB — overdue & today follow-ups
   ═══════════════════════════════════════════════════════════════ */
function TodayTab({ overdue, todayFollowups, onAddInteraction, onScheduleFollowup, setExpandedId }: {
  overdue: PipelineLead[]; todayFollowups: PipelineLead[];
  onAddInteraction: (id: string, i: Omit<Interaction, "ts">) => void;
  onScheduleFollowup: (id: string, days: number) => void;
  setExpandedId: (id: string) => void;
}) {
  const renderRow = (l: PipelineLead, isOverdue: boolean) => {
    const stage = getStageMeta(l.status);
    return (
      <div key={l.id} className="p-3 rounded-xl flex items-center gap-2.5"
        style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${isOverdue ? "rgba(239,68,68,0.25)" : "rgba(167,139,250,0.2)"}` }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: `${stage.color}20`, border: `1px solid ${stage.color}40` }}>
          {stage.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{l.name}</p>
          <p className="text-[10px]" style={{ color: isOverdue ? "#ef4444" : "#a78bfa" }}>
            {isOverdue ? "⚠️ Scaduto" : "📅 Oggi"}: {l.next_followup_at ? new Date(l.next_followup_at).toLocaleString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          {l.phone && (
            <a href={buildWhatsAppLink(l.phone, buildOutreachMessage(l, `${window.location.origin}/demo`)) || "#"}
              target="_blank" rel="noopener noreferrer"
              onClick={() => { onAddInteraction(l.id, { channel: "whatsapp", direction: "out", text: "Follow-up WhatsApp" }); onScheduleFollowup(l.id, 3); }}
              className="px-2 py-1 rounded-md text-[9px] font-bold flex items-center gap-1"
              style={{ background: "rgba(37,211,102,0.15)", color: "#25D366" }}>
              <Send className="w-2.5 h-2.5" /> WA
            </a>
          )}
          <button onClick={() => setExpandedId(l.id)}
            className="px-2 py-1 rounded-md text-[9px] font-bold"
            style={{ background: "rgba(167,139,250,0.1)", color: "#c4b5fd" }}>
            Apri
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 space-y-3">
      {overdue.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: "#ef4444" }}>
            <AlertCircle className="w-3 h-3" /> Follow-up scaduti ({overdue.length})
          </p>
          <div className="space-y-2">{overdue.map(l => renderRow(l, true))}</div>
        </div>
      )}
      {todayFollowups.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: "#a78bfa" }}>
            <Calendar className="w-3 h-3" /> In programma oggi ({todayFollowups.length})
          </p>
          <div className="space-y-2">{todayFollowups.map(l => renderRow(l, false))}</div>
        </div>
      )}
      {overdue.length === 0 && todayFollowups.length === 0 && (
        <div className="text-center py-12 rounded-2xl" style={{ background: "rgba(34,197,94,0.04)", border: "1px dashed rgba(34,197,94,0.2)" }}>
          <Award className="w-10 h-10 mx-auto mb-2" style={{ color: "#34d399" }} />
          <p className="text-xs font-bold text-white mb-1">🎉 Tutto in regola!</p>
          <p className="text-[10px]" style={{ color: "#9ca3af" }}>Nessun follow-up scaduto o programmato per oggi</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANALYTICS TAB — 100% real metrics from leads data
   ═══════════════════════════════════════════════════════════════ */
function AnalyticsTab({ metrics, leads }: { metrics: any; leads: PipelineLead[] }) {
  const KPI = ({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color: string }) => (
    <div className="p-3 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3 h-3" style={{ color }} />
        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: `${color}` }}>{label}</p>
      </div>
      <p className="text-lg font-black" style={{ color: "#fff" }}>{value}</p>
      {sub && <p className="text-[9px] mt-0.5" style={{ color: "#9ca3af" }}>{sub}</p>}
    </div>
  );

  return (
    <div className="p-3 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <KPI icon={Briefcase} label="Lead totali" value={metrics.total} sub={`${metrics.contacted} contattati`} color="#a78bfa" />
        <KPI icon={MessageCircle} label="Tasso risposta" value={`${metrics.replyRate}%`} sub={`${metrics.replied} su ${metrics.contacted}`} color="#60a5fa" />
        <KPI icon={Award} label="Conversione" value={`${metrics.conversionRate}%`} sub={`${metrics.won} clienti chiusi`} color="#22c55e" />
        <KPI icon={TrendingUp} label="Pipeline" value={`€${metrics.pipelineValue.toLocaleString("it-IT")}`} sub={`${leads.length - metrics.won - metrics.lost} attivi`} color="#f59e0b" />
        <KPI icon={Star} label="Fatturato chiuso" value={`€${metrics.wonValue.toLocaleString("it-IT")}`} sub={`${metrics.won} vendite`} color="#34d399" />
        <KPI icon={Clock} label="Attività 7gg" value={metrics.activityWeek} sub="interazioni" color="#c4b5fd" />
      </div>

      {/* Stage funnel */}
      <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#9ca3af" }}>Funnel pipeline</p>
        <div className="space-y-1.5">
          {PIPELINE_STAGES.map(s => {
            const count = leads.filter(l => l.status === s.id).length;
            const pct = leads.length > 0 ? (count / leads.length) * 100 : 0;
            return (
              <div key={s.id}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold" style={{ color: s.color }}>{s.emoji} {s.label}</span>
                  <span className="text-[10px] font-bold text-white">{count}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top sector & channel */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl" style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.15)" }}>
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "#c4b5fd" }}>Settore top</p>
          <p className="text-sm font-black text-white capitalize">{metrics.topSector[0]}</p>
          <p className="text-[9px]" style={{ color: "#9ca3af" }}>{metrics.topSector[1]} lead</p>
        </div>
        <div className="p-3 rounded-xl" style={{ background: "rgba(20,184,166,0.05)", border: "1px solid rgba(20,184,166,0.15)" }}>
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "#14b8a6" }}>Canale che converte</p>
          <p className="text-sm font-black text-white capitalize">{metrics.topChannel[0]}</p>
          <p className="text-[9px]" style={{ color: "#9ca3af" }}>{metrics.topChannel[1]} risposte</p>
        </div>
      </div>

      {leads.length === 0 && (
        <div className="text-center py-8 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-[10px]" style={{ color: "#6b7280" }}>Le statistiche compaiono quando inizi a salvare lead nel CRM</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TUTORIAL TAB
   ═══════════════════════════════════════════════════════════════ */
function TutorialTab() {
  const steps = [
    { n: 1, title: "Cerca lead", desc: "Usa Zone, Settore o Manuale dalla pagina principale per trovare attività reali." },
    { n: 2, title: "Salva nel CRM", desc: "Tocca il bottone 💾 sulla card lead per aggiungerlo alla tua pipeline personale." },
    { n: 3, title: "Contatta", desc: "Apri WhatsApp/Email/Telefono — ogni azione viene tracciata automaticamente nello storico." },
    { n: 4, title: "Sposta lo stato", desc: "Quando il lead risponde, prenota una demo, o diventa cliente, sposta la card nello stato corrispondente." },
    { n: 5, title: "Pianifica follow-up", desc: "Imposta una data di richiamo (1, 3, 7, 14 giorni). Le notifiche arrivano nella tab Oggi." },
    { n: 6, title: "Aggiungi note", desc: "Annota dettagli rilevanti: orario migliore per chiamare, nome decision maker, obiezioni emerse." },
    { n: 7, title: "Monitora performance", desc: "Nella tab Stats vedi tasso di risposta, conversione, settori che funzionano, canale migliore — tutto reale." },
  ];

  return (
    <div className="p-3 space-y-3">
      <div className="p-3 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.08), rgba(20,184,166,0.04))", border: "1px solid rgba(167,139,250,0.2)" }}>
        <p className="text-xs font-bold text-white mb-1">🎯 Come usare il CRM Venditore</p>
        <p className="text-[10px]" style={{ color: "#9ca3af" }}>
          Un sistema professionale per tracciare ogni lead dalla scoperta alla chiusura. Tutti i dati sono i tuoi, isolati dal resto del team.
        </p>
      </div>

      <div className="space-y-2">
        {steps.map(s => (
          <div key={s.n} className="p-3 rounded-xl flex gap-2.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-black"
              style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", color: "#c4b5fd" }}>
              {s.n}
            </div>
            <div>
              <p className="text-xs font-bold text-white mb-0.5">{s.title}</p>
              <p className="text-[10px] leading-relaxed" style={{ color: "#9ca3af" }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}>
        <p className="text-[10px] font-bold mb-1" style={{ color: "#34d399" }}>💡 Best practice professionale</p>
        <ul className="space-y-1 text-[10px]" style={{ color: "#e5e7eb" }}>
          <li>• Logga sempre la risposta ricevuta — il sistema impara cosa converte</li>
          <li>• Pianifica un follow-up subito dopo ogni messaggio inviato</li>
          <li>• Aggiorna il valore stimato quando hai più info sul cliente</li>
          <li>• Esporta il CSV ogni settimana per backup e reportistica</li>
        </ul>
      </div>
    </div>
  );
}
