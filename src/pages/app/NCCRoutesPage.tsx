import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Route, ArrowRight, Clock, MapPin, Trash2, Edit, Search, Plane, Train, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const TRANSPORT_TYPES = [
  { value: "aeroporto", label: "Aeroporto", icon: Plane },
  { value: "stazione", label: "Stazione", icon: Train },
  { value: "citta", label: "Città", icon: Building },
  { value: "punto_interesse", label: "Punto di Interesse", icon: MapPin },
];

const emptyForm = {
  origin: "", destination: "", distance_km: "", duration_min: "",
  base_price: "0", transport_type: "", notes: "", is_active: true,
};

export default function NCCRoutesPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: routes = [], isLoading } = useQuery({
    queryKey: ["routes", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("ncc_routes").select("*").eq("company_id", companyId!).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        company_id: companyId!,
        origin: form.origin,
        destination: form.destination,
        distance_km: form.distance_km ? parseFloat(form.distance_km) : null,
        duration_min: form.duration_min ? parseInt(form.duration_min) : null,
        base_price: parseFloat(form.base_price) || 0,
        transport_type: form.transport_type || null,
        notes: form.notes || null,
        is_active: form.is_active,
      };
      if (editId) {
        const { error } = await supabase.from("ncc_routes").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ncc_routes").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editId ? "Tratta aggiornata!" : "Tratta aggiunta!");
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ncc_routes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Tratta rimossa");
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      setDeleteId(null);
    },
  });

  const openEdit = (r: any) => {
    setForm({
      origin: r.origin, destination: r.destination,
      distance_km: r.distance_km ? String(r.distance_km) : "",
      duration_min: r.duration_min ? String(r.duration_min) : "",
      base_price: String(r.base_price || 0),
      transport_type: r.transport_type || "",
      notes: r.notes || "",
      is_active: r.is_active !== false,
    });
    setEditId(r.id);
    setShowForm(true);
  };

  const filtered = routes.filter((r: any) =>
    r.origin.toLowerCase().includes(search.toLowerCase()) ||
    r.destination.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeIcon = (type: string | null) => {
    if (!type) return MapPin;
    const t = TRANSPORT_TYPES.find(tt => tt.value === type);
    return t?.icon || MapPin;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">Tratte NCC</h1>
          <p className="text-sm text-muted-foreground">{routes.length} tratte · {routes.filter((r: any) => r.is_active).length} attive</p>
        </div>
        <Sheet open={showForm} onOpenChange={o => { setShowForm(o); if (!o) { setEditId(null); setForm(emptyForm); } }}>
          <SheetTrigger asChild>
            <Button className="h-11 min-h-[44px]"><Plus className="w-4 h-4 mr-2" />Nuova Tratta</Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto" side="right">
            <SheetHeader><SheetTitle>{editId ? "Modifica Tratta" : "Nuova Tratta"}</SheetTitle></SheetHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Origine *</Label><Input value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} className="h-11" placeholder="Aeroporto Fiumicino" /></div>
              <div><Label>Destinazione *</Label><Input value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} className="h-11" placeholder="Ravello" /></div>
              <div>
                <Label>Tipo</Label>
                <Select value={form.transport_type} onValueChange={v => setForm({ ...form, transport_type: v })}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Seleziona tipo" /></SelectTrigger>
                  <SelectContent>{TRANSPORT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Distanza (km)</Label><Input type="number" value={form.distance_km} onChange={e => setForm({ ...form, distance_km: e.target.value })} className="h-11" /></div>
                <div><Label>Durata (min)</Label><Input type="number" value={form.duration_min} onChange={e => setForm({ ...form, duration_min: e.target.value })} className="h-11" /></div>
                <div><Label>Prezzo (€)</Label><Input type="number" value={form.base_price} onChange={e => setForm({ ...form, base_price: e.target.value })} className="h-11" /></div>
              </div>
              <div><Label>Note autista</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Istruzioni specifiche per l'autista..." /></div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
                <Label>Tratta attiva</Label>
              </div>
              <Button className="w-full h-11 min-h-[44px]" onClick={() => saveMutation.mutate()} disabled={!form.origin || !form.destination || saveMutation.isPending}>
                {saveMutation.isPending ? "Salvando..." : "Salva Tratta"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cerca tratta..." className="pl-9 bg-secondary/50 h-11" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filtered.map((r: any) => {
            const TypeIcon = getTypeIcon(r.transport_type);
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className={`border-border/50 hover:border-primary/30 transition-colors ${!r.is_active ? "opacity-50" : ""}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TypeIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm truncate">{r.origin}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="font-semibold text-sm truncate">{r.destination}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {r.distance_km && <span>{r.distance_km} km</span>}
                          {r.duration_min && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.duration_min} min</span>}
                          {r.transport_type && <Badge variant="outline" className="text-[10px]">{TRANSPORT_TYPES.find(t => t.value === r.transport_type)?.label || r.transport_type}</Badge>}
                          {!r.is_active && <Badge variant="destructive" className="text-[10px]">Disattivata</Badge>}
                        </div>
                        {r.notes && <p className="text-xs text-muted-foreground/60 mt-1 line-clamp-1">📝 {r.notes}</p>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-primary">€{r.base_price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-2 border-t border-border/30">
                      <Button variant="ghost" size="sm" className="flex-1 h-9 text-xs" onClick={() => openEdit(r)}><Edit className="w-3 h-3 mr-1" />Modifica</Button>
                      <Button variant="ghost" size="sm" className="text-destructive h-9 text-xs" onClick={() => setDeleteId(r.id)}><Trash2 className="w-3 h-3 mr-1" />Rimuovi</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && !isLoading && (
        <div className="text-center py-16 text-muted-foreground">
          <Route className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">Nessuna tratta configurata</p>
          <p className="text-sm">Aggiungi la tua prima tratta per iniziare.</p>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Conferma Eliminazione</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Sei sicuro? Questa azione non può essere annullata.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="h-11">Annulla</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} className="h-11">Elimina</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
