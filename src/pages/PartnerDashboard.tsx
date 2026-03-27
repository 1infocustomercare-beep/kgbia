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
  ExternalLink, ChefHat, Smartphone, Monitor, ArrowLeft,
  Mail, MapPin, Instagram, Send, RefreshCw,
  Palette, Pencil, Upload, Save, X as XIcon,
  Globe, ChevronDown, Phone, MessageSquare
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
import { AllIndustriesShowcase } from "@/components/public/IndustryPhoneShowcase";
import PartnerPortfolio from "@/components/partner/PartnerPortfolio";
import { PORTFOLIO_PROJECTS } from "@/data/portfolio-showcase-data";
import { SECTOR_PORTFOLIO } from "@/data/sector-mockup-images";

/* ═══════════════════════════════════════════
   ACQUISITION CHANNELS (Lowengeld-style)
   ═══════════════════════════════════════════ */
const ACQUISITION_CHANNELS = [
  { id: "email", icon: Mail, label: "Email", desc: "Template professionali pronti da inviare" },
  { id: "field", icon: MapPin, label: "Porta a Porta", desc: "Pitch dal vivo con link e preview pronte" },
  { id: "instagram", icon: Instagram, label: "DM Instagram", desc: "Messaggi brevi e diretti per i social" },
] as const;

/* ═══════════════════════════════════════════
   SECTOR PROJECT CARDS
   ═══════════════════════════════════════════ */
