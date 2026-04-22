import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, ExternalLink, Copy, Trash2, Smartphone, Eye, Loader2, X, Maximize2, Rocket, CopyPlus, Download } from "lucide-react";
import { useMockupSuiteVault, type VaultMockupSuite } from "@/hooks/useMockupSuiteVault";
import { MockupSuiteViewer, type SuiteScreen } from "./MockupSuiteViewer";
import { GenerateSiteFromMockupDialog } from "./GenerateSiteFromMockupDialog";
import { toast } from "sonner";

type SortKey = "recent" | "most_viewed" | "az";

const ENGINE_LABELS: Record<string, string> = {
  react: "React",
  nano_banana: "Nano Banana",
  nano_banana_pro: "Nano Banana Pro",
};

function normalizeScreens(raw: any): SuiteScreen[] {
  const arr = Array.isArray(raw) ? raw : (raw?.screens || []);
  return arr.map((sc: any, i: number): SuiteScreen => {
    if (typeof sc === "string") {
      return { type: ["home", "menu", "booking", "profile"][i] || `screen_${i}`, title: `Screen ${i + 1}`, image_url: sc, render_mode: "ai" };
    }
    return {
      type: sc?.type || ["home", "menu", "booking", "profile"][i] || `screen_${i}`,
      title: sc?.title || `Screen ${i + 1}`,
      image_url: sc?.image_url || sc?.url || null,
      render_mode: sc?.render_mode || (sc?.image_url ? "ai" : "react"),
      template_variant: sc?.template_variant,
      engine: sc?.engine,
    };
  });
}

