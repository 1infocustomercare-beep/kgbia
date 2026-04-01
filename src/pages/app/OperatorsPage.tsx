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
import { Plus, Search, User } from "lucide-react";
import { toast } from "sonner";

export default function OperatorsPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ full_name: "", role: "operator", phone: "", email: "" });

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["staff_operators", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("staff").select("*").eq("company_id", companyId!).order("name");
      return data || [];
    },
  });

  const addOperator = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("staff").insert({ company_id: companyId!, ...form });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff_operators"] });
      setOpen(false);
      setForm({ name: "", role: "operator", phone: "", email: "" });
      toast.success("Operatore aggiunto!");
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  const filtered = staff.filter((s: any) => s.name?.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">👩‍🔧 Operatori</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="h-11"><Plus className="w-4 h-4 mr-2" /> Aggiungi</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Nuovo Operatore</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Nome</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-11" /></div>
              <div><Label>Ruolo</Label><Input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="h-11" /></div>
              <div><Label>Telefono</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="h-11" /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="h-11" /></div>
              <Button className="w-full h-11" onClick={() => addOperator.mutate()} disabled={!form.name}>Aggiungi</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /><Input placeholder="Cerca operatore..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-11" /></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((s: any) => (
          <Card key={s.id}><CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
            <div><p className="font-semibold">{s.name}</p><p className="text-xs text-muted-foreground">{s.role || "Operatore"}</p></div>
            <Badge variant="outline" className="ml-auto">{s.is_active !== false ? "Attivo" : "Inattivo"}</Badge>
          </CardContent></Card>
        ))}
      </div>

      {filtered.length === 0 && <Card className="border-dashed"><CardContent className="p-8 text-center text-muted-foreground">Nessun operatore. Clicca "Aggiungi" per iniziare.</CardContent></Card>}
    </div>
  );
}
