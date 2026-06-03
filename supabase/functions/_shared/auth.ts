// Shared auth helpers for edge functions.
// Provides standardized JWT verification + service-role impersonation pattern.

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

export interface AuthResult {
  ok: boolean;
  userId?: string;
  isServiceCall?: boolean;
  status?: number;
  error?: string;
}

/**
 * Resolve the caller identity for an edge function.
 * - If the Authorization header carries the service-role key AND
 *   `x-autopilot-impersonate` is set, returns that user id (for cron/scheduler).
 * - Otherwise verifies a user JWT via auth.getUser().
 * Optionally enforces `requireUserId` (rejects if caller's user.id !== required).
 */
export async function resolveCaller(
  req: Request,
  requireUserId?: string | null,
): Promise<AuthResult> {
  const authHeader = req.headers.get("Authorization") || "";
  const impersonate = req.headers.get("x-autopilot-impersonate");
  const isServiceCall = !!SUPABASE_SERVICE_ROLE_KEY && authHeader.includes(SUPABASE_SERVICE_ROLE_KEY);

  if (isServiceCall) {
    const uid = impersonate || requireUserId || undefined;
    return { ok: true, isServiceCall: true, userId: uid };
  }

  if (!authHeader) {
    return { ok: false, status: 401, error: "Unauthorized: missing bearer token" };
  }

  try {
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data, error } = await userClient.auth.getUser();
    if (error || !data?.user) {
      return { ok: false, status: 401, error: "Unauthorized: invalid session" };
    }
    if (requireUserId && data.user.id !== requireUserId) {
      return { ok: false, status: 403, error: "Forbidden: user mismatch" };
    }
    return { ok: true, userId: data.user.id, isServiceCall: false };
  } catch (e) {
    return { ok: false, status: 401, error: "Unauthorized: " + (e as Error).message };
  }
}

export function unauthorizedResponse(result: AuthResult, corsHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify({ error: result.error || "Unauthorized" }), {
    status: result.status || 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function serviceClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

/** Check if the caller has a given role via has_role(). Requires authenticated user. */
export async function callerHasRole(userId: string, role: string): Promise<boolean> {
  const svc = serviceClient();
  const { data } = await svc.rpc("has_role", { _user_id: userId, _role: role });
  return !!data;
}