export function MockupSuiteVaultList() {
  const { suites, loading, deleteSuite, duplicateSuite } = useMockupSuiteVault();
  const [search, setSearch] = useState("");
  const [filterSector, setFilterSector] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [filterEngine, setFilterEngine] = useState("all");
  const [filterTemplate, setFilterTemplate] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [openSuite, setOpenSuite] = useState<VaultMockupSuite | null>(null);
  const [generateSiteSuite, setGenerateSiteSuite] = useState<VaultMockupSuite | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

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

  const copyShare = (e: React.MouseEvent, slug: string | null) => {
    e.stopPropagation();
    if (!slug) return toast.error("Link non disponibile");
    navigator.clipboard.writeText(`${window.location.origin}/preview/mockup/${slug}`);
    toast.success("Link copiato!");
  };
  const openShare = (e: React.MouseEvent, slug: string | null) => {
    e.stopPropagation();
    if (!slug) return;
    window.open(`${window.location.origin}/preview/mockup/${slug}`, "_blank");
  };
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteSuite(id);
  };

  const handleDuplicate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setBusyId(id);
    try { await duplicateSuite(id); } finally { setBusyId(null); }
  };

  const sanitize = (s: string) =>
    (s || "mockup").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) || "mockup";

  const handleDownloadAll = async (e: React.MouseEvent, suite: VaultMockupSuite) => {
    e.stopPropagation();
    const screens = normalizeScreens(suite.screens).filter(sc => sc.image_url);
    if (screens.length === 0) {
      toast.error("Nessuna immagine scaricabile per questa suite");
      return;
    }
    setBusyId(suite.id);
    const base = sanitize(suite.business_name);
    const labels = ["home", "menu", "booking", "profile"];
    toast.info(`Scarico ${screens.length} schermate…`);
    try {
      for (let i = 0; i < screens.length; i++) {
        const sc = screens[i];
        const url = sc.image_url as string;
        try {
          const res = await fetch(url, { mode: "cors" });
          const blob = await res.blob();
          const ext = (blob.type.split("/")[1] || "png").split("+")[0];
          const filename = `${base}-${labels[i] || sc.type || `screen-${i + 1}`}.${ext}`;
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
          // small delay so browsers don't block bulk downloads
          await new Promise(r => setTimeout(r, 350));
        } catch {
          // CORS fallback: open in new tab
          window.open(url, "_blank");
        }
      }
      toast.success("Download completato");
    } finally {
      setBusyId(null);
    }
  };

  const hasActiveFilters = filterSector !== "all" || filterCity !== "all" || filterEngine !== "all" || filterTemplate !== "all" || search;
  const resetFilters = () => {
    setSearch(""); setFilterSector("all"); setFilterCity("all"); setFilterEngine("all"); setFilterTemplate("all");
  };

  const openScreens = openSuite ? normalizeScreens(openSuite.screens) : [];

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

      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cerca per nome, settore, città, template…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
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

      {loading ? (
        <Card><CardContent className="pt-6 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="pt-6 text-center text-muted-foreground text-sm">
          {suites.length === 0 ? "Nessun mockup ancora generato." : "Nessun mockup corrisponde ai filtri attivi."}
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(s => {
            const screens = normalizeScreens(s.screens);
            const accent = s.primary_color || "#a78bfa";
            return (
              <Card
                key={s.id}
                className="overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-0.5 group"
                onClick={() => setOpenSuite(s)}
              >
                {/* Apple-style hero — 4 iPhone allineati senza sovrapposizioni */}
                <div
                  className="relative px-4 pt-6 pb-4 overflow-hidden"
                  style={{
                    background: `radial-gradient(ellipse at top, ${accent}28 0%, transparent 60%), linear-gradient(180deg, hsl(var(--background)) 0%, ${accent}08 100%)`,
                    minHeight: 220,
                  }}
                >
                  {/* Glow di sfondo */}
                  <div
                    className="absolute inset-x-8 top-2 h-32 rounded-full blur-3xl opacity-30 transition-opacity group-hover:opacity-50"
                    style={{ background: accent }}
                  />

                  <div className="relative flex items-end justify-center gap-2.5 h-[180px]">
                    {screens.slice(0, 4).map((sc, i) => {
                      const url = sc.image_url;
                      // Sizing scalettato Apple-style: i centrali leggermente più alti
                      const heights = [160, 175, 175, 160];
                      const widths = [70, 76, 76, 70];
                      return (
                        <div
                          key={i}
                          className="relative rounded-[14px] overflow-hidden bg-background shadow-lg transition-transform group-hover:scale-[1.02]"
                          style={{
                            width: widths[i] || 70,
                            height: heights[i] || 160,
                            border: `1.5px solid hsl(var(--foreground) / 0.12)`,
                            transitionDelay: `${i * 30}ms`,
                          }}
                        >
                          {/* Dynamic Island */}
                          <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[28px] h-[7px] bg-black rounded-full z-10" />
                          {url ? (
                            <img src={url} alt={sc.title} className="w-full h-full object-cover object-top" loading="lazy" />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-[8px] font-semibold uppercase tracking-wider"
                              style={{ background: `linear-gradient(160deg, ${accent}, ${accent}80)`, color: "#fff" }}
                            >
                              {sc.title}
                            </div>
                          )}
                          {/* Home indicator */}
                          <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[24px] h-[2px] bg-foreground/30 rounded-full" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Stato */}
                  {s.status !== "complete" && (
                    <div className="absolute top-3 right-3 bg-yellow-500/90 backdrop-blur text-white text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                      {s.status === "generating" && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
                      {s.status}
                    </div>
                  )}

                  {/* Hover hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/30 backdrop-blur-[2px]">
                    <div className="bg-foreground text-background text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
                      <Maximize2 className="h-3 w-3" /> Apri fullscreen
                    </div>
                  </div>
                </div>

                <CardContent className="pt-3.5 pb-3.5 space-y-2.5">
                  <div>
                    <p className="font-semibold text-sm line-clamp-1">{s.business_name}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {[s.business_sector, s.business_city].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {s.engine && <Badge variant="outline" className="text-[9px] h-5">{ENGINE_LABELS[s.engine] || s.engine}</Badge>}
                    {s.template_variant && <Badge variant="secondary" className="text-[9px] h-5">{s.template_variant}</Badge>}
                    <Badge variant="secondary" className="text-[9px] h-5"><Eye className="h-2.5 w-2.5 mr-0.5" />{s.view_count || 0}</Badge>
                  </div>
                  <div className="flex gap-1 pt-0.5">
                    {s.share_slug && (
                      <Button variant="outline" size="sm" onClick={(e) => openShare(e, s.share_slug)} className="flex-1 h-8 text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" /> Link
                      </Button>
                    )}
                    {s.share_slug && (
                      <Button variant="ghost" size="sm" onClick={(e) => copyShare(e, s.share_slug)} title="Copia link" className="h-8 w-8 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDownloadAll(e, s)}
                      title="Scarica tutte le schermate"
                      className="h-8 w-8 p-0"
                      disabled={busyId === s.id}
                    >
                      {busyId === s.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDuplicate(e, s.id)}
                      title="Duplica mockup"
                      className="h-8 w-8 p-0"
                      disabled={busyId === s.id}
                    >
                      <CopyPlus className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => handleDelete(e, s.id)} className="text-destructive h-8 w-8 p-0" title="Elimina">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  {s.status === "complete" && (
                    <Button
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setGenerateSiteSuite(s); }}
                      className="w-full h-8 text-xs bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground"
                      title="Genera sito demo completo replica 1:1 di questo mockup"
                    >
                      <Rocket className="h-3 w-3 mr-1" /> Genera sito demo completo
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN VIEWER */}
      <Dialog open={!!openSuite} onOpenChange={(o) => !o && setOpenSuite(null)}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              {openSuite?.business_name}
              {openSuite?.business_city && (
                <span className="text-sm font-normal text-muted-foreground">· {openSuite.business_city}</span>
              )}
            </DialogTitle>
          </DialogHeader>
          {openSuite && openScreens.length > 0 && (
            <div className="pt-2">
              <MockupSuiteViewer
                screens={openScreens}
                templateVariant={openSuite.template_variant || "modern_dark"}
                businessName={openSuite.business_name}
                businessSector={openSuite.business_sector || ""}
                businessCity={openSuite.business_city || ""}
                primaryColor={openSuite.primary_color || "#C8963E"}
                suiteId={openSuite.id}
              />
              <div className="mt-5 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Rocket className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Trasforma in sito demo completo</p>
                    <p className="text-xs text-muted-foreground">
                      Replica 1:1 di questo design con tutti gli agenti AI, automazioni e moduli del settore. Pronto da mostrare al cliente.
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => { if (openSuite) { setGenerateSiteSuite(openSuite); setOpenSuite(null); } }}
                >
                  <Rocket className="h-4 w-4 mr-2" /> Genera Sito Demo Completo (25 crediti)
                </Button>
              </div>
              {openSuite.share_slug && (
                <div className="mt-3 flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={(e) => openShare(e, openSuite.share_slug)}>
                    <ExternalLink className="h-4 w-4 mr-2" /> Apri pagina pubblica
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => copyShare(e, openSuite.share_slug)}>
                    <Copy className="h-4 w-4 mr-2" /> Copia link
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog generazione sito demo completo dal mockup */}
      <GenerateSiteFromMockupDialog
        open={!!generateSiteSuite}
        onOpenChange={(o) => !o && setGenerateSiteSuite(null)}
        suite={generateSiteSuite}
      />
    </div>
  );
}
