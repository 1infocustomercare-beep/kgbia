import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, description, sector, packageId } = await req.json();

    if (!email || !description) {
      return new Response(JSON.stringify({ error: "Email and description required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate inputs
    if (email.length > 255 || description.length > 2000 || (sector && sector.length > 50)) {
      return new Response(JSON.stringify({ error: "Input too long" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get or create a system company for public requests
    let { data: systemCompany } = await supabase
      .from("companies")
      .select("id")
      .eq("slug", "system-public-requests")
      .single();

    if (!systemCompany) {
      const { data: newCompany } = await supabase
        .from("companies")
        .insert({
          name: "Public Feature Requests",
          slug: "system-public-requests",
          industry: "custom",
          is_active: false,
        })
        .select("id")
        .single();
      systemCompany = newCompany;
    }

    if (!systemCompany) {
      return new Response(JSON.stringify({ error: "System error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error } = await supabase.from("feature_requests").insert({
      title: `[Landing] Richiesta da ${email}`,
      description: `Settore: ${sector || "N/A"}\nPacchetto: ${packageId || "N/A"}\nEmail: ${email}\n\n${description}`,
      company_id: systemCompany.id,
      sector: sector || null,
      status: "new",
    });

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to save request" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});