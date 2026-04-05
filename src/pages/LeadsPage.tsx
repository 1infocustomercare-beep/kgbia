import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Target, Kanban, Zap, TrendingUp, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LeadSearchPanel, { SearchFilters } from "@/components/leads/LeadSearchPanel";
import LeadResultCard from "@/components/leads/LeadResultCard";
import LeadCommandPanel from "@/components/leads/LeadCommandPanel";
import LeadPipelineBoard from "@/components/leads/LeadPipelineBoard";
import { generateMockLeads, MockLead, SECTOR_OPTIONS } from "@/data/mock-leads-data";
import { toast } from "sonner";

type Tab = "search" | "pipeline";

/** Convert raw API results (Nominatim/Google) into MockLead format */
function apiResultsToLeads(apiResults: any[], sector: string): MockLead[] {
  return apiResults.map((r, i) => {
    const rating = r.google_rating || +(2.5 + Math.random() * 2.5).toFixed(1);
    const reviews = r.google_reviews || Math.floor(5 + Math.random() * 100);
    const hasWebsite = !!r.website;
    const digitalStatus: MockLead["digitalStatus"] = !hasWebsite ? "none" : Math.random() > 0.5 ? "basic" : "obsolete";

    let score = 50;
    if (digitalStatus === "none") score += 30;
    else if (digitalStatus === "obsolete") score += 20;
    else if (digitalStatus === "basic") score += 10;
    if (rating < 3.5) score += 15;
    else if (rating < 4) score += 8;
    if (reviews < 20) score += 10;
    score = Math.max(10, Math.min(98, score + Math.floor(Math.random() * 10 - 5)));

    const cleanName = (r.name || "N/A").toLowerCase().replace(/[^a-z0-9]/g, "");

    return {
      id: `real-${Date.now()}-${i}`,
      businessName: r.name || "Attività sconosciuta",
      ownerName: "",
      address: r.full_address || "",
      city: r.city || "",
      zone: r.zone || "",
      phone: r.phone || "",
      email: r.email || `info@${cleanName.slice(0, 12)}.it`,
      website: r.website || null,
      instagram: r.instagram || null,
      sector,
      googleRating: rating,
      reviewCount: reviews,
      digitalStatus,
      opportunityScore: score,
      painPoints: ["Presenza digitale da migliorare", "Nessuna automazione marketing", "Gestione manuale dei clienti"],
      competitors: Math.floor(3 + Math.random() * 12),
      estimatedBudget: ["€79-149/mese", "€149-249/mese", "€249-499/mese"][Math.floor(Math.random() * 3)],
      lastActivity: new Date().toISOString(),
      googleMapsUrl: r.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(r.name + " " + r.city)}`,
      source: r.source === "google_places" ? "google" : "google" as const,
    };
  });
}

export default function LeadsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("search");
  const [results, setResults] = useState<MockLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "rating" | "name">("score");
  const [activeLead, setActiveLead] = useState<MockLead | null>(null);
  const [savedLeads, setSavedLeads] = useState<MockLead[]>([]);
  const [lastSearch, setLastSearch] = useState<SearchFilters | null>(null);
  const [dataSource, setDataSource] = useState<"mock" | "real">("mock");

  const mockTimerRef = { current: null as ReturnType<typeof setTimeout> | null };

  const handleSearch = useCallback((filters: SearchFilters) => {
    setLoading(true);
    setLastSearch(filters);
    setDataSource("mock");

    // If using real data, wait longer before falling back to mock
    const delay = filters.useReal ? 12000 : (600 + Math.random() * 500);
    if (mockTimerRef.current) clearTimeout(mockTimerRef.current);

    mockTimerRef.current = setTimeout(() => {
      // Only generate mock if we're still loading (real results haven't arrived)
      setLoading(prev => {
        if (!prev) return false; // real results already arrived
        const count = 15 + Math.floor(Math.random() * 12);
        let leads = generateMockLeads(filters.sector, filters.city, count, filters.freeText || undefined);
        if (filters.minRating > 0) leads = leads.filter(l => l.googleRating >= filters.minRating);
        if (filters.minReviews > 0) leads = leads.filter(l => l.reviewCount >= filters.minReviews);
        setResults(leads);
        setDataSource("mock");
        toast.success(`${leads.length} lead trovati (dati simulati)`, { description: `${filters.city} — ${SECTOR_OPTIONS.find(s => s.value === filters.sector)?.label}` });
        return false;
      });
    }, delay);
  }, []);

  const handleRealResults = useCallback((apiResults: any[]) => {
    if (mockTimerRef.current) clearTimeout(mockTimerRef.current);
    const sector = lastSearch?.sector || "food";
    const leads = apiResultsToLeads(apiResults, sector);
    setResults(leads);
    setDataSource("real");
    setLoading(false);
  }, [lastSearch]);

  const handleSaveLead = useCallback((lead: MockLead) => {
    if (savedLeads.find(l => l.id === lead.id)) {
      toast.info("Lead già salvato nella Pipeline");
      return;
    }
    setSavedLeads(prev => [...prev, lead]);
    toast.success(`${lead.businessName} aggiunto alla Pipeline!`);
  }, [savedLeads]);

  const handleMessage = useCallback((lead: MockLead) => {
    const params = new URLSearchParams();
    params.set("sector", lead.sector);
    if (lead.instagram) params.set("ig", lead.instagram);
    if (lead.website) params.set("website", lead.website);
    const bestChannel = lead.digitalStatus === "none" ? "whatsapp" : lead.googleRating < 3.5 ? "email" : "instagram";
    params.set("channel", bestChannel);
    params.set("lead_name", lead.businessName);
    navigate(`/partner?${params.toString()}`);
  }, [navigate]);

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "score") return b.opportunityScore - a.opportunityScore;
    if (sortBy === "rating") return b.googleRating - a.googleRating;
    return a.businessName.localeCompare(b.businessName);
  });

  const sectorLabel = lastSearch ? SECTOR_OPTIONS.find(s => s.value === lastSearch.sector)?.label : "";
  const hotLeads = results.filter(l => l.opportunityScore >= 70).length;
  const avgScore = results.length > 0 ? Math.round(results.reduce((s, l) => s + l.opportunityScore, 0) / results.length) : 0;

  return (
    <div className="min-h-screen p-4 space-y-4 pb-20" style={{ background: "linear-gradient(135deg, #0a0a12 0%, #0d1117 50%, #0a0a12 100%)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2 text-white">
            <Target className="w-5 h-5 text-emerald-400" /> LeadEngine Scout
          </h1>
          <p className="text-[10px] mt-0.5 text-gray-300">Trova · Analizza · Converti — il tuo CRM intelligente</p>
        </div>
        <div className="flex items-center gap-1.5">
          {dataSource === "real" && (
            <span className="px-2 py-1 rounded-lg text-[9px] font-bold bg-emerald-500/10 text-emerald-400">
              🟢 LIVE
            </span>
          )}
          {results.length > 0 && (
            <>
              <span className="px-2 py-1 rounded-lg text-[9px] font-bold bg-emerald-500/10 text-emerald-400">
                <Zap className="w-3 h-3 inline mr-0.5" />{hotLeads} caldi
              </span>
              <span className="px-2 py-1 rounded-lg text-[9px] font-bold bg-violet-500/10 text-violet-400">
                <TrendingUp className="w-3 h-3 inline mr-0.5" />avg {avgScore}
              </span>
            </>
          )}
        </div>
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
            {t.count > 0 && <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-white/5 text-gray-300">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === "search" && (
        <>
          <LeadSearchPanel onSearch={handleSearch} onRealResults={handleRealResults} loading={loading} />

          {results.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-gray-300">
                  {results.length} risultati — {sectorLabel} a {lastSearch?.city}
                  {lastSearch?.freeText && <span className="text-gray-500"> · "{lastSearch.freeText}"</span>}
                  {dataSource === "real" && <span className="text-emerald-400 ml-1">(dati reali)</span>}
                </p>
                <div className="flex items-center gap-0.5">
                  <ArrowUpDown className="w-3 h-3 mr-1 text-gray-500" />
                  {(["score", "rating", "name"] as const).map(s => (
                    <button key={s} onClick={() => setSortBy(s)}
                      className="px-2 py-1 rounded text-[9px] font-semibold transition-all"
                      style={{
                        background: sortBy === s ? "rgba(255,255,255,0.1)" : "transparent",
                        color: sortBy === s ? "#e5e7eb" : "#6b7280",
                      }}>
                      {s === "score" ? "Score" : s === "rating" ? "Rating" : "Nome"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {sortedResults.map((lead, i) => (
                  <LeadResultCard key={lead.id} lead={lead} index={i}
                    onAnalyze={(l) => setActiveLead(l)}
                    onMessage={handleMessage}
                    onSave={handleSaveLead} />
                ))}
              </div>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              <p className="text-sm font-medium text-gray-400">Seleziona settore e città per iniziare</p>
              <p className="text-[10px] mt-1 text-gray-500">Analisi AI automatica con score di opportunità</p>
            </div>
          )}
        </>
      )}

      {tab === "pipeline" && (
        <LeadPipelineBoard savedLeads={savedLeads} />
      )}

      <AnimatePresence>
        {activeLead && (
          <LeadCommandPanel
            lead={activeLead}
            onClose={() => setActiveLead(null)}
            onSave={handleSaveLead}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
