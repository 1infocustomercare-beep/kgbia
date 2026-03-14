import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── AI Usage Tracking Helper ───
async function trackAIUsage(agentName: string, modelUsed: string, startTime: number, status: string) {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) return;
    const sb = createClient(supabaseUrl, serviceRoleKey);
    await sb.from("ai_usage_logs").insert({
      agent_name: agentName,
      model_used: modelUsed,
      duration_ms: Date.now() - startTime,
      status,
    });
  } catch (e) {
    console.error("Failed to track AI usage:", e);
  }
}

async function uploadBase64Image(imageUrl: string): Promise<string | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const base64Match = imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!base64Match) return null;

  const ext = base64Match[1] === "jpeg" ? "jpg" : base64Match[1];
  const base64Data = base64Match[2];
  const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
  const fileName = `ai-dishes/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("restaurant-logos")
    .upload(fileName, bytes, { contentType: `image/${base64Match[1]}`, upsert: true });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return null;
  }

  const { data: publicUrl } = supabase.storage.from("restaurant-logos").getPublicUrl(fileName);
  return publicUrl.publicUrl;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const startTime = Date.now();

  try {
    const { action, imageBase64, dishDescription, dishCategory, dishName, userPhotoBase64, plateStyle } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (action === "ocr") {
      const modelUsed = "google/gemini-2.5-flash";
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
        body: JSON.stringify({ model: modelUsed, messages }),
      });

      if (!response.ok) {
        await trackAIUsage("ai-menu-ocr", modelUsed, startTime, "error");
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
      
      let dishes = [];
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) { dishes = JSON.parse(jsonMatch[0]); }
      } catch { console.error("Failed to parse OCR result:", content); }

      await trackAIUsage("ai-menu-ocr", modelUsed, startTime, "success");

      return new Response(JSON.stringify({ dishes }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate-image") {
      const modelUsed = "google/gemini-2.5-flash-image";
      const cat = (dishCategory || "").toLowerCase();
      
      const categoryStyles: Record<string, string> = {
        pizza: "shot from directly above (flat lay) on a rustic wooden pizza board, melted cheese pull visible, charred crust with leopard spots, scattered fresh basil leaves, olive oil drizzle glistening, wood-fired oven glow in background, rustic Italian pizzeria ambiance",
        pasta: "shot from 45-degree angle, pasta twirled on a fork hovering above the plate, creamy/rich sauce coating every strand, parmesan shavings falling mid-air, steam rising dramatically, elegant deep white ceramic bowl, soft trattoria lighting",
        antipasti: "elegant overhead shot on a marble slab, artfully arranged small portions, edible flowers and microgreens, drizzled aged balsamic reduction, extra virgin olive oil pools, Mediterranean appetizer styling, aperitivo ambiance",
        secondi: "dramatic 30-degree angle on a warm ceramic plate, perfectly seared protein with golden crust, jus pooling around, rosemary sprig garnish, charcoal grill marks visible, dimly-lit fine dining atmosphere with candle flicker",
        contorni: "bright natural daylight shot, vibrant garden-fresh colors, rustic terracotta bowl, herbs scattered, lemon wedge, farm-to-table aesthetic, clean Mediterranean styling",
        dolci: "macro close-up with extreme shallow depth of field, dusted powdered sugar particles floating, chocolate drip or caramel sauce flowing, dessert on a dark slate, warm pastry shop glow, indulgent and romantic mood",
        dessert: "macro close-up with extreme shallow depth of field, dusted powdered sugar particles floating, chocolate drip or caramel sauce flowing, dessert on a dark slate, warm pastry shop glow, indulgent and romantic mood",
        bevande: "condensation droplets on glass, backlit with golden hour light, garnish details (citrus peel, herbs), elegant bar counter reflection, atmospheric cocktail bar mood, crystal clear liquid",
        drink: "condensation droplets on glass, backlit with golden hour light, garnish details (citrus peel, herbs), elegant bar counter reflection, atmospheric cocktail bar mood, crystal clear liquid",
        vini: "wine glass at 30-degree angle with wine swirl visible, vineyard or cellar bokeh background, rich deep color of wine catching light, elegant sommelier presentation",
        insalate: "bright overhead shot, colorful fresh ingredients popping against white bowl, seeds and nuts scattered, light vinaigrette glistening, airy and healthy Mediterranean feel",
        zuppe: "steaming bowl shot from 45 degrees, ladle dripping, crusty bread on the side, warm rustic kitchen background, comfort food atmosphere, earthenware bowl",
        pesce: "elegant plating on elongated white plate, crispy skin texture visible, lemon and herb garnish, sea salt flakes, coastal restaurant with ocean view bokeh",
        carne: "dramatic low-angle shot, perfectly sliced to show pink interior, jus and reduction sauce artfully drizzled, charred edges, rosemary and garlic cloves, steakhouse mood lighting",
        fritti: "golden crispy texture in sharp focus, served in paper cone or rustic basket, sea salt crystals visible, lemon wedge, casual Italian street food energy",
      };

      let styleDirections = "shot from 45-degree angle on an elegant dark ceramic plate, restaurant table setting with soft warm candlelight, extremely shallow depth of field with creamy bokeh background, garnished beautifully, steam rising if hot dish";
      for (const [key, style] of Object.entries(categoryStyles)) {
        if (cat.includes(key)) { styleDirections = style; break; }
      }

      const prompt = `Generate a hyper-realistic, ultra professional food photography image of this Italian restaurant dish: "${dishDescription}". Photography direction: ${styleDirections}. Technical: vibrant natural colors, 8K quality, Michelin-star presentation, the food must look absolutely irresistible and mouthwatering. Ultra high resolution.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelUsed,
          messages: [{ role: "user", content: prompt }],
          modalities: ["image", "text"],
        }),
      });

      if (!response.ok) {
        await trackAIUsage("ai-menu-image", modelUsed, startTime, "error");
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

      if (imageUrl && imageUrl.startsWith("data:")) {
        const publicUrl = await uploadBase64Image(imageUrl);
        if (publicUrl) {
          await trackAIUsage("ai-menu-image", modelUsed, startTime, "success");
          return new Response(JSON.stringify({ imageUrl: publicUrl }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      await trackAIUsage("ai-menu-image", modelUsed, startTime, "success");

      return new Response(JSON.stringify({ imageUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── NEW: Generate food-porn photo from user's dish photo or description ───
    if (action === "generate-foodporn") {
      const modelUsed = "google/gemini-2.5-flash-image";
      
      const plateDesc = plateStyle || "elegant white ceramic plate";
      const dishDesc = dishName || dishDescription || "gourmet Italian dish";

      let messageContent: any[];

      if (userPhotoBase64) {
        // User uploaded a photo of their actual dish — enhance it to food-porn quality
        messageContent = [
          {
            type: "text",
            text: `Transform this photo of "${dishDesc}" into an ultra-professional, magazine-quality food photography shot. Keep the SAME dish and ingredients but dramatically improve the presentation: perfect plating on a ${plateDesc}, professional lighting with warm golden tones, shallow depth of field with creamy bokeh, steam rising naturally, garnished with fresh herbs and microgreens, drizzled with olive oil or sauce artistically. Make it look like a Michelin-star restaurant photo shoot. The food must look absolutely irresistible, mouthwatering, and hyper-realistic. 8K quality food-porn style.`
          },
          {
            type: "image_url",
            image_url: { url: userPhotoBase64 }
          }
        ];
      } else {
        // No photo — generate from scratch based on description
        messageContent = [
          {
            type: "text",
            text: `Generate an ultra-professional, magazine-quality food photography image of "${dishDesc}" plated on a ${plateDesc}. Style: hyper-realistic food-porn photography, Michelin-star presentation, professional studio lighting with warm golden tones, extremely shallow depth of field with creamy bokeh background, steam rising naturally, garnished with fresh herbs and microgreens, droplets of olive oil or sauce glistening. The food must look absolutely irresistible and mouthwatering. 8K quality, vibrant natural colors.`
          }
        ];
      }

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelUsed,
          messages: [{ role: "user", content: messageContent }],
          modalities: ["image", "text"],
        }),
      });

      if (!response.ok) {
        await trackAIUsage("ai-foodporn-generator", modelUsed, startTime, "error");
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
        throw new Error(`Food-porn generation failed: ${status}`);
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;

      if (imageUrl && imageUrl.startsWith("data:")) {
        const publicUrl = await uploadBase64Image(imageUrl);
        if (publicUrl) {
          await trackAIUsage("ai-foodporn-generator", modelUsed, startTime, "success");
          return new Response(JSON.stringify({ imageUrl: publicUrl }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      await trackAIUsage("ai-foodporn-generator", modelUsed, startTime, "success");
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
