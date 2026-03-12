import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Users, Phone, Mail, Shield, ShieldAlert, Star, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  photo_url: string | null;
  license_number: string;
  license_expiry: string;
  has_cqc: boolean;
  cqc_expiry: string | null;
  languages: string[];
  preferred_vehicle_id: string | null;
  status: string;
  notes: string | null;
  rating_avg: number;
}

const LANGUAGES = ["Italiano", "Inglese", "Francese", "Spagnolo", "Tedesco", "Russo", "Cinese", "Arabo"];
const STATUS_OPTIONS = [
  { value: "available", label: "Disponibile", color: "bg-green-500/10 text-green-400 border-green-500/30" },
  { value: "busy", label: "Occupato", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { value: "vacation", label: "Ferie", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  { value: "inactive", label: "Inattivo", color: "bg-red-500/10 text-red-400 border-red-500/30" },
];

const emptyForm = {
  first_name: "", last_name: "", phone: "", email: "", license_number: "",
  license_expiry: "", has_cqc: false, cqc_expiry: "", languages: [] as string[],
  preferred_vehicle_id: "", status: "available", notes: "",
};

function getLicenseBadge(expiry: string) {
  const diff = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000);
  if (diff < 0) return { label: "SCADUTA", cls: "bg-red-500/10 text-red-400 border-red-500/30" };
  if (diff <= 60) return { label: `${diff}gg`, cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" };
  return { label: "OK", cls: "bg-green-500/10 text-green-400 border-green-500/30" };
}

export default function NCCDriversPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ["drivers", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("drivers").select("*").eq("company_id", companyId!).order("created_at", { ascending: false });
      return (data || []) as unknown as Driver[];
    },
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ["fleet-for-drivers", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("fleet_vehicles").select("id, name").eq("company_id", companyId!).eq("is_active", true);
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        company_id: companyId!,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        email: form.email || null,
        license_number: form.license_number,
        license_expiry: form.license_expiry,
        has_cqc: form.has_cqc,
        cqc_expiry: form.has_cqc && form.cqc_expiry ? form.cqc_expiry : null,
        languages: form.languages,
        preferred_vehicle_id: form.preferred_vehicle_id || null,
        status: form.status,
        notes: form.notes || null,
      };
      if (editId) {
        const { error } = await supabase.from("drivers").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("drivers").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editId ? "Autista aggiornato!" : "Autista aggiunto!");
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      setShowForm(false);
      setEditId(null);
      setForm(emptyForm);
    },
    onError: () => toast.error("Errore nel salvataggio"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("drivers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Autista rimosso");
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      setDeleteId(null);
    },
    onError: () => toast.error("Errore nell'eliminazione"),
  });

  const openEdit = (d: Driver) => {
    setForm({
      first_name: d.first_name, last_name: d.last_name, phone: d.phone,
      email: d.email || "", license_number: d.license_number,
      license_expiry: d.license_expiry, has_cqc: d.has_cqc,
      cqc_expiry: d.cqc_expiry || "", languages: d.languages || [],
      preferred_vehicle_id: d.preferred_vehicle_id || "", status: d.status,
      notes: d.notes || "",
    });
    setEditId(d.id);
    setShowForm(true);
  };

  const filtered = drivers.filter((d) =>
    `${d.first_name} ${d.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const toggleLang = (l: string) =>
    setForm((p) => ({ ...p, languages: p.languages.includes(l) ? p.languages.filter((x) => x !== l) : [...p.languages, l] }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">Autisti</h1>
        <Sheet open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) { setEditId(null); setForm(emptyForm); } }}>
          <SheetTrigger asChild>
            <Button className="bg-primary text-primary-foreground h-11 min-h-[44px]"><Plus className="w-4 h-4 mr-2" />Nuovo Autista</Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto" side="right">
            <SheetHeader><SheetTitle>{editId ? "Modifica Autista" : "Nuovo Autista"}</SheetTitle></SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Nome *</Label><Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="h-11" /></div>
                <div><Label>Cognome *</Label><Input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="h-11" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Telefono *</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11" /></div>
                <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Numero Patente *</Label><Input value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} className="h-11" /></div>
                <div><Label>Scadenza Patente *</Label><Input type="date" value={form.license_expiry} onChange={(e) => setForm({ ...form, license_expiry: e.target.value })} className="h-11" /></div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.has_cqc} onCheckedChange={(v) => setForm({ ...form, has_cqc: v })} />
                <Label>CQC posseduta</Label>
              </div>
              {form.has_cqc && (
                <div><Label>Scadenza CQC</Label><Input type="date" value={form.cqc_expiry} onChange={(e) => setForm({ ...form, cqc_expiry: e.target.value })} className="h-11" /></div>
              )}
              <div>
                <Label>Lingue parlate</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {LANGUAGES.map((l) => (
                    <Badge key={l} variant={form.languages.includes(l) ? "default" : "secondary"} className="cursor-pointer h-8 min-h-[32px]" onClick={() => toggleLang(l)}>{l}</Badge>
                  ))}
                </div>
              </div>
              <div><Label>Veicolo Preferito</Label>
                <Select value={form.preferred_vehicle_id} onValueChange={(v) => setForm({ ...form, preferred_vehicle_id: v })}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Seleziona veicolo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nessuno</SelectItem>
                    {vehicles.map((v: any) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Stato</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Note</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} /></div>
              <Button className="w-full bg-primary text-primary-foreground h-11 min-h-[44px]" onClick={() => saveMutation.mutate()} disabled={!form.first_name || !form.last_name || !form.phone || !form.license_number || !form.license_expiry || saveMutation.isPending}>
                {saveMutation.isPending ? "Salvando..." : "Salva Autista"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cerca autista..." className="pl-9 bg-secondary/50 h-11" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((d) => {
            const lb = getLicenseBadge(d.license_expiry);
            const st = STATUS_OPTIONS.find((s) => s.value === d.status) || STATUS_OPTIONS[0];
            return (
              <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className={`border-border/50 hover:border-primary/30 transition-colors ${lb.label === "SCADUTA" ? "border-red-500/50" : lb.label !== "OK" ? "border-yellow-500/30" : ""}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {d.first_name[0]}{d.last_name[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{d.first_name} {d.last_name}</p>
                          <Badge variant="outline" className={`text-[10px] ${st.color}`}>{st.label}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(d)}><Edit className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(d.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2"><Phone className="w-3 h-3" />{d.phone}</p>
                      {d.email && <p className="flex items-center gap-2"><Mail className="w-3 h-3" />{d.email}</p>}
                      <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        <span>Patente: {d.license_number}</span>
                        <Badge variant="outline" className={`text-[10px] ml-auto ${lb.cls}`}>{lb.label}</Badge>
                      </div>
                      {d.has_cqc && (
                        <p className="flex items-center gap-2"><ShieldAlert className="w-3 h-3" />CQC: {d.cqc_expiry ? new Date(d.cqc_expiry).toLocaleDateString("it-IT") : "—"}</p>
                      )}
                      {d.languages.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {d.languages.map((l) => <Badge key={l} variant="secondary" className="text-[10px]">{l}</Badge>)}
                        </div>
                      )}
                      {d.rating_avg > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.round(d.rating_avg) ? "text-primary fill-primary" : "text-muted"}`} />
                          ))}
                          <span className="text-xs ml-1">{d.rating_avg.toFixed(1)}</span>
                        </div>
                      )}
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
          <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">Nessun autista</p>
          <p className="text-sm">Aggiungi il tuo primo autista per iniziare.</p>
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Conferma Eliminazione</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Sei sicuro? Questa azione non può essere annullata.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="h-11 min-h-[44px]">Annulla</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} className="h-11 min-h-[44px]">Elimina</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
