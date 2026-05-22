import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import {
  ArrowLeft, ArrowRight, Store, ChefHat, Car, Scissors, Heart,
  Dumbbell, Building, Umbrella, Wrench, Zap, Camera, Truck, GraduationCap,
  Baby, Sparkles, Eye, EyeOff, Mail, Lock, User, Briefcase, Handshake
} from "lucide-react";
import empireLogoNew from "@/assets/empire-logo-new.png";
import { toast } from "sonner";

const SECTOR_ICONS: Record<string, any> = {
  food: ChefHat, ncc: Car, beauty: Scissors, healthcare: Heart,
  retail: Store, fitness: Dumbbell, hospitality: Building, beach: Umbrella,
  plumber: Wrench, electrician: Zap, photography: Camera, logistics: Truck,
  education: GraduationCap, childcare: Baby, custom: Sparkles,
};

const SECTOR_COLORS: Record<string, string> = {
  food: "#e85d04", ncc: "#C9A84C", beauty: "#e91e8c", healthcare: "#0ea5e9",
  retail: "#8b5cf6", fitness: "#f97316", hospitality: "#10b981", beach: "#06b6d4",
  plumber: "#3b82f6", electrician: "#eab308", photography: "#a855f7",
  logistics: "#0ea5e9", education: "#0891b2", childcare: "#f472b6", custom: "#8b5cf6",
};

type RoleType = "partner" | "customer";
type AuthMode = "login" | "register";

