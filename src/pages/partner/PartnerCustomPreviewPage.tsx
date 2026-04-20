import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Trash2, ExternalLink, Palette, Upload, Eye, Copy, MessageCircle, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const STYLES = [
  { key: "modern_dark", label: "Modern Dark", color: "#0F172A", accent: "#C8963E" },
  { key: "luxury_gold", label: "Luxury Gold", color: "#1A1410", accent: "#D4AF37" },
  { key: "casual_warm", label: "Casual Warm", color: "#FAF6F0", accent: "#E07856" },
  { key: "minimal_zen", label: "Minimal Zen", color: "#F8F8F8", accent: "#222222" },
];

const COST = 15;

interface CustomPreview {
  id: string;
  sector_label: string;
  template_style: string;
  primary_color: string;
  hero_title: string | null;
  preview_url: string | null;
  public_slug: string | null;
  lead_name: string | null;
  lead_city: string | null;
  hero_image_url: string | null;
  logo_url: string | null;
  generation_status: string;
  view_count: number;
  reuse_count: number;
  created_at: string;
  whatsapp_message: string | null;
}

interface SelectableLead {
  id: string;
  source: "intelligence" | "scout";
  lead_name: string;
  lead_city: string | null;
  lead_sector: string | null;
  lead_website: string | null;
  lead_phone: string | null;
  lead_email: string | null;
  google_rating: number | null;
  badge?: string;
}

