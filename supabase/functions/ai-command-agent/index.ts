// ══════════════════════════════════════════════════════════════
// Empire AI Command Agent — Natural Language → DB Operations
// Multi-sector, tenant-isolated, phone-verified
// ══════════════════════════════════════════════════════════════
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Sector-specific action schemas ──
const SECTOR_SCHEMAS: Record<string, string> = {
  ristorazione: `
AZIONI DISPONIBILI per RISTORAZIONE:
- MENU_UPDATE_PRICE: { action: "menu_update_price", item_name: string, new_price: number }
- MENU_REMOVE_ITEM: { action: "menu_remove_item", item_name: string }
- MENU_ADD_ITEM: { action: "menu_add_item", name: string, price: number, category: string, description?: string }
- MENU_TOGGLE_ACTIVE: { action: "menu_toggle_active", item_name: string, is_active: boolean }
- MENU_UPDATE_DESCRIPTION: { action: "menu_update_description", item_name: string, description: string }
- ORDER_UPDATE_STATUS: { action: "order_update_status", order_id?: string, customer_name?: string, new_status: "pending"|"preparing"|"ready"|"delivered"|"cancelled" }
- RESERVATION_UPDATE: { action: "reservation_update", customer_name: string, new_status: "confirmed"|"cancelled" }
- TABLE_UPDATE_STATUS: { action: "table_update_status", table_number: number, status: "free"|"occupied"|"reserved" }
- TOGGLE_SERVICE: { action: "toggle_service", service: "table_orders"|"takeaway"|"delivery", enabled: boolean }
`,
  food: `
AZIONI DISPONIBILI per FOOD:
- MENU_UPDATE_PRICE: { action: "menu_update_price", item_name: string, new_price: number }
- MENU_REMOVE_ITEM: { action: "menu_remove_item", item_name: string }
- MENU_ADD_ITEM: { action: "menu_add_item", name: string, price: number, category: string, description?: string }
- MENU_TOGGLE_ACTIVE: { action: "menu_toggle_active", item_name: string, is_active: boolean }
- MENU_UPDATE_DESCRIPTION: { action: "menu_update_description", item_name: string, description: string }
- ORDER_UPDATE_STATUS: { action: "order_update_status", order_id?: string, customer_name?: string, new_status: "pending"|"preparing"|"ready"|"delivered"|"cancelled" }
- RESERVATION_UPDATE: { action: "reservation_update", customer_name: string, new_status: "confirmed"|"cancelled" }
- TABLE_UPDATE_STATUS: { action: "table_update_status", table_number: number, status: "free"|"occupied"|"reserved" }
- TOGGLE_SERVICE: { action: "toggle_service", service: "table_orders"|"takeaway"|"delivery", enabled: boolean }
`,
  ncc: `
AZIONI DISPONIBILI per NCC:
- VEHICLE_TOGGLE: { action: "vehicle_toggle", vehicle_name: string, is_active: boolean }
- VEHICLE_UPDATE_PRICE: { action: "vehicle_update_price", vehicle_name: string, new_base_price?: number, new_price_per_km?: number }
- BOOKING_UPDATE_STATUS: { action: "booking_update_status", booking_id?: string, customer_name?: string, new_status: "pending"|"confirmed"|"in_progress"|"completed"|"cancelled" }
- DRIVER_UPDATE_STATUS: { action: "driver_update_status", driver_name: string, status: "available"|"busy"|"off_duty" }
`,
  beauty: `
AZIONI DISPONIBILI per BEAUTY:
- SERVICE_UPDATE_PRICE: { action: "service_update_price", service_name: string, new_price: number }
- SERVICE_TOGGLE: { action: "service_toggle", service_name: string, is_active: boolean }
- APPOINTMENT_UPDATE: { action: "appointment_update", client_name: string, new_status: "pending"|"confirmed"|"completed"|"cancelled" }
- CLIENT_ADD_NOTE: { action: "client_add_note", client_name: string, note: string }
`,
  healthcare: `
AZIONI DISPONIBILI per HEALTHCARE:
- SERVICE_UPDATE_PRICE: { action: "service_update_price", service_name: string, new_price: number }
- APPOINTMENT_UPDATE: { action: "appointment_update", client_name: string, new_status: "pending"|"confirmed"|"completed"|"cancelled" }
- CLIENT_ADD_NOTE: { action: "client_add_note", client_name: string, note: string }
`,
  retail: `
AZIONI DISPONIBILI per RETAIL:
- PRODUCT_UPDATE_PRICE: { action: "product_update_price", product_name: string, new_price: number }
- PRODUCT_TOGGLE: { action: "product_toggle", product_name: string, is_active: boolean }
- PRODUCT_UPDATE_STOCK: { action: "product_update_stock", product_name: string, quantity: number }
`,
  fitness: `
AZIONI DISPONIBILI per FITNESS:
- CLASS_TOGGLE: { action: "class_toggle", class_name: string, is_active: boolean }
- MEMBERSHIP_UPDATE: { action: "membership_update", client_name: string, new_status: string }
`,
  hospitality: `
AZIONI DISPONIBILI per HOSPITALITY:
- ROOM_UPDATE_PRICE: { action: "room_update_price", room_name: string, new_price: number }
- ROOM_UPDATE_STATUS: { action: "room_update_status", room_name: string, status: string }
- BOOKING_UPDATE: { action: "booking_update", guest_name: string, new_status: "confirmed"|"cancelled"|"checked_in"|"checked_out" }
`,
  beach: `
AZIONI DISPONIBILI per BEACH:
- SPOT_UPDATE_PRICE: { action: "spot_update_price", row_letter: string, spot_number: number, price_daily?: number, price_morning?: number, price_afternoon?: number }
- SPOT_TOGGLE: { action: "spot_toggle", row_letter: string, spot_number: number, is_active: boolean }
- BOOKING_UPDATE: { action: "booking_update", client_name: string, new_status: "confirmed"|"cancelled" }
`,
};

