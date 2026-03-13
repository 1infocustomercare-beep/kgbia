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
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Phone, Mail, Search, Download, MessageCircle, User, MapPin, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const cardV = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function ClientsCRMPage() {
  const { companyId, terminology } = useIndustry();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", email: "", address: "", city: "", notes: "" });

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["crm-clients", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("crm_clients").select("*")
        .eq("company_id", companyId!).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const addClient = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("crm_clients").insert({ ...form, company_id: companyId! });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-clients"] });
      setOpen(false);
      setForm({ first_name: "", last_name: "", phone: "", email: "", address: "", city: "", notes: "" });
      toast.success("Cliente aggiunto!");
    },
    onError: () => toast.error("Errore nell'aggiunta del cliente"),
  });

  const filtered = clients.filter((c: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [c.first_name, c.last_name, c.phone, c.email, c.city].some(v => v?.toLowerCase().includes(q));
  });

  const exportCSV = () => {
    const header = "Nome,Cognome,Telefono,Email,Città,Note,Spesa Totale\n";
    const rows = clients.map((c: any) =>
      `"${c.first_name}","${c.last_name || ""}","${c.phone || ""}","${c.email || ""}","${c.city || ""}","${c.notes || ""}",${c.total_spent || 0}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "clienti.csv"; a.click();
  };

  if (isLoading) return <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <motion.div className="space-y-4" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">👥 {terminology.clients || "Clienti"}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}><Download className="w-4 h-4 mr-1" />CSV</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" />Nuovo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Aggiungi Cliente</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Nome *</Label><Input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} /></div>
                  <div><Label>Cognome</Label><Input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Telefono</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                  <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Indirizzo</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                  <div><Label>Città</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
                </div>
                <div><Label>Note</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
                <Button onClick={() => addClient.mutate()} disabled={!form.first_name || addClient.isPending}>
                  {addClient.isPending ? "Salvataggio..." : "Salva Cliente"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cerca per nome, telefono, email..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">{filtered.length} clienti</Badge>
        {clients.length > 0 && (
          <span>• Spesa totale: €{clients.reduce((s: number, c: any) => s + (c.total_spent || 0), 0).toLocaleString("it")}</span>
        )}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card className="border-border/50"><CardContent className="p-8 text-center text-muted-foreground">
            {search ? "Nessun risultato per la ricerca" : "Nessun cliente ancora. Aggiungi il primo!"}
          </CardContent></Card>
        ) : filtered.map((c: any) => (
          <motion.div key={c.id} variants={cardV}>
            <Card
              className="border-border/50 hover:border-border cursor-pointer transition-colors"
              onClick={() => setSelected(c)}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{c.first_name} {c.last_name || ""}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {c.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</span>}
                    {c.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.city}</span>}
                  </div>
                </div>
                {(c.total_spent || 0) > 0 && (
                  <Badge variant="secondary" className="shrink-0 text-xs">€{c.total_spent}</Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Client detail sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent>
          {selected && (
            <div className="space-y-4">
              <SheetHeader>
                <SheetTitle>{selected.first_name} {selected.last_name || ""}</SheetTitle>
              </SheetHeader>
              <div className="space-y-3">
                {selected.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${selected.phone}`} className="hover:underline">{selected.phone}</a>
                    <a
                      href={`https://wa.me/${selected.phone.replace(/\D/g, "")}?text=Ciao ${selected.first_name}!`}
                      target="_blank" rel="noopener"
                      className="ml-auto"
                    >
                      <Button variant="outline" size="sm"><MessageCircle className="w-3.5 h-3.5 mr-1" />WhatsApp</Button>
                    </a>
                  </div>
                )}
                {selected.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${selected.email}`} className="hover:underline">{selected.email}</a>
                  </div>
                )}
                {selected.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selected.address}, {selected.city}</span>
                  </div>
                )}
                {(selected.total_spent || 0) > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>Spesa totale: <strong>€{selected.total_spent}</strong></span>
                  </div>
                )}
                {selected.notes && (
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">{selected.notes}</div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
