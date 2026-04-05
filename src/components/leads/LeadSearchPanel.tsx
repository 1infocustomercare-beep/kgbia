import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Star, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SECTOR_OPTIONS, CITY_OPTIONS } from "@/data/mock-leads-data";

interface SearchFilters {
  sector: string;
  city: string;
  minRating: number;
  minReviews: number;
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    onSearch({ sector, city, minRating, minReviews });
  };

  return (
    <div className="rounded-2xl p-5 space-y-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
          <Search className="w-4 h-4" style={{ color: "#10b981" }} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Ricerca Lead Intelligente</h3>
          <p className="text-[10px]" style={{ color: "#6b7280" }}>Trova attività pronte per la digitalizzazione</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: "#9ca3af" }}>Settore</label>
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs h-10">
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
          <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: "#9ca3af" }}>Città</label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs h-10">
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

      <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "#6b7280" }}>
        <Filter className="w-3 h-3" /> Filtri avanzati
        <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
      </button>

      {showAdvanced && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: "#9ca3af" }}>Rating min. Google</label>
            <Select value={String(minRating)} onValueChange={v => setMinRating(Number(v))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs h-10">
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
            <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: "#9ca3af" }}>Recensioni min.</label>
            <Select value={String(minReviews)} onValueChange={v => setMinReviews(Number(v))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs h-10">
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

      <Button onClick={handleSearch} disabled={loading} className="w-full text-xs font-bold h-11" style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}>
        {loading ? (
          <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Ricerca in corso...</span>
        ) : (
          <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Cerca Lead nella zona</span>
        )}
      </Button>
    </div>
  );
}
