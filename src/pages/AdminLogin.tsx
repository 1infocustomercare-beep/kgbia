import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Crown, ChefHat, ArrowLeft, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type LoginMode = "choose" | "owner" | "kitchen" | "partner";

/* Animated blob */
const Blob = ({ className = "", color = "bg-primary" }: { className?: string; color?: string }) => {
  return <div className={`absolute rounded-full blur-[140px] opacity-[0.18] pointer-events-none ${color} ${className}`} />;
};

// Prevent ref warnings from parent components
Blob.displayName = "Blob";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref"); // Team Leader referral code (user_id)
  const { user, roles, loading: authLoading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<LoginMode>(refCode ? "partner" : "choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(!!refCode);
  const [kitchenPin, setKitchenPin] = useState("");

  // Auto-redirect if already logged in
  useEffect(() => {
    if (authLoading || !user) return;
    if (roles.includes("super_admin")) {
      navigate("/superadmin", { replace: true });
    } else if (roles.includes("staff")) {
      navigate("/staff", { replace: true });
    } else if ((roles.includes("partner") || roles.includes("team_leader")) && !roles.includes("restaurant_admin")) {
      // Pure partner/team_leader users → partner dashboard
      navigate("/partner", { replace: true });
    } else if (roles.includes("restaurant_admin")) {
      navigate("/app", { replace: true });
    } else if (roles.includes("partner") || roles.includes("team_leader")) {
      navigate("/partner", { replace: true });
    } else {
      navigate("/app", { replace: true });
    }
  }, [user, roles, authLoading, navigate]);

  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      const signUpOptions: any = { full_name: fullName };
      // Store partner intent in user metadata for post-confirmation role assignment
      if (mode === "partner") {
        signUpOptions.partner_signup = true;
        if (refCode) signUpOptions.team_leader_id = refCode;
      }

      const { error } = await supabase.auth.signUp({
        email, password,
        options: {
          data: signUpOptions,
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // If signing up as partner, try to assign role immediately or after confirmation
      if (mode === "partner") {
        // Poll for session up to 5 seconds (handles auto-confirm or fast email verify)
        let session = null;
        for (let i = 0; i < 10; i++) {
          await new Promise(r => setTimeout(r, 500));
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            session = data.session;
            break;
          }
        }

        if (session?.user) {
          await supabase.functions.invoke("assign-partner-role", {
            body: { user_id: session.user.id, team_leader_id: refCode || null },
          });
          window.location.href = "/partner";
          return;
        }

        // Email confirmation required - show message
        toast({
          title: "Account Partner creato!",
          description: "Controlla la tua email per confermare l'account. Dopo la conferma, accedi per entrare nella dashboard Partner.",
        });
        setIsSignUp(false); // Switch to login view
        setLoading(false);
        return;
      }

      toast({
        title: "Account creato con successo!",
        description: "Controlla la tua email per confermare l'account, poi accedi.",
      });
      setIsSignUp(false);
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // After login, check if this user signed up as partner but hasn't been assigned the role yet
    // (happens when email confirmation was required)
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.user_metadata?.partner_signup) {
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("role", "partner")
        .maybeSingle();

      if (!existingRole) {
        await supabase.functions.invoke("assign-partner-role", {
          body: {
            user_id: session.user.id,
            team_leader_id: session.user.user_metadata.team_leader_id || null,
          },
        });
        // Clear the metadata flag
        await supabase.auth.updateUser({
          data: { partner_signup: null, team_leader_id: null },
        });
        window.location.href = "/partner";
        return;
      }
    }

    setLoading(false);
  };

  const handleKitchenAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: dbError } = await supabase
        .from("kitchen_access_pins")
        .select("id, restaurant_id, label")
        .eq("pin_code", kitchenPin.trim())
        .eq("is_active", true)
        .limit(1);

      if (dbError || !data || data.length === 0) {
        setError("PIN non valido o scaduto.");
        setLoading(false);
        return;
      }

      const pin = data[0];
      sessionStorage.setItem("kitchen_mode", JSON.stringify({
        restaurantId: pin.restaurant_id,
        pinId: pin.id,
        label: pin.label,
      }));

      navigate("/kitchen");
    } catch {
      setError("Errore di connessione. Riprova.");
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <Blob className="w-[500px] h-[500px] top-0 -left-40 animate-blob-float" color="bg-violet-600" />
        <Blob className="w-[400px] h-[400px] bottom-0 right-0 animate-blob-float-reverse" color="bg-orange-500" />
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Mode chooser
  if (mode === "choose") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <Blob className="w-[500px] h-[500px] -top-20 -left-40 animate-blob-float" color="bg-violet-600" />
        <Blob className="w-[400px] h-[400px] bottom-10 -right-20 animate-blob-float-reverse" color="bg-orange-500" />
        <Blob className="w-[300px] h-[300px] top-1/2 left-1/2 animate-blob-float-slow" color="bg-pink-500" />

        <motion.div
          className="w-full max-w-sm space-y-6 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-vibrant-gradient flex items-center justify-center mb-4 vibrant-glow">
              <Crown className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-vibrant-gradient">Area Riservata</h1>
            <p className="text-sm text-muted-foreground mt-1">Seleziona il tuo accesso</p>
          </div>

          <motion.button
            onClick={() => setMode("owner")}
            className="w-full p-5 rounded-2xl glass border border-border/30 hover:border-primary/40 transition-all text-left flex items-center gap-4 hover:-translate-y-0.5"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Titolare / Super Admin</p>
              <p className="text-xs text-muted-foreground mt-0.5">Accedi con email e password</p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => setMode("kitchen")}
            className="w-full p-5 rounded-2xl glass border border-border/30 hover:border-primary/40 transition-all text-left flex items-center gap-4 hover:-translate-y-0.5"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <ChefHat className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Staff Cucina</p>
              <p className="text-xs text-muted-foreground mt-0.5">Accedi con PIN del ristorante</p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => { setMode("partner"); setIsSignUp(false); }}
            className="w-full p-5 rounded-2xl glass border border-primary/30 hover:border-primary/60 transition-all text-left flex items-center gap-4 hover:-translate-y-0.5"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl bg-vibrant-gradient flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Diventa Partner</p>
              <p className="text-xs text-muted-foreground mt-0.5">Vendi Empire e guadagna €997 per contratto</p>
            </div>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Kitchen PIN login
  if (mode === "kitchen") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <Blob className="w-[400px] h-[400px] -top-20 -right-20 animate-blob-float" color="bg-violet-600" />
        <Blob className="w-[300px] h-[300px] bottom-20 -left-20 animate-blob-float-reverse" color="bg-pink-500" />
        <motion.div
          className="w-full max-w-sm space-y-8 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => { setMode("choose"); setError(""); }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Indietro
          </button>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-vibrant-gradient flex items-center justify-center mb-4 vibrant-glow">
              <ChefHat className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-vibrant-gradient">Kitchen View</h1>
            <p className="text-sm text-muted-foreground mt-1">Inserisci il PIN fornito dal titolare</p>
          </div>

          <form onSubmit={handleKitchenAccess} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-2">PIN Cucina</label>
              <input
                type="text"
                inputMode="numeric"
                value={kitchenPin}
                onChange={(e) => setKitchenPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-4 rounded-xl bg-secondary text-foreground text-2xl text-center font-mono tracking-[0.5em] placeholder:text-muted-foreground placeholder:tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
                maxLength={6}
              />
            </div>

            {error && (
              <motion.p className="text-sm text-accent text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading || kitchenPin.length < 4}
              className="w-full py-3.5 rounded-2xl bg-vibrant-gradient text-primary-foreground font-semibold text-base vibrant-glow disabled:opacity-50"
              whileTap={{ scale: 0.97 }}
            >
              {loading ? "Verifica..." : "Entra in Cucina"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Owner / Super Admin / Partner login
  const isPartnerMode = mode === "partner";
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <Blob className="w-[500px] h-[500px] -top-20 -left-40 animate-blob-float" color="bg-violet-600" />
      <Blob className="w-[400px] h-[400px] bottom-10 -right-20 animate-blob-float-reverse" color="bg-orange-500" />
      <motion.div
        className="w-full max-w-sm space-y-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => { setMode("choose"); setError(""); setIsSignUp(false); }}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Indietro
        </button>

        <div className="flex flex-col items-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 vibrant-glow ${isPartnerMode ? "bg-vibrant-gradient" : "bg-vibrant-gradient"}`}>
            {isPartnerMode ? <Users className="w-8 h-8 text-primary-foreground" /> : <Crown className="w-8 h-8 text-primary-foreground" />}
          </div>
          <h1 className="text-2xl font-heading font-bold text-vibrant-gradient">
            {isPartnerMode
              ? (isSignUp ? "Registrati come Partner" : "Accesso Partner")
              : (isSignUp ? "Crea Account Ristorante" : "Accesso Titolare")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isPartnerMode
              ? (isSignUp
                ? (refCode ? "Sei stato invitato da un Team Leader!" : "Unisciti al programma e guadagna €997/vendita")
                : "Accedi alla tua dashboard Partner")
              : (isSignUp ? "Un account unico per gestire tutto" : "Accedi al pannello di gestione")}
          </p>
        </div>

        {/* Referral banner */}
        {refCode && isPartnerMode && isSignUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center"
          >
            <p className="text-xs text-primary font-medium">
              🎯 Invito Team Leader · Verrai aggiunto automaticamente al team
            </p>
          </motion.div>
        )}

        <form onSubmit={handleOwnerLogin} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-2">Nome completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isPartnerMode ? "Marco Bianchi" : "Mario Rossi"}
                className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}
          <div>
            <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isPartnerMode ? "partner@email.com" : "titolare@ristorante.it"}
              className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p className="text-sm text-accent text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-vibrant-gradient text-primary-foreground font-semibold text-base vibrant-glow disabled:opacity-50"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Caricamento..." : isSignUp
              ? (isPartnerMode ? (refCode ? "Unisciti al Team" : "Diventa Partner") : "Crea Account")
              : "Accedi"}
          </motion.button>
        </form>

        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isSignUp
            ? (isPartnerMode ? "Hai già un account Partner? Accedi" : "Hai già un account? Accedi")
            : (isPartnerMode ? "Nuovo qui? Registrati come Partner" : "Nuovo qui? Crea account")}
        </button>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
