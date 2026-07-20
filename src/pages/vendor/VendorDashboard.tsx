import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, ExternalLink, TrendingUp, Wallet, Users, FileText } from "lucide-react";

type Seller = { id: string; slug: string; display_name: string; commission_pct: number };

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [briefs, setBriefs] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) {
        navigate("/vendor/signup");
        return;
      }
      const { data: s } = await supabase
        .from("sellers")
        .select("*")
        .eq("user_id", userRes.user.id)
        .maybeSingle();
      if (!s) {
        toast.error("Profilo venditore non trovato");
        navigate("/vendor/signup");
        return;
      }
      setSeller(s as any);
      const [{ data: o }, { data: b }, { data: c }] = await Promise.all([
        supabase.from("base_orders").select("*").eq("seller_id", s.id).order("created_at", { ascending: false }),
        supabase.from("custom_project_briefs").select("*").eq("seller_id", s.id).order("created_at", { ascending: false }),
        supabase.from("seller_commissions").select("*").eq("seller_id", s.id).order("created_at", { ascending: false }),
      ]);
      setOrders(o || []);
      setBriefs(b || []);
      setCommissions(c || []);
      setLoading(false);
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1512] text-white">
        Caricamento...
      </div>
    );
  }

  if (!seller) return null;

  const refLink = `${window.location.origin}/?ref=${seller.slug}`;
  const pendingAmount = commissions.filter(c => c.status === "pending").reduce((s, c) => s + Number(c.commission_amount), 0);
  const paidAmount = commissions.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.commission_amount), 0);
  const paidCount = orders.filter(o => o.status === "paid").length;

  const Card = ({ icon: Icon, label, value }: any) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 opacity-70 text-xs mb-1"><Icon className="w-4 h-4" />{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );

  return (
    <>
      <PrestigeTheme />
      <div className="prestige-root prestige-section min-h-screen p-4 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold font-heading">Ciao {seller.display_name}</h1>
              <p className="text-sm opacity-70">Commissione attuale: <strong>{seller.commission_pct}%</strong></p>
            </div>
            <button onClick={() => supabase.auth.signOut().then(() => navigate("/"))} className="text-sm opacity-70 hover:opacity-100">
              Esci
            </button>
          </div>

          {/* Referral link */}
          <div className="rounded-2xl border border-[hsl(var(--pr-gold))]/30 bg-[hsl(var(--pr-gold))]/10 p-5">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-2">Il tuo link referral</div>
            <div className="flex items-center gap-2 flex-wrap">
              <code className="flex-1 min-w-0 bg-black/30 rounded-lg px-3 py-2 text-sm truncate">{refLink}</code>
              <button
                onClick={() => { navigator.clipboard.writeText(refLink); toast.success("Copiato!"); }}
                className="h-10 px-3 rounded-lg bg-[hsl(var(--pr-gold))] text-[hsl(var(--pr-emerald-deep))] font-semibold text-sm flex items-center gap-1"
              >
                <Copy className="w-4 h-4" /> Copia
              </button>
              <a href={refLink} target="_blank" rel="noreferrer" className="h-10 px-3 rounded-lg border border-white/20 text-sm flex items-center gap-1">
                <ExternalLink className="w-4 h-4" /> Apri
              </a>
            </div>
          </div>

          {/* KPI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card icon={TrendingUp} label="Ordini pagati" value={paidCount} />
            <Card icon={FileText} label="Brief inviati" value={briefs.length} />
            <Card icon={Wallet} label="Commissioni pending" value={`€${pendingAmount.toFixed(2)}`} />
            <Card icon={Wallet} label="Commissioni pagate" value={`€${paidAmount.toFixed(2)}`} />
          </div>

          {/* Quick actions */}
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="/pacchetto-base" className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition">
              <div className="font-bold">Vendi Pacchetto Base</div>
              <div className="text-xs opacity-70 mt-1">Apri il flusso self-service e chiudi la vendita.</div>
            </a>
            <a href="/pacchetto-completo" className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition">
              <div className="font-bold">Compila brief Su Misura</div>
              <div className="text-xs opacity-70 mt-1">Raccogli tutte le info per un progetto personalizzato.</div>
            </a>
          </div>

          {/* Orders */}
          <section>
            <h2 className="font-bold mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Ordini Base</h2>
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/10 text-xs uppercase">
                  <tr>
                    <th className="text-left p-3">Cliente</th>
                    <th className="text-left p-3">Attività</th>
                    <th className="text-left p-3">Stato</th>
                    <th className="text-right p-3">Importo</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && <tr><td colSpan={4} className="p-6 text-center opacity-60">Nessun ordine ancora</td></tr>}
                  {orders.map(o => (
                    <tr key={o.id} className="border-t border-white/5">
                      <td className="p-3">{o.customer_name}</td>
                      <td className="p-3">{o.business_name}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs bg-white/10">{o.status}</span></td>
                      <td className="p-3 text-right font-mono">€{Number(o.amount).toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Briefs */}
          <section>
            <h2 className="font-bold mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> Brief Completo</h2>
            <div className="rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/10 text-xs uppercase">
                  <tr>
                    <th className="text-left p-3">Cliente</th>
                    <th className="text-left p-3">Attività</th>
                    <th className="text-left p-3">Budget</th>
                    <th className="text-left p-3">Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {briefs.length === 0 && <tr><td colSpan={4} className="p-6 text-center opacity-60">Nessun brief ancora</td></tr>}
                  {briefs.map(b => (
                    <tr key={b.id} className="border-t border-white/5">
                      <td className="p-3">{b.contact_name}</td>
                      <td className="p-3">{b.business_name}</td>
                      <td className="p-3">{b.budget_range || "—"}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs bg-white/10">{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
