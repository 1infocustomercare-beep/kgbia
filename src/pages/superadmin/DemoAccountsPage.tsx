import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, ExternalLink, Shield, Eye, EyeOff, Search, Users, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const INDUSTRIES = [
  "food", "ncc", "beauty", "healthcare", "retail", "fitness",
  "hospitality", "beach", "plumber", "electrician", "agriturismo",
  "cleaning", "legal", "accounting", "garage", "photography",
  "construction", "gardening", "veterinary", "tattoo", "childcare",
  "education", "events", "logistics", "custom",
] as const;

const SLUGS: Record<string, string> = {
  food: "impero-roma", ncc: "royal-transfer-roma", beauty: "glow-beauty-milano",
  healthcare: "studio-salus-torino", retail: "bottega-artigiana-firenze",
  fitness: "iron-gym-milano", hospitality: "villa-belvedere", beach: "lido-azzurro-rimini",
  plumber: "idraulica-rapida-bologna", electrician: "elettrica-moderna-verona",
  agriturismo: "podere-del-sole", cleaning: "pulitopro-modena",
  legal: "studio-martini-napoli", accounting: "studio-rossi-padova",
  garage: "autofficina-rossi-brescia", photography: "luce-studio-firenze",
  construction: "edil-costruzioni-bergamo", gardening: "verde-vivo-lucca",
  veterinary: "clinica-amica-genova", tattoo: "ink-factory-bologna",
  childcare: "piccoli-passi-parma", education: "accademia-sapere-bologna",
  events: "dream-events-milano", logistics: "flash-logistica-piacenza",
  custom: "demo-custom",
};

const LABELS: Record<string, string> = {
  food: "🍽️ Ristorazione", ncc: "🚗 NCC & Trasporto", beauty: "💅 Beauty & Wellness",
  healthcare: "🏥 Studio Medico", retail: "🛍️ Negozio & Retail", fitness: "💪 Palestra & Fitness",
  hospitality: "🏨 Hotel & B&B", beach: "🏖️ Lido & Stabilimento", plumber: "🔧 Idraulico",
  electrician: "⚡ Elettricista", agriturismo: "🌿 Agriturismo", cleaning: "🧹 Impresa Pulizie",
  legal: "⚖️ Studio Legale", accounting: "📊 Commercialista", garage: "🔩 Officina & Garage",
  photography: "📸 Studio Fotografico", construction: "🏗️ Edilizia", gardening: "🌳 Giardinaggio",
  veterinary: "🐾 Veterinario", tattoo: "🎨 Tattoo Studio", childcare: "👶 Asilo Nido",
  education: "📚 Formazione", events: "🎉 Eventi", logistics: "📦 Logistica",
  custom: "⚙️ Custom",
};

const PASSWORD = "Empire2024!";

const CUSTOMER_ACCOUNTS = [
  { email: "cliente-food@empire-test.com", name: "Marco Rossi", industry: "food" },
  { email: "cliente-beauty@empire-test.com", name: "Giulia Bianchi", industry: "beauty" },
  { email: "cliente-ncc@empire-test.com", name: "Luca Verdi", industry: "ncc" },
  { email: "cliente-fitness@empire-test.com", name: "Sara Colombo", industry: "fitness" },
  { email: "cliente-healthcare@empire-test.com", name: "Paolo Moretti", industry: "healthcare" },
  { email: "cliente-hotel@empire-test.com", name: "Anna Ferrari", industry: "hospitality" },
  { email: "cliente-beach@empire-test.com", name: "Davide Ricci", industry: "beach" },
  { email: "cliente-legal@empire-test.com", name: "Francesca Conti", industry: "legal" },
  { email: "cliente-garage@empire-test.com", name: "Roberto Marino", industry: "garage" },
  { email: "cliente-events@empire-test.com", name: "Valentina Romano", industry: "events" },
];

