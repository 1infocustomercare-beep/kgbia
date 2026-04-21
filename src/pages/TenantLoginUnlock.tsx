import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Mail,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { clearLoginThrottle } from "@/lib/tenant-login-throttle";
import { toast } from "@/hooks/use-toast";

type State =
  | { kind: "validating" }
  | { kind: "ready"; email: string; tenantName: string | null }
  | { kind: "consumed"; email: string; tenantName: string | null }
  | { kind: "error"; reason: string };

const REASON_COPY: Record<string, { title: string; body: string }> = {
  token_not_found: {
    title: "Link non valido",
    body: "Questo link di sblocco non è più valido. Richiedine uno nuovo dalla pagina di login del tuo ristorante.",
  },
  token_expired: {
    title: "Link scaduto",
    body: "Il link di sblocco è scaduto (validità 15 minuti). Torna alla pagina di login per richiederne uno nuovo.",
  },
  token_already_used: {
    title: "Link già utilizzato",
    body: "Questo link è già stato consumato. Se hai ancora problemi ad accedere, richiedine uno nuovo.",
  },
  tenant_mismatch: {
    title: "Tenant non corrispondente",
    body: "Questo link non appartiene al ristorante indicato. Verifica di aver aperto il link giusto.",
  },
  invalid_token: {
    title: "Token mancante",
    body: "Il link di sblocco non contiene un token valido.",
  },
  network: {
    title: "Errore di rete",
    body: "Non è stato possibile contattare il server. Controlla la connessione e riprova.",
  },
  internal_error: {
    title: "Errore interno",
    body: "Qualcosa è andato storto. Riprova tra qualche minuto o contatta il supporto.",
  },
};

export default function TenantLoginUnlock() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") ?? "";

  const [state, setState] = useState<State>({ kind: "validating" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) {
        setState({ kind: "error", reason: "invalid_token" });
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke(
          "tenant-login-unlock-verify",
          { body: { token, slug } },
        );
        if (cancelled) return;

        if (error || !data?.ok) {
          const reason =
            (data && typeof data.error === "string" && data.error) ||
            (error?.message?.includes("non-2xx") ? "token_not_found" : null) ||
            "internal_error";
          setState({ kind: "error", reason });
          return;
        }

        // Success → clear local throttle for this (slug, email)
        const email: string = data.email;
        const tenantName: string | null = data.tenant_name ?? null;
        try {
          clearLoginThrottle(slug, email);
        } catch {
          /* noop */
        }
        setState({ kind: "consumed", email, tenantName });
        toast({
          title: "Accesso sbloccato",
          description: "Puoi riprovare ad accedere al tuo ristorante.",
        });
      } catch (err) {
        if (cancelled) return;
        console.error("[tenant-unlock] verify failed", err);
        setState({ kind: "error", reason: "network" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, slug]);

  const copy = useMemo(() => {
    if (state.kind === "error") {
      return REASON_COPY[state.reason] ?? REASON_COPY.internal_error;
    }
    return null;
  }, [state]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-2xl border border-border bg-card/90 backdrop-blur p-7 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
              Empire · Sblocco accesso
            </p>
            <h1 className="text-lg font-display font-bold text-foreground">
              {slug ? `Tenant: ${slug}` : "Sblocco verificato"}
            </h1>
          </div>
        </div>

        {state.kind === "validating" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Verifica del link di sblocco in corso…
            </p>
          </div>
        )}

        {state.kind === "consumed" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 px-3 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Accesso sbloccato
                </p>
                <p className="text-xs text-emerald-700/90 dark:text-emerald-400/90 mt-0.5">
                  Il blocco temporaneo per <span className="font-mono">{state.email}</span>{" "}
                  è stato rimosso{state.tenantName ? ` su ${state.tenantName}` : ""}.
                </p>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => navigate(`/t/${slug}/login`, { replace: true })}
            >
              Vai al login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {state.kind === "error" && copy && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 px-3 py-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-destructive">{copy.title}</p>
                <p className="text-xs text-destructive/90 mt-0.5 leading-snug">
                  {copy.body}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="default"
                className="w-full"
                onClick={() => navigate(`/t/${slug}/login`, { replace: true })}
              >
                Torna al login
              </Button>
              <Link
                to="mailto:info@empireaigroup.com"
                className="text-xs text-center text-muted-foreground hover:text-foreground underline inline-flex items-center justify-center gap-1.5 py-1"
              >
                <Mail className="w-3 h-3" />
                Contatta il supporto Empire
              </Link>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground/70" />
          <p className="text-[10px] text-muted-foreground/70 leading-tight">
            Per sicurezza, ogni link di sblocco è valido una sola volta e scade dopo 15 minuti.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
