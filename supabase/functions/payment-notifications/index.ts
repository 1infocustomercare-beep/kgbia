import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");

    const resend = new Resend(resendKey);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const threeDaysStr = threeDaysFromNow.toISOString().split("T")[0];
    const todayStr = now.toISOString().split("T")[0];

    // 1. Warning: 3 days before due date
    const { data: warningPayments } = await supabase
      .from("restaurant_payments")
      .select("*, restaurants(name, email, owner_id)")
      .lte("next_due_date", threeDaysStr)
      .gt("next_due_date", todayStr)
      .is("warning_sent_at", null)
      .lt("installments_paid", supabase.rpc ? undefined : 999) // fallback
      .eq("is_overdue", false);

    // Filter where installments_paid < installments_total
    const filteredWarnings = (warningPayments || []).filter(
      (p: any) => p.installments_paid < p.installments_total && p.restaurants?.email
    );

    for (const payment of filteredWarnings) {
      const restaurant = payment.restaurants;
      const dueDate = new Date(payment.next_due_date).toLocaleDateString("it-IT");

      await resend.emails.send({
        from: "Empire <noreply@empire-app.it>",
        to: [restaurant.email],
        subject: `⚠️ Rata in scadenza - ${restaurant.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px;">
            <h1 style="color: #1a1a1a; font-size: 24px;">Promemoria Pagamento</h1>
            <p style="color: #333; font-size: 16px;">Gentile <strong>${restaurant.name}</strong>,</p>
            <p style="color: #333;">La tua prossima rata di <strong>€${payment.installment_amount}</strong> scade il <strong>${dueDate}</strong>.</p>
            <p style="color: #333;">Rata ${payment.installments_paid + 1} di ${payment.installments_total} — Piano: ${payment.plan_type}</p>
            <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400E;">Assicurati di effettuare il pagamento entro la scadenza per evitare il blocco del servizio.</p>
            </div>
            <p style="color: #666; font-size: 14px;">Se hai già provveduto al pagamento, ignora questo messaggio.</p>
            <p style="color: #999; font-size: 12px; margin-top: 32px;">— Team Empire</p>
          </div>
        `,
      });

      await supabase
        .from("restaurant_payments")
        .update({ warning_sent_at: now.toISOString() })
        .eq("id", payment.id);
    }

    // 2. Block notice: overdue payments not yet notified
    const { data: blockPayments } = await supabase
      .from("restaurant_payments")
      .select("*, restaurants(name, email)")
      .eq("is_overdue", true)
      .is("block_notice_sent_at", null);

    for (const payment of (blockPayments || []).filter((p: any) => p.restaurants?.email)) {
      const restaurant = payment.restaurants;

      await resend.emails.send({
        from: "Empire <noreply@empire-app.it>",
        to: [restaurant.email],
        subject: `🚫 Servizio bloccato - ${restaurant.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px;">
            <h1 style="color: #DC2626; font-size: 24px;">Servizio Sospeso</h1>
            <p style="color: #333;">Gentile <strong>${restaurant.name}</strong>,</p>
            <p style="color: #333;">La tua rata di <strong>€${payment.installment_amount}</strong> risulta scaduta e non pagata.</p>
            <div style="background: #FEE2E2; border-left: 4px solid #DC2626; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="margin: 0; color: #991B1B;"><strong>Il tuo menu digitale è stato temporaneamente sospeso.</strong></p>
              <p style="margin: 8px 0 0; color: #991B1B;">I tuoi clienti non potranno accedere al menu fino alla regolarizzazione del pagamento.</p>
            </div>
            <p style="color: #333;">Per riattivare il servizio, contatta il supporto Empire o effettua il pagamento.</p>
            <p style="color: #999; font-size: 12px; margin-top: 32px;">— Team Empire</p>
          </div>
        `,
      });

      await supabase
        .from("restaurant_payments")
        .update({ block_notice_sent_at: now.toISOString() })
        .eq("id", payment.id);
    }

    // 3. Reactivation: recently unblocked restaurants
    const { data: reactivatedPayments } = await supabase
      .from("restaurant_payments")
      .select("*, restaurants(name, email, is_blocked)")
      .eq("is_overdue", false)
      .not("block_notice_sent_at", "is", null)
      .is("reactivation_sent_at", null);

    for (const payment of (reactivatedPayments || []).filter(
      (p: any) => p.restaurants?.email && !p.restaurants.is_blocked
    )) {
      const restaurant = payment.restaurants;

      await resend.emails.send({
        from: "Empire <noreply@empire-app.it>",
        to: [restaurant.email],
        subject: `✅ Servizio riattivato - ${restaurant.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px;">
            <h1 style="color: #059669; font-size: 24px;">Servizio Riattivato!</h1>
            <p style="color: #333;">Gentile <strong>${restaurant.name}</strong>,</p>
            <p style="color: #333;">Il tuo pagamento è stato registrato con successo. Il tuo menu digitale è nuovamente attivo!</p>
            <div style="background: #D1FAE5; border-left: 4px solid #059669; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="margin: 0; color: #065F46;">I tuoi clienti possono nuovamente accedere al menu e ordinare.</p>
            </div>
            ${payment.installments_paid < payment.installments_total
              ? `<p style="color: #333;">Prossima rata: <strong>€${payment.installment_amount}</strong> — Rata ${payment.installments_paid + 1} di ${payment.installments_total}</p>`
              : `<p style="color: #059669; font-weight: bold;">🎉 Tutte le rate sono state saldate. Grazie!</p>`
            }
            <p style="color: #999; font-size: 12px; margin-top: 32px;">— Team Empire</p>
          </div>
        `,
      });

      await supabase
        .from("restaurant_payments")
        .update({ reactivation_sent_at: now.toISOString() })
        .eq("id", payment.id);
    }

    const summary = {
      warnings_sent: filteredWarnings.length,
      block_notices_sent: (blockPayments || []).filter((p: any) => p.restaurants?.email).length,
      reactivations_sent: (reactivatedPayments || []).filter(
        (p: any) => p.restaurants?.email && !p.restaurants.is_blocked
      ).length,
    };

    console.log("Payment notifications summary:", summary);

    return new Response(JSON.stringify({ success: true, ...summary }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Payment notification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
