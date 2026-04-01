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
import { Plus, Search, DoorOpen, Euro } from "lucide-react";
import { toast } from "sonner";

export default function RoomsPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ room_number: "", room_type: "standard", price_per_night: "", floor: "1" });

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("rooms").select("*").eq("company_id", companyId!).order("room_number");
      return data || [];
    },
  });

  const addRoom = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("rooms").insert({
        company_id: companyId!, room_number: form.room_number, room_type: form.room_type,
        price_per_night: parseFloat(form.price_per_night) || 0, floor: parseInt(form.floor) || 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      setOpen(false);
      setForm({ room_number: "", room_type: "standard", price_per_night: "", floor: "1" });
      toast.success("Camera aggiunta!");
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  const filtered = rooms.filter((r: any) => r.room_number?.toLowerCase().includes(search.toLowerCase()));
  const statusColor: Record<string, string> = { available: "bg-green-500/10 text-green-700", occupied: "bg-red-500/10 text-red-700", maintenance: "bg-yellow-500/10 text-yellow-700", cleaning: "bg-blue-500/10 text-blue-700" };
  const statusLabel: Record<string, string> = { available: "Disponibile", occupied: "Occupata", maintenance: "Manutenzione", cleaning: "Pulizia" };

  if (isLoading) return <div className="grid grid-cols-2 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">🏨 Gestione Camere</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="h-11"><Plus className="w-4 h-4 mr-2" /> Aggiungi</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Nuova Camera</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Numero Camera</Label><Input value={form.room_number} onChange={e => setForm(p => ({ ...p, room_number: e.target.value }))} className="h-11" /></div>
              <div><Label>Tipo</Label>
                <Select value={form.room_type} onValueChange={v => setForm(p => ({ ...p, room_type: v }))}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="superior">Superior</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Prezzo/Notte (€)</Label><Input type="number" value={form.price_per_night} onChange={e => setForm(p => ({ ...p, price_per_night: e.target.value }))} className="h-11" /></div>
              <div><Label>Piano</Label><Input type="number" value={form.floor} onChange={e => setForm(p => ({ ...p, floor: e.target.value }))} className="h-11" /></div>
              <Button className="w-full h-11" onClick={() => addRoom.mutate()} disabled={!form.room_number}>Aggiungi</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" /><Input placeholder="Cerca camera..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-11" /></div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((r: any) => (
          <Card key={r.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <DoorOpen className="w-6 h-6 mx-auto mb-1 text-primary" />
              <p className="text-xl font-bold">{r.room_number}</p>
              <p className="text-xs text-muted-foreground mb-2 capitalize">{r.room_type} · Piano {r.floor}</p>
              <Badge className={statusColor[r.status] || statusColor.available}>{statusLabel[r.status] || r.status}</Badge>
              <p className="text-sm font-semibold mt-2 flex items-center justify-center"><Euro className="w-3 h-3" />{Number(r.price_per_night || 0).toFixed(0)}/notte</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && <Card className="border-dashed"><CardContent className="p-8 text-center text-muted-foreground">Nessuna camera. Clicca "Aggiungi" per iniziare.</CardContent></Card>}
    </div>
  );
}
