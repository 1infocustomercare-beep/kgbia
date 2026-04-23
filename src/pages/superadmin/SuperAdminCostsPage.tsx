import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, DollarSign, Coins, Zap, Server, Building2, Users,
  Pencil, Save, X, Plus, Download, History, AlertTriangle, Wifi, Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSuperAdminCosts } from "@/hooks/useSuperAdminCosts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/exportCsv";

type Tab = "listino" | "consumi" | "infrastruttura" | "audit";

const CAT_META: Record<string, { label: string; icon: any; color: string }> = {
  ai_gateway: { label: "AI Gateway", icon: Zap, color: "text-violet-400" },
  external_api: { label: "API esterne", icon: Wifi, color: "text-cyan-400" },
  payments: { label: "Pagamenti", icon: DollarSign, color: "text-emerald-400" },
  storage: { label: "Storage / Bandwidth", icon: Database, color: "text-amber-400" },
  infra: { label: "Infrastruttura", icon: Server, color: "text-rose-400" },
  other: { label: "Altro", icon: Server, color: "text-muted-foreground" },
};

export default function SuperAdminCostsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("listino");
  const [period, setPeriod] = useState<7 | 30 | 90>(30);
  const data = useSuperAdminCosts(period);

  // Filtri tab Consumi
  const [filterSector, setFilterSector] = useState("");
  const [filterSeller, setFilterSeller] = useState("");

  // Inline editing — kind: numeric | text
  const [editing, setEditing] = useState<{ id: string; field: string; value: string; kind?: "num" | "text" } | null>(null);

  const startEdit = (id: string, field: string, value: any, kind: "num" | "text" = "num") =>
    setEditing({ id, field, value: String(value ?? ""), kind });

  const NUMERIC_FIELDS = new Set(["credit_cost", "cost_eur_estimate", "unit_cost_eur", "monthly_estimate_eur"]);

  const saveSellerCost = async () => {
    if (!editing) return;
    const isNum = NUMERIC_FIELDS.has(editing.field);
    let payload: any;
    if (isNum) {
      const num = Number(editing.value);
      if (Number.isNaN(num)) { toast({ title: "Valore non valido", variant: "destructive" }); return; }
      payload = { [editing.field]: num };
    } else {
      payload = { [editing.field]: editing.value.trim() || null };
    }
    const { error } = await supabase
      .from("seller_action_costs")
      .update(payload)
      .eq("id", editing.id);
    if (error) toast({ title: "Errore", description: error.message, variant: "destructive" });
    else { toast({ title: "Aggiornato ✓", description: "Modifica registrata nell'audit" }); data.refetch(); }
    setEditing(null);
  };

  const saveInfraCost = async () => {
    if (!editing) return;
    const isNum = NUMERIC_FIELDS.has(editing.field);
    let payload: any;
    if (isNum) {
      const num = Number(editing.value);
      if (Number.isNaN(num)) { toast({ title: "Valore non valido", variant: "destructive" }); return; }
      payload = { [editing.field]: num };
    } else {
      payload = { [editing.field]: editing.value.trim() || null };
    }
    const { error } = await supabase
      .from("infrastructure_costs" as any)
      .update(payload)
      .eq("id", editing.id);
    if (error) toast({ title: "Errore", description: error.message, variant: "destructive" });
    else { toast({ title: "Aggiornato ✓", description: "Modifica registrata nell'audit" }); data.refetch(); }
    setEditing(null);
  };

  const SELLER_CATEGORIES = ["ai", "scraping", "outreach", "voice", "media", "other"];
  const INFRA_CATEGORIES = ["ai_gateway", "external_api", "payments", "storage", "infra", "other"];

  const toggleSellerActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("seller_action_costs").update({ is_active: !current }).eq("id", id);
    if (error) toast({ title: "Errore", variant: "destructive" });
    else data.refetch();
  };
  const toggleInfraActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("infrastructure_costs" as any).update({ is_active: !current }).eq("id", id);
    if (error) toast({ title: "Errore", variant: "destructive" });
    else data.refetch();
  };

  const filteredSellers = useMemo(() => {
    return data.perSeller.filter(s =>
      !filterSeller || s.name.toLowerCase().includes(filterSeller.toLowerCase())
    );
  }, [data.perSeller, filterSeller]);

  const filteredSectors = useMemo(() => {
    return data.perSector.filter(s =>
      !filterSector || s.sector.toLowerCase().includes(filterSector.toLowerCase())
    );
  }, [data.perSector, filterSector]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-background/85 border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <button onClick={() => navigate("/superadmin")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Super Admin
          </button>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold">Costi Empire</h1>
          </div>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-4 space-y-4">
        {/* ===== Executive KPI Dashboard ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <KpiCard icon={Coins} label="Spesa venditori (€)" value={`€${data.totals.sellerEur.toFixed(2)}`} sub={`${data.totals.credits} crediti`} color="text-amber-400" />
          <KpiCard icon={Zap} label="AI Gateway (€)" value={`€${data.totals.aiEur.toFixed(2)}`} sub={`${(data.totals.aiTokens / 1000).toFixed(1)}K token`} color="text-violet-400" />
          <KpiCard icon={Server} label="Infrastruttura (€/mese)" value={`€${data.totals.infraMonthly.toFixed(2)}`} sub="stima fissa" color="text-rose-400" />
          <KpiCard icon={DollarSign} label="TOTALE periodo" value={`€${data.totals.grandTotal.toFixed(2)}`} sub={`ultimi ${period}g`} color="text-emerald-400" highlight />
        </div>

        {/* Period selector */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex bg-card border border-border/50 rounded-xl p-0.5">
            {([7, 30, 90] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs rounded-lg transition ${period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {p}g
              </button>
            ))}
          </div>
          <div className="text-[10px] text-muted-foreground italic">
            Tutti i prezzi modificabili solo dal Super Admin · ogni cambio loggato
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          <TabBtn active={tab === "listino"} onClick={() => setTab("listino")} icon={Coins} label="Listino azioni" />
          <TabBtn active={tab === "consumi"} onClick={() => setTab("consumi")} icon={Users} label="Consumi" />
          <TabBtn active={tab === "infrastruttura"} onClick={() => setTab("infrastruttura")} icon={Server} label="Infrastruttura" />
          <TabBtn active={tab === "audit"} onClick={() => setTab("audit")} icon={History} label="Audit" />
        </div>

        {data.loading && <div className="text-center py-12 text-sm text-muted-foreground">Caricamento…</div>}

        {/* ===== TAB: LISTINO AZIONI VENDITORI ===== */}
        {!data.loading && tab === "listino" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Listino Azioni AI Venditori ({data.sellerCosts.length})</h3>
              <Button size="sm" variant="outline" onClick={() => exportToCSV(data.sellerCosts as any, "listino-azioni-venditore")}>
                <Download className="w-3.5 h-3.5 mr-1.5" /> CSV
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              💡 Clicca su qualsiasi campo (etichetta, categoria, descrizione, crediti, costo) per modificarlo. Ogni cambio è registrato nell'audit storico.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border/50 bg-card">
              <table className="w-full text-xs">
                <thead className="bg-muted/30 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left p-2.5 min-w-[200px]">Etichetta · Codice</th>
                    <th className="text-left p-2.5">Categoria</th>
                    <th className="text-left p-2.5 min-w-[180px]">Descrizione</th>
                    <th className="text-right p-2.5">Crediti</th>
                    <th className="text-right p-2.5">Costo €</th>
                    <th className="text-center p-2.5">Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sellerCosts.map((c: any) => (
                    <tr key={c.id} className="border-t border-border/30 hover:bg-muted/20 align-top">
                      <td className="p-2.5">
                        <EditableText editing={editing} id={c.id} field="label" value={c.label}
                          onStart={() => startEdit(c.id, "label", c.label, "text")}
                          onChange={v => setEditing({ id: c.id, field: "label", value: v, kind: "text" })}
                          onSave={saveSellerCost} onCancel={() => setEditing(null)}
                          className="font-semibold text-foreground" placeholder="Etichetta…" />
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{c.action}</div>
                      </td>
                      <td className="p-2.5">
                        <EditableSelect editing={editing} id={c.id} field="category" value={c.category || "ai"}
                          options={SELLER_CATEGORIES}
                          onStart={() => startEdit(c.id, "category", c.category || "ai", "text")}
                          onChange={v => setEditing({ id: c.id, field: "category", value: v, kind: "text" })}
                          onSave={saveSellerCost} onCancel={() => setEditing(null)} />
                      </td>
                      <td className="p-2.5">
                        <EditableText editing={editing} id={c.id} field="description" value={c.description || ""}
                          onStart={() => startEdit(c.id, "description", c.description, "text")}
                          onChange={v => setEditing({ id: c.id, field: "description", value: v, kind: "text" })}
                          onSave={saveSellerCost} onCancel={() => setEditing(null)}
                          className="text-[11px] text-muted-foreground italic"
                          placeholder="Aggiungi nota…" multiline />
                      </td>
                      <td className="p-2.5 text-right whitespace-nowrap">
                        <EditableNumber editing={editing} id={c.id} field="credit_cost" value={c.credit_cost}
                          onStart={() => startEdit(c.id, "credit_cost", c.credit_cost)}
                          onChange={v => setEditing({ id: c.id, field: "credit_cost", value: v, kind: "num" })}
                          onSave={saveSellerCost} onCancel={() => setEditing(null)}
                          format={v => <span className="font-bold text-amber-400">{v}</span>} step="1" />
                      </td>
                      <td className="p-2.5 text-right whitespace-nowrap">
                        <EditableNumber editing={editing} id={c.id} field="cost_eur_estimate" value={c.cost_eur_estimate}
                          onStart={() => startEdit(c.id, "cost_eur_estimate", c.cost_eur_estimate)}
                          onChange={v => setEditing({ id: c.id, field: "cost_eur_estimate", value: v, kind: "num" })}
                          onSave={saveSellerCost} onCancel={() => setEditing(null)}
                          format={v => <span className="text-emerald-400">€{Number(v).toFixed(4)}</span>} step="0.0001" />
                      </td>
                      <td className="p-2.5 text-center">
                        <button onClick={() => toggleSellerActive(c.id, c.is_active)}>
                          <Badge variant={c.is_active ? "default" : "outline"} className="text-[9px] cursor-pointer">
                            {c.is_active ? "ON" : "OFF"}
                          </Badge>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ===== TAB: CONSUMI ===== */}
        {!data.loading && tab === "consumi" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Per Settore */}
            <Section title={`Costi per settore cliente (${data.perSector.length})`} icon={Building2}
              extra={
                <div className="flex items-center gap-2">
                  <Input placeholder="Filtra settore…" value={filterSector} onChange={e => setFilterSector(e.target.value)} className="h-7 text-xs w-32" />
                  <Button size="sm" variant="outline" onClick={() => exportToCSV(filteredSectors, `consumi-settori-${period}g`)}>
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              }>
              <div className="space-y-1">
                {filteredSectors.map(s => {
                  const max = filteredSectors[0]?.eur || 1;
                  const pct = Math.min(100, Math.round((s.eur / max) * 100));
                  return (
                    <div key={s.sector} className="relative p-2.5 rounded-xl bg-card border border-border/40 overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-primary/10" style={{ width: `${pct}%` }} />
                      <div className="relative flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-foreground capitalize">{s.sector}</div>
                          <div className="text-[10px] text-muted-foreground">{s.tenants} tenant · {s.calls} chiamate AI · {(s.tokens / 1000).toFixed(1)}K token</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-400">€{s.eur.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredSectors.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Nessun consumo registrato</p>}
              </div>
            </Section>

            {/* Per Venditore */}
            <Section title={`Spesa per venditore (${data.perSeller.length})`} icon={Users}
              extra={
                <div className="flex items-center gap-2">
                  <Input placeholder="Filtra venditore…" value={filterSeller} onChange={e => setFilterSeller(e.target.value)} className="h-7 text-xs w-32" />
                  <Button size="sm" variant="outline" onClick={() => exportToCSV(filteredSellers, `consumi-venditori-${period}g`)}>
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              }>
              <div className="space-y-1">
                {filteredSellers.map((s, i) => (
                  <div key={s.user_id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-card border border-border/40">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-[10px] font-mono text-muted-foreground w-5">#{i + 1}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">{s.name}</div>
                        <div className="text-[10px] text-muted-foreground">{s.actions} azioni · {s.credits} crediti</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-amber-400">€{s.eur.toFixed(2)}</div>
                  </div>
                ))}
                {filteredSellers.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Nessuna spesa</p>}
              </div>
            </Section>

            {/* Per Azione */}
            <Section title={`Top azioni AI consumate (${data.perAction.length})`} icon={Zap}
              extra={
                <Button size="sm" variant="outline" onClick={() => exportToCSV(data.perAction, `consumi-azioni-${period}g`)}>
                  <Download className="w-3.5 h-3.5" />
                </Button>
              }>
              <div className="space-y-1">
                {data.perAction.slice(0, 20).map(a => (
                  <div key={a.action} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-card border border-border/40">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold truncate">{a.label}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{a.action} · {a.count}x</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-amber-400">{a.credits} cr</div>
                      <div className="text-[10px] text-emerald-400">€{a.eur.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </motion.div>
        )}

        {/* ===== TAB: INFRASTRUTTURA ===== */}
        {!data.loading && tab === "infrastruttura" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Costi Infrastruttura ({data.infraCosts.length})</h3>
              <Button size="sm" variant="outline" onClick={() => exportToCSV(data.infraCosts as any, "costi-infrastruttura")}>
                <Download className="w-3.5 h-3.5 mr-1.5" /> CSV
              </Button>
            </div>

            {Object.keys(CAT_META).map(catKey => {
              const items = data.infraCosts.filter((c: any) => c.category === catKey);
              if (!items.length) return null;
              const meta = CAT_META[catKey];
              const Icon = meta.icon;
              return (
                <div key={catKey} className="rounded-2xl bg-card border border-border/50 overflow-hidden">
                  <div className="flex items-center gap-2 p-3 bg-muted/30 border-b border-border/30">
                    <Icon className={`w-4 h-4 ${meta.color}`} />
                    <h4 className="text-xs font-bold uppercase tracking-wider">{meta.label}</h4>
                    <Badge variant="outline" className="ml-auto text-[10px]">{items.length}</Badge>
                  </div>
                  <div className="divide-y divide-border/30">
                    {items.map((c: any) => (
                      <div key={c.id} className="p-3 grid grid-cols-12 gap-2 items-center text-xs">
                        <div className="col-span-5">
                          <div className="font-semibold">{c.label}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{c.code}</div>
                          {c.notes && <div className="text-[10px] text-muted-foreground italic mt-0.5">{c.notes}</div>}
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="text-[9px] text-muted-foreground uppercase">{c.cost_model}</div>
                          <div className="text-[10px] text-muted-foreground">{c.unit}</div>
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="text-[9px] text-muted-foreground uppercase">€/unità</div>
                          <EditableNumber editing={editing} id={c.id} field="unit_cost_eur" value={c.unit_cost_eur}
                            onStart={() => startEdit(c.id, "unit_cost_eur", c.unit_cost_eur)}
                            onChange={v => setEditing({ id: c.id, field: "unit_cost_eur", value: v })}
                            onSave={saveInfraCost} onCancel={() => setEditing(null)}
                            format={v => <span className="text-violet-400 font-bold">€{Number(v).toFixed(4)}</span>} step="0.0001" />
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="text-[9px] text-muted-foreground uppercase">€/mese</div>
                          <EditableNumber editing={editing} id={c.id} field="monthly_estimate_eur" value={c.monthly_estimate_eur}
                            onStart={() => startEdit(c.id, "monthly_estimate_eur", c.monthly_estimate_eur)}
                            onChange={v => setEditing({ id: c.id, field: "monthly_estimate_eur", value: v })}
                            onSave={saveInfraCost} onCancel={() => setEditing(null)}
                            format={v => <span className="text-emerald-400 font-bold">€{Number(v).toFixed(2)}</span>} step="0.01" />
                        </div>
                        <div className="col-span-1 text-right">
                          <button onClick={() => toggleInfraActive(c.id, c.is_active)}>
                            <Badge variant={c.is_active ? "default" : "outline"} className="text-[9px] cursor-pointer">
                              {c.is_active ? "ON" : "OFF"}
                            </Badge>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ===== TAB: AUDIT ===== */}
        {!data.loading && tab === "audit" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <History className="w-4 h-4" /> Cronologia modifiche prezzi ({data.audit.length})
              </h3>
              <Button size="sm" variant="outline" onClick={() => exportToCSV(data.audit, "audit-costi")}>
                <Download className="w-3.5 h-3.5 mr-1.5" /> CSV
              </Button>
            </div>
            {data.audit.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">Nessuna modifica registrata</p>
            ) : (
              <div className="space-y-1">
                {data.audit.map((a: any) => (
                  <div key={a.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-card border border-border/40 text-xs">
                    <Pencil className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">
                        <span className="text-muted-foreground">{a.table_name}</span> · {a.action_code || "—"} · <span className="text-violet-400">{a.field_changed}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(a.changed_at).toLocaleString("it-IT")}
                      </div>
                    </div>
                    <div className="text-right text-[10px]">
                      <div className="text-rose-400 line-through">{a.old_value}</div>
                      <div className="text-emerald-400 font-bold">{a.new_value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ===== Sub-components ===== */
function KpiCard({ icon: Icon, label, value, sub, color, highlight }: any) {
  return (
    <div className={`p-3 rounded-2xl border ${highlight ? "bg-gradient-to-br from-emerald-500/10 to-card border-emerald-500/30" : "bg-card border-border/50"}`}>
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase">
        <Icon className={`w-3 h-3 ${color}`} /> {label}
      </div>
      <div className={`text-lg md:text-xl font-bold mt-1 ${color}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, label }: any) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
        active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground border border-border/40"
      }`}>
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}

function Section({ title, icon: Icon, extra, children }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-primary" /> {title}
        </h4>
        {extra}
      </div>
      {children}
    </div>
  );
}

function EditableNumber({ editing, id, field, value, onStart, onChange, onSave, onCancel, format, step }: any) {
  const isEditing = editing?.id === id && editing?.field === field;
  if (isEditing) {
    return (
      <div className="inline-flex items-center gap-1">
        <Input type="number" step={step} value={editing.value} onChange={e => onChange(e.target.value)}
          className="h-6 w-20 text-xs text-right" autoFocus
          onKeyDown={e => { if (e.key === "Enter") onSave(); if (e.key === "Escape") onCancel(); }} />
        <button onClick={onSave} className="p-0.5 text-emerald-400 hover:text-emerald-300"><Save className="w-3 h-3" /></button>
        <button onClick={onCancel} className="p-0.5 text-rose-400 hover:text-rose-300"><X className="w-3 h-3" /></button>
      </div>
    );
  }
  return (
    <button onClick={onStart} className="inline-flex items-center gap-1 hover:opacity-70 transition group">
      {format(value)}
      <Pencil className="w-2.5 h-2.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
    </button>
  );
}
