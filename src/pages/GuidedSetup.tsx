import { useState, useEffect } from "react";
import EmpireDNABackground from "@/components/EmpireDNABackground";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChefHat, Truck, ShoppingBag, TableProperties, Palette, Check, ArrowRight, ArrowLeft, Sparkles, Upload, Car, Scissors, Heart, Store, Dumbbell, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { BUSINESS_TYPE_OPTIONS, getBusinessTypeConfig, type BusinessType } from "@/lib/business-type";
import { getMenuPreset } from "@/lib/menu-presets";
import { extractDominantColor, hslToHex } from "@/lib/color-extract";
import { INDUSTRIES, ACTIVE_INDUSTRIES } from "@/data/industries";
import { type IndustryId, INDUSTRY_CONFIGS } from "@/config/industry-config";

type Step = "industry" | "type" | "channels" | "brand" | "done";

const INDUSTRY_ICONS: Record<string, React.ReactNode> = {
  food: <ChefHat className="w-6 h-6" />,
  ncc: <Car className="w-6 h-6" />,
  beauty: <Scissors className="w-6 h-6" />,
  healthcare: <Heart className="w-6 h-6" />,
  retail: <Store className="w-6 h-6" />,
  fitness: <Dumbbell className="w-6 h-6" />,
  hospitality: <Building className="w-6 h-6" />,
};

const BUSINESS_ICONS: Record<BusinessType, string> = {
  restaurant: "🍽️",
  pizzeria: "🍕",
  bar: "🍸",
  bakery: "🧁",
  sushi: "🍣",
};

