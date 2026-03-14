import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed, Sparkles, Camera, Wand2, Save, X, Edit, Trash2,
  Image as ImageIcon, Plus, Palette, Upload, Globe, Languages, Check,
  ChevronDown, ChevronUp, Search, Loader2, GripVertical, AlertTriangle,
  Sun, Moon, Clock, Leaf, Flame, Wheat, Fish, Milk, Egg, TreePine
} from "lucide-react";
import InfoGuide from "@/components/ui/info-guide";
import LivePreview from "@/components/restaurant/LivePreview";
import FoodPhotoGenerator from "@/components/admin/FoodPhotoGenerator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { applyBrandTheme, resetBrandTheme, extractDominantColor, hslToHex, DEFAULT_PRIMARY_HEX } from "@/lib/color-extract";
import type { MenuItem } from "@/types/restaurant";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import cartoonStudioMenu from "@/assets/cartoon-studio-menu.png";

type StudioSection = "menu" | "ai" | "foodphoto" | "translate" | "preview";

/* ── EU Allergen Icons ── */
const EU_ALLERGENS = [
  { id: "gluten", label: "Glutine", icon: "🌾" },
  { id: "crustaceans", label: "Crostacei", icon: "🦐" },
  { id: "eggs", label: "Uova", icon: "🥚" },
  { id: "fish", label: "Pesce", icon: "🐟" },
  { id: "peanuts", label: "Arachidi", icon: "🥜" },
  { id: "soy", label: "Soia", icon: "🫘" },
  { id: "milk", label: "Latte", icon: "🥛" },
  { id: "nuts", label: "Frutta a guscio", icon: "🌰" },
  { id: "celery", label: "Sedano", icon: "🥬" },
  { id: "mustard", label: "Senape", icon: "🟡" },
  { id: "sesame", label: "Sesamo", icon: "⚪" },
  { id: "sulphites", label: "Solfiti", icon: "🍷" },
  { id: "lupin", label: "Lupini", icon: "🫛" },
  { id: "molluscs", label: "Molluschi", icon: "🐚" },
];