const SECTOR_CARDS = Object.entries(PORTFOLIO_PROJECTS).map(([key, project]) => {
  const portfolio = SECTOR_PORTFOLIO.find(sp => sp.sectorId === key);
  const firstBrand = portfolio?.brands?.[0];
  const firstStyle = firstBrand?.styles?.[0];
  const screens = firstStyle?.screens?.slice(0, 3) || [];
  return {
    id: key,
    name: project!.name,
    description: project!.description,
    tags: project!.tags,
    screens,
    accent: project!.accent,
  };
}).filter(c => c.screens.length > 0);

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { signOut, isTeamLeader, user } = useAuth();
  const [showROI, setShowROI] = useState(false);
  const [demoMode, setDemoMode] = useState(() => sessionStorage.getItem("partner_demo_mode") === "true");
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

  // Lowengeld-style states
  const [activeChannel, setActiveChannel] = useState<string>("instagram");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showFullPortfolio, setShowFullPortfolio] = useState(false);

  // Persist demoMode
  useEffect(() => { sessionStorage.setItem("partner_demo_mode", demoMode ? "true" : "false"); }, [demoMode]);

  // Sync edit fields
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Reset failed");
      toast({ title: "✅ Demo Resettata", description: "Tutti i dati demo sono stati ricreati." });
      refetchDemo();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally { setResettingDemo(false); }
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
    } finally { setUploadingLogo(false); }
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
    } finally { setSavingDemo(false); }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchPartnerData();
    if (!isTeamLeader) return;
    const channel = supabase
      .channel('team-recruits')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'partner_teams', filter: `team_leader_id=eq.${user.id}` },
        async (payload) => {
          const newPartnerId = (payload.new as any).partner_id;
          const { data: profile } = await supabase.from('profiles').select('full_name, email').eq('user_id', newPartnerId).maybeSingle();
          const name = profile?.full_name || profile?.email || 'Nuovo partner';
          toast({ title: "🎉 Nuovo Partner nel Team!", description: `${name} si è registrato tramite il tuo link di invito.` });
          fetchPartnerData();
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, isTeamLeader]);

  const fetchPartnerData = async () => {
    if (!user?.id) return;
    const { data: sales } = await supabase.from("partner_sales").select("id").eq("partner_id", user.id);
    setSalesCount(sales?.length || 0);
    if (isTeamLeader) {
      const { data: team } = await supabase.from("partner_teams").select("*").eq("team_leader_id", user.id);
      if (team && team.length > 0) {
        const memberIds = team.map((t: any) => t.partner_id);
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", memberIds);
        setTeamMembers(team.map((t: any) => ({ ...t, profiles: profiles?.find((p: any) => p.user_id === t.partner_id) || null })));
        const { data: tSales } = await supabase.from("partner_sales").select("*").in("partner_id", memberIds);
        setTeamSales(tSales || []);
      } else { setTeamMembers([]); }
    }
    const { data: bonuses } = await supabase.from("performance_bonuses").select("*").eq("partner_id", user.id).order("bonus_month", { ascending: false }).limit(6);
    setMonthlyBonuses(bonuses || []);
  };

  const handleLogout = async () => { await signOut(); navigate("/auth"); };

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/auth?role=partner&ref=${user?.id}`;
    navigator.clipboard.writeText(link);
    setInviteCopied(true);
    toast({ title: "Link copiato!", description: "Chi si registra con questo link sarà nel tuo team." });
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const totalBonuses = monthlyBonuses.reduce((s, b) => s + Number(b.bonus_amount), 0);
  const estimatedCommissions = salesCount * 997;
  const calculateOverrides = () => {
    if (!isTeamLeader || teamMembers.length === 0) return 0;
    let total = 0;
    for (const member of teamMembers) {
      const memberSalesCount = teamSales.filter((s: any) => s.partner_id === member.partner_id).length;
      total += Math.max(0, memberSalesCount - 4) * 50;
    }
    return total;
  };
  const totalOverrides = calculateOverrides();
  const netEarnings = estimatedCommissions + totalBonuses + totalOverrides;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthBonus = monthlyBonuses.find(b => b.bonus_month === currentMonth);
  const currentMonthSales = currentMonthBonus?.sales_count || 0;
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Partner";

  const toggleSection = (s: string) => setExpandedSection(expandedSection === s ? null : s);

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "linear-gradient(180deg, hsl(225 25% 8%) 0%, hsl(230 22% 6%) 100%)" }}>
      
      {/* ═══════ TOP NAV BAR (Lowengeld-style) ═══════ */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b safe-top" style={{
        background: "hsla(228 22% 9% / 0.95)",
        borderColor: "hsla(265 30% 30% / 0.2)",
        backdropFilter: "blur(20px)"
      }}>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/home")} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
          <span className="text-sm font-bold text-foreground ml-2">Partner Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: "hsla(265 30% 40% / 0.3)", background: "hsla(265 20% 15% / 0.5)" }}>
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
              {userName.charAt(0)}
            </div>
            <span className="text-xs text-foreground font-medium max-w-[120px] truncate">{userName}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs text-muted-foreground hover:text-foreground transition-colors" style={{ borderColor: "hsla(265 30% 40% / 0.2)" }}>
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Esci</span>
          </button>
        </div>
      </div>

      {/* ═══════ SCROLLABLE CONTENT ═══════ */}
      <div className="flex-1 overflow-y-auto">
        
        {/* ═══════ HERO SECTION ═══════ */}
        <section className="relative px-4 sm:px-8 pt-10 pb-8 overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.06] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(265 70% 55%), transparent 65%)", filter: "blur(120px)" }} />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 max-w-5xl mx-auto">
            {/* Left: Welcome */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center overflow-hidden"
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                >
                  <img src={empireMonkeyMascot} alt="Empire" className="w-12 h-12 object-contain" />
                </motion.div>
                <div>
                  <p className="text-xs text-muted-foreground">Benvenuto,</p>
                  <h1 className="text-xl font-bold text-foreground">{userName}</h1>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                {!demoMode && (
                  <button onClick={() => toggleSection("earnings")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all" style={{ background: "hsla(265 30% 20% / 0.6)", border: "1px solid hsla(265 30% 40% / 0.3)" }}>
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-foreground">Guadagni</span>
                  </button>
                )}
                <button onClick={() => navigate("/home?from=partner")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all" style={{ background: "hsla(265 30% 20% / 0.4)", border: "1px solid hsla(265 30% 40% / 0.2)" }}>
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Mostra Sito</span>
                </button>
                <button onClick={() => { setDemoMode(!demoMode); }} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${demoMode ? "bg-primary/20 border-primary/40 text-primary" : ""}`} style={!demoMode ? { background: "hsla(265 30% 20% / 0.4)", border: "1px solid hsla(265 30% 40% / 0.2)" } : { border: "1px solid hsla(265 50% 50% / 0.4)" }}>
                  {demoMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  <span className={demoMode ? "text-primary" : "text-muted-foreground"}>{demoMode ? "Modalità Live" : "Modalità Demo"}</span>
                </button>
              </div>
            </div>

            {/* Right: Tagline */}
            <div className="text-left sm:text-right max-w-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ background: "hsla(265 30% 20% / 0.6)", border: "1px solid hsla(265 30% 40% / 0.3)", color: "hsl(265 70% 75%)" }}>
                <LayoutDashboard className="w-3 h-3" /> Area Partner
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                Il tuo catalogo app,<br />
                <span className="text-primary">pronto da mostrare.</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Sfoglia i progetti, seleziona uno stile e mostra le preview direttamente al cliente.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════ DEMO MODE BANNER ═══════ */}
        <AnimatePresence>
          {demoMode && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-y" style={{ background: "hsla(265 40% 15% / 0.5)", borderColor: "hsla(265 50% 40% / 0.2)" }}>
              <div className="px-4 py-2.5 flex items-center gap-2 max-w-5xl mx-auto">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <p className="text-[11px] text-primary font-semibold tracking-wider uppercase">Modalità Presentazione — Dati sensibili nascosti</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════ EARNINGS SECTION (expandable, only in normal mode) ═══════ */}
        {!demoMode && (
          <AnimatePresence>
            {expandedSection === "earnings" && (
              <motion.section initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-4">
                  {/* Net Earnings Hero */}
                  <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: "hsla(265 20% 12% / 0.8)", border: "1px solid hsla(265 30% 30% / 0.3)" }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">Guadagni Netti</p>
                    <p className="text-4xl font-bold text-foreground">€{netEarnings.toLocaleString()}</p>
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[10px] text-muted-foreground">Commissioni €{estimatedCommissions.toLocaleString()}</span></div>
                      {isTeamLeader && totalOverrides > 0 && <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-sky-400" /><span className="text-[10px] text-muted-foreground">Override €{totalOverrides.toLocaleString()}</span></div>}
                      {totalBonuses > 0 && <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[10px] text-muted-foreground">Bonus €{totalBonuses.toLocaleString()}</span></div>}
                    </div>
                  </div>
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl text-center" style={{ background: "hsla(265 20% 12% / 0.6)", border: "1px solid hsla(265 30% 30% / 0.2)" }}>
                      <Trophy className="w-4 h-4 text-primary mb-1 mx-auto" /><p className="text-xl font-bold text-foreground">{salesCount}</p><p className="text-[10px] text-muted-foreground">Vendite</p>
                    </div>
                    <div className="p-3.5 rounded-xl text-center" style={{ background: "hsla(265 20% 12% / 0.6)", border: "1px solid hsla(265 30% 30% / 0.2)" }}>
                      <DollarSign className="w-4 h-4 text-emerald-400 mb-1 mx-auto" /><p className="text-xl font-bold text-foreground">€997</p><p className="text-[10px] text-muted-foreground">Per Vendita</p>
                    </div>
                    <div className="p-3.5 rounded-xl text-center" style={{ background: "hsla(265 20% 12% / 0.6)", border: "1px solid hsla(265 30% 30% / 0.2)" }}>
                      {isTeamLeader ? <><Users className="w-4 h-4 text-sky-400 mb-1 mx-auto" /><p className="text-xl font-bold text-foreground">{teamMembers.length}</p><p className="text-[10px] text-muted-foreground">Team</p></> :
                      <><Target className="w-4 h-4 text-sky-400 mb-1 mx-auto" /><p className="text-xl font-bold text-foreground">{salesCount}/4</p><p className="text-[10px] text-muted-foreground">a Team Leader</p></>}
                    </div>
                  </div>
                  {/* Bonus Progress */}
                  <div className="p-4 rounded-2xl" style={{ background: "hsla(265 20% 12% / 0.6)", border: "1px solid hsla(265 30% 30% / 0.2)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-foreground flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-primary" /> Bonus Mensile</h3>
                      <span className="text-[10px] text-muted-foreground">{currentMonth}</span>
                    </div>
                    <div className="flex items-center justify-around">
                      <BonusProgressRing salesCount={currentMonthSales} milestone={3} label="€500" reward={currentMonthSales >= 3 ? "✓ Sbloccato" : `${3 - currentMonthSales} mancanti`} unlocked={currentMonthSales >= 3} />
                      <BonusProgressRing salesCount={currentMonthSales} milestone={5} label="€1.500" reward={currentMonthSales >= 5 ? "✓ Sbloccato" : `${5 - currentMonthSales} mancanti`} unlocked={currentMonthSales >= 5} />
                    </div>
                  </div>
                  <DemoCreditsWallet userId={user?.id} />
                  <button onClick={() => setExpandedSection(null)} className="w-full py-2.5 text-xs text-muted-foreground hover:text-foreground text-center transition-colors">
                    Chiudi sezione guadagni ↑
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        )}

        {/* ═══════ CANALE DI ACQUISIZIONE ═══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Canale di Acquisizione</h3>
          <div className="grid grid-cols-3 gap-3">
            {ACQUISITION_CHANNELS.map(ch => {
              const isActive = activeChannel === ch.id;
              return (
                <motion.button key={ch.id} onClick={() => setActiveChannel(ch.id)} whileTap={{ scale: 0.97 }}
                  className="p-4 rounded-xl text-left transition-all relative overflow-hidden"
                  style={{
                    background: isActive ? "hsla(265 35% 18% / 0.9)" : "hsla(228 18% 12% / 0.6)",
                    border: `1px solid ${isActive ? "hsla(265 50% 50% / 0.4)" : "hsla(228 20% 20% / 0.4)"}`,
                    boxShadow: isActive ? "0 0 30px hsla(265 60% 50% / 0.1)" : "none",
                  }}>
                  {isActive && <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2" style={{ background: "radial-gradient(circle, hsl(265 60% 60%), transparent)" }} />}
                  <ch.icon className={`w-5 h-5 mb-3 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <p className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{ch.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{ch.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ═══════ SELEZIONA PROGETTO ═══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
          <div className="p-5 rounded-2xl" style={{ background: "hsla(228 18% 11% / 0.8)", border: "1px solid hsla(228 20% 20% / 0.4)" }}>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Seleziona Progetto</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-h-[260px] overflow-y-auto pr-1">
              {SECTOR_CARDS.slice(0, 10).map(card => {
                const isSelected = selectedProject === card.id;
                return (
                  <motion.button key={card.id} onClick={() => setSelectedProject(isSelected ? null : card.id)} whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                    style={{
                      background: isSelected ? "hsla(265 30% 20% / 0.8)" : "hsla(228 18% 14% / 0.6)",
                      border: `1px solid ${isSelected ? "hsla(265 50% 50% / 0.4)" : "hsla(228 20% 22% / 0.4)"}`,
                    }}>
                    {card.screens[0] ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-border/30">
                        <img src={card.screens[0]} alt={card.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <span className={`text-[10px] font-semibold text-center leading-tight ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                      {card.name.split(" ")[0]}
                    </span>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════ DM TEMPLATE (AI-Powered) ═══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
          <p className="text-[10px] text-center font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">Template DM Generato con AI</p>
          <div className="p-5 rounded-2xl space-y-4" style={{ background: "hsla(228 18% 11% / 0.8)", border: "1px solid hsla(228 20% 20% / 0.4)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">TEMPLATE DM</span>
                <span className="text-xs">🇮🇹</span>
              </div>
              <div className="flex gap-2">
                {[
                  { label: "Copia", icon: Copy, action: () => { navigator.clipboard.writeText(dmTemplate); toast({ title: "Copiato!" }); } },
                  { label: "Rigenera", icon: RefreshCw, action: () => toast({ title: "Template rigenerato!" }) },
                ].map(btn => (
                  <button key={btn.label} onClick={btn.action} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all" style={{ background: "hsla(265 20% 18% / 0.6)", border: "1px solid hsla(265 30% 30% / 0.3)" }}>
                    <btn.icon className="w-3 h-3 text-primary" />
                    <span className="text-foreground">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              {dmTemplate}
            </p>
          </div>
        </section>

        {/* ═══════ DEMO RESTAURANT SECTION ═══════ */}
        {demoRestaurant && !demoMode && (
          <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
            <div className="p-5 rounded-2xl space-y-4" style={{ background: "hsla(228 18% 11% / 0.8)", border: "1px solid hsla(228 20% 20% / 0.4)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {demoRestaurant.logo_url ? <img src={demoRestaurant.logo_url} alt="" className="w-10 h-10 rounded-xl object-cover border border-border/30" /> :
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><ChefHat className="w-5 h-5 text-primary" /></div>}
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{demoRestaurant.name}</h3>
                    <p className="text-[10px] text-muted-foreground">Demo Ristorante · Personalizzabile</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setEditingDemo(!editingDemo)} className="p-2 rounded-lg transition-colors" style={{ background: "hsla(265 20% 18% / 0.6)", border: "1px solid hsla(265 30% 30% / 0.2)" }}>
                    {editingDemo ? <XIcon className="w-3.5 h-3.5 text-muted-foreground" /> : <Pencil className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                  <button onClick={() => setShowResetConfirm(true)} disabled={resettingDemo} className="p-2 rounded-lg transition-colors" style={{ background: "hsla(265 20% 18% / 0.6)", border: "1px solid hsla(265 30% 30% / 0.2)" }}>
                    <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${resettingDemo ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Edit panel */}
              <AnimatePresence>
                {editingDemo && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-4 rounded-xl space-y-3" style={{ background: "hsla(228 18% 14% / 0.8)", border: "1px solid hsla(228 20% 22% / 0.3)" }}>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium text-muted-foreground">Nome</label>
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "hsla(228 18% 10% / 0.8)", border: "1px solid hsla(228 20% 22% / 0.4)" }} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium text-muted-foreground">Colore</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)} className="w-8 h-8 rounded-lg border border-border/50 cursor-pointer bg-transparent" />
                          {["#C8963E", "#1A1A2E", "#E74C3C", "#2ECC71", "#3498DB", "#8E44AD"].map(c => (
                            <button key={c} onClick={() => setEditColor(c)} className={`w-6 h-6 rounded-lg border-2 transition-all ${editColor === c ? "border-foreground scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium text-muted-foreground">Logo</label>
                        <input type="file" accept="image/*" ref={logoFileRef} onChange={handleUploadLogo} className="hidden" />
                        <button onClick={() => logoFileRef.current?.click()} disabled={uploadingLogo} className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed text-xs text-muted-foreground" style={{ borderColor: "hsla(228 20% 22% / 0.5)" }}>
                          <Upload className={`w-3.5 h-3.5 ${uploadingLogo ? "animate-pulse" : ""}`} />
                          {uploadingLogo ? "Caricamento..." : "Carica Logo"}
                        </button>
                      </div>
                      <button onClick={handleSaveDemoCustomization} disabled={savingDemo} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs disabled:opacity-50 flex items-center justify-center gap-2">
                        <Save className={`w-3.5 h-3.5 ${savingDemo ? "animate-spin" : ""}`} />
                        {savingDemo ? "Salvataggio..." : "Salva"}
                      </button>
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
                  <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all text-center" style={{ background: "hsla(228 18% 14% / 0.6)", border: "1px solid hsla(228 20% 22% / 0.3)" }}>
                    <span className="text-lg">{link.emoji}</span>
                    <span className="text-[10px] font-semibold text-foreground">{link.label}</span>
                  </a>
                ))}
              </div>
              <p className="text-[9px] text-muted-foreground text-center">PIN Cucina: <span className="font-mono font-bold text-foreground">1234</span></p>
            </div>
          </section>
        )}

        {/* ═══════ RECRUITMENT SECTION ═══════ */}
        {!demoMode && (
          <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
            <div className="p-5 rounded-2xl space-y-3" style={{ background: "hsla(228 18% 11% / 0.8)", border: "1px solid hsla(228 20% 20% / 0.4)" }}>
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Recluta Sotto-Venditori</h3>
              </div>
              <p className="text-xs text-muted-foreground">Condividi il tuo link personale. Chi si registra verrà assegnato al tuo team.</p>
              <div className="p-3 rounded-xl" style={{ background: "hsla(228 18% 14% / 0.6)", border: "1px solid hsla(228 20% 22% / 0.3)" }}>
                <p className="text-[10px] text-muted-foreground mb-1 font-medium">Il tuo link:</p>
                <p className="text-xs text-foreground font-mono break-all select-all">{window.location.origin}/auth?role=partner&ref={user?.id}</p>
              </div>
              <motion.button onClick={handleCopyInviteLink} whileTap={{ scale: 0.97 }} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
                {inviteCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {inviteCopied ? "Link Copiato!" : "Copia Link di Reclutamento"}
              </motion.button>
            </div>
          </section>
        )}

        {/* ═══════ TEAM LEADER SECTION ═══════ */}
        {isTeamLeader && !demoMode && (
          <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4 space-y-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Il Tuo Team ({teamMembers.length} membri)</h3>
            
            {/* Leader status */}
            {(() => {
              const isActive = salesCount >= 4 && teamMembers.length >= 2;
              return (
                <div className="p-4 rounded-2xl" style={{ background: isActive ? "hsla(150 40% 12% / 0.5)" : "hsla(0 40% 12% / 0.5)", border: `1px solid ${isActive ? "hsla(150 40% 30% / 0.3)" : "hsla(0 40% 30% / 0.3)"}` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-emerald-400 animate-pulse" : "bg-destructive"}`} />
                      <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? "text-emerald-400" : "text-destructive"}`}>{isActive ? "Leader Attivo" : "Leader Sospeso"}</span>
                    </div>
                    <Crown className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-destructive/50"}`} />
                  </div>
                </div>
              );
            })()}

            {/* Override Revenue */}
            <div className="p-5 rounded-2xl" style={{ background: "hsla(210 30% 12% / 0.6)", border: "1px solid hsla(210 30% 25% / 0.3)" }}>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">Revenue da Management</p>
              <p className="text-3xl font-bold text-foreground">€{totalOverrides.toLocaleString()}</p>
              <p className="text-[10px] text-sky-400 font-medium mt-2">€50 × vendite idonee (dalla 5ª per membro)</p>
            </div>

            {/* Team Ledger */}
            {teamMembers.length > 0 && (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <span className="col-span-5">Partner</span><span className="col-span-2 text-center">Vendite</span><span className="col-span-3 text-center">Override</span><span className="col-span-2 text-center">Stato</span>
                </div>
                {teamMembers.map((member, i) => {
                  const memberSales = teamSales.filter((s: any) => s.partner_id === member.partner_id).length;
                  const eligibleOverrides = Math.max(0, memberSales - 4);
                  return (
                    <div key={member.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl" style={{ background: "hsla(228 18% 12% / 0.6)", border: "1px solid hsla(228 20% 20% / 0.3)" }}>
                      <div className="col-span-5 flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center flex-shrink-0"><Users className="w-3.5 h-3.5 text-sky-400" /></div>
                        <p className="text-xs font-semibold text-foreground truncate">{(member.profiles as any)?.full_name || "Partner"}</p>
                      </div>
                      <p className="col-span-2 text-center text-sm font-bold text-foreground">{memberSales}</p>
                      <p className="col-span-3 text-center text-sm font-bold text-primary">€{(eligibleOverrides * 50).toLocaleString()}</p>
                      <div className="col-span-2 flex justify-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${memberSales >= 5 ? "bg-emerald-500/10 text-emerald-400" : "text-muted-foreground"}`}>
                          {memberSales >= 5 ? "Attivo" : "🔒"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ═══════ PORTFOLIO GRID (Lowengeld-style) ═══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTOR_CARDS.slice(0, showFullPortfolio ? undefined : 6).map((card, i) => (
              <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.02]"
                style={{ background: "hsla(228 18% 11% / 0.8)", border: "1px solid hsla(228 20% 20% / 0.4)" }}
                onClick={() => {
                  if (card.id === "food") navigate(`/r/demo-partner-${user?.id?.substring(0, 8)}`);
                  else navigate(`/demo/${card.id}`);
                }}>
                {/* Mockup previews */}
                <div className="p-4 flex gap-2 justify-center overflow-hidden h-[160px] items-end" style={{ background: `linear-gradient(135deg, ${card.accent}15, hsla(228 18% 11% / 0.9))` }}>
                  {card.screens.slice(0, 3).map((src, j) => (
                    <div key={j} className={`${j === 1 ? "w-[80px]" : "w-[65px]"} aspect-[9/19.5] rounded-[12px] border overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105`} style={{ borderColor: "hsla(220 12% 80% / 0.15)" }}>
                      <img src={src} alt="" className="w-full h-full object-cover object-top" loading="lazy" />
                    </div>
                  ))}
                </div>
                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {card.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider" style={{ background: `${card.accent}20`, color: card.accent }}>{tag}</span>
                    ))}
                  </div>
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">{card.name}</h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {SECTOR_CARDS.length > 6 && (
            <div className="text-center mt-6">
              <button onClick={() => setShowFullPortfolio(!showFullPortfolio)} className="px-6 py-2.5 rounded-xl text-xs font-semibold transition-all" style={{ background: "hsla(265 20% 18% / 0.6)", border: "1px solid hsla(265 30% 30% / 0.3)", color: "hsl(265 70% 75%)" }}>
                {showFullPortfolio ? "Mostra meno" : `Vedi tutti (${SECTOR_CARDS.length})`}
              </button>
            </div>
          )}
        </section>

        {/* ═══════ CTA SECTION ═══════ */}
        <section className="relative py-16 text-center overflow-hidden" style={{ background: "linear-gradient(180deg, hsla(265 25% 10% / 0.5) 0%, hsla(228 22% 8% / 0.5) 100%)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(ellipse, hsl(265 60% 55%), transparent 70%)", filter: "blur(80px)" }} />
          </div>
          <div className="relative z-10 max-w-xl mx-auto px-4 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider" style={{ background: "hsla(265 30% 20% / 0.6)", border: "1px solid hsla(265 30% 40% / 0.3)", color: "hsl(265 70% 75%)" }}>
              <Send className="w-3 h-3" /> Pronto?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              Il cliente è interessato?<br />
              <span className="text-primary">Passiamo all'azione.</span>
            </h2>
            <p className="text-sm text-muted-foreground">Condividi il link del progetto o contattaci per una demo personalizzata.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button onClick={() => navigate("/home?from=partner")} whileTap={{ scale: 0.97 }} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Mostra al Cliente
              </motion.button>
              <motion.button onClick={() => setShowFullPortfolio(true)} whileTap={{ scale: 0.97 }} className="px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2" style={{ background: "hsla(265 20% 18% / 0.6)", border: "1px solid hsla(265 30% 30% / 0.3)", color: "hsl(265 70% 75%)" }}>
                <ExternalLink className="w-4 h-4" /> Vedi Portfolio Completo
              </motion.button>
            </div>
          </div>
        </section>

        {/* ═══════ FOOTER ═══════ */}
        <footer className="py-8 text-center border-t" style={{ borderColor: "hsla(228 20% 20% / 0.3)" }}>
          <div className="w-12 h-0.5 rounded-full mx-auto mb-4" style={{ background: "hsla(265 30% 30% / 0.3)" }} />
          <p className="text-[11px] text-muted-foreground">Riservato ai partner commerciali — Empire © {new Date().getFullYear()}</p>
        </footer>
      </div>

      {/* ═══════ VOICE AGENT ═══════ */}
      <PartnerVoiceAgent activeTab="dashboard" demoMode={demoMode} />
      
      {/* ROI Calculator */}
      <ROICalculator open={showROI} onClose={() => setShowROI(false)} />

      {/* Reset Confirm Dialog */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
            onClick={() => setShowResetConfirm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()} className="w-full max-w-sm p-6 rounded-2xl bg-card border border-border shadow-2xl">
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

      <PageGuide />
    </div>
  );
};

/* ═══════ DM TEMPLATE ═══════ */
const dmTemplate = `"Ciao! 🤩 Abbiamo notato la vostra attività su Instagram e siamo rimasti colpiti. Gestire prenotazioni, ordini e fidelizzare i clienti può essere una sfida, e proprio per questo abbiamo sviluppato app personalizzate che semplificano questi processi. Date un'occhiata qui! 👉 Vi va di fare una breve chiacchierata per capire se potremmo fare lo stesso per voi?"`;

export default PartnerDashboard;
