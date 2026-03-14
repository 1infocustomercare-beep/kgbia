import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Download, Crown, Copy, Check, ArrowLeft, Search, Grid3X3, List, Play, Eye, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Asset {
  name: string;
  file: string;
  category: string;
  type: "image" | "video";
}

// Use Vite's import.meta.glob to resolve all assets at build time
const assetModules = import.meta.glob<{ default: string }>('/src/assets/**/*', { eager: true });

function assetUrl(file: string): string {
  const key = `/src/assets/${file}`;
  return assetModules[key]?.default || '';
}

const ALL_ASSETS: Asset[] = [
  // Logos
  { name: "Empire Logo Icon (Crown)", file: "empire-logo-icon.png", category: "Logo", type: "image" },
  { name: "Empire Logo Full (Wordmark)", file: "empire-logo-full.png", category: "Logo", type: "image" },
  { name: "Restaurant Logo", file: "restaurant-logo.png", category: "Logo", type: "image" },

  // Hero / Landing
  { name: "Hero Tech Command", file: "hero-tech-command.jpg", category: "Landing", type: "image" },
  { name: "Hero AI Platform", file: "hero-ai-platform.jpg", category: "Landing", type: "image" },
  { name: "Hero Partner Luxury", file: "hero-partner-luxury.jpg", category: "Landing", type: "image" },
  { name: "Hero Landing", file: "hero-landing.jpg", category: "Landing", type: "image" },

  // Mockups
  { name: "Mockup Cliente", file: "mockup-cliente.jpg", category: "Mockup", type: "image" },
  { name: "Mockup Admin", file: "mockup-admin.jpg", category: "Mockup", type: "image" },
  { name: "Mockup Cucina", file: "mockup-cucina.jpg", category: "Mockup", type: "image" },

  // Cartoons
  { name: "Cartoon AI Photo", file: "cartoon-ai-photo.png", category: "Cartoon", type: "image" },
  { name: "Cartoon Dashboard", file: "cartoon-dashboard.png", category: "Cartoon", type: "image" },
  { name: "Cartoon Ordini Cucina", file: "cartoon-orders-kitchen.png", category: "Cartoon", type: "image" },
  { name: "Cartoon Profitto", file: "cartoon-profit.png", category: "Cartoon", type: "image" },
  { name: "Cartoon Studio Menu", file: "cartoon-studio-menu.png", category: "Cartoon", type: "image" },

  // Videos
  { name: "Video Hero Empire", file: "video-hero-empire.mp4", category: "Video", type: "video" },
  { name: "Video Industries", file: "video-industries.mp4", category: "Video", type: "video" },
  { name: "Video Features", file: "video-features.mp4", category: "Video", type: "video" },
  { name: "Video Partner Pitch", file: "video-partner-pitch.mp4", category: "Video", type: "video" },
  { name: "Video Partner Recruit", file: "video-partner-recruit.mp4", category: "Video", type: "video" },
  { name: "Video NCC Hero", file: "video-ncc-hero.mp4", category: "Video", type: "video" },
  { name: "Creative Ristoro", file: "creative-ristoro.mp4", category: "Video", type: "video" },
  { name: "Hero Restaurant Video", file: "hero-restaurant.mp4", category: "Video", type: "video" },
  { name: "Demo App Video", file: "demo-app-video.mp4", category: "Video", type: "video" },

  // Agents
  { name: "Agent Analytics Brain", file: "agent-analytics-brain.png", category: "Agenti AI", type: "image" },
  { name: "Agent Atlas Voice", file: "agent-atlas-voice.png", category: "Agenti AI", type: "image" },
  { name: "Agent Compliance Guardian", file: "agent-compliance-guardian.png", category: "Agenti AI", type: "image" },
  { name: "Agent Concierge AI", file: "agent-concierge-ai.png", category: "Agenti AI", type: "image" },
  { name: "Agent Concierge Food", file: "agent-concierge-food.png", category: "Agenti AI", type: "image" },
  { name: "Agent Document AI", file: "agent-document-ai.png", category: "Agenti AI", type: "image" },
  { name: "Agent Empire Assistant", file: "agent-empire-assistant.png", category: "Agenti AI", type: "image" },
  { name: "Agent Inventory", file: "agent-inventory.png", category: "Agenti AI", type: "image" },
  { name: "Agent Menu OCR", file: "agent-menu-ocr.png", category: "Agenti AI", type: "image" },
  { name: "Agent Ops Beauty", file: "agent-ops-beauty.png", category: "Agenti AI", type: "image" },
  { name: "Agent Ops Construction", file: "agent-ops-construction.png", category: "Agenti AI", type: "image" },
  { name: "Agent Ops Food", file: "agent-ops-food.png", category: "Agenti AI", type: "image" },
  { name: "Agent Ops Healthcare", file: "agent-ops-healthcare.png", category: "Agenti AI", type: "image" },
  { name: "Agent Ops NCC", file: "agent-ops-ncc.png", category: "Agenti AI", type: "image" },
  { name: "Agent Photo Gen", file: "agent-photo-gen.png", category: "Agenti AI", type: "image" },
  { name: "Agent Sales Closer", file: "agent-sales-closer.png", category: "Agenti AI", type: "image" },
  { name: "Agent Smart Notifier", file: "agent-smart-notifier.png", category: "Agenti AI", type: "image" },
  { name: "Agent Social Manager", file: "agent-social-manager.png", category: "Agenti AI", type: "image" },
  { name: "Agent Translator", file: "agent-translator.png", category: "Agenti AI", type: "image" },
  { name: "Agent TTS", file: "agent-tts.png", category: "Agenti AI", type: "image" },

  // NCC
  { name: "NCC Boat Capri", file: "ncc-boat-capri.jpg", category: "NCC", type: "image" },
  { name: "NCC Costiera Aerial", file: "ncc-costiera-aerial.jpg", category: "NCC", type: "image" },
  { name: "NCC Dest Capri", file: "ncc-dest-capri.jpg", category: "NCC", type: "image" },
  { name: "NCC Dest Costiera", file: "ncc-dest-costiera.jpg", category: "NCC", type: "image" },
  { name: "NCC Dest Pompei New", file: "ncc-dest-pompei-new.png", category: "NCC", type: "image" },
  { name: "NCC Dest Pompei", file: "ncc-dest-pompei.jpg", category: "NCC", type: "image" },
  { name: "NCC Dest Sorrento", file: "ncc-dest-sorrento.png", category: "NCC", type: "image" },
  { name: "NCC Fleet Showcase", file: "ncc-fleet-showcase.jpg", category: "NCC", type: "image" },
  { name: "NCC Hero BG Amalfi", file: "ncc-hero-bg-amalfi.jpg", category: "NCC", type: "image" },
  { name: "NCC Hero Mercedes Amalfi", file: "ncc-hero-mercedes-amalfi.jpg", category: "NCC", type: "image" },
  { name: "NCC Hero Mercedes New", file: "ncc-hero-mercedes-new.png", category: "NCC", type: "image" },
  { name: "NCC Hero Mercedes", file: "ncc-hero-mercedes.jpg", category: "NCC", type: "image" },
  { name: "NCC Premium Coast", file: "ncc-premium-coast.jpg", category: "NCC", type: "image" },
  { name: "NCC Premium Hotel", file: "ncc-premium-hotel.jpg", category: "NCC", type: "image" },
  { name: "NCC Premium Interior", file: "ncc-premium-interior.jpg", category: "NCC", type: "image" },
  { name: "NCC SUV Premium", file: "ncc-suv-premium.jpg", category: "NCC", type: "image" },

  // Dishes
  { name: "Acqua Pazza", file: "dish-acqua.jpg", category: "Piatti", type: "image" },
  { name: "Branzino", file: "dish-branzino.jpg", category: "Piatti", type: "image" },
  { name: "Bruschetta", file: "dish-bruschetta.jpg", category: "Piatti", type: "image" },
  { name: "Burrata", file: "dish-burrata.jpg", category: "Piatti", type: "image" },
  { name: "Cacio e Pepe", file: "dish-cacio-pepe.jpg", category: "Piatti", type: "image" },
  { name: "Cannolo", file: "dish-cannolo.jpg", category: "Piatti", type: "image" },
  { name: "Carpaccio", file: "dish-carpaccio.jpg", category: "Piatti", type: "image" },
  { name: "Chianti", file: "dish-chianti.jpg", category: "Piatti", type: "image" },
  { name: "Cocktail", file: "dish-cocktail.jpg", category: "Piatti", type: "image" },
  { name: "Pizza Diavola", file: "dish-diavola.jpg", category: "Piatti", type: "image" },
  { name: "Paccheri", file: "dish-paccheri.jpg", category: "Piatti", type: "image" },
  { name: "Panna Cotta", file: "dish-panna-cotta.jpg", category: "Piatti", type: "image" },
  { name: "Pasta", file: "dish-pasta.jpg", category: "Piatti", type: "image" },
  { name: "Pizza", file: "dish-pizza.jpg", category: "Piatti", type: "image" },
  { name: "Prosecco", file: "dish-prosecco.jpg", category: "Piatti", type: "image" },
  { name: "Quattro Formaggi", file: "dish-quattro-formaggi.jpg", category: "Piatti", type: "image" },
  { name: "Risotto", file: "dish-risotto.jpg", category: "Piatti", type: "image" },
  { name: "Steak", file: "dish-steak.jpg", category: "Piatti", type: "image" },
  { name: "Tagliata", file: "dish-tagliata.jpg", category: "Piatti", type: "image" },
  { name: "Tagliere", file: "dish-tagliere.jpg", category: "Piatti", type: "image" },
  { name: "Tartufata", file: "dish-tartufata.jpg", category: "Piatti", type: "image" },
  { name: "Tiramisù", file: "dish-tiramisu.jpg", category: "Piatti", type: "image" },

  // Bakery
  { name: "Avocado Toast", file: "bakery-avocado-toast.jpg", category: "Bakery", type: "image" },
  { name: "Brioche", file: "bakery-brioche.jpg", category: "Bakery", type: "image" },
  { name: "Cannoli", file: "bakery-cannoli.jpg", category: "Bakery", type: "image" },
  { name: "Cinnamon Roll", file: "bakery-cinnamon-roll.jpg", category: "Bakery", type: "image" },
  { name: "Club Sandwich", file: "bakery-club-sandwich.jpg", category: "Bakery", type: "image" },
  { name: "Crème Brûlée", file: "bakery-creme-brulee.jpg", category: "Bakery", type: "image" },
  { name: "Croissant", file: "bakery-croissant.jpg", category: "Bakery", type: "image" },
  { name: "Espresso", file: "bakery-espresso.jpg", category: "Bakery", type: "image" },
  { name: "Focaccia", file: "bakery-focaccia.jpg", category: "Bakery", type: "image" },
  { name: "Fondant", file: "bakery-fondant.jpg", category: "Bakery", type: "image" },
  { name: "Fruit Tart", file: "bakery-fruit-tart.jpg", category: "Bakery", type: "image" },
  { name: "Latte", file: "bakery-latte.jpg", category: "Bakery", type: "image" },
  { name: "Macarons", file: "bakery-macarons.jpg", category: "Bakery", type: "image" },
  { name: "Pain au Chocolat", file: "bakery-pain-chocolat.jpg", category: "Bakery", type: "image" },
  { name: "Sourdough", file: "bakery-sourdough.jpg", category: "Bakery", type: "image" },
  { name: "Tiramisù Cake", file: "bakery-tiramisu-cake.jpg", category: "Bakery", type: "image" },

  // Story
  { name: "Story Dish", file: "story-dish.jpg", category: "Story", type: "image" },
  { name: "Story Interior", file: "story-interior.jpg", category: "Story", type: "image" },
  { name: "Story Pasta", file: "story-pasta.jpg", category: "Story", type: "image" },
  { name: "Story Wine", file: "story-wine.jpg", category: "Story", type: "image" },
];

