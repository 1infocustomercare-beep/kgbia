import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, User, Phone, Star } from "lucide-react";
import { toast } from "sonner";

export default function DriversPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", license_number: "", license_expiry: "" });

  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ["drivers", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("drivers").select("*").eq("company_id", companyId!).order("first_name");
      return data || [];
    },
  });

  const addDriver = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("drivers").insert({ company_id: companyId!, ...form });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      setOpen(false);
      setForm({ first_name: "", last_name: "", phone: "", license_number: "", license_expiry: "" });
      toast.success("Autista aggiunto!");
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  const filtered = drivers.filter((d: any) => `${d.first_name} ${d.last_name}`.toLowerCase().includes(search.toLowerCase()));
  const statusColor: Record<string, string> = { active: "bg-green-500/10 text-green-700", inactive: "bg-red-500/10 text-red-700", on_break: "bg-yellow-500/10 text-yellow-700" };

  if (isLoading) return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">🚗 Autisti</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="h-11"><Plus className="w-4 h-4 mr-2" /> Aggiungi</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Nuovo Autista</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Nome</Label><Input value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} className="h-11" /></div>
              <div><Label>Cognome</Label><Input value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} className="h-11" /></div>
              <div><Label>Telefono</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="h-11" /></div>
              <div><Label>N. Patente</Label><Input value={form.license_number} onChange={e => setForm(p => ({ ...p, license_number: e.target.value }))} className="h-11" /></div>
              <div><Label>Scadenza Patente</Label><Input type="date" value={form.license_expiry} onChange={e => setForm(p => ({ ...p, license_expiry: e.target.value }))} className="h-11" /></div>
              <Button className="w-full h-11" onClick={() => addDriver.mutate()} disabled={!form.first_name || !form.last_name || !form.phone || !form.license_number || !form.license_expiry}>Aggiungi</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /><Input placeholder="Cerca autista..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-11" /></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((d: any) => (
          <Card key={d.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-semibold">{d.first_name} {d.last_name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{d.phone}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge className={statusColor[d.status] || statusColor.active}>{d.status === 'active' ? 'Attivo' : d.status === 'on_break' ? 'In pausa' : 'Inattivo'}</Badge>
                {d.rating_avg && <span className="text-xs flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{d.rating_avg.toFixed(1)}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && <Card className="border-dashed"><CardContent className="p-8 text-center text-muted-foreground">Nessun autista. Clicca "Aggiungi" per iniziare.</CardContent></Card>}
    </div>
  );
}
