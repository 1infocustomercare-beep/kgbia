import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Car, Edit, Trash2, AlertTriangle,
  Users, Luggage, ChevronRight, MoreHorizontal
} from "lucide-react";
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
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
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
        name: form.name, category: form.category,
        brand: form.brand || null, model: form.model || null,
        license_plate: form.license_plate || form.plate || null,
        plate: form.plate || form.license_plate || null,
        capacity: parseInt(form.capacity) || 4,
        min_pax: parseInt(form.min_pax) || 1,
        max_pax: parseInt(form.max_pax) || parseInt(form.capacity) || 4,
        luggage_capacity: parseInt(form.luggage_capacity) || 0,
        base_price: parseFloat(form.base_price) || 0,
        price_per_km: parseFloat(form.price_per_km) || 0,
        year: form.year ? parseInt(form.year) : null,
        features: form.features, image_url: form.image_url || null,
        description: form.description || null, is_popular: form.is_popular,
        is_active: form.is_active, revision_expiry: form.revision_expiry || null,
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
      setShowForm(false); setEditId(null); setForm(emptyForm);
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
      capacity: String(v.capacity || 4), min_pax: String(v.min_pax || 1),
      max_pax: String(v.max_pax || v.capacity || 4),
      luggage_capacity: String(v.luggage_capacity || 0),
      base_price: String(v.base_price || 0), price_per_km: String(v.price_per_km || 0),
      year: v.year ? String(v.year) : "", features: v.features || [],
      image_url: v.image_url || "", description: v.description || "",
      is_popular: v.is_popular || false, is_active: v.is_active !== false,
      revision_expiry: v.revision_expiry || "", insurance_expiry: v.insurance_expiry || "",
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

  const alertCount = vehicles.filter((v: any) => {
    const rev = getExpiryBadge(v.revision_expiry);
    const ins = getExpiryBadge(v.insurance_expiry);
    return (rev && rev.label !== "OK") || (ins && ins.label !== "OK");
  }).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg font-bold font-heading">Flotta</h1>
          <p className="text-xs text-muted-foreground">{vehicles.length} veicoli · {vehicles.filter((v: any) => v.is_active).length} attivi</p>
        </div>
        <Sheet open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) { setEditId(null); setForm(emptyForm); } }}>
          <SheetTrigger asChild>
            <Button size="sm" className="h-9 min-h-[44px] gap-1.5"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Nuovo</span></Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto" side="right">
            <SheetHeader><SheetTitle className="text-base">{editId ? "Modifica Veicolo" : "Nuovo Veicolo"}</SheetTitle></SheetHeader>
            <div className="space-y-3 mt-3">
              <div><Label className="text-xs">Nome *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-10" placeholder="Mercedes V-Class" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">Categoria</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Anno</Label><Input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className="h-10" placeholder="2024" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">Marca</Label><Input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="h-10" placeholder="Mercedes" /></div>
                <div><Label className="text-xs">Modello</Label><Input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className="h-10" placeholder="V-Class" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">Targa</Label><Input value={form.plate || form.license_plate} onChange={e => setForm({ ...form, plate: e.target.value, license_plate: e.target.value })} className="h-10" placeholder="AB 123 CD" /></div>
                <div><Label className="text-xs">Posti</Label><Input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="h-10" /></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div><Label className="text-xs">Min</Label><Input type="number" value={form.min_pax} onChange={e => setForm({ ...form, min_pax: e.target.value })} className="h-10" /></div>
                <div><Label className="text-xs">Max</Label><Input type="number" value={form.max_pax} onChange={e => setForm({ ...form, max_pax: e.target.value })} className="h-10" /></div>
                <div><Label className="text-xs">Bagagli</Label><Input type="number" value={form.luggage_capacity} onChange={e => setForm({ ...form, luggage_capacity: e.target.value })} className="h-10" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">€ base</Label><Input type="number" value={form.base_price} onChange={e => setForm({ ...form, base_price: e.target.value })} className="h-10" /></div>
                <div><Label className="text-xs">€/km</Label><Input type="number" step="0.01" value={form.price_per_km} onChange={e => setForm({ ...form, price_per_km: e.target.value })} className="h-10" /></div>
              </div>
              <div><Label className="text-xs">URL Immagine</Label><Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="h-10" placeholder="https://..." /></div>
              {form.image_url && <img src={form.image_url} alt="Preview" className="h-20 w-full object-cover rounded-lg" />}
              <div><Label className="text-xs">Descrizione</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="text-sm" /></div>
              <div>
                <Label className="text-xs">Caratteristiche</Label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {FEATURE_OPTIONS.map(f => (
                    <Badge key={f} variant={form.features.includes(f) ? "default" : "secondary"} className="cursor-pointer h-7 text-[10px] min-h-[28px]" onClick={() => toggleFeature(f)}>{f}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">Scad. Revisione</Label><Input type="date" value={form.revision_expiry} onChange={e => setForm({ ...form, revision_expiry: e.target.value })} className="h-10" /></div>
                <div><Label className="text-xs">Scad. Assicurazione</Label><Input type="date" value={form.insurance_expiry} onChange={e => setForm({ ...form, insurance_expiry: e.target.value })} className="h-10" /></div>
              </div>
              <div><Label className="text-xs">Note Manutenzione</Label><Textarea value={form.maintenance_notes} onChange={e => setForm({ ...form, maintenance_notes: e.target.value })} rows={2} className="text-sm" placeholder="Ultimo tagliando..." /></div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2"><Switch checked={form.is_popular} onCheckedChange={v => setForm({ ...form, is_popular: v })} /><Label className="text-xs">Più richiesto</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} /><Label className="text-xs">Attivo</Label></div>
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
        <div className="flex items-center gap-2 p-2.5 rounded-lg border border-yellow-500/30 bg-yellow-950/10 text-xs text-yellow-400">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          {alertCount} veicol{alertCount > 1 ? "i" : "o"} con documenti in scadenza
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cerca veicolo..." className="pl-9 bg-secondary/30 h-10 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Compact list view on mobile, grid on desktop */}
      <div className="space-y-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-3 md:space-y-0">
        <AnimatePresence>
          {filtered.map((v: any) => {
            const rev = getExpiryBadge(v.revision_expiry);
            const ins = getExpiryBadge(v.insurance_expiry);
            const cat = CATEGORIES.find(c => c.value === v.category);
            const hasAlert = (rev && rev.label !== "OK") || (ins && ins.label !== "OK");

            return (
              <motion.div key={v.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Mobile: compact horizontal row */}
                <Card className={`md:hidden border-border/40 hover:border-primary/30 transition-colors ${!v.is_active ? "opacity-50" : ""}`}>
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 p-3" onClick={() => openEdit(v)}>
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/20">
                        {v.image_url ? (
                          <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Car className="w-6 h-6 text-muted-foreground/30" /></div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-sm truncate">{v.name}</p>
                          {v.is_popular && <span className="text-[10px]">⭐</span>}
                          {hasAlert && <AlertTriangle className="w-3 h-3 text-yellow-400 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span>{cat?.label || v.category}</span>
                          <span>·</span>
                          <span>{v.min_pax || 1}-{v.max_pax || v.capacity} pax</span>
                          {v.year && <><span>·</span><span>{v.year}</span></>}
                        </div>
                        {(v.features || []).length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {(v.features as string[]).slice(0, 3).map(f => (
                              <span key={f} className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary/50 text-muted-foreground">{f}</span>
                            ))}
                            {(v.features as string[]).length > 3 && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary/50 text-muted-foreground">+{(v.features as string[]).length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Price + action */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="font-bold text-sm text-primary">€{v.base_price}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 min-h-[32px]" onClick={e => e.stopPropagation()}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem onClick={() => openEdit(v)}><Edit className="w-3.5 h-3.5 mr-2" />Modifica</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(v.id)}><Trash2 className="w-3.5 h-3.5 mr-2" />Rimuovi</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Desktop: card with image */}
                <Card className={`hidden md:block border-border/40 hover:border-primary/30 transition-colors overflow-hidden ${!v.is_active ? "opacity-50" : ""}`}>
                  {v.image_url ? (
                    <div className="aspect-[2/1] overflow-hidden relative">
                      <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
                      {v.is_popular && <Badge className="absolute top-2 right-2 text-[10px]">⭐ Più richiesto</Badge>}
                      {!v.is_active && <Badge className="absolute top-2 left-2 text-[10px]" variant="destructive">Off</Badge>}
                    </div>
                  ) : (
                    <div className="aspect-[2/1] bg-secondary/20 flex items-center justify-center relative">
                      <Car className="w-10 h-10 text-muted-foreground/20" />
                      {v.is_popular && <Badge className="absolute top-2 right-2 text-[10px]">⭐</Badge>}
                    </div>
                  )}
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{v.name}</p>
                        <p className="text-[11px] text-muted-foreground">{v.brand} {v.model} {v.year ? `· ${v.year}` : ""}</p>
                      </div>
                      <Badge variant="secondary" className="text-[9px] flex-shrink-0">{cat?.label || v.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1.5">
                      <span className="flex items-center gap-0.5"><Users className="w-3 h-3" />{v.min_pax || 1}-{v.max_pax || v.capacity}</span>
                      {v.luggage_capacity > 0 && <span className="flex items-center gap-0.5"><Luggage className="w-3 h-3" />{v.luggage_capacity}</span>}
                      <span className="ml-auto font-bold text-primary text-sm">€{v.base_price}</span>
                    </div>
                    {(v.features || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {(v.features as string[]).slice(0, 4).map(f => <Badge key={f} variant="outline" className="text-[9px] h-5">{f}</Badge>)}
                        {(v.features as string[]).length > 4 && <Badge variant="outline" className="text-[9px] h-5">+{(v.features as string[]).length - 4}</Badge>}
                      </div>
                    )}
                    {(rev || ins) && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {rev && <Badge variant="outline" className={`text-[9px] h-5 ${rev.cls}`}>Rev: {rev.label}</Badge>}
                        {ins && <Badge variant="outline" className={`text-[9px] h-5 ${ins.cls}`}>Ass: {ins.label}</Badge>}
                      </div>
                    )}
                    <div className="flex gap-1.5 pt-2 border-t border-border/30">
                      <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs" onClick={() => openEdit(v)}><Edit className="w-3 h-3 mr-1" />Modifica</Button>
                      <Button variant="ghost" size="sm" className="text-destructive h-8 text-xs" onClick={() => setDeleteId(v.id)}><Trash2 className="w-3 h-3 mr-1" />Rimuovi</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">Nessun veicolo</p>
          <p className="text-xs">Aggiungi il primo veicolo per iniziare.</p>
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Conferma Eliminazione</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Sei sicuro di voler rimuovere questo veicolo?</p>
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
