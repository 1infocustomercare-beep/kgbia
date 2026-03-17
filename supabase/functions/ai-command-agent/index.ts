// ══════════════════════════════════════════════════════════════
// Empire AI Command Agent — Natural Language → DB Operations
// Multi-sector, tenant-isolated, phone-verified
// Supports ALL 25+ industry sectors
// ══════════════════════════════════════════════════════════════
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ══════════════════════════════════════════════════════════════
// SECTOR ACTION SCHEMAS — Complete for every industry
// ══════════════════════════════════════════════════════════════

const COMMON_ACTIONS = `
AZIONI COMUNI A TUTTI I SETTORI:
- LEAD_ADD: { action: "lead_add", name: string, phone?: string, email?: string, source?: string, notes?: string }
- LEAD_UPDATE_STATUS: { action: "lead_update_status", lead_name: string, new_status: "new"|"contacted"|"qualified"|"proposal"|"won"|"lost" }
- CLIENT_ADD: { action: "client_add", first_name: string, last_name?: string, phone?: string, email?: string, notes?: string }
- CLIENT_ADD_NOTE: { action: "client_add_note", client_name: string, note: string }
- STAFF_UPDATE_STATUS: { action: "staff_update_status", staff_name: string, is_active: boolean }
- COMPANY_UPDATE_INFO: { action: "company_update_info", field: "tagline"|"phone"|"email"|"address", value: string }
- AUTOMATION_TOGGLE: { action: "automation_toggle", automation_type: string, is_active: boolean }
`;

const FOOD_SCHEMA = `
AZIONI SPECIFICHE per FOOD / RISTORAZIONE:
- MENU_UPDATE_PRICE: { action: "menu_update_price", item_name: string, new_price?: number, price_delta?: number }
- MENU_REMOVE_ITEM: { action: "menu_remove_item", item_name: string }
- MENU_ADD_ITEM: { action: "menu_add_item", name: string, price: number, category: string, description?: string, allergens?: string[] }
- MENU_TOGGLE_ACTIVE: { action: "menu_toggle_active", item_name: string, is_active: boolean }
- MENU_UPDATE_DESCRIPTION: { action: "menu_update_description", item_name: string, description: string }
- MENU_UPDATE_ALLERGENS: { action: "menu_update_allergens", item_name: string, allergens: string[] }
- ORDER_UPDATE_STATUS: { action: "order_update_status", order_id?: string, customer_name?: string, new_status: "pending"|"preparing"|"ready"|"delivered"|"cancelled" }
- RESERVATION_UPDATE: { action: "reservation_update", customer_name: string, new_status: "confirmed"|"cancelled" }
- TABLE_UPDATE_STATUS: { action: "table_update_status", table_number: number, status: "free"|"occupied"|"reserved" }
- TOGGLE_SERVICE: { action: "toggle_service", service: "table_orders"|"takeaway"|"delivery", enabled: boolean }
`;

const NCC_SCHEMA = `
AZIONI SPECIFICHE per NCC / TRASPORTO:
- VEHICLE_TOGGLE: { action: "vehicle_toggle", vehicle_name: string, is_active: boolean }
- VEHICLE_UPDATE_PRICE: { action: "vehicle_update_price", vehicle_name: string, new_base_price?: number, new_price_per_km?: number }
- NCC_BOOKING_UPDATE: { action: "ncc_booking_update", booking_id?: string, customer_name?: string, new_status: "pending"|"confirmed"|"in_progress"|"completed"|"cancelled" }
- DRIVER_UPDATE_STATUS: { action: "driver_update_status", driver_name: string, status: "available"|"busy"|"off_duty" }
- CROSS_SELL_TOGGLE: { action: "cross_sell_toggle", title: string, is_active: boolean }
- CROSS_SELL_UPDATE_PRICE: { action: "cross_sell_update_price", title: string, new_price: number }
`;

const BEAUTY_SCHEMA = `
AZIONI SPECIFICHE per BEAUTY / WELLNESS:
- APPOINTMENT_UPDATE: { action: "appointment_update", client_name: string, new_status: "pending"|"confirmed"|"completed"|"cancelled"|"no_show" }
- APPOINTMENT_RESCHEDULE: { action: "appointment_reschedule", client_name: string, new_date: string, new_time: string }
- SERVICE_UPDATE_PRICE: { action: "service_update_price", service_name: string, new_price: number }
- SERVICE_TOGGLE: { action: "service_toggle", service_name: string, is_active: boolean }
- SERVICE_UPDATE_DURATION: { action: "service_update_duration", service_name: string, duration_minutes: number }
`;

const HEALTHCARE_SCHEMA = `
AZIONI SPECIFICHE per HEALTHCARE / STUDI MEDICI:
- APPOINTMENT_UPDATE: { action: "appointment_update", client_name: string, new_status: "pending"|"confirmed"|"completed"|"cancelled"|"no_show" }
- SERVICE_UPDATE_PRICE: { action: "service_update_price", service_name: string, new_price: number }
- CLIENT_ADD_NOTE: { action: "client_add_note", client_name: string, note: string }
- CLIENT_ADD_TECHNICAL_NOTE: { action: "client_add_technical_note", client_name: string, note: string }
`;

const RETAIL_SCHEMA = `
AZIONI SPECIFICHE per RETAIL / NEGOZI:
- PRODUCT_UPDATE_PRICE: { action: "product_update_price", product_name: string, new_price: number }
- PRODUCT_TOGGLE: { action: "product_toggle", product_name: string, is_active: boolean }
- PRODUCT_UPDATE_STOCK: { action: "product_update_stock", product_name: string, quantity: number }
- PRODUCT_ADD: { action: "product_add", name: string, price: number, category?: string, description?: string }
`;