const DemoAccountsPage = () => {
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"admin" | "customer">("admin");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiato!", description: `${label} copiato negli appunti` });
  };

  const getAdminUrl = (industry: string) => {
    const slug = SLUGS[industry];
    if (industry === "food") return `/dashboard`;
    return `/app`;
  };

  const getPublicUrl = (industry: string) => {
    const slug = SLUGS[industry];
    if (industry === "food") return `/r/${slug}`;
    return `/b/${slug}`;
  };

  const filtered = INDUSTRIES.filter(i => {
    if (!search) return true;
    const label = LABELS[i]?.toLowerCase() || i;
    const email = `admin-${i}@empire-test.com`;
    return label.includes(search.toLowerCase()) || email.includes(search.toLowerCase()) || i.includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen landing-dark" style={{ background: "linear-gradient(145deg, hsl(228 22% 6%) 0%, hsl(230 20% 7%) 40%, hsl(228 18% 8%) 100%)" }}>
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b border-border/30" style={{ background: "hsl(228 18% 8% / 0.9)" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/superadmin")} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-sm font-display font-bold text-foreground">Account Demo</h1>
              <p className="text-[0.6rem] text-muted-foreground">{INDUSTRIES.length} admin + {CUSTOMER_ACCOUNTS.length} clienti</p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswords(!showPasswords)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-empire-violet/10 hover:bg-empire-violet/20 transition-colors"
          >
            {showPasswords ? <EyeOff className="w-3.5 h-3.5 text-empire-violet" /> : <Eye className="w-3.5 h-3.5 text-empire-violet" />}
            <span className="text-[0.6rem] font-medium text-empire-violet">{showPasswords ? "Nascondi" : "Mostra"} password</span>
          </button>
        </div>

        {/* Search + View Toggle */}
        <div className="px-4 pb-3 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca settore..."
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-secondary/50 border border-border text-xs focus:outline-none focus:ring-1 focus:ring-empire-violet"
            />
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setView("admin")}
              className={`px-3 py-2 text-[0.6rem] font-medium transition-colors ${view === "admin" ? "bg-empire-violet text-white" : "bg-secondary/30 text-muted-foreground"}`}
            >
              <Users className="w-3 h-3 inline mr-1" />Admin
            </button>
            <button
              onClick={() => setView("customer")}
              className={`px-3 py-2 text-[0.6rem] font-medium transition-colors ${view === "customer" ? "bg-empire-violet text-white" : "bg-secondary/30 text-muted-foreground"}`}
            >
              <Users className="w-3 h-3 inline mr-1" />Clienti
            </button>
          </div>
        </div>
      </div>

      {/* Global Password Banner */}
      <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg border border-empire-violet/20 bg-empire-violet/[0.04]">
        <Shield className="w-3.5 h-3.5 text-empire-violet shrink-0" />
        <p className="text-[0.55rem] text-muted-foreground flex-1">
          Password universale: <span className="font-mono font-bold text-foreground">{showPasswords ? PASSWORD : "••••••••••"}</span>
        </p>
        <button onClick={() => copyToClipboard(PASSWORD, "Password")} className="p-1 rounded hover:bg-empire-violet/10">
          <Copy className="w-3 h-3 text-empire-violet" />
        </button>
      </div>

      {/* Admin Accounts Grid */}
      {view === "admin" && (
        <div className="px-4 py-3 space-y-2">
          {filtered.map((industry, i) => {
            const email = `admin-${industry}@empire-test.com`;
            const label = LABELS[industry] || industry;
            const slug = SLUGS[industry];

            return (
              <motion.div
                key={industry}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden"
              >
                <div className="px-3 py-2.5">
                  {/* Sector Label */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-foreground">{label}</span>
                    <span className="text-[0.5rem] font-mono text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">{slug}</span>
                  </div>

                  {/* Email Row */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[0.6rem] font-mono text-foreground/80 flex-1 truncate">{email}</span>
                    <button onClick={() => copyToClipboard(email, "Email")} className="p-1 rounded hover:bg-secondary">
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        const url = getPublicUrl(industry);
                        window.open(url, "_blank");
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-[0.55rem] font-medium text-muted-foreground"
                    >
                      <Eye className="w-3 h-3" /> Sito Pubblico
                    </button>
                    <button
                      onClick={() => {
                        const url = getAdminUrl(industry);
                        // Copy login info for convenience
                        copyToClipboard(`${email}\n${PASSWORD}`, "Credenziali");
                        window.open(url, "_blank");
                      }}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-empire-violet/15 hover:bg-empire-violet/25 transition-colors text-[0.55rem] font-bold text-empire-violet"
                    >
                      <ExternalLink className="w-3 h-3" /> Dashboard Admin
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Customer Accounts */}
      {view === "customer" && (
        <div className="px-4 py-3 space-y-2">
          {CUSTOMER_ACCOUNTS.map((acc, i) => (
            <motion.div
              key={acc.email}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border border-border bg-card/80 backdrop-blur-sm px-3 py-2.5"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground">{acc.name}</span>
                <span className="text-[0.5rem] font-medium text-empire-violet bg-empire-violet/10 px-1.5 py-0.5 rounded">
                  {LABELS[acc.industry] || acc.industry}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[0.6rem] font-mono text-foreground/80 flex-1 truncate">{acc.email}</span>
                <button onClick={() => copyToClipboard(acc.email, "Email")} className="p-1 rounded hover:bg-secondary">
                  <Copy className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DemoAccountsPage;
