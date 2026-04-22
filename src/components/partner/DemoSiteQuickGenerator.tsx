/**
 * DemoSiteQuickGenerator — Wizard rapido 3-step (bottone unico)
 * Step 1: Conferma/scegli template variant
 * Step 2: Anteprima agenti AI + moduli inclusi
 * Step 3: Genera + URL pubblico + WhatsApp ready
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Check, Loader2, Copy, ExternalLink, MessageCircle, Sparkles, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDemoSiteGenerator, type DemoSite } from "@/hooks/useDemoSiteGenerator";
import { useBrandingKitSettings } from "@/hooks/useBrandingKitSettings";
import { findBlueprintBySector, AGENT_LABELS, MODULE_LABELS } from "@/lib/demo-site-blueprints";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  leadId?: string;
  businessName: string;
  sector: string;
  subSector?: string;
  websiteUrl?: string;
  onGenerated?: (site: DemoSite) => void;
}

export default function DemoSiteQuickGenerator({
  open, onClose, leadId, businessName, sector, subSector, websiteUrl, onGenerated,
}: Props) {
  const blueprint = useMemo(() => findBlueprintBySector(sector), [sector]);
  const { settings: branding } = useBrandingKitSettings();
  const { generate, generating } = useDemoSiteGenerator();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [variant, setVariant] = useState<string>(blueprint?.templateVariants?.[0]?.key ?? "default");
  const [result, setResult] = useState<DemoSite | null>(null);

  const handleGenerate = async () => {
    setStep(3);
    const site = await generate({
      leadId, businessName, sector, subSector, websiteUrl,
      templateVariant: variant,
    });
    if (site) {
      setResult(site);
      onGenerated?.(site);
    }
  };

  const handleClose = () => {
    setStep(1); setResult(null); onClose();
  };

  const copy = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    toast({ title: `${label} copiato!` });
  };

  if (!blueprint) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Settore non supportato</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Nessun blueprint disponibile per "{sector}". Contatta il super admin per aggiungerlo.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-amber-400" />
            Demo Site Full Power — {businessName}
          </DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center justify-between px-2 py-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= n ? "bg-amber-500 text-black" : "bg-muted text-muted-foreground"
              }`}>{step > n ? <Check className="w-4 h-4" /> : n}</div>
              {n < 3 && <div className={`flex-1 h-px ${step > n ? "bg-amber-500" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Template */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">Scegli il template di partenza</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Default: usa il branding lockato dal Mockup Suite. Puoi anche scegliere un template dal catalogo.
                </p>
              </div>

              {branding.brandLocked && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-300">
                    Branding Kit lockato — colori e font del lead saranno applicati 1:1.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {blueprint.templateVariants.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setVariant(v.key)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      variant === v.key
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-border hover:border-amber-500/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">{v.name}</span>
                      {variant === v.key && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase">{v.key}</span>
                  </button>
                ))}
              </div>

              <Button onClick={() => setStep(2)} className="w-full mt-3">Avanti — Anteprima</Button>
            </motion.div>
          )}

          {/* STEP 2: Anteprima agenti + moduli */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Cosa includerà il sito demo
                </h3>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">🤖 AGENTI AI ATTIVI ({blueprint.requiredAgents.length})</div>
                <div className="flex flex-wrap gap-2">
                  {blueprint.requiredAgents.map((a) => (
                    <div key={a} className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-xs flex items-center gap-1.5">
                      <span>{AGENT_LABELS[a]?.emoji ?? "🤖"}</span>
                      <span className="font-medium">{AGENT_LABELS[a]?.label ?? a}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">⚙️ MODULI FUNZIONALI ({blueprint.functionalModules.length})</div>
                <div className="flex flex-wrap gap-2">
                  {blueprint.functionalModules.map((m) => (
                    <div key={m} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium">
                      {MODULE_LABELS[m] ?? m}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300">Costo generazione</span>
                  <span className="text-lg font-bold text-amber-400">25 crediti</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Include: scrape + multi-agent setup + seed dati reali + deploy preview pubblica
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Indietro</Button>
                <Button onClick={handleGenerate} disabled={generating} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black">
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Rocket className="w-4 h-4 mr-1" />Genera Ora</>}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Risultato */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {generating || !result ? (
                <div className="py-12 flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
                  <div className="text-center">
                    <p className="text-sm font-semibold">Generazione in corso...</p>
                    <p className="text-xs text-muted-foreground">Scrape → Setup agenti → Seed dati → Deploy</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <Check className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-emerald-300">Sito Demo Pronto!</p>
                    <p className="text-xs text-muted-foreground">Tutto attivo. Mostralo subito al cliente.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-card border border-border">
                      <div className="text-[10px] uppercase text-muted-foreground mb-1">URL Pubblico</div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs flex-1 truncate">{result.preview_url}</code>
                        <button onClick={() => copy(window.location.origin + result.preview_url!, "Link")} className="p-1.5 rounded hover:bg-muted"><Copy className="w-3.5 h-3.5" /></button>
                        <a href={result.preview_url!} target="_blank" rel="noopener" className="p-1.5 rounded hover:bg-muted"><ExternalLink className="w-3.5 h-3.5" /></a>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-card border border-border">
                      <div className="text-[10px] uppercase text-muted-foreground mb-1">Admin Demo</div>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center justify-between"><span className="text-muted-foreground">Email:</span><code>{result.admin_email}</code></div>
                        <div className="flex items-center justify-between"><span className="text-muted-foreground">Password:</span><code>{result.admin_password}</code></div>
                      </div>
                    </div>

                    {result.whatsapp_link && (
                      <a href={result.whatsapp_link} target="_blank" rel="noopener"
                        className="block p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-semibold text-emerald-300">Invia su WhatsApp</span>
                        </div>
                      </a>
                    )}
                  </div>

                  <Button onClick={handleClose} variant="outline" className="w-full">Chiudi</Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
