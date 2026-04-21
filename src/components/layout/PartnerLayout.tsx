import { useState, useEffect, createContext, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  LayoutDashboard, Target, DollarSign, FolderOpen, User, LogOut, ArrowLeft,
  Eye, Presentation, Zap, Palette, MoreHorizontal,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PartnerSplashScreen from "@/components/partner/PartnerSplashScreen";
import EmpireDNABackground from "@/components/EmpireDNABackground";
import PartnerVoiceAgent from "@/components/partner/PartnerVoiceAgent";
import PartnerVoiceOrchestratorFAB from "@/components/partner/PartnerVoiceOrchestratorFAB";
import CoachEmpireDrawer from "@/components/partner/CoachEmpireDrawer";
import SellerOnboardingTour from "@/components/partner/SellerOnboardingTour";
import SellerOnboardingChecklist from "@/components/partner/SellerOnboardingChecklist";
import DailyBriefToast from "@/components/partner/DailyBriefToast";
import {
  Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { usePartnerReveal } from "@/hooks/usePartnerReveal";

const DemoModeContext = createContext<{ demoMode: boolean; setDemoMode: (v: boolean) => void }>({ demoMode: false, setDemoMode: () => {} });
export const usePartnerDemoMode = () => useContext(DemoModeContext);

type NavItem = {
  path: string;
  icon: typeof LayoutDashboard;
  label: string;
  exact?: boolean;
  showInDemo: boolean;
  primary: boolean; // primary = visible in mobile bottom nav
};

const NAV_ITEMS_FULL: NavItem[] = [
  { path: "/partner", icon: LayoutDashboard, label: "Home", exact: true, showInDemo: true, primary: true },
  { path: "/partner/leads", icon: Target, label: "Leads", showInDemo: false, primary: true },
  { path: "/partner/portfolio", icon: FolderOpen, label: "Portfolio", showInDemo: true, primary: true },
  { path: "/partner/earnings", icon: DollarSign, label: "Guadagni", showInDemo: false, primary: true },
  { path: "/partner/profile", icon: User, label: "Profilo", showInDemo: false, primary: false },
  { path: "/partner/api-connections", icon: Zap, label: "API", showInDemo: false, primary: false },
  { path: "/partner/custom-preview", icon: Palette, label: "Preview", showInDemo: false, primary: false },
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
  const [moreOpen, setMoreOpen] = useState(false);
  const userName = profileFullName || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Partner";

  // Auto-reveal cards/sections inside the partner shell as they scroll into view
  usePartnerReveal();

  // Scroll-driven header shrink (wow factor)
  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 80], [56, 48]);
  const headerBlur = useTransform(scrollY, [0, 80], [16, 28]);
  const headerOpacity = useTransform(scrollY, [0, 80], [0.96, 0.99]);

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

  // Close "more" sheet on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

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
  const visibleItems = NAV_ITEMS_FULL.filter((item) => (demoMode ? item.showInDemo : true));
  const primaryItems = visibleItems.filter((i) => i.primary);
  const secondaryItems = visibleItems.filter((i) => !i.primary);

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
        className={`min-h-screen flex flex-col relative admin-panel partner-toaster-zone ${isDark ? "landing-dark partner-console" : ""}`}
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

        {/* ═══ STICKY HEADER (scroll-shrinking, wow factor) ═══ */}
        <motion.div
          className="sticky top-0 z-50 w-full safe-top"
          style={{
            background: isDark
              ? `rgba(9,10,24,${headerOpacity.get()})`
              : `rgba(255,255,255,${headerOpacity.get()})`,
            backdropFilter: `blur(${headerBlur.get()}px) saturate(1.8)`,
            WebkitBackdropFilter: `blur(${headerBlur.get()}px) saturate(1.8)`,
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.28)" : "0 8px 24px rgba(0,0,0,0.06)",
          }}
        >
          <motion.div
            className="flex items-center justify-between px-3 lg:px-8 max-w-[1600px] mx-auto w-full gap-2 lg:gap-3"
            style={{ height: headerHeight }}
          >
            <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0 min-w-0">
              <button
                onClick={() => navigate("/home")}
                aria-label="Torna alla home"
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:scale-105 active:scale-95 flex-shrink-0"
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
                {visibleItems.map((item) => {
                  const active = isActive(item.path, item.exact);
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-xs font-semibold hover:scale-[1.02] active:scale-95"
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

            <div className="flex items-center gap-1.5 lg:gap-2 flex-shrink-0">
              <motion.span
                animate={{ opacity: demoMode ? 0.35 : 1 }}
                className="hidden sm:inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: demoMode ? "#9ca3af" : "#a78bfa" }}
              >
                {!demoMode && <span className="partner-status-dot" aria-hidden style={{ background: "#a78bfa" }} />}
                Live
              </motion.span>

              <div
                className="relative flex items-center w-[52px] h-[28px] rounded-full select-none cursor-pointer overflow-hidden"
                style={{
                  background: demoMode
                    ? "linear-gradient(135deg, rgba(28,20,10,0.98), rgba(42,31,20,0.98))"
                    : "linear-gradient(135deg, rgba(15,14,31,0.98), rgba(26,21,48,0.98))",
                  border: `1.5px solid ${demoMode ? "rgba(212,160,82,0.34)" : "rgba(167,139,250,0.3)"}`,
                  boxShadow: `0 0 24px ${demoMode ? "rgba(212,160,82,0.12)" : "rgba(167,139,250,0.1)"}, inset 0 1px 2px rgba(255,255,255,0.06)`,
                }}
                onClick={() => handleToggle(!demoMode)}
                role="switch"
                aria-checked={demoMode}
                aria-label="Modalità Demo"
              >
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
                  dragConstraints={{ left: 0, right: 24 }}
                  dragElastic={0.05}
                  dragMomentum={false}
                  animate={{ x: demoMode ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  onDragEnd={(_e, info) => {
                    if (!demoMode && info.offset.x > 10) handleToggle(true);
                    else if (demoMode && info.offset.x < -10) handleToggle(false);
                  }}
                  className="relative top-0 left-[2px] h-[24px] w-[24px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
                  style={{
                    background: demoMode
                      ? "linear-gradient(145deg, #d4a052, #b8892e)"
                      : "linear-gradient(145deg, #a78bfa, #7c3aed)",
                    boxShadow: `0 2px 12px ${demoMode ? "rgba(212,160,82,0.55)" : "rgba(124,58,237,0.5)"}, 0 0 20px ${demoMode ? "rgba(212,160,82,0.2)" : "rgba(124,58,237,0.15)"}`,
                  }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                >
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
                animate={{ opacity: demoMode ? 1 : 0.35 }}
                className="hidden sm:inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: demoMode ? "#d4a052" : "#9ca3af" }}
              >
                Demo
              </motion.span>

              <div className="flex items-center gap-1 ml-1">
                <DarkModeToggle />
                <button
                  onClick={async () => {
                    await signOut();
                    navigate("/auth");
                  }}
                  aria-label="Esci"
                  className="flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:scale-105 active:scale-95"
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
          </motion.div>
        </motion.div>

        {/* ═══ MAIN CONTENT — animated page transitions ═══ */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 partner-mobile-content-safe">
          <div className="max-w-[1600px] mx-auto w-full px-0 lg:px-6 partner-page-shell">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ═══ MOBILE BOTTOM NAV — adaptive (4–5 primary + More drawer) ═══ */}
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
            className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ background: `linear-gradient(90deg, transparent 10%, ${accentColor}60 50%, transparent 90%)` }}
          />
          <div
            className="grid h-16 items-center gap-1 max-w-md mx-auto px-2"
            style={{
              gridTemplateColumns: `repeat(${primaryItems.length + (secondaryItems.length > 0 ? 1 : 0)}, minmax(0, 1fr))`,
            }}
          >
            {primaryItems.map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  whileTap={{ scale: 0.88 }}
                  className="flex min-w-0 flex-col items-center justify-center gap-0.5 py-1.5 rounded-2xl transition-all relative h-full"
                  style={active ? {
                    background: isDark ? "rgba(16,18,36,0.98)" : "rgba(255,255,255,0.98)",
                    border: `1px solid ${accentColor}33`,
                    boxShadow: isDark ? "0 8px 20px rgba(0,0,0,0.24)" : "0 8px 20px rgba(0,0,0,0.08)",
                  } : undefined}
                >
                  {active && (
                    <motion.div
                      layoutId="partner-nav-indicator"
                      className="absolute -top-[1px] w-10 h-[3px] rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`,
                        boxShadow: `0 0 10px ${accentColor}50`,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <motion.div animate={active ? { y: [0, -1, 0] } : {}} transition={{ duration: 2, repeat: Infinity }}>
                    <item.icon
                      className="w-[22px] h-[22px]"
                      style={{
                        color: active ? accentColor : "#6b7280",
                        filter: active ? `drop-shadow(0 0 6px ${accentColor}50)` : "none",
                      }}
                    />
                  </motion.div>
                  <span
                    className="max-w-full truncate text-[9px] font-semibold leading-none"
                    style={{ color: active ? accentColor : "#6b7280" }}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })}

            {/* "More" drawer trigger */}
            {secondaryItems.length > 0 && (
              <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
                <SheetTrigger asChild>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    aria-label="Altre sezioni"
                    className="flex min-w-0 flex-col items-center justify-center gap-0.5 py-1.5 rounded-2xl transition-all relative h-full"
                    style={secondaryItems.some((i) => isActive(i.path, i.exact)) ? {
                      background: isDark ? "rgba(16,18,36,0.98)" : "rgba(255,255,255,0.98)",
                      border: `1px solid ${accentColor}33`,
                      boxShadow: isDark ? "0 8px 20px rgba(0,0,0,0.24)" : "0 8px 20px rgba(0,0,0,0.08)",
                    } : undefined}
                  >
                    <MoreHorizontal
                      className="w-[22px] h-[22px]"
                      style={{
                        color: secondaryItems.some((i) => isActive(i.path, i.exact)) ? accentColor : "#6b7280",
                      }}
                    />
                    <span
                      className="text-[9px] font-semibold leading-none"
                      style={{
                        color: secondaryItems.some((i) => isActive(i.path, i.exact)) ? accentColor : "#6b7280",
                      }}
                    >
                      Altro
                    </span>
                  </motion.button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-3xl pb-8 safe-bottom">
                  <SheetHeader className="text-left mb-4">
                    <SheetTitle className="text-base">Altre sezioni Partner</SheetTitle>
                  </SheetHeader>
                  <div className="grid grid-cols-2 gap-3">
                    {secondaryItems.map((item) => {
                      const active = isActive(item.path, item.exact);
                      return (
                        <button
                          key={item.path}
                          onClick={() => {
                            setMoreOpen(false);
                            navigate(item.path);
                          }}
                          className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95"
                          style={{
                            background: active
                              ? `${accentColor}14`
                              : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"),
                            border: `1px solid ${active ? accentColor + "44" : "transparent"}`,
                          }}
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              background: `${accentColor}1a`,
                              color: accentColor,
                            }}
                          >
                            <item.icon className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-semibold text-foreground">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </nav>

        <PartnerVoiceAgent
          activeTab={resolvePartnerVoiceTab(location.pathname)}
          demoMode={demoMode}
        />

        {/* Voice Agent FAB — limitato ai dati del partner (max privacy) */}
        <PartnerVoiceOrchestratorFAB />

        {/* Coach Empire: drawer aiuto contestuale + tour onboarding + brief mattutino AI */}
        <CoachEmpireDrawer />
        <SellerOnboardingTour />
        <SellerOnboardingChecklist />
        <DailyBriefToast />
      </div>
    </DemoModeContext.Provider>
  );
}
