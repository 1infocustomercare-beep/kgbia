import { useState, useEffect, createContext, useContext, useRef, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  LayoutDashboard, Target, DollarSign, FolderOpen, User, LogOut, ArrowLeft,
  Eye, Presentation, Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRef, useCallback } from "react";

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

        {/* ═══ PREMIUM TOGGLE ═══ */}
        <div
          className="relative flex items-center w-[52px] h-[28px] rounded-full select-none cursor-pointer"
          style={{
            background: demoMode
              ? "linear-gradient(135deg, #1a1510, #2a1f14)"
              : "linear-gradient(135deg, #13111f, #1a1530)",
            border: `1px solid ${demoMode ? "rgba(212,160,82,0.25)" : "rgba(167,139,250,0.2)"}`,
            boxShadow: `0 0 20px ${demoMode ? "rgba(212,160,82,0.08)" : "rgba(167,139,250,0.06)"}, inset 0 1px 1px rgba(255,255,255,0.03)`,
          }}
          onClick={() => handleToggle(!demoMode)}
        >
          {/* Track glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: `radial-gradient(circle at ${demoMode ? "75%" : "25%"} 50%, ${demoMode ? "rgba(212,160,82,0.15)" : "rgba(167,139,250,0.12)"}, transparent 70%)`,
            }}
          />
          {/* Thumb */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 24 }}
            dragElastic={0.05}
            dragMomentum={false}
            animate={{ x: demoMode ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            onDragEnd={(_e, info) => {
              if (!demoMode && info.offset.x > 10) handleToggle(true);
              else if (demoMode && info.offset.x < -10) handleToggle(false);
            }}
            className="relative top-0 left-[2px] h-[24px] w-[24px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
            style={{
              background: demoMode
                ? "linear-gradient(145deg, #d4a052, #c08b35)"
                : "linear-gradient(145deg, #a78bfa, #8b5cf6)",
              boxShadow: `0 2px 10px ${demoMode ? "rgba(212,160,82,0.5)" : "rgba(167,139,250,0.45)"}, 0 0 16px ${demoMode ? "rgba(212,160,82,0.2)" : "rgba(167,139,250,0.15)"}`,
            }}
          >
            <motion.div
              animate={{ rotate: demoMode ? 180 : 0, scale: [1, 1.1, 1] }}
              transition={{ rotate: { type: "spring", stiffness: 300 }, scale: { duration: 2, repeat: Infinity } }}
            >
              {demoMode
                ? <Presentation className="w-3 h-3 text-white/90" />
                : <Eye className="w-3 h-3 text-white/90" />}
            </motion.div>
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