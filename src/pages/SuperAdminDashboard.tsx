import { useState } from "react";
import { motion } from "framer-motion";
import {
  Crown, Power, TrendingUp, DollarSign, Users, Store,
  Megaphone, Eye, EyeOff, BarChart3, Shield, ArrowRight,
  AlertTriangle, Settings, LogOut, Search, Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  monthlyRevenue: number;
  orders: number;
  fee2percent: number;
  city: string;
}

const demoTenants: Tenant[] = [
  { id: "1", name: "Impero Roma", slug: "impero-roma", active: true, monthlyRevenue: 28500, orders: 1140, fee2percent: 570, city: "Roma" },
  { id: "2", name: "La Bella Napoli", slug: "bella-napoli", active: true, monthlyRevenue: 22000, orders: 880, fee2percent: 440, city: "Napoli" },
  { id: "3", name: "Trattoria Milano", slug: "trattoria-milano", active: true, monthlyRevenue: 35200, orders: 1408, fee2percent: 704, city: "Milano" },
  { id: "4", name: "Gusto Firenze", slug: "gusto-firenze", active: false, monthlyRevenue: 0, orders: 0, fee2percent: 0, city: "Firenze" },
  { id: "5", name: "Sapori di Sicilia", slug: "sapori-sicilia", active: true, monthlyRevenue: 18700, orders: 748, fee2percent: 374, city: "Palermo" },
];

const demoAds = [
  { id: "1", brand: "Coca-Cola Italia", placement: "Carrello", impressions: 12400, clicks: 890, revenue: 1250, active: true },
  { id: "2", brand: "San Pellegrino", placement: "Menu Bevande", impressions: 8900, clicks: 520, revenue: 780, active: true },
  { id: "3", brand: "Barilla Premium", placement: "Checkout", impressions: 5600, clicks: 310, revenue: 450, active: false },
];

