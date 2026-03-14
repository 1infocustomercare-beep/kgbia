import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Crown, Copy, Check, ArrowLeft, Film, Image, Search, Grid3X3, List, Play, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// --- Logos ---
import empireLogoIcon from "@/assets/empire-logo-icon.png";
import empireLogoFull from "@/assets/empire-logo-full.png";
import restaurantLogo from "@/assets/restaurant-logo.png";

// --- Hero / Landing ---
import heroTechCommand from "@/assets/hero-tech-command.jpg";
import heroAiPlatform from "@/assets/hero-ai-platform.jpg";
import heroPartnerLuxury from "@/assets/hero-partner-luxury.jpg";
import heroLanding from "@/assets/hero-landing.jpg";

// --- Mockups ---
import mockupCliente from "@/assets/mockup-cliente.jpg";
import mockupAdmin from "@/assets/mockup-admin.jpg";
import mockupCucina from "@/assets/mockup-cucina.jpg";

// --- Cartoons ---
import cartoonAiPhoto from "@/assets/cartoon-ai-photo.png";
import cartoonDashboard from "@/assets/cartoon-dashboard.png";
import cartoonOrdersKitchen from "@/assets/cartoon-orders-kitchen.png";
import cartoonProfit from "@/assets/cartoon-profit.png";
import cartoonStudioMenu from "@/assets/cartoon-studio-menu.png";

// --- Videos ---
import videoHeroEmpire from "@/assets/video-hero-empire.mp4";
import videoIndustries from "@/assets/video-industries.mp4";
import videoFeatures from "@/assets/video-features.mp4";
import videoPartnerPitch from "@/assets/video-partner-pitch.mp4";
import videoPartnerRecruit from "@/assets/video-partner-recruit.mp4";
import videoNccHero from "@/assets/video-ncc-hero.mp4";
import creativeRistoro from "@/assets/creative-ristoro.mp4";
import heroRestaurant from "@/assets/hero-restaurant.mp4";
import demoAppVideo from "@/assets/demo-app-video.mp4";

// --- Agents ---
import agentAnalyticsBrain from "@/assets/agent-analytics-brain.png";
import agentAtlasVoice from "@/assets/agent-atlas-voice.png";
import agentComplianceGuardian from "@/assets/agent-compliance-guardian.png";
import agentConciergeAi from "@/assets/agent-concierge-ai.png";
import agentConciergeFood from "@/assets/agent-concierge-food.png";
import agentDocumentAi from "@/assets/agent-document-ai.png";
import agentEmpireAssistant from "@/assets/agent-empire-assistant.png";
import agentInventory from "@/assets/agent-inventory.png";
import agentMenuOcr from "@/assets/agent-menu-ocr.png";
import agentOpsBeauty from "@/assets/agent-ops-beauty.png";
import agentOpsConstruction from "@/assets/agent-ops-construction.png";
import agentOpsFood from "@/assets/agent-ops-food.png";
import agentOpsHealthcare from "@/assets/agent-ops-healthcare.png";
import agentOpsNcc from "@/assets/agent-ops-ncc.png";
import agentPhotoGen from "@/assets/agent-photo-gen.png";
import agentSalesCloser from "@/assets/agent-sales-closer.png";
import agentSmartNotifier from "@/assets/agent-smart-notifier.png";
import agentSocialManager from "@/assets/agent-social-manager.png";
import agentTranslator from "@/assets/agent-translator.png";
import agentTts from "@/assets/agent-tts.png";

