import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Crosshair, Loader2, Radar, X, Navigation } from "lucide-react";
import { toast } from "sonner";

export interface GpsLocation {
  lat: number;
  lon: number;
  label: string; // city or address
  source: "browser" | "address" | "manual";
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSearch: (loc: GpsLocation, radiusKm: number) => void;
  loading?: boolean;
}

const RADIUS_PRESETS = [0.5, 1, 2, 5, 10, 25, 50];
const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
};

export default function GpsRadarPanel({ open, onClose, onSearch, loading }: Props) {
  const RADIUS_STORAGE_KEY = "empire:gps-radar:radius-km";
  const [mode, setMode] = useState<"browser" | "address">("browser");
  const [coords, setCoords] = useState<GpsLocation | null>(null);
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    const saved = parseFloat(localStorage.getItem(RADIUS_STORAGE_KEY) || "");
    return Number.isFinite(saved) && saved >= 0.5 && saved <= 50 ? saved : 2;
  });
  const [geoLoading, setGeoLoading] = useState(false);
  const [geocodeLoading, setGeocodeLoading] = useState(false);

  // Persist radius preference for next access
  useEffect(() => {
    try {
      localStorage.setItem(RADIUS_STORAGE_KEY, String(radius));
    } catch {}
  }, [radius]);

  // Auto-request browser GPS when opening in browser mode
  useEffect(() => {
    if (open && mode === "browser" && !coords) requestBrowserGps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode]);

  const requestBrowserGps = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocalizzazione non supportata dal browser");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Reverse geocode for friendly label
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=14`,
            { headers: { "Accept-Language": "it" } }
          );
          const data = await r.json();
          const a = data.address || {};
          const label =
            a.city || a.town || a.village || a.suburb || a.county || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setCoords({ lat: latitude, lon: longitude, label, source: "browser" });
        } catch {
          setCoords({ lat: latitude, lon: longitude, label: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, source: "browser" });
        }
        setGeoLoading(false);
        toast.success("Posizione rilevata");
      },
      (err) => {
        setGeoLoading(false);
        toast.error(err.code === err.PERMISSION_DENIED ? "Permesso GPS negato" : "Impossibile ottenere la posizione");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const geocodeAddress = useCallback(async () => {
    if (!address.trim()) {
      toast.error("Inserisci un indirizzo");
      return;
    }
    setGeocodeLoading(true);
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
        { headers: { "Accept-Language": "it" } }
      );
      const data = await r.json();
      if (!data.length) {
        toast.error("Indirizzo non trovato");
        return;
      }
      setCoords({
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        label: data[0].display_name?.split(",").slice(0, 2).join(",") || address,
        source: "address",
      });
      toast.success("Indirizzo geolocalizzato");
    } catch {
      toast.error("Errore geocoding");
    } finally {
      setGeocodeLoading(false);
    }
  }, [address]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="overflow-hidden"
      >
        <div
          className="rounded-2xl p-4 space-y-3 relative"
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(20,184,166,0.04))",
            border: "1px solid rgba(6,182,212,0.25)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Radar className="w-4 h-4" style={{ color: "#06b6d4" }} />
              </motion.div>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#22d3ee" }}>
                Modalità GPS Radar
              </span>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-white/5">
              <X className="w-3.5 h-3.5" style={{ color: "#6b7280" }} />
            </button>
          </div>

          {/* Mode tabs */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "browser", label: "📍 Mia posizione", icon: Crosshair },
              { id: "address", label: "🏠 Indirizzo", icon: MapPin },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setMode(t.id as any)}
                className="py-2 rounded-lg text-[10px] font-bold transition-all"
                style={{
                  background:
                    mode === t.id
                      ? "linear-gradient(135deg, rgba(6,182,212,0.25), rgba(20,184,166,0.15))"
                      : "rgba(255,255,255,0.03)",
                  border: `1px solid ${mode === t.id ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.08)"}`,
                  color: mode === t.id ? "#22d3ee" : "#9ca3af",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Browser GPS */}
          {mode === "browser" && (
            <div className="space-y-2">
              {geoLoading ? (
                <div className="flex items-center gap-2 p-3 rounded-xl" style={inputStyle}>
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#06b6d4" }} />
                  <span className="text-[11px]" style={{ color: "#9ca3af" }}>Rilevamento posizione GPS…</span>
                </div>
              ) : coords ? (
                <div className="p-3 rounded-xl flex items-center justify-between" style={inputStyle}>
                  <div className="flex items-center gap-2 min-w-0">
                    <Navigation className="w-4 h-4 shrink-0" style={{ color: "#10b981" }} />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">{coords.label}</p>
                      <p className="text-[8px]" style={{ color: "#6b7280" }}>
                        {coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={requestBrowserGps}
                    className="text-[9px] font-bold px-2 py-1 rounded-lg"
                    style={{ background: "rgba(6,182,212,0.15)", color: "#22d3ee" }}
                  >
                    Aggiorna
                  </button>
                </div>
              ) : (
                <button
                  onClick={requestBrowserGps}
                  className="w-full py-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #14b8a6)", color: "#fff" }}
                >
                  <Crosshair className="w-4 h-4" /> Attiva GPS
                </button>
              )}
            </div>
          )}

          {/* Address */}
          {mode === "address" && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && geocodeAddress()}
                  placeholder="Es: Via Roma 1, Milano"
                  className="flex-1 px-3 py-2.5 rounded-xl text-[11px] text-white placeholder:text-gray-500 outline-none"
                  style={inputStyle}
                />
                <button
                  onClick={geocodeAddress}
                  disabled={geocodeLoading}
                  className="px-4 rounded-xl text-[10px] font-bold"
                  style={{ background: "linear-gradient(135deg, #06b6d4, #14b8a6)", color: "#fff" }}
                >
                  {geocodeLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Trova"}
                </button>
              </div>
              {coords && coords.source === "address" && (
                <div className="p-2 rounded-lg flex items-center gap-2" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
                  <MapPin className="w-3 h-3" style={{ color: "#10b981" }} />
                  <span className="text-[10px] font-bold text-white truncate">{coords.label}</span>
                </div>
              )}
            </div>
          )}

          {/* Radius slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#6b7280" }}>
                Raggio di ricerca
              </label>
              <span className="text-[12px] font-black" style={{ color: "#22d3ee" }}>
                {radius < 1 ? `${(radius * 1000).toFixed(0)} m` : `${radius} km`}
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex flex-wrap gap-1.5">
              {RADIUS_PRESETS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className="text-[9px] font-bold px-2 py-1 rounded-md transition-all"
                  style={{
                    background:
                      radius === r ? "rgba(6,182,212,0.25)" : "rgba(255,255,255,0.04)",
                    color: radius === r ? "#22d3ee" : "#9ca3af",
                    border: `1px solid ${radius === r ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  {r < 1 ? `${r * 1000}m` : `${r}km`}
                </button>
              ))}
            </div>
          </div>

          {/* Search button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={!coords || loading}
            onClick={() => coords && onSearch(coords, radius)}
            className="w-full py-3 rounded-xl text-[12px] font-black flex items-center justify-center gap-2 disabled:opacity-50"
            style={{
              background: coords ? "linear-gradient(135deg, #06b6d4, #14b8a6, #10b981)" : "rgba(255,255,255,0.05)",
              color: "#fff",
              boxShadow: coords ? "0 0 24px rgba(6,182,212,0.4)" : "none",
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radar className="w-4 h-4" />}
            {loading ? "Scansione in corso…" : `Scansiona ${coords?.label || "…"} (${radius < 1 ? `${radius * 1000}m` : `${radius}km`})`}
          </motion.button>

          <p className="text-[8px] text-center" style={{ color: "#6b7280" }}>
            🌍 Dati reali OpenStreetMap + Nominatim · 100% gratuiti, illimitati
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
