import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, MapPin, ChevronDown, Sparkles, Key, ExternalLink, Globe, Map, Layers, Hash, Link, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SECTOR_OPTIONS, CITY_OPTIONS } from "@/data/mock-leads-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type SearchMode = "zone" | "keyword" | "sector" | "maps_url" | "website";

export interface SearchFilters {
  sector: string;
  city: string;
  minRating: number;
  minReviews: number;
  freeText: string;
  mode: SearchMode;
  useReal: boolean;
}

interface Props {
  onSearch: (filters: SearchFilters) => void;
  onRealResults?: (results: any[]) => void;
  loading: boolean;
}

const SEARCH_MODES: { id: SearchMode; label: string; icon: typeof MapPin; desc: string }[] = [
  { id: "zone", icon: MapPin, label: "Zona / Città", desc: "Cerca per area geografica" },
  { id: "sector", icon: Layers, label: "Settore", desc: "Filtra per categoria" },
  { id: "keyword", icon: Hash, label: "Parola Chiave", desc: "Ricerca libera testuale" },
  { id: "maps_url", icon: Map, label: "Google Maps URL", desc: "Incolla link Google Maps" },
  { id: "website", icon: Link, label: "Sito Web", desc: "Analizza un sito specifico" },
];

export default function LeadSearchPanel({ onSearch, onRealResults, loading }: Props) {
  const [sector, setSector] = useState("food");
  const [city, setCity] = useState("Roma");
  const [minRating, setMinRating] = useState(0);
  const [minReviews, setMinReviews] = useState(0);
  const [freeText, setFreeText] = useState("");
  const [mode, setMode] = useState<SearchMode>("zone");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [useReal, setUseReal] = useState(true);
  const [apiStatus, setApiStatus] = useState<{ nominatim: "unknown" | "ok" | "error"; google: "unknown" | "ok" | "error" | "no_key" }>({ nominatim: "unknown", google: "unknown" });
  const [testingApi, setTestingApi] = useState(false);

  const handleSearch = async () => {
    // Try real search first
    if (useReal && (mode === "zone" || mode === "keyword" || mode === "sector")) {
      try {
        const { data, error } = await supabase.functions.invoke("lead-search", {
          body: { query: freeText, city, sector, mode, use_google: true },
        });
        if (!error && data?.success && data.results?.length > 0) {
          onRealResults?.(data.results);
          toast.success(`${data.results.length} lead reali trovati`, {
            description: `Nominatim: ${data.sources?.nominatim || 0}, Google: ${data.sources?.google || 0}`,
          });
          setApiStatus(prev => ({ ...prev, nominatim: "ok", google: data.has_google_key ? "ok" : "no_key" }));
          return;
        }
      } catch (e) {
        console.warn("Real search failed, falling back to mock:", e);
      }
    }

    // Fallback to mock
    onSearch({ sector, city, minRating, minReviews, freeText, mode, useReal: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const testConnection = async () => {
    setTestingApi(true);
    try {
      const { data, error } = await supabase.functions.invoke("lead-search", {
        body: { query: "test", city: "Roma", sector: "food", mode: "zone", use_google: true },
      });
      if (error) throw error;
      setApiStatus({
        nominatim: data?.sources?.nominatim > 0 ? "ok" : "error",
        google: data?.has_google_key ? (data?.sources?.google > 0 ? "ok" : "error") : "no_key",
      });
      toast.success("Test connessione completato!");
    } catch (e) {
      setApiStatus({ nominatim: "error", google: "error" });
      toast.error("Errore nel test connessione");
    } finally {
      setTestingApi(false);
    }
  };

  const StatusDot = ({ status }: { status: string }) => {
    if (status === "ok") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    if (status === "error") return <XCircle className="w-3.5 h-3.5 text-red-400" />;
    if (status === "no_key") return <div className="w-3.5 h-3.5 rounded-full bg-amber-400/50 border border-amber-400" />;
    return <div className="w-3.5 h-3.5 rounded-full bg-white/10 border border-white/20" />;
  };

  const getPlaceholder = () => {
    switch (mode) {
      case "zone": return 'Es: "Trastevere", "Navigli", "Centro Storico"...';
      case "keyword": return 'Es: "pizzeria artigianale", "dentista bambini"...';
      case "sector": return "Cerca per nome o tipo di attività...";
      case "maps_url": return "Incolla URL di Google Maps...";
      case "website": return "https://www.esempio.it";
    }
  };

  return (
    <div className="space-y-3">
      {/* Search Mode Selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {SEARCH_MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-semibold whitespace-nowrap transition-all flex-shrink-0"
            style={{
              background: mode === m.id ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${mode === m.id ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"}`,
              color: mode === m.id ? "#34d399" : "#9ca3af",
            }}
          >
            <m.icon className="w-3 h-3" />
            {m.label}
          </button>
        ))}
      </div>

      {/* Main Search Card */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(59,130,246,0.06))", border: "1px solid rgba(16,185,129,0.15)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
              <Search className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ricerca Lead Intelligente</h3>
              <p className="text-[10px] text-gray-400">
                {mode === "zone" ? "Per zona geografica" : mode === "keyword" ? "Per parola chiave" : mode === "sector" ? "Per settore" : mode === "maps_url" ? "Da Google Maps" : "Da sito web"}
                {" · "}
                <span className={useReal ? "text-emerald-400" : "text-amber-400"}>
                  {useReal ? "🟢 Dati reali" : "🟡 Dati simulati"}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setUseReal(!useReal)}
            className="px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all"
            style={{
              background: useReal ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
              border: `1px solid ${useReal ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
              color: useReal ? "#34d399" : "#fbbf24",
            }}
          >
            {useReal ? "LIVE" : "MOCK"}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            value={freeText}
            onChange={e => setFreeText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className="pl-10 h-11 text-sm bg-black/30 border-white/10 text-white placeholder:text-white/30"
          />
        </div>

        {/* Sector + City (visible for zone/sector/keyword modes) */}
        {(mode === "zone" || mode === "sector" || mode === "keyword") && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider mb-1 block text-gray-400">Settore</label>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger className="bg-black/30 border-white/10 text-white text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTOR_OPTIONS.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider mb-1 block text-gray-400">Città</label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="bg-black/30 border-white/10 text-white text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CITY_OPTIONS.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Advanced Filters */}
        <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1 text-[10px] font-semibold text-gray-400">
          <Filter className="w-3 h-3" /> Filtri avanzati
          <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-2 gap-2 overflow-hidden">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider mb-1 block text-gray-400">Rating min.</label>
                <Select value={String(minRating)} onValueChange={v => setMinRating(Number(v))}>
                  <SelectTrigger className="bg-black/30 border-white/10 text-white text-xs h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Tutti</SelectItem>
                    <SelectItem value="2">2+ ⭐</SelectItem>
                    <SelectItem value="3">3+ ⭐</SelectItem>
                    <SelectItem value="4">4+ ⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase tracking-wider mb-1 block text-gray-400">Recensioni min.</label>
                <Select value={String(minReviews)} onValueChange={v => setMinReviews(Number(v))}>
                  <SelectTrigger className="bg-black/30 border-white/10 text-white text-xs h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Tutte</SelectItem>
                    <SelectItem value="10">10+</SelectItem>
                    <SelectItem value="50">50+</SelectItem>
                    <SelectItem value="100">100+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Button */}
        <Button onClick={handleSearch} disabled={loading} className="w-full text-xs font-bold h-11 text-white border-0" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
          {loading ? (
            <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Scansione in corso...</span>
          ) : (
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Cerca Lead {useReal ? "(Live)" : "(Mock)"}</span>
          )}
        </Button>
      </div>

      {/* API Configuration Panel */}
      <button onClick={() => setShowApiConfig(!showApiConfig)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-semibold transition-all"
        style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.12)", color: "#c4b5fd" }}>
        <span className="flex items-center gap-2">
          <Key className="w-3.5 h-3.5" />
          ⚙️ Configurazione API & Fonti Dati
        </span>
        <div className="flex items-center gap-1.5">
          <StatusDot status={apiStatus.nominatim} />
          <StatusDot status={apiStatus.google} />
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showApiConfig ? "rotate-180" : ""}`} />
        </div>
      </button>

      <AnimatePresence>
        {showApiConfig && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="rounded-2xl p-4 space-y-4 overflow-hidden" style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.1)" }}>
            
            {/* Test Connection Button */}
            <Button onClick={testConnection} disabled={testingApi} variant="outline" className="w-full text-xs h-9 border-violet-500/20 text-violet-300 hover:bg-violet-500/10">
              {testingApi ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Sparkles className="w-3.5 h-3.5 mr-2" />}
              Testa Connessioni
            </Button>

            {/* Nominatim — FREE */}
            <div className="p-3 rounded-xl space-y-2" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-bold text-emerald-300">OpenStreetMap / Nominatim</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusDot status={apiStatus.nominatim} />
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-emerald-500/20 text-emerald-400">GRATIS</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400">Cerca attività reali da OpenStreetMap. Nessun account o API key necessari. Dati community-driven con copertura globale.</p>
              <div className="flex items-center gap-1.5 text-[9px] text-gray-500">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Attivo automaticamente — nessuna configurazione
              </div>
            </div>

            {/* Google Places — PREMIUM */}
            <div className="p-3 rounded-xl space-y-2" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-blue-400" />
                  <span className="text-[11px] font-bold text-blue-300">Google Places API</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusDot status={apiStatus.google} />
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-500/20 text-blue-400">PREMIUM</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400">Rating, recensioni, telefoni e siti web reali da Google Maps. Free tier: $200/mese (~11.000 ricerche).</p>
              <div className="space-y-1.5 text-[10px] text-gray-300">
                <p><strong>1.</strong> <a href="https://console.cloud.google.com/apis/library/places-backend.googleapis.com" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">Abilita Places API (New)</a></p>
                <p><strong>2.</strong> <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">Crea API Key</a></p>
                <p><strong>3.</strong> Aggiungi come secret <code className="px-1 py-0.5 rounded bg-white/5 text-blue-300 text-[9px]">GOOGLE_PLACES_API_KEY</code> nelle impostazioni</p>
              </div>
              {apiStatus.google === "no_key" && (
                <p className="text-[9px] text-amber-400 flex items-center gap-1"><Key className="w-3 h-3" /> Chiave API non configurata — usando solo Nominatim</p>
              )}
            </div>

            {/* Firecrawl — ANALYSIS */}
            <div className="p-3 rounded-xl space-y-2" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.1)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-red-400" />
                  <span className="text-[11px] font-bold text-red-300">Firecrawl</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-red-500/20 text-red-400">ANALISI</span>
              </div>
              <p className="text-[10px] text-gray-400">Analizza siti web dei lead: branding, tecnologie, stato digitale. 500 crediti gratis, poi da $19/mese.</p>
              <p className="text-[10px] text-gray-300">
                <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="underline text-red-400">Registrati su Firecrawl</a> → Connetti da <strong>Impostazioni → Connessioni</strong>
              </p>
            </div>

            <div className="p-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[10px] text-gray-400">
                💡 <strong className="text-gray-300">Default gratuito</strong>: Nominatim è sempre attivo. Google Places migliora la qualità dei dati. Firecrawl aggiunge analisi approfondita dei siti.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
