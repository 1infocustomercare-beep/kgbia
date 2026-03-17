import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Sei Empire Assistant, l'assistente AI di Empire — la piattaforma all-in-one multi-settore per imprenditori italiani.

Empire supporta 7 settori verticali:
1. FOOD & RISTORAZIONE — Ristoranti, pizzerie, bar, pasticcerie, sushi bar
2. NCC & TRASPORTO — Noleggio con conducente, transfer, limousine service
3. BEAUTY & WELLNESS — Saloni, centri estetici, SPA, barbieri
4. HEALTHCARE — Studi medici, dentisti, fisioterapisti, cliniche
5. RETAIL & NEGOZI — Negozi, boutique, e-commerce locale
6. FITNESS & SPORT — Palestre, centri sportivi, personal trainer
7. HOSPITALITY — Hotel, B&B, agriturismi, resort

CAPACITÀ SPECIALE — COMANDI VOCALI/TESTO:
Puoi ricevere comandi per modificare il business dell'utente! Quando l'utente dice cose come:
- "Togli la lasagna dal menu"
- "Aumenta il prezzo della carbonara di 3 euro"
- "Disattiva il servizio delivery"
- "Conferma la prenotazione di Marco Rossi"
- "Imposta il tavolo 5 come libero"
Se il messaggio è un COMANDO di modifica (non una domanda), rispondi con:
**[COMMAND_MODE]** seguito dal comando originale, nient'altro.

Per tutto il resto (domande, supporto, consigli), rispondi normalmente.

Il tuo ruolo è aiutare gli imprenditori con:
- Supporto tecnico sulla piattaforma e sui moduli specifici del loro settore
- Consigli su come usare al meglio le funzionalità (AI Engine, Review Shield, Wallet Push, CRM, etc.)
- Risoluzione problemi comuni (login, pagamenti, configurazione)
- Suggerimenti di marketing e gestione aziendale
- Analisi e risposte basate sui DATI REALI dell'azienda
- ESECUZIONE COMANDI diretti per modificare menu, ordini, prenotazioni, etc.

Moduli comuni a tutti i settori:
- Dashboard adattiva con KPI di settore
- Staff & Payroll management
- CRM Leads & Clienti
- Finanza & Fatturazione B2B
- Social Media management
- HACCP (per settori alimentari)
- Inventario / Magazzino
- Impostazioni brand e personalizzazione

Moduli specifici per settore:
- FOOD: Menu digitale, QR code, ordini real-time, Kitchen View, tavoli, prenotazioni, allergie
- NCC: Flotta veicoli, tratte con tariffe fisse, prenotazioni corsa, autisti, destinazioni/tour
- BEAUTY: Appuntamenti, catalogo servizi, storico clienti, operatori
- HEALTHCARE: Agenda medica, pazienti, prestazioni, fatturazione sanitaria
- RETAIL: Catalogo prodotti, ordini, magazzino, POS
- FITNESS: Corsi, membri, trainer, abbonamenti
- HOSPITALITY: Camere, prenotazioni, ospiti, housekeeping

Regole:
- Rispondi SEMPRE in italiano
- Sii conciso ma esaustivo
- Usa un tono professionale ma amichevole
- Se non sai qualcosa, dillo onestamente
- Non inventare funzionalità che non esistono
- Per problemi tecnici complessi, suggerisci di contattare il supporto Empire
- Quando rispondi con dati aziendali, sii preciso e cita numeri reali
- MAI rivelare dati di altre aziende — rispondi SOLO con i dati dell'azienda corrente
- Adatta terminologia e consigli al settore dell'utente`;

