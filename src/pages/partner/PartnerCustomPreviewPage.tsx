import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Plus, Trash2, ExternalLink, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const STYLES = [
  { key: "modern_dark", label: "Modern Dark", color: "#0F172A", accent: "#C8963E" },
  { key: "luxury_gold", label: "Luxury Gold", color: "#1A1410", accent: "#D4AF37" },
  { key: "casual_warm", label: "Casual Warm", color: "#FAF6F0", accent: "#E07856" },
  { key: "minimal_zen", label: "Minimal Zen", color: "#F8F8F8", accent: "#222222" },
];

interface CustomPreview {
  id: string;
  sector_slug: string;
  sector_label: string;
  template_style: string;
  primary_color: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  preview_url: string | null;
  is_published: boolean;
  reuse_count: number;
  created_at: string;
}

export default function PartnerCustomPreviewPage() {
  const { user } = useAuth();
  const [previews, setPreviews] = useState<CustomPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    sector_label: "",
    template_style: "modern_dark",
    hero_title: "",
    hero_subtitle: "",
    primary_color: "#C8963E",
  });

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const { data } = await supabase
        .from("seller_custom_previews" as any)
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      setPreviews((data as any) || []);
      setLoading(false);
    })();
  }, [user?.id]);

  const handleGenerate = async () => {
    if (!form.sector_label.trim()) {
      toast.error("Inserisci il nome del settore");
      return;
    }
    setGenerating(true);
    try {
      // Consuma crediti
      const { data: creditCheck } = await supabase.rpc("consume_seller_credits" as any, {
        p_action: "custom_preview_generation",
        p_metadata: { sector: form.sector_label, style: form.template_style },
      });
      if (!(creditCheck as any)?.success) {
        toast.error(`Crediti insufficienti: servono 8 crediti`);
        setGenerating(false);
        return;
      }

      const slug = form.sector_label.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 32);

      // Salva il record (la generazione HTML reale può essere espansa via edge function)
      const { data, error } = await supabase
        .from("seller_custom_previews" as any)
        .insert({
          owner_id: user!.id,
          sector_slug: slug,
          sector_label: form.sector_label,
          template_style: form.template_style,
          primary_color: form.primary_color,
          hero_title: form.hero_title || form.sector_label,
          hero_subtitle: form.hero_subtitle || `Soluzione digitale professionale per ${form.sector_label}`,
          features: [
            { icon: "📱", title: "Sito vetrina mobile-first" },
            { icon: "📅", title: "Prenotazioni online" },
            { icon: "💬", title: "WhatsApp Business integrato" },
            { icon: "⭐", title: "Gestione recensioni AI" },
          ],
          preview_url: `/demo/custom/${slug}-${Date.now().toString(36)}`,
          is_published: true,
        })
        .select()
        .single();

      if (error) throw error;

      setPreviews(prev => [data as any, ...prev]);
      setForm({ sector_label: "", template_style: "modern_dark", hero_title: "", hero_subtitle: "", primary_color: "#C8963E" });
      toast.success(`Preview "${form.sector_label}" creata! Costo: 8 crediti.`);
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

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Palette className="h-7 w-7 text-primary" />
          Preview Custom per Settori Nuovi
        </h1>
        <p className="text-muted-foreground">
          Hai trovato un settore non in catalogo (es. tatuatori, fioristi)? Crea al volo una preview professionale
          con lo stesso stile dei nostri template. <strong>Costo: 8 crediti</strong>.
        </p>
      </div>

      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Genera nuova preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sector">Nome settore *</Label>
              <Input
                id="sector"
                placeholder="es. Tatuatore, Fiorista, Veterinario…"
                value={form.sector_label}
                onChange={e => setForm({ ...form, sector_label: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="color">Colore principale</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={form.primary_color}
                  onChange={e => setForm({ ...form, primary_color: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={form.primary_color}
                  onChange={e => setForm({ ...form, primary_color: e.target.value })}
                  className="flex-1 font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Stile template</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {STYLES.map(s => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setForm({ ...form, template_style: s.key, primary_color: s.accent })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    form.template_style === s.key ? "border-primary scale-105" : "border-border hover:border-primary/50"
                  }`}
                  style={{ background: s.color }}
                >
                  <div className="h-6 w-full rounded mb-2" style={{ background: s.accent }} />
                  <p className="text-xs font-medium" style={{ color: s.color === "#F8F8F8" || s.color === "#FAF6F0" ? "#222" : "#fff" }}>
                    {s.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="hero">Titolo hero (opzionale)</Label>
            <Input
              id="hero"
              placeholder="es. Tattoo Studio Roma — Arte sulla pelle dal 1998"
              value={form.hero_title}
              onChange={e => setForm({ ...form, hero_title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="sub">Sottotitolo (opzionale)</Label>
            <Textarea
              id="sub"
              placeholder="Descrizione breve del settore/attività"
              value={form.hero_subtitle}
              onChange={e => setForm({ ...form, hero_subtitle: e.target.value })}
              rows={2}
            />
          </div>

          <Button onClick={handleGenerate} disabled={generating || !form.sector_label.trim()} className="w-full">
            {generating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generazione in corso…</>
            ) : (
              <><Plus className="h-4 w-4 mr-2" /> Crea preview (8 crediti)</>
            )}
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-3">Le tue preview ({previews.length})</h2>
        {loading ? (
          <Card><CardContent className="pt-6 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></CardContent></Card>
        ) : previews.length === 0 ? (
          <Card><CardContent className="pt-6 text-center text-muted-foreground">
            Nessuna preview ancora. Crea la prima qui sopra.
          </CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {previews.map(p => (
              <Card key={p.id} className="overflow-hidden">
                <div className="h-24 flex items-center justify-center" style={{ background: p.primary_color }}>
                  <p className="text-white font-bold text-lg">{p.sector_label}</p>
                </div>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">{p.template_style}</Badge>
                    <Badge variant="secondary" className="text-xs">{p.reuse_count} riutilizzi</Badge>
                  </div>
                  {p.hero_title && <p className="text-sm font-medium line-clamp-1">{p.hero_title}</p>}
                  <div className="flex gap-2 pt-2">
                    {p.preview_url && (
                      <Button variant="outline" size="sm" onClick={() => window.open(p.preview_url!, "_blank")}>
                        <ExternalLink className="h-3 w-3 mr-1" /> Apri
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive">
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
