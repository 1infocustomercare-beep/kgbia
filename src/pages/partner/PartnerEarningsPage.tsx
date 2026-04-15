import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, Trophy, Users, Target, Sparkles, Crown, Copy, CheckCircle,
  UserPlus, TrendingUp, Flame, Star, Zap, ChevronDown, ChevronUp,
  Award, ArrowUpRight, Clock, Calendar, Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BonusProgressRing from "@/components/partner/BonusProgressRing";
import { toast } from "@/hooks/use-toast";

/* ─── Types ─── */
interface SaleRecord {
  id: string;
  partner_id: string;
  sale_amount: number;
  partner_commission: number;
  team_leader_id: string | null;
  team_leader_override: number;
  bonus_amount: number;
  bonus_type: string | null;
  sale_month: string;
  created_at: string;
}
interface BonusRecord {
  id: string;
  partner_id: string;
  bonus_month: string;
  sales_count: number;
  bonus_amount: number;
  bonus_tier: string;
  paid: boolean;
}
interface TeamMemberRow {
  id: string;
  partner_id: string;
  team_leader_id: string;
  created_at: string;
  profiles: { user_id: string; full_name: string | null; email: string | null } | null;
}

/* ─── Constants ─── */
const COMMISSION_PER_SALE = 997;
const OVERRIDE_PER_ELIGIBLE = 50;
const OVERRIDE_THRESHOLD = 4; // override kicks in from 5th sale per member
const BONUS_TIERS = [
  { sales: 3, amount: 500, tier: "pro", label: "Pro", color: "#a78bfa" },
  { sales: 5, amount: 1500, tier: "elite", label: "Elite", color: "#f59e0b" },
];
const TEAM_LEADER_REQ_SALES = 4;
const TEAM_LEADER_REQ_RECRUITS = 2;

/* ─── Motivational Messages ─── */
const getMotivation = (sales: number, isLeader: boolean): string => {
  if (sales === 0) return "Il tuo viaggio inizia adesso. La prima vendita è la più importante — falla oggi! 🚀";
  if (sales < 3) return `Solo ${3 - sales} vendite al bonus €500! Ogni giorno è un'opportunità. 💪`;
  if (sales < 5) return `Sei nel flusso! ${5 - sales} vendite al bonus Elite €1.500. Non fermarti! 🔥`;
  if (sales >= 5 && !isLeader) return "Performance Elite! Recluta 2 partner e sblocca i guadagni da Team Leader. 👑";
  if (isLeader) return "Sei un Leader. Il tuo team è il tuo patrimonio — fallo crescere ogni giorno. 🏆";
  return "Continua così, stai costruendo qualcosa di grande! ⚡";
};

