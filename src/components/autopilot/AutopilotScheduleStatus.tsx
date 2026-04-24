// ══════════════════════════════════════════════════════════════
// AutopilotScheduleStatus — Stato live del pianificatore
// Mostra: prossima esecuzione, scans rimanenti oggi,
//         canali in pausa/attivi, stato finestra orari operativi,
//         storico ultime esecuzioni.
// ══════════════════════════════════════════════════════════════
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Zap,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Activity,
  CheckCircle2,
  XCircle,
  SkipForward,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  AlertCircle,
} from "lucide-react";
import {
  useAutopilotConfig,
  useAutopilotSchedulerRuns,
  useTriggerScheduler,
  useToggleChannelPause,
} from "@/hooks/useAutopilot";
import { toast } from "sonner";

// ── Helpers ──
function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "—";
  const diff = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diff);
  const min = Math.round(abs / 60_000);
  if (min < 1) return diff > 0 ? "tra pochi secondi" : "ora";
  if (min < 60) return diff > 0 ? `tra ${min} min` : `${min} min fa`;
  const h = Math.round(min / 60);
  if (h < 24) return diff > 0 ? `tra ${h}h` : `${h}h fa`;
  const d = Math.round(h / 24);
  return diff > 0 ? `tra ${d}g` : `${d}g fa`;
}

