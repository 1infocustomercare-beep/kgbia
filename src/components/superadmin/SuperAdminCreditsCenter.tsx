import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins, Gift, Search, Plus, Loader2, Crown, Settings2, History, ShieldAlert,
  Pencil, Save, X, Power, Bell, BellOff, Download, AlertTriangle, Sparkles,
  TrendingDown, Trash2, Check
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Tab = "catalog" | "balances" | "history" | "alerts";

interface ActionCost {
  id: string;
  action: string;
  label: string;
  credit_cost: number;
  cost_eur_estimate: number;
  description: string | null;
  is_active: boolean;
}

interface CreditRow {
  user_id: string;
  balance: number;
  email: string | null;
  full_name: string | null;
  role: string | null;
  monthly_cap: number | null;
  alert_threshold_pct: number | null;
  auto_block_on_cap: boolean;
  notes: string | null;
  used_month?: number;
}

interface UsageRow {
  id: string;
  user_id: string;
  action: string;
  action_label: string | null;
  credits_used: number;
  cost_eur_estimate: number | null;
  metadata: any;
  created_at: string;
  email?: string | null;
  full_name?: string | null;
}

interface AlertRow {
  id: string;
  user_id: string;
  alert_type: string;
  threshold_pct: number | null;
  credits_used_month: number;
  monthly_cap: number | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
  email?: string | null;
  full_name?: string | null;
}

const QUICK_AMOUNTS = [10, 50, 100, 500, 1000];

/**
 * Centro completo gestione crediti AI per Super Admin.
 * 4 tab: Catalogo costi · Saldi & Limiti · Cronologia globale · Alert
 */
