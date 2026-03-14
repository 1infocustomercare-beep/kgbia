import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { user_id, team_leader_id } = await req.json();
    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Remove default restaurant_admin role
    await supabaseAdmin.from("user_roles").delete().eq("user_id", user_id).eq("role", "restaurant_admin");

    // Add partner role
    const { error } = await supabaseAdmin.from("user_roles").upsert(
      { user_id, role: "partner" },
      { onConflict: "user_id,role" }
    );
    if (error) throw error;

    // Sync profile data from auth user_metadata (phone, city, full_name)
    try {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user_id);
      if (authUser?.user) {
        const meta = authUser.user.user_metadata || {};
        const fullName = meta.full_name || meta.name || null;
        const email = authUser.user.email || null;

        // Upsert profile
        const { data: existingProfile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("user_id", user_id)
          .maybeSingle();

        if (existingProfile) {
          // Update if name is missing
          if (fullName) {
            await supabaseAdmin.from("profiles").update({ full_name: fullName }).eq("user_id", user_id);
          }
        } else {
          // Create profile
          await supabaseAdmin.from("profiles").insert({
            user_id,
            full_name: fullName,
            email,
          });
        }
      }
    } catch (profileErr) {
      console.error("Profile sync error (non-blocking):", profileErr);
    }

    // If referred by a team leader, add to their team
    if (team_leader_id) {
      // Verify the team_leader_id is actually a team leader
      const { data: leaderRole } = await supabaseAdmin
        .from("user_roles")
        .select("id")
        .eq("user_id", team_leader_id)
        .eq("role", "team_leader")
        .maybeSingle();

      if (leaderRole) {
        // Check not already in a team
        const { data: existing } = await supabaseAdmin
          .from("partner_teams")
          .select("id")
          .eq("partner_id", user_id)
          .maybeSingle();

        if (!existing) {
          await supabaseAdmin.from("partner_teams").insert({
            partner_id: user_id,
            team_leader_id,
          });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, team_leader_id: team_leader_id || null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
