import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Car, Edit, Trash2, Wifi, AlertTriangle,
  Star, Shield, Calendar, Image, Users, Luggage
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "sedan", label: "Berlina" },
  { value: "van", label: "Van/Minivan" },
  { value: "minibus", label: "Minibus" },
  { value: "bus", label: "Pullman/Bus" },
  { value: "luxury", label: "Luxury/Sedan" },
  { value: "suv", label: "SUV" },
];

const FEATURE_OPTIONS = ["Pelle", "Clima", "WiFi", "TV", "USB", "Acqua", "WC", "Bagagliaio", "4x4", "Massaggio", "Champagne", "Minibar", "Tetto Panoramico", "Seggiolino Bimbo", "Accessibilità"];

const emptyForm = {
  name: "", category: "sedan", brand: "", model: "", license_plate: "", plate: "",
  capacity: "4", min_pax: "1", max_pax: "", luggage_capacity: "0",
  base_price: "0", price_per_km: "0", year: "", features: [] as string[],
  image_url: "", description: "", is_popular: false, is_active: true,
  revision_expiry: "", insurance_expiry: "", maintenance_notes: "",
};

function getExpiryBadge(date: string | null) {
  if (!date) return null;
  const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
  if (diff < 0) return { label: "SCADUTA", cls: "bg-red-500/10 text-red-400 border-red-500/30" };
  if (diff <= 30) return { label: `${diff}gg`, cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" };
  return { label: "OK", cls: "bg-green-500/10 text-green-400 border-green-500/30" };
}

export default function NCCFleetPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["fleet", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("fleet_vehicles").select("*").eq("company_id", companyId!).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        company_id: companyId!,
        name: form.name,
        category: form.category,
        brand: form.brand || null,
        model: form.model || null,
        license_plate: form.license_plate || form.plate || null,
        plate: form.plate || form.license_plate || null,
        capacity: parseInt(form.capacity) || 4,
        min_pax: parseInt(form.min_pax) || 1,
        max_pax: parseInt(form.max_pax) || parseInt(form.capacity) || 4,
        luggage_capacity: parseInt(form.luggage_capacity) || 0,
        base_price: parseFloat(form.base_price) || 0,
        price_per_km: parseFloat(form.price_per_km) || 0,
        year: form.year ? parseInt(form.year) : null,
        features: form.features,
        image_url: form.image_url || null,
        description: form.description || null,
        is_popular: form.is_popular,
        is_active: form.is_active,
        revision_expiry: form.revision_expiry || null,
        insurance_expiry: form.insurance_expiry || null,
        maintenance_notes: form.maintenance_notes || null,
      };
      if (editId) {
        const { error } = await supabase.from("fleet_vehicles").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("fleet_vehicles").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editId ? "Veicolo aggiornato!" : "Veicolo aggiunto!");
      queryClient.invalidateQueries({ queryKey: ["fleet"] });
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fleet_vehicles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Veicolo rimosso");
      queryClient.invalidateQueries({ queryKey: ["fleet"] });
      setDeleteId(null);
    },
    onError: () => toast.error("Errore nell'eliminazione"),
  });

  const openEdit = (v: any) => {
    setForm({
      name: v.name || "", category: v.category || "sedan",
      brand: v.brand || "", model: v.model || "",
      license_plate: v.license_plate || "", plate: v.plate || "",
      capacity: String(v.capacity || 4),
      min_pax: String(v.min_pax || 1),
      max_pax: String(v.max_pax || v.capacity || 4),
      luggage_capacity: String(v.luggage_capacity || 0),
      base_price: String(v.base_price || 0),
      price_per_km: String(v.price_per_km || 0),
      year: v.year ? String(v.year) : "",
      features: v.features || [],
      image_url: v.image_url || "",
      description: v.description || "",
      is_popular: v.is_popular || false,
      is_active: v.is_active !== false,
      revision_expiry: v.revision_expiry || "",
      insurance_expiry: v.insurance_expiry || "",
      maintenance_notes: v.maintenance_notes || "",
    });
    setEditId(v.id);
    setShowForm(true);
  };

  const toggleFeature = (f: string) => {
    setForm(p => ({
      ...p, features: p.features.includes(f) ? p.features.filter(x => x !== f) : [...p.features, f],
    }));
  };

  const filtered = vehicles.filter((v: any) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    (v.brand || "").toLowerCase().includes(search.toLowerCase()) ||
    (v.plate || v.license_plate || "").toLowerCase().includes(search.toLowerCase())
  );

  // Alerts count
  const alertCount = vehicles.filter((v: any) => {
    const rev = getExpiryBadge(v.revision_expiry);
    const ins = getExpiryBadge(v.insurance_expiry);
    return (rev && rev.label !== "OK") || (ins && ins.label !== "OK");
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">Gestione Flotta</h1>
          <p className="text-sm text-muted-foreground">{vehicles.length} veicoli · {vehicles.filter((v: any) => v.is_active).length} attivi</p>
        </div>
        <Sheet open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) { setEditId(null); setForm(emptyForm); } }}>
          <SheetTrigger asChild>
            <Button className="h-11 min-h-[44px]"><Plus className="w-4 h-4 mr-2" />Nuovo Veicolo</Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto" side="right">
            <SheetHeader><SheetTitle>{editId ? "Modifica Veicolo" : "Nuovo Veicolo"}</SheetTitle></SheetHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Nome veicolo *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-11" placeholder="Mercedes V-Class" /></div>
              
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Categoria</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Anno</Label><Input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className="h-11" placeholder="2024" /></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><Label>Marca</Label><Input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="h-11" placeholder="Mercedes" /></div>
                <div><Label>Modello</Label><Input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className="h-11" placeholder="V-Class" /></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><Label>Targa</Label><Input value={form.plate || form.license_plate} onChange={e => setForm({ ...form, plate: e.target.value, license_plate: e.target.value })} className="h-11" placeholder="AB 123 CD" /></div>
                <div><Label>Posti totali</Label><Input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="h-11" /></div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div><Label>Min Pax</Label><Input type="number" value={form.min_pax} onChange={e => setForm({ ...form, min_pax: e.target.value })} className="h-11" /></div>
                <div><Label>Max Pax</Label><Input type="number" value={form.max_pax} onChange={e => setForm({ ...form, max_pax: e.target.value })} className="h-11" /></div>
                <div><Label>Bagagli</Label><Input type="number" value={form.luggage_capacity} onChange={e => setForm({ ...form, luggage_capacity: e.target.value })} className="h-11" /></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><Label>Prezzo base (€)</Label><Input type="number" value={form.base_price} onChange={e => setForm({ ...form, base_price: e.target.value })} className="h-11" /></div>
                <div><Label>€/km</Label><Input type="number" step="0.01" value={form.price_per_km} onChange={e => setForm({ ...form, price_per_km: e.target.value })} className="h-11" /></div>
              </div>

              <div><Label>URL Immagine</Label><Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="h-11" placeholder="https://..." /></div>
              {form.image_url && <img src={form.image_url} alt="Preview" className="h-24 w-full object-cover rounded-lg" />}

              <div><Label>Descrizione</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} /></div>

              <div>
                <Label>Caratteristiche</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {FEATURE_OPTIONS.map(f => (
                    <Badge key={f} variant={form.features.includes(f) ? "default" : "secondary"} className="cursor-pointer h-8 min-h-[32px]" onClick={() => toggleFeature(f)}>{f}</Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><Label>Scadenza Revisione</Label><Input type="date" value={form.revision_expiry} onChange={e => setForm({ ...form, revision_expiry: e.target.value })} className="h-11" /></div>
                <div><Label>Scadenza Assicurazione</Label><Input type="date" value={form.insurance_expiry} onChange={e => setForm({ ...form, insurance_expiry: e.target.value })} className="h-11" /></div>
              </div>

              <div><Label>Note Manutenzione</Label><Textarea value={form.maintenance_notes} onChange={e => setForm({ ...form, maintenance_notes: e.target.value })} rows={2} placeholder="Ultimo tagliando, gomme cambiate..." /></div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_popular} onCheckedChange={v => setForm({ ...form, is_popular: v })} />
                  <Label>Più richiesto</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
                  <Label>Attivo</Label>
                </div>
              </div>

              <Button className="w-full h-11 min-h-[44px]" onClick={() => saveMutation.mutate()} disabled={!form.name || saveMutation.isPending}>
                {saveMutation.isPending ? "Salvando..." : "Salva Veicolo"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Alert banner */}
      {alertCount > 0 && (
        <Card className="border-yellow-500/30 bg-yellow-950/20">
          <CardContent className="p-3 flex items-center gap-2 text-sm text-yellow-300">
            <AlertTriangle className="w-4 h-4" />
            ⚠️ {alertCount} veicol{alertCount > 1 ? "i" : "o"} con documenti in scadenza o scaduti
          </CardContent>
        </Card>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cerca veicolo, marca, targa..." className="pl-9 bg-secondary/50 h-11" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((v: any) => {
            const rev = getExpiryBadge(v.revision_expiry);
            const ins = getExpiryBadge(v.insurance_expiry);
            const cat = CATEGORIES.find(c => c.value === v.category);
            return (
              <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className={`border-border/50 hover:border-primary/30 transition-colors overflow-hidden ${!v.is_active ? "opacity-60" : ""}`}>
                  {v.image_url ? (
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                      {v.is_popular && (
                        <Badge className="absolute top-2 right-2 text-[10px]" variant="default">⭐ Più richiesto</Badge>
                      )}
                      {!v.is_active && (
                        <Badge className="absolute top-2 left-2 text-[10px]" variant="destructive">Disattivato</Badge>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-secondary/20 flex items-center justify-center relative">
                      <Car className="w-12 h-12 text-muted-foreground/20" />
                      {v.is_popular && <Badge className="absolute top-2 right-2 text-[10px]">⭐ Più richiesto</Badge>}
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-base truncate">{v.name}</p>
                        <p className="text-xs text-muted-foreground">{v.brand} {v.model} {v.year ? `· ${v.year}` : ""}</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px] flex-shrink-0">{cat?.label || v.category}</Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{v.min_pax || 1}-{v.max_pax || v.capacity} pax</span>
                      {v.luggage_capacity > 0 && <span className="flex items-center gap-1"><Luggage className="w-3 h-3" />{v.luggage_capacity}</span>}
                      {(v.plate || v.license_plate) && <span>{v.plate || v.license_plate}</span>}
                      <span className="ml-auto font-bold text-primary text-sm">€{v.base_price}</span>
                    </div>

                    {(v.features || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {(v.features as string[]).slice(0, 4).map(f => <Badge key={f} variant="outline" className="text-[10px]">{f}</Badge>)}
                        {(v.features as string[]).length > 4 && <Badge variant="outline" className="text-[10px]">+{(v.features as string[]).length - 4}</Badge>}
                      </div>
                    )}

                    {/* Expiry badges */}
                    {(rev || ins) && (
                      <div className="flex items-center gap-2 mb-2">
                        {rev && <Badge variant="outline" className={`text-[10px] ${rev.cls}`}>Rev: {rev.label}</Badge>}
                        {ins && <Badge variant="outline" className={`text-[10px] ${ins.cls}`}>Ass: {ins.label}</Badge>}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t border-border/30">
                      <Button variant="ghost" size="sm" className="flex-1 h-9 min-h-[36px] text-xs" onClick={() => openEdit(v)}>
                        <Edit className="w-3 h-3 mr-1" />Modifica
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive h-9 min-h-[36px] text-xs" onClick={() => setDeleteId(v.id)}>
                        <Trash2 className="w-3 h-3 mr-1" />Rimuovi
                      </Button>
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
          <Car className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">Nessun veicolo nella flotta</p>
          <p className="text-sm">Aggiungi il tuo primo veicolo per iniziare.</p>
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Conferma Eliminazione</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Sei sicuro di voler rimuovere questo veicolo? L'azione non può essere annullata.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="h-11 min-h-[44px]">Annulla</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} className="h-11 min-h-[44px]">
              {deleteMutation.isPending ? "Eliminando..." : "Elimina"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