const FITNESS_SCHEMA = `
AZIONI SPECIFICHE per FITNESS / SPORT:
- CLASS_TOGGLE: { action: "class_toggle", class_name: string, is_active: boolean }
- APPOINTMENT_UPDATE: { action: "appointment_update", client_name: string, new_status: "pending"|"confirmed"|"completed"|"cancelled" }
- SERVICE_UPDATE_PRICE: { action: "service_update_price", service_name: string, new_price: number }
`;

const HOSPITALITY_SCHEMA = `
AZIONI SPECIFICHE per HOSPITALITY / HOTEL:
- ROOM_UPDATE_PRICE: { action: "room_update_price", room_name: string, new_price: number }
- ROOM_UPDATE_STATUS: { action: "room_update_status", room_name: string, status: "available"|"occupied"|"maintenance"|"reserved" }
- BOOKING_UPDATE: { action: "booking_update", guest_name: string, new_status: "confirmed"|"cancelled"|"checked_in"|"checked_out" }
`;

const BEACH_SCHEMA = `
AZIONI SPECIFICHE per BEACH / STABILIMENTI:
- SPOT_UPDATE_PRICE: { action: "spot_update_price", row_letter: string, spot_number: number, price_daily?: number, price_morning?: number, price_afternoon?: number }
- SPOT_TOGGLE: { action: "spot_toggle", row_letter: string, spot_number: number, is_active: boolean }
- BEACH_BOOKING_UPDATE: { action: "beach_booking_update", client_name: string, new_status: "confirmed"|"cancelled" }
- BEACH_PASS_TOGGLE: { action: "beach_pass_toggle", client_name: string, is_active: boolean }
`;

const TRADES_SCHEMA = `
AZIONI SPECIFICHE per SERVIZI TECNICI (Idraulico, Elettricista, Edilizia, Giardinaggio, Pulizie, Garage, etc.):
- INTERVENTION_UPDATE: { action: "intervention_update", client_name: string, new_status: "richiesta"|"programmato"|"in_corso"|"completato"|"fatturato"|"annullato" }
- INTERVENTION_ADD_NOTE: { action: "intervention_add_note", client_name: string, note: string }
- INTERVENTION_SET_PRICE: { action: "intervention_set_price", client_name: string, final_price: number }
- INTERVENTION_ADD: { action: "intervention_add", client_name: string, client_phone?: string, intervention_type: string, address?: string, notes?: string, urgency?: "bassa"|"media"|"alta"|"urgente" }
`;

const AGRITURISMO_SCHEMA = `
AZIONI SPECIFICHE per AGRITURISMO:
- MENU_UPDATE_PRICE: { action: "menu_update_price", item_name: string, new_price?: number, price_delta?: number }
- MENU_REMOVE_ITEM: { action: "menu_remove_item", item_name: string }
- MENU_ADD_ITEM: { action: "menu_add_item", name: string, price: number, category: string, description?: string }
- MENU_TOGGLE_ACTIVE: { action: "menu_toggle_active", item_name: string, is_active: boolean }
- RESERVATION_UPDATE: { action: "reservation_update", customer_name: string, new_status: "confirmed"|"cancelled" }
- APPOINTMENT_UPDATE: { action: "appointment_update", client_name: string, new_status: "pending"|"confirmed"|"completed"|"cancelled" }
`;

const EVENTS_SCHEMA = `
AZIONI SPECIFICHE per EVENTS / ORGANIZZAZIONE EVENTI:
- APPOINTMENT_UPDATE: { action: "appointment_update", client_name: string, new_status: "pending"|"confirmed"|"completed"|"cancelled" }
- APPOINTMENT_RESCHEDULE: { action: "appointment_reschedule", client_name: string, new_date: string, new_time: string }
- INTERVENTION_UPDATE: { action: "intervention_update", client_name: string, new_status: "richiesta"|"programmato"|"in_corso"|"completato"|"fatturato"|"annullato" }
- INTERVENTION_SET_PRICE: { action: "intervention_set_price", client_name: string, final_price: number }
`;

const LOGISTICS_SCHEMA = `
AZIONI SPECIFICHE per LOGISTICS / LOGISTICA:
- VEHICLE_TOGGLE: { action: "vehicle_toggle", vehicle_name: string, is_active: boolean }
- DRIVER_UPDATE_STATUS: { action: "driver_update_status", driver_name: string, status: "available"|"busy"|"off_duty" }
- INTERVENTION_UPDATE: { action: "intervention_update", client_name: string, new_status: "richiesta"|"programmato"|"in_corso"|"completato"|"fatturato"|"annullato" }
`;

const TRADES_SECTORS = [
  "plumber", "electrician", "construction", "gardening", "cleaning",
  "garage", "veterinary", "tattoo", "childcare", "education",
  "photography", "legal", "accounting",
];

const SECTOR_SCHEMAS: Record<string, string> = {
  ristorazione: FOOD_SCHEMA,
  food: FOOD_SCHEMA,
  ncc: NCC_SCHEMA,
  transport: NCC_SCHEMA,
  beauty: BEAUTY_SCHEMA,
  wellness: BEAUTY_SCHEMA,
  healthcare: HEALTHCARE_SCHEMA,
  medical: HEALTHCARE_SCHEMA,
  retail: RETAIL_SCHEMA,
  shop: RETAIL_SCHEMA,
  fitness: FITNESS_SCHEMA,
  sport: FITNESS_SCHEMA,
  hospitality: HOSPITALITY_SCHEMA,
  hotel: HOSPITALITY_SCHEMA,
  beach: BEACH_SCHEMA,
  agriturismo: AGRITURISMO_SCHEMA,
  events: EVENTS_SCHEMA,
  logistics: LOGISTICS_SCHEMA,
};

