// ══════════════════════════════════════════════════════════════
// AutopilotConfigCard — Mostra configurazione + cap giornaliero
// + apre dialog di configurazione completa
// ══════════════════════════════════════════════════════════════
import { useState } from "react";
import { Settings, Zap, Shield, Sliders } from "lucide-react";
import { useAutopilotConfig } from "@/hooks/useAutopilot";
import AutopilotConfigDialog from "./AutopilotConfigDialog";

export default function AutopilotConfigCard() {
  const { data } = useAutopilotConfig();
  const cfg = data as any;
  const [open, setOpen] = useState(false);

  const used = cfg?.daily_scans_used || 0;
  const cap = cfg?.daily_scan_cap || 100;
  const pct = Math.min(100, Math.round((used / Math.max(cap, 1)) * 100));

  return (
    <>
      <div className="partner-card rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Settings className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Configurazione Autopilot</h3>
              <p className="text-[10px] text-muted-foreground">Cap, autonomia, canali</p>
            </div>
          </div>
          <span className={`text-[9px] uppercase tracking-widest font-bold ${cfg?.is_enabled ? "text-emerald-500" : "text-muted-foreground"}`}>
            {cfg?.is_enabled ? "● Attivo" : "○ Spento"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-card border border-border/50 text-center">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Modello AI</p>
            <p className="text-xs font-bold text-primary truncate">{cfg?.ai_model?.split("/")[1] || "gemini-2.5-pro"}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border/50 text-center">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Autonomia</p>
            <p className="text-xs font-bold text-foreground capitalize">{cfg?.autonomy_level || "balanced"}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-card border border-border/50 text-center">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Canali</p>
            <p className="text-xs font-bold text-foreground">
              {Array.isArray(cfg?.enabled_channels) ? cfg.enabled_channels.length : 3}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary" /> Pain Scan oggi
            </span>
            <span className="font-bold text-foreground">{used} / {cap}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct}%`,
                background: pct > 85 ? "hsl(var(--destructive))" : pct > 60 ? "hsl(45 95% 55%)" : "hsl(var(--primary))",
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
        >
          <Sliders className="w-3.5 h-3.5" />
          Configura soglie e autonomia
        </button>

        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1 border-t border-border/40">
          <Shield className="w-3 h-3 text-emerald-500" />
          Cache 30 giorni · Skip duplicati · Owner illimitato
        </div>
      </div>

      <AutopilotConfigDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

