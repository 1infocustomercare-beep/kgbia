// ══════════════════════════════════════════════════════════════
// AutopilotRetryPanel — Coda riprove dei passaggi falliti
// Mostra Pain/ROI/Conversation in attesa, in corso, abbandonati
// con backoff esponenziale visibile e azioni manuali (riprova ora,
// annulla). Usa polling 15s + bottone trigger immediato.
// ══════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  X,
  Brain,
  Calculator,
  MessageSquare,
  Send,
  Layers,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { it } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  useAutopilotRetryQueue,
  useTriggerRetryProcessor,
  useCancelRetry,
  useRescheduleRetryNow,
  useRetryQueueStats,
  type AutopilotRetryItem,
  type RetryStatus,
} from "@/hooks/useAutopilotRetryQueue";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STEP_META: Record<
  string,
  { label: string; icon: any; color: string; bg: string }
> = {
  pain_scan: {
    label: "Pain Scan",
    icon: Brain,
    color: "text-rose-500",
    bg: "bg-rose-500/10 border-rose-500/30",
  },
  roi_calculation: {
    label: "Calcolo ROI",
    icon: Calculator,
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/30",
  },
  conversation_advance: {
    label: "Conversazione",
    icon: MessageSquare,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
  },
  lead_outreach: {
    label: "Outreach Lead",
    icon: Send,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/30",
  },
};

const STATUS_META: Record<
  RetryStatus,
  { label: string; icon: any; cls: string }
> = {
  pending: {
    label: "In attesa",
    icon: Clock,
    cls: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  },
  in_progress: {
    label: "In corso",
    icon: Loader2,
    cls: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  },
  succeeded: {
    label: "Riuscito",
    icon: CheckCircle2,
    cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  },
  failed: {
    label: "Fallito",
    icon: XCircle,
    cls: "bg-rose-500/10 text-rose-600 border-rose-500/30",
  },
  abandoned: {
    label: "Abbandonato",
    icon: AlertTriangle,
    cls: "bg-rose-500/10 text-rose-600 border-rose-500/30",
  },
  cancelled: {
    label: "Annullato",
    icon: X,
    cls: "bg-muted text-muted-foreground border-border",
  },
};

