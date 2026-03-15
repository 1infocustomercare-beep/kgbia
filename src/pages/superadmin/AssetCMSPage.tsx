import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, ExternalLink, Trash2, Image, Film, Check, X, Search, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSiteAssets, useUpdateSiteAsset, type SiteAsset } from "@/hooks/useSiteAssets";
import { supabase } from "@/integrations/supabase/client";

const SECTION_LABELS: Record<string, { label: string; icon: string }> = {
  landing: { label: "Landing Page", icon: "🏠" },
  sectors: { label: "Settori", icon: "🎯" },
  agents: { label: "Agenti IA", icon: "🤖" },
  ncc: { label: "NCC / Trasporti", icon: "🚗" },
};

export default function AssetCMSPage() {
  const navigate = useNavigate();
  const { data: assets, isLoading } = useSiteAssets();
  const updateAsset = useUpdateSiteAsset();
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);

  const filtered = (assets || []).filter(a => {
    if (sectionFilter !== "all" && a.section !== sectionFilter) return false;
    if (search && !a.label.toLowerCase().includes(search.toLowerCase()) && !a.slot_key.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = filtered.reduce<Record<string, (SiteAsset & { resolvedUrl: string })[]>>((acc, a) => {
    const key = a.section;
    if (!acc[key]) acc[key] = [];
    acc[key].push(a as SiteAsset & { resolvedUrl: string });
    return acc;
  }, {});

  const handleUpload = async (assetId: string, file: File) => {
    setUploading(assetId);
    try {
      const ext = file.name.split('.').pop();
      const path = `site-assets/${assetId}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media-vault").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("media-vault").getPublicUrl(path);
      await updateAsset.mutateAsync({ id: assetId, url: publicUrl });
      toast({ title: "Asset aggiornato", description: "Immagine caricata con successo" });
    } catch (e: any) {
      toast({ title: "Errore upload", description: e.message, variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  const handleSetUrl = async (assetId: string) => {
    if (!editUrl.trim()) return;
    try {
      await updateAsset.mutateAsync({ id: assetId, url: editUrl.trim() });
      toast({ title: "URL impostato" });
      setEditingId(null);
      setEditUrl("");
    } catch (e: any) {
      toast({ title: "Errore", description: e.message, variant: "destructive" });
    }
  };

  const handleReset = async (assetId: string) => {
    try {
      await updateAsset.mutateAsync({ id: assetId, url: null });
      toast({ title: "Ripristinato", description: "Torna all'asset predefinito" });
    } catch {
      toast({ title: "Errore", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => navigate("/superadmin")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-lg font-heading font-bold">Asset CMS</h1>
          <p className="text-xs text-muted-foreground">Gestisci foto e video di tutta la piattaforma</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Cerca slot..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs bg-secondary/40 border-border/50 rounded-xl" />
        </div>
      </div>
      <div className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {[{ key: "all", label: "Tutti", icon: "📋" }, ...Object.entries(SECTION_LABELS).map(([k, v]) => ({ key: k, ...v }))].map(s => (
          <button key={s.key} onClick={() => setSectionFilter(s.key)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[0.6rem] font-semibold whitespace-nowrap transition-all ${
              sectionFilter === s.key ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/50 text-muted-foreground"
            }`}>
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {isLoading && <p className="text-center text-muted-foreground text-sm py-12">Caricamento...</p>}

      {/* Grouped sections */}
      {Object.entries(grouped).map(([section, items]) => (
        <div key={section} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <h2 className="text-sm font-heading font-bold text-foreground">
              {SECTION_LABELS[section]?.icon} {SECTION_LABELS[section]?.label || section}
            </h2>
            <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono">{items.length}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {items.map(asset => {
              const isEditing = editingId === asset.id;
              const hasCustom = !!asset.url;
              const previewUrl = asset.resolvedUrl;
              const isVideo = asset.asset_type === "video";

              return (
                <motion.div key={asset.id}
                  className={`relative rounded-xl border overflow-hidden ${hasCustom ? "border-primary/30 bg-primary/[0.03]" : "border-border/40 bg-card/40"}`}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  
                  {/* Preview */}
                  <div className="aspect-video relative bg-secondary/30 overflow-hidden">
                    {previewUrl && !isVideo && (
                      <img src={previewUrl} alt={asset.label} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    )}
                    {previewUrl && isVideo && (
                      <video src={previewUrl} className="absolute inset-0 w-full h-full object-cover" muted loop autoPlay playsInline />
                    )}
                    {!previewUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isVideo ? <Film className="w-6 h-6 text-muted-foreground/30" /> : <Image className="w-6 h-6 text-muted-foreground/30" />}
                      </div>
                    )}
                    
                    {/* Custom badge */}
                    {hasCustom && (
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-primary/90 text-primary-foreground text-[0.45rem] font-bold">
                        CUSTOM
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-[0.6rem] font-semibold text-foreground truncate mb-0.5">{asset.label}</p>
                    <p className="text-[0.45rem] font-mono text-muted-foreground truncate mb-1.5">{asset.slot_key}</p>

                    {/* URL edit mode */}
                    {isEditing ? (
                      <div className="flex gap-1">
                        <Input value={editUrl} onChange={e => setEditUrl(e.target.value)} placeholder="https://..."
                          className="h-7 text-[0.55rem] flex-1 bg-secondary/40 border-border/50 rounded-lg" />
                        <button onClick={() => handleSetUrl(asset.id)} className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </button>
                        <button onClick={() => { setEditingId(null); setEditUrl(""); }} className="w-7 h-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        {/* Upload */}
                        <label className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[0.5rem] font-semibold cursor-pointer transition-colors ${
                          uploading === asset.id ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}>
                          <Upload className="w-3 h-3" />
                          {uploading === asset.id ? "..." : "Upload"}
                          <input type="file" className="hidden" accept={isVideo ? "video/*" : "image/*"}
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(asset.id, f); }} />
                        </label>
                        {/* URL */}
                        <button onClick={() => { setEditingId(asset.id); setEditUrl(asset.url || ""); }}
                          className="flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground text-[0.5rem] font-semibold transition-colors">
                          <ExternalLink className="w-3 h-3" /> URL
                        </button>
                        {/* Reset */}
                        {hasCustom && (
                          <button onClick={() => handleReset(asset.id)}
                            className="w-7 flex items-center justify-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
