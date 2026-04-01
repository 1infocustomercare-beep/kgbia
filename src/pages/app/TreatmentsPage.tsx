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
import { Plus, Search, Clock, Euro } from "lucide-react";
import { toast } from "sonner";

export default function TreatmentsPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", price: "", duration_minutes: "30", category: "" });

  const { data: treatments = [], isLoading } = useQuery({
    queryKey: ["treatments", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").eq("company_id", companyId!).order("name");
      return data || [];
    },
  });

  const addTreatment = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("products").insert({
        company_id: companyId!, name: form.name, price: parseFloat(form.price) || 0,
        duration_minutes: parseInt(form.duration_minutes) || 30, category: form.category,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatments"] });
      setOpen(false);
      setForm({ name: "", price: "", duration_minutes: "30", category: "" });
      toast.success("Prestazione aggiunta!");
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  const filtered = treatments.filter((t: any) => t.name?.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">💊 Prestazioni Mediche</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="h-11"><Plus className="w-4 h-4 mr-2" /> Aggiungi</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Nuova Prestazione</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Nome</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-11" /></div>
              <div><Label>Prezzo (€)</Label><Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="h-11" /></div>
              <div><Label>Durata (min)</Label><Input type="number" value={form.duration_minutes} onChange={e => setForm(p => ({ ...p, duration_minutes: e.target.value }))} className="h-11" /></div>
              <div><Label>Categoria</Label><Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="h-11" placeholder="es. Visita, Esame, Terapia" /></div>
              <Button className="w-full h-11" onClick={() => addTreatment.mutate()} disabled={!form.name}>Aggiungi</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /><Input placeholder="Cerca prestazione..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-11" /></div>

      <div className="space-y-2">
        {filtered.map((t: any) => (
          <Card key={t.id}><CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{t.name}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.duration_minutes || 30} min</span>
                {t.category && <Badge variant="outline" className="text-xs">{t.category}</Badge>}
              </div>
            </div>
            <p className="font-bold text-lg flex items-center"><Euro className="w-4 h-4" />{Number(t.price || 0).toFixed(2)}</p>
          </CardContent></Card>
        ))}
      </div>

      {filtered.length === 0 && <Card className="border-dashed"><CardContent className="p-8 text-center text-muted-foreground">Nessuna prestazione. Clicca "Aggiungi" per iniziare.</CardContent></Card>}
    </div>
  );
}
