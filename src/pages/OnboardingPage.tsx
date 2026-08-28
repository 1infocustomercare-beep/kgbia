import { useEffect, useState, useMemo, useRef } from "react";
import { clearIndustryCache } from "@/hooks/useIndustry";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import GlassBackButton from "@/components/glass/GlassBackButton";
import { Check, ArrowRight, ArrowLeft, Sparkles, Search, Upload, UserPlus, QrCode, ExternalLink, Share2, Palette } from "lucide-react";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import { toast } from "sonner";

const PLANS = [
  {
    id: "essential",
    label: "Digital Start",
    price: "€1.997 una tantum + €49/mese",
    features: ["Setup completo", "App white-label", "Dashboard operativa", "Supporto dedicato"],
  },
  {
    id: "smart_ia",
    label: "Growth AI",
    price: "€4.997 una tantum + €29/mese",
    features: ["Tutto di Digital Start", "AI & automazioni", "CRM avanzato", "Supporto prioritario"],
    popular: true,
  },
  {
    id: "empire_pro",
    label: "Empire Domination",
    price: "€7.997 una tantum + €0/mese",
    features: ["Tutto incluso", "0% commissioni", "AI avanzata", "Account manager dedicato"],
  },
];

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter (Moderno)" },
  { value: "Playfair Display", label: "Playfair (Elegante)" },
  { value: "Poppins", label: "Poppins (Amichevole)" },
  { value: "Montserrat", label: "Montserrat (Business)" },
  { value: "Lora", label: "Lora (Classico)" },
];

const normalizeOnboardingPlan = (plan: string | undefined) => {
  if (plan === "base" || plan === "starter" || plan === "essential") return "essential";
  if (plan === "growth" || plan === "professional" || plan === "smart_ia") return "smart_ia";
  if (plan === "empire" || plan === "enterprise" || plan === "empire_pro") return "empire_pro";
  return "smart_ia";
};

// ── Compliance fiscale italiana ──
const normalizePiva = (v: string) => v.replace(/\s/g, "").toUpperCase().replace(/^IT/, "");
const pivaError = (raw: string): string | null => {
  const v = normalizePiva(raw);
  if (!v) return null;
  if (/[^0-9]/.test(v)) return "La P.IVA può contenere solo 11 cifre (prefisso IT opzionale).";
  if (v.length !== 11) return `La P.IVA italiana deve avere 11 cifre (inserite ${v.length}).`;
  return null;
};
const fiscalCodeError = (raw: string, customerType: "b2b" | "b2c"): string | null => {
  const v = raw.replace(/\s/g, "").toUpperCase();
  if (!v) return customerType === "b2c" ? "Il Codice Fiscale è obbligatorio per i clienti privati." : null;
  const isPersona = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/.test(v);
  const isAzienda = /^\d{11}$/.test(v);
  if (!isPersona && !isAzienda) return "Codice Fiscale non valido: 16 caratteri (persona fisica) o 11 cifre (azienda).";
  return null;
};
const sdiError = (raw: string): string | null => {
  const v = raw.replace(/\s/g, "").toUpperCase();
  if (!v) return null;
  if (!/^[A-Z0-9]{7}$/.test(v)) return "Il Codice Destinatario SDI deve essere di 7 caratteri alfanumerici.";
  return null;
};
const pecError = (raw: string): string | null => {
  const v = raw.trim();
  if (!v) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Indirizzo PEC non valido.";
  return null;
};


