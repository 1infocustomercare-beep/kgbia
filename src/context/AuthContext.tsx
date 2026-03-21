import { createContext, useContext, useEffect, useState, type ReactNode, forwardRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { clearIndustryCache } from "@/hooks/useIndustry";

type AppRole = "super_admin" | "staff" | "restaurant_admin" | "customer" | "partner" | "team_leader";
type SignupRole = "partner" | "customer";

type SignUpOptions = {
  fullName?: string;
  role?: SignupRole;
  sector?: string;
  companyName?: string;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  rolesReady: boolean;
  roles: AppRole[];
  isSuperAdmin: boolean;
  isStaff: boolean;
  isRestaurantAdmin: boolean;
  isPartner: boolean;
  isTeamLeader: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; session: Session | null }>;
  signUp: (email: string, password: string, options?: SignUpOptions) => Promise<{ error: Error | null; userId: string | null }>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_LOADING_TIMEOUT_MS = 3000;

const normalizeAuthErrorMessage = (message: string) => {
  const lower = message.toLowerCase();

  if (lower.includes("email not confirmed")) {
    return "Email non confermata. Controlla la tua casella e conferma l'account prima di accedere.";
  }

  if (lower.includes("invalid login credentials")) {
    return "Credenziali non valide. Verifica email e password.";
  }

  if (lower.includes("user not found") || lower.includes("invalid email or password")) {
    return "Utente non trovato o password errata.";
  }

  if (lower.includes("already registered")) {
    return "Questa email risulta già registrata. Prova ad accedere.";
  }

  return message;
};

const AUTH_FALLBACK: AuthContextType = {
  user: null,
  session: null,
  loading: true,
  rolesReady: false,
  roles: [],
  isSuperAdmin: false,
  isStaff: false,
  isRestaurantAdmin: false,
  isPartner: false,
  isTeamLeader: false,
  signIn: async () => ({ error: new Error("AuthProvider not mounted"), session: null }),
  signUp: async () => ({ error: new Error("AuthProvider not mounted"), userId: null }),
  signOut: async () => {},
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) return AUTH_FALLBACK;
  return ctx;
};