async function fetchRestaurantContext(restaurantId: string): Promise<string> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return "⚠️ Dati ristorante non disponibili al momento.";
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("name, slug, city, address, tagline, table_orders_enabled, takeaway_enabled, delivery_enabled, is_active, primary_color")
      .eq("id", restaurantId)
      .single();

    if (!restaurant) {
      return "⚠️ Ristorante non trovato.";
    }

    const [menuRes, ordersRes, reservationsRes, activityRes, tablesRes] = await Promise.all([
      supabase.from("menu_items").select("name, category, price, is_active, is_popular").eq("restaurant_id", restaurantId).order("category").limit(100),
      supabase.from("orders").select("id, order_type, status, total, customer_name, created_at, table_number").eq("restaurant_id", restaurantId).order("created_at", { ascending: false }).limit(30),
      supabase.from("reservations").select("customer_name, guests, reservation_date, reservation_time, status").eq("restaurant_id", restaurantId).order("reservation_date", { ascending: false }).limit(20),
      supabase.from("customer_activity").select("customer_name, total_orders, total_spent, last_order_at, discount_sent").eq("restaurant_id", restaurantId).order("total_spent", { ascending: false }).limit(15),
      supabase.from("restaurant_tables").select("table_number, seats, status, label").eq("restaurant_id", restaurantId).order("table_number"),
    ]);

    const menu = menuRes.data || [];
    const orders = ordersRes.data || [];
    const reservations = reservationsRes.data || [];
    const customers = activityRes.data || [];
    const tables = tablesRes.data || [];

    const activeMenuItems = menu.filter(m => m.is_active).length;
    const categories = [...new Set(menu.map(m => m.category))];
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + Number(o.total), 0);
    const upcomingReservations = reservations.filter(r => r.status === "pending" || r.status === "confirmed").length;

    let context = `

--- DATI REALI DEL RISTORANTE "${restaurant.name}" ---
`;
    context += `Slug: ${restaurant.slug} | Città: ${restaurant.city || "N/D"} | Indirizzo: ${restaurant.address || "N/D"}
`;
    context += `Tagline: ${restaurant.tagline || "N/D"}
`;
    context += `Servizi attivi: Tavolo=${restaurant.table_orders_enabled ? "Sì" : "No"}, Asporto=${restaurant.takeaway_enabled ? "Sì" : "No"}, Delivery=${restaurant.delivery_enabled ? "Sì" : "No"}
`;
    context += `Stato: ${restaurant.is_active ? "Attivo" : "Inattivo"}

`;
    context += `📋 MENU: ${activeMenuItems} piatti attivi su ${menu.length} totali | Categorie: ${categories.join(", ")}
`;
    if (menu.length > 0) {
      const popularItems = menu.filter(m => m.is_popular);
      if (popularItems.length > 0) context += `⭐ Piatti popolari: ${popularItems.map(m => `${m.name} (€${m.price})`).join(", ")}
`;
      const avgPrice = menu.reduce((s, m) => s + Number(m.price), 0) / menu.length;
      context += `💰 Prezzo medio menu: €${avgPrice.toFixed(2)}
`;
    }
    context += `
🛒 ORDINI (ultimi 30): ${orders.length} totali | ${pendingOrders} in attesa | Fatturato: €${totalRevenue.toFixed(2)}
`;
    if (orders.length > 0) {
      const byType: Record<string, number> = {};
      orders.forEach(o => { byType[o.order_type] = (byType[o.order_type] || 0) + 1; });
      context += `Tipi: ${Object.entries(byType).map(([t, c]) => `${t}=${c}`).join(", ")}
`;
      context += `Ultimi ordini:
`;
      orders.slice(0, 5).forEach(o => {
        context += `  - ${o.created_at?.slice(0, 16)} | ${o.order_type} | €${o.total} | ${o.status} | ${o.customer_name || "Anonimo"}
`;
      });
    }
    context += `
📅 PRENOTAZIONI: ${upcomingReservations} in arrivo su ${reservations.length} totali
`;
    if (reservations.length > 0) {
      reservations.slice(0, 5).forEach(r => {
        context += `  - ${r.reservation_date} ${r.reservation_time} | ${r.customer_name} | ${r.guests} ospiti | ${r.status}
`;
      });
    }
    if (customers.length > 0) {
      context += `
👥 TOP CLIENTI:
`;
      customers.slice(0, 5).forEach(c => {
        context += `  - ${c.customer_name || "Anonimo"} | ${c.total_orders} ordini | €${Number(c.total_spent).toFixed(2)} spesi | Ultimo: ${c.last_order_at?.slice(0, 10)}
`;
      });
    }
    if (tables.length > 0) {
      const freeTables = tables.filter(t => t.status === "free").length;
      context += `

🪑 TAVOLI: ${tables.length} totali | ${freeTables} liberi
`;
    }
    context += `
--- FINE DATI RISTORANTE ---`;
    return context;
  } catch (e) {
    console.error("Error fetching restaurant context:", e);
    return "⚠️ Errore nel recupero dei dati del ristorante.";
  }
}

// ─── AI Usage Tracking Helper ───
async function trackAIUsage(agentName: string, modelUsed: string, startTime: number, status: string, restaurantId?: string) {
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
      restaurant_id: restaurantId || null,
    });
  } catch (e) {
    console.error("Failed to track AI usage:", e);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const modelUsed = "google/gemini-3-flash-preview";

  try {
    const { messages, restaurant_id } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let contextBlock = "";
    if (restaurant_id && typeof restaurant_id === "string") {
      contextBlock = await fetchRestaurantContext(restaurant_id);
    }

    const systemMessage = SYSTEM_PROMPT + contextBlock;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelUsed,
        messages: [
          { role: "system", content: systemMessage },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      await trackAIUsage("empire-assistant", modelUsed, startTime, "error", restaurant_id);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Troppo traffico, riprova tra poco." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Errore AI gateway" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Track successful call (fire and forget)
    trackAIUsage("empire-assistant", modelUsed, startTime, "success", restaurant_id);

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    await trackAIUsage("empire-assistant", modelUsed, startTime, "error");
    console.error("empire-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
