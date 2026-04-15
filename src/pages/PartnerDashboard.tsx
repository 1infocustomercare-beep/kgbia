import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { Switch } from "@/components/ui/switch";
import empireMonkeyMascot from "@/assets/empire-monkey.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, DollarSign, LogOut,
  Crown, Trophy, Sparkles, Target,
  Eye, EyeOff, Users,
  Copy, CheckCircle, UserPlus, ChevronRight,
  ExternalLink, ArrowLeft, Send, RefreshCw,
  Pencil, Upload, Save, X as XIcon,
  Globe, Search, Zap, Presentation, Bot, Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageGuide from "@/components/ui/page-guide";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { INDUSTRY_CONFIGS } from "@/config/industry-config";
import PartnerVoiceAgent from "@/components/partner/PartnerVoiceAgent";
import PartnerOutreachCRM from "@/components/partner/PartnerOutreachCRM";
import PartnerProfileSection from "@/components/partner/PartnerProfileSection";
import BonusProgressRing from "@/components/partner/BonusProgressRing";
import ROICalculator from "@/components/partner/ROICalculator";
import ProjectDetailOverlay from "@/components/partner/ProjectDetailOverlay";
import { toast } from "@/hooks/use-toast";
import { usePartnerDemoRestaurant } from "@/hooks/usePartnerDemoRestaurant";
import { PORTFOLIO_PROJECTS } from "@/data/portfolio-showcase-data";
import { SECTOR_PORTFOLIO } from "@/data/sector-mockup-images";
import { DEMO_SLUGS } from "@/data/demo-industries";

/* Helper: resolve demo URLs */
const getDemoSiteUrl = (sectorId: string) => {
  if (sectorId === "food") return "/r/impero-roma";
  if (sectorId === "ncc") return "/b/amalfi-luxury-transfer";
  const slug = DEMO_SLUGS[sectorId as keyof typeof DEMO_SLUGS] || sectorId;
  return `/demo/${slug}`;
};
const getDemoAdminUrl = (sectorId: string) => {
  if (sectorId === "food") return "/dashboard";
  if (sectorId === "ncc") return "/app";
  const slug = DEMO_SLUGS[sectorId as keyof typeof DEMO_SLUGS] || sectorId;
  return `/demo/${slug}/admin`;
};

/* ═══════════════════════════════════════════
   SECTOR CARDS for portfolio grid
   ═══════════════════════════════════════════ */
const ALL_INDUSTRY_IDS = Object.keys(INDUSTRY_CONFIGS) as (keyof typeof INDUSTRY_CONFIGS)[];