function formatTimeRome(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("it-IT", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isWithinWindow(start: string, end: string): boolean {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const hh = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
  const mm = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
  const cur = hh * 60 + mm;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const s = sh * 60 + sm;
  const e = eh * 60 + em;
  return s <= e ? cur >= s && cur <= e : cur >= s || cur <= e;
}

const CHANNEL_META: Record<string, { label: string; Icon: typeof Mail }> = {
  email: { label: "Email", Icon: Mail },
  chat: { label: "Chat", Icon: MessageCircle },
  whatsapp_link: { label: "WhatsApp", Icon: Phone },
};

const STATUS_META: Record<
  string,
  { label: string; Icon: typeof CheckCircle2; cls: string }
> = {
  completed: { label: "Completata", Icon: CheckCircle2, cls: "text-emerald-500" },
  running: { label: "In corso", Icon: Loader2, cls: "text-primary" },
  skipped: { label: "Saltata", Icon: SkipForward, cls: "text-muted-foreground" },
  failed: { label: "Errore", Icon: XCircle, cls: "text-destructive" },
};

const SKIP_LABELS: Record<string, string> = {
  autopilot_disabled: "Autopilot spento",
  outside_operating_hours: "Fuori orario operativo",
  interval_not_elapsed: "Intervallo non ancora trascorso",
  daily_cap_reached: "Cap giornaliero raggiunto",
  all_channels_paused: "Tutti i canali in pausa",
};

export default function AutopilotScheduleStatus() {
  const { data: cfg, isLoading } = useAutopilotConfig();
  const { data: runs } = useAutopilotSchedulerRuns(8);
  const trigger = useTriggerScheduler();
  const toggleChannel = useToggleChannelPause();

  const c = (cfg as any) || {};
  const enabledChannels: string[] = Array.isArray(c.enabled_channels)
    ? c.enabled_channels
    : ["email", "chat", "whatsapp_link"];
  const pausedChannels: string[] = Array.isArray(c.paused_channels)
    ? c.paused_channels
    : [];
  const activeChannels = enabledChannels.filter((x) => !pausedChannels.includes(x));

  const cap: number = c.daily_scan_cap || 100;
  const used: number = c.daily_scans_used || 0;
  const remaining = Math.max(0, cap - used);
  const usagePct = Math.min(100, Math.round((used / Math.max(cap, 1)) * 100));

  const startTime = c.operating_hours?.start || "09:00";
  const endTime = c.operating_hours?.end || "19:00";
  const inWindow = useMemo(
    () => isWithinWindow(startTime, endTime),
    [startTime, endTime],
  );

  const handleTrigger = async () => {
    try {
      const res: any = await trigger.mutateAsync();
      toast.success("Scheduler eseguito", {
        description: `Processati ${res?.processed ?? 0} owner`,
      });
    } catch (e: any) {
      toast.error("Trigger fallito", { description: e?.message });
    }
  };

  const handleToggleChannel = async (ch: string) => {
    try {
      const next = await toggleChannel.mutateAsync(ch);
      const isPaused = next.includes(ch);
      toast.success(
        isPaused
          ? `Canale ${CHANNEL_META[ch]?.label || ch} messo in pausa`
          : `Canale ${CHANNEL_META[ch]?.label || ch} riattivato`,
      );
    } catch (e: any) {
      toast.error("Errore", { description: e?.message });
    }
  };

  if (isLoading) {
    return (
      <div className="partner-card rounded-2xl p-5 flex items-center justify-center min-h-[200px]">
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
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Pianificazione server-side
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Cron ogni 5 min · Rispetta orari + cap + canali
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleTrigger}
          disabled={trigger.isPending}
          className="text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition disabled:opacity-50"
        >
          {trigger.isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          Esegui ora
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Prossima esecuzione */}
        <div className="p-3 rounded-xl bg-card border border-border/60">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> Prossima
          </p>
          <p className="text-sm font-bold text-foreground mt-1">
            {formatRelative(c.next_run_at)}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {formatTimeRome(c.next_run_at)}
          </p>
        </div>

        {/* Scans rimanenti */}
        <div className="p-3 rounded-xl bg-card border border-border/60">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Zap className="w-2.5 h-2.5" /> Rimanenti oggi
          </p>
          <p
            className={`text-sm font-bold mt-1 ${
              remaining === 0
                ? "text-destructive"
                : remaining < cap * 0.2
                  ? "text-amber-500"
                  : "text-foreground"
            }`}
          >
            {remaining} / {cap}
          </p>
          <div className="h-1 rounded-full bg-muted overflow-hidden mt-1">
            <div
              className="h-full transition-all"
              style={{
                width: `${usagePct}%`,
                background:
                  usagePct > 85
                    ? "hsl(var(--destructive))"
                    : usagePct > 60
                      ? "hsl(45 95% 55%)"
                      : "hsl(var(--primary))",
              }}
            />
          </div>
        </div>

        {/* Finestra operativa */}
        <div className="p-3 rounded-xl bg-card border border-border/60">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> Finestra
          </p>
          <p className="text-sm font-bold text-foreground mt-1">
            {startTime} – {endTime}
          </p>
          <p
            className={`text-[10px] font-semibold ${
              inWindow ? "text-emerald-500" : "text-muted-foreground"
            }`}
          >
            {inWindow ? "● in orario" : "○ fuori orario"}
          </p>
        </div>

        {/* Run totali */}
        <div className="p-3 rounded-xl bg-card border border-border/60">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Activity className="w-2.5 h-2.5" /> Run totali
          </p>
          <p className="text-sm font-bold text-foreground mt-1">
            {c.total_runs || 0}
          </p>
          <p className="text-[10px] text-muted-foreground">
            ultima {formatRelative(c.last_run_at)}
          </p>
        </div>
      </div>

      {/* Canali con toggle pausa */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            Canali
          </p>
          {pausedChannels.length > 0 && (
            <span className="text-[9px] text-amber-500 font-bold flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" />
              {pausedChannels.length} in pausa
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {enabledChannels.map((ch) => {
            const meta = CHANNEL_META[ch] || {
              label: ch,
              Icon: MessageCircle,
            };
            const isPaused = pausedChannels.includes(ch);
            const Icon = isPaused ? PauseCircle : PlayCircle;
            return (
              <button
                key={ch}
                type="button"
                onClick={() => handleToggleChannel(ch)}
                disabled={toggleChannel.isPending}
                className={`p-2 rounded-lg border flex items-center justify-center gap-1.5 text-[11px] font-semibold transition ${
                  isPaused
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                } hover:opacity-80 disabled:opacity-50`}
                title={isPaused ? "Riattiva" : "Metti in pausa"}
              >
                <meta.Icon className="w-3 h-3" />
                {meta.label}
                <Icon className="w-3 h-3 ml-auto" />
              </button>
            );
          })}
        </div>
        <p className="text-[9px] text-muted-foreground mt-1.5">
          Attivi: {activeChannels.length}/{enabledChannels.length} · Click per togglare la pausa
        </p>
      </div>

      {/* Storico ultime esecuzioni */}
      <div>
        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">
          Ultime esecuzioni
        </p>
        {!runs || runs.length === 0 ? (
          <p className="text-[11px] text-muted-foreground text-center py-3 border border-dashed border-border rounded-lg">
            Nessuna esecuzione registrata. Lo scheduler partirà entro 5 min.
          </p>
        ) : (
          <ul className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
            {(runs as any[]).map((r) => {
              const meta = STATUS_META[r.status] || STATUS_META.completed;
              const Icon = meta.Icon;
              return (
                <li
                  key={r.id}
                  className="flex items-center gap-2 text-[10px] p-1.5 rounded bg-card border border-border/40"
                >
                  <Icon
                    className={`w-3 h-3 flex-shrink-0 ${meta.cls} ${
                      r.status === "running" ? "animate-spin" : ""
                    }`}
                  />
                  <span className="text-muted-foreground tabular-nums w-12">
                    {formatTimeRome(r.triggered_at)}
                  </span>
                  <span className={`font-bold ${meta.cls}`}>{meta.label}</span>
                  {r.skip_reason && (
                    <span className="text-muted-foreground truncate">
                      · {SKIP_LABELS[r.skip_reason] || r.skip_reason}
                    </span>
                  )}
                  {r.conversations_advanced > 0 && (
                    <span className="text-emerald-500 font-bold ml-auto">
                      +{r.conversations_advanced} conv
                    </span>
                  )}
                  {r.duration_ms && r.conversations_advanced === 0 && (
                    <span className="text-muted-foreground ml-auto">
                      {r.duration_ms}ms
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
