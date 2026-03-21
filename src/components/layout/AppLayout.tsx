import { Outlet, Navigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { useIndustry } from "@/hooks/useIndustry";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminLayout } from "@/config/admin-layout-config";
import { SECTOR_THEMES } from "@/config/sector-themes";
import PageGuide from "@/components/ui/page-guide";

/** Pattern overlay matching each sector's visual archetype */
const PatternOverlay = ({ pattern, accent }: { pattern: string; accent: string }) => {
  if (pattern === "none") return null;
  const styles: Record<string, React.CSSProperties> = {
    grid: {
      opacity: 0.018,
      backgroundImage: `linear-gradient(${accent}12 1px, transparent 1px), linear-gradient(90deg, ${accent}12 1px, transparent 1px)`,
      backgroundSize: "60px 60px",
    },
    dots: {
      opacity: 0.025,
      backgroundImage: `radial-gradient(circle, ${accent}20 1px, transparent 1px)`,
      backgroundSize: "30px 30px",
    },
    mesh: {
      opacity: 0.015,
      backgroundImage: `radial-gradient(ellipse at 20% 50%, ${accent}10 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, ${accent}08 0%, transparent 50%)`,
      backgroundSize: "100% 100%",
    },
    diagonal: {
      opacity: 0.02,
      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, ${accent}08 40px, ${accent}08 41px)`,
      backgroundSize: "100% 100%",
    },
  };
  return <div className="absolute inset-0" style={styles[pattern] || {}} />;
};

export default function AppLayout() {
  const { roles } = useAuth();
  const { industry, loading, resolved, company } = useIndustry();
  const location = useLocation();

  if (roles.includes("super_admin")) {
    return <Navigate to="/superadmin" replace />;
  }

  if (roles.includes("staff")) {
    return <Navigate to="/staff" replace />;
  }

  if ((roles.includes("partner") || roles.includes("team_leader")) && !roles.includes("restaurant_admin")) {
    return <Navigate to="/partner" replace />;
  }

  if (roles.includes("customer") && !roles.includes("restaurant_admin")) {
    return <Navigate to="/onboarding" replace />;
  }

  if (loading || !resolved) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="w-10 h-10 rounded-xl border-2 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Only redirect to /dashboard if the user actually HAS a food business
  // (company is not null and industry is food). Without this check,
  // users with no company default to "food" and enter an infinite redirect loop.
  if (company && industry === "food") {
    return <Navigate to="/dashboard" replace />;
  }

  // Sector-specific layout config & theme from the preview system
  const layout = getAdminLayout(industry);
  const theme = SECTOR_THEMES[industry];
  const accentHex = theme?.palette?.accentHex || "#C8963E";

  return (
    <SidebarProvider>
      <div className="min-h-[100dvh] flex w-full relative overflow-hidden landing-dark">
        {/* Opaque base — exact sector bgGradient from admin-layout-config */}
        <div className="fixed inset-0 z-0" style={{ background: layout.bgGradient }} />

        {/* Premium sector aurora glows */}
        <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
          <div
            className="absolute rounded-full"
            style={{
              top: "-8%", right: "5%", width: 650, height: 650,
              background: `radial-gradient(circle, ${accentHex}, transparent 60%)`,
              opacity: layout.accentGlow ? 0.09 : 0.04,
              filter: "blur(130px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              bottom: "5%", left: "-8%", width: 550, height: 550,
              background: `radial-gradient(circle, ${accentHex}, transparent 65%)`,
              opacity: layout.accentGlow ? 0.06 : 0.03,
              filter: "blur(150px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: "35%", left: "45%", width: 400, height: 400,
              background: `radial-gradient(circle, ${accentHex}, transparent 55%)`,
              opacity: 0.025,
              filter: "blur(120px)",
            }}
          />
          <PatternOverlay pattern={layout.bgPattern} accent={accentHex} />
        </div>

        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <TopBar />
          <main className="flex-1 p-3 md:p-6 overflow-auto pb-16 md:pb-6">
            <AnimatePresence mode="sync">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <BottomNav />
        <PageGuide />
      </div>
    </SidebarProvider>
  );
}