export const AuthProvider = forwardRef<unknown, AuthProviderProps>(({ children }, _ref) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolesReady, setRolesReady] = useState(false);
  const [roles, setRoles] = useState<AppRole[]>([]);

  const reconcileSignupRole = async (userId: string, currentRoles: AppRole[]): Promise<void> => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const meta = authUser.user_metadata;
      const signupRole = meta?.signup_role as SignupRole | undefined;
      if (!signupRole) return; // not a new signup, nothing to reconcile

      // Check if intended role is already assigned
      if (signupRole === "partner" && currentRoles.includes("partner")) return;
      if (signupRole === "customer" && currentRoles.includes("customer")) return;

      // Role mismatch — call the assign function to fix it
      console.log(`[Auth] Reconciling signup role: intended=${signupRole}, current=[${currentRoles.join(",")}]`);
      const functionName = signupRole === "partner" ? "assign-partner-role" : "assign-customer-role";
      const { error } = await supabase.functions.invoke(functionName, {
        body: { user_id: userId },
      });

      if (error) {
        console.error("[Auth] Role reconciliation failed:", error);
      } else {
        console.log("[Auth] Role reconciliation succeeded");
      }
    } catch (err) {
      console.error("[Auth] Reconciliation error:", err);
    }
  };

  const fetchRoles = async (userId: string, shouldReconcile = false): Promise<AppRole[]> => {
    try {
      const [{ data, error }, { data: isSuperAdmin, error: superAdminError }] = await Promise.all([
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId),
        supabase.rpc("is_super_admin"),
      ]);

      if (error) {
        console.error("Failed to fetch user roles", error);
      }

      if (superAdminError) {
        console.error("Failed to check super admin status", superAdminError);
      }

      const roleSet = new Set<AppRole>((data ?? []).map((r: { role: AppRole }) => r.role));
      if (isSuperAdmin === true) {
        roleSet.add("super_admin");
      }

      let finalRoles = Array.from(roleSet);

      // On login, reconcile if signup role doesn't match
      if (shouldReconcile) {
        await reconcileSignupRole(userId, finalRoles);
        // Re-fetch roles after reconciliation
        const { data: refreshed } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);
        if (refreshed) {
          const refreshedSet = new Set<AppRole>(refreshed.map((r: { role: AppRole }) => r.role));
          if (isSuperAdmin === true) refreshedSet.add("super_admin");
          finalRoles = Array.from(refreshedSet);
        }
      }

      return finalRoles;
    } catch (error) {
      console.error("Unexpected role fetch error", error);
      return [];
    }
  };

  const applySessionState = (nextSession: Session | null) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
  };

  useEffect(() => {
    let isMounted = true;
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setRolesReady(true);
        setLoading(false);
      }
    }, AUTH_LOADING_TIMEOUT_MS);

    let lastUserId: string | null = null;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      applySessionState(nextSession);

      const isSameUser = !!nextSession?.user?.id && nextSession.user.id === lastUserId;

      // Ignore noisy same-user events to prevent UI flashing and redundant role fetches
      if (isSameUser && (event === "TOKEN_REFRESHED" || event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        return;
      }

      if (nextSession?.user) {
        lastUserId = nextSession.user.id;
        setLoading(true);
        setRolesReady(false);

        window.setTimeout(async () => {
          const fetchedRoles = await fetchRoles(nextSession.user.id);
          if (!isMounted) return;
          setRoles(fetchedRoles);
          setRolesReady(true);
          setLoading(false);
        }, 0);
      } else {
        lastUserId = null;
        setRoles([]);
        setRolesReady(true);
        setLoading(false);
      }
    });

    void (async () => {
      try {
        setLoading(true);
        setRolesReady(false);
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        applySessionState(data.session);

        if (data.session?.user) {
          const fetchedRoles = await fetchRoles(data.session.user.id);
          if (isMounted) {
            setRoles(fetchedRoles);
            setRolesReady(true);
          }
        } else if (isMounted) {
          setRoles([]);
          setRolesReady(true);
        }
      } catch (error) {
        console.error("Failed to restore auth session", error);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setRoles([]);
          setRolesReady(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { error: new Error(normalizeAuthErrorMessage(error.message)), session: null };
      }

      return { error: null, session: data.session ?? null };
    } catch (error) {
      console.error("Sign in failed", error);
      return {
        error: error instanceof Error ? new Error(normalizeAuthErrorMessage(error.message)) : new Error("Errore durante l'accesso."),
        session: null,
      };
    }
  };

  const signUp = async (email: string, password: string, options?: SignUpOptions) => {
    try {
      const metadata: Record<string, unknown> = {};

      if (options?.fullName) metadata.full_name = options.fullName;
      if (options?.role) metadata.signup_role = options.role;
      if (options?.sector) metadata.signup_sector = options.sector;
      if (options?.companyName) metadata.company_name = options.companyName;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin,
        },
      });

      return {
        error: error ? new Error(normalizeAuthErrorMessage(error.message)) : null,
        userId: data.user?.id ?? null,
      };
    } catch (error) {
      console.error("Sign up failed", error);
      return {
        error: error instanceof Error ? new Error(normalizeAuthErrorMessage(error.message)) : new Error("Errore durante la registrazione."),
        userId: null,
      };
    }
  };

  const signOut = async () => {
    try {
      clearIndustryCache();
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setSession(null);
      setUser(null);
      setRoles([]);
      setRolesReady(true);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        rolesReady,
        roles,
        isSuperAdmin: roles.includes("super_admin"),
        isStaff: roles.includes("staff"),
        isRestaurantAdmin: roles.includes("restaurant_admin"),
        isPartner: roles.includes("partner") || roles.includes("team_leader"),
        isTeamLeader: roles.includes("team_leader"),
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
});

AuthProvider.displayName = "AuthProvider";
