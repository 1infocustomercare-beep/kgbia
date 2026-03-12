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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar, Users, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AppointmentsPage() {
  const { companyId, terminology } = useIndustry();
  const queryClient = useQueryClient();
  const [openAppt, setOpenAppt] = useState(false);
  const [openService, setOpenService] = useState(false);
  const [apptForm, setApptForm] = useState({
    client_name: "", client_phone: "", service_name: "", staff_name: "",
    scheduled_at: "", duration_minutes: "60", price: "", notes: "",
  });
  const [serviceForm, setServiceForm] = useState({ name: "", category: "", duration_minutes: "60", price: "", color: "#6B7280" });

  const { data: appointments = [], isLoading: loadingAppts } = useQuery({
    queryKey: ["appointments", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("appointments").select("*")
        .eq("company_id", companyId!).order("scheduled_at", { ascending: true });
      return data || [];
    },
  });

  const { data: services = [], isLoading: loadingSvc } = useQuery({
    queryKey: ["services", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*")
        .eq("company_id", companyId!).order("name");
      return data || [];
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["crm-clients-mini", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("crm_clients").select("first_name, last_name, phone")
        .eq("company_id", companyId!).limit(100);
      return data || [];
    },
  });

  const addAppt = useMutation({
    mutationFn: async () => {
      await supabase.from("appointments").insert({
        company_id: companyId!,
        client_name: apptForm.client_name,
        client_phone: apptForm.client_phone || null,
        service_name: apptForm.service_name || null,
        staff_name: apptForm.staff_name || null,
        scheduled_at: apptForm.scheduled_at,
        duration_minutes: parseInt(apptForm.duration_minutes) || 60,
        price: apptForm.price ? parseFloat(apptForm.price) : 0,
        notes: apptForm.notes || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setOpenAppt(false);
      setApptForm({ client_name: "", client_phone: "", service_name: "", staff_name: "", scheduled_at: "", duration_minutes: "60", price: "", notes: "" });
      toast.success("Appuntamento creato!");
    },
  });

  const addService = useMutation({
    mutationFn: async () => {
      await supabase.from("services").insert({
        company_id: companyId!,
        name: serviceForm.name,
        category: serviceForm.category || null,
        duration_minutes: parseInt(serviceForm.duration_minutes) || 60,
        price: serviceForm.price ? parseFloat(serviceForm.price) : 0,
        color: serviceForm.color,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setOpenService(false);
      setServiceForm({ name: "", category: "", duration_minutes: "60", price: "", color: "#6B7280" });
      toast.success("Servizio aggiunto!");
    },
  });

  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter((a: any) => a.scheduled_at?.startsWith(today));

  return (
    <div className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">📅 {terminology.orders}</h1>

      <Tabs defaultValue="agenda">
        <TabsList className="bg-secondary/50 overflow-x-auto">
          <TabsTrigger value="agenda" className="flex items-center gap-1"><Calendar className="w-4 h-4" />Agenda</TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-1"><Sparkles className="w-4 h-4" />Servizi</TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-1"><Users className="w-4 h-4" />Clienti</TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <p className="text-sm text-muted-foreground">Oggi: {todayAppts.length} appuntamenti</p>
            <Dialog open={openAppt} onOpenChange={setOpenAppt}>
              <DialogTrigger asChild>
                <Button className="h-11 min-h-[44px]"><Plus className="w-4 h-4 mr-2" /> Nuovo Appuntamento</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Nuovo Appuntamento</DialogTitle></DialogHeader>
                <div className="space-y-3 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label>Cliente *</Label><Input value={apptForm.client_name} onChange={e => setApptForm(p => ({ ...p, client_name: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                    <div><Label>Telefono</Label><Input value={apptForm.client_phone} onChange={e => setApptForm(p => ({ ...p, client_phone: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  </div>
                  <div><Label>Servizio</Label><Input value={apptForm.service_name} onChange={e => setApptForm(p => ({ ...p, service_name: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label>Data/Ora *</Label><Input type="datetime-local" value={apptForm.scheduled_at} onChange={e => setApptForm(p => ({ ...p, scheduled_at: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                    <div><Label>Durata (min)</Label><Input type="number" value={apptForm.duration_minutes} onChange={e => setApptForm(p => ({ ...p, duration_minutes: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label>Operatore</Label><Input value={apptForm.staff_name} onChange={e => setApptForm(p => ({ ...p, staff_name: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                    <div><Label>Prezzo (€)</Label><Input type="number" value={apptForm.price} onChange={e => setApptForm(p => ({ ...p, price: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  </div>
                  <div><Label>Note</Label><Textarea value={apptForm.notes} onChange={e => setApptForm(p => ({ ...p, notes: e.target.value }))} /></div>
                  <Button className="w-full h-11 min-h-[44px]" onClick={() => addAppt.mutate()} disabled={!apptForm.client_name || !apptForm.scheduled_at}>Crea</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loadingAppts ? <Skeleton className="h-32" /> : (
            <div className="space-y-2">
              {appointments.map((a: any) => (
                <Card key={a.id} className="border-border/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-1 h-12 rounded-full bg-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{a.client_name}</p>
                      <p className="text-xs text-muted-foreground">{a.service_name || "—"} · {a.staff_name || "—"} · {a.duration_minutes}min</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.scheduled_at).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" })}
                      </p>
                    </div>
                    {a.price > 0 && <Badge variant="outline">€{a.price}</Badge>}
                  </CardContent>
                </Card>
              ))}
              {appointments.length === 0 && <p className="text-center text-muted-foreground py-8">Nessun appuntamento</p>}
            </div>
          )}
        </TabsContent>

        <TabsContent value="services" className="mt-4 space-y-4">
          <Dialog open={openService} onOpenChange={setOpenService}>
            <DialogTrigger asChild>
              <Button className="h-11 min-h-[44px]"><Plus className="w-4 h-4 mr-2" /> Nuovo Servizio</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Nuovo Servizio</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-4">
                <div><Label>Nome *</Label><Input value={serviceForm.name} onChange={e => setServiceForm(p => ({ ...p, name: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Categoria</Label><Input value={serviceForm.category} onChange={e => setServiceForm(p => ({ ...p, category: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  <div><Label>Durata (min)</Label><Input type="number" value={serviceForm.duration_minutes} onChange={e => setServiceForm(p => ({ ...p, duration_minutes: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Prezzo (€)</Label><Input type="number" value={serviceForm.price} onChange={e => setServiceForm(p => ({ ...p, price: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  <div><Label>Colore</Label><input type="color" value={serviceForm.color} onChange={e => setServiceForm(p => ({ ...p, color: e.target.value }))} className="w-full h-11 rounded cursor-pointer" /></div>
                </div>
                <Button className="w-full h-11 min-h-[44px]" onClick={() => addService.mutate()} disabled={!serviceForm.name}>Aggiungi</Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((s: any) => (
              <Card key={s.id} className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <div className="flex-1">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.duration_minutes}min · €{s.price}</p>
                  </div>
                  <Badge variant={s.is_active ? "default" : "secondary"}>{s.is_active ? "Attivo" : "Inattivo"}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clients" className="mt-4">
          <div className="space-y-2">
            {clients.map((c: any, i: number) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                    {c.first_name?.[0]}{c.last_name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium">{c.first_name} {c.last_name}</p>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {clients.length === 0 && <p className="text-center text-muted-foreground py-8">Nessun cliente</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
