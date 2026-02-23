import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed, Sparkles, Camera, Wand2, Save, X, Edit, Trash2,
  Image as ImageIcon, Plus, Palette, Upload, Globe, Languages, Check
} from "lucide-react";
import LivePreview from "@/components/restaurant/LivePreview";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { applyBrandTheme, resetBrandTheme, extractDominantColor, hslToHex, DEFAULT_PRIMARY_HEX } from "@/lib/color-extract";
import type { MenuItem } from "@/types/restaurant";

type StudioSection = "menu" | "design" | "ai" | "translate" | "preview";

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
  userId?: string;
}

const StudioTab = ({
  restaurant, menuItems, setMenuItems, aiTokens, setAiTokens,
  settingsPrimaryColor, setSettingsPrimaryColor, settingsTagline, setSettingsTagline,
  settingsLanguages, setSettingsLanguages, logoUploading, handleLogoUpload, userId,
}: StudioTabProps) => {
  const [section, setSection] = useState<StudioSection>("menu");
  const [editingItem, setEditingItem] = useState<{ id: string; name: string; description: string; price: number; category: string } | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: 0, category: "Altro" });
  const [ocrUploading, setOcrUploading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any[] | null>(null);
  const [ocrImporting, setOcrImporting] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [translationDone, setTranslationDone] = useState(false);

  const allCategories = [...new Set(menuItems.map(i => i.category))];
  const restaurantSlug = restaurant?.slug || "";

  const handleAddMenuItem = async () => {
    if (!restaurant || !newItem.name.trim()) return;
    const { data, error } = await supabase.from("menu_items").insert({
      restaurant_id: restaurant.id, name: newItem.name.trim(),
      description: newItem.description.trim() || "", price: newItem.price || 0,
      category: newItem.category.trim() || "Altro", sort_order: menuItems.length,
      is_active: true, is_popular: false,
    }).select().single();
    if (error) { toast({ title: "Errore", description: error.message, variant: "destructive" }); return; }
    if (data) {
      setMenuItems(prev => [...prev, { id: data.id, name: data.name, description: data.description || "", price: Number(data.price), image: data.image_url || "", category: data.category, allergens: data.allergens || [], isPopular: data.is_popular }]);
      setNewItem({ name: "", description: "", price: 0, category: "Altro" });
      setShowAddItem(false);
      toast({ title: "Piatto aggiunto!" });
    }
  };

  const handleEditMenuItem = async () => {
    if (!editingItem || !restaurant) return;
    const { error } = await supabase.from("menu_items").update({
      name: editingItem.name, description: editingItem.description,
      price: editingItem.price, category: editingItem.category,
    }).eq("id", editingItem.id);
    if (error) { toast({ title: "Errore", description: error.message, variant: "destructive" }); return; }
    setMenuItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, name: editingItem.name, description: editingItem.description, price: editingItem.price, category: editingItem.category } : i));
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
    { id: "design", label: "Design", icon: <Palette className="w-4 h-4" /> },
    { id: "ai", label: "IA", icon: <Sparkles className="w-4 h-4" /> },
    { id: "translate", label: "Lingue", icon: <Languages className="w-4 h-4" /> },
    { id: "preview", label: "Preview", icon: <ImageIcon className="w-4 h-4" /> },
  ];

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Sub-tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
              section === s.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
            }`}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* ===== MENU MANAGEMENT ===== */}
      {section === "menu" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">{menuItems.length} piatti</h3>
            <motion.button onClick={() => setShowAddItem(!showAddItem)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium min-h-[40px]"
              whileTap={{ scale: 0.95 }}>
              <Plus className="w-3.5 h-3.5" /> Aggiungi
            </motion.button>
          </div>

          <AnimatePresence>
            {showAddItem && (
              <motion.div className="p-4 rounded-2xl bg-card border border-primary/20 space-y-3"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <input type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Nome piatto" className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                <textarea value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Descrizione" className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                    placeholder="€ Prezzo" className="px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                  <input type="text" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                    placeholder="Categoria" className="px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                </div>
                <div className="flex gap-2">
                  <motion.button onClick={handleAddMenuItem} disabled={!newItem.name.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium min-h-[44px] disabled:opacity-40"
                    whileTap={{ scale: 0.97 }}>Aggiungi</motion.button>
                  <button onClick={() => setShowAddItem(false)} className="px-4 py-2.5 rounded-xl bg-secondary text-sm min-h-[44px]">Annulla</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {allCategories.map(cat => {
            const catItems = menuItems.filter(i => i.category === cat);
            return (
              <div key={cat}>
                <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-2">{cat} ({catItems.length})</p>
                <div className="space-y-2">
                  {catItems.map(item => (
                    <motion.div key={item.id} className="flex gap-3 p-3 rounded-xl bg-card" layout>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                          <UtensilsCrossed className="w-5 h-5 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                        <p className="text-sm font-display font-bold text-primary mt-0.5">€{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button onClick={() => setEditingItem({ id: item.id, name: item.name, description: item.description, price: item.price, category: item.category })}
                          className="p-1.5 rounded-lg hover:bg-secondary"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={() => handleRegenerateImage(item)} disabled={regeneratingId === item.id}
                          className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30"><Wand2 className="w-3.5 h-3.5 text-primary" /></button>
                        <button onClick={() => handleDeleteMenuItem(item.id)}
                          className="p-1.5 rounded-lg hover:bg-accent/10"><Trash2 className="w-3.5 h-3.5 text-accent" /></button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
          {menuItems.length === 0 && (
            <div className="text-center py-12">
              <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">Nessun piatto — aggiungi manualmente o usa l'IA</p>
            </div>
          )}
        </div>
      )}

      {/* ===== DESIGN & BRANDING ===== */}
      {section === "design" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-secondary/50 space-y-4">
            <p className="text-xs text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Logo & Identità</p>
            <div className="flex items-center gap-4">
              <img src={restaurant?.logo_url || "/placeholder.svg"} alt="Logo" className="w-16 h-16 rounded-xl object-contain border border-border" />
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">Logo</p>
                <p className="text-xs text-muted-foreground">I colori si adattano automaticamente</p>
              </div>
              <motion.button onClick={handleLogoUpload} disabled={logoUploading}
                className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium min-h-[44px]"
                whileTap={{ scale: 0.95 }}>
                {logoUploading ? "..." : <><Upload className="w-4 h-4 inline mr-1" />Carica</>}
              </motion.button>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Tagline</label>
              <input type="text" value={settingsTagline} onChange={e => setSettingsTagline(e.target.value)}
                placeholder="Benvenuti nel nostro ristorante" maxLength={120}
                className="w-full px-3 py-2.5 rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Colore Brand</label>
              <div className="flex items-center gap-3">
                <input type="color" value={settingsPrimaryColor} onChange={e => { setSettingsPrimaryColor(e.target.value); applyBrandTheme(e.target.value); }}
                  className="w-11 h-11 rounded-xl border border-border cursor-pointer bg-transparent p-0.5" />
                <input type="text" value={settingsPrimaryColor} onChange={e => { setSettingsPrimaryColor(e.target.value); if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) applyBrandTheme(e.target.value); }}
                  placeholder="#C8963E" maxLength={7}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-background text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                <div className="w-11 h-11 rounded-xl border border-border" style={{ backgroundColor: settingsPrimaryColor }} />
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => { setSettingsPrimaryColor(DEFAULT_PRIMARY_HEX); resetBrandTheme(); }}
                  className="flex-1 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs min-h-[40px]">🔄 Ripristina</button>
                {restaurant?.logo_url && (
                  <button onClick={async () => { try { const h = await extractDominantColor(restaurant.logo_url!); const hex = hslToHex(h); setSettingsPrimaryColor(hex); applyBrandTheme(hex); toast({ title: "Colore estratto" }); } catch { toast({ title: "Errore", variant: "destructive" }); } }}
                    className="flex-1 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs min-h-[40px]">🎨 Dal Logo</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== AI MENU CREATOR ===== */}
      {section === "ai" && (
        <div className="space-y-5">
          <div className="text-center py-2">
            <Sparkles className="w-10 h-10 mx-auto mb-2 text-primary" />
            <h3 className="text-base font-display font-bold text-foreground">AI Menu Creator</h3>
            <p className="text-xs text-muted-foreground mt-1">Foto → OCR → Menu in 60 secondi</p>
          </div>
          <motion.div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors min-h-[120px]"
            whileTap={{ scale: 0.98 }} onClick={handleOcrUpload}>
            {ocrUploading ? (
              <div className="space-y-3">
                <motion.div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent mx-auto" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                <p className="text-sm text-primary font-medium">Analisi OCR in corso...</p>
              </div>
            ) : (
              <>
                <Camera className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Scatta o carica il menu cartaceo</p>
                <p className="text-xs text-muted-foreground mt-1">Max 10MB · Costa 1 gettone IA</p>
              </>
            )}
          </motion.div>
          {ocrResult && (
            <motion.div className="space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h4 className="text-sm font-semibold text-foreground">{ocrResult.length} piatti rilevati</h4>
              {ocrResult.map((dish, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-primary/10">
                    {dish.imageLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <motion.div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} />
                      </div>
                    ) : dish.image_url ? (
                      <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                    ) : <div className="w-full h-full flex items-center justify-center"><Wand2 className="w-5 h-5 text-primary" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{dish.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{dish.description}</p>
                    <span className="text-xs font-semibold text-primary">€{dish.price?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              ))}
              <button onClick={handleImportOcrDishes} disabled={ocrImporting}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm gold-glow disabled:opacity-50 min-h-[48px]">
                {ocrImporting ? "Importazione..." : `Importa ${ocrResult.length} piatti`}
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* ===== TRANSLATE ===== */}
      {section === "translate" && (
        <div className="space-y-5">
          <div className="text-center py-2">
            <Languages className="w-10 h-10 mx-auto mb-2 text-primary" />
            <h3 className="text-base font-display font-bold text-foreground">Traduzione IA</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { code: "it", label: "🇮🇹 IT" }, { code: "en", label: "🇬🇧 EN" }, { code: "de", label: "🇩🇪 DE" },
              { code: "fr", label: "🇫🇷 FR" }, { code: "es", label: "🇪🇸 ES" }, { code: "zh", label: "🇨🇳 中" },
              { code: "ja", label: "🇯🇵 日" }, { code: "ar", label: "🇸🇦 عر" },
            ].map(l => (
              <button key={l.code} onClick={() => setSettingsLanguages(prev => prev.includes(l.code) ? prev.filter(x => x !== l.code) : [...prev, l.code])}
                className={`px-3 py-2 rounded-xl text-xs font-medium min-h-[40px] ${settingsLanguages.includes(l.code) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                {l.label}
              </button>
            ))}
          </div>
          <motion.button onClick={handleTranslate} disabled={translating || settingsLanguages.filter(l => l !== "it").length === 0}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm gold-glow disabled:opacity-50 min-h-[48px]"
            whileTap={{ scale: 0.97 }}>
            {translating ? "Traduzione IA..." : <><Languages className="w-4 h-4 inline mr-2" />Traduci Menu</>}
          </motion.button>
          {translationDone && (
            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
              <Check className="w-6 h-6 mx-auto text-green-400 mb-1" />
              <p className="text-sm text-green-400 font-medium">Traduzione completata</p>
            </div>
          )}
        </div>
      )}

      {/* ===== LIVE PREVIEW ===== */}
      {section === "preview" && restaurant && <LivePreview slug={restaurantSlug} />}

      {/* EDIT ITEM MODAL */}
      {editingItem && (
        <motion.div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center px-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setEditingItem(null)}>
          <motion.div className="w-full max-w-sm bg-card rounded-2xl border border-border p-5 space-y-4"
            initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-bold text-foreground">Modifica piatto</h3>
              <button onClick={() => setEditingItem(null)} className="p-1.5 rounded-full hover:bg-secondary"><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                placeholder="Nome" className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
              <textarea value={editingItem.description} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                placeholder="Descrizione" className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="0.01" value={editingItem.price} onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                  placeholder="Prezzo" className="px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
                <input type="text" value={editingItem.category} onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                  placeholder="Categoria" className="px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px]" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleEditMenuItem} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm min-h-[44px] flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Salva
              </button>
              <button onClick={() => setEditingItem(null)} className="px-4 py-2.5 rounded-xl bg-secondary text-sm min-h-[44px]">Annulla</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudioTab;
