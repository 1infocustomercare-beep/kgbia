import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const INDUSTRIES = [
  "food", "ncc", "beauty", "healthcare", "retail", "fitness",
  "hospitality", "beach", "plumber", "electrician", "agriturismo",
  "cleaning", "legal", "accounting", "garage", "photography",
  "construction", "gardening", "veterinary", "tattoo", "childcare",
  "education", "events", "logistics", "custom",
];

const SLUGS: Record<string, string> = {
  food: "impero-roma",
  ncc: "royal-transfer-roma",
  beauty: "glow-beauty-milano",
  healthcare: "studio-salus-torino",
  retail: "bottega-artigiana-firenze",
  fitness: "iron-gym-milano",
  hospitality: "villa-belvedere",
  beach: "lido-azzurro-rimini",
  plumber: "idraulica-rapida-bologna",
  electrician: "elettrica-moderna-verona",
  agriturismo: "podere-del-sole",
  cleaning: "pulitopro-modena",
  legal: "studio-martini-napoli",
  accounting: "studio-rossi-padova",
  garage: "autofficina-rossi-brescia",
  photography: "luce-studio-firenze",
  construction: "edil-costruzioni-bergamo",
  gardening: "verde-vivo-lucca",
  veterinary: "clinica-amica-genova",
  tattoo: "ink-factory-bologna",
  childcare: "piccoli-passi-parma",
  education: "accademia-sapere-bologna",
  events: "dream-events-milano",
  logistics: "flash-logistica-piacenza",
  custom: "demo-custom",
};

const NAMES: Record<string, string> = {
  food: "Admin Ristorante",
  ncc: "Admin NCC",
  beauty: "Admin Beauty",
  healthcare: "Admin Studio Medico",
  retail: "Admin Negozio",
  fitness: "Admin Palestra",
  hospitality: "Admin B&B",
  beach: "Admin Lido",
  plumber: "Admin Idraulico",
  electrician: "Admin Elettricista",
  agriturismo: "Admin Agriturismo",
  cleaning: "Admin Pulizie",
  legal: "Admin Avvocato",
  accounting: "Admin Commercialista",
  garage: "Admin Officina",
  photography: "Admin Fotografo",
  construction: "Admin Edilizia",
  gardening: "Admin Giardinaggio",
  veterinary: "Admin Veterinario",
  tattoo: "Admin Tattoo Studio",
  childcare: "Admin Asilo",
  education: "Admin Formazione",
  events: "Admin Eventi",
  logistics: "Admin Logistica",
  custom: "Admin Custom",
};

const CUSTOMER_ACCOUNTS = [
  { email: "cliente-food@empire-test.com", name: "Marco Rossi", industry: "food" },
  { email: "cliente-beauty@empire-test.com", name: "Giulia Bianchi", industry: "beauty" },
  { email: "cliente-ncc@empire-test.com", name: "Luca Verdi", industry: "ncc" },
  { email: "cliente-fitness@empire-test.com", name: "Sara Colombo", industry: "fitness" },
  { email: "cliente-healthcare@empire-test.com", name: "Paolo Moretti", industry: "healthcare" },
  { email: "cliente-hotel@empire-test.com", name: "Anna Ferrari", industry: "hospitality" },
  { email: "cliente-beach@empire-test.com", name: "Davide Ricci", industry: "beach" },
  { email: "cliente-legal@empire-test.com", name: "Francesca Conti", industry: "legal" },
  { email: "cliente-garage@empire-test.com", name: "Roberto Marino", industry: "garage" },
  { email: "cliente-events@empire-test.com", name: "Valentina Romano", industry: "events" },
];