// Catch-all for plumber, electrician, construction, etc.
const TRADES_SCHEMA = `
AZIONI DISPONIBILI per SERVIZI TECNICI:
- INTERVENTION_UPDATE: { action: "intervention_update", client_name: string, new_status: "richiesta"|"programmato"|"in_corso"|"completato"|"fatturato"|"annullato" }
- INTERVENTION_ADD_NOTE: { action: "intervention_add_note", client_name: string, note: string }
- CLIENT_ADD_NOTE: { action: "client_add_note", client_name: string, note: string }
`;

const TRADES_SECTORS = ["plumber", "electrician", "construction", "gardening", "cleaning", "garage", "veterinary", "tattoo", "childcare", "education", "events", "logistics", "photography", "legal", "accounting", "agriturismo"];

function getSectorSchema(sector: string): string {
  if (SECTOR_SCHEMAS[sector]) return SECTOR_SCHEMAS[sector];
  if (TRADES_SECTORS.includes(sector)) return TRADES_SCHEMA;
  return SECTOR_SCHEMAS["ristorazione"]; // fallback
}

const COMMAND_SYSTEM_PROMPT = `Sei Empire Command Agent — un agente AI che trasforma comandi in linguaggio naturale in azioni strutturate sul database dell'attività dell'utente.

REGOLE CRITICHE:
1. Analizza il comando e restituisci SOLO un JSON valido con un array "actions"
2. NON inventare dati — usa solo quelli forniti nel comando
3. Per i prezzi, interpreta "aumenta di X" come prezzo_attuale + X e "abbassa/riduci di X" come prezzo_attuale - X
4. Per "togli" / "rimuovi" intendi disattivare (is_active=false), NON eliminare dal database
5. Se il comando è ambiguo o non riesci a capirlo, restituisci: { "actions": [], "error": "messaggio di spiegazione" }
6. Puoi restituire MULTIPLE azioni in un singolo comando
7. I nomi dei piatti/prodotti/servizi devono essere cercati con corrispondenza fuzzy (case-insensitive)

FORMATO RISPOSTA (JSON puro, nessun markdown):
{
  "actions": [
    { "action": "tipo_azione", ...parametri },
    ...
  ],
  "summary_it": "Breve descrizione in italiano di cosa verrà fatto"
}
`;

// ── Action Executors ──

