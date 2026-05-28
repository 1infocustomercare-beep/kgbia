import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, UserPlus, Users, Mail, Clock, CheckCircle2 } from "lucide-react";

interface SubPartner {
  user_id: string;
  email: string;
  full_name: string | null;
  joined_at: string;
  sales_count: number;
}
interface Invite {
  id: string;
  email: string;
  status: string;
  commission_pct: number;
  token: string;
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
}

export default function PartnerTeamPage() {
  const { roles } = useAuth();
  const [subPartners, setSubPartners] = useState<SubPartner[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [commission, setCommission] = useState(50);
  const [submitting, setSubmitting] = useState(false);

  const isTeamLeader = roles.includes("team_leader") || roles.includes("super_admin");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("list_my_sub_partners");
    if (error) {
      toast.error(error.message);
    } else if (data) {
      const d = data as unknown as { sub_partners: SubPartner[]; invites: Invite[] };
      setSubPartners(d.sub_partners || []);
      setInvites(d.invites || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleInvite = async () => {
    if (!email.trim()) return;
    setSubmitting(true);
    const { data, error } = await supabase.rpc("create_sub_partner_invite", {
      p_email: email.trim(),
      p_commission_pct: commission,
    });
    setSubmitting(false);
    if (error || !(data as any)?.success) {
      toast.error((data as any)?.error || error?.message || "Errore");
      return;
    }
    toast.success("Invito creato. Copia il link e mandalo al tuo sotto-venditore.");
    setEmail("");
    load();
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/auth?invite=${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiato negli appunti");
  };

  if (!isTeamLeader) {
    return (
      <div className="container mx-auto p-6">
        <Card className="partner-text-surface">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Solo Venditori Principali</h2>
            <p className="text-muted-foreground">
              Per gestire un team di sotto-venditori devi essere un Venditore Principale (team leader).
              Chiudi almeno 4 vendite e recluta 2 partner per essere promosso automaticamente.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Il Mio Team</h1>
        <p className="text-muted-foreground">Gestisci i tuoi sotto-venditori e le commissioni.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Invita un Sotto-Venditore
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,160px,auto] gap-3">
            <div>
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="nome@esempio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="invite-comm">Commissione %</Label>
              <Input
                id="invite-comm"
                type="number"
                min={0}
                max={100}
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleInvite} disabled={submitting || !email.trim()} className="w-full md:w-auto">
                {submitting ? "Creazione..." : "Crea Invito"}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Verrà generato un link di invito valido 14 giorni. Copialo e invialo via WhatsApp/Email.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" /> Sotto-Venditori Attivi ({subPartners.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
          ) : subPartners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nessun sotto-venditore ancora. Invitane uno qui sopra.
            </div>
          ) : (
            <div className="partner-table-surface overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-3">Nome / Email</th>
                    <th className="p-3">Iscritto il</th>
                    <th className="p-3 text-right">Vendite</th>
                  </tr>
                </thead>
                <tbody>
                  {subPartners.map((sp) => (
                    <tr key={sp.user_id} className="border-b">
                      <td className="p-3">
                        <div className="font-medium">{sp.full_name || "—"}</div>
                        <div className="text-xs text-muted-foreground">{sp.email}</div>
                      </td>
                      <td className="p-3">{new Date(sp.joined_at).toLocaleDateString("it-IT")}</td>
                      <td className="p-3 text-right font-semibold">{sp.sales_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" /> Inviti ({invites.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nessun invito.</div>
          ) : (
            <div className="space-y-2">
              {invites.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{inv.email}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Badge variant={inv.status === "accepted" ? "default" : "secondary"} className="text-[10px]">
                        {inv.status === "accepted" ? (
                          <><CheckCircle2 className="w-3 h-3 mr-1" /> Accettato</>
                        ) : (
                          <><Clock className="w-3 h-3 mr-1" /> {inv.status}</>
                        )}
                      </Badge>
                      <span>Commissione {inv.commission_pct}%</span>
                    </div>
                  </div>
                  {inv.status === "pending" && (
                    <Button size="sm" variant="outline" onClick={() => copyLink(inv.token)}>
                      <Copy className="w-3 h-3 mr-1" /> Copia link
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