const PASSWORD = "Empire2024!";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const results: any[] = [];
    const errors: any[] = [];

    // ── 1. Create admin accounts for each industry ──
    for (const industry of INDUSTRIES) {
      const email = `admin-${industry}@empire-test.com`;
      const fullName = NAMES[industry] || `Admin ${industry}`;
      const slug = SLUGS[industry];

      try {
        // Check if user already exists
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existing = existingUsers?.users?.find((u: any) => u.email === email);
        
        let userId: string;
        
        if (existing) {
          userId = existing.id;
          // Reset password to ensure consistency
          await supabase.auth.admin.updateUserById(userId, { password: PASSWORD });
          results.push({ email, status: "password_reset", userId });
        } else {
          // Create user
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password: PASSWORD,
            email_confirm: true,
            user_metadata: { full_name: fullName },
          });
          if (createError) {
            errors.push({ email, error: createError.message });
            continue;
          }
          userId = newUser.user.id;
          results.push({ email, status: "created", userId });
        }

        // Ensure profile exists
        await supabase.from("profiles").upsert({
          user_id: userId,
          email,
          full_name: fullName,
        }, { onConflict: "user_id" });

        // Assign restaurant_admin role
        await supabase.from("user_roles").upsert({
          user_id: userId,
          role: "restaurant_admin",
        }, { onConflict: "user_id,role" });

        // Link to company if exists
        const { data: company } = await supabase
          .from("companies")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();

        if (company) {
          // Set owner_id on company
          await supabase
            .from("companies")
            .update({ owner_id: userId })
            .eq("id", company.id);

          // Create membership
          const { data: existingMembership } = await supabase
            .from("company_memberships")
            .select("id")
            .eq("company_id", company.id)
            .eq("user_id", userId)
            .maybeSingle();

          if (!existingMembership) {
            await supabase.from("company_memberships").insert({
              company_id: company.id,
              user_id: userId,
              role: "admin",
            });
          }
        }

        // For food industry, also link to restaurant if exists
        if (industry === "food") {
          const { data: restaurant } = await supabase
            .from("restaurants")
            .select("id")
            .eq("slug", "impero-roma")
            .maybeSingle();

          if (restaurant) {
            await supabase
              .from("restaurants")
              .update({ owner_id: userId })
              .eq("id", restaurant.id);

            const { data: existingRM } = await supabase
              .from("restaurant_memberships")
              .select("id")
              .eq("restaurant_id", restaurant.id)
              .eq("user_id", userId)
              .maybeSingle();

            if (!existingRM) {
              await supabase.from("restaurant_memberships").insert({
                restaurant_id: restaurant.id,
                user_id: userId,
                role: "restaurant_admin",
              });
            }
          }
        }
      } catch (e) {
        errors.push({ email, error: String(e) });
      }
    }

    // ── 2. Create customer accounts ──
    for (const customer of CUSTOMER_ACCOUNTS) {
      try {
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existing = existingUsers?.users?.find((u: any) => u.email === customer.email);

        let userId: string;
        if (existing) {
          userId = existing.id;
          results.push({ email: customer.email, status: "already_exists", role: "customer", userId });
        } else {
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: customer.email,
            password: PASSWORD,
            email_confirm: true,
            user_metadata: { full_name: customer.name },
          });
          if (createError) {
            errors.push({ email: customer.email, error: createError.message });
            continue;
          }
          userId = newUser.user.id;
          results.push({ email: customer.email, status: "created", role: "customer", userId });
        }

        // Ensure profile
        await supabase.from("profiles").upsert({
          user_id: userId,
          email: customer.email,
          full_name: customer.name,
        }, { onConflict: "user_id" });

        // Assign customer role
        await supabase.from("user_roles").upsert({
          user_id: userId,
          role: "customer",
        }, { onConflict: "user_id,role" });

      } catch (e) {
        errors.push({ email: customer.email, error: String(e) });
      }
    }

    // ── 3. Create a super admin test account ──
    const superEmail = "superadmin@empire-test.com";
    try {
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((u: any) => u.email === superEmail);
      let userId: string;
      if (existing) {
        userId = existing.id;
        results.push({ email: superEmail, status: "already_exists", role: "super_admin" });
      } else {
        const { data: newUser, error } = await supabase.auth.admin.createUser({
          email: superEmail,
          password: PASSWORD,
          email_confirm: true,
          user_metadata: { full_name: "Super Admin Empire" },
        });
        if (error) {
          errors.push({ email: superEmail, error: error.message });
        } else {
          userId = newUser.user.id;
          results.push({ email: superEmail, status: "created", role: "super_admin" });
        }
      }
      if (userId!) {
        await supabase.from("profiles").upsert({
          user_id: userId!,
          email: superEmail,
          full_name: "Super Admin Empire",
        }, { onConflict: "user_id" });
        
        await supabase.from("user_roles").upsert({
          user_id: userId!,
          role: "super_admin",
        }, { onConflict: "user_id,role" });
      }
    } catch (e) {
      errors.push({ email: superEmail, error: String(e) });
    }

    // ── 4. Create partner test account ──
    const partnerEmail = "partner@empire-test.com";
    try {
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((u: any) => u.email === partnerEmail);
      let userId: string;
      if (existing) {
        userId = existing.id;
        results.push({ email: partnerEmail, status: "already_exists", role: "partner" });
      } else {
        const { data: newUser, error } = await supabase.auth.admin.createUser({
          email: partnerEmail,
          password: PASSWORD,
          email_confirm: true,
          user_metadata: { full_name: "Partner Demo" },
        });
        if (error) {
          errors.push({ email: partnerEmail, error: error.message });
        } else {
          userId = newUser.user.id;
          results.push({ email: partnerEmail, status: "created", role: "partner" });
        }
      }
      if (userId!) {
        await supabase.from("profiles").upsert({
          user_id: userId!,
          email: partnerEmail,
          full_name: "Partner Demo",
        }, { onConflict: "user_id" });

        await supabase.from("user_roles").upsert({
          user_id: userId!,
          role: "partner",
        }, { onConflict: "user_id,role" });
      }
    } catch (e) {
      errors.push({ email: partnerEmail, error: String(e) });
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_created: results.filter(r => r.status === "created").length,
        total_existing: results.filter(r => r.status === "already_exists").length,
        total_errors: errors.length,
        password: PASSWORD,
        results,
        errors,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
