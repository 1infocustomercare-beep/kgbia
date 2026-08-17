/**
 * Galleria di confronto mockup per settore — SUPER ADMIN.
 *
 * Aggrega TUTTI i mockup disponibili:
 *  - asset locali: src/assets/mockups/** (catalog, generated, portfolio-lowengeld, root)
 *  - pointer CDN (.asset.json)
 *  - immagini presenti negli storage bucket (media-vault, homepage-media, ...)
 *
 * Permette: filtro settore/fonte/schermata, ricerca, thumbnail, fullscreen,
 * selezione "da tenere" / "da scartare" con contatore per settore (target 20)
 * ed export JSON della selezione.
 *
 * ADDITIVO: non modifica né rimuove registri o pagine esistenti.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import {
  Check, Download, Loader2, RefreshCw, Search, Star, Trash2, X, LayoutGrid,
} from "lucide-react";

/* ------------------------------------------------------------------ assets */

const localImages = import.meta.glob(
  "/src/assets/mockups/**/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, import: "default" },
) as Record<string, string>;

const localPointers = import.meta.glob(
  "/src/assets/mockups/**/*.asset.json",
  { eager: true, import: "default" },
) as Record<string, { url?: string; original_filename?: string; size?: number }>;

const STORAGE_BUCKETS = ["media-vault", "homepage-media", "partner-assets"] as const;

const SECTOR_DICTIONARY: Array<[string, RegExp]> = [
  ["food", /(food|pizz|sushi|kebab|osteria|braceria|ristor|bar-|caff|gelat|panin|trattoria|enoteca|teglia|omakase)/i],
  ["beauty", /(beauty|nail|hair|barber|medspa|estet|spa-|make ?up|parrucch|unghie)/i],
  ["ncc", /(ncc|chauffeur|limo|transfer|jet|aviation|autonoleggio)/i],
  ["fitness", /(fitness|padel|gym|palestra|yoga|pilates|crossfit|tennis|nuoto|onda)/i],
  ["hospitality", /(hospitality|hotel|resort|bnb|b&b|agriturismo|camping|cala|suite)/i],
  ["healthcare", /(health|clinic|dent|medic|fisio|psico|lumen|studio-medico)/i],
  ["realestate", /(realestate|immobil|agenzia|condo|casa|domus|villa)/i],
  ["legal", /(legal|avvoc|notaio|studio-legale)/i],
  ["retail", /(retail|shop|store|boutique|gioieller|negozio)/i],
  ["events", /(event|wedding|matrimon|catering|teatro|dj)/i],
  ["education", /(education|scuola|course|corsi|autoscuola|coding|formazione)/i],
  ["petcare", /(pet|veterinar|dog|toelett|tropico)/i],
  ["childcare", /(child|nido|montessori|bimbi|arcobaleno|stelle)/i],
  ["homeservices", /(cleaning|plumber|idraul|electric|gardening|garage|construction|edil|imbianch|fabbro)/i],
  ["watersports", /(beach|surf|diving|kite|charter|yacht|vela|rafting|marina)/i],
  ["golf", /(golf|links|green|putting)/i],
  ["equestrian", /(horse|equest|ippic|maneggio|dressage)/i],
  ["logistics", /(logistic|fleet|transport|spedizion|corriere)/i],
  ["photography", /(photo|foto|studio-foto|tattoo)/i],
  ["accounting", /(account|contab|fiscal|commercialista|invoice)/i],
  ["aiservices", /(^ai-|aiservice|agent|voice|ocr|automation)/i],
];

const SCREEN_DICTIONARY: Array<[string, RegExp]> = [
  ["home", /(home|hero|1-home|landing)/i],
  ["menu", /(menu|catalog|listino|services|servizi|rooms|courses|gallery|portfolio|fleet)/i],
  ["detail", /(detail|dettaglio|product|artist|case|project|course|invoice)/i],
  ["booking", /(book|prenot|reserv|checkout|schedule|calendar|order)/i],
  ["admin", /(admin|dashboard|kpi|deadlines|timeline|repairs|tracking|jobs)/i],
];

type Source = "catalog" | "generated" | "lowengeld" | "root" | "storage";

