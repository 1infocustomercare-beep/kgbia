// Empire Brain Orchestrator — coordina più agenti meta in simbiosi.
// Solo super_admin invoca. Pipeline: PLAN -> EXECUTE (sequenza/parallelo) -> SYNTHESIZE.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOVABLE_API = "https://ai.gateway.lovable.dev/v1/chat/completions";

interface PlanStep {
  agent_slug: string;
  goal: string;
  depends_on: number[]; // step indices this step needs output from
}

interface OrchestratorPlan {
  reasoning: string;
  steps: PlanStep[];
  final_synthesis_goal: string;
}

async function callLovable(model: string, messages: any[], opts: any = {}) {
  const resp = await fetch(LOVABLE_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, ...opts }),
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`AI ${resp.status}: ${t.slice(0, 200)}`);
  }
  return resp.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  try {
    const body = await req.json();
    const {
      task_input,
      task_title,
      preferred_agents = [] as string[],
      trigger_source = "manual",
      schedule_id = null,
      created_by = null,
    } = body;

    if (!task_input) {
      return new Response(JSON.stringify({ error: "task_input required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth check (skip for cron source which uses service key directly)
    let userId = created_by;
    if (trigger_source === "manual") {
      const authHeader = req.headers.get("Authorization") ?? "";
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      if (!user) {
        return new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", user.id).eq("role", "super_admin").maybeSingle();
      if (!roleRow) {
        return new Response(JSON.stringify({ error: "forbidden_super_admin_only" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userId = user.id;
    }

    // Create run row
    const { data: run, error: runErr } = await admin.from("empire_brain_runs").insert({
      task_title: task_title ?? task_input.slice(0, 80),
      task_input,
      status: "planning",
      trigger_source,
      schedule_id,
      created_by: userId,
    }).select().single();
    if (runErr) throw runErr;

    const t0 = Date.now();

    // Load agent catalog (slug + name + category + description)
    const { data: catalog } = await admin
      .from("empire_brain_agents")
      .select("slug,name,category_code,category_label,description,system_prompt,ai_model,is_orchestrator")
      .eq("is_active", true);
    if (!catalog || catalog.length === 0) throw new Error("No agents in catalog. Run seeder first.");

    const catalogIndex = new Map(catalog.map((a) => [a.slug, a]));

    // ───── 1) PLAN ─────
    const plannerCatalog = catalog
      .filter((a) => !a.is_orchestrator)
      .map((a) => `- ${a.slug} [${a.category_label}]: ${a.description?.slice(0, 140) ?? ""}`)
      .join("\n");

    const planSystem = `You are the Empire Brain Orchestrator (workflow-orchestrator).
Your job: read the user task and produce a JSON execution plan that selects 2-6 specialist agents from the catalog to collaborate.
Choose agents that complement each other. Order steps by dependency. If two steps are independent, give them the same depends_on so they can run in parallel.
Always end with a final synthesis goal: what the orchestrator must summarize from agent outputs.`;

    const preferredHint = preferred_agents.length > 0
      ? `\nThe operator suggested these agents (use them if relevant): ${preferred_agents.join(", ")}`
      : "";

    const planUser = `TASK: ${task_input}${preferredHint}

AGENT CATALOG (slug — category — description):
${plannerCatalog}

Return ONLY valid JSON matching this schema:
{
  "reasoning": "string — why these agents",
  "steps": [
    { "agent_slug": "string", "goal": "specific goal for this agent in this task", "depends_on": [indices of prior steps this needs, or []] }
  ],
  "final_synthesis_goal": "what to summarize at the end"
}`;

    const planResp = await callLovable("google/gemini-2.5-pro", [
      { role: "system", content: planSystem },
      { role: "user", content: planUser },
    ], {
      tools: [{
        type: "function",
        function: {
          name: "submit_plan",
          description: "Submit the orchestration plan",
          parameters: {
            type: "object",
            properties: {
              reasoning: { type: "string" },
              steps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    agent_slug: { type: "string" },
                    goal: { type: "string" },
                    depends_on: { type: "array", items: { type: "integer" } },
                  },
                  required: ["agent_slug", "goal", "depends_on"],
                },
              },
              final_synthesis_goal: { type: "string" },
            },
            required: ["reasoning", "steps", "final_synthesis_goal"],
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "submit_plan" } },
    });

    const toolCall = planResp.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("Planner returned no tool call");
    const plan: OrchestratorPlan = JSON.parse(toolCall.function.arguments);

    // Filter steps with valid agent slugs
    plan.steps = plan.steps.filter((s) => catalogIndex.has(s.agent_slug)).slice(0, 8);
    if (plan.steps.length === 0) throw new Error("Planner produced no valid steps");

    // Save plan
    await admin.from("empire_brain_runs").update({
      status: "running",
      orchestrator_plan: plan as any,
      total_steps: plan.steps.length + 1, // +1 for synthesis
      agents_used: plan.steps.map((s) => s.agent_slug),
    }).eq("id", run.id);

    // Log orchestrator step
    await admin.from("empire_brain_messages").insert({
      run_id: run.id,
      step_index: -1,
      agent_slug: "workflow-orchestrator",
      agent_name: "Workflow Orchestrator",
      role: "orchestrator",
      input_payload: { task_input, preferred_agents },
      output_text: plan.reasoning,
      output_data: plan as any,
      status: "done",
      duration_ms: Date.now() - t0,
    });

    // ───── 2) EXECUTE STEPS WITH SHARED CONTEXT ─────
    const stepOutputs: Record<number, string> = {};

    // Group by dependency level
    const completed = new Set<number>();
    let safety = 0;
    while (completed.size < plan.steps.length && safety++ < 20) {
      const ready = plan.steps
        .map((s, i) => ({ s, i }))
        .filter(({ i, s }) => !completed.has(i) && s.depends_on.every((d) => completed.has(d)));
      if (ready.length === 0) break; // deadlock

      // Run ready steps in parallel
      await Promise.all(ready.map(async ({ s, i }) => {
        const agent = catalogIndex.get(s.agent_slug)!;
        const stepStart = Date.now();
        try {
          await admin.from("empire_brain_messages").insert({
            run_id: run.id, step_index: i, agent_slug: agent.slug, agent_name: agent.name,
            role: "agent", input_payload: { goal: s.goal }, status: "running",
          });

          const dependencyContext = s.depends_on.length > 0
            ? `\n\nPRIOR AGENT OUTPUTS (use these as context):\n${s.depends_on.map((d) => `--- Step ${d} (${plan.steps[d].agent_slug}) ---\n${stepOutputs[d]}`).join("\n\n")}`
            : "";

          const agentResp = await callLovable(agent.ai_model || "google/gemini-2.5-flash", [
            { role: "system", content: agent.system_prompt },
            { role: "user", content: `OVERALL TASK: ${task_input}\n\nYOUR SPECIFIC GOAL: ${s.goal}${dependencyContext}\n\nProduce a concise but complete output that downstream agents and the orchestrator can use. Use markdown.` },
          ], { max_completion_tokens: 1500 });

          const out = agentResp.choices?.[0]?.message?.content ?? "";
          stepOutputs[i] = out;
          completed.add(i);

          await admin.from("empire_brain_messages")
            .update({ output_text: out, status: "done", duration_ms: Date.now() - stepStart })
            .eq("run_id", run.id).eq("step_index", i);
          await admin.from("empire_brain_runs")
            .update({ completed_steps: completed.size + 1 })
            .eq("id", run.id);
        } catch (err: any) {
          await admin.from("empire_brain_messages")
            .update({ status: "error", error_message: String(err?.message ?? err), duration_ms: Date.now() - stepStart })
            .eq("run_id", run.id).eq("step_index", i);
          stepOutputs[i] = `[Agent ${s.agent_slug} failed: ${err?.message ?? err}]`;
          completed.add(i);
        }
      }));
    }

    // ───── 3) SYNTHESIZE ─────
    const synthStart = Date.now();
    const synthResp = await callLovable("google/gemini-2.5-pro", [
      { role: "system", content: "You are the Empire Brain Synthesizer. Combine specialist outputs into a clear, actionable executive summary in Italian. Use markdown headings and bullet points. Highlight: key findings, risks, recommended next actions. Be honest about gaps." },
      { role: "user", content: `ORIGINAL TASK: ${task_input}\n\nSYNTHESIS GOAL: ${plan.final_synthesis_goal}\n\nAGENT OUTPUTS:\n${plan.steps.map((s, i) => `### ${i + 1}. ${s.agent_slug} — ${s.goal}\n${stepOutputs[i] ?? "(no output)"}`).join("\n\n")}` },
    ], { max_completion_tokens: 2000 });

    const finalOutput = synthResp.choices?.[0]?.message?.content ?? "";

    await admin.from("empire_brain_messages").insert({
      run_id: run.id, step_index: 9999, agent_slug: "knowledge-synthesizer", agent_name: "Knowledge Synthesizer",
      role: "orchestrator", input_payload: { synthesis_goal: plan.final_synthesis_goal },
      output_text: finalOutput, status: "done", duration_ms: Date.now() - synthStart,
    });

    const totalDur = Date.now() - t0;
    await admin.from("empire_brain_runs").update({
      status: "completed",
      final_output: finalOutput,
      duration_ms: totalDur,
      completed_at: new Date().toISOString(),
      completed_steps: plan.steps.length + 1,
    }).eq("id", run.id);

    return new Response(JSON.stringify({
      success: true, run_id: run.id, plan, final_output: finalOutput, duration_ms: totalDur,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("orchestrator error:", e);
    return new Response(JSON.stringify({ error: e?.message ?? String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