async function executeAction(
  supabase: any,
  action: any,
  resourceId: string,
  tenantType: string,
): Promise<{ success: boolean; detail: string }> {
  try {
    switch (action.action) {
      // ── FOOD / RISTORAZIONE ──
      case "menu_update_price": {
        const { data: items } = await supabase
          .from("menu_items")
          .select("id, name, price")
          .eq("restaurant_id", resourceId)
          .ilike("name", `%${action.item_name}%`);
        
        if (!items?.length) return { success: false, detail: `Piatto "${action.item_name}" non trovato` };
        const item = items[0];
        
        // Handle relative prices (increase/decrease)
        let finalPrice = action.new_price;
        if (action.price_delta) {
          finalPrice = Number(item.price) + Number(action.price_delta);
        }
        
        const { error } = await supabase
          .from("menu_items")
          .update({ price: finalPrice, updated_at: new Date().toISOString() })
          .eq("id", item.id);
        
        if (error) return { success: false, detail: `Errore aggiornamento prezzo: ${error.message}` };
        return { success: true, detail: `Prezzo di "${item.name}" aggiornato: €${item.price} → €${finalPrice}` };
      }

      case "menu_remove_item":
      case "menu_toggle_active": {
        const isActive = action.action === "menu_toggle_active" ? action.is_active : false;
        const { data: items } = await supabase
          .from("menu_items")
          .select("id, name")
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
          is_active: true,
          is_popular: false,
        });
        
        if (error) return { success: false, detail: `Errore aggiunta piatto: ${error.message}` };
        return { success: true, detail: `"${action.name}" aggiunto al menu (€${action.price}, cat: ${action.category || "Altro"})` };
      }

      case "menu_update_description": {
        const { data: items } = await supabase
          .from("menu_items")
          .select("id, name")
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

      case "order_update_status": {
        let query = supabase.from("orders").select("id, customer_name, status").eq("restaurant_id", resourceId);
        if (action.order_id) query = query.eq("id", action.order_id);
        else if (action.customer_name) query = query.ilike("customer_name", `%${action.customer_name}%`);
        query = query.order("created_at", { ascending: false }).limit(1);
        
        const { data: orders } = await query;
        if (!orders?.length) return { success: false, detail: "Ordine non trovato" };
        
        const { error } = await supabase
          .from("orders")
          .update({ status: action.new_status })
          .eq("id", orders[0].id);
        
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Ordine di ${orders[0].customer_name} → ${action.new_status}` };
      }

      case "reservation_update": {
        const { data: reservations } = await supabase
          .from("reservations")
          .select("id, customer_name")
          .eq("restaurant_id", resourceId)
          .ilike("customer_name", `%${action.customer_name}%`)
          .order("reservation_date", { ascending: false })
          .limit(1);
        
        if (!reservations?.length) return { success: false, detail: "Prenotazione non trovata" };
        
        const { error } = await supabase
          .from("reservations")
          .update({ status: action.new_status })
          .eq("id", reservations[0].id);
        
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Prenotazione di ${reservations[0].customer_name} → ${action.new_status}` };
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

      // ── NCC ──
      case "vehicle_toggle": {
        const { data: vehicles } = await supabase
          .from("fleet_vehicles")
          .select("id, name")
          .eq("company_id", resourceId)
          .ilike("name", `%${action.vehicle_name}%`);
        
        if (!vehicles?.length) return { success: false, detail: `Veicolo "${action.vehicle_name}" non trovato` };
        
        const { error } = await supabase
          .from("fleet_vehicles")
          .update({ is_active: action.is_active, updated_at: new Date().toISOString() })
          .eq("id", vehicles[0].id);
        
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Veicolo "${vehicles[0].name}" ${action.is_active ? "attivato" : "disattivato"}` };
      }

      case "vehicle_update_price": {
        const { data: vehicles } = await supabase
          .from("fleet_vehicles")
          .select("id, name")
          .eq("company_id", resourceId)
          .ilike("name", `%${action.vehicle_name}%`);
        
        if (!vehicles?.length) return { success: false, detail: `Veicolo "${action.vehicle_name}" non trovato` };
        
        const updateData: any = { updated_at: new Date().toISOString() };
        if (action.new_base_price !== undefined) updateData.base_price = action.new_base_price;
        if (action.new_price_per_km !== undefined) updateData.price_per_km = action.new_price_per_km;
        
        const { error } = await supabase
          .from("fleet_vehicles")
          .update(updateData)
          .eq("id", vehicles[0].id);
        
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Prezzo veicolo "${vehicles[0].name}" aggiornato` };
      }

      case "booking_update_status": {
        let query = supabase.from("ncc_bookings").select("id, customer_name").eq("company_id", resourceId);
        if (action.booking_id) query = query.eq("id", action.booking_id);
        else if (action.customer_name) query = query.ilike("customer_name", `%${action.customer_name}%`);
        query = query.order("created_at", { ascending: false }).limit(1);
        
        const { data: bookings } = await query;
        if (!bookings?.length) return { success: false, detail: "Prenotazione NCC non trovata" };
        
        const { error } = await supabase
          .from("ncc_bookings")
          .update({ status: action.new_status })
          .eq("id", bookings[0].id);
        
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Prenotazione NCC di ${bookings[0].customer_name} → ${action.new_status}` };
      }

      case "driver_update_status": {
        const { data: drivers } = await supabase
          .from("drivers")
          .select("id, first_name, last_name")
          .eq("company_id", resourceId)
          .or(`first_name.ilike.%${action.driver_name}%,last_name.ilike.%${action.driver_name}%`);
        
        if (!drivers?.length) return { success: false, detail: `Autista "${action.driver_name}" non trovato` };
        
        const { error } = await supabase
          .from("drivers")
          .update({ status: action.status })
          .eq("id", drivers[0].id);
        
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Autista ${drivers[0].first_name} ${drivers[0].last_name} → ${action.status}` };
      }

      // ── BEAUTY / HEALTHCARE — Appointments ──
      case "appointment_update": {
        const { data: appointments } = await supabase
          .from("appointments")
          .select("id, client_name")
          .eq("company_id", resourceId)
          .ilike("client_name", `%${action.client_name}%`)
          .order("scheduled_at", { ascending: false })
          .limit(1);
        
        if (!appointments?.length) return { success: false, detail: `Appuntamento per "${action.client_name}" non trovato` };
        
        const { error } = await supabase
          .from("appointments")
          .update({ status: action.new_status })
          .eq("id", appointments[0].id);
        
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Appuntamento di ${appointments[0].client_name} → ${action.new_status}` };
      }

      case "client_add_note": {
        const { data: clients } = await supabase
          .from("crm_clients")
          .select("id, first_name, last_name, notes")
          .eq("company_id", resourceId)
          .or(`first_name.ilike.%${action.client_name}%,last_name.ilike.%${action.client_name}%`)
          .limit(1);
        
        if (!clients?.length) return { success: false, detail: `Cliente "${action.client_name}" non trovato` };
        
        const existingNotes = clients[0].notes || "";
        const newNotes = existingNotes ? `${existingNotes}\n[${new Date().toLocaleDateString("it-IT")}] ${action.note}` : `[${new Date().toLocaleDateString("it-IT")}] ${action.note}`;
        
        const { error } = await supabase
          .from("crm_clients")
          .update({ notes: newNotes })
          .eq("id", clients[0].id);
        
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Nota aggiunta per ${clients[0].first_name} ${clients[0].last_name}` };
      }

      // ── BEACH ──
      case "spot_update_price": {
        const updateData: any = {};
        if (action.price_daily !== undefined) updateData.price_daily = action.price_daily;
        if (action.price_morning !== undefined) updateData.price_morning = action.price_morning;
        if (action.price_afternoon !== undefined) updateData.price_afternoon = action.price_afternoon;
        
        const { error } = await supabase
          .from("beach_spots")
          .update(updateData)
          .eq("company_id", resourceId)
          .eq("row_letter", action.row_letter)
          .eq("spot_number", action.spot_number);
        
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Prezzo ombrellone ${action.row_letter}${action.spot_number} aggiornato` };
      }

      case "spot_toggle": {
        const { error } = await supabase
          .from("beach_spots")
          .update({ is_active: action.is_active })
          .eq("company_id", resourceId)
          .eq("row_letter", action.row_letter)
          .eq("spot_number", action.spot_number);
        
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Ombrellone ${action.row_letter}${action.spot_number} ${action.is_active ? "attivato" : "disattivato"}` };
      }

      // ── TRADES — Interventions ──
      case "intervention_update": {
        const { data: interventions } = await supabase
          .from("interventions")
          .select("id, client_name")
          .eq("company_id", resourceId)
          .ilike("client_name", `%${action.client_name}%`)
          .order("created_at", { ascending: false })
          .limit(1);
        
        if (!interventions?.length) return { success: false, detail: `Intervento per "${action.client_name}" non trovato` };
        
        const { error } = await supabase
          .from("interventions")
          .update({ status: action.new_status, updated_at: new Date().toISOString() })
          .eq("id", interventions[0].id);
        
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Intervento di ${interventions[0].client_name} → ${action.new_status}` };
      }

      case "intervention_add_note": {
        const { data: interventions } = await supabase
          .from("interventions")
          .select("id, client_name, notes")
          .eq("company_id", resourceId)
          .ilike("client_name", `%${action.client_name}%`)
          .order("created_at", { ascending: false })
          .limit(1);
        
        if (!interventions?.length) return { success: false, detail: `Intervento per "${action.client_name}" non trovato` };
        
        const existing = interventions[0].notes || "";
        const newNotes = existing ? `${existing}\n[${new Date().toLocaleDateString("it-IT")}] ${action.note}` : `[${new Date().toLocaleDateString("it-IT")}] ${action.note}`;
        
        const { error } = await supabase
          .from("interventions")
          .update({ notes: newNotes, updated_at: new Date().toISOString() })
          .eq("id", interventions[0].id);
        
        if (error) return { success: false, detail: `Errore: ${error.message}` };
        return { success: true, detail: `Nota aggiunta all'intervento di ${interventions[0].client_name}` };
      }

      // ── Generic booking update for beach/hospitality ──
      case "booking_update": {
        // Try beach_bookings first
        const { data: beachBookings } = await supabase
          .from("beach_bookings")
          .select("id, client_name")
          .eq("company_id", resourceId)
          .ilike("client_name", `%${action.guest_name || action.client_name}%`)
          .order("created_at", { ascending: false })
          .limit(1);
        
        if (beachBookings?.length) {
          const { error } = await supabase
            .from("beach_bookings")
            .update({ status: action.new_status })
            .eq("id", beachBookings[0].id);
          if (error) return { success: false, detail: `Errore: ${error.message}` };
          return { success: true, detail: `Prenotazione spiaggia di ${beachBookings[0].client_name} → ${action.new_status}` };
        }

        return { success: false, detail: "Prenotazione non trovata" };
      }

      default:
        return { success: false, detail: `Azione "${action.action}" non supportata` };
    }
  } catch (err) {
    return { success: false, detail: `Errore esecuzione: ${(err as Error).message}` };
  }
}