export default function PartnerCustomPreviewPage() {
  const { user } = useAuth();
  const [previews, setPreviews] = useState<CustomPreview[]>([]);
  const [availableLeads, setAvailableLeads] = useState<SelectableLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [mode, setMode] = useState<"lead" | "manual">("lead");
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const [form, setForm] = useState({
    lead_name: "",
    lead_city: "",
    lead_sector: "",
    lead_phone: "",
    lead_website: "",
    lead_address: "",
    lead_email: "",
    template_style: "modern_dark",
    primary_color: "#C8963E",
    logo_url: "",
    gallery_images: [] as string[],
  });

  // Load previews + intelligence + scout leads (uniti)
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const [pRes, iRes, sRes] = await Promise.all([
        supabase.from("seller_custom_previews" as any).select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
        supabase.from("lead_intelligence_reports").select("id, lead_name, lead_city, lead_sector, lead_website, lead_phone, google_rating, vendibility_score, category").eq("owner_id", user.id).order("vendibility_score", { ascending: false }).limit(100),
        supabase.from("leads").select("id, name, city, sector, website, phone, email, ai_score").eq("owner_id", user.id).order("created_at", { ascending: false }).limit(100),
      ]);
      setPreviews((pRes.data as any) || []);

      const intel: SelectableLead[] = ((iRes.data as any[]) || []).map(r => ({
        id: `intel:${r.id}`,
        source: "intelligence",
        lead_name: r.lead_name,
        lead_city: r.lead_city,
        lead_sector: r.lead_sector,
        lead_website: r.lead_website,
        lead_phone: r.lead_phone,
        lead_email: null,
        google_rating: r.google_rating,
        badge: r.category ? `${String(r.category).toUpperCase()} · score ${r.vendibility_score ?? "?"}` : "Intelligence",
      }));
      const scout: SelectableLead[] = ((sRes.data as any[]) || []).map(r => ({
        id: `scout:${r.id}`,
        source: "scout",
        lead_name: r.name,
        lead_city: r.city,
        lead_sector: r.sector,
        lead_website: r.website,
        lead_phone: r.phone,
        lead_email: r.email,
        google_rating: null,
        badge: r.ai_score ? `Scout · score ${r.ai_score}` : "Scout",
      }));
      setAvailableLeads([...intel, ...scout]);
      setLoading(false);
    })();
  }, [user?.id]);

  // Pre-fill form da lead selezionato (intelligence o scout)
  useEffect(() => {
    if (!selectedLeadId) return;
    const lead = availableLeads.find(l => l.id === selectedLeadId);
    if (lead) {
      setForm(f => ({
        ...f,
        lead_name: lead.lead_name || "",
        lead_city: lead.lead_city || "",
        lead_sector: lead.lead_sector || "",
        lead_website: lead.lead_website || "",
        lead_phone: lead.lead_phone || "",
        lead_email: lead.lead_email || "",
      }));
    }
  }, [selectedLeadId, availableLeads]);

  const handleFileUpload = async (file: File, kind: "logo" | "gallery") => {
    if (!user?.id) return null;
    const path = `custom-previews/${user.id}/uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("media-vault").upload(path, file, { upsert: true });
    if (error) {
      toast.error(`Errore upload: ${error.message}`);
      return null;
    }
    const { data } = supabase.storage.from("media-vault").getPublicUrl(path);
    return data.publicUrl;
  };

  const onLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoUploading(true);
    const url = await handleFileUpload(f, "logo");
    if (url) setForm(p => ({ ...p, logo_url: url }));
    setLogoUploading(false);
  };

  const onGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setGalleryUploading(true);
    const urls: string[] = [];
    for (const f of files.slice(0, 6)) {
      const url = await handleFileUpload(f, "gallery");
      if (url) urls.push(url);
    }
    setForm(p => ({ ...p, gallery_images: [...p.gallery_images, ...urls].slice(0, 6) }));
    setGalleryUploading(false);
  };

  const handleGenerate = async () => {
    if (!form.lead_name.trim()) {
      toast.error("Nome attività obbligatorio");
      return;
    }
    setGenerating(true);
    try {
      const payload: any = {
        template_style: form.template_style,
        primary_color: form.primary_color,
        logo_url: form.logo_url || undefined,
        gallery_images: form.gallery_images,
      };

      if (mode === "lead" && selectedLeadId) {
        payload.lead_intelligence_id = selectedLeadId;
        // Allow overrides via manual_data
        payload.manual_data = {
          lead_name: form.lead_name,
          lead_city: form.lead_city,
          lead_sector: form.lead_sector,
          lead_website: form.lead_website,
          lead_phone: form.lead_phone,
          lead_address: form.lead_address,
          lead_email: form.lead_email,
        };
      } else {
        payload.manual_data = {
          lead_name: form.lead_name,
          lead_city: form.lead_city,
          lead_sector: form.lead_sector,
          lead_website: form.lead_website,
          lead_phone: form.lead_phone,
          lead_address: form.lead_address,
          lead_email: form.lead_email,
        };
      }

      const { data, error } = await supabase.functions.invoke("custom-preview-generator", { body: payload });
      if (error) throw error;
      if (!(data as any)?.success) {
        const err = (data as any)?.error || "Errore generazione";
        if (err === "insufficient_credits") {
          toast.error(`Crediti insufficienti: servono ${COST} crediti`);
        } else {
          toast.error(`Errore: ${err}`);
        }
        return;
      }

      toast.success(`Preview "${form.lead_name}" generata! 🎉`);

      // Reload list
      const { data: list } = await supabase.from("seller_custom_previews" as any).select("*").eq("owner_id", user!.id).order("created_at", { ascending: false });
      setPreviews((list as any) || []);

      // Reset form
      setForm({
        lead_name: "", lead_city: "", lead_sector: "", lead_phone: "", lead_website: "",
        lead_address: "", lead_email: "",
        template_style: "modern_dark", primary_color: "#C8963E",
        logo_url: "", gallery_images: [],
      });
      setSelectedLeadId("");

      // Auto-open
      const url = (data as any).public_url;
      if (url) window.open(url, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Errore generazione");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminare questa preview?")) return;
    await supabase.from("seller_custom_previews" as any).delete().eq("id", id);
    setPreviews(prev => prev.filter(p => p.id !== id));
    toast.success("Preview eliminata");
  };

  const copyLink = (slug: string | null) => {
    if (!slug) return;
    const url = `${window.location.origin}/preview/custom/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiato");
  };

  const openWhatsApp = (preview: CustomPreview) => {
    if (!preview.whatsapp_message) {
      toast.error("Messaggio WhatsApp non disponibile");
      return;
    }
    const url = `https://wa.me/?text=${encodeURIComponent(preview.whatsapp_message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Palette className="h-7 w-7 text-primary" />
          Preview Custom AI
        </h1>
        <p className="text-muted-foreground">
          Genera una landing page premium personalizzata per qualsiasi lead.
          L'AI scrive testi, crea l'immagine hero e compone l'HTML — pronto da mostrare al cliente.
          <strong className="ml-1">Costo: {COST} crediti per preview.</strong>
        </p>
      </div>

      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Genera nuova preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="lead">Da Lead Analizzato</TabsTrigger>
              <TabsTrigger value="manual">Inserimento Manuale</TabsTrigger>
            </TabsList>

            <TabsContent value="lead" className="space-y-4 mt-4">
              <div>
                <Label>Seleziona lead da Intelligence o Scout</Label>
                <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Scegli un lead già scoperto…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {availableLeads.length === 0 ? (
                      <SelectItem value="none" disabled>Nessun lead trovato — usa lo Scout o l'Intelligence prima</SelectItem>
                    ) : availableLeads.map(l => (
                      <SelectItem key={l.id} value={l.id}>
                        <span className="font-medium">{l.lead_name}</span>
                        {l.lead_city ? ` · ${l.lead_city}` : ""}
                        {l.lead_sector ? ` · ${l.lead_sector}` : ""}
                        {l.badge ? `  [${l.badge}]` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Disponibili: <strong>{availableLeads.filter(l => l.source === "intelligence").length}</strong> da Intelligence · <strong>{availableLeads.filter(l => l.source === "scout").length}</strong> da Scout. I dati pre-compilano il form qui sotto (modificabili).
                </p>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="mt-4">
              <p className="text-sm text-muted-foreground">Inserisci tutti i dati a mano. Più dati metti, più l'AI personalizza.</p>
            </TabsContent>
          </Tabs>

          {/* Dati lead */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <Label htmlFor="lead_name">Nome attività *</Label>
              <Input id="lead_name" placeholder="es. Tatuaggi Black Rose" value={form.lead_name} onChange={e => setForm({ ...form, lead_name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="lead_sector">Settore</Label>
              <Input id="lead_sector" placeholder="es. Tatuatore, Fiorista, Veterinario" value={form.lead_sector} onChange={e => setForm({ ...form, lead_sector: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="lead_city">Città</Label>
              <Input id="lead_city" placeholder="es. Roma" value={form.lead_city} onChange={e => setForm({ ...form, lead_city: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="lead_phone">Telefono</Label>
              <Input id="lead_phone" placeholder="+39 06 1234 5678" value={form.lead_phone} onChange={e => setForm({ ...form, lead_phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="lead_website">Sito web (verrà analizzato dall'AI)</Label>
              <Input id="lead_website" placeholder="https://…" value={form.lead_website} onChange={e => setForm({ ...form, lead_website: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="lead_email">Email</Label>
              <Input id="lead_email" placeholder="info@esempio.it" value={form.lead_email} onChange={e => setForm({ ...form, lead_email: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="lead_address">Indirizzo</Label>
              <Input id="lead_address" placeholder="Via Roma 1, Milano" value={form.lead_address} onChange={e => setForm({ ...form, lead_address: e.target.value })} />
            </div>
          </div>

          {/* Logo + Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Logo (opzionale)</Label>
              <div className="flex items-center gap-3 mt-1">
                {form.logo_url ? (
                  <img src={form.logo_url} alt="logo" className="h-12 w-12 rounded object-cover border" />
                ) : (
                  <div className="h-12 w-12 rounded border-2 border-dashed flex items-center justify-center text-muted-foreground"><ImageIcon className="h-5 w-5" /></div>
                )}
                <label className="flex-1">
                  <Input type="file" accept="image/*" onChange={onLogoChange} disabled={logoUploading} />
                </label>
              </div>
              {form.logo_url && (
                <button type="button" className="text-xs text-destructive mt-1 hover:underline" onClick={() => setForm(p => ({ ...p, logo_url: "" }))}>Rimuovi logo</button>
              )}
            </div>
            <div>
              <Label>Galleria foto (max 6 — opzionale)</Label>
              <Input type="file" accept="image/*" multiple onChange={onGalleryChange} disabled={galleryUploading} className="mt-1" />
              {form.gallery_images.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {form.gallery_images.map((g, i) => (
                    <div key={i} className="relative h-12 w-12 rounded overflow-hidden border group">
                      <img src={g} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => setForm(p => ({ ...p, gallery_images: p.gallery_images.filter((_, j) => j !== i) }))}
                        className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stile + colore */}
          <div>
            <Label>Stile template</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {STYLES.map(s => (
                <button key={s.key} type="button" onClick={() => setForm({ ...form, template_style: s.key, primary_color: s.accent })}
                  className={`p-3 rounded-lg border-2 transition-all ${form.template_style === s.key ? "border-primary scale-105" : "border-border hover:border-primary/50"}`}
                  style={{ background: s.color }}>
                  <div className="h-6 w-full rounded mb-2" style={{ background: s.accent }} />
                  <p className="text-xs font-medium" style={{ color: s.color === "#F8F8F8" || s.color === "#FAF6F0" ? "#222" : "#fff" }}>{s.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="color">Colore accento</Label>
              <div className="flex gap-2">
                <Input id="color" type="color" value={form.primary_color} onChange={e => setForm({ ...form, primary_color: e.target.value })} className="w-16 h-10 p-1" />
                <Input value={form.primary_color} onChange={e => setForm({ ...form, primary_color: e.target.value })} className="flex-1 font-mono" />
              </div>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={generating || !form.lead_name.trim()} className="w-full" size="lg">
            {generating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> AI sta generando (15-30s)…</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Genera preview AI ({COST} crediti)</>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            ✓ Testi AI personalizzati  ·  ✓ Immagine hero generata  ·  ✓ Sito web scrapato  ·  ✓ HTML pro responsive  ·  ✓ Link condivisibile
          </p>
        </CardContent>
      </Card>

      {/* Lista preview */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Le tue preview ({previews.length})</h2>
        {loading ? (
          <Card><CardContent className="pt-6 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></CardContent></Card>
        ) : previews.length === 0 ? (
          <Card><CardContent className="pt-6 text-center text-muted-foreground">
            Nessuna preview ancora. Crea la prima qui sopra.
          </CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previews.map(p => (
              <Card key={p.id} className="overflow-hidden">
                <div className="h-32 relative" style={{ background: p.hero_image_url ? `url(${p.hero_image_url}) center/cover` : p.primary_color }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <p className="font-bold text-sm line-clamp-1">{p.lead_name || p.sector_label}</p>
                    {p.lead_city && <p className="text-xs opacity-80">{p.lead_city}</p>}
                  </div>
                  {p.generation_status === "generating" && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" /> Generazione
                    </div>
                  )}
                  {p.generation_status === "error" && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Errore</div>
                  )}
                </div>
                <CardContent className="pt-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs">{p.template_style.replace("_", " ")}</Badge>
                    <Badge variant="secondary" className="text-xs"><Eye className="h-3 w-3 mr-1" />{p.view_count || 0}</Badge>
                  </div>
                  {p.hero_title && <p className="text-xs font-medium line-clamp-2 text-muted-foreground">{p.hero_title}</p>}
                  <div className="flex gap-1 pt-1 flex-wrap">
                    {p.preview_url && p.generation_status === "completed" && (
                      <Button variant="outline" size="sm" onClick={() => window.open(p.preview_url!, "_blank")} className="flex-1">
                        <ExternalLink className="h-3 w-3 mr-1" /> Apri
                      </Button>
                    )}
                    {p.public_slug && (
                      <Button variant="ghost" size="sm" onClick={() => copyLink(p.public_slug)} title="Copia link">
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                    {p.whatsapp_message && (
                      <Button variant="ghost" size="sm" onClick={() => openWhatsApp(p)} title="Invia su WhatsApp">
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive" title="Elimina">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
