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
import { Calendar, Users, Plus } from "lucide-react";
import { toast } from "sonner";

export default function TeamPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [openShift, setOpenShift] = useState(false);
  const [shiftForm, setShiftForm] = useState({ staff_name: "", shift_date: "", start_time: "08:00", end_time: "16:00", notes: "" });

  const { data: staff = [], isLoading: loadingStaff } = useQuery({
    queryKey: ["team-staff", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("staff").select("*")
        .eq("company_id", companyId!).order("full_name");
      return data || [];
    },
  });

  const { data: shifts = [] } = useQuery({
    queryKey: ["team-shifts", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("staff_shifts").select("*")
        .eq("company_id", companyId!).order("shift_date", { ascending: false }).limit(50);
      return data || [];
    },
  });

  const addShift = useMutation({
    mutationFn: async () => {
      await supabase.from("staff_shifts").insert({
        company_id: companyId!,
        staff_name: shiftForm.staff_name,
        shift_date: shiftForm.shift_date,
        start_time: shiftForm.start_time,
        end_time: shiftForm.end_time,
        notes: shiftForm.notes || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-shifts"] });
      setOpenShift(false);
      setShiftForm({ staff_name: "", shift_date: "", start_time: "08:00", end_time: "16:00", notes: "" });
      toast.success("Turno aggiunto!");
    },
  });

  const today = new Date().toISOString().split("T")[0];
  const todayShifts = shifts.filter((s: any) => s.shift_date === today);

  return (
    <div className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">👥 Team</h1>

      <Tabs defaultValue="members">
        <TabsList className="bg-secondary/50 overflow-x-auto">
          <TabsTrigger value="members" className="flex items-center gap-1"><Users className="w-4 h-4" />Membri</TabsTrigger>
          <TabsTrigger value="shifts" className="flex items-center gap-1"><Calendar className="w-4 h-4" />Turni</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4 space-y-2">
          {loadingStaff ? <Skeleton className="h-32" /> : (
            <>
              {staff.map((s: any) => (
                <Card key={s.id} className="border-border/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                      {s.full_name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{s.full_name}</p>
                      <p className="text-xs text-muted-foreground">{s.role} · {s.email || s.phone || "—"}</p>
                    </div>
                    <Badge variant={s.is_active ? "default" : "secondary"}>{s.is_active ? "Attivo" : "Inattivo"}</Badge>
                  </CardContent>
                </Card>
              ))}
              {staff.length === 0 && <p className="text-center text-muted-foreground py-8">Nessun membro del team. Aggiungili dalla sezione Staff.</p>}
            </>
          )}
        </TabsContent>

        <TabsContent value="shifts" className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            {todayShifts.length > 0 && <p className="text-sm text-muted-foreground">Oggi: {todayShifts.map((s: any) => s.staff_name).join(", ")}</p>}
            <Dialog open={openShift} onOpenChange={setOpenShift}>
              <DialogTrigger asChild>
                <Button className="h-11 min-h-[44px]"><Plus className="w-4 h-4 mr-2" /> Nuovo Turno</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Nuovo Turno</DialogTitle></DialogHeader>
                <div className="space-y-3 pt-4">
                  <div><Label>Nome *</Label><Input value={shiftForm.staff_name} onChange={e => setShiftForm(p => ({ ...p, staff_name: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  <div><Label>Data *</Label><Input type="date" value={shiftForm.shift_date} onChange={e => setShiftForm(p => ({ ...p, shift_date: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Inizio</Label><Input type="time" value={shiftForm.start_time} onChange={e => setShiftForm(p => ({ ...p, start_time: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                    <div><Label>Fine</Label><Input type="time" value={shiftForm.end_time} onChange={e => setShiftForm(p => ({ ...p, end_time: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  </div>
                  <Button className="w-full h-11 min-h-[44px]" onClick={() => addShift.mutate()} disabled={!shiftForm.staff_name || !shiftForm.shift_date}>Aggiungi</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            {shifts.map((s: any) => (
              <Card key={s.id} className="border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{s.staff_name}</p>
                    <p className="text-xs text-muted-foreground">{s.shift_date} · {s.start_time} - {s.end_time}</p>
                  </div>
                  {s.notes && <Badge variant="outline" className="text-xs">{s.notes}</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
