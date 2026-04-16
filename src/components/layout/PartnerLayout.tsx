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

      {/* ═══ INTERACTIVE BACKGROUND — same as Empire home ═══ */}
      {isDark && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <EmpireDNABackground />
        </div>
      )}

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
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ opacity: demoMode ? 0.4 : 1 }}
            className="text-[9px] font-bold uppercase tracking-[0.15em]"
            style={{ color: "#a78bfa" }}
          >
            Live
          </motion.span>

          <div
            className="relative flex items-center w-[56px] h-[30px] rounded-full select-none cursor-pointer overflow-hidden"
            style={{
              background: demoMode
                ? "linear-gradient(135deg, #1a1510, #2a1f14)"
                : "linear-gradient(135deg, #13111f, #1a1530)",
              border: `1.5px solid ${demoMode ? "rgba(212,160,82,0.3)" : "rgba(167,139,250,0.25)"}`,
              boxShadow: `0 0 24px ${demoMode ? "rgba(212,160,82,0.1)" : "rgba(167,139,250,0.08)"}, inset 0 1px 2px rgba(255,255,255,0.04)`,
            }}
            onClick={() => handleToggle(!demoMode)}
          >
            {/* Animated track particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 3 + i,
                  height: 3 + i,
                  background: demoMode ? "rgba(212,160,82,0.3)" : "rgba(167,139,250,0.25)",
                  top: `${30 + i * 15}%`,
                }}
                animate={{
                  x: demoMode ? [10, 42, 10] : [42, 10, 42],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: 2.5 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Track glow that follows thumb */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background: `radial-gradient(circle at ${demoMode ? "78%" : "22%"} 50%, ${demoMode ? "rgba(212,160,82,0.2)" : "rgba(167,139,250,0.18)"}, transparent 65%)`,
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }, background: { duration: 0.4 } }}
            />

            {/* Thumb */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 26 }}
              dragElastic={0.05}
              dragMomentum={false}
              animate={{ x: demoMode ? 26 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              onDragEnd={(_e, info) => {
                if (!demoMode && info.offset.x > 10) handleToggle(true);
                else if (demoMode && info.offset.x < -10) handleToggle(false);
              }}
              className="relative top-0 left-[2px] h-[26px] w-[26px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
              style={{
                background: demoMode
                  ? "linear-gradient(145deg, #d4a052, #b8892e)"
                  : "linear-gradient(145deg, #a78bfa, #7c3aed)",
                boxShadow: `0 2px 12px ${demoMode ? "rgba(212,160,82,0.55)" : "rgba(124,58,237,0.5)"}, 0 0 20px ${demoMode ? "rgba(212,160,82,0.2)" : "rgba(124,58,237,0.15)"}`,
              }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
            >
              {/* Outer ring pulse */}
              <motion.div
                className="absolute inset-[-3px] rounded-full"
                animate={{ opacity: [0, 0.5, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  border: `1px solid ${demoMode ? "rgba(212,160,82,0.4)" : "rgba(167,139,250,0.35)"}`,
                }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={demoMode ? "demo" : "live"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {demoMode
                    ? <Presentation className="w-3 h-3 text-white/95" />
                    : <Eye className="w-3 h-3 text-white/95" />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.span
            animate={{ opacity: demoMode ? 1 : 0.4 }}
            className="text-[9px] font-bold uppercase tracking-[0.15em]"
            style={{ color: "#d4a052" }}
          >
            Demo
          </motion.span>
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
          background: isDark ? "rgba(10,10,20,0.92)" : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(28px) saturate(2)",
          WebkitBackdropFilter: "blur(28px) saturate(2)",
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          boxShadow: isDark ? "0 -8px 32px rgba(0,0,0,0.3)" : "0 -4px 16px rgba(0,0,0,0.05)",
        }}>
        {/* Animated top accent line */}
        <motion.div className="absolute top-0 left-0 right-0 h-[1px]"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ background: `linear-gradient(90deg, transparent 10%, ${accentColor}60 50%, transparent 90%)` }} />
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {NAV_ITEMS_FULL.filter(item => demoMode ? item.showInDemo : true).map(item => {
            const active = isActive(item.path, item.exact);
            return (
              <motion.button key={item.path} onClick={() => navigate(item.path)}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all relative min-w-[52px]"
                style={active ? { background: `${accentColor}10` } : undefined}>
                {active && (
                  <>
                    <motion.div layoutId="partner-nav-indicator"
                      className="absolute -top-1 w-8 h-[3px] rounded-full"
                      style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`, boxShadow: `0 0 10px ${accentColor}50` }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                    {/* Active glow */}
                    <motion.div className="absolute inset-0 rounded-2xl" animate={{ opacity: [0.03, 0.08, 0.03] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      style={{ background: `radial-gradient(circle at 50% 30%, ${accentColor}20, transparent 70%)` }} />
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