import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, imageBase64, dishDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (action === "ocr") {
      // OCR: Extract menu items from image
      const messages: any[] = [
        {
          role: "system",
          content: "Sei un esperto OCR per menu di ristoranti italiani. Estrai TUTTI i piatti dal menu nell'immagine. Per ogni piatto restituisci nome, descrizione breve, prezzo e categoria. Rispondi SOLO con un JSON array."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Estrai i piatti da questo menu. Rispondi con un JSON array di oggetti con: name, description, price (numero), category." },
            ...(imageBase64 ? [{ type: "image_url", image_url: { url: imageBase64 } }] : [])
          ]
        }
      ];

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages,
        }),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) {
          return new Response(JSON.stringify({ error: "Troppi richieste. Riprova tra poco." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (status === 402) {
          return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const errorText = await response.text();
        console.error("AI gateway error:", status, errorText);
        throw new Error(`AI gateway error: ${status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "[]";
      
      // Try to extract JSON from the response
      let dishes = [];
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          dishes = JSON.parse(jsonMatch[0]);
        }
      } catch {
        console.error("Failed to parse OCR result:", content);
      }

      return new Response(JSON.stringify({ dishes }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate-image") {
      // Generate food-porn image from dish description
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: `Generate a hyper-realistic, ultra professional food photography image of this Italian restaurant dish: "${dishDescription}". Style: food porn, Michelin-star presentation, shot from 45-degree angle on an elegant dark ceramic plate, restaurant table setting with soft warm candlelight, extremely shallow depth of field with creamy bokeh background, garnished beautifully, steam rising if hot dish, vibrant natural colors, 8K quality. The food must look absolutely irresistible and mouthwatering. Ultra high resolution.`
            }
          ],
          modalities: ["image", "text"],
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
        throw new Error(`Image generation failed: ${status}`);
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;

      // If we got a base64 image, upload to storage
      if (imageUrl && imageUrl.startsWith("data:")) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.49.1");
        const supabase = createClient(supabaseUrl, serviceKey);

        // Extract base64 data
        const base64Match = imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
        if (base64Match) {
          const ext = base64Match[1] === "jpeg" ? "jpg" : base64Match[1];
          const base64Data = base64Match[2];
          const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          const fileName = `ai-dishes/${crypto.randomUUID()}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from("restaurant-logos")
            .upload(fileName, bytes, { contentType: `image/${base64Match[1]}`, upsert: true });

          if (!uploadError) {
            const { data: publicUrl } = supabase.storage
              .from("restaurant-logos")
              .getPublicUrl(fileName);
            return new Response(JSON.stringify({ imageUrl: publicUrl.publicUrl }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          console.error("Upload error:", uploadError);
        }
      }

      return new Response(JSON.stringify({ imageUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("ai-menu error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
