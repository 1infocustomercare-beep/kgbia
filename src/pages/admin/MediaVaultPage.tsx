import { useState, useRef, useMemo } from "react";
import BackButton from "@/components/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film, Image, Trash2, Eye, Copy, Check, Search, Grid3X3, List, Play,
  Plus, Upload, ChevronUp, ChevronDown, Pencil, X, Save, ExternalLink,
  ArrowUpDown, RefreshCw, FolderOpen, Layers, ArrowDown, ArrowUp, Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useMediaVault, type MediaItem } from "@/hooks/useMediaVault";
import { useSiteAssets, useUpdateSiteAsset, type SiteAsset } from "@/hooks/useSiteAssets";
import { supabase } from "@/integrations/supabase/client";

type ViewMode = "grid" | "list" | "sections";
type PageTab = "media" | "site_assets";

// Section mapping for Media Vault
const SECTION_MAP: Record<string, { label: string; color: string; description: string }> = {
  "Landing — Hero": { label: "🏠 Hero Homepage", color: "hsl(var(--primary))", description: "Video/immagine principale in apertura" },
  "Landing — Settori": { label: "🏭 Showcase Settori", color: "hsl(265, 70%, 60%)", description: "Montaggio video multi-settore" },
  "Landing — Funzionalità": { label: "⚡ Funzionalità", color: "hsl(38, 50%, 55%)", description: "Demo features piattaforma" },
  "Landing — Partner": { label: "🤝 Partner", color: "hsl(200, 70%, 50%)", description: "Materiale per sezione partner" },
  "Landing — App Showcase": { label: "📱 App Showcase", color: "hsl(150, 60%, 45%)", description: "Mockup dispositivi (cliente, admin, cucina)" },
  "Landing — Background": { label: "🎨 Background", color: "hsl(280, 50%, 50%)", description: "Immagini di sfondo sezioni" },
  "Landing Page": { label: "📄 Landing Varie", color: "hsl(220, 60%, 50%)", description: "Asset generici della landing" },
  "Restaurant — Hero": { label: "🍕 Ristorante Hero", color: "hsl(15, 80%, 55%)", description: "Video hero siti ristorante" },
  "NCC — Hero": { label: "🚗 NCC Hero", color: "hsl(210, 60%, 40%)", description: "Video hero siti NCC" },
  "Partner — Recruitment": { label: "📢 Reclutamento", color: "hsl(330, 60%, 50%)", description: "Video per reclutamento partner" },
  "Brand": { label: "👑 Brand Assets", color: "hsl(38, 50%, 55%)", description: "Loghi e identità visiva Empire" },
};

// Section labels for Site Assets
const SITE_ASSET_SECTIONS: Record<string, { label: string; icon: string; description: string }> = {
  landing: { label: "Landing Page", icon: "🏠", description: "Hero, mockup e sfondi della home page" },
  sectors: { label: "Settori", icon: "🎯", description: "Immagini settori nella landing" },
  agents: { label: "Agenti IA", icon: "🤖", description: "Header e icone agenti nell'app" },
  ncc: { label: "NCC / Trasporti", icon: "🚗", description: "Immagini flotta e destinazioni NCC" },
};

