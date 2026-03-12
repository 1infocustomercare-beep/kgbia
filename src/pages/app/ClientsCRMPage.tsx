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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Phone, Mail, Search } from "lucide-react";
import { toast } from "sonner";

export default function ClientsCRMPage() {
  const { companyId, terminology } = useIndustry();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", email: "", address: "", city: "", notes: "" });

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["crm-clients", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase
        .from("crm_clients")
        .select("*")
        .eq("company_id", companyId!)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const addClient = useMutation({
    mutationFn: async () => {
      await supabase.from("crm_clients").insert({ ...form, company_id: companyId! });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-clients"] });
      setOpen(false);
      setForm({ first_name: "", last_name: "", phone: "", email: "", address: "", city: "", notes: "" });
      toast.success("Cliente aggiunto!");
    },
  });

  const filtered = clients.filter((c: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [c.first_name, c.last_name, c.phone, c.email, c.city].some(v => v?.toLowerCase().includes(q));
  });

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">👥 {terminology.clients || "Clienti"}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 min-h-[44px]"><Plus className="w-4 h-4 mr-2" /> Nuovo Cliente</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Nuovo Cliente</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>Nome *</Label><Input value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                <div><Label>Cognome</Label><Input value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} className="h-11 min-h-[44px]" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>Telefono</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                <div><Label>Email</Label><Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="h-11 min-h-[44px]" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>Indirizzo</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                <div><Label>Città</Label><Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="h-11 min-h-[44px]" /></div>
              </div>
              <div><Label>Note</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
              <Button className="w-full h-11 min-h-[44px]" onClick={() => addClient.mutate()} disabled={!form.first_name}>Aggiungi</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per nome, telefono, email..." className="pl-10 h-11 min-h-[44px]" />
      </div>

      <div className="space-y-2">
        {filtered.map((c: any) => (
          <Card key={c.id} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                {c.first_name?.[0]}{c.last_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{c.first_name} {c.last_name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.phone} · {c.city}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {c.phone && <a href={`tel:${c.phone}`}><Button variant="ghost" size="icon" className="h-10 w-10"><Phone className="w-4 h-4" /></Button></a>}
                {c.email && <a href={`mailto:${c.email}`}><Button variant="ghost" size="icon" className="h-10 w-10"><Mail className="w-4 h-4" /></Button></a>}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Nessun cliente trovato</p>}
      </div>
    </div>
  );
}
