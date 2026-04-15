import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, Trophy, Users, Target, Sparkles, Crown, Copy, CheckCircle,
  UserPlus, TrendingUp, Flame, Star, Zap, ChevronDown, ChevronUp,
  Award, ArrowUpRight, Clock, Calendar, Shield, Rocket, Gift, Lock,
  ArrowRight, Info, Gem, BadgeCheck, Heart,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BonusProgressRing from "@/components/partner/BonusProgressRing";
import { toast } from "@/hooks/use-toast";

/* ─── Types ─── */
interface SaleRecord {
  id: string; partner_id: string; sale_amount: number; partner_commission: number;
  team_leader_id: string | null; team_leader_override: number; bonus_amount: number;
  bonus_type: string | null; sale_month: string; created_at: string;
}
interface BonusRecord {
  id: string; partner_id: string; bonus_month: string; sales_count: number;
  bonus_amount: number; bonus_tier: string; paid: boolean;
}
interface TeamMemberRow {
  id: string; partner_id: string; team_leader_id: string; created_at: string;
  profiles: { user_id: string; full_name: string | null; email: string | null } | null;
}

/* ─── Constants ─── */
const COMMISSION_PER_SALE = 997;
const OVERRIDE_PER_ELIGIBLE = 50;
const OVERRIDE_THRESHOLD = 4;
const BONUS_TIERS = [
  { sales: 3, amount: 500, tier: "pro", label: "Pro", color: "#a78bfa" },
  { sales: 5, amount: 1500, tier: "elite", label: "Elite", color: "#f59e0b" },
];
const TEAM_LEADER_REQ_SALES = 4;
const TEAM_LEADER_REQ_RECRUITS = 2;

const RANK_LEVELS = [
  { min: 0, title: "New Partner", color: "#6b7280", icon: Target, desc: "Inizia il tuo percorso" },
  { min: 1, title: "Active Seller", color: "#38bdf8", icon: Star, desc: "Prima vendita completata" },
  { min: 3, title: "Pro Seller", color: "#34d399", icon: Zap, desc: "3+ vendite, Bonus €500/mese" },
  { min: 5, title: "Elite Seller", color: "#a78bfa", icon: Flame, desc: "5+ vendite, Bonus €1.500/mese" },
  { min: 0, title: "Team Leader", color: "#f59e0b", icon: Crown, desc: "Guadagni passivi dal team", isLeader: true },
  { min: 10, title: "Diamond Leader", color: "#67e8f9", icon: Gem, desc: "10+ vendite + Team Leader", isLeader: true },
];

const getMotivation = (sales: number, isLeader: boolean): string => {
  if (sales === 0) return "Il tuo viaggio inizia adesso. La prima vendita è la più importante — falla oggi! 🚀";
  if (sales < 3) return `Solo ${3 - sales} vendite al bonus €500! Ogni giorno è un'opportunità. 💪`;
  if (sales < 5) return `Sei nel flusso! ${5 - sales} vendite al bonus Elite €1.500. Non fermarti! 🔥`;
  if (sales >= 5 && !isLeader) return "Performance Elite! Recluta 2 partner e sblocca i guadagni da Team Leader. 👑";
  if (isLeader) return "Sei un Leader. Il tuo team è il tuo patrimonio — fallo crescere ogni giorno. 🏆";
  return "Continua così, stai costruendo qualcosa di grande! ⚡";
};

const getRankTitle = (sales: number, isLeader: boolean) => {
  if (isLeader && sales >= 10) return { title: "Diamond Leader", color: "#67e8f9", icon: Crown };
  if (isLeader) return { title: "Team Leader", color: "#f59e0b", icon: Crown };
  if (sales >= 5) return { title: "Elite Seller", color: "#a78bfa", icon: Flame };
  if (sales >= 3) return { title: "Pro Seller", color: "#34d399", icon: Zap };
  if (sales >= 1) return { title: "Active Seller", color: "#38bdf8", icon: Star };
  return { title: "New Partner", color: "#6b7280", icon: Target };
};

