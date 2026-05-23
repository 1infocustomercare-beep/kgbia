import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useActiveTenant } from "@/hooks/useActiveTenant";
import { clearActiveTenant, setActiveTenant, subscribeActiveTenant } from "@/lib/active-tenant";
import {
  bindSessionToTenant,
  hardWipeTenantSession,
  verifyTenantSessionFingerprint,
} from "@/lib/tenant-session-isolation";

interface TenantGuardProps {
  children: ReactNode;
}

/**
 * Guards /t/:slug/admin/* routes:
 * - Requires an authenticated user
 * - Requires active tenant in storage to match the URL slug AND the current user
 * - Re-validates membership against DB on mount (RLS-safe)
 * - Subscribes to cross-tab tenant changes — if another tab clears or switches
 *   tenant, this tab is sent back to the tenant login.
 */
export default function TenantGuard({ children }: TenantGuardProps) {
  const { slug = "" } = useParams<{ slug: string }>();
  const { user, loading } = useAuth();
  const activeTenant = useActiveTenant();
  const [verifying, setVerifying] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [tick, setTick] = useState(0);

  // Cross-tab kill-switch: any clear/switch in another tab forces re-eval
  useEffect(() => {
    const unsub = subscribeActiveTenant(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (loading) return;
      if (!user) {
        if (!cancelled) { setAllowed(false); setVerifying(false); }
        return;
      }

      setVerifying(true);

      // 1) Slug must match active tenant + same user. Otherwise HARD WIPE:
      //    do not allow a session bound to tenant A to wander into tenant B's URL.
      if (!activeTenant || activeTenant.slug !== slug || activeTenant.userId !== user.id) {
        await hardWipeTenantSession("slug_mismatch");
        try {
          await supabase.rpc("log_tenant_login_event", {
            p_slug: slug,
            p_outcome: "session_wipe",
            p_email: user.email ?? null,
            p_metadata: { reason: "slug_mismatch", active_slug: activeTenant?.slug ?? null },
          });
        } catch { /* best effort */ }
        if (!cancelled) { setAllowed(false); setVerifying(false); }
        return;
      }

      // 2) Server-side authoritative verification (cannot be bypassed client-side)
      const { data: verdict, error: rpcError } = await supabase.rpc(
        "verify_tenant_access",
        { p_slug: slug },
      );
      if (cancelled) return;

      const v = (verdict ?? {}) as { allowed?: boolean; reason?: string; restaurant_id?: string };
      const allowedByServer = !rpcError && v.allowed === true;

      if (!allowedByServer || v.restaurant_id !== activeTenant.restaurantId) {
        const reason = v.reason ?? "server_denied";
        await hardWipeTenantSession(reason);
        try {
          await supabase.rpc("log_tenant_login_event", {
            p_slug: slug,
            p_outcome: reason === "tenant_blocked" ? "tenant_blocked"
                     : reason === "tenant_missing" ? "tenant_missing"
                     : reason === "unauthorized_tenant" ? "unauthorized_tenant"
                     : "membership_revoked",
            p_email: user.email ?? null,
            p_metadata: { source: "TenantGuard", verdict: v },
          });
        } catch { /* best effort */ }
        setAllowed(false);
        setVerifying(false);
        return;
      }

      // 3) Session fingerprint must match this tenant
      const fp = await verifyTenantSessionFingerprint();
      if (!fp.ok) {
        if (fp.reason === "missing_fingerprint") {
          await bindSessionToTenant(activeTenant.restaurantId, user.id);
        } else {
          await hardWipeTenantSession(`session_isolation_${fp.reason}`);
          try {
            await supabase.rpc("log_tenant_login_event", {
              p_slug: slug,
              p_outcome: "fingerprint_mismatch",
              p_email: user.email ?? null,
              p_metadata: { source: "TenantGuard", reason: fp.reason },
            });
          } catch { /* best effort */ }
          if (cancelled) return;
          setAllowed(false);
          setVerifying(false);
          return;
        }
      }

      // Refresh setAt timestamp so other tabs see liveness
      setActiveTenant({ ...activeTenant, setAt: Date.now() });
      setAllowed(true);
      setVerifying(false);
    })();
    return () => { cancelled = true; };
  }, [user, loading, activeTenant, slug, tick]);

  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to={`/t/${slug}/login`} replace />;
  }

  return <>{children}</>;
}
