import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Car, MapPin, Star, Phone, Mail, Shield, Clock, Users,
  Wifi, Zap, Music, ChevronRight, Calendar, ArrowRight
} from "lucide-react";
import { toast } from "sonner";

const FEATURE_ICONS: Record<string, any> = { WiFi: Wifi, USB: Zap, Audio: Music };

export default function NCCDemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", email: "", pickup: "", dropoff: "", date: "", passengers: "1", notes: "" });

  const { data: company } = useQuery({
    queryKey: ["ncc-company", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data } = await supabase.from("companies").select("*").eq("slug", slug).eq("industry", "ncc").maybeSingle();
      return data as any;
    },
    enabled: !!slug,
  });

  const companyId = company?.id;

  const { data: vehicles = [] } = useQuery({
    queryKey: ["ncc-fleet-public", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("fleet_vehicles").select("*").eq("company_id", companyId!).eq("is_active", true);
      return data || [];
    },
    enabled: !!companyId,
  });

  const { data: routes = [] } = useQuery({
    queryKey: ["ncc-routes-public", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("ncc_routes").select("*").eq("company_id", companyId!).eq("is_active", true);
      return data || [];
    },
    enabled: !!companyId,
  });

  const { data: destinations = [] } = useQuery({
    queryKey: ["ncc-dest-public", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("ncc_destinations").select("*").eq("company_id", companyId!);
      return data || [];
    },
    enabled: !!companyId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["ncc-reviews-public", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("ncc_reviews").select("*").eq("company_id", companyId!).eq("is_public", true).order("created_at", { ascending: false }).limit(6);
      return data || [];
    },
    enabled: !!companyId,
  });

  const handleBooking = async () => {
    if (!companyId || !bookingForm.name || !bookingForm.pickup || !bookingForm.dropoff || !bookingForm.date) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    const { error } = await supabase.from("ncc_bookings").insert({
      company_id: companyId,
      customer_name: bookingForm.name,
      customer_phone: bookingForm.phone,
      customer_email: bookingForm.email,
      pickup_address: bookingForm.pickup,
      dropoff_address: bookingForm.dropoff,
      pickup_datetime: new Date(bookingForm.date).toISOString(),
      passengers: parseInt(bookingForm.passengers) || 1,
      notes: bookingForm.notes || null,
    });
    if (error) { toast.error("Errore nella prenotazione"); return; }
    toast.success("Prenotazione inviata! Ti contatteremo a breve.");
    setBookingForm({ name: "", phone: "", email: "", pickup: "", dropoff: "", date: "", passengers: "1", notes: "" });
  };

  const primaryColor = company?.primary_color || "#2563EB";

  if (!company) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Caricamento...</div>;
  }

  const services = [
    { label: "Transfer Aeroporto", icon: "✈️" },
    { label: "Viaggi Business", icon: "💼" },
    { label: "Eventi & Cerimonie", icon: "🎉" },
    { label: "Tour Personalizzati", icon: "🗺️" },
    { label: "Servizio H24", icon: "🌙" },
    { label: "Comfort Premium", icon: "⭐" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {company.logo_url && <img src={company.logo_url} alt="" className="h-8 w-8 rounded" />}
            <span className="font-bold text-lg">{company.name}</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm">
            <a href="#servizi" className="hover:text-primary transition-colors">Servizi</a>
            <a href="#flotta" className="hover:text-primary transition-colors">Flotta</a>
            <a href="#tratte" className="hover:text-primary transition-colors">Tratte</a>
            <a href="#recensioni" className="hover:text-primary transition-colors">Recensioni</a>
            <a href="#prenota" className="hover:text-primary transition-colors">Prenota</a>
          </div>
          <Button size="sm" asChild><a href="#prenota">Prenota Ora</a></Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold font-heading mb-4">
            {company.tagline || "Il tuo viaggio, la nostra eccellenza"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground mb-8">
            Servizio NCC premium con {company.name}. Comfort, puntualità e sicurezza in ogni trasferimento.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-3 justify-center">
            <Button size="lg" asChild><a href="#prenota"><Calendar className="w-4 h-4 mr-2" />Prenota Transfer</a></Button>
            <Button size="lg" variant="outline" asChild><a href="#flotta">Scopri la Flotta</a></Button>
          </motion.div>
        </div>
      </section>

      {/* Services Marquee */}
      <section id="servizi" className="py-12 border-y border-border/30 overflow-hidden">
        <div className="flex animate-marquee gap-8">
          {[...services, ...services].map((s, i) => (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full bg-secondary/50 text-sm flex-shrink-0">
              <span>{s.icon}</span><span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Fleet */}
      {vehicles.length > 0 && (
        <section id="flotta" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 font-heading">La Nostra Flotta</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v: any) => (
                <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <Card className="border-border/50 overflow-hidden">
                    {v.image_url && <img src={v.image_url} alt={v.name} className="w-full h-48 object-cover" />}
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{v.name}</h3>
                        <Badge variant="outline" className="capitalize">{v.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {v.brand} {v.model} {v.year && `• ${v.year}`}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {v.capacity} posti</span>
                        {v.base_price > 0 && <span>da €{Number(v.base_price).toFixed(0)}</span>}
                      </div>
                      {v.features && v.features.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {v.features.map((f: string) => (
                            <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Routes */}
      {routes.length > 0 && (
        <section id="tratte" className="py-16 px-4 bg-secondary/20">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 font-heading">Tratte Disponibili</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes.map((r: any) => (
                <Card key={r.id} className="border-border/50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{r.origin}</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span>{r.destination}</span>
                      </div>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        {r.distance_km && <span>{r.distance_km} km</span>}
                        {r.duration_min && <span><Clock className="w-3 h-3 inline mr-1" />{r.duration_min} min</span>}
                      </div>
                    </div>
                    <span className="text-lg font-bold text-primary">€{Number(r.base_price).toFixed(0)}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section id="recensioni" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 font-heading">Recensioni Clienti</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((r: any) => (
                <Card key={r.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-primary fill-primary" : "text-muted"}`} />
                      ))}
                    </div>
                    {r.comment && <p className="text-sm text-muted-foreground mb-2">"{r.comment}"</p>}
                    <p className="text-xs font-medium">{r.customer_name || "Cliente"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Form */}
      <section id="prenota" className="py-16 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-8 font-heading">Prenota il Tuo Transfer</h2>
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Nome *</Label><Input value={bookingForm.name} onChange={e => setBookingForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div><Label>Telefono</Label><Input value={bookingForm.phone} onChange={e => setBookingForm(p => ({ ...p, phone: e.target.value }))} /></div>
              </div>
              <div><Label>Email</Label><Input type="email" value={bookingForm.email} onChange={e => setBookingForm(p => ({ ...p, email: e.target.value }))} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Punto di Ritiro *</Label><Input value={bookingForm.pickup} onChange={e => setBookingForm(p => ({ ...p, pickup: e.target.value }))} placeholder="Es. Aeroporto Fiumicino" /></div>
                <div><Label>Destinazione *</Label><Input value={bookingForm.dropoff} onChange={e => setBookingForm(p => ({ ...p, dropoff: e.target.value }))} placeholder="Es. Hotel Roma Centro" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Data e Ora *</Label><Input type="datetime-local" value={bookingForm.date} onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))} /></div>
                <div><Label>Passeggeri</Label><Input type="number" min="1" max="20" value={bookingForm.passengers} onChange={e => setBookingForm(p => ({ ...p, passengers: e.target.value }))} /></div>
              </div>
              <div><Label>Note</Label><Textarea value={bookingForm.notes} onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))} placeholder="Richieste speciali..." /></div>
              <Button onClick={handleBooking} size="lg" className="w-full">
                <Calendar className="w-4 h-4 mr-2" /> Invia Prenotazione
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/30">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {company.name}. Tutti i diritti riservati.</p>
          <div className="flex justify-center gap-4 mt-2">
            {company.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{company.phone}</span>}
            {company.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{company.email}</span>}
          </div>
        </div>
      </footer>
    </div>
  );
}
