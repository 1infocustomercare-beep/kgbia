import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target, DollarSign, FolderOpen, User, ChevronRight, Crown, Trophy,
  Sparkles, Zap, TrendingUp, Users,
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
            <p className="text-xs text-muted-foreground">Benvenuto,</p>
            <h1 className="text-xl font-bold text-foreground truncate">{userName}</h1>
            <div className="flex items-center gap-2 mt-1">
              {isTeamLeader && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-500">
                  <Crown className="w-3 h-3" /> Team Leader
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QUICK STATS ═══ */}
      {!demoMode && (
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
      )}

      {/* ═══ QUICK NAV CARDS ═══ */}
      <section className="px-4 space-y-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Strumenti</h3>
        {QUICK_NAV.map((item, i) => (
          <motion.div key={item.path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer group transition-all active:scale-[0.98] bg-card border border-border hover:border-primary/30">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${item.color}15` }}>
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

      {/* ═══ CTA ═══ */}
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

      <PartnerVoiceAgent activeTab="dashboard" demoMode={demoMode} />
    </div>
  );
}
