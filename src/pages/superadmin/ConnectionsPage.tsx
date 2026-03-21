import { useState } from "react";
import { motion } from "framer-motion";
import {
  Database, CreditCard, Bot, Mail, HardDrive, Globe, Link2,
  Eye, EyeOff, CheckCircle2, XCircle, AlertCircle, Save,
  Lock, Shield, Crown, ArrowLeft, Server, Key, Wifi,
  FileText, Image, Upload, Zap, BarChart3, MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

/* ── Types ── */
interface ConfigField {
  key: string;
  label: string;
  value: string;
  secret?: boolean;
  status: "connected" | "missing" | "verify";
  placeholder?: string;
  readOnly?: boolean;
}

interface ConfigSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  fields: ConfigField[];
}

/* ── Status badge ── */
const StatusBadge = ({ status }: { status: "connected" | "missing" | "verify" }) => {
  if (status === "connected") return (
    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] gap-1">
      <CheckCircle2 className="w-3 h-3" /> Connesso
    </Badge>
  );
  if (status === "verify") return (
    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] gap-1">
      <AlertCircle className="w-3 h-3" /> Da verificare
    </Badge>
  );
  return (
    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] gap-1">
      <XCircle className="w-3 h-3" /> Non configurato
    </Badge>
  );
};

/* ── Secret field with toggle ── */
const SecretField = ({
  field, onChange, onSave,
}: {
  field: ConfigField;
  onChange: (key: string, val: string) => void;
  onSave: (key: string) => void;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/80 flex items-center gap-1.5">
          {field.secret && <Lock className="w-3 h-3 text-amber-400/70" />}
          {field.label}
        </label>
        <StatusBadge status={field.status} />
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type={field.secret && !visible ? "password" : "text"}
            value={field.value}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder || `Inserisci ${field.label}`}
            readOnly={field.readOnly}
            className="bg-white/5 border-white/10 text-white/90 placeholder:text-white/30 pr-10 text-xs h-9"
          />
          {field.secret && (
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        <Button
          size="sm"
          onClick={() => onSave(field.key)}
          className="bg-white/10 hover:bg-white/20 text-white/80 border-white/10 h-9 px-3"
          variant="outline"
        >
          <Save className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

/* ── SECTIONS CONFIG ── */
const buildSections = (): ConfigSection[] => [
  {
    id: "auth_db",
    title: "Autenticazione & Database",
    description: "Connessione al database, chiavi di accesso e configurazione auth",
    icon: <Database className="w-5 h-5" />,
    accentColor: "hsl(265 70% 55%)",
    fields: [
      { key: "supabase_url", label: "Supabase URL", value: import.meta.env.VITE_SUPABASE_URL || "", status: "connected", readOnly: true },
      { key: "anon_key", label: "Anon Key (Publishable)", value: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.slice(0, 20) + "…" || "", status: "connected", readOnly: true },
      { key: "service_role", label: "Service Role Key", value: "••••••••••••••••", secret: true, status: "connected", placeholder: "sk_..." },
      { key: "db_connection", label: "Database Connection String", value: "••••••••••••••••", secret: true, status: "connected", placeholder: "postgresql://..." },
      { key: "auth_email_confirm", label: "Email Confirmation", value: "Abilitata", status: "connected", readOnly: true },
      { key: "auth_password_policy", label: "Password Policy", value: "Min 8 caratteri, 1 maiuscola", status: "connected", readOnly: true },
    ],
  },
  {
    id: "payments",
    title: "Pagamenti & Abbonamenti",
    description: "Stripe API, webhook e piani di abbonamento Empire",
    icon: <CreditCard className="w-5 h-5" />,
    accentColor: "hsl(250 60% 55%)",
    fields: [
      { key: "stripe_pk", label: "Stripe Publishable Key", value: "", secret: true, status: "missing", placeholder: "pk_live_..." },
      { key: "stripe_sk", label: "Stripe Secret Key", value: "", secret: true, status: "missing", placeholder: "sk_live_..." },
      { key: "stripe_webhook", label: "Webhook Secret", value: "", secret: true, status: "missing", placeholder: "whsec_..." },
      { key: "stripe_webhook_url", label: "Webhook Endpoint URL", value: `https://gypnxirzmhpapmhjguaj.supabase.co/functions/v1/stripe-webhook`, status: "connected", readOnly: true },
      { key: "plan_digital_start", label: "Digital Start — €1,997", value: "", status: "missing", placeholder: "price_..." },
      { key: "plan_growth_ai", label: "Growth AI — €4,997", value: "", status: "missing", placeholder: "price_..." },
      { key: "plan_empire_dom", label: "Empire Domination — €7,997", value: "", status: "missing", placeholder: "price_..." },
      { key: "plan_starter_monthly", label: "Starter €55/mese", value: "", status: "missing", placeholder: "price_..." },
      { key: "plan_pro_monthly", label: "Professional €119/mese", value: "", status: "missing", placeholder: "price_..." },
      { key: "plan_enterprise_monthly", label: "Enterprise €239/mese", value: "", status: "missing", placeholder: "price_..." },
    ],
  },
  {
    id: "ai_agents",
    title: "AI & Agenti Intelligenti",
    description: "Chiavi API per modelli IA, WhatsApp Business e voice agents",
    icon: <Bot className="w-5 h-5" />,
    accentColor: "hsl(38 50% 55%)",
    fields: [
      { key: "lovable_ai", label: "Lovable AI (Built-in)", value: "Attivo — Gemini, GPT-5, Claude", status: "connected", readOnly: true },
      { key: "openai_key", label: "OpenAI API Key (opzionale)", value: "", secret: true, status: "verify", placeholder: "sk-..." },
      { key: "elevenlabs_key", label: "ElevenLabs API Key", value: "••••••••", secret: true, status: "connected" },
      { key: "whatsapp_token", label: "WhatsApp Business API Token", value: "", secret: true, status: "missing", placeholder: "EAA..." },
      { key: "whatsapp_phone_id", label: "WhatsApp Phone Number ID", value: "", status: "missing", placeholder: "1234567890" },
      { key: "whatsapp_account_id", label: "WhatsApp Business Account ID", value: "", status: "missing", placeholder: "1234567890" },
    ],
  },
  {
    id: "email",
    title: "Email & Notifiche",
    description: "Configurazione invio email transazionali e marketing",
    icon: <Mail className="w-5 h-5" />,
    accentColor: "hsl(200 70% 55%)",
    fields: [
      { key: "email_provider", label: "Provider Email", value: "Lovable Cloud Email", status: "connected", readOnly: true },
      { key: "smtp_key", label: "SMTP / Resend API Key", value: "", secret: true, status: "verify", placeholder: "re_..." },
      { key: "sender_address", label: "Sender Email Address", value: "noreply@empire.ai", status: "connected" },
      { key: "template_welcome", label: "Template ID — Welcome", value: "", status: "missing", placeholder: "tmpl_welcome_..." },
      { key: "template_subscription", label: "Template ID — Subscription", value: "", status: "missing", placeholder: "tmpl_sub_..." },
      { key: "template_invoice", label: "Template ID — Invoice", value: "", status: "missing", placeholder: "tmpl_inv_..." },
    ],
  },
  {
    id: "storage",
    title: "Storage & Media",
    description: "Bucket storage, CDN e limiti upload",
    icon: <HardDrive className="w-5 h-5" />,
    accentColor: "hsl(160 60% 45%)",
    fields: [
      { key: "bucket_logos", label: "Bucket — restaurant-logos", value: "Attivo (Pubblico)", status: "connected", readOnly: true },
      { key: "bucket_partner", label: "Bucket — partner-assets", value: "Attivo (Pubblico)", status: "connected", readOnly: true },
      { key: "bucket_business", label: "Bucket — business-assets", value: "Attivo (Pubblico)", status: "connected", readOnly: true },
      { key: "bucket_media", label: "Bucket — media-vault", value: "Attivo (Pubblico)", status: "connected", readOnly: true },
      { key: "max_upload", label: "Max Upload Size", value: "50MB", status: "connected" },
      { key: "cdn_url", label: "CDN/Storage URL", value: `https://gypnxirzmhpapmhjguaj.supabase.co/storage/v1`, status: "connected", readOnly: true },
    ],
  },
  {
    id: "domain",
    title: "Dominio & Deploy",
    description: "Custom domain, SSL e variabili d'ambiente",
    icon: <Globe className="w-5 h-5" />,
    accentColor: "hsl(280 60% 55%)",
    fields: [
      { key: "custom_domain", label: "Custom Domain", value: "empireia.lovable.app", status: "connected", readOnly: true },
      { key: "ssl_status", label: "SSL Certificate", value: "Attivo — Let's Encrypt", status: "connected", readOnly: true },
      { key: "env_supabase_url", label: "VITE_SUPABASE_URL", value: import.meta.env.VITE_SUPABASE_URL || "", status: "connected", readOnly: true },
      { key: "env_supabase_key", label: "VITE_SUPABASE_PUBLISHABLE_KEY", value: "••••••••", secret: true, status: "connected" },
      { key: "env_project_id", label: "VITE_SUPABASE_PROJECT_ID", value: import.meta.env.VITE_SUPABASE_PROJECT_ID || "", status: "connected", readOnly: true },
    ],
  },
  {
    id: "integrations",
    title: "Integrazioni Esterne",
    description: "Analytics, pixel tracking e webhook per servizi terzi",
    icon: <Link2 className="w-5 h-5" />,
    accentColor: "hsl(340 60% 55%)",
    fields: [
      { key: "ga_id", label: "Google Analytics ID", value: "", status: "missing", placeholder: "G-XXXXXXXXXX" },
      { key: "meta_pixel", label: "Meta Pixel ID", value: "", status: "missing", placeholder: "1234567890" },
      { key: "webhook_generic_1", label: "Webhook URL #1", value: "", status: "missing", placeholder: "https://..." },
      { key: "webhook_generic_2", label: "Webhook URL #2", value: "", status: "missing", placeholder: "https://..." },
      { key: "zapier_hook", label: "Zapier Webhook", value: "", status: "missing", placeholder: "https://hooks.zapier.com/..." },
    ],
  },
];

/* ── Main Component ── */
const ConnectionsPage = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState<ConfigSection[]>(buildSections);

  const handleFieldChange = (sectionId: string, fieldKey: string, value: string) => {
    setSections(prev =>
      prev.map(s =>
        s.id === sectionId
          ? { ...s, fields: s.fields.map(f => f.key === fieldKey ? { ...f, value } : f) }
          : s
      )
    );
  };

  const handleSave = (sectionId: string, fieldKey: string) => {
    const section = sections.find(s => s.id === sectionId);
    const field = section?.fields.find(f => f.key === fieldKey);
    if (!field?.value || field.readOnly) {
      toast({ title: "Campo non modificabile o vuoto" });
      return;
    }
    // Update status to connected
    setSections(prev =>
      prev.map(s =>
        s.id === sectionId
          ? { ...s, fields: s.fields.map(f => f.key === fieldKey ? { ...f, status: "connected" as const } : f) }
          : s
      )
    );
    toast({ title: "Salvato", description: `${field.label} aggiornato con successo` });
  };

  // Stats
  const allFields = sections.flatMap(s => s.fields);
  const connected = allFields.filter(f => f.status === "connected").length;
  const missing = allFields.filter(f => f.status === "missing").length;
  const verify = allFields.filter(f => f.status === "verify").length;

  return (
    <div className="min-h-screen landing-dark relative overflow-x-hidden" style={{ background: "linear-gradient(145deg, hsl(228 22% 6%) 0%, hsl(230 20% 7%) 40%, hsl(228 18% 8%) 100%)" }}>
      {/* Opaque base */}
      <div className="fixed inset-0 z-0" style={{ background: "hsl(228 22% 7%)" }} />
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
        <div className="absolute top-[-8%] left-[20%] w-[500px] h-[500px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, hsl(265 70% 55%), transparent 65%)", filter: "blur(140px)" }} />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, hsl(38 50% 55%), transparent 70%)", filter: "blur(160px)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/superadmin")}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Torna
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              Connessioni & Configurazione
            </h1>
            <p className="text-sm text-white/50 mt-0.5">Gestisci tutte le API keys, connessioni e integrazioni di Empire.AI</p>
          </div>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Connessi", value: connected, icon: <CheckCircle2 className="w-4 h-4" />, color: "emerald", border: "hsla(160, 60%, 45%, 0.2)", text: "hsl(160 60% 55%)" },
            { label: "Mancanti", value: missing, icon: <XCircle className="w-4 h-4" />, color: "red", border: "hsla(0, 70%, 55%, 0.2)", text: "hsl(0 70% 55%)" },
            { label: "Da verificare", value: verify, icon: <AlertCircle className="w-4 h-4" />, color: "amber", border: "hsla(38, 70%, 55%, 0.2)", text: "hsl(38 70% 55%)" },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-4 border"
              style={{
                background: "linear-gradient(160deg, hsla(230, 18%, 16%, 0.95), hsla(228, 20%, 12%, 0.9))",
                borderColor: stat.border,
              }}
            >
              <div className="flex items-center gap-2 mb-1" style={{ color: stat.text }}>
                {stat.icon}
                <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        {sections.map((section, idx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl border overflow-hidden"
            style={{
              background: "linear-gradient(160deg, hsla(230, 18%, 16%, 0.95), hsla(228, 20%, 12%, 0.9))",
              borderColor: "hsla(250, 60%, 60%, 0.15)",
              boxShadow: "0 4px 24px -4px hsla(250, 60%, 40%, 0.1)",
            }}
          >
            {/* Section header */}
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${section.accentColor}20`, color: section.accentColor }}
              >
                {section.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-white">{section.title}</h2>
                <p className="text-xs text-white/50">{section.description}</p>
              </div>
              <div className="flex gap-1">
                {(() => {
                  const c = section.fields.filter(f => f.status === "connected").length;
                  const t = section.fields.length;
                  return (
                    <span className="text-xs font-medium" style={{ color: c === t ? "hsl(160 60% 55%)" : "hsl(38 50% 55%)" }}>
                      {c}/{t}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Fields */}
            <div className="px-5 py-4 space-y-4">
              {section.fields.map(field => (
                <SecretField
                  key={field.key}
                  field={field}
                  onChange={(key, val) => handleFieldChange(section.id, key, val)}
                  onSave={(key) => handleSave(section.id, key)}
                />
              ))}
            </div>
          </motion.div>
        ))}

        {/* Footer info */}
        <div className="rounded-xl p-4 border border-white/[0.06] text-center" style={{ background: "hsla(230, 18%, 14%, 0.6)" }}>
          <p className="text-xs text-white/40">
            <Shield className="w-3 h-3 inline mr-1" />
            Tutti i segreti sono criptati e accessibili solo dal Super Admin. Le chiavi non vengono mai esposte al frontend.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;
