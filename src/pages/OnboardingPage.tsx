import { useState, useMemo } from "react";
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
import { Check, ArrowRight, ArrowLeft, Sparkles, Search } from "lucide-react";
import { toast } from "sonner";

const PLANS = [
  { id: "essential", label: "Essential", price: "€29/mese", features: ["Dashboard base", "1 utente", "Supporto email"] },
  { id: "smart_ia", label: "Smart IA", price: "€59/mese", features: ["Dashboard avanzata", "5 utenti", "AI assistant", "Supporto prioritario"], popular: true },
  { id: "empire_pro", label: "Empire Pro", price: "€89/mese", features: ["Tutto incluso", "Utenti illimitati", "AI avanzata", "Account manager dedicato"] },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchIndustry, setSearchIndustry] = useState("");
  const [form, setForm] = useState({
    name: "",
    industry: "" as IndustryId | "",
    phone: "",
    city: "",
    plan: "smart_ia",
  });

  const filteredIndustries = useMemo(() => {
    const all = Object.values(INDUSTRY_CONFIGS);
    if (!searchIndustry.trim()) return all;
    const q = searchIndustry.toLowerCase();
    return all.filter(c => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }, [searchIndustry]);

  const handleCreate = async () => {
    if (!user || !form.name || !form.industry) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    setLoading(true);
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);

      const { data, error: fnError } = await supabase.functions.invoke("create-company", {
        body: {
          name: form.name,
          slug,
          industry: form.industry,
          phone: form.phone || null,
          city: form.city || null,
          plan: form.plan,
          primary_color: INDUSTRY_CONFIGS[form.industry as IndustryId]?.defaultPrimaryColor || "#C8963E",
        },
      });

      if (fnError) throw new Error(fnError.message || "Errore nella creazione");
      if (data?.error) throw new Error(data.error);

      toast.success("Azienda creata con successo! Trial 90 giorni attivo.");
      navigate("/app");
    } catch (err: any) {
      toast.error(err.message || "Errore nella creazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all ${i <= step ? "bg-primary w-12" : "bg-muted w-8"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Industry Selection */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 font-heading">Che tipo di attività hai?</h1>
              <p className="text-center text-muted-foreground mb-6">Seleziona il tuo settore per personalizzare la piattaforma</p>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchIndustry}
                  onChange={e => setSearchIndustry(e.target.value)}
                  placeholder="Cerca settore..."
                  className="pl-10 h-11 min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {filteredIndustries.map(cfg => {
                  const selected = form.industry === cfg.id;
                  return (
                    <button
                      key={cfg.id}
                      onClick={() => setForm(p => ({ ...p, industry: cfg.id }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                        selected ? "border-primary bg-primary/10 shadow-lg" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-3xl block mb-2">{cfg.emoji}</span>
                      <span className="text-sm font-semibold block">{cfg.label}</span>
                      <span className="text-xs text-muted-foreground line-clamp-2">{cfg.description}</span>
                    </button>
                  );
                })}
              </div>

              {filteredIndustries.length === 0 && (
                <button
                  onClick={() => setForm(p => ({ ...p, industry: "custom" }))}
                  className="w-full mt-4 p-4 rounded-xl border-2 border-dashed border-primary/50 text-center hover:bg-primary/5"
                >
                  <span className="text-2xl block mb-1">⚙️</span>
                  <span className="text-sm font-medium">Il mio settore non è in lista</span>
                </button>
              )}

              <Button onClick={() => setStep(1)} disabled={!form.industry} className="w-full mt-6 h-11 min-h-[44px]" size="lg">
                Continua <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step 1: Company Info */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 font-heading">Dati della tua Azienda</h1>
              <p className="text-center text-muted-foreground mb-8">Inserisci i dati base</p>

              <div className="space-y-4">
                <div><Label>Nome Azienda *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Es. Transfer Roma Luxury" className="h-11 min-h-[44px]" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><Label>Città</Label><Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="Es. Roma" className="h-11 min-h-[44px]" /></div>
                  <div><Label>Telefono</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+39..." className="h-11 min-h-[44px]" /></div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(0)} className="flex-1 h-11 min-h-[44px]">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Indietro
                  </Button>
                  <Button onClick={() => setStep(2)} disabled={!form.name} className="flex-1 h-11 min-h-[44px]">
                    Continua <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Plan Selection */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 font-heading">Scegli il Piano</h1>
              <p className="text-center text-muted-foreground mb-8">90 giorni di prova gratuita su tutti i piani</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map(plan => {
                  const selected = form.plan === plan.id;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setForm(p => ({ ...p, plan: plan.id }))}
                      className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-3 right-4 bg-primary text-primary-foreground">Popolare</Badge>
                      )}
                      <h3 className="text-lg font-bold mb-1">{plan.label}</h3>
                      <p className="text-2xl font-bold text-primary mb-3">{plan.price}</p>
                      <ul className="space-y-1">
                        {plan.features.map(f => (
                          <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                            <Check className="w-3 h-3 text-primary" /> {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 min-h-[44px]">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Indietro
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 h-11 min-h-[44px]">
                  Continua <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 font-heading">Conferma</h1>
              <p className="text-center text-muted-foreground mb-8">Verifica i dettagli e avvia il trial gratuito</p>

              <Card className="border-border/50 mb-6">
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-between"><span className="text-muted-foreground">Azienda</span><span className="font-medium">{form.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Settore</span>
                    <span className="font-medium">{form.industry && INDUSTRY_CONFIGS[form.industry as IndustryId]?.emoji} {form.industry && INDUSTRY_CONFIGS[form.industry as IndustryId]?.label}</span>
                  </div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Piano</span>
                    <span className="font-medium">{PLANS.find(p => p.id === form.plan)?.label} — {PLANS.find(p => p.id === form.plan)?.price}</span>
                  </div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Trial</span>
                    <Badge className="bg-green-500/20 text-green-400">90 giorni gratis</Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11 min-h-[44px]">
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
