import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, DollarSign, LogOut,
  Crown, TrendingUp, Trophy,
  ChevronRight, Sparkles,
  Play, Target, CreditCard, BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PartnerSandbox from "@/components/partner/PartnerSandbox";
import PartnerEarnings from "@/components/partner/PartnerEarnings";
import PartnerRecruitment from "@/components/partner/PartnerRecruitment";
import PricingClosing from "@/components/partner/PricingClosing";
import ROICalculator from "@/components/partner/ROICalculator";
import PartnerSalesToolkit from "@/components/partner/PartnerSalesToolkit";
import EmpireAssistant from "@/components/admin/EmpireAssistant";

type Tab = "dashboard" | "sandbox" | "toolkit" | "earnings" | "pricing" | "recruitment";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [showROI, setShowROI] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  const stats = [
    { label: "Vendite Chiuse", value: "3", icon: <Trophy className="w-5 h-5" />, color: "text-primary" },
    { label: "Commissioni Totali", value: "€2.991", icon: <DollarSign className="w-5 h-5" />, color: "text-emerald-400" },
    { label: "Lead Attivi", value: "12", icon: <Target className="w-5 h-5" />, color: "text-sky-400" },
    { label: "Tasso Conversione", value: "25%", icon: <TrendingUp className="w-5 h-5" />, color: "text-amber-400" },
  ];

  const bottomTabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Home", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "sandbox", label: "Demo", icon: <Play className="w-5 h-5" /> },
    { id: "toolkit", label: "Vendita", icon: <BookOpen className="w-5 h-5" /> },
    { id: "pricing", label: "Prezzi", icon: <CreditCard className="w-5 h-5" /> },
    { id: "earnings", label: "Guadagni", icon: <DollarSign className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border/50 bg-card/50 safe-top">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-display font-bold text-foreground">Empire Partner</h1>
            <p className="text-[10px] text-primary">{bottomTabs.find(t => t.id === activeTab)?.label}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-secondary min-w-[40px] min-h-[40px] flex items-center justify-center">
          <LogOut className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Welcome */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-amber-500/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary tracking-wider uppercase">Benvenuto, Partner</span>
                </div>
                <h2 className="text-xl font-display font-bold text-foreground">Il tuo Impero cresce</h2>
                <p className="text-sm text-muted-foreground mt-1">Chiudi contratti, guadagna €997 per vendita. Nessun limite.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                {stats.map((s, i) => (
                  <motion.div key={i} className="p-4 rounded-xl bg-card border border-border/50" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className={`${s.color} mb-2`}>{s.icon}</div>
                    <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Azioni Rapide</h3>
                {[
                  { label: "Apri Demo Guidata", desc: "Tour automatico per vendere", icon: <Play className="w-5 h-5" />, tab: "sandbox" as Tab },
                  { label: "Schede Vendita", desc: "Tutte le funzionalità dettagliate", icon: <BookOpen className="w-5 h-5" />, tab: "toolkit" as Tab },
                  { label: "Mostra i Prezzi", desc: "Plan A + B per il ristoratore", icon: <CreditCard className="w-5 h-5" />, tab: "pricing" as Tab },
                  { label: "Calcola il ROI", desc: "Quanto risparmia il cliente", icon: <TrendingUp className="w-5 h-5" />, action: () => setShowROI(true) },
                  { label: "Controlla i Guadagni", desc: "Storico vendite e payout", icon: <DollarSign className="w-5 h-5" />, tab: "earnings" as Tab },
                ].map((action, i) => (
                  <motion.button key={i} onClick={() => action.action ? action.action() : action.tab && setActiveTab(action.tab)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors text-left"
                    whileTap={{ scale: 0.98 }}>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{action.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </motion.button>
                ))}
              </div>

              {/* Partner Incentive Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-center">
                <p className="text-sm font-display font-bold text-foreground">
                  Tua Commissione: <span className="text-emerald-400">€997</span> per vendita
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  "Vendi l'unica app che si presenta da sola. Guadagna €1.000 a contratto senza essere un venditore."
                </p>
              </div>
            </motion.div>
          )}
          {activeTab === "sandbox" && <PartnerSandbox key="sandbox" />}
          {activeTab === "toolkit" && <PartnerSalesToolkit key="toolkit" />}
          {activeTab === "pricing" && <PricingClosing key="pricing" onOpenROI={() => setShowROI(true)} />}
          {activeTab === "earnings" && <PartnerEarnings key="earnings" />}
          {activeTab === "recruitment" && <PartnerRecruitment key="recruitment" />}
        </AnimatePresence>
      </div>

      {/* Empire Assistant */}
      <EmpireAssistant />

      {/* ROI Calculator Modal */}
      <ROICalculator open={showROI} onClose={() => setShowROI(false)} />

      {/* Bottom Tabs */}
      <div className="fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur-xl border-t border-border/50 safe-bottom z-50">
        <div className="flex items-center justify-around px-1 py-2">
          {bottomTabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all min-h-[44px]
                ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"}`}>
              {tab.icon}
              <span className="text-[9px] font-medium">{tab.label}</span>
              {activeTab === tab.id && <motion.div layoutId="partner-tab" className="w-4 h-0.5 bg-primary rounded-full" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
