/**
 * Tenant Session & Cookie Isolation
 *
 * Ensures that an authenticated session cannot be silently reused across
 * different restaurant tenants. We achieve this with three layers:
 *
 *  1. **Session fingerprint** — when a tenant is activated, we bind the
 *     current Supabase session (access token hash + user id) to that
 *     tenant's restaurantId in localStorage under a tenant-scoped key.
 *
 *  2. **Mismatch detection** — on every guard pass, we recompute the
 *     fingerprint and compare it with the stored one. If the active
 *     tenant changes but the fingerprint still points to a different
 *     tenant, the session is considered "leaked" and we hard-wipe it.
 *
 *  3. **Hard wipe** — clears every Supabase auth key, every
 *     `empire.session.*` key, broadcasts a tenant-clear, and signs out
 *     so cookies/tokens cannot be replayed against another tenant.
 *
 * The Supabase RLS policies remain the actual security boundary; this
 * layer guarantees the *client* never carries credentials from one
 * tenant into another's namespace.
 */
import { supabase } from "@/integrations/supabase/client";
import { clearActiveTenant, getActiveTenant } from "@/lib/active-tenant";

const FINGERPRINT_PREFIX = "empire.session.";
const SUPABASE_AUTH_PREFIX = "sb-";

interface SessionFingerprint {
  restaurantId: string;
  userId: string;
  tokenHash: string;
  boundAt: number;
}

const fingerprintKey = (restaurantId: string) =>
  `${FINGERPRINT_PREFIX}${restaurantId}`;

/** Lightweight non-cryptographic hash — fingerprints are not secrets,
 *  they just need to detect "different token" quickly without storing
 *  the raw access token in localStorage. */
const hashToken = (token: string): string => {
  let h = 0;
  for (let i = 0; i < token.length; i++) {
    h = (h << 5) - h + token.charCodeAt(i);
    h |= 0;
  }
  return `h${(h >>> 0).toString(36)}.${token.length}`;
};

/**
 * Bind the current Supabase session to a tenant. Call right after
 * `setActiveTenant` on successful tenant login.
 */
export const bindSessionToTenant = async (
  restaurantId: string,
  userId: string,
): Promise<void> => {
  if (typeof window === "undefined") return;
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;

    // Wipe any other tenant fingerprints — only one active tenant at a time
    purgeOtherFingerprints(restaurantId);

    const fp: SessionFingerprint = {
      restaurantId,
      userId,
      tokenHash: hashToken(token),
      boundAt: Date.now(),
    };
    window.localStorage.setItem(fingerprintKey(restaurantId), JSON.stringify(fp));
  } catch (err) {
    console.error("[TenantSession] bindSessionToTenant failed", err);
  }
};

/**
 * Verify the current session matches the fingerprint stored for the
 * active tenant. Returns false if the session was leaked from another
 * tenant or if user/token changed without re-binding.
 */
export const verifyTenantSessionFingerprint = async (): Promise<{
  ok: boolean;
  reason?: string;
}> => {
  if (typeof window === "undefined") return { ok: true };

  const tenant = getActiveTenant();
  if (!tenant) return { ok: true }; // No tenant → no isolation contract yet

  try {
    const raw = window.localStorage.getItem(fingerprintKey(tenant.restaurantId));
    if (!raw) return { ok: false, reason: "missing_fingerprint" };

    const fp = JSON.parse(raw) as SessionFingerprint;
    if (fp.restaurantId !== tenant.restaurantId) {
      return { ok: false, reason: "fingerprint_tenant_mismatch" };
    }
    if (fp.userId !== tenant.userId) {
      return { ok: false, reason: "fingerprint_user_mismatch" };
    }

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return { ok: false, reason: "no_session" };
    if (data.session?.user.id !== fp.userId) {
      return { ok: false, reason: "session_user_mismatch" };
    }
    if (hashToken(token) !== fp.tokenHash) {
      // Token rotated (refresh) — re-bind silently if same user/tenant
      const refreshed: SessionFingerprint = {
        ...fp,
        tokenHash: hashToken(token),
        boundAt: Date.now(),
      };
      window.localStorage.setItem(
        fingerprintKey(tenant.restaurantId),
        JSON.stringify(refreshed),
      );
    }

    // Detect stale fingerprints from other tenants still hanging around
    const others = listOtherFingerprints(tenant.restaurantId);
    if (others.length > 0) {
      others.forEach((k) => window.localStorage.removeItem(k));
    }

    return { ok: true };
  } catch (err) {
    console.error("[TenantSession] verify failed", err);
    return { ok: false, reason: "verify_error" };
  }
};

/**
 * Hard wipe: removes every tenant fingerprint, every Supabase auth
 * storage key, clears active tenant, and signs the user out. Use when
 * a session is detected as leaked, a tenant is revoked, or the user
 * deliberately switches restaurants.
 */
export const hardWipeTenantSession = async (reason: string): Promise<void> => {
  if (typeof window === "undefined") return;
  try {
    // 1) Clear every empire.session.* fingerprint
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k) continue;
      if (k.startsWith(FINGERPRINT_PREFIX)) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k));

    // 2) Broadcast tenant clear so all tabs react
    clearActiveTenant(reason);

    // 3) Sign out from Supabase — wipes sb-*-auth-token cookies/storage
    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      // ignore — best effort
    }

    // 4) Belt-and-suspenders: nuke any stragglers in localStorage/sessionStorage
    purgeSupabaseAuthStorage();
  } catch (err) {
    console.error("[TenantSession] hardWipeTenantSession failed", err, reason);
  }
};

/* -------------------------------------------------------------------------- */
/* Internal helpers                                                            */
/* -------------------------------------------------------------------------- */

const listOtherFingerprints = (currentRestaurantId: string): string[] => {
  const out: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (!k) continue;
    if (
      k.startsWith(FINGERPRINT_PREFIX) &&
      k !== fingerprintKey(currentRestaurantId)
    ) {
      out.push(k);
    }
  }
  return out;
};

const purgeOtherFingerprints = (currentRestaurantId: string): void => {
  listOtherFingerprints(currentRestaurantId).forEach((k) =>
    window.localStorage.removeItem(k),
  );
};

const purgeSupabaseAuthStorage = (): void => {
  const stores: Storage[] = [];
  if (typeof window.localStorage !== "undefined") stores.push(window.localStorage);
  if (typeof window.sessionStorage !== "undefined") stores.push(window.sessionStorage);

  stores.forEach((store) => {
    const drop: string[] = [];
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (!k) continue;
      if (k.startsWith(SUPABASE_AUTH_PREFIX) && k.includes("auth-token")) {
        drop.push(k);
      }
    }
    drop.forEach((k) => store.removeItem(k));
  });
};