type SuperTab = "overview" | "tenants" | "ads" | "billing";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SuperTab>("overview");
  const [tenants, setTenants] = useState(demoTenants);
  const [searchTenant, setSearchTenant] = useState("");

  const totalRevenue = tenants.reduce((s, t) => s + t.monthlyRevenue, 0);
  const totalFee = tenants.reduce((s, t) => s + t.fee2percent, 0);
  const totalOrders = tenants.reduce((s, t) => s + t.orders, 0);
  const activeTenants = tenants.filter((t) => t.active).length;

  const toggleTenant = (id: string) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(searchTenant.toLowerCase())
  );

  const tabs: { id: SuperTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "tenants", label: "Tenant", icon: <Store className="w-5 h-5" /> },
    { id: "ads", label: "B2B Ads", icon: <Megaphone className="w-5 h-5" /> },
    { id: "billing", label: "Fatture", icon: <DollarSign className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">Super Admin</h1>
            <p className="text-xs text-primary">kevin97bernardini@gmail.com</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <LogOut className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-5 py-3 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 pb-8">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-card border border-primary/20">
                <Crown className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-primary">€{totalFee.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Rendita 2% (mese)</p>
              </div>
              <div className="p-4 rounded-2xl bg-card">
                <TrendingUp className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">€{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Transato totale</p>
              </div>
              <div className="p-4 rounded-2xl bg-card">
                <Store className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{activeTenants}/{tenants.length}</p>
                <p className="text-xs text-muted-foreground">Locali attivi</p>
              </div>
              <div className="p-4 rounded-2xl bg-card">
                <Users className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{totalOrders.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Ordini totali</p>
              </div>
            </div>

            {/* Revenue chart placeholder */}
            <div className="p-5 rounded-2xl bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-4">Rendita 2% — Ultimi 6 mesi</h3>
              <div className="flex items-end gap-2 h-32">
                {[380, 520, 610, 780, 950, totalFee].map((val, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-primary/20 rounded-t-lg relative overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / totalFee) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <div
                      className="absolute bottom-0 inset-x-0 bg-primary rounded-t-lg"
                      style={{ height: `${(val / totalFee) * 100}%` }}
                    />
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                {["Lug", "Ago", "Set", "Ott", "Nov", "Dic"].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>

            {/* Top tenants */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Top performer</h3>
              <div className="space-y-2">
                {tenants
                  .filter((t) => t.active)
                  .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
                  .slice(0, 3)
                  .map((t, i) => (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-card">
                      <span className="text-lg font-display font-bold text-primary w-6">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.city} · {t.orders} ordini</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-display font-bold text-foreground">€{t.monthlyRevenue.toLocaleString()}</p>
                        <p className="text-xs text-primary">+€{t.fee2percent}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TENANTS */}
        {activeTab === "tenants" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cerca ristorante..."
                value={searchTenant}
                onChange={(e) => setSearchTenant(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-2">
              {filteredTenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className={`p-4 rounded-2xl ${tenant.active ? "bg-card" : "bg-card/50 opacity-60"} border ${tenant.active ? "border-border" : "border-accent/20"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{tenant.name}</h4>
                      <p className="text-xs text-muted-foreground">{tenant.city} · /{tenant.slug}</p>
                    </div>
                    {/* Kill Switch */}
                    <button
                      onClick={() => toggleTenant(tenant.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        tenant.active
                          ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                          : "bg-accent/10 text-accent hover:bg-accent/20"
                      }`}
                    >
                      <Power className="w-5 h-5" />
                    </button>
                  </div>
                  {tenant.active && (
                    <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                      <span>€{tenant.monthlyRevenue.toLocaleString()} transato</span>
                      <span>{tenant.orders} ordini</span>
                      <span className="text-primary font-medium">+€{tenant.fee2percent} fee</span>
                    </div>
                  )}
                  {!tenant.active && (
                    <p className="text-xs text-accent mt-1">⛔ Disattivato</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* B2B ADS */}
        {activeTab === "ads" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Sponsorizzazioni B2B</h3>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium">
                <Megaphone className="w-3.5 h-3.5" />
                Nuova
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-card">
              <p className="text-xs text-muted-foreground mb-1">Revenue pubblicitario totale</p>
              <p className="text-2xl font-display font-bold text-primary">
                €{demoAds.reduce((s, a) => s + a.revenue, 0).toLocaleString()}
              </p>
            </div>

            <div className="space-y-3">
              {demoAds.map((ad) => (
                <div key={ad.id} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm text-foreground">{ad.brand}</h4>
                      <p className="text-xs text-muted-foreground">Posizione: {ad.placement}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      ad.active ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"
                    }`}>
                      {ad.active ? "Attivo" : "Pausa"}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{ad.impressions.toLocaleString()} views</span>
                    <span>{ad.clicks} click</span>
                    <span className="text-primary">€{ad.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* BILLING */}
        {activeTab === "billing" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-card">
                <p className="text-xs text-muted-foreground">Setup fee incassate</p>
                <p className="text-xl font-display font-bold text-foreground">€{(tenants.length * 1997).toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-card">
                <p className="text-xs text-muted-foreground">IVA 22% dovuta</p>
                <p className="text-xl font-display font-bold text-foreground">€{Math.round(tenants.length * 1997 * 0.22).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Fatture recenti</h3>
              <div className="space-y-2">
                {[
                  { id: "FT-2026-001", tenant: "Impero Roma", amount: 2436.34, status: "pagata", date: "15 Feb 2026" },
                  { id: "FT-2026-002", tenant: "La Bella Napoli", amount: 2436.34, status: "pagata", date: "10 Feb 2026" },
                  { id: "FT-2026-003", tenant: "Trattoria Milano", amount: 2436.34, status: "pagata", date: "05 Feb 2026" },
                  { id: "FT-2026-004", tenant: "Sapori di Sicilia", amount: 2436.34, status: "in attesa", date: "01 Feb 2026" },
                  { id: "FT-TOKEN-001", tenant: "Impero Roma", amount: 18.30, status: "pagata", date: "20 Feb 2026" },
                ].map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 rounded-xl bg-card">
                    <div>
                      <p className="text-sm font-medium text-foreground">{invoice.id}</p>
                      <p className="text-xs text-muted-foreground">{invoice.tenant} · {invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-display font-bold text-foreground">€{invoice.amount.toFixed(2)}</p>
                      <span className={`text-xs ${invoice.status === "pagata" ? "text-green-400" : "text-amber-400"}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
