import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  Copy,
  Crop,
  Loader2,
  Search,
  Sparkles,
  Download,
} from "lucide-react";

type MediaCategory = "hero" | "stat" | "cta" | "logo" | "gallery" | "video" | "other";

type MediaRow = {
  id: string;
  category: MediaCategory;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  storage_path: string;
  public_url: string;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  focal_x: number | null;
  focal_y: number | null;
  is_video: boolean | null;
  poster_url: string | null;
  created_at: string;
};

const CATEGORIES: { value: MediaCategory; label: string; icon: string }[] = [
  { value: "hero", label: "Hero / Cover", icon: "🎬" },
  { value: "stat", label: "Statistiche", icon: "📊" },
  { value: "cta", label: "CTA / Banner", icon: "🚀" },
  { value: "logo", label: "Logo / Brand", icon: "👑" },
  { value: "gallery", label: "Galleria", icon: "🖼️" },
  { value: "video", label: "Video", icon: "🎥" },
  { value: "other", label: "Altro", icon: "📦" },
];

const PRESETS: Record<MediaCategory, { w: number; h: number; label: string }> = {
  hero: { w: 1920, h: 1080, label: "16:9 Cinematic" },
  stat: { w: 800, h: 800, label: "1:1 Square" },
  cta: { w: 1600, h: 600, label: "Banner 8:3" },
  logo: { w: 512, h: 512, label: "Logo 1:1" },
  gallery: { w: 1200, h: 1200, label: "1:1 Gallery" },
  video: { w: 1920, h: 1080, label: "Poster 16:9" },
  other: { w: 1600, h: 1200, label: "4:3 Free" },
};

const BUCKET = "homepage-media";

const formatBytes = (b?: number | null) => {
  if (!b) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
};

/** Resize + crop center to target ratio, output WebP blob (or original for video). */
async function optimizeImage(
  file: File,
  target: { w: number; h: number },
  focal: { x: number; y: number } = { x: 0.5, y: 0.5 },
  quality = 0.85,
): Promise<{ blob: Blob; width: number; height: number; mime: string }> {
  if (file.type.startsWith("video/")) {
    return { blob: file, width: 0, height: 0, mime: file.type };
  }
  const bitmap = await createImageBitmap(file);
  const srcRatio = bitmap.width / bitmap.height;
  const dstRatio = target.w / target.h;

  let sx = 0,
    sy = 0,
    sw = bitmap.width,
    sh = bitmap.height;
  if (srcRatio > dstRatio) {
    // crop sides
    sw = bitmap.height * dstRatio;
    sx = Math.max(0, Math.min(bitmap.width - sw, focal.x * bitmap.width - sw / 2));
  } else {
    sh = bitmap.width / dstRatio;
    sy = Math.max(0, Math.min(bitmap.height - sh, focal.y * bitmap.height - sh / 2));
  }

  const scale = Math.min(1, target.w / sw);
  const outW = Math.round(sw * scale);
  const outH = Math.round(sh * scale);

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, outW, outH);

  const supportsWebp = canvas.toDataURL("image/webp").startsWith("data:image/webp");
  const mime = supportsWebp ? "image/webp" : "image/jpeg";
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), mime, quality));
  return { blob, width: outW, height: outH, mime };
}

