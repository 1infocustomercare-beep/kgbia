import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, Upload, Wand2, Download, Loader2, Image as ImageIcon, X, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import cartoonAiPhoto from "@/assets/cartoon-ai-photo.png";
import PlateGallery from "./PlateGallery";

const PLATE_STYLES = [
  { id: "white-ceramic", label: "Ceramica Bianca", emoji: "🍽️" },
  { id: "dark-slate", label: "Ardesia Scura", emoji: "🪨" },
  { id: "rustic-wood", label: "Legno Rustico", emoji: "🪵" },
  { id: "marble", label: "Marmo", emoji: "⬜" },
  { id: "terracotta", label: "Terracotta", emoji: "🏺" },
  { id: "glass", label: "Vetro Trasparente", emoji: "🔮" },
];

interface FoodPhotoGeneratorProps {
  restaurantId: string;
  aiTokens: number;
  setAiTokens: (v: number | ((prev: number) => number)) => void;
  onPhotoGenerated?: (url: string, dishName: string) => void;
}

export default function FoodPhotoGenerator({ restaurantId, aiTokens, setAiTokens, onPhotoGenerated }: FoodPhotoGeneratorProps) {
  const [dishName, setDishName] = useState("");
  const [plateStyle, setPlateStyle] = useState("white-ceramic");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<"describe" | "photo" | "myplates">("describe");
  const [selectedPlateId, setSelectedPlateId] = useState<string | null>(null);
  const [selectedPlateUrl, setSelectedPlateUrl] = useState<string | null>(null);
  const [selectedPlateName, setSelectedPlateName] = useState<string | null>(null);

  const handlePhotoUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File troppo grande (max 10MB)", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setUserPhoto(base64);
        setUserPhotoPreview(base64);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleGenerate = async () => {
    if (!dishName.trim() && !userPhoto && !selectedPlateUrl) {
      toast({ title: "Inserisci il nome del piatto o seleziona un piatto", variant: "destructive" });
      return;
    }
    if (aiTokens <= 0) {
      toast({ title: "Gettoni IA esauriti", description: "Acquista altri gettoni dalla dashboard", variant: "destructive" });
      return;
    }

    setGenerating(true);
    setGeneratedUrl(null);

    try {
      const { data: tokenData } = await supabase.from("ai_tokens").select("balance").eq("restaurant_id", restaurantId).single();
      const currentBalance = tokenData?.balance ?? 0;
      if (currentBalance <= 0) {
        toast({ title: "Gettoni IA esauriti", variant: "destructive" });
        setGenerating(false);
        return;
      }
      await supabase.from("ai_tokens").update({ balance: currentBalance - 1 }).eq("restaurant_id", restaurantId);
      await (supabase as any).from("ai_token_history").insert({
        restaurant_id: restaurantId,
        tokens: -1,
        action: `Food Photo AI: ${dishName || "foto piatto"}`,
      });
      setAiTokens(currentBalance - 1);

      const plate = PLATE_STYLES.find(p => p.id === plateStyle);
      const body: any = {
        action: "generate-foodporn",
        dishName: dishName.trim(),
        plateStyle: mode === "myplates" && selectedPlateName 
          ? `the exact plate shown in the reference image (${selectedPlateName})` 
          : plate?.label || "elegant white ceramic plate",
      };

      // If user uploaded a photo, send base64
      if (mode === "photo" && userPhoto) {
        body.userPhotoBase64 = userPhoto;
      }

      // If user selected a plate from gallery, send the plate image URL
      if (mode === "myplates" && selectedPlateUrl) {
        body.plateImageUrl = selectedPlateUrl;
      }

      const { data, error } = await supabase.functions.invoke("ai-menu", { body });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.imageUrl) {
        setGeneratedUrl(data.imageUrl);
        toast({ title: "📸 Foto food-porn generata!", description: `Token rimanenti: ${currentBalance - 1}` });
      } else {
        throw new Error("Nessuna immagine generata");
      }
    } catch (err: any) {
      toast({ title: "Errore", description: err?.message || "Riprova.", variant: "destructive" });
    }
    setGenerating(false);
  };

  const handleSaveToMenu = () => {
    if (generatedUrl && onPhotoGenerated) {
      onPhotoGenerated(generatedUrl, dishName);
      toast({ title: "Foto salvata nel menu!" });
    }
  };

  const canGenerate = mode === "describe" 
    ? !!dishName.trim() 
    : mode === "photo" 
    ? (!!dishName.trim() || !!userPhoto) 
    : (!!dishName.trim() && !!selectedPlateUrl);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <img src={cartoonAiPhoto} alt="" className="w-24 h-24 mx-auto mb-2 object-contain" />
        <h3 className="text-base font-display font-bold text-foreground">📸 Food Photo AI</h3>
        <p className="text-[11px] text-muted-foreground">Crea foto gourmet professionali dei tuoi piatti con l'IA</p>
      </div>

      {/* Mode selector — 3 tabs now */}
      <div className="flex gap-1 bg-secondary/30 p-1 rounded-xl">
        <button
          onClick={() => setMode("describe")}
          className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-[11px] font-semibold transition-all min-h-[40px] ${
            mode === "describe" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          Descrivi
        </button>
        <button
          onClick={() => setMode("photo")}
          className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-[11px] font-semibold transition-all min-h-[40px] ${
            mode === "photo" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          Foto
        </button>
        <button
          onClick={() => setMode("myplates")}
          className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-lg text-[11px] font-semibold transition-all min-h-[40px] ${
            mode === "myplates" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          🍽️
          I Miei Piatti
        </button>
      </div>

      {/* Dish name input */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Nome del piatto</label>
        <input
          type="text"
          value={dishName}
          onChange={e => setDishName(e.target.value)}
          placeholder="es. Carbonara, Tiramisù, Crêpe Gourmet..."
          className="w-full px-3 py-3 rounded-xl bg-card border border-border/30 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]"
        />
      </div>

      {/* Photo upload mode */}
      {mode === "photo" && (
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Foto del tuo piatto (opzionale)
          </label>
          <p className="text-[10px] text-muted-foreground">
            Carica una foto del piatto reale — l'IA lo trasformerà in una foto professionale food-porn 🍽️
          </p>
          {userPhotoPreview ? (
            <div className="relative">
              <img src={userPhotoPreview} alt="Il tuo piatto" className="w-full h-40 object-cover rounded-xl border border-border/30" />
              <button
                onClick={() => { setUserPhoto(null); setUserPhotoPreview(null); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>
          ) : (
            <motion.button
              onClick={handlePhotoUpload}
              className="w-full py-6 rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors min-h-[88px]"
              whileTap={{ scale: 0.97 }}
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs font-medium">Tocca per caricare foto</span>
            </motion.button>
          )}
        </div>
      )}

      {/* My Plates mode — gallery selector */}
      {mode === "myplates" && (
        <div className="space-y-2">
          <PlateGallery
            restaurantId={restaurantId}
            selectionMode
            selectedPlateId={selectedPlateId}
            onSelectPlate={(plate) => {
              setSelectedPlateId(plate.id);
              setSelectedPlateUrl(plate.image_url);
              setSelectedPlateName(plate.name);
            }}
          />
          {selectedPlateName && (
            <p className="text-[10px] text-primary font-medium text-center">
              ✅ Piatto selezionato: {selectedPlateName}
            </p>
          )}
        </div>
      )}

      {/* Plate style selector — only for describe mode */}
      {mode === "describe" && (
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Stile piatto</label>
          <div className="grid grid-cols-3 gap-1.5">
            {PLATE_STYLES.map(p => (
              <button
                key={p.id}
                onClick={() => setPlateStyle(p.id)}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-[10px] font-medium border transition-all min-h-[52px] ${
                  plateStyle === p.id
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-secondary/30 text-muted-foreground border-transparent hover:border-border"
                }`}
              >
                <span className="text-base">{p.emoji}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Generate button */}
      <motion.button
        onClick={handleGenerate}
        disabled={generating || !canGenerate}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm disabled:opacity-40 min-h-[48px] flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        whileTap={{ scale: 0.97 }}
      >
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generando foto food-porn...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Genera Foto Gourmet (1 gettone)
          </>
        )}
      </motion.button>

      {/* Result */}
      <AnimatePresence>
        {generatedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="relative overflow-hidden rounded-2xl border border-primary/20">
              <img src={generatedUrl} alt={dishName} className="w-full aspect-square object-cover" />
              <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-primary/80 text-primary-foreground text-[9px] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI FOOD-PORN
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <motion.button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = generatedUrl;
                  a.download = `${dishName || "food-photo"}.jpg`;
                  a.target = "_blank";
                  a.click();
                }}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-secondary/50 text-foreground text-xs font-medium min-h-[44px]"
                whileTap={{ scale: 0.97 }}
              >
                <Download className="w-3.5 h-3.5" /> Scarica
              </motion.button>

              {onPhotoGenerated && (
                <motion.button
                  onClick={handleSaveToMenu}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary/20 text-primary text-xs font-semibold min-h-[44px]"
                  whileTap={{ scale: 0.97 }}
                >
                  <Save className="w-3.5 h-3.5" /> Salva nel Menu
                </motion.button>
              )}
            </div>

            <button
              onClick={() => { setGeneratedUrl(null); }}
              className="w-full text-center text-xs text-muted-foreground hover:text-primary py-2"
            >
              🔄 Genera un'altra versione
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
