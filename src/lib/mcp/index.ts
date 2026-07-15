import { auth, defineMcp } from "@lovable.dev/mcp-js";
import whoamiTool from "./tools/whoami";
import listCompaniesTool from "./tools/list-companies";
import listRestaurantsTool from "./tools/list-restaurants";
import listLeadsTool from "./tools/list-leads";

// The OAuth issuer MUST be the direct Supabase host, built from the project ref.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "empireia-mcp",
  title: "Empire IA · Agent Integrations",
  version: "0.1.0",
  instructions:
    "Strumenti Empire IA per il tuo account autenticato: leggi le tue aziende, ristoranti e lead. Ogni chiamata rispetta RLS e si autentica come l'utente collegato.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [whoamiTool, listCompaniesTool, listRestaurantsTool, listLeadsTool],
});
