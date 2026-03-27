import { useState, useEffect, useRef } from "react";
import empireMonkeyMascot from "@/assets/empire-monkey.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, DollarSign, LogOut,
  Crown, Trophy,
  Sparkles, Target,
  Eye, EyeOff, Users,
  Copy, CheckCircle, UserPlus, ChevronRight,
  ExternalLink, ChefHat, Smartphone, ArrowLeft,
  Mail, MapPin, Instagram, Send, RefreshCw,
  Pencil, Upload, Save, X as XIcon,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageGuide from "@/components/ui/page-guide";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PartnerVoiceAgent from "@/components/partner/PartnerVoiceAgent";
import BonusProgressRing from "@/components/partner/BonusProgressRing";
import ROICalculator from "@/components/partner/ROICalculator";
import DemoCreditsWallet from "@/components/partner/DemoCreditsWallet";
import ProjectDetailOverlay from "@/components/partner/ProjectDetailOverlay";
import { toast } from "@/hooks/use-toast";
import { usePartnerDemoRestaurant } from "@/hooks/usePartnerDemoRestaurant";
import { PORTFOLIO_PROJECTS } from "@/data/portfolio-showcase-data";
import { SECTOR_PORTFOLIO } from "@/data/sector-mockup-images";

/* ═══════════════════════════════════════════
   ACQUISITION CHANNELS
   ═══════════════════════════════════════════ */
const ACQUISITION_CHANNELS = [
  { id: "email", icon: Mail, label: "Email", desc: "Template professionali pronti da inviare" },
  { id: "field", icon: MapPin, label: "Porta a Porta", desc: "Pitch dal vivo con link e preview pronte" },
  { id: "instagram", icon: Instagram, label: "DM Instagram", desc: "Messaggi brevi e diretti per i social" },
] as const;

/* ═══════════════════════════════════════════
   SECTOR-SPECIFIC SALES TEMPLATES
   ═══════════════════════════════════════════ */
