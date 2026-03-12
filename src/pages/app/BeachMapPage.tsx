import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Umbrella } from "lucide-react";
import { toast } from "sonner";

export default function BeachMapPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [bookingForm, setBookingForm] = useState({ client_name: "", client_phone: "", period: "full_day" });

  const { data: spots = [], isLoading } = useQuery({
    queryKey: ["beach-spots", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("beach_spots").select("*")
        .eq("company_id", companyId!).order("row_letter").order("spot_number");
      return data || [];
    },
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["beach-bookings-today", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase.from("beach_bookings").select("*")
        .eq("company_id", companyId!).eq("booking_date", today);
      return data || [];
    },
  });

  const addBooking = useMutation({
    mutationFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      await supabase.from("beach_bookings").insert({
        company_id: companyId!,
        spot_id: selectedSpot.id,
        client_name: bookingForm.client_name,
        client_phone: bookingForm.client_phone || null,
        booking_date: today,
        period: bookingForm.period,
        total: selectedSpot.price_daily || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beach-bookings-today"] });
      setSelectedSpot(null);
      setBookingForm({ client_name: "", client_phone: "", period: "full_day" });
      toast.success("Prenotazione confermata!");
    },
  });

  // Group spots by row
  const rows = spots.reduce((acc: Record<string, any[]>, s: any) => {
    if (!acc[s.row_letter]) acc[s.row_letter] = [];
    acc[s.row_letter].push(s);
    return acc;
  }, {});

  const bookedSpotIds = new Set(bookings.map((b: any) => b.spot_id));
  const occupiedCount = bookedSpotIds.size;
  const totalCount = spots.filter((s: any) => s.is_active).length;

  if (isLoading) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">🌊 Spiaggia Live</h1>
        <Badge variant="outline">{occupiedCount}/{totalCount} occupati</Badge>
      </div>

      {spots.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center text-muted-foreground">
            Nessuna postazione configurata. Vai nelle Impostazioni per configurare la spiaggia.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <div className="min-w-[300px] space-y-2">
            {Object.entries(rows).map(([letter, rowSpots]) => (
              <div key={letter} className="flex items-center gap-2">
                <span className="text-xs font-bold w-6 text-center text-muted-foreground">{letter}</span>
                <div className="flex gap-1 flex-wrap">
                  {(rowSpots as any[]).map(spot => {
                    const isBooked = bookedSpotIds.has(spot.id);
                    return (
                      <button
                        key={spot.id}
                        onClick={() => setSelectedSpot(spot)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all ${
                          !spot.is_active ? "bg-muted text-muted-foreground opacity-50" :
                          isBooked ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                          "bg-green-500/20 text-green-400 border border-green-500/30 hover:scale-105"
                        }`}
                      >
                        <Umbrella className="w-3 h-3" />
                        <span className="text-[9px]">{spot.spot_number}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Sheet */}
      <Sheet open={!!selectedSpot} onOpenChange={() => setSelectedSpot(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {selectedSpot?.row_letter}{selectedSpot?.spot_number} — {bookedSpotIds.has(selectedSpot?.id) ? "Occupato" : "Libero"}
            </SheetTitle>
          </SheetHeader>
          {selectedSpot && !bookedSpotIds.has(selectedSpot.id) && (
            <div className="space-y-4 mt-4">
              <div><Label>Nome Ospite *</Label><Input value={bookingForm.client_name} onChange={e => setBookingForm(p => ({ ...p, client_name: e.target.value }))} className="h-11 min-h-[44px]" /></div>
              <div><Label>Telefono</Label><Input value={bookingForm.client_phone} onChange={e => setBookingForm(p => ({ ...p, client_phone: e.target.value }))} className="h-11 min-h-[44px]" /></div>
              <div><Label>Prezzo</Label><p className="text-lg font-bold">€{selectedSpot.price_daily || 0}</p></div>
              <Button className="w-full h-11 min-h-[44px]" onClick={() => addBooking.mutate()} disabled={!bookingForm.client_name}>
                Conferma Prenotazione
              </Button>
            </div>
          )}
          {selectedSpot && bookedSpotIds.has(selectedSpot.id) && (
            <div className="mt-4">
              <p className="text-muted-foreground">Questo posto è già prenotato per oggi.</p>
              {bookings.filter((b: any) => b.spot_id === selectedSpot.id).map((b: any) => (
                <Card key={b.id} className="mt-3 border-border/50">
                  <CardContent className="p-4">
                    <p className="font-medium">{b.client_name}</p>
                    <p className="text-xs text-muted-foreground">{b.client_phone} · {b.period} · €{b.total}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
