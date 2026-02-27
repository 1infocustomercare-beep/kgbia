import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, DollarSign, LogOut,
  Crown, TrendingUp, Trophy,
  ChevronRight, Sparkles,
  Play, Target, CreditCard, BookOpen,
  Eye, EyeOff, Briefcase, BarChart3,
  Users, Award, Star, FolderDown,
  Link2, Copy, CheckCircle, UserPlus,
  ExternalLink, ChefHat, Smartphone, Monitor
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
import BonusProgressRing from "@/components/partner/BonusProgressRing";
import PartnerLeaderboard from "@/components/partner/PartnerLeaderboard";
import AssetVault from "@/components/partner/AssetVault";
import { toast } from "@/hooks/use-toast";
import { usePartnerDemoRestaurant } from "@/hooks/usePartnerDemoRestaurant";
import { RefreshCw, Palette, Pencil, Upload, Save, X as XIcon } from "lucide-react";

type Tab = "dashboard" | "sandbox" | "toolkit" | "earnings" | "pricing" | "recruitment" | "investment" | "team" | "vault";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { signOut, isTeamLeader, user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [showROI, setShowROI] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamSales, setTeamSales] = useState<any[]>([]);
  const [salesCount, setSalesCount] = useState(0);
  const [monthlyBonuses, setMonthlyBonuses] = useState<any[]>([]);
  const [inviteCopied, setInviteCopied] = useState(false);
  const { demoRestaurant, loading: demoLoading, refetch: refetchDemo } = usePartnerDemoRestaurant();
  const [resettingDemo, setResettingDemo] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [editingDemo, setEditingDemo] = useState(false);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#C8963E");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [savingDemo, setSavingDemo] = useState(false);
  const logoFileRef = useRef<HTMLInputElement>(null);

  // Sync edit fields when demoRestaurant loads
  useEffect(() => {
    if (demoRestaurant) {
      setEditName(demoRestaurant.name);
      setEditColor(demoRestaurant.primary_color || "#C8963E");
    }
  }, [demoRestaurant]);

   const handleResetDemo = async () => {
     if (resettingDemo) return;
     setShowResetConfirm(false);
     setResettingDemo(true);
     try {
       const { data: { session } } = await supabase.auth.getSession();
       if (!session) throw new Error("Not authenticated");
       const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reset-partner-demo`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${session.access_token}`,
           apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
         },
       });
       const result = await res.json();
       if (!res.ok) throw new Error(result.error || "Reset failed");
       toast({ title: "✅ Demo Resettata", description: "Tutti i dati demo sono stati ricreati." });
       refetchDemo();
     } catch (err: any) {
       toast({ title: "Errore", description: err.message, variant: "destructive" });
     } finally {
       setResettingDemo(false);
     }
   };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !demoRestaurant) return;
    setUploadingLogo(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${demoRestaurant.id}/logo.${ext}`;
      const { error: upErr } = await supabase.storage.from("restaurant-logos").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("restaurant-logos").getPublicUrl(path);
      const logoUrl = urlData.publicUrl + "?t=" + Date.now();
      await supabase.from("restaurants").update({ logo_url: logoUrl }).eq("id", demoRestaurant.id);
      toast({ title: "Logo caricato!" });
      refetchDemo();
    } catch (err: any) {
      toast({ title: "Errore upload", description: err.message, variant: "destructive" });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveDemoCustomization = async () => {
    if (!demoRestaurant || savingDemo) return;
    setSavingDemo(true);
    try {
      const { error } = await supabase.from("restaurants").update({
        name: editName.trim() || demoRestaurant.name,
        primary_color: editColor,
      }).eq("id", demoRestaurant.id);
      if (error) throw error;
      toast({ title: "✅ Personalizzazione salvata!" });
      setEditingDemo(false);
      refetchDemo();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally {
      setSavingDemo(false);
    }
  };
  useEffect(() => {
    if (!user?.id) return;
    fetchPartnerData();

    // Realtime: notify Team Leader when a new partner joins via invite link
    if (!isTeamLeader) return;
    const channel = supabase
      .channel('team-recruits')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'partner_teams',
          filter: `team_leader_id=eq.${user.id}`,
        },
        async (payload) => {
          // Fetch the new partner's profile name
          const newPartnerId = (payload.new as any).partner_id;
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', newPartnerId)
            .maybeSingle();
          const name = profile?.full_name || profile?.email || 'Nuovo partner';
          toast({
            title: "🎉 Nuovo Partner nel Team!",
            description: `${name} si è registrato tramite il tuo link di invito.`,
          });
          // Refresh team data
          fetchPartnerData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, isTeamLeader]);

  const fetchPartnerData = async () => {
    if (!user?.id) return;
    const { data: sales } = await supabase
      .from("partner_sales")
      .select("id")
      .eq("partner_id", user.id);
    setSalesCount(sales?.length || 0);

    if (isTeamLeader) {
      const { data: team } = await supabase
        .from("partner_teams")
        .select("*")
        .eq("team_leader_id", user.id);
      
      // Fetch profiles for each team member
      if (team && team.length > 0) {
        const memberIds = team.map((t: any) => t.partner_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", memberIds);
        
        const enrichedTeam = team.map((t: any) => ({
          ...t,
          profiles: profiles?.find((p: any) => p.user_id === t.partner_id) || null,
        }));
        setTeamMembers(enrichedTeam);
      } else {
        setTeamMembers([]);
      }

      // Fetch team members' sales for override tracking
      if (team && team.length > 0) {
        const memberIds = team.map((t: any) => t.partner_id);
        const { data: tSales } = await supabase
          .from("partner_sales")
          .select("*")
          .in("partner_id", memberIds);
        setTeamSales(tSales || []);
      }
    }

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

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/admin?ref=${user?.id}`;
    navigator.clipboard.writeText(link);
    setInviteCopied(true);
    toast({ title: "Link copiato!", description: "Condividi il link con i tuoi reclutati." });
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const totalBonuses = monthlyBonuses.reduce((s, b) => s + Number(b.bonus_amount), 0);
  const estimatedCommissions = salesCount * 997;
  const totalOverrides = teamSales.length * 200;
  const netEarnings = estimatedCommissions + totalBonuses + totalOverrides;

  // Current month sales for bonus progress
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthBonus = monthlyBonuses.find(b => b.bonus_month === currentMonth);
  const currentMonthSales = currentMonthBonus?.sales_count || 0;

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
    { id: "vault", label: "Asset", icon: <FolderDown className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header — Fintech style */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border/50 bg-card/80 backdrop-blur-xl safe-top">
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
          <motion.button
            onClick={() => {
              setDemoMode(!demoMode);
              if (activeTab === "earnings" || activeTab === "investment" || activeTab === "vault" || activeTab === "team") setActiveTab("dashboard");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
              demoMode
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            whileTap={{ scale: 0.95 }}
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
          {activeTab === "dashboard" && !demoMode && (
            <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

              {/* === NET EARNINGS HERO WIDGET === */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">Guadagni Netti</p>
                <motion.p
                  className="text-4xl font-display font-bold text-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  €{netEarnings.toLocaleString()}
                </motion.p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-muted-foreground">Commissioni €{estimatedCommissions.toLocaleString()}</span>
                  </div>
                  {isTeamLeader && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-sky-400" />
                      <span className="text-[10px] text-muted-foreground">Override €{totalOverrides.toLocaleString()}</span>
                    </div>
                  )}
                  {totalBonuses > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-[10px] text-muted-foreground">Bonus €{totalBonuses.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* === STATS ROW — Fintech high contrast === */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-card border border-border/50">
                  <Trophy className="w-4 h-4 text-primary mb-1.5" />
                  <p className="text-xl font-display font-bold text-foreground">{salesCount}</p>
                  <p className="text-[10px] text-muted-foreground">Vendite</p>
                </div>
                <div className="p-3.5 rounded-xl bg-card border border-border/50">
                  <DollarSign className="w-4 h-4 text-emerald-400 mb-1.5" />
                  <p className="text-xl font-display font-bold text-foreground">€997</p>
                  <p className="text-[10px] text-muted-foreground">Per Vendita</p>
                </div>
                <div className="p-3.5 rounded-xl bg-card border border-border/50">
                  {isTeamLeader ? (
                    <>
                      <Users className="w-4 h-4 text-sky-400 mb-1.5" />
                      <p className="text-xl font-display font-bold text-foreground">{teamMembers.length}</p>
                      <p className="text-[10px] text-muted-foreground">Team</p>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 text-sky-400 mb-1.5" />
                      <p className="text-xl font-display font-bold text-foreground">{salesCount}/3</p>
                      <p className="text-[10px] text-muted-foreground">a Team Leader</p>
                    </>
                  )}
                </div>
              </div>

              {/* === BONUS ACCELERATOR — Progress Rings === */}
              <div className="p-5 rounded-2xl bg-card border border-border/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Bonus Accelerator
                  </h3>
                  <span className="text-[10px] text-muted-foreground">Mese corrente</span>
                </div>
                <div className="flex items-center justify-around">
                  <BonusProgressRing
                    salesCount={salesCount}
                    milestone={3}
                    label="Milestone 1"
                    reward={salesCount >= 3 ? "Team Leader ✓" : "€500 + Team Leader"}
                    unlocked={salesCount >= 3}
                  />
                  <BonusProgressRing
                    salesCount={currentMonthSales}
                    milestone={5}
                    label="Milestone 2"
                    reward="€1.500 Bonus"
                    unlocked={currentMonthSales >= 5}
                  />
                </div>
                {!isTeamLeader && salesCount < 3 && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
                    <p className="text-[11px] text-primary font-medium">
                      🎯 {3 - salesCount} vendite per diventare Team Leader → guadagna €200 override per ogni vendita del tuo team
                    </p>
                  </div>
                )}
              </div>

              {/* === LEADERBOARD === */}
              <PartnerLeaderboard currentUserSales={salesCount} />

              {/* === QUICK ACTIONS — Fintech cards === */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Azioni Rapide</h3>
                {[
                  { label: "Demo Interattiva", desc: "Tour guidato con 3 viste", icon: <Play className="w-5 h-5" />, tab: "sandbox" as Tab },
                  { label: "Schede Vendita", desc: "21+ funzionalità dettagliate", icon: <BookOpen className="w-5 h-5" />, tab: "toolkit" as Tab },
                  { label: "Calcola il ROI", desc: "Quanto risparmia il cliente", icon: <TrendingUp className="w-5 h-5" />, action: () => setShowROI(true) },
                  { label: "I tuoi Guadagni", desc: "Storico vendite e payout", icon: <DollarSign className="w-5 h-5" />, tab: "earnings" as Tab },
                  { label: "Asset Vault", desc: "Scarica Sales Deck e materiali", icon: <FolderDown className="w-5 h-5" />, tab: "vault" as Tab },
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

              {/* === DEMO RESTAURANT — Live Links + Customization === */}
              {demoRestaurant && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 via-card to-amber-500/5 border border-primary/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {demoRestaurant.logo_url ? (
                        <img src={demoRestaurant.logo_url} alt="Logo" className="w-9 h-9 rounded-xl object-cover border border-border/50" />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-bold text-foreground">Il tuo Ristorante Demo</h3>
                        <p className="text-[10px] text-muted-foreground">{demoRestaurant.name}</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setEditingDemo(!editingDemo)}
                      className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      {editingDemo ? <XIcon className="w-4 h-4 text-muted-foreground" /> : <Pencil className="w-4 h-4 text-muted-foreground" />}
                    </motion.button>
                  </div>

                  {/* Customization Panel */}
                  <AnimatePresence>
                    {editingDemo && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-3"
                      >
                        <div className="p-4 rounded-xl bg-card border border-border/50 space-y-4">
                          <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">Personalizza per il cliente</p>
                          
                          {/* Name */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-muted-foreground">Nome Ristorante</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              placeholder="Es. Trattoria da Mario"
                              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                          </div>

                          {/* Color */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-muted-foreground">Colore Primario</label>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={editColor}
                                onChange={e => setEditColor(e.target.value)}
                                className="w-10 h-10 rounded-lg border border-border/50 cursor-pointer bg-transparent"
                              />
                              <span className="text-xs font-mono text-muted-foreground">{editColor}</span>
                              <div className="flex gap-1.5 ml-auto">
                                {["#C8963E", "#1A1A2E", "#E74C3C", "#2ECC71", "#3498DB", "#8E44AD"].map(c => (
                                  <button key={c} onClick={() => setEditColor(c)}
                                    className={`w-7 h-7 rounded-lg border-2 transition-all ${editColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                                    style={{ backgroundColor: c }} />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Logo */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-muted-foreground">Logo</label>
                            <input type="file" accept="image/*" ref={logoFileRef} onChange={handleUploadLogo} className="hidden" />
                            <motion.button
                              onClick={() => logoFileRef.current?.click()}
                              disabled={uploadingLogo}
                              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-border/50 hover:border-primary/30 bg-secondary/50 transition-all disabled:opacity-50"
                              whileTap={{ scale: 0.97 }}
                            >
                              <Upload className={`w-4 h-4 text-muted-foreground ${uploadingLogo ? "animate-pulse" : ""}`} />
                              <span className="text-xs text-muted-foreground">{uploadingLogo ? "Caricamento..." : demoRestaurant.logo_url ? "Cambia Logo" : "Carica Logo"}</span>
                            </motion.button>
                          </div>

                          {/* Save */}
                          <motion.button
                            onClick={handleSaveDemoCustomization}
                            disabled={savingDemo}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50"
                            whileTap={{ scale: 0.97 }}
                          >
                            <Save className={`w-4 h-4 ${savingDemo ? "animate-spin" : ""}`} />
                            {savingDemo ? "Salvataggio..." : "Salva Personalizzazione"}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="text-xs text-muted-foreground">
                    Usa questi link per mostrare tutte le interfacce al potenziale cliente.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: "👤 Vista Cliente", desc: "Menu, carrello, ordini, prenotazioni", href: `/r/${demoRestaurant.slug}`, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
                      { label: "⚙️ Dashboard Admin", desc: "Studio, ordini, profitto, impostazioni", href: `/dashboard`, color: "bg-sky-500/10 border-sky-500/20 text-sky-400" },
                      { label: "👨‍🍳 Vista Cucina", desc: "PIN: 1234 — ordini live, stati, stampa", href: `/kitchen`, color: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
                    ].map((link, i) => (
                      <motion.a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-3 rounded-xl border ${link.color} transition-all`}
                        whileTap={{ scale: 0.97 }}>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{link.label}</p>
                          <p className="text-[10px] text-muted-foreground">{link.desc}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      </motion.a>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center">
                    PIN Cucina Demo: <span className="font-mono font-bold text-foreground">1234</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      onClick={() => setEditingDemo(true)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary transition-all"
                      whileTap={{ scale: 0.97 }}
                    >
                      <Palette className="w-4 h-4" />
                      <span className="text-xs font-semibold">Personalizza</span>
                    </motion.button>
                    <motion.button
                      onClick={() => setShowResetConfirm(true)}
                      disabled={resettingDemo}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-all disabled:opacity-50"
                      whileTap={{ scale: 0.97 }}
                    >
                      <RefreshCw className={`w-4 h-4 ${resettingDemo ? "animate-spin" : ""}`} />
                      <span className="text-xs font-semibold">{resettingDemo ? "Reset..." : "Resetta"}</span>
                    </motion.button>

                    {/* Reset confirmation dialog */}
                    <AnimatePresence>
                      {showResetConfirm && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
                          onClick={() => setShowResetConfirm(false)}
                        >
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm p-6 rounded-2xl bg-card border border-border shadow-2xl"
                          >
                            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                              <RefreshCw className="w-6 h-6 text-destructive" />
                            </div>
                            <h3 className="text-base font-display font-bold text-foreground text-center mb-2">
                              Resettare i dati demo?
                            </h3>
                            <p className="text-xs text-muted-foreground text-center mb-6 leading-relaxed">
                              Tutti gli ordini, le prenotazioni e le personalizzazioni della demo verranno eliminati e ricreati da zero. Questa azione è irreversibile.
                            </p>
                            <div className="flex gap-3">
                              <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
                              >
                                Annulla
                              </button>
                              <button
                                onClick={handleResetDemo}
                                className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold hover:bg-destructive/90 transition-colors"
                              >
                                Resetta tutto
                              </button>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Bottom Banner */}
              <div className="space-y-2">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-center">
                  <p className="text-sm font-display font-bold text-foreground">
                    Commissione: <span className="text-emerald-400">€997</span>/vendita
                    {isTeamLeader && <span className="text-sky-400"> + €200 override/team</span>}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {isTeamLeader
                      ? "Guadagni €997 per vendita diretta + €200 per ogni vendita dei tuoi reclutati."
                      : "Bonus: €500 per 3 vendite/mese, €1.500 per 5 vendite/mese."
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Demo mode dashboard */}
          {activeTab === "dashboard" && demoMode && (
            <motion.div key="dash-demo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-amber-500/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary tracking-wider uppercase">Enterprise Preview</span>
                </div>
                <h2 className="text-xl font-display font-bold text-foreground">La Suite Completa per la Ristorazione</h2>
                <p className="text-sm text-muted-foreground mt-1">21+ funzionalità integrate. Un'unica soluzione. Proprietà permanente.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Ristoranti Attivi", value: "127", icon: <Briefcase className="w-5 h-5" />, color: "text-primary" },
                  { label: "Soddisfazione", value: "98%", icon: <Trophy className="w-5 h-5" />, color: "text-emerald-400" },
                  { label: "Funzionalità", value: "21+", icon: <Target className="w-5 h-5" />, color: "text-sky-400" },
                  { label: "Crescita Media", value: "+34%", icon: <TrendingUp className="w-5 h-5" />, color: "text-amber-400" },
                ].map((s, i) => (
                  <motion.div key={i} className="p-4 rounded-xl bg-card border border-border/50" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className={`${s.color} mb-2`}>{s.icon}</div>
                    <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Esplora la Piattaforma</h3>
                {[
                  { label: "Demo Interattiva", desc: "Prova l'app dal vivo — 3 viste", icon: <Play className="w-5 h-5" />, tab: "sandbox" as Tab },
                  { label: "Tutte le Funzionalità", desc: "21+ strumenti inclusi nella licenza", icon: <BookOpen className="w-5 h-5" />, tab: "toolkit" as Tab },
                  { label: "Piano Investimento", desc: "Costi, inclusi e garanzie", icon: <CreditCard className="w-5 h-5" />, tab: "pricing" as Tab },
                  { label: "Calcola il ROI", desc: "Quanto risparmia il tuo locale", icon: <TrendingUp className="w-5 h-5" />, action: () => setShowROI(true) },
                  { label: "Proiezione Crescita", desc: "Come crescerà il tuo fatturato", icon: <BarChart3 className="w-5 h-5" />, tab: "investment" as Tab },
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
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20 text-center">
                <p className="text-sm font-display font-bold text-foreground">
                  Licenza Lifetime: <span className="text-primary">€1.997</span> <span className="text-xs text-muted-foreground line-through">€2.997</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Zero canoni mensili. Proprietà permanente. 21+ funzionalità incluse.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "sandbox" && <PartnerSandbox key="sandbox" />}
          {activeTab === "toolkit" && <PartnerSalesToolkit key="toolkit" />}
          {activeTab === "pricing" && <PricingClosing key="pricing" onOpenROI={() => setShowROI(true)} demoMode={demoMode} />}
          {activeTab === "earnings" && !demoMode && <PartnerEarnings key="earnings" />}
          {activeTab === "vault" && !demoMode && <AssetVault key="vault" />}

          {/* === TEAM LEADER — Enhanced Interface === */}
          {activeTab === "team" && isTeamLeader && !demoMode && (
            <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <h2 className="text-lg font-display font-bold text-foreground">Il tuo Team</h2>

              {/* Override Revenue Tracker */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 via-card to-blue-500/5 border border-sky-500/20">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">Revenue da Management</p>
                <motion.p className="text-3xl font-display font-bold text-foreground"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  €{totalOverrides.toLocaleString()}
                </motion.p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-sky-400 font-medium">€200 × {teamSales.length} vendite team</span>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span className="text-[10px] text-muted-foreground">{teamMembers.length} partner attivi</span>
                </div>
              </div>

              {/* Recruitment Engine */}
              <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Recluta Partner</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Condividi il tuo link di invito. I nuovi partner verranno assegnati automaticamente al tuo team.
                </p>
                <motion.button
                  onClick={handleCopyInviteLink}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.97 }}
                >
                  {inviteCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {inviteCopied ? "Link Copiato!" : "Copia Link di Invito"}
                </motion.button>
              </div>

              {/* Hierarchy View */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-foreground">Membri del Team ({teamMembers.length})</h3>
                {teamMembers.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">Nessun membro ancora. Recluta partner per guadagnare override!</p>
                ) : (
                  teamMembers.map((member, i) => {
                    const memberSales = teamSales.filter((s: any) => s.partner_id === member.partner_id).length;
                    return (
                      <motion.div key={member.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
                        <div className="w-9 h-9 rounded-full bg-sky-500/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-sky-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{(member.profiles as any)?.full_name || "Partner"}</p>
                          <p className="text-[10px] text-muted-foreground">{memberSales} vendite · €{(memberSales * 200).toLocaleString()} override</p>
                        </div>
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${memberSales > 0 ? "bg-emerald-400" : "bg-muted-foreground/30"}`} />
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Performance Bonuses */}
              {monthlyBonuses.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-foreground">Bonus Performance</h3>
                  {monthlyBonuses.map((bonus) => (
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
