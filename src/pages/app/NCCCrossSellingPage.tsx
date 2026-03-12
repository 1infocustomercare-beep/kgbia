import { useState, useEffect } from "react";
import { Plus, Gift, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const SHOWN_OPTIONS = [
  { value: "all", label: "Tutte le prenotazioni" },
  { value: "long_routes", label: "Solo tratte > 150km" },
  { value: "groups", label: "Solo gruppi > 4 pax" },
  { value: "specific_routes", label: "Solo tratte specifiche" },
];

const DEFAULT_TEMPLATES = [
  { title: "Sosta panoramica a Ravello", description: "30 minuti di sosta nel borgo più panoramico della Costiera", price: 30, is_free: false, shown_to: "long_routes", icon_emoji: "🏔️" },
  { title: "Guida turistica Pompei", description: "2 ore con guida certificata per Scavi di Pompei", price: 80, is_free: false, shown_to: "specific_routes", icon_emoji: "🏛️" },
  { title: "Baby seat incluso", description: "Seggiolino auto per bambini 0-12 anni", price: 0, is_free: true, shown_to: "all", icon_emoji: "👶" },
  { title: "Transfer + Tour Capri in barca", description: "Pacchetto completo: transfer aeroporto + tour barca Capri giornata intera", price: 0, is_free: false, shown_to: "all", icon_emoji: "⛵" },
];

const emptyForm = { title: "", description: "", price: "0", is_free: false, shown_to: "all", icon_emoji: "🎁", is_active: true };

export default function NCCCrossSellingPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["cross-sells", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("cross_sells").select("*").eq("company_id", companyId!).order("sort_order");
      return data || [];
    },
  });

  // Seed defaults if empty
  const seedMutation = useMutation({
    mutationFn: async () => {
      const inserts = DEFAULT_TEMPLATES.map((t, i) => ({ ...t, company_id: companyId!, sort_order: i, is_active: true }));
      const { error } = await supabase.from("cross_sells").insert(inserts);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Template iniziali creati!");
      queryClient.invalidateQueries({ queryKey: ["cross-sells"] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        company_id: companyId!,
        title: form.title, description: form.description,
        price: parseFloat(form.price) || 0, is_free: form.is_free,
        shown_to: form.shown_to, icon_emoji: form.icon_emoji, is_active: form.is_active,
      };
      if (editId) {
        const { error } = await supabase.from("cross_sells").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cross_sells").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Salvato con successo!");
      queryClient.invalidateQueries({ queryKey: ["cross-sells"] });
      setShowForm(false); setEditId(null); setForm(emptyForm);
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cross_sells").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Offerta rimossa"); queryClient.invalidateQueries({ queryKey: ["cross-sells"] }); setDeleteId(null); },
  });

  const openEdit = (item: any) => {
    setForm({ title: item.title, description: item.description || "", price: String(item.price), is_free: item.is_free, shown_to: item.shown_to, icon_emoji: item.icon_emoji, is_active: item.is_active });
    setEditId(item.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">Cross-Selling</h1>
        <div className="flex gap-2">
          {items.length === 0 && (
            <Button variant="outline" onClick={() => seedMutation.mutate()} className="h-11 min-h-[44px]">Carica Template</Button>
          )}
          <Sheet open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) { setEditId(null); setForm(emptyForm); } }}>
            <SheetTrigger asChild>
              <Button className="bg-primary text-primary-foreground h-11 min-h-[44px]"><Plus className="w-4 h-4 mr-2" />Nuova Offerta</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader><SheetTitle>{editId ? "Modifica Offerta" : "Nuova Offerta"}</SheetTitle></SheetHeader>
              <div className="space-y-4 mt-4">
                <div className="flex gap-3">
                  <div className="w-16"><Label>Icona</Label><Input value={form.icon_emoji} onChange={(e) => setForm({ ...form, icon_emoji: e.target.value })} className="h-11 text-center text-xl" /></div>
                  <div className="flex-1"><Label>Titolo *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-11" /></div>
                </div>
                <div><Label>Descrizione</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.is_free} onCheckedChange={(v) => setForm({ ...form, is_free: v })} /><Label>Gratuito</Label>
                </div>
                {!form.is_free && <div><Label>Prezzo (€)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="h-11" /></div>}
                <div><Label>Mostrato a</Label>
                  <Select value={form.shown_to} onValueChange={(v) => setForm({ ...form, shown_to: v })}>
                    <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>{SHOWN_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Attiva</Label></div>
                <Button className="w-full h-11 min-h-[44px]" onClick={() => saveMutation.mutate()} disabled={!form.title || saveMutation.isPending}>Salva</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {items.map((item: any) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className={`border-border/50 ${!item.is_active ? "opacity-50" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon_emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{item.title}</p>
                        {!item.is_active && <Badge variant="secondary" className="text-[10px]">Disattiva</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{item.is_free ? "Gratuito" : `€${item.price}`}</Badge>
                        <Badge variant="secondary" className="text-[10px]">{SHOWN_OPTIONS.find((o) => o.value === item.shown_to)?.label}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}><Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length === 0 && !isLoading && (
        <div className="text-center py-16 text-muted-foreground">
          <Gift className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">Nessuna offerta cross-selling</p>
          <p className="text-sm">Clicca "Carica Template" per iniziare con 4 offerte preconfigurate.</p>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent><DialogHeader><DialogTitle>Conferma Eliminazione</DialogTitle></DialogHeader>
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