export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const signupSector = (user?.user_metadata?.signup_sector as IndustryId | undefined) ?? "";
  const signupPlan = normalizeOnboardingPlan(user?.user_metadata?.signup_plan as string | undefined);
  const hasPresetCheckoutSelection = Boolean(signupSector && user?.user_metadata?.signup_plan);

  const [step, setStep] = useState(hasPresetCheckoutSelection ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [searchIndustry, setSearchIndustry] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    industry: signupSector,
    phone: "",
    city: "",
    address: "",
    email: "",
    whatsapp: "",
    piva: "",
    customerType: "b2b" as "b2b" | "b2c",
    fiscalCode: "",
    sdiCode: "",
    pec: "",
    plan: signupPlan,
    primaryColor: "#C8963E",
    fontFamily: "Inter",
    staffName: "",
    staffEmail: "",
    staffPin: "",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      industry: prev.industry || signupSector,
      plan: prev.plan || signupPlan,
    }));
  }, [signupSector, signupPlan]);

  useEffect(() => {
    if (hasPresetCheckoutSelection && step === 0) {
      setStep(1);
    }
  }, [hasPresetCheckoutSelection, step]);

  const filteredIndustries = useMemo(() => {
    const all = Object.values(INDUSTRY_CONFIGS);
    if (!searchIndustry.trim()) return all;
    const q = searchIndustry.toLowerCase();
    return all.filter(c => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [searchIndustry]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (!form.name || !form.industry) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    if (!user) {
      // Salva il form in sessionStorage così può essere ripreso dopo il login
      try {
        sessionStorage.setItem("onboarding_pending", JSON.stringify({ form, step }));
      } catch {}
      toast.info("Crea un account per completare l'attivazione");
      navigate("/auth?next=/onboarding");
      return;
    }

    setLoading(true);
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);

      // Upload logo if provided
      let logoUrl: string | null = null;
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `${slug}/logo.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("business-assets").upload(path, logoFile, { upsert: true });
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from("business-assets").getPublicUrl(path);
          logoUrl = urlData.publicUrl;
        }
      }

      const { data, error: fnError } = await supabase.functions.invoke("create-company", {
        body: {
          name: form.name,
          slug,
          industry: form.industry,
          phone: form.phone || null,
          city: form.city || null,
          address: form.address || null,
          email: form.email || null,
          plan: form.plan,
          primary_color: form.primaryColor,
          font_family: form.fontFamily,
          logo_url: logoUrl,
          tagline: null,
        },
      });

      if (fnError) throw new Error(fnError.message || "Errore nella creazione");
      if (data?.error) throw new Error(data.error);

      const companyId = data?.companyId || data?.company_id || data?.id;

      // Create public_site_config (optional — table may not exist yet)
      if (companyId) {
        try {
          await supabase.from("public_site_config" as any).upsert({
            company_id: companyId,
            headline: form.name,
            tagline: selectedConfig?.description || null,
            primary_color: form.primaryColor,
            font_heading: form.fontFamily,
            font_body: "Inter",
            whatsapp_number: form.whatsapp || form.phone || null,
            booking_enabled: true,
          }, { onConflict: "company_id" });
        } catch {}

        // Dati fiscali tenant (compliance italiana)
        try {
          await supabase.from("company_settings" as any).upsert({
            company_id: companyId,
            customer_type: form.customerType,
            vat: normalizePiva(form.piva) || null,
            fiscal_code: form.fiscalCode.replace(/\s/g, "").toUpperCase() || null,
            sdi_code: form.customerType === "b2b" ? (form.sdiCode.trim().toUpperCase() || null) : null,
            pec: form.customerType === "b2b" ? (form.pec.trim() || null) : null,
            whatsapp: form.whatsapp || form.phone || null,
          }, { onConflict: "company_id" });
        } catch {}



        // Create tenant_subscription with starter plan
        try {
          const { data: plans } = await supabase.from("subscription_plans" as any).select("id, name").order("price_monthly");
          const planMap: Record<string, string> = {};
          (plans || []).forEach((p: any) => { planMap[p.name] = p.id; });
          const planId = planMap[form.plan] || planMap["starter"] || (plans as any)?.[0]?.id;
          if (planId) {
            await supabase.from("tenant_subscriptions" as any).insert({
              company_id: companyId,
              plan_id: planId,
              status: "trialing",
              billing_cycle: "monthly",
              trial_ends_at: new Date(Date.now() + 90 * 86400000).toISOString(),
            });
          }
        } catch {}
      }

      // Clear industry cache so useIndustry fetches the new company
      clearIndustryCache();

      // Force session refresh so AuthContext picks up the new restaurant_admin role
      await supabase.auth.refreshSession();

      toast.success("Azienda creata con successo! Trial 90 giorni attivo.");

      // Small delay to let auth state propagate before navigating
      await new Promise(r => setTimeout(r, 500));
      navigate("/app");
    } catch (err: any) {
      toast.error(err.message || "Errore nella creazione");
    } finally {
      setLoading(false);
    }
  };

  const fiscalStepValid = useMemo(() => {
    if (pivaError(form.piva)) return false;
    if (fiscalCodeError(form.fiscalCode, form.customerType)) return false;
    if (form.customerType === "b2b") {
      if (!normalizePiva(form.piva)) return false;
      if (sdiError(form.sdiCode) || pecError(form.pec)) return false;
      if (!form.sdiCode.trim() && !form.pec.trim()) return false;
    }
    return true;
  }, [form.piva, form.fiscalCode, form.customerType, form.sdiCode, form.pec]);


  const selectedConfig = form.industry ? INDUSTRY_CONFIGS[form.industry as IndustryId] : null;
  const sitePrefix = "/b/";
  const generatedSlug = form.name ? form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "mia-azienda";

  return (
    <>
      <PrestigeTheme />
      <style>{`
        /* Fallback tokens so inputs stay readable even before PrestigeTheme mounts */
        .onboarding-scope {
          --pr-ivory-fb: 42 30% 96%;
          --pr-text-fb: 158 40% 8%;
          --pr-muted-fb: 158 15% 30%;
          --pr-emerald-fb: 158 55% 20%;
          --pr-gold-fb: 42 55% 52%;
        }
        .onboarding-scope input:not([type="color"]):not([type="file"]):not([type="checkbox"]):not([type="radio"]),
        .onboarding-scope textarea,
        .onboarding-scope select {
          background: hsl(var(--pr-ivory, var(--pr-ivory-fb))) !important;
          color: hsl(var(--pr-text-on-light, var(--pr-text-fb))) !important;
          border: 1px solid hsl(var(--pr-emerald, var(--pr-emerald-fb)) / 0.22) !important;
        }
        .onboarding-scope input::placeholder,
        .onboarding-scope textarea::placeholder {
          color: hsl(var(--pr-muted-on-light, var(--pr-muted-fb)) / 0.7) !important;
        }
        .onboarding-scope input:focus-visible,
        .onboarding-scope textarea:focus-visible,
        .onboarding-scope select:focus-visible {
          outline: none !important;
          border-color: hsl(var(--pr-gold, var(--pr-gold-fb))) !important;
          box-shadow: 0 0 0 3px hsl(var(--pr-gold, var(--pr-gold-fb)) / 0.3) !important;
        }
        .onboarding-scope label { color: hsl(var(--pr-text-on-light, var(--pr-text-fb))); font-weight: 600; }
        .onboarding-scope .bg-primary,
        .onboarding-scope button.bg-primary {
          background: linear-gradient(135deg, hsl(var(--pr-gold-light, 42 65% 62%)), hsl(var(--pr-gold, var(--pr-gold-fb))) 55%, hsl(var(--pr-gold-deep, 42 55% 42%))) !important;
          color: hsl(var(--pr-emerald-deep, 158 60% 10%)) !important;
          border: none !important;
        }
        .onboarding-scope .text-primary { color: hsl(var(--pr-gold-deep, 42 55% 42%)) !important; }
        .onboarding-scope .border-primary { border-color: hsl(var(--pr-gold, var(--pr-gold-fb))) !important; }
        .onboarding-scope .bg-primary\\/10 { background: hsl(var(--pr-gold, var(--pr-gold-fb)) / 0.12) !important; }
        .onboarding-scope .bg-primary\\/5 { background: hsl(var(--pr-gold, var(--pr-gold-fb)) / 0.06) !important; }
        .onboarding-scope .hover\\:border-primary\\/50:hover { border-color: hsl(var(--pr-gold, var(--pr-gold-fb)) / 0.55) !important; }
        .onboarding-scope [data-slot="button"]:not(.bg-transparent):not([class*="outline"]) {
          background: linear-gradient(135deg, hsl(var(--pr-gold-light, 42 65% 62%)), hsl(var(--pr-gold, var(--pr-gold-fb))) 55%, hsl(var(--pr-gold-deep, 42 55% 42%)));
          color: hsl(var(--pr-emerald-deep, 158 60% 10%));
        }
        /* Color picker: keep native swatch visible */
        /* ── Empire Liquid Glass (dark) — coerente con home/webapp ── */
        .onboarding-scope {
          background:
            radial-gradient(ellipse 70% 50% at 80% 0%, hsl(var(--pr-aqua, 174 68% 53%) / 0.10), transparent 60%),
            linear-gradient(180deg, hsl(var(--pr-emerald-deep, 158 60% 8%)), hsl(200 40% 6%));
          color: hsl(0 0% 100% / 0.92);
        }
        .onboarding-scope h1, .onboarding-scope h2, .onboarding-scope h3 { color: hsl(0 0% 100% / 0.97); }
        .onboarding-scope .text-muted-foreground { color: hsl(0 0% 100% / 0.68) !important; }
        .onboarding-scope label { color: hsl(0 0% 100% / 0.9) !important; }
        .onboarding-scope .border-border { border-color: hsl(0 0% 100% / 0.14) !important; }
        .onboarding-scope button.border-2 {
          background: hsl(0 0% 100% / 0.05);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .onboarding-scope button.border-2:hover { background: hsl(0 0% 100% / 0.09); }
        .onboarding-scope .text-primary { color: hsl(var(--pr-aqua, 174 68% 53%)) !important; }
        .onboarding-scope .border-primary { border-color: hsl(var(--pr-aqua, 174 68% 53%) / 0.75) !important; }
        .onboarding-scope .bg-primary\\/10 { background: hsl(var(--pr-aqua, 174 68% 53%) / 0.14) !important; }
        .onboarding-scope input[type="color"] {
          padding: 0 !important;
          background: transparent !important;
        }
      `}</style>
      <div role="main" aria-label="Configurazione account" className="prestige-root prestige-section pglass-scope pglass-app onboarding-scope min-h-screen flex items-center justify-center p-4">

      <div className="w-full max-w-3xl">
        {/* Progress bar — 5 steps */}
        <div
          className="flex items-center justify-center gap-2 mb-6"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={step + 1}
          aria-label={`Passo ${step + 1} di 5`}
        >
          {["Settore", "Dati Azienda", "Brand", "Team", "Go Live"].map((label, i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className={`h-2 rounded-full transition-all ${i <= step ? "w-10" : "w-6"}`}
                style={{
                  background: i <= step
                    ? "linear-gradient(90deg, hsl(var(--pr-aqua, 174 68% 53%)), hsl(var(--pr-gold, 42 55% 52%)))"
                    : "hsl(0 0% 100% / 0.18)",
                }}
              />
              {i <= step && (
                <span className="text-[10px] font-semibold hidden sm:inline" style={{ color: "hsl(var(--pr-aqua, 174 68% 53%))" }}>
                  {label}
                </span>
              )}

            </div>
          ))}
        </div>


        {/* No AnimatePresence: entry-only animation via motion.div avoids exit races that could leave a step empty. */}
        <div>


          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <div className="mb-4 flex justify-start">
                <GlassBackButton to="/" label="Home" variant="inline" className="px-3 text-xs" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 font-heading">Che tipo di attività hai?</h1>
              <p className="text-center text-muted-foreground mb-4">Seleziona settore e piano per personalizzare la piattaforma</p>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={searchIndustry} onChange={e => setSearchIndustry(e.target.value)}
                  aria-label="Cerca settore" placeholder="Cerca settore..." className="pl-10 h-11 min-h-[44px]" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[35vh] overflow-y-auto pr-1 mb-6">
                {filteredIndustries.map(cfg => {
                  const selected = form.industry === cfg.id;
                  return (
                    <button key={cfg.id} onClick={() => setForm(p => ({ ...p, industry: cfg.id, primaryColor: cfg.defaultPrimaryColor || "#C8963E" }))}
                      className={`p-3 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                        selected ? "border-primary bg-primary/10 shadow-lg" : "border-border hover:border-primary/50"}`}>
                      <span className="text-2xl block mb-1">{cfg.emoji}</span>
                      <span className="text-xs font-semibold block truncate">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Inline plan selection */}
              <h2 className="text-lg font-semibold mb-3">Scegli il Piano</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {PLANS.map(plan => {
                  const selected = form.plan === plan.id;
                  return (
                    <button key={plan.id} onClick={() => setForm(p => ({ ...p, plan: plan.id }))}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                      {plan.popular && <Badge className="absolute -top-2.5 right-3 bg-primary text-primary-foreground text-[10px]">Popolare</Badge>}
                      <h3 className="text-sm font-bold">{plan.label}</h3>
                      <p className="text-lg font-bold text-primary">{plan.price}</p>
                      <ul className="space-y-0.5 mt-2">
                        {plan.features.map(f => <li key={f} className="text-xs text-muted-foreground flex items-center gap-1"><Check className="w-3 h-3 text-primary" />{f}</li>)}
                      </ul>
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-xs text-muted-foreground mb-4">🎁 90 giorni di prova senza impegno su tutti i piani</p>

              <Button onClick={() => setStep(1)} disabled={!form.industry} className="w-full h-11 min-h-[44px]" size="lg">
                Continua <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* ─── Step 1: Company Data ─── */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 font-heading">Dati Azienda</h1>
              <p className="text-center text-muted-foreground mb-6">Inserisci le informazioni della tua attività</p>
              <div className="space-y-3">
                <div><Label>Nome Azienda *</Label><Input aria-label="Nome Azienda" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Es. Transfer Roma Luxury" className="h-11 min-h-[44px]" /></div>

                {/* Tipo cliente */}
                <div>
                  <Label>Tipo cliente *</Label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    {([{ id: "b2b", label: "Azienda (B2B)" }, { id: "b2c", label: "Privato (B2C)" }] as const).map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        aria-pressed={form.customerType === opt.id}
                        onClick={() => setForm(p => ({ ...p, customerType: opt.id }))}
                        className={`h-11 min-h-[44px] rounded-md border text-sm font-medium transition-colors ${form.customerType === opt.id ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>P.IVA {form.customerType === "b2b" ? "*" : "(opzionale)"}</Label>
                  <Input aria-label="P.IVA" value={form.piva} onChange={e => setForm(p => ({ ...p, piva: e.target.value }))} placeholder="IT01234567890" className="h-11 min-h-[44px]" />
                  {pivaError(form.piva) && <p className="text-xs text-destructive mt-1">{pivaError(form.piva)}</p>}
                </div>

                <div>
                  <Label>Codice Fiscale {form.customerType === "b2c" ? "*" : "(opzionale se coincide con la P.IVA)"}</Label>
                  <Input aria-label="Codice Fiscale" value={form.fiscalCode} onChange={e => setForm(p => ({ ...p, fiscalCode: e.target.value.toUpperCase() }))} placeholder={form.customerType === "b2c" ? "RSSMRA80A01H501U" : "01234567890"} className="h-11 min-h-[44px]" />
                  {fiscalCodeError(form.fiscalCode, form.customerType) && form.fiscalCode !== "" && <p className="text-xs text-destructive mt-1">{fiscalCodeError(form.fiscalCode, form.customerType)}</p>}
                </div>

                {form.customerType === "b2b" && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">Fatturazione elettronica: indica il Codice Destinatario SDI oppure la PEC (almeno uno dei due).</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label>Codice Destinatario SDI</Label>
                        <Input aria-label="Codice Destinatario SDI" maxLength={7} value={form.sdiCode} onChange={e => setForm(p => ({ ...p, sdiCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") }))} placeholder="ABC1234" className="h-11 min-h-[44px]" />
                        {sdiError(form.sdiCode) && <p className="text-xs text-destructive mt-1">{sdiError(form.sdiCode)}</p>}
                      </div>
                      <div>
                        <Label>PEC</Label>
                        <Input aria-label="PEC" type="email" value={form.pec} onChange={e => setForm(p => ({ ...p, pec: e.target.value }))} placeholder="azienda@pec.it" className="h-11 min-h-[44px]" />
                        {pecError(form.pec) && <p className="text-xs text-destructive mt-1">{pecError(form.pec)}</p>}
                      </div>
                    </div>
                    {!form.sdiCode.trim() && !form.pec.trim() && (
                      <p className="text-xs text-destructive">Inserisci almeno il Codice Destinatario SDI o la PEC per la fatturazione elettronica.</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Indirizzo</Label><Input aria-label="Indirizzo" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Via Roma 1" className="h-11 min-h-[44px]" /></div>
                  <div><Label>Città</Label><Input aria-label="Città" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="Roma" className="h-11 min-h-[44px]" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Telefono</Label><Input aria-label="Telefono" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+39 06..." className="h-11 min-h-[44px]" /></div>
                  <div><Label>Email aziendale</Label><Input aria-label="Email aziendale" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="info@azienda.it" className="h-11 min-h-[44px]" /></div>
                </div>
                <div><Label>WhatsApp</Label><Input aria-label="WhatsApp" value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="+39 333..." className="h-11 min-h-[44px]" /></div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(0)} className="flex-1 h-11 min-h-[44px]"><ArrowLeft className="w-4 h-4 mr-2" /> Indietro</Button>
                  <Button onClick={() => setStep(2)} disabled={!form.name || !fiscalStepValid} className="flex-1 h-11 min-h-[44px]">Continua <ArrowRight className="w-4 h-4 ml-2" /></Button>

                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Step 2: Brand ─── */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 font-heading">Il tuo Brand</h1>
              <p className="text-center text-muted-foreground mb-6">Personalizza logo, colori e font</p>
              <div className="space-y-5">
                {/* Logo upload */}
                <div className="flex flex-col items-center">
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  <button onClick={() => logoInputRef.current?.click()}
                    className="w-28 h-28 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-all overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Carica Logo</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Colors */}
                <div>
                  <Label className="flex items-center gap-2 mb-2"><Palette className="w-4 h-4" /> Colore Primario</Label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={form.primaryColor} onChange={e => setForm(p => ({ ...p, primaryColor: e.target.value }))}
                      className="w-12 h-12 rounded-xl border-2 border-border cursor-pointer" />
                    <Input value={form.primaryColor} onChange={e => setForm(p => ({ ...p, primaryColor: e.target.value }))}
                      className="flex-1 h-11 min-h-[44px] font-mono" />
                    {/* Quick presets */}
                    <div className="flex gap-1.5">
                      {["#C8963E", "#1a1a2e", "#e91e63", "#2196f3", "#4caf50", "#ff9800"].map(c => (
                        <button key={c} onClick={() => setForm(p => ({ ...p, primaryColor: c }))}
                          className="w-7 h-7 rounded-full border-2 border-border hover:scale-110 transition-transform"
                          style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Font */}
                <div>
                  <Label>Font</Label>
                  <select value={form.fontFamily} onChange={e => setForm(p => ({ ...p, fontFamily: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30 h-11 min-h-[44px]">
                    {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 min-h-[44px]"><ArrowLeft className="w-4 h-4 mr-2" /> Indietro</Button>
                  <Button onClick={() => setStep(3)} className="flex-1 h-11 min-h-[44px]">Continua <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Step 3: Team ─── */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 font-heading">Il tuo Team</h1>
              <p className="text-center text-muted-foreground mb-6">Aggiungi il primo membro dello staff (opzionale)</p>
              <div className="space-y-4">
                <Card className="border-border/50">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Primo Staff</p>
                        <p className="text-xs text-muted-foreground">Puoi aggiungere altri membri dopo</p>
                      </div>
                    </div>
                    <div><Label>Nome</Label><Input aria-label="Nome" value={form.staffName} onChange={e => setForm(p => ({ ...p, staffName: e.target.value }))} placeholder="Mario Rossi" className="h-11 min-h-[44px]" /></div>
                    <div><Label>Email</Label><Input aria-label="Email" type="email" value={form.staffEmail} onChange={e => setForm(p => ({ ...p, staffEmail: e.target.value }))} placeholder="staff@azienda.it" className="h-11 min-h-[44px]" /></div>
                    <div><Label>PIN Cucina/Staff (4-6 cifre)</Label><Input aria-label="PIN Cucina/Staff (4-6 cifre)" type="text" inputMode="numeric" value={form.staffPin} onChange={e => setForm(p => ({ ...p, staffPin: e.target.value.replace(/\D/g, "").slice(0, 6) }))} placeholder="1234" className="h-11 min-h-[44px] font-mono tracking-widest" /></div>
                  </CardContent>
                </Card>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11 min-h-[44px]"><ArrowLeft className="w-4 h-4 mr-2" /> Indietro</Button>
                  <Button onClick={() => setStep(4)} className="flex-1 h-11 min-h-[44px]">Continua <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Step 4: Go Live ─── */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 font-heading">Pronti al Lancio! 🚀</h1>
              <p className="text-center text-muted-foreground mb-6">Verifica i dettagli e vai live</p>

              <Card className="border-border/50 mb-4">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between"><span className="text-muted-foreground text-sm">Azienda</span><span className="font-medium text-sm">{form.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground text-sm">Settore</span>
                    <span className="font-medium text-sm">{selectedConfig?.emoji} {selectedConfig?.label}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground text-sm">Piano</span>
                    <span className="font-medium text-sm">{PLANS.find(p => p.id === form.plan)?.label} — {PLANS.find(p => p.id === form.plan)?.price}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground text-sm">Trial</span>
                    <Badge className="bg-green-500/20 text-green-400 text-xs">90 giorni senza impegno</Badge></div>
                  {form.city && <div className="flex justify-between"><span className="text-muted-foreground text-sm">Città</span><span className="font-medium text-sm">{form.city}</span></div>}
                </CardContent>
              </Card>

              {/* Preview link */}
              <Card className="border-primary/20 bg-primary/5 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <QrCode className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-sm">Il tuo sito sarà accessibile a:</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 rounded-lg p-2">
                    <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <code className="text-xs text-primary truncate">{window.location.origin}{sitePrefix}{generatedSlug}</code>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-9 min-h-[36px]"
                      onClick={() => { navigator.clipboard.writeText(`${window.location.origin}${sitePrefix}${generatedSlug}`); toast.success("Link copiato!"); }}>
                      📋 Copia Link
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-9 min-h-[36px]"
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Guarda il mio sito: ${window.location.origin}${sitePrefix}${generatedSlug}`)}`, "_blank")}>
                      <Share2 className="w-3 h-3 mr-1" /> WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1 h-11 min-h-[44px]">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Indietro
                </Button>
                <Button onClick={handleCreate} disabled={loading} className="flex-1 h-11 min-h-[44px]" size="lg">
                  {loading ? "Creazione..." : <><Sparkles className="w-4 h-4 mr-2" /> Avvia Trial Senza Impegno</>}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}