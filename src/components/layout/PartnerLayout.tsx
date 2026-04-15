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

        {/* ═══ PREMIUM SLIDER TOGGLE ═══ */}
        <PremiumModeSlider demoMode={demoMode} onToggle={handleToggle} />

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

/* ═══ PREMIUM MODE SLIDER ═══ */
function PremiumModeSlider({ demoMode, onToggle }: { demoMode: boolean; onToggle: (v: boolean) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(demoMode ? 1 : 0);
  const progress = useTransform(x, [0, 1], [0, 100]);
  const bgOpacity = useTransform(x, [0, 0.5, 1], [0, 0.15, 0.3]);

  const TRACK_W = 120;
  const THUMB_W = 36;
  const TRAVEL = TRACK_W - THUMB_W - 4;

  const thumbX = useTransform(x, [0, 1], [0, TRAVEL]);

  const handleDragEnd = useCallback(() => {
    const current = x.get();
    if (current > 0.5 && !demoMode) {
      animate(x, 1, { type: "spring", stiffness: 400, damping: 25 });
      onToggle(true);
    } else if (current <= 0.5 && demoMode) {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 25 });
      onToggle(false);
    } else {
      animate(x, demoMode ? 1 : 0, { type: "spring", stiffness: 400, damping: 25 });
    }
  }, [demoMode, onToggle, x]);

  const handleTap = useCallback(() => {
    const next = !demoMode;
    animate(x, next ? 1 : 0, { type: "spring", stiffness: 400, damping: 25 });
    onToggle(next);
  }, [demoMode, onToggle, x]);

  useEffect(() => {
    animate(x, demoMode ? 1 : 0, { type: "spring", stiffness: 400, damping: 25 });
  }, [demoMode]);

  return (
    <div className="flex items-center gap-2">
      {/* Label left */}
      <motion.span
        className="text-[9px] font-bold uppercase tracking-widest"
        animate={{ opacity: demoMode ? 0.35 : 1, color: demoMode ? "#6b7280" : "#a78bfa" }}
      >
        Live
      </motion.span>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative select-none cursor-pointer overflow-hidden"
        style={{
          width: TRACK_W,
          height: 32,
          borderRadius: 16,
          background: "linear-gradient(135deg, #0d0d1a, #151520)",
          border: `1px solid ${demoMode ? "rgba(212,160,82,0.2)" : "rgba(167,139,250,0.15)"}`,
          boxShadow: `inset 0 2px 8px rgba(0,0,0,0.4), 0 0 20px ${demoMode ? "rgba(212,160,82,0.06)" : "rgba(167,139,250,0.04)"}`,
        }}
        onClick={handleTap}
      >
        {/* Animated fill */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            opacity: bgOpacity,
            background: demoMode
              ? "linear-gradient(90deg, transparent, #d4a052)"
              : "linear-gradient(90deg, #a78bfa, transparent)",
          }}
        />

        {/* Sparkle particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + i,
              height: 2 + i,
              top: 8 + (i % 2) * 14,
              background: demoMode ? "#d4a052" : "#a78bfa",
            }}
            animate={{
              x: demoMode ? [TRACK_W * 0.2, TRACK_W * 0.8] : [TRACK_W * 0.8, TRACK_W * 0.2],
              opacity: [0, 0.7, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        {/* Progress line */}
        <motion.div
          className="absolute bottom-[2px] left-[10%] h-[2px] rounded-full"
          style={{
            width: progress.get() ? `${Math.min(progress.get(), 80)}%` : "0%",
            background: demoMode
              ? "linear-gradient(90deg, rgba(212,160,82,0.6), rgba(212,160,82,0.1))"
              : "linear-gradient(90deg, rgba(167,139,250,0.1), rgba(167,139,250,0.6))",
          }}
          animate={{
            width: demoMode ? "80%" : "0%",
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Draggable Thumb */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: TRAVEL }}
          dragElastic={0.08}
          dragMomentum={false}
          style={{ x: thumbX }}
          onDragEnd={handleDragEnd}
          onClick={(e) => e.stopPropagation()}
          onDrag={(_, info) => {
            const pct = Math.max(0, Math.min(1, (info.point.x - (trackRef.current?.getBoundingClientRect().left || 0) - THUMB_W / 2) / TRAVEL));
            x.set(pct);
          }}
          className="absolute top-[2px] left-[2px] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          initial={false}
          animate={{
            boxShadow: demoMode
              ? "0 2px 14px rgba(212,160,82,0.5), 0 0 20px rgba(212,160,82,0.15)"
              : "0 2px 14px rgba(167,139,250,0.45), 0 0 20px rgba(167,139,250,0.12)",
          }}
          style={{
            x: thumbX,
            width: THUMB_W,
            height: THUMB_W - 8,
            background: demoMode
              ? "linear-gradient(145deg, #d4a052, #b8863a)"
              : "linear-gradient(145deg, #a78bfa, #7c3aed)",
          }}
        >
          {/* Icon with rotation */}
          <motion.div
            animate={{ rotateY: demoMode ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {demoMode
              ? <Presentation className="w-3.5 h-3.5 text-white/90" />
              : <Eye className="w-3.5 h-3.5 text-white/90" />}
          </motion.div>

          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              border: `1px solid ${demoMode ? "rgba(212,160,82,0.4)" : "rgba(167,139,250,0.3)"}`,
            }}
          />
        </motion.div>
      </div>

      {/* Label right */}
      <motion.span
        className="text-[9px] font-bold uppercase tracking-widest"
        animate={{ opacity: demoMode ? 1 : 0.35, color: demoMode ? "#d4a052" : "#6b7280" }}
      >
        Demo
      </motion.span>
    </div>
  );
}