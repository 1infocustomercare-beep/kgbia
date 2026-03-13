import { createContext, useContext, useEffect, useState, type ReactNode, forwardRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { clearIndustryCache } from "@/hooks/useIndustry";

type AppRole = "super_admin" | "staff" | "restaurant_admin" | "customer" | "partner" | "team_leader";

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
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = forwardRef<unknown, AuthProviderProps>(({ children }, _ref) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolesReady, setRolesReady] = useState(false);
  const [roles, setRoles] = useState<AppRole[]>([]);

  const fetchRoles = async (userId: string): Promise<AppRole[]> => {
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

      return Array.from(roleSet);
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySessionState(nextSession);

      if (nextSession?.user) {
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

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });

      return { error: error ? new Error(normalizeAuthErrorMessage(error.message)) : null };
    } catch (error) {
      console.error("Sign up failed", error);
      return {
        error: error instanceof Error ? new Error(normalizeAuthErrorMessage(error.message)) : new Error("Errore durante la registrazione."),
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
