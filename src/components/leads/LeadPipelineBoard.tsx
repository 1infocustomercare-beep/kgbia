import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingUp, Target, DollarSign, GripVertical, Phone, Mail, Calendar, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { MockLead, SECTOR_OPTIONS } from "@/data/mock-leads-data";

type PipelineStatus = "new" | "contacted" | "interested" | "demo" | "proposal" | "won" | "lost";

interface PipelineLead extends MockLead {
  pipelineStatus: PipelineStatus;
  lastContact: string;
  nextAction: string;
  notes: string;
}

const COLUMNS: { id: PipelineStatus; label: string; color: string }[] = [
  { id: "new", label: "Nuovo", color: "#3b82f6" },
  { id: "contacted", label: "Contattato", color: "#f59e0b" },
  { id: "interested", label: "Interessato", color: "#8b5cf6" },
  { id: "demo", label: "Demo", color: "#06b6d4" },
  { id: "proposal", label: "Proposta", color: "#ec4899" },
  { id: "won", label: "Chiuso ✓", color: "#10b981" },
  { id: "lost", label: "Perso", color: "#6b7280" },
];

interface Props {
  savedLeads: MockLead[];
}

export default function LeadPipelineBoard({ savedLeads }: Props) {
  const [leads, setLeads] = useState<PipelineLead[]>(
    savedLeads.map(l => ({
      ...l,
      pipelineStatus: "new",
      lastContact: "-",
      nextAction: "Primo contatto",
      notes: "",
    }))
  );
  const [activeCol, setActiveCol] = useState(0);

  const moveLead = (leadId: string, newStatus: PipelineStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, pipelineStatus: newStatus, lastContact: new Date().toLocaleDateString("it-IT") } : l));
  };

  const getLeadsForColumn = (status: PipelineStatus) => leads.filter(l => l.pipelineStatus === status);
  const totalValue = leads.filter(l => l.pipelineStatus === "won").length * 997;
  const convRate = leads.length > 0 ? Math.round((leads.filter(l => l.pipelineStatus === "won").length / leads.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: Users, label: "Totale", value: leads.length, color: "#3b82f6" },
          { icon: Target, label: "Caldi", value: leads.filter(l => ["interested", "demo", "proposal"].includes(l.pipelineStatus)).length, color: "#f59e0b" },
          { icon: TrendingUp, label: "Conversione", value: `${convRate}%`, color: "#10b981" },
          { icon: DollarSign, label: "Pipeline", value: `€${totalValue.toLocaleString()}`, color: "#a78bfa" },
        ].map((kpi, i) => (
          <div key={i} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <kpi.icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: kpi.color }} />
            <p className="text-sm font-bold text-white">{kpi.value}</p>
            <p className="text-[8px] uppercase tracking-wider" style={{ color: "#6b7280" }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Mobile: column selector */}
      <div className="sm:hidden flex items-center justify-between">
        <button onClick={() => setActiveCol(Math.max(0, activeCol - 1))} disabled={activeCol === 0} className="p-1 disabled:opacity-30">
          <ChevronLeft className="w-5 h-5 text-white/60" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLUMNS[activeCol].color }} />
          <span className="text-xs font-bold text-white">{COLUMNS[activeCol].label}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)", color: "#9ca3af" }}>
            {getLeadsForColumn(COLUMNS[activeCol].id).length}
          </span>
        </div>
        <button onClick={() => setActiveCol(Math.min(COLUMNS.length - 1, activeCol + 1))} disabled={activeCol === COLUMNS.length - 1} className="p-1 disabled:opacity-30">
          <ChevronRight className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Board */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none">
        {COLUMNS.map((col, ci) => (
          <div key={col.id} className={`flex-shrink-0 w-[260px] sm:w-auto sm:flex-1 ${ci !== activeCol ? "hidden sm:block" : ""}`}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white">{col.label}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full ml-auto" style={{ background: "rgba(255,255,255,0.06)", color: "#6b7280" }}>
                {getLeadsForColumn(col.id).length}
              </span>
            </div>
            <div className="space-y-2 min-h-[120px] p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.06)" }}>
              <AnimatePresence>
                {getLeadsForColumn(col.id).map(lead => {
                  const sectorLabel = SECTOR_OPTIONS.find(s => s.value === lead.sector)?.label || "";
                  return (
                    <motion.div key={lead.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="p-3 rounded-lg cursor-pointer group" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white truncate flex-1">{lead.businessName}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${col.color}15`, color: col.color }}>{lead.opportunityScore}</span>
                      </div>
                      <p className="text-[9px] mt-0.5" style={{ color: "#6b7280" }}>{sectorLabel} · {lead.city}</p>
                      {/* Move buttons */}
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {COLUMNS.filter(c => c.id !== col.id).slice(0, 3).map(target => (
                          <button key={target.id} onClick={() => moveLead(lead.id, target.id)}
                            className="text-[8px] px-2 py-1 rounded font-semibold transition-colors"
                            style={{ background: `${target.color}12`, color: target.color, border: `1px solid ${target.color}25` }}>
                            → {target.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {getLeadsForColumn(col.id).length === 0 && (
                <p className="text-[10px] text-center py-8" style={{ color: "#4b5563" }}>Nessun lead</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
