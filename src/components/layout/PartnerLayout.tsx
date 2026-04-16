import { useState, useEffect, createContext, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Target, DollarSign, FolderOpen, User, LogOut, ArrowLeft,
  Eye, Presentation,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PartnerSplashScreen from "@/components/partner/PartnerSplashScreen";
import EmpireDNABackground from "@/components/EmpireDNABackground";

/* ═══ Context for demo mode across all partner pages ═══ */
const DemoModeContext = createContext<{ demoMode: boolean; setDemoMode: (v: boolean) => void }>({ demoMode: false, setDemoMode: () => {} });
export const usePartnerDemoMode = () => useContext(DemoModeContext);

const NAV_ITEMS_FULL = [
  { path: "/partner", icon: LayoutDashboard, label: "Home", exact: true, showInDemo: true },
  { path: "/partner/leads", icon: Target, label: "Leads", showInDemo: false },
  { path: "/partner/earnings", icon: DollarSign, label: "Guadagni", showInDemo: false },
  { path: "/partner/portfolio", icon: FolderOpen, label: "Portfolio", showInDemo: true },
  { path: "/partner/profile", icon: User, label: "Profilo", showInDemo: false },
];

export default function PartnerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const [demoMode, setDemoMode] = useState(() => sessionStorage.getItem("partner_demo_mode") === "true");
  const [showSplash, setShowSplash] = useState(() => {
    const lastTs = sessionStorage.getItem("partner_splash_ts");
    if (!lastTs) return true;
    return Date.now() - Number(lastTs) > 30 * 60 * 1000;
  });
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Partner";

  useEffect(() => { sessionStorage.setItem("partner_demo_mode", demoMode ? "true" : "false"); }, [demoMode]);

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleToggle = (checked: boolean) => {
    setDemoMode(checked);
    toast({
      title: checked ? "🎯 Modalità Presentazione" : "🔧 Modalità Lavoro",
      description: checked ? "Dati sensibili nascosti — pronto per la vendita" : "Tutti i dati visibili — modalità operativa",
    });
  };

  const accentColor = demoMode ? "#d4a052" : "#a78bfa";

  if (showSplash) {
    return (
      <PartnerSplashScreen
        userName={userName}
        onComplete={() => {
          setShowSplash(false);
          sessionStorage.setItem("partner_splash_ts", String(Date.now()));
        }}
      />
    );
  }

  return (
    <DemoModeContext.Provider value={{ demoMode, setDemoMode }}>
    <div className={`min-h-screen flex flex-col relative admin-panel ${isDark ? 'landing-dark partner-console' : ''}`}
      style={isDark ? { background: "#0a0a14" } : undefined}>

      {/* ═══ INTERACTIVE BACKGROUND — boosted visibility ═══ */}
      {isDark && (
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 1.0 }}>
          <EmpireDNABackground />
          {/* Extra ambient glow layers for more impact */}
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse 60% 40% at 20% 30%, rgba(167,139,250,0.06), transparent 70%), radial-gradient(ellipse 50% 50% at 80% 70%, rgba(99,102,241,0.05), transparent 60%)",
          }} />
        </div>
      )}

      {/* ═══ TOP BAR — glassmorphism ═══ */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 safe-top"
        style={{
          background: isDark ? "rgba(9,10,24,0.98)" : "rgba(255,255,255,0.96)",
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
          boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.28)" : "0 8px 24px rgba(0,0,0,0.06)",
        }}>
...
                    <motion.div className="absolute inset-0 rounded-2xl" animate={{ opacity: [0.05, 0.1, 0.05] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ background: isDark ? `radial-gradient(circle at 50% 30%, ${accentColor}18, rgba(10,10,22,0.94) 72%)` : `radial-gradient(circle at 50% 30%, ${accentColor}16, rgba(255,255,255,0.96) 72%)` }} />
                  </>
                )}
                <motion.div animate={active ? { y: [0, -1, 0] } : {}} transition={{ duration: 2, repeat: Infinity }}>
                  <item.icon className="w-5 h-5" style={{ color: active ? accentColor : "#6b7280", filter: active ? `drop-shadow(0 0 6px ${accentColor}50)` : "none" }} />
                </motion.div>
                <span className="text-[9px] font-semibold" style={{ color: active ? accentColor : "#6b7280" }}>{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
    </DemoModeContext.Provider>
  );
}