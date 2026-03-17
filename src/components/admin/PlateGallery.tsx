import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, X, Save, Loader2, Image as ImageIcon, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Plate {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

interface PlateGalleryProps {
  restaurantId: string;
  onSelectPlate?: (plate: Plate) => void;
  selectionMode?: boolean;
  selectedPlateId?: string | null;
}

export default function PlateGallery({ restaurantId, onSelectPlate, selectionMode = false, selectedPlateId }: PlateGalleryProps) {
  const [plates, setPlates] = useState<Plate[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchPlates = useCallback(async () => {
    const { data, error } = await supabase
      .from("restaurant_plates")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (!error && data) setPlates(data);
    setLoading(false);
  }, [restaurantId]);

  useEffect(() => { fetchPlates(); }, [fetchPlates]);

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.capture = "environment";
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files?.length) return;
      setUploading(true);
      try {
        for (const file of Array.from(files)) {
          if (file.size > 10 * 1024 * 1024) { toast({ title: "Max 10MB per foto", variant: "destructive" }); continue; }
          const ext = file.name.split(".").pop() || "jpg";
          const fileName = `plates/${restaurantId}/${crypto.randomUUID()}.${ext}`;
          const { error: uploadErr } = await supabase.storage
            .from("restaurant-logos")
            .upload(fileName, file, { contentType: file.type, upsert: true });
          if (uploadErr) { toast({ title: "Errore upload", description: uploadErr.message, variant: "destructive" }); continue; }
          const { data: urlData } = supabase.storage.from("restaurant-logos").getPublicUrl(fileName);
          const plateName = file.name.replace(/\.\w+$/, "").replace(/[-_]/g, " ").slice(0, 50) || "Piatto";
          await supabase.from("restaurant_plates").insert({
            restaurant_id: restaurantId,
            name: plateName,
            image_url: urlData.publicUrl,
            sort_order: plates.length,
          });
        }
        toast({ title: `${files.length} piatt${files.length > 1 ? "i" : "o"} caricati!` });
        fetchPlates();
      } catch (err: any) {
        toast({ title: "Errore", description: err?.message, variant: "destructive" });
      }
      setUploading(false);
    };
    input.click();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("restaurant_plates").update({ is_active: false }).eq("id", id);
    setPlates(prev => prev.filter(p => p.id !== id));
    toast({ title: "Piatto rimosso" });
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    await supabase.from("restaurant_plates").update({ name: editName.trim() }).eq("id", id);
    setPlates(prev => prev.map(p => p.id === id ? { ...p, name: editName.trim() } : p));
    setEditingId(null);
    toast({ title: "Nome aggiornato" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!selectionMode && (
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-foreground">🍽️ I Miei Piatti</h4>
            <p className="text-[10px] text-muted-foreground">Carica le foto dei tuoi piatti vuoti per usarli nella generazione IA</p>
          </div>
          <motion.button
            onClick={handleUpload}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold min-h-[40px]"
            whileTap={{ scale: 0.95 }}
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Carica
          </motion.button>
        </div>
      )}

      {selectionMode && (
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Scegli un piatto dalla tua galleria
        </p>
      )}

      {plates.length === 0 ? (
        <motion.button
          onClick={handleUpload}
          className="w-full py-8 rounded-2xl border-2 border-dashed border-border/50 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
          whileTap={{ scale: 0.97 }}
        >
          <ImageIcon className="w-8 h-8" />
          <span className="text-xs font-medium">Carica foto dei tuoi piatti vuoti</span>
          <span className="text-[10px]">Verranno usati come base per le foto IA</span>
        </motion.button>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {plates.map(plate => (
            <motion.div
              key={plate.id}
              className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                selectionMode && selectedPlateId === plate.id
                  ? "border-primary shadow-md ring-2 ring-primary/30"
                  : selectionMode
                  ? "border-transparent hover:border-primary/40 cursor-pointer"
                  : "border-transparent"
              }`}
              onClick={() => selectionMode && onSelectPlate?.(plate)}
              whileTap={selectionMode ? { scale: 0.95 } : undefined}
              layout
            >
              <img
                src={plate.image_url}
                alt={plate.name}
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
              {selectionMode && selectedPlateId === plate.id && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              {!selectionMode && (
                <>
                  {editingId === plate.id ? (
                    <div className="absolute inset-x-0 bottom-0 bg-background/90 backdrop-blur-sm p-1.5 flex gap-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="flex-1 px-2 py-1 rounded-lg bg-secondary text-foreground text-[10px] min-h-[28px]"
                        autoFocus
                        onKeyDown={e => e.key === "Enter" && handleSaveEdit(plate.id)}
                      />
                      <button onClick={() => handleSaveEdit(plate.id)} className="p-1 rounded-lg bg-primary text-primary-foreground">
                        <Save className="w-3 h-3" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1 rounded-lg bg-secondary text-foreground">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                      <p className="text-[9px] text-white font-medium truncate">{plate.name}</p>
                      <div className="flex gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingId(plate.id); setEditName(plate.name); }}
                          className="p-1 rounded bg-white/20 text-white"
                        >
                          <Edit className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(plate.id); }}
                          className="p-1 rounded bg-red-500/40 text-white"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))}

          {/* Add more button in grid */}
          {!selectionMode && (
            <motion.button
              onClick={handleUpload}
              disabled={uploading}
              className="aspect-square rounded-xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              <span className="text-[9px] font-medium">Aggiungi</span>
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}
