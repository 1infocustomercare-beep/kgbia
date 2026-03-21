import { useState, useMemo, useRef } from "react";
import { clearIndustryCache } from "@/hooks/useIndustry";

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { Check, ArrowRight, ArrowLeft, Sparkles, Search, Upload, UserPlus, QrCode, ExternalLink, Share2, Palette } from "lucide-react";
import { toast } from "sonner";

const PLANS = [
  { id: "essential", label: "Essential", price: "€29/mese", features: ["Dashboard base", "1 utente", "50 gettoni IA/mese", "Supporto email"] },
  { id: "smart_ia", label: "Smart IA", price: "€59/mese", features: ["Dashboard avanzata", "5 utenti", "200 gettoni IA/mese", "AI assistant", "Supporto prioritario"], popular: true },
  { id: "empire_pro", label: "Empire Pro", price: "€89/mese", features: ["Tutto incluso", "Utenti illimitati", "500 gettoni IA/mese", "AI avanzata", "Account manager dedicato"] },
];

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter (Moderno)" },
  { value: "Playfair Display", label: "Playfair (Elegante)" },
  { value: "Poppins", label: "Poppins (Amichevole)" },
  { value: "Montserrat", label: "Montserrat (Business)" },
  { value: "Lora", label: "Lora (Classico)" },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchIndustry, setSearchIndustry] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    industry: "" as IndustryId | "",
    phone: "",
    city: "",
    address: "",
    email: "",
    whatsapp: "",
    piva: "",
    plan: "smart_ia",
    primaryColor: "#C8963E",
    fontFamily: "Inter",
    staffName: "",
    staffEmail: "",
    staffPin: "",
  });

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
    if (!user || !form.name || !form.industry) {
      toast.error("Compila tutti i campi obbligatori");
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

  const selectedConfig = form.industry ? INDUSTRY_CONFIGS[form.industry as IndustryId] : null;
  const generatedSlug = form.name ? form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "mia-azienda";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      
      <div className="w-full max-w-3xl">
        {/* Progress bar — 5 steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {["Settore", "Dati Azienda", "Brand", "Team", "Go Live"].map((label, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`h-2 rounded-full transition-all ${i <= step ? "bg-primary w-10" : "bg-muted w-6"}`} />
              {i <= step && <span className="text-[10px] text-primary font-medium hidden sm:inline">{label}</span>}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ─── Step 0: Industry + Plan ─── */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 font-heading">Che tipo di attività hai?</h1>
              <p className="text-center text-muted-foreground mb-4">Seleziona settore e piano per personalizzare la piattaforma</p>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={searchIndustry} onChange={e => setSearchIndustry(e.target.value)}
                  placeholder="Cerca settore..." className="pl-10 h-11 min-h-[44px]" />
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
              <p className="text-center text-xs text-muted-foreground mb-4">🎁 90 giorni di prova gratuita su tutti i piani</p>

              <Button onClick={() => setStep(1)} disabled={!form.industry} className="w-full h-11 min-h-[44px]" size="lg">
                Continua <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* ─── Step 1: Company Data ─── */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 font-heading">Dati Azienda</h1>
              <p className="text-center text-muted-foreground mb-6">Inserisci le informazioni della tua attività</p>
              <div className="space-y-3">
                <div><Label>Nome Azienda *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Es. Transfer Roma Luxury" className="h-11 min-h-[44px]" /></div>
                <div><Label>P.IVA</Label><Input value={form.piva} onChange={e => setForm(p => ({ ...p, piva: e.target.value }))} placeholder="IT01234567890" className="h-11 min-h-[44px]" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Indirizzo</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Via Roma 1" className="h-11 min-h-[44px]" /></div>
                  <div><Label>Città</Label><Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="Roma" className="h-11 min-h-[44px]" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><Label>Telefono</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+39 06..." className="h-11 min-h-[44px]" /></div>
                  <div><Label>Email aziendale</Label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="info@azienda.it" className="h-11 min-h-[44px]" /></div>
                </div>
                <div><Label>WhatsApp</Label><Input value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="+39 333..." className="h-11 min-h-[44px]" /></div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" onClick={() => setStep(0)} className="flex-1 h-11 min-h-[44px]"><ArrowLeft className="w-4 h-4 mr-2" /> Indietro</Button>
                  <Button onClick={() => setStep(2)} disabled={!form.name} className="flex-1 h-11 min-h-[44px]">Continua <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Step 2: Brand ─── */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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
                    <div><Label>Nome</Label><Input value={form.staffName} onChange={e => setForm(p => ({ ...p, staffName: e.target.value }))} placeholder="Mario Rossi" className="h-11 min-h-[44px]" /></div>
                    <div><Label>Email</Label><Input type="email" value={form.staffEmail} onChange={e => setForm(p => ({ ...p, staffEmail: e.target.value }))} placeholder="staff@azienda.it" className="h-11 min-h-[44px]" /></div>
                    <div><Label>PIN Cucina/Staff (4-6 cifre)</Label><Input type="text" inputMode="numeric" value={form.staffPin} onChange={e => setForm(p => ({ ...p, staffPin: e.target.value.replace(/\D/g, "").slice(0, 6) }))} placeholder="1234" className="h-11 min-h-[44px] font-mono tracking-widest" /></div>
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
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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
                    <Badge className="bg-green-500/20 text-green-400 text-xs">90 giorni gratis</Badge></div>
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
                    <code className="text-xs text-primary truncate">{window.location.origin}/r/{generatedSlug}</code>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-9 min-h-[36px]"
                      onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/r/${generatedSlug}`); toast.success("Link copiato!"); }}>
                      📋 Copia Link
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-9 min-h-[36px]"
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Guarda il mio sito: ${window.location.origin}/r/${generatedSlug}`)}`, "_blank")}>
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
                  {loading ? "Creazione..." : <><Sparkles className="w-4 h-4 mr-2" /> Avvia Trial Gratuito</>}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}