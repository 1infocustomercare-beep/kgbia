import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film, Image, Trash2, Eye, Copy, Check, Search, Grid3X3, List, Play,
  Plus, Upload, ChevronUp, ChevronDown, Pencil, X, Save, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useMediaVault, type MediaItem } from "@/hooks/useMediaVault";

type ViewMode = "grid" | "list";

const MediaVaultPage = () => {
  const { items, loading, addItem, deleteItem, updateItem, moveItem, uploadFile } = useMediaVault();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<"all" | "video" | "image">("all");
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", section: "", description: "", dimensions: "" });
  const [uploading, setUploading] = useState(false);

  // Add form state
  const [addForm, setAddForm] = useState({ name: "", section: "", description: "", dimensions: "", url: "" });
  const [addType, setAddType] = useState<"upload" | "url">("upload");
  const [addMediaType, setAddMediaType] = useState<"video" | "image">("video");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filtered = items.filter(m => {
    if (filterType !== "all" && m.type !== filterType) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.section.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const copyPath = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    toast({ title: "Path copiato", description: `${item.name} copiato negli appunti` });
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

    await addItem({
      name: addForm.name,
      type: addMediaType,
      url: finalUrl,
      section: addForm.section,
      description: addForm.description,
      dimensions: addForm.dimensions,
    });

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
    toast({ title: "Aggiornato" });
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Eliminare "${item.name}"?`)) return;
    await deleteItem(item.id);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Film className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Media Vault</h1>
            <p className="text-xs text-muted-foreground">{items.length} asset • Aggiornamento in tempo reale</p>
          </div>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="gap-2">
          <Plus className="w-4 h-4" /> Aggiungi Media
        </Button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Nuovo Media</h3>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowAdd(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Type selector */}
              <div className="flex gap-2">
                <button onClick={() => setAddMediaType("video")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${addMediaType === "video" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  🎬 Video
                </button>
                <button onClick={() => setAddMediaType("image")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${addMediaType === "image" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  🖼️ Immagine
                </button>
              </div>

              {/* Source selector */}
              <div className="flex gap-2">
                <button onClick={() => setAddType("upload")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${addType === "upload" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                  <Upload className="w-3 h-3 inline mr-1" /> Upload File
                </button>
                <button onClick={() => setAddType("url")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${addType === "url" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
                  <ExternalLink className="w-3 h-3 inline mr-1" /> URL Esterno
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Nome *" className="px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground" />
                <input value={addForm.section} onChange={e => setAddForm(p => ({ ...p, section: e.target.value }))}
                  placeholder="Sezione (es. Landing — Hero)" className="px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground" />
                <input value={addForm.description} onChange={e => setAddForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Descrizione" className="px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground" />
                <input value={addForm.dimensions} onChange={e => setAddForm(p => ({ ...p, dimensions: e.target.value }))}
                  placeholder="Dimensioni (es. 1920×1080)" className="px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground" />
              </div>

              {addType === "upload" ? (
                <div>
                  <input ref={fileInputRef} type="file" accept="video/*,image/*" className="hidden"
                    onChange={e => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); }} />
                  <Button variant="outline" className="gap-2 text-xs" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-3.5 h-3.5" />
                    {selectedFile ? selectedFile.name : "Scegli file..."}
                  </Button>
                </div>
              ) : (
                <input value={addForm.url} onChange={e => setAddForm(p => ({ ...p, url: e.target.value }))}
                  placeholder="https://... URL del media" className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground" />
              )}

              <Button onClick={handleAdd} disabled={uploading} className="gap-2">
                {uploading ? "Upload in corso..." : "Salva Media"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca media..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
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

      {loading && (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Caricamento media...</p>
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <motion.div key={item.id} className="group rounded-xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-all"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              {/* Thumbnail */}
              <div className="relative aspect-video bg-foreground/5 cursor-pointer" onClick={() => setPreview(item)}>
                {item.type === "video" ? (
                  <>
                    <video src={item.resolvedUrl} muted className="w-full h-full object-cover" preload="metadata" />
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center"><Play className="w-5 h-5 text-primary-foreground ml-0.5" /></div>
                    </div>
                  </>
                ) : (
                  <img src={item.resolvedUrl} alt={item.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-[0.55rem] font-bold tracking-wider uppercase ${item.type === "video" ? "bg-accent/80 text-accent-foreground" : "bg-primary/80 text-primary-foreground"}`}>
                    {item.type === "video" ? "VIDEO" : "IMG"}
                  </span>
                  {item.is_bundled && (
                    <span className="px-2 py-0.5 rounded-full text-[0.55rem] font-bold bg-secondary text-secondary-foreground">BUNDLED</span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                {editingId === item.id ? (
                  <div className="space-y-2">
                    <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-2 py-1 rounded bg-background border border-border text-xs text-foreground" />
                    <input value={editForm.section} onChange={e => setEditForm(p => ({ ...p, section: e.target.value }))}
                      className="w-full px-2 py-1 rounded bg-background border border-border text-xs text-foreground" placeholder="Sezione" />
                    <input value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                      className="w-full px-2 py-1 rounded bg-background border border-border text-xs text-foreground" placeholder="Descrizione" />
                    <div className="flex gap-1">
                      <Button variant="default" size="sm" className="h-6 text-[0.6rem] gap-1" onClick={saveEdit}>
                        <Save className="w-3 h-3" /> Salva
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[0.6rem]" onClick={() => setEditingId(null)}>Annulla</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-sm font-semibold text-foreground mb-0.5">{item.name}</h3>
                    <p className="text-[0.6rem] text-muted-foreground mb-2">{item.section} • {item.dimensions}</p>
                    <p className="text-[0.6rem] text-foreground/40 line-clamp-2 mb-3">{item.description}</p>
                    <div className="flex gap-1 flex-wrap">
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setPreview(item)}>
                        <Eye className="w-3 h-3" /> Preview
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => copyPath(item)}>
                        {copiedId === item.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => startEdit(item)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => moveItem(item.id, "up")}>
                        <ChevronUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => moveItem(item.id, "down")}>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-destructive hover:text-destructive" onClick={() => handleDelete(item)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && viewMode === "list" && (
        <div className="space-y-2">
          {filtered.map((item, i) => (
            <motion.div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-foreground/5 flex-shrink-0 cursor-pointer" onClick={() => setPreview(item)}>
                {item.type === "video" ? (
                  <video src={item.resolvedUrl} muted className="w-full h-full object-cover" preload="metadata" />
                ) : (
                  <img src={item.resolvedUrl} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground truncate">{item.name}</h3>
                  <span className={`px-1.5 py-0.5 rounded text-[0.5rem] font-bold flex-shrink-0 ${item.type === "video" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                    {item.type.toUpperCase()}
                  </span>
                  {item.is_bundled && <span className="px-1.5 py-0.5 rounded text-[0.5rem] font-bold bg-secondary text-secondary-foreground flex-shrink-0">BUNDLED</span>}
                </div>
                <p className="text-[0.6rem] text-muted-foreground truncate">{item.section} • {item.dimensions}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveItem(item.id, "up")}>
                  <ChevronUp className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveItem(item.id, "down")}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(item)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreview(item)}>
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(item)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
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
