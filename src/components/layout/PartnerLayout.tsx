import { useState, useEffect, createContext, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Target, DollarSign, FolderOpen, User, LogOut, ArrowLeft,
  Eye, Presentation,
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

  return (
    <DemoModeContext.Provider value={{ demoMode, setDemoMode }}>
    <div className={`min-h-screen flex flex-col relative admin-panel ${isDark ? 'landing-dark partner-console' : ''}`}
      style={isDark ? { background: "#0a0a14" } : undefined}>

      {/* ═══ TOP BAR — glassmorphism ═══ */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 safe-top"
        style={{
          background: isDark ? "rgba(10,10,20,0.85)" : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        }}>
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate("/home")} className="flex items-center justify-center w-8 h-8 rounded-xl transition-colors"
            style={{ background: `${accentColor}10`, color: accentColor }}>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-foreground tracking-tight">Partner</span>
        </div>

        {/* ═══ SWITCH — drag to toggle ═══ */}
        <div className="relative flex items-center w-[120px] h-[34px] rounded-full select-none"
          style={{
            background: demoMode
              ? "linear-gradient(135deg, rgba(212,160,82,0.12), rgba(212,160,82,0.05))"
              : "linear-gradient(135deg, rgba(167,139,250,0.1), rgba(124,58,237,0.04))",
            border: `1px solid ${demoMode ? "rgba(212,160,82,0.2)" : "rgba(167,139,250,0.15)"}`,
            boxShadow: `inset 0 1px 2px ${demoMode ? "rgba(212,160,82,0.05)" : "rgba(167,139,250,0.05)"}`,
          }}>
          <span className="absolute left-3 text-[8px] font-bold pointer-events-none transition-opacity duration-300 uppercase tracking-wider"
            style={{ color: `${accentColor}50`, opacity: demoMode ? 1 : 0 }}>LIVE</span>
          <span className="absolute right-3 text-[8px] font-bold pointer-events-none transition-opacity duration-300 uppercase tracking-wider"
            style={{ color: `${accentColor}50`, opacity: demoMode ? 0 : 1 }}>DEMO</span>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 54 }}
            dragElastic={0.05}
            dragMomentum={false}
            animate={{ x: demoMode ? 54 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            onDragEnd={(_e, info) => {
              if (!demoMode && info.offset.x > 20) handleToggle(true);
              else if (demoMode && info.offset.x < -20) handleToggle(false);
            }}
            onTap={() => handleToggle(!demoMode)}
            className="absolute top-[3px] left-[3px] h-[26px] w-[60px] rounded-full flex items-center justify-center gap-1.5 cursor-grab active:cursor-grabbing z-10"
            style={{
              background: demoMode
                ? "linear-gradient(135deg, #d4a052, #b8862e)"
                : "linear-gradient(135deg, #a78bfa, #7c3aed)",
              boxShadow: `0 2px 12px ${demoMode ? "rgba(212,160,82,0.35)" : "rgba(167,139,250,0.3)"}`,
            }}>
            {demoMode
              ? <Presentation className="w-3 h-3 text-white/90" />
              : <Eye className="w-3 h-3 text-white/90" />}
            <span className="text-[9px] font-bold text-white pointer-events-none">
              {demoMode ? "DEMO" : "LIVE"}
            </span>
          </motion.div>
        </div>

        <div className="flex items-center gap-1.5">
          <DarkModeToggle />
          <button onClick={async () => { await signOut(); navigate("/auth"); }}
            className="flex items-center justify-center w-8 h-8 rounded-xl transition-colors"
            style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", color: "#9ca3af", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ═══ PAGE CONTENT ═══ */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      {/* ═══ BOTTOM NAV — glassmorphism ═══ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
        style={{
          background: isDark ? "rgba(10,10,20,0.88)" : "rgba(255,255,255,0.88)",
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        }}>
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {NAV_ITEMS_FULL.filter(item => demoMode ? item.showInDemo : true).map(item => {
            const active = isActive(item.path, item.exact);
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all relative min-w-[52px]"
                style={active ? { background: `${accentColor}10` } : undefined}>
                {active && (
                  <motion.div layoutId="partner-nav-indicator"
                    className="absolute -top-1 w-8 h-[3px] rounded-full"
                    style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <item.icon className="w-5 h-5" style={{ color: active ? accentColor : "#6b7280" }} />
                <span className="text-[9px] font-semibold" style={{ color: active ? accentColor : "#6b7280" }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
    </DemoModeContext.Provider>
  );
}