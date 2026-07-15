import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_companies",
  title: "Elenca le mie aziende",
  description: "Restituisce le aziende (companies) visibili all'utente autenticato, filtrate da RLS.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).default(20).describe("Numero massimo di aziende da restituire."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Non autenticato" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("companies")
      .select("id, name, industry, slug, created_at")
      .limit(limit ?? 20);
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { companies: data ?? [] },
    };
  },
});