type MockupItem = {
  id: string;
  url: string;
  name: string;
  path: string;
  source: Source;
  sector: string;
  screen: string;
};

const classify = (haystack: string, dict: Array<[string, RegExp]>, fallback: string) =>
  dict.find(([, re]) => re.test(haystack))?.[0] ?? fallback;

const sourceOf = (path: string): Source => {
  if (path.includes("/catalog/")) return "catalog";
  if (path.includes("/generated/")) return "generated";
  if (path.includes("/portfolio-lowengeld/")) return "lowengeld";
  return "root";
};

function buildLocalItems(): MockupItem[] {
  const items: MockupItem[] = [];

  for (const [path, url] of Object.entries(localImages)) {
    const name = path.split("/").pop() ?? path;
    items.push({
      id: `local:${path}`,
      url,
      name,
      path: path.replace("/src/assets/mockups/", ""),
      source: sourceOf(path),
      sector: classify(path, SECTOR_DICTIONARY, "altro"),
      screen: classify(name, SCREEN_DICTIONARY, "altro"),
    });
  }

  for (const [path, pointer] of Object.entries(localPointers)) {
    if (!pointer?.url) continue;
    const name = pointer.original_filename ?? path.split("/").pop() ?? path;
    items.push({
      id: `pointer:${path}`,
      url: pointer.url,
      name,
      path: path.replace("/src/assets/mockups/", ""),
      source: sourceOf(path),
      sector: classify(path, SECTOR_DICTIONARY, "altro"),
      screen: classify(name, SCREEN_DICTIONARY, "altro"),
    });
  }

  return items;
}

async function listBucketImages(bucket: string): Promise<MockupItem[]> {
  const out: MockupItem[] = [];
  const stack: string[] = [""];
  while (stack.length) {
    const prefix = stack.pop()!;
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit: 1000, sortBy: { column: "updated_at", order: "desc" } });
    if (error) break;
    for (const item of data ?? []) {
      const full = prefix ? `${prefix}/${item.name}` : item.name;
      if (!item.id) {
        stack.push(full);
        continue;
      }
      if (!/\.(png|jpe?g|webp|avif|gif)$/i.test(item.name)) continue;
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(full);
      out.push({
        id: `storage:${bucket}:${full}`,
        url: pub.publicUrl,
        name: item.name,
        path: `${bucket}/${full}`,
        source: "storage",
        sector: classify(full, SECTOR_DICTIONARY, "altro"),
        screen: classify(item.name, SCREEN_DICTIONARY, "altro"),
      });
    }
  }
  return out;
}

/* ------------------------------------------------------------------- state */

const STORAGE_KEY = "empire.mockup.curation.v1";

type Verdict = "keep" | "drop";

const loadVerdicts = (): Record<string, Verdict> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
};

const SECTOR_TARGET = 20;

