import { useCallback, useEffect, useState } from "react";
import { Loader2, ShieldCheck, Rocket, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PendingTenant {
  kind: "company" | "restaurant";
  id: string;
  name: string;
  slug: string | null;
  owner_id: string | null;
  setup_paid: boolean;
  approval_status: string;
  created_at: string | null;
}

/**
 * HOLD & APPROVE — Regime Forfettario.
 * Nessuna attivazione automatica: il Setup pagato resta in attesa
 * finché il Super Admin non clicca "Approva e Esegui Deploy".
 */
export default function PendingApprovalsPanel() {
  const [items, setItems] = useState<PendingTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("superadmin-account-actions", {
        body: { action: "list_pending_approvals" },
      });
      if (error) throw error;
      setItems((data as any)?.pending ?? []);
    } catch (err) {
      console.warn("[PendingApprovals] load failed", err);
      toast({ title: "Errore", description: "Impossibile caricare le attivazioni in attesa.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (tenant: PendingTenant) => {
    setWorking(tenant.id);
    try {
      const { data, error } = await supabase.functions.invoke("superadmin-account-actions", {
        body: { action: "approve_tenant", tenant_kind: tenant.kind, tenant_id: tenant.id },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "Deploy approvato", description: `${tenant.name} è ora attivo.` });
      setItems((prev) => prev.filter((t) => t.id !== tenant.id));
    } catch (err) {
      toast({ title: "Errore", description: (err as Error).message, variant: "destructive" });
    } finally {
      setWorking(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Attivazioni in attesa (Setup pagato)</h3>
        </div>
        <button
          onClick={load}
          className="p-2 rounded-lg bg-secondary text-muted-foreground"
          aria-label="Aggiorna elenco"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        Il pagamento del Setup non attiva l'app. L'account si sblocca solo con l'approvazione manuale.
      </p>

      {loading ? (
        <div className="py-6 flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-xs text-muted-foreground py-3">Nessun account in attesa di attivazione.</p>
      ) : (
        <div className="space-y-2">
          {items.map((t) => (
            <div key={`${t.kind}-${t.id}`} className="rounded-xl bg-secondary p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {t.kind === "company" ? "Azienda" : "Ristorante"}
                  {t.slug ? ` · /${t.slug}` : ""} · Setup pagato
                </p>
              </div>
              <button
                onClick={() => approve(t)}
                disabled={working === t.id}
                className="shrink-0 px-3 py-2 min-h-[44px] rounded-xl bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-60"
              >
                {working === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
                Approva e Esegui Deploy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
