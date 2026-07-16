import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate monthly 2% fee summary for a restaurant
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // ── Auth guard ──
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const _authClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: { user: _authUser }, error: _authErr } = await _authClient.auth.getUser();
    if (_authErr || !_authUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { restaurantId, monthYear } = await req.json();

    if (!restaurantId || !monthYear) throw new Error("Missing restaurantId or monthYear");

    // ── Ownership check ──
    const { data: ownership } = await supabase.from("restaurants").select("id")
      .eq("id", restaurantId).eq("owner_id", _authUser.id).maybeSingle();
    if (!ownership) {
      const { data: membership } = await supabase.from("restaurant_memberships").select("id")
        .eq("restaurant_id", restaurantId).eq("user_id", _authUser.id).maybeSingle();
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: _authUser.id, _role: "super_admin" });
      if (!membership && !isAdmin) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const startDate = `${monthYear}-01`;
    const [year, month] = monthYear.split("-").map(Number);
    const nextMonth = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, "0")}-01`;

    // Fetch all orders for the month
    const { data: orders, error } = await supabase
      .from("orders")
      .select("id, total, created_at")
      .eq("restaurant_id", restaurantId)
      .gte("created_at", startDate)
      .lt("created_at", nextMonth);

    if (error) throw error;

    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((s: number, o: any) => s + Number(o.total), 0) || 0;
    const totalFees = Math.round(totalRevenue * 0.02 * 100) / 100;

    // Upsert invoice
    const { data: invoice, error: upsertErr } = await supabase
      .from("monthly_fee_invoices" as any)
      .upsert({
        restaurant_id: restaurantId,
        month_year: monthYear,
        total_orders: totalOrders,
        total_revenue: totalRevenue,
        total_fees: totalFees,
        generated_at: new Date().toISOString(),
      }, { onConflict: "restaurant_id,month_year" })
      .select()
      .single();

    if (upsertErr) throw upsertErr;

    return new Response(JSON.stringify({
      invoice,
      summary: {
        month: monthYear,
        orders: totalOrders,
        revenue: `€${totalRevenue.toFixed(2)}`,
        fees: `€${totalFees.toFixed(2)}`,
        feeRate: "2%",
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