// --- NCC ---
import nccBoatCapri from "@/assets/ncc-boat-capri.jpg";
import nccCostieraAerial from "@/assets/ncc-costiera-aerial.jpg";
import nccDestCapri from "@/assets/ncc-dest-capri.jpg";
import nccDestCostiera from "@/assets/ncc-dest-costiera.jpg";
import nccDestPompeiNew from "@/assets/ncc-dest-pompei-new.png";
import nccDestPompei from "@/assets/ncc-dest-pompei.jpg";
import nccDestSorrento from "@/assets/ncc-dest-sorrento.png";
import nccFleetShowcase from "@/assets/ncc-fleet-showcase.jpg";
import nccHeroBgAmalfi from "@/assets/ncc-hero-bg-amalfi.jpg";
import nccHeroMercedesAmalfi from "@/assets/ncc-hero-mercedes-amalfi.jpg";
import nccHeroMercedesNew from "@/assets/ncc-hero-mercedes-new.png";
import nccHeroMercedes from "@/assets/ncc-hero-mercedes.jpg";
import nccPremiumCoast from "@/assets/ncc-premium-coast.jpg";
import nccPremiumHotel from "@/assets/ncc-premium-hotel.jpg";
import nccPremiumInterior from "@/assets/ncc-premium-interior.jpg";
import nccSuvPremium from "@/assets/ncc-suv-premium.jpg";

// --- Dishes ---
import dishAcqua from "@/assets/dish-acqua.jpg";
import dishBranzino from "@/assets/dish-branzino.jpg";
import dishBruschetta from "@/assets/dish-bruschetta.jpg";
import dishBurrata from "@/assets/dish-burrata.jpg";
import dishCacioPepe from "@/assets/dish-cacio-pepe.jpg";
import dishCannolo from "@/assets/dish-cannolo.jpg";
import dishCarpaccio from "@/assets/dish-carpaccio.jpg";
import dishChianti from "@/assets/dish-chianti.jpg";
import dishCocktail from "@/assets/dish-cocktail.jpg";
import dishDiavola from "@/assets/dish-diavola.jpg";
import dishPaccheri from "@/assets/dish-paccheri.jpg";
import dishPannaCotta from "@/assets/dish-panna-cotta.jpg";
import dishPasta from "@/assets/dish-pasta.jpg";
import dishPizza from "@/assets/dish-pizza.jpg";
import dishProsecco from "@/assets/dish-prosecco.jpg";
import dishQuattroFormaggi from "@/assets/dish-quattro-formaggi.jpg";
import dishRisotto from "@/assets/dish-risotto.jpg";
import dishSteak from "@/assets/dish-steak.jpg";
import dishTagliata from "@/assets/dish-tagliata.jpg";
import dishTagliere from "@/assets/dish-tagliere.jpg";
import dishTartufata from "@/assets/dish-tartufata.jpg";
import dishTiramisu from "@/assets/dish-tiramisu.jpg";

// --- Bakery ---
import bakeryAvocadoToast from "@/assets/bakery-avocado-toast.jpg";
import bakeryBrioche from "@/assets/bakery-brioche.jpg";
import bakeryCannoli from "@/assets/bakery-cannoli.jpg";
import bakeryCinnamonRoll from "@/assets/bakery-cinnamon-roll.jpg";
import bakeryClubSandwich from "@/assets/bakery-club-sandwich.jpg";
import bakeryCremeBrulee from "@/assets/bakery-creme-brulee.jpg";
import bakeryCroissant from "@/assets/bakery-croissant.jpg";
import bakeryEspresso from "@/assets/bakery-espresso.jpg";
import bakeryFocaccia from "@/assets/bakery-focaccia.jpg";
import bakeryFondant from "@/assets/bakery-fondant.jpg";
import bakeryFruitTart from "@/assets/bakery-fruit-tart.jpg";
import bakeryLatte from "@/assets/bakery-latte.jpg";
import bakeryMacarons from "@/assets/bakery-macarons.jpg";
import bakeryPainChocolat from "@/assets/bakery-pain-chocolat.jpg";
import bakerySourdough from "@/assets/bakery-sourdough.jpg";
import bakeryTiramisuCake from "@/assets/bakery-tiramisu-cake.jpg";

// --- Story ---
import storyDish from "@/assets/story-dish.jpg";
import storyInterior from "@/assets/story-interior.jpg";
import storyPasta from "@/assets/story-pasta.jpg";
import storyWine from "@/assets/story-wine.jpg";

interface Asset {
  name: string;
  src: string;
  category: string;
  type: "image" | "video";
}

