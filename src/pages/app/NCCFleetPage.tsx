import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Car, Edit, Trash2, Wifi, Usb, Snowflake,
  Baby, Accessibility, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  license_plate: string | null;
  capacity: number;
  base_price: number;
  features: string[];
  is_active: boolean;
  image_url: string | null;
}

const CATEGORIES = [
  { value: "sedan", label: "Berlina" },
  { value: "van", label: "Van" },
  { value: "minibus", label: "Minibus" },
  { value: "luxury", label: "Luxury" },
  { value: "suv", label: "SUV" },
];

const FEATURE_OPTIONS = ["WiFi", "USB", "Aria Condizionata", "Seggiolino Bimbo", "Accessibilità", "Minibar", "TV", "Tetto Panoramico"];

export default function NCCFleetPage() {
  const { companyId } = useIndustry();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "sedan", brand: "", model: "", license_plate: "",
    capacity: "4", base_price: "0", features: [] as string[],
  });

  const fetchVehicles = async () => {
    if (!companyId) return;
    const { data } = await supabase.from("fleet_vehicles" as any).select("*").eq("company_id", companyId).order("created_at", { ascending: false });
    if (data) setVehicles(data as unknown as Vehicle[]);
  };

  useEffect(() => { fetchVehicles(); }, [companyId]);

  const addVehicle = async () => {
    if (!form.name.trim() || !companyId) return;
    const { error } = await supabase.from("fleet_vehicles" as any).insert({
      company_id: companyId, name: form.name, category: form.category,
      brand: form.brand || null, model: form.model || null,
      license_plate: form.license_plate || null,
      capacity: parseInt(form.capacity) || 4,
      base_price: parseFloat(form.base_price) || 0,
      features: form.features,
    });
    if (error) { toast.error("Errore"); return; }
    toast.success("Veicolo aggiunto!");
    setShowAdd(false);
    setForm({ name: "", category: "sedan", brand: "", model: "", license_plate: "", capacity: "4", base_price: "0", features: [] });
    fetchVehicles();
  };

  const toggleFeature = (f: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter((x) => x !== f) : [...prev.features, f],
    }));
  };

  const deleteVehicle = async (id: string) => {
    await supabase.from("fleet_vehicles" as any).delete().eq("id", id);
    fetchVehicles();
  };

  const filtered = vehicles.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">Gestione Flotta</h1>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="bg-vibrant-gradient text-white"><Plus className="w-4 h-4 mr-2" />Nuovo Veicolo</Button>
          </DialogTrigger>
          <DialogContent className="glass border-border/50 max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Aggiungi Veicolo</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Nome *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Mercedes Classe E" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Categoria</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Posti</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Marca</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
                <div><Label>Modello</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Targa</Label><Input value={form.license_plate} onChange={(e) => setForm({ ...form, license_plate: e.target.value })} /></div>
                <div><Label>Prezzo base (€)</Label><Input type="number" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} /></div>
              </div>
              <div>
                <Label>Features</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {FEATURE_OPTIONS.map((f) => (
                    <Badge
                      key={f}
                      variant={form.features.includes(f) ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleFeature(f)}
                    >{f}</Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-vibrant-gradient text-white" onClick={addVehicle}>Salva</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cerca veicolo..." className="pl-9 bg-secondary/50" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((v) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="glass border-border/50 hover:border-primary/30 transition-colors overflow-hidden">
                {v.image_url && <img src={v.image_url} alt={v.name} className="w-full h-40 object-cover" />}
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-lg">{v.name}</p>
                      <p className="text-sm text-muted-foreground">{v.brand} {v.model}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">{CATEGORIES.find((c) => c.value === v.category)?.label || v.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>{v.capacity} posti</span>
                    {v.license_plate && <span>{v.license_plate}</span>}
                    <span className="ml-auto font-semibold text-primary">€{v.base_price}</span>
                  </div>
                  {v.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {v.features.map((f) => <Badge key={f} variant="outline" className="text-xs">{f}</Badge>)}
                    </div>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteVehicle(v.id)}>
                      <Trash2 className="w-3 h-3 mr-1" />Rimuovi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Car className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">Nessun veicolo nella flotta</p>
          <p className="text-sm">Aggiungi il tuo primo veicolo per iniziare.</p>
        </div>
      )}
    </div>
  );
}
