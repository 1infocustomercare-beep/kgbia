// OutreachPreflightDialog — popup visibile quando il preflight dei canali di
// invio (email/WhatsApp) FALLISCE prima di accendere il toggle "Invio automatico".
import { AlertTriangle, Mail, MessageSquare, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ChannelDetail {
  ready: boolean;
  provider: string | null;
  missing: string[];
}

export interface PreflightResult {
  operational: boolean;
  channels?: string[];
  missing?: string[];
  message?: string;
  channel_details?: {
    email?: ChannelDetail;
    whatsapp?: ChannelDetail;
    sms?: ChannelDetail;
    instagram?: ChannelDetail;
  };
  checked_at?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: PreflightResult | null;
  onRetry?: () => void;
}

export default function OutreachPreflightDialog({ open, onOpenChange, result, onRetry }: Props) {
  const missing = result?.missing ?? [];
  const channels = result?.channels ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base">Invio automatico non disponibile</DialogTitle>
              <DialogDescription className="text-xs">
                Il toggle resta spento finché i canali non sono operativi.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {result?.message ||
              "Nessun canale di invio configurato. Senza email o WhatsApp attivi, Arianna non può contattare i lead in automatico."}
          </p>

          <div className="rounded-lg border border-border/60 p-3 space-y-2 bg-muted/30">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Stato canali
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" />
              <span className="flex-1">Email</span>
              <ChannelBadge ok={channels.includes("email")} />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="w-4 h-4" />
              <span className="flex-1">WhatsApp</span>
              <ChannelBadge ok={channels.includes("whatsapp")} />
            </div>
          </div>

          {missing.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-destructive mb-1">
                Mancante
              </p>
              <ul className="text-xs space-y-1 text-destructive/90">
                {missing.map((m, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-[11px] text-muted-foreground leading-snug">
            Contatta il super admin per configurare le API di invio. Nel frattempo i lead vengono comunque salvati in pipeline.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-1" /> Chiudi
          </Button>
          {onRetry && (
            <Button onClick={onRetry}>Riprova verifica</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ChannelBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
      OPERATIVO
    </span>
  ) : (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">
      NON CONFIGURATO
    </span>
  );
}
