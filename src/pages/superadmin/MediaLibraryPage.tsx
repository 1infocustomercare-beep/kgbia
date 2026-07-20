import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import {
  Loader2, Search, Trash2, Download, Copy, Image as ImageIcon, Film,
  FileText, RefreshCw, Filter, CheckSquare, Square,
} from "lucide-react";

const BUCKETS = [
  { id: "media-vault", label: "Media Vault", desc: "Video/immagini caricati manualmente" },
  { id: "homepage-media", label: "Homepage Media", desc: "Hero, banner e asset della homepage" },
  { id: "business-assets", label: "Business Assets", desc: "Loghi, foto e file dei clienti" },
  { id: "partner-assets", label: "Partner Assets", desc: "Materiale dei partner" },
  { id: "restaurant-logos", label: "Restaurant Logos", desc: "Loghi ristoranti" },
] as const;

type FileRow = {
  bucket: string;
  path: string;
  name: string;
  size: number;
  mime: string;
  updated_at: string;
  url: string;
};

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif|svg)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

const fmtBytes = (b: number) => {
  if (!b) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(2)} MB`;
};

const kindOf = (name: string, mime?: string) => {
  if (mime?.startsWith("image/") || IMAGE_EXT.test(name)) return "image" as const;
  if (mime?.startsWith("video/") || VIDEO_EXT.test(name)) return "video" as const;
  return "other" as const;
};

async function listBucketRecursive(bucket: string, prefix = ""): Promise<FileRow[]> {
  const out: FileRow[] = [];
  const stack: string[] = [prefix];
  while (stack.length) {
    const p = stack.pop()!;
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(p, { limit: 1000, sortBy: { column: "updated_at", order: "desc" } });
    if (error) throw error;
    for (const item of data ?? []) {
      const full = p ? `${p}/${item.name}` : item.name;
      // Folders have id=null
      if (!item.id) {
        stack.push(full);
      } else {
        const size = (item.metadata as any)?.size ?? 0;
        const mime = (item.metadata as any)?.mimetype ?? "";
        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(full);
        out.push({
          bucket,
          path: full,
          name: item.name,
          size,
          mime,
          updated_at: item.updated_at ?? item.created_at ?? "",
          url: pub.publicUrl,
        });
      }
    }
  }
  return out;
}

const MediaLibraryPage = () => {
  const [rows, setRows] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [bucket, setBucket] = useState<string>("all");
  const [kind, setKind] = useState<"all" | "image" | "video" | "other">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<FileRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<FileRow[] | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await Promise.all(BUCKETS.map(b => listBucketRecursive(b.id).catch(() => [])));
      const merged = all.flat().sort((a, b) => (b.updated_at || "").localeCompare(a.updated_at || ""));
      setRows(merged);
    } catch (e: any) {
      toast({ title: "Errore caricamento", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(r => {
      if (bucket !== "all" && r.bucket !== bucket) return false;
      const k = kindOf(r.name, r.mime);
      if (kind !== "all" && k !== kind) return false;
      if (q && !r.path.toLowerCase().includes(q) && !r.bucket.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, bucket, kind, search]);

  const stats = useMemo(() => {
    const byBucket: Record<string, { count: number; size: number }> = {};
    let totalSize = 0;
    for (const r of rows) {
      byBucket[r.bucket] ??= { count: 0, size: 0 };
      byBucket[r.bucket].count++;
      byBucket[r.bucket].size += r.size;
      totalSize += r.size;
    }
    return { byBucket, totalSize, total: rows.length };
  }, [rows]);

  const toggle = (key: string) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(key) ? s.delete(key) : s.add(key);
      return s;
    });
  };

  const doDelete = async (targets: FileRow[]) => {
    setDeleting(true);
    try {
      const byBucket: Record<string, string[]> = {};
      targets.forEach(t => { (byBucket[t.bucket] ??= []).push(t.path); });
      for (const [b, paths] of Object.entries(byBucket)) {
        const { error } = await supabase.storage.from(b).remove(paths);
        if (error) throw error;
      }
      toast({ title: `Eliminati ${targets.length} file`, description: "Rimossi definitivamente dallo storage." });
      setRows(prev => prev.filter(r => !targets.some(t => t.bucket === r.bucket && t.path === r.path)));
      setSelected(new Set());
      setPreview(null);
    } catch (e: any) {
      toast({ title: "Errore eliminazione", description: e.message, variant: "destructive" });
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const selectedRows = filtered.filter(r => selected.has(`${r.bucket}/${r.path}`));

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white pb-20">
      <div className="sticky top-0 z-30 backdrop-blur-lg bg-[#0a0d14]/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BackButton />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Media Library</h1>
              <p className="text-xs text-white/60">Tutti i file su tutti i bucket · gestione centrale</p>
            </div>
          </div>
          <Button onClick={load} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Aggiorna
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="text-xs text-white/60">Totale file</div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-white/40 mt-1">{fmtBytes(stats.totalSize)}</div>
          </Card>
          {BUCKETS.map(b => (
            <Card
              key={b.id}
              className={`p-4 bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 transition ${bucket === b.id ? "ring-2 ring-amber-500" : ""}`}
              onClick={() => setBucket(bucket === b.id ? "all" : b.id)}
            >
              <div className="text-xs text-white/60 truncate">{b.label}</div>
              <div className="text-2xl font-bold">{stats.byBucket[b.id]?.count ?? 0}</div>
              <div className="text-xs text-white/40 mt-1">{fmtBytes(stats.byBucket[b.id]?.size ?? 0)}</div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cerca per nome file o percorso…"
              className="pl-9 bg-white/5 border-white/10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant={bucket === "all" ? "default" : "outline"} size="sm" onClick={() => setBucket("all")}>
              Tutti i bucket
            </Button>
            {(["all", "image", "video", "other"] as const).map(k => (
              <Button key={k} variant={kind === k ? "default" : "outline"} size="sm" onClick={() => setKind(k)}>
                {k === "all" ? "Tutti" : k === "image" ? "Immagini" : k === "video" ? "Video" : "Altri"}
              </Button>
            ))}
          </div>
        </div>

        {/* Selection bar */}
        {selected.size > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/30 sticky top-[76px] z-20 backdrop-blur">
            <div className="text-sm">
              <strong>{selected.size}</strong> file selezionati ·{" "}
              {fmtBytes(selectedRows.reduce((s, r) => s + r.size, 0))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Annulla</Button>
              <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(selectedRows)}>
                <Trash2 className="w-4 h-4 mr-2" /> Elimina definitivamente
              </Button>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/50">Nessun file trovato con questi filtri.</div>
        ) : (
          <>
            <div className="text-xs text-white/50 mb-2">{filtered.length} risultati</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map(r => {
                const key = `${r.bucket}/${r.path}`;
                const isSel = selected.has(key);
                const k = kindOf(r.name, r.mime);
                return (
                  <div
                    key={key}
                    className={`group relative rounded-lg overflow-hidden border transition ${isSel ? "border-amber-500 ring-2 ring-amber-500" : "border-white/10 hover:border-white/30"} bg-white/5`}
                  >
                    <button
                      onClick={() => toggle(key)}
                      className="absolute top-2 left-2 z-10 w-6 h-6 rounded bg-black/60 backdrop-blur flex items-center justify-center"
                      aria-label="Seleziona"
                    >
                      {isSel ? <CheckSquare className="w-4 h-4 text-amber-400" /> : <Square className="w-4 h-4 text-white/70" />}
                    </button>
                    <button
                      onClick={() => setPreview(r)}
                      className="block w-full aspect-square bg-black/40 relative"
                    >
                      {k === "image" ? (
                        <img src={r.url} alt={r.name} loading="lazy" className="w-full h-full object-cover" />
                      ) : k === "video" ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-10 h-10 text-white/40" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-10 h-10 text-white/40" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="text-[10px] bg-black/60 backdrop-blur border-white/20">
                          {r.bucket.replace("-", " ")}
                        </Badge>
                      </div>
                    </button>
                    <div className="p-2 text-xs">
                      <div className="truncate font-medium" title={r.path}>{r.name}</div>
                      <div className="flex justify-between text-white/50 mt-1">
                        <span>{fmtBytes(r.size)}</span>
                        <span>{r.updated_at ? new Date(r.updated_at).toLocaleDateString("it-IT") : "—"}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-14 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(r.url); toast({ title: "URL copiato" }); }}
                        className="w-7 h-7 rounded bg-black/70 backdrop-blur flex items-center justify-center hover:bg-black"
                        title="Copia URL"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete([r]); }}
                        className="w-7 h-7 rounded bg-red-600/80 backdrop-blur flex items-center justify-center hover:bg-red-600"
                        title="Elimina"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Preview dialog */}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-4xl bg-[#0a0d14] border-white/10 text-white">
          {preview && (
            <div className="space-y-4">
              <div className="max-h-[70vh] flex items-center justify-center bg-black/50 rounded">
                {kindOf(preview.name, preview.mime) === "image" ? (
                  <img src={preview.url} alt={preview.name} className="max-h-[70vh] object-contain" />
                ) : kindOf(preview.name, preview.mime) === "video" ? (
                  <video src={preview.url} controls className="max-h-[70vh]" />
                ) : (
                  <div className="p-20 text-white/60">Anteprima non disponibile</div>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <div><strong>Nome:</strong> {preview.name}</div>
                <div><strong>Bucket:</strong> {preview.bucket}</div>
                <div className="break-all"><strong>Path:</strong> {preview.path}</div>
                <div><strong>Dimensione:</strong> {fmtBytes(preview.size)} · <strong>MIME:</strong> {preview.mime || "—"}</div>
                <div><strong>Aggiornato:</strong> {preview.updated_at ? new Date(preview.updated_at).toLocaleString("it-IT") : "—"}</div>
                <div className="break-all"><strong>URL:</strong> <a href={preview.url} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">{preview.url}</a></div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={() => { navigator.clipboard.writeText(preview.url); toast({ title: "URL copiato" }); }}>
                  <Copy className="w-4 h-4 mr-2" /> Copia URL
                </Button>
                <Button variant="outline" asChild>
                  <a href={preview.url} download={preview.name} target="_blank" rel="noreferrer">
                    <Download className="w-4 h-4 mr-2" /> Scarica
                  </a>
                </Button>
                <Button variant="destructive" onClick={() => setConfirmDelete([preview])}>
                  <Trash2 className="w-4 h-4 mr-2" /> Elimina definitivamente
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent className="bg-[#0a0d14] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare definitivamente?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Stai per eliminare <strong>{confirmDelete?.length ?? 0}</strong> file dallo storage.
              L'operazione è <strong>irreversibile</strong> e i file non saranno più recuperabili.
              Eventuali riferimenti in pagine live risulteranno rotti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annulla</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={() => confirmDelete && doDelete(confirmDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MediaLibraryPage;