const ALL_ASSETS: Asset[] = [
  // Logos
  { name: "Empire Logo Icon (Crown)", src: empireLogoIcon, category: "Logo", type: "image" },
  { name: "Empire Logo Full (Wordmark)", src: empireLogoFull, category: "Logo", type: "image" },
  { name: "Restaurant Logo", src: restaurantLogo, category: "Logo", type: "image" },

  // Hero / Landing
  { name: "Hero Tech Command", src: heroTechCommand, category: "Landing", type: "image" },
  { name: "Hero AI Platform", src: heroAiPlatform, category: "Landing", type: "image" },
  { name: "Hero Partner Luxury", src: heroPartnerLuxury, category: "Landing", type: "image" },
  { name: "Hero Landing", src: heroLanding, category: "Landing", type: "image" },

  // Mockups
  { name: "Mockup Cliente", src: mockupCliente, category: "Mockup", type: "image" },
  { name: "Mockup Admin", src: mockupAdmin, category: "Mockup", type: "image" },
  { name: "Mockup Cucina", src: mockupCucina, category: "Mockup", type: "image" },

  // Cartoons
  { name: "Cartoon AI Photo", src: cartoonAiPhoto, category: "Cartoon", type: "image" },
  { name: "Cartoon Dashboard", src: cartoonDashboard, category: "Cartoon", type: "image" },
  { name: "Cartoon Ordini Cucina", src: cartoonOrdersKitchen, category: "Cartoon", type: "image" },
  { name: "Cartoon Profitto", src: cartoonProfit, category: "Cartoon", type: "image" },
  { name: "Cartoon Studio Menu", src: cartoonStudioMenu, category: "Cartoon", type: "image" },

  // Videos
  { name: "Video Hero Empire", src: videoHeroEmpire, category: "Video", type: "video" },
  { name: "Video Industries", src: videoIndustries, category: "Video", type: "video" },
  { name: "Video Features", src: videoFeatures, category: "Video", type: "video" },
  { name: "Video Partner Pitch", src: videoPartnerPitch, category: "Video", type: "video" },
  { name: "Video Partner Recruit", src: videoPartnerRecruit, category: "Video", type: "video" },
  { name: "Video NCC Hero", src: videoNccHero, category: "Video", type: "video" },
  { name: "Creative Ristoro", src: creativeRistoro, category: "Video", type: "video" },
  { name: "Hero Restaurant Video", src: heroRestaurant, category: "Video", type: "video" },
  { name: "Demo App Video", src: demoAppVideo, category: "Video", type: "video" },

  // Agents
  { name: "Agent Analytics Brain", src: agentAnalyticsBrain, category: "Agenti AI", type: "image" },
  { name: "Agent Atlas Voice", src: agentAtlasVoice, category: "Agenti AI", type: "image" },
  { name: "Agent Compliance Guardian", src: agentComplianceGuardian, category: "Agenti AI", type: "image" },
  { name: "Agent Concierge AI", src: agentConciergeAi, category: "Agenti AI", type: "image" },
  { name: "Agent Concierge Food", src: agentConciergeFood, category: "Agenti AI", type: "image" },
  { name: "Agent Document AI", src: agentDocumentAi, category: "Agenti AI", type: "image" },
  { name: "Agent Empire Assistant", src: agentEmpireAssistant, category: "Agenti AI", type: "image" },
  { name: "Agent Inventory", src: agentInventory, category: "Agenti AI", type: "image" },
  { name: "Agent Menu OCR", src: agentMenuOcr, category: "Agenti AI", type: "image" },
  { name: "Agent Ops Beauty", src: agentOpsBeauty, category: "Agenti AI", type: "image" },
  { name: "Agent Ops Construction", src: agentOpsConstruction, category: "Agenti AI", type: "image" },
  { name: "Agent Ops Food", src: agentOpsFood, category: "Agenti AI", type: "image" },
  { name: "Agent Ops Healthcare", src: agentOpsHealthcare, category: "Agenti AI", type: "image" },
  { name: "Agent Ops NCC", src: agentOpsNcc, category: "Agenti AI", type: "image" },
  { name: "Agent Photo Gen", src: agentPhotoGen, category: "Agenti AI", type: "image" },
  { name: "Agent Sales Closer", src: agentSalesCloser, category: "Agenti AI", type: "image" },
  { name: "Agent Smart Notifier", src: agentSmartNotifier, category: "Agenti AI", type: "image" },
  { name: "Agent Social Manager", src: agentSocialManager, category: "Agenti AI", type: "image" },
  { name: "Agent Translator", src: agentTranslator, category: "Agenti AI", type: "image" },
  { name: "Agent TTS", src: agentTts, category: "Agenti AI", type: "image" },

  // NCC
  { name: "NCC Boat Capri", src: nccBoatCapri, category: "NCC", type: "image" },
  { name: "NCC Costiera Aerial", src: nccCostieraAerial, category: "NCC", type: "image" },
  { name: "NCC Dest Capri", src: nccDestCapri, category: "NCC", type: "image" },
  { name: "NCC Dest Costiera", src: nccDestCostiera, category: "NCC", type: "image" },
  { name: "NCC Dest Pompei New", src: nccDestPompeiNew, category: "NCC", type: "image" },
  { name: "NCC Dest Pompei", src: nccDestPompei, category: "NCC", type: "image" },
  { name: "NCC Dest Sorrento", src: nccDestSorrento, category: "NCC", type: "image" },
  { name: "NCC Fleet Showcase", src: nccFleetShowcase, category: "NCC", type: "image" },
  { name: "NCC Hero BG Amalfi", src: nccHeroBgAmalfi, category: "NCC", type: "image" },
  { name: "NCC Hero Mercedes Amalfi", src: nccHeroMercedesAmalfi, category: "NCC", type: "image" },
  { name: "NCC Hero Mercedes New", src: nccHeroMercedesNew, category: "NCC", type: "image" },
  { name: "NCC Hero Mercedes", src: nccHeroMercedes, category: "NCC", type: "image" },
  { name: "NCC Premium Coast", src: nccPremiumCoast, category: "NCC", type: "image" },
  { name: "NCC Premium Hotel", src: nccPremiumHotel, category: "NCC", type: "image" },
  { name: "NCC Premium Interior", src: nccPremiumInterior, category: "NCC", type: "image" },
  { name: "NCC SUV Premium", src: nccSuvPremium, category: "NCC", type: "image" },

  // Dishes
  { name: "Acqua Pazza", src: dishAcqua, category: "Piatti", type: "image" },
  { name: "Branzino", src: dishBranzino, category: "Piatti", type: "image" },
  { name: "Bruschetta", src: dishBruschetta, category: "Piatti", type: "image" },
  { name: "Burrata", src: dishBurrata, category: "Piatti", type: "image" },
  { name: "Cacio e Pepe", src: dishCacioPepe, category: "Piatti", type: "image" },
  { name: "Cannolo", src: dishCannolo, category: "Piatti", type: "image" },
  { name: "Carpaccio", src: dishCarpaccio, category: "Piatti", type: "image" },
  { name: "Chianti", src: dishChianti, category: "Piatti", type: "image" },
  { name: "Cocktail", src: dishCocktail, category: "Piatti", type: "image" },
  { name: "Pizza Diavola", src: dishDiavola, category: "Piatti", type: "image" },
  { name: "Paccheri", src: dishPaccheri, category: "Piatti", type: "image" },
  { name: "Panna Cotta", src: dishPannaCotta, category: "Piatti", type: "image" },
  { name: "Pasta", src: dishPasta, category: "Piatti", type: "image" },
  { name: "Pizza", src: dishPizza, category: "Piatti", type: "image" },
  { name: "Prosecco", src: dishProsecco, category: "Piatti", type: "image" },
  { name: "Quattro Formaggi", src: dishQuattroFormaggi, category: "Piatti", type: "image" },
  { name: "Risotto", src: dishRisotto, category: "Piatti", type: "image" },
  { name: "Steak", src: dishSteak, category: "Piatti", type: "image" },
  { name: "Tagliata", src: dishTagliata, category: "Piatti", type: "image" },
  { name: "Tagliere", src: dishTagliere, category: "Piatti", type: "image" },
  { name: "Tartufata", src: dishTartufata, category: "Piatti", type: "image" },
  { name: "Tiramisù", src: dishTiramisu, category: "Piatti", type: "image" },

  // Bakery
  { name: "Avocado Toast", src: bakeryAvocadoToast, category: "Bakery", type: "image" },
  { name: "Brioche", src: bakeryBrioche, category: "Bakery", type: "image" },
  { name: "Cannoli", src: bakeryCannoli, category: "Bakery", type: "image" },
  { name: "Cinnamon Roll", src: bakeryCinnamonRoll, category: "Bakery", type: "image" },
  { name: "Club Sandwich", src: bakeryClubSandwich, category: "Bakery", type: "image" },
  { name: "Crème Brûlée", src: bakeryCremeBrulee, category: "Bakery", type: "image" },
  { name: "Croissant", src: bakeryCroissant, category: "Bakery", type: "image" },
  { name: "Espresso", src: bakeryEspresso, category: "Bakery", type: "image" },
  { name: "Focaccia", src: bakeryFocaccia, category: "Bakery", type: "image" },
  { name: "Fondant", src: bakeryFondant, category: "Bakery", type: "image" },
  { name: "Fruit Tart", src: bakeryFruitTart, category: "Bakery", type: "image" },
  { name: "Latte", src: bakeryLatte, category: "Bakery", type: "image" },
  { name: "Macarons", src: bakeryMacarons, category: "Bakery", type: "image" },
  { name: "Pain au Chocolat", src: bakeryPainChocolat, category: "Bakery", type: "image" },
  { name: "Sourdough", src: bakerySourdough, category: "Bakery", type: "image" },
  { name: "Tiramisù Cake", src: bakeryTiramisuCake, category: "Bakery", type: "image" },

  // Story
  { name: "Story Dish", src: storyDish, category: "Story", type: "image" },
  { name: "Story Interior", src: storyInterior, category: "Story", type: "image" },
  { name: "Story Pasta", src: storyPasta, category: "Story", type: "image" },
  { name: "Story Wine", src: storyWine, category: "Story", type: "image" },
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

  const filtered = ALL_ASSETS.filter(a => {
    if (category !== "Tutti" && a.category !== category) return false;
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const downloadAsset = (asset: Asset) => {
    const link = document.createElement("a");
    link.href = asset.src;
    link.download = asset.name.toLowerCase().replace(/[^a-z0-9]/g, "-") + (asset.src.includes(".png") ? ".png" : asset.src.includes(".mp4") ? ".mp4" : ".jpg");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download avviato", description: asset.name });
  };

  const copyUrl = (idx: number, src: string) => {
    navigator.clipboard.writeText(window.location.origin + src);
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
              <motion.div key={`${asset.category}-${asset.name}`}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}
                className="group rounded-xl border border-border/50 bg-card/60 overflow-hidden hover:border-primary/30 transition-all">
                <div className="relative aspect-square bg-foreground/5 cursor-pointer" onClick={() => setPreview(asset)}>
                  {asset.type === "video" ? (
                    <>
                      <video src={asset.src} muted className="w-full h-full object-cover" preload="metadata" />
                      <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                          <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img src={asset.src} alt={asset.name} className="w-full h-full object-cover" loading="lazy" />
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
                    <Button variant="ghost" size="sm" className="h-6 text-[0.55rem] gap-1 px-1.5" onClick={() => copyUrl(i, asset.src)}>
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
              <motion.div key={`${asset.category}-${asset.name}`}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-foreground/5 flex-shrink-0 cursor-pointer" onClick={() => setPreview(asset)}>
                  {asset.type === "video" ? (
                    <video src={asset.src} muted className="w-full h-full object-cover" preload="metadata" />
                  ) : (
                    <img src={asset.src} alt={asset.name} className="w-full h-full object-cover" loading="lazy" />
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
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyUrl(i, asset.src)}>
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
              <video src={preview.src} controls autoPlay className="w-full max-h-[80vh] rounded-xl" />
            ) : (
              <img src={preview.src} alt={preview.name} className="w-full max-h-[80vh] object-contain rounded-xl" />
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
