import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, DollarSign, LogOut,
  Crown, TrendingUp, Trophy,
  ChevronRight, Sparkles,
  Play, Target, CreditCard, BookOpen,
  Eye, EyeOff, Briefcase, BarChart3,
  Users, Award, Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PartnerSandbox from "@/components/partner/PartnerSandbox";
import PartnerEarnings from "@/components/partner/PartnerEarnings";
import PartnerRecruitment from "@/components/partner/PartnerRecruitment";
import PricingClosing from "@/components/partner/PricingClosing";
import ROICalculator from "@/components/partner/ROICalculator";
import PartnerSalesToolkit from "@/components/partner/PartnerSalesToolkit";
import InvestmentSummary from "@/components/partner/InvestmentSummary";
import EmpireAssistant from "@/components/admin/EmpireAssistant";

type Tab = "dashboard" | "sandbox" | "toolkit" | "earnings" | "pricing" | "recruitment" | "investment" | "team";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { signOut, isTeamLeader, user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [showROI, setShowROI] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [salesCount, setSalesCount] = useState(0);
  const [monthlyBonuses, setMonthlyBonuses] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    fetchPartnerData();
  }, [user?.id]);

  const fetchPartnerData = async () => {
    if (!user?.id) return;
    // Fetch sales count
    const { data: sales } = await supabase
      .from("partner_sales")
      .select("id")
      .eq("partner_id", user.id);
    setSalesCount(sales?.length || 0);

    // Fetch team members if team leader
    if (isTeamLeader) {
      const { data: team } = await supabase
        .from("partner_teams")
        .select("*, profiles:partner_id(full_name, email)")
        .eq("team_leader_id", user.id);
      setTeamMembers(team || []);
    }

    // Fetch bonuses
    const { data: bonuses } = await supabase
      .from("performance_bonuses")
      .select("*")
      .eq("partner_id", user.id)
      .order("bonus_month", { ascending: false })
      .limit(6);
    setMonthlyBonuses(bonuses || []);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  const totalBonuses = monthlyBonuses.reduce((s, b) => s + Number(b.bonus_amount), 0);
  const estimatedCommissions = salesCount * 997;

  const stats = demoMode ? [
    { label: "Ristoranti Attivi", value: "127", icon: <Briefcase className="w-5 h-5" />, color: "text-primary" },
    { label: "Soddisfazione", value: "98%", icon: <Trophy className="w-5 h-5" />, color: "text-emerald-400" },
    { label: "Funzionalità", value: "21+", icon: <Target className="w-5 h-5" />, color: "text-sky-400" },
    { label: "Crescita Media", value: "+34%", icon: <TrendingUp className="w-5 h-5" />, color: "text-amber-400" },
  ] : isTeamLeader ? [
    { label: "Vendite Personali", value: String(salesCount), icon: <Trophy className="w-5 h-5" />, color: "text-primary" },
    { label: "Commissioni", value: `€${estimatedCommissions.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: "text-emerald-400" },
    { label: "Team Members", value: String(teamMembers.length), icon: <Users className="w-5 h-5" />, color: "text-sky-400" },
    { label: "Bonus Totali", value: `€${totalBonuses.toLocaleString()}`, icon: <Award className="w-5 h-5" />, color: "text-amber-400" },
  ] : [
    { label: "Vendite Chiuse", value: String(salesCount), icon: <Trophy className="w-5 h-5" />, color: "text-primary" },
    { label: "Commissioni", value: `€${estimatedCommissions.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: "text-emerald-400" },
    { label: salesCount >= 3 ? "🎯 Promo Team Leader!" : `${3 - salesCount} vendite a TL`, value: salesCount >= 3 ? "✓" : `${salesCount}/3`, icon: <Star className="w-5 h-5" />, color: "text-sky-400" },
    { label: "Bonus Mese", value: `€${totalBonuses.toLocaleString()}`, icon: <Award className="w-5 h-5" />, color: "text-amber-400" },
  ];

  const bottomTabs: { id: Tab; label: string; icon: React.ReactNode }[] = demoMode ? [
    { id: "dashboard", label: "Home", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "sandbox", label: "Demo", icon: <Play className="w-5 h-5" /> },
    { id: "toolkit", label: "Funzioni", icon: <BookOpen className="w-5 h-5" /> },
    { id: "pricing", label: "Investimento", icon: <CreditCard className="w-5 h-5" /> },
    { id: "investment", label: "Crescita", icon: <BarChart3 className="w-5 h-5" /> },
  ] : [
    { id: "dashboard", label: "Home", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "sandbox", label: "Demo", icon: <Play className="w-5 h-5" /> },
    ...(isTeamLeader ? [{ id: "team" as Tab, label: "Team", icon: <Users className="w-5 h-5" /> }] : []),
    { id: "earnings", label: "Guadagni", icon: <DollarSign className="w-5 h-5" /> },
    { id: "pricing", label: "Prezzi", icon: <CreditCard className="w-5 h-5" /> },
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
            <h1 className="text-sm font-display font-bold text-foreground">
              {demoMode ? "Empire Solutions" : isTeamLeader ? "Empire Team Leader" : "Empire Partner"}
            </h1>
            <p className="text-[10px] text-primary">
              {demoMode ? "Enterprise Preview" : isTeamLeader ? `👑 Team Leader · ${teamMembers.length} membri` : bottomTabs.find(t => t.id === activeTab)?.label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Demo Mode Toggle */}
          <motion.button
            onClick={() => {
              setDemoMode(!demoMode);
              // Reset to dashboard when toggling
              if (activeTab === "earnings" || activeTab === "investment") setActiveTab("dashboard");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
              demoMode
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            whileTap={{ scale: 0.95 }}
            title={demoMode ? "Disattiva Modalità Presentazione" : "Attiva Modalità Presentazione"}
          >
            {demoMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {demoMode ? "LIVE" : "DEMO"}
          </motion.button>
          {!demoMode && (
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-secondary min-w-[40px] min-h-[40px] flex items-center justify-center">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Demo Mode Banner */}
      <AnimatePresence>
        {demoMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-primary/10 to-amber-500/10 border-b border-primary/20 overflow-hidden"
          >
            <div className="px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] text-primary font-semibold tracking-wider uppercase">
                Modalità Presentazione — Dati sensibili nascosti
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Welcome */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-amber-500/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary tracking-wider uppercase">
                    {demoMode ? "Enterprise Preview" : isTeamLeader ? "Benvenuto, Team Leader" : "Benvenuto, Partner"}
                  </span>
                </div>
                <h2 className="text-xl font-display font-bold text-foreground">
                  {demoMode ? "La Suite Completa per la Ristorazione" : isTeamLeader ? "Gestisci il tuo Team" : "Il tuo Impero cresce"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {demoMode 
                    ? "21+ funzionalità integrate. Un'unica soluzione. Proprietà permanente."
                    : isTeamLeader
                      ? `€997 per vendita personale + €200 override per ogni vendita del tuo team.`
                      : "Chiudi contratti, guadagna €997 per vendita. 3 vendite = Team Leader."
                  }
                </p>
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
                <h3 className="text-sm font-semibold text-foreground">
                  {demoMode ? "Esplora la Piattaforma" : "Azioni Rapide"}
                </h3>
                {(demoMode ? [
                  { label: "Demo Interattiva", desc: "Prova l'app dal vivo — 3 viste", icon: <Play className="w-5 h-5" />, tab: "sandbox" as Tab },
                  { label: "Tutte le Funzionalità", desc: "21+ strumenti inclusi nella licenza", icon: <BookOpen className="w-5 h-5" />, tab: "toolkit" as Tab },
                  { label: "Piano Investimento", desc: "Costi, inclusi e garanzie", icon: <CreditCard className="w-5 h-5" />, tab: "pricing" as Tab },
                  { label: "Calcola il ROI", desc: "Quanto risparmia il tuo locale", icon: <TrendingUp className="w-5 h-5" />, action: () => setShowROI(true) },
                  { label: "Proiezione Crescita", desc: "Come crescerà il tuo fatturato", icon: <BarChart3 className="w-5 h-5" />, tab: "investment" as Tab },
                ] : [
                  { label: "Apri Demo Guidata", desc: "Tour automatico per vendere", icon: <Play className="w-5 h-5" />, tab: "sandbox" as Tab },
                  { label: "Schede Vendita", desc: "Tutte le funzionalità dettagliate", icon: <BookOpen className="w-5 h-5" />, tab: "toolkit" as Tab },
                  { label: "Mostra i Prezzi", desc: "Plan A + B per il ristoratore", icon: <CreditCard className="w-5 h-5" />, tab: "pricing" as Tab },
                  { label: "Calcola il ROI", desc: "Quanto risparmia il cliente", icon: <TrendingUp className="w-5 h-5" />, action: () => setShowROI(true) },
                  { label: "Controlla i Guadagni", desc: "Storico vendite e payout", icon: <DollarSign className="w-5 h-5" />, tab: "earnings" as Tab },
                ]).map((action, i) => (
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

              {/* Bottom Banner */}
              {demoMode ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20 text-center">
                  <p className="text-sm font-display font-bold text-foreground">
                    Licenza Lifetime: <span className="text-primary">€1.997</span> <span className="text-xs text-muted-foreground line-through">€2.997</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Zero canoni mensili. Proprietà permanente. 21+ funzionalità incluse.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-center">
                    <p className="text-sm font-display font-bold text-foreground">
                      Commissione: <span className="text-emerald-400">€997</span>/vendita
                      {isTeamLeader && <span className="text-sky-400"> + €200 override/team</span>}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {isTeamLeader 
                        ? "Guadagni €997 per vendita diretta + €200 per ogni vendita dei tuoi reclutati."
                        : "3 vendite = diventi Team Leader. Bonus: €500 per 3 vendite/mese, €1.500 per 5."
                      }
                    </p>
                  </div>
                  {/* Bonus Tiers Info */}
                  {!isTeamLeader && salesCount < 3 && (
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
                      <p className="text-[11px] font-medium text-primary">
                        🎯 {3 - salesCount} vendite per diventare Team Leader e guadagnare €200 override per ogni vendita del tuo team
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
          {activeTab === "sandbox" && <PartnerSandbox key="sandbox" />}
          {activeTab === "toolkit" && <PartnerSalesToolkit key="toolkit" />}
          {activeTab === "pricing" && <PricingClosing key="pricing" onOpenROI={() => setShowROI(true)} demoMode={demoMode} />}
          {activeTab === "earnings" && !demoMode && <PartnerEarnings key="earnings" />}
          {activeTab === "team" && isTeamLeader && !demoMode && (
            <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <h2 className="text-lg font-display font-bold text-foreground">Il tuo Team</h2>
              
              {/* Override Summary */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  <h3 className="text-sm font-bold text-foreground">Override Management Bonus</h3>
                </div>
                <p className="text-2xl font-display font-bold text-foreground">€200 <span className="text-sm font-normal text-muted-foreground">per vendita del team</span></p>
                <p className="text-xs text-muted-foreground mt-1">Guadagni automaticamente €200 per ogni vendita chiusa dai tuoi partner reclutati.</p>
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-foreground">Membri del Team ({teamMembers.length})</h3>
                {teamMembers.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">Nessun membro ancora. Recluta partner per guadagnare override!</p>
                ) : (
                  teamMembers.map((member, i) => (
                    <motion.div key={member.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
                      <div className="w-9 h-9 rounded-full bg-sky-500/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-sky-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{(member.profiles as any)?.full_name || "Partner"}</p>
                        <p className="text-[10px] text-muted-foreground">{(member.profiles as any)?.email || "—"}</p>
                      </div>
                      <span className="text-xs text-primary font-medium">€200/vendita</span>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Performance Bonuses */}
              {monthlyBonuses.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-foreground">Bonus Performance</h3>
                  {monthlyBonuses.map((bonus, i) => (
                    <div key={bonus.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${bonus.bonus_tier === 'elite' ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                        <Award className={`w-4 h-4 ${bonus.bonus_tier === 'elite' ? 'text-amber-400' : 'text-emerald-400'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-foreground">{bonus.bonus_month} · {bonus.bonus_tier === 'elite' ? 'Elite (5+ vendite)' : 'Pro (3+ vendite)'}</p>
                        <p className="text-[10px] text-muted-foreground">{bonus.sales_count} vendite nel mese</p>
                      </div>
                      <span className="text-sm font-bold text-primary">+€{Number(bonus.bonus_amount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          {activeTab === "investment" && <InvestmentSummary key="investment" />}
          {activeTab === "recruitment" && !demoMode && <PartnerRecruitment key="recruitment" />}
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
