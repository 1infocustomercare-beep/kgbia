import { useState, useEffect, useRef } from "react";
import empireMonkeyMascot from "@/assets/empire-monkey.png";


import BackButton from "@/components/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, DollarSign, LogOut,
  Crown, TrendingUp, Trophy,
  ChevronRight, Sparkles,
  Play, Target, CreditCard, BookOpen,
  Eye, EyeOff, Briefcase, BarChart3,
  Users, Award, Star, FolderDown,
  Link2, Copy, CheckCircle, UserPlus,
  ExternalLink, ChefHat, Smartphone, Monitor, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageGuide from "@/components/ui/page-guide";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PartnerSandbox from "@/components/partner/PartnerSandbox";
import PartnerEarnings from "@/components/partner/PartnerEarnings";
import PartnerRecruitment from "@/components/partner/PartnerRecruitment";
import PricingClosing from "@/components/partner/PricingClosing";
import ROICalculator from "@/components/partner/ROICalculator";
import PartnerSalesToolkit from "@/components/partner/PartnerSalesToolkit";
import InvestmentSummary from "@/components/partner/InvestmentSummary";
import PartnerVoiceAgent from "@/components/partner/PartnerVoiceAgent";
import PartnerDemoProjects from "@/components/partner/PartnerDemoProjects";
import BonusProgressRing from "@/components/partner/BonusProgressRing";
import PartnerLeaderboard from "@/components/partner/PartnerLeaderboard";
import AssetVault from "@/components/partner/AssetVault";
import { toast } from "@/hooks/use-toast";
import { usePartnerDemoRestaurant } from "@/hooks/usePartnerDemoRestaurant";
import DemoCreditsWallet from "@/components/partner/DemoCreditsWallet";
import { GuidesToggle } from "@/components/ui/info-guide";
import InfoGuide from "@/components/ui/info-guide";
import { RefreshCw, Palette, Pencil, Upload, Save, X as XIcon } from "lucide-react";
import { AllIndustriesShowcase } from "@/components/public/IndustryPhoneShowcase";
import PartnerPortfolio from "@/components/partner/PartnerPortfolio";

