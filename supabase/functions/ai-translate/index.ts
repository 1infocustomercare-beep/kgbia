import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LANGUAGE_MAP: Record<string, string> = {
  en: "English", de: "German", fr: "French", es: "Spanish",
  zh: "Chinese (Simplified)", ja: "Japanese", ar: "Arabic",
  ru: "Russian", pt: "Portuguese", ko: "Korean",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { menuItems, targetLanguages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langNames = targetLanguages.filter((l: string) => l !== "it").map((l: string) => LANGUAGE_MAP[l] || l);
    if (langNames.length === 0) {
      return new Response(JSON.stringify({ translations: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const itemsForTranslation = menuItems.slice(0, 50).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
    }));

    const prompt = `Traduci questi piatti di un menu di ristorante italiano nelle seguenti lingue: ${langNames.join(", ")}.

Piatti da tradurre:
${JSON.stringify(itemsForTranslation, null, 2)}

Rispondi SOLO con un JSON array. Per ogni piatto, restituisci:
{"id": "uuid", "name_translations": {"en": "...", "de": "..."}, "description_translations": {"en": "...", "de": "..."}}

Le traduzioni devono essere naturali e appetitose, non letterali. Mantieni i nomi dei piatti tipici italiani quando sono iconici (es. "Tiramisu" resta "Tiramisu" ma con descrizione tradotta).`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "Sei un traduttore esperto di gastronomia italiana. Traduci in modo naturale e appetitoso." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit. Riprova tra poco." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    
    let translations = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        translations = JSON.parse(jsonMatch[0]);
      }
    } catch {
      console.error("Failed to parse translations:", content);
    }

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("ai-translate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
