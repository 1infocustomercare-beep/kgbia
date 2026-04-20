import { useState, useEffect, createContext, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Target, DollarSign, FolderOpen, User, LogOut, ArrowLeft,
  Eye, Presentation, Zap, Palette,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PartnerSplashScreen from "@/components/partner/PartnerSplashScreen";
import EmpireDNABackground from "@/components/EmpireDNABackground";
import PartnerVoiceAgent from "@/components/partner/PartnerVoiceAgent";
import PartnerVoiceOrchestratorFAB from "@/components/partner/PartnerVoiceOrchestratorFAB";

const DemoModeContext = createContext<{ demoMode: boolean; setDemoMode: (v: boolean) => void }>({ demoMode: false, setDemoMode: () => {} });
export const usePartnerDemoMode = () => useContext(DemoModeContext);

const NAV_ITEMS_FULL = [
  { path: "/partner", icon: LayoutDashboard, label: "Home", exact: true, showInDemo: true },
  { path: "/partner/leads", icon: Target, label: "Leads", showInDemo: false },
  { path: "/partner/api-connections", icon: Zap, label: "API", showInDemo: false },
  { path: "/partner/custom-preview", icon: Palette, label: "Preview", showInDemo: false },
  { path: "/partner/earnings", icon: DollarSign, label: "Guadagni", showInDemo: false },
  { path: "/partner/portfolio", icon: FolderOpen, label: "Portfolio", showInDemo: true },
  { path: "/partner/profile", icon: User, label: "Profilo", showInDemo: false },
];

const resolvePartnerVoiceTab = (pathname: string) => {
  if (pathname.startsWith("/partner/earnings")) return "earnings";
  if (pathname.startsWith("/partner/portfolio")) return "showcase";
  if (pathname.startsWith("/partner/custom-preview")) return "projects";
  if (pathname.startsWith("/partner/profile")) return "dashboard";
  if (pathname.startsWith("/partner/api-connections")) return "toolkit";
  return "dashboard";
};

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
  const [partnerAvatar, setPartnerAvatar] = useState<string | null>(null);
  const [profileFullName, setProfileFullName] = useState<string | null>(null);
  const userName = profileFullName || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Partner";

  useEffect(() => {
    if (!user?.id) return;
    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase.from("profiles").select("avatar_url, full_name").eq("user_id", user.id).maybeSingle().then(({ data }) => {
        if (data?.avatar_url) setPartnerAvatar(data.avatar_url);
        if (data?.full_name) setProfileFullName(data.full_name);
      });
    });
  }, [user?.id]);

  useEffect(() => {
    sessionStorage.setItem("partner_demo_mode", demoMode ? "true" : "false");
  }, [demoMode]);

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
        avatarUrl={partnerAvatar}
        onComplete={() => {
          setShowSplash(false);
          sessionStorage.setItem("partner_splash_ts", String(Date.now()));
        }}
      />
    );
  }

  return (
    <DemoModeContext.Provider value={{ demoMode, setDemoMode }}>
      <div
        className={`min-h-screen flex flex-col relative admin-panel ${isDark ? "landing-dark partner-console" : ""}`}
        style={isDark ? { background: "#0a0a14" } : undefined}
      >
        {isDark && (
          <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 1 }}>
            <EmpireDNABackground />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 20% 30%, rgba(167,139,250,0.06), transparent 70%), radial-gradient(ellipse 50% 50% at 80% 70%, rgba(99,102,241,0.05), transparent 60%)",
              }}
            />
          </div>
        )}

        <div
          className="sticky top-0 z-50 w-full safe-top"
          style={{
            background: isDark ? "rgba(9,10,24,0.98)" : "rgba(255,255,255,0.96)",
            backdropFilter: "blur(24px) saturate(1.8)",
            WebkitBackdropFilter: "blur(24px) saturate(1.8)",
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.28)" : "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between px-4 lg:px-8 h-14 max-w-[1600px] mx-auto w-full gap-3">
            <div className="flex items-center gap-2.5 lg:gap-4 flex-shrink-0 min-w-0">
              <button
                onClick={() => navigate("/home")}
                className="flex items-center justify-center w-8 h-8 rounded-xl transition-colors flex-shrink-0"
                style={{
                  background: isDark ? "rgba(16,18,36,0.96)" : "rgba(255,255,255,0.96)",
                  color: accentColor,
                  border: `1px solid ${accentColor}33`,
                  boxShadow: isDark ? "0 6px 18px rgba(0,0,0,0.22)" : "0 6px 18px rgba(0,0,0,0.08)",
                }}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-sm lg:text-base font-bold text-foreground tracking-tight">Partner</span>

              {/* Desktop horizontal nav */}
              <nav className="hidden lg:flex items-center gap-1 ml-4">
                {NAV_ITEMS_FULL.filter((item) => (demoMode ? item.showInDemo : true)).map((item) => {
                  const active = isActive(item.path, item.exact);
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-xs font-semibold"
                      style={{
                        background: active
                          ? (isDark ? "rgba(16,18,36,0.98)" : "rgba(255,255,255,0.98)")
                          : "transparent",
                        border: `1px solid ${active ? accentColor + "44" : "transparent"}`,
                        color: active ? accentColor : (isDark ? "#9ca3af" : "#6b7280"),
                        boxShadow: active ? `0 4px 14px ${accentColor}22` : "none",
                      }}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.span
                animate={{ opacity: demoMode ? 0.4 : 1 }}
                className="text-[9px] font-bold uppercase tracking-[0.15em] hidden sm:inline"
                style={{ color: "#a78bfa" }}
              >
                Live
              </motion.span>

              <div
                className="relative flex items-center w-[56px] h-[30px] rounded-full select-none cursor-pointer overflow-hidden"
                style={{
                  background: demoMode
                    ? "linear-gradient(135deg, rgba(28,20,10,0.98), rgba(42,31,20,0.98))"
                    : "linear-gradient(135deg, rgba(15,14,31,0.98), rgba(26,21,48,0.98))",
                  border: `1.5px solid ${demoMode ? "rgba(212,160,82,0.34)" : "rgba(167,139,250,0.3)"}`,
                  boxShadow: `0 0 24px ${demoMode ? "rgba(212,160,82,0.12)" : "rgba(167,139,250,0.1)"}, inset 0 1px 2px rgba(255,255,255,0.06)`,
                }}
                onClick={() => handleToggle(!demoMode)}
              >
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

                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    background: `radial-gradient(circle at ${demoMode ? "78%" : "22%"} 50%, ${demoMode ? "rgba(212,160,82,0.2)" : "rgba(167,139,250,0.18)"}, transparent 65%)`,
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{ opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }, background: { duration: 0.4 } }}
                />

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
                      {demoMode ? <Presentation className="w-3 h-3 text-white/95" /> : <Eye className="w-3 h-3 text-white/95" />}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>

              <motion.span
                animate={{ opacity: demoMode ? 1 : 0.4 }}
                className="text-[9px] font-bold uppercase tracking-[0.15em] hidden sm:inline"
                style={{ color: "#d4a052" }}
              >
                Demo
              </motion.span>

              <div className="flex items-center gap-1.5 ml-1">
                <DarkModeToggle />
                <button
                  onClick={async () => {
                    await signOut();
                    navigate("/auth");
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-xl transition-colors"
                  style={{
                    background: isDark ? "rgba(16,18,36,0.96)" : "rgba(255,255,255,0.96)",
                    color: "#9ca3af",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                    boxShadow: isDark ? "0 6px 18px rgba(0,0,0,0.22)" : "0 6px 18px rgba(0,0,0,0.08)",
                  }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20 lg:pb-6 relative z-10">
          <div className="max-w-[1600px] mx-auto w-full px-0 lg:px-6">
            <Outlet />
          </div>
        </div>

        <nav
          className="fixed bottom-0 left-0 right-0 z-50 safe-bottom lg:hidden"
          style={{
            background: isDark ? "rgba(9,10,24,0.98)" : "rgba(255,255,255,0.96)",
            backdropFilter: "blur(28px) saturate(2)",
            WebkitBackdropFilter: "blur(28px) saturate(2)",
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark ? "0 -10px 34px rgba(0,0,0,0.34)" : "0 -4px 16px rgba(0,0,0,0.05)",
          }}
        >
          <motion.div
            className="absolute top-0 left-0 right-0 h-[1px]"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ background: `linear-gradient(90deg, transparent 10%, ${accentColor}60 50%, transparent 90%)` }}
          />
          <div className="grid h-16 grid-cols-7 items-center gap-1 max-w-lg mx-auto px-1.5">
            {NAV_ITEMS_FULL.filter((item) => (demoMode ? item.showInDemo : true)).map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  whileTap={{ scale: 0.9 }}
                  className="flex min-w-0 flex-col items-center gap-0.5 px-1 py-1.5 rounded-2xl transition-all relative"
                  style={active ? {
                    background: isDark ? "rgba(16,18,36,0.98)" : "rgba(255,255,255,0.98)",
                    border: `1px solid ${accentColor}33`,
                    boxShadow: isDark ? "0 8px 20px rgba(0,0,0,0.24)" : "0 8px 20px rgba(0,0,0,0.08)",
                  } : undefined}
                >
                  {active && (
                    <>
                      <motion.div
                        layoutId="partner-nav-indicator"
                        className="absolute -top-1 w-8 h-[3px] rounded-full"
                        style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`, boxShadow: `0 0 10px ${accentColor}50` }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        animate={{ opacity: [0.05, 0.1, 0.05] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{
                          background: isDark
                            ? `radial-gradient(circle at 50% 30%, ${accentColor}18, rgba(10,10,22,0.94) 72%)`
                            : `radial-gradient(circle at 50% 30%, ${accentColor}16, rgba(255,255,255,0.96) 72%)`,
                        }}
                      />
                    </>
                  )}
                  <motion.div animate={active ? { y: [0, -1, 0] } : {}} transition={{ duration: 2, repeat: Infinity }}>
                    <item.icon className="w-5 h-5" style={{ color: active ? accentColor : "#6b7280", filter: active ? `drop-shadow(0 0 6px ${accentColor}50)` : "none" }} />
                  </motion.div>
                  <span className="max-w-full truncate text-[8px] font-semibold leading-none" style={{ color: active ? accentColor : "#6b7280" }}>{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        <PartnerVoiceAgent
          activeTab={resolvePartnerVoiceTab(location.pathname)}
          demoMode={demoMode}
        />

        {/* Voice Agent FAB — limitato ai dati del partner (max privacy) */}
        <PartnerVoiceOrchestratorFAB />
      </div>
    </DemoModeContext.Provider>
  );
}
