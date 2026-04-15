import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Target, MapPin, Filter, ChevronDown, Loader2, Phone, Globe, Mail,
  Instagram, Star, ExternalLink, MessageCircle, Copy, Sparkles, Send, RefreshCw,
  Wand2, Building2, Eye, Map, Zap, ArrowUpDown, X as XIcon, UserPlus, Link2,
  CheckCircle, TrendingUp, AlertTriangle, Crown, Plus, Layers, Facebook
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SECTOR_OPTIONS } from "@/data/mock-leads-data";
import { INDUSTRY_CONFIGS } from "@/config/industry-config";
import { SECTOR_PORTFOLIO } from "@/data/sector-mockup-images";
import { DEMO_SLUGS } from "@/data/demo-industries";

/* ─── Types ─── */
interface Lead {
  name: string;
  full_address: string;
  city: string;
  zone: string;
  phone: string | null;
  website: string | null;
  email: string | null;
  instagram: string | null;
  facebook?: string | null;
  google_rating: number;
  google_reviews: number;
  google_maps_url: string | null;
  search_google?: string | null;
  search_instagram?: string | null;
  search_facebook?: string | null;
  source: string;
  osm_type?: string;
  types?: string[];
  lat?: number;
  lon?: number;
  isManual?: boolean;
  opening_hours?: string | null;
  cuisine?: string | null;
}

/* ─── Helpers ─── */
const getDemoSiteUrl = (sectorId: string) => {
  if (sectorId === "food") return "/r/impero-roma";
  if (sectorId === "ncc") return "/b/amalfi-luxury-transfer";
  const slug = DEMO_SLUGS[sectorId as keyof typeof DEMO_SLUGS] || sectorId;
  return `/demo/${slug}`;
};

const PORTFOLIO_REFS: Record<string, string> = {
  food: "COTE Miami", beauty: "Neo Nails Brickell", ncc: "Amalfi Luxury Transfer",
  fitness: "City Padel Milano", healthcare: "FAR Medical", veterinary: "Aloha Pet Resort",
  hotel: "MMI Resident Hub", tattoo: "Ink Masters Studio", beach: "Miami Watersports",
  retail: "Store Premium", plumber: "Nick's Plumbing", electrician: "Elite Electrical",
  photography: "Vision Photography", events: "Elite Events", construction: "Premium Costruzioni",
  gardening: "Verde & Giardini", agriturismo: "Tuscan Country Estate", cleaning: "Premium Clean",
  legal: "Studio Legale", accounting: "Studio Commercialista Pro", garage: "Speed Auto Service",
};

const detectSector = (lead: Lead, fallback: string): string => {
  const text = [lead.name, lead.osm_type, lead.full_address, ...(lead.types || [])].join(" ").toLowerCase();
  const sectorMap: [string, RegExp][] = [
    ["food", /ristoran|pizz|bar[\s,]|caffè|café|trattori|osteria|pub|bistrot|sushi|bakery|pasticc|gelat|fast.?food|tavola|gastr|enoteca|hamburger/],
    ["beauty", /parrucch|salon[ei]|barbi|estet|spa|nail|manicur|trucco|makeup|bellezz|hair|beauty|capelli|acconc/],
    ["ncc", /ncc|taxi|transfer|limo|chauffeur|noleggio|car.?rental|auto.?con.?autista/],
    ["healthcare", /dent|medic|clinic|doctor|hospital|farmac|fisio|osteopat|psicol|ambulat|poliamb|oculist/],
    ["retail", /negoz|shop|boutique|abbigliamento|scarpe|gioiell|profum|supermarket|minimarket|ottica/],
    ["fitness", /palestr|gym|crossfit|yoga|pilates|fitness|sport|palestra|piscina|tennis|padel/],
    ["hospitality", /hotel|albergo|b.?&.?b|hostel|motel|resort|pensione|guest.?house|bed.?and/],
    ["beach", /lido|stabiliment|balne|beach|spiaggia/],
    ["plumber", /idraul|plumb|tubaz|termoidr/],
    ["electrician", /elettric|electric|impiant|fotovolt/],
    ["veterinary", /veterinar|animali|pet|toelet/],
    ["tattoo", /tattoo|tatuag|piercing|ink/],
    ["photography", /fotograf|photo|video|wedding.?photo/],
    ["events", /event|catering|wedding|cerimoni|feste|location/],
    ["construction", /edil|costruzi|ristruttur|murator/],
    ["gardening", /giardini|vivaio|garden|paesagg|verde/],
    ["legal", /avvocat|legal|notai|tribunale/],
    ["accounting", /commercial|contabil|fiscale|caf|tributar/],
    ["agriturismo", /agriturism|fattoria|cantina|masseria/],
  ];
  for (const [s, regex] of sectorMap) if (regex.test(text)) return s;
  return fallback;
};

const computeScore = (lead: Lead): number => {
  let score = 50;
  if (!lead.website) score += 25;
  if (!lead.instagram) score += 10;
  if (lead.google_rating > 0 && lead.google_rating < 3.5) score += 15;
  else if (lead.google_rating >= 4.5) score -= 10;
  if (!lead.phone) score += 5;
  if (lead.opening_hours) score -= 3; // well-organized = harder to sell
  return Math.max(15, Math.min(98, score + Math.floor(Math.random() * 6 - 3)));
};

