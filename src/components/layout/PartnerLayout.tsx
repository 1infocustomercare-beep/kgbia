import { useState, useEffect, createContext, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Target, DollarSign, FolderOpen, User, LogOut, ArrowLeft,
  Eye, EyeOff, Presentation,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  useEffect(() => { sessionStorage.setItem("partner_demo_mode", demoMode ? "true" : "false"); }, [demoMode]);

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Partner";

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleToggle = (checked: boolean) => {
    setDemoMode(checked);
    toast({
      title: checked ? "🎯 Modalità Presentazione" : "🔧 Modalità Lavoro",
      description: checked ? "Dati sensibili nascosti — pronto per la vendita" : "Tutti i dati visibili — modalità operativa",
    });
  };

  return (
    <DemoModeContext.Provider value={{ demoMode, setDemoMode }}>
    <div className={`min-h-screen flex flex-col relative admin-panel ${isDark ? 'landing-dark partner-console' : ''}`}
      style={isDark ? { background: "#0a0a14" } : undefined}>

      {/* ═══ TOP BAR ═══ */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-3 h-14 border-b border-border/50 safe-top bg-background/95 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/home")} className="flex items-center gap-1 text-sm font-medium" style={{ color: "#a78bfa" }}>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-foreground">Partner</span>
        </div>

        {/* ═══ SWITCH LIVE / PRESENTAZIONE — toggle slide ═══ */}
        <button onClick={handleToggle}
          className="relative flex items-center w-[120px] h-8 rounded-full cursor-pointer transition-colors duration-300"
          style={{
            background: demoMode
              ? "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.1))"
              : "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(167,139,250,0.08))",
            border: `1px solid ${demoMode ? "rgba(245,158,11,0.35)" : "rgba(167,139,250,0.25)"}`,
          }}>
          {/* Sliding thumb */}
          <div className="absolute top-0.5 h-[26px] w-[58px] rounded-full transition-all duration-300 flex items-center justify-center gap-1"
            style={{
              left: demoMode ? "calc(100% - 60px)" : "2px",
              background: demoMode ? "rgba(245,158,11,0.9)" : "rgba(167,139,250,0.85)",
              boxShadow: demoMode ? "0 0 12px rgba(245,158,11,0.4)" : "0 0 12px rgba(167,139,250,0.3)",
            }}>
            {demoMode
              ? <Presentation className="w-3 h-3 text-black/80" />
              : <Eye className="w-3 h-3 text-white" />}
            <span className="text-[9px] font-bold" style={{ color: demoMode ? "#1a1a1a" : "#fff" }}>
              {demoMode ? "DEMO" : "LIVE"}
            </span>
          </div>
          {/* Background labels */}
          <span className="absolute left-2.5 text-[8px] font-semibold transition-opacity duration-300"
            style={{ color: "rgba(167,139,250,0.4)", opacity: demoMode ? 1 : 0 }}>LIVE</span>
          <span className="absolute right-2.5 text-[8px] font-semibold transition-opacity duration-300"
            style={{ color: "rgba(245,158,11,0.4)", opacity: demoMode ? 0 : 1 }}>DEMO</span>
        </button>

        <div className="flex items-center gap-1.5">
          <DarkModeToggle />
          <button onClick={async () => { await signOut(); navigate("/auth"); }}
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ═══ PAGE CONTENT ═══ */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      {/* ═══ BOTTOM NAV ═══ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom bg-background/95 backdrop-blur-xl border-t border-border/50">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {NAV_ITEMS_FULL.filter(item => demoMode ? item.showInDemo : true).map(item => {
            const active = isActive(item.path, item.exact);
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all relative min-w-[52px]">
                {active && (
                  <motion.div layoutId="partner-nav-indicator"
                    className="absolute -top-1 w-8 h-1 rounded-full"
                    style={{ background: "#a78bfa" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <item.icon className="w-5 h-5" style={{ color: active ? "#a78bfa" : "#6b7280" }} />
                <span className="text-[9px] font-semibold" style={{ color: active ? "#a78bfa" : "#6b7280" }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
    </DemoModeContext.Provider>
  );
}