const SECTOR_TEMPLATES: Record<string, { dm: string; email: string; pitch: string }> = {
  food: {
    dm: `Ciao! 🍽️ Ho visto il vostro ristorante su Instagram ed è fantastico! Sapevate che con un'app personalizzata potete gestire ordini, menu digitale e prenotazioni tutto in un click? I vostri clienti ordinano direttamente dal tavolo con QR code, e voi riducete i tempi di attesa del 40%. Vi mostro un esempio reale? 👉`,
    email: `Oggetto: Più ordini, meno stress — La vostra app ristorante personalizzata\n\nGentili proprietari,\n\nAmministrate [NOME RISTORANTE] con passione, e noi vorremmo aiutarvi a crescere. La nostra piattaforma permette ai vostri clienti di:\n\n✅ Ordinare dal tavolo via QR code\n✅ Prenotare online 24/7\n✅ Ricevere notifiche su offerte speciali\n✅ Pagare in modo contactless\n\nI ristoranti che usano la nostra app vedono in media +35% di ordini e -25% di chiamate per prenotazioni.\n\nPosso mostrarvi una demo gratuita in 10 minuti?`,
    pitch: `"Il vostro ristorante merita un'app che lavori per voi anche quando chiudete. Menu digitale, ordini QR, cucina display in tempo reale — tutto questo è già pronto, personalizzato con il vostro brand."`,
  },
  beauty: {
    dm: `Ciao! 💅 Il vostro salone è stupendo! Sapevate che con un'app personalizzata i clienti possono prenotare trattamenti 24/7, scegliere lo stilista preferito e accumulare punti fedeltà? Niente più chiamate perse = più appuntamenti. Vi faccio vedere come funziona? ✨`,
    email: `Oggetto: Zero appuntamenti persi — L'app per il vostro salone\n\nBuongiorno,\n\nGestire le prenotazioni telefoniche toglie tempo prezioso al vostro lavoro creativo. La nostra app permette ai clienti di:\n\n✅ Prenotare servizi e scegliere l'operatore\n✅ Ricevere promemoria automatici (addio no-show!)\n✅ Accumulare punti fedeltà\n✅ Acquistare prodotti dal vostro shop integrato\n\nI saloni che usano la nostra piattaforma riducono i no-show del 60% e aumentano i clienti ricorrenti del 40%.\n\nVi mostro una demo in 10 minuti?`,
    pitch: `"Il vostro salone è un'esperienza — la vostra app deve esserlo altrettanto. Prenotazioni smart, programma fedeltà e shop integrato, tutto con il vostro stile unico."`,
  },
  ncc: {
    dm: `Ciao! 🚗 Gestite un servizio NCC? Con la nostra app i clienti prenotano transfer in 30 secondi, vedono la flotta disponibile e pagano online. Voi gestite autisti, tariffe e prenotazioni da un unico pannello. Volete una demo? 🏎️`,
    email: `Oggetto: Più prenotazioni, gestione flotta automatica — App NCC\n\nGentili,\n\nSappiamo quanto è complesso gestire un servizio NCC tra chiamate, preventivi e coordinamento autisti. La nostra piattaforma offre:\n\n✅ Prenotazione transfer online con calcolo automatico\n✅ Gestione flotta e autisti in tempo reale\n✅ Pagamenti sicuri e fatturazione automatica\n✅ App cliente con tracking del veicolo\n\nI servizi NCC che usano la nostra app aumentano le prenotazioni del 50% riducendo il tempo amministrativo.\n\nPosso mostrarvi una demo personalizzata?`,
    pitch: `"I vostri clienti VIP meritano un'esperienza di prenotazione premium. Con la nostra app prenotano in 30 secondi, tracciano il veicolo e pagano online — tutto brandizzato con il vostro logo."`,
  },
  fitness: {
    dm: `Ciao! 💪 La vostra palestra ha un potenziale enorme! Con un'app personalizzata i membri prenotano corsi, tracciano i progressi e rinnovano l'abbonamento tutto dal telefono. Risultato? Più retention e meno lavoro amministrativo. Vi mostro un esempio? 🏋️`,
    email: `Oggetto: Più iscritti, meno abbandoni — App per la vostra palestra\n\nBuongiorno,\n\nLa sfida più grande per una palestra è mantenere i membri attivi. La nostra app vi aiuta con:\n\n✅ Prenotazione corsi e personal trainer\n✅ Tracking progressi e sfide gamificate\n✅ Rinnovo abbonamento automatico\n✅ Notifiche push per promozioni e nuovi corsi\n\nLe palestre che usano la nostra piattaforma vedono +45% di retention e +30% di nuove iscrizioni da referral.\n\nDemo gratuita in 10 minuti?`,
    pitch: `"La vostra palestra non è solo un posto dove allenarsi — è una community. La nostra app la rende digitale: prenotazioni, progressi, sfide e social, tutto in un'app con il vostro brand."`,
  },
  healthcare: {
    dm: `Ciao! 🏥 Ho notato il vostro studio medico. Sapevate che con un'app personalizzata i pazienti prenotano visite, ricevono referti digitali e comunicano con voi in modo sicuro? Meno telefonate, più efficienza. Vi interessa una demo? 👨‍⚕️`,
    email: `Oggetto: Meno code, più efficienza — App per il vostro studio medico\n\nGentile Dottore/Dottoressa,\n\nLa gestione di un studio medico richiede tempo e precisione. La nostra piattaforma offre:\n\n✅ Prenotazione visite online con calendario smart\n✅ Cartella paziente digitale (GDPR compliant)\n✅ Telemedicina integrata\n✅ Promemoria automatici per follow-up\n\nGli studi che usano la nostra app riducono le chiamate del 70% e migliorano la soddisfazione dei pazienti.\n\nPosso mostrarle una demo in 10 minuti?`,
    pitch: `"I vostri pazienti meritano un'esperienza moderna. Prenotazioni online, referti digitali e telemedicina — tutto sicuro, conforme al GDPR e personalizzato con la vostra identità."`,
  },
  hotel: {
    dm: `Ciao! 🏨 Il vostro hotel ha un'atmosfera incredibile! Sapevate che con un'app personalizzata gli ospiti possono fare check-in digitale, ordinare room service e prenotare esperienze? Più comfort per loro, più revenue per voi. Demo? ⭐`,
    email: `Oggetto: Esperienza ospiti premium — App per il vostro hotel\n\nGentili,\n\nGli ospiti moderni si aspettano un'esperienza digitale. La nostra piattaforma offre:\n\n✅ Check-in/check-out digitale\n✅ Room service e concierge in-app\n✅ Prenotazione spa, ristorante, escursioni\n✅ Comunicazione diretta con lo staff\n\nGli hotel che usano la nostra app vedono +25% di revenue da servizi ancillari e recensioni migliori.\n\nPosso mostrarvi una demo personalizzata?`,
    pitch: `"I vostri ospiti vogliono un'esperienza seamless. Con la nostra app hanno tutto a portata di mano: check-in, room service, spa — tutto brandizzato con il vostro stile luxury."`,
  },
};