function RetryRow({ item }: { item: AutopilotRetryItem }) {
  const stepMeta = STEP_META[item.step_type] || {
    label: item.step_type,
    icon: Layers,
    color: "text-foreground",
    bg: "bg-muted border-border",
  };
  const statusMeta = STATUS_META[item.status];
  const StepIcon = stepMeta.icon;
  const StatusIcon = statusMeta.icon;

  const cancelMut = useCancelRetry();
  const rerunMut = useRescheduleRetryNow();
  const triggerMut = useTriggerRetryProcessor();

  const handleRetryNow = async () => {
    try {
      await rerunMut.mutateAsync(item.id);
      await triggerMut.mutateAsync({ retry_id: item.id });
      toast.success("Riprova avviata");
    } catch (e) {
      toast.error("Errore: " + (e as Error).message);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMut.mutateAsync(item.id);
      toast.success("Voce annullata");
    } catch (e) {
      toast.error("Errore: " + (e as Error).message);
    }
  };

  const isTerminal =
    item.status === "succeeded" ||
    item.status === "abandoned" ||
    item.status === "cancelled";

  const nextRetryDate = new Date(item.next_retry_at);
  const isPast = nextRetryDate.getTime() <= Date.now();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn(
        "rounded-xl border p-3 lg:p-4 space-y-2.5 transition-all",
        stepMeta.bg,
        item.status === "in_progress" && "ring-1 ring-blue-500/40",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-background/50",
          )}
        >
          <StepIcon className={cn("w-4 h-4", stepMeta.color)} />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("text-sm font-semibold", stepMeta.color)}>
              {stepMeta.label}
            </span>
            <Badge
              variant="outline"
              className={cn("text-[10px] px-2 py-0 h-5", statusMeta.cls)}
            >
              <StatusIcon
                className={cn(
                  "w-3 h-3 mr-1",
                  item.status === "in_progress" && "animate-spin",
                )}
              />
              {statusMeta.label}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0 h-5">
              Tent. {item.attempt_count}/{item.max_attempts}
            </Badge>
          </div>

          {item.target_id && (
            <div className="text-[11px] text-muted-foreground font-mono truncate">
              ID: {item.target_id}
            </div>
          )}

          {item.last_error && (
            <div className="text-[11px] text-rose-600 dark:text-rose-400 line-clamp-2 bg-rose-500/5 rounded px-2 py-1 border border-rose-500/20">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              {item.last_error}
            </div>
          )}

          <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
            {!isTerminal && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {isPast ? "Riprova ora" : `tra ${formatDistanceToNow(nextRetryDate, { locale: it })}`}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {format(nextRetryDate, "Pp", { locale: it })}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <span>Backoff: {item.backoff_seconds}s</span>
            {item.last_attempt_at && (
              <span>
                Ultimo:{" "}
                {formatDistanceToNow(new Date(item.last_attempt_at), {
                  addSuffix: true,
                  locale: it,
                })}
              </span>
            )}
          </div>
        </div>

        {!isTerminal && (
          <div className="flex flex-col gap-1.5 shrink-0">
            <Button
              size="sm"
              variant="default"
              className="h-7 text-[11px] px-2"
              onClick={handleRetryNow}
              disabled={rerunMut.isPending || triggerMut.isPending}
            >
              <Play className="w-3 h-3 mr-1" />
              Ora
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-[11px] px-2 text-muted-foreground"
              onClick={handleCancel}
              disabled={cancelMut.isPending}
            >
              <X className="w-3 h-3 mr-1" />
              Annulla
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AutopilotRetryPanel() {
  const [tab, setTab] = useState<"active" | "abandoned" | "all">("active");
  const stats = useRetryQueueStats();
  const triggerMut = useTriggerRetryProcessor();

  const filterByTab: Record<typeof tab, RetryStatus[] | undefined> = {
    active: ["pending", "in_progress", "failed"],
    abandoned: ["abandoned", "cancelled"],
    all: undefined,
  };

  const { data: items = [], isLoading, refetch } = useAutopilotRetryQueue({
    status: filterByTab[tab],
  });

  const handleRunAll = async () => {
    try {
      const res: any = await triggerMut.mutateAsync({ max_items: 20 });
      toast.success(
        `Processate ${res?.processed || 0} voci`,
        { description: "Coda retry aggiornata" },
      );
    } catch (e) {
      toast.error("Errore: " + (e as Error).message);
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg font-bold">Coda Riprove</h3>
            <p className="text-xs text-muted-foreground">
              Pain · ROI · Conversazioni con backoff esponenziale
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="h-8"
          >
            <RefreshCw className="w-3 h-3 mr-1.5" />
            Aggiorna
          </Button>
          <Button
            size="sm"
            onClick={handleRunAll}
            disabled={triggerMut.isPending || stats.pending === 0}
            className="h-8"
          >
            {triggerMut.isPending ? (
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
            ) : (
              <Play className="w-3 h-3 mr-1.5" />
            )}
            Esegui ora ({stats.pending})
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <StatTile label="In attesa" value={stats.pending} cls="bg-amber-500/10 text-amber-600 border-amber-500/30" />
        <StatTile label="In corso" value={stats.inProgress} cls="bg-blue-500/10 text-blue-600 border-blue-500/30" />
        <StatTile label="Riusciti" value={stats.succeeded} cls="bg-emerald-500/10 text-emerald-600 border-emerald-500/30" />
        <StatTile label="Abbandonati" value={stats.abandoned} cls="bg-rose-500/10 text-rose-600 border-rose-500/30" />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="active" className="text-xs">
            Attivi
          </TabsTrigger>
          <TabsTrigger value="abandoned" className="text-xs">
            Abbandonati
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xs">
            Tutti
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Caricamento…
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              Nessuna voce in coda. Tutto sotto controllo.
            </div>
          ) : (
            <ScrollArea className="h-[440px] pr-2">
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {items.map((it) => (
                    <RetryRow key={it.id} item={it} />
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatTile({
  label,
  value,
  cls,
}: {
  label: string;
  value: number;
  cls: string;
}) {
  return (
    <div className={cn("rounded-lg border px-3 py-2", cls)}>
      <div className="text-[10px] uppercase tracking-wider opacity-80 font-semibold">
        {label}
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