export default function HomepageMediaManagerPage() {
  const [items, setItems] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<MediaCategory>("hero");
  const [filter, setFilter] = useState<MediaCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [focal, setFocal] = useState({ x: 0.5, y: 0.5 });
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editing, setEditing] = useState<MediaRow | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("homepage_media")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Errore caricamento", description: error.message, variant: "destructive" });
    setItems((data as MediaRow[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let r = items;
    if (filter !== "all") r = r.filter((i) => i.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return r;
  }, [items, filter, search]);

  const onPick = (f: File | null) => {
    setPreviewFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  };

  const upload = async () => {
    if (!previewFile) return;
    setUploading(true);
    try {
      const isVideo = previewFile.type.startsWith("video/");
      const preset = PRESETS[category];
      const { blob, width, height, mime } = await optimizeImage(previewFile, preset, focal);
      const ext = isVideo ? previewFile.name.split(".").pop() || "mp4" : mime === "image/webp" ? "webp" : "jpg";
      const path = `${category}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, blob, {
        contentType: mime,
        upsert: false,
        cacheControl: "31536000",
      });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

      const user = (await supabase.auth.getUser()).data.user;
      const { error: insErr } = await supabase.from("homepage_media").insert({
        category,
        title: title || previewFile.name,
        description: desc || null,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        storage_path: path,
        public_url: pub.publicUrl,
        mime_type: mime,
        width: isVideo ? null : width,
        height: isVideo ? null : height,
        size_bytes: blob.size,
        focal_x: focal.x,
        focal_y: focal.y,
        is_video: isVideo,
        uploaded_by: user?.id || null,
      });
      if (insErr) throw insErr;

      toast({ title: "Caricato ✅", description: `${formatBytes(previewFile.size)} → ${formatBytes(blob.size)}` });
      setTitle("");
      setDesc("");
      setTags("");
      setFocal({ x: 0.5, y: 0.5 });
      onPick(null);
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (e: any) {
      toast({ title: "Errore upload", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const remove = async (row: MediaRow) => {
    if (!confirm(`Eliminare "${row.title || row.storage_path}"?`)) return;
    await supabase.storage.from(BUCKET).remove([row.storage_path]);
    await supabase.from("homepage_media").delete().eq("id", row.id);
    toast({ title: "Eliminato" });
    load();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copiato" });
  };

  const updateMeta = async () => {
    if (!editing) return;
    const { error } = await supabase
      .from("homepage_media")
      .update({
        title: editing.title,
        description: editing.description,
        category: editing.category,
        tags: editing.tags,
        focal_x: editing.focal_x,
        focal_y: editing.focal_y,
      })
      .eq("id", editing.id);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Aggiornato" });
    setEditing(null);
    load();
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Sparkles className="text-amber-400" /> Media Manager Homepage
            </h1>
            <p className="text-white/60 mt-1">
              Carica, ottimizza e organizza immagini e video usati nella homepage pubblica.
            </p>
          </div>
          <Badge variant="outline" className="border-amber-400/40 text-amber-300">
            {items.length} asset · {formatBytes(items.reduce((a, b) => a + (b.size_bytes || 0), 0))}
          </Badge>
        </header>

        {/* UPLOAD CARD */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" /> Nuovo asset
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>File (immagine o video)</Label>
                <Input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => onPick(e.target.files?.[0] || null)}
                  className="bg-black/40 border-white/20 text-white"
                />
                {previewFile && (
                  <p className="text-xs text-white/50 mt-1">
                    {previewFile.name} · {formatBytes(previewFile.size)} → output ottimizzato {PRESETS[category].label}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Categoria</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as MediaCategory)}>
                    <SelectTrigger className="bg-black/40 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.icon} {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Preset crop</Label>
                  <Input
                    readOnly
                    value={`${PRESETS[category].label} · ${PRESETS[category].w}×${PRESETS[category].h}`}
                    className="bg-black/40 border-white/20 text-white/70"
                  />
                </div>
              </div>
              <div>
                <Label>Titolo</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-black/40 border-white/20 text-white" />
              </div>
              <div>
                <Label>Descrizione</Label>
                <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} className="bg-black/40 border-white/20 text-white" />
              </div>
              <div>
                <Label>Tag (separati da virgola)</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} className="bg-black/40 border-white/20 text-white" />
              </div>
              <Button
                onClick={upload}
                disabled={!previewFile || uploading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold"
              >
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Carica & ottimizza
              </Button>
            </div>

            {/* FOCAL POINT PREVIEW */}
            <div>
              <Label className="flex items-center gap-2">
                <Crop className="w-4 h-4" /> Focal point (click per impostare)
              </Label>
              <div
                className="relative mt-2 rounded-xl overflow-hidden border border-white/15 bg-black/40 select-none"
                style={{ aspectRatio: `${PRESETS[category].w}/${PRESETS[category].h}` }}
                onClick={(e) => {
                  if (!previewUrl) return;
                  const r = e.currentTarget.getBoundingClientRect();
                  setFocal({
                    x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
                    y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
                  });
                }}
              >
                {previewUrl ? (
                  previewFile?.type.startsWith("video/") ? (
                    <video src={previewUrl} className="w-full h-full object-cover" muted autoPlay loop />
                  ) : (
                    <img
                      src={previewUrl}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: `${focal.x * 100}% ${focal.y * 100}%` }}
                      alt="preview"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                {previewUrl && (
                  <div
                    className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-400 bg-amber-400/30 pointer-events-none"
                    style={{ left: `${focal.x * 100}%`, top: `${focal.y * 100}%` }}
                  />
                )}
              </div>
              <p className="text-xs text-white/50 mt-2">
                Focal: {(focal.x * 100).toFixed(0)}% × {(focal.y * 100).toFixed(0)}% — definisce il centro del crop automatico.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
            Tutti
          </Button>
          {CATEGORIES.map((c) => (
            <Button key={c.value} size="sm" variant={filter === c.value ? "default" : "outline"} onClick={() => setFilter(c.value)}>
              {c.icon} {c.label}
            </Button>
          ))}
          <div className="ml-auto relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="Cerca per titolo, tag…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64 bg-black/40 border-white/20 text-white"
            />
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-amber-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/40">Nessun asset trovato.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((row) => (
              <Card key={row.id} className="bg-white/5 border-white/10 overflow-hidden group">
                <div className="relative aspect-square bg-black/60">
                  {row.is_video ? (
                    <video src={row.public_url} className="w-full h-full object-cover" muted loop onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()} onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()} />
                  ) : (
                    <img
                      src={row.public_url}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: `${(row.focal_x ?? 0.5) * 100}% ${(row.focal_y ?? 0.5) * 100}%` }}
                      alt={row.title || ""}
                    />
                  )}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge className="bg-black/70 text-white text-[10px]">
                      {row.is_video ? <Video className="w-3 h-3 mr-1" /> : <ImageIcon className="w-3 h-3 mr-1" />}
                      {row.category}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" onClick={() => copyUrl(row.public_url)} title="Copia URL">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" onClick={() => setEditing(row)} title="Modifica">
                      <Crop className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" asChild title="Apri">
                      <a href={row.public_url} target="_blank" rel="noreferrer">
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => remove(row)} title="Elimina">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3 space-y-1">
                  <div className="text-sm font-semibold truncate">{row.title || "Senza titolo"}</div>
                  <div className="text-[11px] text-white/50 flex justify-between">
                    <span>{row.width && row.height ? `${row.width}×${row.height}` : row.is_video ? "VIDEO" : "—"}</span>
                    <span>{formatBytes(row.size_bytes)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* EDIT DIALOG */}
        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogContent className="bg-[#0b0d12] text-white border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifica asset</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Titolo</Label>
                    <Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="bg-black/40 border-white/20 text-white" />
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v as MediaCategory })}>
                      <SelectTrigger className="bg-black/40 border-white/20 text-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Descrizione</Label>
                  <Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="bg-black/40 border-white/20 text-white" />
                </div>
                <div>
                  <Label>Tag (separati da virgola)</Label>
                  <Input
                    value={(editing.tags || []).join(", ")}
                    onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                    className="bg-black/40 border-white/20 text-white"
                  />
                </div>
                {!editing.is_video && (
                  <div>
                    <Label>Focal point (click per spostare)</Label>
                    <div
                      className="relative mt-2 rounded-xl overflow-hidden border border-white/15"
                      style={{ aspectRatio: `${editing.width || 16}/${editing.height || 9}` }}
                      onClick={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        setEditing({
                          ...editing,
                          focal_x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
                          focal_y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
                        });
                      }}
                    >
                      <img src={editing.public_url} className="w-full h-full object-cover" alt="" />
                      <div
                        className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-400 bg-amber-400/30 pointer-events-none"
                        style={{ left: `${(editing.focal_x ?? 0.5) * 100}%`, top: `${(editing.focal_y ?? 0.5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setEditing(null)}>Annulla</Button>
                  <Button onClick={updateMeta} className="bg-amber-500 text-black font-bold hover:bg-amber-400">Salva</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
