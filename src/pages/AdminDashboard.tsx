import { useState, useEffect, useCallback } from "react";


import BackButton from "@/components/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, UtensilsCrossed, ShoppingCart, TrendingUp, LogOut, Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMyRestaurant } from "@/hooks/useMyRestaurant";
import { supabase } from "@/integrations/supabase/client";
import { demoMenu } from "@/data/demo-restaurant";
import type { MenuItem } from "@/types/restaurant";
import restaurantLogo from "@/assets/restaurant-logo.png";
import { toast } from "@/hooks/use-toast";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { extractDominantColor, hslToHex, applyBrandTheme, resetBrandTheme } from "@/lib/color-extract";
import { BUSINESS_TYPE_OPTIONS, getBusinessTypeConfig, normalizeBusinessType, type BusinessType } from "@/lib/business-type";

import DashboardOverview from "@/components/admin/DashboardOverview";
import StudioTab from "@/components/admin/StudioTab";
import OrdersTab from "@/components/admin/OrdersTab";
import ProfitTab from "@/components/admin/ProfitTab";
import MoreMenu from "@/components/admin/MoreMenu";
import EmpireAssistant from "@/components/admin/EmpireAssistant";
import { GuidesToggle } from "@/components/ui/info-guide";
import PageGuide from "@/components/ui/page-guide";