const normalizeSignupPlan = (plan: string) => {
  if (plan === "base" || plan === "starter" || plan === "essential") return "essential";
  if (plan === "growth" || plan === "professional" || plan === "smart_ia") return "smart_ia";
  if (plan === "empire" || plan === "enterprise" || plan === "empire_pro") return "empire_pro";
  return "";
};

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, user, roles, rolesReady, loading: authLoading } = useAuth();
  const autoProvisionAttemptRef = useRef<string | null>(null);

  const preselectedPlan = normalizeSignupPlan(searchParams.get("plan") || "");
  const preselectedSector = searchParams.get("sector") || "";
  const referralId = searchParams.get("ref") || "";
  const roleParam = searchParams.get("role");
  const modeParam = searchParams.get("mode");

  const isPartnerSignupFlow =
    roleParam === "partner" || location.pathname === "/partner/register" || !!referralId;

  const isForcedLoginFlow =
    modeParam === "login" || location.pathname === "/login" || location.pathname === "/admin";

  const shouldDefaultToRegister = !isForcedLoginFlow && (Boolean(preselectedPlan) || isPartnerSignupFlow);

  const [mode, setMode] = useState<AuthMode>(shouldDefaultToRegister ? "register" : "login");
  const [step, setStep] = useState(2); // Always step 2 — no role selection step
  const [role, setRole] = useState<RoleType>(
    isPartnerSignupFlow ? "partner" : "customer"
  );
  const [sector, setSector] = useState<string>(preselectedSector);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !rolesReady || !user) return;

    let cancelled = false;

    const resolveDestination = async () => {
      if (roles.includes("super_admin")) {
        navigate("/superadmin", { replace: true });
        return;
      }

      if (roles.includes("staff")) {
        navigate("/staff", { replace: true });
        return;
      }

      if (roles.includes("partner") || roles.includes("team_leader")) {
        navigate("/partner", { replace: true });
        return;
      }

      const { data: ownedRestaurant } = await supabase
        .from("restaurants")
        .select("id")
        .eq("owner_id", user.id)
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (ownedRestaurant?.id) {
        navigate("/dashboard", { replace: true });
        return;
      }

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

      if (cancelled) return;

      if (companyIndustry) {
        navigate("/app", { replace: true });
        return;
      }

      const signupRole = user.user_metadata?.signup_role as string | undefined;
      const signupSector = user.user_metadata?.signup_sector as IndustryId | undefined;
      const signupPlan = normalizeSignupPlan((user.user_metadata?.signup_plan as string | undefined) || "");

      // Partners without a company should go to /partner, not onboarding
      if (signupRole === "partner") {
        // Ensure partner role exists (may have been assigned during signup)
        try {
          await supabase.functions.invoke("assign-partner-role", {
            body: { user_id: user.id, team_leader_id: user.user_metadata?.referral_id || null },
          });
        } catch (e) {
          console.warn("Partner role re-assignment attempt:", e);
        }
        // Small delay to let role assignment propagate
        await new Promise(r => setTimeout(r, 1500));
        // Force refresh roles
        const { data: refreshedRoles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);
        const hasPartnerRole = refreshedRoles?.some(r => r.role === "partner" || r.role === "team_leader");
        if (hasPartnerRole) {
          navigate("/partner", { replace: true });
          return;
        }
        // If still no role, try again
        try {
          await supabase.functions.invoke("assign-partner-role", {
            body: { user_id: user.id, team_leader_id: user.user_metadata?.referral_id || null },
          });
          await new Promise(r => setTimeout(r, 1000));
        } catch (e2) {
          console.warn("Second partner role assignment attempt:", e2);
        }
        navigate("/partner", { replace: true });
        return;
      }

      const canAutoProvisionCompany =
        signupRole !== "partner" &&
        !!signupSector &&
        !!signupPlan &&
        autoProvisionAttemptRef.current !== user.id;

      if (canAutoProvisionCompany) {
        autoProvisionAttemptRef.current = user.id;

        const metaCompanyName = (user.user_metadata?.company_name as string | undefined)?.trim();
        const metaFullName = (user.user_metadata?.full_name as string | undefined)?.trim();
        const fallbackName = metaCompanyName || (metaFullName ? `Business ${metaFullName}` : null) || user.email?.split("@")[0] || "Nuova Attività";
        const slugBase = fallbackName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "nuova-attivita";

        const { data: autoProvisionData, error: autoProvisionError } = await supabase.functions.invoke("create-company", {
          body: {
            name: fallbackName,
            slug: `${slugBase}-${Date.now().toString(36)}`,
            industry: signupSector,
            email: user.email || null,
            plan: signupPlan,
            primary_color: INDUSTRY_CONFIGS[signupSector]?.defaultPrimaryColor || "#C8963E",
          },
        });

        if (!cancelled && !autoProvisionError && !autoProvisionData?.error) {
          await supabase.auth.refreshSession();
          // Food sector creates a restaurant → go to /dashboard; others → /app
          const dest = signupSector === "food" ? "/dashboard" : "/app";
          navigate(dest, { replace: true });
          return;
        }

        console.error("Auto-provisioning company failed, falling back to onboarding", autoProvisionError || autoProvisionData?.error);
      }

      navigate("/onboarding", { replace: true });
    };

    void resolveDestination();

    return () => {
      cancelled = true;
    };
  }, [authLoading, rolesReady, user, roles, navigate]);

  const allSectors = Object.entries(INDUSTRY_CONFIGS).map(([id, cfg]) => ({
    id, label: cfg.label,
  }));

  const shouldLockCustomerSector = role === "customer" && !!preselectedSector;
  const preselectedSectorLabel = preselectedSector
    ? INDUSTRY_CONFIGS[preselectedSector as IndustryId]?.label || preselectedSector
    : "";

  const openLogin = () => {
    setMode("login");
  };

  const openRegister = () => {
    setMode("register");
    setStep(2);
  };

  const handleBackFromRegisterDetails = () => {
    openLogin();
  };

  const handleLogin = async () => {
    if (!email || !password) { toast.error("Compila tutti i campi"); return; }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Accesso effettuato!");
  };

  const handleRegister = async () => {
    // Partners don't need a sector — they sell for Empire, they don't own a business
    const needsSector = role !== "partner";
    if (!email || !password || !fullName || !role) { toast.error("Compila tutti i campi"); return; }
    if (needsSector && !sector) { toast.error("Seleziona il tuo settore"); return; }
    if (password.length < 8) { toast.error("La password deve avere almeno 8 caratteri"); return; }

    setLoading(true);
    const { error, userId } = await signUp(email, password, {
      fullName,
      role,
      sector: needsSector ? sector : undefined,
      plan: needsSector ? (preselectedPlan || undefined) : undefined,
      referralId: role === "partner" ? referralId || undefined : undefined,
      companyName: role === "partner" ? companyName : undefined,
    });

    // Partner role assignment is handled by AuthContext.signUp

    setLoading(false);
    if (error) { toast.error(error.message); return; }

    toast.success("Registrazione completata! Controlla la tua email per confermare l'account.");
    setMode("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 landing-dark force-dark auth-contrast"
      style={{ background: "linear-gradient(160deg, hsl(228 22% 8%), hsl(250 20% 10%), hsl(228 22% 7%))" }}>

      <button onClick={() => navigate("/home")}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-sm text-foreground/85 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">

        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-full overflow-hidden"
            style={{ boxShadow: "0 0 0 2px hsla(38,65%,58%,0.3), 0 0 30px hsla(265,70%,60%,0.15)" }}>
            <img src={empireLogoNew} alt="Empire AI" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="rounded-2xl p-6 sm:p-8"
          style={{
            background: "linear-gradient(155deg, hsla(260,20%,15%,0.95), hsla(250,18%,11%,0.93))",
            border: "1px solid hsla(265,40%,50%,0.2)",
            boxShadow: "0 20px 60px hsla(0,0%,0%,0.4), inset 0 1px 0 hsla(210,20%,96%,0.05)"
          }}>

          <div className="mb-5 grid grid-cols-2 rounded-xl border border-white/10 p-1 bg-white/[0.03]">
            <button
              type="button"
              onClick={openLogin}
              className={`rounded-lg py-2 text-xs font-heading font-bold tracking-wide uppercase transition-all ${
                mode === "login" ? "bg-white/10 text-foreground" : "text-foreground/65 hover:text-foreground"
              }`}
            >
              Accedi
            </button>
            <button
              type="button"
              onClick={openRegister}
              className={`rounded-lg py-2 text-xs font-heading font-bold tracking-wide uppercase transition-all ${
                mode === "register" ? "bg-white/10 text-foreground" : "text-foreground/65 hover:text-foreground"
              }`}
            >
              Registrati
            </button>
          </div>

          {mode === "login" ? (
            <div className="space-y-5">
              <div className="text-center">
                <h1 className="text-xl font-heading font-bold text-foreground mb-1">Bentornato</h1>
                <p className="text-sm text-foreground/85">Accedi al tuo account Empire</p>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/60" />
                  <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                    className="pl-10 !bg-white/[0.08] border-white/15 text-white placeholder:text-white/50 focus:border-primary/55" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/60" />
                  <Input type={showPw ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                    className="pl-10 pr-10 !bg-white/[0.08] border-white/15 text-white placeholder:text-white/50 focus:border-primary/55" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground/90">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button onClick={handleLogin} disabled={loading} className="w-full py-3 rounded-xl font-bold text-sm"
                style={{ background: "linear-gradient(135deg, hsl(38 65% 58%), hsl(38 55% 48%))", color: "hsl(var(--primary-foreground))" }}>
                {loading ? "Accesso..." : "Accedi"}
              </Button>
              <div className="text-center space-y-2">
                <button type="button" onClick={() => navigate("/reset-password")} className="text-xs text-foreground/75 hover:text-foreground transition-colors">
                  Password dimenticata?
                </button>
                <p className="text-xs text-foreground/75">
                  Non hai un account?{" "}
                  <button type="button" onClick={openRegister} className="text-primary font-semibold underline underline-offset-4 decoration-primary/50 hover:text-primary/80">
                    Registrati
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-4">
                  <button type="button" onClick={handleBackFromRegisterDetails} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
                    <ArrowLeft className="w-3 h-3" /> Indietro
                  </button>
                  <div className="text-center">
                    <h1 className="text-xl font-heading font-bold text-foreground mb-1">
                      {role === "partner" ? "Registrati come Partner" : "Crea il tuo Account"}
                    </h1>
                    <p className="text-sm text-foreground/85">Compila i dati per iniziare</p>
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/60" />
                      <Input placeholder="Nome completo" value={fullName} onChange={e => setFullName(e.target.value)}
                        className="pl-10 !bg-white/[0.08] border-white/15 text-white placeholder:text-white/50 focus:border-primary/55" />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/60" />
                      <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                        className="pl-10 !bg-white/[0.08] border-white/15 text-white placeholder:text-white/50 focus:border-primary/55" />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/60" />
                      <Input type={showPw ? "text" : "password"} placeholder="Password (min 8 caratteri)" value={password} onChange={e => setPassword(e.target.value)}
                        className="pl-10 pr-10 !bg-white/[0.08] border-white/15 text-white placeholder:text-white/50 focus:border-primary/55" />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground/90">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {role === "partner" && (
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/60" />
                        <Input placeholder="Nome azienda (opzionale)" value={companyName} onChange={e => setCompanyName(e.target.value)}
                          className="pl-10 !bg-white/[0.08] border-white/15 text-white placeholder:text-white/50 focus:border-primary/55" />
                    </div>
                    )}

                    {/* Sector selection — only for customers, NOT for partners */}
                    {role !== "partner" && (
                      <>
                        {shouldLockCustomerSector ? (
                          <div className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2.5">
                            <p className="text-[11px] text-foreground/70">Settore selezionato dalla homepage</p>
                            <p className="text-sm font-semibold text-foreground">{preselectedSectorLabel}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs text-foreground font-medium mb-2">Il tuo settore</p>
                            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1">
                              {allSectors.map(s => {
                                const Icon = SECTOR_ICONS[s.id] || Sparkles;
                                const color = SECTOR_COLORS[s.id] || "#8b5cf6";
                                const selected = sector === s.id;
                                return (
                                  <button key={s.id} type="button" onClick={() => setSector(s.id)}
                                    className="flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-all"
                                    style={{
                                      background: selected ? `${color}25` : "hsla(0,0%,100%,0.05)",
                                      border: `1px solid ${selected ? `${color}60` : "hsla(0,0%,100%,0.12)"}`,
                                    }}>
                                    <Icon className="w-4 h-4" style={{ color: selected ? color : "hsl(var(--foreground) / 0.6)" }} />
                                    <span className="text-[10px] font-medium leading-tight" style={{ color: selected ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.72)" }}>
                                      {s.label}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Partner info box */}
                    {role === "partner" && (
                      <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.06] px-3 py-2.5">
                        <p className="text-xs font-bold text-foreground flex items-center gap-2">
                          <Handshake className="w-3.5 h-3.5 text-purple-400" /> Stai registrando un account Venditore Empire
                        </p>
                        <p className="text-[11px] text-foreground/60 mt-1">Dopo la registrazione accederai al pannello partner con strumenti di vendita, demo e gestione team.</p>
                        {referralId && (
                          <p className="text-[10px] text-purple-400 mt-1">🔗 Registrazione tramite link di reclutamento</p>
                        )}
                      </div>
                    )}
                  </div>
                  <Button onClick={handleRegister} disabled={loading || (role !== "partner" && !sector)} className="w-full py-3 rounded-xl font-bold text-sm"
                    style={{ background: role === "partner" ? "linear-gradient(135deg, hsl(270 60% 55%), hsl(285 50% 45%))" : "linear-gradient(135deg, hsl(265 70% 58%), hsl(250 60% 50%))", color: "hsl(var(--primary-foreground))" }}>
                    {loading ? "Registrazione..." : role === "partner" ? "Registrati come Venditore" : "Crea Account"}
                  </Button>
                  <p className="text-xs text-center text-foreground/75">
                    Hai già un account?{" "}
                    <button type="button" onClick={openLogin} className="text-primary font-semibold underline underline-offset-4 decoration-primary/50 hover:text-primary/80">Accedi</button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}
