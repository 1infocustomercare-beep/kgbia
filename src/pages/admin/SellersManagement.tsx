import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SellersManagement() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [defaultPct, setDefaultPct] = useState(15);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [{ data: s }, { data: c }, { data: ps }] = await Promise.all([
      supabase.from("sellers").select("*").order("created_at", { ascending: false }),
      supabase.from("seller_commissions").select("*").order("created_at", { ascending: false }),
      supabase.from("platform_settings").select("*").eq("key", "default_commission_pct").maybeSingle(),
    ]);
    setSellers(s || []);
    setCommissions(c || []);
    if (ps?.value != null) setDefaultPct(Number(ps.value));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updatePct = async (id: string, pct: number) => {
    const { error } = await supabase.from("sellers").update({ commission_pct: pct }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Aggiornato");
    load();
  };
  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from("sellers").update({ active }).eq("id", id);
    load();
  };
  const markPaid = async (id: string) => {
    await supabase.from("seller_commissions").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", id);
    toast.success("Segnata come pagata");
    load();
  };
  const saveDefaultPct = async () => {
    await supabase.from("platform_settings").upsert({ key: "default_commission_pct", value: defaultPct as any });
    toast.success("Default salvato");
  };

  if (loading) return <div className="p-8 text-white bg-[#11141a] min-h-screen">Caricamento...</div>;

  return (
    <div className="min-h-screen bg-[#11141a] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Gestione Venditori</h1>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
          <span className="text-sm">Commissione default per nuovi venditori:</span>
          <input
            type="number"
            value={defaultPct}
            onChange={e => setDefaultPct(Number(e.target.value))}
            className="w-20 h-9 px-2 rounded bg-white text-black"
          />
          <span>%</span>
          <button onClick={saveDefaultPct} className="h-9 px-3 rounded bg-amber-500 text-black text-sm font-semibold">Salva</button>
        </div>

        <section>
          <h2 className="font-bold mb-2">Venditori</h2>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/10 text-xs uppercase">
                <tr>
                  <th className="text-left p-3">Nome</th>
                  <th className="text-left p-3">Slug</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-center p-3">% Commissione</th>
                  <th className="text-center p-3">Attivo</th>
                </tr>
              </thead>
              <tbody>
                {sellers.length === 0 && <tr><td colSpan={5} className="p-6 text-center opacity-60">Nessun venditore</td></tr>}
                {sellers.map(s => (
                  <tr key={s.id} className="border-t border-white/5">
                    <td className="p-3">{s.display_name}</td>
                    <td className="p-3 font-mono text-xs">{s.slug}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        defaultValue={s.commission_pct}
                        onBlur={e => updatePct(s.id, Number(e.target.value))}
                        className="w-16 h-8 px-2 rounded bg-white text-black text-center"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input type="checkbox" checked={s.active} onChange={e => toggleActive(s.id, e.target.checked)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-2">Commissioni</h2>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/10 text-xs uppercase">
                <tr>
                  <th className="text-left p-3">Data</th>
                  <th className="text-left p-3">Venditore</th>
                  <th className="text-left p-3">Fonte</th>
                  <th className="text-right p-3">Importo</th>
                  <th className="text-center p-3">Stato</th>
                  <th className="text-center p-3">Azione</th>
                </tr>
              </thead>
              <tbody>
                {commissions.length === 0 && <tr><td colSpan={6} className="p-6 text-center opacity-60">Nessuna commissione</td></tr>}
                {commissions.map(c => {
                  const seller = sellers.find(s => s.id === c.seller_id);
                  return (
                    <tr key={c.id} className="border-t border-white/5">
                      <td className="p-3 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="p-3">{seller?.display_name || c.seller_id}</td>
                      <td className="p-3">{c.source_type}</td>
                      <td className="p-3 text-right font-mono">€{Number(c.commission_amount).toFixed(2)}</td>
                      <td className="p-3 text-center"><span className="px-2 py-0.5 rounded-full text-xs bg-white/10">{c.status}</span></td>
                      <td className="p-3 text-center">
                        {c.status !== "paid" && (
                          <button onClick={() => markPaid(c.id)} className="text-xs px-2 py-1 rounded bg-emerald-500 text-black font-semibold">
                            Segna pagata
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
