import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, Lock, AlertTriangle, ShieldAlert, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { setActiveTenant, clearActiveTenant } from "@/lib/active-tenant";
import { bindSessionToTenant, hardWipeTenantSession } from "@/lib/tenant-session-isolation";
import {
  clearLoginThrottle,
  getLoginThrottleStatus,
  registerLoginFailure,
  type ThrottleStatus,
} from "@/lib/tenant-login-throttle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  is_blocked: boolean;
}

/**
 * Tenant-isolated login at /t/:slug/login.
 * - Loads the restaurant by slug to display branding
 * - On submit: signs the user in, then verifies they belong to this
 *   tenant (owner OR membership). If not, signs them out immediately.
 * - On success: stores the active tenant and broadcasts to all tabs.
 */
export default function TenantLogin() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { signIn, signOut, user } = useAuth();

  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [loadingTenant, setLoadingTenant] = useState(true);
  const [tenantError, setTenantError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Brute-force throttle state (per slug+email)
  const [throttle, setThrottle] = useState<ThrottleStatus>({
    locked: false,
    remainingMs: 0,
    failures: 0,
    warning: null,
    message: null,
  });
  const [nowTick, setNowTick] = useState(0);

  // Re-evaluate throttle whenever email/slug changes
  useEffect(() => {
    if (!slug || !email) {
      setThrottle({ locked: false, remainingMs: 0, failures: 0, warning: null, message: null });
      return;
    }
    setThrottle(getLoginThrottleStatus(slug, email));
  }, [slug, email, nowTick]);

  // Live countdown while locked
  useEffect(() => {
    if (!throttle.locked) return;
    const id = window.setInterval(() => setNowTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [throttle.locked]);

  const lockoutLabel = useMemo(() => {
    if (!throttle.locked) return null;
    const sec = Math.max(1, Math.ceil(throttle.remainingMs / 1000));
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  }, [throttle.locked, throttle.remainingMs]);

  // Load tenant by slug
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingTenant(true);
      setTenantError(null);
      const { data, error } = await supabase
        .from("restaurants")
        .select("id, name, slug, logo_url, primary_color, is_blocked")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setTenantError("Ristorante non trovato");
      } else if (data.is_blocked) {
        setTenantError("Questo ristorante è temporaneamente sospeso");
      } else {
        setTenant(data as TenantInfo);
      }
      setLoadingTenant(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  // If a session is already active AND already bound to this tenant, jump in
  useEffect(() => {
    if (!user || !tenant) return;
    let cancelled = false;
    (async () => {
      const allowed = await verifyTenantAccess(user.id, tenant.id);
      if (cancelled) return;
      if (allowed) {
        setActiveTenant({
          restaurantId: tenant.id,
          slug: tenant.slug,
          name: tenant.name,
          userId: user.id,
          setAt: Date.now(),
        });
        await bindSessionToTenant(tenant.id, user.id);
        navigate(`/t/${tenant.slug}/admin`, { replace: true });
      }
    })();
    return () => { cancelled = true; };
  }, [user, tenant, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;
    setSubmitting(true);

    try {
      const { error, session } = await signIn(email.trim(), password);
      if (error || !session?.user) {
        toast({
          title: "Accesso negato",
          description: error?.message || "Credenziali non valide.",
          variant: "destructive",
        });
        return;
      }

      const allowed = await verifyTenantAccess(session.user.id, tenant.id);
      if (!allowed) {
        // Hard isolation: not a member of this tenant → wipe session + cookies
        await hardWipeTenantSession("unauthorized_tenant");
        toast({
          title: "Accesso non autorizzato",
          description: `Il tuo account non ha accesso a ${tenant.name}.`,
          variant: "destructive",
        });
        return;
      }

      setActiveTenant({
        restaurantId: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
        userId: session.user.id,
        setAt: Date.now(),
      });
      await bindSessionToTenant(tenant.id, session.user.id);

      toast({
        title: `Benvenuto in ${tenant.name}`,
        description: "Sessione tenant attivata.",
      });
      navigate(`/t/${tenant.slug}/admin`, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingTenant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (tenantError || !tenant) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center gap-3">
        <AlertTriangle className="w-10 h-10 text-destructive" />
        <h1 className="text-xl font-display font-bold text-foreground">
          {tenantError || "Tenant non disponibile"}
        </h1>
        <Link to="/" className="text-sm text-muted-foreground underline">
          Torna alla home
        </Link>
      </div>
    );
  }

  const brand = tenant.primary_color || "#C8963E";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at 20% 10%, ${brand}22, transparent 55%), hsl(var(--background))`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-2xl border border-border bg-card/90 backdrop-blur p-7 shadow-2xl"
      >
        {/* Tenant branding */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center font-display font-bold text-xl"
            style={{ backgroundColor: `${brand}20`, color: brand }}
          >
            {tenant.logo_url ? (
              <img src={tenant.logo_url} alt={tenant.name} className="w-full h-full object-cover" />
            ) : (
              tenant.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
              Empire Tenant Login
            </p>
            <h1 className="text-lg font-display font-bold text-foreground truncate">
              {tenant.name}
            </h1>
          </div>
        </div>

        {/* Isolation badge */}
        <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-secondary/50 border border-border">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground leading-tight">
            Sessione isolata per <span className="text-foreground font-medium">{tenant.slug}</span>.
            Solo i membri autorizzati possono accedere.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nome@ristorante.it"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full"
            style={{ backgroundColor: brand, color: "#fff" }}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Accedi a {tenant.name}
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-[11px] text-muted-foreground text-center">
          Accesso protetto da Empire · isolamento per tenant
        </p>
      </motion.div>
    </div>
  );
}

/**
 * Verifies the user is either the owner or has a membership in this restaurant.
 * Both queries are RLS-safe; we use maybeSingle to avoid 406.
 */
async function verifyTenantAccess(userId: string, restaurantId: string): Promise<boolean> {
  // Check ownership
  const { data: owned } = await supabase
    .from("restaurants")
    .select("id")
    .eq("id", restaurantId)
    .eq("owner_id", userId)
    .maybeSingle();
  if (owned) return true;

  // Check membership
  const { data: member } = await supabase
    .from("restaurant_memberships")
    .select("restaurant_id")
    .eq("restaurant_id", restaurantId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!member;
}
