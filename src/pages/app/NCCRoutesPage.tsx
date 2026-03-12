import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Route, ArrowRight, Clock, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { toast } from "sonner";

interface NCCRoute {
  id: string;
  origin: string;
  destination: string;
  distance_km: number | null;
  duration_min: number | null;
  base_price: number;
  is_active: boolean;
}

export default function NCCRoutesPage() {
  const { companyId } = useIndustry();
  const [routes, setRoutes] = useState<NCCRoute[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ origin: "", destination: "", distance_km: "", duration_min: "", base_price: "0" });

  const fetchRoutes = async () => {
    if (!companyId) return;
    const { data } = await supabase.from("ncc_routes" as any).select("*").eq("company_id", companyId).order("created_at", { ascending: false });
    if (data) setRoutes(data as unknown as NCCRoute[]);
  };

  useEffect(() => { fetchRoutes(); }, [companyId]);

  const addRoute = async () => {
    if (!form.origin.trim() || !form.destination.trim() || !companyId) return;
    const { error } = await supabase.from("ncc_routes" as any).insert({
      company_id: companyId, origin: form.origin, destination: form.destination,
      distance_km: form.distance_km ? parseFloat(form.distance_km) : null,
      duration_min: form.duration_min ? parseInt(form.duration_min) : null,
      base_price: parseFloat(form.base_price) || 0,
    });
    if (error) { toast.error("Errore"); return; }
    toast.success("Tratta aggiunta!");
    setShowAdd(false);
    setForm({ origin: "", destination: "", distance_km: "", duration_min: "", base_price: "0" });
    fetchRoutes();
  };

  const deleteRoute = async (id: string) => {
    await supabase.from("ncc_routes" as any).delete().eq("id", id);
    fetchRoutes();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">Tratte NCC</h1>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="bg-vibrant-gradient text-white"><Plus className="w-4 h-4 mr-2" />Nuova Tratta</Button>
          </DialogTrigger>
          <DialogContent className="glass border-border/50">
            <DialogHeader><DialogTitle>Aggiungi Tratta</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Origine *</Label><Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="Aeroporto Fiumicino" /></div>
                <div><Label>Destinazione *</Label><Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Roma Centro" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Distanza (km)</Label><Input type="number" value={form.distance_km} onChange={(e) => setForm({ ...form, distance_km: e.target.value })} /></div>
                <div><Label>Durata (min)</Label><Input type="number" value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: e.target.value })} /></div>
                <div><Label>Prezzo (€)</Label><Input type="number" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} /></div>
              </div>
              <Button className="w-full bg-vibrant-gradient text-white" onClick={addRoute}>Salva</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {routes.map((r) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="glass border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="font-medium">{r.origin}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="font-medium">{r.destination}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {r.distance_km && <span>{r.distance_km} km</span>}
                    {r.duration_min && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.duration_min} min</span>}
                    <span className="ml-auto font-semibold text-primary text-base">€{r.base_price}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2 text-destructive" onClick={() => deleteRoute(r.id)}>
                    <Trash2 className="w-3 h-3 mr-1" />Rimuovi
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {routes.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Route className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">Nessuna tratta configurata</p>
        </div>
      )}
    </div>
  );
}
