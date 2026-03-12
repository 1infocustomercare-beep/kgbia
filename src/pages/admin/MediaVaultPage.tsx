import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film, Image, Trash2, Download, ExternalLink, Eye, Copy,
  Check, Search, Grid3X3, List, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import videoHero from "@/assets/video-hero-empire.mp4";
import videoIndustries from "@/assets/video-industries.mp4";
import videoFeatures from "@/assets/video-features.mp4";
import videoPartner from "@/assets/video-partner-pitch.mp4";
import heroLanding from "@/assets/hero-landing.jpg";
import mockupCliente from "@/assets/mockup-cliente.jpg";
import mockupAdmin from "@/assets/mockup-admin.jpg";
import mockupCucina from "@/assets/mockup-cucina.jpg";

interface MediaItem {
  id: string;
  name: string;
  type: "video" | "image";
  src: string;
  section: string;
  description: string;
  dimensions?: string;
}

const MEDIA_ITEMS: MediaItem[] = [
  { id: "v1", name: "Hero Empire", type: "video", src: videoHero, section: "Landing — Hero", description: "Video principale: dashboard IA, tecnologia business, ecosistema digitale", dimensions: "1920×1080" },
  { id: "v2", name: "Multi-Settore", type: "video", src: videoIndustries, section: "Landing — Settori", description: "Montaggio settori: ristorante, NCC, beauty, fitness, retail", dimensions: "1920×1080" },
  { id: "v3", name: "Platform Features", type: "video", src: videoFeatures, section: "Landing — Funzionalità", description: "App mobile, QR code, analytics, pagamenti contactless", dimensions: "1920×1080" },
  { id: "v4", name: "Partner Pitch", type: "video", src: videoPartner, section: "Landing — Partner", description: "Presentazione commerciale per venditori e partner", dimensions: "1920×1080" },
  { id: "i1", name: "Hero Landing", type: "image", src: heroLanding, section: "Landing — Background", description: "Immagine di sfondo hero principale", dimensions: "1920×1080" },
  { id: "i2", name: "Mockup Cliente", type: "image", src: mockupCliente, section: "Landing — App Showcase", description: "Screenshot app vista cliente", dimensions: "390×844" },
  { id: "i3", name: "Mockup Admin", type: "image", src: mockupAdmin, section: "Landing — App Showcase", description: "Screenshot pannello gestionale", dimensions: "390×844" },
  { id: "i4", name: "Mockup Cucina", type: "image", src: mockupCucina, section: "Landing — App Showcase", description: "Screenshot vista operativa cucina", dimensions: "390×844" },
];

type ViewMode = "grid" | "list";

const MediaVaultPage = () => {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<"all" | "video" | "image">("all");
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = MEDIA_ITEMS.filter(m => {
    if (filterType !== "all" && m.type !== filterType) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.section.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const copyPath = (item: MediaItem) => {
    navigator.clipboard.writeText(item.src);
    setCopiedId(item.id);
    toast({ title: "Path copiato", description: `${item.name} copiato negli appunti` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Film className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Media Vault</h1>
          <p className="text-xs text-muted-foreground">{MEDIA_ITEMS.length} asset • Video & Immagini</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca media..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "video", "image"] as const).map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterType === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-secondary"}`}>
              {t === "all" ? "Tutti" : t === "video" ? "🎬 Video" : "🖼️ Immagini"}
            </button>
          ))}
          <div className="flex rounded-lg bg-card border border-border overflow-hidden ml-auto">
            <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <motion.div key={item.id} className="group rounded-xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-all"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              {/* Thumbnail */}
              <div className="relative aspect-video bg-foreground/5 cursor-pointer" onClick={() => setPreview(item)}>
                {item.type === "video" ? (
                  <>
                    <video src={item.src} muted className="w-full h-full object-cover" preload="metadata" />
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center"><Play className="w-5 h-5 text-primary-foreground ml-0.5" /></div>
                    </div>
                  </>
                ) : (
                  <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-0.5 rounded-full text-[0.55rem] font-bold tracking-wider uppercase ${item.type === "video" ? "bg-accent/80 text-accent-foreground" : "bg-primary/80 text-primary-foreground"}`}>
                    {item.type === "video" ? "VIDEO" : "IMG"}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-foreground mb-0.5">{item.name}</h3>
                <p className="text-[0.6rem] text-muted-foreground mb-2">{item.section} • {item.dimensions}</p>
                <p className="text-[0.6rem] text-foreground/40 line-clamp-2 mb-3">{item.description}</p>
                <div className="flex gap-1.5">
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setPreview(item)}>
                    <Eye className="w-3 h-3" /> Preview
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => copyPath(item)}>
                    {copiedId === item.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    {copiedId === item.id ? "Copiato" : "Path"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-2">
          {filtered.map((item, i) => (
            <motion.div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-foreground/5 flex-shrink-0 cursor-pointer" onClick={() => setPreview(item)}>
                {item.type === "video" ? (
                  <video src={item.src} muted className="w-full h-full object-cover" preload="metadata" />
                ) : (
                  <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                  <span className={`px-1.5 py-0.5 rounded text-[0.5rem] font-bold ${item.type === "video" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                    {item.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-[0.6rem] text-muted-foreground">{item.section} • {item.dimensions}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreview(item)}>
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyPath(item)}>
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Image className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nessun media trovato</p>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}>
            <motion.div className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-card border border-border shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}>
              {preview.type === "video" ? (
                <video src={preview.src} autoPlay controls muted className="w-full aspect-video object-cover" />
              ) : (
                <img src={preview.src} alt={preview.name} className="w-full max-h-[70vh] object-contain bg-foreground/5" />
              )}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{preview.name}</h3>
                  <p className="text-[0.6rem] text-muted-foreground">{preview.section} • {preview.dimensions}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => copyPath(preview)}>
                    <Copy className="w-3 h-3" /> Copia Path
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => setPreview(null)}>Chiudi</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaVaultPage;
