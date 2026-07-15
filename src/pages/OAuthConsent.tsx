import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Local typed wrapper for the beta supabase.auth.oauth namespace.
type OAuthClient = { name?: string; client_uri?: string; logo_uri?: string };
type AuthorizationDetails = {
  client?: OAuthClient;
  scope?: string;
  redirect_uri?: string;
  redirect_url?: string;
  redirect_to?: string;
};
type OAuthResult = { data: AuthorizationDetails | null; error: { message: string } | null };
const oauth = () =>
  (supabase.auth as unknown as {
    oauth: {
      getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
      approveAuthorization: (id: string) => Promise<OAuthResult>;
      denyAuthorization: (id: string) => Promise<OAuthResult>;
    };
  }).oauth;

const SCOPE_LABEL: Record<string, string> = {
  openid: "Verifica la tua identità",
  email: "Vedere il tuo indirizzo email",
  profile: "Vedere il tuo profilo base",
};

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Manca il parametro authorization_id.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      setEmail(sess.session.user?.email ?? null);
      const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => { active = false; };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(approve ? "approve" : "deny");
    try {
      const { data, error } = approve
        ? await oauth().approveAuthorization(authorizationId)
        : await oauth().denyAuthorization(authorizationId);
      if (error) {
        setError(error.message);
        setBusy(null);
        return;
      }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) {
        setError("Il server di autorizzazione non ha restituito un redirect.");
        setBusy(null);
        return;
      }
      window.location.href = target;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto");
      setBusy(null);
    }
  }

  const clientName = details?.client?.name ?? "un'applicazione esterna";
  const scopes = (details?.scope ?? "openid email profile").split(/\s+/).filter(Boolean);

  return (
    <main className="min-h-[100dvh] flex items-center justify-center bg-[#0b0d12] px-4 py-10 text-white">
      <div className="w-full max-w-[440px] rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md shadow-2xl">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-[3px] text-white/50">
          Empire IA · Autorizzazione
        </div>
        <h1 className="mb-2 font-heading text-2xl font-black leading-tight">
          Connetti <span className="text-[hsl(var(--primary,#7eb7be))]">{clientName}</span> al tuo account
        </h1>
        <p className="mb-5 text-sm text-white/65">
          {clientName} potrà usare gli strumenti Empire IA come te. Le policy RLS del backend continuano a decidere a quali dati può accedere.
        </p>

        {email && (
          <div className="mb-5 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs">
            <span className="text-white/50">Autenticato come </span>
            <span className="font-mono text-white">{email}</span>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {!details && !error && (
          <div className="py-8 text-center text-sm text-white/50">Caricamento…</div>
        )}

        {details && (
          <>
            <div className="mb-5">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[3px] text-white/50">
                Permessi richiesti
              </div>
              <ul className="space-y-1.5 text-sm">
                {scopes.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--primary,#7eb7be))]" />
                    <span>{SCOPE_LABEL[s] ?? `Permesso: ${s}`}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--primary,#7eb7be))]" />
                  <span>Chiamare gli strumenti MCP di Empire IA a tuo nome</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => decide(true)}
                disabled={busy !== null}
                className="flex-1 rounded-full bg-white px-4 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy === "approve" ? "Approvazione…" : "Approva e connetti"}
              </button>
              <button
                type="button"
                onClick={() => decide(false)}
                disabled={busy !== null}
                className="flex-1 rounded-full border border-white/20 bg-transparent px-4 py-3 text-sm font-bold text-white/80 transition-colors hover:bg-white/5 disabled:opacity-50"
              >
                {busy === "deny" ? "…" : "Rifiuta"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
