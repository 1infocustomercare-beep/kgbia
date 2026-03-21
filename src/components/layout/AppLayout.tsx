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
  const sectorAccents: Record<string, string> = {
    beauty: "#D4A0A0", healthcare: "#4AAED9", fitness: "#F97316",
    hospitality: "#B8860B", retail: "#8B7355", beach: "#38BDF8",
    ncc: "#A0A0A0", legal: "#6366F1", accounting: "#059669",
    construction: "#D97706", photography: "#EC4899", events: "#A855F7",
    plumber: "#3B82F6", electrician: "#FBBF24", agriturismo: "#22C55E",
    cleaning: "#06B6D4", garage: "#EF4444", gardening: "#16A34A",
    veterinary: "#F472B6", tattoo: "#A78BFA", childcare: "#FB923C",
    education: "#818CF8", logistics: "#64748B", custom: "#C8963E",
  };
  const sectorAccent = sectorAccents[industry] || "#C8963E";

  return (
    <SidebarProvider>
      
      <div className="min-h-[100dvh] flex w-full relative overflow-hidden" style={{ background: `linear-gradient(145deg, hsl(228 22% 6%) 0%, hsl(230 20% 7%) 40%, hsl(228 18% 8%) 100%)` }}>
        {/* Premium sector-themed admin background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] rounded-full opacity-[0.06]"
            style={{ background: `radial-gradient(circle, ${sectorAccent}, transparent 65%)`, filter: "blur(140px)" }} />
          <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
            style={{ background: `radial-gradient(circle, ${sectorAccent}, transparent 70%)`, filter: "blur(160px)" }} />
          <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full opacity-[0.025]"
            style={{ background: `radial-gradient(circle, ${sectorAccent}, transparent 60%)`, filter: "blur(120px)" }} />
          <div className="absolute inset-0" style={{ opacity: 0.015, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
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
