import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Coins, Gift, Search, Plus, Loader2, Check, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CreditRow {
  user_id: string;
  balance: number;
  email: string | null;
  full_name: string | null;
  role: string | null;
}

const QUICK_AMOUNTS = [10, 50, 100, 500, 1000];

/**
 * Pannello Super Admin per regalare/impostare crediti demo a qualunque venditore.
 * Usa la RPC `super_admin_grant_credits` (security definer, bloccata a super admin).
 */
export default function SuperAdminCreditsManager() {
  const [rows, setRows] = useState<CreditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [granting, setGranting] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<Record<string, "add" | "set">>({});

  const load = async () => {
    setLoading(true);
    // Crediti
    const { data: creditsData } = await supabase
      .from("partner_demo_credits" as any)
      .select("user_id, balance")
      .order("balance", { ascending: false });

    const ids = (creditsData as any[] || []).map(c => c.user_id);
    if (!ids.length) {
      setRows([]);
      setLoading(false);
      return;
    }

    // Profili
    const { data: profilesData } = await supabase
      .from("profiles" as any)
      .select("user_id, full_name, email")
      .in("user_id", ids);

    // Ruoli
    const { data: rolesData } = await supabase
      .from("user_roles" as any)
      .select("user_id, role")
      .in("user_id", ids);

    const profMap = new Map<string, any>((profilesData as any[] || []).map(p => [p.user_id, p]));
    const roleMap = new Map<string, string[]>();
    ((rolesData as any[]) || []).forEach(r => {
      const arr = roleMap.get(r.user_id) || [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    });

    const merged: CreditRow[] = (creditsData as any[]).map(c => {
      const p = profMap.get(c.user_id);
      const roles = roleMap.get(c.user_id) || [];
      const primary = roles.includes("super_admin") ? "super_admin"
        : roles.includes("team_leader") ? "team_leader"
        : roles.includes("partner") ? "partner"
        : roles[0] || null;
      return {
        user_id: c.user_id,
        balance: c.balance ?? 0,
        full_name: p?.full_name ?? null,
        email: p?.email ?? null,
        role: primary,
      };
    });

    setRows(merged);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("super-admin-credits")
      .on("postgres_changes", { event: "*", schema: "public", table: "partner_demo_credits" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      (r.email || "").toLowerCase().includes(q) ||
      (r.full_name || "").toLowerCase().includes(q) ||
      r.user_id.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const grant = async (user_id: string, amount: number, m: "add" | "set") => {
    if (!amount || isNaN(amount)) { toast({ title: "Importo non valido", variant: "destructive" }); return; }
    setGranting(user_id);
    const { data, error } = await supabase.rpc("super_admin_grant_credits" as any, {
      p_target_user_id: user_id,
      p_amount: amount,
      p_mode: m,
      p_note: m === "set" ? `Set a ${amount} dal Super Admin` : `Regalo +${amount} dal Super Admin`,
    });
    setGranting(null);
    if (error || !(data as any)?.success) {
      toast({ title: "Errore", description: error?.message || (data as any)?.error || "Operazione fallita", variant: "destructive" });
      return;
    }
    toast({
      title: m === "set" ? "Saldo aggiornato 🎁" : "Crediti regalati 🎁",
      description: `Nuovo saldo: ${(data as any).new_balance} (${(data as any).delta >= 0 ? "+" : ""}${(data as any).delta})`,
    });
    load();
  };

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] via-card to-card p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <Gift className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              Regala Crediti AI <Crown className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-[10px] text-muted-foreground">Solo Super Admin · accredito gratuito a qualsiasi venditore</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-bold text-amber-400">{rows.length} account</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cerca email, nome o user_id…"
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-background/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/40"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-xs text-muted-foreground">Nessun account trovato</div>
      ) : (
        <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
          {filtered.map(r => {
            const m = mode[r.user_id] || "add";
            const amt = customAmount[r.user_id] || "";
            const isGranting = granting === r.user_id;
            return (
              <motion.div
                key={r.user_id}
                layout
                className="rounded-xl border border-border/40 bg-background/40 p-3 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {r.full_name || r.email || r.user_id.slice(0, 8)}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {r.email || "—"} · <span className="capitalize">{r.role || "no role"}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <Coins className="w-3 h-3 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400">{r.balance}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  <div className="inline-flex rounded-lg border border-border/40 overflow-hidden text-[10px]">
                    <button
                      onClick={() => setMode(p => ({ ...p, [r.user_id]: "add" }))}
                      className={`px-2 py-1 ${m === "add" ? "bg-amber-500/20 text-amber-400 font-bold" : "text-muted-foreground"}`}
                    >+ Aggiungi</button>
                    <button
                      onClick={() => setMode(p => ({ ...p, [r.user_id]: "set" }))}
                      className={`px-2 py-1 ${m === "set" ? "bg-amber-500/20 text-amber-400 font-bold" : "text-muted-foreground"}`}
                    >= Imposta</button>
                  </div>
                  {QUICK_AMOUNTS.map(a => (
                    <motion.button
                      key={a}
                      whileTap={{ scale: 0.95 }}
                      disabled={isGranting}
                      onClick={() => grant(r.user_id, a, m)}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 disabled:opacity-50"
                    >
                      {m === "add" ? "+" : "="}{a}
                    </motion.button>
                  ))}
                  <div className="flex items-center gap-1 ml-auto">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={amt}
                      onChange={e => setCustomAmount(p => ({ ...p, [r.user_id]: e.target.value }))}
                      placeholder="custom"
                      className="w-20 px-2 py-1 rounded-lg bg-background border border-border text-[11px] text-foreground placeholder:text-muted-foreground"
                    />
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      disabled={isGranting || !amt}
                      onClick={() => grant(r.user_id, parseInt(amt, 10), m)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500 text-background disabled:opacity-40 flex items-center gap-1"
                    >
                      {isGranting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                      Applica
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1 border-t border-border/40">
        <Check className="w-3 h-3 text-emerald-400" />
        Le operazioni sono registrate nello storico (`demo_credit_usage`) come "Regalo Super Admin".
      </div>
    </div>
  );
}
