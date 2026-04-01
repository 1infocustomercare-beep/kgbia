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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Clock, Users } from "lucide-react";
import { toast } from "sonner";

const DAYS = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

export default function ClassesPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", instructor: "", day_of_week: "Lunedì", time: "09:00", duration_minutes: "60", capacity: "20" });

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ["classes", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("classes").select("*").eq("company_id", companyId!).order("day_of_week");
      return data || [];
    },
  });

  const addClass = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("classes").insert({
        company_id: companyId!, name: form.name, instructor: form.instructor,
        day_of_week: form.day_of_week, time: form.time,
        duration_minutes: parseInt(form.duration_minutes), capacity: parseInt(form.capacity),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setOpen(false);
      setForm({ name: "", instructor: "", day_of_week: "Lunedì", time: "09:00", duration_minutes: "60", capacity: "20" });
      toast.success("Corso aggiunto!");
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  const filtered = classes.filter((c: any) => c.name?.toLowerCase().includes(search.toLowerCase()));

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">🏋️ Corsi & Lezioni</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="h-11"><Plus className="w-4 h-4 mr-2" /> Aggiungi</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Nuovo Corso</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Nome Corso</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-11" /></div>
              <div><Label>Istruttore</Label><Input value={form.instructor} onChange={e => setForm(p => ({ ...p, instructor: e.target.value }))} className="h-11" /></div>
              <div><Label>Giorno</Label>
                <Select value={form.day_of_week} onValueChange={v => setForm(p => ({ ...p, day_of_week: v }))}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Orario</Label><Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="h-11" /></div>
              <div><Label>Durata (min)</Label><Input type="number" value={form.duration_minutes} onChange={e => setForm(p => ({ ...p, duration_minutes: e.target.value }))} className="h-11" /></div>
              <div><Label>Capacità</Label><Input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} className="h-11" /></div>
              <Button className="w-full h-11" onClick={() => addClass.mutate()} disabled={!form.name}>Aggiungi</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /><Input placeholder="Cerca corso..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-11" /></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((c: any) => (
          <Card key={c.id}><CardContent className="p-4">
            <p className="font-semibold mb-1">{c.name}</p>
            <p className="text-sm text-muted-foreground mb-2">{c.instructor || "—"}</p>
            <div className="flex items-center gap-3 text-xs">
              <Badge variant="outline">{c.day_of_week}</Badge>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.time} · {c.duration_minutes}min</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.enrolled || 0}/{c.capacity}</span>
            </div>
          </CardContent></Card>
        ))}
      </div>

      {filtered.length === 0 && <Card className="border-dashed"><CardContent className="p-8 text-center text-muted-foreground">Nessun corso. Clicca "Aggiungi" per iniziare.</CardContent></Card>}
    </div>
  );
}
