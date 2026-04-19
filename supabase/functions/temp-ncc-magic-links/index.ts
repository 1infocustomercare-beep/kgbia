import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const emails = [
    "admin-ncc@empire-test.com",
    "cliente-ncc@empire-test.com",
    "cliente-fitness@empire-test.com",
  ];

  const out: Record<string, string> = {};
  for (const email of emails) {
    const { data, error } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: "https://empireia.lovable.app/app" },
    });
    out[email] = error ? `ERR: ${error.message}` : (data?.properties?.action_link ?? "no_link");
  }

  return new Response(JSON.stringify(out, null, 2), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
});
