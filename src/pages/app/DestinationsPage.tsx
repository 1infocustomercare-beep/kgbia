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
import { Switch } from "@/components/ui/switch";
import { Plus, MapPin, Star, Search } from "lucide-react";
import { toast } from "sonner";

export default function DestinationsPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", description: "", is_featured: false });

  const { data: destinations = [], isLoading } = useQuery({
    queryKey: ["ncc_destinations", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase
        .from("ncc_destinations")
        .select("*")
        .eq("company_id", companyId!)
        .order("name");
      return data || [];
    },
  });

  const addDestination = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("ncc_destinations").insert({
        company_id: companyId!,
        name: form.name,
        description: form.description,
        is_featured: form.is_featured,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ncc_destinations"] });
      setOpen(false);
      setForm({ name: "", description: "", is_featured: false });
      toast.success("Destinazione aggiunta!");
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  const filtered = destinations.filter((d: any) =>
    d.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">📍 Destinazioni</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 min-h-[44px]"><Plus className="w-4 h-4 mr-2" /> Aggiungi</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Nuova Destinazione</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Nome</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-11" /></div>
              <div><Label>Descrizione</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="h-11" /></div>
              <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={v => setForm(p => ({ ...p, is_featured: v }))} /><Label>In evidenza</Label></div>
              <Button className="w-full h-11" onClick={() => addDestination.mutate()} disabled={!form.name}>Aggiungi</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /><Input placeholder="Cerca destinazione..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-11" /></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((d: any) => (
          <Card key={d.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <p className="font-semibold">{d.name}</p>
                </div>
                {d.is_featured && <Badge variant="secondary"><Star className="w-3 h-3 mr-1" />Top</Badge>}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{d.description || "Nessuna descrizione"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="border-dashed"><CardContent className="p-8 text-center text-muted-foreground">
          Nessuna destinazione trovata. Clicca "Aggiungi" per iniziare.
        </CardContent></Card>
      )}
    </div>
  );
}
