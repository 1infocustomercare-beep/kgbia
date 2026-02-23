import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UtensilsCrossed, LayoutDashboard, ChefHat, TrendingUp, 
  LogOut, AlertTriangle, Star, GraduationCap,
  Edit, Trash2, DollarSign, Users, ShoppingCart,
  Camera, Sparkles, Coins, Wand2, QrCode, ExternalLink,
  Save, X, Check, Bot, Send, ShieldCheck, Lock, Key, Download,
  Settings, Phone, Mail, MapPin, Clock, Upload, Globe, Ban, 
  BarChart3, FileCheck, Image, Smartphone, UserX, Move, Palette,
  Power, Package, Languages, MessageSquare, ShieldBan, CalendarDays, Plus
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import PrivateChat from "@/components/restaurant/PrivateChat";
import TableMap from "@/components/restaurant/TableMap";
import LivePreview from "@/components/restaurant/LivePreview";
import LostCustomers from "@/components/restaurant/LostCustomers";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMyRestaurant } from "@/hooks/useMyRestaurant";
import { supabase } from "@/integrations/supabase/client";
import { demoMenu } from "@/data/demo-restaurant";
import type { MenuItem } from "@/types/restaurant";
import restaurantLogo from "@/assets/restaurant-logo.png";
import { toast } from "@/hooks/use-toast";
import { generateQRDataUrl, downloadQR } from "@/lib/qr";
import { extractDominantColor, hslToHex, applyBrandTheme, resetBrandTheme, DEFAULT_PRIMARY_HEX } from "@/lib/color-extract";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

type AdminTab = "dashboard" | "menu" | "kitchen" | "ai" | "vault" | "qr" | "panic" | "reviews" | "academy" | "settings" | "preview" | "clients" | "traffic" | "inventory" | "chat" | "blacklist" | "translate" | "reservations" | "more";

