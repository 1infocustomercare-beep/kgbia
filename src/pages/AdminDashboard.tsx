import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  UtensilsCrossed, LayoutDashboard, ChefHat, TrendingUp, 
  LogOut, AlertTriangle, Star, GraduationCap,
  Plus, Edit, Trash2, DollarSign, Users, ShoppingCart,
  Camera, Sparkles, Coins, Wand2, QrCode, ExternalLink,
  Save, X, Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMyRestaurant } from "@/hooks/useMyRestaurant";
import { supabase } from "@/integrations/supabase/client";
import { demoMenu, menuCategories } from "@/data/demo-restaurant";
import type { MenuItem } from "@/types/restaurant";
import restaurantLogo from "@/assets/restaurant-logo.png";
import { toast } from "@/hooks/use-toast";

type AdminTab = "dashboard" | "menu" | "kitchen" | "ai" | "tokens" | "qr" | "panic" | "reviews" | "academy";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { restaurant, loading: restLoading } = useMyRestaurant();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [panicPercent, setPanicPercent] = useState(0);
  const [panicApplied, setPanicApplied] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(demoMenu);
  const [orders, setOrders] = useState<any[]>([]);
  const [aiTokens, setAiTokens] = useState(5);
  const [ocrUploading, setOcrUploading] = useState(false);
  const [ocrResult, setOcrResult] = useState<string[] | null>(null);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayOrderCount, setTodayOrderCount] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", description: "", category: "" });

  // Kitchen PIN management
  const [kitchenPin, setKitchenPin] = useState("");
  const [existingPins, setExistingPins] = useState<any[]>([]);

  const restaurantSlug = restaurant?.slug || "impero-roma";
  const restaurantName = restaurant?.name || "Impero Roma";
  const menuUrl = `${window.location.origin}/r/${restaurantSlug}`;

  useEffect(() => {
    if (!restaurant) return;
    const fetchData = async () => {
      // Fetch menu items
      const { data: items } = await supabase
        .from("menu_items").select("*")
        .eq("restaurant_id", restaurant.id)
        .order("sort_order", { ascending: true });
      if (items && items.length > 0) {
        setMenuItems(items.map(i => ({
          id: i.id, name: i.name, description: i.description || "",
          price: Number(i.price), image: i.image_url || "",
          category: i.category, allergens: i.allergens || [], isPopular: i.is_popular,
        })));
      }
      // Fetch orders
      const { data: ordersData } = await supabase
        .from("orders").select("*")
        .eq("restaurant_id", restaurant.id)
        .order("created_at", { ascending: false }).limit(50);
      if (ordersData) {
        setOrders(ordersData);
        const today = new Date().toISOString().split("T")[0];
        const todayOrders = ordersData.filter(o => o.created_at.startsWith(today));
        setTodayRevenue(todayOrders.reduce((s, o) => s + Number(o.total), 0));
        setTodayOrderCount(todayOrders.length);
      }
      // Fetch AI tokens
      const { data: tokenData } = await supabase
        .from("ai_tokens").select("balance")
        .eq("restaurant_id", restaurant.id).single();
      if (tokenData) setAiTokens(tokenData.balance);
      // Fetch reviews
      const { data: reviewData } = await supabase
        .from("reviews").select("*")
        .eq("restaurant_id", restaurant.id)
        .order("created_at", { ascending: false }).limit(20);
      if (reviewData) setReviews(reviewData);
      // Fetch kitchen pins
      const { data: pins } = await supabase
        .from("kitchen_access_pins").select("*")
        .eq("restaurant_id", restaurant.id)
        .eq("is_active", true);
      if (pins) setExistingPins(pins);
    };
    fetchData();

    const channel = supabase.channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurant.id}` }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [restaurant]);

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "menu", label: "Menu", icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: "kitchen", label: "Cucina", icon: <ChefHat className="w-5 h-5" /> },
    { id: "ai", label: "IA Menu", icon: <Sparkles className="w-5 h-5" /> },
    { id: "tokens", label: "Token", icon: <Coins className="w-5 h-5" /> },
    { id: "qr", label: "QR Code", icon: <QrCode className="w-5 h-5" /> },
    { id: "panic", label: "Panic", icon: <AlertTriangle className="w-5 h-5" /> },
    { id: "reviews", label: "Recensioni", icon: <Star className="w-5 h-5" /> },
    { id: "academy", label: "Academy", icon: <GraduationCap className="w-5 h-5" /> },
  ];

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/20 text-amber-400",
    preparing: "bg-blue-500/20 text-blue-400",
    ready: "bg-green-500/20 text-green-400",
    delivered: "bg-muted text-muted-foreground",
  };
  const statusLabels: Record<string, string> = {
    pending: "In attesa", preparing: "In preparazione", ready: "Pronto", delivered: "Consegnato",
  };

  const handleOcrUpload = () => {
    if (aiTokens <= 0) {
      toast({ title: "Token esauriti", description: "Ricarica i token IA per usare questa funzione." });
      return;
    }
    setOcrUploading(true);
    setTimeout(() => {
      setOcrResult([
        "Bruschetta al Pomodoro - €7.00",
        "Spaghetti alla Carbonara - €12.00",
        "Pizza Napoli - €10.00",
        "Insalata Mista - €6.50",
        "Dolce del Giorno - €5.00",
      ]);
      setAiTokens(t => t - 1);
      setOcrUploading(false);
    }, 2000);
  };

  const handlePanicApply = async () => {
    if (!restaurant || panicPercent === 0) return;
    const multiplier = 1 + panicPercent / 100;
    // Update all menu items prices in DB
    for (const item of menuItems) {
      const newPrice = Math.round(item.price * multiplier * 100) / 100;
      await supabase.from("menu_items").update({ price: newPrice }).eq("id", item.id);
    }
    setMenuItems(prev => prev.map(i => ({ ...i, price: Math.round(i.price * multiplier * 100) / 100 })));
    setPanicApplied(true);
    setPanicPercent(0);
    toast({ title: "Panic Mode applicato!", description: `Tutti i prezzi aggiornati del ${panicPercent > 0 ? "+" : ""}${panicPercent}%` });
  };

  const handleCreatePin = async () => {
    if (!restaurant || kitchenPin.length < 4) return;
    const { error } = await supabase.from("kitchen_access_pins").insert({
      restaurant_id: restaurant.id,
      pin_code: kitchenPin,
      label: "Cucina",
    });
    if (error) {
      toast({ title: "Errore", description: "PIN non creato", variant: "destructive" });
    } else {
      toast({ title: "PIN cucina creato!", description: `PIN: ${kitchenPin}` });
      setKitchenPin("");
      // Refresh pins
      const { data } = await supabase.from("kitchen_access_pins").select("*")
        .eq("restaurant_id", restaurant.id).eq("is_active", true);
      if (data) setExistingPins(data);
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!restaurant) return;
    await supabase.from("menu_items").delete().eq("id", itemId);
    setMenuItems(prev => prev.filter(i => i.id !== itemId));
    toast({ title: "Piatto eliminato" });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  const qrSvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="white" rx="16"/><rect x="20" y="20" width="60" height="60" rx="4" fill="#1a1a1a"/><rect x="28" y="28" width="44" height="44" rx="2" fill="white"/><rect x="36" y="36" width="28" height="28" rx="2" fill="#1a1a1a"/><rect x="120" y="20" width="60" height="60" rx="4" fill="#1a1a1a"/><rect x="128" y="28" width="44" height="44" rx="2" fill="white"/><rect x="136" y="36" width="28" height="28" rx="2" fill="#1a1a1a"/><rect x="20" y="120" width="60" height="60" rx="4" fill="#1a1a1a"/><rect x="28" y="128" width="44" height="44" rx="2" fill="white"/><rect x="36" y="136" width="28" height="28" rx="2" fill="#1a1a1a"/><rect x="90" y="90" width="20" height="20" fill="#1a1a1a"/><rect x="120" y="120" width="16" height="16" fill="#1a1a1a"/><rect x="144" y="120" width="16" height="16" fill="#1a1a1a"/><rect x="120" y="144" width="16" height="16" fill="#1a1a1a"/><rect x="144" y="144" width="16" height="16" fill="#1a1a1a"/><rect x="168" y="144" width="12" height="12" fill="#1a1a1a"/><rect x="120" y="168" width="60" height="12" rx="2" fill="#1a1a1a"/></svg>`)}`;

  const activeOrders = orders.filter(o => ["pending", "preparing", "ready"].includes(o.status));
  const allCategories = [...new Set(menuItems.map(i => i.category))];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <img src={restaurant?.logo_url || restaurantLogo} alt="" className="w-9 h-9 rounded-lg object-contain" />
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">{restaurantName}</h1>
            <p className="text-xs text-primary">Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-lg">
            <Coins className="w-3 h-3 inline mr-1" />{aiTokens} token
          </span>
          <button onClick={handleLogout} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-5 overflow-x-auto scrollbar-hide pb-3">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
            }`}>
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-8 overflow-y-auto">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-secondary/50">
                <DollarSign className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">€{todayRevenue.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Incasso oggi</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50">
                <ShoppingCart className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{todayOrderCount}</p>
                <p className="text-xs text-muted-foreground">Ordini oggi</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50">
                <Users className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{orders.length}</p>
                <p className="text-xs text-muted-foreground">Ordini totali</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50">
                <TrendingUp className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{menuItems.length}</p>
                <p className="text-xs text-muted-foreground">Piatti in menu</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Ordini recenti</h3>
              <div className="space-y-2">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-3 rounded-xl bg-secondary/50 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.customer_name || "Cliente"}</p>
                      <p className="text-xs text-muted-foreground">€{Number(order.total).toFixed(2)} · {order.order_type}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ""}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nessun ordine ancora</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* MENU */}
        {activeTab === "menu" && (
          <motion.div className="space-y-3 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">{menuItems.length} piatti</h3>
            </div>
            {allCategories.map((cat) => {
              const catItems = menuItems.filter(i => i.category === cat);
              if (catItems.length === 0) return null;
              return (
                <div key={cat}>
                  <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2">{cat}</p>
                  <div className="space-y-2">
                    {catItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                        {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-primary font-display font-semibold text-sm">€{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-1">
                          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <button onClick={() => handleDeleteMenuItem(item.id)} className="p-2 rounded-lg hover:bg-accent/20 transition-colors">
                            <Trash2 className="w-3.5 h-3.5 text-accent" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* KITCHEN */}
        {activeTab === "kitchen" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Kitchen View</h3>
              <button onClick={() => window.open("/kitchen", "_blank")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium">
                <ExternalLink className="w-3.5 h-3.5" />
                Attiva Schermo Cucina
              </button>
            </div>

            {/* PIN Management */}
            <div className="p-4 rounded-2xl bg-secondary/50 space-y-3">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">PIN accesso cucina</p>
              {existingPins.map(pin => (
                <div key={pin.id} className="flex items-center justify-between p-2 rounded-lg bg-card">
                  <span className="text-sm font-mono text-foreground">{pin.pin_code}</span>
                  <span className="text-xs text-green-400">Attivo</span>
                </div>
              ))}
              <div className="flex gap-2">
                <input type="text" inputMode="numeric" placeholder="Nuovo PIN (4-6 cifre)" value={kitchenPin}
                  onChange={(e) => setKitchenPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="flex-1 px-3 py-2 rounded-xl bg-card text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button onClick={handleCreatePin} disabled={kitchenPin.length < 4}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium disabled:opacity-40">
                  Crea PIN
                </button>
              </div>
            </div>

            {/* Active orders */}
            {activeOrders.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">Nessun ordine attivo</p>
              </div>
            )}
            {activeOrders.map((order) => {
              const items = Array.isArray(order.items) ? order.items : [];
              return (
                <div key={order.id} className={`p-4 rounded-2xl border ${
                  order.status === "pending" ? "border-amber-500/30 bg-amber-500/5" :
                  order.status === "preparing" ? "border-blue-500/30 bg-blue-500/5" :
                  "border-green-500/30 bg-green-500/5"
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-display font-bold text-foreground">#{order.id.slice(0, 8)}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || ""}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.customer_name || "Cliente"}</p>
                    </div>
                  </div>
                  <div className="space-y-1 mb-3">
                    {items.map((item: any, i: number) => (
                      <div key={i} className="text-sm text-foreground">{item.quantity || 1}× {item.name}</div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <button onClick={() => updateOrderStatus(order.id, "preparing")} className="flex-1 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium">Inizia Preparazione</button>
                    )}
                    {order.status === "preparing" && (
                      <button onClick={() => updateOrderStatus(order.id, "ready")} className="flex-1 py-2 rounded-xl bg-green-500/20 text-green-400 text-sm font-medium">Segna come Pronto</button>
                    )}
                    {order.status === "ready" && (
                      <button onClick={() => updateOrderStatus(order.id, "delivered")} className="flex-1 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium">Consegnato</button>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* AI MENU CREATOR */}
        {activeTab === "ai" && (
          <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">AI Menu Creator</h3>
              <p className="text-sm text-muted-foreground mt-1">Carica una foto del menu cartaceo → l'IA estrae testi e crea foto food-porn</p>
            </div>
            <motion.div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              whileTap={{ scale: 0.98 }} onClick={handleOcrUpload}>
              {ocrUploading ? (
                <div className="space-y-3">
                  <motion.div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent mx-auto"
                    animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  <p className="text-sm text-primary font-medium">Analisi OCR in corso...</p>
                </div>
              ) : (
                <>
                  <Camera className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Scatta o carica foto del menu</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG · Max 10MB · Costa 1 token IA</p>
                </>
              )}
            </motion.div>
            {ocrResult && (
              <motion.div className="space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h4 className="text-sm font-semibold text-foreground">{ocrResult.length} piatti rilevati</h4>
                {ocrResult.map((dish, i) => (
                  <motion.div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Wand2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{dish}</p>
                      <p className="text-xs text-primary">Foto IA generabile</p>
                    </div>
                  </motion.div>
                ))}
                <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm gold-glow">
                  Importa tutti nel menu
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* TOKEN WALLET */}
        {activeTab === "tokens" && (
          <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <Coins className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">Wallet Gettoni IA</h3>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-card to-primary/5 border border-primary/20 text-center">
              <p className="text-5xl font-display font-bold text-gold-gradient">{aiTokens}</p>
              <p className="text-sm text-muted-foreground mt-1">gettoni disponibili</p>
            </div>
            <div className="space-y-2">
              {[
                { tokens: 10, price: 15 },
                { tokens: 25, price: 30 },
                { tokens: 50, price: 50 },
              ].map((pack) => (
                <button key={pack.tokens} className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                  <span className="text-sm font-semibold text-foreground">{pack.tokens} gettoni</span>
                  <span className="text-lg font-display font-bold text-foreground">€{pack.price}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* QR CODE */}
        {activeTab === "qr" && (
          <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <QrCode className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">QR Code del Locale</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-6 rounded-3xl bg-card border border-border">
                <div className="bg-white rounded-2xl p-4 mb-4">
                  <img src={qrSvg} alt="QR Code" className="w-48 h-48 mx-auto" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-display font-semibold text-foreground">{restaurantName}</p>
                  <p className="text-xs text-muted-foreground mt-1 break-all">{menuUrl}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm gold-glow flex items-center justify-center gap-2"
                onClick={() => { const link = document.createElement("a"); link.href = qrSvg; link.download = `qr-${restaurantSlug}.svg`; link.click(); }}>
                <QrCode className="w-4 h-4" /> Scarica QR Code
              </button>
              <button className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm flex items-center justify-center gap-2"
                onClick={() => window.open(menuUrl, "_blank")}>
                <ExternalLink className="w-4 h-4" /> Anteprima Mobile
              </button>
            </div>
            <div>
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-3">QR per tavolo</p>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((table) => (
                  <div key={table} className="p-2 rounded-xl bg-secondary/50 text-center">
                    <p className="text-lg font-display font-bold text-foreground">{table}</p>
                    <p className="text-[10px] text-muted-foreground">Tavolo</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PANIC MODE — Connected to DB */}
        {activeTab === "panic" && (
          <motion.div className="space-y-6 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <AlertTriangle className={`w-12 h-12 mx-auto mb-3 ${panicPercent !== 0 ? "text-accent" : "text-muted-foreground/30"}`} />
              <h3 className="text-lg font-display font-bold text-foreground">Panic Mode</h3>
              <p className="text-sm text-muted-foreground mt-1">Modifica tutti i prezzi del menu istantaneamente</p>
            </div>
            <div className="p-5 rounded-2xl bg-secondary/50 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Variazione prezzi</span>
                <span className={`text-2xl font-display font-bold ${
                  panicPercent > 0 ? "text-green-400" : panicPercent < 0 ? "text-accent" : "text-muted-foreground"
                }`}>
                  {panicPercent > 0 ? "+" : ""}{panicPercent}%
                </span>
              </div>
              <input type="range" min="-50" max="50" step="5" value={panicPercent}
                onChange={(e) => setPanicPercent(Number(e.target.value))}
                className="w-full accent-primary h-2 rounded-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>-50%</span><span>0%</span><span>+50%</span>
              </div>
            </div>
            {panicPercent !== 0 && (
              <motion.div className="space-y-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="p-4 rounded-2xl border border-accent/30 bg-accent/5">
                  <p className="text-sm text-accent font-medium">⚠️ Attenzione</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tutti i {menuItems.length} piatti saranno modificati del {panicPercent > 0 ? "+" : ""}{panicPercent}%.
                    Questa azione aggiorna il database in tempo reale.
                  </p>
                </div>
                <motion.button onClick={handlePanicApply}
                  className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm"
                  whileTap={{ scale: 0.97 }}>
                  🚨 Applica Panic Mode al Database
                </motion.button>
              </motion.div>
            )}
            {panicApplied && (
              <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
                <Check className="w-6 h-6 mx-auto text-green-400 mb-1" />
                <p className="text-sm text-green-400 font-medium">Prezzi aggiornati con successo!</p>
              </div>
            )}
          </motion.div>
        )}

        {/* REVIEWS — Connected to DB */}
        {activeTab === "reviews" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <Star className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">Review Shield</h3>
              <p className="text-sm text-muted-foreground mt-1">Solo 4-5★ vanno su Google</p>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">⭐ 4-5 stelle</span>
                <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">→ Google Reviews</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">⭐ 1-3 stelle</span>
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">→ Private</span>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Recensioni ({reviews.length})</p>
              {reviews.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nessuna recensione</p>}
              {reviews.map((review) => (
                <div key={review.id} className={`p-3 rounded-xl ${review.is_public ? "bg-secondary/50" : "bg-accent/5 border border-accent/20"}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{review.customer_name || "Anonimo"}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < review.rating ? "text-primary fill-primary" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{review.comment || "—"}</p>
                  {!review.is_public && <p className="text-xs text-accent mt-1">🔒 Privata</p>}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ACADEMY */}
        {activeTab === "academy" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">Academy</h3>
              <p className="text-sm text-muted-foreground mt-1">Tutorial per il tuo marketing</p>
            </div>
            {[
              { title: "Come scattare foto 'food-porn'", emoji: "📸", done: true },
              { title: "Scrivere descrizioni irresistibili", emoji: "✍️", done: true },
              { title: "Instagram Stories per ristoranti", emoji: "📱", done: false },
              { title: "Rispondere alle recensioni negative", emoji: "💬", done: false },
              { title: "Promozioni last-minute efficaci", emoji: "🔥", done: false },
              { title: "QR Code sul tavolo: best practice", emoji: "📋", done: false },
            ].map((lesson, i) => (
              <div key={i} className={`flex items-center gap-3 p-4 rounded-xl ${
                lesson.done ? "bg-primary/10 border border-primary/20" : "bg-secondary/50"
              }`}>
                <span className="text-2xl">{lesson.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                </div>
                {lesson.done ? <Check className="w-5 h-5 text-primary" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Missing icon import
const ChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

export default AdminDashboard;
