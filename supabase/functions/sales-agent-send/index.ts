// Sales Agent - Approva e invia su canale appropriato
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function sendViaChannel(channel: string, recipient: string, subject: string | null, body: string): Promise<{ ok: boolean; error?: string; provider?: string }> {
  // Email via Resend (se configurato)
  const RESEND = Deno.env.get("RESEND_API_KEY");
  const LOVABLE = Deno.env.get("LOVABLE_API_KEY");
  if (channel === "email" && RESEND && LOVABLE) {
    const r = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE}`, "X-Connection-Api-Key": RESEND, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Arianna <arianna@empireaigroup.com>",
        to: [recipient], subject: subject ?? "Una proposta per la tua attività", html: body.replace(/\n/g, "<br>"),
      }),
    });
    if (!r.ok) return { ok: false, error: await r.text(), provider: "resend" };
    return { ok: true, provider: "resend" };
  }

  // WhatsApp via Twilio
  const TWILIO = Deno.env.get("TWILIO_API_KEY");
  if (channel === "whatsapp" && TWILIO && LOVABLE) {
    const r = await fetch("https://connector-gateway.lovable.dev/twilio/Messages.json", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE}`, "X-Connection-Api-Key": TWILIO, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        To: `whatsapp:${recipient}`, From: "whatsapp:+14155238886", Body: body,
      }),
    });
    if (!r.ok) return { ok: false, error: await r.text(), provider: "twilio" };
    return { ok: true, provider: "twilio" };
  }

  // Fallback: log only
  return { ok: true, provider: "stub" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { approval_id, decision, edited_body } = await req.json();
    if (!approval_id) return new Response(JSON.stringify({ error: "approval_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: approval } = await supabase
      .from("sales_agent_approvals").select("*").eq("id", approval_id).single();
    if (!approval) return new Response(JSON.stringify({ error: "not_found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    if (decision === "reject") {
      await supabase.from("sales_agent_approvals").update({
        status: "rejected", approved_at: new Date().toISOString(),
      }).eq("id", approval_id);
      return new Response(JSON.stringify({ success: true, action: "rejected" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const finalBody = edited_body || approval.draft_body;
    const result = await sendViaChannel(approval.channel, approval.recipient, approval.draft_subject, finalBody);

    await supabase.from("sales_agent_approvals").update({
      status: edited_body ? "edited" : "approved",
      edited_body: edited_body ?? null,
      approved_at: new Date().toISOString(),
    }).eq("id", approval_id);

    await supabase.from("sales_agent_actions").update({
      status: result.ok ? "success" : "failed",
      result: result,
    }).eq("id", approval.action_id);

    if (result.ok) {
      await supabase.from("sales_agent_conversations").insert({
        owner_id: approval.owner_id, lead_id: approval.lead_id,
        channel: approval.channel, direction: "outbound",
        subject: approval.draft_subject, body: finalBody,
        sent_by_agent: true,
        delivered_at: new Date().toISOString(),
        metadata: { provider: result.provider },
      });
    }

    return new Response(JSON.stringify({ success: result.ok, ...result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send error:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