type MainTab = "dashboard" | "studio" | "orders" | "profit" | "more";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { restaurant, loading: restLoading } = useMyRestaurant();
  useOrderNotifications(restaurant?.id);
  const [activeTab, setActiveTab] = useState<MainTab>("dashboard");
  const [menuItems, setMenuItems] = useState<MenuItem[]>(demoMenu);
  const [orders, setOrders] = useState<any[]>([]);
  const [aiTokens, setAiTokens] = useState(5);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayOrderCount, setTodayOrderCount] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [restaurantTables, setRestaurantTables] = useState<any[]>([]);
  const [newTableCount, setNewTableCount] = useState(8);
  const [reservations, setReservations] = useState<any[]>([]);
  const [existingPins, setExistingPins] = useState<any[]>([]);
  const [kitchenPin, setKitchenPin] = useState("");
  const [vaultConfig, setVaultConfig] = useState<any>(null);
  const [blacklist, setBlacklist] = useState<any[]>([]);
  const [orderAnalytics, setOrderAnalytics] = useState<{source: string; count: number}[]>([]);

  // Settings state
  const [settingsPhone, setSettingsPhone] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsAddress, setSettingsAddress] = useState("");
  const [settingsCity, setSettingsCity] = useState("");
  const [settingsTagline, setSettingsTagline] = useState("");
  const [settingsPrimaryColor, setSettingsPrimaryColor] = useState("#C8963E");
  const [settingsHours, setSettingsHours] = useState([
    { day: "Lunedì", hours: "12:00 - 15:00 · 19:00 - 23:30" },
    { day: "Martedì", hours: "12:00 - 15:00 · 19:00 - 23:30" },
    { day: "Mercoledì", hours: "12:00 - 15:00 · 19:00 - 23:30" },
    { day: "Giovedì", hours: "12:00 - 15:00 · 19:00 - 23:30" },
    { day: "Venerdì", hours: "12:00 - 15:00 · 19:00 - 23:30" },
    { day: "Sabato", hours: "12:00 - 15:30 · 19:00 - 24:00" },
    { day: "Domenica", hours: "Chiuso" },
  ]);
  const [settingsLanguages, setSettingsLanguages] = useState<string[]>(["it"]);
  const [settingsMinOrder, setSettingsMinOrder] = useState(0);
  const [settingsBlockedKeywords, setSettingsBlockedKeywords] = useState<string[]>([]);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Traffic
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [takeawayEnabled, setTakeawayEnabled] = useState(true);
  const [tableOrdersEnabled, setTableOrdersEnabled] = useState(true);

  // Restaurant creation
  const [newRestName, setNewRestName] = useState("");
  const [newRestSlug, setNewRestSlug] = useState("");
  const [newRestCity, setNewRestCity] = useState("");
  const [newRestBusinessType, setNewRestBusinessType] = useState<BusinessType>("restaurant");
  const [creatingRest, setCreatingRest] = useState(false);

  // Business type (adaptive UI)
  const [settingsBusinessType, setSettingsBusinessType] = useState<BusinessType>("restaurant");

  const restaurantSlug = restaurant?.slug || "impero-roma";
  const restaurantName = restaurant?.name || "Impero Roma";
  const menuUrl = `${window.location.origin}/r/${restaurantSlug}`;

  // Load settings from restaurant
  useEffect(() => {
    if (!restaurant) return;
    setSettingsPhone(restaurant.phone || "");
    setSettingsEmail(restaurant.email || "");
    setSettingsAddress(restaurant.address || "");
    setSettingsCity(restaurant.city || "");
    if (restaurant.opening_hours) setSettingsHours(restaurant.opening_hours);
    if (restaurant.languages) setSettingsLanguages(restaurant.languages);
    setSettingsTagline(restaurant.tagline || "");

    const bt = normalizeBusinessType((restaurant as any).business_type);
    setSettingsBusinessType(bt);

    const pc = restaurant.primary_color || "#C8963E";
    setSettingsPrimaryColor(pc);
    applyBrandTheme(pc);

    setSettingsMinOrder(restaurant.min_order_amount || 0);
    if (restaurant.blocked_keywords) setSettingsBlockedKeywords(restaurant.blocked_keywords);
    setPolicyAccepted(restaurant.policy_accepted || false);
    setDeliveryEnabled((restaurant as any).delivery_enabled ?? true);
    setTakeawayEnabled((restaurant as any).takeaway_enabled ?? true);
    setTableOrdersEnabled((restaurant as any).table_orders_enabled ?? true);
    return () => {
      resetBrandTheme();
    };
  }, [restaurant]);

  // Fetch all data
  useEffect(() => {
    if (!restaurant) return;
    const fetchData = async () => {
      const [itemsRes, ordersRes, tokenRes, reviewRes, pinsRes, fiscoRes, tablesRes, allOrdersRes, blRes, resRes] = await Promise.all([
        supabase.from("menu_items").select("*").eq("restaurant_id", restaurant.id).order("sort_order", { ascending: true }),
        supabase.from("orders").select("*").eq("restaurant_id", restaurant.id).order("created_at", { ascending: false }).limit(50),
        supabase.from("ai_tokens").select("balance").eq("restaurant_id", restaurant.id).single(),
        supabase.from("reviews").select("*").eq("restaurant_id", restaurant.id).order("created_at", { ascending: false }).limit(20),
        supabase.from("kitchen_access_pins").select("*").eq("restaurant_id", restaurant.id).eq("is_active", true),
        supabase.from("fisco_configs").select("*").eq("restaurant_id", restaurant.id).single(),
        supabase.from("restaurant_tables").select("*").eq("restaurant_id", restaurant.id).order("table_number", { ascending: true }),
        supabase.from("orders").select("utm_source, referrer").eq("restaurant_id", restaurant.id),
        (supabase as any).from("customer_blacklist").select("*").eq("restaurant_id", restaurant.id).eq("is_active", true).order("blocked_at", { ascending: false }),
        supabase.from("reservations").select("*").eq("restaurant_id", restaurant.id).order("reservation_date", { ascending: true }).limit(50) as any,
      ]);

      if (itemsRes.data?.length) {
        setMenuItems(itemsRes.data.map(i => ({ id: i.id, name: i.name, description: i.description || "", price: Number(i.price), image: i.image_url || "", category: i.category, allergens: i.allergens || [], isPopular: i.is_popular })));
      }
      if (ordersRes.data) {
        setOrders(ordersRes.data);
        const today = new Date().toISOString().split("T")[0];
        const todayOrders = ordersRes.data.filter(o => o.created_at.startsWith(today));
        setTodayRevenue(todayOrders.reduce((s, o) => s + Number(o.total), 0));
        setTodayOrderCount(todayOrders.length);
      }
      if (tokenRes.data) setAiTokens(tokenRes.data.balance);
      if (reviewRes.data) setReviews(reviewRes.data);
      if (pinsRes.data) setExistingPins(pinsRes.data);
      if (fiscoRes.data) setVaultConfig(fiscoRes.data);
      if (tablesRes.data) setRestaurantTables(tablesRes.data);
      if (blRes.data) setBlacklist(blRes.data);
      if (resRes.data) setReservations(resRes.data);

      if (allOrdersRes.data) {
        const sourceMap: Record<string, number> = {};
        allOrdersRes.data.forEach((o: any) => { const src = o.utm_source || o.referrer || "diretto"; sourceMap[src] = (sourceMap[src] || 0) + 1; });
        setOrderAnalytics(Object.entries(sourceMap).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count));
      }
    };
    fetchData();

    const channel = supabase.channel("admin-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurant.id}` }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items", filter: `restaurant_id=eq.${restaurant.id}` }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "restaurant_tables", filter: `restaurant_id=eq.${restaurant.id}` }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews", filter: `restaurant_id=eq.${restaurant.id}` }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "restaurants", filter: `id=eq.${restaurant.id}` }, () => fetchData())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reservations", filter: `restaurant_id=eq.${restaurant.id}` }, (payload) => {
        fetchData();
        const newRes = payload.new as any;
        toast({
          title: "📅 Nuova prenotazione!",
          description: `${newRes.customer_name || "Cliente"} — ${newRes.reservation_date} ore ${newRes.reservation_time} · ${newRes.guests || 2} ospiti`,
        });
        try {
          const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2JkZaYl5KMhX17d3V1eH6EiY6QkI6Mg3x2cW9vcniBi5SZnJqWkIiAfHl3d3l+hYuPkZGPjIZ/eHNwb3F2foeQmJucmZONhX57eXl7f4WLj5GRkI2Hf3h0cHBydnuEjJSZm5mVj4eDfnp5eXuAhouPkZGQjYeBenVxcHJ2fISMlJmbmZWPh4J+enl5e4CGi4+RkZCNh4F6dXFwcnZ8hIyUmZuZlY+Hgn56eXl7gIaLj5GRkI2HgXp1cXBydn0=");
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch {}
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "reservations", filter: `restaurant_id=eq.${restaurant.id}` }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "customer_blacklist", filter: `restaurant_id=eq.${restaurant.id}` }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [restaurant]);

  const handleLogoUpload = async () => {
    if (!restaurant) return;
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || file.size > 5 * 1024 * 1024) { toast({ title: "File troppo grande", variant: "destructive" }); return; }
      setLogoUploading(true);
      const ext = file.name.split(".").pop() || "png";
      const path = `${restaurant.id}/logo.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("restaurant-logos").upload(path, file, { upsert: true });
      if (uploadErr) { toast({ title: "Errore", variant: "destructive" }); setLogoUploading(false); return; }
      const { data: urlData } = supabase.storage.from("restaurant-logos").getPublicUrl(path);
      const logoUrl = urlData.publicUrl + "?t=" + Date.now();
      try {
        const hslColor = await extractDominantColor(logoUrl);
        const hexColor = hslToHex(hslColor);
        await supabase.from("restaurants").update({ logo_url: logoUrl, primary_color: hexColor }).eq("id", restaurant.id);
        document.documentElement.style.setProperty("--primary", hslColor);
        toast({ title: "Logo aggiornato!", description: `Colore brand estratto: ${hexColor}` });
      } catch {
        await supabase.from("restaurants").update({ logo_url: logoUrl }).eq("id", restaurant.id);
        toast({ title: "Logo aggiornato!" });
      }
      setLogoUploading(false);
      window.location.reload();
    };
    input.click();
  };

  const handleSaveSettings = async () => {
    if (!restaurant) return;
    setSettingsSaving(true);
    await supabase
      .from("restaurants")
      .update({
        business_type: settingsBusinessType as any,
        phone: settingsPhone.trim() || null,
        email: settingsEmail.trim() || null,
        address: settingsAddress.trim() || null,
        city: settingsCity.trim() || null,
        tagline: settingsTagline.trim() || null,
        primary_color: settingsPrimaryColor.trim() || null,
        opening_hours: settingsHours as any,
        languages: settingsLanguages as any,
        min_order_amount: settingsMinOrder,
        blocked_keywords: settingsBlockedKeywords as any,
        policy_accepted: policyAccepted,
        policy_accepted_at: policyAccepted ? new Date().toISOString() : null,
      } as any)
      .eq("id", restaurant.id);
    setSettingsSaving(false);
    toast({ title: "Impostazioni salvate" });
  };

  const handleCreateRestaurant = async () => {
    if (!user || !newRestName.trim() || !newRestSlug.trim()) return;
    setCreatingRest(true);
    const slug = newRestSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

    const cfg = getBusinessTypeConfig(newRestBusinessType);

    const { error } = await supabase.from("restaurants").insert({
      name: newRestName.trim(),
      slug,
      city: newRestCity.trim() || null,
      owner_id: user.id,
      business_type: newRestBusinessType as any,
      delivery_enabled: cfg.channels.delivery,
      takeaway_enabled: cfg.channels.takeaway,
      table_orders_enabled: cfg.channels.tableOrders,
    } as any);

    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Attività creata!", description: `Preset: ${cfg.label}` });
      await supabase
        .from("user_roles")
        .upsert({ user_id: user.id, role: "restaurant_admin" as any }, { onConflict: "user_id,role" });
      window.location.reload();
    }
    setCreatingRest(false);
  };

  const handleLogout = async () => { await signOut(); navigate("/admin"); };
  const activeOrders = orders.filter(o => ["pending", "preparing", "ready"].includes(o.status));

  if (restLoading) return (
    <div className="min-h-screen landing-dark flex items-center justify-center" style={{ background: "hsl(228 22% 7%)" }}>
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!restaurant) {
    navigate("/setup");
    return null;
  }

  const bottomTabs: { id: MainTab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Home", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "studio", label: "Studio", icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: "orders", label: "Ordini", icon: <ShoppingCart className="w-5 h-5" /> },
    { id: "profit", label: "Profitto", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "more", label: "Altro", icon: <Settings className="w-5 h-5" /> },
  ];

  // Kill-switch: blocked restaurant
  if (restaurant?.is_blocked) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-5">
          <Settings className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">Accesso Sospeso</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
          {restaurant.blocked_reason || "Il tuo account è stato temporaneamente sospeso per un pagamento mancante."}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-4">Contatta il supporto Empire per regolarizzare la tua posizione.</p>
        <button onClick={handleLogout} className="mt-6 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
          Esci
        </button>
      </div>
    );
  }

  const sectorAccent = settingsPrimaryColor || "#C8963E";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "linear-gradient(145deg, #0c0a14 0%, #0a0a12 40%, #0d0b10 100%)" }}>
      {/* Premium sector-themed admin background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: `radial-gradient(circle, ${sectorAccent}, transparent 65%)`, filter: "blur(100px)" }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full opacity-[0.04]"
          style={{ background: `radial-gradient(circle, ${sectorAccent}, transparent 70%)`, filter: "blur(120px)" }} />
        <div className="absolute inset-0" style={{ opacity: 0.012, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>
      
      {/* Back button integrated in header */}
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border/50 bg-card/50 safe-top">
        <div className="flex items-center gap-2 min-w-0">
          <img src={restaurant?.logo_url || restaurantLogo} alt="" className="w-8 h-8 rounded-xl object-contain" />
          <div className="min-w-0">
            <h1 className="text-sm font-display font-bold text-foreground truncate">{restaurantName}</h1>
            <p className="text-[10px] text-primary">{bottomTabs.find(t => t.id === activeTab)?.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <GuidesToggle />
          <button onClick={() => navigate("/home")} className="p-2 rounded-full hover:bg-secondary min-w-[40px] min-h-[40px] flex items-center justify-center" title="Home">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={handleLogout} className="p-2 rounded-full hover:bg-secondary min-w-[40px] min-h-[40px] flex items-center justify-center" title="Esci">
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <DashboardOverview
              key="dashboard"
              todayRevenue={todayRevenue}
              todayOrderCount={todayOrderCount}
              activeOrderCount={activeOrders.length}
              menuItemCount={menuItems.length}
              aiTokens={aiTokens}
              restaurantName={restaurantName}
              restaurantId={restaurant?.id}
              reviews={reviews}
              reservations={reservations}
              menuUrl={menuUrl}
              onNavigate={(tab) => setActiveTab(tab as MainTab)}
            />
          )}
          {activeTab === "studio" && (
            <StudioTab
              key="studio"
              restaurant={restaurant}
              menuItems={menuItems}
              setMenuItems={setMenuItems}
              aiTokens={aiTokens}
              setAiTokens={setAiTokens}
              settingsPrimaryColor={settingsPrimaryColor}
              setSettingsPrimaryColor={setSettingsPrimaryColor}
              settingsTagline={settingsTagline}
              setSettingsTagline={setSettingsTagline}
              settingsLanguages={settingsLanguages}
              setSettingsLanguages={setSettingsLanguages}
              logoUploading={logoUploading}
              handleLogoUpload={handleLogoUpload}
              handleSaveSettings={handleSaveSettings}
              userId={user?.id}
            />
          )}
          {activeTab === "orders" && (
            <OrdersTab
              key="orders"
              restaurant={restaurant}
              orders={orders}
              reservations={reservations}
              setReservations={setReservations}
              restaurantTables={restaurantTables}
              setRestaurantTables={setRestaurantTables}
              newTableCount={newTableCount}
              setNewTableCount={setNewTableCount}
              existingPins={existingPins}
              setExistingPins={setExistingPins}
              kitchenPin={kitchenPin}
              setKitchenPin={setKitchenPin}
              deliveryEnabled={deliveryEnabled}
              setDeliveryEnabled={setDeliveryEnabled}
              takeawayEnabled={takeawayEnabled}
              setTakeawayEnabled={setTakeawayEnabled}
              tableOrdersEnabled={tableOrdersEnabled}
              setTableOrdersEnabled={setTableOrdersEnabled}
              orderAnalytics={orderAnalytics}
            />
          )}
          {activeTab === "profit" && (
            <ProfitTab
              key="profit"
              restaurant={restaurant}
              menuItems={menuItems}
              setMenuItems={setMenuItems}
              reviews={reviews}
            />
          )}
          {activeTab === "more" && (
            <MoreMenu
              key="more"
              restaurant={restaurant}
              userId={user?.id}
              menuUrl={menuUrl}
              vaultConfig={vaultConfig}
              setVaultConfig={setVaultConfig}
              blacklist={blacklist}
              setBlacklist={setBlacklist}
              settingsBusinessType={settingsBusinessType}
              setSettingsBusinessType={setSettingsBusinessType}
              settingsPhone={settingsPhone}
              setSettingsPhone={setSettingsPhone}
              settingsEmail={settingsEmail}
              setSettingsEmail={setSettingsEmail}
              settingsAddress={settingsAddress}
              setSettingsAddress={setSettingsAddress}
              settingsCity={settingsCity}
              setSettingsCity={setSettingsCity}
              settingsHours={settingsHours}
              setSettingsHours={setSettingsHours}
              settingsMinOrder={settingsMinOrder}
              setSettingsMinOrder={setSettingsMinOrder}
              settingsBlockedKeywords={settingsBlockedKeywords}
              setSettingsBlockedKeywords={setSettingsBlockedKeywords}
              policyAccepted={policyAccepted}
              setPolicyAccepted={setPolicyAccepted}
              handleSaveSettings={handleSaveSettings}
              settingsSaving={settingsSaving}
              menuItems={menuItems}
              orders={orders}
              restaurantTables={restaurantTables}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Empire Assistant */}
      <EmpireAssistant restaurantId={restaurant?.id} />

      {/* Bottom Navigation — 5 tabs */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border/50 safe-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {bottomTabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-colors min-w-[60px] min-h-[52px] ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div className="w-1 h-1 rounded-full bg-primary" layoutId="bottom-dot" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
      <PageGuide />
    </div>
  );
};

export default AdminDashboard;
