import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Target, Kanban, Zap } from "lucide-react";
import LeadSearchPanel from "@/components/leads/LeadSearchPanel";
import LeadResultCard from "@/components/leads/LeadResultCard";
import LeadCommandPanel from "@/components/leads/LeadCommandPanel";
import LeadPipelineBoard from "@/components/leads/LeadPipelineBoard";
import { generateMockLeads, MockLead, SECTOR_OPTIONS } from "@/data/mock-leads-data";
import { toast } from "sonner";

type Tab = "search" | "pipeline";

export default function LeadsPage() {
  const [tab, setTab] = useState<Tab>("search");
  const [results, setResults] = useState<MockLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "rating" | "name">("score");
  const [activeLead, setActiveLead] = useState<{ lead: MockLead; tab: "analyze" | "message" } | null>(null);
  const [savedLeads, setSavedLeads] = useState<MockLead[]>([]);
  const [lastSearch, setLastSearch] = useState<{ sector: string; city: string } | null>(null);

  const handleSearch = useCallback((filters: { sector: string; city: string; minRating: number; minReviews: number }) => {
    setLoading(true);
    setLastSearch({ sector: filters.sector, city: filters.city });
    setTimeout(() => {
      let leads = generateMockLeads(filters.sector, filters.city, 18 + Math.floor(Math.random() * 8));
      if (filters.minRating > 0) leads = leads.filter(l => l.googleRating >= filters.minRating);
      if (filters.minReviews > 0) leads = leads.filter(l => l.reviewCount >= filters.minReviews);
      setResults(leads);
      setLoading(false);
      toast.success(`${leads.length} lead trovati a ${filters.city}!`);
    }, 900 + Math.random() * 600);
  }, []);

  const handleSaveLead = useCallback((lead: MockLead) => {
    if (savedLeads.find(l => l.id === lead.id)) {
      toast.info("Lead già salvato nel CRM");
      return;
    }
    setSavedLeads(prev => [...prev, lead]);
    toast.success(`${lead.businessName} salvato nel CRM!`);
  }, [savedLeads]);

  const openLead = useCallback((lead: MockLead, initialTab: "analyze" | "message") => {
    setActiveLead({ lead, tab: initialTab });
  }, []);

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "score") return b.opportunityScore - a.opportunityScore;
    if (sortBy === "rating") return b.googleRating - a.googleRating;
    return a.businessName.localeCompare(b.businessName);
  });

  const sectorLabel = lastSearch ? SECTOR_OPTIONS.find(s => s.value === lastSearch.sector)?.label : "";
  const hotLeads = results.filter(l => l.opportunityScore >= 70).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5" style={{ color: "#10b981" }} /> LeadEngine Scout
          </h1>
          <p className="text-[10px] mt-0.5" style={{ color: "#6b7280" }}>Trova · Analizza · Converti</p>
        </div>
        {results.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-1 rounded-lg text-[9px] font-bold" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
              <Zap className="w-3 h-3 inline mr-0.5" />{hotLeads} caldi
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([
          { id: "search" as Tab, icon: Search, label: "Ricerca", count: results.length },
          { id: "pipeline" as Tab, icon: Kanban, label: "Pipeline", count: savedLeads.length },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: tab === t.id ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${tab === t.id ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)"}`,
              color: tab === t.id ? "#10b981" : "#9ca3af",
            }}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
            {t.count > 0 && <span className="px-1.5 py-0.5 rounded-full text-[9px]" style={{ background: "rgba(255,255,255,0.08)" }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === "search" && (
        <>
          <LeadSearchPanel onSearch={handleSearch} loading={loading} />

          {results.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-white">{results.length} risultati — {sectorLabel} a {lastSearch?.city}</p>
                <div className="flex gap-1">
                  {(["score", "rating", "name"] as const).map(s => (
                    <button key={s} onClick={() => setSortBy(s)}
                      className="px-2 py-1 rounded text-[9px] font-semibold"
                      style={{
                        background: sortBy === s ? "rgba(255,255,255,0.08)" : "transparent",
                        color: sortBy === s ? "#fff" : "#6b7280",
                      }}>
                      {s === "score" ? "Score" : s === "rating" ? "Rating" : "Nome"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {sortedResults.map((lead, i) => (
                  <LeadResultCard key={lead.id} lead={lead} index={i}
                    onAnalyze={(l) => openLead(l, "analyze")}
                    onMessage={(l) => openLead(l, "message")}
                    onSave={handleSaveLead} />
                ))}
              </div>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-20 text-white" />
              <p className="text-sm font-medium text-white/50">Seleziona settore e città per iniziare</p>
              <p className="text-[10px] mt-1 text-white/25">Score di opportunità + analisi AI automatica</p>
            </div>
          )}
        </>
      )}

      {tab === "pipeline" && (
        <LeadPipelineBoard savedLeads={savedLeads} />
      )}

      {/* Unified Command Panel */}
      <AnimatePresence>
        {activeLead && (
          <LeadCommandPanel
            lead={activeLead.lead}
            initialTab={activeLead.tab}
            onClose={() => setActiveLead(null)}
            onSave={handleSaveLead}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
