import { useState, useEffect, forwardRef } from "react";
import BackButton from "@/components/BackButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Crown, ChefHat, ArrowLeft, Users, Mail, KeyRound, Phone, MapPin, Briefcase } from "lucide-react";
import empireLogoNew from "@/assets/empire-logo-new.png";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { INDUSTRY_CONFIGS } from "@/config/industry-config";

type LoginMode = "choose" | "owner" | "kitchen" | "partner" | "forgot";

/* Dark premium ambient glow */
const Blob = forwardRef<HTMLDivElement, { className?: string; color?: string }>(
  ({ className = "", color = "bg-primary" }, ref) => (
    <div ref={ref} className={`absolute rounded-full blur-[140px] opacity-[0.07] pointer-events-none ${color} ${className}`} />
  )
);
Blob.displayName = "Blob";

/* Full-screen dark premium background matching homepage */
const DarkPremiumBg = () => (
  <>
    <div className="fixed inset-0 z-0" style={{ background: "linear-gradient(145deg, hsl(228 22% 6%) 0%, hsl(232 20% 8%) 50%, hsl(228 18% 7%) 100%)" }} />
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      <div className="absolute top-[-10%] right-[15%] w-[500px] h-[500px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, hsl(265 60% 50%), transparent 65%)", filter: "blur(140px)" }} />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, hsl(210 80% 55%), transparent 70%)", filter: "blur(160px)" }} />
      <div className="absolute top-[40%] left-[50%] w-[350px] h-[350px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, hsl(38 50% 55%), transparent 60%)", filter: "blur(120px)" }} />
      <div className="absolute inset-0" style={{ opacity: 0.012, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
    </div>
  </>
);

const INDUSTRY_LIST = Object.values(INDUSTRY_CONFIGS).map(c => ({ id: c.id, label: c.label, emoji: c.emoji }));

const AdminLogin = forwardRef<HTMLDivElement>((_props, _ref) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");
  const { user, roles, loading: authLoading, rolesReady, signIn } = useAuth();
  const [mode, setMode] = useState<LoginMode>(refCode ? "partner" : "choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [partnerPhone, setPartnerPhone] = useState("");
  const [partnerCity, setPartnerCity] = useState("");
  const [partnerSector, setPartnerSector] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(!!refCode);
  const [kitchenPin, setKitchenPin] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

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
      return "Questa email è già registrata. Prova ad accedere.";
    }

    return message;
  };

  // Auto-redirect if already logged in
  useEffect(() => {
    if (authLoading || !user || !rolesReady) return;

    if (roles.includes("super_admin")) {
      navigate("/superadmin", { replace: true });
    } else if (roles.includes("staff")) {
      navigate("/staff", { replace: true });
    } else if ((roles.includes("partner") || roles.includes("team_leader")) && !roles.includes("restaurant_admin")) {
      navigate("/app", { replace: true });
    } else if (roles.includes("restaurant_admin")) {
      const checkDestination = async () => {
        const { data: membership } = await supabase
          .from("company_memberships")
          .select("company_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        let companyIndustry: string | null = null;

        if (membership?.company_id) {
          const { data: company } = await supabase
            .from("companies")
            .select("industry")
            .eq("id", membership.company_id)
            .maybeSingle();
          companyIndustry = company?.industry ?? null;
        } else {
          const { data: ownedCompany } = await supabase
            .from("companies")
            .select("industry")
            .eq("owner_id", user.id)
            .limit(1)
            .maybeSingle();
          companyIndustry = ownedCompany?.industry ?? null;
        }

        if (companyIndustry) {
          navigate(companyIndustry === "food" ? "/dashboard" : "/app", { replace: true });
          return;
        }

        const { data: ownedRestaurant } = await supabase
          .from("restaurants")
          .select("id")
          .eq("owner_id", user.id)
          .limit(1)
          .maybeSingle();

        if (ownedRestaurant?.id) {
          navigate("/dashboard", { replace: true });
          return;
        }

        // Only send to /setup if they have NO role at all — if they already have restaurant_admin
        // but no data, send them to /app to avoid re-registration loops
        navigate("/app", { replace: true });
      };
      checkDestination();
    } else if (roles.includes("partner") || roles.includes("team_leader")) {
      navigate("/app", { replace: true });
    } else {
      navigate("/app", { replace: true });
    }
  }, [user, roles, authLoading, rolesReady, navigate]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Inserisci la tua email"); return; }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setError(normalizeAuthErrorMessage(error.message));
    } else {
      setForgotSent(true);
    }
    setLoading(false);
  };

  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const signUpOptions: Record<string, unknown> = { full_name: fullName };
        if (mode === "partner") {
          signUpOptions.partner_signup = true;
          signUpOptions.partner_phone = partnerPhone;
          signUpOptions.partner_city = partnerCity;
          signUpOptions.partner_sector = partnerSector;
          if (refCode) signUpOptions.team_leader_id = refCode;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: signUpOptions,
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) {
          setError(normalizeAuthErrorMessage(error.message));
          return;
        }

        if (mode === "partner") {
          toast({ title: "Account Partner creato!", description: "Controlla la tua email per confermare l'account, poi accedi." });
          setIsSignUp(false);
          return;
        }

        toast({ title: "Account creato!", description: "Controlla la tua email per confermare, poi accedi." });
        setIsSignUp(false);
        return;
      }

      const { error, session } = await signIn(email, password);
      if (error) {
        setError(normalizeAuthErrorMessage(error.message));
        return;
      }

      if (session?.user?.user_metadata?.partner_signup) {
        const { data: existingRole, error: roleError } = await supabase
          .from("user_roles")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("role", "partner")
          .maybeSingle();

        if (roleError) throw roleError;

        if (!existingRole) {
          const { error: assignError } = await supabase.functions.invoke("assign-partner-role", {
            body: { user_id: session.user.id, team_leader_id: session.user.user_metadata.team_leader_id || null },
          });
          if (assignError) throw assignError;

          const { error: updateError } = await supabase.auth.updateUser({ data: { partner_signup: null, team_leader_id: null } });
          if (updateError) throw updateError;

          window.location.href = "/app";
          return;
        }
      }
    } catch (error) {
      console.error("Owner login/signup failed", error);
      setError(error instanceof Error ? normalizeAuthErrorMessage(error.message) : "Errore durante l'autenticazione.");
    } finally {
      setLoading(false);
    }
  };

  const handleKitchenAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: dbError } = await supabase
        .rpc("verify_kitchen_pin", { p_pin: kitchenPin.trim() });

      if (dbError || !data || data.length === 0) {
        setError("PIN non valido o scaduto.");
        setLoading(false);
        return;
      }
      const pin = data[0];
      sessionStorage.setItem("kitchen_mode", JSON.stringify({
        restaurantId: pin.restaurant_id, pinId: pin.pin_id, label: pin.label,
        pinCode: kitchenPin.trim(),
      }));
      navigate("/kitchen");
    } catch { setError("Errore di connessione."); }
    setLoading(false);
  };

  const pinDigits = kitchenPin.split("");
  const handlePinPad = (digit: string) => {
    if (kitchenPin.length < 6) setKitchenPin(prev => prev + digit);
  };
  const handlePinDelete = () => setKitchenPin(prev => prev.slice(0, -1));

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <DarkPremiumBg />
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin relative z-10" />
      </div>
    );
  }

  // ─── Mode Chooser ───
  if (mode === "choose") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <DarkPremiumBg />
        <BackButton to="/" theme="glass" />

        <motion.div
          className="w-full max-w-sm space-y-5 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              className="w-20 h-20 rounded-2xl overflow-hidden mb-4 vibrant-glow"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <img src={empireLogoNew} alt="Empire AI" className="w-full h-full object-cover" />
            </motion.div>
            <h1 className="text-2xl font-heading font-bold text-white">Area Riservata</h1>
            <p className="text-sm text-gray-300 mt-1">Seleziona il tuo accesso</p>
          </div>

          {[
            { key: "owner" as LoginMode, icon: Crown, title: "Titolare / Admin", desc: "Accedi con email e password", delay: 0.1 },
            { key: "kitchen" as LoginMode, icon: ChefHat, title: "Staff Cucina", desc: "Accedi con PIN del ristorante", delay: 0.2 },
            { key: "partner" as LoginMode, icon: Users, title: "Diventa Partner", desc: "Guadagna €997 per contratto", delay: 0.3, accent: true },
          ].map(item => (
            <motion.button
              key={item.key}
              onClick={() => { setMode(item.key); if (item.key !== "partner") setIsSignUp(false); }}
              className={`w-full p-5 rounded-2xl glass transition-all text-left flex items-center gap-4 hover:-translate-y-0.5 min-h-[72px] ${
                item.accent ? "border border-primary/30 hover:border-primary/60" : "border border-white/[0.12] hover:border-white/25"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                item.accent ? "bg-vibrant-gradient" : "bg-gradient-to-br from-primary/20 to-accent/15 border border-primary/20"
              }`}>
                <item.icon className={`w-6 h-6 ${item.accent ? "text-primary-foreground" : "text-primary"}`} />
              </div>
              <div>
                <p className="text-base font-semibold text-white">{item.title}</p>
                <p className="text-xs text-gray-300 mt-0.5">{item.desc}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    );
  }

  // ─── Forgot Password ───
  if (mode === "forgot") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <DarkPremiumBg />
        <motion.div className="w-full max-w-sm space-y-6 relative z-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => { setMode("owner"); setError(""); setForgotSent(false); }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Indietro
          </button>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-vibrant-gradient flex items-center justify-center mb-4 vibrant-glow">
              <KeyRound className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-vibrant-gradient">Recupera Password</h1>
            <p className="text-sm text-muted-foreground mt-1">Riceverai un link per reimpostare la password</p>
          </div>

          {forgotSent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center space-y-3">
              <Mail className="w-10 h-10 text-primary mx-auto" />
              <p className="text-foreground font-semibold">Email inviata!</p>
              <p className="text-sm text-muted-foreground">Controlla la tua casella di posta e clicca sul link per reimpostare la password.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="titolare@ristorante.it"
                  className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required />
              </div>
              {error && <motion.p className="text-sm text-accent text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}
              <motion.button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-vibrant-gradient text-primary-foreground font-semibold text-base vibrant-glow disabled:opacity-50"
                whileTap={{ scale: 0.97 }}>
                {loading ? "Invio..." : "Invia Link di Reset"}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  // ─── Kitchen PIN (touch-friendly numpad) ───
  if (mode === "kitchen") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <DarkPremiumBg />
        <motion.div className="w-full max-w-xs space-y-6 relative z-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => { setMode("choose"); setError(""); setKitchenPin(""); }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Indietro
          </button>

          <div className="flex flex-col items-center">
            <motion.div className="w-16 h-16 rounded-2xl bg-vibrant-gradient flex items-center justify-center mb-4 vibrant-glow"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
              <ChefHat className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-heading font-bold text-vibrant-gradient">Kitchen View</h1>
            <p className="text-sm text-muted-foreground mt-1">Inserisci il PIN</p>
          </div>

          {/* PIN dots display */}
          <div className="flex justify-center gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i}
                className={`w-4 h-4 rounded-full transition-all ${i < pinDigits.length ? "bg-primary scale-110" : "bg-muted"}`}
                animate={i < pinDigits.length ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>

          {error && <motion.p className="text-sm text-accent text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}

          {/* Touch numpad */}
          <form onSubmit={handleKitchenAccess}>
            <div className="grid grid-cols-3 gap-3">
              {["1","2","3","4","5","6","7","8","9","",  "0", "⌫"].map((digit, i) => {
                if (digit === "") return <div key={i} />;
                if (digit === "⌫") {
                  return (
                    <motion.button key={i} type="button" onClick={handlePinDelete}
                      className="h-16 rounded-xl bg-secondary/50 text-foreground text-xl font-medium flex items-center justify-center active:bg-accent/20 transition-colors min-h-[56px]"
                      whileTap={{ scale: 0.92 }}>⌫</motion.button>
                  );
                }
                return (
                  <motion.button key={i} type="button" onClick={() => handlePinPad(digit)}
                    className="h-16 rounded-xl bg-secondary text-foreground text-2xl font-semibold flex items-center justify-center active:bg-primary/20 transition-colors min-h-[56px]"
                    whileTap={{ scale: 0.92 }}>{digit}</motion.button>
                );
              })}
            </div>

            <motion.button type="submit" disabled={loading || kitchenPin.length < 4}
              className="w-full py-3.5 mt-4 rounded-2xl bg-vibrant-gradient text-primary-foreground font-semibold text-base vibrant-glow disabled:opacity-50 min-h-[48px]"
              whileTap={{ scale: 0.97 }}>
              {loading ? "Verifica..." : "Entra in Cucina"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ─── Owner / Partner login/signup ───
  const isPartnerMode = mode === "partner";
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <DarkPremiumBg />
      <motion.div className="w-full max-w-sm space-y-6 relative z-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <button onClick={() => { setMode("choose"); setError(""); setIsSignUp(false); }}
          className="flex items-center gap-1 text-sm text-amber-400/80 hover:text-amber-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Indietro
        </button>

        <div className="flex flex-col items-center">
          <motion.div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 vibrant-glow bg-vibrant-gradient`}
            initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
            {isPartnerMode ? <Users className="w-8 h-8 text-primary-foreground" /> : <img src={empireLogoNew} alt="Empire AI" className="w-12 h-12 rounded-full object-cover" style={{ boxShadow: "0 0 0 2px hsla(38,50%,55%,0.3)" }} />}
          </motion.div>
          <h1 className="text-2xl font-heading font-bold text-white">
            {isPartnerMode
              ? (isSignUp ? "Registrati come Partner" : "Accesso Partner")
              : (isSignUp ? "Crea Account" : "Accesso Titolare")}
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            {isPartnerMode
              ? (isSignUp ? (refCode ? "Sei stato invitato da un Team Leader!" : "Unisciti e guadagna €997/vendita") : "Accedi alla tua dashboard Partner")
              : (isSignUp ? "Un account unico per gestire tutto" : "Accedi al pannello di gestione")}
          </p>
        </div>

        {refCode && isPartnerMode && isSignUp && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
            <p className="text-xs text-primary font-medium">🎯 Invito Team Leader · Verrai aggiunto al team</p>
          </motion.div>
        )}

        <form onSubmit={handleOwnerLogin} className="space-y-3">
          {isSignUp && (
            <>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">Nome completo</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder={isPartnerMode ? "Marco Bianchi" : "Mario Rossi"}
                  className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white text-base placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {isPartnerMode && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-1.5">Telefono</label>
                      <input type="tel" value={partnerPhone} onChange={e => setPartnerPhone(e.target.value)}
                        placeholder="+39 333..."
                        className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-1.5">Città</label>
                      <input type="text" value={partnerCity} onChange={e => setPartnerCity(e.target.value)}
                        placeholder="Roma"
                        className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-1.5">Settore di interesse</label>
                    <select value={partnerSector} onChange={e => setPartnerSector(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="">Seleziona settore...</option>
                      {INDUSTRY_LIST.map(ind => (
                        <option key={ind.id} value={ind.id}>{ind.emoji} {ind.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </>
          )}

          <div>
            <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder={isPartnerMode ? "partner@email.com" : "titolare@ristorante.it"}
              className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              required />
          </div>
          <div>
            <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          {!isSignUp && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-primary" />
                Ricordami
              </label>
              <button type="button" onClick={() => { setMode("forgot"); setError(""); }}
                className="text-sm text-primary hover:text-primary/80 transition-colors">
                Password dimenticata?
              </button>
            </div>
          )}

          {error && <motion.p className="text-sm text-accent text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}

          <motion.button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-vibrant-gradient text-primary-foreground font-semibold text-base vibrant-glow disabled:opacity-50 min-h-[48px]"
            whileTap={{ scale: 0.97 }}>
            {loading ? "Caricamento..." : isSignUp
              ? (isPartnerMode ? (refCode ? "Unisciti al Team" : "Diventa Partner") : "Crea Account")
              : "Accedi"}
          </motion.button>
        </form>

        <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          {isSignUp
            ? (isPartnerMode ? "Hai già un account Partner? Accedi" : "Hai già un account? Accedi")
            : (isPartnerMode ? "Nuovo qui? Registrati come Partner" : "Nuovo qui? Crea account")}
        </button>
      </motion.div>
    </div>
  );
});

AdminLogin.displayName = "AdminLogin";

export default AdminLogin;