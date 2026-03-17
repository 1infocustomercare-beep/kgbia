import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Sei Empire Assistant, l'assistente AI di Empire — la piattaforma all-in-one multi-settore per imprenditori italiani.

Empire supporta 25+ settori verticali:
1. FOOD & RISTORAZIONE — Ristoranti, pizzerie, bar, pasticcerie
2. NCC & TRASPORTO — Noleggio con conducente, transfer, limousine
3. BEAUTY & WELLNESS — Saloni, centri estetici, SPA, barbieri
4. HEALTHCARE — Studi medici, dentisti, fisioterapisti, cliniche
5. RETAIL & NEGOZI — Negozi, boutique, e-commerce locale
6. FITNESS & SPORT — Palestre, centri sportivi, personal trainer
7. HOSPITALITY — Hotel, B&B, resort
8. BEACH — Stabilimenti balneari, lidi
9. AGRITURISMO — Agriturismi, fattorie didattiche
10. SERVIZI TECNICI — Idraulico, Elettricista, Edilizia, Giardinaggio, Pulizie, Garage, Veterinario, Tatuatore
11. SERVIZI PROFESSIONALI — Legale, Contabilità, Fotografia, Educazione, Asilo
12. EVENTI & LOGISTICA — Organizzazione eventi, Logistica e spedizioni

CAPACITÀ SPECIALE — COMANDI VOCALI/TESTO:
Puoi ricevere comandi per modificare il business dell'utente! Quando l'utente dice cose come:
- "Togli la lasagna dal menu" / "Disattiva la Mercedes"
- "Aumenta il prezzo della carbonara di 3 euro" / "Aggiorna tariffa transfer a 120€"
- "Conferma la prenotazione di Marco" / "Conferma appuntamento di Laura"
- "Aggiungi intervento per Rossi" / "Aggiungi lead Mario Bianchi"
- "Imposta il tavolo 5 come libero" / "Metti autista Paolo in pausa"
Se il messaggio è un COMANDO di modifica (non una domanda), rispondi con:
**[COMMAND_MODE]** seguito dal comando originale, nient'altro.

Per tutto il resto (domande, supporto, consigli), rispondi normalmente.

Il tuo ruolo è aiutare gli imprenditori con:
- Supporto tecnico sulla piattaforma e sui moduli specifici del loro settore
- Consigli su come usare al meglio le funzionalità AI
- Risoluzione problemi comuni
- Suggerimenti di marketing e gestione aziendale
- Analisi e risposte basate sui DATI REALI dell'azienda
- ESECUZIONE COMANDI diretti per modificare dati aziendali

Moduli comuni a tutti i settori:
- Dashboard adattiva con KPI, Staff & Payroll, CRM Leads & Clienti
- Finanza & Fatturazione, Social Media, Inventario, Impostazioni brand

Moduli specifici per settore:
- FOOD: Menu digitale, QR, ordini real-time, Kitchen View, tavoli, prenotazioni
- NCC: Flotta veicoli, tratte/tariffe, prenotazioni, autisti, cross-sell
- BEAUTY/HEALTHCARE: Appuntamenti, catalogo servizi, storico clienti
- RETAIL: Catalogo prodotti, ordini, magazzino
- FITNESS: Corsi, abbonamenti, trainer
- HOSPITALITY: Camere, prenotazioni ospiti
- BEACH: Ombrelloni, abbonamenti stagionali
- TRADES: Interventi, preventivi, programmazione lavori

Regole:
- Rispondi SEMPRE in italiano
- Sii conciso ma esaustivo
- Tono professionale ma amichevole
- Non inventare funzionalità inesistenti
- MAI rivelare dati di altre aziende — SOLO dati dell'azienda corrente
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

