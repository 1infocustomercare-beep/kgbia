import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Get the authenticated user
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response(JSON.stringify({ error: "No auth" }), { status: 401, headers: corsHeaders });

  const { data: { user } } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

  // Find or create the NCC company for this user
  let { data: membership } = await supabase
    .from("company_memberships")
    .select("company_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let companyId: string;

  if (membership?.company_id) {
    companyId = membership.company_id;
    // Update to NCC industry
    await supabase.from("companies").update({
      industry: "ncc",
      name: "Autonoleggio Telese snc",
      slug: "telese-viaggi",
      tagline: "Transfer & Tour - Costiera Amalfitana",
      phone: "+39 324 830 6593",
      email: "info@teleseviaggi.it",
      address: "Via Litoranea, 84010 Maiori SA",
      city: "Maiori",
      primary_color: "#D4A017",
      secondary_color: "#1A1A2E",
    }).eq("id", companyId);
  } else {
    const { data: newCompany } = await supabase.from("companies").insert({
      name: "Autonoleggio Telese snc",
      slug: "telese-viaggi",
      industry: "ncc",
      owner_id: user.id,
      tagline: "Transfer & Tour - Costiera Amalfitana",
      phone: "+39 324 830 6593",
      email: "info@teleseviaggi.it",
      address: "Via Litoranea, 84010 Maiori SA",
      city: "Maiori",
      primary_color: "#D4A017",
      secondary_color: "#1A1A2E",
    }).select("id").single();
    companyId = newCompany!.id;
    await supabase.from("company_memberships").insert({ company_id: companyId, user_id: user.id, role: "admin" });
  }

  // ── FLEET VEHICLES ──
  // Delete existing first
  await supabase.from("fleet_vehicles").delete().eq("company_id", companyId);

  const vehicles = [
    { name: "Pullman 31 Posti", category: "bus", brand: "Iveco", model: "Daily", capacity: 31, min_pax: 15, max_pax: 31, luggage_capacity: 31, base_price: 350, price_per_km: 2.5, year: 2022, features: ["Clima", "TV", "USB", "WC", "Bagagliaio"], description: "Pullman gran turismo per gruppi numerosi, ideale per escursioni e trasferimenti collettivi lungo la Costiera", is_popular: false, is_active: true },
    { name: "Mercedes V-Class", category: "van", brand: "Mercedes-Benz", model: "V-Class", capacity: 7, min_pax: 1, max_pax: 7, luggage_capacity: 7, base_price: 120, price_per_km: 1.8, year: 2023, features: ["Pelle", "Clima", "WiFi", "USB", "Acqua"], description: "Van premium per famiglie e piccoli gruppi, massimo comfort in Costiera Amalfitana", is_popular: true, is_active: true },
    { name: "Mercedes E-Class", category: "sedan", brand: "Mercedes-Benz", model: "E-Class", capacity: 3, min_pax: 1, max_pax: 3, luggage_capacity: 3, base_price: 100, price_per_km: 1.5, year: 2024, features: ["Pelle", "Clima", "WiFi", "USB", "Acqua", "Massaggio"], description: "Berlina executive per transfer aeroportuali e spostamenti business", is_popular: true, is_active: true },
    { name: "Mercedes S-Class", category: "luxury", brand: "Mercedes-Benz", model: "S-Class", capacity: 3, min_pax: 1, max_pax: 3, luggage_capacity: 2, base_price: 180, price_per_km: 2.2, year: 2024, features: ["Pelle", "Clima", "WiFi", "USB", "Acqua", "Massaggio", "Champagne", "Tetto Panoramico"], description: "L'apice del lusso: berlina ammiraglia per clienti VIP e cerimonie", is_popular: false, is_active: true },
    { name: "Mercedes Sprinter 9 Posti", category: "minibus", brand: "Mercedes-Benz", model: "Sprinter", capacity: 9, min_pax: 1, max_pax: 9, luggage_capacity: 9, base_price: 150, price_per_km: 2.0, year: 2023, features: ["Clima", "USB", "Acqua", "Bagagliaio"], description: "Minibus versatile per gruppi medio-piccoli e tour della Costiera", is_popular: false, is_active: true },
    { name: "Mercedes GLE SUV", category: "suv", brand: "Mercedes-Benz", model: "GLE", capacity: 4, min_pax: 1, max_pax: 4, luggage_capacity: 4, base_price: 140, price_per_km: 1.8, year: 2024, features: ["Pelle", "Clima", "WiFi", "USB", "Acqua", "4x4"], description: "SUV premium per trasferimenti su terreni impegnativi e strade montane", is_popular: false, is_active: true },
    { name: "Minivan Toyota Proace", category: "van", brand: "Toyota", model: "Proace Verso", capacity: 8, min_pax: 1, max_pax: 8, luggage_capacity: 8, base_price: 110, price_per_km: 1.6, year: 2023, features: ["Clima", "USB", "Bagagliaio", "Seggiolino Bimbo"], description: "Soluzione economica e spaziosa per famiglie con bambini", is_popular: false, is_active: true },
  ];

  const { data: insertedVehicles } = await supabase.from("fleet_vehicles").insert(
    vehicles.map(v => ({ ...v, company_id: companyId }))
  ).select("id, name");

  // ── NCC ROUTES ──
  await supabase.from("ncc_routes").delete().eq("company_id", companyId);

  const routes = [
    { origin: "Aeroporto Fiumicino (FCO)", destination: "Ravello", base_price: 350, distance_km: 310, duration_min: 210, transport_type: "aeroporto", is_active: true },
    { origin: "Aeroporto Napoli (NAP)", destination: "Ravello", base_price: 150, distance_km: 70, duration_min: 90, transport_type: "aeroporto", is_active: true },
    { origin: "Stazione Napoli Centrale", destination: "Ravello", base_price: 140, distance_km: 65, duration_min: 80, transport_type: "stazione", is_active: true },
    { origin: "Stazione Salerno", destination: "Ravello", base_price: 80, distance_km: 35, duration_min: 50, transport_type: "stazione", is_active: true },
    { origin: "Aeroporto Napoli (NAP)", destination: "Positano", base_price: 140, distance_km: 60, duration_min: 75, transport_type: "aeroporto", is_active: true },
    { origin: "Aeroporto Napoli (NAP)", destination: "Amalfi", base_price: 145, distance_km: 65, duration_min: 80, transport_type: "aeroporto", is_active: true },
    { origin: "Aeroporto Napoli (NAP)", destination: "Sorrento", base_price: 110, distance_km: 55, duration_min: 60, transport_type: "aeroporto", is_active: true },
    { origin: "Aeroporto Napoli (NAP)", destination: "Maiori", base_price: 130, distance_km: 60, duration_min: 75, transport_type: "aeroporto", is_active: true },
    { origin: "Roma Centro", destination: "Costiera Amalfitana", base_price: 400, distance_km: 280, duration_min: 240, transport_type: "citta", is_active: true },
    { origin: "Ravello", destination: "Pompei (Scavi)", base_price: 90, distance_km: 40, duration_min: 55, transport_type: "punto_interesse", is_active: true },
    { origin: "Ravello", destination: "Sorrento", base_price: 70, distance_km: 35, duration_min: 50, transport_type: "citta", is_active: true },
    { origin: "Ravello", destination: "Positano", base_price: 60, distance_km: 25, duration_min: 40, transport_type: "citta", is_active: true },
    { origin: "Ravello", destination: "Amalfi", base_price: 30, distance_km: 7, duration_min: 15, transport_type: "citta", is_active: true },
    { origin: "Tour Costiera Amalfitana", destination: "Giornata Intera", base_price: 300, distance_km: 120, duration_min: 480, transport_type: "punto_interesse", is_active: true, notes: "Include soste a Positano, Amalfi, Ravello" },
  ];

  await supabase.from("ncc_routes").insert(routes.map(r => ({ ...r, company_id: companyId })));

  // ── DESTINATIONS (Boat tours) ──
  await supabase.from("ncc_destinations").delete().eq("company_id", companyId);

  const destinations = [
    { name: "Capri", description: "Tour dell'isola con grotta azzurra e faraglioni", is_featured: true, image_url: null },
    { name: "Nerano - Baia di Ieranto", description: "Baia incontaminata con acque cristalline", is_featured: true, image_url: null },
    { name: "Positano via Mare", description: "Vista mozzafiato della Costiera dal mare", is_featured: true, image_url: null },
    { name: "Amalfi - Grotta dello Smeraldo", description: "Escursione alla celebre grotta verde", is_featured: false, image_url: null },
    { name: "Li Galli", description: "Arcipelago privato tra Positano e Amalfi", is_featured: false, image_url: null },
  ];

  const { data: insertedDests } = await supabase.from("ncc_destinations").insert(
    destinations.map(d => ({ ...d, company_id: companyId }))
  ).select("id, name");

  // ── BOAT PRICES ──
  if (insertedDests) {
    const boatPriceData = [
      { name: "Capri", standard: 85, group: 70, children: 45 },
      { name: "Nerano - Baia di Ieranto", standard: 65, group: 55, children: 35 },
      { name: "Positano via Mare", standard: 55, group: 45, children: 30 },
      { name: "Amalfi - Grotta dello Smeraldo", standard: 50, group: 40, children: 25 },
      { name: "Li Galli", standard: 75, group: 60, children: 40 },
    ];

    for (const bp of boatPriceData) {
      const dest = insertedDests.find(d => d.name === bp.name);
      if (dest) {
        await supabase.from("boat_prices").upsert({
          destination_id: dest.id,
          standard_price: bp.standard,
          group_price: bp.group,
          children_price: bp.children,
        }, { onConflict: "destination_id" });
      }
    }
  }

  // ── DRIVERS ──
  await supabase.from("drivers").delete().eq("company_id", companyId);

  const drivers = [
    { first_name: "Antonio", last_name: "Telese", phone: "+39 324 830 6593", email: "antonio@teleseviaggi.it", license_number: "NA12345678", license_expiry: "2027-06-15", has_cqc: true, cqc_expiry: "2028-03-20", languages: ["Italiano", "Inglese"], status: "available", rating_avg: 4.9 },
    { first_name: "Giovanni", last_name: "Russo", phone: "+39 333 1234567", license_number: "SA87654321", license_expiry: "2026-11-30", has_cqc: true, cqc_expiry: "2027-09-15", languages: ["Italiano", "Inglese", "Francese"], status: "available", rating_avg: 4.8 },
    { first_name: "Marco", last_name: "De Luca", phone: "+39 334 9876543", license_number: "NA55443322", license_expiry: "2028-02-28", has_cqc: false, languages: ["Italiano", "Inglese"], status: "available", rating_avg: 4.7 },
    { first_name: "Luigi", last_name: "Esposito", phone: "+39 335 5551234", license_number: "CE99887766", license_expiry: "2027-08-10", has_cqc: true, cqc_expiry: "2028-05-01", languages: ["Italiano"], status: "busy", rating_avg: 4.6 },
  ];

  await supabase.from("drivers").insert(drivers.map(d => ({ ...d, company_id: companyId })));

  // ── CROSS-SELLS ──
  await supabase.from("cross_sells").delete().eq("company_id", companyId);

  const crossSells = [
    { title: "Sosta panoramica a Ravello", description: "30 minuti di sosta nel borgo più panoramico della Costiera", price: 30, is_free: false, shown_to: "long_routes", icon_emoji: "🏔️", sort_order: 1 },
    { title: "Guida turistica Pompei", description: "2 ore con guida certificata per Scavi di Pompei", price: 80, is_free: false, shown_to: "specific_routes", icon_emoji: "🏛️", sort_order: 2 },
    { title: "Baby seat incluso", description: "Seggiolino auto per bambini 0-12 anni", price: 0, is_free: true, shown_to: "all", icon_emoji: "👶", sort_order: 3 },
    { title: "Transfer + Tour Capri in barca", description: "Pacchetto completo: transfer aeroporto + tour barca Capri", price: 250, is_free: false, shown_to: "all", icon_emoji: "⛵", sort_order: 4 },
    { title: "Cesto di benvenuto", description: "Acqua, frutta fresca e limoncello della Costiera", price: 25, is_free: false, shown_to: "all", icon_emoji: "🍋", sort_order: 5 },
  ];

  await supabase.from("cross_sells").insert(crossSells.map(c => ({ ...c, company_id: companyId, is_active: true })));

  // ── EXTRA PRICES ──
  await supabase.from("extra_prices").delete().eq("company_id", companyId);

  const extras = [
    { key: "stop", label: "Sosta panoramica (€ a sosta)", value: 30, is_percentage: false },
    { key: "waiting", label: "Attesa extra (€/ora oltre 30min)", value: 40, is_percentage: false },
    { key: "night", label: "Supplemento notturno 22:00-06:00 (%)", value: 20, is_percentage: true },
    { key: "baby_seat", label: "Baby seat (€)", value: 0, is_percentage: false },
    { key: "extra_luggage", label: "Portabagagli extra (€ a bagaglio)", value: 10, is_percentage: false },
    { key: "holiday", label: "Supplemento festivi (%)", value: 15, is_percentage: true },
  ];

  await supabase.from("extra_prices").insert(extras.map(e => ({ ...e, company_id: companyId })));

  // ── COMPANY SETTINGS ──
  await supabase.from("company_settings").upsert({
    company_id: companyId,
    vat: "02651120616",
    whatsapp: "3248306593",
    hours: "06:00 – 23:00",
    bookings_enabled: true,
    require_deposit: true,
    deposit_percentage: 30,
    currency: "EUR",
    confirmation_message: "Grazie per aver scelto Telese Viaggi! Vi confermeremo il transfer entro 2 ore.",
    instagram_url: "https://instagram.com/teleseviaggi",
  }, { onConflict: "company_id" });

  // ── SEO ──
  await supabase.from("seo_settings").upsert({
    company_id: companyId,
    meta_title: "NCC Telese Viaggi - Transfer Costiera Amalfitana",
    meta_description: "Servizio NCC premium per transfer aeroportuali, tour in Costiera Amalfitana e gite in barca. Prenota il tuo transfer con autista privato.",
    keywords: "NCC, transfer, costiera amalfitana, Ravello, Amalfi, Positano, noleggio con conducente",
  }, { onConflict: "company_id" });

  // ── NCC REVIEWS ──
  await supabase.from("ncc_reviews").delete().eq("company_id", companyId);

  const reviews = [
    { customer_name: "James W.", rating: 5, comment: "Excellent service! Antonio was punctual and professional. The Mercedes was spotless. Highly recommended for Amalfi Coast transfers.", is_public: true, status: "approved" },
    { customer_name: "Sophie M.", rating: 5, comment: "Servizio impeccabile dal primo all'ultimo momento. Il transfer dall'aeroporto a Ravello è stato comodissimo.", is_public: true, status: "approved" },
    { customer_name: "Hans K.", rating: 5, comment: "Sehr professioneller Service. Der Fahrer war pünktlich und freundlich. Das Auto war sauber und komfortabel.", is_public: true, status: "approved" },
    { customer_name: "Laura B.", rating: 4, comment: "Ottimo servizio, macchina pulita e autista gentile. Unico neo: piccolo ritardo alla partenza.", is_public: true, status: "approved" },
    { customer_name: "David R.", rating: 5, comment: "Best NCC service on the Amalfi Coast. We used them for all our transfers during a week-long stay. Professional and reliable.", is_public: true, status: "approved" },
    { customer_name: "Maria C.", rating: 5, comment: "Tour in barca a Capri fantastico! Organizzazione perfetta, barca bellissima.", is_public: true, status: "approved" },
  ];

  await supabase.from("ncc_reviews").insert(reviews.map(r => ({ ...r, company_id: companyId })));

  // ── SAMPLE BOOKINGS ──
  const now = new Date();
  const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
  const in3days = new Date(now); in3days.setDate(in3days.getDate() + 3);
  const in5days = new Date(now); in5days.setDate(in5days.getDate() + 5);
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);

  await supabase.from("ncc_bookings").delete().eq("company_id", companyId);

  const bookings = [
    { customer_name: "James Wilson", customer_phone: "+44 7911 123456", customer_email: "james@email.com", pickup_address: "Aeroporto Napoli (NAP)", dropoff_address: "Ravello", pickup_datetime: tomorrow.toISOString().split("T")[0] + "T10:30:00", passengers: 2, luggage: 4, total_price: 150, status: "confirmed", service_type: "transfer", flight_code: "EZY1234", notes: "Arriving from London" },
    { customer_name: "Sophie Martin", customer_phone: "+33 6 12 34 56 78", customer_email: "sophie@email.com", pickup_address: "Hotel Caruso, Ravello", dropoff_address: "Positano", pickup_datetime: tomorrow.toISOString().split("T")[0] + "T14:00:00", passengers: 4, luggage: 0, total_price: 60, status: "confirmed", service_type: "transfer" },
    { customer_name: "Hans Müller", customer_phone: "+49 151 1234 5678", pickup_address: "Aeroporto Fiumicino (FCO)", dropoff_address: "Ravello", pickup_datetime: in3days.toISOString().split("T")[0] + "T09:00:00", passengers: 3, luggage: 6, total_price: 350, status: "pending", service_type: "transfer", flight_code: "LH2024" },
    { customer_name: "Laura Bianchi", customer_phone: "+39 333 1112233", pickup_address: "Porto Amalfi", dropoff_address: "Capri (Tour Barca)", pickup_datetime: in5days.toISOString().split("T")[0] + "T08:30:00", passengers: 6, luggage: 0, total_price: 420, status: "pending", service_type: "tour_boat", notes: "Gruppo famiglia con bambini" },
    { customer_name: "David Ross", customer_phone: "+1 555 123 4567", pickup_address: "Stazione Napoli Centrale", dropoff_address: "Ravello", pickup_datetime: yesterday.toISOString().split("T")[0] + "T16:00:00", passengers: 2, luggage: 3, total_price: 140, status: "completed", service_type: "transfer", deposit: 42 },
  ];

  await supabase.from("ncc_bookings").insert(bookings.map(b => ({ ...b, company_id: companyId })));

  // ── FAQ ──
  await supabase.from("faq_items").delete().eq("company_id", companyId);

  const faqs = [
    { question: "Come posso prenotare un transfer?", answer: "Puoi prenotare direttamente dal nostro sito web, via WhatsApp al +39 324 830 6593 o via email a info@teleseviaggi.it", sort_order: 1 },
    { question: "Quanto costa un transfer dall'aeroporto di Napoli?", answer: "I prezzi partono da €110 per Sorrento e variano in base alla destinazione. Ravello da €150, Positano da €140, Amalfi da €145.", sort_order: 2 },
    { question: "È possibile prenotare un tour in barca?", answer: "Sì! Offriamo tour in barca verso Capri, Nerano, Positano e le isole Li Galli. Contattaci per disponibilità e prezzi.", sort_order: 3 },
    { question: "Fornite seggiolini per bambini?", answer: "Sì, forniamo seggiolini auto gratuiti su richiesta al momento della prenotazione.", sort_order: 4 },
    { question: "Qual è la politica di cancellazione?", answer: "Cancellazione gratuita fino a 24 ore prima. Entro le 24 ore viene trattenuto il 50% dell'acconto.", sort_order: 5 },
  ];

  await supabase.from("faq_items").insert(faqs.map(f => ({ ...f, company_id: companyId, is_active: true })));

  return new Response(JSON.stringify({ 
    success: true, 
    companyId,
    message: "Dati Telese Viaggi inseriti con successo!",
    summary: {
      vehicles: vehicles.length,
      routes: routes.length,
      destinations: destinations.length,
      drivers: drivers.length,
      bookings: bookings.length,
      reviews: reviews.length,
    }
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
