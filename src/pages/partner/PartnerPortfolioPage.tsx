import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X as XIcon, Globe, LayoutDashboard, Pencil, Upload, Save,
  RefreshCw, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { INDUSTRY_CONFIGS } from "@/config/industry-config";
import { PORTFOLIO_PROJECTS } from "@/data/portfolio-showcase-data";
import { SECTOR_PORTFOLIO } from "@/data/sector-mockup-images";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { usePartnerDemoRestaurant } from "@/hooks/usePartnerDemoRestaurant";
import ProjectDetailOverlay from "@/components/partner/ProjectDetailOverlay";
import { toast } from "@/hooks/use-toast";

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
  const [sectorSearch, setSectorSearch] = useState("");
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
    setUploadingLogo(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${demoRestaurant.id}/logo.${ext}`;
      await supabase.storage.from("restaurant-logos").upload(path, file, { upsert: true });
      const { data: urlData } = supabase.storage.from("restaurant-logos").getPublicUrl(path);
      await supabase.from("restaurants").update({ logo_url: urlData.publicUrl + "?t=" + Date.now() }).eq("id", demoRestaurant.id);
      toast({ title: "Logo caricato!" });
      refetchDemo();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally { setUploadingLogo(false); }
  };

  const handleSaveCustomization = async () => {
    if (!demoRestaurant || savingDemo) return;
    setSavingDemo(true);
    try {
      await supabase.from("restaurants").update({ name: editName.trim() || demoRestaurant.name, primary_color: editColor }).eq("id", demoRestaurant.id);
      toast({ title: "✅ Personalizzazione salvata!" });
      setEditingDemo(false);
      refetchDemo();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally { setSavingDemo(false); }
  };

  const handleResetDemo = async () => {
    if (resettingDemo) return;
    setResettingDemo(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non autenticato");
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reset-partner-demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      if (!res.ok) throw new Error("Reset fallito");
      toast({ title: "✅ Demo Resettata" });
      refetchDemo();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally { setResettingDemo(false); }
  };

  const matchesSectorSearch = (card: typeof SECTOR_CARDS[0], q: string): boolean => {
    if (!q.trim()) return true;
    const haystack = [card.name, card.id, card.description || "", ...(card.tags || [])].join(" ").toLowerCase();
    return q.toLowerCase().split(/\s+/).every(t => haystack.includes(t));
  };

  return (
    <div className="space-y-6 px-4 pt-6 pb-8 max-w-2xl lg:max-w-7xl mx-auto">
      <header className="space-y-1.5">
        <p className="partner-eyebrow">Portfolio Empire</p>
        <h2 className="partner-h2">Portfolio &amp; Demo</h2>
        <p className="partner-subtle">Catalogo dei settori — preview cliente, dashboard admin e demo personalizzate.</p>
        <div className="partner-divider mt-3" />
      </header>

      {/* ═══ DEMO CUSTOMIZATION ═══ */}
      {demoSectionEnabled && selectedProject && (
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

      {/* ═══ SEARCH ═══ */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input value={sectorSearch} onChange={e => setSectorSearch(e.target.value)} placeholder="Cerca settore..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-foreground placeholder:text-muted-foreground"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
        {sectorSearch && <button onClick={() => setSectorSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><XIcon className="w-3 h-3 text-muted-foreground" /></button>}
      </div>

      {/* ═══ GRID ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTOR_CARDS.filter(card => matchesSectorSearch(card, sectorSearch)).map((card, i) => (
          <motion.div key={card.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-2xl overflow-hidden cursor-pointer group transition-all active:scale-[0.98]"
            style={{
              background: selectedProject === card.id ? `${card.accent}10` : "rgba(255,255,255,0.02)",
              border: `1px solid ${selectedProject === card.id ? `${card.accent}40` : "rgba(255,255,255,0.06)"}`,
            }}
            onClick={() => {
              setSelectedProject(selectedProject === card.id ? null : card.id);
              setDetailProject(card.id);
            }}>
            <div className="p-4 flex gap-2 justify-center overflow-hidden h-[140px] items-end" style={{ background: `linear-gradient(135deg, ${card.accent}15, rgba(10,10,20,0.9))` }}>
              {card.screens.slice(0, 3).map((src, j) => (
                <div key={j} className={`${j === 1 ? "w-[70px]" : "w-[55px]"} aspect-[9/19.5] rounded-[10px] overflow-hidden shrink-0`} style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  <img src={src} alt="" className="w-full h-full object-cover object-top" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="p-3.5 space-y-1.5">
              <div className="flex gap-1.5">
                {card.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[8px] font-semibold uppercase" style={{ background: `${card.accent}25`, color: card.accent }}>{tag}</span>
                ))}
              </div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">{card.name}</h4>
              <p className="text-[10px] line-clamp-1 text-muted-foreground">{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ═══ DETAIL OVERLAY ═══ */}
      <AnimatePresence>
        {detailProject && <ProjectDetailOverlay sectorId={detailProject} onClose={() => setDetailProject(null)} />}
      </AnimatePresence>
    </div>
  );
}
