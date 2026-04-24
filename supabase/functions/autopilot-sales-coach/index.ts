// ═══════════════════════════════════════════════════════════════
// EMPIRE AUTOPILOT — Sales Coach AI + Gamification engine
// XP / Levels / Badges / Micro-actions / Leaderboard
// ═══════════════════════════════════════════════════════════════
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Badge catalog
const BADGES = [
  {
    id: "first_blood",
    name: "Prima Lead",
    desc: "Prima conversazione avviata",
    threshold: { conversations: 1 },
  },
  {
    id: "scout_10",
    name: "Esploratore",
    desc: "10 pain scan completate",
    threshold: { scans: 10 },
  },
  {
    id: "scout_50",
    name: "Cacciatore",
    desc: "50 pain scan completate",
    threshold: { scans: 50 },
  },
  {
    id: "closer_1",
    name: "Closer",
    desc: "Primo deal chiuso",
    threshold: { deals: 1 },
  },
  {
    id: "closer_10",
    name: "Top Closer",
    desc: "10 deal chiusi",
    threshold: { deals: 10 },
  },
  {
    id: "streak_7",
    name: "Costante",
    desc: "7 giorni di attività consecutivi",
    threshold: { streak: 7 },
  },
  {
    id: "streak_30",
    name: "Inarrestabile",
    desc: "30 giorni di streak",
    threshold: { streak: 30 },
  },
  {
    id: "level_10",
    name: "Veterano",
    desc: "Livello 10 raggiunto",
    threshold: { level: 10 },
  },
  {
    id: "level_25",
    name: "Maestro",
    desc: "Livello 25 raggiunto",
    threshold: { level: 25 },
  },
  {
    id: "revenue_5k",
    name: "5K Club",
    desc: "5000€ revenue mensile",
    threshold: { revenue_month: 5000 },
  },
  {
    id: "revenue_25k",
    name: "Diamond Seller",
    desc: "25000€ revenue mensile",
    threshold: { revenue_month: 25000 },
  },
];