const SECTOR_CARDS = ALL_INDUSTRY_IDS.map(key => {
  const config = INDUSTRY_CONFIGS[key];
  const project = PORTFOLIO_PROJECTS[key as keyof typeof PORTFOLIO_PROJECTS];
  const portfolio = SECTOR_PORTFOLIO.find(sp => sp.sectorId === key);
  const firstBrand = portfolio?.brands?.[0];
  const firstStyle = firstBrand?.styles?.[0];
  const screens = firstStyle?.screens?.slice(0, 3) || [];
  return {
    id: key,
    name: project?.name || config.label,
    description: project?.description || config.description,
    tags: project?.tags || [config.label],
    screens,
    accent: project?.accent || "#a78bfa",
    emoji: config.emoji,
  };
});

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { signOut, isTeamLeader, user } = useAuth();
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const [showROI, setShowROI] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [demoMode, setDemoMode] = useState(() => sessionStorage.getItem("partner_demo_mode") === "true");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamSales, setTeamSales] = useState<any[]>([]);
  const [salesCount, setSalesCount] = useState(0);
  const [realTotalCommissions, setRealTotalCommissions] = useState(0);
  const [currentMonthSalesCount, setCurrentMonthSalesCount] = useState(0);
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

  const [showEarnings, setShowEarnings] = useState(false);
  const [detailProject, setDetailProject] = useState<string | null>(null);
  const [partnerAvatar, setPartnerAvatar] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [demoSectionEnabled, setDemoSectionEnabled] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [sectorSearch, setSectorSearch] = useState("");

  // Persist demoMode
  useEffect(() => { sessionStorage.setItem("partner_demo_mode", demoMode ? "true" : "false"); }, [demoMode]);

  // Sync edit fields
  useEffect(() => {
    if (demoRestaurant) {
      setEditName(demoRestaurant.name);
      setEditColor(demoRestaurant.primary_color || "#C8963E");
    }
  }, [demoRestaurant]);

  useEffect(() => {
    if (!user?.id) return;
    fetchPartnerData();
    supabase.from("profiles").select("avatar_url, full_name, demo_section_enabled").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data?.avatar_url) setPartnerAvatar(data.avatar_url);
      if (data?.full_name) setProfileName(data.full_name);
      if ((data as any)?.demo_section_enabled) setDemoSectionEnabled(true);
    });
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
    const { data: sales } = await supabase.from("partner_sales").select("*").eq("partner_id", user.id);
    const allSales = sales || [];
    setSalesCount(allSales.length);
    const realCommissions = allSales.reduce((s: number, sale: any) => s + Number(sale.partner_commission || 0), 0);
    setRealTotalCommissions(realCommissions);
    const cm = new Date().toISOString().slice(0, 7);
    const cmSales = allSales.filter((s: any) => s.sale_month === cm).length;
    setCurrentMonthSalesCount(cmSales);
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

  const matchesSectorSearch = (card: typeof SECTOR_CARDS[0], query: string): boolean => {
    if (!query.trim()) return true;
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const haystack = [card.name, card.id, card.description || "", ...(card.tags || [])].join(" ").toLowerCase();
    return terms.every(t => haystack.includes(t));
  };

  const totalBonuses = monthlyBonuses.reduce((s, b) => s + Number(b.bonus_amount), 0);
  const estimatedCommissions = realTotalCommissions;
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
  const currentMonthSales = currentMonthSalesCount;
  const userName = profileName || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Partner";

  return (
    <div className={`min-h-screen flex flex-col relative admin-panel ${isDark ? 'landing-dark partner-console' : ''}`}
      style={isDark ? { background: "#0a0a14" } : undefined}>
      
      {/* ═══════ TOP NAV BAR ═══════ */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b border-border/50 safe-top bg-background/95 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#a78bfa" }}>
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
          <span className="text-sm font-bold text-white ml-2">Partner Portal</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Demo/Presentation Switch */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all" style={{
            background: demoMode ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${demoMode ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.08)"}`,
          }}>
            {demoMode ? <Presentation className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} /> : <Eye className="w-3.5 h-3.5" style={{ color: "#6b7280" }} />}
            <span className="text-[10px] font-semibold hidden sm:inline" style={{ color: demoMode ? "#f59e0b" : "#9ca3af" }}>
              {demoMode ? "LIVE" : "Demo"}
            </span>
            <Switch
              checked={demoMode}
              onCheckedChange={(checked) => {
                setDemoMode(checked);
                toast({ title: checked ? "🎯 Modalità Presentazione" : "🔓 Modalità Normale", description: checked ? "Solo contenuti per la vendita — dati sensibili nascosti" : "Tutti i dati e strumenti visibili" });
              }}
              className="data-[state=checked]:bg-amber-500 h-4 w-8 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-4"
            />
          </div>
          <DarkModeToggle />
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-medium" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ═══════ SCROLLABLE CONTENT ═══════ */}
      <div className="flex-1 overflow-y-auto">
        
        {/* ═══════ HERO SECTION ═══════ */}
        <section className="relative px-4 sm:px-8 pt-10 pb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(circle, #7c3aed, transparent 65%)", filter: "blur(120px)" }} />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 max-w-5xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
                  style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  {partnerAvatar ? (
                    <img src={partnerAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <img src={empireMonkeyMascot} alt="Empire" className="w-12 h-12 object-contain" />
                  )}
                </motion.div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-xs" style={{ color: "#9ca3af" }}>Benvenuto,</p>
                    <h1 className="text-xl font-bold text-white">{userName}</h1>
                  </div>
                  {!demoMode && (
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowProfileEdit(prev => !prev)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={{ background: showProfileEdit ? "rgba(167,139,250,0.25)" : "rgba(255,255,255,0.06)", border: `1px solid ${showProfileEdit ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.1)"}` }}>
                      <Pencil className="w-3.5 h-3.5" style={{ color: showProfileEdit ? "#c4b5fd" : "#9ca3af" }} />
                    </motion.button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {!demoMode && (
                  <button onClick={() => setShowEarnings(!showEarnings)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: showEarnings ? "rgba(16,185,129,0.15)" : "rgba(167,139,250,0.12)", border: `1px solid ${showEarnings ? "rgba(16,185,129,0.3)" : "rgba(167,139,250,0.25)"}` }}>
                    <DollarSign className="w-4 h-4" style={{ color: showEarnings ? "#10b981" : "#a78bfa" }} />
                    <span className="text-white">Guadagni</span>
                  </button>
                )}
                <button onClick={() => navigate("/home?from=partner")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Globe className="w-4 h-4" style={{ color: "#9ca3af" }} />
                  <span style={{ color: "#d1d5db" }}>Mostra Sito</span>
                </button>
              </div>
            </div>

            <div className="text-left sm:text-right max-w-md">
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {demoMode ? (
                  <>Scopri cosa possiamo<br /><span style={{ color: "#f59e0b" }}>creare per te.</span></>
                ) : (
                  <>Il tuo catalogo app,<br /><span style={{ color: "#a78bfa" }}>pronto da mostrare.</span></>
                )}
              </h2>
              <p className="text-sm mt-2" style={{ color: "#9ca3af" }}>
                {demoMode
                  ? "App, siti web e agenti IA personalizzati per ogni settore — tutto incluso, chiavi in mano."
                  : "Sfoglia i progetti, seleziona uno stile e mostra le preview ai clienti."
                }
              </p>
            </div>
          </div>
        </section>

        {/* ═══════ PROFILE EDIT ═══════ */}
        <AnimatePresence>
          {showProfileEdit && !demoMode && user?.id && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <PartnerProfileSection userId={user.id} userName={userName} userEmail={user.email || ""} onAvatarChange={(url) => setPartnerAvatar(url)} onNameChange={(name) => setProfileName(name)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════ DEMO MODE — SALES PRESENTATION CONTENT ═══════ */}
        <AnimatePresence>
          {demoMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Value banner */}
              <div className="py-2 text-center" style={{ background: "rgba(245,158,11,0.06)", borderTop: "1px solid rgba(245,158,11,0.15)", borderBottom: "1px solid rgba(245,158,11,0.15)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#f59e0b" }}>
                  <Presentation className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                  Presentazione per il Cliente
                </p>
              </div>

              {/* Key selling points */}
              <section className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { emoji: "📱", title: "App White Label", desc: "Personalizzata con il tuo brand" },
                    { emoji: "🤖", title: "Agenti IA", desc: "Automatizzano il lavoro" },
                    { emoji: "📊", title: "Analytics", desc: "Dati e previsioni intelligenti" },
                    { emoji: "💬", title: "WhatsApp & CRM", desc: "Contatti e fidelizzazione" },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="p-3.5 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <span className="text-2xl block mb-1.5">{item.emoji}</span>
                      <p className="text-xs font-bold text-white">{item.title}</p>
                      <p className="text-[9px] mt-0.5" style={{ color: "#9ca3af" }}>{item.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Packages preview for client */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#f59e0b" }}>
                    <Package className="w-3 h-3 inline mr-1 -mt-0.5" /> Pacchetti Disponibili
                  </h3>
                  {[
                    { name: "Digital Start", price: "1.997", monthly: "49", color: "#a78bfa", features: ["App completa", "Menu/Catalogo QR", "Dashboard Analytics"] },
                    { name: "Growth AI", price: "4.997", monthly: "29", color: "#14b8a6", badge: "Consigliato", features: ["Tutto di Start +", "AI Engine completo", "2 Agenti IA inclusi", "Review Shield™"] },
                    { name: "Empire Domination", price: "7.997", monthly: "0", color: "#f59e0b", badge: "Tutto Incluso", features: ["TUTTO incluso", "0% commissioni", "5 Agenti IA", "Account Manager VIP"] },
                  ].map((pkg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                      className="p-4 rounded-xl flex items-center gap-4" style={{ background: `${pkg.color}08`, border: `1px solid ${pkg.color}25` }}>
                      <div className="shrink-0 text-center">
                        <p className="text-xl font-bold text-white">€{pkg.price}</p>
                        <p className="text-[9px]" style={{ color: "#6b7280" }}>
                          {pkg.monthly === "0" ? "€0/mese" : `poi €${pkg.monthly}/mese`}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-bold text-white">{pkg.name}</p>
                          {pkg.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: `${pkg.color}20`, color: pkg.color }}>{pkg.badge}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                          {pkg.features.map((f, j) => (
                            <span key={j} className="text-[9px] flex items-center gap-1" style={{ color: "#d1d5db" }}>
                              <CheckCircle className="w-2.5 h-2.5" style={{ color: pkg.color }} /> {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* AI Agents highlight */}
                <div className="p-5 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(245,158,11,0.04))", border: "1px solid rgba(167,139,250,0.15)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-5 h-5" style={{ color: "#a78bfa" }} />
                    <h3 className="text-sm font-bold text-white">Agenti IA Personalizzati</h3>
                  </div>
                  <p className="text-xs mb-3" style={{ color: "#9ca3af" }}>
                    Ogni agente lavora 24/7 per automatizzare la tua attività: risposte ai clienti, gestione ordini, marketing, recensioni e molto altro.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: "Assistente Clienti", emoji: "💬" },
                      { name: "Review Shield", emoji: "⭐" },
                      { name: "Marketing AI", emoji: "📣" },
                    ].map((agent, i) => (
                      <div key={i} className="p-2.5 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <span className="text-lg block">{agent.emoji}</span>
                        <p className="text-[9px] font-semibold text-white mt-1">{agent.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA for demo */}
                <div className="text-center py-2">
                  <p className="text-xs" style={{ color: "#9ca3af" }}>👇 Scorri per vedere le preview di ogni settore</p>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════ LEAD ENGINE SCOUT — MAIN CTA ═══════ */}
        {!demoMode && (
          <section className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              className="relative p-6 rounded-2xl overflow-hidden cursor-pointer group"
              style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.08), rgba(16,185,129,0.04))", border: "1px solid rgba(20,184,166,0.2)" }}
              onClick={() => navigate("/partner/leads")}
            >
              <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-[0.06] pointer-events-none" style={{ background: "radial-gradient(circle, #14b8a6, transparent 65%)", filter: "blur(80px)" }} />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #14b8a6, #10b981)" }}>
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white">LeadEngine Scout</h3>
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider animate-pulse" style={{ background: "rgba(16,185,129,0.2)", color: "#34d399" }}>
                      AI Pipeline
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>
                    Cerca lead reali → Analisi automatica → Messaggio personalizzato per canale — tutto in un unico flusso professionale.
                  </p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {["🔍 Ricerca Multi-Fonte", "📊 Score & Analisi", "💬 Copy AI per WA/IG/Email", "📥 Lead Esterni"].map(tag => (
                      <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: "rgba(20,184,166,0.08)", color: "#5eead4", border: "1px solid rgba(20,184,166,0.15)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" style={{ color: "#14b8a6" }} />
              </div>
            </motion.div>
          </section>
        )}

        {/* ═══════ EARNINGS SECTION ═══════ */}
        {!demoMode && (
          <AnimatePresence>
            {showEarnings && (
              <motion.section initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-4">
                  <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#6ee7b7" }}>Guadagni Netti</p>
                    <p className="text-4xl font-bold text-white">€{netEarnings.toLocaleString()}</p>
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#34d399" }} /><span className="text-[10px]" style={{ color: "#9ca3af" }}>Commissioni €{estimatedCommissions.toLocaleString()}</span></div>
                      {isTeamLeader && totalOverrides > 0 && <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#38bdf8" }} /><span className="text-[10px]" style={{ color: "#9ca3af" }}>Override €{totalOverrides.toLocaleString()}</span></div>}
                      {totalBonuses > 0 && <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#fbbf24" }} /><span className="text-[10px]" style={{ color: "#9ca3af" }}>Bonus €{totalBonuses.toLocaleString()}</span></div>}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Trophy, value: salesCount, label: "Vendite", color: "#a78bfa" },
                      { icon: DollarSign, value: salesCount > 0 ? `€${Math.round(realTotalCommissions / salesCount)}` : "€0", label: "Per Vendita", color: "#34d399" },
                      { icon: isTeamLeader ? Users : Target, value: isTeamLeader ? teamMembers.length : `${salesCount}/4`, label: isTeamLeader ? "Team" : "a Team Leader", color: "#38bdf8" },
                    ].map((s, i) => (
                      <div key={i} className="p-3.5 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <s.icon className="w-4 h-4 mb-1 mx-auto" style={{ color: s.color }} />
                        <p className="text-xl font-bold text-white">{s.value}</p>
                        <p className="text-[10px]" style={{ color: "#9ca3af" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-white flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} /> Bonus Mensile</h3>
                      <span className="text-[10px]" style={{ color: "#6b7280" }}>{currentMonth}</span>
                    </div>
                    <div className="flex items-center justify-around">
                      <BonusProgressRing salesCount={currentMonthSales} milestone={3} label="€500" reward={currentMonthSales >= 3 ? "✓ Sbloccato" : `${3 - currentMonthSales} mancanti`} unlocked={currentMonthSales >= 3} />
                      <BonusProgressRing salesCount={currentMonthSales} milestone={5} label="€1.500" reward={currentMonthSales >= 5 ? "✓ Sbloccato" : `${5 - currentMonthSales} mancanti`} unlocked={currentMonthSales >= 5} />
                    </div>
                  </div>
                  <button onClick={() => setShowEarnings(false)} className="w-full py-2.5 text-xs text-center transition-colors" style={{ color: "#6b7280" }}>
                    Chiudi sezione guadagni ↑
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        )}

        {/* ═══════ DEMO PERSONALIZZATA ═══════ */}
        {!demoMode && demoSectionEnabled && (
          <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
            <div className="p-5 rounded-2xl space-y-4" style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.12)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(167,139,250,0.15)" }}>
                    <LayoutDashboard className="w-5 h-5" style={{ color: "#a78bfa" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Demo Personalizzata</h3>
                    <p className="text-[10px]" style={{ color: "#9ca3af" }}>
                      {selectedProject ? `Settore: ${INDUSTRY_CONFIGS[selectedProject as keyof typeof INDUSTRY_CONFIGS]?.label || selectedProject}` : "Seleziona un settore dal portfolio"} · Pronta da mostrare
                    </p>
                  </div>
                </div>
                <button onClick={() => setEditingDemo(!editingDemo)} className="p-2 rounded-lg transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {editingDemo ? <XIcon className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} /> : <Pencil className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />}
                </button>
              </div>

              {/* Customization panel */}
              <AnimatePresence>
                {editingDemo && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#a78bfa" }}>Personalizza per il cliente</p>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium" style={{ color: "#9ca3af" }}>Nome Attività del Cliente</label>
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                          placeholder="Es: Ristorante Da Mario, Salone Bella..."
                          className="w-full px-3 py-2 rounded-lg text-sm bg-white !text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium" style={{ color: "#9ca3af" }}>Colori Brand</label>
                        <div className="flex items-center gap-2 flex-wrap">
                          <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent" style={{ border: "1px solid rgba(255,255,255,0.15)" }} />
                          {["#C8963E", "#1A1A2E", "#E74C3C", "#2ECC71", "#3498DB", "#8E44AD", "#ec4899", "#f97316"].map(c => (
                            <button key={c} onClick={() => setEditColor(c)} className={`w-6 h-6 rounded-lg transition-all ${editColor === c ? "scale-110 ring-2 ring-white" : ""}`} style={{ backgroundColor: c, border: editColor === c ? "2px solid white" : "2px solid transparent" }} />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium" style={{ color: "#9ca3af" }}>Logo del Cliente</label>
                        <input type="file" accept="image/*" ref={logoFileRef} onChange={handleUploadLogo} className="hidden" />
                        <button onClick={() => logoFileRef.current?.click()} disabled={uploadingLogo}
                          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed text-xs"
                          style={{ borderColor: "rgba(255,255,255,0.15)", color: "#d1d5db" }}>
                          <Upload className={`w-3.5 h-3.5 ${uploadingLogo ? "animate-pulse" : ""}`} />
                          {uploadingLogo ? "Caricamento..." : "Carica Logo Cliente"}
                        </button>
                      </div>
                      {demoRestaurant && (
                        <button onClick={handleSaveDemoCustomization} disabled={savingDemo}
                          className="w-full py-2.5 rounded-xl font-semibold text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                          style={{ background: "#7c3aed", color: "#ffffff" }}>
                          <Save className={`w-3.5 h-3.5 ${savingDemo ? "animate-spin" : ""}`} />
                          {savingDemo ? "Salvataggio..." : "Salva Personalizzazione"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a href={selectedProject ? getDemoSiteUrl(selectedProject) : "#"}
                  target="_blank" rel="noopener noreferrer"
                  onClick={e => { if (!selectedProject) { e.preventDefault(); toast({ title: "Seleziona un settore", description: "Scegli un progetto dal catalogo sotto." }); }}}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all text-center group"
                  style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                    <Globe className="w-5 h-5" style={{ color: "#34d399" }} />
                  </div>
                  <span className="text-xs font-bold text-white">Sito Cliente</span>
                  <span className="text-[9px]" style={{ color: "#6b7280" }}>Mostra al cliente come appare</span>
                </a>
                <a href={selectedProject ? getDemoAdminUrl(selectedProject) : "#"}
                  target="_blank" rel="noopener noreferrer"
                  onClick={e => { if (!selectedProject) { e.preventDefault(); toast({ title: "Seleziona un settore", description: "Scegli un progetto dal catalogo sotto." }); }}}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all text-center group"
                  style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(167,139,250,0.15)" }}>
                    <LayoutDashboard className="w-5 h-5" style={{ color: "#a78bfa" }} />
                  </div>
                  <span className="text-xs font-bold text-white">Dashboard Admin</span>
                  <span className="text-[9px]" style={{ color: "#6b7280" }}>Mostra le funzionalità</span>
                </a>
              </div>

              {/* Food demo restaurant quick links */}
              {demoRestaurant && selectedProject === "food" && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#d4af37" }}>🍽️ Demo Ristorante Personalizzata</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Cliente", emoji: "👤", href: `/r/${demoRestaurant.slug}` },
                      { label: "Admin", emoji: "⚙️", href: `/dashboard` },
                      { label: "Cucina", emoji: "👨‍🍳", href: `/kitchen` },
                    ].map((link, i) => (
                      <a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all text-center"
                        style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
                        <span className="text-lg">{link.emoji}</span>
                        <span className="text-[10px] font-semibold text-white">{link.label}</span>
                      </a>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[9px]" style={{ color: "#6b7280" }}>PIN Cucina: <span className="font-mono font-bold text-white">1234</span></p>
                    <button onClick={() => setShowResetConfirm(true)} disabled={resettingDemo}
                      className="flex items-center gap-1 text-[9px] font-medium px-2 py-1 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}>
                      <RefreshCw className={`w-3 h-3 ${resettingDemo ? "animate-spin" : ""}`} /> Reset Demo
                    </button>
                  </div>
                </div>
              )}

              {!selectedProject && (
                <p className="text-[10px] text-center py-2 rounded-lg" style={{ background: "rgba(245,158,11,0.06)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.12)" }}>
                  ☝️ Seleziona un settore dal portfolio sotto per attivare la demo personalizzata
                </p>
              )}
            </div>
          </section>
        )}

        {/* ═══════ CRM CONTATTI ═══════ */}
        {!demoMode && user?.id && (
          <PartnerOutreachCRM partnerId={user.id} />
        )}

        {/* ═══════ RECRUITMENT SECTION ═══════ */}
        {!demoMode && (
          <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
            <div className="p-5 rounded-2xl space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" style={{ color: "#a78bfa" }} />
                <h3 className="text-sm font-bold text-white">Recluta Sotto-Venditori</h3>
              </div>
              <p className="text-xs" style={{ color: "#9ca3af" }}>Condividi il tuo link personale. Chi si registra verrà assegnato al tuo team.</p>
              <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] mb-1 font-medium" style={{ color: "#6b7280" }}>Il tuo link:</p>
                <p className="text-xs font-mono break-all select-all" style={{ color: "#d1d5db" }}>{window.location.origin}/auth?role=partner&ref={user?.id}</p>
              </div>
              <motion.button onClick={handleCopyInviteLink} whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: "#7c3aed", color: "#ffffff" }}>
                {inviteCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {inviteCopied ? "Link Copiato!" : "Copia Link di Reclutamento"}
              </motion.button>
            </div>
          </section>
        )}

        {/* ═══════ TEAM LEADER SECTION ═══════ */}
        {isTeamLeader && !demoMode && (
          <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4 space-y-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#9ca3af" }}>Il Tuo Team ({teamMembers.length} membri)</h3>
            {(() => {
              const isActive = salesCount >= 4 && teamMembers.length >= 2;
              return (
                <div className="p-4 rounded-2xl" style={{ background: isActive ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${isActive ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "animate-pulse" : ""}`} style={{ background: isActive ? "#34d399" : "#ef4444" }} />
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: isActive ? "#34d399" : "#ef4444" }}>{isActive ? "Leader Attivo" : "Leader Sospeso"}</span>
                    </div>
                    <Crown className="w-5 h-5" style={{ color: isActive ? "#34d399" : "rgba(239,68,68,0.5)" }} />
                  </div>
                </div>
              );
            })()}
            <div className="p-5 rounded-2xl" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#7dd3fc" }}>Revenue da Management</p>
              <p className="text-3xl font-bold text-white">€{totalOverrides.toLocaleString()}</p>
              <p className="text-[10px] font-medium mt-2" style={{ color: "#38bdf8" }}>€50 × vendite idonee (dalla 5ª per membro)</p>
            </div>
            {teamMembers.length > 0 && (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#6b7280" }}>
                  <span className="col-span-5">Partner</span><span className="col-span-2 text-center">Vendite</span><span className="col-span-3 text-center">Override</span><span className="col-span-2 text-center">Stato</span>
                </div>
                {teamMembers.map((member) => {
                  const memberSales = teamSales.filter((s: any) => s.partner_id === member.partner_id).length;
                  const eligibleOverrides = Math.max(0, memberSales - 4);
                  return (
                    <div key={member.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="col-span-5 flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(56,189,248,0.1)" }}><Users className="w-3.5 h-3.5" style={{ color: "#38bdf8" }} /></div>
                        <p className="text-xs font-semibold text-white truncate">{(member.profiles as any)?.full_name || "Partner"}</p>
                      </div>
                      <p className="col-span-2 text-center text-sm font-bold text-white">{memberSales}</p>
                      <p className="col-span-3 text-center text-sm font-bold" style={{ color: "#a78bfa" }}>€{(eligibleOverrides * 50).toLocaleString()}</p>
                      <div className="col-span-2 flex justify-center">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{
                          background: memberSales >= 5 ? "rgba(16,185,129,0.1)" : "transparent",
                          color: memberSales >= 5 ? "#34d399" : "#6b7280"
                        }}>
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

        {/* ═══════ PORTFOLIO GRID ═══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: "#9ca3af" }}>
            {demoMode ? "Catalogo Principale — Preview Settori" : "Portfolio Progetti — Clicca per esplorare"}
          </h3>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#6b7280" }} />
            <input value={sectorSearch} onChange={e => setSectorSearch(e.target.value)}
              placeholder="Cerca settore o attività..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs text-white placeholder:text-gray-500"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
            {sectorSearch && (
              <button onClick={() => setSectorSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <XIcon className="w-3 h-3" style={{ color: "#6b7280" }} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTOR_CARDS.filter(card => matchesSectorSearch(card, sectorSearch)).map((card, i) => (
              <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.02]"
                style={{
                  background: selectedProject === card.id ? `${card.accent}10` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${selectedProject === card.id ? `${card.accent}40` : "rgba(255,255,255,0.06)"}`,
                }}
                onClick={() => {
                  setSelectedProject(selectedProject === card.id ? null : card.id);
                  setDetailProject(card.id);
                }}>
                <div className="p-4 flex gap-2 justify-center overflow-hidden h-[160px] items-end" style={{ background: `linear-gradient(135deg, ${card.accent}15, rgba(10,10,20,0.9))` }}>
                  {card.screens.slice(0, 3).map((src, j) => (
                    <div key={j} className={`${j === 1 ? "w-[80px]" : "w-[65px]"} aspect-[9/19.5] rounded-[12px] overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105`} style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                      <img src={src} alt="" className="w-full h-full object-cover object-top" loading="lazy" />
                    </div>
                  ))}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {card.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider" style={{ background: `${card.accent}25`, color: card.accent }}>{tag}</span>
                    ))}
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">{card.name}</h4>
                  <p className="text-[11px] line-clamp-2" style={{ color: "#9ca3af" }}>{card.description}</p>
                  <p className="text-[10px] font-semibold flex items-center gap-1" style={{ color: "#a78bfa" }}>
                    Vedi tutti gli stili <ChevronRight className="w-3 h-3" />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════ CTA SECTION ═══════ */}
        <section className="relative py-16 text-center overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(124,58,237,0.06) 0%, rgba(10,10,20,0.5) 100%)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(ellipse, #7c3aed, transparent 70%)", filter: "blur(80px)" }} />
          </div>
          <div className="relative z-10 max-w-xl mx-auto px-4 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}>
              <Send className="w-3 h-3" /> Pronto?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Trova i tuoi prossimi clienti<br />
              <span style={{ color: "#14b8a6" }}>con un click.</span>
            </h2>
            <p className="text-sm" style={{ color: "#9ca3af" }}>Usa LeadEngine Scout per trovare, analizzare e contattare lead reali con messaggi AI personalizzati.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button onClick={() => navigate("/partner/leads")} whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #14b8a6, #10b981)", color: "#ffffff" }}>
                <Target className="w-4 h-4" /> Apri LeadEngine Scout
              </motion.button>
              <motion.button onClick={() => navigate("/home?from=partner")} whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}>
                <ExternalLink className="w-4 h-4" /> Mostra al Cliente
              </motion.button>
            </div>
          </div>
        </section>

        <footer className="py-8 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-12 h-0.5 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.1)" }} />
          <p className="text-[11px]" style={{ color: "#6b7280" }}>Riservato ai partner commerciali — Empire © {new Date().getFullYear()}</p>
        </footer>
      </div>

      {/* ═══════ PROJECT DETAIL OVERLAY ═══════ */}
      <AnimatePresence>
        {detailProject && (
          <ProjectDetailOverlay sectorId={detailProject} onClose={() => setDetailProject(null)} />
        )}
      </AnimatePresence>

      <PartnerVoiceAgent activeTab="dashboard" demoMode={demoMode} />
      <ROICalculator open={showROI} onClose={() => setShowROI(false)} />

      <AnimatePresence>
        {showResetConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowResetConfirm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()} className="w-full max-w-sm p-6 rounded-2xl shadow-2xl"
              style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 className="text-base font-bold text-white mb-2">Resetta Demo?</h3>
              <p className="text-xs mb-5" style={{ color: "#9ca3af" }}>Tutti i dati demo saranno ricreati da zero.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ background: "rgba(255,255,255,0.08)", color: "#d1d5db" }}>Annulla</button>
                <button onClick={handleResetDemo} className="flex-1 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#ef4444", color: "#ffffff" }}>Resetta tutto</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PageGuide />
    </div>
  );
};

export default PartnerDashboard;