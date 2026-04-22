import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Rocket, Sparkles, Smartphone, CheckCircle2, ExternalLink, AlertCircle, Bot, Layers, Zap, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SECTOR_OPTIONS } from "@/data/mock-leads-data";
import type { VaultMockupSuite } from "@/hooks/useMockupSuiteVault";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suite: VaultMockupSuite | null;
}

const COST_FULL_DEMO = 25;

const SECTOR_AGENT_COUNT: Record<string, number> = {
  food: 4, ncc: 4, beauty: 3, healthcare: 4, retail: 3, fitness: 3,
  hospitality: 3, hotel: 3, beach: 3, bakery: 2, agriturismo: 2,
  plumber: 2, electrician: 2, cleaning: 2, legal: 2, accounting: 2,
  garage: 2, photography: 2, construction: 2, gardening: 1,
  veterinary: 2, tattoo: 2, childcare: 1, education: 1, events: 1, logistics: 1,
};
const UNIVERSAL_AGENTS = 7;

export function GenerateSiteFromMockupDialog({ open, onOpenChange, suite }: Props) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<string>("");
  const [result, setResult] = useState<{ adminUrl?: string; previewUrl?: string } | null>(null);

  const [form, setForm] = useState({
    businessName: "",
    sector: "",
    sectorLabel: "",
    city: "",
    fullAddress: "",
    phone: "",
    email: "",
    website: "",
    instagram: "",
    facebook: "",
  });

  // Pre-fill da mockup vault
  useEffect(() => {
    if (!suite) return;
    const sectorKey = (suite.business_sector || "").toLowerCase();
    const sectorMatch = SECTOR_OPTIONS.find(s => s.value === sectorKey || s.label.toLowerCase().includes(sectorKey));
    setForm(f => ({
      ...f,
      businessName: suite.business_name || "",
      sector: sectorMatch?.value || sectorKey || "",
      sectorLabel: sectorMatch?.label || suite.business_sector || "",
      city: suite.business_city || "",
    }));
    setResult(null);
    setProgress(0);
    setPhase("");
  }, [suite]);

  const sectorAgentCount = (SECTOR_AGENT_COUNT[form.sector] || 0) + UNIVERSAL_AGENTS;

  const handleGenerate = async () => {
    if (!suite) return;
    if (!form.businessName.trim()) return toast.error("Nome attività obbligatorio");
    if (!form.sector) return toast.error("Seleziona il settore");

    const hasContact = form.phone || form.email || form.website || form.instagram || form.facebook || form.fullAddress || form.city;
    if (!hasContact) return toast.error("Servono almeno: città, telefono, email, sito o un canale social");

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return toast.error("Sessione scaduta");

    setGenerating(true);
    setResult(null);

    // Verifica/consuma crediti
    const { data: consume, error: consumeErr } = await supabase.rpc("consume_seller_credits", {
      p_action: "demo_factory_full",
      p_metadata: { source: "mockup_vault", suite_id: suite.id, template_variant: suite.template_variant },
    });
    if (consumeErr || !(consume as any)?.success) {
      const balance = (consume as any)?.balance ?? 0;
      const required = (consume as any)?.required ?? COST_FULL_DEMO;
      toast.error(`Crediti insufficienti (${balance}/${required})`);
      setGenerating(false);
      return;
    }

    // Animazione progresso fasi pipeline
    const phases = [
      { p: 8,  t: "🔍 Scout — analisi sito e social…" },
      { p: 22, t: "🧠 Analyst — brand kit + sub-settore…" },
      { p: 38, t: "🎨 Curator — palette & immagini hero…" },
      { p: 55, t: "✍️ Copywriter — testi su misura…" },
      { p: 72, t: `🏗️ Builder — ${form.sectorLabel || form.sector} con ${sectorAgentCount} agenti AI…` },
      { p: 88, t: "🚀 Closer — magic link & WhatsApp pronti…" },
    ];
    let phaseIdx = 0;
    const phaseTimer = setInterval(() => {
      if (phaseIdx < phases.length) {
        setProgress(phases[phaseIdx].p);
        setPhase(phases[phaseIdx].t);
        phaseIdx++;
      }
    }, 4500);

    try {
      const { data, error } = await supabase.functions.invoke("generate-demo-from-lead", {
        body: {
          lead: {
            businessName: form.businessName,
            sector: form.sector,
            sectorLabel: form.sectorLabel,
            city: form.city,
            fullAddress: form.fullAddress,
            phone: form.phone,
            email: form.email,
            website: form.website,
            instagram: form.instagram,
            facebook: form.facebook,
          },
          // ⭐ Template AUTORITATIVO dal mockup approvato → replica 1:1
          preview: {
            brandName: suite.business_name,
            styleName: suite.template_variant,
            imageUrl: extractFirstImage(suite.screens),
            sectorId: form.sector,
            templateVariant: suite.template_variant,
            subSector: form.sector,
            screens: extractAllImages(suite.screens),
          },
          partnerId: userId,
          originUrl: window.location.origin,
          // Force completezza massima settoriale
          forceFullSectorPack: true,
          installAllAgents: true,
          sourceMockupSuiteId: suite.id,
        },
      });

      clearInterval(phaseTimer);

      const errBody: any = (error as any)?.context?.body || data;
      if (errBody?.error === "lead_data_insufficient") {
        toast.error("Lead insufficiente", { description: (errBody.issues || []).join(" · ") });
        // Refund
        await supabase.from("demo_credit_usage").insert({
          user_id: userId,
          action: "refund_demo_factory",
          credits_used: -COST_FULL_DEMO,
          cost_eur_estimate: 0,
          action_label: "Rimborso: lead insufficiente",
          metadata: { reason: "lead_data_insufficient", suite_id: suite.id },
        });
        setGenerating(false);
        setProgress(0);
        return;
      }
      if (error || !data) throw error || new Error("Errore generazione");

      setProgress(100);
      setPhase("✅ Sito demo completo pronto!");
      setResult({
        adminUrl: data.adminUrl || data.admin_url,
        previewUrl: data.previewUrl || data.preview_url,
      });
      toast.success("🚀 Sito demo generato con replica 1:1 del mockup!", {
        description: `${sectorAgentCount} agenti AI installati · template ${suite.template_variant}`,
      });
    } catch (e: any) {
      clearInterval(phaseTimer);
      console.error("[generate-from-mockup] error", e);
      toast.error("Errore generazione", { description: e?.message || "Riprova tra qualche istante" });
      setProgress(0);
    } finally {
      setGenerating(false);
    }
  };

  if (!suite) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !generating && onOpenChange(o)}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Genera Sito Demo Completo da Mockup
          </DialogTitle>
          <DialogDescription>
            Trasforma il mockup approvato in un sito demo 100% funzionante, replica 1:1 del design, con tutti gli agenti AI e moduli del settore.
          </DialogDescription>
        </DialogHeader>

        {/* Anteprima mockup di partenza */}
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ background: suite.primary_color || "#a78bfa" }}>
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{suite.business_name}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {suite.template_variant && <Badge variant="secondary" className="text-[10px]">Template: {suite.template_variant}</Badge>}
                {suite.business_sector && <Badge variant="outline" className="text-[10px]">{suite.business_sector}</Badge>}
                {suite.business_city && <Badge variant="outline" className="text-[10px]">{suite.business_city}</Badge>}
              </div>
            </div>
          </div>
        </div>

        {/* Garanzie completezza */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-lg border bg-card p-3 text-center">
            <Layers className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-[10px] font-semibold">Replica 1:1</p>
            <p className="text-[9px] text-muted-foreground">design del mockup</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <Bot className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-[10px] font-semibold">{sectorAgentCount} Agenti AI</p>
            <p className="text-[9px] text-muted-foreground">installati e attivi</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <Zap className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-[10px] font-semibold">Automazioni</p>
            <p className="text-[9px] text-muted-foreground">complete settore</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <ShieldCheck className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-[10px] font-semibold">Pronto demo</p>
            <p className="text-[9px] text-muted-foreground">link cliente</p>
          </div>
        </div>

        {/* Form arricchimento dati lead */}
        {!result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Nome attività *</Label>
                <Input value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} placeholder="Es: Trattoria da Marco" />
              </div>
              <div>
                <Label>Settore *</Label>
                <Select value={form.sector} onValueChange={(v) => {
                  const opt = SECTOR_OPTIONS.find(s => s.value === v);
                  setForm({ ...form, sector: v, sectorLabel: opt?.label || v });
                }}>
                  <SelectTrigger><SelectValue placeholder="Seleziona settore" /></SelectTrigger>
                  <SelectContent>
                    {SECTOR_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Città</Label>
                <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Roma" />
              </div>
              <div>
                <Label>Indirizzo completo</Label>
                <Input value={form.fullAddress} onChange={e => setForm({ ...form, fullAddress: e.target.value })} placeholder="Via Roma 1, 00100" />
              </div>
              <div>
                <Label>Telefono</Label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+39 06 1234567" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="info@attivita.it" />
              </div>
              <div className="sm:col-span-2">
                <Label>Sito web (consigliato per scrape AI)</Label>
                <Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://www.attivita.it" />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="@nome_attivita" />
              </div>
              <div>
                <Label>Facebook</Label>
                <Input value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })} placeholder="facebook.com/attivita" />
              </div>
            </div>

            <div className="rounded-lg border border-muted-foreground/30 bg-muted/40 p-3 flex gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Più dati reali = sito più convincente. L'AI fa scrape del sito + Instagram per immagini reali, menu/servizi e brand kit prima di costruire la demo.
              </p>
            </div>
          </div>
        )}

        {/* Progresso pipeline */}
        {generating && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="font-medium">{phase || "Avvio pipeline…"}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[11px] text-muted-foreground text-center">⏱️ Tempo stimato: 30-60 secondi · Pipeline 6 agenti AI in parallelo</p>
          </div>
        )}

        {/* Risultato */}
        {result && (
          <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <p className="font-bold text-primary">Sito Demo Completo Pronto!</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Il sito replica 1:1 il mockup approvato, con {sectorAgentCount} agenti AI attivi, automazioni complete del settore e magic link inviato al cliente.
            </p>
            <div className="flex gap-2 flex-wrap">
              {result.previewUrl && (
                <Button onClick={() => window.open(result.previewUrl, "_blank")} className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" /> Apri sito demo
                </Button>
              )}
              {result.adminUrl && (
                <Button variant="outline" onClick={() => window.open(result.adminUrl, "_blank")} className="flex-1">
                  <Sparkles className="h-4 w-4 mr-2" /> Apri admin pannello
                </Button>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        {!result && (
          <Button onClick={handleGenerate} disabled={generating || !form.businessName.trim() || !form.sector} size="lg" className="w-full">
            {generating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generazione in corso…</>
            ) : (
              <><Rocket className="h-4 w-4 mr-2" /> Genera Sito Demo Completo ({COST_FULL_DEMO} crediti)</>
            )}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

function extractFirstImage(screens: any): string | null {
  const arr = Array.isArray(screens) ? screens : (screens?.screens || []);
  for (const sc of arr) {
    if (typeof sc === "string") return sc;
    if (sc?.image_url) return sc.image_url;
    if (sc?.url) return sc.url;
  }
  return null;
}

function extractAllImages(screens: any): string[] {
  const arr = Array.isArray(screens) ? screens : (screens?.screens || []);
  return arr.map((sc: any) => typeof sc === "string" ? sc : (sc?.image_url || sc?.url)).filter(Boolean);
}