export default function GuidedSetup() {
  const navigate = useNavigate();
  const { user, roles, loading: authLoading, rolesReady } = useAuth();
  const [saving, setSaving] = useState(false);

  // Industry state
  const [industry, setIndustry] = useState<IndustryId>("food");

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [city, setCity] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("restaurant");
  const [delivery, setDelivery] = useState(true);
  const [takeaway, setTakeaway] = useState(true);
  const [tableOrders, setTableOrders] = useState(true);
  const [primaryColor, setPrimaryColor] = useState("#C8963E");
  const [tagline, setTagline] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const isFood = industry === "food";

  useEffect(() => {
    if (authLoading || !user || !rolesReady) return;

    let isMounted = true;

    const redirectIfAlreadyConfigured = async () => {
      try {
        if (roles.includes("super_admin")) {
          navigate("/superadmin", { replace: true });
          return;
        }

        const [{ data: membership }, { data: ownedCompany }, { data: ownedRestaurant }] = await Promise.all([
          supabase
            .from("company_memberships")
            .select("company_id")
            .eq("user_id", user.id)
            .limit(1)
            .maybeSingle(),
          supabase
            .from("companies")
            .select("industry")
            .eq("owner_id", user.id)
            .limit(1)
            .maybeSingle(),
          supabase
            .from("restaurants")
            .select("id")
            .eq("owner_id", user.id)
            .limit(1)
            .maybeSingle(),
        ]);

        if (!isMounted) return;

        let companyIndustry: string | null = ownedCompany?.industry ?? null;

        if (!companyIndustry && membership?.company_id) {
          const { data: memberCompany } = await supabase
            .from("companies")
            .select("industry")
            .eq("id", membership.company_id)
            .maybeSingle();
          companyIndustry = memberCompany?.industry ?? null;
        }

        if (companyIndustry) {
          navigate(companyIndustry === "food" ? "/dashboard" : "/app", { replace: true });
          return;
        }

        if (ownedRestaurant?.id) {
          navigate("/dashboard", { replace: true });
          return;
        }

        // If user already has restaurant_admin role but no data, redirect to /app
        // instead of showing setup again (prevents re-registration loops)
        if (roles.includes("restaurant_admin")) {
          navigate("/app", { replace: true });
          return;
        }
      } catch (error) {
        console.error("Failed to validate setup access", error);
      }
    };

    void redirectIfAlreadyConfigured();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user, rolesReady, roles, navigate]);

  // Dynamic steps based on industry
  const steps: Step[] = isFood
    ? ["industry", "type", "channels", "brand", "done"]
    : ["industry", "type", "brand", "done"];

  const [step, setStep] = useState<Step>("industry");
  const stepIndex = steps.indexOf(step);
  const totalVisibleSteps = steps.length - 1; // exclude "done"

  const config = getBusinessTypeConfig(businessType);
  const industryConfig = INDUSTRY_CONFIGS[industry];

  const handleIndustryChange = (id: IndustryId) => {
    setIndustry(id);
    setPrimaryColor(INDUSTRY_CONFIGS[id].defaultPrimaryColor);
  };

  const handleBusinessTypeChange = (bt: BusinessType) => {
    setBusinessType(bt);
    const cfg = getBusinessTypeConfig(bt);
    setDelivery(cfg.channels.delivery);
    setTakeaway(cfg.channels.takeaway);
    setTableOrders(cfg.channels.tableOrders);
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File troppo grande (max 5MB)", variant: "destructive" });
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleFinish = async () => {
    if (!user || !name.trim() || !slug.trim()) return;
    setSaving(true);

    const finalSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

    try {
      if (isFood) {
        await createFoodBusiness(finalSlug);
      } else {
        await createCompanyBusiness(finalSlug);
      }
    } catch (err: any) {
      toast({ title: "Errore", description: err?.message || "Riprova", variant: "destructive" });
      setSaving(false);
      return;
    }

    toast({
      title: "🎉 Attività creata!",
      description: `${name} è pronto — settore ${industryConfig.label}`,
    });
    setStep("done");
    setSaving(false);

    setTimeout(() => navigate(isFood ? "/dashboard" : "/app"), 1800);
  };

  const createFoodBusiness = async (finalSlug: string) => {
    // 1. Create restaurant (existing flow)
    const { data: newRest, error } = await supabase.from("restaurants").insert({
      name: name.trim(),
      slug: finalSlug,
      city: city.trim() || null,
      owner_id: user!.id,
      business_type: businessType as any,
      delivery_enabled: delivery,
      takeaway_enabled: takeaway,
      table_orders_enabled: tableOrders,
      primary_color: primaryColor,
      tagline: tagline.trim() || config.copy.reservationKicker,
    } as any).select("id").single();

    if (error || !newRest) throw error || new Error("Creazione fallita");
    const restaurantId = newRest.id;

    // 2. Upload logo
    if (logoFile) {
      const ext = logoFile.name.split(".").pop() || "png";
      const path = `${restaurantId}/logo.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("restaurant-logos").upload(path, logoFile, { upsert: true });
      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from("restaurant-logos").getPublicUrl(path);
        let hex = primaryColor;
        try {
          const hsl = await extractDominantColor(urlData.publicUrl);
          hex = hslToHex(hsl);
        } catch {}
        await supabase.from("restaurants").update({ logo_url: urlData.publicUrl, primary_color: hex }).eq("id", restaurantId);
      }
    }

    // 3. Auto-seed menu items
    const preset = getMenuPreset(businessType);
    const menuRows = preset.map(item => ({
      restaurant_id: restaurantId,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      is_popular: item.is_popular,
      sort_order: item.sort_order,
      is_active: true,
    }));
    await supabase.from("menu_items").insert(menuRows);

    // 4. Set user role
    await supabase
      .from("user_roles")
      .upsert({ user_id: user!.id, role: "restaurant_admin" as any }, { onConflict: "user_id,role" });
  };

  const createCompanyBusiness = async (finalSlug: string) => {
    // 1. Create company
    const { data: newCompany, error } = await supabase.from("companies").insert({
      name: name.trim(),
      slug: finalSlug,
      city: city.trim() || null,
      owner_id: user!.id,
      industry: industry,
      primary_color: primaryColor,
      tagline: tagline.trim() || `Benvenuti — ${industryConfig.label}`,
      modules_enabled: industryConfig.modules.filter(m => m.enabled).map(m => m.id),
      subscription_plan: "essential",
    }).select("id").single();

    if (error || !newCompany) throw error || new Error("Creazione fallita");
    const companyId = newCompany.id;

    // 2. Create membership
    await supabase.from("company_memberships").insert({
      company_id: companyId,
      user_id: user!.id,
      role: "admin",
    });

    // 3. Upload logo to business-assets bucket
    if (logoFile) {
      const ext = logoFile.name.split(".").pop() || "png";
      const path = `${companyId}/logo.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("business-assets").upload(path, logoFile, { upsert: true });
      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from("business-assets").getPublicUrl(path);
        let hex = primaryColor;
        try {
          const hsl = await extractDominantColor(urlData.publicUrl);
          hex = hslToHex(hsl);
        } catch {}
        await supabase.from("companies").update({ logo_url: urlData.publicUrl, primary_color: hex }).eq("id", companyId);
      }
    }

    // 4. Set user role
    await supabase
      .from("user_roles")
      .upsert({ user_id: user!.id, role: "restaurant_admin" as any }, { onConflict: "user_id,role" });
  };

  const nextStep = () => {
    if (stepIndex < steps.length - 1) setStep(steps[stepIndex + 1]);
  };

  const prevStep = () => {
    if (stepIndex > 0) setStep(steps[stepIndex - 1]);
  };

  const canProceed =
    step === "industry" ? true :
    step === "type" ? !!name.trim() && !!slug.trim() :
    step === "channels" ? true :
    step === "brand" ? true : false;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress */}
      <div className="px-6 pt-6 pb-2 safe-top">
        <div className="flex gap-2">
          {steps.slice(0, totalVisibleSteps).map((s, i) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${i <= stepIndex ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">
          Passo {Math.min(stepIndex + 1, totalVisibleSteps)} di {totalVisibleSteps}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          {/* STEP 0: Industry Selection */}
          {step === "industry" && (
            <motion.div key="industry" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5 pt-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">In che settore operi?</h1>
                <p className="text-sm text-muted-foreground mt-1">Scegli il tuo settore e configureremo tutto automaticamente.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {INDUSTRIES.map(ind => {
                  const isSelected = industry === ind.id;
                  const cfg = INDUSTRY_CONFIGS[ind.id];
                  return (
                    <motion.button
                      key={ind.id}
                      onClick={() => handleIndustryChange(ind.id)}
                      className={`relative p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                          : "border-border/50 bg-card hover:border-primary/20"
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 text-lg ${
                        isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {cfg?.emoji || INDUSTRY_ICONS[ind.id] || "🏢"}
                      </div>
                      <p className="text-sm font-bold text-foreground">{ind.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">{ind.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 1: Business Info + Type (food-specific sub-types) */}
          {step === "type" && (
            <motion.div key="type" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5 pt-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {isFood ? "Che tipo di attività hai?" : `Configura la tua ${industryConfig.terminology.company}`}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {isFood ? "Scegli il preset e personalizza tutto dopo." : "Inserisci i dati base della tua attività."}
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")); }}
                  placeholder={`Nome della tua ${industryConfig.terminology.company.toLowerCase()}`}
                  className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-base min-h-[44px]"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{isFood ? "/r/" : "/c/"}</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="slug"
                    className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground font-mono text-sm min-h-[44px]"
                  />
                </div>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Città (opzionale)"
                  className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-base min-h-[44px]"
                />
              </div>

              {/* Food-specific business sub-type selector */}
              {isFood && (
                <div className="grid grid-cols-2 gap-3">
                  {BUSINESS_TYPE_OPTIONS.map(opt => (
                    <motion.button
                      key={opt.value}
                      onClick={() => handleBusinessTypeChange(opt.value)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        businessType === opt.value
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                          : "border-border/50 bg-card hover:border-primary/20"
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-2xl">{BUSINESS_ICONS[opt.value]}</span>
                      <p className="text-sm font-bold text-foreground mt-2">{opt.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{opt.description}</p>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Non-food: show modules preview */}
              {!isFood && (
                <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-3">
                  <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">Moduli inclusi — {industryConfig.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {industryConfig.modules.filter(m => m.enabled).map(mod => (
                      <span key={mod.id} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                        {mod.label}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {industryConfig.modules.filter(m => m.enabled).length} moduli attivi — configurabili nelle Impostazioni
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Channels (Food only) */}
          {step === "channels" && (
            <motion.div key="channels" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5 pt-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">Come servi i tuoi clienti?</h1>
                <p className="text-sm text-muted-foreground mt-1">Attiva i canali che usi. Potrai cambiarli quando vuoi.</p>
              </div>

              {[
                { key: "delivery", label: "Delivery", desc: "Consegna a domicilio", icon: <Truck className="w-5 h-5" />, value: delivery, set: setDelivery },
                { key: "takeaway", label: "Asporto", desc: "Ritiro al locale", icon: <ShoppingBag className="w-5 h-5" />, value: takeaway, set: setTakeaway },
                { key: "tableOrders", label: "Ordini al Tavolo", desc: "QR code e ordini dalla sala", icon: <TableProperties className="w-5 h-5" />, value: tableOrders, set: setTableOrders },
              ].map(ch => (
                <motion.button
                  key={ch.key}
                  onClick={() => ch.set(!ch.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    ch.value ? "border-primary bg-primary/5" : "border-border/50 bg-card"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ch.value ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {ch.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-foreground">{ch.label}</p>
                    <p className="text-[11px] text-muted-foreground">{ch.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${ch.value ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                    {ch.value && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* STEP 3: Brand */}
          {step === "brand" && (
            <motion.div key="brand" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5 pt-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">Personalizza il tuo brand</h1>
                <p className="text-sm text-muted-foreground mt-1">Logo, colore e tagline. Tutto modificabile in seguito.</p>
              </div>

              {/* Logo upload */}
              <div className="flex items-center gap-4">
                <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  )}
                  <input type="file" accept="image/*" onChange={handleLogoSelect} className="hidden" />
                </label>
                <div>
                  <p className="text-sm font-bold text-foreground">Logo</p>
                  <p className="text-[11px] text-muted-foreground">Il colore brand verrà estratto automaticamente</p>
                </div>
              </div>

              {/* Color */}
              <div className="flex items-center gap-3">
                <label className="w-10 h-10 rounded-xl border border-border overflow-hidden cursor-pointer" style={{ backgroundColor: primaryColor }}>
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="opacity-0 w-full h-full cursor-pointer" />
                </label>
                <div>
                  <p className="text-sm font-bold text-foreground">Colore brand</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{primaryColor}</p>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <p className="text-sm font-bold text-foreground mb-2">Tagline</p>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder={isFood ? config.copy.reservationKicker : `Benvenuti — ${industryConfig.label}`}
                  className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground text-base min-h-[44px]"
                />
              </div>

              {/* Preview */}
              <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-2">
                {isFood ? (
                  <>
                    <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">Menu auto-generato: {config.label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[...new Set(getMenuPreset(businessType).map(i => i.category))].map(cat => (
                        <span key={cat} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{getMenuPreset(businessType).length} prodotti pronti — modificabili nello Studio</p>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">Configurazione: {industryConfig.label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {industryConfig.features.map(f => (
                        <span key={f} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                          {f.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Tutto configurabile dal pannello Impostazioni
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* DONE */}
          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center pt-20 space-y-4">
              <motion.div
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles className="w-10 h-10 text-primary" />
              </motion.div>
              <h1 className="text-2xl font-display font-bold text-foreground text-center">
                {name} è pronto! 🎉
              </h1>
              <p className="text-sm text-muted-foreground text-center">
                Stai per essere reindirizzato alla Dashboard...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      {step !== "done" && (
        <div className="fixed bottom-0 inset-x-0 p-6 bg-background/95 backdrop-blur-lg border-t border-border/50 safe-bottom">
          <div className="flex gap-3">
            {stepIndex > 0 && (
              <motion.button
                onClick={prevStep}
                className="px-4 py-3.5 rounded-2xl bg-secondary text-secondary-foreground font-medium min-h-[48px]"
                whileTap={{ scale: 0.97 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            )}
            <motion.button
              onClick={step === "brand" ? handleFinish : nextStep}
              disabled={!canProceed || saving}
              className="flex-1 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-50"
              whileTap={{ scale: 0.97 }}
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : step === "brand" ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Crea la tua attività
                </>
              ) : (
                <>
                  Avanti
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
