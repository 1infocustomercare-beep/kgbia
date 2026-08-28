import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * SetupPaidGuard
 * - Blocks access to dashboard areas until the customer has paid the setup fee.
 * - Bypassed for super_admin, partner, team_leader and staff (handled in is_setup_paid SQL function).
 * - Redirects unpaid customers (restaurant_admin) to /checkout-setup.
 *
 * IMPORTANT: This guard is additive. It must be placed INSIDE a <ProtectedRoute>
 * so we already know the user is logged in.
 */
export default function SetupPaidGuard({ children }: { children: ReactNode }) {
  const { user, roles, rolesReady, loading } = useAuth();
  const location = useLocation();
  const [paid, setPaid] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const [pendingApproval, setPendingApproval] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (!user) {
        if (!cancelled) {
          setPaid(null);
          setChecking(false);
        }
        return;
      }

      // Roles that bypass setup payment entirely
      if (
        roles.includes("super_admin") ||
        roles.includes("partner") ||
        roles.includes("team_leader") ||
        roles.includes("staff")
      ) {
        if (!cancelled) {
          setPaid(true);
          setChecking(false);
        }
        return;
      }

      try {
        // FAIL-CLOSED: sblocca solo se setup pagato E approvazione manuale completata.
        const { data, error } = await supabase.rpc("is_setup_paid", { _user_id: user.id });
        if (cancelled) return;
        if (error) {
          console.warn("[SetupPaidGuard] is_setup_paid failed, blocking access (fail-closed):", error);
          setPaid(false);
        } else {
          setPaid(Boolean(data));
        }

        // Distingue "Setup non pagato" da "Setup pagato, in attesa di attivazione"
        if (!data) {
          const { data: statuses } = await (supabase.rpc as any)("my_approval_status");
          if (cancelled) return;
          const waiting = (statuses ?? []).some(
            (s: any) => s?.setup_paid === true && s?.approval_status !== "approved"
          );
          setPendingApproval(waiting);
        } else {
          setPendingApproval(false);
        }
      } catch (err) {
        if (cancelled) return;
        console.warn("[SetupPaidGuard] unexpected error, blocking access (fail-closed):", err);
        setPaid(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    if (rolesReady && !loading) {
      setChecking(true);
      check();
    }

    return () => {
      cancelled = true;
    };
  }, [user, roles, rolesReady, loading]);

  if (loading || !rolesReady || checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (paid === false && pendingApproval) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-heading font-bold text-foreground mb-3">
            Account in attesa di attivazione
          </h1>
          <p className="text-sm text-muted-foreground">
            Pagamento ricevuto. Il tuo account è in attesa di attivazione da parte del nostro team.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Ti avviseremo appena il deploy è completato.
          </p>
        </div>
      </div>
    );
  }

  if (paid === false) {
    return <Navigate to="/checkout-setup" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
