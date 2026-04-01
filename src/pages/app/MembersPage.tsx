import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, User, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

export default function MembersPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", email: "" });

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("crm_clients").select("*").eq("company_id", companyId!).order("first_name");
      return data || [];
    },
  });

  const addMember = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("crm_clients").insert({ company_id: companyId!, ...form });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setOpen(false);
      setForm({ first_name: "", last_name: "", phone: "", email: "" });
      toast.success("Membro aggiunto!");
    },
    onError: () => toast.error("Errore"),
  });

  const filtered = members.filter((m: any) => `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">👥 Gestione Membri</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="h-11"><Plus className="w-4 h-4 mr-2" /> Aggiungi</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Nuovo Membro</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Nome</Label><Input value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} className="h-11" /></div>
              <div><Label>Cognome</Label><Input value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} className="h-11" /></div>
              <div><Label>Telefono</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="h-11" /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="h-11" /></div>
              <Button className="w-full h-11" onClick={() => addMember.mutate()} disabled={!form.first_name}>Aggiungi</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /><Input placeholder="Cerca membro..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-11" /></div>

      <div className="space-y-2">
        {filtered.map((m: any) => (
          <Card key={m.id}><CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{m.first_name} {m.last_name || ""}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {m.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{m.phone}</span>}
                {m.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{m.email}</span>}
              </div>
            </div>
          </CardContent></Card>
        ))}
      </div>

      {filtered.length === 0 && <Card className="border-dashed"><CardContent className="p-8 text-center text-muted-foreground">Nessun membro. Clicca "Aggiungi" per iniziare.</CardContent></Card>}
    </div>
  );
}
