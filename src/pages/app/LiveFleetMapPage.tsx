import { useIndustry } from "@/hooks/useIndustry";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Car, MapPin, User, Clock, Fuel } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const STATUS_COLOR: Record<string, string> = {
  available: "bg-emerald-500", in_ride: "bg-blue-500", paused: "bg-amber-500", maintenance: "bg-red-500",
};
const STATUS_LABEL: Record<string, string> = {
  available: "Disponibile", in_ride: "In Corsa", paused: "In Pausa", maintenance: "Manutenzione",
};

export default function LiveFleetMapPage() {
  const { companyId } = useIndustry();
  const [selected, setSelected] = useState<any>(null);

  const { data: vehicles = [] } = useQuery({
    queryKey: ["fleet-live", companyId],
    enabled: !!companyId,
    refetchInterval: 10000,
    queryFn: async () => {
      const { data } = await supabase.from("fleet_vehicles").select("*")
        .eq("company_id", companyId!).eq("is_active", true);
      return data || [];
    },
  });

  const { data: todayBookings = [] } = useQuery({
    queryKey: ["today-bookings", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase.from("ncc_bookings").select("*")
        .eq("company_id", companyId!)
        .gte("pickup_datetime", today + "T00:00:00")
        .lte("pickup_datetime", today + "T23:59:59")
        .order("pickup_datetime");
      return data || [];
    },
  });

  // Simulate statuses
  const vehiclesWithStatus = vehicles.map((v: any, i: number) => ({
    ...v,
    liveStatus: ["available", "in_ride", "paused", "available", "in_ride", "maintenance"][i % 6],
    lat: 40.85 + (Math.random() * 0.1 - 0.05),
    lng: 14.25 + (Math.random() * 0.1 - 0.05),
    kmToday: Math.round(50 + Math.random() * 200),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          Flotta Live
        </h1>
        <div className="flex gap-2">
          {Object.entries(STATUS_LABEL).map(([k, v]) => (
            <Badge key={k} variant="outline" className="text-[10px] gap-1">
              <div className={`w-2 h-2 rounded-full ${STATUS_COLOR[k]}`} />{v}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map placeholder */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-0 relative h-[500px] bg-gradient-to-br from-muted/20 to-muted/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Simulated map grid */}
                  <div className="absolute inset-4 border border-dashed border-border/30 rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-sm">
                    🗺️ Mappa Flotta (Leaflet)
                  </div>
                  {/* Vehicle pins */}
                  {vehiclesWithStatus.map((v: any, i: number) => (
                    <motion.div
                      key={v.id}
                      className="absolute cursor-pointer"
                      style={{ left: `${20 + (i * 12) % 60}%`, top: `${20 + (i * 15) % 55}%` }}
                      whileHover={{ scale: 1.3 }}
                      onClick={() => setSelected(v)}
                    >
                      <div className={`w-8 h-8 rounded-full ${STATUS_COLOR[v.liveStatus]} flex items-center justify-center shadow-lg ring-2 ring-background`}>
                        <Car className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-[10px] text-center mt-0.5 font-medium">{v.name?.split(" ")[0]}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's rides */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />Corse oggi ({todayBookings.length})
          </h3>
          <div className="space-y-2 max-h-[460px] overflow-y-auto">
            {todayBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">Nessuna corsa oggi</p>
            ) : todayBookings.map((b: any) => (
              <Card key={b.id} className="border-border/30">
                <CardContent className="p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{b.customer_name}</span>
                    <Badge variant="outline" className="text-[10px]">{b.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{b.pickup_address} → {b.dropoff_address}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(b.pickup_datetime).toLocaleTimeString("it", { hour: "2-digit", minute: "2-digit" })} • {b.passengers} pax
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle detail sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent>
          {selected && (
            <div className="space-y-4">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />{selected.name}
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${STATUS_COLOR[selected.liveStatus]}`} />
                  <span className="text-sm">{STATUS_LABEL[selected.liveStatus]}</span>
                </div>
                {selected.plate && <p className="text-sm text-muted-foreground">Targa: {selected.plate}</p>}
                <p className="text-sm text-muted-foreground">Km oggi: {selected.kmToday}</p>
                <p className="text-sm text-muted-foreground">Capacità: {selected.capacity} pax</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
