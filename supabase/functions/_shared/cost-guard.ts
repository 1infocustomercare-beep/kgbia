// ─────────────────────────────────────────────────────────────────────────────
// Cost guard per endpoint pubblici a costo (TTS / voice agent / AI).
// Protegge dall'abuso economico: quota oraria per chiamante (utente autenticato
// o IP anonimo) consumata atomicamente lato database via RPC service-role.
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

export type CostGuardResult =
  | { ok: true; callerKey: string; userId: string | null }
  | { ok: false; status: number; error: string };

function callerIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0].trim() || req.headers.get("cf-connecting-ip") || "unknown";
  return ip.slice(0, 64);
}

async function resolveUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  if (!token || token === anonKey) return null;
  try {
    const client = createClient(Deno.env.get("SUPABASE_URL")!, anonKey || token, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data } = await client.auth.getUser();
    return data?.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Consuma quota per lo scope indicato.
 * `units` = unità di costo (es. caratteri di testo TTS, 1 per sessione voice).
 * Limiti applicati per finestra oraria e per chiamante.
 */
export async function enforceCostGuard(
  req: Request,
  scope: string,
  units: number,
  limits: { maxUnitsAnon: number; maxCallsAnon: number; maxUnitsAuth: number; maxCallsAuth: number },
): Promise<CostGuardResult> {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    // FAIL-CLOSED: senza credenziali non possiamo contabilizzare il costo.
    return { ok: false, status: 503, error: "Service temporarily unavailable" };
  }

  const userId = await resolveUserId(req);
  const callerKey = userId ? `user:${userId}` : `ip:${callerIp(req)}`;
  const maxUnits = userId ? limits.maxUnitsAuth : limits.maxUnitsAnon;
  const maxCalls = userId ? limits.maxCallsAuth : limits.maxCallsAnon;

  const admin = createClient(url, serviceKey);
  const { data, error } = await admin.rpc("consume_edge_quota", {
    _scope: scope,
    _caller_key: callerKey,
    _units: Math.max(0, Math.round(units)),
    _max_units: maxUnits,
    _max_calls: maxCalls,
  });

  if (error) {
    console.error(`[cost-guard:${scope}] quota error`, error.message);
    return { ok: false, status: 503, error: "Service temporarily unavailable" };
  }

  if (data !== true) {
    console.warn(`[cost-guard:${scope}] quota exceeded for ${userId ? "user" : "ip"}`);
    return { ok: false, status: 429, error: "Limite di utilizzo raggiunto. Riprova più tardi." };
  }

  return { ok: true, callerKey, userId };
}
