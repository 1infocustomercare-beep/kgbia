import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "whoami",
  title: "Chi sono",
  description: "Restituisce l'utente autenticato (id, email) collegato al client MCP.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Non autenticato" }], isError: true };
    }
    const payload = {
      user_id: ctx.getUserId(),
      email: ctx.getUserEmail(),
      client_id: ctx.getClientId(),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
