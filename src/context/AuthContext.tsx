import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type AppRole = "super_admin" | "staff" | "restaurant_admin" | "customer" | "partner" | "team_leader";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_LOADING_TIMEOUT_MS = 3000;

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);

  const fetchRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        console.error("Failed to fetch user roles", error);
        setRoles([]);
        return;
      }

      setRoles((data ?? []).map((r: any) => r.role as AppRole));
    } catch (error) {
      console.error("Unexpected role fetch error", error);
      setRoles([]);
    }
  };

  const applySessionState = (nextSession: Session | null) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
  };

  useEffect(() => {
    const safetyTimer = setTimeout(() => setLoading(false), AUTH_LOADING_TIMEOUT_MS);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySessionState(nextSession);
      setLoading(false);

      if (nextSession?.user) {
        setTimeout(() => {
          void fetchRoles(nextSession.user.id);
        }, 0);
      } else {
        setRoles([]);
      }
    });

    void (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        applySessionState(data.session);

        if (data.session?.user) {
          await fetchRoles(data.session.user.id);
        } else {
          setRoles([]);
        }
      } catch (error) {
        console.error("Failed to restore auth session", error);
        setSession(null);
        setUser(null);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? new Error(error.message) : null, session: data.session ?? null };
    } catch (error) {
      console.error("Sign in failed", error);
      return {
        error: error instanceof Error ? error : new Error("Errore durante l'accesso."),
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

      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      console.error("Sign up failed", error);
      return { error: error instanceof Error ? error : new Error("Errore durante la registrazione.") };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setSession(null);
      setUser(null);
      setRoles([]);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
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
};
