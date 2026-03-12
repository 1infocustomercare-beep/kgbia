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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, Users, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function NCCBeachBookingsPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [openBooking, setOpenBooking] = useState(false);
  const [openPass, setOpenPass] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    client_name: "", client_phone: "", spot_number: "", period: "full_day", total: "",
  });
  const [passForm, setPassForm] = useState({
    client_name: "", client_phone: "", spot_number: "", pass_type: "monthly",
    start_date: "", end_date: "", price: "",
  });

  // Bookings query
  const { data: bookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ["beach-bookings", companyId, selectedDate],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase
        .from("beach_bookings")
        .select("*")
        .eq("company_id", companyId!)
        .eq("booking_date", selectedDate)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  // Passes query
  const { data: passes = [], isLoading: loadingPasses } = useQuery({
    queryKey: ["beach-passes", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase
        .from("beach_passes")
        .select("*")
        .eq("company_id", companyId!)
        .order("start_date", { ascending: false });
      return data || [];
    },
  });

  // Spots for reference
  const { data: spots = [] } = useQuery({
    queryKey: ["beach-spots-ref", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("beach_spots").select("*")
        .eq("company_id", companyId!).eq("is_active", true).order("row_letter").order("spot_number");
      return data || [];
    },
  });

  const addBooking = useMutation({
    mutationFn: async () => {
      const spot = spots.find((s: any) => `${s.row_letter}${s.spot_number}` === bookingForm.spot_number);
      await supabase.from("beach_bookings").insert({
        company_id: companyId!,
        spot_id: spot?.id || null,
        client_name: bookingForm.client_name,
        client_phone: bookingForm.client_phone || null,
        booking_date: selectedDate,
        period: bookingForm.period,
        total: bookingForm.total ? parseFloat(bookingForm.total) : 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beach-bookings"] });
      setOpenBooking(false);
      setBookingForm({ client_name: "", client_phone: "", spot_number: "", period: "full_day", total: "" });
      toast.success("Prenotazione aggiunta!");
    },
  });

  const addPass = useMutation({
    mutationFn: async () => {
      const spot = spots.find((s: any) => `${s.row_letter}${s.spot_number}` === passForm.spot_number);
      await supabase.from("beach_passes").insert({
        company_id: companyId!,
        spot_id: spot?.id || null,
        client_name: passForm.client_name,
        client_phone: passForm.client_phone || null,
        pass_type: passForm.pass_type,
        start_date: passForm.start_date || null,
        end_date: passForm.end_date || null,
        price: passForm.price ? parseFloat(passForm.price) : 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beach-passes"] });
      setOpenPass(false);
      setPassForm({ client_name: "", client_phone: "", spot_number: "", pass_type: "monthly", start_date: "", end_date: "", price: "" });
      toast.success("Abbonamento creato!");
    },
  });

  // KPI
  const todayRevenue = bookings.reduce((s: number, b: any) => s + (b.total || 0), 0);
  const activePasses = passes.filter((p: any) => p.is_active).length;
  const occupancyRate = spots.length > 0 ? Math.round((bookings.length / spots.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">🏖️ Prenotazioni Spiaggia</h1>

      {/* KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border/50"><CardContent className="p-3 text-center"><p className="text-2xl font-bold">{bookings.length}</p><p className="text-xs text-muted-foreground">Prenotazioni oggi</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-3 text-center"><p className="text-2xl font-bold">€{todayRevenue.toLocaleString("it-IT")}</p><p className="text-xs text-muted-foreground">Incasso oggi</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-3 text-center"><p className="text-2xl font-bold">{occupancyRate}%</p><p className="text-xs text-muted-foreground">Occupazione</p></CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-3 text-center"><p className="text-2xl font-bold">{activePasses}</p><p className="text-xs text-muted-foreground">Abbonati attivi</p></CardContent></Card>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList className="bg-secondary/50 overflow-x-auto">
          <TabsTrigger value="bookings" className="flex items-center gap-1"><Calendar className="w-4 h-4" />Prenotazioni</TabsTrigger>
          <TabsTrigger value="passes" className="flex items-center gap-1"><CreditCard className="w-4 h-4" />Abbonamenti</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full sm:w-48 h-11 min-h-[44px]" />
            <Dialog open={openBooking} onOpenChange={setOpenBooking}>
              <DialogTrigger asChild>
                <Button className="h-11 min-h-[44px]"><Plus className="w-4 h-4 mr-2" /> Nuova Prenotazione</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Nuova Prenotazione</DialogTitle></DialogHeader>
                <div className="space-y-3 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label>Nome Ospite *</Label><Input value={bookingForm.client_name} onChange={e => setBookingForm(p => ({ ...p, client_name: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                    <div><Label>Telefono</Label><Input value={bookingForm.client_phone} onChange={e => setBookingForm(p => ({ ...p, client_phone: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label>Postazione (es. A1)</Label><Input value={bookingForm.spot_number} onChange={e => setBookingForm(p => ({ ...p, spot_number: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                    <div><Label>Periodo</Label>
                      <Select value={bookingForm.period} onValueChange={v => setBookingForm(p => ({ ...p, period: v }))}>
                        <SelectTrigger className="h-11 min-h-[44px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Mattina</SelectItem>
                          <SelectItem value="afternoon">Pomeriggio</SelectItem>
                          <SelectItem value="full_day">Giornata intera</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div><Label>Importo (€)</Label><Input type="number" value={bookingForm.total} onChange={e => setBookingForm(p => ({ ...p, total: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  <Button className="w-full h-11 min-h-[44px]" onClick={() => addBooking.mutate()} disabled={!bookingForm.client_name}>Conferma</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loadingBookings ? <Skeleton className="h-32" /> : (
            <div className="space-y-2">
              {bookings.map((b: any) => (
                <Card key={b.id} className="border-border/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{b.client_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.client_phone || "—"} · {b.period === "morning" ? "Mattina" : b.period === "afternoon" ? "Pomeriggio" : "Giornata"}
                      </p>
                    </div>
                    <Badge variant="outline">€{b.total || 0}</Badge>
                    <Badge className={b.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>{b.status}</Badge>
                  </CardContent>
                </Card>
              ))}
              {bookings.length === 0 && <p className="text-center text-muted-foreground py-8">Nessuna prenotazione per questa data</p>}
            </div>
          )}
        </TabsContent>

        <TabsContent value="passes" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Dialog open={openPass} onOpenChange={setOpenPass}>
              <DialogTrigger asChild>
                <Button className="h-11 min-h-[44px]"><Plus className="w-4 h-4 mr-2" /> Nuovo Abbonamento</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Nuovo Abbonamento</DialogTitle></DialogHeader>
                <div className="space-y-3 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label>Nome *</Label><Input value={passForm.client_name} onChange={e => setPassForm(p => ({ ...p, client_name: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                    <div><Label>Telefono</Label><Input value={passForm.client_phone} onChange={e => setPassForm(p => ({ ...p, client_phone: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label>Postazione</Label><Input value={passForm.spot_number} onChange={e => setPassForm(p => ({ ...p, spot_number: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                    <div><Label>Tipo</Label>
                      <Select value={passForm.pass_type} onValueChange={v => setPassForm(p => ({ ...p, pass_type: v }))}>
                        <SelectTrigger className="h-11 min-h-[44px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Settimanale</SelectItem>
                          <SelectItem value="monthly">Mensile</SelectItem>
                          <SelectItem value="seasonal">Stagionale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div><Label>Dal</Label><Input type="date" value={passForm.start_date} onChange={e => setPassForm(p => ({ ...p, start_date: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                    <div><Label>Al</Label><Input type="date" value={passForm.end_date} onChange={e => setPassForm(p => ({ ...p, end_date: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  </div>
                  <div><Label>Prezzo (€)</Label><Input type="number" value={passForm.price} onChange={e => setPassForm(p => ({ ...p, price: e.target.value }))} className="h-11 min-h-[44px]" /></div>
                  <Button className="w-full h-11 min-h-[44px]" onClick={() => addPass.mutate()} disabled={!passForm.client_name}>Crea Abbonamento</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loadingPasses ? <Skeleton className="h-32" /> : (
            <div className="space-y-2">
              {passes.map((p: any) => (
                <Card key={p.id} className="border-border/50">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{p.client_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.pass_type === "weekly" ? "Settimanale" : p.pass_type === "monthly" ? "Mensile" : "Stagionale"} · {p.start_date} → {p.end_date}
                      </p>
                    </div>
                    <Badge variant="outline">€{p.price || 0}</Badge>
                    <Badge className={p.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                      {p.is_active ? "Attivo" : "Scaduto"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
              {passes.length === 0 && <p className="text-center text-muted-foreground py-8">Nessun abbonamento</p>}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
