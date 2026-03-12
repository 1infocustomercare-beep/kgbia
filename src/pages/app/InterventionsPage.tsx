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
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  requested: { label: "Richiesto", color: "bg-yellow-500/20 text-yellow-400" },
  scheduled: { label: "Programmato", color: "bg-blue-500/20 text-blue-400" },
  in_progress: { label: "In Corso", color: "bg-purple-500/20 text-purple-400" },
  completed: { label: "Completato", color: "bg-green-500/20 text-green-400" },
  invoiced: { label: "Fatturato", color: "bg-primary/20 text-primary" },
};

const URGENCY_CONFIG: Record<string, { label: string; color: string }> = {
  normal: { label: "Normale", color: "bg-muted text-muted-foreground" },
  urgent: { label: "Urgente 🟡", color: "bg-yellow-500/20 text-yellow-400" },
  emergency: { label: "Emergenza 🔴", color: "bg-red-500/20 text-red-400" },
};

export default function InterventionsPage() {
  const { companyId, terminology } = useIndustry();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    client_name: "", client_phone: "", address: "", intervention_type: "",
    scheduled_at: "", technician_name: "", urgency: "normal", estimated_price: "", notes: "",
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["interventions", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase
        .from("interventions")
        .select("*")
        .eq("company_id", companyId!)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const addItem = useMutation({
    mutationFn: async () => {
      await supabase.from("interventions").insert({
        company_id: companyId!,
        client_name: form.client_name,
        client_phone: form.client_phone || null,
        address: form.address || null,
        intervention_type: form.intervention_type,
        scheduled_at: form.scheduled_at || null,
        technician_name: form.technician_name || null,
        urgency: form.urgency,
        estimated_price: form.estimated_price ? parseFloat(form.estimated_price) : null,
        notes: form.notes || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interventions"] });
      setOpen(false);
      setForm({ client_name: "", client_phone: "", address: "", intervention_type: "", scheduled_at: "", technician_name: "", urgency: "normal", estimated_price: "", notes: "" });
      toast.success("Intervento creato!");
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await supabase.from("interventions").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["interventions"] }),
  });

  const nextStatus: Record<string, string> = {
    requested: "scheduled", scheduled: "in_progress", in_progress: "completed", completed: "invoiced",
  };

  const filtered = items.filter((i: any) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return [i.client_name, i.address, i.technician_name].some(v => v?.toLowerCase().includes(q));
  });

  // KPI
  const today = new Date().toISOString().split("T")[0];
  const todayCount = items.filter((i: any) => i.scheduled_at?.startsWith(today)).length;
  const pendingCount = items.filter((i: any) => i.status === "requested").length;
  const completedWeek = items.filter((i: any) => i.status === "completed" && new Date(i.updated_at) > new Date(Date.now() - 7 * 86400000)).length;

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">🔧 {terminology.orders}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 min-h-[44px]"><Plus className="w-4 h-4 mr-2" /> Nuovo</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Nuovo {terminology.order}</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>Cliente *</Label><Input value={form.client_name} onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                <div><Label>Telefono</Label><Input value={form.client_phone} onChange={e => setForm(p => ({ ...p, client_phone: e.target.value }))} className="h-11 min-h-[44px]" /></div>
              </div>
              <div><Label>Tipo *</Label><Input value={form.intervention_type} onChange={e => setForm(p => ({ ...p, intervention_type: e.target.value }))} placeholder={terminology.category || "Tipo"} className="h-11 min-h-[44px]" /></div>
              <div><Label>Indirizzo</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="h-11 min-h-[44px]" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>Data/Ora</Label><Input type="datetime-local" value={form.scheduled_at} onChange={e => setForm(p => ({ ...p, scheduled_at: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                <div><Label>Tecnico</Label><Input value={form.technician_name} onChange={e => setForm(p => ({ ...p, technician_name: e.target.value }))} className="h-11 min-h-[44px]" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Label>Urgenza</Label>
                  <Select value={form.urgency} onValueChange={v => setForm(p => ({ ...p, urgency: v }))}>
                    <SelectTrigger className="h-11 min-h-[44px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(URGENCY_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Preventivo (€)</Label><Input type="number" value={form.estimated_price} onChange={e => setForm(p => ({ ...p, estimated_price: e.target.value }))} className="h-11 min-h-[44px]" /></div>
              </div>
              <div><Label>Note</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
              <Button className="w-full h-11 min-h-[44px]" onClick={() => addItem.mutate()} disabled={!form.client_name || !form.intervention_type}>Crea</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border/50"><CardContent className="p-3 text-center"><p className="text-2xl font-bold">{todayCount}</p><p className="text-xs text-muted-foreground">Oggi</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-3 text-center"><p className="text-2xl font-bold">{pendingCount}</p><p className="text-xs text-muted-foreground">In Attesa</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-3 text-center"><p className="text-2xl font-bold">{completedWeek}</p><p className="text-xs text-muted-foreground">Completati 7gg</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-3 text-center"><p className="text-2xl font-bold">{items.length}</p><p className="text-xs text-muted-foreground">Totale</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca..." className="pl-10 h-11 min-h-[44px]" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 h-11 min-h-[44px]"><SelectValue placeholder="Stato" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((item: any) => {
          const sc = STATUS_CONFIG[item.status] || STATUS_CONFIG.requested;
          const uc = URGENCY_CONFIG[item.urgency] || URGENCY_CONFIG.normal;
          const ns = nextStatus[item.status];
          return (
            <Card key={item.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{item.client_name}</p>
                      <Badge className={sc.color + " text-xs"}>{sc.label}</Badge>
                      {item.urgency !== "normal" && <Badge className={uc.color + " text-xs"}>{uc.label}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.intervention_type} · {item.address || "—"} · {item.technician_name || "Non assegnato"}
                    </p>
                    {item.scheduled_at && <p className="text-xs text-muted-foreground">📅 {new Date(item.scheduled_at).toLocaleString("it-IT")}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.estimated_price && <span className="text-sm font-bold">€{item.estimated_price}</span>}
                    {ns && (
                      <Button size="sm" className="h-10 min-h-[44px]" onClick={() => updateStatus.mutate({ id: item.id, status: ns })}>
                        {STATUS_CONFIG[ns]?.label || ns}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Nessun intervento trovato</p>}
      </div>
    </div>
  );
}
