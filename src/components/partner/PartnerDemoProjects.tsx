import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, ExternalLink, Pencil, Save, X, Upload,
  Sparkles, Building2, Palette, Type, ChevronDown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const SECTOR_OPTIONS: { id: string; label: string; emoji: string; demoSlug: string }[] = [
  { id: "food", label: "Ristorazione", emoji: "🍽️", demoSlug: "food" },
  { id: "bakery", label: "Pasticceria", emoji: "🧁", demoSlug: "bakery" },
  { id: "beauty", label: "Beauty / Wellness", emoji: "💇", demoSlug: "beauty" },
  { id: "healthcare", label: "Healthcare", emoji: "🏥", demoSlug: "healthcare" },
  { id: "fitness", label: "Fitness / Palestra", emoji: "💪", demoSlug: "fitness" },
  { id: "ncc", label: "NCC / Transfer", emoji: "🚗", demoSlug: "ncc" },
  { id: "hospitality", label: "Hotel / Hospitality", emoji: "🏨", demoSlug: "hospitality" },
  { id: "beach", label: "Stabilimento Balneare", emoji: "🏖️", demoSlug: "beach" },
  { id: "retail", label: "Retail / Negozio", emoji: "🛍️", demoSlug: "retail" },
  { id: "plumber", label: "Idraulico", emoji: "🔧", demoSlug: "plumber" },
  { id: "electrician", label: "Elettricista", emoji: "⚡", demoSlug: "electrician" },
  { id: "construction", label: "Edilizia", emoji: "🏗️", demoSlug: "construction" },
  { id: "gardening", label: "Giardinaggio", emoji: "🌿", demoSlug: "gardening" },
  { id: "cleaning", label: "Pulizie", emoji: "🧹", demoSlug: "cleaning" },
  { id: "garage", label: "Officina / Garage", emoji: "🔩", demoSlug: "garage" },
  { id: "photography", label: "Fotografo", emoji: "📸", demoSlug: "photography" },
  { id: "veterinary", label: "Veterinario", emoji: "🐾", demoSlug: "veterinary" },
  { id: "tattoo", label: "Tattoo Studio", emoji: "🎨", demoSlug: "tattoo" },
  { id: "childcare", label: "Asilo / Infanzia", emoji: "👶", demoSlug: "childcare" },
  { id: "education", label: "Formazione", emoji: "📚", demoSlug: "education" },
  { id: "events", label: "Eventi / Catering", emoji: "🎉", demoSlug: "events" },
  { id: "logistics", label: "Logistica", emoji: "📦", demoSlug: "logistics" },
  { id: "agriturismo", label: "Agriturismo", emoji: "🌾", demoSlug: "agriturismo" },
  { id: "legal", label: "Avvocato / Studio Legale", emoji: "⚖️", demoSlug: "legal" },
  { id: "accounting", label: "Commercialista", emoji: "📊", demoSlug: "accounting" },
];

const COLOR_PRESETS = ["#C8963E", "#1A1A2E", "#E74C3C", "#2ECC71", "#3498DB", "#8E44AD", "#E67E22", "#1ABC9C"];