const MockupCurationPage = () => {
  const [storageItems, setStorageItems] = useState<MockupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sector, setSector] = useState("all");
  const [source, setSource] = useState<"all" | Source>("all");
  const [screen, setScreen] = useState("all");
  const [view, setView] = useState<"all" | "keep" | "drop" | "todo">("all");
  const [search, setSearch] = useState("");
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>(loadVerdicts);
  const [preview, setPreview] = useState<MockupItem | null>(null);

  const localItems = useMemo(buildLocalItems, []);

  const loadStorage = useCallback(async () => {
    setLoading(true);
    try {
      const all = await Promise.all(
        STORAGE_BUCKETS.map(b => listBucketImages(b).catch(() => [] as MockupItem[])),
      );
      setStorageItems(all.flat());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStorage(); }, [loadStorage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(verdicts));
  }, [verdicts]);

  const items = useMemo(
    () => [...localItems, ...storageItems].sort((a, b) => a.sector.localeCompare(b.sector) || a.name.localeCompare(b.name)),
    [localItems, storageItems],
  );

  const sectors = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach(i => map.set(i.sector, (map.get(i.sector) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);

  const keptBySector = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach(i => {
      if (verdicts[i.id] === "keep") map.set(i.sector, (map.get(i.sector) ?? 0) + 1);
    });
    return map;
  }, [items, verdicts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(i => {
      if (sector !== "all" && i.sector !== sector) return false;
      if (source !== "all" && i.source !== source) return false;
      if (screen !== "all" && i.screen !== screen) return false;
      const v = verdicts[i.id];
      if (view === "keep" && v !== "keep") return false;
      if (view === "drop" && v !== "drop") return false;
      if (view === "todo" && v) return false;
      if (q && !i.path.toLowerCase().includes(q) && !i.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, sector, source, screen, view, verdicts, search]);

  const setVerdict = (id: string, v: Verdict | null) =>
    setVerdicts(prev => {
      const next = { ...prev };
      if (!v || next[id] === v) delete next[id];
      else next[id] = v;
      return next;
    });

  const keptCount = Object.values(verdicts).filter(v => v === "keep").length;
  const droppedCount = Object.values(verdicts).filter(v => v === "drop").length;

  const exportSelection = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      target_per_sector: SECTOR_TARGET,
      keep: items.filter(i => verdicts[i.id] === "keep").map(({ id, sector, screen, path, url }) => ({ id, sector, screen, path, url })),
      drop: items.filter(i => verdicts[i.id] === "drop").map(({ id, sector, path }) => ({ id, sector, path })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mockup-selection-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast({ title: "Selezione esportata", description: `${payload.keep.length} da tenere · ${payload.drop.length} scartati` });
  };

  const bulk = (v: Verdict) => {
    setVerdicts(prev => {
      const next = { ...prev };
      filtered.forEach(i => { next[i.id] = v; });
      return next;
    });
    toast({ title: v === "keep" ? "Tutti tenuti" : "Tutti scartati", description: `${filtered.length} mockup nel filtro corrente` });
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white pb-24">
      <div className="px-4 pt-4">
        <BackButton />
      </div>

      <header className="px-4 pt-4">
        <h1 className="text-2xl font-bold tracking-tight">Galleria confronto mockup</h1>
        <p className="mt-1 text-sm text-white/60">
          Tutti i mockup del sistema: creati, scaricati, in asset e negli storage. Seleziona le migliori
          {" "}{SECTOR_TARGET} varianti per settore.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Badge variant="outline" className="border-white/20 text-white/80">{items.length} totali</Badge>
          <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">{keptCount} da tenere</Badge>
          <Badge className="bg-red-500/15 text-red-300 border border-red-400/30">{droppedCount} scartati</Badge>
          <Badge variant="outline" className="border-white/20 text-white/60">{sectors.length} settori</Badge>
        </div>
      </header>

      <div className="sticky top-0 z-20 mt-4 space-y-3 border-b border-white/10 bg-[#0b0d12]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cerca nome o percorso…"
              className="h-11 border-white/15 bg-white/5 pl-8 text-white placeholder:text-white/40"
            />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 border-white/15" onClick={loadStorage}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button className="h-11 bg-emerald-500 text-black hover:bg-emerald-400" onClick={exportSelection}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "todo", "keep", "drop"] as const).map(v => (
            <Button
              key={v}
              size="sm"
              variant={view === v ? "default" : "outline"}
              className={view === v ? "bg-white text-black" : "border-white/15 text-white/70"}
              onClick={() => setView(v)}
            >
              {v === "all" ? "Tutti" : v === "todo" ? "Da valutare" : v === "keep" ? "Tenuti" : "Scartati"}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button
            size="sm"
            variant={sector === "all" ? "default" : "outline"}
            className={sector === "all" ? "bg-white text-black" : "border-white/15 text-white/70"}
            onClick={() => setSector("all")}
          >
            Tutti i settori
          </Button>
          {sectors.map(([s, count]) => {
            const kept = keptBySector.get(s) ?? 0;
            return (
              <Button
                key={s}
                size="sm"
                variant={sector === s ? "default" : "outline"}
                className={sector === s ? "bg-white text-black" : "border-white/15 text-white/70"}
                onClick={() => setSector(s)}
              >
                {s}
                <span className="ml-1 text-[10px] opacity-70">
                  {kept}/{SECTOR_TARGET} · {count}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "catalog", "generated", "lowengeld", "root", "storage"] as const).map(s => (
            <Button
              key={s}
              size="sm"
              variant={source === s ? "secondary" : "outline"}
              className={source === s ? "" : "border-white/15 text-white/60"}
              onClick={() => setSource(s)}
            >
              {s === "all" ? "Tutte le fonti" : s}
            </Button>
          ))}
          {["all", ...SCREEN_DICTIONARY.map(([k]) => k), "altro"].map(s => (
            <Button
              key={`screen-${s}`}
              size="sm"
              variant={screen === s ? "secondary" : "outline"}
              className={screen === s ? "" : "border-white/15 text-white/60"}
              onClick={() => setScreen(s)}
            >
              {s === "all" ? "Tutte le schermate" : s}
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-white/50">
          <span className="flex items-center gap-1">
            <LayoutGrid className="h-3.5 w-3.5" /> {filtered.length} risultati
          </span>
          <span className="flex gap-2">
            <button className="underline decoration-dotted" onClick={() => bulk("keep")}>tieni tutti</button>
            <button className="underline decoration-dotted" onClick={() => bulk("drop")}>scarta tutti</button>
          </span>
        </div>
      </div>

      {loading && storageItems.length === 0 && (
        <div className="flex items-center gap-2 px-4 py-6 text-sm text-white/50">
          <Loader2 className="h-4 w-4 animate-spin" /> Carico gli storage…
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 px-4 pt-4 sm:grid-cols-3 lg:grid-cols-5">
        {filtered.map(item => {
          const v = verdicts[item.id];
          return (
            <Card
              key={item.id}
              className={`overflow-hidden border bg-white/[0.03] p-0 transition ${
                v === "keep"
                  ? "border-emerald-400/60 ring-1 ring-emerald-400/40"
                  : v === "drop"
                    ? "border-red-400/40 opacity-50"
                    : "border-white/10"
              }`}
            >
              <button
                type="button"
                className="block w-full"
                onClick={() => setPreview(item)}
                aria-label={`Apri ${item.name}`}
              >
                <img
                  src={item.url}
                  alt={item.name}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover"
                />
              </button>
              <div className="space-y-1 p-2">
                <p className="truncate text-[11px] font-medium text-white/85">{item.name}</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="border-white/15 px-1 py-0 text-[9px] text-white/60">{item.sector}</Badge>
                  <Badge variant="outline" className="border-white/15 px-1 py-0 text-[9px] text-white/50">{item.screen}</Badge>
                </div>
                <div className="flex gap-1 pt-1">
                  <Button
                    size="sm"
                    className={`h-9 flex-1 ${v === "keep" ? "bg-emerald-500 text-black" : "bg-white/10 text-white/80 hover:bg-white/20"}`}
                    onClick={() => setVerdict(item.id, "keep")}
                  >
                    {v === "keep" ? <Check className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    className={`h-9 flex-1 ${v === "drop" ? "bg-red-500 text-white" : "bg-white/10 text-white/80 hover:bg-white/20"}`}
                    onClick={() => setVerdict(item.id, "drop")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="px-4 py-10 text-center text-sm text-white/50">Nessun mockup con questi filtri.</p>
      )}

      <Dialog open={!!preview} onOpenChange={open => !open && setPreview(null)}>
        <DialogContent className="max-w-[96vw] border-white/10 bg-[#07080c] p-2 sm:max-w-3xl">
          {preview && (
            <div className="space-y-3">
              <img src={preview.url} alt={preview.name} className="max-h-[75vh] w-full object-contain" />
              <div className="flex items-center justify-between gap-2 px-1 pb-1">
                <div className="min-w-0">
                  <p className="truncate text-sm text-white/85">{preview.name}</p>
                  <p className="truncate text-[11px] text-white/45">{preview.path}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-emerald-500 text-black hover:bg-emerald-400"
                    onClick={() => { setVerdict(preview.id, "keep"); setPreview(null); }}
                  >
                    <Check className="mr-1 h-4 w-4" /> Tieni
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-400/40 text-red-300"
                    onClick={() => { setVerdict(preview.id, "drop"); setPreview(null); }}
                  >
                    <X className="mr-1 h-4 w-4" /> Scarta
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MockupCurationPage;
