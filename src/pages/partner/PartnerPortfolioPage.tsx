import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, X as XIcon, Globe, LayoutDashboard, Pencil, Upload, Save,
  RefreshCw, ChevronRight, Smartphone, Sparkles, Layers, Star, Trash2,
  Play, ExternalLink, MessageCircle, Rocket, Wand2, SlidersHorizontal,
} from "lucide-react";
import PartnerFlowStepper from "@/components/partner/PartnerFlowStepper";
import { TutorialPopup } from "@/components/ui/tutorial-popup";

/* ─────────────────────────────────────────────────────────────────────────
 * Mockup helpers — descrizione smart + estrazione screens
 * ─────────────────────────────────────────────────────────────────────── */

// Ordine logico delle sezioni di un mockup iPhone (stesso del template ufficiale)
const SCREEN_TYPE_ORDER = [
  "home", "menu", "gallery", "rooms", "services", "fleet",
  "booking", "reservation", "order", "checkout",
  "profile", "loyalty", "account", "contact", "about",
];

function sortScreens(screensArr: any[]): any[] {
  return [...screensArr].sort((a, b) => {
    const ai = SCREEN_TYPE_ORDER.indexOf((a?.type || "").toLowerCase());
    const bi = SCREEN_TYPE_ORDER.indexOf((b?.type || "").toLowerCase());
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function buildSmartMockupDescription(suite: {
  business_name: string;
  business_sector: string | null;
  business_city: string | null;
  template_variant: string | null;
  screens: any;
}): string {
  const arr: any[] = Array.isArray(suite.screens)
    ? suite.screens
    : suite.screens && typeof suite.screens === "object"
      ? Object.values(suite.screens)
      : [];
  const sorted = sortScreens(arr);
  const titles = sorted
    .map((s: any) => (s?.title || s?.type || "").toString().trim())
    .filter(Boolean);

  // 1) Se ci sono titoli → "Home · Menu · Galleria · Prenota" (max 5)
  if (titles.length > 0) {
    const sample = titles.slice(0, 5).map((t) =>
      t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(),
    );
    const more = titles.length > sample.length ? "…" : "";
    return `Suite mockup iPhone${suite.business_sector ? ` · ${suite.business_sector}` : ""} — ${sample.join(" · ")}${more}`;
  }

  // 2) Fallback: settore + città + variante
  const parts: string[] = [];
  if (suite.business_sector) parts.push(suite.business_sector);
  if (suite.business_city) parts.push(suite.business_city);
  if (suite.template_variant) parts.push(`stile ${suite.template_variant}`);
  if (parts.length > 0) {
    return `Mockup iPhone su misura per ${suite.business_name} — ${parts.join(" · ")}.`;
  }

  // 3) Fallback finale
  return `Mockup iPhone su misura generato dal venditore per ${suite.business_name}.`;
}
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { INDUSTRY_CONFIGS } from "@/config/industry-config";
import { PORTFOLIO_PROJECTS } from "@/data/portfolio-showcase-data";
import { SECTOR_PORTFOLIO } from "@/data/sector-mockup-images";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { usePartnerDemoRestaurant } from "@/hooks/usePartnerDemoRestaurant";
import { useDemoVault, type VaultDemo } from "@/hooks/useDemoVault";
import { useMockupSuiteVault } from "@/hooks/useMockupSuiteVault";
import { DemoStudioPresentationMode } from "@/components/partner/DemoStudioPresentationMode";
import ProjectDetailOverlay from "@/components/partner/ProjectDetailOverlay";
import PortfolioPublicShowcase from "@/components/partner/PortfolioPublicShowcase";
import { PartnerCardSkeleton } from "@/components/partner/PartnerSkeleton";
import PartnerSavedPreviewsSection from "@/components/partner/PartnerSavedPreviewsSection";
import { toast } from "sonner";

const getDemoSiteUrl = (sectorId: string) => {
  if (sectorId === "food") return "/r/impero-roma";
  if (sectorId === "ncc") return "/b/amalfi-luxury-transfer";
  const slug = DEMO_SLUGS[sectorId as keyof typeof DEMO_SLUGS] || sectorId;
  return `/demo/${slug}`;
};
const getDemoAdminUrl = (sectorId: string) => {
  if (sectorId === "food") return "/dashboard";
  if (sectorId === "ncc") return "/app";
  const slug = DEMO_SLUGS[sectorId as keyof typeof DEMO_SLUGS] || sectorId;
  return `/demo/${slug}/admin`;
};

const ALL_INDUSTRY_IDS = Object.keys(INDUSTRY_CONFIGS) as (keyof typeof INDUSTRY_CONFIGS)[];
const SECTOR_CARDS = ALL_INDUSTRY_IDS.map(key => {
  const config = INDUSTRY_CONFIGS[key];
  const project = PORTFOLIO_PROJECTS[key as keyof typeof PORTFOLIO_PROJECTS];
  const portfolio = SECTOR_PORTFOLIO.find(sp => sp.sectorId === key);
  const firstStyle = portfolio?.brands?.[0]?.styles?.[0];
  return {
    id: key, name: project?.name || config.label,
    description: project?.description || config.description,
    tags: project?.tags || [config.label],
    screens: firstStyle?.screens?.slice(0, 3) || [],
    accent: project?.accent || "#a78bfa", emoji: config.emoji,
  };
});

export default function PartnerPortfolioPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  // sectorSearch è gestito ora dentro PortfolioPublicShowcase (chips categoria + search interna)
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [detailProject, setDetailProject] = useState<string | null>(null);
  const [demoSectionEnabled, setDemoSectionEnabled] = useState(false);
  const [editingDemo, setEditingDemo] = useState(false);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#C8963E");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [savingDemo, setSavingDemo] = useState(false);
  const [resettingDemo, setResettingDemo] = useState(false);
  const logoFileRef = useRef<HTMLInputElement>(null);
  const { demoRestaurant, loading: demoLoading, refetch: refetchDemo } = usePartnerDemoRestaurant();

  /* ── Vault: mockup generati + siti demo generati ── */
  const demoVault = useDemoVault();
  const mockupVault = useMockupSuiteVault();
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [presentationInitialId, setPresentationInitialId] = useState<string | undefined>();
  const [vaultSearch, setVaultSearch] = useState("");

  // ── Filtri avanzati + ordinamento PERSISTENTE (localStorage) ──
  type MockupSort = "recent" | "az" | "screens" | "views";
  type SiteSort = "recent" | "az" | "favorites";
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterSector, setFilterSector] = useState<string>(() => localStorage.getItem("partner_portfolio_f_sector") || "all");
  const [filterVariant, setFilterVariant] = useState<string>(() => localStorage.getItem("partner_portfolio_f_variant") || "all");
  const [filterStatus, setFilterStatus] = useState<string>(() => localStorage.getItem("partner_portfolio_f_status") || "all");
  // Engine = come è stato generato (AI vs template preset). Persistente.
  const [filterEngine, setFilterEngine] = useState<string>(() => localStorage.getItem("partner_portfolio_f_engine") || "all");
  const [mockupSort, setMockupSort] = useState<MockupSort>(() => (localStorage.getItem("partner_portfolio_sort_mockup") as MockupSort) || "recent");
  const [siteSort, setSiteSort] = useState<SiteSort>(() => (localStorage.getItem("partner_portfolio_sort_site") as SiteSort) || "recent");

  useEffect(() => { localStorage.setItem("partner_portfolio_f_sector", filterSector); }, [filterSector]);
  useEffect(() => { localStorage.setItem("partner_portfolio_f_variant", filterVariant); }, [filterVariant]);
  useEffect(() => { localStorage.setItem("partner_portfolio_f_status", filterStatus); }, [filterStatus]);
  useEffect(() => { localStorage.setItem("partner_portfolio_f_engine", filterEngine); }, [filterEngine]);
  useEffect(() => { localStorage.setItem("partner_portfolio_sort_mockup", mockupSort); }, [mockupSort]);
  useEffect(() => { localStorage.setItem("partner_portfolio_sort_site", siteSort); }, [siteSort]);

  // Apertura automatica della modalità "Pronta da Mostrare" via ?present=1 (es. da Home Partner)
  useEffect(() => {
    if (searchParams.get("present") === "1") {
      setPresentationOpen(true);
      const next = new URLSearchParams(searchParams);
      next.delete("present");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Opzioni filtro derivate dai dati reali
  const sectorOptions = useMemo(() => {
    const set = new Set<string>();
    mockupVault.suites.forEach((s) => s.business_sector && set.add(s.business_sector));
    demoVault.demos.forEach((d) => d.sector && set.add(d.sector));
    return Array.from(set).sort();
  }, [mockupVault.suites, demoVault.demos]);

  const variantOptions = useMemo(() => {
    const set = new Set<string>();
    mockupVault.suites.forEach((s) => s.template_variant && set.add(s.template_variant));
    demoVault.demos.forEach((d: any) => d.template_variant && set.add(d.template_variant));
    return Array.from(set).sort();
  }, [mockupVault.suites, demoVault.demos]);

  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    mockupVault.suites.forEach((s) => s.status && set.add(s.status));
    return Array.from(set).sort();
  }, [mockupVault.suites]);

  const activeFiltersCount =
    (filterSector !== "all" ? 1 : 0) +
    (filterVariant !== "all" ? 1 : 0) +
    (filterStatus !== "all" ? 1 : 0) +
    (filterEngine !== "all" ? 1 : 0);

  const readyMockups = useMemo(() => {
    const list = mockupVault.suites
      .filter((s) => (filterStatus === "all" ? s.status === "complete" : s.status === filterStatus))
      .filter((s) => filterSector === "all" || s.business_sector === filterSector)
      .filter((s) => filterVariant === "all" || s.template_variant === filterVariant)
      .filter((s) => filterEngine === "all" || (s as any).generation_engine === filterEngine)
      .filter((s) => {
        if (!vaultSearch.trim()) return true;
        const q = vaultSearch.toLowerCase();
        return (
          s.business_name.toLowerCase().includes(q) ||
          (s.business_sector || "").toLowerCase().includes(q) ||
          (s.business_city || "").toLowerCase().includes(q)
        );
      });

    const screensCount = (s: any) =>
      Array.isArray(s.screens) ? s.screens.length :
        s.screens && typeof s.screens === "object" ? Object.keys(s.screens).length : 0;

    return list.sort((a, b) => {
      switch (mockupSort) {
        case "az": return a.business_name.localeCompare(b.business_name);
        case "screens": return screensCount(b) - screensCount(a);
        case "views": return (b.view_count || 0) - (a.view_count || 0);
        case "recent":
        default: return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
  }, [mockupVault.suites, vaultSearch, filterStatus, filterSector, filterVariant, filterEngine, mockupSort]);

  const generatedSites = useMemo(() => {
    const list = demoVault.demos
      .filter((d: any) => filterSector === "all" || d.sector === filterSector)
      .filter((d: any) => filterVariant === "all" || d.template_variant === filterVariant)
      .filter((d: any) => filterEngine === "all" || d.generation_engine === filterEngine)
      .filter((d) => {
        if (!vaultSearch.trim()) return true;
        const q = vaultSearch.toLowerCase();
        return (
          d.display_name.toLowerCase().includes(q) ||
          d.original_lead_name.toLowerCase().includes(q)
        );
      });

    return list.sort((a, b) => {
      switch (siteSort) {
        case "az": return a.display_name.localeCompare(b.display_name);
        case "favorites":
          if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1;
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case "recent":
        default: return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
  }, [demoVault.demos, vaultSearch, filterSector, filterVariant, filterEngine, siteSort]);

  const vaultStats = {
    mockupsReady: mockupVault.suites.filter((s) => s.status === "complete").length,
    sitesGenerated: demoVault.demos.length,
    favorites: demoVault.demos.filter((d) => d.is_favorite).length,
  };

  useEffect(() => {
    if (demoRestaurant) {
      setEditName(demoRestaurant.name);
      setEditColor(demoRestaurant.primary_color || "#C8963E");
    }
  }, [demoRestaurant]);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("profiles").select("demo_section_enabled").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if ((data as any)?.demo_section_enabled) setDemoSectionEnabled(true);
    });
  }, [user?.id]);

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !demoRestaurant) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File troppo grande", { description: "Il logo deve essere inferiore a 5 MB." });
      return;
    }
    setUploadingLogo(true);
    const task = (async () => {
      const ext = file.name.split(".").pop();
      const path = `${demoRestaurant.id}/logo.${ext}`;
      const { error: upErr } = await supabase.storage.from("restaurant-logos").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("restaurant-logos").getPublicUrl(path);
      const { error: updErr } = await supabase.from("restaurants")
        .update({ logo_url: urlData.publicUrl + "?t=" + Date.now() })
        .eq("id", demoRestaurant.id);
      if (updErr) throw updErr;
      refetchDemo();
    })();
    toast.promise(task, {
      loading: "Carico il logo…",
      success: "Logo aggiornato — visibile nella tua demo",
      error: (err: any) => err?.message || "Upload fallito, riprova.",
    });
    try { await task; } catch {} finally { setUploadingLogo(false); }
  };

  const handleSaveCustomization = async () => {
    if (!demoRestaurant || savingDemo) return;
    setSavingDemo(true);
    const task = (async () => {
      const { error } = await supabase.from("restaurants")
        .update({ name: editName.trim() || demoRestaurant.name, primary_color: editColor })
        .eq("id", demoRestaurant.id);
      if (error) throw error;
      setEditingDemo(false);
      refetchDemo();
    })();
    toast.promise(task, {
      loading: "Salvo le modifiche…",
      success: "Personalizzazione salvata ✨",
      error: (err: any) => err?.message || "Impossibile salvare, riprova.",
    });
    try { await task; } catch {} finally { setSavingDemo(false); }
  };

  const handleResetDemo = async () => {
    if (resettingDemo) return;
    setResettingDemo(true);
    const task = (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessione scaduta — accedi di nuovo");
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reset-partner-demo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Reset fallito sul server");
      }
      refetchDemo();
    })();
    toast.promise(task, {
      loading: "Resetto la demo ai valori di fabbrica…",
      success: "Demo resettata correttamente",
      error: (err: any) => err?.message || "Reset fallito, riprova.",
    });
    try { await task; } catch {} finally { setResettingDemo(false); }
  };

  // (matchesSectorSearch rimosso — la vetrina pubblica gestisce i propri filtri categoria)

  return (
    <div className="space-y-7 px-4 pt-6 pb-8 max-w-2xl lg:max-w-7xl mx-auto">
      {/* ═══ FLUSSO 3 STEP ═══ */}
      <PartnerFlowStepper currentStep="showcase" />

      {/* ═══ VETRINA PUBBLICA (stile Lowengeld) ═══
           Hero "Our Work / Portfolio" + chip categorie + grid card 2-iPhone.
           Tap su una card → apre l'overlay dettagli con tutte le schermate. */}
      <PortfolioPublicShowcase
        onSelect={(sectorId) => {
          setSelectedProject(sectorId);
          setDetailProject(sectorId);
        }}
      />

      <TutorialPopup
        id="portfolio-vetrina-v1"
        title="Vetrina · Pronta da Mostrare"
        accentColor="#34d399"
        position="bottom-right"
        steps={[
          { emoji: "📁", title: "Cosa trovi qui", description: "Tutto quello che hai già generato: demo automatici dai lead + mockup su misura. Catalogo unico, pronto da aprire davanti al cliente." },
          { emoji: "🔍", title: "Cerca e filtra", description: "Usa la ricerca per nome cliente o settore. Ordina per più recenti, più visti o A-Z." },
          { emoji: "📱", title: "Modalità Presentazione", description: "Tap sul mockup → 'Presenta'. Si apre fullscreen senza menu, perfetto per mostrare al cliente in trattativa." },
          { emoji: "✨", title: "Manca qualcosa?", description: "Se serve un mockup nuovo per UN cliente specifico, vai su 'Mockup su Misura'. Per scoprire NUOVI lead, vai su 'Caccia Lead'." },
        ]}
      />

      {/* ═══ DEMO CUSTOMIZATION ═══ */}
      {demoSectionEnabled && demoLoading && !demoRestaurant && (
        <PartnerCardSkeleton lines={3} />
      )}
      {demoSectionEnabled && selectedProject && !demoLoading && (
        <div className="p-5 rounded-2xl space-y-4" style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.12)" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Demo Personalizzata</h3>
            <button onClick={() => setEditingDemo(!editingDemo)} className="p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
              {editingDemo ? <XIcon className="w-3.5 h-3.5 text-muted-foreground" /> : <Pencil className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
          </div>

          <AnimatePresence>
            {editingDemo && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-medium text-muted-foreground">Nome Attività</label>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Es: Ristorante Da Mario"
                      className="w-full px-3 py-2 rounded-lg text-sm bg-white !text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-medium text-muted-foreground">Colore Brand</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent" style={{ border: "1px solid rgba(255,255,255,0.15)" }} />
                      {["#C8963E", "#1A1A2E", "#E74C3C", "#2ECC71", "#3498DB", "#8E44AD", "#ec4899", "#f97316"].map(c => (
                        <button key={c} onClick={() => setEditColor(c)} className={`w-6 h-6 rounded-lg ${editColor === c ? "scale-110 ring-2 ring-white" : ""}`} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-medium text-muted-foreground">Logo Cliente</label>
                    <input type="file" accept="image/*" ref={logoFileRef} onChange={handleUploadLogo} className="hidden" />
                    <button onClick={() => logoFileRef.current?.click()} disabled={uploadingLogo}
                      className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed text-xs text-muted-foreground" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                      <Upload className={`w-3.5 h-3.5 ${uploadingLogo ? "animate-pulse" : ""}`} />
                      {uploadingLogo ? "Caricamento..." : "Carica Logo"}
                    </button>
                  </div>
                  <button onClick={handleSaveCustomization} disabled={savingDemo}
                    className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2"
                    style={{ background: "#7c3aed", color: "#fff" }}>
                    <Save className={`w-3.5 h-3.5 ${savingDemo ? "animate-spin" : ""}`} />
                    {savingDemo ? "Salvataggio..." : "Salva"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-3">
            <a href={getDemoSiteUrl(selectedProject)} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl text-center" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
              <Globe className="w-5 h-5" style={{ color: "#34d399" }} />
              <span className="text-xs font-bold text-foreground">Sito Cliente</span>
            </a>
            <a href={getDemoAdminUrl(selectedProject)} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 rounded-xl text-center" style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)" }}>
              <LayoutDashboard className="w-5 h-5" style={{ color: "#a78bfa" }} />
              <span className="text-xs font-bold text-foreground">Dashboard</span>
            </a>
          </div>

          {demoRestaurant && selectedProject === "food" && (
            <div className="flex items-center justify-between">
              <p className="text-[9px] text-muted-foreground">PIN Cucina: <span className="font-mono font-bold text-foreground">1234</span></p>
              <button onClick={handleResetDemo} disabled={resettingDemo} className="flex items-center gap-1 text-[9px] px-2 py-1 rounded-lg text-muted-foreground" style={{ background: "rgba(255,255,255,0.05)" }}>
                <RefreshCw className={`w-3 h-3 ${resettingDemo ? "animate-spin" : ""}`} /> Reset
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
           VAULT — Mockup generati + Siti demo + Modalità presentazione
           Sostituisce la vecchia pagina /partner/demo-studio.
           ═══════════════════════════════════════════════════════════ */}
      <section className="partner-vault-panel rounded-2xl p-4 md:p-5 space-y-4"
        style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.12)" }}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-1">
            <p className="partner-eyebrow flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-violet-300" /> Vetrina Vendite</p>
            <h3 className="text-base md:text-lg font-display font-bold text-foreground">I tuoi mockup &amp; siti demo</h3>
            <p className="text-[11px] text-muted-foreground">
              Ogni sito demo è la replica 1:1 di un mockup approvato. Per generare un nuovo sito vai su{" "}
              <Link to="/partner/leads" className="text-amber-300 underline">Leads</Link>.
            </p>
          </div>
          <button
            onClick={() => { setPresentationInitialId(undefined); setPresentationOpen(true); }}
            disabled={vaultStats.mockupsReady === 0}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-violet-500/20 hover:from-violet-400 hover:to-fuchsia-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Pronta da Mostrare
          </button>
        </div>

        {/* Stats vault */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Mockup pronti", value: vaultStats.mockupsReady, color: "text-violet-300", icon: Smartphone },
            { label: "Siti generati", value: vaultStats.sitesGenerated, color: "text-emerald-300", icon: Layers },
            { label: "Preferiti", value: vaultStats.favorites, color: "text-amber-300", icon: Star },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="partner-soft-tile p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase text-muted-foreground tracking-wider">{s.label}</span>
                  <Icon className={`w-3 h-3 ${s.color}`} />
                </div>
                <div className={`text-xl font-display font-bold mt-1 ${s.color}`}>{s.value}</div>
              </div>
            );
          })}
        </div>

        {/* Search + filtri avanzati + ordinamento (persistenti) */}
        {(mockupVault.suites.length > 0 || demoVault.demos.length > 0) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                value={vaultSearch}
                onChange={(e) => setVaultSearch(e.target.value)}
                placeholder="Cerca per nome attività, settore o città..."
                className="flex-1 px-3 py-2 rounded-lg text-xs text-foreground placeholder:text-muted-foreground"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="relative px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                style={{
                  background: filtersOpen ? "rgba(167,139,250,0.18)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${filtersOpen ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.08)"}`,
                  color: filtersOpen ? "#c4b5fd" : "#9ca3af",
                }}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Filtri</span>
                {activeFiltersCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-violet-500 text-white text-[9px] font-bold leading-none">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* ─── Chip filtri attivi (sempre visibili, con dismiss singolo) ─── */}
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 flex-wrap"
              >
                {filterSector !== "all" && (
                  <FilterChip label="Settore" value={filterSector} onClear={() => setFilterSector("all")} />
                )}
                {filterVariant !== "all" && (
                  <FilterChip label="Template" value={filterVariant} onClear={() => setFilterVariant("all")} />
                )}
                {filterStatus !== "all" && (
                  <FilterChip label="Stato" value={filterStatus} onClear={() => setFilterStatus("all")} />
                )}
                {filterEngine !== "all" && (
                  <FilterChip
                    label="Engine"
                    value={filterEngine === "ai" ? "AI" : filterEngine === "template" ? "Template" : "Hybrid"}
                    onClear={() => setFilterEngine("all")}
                  />
                )}
                <button
                  onClick={() => {
                    setFilterSector("all"); setFilterVariant("all"); setFilterStatus("all"); setFilterEngine("all");
                  }}
                  className="ml-0.5 px-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 hover:bg-white/8 transition-colors"
                  style={{ color: "#c4b5fd", border: "1px dashed rgba(167,139,250,0.4)" }}
                >
                  <RefreshCw className="w-2.5 h-2.5" /> Reset rapido
                </button>
              </motion.div>
            )}

            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 rounded-xl space-y-3"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <FilterSelect label="Settore" value={filterSector} onChange={setFilterSector}
                        options={[{ value: "all", label: "Tutti i settori" }, ...sectorOptions.map((s) => ({ value: s, label: s }))]} />
                      <FilterSelect label="Template" value={filterVariant} onChange={setFilterVariant}
                        options={[{ value: "all", label: "Tutti i template" }, ...variantOptions.map((v) => ({ value: v, label: v }))]} />
                      <FilterSelect label="Stato mockup" value={filterStatus} onChange={setFilterStatus}
                        options={[{ value: "all", label: "Tutti gli stati" }, ...statusOptions.map((s) => ({ value: s, label: s }))]} />
                      <FilterSelect label="Engine generazione" value={filterEngine} onChange={setFilterEngine}
                        options={[
                          { value: "all", label: "Tutti gli engine" },
                          { value: "ai", label: "🤖 AI (scraping + generazione)" },
                          { value: "template", label: "🎨 Template (preset manuale)" },
                          { value: "hybrid", label: "🔀 Hybrid (AI + ritocchi)" },
                        ]} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5">
                      <FilterSelect label="Ordina mockup" value={mockupSort} onChange={(v) => setMockupSort(v as any)}
                        options={[
                          { value: "recent", label: "Più recenti" },
                          { value: "az", label: "A → Z" },
                          { value: "screens", label: "Più schermate" },
                          { value: "views", label: "Più visualizzati" },
                        ]} />
                      <FilterSelect label="Ordina siti demo" value={siteSort} onChange={(v) => setSiteSort(v as any)}
                        options={[
                          { value: "recent", label: "Più recenti" },
                          { value: "az", label: "A → Z" },
                          { value: "favorites", label: "Preferiti prima" },
                        ]} />
                    </div>
                    {activeFiltersCount > 0 && (
                      <button
                  onClick={() => {
                    setFilterSector("all"); setFilterVariant("all"); setFilterStatus("all"); setFilterEngine("all");
                  }}
                        className="text-[10px] text-violet-300 hover:text-violet-200 flex items-center gap-1"
                      >
                        <XIcon className="w-3 h-3" /> Pulisci filtri
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Mockup generati */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-violet-400" />
              Mockup pronti ({readyMockups.length})
            </h4>
            <Link to="/partner/custom-preview" className="text-[10px] text-violet-300 hover:text-violet-200 flex items-center gap-1">
              <Wand2 className="w-3 h-3" /> Nuovo mockup su misura
            </Link>
          </div>

          {readyMockups.length === 0 ? (
            <div className="p-5 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}>
              <Smartphone className="w-7 h-7 mx-auto mb-1.5 text-muted-foreground opacity-50" />
              <p className="text-[11px] text-muted-foreground">Nessun mockup approvato — creane uno in <span className="text-violet-300">Mockup su Misura</span>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {readyMockups.map((suite, i) => {
                const accent = suite.primary_color || "#a78bfa";
                const rawScreens: any[] = Array.isArray(suite.screens)
                  ? suite.screens
                  : suite.screens && typeof suite.screens === "object"
                    ? Object.values(suite.screens)
                    : [];
                const screensArr = sortScreens(rawScreens);
                const screenImgs = screensArr
                  .map((s: any) => s?.image_url || s?.url || s?.src)
                  .filter(Boolean) as string[];
                const screenTitles = screensArr
                  .map((s: any) => s?.title || s?.type)
                  .filter(Boolean) as string[];
                const variantTag = suite.template_variant
                  ? suite.template_variant.charAt(0).toUpperCase() + suite.template_variant.slice(1)
                  : null;
                const tags = [
                  suite.business_sector,
                  variantTag,
                  `${screenImgs.length} screen`,
                ].filter(Boolean) as string[];
                const description = buildSmartMockupDescription(suite);
                return (
                  <motion.div
                    key={suite.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-2xl overflow-hidden group transition-all"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${accent}30`,
                    }}
                  >
                    {/* Anteprima screens — sempre 4 mini-mockup per decidere a colpo d'occhio quale ripristinare */}
                    <div
                      className="p-3 flex gap-1.5 justify-center overflow-hidden h-[150px] items-end"
                      style={{ background: `linear-gradient(135deg, ${accent}20, rgba(10,10,20,0.9))` }}
                      title="Mini-anteprima delle 4 schermate principali"
                    >
                      {screenImgs.length === 0 && (
                        <div className="self-center text-[10px] text-white/80 flex flex-col items-center gap-1">
                          <Smartphone className="w-6 h-6" /> Nessuna anteprima
                        </div>
                      )}
                      {screenImgs.slice(0, 4).map((src, j) => (
                        <button
                          type="button"
                          key={j}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPresentationInitialId(suite.id);
                            setPresentationOpen(true);
                          }}
                          className="w-[52px] aspect-[9/19.5] rounded-[10px] overflow-hidden shrink-0 relative group/screen transition-transform hover:scale-105 hover:-translate-y-0.5 focus:outline-none focus:ring-2"
                          style={{ border: `1px solid ${accent}55`, boxShadow: `0 4px 12px ${accent}25` }}
                          aria-label={`Apri ${screenTitles[j] || `Schermata ${j + 1}`}`}
                        >
                          <img
                            src={src}
                            alt={screenTitles[j] || `Screen ${j + 1}`}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                          <span
                            className="absolute inset-x-0 bottom-0 px-1 py-0.5 text-[7px] font-bold uppercase tracking-wide text-white/90 truncate text-center"
                            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}
                          >
                            {screenTitles[j] || `#${j + 1}`}
                          </span>
                        </button>
                      ))}
                      {/* Indicatore "+N" se ci sono più di 4 schermate */}
                      {screenImgs.length > 4 && (
                        <div
                          className="self-end mb-1 px-1.5 py-0.5 rounded-md text-[8px] font-bold"
                          style={{ background: `${accent}30`, color: accent, border: `1px solid ${accent}55` }}
                        >
                          +{screenImgs.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Metadati ricchi (allineati a SECTOR_CARDS) */}
                    <div className="p-3.5 space-y-1.5">
                      <div className="flex gap-1.5 flex-wrap">
                        {tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[8px] font-semibold uppercase"
                            style={{ background: `${accent}25`, color: accent }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wide truncate flex items-center gap-1.5">
                        <span className="truncate">{suite.business_name}</span>
                        <EngineBadge engine={(suite as any).generation_engine} />
                      </h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-2">{description}</p>
                      <p className="text-[9px] text-muted-foreground/70 flex items-center gap-1.5 pt-0.5">
                        {suite.business_city && <span>{suite.business_city}</span>}
                        <span>·</span>
                        <span>{new Date(suite.updated_at).toLocaleDateString("it-IT")}</span>
                        {suite.view_count && suite.view_count > 0 ? (
                          <>
                            <span>·</span>
                            <span>{suite.view_count} view</span>
                          </>
                        ) : null}
                      </p>

                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => { setPresentationInitialId(suite.id); setPresentationOpen(true); }}
                          className="px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors"
                          style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}
                        >
                          <Play className="w-2.5 h-2.5 fill-current" /> Mostra
                        </button>
                        <Link
                          to="/partner/leads"
                          className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1 hover:bg-amber-500/20"
                          title="Genera sito 1:1 in Leads"
                        >
                          <Rocket className="w-2.5 h-2.5" /> Genera sito
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Siti demo generati */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Siti demo generati ({generatedSites.length})
          </h4>

          {generatedSites.length === 0 ? (
            <div className="p-5 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}>
              <Layers className="w-7 h-7 mx-auto mb-1.5 text-muted-foreground opacity-50" />
              <p className="text-[11px] text-muted-foreground">Nessun sito demo ancora generato — vai in Leads e usa “Genera Demo”.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {generatedSites.map((site) => (
                <DemoSiteRow
                  key={site.id}
                  site={site}
                  onToggleFav={() => demoVault.toggleFavorite(site.id, site.is_favorite)}
                  onArchive={async () => {
                    if (!confirm("Archiviare questo sito demo?")) return;
                    await demoVault.archiveDemo(site.id);
                    toast.success("Archiviato");
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ CATALOGO PREVIEW SALVATE (Custom Preview → 🔖 Portfolio) ═══ */}
      <PartnerSavedPreviewsSection />

      {/* La vetrina pubblica con search/filtri categoria è in cima alla pagina (PortfolioPublicShowcase). */}

      {/* ═══ DETAIL OVERLAY ═══ */}
      <AnimatePresence>
        {detailProject && <ProjectDetailOverlay sectorId={detailProject} onClose={() => setDetailProject(null)} />}
      </AnimatePresence>

      {/* ═══ MODALITÀ PRONTA DA MOSTRARE ═══ */}
      <DemoStudioPresentationMode
        open={presentationOpen}
        onClose={() => setPresentationOpen(false)}
        suites={mockupVault.suites}
        initialSuiteId={presentationInitialId}
      />
    </div>
  );
}

/* ─── Riga sito demo generato (riusabile dentro il vault) ─── */
function DemoSiteRow({
  site,
  onToggleFav,
  onArchive,
}: {
  site: VaultDemo;
  onToggleFav: () => void;
  onArchive: () => void;
}) {
  // Estrae fino a 4 mini-anteprime dagli screen disponibili nel payload
  const screenThumbs = useMemo<{ src: string; label: string }[]>(() => {
    const candidates: any[] = [
      site.images_payload,
      (site.brand_payload as any)?.screens,
      (site.full_result as any)?.screens,
      (site.full_result as any)?.mockup?.screens,
      (site.lead_snapshot as any)?.screens,
    ];
    const collected: { src: string; label: string }[] = [];
    const seen = new Set<string>();
    for (const c of candidates) {
      if (!c) continue;
      const arr = Array.isArray(c) ? c : typeof c === "object" ? Object.values(c) : [];
      for (const item of arr) {
        const src =
          typeof item === "string"
            ? item
            : (item as any)?.image_url || (item as any)?.url || (item as any)?.src || (item as any)?.preview_url;
        if (!src || typeof src !== "string" || seen.has(src)) continue;
        seen.add(src);
        const label =
          (typeof item === "object" && ((item as any)?.title || (item as any)?.type || (item as any)?.name)) ||
          `#${collected.length + 1}`;
        collected.push({ src, label: String(label) });
        if (collected.length >= 4) break;
      }
      if (collected.length >= 4) break;
    }
    return collected;
  }, [site]);

  const accent = "#a78bfa";

  return (
    <div className="p-3 rounded-xl space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h5 className="text-xs font-semibold text-foreground truncate">{site.display_name}</h5>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase">ready</span>
            <EngineBadge engine={(site as any).generation_engine} />
          </div>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            {site.sector?.toUpperCase()}
            {site.template_variant ? ` · ${site.template_variant}` : ""}
            {" · "}{new Date(site.created_at).toLocaleDateString("it-IT")}
          </p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={onToggleFav} className="p-1 rounded hover:bg-white/5" aria-label="Preferito">
            <Star className={`w-3 h-3 ${site.is_favorite ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
          </button>
          <button onClick={onArchive} className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-red-400" aria-label="Archivia">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Mini-anteprima delle 4 schermate per decidere quale versione ripristinare senza aprirla */}
      {screenThumbs.length > 0 && (
        <div
          className="flex gap-1.5 items-end p-2 rounded-lg"
          style={{ background: `linear-gradient(135deg, ${accent}14, rgba(10,10,20,0.6))`, border: `1px solid ${accent}22` }}
          title="Mini-anteprima — clicca per aprire la preview completa"
        >
          {screenThumbs.map((sc, j) => (
            <a
              key={j}
              href={site.preview_url || "#"}
              target={site.preview_url ? "_blank" : undefined}
              rel="noopener"
              className="w-[40px] aspect-[9/19.5] rounded-md overflow-hidden shrink-0 relative transition-transform hover:scale-110 hover:-translate-y-0.5"
              style={{ border: `1px solid ${accent}55`, boxShadow: `0 2px 8px ${accent}30` }}
              aria-label={`Schermata ${sc.label}`}
            >
              <img src={sc.src} alt={sc.label} className="w-full h-full object-cover object-top" loading="lazy" />
            </a>
          ))}
          {/* Slot vuoti per mantenere il layout a 4 colonne */}
          {Array.from({ length: Math.max(0, 4 - screenThumbs.length) }).map((_, j) => (
            <div
              key={`ph-${j}`}
              className="w-[40px] aspect-[9/19.5] rounded-md shrink-0 flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}
            >
              <Smartphone className="w-3 h-3 text-white/65" />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {site.preview_url && (
          <a href={site.preview_url} target="_blank" rel="noopener"
            className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[9px] font-medium flex items-center gap-1 hover:bg-blue-500/20">
            <ExternalLink className="w-2.5 h-2.5" /> Preview
          </a>
        )}
        {site.admin_url && (
          <a href={site.admin_url} target="_blank" rel="noopener"
            className="px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[9px] font-medium flex items-center gap-1 hover:bg-violet-500/20">
            <Sparkles className="w-2.5 h-2.5" /> Admin
          </a>
        )}
        {site.outreach_payload?.whatsapp_link && (
          <a href={site.outreach_payload.whatsapp_link} target="_blank" rel="noopener"
            className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[9px] font-medium flex items-center gap-1 hover:bg-emerald-500/20">
            <MessageCircle className="w-2.5 h-2.5" /> WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Select compatto per i filtri vault ─── */
function FilterSelect({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 rounded-lg text-xs text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400/30"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0f0f1a] text-foreground">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ─── Chip filtro attivo (rimovibile con un tap) ─── */
/** Badge per distinguere a colpo d'occhio l'engine di generazione (AI / Template / Hybrid). */
function EngineBadge({ engine }: { engine?: string | null }) {
  if (!engine) return null;
  const cfg =
    engine === "ai"
      ? { label: "AI", bg: "rgba(34,211,238,0.18)", border: "rgba(34,211,238,0.45)", color: "#67e8f9", icon: "🤖" }
      : engine === "hybrid"
      ? { label: "Hybrid", bg: "rgba(244,114,182,0.18)", border: "rgba(244,114,182,0.45)", color: "#f9a8d4", icon: "🔀" }
      : { label: "Template", bg: "rgba(167,139,250,0.18)", border: "rgba(167,139,250,0.45)", color: "#c4b5fd", icon: "🎨" };
  return (
    <span
      title={`Generato con engine: ${cfg.label}`}
      className="inline-flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide shrink-0"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
    >
      <span className="text-[9px] leading-none">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

function FilterChip({
  label, value, onClear,
}: { label: string; value: string; onClear: () => void }) {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold"
      style={{
        background: "rgba(167,139,250,0.14)",
        border: "1px solid rgba(167,139,250,0.34)",
        color: "#c4b5fd",
      }}
    >
      <span className="opacity-70">{label}:</span>
      <span className="truncate max-w-[120px]">{value}</span>
      <button
        onClick={onClear}
        aria-label={`Rimuovi filtro ${label}`}
        className="ml-0.5 -mr-0.5 w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors"
      >
        <XIcon className="w-2.5 h-2.5" />
      </button>
    </motion.span>
  );
}