// Fallback template for sectors without specific content
const DEFAULT_TEMPLATES = {
  dm: `Ciao! 🤩 Abbiamo notato la vostra attività e siamo rimasti colpiti! Con un'app personalizzata potete gestire prenotazioni, clienti e pagamenti in modo smart. I vostri clienti vi trovano, prenotano e pagano tutto dal telefono. Vi mostro un esempio reale? 👉`,
  email: `Oggetto: La vostra app personalizzata — Più clienti, meno stress\n\nBuongiorno,\n\nSappiamo quanto è impegnativo gestire un'attività tra chiamate, prenotazioni e amministrazione. La nostra piattaforma vi offre:\n\n✅ Prenotazioni online 24/7\n✅ Gestione clienti e CRM integrato\n✅ Pagamenti digitali e fatturazione\n✅ Marketing automatizzato\n\nLe attività che usano la nostra app vedono in media +40% di prenotazioni e -50% di tempo amministrativo.\n\nPosso mostrarvi una demo gratuita in 10 minuti?`,
  pitch: `"La vostra attività merita un'app che lavori per voi 24/7. Prenotazioni automatiche, gestione clienti smart e marketing integrato — tutto personalizzato con il vostro brand."`,
};

/* ═══════════════════════════════════════════
   SECTOR CARDS
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

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
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

  const [activeChannel, setActiveChannel] = useState<string>("instagram");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showEarnings, setShowEarnings] = useState(false);
  const [showFullPortfolio, setShowFullPortfolio] = useState(false);
  const [detailProject, setDetailProject] = useState<string | null>(null);

  // Persist demoMode
  useEffect(() => { sessionStorage.setItem("partner_demo_mode", demoMode ? "true" : "false"); }, [demoMode]);

  // Sync edit fields
  useEffect(() => {
    if (demoRestaurant) {
      setEditName(demoRestaurant.name);
      setEditColor(demoRestaurant.primary_color || "#C8963E");
    }
  }, [demoRestaurant]);

  // Get dynamic template based on selected project + channel
  const currentTemplates = selectedProject
    ? (SECTOR_TEMPLATES[selectedProject] || DEFAULT_TEMPLATES)
    : DEFAULT_TEMPLATES;
  
  const currentTemplate = activeChannel === "email" ? currentTemplates.email
    : activeChannel === "field" ? currentTemplates.pitch
    : currentTemplates.dm;

  const templateLabel = activeChannel === "email" ? "TEMPLATE EMAIL"
    : activeChannel === "field" ? "PITCH SCRIPT"
    : "TEMPLATE DM";

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

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(currentTemplate);
    toast({ title: "✅ Copiato!", description: `${templateLabel} copiato negli appunti.` });
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

  const selectedProjectName = selectedProject
    ? PORTFOLIO_PROJECTS[selectedProject as keyof typeof PORTFOLIO_PROJECTS]?.name || selectedProject
    : null;

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "#0a0a14" }}>
      
      {/* ═══════ TOP NAV BAR ═══════ */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b safe-top"
        style={{ background: "rgba(10,10,20,0.97)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#a78bfa" }}>
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
          <span className="text-sm font-bold text-white ml-2">Partner Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold uppercase" style={{ background: "rgba(167,139,250,0.2)", color: "#a78bfa" }}>
              {userName.charAt(0)}
            </div>
            <span className="text-xs text-white font-medium max-w-[120px] truncate">{userName}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Esci</span>
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
                  <img src={empireMonkeyMascot} alt="Empire" className="w-12 h-12 object-contain" />
                </motion.div>
                <div>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>Benvenuto,</p>
                  <h1 className="text-xl font-bold text-white">{userName}</h1>
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
                <button onClick={() => setDemoMode(!demoMode)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: demoMode ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${demoMode ? "rgba(245,158,11,0.35)" : "rgba(255,255,255,0.1)"}`
                  }}>
                  {demoMode ? <EyeOff className="w-4 h-4" style={{ color: "#f59e0b" }} /> : <Eye className="w-4 h-4" style={{ color: "#9ca3af" }} />}
                  <span style={{ color: demoMode ? "#f59e0b" : "#d1d5db" }}>{demoMode ? "Modalità Live" : "Modalità Demo"}</span>
                </button>
              </div>
            </div>

            <div className="text-left sm:text-right max-w-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-3"
                style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}>
                <LayoutDashboard className="w-3 h-3" /> Area Partner
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Il tuo catalogo app,<br />
                <span style={{ color: "#a78bfa" }}>pronto da mostrare.</span>
              </h2>
              <p className="text-sm mt-2" style={{ color: "#9ca3af" }}>
                Sfoglia i progetti, seleziona uno stile e mostra le preview direttamente al cliente.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════ DEMO MODE BANNER ═══════ */}
        <AnimatePresence>
          {demoMode && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden" style={{ background: "rgba(245,158,11,0.08)", borderTop: "1px solid rgba(245,158,11,0.2)", borderBottom: "1px solid rgba(245,158,11,0.2)" }}>
              <div className="px-4 py-2.5 flex items-center gap-2 max-w-5xl mx-auto">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#f59e0b" }} />
                <p className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: "#f59e0b" }}>Modalità Presentazione — Dati sensibili nascosti</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                      { icon: DollarSign, value: "€997", label: "Per Vendita", color: "#34d399" },
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
                  <DemoCreditsWallet userId={user?.id} />
                  <button onClick={() => setShowEarnings(false)} className="w-full py-2.5 text-xs text-center transition-colors" style={{ color: "#6b7280" }}>
                    Chiudi sezione guadagni ↑
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        )}

        {/* ═══════ CANALE DI ACQUISIZIONE ═══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#9ca3af" }}>Canale di Acquisizione</h3>
          <div className="grid grid-cols-3 gap-3">
            {ACQUISITION_CHANNELS.map(ch => {
              const isActive = activeChannel === ch.id;
              return (
                <motion.button key={ch.id} onClick={() => setActiveChannel(ch.id)} whileTap={{ scale: 0.97 }}
                  className="p-4 rounded-xl text-left transition-all relative overflow-hidden"
                  style={{
                    background: isActive ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? "rgba(167,139,250,0.35)" : "rgba(255,255,255,0.06)"}`,
                  }}>
                  <ch.icon className="w-5 h-5 mb-3" style={{ color: isActive ? "#a78bfa" : "#6b7280" }} />
                  <p className="text-sm font-semibold" style={{ color: isActive ? "#ffffff" : "#d1d5db" }}>{ch.label}</p>
                  <p className="text-[10px] mt-1 line-clamp-2" style={{ color: "#9ca3af" }}>{ch.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ═══════ SELEZIONA PROGETTO ═══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
          <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#9ca3af" }}>
              Seleziona Progetto {selectedProjectName && <span style={{ color: "#a78bfa" }}>— {selectedProjectName}</span>}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-h-[320px] overflow-y-auto pr-1">
              {SECTOR_CARDS.map(card => {
                const isSelected = selectedProject === card.id;
                return (
                  <motion.button key={card.id} onClick={() => setSelectedProject(isSelected ? null : card.id)} whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                    style={{
                      background: isSelected ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? "rgba(167,139,250,0.35)" : "rgba(255,255,255,0.06)"}`,
                    }}>
                    {card.screens[0] ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                        <img src={card.screens[0]} alt={card.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(167,139,250,0.1)" }}>
                        <Smartphone className="w-5 h-5" style={{ color: "#a78bfa" }} />
                      </div>
                    )}
                    <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: isSelected ? "#ffffff" : "#d1d5db" }}>
                      {card.name.split("&")[0].trim().split(" ")[0]}
                    </span>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#a78bfa" }} />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════ DYNAMIC TEMPLATE (changes with channel + sector) ═══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#9ca3af" }}>
              {templateLabel} {selectedProjectName && <span style={{ color: "#a78bfa" }}>· {selectedProjectName}</span>}
            </p>
          </div>
          <div className="p-5 rounded-2xl space-y-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{templateLabel}</span>
                <span className="text-xs">🇮🇹</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCopyTemplate} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all"
                  style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
                  <Copy className="w-3 h-3" style={{ color: "#a78bfa" }} />
                  <span className="text-white">Copia</span>
                </button>
                <button onClick={() => toast({ title: "✨ Template rigenerato!" })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all"
                  style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
                  <RefreshCw className="w-3 h-3" style={{ color: "#a78bfa" }} />
                  <span className="text-white">Rigenera</span>
                </button>
              </div>
            </div>
            <div className="text-xs leading-relaxed whitespace-pre-line" style={{ color: "#d1d5db" }}>
              {currentTemplate}
            </div>
            {!selectedProject && (
              <p className="text-[10px] text-center py-2 rounded-lg" style={{ background: "rgba(245,158,11,0.08)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.15)" }}>
                💡 Seleziona un progetto sopra per ottenere template personalizzati per settore
              </p>
            )}
          </div>
        </section>

        {/* ═══════ DEMO PERSONALIZZATA — UNIVERSALE ═══════ */}
        {!demoMode && (
          <section className="max-w-5xl mx-auto px-4 sm:px-8 py-4">
            <div className="p-5 rounded-2xl space-y-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selectedProject ? `${PORTFOLIO_PROJECTS[selectedProject as keyof typeof PORTFOLIO_PROJECTS]?.accent || "#a78bfa"}15` : "rgba(167,139,250,0.1)" }}>
                    <Sparkles className="w-5 h-5" style={{ color: selectedProject ? (PORTFOLIO_PROJECTS[selectedProject as keyof typeof PORTFOLIO_PROJECTS]?.accent || "#a78bfa") : "#a78bfa" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Demo Personalizzata</h3>
                    <p className="text-[10px]" style={{ color: "#9ca3af" }}>
                      {selectedProject ? `Settore: ${selectedProjectName}` : "Seleziona un settore sopra"} · Pronta da mostrare
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
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#a78bfa" }}>
                        Personalizza per il cliente
                      </p>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-medium" style={{ color: "#9ca3af" }}>Nome Attività del Cliente</label>
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                          placeholder="Es: Ristorante Da Mario, Salone Bella, NCC Luxury..."
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

              {/* Action buttons — universal for any sector */}
              <div className="grid grid-cols-2 gap-3">
                <a href={selectedProject ? `/demo/${selectedProject}` : "#"}
                  target="_blank" rel="noopener noreferrer"
                  onClick={e => { if (!selectedProject) { e.preventDefault(); toast({ title: "Seleziona un settore", description: "Scegli un progetto dal catalogo sopra per aprire la demo." }); }}}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all text-center group"
                  style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                    <Globe className="w-5 h-5" style={{ color: "#34d399" }} />
                  </div>
                  <span className="text-xs font-bold text-white">Sito Cliente</span>
                  <span className="text-[9px]" style={{ color: "#6b7280" }}>Mostra al cliente come appare</span>
                </a>
                <a href={selectedProject ? `/demo/${selectedProject}/admin` : "#"}
                  target="_blank" rel="noopener noreferrer"
                  onClick={e => { if (!selectedProject) { e.preventDefault(); toast({ title: "Seleziona un settore", description: "Scegli un progetto dal catalogo sopra per aprire l'admin." }); }}}
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
                      { label: "Admin", emoji: "⚙️", href: `/r/${demoRestaurant.slug}?view=admin` },
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
                  ☝️ Seleziona un settore dal catalogo per attivare la demo personalizzata
                </p>
              )}
            </div>
          </section>
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

        {/* ═══════ PORTFOLIO GRID — Click opens detail overlay ═══════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: "#9ca3af" }}>Portfolio Progetti — Clicca per esplorare</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTOR_CARDS.slice(0, showFullPortfolio ? undefined : 6).map((card, i) => (
              <motion.div key={card.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.02]"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                onClick={() => setDetailProject(card.id)}>
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
          
          {SECTOR_CARDS.length > 6 && (
            <div className="text-center mt-6">
              <button onClick={() => setShowFullPortfolio(!showFullPortfolio)} className="px-6 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}>
                {showFullPortfolio ? "Mostra meno" : `Vedi tutti (${SECTOR_CARDS.length})`}
              </button>
            </div>
          )}
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
              Il cliente è interessato?<br />
              <span style={{ color: "#a78bfa" }}>Passiamo all'azione.</span>
            </h2>
            <p className="text-sm" style={{ color: "#9ca3af" }}>Condividi il link del progetto o contattaci per una demo personalizzata.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button onClick={() => navigate("/home?from=partner")} whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: "#7c3aed", color: "#ffffff" }}>
                <Send className="w-4 h-4" /> Mostra al Cliente
              </motion.button>
              <motion.button onClick={() => setShowFullPortfolio(true)} whileTap={{ scale: 0.97 }}
                className="px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}>
                <ExternalLink className="w-4 h-4" /> Vedi Portfolio Completo
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
