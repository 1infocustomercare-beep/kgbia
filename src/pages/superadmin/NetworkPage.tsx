import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, UserCheck, Building2, Crown, Wallet } from "lucide-react";

interface NetworkData {
  team_leaders: Array<{ user_id: string; email: string; full_name: string | null; sub_partners_count: number; sales_count: number; created_at: string }>;
  partners: Array<{ user_id: string; email: string; full_name: string | null; team_leader_id: string | null; sales_count: number }>;
  clients: Array<{ id: string; name: string; slug: string; sector: string; owner_id: string; acquired_by_partner_id: string | null; setup_paid: boolean; created_at: string }>;
  totals: { team_leaders: number; partners: number; restaurants: number; companies: number; paid_setups: number };
}

export default function NetworkPage() {
  const [data, setData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: res, error } = await supabase.rpc("super_admin_network_overview");
      if (!error && (res as any)?.success) {
        setData(res as any);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Caricamento network...</div>;
  if (!data) return <div className="p-8 text-center text-destructive">Accesso negato</div>;

  const t = data.totals;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Crown className="w-7 h-7 text-primary" /> Network Empire
        </h1>
        <p className="text-muted-foreground">Panoramica completa di venditori, sotto-venditori e clienti.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Stat icon={<UserCheck />} label="Venditori Principali" value={t.team_leaders} />
        <Stat icon={<Users />} label="Sotto-Venditori" value={t.partners} />
        <Stat icon={<Building2 />} label="Ristoranti" value={t.restaurants} />
        <Stat icon={<Building2 />} label="Aziende" value={t.companies} />
        <Stat icon={<Wallet />} label="Setup Pagati" value={t.paid_setups} />
      </div>

      <Tabs defaultValue="team_leaders">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="team_leaders">Venditori ({data.team_leaders.length})</TabsTrigger>
          <TabsTrigger value="partners">Sotto-Venditori ({data.partners.length})</TabsTrigger>
          <TabsTrigger value="clients">Clienti ({data.clients.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="team_leaders">
          <Card><CardContent className="p-0">
            <div className="partner-table-surface overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left border-b">
                  <th className="p-3">Venditore</th>
                  <th className="p-3 text-right">Sotto-venditori</th>
                  <th className="p-3 text-right">Vendite</th>
                  <th className="p-3">Iscritto</th>
                </tr></thead>
                <tbody>
                  {data.team_leaders.map(tl => (
                    <tr key={tl.user_id} className="border-b">
                      <td className="p-3">
                        <div className="font-medium">{tl.full_name || tl.email}</div>
                        <div className="text-xs text-muted-foreground">{tl.email}</div>
                      </td>
                      <td className="p-3 text-right">{tl.sub_partners_count}</td>
                      <td className="p-3 text-right font-semibold">{tl.sales_count}</td>
                      <td className="p-3 text-xs">{new Date(tl.created_at).toLocaleDateString("it-IT")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="partners">
          <Card><CardContent className="p-0">
            <div className="partner-table-surface overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left border-b">
                  <th className="p-3">Sotto-venditore</th>
                  <th className="p-3">Venditore Principale</th>
                  <th className="p-3 text-right">Vendite</th>
                </tr></thead>
                <tbody>
                  {data.partners.map(p => {
                    const tl = data.team_leaders.find(t => t.user_id === p.team_leader_id);
                    return (
                      <tr key={p.user_id} className="border-b">
                        <td className="p-3">
                          <div className="font-medium">{p.full_name || p.email}</div>
                          <div className="text-xs text-muted-foreground">{p.email}</div>
                        </td>
                        <td className="p-3 text-xs">{tl?.full_name || tl?.email || <span className="text-muted-foreground">—</span>}</td>
                        <td className="p-3 text-right font-semibold">{p.sales_count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card><CardContent className="p-0">
            <div className="partner-table-surface overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left border-b">
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Settore</th>
                  <th className="p-3">Stato</th>
                  <th className="p-3">Portato da</th>
                  <th className="p-3">Creato</th>
                </tr></thead>
                <tbody>
                  {data.clients.map(c => {
                    const acq = data.team_leaders.find(t => t.user_id === c.acquired_by_partner_id) ||
                                data.partners.find(p => p.user_id === c.acquired_by_partner_id);
                    return (
                      <tr key={c.id} className="border-b">
                        <td className="p-3">
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">/{c.slug}</div>
                        </td>
                        <td className="p-3"><Badge variant="outline">{c.sector}</Badge></td>
                        <td className="p-3">
                          {c.setup_paid
                            ? <Badge className="bg-green-500/15 text-green-500 border-green-500/30">Pagato</Badge>
                            : <Badge variant="secondary">Trial</Badge>}
                        </td>
                        <td className="p-3 text-xs">{(acq as any)?.full_name || (acq as any)?.email || <span className="text-muted-foreground">—</span>}</td>
                        <td className="p-3 text-xs">{new Date(c.created_at).toLocaleDateString("it-IT")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
          <div className="w-4 h-4">{icon}</div>{label}
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
