import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2, Sparkles, Trash2, ExternalLink, Palette, Eye, Copy, MessageCircle,
  Image as ImageIcon, Smartphone, Star, Bookmark, Search, ChevronDown,
  User as UserIcon, Building2, Brush, Upload, Save, RotateCcw, Check,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { MockupSuiteGenerator } from "@/components/partner/MockupSuiteGenerator";
import { MockupSuiteVaultList } from "@/components/partner/MockupSuiteVaultList";
import PartnerHeroMascot from "@/components/partner/PartnerHeroMascot";
import alienDesigner from "@/assets/empire-alien-designer.png";
import PartnerFlowStepper from "@/components/partner/PartnerFlowStepper";
import { TutorialPopup } from "@/components/ui/tutorial-popup";
import { MockupPresetSelector } from "@/components/partner/MockupPresetSelector";
import { MOCKUP_STYLE_PRESETS, getStylePreset } from "@/lib/mockup-style-presets";
import { PresetThemeScope } from "@/components/partner/PresetThemeScope";

const COST = 15;

interface CustomPreview {
  id: string;
  sector_label: string;
  template_style: string;
  primary_color: string;
  hero_title: string | null;
  preview_url: string | null;
  public_slug: string | null;
  lead_name: string | null;
  lead_city: string | null;
  hero_image_url: string | null;
  logo_url: string | null;
  generation_status: string;
  view_count: number;
  reuse_count: number;
  created_at: string;
  whatsapp_message: string | null;
  is_favorite?: boolean;
  saved_to_portfolio?: boolean;
  portfolio_label?: string | null;
  portfolio_notes?: string | null;
}

interface SelectableLead {
  id: string;
  source: "intelligence" | "scout";
  lead_name: string;
  lead_city: string | null;
  lead_sector: string | null;
  lead_website: string | null;
  lead_phone: string | null;
  lead_email: string | null;
  google_rating: number | null;
  badge?: string;
}

