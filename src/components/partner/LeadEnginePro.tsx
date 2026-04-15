import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Target, Globe, Phone, Mail, Instagram, Loader2,
  Star, ExternalLink, MessageCircle, ChevronDown, ChevronRight,
  Sparkles, Eye, Copy, CheckCircle, Zap, Filter, ArrowRight,
  Building2, Send, RefreshCw, Wand2, Map, Link2, X as XIcon,
  Key, Info, Crown, Settings
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SECTOR_OPTIONS } from "@/data/mock-leads-data";
import { INDUSTRY_CONFIGS } from "@/config/industry-config";
import { SECTOR_PORTFOLIO } from "@/data/sector-mockup-images";
import { PORTFOLIO_PROJECTS } from "@/data/portfolio-showcase-data";
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
  google_rating: number;
  google_reviews: number;
  google_maps_url: string | null;
  source: string;
  osm_type?: string;
  types?: string[];
  business_status?: string;
  lat?: number;
  lon?: number;
}

interface Props {
  onSectorSelected?: (sectorId: string) => void;
  onLeadSelected?: (lead: Lead, sector: string, ig: string, website: string) => void;
  onMessageGenerated?: (message: string) => void;
  selectedProject?: string | null;
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

/* Detect sector from lead type/name */
const detectSector = (lead: Lead): string => {
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
  for (const [sector, regex] of sectorMap) {
    if (regex.test(text)) return sector;
  }
  return "custom";
};

/* ─── COMPONENT ─── */
export default function LeadEnginePro({ onSectorSelected, onLeadSelected, onMessageGenerated, selectedProject }: Props) {
  // Search state
  const [city, setCity] = useState("");
  const [sector, setSector] = useState("food");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Lead[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Selection + pipeline state
  const [selected, setSelected] = useState<Lead | null>(null);
  const [detectedSector, setDetectedSector] = useState<string | null>(null);
  const [generatingMsg, setGeneratingMsg] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [activeChannel, setActiveChannel] = useState<"instagram" | "whatsapp" | "email">("whatsapp");
  const [showPreview, setShowPreview] = useState(false);
  const [hasGoogleKey, setHasGoogleKey] = useState<boolean | null>(null);
  const [showGoogleGuide, setShowGoogleGuide] = useState(false);

  // Sector preview screens
  const getPreviewScreens = (sectorId: string) => {
    const portfolio = SECTOR_PORTFOLIO.find(sp => sp.sectorId === sectorId);
    const brand = portfolio?.brands?.[0];
    const style = brand?.styles?.[0];
    return style?.screens?.slice(0, 4) || [];
  };

  /* ─── Search ─── */
  const handleSearch = useCallback(async () => {
    if (!city.trim() && !query.trim()) {
      toast({ title: "Inserisci una città o parola chiave", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResults([]);
    setSelected(null);
    setGeneratedMessage(null);

    try {
      const { data, error } = await supabase.functions.invoke("lead-search", {
        body: { query: query.trim(), city: city.trim(), sector, mode: "zone", use_google: true },
      });
      if (error) throw error;
      if (data?.success && data.results?.length > 0) {
        let filtered = data.results;
        if (minRating > 0) {
          filtered = filtered.filter((r: any) => (r.google_rating || 0) >= minRating);
        }
        setResults(filtered);
        setHasGoogleKey(data.has_google_key ?? false);
        toast({ title: `✅ ${filtered.length} lead trovati`, description: `${data.sources?.nominatim || 0} OpenStreetMap · ${data.sources?.google || 0} Google Places` });
      } else {
        setHasGoogleKey(data?.has_google_key ?? false);
        if (data?.tip) {
          toast({ title: "⚠️ Pochi risultati", description: data.tip, duration: 8000 });
        } else {
          toast({ title: "Nessun risultato", description: "Prova con una città o settore diverso", variant: "destructive" });
        }
      }
    } catch (e: any) {
      console.error("Lead search error:", e);
      toast({ title: "Errore ricerca", description: e.message || "Riprova", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [city, query, sector, minRating]);

  /* ─── Select Lead → Auto-pipeline ─── */
  const handleSelect = useCallback(async (lead: Lead, channelOverride?: string) => {
    setSelected(lead);
    const detSector = detectSector(lead);
    setDetectedSector(detSector);
    onSectorSelected?.(detSector);
    
    const ig = lead.instagram?.replace("@", "") || "";
    const web = lead.website || "";
    onLeadSelected?.(lead, detSector, ig, web);
    setShowPreview(true);

    const channel = channelOverride || activeChannel;

    // Auto-generate message
    setGeneratingMsg(true);
    setGeneratedMessage(null);
    try {
      const sectorLabel = INDUSTRY_CONFIGS[detSector as keyof typeof INDUSTRY_CONFIGS]?.label || detSector;
      const demoLink = `${window.location.origin}${getDemoSiteUrl(detSector)}`;
      const portfolioRef = PORTFOLIO_REFS[detSector] || "il nostro portfolio";
      
      const { data, error } = await supabase.functions.invoke("scan-prospect", {
        body: {
          instagram: ig,
          website: web,
          sector: sectorLabel,
          channel,
          demoLink,
          allDemosLink: `${window.location.origin}/demo`,
          contactInfo: "📩 info@empireaigroup.com",
          leadName: lead.name,
          leadCity: lead.city,
          leadPhone: lead.phone,
          portfolioRef,
          country: "",
        },
      });
      if (!error && data?.message) {
        let msg = data.message.replace(/\{\{DEMO_LINK\}\}/g, demoLink);
        setGeneratedMessage(msg);
        onMessageGenerated?.(msg);
        toast({ title: "🤖 Messaggio AI generato!", description: `Formato: ${channel === "instagram" ? "Instagram DM" : channel === "email" ? "Email Pro" : "WhatsApp"}` });
      }
    } catch (err) {
      console.warn("AI message generation failed:", err);
      const sectorLabel = INDUSTRY_CONFIGS[detSector as keyof typeof INDUSTRY_CONFIGS]?.label || "la vostra attività";
      const demoLink = `${window.location.origin}${getDemoSiteUrl(detSector)}`;
      const fallback = channel === "instagram"
        ? `${lead.name} a ${lead.city} — che spettacolo! 🔥\n\nAbbiamo creato qualcosa di simile per il vostro settore, guardate:\n👉 ${demoLink}\n\nVi interessa?`
        : channel === "email"
        ? `Oggetto: Proposta digitale per ${lead.name}\n\nBuongiorno,\n\nHo avuto modo di conoscere ${lead.name} a ${lead.city}.\n\nAbbiamo sviluppato una piattaforma completa per ${sectorLabel} che include prenotazioni, CRM e marketing automatico.\n\nDemo: ${demoLink}\n\nSarebbe disponibile per una breve call di 10 minuti?\n\n---\nEmpire AI Group\n📩 info@empireaigroup.com`
        : `Buongiorno! 👋\n\nHo notato *${lead.name}* a ${lead.city} — complimenti!\n\nAbbiamo creato una piattaforma per ${sectorLabel} che automatizza prenotazioni e marketing.\n\n✅ App con il vostro brand\n✅ Prenotazioni 24/7\n✅ CRM integrato\n\n👉 Demo: ${demoLink}\n\nPosso mostrarvi in 2 minuti?`;
      setGeneratedMessage(fallback);
      onMessageGenerated?.(fallback);
    } finally {
      setGeneratingMsg(false);
    }
  }, [activeChannel, onSectorSelected, onLeadSelected, onMessageGenerated]);

  const copyMessage = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage);
      toast({ title: "✅ Messaggio copiato!" });
    }
  };

  const previewScreens = detectedSector ? getPreviewScreens(selectedProject || detectedSector) : [];
  const sectorConfig = detectedSector ? INDUSTRY_CONFIGS[detectedSector as keyof typeof INDUSTRY_CONFIGS] : null;

  return (
    <div className="space-y-4">
      {/* ═══════ SEARCH BAR ═══════ */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.08), rgba(16,185,129,0.04))", border: "1px solid rgba(20,184,166,0.2)" }}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #14b8a6, #10b981)" }}>
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              🎯 LeadEngine Pro
              <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                LIVE
              </span>
            </h3>
            <p className="text-[10px]" style={{ color: "#9ca3af" }}>Cerca → Analizza → Preview → Messaggio personalizzato — tutto automatico</p>
          </div>
        </div>

        {/* City + Query + Sector */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          {/* City - free text */}
          <div className="sm:col-span-3 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#14b8a6" }} />
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Città (es: Roma, London, NYC...)"
              className="w-full pl-9 pr-3 py-3 rounded-xl text-xs text-white placeholder:text-gray-500 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
            />
          </div>

          {/* Sector */}
          <div className="sm:col-span-3">
            <select value={sector} onChange={e => setSector(e.target.value)}
              className="w-full px-3 py-3 rounded-xl text-xs text-white outline-none appearance-none cursor-pointer"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
              {SECTOR_OPTIONS.map(s => <option key={s.value} value={s.value} style={{ background: "#1a1a2e" }}>{s.label}</option>)}
            </select>
          </div>

          {/* Free text search */}
          <div className="sm:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#6b7280" }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Nome, zona, tipo di attività..."
              className="w-full pl-9 pr-3 py-3 rounded-xl text-xs text-white placeholder:text-gray-500 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
            />
          </div>

          {/* Search button */}
          <div className="sm:col-span-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              style={{ background: loading ? "rgba(20,184,166,0.3)" : "linear-gradient(135deg, #14b8a6, #10b981)", color: "#fff" }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Cerco..." : "Cerca"}
            </motion.button>
          </div>
        </div>

        {/* Filters toggle */}
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: "#6b7280" }}>
          <Filter className="w-3 h-3" /> Filtri avanzati
          <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: "#6b7280" }}>Rating min.</label>
                  <select value={minRating} onChange={e => setMinRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <option value={0} style={{ background: "#1a1a2e" }}>Tutti</option>
                    <option value={2} style={{ background: "#1a1a2e" }}>2+ ⭐</option>
                    <option value={3} style={{ background: "#1a1a2e" }}>3+ ⭐</option>
                    <option value={4} style={{ background: "#1a1a2e" }}>4+ ⭐</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: "#6b7280" }}>Canale messaggio</label>
                  <select value={activeChannel} onChange={e => setActiveChannel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <option value="whatsapp" style={{ background: "#1a1a2e" }}>💬 WhatsApp</option>
                    <option value="instagram" style={{ background: "#1a1a2e" }}>📷 Instagram DM</option>
                    <option value="email" style={{ background: "#1a1a2e" }}>📧 Email</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Places API status banner */}
        {hasGoogleKey === false && (
          <div className="rounded-xl p-3 space-y-2" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />
                <span className="text-[10px] font-bold" style={{ color: "#fbbf24" }}>🔓 Opzione Premium: Google Places API</span>
              </div>
              <button onClick={() => setShowGoogleGuide(!showGoogleGuide)} className="text-[9px] font-semibold flex items-center gap-1" style={{ color: "#fbbf24" }}>
                {showGoogleGuide ? "Chiudi" : "Come fare"} <ChevronDown className={`w-3 h-3 transition-transform ${showGoogleGuide ? "rotate-180" : ""}`} />
              </button>
            </div>
            <p className="text-[10px]" style={{ color: "#9ca3af" }}>
              La ricerca base (OpenStreetMap) è gratuita e illimitata. Per risultati più precisi con <b style={{ color: "#fbbf24" }}>telefono, rating, sito web e recensioni reali</b>, puoi collegare la Google Places API (a pagamento, pay-per-use ~$17/1000 ricerche).
            </p>
            <AnimatePresence>
              {showGoogleGuide && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="rounded-xl p-4 space-y-3 mt-1" style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-xs font-bold text-white">📋 Come configurare Google Places API</p>
                    <ol className="space-y-2.5 text-[10px] leading-relaxed" style={{ color: "#d1d5db" }}>
                      <li className="flex gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold" style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa" }}>1</span>
                        <span>Vai su <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold" style={{ color: "#60a5fa" }}>Google Cloud Console</a> e crea un nuovo progetto (o usa uno esistente).</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold" style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa" }}>2</span>
                        <span>Abilita la <b>"Places API (New)"</b> dalla sezione <i>API & Services → Library</i>.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold" style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa" }}>3</span>
                        <span>Vai su <i>API & Services → Credentials</i> → <b>Create Credentials → API Key</b>.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold" style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa" }}>4</span>
                        <span><b>Limita la chiave</b> (consigliato): clicca sulla chiave creata → "Restrict key" → seleziona solo "Places API (New)".</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold" style={{ background: "rgba(59,130,246,0.2)", color: "#60a5fa" }}>5</span>
                        <span>Abilita la fatturazione (Billing) sul progetto Google Cloud — è necessario per attivare l'API. Google offre <b style={{ color: "#34d399" }}>$200 di credito gratuito/mese</b> ai nuovi utenti.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold" style={{ background: "rgba(16,185,129,0.2)", color: "#34d399" }}>6</span>
                        <span>Comunica la chiave API al <b>Super Admin Empire</b> che la configurerà nel backend come <code className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: "rgba(124,58,237,0.15)", color: "#c4b5fd" }}>GOOGLE_PLACES_API_KEY</code>.</span>
                      </li>
                    </ol>
                    <div className="rounded-lg p-2.5 mt-2" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                      <p className="text-[9px] font-semibold" style={{ color: "#34d399" }}>
                        💡 Costi: ~$17 per 1.000 ricerche (Text Search). Con $200/mese di credito gratuito Google = ~11.700 ricerche gratis/mese.
                      </p>
                    </div>
                    <div className="rounded-lg p-2.5" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
                      <div className="flex items-center gap-2">
                        <Info className="w-3 h-3 shrink-0" style={{ color: "#a78bfa" }} />
                        <p className="text-[9px]" style={{ color: "#c4b5fd" }}>
                          Senza questa chiave il sistema funziona comunque con dati OpenStreetMap (gratuiti). Google Places aggiunge: numero di telefono, rating, recensioni, sito web e stato dell'attività.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        {hasGoogleKey === true && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
            <CheckCircle className="w-3.5 h-3.5" style={{ color: "#34d399" }} />
            <span className="text-[10px] font-semibold" style={{ color: "#34d399" }}>Google Places API attiva — risultati premium con dati di contatto reali</span>
          </div>
        )}
      </div>

      {/* ═══════ RESULTS ═══════ */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>
                {results.length} lead reali trovati {city && `a ${city}`}
              </p>
              {selected && (
                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                  ✓ Lead selezionato
                </span>
              )}
            </div>

            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
              {results.map((lead, i) => {
                const isSelected = selected?.name === lead.name && selected?.full_address === lead.full_address;
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(lead)}
                    className="w-full text-left p-3.5 rounded-xl transition-all flex items-start gap-3"
                    style={{
                      background: isSelected ? "rgba(20,184,166,0.12)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? "rgba(20,184,166,0.4)" : "rgba(255,255,255,0.06)"}`,
                    }}>
                    {/* Number */}
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                      style={{ background: isSelected ? "rgba(20,184,166,0.2)" : "rgba(255,255,255,0.05)", color: isSelected ? "#14b8a6" : "#6b7280" }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-bold text-white truncate">{lead.name}</p>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full shrink-0" style={{
                          background: lead.source === "google_places" ? "rgba(66,133,244,0.15)" : "rgba(167,139,250,0.12)",
                          color: lead.source === "google_places" ? "#93bbfc" : "#c4b5fd",
                        }}>
                          {lead.source === "google_places" ? "Google" : "OSM"}
                        </span>
                        {lead.google_rating > 0 && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                            ⭐ {lead.google_rating} ({lead.google_reviews})
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "rgba(16,185,129,0.2)", color: "#34d399" }}>
                            ✓ Selezionato
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] truncate mt-0.5" style={{ color: "#9ca3af" }}>{lead.full_address || lead.city}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {lead.phone && <span className="text-[9px] flex items-center gap-1" style={{ color: "#34d399" }}><Phone className="w-2.5 h-2.5" />{lead.phone}</span>}
                        {lead.website && <span className="text-[9px] flex items-center gap-1" style={{ color: "#60a5fa" }}><Globe className="w-2.5 h-2.5" />Sito</span>}
                        {lead.instagram && <span className="text-[9px] flex items-center gap-1" style={{ color: "#E4405F" }}><Instagram className="w-2.5 h-2.5" />{lead.instagram}</span>}
                        {lead.email && <span className="text-[9px] flex items-center gap-1" style={{ color: "#818cf8" }}><Mail className="w-2.5 h-2.5" />{lead.email}</span>}
                      </div>
                    </div>
                    {/* Auto-sector badge */}
                    {isSelected && detectedSector && sectorConfig && (
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: "rgba(124,58,237,0.15)" }}>
                          {sectorConfig.emoji}
                        </div>
                        <span className="text-[7px] font-bold uppercase" style={{ color: "#a78bfa" }}>Auto</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ PIPELINE: Selected Lead → Preview + Message ═══════ */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Selected Lead Summary */}
            <div className="p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.06))", border: "1px solid rgba(124,58,237,0.2)" }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.15))" }}>
                    <Building2 className="w-5 h-5" style={{ color: "#a78bfa" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{selected.name}</p>
                    <p className="text-[10px]" style={{ color: "#9ca3af" }}>{selected.full_address || selected.city}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {detectedSector && sectorConfig && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(124,58,237,0.15)", color: "#c4b5fd" }}>
                          {sectorConfig.emoji} {sectorConfig.label}
                        </span>
                      )}
                      {selected.google_rating > 0 && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
                          ⭐ {selected.google_rating}
                        </span>
                      )}
                      <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.12)", color: "#34d399" }}>
                        ✓ Analizzato
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => { setSelected(null); setGeneratedMessage(null); setDetectedSector(null); setShowPreview(false); }}
                  className="p-1.5 rounded-lg shrink-0" style={{ background: "rgba(239,68,68,0.1)" }}>
                  <XIcon className="w-3.5 h-3.5" style={{ color: "#f87171" }} />
                </button>
              </div>

              {/* Contact quick links */}
              <div className="flex gap-2 mt-3 flex-wrap">
                {selected.phone && (
                  <a href={`https://wa.me/${selected.phone.replace(/\s+/g, "").replace("+", "")}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold"
                    style={{ background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.3)", color: "#25D366" }}>
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </a>
                )}
                {selected.website && (
                  <a href={selected.website.startsWith("http") ? selected.website : `https://${selected.website}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold"
                    style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa" }}>
                    <Globe className="w-3 h-3" /> Sito Web
                  </a>
                )}
                {selected.instagram && (
                  <a href={`https://instagram.com/${selected.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold"
                    style={{ background: "rgba(228,64,95,0.12)", border: "1px solid rgba(228,64,95,0.3)", color: "#E4405F" }}>
                    <Instagram className="w-3 h-3" /> Instagram
                  </a>
                )}
                {selected.google_maps_url && (
                  <a href={selected.google_maps_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold"
                    style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24" }}>
                    <Map className="w-3 h-3" /> Maps
                  </a>
                )}
              </div>
            </div>

            {/* ── Sector Preview Cards ── */}
            {detectedSector && previewScreens.length > 0 && (
              <div className="p-4 rounded-2xl space-y-3" style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.12)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: "#a78bfa" }} />
                    <span className="text-xs font-bold text-white">📱 Preview per {selected.name}</span>
                  </div>
                  <button onClick={() => setShowPreview(!showPreview)} className="text-[9px] font-semibold flex items-center gap-1" style={{ color: "#a78bfa" }}>
                    {showPreview ? "Nascondi" : "Mostra"} <ChevronDown className={`w-3 h-3 transition-transform ${showPreview ? "rotate-180" : ""}`} />
                  </button>
                </div>
                <AnimatePresence>
                  {showPreview && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {previewScreens.map((screen, i) => (
                          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                            className="rounded-xl overflow-hidden aspect-[9/16] relative group"
                            style={{ border: "1px solid rgba(167,139,250,0.2)" }}>
                            <img src={screen} alt={`Preview ${i + 1}`} className="w-full h-full object-cover object-top" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                              <span className="text-[9px] font-bold text-white">Schermata {i + 1}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {/* Demo link */}
                      <div className="flex items-center gap-2 mt-3">
                        <a href={getDemoSiteUrl(selectedProject || detectedSector)} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold"
                          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(16,185,129,0.15))", border: "1px solid rgba(124,58,237,0.3)", color: "#c4b5fd" }}>
                          <ExternalLink className="w-3 h-3" /> Apri Demo Live
                        </a>
                        <button onClick={() => {
                          const url = `${window.location.origin}${getDemoSiteUrl(selectedProject || detectedSector!)}`;
                          navigator.clipboard.writeText(url);
                          toast({ title: "✅ Link demo copiato!" });
                        }} className="px-4 py-2.5 rounded-xl text-[10px] font-bold"
                          style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── Generated Message ── */}
            <div className="p-4 rounded-2xl space-y-3" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(59,130,246,0.04))", border: "1px solid rgba(16,185,129,0.15)" }}>
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" style={{ color: "#34d399" }} />
                <span className="text-xs font-bold text-white">Messaggio Personalizzato AI</span>
                {generatingMsg && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "#34d399" }} />}
              </div>

              {/* Channel selector — auto-regenerates message */}
              <div className="flex gap-1.5">
                {([
                  { id: "whatsapp" as const, icon: MessageCircle, label: "WhatsApp", color: "#25D366" },
                  { id: "instagram" as const, icon: Instagram, label: "Instagram DM", color: "#E4405F" },
                  { id: "email" as const, icon: Mail, label: "Email Pro", color: "#3B82F6" },
                ] as const).map(ch => (
                  <button key={ch.id} onClick={() => {
                    if (activeChannel !== ch.id) {
                      setActiveChannel(ch.id);
                      if (selected && !generatingMsg) {
                        handleSelect(selected, ch.id);
                      }
                    }
                  }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                    style={{
                      background: activeChannel === ch.id ? `${ch.color}20` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${activeChannel === ch.id ? `${ch.color}50` : "rgba(255,255,255,0.06)"}`,
                      color: activeChannel === ch.id ? ch.color : "#9ca3af",
                    }}>
                    <ch.icon className="w-3 h-3" />
                    {ch.label}
                  </button>
                ))}
              </div>
              <p className="text-[9px]" style={{ color: "#6b7280" }}>
                {activeChannel === "whatsapp" && "💬 Formato WhatsApp: breve, con *grassetto* e emoji strategici"}
                {activeChannel === "instagram" && "📷 Formato DM: ultra-breve, conversazionale, riferimento a contenuti"}
                {activeChannel === "email" && "📧 Formato Email: strutturato con oggetto, AIDA, firma professionale"}
              </p>

              {generatedMessage ? (
                <>
                  <div className="text-xs leading-relaxed whitespace-pre-line p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#d1d5db" }}>
                    {generatedMessage}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <motion.button whileTap={{ scale: 0.97 }} onClick={copyMessage}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold"
                      style={{ background: "#7c3aed", color: "#fff" }}>
                      <Copy className="w-4 h-4" /> Copia Messaggio
                    </motion.button>
                    {activeChannel === "whatsapp" && selected.phone && (
                      <motion.a whileTap={{ scale: 0.97 }}
                        href={`https://wa.me/${selected.phone.replace(/\s+/g, "").replace("+", "")}?text=${encodeURIComponent(generatedMessage)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
                        style={{ background: "#25D366", color: "#fff" }}>
                        <Send className="w-4 h-4" /> Invia WhatsApp
                      </motion.a>
                    )}
                    {activeChannel === "instagram" && selected.instagram && (
                      <motion.a whileTap={{ scale: 0.97 }}
                        href={`https://instagram.com/${selected.instagram.replace("@", "")}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
                        style={{ background: "linear-gradient(135deg, #833AB4, #E4405F)", color: "#fff" }}>
                        <Instagram className="w-4 h-4" /> Apri Instagram
                      </motion.a>
                    )}
                    {activeChannel === "email" && selected.email && (
                      <motion.a whileTap={{ scale: 0.97 }}
                        href={`mailto:${selected.email}?body=${encodeURIComponent(generatedMessage)}`}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
                        style={{ background: "#3B82F6", color: "#fff" }}>
                        <Mail className="w-4 h-4" /> Componi Email
                      </motion.a>
                    )}
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleSelect(selected)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-semibold"
                      style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fbbf24" }}>
                      <RefreshCw className="w-3 h-3" /> Rigenera
                    </motion.button>
                  </div>
                </>
              ) : generatingMsg ? (
                <div className="flex items-center justify-center gap-3 py-6">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#34d399" }} />
                  <span className="text-xs" style={{ color: "#9ca3af" }}>Generazione messaggio personalizzato per {selected.name}...</span>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {results.length === 0 && !loading && (
        <div className="text-center py-8 px-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(20,184,166,0.1)" }}>
            <Target className="w-6 h-6" style={{ color: "#14b8a6" }} />
          </div>
          <p className="text-sm font-bold text-white mb-1">Trova i tuoi prossimi clienti</p>
          <p className="text-[11px] max-w-sm mx-auto" style={{ color: "#6b7280" }}>
            Inserisci una città e settore, poi clicca Cerca. Il sistema troverà automaticamente attività reali, 
            analizzerà il settore, mostrerà le preview adatte e genererà un messaggio personalizzato.
          </p>
        </div>
      )}
    </div>
  );
}