const getRankTitle = (sales: number, isLeader: boolean): { title: string; color: string; icon: typeof Star } => {
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
  const [loading, setLoading] = useState(true);

  const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);

  useEffect(() => {
    if (!user?.id) return;
    fetchData();
  }, [user?.id, isTeamLeader]);

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Fetch all partner sales
      const { data: sales } = await supabase
        .from("partner_sales")
        .select("*")
        .eq("partner_id", user.id)
        .order("created_at", { ascending: false });
      setAllSales((sales as SaleRecord[]) || []);

      // Fetch bonuses
      const { data: bonuses } = await supabase
        .from("performance_bonuses")
        .select("*")
        .eq("partner_id", user.id)
        .order("bonus_month", { ascending: false })
        .limit(12);
      setMonthlyBonuses((bonuses as BonusRecord[]) || []);

      // Fetch team if leader
      if (isTeamLeader) {
        const { data: team } = await supabase
          .from("partner_teams")
          .select("*")
          .eq("team_leader_id", user.id);
        if (team && team.length > 0) {
          const memberIds = team.map((t: any) => t.partner_id);
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, full_name, email")
            .in("user_id", memberIds);
          setTeamMembers(
            team.map((t: any) => ({
              ...t,
              profiles: profiles?.find((p: any) => p.user_id === t.partner_id) || null,
            }))
          );
          const { data: tSales } = await supabase
            .from("partner_sales")
            .select("*")
            .in("partner_id", memberIds);
          setTeamSales((tSales as SaleRecord[]) || []);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  /* ─── Computed Values (all from real DB data) ─── */
  const salesCount = allSales.length;
  const totalCommissions = allSales.reduce((s, r) => s + Number(r.partner_commission || 0), 0);
  const currentMonthSales = allSales.filter((s) => s.sale_month === currentMonth).length;
  const lastMonthKey = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 7);
  }, []);
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

  // Sales grouped by month for history
  const salesByMonth = useMemo(() => {
    const map: Record<string, { count: number; commission: number }> = {};
    allSales.forEach((s) => {
      if (!map[s.sale_month]) map[s.sale_month] = { count: 0, commission: 0 };
      map[s.sale_month].count++;
      map[s.sale_month].commission += Number(s.partner_commission || 0);
    });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [allSales]);

  // Progress to Team Leader
  const progressToLeader = !isTeamLeader
    ? {
        salesProgress: Math.min(salesCount / TEAM_LEADER_REQ_SALES, 1),
        recruitsProgress: Math.min(teamMembers.length / TEAM_LEADER_REQ_RECRUITS, 1),
        salesDone: salesCount >= TEAM_LEADER_REQ_SALES,
        recruitsDone: teamMembers.length >= TEAM_LEADER_REQ_RECRUITS,
      }
    : null;

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/auth?role=partner&ref=${user?.id}`;
    navigator.clipboard.writeText(link);
    setInviteCopied(true);
    toast({ title: "Link copiato!", description: "Chi si registra sarà nel tuo team." });
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const formatMonth = (m: string) => {
    const [y, mo] = m.split("-");
    const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
    return `${months[parseInt(mo) - 1]} ${y}`;
  };

  const cardBase = "rounded-2xl overflow-hidden";
  const glassStyle = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" };

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
      {/* ═══ RANK & MOTIVATION BANNER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${cardBase} p-5 relative`}
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(167,139,250,0.06))", border: "1px solid rgba(167,139,250,0.2)" }}
      >
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

      {/* ═══ NET EARNINGS HERO ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className={`${cardBase} p-5 relative`}
        style={{ background: "linear-gradient(145deg, rgba(16,185,129,0.08), rgba(52,211,153,0.03))", border: "1px solid rgba(16,185,129,0.18)" }}
      >
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: monthGrowth >= 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)" }}>
            <TrendingUp className="w-3 h-3" style={{ color: monthGrowth >= 0 ? "#34d399" : "#ef4444", transform: monthGrowth < 0 ? "rotate(180deg)" : "none" }} />
            <span className="text-[10px] font-bold" style={{ color: monthGrowth >= 0 ? "#34d399" : "#ef4444" }}>
              {monthGrowth >= 0 ? "+" : ""}{monthGrowth}%
            </span>
          </div>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: "#6ee7b7" }}>
          Guadagni Netti Totali
        </p>
        <p className="text-4xl font-bold text-foreground tracking-tight">
          €{netEarnings.toLocaleString("it-IT")}
        </p>
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <EarningsPill color="#34d399" label="Commissioni" value={totalCommissions} />
          {totalOverrides > 0 && <EarningsPill color="#38bdf8" label="Override" value={totalOverrides} />}
          {totalBonuses > 0 && <EarningsPill color="#fbbf24" label="Bonus" value={totalBonuses} />}
        </div>
      </motion.div>

      {/* ═══ KPI STRIP ═══ */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { icon: Trophy, value: salesCount, label: "Vendite", sub: `€${COMMISSION_PER_SALE}/cad`, color: "#a78bfa" },
          { icon: DollarSign, value: salesCount > 0 ? `€${Math.round(totalCommissions / salesCount)}` : "—", label: "Media", sub: "per vendita", color: "#34d399" },
          { icon: Calendar, value: currentMonthSales, label: formatMonth(currentMonth), sub: "questo mese", color: "#38bdf8" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className={`${cardBase} p-3.5 text-center`}
            style={glassStyle}
          >
            <s.icon className="w-4 h-4 mb-1.5 mx-auto" style={{ color: s.color }} />
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] font-semibold text-foreground/70">{s.label}</p>
            <p className="text-[9px] text-muted-foreground">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ═══ BONUS MENSILE ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${cardBase} p-5`}
        style={glassStyle}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: "#a78bfa" }} /> Bonus Performance
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>
            {formatMonth(currentMonth)}
          </span>
        </div>
        <div className="flex items-center justify-around mb-4">
          {BONUS_TIERS.map((tier) => (
            <BonusProgressRing
              key={tier.tier}
              salesCount={currentMonthSales}
              milestone={tier.sales}
              label={`€${tier.amount.toLocaleString("it-IT")}`}
              reward={
                currentMonthSales >= tier.sales
                  ? "✓ Sbloccato!"
                  : `${tier.sales - currentMonthSales} vendite mancanti`
              }
              unlocked={currentMonthSales >= tier.sales}
            />
          ))}
        </div>

        {/* Commission Breakdown */}
        <div className="pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Piano Commissioni</p>
          <div className="space-y-1.5">
            {[
              { label: "Ogni vendita chiusa", value: `€${COMMISSION_PER_SALE}`, icon: DollarSign },
              { label: "Bonus 3 vendite/mese", value: "+€500", icon: Award },
              { label: "Bonus 5 vendite/mese (Elite)", value: "+€1.500", icon: Flame },
              ...(isTeamLeader ? [{ label: "Override per vendita membro (dalla 5ª)", value: `+€${OVERRIDE_PER_ELIGIBLE}`, icon: Users }] : []),
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <item.icon className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[11px] text-foreground/70">{item.label}</span>
                </div>
                <span className="text-[11px] font-bold" style={{ color: "#34d399" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ═══ PROGRESS TO TEAM LEADER (if not yet) ═══ */}
      {!isTeamLeader && progressToLeader && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`${cardBase} p-5`}
          style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(251,191,36,0.03))", border: "1px solid rgba(245,158,11,0.18)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-5 h-5" style={{ color: "#f59e0b" }} />
            <h3 className="text-sm font-bold text-foreground">Diventa Team Leader</h3>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">
            Sblocca guadagni passivi da ogni vendita del tuo team. €50 di override dalla 5ª vendita di ciascun membro.
          </p>
          <div className="space-y-3">
            <ProgressItem
              label={`${Math.min(salesCount, TEAM_LEADER_REQ_SALES)}/${TEAM_LEADER_REQ_SALES} Vendite Personali`}
              progress={progressToLeader.salesProgress}
              done={progressToLeader.salesDone}
            />
            <ProgressItem
              label={`${teamMembers.length}/${TEAM_LEADER_REQ_RECRUITS} Partner Reclutati`}
              progress={progressToLeader.recruitsProgress}
              done={progressToLeader.recruitsDone}
            />
          </div>
        </motion.div>
      )}

      {/* ═══ RECLUTAMENTO ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`${cardBase} p-5 space-y-3`}
        style={glassStyle}
      >
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" style={{ color: "#a78bfa" }} />
          <h3 className="text-sm font-bold text-foreground">Recluta Partner</h3>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Ogni partner nel tuo team genera €{OVERRIDE_PER_ELIGIBLE} di override per vendita (dalla 5ª). 
          Con {TEAM_LEADER_REQ_RECRUITS} reclute e {TEAM_LEADER_REQ_SALES} vendite diventi Team Leader.
        </p>
        <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] mb-1 font-medium text-muted-foreground">Il tuo link di reclutamento:</p>
          <p className="text-[10px] font-mono break-all select-all text-foreground/70">
            {window.location.origin}/auth?role=partner&ref={user?.id}
          </p>
        </div>
        <motion.button
          onClick={handleCopyInviteLink}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          style={{ background: inviteCopied ? "#059669" : "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff" }}
        >
          {inviteCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {inviteCopied ? "Link Copiato!" : "Copia Link Reclutamento"}
        </motion.button>
      </motion.div>

      {/* ═══ TEAM LEADER SECTION ═══ */}
      {isTeamLeader && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-4"
        >
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <Shield className="w-3 h-3" /> Il Tuo Team · {teamMembers.length} {teamMembers.length === 1 ? "membro" : "membri"}
          </h3>

          {/* Leader Status */}
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
                    Requisiti: {TEAM_LEADER_REQ_SALES}+ vendite personali + {TEAM_LEADER_REQ_RECRUITS}+ membri nel team
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
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: "#7dd3fc" }}>
              Revenue da Management
            </p>
            <p className="text-3xl font-bold text-foreground tracking-tight">€{totalOverrides.toLocaleString("it-IT")}</p>
            <p className="text-[10px] mt-2" style={{ color: "#38bdf8" }}>
              €{OVERRIDE_PER_ELIGIBLE} × vendite idonee (dalla {OVERRIDE_THRESHOLD + 1}ª per membro)
            </p>
          </div>

          {/* Team Members Table */}
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
                const isActive = memberCount >= 5;
                return (
                  <motion.div
                    key={member.id}
                    whileHover={{ scale: 1.01 }}
                    className={`${cardBase} grid grid-cols-12 gap-2 items-center p-3`}
                    style={glassStyle}
                  >
                    <div className="col-span-5 flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: isActive ? "rgba(52,211,153,0.1)" : "rgba(56,189,248,0.1)" }}>
                        <Users className="w-3.5 h-3.5" style={{ color: isActive ? "#34d399" : "#38bdf8" }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-foreground truncate">
                          {member.profiles?.full_name || "Partner"}
                        </p>
                      </div>
                    </div>
                    <p className="col-span-2 text-center text-sm font-bold text-foreground">{memberCount}</p>
                    <p className="col-span-3 text-center text-sm font-bold" style={{ color: "#a78bfa" }}>
                      €{(eligibleOverrides * OVERRIDE_PER_ELIGIBLE).toLocaleString("it-IT")}
                    </p>
                    <div className="col-span-2 flex justify-center">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{
                        background: isActive ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)",
                        color: isActive ? "#34d399" : "#6b7280",
                      }}>
                        {isActive ? "Attivo" : "🔒"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* ═══ STORICO VENDITE ═══ */}
      {salesByMonth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${cardBase}`}
          style={glassStyle}
        >
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: "#a78bfa" }} />
              <span className="text-sm font-bold text-foreground">Storico Mensile</span>
            </div>
            {showHistory ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2">
                  {salesByMonth.map(([month, data]) => {
                    const bonus = monthlyBonuses.find((b) => b.bonus_month === month);
                    return (
                      <div key={month} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{formatMonth(month)}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {data.count} {data.count === 1 ? "vendita" : "vendite"}
                            {bonus && Number(bonus.bonus_amount) > 0 && (
                              <span style={{ color: "#fbbf24" }}> · Bonus €{Number(bonus.bonus_amount).toLocaleString("it-IT")}</span>
                            )}
                          </p>
                        </div>
                        <p className="text-sm font-bold" style={{ color: "#34d399" }}>
                          €{data.commission.toLocaleString("it-IT")}
                        </p>
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className={`${cardBase} p-4`}
          style={glassStyle}
        >
          <h3 className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
            <Award className="w-4 h-4" style={{ color: "#fbbf24" }} /> Bonus Ottenuti
          </h3>
          <div className="space-y-2">
            {monthlyBonuses
              .filter((b) => Number(b.bonus_amount) > 0)
              .map((b) => (
                <div key={b.id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{
                      background: b.bonus_tier === "elite" ? "rgba(245,158,11,0.12)" : "rgba(167,139,250,0.12)",
                    }}>
                      {b.bonus_tier === "elite" ? <Flame className="w-3 h-3" style={{ color: "#f59e0b" }} /> : <Zap className="w-3 h-3" style={{ color: "#a78bfa" }} />}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-foreground">{formatMonth(b.bonus_month)}</p>
                      <p className="text-[9px] text-muted-foreground">{b.sales_count} vendite · Tier {b.bonus_tier.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: "#fbbf24" }}>€{Number(b.bonus_amount).toLocaleString("it-IT")}</p>
                    <p className="text-[9px]" style={{ color: b.paid ? "#34d399" : "#f59e0b" }}>
                      {b.paid ? "Pagato" : "In attesa"}
                    </p>
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
      <span className="text-[10px] text-muted-foreground">
        {label} €{value.toLocaleString("it-IT")}
      </span>
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
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: done ? "#34d399" : "linear-gradient(90deg, #f59e0b, #fbbf24)" }}
        />
      </div>
    </div>
  );
}