type Tab = "dashboard" | "sandbox" | "toolkit" | "earnings" | "pricing" | "recruitment" | "investment" | "team" | "vault" | "showcase" | "projects";

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
    navigate("/auth");
  };

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/auth?ref=${user?.id}`;
    navigator.clipboard.writeText(link);
    setInviteCopied(true);
    toast({ title: "Link copiato!", description: "Condividi il link con i tuoi reclutati." });
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const totalBonuses = monthlyBonuses.reduce((s, b) => s + Number(b.bonus_amount), 0);
  const estimatedCommissions = salesCount * 997;
  // Meritocratic override: €50 only from the 5th sale per sub-partner (Active Leader required)
  const calculateOverrides = () => {
    if (!isTeamLeader || teamMembers.length === 0) return 0;
    let total = 0;
    for (const member of teamMembers) {
      const memberSalesCount = teamSales.filter((s: any) => s.partner_id === member.partner_id).length;
      const eligibleSales = Math.max(0, memberSalesCount - 4); // only from 5th sale
      total += eligibleSales * 50;
    }
    return total;
  };
  const totalOverrides = calculateOverrides();
  const netEarnings = estimatedCommissions + totalBonuses + totalOverrides;

  // Current month sales for bonus progress
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthBonus = monthlyBonuses.find(b => b.bonus_month === currentMonth);
  const currentMonthSales = currentMonthBonus?.sales_count || 0;

  const bottomTabs: { id: Tab; label: string; icon: React.ReactNode }[] = demoMode ? [
    { id: "dashboard", label: "Home", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "sandbox", label: "Demo", icon: <Play className="w-5 h-5" /> },
    { id: "showcase", label: "Settori", icon: <Smartphone className="w-5 h-5" /> },
    { id: "pricing", label: "Investimento", icon: <CreditCard className="w-5 h-5" /> },
    { id: "investment", label: "Crescita", icon: <BarChart3 className="w-5 h-5" /> },
  ] : [
    { id: "dashboard", label: "Home", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "projects" as Tab, label: "Bozze", icon: <Briefcase className="w-5 h-5" /> },
    { id: "sandbox", label: "Demo", icon: <Play className="w-5 h-5" /> },
    { id: "showcase", label: "Settori", icon: <Smartphone className="w-5 h-5" /> },
    ...(isTeamLeader ? [{ id: "team" as Tab, label: "Team", icon: <Users className="w-5 h-5" /> }] : []),
    { id: "earnings", label: "Guadagni", icon: <DollarSign className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden landing-dark partner-console" style={{ background: "linear-gradient(145deg, hsl(265 20% 6%) 0%, hsl(255 18% 7%) 40%, hsl(260 20% 6%) 100%)" }}>
      {/* Fully opaque base — blocks underlying animations */}
      <div className="fixed inset-0 z-0" style={{ background: "hsl(260 20% 6%)" }} />
      {/* Premium violet luxury ambient */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
        <div className="absolute top-[-10%] right-[15%] w-[500px] h-[500px] rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, hsl(265 70% 55%), transparent 65%)", filter: "blur(140px)" }} />
        <div className="absolute bottom-[15%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, hsl(38 50% 55%), transparent 70%)", filter: "blur(160px)" }} />
        <div className="absolute inset-0" style={{ opacity: 0.012, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>
      
      {/* Back integrated in header */}
      {/* Header — Vibrant FLAVR style */}
      <div className="relative z-10 flex flex-col items-center px-3 pt-3 pb-2 border-b safe-top overflow-hidden" style={{ background: 'linear-gradient(180deg, hsla(265,22%,12%,0.98), hsla(255,20%,9%,0.96))', borderColor: 'hsla(265,50%,50%,0.15)', boxShadow: '0 4px 20px hsla(265,40%,15%,0.3)' }}>
        {/* DNA scan line */}
        <motion.div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: 'var(--gradient-dna)' }} animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 3, repeat: Infinity }} />
        
        {/* Top row: back/home + actions */}
        <div className="flex items-center justify-between w-full relative z-10 mb-1">
          <div className="flex items-center gap-1">
            {!demoMode && (
              <button onClick={() => navigate("/home")} className="p-1.5 rounded-full hover:bg-secondary/60 min-w-[36px] min-h-[36px] flex items-center justify-center" title="Home">
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <GuidesToggle />
            <motion.button
              onClick={() => {
                setDemoMode(!demoMode);
                if (activeTab === "earnings" || activeTab === "investment" || activeTab === "vault" || activeTab === "team") setActiveTab("dashboard");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                demoMode
                  ? "bg-vibrant-gradient text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {demoMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {demoMode ? "LIVE" : "DEMO"}
            </motion.button>
            {!demoMode && (
              <button onClick={handleLogout} className="p-1.5 rounded-full hover:bg-secondary/60 min-w-[36px] min-h-[36px] flex items-center justify-center" title="Esci">
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Center: big monkey logo + title */}
        <div className="flex flex-col items-center gap-1 relative z-10 pb-1">
          <motion.div 
            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-empire-violet to-empire-violet-deep flex items-center justify-center shadow-[var(--shadow-dna)] overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <img src={empireMonkeyMascot} alt="Empire Monkey" className="w-14 h-14 object-contain drop-shadow-[0_0_8px_hsl(265_85%_65%/0.5)]" />
          </motion.div>
          <h1 className="text-sm font-display font-bold text-foreground text-center">
            {demoMode ? "Empire Solutions" : isTeamLeader ? "Empire Team Leader" : "Empire Partner"}
          </h1>
          <p className="text-[10px] text-empire-violet-glow text-center">
            {demoMode ? "Enterprise Preview" : isTeamLeader ? `👑 Team Leader · ${teamMembers.length} membri` : bottomTabs.find(t => t.id === activeTab)?.label}
          </p>
        </div>
      </div>

      {/* Demo Mode Banner */}
      <AnimatePresence>
        {demoMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-primary/10 via-pink-500/10 to-accent/10 border-b border-primary/20 overflow-hidden"
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
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && !demoMode && (
            <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">

              {/* === NET EARNINGS HERO === */}
              <div data-guide-section="net-earnings" className="p-5 rounded-2xl glass border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">Guadagni Netti</p>
                <motion.p className="text-4xl font-heading font-bold text-vibrant-gradient"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  €{netEarnings.toLocaleString()}
                </motion.p>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-muted-foreground">Commissioni €{estimatedCommissions.toLocaleString()}</span>
                  </div>
                  {isTeamLeader && totalOverrides > 0 && (
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

              {/* === STATS ROW === */}
              <div data-guide-section="stats-row" className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-card border border-border/50 text-center">
                  <Trophy className="w-4 h-4 text-primary mb-1 mx-auto" />
                  <p className="text-xl font-display font-bold text-foreground">{salesCount}</p>
                  <p className="text-[10px] text-muted-foreground">Vendite</p>
                </div>
                <div className="p-3.5 rounded-xl bg-card border border-border/50 text-center">
                  <DollarSign className="w-4 h-4 text-emerald-400 mb-1 mx-auto" />
                  <p className="text-xl font-display font-bold text-foreground">€997</p>
                  <p className="text-[10px] text-muted-foreground">Per Vendita</p>
                </div>
                <div className="p-3.5 rounded-xl bg-card border border-border/50 text-center">
                  {isTeamLeader ? (
                    <>
                      <Users className="w-4 h-4 text-sky-400 mb-1 mx-auto" />
                      <p className="text-xl font-display font-bold text-foreground">{teamMembers.length}</p>
                      <p className="text-[10px] text-muted-foreground">Team</p>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 text-sky-400 mb-1 mx-auto" />
                      <p className="text-xl font-display font-bold text-foreground">{salesCount}/4</p>
                      <p className="text-[10px] text-muted-foreground">a Team Leader</p>
                    </>
                  )}
                </div>
              </div>

              {/* === BONUS PROGRESS (compact) === */}
              <div data-guide-section="bonus-progress" className="p-4 rounded-2xl bg-card border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Bonus Mensile
                  </h3>
                  <span className="text-[10px] text-muted-foreground">{currentMonth}</span>
                </div>
                <div className="flex items-center justify-around">
                  <BonusProgressRing salesCount={currentMonthSales} milestone={3} label="€500" reward={currentMonthSales >= 3 ? "✓ Sbloccato" : `${3 - currentMonthSales} mancanti`} unlocked={currentMonthSales >= 3} />
                  <BonusProgressRing salesCount={currentMonthSales} milestone={5} label="€1.500" reward={currentMonthSales >= 5 ? "✓ Sbloccato" : `${5 - currentMonthSales} mancanti`} unlocked={currentMonthSales >= 5} />
                </div>
              </div>

              {/* === DEMO CREDITS === */}
              <div data-guide-section="demo-credits">
                <DemoCreditsWallet userId={user?.id} />
              </div>

              {/* === DEMO RESTAURANT (streamlined) === */}
              {demoRestaurant && (
                <div data-guide-section="demo-restaurant" className="p-4 rounded-2xl bg-card border border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {demoRestaurant.logo_url ? (
                        <img src={demoRestaurant.logo_url} alt="Logo" className="w-8 h-8 rounded-lg object-cover border border-border/50" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Smartphone className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xs font-bold text-foreground">{demoRestaurant.name}</h3>
                        <p className="text-[10px] text-muted-foreground">Ristorante Demo</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <motion.button onClick={() => setEditingDemo(!editingDemo)}
                        className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors" whileTap={{ scale: 0.95 }}>
                        {editingDemo ? <XIcon className="w-3.5 h-3.5 text-muted-foreground" /> : <Pencil className="w-3.5 h-3.5 text-muted-foreground" />}
                      </motion.button>
                      <motion.button onClick={() => setShowResetConfirm(true)} disabled={resettingDemo}
                        className="p-2 rounded-lg bg-secondary hover:bg-destructive/10 transition-colors" whileTap={{ scale: 0.95 }}>
                        <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${resettingDemo ? "animate-spin" : ""}`} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Customization Panel */}
                  <AnimatePresence>
                    {editingDemo && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
                        <div className="p-3 rounded-xl bg-secondary/50 border border-border/50 space-y-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-medium text-muted-foreground">Nome</label>
                            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Es. Trattoria da Mario"
                              className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-medium text-muted-foreground">Colore</label>
                            <div className="flex items-center gap-2">
                              <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)}
                                className="w-8 h-8 rounded-lg border border-border/50 cursor-pointer bg-transparent" />
                              {["#C8963E", "#1A1A2E", "#E74C3C", "#2ECC71", "#3498DB", "#8E44AD"].map(c => (
                                <button key={c} onClick={() => setEditColor(c)}
                                  className={`w-6 h-6 rounded-lg border-2 transition-all ${editColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                                  style={{ backgroundColor: c }} />
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-medium text-muted-foreground">Logo</label>
                            <input type="file" accept="image/*" ref={logoFileRef} onChange={handleUploadLogo} className="hidden" />
                            <button onClick={() => logoFileRef.current?.click()} disabled={uploadingLogo}
                              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-border/50 hover:border-primary/30 bg-background transition-all disabled:opacity-50 text-xs text-muted-foreground">
                              <Upload className={`w-3.5 h-3.5 ${uploadingLogo ? "animate-pulse" : ""}`} />
                              {uploadingLogo ? "Caricamento..." : "Carica Logo"}
                            </button>
                          </div>
                          <motion.button onClick={handleSaveDemoCustomization} disabled={savingDemo}
                            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                            whileTap={{ scale: 0.97 }}>
                            <Save className={`w-3.5 h-3.5 ${savingDemo ? "animate-spin" : ""}`} />
                            {savingDemo ? "Salvataggio..." : "Salva"}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Quick links */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Cliente", emoji: "👤", href: `/r/${demoRestaurant.slug}` },
                      { label: "Admin", emoji: "⚙️", href: `/r/${demoRestaurant.slug}?view=admin` },
                      { label: "Cucina", emoji: "👨‍🍳", href: `/kitchen` },
                    ].map((link, i) => (
                      <a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/30 transition-all text-center">
                        <span className="text-base">{link.emoji}</span>
                        <span className="text-[10px] font-semibold text-foreground">{link.label}</span>
                      </a>
                    ))}
                  </div>
                  <p className="text-[9px] text-muted-foreground text-center">PIN Cucina: <span className="font-mono font-bold text-foreground">1234</span></p>

                  {/* Reset confirmation dialog */}
                  <AnimatePresence>
                    {showResetConfirm && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
                        onClick={() => setShowResetConfirm(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                          onClick={(e) => e.stopPropagation()} className="w-full max-w-sm p-6 rounded-2xl bg-card border border-border shadow-2xl">
                          <h3 className="text-base font-bold text-foreground mb-2">Resetta Demo?</h3>
                          <p className="text-xs text-muted-foreground mb-5">Tutti i dati demo saranno ricreati da zero.</p>
                          <div className="flex gap-3">
                            <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium">Annulla</button>
                            <button onClick={handleResetDemo} className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-bold">Resetta tutto</button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* === LEADERBOARD === */}
              <div data-guide-section="leaderboard">
                <PartnerLeaderboard currentUserSales={salesCount} />
              </div>
            </motion.div>
          )}

          {/* Demo mode dashboard */}
          {activeTab === "dashboard" && demoMode && (
            <motion.div key="dash-demo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div data-guide-section="enterprise-preview" className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-amber-500/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary tracking-wider uppercase">Enterprise Preview</span>
                </div>
                <h2 className="text-xl font-display font-bold text-foreground">La Suite Completa per la Ristorazione</h2>
                <p className="text-sm text-muted-foreground mt-1">21+ funzionalità integrate. Un'unica soluzione. Proprietà permanente.</p>
              </div>
              <div data-guide-section="platform-stats" className="grid grid-cols-2 gap-3">
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
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20 text-center">
                <p className="text-xs text-muted-foreground">Usa le tab in basso per esplorare Demo, Funzionalità e Investimento</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20 text-center">
                <p className="text-sm font-display font-bold text-foreground">
                  Licenza Lifetime: <span className="text-primary">€2.997</span>
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
          {activeTab === "projects" && !demoMode && <PartnerDemoProjects key="projects" />}

          {activeTab === "showcase" && (
            <motion.div key="showcase" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Portfolio — organized by brand & style */}
              <PartnerPortfolio />

              {/* Separator */}
              <div className="border-t border-border/40 pt-4">
                <div className="text-center mb-3">
                  <h2 className="text-lg font-display font-bold text-foreground">Demo Interattive</h2>
                  <p className="text-xs text-muted-foreground">Preview live di tutti i settori con link demo per le presentazioni</p>
                </div>
                <AllIndustriesShowcase onViewDemo={(id, slug) => {
                  if (id === "food") navigate(`/r/${slug}`);
                  else navigate(`/demo/${slug}`);
                }} />
              </div>
            </motion.div>
          )}

          {/* === TEAM LEADER — Enhanced Interface === */}
          {activeTab === "team" && isTeamLeader && !demoMode && (
            <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <h2 className="text-lg font-display font-bold text-foreground">Il tuo Team</h2>

              {/* Leader Status Badge */}
              {(() => {
                // @ts-ignore data-guide-section attribute
                const isActive = salesCount >= 4 && teamMembers.length >= 2;
                return (
                  <div data-guide-section="leader-status" className={`p-4 rounded-2xl border ${isActive ? "bg-emerald-500/5 border-emerald-500/20" : "bg-destructive/5 border-destructive/20"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-destructive"}`} />
                        <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? "text-emerald-400" : "text-destructive"}`}>
                          {isActive ? "Leader Attivo" : "Leader Sospeso"}
                        </span>
                      </div>
                      <Crown className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-destructive/50"}`} />
                    </div>
                    {!isActive && (
                      <p className="text-[10px] text-muted-foreground mt-2">
                        ⚠️ Override sospesi. Requisiti: {salesCount < 4 ? `${4 - salesCount} vendite personali mancanti` : ""}{salesCount < 4 && teamMembers.length < 2 ? " + " : ""}{teamMembers.length < 2 ? `${2 - teamMembers.length} partner mancanti` : ""}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Override Revenue Tracker */}
              <div data-guide-section="override-revenue" className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 via-card to-blue-500/5 border border-sky-500/20">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">Revenue da Management</p>
                <motion.p className="text-3xl font-display font-bold text-foreground"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  €{totalOverrides.toLocaleString()}
                </motion.p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-sky-400 font-medium">€50 × vendite idonee (dalla 5ª per membro)</span>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span className="text-[10px] text-muted-foreground">{teamMembers.length} partner attivi</span>
                </div>
              </div>

              {/* Recruitment Engine */}
              <div data-guide-section="recruit-engine" className="p-4 rounded-2xl bg-card border border-border/50 space-y-3">
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

              {/* Team Ledger — Hierarchy View */}
              <div data-guide-section="team-ledger" className="space-y-2">
                <h3 className="text-sm font-bold text-foreground">Team Ledger ({teamMembers.length} membri)</h3>
                {teamMembers.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">Nessun membro ancora. Recluta partner per guadagnare override!</p>
                ) : (
                  <>
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <span className="col-span-5">Partner</span>
                      <span className="col-span-2 text-center">Vendite</span>
                      <span className="col-span-3 text-center">Override</span>
                      <span className="col-span-2 text-center">Stato</span>
                    </div>
                    {teamMembers.map((member, i) => {
                      const memberSales = teamSales.filter((s: any) => s.partner_id === member.partner_id).length;
                      const eligibleOverrides = Math.max(0, memberSales - 4);
                      const overrideActive = memberSales >= 5;
                      return (
                        <motion.div key={member.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                          className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-card border border-border/50">
                          <div className="col-span-5 flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                              <Users className="w-3.5 h-3.5 text-sky-400" />
                            </div>
                            <p className="text-xs font-semibold text-foreground truncate">{(member.profiles as any)?.full_name || "Partner"}</p>
                          </div>
                          <p className="col-span-2 text-center text-sm font-bold text-foreground">{memberSales}</p>
                          <p className="col-span-3 text-center text-sm font-bold text-primary">€{(eligibleOverrides * 50).toLocaleString()}</p>
                          <div className="col-span-2 flex justify-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${overrideActive ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                              {overrideActive ? "Attivo" : "🔒"}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                    {/* Totals */}
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
                      <span className="col-span-5 text-xs font-bold text-foreground">Totale</span>
                      <span className="col-span-2 text-center text-xs font-bold text-foreground">{teamSales.length}</span>
                      <span className="col-span-3 text-center text-xs font-bold text-primary">€{totalOverrides.toLocaleString()}</span>
                      <span className="col-span-2" />
                    </div>
                  </>
                )}
              </div>

              {/* Commission Summary Generator */}
              <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Nota Provvigioni (L. 173/2005)</h3>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Genera un riepilogo provvigioni per il mese corrente conforme alla normativa italiana sugli incaricati alle vendite.
                </p>
                <motion.button
                  onClick={async () => {
                    try {
                      const { data: { session } } = await supabase.auth.getSession();
                      if (!session) throw new Error("Non autenticato");
                      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-b2b-invoice`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
                        body: JSON.stringify({ partner_id: user?.id, invoice_type: "commission_note" }),
                      });
                      const result = await res.json();
                      if (!res.ok) throw new Error(result.error || "Errore generazione");
                      toast({ title: "📄 Nota Provvigioni Generata", description: `Periodo: ${result.note?.period} · Netto: €${Number(result.note?.net_amount).toLocaleString()}` });
                    } catch (err: any) {
                      toast({ title: "Errore", description: err.message, variant: "destructive" });
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-secondary text-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-accent transition-colors"
                  whileTap={{ scale: 0.97 }}
                >
                  <CreditCard className="w-4 h-4" />
                  Genera Nota Mese Corrente
                </motion.button>
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

      {/* ATLAS Partner Voice Agent */}
      <PartnerVoiceAgent activeTab={activeTab} demoMode={demoMode} />

      {/* ROI Calculator Modal */}
      <ROICalculator open={showROI} onClose={() => setShowROI(false)} />

      {/* Bottom Tabs */}
      <div className="fixed bottom-0 inset-x-0 safe-bottom z-50" style={{
        background: "linear-gradient(180deg, hsl(228 22% 11% / 0.98) 0%, hsl(228 22% 7%) 100%)",
        borderTop: "1px solid hsl(265 50% 30% / 0.3)",
        boxShadow: "0 -4px 20px hsl(228 22% 4% / 0.7)"
      }}>
        <div className="flex items-center justify-around px-1 py-2">
          {bottomTabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-2.5 rounded-xl transition-all min-h-[44px]
                ${activeTab === tab.id ? "text-empire-violet-glow" : "text-muted-foreground"}`}
              style={activeTab === tab.id ? {
                background: "linear-gradient(160deg, hsl(265 50% 20% / 0.6), hsl(265 40% 15% / 0.4))",
                boxShadow: "0 0 12px hsl(265 70% 55% / 0.2), inset 0 1px 0 hsl(265 50% 40% / 0.15)"
              } : undefined}>
              {tab.icon}
              {activeTab === tab.id && <motion.div layoutId="partner-tab" className="w-4 h-0.5 rounded-full mt-0.5" style={{ background: 'var(--gradient-dna)' }} />}
            </button>
          ))}
        </div>
      </div>
      <PageGuide />
    </div>
  );
};

export default PartnerDashboard;
