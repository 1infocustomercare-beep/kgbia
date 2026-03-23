import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { name, industry, phone, city, plan, slug, primary_color, tagline, modules_enabled, email } = body;

    if (!name || !industry || !slug) {
      return new Response(JSON.stringify({ error: "Missing required fields: name, industry, slug" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── FOOD SECTOR → create restaurant (same model as imperioroma) ──
    if (industry === "food") {
      const result = await createFoodRestaurant(supabase, user, { name, slug, phone, city, plan, primary_color, tagline, email });
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── ALL OTHER SECTORS → create company ───────────────────────────
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name,
        slug,
        industry,
        owner_id: user.id,
        phone: phone || null,
        city: city || null,
        primary_color: primary_color || "#C8963E",
        tagline: tagline || "Benvenuti",
        modules_enabled: modules_enabled || [],
        subscription_plan: plan || "essential",
        email: email || user.email || null,
      })
      .select("id")
      .single();

    if (companyError) throw companyError;
    const companyId = company.id;

    await supabase.from("company_memberships").insert({
      company_id: companyId,
      user_id: user.id,
      role: "admin",
    });

    await supabase.from("profiles").update({
      full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
    }).eq("user_id", user.id);

    await supabase.from("user_roles").upsert(
      { user_id: user.id, role: "restaurant_admin" },
      { onConflict: "user_id,role" }
    );

    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 90);
    await supabase.from("business_subscriptions").upsert(
      {
        company_id: companyId,
        plan: plan || "essential",
        status: "trialing",
        trial_start: new Date().toISOString(),
        trial_end: trialEnd.toISOString(),
      },
      { onConflict: "company_id" }
    );

    // Industry-specific demo data
    if (industry === "ncc") {
      await seedNCCDemo(supabase, companyId);
    } else if (industry === "beauty") {
      await seedBeautyDemo(supabase, companyId);
    } else if (industry === "retail") {
      await seedRetailDemo(supabase, companyId);
    }

    await seedCommonDemo(supabase, companyId, industry);

    return new Response(
      JSON.stringify({ success: true, companyId, slug }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ── FOOD: Create full restaurant with demo data (like imperioroma) ──
async function createFoodRestaurant(
  supabase: any,
  user: any,
  opts: { name: string; slug: string; phone?: string; city?: string; plan?: string; primary_color?: string; tagline?: string; email?: string }
) {
  const restaurantId = crypto.randomUUID();

  // 1. Create restaurant record
  const { error: restError } = await supabase.from("restaurants").insert({
    id: restaurantId,
    name: opts.name,
    slug: opts.slug,
    owner_id: user.id,
    tagline: opts.tagline || "Benvenuti nel nostro ristorante",
    primary_color: opts.primary_color || "#C8963E",
    phone: opts.phone || "",
    address: opts.city ? `Via Principale 1, ${opts.city}` : "",
    city: opts.city || "",
    email: opts.email || user.email || "",
    is_active: true,
    policy_accepted: true,
    policy_accepted_at: new Date().toISOString(),
    setup_paid: true,
  });

  if (restError) throw restError;

  // Note: DB trigger handle_new_restaurant will auto-create:
  // - ai_tokens record
  // - fisco_configs record
  // - restaurant_memberships record

  // 2. Ensure user role
  await supabase.from("user_roles").upsert(
    { user_id: user.id, role: "restaurant_admin" },
    { onConflict: "user_id,role" }
  );

  // 3. Update profile
  await supabase.from("profiles").update({
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
  }).eq("user_id", user.id);

  // 4. Seed full menu (same categories as imperioroma)
  await supabase.from("menu_items").insert([
    { restaurant_id: restaurantId, name: "Bruschetta Classica", description: "Pomodorini freschi, basilico e olio EVO su pane toscano", price: 8, category: "Antipasti", is_active: true, is_popular: true, sort_order: 1 },
    { restaurant_id: restaurantId, name: "Tagliere Misto", description: "Selezione di salumi e formaggi stagionati", price: 16, category: "Antipasti", is_active: true, is_popular: false, sort_order: 2 },
    { restaurant_id: restaurantId, name: "Carpaccio di Manzo", description: "Con rucola, parmigiano e limone", price: 14, category: "Antipasti", is_active: true, is_popular: false, sort_order: 3 },
    { restaurant_id: restaurantId, name: "Spaghetti Carbonara", description: "Guanciale croccante, pecorino romano, tuorlo d'uovo", price: 14, category: "Primi", is_active: true, is_popular: true, sort_order: 4 },
    { restaurant_id: restaurantId, name: "Risotto ai Funghi Porcini", description: "Riso Carnaroli mantecato con porcini freschi", price: 16, category: "Primi", is_active: true, is_popular: false, sort_order: 5 },
    { restaurant_id: restaurantId, name: "Paccheri all'Amatriciana", description: "Sugo di pomodoro San Marzano, guanciale, pecorino", price: 13, category: "Primi", is_active: true, is_popular: false, sort_order: 6 },
    { restaurant_id: restaurantId, name: "Pizza Margherita", description: "Mozzarella di bufala, pomodoro, basilico fresco", price: 12, category: "Pizze", is_active: true, is_popular: true, sort_order: 7 },
    { restaurant_id: restaurantId, name: "Pizza Diavola", description: "Salamino piccante, mozzarella, peperoncino", price: 14, category: "Pizze", is_active: true, is_popular: false, sort_order: 8 },
    { restaurant_id: restaurantId, name: "Pizza Quattro Formaggi", description: "Mozzarella, gorgonzola, fontina, parmigiano", price: 15, category: "Pizze", is_active: true, is_popular: false, sort_order: 9 },
    { restaurant_id: restaurantId, name: "Tagliata di Manzo", description: "Controfiletto alla griglia con rucola e grana", price: 22, category: "Secondi", is_active: true, is_popular: false, sort_order: 10 },
    { restaurant_id: restaurantId, name: "Branzino al Forno", description: "Con patate, olive taggiasche e capperi", price: 20, category: "Secondi", is_active: true, is_popular: false, sort_order: 11 },
    { restaurant_id: restaurantId, name: "Tiramisù", description: "Mascarpone, savoiardi, caffè espresso, cacao", price: 7, category: "Dolci", is_active: true, is_popular: true, sort_order: 12 },
    { restaurant_id: restaurantId, name: "Panna Cotta", description: "Con coulis di frutti di bosco", price: 6, category: "Dolci", is_active: true, is_popular: false, sort_order: 13 },
    { restaurant_id: restaurantId, name: "Espresso", description: "Caffè 100% arabica", price: 2, category: "Bevande", is_active: true, is_popular: false, sort_order: 14 },
    { restaurant_id: restaurantId, name: "Prosecco Valdobbiadene", description: "Calice di bollicine venete", price: 6, category: "Bevande", is_active: true, is_popular: false, sort_order: 15 },
    { restaurant_id: restaurantId, name: "Acqua Minerale", description: "Naturale o frizzante 75cl", price: 3, category: "Bevande", is_active: true, is_popular: false, sort_order: 16 },
  ]);

  // 5. Seed tables
  await supabase.from("restaurant_tables").insert([
    { restaurant_id: restaurantId, table_number: 1, seats: 2, status: "free", label: "Tavolo 1", pos_x: 15, pos_y: 20 },
    { restaurant_id: restaurantId, table_number: 2, seats: 4, status: "free", label: "Tavolo 2", pos_x: 38, pos_y: 20 },
    { restaurant_id: restaurantId, table_number: 3, seats: 4, status: "occupied", label: "Tavolo 3", pos_x: 62, pos_y: 20 },
    { restaurant_id: restaurantId, table_number: 4, seats: 6, status: "free", label: "Tavolo 4", pos_x: 85, pos_y: 20 },
    { restaurant_id: restaurantId, table_number: 5, seats: 2, status: "occupied", label: "Tavolo 5", pos_x: 15, pos_y: 60 },
    { restaurant_id: restaurantId, table_number: 6, seats: 4, status: "free", label: "Tavolo 6", pos_x: 38, pos_y: 60 },
    { restaurant_id: restaurantId, table_number: 7, seats: 8, status: "free", label: "Tavolo 7", pos_x: 62, pos_y: 60 },
    { restaurant_id: restaurantId, table_number: 8, seats: 4, status: "free", label: "Tavolo 8", pos_x: 85, pos_y: 60 },
  ]);

  // 6. Seed sample orders
  await supabase.from("orders").insert([
    { restaurant_id: restaurantId, customer_name: "Marco Rossi", customer_phone: "+39 333 1234567", order_type: "table", table_number: 3, status: "preparing", total: 36, items: [{ name: "Carbonara", qty: 2, price: 14 }, { name: "Bruschetta", qty: 1, price: 8 }], notes: "Senza pepe" },
    { restaurant_id: restaurantId, customer_name: "Laura Bianchi", customer_phone: "+39 334 9876543", order_type: "delivery", table_number: null, status: "pending", total: 38, items: [{ name: "Pizza Margherita", qty: 2, price: 12 }, { name: "Tiramisù", qty: 2, price: 7 }] },
    { restaurant_id: restaurantId, customer_name: "Giovanni Paoli", customer_phone: "+39 335 5551234", order_type: "takeaway", table_number: null, status: "ready", total: 38, items: [{ name: "Risotto ai Funghi", qty: 1, price: 16 }, { name: "Tagliata", qty: 1, price: 22 }], notes: "Extra limone" },
  ]);

  // 7. Kitchen access pin
  await supabase.from("kitchen_access_pins").insert([
    { restaurant_id: restaurantId, pin_code: "1234", label: "Cucina Principale", is_active: true },
  ]);

  // 8. Reviews
  await supabase.from("reviews").insert([
    { restaurant_id: restaurantId, rating: 5, customer_name: "Marco R.", comment: "Ottima esperienza! Carbonara perfetta.", is_public: true },
    { restaurant_id: restaurantId, rating: 5, customer_name: "Sara T.", comment: "Servizio impeccabile, tornerò sicuramente.", is_public: true },
    { restaurant_id: restaurantId, rating: 4, customer_name: "Paolo V.", comment: "Buona pizza, ambiente accogliente.", is_public: true },
    { restaurant_id: restaurantId, rating: 2, customer_name: "Anna L.", comment: "Attesa troppo lunga.", is_public: false },
  ]);

  // 9. Reservations
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const dayAfter = new Date(Date.now() + 172800000).toISOString().split("T")[0];

  await supabase.from("reservations").insert([
    { restaurant_id: restaurantId, customer_name: "Marco Rossi", customer_phone: "+39 333 1234567", reservation_date: today, reservation_time: "20:30", guests: 4, status: "pending" },
    { restaurant_id: restaurantId, customer_name: "Laura Bianchi", customer_phone: "+39 334 9876543", reservation_date: tomorrow, reservation_time: "21:00", guests: 2, status: "pending" },
    { restaurant_id: restaurantId, customer_name: "Giovanni Paoli", customer_phone: "+39 335 5551234", reservation_date: dayAfter, reservation_time: "20:00", guests: 6, status: "confirmed" },
  ]);

  return { success: true, restaurantId, slug: opts.slug, entity_type: "restaurant" };
}

// ── NCC Demo Data ──────────────────────────────────────────────────
async function seedNCCDemo(supabase: any, companyId: string) {
  await supabase.from("fleet_vehicles").insert([
    { company_id: companyId, name: "Mercedes Classe E", brand: "Mercedes-Benz", model: "E220d AMG Line", year: 2024, category: "sedan", capacity: 3, base_price: 80, price_per_km: 1.8, features: ["WiFi", "USB", "Acqua", "Quotidiani"], is_active: true },
    { company_id: companyId, name: "Mercedes Classe V", brand: "Mercedes-Benz", model: "V250d Exclusive", year: 2024, category: "van", capacity: 7, base_price: 120, price_per_km: 2.2, features: ["WiFi", "USB", "TV", "Minibar", "Presa 220V"], is_active: true },
    { company_id: companyId, name: "BMW Serie 7", brand: "BMW", model: "730d xDrive", year: 2024, category: "luxury", capacity: 3, base_price: 150, price_per_km: 2.8, features: ["WiFi", "USB", "Massaggio", "Champagne", "Privacy Glass"], is_active: true },
    { company_id: companyId, name: "Mercedes Sprinter VIP", brand: "Mercedes-Benz", model: "Sprinter 316 CDI", year: 2023, category: "minibus", capacity: 16, base_price: 200, price_per_km: 3.0, features: ["WiFi", "USB", "Aria Condizionata", "Bagagliaio XL"], is_active: true },
  ]);

  await supabase.from("ncc_routes").insert([
    { company_id: companyId, origin: "Aeroporto Fiumicino (FCO)", destination: "Roma Centro", base_price: 60, distance_km: 32, duration_min: 40, is_active: true },
    { company_id: companyId, origin: "Aeroporto Ciampino (CIA)", destination: "Roma Centro", base_price: 45, distance_km: 18, duration_min: 30, is_active: true },
    { company_id: companyId, origin: "Roma Centro", destination: "Napoli", base_price: 280, distance_km: 230, duration_min: 150, is_active: true },
    { company_id: companyId, origin: "Roma Centro", destination: "Firenze", base_price: 350, distance_km: 275, duration_min: 180, is_active: true },
    { company_id: companyId, origin: "Roma Centro", destination: "Civitavecchia Porto", base_price: 90, distance_km: 70, duration_min: 60, is_active: true },
  ]);

  await supabase.from("ncc_destinations").insert([
    { company_id: companyId, name: "Costiera Amalfitana", description: "Tour completo di Amalfi, Positano e Ravello con sosta pranzo", is_featured: true },
    { company_id: companyId, name: "Firenze e Toscana", description: "Transfer e tour giornaliero tra arte, vigneti e borghi", is_featured: true },
    { company_id: companyId, name: "Pompei e Vesuvio", description: "Escursione archeologica con guida e transfer privato", is_featured: true },
    { company_id: companyId, name: "Orvieto e Umbria", description: "Degustazione vini e visita al Duomo", is_featured: false },
  ]);

  await supabase.from("ncc_reviews").insert([
    { company_id: companyId, rating: 5, customer_name: "Marco B.", comment: "Servizio impeccabile, autista puntuale e cortese. Auto pulitissima.", is_public: true },
    { company_id: companyId, rating: 5, customer_name: "Sarah W.", comment: "Best transfer service in Rome! Professional and comfortable.", is_public: true },
    { company_id: companyId, rating: 4, customer_name: "Giovanni P.", comment: "Ottimo servizio per il transfer aeroportuale. Consigliato!", is_public: true },
    { company_id: companyId, rating: 5, customer_name: "Elena R.", comment: "Tour della Costiera Amalfitana perfetto. Esperienza indimenticabile.", is_public: true },
  ]);
}

// ── Beauty Demo Data ───────────────────────────────────────────────
async function seedBeautyDemo(supabase: any, companyId: string) {
  await supabase.from("products").insert([
    { company_id: companyId, name: "Taglio Donna", category: "Capelli", price: 35, stock: 999, is_active: true },
    { company_id: companyId, name: "Piega", category: "Capelli", price: 25, stock: 999, is_active: true },
    { company_id: companyId, name: "Colore Completo", category: "Colore", price: 65, stock: 999, is_active: true },
    { company_id: companyId, name: "Manicure", category: "Unghie", price: 20, stock: 999, is_active: true },
    { company_id: companyId, name: "Massaggio Rilassante 60min", category: "Wellness", price: 70, stock: 999, is_active: true },
  ]);
}

// ── Retail Demo Data ───────────────────────────────────────────────
async function seedRetailDemo(supabase: any, companyId: string) {
  await supabase.from("products").insert([
    { company_id: companyId, name: "T-Shirt Basic", category: "Abbigliamento", price: 29.90, cost: 12, stock: 50, min_stock: 10, sku: "TSH-001", is_active: true },
    { company_id: companyId, name: "Jeans Slim Fit", category: "Abbigliamento", price: 79.90, cost: 35, stock: 30, min_stock: 5, sku: "JNS-001", is_active: true },
    { company_id: companyId, name: "Sneakers Urban", category: "Scarpe", price: 119.90, cost: 55, stock: 20, min_stock: 5, sku: "SNK-001", is_active: true },
    { company_id: companyId, name: "Borsa Pelle", category: "Accessori", price: 149.90, cost: 60, stock: 15, min_stock: 3, sku: "BRS-001", is_active: true },
  ]);
}

// ── Common Demo Data (all industries) ──────────────────────────────
async function seedCommonDemo(supabase: any, companyId: string, industry: string) {
  const roleMap: Record<string, string[]> = {
    ncc: ["Autista Senior", "Autista"],
    beauty: ["Parrucchiere", "Estetista"],
    healthcare: ["Medico", "Assistente"],
    retail: ["Responsabile", "Commesso"],
    fitness: ["Trainer", "Receptionist"],
    hospitality: ["Receptionist", "Cameriere"],
  };

  const roles = roleMap[industry] || ["Manager", "Staff"];

  await supabase.from("staff").insert([
    { company_id: companyId, full_name: "Marco Rossi", role: roles[0], email: "marco@demo.it", hourly_rate: 15, is_active: true },
    { company_id: companyId, full_name: "Laura Bianchi", role: roles[1], email: "laura@demo.it", hourly_rate: 12, is_active: true },
    { company_id: companyId, full_name: "Giovanni Verdi", role: roles[1], email: "giovanni@demo.it", hourly_rate: 12, is_active: true },
  ]);

  await supabase.from("leads").insert([
    { company_id: companyId, name: "Azienda Alfa S.r.l.", email: "info@alfa.it", phone: "+39 06 1234567", status: "new", source: "website", value: 5000 },
    { company_id: companyId, name: "Hotel Belvedere", email: "booking@belvedere.it", phone: "+39 06 9876543", status: "contacted", source: "referral", value: 3000 },
    { company_id: companyId, name: "Studio Legale Neri", email: "neri@studio.it", status: "qualified", source: "partner", value: 8000 },
  ]);
}
