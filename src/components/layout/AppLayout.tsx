import { Outlet, Navigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { useIndustry } from "@/hooks/useIndustry";
import { motion, AnimatePresence } from "framer-motion";


import PageGuide from "@/components/ui/page-guide";

export default function AppLayout() {
  const { industry, loading, resolved } = useIndustry();
  const location = useLocation();

  // Wait until industry is fully resolved before making routing decisions
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

  // Food users must use /dashboard exclusively — only redirect AFTER resolved
  if (industry === "food") {
    return <Navigate to="/dashboard" replace />;
  }

  // Sector accent color for premium background
  const sectorAccent = industry === "beauty" ? "#D4A0A0" : industry === "healthcare" ? "#4AAED9" : industry === "fitness" ? "#F97316"
    : industry === "hotel" || industry === "hospitality" ? "#B8860B" : industry === "retail" ? "#8B7355" : industry === "beach" ? "#38BDF8"
    : industry === "ncc" ? "#A0A0A0" : industry === "legal" ? "#6366F1" : industry === "accountant" ? "#059669"
    : industry === "construction" ? "#D97706" : industry === "photographer" ? "#EC4899" : industry === "events" ? "#A855F7"
    : "#C8963E";

  return (
    <SidebarProvider>
      
      <div className="min-h-[100dvh] flex w-full relative overflow-hidden" style={{ background: "linear-gradient(145deg, #0c0a14 0%, #0a0a12 40%, #0d0b10 100%)" }}>
        {/* Premium sector-themed admin background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] rounded-full opacity-[0.05]"
            style={{ background: `radial-gradient(circle, ${sectorAccent}, transparent 65%)`, filter: "blur(120px)" }} />
          <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.035]"
            style={{ background: `radial-gradient(circle, ${sectorAccent}, transparent 70%)`, filter: "blur(140px)" }} />
          <div className="absolute inset-0" style={{ opacity: 0.012, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        </div>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <TopBar />
          <main className="flex-1 p-3 md:p-6 overflow-auto pb-20 md:pb-6">
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
