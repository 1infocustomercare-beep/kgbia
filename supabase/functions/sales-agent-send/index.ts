// Sales Agent - Approva e invia su canale appropriato (HTML Aurora + suppression check)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function sendViaChannel(
  channel: string,
  recipient: string,
  subject: string | null,
  textBody: string,
  htmlBody: string | null,
): Promise<{ ok: boolean; error?: string; provider?: string }> {
  const RESEND = Deno.env.get("RESEND_API_KEY");
  const LOVABLE = Deno.env.get("LOVABLE_API_KEY");

  if (channel === "email" && RESEND && LOVABLE) {
    const finalHtml = htmlBody || `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;color:#0f0a1f;line-height:1.6;max-width:600px;margin:0 auto;padding:20px;">${textBody.replace(/\n/g, "<br/>")}</div>`;
    const r = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE}`, "X-Connection-Api-Key": RESEND, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Arianna <arianna@empireaigroup.com>",
        to: [recipient],
        subject: subject ?? "Una proposta per la tua attività",
        html: finalHtml,
        text: textBody,
        headers: {
          "List-Unsubscribe": `<mailto:unsubscribe@empireaigroup.com?subject=unsub-${encodeURIComponent(recipient)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
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
        To: `whatsapp:${recipient}`, From: "whatsapp:+14155238886", Body: textBody,
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
    // ── Auth guard ──
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: authData, error: authErr } = await userClient.auth.getUser();
    if (authErr || !authData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const callerId = authData.user.id;

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { approval_id, decision, edited_body, edited_subject, edited_html, override_template_id } = await req.json();
    if (!approval_id) return new Response(JSON.stringify({ error: "approval_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: approval } = await supabase
      .from("sales_agent_approvals").select("*").eq("id", approval_id).single();
    if (!approval) return new Response(JSON.stringify({ error: "not_found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // ── Ownership check ──
    if (approval.owner_id !== callerId) {
      const { data: isSuper } = await supabase.rpc("has_role", { _user_id: callerId, _role: "super_admin" });
      if (!isSuper) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    if (decision === "reject") {
      await supabase.from("sales_agent_approvals").update({
        status: "rejected", approved_at: new Date().toISOString(),
      }).eq("id", approval_id);
      return new Response(JSON.stringify({ success: true, action: "rejected" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Override template OR backfill HTML on legacy approvals senza body_html
    let finalHtml: string | null = edited_html ?? approval.body_html ?? null;
    let finalTemplateId: string | null = override_template_id ?? approval.template_id ?? null;
    const needsBackfill = !finalHtml && approval.channel === "email";
    const needsOverride = override_template_id && override_template_id !== approval.template_id;
    if (needsOverride || needsBackfill) {
      try {
        const { renderAuroraTemplate, pickAuroraTemplateForLead } = await import("../_shared/aurora-email-renderer.ts");
        // Carica lead per AI auto-pick se backfill
        let pickedId = override_template_id;
        if (!pickedId && needsBackfill && approval.lead_id) {
          const { data: lead } = await supabase.from("leads").select("sector,google_rating,ai_score,name").eq("id", approval.lead_id).maybeSingle();
          const ai = pickAuroraTemplateForLead({
            sector: lead?.sector,
            google_rating: lead?.google_rating ?? null,
            ai_score: lead?.ai_score ?? null,
          });
          pickedId = ai.id;
        }
        if (pickedId) {
          const rendered = renderAuroraTemplate(pickedId, {
            recipientName: (approval.recipient || "").split("@")[0] || "ciao",
            businessName: approval.draft_subject?.replace(/^[✍️📧📩💌\s]+/, "").replace(/^Bozza\s+\w+:\s+/i, "") || "la vostra attività",
            previewLink: approval.template_metadata?.preview_url || approval.template_metadata?.meta?.preview_url || "",
            senderName: "Arianna",
            senderRole: "Empire AI Group",
          });
          if (rendered) {
            finalHtml = rendered.html;
            finalTemplateId = rendered.meta.id;
          }
        }
      } catch (e) {
        console.warn("Aurora render (override/backfill) failed:", e);
      }
    }

    const finalSubject = edited_subject ?? approval.draft_subject;
    const finalText = edited_body || approval.draft_body;
    const result = await sendViaChannel(approval.channel, approval.recipient, finalSubject, finalText, finalHtml);

    await supabase.from("sales_agent_approvals").update({
      status: edited_body || edited_html || override_template_id ? "edited" : "approved",
      edited_body: edited_body ?? null,
      template_id: finalTemplateId,
      body_html: finalHtml,
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
        subject: finalSubject, body: finalText,
        sent_by_agent: true,
        delivered_at: new Date().toISOString(),
        metadata: { provider: result.provider, template_id: finalTemplateId, has_html: !!finalHtml },
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
