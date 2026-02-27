import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get the user from the auth token
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const admin = createClient(supabaseUrl, serviceKey);

    // Find the partner's demo restaurant
    const { data: restaurant, error: restErr } = await admin
      .from("restaurants")
      .select("id, slug")
      .eq("owner_id", user.id)
      .like("slug", "demo-partner-%")
      .limit(1)
      .maybeSingle();

    if (restErr) throw restErr;
    if (!restaurant) throw new Error("No demo restaurant found");

    const rid = restaurant.id;

    // Delete all related data
    await Promise.all([
      admin.from("orders").delete().eq("restaurant_id", rid),
      admin.from("menu_items").delete().eq("restaurant_id", rid),
      admin.from("restaurant_tables").delete().eq("restaurant_id", rid),
      admin.from("kitchen_access_pins").delete().eq("restaurant_id", rid),
      admin.from("reviews").delete().eq("restaurant_id", rid),
      admin.from("reservations").delete().eq("restaurant_id", rid),
      admin.from("chat_messages").delete().eq("restaurant_id", rid),
      admin.from("customer_activity").delete().eq("restaurant_id", rid),
      admin.from("customer_blacklist").delete().eq("restaurant_id", rid),
      admin.from("wallet_passes").delete().eq("restaurant_id", rid),
    ]);

    // Re-seed menu items
    await admin.from("menu_items").insert([
      { restaurant_id: rid, name: "Bruschetta Classica", description: "Pomodorini freschi, basilico e olio EVO su pane toscano", price: 8, category: "Antipasti", is_active: true, is_popular: true, sort_order: 1 },
      { restaurant_id: rid, name: "Tagliere Misto", description: "Selezione di salumi e formaggi stagionati", price: 16, category: "Antipasti", is_active: true, is_popular: false, sort_order: 2 },
      { restaurant_id: rid, name: "Carpaccio di Manzo", description: "Con rucola, parmigiano e limone", price: 14, category: "Antipasti", is_active: true, is_popular: false, sort_order: 3 },
      { restaurant_id: rid, name: "Spaghetti Carbonara", description: "Guanciale croccante, pecorino romano, tuorlo d'uovo", price: 14, category: "Primi", is_active: true, is_popular: true, sort_order: 4 },
      { restaurant_id: rid, name: "Risotto ai Funghi Porcini", description: "Riso Carnaroli mantecato con porcini freschi", price: 16, category: "Primi", is_active: true, is_popular: false, sort_order: 5 },
      { restaurant_id: rid, name: "Paccheri all'Amatriciana", description: "Sugo di pomodoro San Marzano, guanciale, pecorino", price: 13, category: "Primi", is_active: true, is_popular: false, sort_order: 6 },
      { restaurant_id: rid, name: "Pizza Margherita", description: "Mozzarella di bufala, pomodoro, basilico fresco", price: 12, category: "Pizze", is_active: true, is_popular: true, sort_order: 7 },
      { restaurant_id: rid, name: "Pizza Diavola", description: "Salamino piccante, mozzarella, peperoncino", price: 14, category: "Pizze", is_active: true, is_popular: false, sort_order: 8 },
      { restaurant_id: rid, name: "Pizza Quattro Formaggi", description: "Mozzarella, gorgonzola, fontina, parmigiano", price: 15, category: "Pizze", is_active: true, is_popular: false, sort_order: 9 },
      { restaurant_id: rid, name: "Tagliata di Manzo", description: "Controfiletto alla griglia con rucola e grana", price: 22, category: "Secondi", is_active: true, is_popular: false, sort_order: 10 },
      { restaurant_id: rid, name: "Branzino al Forno", description: "Con patate, olive taggiasche e capperi", price: 20, category: "Secondi", is_active: true, is_popular: false, sort_order: 11 },
      { restaurant_id: rid, name: "Tiramisù", description: "Mascarpone, savoiardi, caffè espresso, cacao", price: 7, category: "Dolci", is_active: true, is_popular: true, sort_order: 12 },
      { restaurant_id: rid, name: "Panna Cotta", description: "Con coulis di frutti di bosco", price: 6, category: "Dolci", is_active: true, is_popular: false, sort_order: 13 },
      { restaurant_id: rid, name: "Espresso", description: "Caffè 100% arabica", price: 2, category: "Bevande", is_active: true, is_popular: false, sort_order: 14 },
      { restaurant_id: rid, name: "Prosecco Valdobbiadene", description: "Calice di bollicine venete", price: 6, category: "Bevande", is_active: true, is_popular: false, sort_order: 15 },
      { restaurant_id: rid, name: "Acqua Minerale", description: "Naturale o frizzante 75cl", price: 3, category: "Bevande", is_active: true, is_popular: false, sort_order: 16 },
    ]);

    // Re-seed tables
    await admin.from("restaurant_tables").insert([
      { restaurant_id: rid, table_number: 1, seats: 2, status: "free", label: "Tavolo 1", pos_x: 15, pos_y: 20 },
      { restaurant_id: rid, table_number: 2, seats: 4, status: "free", label: "Tavolo 2", pos_x: 38, pos_y: 20 },
      { restaurant_id: rid, table_number: 3, seats: 4, status: "occupied", label: "Tavolo 3", pos_x: 62, pos_y: 20 },
      { restaurant_id: rid, table_number: 4, seats: 6, status: "free", label: "Tavolo 4", pos_x: 85, pos_y: 20 },
      { restaurant_id: rid, table_number: 5, seats: 2, status: "occupied", label: "Tavolo 5", pos_x: 15, pos_y: 60 },
      { restaurant_id: rid, table_number: 6, seats: 4, status: "free", label: "Tavolo 6", pos_x: 38, pos_y: 60 },
      { restaurant_id: rid, table_number: 7, seats: 8, status: "free", label: "Tavolo 7", pos_x: 62, pos_y: 60 },
      { restaurant_id: rid, table_number: 8, seats: 4, status: "free", label: "Tavolo 8", pos_x: 85, pos_y: 60 },
    ]);

    // Re-seed orders
    await admin.from("orders").insert([
      { restaurant_id: rid, customer_name: "Marco Rossi", customer_phone: "+39 333 1234567", order_type: "table", table_number: 3, status: "preparing", total: 36, items: [{ name: "Carbonara", qty: 2, price: 14 }, { name: "Bruschetta", qty: 1, price: 8 }], notes: "Senza pepe" },
      { restaurant_id: rid, customer_name: "Laura Bianchi", customer_phone: "+39 334 9876543", order_type: "delivery", status: "pending", total: 38, items: [{ name: "Pizza Margherita", qty: 2, price: 12 }, { name: "Tiramisù", qty: 2, price: 7 }] },
      { restaurant_id: rid, customer_name: "Giovanni Paoli", customer_phone: "+39 335 5551234", order_type: "takeaway", status: "ready", total: 38, items: [{ name: "Risotto ai Funghi", qty: 1, price: 16 }, { name: "Tagliata", qty: 1, price: 22 }], notes: "Extra limone" },
    ]);

    // Re-seed kitchen pin
    await admin.from("kitchen_access_pins").insert([
      { restaurant_id: rid, pin_code: "1234", label: "Cucina Demo", is_active: true },
    ]);

    // Re-seed reviews
    await admin.from("reviews").insert([
      { restaurant_id: rid, rating: 5, customer_name: "Marco R.", comment: "Ottima esperienza! Carbonara perfetta.", is_public: true },
      { restaurant_id: rid, rating: 5, customer_name: "Sara T.", comment: "Servizio impeccabile, tornerò sicuramente.", is_public: true },
      { restaurant_id: rid, rating: 4, customer_name: "Paolo V.", comment: "Buona pizza, ambiente accogliente.", is_public: true },
      { restaurant_id: rid, rating: 2, customer_name: "Anna L.", comment: "Attesa troppo lunga.", is_public: false },
    ]);

    // Re-seed reservations
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    const dayAfter = new Date(Date.now() + 172800000).toISOString().split("T")[0];
    await admin.from("reservations").insert([
      { restaurant_id: rid, customer_name: "Marco Rossi", customer_phone: "+39 333 1234567", reservation_date: today, reservation_time: "20:30", guests: 4, status: "pending" },
      { restaurant_id: rid, customer_name: "Laura Bianchi", customer_phone: "+39 334 9876543", reservation_date: tomorrow, reservation_time: "21:00", guests: 2, status: "pending" },
      { restaurant_id: rid, customer_name: "Giovanni Paoli", customer_phone: "+39 335 5551234", reservation_date: dayAfter, reservation_time: "20:00", guests: 6, status: "confirmed" },
    ]);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