export default function PartnerCustomPreviewPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [previews, setPreviews] = useState<CustomPreview[]>([]);
  const [availableLeads, setAvailableLeads] = useState<SelectableLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [mode, setMode] = useState<"lead" | "manual">("lead");
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // ─── Deep-link da Leads: ?leadId=&name=&sector=&city=&phone=&email=&website=&address=&color=&autostart=1
  // Quando il venditore preme "Genera" su un lead, viene portato qui con tutti i dati pre-caricati
  // e (se autostart=1) il MockupSuiteGenerator parte da solo.
  const [autoStartSuite, setAutoStartSuite] = useState(false);
  const mockupSectionRef = useRef<HTMLDivElement | null>(null);
  const deepLinkAppliedRef = useRef(false);

  // Filtri lista preview
  const [previewSearch, setPreviewSearch] = useState("");
  const [previewFilter, setPreviewFilter] = useState<"all" | "favorites" | "portfolio">("all");

  // Dialog "Salva nel Portfolio"
  const [saveDialog, setSaveDialog] = useState<{ id: string; defaultLabel: string } | null>(null);
  const [saveLabel, setSaveLabel] = useState("");
  const [saveNotes, setSaveNotes] = useState("");
  const [savingPortfolio, setSavingPortfolio] = useState(false);

  const [form, setForm] = useState({
    lead_name: "",
    lead_city: "",
    lead_sector: "",
    lead_phone: "",
    lead_website: "",
    lead_address: "",
    lead_email: "",
    template_style: "modern_dark",
    primary_color: "#C8963E",
    logo_url: "",
    gallery_images: [] as string[],
  });

  // Sezioni collassabili form (UX professionale: 1 step alla volta su mobile)
  const [openSection, setOpenSection] = useState<"data" | "brand" | "style" | null>("data");
  const toggleSection = (s: "data" | "brand" | "style") =>
    setOpenSection(prev => (prev === s ? null : s));

  // ═══ DRAFT AUTOSAVE (localStorage, per-utente) ═══
  const DRAFT_KEY = user?.id ? `partner-custom-preview-draft:${user.id}` : null;
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  // Restore bozza al mount (una volta sola, quando l'utente è disponibile)
  useEffect(() => {
    if (!DRAFT_KEY || draftHydrated) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.form) {
          setForm(prev => ({ ...prev, ...parsed.form }));
          if (parsed.mode) setMode(parsed.mode);
          if (parsed.selectedLeadId) setSelectedLeadId(parsed.selectedLeadId);
          if (parsed.savedAt) setDraftSavedAt(parsed.savedAt);
          setDraftRestored(true);
        }
      }
    } catch (err) {
      console.warn("[draft] restore failed", err);
    } finally {
      setDraftHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DRAFT_KEY]);

  // ─── Deep-link prefill: legge i query params dopo l'idratazione del draft
  // così i dati del lead arrivano sempre più freschi della bozza locale.
  useEffect(() => {
    if (!draftHydrated) return;
    if (deepLinkAppliedRef.current) return;
    const qpName = searchParams.get("name");
    const qpLeadId = searchParams.get("leadId");
    if (!qpName && !qpLeadId) {
      deepLinkAppliedRef.current = true;
      return;
    }
    deepLinkAppliedRef.current = true;

    setForm(prev => ({
      ...prev,
      lead_name: qpName || prev.lead_name,
      lead_sector: searchParams.get("sector") || prev.lead_sector,
      lead_city: searchParams.get("city") || prev.lead_city,
      lead_phone: searchParams.get("phone") || prev.lead_phone,
      lead_email: searchParams.get("email") || prev.lead_email,
      lead_website: searchParams.get("website") || prev.lead_website,
      lead_address: searchParams.get("address") || prev.lead_address,
      primary_color: searchParams.get("color") || prev.primary_color,
    }));
    setMode("lead");
    if (qpLeadId) setSelectedLeadId(`lead:${qpLeadId}`);

    if (searchParams.get("autostart") === "1") {
      setAutoStartSuite(true);
    }

    toast.success(`Dati di "${qpName || "lead"}" caricati · Mockup Suite pronta`);

    // Scroll alla sezione Mockup Suite + ripulisci i query params (così un refresh non rilancia)
    setTimeout(() => {
      mockupSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
    setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      ["leadId","name","sector","city","phone","email","website","address","color","autostart"].forEach(k => next.delete(k));
      setSearchParams(next, { replace: true });
    }, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftHydrated]);

  // Auto-save bozza con debounce 600ms
  useEffect(() => {
    if (!DRAFT_KEY || !draftHydrated) return;
    const hasContent =
      form.lead_name || form.lead_city || form.lead_sector || form.lead_phone ||
      form.lead_website || form.lead_address || form.lead_email ||
      form.logo_url || form.gallery_images.length > 0 ||
      form.template_style !== "modern_dark" || form.primary_color !== "#C8963E";
    if (!hasContent) return;

    setDraftStatus("saving");
    const t = setTimeout(() => {
      try {
        const savedAt = Date.now();
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, mode, selectedLeadId, savedAt }));
        setDraftSavedAt(savedAt);
        setDraftStatus("saved");
      } catch (err) {
        console.warn("[draft] save failed", err);
        setDraftStatus("idle");
      }
    }, 600);
    return () => clearTimeout(t);
  }, [form, mode, selectedLeadId, DRAFT_KEY, draftHydrated]);

  const clearDraft = () => {
    if (!DRAFT_KEY) return;
    if (!confirm("Cancellare la bozza salvata e ricominciare da zero?")) return;
    localStorage.removeItem(DRAFT_KEY);
    setForm({
      lead_name: "", lead_city: "", lead_sector: "", lead_phone: "", lead_website: "",
      lead_address: "", lead_email: "",
      template_style: "modern_dark", primary_color: "#C8963E",
      logo_url: "", gallery_images: [],
    });
    setSelectedLeadId("");
    setDraftSavedAt(null);
    setDraftStatus("idle");
    setDraftRestored(false);
    toast.success("Bozza cancellata");
  };

  const formatDraftTime = (ts: number | null) => {
    if (!ts) return "";
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 5) return "ora";
    if (diff < 60) return `${diff}s fa`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min fa`;
    const d = new Date(ts);
    return d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  };

  // Load previews + intelligence + scout leads
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const [pRes, iRes, sRes] = await Promise.all([
        supabase.from("seller_custom_previews" as any).select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
        supabase.from("lead_intelligence_reports").select("id, lead_name, lead_city, lead_sector, lead_website, lead_phone, google_rating, vendibility_score, category").eq("owner_id", user.id).order("vendibility_score", { ascending: false }).limit(100),
        supabase.from("leads").select("id, name, city, sector, website, phone, email, ai_score").eq("owner_id", user.id).order("created_at", { ascending: false }).limit(100),
      ]);
      setPreviews((pRes.data as any) || []);

      const intel: SelectableLead[] = ((iRes.data as any[]) || []).map(r => ({
        id: `intel:${r.id}`,
        source: "intelligence",
        lead_name: r.lead_name,
        lead_city: r.lead_city,
        lead_sector: r.lead_sector,
        lead_website: r.lead_website,
        lead_phone: r.lead_phone,
        lead_email: null,
        google_rating: r.google_rating,
        badge: r.category ? `${String(r.category).toUpperCase()} · score ${r.vendibility_score ?? "?"}` : "Intelligence",
      }));
      const scout: SelectableLead[] = ((sRes.data as any[]) || []).map(r => ({
        id: `scout:${r.id}`,
        source: "scout",
        lead_name: r.name,
        lead_city: r.city,
        lead_sector: r.sector,
        lead_website: r.website,
        lead_phone: r.phone,
        lead_email: r.email,
        google_rating: null,
        badge: r.ai_score ? `Scout · score ${r.ai_score}` : "Scout",
      }));
      setAvailableLeads([...intel, ...scout]);
      setLoading(false);
    })();
  }, [user?.id]);

  // Pre-fill form da lead selezionato
  useEffect(() => {
    if (!selectedLeadId || selectedLeadId === "none") return;
    const lead = availableLeads.find(l => l.id === selectedLeadId);
    if (!lead) return;
    setMode("lead");
    setForm(f => ({
      ...f,
      lead_name: lead.lead_name || "",
      lead_city: lead.lead_city || "",
      lead_sector: lead.lead_sector || "",
      lead_website: lead.lead_website || "",
      lead_phone: lead.lead_phone || "",
      lead_email: lead.lead_email || "",
      lead_address: "",
    }));
    toast.success(`Dati di "${lead.lead_name}" caricati nel form`);
  }, [selectedLeadId, availableLeads]);

  const handleFileUpload = async (file: File, _kind: "logo" | "gallery") => {
    if (!user?.id) return null;
    const path = `custom-previews/${user.id}/uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("media-vault").upload(path, file, { upsert: true });
    if (error) {
      toast.error(`Errore upload: ${error.message}`);
      return null;
    }
    const { data } = supabase.storage.from("media-vault").getPublicUrl(path);
    return data.publicUrl;
  };

  const onLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoUploading(true);
    const url = await handleFileUpload(f, "logo");
    if (url) setForm(p => ({ ...p, logo_url: url }));
    setLogoUploading(false);
  };

  const onGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setGalleryUploading(true);
    const urls: string[] = [];
    for (const f of files.slice(0, 6)) {
      const url = await handleFileUpload(f, "gallery");
      if (url) urls.push(url);
    }
    setForm(p => ({ ...p, gallery_images: [...p.gallery_images, ...urls].slice(0, 6) }));
    setGalleryUploading(false);
  };

  const handleGenerate = async () => {
    if (!form.lead_name.trim()) {
      toast.error("Nome attività obbligatorio");
      return;
    }
    setGenerating(true);
    try {
      const payload: any = {
        template_style: form.template_style,
        primary_color: form.primary_color,
        logo_url: form.logo_url || undefined,
        gallery_images: form.gallery_images,
      };

      if (mode === "lead" && selectedLeadId && selectedLeadId !== "none") {
        const [src, realId] = selectedLeadId.split(":");
        if (src === "intel") payload.lead_intelligence_id = realId;
        else if (src === "scout") payload.lead_id = realId;
        payload.manual_data = {
          lead_name: form.lead_name, lead_city: form.lead_city, lead_sector: form.lead_sector,
          lead_website: form.lead_website, lead_phone: form.lead_phone,
          lead_address: form.lead_address, lead_email: form.lead_email,
        };
      } else {
        payload.manual_data = {
          lead_name: form.lead_name, lead_city: form.lead_city, lead_sector: form.lead_sector,
          lead_website: form.lead_website, lead_phone: form.lead_phone,
          lead_address: form.lead_address, lead_email: form.lead_email,
        };
      }

      const { data, error } = await supabase.functions.invoke("custom-preview-generator", { body: payload });
      if (error) throw error;
      if (!(data as any)?.success) {
        const err = (data as any)?.error || "Errore generazione";
        if (err === "insufficient_credits") {
          toast.error(`Crediti insufficienti: servono ${COST} crediti`);
        } else {
          toast.error(`Errore: ${err}`);
        }
        return;
      }

      toast.success(`Preview "${form.lead_name}" generata! 🎉`);

      const { data: list } = await supabase.from("seller_custom_previews" as any).select("*").eq("owner_id", user!.id).order("created_at", { ascending: false });
      setPreviews((list as any) || []);

      setForm({
        lead_name: "", lead_city: "", lead_sector: "", lead_phone: "", lead_website: "",
        lead_address: "", lead_email: "",
        template_style: "modern_dark", primary_color: "#C8963E",
        logo_url: "", gallery_images: [],
      });
      setSelectedLeadId("");

      // Bozza completata: rimuovi dal localStorage
      if (DRAFT_KEY) {
        try { localStorage.removeItem(DRAFT_KEY); } catch {}
        setDraftSavedAt(null);
        setDraftStatus("idle");
        setDraftRestored(false);
      }

      const url = (data as any).public_url;
      if (url) window.open(url, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Errore generazione");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminare questa preview?")) return;
    await supabase.from("seller_custom_previews" as any).delete().eq("id", id);
    setPreviews(prev => prev.filter(p => p.id !== id));
    toast.success("Preview eliminata");
  };

  const copyLink = (slug: string | null) => {
    if (!slug) return;
    const url = `${window.location.origin}/preview/custom/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiato");
  };

  const openWhatsApp = (preview: CustomPreview) => {
    if (!preview.whatsapp_message) {
      toast.error("Messaggio WhatsApp non disponibile");
      return;
    }
    const url = `https://wa.me/?text=${encodeURIComponent(preview.whatsapp_message)}`;
    window.open(url, "_blank");
  };

  /** Toggle preferito (rapido, senza dialog) */
  const toggleFavorite = async (p: CustomPreview) => {
    const next = !p.is_favorite;
    setPreviews(prev => prev.map(x => x.id === p.id ? { ...x, is_favorite: next } : x));
    const { error } = await supabase
      .from("seller_custom_previews" as any)
      .update({ is_favorite: next })
      .eq("id", p.id);
    if (error) {
      toast.error("Impossibile aggiornare preferito");
      setPreviews(prev => prev.map(x => x.id === p.id ? { ...x, is_favorite: !next } : x));
      return;
    }
    toast.success(next ? "Aggiunta ai preferiti ⭐" : "Rimossa dai preferiti");
  };

  /** Apre dialog di salvataggio nel Portfolio */
  const openSaveDialog = (p: CustomPreview) => {
    setSaveDialog({ id: p.id, defaultLabel: p.lead_name || p.sector_label || "Preview senza nome" });
    setSaveLabel(p.portfolio_label || p.lead_name || "");
    setSaveNotes(p.portfolio_notes || "");
  };

  const confirmSaveToPortfolio = async () => {
    if (!saveDialog) return;
    setSavingPortfolio(true);
    const { error } = await supabase
      .from("seller_custom_previews" as any)
      .update({
        saved_to_portfolio: true,
        saved_to_portfolio_at: new Date().toISOString(),
        portfolio_label: saveLabel.trim() || saveDialog.defaultLabel,
        portfolio_notes: saveNotes.trim() || null,
      })
      .eq("id", saveDialog.id);
    setSavingPortfolio(false);
    if (error) {
      toast.error("Salvataggio nel portfolio fallito");
      return;
    }
    setPreviews(prev => prev.map(x => x.id === saveDialog.id
      ? { ...x, saved_to_portfolio: true, portfolio_label: saveLabel.trim() || saveDialog.defaultLabel, portfolio_notes: saveNotes.trim() || null }
      : x));
    toast.success("Preview salvata nel Portfolio Partner ✨");
    setSaveDialog(null);
  };

  const removeFromPortfolio = async (p: CustomPreview) => {
    if (!confirm("Rimuovere questa preview dal Portfolio? La preview resta nella lista.")) return;
    const { error } = await supabase
      .from("seller_custom_previews" as any)
      .update({ saved_to_portfolio: false, saved_to_portfolio_at: null })
      .eq("id", p.id);
    if (error) { toast.error("Operazione fallita"); return; }
    setPreviews(prev => prev.map(x => x.id === p.id ? { ...x, saved_to_portfolio: false } : x));
    toast.success("Rimossa dal Portfolio");
  };

  // Lista filtrata
  const visiblePreviews = previews.filter(p => {
    if (previewFilter === "favorites" && !p.is_favorite) return false;
    if (previewFilter === "portfolio" && !p.saved_to_portfolio) return false;
    if (previewSearch.trim()) {
      const q = previewSearch.toLowerCase();
      const hay = [p.lead_name, p.lead_city, p.sector_label, p.template_style, p.portfolio_label]
        .filter(Boolean).join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const counts = {
    total: previews.length,
    favorites: previews.filter(p => p.is_favorite).length,
    portfolio: previews.filter(p => p.saved_to_portfolio).length,
  };

  return (
    <div className="w-full max-w-[720px] md:max-w-[920px] lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] mx-auto px-3 sm:px-5 md:px-6 lg:px-8 pt-2 pb-32 sm:pb-12 space-y-5 sm:space-y-6 lg:space-y-8">
      {/* ═══ HERO MASCOT ═══ */}
      <PartnerHeroMascot
        title="Mockup su Misura"
        subtitle={`Costruisci a mano un mockup iPhone per UN cliente specifico — tu inserisci dati e brand, l'AI genera l'anteprima. Costo: ${COST} crediti.`}
        icon={Palette}
        active={generating}
        mascotSrc={alienDesigner}
        mascotAlt="Alien Designer — Mockup su Misura"
      />

      {/* ═══ FLUSSO 3 STEP ═══ */}
      <PartnerFlowStepper currentStep="mockup" />

      <TutorialPopup
        id="custom-preview-mockup-v1"
        title="Mockup su Misura · 3 step"
        accentColor="#fb7185"
        position="bottom-right"
        steps={[
          { emoji: "🎯", title: "Quando usare questo strumento", description: "Hai un cliente specifico (lo conosci già) e vuoi mostrargli un'anteprima brandizzata col SUO logo, SUOI colori, SUOI contenuti. Diverso da 'Caccia Lead' che genera demo automatici per locali sconosciuti." },
          { emoji: "📝", title: "Step 1 · Inserisci i dati", description: "Nome cliente, città, settore, logo e colore primario. Più info dai, più il mockup sarà credibile." },
          { emoji: "🎨", title: "Step 2 · Scegli stile e genera", description: "Scegli uno dei 4 stili (Modern Dark, Luxury Gold, Casual Warm, Minimal Zen). Costo: 15 crediti. L'AI genera in 60 secondi." },
          { emoji: "📱", title: "Step 3 · Mostra al cliente", description: "Il mockup finisce nella Vetrina. Da lì lo apri in modalità Presentazione fullscreen davanti al cliente." },
        ]}
      />

      {/* ═══ LAYOUT PRINCIPALE: 1 col mobile/tablet, 2 col da lg+ per desktop+iPad landscape ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-5 lg:gap-6 xl:gap-8 items-start">

        {/* ═══════════ COLONNA SX: FORM ad ACCORDION ═══════════ */}
        <Card className="border-primary/30 overflow-hidden lg:sticky lg:top-4 shadow-sm">
          <CardHeader className="pb-3 px-4 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Genera nuova preview
                </CardTitle>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                  3 passi rapidi · totale ~30 sec
                </p>
              </div>

              {/* Indicatore autosave bozza */}
              {draftHydrated && (draftStatus !== "idle" || draftSavedAt) && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/60 border border-border/50 text-[10px] sm:text-[11px] text-muted-foreground"
                    title={draftSavedAt ? `Bozza salvata ${formatDraftTime(draftSavedAt)}` : "Salvataggio…"}
                  >
                    {draftStatus === "saving" ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="hidden sm:inline">Salvo…</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        <span>Bozza · {formatDraftTime(draftSavedAt)}</span>
                      </>
                    )}
                  </div>
                  {draftSavedAt && (
                    <button
                      type="button"
                      onClick={clearDraft}
                      title="Cancella bozza"
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {draftRestored && (
              <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-[11px] text-foreground">
                <Save className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="flex-1">Bozza precedente ripristinata — continua da dove avevi lasciato.</span>
                <button
                  type="button"
                  onClick={() => setDraftRestored(false)}
                  className="text-muted-foreground hover:text-foreground text-[10px] uppercase tracking-wide"
                >
                  ok
                </button>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-3 px-3 sm:px-5 pb-4">
            {/* Tabs Lead vs Manuale */}
            <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
              <TabsList className="grid grid-cols-2 w-full h-10">
                <TabsTrigger value="lead" className="text-xs sm:text-sm">Da Lead Analizzato</TabsTrigger>
                <TabsTrigger value="manual" className="text-xs sm:text-sm">Inserimento Manuale</TabsTrigger>
              </TabsList>

              <TabsContent value="lead" className="space-y-2 mt-3">
                <Label className="text-xs">Seleziona lead da Intelligence o Scout</Label>
                <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Scegli un lead già scoperto…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {availableLeads.length === 0 ? (
                      <SelectItem value="none" disabled>Nessun lead — usa Scout o Intelligence prima</SelectItem>
                    ) : availableLeads.map(l => (
                      <SelectItem key={l.id} value={l.id}>
                        <span className="font-medium">{l.lead_name}</span>
                        {l.lead_city ? ` · ${l.lead_city}` : ""}
                        {l.lead_sector ? ` · ${l.lead_sector}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  <strong>{availableLeads.filter(l => l.source === "intelligence").length}</strong> da Intelligence ·{" "}
                  <strong>{availableLeads.filter(l => l.source === "scout").length}</strong> da Scout
                </p>
              </TabsContent>

              <TabsContent value="manual" className="mt-3">
                <p className="text-xs text-muted-foreground">Inserisci tutti i dati a mano. Più dati metti, più l'AI personalizza.</p>
              </TabsContent>
            </Tabs>

            {/* ── STEP 1: ANAGRAFICA ── */}
            <div className="border border-border/60 rounded-xl overflow-hidden bg-card/40">
              <button
                type="button"
                onClick={() => toggleSection("data")}
                className="w-full flex items-center justify-between gap-2 px-3 sm:px-4 h-11 text-left hover:bg-muted/30 transition-colors"
                aria-expanded={openSection === "data"}
              >
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-6 w-6 rounded-full bg-primary/15 text-primary text-[11px] flex items-center justify-center font-bold">1</span>
                  <UserIcon className="h-4 w-4 text-primary/80" />
                  Anagrafica cliente
                  {form.lead_name && <Badge variant="secondary" className="text-[9px] ml-1">✓</Badge>}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSection === "data" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {openSection === "data" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-3 sm:px-4 pb-4 pt-1">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="lead_name" className="text-xs">Nome attività *</Label>
                        <Input id="lead_name" className="h-11" placeholder="es. Tatuaggi Black Rose" value={form.lead_name} onChange={e => setForm({ ...form, lead_name: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lead_sector" className="text-xs">Settore</Label>
                        <Input id="lead_sector" className="h-11" placeholder="es. Tatuatore, Fiorista" value={form.lead_sector} onChange={e => setForm({ ...form, lead_sector: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lead_city" className="text-xs">Città</Label>
                        <Input id="lead_city" className="h-11" placeholder="es. Roma" value={form.lead_city} onChange={e => setForm({ ...form, lead_city: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lead_phone" className="text-xs">Telefono</Label>
                        <Input id="lead_phone" className="h-11" inputMode="tel" placeholder="+39 06 1234 5678" value={form.lead_phone} onChange={e => setForm({ ...form, lead_phone: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lead_email" className="text-xs">Email</Label>
                        <Input id="lead_email" className="h-11" inputMode="email" placeholder="info@esempio.it" value={form.lead_email} onChange={e => setForm({ ...form, lead_email: e.target.value })} />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="lead_website" className="text-xs">Sito web (analizzato dall'AI)</Label>
                        <Input id="lead_website" className="h-11" inputMode="url" placeholder="https://…" value={form.lead_website} onChange={e => setForm({ ...form, lead_website: e.target.value })} />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="lead_address" className="text-xs">Indirizzo</Label>
                        <Input id="lead_address" className="h-11" placeholder="Via Roma 1, Milano" value={form.lead_address} onChange={e => setForm({ ...form, lead_address: e.target.value })} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── STEP 2: BRAND (logo + gallery) ── */}
            <div className="border border-border/60 rounded-xl overflow-hidden bg-card/40">
              <button
                type="button"
                onClick={() => toggleSection("brand")}
                className="w-full flex items-center justify-between gap-2 px-3 sm:px-4 h-11 text-left hover:bg-muted/30 transition-colors"
                aria-expanded={openSection === "brand"}
              >
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-6 w-6 rounded-full bg-primary/15 text-primary text-[11px] flex items-center justify-center font-bold">2</span>
                  <Building2 className="h-4 w-4 text-primary/80" />
                  Brand & Immagini
                  <Badge variant="outline" className="text-[9px] ml-1">opzionale</Badge>
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSection === "brand" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {openSection === "brand" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-3 sm:px-4 pb-4 pt-1">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Logo</Label>
                        <div className="flex items-center gap-3">
                          {form.logo_url ? (
                            <img src={form.logo_url} alt="logo" className="h-12 w-12 rounded-lg object-cover border shrink-0" />
                          ) : (
                            <div className="h-12 w-12 rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground shrink-0">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                          <Input type="file" accept="image/*" onChange={onLogoChange} disabled={logoUploading} className="h-11 text-xs flex-1 min-w-0" />
                        </div>
                        {form.logo_url && (
                          <button type="button" className="text-[10px] text-destructive hover:underline" onClick={() => setForm(p => ({ ...p, logo_url: "" }))}>Rimuovi logo</button>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Galleria <span className="text-muted-foreground">(max 6)</span></Label>
                        <Input type="file" accept="image/*" multiple onChange={onGalleryChange} disabled={galleryUploading} className="h-11 text-xs" />
                        {form.gallery_images.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap pt-1">
                            {form.gallery_images.map((g, i) => (
                              <div key={i} className="relative h-12 w-12 rounded-md overflow-hidden border group">
                                <img src={g} alt="" className="h-full w-full object-cover" />
                                <button type="button" onClick={() => setForm(p => ({ ...p, gallery_images: p.gallery_images.filter((_, j) => j !== i) }))}
                                  className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 active:opacity-100 flex items-center justify-center text-sm">×</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── STEP 3: STILE & COLORE ── */}
            <div className="border border-border/60 rounded-xl overflow-hidden bg-card/40">
              <button
                type="button"
                onClick={() => toggleSection("style")}
                className="w-full flex items-center justify-between gap-2 px-3 sm:px-4 h-11 text-left hover:bg-muted/30 transition-colors"
                aria-expanded={openSection === "style"}
              >
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className="h-6 w-6 rounded-full bg-primary/15 text-primary text-[11px] flex items-center justify-center font-bold">3</span>
                  <Brush className="h-4 w-4 text-primary/80" />
                  Stile & Colore
                  <Badge variant="secondary" className="text-[9px] ml-1 capitalize">{form.template_style.replace("_", " ")}</Badge>
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSection === "style" ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {openSection === "style" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <PresetThemeScope
                      preset={getStylePreset(form.template_style)}
                      applyTypography={false}
                      className="space-y-3 px-3 sm:px-4 pb-4 pt-1 rounded-lg"
                    >
                      <MockupPresetSelector
                        value={form.template_style}
                        sectorHint={form.lead_sector}
                        onChange={(key, preset) =>
                          setForm({
                            ...form,
                            template_style: key,
                            primary_color: preset.palette.accent,
                          })
                        }
                        compact
                      />
                      <div className="space-y-1.5">
                        <Label htmlFor="color" className="text-xs">Colore accento (override)</Label>
                        <div className="flex gap-2">
                          <Input id="color" type="color" value={form.primary_color} onChange={e => setForm({ ...form, primary_color: e.target.value })} className="w-14 h-11 p-1 shrink-0 cursor-pointer" />
                          <Input value={form.primary_color} onChange={e => setForm({ ...form, primary_color: e.target.value })} className="flex-1 font-mono h-11 text-sm uppercase" />
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">
                          Bottoni, badge e card qui sotto si tingono col preset selezionato — coerenza brand garantita.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button size="sm" className="h-8">Anteprima CTA</Button>
                        <Button size="sm" variant="secondary" className="h-8">Secondario</Button>
                        <Button size="sm" variant="outline" className="h-8">Outline</Button>
                        <Badge>Badge brand</Badge>
                      </div>
                    </PresetThemeScope>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── CTA Genera (sticky su mobile) ── */}
            <div className="sticky bottom-2 z-10 pt-2">
              <Button
                onClick={handleGenerate}
                disabled={generating || !form.lead_name.trim()}
                className="w-full h-12 sm:h-12 text-sm sm:text-base font-semibold shadow-lg shadow-primary/20"
                size="lg"
              >
                {generating ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> AI sta generando (15-30s)…</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" /> Genera preview AI ({COST} crediti)</>
                )}
              </Button>
              <p className="text-[10px] sm:text-xs text-muted-foreground text-center leading-relaxed mt-2">
                ✓ Testi AI · ✓ Hero generato · ✓ Sito scrapato · ✓ HTML responsive · ✓ Link condivisibile
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ═══════════ COLONNA DX: MOCKUP SUITE + VAULT + LISTA ═══════════ */}
        <div className="space-y-5 lg:space-y-6 min-w-0">
          {/* MOCKUP IPHONE SUITE */}
          <section ref={mockupSectionRef} className="space-y-3 scroll-mt-20">
            <div className="flex items-center gap-2 flex-wrap">
              <Smartphone className="h-5 w-5 text-primary shrink-0" />
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold">Mockup iPhone Suite</h2>
              <Badge variant="secondary" className="text-[10px]">4 schermate</Badge>
              {autoStartSuite && (
                <Badge className="text-[10px] bg-primary/15 text-primary border border-primary/30">
                  Avvio automatico…
                </Badge>
              )}
            </div>
            <p className="text-[11px] sm:text-sm text-muted-foreground">
              Genera 4 schermate iPhone professionali. Se hai compilato il form (o sei arrivato da un lead), i dati sono già pre-caricati.
            </p>
            <MockupSuiteGenerator
              businessName={form.lead_name}
              businessSector={form.lead_sector}
              businessCity={form.lead_city}
              primaryColor={form.primary_color}
              templateVariant={form.template_style}
              autoStart={autoStartSuite}
              onGenerated={() => setAutoStartSuite(false)}
            />
          </section>

          <MockupSuiteVaultList />
        </div>
      </div>

      {/* ═══ LISTA PREVIEW HTML — full width sotto il layout 2-col ═══ */}
      <section className="space-y-3 pt-4 sm:pt-6 border-t border-border/50">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            Le tue preview HTML
            <Badge variant="outline" className="text-[10px]">{counts.total}</Badge>
          </h2>
        </div>

        {/* Filtri + ricerca — sticky su mobile per restare a portata di pollice */}
        <div className="sticky top-0 z-20 -mx-3 sm:mx-0 px-3 sm:px-0 py-2 bg-background/85 backdrop-blur-md space-y-2 border-b border-border/40 sm:border-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={previewSearch}
              onChange={(e) => setPreviewSearch(e.target.value)}
              placeholder="Cerca per nome, città, settore…"
              className="h-11 pl-9 pr-9 text-sm"
            />
            {previewSearch && (
              <button
                type="button"
                onClick={() => setPreviewSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
                aria-label="Pulisci ricerca"
              >
                ×
              </button>
            )}
          </div>
          <div className="flex gap-1.5 overflow-x-auto -mx-3 px-3 pb-1 scrollbar-none">
            {[
              { key: "all", label: "Tutte", count: counts.total, icon: null },
              { key: "favorites", label: "Preferiti", count: counts.favorites, icon: <Star className="w-3 h-3" /> },
              { key: "portfolio", label: "Portfolio", count: counts.portfolio, icon: <Bookmark className="w-3 h-3" /> },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setPreviewFilter(f.key as any)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-xs font-semibold border transition-all ${
                  previewFilter === f.key
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40"
                }`}
              >
                {f.icon}
                {f.label}
                <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-background/30">{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Card><CardContent className="pt-6 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></CardContent></Card>
        ) : visiblePreviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-sm text-muted-foreground">
              {previewFilter === "all" ? "Nessuna preview ancora — crea la prima qui sopra." :
                previewFilter === "favorites" ? "Nessuna preview tra i preferiti. Tocca la stella ⭐ su una card." :
                "Nessuna preview salvata nel Portfolio. Tocca il segnalibro 🔖 per salvarla."}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
            <AnimatePresence mode="popLayout">
              {visiblePreviews.map(p => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden border-border/60 hover:border-primary/40 transition-colors">
                    {/* Hero */}
                    <div
                      className="h-28 sm:h-32 relative"
                      style={{ background: p.hero_image_url ? `url(${p.hero_image_url}) center/cover` : p.primary_color }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                      {/* Favorite + Bookmark — top-left, touch-friendly */}
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <button
                          onClick={() => toggleFavorite(p)}
                          aria-label={p.is_favorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
                          className={`h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 ${
                            p.is_favorite
                              ? "bg-amber-500/90 border-amber-300 text-white"
                              : "bg-black/40 border-white/20 text-white/80 hover:bg-black/60"
                          }`}
                        >
                          <Star className={`w-4 h-4 ${p.is_favorite ? "fill-current" : ""}`} />
                        </button>
                        <button
                          onClick={() => p.saved_to_portfolio ? removeFromPortfolio(p) : openSaveDialog(p)}
                          aria-label={p.saved_to_portfolio ? "Rimuovi dal Portfolio" : "Salva nel Portfolio"}
                          disabled={p.generation_status !== "completed"}
                          className={`h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed ${
                            p.saved_to_portfolio
                              ? "bg-violet-500/90 border-violet-300 text-white"
                              : "bg-black/40 border-white/20 text-white/80 hover:bg-black/60"
                          }`}
                          title={p.saved_to_portfolio ? "Salvata nel Portfolio" : "Salva nel Portfolio"}
                        >
                          <Bookmark className={`w-4 h-4 ${p.saved_to_portfolio ? "fill-current" : ""}`} />
                        </button>
                      </div>

                      {/* Stato generazione — top-right */}
                      {p.generation_status === "generating" && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> Generazione
                        </div>
                      )}
                      {p.generation_status === "error" && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full">Errore</div>
                      )}

                      {/* Titolo overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
                        <p className="font-bold text-sm line-clamp-1">{p.lead_name || p.sector_label}</p>
                        <p className="text-[10px] opacity-80 line-clamp-1">
                          {p.lead_city || "—"} · {new Date(p.created_at).toLocaleDateString("it-IT")}
                        </p>
                      </div>
                    </div>

                    <CardContent className="pt-3 pb-3 px-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="text-[10px] capitalize">{p.template_style.replace("_", " ")}</Badge>
                        <Badge variant="secondary" className="text-[10px]"><Eye className="h-3 w-3 mr-1" />{p.view_count || 0}</Badge>
                      </div>
                      {p.portfolio_label && p.saved_to_portfolio && (
                        <p className="text-[10px] font-semibold text-violet-500 line-clamp-1 flex items-center gap-1">
                          <Bookmark className="w-3 h-3 fill-current" />
                          {p.portfolio_label}
                        </p>
                      )}
                      {p.hero_title && <p className="text-[11px] font-medium line-clamp-2 text-muted-foreground">{p.hero_title}</p>}

                      {/* Azioni primarie sempre visibili — touch friendly */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => p.preview_url && window.open(p.preview_url, "_blank")}
                          disabled={!p.preview_url || p.generation_status !== "completed"}
                          className="h-10 text-xs font-semibold"
                          title="Apri preview"
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Apri
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyLink(p.public_slug)}
                          disabled={!p.public_slug}
                          className="h-10 text-xs font-semibold"
                          title="Copia link condivisibile"
                        >
                          <Copy className="h-3.5 w-3.5 mr-1.5" /> Copia
                        </Button>
                      </div>

                      {/* Azioni secondarie compatte */}
                      <div className="flex items-center justify-between gap-1 pt-0.5">
                        {p.whatsapp_message ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openWhatsApp(p)}
                            className="flex-1 h-9 text-[11px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                          >
                            <MessageCircle className="h-3.5 w-3.5 mr-1" /> WhatsApp
                          </Button>
                        ) : <span className="flex-1" />}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                          className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10"
                          title="Elimina"
                          aria-label="Elimina preview"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ═══ DIALOG: salva nel Portfolio ═══ */}
      <Dialog open={!!saveDialog} onOpenChange={(o) => !o && setSaveDialog(null)}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-violet-500" />
              Salva nel Portfolio
            </DialogTitle>
            <DialogDescription className="text-xs">
              La preview verrà mostrata nel <strong>Portfolio Partner</strong> come riferimento permanente, ordinata per data e filtrabile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="save_label" className="text-xs">Etichetta nel Portfolio *</Label>
              <Input
                id="save_label"
                value={saveLabel}
                onChange={(e) => setSaveLabel(e.target.value)}
                placeholder={saveDialog?.defaultLabel}
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="save_notes" className="text-xs">Note interne (opzionale)</Label>
              <Textarea
                id="save_notes"
                value={saveNotes}
                onChange={(e) => setSaveNotes(e.target.value)}
                placeholder="es. Cliente in trattativa, da rivedere ad agosto…"
                className="min-h-[80px] text-sm"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button variant="outline" onClick={() => setSaveDialog(null)} className="h-11">Annulla</Button>
            <Button onClick={confirmSaveToPortfolio} disabled={savingPortfolio} className="h-11">
              {savingPortfolio ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvo…</> : <><Bookmark className="h-4 w-4 mr-2" /> Salva nel Portfolio</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