const MediaVaultPage = () => {
  const { items, loading, addItem, deleteItem, updateItem, moveItem, uploadFile } = useMediaVault();
  const { data: siteAssets, isLoading: siteAssetsLoading } = useSiteAssets();
  const updateSiteAsset = useUpdateSiteAsset();

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("sections");
  const [filterType, setFilterType] = useState<"all" | "video" | "image">("all");
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", section: "", description: "", dimensions: "" });
  const [uploading, setUploading] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [swapFrom, setSwapFrom] = useState<string | null>(null);
  const [pageTab, setPageTab] = useState<PageTab>("media");

  // Add form state
  const [addForm, setAddForm] = useState({ name: "", section: "", description: "", dimensions: "", url: "" });
  const [addType, setAddType] = useState<"upload" | "url">("upload");
  const [addMediaType, setAddMediaType] = useState<"video" | "image">("video");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Site assets state
  const [saSearch, setSaSearch] = useState("");
  const [saSectionFilter, setSaSectionFilter] = useState("all");
  const [saEditingId, setSaEditingId] = useState<string | null>(null);
  const [saEditUrl, setSaEditUrl] = useState("");
  const [saUploading, setSaUploading] = useState<string | null>(null);

  const filtered = useMemo(() => items.filter(m => {
    if (filterType !== "all" && m.type !== filterType) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.section.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [items, filterType, search]);

  const groupedBySection = useMemo(() => {
    const map: Record<string, MediaItem[]> = {};
    filtered.forEach(item => {
      const section = item.section || "Senza Sezione";
      if (!map[section]) map[section] = [];
      map[section].push(item);
    });
    Object.values(map).forEach(arr => arr.sort((a, b) => a.sort_order - b.sort_order));
    return map;
  }, [filtered]);

  const sectionKeys = useMemo(() => {
    return Object.keys(groupedBySection).sort((a, b) => {
      const aInfo = SECTION_MAP[a];
      const bInfo = SECTION_MAP[b];
      if (aInfo && !bInfo) return -1;
      if (!aInfo && bInfo) return 1;
      return a.localeCompare(b);
    });
  }, [groupedBySection]);

  // Site Assets filtered/grouped
  const saFiltered = useMemo(() => (siteAssets || []).filter(a => {
    if (saSectionFilter !== "all" && a.section !== saSectionFilter) return false;
    if (saSearch && !a.label.toLowerCase().includes(saSearch.toLowerCase()) && !a.slot_key.toLowerCase().includes(saSearch.toLowerCase())) return false;
    return true;
  }), [siteAssets, saSectionFilter, saSearch]);

  const saGrouped = useMemo(() => {
    return saFiltered.reduce<Record<string, (SiteAsset & { resolvedUrl: string })[]>>((acc, a) => {
      const key = a.section;
      if (!acc[key]) acc[key] = [];
      acc[key].push(a as SiteAsset & { resolvedUrl: string });
      return acc;
    }, {});
  }, [saFiltered]);

  const copyPath = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    toast({ title: "Path copiato", description: `${item.name}` });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAdd = async () => {
    let finalUrl = addForm.url;
    if (addType === "upload" && selectedFile) {
      setUploading(true);
      const url = await uploadFile(selectedFile);
      setUploading(false);
      if (!url) return;
      finalUrl = url;
    }
    if (!finalUrl || !addForm.name) {
      toast({ title: "Compila nome e sorgente", variant: "destructive" });
      return;
    }
    await addItem({ name: addForm.name, type: addMediaType, url: finalUrl, section: addForm.section, description: addForm.description, dimensions: addForm.dimensions });
    setAddForm({ name: "", section: "", description: "", dimensions: "", url: "" });
    setSelectedFile(null);
    setShowAdd(false);
  };

  const startEdit = (item: MediaItem) => {
    setEditingId(item.id);
    setEditForm({ name: item.name, section: item.section, description: item.description, dimensions: item.dimensions });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateItem(editingId, editForm);
    setEditingId(null);
    toast({ title: "Aggiornato ✓" });
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Eliminare "${item.name}"?`)) return;
    await deleteItem(item.id);
  };

  const handleReplaceFile = async (file: File) => {
    if (!replacingId) return;
    setUploading(true);
    const url = await uploadFile(file);
    setUploading(false);
    if (!url) return;
    await updateItem(replacingId, { url } as any);
    setReplacingId(null);
    toast({ title: "Media sostituito ✓" });
  };

  const handleSwap = async (targetId: string) => {
    if (!swapFrom || swapFrom === targetId) { setSwapFrom(null); return; }
    const fromItem = items.find(i => i.id === swapFrom);
    const toItem = items.find(i => i.id === targetId);
    if (!fromItem || !toItem) return;
    await Promise.all([
      updateItem(fromItem.id, { sort_order: toItem.sort_order } as any),
      updateItem(toItem.id, { sort_order: fromItem.sort_order } as any),
    ]);
    setSwapFrom(null);
    toast({ title: "Posizioni scambiate ✓" });
  };

  // Site Asset handlers
  const handleSaUpload = async (assetId: string, file: File) => {
    setSaUploading(assetId);
    try {
      const ext = file.name.split('.').pop();
      const path = `site-assets/${assetId}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media-vault").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("media-vault").getPublicUrl(path);
      await updateSiteAsset.mutateAsync({ id: assetId, url: publicUrl });
      toast({ title: "Asset aggiornato ✓" });
    } catch (e: any) {
      toast({ title: "Errore upload", description: e.message, variant: "destructive" });
    } finally {
      setSaUploading(null);
    }
  };

  const handleSaSetUrl = async (assetId: string) => {
    if (!saEditUrl.trim()) return;
    try {
      await updateSiteAsset.mutateAsync({ id: assetId, url: saEditUrl.trim() });
      toast({ title: "URL impostato ✓" });
      setSaEditingId(null);
      setSaEditUrl("");
    } catch (e: any) {
      toast({ title: "Errore", description: e.message, variant: "destructive" });
    }
  };

  const handleSaReset = async (assetId: string) => {
    try {
      await updateSiteAsset.mutateAsync({ id: assetId, url: null });
      toast({ title: "Ripristinato", description: "Torna all'asset predefinito" });
    } catch {
      toast({ title: "Errore", variant: "destructive" });
    }
  };

  const renderMediaCard = (item: MediaItem, i: number) => {
    const isEditing = editingId === item.id;
    const isSwapTarget = swapFrom && swapFrom !== item.id;
    const isSwapSource = swapFrom === item.id;
    
    return (
      <motion.div
        key={item.id}
        className={`group rounded-xl bg-card border overflow-hidden transition-all ${
          isSwapSource ? "border-primary ring-2 ring-primary/30" : isSwapTarget ? "border-accent/50 hover:border-accent cursor-pointer" : "border-border hover:border-primary/30"
        }`}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
        onClick={isSwapTarget ? () => handleSwap(item.id) : undefined}
      >
        <div className="relative aspect-video bg-foreground/5 cursor-pointer" onClick={!isSwapTarget ? () => setPreview(item) : undefined}>
          {item.type === "video" ? (
            <>
              <video src={item.resolvedUrl} muted className="w-full h-full object-cover" preload="metadata" />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center"><Play className="w-4 h-4 text-primary-foreground ml-0.5" /></div>
              </div>
            </>
          ) : (
            <img src={item.resolvedUrl} alt={item.name} className="w-full h-full object-cover" />
          )}
          <div className="absolute top-2 left-2 flex gap-1">
            <span className={`px-1.5 py-0.5 rounded-full text-[0.5rem] font-bold tracking-wider uppercase ${item.type === "video" ? "bg-accent/80 text-accent-foreground" : "bg-primary/80 text-primary-foreground"}`}>
              {item.type === "video" ? "VIDEO" : "IMG"}
            </span>
            {item.is_bundled && <span className="px-1.5 py-0.5 rounded-full text-[0.5rem] font-bold bg-secondary/80 text-secondary-foreground">BUNDLE</span>}
          </div>
          <div className="absolute top-2 right-2">
            <span className="px-1.5 py-0.5 rounded-full text-[0.45rem] font-medium bg-foreground/60 text-background">#{item.sort_order}</span>
          </div>
        </div>

        <div className="p-3">
          {isEditing ? (
            <div className="space-y-2">
              <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-2 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground" placeholder="Nome" />
              <select value={editForm.section} onChange={e => setEditForm(p => ({ ...p, section: e.target.value }))}
                className="w-full px-2 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground">
                <option value="">— Seleziona sezione —</option>
                {Object.keys(SECTION_MAP).map(s => <option key={s} value={s}>{SECTION_MAP[s].label} — {s}</option>)}
                <option value="__custom">✏️ Personalizzata...</option>
              </select>
              {editForm.section === "__custom" && (
                <input onChange={e => setEditForm(p => ({ ...p, section: e.target.value }))}
                  className="w-full px-2 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground" placeholder="Nome sezione personalizzata" />
              )}
              <input value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                className="w-full px-2 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground" placeholder="Descrizione" />
              <input value={editForm.dimensions} onChange={e => setEditForm(p => ({ ...p, dimensions: e.target.value }))}
                className="w-full px-2 py-1.5 rounded-lg bg-background border border-border text-xs text-foreground" placeholder="Dimensioni" />
              <div className="flex gap-1.5">
                <Button variant="default" size="sm" className="h-7 text-[0.6rem] gap-1" onClick={saveEdit}>
                  <Save className="w-3 h-3" /> Salva
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-[0.6rem]" onClick={() => setEditingId(null)}>Annulla</Button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-xs font-semibold text-foreground mb-0.5 truncate">{item.name}</h3>
              <p className="text-[0.55rem] text-muted-foreground mb-1.5">{item.dimensions}</p>
              <p className="text-[0.5rem] text-foreground/40 line-clamp-2 mb-2">{item.description}</p>
              <div className="flex gap-1 flex-wrap">
                <Button variant="ghost" size="sm" className="h-6 text-[0.55rem] gap-0.5 px-1.5" onClick={() => setPreview(item)}>
                  <Eye className="w-2.5 h-2.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 text-[0.55rem] gap-0.5 px-1.5" onClick={() => copyPath(item)}>
                  {copiedId === item.id ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-6 text-[0.55rem] gap-0.5 px-1.5" onClick={() => startEdit(item)}>
                  <Pencil className="w-2.5 h-2.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 text-[0.55rem] gap-0.5 px-1.5" onClick={() => { setReplacingId(item.id); replaceFileRef.current?.click(); }}>
                  <RefreshCw className="w-2.5 h-2.5" />
                </Button>
                <Button variant="ghost" size="sm" className={`h-6 text-[0.55rem] gap-0.5 px-1.5 ${isSwapSource ? "bg-primary/20 text-primary" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setSwapFrom(isSwapSource ? null : item.id); }}>
                  <ArrowUpDown className="w-2.5 h-2.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 text-[0.55rem] gap-0.5 px-1.5" onClick={() => moveItem(item.id, "up")}>
                  <ArrowUp className="w-2.5 h-2.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 text-[0.55rem] gap-0.5 px-1.5" onClick={() => moveItem(item.id, "down")}>
                  <ArrowDown className="w-2.5 h-2.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 text-[0.55rem] gap-0.5 px-1.5 text-destructive hover:text-destructive" onClick={() => handleDelete(item)}>
                  <Trash2 className="w-2.5 h-2.5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  const customCount = useMemo(() => (siteAssets || []).filter(a => !!a.url).length, [siteAssets]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      {/* Hidden replace file input */}
      <input ref={replaceFileRef} type="file" accept="video/*,image/*" className="hidden"
        onChange={e => { if (e.target.files?.[0]) handleReplaceFile(e.target.files[0]); }} />

      {/* Page Tabs */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => setPageTab("media")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${pageTab === "media" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
          <Film className="w-4 h-4" /> Media Vault
        </button>
        <button onClick={() => setPageTab("site_assets")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${pageTab === "site_assets" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
          <Palette className="w-4 h-4" /> Site Assets
          {customCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[0.5rem] font-bold bg-accent/20 text-accent">{customCount}</span>
          )}
        </button>
      </div>

      {/* ===== MEDIA VAULT TAB ===== */}
      {pageTab === "media" && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Media Vault</h1>
                <p className="text-xs text-muted-foreground">{items.length} asset · {Object.keys(groupedBySection).length} sezioni</p>
              </div>
            </div>
            <Button onClick={() => setShowAdd(!showAdd)} size="sm" className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Aggiungi
            </Button>
          </div>

          {/* Swap mode banner */}
          <AnimatePresence>
            {swapFrom && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
                  <ArrowUpDown className="w-5 h-5 text-primary animate-pulse" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">Modalità Scambio Posizione</p>
                    <p className="text-[0.6rem] text-muted-foreground">Clicca su un altro media per scambiare le posizioni</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSwapFrom(null)}>Annulla</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Form */}
          <AnimatePresence>
            {showAdd && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-5 overflow-hidden">
                <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">Nuovo Media</h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowAdd(false)}><X className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex gap-2">
                    {(["video", "image"] as const).map(t => (
                      <button key={t} onClick={() => setAddMediaType(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${addMediaType === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                        {t === "video" ? "🎬 Video" : "🖼️ Immagine"}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAddType("upload")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${addType === "upload" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                      <Upload className="w-3 h-3 inline mr-1" /> Upload
                    </button>
                    <button onClick={() => setAddType("url")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${addType === "url" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                      <ExternalLink className="w-3 h-3 inline mr-1" /> URL
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Nome *" className="px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground" />
                    <select value={addForm.section} onChange={e => setAddForm(p => ({ ...p, section: e.target.value }))}
                      className="px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground">
                      <option value="">— Sezione —</option>
                      {Object.keys(SECTION_MAP).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input value={addForm.description} onChange={e => setAddForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Descrizione" className="px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground" />
                    <input value={addForm.dimensions} onChange={e => setAddForm(p => ({ ...p, dimensions: e.target.value }))}
                      placeholder="Dimensioni" className="px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground" />
                  </div>
                  {addType === "upload" ? (
                    <div>
                      <input ref={fileInputRef} type="file" accept="video/*,image/*" className="hidden"
                        onChange={e => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); }} />
                      <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-3.5 h-3.5" /> {selectedFile ? selectedFile.name : "Scegli file..."}
                      </Button>
                    </div>
                  ) : (
                    <input value={addForm.url} onChange={e => setAddForm(p => ({ ...p, url: e.target.value }))}
                      placeholder="https://..." className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground" />
                  )}
                  <Button onClick={handleAdd} disabled={uploading} size="sm" className="gap-2 text-xs">
                    {uploading ? "Upload..." : "Salva Media"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-2 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca media..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "video", "image"] as const).map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1.5 rounded-lg text-[0.65rem] font-medium transition-colors ${filterType === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border border-border"}`}>
                  {t === "all" ? "Tutti" : t === "video" ? "🎬 Video" : "🖼️ Img"}
                </button>
              ))}
              <div className="flex rounded-lg bg-card border border-border overflow-hidden">
                {([
                  { mode: "sections" as const, icon: <FolderOpen className="w-3.5 h-3.5" /> },
                  { mode: "grid" as const, icon: <Grid3X3 className="w-3.5 h-3.5" /> },
                  { mode: "list" as const, icon: <List className="w-3.5 h-3.5" /> },
                ]).map(v => (
                  <button key={v.mode} onClick={() => setViewMode(v.mode)}
                    className={`p-2 ${viewMode === v.mode ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                    {v.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Caricamento media...</p>
            </div>
          )}

          {/* Sections View */}
          {!loading && viewMode === "sections" && (
            <div className="space-y-6">
              {sectionKeys.map(sectionKey => {
                const sectionInfo = SECTION_MAP[sectionKey];
                const sectionItems = groupedBySection[sectionKey];
                return (
                  <div key={sectionKey}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: sectionInfo?.color || "hsl(var(--muted-foreground))" }} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-foreground">{sectionInfo?.label || sectionKey}</h3>
                          <span className="px-1.5 py-0.5 rounded-full text-[0.5rem] font-medium bg-secondary text-muted-foreground">{sectionItems.length}</span>
                        </div>
                        {sectionInfo && <p className="text-[0.55rem] text-muted-foreground">{sectionInfo.description}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sectionItems.map((item, i) => renderMediaCard(item, i))}
                    </div>
                  </div>
                );
              })}
              {sectionKeys.length === 0 && (
                <div className="text-center py-16">
                  <Image className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Nessun media trovato</p>
                </div>
              )}
            </div>
          )}

          {/* Grid View */}
          {!loading && viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((item, i) => renderMediaCard(item, i))}
            </div>
          )}

          {/* List View */}
          {!loading && viewMode === "list" && (
            <div className="space-y-1.5">
              {filtered.map((item, i) => (
                <motion.div key={item.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl bg-card border transition-all ${
                    swapFrom === item.id ? "border-primary ring-2 ring-primary/30" : swapFrom ? "border-accent/30 hover:border-accent cursor-pointer" : "border-border hover:border-primary/30"
                  }`}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                  onClick={swapFrom && swapFrom !== item.id ? () => handleSwap(item.id) : undefined}>
                  <div className="w-16 h-11 rounded-lg overflow-hidden bg-foreground/5 flex-shrink-0 cursor-pointer" onClick={() => setPreview(item)}>
                    {item.type === "video" ? (
                      <video src={item.resolvedUrl} muted className="w-full h-full object-cover" preload="metadata" />
                    ) : (
                      <img src={item.resolvedUrl} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-semibold text-foreground truncate">{item.name}</h3>
                      <span className={`px-1 py-0.5 rounded text-[0.45rem] font-bold ${item.type === "video" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                        {item.type.toUpperCase()}
                      </span>
                      <span className="text-[0.45rem] text-muted-foreground">#{item.sort_order}</span>
                    </div>
                    <p className="text-[0.5rem] text-muted-foreground truncate">{item.section}</p>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem(item.id, "up")}><ArrowUp className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem(item.id, "down")}><ArrowDown className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(item)}><Pencil className="w-3 h-3" /></Button>
                    <Button variant="ghost" size="icon" className={`h-7 w-7 ${swapFrom === item.id ? "text-primary" : ""}`}
                      onClick={(e) => { e.stopPropagation(); setSwapFrom(swapFrom === item.id ? null : item.id); }}>
                      <ArrowUpDown className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setReplacingId(item.id); replaceFileRef.current?.click(); }}>
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(item)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && viewMode !== "sections" && (
            <div className="text-center py-16">
              <Image className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nessun media trovato</p>
            </div>
          )}
        </>
      )}

      {/* ===== SITE ASSETS TAB ===== */}
      {pageTab === "site_assets" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Site Assets</h1>
              <p className="text-xs text-muted-foreground">
                Gestisci foto e video di tutta la piattaforma · {customCount} personalizzati su {(siteAssets || []).length} totali
              </p>
            </div>
          </div>

          {/* Search + Section filters */}
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Cerca slot..." value={saSearch} onChange={e => setSaSearch(e.target.value)}
                className="pl-8 h-9 text-xs bg-secondary/40 border-border/50 rounded-xl" />
            </div>
          </div>
          <div className="flex gap-1.5 mb-5 overflow-x-auto scrollbar-hide pb-1">
            {[{ key: "all", label: "Tutti", icon: "📋" }, ...Object.entries(SITE_ASSET_SECTIONS).map(([k, v]) => ({ key: k, label: v.label, icon: v.icon }))].map(s => (
              <button key={s.key} onClick={() => setSaSectionFilter(s.key)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[0.6rem] font-semibold whitespace-nowrap transition-all ${
                  saSectionFilter === s.key ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary/50 text-muted-foreground"
                }`}>
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {siteAssetsLoading && (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Caricamento...</p>
            </div>
          )}

          {/* Grouped sections */}
          {!siteAssetsLoading && Object.entries(saGrouped).map(([section, sItems]) => {
            const secInfo = SITE_ASSET_SECTIONS[section];
            return (
              <div key={section} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-8 rounded-full bg-accent/50" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-heading font-bold text-foreground">
                        {secInfo?.icon} {secInfo?.label || section}
                      </h2>
                      <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono">{sItems.length}</span>
                    </div>
                    {secInfo && <p className="text-[0.5rem] text-muted-foreground">{secInfo.description}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {sItems.map(asset => {
                    const isEditing = saEditingId === asset.id;
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

                          {isEditing ? (
                            <div className="flex gap-1">
                              <Input value={saEditUrl} onChange={e => setSaEditUrl(e.target.value)} placeholder="https://..."
                                className="h-7 text-[0.55rem] flex-1 bg-secondary/40 border-border/50 rounded-lg" />
                              <button onClick={() => handleSaSetUrl(asset.id)} className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                                <Check className="w-3 h-3" />
                              </button>
                              <button onClick={() => { setSaEditingId(null); setSaEditUrl(""); }} className="w-7 h-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-1">
                              <label className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[0.5rem] font-semibold cursor-pointer transition-colors ${
                                saUploading === asset.id ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"
                              }`}>
                                <Upload className="w-3 h-3" />
                                {saUploading === asset.id ? "..." : "Upload"}
                                <input type="file" className="hidden" accept={isVideo ? "video/*" : "image/*"}
                                  onChange={e => { const f = e.target.files?.[0]; if (f) handleSaUpload(asset.id, f); }} />
                              </label>
                              <button onClick={() => { setSaEditingId(asset.id); setSaEditUrl(asset.url || ""); }}
                                className="flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground text-[0.5rem] font-semibold transition-colors">
                                <ExternalLink className="w-3 h-3" /> URL
                              </button>
                              {hasCustom && (
                                <button onClick={() => handleSaReset(asset.id)}
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
            );
          })}

          {!siteAssetsLoading && saFiltered.length === 0 && (
            <div className="text-center py-16">
              <Palette className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nessun asset trovato</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreview(null)}>
            <motion.div className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-card border border-border shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}>
              {preview.type === "video" ? (
                <video src={preview.resolvedUrl} autoPlay controls muted className="w-full aspect-video object-cover" />
              ) : (
                <img src={preview.resolvedUrl} alt={preview.name} className="w-full max-h-[70vh] object-contain bg-foreground/5" />
              )}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{preview.name}</h3>
                  <p className="text-[0.6rem] text-muted-foreground">{preview.section} • {preview.dimensions}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => copyPath(preview)}>
                    <Copy className="w-3 h-3" /> Path
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
