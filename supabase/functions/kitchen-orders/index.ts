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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { pin_code, action, order_id, status } = body;

    if (!pin_code) {
      return new Response(JSON.stringify({ error: "PIN required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify PIN using security definer function
    const { data: pinData, error: pinError } = await supabase.rpc("verify_kitchen_pin", {
      p_pin: pin_code,
    });

    if (pinError || !pinData || pinData.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid PIN" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const restaurantId = pinData[0].restaurant_id;

    // Action: fetch orders
    if (!action || action === "fetch") {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .in("status", ["pending", "preparing", "ready"])
        .order("created_at", { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ orders, restaurant_id: restaurantId }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Action: update order status
    if (action === "update_status" && order_id && status) {
      // Verify the order belongs to this restaurant
      const { data: order } = await supabase
        .from("orders")
        .select("id")
        .eq("id", order_id)
        .eq("restaurant_id", restaurantId)
        .single();

      if (!order) {
        return new Response(JSON.stringify({ error: "Order not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", order_id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
