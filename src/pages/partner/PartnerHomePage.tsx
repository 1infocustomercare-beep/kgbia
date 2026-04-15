import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, DollarSign, FolderOpen, User, ChevronRight, Crown, Trophy,
  Sparkles, Zap, TrendingUp, Users, Bot, Package, CheckCircle, Presentation,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import empireMonkeyMascot from "@/assets/empire-monkey.png";
import PartnerVoiceAgent from "@/components/partner/PartnerVoiceAgent";
import { usePartnerDemoMode } from "@/components/layout/PartnerLayout";

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
    { icon: Target, label: "LeadEngine Scout", desc: "Trova, analizza e contatta lead reali con AI", color: "#14b8a6", path: "/partner/leads" },
    { icon: DollarSign, label: "Guadagni & Team", desc: "Commissioni, bonus e reclutamento venditori", color: "#10b981", path: "/partner/earnings" },
    { icon: FolderOpen, label: "Portfolio Demo", desc: "Catalogo 25+ settori con preview personalizzate", color: "#a78bfa", path: "/partner/portfolio" },
    { icon: User, label: "Il Mio Profilo", desc: "Dati personali, avatar e impostazioni", color: "#f59e0b", path: "/partner/profile" },
  ];

  return (
    <div className="space-y-6">
      {/* ═══ HERO ═══ */}
      <section className="relative px-4 pt-8 pb-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 65%)", filter: "blur(120px)" }} />
        <div className="relative flex items-center gap-4">
          <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 bg-primary/10 border border-primary/20"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            {partnerAvatar ? (
              <img src={partnerAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <img src={empireMonkeyMascot} alt="Empire" className="w-12 h-12 object-contain" />
            )}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{demoMode ? "Presentazione per" : "Benvenuto,"}</p>
            <h1 className="text-xl font-bold text-foreground truncate">
              {demoMode ? "Il Tuo Business" : userName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {!demoMode && isTeamLeader && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-500">
                  <Crown className="w-3 h-3" /> Team Leader
                </span>
              )}
              {demoMode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-500">
                  <Presentation className="w-3 h-3" /> Modalità Presentazione
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {demoMode ? (
          /* ═══════════════════════════════════════════
             DEMO MODE — SALES PRESENTATION CONTENT
             ═══════════════════════════════════════════ */
          <motion.div key="demo-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            
            {/* Banner */}
            <div className="py-2 text-center bg-amber-500/5 border-y border-amber-500/15">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                <Presentation className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                Scopri cosa possiamo creare per te
              </p>
            </div>

            {/* Key selling points */}
            <section className="px-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: "📱", title: "App White Label", desc: "Personalizzata con il tuo brand" },
                  { emoji: "🤖", title: "Agenti IA", desc: "Automatizzano il lavoro 24/7" },
                  { emoji: "📊", title: "Analytics", desc: "Dati e previsioni intelligenti" },
                  { emoji: "💬", title: "WhatsApp & CRM", desc: "Contatti e fidelizzazione" },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="p-3.5 rounded-xl text-center bg-card border border-border">
                    <span className="text-2xl block mb-1.5">{item.emoji}</span>
                    <p className="text-xs font-bold text-foreground">{item.title}</p>
                    <p className="text-[9px] mt-0.5 text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Packages preview */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500">
                  <Package className="w-3 h-3 inline mr-1 -mt-0.5" /> Pacchetti Disponibili
                </h3>
                {[
                  { name: "Digital Start", price: "1.997", monthly: "49", accent: "hsl(var(--primary))", features: ["App completa", "Menu/Catalogo QR", "Dashboard Analytics"] },
                  { name: "Growth AI", price: "4.997", monthly: "29", accent: "hsl(var(--accent))", badge: "Consigliato", features: ["Tutto di Start +", "AI Engine completo", "2 Agenti IA inclusi", "Review Shield™"] },
                  { name: "Empire Domination", price: "7.997", monthly: "0", accent: "#f59e0b", badge: "Tutto Incluso", features: ["TUTTO incluso", "0% commissioni", "5 Agenti IA", "Account Manager VIP"] },
                ].map((pkg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                    className="p-4 rounded-xl flex items-center gap-4 bg-card border border-border">
                    <div className="shrink-0 text-center">
                      <p className="text-xl font-bold text-foreground">€{pkg.price}</p>
                      <p className="text-[9px] text-muted-foreground">
                        {pkg.monthly === "0" ? "€0/mese" : `poi €${pkg.monthly}/mese`}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-bold text-foreground">{pkg.name}</p>
                        {pkg.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: `${pkg.accent}20`, color: pkg.accent }}>{pkg.badge}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        {pkg.features.map((f, j) => (
                          <span key={j} className="text-[9px] flex items-center gap-1 text-muted-foreground">
                            <CheckCircle className="w-2.5 h-2.5" style={{ color: pkg.accent }} /> {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Agents */}
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/15">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Agenti IA Personalizzati</h3>
                </div>
                <p className="text-xs mb-3 text-muted-foreground">
                  Ogni agente lavora 24/7 per automatizzare la tua attività: risposte ai clienti, gestione ordini, marketing, recensioni e molto altro.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "Assistente Clienti", emoji: "💬" },
                    { name: "Review Shield", emoji: "⭐" },
                    { name: "Marketing AI", emoji: "📣" },
                  ].map((agent, i) => (
                    <div key={i} className="p-2.5 rounded-lg text-center bg-card border border-border">
                      <span className="text-lg block">{agent.emoji}</span>
                      <p className="text-[9px] font-semibold text-foreground mt-1">{agent.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Portfolio */}
              <div className="text-center py-3">
                <motion.button onClick={() => navigate("/partner/portfolio")} whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 bg-amber-500 text-white">
                  <FolderOpen className="w-4 h-4" /> Vedi Demo Per Settore
                </motion.button>
                <p className="text-[10px] text-muted-foreground mt-2">👆 Mostra al cliente le preview per il suo settore</p>
              </div>
            </section>
          </motion.div>
        ) : (
          /* ═══════════════════════════════════════════
             LIVE MODE — INTERNAL PARTNER TOOLS
             ═══════════════════════════════════════════ */
          <motion.div key="live-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            
            {/* Quick Stats */}
            <section className="px-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Trophy, value: salesCount, label: "Vendite", color: "text-primary" },
                  { icon: TrendingUp, value: `€${totalCommissions.toLocaleString()}`, label: "Commissioni", color: "text-accent" },
                  { icon: isTeamLeader ? Users : Target, value: isTeamLeader ? teamCount : `${salesCount}/4`, label: isTeamLeader ? "Team" : "a Leader", color: "text-blue-400" },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="p-3.5 rounded-xl text-center bg-card border border-border">
                    <s.icon className={`w-4 h-4 mb-1 mx-auto ${s.color}`} />
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Quick Nav */}
            <section className="px-4 space-y-3">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Strumenti</h3>
              {QUICK_NAV.map((item, i) => (
                <motion.div key={item.path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer group transition-all active:scale-[0.98] bg-card border border-border hover:border-primary/30">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.color}15` }}>
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground">{item.label}</h4>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1 text-muted-foreground" />
                </motion.div>
              ))}
            </section>

            {/* CTA */}
            <section className="px-4 pb-8">
              <div className="relative p-6 rounded-2xl overflow-hidden text-center bg-primary/5 border border-primary/15">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Trova i tuoi prossimi clienti</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">LeadEngine Scout trova, analizza e crea messaggi personalizzati per ogni canale.</p>
                <motion.button onClick={() => navigate("/partner/leads")} whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 bg-accent text-accent-foreground">
                  <Zap className="w-4 h-4" /> Inizia Ora
                </motion.button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <PartnerVoiceAgent activeTab="dashboard" demoMode={demoMode} />
    </div>
  );
}
