// ══════════════════════════════════════════════════════════════
// AutopilotSectorPausePanel — Pausa rapida settori
// Permette di mettere in pausa o riattivare un settore senza
// fermare l'intero autopilot. Mostra anche i settori esclusi
// in modo permanente (da Priority Rules).
// ══════════════════════════════════════════════════════════════
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  PauseCircle,
  PlayCircle,
  Plus,
  Ban,
  Loader2,
  Layers,
  X,
} from "lucide-react";
import {
  useAutopilotConfig,
  useToggleSectorPause,
} from "@/hooks/useAutopilot";
import { toast } from "sonner";

// Settori suggeriti — coerenti con il resto della piattaforma
const SUGGESTED_SECTORS = [
  "Ristorazione",
  "Beauty",
  "Wellness",
  "Retail",
  "Fitness",
  "Hotel",
  "B&B",
  "NCC",
  "Stabilimento",
  "Studio Legale",
  "Studio Medico",
  "Immobiliare",
  "Edilizia",
  "Auto",
];

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export default function AutopilotSectorPausePanel() {
  const { data: cfg, isLoading } = useAutopilotConfig();
  const toggle = useToggleSectorPause();
  const [input, setInput] = useState("");

  const c = (cfg as any) || {};
  const pausedSectors: string[] = useMemo(
    () => (Array.isArray(c.paused_sectors) ? c.paused_sectors : []),
    [c.paused_sectors],
  );
  const excludedSectors: string[] = useMemo(
    () =>
      Array.isArray(c.priority_rules?.excluded_sectors)
        ? c.priority_rules.excluded_sectors
        : [],
    [c.priority_rules],
  );
  const targetSectors: string[] = useMemo(
    () => (Array.isArray(c.target_sectors) ? c.target_sectors : []),
    [c.target_sectors],
  );

  const pausedSet = useMemo(
    () => new Set(pausedSectors.map(normalize)),
    [pausedSectors],
  );
  const excludedSet = useMemo(
    () => new Set(excludedSectors.map(normalize)),
    [excludedSectors],
  );

  // Settori "azionabili" = target + suggeriti, escludendo i bloccati permanentemente
  const actionableSectors = useMemo(() => {
    const base = new Set<string>([...targetSectors, ...SUGGESTED_SECTORS]);
    return Array.from(base).filter((s) => !excludedSet.has(normalize(s)));
  }, [targetSectors, excludedSet]);

  const handleToggle = async (sector: string) => {
    try {
      const res = await toggle.mutateAsync(sector);
      if (!res?.success) {
        toast.error("Impossibile aggiornare", {
          description: res?.error || "errore sconosciuto",
        });
        return;
      }
      toast.success(
        res.is_paused
          ? `Settore "${sector}" messo in pausa`
          : `Settore "${sector}" riattivato`,
      );
    } catch (e: any) {
      toast.error("Errore", { description: e?.message });
    }
  };

  const handleAddCustom = async () => {
    const value = input.trim();
    if (!value) return;
    setInput("");
    if (excludedSet.has(normalize(value))) {
      toast.warning("Settore già escluso permanentemente", {
        description: "Rimuovilo da Regole di Priorità per gestirlo qui.",
      });
      return;
    }
    if (pausedSet.has(normalize(value))) {
      toast.info("Settore già in pausa");
      return;
    }
    await handleToggle(value);
  };

  if (isLoading) {
    return (
      <div className="partner-card rounded-2xl p-5 flex items-center justify-center min-h-[160px]">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="partner-card rounded-2xl p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Pausa settori
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Sospendi categorie senza fermare l'intero autopilot
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {pausedSectors.length > 0 && (
            <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {pausedSectors.length} in pausa
            </span>
          )}
          {excludedSectors.length > 0 && (
            <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
              {excludedSectors.length} esclusi
            </span>
          )}
        </div>
      </div>

      {/* Settori in pausa attiva */}
      {pausedSectors.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">
            In pausa adesso
          </p>
          <div className="flex flex-wrap gap-1.5">
            {pausedSectors.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleToggle(s)}
                disabled={toggle.isPending}
                className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[11px] font-semibold hover:bg-amber-500/20 transition disabled:opacity-50"
                title="Click per riattivare"
              >
                <PauseCircle className="w-3 h-3" />
                {s}
                <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settori esclusi (read-only, gestiti da priority rules) */}
      {excludedSectors.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">
            Esclusi permanentemente (Regole Priorità)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {excludedSectors.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-destructive/5 text-destructive border border-destructive/20 text-[11px] font-semibold"
              >
                <Ban className="w-3 h-3" />
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Toggle rapido settori */}
      <div>
        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">
          Toggle rapido
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
          {actionableSectors.map((s) => {
            const isPaused = pausedSet.has(normalize(s));
            return (
              <button
                key={s}
                type="button"
                onClick={() => handleToggle(s)}
                disabled={toggle.isPending}
                className={`p-2 rounded-lg border flex items-center justify-between gap-1.5 text-[11px] font-semibold transition ${
                  isPaused
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                } hover:opacity-80 disabled:opacity-50`}
              >
                <span className="truncate">{s}</span>
                {isPaused ? (
                  <PauseCircle className="w-3 h-3 flex-shrink-0" />
                ) : (
                  <PlayCircle className="w-3 h-3 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Aggiungi settore custom */}
      <div>
        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">
          Aggiungi settore custom
        </p>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustom();
              }
            }}
            placeholder="es. Dentisti, Officina..."
            className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-[12px] focus:outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={toggle.isPending || !input.trim()}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            {toggle.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
            Pausa
          </button>
        </div>
        <p className="text-[9px] text-muted-foreground mt-1">
          Le conversazioni esistenti su settori in pausa non vengono fatte avanzare. Riattiva quando vuoi.
        </p>
      </div>
    </motion.div>
  );
}
