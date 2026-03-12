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
  Wifi, Zap, Music, Calendar, ArrowRight, CheckCircle,
  Globe, Award, Headphones, Navigation
} from "lucide-react";
import { toast } from "sonner";

export default function NCCDemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", email: "", pickup: "", dropoff: "", date: "", passengers: "1", notes: "" });
  const [submitting, setSubmitting] = useState(false);

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
      const { data } = await supabase.from("fleet_vehicles").select("*").eq("company_id", companyId!).eq("is_active", true).order("base_price");
      return data || [];
    },
    enabled: !!companyId,
  });

  const { data: routes = [] } = useQuery({
    queryKey: ["ncc-routes-public", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("ncc_routes").select("*").eq("company_id", companyId!).eq("is_active", true).order("base_price");
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
    setSubmitting(true);
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
    setSubmitting(false);
    if (error) { toast.error("Errore nella prenotazione"); return; }
    toast.success("Prenotazione inviata! Ti contatteremo a breve.");
    setBookingForm({ name: "", phone: "", email: "", pickup: "", dropoff: "", date: "", passengers: "1", notes: "" });
  };

  const primaryColor = company?.primary_color || "#2563EB";

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const services = [
    { label: "Transfer Aeroporto", icon: "✈️" },
    { label: "Viaggi Business", icon: "💼" },
    { label: "Eventi & Cerimonie", icon: "🎉" },
    { label: "Tour Personalizzati", icon: "🗺️" },
    { label: "Servizio H24", icon: "🌙" },
    { label: "Comfort Premium", icon: "⭐" },
    { label: "Transfer Porto", icon: "🚢" },
    { label: "City Tour", icon: "🏛️" },
  ];

  const whyUsItems = [
    { icon: Shield, title: "Sicurezza Garantita", desc: "Veicoli revisionati, assicurazione completa e autisti certificati" },
    { icon: Clock, title: "Puntualità Assoluta", desc: "Monitoraggio voli in tempo reale e arrivo con 15 min di anticipo" },
    { icon: Award, title: "Flotta Premium", desc: "Solo veicoli di ultima generazione con massimo comfort" },
    { icon: Headphones, title: "Assistenza H24", desc: "Supporto clienti disponibile 7 giorni su 7, 24 ore su 24" },
    { icon: Globe, title: "Multilingue", desc: "Autisti che parlano italiano, inglese e altre lingue" },
    { icon: Navigation, title: "Prezzo Fisso", desc: "Nessun sovrapprezzo per traffico, pedaggi o attese brevi" },
  ];

  const avgRating = reviews.length > 0 ? (reviews.reduce((a: number, r: any) => a + r.rating, 0) / reviews.length).toFixed(1) : "5.0";

  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {company.logo_url && <img src={company.logo_url} alt="" className="h-7 w-7 md:h-8 md:w-8 rounded-lg object-cover flex-shrink-0" />}
            <span className="font-bold text-sm md:text-lg font-heading truncate">{company.name}</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm">
            <a href="#servizi" className="hover:text-primary transition-colors">Servizi</a>
            <a href="#flotta" className="hover:text-primary transition-colors">Flotta</a>
            <a href="#tratte" className="hover:text-primary transition-colors">Tratte</a>
            {destinations.length > 0 && <a href="#destinazioni" className="hover:text-primary transition-colors">Tour</a>}
            <a href="#recensioni" className="hover:text-primary transition-colors">Recensioni</a>
          </div>
          <Button size="sm" className="text-xs md:text-sm flex-shrink-0" asChild><a href="#prenota">Prenota</a></Button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto text-center max-w-3xl relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-primary" /> {avgRating} — {reviews.length > 0 ? `${reviews.length}+ recensioni` : "Servizio eccellente"}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-4xl md:text-6xl font-bold font-heading mb-4 leading-tight">
            {company.tagline || "Il tuo viaggio, la nostra eccellenza"}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Servizio NCC premium con <strong>{company.name}</strong>. Comfort, puntualità e sicurezza in ogni trasferimento.
            {company.city && ` Basati a ${company.city}.`}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild className="text-base"><a href="#prenota"><Calendar className="w-4 h-4 mr-2" />Prenota Transfer</a></Button>
            <Button size="lg" variant="outline" asChild className="text-base"><a href="#flotta">Scopri la Flotta</a></Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-primary" />NCC Autorizzato</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />Disponibile H24</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary" />Prezzo Fisso Garantito</span>
          </motion.div>
        </div>
      </section>

      {/* ── Services Marquee ────────────────────────────── */}
      <section id="servizi" className="py-8 border-y border-border/30 overflow-hidden">
        <div className="flex animate-marquee gap-6">
          {[...services, ...services, ...services].map((s, i) => (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-full bg-secondary/50 text-sm flex-shrink-0 font-medium">
              <span className="text-lg">{s.icon}</span><span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Us ──────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 font-heading">Perché Scegliere Noi</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">
            Un servizio NCC pensato per chi non accetta compromessi su comfort e affidabilità
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUsItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="border-border/50 h-full hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <item.icon className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-bold text-base mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fleet ───────────────────────────────────────── */}
      {vehicles.length > 0 && (
        <section id="flotta" className="py-16 px-4 bg-secondary/10">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 font-heading">La Nostra Flotta</h2>
            <p className="text-center text-muted-foreground mb-10">{vehicles.length} veicoli premium per ogni esigenza</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.map((v: any, i: number) => (
                <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Card className="border-border/50 overflow-hidden h-full hover:shadow-lg transition-shadow">
                    {v.image_url ? (
                      <img src={v.image_url} alt={v.name} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-secondary/30 flex items-center justify-center">
                        <Car className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-base">{v.name}</h3>
                        <Badge variant="outline" className="capitalize text-xs">{v.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {v.brand} {v.model} {v.year && `• ${v.year}`}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" />{v.capacity} posti</span>
                        {v.base_price > 0 && <span className="font-semibold text-foreground">da €{Number(v.base_price).toFixed(0)}</span>}
                      </div>
                      {v.features && v.features.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {v.features.map((f: string) => (
                            <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
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

      {/* ── Routes ──────────────────────────────────────── */}
      {routes.length > 0 && (
        <section id="tratte" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 font-heading">Tratte & Tariffe</h2>
            <p className="text-center text-muted-foreground mb-10">Prezzi fissi, nessun sovrapprezzo</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {routes.map((r: any, i: number) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                  <Card className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sm font-medium mb-2">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="truncate">{r.origin}</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{r.destination}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          {r.distance_km && <span>{r.distance_km} km</span>}
                          {r.duration_min && <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{r.duration_min} min</span>}
                        </div>
                        <span className="text-lg font-bold text-primary">€{Number(r.base_price).toFixed(0)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Destinations ────────────────────────────────── */}
      {destinations.length > 0 && (
        <section id="destinazioni" className="py-16 px-4 bg-secondary/10">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 font-heading">Tour & Escursioni</h2>
            <p className="text-center text-muted-foreground mb-10">Scopri le nostre destinazioni più richieste</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {destinations.map((d: any, i: number) => (
                <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Card className="border-border/50 overflow-hidden h-full hover:shadow-lg transition-shadow">
                    {d.image_url ? (
                      <img src={d.image_url} alt={d.name} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <MapPin className="w-10 h-10 text-primary/30" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{d.name}</h3>
                        {d.is_featured && <Badge variant="default" className="text-[9px]">In evidenza</Badge>}
                      </div>
                      {d.description && <p className="text-sm text-muted-foreground">{d.description}</p>}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Reviews ─────────────────────────────────────── */}
      {reviews.length > 0 && (
        <section id="recensioni" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2 font-heading">Cosa Dicono i Clienti</h2>
            <p className="text-center text-muted-foreground mb-10">
              <Star className="w-4 h-4 inline text-primary fill-primary" /> {avgRating}/5 — basato su {reviews.length}+ recensioni
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {reviews.map((r: any) => (
                <Card key={r.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < r.rating ? "text-primary fill-primary" : "text-muted"}`} />
                      ))}
                    </div>
                    {r.comment && <p className="text-sm text-muted-foreground mb-3 italic">"{r.comment}"</p>}
                    <p className="text-xs font-semibold">{r.customer_name || "Cliente"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Booking Form ────────────────────────────────── */}
      <section id="prenota" className="py-16 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-2 font-heading">Prenota il Tuo Transfer</h2>
          <p className="text-center text-muted-foreground mb-8">Compila il modulo e ti confermeremo entro pochi minuti</p>
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Nome Completo *</Label><Input placeholder="Mario Rossi" value={bookingForm.name} onChange={e => setBookingForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div><Label>Telefono</Label><Input placeholder="+39 333 1234567" value={bookingForm.phone} onChange={e => setBookingForm(p => ({ ...p, phone: e.target.value }))} /></div>
              </div>
              <div><Label>Email</Label><Input type="email" placeholder="mario@email.com" value={bookingForm.email} onChange={e => setBookingForm(p => ({ ...p, email: e.target.value }))} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Punto di Ritiro *</Label><Input value={bookingForm.pickup} onChange={e => setBookingForm(p => ({ ...p, pickup: e.target.value }))} placeholder="Es. Aeroporto Fiumicino" /></div>
                <div><Label>Destinazione *</Label><Input value={bookingForm.dropoff} onChange={e => setBookingForm(p => ({ ...p, dropoff: e.target.value }))} placeholder="Es. Hotel Roma Centro" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Data e Ora *</Label><Input type="datetime-local" value={bookingForm.date} onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))} /></div>
                <div><Label>Passeggeri</Label><Input type="number" min="1" max="50" value={bookingForm.passengers} onChange={e => setBookingForm(p => ({ ...p, passengers: e.target.value }))} /></div>
              </div>
              <div><Label>Note aggiuntive</Label><Textarea value={bookingForm.notes} onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))} placeholder="Numero volo, seggiolino bambini, bagagli extra..." rows={3} /></div>
              <Button onClick={handleBooking} size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Calendar className="w-4 h-4 mr-2" /> Invia Prenotazione</>
                )}
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                Risposta garantita entro 30 minuti. Pagamento alla fine del servizio.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="py-10 px-4 border-t border-border/30 bg-secondary/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {company.logo_url && <img src={company.logo_url} alt="" className="h-8 w-8 rounded-lg object-cover" />}
                <span className="font-bold text-lg font-heading">{company.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{company.tagline || "Servizio NCC Premium"}</p>
              {company.city && <p className="text-sm text-muted-foreground mt-1">📍 {company.city}</p>}
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Servizi</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>Transfer Aeroportuali</li>
                <li>Viaggi Business</li>
                <li>Tour & Escursioni</li>
                <li>Eventi & Cerimonie</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Contatti</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                {company.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4" />{company.phone}</p>}
                {company.email && <p className="flex items-center gap-2"><Mail className="w-4 h-4" />{company.email}</p>}
              </div>
            </div>
          </div>
          <div className="border-t border-border/30 pt-6 text-center text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {company.name}. Tutti i diritti riservati. | P.IVA — NCC Autorizzato</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