async function callGeminiPro(messages: any[]) {
  const resp = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages,
        tools: [{
          type: "function",
          function: {
            name: "coach_advice",
            description: "Generate sales coaching advice",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                message: { type: "string", description: "Max 220 chars" },
                action_label: { type: "string" },
                priority: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                },
                category: {
                  type: "string",
                  enum: [
                    "micro_action",
                    "coaching_tip",
                    "celebration",
                    "warning",
                  ],
                },
              },
              required: ["title", "message", "priority", "category"],
            },
          },
        }],
        tool_choice: {
          type: "function",
          function: { name: "coach_advice" },
        },
      }),
    },
  );
  if (!resp.ok) throw new Error(`Gemini ${resp.status}`);
  return await resp.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const userClient = createClient(
      SUPABASE_URL,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const action = body.action ?? "generate_insight";

    // ── REFRESH STATS + BADGES + RANKS ────────────────────────
    if (action === "refresh_stats") {
      const since = new Date();
      since.setDate(1);

      const [scansRes, convRes, wonRes] = await Promise.all([
        supabase.from("pain_scans").select("id", { count: "exact", head: true })
          .eq("owner_id", user.id),
        supabase.from("autopilot_conversations").select("id", {
          count: "exact",
          head: true,
        }).eq("owner_id", user.id),
        supabase.from("autopilot_conversations").select("id", {
          count: "exact",
          head: true,
        }).eq("owner_id", user.id).eq("status", "won").gte(
          "closed_at",
          since.toISOString(),
        ),
      ]);

      const totalScans = scansRes.count ?? 0;
      const totalConvs = convRes.count ?? 0;
      const dealsMonth = wonRes.count ?? 0;
      const revenueMonth = dealsMonth * 1997; // baseline plan price

      // Get current row
      const { data: existing } = await supabase.from("sales_leaderboard")
        .select("*").eq("user_id", user.id).maybeSingle();

      const earnedBadges: string[] = [];
      for (const b of BADGES) {
        const t = b.threshold;
        const ok =
          (t.scans !== undefined ? totalScans >= t.scans : true) &&
          (t.conversations !== undefined
            ? totalConvs >= t.conversations
            : true) &&
          (t.deals !== undefined ? dealsMonth >= t.deals : true) &&
          (t.streak !== undefined
            ? (existing?.streak_days ?? 0) >= t.streak
            : true) &&
          (t.level !== undefined
            ? (existing?.level ?? 1) >= t.level
            : true) &&
          (t.revenue_month !== undefined
            ? revenueMonth >= t.revenue_month
            : true);
        if (ok) earnedBadges.push(b.id);
      }

      const newBadges = earnedBadges.filter((id) =>
        !(existing?.badges as string[] | undefined)?.includes(id)
      );

      // Streak: incremento se ultima attività era ieri
      let streakDays = existing?.streak_days ?? 0;
      const today = new Date().toISOString().slice(0, 10);
      const lastDay = existing?.last_activity_at
        ? new Date(existing.last_activity_at).toISOString().slice(0, 10)
        : null;
      if (lastDay !== today) {
        const yest = new Date();
        yest.setDate(yest.getDate() - 1);
        const yStr = yest.toISOString().slice(0, 10);
        streakDays = lastDay === yStr ? streakDays + 1 : 1;
      }

      const { data: leaderboard } = await supabase
        .from("sales_leaderboard")
        .upsert({
          user_id: user.id,
          display_name: user.user_metadata?.full_name ?? user.email,
          avatar_url: user.user_metadata?.avatar_url,
          deals_closed_month: dealsMonth,
          revenue_month_eur: revenueMonth,
          badges: earnedBadges,
          streak_days: streakDays,
          last_activity_at: new Date().toISOString(),
        })
        .select()
        .single();

      // Celebrate new badges
      for (const bid of newBadges) {
        const badge = BADGES.find((x) => x.id === bid)!;
        await supabase.from("sales_coach_insights").insert({
          user_id: user.id,
          insight_type: "celebration",
          priority: "medium",
          title: `🏆 Badge sbloccato: ${badge.name}`,
          message: badge.desc,
          supporting_data: { badge_id: bid },
        });
      }

      // Recalc global ranks (top 100)
      const { data: top } = await supabase.from("sales_leaderboard")
        .select("user_id").order("total_xp", { ascending: false }).limit(100);
      const myRank = top?.findIndex((r) => r.user_id === user.id);
      if (myRank !== undefined && myRank >= 0) {
        await supabase.from("sales_leaderboard").update({
          global_rank: myRank + 1,
        }).eq("user_id", user.id);
      }

      return new Response(
        JSON.stringify({
          leaderboard,
          new_badges: newBadges,
          stats: { totalScans, totalConvs, dealsMonth, revenueMonth },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ── GENERATE AI INSIGHT ───────────────────────────────────
    if (action === "generate_insight") {
      const { data: lb } = await supabase.from("sales_leaderboard")
        .select("*").eq("user_id", user.id).maybeSingle();
      const { data: recentConvs } = await supabase
        .from("autopilot_conversations")
        .select("status, funnel_stage, sentiment, updated_at")
        .eq("owner_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(20);

      const stats = {
        level: lb?.level ?? 1,
        xp: lb?.total_xp ?? 0,
        streak: lb?.streak_days ?? 0,
        deals_month: lb?.deals_closed_month ?? 0,
        revenue_month: lb?.revenue_month_eur ?? 0,
        active_convs: recentConvs?.filter((c) => c.status === "active").length,
        won_recent: recentConvs?.filter((c) => c.status === "won").length,
        lost_recent: recentConvs?.filter((c) => c.status === "lost").length,
        negative_sentiment: recentConvs?.filter((c) =>
          c.sentiment === "negative"
        ).length,
      };

      const aiResp = await callGeminiPro([
        {
          role: "system",
          content:
            `Sei "Empire Sales Coach AI", brutalmente sincero ma motivante.
Genera UN solo insight azionabile in italiano, basato sulle stats del venditore.
Tono: amico esperto. No emoji eccessivi. Massimo 220 caratteri nel message.`,
        },
        {
          role: "user",
          content: `Stats venditore: ${JSON.stringify(stats)}
Genera l'insight più utile in questo momento: micro_action (cosa fare nei prossimi 30 min),
coaching_tip (lezione di vendita), celebration (se ha vinto qualcosa), o warning (se sta sbagliando).`,
        },
      ]);

      const tc = aiResp.choices?.[0]?.message?.tool_calls?.[0];
      const args = JSON.parse(tc?.function?.arguments ?? "{}");

      const { data: insight } = await supabase.from("sales_coach_insights")
        .insert({
          user_id: user.id,
          insight_type: args.category,
          priority: args.priority,
          title: args.title,
          message: args.message,
          action_label: args.action_label,
          action_url: "/partner/autopilot",
          supporting_data: { stats },
        }).select().single();

      return new Response(JSON.stringify({ insight }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── GET LEADERBOARD ───────────────────────────────────────
    if (action === "get_leaderboard") {
      const { data: top } = await supabase
        .from("sales_leaderboard")
        .select(
          "user_id, display_name, avatar_url, total_xp, level, badges, deals_closed_month, revenue_month_eur, streak_days, global_rank",
        )
        .order("total_xp", { ascending: false })
        .limit(50);
      return new Response(JSON.stringify({ leaderboard: top ?? [] }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown";
    console.error("autopilot-sales-coach error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
