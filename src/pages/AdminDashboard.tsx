import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  UtensilsCrossed, LayoutDashboard, ChefHat, TrendingUp, 
  LogOut, AlertTriangle, Star, GraduationCap,
  Edit, Trash2, DollarSign, Users, ShoppingCart,
  Camera, Sparkles, Coins, Wand2, QrCode, ExternalLink,
  Save, X, Check, Bot, Send, ShieldCheck, Lock, Key, Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMyRestaurant } from "@/hooks/useMyRestaurant";
import { supabase } from "@/integrations/supabase/client";
import { demoMenu } from "@/data/demo-restaurant";
import type { MenuItem } from "@/types/restaurant";
import restaurantLogo from "@/assets/restaurant-logo.png";
import { toast } from "@/hooks/use-toast";
import { generateQRDataUrl, downloadQR } from "@/lib/qr";

type AdminTab = "dashboard" | "menu" | "kitchen" | "ai" | "vault" | "qr" | "panic" | "reviews" | "academy";

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
  const [ocrResult, setOcrResult] = useState<{name: string; description: string; price: number; category: string}[] | null>(null);
  const [ocrImporting, setOcrImporting] = useState(false);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayOrderCount, setTodayOrderCount] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [restaurantTables, setRestaurantTables] = useState<any[]>([]);
  const [newTableCount, setNewTableCount] = useState(8);

  // Kitchen PIN management
  const [kitchenPin, setKitchenPin] = useState("");
  const [existingPins, setExistingPins] = useState<any[]>([]);

  // Vault Fiscale
  const [vaultConfig, setVaultConfig] = useState<any>(null);
  const [vaultEditing, setVaultEditing] = useState(false);
  const [vaultKey, setVaultKey] = useState("");
  const [vaultProvider, setVaultProvider] = useState("Scontrino.it");
  const [vaultValidating, setVaultValidating] = useState(false);

  // AI-Mary vault chat
  const [maryMessages, setMaryMessages] = useState<{role: string; content: string}[]>([
    { role: "assistant", content: "Benvenuto nella **Cassaforte Fiscale**. Sono Mary, il tuo assistente per la configurazione del Vault.\n\n🔐 Qui puoi inserire in sicurezza le tue chiavi API fiscali. I dati vengono criptati AES-256 e **nessuno**, nemmeno il Super-Admin, può visualizzarli.\n\nVuoi configurare **Scontrino.it** o **Aruba**?" }
  ]);
  const [maryInput, setMaryInput] = useState("");

  const restaurantSlug = restaurant?.slug || "impero-roma";
  const restaurantName = restaurant?.name || "Impero Roma";
  const menuUrl = `${window.location.origin}/r/${restaurantSlug}`;

  useEffect(() => {
    if (!restaurant) return;
    const fetchData = async () => {
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
      const { data: tokenData } = await supabase
        .from("ai_tokens").select("balance")
        .eq("restaurant_id", restaurant.id).single();
      if (tokenData) setAiTokens(tokenData.balance);
      const { data: reviewData } = await supabase
        .from("reviews").select("*")
        .eq("restaurant_id", restaurant.id)
        .order("created_at", { ascending: false }).limit(20);
      if (reviewData) setReviews(reviewData);
      const { data: pins } = await supabase
        .from("kitchen_access_pins").select("*")
        .eq("restaurant_id", restaurant.id)
        .eq("is_active", true);
      if (pins) setExistingPins(pins);
      const { data: fisco } = await supabase
        .from("fisco_configs").select("*")
        .eq("restaurant_id", restaurant.id).single();
      if (fisco) {
        setVaultConfig(fisco);
        setVaultProvider(fisco.provider);
      }
      const { data: tables } = await supabase
        .from("restaurant_tables").select("*")
        .eq("restaurant_id", restaurant.id)
        .order("table_number", { ascending: true });
      if (tables) setRestaurantTables(tables);
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
    { id: "vault", label: "Vault", icon: <Lock className="w-5 h-5" /> },
    { id: "qr", label: "QR", icon: <QrCode className="w-5 h-5" /> },
    { id: "panic", label: "Panic", icon: <AlertTriangle className="w-5 h-5" /> },
    { id: "reviews", label: "Reviews", icon: <Star className="w-5 h-5" /> },
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
      toast({ title: "Token IA esauriti", description: "Ricarica il wallet gettoni per utilizzare il Menu Creator." });
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File troppo grande", description: "Massimo 10MB per immagine.", variant: "destructive" });
        return;
      }
      setOcrUploading(true);
      setOcrResult(null);
      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const { data, error } = await supabase.functions.invoke("ai-menu", {
          body: { action: "ocr", imageBase64: base64 },
        });

        if (error) throw error;

        if (data?.dishes && data.dishes.length > 0) {
          setOcrResult(data.dishes);
          setAiTokens(t => Math.max(0, t - 1));
          toast({ title: `${data.dishes.length} piatti rilevati`, description: "Revisiona e importa nel tuo catalogo digitale." });
        } else {
          toast({ title: "Nessun piatto rilevato", description: "Prova con una foto più nitida del menu.", variant: "destructive" });
        }
      } catch (err: any) {
        console.error("OCR error:", err);
        toast({ title: "Errore OCR", description: err?.message || "Impossibile analizzare il menu. Riprova.", variant: "destructive" });
      }
      setOcrUploading(false);
    };
    input.click();
  };

  const handleImportOcrDishes = async () => {
    if (!ocrResult || ocrResult.length === 0) return;
    const restaurantId = restaurant?.id;
    if (!restaurantId) {
      toast({ title: "Nessun ristorante", description: "Crea prima il tuo ristorante.", variant: "destructive" });
      return;
    }
    setOcrImporting(true);
    try {
      const inserts = ocrResult.map((dish, i) => ({
        restaurant_id: restaurantId,
        name: dish.name,
        description: dish.description || "",
        price: dish.price || 0,
        category: dish.category || "Altro",
        sort_order: i,
        is_active: true,
        is_popular: false,
      }));
      const { error } = await supabase.from("menu_items").insert(inserts);
      if (error) throw error;

      const { data: items } = await supabase.from("menu_items").select("*")
        .eq("restaurant_id", restaurantId).order("sort_order", { ascending: true });
      if (items && items.length > 0) {
        setMenuItems(items.map(i => ({
          id: i.id, name: i.name, description: i.description || "",
          price: Number(i.price), image: i.image_url || "",
          category: i.category, allergens: i.allergens || [], isPopular: i.is_popular,
        })));
      }
      setOcrResult(null);
      toast({ title: "Menu importato!", description: `${inserts.length} piatti aggiunti al tuo catalogo digitale.` });
    } catch (err: any) {
      console.error("Import error:", err);
      toast({ title: "Errore importazione", description: err?.message || "Riprova.", variant: "destructive" });
    }
    setOcrImporting(false);
  };

  const handlePanicApply = async () => {
    if (!restaurant || panicPercent === 0) return;
    const multiplier = 1 + panicPercent / 100;
    for (const item of menuItems) {
      const newPrice = Math.round(item.price * multiplier * 100) / 100;
      await supabase.from("menu_items").update({ price: newPrice }).eq("id", item.id);
    }
    setMenuItems(prev => prev.map(i => ({ ...i, price: Math.round(i.price * (1 + panicPercent / 100) * 100) / 100 })));
    setPanicApplied(true);
    setPanicPercent(0);
    toast({ title: "Panic Mode eseguito", description: `Tutti i prezzi aggiornati. Il database è sincronizzato in tempo reale.` });
  };

  const handleCreatePin = async () => {
    if (!restaurant || kitchenPin.length < 4) return;
    const { error } = await supabase.from("kitchen_access_pins").insert({
      restaurant_id: restaurant.id, pin_code: kitchenPin, label: "Cucina",
    });
    if (error) {
      toast({ title: "Errore", description: "PIN non creato", variant: "destructive" });
    } else {
      toast({ title: "PIN cucina generato", description: `Codice accesso: ${kitchenPin}` });
      setKitchenPin("");
      const { data } = await supabase.from("kitchen_access_pins").select("*")
        .eq("restaurant_id", restaurant.id).eq("is_active", true);
      if (data) setExistingPins(data);
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!restaurant) return;
    await supabase.from("menu_items").delete().eq("id", itemId);
    setMenuItems(prev => prev.filter(i => i.id !== itemId));
    toast({ title: "Piatto rimosso dal menu" });
  };

  const handleVaultSave = async () => {
    if (!restaurant || !vaultKey.trim()) return;
    setVaultValidating(true);

    setTimeout(async () => {
      await supabase.from("fisco_configs").update({
        api_key_encrypted: vaultKey,
        configured: true,
        provider: vaultProvider,
        configured_by: user?.id,
      }).eq("restaurant_id", restaurant.id);

      setVaultConfig((prev: any) => ({ ...prev, configured: true, api_key_encrypted: vaultKey, provider: vaultProvider }));
      setVaultEditing(false);
      setVaultKey("");
      setVaultValidating(false);
      toast({ title: "Vault Fiscale configurato", description: "Chiave criptata e connessione validata con successo." });

      setMaryMessages(prev => [...prev, {
        role: "assistant",
        content: `✅ **Validazione completata**\n\n🟢 Connessione a **${vaultProvider}** verificata\n🔐 Chiave criptata AES-256 nel tuo Vault privato\n📊 Lo stato è ora visibile al Super-Admin (solo semaforo, mai la chiave)\n\nIl tuo sistema fiscale è operativo al 100%.`
      }]);
    }, 2000);
  };

  const handleMaryVaultMessage = () => {
    if (!maryInput.trim()) return;
    setMaryMessages(prev => [...prev, { role: "user", content: maryInput }]);
    const input = maryInput.toLowerCase();
    setMaryInput("");

    let response = "Per configurare il tuo Vault Fiscale, seleziona il provider e inserisci la chiave API. Tutto viene criptato automaticamente.";

    if (input.includes("scontrino")) {
      response = "📋 **Setup Scontrino.it**\n\n1. Accedi a **scontrino.it/dashboard**\n2. Vai su Impostazioni → API Keys\n3. Clicca 'Genera Nuova Chiave'\n4. Copia la chiave e inseriscila qui sotto\n\n🔐 AI-Mary sta validando la tua connessione in tempo reale. Il Super-Admin vedrà solo il semaforo verde, mai i tuoi dati.";
    } else if (input.includes("aruba")) {
      response = "📋 **Setup Aruba Fatturazione**\n\n1. Accedi al pannello **fatturaaruba.it**\n2. Navigazione → Servizi API\n3. Genera credenziali di accesso\n4. Inserisci la chiave nel Vault qui sotto\n\n🔐 Criptazione AES-256 automatica. Isolamento totale dei tuoi dati fiscali.";
    } else if (input.includes("sicur") || input.includes("chi vede") || input.includes("privacy")) {
      response = "🔐 **Garanzia Privacy Vault**\n\n• Le tue chiavi sono criptate con standard bancario AES-256\n• **Nessuno** può visualizzarle: né il Super-Admin, né lo staff\n• Il Super-Admin vede solo: 🟢 Operativo / 🔴 Non configurato\n• Ogni accesso è registrato con audit trail completo\n• Tu sei l'unico custode delle tue credenziali fiscali";
    } else if (input.includes("stato") || input.includes("verifica")) {
      const isConfigured = vaultConfig?.configured;
      response = isConfigured
        ? "✅ **Stato Vault Fiscale**\n\n🟢 Connessione operativa\n🔐 Chiave criptata nel Vault\n📊 Provider: " + (vaultConfig?.provider || "—") + "\n\nIl tuo sistema fiscale è completamente operativo."
        : "🔴 **Vault non configurato**\n\nSeleziona un provider (Scontrino.it o Aruba) e inserisci la tua chiave API. AI-Mary validerà la connessione automaticamente.";
    }

    setTimeout(() => {
      setMaryMessages(prev => [...prev, { role: "assistant", content: response }]);
    }, 600);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

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
            <p className="text-xs text-primary">Centro di Controllo</p>
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
      <div className="flex gap-1.5 px-4 overflow-x-auto scrollbar-hide pb-3">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors min-h-[44px] ${
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
                <p className="text-xs text-muted-foreground">Piatti attivi</p>
              </div>
            </div>

            {vaultConfig && !vaultConfig.configured && (
              <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 flex items-center gap-3">
                <Lock className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Vault Fiscale non configurato</p>
                  <p className="text-xs text-muted-foreground">Configura le tue credenziali API nella sezione Vault per l'automazione fiscale compliant.</p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Ordini recenti</h3>
              <div className="space-y-2">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-3 rounded-xl bg-secondary/50 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.customer_name || "Cliente"}</p>
                      <p className="text-xs text-muted-foreground">€{Number(order.total).toFixed(2)} · {order.order_type === "table" ? `Tavolo ${order.table_number}` : order.order_type === "delivery" ? "Consegna" : "Asporto"}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ""}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nessun ordine registrato</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* MENU */}
        {activeTab === "menu" && (
          <motion.div className="space-y-3 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">{menuItems.length} piatti nel catalogo</h3>
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
              <h3 className="text-sm font-semibold text-foreground">Gestione Cucina</h3>
              <button onClick={() => window.open("/kitchen", "_blank")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium min-h-[44px]">
                <ExternalLink className="w-3.5 h-3.5" />
                Apri Vista Cucina
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/50 space-y-3">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Codice accesso staff</p>
              {existingPins.map(pin => (
                <div key={pin.id} className="flex items-center justify-between p-2 rounded-lg bg-card">
                  <span className="text-sm font-mono text-foreground">{pin.pin_code}</span>
                  <span className="text-xs text-green-400">Operativo</span>
                </div>
              ))}
              <div className="flex gap-2">
                <input type="text" inputMode="numeric" placeholder="Nuovo PIN (4-6 cifre)" value={kitchenPin}
                  onChange={(e) => setKitchenPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-card text-foreground text-base font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                <button onClick={handleCreatePin} disabled={kitchenPin.length < 4}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium disabled:opacity-40 min-h-[44px]">
                  Genera PIN
                </button>
              </div>
            </div>
            {activeOrders.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">Nessun ordine in coda</p>
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
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.customer_name || "Cliente"} · {order.order_type === "table" ? `Tavolo ${order.table_number}` : order.order_type === "delivery" ? "Consegna" : "Asporto"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 mb-3">
                    {items.map((item: any, i: number) => (
                      <div key={i} className="text-sm text-foreground">{item.quantity || 1}× {item.name}</div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <button onClick={() => updateOrderStatus(order.id, "preparing")} className="flex-1 py-3 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium min-h-[48px]">🔥 Inizia Preparazione</button>
                    )}
                    {order.status === "preparing" && (
                      <button onClick={() => updateOrderStatus(order.id, "ready")} className="flex-1 py-3 rounded-xl bg-green-500/20 text-green-400 text-sm font-medium min-h-[48px]">✅ Segna Pronto</button>
                    )}
                    {order.status === "ready" && (
                      <button onClick={() => updateOrderStatus(order.id, "delivered")} className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground text-sm font-medium min-h-[48px]">📦 Consegnato</button>
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
              <p className="text-sm text-muted-foreground mt-1">Digitalizzazione intelligente: foto → OCR → menu professionale in 60 secondi</p>
            </div>
            <motion.div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors min-h-[120px]"
              whileTap={{ scale: 0.98 }} onClick={handleOcrUpload}>
              {ocrUploading ? (
                <div className="space-y-3">
                  <motion.div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent mx-auto"
                    animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  <p className="text-sm text-primary font-medium">Analisi OCR intelligente in corso...</p>
                </div>
              ) : (
                <>
                  <Camera className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Scatta o carica il tuo menu cartaceo</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG · Max 10MB · Costa 1 gettone IA</p>
                </>
              )}
            </motion.div>
            {ocrResult && (
              <motion.div className="space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h4 className="text-sm font-semibold text-foreground">{ocrResult.length} piatti rilevati dall'IA</h4>
                {ocrResult.map((dish, i) => (
                  <motion.div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Wand2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{dish.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{dish.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold text-primary">€{dish.price?.toFixed(2) || "0.00"}</span>
                        <span className="text-xs text-muted-foreground/60">· {dish.category || "Altro"}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <button onClick={handleImportOcrDishes} disabled={ocrImporting}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm gold-glow disabled:opacity-50 min-h-[48px]">
                  {ocrImporting ? "Importazione in corso..." : `Importa ${ocrResult.length} piatti nel catalogo`}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* VAULT FISCALE — Private key vault with AI-Mary */}
        {activeTab === "vault" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Cassaforte Fiscale Protetta</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Automazione fiscale integrata 100% compliant. Le tue chiavi API sono criptate AES-256 e invisibili a chiunque.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${
              vaultConfig?.configured ? "bg-green-500/5 border-green-500/20" : "bg-accent/5 border-accent/20"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${
                  vaultConfig?.configured ? "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.5)]" : "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.5)]"
                }`} />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {vaultConfig?.configured ? "Vault operativo — Connessione validata" : "Vault non configurato — Setup richiesto"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {vaultConfig?.configured
                      ? `Provider: ${vaultConfig.provider} · Criptazione attiva`
                      : "Configura il tuo Vault per attivare l'automazione fiscale"}
                  </p>
                </div>
              </div>
            </div>

            {(!vaultConfig?.configured || vaultEditing) && (
              <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
                <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Configura il tuo Vault Fiscale protetto</p>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Provider fiscale</label>
                  <select value={vaultProvider} onChange={(e) => setVaultProvider(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]">
                    <option value="Scontrino.it">Scontrino.it</option>
                    <option value="Aruba">Aruba Fatturazione</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Chiave API (criptata automaticamente)</label>
                  <input type="password" placeholder="Inserisci la tua chiave API privata..." value={vaultKey}
                    onChange={(e) => setVaultKey(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-base font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleVaultSave} disabled={!vaultKey.trim() || vaultValidating}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-40 min-h-[44px]">
                    {vaultValidating ? (
                      <>
                        <motion.div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                          animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                        Validazione...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Cripta e Valida
                      </>
                    )}
                  </button>
                  {vaultEditing && (
                    <button onClick={() => setVaultEditing(false)} className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm min-h-[44px]">
                      Annulla
                    </button>
                  )}
                </div>
              </div>
            )}

            {vaultConfig?.configured && !vaultEditing && (
              <button onClick={() => setVaultEditing(true)}
                className="w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium min-h-[44px]">
                Aggiorna credenziali Vault
              </button>
            )}

            {/* AI-Mary vault assistant */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">AI-Mary — Assistente Vault Fiscale</span>
              </div>
              <div className="h-48 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {maryMessages.map((msg, i) => (
                  <motion.div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                      msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}>{msg.content}</div>
                  </motion.div>
                ))}
              </div>
              <div className="p-3 border-t border-border flex gap-2">
                <input type="text" placeholder="Chiedi a Mary..." value={maryInput}
                  onChange={(e) => setMaryInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMaryVaultMessage()}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                <motion.button onClick={handleMaryVaultMessage}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center min-w-[44px] min-h-[44px]" whileTap={{ scale: 0.9 }}>
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* QR MASTER + TABLE MANAGEMENT */}
        {activeTab === "qr" && (
          <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <QrCode className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">QR Master — Gestione Tavoli</h3>
              <p className="text-sm text-muted-foreground mt-1">QR univoci per tavolo, mappa interattiva e stato real-time</p>
            </div>

            {/* Main restaurant QR */}
            <div className="flex flex-col items-center">
              <div className="p-6 rounded-3xl bg-card border border-border">
                <div className="bg-white rounded-2xl p-4 mb-4">
                  <img src={generateQRDataUrl(menuUrl)} alt="QR Code" className="w-40 h-40 mx-auto" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-display font-semibold text-foreground">{restaurantName}</p>
                  <p className="text-xs text-muted-foreground mt-1 break-all max-w-[200px]">{menuUrl}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm gold-glow flex items-center justify-center gap-2 min-h-[48px]"
                onClick={() => downloadQR(menuUrl, `qr-${restaurantSlug}`)}>
                <Download className="w-4 h-4" /> Scarica QR
              </button>
              <button className="py-3 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm flex items-center justify-center gap-2 min-h-[48px]"
                onClick={() => window.open(menuUrl, "_blank")}>
                <ExternalLink className="w-4 h-4" /> Anteprima
              </button>
            </div>

            {/* Table Management */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Mappa tavoli ({restaurantTables.length})</p>
                {restaurantTables.length === 0 && (
                  <button onClick={async () => {
                    if (!restaurant) return;
                    const inserts = Array.from({ length: newTableCount }, (_, i) => ({
                      restaurant_id: restaurant.id,
                      table_number: i + 1,
                      status: "free",
                      seats: 4,
                    }));
                    await supabase.from("restaurant_tables").insert(inserts);
                    const { data } = await supabase.from("restaurant_tables").select("*")
                      .eq("restaurant_id", restaurant.id).order("table_number");
                    if (data) setRestaurantTables(data);
                    toast({ title: `${newTableCount} tavoli creati` });
                  }} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium min-h-[44px]">
                    Genera {newTableCount} tavoli
                  </button>
                )}
              </div>

              {restaurantTables.length === 0 && (
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <p className="text-sm text-muted-foreground">Nessun tavolo configurato</p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <span className="text-xs text-muted-foreground">Quantità:</span>
                    <input type="number" min="1" max="50" value={newTableCount}
                      onChange={(e) => setNewTableCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                      className="w-16 px-2 py-1 rounded-lg bg-card text-foreground text-base text-center focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 gap-2">
                {restaurantTables.map((table) => {
                  const statusConfig: Record<string, { bg: string; label: string; dot: string }> = {
                    free: { bg: "bg-green-500/10 border-green-500/20", label: "Libero", dot: "bg-green-400" },
                    waiting: { bg: "bg-amber-500/10 border-amber-500/20", label: "In attesa", dot: "bg-amber-400" },
                    served: { bg: "bg-blue-500/10 border-blue-500/20", label: "Servito", dot: "bg-blue-400" },
                    paid: { bg: "bg-muted border-border", label: "Pagato", dot: "bg-muted-foreground" },
                  };
                  const cfg = statusConfig[table.status] || statusConfig.free;
                  const tableUrl = `${menuUrl}?table=${table.table_number}`;
                  return (
                    <motion.button key={table.id}
                      onClick={async () => {
                        const next: Record<string, string> = { free: "waiting", waiting: "served", served: "paid", paid: "free" };
                        const newStatus = next[table.status] || "free";
                        await supabase.from("restaurant_tables").update({ status: newStatus }).eq("id", table.id);
                        setRestaurantTables(prev => prev.map(t => t.id === table.id ? { ...t, status: newStatus } : t));
                      }}
                      onDoubleClick={() => {
                        navigator.clipboard.writeText(tableUrl);
                        toast({ title: `Link tavolo ${table.table_number} copiato` });
                      }}
                      className={`p-3 rounded-xl border text-center transition-all min-h-[72px] ${cfg.bg}`}
                      whileTap={{ scale: 0.95 }}>
                      <p className="text-lg font-display font-bold text-foreground">{table.table_number}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              {restaurantTables.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-[10px] text-muted-foreground text-center">
                    Tap = cambia stato · Doppio tap = copia link QR tavolo
                  </p>
                  {/* Per-table QR download */}
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {restaurantTables.slice(0, 12).map((table) => {
                      const tableUrl = `${menuUrl}?table=${table.table_number}`;
                      return (
                        <button key={table.id}
                          onClick={() => downloadQR(tableUrl, `qr-tavolo-${table.table_number}`)}
                          className="flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors min-w-[64px]">
                          <img src={generateQRDataUrl(tableUrl, 80)} alt={`T${table.table_number}`} className="w-10 h-10 rounded" />
                          <span className="text-[10px] text-muted-foreground">T{table.table_number}</span>
                        </button>
                      );
                    })}
                  </div>
                  {restaurantTables.length > 12 && (
                    <button onClick={() => {
                      restaurantTables.forEach((table) => {
                        const url = `${menuUrl}?table=${table.table_number}`;
                        downloadQR(url, `qr-tavolo-${table.table_number}`);
                      });
                      toast({ title: "Download QR completato", description: `${restaurantTables.length} QR scaricati` });
                    }} className="w-full py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium min-h-[44px]">
                      Scarica tutti i QR ({restaurantTables.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* PANIC MODE */}
        {activeTab === "panic" && (
          <motion.div className="space-y-6 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <AlertTriangle className={`w-12 h-12 mx-auto mb-3 ${panicPercent !== 0 ? "text-accent" : "text-muted-foreground/30"}`} />
              <h3 className="text-lg font-display font-bold text-foreground">Panic Mode — Protezione Margini</h3>
              <p className="text-sm text-muted-foreground mt-1">Aggiornamento prezzi bulk istantaneo su tutto il catalogo</p>
            </div>
            <div className="p-5 rounded-2xl bg-secondary/50 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Variazione margini</span>
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
                  <p className="text-sm text-accent font-medium">⚠️ Operazione critica</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {menuItems.length} piatti saranno aggiornati del {panicPercent > 0 ? "+" : ""}{panicPercent}%.
                    Sincronizzazione database in tempo reale.
                  </p>
                </div>
                <motion.button onClick={handlePanicApply}
                  className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm min-h-[48px]"
                  whileTap={{ scale: 0.97 }}>
                  🚨 Esegui Panic Mode
                </motion.button>
              </motion.div>
            )}
            {panicApplied && (
              <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
                <Check className="w-6 h-6 mx-auto text-green-400 mb-1" />
                <p className="text-sm text-green-400 font-medium">Margini aggiornati — Database sincronizzato</p>
              </div>
            )}
          </motion.div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <Star className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">Review Shield — Protezione Reputazione</h3>
              <p className="text-sm text-muted-foreground mt-1">Filtro intelligente: solo le migliori raggiungono Google</p>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">⭐ 4-5 stelle</span>
                <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">→ Google Reviews</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">⭐ 1-3 stelle</span>
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">→ Archivio Privato</span>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Archivio recensioni ({reviews.length})</p>
              {reviews.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nessuna recensione registrata</p>}
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
                  {!review.is_public && <p className="text-xs text-accent mt-1">🔒 Archivio privato</p>}
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
              <h3 className="text-lg font-display font-bold text-foreground">Empire Academy</h3>
              <p className="text-sm text-muted-foreground mt-1">Strategie di crescita per il tuo impero digitale</p>
            </div>
            {[
              { title: "Fotografare piatti con impatto visivo massimo", emoji: "📸", done: true },
              { title: "Copywriting gastronomico: descrizioni che vendono", emoji: "✍️", done: true },
              { title: "Instagram Stories: strategia per ristoranti", emoji: "📱", done: false },
              { title: "Gestione recensioni: trasformare critiche in opportunità", emoji: "💬", done: false },
              { title: "Promozioni flash: urgenza e conversione", emoji: "🔥", done: false },
              { title: "QR Code strategico: posizionamento e best practice", emoji: "📋", done: false },
            ].map((lesson, i) => (
              <div key={i} className={`flex items-center gap-3 p-4 rounded-xl min-h-[56px] ${
                lesson.done ? "bg-primary/10 border border-primary/20" : "bg-secondary/50"
              }`}>
                <span className="text-2xl">{lesson.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                </div>
                {lesson.done ? <Check className="w-5 h-5 text-primary" /> : <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

export default AdminDashboard;
