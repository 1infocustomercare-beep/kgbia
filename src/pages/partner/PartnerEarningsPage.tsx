import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign, Trophy, Users, Target, Sparkles, Crown, Copy, CheckCircle,
  UserPlus, ChevronRight, TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BonusProgressRing from "@/components/partner/BonusProgressRing";
import { toast } from "@/hooks/use-toast";

export default function PartnerEarningsPage() {
  const navigate = useNavigate();
  const { user, isTeamLeader } = useAuth();
  const [salesCount, setSalesCount] = useState(0);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [currentMonthSales, setCurrentMonthSales] = useState(0);
  const [monthlyBonuses, setMonthlyBonuses] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamSales, setTeamSales] = useState<any[]>([]);
  const [inviteCopied, setInviteCopied] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetchData();
  }, [user?.id, isTeamLeader]);

  const fetchData = async () => {
    if (!user?.id) return;
    const { data: sales } = await supabase.from("partner_sales").select("*").eq("partner_id", user.id);
    const allSales = sales || [];
    setSalesCount(allSales.length);
    setTotalCommissions(allSales.reduce((s: number, r: any) => s + Number(r.partner_commission || 0), 0));
    const cm = new Date().toISOString().slice(0, 7);
    setCurrentMonthSales(allSales.filter((s: any) => s.sale_month === cm).length);

    if (isTeamLeader) {
      const { data: team } = await supabase.from("partner_teams").select("*").eq("team_leader_id", user.id);
      if (team && team.length > 0) {
        const memberIds = team.map((t: any) => t.partner_id);
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", memberIds);
        setTeamMembers(team.map((t: any) => ({ ...t, profiles: profiles?.find((p: any) => p.user_id === t.partner_id) || null })));
        const { data: tSales } = await supabase.from("partner_sales").select("*").in("partner_id", memberIds);
        setTeamSales(tSales || []);
      }
    }

    const { data: bonuses } = await supabase.from("performance_bonuses").select("*").eq("partner_id", user.id).order("bonus_month", { ascending: false }).limit(6);
    setMonthlyBonuses(bonuses || []);
  };

  const totalBonuses = monthlyBonuses.reduce((s, b) => s + Number(b.bonus_amount), 0);
  const totalOverrides = (() => {
    if (!isTeamLeader || teamMembers.length === 0) return 0;
    let total = 0;
    for (const member of teamMembers) {
      const memberSalesCount = teamSales.filter((s: any) => s.partner_id === member.partner_id).length;
      total += Math.max(0, memberSalesCount - 4) * 50;
    }
    return total;
  })();
  const netEarnings = totalCommissions + totalBonuses + totalOverrides;
  const currentMonth = new Date().toISOString().slice(0, 7);

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/auth?role=partner&ref=${user?.id}`;
    navigator.clipboard.writeText(link);
    setInviteCopied(true);
    toast({ title: "Link copiato!", description: "Chi si registra sarà nel tuo team." });
    setTimeout(() => setInviteCopied(false), 2000);
  };

  return (
    <div className="space-y-6 px-4 pt-6 pb-8">
      <h2 className="text-lg font-bold text-foreground">Guadagni & Team</h2>

      {/* ═══ NET EARNINGS ═══ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl relative overflow-hidden"
        style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#6ee7b7" }}>Guadagni Netti Totali</p>
        <p className="text-4xl font-bold text-foreground">€{netEarnings.toLocaleString()}</p>
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#34d399" }} /><span className="text-[10px] text-muted-foreground">Commissioni €{totalCommissions.toLocaleString()}</span></div>
          {isTeamLeader && totalOverrides > 0 && <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#38bdf8" }} /><span className="text-[10px] text-muted-foreground">Override €{totalOverrides.toLocaleString()}</span></div>}
          {totalBonuses > 0 && <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: "#fbbf24" }} /><span className="text-[10px] text-muted-foreground">Bonus €{totalBonuses.toLocaleString()}</span></div>}
        </div>
      </motion.div>

      {/* ═══ STATS ═══ */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Trophy, value: salesCount, label: "Vendite Totali", color: "#a78bfa" },
          { icon: DollarSign, value: salesCount > 0 ? `€${Math.round(totalCommissions / salesCount)}` : "€0", label: "Media/Vendita", color: "#34d399" },
          { icon: isTeamLeader ? Users : Target, value: isTeamLeader ? teamMembers.length : `${salesCount}/4`, label: isTeamLeader ? "Nel Team" : "a Team Leader", color: "#38bdf8" },
        ].map((s, i) => (
          <div key={i} className="p-3.5 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <s.icon className="w-4 h-4 mb-1 mx-auto" style={{ color: s.color }} />
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ═══ BONUS MENSILE ═══ */}
      <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: "#a78bfa" }} /> Bonus Mensile
          </h3>
          <span className="text-[10px] text-muted-foreground">{currentMonth}</span>
        </div>
        <div className="flex items-center justify-around">
          <BonusProgressRing salesCount={currentMonthSales} milestone={3} label="€500" reward={currentMonthSales >= 3 ? "✓ Sbloccato" : `${3 - currentMonthSales} mancanti`} unlocked={currentMonthSales >= 3} />
          <BonusProgressRing salesCount={currentMonthSales} milestone={5} label="€1.500" reward={currentMonthSales >= 5 ? "✓ Sbloccato" : `${5 - currentMonthSales} mancanti`} unlocked={currentMonthSales >= 5} />
        </div>
      </div>

      {/* ═══ RECRUITMENT ═══ */}
      <div className="p-5 rounded-2xl space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" style={{ color: "#a78bfa" }} />
          <h3 className="text-sm font-bold text-foreground">Recluta Sotto-Venditori</h3>
        </div>
        <p className="text-xs text-muted-foreground">Condividi il tuo link. Chi si registra verrà assegnato al tuo team.</p>
        <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] mb-1 font-medium text-muted-foreground">Il tuo link:</p>
          <p className="text-xs font-mono break-all select-all text-foreground">{window.location.origin}/auth?role=partner&ref={user?.id}</p>
        </div>
        <motion.button onClick={handleCopyInviteLink} whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
          style={{ background: "#7c3aed", color: "#ffffff" }}>
          {inviteCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {inviteCopied ? "Copiato!" : "Copia Link Reclutamento"}
        </motion.button>
      </div>

      {/* ═══ TEAM LEADER ═══ */}
      {isTeamLeader && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Il Tuo Team ({teamMembers.length} membri)
          </h3>
          {(() => {
            const isActive = salesCount >= 4 && teamMembers.length >= 2;
            return (
              <div className="p-4 rounded-2xl" style={{ background: isActive ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${isActive ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "animate-pulse" : ""}`} style={{ background: isActive ? "#34d399" : "#ef4444" }} />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: isActive ? "#34d399" : "#ef4444" }}>
                      {isActive ? "Leader Attivo" : "Leader Sospeso"}
                    </span>
                  </div>
                  <Crown className="w-5 h-5" style={{ color: isActive ? "#34d399" : "rgba(239,68,68,0.5)" }} />
                </div>
              </div>
            );
          })()}

          {/* Override Revenue */}
          <div className="p-5 rounded-2xl" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#7dd3fc" }}>Revenue da Management</p>
            <p className="text-3xl font-bold text-foreground">€{totalOverrides.toLocaleString()}</p>
            <p className="text-[10px] font-medium mt-2" style={{ color: "#38bdf8" }}>€50 × vendite idonee (dalla 5ª per membro)</p>
          </div>

          {/* Team Members Table */}
          {teamMembers.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="col-span-5">Partner</span><span className="col-span-2 text-center">Vendite</span><span className="col-span-3 text-center">Override</span><span className="col-span-2 text-center">Stato</span>
              </div>
              {teamMembers.map((member) => {
                const memberSalesCount = teamSales.filter((s: any) => s.partner_id === member.partner_id).length;
                const eligibleOverrides = Math.max(0, memberSalesCount - 4);
                return (
                  <div key={member.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="col-span-5 flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(56,189,248,0.1)" }}><Users className="w-3.5 h-3.5" style={{ color: "#38bdf8" }} /></div>
                      <p className="text-xs font-semibold text-foreground truncate">{(member.profiles as any)?.full_name || "Partner"}</p>
                    </div>
                    <p className="col-span-2 text-center text-sm font-bold text-foreground">{memberSalesCount}</p>
                    <p className="col-span-3 text-center text-sm font-bold" style={{ color: "#a78bfa" }}>€{(eligibleOverrides * 50).toLocaleString()}</p>
                    <div className="col-span-2 flex justify-center">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{
                        background: memberSalesCount >= 5 ? "rgba(16,185,129,0.1)" : "transparent",
                        color: memberSalesCount >= 5 ? "#34d399" : "#6b7280"
                      }}>{memberSalesCount >= 5 ? "Attivo" : "🔒"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
