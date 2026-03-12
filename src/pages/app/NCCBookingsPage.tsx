import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, MapPin, Car, Clock, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  pickup_address: string;
  dropoff_address: string;
  pickup_datetime: string;
  passengers: number;
  status: string;
  total_price: number;
  notes: string | null;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "In Attesa", color: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" },
  confirmed: { label: "Confermata", color: "bg-blue-400/10 text-blue-400 border-blue-400/30" },
  in_progress: { label: "In Corso", color: "bg-purple-400/10 text-purple-400 border-purple-400/30" },
  completed: { label: "Completata", color: "bg-green-400/10 text-green-400 border-green-400/30" },
  cancelled: { label: "Annullata", color: "bg-red-400/10 text-red-400 border-red-400/30" },
};

export default function NCCBookingsPage() {
  const { companyId } = useIndustry();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("all");

  const fetchBookings = async () => {
    if (!companyId) return;
    const { data } = await supabase.from("ncc_bookings" as any).select("*").eq("company_id", companyId).order("pickup_datetime", { ascending: false });
    if (data) setBookings(data as unknown as Booking[]);
  };

  useEffect(() => { fetchBookings(); }, [companyId]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("ncc_bookings" as any).update({ status }).eq("id", id);
    fetchBookings();
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">Prenotazioni NCC</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[160px] bg-secondary/50"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte</SelectItem>
            {Object.entries(STATUS_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((b) => {
            const st = STATUS_MAP[b.status] || STATUS_MAP.pending;
            return (
              <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="glass border-border/50">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{b.customer_name}</span>
                          {b.customer_phone && <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{b.customer_phone}</span>}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <MapPin className="w-3 h-3 text-green-400" />
                          <span>{b.pickup_address}</span>
                          <span>→</span>
                          <MapPin className="w-3 h-3 text-red-400" />
                          <span>{b.dropoff_address}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(b.pickup_datetime).toLocaleDateString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                          <span>{b.passengers} pass.</span>
                          {b.total_price > 0 && <span className="font-semibold text-primary">€{b.total_price}</span>}
                        </div>
                        {b.notes && <p className="text-xs text-muted-foreground mt-1">{b.notes}</p>}
                      </div>
                      <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                        <SelectTrigger className={`w-[140px] text-xs border ${st.color}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_MAP).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">Nessuna prenotazione</p>
          </div>
        )}
      </div>
    </div>
  );
}