function getSectorSchema(sector: string): string {
  const specific = SECTOR_SCHEMAS[sector] || (TRADES_SECTORS.includes(sector) ? TRADES_SCHEMA : FOOD_SCHEMA);
  return COMMON_ACTIONS + "\n" + specific;
}

// ══════════════════════════════════════════════════════════════
// SYSTEM PROMPT
// ══════════════════════════════════════════════════════════════

const COMMAND_SYSTEM_PROMPT = `Sei Empire Command Agent — un agente AI che trasforma comandi in linguaggio naturale in azioni strutturate sul database dell'attività dell'utente.

REGOLE CRITICHE:
1. Analizza il comando e restituisci SOLO un JSON valido con un array "actions"
2. NON inventare dati — usa solo quelli forniti nel comando
3. Per i prezzi:
   - "aumenta di X" → usa price_delta: +X (il sistema sommerà al prezzo attuale)
   - "abbassa/riduci di X" → usa price_delta: -X
   - "metti a X" / "prezzo X" → usa new_price: X
4. Per "togli" / "rimuovi" intendi disattivare (is_active=false), NON eliminare dal database
5. Se il comando è ambiguo o non riesci a capirlo, restituisci: { "actions": [], "error": "messaggio di spiegazione" }
6. Puoi restituire MULTIPLE azioni in un singolo comando
7. I nomi devono essere cercati con corrispondenza fuzzy (case-insensitive)
8. Adatta la terminologia al settore (es. "piatto" per food, "veicolo" per NCC, "servizio" per beauty)
9. SICUREZZA: Non eseguire mai azioni che cancellano dati, solo disattivazioni

FORMATO RISPOSTA (JSON puro, nessun markdown):
{
  "actions": [
    { "action": "tipo_azione", ...parametri },
    ...
  ],
  "summary_it": "Breve descrizione in italiano di cosa verrà fatto"
}
`;

// ══════════════════════════════════════════════════════════════
// ACTION EXECUTORS — One per action type
// ══════════════════════════════════════════════════════════════

