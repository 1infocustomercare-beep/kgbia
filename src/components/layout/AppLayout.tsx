import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { useIndustry } from "@/hooks/useIndustry";
import { motion } from "framer-motion";

export default function AppLayout() {
  const { industry, loading, resolved } = useIndustry();

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
      <div className="min-h-[100dvh] flex w-full bg-background relative overflow-hidden">
        {/* Subtle cyber grid */}
        <div className="fixed inset-0 cyber-grid pointer-events-none opacity-30 z-0" />

        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <TopBar />
          <motion.main
            className="flex-1 p-3 md:p-6 overflow-auto pb-20 md:pb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.main>
        </div>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
}
