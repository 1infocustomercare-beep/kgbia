import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ExternalLink, Copy, Trash2, Smartphone, Eye, Loader2, X } from "lucide-react";
import { useMockupSuiteVault } from "@/hooks/useMockupSuiteVault";
import { toast } from "sonner";

type SortKey = "recent" | "most_viewed" | "az";

const ENGINE_LABELS: Record<string, string> = {
  react: "React",
  nano_banana: "Nano Banana",
  nano_banana_pro: "Nano Banana Pro",
};

export function MockupSuiteVaultList() {
  const { suites, loading, deleteSuite } = useMockupSuiteVault();
  const [search, setSearch] = useState("");
  const [filterSector, setFilterSector] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [filterEngine, setFilterEngine] = useState("all");
  const [filterTemplate, setFilterTemplate] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("recent");

  const sectors = useMemo(() => {
    const s = new Set<string>();
    suites.forEach(x => x.business_sector && s.add(x.business_sector));
    return Array.from(s).sort();
  }, [suites]);

  const cities = useMemo(() => {
    const s = new Set<string>();
    suites.forEach(x => x.business_city && s.add(x.business_city));
    return Array.from(s).sort();
  }, [suites]);

  const engines = useMemo(() => {
    const s = new Set<string>();
    suites.forEach(x => x.engine && s.add(x.engine));
    return Array.from(s).sort();
  }, [suites]);

  const templates = useMemo(() => {
    const s = new Set<string>();
    suites.forEach(x => x.template_variant && s.add(x.template_variant));
    return Array.from(s).sort();
  }, [suites]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return suites
      .filter(s => filterSector === "all" || s.business_sector === filterSector)
      .filter(s => filterCity === "all" || s.business_city === filterCity)
      .filter(s => filterEngine === "all" || s.engine === filterEngine)
      .filter(s => filterTemplate === "all" || s.template_variant === filterTemplate)
      .filter(s => !term ||
        s.business_name.toLowerCase().includes(term) ||
        (s.business_sector || "").toLowerCase().includes(term) ||
        (s.business_city || "").toLowerCase().includes(term) ||
        (s.template_variant || "").toLowerCase().includes(term)
      )
      .sort((a, b) => {
        if (sortBy === "most_viewed") return (b.view_count || 0) - (a.view_count || 0);
        if (sortBy === "az") return a.business_name.localeCompare(b.business_name);
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }, [suites, search, filterSector, filterCity, filterEngine, filterTemplate, sortBy]);

  const copyShare = (slug: string | null) => {
    if (!slug) return toast.error("Link non disponibile");
    const url = `${window.location.origin}/preview/mockup/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiato!");
  };

  const openShare = (slug: string | null) => {
    if (!slug) return;
    window.open(`${window.location.origin}/preview/mockup/${slug}`, "_blank");
  };

  const hasActiveFilters = filterSector !== "all" || filterCity !== "all" || filterEngine !== "all" || filterTemplate !== "all" || search;
  const resetFilters = () => {
    setSearch(""); setFilterSector("all"); setFilterCity("all"); setFilterEngine("all"); setFilterTemplate("all");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Mockup iPhone Generati ({filtered.length}{hasActiveFilters && filtered.length !== suites.length ? ` di ${suites.length}` : ""})
        </h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}><X className="h-3 w-3 mr-1" />Reset</Button>
        )}
      </div>

      {/* Search + Filters */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca per nome attività, settore, città, template…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            <Select value={filterSector} onValueChange={setFilterSector}>
              <SelectTrigger><SelectValue placeholder="Settore" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i settori</SelectItem>
                {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger><SelectValue placeholder="Città" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le città</SelectItem>
                {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterEngine} onValueChange={setFilterEngine}>
              <SelectTrigger><SelectValue placeholder="Engine" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i motori</SelectItem>
                {engines.map(e => <SelectItem key={e} value={e}>{ENGINE_LABELS[e] || e}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterTemplate} onValueChange={setFilterTemplate}>
              <SelectTrigger><SelectValue placeholder="Template" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i template</SelectItem>
                {templates.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Più recenti</SelectItem>
                <SelectItem value="most_viewed">Più visti</SelectItem>
                <SelectItem value="az">A → Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      {loading ? (
        <Card><CardContent className="pt-6 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="pt-6 text-center text-muted-foreground text-sm">
          {suites.length === 0
            ? "Nessun mockup ancora generato. Usa il generatore qui sopra per creare la prima suite."
            : "Nessun mockup corrisponde ai filtri attivi."}
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => {
            const screens: any[] = Array.isArray(s.screens) ? s.screens : (s.screens?.screens || []);
            const firstScreen = screens?.[0];
            const screenUrl = typeof firstScreen === "string" ? firstScreen : (firstScreen?.image_url || firstScreen?.url);
            return (
              <Card key={s.id} className="overflow-hidden">
                <div className="h-40 relative flex items-end justify-center gap-1.5 p-2 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${s.primary_color || "#a78bfa"}30, rgba(10,10,20,0.85))` }}>
                  {screens.slice(0, 3).map((sc: any, i: number) => {
                    const url = typeof sc === "string" ? sc : (sc?.image_url || sc?.url);
                    if (!url) return null;
                    return (
                      <div key={i} className={`${i === 1 ? "w-[60px] h-[120px]" : "w-[48px] h-[96px]"} rounded-lg overflow-hidden border border-white/15 shrink-0 bg-black`}>
                        <img src={url} alt="" className="w-full h-full object-cover object-top" loading="lazy" />
                      </div>
                    );
                  })}
                  {screens.length === 0 && (
                    <Smartphone className="h-10 w-10 text-white/50" />
                  )}
                  {s.status !== "complete" && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      {s.status === "generating" && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
                      {s.status}
                    </div>
                  )}
                </div>
                <CardContent className="pt-3 space-y-2">
                  <div>
                    <p className="font-semibold text-sm line-clamp-1">{s.business_name}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {[s.business_sector, s.business_city].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {s.engine && <Badge variant="outline" className="text-[9px]">{ENGINE_LABELS[s.engine] || s.engine}</Badge>}
                    {s.template_variant && <Badge variant="secondary" className="text-[9px]">{s.template_variant}</Badge>}
                    <Badge variant="secondary" className="text-[9px]"><Eye className="h-2.5 w-2.5 mr-1" />{s.view_count || 0}</Badge>
                  </div>
                  <div className="flex gap-1 pt-1">
                    {s.share_slug && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => openShare(s.share_slug)} className="flex-1">
                          <ExternalLink className="h-3 w-3 mr-1" /> Apri
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => copyShare(s.share_slug)} title="Copia link">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => deleteSuite(s.id)} className="text-destructive" title="Elimina">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
