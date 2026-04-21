import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useActiveTenant } from "@/hooks/useActiveTenant";
import { clearActiveTenant, setActiveTenant, subscribeActiveTenant } from "@/lib/active-tenant";

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

      // 1) Slug must match active tenant + same user
      if (!activeTenant || activeTenant.slug !== slug || activeTenant.userId !== user.id) {
        if (!cancelled) { setAllowed(false); setVerifying(false); }
        return;
      }

      // 2) Re-verify against DB to catch revoked memberships
      const { data: rest } = await supabase
        .from("restaurants")
        .select("id, slug, is_blocked")
        .eq("slug", slug)
        .maybeSingle();

      if (cancelled) return;

      if (!rest || rest.id !== activeTenant.restaurantId || rest.is_blocked) {
        clearActiveTenant("tenant_invalid");
        setAllowed(false);
        setVerifying(false);
        return;
      }

      const { data: owned } = await supabase
        .from("restaurants")
        .select("id")
        .eq("id", rest.id)
        .eq("owner_id", user.id)
        .maybeSingle();

      let isMember = !!owned;
      if (!isMember) {
        const { data: m } = await supabase
          .from("restaurant_memberships")
          .select("restaurant_id")
          .eq("restaurant_id", rest.id)
          .eq("user_id", user.id)
          .maybeSingle();
        isMember = !!m;
      }

      if (cancelled) return;

      if (!isMember) {
        clearActiveTenant("membership_revoked");
        setAllowed(false);
      } else {
        // Refresh setAt timestamp so other tabs see liveness
        setActiveTenant({ ...activeTenant, setAt: Date.now() });
        setAllowed(true);
      }
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
