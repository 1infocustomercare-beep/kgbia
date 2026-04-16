import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, DollarSign, FolderOpen, User, ChevronRight, Crown, Trophy,
  Sparkles, Zap, TrendingUp, Users, Bot, Package, CheckCircle, Presentation,
  ShieldCheck, Globe, Clock, Headphones, BarChart3, Smartphone, Star,
  MessageCircle, Heart, Lock, Rocket, Award, ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import empireMonkeyMascot from "@/assets/empire-monkey.png";
import PartnerVoiceAgent from "@/components/partner/PartnerVoiceAgent";
import { usePartnerDemoMode } from "@/components/layout/PartnerLayout";
import { SectorPhoneCarousel } from "@/components/partner/SectorPhoneCarousel";

/* Animated counter component */
const AnimatedCounter = ({ value, prefix = "", color }: { value: number; prefix?: string; color: string }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const dur = 1200;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <p className="text-xl font-bold text-foreground" style={{ textShadow: `0 0 20px ${color}30` }}>{prefix}{display.toLocaleString("it-IT")}</p>;
};

export default function PartnerHomePage() {
  const navigate = useNavigate();
  const { user, isTeamLeader } = useAuth();
  const { demoMode } = usePartnerDemoMode();
  const [partnerAvatar, setPartnerAvatar] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [salesCount, setSalesCount] = useState(0);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [teamCount, setTeamCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("profiles").select("avatar_url, full_name").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data?.avatar_url) setPartnerAvatar(data.avatar_url);
      if (data?.full_name) setProfileName(data.full_name);
    });
    supabase.from("partner_sales").select("partner_commission").eq("partner_id", user.id).then(({ data }) => {
      setSalesCount(data?.length || 0);
      setTotalCommissions((data || []).reduce((s: number, r: any) => s + Number(r.partner_commission || 0), 0));
    });
    if (isTeamLeader) {
      supabase.from("partner_teams").select("id").eq("team_leader_id", user.id).then(({ data }) => setTeamCount(data?.length || 0));
    }
  }, [user?.id, isTeamLeader]);

  const userName = profileName || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Partner";

  const QUICK_NAV = [
    { icon: Target, label: "LeadEngine Scout", desc: "Trova, analizza e contatta lead reali con AI", gradient: "from-violet-600/20 to-purple-600/10", iconColor: "#a78bfa", path: "/partner/leads" },
    { icon: DollarSign, label: "Guadagni & Team", desc: "Commissioni, bonus e reclutamento venditori", gradient: "from-emerald-600/20 to-teal-600/10", iconColor: "#34d399", path: "/partner/earnings" },
    { icon: FolderOpen, label: "Portfolio Demo", desc: "Catalogo 25+ settori con preview personalizzate", gradient: "from-blue-600/20 to-indigo-600/10", iconColor: "#818cf8", path: "/partner/portfolio" },
    { icon: User, label: "Il Mio Profilo", desc: "Dati personali, avatar e impostazioni", gradient: "from-amber-600/20 to-orange-600/10", iconColor: "#fbbf24", path: "/partner/profile" },
  ];

  const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } });

  /* ─── Shared glass card style — opaque so DNA bg doesn't bleed through ─── */
  const glassCard = "rounded-2xl backdrop-blur-xl";
  const liveGlass = `${glassCard} bg-[#12122a]/90 border border-white/[0.08] shadow-lg shadow-black/20`;
  const demoGlass = `${glassCard} bg-[#1a1510]/90 border border-amber-500/10 shadow-lg shadow-black/20`;

  return (
    <div className="space-y-5 pb-6">
      {/* ═══ HERO ═══ */}
      <section className="relative px-4 pt-7 pb-3 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: `radial-gradient(circle, ${demoMode ? "#f59e0b" : "#a78bfa"}, transparent 65%)`, filter: "blur(100px)" }} />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: `radial-gradient(circle, ${demoMode ? "#d97706" : "#7c3aed"}, transparent 65%)`, filter: "blur(80px)" }} />

        <div className="relative flex items-center gap-4">
          <motion.div
            className="w-[68px] h-[68px] rounded-[20px] flex items-center justify-center overflow-hidden shrink-0"
            style={{
              background: demoMode
                ? "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.08))"
                : "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(124,58,237,0.08))",
              border: `1.5px solid ${demoMode ? "rgba(245,158,11,0.25)" : "rgba(167,139,250,0.2)"}`,
              boxShadow: demoMode ? "0 8px 32px rgba(245,158,11,0.1)" : "0 8px 32px rgba(167,139,250,0.1)",
            }}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            {partnerAvatar ? (
              <img src={partnerAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <img src={empireMonkeyMascot} alt="Empire" className="w-12 h-12 object-contain" />
            )}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-muted-foreground tracking-wide">
              {demoMode ? "Presentazione per" : "Bentornato,"}
            </p>
            <h1 className="text-xl font-bold text-foreground truncate mt-0.5">
              {demoMode ? "Il Tuo Business" : userName}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              {!demoMode && isTeamLeader && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold"
                  style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.15)" }}>
                  <Crown className="w-3 h-3" /> Team Leader
                </span>
              )}
              {demoMode && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold"
                  style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.15)" }}>
                  <Presentation className="w-3 h-3" /> Presentazione Live
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {demoMode ? (
          /* ═══════════════════════════════════════════
             DEMO MODE — ULTRA PREMIUM LUXURY
             ═══════════════════════════════════════════ */
          <motion.div key="demo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5 pb-8">

            {/* Luxury header banner */}
            <motion.div className="mx-4 py-4 text-center rounded-3xl relative overflow-hidden group cursor-default"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              style={{ background: "linear-gradient(135deg, rgba(212,160,82,0.08), rgba(245,158,11,0.03))", border: "1px solid rgba(212,160,82,0.15)" }}>
              <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(212,160,82,0.06), transparent 70%)" }} />
              <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(212,160,82,0.4), transparent)" }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] relative z-10" style={{ color: "#d4a052" }}>
                ✦ Il Sistema Operativo del Business ✦
              </p>
              <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(212,160,82,0.4), transparent)" }} />
            </motion.div>

            <section className="px-4 space-y-5">

              {/* ─── 1. VALUE PROP — Hero card ─── */}
              <motion.div {...fadeUp(0)} className="rounded-3xl p-7 text-center relative overflow-hidden group cursor-default"
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  background: "linear-gradient(180deg, rgba(212,160,82,0.06) 0%, rgba(0,0,0,0.02) 100%)",
                  border: "1px solid rgba(212,160,82,0.12)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)",
                }}>
                <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle at 50% 30%, rgba(212,160,82,0.08), transparent 60%)" }} />
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-[0.03] pointer-events-none"
                  style={{ border: "1px solid rgba(212,160,82,0.3)" }} />
                <div className="relative z-10">
                  <motion.div className="w-14 h-14 mx-auto mb-4 rounded-3xl flex items-center justify-center"
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    style={{ background: "linear-gradient(135deg, rgba(212,160,82,0.18), rgba(245,158,11,0.08))", border: "1px solid rgba(212,160,82,0.25)", boxShadow: "0 8px 24px rgba(212,160,82,0.1)" }}>
                    <Rocket className="w-7 h-7" style={{ color: "#d4a052" }} />
                  </motion.div>
                  <h2 className="text-lg font-bold text-foreground mb-2 tracking-tight">Un Unico Sistema.<br/>Tutto Automatizzato.</h2>
                  <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[300px] mx-auto">
                    App personalizzata, sito web, agenti IA, CRM, marketing e analytics — tutto integrato e chiavi in mano per la tua attività.
                  </p>
                </div>
              </motion.div>

              {/* ─── 2. FEATURES GRID — Interactive hover ─── */}
              <motion.div {...fadeUp(0.05)}>
                <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-3.5 flex items-center gap-2" style={{ color: "#d4a052" }}>
                  <span className="w-6 h-[1px] inline-block" style={{ background: "linear-gradient(90deg, rgba(212,160,82,0.4), transparent)" }} />
                  Tutto Incluso
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Smartphone, title: "App Brand", desc: "Il tuo logo, i tuoi colori" },
                    { icon: Globe, title: "Sito Web", desc: "SEO ottimizzato" },
                    { icon: Bot, title: "Agenti IA", desc: "Lavorano 24/7" },
                    { icon: MessageCircle, title: "WhatsApp", desc: "Chat e CRM" },
                    { icon: BarChart3, title: "Analytics", desc: "Insight predittivi" },
                    { icon: ShieldCheck, title: "Review Shield™", desc: "Protezione totale" },
                  ].map((item, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
                      whileHover={{ scale: 1.06, y: -3 }}
                      className="rounded-3xl p-4 text-center cursor-default group relative overflow-hidden"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(212,160,82,0.08)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      }}>
                      <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: "radial-gradient(circle at 50% 40%, rgba(212,160,82,0.08), transparent 70%)" }} />
                      <div className="relative z-10">
                        <motion.div className="w-10 h-10 mx-auto mb-2.5 rounded-2xl flex items-center justify-center"
                          whileHover={{ rotate: 8 }}
                          style={{ background: "linear-gradient(135deg, rgba(212,160,82,0.12), rgba(245,158,11,0.05))", border: "1px solid rgba(212,160,82,0.15)", boxShadow: "0 4px 12px rgba(212,160,82,0.06)" }}>
                          <item.icon className="w-4.5 h-4.5" style={{ color: "#d4a052" }} />
                        </motion.div>
                        <p className="text-[10px] font-bold text-foreground leading-tight">{item.title}</p>
                        <p className="text-[8px] mt-0.5 text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ─── 3. SECTORS — Auto-carousel with phone mockups ─── */}
              <motion.div {...fadeUp(0.1)} className="rounded-3xl p-5 relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(212,160,82,0.08)" }}>
                <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-3 flex items-center gap-2" style={{ color: "#d4a052" }}>
                  <span className="w-6 h-[1px] inline-block" style={{ background: "linear-gradient(90deg, rgba(212,160,82,0.4), transparent)" }} />
                  25+ Settori Pronti
                </h3>
                <SectorPhoneCarousel />
                <p className="text-[9px] text-muted-foreground/60 mt-3 text-center italic tracking-wider">…e qualsiasi altro con personalizzazione completa su misura</p>
              </motion.div>

              {/* ─── 4. PACKAGES — Premium cards ─── */}
              <motion.div {...fadeUp(0.15)} className="space-y-3.5">
                <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] flex items-center gap-2" style={{ color: "#d4a052" }}>
                  <span className="w-6 h-[1px] inline-block" style={{ background: "linear-gradient(90deg, rgba(212,160,82,0.4), transparent)" }} />
                  Pacchetti & Investimento
                </h3>
                {[
                  { name: "Digital Start", price: "1.997", monthly: "49", accent: "#a78bfa", features: ["App personalizzata", "Catalogo + QR Code", "Dashboard Analytics", "Notifiche Push"], popular: false },
                  { name: "Growth AI", price: "4.997", monthly: "29", accent: "#d4a052", badge: "⭐ Più Scelto", features: ["Tutto di Start +", "AI Engine completo", "2 Agenti IA", "Review Shield™", "WhatsApp API"], popular: true },
                  { name: "Empire Domination", price: "7.997", monthly: "0", accent: "#f59e0b", badge: "👑 Tutto Incluso", features: ["TUTTO illimitato", "0% commissioni", "5 Agenti IA", "Manager VIP", "Priorità sviluppi"], popular: false },
                ].map((pkg, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="rounded-3xl p-5 relative overflow-hidden cursor-default group"
                    style={{
                      background: pkg.popular
                        ? "linear-gradient(135deg, rgba(212,160,82,0.06), rgba(245,158,11,0.02))"
                        : "rgba(255,255,255,0.02)",
                      border: `1px solid ${pkg.popular ? "rgba(212,160,82,0.2)" : "rgba(255,255,255,0.06)"}`,
                      boxShadow: pkg.popular ? "0 8px 32px rgba(212,160,82,0.06), inset 0 1px 0 rgba(255,255,255,0.03)" : "0 4px 16px rgba(0,0,0,0.08)",
                    }}>
                    {pkg.popular && (
                      <>
                        <motion.div animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }}
                          className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(212,160,82,0.5), transparent)" }} />
                        <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{ background: "radial-gradient(circle at 50% 50%, rgba(212,160,82,0.05), transparent 60%)" }} />
                      </>
                    )}
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="shrink-0 text-center min-w-[72px]">
                        <p className="text-xl font-bold text-foreground tracking-tight">€{pkg.price}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">{pkg.monthly === "0" ? "poi €0/mese" : `poi €${pkg.monthly}/mese`}</p>
                        <p className="text-[8px] text-muted-foreground/50 mt-0.5">rate 3× / 6×</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-xs font-bold text-foreground">{pkg.name}</p>
                          {pkg.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold"
                              style={{ background: `${pkg.accent}12`, color: pkg.accent, border: `1px solid ${pkg.accent}18` }}>{pkg.badge}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                          {pkg.features.map((f, j) => (
                            <span key={j} className="text-[9px] flex items-center gap-1 text-muted-foreground">
                              <CheckCircle className="w-2.5 h-2.5 shrink-0" style={{ color: pkg.accent }} /> {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* ─── 5. AI AGENTS — Floating cards ─── */}
              <motion.div {...fadeUp(0.2)} className="rounded-3xl p-6 relative overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(212,160,82,0.04) 0%, transparent 100%)",
                  border: "1px solid rgba(212,160,82,0.08)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}>
                <motion.div animate={{ rotate: [0, -360] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-20 -left-20 w-44 h-44 rounded-full opacity-[0.02] pointer-events-none"
                  style={{ border: "1px solid rgba(212,160,82,0.3)" }} />
                <div className="flex items-center gap-2.5 mb-4 relative z-10">
                  <motion.div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    style={{ background: "linear-gradient(135deg, rgba(212,160,82,0.15), rgba(245,158,11,0.06))", border: "1px solid rgba(212,160,82,0.2)", boxShadow: "0 4px 16px rgba(212,160,82,0.08)" }}>
                    <Bot className="w-5 h-5" style={{ color: "#d4a052" }} />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Il Tuo Team Digitale</h3>
                    <p className="text-[9px] text-muted-foreground">Agenti IA che lavorano per te 24/7</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 relative z-10">
                  {[
                    { emoji: "💬", name: "Assistente Clienti", desc: "Risponde a tutto" },
                    { emoji: "⭐", name: "Review Shield™", desc: "Protegge le recensioni" },
                    { emoji: "📣", name: "Marketing AI", desc: "Social & promozioni" },
                    { emoji: "📋", name: "Gestione Ordini", desc: "Ordini e prenotazioni" },
                    { emoji: "🧠", name: "Business Advisor", desc: "Analisi e strategie" },
                    { emoji: "📞", name: "Voice Agent", desc: "Voce IA realistica" },
                  ].map((agent, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.04 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="rounded-2xl p-3 flex items-center gap-2.5 cursor-default group"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(212,160,82,0.06)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }}>
                      <motion.span className="text-lg shrink-0" whileHover={{ scale: 1.3, rotate: 10 }}>{agent.emoji}</motion.span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-foreground truncate">{agent.name}</p>
                        <p className="text-[8px] text-muted-foreground truncate">{agent.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ─── 6. COMPARISON — Animated table ─── */}
              <motion.div {...fadeUp(0.25)} className="rounded-3xl p-5 relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(212,160,82,0.08)" }}>
                <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] mb-3.5 flex items-center gap-2" style={{ color: "#d4a052" }}>
                  <span className="w-6 h-[1px] inline-block" style={{ background: "linear-gradient(90deg, rgba(212,160,82,0.4), transparent)" }} />
                  Noi vs Il Resto del Mondo
                </h3>
                <div className="space-y-0">
                  {[
                    { label: "Commissioni", them: "fino a 30%", us: "0 – 2%" },
                    { label: "Aggiornamenti", them: "A pagamento", us: "Inclusi sempre" },
                    { label: "Supporto", them: "Email lenta", us: "WhatsApp diretto" },
                    { label: "Personalizzazione", them: "Limitata", us: "100% su misura" },
                    { label: "Proprietà dati", them: "Della piattaforma", us: "Tuoi per sempre" },
                  ].map((row, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                      whileHover={{ x: 4, background: "rgba(212,160,82,0.02)" }}
                      className="flex items-center gap-2.5 py-2.5 border-b border-white/[0.03] last:border-0 rounded-xl px-2 cursor-default transition-all">
                      <p className="flex-1 text-[10px] text-muted-foreground font-medium truncate">{row.label}</p>
                      <span className="text-[8px] px-2.5 py-1 rounded-full font-medium"
                        style={{ background: "rgba(239,68,68,0.06)", color: "#f87171", border: "1px solid rgba(239,68,68,0.08)" }}>{row.them}</span>
                      <span className="text-[8px] px-2.5 py-1 rounded-full font-bold"
                        style={{ background: "rgba(52,211,153,0.06)", color: "#34d399", border: "1px solid rgba(52,211,153,0.08)" }}>{row.us}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ─── 7. FAQ — Elegant accordion ─── */}
              <motion.div {...fadeUp(0.3)} className="space-y-2.5">
                <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] flex items-center gap-2" style={{ color: "#d4a052" }}>
                  <span className="w-6 h-[1px] inline-block" style={{ background: "linear-gradient(90deg, rgba(212,160,82,0.4), transparent)" }} />
                  Domande Frequenti
                </h3>
                {[
                  { q: "È complicato da usare?", a: "No. Intuitivo come Instagram. Il nostro team ti segue passo passo nell'avvio e nella gestione." },
                  { q: "Funziona per il mio settore?", a: "Assolutamente sì. Si adatta a 25+ settori con moduli e funzionalità specifiche per ogni business." },
                  { q: "E se non funziona?", a: "90 giorni di prova gratuita. Se non sei soddisfatto, non paghi nulla. Zero rischi." },
                  { q: "Quanto tempo per partire?", a: "48 ore — il nostro team costruisce tutto su misura: app, sito web e configurazione completa." },
                  { q: "Posso rateizzare?", a: "Sì, rate comode in 3 o 6 mesi. Tasso zero sulle 3 rate." },
                ].map((faq, i) => (
                  <details key={i} className="group rounded-2xl overflow-hidden cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(212,160,82,0.06)" }}>
                    <summary className="flex items-center justify-between p-4 text-[11px] font-semibold text-foreground list-none select-none">
                      {faq.q}
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 transition-transform duration-300 group-open:rotate-90 shrink-0" />
                    </summary>
                    <p className="px-4 pb-4 text-[10px] text-muted-foreground leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </motion.div>

              {/* ─── 8. SOCIAL PROOF — Glowing card ─── */}
              <motion.div {...fadeUp(0.35)} className="rounded-3xl p-6 text-center relative overflow-hidden group cursor-default"
                whileHover={{ scale: 1.01 }}
                style={{
                  background: "linear-gradient(180deg, rgba(212,160,82,0.04) 0%, transparent 100%)",
                  border: "1px solid rgba(212,160,82,0.1)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}>
                <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: "radial-gradient(circle at 50% 50%, rgba(212,160,82,0.06), transparent 60%)" }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <motion.div key={s} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + s * 0.08 }}>
                        <Star className="w-4 h-4 fill-amber-400/90" style={{ color: "#d4a052" }} />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-foreground mb-2">Oltre 500 attività già attive</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed max-w-[280px] mx-auto italic">
                    "Gli ordini online sono aumentati del 40% e risparmiamo 15 ore a settimana. Non torneremmo mai indietro."
                  </p>
                  <p className="text-[9px] font-semibold mt-2.5" style={{ color: "#d4a052" }}>— Marco R., Ristoratore, Roma</p>
                </div>
              </motion.div>

              {/* ─── 9. GUARANTEE — Trust badge ─── */}
              <motion.div {...fadeUp(0.38)}
                whileHover={{ scale: 1.02, y: -2 }}
                className="rounded-3xl p-5 flex items-center gap-4 cursor-default"
                style={{
                  background: "rgba(52,211,153,0.02)",
                  border: "1px solid rgba(52,211,153,0.1)",
                  boxShadow: "0 4px 20px rgba(52,211,153,0.04)",
                }}>
                <motion.div className="w-14 h-14 rounded-3xl flex items-center justify-center shrink-0"
                  whileHover={{ rotate: 10 }}
                  style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.1)", boxShadow: "0 4px 16px rgba(52,211,153,0.06)" }}>
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                </motion.div>
                <div>
                  <p className="text-sm font-bold text-foreground">90 Giorni di Prova Gratuita</p>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">Nessun rischio. Provi tutto il sistema. Non paghi nulla se non sei soddisfatto.</p>
                </div>
              </motion.div>

              {/* ─── 10. CTA — Premium button ─── */}
              <div className="text-center py-4 space-y-3">
                <motion.button onClick={() => navigate("/partner/portfolio")}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-3xl font-semibold text-sm inline-flex items-center justify-center gap-2.5 text-white relative overflow-hidden group"
                  style={{
                    background: "linear-gradient(135deg, #d4a052, #b8862e)",
                    boxShadow: "0 8px 32px rgba(212,160,82,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}>
                  <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08), transparent)" }} />
                  <FolderOpen className="w-4.5 h-4.5 relative z-10" />
                  <span className="relative z-10">Vedi le Demo per il Tuo Settore</span>
                  <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="relative z-10">
                    <ArrowRight className="w-4.5 h-4.5" />
                  </motion.div>
                </motion.button>
                <p className="text-[10px] text-muted-foreground/60 tracking-wide">
                  Mostra al cliente le preview interattive personalizzate
                </p>
              </div>

            </section>
          </motion.div>
        ) : (
          /* ═══════════════════════════════════════════
             LIVE MODE — TECH VIOLA DASHBOARD
             ═══════════════════════════════════════════ */
          <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">

            {/* ═══ LIVE NEURAL STATUS BAR ═══ */}
            <motion.div className="mx-4 py-2.5 px-4 rounded-2xl flex items-center gap-3 relative overflow-hidden"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.04), rgba(124,58,237,0.02))", border: "1px solid rgba(167,139,250,0.1)" }}>
              <motion.div className="absolute inset-0" animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ background: "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.03) 25%, transparent 50%)", backgroundSize: "200% 100%" }} />
              <motion.div className="w-2 h-2 rounded-full shrink-0" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }} style={{ background: "#34d399", boxShadow: "0 0 8px rgba(52,211,153,0.5)" }} />
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-foreground/30">
                EMPIRE PARTNER — SISTEMA ATTIVO
              </span>
              <motion.div className="ml-auto flex items-center gap-1.5" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>
                {[0,1,2].map(i => <div key={i} className="w-1 h-1 rounded-full" style={{ background: "#a78bfa", opacity: 0.6 + i * 0.15 }} />)}
              </motion.div>
            </motion.div>
            
            {/* ═══ ANIMATED STATS HUB ═══ */}
            <section className="px-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Trophy, value: salesCount, label: "Vendite", sub: "totali", gradient: "from-violet-600/20 to-purple-600/5", color: "#a78bfa", glow: "rgba(167,139,250,0.12)" },
                  { icon: TrendingUp, value: totalCommissions, label: "Commissioni", sub: "€ netti", gradient: "from-emerald-600/20 to-teal-600/5", color: "#34d399", glow: "rgba(52,211,153,0.12)", isCurrency: true },
                  { icon: isTeamLeader ? Users : Target, value: isTeamLeader ? teamCount : salesCount, label: isTeamLeader ? "Team" : "Obiettivo", sub: isTeamLeader ? "membri" : `${salesCount}/4 → Leader`, gradient: "from-blue-600/20 to-indigo-600/5", color: "#818cf8", glow: "rgba(129,140,248,0.12)" },
                ].map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.12, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className={`${liveGlass} p-4 text-center bg-gradient-to-br ${s.gradient} relative overflow-hidden cursor-default group`}>
                    {/* Animated top accent */}
                    <motion.div className="absolute top-0 left-0 right-0 h-[2px]" animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                      style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
                    {/* Hover glow */}
                    <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle at 50% 40%, ${s.glow}, transparent 70%)` }} />
                    {/* Orbital ring */}
                    <motion.div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-[0.04] pointer-events-none"
                      animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      style={{ border: `1px solid ${s.color}` }} />
                    <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }} className="relative z-10">
                      <s.icon className="w-5 h-5 mb-2 mx-auto" style={{ color: s.color, filter: `drop-shadow(0 0 6px ${s.color}40)` }} />
                    </motion.div>
                    <AnimatedCounter value={s.isCurrency ? s.value : s.value} prefix={s.isCurrency ? "€" : ""} color={s.color} />
                    <p className="text-[10px] font-semibold text-foreground/70 mt-0.5">{s.label}</p>
                    <p className="text-[8px] text-muted-foreground">{s.sub}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ═══ PERFORMANCE PULSE — Motivation Card ═══ */}
            <section className="px-4">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className={`${liveGlass} p-4 relative overflow-hidden`}
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(167,139,250,0.02))" }}>
                <motion.div className="absolute top-0 left-0 right-0 h-[1px]" animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)" }} />
                <div className="flex items-center gap-3">
                  <motion.div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    animate={{ boxShadow: ["0 0 0px rgba(167,139,250,0.2)", "0 0 20px rgba(167,139,250,0.3)", "0 0 0px rgba(167,139,250,0.2)"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.15)" }}>
                    <Sparkles className="w-5 h-5" style={{ color: "#a78bfa" }} />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: "#a78bfa" }}>Performance Insight</p>
                    <p className="text-[11px] text-foreground/80 leading-relaxed mt-0.5">
                      {salesCount === 0 ? "La tua prima vendita è a un passo. Usa LeadEngine Scout per trovare il tuo primo cliente oggi!" :
                       salesCount < 3 ? `Ottimo inizio! ${3 - salesCount} vendite al bonus €500/mese. Continua così! 🚀` :
                       salesCount < 5 ? `Performance solida! ${5 - salesCount} vendite al livello Elite con bonus €1.500 🔥` :
                       isTeamLeader ? `Leader attivo con ${teamCount} membri. Ogni vendita del team = €50 per te 👑` :
                       "Stai dominando! Recluta venditori per sbloccare i guadagni passivi 💎"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* ═══ QUICK NAV — Interactive Cards ═══ */}
            <section className="px-4 space-y-3">
              <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60 px-1 flex items-center gap-2">
                <span className="w-5 h-[1px] inline-block" style={{ background: "linear-gradient(90deg, rgba(167,139,250,0.4), transparent)" }} />
                Strumenti Operativi
              </h3>
              {QUICK_NAV.map((item, i) => (
                <motion.div key={item.path}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.1, type: "spring", stiffness: 150 }}
                  whileHover={{ scale: 1.02, x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                  className={`${liveGlass} flex items-center gap-4 p-4 cursor-pointer group transition-all bg-gradient-to-r ${item.gradient} relative overflow-hidden`}>
                  {/* Hover shimmer */}
                  <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${item.iconColor}08, transparent 60%)` }} />
                  {/* Left accent line */}
                  <motion.div className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: item.iconColor }} />
                  <motion.div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 relative"
                    whileHover={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.5 }}
                    style={{ background: `${item.iconColor}12`, border: `1px solid ${item.iconColor}18`, boxShadow: `0 4px 16px ${item.iconColor}10` }}>
                    <item.icon className="w-5 h-5" style={{ color: item.iconColor }} />
                  </motion.div>
                  <div className="flex-1 min-w-0 relative z-10">
                    <h4 className="text-sm font-bold text-foreground">{item.label}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <ChevronRight className="w-5 h-5 shrink-0 text-muted-foreground/40 group-hover:text-foreground/60 transition-colors" />
                  </motion.div>
                </motion.div>
              ))}
            </section>

            {/* ═══ DAILY TARGET TRACKER ═══ */}
            <section className="px-4">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className={`${liveGlass} p-5 relative overflow-hidden`}
                style={{ background: "linear-gradient(180deg, rgba(167,139,250,0.05) 0%, rgba(124,58,237,0.01) 100%)" }}>
                <motion.div className="absolute inset-0"
                  animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear", repeatType: "mirror" }}
                  style={{ background: "radial-gradient(circle at 20% 30%, rgba(167,139,250,0.04), transparent 50%)", backgroundSize: "200% 200%" }} />
                {/* Decorative orbital */}
                <motion.div className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full opacity-[0.03] pointer-events-none"
                  animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  style={{ border: "1px dashed rgba(167,139,250,0.5)" }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                      <Target className="w-4 h-4" style={{ color: "#a78bfa" }} />
                    </motion.div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em]" style={{ color: "#a78bfa" }}>Obiettivo Mensile</span>
                  </div>
                  <div className="flex items-end gap-4 mb-3">
                    <div>
                      <p className="text-3xl font-black text-foreground">{salesCount < 5 ? 5 - salesCount : salesCount < 10 ? 10 - salesCount : "∞"}</p>
                      <p className="text-[10px] text-muted-foreground">vendite al prossimo livello</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(167,139,250,0.08)" }}>
                        <motion.div className="h-full rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: `${Math.min((salesCount / (salesCount < 5 ? 5 : 10)) * 100, 100)}%` }}
                          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                          style={{ background: "linear-gradient(90deg, #a78bfa, #7c3aed)", boxShadow: "0 0 12px rgba(167,139,250,0.4)" }} />
                      </div>
                      <p className="text-[8px] text-right text-muted-foreground mt-1">{salesCount}/{salesCount < 5 ? 5 : 10}</p>
                    </div>
                  </div>
                  <motion.button onClick={() => navigate("/partner/leads")}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-2xl font-semibold text-xs inline-flex items-center justify-center gap-2 text-white relative overflow-hidden group"
                    style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", boxShadow: "0 6px 24px rgba(167,139,250,0.3)" }}>
                    <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
                    <Zap className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Trova Nuovi Clienti con AI</span>
                    <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="relative z-10">
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            </section>

            {/* ═══ QUICK ACTIONS — Team CTA ═══ */}
            <section className="px-4 pb-8 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <motion.div onClick={() => navigate("/partner/earnings")}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
                  className={`${liveGlass} p-4 cursor-pointer relative overflow-hidden group`}
                  style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.06), rgba(16,185,129,0.02))" }}>
                  <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "radial-gradient(circle at 50% 40%, rgba(52,211,153,0.08), transparent 70%)" }} />
                  <DollarSign className="w-5 h-5 mb-2" style={{ color: "#34d399" }} />
                  <p className="text-xs font-bold text-foreground">Guadagni</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Dettaglio commissioni</p>
                </motion.div>
                <motion.div onClick={() => navigate("/partner/portfolio")}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.75 }}
                  whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
                  className={`${liveGlass} p-4 cursor-pointer relative overflow-hidden group`}
                  style={{ background: "linear-gradient(135deg, rgba(129,140,248,0.06), rgba(99,102,241,0.02))" }}>
                  <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "radial-gradient(circle at 50% 40%, rgba(129,140,248,0.08), transparent 70%)" }} />
                  <FolderOpen className="w-5 h-5 mb-2" style={{ color: "#818cf8" }} />
                  <p className="text-xs font-bold text-foreground">Portfolio</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">25+ settori demo</p>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <PartnerVoiceAgent activeTab="dashboard" demoMode={demoMode} />
    </div>
  );
}