export default function SuperAdminCreditsCenter() {
  const [tab, setTab] = useState<Tab>("catalog");

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.05] via-card to-card p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Centro Crediti AI</h3>
            <p className="text-[10px] text-muted-foreground">Catalogo · Saldi · Cronologia · Limiti & Allarmi</p>
          </div>
        </div>
        <div className="flex gap-1 rounded-xl bg-background/40 border border-border/40 p-1">
          {([
            ["catalog", "Catalogo", Settings2],
            ["balances", "Saldi & Limiti", Coins],
            ["history", "Cronologia", History],
            ["alerts", "Alert", ShieldAlert],
          ] as const).map(([k, l, Icon]) => (
            <button
              key={k}
              onClick={() => setTab(k as Tab)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition ${
                tab === k ? "bg-amber-500/20 text-amber-400" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3 h-3" /> {l}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {tab === "catalog" && <CatalogTab />}
          {tab === "balances" && <BalancesTab />}
          {tab === "history" && <HistoryTab />}
          {tab === "alerts" && <AlertsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 1 — Catalogo costi
// ─────────────────────────────────────────────────────────────
function CatalogTab() {
  const [rows, setRows] = useState<ActionCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<ActionCost>>({});
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState<Partial<ActionCost>>({
    action: "", label: "", credit_cost: 1, cost_eur_estimate: 0.05, description: "", is_active: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("seller_action_costs" as any)
      .select("*").order("credit_cost", { ascending: true });
    setRows((data as any[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (r: ActionCost) => { setEditing(r.id); setDraft(r); };
  const cancelEdit = () => { setEditing(null); setDraft({}); };

  const save = async () => {
    if (!editing) return;
    const { error } = await supabase.from("seller_action_costs" as any)
      .update({
        label: draft.label,
        credit_cost: Number(draft.credit_cost),
        cost_eur_estimate: Number(draft.cost_eur_estimate),
        description: draft.description,
        is_active: draft.is_active,
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", editing);
    if (error) { toast({ title: "Errore", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Salvato ✅" });
    cancelEdit(); load();
  };

  const toggleActive = async (r: ActionCost) => {
    const { error } = await supabase.from("seller_action_costs" as any)
      .update({ is_active: !r.is_active } as any).eq("id", r.id);
    if (error) { toast({ title: "Errore", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const remove = async (r: ActionCost) => {
    if (!confirm(`Eliminare l'azione "${r.label}"? Le RPC che la usano falliranno con "unknown_action".`)) return;
    const { error } = await supabase.from("seller_action_costs" as any).delete().eq("id", r.id);
    if (error) { toast({ title: "Errore", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Eliminata" }); load();
  };

  const create = async () => {
    if (!newRow.action || !newRow.label) {
      toast({ title: "Action key e label obbligatori", variant: "destructive" }); return;
    }
    const { error } = await supabase.from("seller_action_costs" as any).insert({
      action: newRow.action!.trim(),
      label: newRow.label!.trim(),
      credit_cost: Number(newRow.credit_cost) || 1,
      cost_eur_estimate: Number(newRow.cost_eur_estimate) || 0,
      description: newRow.description || null,
      is_active: newRow.is_active ?? true,
    } as any);
    if (error) { toast({ title: "Errore", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Azione creata ✅" });
    setAdding(false);
    setNewRow({ action: "", label: "", credit_cost: 1, cost_eur_estimate: 0.05, description: "", is_active: true });
    load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">
          Modifica costi, stato e descrizioni delle azioni AI. Aggiungi nuove voci per estendere il sistema.
        </p>
        <button onClick={() => setAdding(v => !v)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-background text-[11px] font-bold">
          <Plus className="w-3 h-3" /> {adding ? "Annulla" : "Nuova azione"}
        </button>
      </div>

      {adding && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input value={newRow.action || ""} onChange={e => setNewRow(p => ({ ...p, action: e.target.value }))}
              placeholder="action_key (es. send_outreach)" className="px-2 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground" />
            <input value={newRow.label || ""} onChange={e => setNewRow(p => ({ ...p, label: e.target.value }))}
              placeholder="Label visibile (es. Invio Outreach)" className="px-2 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground" />
            <input type="number" value={newRow.credit_cost ?? ""} onChange={e => setNewRow(p => ({ ...p, credit_cost: Number(e.target.value) }))}
              placeholder="Costo crediti" className="px-2 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground" />
            <input type="number" step="0.01" value={newRow.cost_eur_estimate ?? ""} onChange={e => setNewRow(p => ({ ...p, cost_eur_estimate: Number(e.target.value) }))}
              placeholder="Costo reale stimato (€)" className="px-2 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground" />
          </div>
          <input value={newRow.description || ""} onChange={e => setNewRow(p => ({ ...p, description: e.target.value }))}
            placeholder="Descrizione (cosa fa l'azione)" className="w-full px-2 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground" />
          <button onClick={create} className="w-full py-1.5 rounded-lg bg-amber-500 text-background text-xs font-bold flex items-center justify-center gap-1">
            <Check className="w-3 h-3" /> Crea
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="space-y-2">
          {rows.map(r => {
            const isEdit = editing === r.id;
            return (
              <div key={r.id} className={`rounded-xl border p-3 ${r.is_active ? "border-border/40 bg-background/40" : "border-border/30 bg-background/20 opacity-70"}`}>
                {isEdit ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{r.action}</code>
                      <input value={draft.label || ""} onChange={e => setDraft(p => ({ ...p, label: e.target.value }))}
                        className="flex-1 px-2 py-1 rounded bg-background border border-border text-xs text-foreground" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-[10px] text-muted-foreground">Costo crediti
                        <input type="number" value={draft.credit_cost ?? 0} onChange={e => setDraft(p => ({ ...p, credit_cost: Number(e.target.value) }))}
                          className="w-full mt-0.5 px-2 py-1 rounded bg-background border border-border text-xs text-foreground" />
                      </label>
                      <label className="text-[10px] text-muted-foreground">Costo reale (€)
                        <input type="number" step="0.01" value={draft.cost_eur_estimate ?? 0} onChange={e => setDraft(p => ({ ...p, cost_eur_estimate: Number(e.target.value) }))}
                          className="w-full mt-0.5 px-2 py-1 rounded bg-background border border-border text-xs text-foreground" />
                      </label>
                    </div>
                    <input value={draft.description || ""} onChange={e => setDraft(p => ({ ...p, description: e.target.value }))}
                      placeholder="Descrizione" className="w-full px-2 py-1 rounded bg-background border border-border text-xs text-foreground" />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <input type="checkbox" checked={draft.is_active ?? true} onChange={e => setDraft(p => ({ ...p, is_active: e.target.checked }))} />
                        Attiva
                      </label>
                      <div className="flex gap-1">
                        <button onClick={cancelEdit} className="px-2 py-1 rounded bg-muted text-[10px] text-foreground flex items-center gap-1"><X className="w-3 h-3" /> Annulla</button>
                        <button onClick={save} className="px-2 py-1 rounded bg-amber-500 text-background text-[10px] font-bold flex items-center gap-1"><Save className="w-3 h-3" /> Salva</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{r.action}</code>
                        <span className="text-xs font-bold text-foreground">{r.label}</span>
                        {!r.is_active && <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">disattivata</span>}
                      </div>
                      {r.description && <p className="text-[10px] text-muted-foreground mt-0.5">{r.description}</p>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                        <Coins className="w-3 h-3" /> {r.credit_cost}
                      </span>
                      <span className="text-[10px] text-muted-foreground">€{Number(r.cost_eur_estimate).toFixed(2)}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => toggleActive(r)} title={r.is_active ? "Disattiva" : "Attiva"}
                        className="p-1.5 rounded bg-muted/40 hover:bg-muted text-muted-foreground"><Power className="w-3 h-3" /></button>
                      <button onClick={() => startEdit(r)} className="p-1.5 rounded bg-muted/40 hover:bg-muted text-foreground"><Pencil className="w-3 h-3" /></button>
                      <button onClick={() => remove(r)} className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 2 — Saldi & Limiti per utente
// ─────────────────────────────────────────────────────────────
function BalancesTab() {
  const [rows, setRows] = useState<CreditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [granting, setGranting] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<Record<string, "add" | "set">>({});
  const [limitsDraft, setLimitsDraft] = useState<Record<string, Partial<CreditRow>>>({});
  const [savingLimits, setSavingLimits] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    const { data: creditsData } = await supabase
      .from("partner_demo_credits" as any)
      .select("user_id, balance, monthly_cap, alert_threshold_pct, auto_block_on_cap, notes")
      .order("balance", { ascending: false });

    const ids = (creditsData as any[] || []).map(c => c.user_id);
    if (!ids.length) { setRows([]); setLoading(false); return; }

    const [{ data: profs }, { data: roles }] = await Promise.all([
      supabase.from("profiles" as any).select("user_id, full_name, email").in("user_id", ids),
      supabase.from("user_roles" as any).select("user_id, role").in("user_id", ids),
    ]);

    // Calcolo consumo mensile per ciascuno (singola query aggregata client-side)
    const monthStart = new Date();
    monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
    const { data: usage } = await supabase
      .from("demo_credit_usage" as any)
      .select("user_id, credits_used")
      .in("user_id", ids)
      .gte("created_at", monthStart.toISOString());
    const usedMap = new Map<string, number>();
    ((usage as any[]) || []).forEach(u => {
      if ((u.credits_used || 0) > 0)
        usedMap.set(u.user_id, (usedMap.get(u.user_id) || 0) + u.credits_used);
    });

    const profMap = new Map<string, any>((profs as any[] || []).map(p => [p.user_id, p]));
    const roleMap = new Map<string, string[]>();
    ((roles as any[]) || []).forEach(r => {
      const arr = roleMap.get(r.user_id) || []; arr.push(r.role); roleMap.set(r.user_id, arr);
    });

    const merged: CreditRow[] = (creditsData as any[]).map(c => {
      const p = profMap.get(c.user_id);
      const rArr = roleMap.get(c.user_id) || [];
      const primary = rArr.includes("super_admin") ? "super_admin"
        : rArr.includes("team_leader") ? "team_leader"
        : rArr.includes("partner") ? "partner" : rArr[0] || null;
      return {
        user_id: c.user_id, balance: c.balance ?? 0,
        full_name: p?.full_name ?? null, email: p?.email ?? null, role: primary,
        monthly_cap: c.monthly_cap, alert_threshold_pct: c.alert_threshold_pct ?? 80,
        auto_block_on_cap: !!c.auto_block_on_cap, notes: c.notes,
        used_month: usedMap.get(c.user_id) || 0,
      };
    });
    setRows(merged); setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase.channel("super-credits-balances")
      .on("postgres_changes", { event: "*", schema: "public", table: "partner_demo_credits" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

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
      p_target_user_id: user_id, p_amount: amount, p_mode: m,
      p_note: m === "set" ? `Set a ${amount}` : `Regalo +${amount}`,
    });
    setGranting(null);
    if (error || !(data as any)?.success) {
      toast({ title: "Errore", description: error?.message || (data as any)?.error, variant: "destructive" }); return;
    }
    toast({ title: "Saldo aggiornato 🎁", description: `Nuovo saldo: ${(data as any).new_balance}` });
    load();
  };

  const saveLimits = async (user_id: string) => {
    const d = limitsDraft[user_id] || {};
    setSavingLimits(user_id);
    const { data, error } = await supabase.rpc("super_admin_set_credit_limits" as any, {
      p_target_user_id: user_id,
      p_monthly_cap: d.monthly_cap === undefined ? null : (d.monthly_cap === null || d.monthly_cap as any === "" ? null : Number(d.monthly_cap)),
      p_alert_threshold_pct: d.alert_threshold_pct === undefined ? null : Number(d.alert_threshold_pct),
      p_auto_block: d.auto_block_on_cap === undefined ? null : !!d.auto_block_on_cap,
      p_notes: d.notes === undefined ? null : d.notes,
    });
    setSavingLimits(null);
    if (error || !(data as any)?.success) {
      toast({ title: "Errore", description: error?.message || (data as any)?.error, variant: "destructive" }); return;
    }
    toast({ title: "Limiti aggiornati ✅" });
    setLimitsDraft(p => { const n = { ...p }; delete n[user_id]; return n; });
    load();
  };

  const toggleExpand = (id: string) => {
    setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cerca email, nome o user_id…"
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-background/50 border border-border text-sm text-foreground" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
          {filtered.map(r => {
            const m = mode[r.user_id] || "add";
            const amt = customAmount[r.user_id] || "";
            const isOpen = expanded.has(r.user_id);
            const draft = limitsDraft[r.user_id] || {};
            const cap = (draft.monthly_cap !== undefined ? draft.monthly_cap : r.monthly_cap) as number | null;
            const thr = (draft.alert_threshold_pct !== undefined ? draft.alert_threshold_pct : r.alert_threshold_pct) as number | null;
            const block = draft.auto_block_on_cap !== undefined ? draft.auto_block_on_cap : r.auto_block_on_cap;
            const notes = draft.notes !== undefined ? draft.notes : r.notes;
            const pct = cap && cap > 0 ? Math.min(100, Math.round(((r.used_month || 0) * 100) / cap)) : 0;
            const overThr = cap && thr ? pct >= thr : false;

            return (
              <div key={r.user_id} className="rounded-xl border border-border/40 bg-background/40 p-3 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">{r.full_name || r.email || r.user_id.slice(0, 8)}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{r.email || "—"} · <span className="capitalize">{r.role || "no role"}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cap && cap > 0 && (
                      <div className="flex items-center gap-1 text-[10px]">
                        <span className={overThr ? "text-red-400" : "text-muted-foreground"}>{r.used_month || 0}/{cap}</span>
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full ${overThr ? "bg-red-400" : "bg-amber-400"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                      <Coins className="w-3 h-3 text-amber-400" />
                      <span className="text-xs font-bold text-amber-400">{r.balance}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  <div className="inline-flex rounded-lg border border-border/40 overflow-hidden text-[10px]">
                    <button onClick={() => setMode(p => ({ ...p, [r.user_id]: "add" }))}
                      className={`px-2 py-1 ${m === "add" ? "bg-amber-500/20 text-amber-400 font-bold" : "text-muted-foreground"}`}>+ Aggiungi</button>
                    <button onClick={() => setMode(p => ({ ...p, [r.user_id]: "set" }))}
                      className={`px-2 py-1 ${m === "set" ? "bg-amber-500/20 text-amber-400 font-bold" : "text-muted-foreground"}`}>= Imposta</button>
                  </div>
                  {QUICK_AMOUNTS.map(a => (
                    <button key={a} disabled={granting === r.user_id} onClick={() => grant(r.user_id, a, m)}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 disabled:opacity-50">
                      {m === "add" ? "+" : "="}{a}
                    </button>
                  ))}
                  <input type="number" value={amt} onChange={e => setCustomAmount(p => ({ ...p, [r.user_id]: e.target.value }))}
                    placeholder="custom" className="w-20 px-2 py-1 rounded-lg bg-background border border-border text-[11px] text-foreground" />
                  <button disabled={granting === r.user_id || !amt} onClick={() => grant(r.user_id, parseInt(amt, 10), m)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500 text-background disabled:opacity-40 flex items-center gap-1">
                    {granting === r.user_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />} Applica
                  </button>
                  <button onClick={() => toggleExpand(r.user_id)}
                    className="ml-auto px-2 py-1 rounded-lg text-[10px] font-semibold bg-muted/40 hover:bg-muted text-foreground flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Limiti
                  </button>
                </div>

                {isOpen && (
                  <div className="rounded-lg border border-border/30 bg-background/30 p-2.5 space-y-2 mt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-[10px] text-muted-foreground">
                        Tetto mensile (crediti) <span className="opacity-60">— vuoto = nessun limite</span>
                        <input type="number" value={cap ?? ""} onChange={e => setLimitsDraft(p => ({ ...p, [r.user_id]: { ...p[r.user_id], monthly_cap: e.target.value === "" ? null : Number(e.target.value) } }))}
                          className="w-full mt-0.5 px-2 py-1 rounded bg-background border border-border text-xs text-foreground" />
                      </label>
                      <label className="text-[10px] text-muted-foreground">
                        Soglia alert (%)
                        <input type="number" min={1} max={100} value={thr ?? 80} onChange={e => setLimitsDraft(p => ({ ...p, [r.user_id]: { ...p[r.user_id], alert_threshold_pct: Number(e.target.value) } }))}
                          className="w-full mt-0.5 px-2 py-1 rounded bg-background border border-border text-xs text-foreground" />
                      </label>
                    </div>
                    <label className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <input type="checkbox" checked={!!block} onChange={e => setLimitsDraft(p => ({ ...p, [r.user_id]: { ...p[r.user_id], auto_block_on_cap: e.target.checked } }))} />
                      Blocca automaticamente quando supera il tetto mensile
                    </label>
                    <textarea value={notes || ""} onChange={e => setLimitsDraft(p => ({ ...p, [r.user_id]: { ...p[r.user_id], notes: e.target.value } }))}
                      placeholder="Note interne (visibili solo al super admin)" rows={2}
                      className="w-full px-2 py-1 rounded bg-background border border-border text-xs text-foreground resize-none" />
                    <button disabled={savingLimits === r.user_id} onClick={() => saveLimits(r.user_id)}
                      className="w-full py-1.5 rounded-lg bg-amber-500 text-background text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-1">
                      {savingLimits === r.user_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Salva limiti
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 3 — Cronologia globale + export CSV
// ─────────────────────────────────────────────────────────────
function HistoryTab() {
  const [rows, setRows] = useState<UsageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const since = new Date(); since.setDate(since.getDate() - days);
    const { data } = await supabase.from("demo_credit_usage" as any)
      .select("id, user_id, action, action_label, credits_used, cost_eur_estimate, metadata, created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false })
      .limit(1000);
    const ids = Array.from(new Set(((data as any[]) || []).map(d => d.user_id)));
    const { data: profs } = ids.length
      ? await supabase.from("profiles" as any).select("user_id, full_name, email").in("user_id", ids)
      : { data: [] as any[] };
    const pm = new Map<string, any>((profs as any[] || []).map(p => [p.user_id, p]));
    setRows(((data as any[]) || []).map(d => ({
      ...d, email: pm.get(d.user_id)?.email, full_name: pm.get(d.user_id)?.full_name,
    })));
    setLoading(false);
  }, [days]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      (r.email || "").toLowerCase().includes(q) ||
      (r.full_name || "").toLowerCase().includes(q) ||
      r.action.toLowerCase().includes(q) ||
      (r.action_label || "").toLowerCase().includes(q)
    );
  }, [rows, search]);

  const totals = useMemo(() => {
    let c = 0, e = 0;
    filtered.forEach(r => { if (r.credits_used > 0) { c += r.credits_used; e += r.cost_eur_estimate || 0; } });
    return { credits: c, eur: e, count: filtered.length };
  }, [filtered]);

  const exportCsv = () => {
    const header = "data,utente,email,azione,label,crediti,costo_eur\n";
    const body = filtered.map(r =>
      [r.created_at, r.full_name || "", r.email || "", r.action, r.action_label || "", r.credits_used, (r.cost_eur_estimate || 0).toFixed(4)]
        .map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `credits-usage-${days}d.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Operazioni" value={totals.count.toString()} icon={History} />
        <Stat label="Crediti spesi" value={totals.credits.toString()} icon={Coins} accent />
        <Stat label="Costo reale (€)" value={totals.eur.toFixed(2)} icon={TrendingDown} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filtra per utente o azione…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-background/50 border border-border text-xs text-foreground" />
        </div>
        <select value={days} onChange={e => setDays(Number(e.target.value))}
          className="px-2 py-2 rounded-lg bg-background border border-border text-xs text-foreground">
          <option value={1}>Oggi</option>
          <option value={7}>7 giorni</option>
          <option value={30}>30 giorni</option>
          <option value={90}>90 giorni</option>
          <option value={365}>1 anno</option>
        </select>
        <button onClick={exportCsv} className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1">
          <Download className="w-3 h-3" /> CSV
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-10">Nessuna operazione</p>
      ) : (
        <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
          {filtered.map(r => {
            const meta = r.metadata as any;
            const ctx = meta?.lead_name ? ` · ${meta.lead_name}` : "";
            const isBypass = !!meta?.owner_bypass;
            const isGrant = r.action === "super_admin_grant";
            return (
              <div key={r.id} className="flex items-center gap-2 p-2 rounded-lg bg-background/30 hover:bg-background/50 transition text-[11px]">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {r.full_name || r.email || r.user_id.slice(0, 8)} <span className="text-muted-foreground font-normal">→ {r.action_label || r.action}{ctx}</span>
                  </p>
                  <p className="text-[9px] text-muted-foreground">{new Date(r.created_at).toLocaleString("it-IT")}</p>
                </div>
                <div className="text-right">
                  {isBypass ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">OWNER ∞</span>
                  ) : isGrant ? (
                    <span className="text-[10px] font-bold text-emerald-400">+{Math.abs(r.credits_used)}</span>
                  ) : (
                    <>
                      <div className="text-[10px] font-bold text-amber-400">-{r.credits_used}</div>
                      <div className="text-[9px] text-muted-foreground">€{(r.cost_eur_estimate || 0).toFixed(2)}</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TAB 4 — Alert
// ─────────────────────────────────────────────────────────────
function AlertsTab() {
  const [rows, setRows] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("seller_credit_alerts" as any)
      .select("*").order("created_at", { ascending: false }).limit(200);
    if (unreadOnly) q = q.eq("is_read", false);
    const { data } = await q;
    const ids = Array.from(new Set(((data as any[]) || []).map(d => d.user_id)));
    const { data: profs } = ids.length
      ? await supabase.from("profiles" as any).select("user_id, full_name, email").in("user_id", ids)
      : { data: [] as any[] };
    const pm = new Map<string, any>((profs as any[] || []).map(p => [p.user_id, p]));
    setRows(((data as any[]) || []).map(d => ({ ...d, email: pm.get(d.user_id)?.email, full_name: pm.get(d.user_id)?.full_name })));
    setLoading(false);
  }, [unreadOnly]);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    await supabase.from("seller_credit_alerts" as any).update({ is_read: true } as any).eq("id", id);
    load();
  };
  const markAllRead = async () => {
    await supabase.from("seller_credit_alerts" as any).update({ is_read: true } as any).eq("is_read", false);
    toast({ title: "Tutti gli alert segnati come letti" }); load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <input type="checkbox" checked={unreadOnly} onChange={e => setUnreadOnly(e.target.checked)} />
          Solo non letti
        </label>
        <button onClick={markAllRead} className="px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-muted text-xs text-foreground flex items-center gap-1">
          <BellOff className="w-3 h-3" /> Segna tutti letti
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : rows.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-10">Nessun alert</p>
      ) : (
        <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
          {rows.map(a => {
            const isCap = a.alert_type === "cap_exceeded";
            return (
              <div key={a.id} className={`flex items-center gap-2 p-2.5 rounded-lg border ${a.is_read ? "border-border/30 bg-background/20 opacity-70" : isCap ? "border-red-500/40 bg-red-500/5" : "border-amber-500/40 bg-amber-500/5"}`}>
                {isCap ? <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" /> : <Bell className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-foreground truncate">
                    {a.full_name || a.email || a.user_id.slice(0, 8)}
                    <span className="ml-2 text-[9px] uppercase tracking-wider text-muted-foreground">{a.alert_type.replace("_", " ")}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground">{a.message}</p>
                  <p className="text-[9px] text-muted-foreground/70">{new Date(a.created_at).toLocaleString("it-IT")}</p>
                </div>
                {!a.is_read && (
                  <button onClick={() => markRead(a.id)} className="p-1.5 rounded bg-muted/40 hover:bg-muted text-muted-foreground"><Check className="w-3 h-3" /></button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function Stat({ label, value, icon: Icon, accent }: { label: string; value: string; icon: any; accent?: boolean }) {
  return (
    <div className={`p-2.5 rounded-xl border ${accent ? "border-amber-500/30 bg-amber-500/5" : "border-border/40 bg-background/30"}`}>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><Icon className="w-3 h-3" /> {label}</div>
      <div className={`text-base font-bold mt-0.5 ${accent ? "text-amber-400" : "text-foreground"}`}>{value}</div>
    </div>
  );
}
