import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import {
  ArrowLeft, ArrowRight, Users, Store, ChefHat, Car, Scissors, Heart,
  Dumbbell, Building, Umbrella, Wrench, Zap, Camera, Truck, GraduationCap,
  Baby, Sparkles, Eye, EyeOff, Mail, Lock, User, Briefcase
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

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, user, roles, rolesReady, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<RoleType | null>(null);
  const [sector, setSector] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !rolesReady || !user) return;

    if (roles.includes("super_admin")) {
      navigate("/superadmin", { replace: true });
      return;
    }

    navigate("/app", { replace: true });
  }, [authLoading, rolesReady, user, roles, navigate]);

  const allSectors = Object.entries(INDUSTRY_CONFIGS).map(([id, cfg]) => ({
    id, label: cfg.label,
  }));

  const handleLogin = async () => {
    if (!email || !password) { toast.error("Compila tutti i campi"); return; }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Accesso effettuato!");
  };

  const handleRegister = async () => {
    if (!email || !password || !fullName || !role || !sector) { toast.error("Compila tutti i campi"); return; }
    if (password.length < 8) { toast.error("La password deve avere almeno 8 caratteri"); return; }

    setLoading(true);
    const { error, userId } = await signUp(email, password, {
      fullName,
      role,
      sector,
      companyName: role === "partner" ? companyName : undefined,
    });

    if (!error && userId) {
      const functionName = role === "partner" ? "assign-partner-role" : "assign-customer-role";
      const { error: assignRoleError } = await supabase.functions.invoke(functionName, {
        body: { user_id: userId },
      });

      if (assignRoleError) {
        console.error("Role assignment failed", assignRoleError);
      }
    }

    setLoading(false);
    if (error) { toast.error(error.message); return; }

    toast.success("Registrazione completata! Controlla la tua email per confermare l'account.");
    setMode("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 landing-dark"
      style={{ background: "linear-gradient(160deg, hsl(228 22% 8%), hsl(250 20% 10%), hsl(228 22% 7%))" }}>

      {/* Back button */}
      <button onClick={() => navigate("/home")}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-full overflow-hidden"
            style={{ boxShadow: "0 0 0 2px hsla(38,65%,58%,0.3), 0 0 30px hsla(265,70%,60%,0.15)" }}>
            <img src={empireLogoNew} alt="Empire AI" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 sm:p-8"
          style={{
            background: "linear-gradient(155deg, hsla(260,20%,15%,0.95), hsla(250,18%,11%,0.93))",
            border: "1px solid hsla(265,40%,50%,0.2)",
            boxShadow: "0 20px 60px hsla(0,0%,0%,0.4), inset 0 1px 0 hsla(210,20%,96%,0.05)"
          }}>

          {mode === "login" ? (
            /* ═══ LOGIN ═══ */
            <div className="space-y-5">
              <div className="text-center">
                <h1 className="text-xl font-heading font-bold text-white mb-1">Bentornato</h1>
                <p className="text-sm text-gray-300">Accedi al tuo account Empire</p>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                    className="pl-10 bg-white/8 border-white/15 text-white placeholder:text-white/40 focus:border-purple-500/50" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <Input type={showPw ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/8 border-white/15 text-white placeholder:text-white/40 focus:border-purple-500/50" />
                  <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button onClick={handleLogin} disabled={loading} className="w-full py-3 rounded-xl font-bold text-sm"
                style={{ background: "linear-gradient(135deg, hsl(38 65% 58%), hsl(38 55% 48%))", color: "#000" }}>
                {loading ? "Accesso..." : "Accedi"}
              </Button>
              <div className="text-center space-y-2">
                <button onClick={() => navigate("/reset-password")} className="text-xs text-white/60 hover:text-white/80 transition-colors">
                  Password dimenticata?
                </button>
                <p className="text-xs text-gray-400">
                  Non hai un account?{" "}
                  <button onClick={() => { setMode("register"); setStep(1); }} className="text-purple-400 hover:text-purple-300 font-semibold">
                    Registrati
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* ═══ REGISTER ═══ */
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-5">
                  <div className="text-center">
                    <h1 className="text-xl font-heading font-bold text-white mb-1">Chi sei?</h1>
                    <p className="text-sm text-gray-300">Seleziona il tuo ruolo per iniziare</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {([
                      { id: "partner" as RoleType, icon: <Briefcase className="w-5 h-5" />, title: "Venditore / Partner", desc: "Vendi soluzioni Empire ai tuoi clienti", color: "hsla(38,65%,58%,0.15)", border: "hsla(38,65%,58%,0.3)" },
                      { id: "customer" as RoleType, icon: <Store className="w-5 h-5" />, title: "Cliente / Imprenditore", desc: "Vuoi digitalizzare la tua attività", color: "hsla(265,60%,60%,0.15)", border: "hsla(265,60%,60%,0.3)" },
                    ]).map(r => (
                      <button key={r.id} onClick={() => { setRole(r.id); setStep(2); }}
                        className="flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background: r.color, border: `1px solid ${r.border}` }}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                          style={{ background: r.border }}>
                          {r.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{r.title}</p>
                          <p className="text-xs text-gray-300">{r.desc}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/50 ml-auto" />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-center text-gray-400">
                    Hai già un account?{" "}
                    <button onClick={() => setMode("login")} className="text-purple-400 hover:text-purple-300 font-semibold">Accedi</button>
                  </p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-4">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-amber-400/80 hover:text-amber-300">
                    <ArrowLeft className="w-3 h-3" /> Indietro
                  </button>
                  <div className="text-center">
                    <h1 className="text-xl font-heading font-bold text-white mb-1">
                      {role === "partner" ? "Registrati come Partner" : "Crea il tuo Account"}
                    </h1>
                    <p className="text-sm text-gray-300">Compila i dati per iniziare</p>
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <Input placeholder="Nome completo" value={fullName} onChange={e => setFullName(e.target.value)}
                        className="pl-10 bg-white/8 border-white/15 text-white placeholder:text-white/40 focus:border-purple-500/50" />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                        className="pl-10 bg-white/8 border-white/15 text-white placeholder:text-white/40 focus:border-purple-500/50" />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <Input type={showPw ? "text" : "password"} placeholder="Password (min 8 caratteri)" value={password} onChange={e => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-white/8 border-white/15 text-white placeholder:text-white/40 focus:border-purple-500/50" />
                      <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {role === "partner" && (
                      <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <Input placeholder="Nome azienda (opzionale)" value={companyName} onChange={e => setCompanyName(e.target.value)}
                        className="pl-10 bg-white/8 border-white/15 text-white placeholder:text-white/40 focus:border-purple-500/50" />
                      </div>
                    )}

                    {/* Sector selection */}
                    <div>
                      <p className="text-xs text-white/50 mb-2">
                        {role === "partner" ? "Settore di competenza" : "Il tuo settore"}
                      </p>
                      <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1">
                        {allSectors.map(s => {
                          const Icon = SECTOR_ICONS[s.id] || Sparkles;
                          const color = SECTOR_COLORS[s.id] || "#8b5cf6";
                          const selected = sector === s.id;
                          return (
                            <button key={s.id} onClick={() => setSector(s.id)}
                              className="flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-all"
                              style={{
                                background: selected ? `${color}25` : "hsla(0,0%,100%,0.03)",
                                border: `1px solid ${selected ? `${color}60` : "hsla(0,0%,100%,0.06)"}`,
                              }}>
                              <Icon className="w-4 h-4" style={{ color: selected ? color : "hsla(0,0%,100%,0.4)" }} />
                              <span className="text-[10px] font-medium leading-tight" style={{ color: selected ? "#fff" : "hsla(0,0%,100%,0.5)" }}>
                                {s.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleRegister} disabled={loading || !sector} className="w-full py-3 rounded-xl font-bold text-sm"
                    style={{ background: "linear-gradient(135deg, hsl(265 70% 58%), hsl(250 60% 50%))", color: "#fff" }}>
                    {loading ? "Registrazione..." : "Crea Account"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}