const CATEGORIES = ["Tutti", "Logo", "Landing", "Mockup", "Cartoon", "Video", "Agenti AI", "NCC", "Piatti", "Bakery", "Story"];

export default function BrandAssetsPage() {
  const navigate = useNavigate();
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tutti");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [preview, setPreview] = useState<Asset | null>(null);

  const filtered = useMemo(() => ALL_ASSETS.filter(a => {
    if (category !== "Tutti" && a.category !== category) return false;
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [category, typeFilter, search]);

  const downloadAsset = (asset: Asset) => {
    const link = document.createElement("a");
    link.href = assetUrl(asset.file);
    link.download = asset.file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download avviato", description: asset.name });
  };

  const copyUrl = (idx: number, file: string) => {
    navigator.clipboard.writeText(assetUrl(file));
    setCopiedIdx(idx);
    toast({ title: "URL copiato" });
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" /> Brand Assets
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {ALL_ASSETS.length} asset totali • {ALL_ASSETS.filter(a => a.type === "video").length} video • {ALL_ASSETS.filter(a => a.type === "image").length} immagini
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca asset..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${category === c ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            {(["all", "image", "video"] as const).map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${typeFilter === t ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground border border-border"}`}>
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

        <p className="text-xs text-muted-foreground mb-4">{filtered.length} risultati</p>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((asset, i) => (
              <motion.div key={`${asset.category}-${asset.file}`}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}
                className="group rounded-xl border border-border/50 bg-card/60 overflow-hidden hover:border-primary/30 transition-all">
                <div className="relative aspect-square bg-foreground/5 cursor-pointer" onClick={() => setPreview(asset)}>
                  {asset.type === "video" ? (
                    <>
                      <video src={assetUrl(asset.file)} muted className="w-full h-full object-cover" preload="metadata" />
                      <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                          <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img src={assetUrl(asset.file)} alt={asset.name} className="w-full h-full object-cover" loading="lazy" />
                  )}
                  <div className="absolute top-1.5 left-1.5 flex gap-1">
                    <span className={`px-1.5 py-0.5 rounded-full text-[0.5rem] font-bold uppercase ${asset.type === "video" ? "bg-accent/80 text-accent-foreground" : "bg-primary/80 text-primary-foreground"}`}>
                      {asset.type === "video" ? "VIDEO" : "IMG"}
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="text-[0.65rem] font-semibold text-foreground truncate">{asset.name}</h3>
                  <p className="text-[0.55rem] text-muted-foreground">{asset.category}</p>
                  <div className="flex gap-1 mt-1.5">
                    <Button variant="ghost" size="sm" className="h-6 text-[0.55rem] gap-1 px-1.5" onClick={() => downloadAsset(asset)}>
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 text-[0.55rem] gap-1 px-1.5" onClick={() => copyUrl(i, asset.file)}>
                      {copiedIdx === i ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 text-[0.55rem] gap-1 px-1.5" onClick={() => setPreview(asset)}>
                      <Eye className="w-3 h-3" />
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
            {filtered.map((asset, i) => (
              <motion.div key={`${asset.category}-${asset.file}`}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-foreground/5 flex-shrink-0 cursor-pointer" onClick={() => setPreview(asset)}>
                  {asset.type === "video" ? (
                    <video src={assetUrl(asset.file)} muted className="w-full h-full object-cover" preload="metadata" />
                  ) : (
                    <img src={assetUrl(asset.file)} alt={asset.name} className="w-full h-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold text-foreground truncate">{asset.name}</h3>
                    <span className={`px-1.5 py-0.5 rounded text-[0.5rem] font-bold flex-shrink-0 ${asset.type === "video" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                      {asset.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[0.6rem] text-muted-foreground">{asset.category}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => downloadAsset(asset)}>
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyUrl(i, asset.file)}>
                    {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Image className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nessun asset trovato</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="absolute -top-10 right-0 text-primary-foreground hover:text-primary-foreground/80" onClick={() => setPreview(null)}>
              <X className="w-5 h-5" />
            </Button>
            {preview.type === "video" ? (
              <video src={assetUrl(preview.file)} controls autoPlay className="w-full max-h-[80vh] rounded-xl" />
            ) : (
              <img src={assetUrl(preview.file)} alt={preview.name} className="w-full max-h-[80vh] object-contain rounded-xl" />
            )}
            <div className="mt-3 text-center">
              <p className="text-sm font-semibold text-primary-foreground">{preview.name}</p>
              <p className="text-xs text-primary-foreground/60">{preview.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
