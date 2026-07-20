import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"];

export default function CustomBriefsInbox() {
  const [briefs, setBriefs] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("custom_project_briefs").select("*").order("created_at", { ascending: false });
    setBriefs(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string, extra: any = {}) => {
    const patch: any = { status, ...extra };
    const { error } = await supabase.from("custom_project_briefs").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Aggiornato");
    load();
  };

  if (loading) return <div className="p-8 text-white bg-[#11141a] min-h-screen">Caricamento...</div>;

  return (
    <div className="min-h-screen bg-[#11141a] text-white p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Brief Progetti Su Misura</h1>
        <p className="text-sm opacity-70">{briefs.length} richieste</p>

        <div className="space-y-3">
          {briefs.map(b => (
            <div key={b.id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-white/5"
              >
                <div>
                  <div className="font-bold">{b.business_name}</div>
                  <div className="text-xs opacity-70">
                    {b.contact_name} — {b.contact_email} — {b.budget_range || "budget n/d"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-white/10">{b.status}</span>
                  <span className="text-xs opacity-60">{new Date(b.created_at).toLocaleDateString()}</span>
                </div>
              </button>
              {expanded === b.id && (
                <div className="p-4 border-t border-white/10 space-y-3 bg-black/20">
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div><b>Settore:</b> {b.sector || "—"}</div>
                    <div><b>Telefono:</b> {b.contact_phone || "—"}</div>
                  </div>
                  <pre className="text-xs bg-black/30 rounded p-3 overflow-auto max-h-96">
                    {JSON.stringify(b.payload, null, 2)}
                  </pre>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map(s => (
                      <button
                        key={s}
                        onClick={() => setStatus(b.id, s)}
                        className={`px-3 py-1 rounded-full text-xs border ${
                          b.status === s ? "bg-amber-500 text-black border-transparent" : "border-white/20"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {b.status === "won" && (
                    <div className="flex gap-2 items-center">
                      <span className="text-xs">Importo fatturato €:</span>
                      <input
                        type="number"
                        defaultValue={b.assigned_amount || ""}
                        onBlur={e => setStatus(b.id, "won", { assigned_amount: Number(e.target.value) })}
                        className="w-32 h-9 px-2 rounded bg-white text-black"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