// ── Resolve tenant's resource (restaurant_id or company_id) ──
async function resolveTenantResource(supabase: any, tenantId: string): Promise<{ resourceId: string; tenantType: string; sector: string } | null> {
  // Check restaurants first (Food sector)
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id")
    .eq("owner_id", tenantId)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (restaurant) {
    return { resourceId: restaurant.id, tenantType: "restaurant", sector: "ristorazione" };
  }

  // Check company memberships
  const { data: membership } = await supabase
    .from("company_memberships")
    .select("company_id")
    .eq("user_id", tenantId)
    .limit(1)
    .maybeSingle();

  if (membership) {
    const { data: company } = await supabase
      .from("companies")
      .select("id, industry")
      .eq("id", membership.company_id)
      .maybeSingle();

    if (company) {
      return { resourceId: company.id, tenantType: "company", sector: company.industry || "retail" };
    }
  }

  return null;
}

// ── Verify phone number belongs to tenant ──
async function verifyPhoneOwnership(supabase: any, tenantId: string, senderPhone: string): Promise<boolean> {
  // Check restaurant phone
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("phone")
    .eq("owner_id", tenantId)
    .maybeSingle();

  if (restaurant?.phone) {
    const normalized = senderPhone.replace(/\D/g, "");
    const restaurantNormalized = restaurant.phone.replace(/\D/g, "");
    if (normalized.endsWith(restaurantNormalized.slice(-9)) || restaurantNormalized.endsWith(normalized.slice(-9))) {
      return true;
    }
  }

  // Check profile phone
  const { data: profile } = await supabase
    .from("profiles")
    .select("phone")
    .eq("user_id", tenantId)
    .maybeSingle();

  if (profile?.phone) {
    const normalized = senderPhone.replace(/\D/g, "");
    const profileNormalized = profile.phone.replace(/\D/g, "");
    if (normalized.endsWith(profileNormalized.slice(-9)) || profileNormalized.endsWith(normalized.slice(-9))) {
      return true;
    }
  }

  // Check company phone
  const { data: membership } = await supabase
    .from("company_memberships")
    .select("company_id")
    .eq("user_id", tenantId)
    .limit(1)
    .maybeSingle();

  if (membership) {
    const { data: company } = await supabase
      .from("companies")
      .select("phone")
      .eq("id", membership.company_id)
      .maybeSingle();

    if (company?.phone) {
      const normalized = senderPhone.replace(/\D/g, "");
      const companyNormalized = company.phone.replace(/\D/g, "");
      if (normalized.endsWith(companyNormalized.slice(-9)) || companyNormalized.endsWith(normalized.slice(-9))) {
        return true;
      }
    }
  }

  // Check WhatsApp config ownership
  const { data: waConfig } = await supabase
    .from("whatsapp_config")
    .select("tenant_id")
    .eq("tenant_id", tenantId)
    .eq("is_active", true)
    .maybeSingle();

  return !!waConfig;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const body = await req.json();
    const {
      tenant_id,
      command,
      source = "chat", // 'whatsapp' | 'chat'
      sender_phone,
    } = body;

    if (!tenant_id || !command) {
      return new Response(JSON.stringify({ error: "tenant_id e command richiesti" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Phone verification for WhatsApp source ──
    if (source === "whatsapp" && sender_phone) {
      const isVerified = await verifyPhoneOwnership(supabase, tenant_id, sender_phone);
      if (!isVerified) {
        // Log rejected command
        await supabase.from("command_audit_log").insert({
          tenant_id,
          tenant_type: "unknown",
          resource_id: tenant_id,
          source,
          sender_phone,
          raw_command: command,
          parsed_intent: {},
          actions_executed: [],
          status: "rejected",
          error_message: "Numero di telefono non verificato",
        });

        return new Response(JSON.stringify({
          error: "Numero non autorizzato",
          message_it: "⛔ Questo numero non è autorizzato ad eseguire comandi. Usa il numero registrato nel tuo account Empire.",
        }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ── Resolve tenant resource ──
    const resource = await resolveTenantResource(supabase, tenant_id);
    if (!resource) {
      return new Response(JSON.stringify({ error: "Nessuna attività trovata per questo utente" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Parse command with AI ──
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI non configurata" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
      return new Response(JSON.stringify({ error: "Errore parsing comando" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
      // Log failed parse
      await supabase.from("command_audit_log").insert({
        tenant_id,
        tenant_type: resource.tenantType,
        resource_id: resource.resourceId,
        source,
        sender_phone: sender_phone || null,
        raw_command: command,
        parsed_intent: parsed,
        actions_executed: [],
        status: "failed",
        error_message: parsed.error || "Nessuna azione riconosciuta",
      });

      return new Response(JSON.stringify({
        success: false,
        message_it: parsed.error || "❌ Non sono riuscito a capire il comando. Prova a riformularlo.",
        actions_executed: [],
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Execute actions ──
    const results: Array<{ action: string; success: boolean; detail: string }> = [];

    for (const action of parsed.actions) {
      const result = await executeAction(supabase, action, resource.resourceId, resource.tenantType);
      results.push({ action: action.action, ...result });
    }

    const allSuccess = results.every(r => r.success);
    const summaryParts = results.map(r => `${r.success ? "✅" : "❌"} ${r.detail}`);

    // ── Log to audit ──
    await supabase.from("command_audit_log").insert({
      tenant_id,
      tenant_type: resource.tenantType,
      resource_id: resource.resourceId,
      source,
      sender_phone: sender_phone || null,
      raw_command: command,
      parsed_intent: parsed,
      actions_executed: results,
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
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Command agent error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
