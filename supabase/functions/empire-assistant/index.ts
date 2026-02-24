import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Sei Empire Assistant, l'assistente AI di Empire — la piattaforma all-in-one per ristoratori italiani.

Il tuo ruolo è aiutare i ristoratori con:
- Supporto tecnico sulla piattaforma (menu, ordini, prenotazioni, cucina, QR code, Design Studio)
- Consigli su come usare al meglio le funzionalità (Panic Mode, Wallet Push, Review Shield, AI-Mary)
- Risoluzione problemi comuni (login, pagamenti, configurazione)
- Suggerimenti di marketing e gestione del ristorante
- Domande sul fisco e conformità (senza dare consulenza legale)

Regole:
- Rispondi SEMPRE in italiano
- Sii conciso ma esaustivo
- Usa un tono professionale ma amichevole
- Se non sai qualcosa, dillo onestamente
- Non inventare funzionalità che non esistono
- Per problemi tecnici complessi, suggerisci di contattare il supporto Empire

Funzionalità della piattaforma Empire:
1. Menu digitale con QR code per ogni tavolo
2. Gestione ordini in tempo reale (tavolo, asporto, delivery)
3. Kitchen View per la cucina
4. Panic Mode: modifica prezzi in tempo reale
5. Wallet Push: notifiche sconto ai clienti inattivi
6. Review Shield: filtra recensioni negative (≤3 stelle restano private)
7. AI-Mary: conformità fiscale automatica
8. Design Studio: personalizzazione brand, logo, colori
9. Mappa tavoli interattiva
10. Prenotazioni online
11. Chat privata con i clienti
12. Analytics e report profitto
13. Blacklist clienti problematici
14. PIN cucina per accesso sicuro
15. Multi-lingua per menu (traduzione AI)`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Troppo traffico, riprova tra poco." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Errore AI gateway" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("empire-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
