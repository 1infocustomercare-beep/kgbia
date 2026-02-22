import { useState } from "react";
import { motion } from "framer-motion";
import { 
  UtensilsCrossed, LayoutDashboard, ChefHat, TrendingUp, 
  LogOut, AlertTriangle, Star, GraduationCap,
  Plus, Edit, Trash2, DollarSign, Users, ShoppingCart,
  Camera, Sparkles, Coins, Wand2, QrCode, ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { demoMenu, menuCategories } from "@/data/demo-restaurant";
import type { MenuItem, Order } from "@/types/restaurant";
import restaurantLogo from "@/assets/restaurant-logo.png";

type AdminTab = "dashboard" | "menu" | "kitchen" | "ai" | "tokens" | "qr" | "panic" | "reviews" | "academy";

const demoOrders: Order[] = [
  {
    id: "ORD-001",
    items: [{ ...demoMenu[0], quantity: 2 }, { ...demoMenu[4], quantity: 1 }],
    total: 39.0,
    status: "pending",
    customerName: "Marco Rossi",
    customerPhone: "+39 333 1234567",
    customerAddress: "Via Roma 42, Roma",
    notes: "Senza cipolla",
    createdAt: new Date(Date.now() - 5 * 60000),
    type: "delivery",
  },
  {
    id: "ORD-002",
    items: [{ ...demoMenu[12], quantity: 1 }],
    total: 38.0,
    status: "preparing",
    customerName: "Laura Bianchi",
    customerPhone: "+39 347 9876543",
    customerAddress: "",
    notes: "",
    createdAt: new Date(Date.now() - 15 * 60000),
    type: "table",
    tableNumber: 5,
  },
  {
    id: "ORD-003",
    items: [{ ...demoMenu[8], quantity: 3 }, { ...demoMenu[15], quantity: 2 }],
    total: 62.0,
    status: "ready",
    customerName: "Giovanni Verdi",
    customerPhone: "+39 340 5551234",
    customerAddress: "Via Appia 10, Roma",
    notes: "Citofonare Verdi",
    createdAt: new Date(Date.now() - 25 * 60000),
    type: "delivery",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [panicPercent, setPanicPercent] = useState(0);
  const [menuItems] = useState<MenuItem[]>(demoMenu);
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [aiTokens, setAiTokens] = useState(12);
  const [ocrUploading, setOcrUploading] = useState(false);
  const [ocrResult, setOcrResult] = useState<string[] | null>(null);

  const restaurantSlug = "impero-roma";
  const menuUrl = `${window.location.origin}/r/${restaurantSlug}`;

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

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const statusColors: Record<Order["status"], string> = {
    pending: "bg-amber-500/20 text-amber-400",
    preparing: "bg-blue-500/20 text-blue-400",
    ready: "bg-green-500/20 text-green-400",
    delivered: "bg-muted text-muted-foreground",
  };

  const statusLabels: Record<Order["status"], string> = {
    pending: "In attesa",
    preparing: "In preparazione",
    ready: "Pronto",
    delivered: "Consegnato",
  };

  const todayRevenue = demoOrders.reduce((s, o) => s + o.total, 0);

  const handleOcrUpload = () => {
    if (aiTokens <= 0) return;
    setOcrUploading(true);
    setTimeout(() => {
      setOcrResult([
        "Bruschetta al Pomodoro - €7.00",
        "Spaghetti alla Carbonara - €12.00",
        "Pizza Napoli - €10.00",
        "Insalata Mista - €6.50",
        "Dolce del Giorno - €5.00",
      ]);
      setAiTokens((t) => t - 1);
      setOcrUploading(false);
    }, 2000);
  };

  // Generate QR as SVG data (simple QR-like visual placeholder)
  const qrSvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="white" rx="16"/><rect x="20" y="20" width="60" height="60" rx="4" fill="#1a1a1a"/><rect x="28" y="28" width="44" height="44" rx="2" fill="white"/><rect x="36" y="36" width="28" height="28" rx="2" fill="#1a1a1a"/><rect x="120" y="20" width="60" height="60" rx="4" fill="#1a1a1a"/><rect x="128" y="28" width="44" height="44" rx="2" fill="white"/><rect x="136" y="36" width="28" height="28" rx="2" fill="#1a1a1a"/><rect x="20" y="120" width="60" height="60" rx="4" fill="#1a1a1a"/><rect x="28" y="128" width="44" height="44" rx="2" fill="white"/><rect x="36" y="136" width="28" height="28" rx="2" fill="#1a1a1a"/><rect x="90" y="90" width="20" height="20" fill="#1a1a1a"/><rect x="120" y="120" width="16" height="16" fill="#1a1a1a"/><rect x="144" y="120" width="16" height="16" fill="#1a1a1a"/><rect x="120" y="144" width="16" height="16" fill="#1a1a1a"/><rect x="144" y="144" width="16" height="16" fill="#1a1a1a"/><rect x="168" y="144" width="12" height="12" fill="#1a1a1a"/><rect x="120" y="168" width="60" height="12" rx="2" fill="#1a1a1a"/><rect x="90" y="120" width="20" height="12" fill="#1a1a1a"/><rect x="90" y="140" width="20" height="12" fill="#1a1a1a"/><rect x="90" y="160" width="20" height="20" fill="#1a1a1a"/></svg>`)}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <img src={restaurantLogo} alt="" className="w-9 h-9 rounded-lg object-contain" />
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">Impero Roma</h1>
            <p className="text-xs text-primary">Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-lg">
            <Coins className="w-3 h-3 inline mr-1" />{aiTokens} token
          </span>
          <button
            onClick={() => navigate("/admin")}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-5 overflow-x-auto scrollbar-hide pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-8 overflow-y-auto">
        {/* DASHBOARD TAB */}
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
                <p className="text-2xl font-display font-bold text-foreground">{demoOrders.length}</p>
                <p className="text-xs text-muted-foreground">Ordini oggi</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50">
                <Users className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">47</p>
                <p className="text-xs text-muted-foreground">Clienti unici</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50">
                <TrendingUp className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">+12%</p>
                <p className="text-xs text-muted-foreground">vs. ieri</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Ordini recenti</h3>
              <div className="space-y-2">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-3 rounded-xl bg-secondary/50 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.items.length} articoli · €{order.total.toFixed(2)}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* MENU TAB */}
        {activeTab === "menu" && (
          <motion.div className="space-y-3 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">{menuItems.length} piatti</h3>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium">
                <Plus className="w-3.5 h-3.5" />
                Aggiungi
              </button>
            </div>
            {menuCategories.map((cat) => {
              const catItems = menuItems.filter((i) => i.category === cat);
              if (catItems.length === 0) return null;
              return (
                <div key={cat}>
                  <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2">{cat}</p>
                  <div className="space-y-2">
                    {catItems.map((item) => {
                      const adjustedPrice = panicPercent ? item.price * (1 + panicPercent / 100) : item.price;
                      return (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                            <p className="text-primary font-display font-semibold text-sm">
                              €{adjustedPrice.toFixed(2)}
                              {panicPercent !== 0 && (
                                <span className="text-xs text-muted-foreground line-through ml-1">€{item.price.toFixed(2)}</span>
                              )}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                              <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-accent/20 transition-colors">
                              <Trash2 className="w-3.5 h-3.5 text-accent" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* KITCHEN TAB */}
        {activeTab === "kitchen" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-sm font-semibold text-foreground">Kitchen View</h3>
            {orders.map((order) => (
              <div
                key={order.id}
                className={`p-4 rounded-2xl border ${
                  order.status === "pending" ? "border-amber-500/30 bg-amber-500/5" :
                  order.status === "preparing" ? "border-blue-500/30 bg-blue-500/5" :
                  order.status === "ready" ? "border-green-500/30 bg-green-500/5" :
                  "border-border bg-secondary/30"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-foreground">{order.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.customerName} · {order.type === "table" ? `Tavolo ${order.tableNumber}` : order.type === "delivery" ? "Consegna" : "Asporto"}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((Date.now() - order.createdAt.getTime()) / 60000)} min fa
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-foreground">{item.quantity}× {item.name}</span>
                    </div>
                  ))}
                </div>
                {order.notes && (
                  <p className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-lg mb-3">📝 {order.notes}</p>
                )}
                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <button onClick={() => updateOrderStatus(order.id, "preparing")} className="flex-1 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium">
                      Inizia Preparazione
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button onClick={() => updateOrderStatus(order.id, "ready")} className="flex-1 py-2 rounded-xl bg-green-500/20 text-green-400 text-sm font-medium">
                      Segna come Pronto
                    </button>
                  )}
                  {order.status === "ready" && (
                    <button onClick={() => updateOrderStatus(order.id, "delivered")} className="flex-1 py-2 rounded-xl bg-muted text-muted-foreground text-sm font-medium">
                      Consegnato
                    </button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* AI MENU CREATOR TAB */}
        {activeTab === "ai" && (
          <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <Sparkles className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">AI Menu Creator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Carica una foto del menu cartaceo → l'IA estrae testi e crea foto food-porn
              </p>
            </div>
            <motion.div
              className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              whileTap={{ scale: 0.98 }}
              onClick={handleOcrUpload}
            >
              {ocrUploading ? (
                <div className="space-y-3">
                  <motion.div
                    className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-sm text-primary font-medium">Analisi OCR in corso...</p>
                  <p className="text-xs text-muted-foreground">Estrazione testi e prezzi dal menu</p>
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
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">Piatti rilevati dall'IA</h4>
                  <span className="text-xs text-primary">{ocrResult.length} piatti</span>
                </div>
                {ocrResult.map((dish, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Wand2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{dish}</p>
                      <p className="text-xs text-primary">Foto IA generabile</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
                      Genera Foto
                    </button>
                  </motion.div>
                ))}
                <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm gold-glow">
                  Importa tutti nel menu
                </button>
              </motion.div>
            )}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Come funziona
              </h4>
              <ol className="space-y-1 text-xs text-muted-foreground list-decimal list-inside">
                <li>Scatta una foto del menu cartaceo</li>
                <li>L'IA estrae nome piatto, descrizione, prezzo</li>
                <li>Genera foto iper-realistiche per ogni piatto</li>
                <li>Importa tutto nel menu digitale con un click</li>
              </ol>
            </div>
          </motion.div>
        )}

        {/* TOKEN WALLET TAB */}
        {activeTab === "tokens" && (
          <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <Coins className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">Wallet Gettoni IA</h3>
              <p className="text-sm text-muted-foreground mt-1">Ricarica manuale — Zero abbonamenti</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-card to-primary/5 border border-primary/20 text-center">
              <p className="text-5xl font-display font-bold text-gold-gradient">{aiTokens}</p>
              <p className="text-sm text-muted-foreground mt-1">gettoni IA disponibili</p>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>1 token = 1 OCR</span>
                <span>•</span>
                <span>1 token = 1 foto IA</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-3">Ricarica</p>
              <div className="space-y-2">
                {[
                  { tokens: 10, price: 15, popular: false },
                  { tokens: 25, price: 30, popular: true },
                  { tokens: 50, price: 50, popular: false },
                ].map((pack) => (
                  <motion.button
                    key={pack.tokens}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${
                      pack.popular ? "border-primary/40 bg-primary/5" : "border-border bg-card"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Coins className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">{pack.tokens} gettoni</p>
                        {pack.popular && <span className="text-xs text-primary">Più popolare</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-display font-bold text-foreground">€{pack.price}</p>
                      <p className="text-xs text-muted-foreground">+ IVA 22%</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-3">Utilizzo recente</p>
              <div className="space-y-2">
                {[
                  { action: "OCR Menu cartaceo", date: "Oggi, 14:30", tokens: -1 },
                  { action: "Foto IA: Carbonara", date: "Oggi, 14:32", tokens: -1 },
                  { action: "Ricarica 10 gettoni", date: "20 Feb 2026", tokens: 10 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                    <div>
                      <p className="text-sm text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <span className={`text-sm font-display font-bold ${item.tokens > 0 ? "text-green-400" : "text-accent"}`}>
                      {item.tokens > 0 ? "+" : ""}{item.tokens}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 text-center">
              <p className="text-sm font-medium text-foreground">💰 Costo Mensile: <strong className="text-green-400">€0</strong></p>
              <p className="text-xs text-muted-foreground mt-1">Paghi solo quando ricarichi. Nessun abbonamento.</p>
            </div>
          </motion.div>
        )}

        {/* QR CODE TAB */}
        {activeTab === "qr" && (
          <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <QrCode className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">QR Code del Locale</h3>
              <p className="text-sm text-muted-foreground mt-1">Stampa e posiziona sui tavoli per accesso diretto al menu</p>
            </div>

            {/* QR Preview */}
            <div className="flex flex-col items-center">
              <div className="p-6 rounded-3xl bg-card border border-border">
                <div className="bg-white rounded-2xl p-4 mb-4">
                  <img src={qrSvg} alt="QR Code" className="w-48 h-48 mx-auto" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-display font-semibold text-foreground">Impero Roma</p>
                  <p className="text-xs text-muted-foreground mt-1 break-all">{menuUrl}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <motion.button
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm gold-glow flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Simulated download
                  const link = document.createElement("a");
                  link.href = qrSvg;
                  link.download = "qr-impero-roma.svg";
                  link.click();
                }}
              >
                <QrCode className="w-4 h-4" />
                Scarica QR Code (SVG)
              </motion.button>

              <motion.button
                className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(menuUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4" />
                Anteprima Cliente
              </motion.button>
            </div>

            {/* Table cards */}
            <div>
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-3">QR per tavolo</p>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((table) => (
                  <div key={table} className="p-3 rounded-xl bg-secondary/50 text-center">
                    <p className="text-lg font-display font-bold text-foreground">{table}</p>
                    <p className="text-xs text-muted-foreground">Tavolo</p>
                    <p className="text-[10px] text-primary mt-1 truncate">/{restaurantSlug}?t={table}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-primary" />
                Come usare
              </h4>
              <ol className="space-y-1 text-xs text-muted-foreground list-decimal list-inside">
                <li>Scarica il QR Code in formato SVG</li>
                <li>Stampalo e posizionalo su ogni tavolo</li>
                <li>I clienti scansionano e vedono il menu istantaneamente</li>
                <li>Usa "Anteprima Cliente" per verificare come appare</li>
              </ol>
            </div>
          </motion.div>
        )}

        {/* PANIC MODE TAB */}
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
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={panicPercent}
                onChange={(e) => setPanicPercent(Number(e.target.value))}
                className="w-full accent-primary h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>-50%</span>
                <span>0%</span>
                <span>+50%</span>
              </div>
            </div>
            {panicPercent !== 0 && (
              <motion.div className="p-4 rounded-2xl border border-accent/30 bg-accent/5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-sm text-accent font-medium">⚠️ Attenzione</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tutti i {menuItems.length} piatti del menu saranno modificati del {panicPercent > 0 ? "+" : ""}{panicPercent}%.
                  La modifica è visibile istantaneamente ai clienti.
                </p>
              </motion.div>
            )}
            <button onClick={() => setPanicPercent(0)} className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium">
              Resetta a 0%
            </button>
          </motion.div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <Star className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">Review Shield</h3>
              <p className="text-sm text-muted-foreground mt-1">Gestisci le recensioni in modo intelligente</p>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">⭐ 4-5 stelle</span>
                <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">→ Google Reviews</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">⭐ 1-3 stelle</span>
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">→ Private (solo per te)</span>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Recensioni recenti</p>
              {[
                { name: "Giulia M.", stars: 5, text: "Pasta incredibile! Torneremo sicuramente.", public: true },
                { name: "Paolo T.", stars: 2, text: "Servizio lento, pizza fredda.", public: false },
                { name: "Francesca R.", stars: 4, text: "Ottima carne, ambiente accogliente.", public: true },
                { name: "Roberto C.", stars: 5, text: "Miglior carbonara di Roma!", public: true },
                { name: "Chiara B.", stars: 1, text: "Attesa interminabile.", public: false },
              ].map((review, i) => (
                <div key={i} className={`p-3 rounded-xl ${review.public ? "bg-secondary/50" : "bg-accent/5 border border-accent/20"}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{review.name}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < review.stars ? "text-primary fill-primary" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{review.text}</p>
                  {!review.public && <p className="text-xs text-accent mt-1">🔒 Privata — non pubblicata</p>}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ACADEMY TAB */}
        {activeTab === "academy" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-4">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-bold text-foreground">Academy</h3>
              <p className="text-sm text-muted-foreground mt-1">Mini-video tutorial per il tuo marketing</p>
            </div>
            {[
              { title: "Come scattare foto 'food-porn'", duration: "30s", emoji: "📸", done: true },
              { title: "Scrivere descrizioni irresistibili", duration: "30s", emoji: "✍️", done: true },
              { title: "Instagram Stories per ristoranti", duration: "30s", emoji: "📱", done: false },
              { title: "Rispondere alle recensioni negative", duration: "30s", emoji: "💬", done: false },
              { title: "Promozioni last-minute efficaci", duration: "30s", emoji: "🔥", done: false },
              { title: "QR Code sul tavolo: best practice", duration: "30s", emoji: "📋", done: false },
            ].map((lesson, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-4 rounded-xl ${
                  lesson.done ? "bg-primary/10 border border-primary/20" : "bg-secondary/50"
                }`}
              >
                <span className="text-2xl">{lesson.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                </div>
                {lesson.done ? (
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">✓ Fatto</span>
                ) : (
                  <button className="text-xs text-primary-foreground bg-primary px-3 py-1.5 rounded-full font-medium">
                    Guarda
                  </button>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