async function fetchCompanyContext(companyId: string): Promise<string> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return "";

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const { data: company } = await supabase
      .from("companies")
      .select("name, industry, city, address, tagline, phone, email, is_active, slug")
      .eq("id", companyId)
      .single();

    if (!company) return "";

    const [clientsRes, leadsRes, appointmentsRes, interventionsRes, staffRes] = await Promise.all([
      supabase.from("crm_clients").select("first_name, last_name, total_spent, phone").eq("company_id", companyId).order("total_spent", { ascending: false }).limit(10),
      supabase.from("leads").select("name, status, value, source, created_at").eq("company_id", companyId).order("created_at", { ascending: false }).limit(15),
      supabase.from("appointments").select("client_name, service_name, scheduled_at, status, price").eq("company_id", companyId).order("scheduled_at", { ascending: false }).limit(15),
      supabase.from("interventions").select("client_name, intervention_type, status, final_price, scheduled_at").eq("company_id", companyId).order("created_at", { ascending: false }).limit(15),
      supabase.from("staff").select("name, role, is_active").eq("company_id", companyId).limit(20),
    ]);

    const clients = clientsRes.data || [];
    const leads = leadsRes.data || [];
    const appointments = appointmentsRes.data || [];
    const interventions = interventionsRes.data || [];
    const staff = staffRes.data || [];

    let ctx = `\n\n--- DATI REALI DI "${company.name}" (${company.industry}) ---\n`;
    ctx += `Città: ${company.city || "N/D"} | Indirizzo: ${company.address || "N/D"} | Tel: ${company.phone || "N/D"}\n`;
    ctx += `Stato: ${company.is_active ? "Attivo" : "Inattivo"}\n\n`;

    if (staff.length) {
      const activeStaff = staff.filter(s => s.is_active !== false).length;
      ctx += `👥 STAFF: ${activeStaff} attivi su ${staff.length}\n`;
    }

    if (clients.length) {
      ctx += `\n📋 CLIENTI (top ${clients.length}):\n`;
      clients.slice(0, 5).forEach(c => {
        ctx += `  - ${c.first_name} ${c.last_name || ""} | €${Number(c.total_spent || 0).toFixed(2)}\n`;
      });
    }

    if (leads.length) {
      const newLeads = leads.filter(l => l.status === "new").length;
      ctx += `\n🎯 LEADS: ${leads.length} totali | ${newLeads} nuovi\n`;
      leads.slice(0, 5).forEach(l => {
        ctx += `  - ${l.name} | ${l.status} | €${l.value} | ${l.source || "N/D"}\n`;
      });
    }

    if (appointments.length) {
      const pending = appointments.filter(a => a.status === "pending" || a.status === "confirmed").length;
      ctx += `\n📅 APPUNTAMENTI: ${pending} in programma su ${appointments.length}\n`;
      appointments.slice(0, 5).forEach(a => {
        ctx += `  - ${a.scheduled_at?.slice(0, 16)} | ${a.client_name} | ${a.service_name || "N/D"} | ${a.status}\n`;
      });
    }

    if (interventions.length) {
      const active = interventions.filter(i => i.status === "in_corso" || i.status === "programmato").length;
      ctx += `\n🔧 INTERVENTI: ${active} attivi su ${interventions.length}\n`;
      interventions.slice(0, 5).forEach(i => {
        ctx += `  - ${i.client_name} | ${i.intervention_type} | ${i.status} | €${i.final_price || "N/D"}\n`;
      });
    }

    ctx += `\n--- FINE DATI AZIENDA ---`;
    return ctx;
  } catch (e) {
    console.error("Error fetching company context:", e);
    return "";
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
    const { messages, restaurant_id, tenant_id } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // ── Quick command detection: check last user message ──
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
    const userText = lastUserMsg?.content?.trim() || "";

    // First, do a non-streaming AI call to check if it's a command
    let contextBlock = "";
    if (restaurant_id && typeof restaurant_id === "string") {
      contextBlock = await fetchRestaurantContext(restaurant_id);
    }

    const systemMessage = SYSTEM_PROMPT + contextBlock;

    // Check for command intent with a fast non-streaming call
    const detectResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemMessage },
          ...messages,
        ],
        max_tokens: 200,
        stream: false,
      }),
    });

    if (detectResp.ok) {
      const detectData = await detectResp.json();
      const detectContent = detectData.choices?.[0]?.message?.content?.trim() || "";

      if (detectContent.includes("[COMMAND_MODE]")) {
        // Extract the command and route to Command Agent
        const commandText = detectContent.replace(/\*?\*?\[COMMAND_MODE\]\*?\*?/g, "").trim() || userText;
        const effectiveTenantId = tenant_id || null;

        if (effectiveTenantId) {
          const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
          const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

          const cmdResp = await fetch(`${supabaseUrl}/functions/v1/ai-command-agent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${serviceKey}`,
            },
            body: JSON.stringify({
              tenant_id: effectiveTenantId,
              command: commandText,
              source: "chat",
            }),
          });

          const cmdData = await cmdResp.json();

          // Format as SSE stream for consistent UI
          const resultMessage = cmdData.message_it || (cmdData.success ? "✅ Comando eseguito!" : "❌ Errore nell'esecuzione del comando.");
          const ssePayload = `data: ${JSON.stringify({
            choices: [{ delta: { content: resultMessage } }],
          })}\n\ndata: [DONE]\n\n`;

          trackAIUsage("empire-assistant-command", modelUsed, startTime, cmdData.success ? "success" : "error", restaurant_id);

          return new Response(ssePayload, {
            headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
          });
        }
      }
    }

    // ── Normal chat flow (streaming) ──
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
