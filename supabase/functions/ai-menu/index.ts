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

const LANGUAGE_MAP: Record<string, string> = {
  en: "English", de: "German", fr: "French", es: "Spanish",
  zh: "Chinese (Simplified)", ja: "Japanese", ar: "Arabic",
  ru: "Russian", pt: "Portuguese", ko: "Korean",
};

const EU_ALLERGENS_LIST = [
  "gluten", "crustaceans", "eggs", "fish", "peanuts", "soy",
  "milk", "nuts", "celery", "mustard", "sesame", "sulphites", "lupin", "molluscs"
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const startTime = Date.now();

  try {
    const body = await req.json();
    const { action, imageBase64, dishDescription, dishCategory, dishName, userPhotoBase64, plateStyle, plateImageUrl, targetLanguages } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // ─── COMPLETE DISH: AI generates description, allergens, category, translations + photo all coherently ───
    if (action === "complete-dish") {
      const name = (dishName || "").trim();
      if (!name) throw new Error("Nome piatto obbligatorio");

      const langs = (targetLanguages || []).filter((l: string) => l !== "it");
      const langNames = langs.map((l: string) => LANGUAGE_MAP[l] || l);

      // Step 1: Generate coherent metadata via text model
      const textModel = "google/gemini-3-flash-preview";

      const metadataPrompt = `Sei un esperto chef e nutrizionista italiano. Per il piatto "${name}", genera TUTTI i seguenti campi in modo COERENTE e ACCURATO.

REGOLE CRITICHE:
- La descrizione DEVE corrispondere ESATTAMENTE agli ingredienti reali del piatto "${name}"
- Gli allergeni DEVONO essere SOLO quelli effettivamente presenti negli ingredienti del piatto
- NON inventare ingredienti che non esistono nel piatto tradizionale
- La categoria deve corrispondere al tipo di piatto (Antipasti, Primi, Secondi, Pizze, Dolci, Bevande, Contorni, etc.)
- Le traduzioni devono essere naturali, appetitose e coerenti con la descrizione italiana

Rispondi SOLO con un JSON valido (senza markdown):
{
  "description": "descrizione appetitosa in italiano (max 120 caratteri) che descriva ESATTAMENTE gli ingredienti reali",
  "category": "categoria corretta del piatto",
  "allergens": ["lista SOLO degli allergeni EU reali presenti: ${EU_ALLERGENS_LIST.join(", ")}"],
  "diet_tags": ["tag dietetici corretti: vegetarian, vegan, gluten_free, spicy - SOLO se vero"],
  "image_prompt_dish": "descrizione ULTRA dettagliata del piatto ESATTO per generare una foto realistica - includi colore, consistenza, guarnizione, ingredienti visibili, tipo di impiattamento"${langNames.length > 0 ? `,
  "name_translations": {${langNames.map(l => `"${langs[langNames.indexOf(l)]}": "traduzione nome in ${l}"`).join(", ")}},
  "description_translations": {${langNames.map(l => `"${langs[langNames.indexOf(l)]}": "traduzione descrizione in ${l}"`).join(", ")}}` : ""}
}`;

      const metaResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: textModel,
          messages: [
            { role: "system", content: "Sei un esperto chef italiano e nutrizionista certificato. Rispondi SOLO con JSON valido, senza markdown o commenti." },
            { role: "user", content: metadataPrompt },
          ],
        }),
      });

      if (!metaResponse.ok) {
        await trackAIUsage("ai-complete-dish-meta", textModel, startTime, "error");
        const status = metaResponse.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Troppi richieste. Riprova tra poco." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI gateway error: ${status}`);
      }

      const metaData = await metaResponse.json();
      const metaContent = metaData.choices?.[0]?.message?.content || "{}";
      
      let metadata: any = {};
      try {
        const jsonMatch = metaContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) metadata = JSON.parse(jsonMatch[0]);
      } catch { console.error("Failed to parse metadata:", metaContent); }

      await trackAIUsage("ai-complete-dish-meta", textModel, startTime, "success");

      // Step 2: Generate photo using the AI-generated image_prompt_dish for maximum coherence
      const imageModel = "google/gemini-2.5-flash-image";
      const imagePromptDish = metadata.image_prompt_dish || `${name} - piatto italiano gourmet`;
      
      const categoryStyles: Record<string, string> = {
        pizza: "shot from directly above (flat lay) on a rustic wooden pizza board, melted cheese pull visible, charred crust with leopard spots, scattered fresh basil leaves, olive oil drizzle glistening, wood-fired oven glow in background",
        pasta: "shot from 45-degree angle, pasta twirled on a fork hovering above the plate, creamy/rich sauce coating every strand, parmesan shavings falling mid-air, steam rising dramatically, elegant deep white ceramic bowl",
        primi: "shot from 45-degree angle, steam rising, rich sauce visible, parmesan shavings, elegant deep ceramic bowl, warm trattoria lighting",
        antipasti: "elegant overhead shot on a marble slab, artfully arranged small portions, edible flowers and microgreens, drizzled aged balsamic reduction",
        secondi: "dramatic 30-degree angle on a warm ceramic plate, perfectly seared protein with golden crust, jus pooling around, rosemary sprig garnish",
        contorni: "bright natural daylight shot, vibrant garden-fresh colors, rustic terracotta bowl, herbs scattered, farm-to-table aesthetic",
        dolci: "macro close-up with extreme shallow depth of field, dusted powdered sugar particles floating, chocolate drip or caramel sauce flowing, dessert on a dark slate",
        dessert: "macro close-up with extreme shallow depth of field, dusted powdered sugar particles floating, dessert on dark slate, warm pastry shop glow",
        bevande: "condensation droplets on glass, backlit with golden hour light, garnish details, elegant bar counter reflection",
        pizze: "shot from directly above on a rustic wooden pizza board, melted cheese pull visible, charred crust, scattered fresh basil, olive oil drizzle",
        insalate: "bright overhead shot, colorful fresh ingredients popping against white bowl, light vinaigrette glistening",
        zuppe: "steaming bowl shot from 45 degrees, ladle dripping, crusty bread on the side, warm rustic kitchen background",
        pesce: "elegant plating on elongated white plate, crispy skin texture visible, lemon and herb garnish, sea salt flakes",
        carne: "dramatic low-angle shot, perfectly sliced to show pink interior, jus and reduction sauce, charred edges, rosemary",
        fritti: "golden crispy texture in sharp focus, served in paper cone or rustic basket, sea salt crystals visible, lemon wedge",
      };

      const cat = (metadata.category || dishCategory || "").toLowerCase();
      let styleDir = "shot from 45-degree angle on an elegant ceramic plate, restaurant table setting with soft warm candlelight, extremely shallow depth of field, steam rising, garnished beautifully";
      for (const [key, style] of Object.entries(categoryStyles)) {
        if (cat.includes(key)) { styleDir = style; break; }
      }

      let imageMessages: any[];
      if (plateImageUrl) {
        imageMessages = [{
          role: "user",
          content: [
            { type: "text", text: `Generate a hyper-realistic food photography image of EXACTLY this dish: "${imagePromptDish}". The food MUST be served on EXACTLY this plate shown in the reference image — same color, shape, texture. Photography: ${styleDir}. 8K quality, Michelin-star, vibrant natural colors, mouthwatering.` },
            { type: "image_url", image_url: { url: plateImageUrl } }
          ]
        }];
      } else if (userPhotoBase64) {
        imageMessages = [{
          role: "user",
          content: [
            { type: "text", text: `Transform this photo into ultra-professional food photography of "${imagePromptDish}". Keep the SAME dish and ingredients but improve: perfect plating, professional lighting, shallow depth of field, steam, garnish. ${styleDir}. 8K Michelin-star quality.` },
            { type: "image_url", image_url: { url: userPhotoBase64 } }
          ]
        }];
      } else {
        imageMessages = [{
          role: "user",
          content: `Generate a hyper-realistic, ultra professional food photography image of EXACTLY this Italian dish: "${imagePromptDish}". Photography: ${styleDir}. Technical: vibrant natural colors, 8K quality, Michelin-star presentation, irresistible and mouthwatering. The dish must look EXACTLY as described — every ingredient, color, and texture must match.`
        }];
      }

      const imgResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: imageModel,
          messages: imageMessages,
          modalities: ["image", "text"],
        }),
      });

      let imageUrl: string | null = null;
      if (imgResponse.ok) {
        const imgData = await imgResponse.json();
        const rawUrl = imgData.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;
        if (rawUrl && rawUrl.startsWith("data:")) {
          imageUrl = await uploadBase64Image(rawUrl);
        } else {
          imageUrl = rawUrl;
        }
        await trackAIUsage("ai-complete-dish-image", imageModel, startTime, "success");
      } else {
        console.error("Image generation failed:", imgResponse.status);
        await trackAIUsage("ai-complete-dish-image", imageModel, startTime, "error");
      }

      // Return coherent result
      return new Response(JSON.stringify({
        description: metadata.description || "",
        category: metadata.category || "Altro",
        allergens: (metadata.allergens || []).filter((a: string) => EU_ALLERGENS_LIST.includes(a)),
        diet_tags: metadata.diet_tags || [],
        imageUrl,
        name_translations: metadata.name_translations || {},
        description_translations: metadata.description_translations || {},
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── OCR ───
    if (action === "ocr") {
      const modelUsed = "google/gemini-2.5-flash";
      const messages: any[] = [
        {
          role: "system",
          content: `Sei un esperto OCR per menu di ristoranti italiani. Estrai TUTTI i piatti dal menu nell'immagine. Per ogni piatto analizza gli ingredienti e determina gli allergeni EU reali.
          
Allergeni EU validi: ${EU_ALLERGENS_LIST.join(", ")}

Rispondi SOLO con un JSON array.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Estrai i piatti da questo menu. Rispondi con un JSON array di oggetti con: name, description (appetitosa e accurata), price (numero), category, allergens (array di allergeni EU reali basati sugli ingredienti). IMPORTANTE: gli allergeni devono corrispondere ESATTAMENTE agli ingredienti del piatto.` },
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
        if (status === 429) return new Response(JSON.stringify({ error: "Troppi richieste. Riprova tra poco." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI gateway error: ${status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "[]";
      
      let dishes = [];
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) { dishes = JSON.parse(jsonMatch[0]); }
      } catch { console.error("Failed to parse OCR result:", content); }

      // Validate allergens
      dishes = dishes.map((d: any) => ({
        ...d,
        allergens: (d.allergens || []).filter((a: string) => EU_ALLERGENS_LIST.includes(a)),
      }));

      await trackAIUsage("ai-menu-ocr", modelUsed, startTime, "success");

      return new Response(JSON.stringify({ dishes }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── GENERATE IMAGE (standalone) ───
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
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limit. Riprova tra poco." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`Image generation failed: ${status}`);
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;

      if (imageUrl && imageUrl.startsWith("data:")) {
        const publicUrl = await uploadBase64Image(imageUrl);
        if (publicUrl) {
          await trackAIUsage("ai-menu-image", modelUsed, startTime, "success");
          return new Response(JSON.stringify({ imageUrl: publicUrl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }

      await trackAIUsage("ai-menu-image", modelUsed, startTime, "success");
      return new Response(JSON.stringify({ imageUrl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ─── GENERATE FOOD-PORN (standalone) ───
    if (action === "generate-foodporn") {
      const modelUsed = "google/gemini-2.5-flash-image";
      
      const plateDesc = plateStyle || "elegant white ceramic plate";
      const dishDesc = dishName || dishDescription || "gourmet Italian dish";

      let messageContent: any[];

      if (userPhotoBase64) {
        messageContent = [
          { type: "text", text: `Transform this photo of "${dishDesc}" into an ultra-professional, magazine-quality food photography shot. Keep the SAME dish and ingredients but dramatically improve the presentation: perfect plating on a ${plateDesc}, professional lighting with warm golden tones, shallow depth of field with creamy bokeh, steam rising naturally, garnished with fresh herbs and microgreens, drizzled with olive oil or sauce artistically. Make it look like a Michelin-star restaurant photo shoot. The food must look absolutely irresistible, mouthwatering, and hyper-realistic. 8K quality food-porn style.` },
          { type: "image_url", image_url: { url: userPhotoBase64 } }
        ];
      } else if (plateImageUrl) {
        messageContent = [
          { type: "text", text: `Generate an ultra-professional, magazine-quality food photography image of "${dishDesc}" served on EXACTLY this plate shown in the reference image. The plate, its color, shape, texture and style must be IDENTICAL to the reference. Place the "${dishDesc}" beautifully plated on it with Michelin-star presentation. Professional studio lighting with warm golden tones, extremely shallow depth of field with creamy bokeh background, steam rising naturally, garnished with fresh herbs and microgreens, droplets of olive oil or sauce glistening. The food must look absolutely irresistible and mouthwatering. 8K quality, vibrant natural colors, hyper-realistic food-porn photography.` },
          { type: "image_url", image_url: { url: plateImageUrl } }
        ];
      } else {
        messageContent = [
          { type: "text", text: `Generate an ultra-professional, magazine-quality food photography image of "${dishDesc}" plated on a ${plateDesc}. Style: hyper-realistic food-porn photography, Michelin-star presentation, professional studio lighting with warm golden tones, extremely shallow depth of field with creamy bokeh background, steam rising naturally, garnished with fresh herbs and microgreens, droplets of olive oil or sauce glistening. The food must look absolutely irresistible and mouthwatering. 8K quality, vibrant natural colors.` }
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
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limit. Riprova tra poco." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`Food-porn generation failed: ${status}`);
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;

      if (imageUrl && imageUrl.startsWith("data:")) {
        const publicUrl = await uploadBase64Image(imageUrl);
        if (publicUrl) {
          await trackAIUsage("ai-foodporn-generator", modelUsed, startTime, "success");
          return new Response(JSON.stringify({ imageUrl: publicUrl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }

      await trackAIUsage("ai-foodporn-generator", modelUsed, startTime, "success");
      return new Response(JSON.stringify({ imageUrl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