export default function PartnerEarningsPage() {
  const { user, isTeamLeader } = useAuth();
  const [allSales, setAllSales] = useState<SaleRecord[]>([]);
  const [monthlyBonuses, setMonthlyBonuses] = useState<BonusRecord[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberRow[]>([]);
  const [teamSales, setTeamSales] = useState<SaleRecord[]>([]);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);

  useEffect(() => { if (user?.id) fetchData(); }, [user?.id, isTeamLeader]);

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: sales } = await supabase.from("partner_sales").select("*").eq("partner_id", user.id).order("created_at", { ascending: false });
      setAllSales((sales as SaleRecord[]) || []);
      const { data: bonuses } = await supabase.from("performance_bonuses").select("*").eq("partner_id", user.id).order("bonus_month", { ascending: false }).limit(12);
      setMonthlyBonuses((bonuses as BonusRecord[]) || []);
      if (isTeamLeader) {
        const { data: team } = await supabase.from("partner_teams").select("*").eq("team_leader_id", user.id);
        if (team && team.length > 0) {
          const memberIds = team.map((t: any) => t.partner_id);
          const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", memberIds);
          setTeamMembers(team.map((t: any) => ({ ...t, profiles: profiles?.find((p: any) => p.user_id === t.partner_id) || null })));
          const { data: tSales } = await supabase.from("partner_sales").select("*").in("partner_id", memberIds);
          setTeamSales((tSales as SaleRecord[]) || []);
        }
      }
    } finally { setLoading(false); }
  };

  /* ─── Computed ─── */
  const salesCount = allSales.length;
  const totalCommissions = allSales.reduce((s, r) => s + Number(r.partner_commission || 0), 0);
  const currentMonthSales = allSales.filter((s) => s.sale_month === currentMonth).length;
  const lastMonthKey = useMemo(() => { const d = new Date(); d.setMonth(d.getMonth() - 1); return d.toISOString().slice(0, 7); }, []);
  const lastMonthSales = allSales.filter((s) => s.sale_month === lastMonthKey).length;
  const monthGrowth = lastMonthSales > 0 ? Math.round(((currentMonthSales - lastMonthSales) / lastMonthSales) * 100) : currentMonthSales > 0 ? 100 : 0;
  const totalBonuses = monthlyBonuses.reduce((s, b) => s + Number(b.bonus_amount), 0);
  const totalOverrides = useMemo(() => {
    if (!isTeamLeader || teamMembers.length === 0) return 0;
    let total = 0;
    for (const member of teamMembers) {
      const count = teamSales.filter((s) => s.partner_id === member.partner_id).length;
      total += Math.max(0, count - OVERRIDE_THRESHOLD) * OVERRIDE_PER_ELIGIBLE;
    }
    return total;
  }, [isTeamLeader, teamMembers, teamSales]);
  const netEarnings = totalCommissions + totalBonuses + totalOverrides;
  const rank = getRankTitle(salesCount, isTeamLeader);
  const motivation = getMotivation(currentMonthSales, isTeamLeader);
  const salesByMonth = useMemo(() => {
    const map: Record<string, { count: number; commission: number }> = {};
    allSales.forEach((s) => { if (!map[s.sale_month]) map[s.sale_month] = { count: 0, commission: 0 }; map[s.sale_month].count++; map[s.sale_month].commission += Number(s.partner_commission || 0); });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [allSales]);
  const progressToLeader = !isTeamLeader ? {
    salesProgress: Math.min(salesCount / TEAM_LEADER_REQ_SALES, 1),
    recruitsProgress: Math.min(teamMembers.length / TEAM_LEADER_REQ_RECRUITS, 1),
    salesDone: salesCount >= TEAM_LEADER_REQ_SALES,
    recruitsDone: teamMembers.length >= TEAM_LEADER_REQ_RECRUITS,
  } : null;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/partner/register?ref=${user?.id}`);
    setInviteCopied(true);
    toast({ title: "Link copiato!", description: "Chi si registra sarà nel tuo team." });
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const formatMonth = (m: string) => { const [y, mo] = m.split("-"); const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"]; return `${months[parseInt(mo) - 1]} ${y}`; };
  const cardBase = "rounded-2xl overflow-hidden";
  const glassStyle = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" };

  // Simulator values
  const simSales = 5;
  const simTeam = 3;
  const simTeamSalesEach = 8;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
          <Sparkles className="w-8 h-8" style={{ color: "#a78bfa" }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 pt-5 pb-24">
      {/* ═══ RANK BANNER ═══ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className={`${cardBase} p-5 relative`}
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(167,139,250,0.06))", border: "1px solid rgba(167,139,250,0.2)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${rank.color}22` }}>
            <rank.icon className="w-5 h-5" style={{ color: rank.color }} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: rank.color }}>{rank.title}</p>
            <p className="text-[10px] text-muted-foreground">{salesCount} vendite totali · Membro da {allSales.length > 0 ? formatMonth(allSales[allSales.length - 1]?.sale_month || currentMonth) : formatMonth(currentMonth)}</p>
          </div>
        </div>
        <p className="text-xs text-foreground/80 leading-relaxed">{motivation}</p>
      </motion.div>

      {/* ═══ NET EARNINGS ═══ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className={`${cardBase} p-5 relative`}
        style={{ background: "linear-gradient(145deg, rgba(16,185,129,0.08), rgba(52,211,153,0.03))", border: "1px solid rgba(16,185,129,0.18)" }}>
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: monthGrowth >= 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)" }}>
            <TrendingUp className="w-3 h-3" style={{ color: monthGrowth >= 0 ? "#34d399" : "#ef4444", transform: monthGrowth < 0 ? "rotate(180deg)" : "none" }} />
            <span className="text-[10px] font-bold" style={{ color: monthGrowth >= 0 ? "#34d399" : "#ef4444" }}>{monthGrowth >= 0 ? "+" : ""}{monthGrowth}%</span>
          </div>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: "#6ee7b7" }}>Guadagni Netti Totali</p>
        <p className="text-4xl font-bold text-foreground tracking-tight">€{netEarnings.toLocaleString("it-IT")}</p>
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <EarningsPill color="#34d399" label="Commissioni" value={totalCommissions} />
          {totalOverrides > 0 && <EarningsPill color="#38bdf8" label="Override" value={totalOverrides} />}
          {totalBonuses > 0 && <EarningsPill color="#fbbf24" label="Bonus" value={totalBonuses} />}
        </div>
      </motion.div>

      {/* ═══ KPI ═══ */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { icon: Trophy, value: salesCount, label: "Vendite", sub: `€${COMMISSION_PER_SALE}/cad`, color: "#a78bfa" },
          { icon: DollarSign, value: salesCount > 0 ? `€${Math.round(totalCommissions / salesCount)}` : "—", label: "Media", sub: "per vendita", color: "#34d399" },
          { icon: Calendar, value: currentMonthSales, label: formatMonth(currentMonth), sub: "questo mese", color: "#38bdf8" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            className={`${cardBase} p-3.5 text-center`} style={glassStyle}>
            <s.icon className="w-4 h-4 mb-1.5 mx-auto" style={{ color: s.color }} />
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] font-semibold text-foreground/70">{s.label}</p>
            <p className="text-[9px] text-muted-foreground">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ═══ 🔥 COME FUNZIONA IL SISTEMA — SPIEGAZIONE COMPLETA ═══ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className={`${cardBase} p-5`}
        style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.06), rgba(124,58,237,0.03))", border: "1px solid rgba(167,139,250,0.15)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5" style={{ color: "#a78bfa" }} />
          <h3 className="text-sm font-bold text-foreground">Come Funziona il Sistema Empire</h3>
        </div>

        {/* 3 Revenue Streams */}
        <div className="space-y-4">
          <div className="p-3 rounded-xl" style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.12)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <DollarSign className="w-4 h-4" style={{ color: "#34d399" }} />
              <span className="text-xs font-bold text-foreground">1. Commissione Vendita Diretta</span>
            </div>
            <p className="text-[11px] text-foreground/70 leading-relaxed">
              Ogni volta che chiudi una vendita (qualsiasi pacchetto: Digital Start €1.997, Growth AI €4.997, Empire €7.997), guadagni sempre <strong className="text-foreground">€997 fissi</strong>. 
              Non importa il pacchetto — la tua commissione è sempre la stessa.
            </p>
          </div>

          <div className="p-3 rounded-xl" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.12)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Gift className="w-4 h-4" style={{ color: "#fbbf24" }} />
              <span className="text-xs font-bold text-foreground">2. Bonus Performance Mensile</span>
            </div>
            <p className="text-[11px] text-foreground/70 leading-relaxed mb-2">
              Ogni mese, se raggiungi le soglie di vendita, ricevi un bonus extra <strong className="text-foreground">automatico</strong>:
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: "rgba(167,139,250,0.08)" }}>
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3" style={{ color: "#a78bfa" }} />
                  <span className="text-[11px] text-foreground/80">3 vendite nello stesso mese</span>
                </div>
                <span className="text-[11px] font-bold" style={{ color: "#a78bfa" }}>+€500</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: "rgba(245,158,11,0.08)" }}>
                <div className="flex items-center gap-2">
                  <Flame className="w-3 h-3" style={{ color: "#f59e0b" }} />
                  <span className="text-[11px] text-foreground/80">5 vendite nello stesso mese</span>
                </div>
                <span className="text-[11px] font-bold" style={{ color: "#f59e0b" }}>+€1.500</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 italic">
              ⚡ I bonus si sommano alle commissioni. Esempio: 5 vendite = €4.985 (commissioni) + €1.500 (bonus) = <strong>€6.485 in un mese</strong>.
            </p>
          </div>

          <div className="p-3 rounded-xl" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.12)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Users className="w-4 h-4" style={{ color: "#38bdf8" }} />
              <span className="text-xs font-bold text-foreground">3. Override da Team (solo Team Leader)</span>
            </div>
            <p className="text-[11px] text-foreground/70 leading-relaxed mb-2">
              Quando diventi Team Leader, guadagni <strong className="text-foreground">€50 per ogni vendita</strong> fatta dai membri del tuo team, a partire dalla <strong className="text-foreground">5ª vendita</strong> di ciascun membro.
            </p>
            <div className="p-2.5 rounded-lg" style={{ background: "rgba(56,189,248,0.06)" }}>
              <p className="text-[10px] font-semibold mb-1" style={{ color: "#7dd3fc" }}>📊 Esempio concreto:</p>
              <p className="text-[10px] text-foreground/60 leading-relaxed">
                Hai 3 membri nel team. Membro A ha 8 vendite, Membro B ha 6 vendite, Membro C ha 3 vendite.<br />
                • A: 8 − 4 = <strong>4 vendite idonee</strong> → 4 × €50 = €200<br />
                • B: 6 − 4 = <strong>2 vendite idonee</strong> → 2 × €50 = €100<br />
                • C: 3 vendite → <strong>non ancora idoneo</strong> (servono 5+)<br />
                <strong className="text-foreground">Totale Override: €300/mese passivi</strong>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ RANK ROADMAP ═══ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className={cardBase} style={glassStyle}>
        <button onClick={() => setShowRoadmap(!showRoadmap)} className="w-full p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4" style={{ color: "#f59e0b" }} />
            <span className="text-sm font-bold text-foreground">Percorso di Crescita</span>
          </div>
          {showRoadmap ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        <AnimatePresence>
          {showRoadmap && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-4 pb-5 space-y-0">
                {RANK_LEVELS.map((level, i) => {
                  const isCurrentRank = level.title === rank.title;
                  const isPast = !level.isLeader && level.min < salesCount && !isCurrentRank;
                  return (
                    <div key={i} className="flex gap-3">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{
                          background: isCurrentRank ? `${level.color}22` : isPast ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.04)",
                          border: isCurrentRank ? `2px solid ${level.color}` : "1px solid rgba(255,255,255,0.08)",
                        }}>
                          <level.icon className="w-3.5 h-3.5" style={{ color: isCurrentRank ? level.color : isPast ? "#34d399" : "#6b7280" }} />
                        </div>
                        {i < RANK_LEVELS.length - 1 && <div className="w-px flex-1 min-h-[24px]" style={{ background: isPast || isCurrentRank ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.06)" }} />}
                      </div>
                      <div className="pb-4 pt-1">
                        <p className="text-[11px] font-bold" style={{ color: isCurrentRank ? level.color : isPast ? "#34d399" : "rgba(255,255,255,0.5)" }}>
                          {level.title} {isCurrentRank && "← Tu sei qui"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{level.desc}</p>
                        {level.isLeader && !isTeamLeader && (
                          <p className="text-[9px] mt-0.5" style={{ color: "#f59e0b" }}>
                            Req: {TEAM_LEADER_REQ_SALES} vendite + {TEAM_LEADER_REQ_RECRUITS} reclute
                          </p>
                        )}
                        {level.min > 0 && !level.isLeader && (
                          <p className="text-[9px] text-muted-foreground">Req: {level.min}+ vendite</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ BONUS MENSILE ═══ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className={`${cardBase} p-5`} style={glassStyle}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: "#a78bfa" }} /> Bonus Mese Corrente
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>{formatMonth(currentMonth)}</span>
        </div>
        <div className="flex items-center justify-around mb-4">
          {BONUS_TIERS.map((tier) => (
            <BonusProgressRing key={tier.tier} salesCount={currentMonthSales} milestone={tier.sales}
              label={`€${tier.amount.toLocaleString("it-IT")}`}
              reward={currentMonthSales >= tier.sales ? "✓ Sbloccato!" : `${tier.sales - currentMonthSales} vendite mancanti`}
              unlocked={currentMonthSales >= tier.sales} />
          ))}
        </div>
      </motion.div>

      {/* ═══ 💰 SIMULATORE GUADAGNI ═══ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
        className={cardBase} style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(251,191,36,0.02))", border: "1px solid rgba(245,158,11,0.15)" }}>
        <button onClick={() => setShowSimulator(!showSimulator)} className="w-full p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gem className="w-4 h-4" style={{ color: "#fbbf24" }} />
            <span className="text-sm font-bold text-foreground">Simulatore Guadagni</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>NUOVO</span>
          </div>
          {showSimulator ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        <AnimatePresence>
          {showSimulator && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-4 pb-5 space-y-4">
                <p className="text-[11px] text-muted-foreground">Ecco cosa puoi guadagnare in un mese come <strong className="text-foreground">Team Leader con 3 membri attivi</strong>:</p>
                
                <div className="space-y-2">
                  {[
                    { label: `${simSales} vendite personali × €${COMMISSION_PER_SALE}`, value: simSales * COMMISSION_PER_SALE, color: "#34d399" },
                    { label: `Bonus Elite (5+ vendite/mese)`, value: 1500, color: "#fbbf24" },
                    { label: `Override: ${simTeam} membri × ${simTeamSalesEach - OVERRIDE_THRESHOLD} vendite idonee × €${OVERRIDE_PER_ELIGIBLE}`, value: simTeam * (simTeamSalesEach - OVERRIDE_THRESHOLD) * OVERRIDE_PER_ELIGIBLE, color: "#38bdf8" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <span className="text-[10px] text-foreground/70">{row.label}</span>
                      <span className="text-[11px] font-bold" style={{ color: row.color }}>€{row.value.toLocaleString("it-IT")}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl text-center" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,191,36,0.06))", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#fbbf24" }}>Totale Mensile Potenziale</p>
                  <p className="text-3xl font-bold text-foreground">
                    €{(simSales * COMMISSION_PER_SALE + 1500 + simTeam * (simTeamSalesEach - OVERRIDE_THRESHOLD) * OVERRIDE_PER_ELIGIBLE).toLocaleString("it-IT")}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    = €{((simSales * COMMISSION_PER_SALE + 1500 + simTeam * (simTeamSalesEach - OVERRIDE_THRESHOLD) * OVERRIDE_PER_ELIGIBLE) * 12).toLocaleString("it-IT")}/anno
                  </p>
                </div>

                <p className="text-[9px] text-center text-muted-foreground italic">
                  💡 Questo è un esempio realistico. Il tuo guadagno dipende dal numero di vendite e dalla performance del tuo team.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ PROGRESS TO TEAM LEADER ═══ */}
      {!isTeamLeader && progressToLeader && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={`${cardBase} p-5`}
          style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(251,191,36,0.03))", border: "1px solid rgba(245,158,11,0.18)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5" style={{ color: "#f59e0b" }} />
            <h3 className="text-sm font-bold text-foreground">Diventa Team Leader</h3>
          </div>
          <p className="text-[11px] text-foreground/70 mb-1 leading-relaxed">
            Il Team Leader è il livello che sblocca i <strong className="text-foreground">guadagni passivi</strong>. Significa che guadagni anche quando <strong className="text-foreground">non vendi tu direttamente</strong>.
          </p>
          <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">
            📌 <strong>Requisiti</strong>: completa {TEAM_LEADER_REQ_SALES} vendite personali + recluta {TEAM_LEADER_REQ_RECRUITS} partner. 
            Una volta Team Leader, ogni membro del tuo team ti genera <strong>€{OVERRIDE_PER_ELIGIBLE} per vendita dalla 5ª in poi</strong> — per sempre.
          </p>
          <div className="space-y-3 mb-4">
            <ProgressItem label={`${Math.min(salesCount, TEAM_LEADER_REQ_SALES)}/${TEAM_LEADER_REQ_SALES} Vendite Personali`} progress={progressToLeader.salesProgress} done={progressToLeader.salesDone} />
            <ProgressItem label={`${teamMembers.length}/${TEAM_LEADER_REQ_RECRUITS} Partner Reclutati`} progress={progressToLeader.recruitsProgress} done={progressToLeader.recruitsDone} />
          </div>
          
          {/* What you unlock */}
          <div className="p-3 rounded-xl" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.1)" }}>
            <p className="text-[10px] font-bold text-foreground mb-2 flex items-center gap-1.5">
              <Lock className="w-3 h-3" style={{ color: "#f59e0b" }} /> Cosa sblocchi come Team Leader:
            </p>
            <div className="space-y-1">
              {[
                "€50 per ogni vendita del team (dalla 5ª di ogni membro)",
                "Accesso al pannello Team con statistiche real-time",
                "Rank Diamond Leader raggiungibile (10+ vendite)",
                "Guadagni passivi scalabili — più recluti, più guadagni",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2">
                  <BadgeCheck className="w-3 h-3 shrink-0 mt-0.5" style={{ color: "#34d399" }} />
                  <span className="text-[10px] text-foreground/70">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══ RECLUTAMENTO ═══ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className={`${cardBase} p-5 space-y-3`} style={glassStyle}>
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" style={{ color: "#a78bfa" }} />
          <h3 className="text-sm font-bold text-foreground">Recluta Partner</h3>
        </div>
        <p className="text-[11px] text-foreground/70 leading-relaxed">
          Ogni partner che recluti entra nel tuo team. Tu guadagni <strong className="text-foreground">€{OVERRIDE_PER_ELIGIBLE}</strong> per ogni loro vendita dalla 5ª in poi. 
          Con <strong className="text-foreground">{TEAM_LEADER_REQ_RECRUITS} reclute</strong> e <strong className="text-foreground">{TEAM_LEADER_REQ_SALES} vendite personali</strong> diventi Team Leader e accedi ai guadagni passivi.
        </p>

        {/* Perché reclutare */}
        <div className="p-3 rounded-xl space-y-1.5" style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.1)" }}>
          <p className="text-[10px] font-bold text-foreground flex items-center gap-1.5">
            <Heart className="w-3 h-3" style={{ color: "#a78bfa" }} /> Perché dovresti reclutare:
          </p>
          {[
            "Non paghi niente — il partner guadagna le sue commissioni normalmente",
            "Tu guadagni UN EXTRA €50/vendita dalla 5ª vendita di ogni membro",
            "Con 5 membri attivi (10 vendite ciascuno): €1.500/mese PASSIVI",
            "Il partner che recluti riceve formazione e supporto completo",
          ].map((txt, i) => (
            <div key={i} className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 shrink-0 mt-0.5" style={{ color: "#a78bfa" }} />
              <span className="text-[10px] text-foreground/60">{txt}</span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] mb-1 font-medium text-muted-foreground">Il tuo link di reclutamento:</p>
          <p className="text-[10px] font-mono break-all select-all text-foreground/70">{window.location.origin}/partner/register?ref={user?.id}</p>
        </div>
        <motion.button onClick={handleCopyInviteLink} whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
          style={{ background: inviteCopied ? "#059669" : "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff" }}>
          {inviteCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {inviteCopied ? "Link Copiato!" : "Copia Link Reclutamento"}
        </motion.button>
      </motion.div>

      {/* ═══ TEAM LEADER SECTION ═══ */}
      {isTeamLeader && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Shield className="w-3 h-3" /> Il Tuo Team · {teamMembers.length} {teamMembers.length === 1 ? "membro" : "membri"}
          </h3>

          {(() => {
            const isActive = salesCount >= TEAM_LEADER_REQ_SALES && teamMembers.length >= TEAM_LEADER_REQ_RECRUITS;
            return (
              <div className={`${cardBase} p-4`} style={{
                background: isActive ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.06)",
                border: `1px solid ${isActive ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.15)"}`,
              }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "animate-pulse" : ""}`} style={{ background: isActive ? "#34d399" : "#ef4444" }} />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: isActive ? "#34d399" : "#ef4444" }}>
                      {isActive ? "Leader Attivo" : "Leader Sospeso"}
                    </span>
                  </div>
                  <Crown className="w-5 h-5" style={{ color: isActive ? "#34d399" : "rgba(239,68,68,0.5)" }} />
                </div>
                {!isActive && (
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Requisiti: {TEAM_LEADER_REQ_SALES}+ vendite personali + {TEAM_LEADER_REQ_RECRUITS}+ membri. Raggiungi i requisiti per riattivare gli override.
                  </p>
                )}
              </div>
            );
          })()}

          {/* Override Revenue */}
          <div className={`${cardBase} p-5`} style={{
            background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(14,165,233,0.03))",
            border: "1px solid rgba(56,189,248,0.18)",
          }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: "#7dd3fc" }}>Revenue da Management</p>
            <p className="text-3xl font-bold text-foreground tracking-tight">€{totalOverrides.toLocaleString("it-IT")}</p>
            <p className="text-[10px] mt-2" style={{ color: "#38bdf8" }}>€{OVERRIDE_PER_ELIGIBLE} × vendite idonee (dalla {OVERRIDE_THRESHOLD + 1}ª per membro)</p>
            <p className="text-[9px] text-muted-foreground mt-1">
              Più il tuo team vende, più guadagni. L'override è automatico e si accumula ogni mese.
            </p>
          </div>

          {/* Team Members */}
          {teamMembers.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="col-span-5">Partner</span>
                <span className="col-span-2 text-center">Vendite</span>
                <span className="col-span-3 text-center">Override</span>
                <span className="col-span-2 text-center">Stato</span>
              </div>
              {teamMembers.map((member) => {
                const memberCount = teamSales.filter((s) => s.partner_id === member.partner_id).length;
                const eligibleOverrides = Math.max(0, memberCount - OVERRIDE_THRESHOLD);
                const isActiveMember = memberCount >= 5;
                return (
                  <motion.div key={member.id} whileHover={{ scale: 1.01 }} className={`${cardBase} grid grid-cols-12 gap-2 items-center p-3`} style={glassStyle}>
                    <div className="col-span-5 flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: isActiveMember ? "rgba(52,211,153,0.1)" : "rgba(56,189,248,0.1)" }}>
                        <Users className="w-3.5 h-3.5" style={{ color: isActiveMember ? "#34d399" : "#38bdf8" }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-foreground truncate">{member.profiles?.full_name || "Partner"}</p>
                        <p className="text-[9px] text-muted-foreground">{isActiveMember ? "Genera override" : `Mancano ${5 - memberCount} vendite`}</p>
                      </div>
                    </div>
                    <p className="col-span-2 text-center text-sm font-bold text-foreground">{memberCount}</p>
                    <p className="col-span-3 text-center text-sm font-bold" style={{ color: eligibleOverrides > 0 ? "#a78bfa" : "#6b7280" }}>
                      €{(eligibleOverrides * OVERRIDE_PER_ELIGIBLE).toLocaleString("it-IT")}
                    </p>
                    <div className="col-span-2 flex justify-center">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{
                        background: isActiveMember ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)",
                        color: isActiveMember ? "#34d399" : "#6b7280",
                      }}>
                        {isActiveMember ? "Attivo" : "🔒"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* ═══ STORICO ═══ */}
      {salesByMonth.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className={cardBase} style={glassStyle}>
          <button onClick={() => setShowHistory(!showHistory)} className="w-full p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: "#a78bfa" }} />
              <span className="text-sm font-bold text-foreground">Storico Mensile</span>
            </div>
            {showHistory ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {showHistory && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-4 pb-4 space-y-2">
                  {salesByMonth.map(([month, data]) => {
                    const bonus = monthlyBonuses.find((b) => b.bonus_month === month);
                    return (
                      <div key={month} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{formatMonth(month)}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {data.count} {data.count === 1 ? "vendita" : "vendite"}
                            {bonus && Number(bonus.bonus_amount) > 0 && <span style={{ color: "#fbbf24" }}> · Bonus €{Number(bonus.bonus_amount).toLocaleString("it-IT")}</span>}
                          </p>
                        </div>
                        <p className="text-sm font-bold" style={{ color: "#34d399" }}>€{data.commission.toLocaleString("it-IT")}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ═══ BONUS HISTORY ═══ */}
      {monthlyBonuses.some((b) => Number(b.bonus_amount) > 0) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className={`${cardBase} p-4`} style={glassStyle}>
          <h3 className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
            <Award className="w-4 h-4" style={{ color: "#fbbf24" }} /> Bonus Ottenuti
          </h3>
          <div className="space-y-2">
            {monthlyBonuses.filter((b) => Number(b.bonus_amount) > 0).map((b) => (
              <div key={b.id} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: b.bonus_tier === "elite" ? "rgba(245,158,11,0.12)" : "rgba(167,139,250,0.12)" }}>
                    {b.bonus_tier === "elite" ? <Flame className="w-3 h-3" style={{ color: "#f59e0b" }} /> : <Zap className="w-3 h-3" style={{ color: "#a78bfa" }} />}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-foreground">{formatMonth(b.bonus_month)}</p>
                    <p className="text-[9px] text-muted-foreground">{b.sales_count} vendite · Tier {b.bonus_tier.toUpperCase()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#fbbf24" }}>€{Number(b.bonus_amount).toLocaleString("it-IT")}</p>
                  <p className="text-[9px]" style={{ color: b.paid ? "#34d399" : "#f59e0b" }}>{b.paid ? "Pagato" : "In attesa"}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Sub Components ─── */
function EarningsPill({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-[10px] text-muted-foreground">{label} €{value.toLocaleString("it-IT")}</span>
    </div>
  );
}

function ProgressItem({ label, progress, done }: { label: string; progress: number; done: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-foreground/80">{label}</span>
        {done && <CheckCircle className="w-3.5 h-3.5" style={{ color: "#34d399" }} />}
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full" style={{ background: done ? "#34d399" : "linear-gradient(90deg, #f59e0b, #fbbf24)" }} />
      </div>
    </div>
  );
}
