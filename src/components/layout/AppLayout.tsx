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

  return (
    <SidebarProvider>
      <EmpireDNABackground />
      <div className="min-h-[100dvh] flex w-full bg-background relative overflow-hidden">
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