const getPreviewScreens = (sectorId: string) => {
  const portfolio = SECTOR_PORTFOLIO.find(sp => sp.sectorId === sectorId);
  const brand = portfolio?.brands?.[0];
  const style = brand?.styles?.[0];
  return style?.screens?.slice(0, 4) || [];
};

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  google_places: { label: "Google", color: "#4285F4" },
  nominatim: { label: "OSM", color: "#7EBC6F" },
  photon: { label: "Photon", color: "#F59E0B" },
  overpass: { label: "Overpass", color: "#06B6D4" },
  instagram: { label: "Instagram", color: "#E4405F" },
  manual: { label: "Manuale", color: "#A78BFA" },
};

/* ─── COMPONENT ─── */
export default function LeadsPage() {
  // Search
  const [city, setCity] = useState("");
  const [sector, setSector] = useState("food");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [deepLoading, setDeepLoading] = useState(false);
  const [results, setResults] = useState<(Lead & { _score: number; _sector: string })[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<"score" | "rating" | "name">("score");
  const [searchPage, setSearchPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [lastSearchCity, setLastSearchCity] = useState("");
  const [lastSearchSector, setLastSearchSector] = useState("");

  // Pipeline
  const [selected, setSelected] = useState<(Lead & { _score: number; _sector: string }) | null>(null);
  const [activeChannel, setActiveChannel] = useState<"whatsapp" | "instagram" | "email">("whatsapp");
  const [generatingMsg, setGeneratingMsg] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [enrichingIg, setEnrichingIg] = useState(false);
  const [enrichedData, setEnrichedData] = useState<{ instagram?: string; email?: string; phone?: string; facebook?: string; source?: string } | null>(null);

  // Manual lead input
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [manualWebsite, setManualWebsite] = useState("");
  const [manualIg, setManualIg] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualSector, setManualSector] = useState("food");

  /* ─── Process results from API ─── */
  const processResults = useCallback((apiResults: any[], append: boolean) => {
    const mapped = apiResults.map((r: any) => {
      const lead: Lead = {
        name: r.name, full_address: r.full_address || "", city: r.city || city,
        zone: r.zone || "", phone: r.phone || null, website: r.website || null,
        email: r.email || null, instagram: r.instagram || null, facebook: r.facebook || null,
        google_rating: r.google_rating || 0, google_reviews: r.google_reviews || 0,
        google_maps_url: r.google_maps_url || null, source: r.source || "openstreetmap",
        osm_type: r.osm_type, types: r.types, lat: r.lat, lon: r.lon,
        opening_hours: r.opening_hours || null, cuisine: r.cuisine || null,
        search_google: r.search_google, search_instagram: r.search_instagram, search_facebook: r.search_facebook,
      };
      const detSector = detectSector(lead, sector);
      return { ...lead, _score: computeScore(lead), _sector: detSector };
    });

    const filtered = minRating > 0 ? mapped.filter(r => (r.google_rating || 0) >= minRating) : mapped;

    if (append) {
      setResults(prev => {
        const existingNames = new Set(prev.map(p => p.name.toLowerCase()));
        const newOnly = filtered.filter(r => !existingNames.has(r.name.toLowerCase()));
        return [...prev, ...newOnly];
      });
    } else {
      setResults(filtered);
    }
    return filtered;
  }, [city, sector, minRating]);

  /* ─── Batch enrich Instagram for leads without IG ─── */
  const batchEnrichInstagram = useCallback(async (leads: (Lead & { _score: number; _sector: string })[]) => {
    const needsIg = leads.filter(l => !l.instagram && l.name).slice(0, 15);
    if (needsIg.length === 0) return;

    try {
      const { data, error } = await supabase.functions.invoke("enrich-lead-social", {
        body: {
          batch: true,
          businesses: needsIg.map(l => ({ name: l.name, city: l.city || city, sector: l._sector })),
        },
      });
      if (!error && data?.success && data.results) {
        const igResults = data.results as Record<string, { instagram: string; profile?: any; source: string }>;
        setResults(prev => prev.map(r => {
          const match = igResults[r.name];
          if (match?.instagram) {
            return {
              ...r,
              instagram: match.instagram,
              email: match.profile?.email_from_bio || r.email,
              phone: match.profile?.phone_from_bio || r.phone,
            };
          }
          return r;
        }));
        const found = Object.keys(igResults).length;
        if (found > 0) {
          toast.success(`📸 ${found} profili Instagram trovati automaticamente`, {
            description: "Dati social arricchiti via AI + scraping",
          });
        }
      }
    } catch (e) {
      console.log("Batch IG enrich failed:", e);
    }
  }, [city]);

  /* ─── Search ─── */
  const handleSearch = useCallback(async (page = 0, append = false) => {
    if (!city.trim() && !query.trim()) {
      toast.error("Inserisci una città o parola chiave");
      return;
    }
    if (append) setDeepLoading(true);
    else { setLoading(true); setResults([]); setSelected(null); setGeneratedMessage(null); }

    try {
      const existingNames = append ? results.map(r => r.name) : [];
      const { data, error } = await supabase.functions.invoke("lead-search", {
        body: {
          query: query.trim(), city: city.trim(), sector,
          mode: "zone", use_google: true, page,
          existing_names: existingNames,
        },
      });
      if (error) throw error;
      if (data?.success && data.results?.length > 0) {
        const processed = processResults(data.results, append);
        setSearchPage(page);
        setHasMore(data.has_more ?? false);
        setLastSearchCity(city.trim());
        setLastSearchSector(sector);
        const sources = data.sources || {};
        toast.success(`${append ? "+" : ""}${processed.length} lead reali trovati`, {
          description: `OSM: ${sources.nominatim || 0} · Overpass: ${sources.overpass || 0} · Photon: ${sources.photon || 0} · Google: ${sources.google || 0}`,
        });
        // Auto-batch enrich Instagram in background
        setTimeout(() => batchEnrichInstagram(processed), 1500);
      } else if (!append) {
        toast.error("Nessun risultato — prova un'altra città o settore");
      } else {
        setHasMore(false);
        toast.info("Nessun nuovo lead trovato in questa zona — prova ad espandere la ricerca");
      }
    } catch (e: any) {
      toast.error(e.message || "Errore ricerca");
    } finally {
      setLoading(false);
      setDeepLoading(false);
    }
  }, [city, query, sector, minRating, results, processResults, batchEnrichInstagram]);

  /* ─── Deep search ─── */
  const handleDeepSearch = useCallback(() => {
    handleSearch(searchPage + 1, true);
  }, [handleSearch, searchPage]);

  /* ─── Add manual lead ─── */
  const addManualLead = () => {
    if (!manualName.trim()) { toast.error("Nome attività obbligatorio"); return; }
    const lead: Lead & { _score: number; _sector: string } = {
      name: manualName.trim(), full_address: "", city: manualCity.trim() || "N/A",
      zone: "", phone: manualPhone.trim() || null, website: manualWebsite.trim() || null,
      email: null, instagram: manualIg.trim() || null, google_rating: 0, google_reviews: 0,
      google_maps_url: null, source: "manual", isManual: true,
      _score: computeScore({ name: manualName, full_address: "", city: manualCity, zone: "", phone: manualPhone || null, website: manualWebsite || null, email: null, instagram: manualIg || null, google_rating: 0, google_reviews: 0, google_maps_url: null, source: "manual" }),
      _sector: manualSector,
    };
    setResults(prev => [lead, ...prev]);
    setManualName(""); setManualCity(""); setManualWebsite(""); setManualIg(""); setManualPhone("");
    setShowManual(false);
    toast.success(`${lead.name} aggiunto manualmente`);
  };

  /* ─── Enrich lead social data ─── */
  const enrichLeadSocial = useCallback(async (lead: Lead & { _score: number; _sector: string }) => {
    if (lead.instagram) {
      setEnrichedData({ instagram: lead.instagram, source: "existing" });
      return lead.instagram;
    }
    setEnrichingIg(true);
    setEnrichedData(null);
    try {
      const { data, error } = await supabase.functions.invoke("enrich-lead-social", {
        body: { website: lead.website || "", name: lead.name, city: lead.city },
      });
      if (!error && data?.success) {
        const enriched: any = {};
        if (data.instagram) enriched.instagram = data.instagram;
        if (data.email && !lead.email) enriched.email = data.email;
        if (data.phone && !lead.phone) enriched.phone = data.phone;
        if (data.facebook && !lead.facebook) enriched.facebook = data.facebook;
        enriched.source = data.source || "enriched";
        setEnrichedData(enriched);
        // Update the lead in results
        if (data.instagram || data.email || data.phone) {
          setResults(prev => prev.map(r => 
            r.name === lead.name && r.full_address === lead.full_address
              ? { ...r, instagram: data.instagram || r.instagram, email: data.email || r.email, phone: data.phone || r.phone, facebook: data.facebook || r.facebook }
              : r
          ));
          if (data.instagram) {
            lead.instagram = data.instagram;
            toast.success(`📸 Instagram trovato: @${data.instagram}`, { description: `Fonte: ${data.source === "website_scrape" ? "Sito web" : "AI"}` });
          }
        }
        return data.instagram || null;
      }
    } catch (e) {
      console.log("Enrich failed:", e);
    } finally {
      setEnrichingIg(false);
    }
    return null;
  }, []);

  /* ─── Select + auto-generate ─── */
  const handleSelect = useCallback(async (lead: Lead & { _score: number; _sector: string }, channelOverride?: string) => {
    setSelected(lead);
    setShowPreview(true);
    const channel = channelOverride || activeChannel;
    setGeneratingMsg(true);
    setGeneratedMessage(null);

    // Enrich social data in parallel with message generation
    const enrichPromise = enrichLeadSocial(lead);

    try {
      const sectorLabel = INDUSTRY_CONFIGS[lead._sector as keyof typeof INDUSTRY_CONFIGS]?.label || lead._sector;
      const demoLink = `${window.location.origin}${getDemoSiteUrl(lead._sector)}`;
      const portfolioRef = PORTFOLIO_REFS[lead._sector] || "il nostro portfolio";
      
      // Wait for enrichment to get IG handle
      const igHandle = await enrichPromise;
      const ig = igHandle || lead.instagram?.replace("@", "") || "";

      const { data, error } = await supabase.functions.invoke("scan-prospect", {
        body: {
          instagram: ig, website: lead.website || "", sector: sectorLabel,
          channel, demoLink, allDemosLink: `${window.location.origin}/demo`,
          contactInfo: "📩 info@empireaigroup.com", leadName: lead.name,
          leadCity: lead.city, leadPhone: lead.phone, portfolioRef,
        },
      });
      if (!error && data?.message) {
        const msg = data.message.replace(/\{\{DEMO_LINK\}\}/g, demoLink);
        setGeneratedMessage(msg);
        toast.success(`Messaggio ${channel} generato per ${lead.name}`);
      } else throw new Error("No message");
    } catch {
      const sectorLabel = INDUSTRY_CONFIGS[lead._sector as keyof typeof INDUSTRY_CONFIGS]?.label || "la vostra attività";
      const demoLink = `${window.location.origin}${getDemoSiteUrl(lead._sector)}`;
      const fb = channel === "instagram"
        ? `${lead.name} — che spettacolo! 🔥\n\nAbbiamo creato qualcosa di simile per il vostro settore:\n👉 ${demoLink}\n\nVi interessa?`
        : channel === "email"
        ? `Oggetto: Proposta digitale per ${lead.name}\n\nBuongiorno,\n\nAbbiamo sviluppato una piattaforma completa per ${sectorLabel}.\n\nDemo: ${demoLink}\n\nSarebbe disponibile per una call?\n\n---\nEmpire AI Group\n📩 info@empireaigroup.com`
        : `Buongiorno! 👋\n\nHo notato *${lead.name}* a ${lead.city} — complimenti!\n\nAbbiamo una piattaforma per ${sectorLabel} che automatizza prenotazioni e marketing.\n\n👉 Demo: ${demoLink}\n\nPosso mostrarvi in 2 minuti?`;
      setGeneratedMessage(fb);
    } finally {
      setGeneratingMsg(false);
    }
  }, [activeChannel, enrichLeadSocial]);

  const copyMessage = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage);
      toast.success("Messaggio copiato!");
    }
  };

  const sorted = [...results].sort((a, b) =>
    sortBy === "score" ? b._score - a._score :
    sortBy === "rating" ? (b.google_rating || 0) - (a.google_rating || 0) :
    a.name.localeCompare(b.name)
  );

  const hotLeads = results.filter(l => l._score >= 70).length;
  const sectorConfig = selected ? INDUSTRY_CONFIGS[selected._sector as keyof typeof INDUSTRY_CONFIGS] : null;
  const previewScreens = selected ? getPreviewScreens(selected._sector) : [];

  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };

  // Source stats
  const sourceStats = results.reduce((acc, r) => {
    acc[r.source] = (acc[r.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen p-4 space-y-4 pb-24" style={{ background: "linear-gradient(135deg, #0a0a12 0%, #0d1117 50%, #0a0a12 100%)" }}>
      {/* ═══ HEADER ═══ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2 text-white">
            <Target className="w-5 h-5" style={{ color: "#14b8a6" }} /> LeadEngine Scout
          </h1>
          <p className="text-[10px] mt-0.5" style={{ color: "#6b7280" }}>
            Cerca → Analizza → Preview personalizzata → Messaggio AI — tutto in uno
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {results.length > 0 && (
            <>
              <span className="px-2 py-1 rounded-lg text-[9px] font-bold" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>
                🟢 {results.length} lead
              </span>
              <span className="px-2 py-1 rounded-lg text-[9px] font-bold" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
                🔥 {hotLeads} caldi
              </span>
            </>
          )}
        </div>
      </div>

      {/* ═══ SEARCH BAR ═══ */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.06), rgba(16,185,129,0.03))", border: "1px solid rgba(20,184,166,0.15)" }}>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-3 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#14b8a6" }} />
            <input value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Città (Roma, London, NYC...)" className="w-full pl-9 pr-3 py-3 rounded-xl text-xs text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
          </div>
          <div className="sm:col-span-3">
            <select value={sector} onChange={e => setSector(e.target.value)}
              className="w-full px-3 py-3 rounded-xl text-xs text-white outline-none appearance-none cursor-pointer" style={inputStyle}>
              {SECTOR_OPTIONS.map(s => <option key={s.value} value={s.value} style={{ background: "#1a1a2e" }}>{s.label}</option>)}
            </select>
          </div>
          <div className="sm:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#6b7280" }} />
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Nome, zona, tipo..." className="w-full pl-9 pr-3 py-3 rounded-xl text-xs text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
          </div>
          <div className="sm:col-span-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleSearch()} disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              style={{ background: loading ? "rgba(20,184,166,0.3)" : "linear-gradient(135deg, #14b8a6, #10b981)", color: "#fff" }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Cerco..." : "Cerca Lead"}
            </motion.button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg" style={{ ...inputStyle, color: "#9ca3af" }}>
            <Filter className="w-3 h-3" /> Filtri <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
          <button onClick={() => setShowManual(!showManual)} className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg" style={{ ...inputStyle, color: "#a78bfa" }}>
            <UserPlus className="w-3 h-3" /> Lead esterno
          </button>
          {/* Source badges */}
          {results.length > 0 && Object.entries(sourceStats).map(([src, count]) => {
            const info = SOURCE_LABELS[src] || { label: src, color: "#9ca3af" };
            return (
              <span key={src} className="text-[8px] font-bold px-2 py-1 rounded-lg" style={{ background: `${info.color}12`, color: info.color }}>
                {info.label}: {count}
              </span>
            );
          })}
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: "#6b7280" }}>Rating minimo</label>
                  <select value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl text-xs text-white outline-none" style={inputStyle}>
                    <option value={0} style={{ background: "#1a1a2e" }}>Tutti</option>
                    <option value={3} style={{ background: "#1a1a2e" }}>3+ ⭐</option>
                    <option value={4} style={{ background: "#1a1a2e" }}>4+ ⭐</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: "#6b7280" }}>Canale default</label>
                  <select value={activeChannel} onChange={e => setActiveChannel(e.target.value as any)} className="w-full px-3 py-2 rounded-xl text-xs text-white outline-none" style={inputStyle}>
                    <option value="whatsapp" style={{ background: "#1a1a2e" }}>💬 WhatsApp</option>
                    <option value="instagram" style={{ background: "#1a1a2e" }}>📷 Instagram DM</option>
                    <option value="email" style={{ background: "#1a1a2e" }}>📧 Email Pro</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual lead input */}
        <AnimatePresence>
          {showManual && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="rounded-xl p-3 space-y-2" style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.15)" }}>
                <p className="text-[10px] font-bold" style={{ color: "#c4b5fd" }}>📥 Aggiungi un lead trovato esternamente</p>
                <div className="grid grid-cols-2 gap-2">
                  <input value={manualName} onChange={e => setManualName(e.target.value)} placeholder="Nome attività *" className="px-3 py-2 rounded-lg text-xs text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                  <input value={manualCity} onChange={e => setManualCity(e.target.value)} placeholder="Città" className="px-3 py-2 rounded-lg text-xs text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                  <input value={manualWebsite} onChange={e => setManualWebsite(e.target.value)} placeholder="Sito web" className="px-3 py-2 rounded-lg text-xs text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                  <input value={manualIg} onChange={e => setManualIg(e.target.value)} placeholder="@instagram" className="px-3 py-2 rounded-lg text-xs text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                  <input value={manualPhone} onChange={e => setManualPhone(e.target.value)} placeholder="Telefono" className="px-3 py-2 rounded-lg text-xs text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                  <select value={manualSector} onChange={e => setManualSector(e.target.value)} className="px-3 py-2 rounded-lg text-xs text-white outline-none" style={inputStyle}>
                    {SECTOR_OPTIONS.map(s => <option key={s.value} value={s.value} style={{ background: "#1a1a2e" }}>{s.label}</option>)}
                  </select>
                </div>
                <motion.button whileTap={{ scale: 0.97 }} onClick={addManualLead}
                  className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)", color: "#fff" }}>
                  <UserPlus className="w-3.5 h-3.5" /> Aggiungi e Analizza
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ RESULTS LIST ═══ */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-semibold" style={{ color: "#9ca3af" }}>
                {results.length} lead {city && `a ${city}`} {searchPage > 0 && `(${searchPage + 1} ricerche)`}
              </p>
              <div className="flex items-center gap-0.5">
                <ArrowUpDown className="w-3 h-3 mr-1" style={{ color: "#6b7280" }} />
                {(["score", "rating", "name"] as const).map(s => (
                  <button key={s} onClick={() => setSortBy(s)} className="px-2 py-1 rounded text-[9px] font-semibold transition-all"
                    style={{ background: sortBy === s ? "rgba(255,255,255,0.08)" : "transparent", color: sortBy === s ? "#e5e7eb" : "#6b7280" }}>
                    {s === "score" ? "Score" : s === "rating" ? "Rating" : "Nome"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {sorted.map((lead, i) => {
                const isSelected = selected?.name === lead.name && selected?.full_address === lead.full_address;
                const scoreColor = lead._score >= 70 ? "#ef4444" : lead._score >= 45 ? "#f59e0b" : "#10b981";
                const srcInfo = SOURCE_LABELS[lead.source] || { label: lead.source, color: "#9ca3af" };
                return (
                  <motion.button key={`${lead.name}-${i}`}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.01, 0.5) }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(lead)}
                    className="w-full text-left p-3 rounded-xl transition-all flex items-start gap-3"
                    style={{
                      background: isSelected ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? "rgba(20,184,166,0.3)" : "rgba(255,255,255,0.05)"}`,
                    }}>
                    {/* Score circle */}
                    <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0" style={{ background: `${scoreColor}15`, border: `1px solid ${scoreColor}30` }}>
                      <span className="text-xs font-black" style={{ color: scoreColor }}>{lead._score}</span>
                      <span className="text-[6px] font-bold uppercase" style={{ color: scoreColor }}>score</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-bold text-white truncate">{lead.name}</p>
                        {lead.isManual && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(167,139,250,0.12)", color: "#c4b5fd" }}>Esterno</span>
                        )}
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{
                          background: `${srcInfo.color}12`, color: srcInfo.color,
                        }}>
                          {srcInfo.label}
                        </span>
                        {lead.google_rating > 0 && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
                            ⭐ {lead.google_rating}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] truncate mt-0.5" style={{ color: "#6b7280" }}>{lead.full_address || lead.city}</p>
                      <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                        {lead.phone && <span className="text-[9px] flex items-center gap-1" style={{ color: "#34d399" }}><Phone className="w-2.5 h-2.5" /> {lead.phone}</span>}
                        {lead.website && <span className="text-[9px] flex items-center gap-1" style={{ color: "#60a5fa" }}><Globe className="w-2.5 h-2.5" /> Sito</span>}
                        {lead.instagram && <span className="text-[9px] flex items-center gap-1" style={{ color: "#E4405F" }}><Instagram className="w-2.5 h-2.5" /> IG</span>}
                        {lead.opening_hours && <span className="text-[9px] flex items-center gap-1" style={{ color: "#a78bfa" }}>🕐 Orari</span>}
                        {!lead.website && <span className="text-[9px] flex items-center gap-1" style={{ color: "#ef4444" }}><AlertTriangle className="w-2.5 h-2.5" /> No sito</span>}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* ═══ DEEP SEARCH BUTTON ═══ */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleDeepSearch}
              disabled={deepLoading}
              className="w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mt-2"
              style={{
                background: deepLoading ? "rgba(124,58,237,0.2)" : "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(20,184,166,0.08))",
                border: "1px solid rgba(124,58,237,0.25)",
                color: deepLoading ? "#a78bfa" : "#c4b5fd",
              }}
            >
              {deepLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Ricerca approfondita in corso...</>
              ) : (
                <><Layers className="w-4 h-4" /> 🔍 Cerca ancora — trova più lead a {lastSearchCity || city}</>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ PIPELINE: Selected → Analysis + Customized Preview + Message ═══ */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">

            {/* Lead Summary + Quick Analysis */}
            <div className="p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(59,130,246,0.04))", border: "1px solid rgba(124,58,237,0.15)" }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.1))" }}>
                    <Building2 className="w-5 h-5" style={{ color: "#a78bfa" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{selected.name}</p>
                    <p className="text-[10px]" style={{ color: "#6b7280" }}>{selected.full_address || selected.city}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {sectorConfig && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(124,58,237,0.12)", color: "#c4b5fd" }}>
                          {sectorConfig.emoji} {sectorConfig.label}
                        </span>
                      )}
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{
                        background: selected._score >= 70 ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                        color: selected._score >= 70 ? "#f87171" : "#fbbf24",
                      }}>
                        {selected._score >= 70 ? "🔥" : "⚡"} Score: {selected._score}/100
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => { setSelected(null); setGeneratedMessage(null); }}
                  className="p-1.5 rounded-lg shrink-0" style={{ background: "rgba(239,68,68,0.1)" }}>
                  <XIcon className="w-3.5 h-3.5" style={{ color: "#f87171" }} />
                </button>
              </div>

              {/* Analysis indicators */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {(() => {
                  const igHandle = selected.instagram || enrichedData?.instagram;
                  const igLoading = enrichingIg && !igHandle;
                  return [
                    { label: "Sito Web", value: selected.website ? "✅ Attivo" : "❌ Assente", color: selected.website ? "#34d399" : "#ef4444", icon: Globe },
                    { label: "Instagram", value: igLoading ? "🔍 Cerca..." : igHandle ? `@${igHandle}` : "❌ No", color: igHandle ? "#E4405F" : igLoading ? "#f59e0b" : "#6b7280", icon: Instagram },
                    { label: "Telefono", value: selected.phone ? "✅ OK" : "⚠️ N/D", color: selected.phone ? "#34d399" : "#f59e0b", icon: Phone },
                    { label: "Rating", value: selected.google_rating > 0 ? `⭐ ${selected.google_rating}` : "N/D", color: selected.google_rating >= 4 ? "#fbbf24" : "#6b7280", icon: Star },
                  ];
                })().map((ind, idx) => (
                  <div key={idx} className="p-2 rounded-xl text-center" style={{ background: `${ind.color}08`, border: `1px solid ${ind.color}20` }}>
                    <ind.icon className="w-3 h-3 mx-auto mb-0.5" style={{ color: ind.color }} />
                    <p className="text-[7px] font-bold uppercase" style={{ color: "#6b7280" }}>{ind.label}</p>
                    <p className="text-[8px] font-bold truncate" style={{ color: ind.color }}>{ind.value}</p>
                  </div>
                ))}
              </div>

              {/* Contact & research links */}
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {/* Instagram direct link — enriched */}
                {(() => {
                  const igHandle = selected.instagram || enrichedData?.instagram;
                  if (igHandle) return (
                    <a href={`https://instagram.com/direct/t/${igHandle.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                      style={{ background: "rgba(228,64,95,0.15)", border: "1px solid rgba(228,64,95,0.3)", color: "#E4405F" }}>
                      <Instagram className="w-3 h-3" /> @{igHandle.replace("@", "")}
                    </a>
                  );
                  if (enrichingIg) return (
                    <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                      style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}>
                      <Loader2 className="w-3 h-3 animate-spin" /> Cerco IG...
                    </span>
                  );
                  return null;
                })()}
                {selected.phone && (
                  <a href={`https://wa.me/${selected.phone.replace(/\s+/g, "").replace("+", "")}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                    style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", color: "#25D366" }}>
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </a>
                )}
                {selected.website && (
                  <a href={selected.website.startsWith("http") ? selected.website : `https://${selected.website}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                    style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa" }}>
                    <Globe className="w-3 h-3" /> Sito
                  </a>
                )}
                {selected.google_maps_url && (
                  <a href={selected.google_maps_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                    style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}>
                    <Map className="w-3 h-3" /> Maps
                  </a>
                )}
                {selected.search_google && (
                  <a href={selected.search_google} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                    style={{ background: "rgba(66,133,244,0.1)", border: "1px solid rgba(66,133,244,0.2)", color: "#93bbfc" }}>
                    <Search className="w-3 h-3" /> Google
                  </a>
                )}
                {selected.search_facebook && (
                  <a href={selected.search_facebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                    style={{ background: "rgba(24,119,242,0.1)", border: "1px solid rgba(24,119,242,0.2)", color: "#5B9BF5" }}>
                    <Facebook className="w-3 h-3" /> Facebook
                  </a>
                )}
              </div>
            </div>

            {/* ═══ CUSTOMIZED DEMO PREVIEW ═══ */}
            {previewScreens.length > 0 && (
              <div className="p-4 rounded-2xl space-y-2" style={{ background: "rgba(167,139,250,0.03)", border: "1px solid rgba(167,139,250,0.1)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
                    <span className="text-xs font-bold text-white">📱 Preview personalizzata per {selected.name}</span>
                  </div>
                  <button onClick={() => setShowPreview(!showPreview)} className="text-[9px] font-semibold" style={{ color: "#a78bfa" }}>
                    {showPreview ? "Nascondi" : "Mostra"}
                  </button>
                </div>
                <AnimatePresence>
                  {showPreview && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      {/* Customized overlay header */}
                      <div className="rounded-xl p-3 mb-2" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(20,184,166,0.06))", border: "1px solid rgba(124,58,237,0.15)" }}>
                        <p className="text-[10px] font-bold" style={{ color: "#e5e7eb" }}>
                          🎯 Ecco come potrebbe apparire <span style={{ color: "#a78bfa" }}>{selected.name}</span> con Empire AI:
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          <span className="text-[8px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(20,184,166,0.12)", color: "#14b8a6" }}>
                            ✅ App & Sito personalizzato
                          </span>
                          <span className="text-[8px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(124,58,237,0.12)", color: "#c4b5fd" }}>
                            ✅ Admin Dashboard
                          </span>
                          <span className="text-[8px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(245,158,11,0.12)", color: "#fbbf24" }}>
                            ✅ AI Integrata
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {previewScreens.map((screen, i) => (
                          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                            className="rounded-xl overflow-hidden aspect-[9/16] relative group" style={{ border: "1px solid rgba(167,139,250,0.15)" }}>
                            <img src={screen} alt={`Preview ${i + 1}`} className="w-full h-full object-cover object-top" loading="lazy" />
                            {/* Lead name overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-2" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.85))" }}>
                              <p className="text-[8px] font-bold text-white truncate">{selected.name}</p>
                              <p className="text-[6px]" style={{ color: "#a78bfa" }}>{sectorConfig?.label || "Business"}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <a href={getDemoSiteUrl(selected._sector)} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold"
                          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(16,185,129,0.1))", border: "1px solid rgba(124,58,237,0.2)", color: "#c4b5fd" }}>
                          <ExternalLink className="w-3 h-3" /> Demo Live {sectorConfig?.label || ""}
                        </a>
                        <button onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}${getDemoSiteUrl(selected._sector)}`);
                          toast.success("Link demo copiato!");
                        }} className="px-4 py-2 rounded-xl text-[10px] font-bold" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}>
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Messaggio AI */}
            <div className="p-4 rounded-2xl space-y-3" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.05), rgba(59,130,246,0.03))", border: "1px solid rgba(16,185,129,0.12)" }}>
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" style={{ color: "#34d399" }} />
                <span className="text-xs font-bold text-white">Messaggio Personalizzato AI</span>
                {generatingMsg && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "#34d399" }} />}
              </div>

              {/* Channel selector */}
              <div className="flex gap-1.5">
                {([
                  { id: "whatsapp" as const, icon: MessageCircle, label: "WhatsApp", color: "#25D366" },
                  { id: "instagram" as const, icon: Instagram, label: "Instagram DM", color: "#E4405F" },
                  { id: "email" as const, icon: Mail, label: "Email Pro", color: "#3B82F6" },
                ] as const).map(ch => (
                  <button key={ch.id} onClick={() => {
                    if (activeChannel !== ch.id) {
                      setActiveChannel(ch.id);
                      if (selected && !generatingMsg) handleSelect(selected, ch.id);
                    }
                  }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                    style={{
                      background: activeChannel === ch.id ? `${ch.color}18` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${activeChannel === ch.id ? `${ch.color}40` : "rgba(255,255,255,0.06)"}`,
                      color: activeChannel === ch.id ? ch.color : "#6b7280",
                    }}>
                    <ch.icon className="w-3 h-3" /> {ch.label}
                  </button>
                ))}
              </div>

              {generatedMessage ? (
                <>
                  {/* ── WhatsApp Bubble ── */}
                  {activeChannel === "whatsapp" && (
                    <div className="rounded-2xl overflow-hidden" style={{ background: "#0b141a" }}>
                      <div className="flex items-center gap-2 px-3 py-2" style={{ background: "#1f2c34" }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#25D366", color: "#fff" }}>EA</div>
                        <div>
                          <p className="text-[11px] font-semibold" style={{ color: "#e9edef" }}>Empire AI Group</p>
                          <p className="text-[8px]" style={{ color: "#8696a0" }}>online</p>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="max-w-[85%] rounded-xl rounded-tl-sm px-3 py-2" style={{ background: "#005c4b" }}>
                          <p className="text-[11px] leading-relaxed whitespace-pre-line" style={{ color: "#e9edef" }}>
                            {generatedMessage.replace(/\*([^*]+)\*/g, '𝗯$1𝗯').replace(/𝗯/g, '')}
                          </p>
                          <p className="text-[8px] text-right mt-1" style={{ color: "#8696a0" }}>
                            {new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })} ✓✓
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Instagram DM ── */}
                  {activeChannel === "instagram" && (() => {
                    const igHandle = selected.instagram || enrichedData?.instagram;
                    return (
                    <div className="rounded-2xl overflow-hidden" style={{ background: "#000" }}>
                      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: "linear-gradient(135deg, #833AB4, #E4405F, #FCAF45)", color: "#fff" }}>E</div>
                          <div>
                            <p className="text-[11px] font-semibold" style={{ color: "#f5f5f5" }}>empire.ai.group</p>
                            <p className="text-[8px]" style={{ color: "#a8a8a8" }}>Attivo/a ora</p>
                          </div>
                        </div>
                        {igHandle && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: "rgba(228,64,95,0.15)", border: "1px solid rgba(228,64,95,0.25)" }}>
                            <Instagram className="w-2.5 h-2.5" style={{ color: "#E4405F" }} />
                            <span className="text-[8px] font-bold" style={{ color: "#E4405F" }}>@{igHandle.replace("@", "")}</span>
                            <CheckCircle className="w-2.5 h-2.5" style={{ color: "#34d399" }} />
                          </div>
                        )}
                      </div>
                      <div className="p-3 flex justify-end">
                        <div className="max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2.5" style={{ background: "#3797f0" }}>
                          <p className="text-[11px] leading-relaxed whitespace-pre-line" style={{ color: "#fff" }}>
                            {generatedMessage}
                          </p>
                        </div>
                      </div>
                      <div className="px-3 pb-2">
                        <p className="text-[8px] text-right" style={{ color: "#666" }}>Visto</p>
                      </div>
                    </div>
                    );
                  })()}

                  {/* ── Email Professional ── */}
                  {activeChannel === "email" && (() => {
                    const lines = generatedMessage.split("\n");
                    const subjectLine = lines.find(l => l.toLowerCase().startsWith("oggetto:"));
                    const subject = subjectLine?.replace(/^oggetto:\s*/i, "").trim() || "Proposta Empire AI";
                    const bodyLines = lines.filter(l => !l.toLowerCase().startsWith("oggetto:")).join("\n").trim();
                    const demoUrl = getDemoSiteUrl(selected._sector);
                    const previewImg = previewScreens[0];

                    return (
                      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff" }}>
                        <div className="px-4 py-3" style={{ borderBottom: "1px solid #e5e7eb" }}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff" }}>EA</div>
                            <div>
                              <p className="text-[11px] font-semibold" style={{ color: "#111827" }}>Empire AI Group</p>
                              <p className="text-[8px]" style={{ color: "#6b7280" }}>info@empireaigroup.com</p>
                            </div>
                          </div>
                          <p className="text-xs font-bold" style={{ color: "#111827" }}>{subject}</p>
                          <p className="text-[9px]" style={{ color: "#9ca3af" }}>
                            A: {selected.email || selected.name.toLowerCase().replace(/\s+/g, "") + "@email.com"}
                          </p>
                        </div>
                        <div className="px-4 py-3">
                          <div className="text-[11px] leading-relaxed whitespace-pre-line" style={{ color: "#374151" }}>
                            {bodyLines}
                          </div>
                          {previewImg && (
                            <div className="mt-3 rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
                              <img src={previewImg} alt="Preview progetto" className="w-full h-32 object-cover object-top" />
                              <div className="p-2.5" style={{ background: "#f9fafb" }}>
                                <p className="text-[10px] font-bold" style={{ color: "#111827" }}>
                                  📱 Demo personalizzata — {selected.name}
                                </p>
                                <p className="text-[8px]" style={{ color: "#6b7280" }}>
                                  {window.location.origin}{demoUrl}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-2.5" style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
                              <Zap className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <p className="text-[9px] font-bold" style={{ color: "#374151" }}>Empire AI Group</p>
                              <p className="text-[7px]" style={{ color: "#9ca3af" }}>Digital Transformation Partner</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Action buttons */}
                  <div className="flex gap-2 flex-wrap mt-2">
                    <motion.button whileTap={{ scale: 0.97 }} onClick={copyMessage}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold" style={{ background: "#7c3aed", color: "#fff" }}>
                      <Copy className="w-4 h-4" /> Copia Messaggio
                    </motion.button>
                    {activeChannel === "whatsapp" && selected.phone && (
                      <motion.a whileTap={{ scale: 0.97 }}
                        href={`https://wa.me/${selected.phone.replace(/\s+/g, "").replace("+", "")}?text=${encodeURIComponent(generatedMessage)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold" style={{ background: "#25D366", color: "#fff" }}>
                        <Send className="w-4 h-4" /> Invia su WA
                      </motion.a>
                    )}
                    {activeChannel === "instagram" && (() => {
                      const igHandle = selected.instagram || enrichedData?.instagram;
                      if (!igHandle) return null;
                      const cleanHandle = igHandle.replace("@", "");
                      return (
                        <motion.a whileTap={{ scale: 0.97 }}
                          href={`https://instagram.com/direct/t/${cleanHandle}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold" style={{ background: "linear-gradient(135deg, #833AB4, #E4405F)", color: "#fff" }}>
                          <Send className="w-4 h-4" /> Invia DM @{cleanHandle}
                        </motion.a>
                      );
                    })()}
                    {activeChannel === "email" && (
                      <motion.a whileTap={{ scale: 0.97 }}
                        href={`mailto:${selected.email || ""}?subject=${encodeURIComponent(generatedMessage.split("\n").find(l => l.toLowerCase().startsWith("oggetto:"))?.replace(/^oggetto:\s*/i, "") || "Proposta Empire AI")}&body=${encodeURIComponent(generatedMessage)}`}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold" style={{ background: "#3B82F6", color: "#fff" }}>
                        <Mail className="w-4 h-4" /> Invia Email
                      </motion.a>
                    )}
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleSelect(selected)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-semibold"
                      style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.15)", color: "#fbbf24" }}>
                      <RefreshCw className="w-3 h-3" /> Rigenera
                    </motion.button>
                  </div>
                </>
              ) : generatingMsg ? (
                <div className="flex items-center justify-center gap-3 py-6">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#34d399" }} />
                  <span className="text-xs" style={{ color: "#9ca3af" }}>Generazione messaggio per {selected.name}...</span>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {results.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(20,184,166,0.08)" }}>
            <Target className="w-6 h-6" style={{ color: "#14b8a6" }} />
          </div>
          <p className="text-sm font-bold text-white mb-1">Trova i tuoi prossimi clienti</p>
          <p className="text-[11px] max-w-sm mx-auto" style={{ color: "#6b7280" }}>
            Inserisci città e settore per cercare lead reali da Google Maps, OSM, Overpass e altre fonti. Puoi fare ricerche ripetute per trovare sempre più lead.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["🗺️ Google Maps", "🌍 OpenStreetMap", "📍 Photon", "🔎 Overpass API"].map(src => (
              <span key={src} className="text-[9px] px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(20,184,166,0.08)", color: "#14b8a6" }}>
                {src}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
