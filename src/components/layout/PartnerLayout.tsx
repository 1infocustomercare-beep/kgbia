import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Target, DollarSign, FolderOpen, User, LogOut, ArrowLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/partner", icon: LayoutDashboard, label: "Home", exact: true },
  { path: "/partner/leads", icon: Target, label: "Leads" },
  { path: "/partner/earnings", icon: DollarSign, label: "Guadagni" },
  { path: "/partner/portfolio", icon: FolderOpen, label: "Portfolio" },
  { path: "/partner/profile", icon: User, label: "Profilo" },
];

export default function PartnerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Partner";

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className={`min-h-screen flex flex-col relative admin-panel ${isDark ? 'landing-dark partner-console' : ''}`}
      style={isDark ? { background: "#0a0a14" } : undefined}>

      {/* ═══ TOP BAR ═══ */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b border-border/50 safe-top bg-background/95 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#a78bfa" }}>
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
          <span className="text-sm font-bold text-foreground ml-2">Partner Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold uppercase" style={{ background: "rgba(167,139,250,0.2)", color: "#a78bfa" }}>
              {userName.charAt(0)}
            </div>
            <span className="text-xs font-medium max-w-[100px] truncate text-foreground">{userName}</span>
          </div>
          <DarkModeToggle />
          <button onClick={async () => { await signOut(); navigate("/auth"); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ═══ PAGE CONTENT ═══ */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      {/* ═══ BOTTOM NAV ═══ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom bg-background/95 backdrop-blur-xl border-t border-border/50">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path, item.exact);
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all relative min-w-[52px]">
                {active && (
                  <motion.div layoutId="partner-nav-indicator"
                    className="absolute -top-1 w-8 h-1 rounded-full"
                    style={{ background: "#a78bfa" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <item.icon className="w-5 h-5" style={{ color: active ? "#a78bfa" : "#6b7280" }} />
                <span className="text-[9px] font-semibold" style={{ color: active ? "#a78bfa" : "#6b7280" }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
