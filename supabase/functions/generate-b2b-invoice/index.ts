import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Generate B2B Invoice for Italian compliance
 * Supports: setup_fee, commission_note
 * Fields: Partita IVA, Codice Univoco, PEC
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { restaurant_id, partner_id, invoice_type, recipient_name, recipient_email, partita_iva, codice_univoco, pec } = await req.json();

    if (!restaurant_id && !partner_id) {
      return new Response(JSON.stringify({ error: "restaurant_id or partner_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const invoiceNumber = `EMP-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}-${Math.random().toString(36).substr(2,6).toUpperCase()}`;

    if (invoice_type === "commission_note" && partner_id) {
      // Generate partner commission summary (L. 173/2005)
      const currentMonth = now.toISOString().slice(0, 7);
      
      const { data: sales } = await supabase
        .from("partner_sales")
        .select("*")
        .eq("partner_id", partner_id)
        .eq("sale_month", currentMonth);

      const { data: bonuses } = await supabase
        .from("performance_bonuses")
        .select("*")
        .eq("partner_id", partner_id)
        .eq("bonus_month", currentMonth);

      const totalCommission = (sales || []).reduce((s: number, r: any) => s + Number(r.partner_commission), 0);
      const totalOverrides = (sales || []).reduce((s: number, r: any) => s + Number(r.team_leader_override), 0);
      const totalBonuses = (bonuses || []).reduce((s: number, r: any) => s + Number(r.bonus_amount), 0);

      const { data: note, error } = await supabase
        .from("partner_commission_notes")
        .insert({
          partner_id,
          period: currentMonth,
          total_sales: (sales || []).length,
          total_commission: totalCommission,
          total_overrides: totalOverrides,
          total_bonuses: totalBonuses,
          net_amount: totalCommission + totalOverrides + totalBonuses,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, note }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Setup fee B2B invoice
    const subtotal = 2997;
    const vatRate = 22;
    const vatAmount = +(subtotal * vatRate / 100).toFixed(2);
    const total = subtotal + vatAmount;

    const lineItems = [
      { description: "Empire Platform — Licenza Perpetua + Setup", quantity: 1, unit_price: 2997, total: 2997 },
    ];

    const { data: invoice, error } = await supabase
      .from("b2b_invoices")
      .insert({
        restaurant_id: restaurant_id || "00000000-0000-0000-0000-000000000000",
        partner_id,
        invoice_number: invoiceNumber,
        invoice_type: invoice_type || "setup_fee",
        recipient_name,
        recipient_email,
        partita_iva,
        codice_univoco,
        pec,
        line_items: lineItems,
        subtotal,
        vat_rate: vatRate,
        vat_amount: vatAmount,
        total,
        notes: "Rif. normativo: Regime Incaricati alle Vendite — L. 173/2005",
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, invoice }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