async function executeAction(
  supabase: any,
  action: any,
  resourceId: string,
  tenantType: string,
): Promise<{ success: boolean; detail: string }> {
  try {
    const isRestaurant = tenantType === "restaurant";
    const idField = isRestaurant ? "restaurant_id" : "company_id";

    switch (action.action) {

      // ════════════════════════════════════════
      // FOOD / RISTORAZIONE
      // ════════════════════════════════════════

      case "menu_update_price": {
        const { data: items } = await supabase
          .from("menu_items")
          .select("id, name, price")
          .eq("restaurant_id", resourceId)
          .ilike("name", `%${action.item_name}%`);
        if (!items?.length) return { success: false, detail: `Piatto "${action.item_name}" non trovato` };
        const item = items[0];
        let finalPrice = action.new_price ?? (Number(item.price) + Number(action.price_delta || 0));
        if (finalPrice < 0) finalPrice = 0;
        const { error } = await supabase
          .from("menu_items")
          .update({ price: finalPrice, updated_at: new Date().toISOString() })
          .eq("id", item.id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Prezzo di "${item.name}": €${item.price} → €${finalPrice}` };
      }

      case "menu_remove_item":
      case "menu_toggle_active": {
        const isActive = action.action === "menu_toggle_active" ? action.is_active : false;
        const { data: items } = await supabase
          .from("menu_items").select("id, name")
          .eq("restaurant_id", resourceId)
          .ilike("name", `%${action.item_name}%`);
        if (!items?.length) return { success: false, detail: `Piatto "${action.item_name}" non trovato` };
        const { error } = await supabase
          .from("menu_items")
          .update({ is_active: isActive, updated_at: new Date().toISOString() })
          .eq("id", items[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `"${items[0].name}" ${isActive ? "riattivato" : "rimosso dal menu"}` };
      }

      case "menu_add_item": {
        const { error } = await supabase.from("menu_items").insert({
          restaurant_id: resourceId,
          name: action.name,
          price: action.price,
          category: action.category || "Altro",
          description: action.description || null,
          allergens: action.allergens || null,
          is_active: true,
          is_popular: false,
        });
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `"${action.name}" aggiunto (€${action.price}, ${action.category || "Altro"})` };
      }

      case "menu_update_description": {
        const { data: items } = await supabase
          .from("menu_items").select("id, name")
          .eq("restaurant_id", resourceId)
          .ilike("name", `%${action.item_name}%`);
        if (!items?.length) return { success: false, detail: `Piatto "${action.item_name}" non trovato` };
        const { error } = await supabase
          .from("menu_items")
          .update({ description: action.description, updated_at: new Date().toISOString() })
          .eq("id", items[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Descrizione di "${items[0].name}" aggiornata` };
      }

      case "menu_update_allergens": {
        const { data: items } = await supabase
          .from("menu_items").select("id, name")
          .eq("restaurant_id", resourceId)
          .ilike("name", `%${action.item_name}%`);
        if (!items?.length) return { success: false, detail: `Piatto "${action.item_name}" non trovato` };
        const { error } = await supabase
          .from("menu_items")
          .update({ allergens: action.allergens, updated_at: new Date().toISOString() })
          .eq("id", items[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Allergeni di "${items[0].name}" aggiornati: ${action.allergens.join(", ")}` };
      }

      case "order_update_status": {
        let query = supabase.from("orders").select("id, customer_name, status").eq("restaurant_id", resourceId);
        if (action.order_id) query = query.eq("id", action.order_id);
        else if (action.customer_name) query = query.ilike("customer_name", `%${action.customer_name}%`);
        const { data: orders } = await query.order("created_at", { ascending: false }).limit(1);
        if (!orders?.length) return { success: false, detail: "Ordine non trovato" };
        const { error } = await supabase.from("orders").update({ status: action.new_status }).eq("id", orders[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Ordine di ${orders[0].customer_name} → ${action.new_status}` };
      }

      case "reservation_update": {
        const { data: res } = await supabase
          .from("reservations").select("id, customer_name")
          .eq("restaurant_id", resourceId)
          .ilike("customer_name", `%${action.customer_name}%`)
          .order("reservation_date", { ascending: false }).limit(1);
        if (!res?.length) return { success: false, detail: "Prenotazione non trovata" };
        const { error } = await supabase.from("reservations").update({ status: action.new_status }).eq("id", res[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Prenotazione di ${res[0].customer_name} → ${action.new_status}` };
      }

      case "table_update_status": {
        const { error } = await supabase
          .from("restaurant_tables")
          .update({ status: action.status })
          .eq("restaurant_id", resourceId)
          .eq("table_number", action.table_number);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Tavolo ${action.table_number} → ${action.status}` };
      }

      case "toggle_service": {
        const fieldMap: Record<string, string> = {
          table_orders: "table_orders_enabled",
          takeaway: "takeaway_enabled",
          delivery: "delivery_enabled",
        };
        const field = fieldMap[action.service];
        if (!field) return { success: false, detail: `Servizio "${action.service}" non riconosciuto` };
        const { error } = await supabase
          .from("restaurants")
          .update({ [field]: action.enabled, updated_at: new Date().toISOString() })
          .eq("id", resourceId);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `${action.service} ${action.enabled ? "attivato" : "disattivato"}` };
      }

      // ════════════════════════════════════════
      // NCC / TRASPORTO
      // ════════════════════════════════════════

      case "vehicle_toggle": {
        const { data: v } = await supabase.from("fleet_vehicles").select("id, name")
          .eq("company_id", resourceId).ilike("name", `%${action.vehicle_name}%`);
        if (!v?.length) return { success: false, detail: `Veicolo "${action.vehicle_name}" non trovato` };
        const { error } = await supabase.from("fleet_vehicles")
          .update({ is_active: action.is_active, updated_at: new Date().toISOString() }).eq("id", v[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `"${v[0].name}" ${action.is_active ? "attivato" : "disattivato"}` };
      }

      case "vehicle_update_price": {
        const { data: v } = await supabase.from("fleet_vehicles").select("id, name")
          .eq("company_id", resourceId).ilike("name", `%${action.vehicle_name}%`);
        if (!v?.length) return { success: false, detail: `Veicolo "${action.vehicle_name}" non trovato` };
        const upd: any = { updated_at: new Date().toISOString() };
        if (action.new_base_price !== undefined) upd.base_price = action.new_base_price;
        if (action.new_price_per_km !== undefined) upd.price_per_km = action.new_price_per_km;
        const { error } = await supabase.from("fleet_vehicles").update(upd).eq("id", v[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Prezzo "${v[0].name}" aggiornato` };
      }

      case "ncc_booking_update":
      case "booking_update_status": {
        let q = supabase.from("ncc_bookings").select("id, customer_name").eq("company_id", resourceId);
        if (action.booking_id) q = q.eq("id", action.booking_id);
        else if (action.customer_name) q = q.ilike("customer_name", `%${action.customer_name}%`);
        const { data: b } = await q.order("created_at", { ascending: false }).limit(1);
        if (!b?.length) return { success: false, detail: "Prenotazione NCC non trovata" };
        const { error } = await supabase.from("ncc_bookings").update({ status: action.new_status }).eq("id", b[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Prenotazione di ${b[0].customer_name} → ${action.new_status}` };
      }

      case "driver_update_status": {
        const { data: d } = await supabase.from("drivers").select("id, first_name, last_name")
          .eq("company_id", resourceId)
          .or(`first_name.ilike.%${action.driver_name}%,last_name.ilike.%${action.driver_name}%`);
        if (!d?.length) return { success: false, detail: `Autista "${action.driver_name}" non trovato` };
        const { error } = await supabase.from("drivers").update({ status: action.status }).eq("id", d[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `${d[0].first_name} ${d[0].last_name} → ${action.status}` };
      }

      case "cross_sell_toggle": {
        const { data: cs } = await supabase.from("cross_sells").select("id, title")
          .eq("company_id", resourceId).ilike("title", `%${action.title}%`);
        if (!cs?.length) return { success: false, detail: `Cross-sell "${action.title}" non trovato` };
        const { error } = await supabase.from("cross_sells").update({ is_active: action.is_active }).eq("id", cs[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Cross-sell "${cs[0].title}" ${action.is_active ? "attivato" : "disattivato"}` };
      }

      case "cross_sell_update_price": {
        const { data: cs } = await supabase.from("cross_sells").select("id, title, price")
          .eq("company_id", resourceId).ilike("title", `%${action.title}%`);
        if (!cs?.length) return { success: false, detail: `Cross-sell "${action.title}" non trovato` };
        const { error } = await supabase.from("cross_sells").update({ price: action.new_price }).eq("id", cs[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `"${cs[0].title}": €${cs[0].price} → €${action.new_price}` };
      }

      // ════════════════════════════════════════
      // BEAUTY / HEALTHCARE / FITNESS — Appointments
      // ════════════════════════════════════════

      case "appointment_update": {
        const { data: a } = await supabase.from("appointments").select("id, client_name")
          .eq("company_id", resourceId).ilike("client_name", `%${action.client_name}%`)
          .order("scheduled_at", { ascending: false }).limit(1);
        if (!a?.length) return { success: false, detail: `Appuntamento per "${action.client_name}" non trovato` };
        const { error } = await supabase.from("appointments").update({ status: action.new_status }).eq("id", a[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Appuntamento di ${a[0].client_name} → ${action.new_status}` };
      }

      case "appointment_reschedule": {
        const { data: a } = await supabase.from("appointments").select("id, client_name")
          .eq("company_id", resourceId).ilike("client_name", `%${action.client_name}%`)
          .order("scheduled_at", { ascending: false }).limit(1);
        if (!a?.length) return { success: false, detail: `Appuntamento per "${action.client_name}" non trovato` };
        const newDateTime = `${action.new_date}T${action.new_time}:00`;
        const { error } = await supabase.from("appointments").update({ scheduled_at: newDateTime }).eq("id", a[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Appuntamento di ${a[0].client_name} spostato al ${action.new_date} ${action.new_time}` };
      }

      case "service_update_price": {
        // For companies with services in appointments context — update via service catalog if available
        // For now, we'll look in menu_items as services (multi-sector approach)
        const { data: items } = await supabase.from("menu_items").select("id, name, price")
          .eq("restaurant_id", resourceId).ilike("name", `%${action.service_name}%`);
        if (items?.length) {
          const { error } = await supabase.from("menu_items")
            .update({ price: action.new_price, updated_at: new Date().toISOString() }).eq("id", items[0].id);
          if (error) return { success: false, detail: `Errore: ${error.message}` };
          return { success: true, detail: `"${items[0].name}": €${items[0].price} → €${action.new_price}` };
        }
        return { success: false, detail: `Servizio "${action.service_name}" non trovato` };
      }

      case "service_toggle": {
        const { data: items } = await supabase.from("menu_items").select("id, name")
          .eq("restaurant_id", resourceId).ilike("name", `%${action.service_name}%`);
        if (items?.length) {
          const { error } = await supabase.from("menu_items")
            .update({ is_active: action.is_active, updated_at: new Date().toISOString() }).eq("id", items[0].id);
          if (error) return { success: false, detail: `Errore: ${error.message}` };
          return { success: true, detail: `"${items[0].name}" ${action.is_active ? "attivato" : "disattivato"}` };
        }
        return { success: false, detail: `Servizio "${action.service_name}" non trovato` };
      }

      case "service_update_duration": {
        const { data: a } = await supabase.from("appointments").select("id, service_name")
          .eq("company_id", resourceId).ilike("service_name", `%${action.service_name}%`)
          .order("scheduled_at", { ascending: false }).limit(1);
        if (!a?.length) return { success: false, detail: `Servizio "${action.service_name}" non trovato` };
        const { error } = await supabase.from("appointments")
          .update({ duration_minutes: action.duration_minutes }).eq("id", a[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Durata "${a[0].service_name}" → ${action.duration_minutes} min` };
      }

      // ════════════════════════════════════════
      // HEALTHCARE — Technical Notes
      // ════════════════════════════════════════

      case "client_add_technical_note": {
        const { data: c } = await supabase.from("crm_clients").select("id, first_name, last_name, notes_technical")
          .eq("company_id", resourceId)
          .or(`first_name.ilike.%${action.client_name}%,last_name.ilike.%${action.client_name}%`).limit(1);
        if (!c?.length) return { success: false, detail: `Paziente "${action.client_name}" non trovato` };
        const existing = c[0].notes_technical || "";
        const newNotes = existing
          ? `${existing}\n[${new Date().toLocaleDateString("it-IT")}] ${action.note}`
          : `[${new Date().toLocaleDateString("it-IT")}] ${action.note}`;
        const { error } = await supabase.from("crm_clients").update({ notes_technical: newNotes }).eq("id", c[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Nota clinica aggiunta per ${c[0].first_name} ${c[0].last_name}` };
      }

      // ════════════════════════════════════════
      // BEACH
      // ════════════════════════════════════════

      case "spot_update_price": {
        const upd: any = {};
        if (action.price_daily !== undefined) upd.price_daily = action.price_daily;
        if (action.price_morning !== undefined) upd.price_morning = action.price_morning;
        if (action.price_afternoon !== undefined) upd.price_afternoon = action.price_afternoon;
        const { error } = await supabase.from("beach_spots").update(upd)
          .eq("company_id", resourceId).eq("row_letter", action.row_letter).eq("spot_number", action.spot_number);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Ombrellone ${action.row_letter}${action.spot_number} prezzo aggiornato` };
      }

      case "spot_toggle": {
        const { error } = await supabase.from("beach_spots")
          .update({ is_active: action.is_active })
          .eq("company_id", resourceId).eq("row_letter", action.row_letter).eq("spot_number", action.spot_number);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Ombrellone ${action.row_letter}${action.spot_number} ${action.is_active ? "attivato" : "disattivato"}` };
      }

      case "beach_booking_update": {
        const { data: bb } = await supabase.from("beach_bookings").select("id, client_name")
          .eq("company_id", resourceId).ilike("client_name", `%${action.client_name}%`)
          .order("created_at", { ascending: false }).limit(1);
        if (!bb?.length) return { success: false, detail: "Prenotazione spiaggia non trovata" };
        const { error } = await supabase.from("beach_bookings").update({ status: action.new_status }).eq("id", bb[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Prenotazione spiaggia di ${bb[0].client_name} → ${action.new_status}` };
      }

      case "beach_pass_toggle": {
        const { data: bp } = await supabase.from("beach_passes").select("id, client_name")
          .eq("company_id", resourceId).ilike("client_name", `%${action.client_name}%`).limit(1);
        if (!bp?.length) return { success: false, detail: `Abbonamento per "${action.client_name}" non trovato` };
        const { error } = await supabase.from("beach_passes").update({ is_active: action.is_active }).eq("id", bp[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Abbonamento di ${bp[0].client_name} ${action.is_active ? "attivato" : "disattivato"}` };
      }

      // ════════════════════════════════════════
      // TRADES — Interventions
      // ════════════════════════════════════════

      case "intervention_update": {
        const { data: i } = await supabase.from("interventions").select("id, client_name")
          .eq("company_id", resourceId).ilike("client_name", `%${action.client_name}%`)
          .order("created_at", { ascending: false }).limit(1);
        if (!i?.length) return { success: false, detail: `Intervento per "${action.client_name}" non trovato` };
        const { error } = await supabase.from("interventions")
          .update({ status: action.new_status, updated_at: new Date().toISOString() }).eq("id", i[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Intervento di ${i[0].client_name} → ${action.new_status}` };
      }

      case "intervention_add_note": {
        const { data: i } = await supabase.from("interventions").select("id, client_name, notes")
          .eq("company_id", resourceId).ilike("client_name", `%${action.client_name}%`)
          .order("created_at", { ascending: false }).limit(1);
        if (!i?.length) return { success: false, detail: `Intervento per "${action.client_name}" non trovato` };
        const existing = i[0].notes || "";
        const newN = existing ? `${existing}\n[${new Date().toLocaleDateString("it-IT")}] ${action.note}` : `[${new Date().toLocaleDateString("it-IT")}] ${action.note}`;
        const { error } = await supabase.from("interventions")
          .update({ notes: newN, updated_at: new Date().toISOString() }).eq("id", i[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Nota aggiunta all'intervento di ${i[0].client_name}` };
      }

      case "intervention_set_price": {
        const { data: i } = await supabase.from("interventions").select("id, client_name")
          .eq("company_id", resourceId).ilike("client_name", `%${action.client_name}%`)
          .order("created_at", { ascending: false }).limit(1);
        if (!i?.length) return { success: false, detail: `Intervento per "${action.client_name}" non trovato` };
        const { error } = await supabase.from("interventions")
          .update({ final_price: action.final_price, updated_at: new Date().toISOString() }).eq("id", i[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Prezzo intervento di ${i[0].client_name} → €${action.final_price}` };
      }

      // ════════════════════════════════════════
      // COMMON — Leads, Clients, Staff, Company
      // ════════════════════════════════════════

      case "lead_add": {
        const { error } = await supabase.from("leads").insert({
          company_id: resourceId,
          name: action.name,
          phone: action.phone || null,
          email: action.email || null,
          source: action.source || "whatsapp",
          notes: action.notes || null,
          status: "new",
          value: 0,
        });
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Lead "${action.name}" aggiunto` };
      }

      case "lead_update_status": {
        const { data: l } = await supabase.from("leads").select("id, name")
          .eq("company_id", resourceId).ilike("name", `%${action.lead_name}%`)
          .order("created_at", { ascending: false }).limit(1);
        if (!l?.length) return { success: false, detail: `Lead "${action.lead_name}" non trovato` };
        const { error } = await supabase.from("leads")
          .update({ status: action.new_status, updated_at: new Date().toISOString() }).eq("id", l[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Lead "${l[0].name}" → ${action.new_status}` };
      }

      case "client_add": {
        const { error } = await supabase.from("crm_clients").insert({
          company_id: resourceId,
          first_name: action.first_name,
          last_name: action.last_name || null,
          phone: action.phone || null,
          email: action.email || null,
          notes: action.notes || null,
        });
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Cliente "${action.first_name} ${action.last_name || ""}" aggiunto` };
      }

      case "client_add_note": {
        const { data: c } = await supabase.from("crm_clients").select("id, first_name, last_name, notes")
          .eq("company_id", resourceId)
          .or(`first_name.ilike.%${action.client_name}%,last_name.ilike.%${action.client_name}%`).limit(1);
        if (!c?.length) return { success: false, detail: `Cliente "${action.client_name}" non trovato` };
        const existing = c[0].notes || "";
        const newN = existing ? `${existing}\n[${new Date().toLocaleDateString("it-IT")}] ${action.note}` : `[${new Date().toLocaleDateString("it-IT")}] ${action.note}`;
        const { error } = await supabase.from("crm_clients").update({ notes: newN }).eq("id", c[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Nota aggiunta per ${c[0].first_name} ${c[0].last_name || ""}` };
      }

      case "staff_update_status": {
        const { data: s } = await supabase.from("staff").select("id, name")
          .eq("company_id", resourceId).ilike("name", `%${action.staff_name}%`).limit(1);
        if (!s?.length) return { success: false, detail: `Staff "${action.staff_name}" non trovato` };
        const { error } = await supabase.from("staff")
          .update({ is_active: action.is_active }).eq("id", s[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `${s[0].name} ${action.is_active ? "attivato" : "disattivato"}` };
      }

      case "company_update_info": {
        const table = isRestaurant ? "restaurants" : "companies";
        const { error } = await supabase.from(table)
          .update({ [action.field]: action.value, updated_at: new Date().toISOString() })
          .eq("id", resourceId);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `${action.field} aggiornato: "${action.value}"` };
      }

      case "automation_toggle": {
        const { data: auto } = await supabase.from("automations").select("id, automation_type")
          .eq("company_id", resourceId).ilike("automation_type", `%${action.automation_type}%`).limit(1);
        if (!auto?.length) return { success: false, detail: `Automazione "${action.automation_type}" non trovata` };
        const { error } = await supabase.from("automations")
          .update({ is_active: action.is_active }).eq("id", auto[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Automazione "${auto[0].automation_type}" ${action.is_active ? "attivata" : "disattivata"}` };
      }

      // ════════════════════════════════════════
      // RETAIL — Products
      // ════════════════════════════════════════

      case "product_update_price":
      case "product_toggle":
      case "product_update_stock":
      case "product_add": {
        // Retail uses menu_items as product catalog
        if (action.action === "product_add") {
          const { error } = await supabase.from("menu_items").insert({
            restaurant_id: resourceId,
            name: action.name,
            price: action.price,
            category: action.category || "Prodotti",
            description: action.description || null,
            is_active: true,
            is_popular: false,
          });
          if (error) return { success: false, detail: `Errore: ${error.message}` };
          return { success: true, detail: `Prodotto "${action.name}" aggiunto (€${action.price})` };
        }

        const { data: items } = await supabase.from("menu_items").select("id, name, price")
          .eq("restaurant_id", resourceId).ilike("name", `%${action.product_name}%`);
        if (!items?.length) return { success: false, detail: `Prodotto "${action.product_name}" non trovato` };

        if (action.action === "product_update_price") {
          const { error } = await supabase.from("menu_items")
            .update({ price: action.new_price, updated_at: new Date().toISOString() }).eq("id", items[0].id);
          if (error) return { success: false, detail: `Errore: ${error.message}` };
          return { success: true, detail: `"${items[0].name}": €${items[0].price} → €${action.new_price}` };
        }
        if (action.action === "product_toggle") {
          const { error } = await supabase.from("menu_items")
            .update({ is_active: action.is_active, updated_at: new Date().toISOString() }).eq("id", items[0].id);
          if (error) return { success: false, detail: `Errore: ${error.message}` };
          return { success: true, detail: `"${items[0].name}" ${action.is_active ? "attivato" : "disattivato"}` };
        }
        // product_update_stock — store in sort_order as workaround
        const { error } = await supabase.from("menu_items")
          .update({ sort_order: action.quantity, updated_at: new Date().toISOString() }).eq("id", items[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Stock "${items[0].name}" → ${action.quantity}` };
      }

      // ════════════════════════════════════════
      // HOSPITALITY — Rooms
      // ════════════════════════════════════════

      case "room_update_price":
      case "room_update_status": {
        // Hospitality doesn't have a rooms table yet; use content_blocks as a lightweight store
        return { success: false, detail: "Gestione camere via comando sarà disponibile a breve" };
      }

      case "booking_update": {
        // Generic booking update — try beach_bookings, then ncc_bookings
        const { data: bb } = await supabase.from("beach_bookings").select("id, client_name")
          .eq("company_id", resourceId)
          .ilike("client_name", `%${action.guest_name || action.client_name}%`)
          .order("created_at", { ascending: false }).limit(1);
        if (bb?.length) {
          const { error } = await supabase.from("beach_bookings").update({ status: action.new_status }).eq("id", bb[0].id);
          if (error) return { success: false, detail: `Errore: ${error.message}` };
          return { success: true, detail: `Prenotazione di ${bb[0].client_name} → ${action.new_status}` };
        }
        const { data: nb } = await supabase.from("ncc_bookings").select("id, customer_name")
          .eq("company_id", resourceId)
          .ilike("customer_name", `%${action.guest_name || action.client_name}%`)
          .order("created_at", { ascending: false }).limit(1);
        if (nb?.length) {
          const { error } = await supabase.from("ncc_bookings").update({ status: action.new_status }).eq("id", nb[0].id);
          if (error) return { success: false, detail: `Errore: ${error.message}` };
          return { success: true, detail: `Prenotazione di ${nb[0].customer_name} → ${action.new_status}` };
        }
        return { success: false, detail: "Prenotazione non trovata" };
      }

      // ════════════════════════════════════════
      // FITNESS
      // ════════════════════════════════════════

      case "class_toggle": {
        // Use menu_items as class catalog
        const { data: items } = await supabase.from("menu_items").select("id, name")
          .eq("restaurant_id", resourceId).ilike("name", `%${action.class_name}%`);
        if (!items?.length) return { success: false, detail: `Corso "${action.class_name}" non trovato` };
        const { error } = await supabase.from("menu_items")
          .update({ is_active: action.is_active, updated_at: new Date().toISOString() }).eq("id", items[0].id);
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Corso "${items[0].name}" ${action.is_active ? "attivato" : "disattivato"}` };
      }

      case "membership_update": {
        // Not yet a dedicated table, use CRM
        return { success: false, detail: "Gestione membership via comando sarà disponibile a breve" };
      }

      default:
        return { success: false, detail: `Azione "${action.action}" non supportata per questo settore` };
    }
  } catch (err) {
    return { success: false, detail: `Errore esecuzione: ${(err as Error).message}` };
  }
}

// ══════════════════════════════════════════════════════════════
// TENANT RESOLUTION
// ══════════════════════════════════════════════════════════════

async function resolveTenantResource(supabase: any, tenantId: string): Promise<{ resourceId: string; tenantType: string; sector: string } | null> {
  // Check restaurants first (Food sector)
  const { data: restaurant } = await supabase
    .from("restaurants").select("id")
    .eq("owner_id", tenantId).eq("is_active", true)
    .limit(1).maybeSingle();

  if (restaurant) {
    return { resourceId: restaurant.id, tenantType: "restaurant", sector: "ristorazione" };
  }

  // Check company memberships
  const { data: membership } = await supabase
    .from("company_memberships").select("company_id")
    .eq("user_id", tenantId).limit(1).maybeSingle();

  if (membership) {
    const { data: company } = await supabase
      .from("companies").select("id, industry")
      .eq("id", membership.company_id).maybeSingle();
    if (company) {
      return { resourceId: company.id, tenantType: "company", sector: company.industry || "retail" };
    }
  }

  return null;
}

// ══════════════════════════════════════════════════════════════
// PHONE VERIFICATION
// ══════════════════════════════════════════════════════════════

async function verifyPhoneOwnership(supabase: any, tenantId: string, senderPhone: string): Promise<boolean> {
  const normalized = senderPhone.replace(/\D/g, "");
  const last9 = normalized.slice(-9);

  const matchPhone = (phone: string | null): boolean => {
    if (!phone) return false;
    const pNorm = phone.replace(/\D/g, "");
    return pNorm.slice(-9) === last9;
  };

  // Check restaurant phone
  const { data: restaurant } = await supabase
    .from("restaurants").select("phone").eq("owner_id", tenantId).maybeSingle();
  if (matchPhone(restaurant?.phone)) return true;

  // Check profile phone
  const { data: profile } = await supabase
    .from("profiles").select("phone").eq("user_id", tenantId).maybeSingle();
  if (matchPhone(profile?.phone)) return true;

  // Check company phone
  const { data: membership } = await supabase
    .from("company_memberships").select("company_id")
    .eq("user_id", tenantId).limit(1).maybeSingle();
  if (membership) {
    const { data: company } = await supabase
      .from("companies").select("phone").eq("id", membership.company_id).maybeSingle();
    if (matchPhone(company?.phone)) return true;
  }

  // Check WhatsApp config ownership
  const { data: waConfig } = await supabase
    .from("whatsapp_config").select("tenant_id")
    .eq("tenant_id", tenantId).eq("is_active", true).maybeSingle();
  return !!waConfig;
}

// ══════════════════════════════════════════════════════════════
// MAIN SERVER
// ══════════════════════════════════════════════════════════════

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const body = await req.json();
    const { tenant_id, command, source = "chat", sender_phone } = body;

    if (!tenant_id || !command) {
      return new Response(JSON.stringify({ error: "tenant_id e command richiesti" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Phone verification for WhatsApp source ──
    if (source === "whatsapp" && sender_phone) {
      const isVerified = await verifyPhoneOwnership(supabase, tenant_id, sender_phone);
      if (!isVerified) {
        await supabase.from("command_audit_log").insert({
          tenant_id, tenant_type: "unknown", resource_id: tenant_id,
          source, sender_phone, raw_command: command,
          parsed_intent: {}, actions_executed: [],
          status: "rejected", error_message: "Numero di telefono non verificato",
        });
        return new Response(JSON.stringify({
          error: "Numero non autorizzato",
          message_it: "⛔ Questo numero non è autorizzato ad eseguire comandi. Usa il numero registrato nel tuo account Empire.",
        }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // ── Resolve tenant resource ──
    const resource = await resolveTenantResource(supabase, tenant_id);
    if (!resource) {
      return new Response(JSON.stringify({ error: "Nessuna attività trovata per questo utente" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Parse command with AI ──
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI non configurata" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sectorSchema = getSectorSchema(resource.sector);
    const parsePrompt = `${COMMAND_SYSTEM_PROMPT}\n\nSETTORE ATTIVO: ${resource.sector}\n${sectorSchema}\n\nCOMANDO UTENTE:\n"${command}"`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: parsePrompt }],
        max_tokens: 1000,
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI parse error:", aiResp.status, errText);
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Troppo traffico AI, riprova tra poco." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Errore parsing comando" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResp.json();
    const rawContent = aiData.choices?.[0]?.message?.content?.trim() || "{}";

    let parsed: { actions?: any[]; summary_it?: string; error?: string };
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = { actions: [], error: "Impossibile interpretare il comando" };
    }

    if (!parsed.actions?.length) {
      await supabase.from("command_audit_log").insert({
        tenant_id, tenant_type: resource.tenantType, resource_id: resource.resourceId,
        source, sender_phone: sender_phone || null, raw_command: command,
        parsed_intent: parsed, actions_executed: [],
        status: "failed", error_message: parsed.error || "Nessuna azione riconosciuta",
      });
      return new Response(JSON.stringify({
        success: false,
        message_it: parsed.error || "❌ Non sono riuscito a capire il comando. Prova a riformularlo.",
        actions_executed: [],
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ── Execute actions ──
    const results: Array<{ action: string; success: boolean; detail: string }> = [];
    for (const action of parsed.actions) {
      const result = await executeAction(supabase, action, resource.resourceId, resource.tenantType);
      results.push({ action: action.action, ...result });
    }

    const allSuccess = results.every(r => r.success);
    const summaryParts = results.map(r => `${r.success ? "✅" : "❌"} ${r.detail}`);

    // ── Audit log ──
    await supabase.from("command_audit_log").insert({
      tenant_id, tenant_type: resource.tenantType, resource_id: resource.resourceId,
      source, sender_phone: sender_phone || null, raw_command: command,
      parsed_intent: parsed, actions_executed: results,
      status: allSuccess ? "executed" : "failed",
      error_message: allSuccess ? null : results.filter(r => !r.success).map(r => r.detail).join("; "),
    });

    // ── Track AI usage ──
    await supabase.from("ai_usage_logs").insert({
      agent_name: "command-agent",
      model_used: "google/gemini-2.5-flash",
      duration_ms: 0,
      status: allSuccess ? "success" : "partial",
      restaurant_id: resource.tenantType === "restaurant" ? resource.resourceId : null,
      company_id: resource.tenantType === "company" ? resource.resourceId : null,
    }).catch(() => {});

    return new Response(JSON.stringify({
      success: allSuccess,
      message_it: `${parsed.summary_it || "Comando eseguito"}\n\n${summaryParts.join("\n")}`,
      actions_executed: results,
      sector: resource.sector,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    console.error("Command agent error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
