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
    const { name, industry, phone, city, plan, slug, primary_color, tagline, modules_enabled } = body;

    if (!name || !industry || !slug) {
      return new Response(JSON.stringify({ error: "Missing required fields: name, industry, slug" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── 1. Create company ────────────────────────────────────────────
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
      })
      .select("id")
      .single();

    if (companyError) throw companyError;
    const companyId = company.id;

    // ── 2. Company membership (admin) ────────────────────────────────
    await supabase.from("company_memberships").insert({
      company_id: companyId,
      user_id: user.id,
      role: "admin",
    });

    // ── 3. Update profile ────────────────────────────────────────────
    await supabase.from("profiles").update({
      full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
    }).eq("user_id", user.id);

    // ── 4. Assign user role (restaurant_admin covers all business types) ──
    await supabase.from("user_roles").upsert(
      { user_id: user.id, role: "restaurant_admin" },
      { onConflict: "user_id,role" }
    );

    // ── 5. Business subscription (90-day trial) ──────────────────────
    // Note: DB trigger handle_new_company_subscription fires on insert,
    // but we also explicitly insert to ensure it exists
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

    // ── 6. Industry-specific demo data ───────────────────────────────
    if (industry === "ncc") {
      await seedNCCDemo(supabase, companyId);
    } else if (industry === "beauty") {
      await seedBeautyDemo(supabase, companyId);
    } else if (industry === "retail") {
      await seedRetailDemo(supabase, companyId);
    }

    // ── 7. Common demo data ──────────────────────────────────────────
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

  // Seed demo leads
  await supabase.from("leads").insert([
    { company_id: companyId, name: "Azienda Alfa S.r.l.", email: "info@alfa.it", phone: "+39 06 1234567", status: "new", source: "website", value: 5000 },
    { company_id: companyId, name: "Hotel Belvedere", email: "booking@belvedere.it", phone: "+39 06 9876543", status: "contacted", source: "referral", value: 3000 },
    { company_id: companyId, name: "Studio Legale Neri", email: "neri@studio.it", status: "qualified", source: "partner", value: 8000 },
  ]);
}