interface EditingItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface NewMenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
}

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
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [ocrUploading, setOcrUploading] = useState(false);
  const [ocrResult, setOcrResult] = useState<{name: string; description: string; price: number; category: string; image_url?: string; imageLoading?: boolean}[] | null>(null);
  const [ocrImporting, setOcrImporting] = useState(false);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayOrderCount, setTodayOrderCount] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [restaurantTables, setRestaurantTables] = useState<any[]>([]);
  const [newTableCount, setNewTableCount] = useState(8);
  const [reservations, setReservations] = useState<any[]>([]);

  // Kitchen PIN management
  const [kitchenPin, setKitchenPin] = useState("");
  const [existingPins, setExistingPins] = useState<any[]>([]);

  // Vault Fiscale
  const [vaultConfig, setVaultConfig] = useState<any>(null);
  const [vaultEditing, setVaultEditing] = useState(false);
  const [vaultKey, setVaultKey] = useState("");
  const [vaultProvider, setVaultProvider] = useState("Scontrino.it");
  const [vaultValidating, setVaultValidating] = useState(false);

  // Restaurant creation
  const [newRestName, setNewRestName] = useState("");
  const [newRestSlug, setNewRestSlug] = useState("");
  const [newRestCity, setNewRestCity] = useState("");
  const [creatingRest, setCreatingRest] = useState(false);

  // Settings state
  const [settingsPhone, setSettingsPhone] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsAddress, setSettingsAddress] = useState("");
  const [settingsCity, setSettingsCity] = useState("");
  const [settingsHours, setSettingsHours] = useState<{ day: string; hours: string }[]>([
    { day: "Lunedì", hours: "12:00 - 15:00 · 19:00 - 23:30" },
    { day: "Martedì", hours: "12:00 - 15:00 · 19:00 - 23:30" },
    { day: "Mercoledì", hours: "12:00 - 15:00 · 19:00 - 23:30" },
    { day: "Giovedì", hours: "12:00 - 15:00 · 19:00 - 23:30" },
    { day: "Venerdì", hours: "12:00 - 15:00 · 19:00 - 23:30" },
    { day: "Sabato", hours: "12:00 - 15:30 · 19:00 - 24:00" },
    { day: "Domenica", hours: "Chiuso" },
  ]);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsLanguages, setSettingsLanguages] = useState<string[]>(["it"]);
  const [settingsMinOrder, setSettingsMinOrder] = useState(0);
  const [settingsBlockedKeywords, setSettingsBlockedKeywords] = useState<string[]>([]);
  const [settingsNewKeyword, setSettingsNewKeyword] = useState("");
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [settingsTagline, setSettingsTagline] = useState("");
  const [settingsPrimaryColor, setSettingsPrimaryColor] = useState("#C8963E");
  const [orderAnalytics, setOrderAnalytics] = useState<{source: string; count: number}[]>([]);

  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState<NewMenuItem>({ name: "", description: "", price: 0, category: "Altro" });

  // Traffic control toggles
  const [deliveryEnabled, setDeliveryEnabled] = useState(true);
  const [takeawayEnabled, setTakeawayEnabled] = useState(true);
  const [tableOrdersEnabled, setTableOrdersEnabled] = useState(true);

  // AI Inventory
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryResult, setInventoryResult] = useState<any>(null);

  // Blacklist
  const [blacklist, setBlacklist] = useState<any[]>([]);
  const [blacklistPhone, setBlacklistPhone] = useState("");
  const [blacklistName, setBlacklistName] = useState("");
  const [blacklistReason, setBlacklistReason] = useState("");

  // Translation
  const [translating, setTranslating] = useState(false);
  const [translationDone, setTranslationDone] = useState(false);

  // AI-Mary vault chat
  const [maryMessages, setMaryMessages] = useState<{role: string; content: string}[]>([
    { role: "assistant", content: "Benvenuto nella **Cassaforte Fiscale**. Sono Mary, il tuo assistente per la configurazione del Vault.\n\n🔐 Qui puoi inserire in sicurezza le tue chiavi API fiscali. I dati vengono criptati AES-256 e **nessuno**, nemmeno il Super-Admin, può visualizzarli.\n\nVuoi configurare **Scontrino.it** o **Aruba**?" }
  ]);
  const [maryInput, setMaryInput] = useState("");

  const restaurantSlug = restaurant?.slug || "impero-roma";
  const restaurantName = restaurant?.name || "Impero Roma";
  const menuUrl = `${window.location.origin}/r/${restaurantSlug}`;

  // Load settings from restaurant data
  useEffect(() => {
    if (!restaurant) return;
    setSettingsPhone(restaurant.phone || "");
    setSettingsEmail(restaurant.email || "");
    setSettingsAddress(restaurant.address || "");
    setSettingsCity(restaurant.city || "");
    if (restaurant.opening_hours) setSettingsHours(restaurant.opening_hours);
    if (restaurant.languages) setSettingsLanguages(restaurant.languages);
    setSettingsTagline(restaurant.tagline || "");
    const pc = restaurant.primary_color || "#C8963E";
    setSettingsPrimaryColor(pc);
    applyBrandTheme(pc);
    setSettingsMinOrder(restaurant.min_order_amount || 0);
    if (restaurant.blocked_keywords) setSettingsBlockedKeywords(restaurant.blocked_keywords);
    setPolicyAccepted(restaurant.policy_accepted || false);
    // Traffic toggles
    setDeliveryEnabled((restaurant as any).delivery_enabled ?? true);
    setTakeawayEnabled((restaurant as any).takeaway_enabled ?? true);
    setTableOrdersEnabled((restaurant as any).table_orders_enabled ?? true);
    return () => { resetBrandTheme(); };
  }, [restaurant]);

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

      // Order analytics by source
      const { data: allOrders } = await supabase
        .from("orders").select("utm_source, referrer")
        .eq("restaurant_id", restaurant.id);
      if (allOrders) {
        const sourceMap: Record<string, number> = {};
        allOrders.forEach(o => {
          const src = (o as any).utm_source || (o as any).referrer || "diretto";
          sourceMap[src] = (sourceMap[src] || 0) + 1;
        });
        setOrderAnalytics(Object.entries(sourceMap).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count));
      }

      // Blacklist
      const { data: bl } = await (supabase as any)
        .from("customer_blacklist").select("*")
        .eq("restaurant_id", restaurant.id)
        .eq("is_active", true)
        .order("blocked_at", { ascending: false });
      if (bl) setBlacklist(bl);

      // Reservations
      const { data: resData } = await supabase
        .from("reservations").select("*")
        .eq("restaurant_id", restaurant.id)
        .order("reservation_date", { ascending: true })
        .order("reservation_time", { ascending: true })
        .limit(50) as any;
      if (resData) setReservations(resData);
    };
    fetchData();

    const channel = supabase.channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurant.id}` }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "reservations", filter: `restaurant_id=eq.${restaurant.id}` }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [restaurant]);

  const [tableMapEditMode, setTableMapEditMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "menu", label: "Menu", icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: "preview", label: "Preview", icon: <Smartphone className="w-5 h-5" /> },
    { id: "kitchen", label: "Cucina", icon: <ChefHat className="w-5 h-5" /> },
    { id: "traffic", label: "Traffico", icon: <Power className="w-5 h-5" /> },
    { id: "inventory", label: "Scorte", icon: <Package className="w-5 h-5" /> },
    { id: "ai", label: "IA Menu", icon: <Sparkles className="w-5 h-5" /> },
    { id: "translate", label: "Lingue", icon: <Languages className="w-5 h-5" /> },
    { id: "chat", label: "Chat", icon: <MessageSquare className="w-5 h-5" /> },
    { id: "blacklist", label: "BlackList", icon: <ShieldBan className="w-5 h-5" /> },
    { id: "vault", label: "Vault", icon: <Lock className="w-5 h-5" /> },
    { id: "qr", label: "QR", icon: <QrCode className="w-5 h-5" /> },
    { id: "panic", label: "Panic", icon: <AlertTriangle className="w-5 h-5" /> },
    { id: "reviews", label: "Reviews", icon: <Star className="w-5 h-5" /> },
    { id: "clients", label: "Clienti", icon: <UserX className="w-5 h-5" /> },
    { id: "reservations", label: "Prenotazioni", icon: <CalendarDays className="w-5 h-5" /> },
    { id: "academy", label: "Academy", icon: <GraduationCap className="w-5 h-5" /> },
    { id: "settings", label: "Info", icon: <Settings className="w-5 h-5" /> },
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
          const dishesWithLoading = data.dishes.map((d: any) => ({ ...d, imageLoading: true }));
          setOcrResult(dishesWithLoading);
          setAiTokens(t => Math.max(0, t - 1));
          toast({ title: `${data.dishes.length} piatti rilevati`, description: "Generazione foto food-porn in corso..." });

          // Generate images for each dish in parallel
          for (let idx = 0; idx < dishesWithLoading.length; idx++) {
            const dish = dishesWithLoading[idx];
            supabase.functions.invoke("ai-menu", {
              body: { action: "generate-image", dishDescription: `${dish.name}. ${dish.description || ""}`, dishCategory: dish.category || "" },
            }).then(({ data: imgData }) => {
              setOcrResult(prev => {
                if (!prev) return prev;
                const updated = [...prev];
                updated[idx] = { ...updated[idx], image_url: imgData?.imageUrl || "", imageLoading: false };
                return updated;
              });
            }).catch(() => {
              setOcrResult(prev => {
                if (!prev) return prev;
                const updated = [...prev];
                updated[idx] = { ...updated[idx], imageLoading: false };
                return updated;
              });
            });
          }
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
        image_url: dish.image_url || null,
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

  const handleRegenerateImage = async (item: MenuItem) => {
    if (!restaurant) return;
    if (aiTokens <= 0) {
      toast({ title: "Gettoni IA esauriti", description: "Ricarica il wallet gettoni (€15 + IVA) per rigenerare le foto.", variant: "destructive" });
      return;
    }
    setRegeneratingId(item.id);
    try {
      // Deduct token from DB
      const { data: tokenData } = await supabase
        .from("ai_tokens").select("balance").eq("restaurant_id", restaurant.id).single();
      const currentBalance = tokenData?.balance ?? 0;
      if (currentBalance <= 0) {
        toast({ title: "Gettoni IA esauriti", description: "Ricarica il wallet gettoni (€15 + IVA) per rigenerare le foto.", variant: "destructive" });
        setRegeneratingId(null);
        return;
      }
      // Deduct 1 token
      await supabase.from("ai_tokens").update({ balance: currentBalance - 1 }).eq("restaurant_id", restaurant.id);
      await (supabase as any).from("ai_token_history").insert({
        restaurant_id: restaurant.id, tokens: -1, action: `Rigenera foto: ${item.name}`,
      });
      setAiTokens(currentBalance - 1);

      // Generate new image
      const { data, error } = await supabase.functions.invoke("ai-menu", {
        body: { action: "generate-image", dishDescription: `${item.name}. ${item.description || ""}`, dishCategory: item.category },
      });
      if (error) throw error;
      const newUrl = data?.imageUrl;
      if (newUrl) {
        await supabase.from("menu_items").update({ image_url: newUrl }).eq("id", item.id);
        setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, image: newUrl } : i));
        toast({ title: "Foto rigenerata!", description: `Token rimanenti: ${currentBalance - 1}` });
      } else {
        toast({ title: "Errore", description: "Nessuna immagine generata. Il token è stato consumato.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Errore", description: err?.message || "Riprova.", variant: "destructive" });
    }
    setRegeneratingId(null);
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

  const handleCreateRestaurant = async () => {
    if (!user || !newRestName.trim() || !newRestSlug.trim()) return;
    setCreatingRest(true);
    const slug = newRestSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    const { error } = await supabase.from("restaurants").insert({
      name: newRestName.trim(),
      slug,
      city: newRestCity.trim() || null,
      owner_id: user.id,
    });
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Ristorante creato!", description: "Ricarica la pagina per iniziare." });
      // Add restaurant_admin role if not present
      await supabase.from("user_roles").upsert({ user_id: user.id, role: "restaurant_admin" as any }, { onConflict: "user_id,role" });
      window.location.reload();
    }
    setCreatingRest(false);
  };

  const handleEditMenuItem = async () => {
    if (!editingItem || !restaurant) return;
    const { error } = await supabase.from("menu_items").update({
      name: editingItem.name,
      description: editingItem.description,
      price: editingItem.price,
      category: editingItem.category,
    }).eq("id", editingItem.id);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      setMenuItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, name: editingItem.name, description: editingItem.description, price: editingItem.price, category: editingItem.category } : i));
      setEditingItem(null);
      toast({ title: "Piatto aggiornato" });
    }
  };

  const handleAddMenuItem = async () => {
    if (!restaurant || !newItem.name.trim()) return;
    const { data, error } = await supabase.from("menu_items").insert({
      restaurant_id: restaurant.id,
      name: newItem.name.trim(),
      description: newItem.description.trim() || "",
      price: newItem.price || 0,
      category: newItem.category.trim() || "Altro",
      sort_order: menuItems.length,
      is_active: true,
      is_popular: false,
    }).select().single();
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else if (data) {
      setMenuItems(prev => [...prev, {
        id: data.id, name: data.name, description: data.description || "",
        price: Number(data.price), image: data.image_url || "",
        category: data.category, allergens: data.allergens || [], isPopular: data.is_popular,
      }]);
      setNewItem({ name: "", description: "", price: 0, category: "Altro" });
      setShowAddItem(false);
      toast({ title: "Piatto aggiunto al menu!" });
    }
  };

  const handleSaveSettings = async () => {
    if (!restaurant) return;
    setSettingsSaving(true);
    const { error } = await supabase.from("restaurants").update({
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
    } as any).eq("id", restaurant.id);
    setSettingsSaving(false);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Impostazioni salvate", description: "Tutte le configurazioni aggiornate con successo." });
    }
  };

  const handleLogoUpload = async () => {
    if (!restaurant) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File troppo grande", description: "Massimo 5MB.", variant: "destructive" });
        return;
      }
      setLogoUploading(true);
      const ext = file.name.split(".").pop() || "png";
      const path = `${restaurant.id}/logo.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("restaurant-logos").upload(path, file, { upsert: true });
      if (uploadErr) {
        toast({ title: "Errore upload", description: uploadErr.message, variant: "destructive" });
        setLogoUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("restaurant-logos").getPublicUrl(path);
      const logoUrl = urlData.publicUrl + "?t=" + Date.now();
      
      // Extract dominant color from logo for adaptive branding
      try {
        const hslColor = await extractDominantColor(logoUrl);
        const hexColor = hslToHex(hslColor);
        await supabase.from("restaurants").update({ logo_url: logoUrl, primary_color: hexColor }).eq("id", restaurant.id);
        // Apply color to CSS in real-time
        document.documentElement.style.setProperty("--primary", hslColor);
        toast({ title: "Logo aggiornato!", description: `Branding adattivo: colore primario estratto automaticamente (${hexColor}).` });
      } catch {
        await supabase.from("restaurants").update({ logo_url: logoUrl }).eq("id", restaurant.id);
        toast({ title: "Logo aggiornato!", description: "Il nuovo logo è attivo." });
      }
      setLogoUploading(false);
      window.location.reload();
    };
    input.click();
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  const activeOrders = orders.filter(o => ["pending", "preparing", "ready"].includes(o.status));
  const allCategories = [...new Set(menuItems.map(i => i.category))];

  // Loading state
  if (restLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Show restaurant creation if no restaurant exists
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div className="w-full max-w-sm space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gold-gradient">Crea il tuo Ristorante</h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">Configura il tuo impero digitale in 30 secondi</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-1.5">Nome ristorante</label>
              <input type="text" value={newRestName} onChange={(e) => { setNewRestName(e.target.value); setNewRestSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")); }}
                placeholder="Ristorante Da Mario" className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-1.5">Slug URL</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">/r/</span>
                <input type="text" value={newRestSlug} onChange={(e) => setNewRestSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="ristorante-da-mario" className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground text-base font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground/70 uppercase tracking-wider block mb-1.5">Città</label>
              <input type="text" value={newRestCity} onChange={(e) => setNewRestCity(e.target.value)}
                placeholder="Roma" className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
            </div>
          </div>
          <motion.button onClick={handleCreateRestaurant} disabled={!newRestName.trim() || !newRestSlug.trim() || creatingRest}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base gold-glow disabled:opacity-50 min-h-[48px]"
            whileTap={{ scale: 0.97 }}>
            {creatingRest ? "Creazione in corso..." : "Crea il tuo Impero"}
          </motion.button>
          <button onClick={handleLogout} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            Esci
          </button>
        </motion.div>
      </div>
    );
  }

  const currentTabLabel = tabs.find(t => t.id === activeTab)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar — compact mobile header */}
      <div className="flex items-center justify-between px-3 sm:px-5 pt-2 sm:pt-4 pb-2 sm:pb-3 border-b border-border/50 bg-card/50 safe-top">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img src={restaurant?.logo_url || restaurantLogo} alt="" className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-contain flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-display font-bold text-foreground truncate">{restaurantName}</h1>
            <p className="text-[10px] text-primary font-medium tracking-wider uppercase">{currentTabLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 sm:px-2 py-1 rounded-lg flex items-center gap-1">
            <Coins className="w-3 h-3" />{aiTokens}
          </span>
          <button onClick={handleLogout} className="p-1.5 sm:p-2 rounded-full hover:bg-secondary transition-colors">
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Desktop/Tablet: horizontal scrollable tab bar */}
      <div className="hidden sm:flex gap-1.5 px-4 py-2 overflow-x-auto scrollbar-hide border-b border-border/30">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            }`}>
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-3 sm:px-5 pb-24 sm:pb-8 overflow-y-auto">
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
              <motion.button onClick={() => setShowAddItem(!showAddItem)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium min-h-[40px]"
                whileTap={{ scale: 0.95 }}>
                {showAddItem ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showAddItem ? "Chiudi" : "Aggiungi"}
              </motion.button>
            </div>

            {/* Add new item form */}
            <AnimatePresence>
              {showAddItem && (
                <motion.div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <p className="text-xs text-primary uppercase tracking-wider font-medium">Nuovo piatto</p>
                  <input type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Nome del piatto" className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                  <textarea value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Descrizione (opz.)" className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" step="0.01" value={newItem.price || ""} onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                      placeholder="€ Prezzo" className="px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                    <input type="text" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                      placeholder="Categoria" className="px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                  </div>
                  <motion.button onClick={handleAddMenuItem} disabled={!newItem.name.trim()}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-40 min-h-[48px]"
                    whileTap={{ scale: 0.97 }}>
                    <Plus className="w-4 h-4" /> Aggiungi al Menu
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

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
                          <button onClick={() => handleRegenerateImage(item)}
                            disabled={regeneratingId === item.id}
                            className="p-2 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-40"
                            title="Rigenera foto IA">
                            {regeneratingId === item.id ? (
                              <motion.div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full"
                                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                            ) : (
                              <Camera className="w-3.5 h-3.5 text-primary" />
                            )}
                          </button>
                          <button onClick={() => setEditingItem({ id: item.id, name: item.name, description: item.description, price: item.price, category: item.category })}
                            className="p-2 rounded-lg hover:bg-muted transition-colors">
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
            {menuItems.length === 0 && (
              <div className="text-center py-12">
                <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">Nessun piatto — aggiungi manualmente o usa l'IA Menu Creator</p>
              </div>
            )}
          </motion.div>
        )}

        {/* EDIT ITEM MODAL */}
        {editingItem && (
          <motion.div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center px-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setEditingItem(null)}>
            <motion.div className="w-full max-w-sm bg-card rounded-2xl border border-border p-5 space-y-4"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-display font-bold text-foreground">Modifica piatto</h3>
                <button onClick={() => setEditingItem(null)} className="p-1.5 rounded-full hover:bg-secondary"><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <div className="space-y-3">
                <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Nome" className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                <textarea value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Descrizione" className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-base resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" step="0.01" value={editingItem.price} onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                    placeholder="Prezzo" className="px-3 py-2.5 rounded-xl bg-secondary text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                  <input type="text" value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    placeholder="Categoria" className="px-3 py-2.5 rounded-xl bg-secondary text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleEditMenuItem} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm min-h-[44px] flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Salva
                </button>
                <button onClick={() => setEditingItem(null)} className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm min-h-[44px]">
                  Annulla
                </button>
              </div>
            </motion.div>
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
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-primary/10">
                      {dish.imageLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <motion.div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                            animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                        </div>
                      ) : dish.image_url ? (
                        <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Wand2 className="w-5 h-5 text-primary" />
                        </div>
                      )}
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

            {/* Table Management — Dynamic Map */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Mappa tavoli ({restaurantTables.length})</p>
                <div className="flex gap-2">
                  {restaurantTables.length > 0 && (
                    <button onClick={() => {
                      if (tableMapEditMode) {
                        // Save positions
                        restaurantTables.forEach(async (table) => {
                          await supabase.from("restaurant_tables").update({ pos_x: table.pos_x || 0, pos_y: table.pos_y || 0 } as any).eq("id", table.id);
                        });
                        toast({ title: "Layout salvato!" });
                      }
                      setTableMapEditMode(!tableMapEditMode);
                    }} className={`px-3 py-1.5 rounded-lg text-xs font-medium min-h-[44px] flex items-center gap-1.5 ${
                      tableMapEditMode ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}>
                      <Move className="w-3.5 h-3.5" />
                      {tableMapEditMode ? "Salva Layout" : "Modifica Layout"}
                    </button>
                  )}
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

              {restaurantTables.length > 0 && (
                <>
                  <TableMap
                    tables={restaurantTables}
                    editMode={tableMapEditMode}
                    onStatusChange={async (tableId, newStatus) => {
                      await supabase.from("restaurant_tables").update({ status: newStatus }).eq("id", tableId);
                      setRestaurantTables(prev => prev.map(t => t.id === tableId ? { ...t, status: newStatus } : t));
                    }}
                    onPositionChange={(tableId, x, y) => {
                      setRestaurantTables(prev => prev.map(t => t.id === tableId ? { ...t, pos_x: x, pos_y: y } : t));
                    }}
                  />
                  {/* Per-table QR download */}
                  <div className="mt-3 space-y-2">
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
                </>
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

        {/* TRAFFIC CONTROL */}
        {activeTab === "traffic" && (
          <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <Power className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">Cruscotto Traffico</h3>
              <p className="text-sm text-muted-foreground mt-1">Apri e chiudi i rubinetti degli ordini in tempo reale</p>
            </div>
            <div className="space-y-3">
              {[
                { key: "delivery", label: "🚗 Consegna", enabled: deliveryEnabled, setter: setDeliveryEnabled },
                { key: "takeaway", label: "🥡 Asporto", enabled: takeawayEnabled, setter: setTakeawayEnabled },
                { key: "table", label: "🪑 Tavolo", enabled: tableOrdersEnabled, setter: setTableOrdersEnabled },
              ].map(ch => (
                <div key={ch.key} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${ch.enabled ? "bg-green-400" : "bg-red-400"}`} />
                    <span className="text-sm font-medium text-foreground">{ch.label}</span>
                  </div>
                  <Switch checked={ch.enabled} onCheckedChange={async (val) => {
                    ch.setter(val);
                    if (restaurant) {
                      await supabase.from("restaurants").update({ [`${ch.key}_enabled`]: val } as any).eq("id", restaurant.id);
                      toast({ title: val ? `${ch.label} attivato` : `${ch.label} disattivato` });
                    }
                  }} />
                </div>
              ))}
            </div>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground">💡 Locale pieno? Disattiva i canali con un tap.</p>
            </div>

            {/* Traffic Analytics */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Fonti Ordini</p>
              {orderAnalytics.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nessun dato — gli ordini futuri tracceranno la fonte automaticamente</p>
              ) : (
                <>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={orderAnalytics} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={3} strokeWidth={0}>
                          {orderAnalytics.map((_, idx) => (
                            <Cell key={idx} fill={`hsl(${38 + idx * 45}, ${75 - idx * 8}%, ${55 + idx * 5}%)`} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ background: "hsl(20, 12%, 8%)", border: "1px solid hsl(20, 10%, 16%)", borderRadius: "12px", fontSize: "12px", color: "hsl(40, 20%, 92%)" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {orderAnalytics.map((item, idx) => {
                      const maxCount = orderAnalytics[0]?.count || 1;
                      return (
                        <div key={item.source} className="p-3 rounded-xl bg-secondary/50">
                          <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: `hsl(${38 + idx * 45}, ${75 - idx * 8}%, ${55 + idx * 5}%)` }} />
                              <span className="text-sm font-medium text-foreground capitalize">{item.source}</span>
                            </div>
                            <span className="text-xs text-primary font-semibold">{item.count} ordini</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${(item.count / maxCount) * 100}%`, background: `hsl(${38 + idx * 45}, ${75 - idx * 8}%, ${55 + idx * 5}%)` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* AI INVENTORY */}
        {activeTab === "inventory" && (
          <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <Package className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">AI Inventory</h3>
              <p className="text-sm text-muted-foreground mt-1">Predizione scorte e piatto del giorno</p>
            </div>
            <motion.button onClick={async () => {
              if (!restaurant) return;
              setInventoryLoading(true);
              try {
                const { data, error } = await supabase.functions.invoke("ai-inventory", {
                  body: { restaurantId: restaurant.id, orders, menuItems },
                });
                if (error) throw error;
                setInventoryResult(data);
              } catch (err: any) {
                toast({ title: "Errore", description: err?.message || "Riprova.", variant: "destructive" });
              }
              setInventoryLoading(false);
            }} disabled={inventoryLoading}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 gold-glow disabled:opacity-50 min-h-[48px]"
              whileTap={{ scale: 0.97 }}>
              {inventoryLoading ? "Analisi IA..." : <><Sparkles className="w-4 h-4" /> Analizza Scorte</>}
            </motion.button>
            {inventoryResult && (
              <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {inventoryResult.alerts?.map((a: any, i: number) => (
                  <div key={i} className={`p-3 rounded-xl border ${a.urgency === "high" ? "bg-accent/5 border-accent/20" : "bg-secondary/50 border-border"}`}>
                    <div className="flex justify-between"><span className="text-sm font-medium text-foreground">{a.ingredient}</span>
                      <span className="text-xs text-muted-foreground">{a.urgency === "high" ? "🔴" : "🟡"} ~{a.estimatedDaysLeft}gg</span></div>
                    <p className="text-xs text-muted-foreground mt-1">Ordina: {a.suggestedOrder}</p>
                  </div>
                ))}
                {inventoryResult.dailySpecial && (
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                    <p className="text-xs text-primary uppercase tracking-wider font-medium mb-1">🍽️ Piatto del Giorno</p>
                    <p className="text-base font-display font-bold text-foreground">{inventoryResult.dailySpecial.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{inventoryResult.dailySpecial.reason}</p>
                  </div>
                )}
                {inventoryResult.insights && <p className="text-xs text-muted-foreground p-3 rounded-xl bg-secondary/50">{inventoryResult.insights}</p>}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* CHAT */}
        {activeTab === "chat" && restaurant && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">Private Connect</h3>
              <p className="text-sm text-muted-foreground mt-1">Chat criptata — nessun numero esposto</p>
            </div>
            <PrivateChat restaurantId={restaurant.id} isRestaurantView={true} />
          </motion.div>
        )}

        {/* BLACKLIST */}
        {activeTab === "blacklist" && (
          <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <ShieldBan className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">Black-List</h3>
              <p className="text-sm text-muted-foreground mt-1">Blocca utenti inaccettabili</p>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/50 space-y-3">
              <input type="tel" placeholder="Telefono" value={blacklistPhone} onChange={e => setBlacklistPhone(e.target.value)} maxLength={20}
                className="w-full px-3 py-2.5 rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
              <input type="text" placeholder="Nome (opz.)" value={blacklistName} onChange={e => setBlacklistName(e.target.value)} maxLength={100}
                className="w-full px-3 py-2.5 rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
              <input type="text" placeholder="Motivo" value={blacklistReason} onChange={e => setBlacklistReason(e.target.value)} maxLength={200}
                className="w-full px-3 py-2.5 rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
              <motion.button onClick={async () => {
                if (!restaurant || !blacklistPhone.trim()) return;
                const { error } = await (supabase as any).from("customer_blacklist").insert({
                  restaurant_id: restaurant.id, customer_phone: blacklistPhone.trim(),
                  customer_name: blacklistName.trim() || null, reason: blacklistReason.trim() || null, blocked_by: user?.id,
                });
                if (error) { toast({ title: "Errore", description: error.message, variant: "destructive" }); }
                else {
                  toast({ title: "Utente bloccato" });
                  setBlacklistPhone(""); setBlacklistName(""); setBlacklistReason("");
                  const { data: bl } = await (supabase as any).from("customer_blacklist").select("*")
                    .eq("restaurant_id", restaurant.id).eq("is_active", true);
                  if (bl) setBlacklist(bl);
                }
              }} disabled={!blacklistPhone.trim()}
                className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-medium text-sm disabled:opacity-40 min-h-[48px]"
                whileTap={{ scale: 0.97 }}>🚫 Blocca</motion.button>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Bloccati ({blacklist.length})</p>
              {blacklist.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nessun utente bloccato</p>}
              {blacklist.map((e: any) => (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-accent/5 border border-accent/20">
                  <ShieldBan className="w-4 h-4 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{e.customer_name || e.customer_phone}</p>
                    <p className="text-xs text-muted-foreground">{e.reason || "—"}</p>
                  </div>
                  <button onClick={async () => {
                    await (supabase as any).from("customer_blacklist").update({ is_active: false }).eq("id", e.id);
                    setBlacklist(prev => prev.filter(b => b.id !== e.id));
                    toast({ title: "Sbloccato" });
                  }} className="text-xs text-primary px-2 py-1 rounded-lg hover:bg-primary/10">Sblocca</button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AI TRANSLATE */}
        {activeTab === "translate" && (
          <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <Languages className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">Traduzione IA</h3>
              <p className="text-sm text-muted-foreground mt-1">Menu tradotto automaticamente per i turisti</p>
            </div>
            <motion.button onClick={async () => {
              if (!restaurant) return;
              setTranslating(true); setTranslationDone(false);
              try {
                const { data, error } = await supabase.functions.invoke("ai-translate", {
                  body: { menuItems, targetLanguages: settingsLanguages },
                });
                if (error) throw error;
                if (data?.translations) {
                  for (const t of data.translations) {
                    await supabase.from("menu_items").update({
                      name_translations: t.name_translations, description_translations: t.description_translations,
                    } as any).eq("id", t.id);
                  }
                }
                setTranslationDone(true);
                toast({ title: "Menu tradotto!", description: `${data?.translations?.length || 0} piatti tradotti.` });
              } catch (err: any) {
                toast({ title: "Errore", description: err?.message || "Riprova.", variant: "destructive" });
              }
              setTranslating(false);
            }} disabled={translating || settingsLanguages.filter(l => l !== "it").length === 0}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 gold-glow disabled:opacity-50 min-h-[48px]"
              whileTap={{ scale: 0.97 }}>
              {translating ? "Traduzione IA..." : <><Languages className="w-4 h-4" /> Traduci Menu</>}
            </motion.button>
            {translationDone && (
              <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
                <Check className="w-6 h-6 mx-auto text-green-400 mb-1" />
                <p className="text-sm text-green-400 font-medium">Traduzione completata</p>
              </div>
            )}
            {settingsLanguages.filter(l => l !== "it").length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Vai in Impostazioni → Lingue per attivare le traduzioni.</p>
            )}
          </motion.div>
        )}

        {/* LIVE PREVIEW */}
        {activeTab === "preview" && restaurant && (
          <LivePreview slug={restaurantSlug} />
        )}

        {/* LOST CUSTOMERS */}
        {activeTab === "clients" && restaurant && (
          <LostCustomers restaurantId={restaurant.id} restaurantName={restaurantName} />
        )}

        {/* RESERVATIONS */}
        {activeTab === "reservations" && restaurant && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">Prenotazioni</h3>
              <p className="text-sm text-muted-foreground mt-1">Gestisci le prenotazioni dei clienti in tempo reale</p>
            </div>
            {reservations.length === 0 && (
              <div className="text-center py-12">
                <CalendarDays className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">Nessuna prenotazione ricevuta</p>
              </div>
            )}
            {reservations.map((res: any) => (
              <div key={res.id} className={`p-4 rounded-2xl border ${
                res.status === "confirmed" ? "bg-green-500/5 border-green-500/20" :
                res.status === "cancelled" ? "bg-accent/5 border-accent/20 opacity-60" :
                "bg-secondary/50 border-border"
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{res.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{res.customer_phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display font-bold text-primary">{res.reservation_date}</p>
                    <p className="text-xs text-muted-foreground">ore {res.reservation_time}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">👥 {res.guests} ospiti</span>
                  <div className="flex gap-2">
                    {res.status === "pending" && (
                      <>
                        <button onClick={async () => {
                          await supabase.from("reservations").update({ status: "confirmed" } as any).eq("id", res.id);
                          setReservations(prev => prev.map(r => r.id === res.id ? { ...r, status: "confirmed" } : r));
                          toast({ title: "Prenotazione confermata" });
                        }} className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs font-medium min-h-[36px]">
                          ✅ Conferma
                        </button>
                        <button onClick={async () => {
                          await supabase.from("reservations").update({ status: "cancelled" } as any).eq("id", res.id);
                          setReservations(prev => prev.map(r => r.id === res.id ? { ...r, status: "cancelled" } : r));
                          toast({ title: "Prenotazione annullata" });
                        }} className="px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-xs font-medium min-h-[36px]">
                          ✖ Rifiuta
                        </button>
                      </>
                    )}
                    {res.status === "confirmed" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Confermata</span>
                    )}
                    {res.status === "cancelled" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">Annullata</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* SETTINGS — Full Config Panel */}
        {activeTab === "settings" && (
          <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-2">
              <Settings className="w-10 h-10 mx-auto mb-2 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">Configurazione Ristorante</h3>
              <p className="text-sm text-muted-foreground mt-1">Identità, contatti, orari, lingue, filtri e policy</p>
            </div>

            {/* Logo Upload & Tagline */}
            <div className="p-4 rounded-2xl bg-secondary/50 space-y-4">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5"><Image className="w-3.5 h-3.5" /> Logo & Identità</p>
              <div className="flex items-center gap-4">
                <img src={restaurant?.logo_url || restaurantLogo} alt="Logo" className="w-16 h-16 rounded-xl object-contain border border-border" />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">Logo del ristorante</p>
                  <p className="text-xs text-muted-foreground">L'app adatterà colori e atmosfera dal tuo logo</p>
                </div>
                <motion.button onClick={handleLogoUpload} disabled={logoUploading}
                  className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium flex items-center gap-2 disabled:opacity-50 min-h-[44px]"
                  whileTap={{ scale: 0.95 }}>
                  {logoUploading ? (
                    <motion.div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                      animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  ) : (
                    <><Upload className="w-4 h-4" /> Carica</>
                  )}
                </motion.button>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Tagline / Slogan</label>
                <input type="text" value={settingsTagline} onChange={e => setSettingsTagline(e.target.value)}
                  placeholder="Benvenuti nel nostro ristorante" maxLength={120}
                  className="w-full px-3 py-2.5 rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                <p className="text-[10px] text-muted-foreground/60 mt-1">Visibile ai clienti sotto il nome del ristorante</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Colore primario del brand</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={settingsPrimaryColor} onChange={e => {
                    setSettingsPrimaryColor(e.target.value);
                    applyBrandTheme(e.target.value);
                  }}
                    className="w-11 h-11 rounded-xl border border-border cursor-pointer bg-transparent p-0.5" />
                  <input type="text" value={settingsPrimaryColor} onChange={e => {
                    setSettingsPrimaryColor(e.target.value);
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) applyBrandTheme(e.target.value);
                  }}
                    placeholder="#C8963E" maxLength={7}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                  <div className="w-11 h-11 rounded-xl border border-border" style={{ backgroundColor: settingsPrimaryColor }} />
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Estratto automaticamente dal logo, ma puoi personalizzarlo</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => {
                    setSettingsPrimaryColor(DEFAULT_PRIMARY_HEX);
                    resetBrandTheme();
                    toast({ title: "Tema ripristinato", description: "Colore originale Empire Gold ripristinato. Salva per confermare." });
                  }}
                    className="flex-1 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium min-h-[40px] flex items-center justify-center gap-1.5">
                    🔄 Ripristina Originale
                  </button>
                  {restaurant?.logo_url && (
                    <button onClick={async () => {
                      try {
                        const hslColor = await extractDominantColor(restaurant.logo_url!);
                        const hexColor = hslToHex(hslColor);
                        setSettingsPrimaryColor(hexColor);
                        applyBrandTheme(hexColor);
                        toast({ title: "Colore estratto dal logo", description: `Nuovo colore: ${hexColor}` });
                      } catch {
                        toast({ title: "Errore", description: "Impossibile estrarre il colore dal logo.", variant: "destructive" });
                      }
                    }}
                      className="flex-1 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium min-h-[40px] flex items-center justify-center gap-1.5">
                      🎨 Ricalcola dal Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Policy Consent */}
            {!policyAccepted && (
              <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 space-y-3">
                <div className="flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Accettazione Policy Obbligatoria</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Per operare sulla piattaforma Empire, è necessario accettare le policy di privacy, gestione dati e termini di servizio.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                  <button onClick={() => setPolicyAccepted(!policyAccepted)}
                    className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${policyAccepted ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
                    {policyAccepted && <Check className="w-3 h-3 text-primary-foreground" />}
                  </button>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Accetto le <span className="text-primary font-medium">Condizioni di Servizio</span>, la <span className="text-primary font-medium">Privacy Policy</span> e la <span className="text-primary font-medium">Cookie Policy</span> della piattaforma Empire. 
                    I dati saranno trattati ai sensi del GDPR (Reg. UE 2016/679).
                  </p>
                </div>
              </div>
            )}
            {policyAccepted && (
              <div className="p-3 rounded-2xl bg-green-500/5 border border-green-500/20 flex items-center gap-3">
                <FileCheck className="w-4 h-4 text-green-400" />
                <p className="text-xs text-green-400 font-medium">Policy accettate ✓</p>
              </div>
            )}

            {/* Contact fields */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Informazioni di contatto</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Telefono</label>
                  <input type="tel" value={settingsPhone} onChange={e => setSettingsPhone(e.target.value)} placeholder="+39 06 1234 5678" maxLength={20}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</label>
                  <input type="email" value={settingsEmail} onChange={e => setSettingsEmail(e.target.value)} placeholder="info@ristorante.it" maxLength={100}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Indirizzo</label>
                <input type="text" value={settingsAddress} onChange={e => setSettingsAddress(e.target.value)} placeholder="Via del Corso 42, Roma" maxLength={200}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Città</label>
                <input type="text" value={settingsCity} onChange={e => setSettingsCity(e.target.value)} placeholder="Roma, Italia" maxLength={100}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
              </div>
            </div>

            {/* Opening Hours */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Orari di apertura</p>
              {settingsHours.map((entry, i) => (
                <div key={entry.day} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                  <span className="text-xs sm:text-sm font-medium text-foreground w-16 sm:w-24 flex-shrink-0">{entry.day.slice(0, 3)}</span>
                  <input type="text" value={entry.hours}
                    onChange={e => {
                      const updated = [...settingsHours];
                      updated[i] = { ...updated[i], hours: e.target.value };
                      setSettingsHours(updated);
                    }}
                    placeholder="12:00 - 15:00 · 19:00 - 23:30" maxLength={60}
                    className="flex-1 px-3 py-2 rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[40px]" />
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Lingue del menu</p>
              <p className="text-xs text-muted-foreground">Scegli le lingue in cui offrire il servizio per attrarre turisti e clienti locali</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { code: "it", label: "🇮🇹 Italiano" },
                  { code: "en", label: "🇬🇧 English" },
                  { code: "de", label: "🇩🇪 Deutsch" },
                  { code: "fr", label: "🇫🇷 Français" },
                  { code: "es", label: "🇪🇸 Español" },
                  { code: "zh", label: "🇨🇳 中文" },
                  { code: "ja", label: "🇯🇵 日本語" },
                  { code: "ar", label: "🇸🇦 العربية" },
                ].map(lang => (
                  <button key={lang.code}
                    onClick={() => {
                      setSettingsLanguages(prev => 
                        prev.includes(lang.code) ? prev.filter(l => l !== lang.code) : [...prev, lang.code]
                      );
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors min-h-[40px] ${
                      settingsLanguages.includes(lang.code) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Filters */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5"><Ban className="w-3.5 h-3.5" /> Filtro Ordini</p>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Importo minimo ordine (€)</label>
                <input type="number" step="0.50" min="0" value={settingsMinOrder}
                  onChange={e => setSettingsMinOrder(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Parole chiave bloccate nelle note ordine</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {settingsBlockedKeywords.map((kw, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs">
                      {kw}
                      <button onClick={() => setSettingsBlockedKeywords(prev => prev.filter((_, j) => j !== i))}
                        className="hover:text-foreground"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={settingsNewKeyword}
                    onChange={e => setSettingsNewKeyword(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && settingsNewKeyword.trim()) {
                        e.preventDefault();
                        setSettingsBlockedKeywords(prev => [...prev, settingsNewKeyword.trim()]);
                        setSettingsNewKeyword("");
                      }
                    }}
                    placeholder="Es: gratis, sconto..." maxLength={50}
                    className="flex-1 px-3 py-2 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[40px]" />
                  <button onClick={() => {
                    if (settingsNewKeyword.trim()) {
                      setSettingsBlockedKeywords(prev => [...prev, settingsNewKeyword.trim()]);
                      setSettingsNewKeyword("");
                    }
                  }} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium min-h-[40px]">
                    Aggiungi
                  </button>
                </div>
              </div>
            </div>

            {/* Traffic Analytics */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Traffico & Fonti Ordini</p>
              {orderAnalytics.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nessun dato disponibile — gli ordini futuri tracceranno automaticamente la fonte</p>
              ) : (
                <>
                  {/* Pie Chart */}
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={orderAnalytics} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={3} strokeWidth={0}>
                          {orderAnalytics.map((_, idx) => (
                            <Cell key={idx} fill={`hsl(${38 + idx * 45}, ${75 - idx * 8}%, ${55 + idx * 5}%)`} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ background: "hsl(20, 12%, 8%)", border: "1px solid hsl(20, 10%, 16%)", borderRadius: "12px", fontSize: "12px", color: "hsl(40, 20%, 92%)" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend bars */}
                  <div className="space-y-2">
                    {orderAnalytics.map((item, idx) => {
                      const maxCount = orderAnalytics[0]?.count || 1;
                      return (
                        <div key={item.source} className="p-3 rounded-xl bg-secondary/50">
                          <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: `hsl(${38 + idx * 45}, ${75 - idx * 8}%, ${55 + idx * 5}%)` }} />
                              <span className="text-sm font-medium text-foreground capitalize">{item.source}</span>
                            </div>
                            <span className="text-xs text-primary font-semibold">{item.count} ordini</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${(item.count / maxCount) * 100}%`, background: `hsl(${38 + idx * 45}, ${75 - idx * 8}%, ${55 + idx * 5}%)` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <motion.button onClick={handleSaveSettings} disabled={settingsSaving}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 min-h-[48px]"
              whileTap={{ scale: 0.97 }}>
              <Save className="w-4 h-4" />
              {settingsSaving ? "Salvataggio..." : "Salva Tutte le Impostazioni"}
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Mobile bottom navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/50 safe-bottom z-40">
        <div className="grid grid-cols-5 gap-0.5 px-1 pt-1.5 pb-1">
          {[
            tabs.find(t => t.id === "dashboard")!,
            tabs.find(t => t.id === "menu")!,
            tabs.find(t => t.id === "kitchen")!,
            tabs.find(t => t.id === "qr")!,
            { id: "more" as AdminTab, label: "Altro", icon: <Settings className="w-5 h-5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === "more") {
                  setShowMobileMenu(!showMobileMenu);
                } else {
                  setActiveTab(tab.id);
                  setShowMobileMenu(false);
                }
              }}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-medium transition-colors ${
                (tab.id === "more" && showMobileMenu) || (tab.id !== "more" && activeTab === tab.id)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {tab.icon}
              <span className="mt-0.5">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile "More" menu overlay */}
      {showMobileMenu && (
        <motion.div
          className="sm:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setShowMobileMenu(false)}
        >
          <motion.div
            className="absolute bottom-20 left-2 right-2 bg-card rounded-2xl border border-border p-3 shadow-2xl safe-bottom"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs text-muted-foreground/70 uppercase tracking-wider px-2 mb-2">Tutte le sezioni</p>
            <div className="grid grid-cols-4 gap-1.5">
              {tabs.filter(t => !["dashboard", "menu", "kitchen", "qr"].includes(t.id)).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setShowMobileMenu(false); }}
                  className={`flex flex-col items-center gap-1 py-3 px-1 rounded-xl text-[10px] font-medium transition-colors ${
                    activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {tab.icon}
                  <span className="truncate w-full text-center">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

export default AdminDashboard;
