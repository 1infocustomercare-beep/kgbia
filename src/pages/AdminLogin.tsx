import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Crown, ChefHat, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type LoginMode = "choose" | "owner" | "kitchen";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, roles, loading: authLoading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<LoginMode>("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [kitchenPin, setKitchenPin] = useState("");

  // Auto-redirect if already logged in
  useEffect(() => {
    if (authLoading || !user) return;
    if (roles.includes("super_admin")) {
      navigate("/superadmin", { replace: true });
    } else if (roles.includes("partner")) {
      navigate("/partner", { replace: true });
    } else if (roles.includes("staff")) {
      navigate("/staff", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [user, roles, authLoading, navigate]);

  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Account creato con successo!",
          description: "Benvenuto nella piattaforma Empire.",
        });
        // Auto-confirm is on, so the useEffect redirect will handle navigation
      }
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Redirect handled by useEffect above
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Mode chooser
  if (mode === "choose") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div
          className="w-full max-w-sm space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gold-gradient">Area Riservata</h1>
            <p className="text-sm text-muted-foreground mt-1">Seleziona il tuo accesso</p>
          </div>

          <motion.button
            onClick={() => setMode("owner")}
            className="w-full p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors text-left flex items-center gap-4"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Titolare / Super Admin</p>
              <p className="text-xs text-muted-foreground mt-0.5">Accedi con email e password</p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => setMode("kitchen")}
            className="w-full p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors text-left flex items-center gap-4"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ChefHat className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Staff Cucina</p>
              <p className="text-xs text-muted-foreground mt-0.5">Accedi con PIN del ristorante</p>
            </div>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Kitchen PIN login
  if (mode === "kitchen") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div
          className="w-full max-w-sm space-y-8"
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
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <ChefHat className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gold-gradient">Kitchen View</h1>
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
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base gold-glow disabled:opacity-50"
              whileTap={{ scale: 0.97 }}
            >
              {loading ? "Verifica..." : "Entra in Cucina"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Owner / Super Admin login
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        className="w-full max-w-sm space-y-8"
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
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gold-gradient">
            {isSignUp ? "Crea Account Ristorante" : "Accesso Titolare"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignUp ? "Un account unico per gestire tutto" : "Accedi al pannello di gestione"}
          </p>
        </div>

        <form onSubmit={handleOwnerLogin} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-2">Nome completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Mario Rossi"
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
              placeholder="titolare@ristorante.it"
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
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base gold-glow disabled:opacity-50"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Caricamento..." : isSignUp ? "Crea Account" : "Accedi"}
          </motion.button>
        </form>

        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isSignUp ? "Hai già un account? Accedi" : "Nuovo ristorante? Crea account"}
        </button>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