const DIET_TAGS = [
  { id: "vegetarian", label: "Vegetariano", icon: "🥬", color: "bg-green-500/10 text-green-600 border-green-500/30" },
  { id: "vegan", label: "Vegano", icon: "🌱", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  { id: "gluten_free", label: "Senza Glutine", icon: "🌾", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  { id: "spicy", label: "Piccante", icon: "🌶️", color: "bg-red-500/10 text-red-600 border-red-500/30" },
];

const AVAILABILITY_OPTIONS = [
  { id: "always", label: "Sempre", icon: "✅" },
  { id: "lunch", label: "Solo Pranzo", icon: "☀️" },
  { id: "dinner", label: "Solo Cena", icon: "🌙" },
  { id: "seasonal", label: "Stagionale", icon: "🍂" },
];

interface StudioTabProps {
  restaurant: any;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  aiTokens: number;
  setAiTokens: React.Dispatch<React.SetStateAction<number>>;
  settingsPrimaryColor: string;
  setSettingsPrimaryColor: (c: string) => void;
  settingsTagline: string;
  setSettingsTagline: (t: string) => void;
  settingsLanguages: string[];
  setSettingsLanguages: React.Dispatch<React.SetStateAction<string[]>>;
  logoUploading: boolean;
  handleLogoUpload: () => void;
  handleSaveSettings: () => void;
  userId?: string;
}

const StudioTab = ({
  restaurant, menuItems, setMenuItems, aiTokens, setAiTokens,
  settingsPrimaryColor, setSettingsPrimaryColor, settingsTagline, setSettingsTagline,
  settingsLanguages, setSettingsLanguages, logoUploading, handleLogoUpload, handleSaveSettings, userId,
}: StudioTabProps) => {
  const [section, setSection] = useState<StudioSection>("menu");
  const [editingItem, setEditingItem] = useState<{
    id: string; name: string; description: string; price: number; category: string;
    allergens: string[]; tags: string[]; availability: string;
  } | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "", description: "", price: 0, category: "Altro",
    allergens: [] as string[], tags: [] as string[], availability: "always",
  });
  const [ocrUploading, setOcrUploading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any[] | null>(null);
  const [ocrImporting, setOcrImporting] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [translationDone, setTranslationDone] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const allCategories = [...new Set(menuItems.map(i => i.category))];
  const restaurantSlug = restaurant?.slug || "";

  const filteredItems = searchQuery.trim()
    ? menuItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : menuItems;

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const toggleAllergen = (list: string[], id: string) =>
    list.includes(id) ? list.filter(a => a !== id) : [...list, id];

  const toggleTag = (list: string[], id: string) =>
    list.includes(id) ? list.filter(t => t !== id) : [...list, id];

  /* ── Drag & Drop for reordering ── */
  const handleDragStart = (itemId: string) => setDraggedItem(itemId);
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;
    setMenuItems(prev => {
      const items = [...prev];
      const fromIdx = items.findIndex(i => i.id === draggedItem);
      const toIdx = items.findIndex(i => i.id === targetId);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const [moved] = items.splice(fromIdx, 1);
      items.splice(toIdx, 0, moved);
      return items;
    });
  };
  const handleDragEnd = async () => {
    setDraggedItem(null);
    // Persist new order
    for (let i = 0; i < menuItems.length; i++) {
      await supabase.from("menu_items").update({ sort_order: i }).eq("id", menuItems[i].id);
    }
  };

  const handleAddMenuItem = async () => {
    if (!restaurant || !newItem.name.trim()) return;
    const { data, error } = await supabase.from("menu_items").insert({
      restaurant_id: restaurant.id, name: newItem.name.trim(),
      description: newItem.description.trim() || "", price: newItem.price || 0,
      category: newItem.category.trim() || "Altro", sort_order: menuItems.length,
      is_active: true, is_popular: false,
      allergens: newItem.allergens,
    }).select().single();
    if (error) { toast({ title: "Errore", description: error.message, variant: "destructive" }); return; }
    if (data) {
      setMenuItems(prev => [...prev, { id: data.id, name: data.name, description: data.description || "", price: Number(data.price), image: data.image_url || "", category: data.category, allergens: data.allergens || [], isPopular: data.is_popular }]);
      setNewItem({ name: "", description: "", price: 0, category: "Altro", allergens: [], tags: [], availability: "always" });
      setShowAddItem(false);
      toast({ title: "Piatto aggiunto!" });
    }
  };

  const handleEditMenuItem = async () => {
    if (!editingItem || !restaurant) return;
    const { error } = await supabase.from("menu_items").update({
      name: editingItem.name, description: editingItem.description,
      price: editingItem.price, category: editingItem.category,
      allergens: editingItem.allergens,
    }).eq("id", editingItem.id);
    if (error) { toast({ title: "Errore", description: error.message, variant: "destructive" }); return; }
    setMenuItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, name: editingItem.name, description: editingItem.description, price: editingItem.price, category: editingItem.category, allergens: editingItem.allergens } : i));
    setEditingItem(null);
    toast({ title: "Piatto aggiornato" });
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!restaurant) return;
    await supabase.from("menu_items").delete().eq("id", itemId);
    setMenuItems(prev => prev.filter(i => i.id !== itemId));
    toast({ title: "Piatto rimosso" });
  };

  const handleRegenerateImage = async (item: MenuItem) => {
    if (!restaurant || aiTokens <= 0) {
      toast({ title: "Gettoni IA esauriti", variant: "destructive" }); return;
    }
    setRegeneratingId(item.id);
    try {
      const { data: tokenData } = await supabase.from("ai_tokens").select("balance").eq("restaurant_id", restaurant.id).single();
      const currentBalance = tokenData?.balance ?? 0;
      if (currentBalance <= 0) { toast({ title: "Gettoni IA esauriti", variant: "destructive" }); setRegeneratingId(null); return; }
      await supabase.from("ai_tokens").update({ balance: currentBalance - 1 }).eq("restaurant_id", restaurant.id);
      await (supabase as any).from("ai_token_history").insert({ restaurant_id: restaurant.id, tokens: -1, action: `Rigenera foto: ${item.name}` });
      setAiTokens(currentBalance - 1);
      const { data, error } = await supabase.functions.invoke("ai-menu", {
        body: { action: "generate-image", dishDescription: `${item.name}. ${item.description || ""}`, dishCategory: item.category },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.imageUrl) {
        await supabase.from("menu_items").update({ image_url: data.imageUrl }).eq("id", item.id);
        setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, image: data.imageUrl } : i));
        toast({ title: "Foto rigenerata!", description: `Token rimanenti: ${currentBalance - 1}` });
      }
    } catch (err: any) { toast({ title: "Errore", description: err?.message || "Riprova.", variant: "destructive" }); }
    setRegeneratingId(null);
  };

  const handleOcrUpload = () => {
    if (aiTokens <= 0) { toast({ title: "Token IA esauriti" }); return; }
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*"; input.capture = "environment";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) { toast({ title: "File troppo grande", variant: "destructive" }); return; }
      setOcrUploading(true); setOcrResult(null);
      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => { reader.onload = () => resolve(reader.result as string); reader.onerror = reject; reader.readAsDataURL(file); });
        const { data, error } = await supabase.functions.invoke("ai-menu", { body: { action: "ocr", imageBase64: base64 } });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        if (data?.dishes?.length > 0) {
          const dishesWithLoading = data.dishes.map((d: any) => ({ ...d, imageLoading: true }));
          setOcrResult(dishesWithLoading);
          setAiTokens(t => Math.max(0, t - 1));
          toast({ title: `${data.dishes.length} piatti rilevati` });
          for (let idx = 0; idx < dishesWithLoading.length; idx++) {
            const dish = dishesWithLoading[idx];
            supabase.functions.invoke("ai-menu", { body: { action: "generate-image", dishDescription: `${dish.name}. ${dish.description || ""}`, dishCategory: dish.category || "" } })
              .then(({ data: imgData }) => { setOcrResult(prev => { if (!prev) return prev; const u = [...prev]; u[idx] = { ...u[idx], image_url: imgData?.imageUrl || "", imageLoading: false }; return u; }); })
              .catch(() => { setOcrResult(prev => { if (!prev) return prev; const u = [...prev]; u[idx] = { ...u[idx], imageLoading: false }; return u; }); });
          }
        } else { toast({ title: "Nessun piatto rilevato", variant: "destructive" }); }
      } catch (err: any) { toast({ title: "Errore OCR", description: err?.message || "Riprova.", variant: "destructive" }); }
      setOcrUploading(false);
    };
    input.click();
  };

  const handleImportOcrDishes = async () => {
    if (!ocrResult?.length || !restaurant?.id) return;
    setOcrImporting(true);
    try {
      const inserts = ocrResult.map((dish, i) => ({ restaurant_id: restaurant.id, name: dish.name, description: dish.description || "", price: dish.price || 0, category: dish.category || "Altro", image_url: dish.image_url || null, sort_order: i, is_active: true, is_popular: false }));
      const { error } = await supabase.from("menu_items").insert(inserts);
      if (error) throw error;
      const { data: items } = await supabase.from("menu_items").select("*").eq("restaurant_id", restaurant.id).order("sort_order", { ascending: true });
      if (items?.length) setMenuItems(items.map(i => ({ id: i.id, name: i.name, description: i.description || "", price: Number(i.price), image: i.image_url || "", category: i.category, allergens: i.allergens || [], isPopular: i.is_popular })));
      setOcrResult(null);
      toast({ title: "Menu importato!" });
    } catch (err: any) { toast({ title: "Errore", description: err?.message, variant: "destructive" }); }
    setOcrImporting(false);
  };

  const handleTranslate = async () => {
    if (!restaurant) return;
    setTranslating(true); setTranslationDone(false);
    try {
      const { data, error } = await supabase.functions.invoke("ai-translate", { body: { menuItems, targetLanguages: settingsLanguages } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.translations) {
        for (const t of data.translations) {
          await supabase.from("menu_items").update({ name_translations: t.name_translations, description_translations: t.description_translations } as any).eq("id", t.id);
        }
      }
      setTranslationDone(true);
      toast({ title: "Menu tradotto!" });
    } catch (err: any) { toast({ title: "Errore", description: err?.message, variant: "destructive" }); }
    setTranslating(false);
  };

  const sections: { id: StudioSection; label: string; icon: React.ReactNode }[] = [
    { id: "menu", label: "Menu", icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: "ai", label: "OCR", icon: <Camera className="w-4 h-4" /> },
    { id: "foodphoto", label: "📸 Foto", icon: <Sparkles className="w-4 h-4" /> },
    { id: "preview", label: "Design", icon: <Palette className="w-4 h-4" /> },
    { id: "translate", label: "Lingue", icon: <Languages className="w-4 h-4" /> },
  ];

  const filteredCategories = searchQuery.trim()
    ? [...new Set(filteredItems.map(i => i.category))]
    : allCategories;

  /* ── Allergens selector component ── */
  const AllergensSelector = ({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) => (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> Allergeni EU
      </p>
      <div className="flex flex-wrap gap-1.5">
        {EU_ALLERGENS.map(a => (
          <button key={a.id} type="button" onClick={() => onChange(toggleAllergen(selected, a.id))}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium border transition-all min-h-[28px] ${
              selected.includes(a.id) ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-secondary/30 text-muted-foreground border-transparent hover:border-border"
            }`}>
            <span>{a.icon}</span>
            <span>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  /* ── Diet Tags selector ── */
  const TagsSelector = ({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) => (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tag Dieta</p>
      <div className="flex flex-wrap gap-1.5">
        {DIET_TAGS.map(t => (
          <button key={t.id} type="button" onClick={() => onChange(toggleTag(selected, t.id))}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all min-h-[28px] ${
              selected.includes(t.id) ? t.color : "bg-secondary/30 text-muted-foreground border-transparent hover:border-border"
            }`}>
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  /* ── Availability selector ── */
  const AvailabilitySelector = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
        <Clock className="w-3 h-3" /> Disponibilità
      </p>
      <div className="flex flex-wrap gap-1.5">
        {AVAILABILITY_OPTIONS.map(a => (
          <button key={a.id} type="button" onClick={() => onChange(a.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all min-h-[28px] ${
              value === a.id ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary/30 text-muted-foreground border-transparent hover:border-border"
            }`}>
            <span>{a.icon}</span>
            <span>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Sub-tabs */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1.5 bg-secondary/30 p-1 rounded-xl">
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg text-xs font-semibold transition-all min-h-[40px] ${
              section === s.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}>
            {s.icon}
            <span className="hidden xs:inline">{s.label}</span>
          </button>
        ))}
        </div>
        <InfoGuide
          title="Studio Creativo"
          description="Il tuo centro di controllo creativo: gestisci il menu, personalizza il design, usa l'IA per creare foto e traduci in più lingue."
          steps={[
            "Menu: aggiungi, modifica ed elimina piatti con categorie, allergeni e disponibilità",
            "Design: personalizza logo, colori e anteprima live",
            "IA: carica una foto del menu per creare il catalogo digitale",
            "Lingue: traduci automaticamente in tutte le lingue attive",
          ]}
        />
      </div>

      {/* ===== MENU MANAGEMENT ===== */}
      {section === "menu" && (
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Cerca tra ${menuItems.length} piatti...`}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] placeholder:text-muted-foreground/40" />
            </div>
            <motion.button onClick={() => setShowAddItem(!showAddItem)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold min-h-[44px] flex-shrink-0 shadow-sm"
              whileTap={{ scale: 0.95 }}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Aggiungi</span>
            </motion.button>
          </div>

          {/* Add item form — enhanced with allergens, tags, availability */}
          <AnimatePresence>
            {showAddItem && (
              <motion.div className="p-4 rounded-2xl bg-card border border-primary/20 space-y-3"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-foreground">Nuovo piatto</p>
                  <button onClick={() => setShowAddItem(false)} className="p-1 rounded-lg hover:bg-secondary">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <input type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Nome piatto" className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                <textarea value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Descrizione (opzionale)" rows={2} className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                    <input type="number" step="0.01" value={newItem.price || ""} onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00" className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                  </div>
                  <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                    className="px-3 py-2.5 rounded-xl bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] appearance-none">
                    {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="Altro">+ Nuova categoria</option>
                  </select>
                </div>

                {/* Allergens */}
                <AllergensSelector selected={newItem.allergens} onChange={a => setNewItem({ ...newItem, allergens: a })} />

                {/* Diet Tags */}
                <TagsSelector selected={newItem.tags} onChange={t => setNewItem({ ...newItem, tags: t })} />

                {/* Availability */}
                <AvailabilitySelector value={newItem.availability} onChange={v => setNewItem({ ...newItem, availability: v })} />

                <motion.button onClick={handleAddMenuItem} disabled={!newItem.name.trim()}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold min-h-[48px] disabled:opacity-40 shadow-sm"
                  whileTap={{ scale: 0.97 }}>
                  <Plus className="w-4 h-4 inline mr-1.5" />Aggiungi piatto
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit item modal */}
          <AnimatePresence>
            {editingItem && (
              <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setEditingItem(null)}>
                <motion.div className="w-full max-w-md p-5 rounded-2xl bg-card border border-border shadow-2xl space-y-3 max-h-[85vh] overflow-y-auto"
                  initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                  onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Modifica piatto</p>
                    <button onClick={() => setEditingItem(null)} className="p-1 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button>
                  </div>
                  <input type="text" value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                  <textarea value={editingItem.description} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                    rows={2} className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                      <input type="number" step="0.01" value={editingItem.price || ""} onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                    </div>
                    <select value={editingItem.category} onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="px-3 py-2.5 rounded-xl bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] appearance-none">
                      {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      <option value="Altro">Altra</option>
                    </select>
                  </div>

                  <AllergensSelector selected={editingItem.allergens} onChange={a => setEditingItem({ ...editingItem, allergens: a })} />
                  <TagsSelector selected={editingItem.tags} onChange={t => setEditingItem({ ...editingItem, tags: t })} />
                  <AvailabilitySelector value={editingItem.availability} onChange={v => setEditingItem({ ...editingItem, availability: v })} />

                  <motion.button onClick={handleEditMenuItem}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold min-h-[48px] shadow-sm"
                    whileTap={{ scale: 0.97 }}>
                    <Save className="w-4 h-4 inline mr-1.5" />Salva modifiche
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Menu items by category — drag & drop */}
          <div className="space-y-2">
            {filteredCategories.map(cat => {
              const catItems = filteredItems.filter(i => i.category === cat);
              const isCollapsed = collapsedCategories.has(cat);
              return (
                <div key={cat} className="rounded-2xl bg-card border border-border/40 overflow-hidden">
                  <button onClick={() => toggleCategory(cat)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors min-h-[48px]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{cat}</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] font-medium text-muted-foreground">{catItems.length}</span>
                    </div>
                    {isCollapsed ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="divide-y divide-border/30">
                          {catItems.map(item => (
                            <div key={item.id} draggable onDragStart={() => handleDragStart(item.id)} onDragOver={(e) => handleDragOver(e, item.id)} onDragEnd={handleDragEnd}
                              className={`flex items-center gap-3 px-4 py-3 transition-all ${draggedItem === item.id ? "opacity-50 bg-primary/5" : ""}`}>
                              {/* Drag handle */}
                              <GripVertical className="w-4 h-4 text-muted-foreground/30 flex-shrink-0 cursor-grab active:cursor-grabbing" />

                              {/* Image */}
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-secondary/50">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <UtensilsCrossed className="w-4 h-4 text-muted-foreground/30" />
                                  </div>
                                )}
                                {regeneratingId === item.id && (
                                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground leading-tight truncate">{item.name}</p>
                                {item.description && (
                                  <p className="text-[11px] text-muted-foreground leading-tight truncate mt-0.5">{item.description}</p>
                                )}
                                {/* Allergen badges */}
                                {item.allergens && item.allergens.length > 0 && (
                                  <div className="flex flex-wrap gap-0.5 mt-1">
                                    {item.allergens.map(a => {
                                      const allergen = EU_ALLERGENS.find(eu => eu.id === a);
                                      return allergen ? (
                                        <span key={a} className="text-[9px] px-1 py-0.5 rounded bg-destructive/10 text-destructive" title={allergen.label}>{allergen.icon}</span>
                                      ) : null;
                                    })}
                                  </div>
                                )}
                              </div>

                              {/* Price */}
                              <span className="text-sm font-bold text-primary tabular-nums flex-shrink-0">€{item.price.toFixed(2)}</span>

                              {/* Actions */}
                              <div className="flex items-center gap-0.5 flex-shrink-0">
                                <button onClick={() => setEditingItem({
                                  id: item.id, name: item.name, description: item.description, price: item.price, category: item.category,
                                  allergens: item.allergens || [], tags: [], availability: "always"
                                })}
                                  className="p-2 rounded-lg hover:bg-secondary min-w-[36px] min-h-[36px] flex items-center justify-center">
                                  <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                                <button onClick={() => handleRegenerateImage(item)} disabled={regeneratingId === item.id}
                                  className="p-2 rounded-lg hover:bg-secondary disabled:opacity-30 min-w-[36px] min-h-[36px] flex items-center justify-center">
                                  <Wand2 className="w-3.5 h-3.5 text-primary" />
                                </button>
                                <button onClick={() => handleDeleteMenuItem(item.id)}
                                  className="p-2 rounded-lg hover:bg-destructive/10 min-w-[36px] min-h-[36px] flex items-center justify-center">
                                  <Trash2 className="w-3.5 h-3.5 text-destructive/70" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {menuItems.length === 0 && (
            <div className="text-center py-16 rounded-2xl bg-card border border-border/40">
              <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
              <p className="text-sm font-medium text-muted-foreground">Nessun piatto nel menu</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Aggiungi manualmente o usa l'IA per importare</p>
            </div>
          )}

          {searchQuery && filteredItems.length === 0 && menuItems.length > 0 && (
            <div className="text-center py-8 rounded-2xl bg-card border border-border/40">
              <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">Nessun risultato per "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* ===== AI MENU CREATOR ===== */}
      {section === "ai" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-border/40 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground">AI Menu Creator</h3>
            <p className="text-xs text-muted-foreground mt-1">Scatta una foto del menu cartaceo → l'IA lo digitalizza in secondi</p>
            <p className="text-[10px] text-primary/70 mt-2 font-medium">Token disponibili: {aiTokens}</p>
          </div>

          <motion.button onClick={handleOcrUpload} disabled={ocrUploading}
            className="w-full p-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all text-center min-h-[120px] disabled:opacity-50"
            whileTap={{ scale: 0.98 }}>
            {ocrUploading ? (
              <div className="space-y-3">
                <Loader2 className="w-10 h-10 mx-auto text-primary animate-spin" />
                <p className="text-sm text-primary font-medium">Analisi OCR in corso...</p>
              </div>
            ) : (
              <>
                <Camera className="w-10 h-10 mx-auto mb-3 text-primary/60" />
                <p className="text-sm font-semibold text-foreground">Scatta o carica il menu</p>
                <p className="text-xs text-muted-foreground mt-1">Max 10MB · Costa 1 token IA</p>
              </>
            )}
          </motion.button>

          {ocrResult && (
            <motion.div className="space-y-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">{ocrResult.length} piatti rilevati</h4>
                <button onClick={() => setOcrResult(null)} className="text-xs text-muted-foreground hover:text-foreground">Annulla</button>
              </div>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto rounded-2xl">
                {ocrResult.map((dish, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/40">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-primary/5">
                      {dish.imageLoading ? (
                        <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
                      ) : dish.image_url ? (
                        <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                      ) : <div className="w-full h-full flex items-center justify-center"><Wand2 className="w-4 h-4 text-primary/40" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{dish.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{dish.description}</p>
                    </div>
                    <span className="text-sm font-bold text-primary flex-shrink-0">€{dish.price?.toFixed(2) || "0.00"}</span>
                  </div>
                ))}
              </div>
              <motion.button onClick={handleImportOcrDishes} disabled={ocrImporting}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 min-h-[48px] shadow-sm"
                whileTap={{ scale: 0.97 }}>
                {ocrImporting ? <Loader2 className="w-4 h-4 inline animate-spin mr-2" /> : <Plus className="w-4 h-4 inline mr-2" />}
                {ocrImporting ? "Importazione..." : `Importa ${ocrResult.length} piatti`}
              </motion.button>
            </motion.div>
          )}
        </div>
      )}

      {/* ===== TRANSLATE ===== */}
      {section === "translate" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-border/40 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Languages className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-base font-bold text-foreground">Traduzione IA</h3>
            <p className="text-xs text-muted-foreground mt-1">Traduci automaticamente il menu in più lingue</p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/40 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seleziona lingue</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { code: "it", label: "🇮🇹", name: "IT" },
                { code: "en", label: "🇬🇧", name: "EN" },
                { code: "de", label: "🇩🇪", name: "DE" },
                { code: "fr", label: "🇫🇷", name: "FR" },
                { code: "es", label: "🇪🇸", name: "ES" },
                { code: "zh", label: "🇨🇳", name: "中" },
                { code: "ja", label: "🇯🇵", name: "日" },
                { code: "ar", label: "🇸🇦", name: "عر" },
              ].map(l => (
                <button key={l.code} onClick={() => setSettingsLanguages(prev => prev.includes(l.code) ? prev.filter(x => x !== l.code) : [...prev, l.code])}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl text-sm font-medium min-h-[56px] transition-all ${
                    settingsLanguages.includes(l.code)
                      ? "bg-primary/10 text-primary border-2 border-primary/30"
                      : "bg-secondary/30 text-muted-foreground border-2 border-transparent hover:border-border"
                  }`}>
                  <span className="text-lg">{l.label}</span>
                  <span className="text-[10px]">{l.name}</span>
                </button>
              ))}
            </div>
          </div>

          <motion.button onClick={handleTranslate} disabled={translating || settingsLanguages.filter(l => l !== "it").length === 0}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40 min-h-[48px] shadow-sm"
            whileTap={{ scale: 0.97 }}>
            {translating ? <Loader2 className="w-4 h-4 inline animate-spin mr-2" /> : <Languages className="w-4 h-4 inline mr-2" />}
            {translating ? "Traduzione in corso..." : "Traduci Menu"}
          </motion.button>

          {translationDone && (
            <motion.div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Check className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Traduzione completata</p>
            </motion.div>
          )}
        </div>
      )}

      {/* ===== DESIGN & LIVE PREVIEW ===== */}
      {section === "preview" && restaurant && (
        <div className="space-y-4">
          {/* Logo */}
          <div className="p-4 rounded-2xl bg-card border border-border/40 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> Logo del ristorante
            </p>
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <img src={restaurant?.logo_url || "/placeholder.svg"} alt="Logo"
                  className="w-16 h-16 rounded-2xl object-contain border-2 border-border/50 shadow-sm bg-secondary/30" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <Upload className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                <motion.button onClick={handleLogoUpload} disabled={logoUploading}
                  className="w-full px-4 py-3 rounded-xl bg-primary/10 text-primary text-sm font-medium min-h-[44px] border border-primary/20 hover:bg-primary/20 transition-colors"
                  whileTap={{ scale: 0.97 }}>
                  {logoUploading ? <Loader2 className="w-4 h-4 inline animate-spin mr-2" /> : null}
                  {logoUploading ? "Caricamento..." : "Carica nuovo logo"}
                </motion.button>
                <p className="text-[10px] text-muted-foreground/70 text-center">I colori si estraggono automaticamente</p>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="p-4 rounded-2xl bg-card border border-border/40 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tagline</p>
            <input type="text" value={settingsTagline} onChange={e => setSettingsTagline(e.target.value)}
              placeholder="Es: La vera cucina italiana dal 1985" maxLength={120} onBlur={handleSaveSettings}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] placeholder:text-muted-foreground/40" />
          </div>

          {/* Color Picker */}
          <div className="p-4 rounded-2xl bg-card border border-border/40 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Colore Brand
            </p>
            <div className="flex items-center gap-3">
              <input type="color" value={settingsPrimaryColor}
                onChange={e => { setSettingsPrimaryColor(e.target.value); applyBrandTheme(e.target.value); }}
                onBlur={handleSaveSettings}
                className="w-12 h-12 rounded-xl border-2 border-border/50 cursor-pointer bg-transparent p-0.5 appearance-none flex-shrink-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-0" />
              <div className="flex-1 space-y-2">
                <input type="text" value={settingsPrimaryColor}
                  onChange={e => { setSettingsPrimaryColor(e.target.value); if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) applyBrandTheme(e.target.value); }}
                  onBlur={handleSaveSettings} placeholder="#C8963E" maxLength={7}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                <div className="flex gap-1.5 flex-wrap">
                  {["#C8963E", "#E74C3C", "#2ECC71", "#3498DB", "#9B59B6", "#1ABC9C", "#F39C12", "#E91E63"].map(c => (
                    <motion.button key={c} onClick={() => { setSettingsPrimaryColor(c); applyBrandTheme(c); handleSaveSettings(); }}
                      className={`w-7 h-7 rounded-lg border-2 transition-all ${settingsPrimaryColor === c ? "border-foreground scale-110 shadow-md" : "border-transparent hover:border-muted-foreground/30"}`}
                      style={{ backgroundColor: c }}
                      whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.15 }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setSettingsPrimaryColor(DEFAULT_PRIMARY_HEX); resetBrandTheme(); handleSaveSettings(); }}
                className="flex-1 px-3 py-2.5 rounded-xl bg-secondary/50 text-muted-foreground text-xs min-h-[40px] hover:bg-secondary transition-colors font-medium">
                Ripristina default
              </button>
              {restaurant?.logo_url && (
                <button onClick={async () => {
                  try { const h = await extractDominantColor(restaurant.logo_url!); const hex = hslToHex(h); setSettingsPrimaryColor(hex); applyBrandTheme(hex); handleSaveSettings(); toast({ title: "Colore estratto dal logo!" }); }
                  catch { toast({ title: "Errore", variant: "destructive" }); }
                }}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-primary/10 text-primary text-xs min-h-[40px] hover:bg-primary/20 transition-colors font-medium">
                  Estrai dal logo
                </button>
              )}
            </div>
          </div>

          {/* Live Preview */}
          {restaurantSlug && (
            <div className="p-4 rounded-2xl bg-card border border-border/40 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Anteprima Live
              </p>
              <LivePreview slug={restaurantSlug} />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default StudioTab;
