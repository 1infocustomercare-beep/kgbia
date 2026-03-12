import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get the user from the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
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
    const { name, industry, phone, city, plan, slug } = body;

    if (!name || !industry || !slug) {
      return new Response(JSON.stringify({ error: "Missing required fields: name, industry, slug" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Create company
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name,
        slug,
        industry,
        owner_id: user.id,
        phone: phone || null,
        city: city || null,
        subscription_plan: plan || "starter",
      })
      .select("id")
      .single();

    if (companyError) throw companyError;

    const companyId = company.id;

    // 2. Create company membership (admin role)
    await supabase.from("company_memberships").insert({
      company_id: companyId,
      user_id: user.id,
      role: "admin",
    });

    // 3. Update profile with company reference
    await supabase.from("profiles").update({
      full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
    }).eq("user_id", user.id);

    // 4. Seed industry-specific demo data
    if (industry === "ncc") {
      // Seed demo fleet vehicles
      await supabase.from("fleet_vehicles").insert([
        { company_id: companyId, name: "Mercedes Classe E", brand: "Mercedes", model: "E220d", category: "sedan", capacity: 3, base_price: 80, features: ["WiFi", "USB", "Acqua"], is_active: true },
        { company_id: companyId, name: "Mercedes Classe V", brand: "Mercedes", model: "V250d", category: "van", capacity: 7, base_price: 120, features: ["WiFi", "USB", "TV", "Minibar"], is_active: true },
        { company_id: companyId, name: "BMW Serie 7", brand: "BMW", model: "730d", category: "luxury", capacity: 3, base_price: 150, features: ["WiFi", "USB", "Massaggio", "Champagne"], is_active: true },
      ]);

      // Seed demo routes
      await supabase.from("ncc_routes").insert([
        { company_id: companyId, origin: "Aeroporto Fiumicino", destination: "Roma Centro", base_price: 60, distance_km: 32, duration_min: 40, is_active: true },
        { company_id: companyId, origin: "Aeroporto Ciampino", destination: "Roma Centro", base_price: 45, distance_km: 18, duration_min: 30, is_active: true },
        { company_id: companyId, origin: "Roma Centro", destination: "Napoli", base_price: 280, distance_km: 230, duration_min: 150, is_active: true },
      ]);

      // Seed demo destinations
      await supabase.from("ncc_destinations").insert([
        { company_id: companyId, name: "Costiera Amalfitana", description: "Tour completo della Costiera", is_featured: true },
        { company_id: companyId, name: "Firenze", description: "Transfer e tour giornaliero", is_featured: true },
      ]);
    }

    // 5. Seed demo staff
    await supabase.from("staff").insert([
      { company_id: companyId, full_name: "Marco Rossi", role: industry === "ncc" ? "autista" : "manager", email: "marco@demo.it", hourly_rate: 15, is_active: true },
      { company_id: companyId, full_name: "Laura Bianchi", role: industry === "ncc" ? "autista" : "staff", email: "laura@demo.it", hourly_rate: 12, is_active: true },
    ]);

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
