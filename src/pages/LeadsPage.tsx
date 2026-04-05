import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Target, BarChart3, Kanban, List } from "lucide-react";
import LeadSearchPanel from "@/components/leads/LeadSearchPanel";
import LeadResultCard from "@/components/leads/LeadResultCard";
import LeadAnalysisPanel from "@/components/leads/LeadAnalysisPanel";
import LeadMessageGenerator from "@/components/leads/LeadMessageGenerator";
import LeadPipelineBoard from "@/components/leads/LeadPipelineBoard";
import { generateMockLeads, MockLead, SECTOR_OPTIONS } from "@/data/mock-leads-data";
import { toast } from "sonner";

type Tab = "search" | "pipeline";

export default function LeadsPage() {
  const [tab, setTab] = useState<Tab>("search");
  const [results, setResults] = useState<MockLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "rating" | "name">("score");
  const [analyzeLead, setAnalyzeLead] = useState<MockLead | null>(null);
  const [messageLead, setMessageLead] = useState<MockLead | null>(null);
  const [savedLeads, setSavedLeads] = useState<MockLead[]>([]);
  const [lastSearch, setLastSearch] = useState<{ sector: string; city: string } | null>(null);

  const handleSearch = (filters: { sector: string; city: string; minRating: number; minReviews: number }) => {
    setLoading(true);
    setLastSearch({ sector: filters.sector, city: filters.city });
    // Simulate API delay
    setTimeout(() => {
      let leads = generateMockLeads(filters.sector, filters.city, 18 + Math.floor(Math.random() * 8));
      if (filters.minRating > 0) leads = leads.filter(l => l.googleRating >= filters.minRating);
      if (filters.minReviews > 0) leads = leads.filter(l => l.reviewCount >= filters.minReviews);
      setResults(leads);
      setLoading(false);
      toast.success(`${leads.length} lead trovati a ${filters.city}!`);
    }, 1200 + Math.random() * 800);
  };

  const handleSaveLead = (lead: MockLead) => {
    if (savedLeads.find(l => l.id === lead.id)) {
      toast.info("Lead già salvato nel CRM");
      return;
    }
    setSavedLeads(prev => [...prev, lead]);
    toast.success(`${lead.businessName} salvato nel CRM!`);
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "score") return b.opportunityScore - a.opportunityScore;
    if (sortBy === "rating") return b.googleRating - a.googleRating;
    return a.businessName.localeCompare(b.businessName);
  });

  const sectorLabel = lastSearch ? SECTOR_OPTIONS.find(s => s.value === lastSearch.sector)?.label : "";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5" style={{ color: "#10b981" }} /> LeadEngine Scout
          </h1>
          <p className="text-[11px] mt-0.5" style={{ color: "#6b7280" }}>Trova, analizza e converti lead in clienti</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([
          { id: "search" as Tab, icon: Search, label: "Ricerca", count: results.length },
          { id: "pipeline" as Tab, icon: Kanban, label: "Pipeline CRM", count: savedLeads.length },
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

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white">{results.length} risultati — {sectorLabel} a {lastSearch?.city}</p>
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
                    onAnalyze={setAnalyzeLead} onMessage={setMessageLead} onSave={handleSaveLead} />
                ))}
              </div>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20 text-white" />
              <p className="text-sm font-medium text-white/60">Seleziona settore e città per iniziare la ricerca</p>
              <p className="text-xs mt-1 text-white/30">I risultati includeranno score di opportunità e analisi AI</p>
            </div>
          )}
        </>
      )}

      {tab === "pipeline" && (
        <LeadPipelineBoard savedLeads={savedLeads} />
      )}

      {/* Panels */}
      <AnimatePresence>
        {analyzeLead && !messageLead && (
          <LeadAnalysisPanel lead={analyzeLead} onClose={() => setAnalyzeLead(null)} onMessage={(l) => { setAnalyzeLead(null); setMessageLead(l); }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {messageLead && (
          <LeadMessageGenerator lead={messageLead} onClose={() => setMessageLead(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