interface DemoProject {
  id: string;
  user_id: string;
  sector: string;
  client_name: string;
  client_logo_url: string | null;
  primary_color: string;
  tagline: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const PartnerDemoProjects = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ sector: "", client_name: "", primary_color: "#C8963E", tagline: "", notes: "" });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [sectorOpen, setSectorOpen] = useState(false);
  const logoFileRef = useRef<HTMLInputElement>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["partner-demo-projects", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partner_demo_projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DemoProject[];
    },
    enabled: !!user?.id,
  });

  const saveMutation = useMutation({
    mutationFn: async (project: Partial<DemoProject> & { id?: string }) => {
      if (project.id) {
        const { error } = await supabase.from("partner_demo_projects").update({
          sector: project.sector,
          client_name: project.client_name,
          primary_color: project.primary_color,
          tagline: project.tagline,
          notes: project.notes,
          client_logo_url: project.client_logo_url,
          updated_at: new Date().toISOString(),
        }).eq("id", project.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("partner_demo_projects").insert({
          user_id: user!.id,
          sector: project.sector,
          client_name: project.client_name,
          primary_color: project.primary_color,
          tagline: project.tagline,
          notes: project.notes,
          client_logo_url: project.client_logo_url,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-demo-projects"] });
      resetForm();
      toast({ title: editingId ? "✅ Bozza aggiornata" : "✅ Bozza creata", description: "La demo è pronta per le presentazioni" });
    },
    onError: (e: Error) => toast({ title: "Errore", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partner_demo_projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-demo-projects"] });
      toast({ title: "🗑️ Bozza eliminata" });
    },
  });

  const resetForm = () => {
    setShowCreate(false);
    setEditingId(null);
    setForm({ sector: "", client_name: "", primary_color: "#C8963E", tagline: "", notes: "" });
    setLogoUrl(null);
  };

  const startEdit = (p: DemoProject) => {
    setEditingId(p.id);
    setForm({ sector: p.sector, client_name: p.client_name, primary_color: p.primary_color || "#C8963E", tagline: p.tagline || "", notes: p.notes || "" });
    setLogoUrl(p.client_logo_url);
    setShowCreate(true);
  };

  const handleSubmit = () => {
    if (!form.sector || !form.client_name.trim()) {
      toast({ title: "Compila i campi obbligatori", description: "Settore e nome cliente sono richiesti", variant: "destructive" });
      return;
    }
    saveMutation.mutate({ ...form, client_logo_url: logoUrl, ...(editingId ? { id: editingId } : {}) });
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    setUploadingLogo(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/demo-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("partner-assets").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("partner-assets").getPublicUrl(path);
      setLogoUrl(publicUrl);
      toast({ title: "✅ Logo caricato" });
    } catch (err: any) {
      toast({ title: "Errore upload", description: err.message, variant: "destructive" });
    } finally {
      setUploadingLogo(false);
    }
  };

  const launchDemo = (project: DemoProject) => {
    const sector = SECTOR_OPTIONS.find(s => s.id === project.sector);
    if (!sector) return;
    const params = new URLSearchParams();
    params.set("brand", project.client_name);
    params.set("color", project.primary_color || "#C8963E");
    if (project.tagline) params.set("tagline", project.tagline);
    if (project.client_logo_url) params.set("logo", project.client_logo_url);
    
    // Food sector uses restaurant page, others use demo page
    const url = project.sector === "food"
      ? `/demo/food?${params.toString()}`
      : `/demo/${sector.demoSlug}?${params.toString()}`;
    window.open(url, "_blank");
  };

  const selectedSector = SECTOR_OPTIONS.find(s => s.id === form.sector);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Bozze Demo Cliente
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">Crea demo personalizzate per ogni settore con il brand del cliente</p>
        </div>
        {!showCreate && (
          <motion.button onClick={() => { resetForm(); setShowCreate(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
            whileTap={{ scale: 0.95 }}>
            <Plus className="w-3.5 h-3.5" /> Nuova
          </motion.button>
        )}
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-card border border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">{editingId ? "Modifica Bozza" : "Nuova Bozza Demo"}</h3>
                <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>

              {/* Sector Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Settore *</label>
                <div className="relative">
                  <button onClick={() => setSectorOpen(!sectorOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-background border border-border/50 text-sm text-foreground hover:border-primary/30 transition-all">
                    {selectedSector ? (
                      <span className="flex items-center gap-2">
                        <span>{selectedSector.emoji}</span>
                        <span className="font-medium">{selectedSector.label}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Seleziona settore...</span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${sectorOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {sectorOpen && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                        className="absolute z-50 top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl bg-card border border-border shadow-2xl">
                        {SECTOR_OPTIONS.map(s => (
                          <button key={s.id} onClick={() => { setForm(f => ({ ...f, sector: s.id })); setSectorOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm hover:bg-primary/5 transition-colors ${form.sector === s.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground"}`}>
                            <span>{s.emoji}</span>
                            <span>{s.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Client Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Type className="w-3 h-3" /> Nome Cliente *
                </label>
                <input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
                  placeholder="Es. Trattoria da Mario, Studio Bianchi..."
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              {/* Tagline */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Tagline (opzionale)</label>
                <input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                  placeholder="Es. La tradizione incontra l'innovazione"
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              {/* Color Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3 h-3" /> Colore Brand
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  <input type="color" value={form.primary_color} onChange={e => setForm(f => ({ ...f, primary_color: e.target.value }))}
                    className="w-8 h-8 rounded-lg border border-border/50 cursor-pointer bg-transparent" />
                  {COLOR_PRESETS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, primary_color: c }))}
                      className={`w-6 h-6 rounded-lg border-2 transition-all ${form.primary_color === c ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Logo Cliente</label>
                <input type="file" accept="image/*" ref={logoFileRef} onChange={handleUploadLogo} className="hidden" />
                <div className="flex items-center gap-3">
                  {logoUrl && (
                    <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-lg object-cover border border-border/50" />
                  )}
                  <button onClick={() => logoFileRef.current?.click()} disabled={uploadingLogo}
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-border/50 hover:border-primary/30 bg-background transition-all disabled:opacity-50 text-xs text-muted-foreground">
                    <Upload className={`w-3.5 h-3.5 ${uploadingLogo ? "animate-pulse" : ""}`} />
                    {uploadingLogo ? "Caricamento..." : logoUrl ? "Cambia Logo" : "Carica Logo"}
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Note interne</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2} placeholder="Note per la presentazione..."
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>

              {/* Submit */}
              <motion.button onClick={handleSubmit} disabled={saveMutation.isPending}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                whileTap={{ scale: 0.97 }}>
                <Save className={`w-4 h-4 ${saveMutation.isPending ? "animate-spin" : ""}`} />
                {saveMutation.isPending ? "Salvataggio..." : editingId ? "Aggiorna Bozza" : "Crea Bozza Demo"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-card border border-border/50 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <Building2 className="w-10 h-10 text-muted-foreground/30 mx-auto" />
          <p className="text-sm text-muted-foreground">Nessuna bozza demo ancora.</p>
          <p className="text-xs text-muted-foreground">Crea la prima per mostrare Empire con il brand del tuo cliente!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, i) => {
            const sector = SECTOR_OPTIONS.find(s => s.id === project.sector);
            return (
              <motion.div key={project.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-4 rounded-2xl bg-card border border-border/50 space-y-3 relative overflow-hidden"
              >
                {/* Color accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: project.primary_color || "#C8963E" }} />

                <div className="flex items-start justify-between pt-1">
                  <div className="flex items-center gap-3 min-w-0">
                    {project.client_logo_url ? (
                      <img src={project.client_logo_url} alt="" className="w-10 h-10 rounded-xl object-cover border border-border/50 flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                        style={{ backgroundColor: `${project.primary_color}15` }}>
                        {sector?.emoji || "🏢"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-foreground truncate">{project.client_name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          {sector?.emoji} {sector?.label || project.sector}
                        </span>
                      </div>
                      {project.tagline && (
                        <p className="text-[10px] text-muted-foreground mt-1 truncate">{project.tagline}</p>
                      )}
                    </div>
                  </div>
                </div>

                {project.notes && (
                  <p className="text-[10px] text-muted-foreground bg-secondary/50 rounded-lg px-2.5 py-1.5">{project.notes}</p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <motion.button onClick={() => launchDemo(project)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
                    whileTap={{ scale: 0.97 }}>
                    <ExternalLink className="w-3.5 h-3.5" /> Lancia Demo
                  </motion.button>
                  <motion.button onClick={() => startEdit(project)}
                    className="p-2.5 rounded-xl bg-secondary hover:bg-accent transition-colors"
                    whileTap={{ scale: 0.95 }}>
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </motion.button>
                  <motion.button onClick={() => { if (confirm("Eliminare questa bozza?")) deleteMutation.mutate(project.id); }}
                    className="p-2.5 rounded-xl bg-secondary hover:bg-destructive/10 transition-colors"
                    whileTap={{ scale: 0.95 }}>
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pro Tip */}
      <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
        <p className="text-[10px] text-primary/70 leading-relaxed">
          💡 <strong>Tip vendita:</strong> Mostra la demo con il nome e logo del cliente — l'impatto emotivo è immediato. 
          Racconta uno scenario "vita reale" del loro settore e chiudi con il Review Shield™.
        </p>
      </div>
    </div>
  );
};

export default PartnerDemoProjects;
