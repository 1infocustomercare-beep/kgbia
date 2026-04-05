import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, ChevronDown, Sparkles, Key, ExternalLink, Globe, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SECTOR_OPTIONS, CITY_OPTIONS } from "@/data/mock-leads-data";

export interface SearchFilters {
  sector: string;
  city: string;
  minRating: number;
  minReviews: number;
  freeText: string;
}

interface Props {
  onSearch: (filters: SearchFilters) => void;
  loading: boolean;
}

export default function LeadSearchPanel({ onSearch, loading }: Props) {
  const [sector, setSector] = useState("food");
  const [city, setCity] = useState("Roma");
  const [minRating, setMinRating] = useState(0);
  const [minReviews, setMinReviews] = useState(0);
  const [freeText, setFreeText] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showApiGuide, setShowApiGuide] = useState(false);

  const handleSearch = () => {
    onSearch({ sector, city, minRating, minReviews, freeText });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="space-y-3">
      {/* Main Search Bar */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(59,130,246,0.06))", border: "1px solid rgba(16,185,129,0.15)" }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
            <Search className="w-4 h-4" style={{ color: "#10b981" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "#e5e7eb" }}>Ricerca Lead Intelligente</h3>
            <p className="text-[10px]" style={{ color: "#9ca3af" }}>Cerca per settore, città, nome o keyword</p>
          </div>
        </div>

        {/* Free text search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b7280" }} />
          <Input
            value={freeText}
            onChange={e => setFreeText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Es: "pizzeria Trastevere", "parrucchiere Navigli", "dentista Bologna"...'
            className="pl-10 h-11 text-sm bg-black/30 border-white/10 text-white placeholder:text-white/30"
          />
        </div>

        {/* Sector + City */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] font-bold uppercase tracking-wider mb-1 block" style={{ color: "#9ca3af" }}>Settore</label>
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
            <label className="text-[9px] font-bold uppercase tracking-wider mb-1 block" style={{ color: "#9ca3af" }}>Città</label>
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

        {/* Advanced Filters Toggle */}
        <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "#9ca3af" }}>
          <Filter className="w-3 h-3" /> Filtri avanzati
          <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
        </button>

        {showAdvanced && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider mb-1 block" style={{ color: "#9ca3af" }}>Rating min.</label>
              <Select value={String(minRating)} onValueChange={v => setMinRating(Number(v))}>
                <SelectTrigger className="bg-black/30 border-white/10 text-white text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Tutti</SelectItem>
                  <SelectItem value="2">2+ ⭐</SelectItem>
                  <SelectItem value="3">3+ ⭐</SelectItem>
                  <SelectItem value="4">4+ ⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider mb-1 block" style={{ color: "#9ca3af" }}>Recensioni min.</label>
              <Select value={String(minReviews)} onValueChange={v => setMinReviews(Number(v))}>
                <SelectTrigger className="bg-black/30 border-white/10 text-white text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
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

        {/* Search Button */}
        <Button onClick={handleSearch} disabled={loading} className="w-full text-xs font-bold h-11 text-white border-0" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
          {loading ? (
            <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Scansione in corso...</span>
          ) : (
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Cerca Lead</span>
          )}
        </Button>
      </div>

      {/* API Guide Section */}
      <button onClick={() => setShowApiGuide(!showApiGuide)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-semibold transition-all"
        style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)", color: "#fbbf24" }}>
        <span className="flex items-center gap-2">
          <Key className="w-3.5 h-3.5" />
          🔌 Attiva Ricerca Reale (API Google, Firecrawl)
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showApiGuide ? "rotate-180" : ""}`} />
      </button>

      {showApiGuide && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-2xl p-4 space-y-4" style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.1)" }}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: "#fbbf24" }} />
            <h4 className="text-xs font-bold" style={{ color: "#e5e7eb" }}>Come attivare la ricerca su dati reali</h4>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: "#d1d5db" }}>
            Attualmente la ricerca usa dati simulati. Per trovare lead <strong>reali</strong> da Google Maps, siti web e social, devi configurare una o più API:
          </p>

          {/* Google Places API */}
          <div className="p-3 rounded-xl space-y-2" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)" }}>
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4" style={{ color: "#3b82f6" }} />
              <span className="text-[11px] font-bold" style={{ color: "#93c5fd" }}>Google Places API (consigliata)</span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: "#9ca3af" }}>
              Trova attività reali da Google Maps con nome, indirizzo, telefono, rating, recensioni e sito web.
            </p>
            <div className="space-y-1.5 text-[10px]" style={{ color: "#d1d5db" }}>
              <p><strong>1.</strong> Vai su <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#60a5fa" }}>console.cloud.google.com</a></p>
              <p><strong>2.</strong> Crea un progetto → Abilita <strong>"Places API"</strong> e <strong>"Places API (New)"</strong></p>
              <p><strong>3.</strong> Vai su <strong>Credenziali → Crea API Key</strong></p>
              <p><strong>4.</strong> Restrizioni consigliate: limita a Places API + HTTP referrer del tuo dominio</p>
              <p><strong>5.</strong> Costo: ~$17 per 1.000 ricerche (free tier: $200/mese)</p>
              <p><strong>6.</strong> Inserisci la chiave nella sezione <strong>Impostazioni → Connessioni</strong> del Super Admin</p>
            </div>
            <a href="https://developers.google.com/maps/documentation/places/web-service/overview" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-semibold mt-1" style={{ color: "#60a5fa" }}>
              <ExternalLink className="w-3 h-3" /> Documentazione ufficiale
            </a>
          </div>

          {/* Firecrawl */}
          <div className="p-3 rounded-xl space-y-2" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.1)" }}>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" style={{ color: "#ef4444" }} />
              <span className="text-[11px] font-bold" style={{ color: "#fca5a5" }}>Firecrawl (analisi siti web)</span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: "#9ca3af" }}>
              Analizza automaticamente i siti web dei lead per estrarre stato digitale, branding, tecnologie usate e opportunità.
            </p>
            <div className="space-y-1.5 text-[10px]" style={{ color: "#d1d5db" }}>
              <p><strong>1.</strong> Vai su <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#f87171" }}>firecrawl.dev</a></p>
              <p><strong>2.</strong> Registra un account → Copia la <strong>API Key</strong></p>
              <p><strong>3.</strong> Costo: 500 crediti gratuiti, poi da $19/mese</p>
              <p><strong>4.</strong> Connetti tramite <strong>Impostazioni → Connessioni → Firecrawl</strong></p>
            </div>
            <a href="https://docs.firecrawl.dev" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-semibold mt-1" style={{ color: "#f87171" }}>
              <ExternalLink className="w-3 h-3" /> Documentazione Firecrawl
            </a>
          </div>

          {/* SerpAPI / Custom */}
          <div className="p-3 rounded-xl space-y-2" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)" }}>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" style={{ color: "#10b981" }} />
              <span className="text-[11px] font-bold" style={{ color: "#6ee7b7" }}>SerpAPI / Outscraper (ricerca avanzata)</span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: "#9ca3af" }}>
              Per ricerche massive e scraping Google Maps con email, social e dati avanzati. Ideale per campagne su larga scala.
            </p>
            <div className="space-y-1.5 text-[10px]" style={{ color: "#d1d5db" }}>
              <p>• <a href="https://serpapi.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#34d399" }}>SerpAPI</a> — $50/mese per 5.000 ricerche Google Maps</p>
              <p>• <a href="https://outscraper.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#34d399" }}>Outscraper</a> — da $2 per 1.000 risultati con email/telefono</p>
              <p>• <a href="https://apify.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#34d399" }}>Apify</a> — Scraper Google Maps personalizzabile, $49/mese</p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[10px]" style={{ color: "#9ca3af" }}>
              ⚡ <strong style={{ color: "#e5e7eb" }}>Senza API</strong>: la ricerca genera dati simulati ultra-realistici per testing e demo. Perfetti per provare il flusso completo.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
