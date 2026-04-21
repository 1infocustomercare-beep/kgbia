import { useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getActiveTenant } from "@/lib/active-tenant";
import { hardWipeTenantSession } from "@/lib/tenant-session-isolation";
import { toast } from "@/hooks/use-toast";

interface LogoutOptions {
  /** Override the redirect destination. Defaults to tenant login if a tenant
   *  is active, otherwise `/auth`. */
  redirectTo?: string;
  /** Suppress the success toast (useful for silent logouts during isolation
   *  failures, where another toast is already shown). */
  silent?: boolean;
  /** Reason logged in fingerprints/broadcast for diagnostics. */
  reason?: string;
}

/**
 * Tenant-aware logout.
 *
 * - Determines the correct destination by reading (in order):
 *     1. options.redirectTo
 *     2. the `:slug` route param if we're inside `/t/:slug/...`
 *     3. the active tenant's slug from localStorage
 *     4. `/auth` as fallback
 * - Fully wipes tenant session fingerprints + Supabase auth tokens via
 *   `hardWipeTenantSession`.
 * - Calls AuthContext.signOut so React state (user/session/roles) is cleared.
 * - Uses `replace: true` so the back button cannot return to the
 *   authenticated shell.
 * - As a final guarantee against stale React-Query caches and in-memory
 *   tenant data, the destination is reached via `window.location.assign`
 *   when leaving an authenticated tenant area.
 */
export const useTenantLogout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ slug?: string }>();
  const { signOut } = useAuth();

  return useCallback(
    async (opts: LogoutOptions = {}) => {
      const { redirectTo, silent = false, reason = "user_logout" } = opts;

      // Resolve destination
      const tenantFromStore = getActiveTenant();
      const slug =
        params.slug ||
        // If URL is /t/:slug/... grab it from the path as a backup
        (() => {
          const m = location.pathname.match(/^\/t\/([^/]+)/);
          return m?.[1];
        })() ||
        tenantFromStore?.slug;

      const destination =
        redirectTo ||
        (slug ? `/t/${slug}/login` : "/auth");

      try {
        // 1) Hard wipe tenant fingerprints + Supabase storage + broadcast
        await hardWipeTenantSession(reason);
        // 2) Clear React state (roles, user, session)
        await signOut();
      } catch (err) {
        console.error("[useTenantLogout] failed", err);
      }

      if (!silent) {
        toast({
          title: "Sessione terminata",
          description: slug
            ? "Sei stato disconnesso da questo ristorante."
            : "Sei stato disconnesso.",
        });
      }

      // 3) Hard navigation kills any in-memory caches (React Query, Zustand,
      //    realtime channels still holding the previous tenant's data) and
      //    guarantees a fresh app boot at the splash/login.
      const wasInsideAdmin =
        /^\/(t\/[^/]+\/admin|app|admin|partner|superadmin|staff|dashboard)/.test(
          location.pathname,
        );

      if (wasInsideAdmin) {
        window.location.assign(destination);
      } else {
        navigate(destination, { replace: true });
      }
    },
    [navigate, location.pathname, params.slug, signOut],
  );
};
