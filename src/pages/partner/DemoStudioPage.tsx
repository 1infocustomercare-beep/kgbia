/**
 * Demo Studio — Pannello dedicato gestione siti demo Full Power
 * /partner/demo-studio
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, Eye, MessageCircle, ArrowLeft, ExternalLink, Loader2, RefreshCw, BarChart3, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { DemoSite } from "@/hooks/useDemoSiteGenerator";

export default function DemoStudioPage() {
  const { user } = useAuth();
  const [sites, setSites] = useState<DemoSite[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("demo_sites" as any)
      .select("*")
      .eq("owner_id", user.id)
      .is("archived_at", null)
      .order("created_at", { ascending: false });
    if (!error && data) setSites(data as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const archive = async (id: string) => {
    if (!confirm("Archiviare questo sito demo?")) return;
    const { error } = await supabase
      .from("demo_sites" as any)
      .update({ archived_at: new Date().toISOString() } as any)
      .eq("id", id);
    if (!error) { toast({ title: "Archiviato" }); load(); }
  };

  const stats = {
    total: sites.length,
    ready: sites.filter(s => s.status === "ready").length,
    views: sites.reduce((sum, s) => sum + (s.view_count || 0), 0),
    converted: sites.filter(s => s.conversion_status === "converted").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/partner" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Partner
          </Link>
          <button onClick={load} className="p-2 rounded-lg hover:bg-muted">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-2">
            <Rocket className="w-7 h-7 text-amber-400" /> Demo Studio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestisci tutti i siti demo Full Power generati per i tuoi lead.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Totali", value: stats.total, color: "text-foreground" },
            { label: "Attivi", value: stats.ready, color: "text-emerald-400" },
            { label: "Visite", value: stats.views, color: "text-blue-400" },
            { label: "Convertiti", value: stats.converted, color: "text-amber-400" },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-2xl bg-card border border-border/50">
              <div className="text-[10px] uppercase text-muted-foreground">{s.label}</div>
              <div className={`text-2xl font-display font-bold mt-1 ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Sites list */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : sites.length === 0 ? (
          <div className="p-12 rounded-2xl bg-card border border-dashed border-border text-center">
            <Rocket className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm font-semibold">Nessun sito demo generato</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Vai nei lead per generare il primo sito Full Power.
            </p>
            <Link to="/partner/leads" className="inline-block px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-semibold">
              Apri Lead Engine
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sites.map((site, i) => (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-4 rounded-2xl bg-card border border-border/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">{site.business_name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        site.status === "ready" ? "bg-emerald-500/20 text-emerald-300" :
                        site.status === "generating" ? "bg-amber-500/20 text-amber-300" :
                        "bg-red-500/20 text-red-300"
                      }`}>{site.status}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                      <span className="uppercase">{site.sector}</span>
                      {site.template_variant && <><span>•</span><span>{site.template_variant}</span></>}
                      <span>•</span>
                      <span>{new Date(site.created_at).toLocaleDateString("it-IT")}</span>
                    </div>
                  </div>
                  <button onClick={() => archive(site.id)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {site.view_count} visite</span>
                  <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {site.cta_click_count} CTA</span>
                  {site.reuse_count > 0 && <span>♻️ {site.reuse_count} riusi</span>}
                </div>

                {site.status === "ready" && (
                  <div className="flex flex-wrap gap-2">
                    {site.preview_url && (
                      <a href={site.preview_url} target="_blank" rel="noopener"
                        className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium flex items-center gap-1 hover:bg-blue-500/20">
                        <ExternalLink className="w-3 h-3" /> Apri Preview
                      </a>
                    )}
                    {site.whatsapp_link && (
                      <a href={site.whatsapp_link} target="_blank" rel="noopener"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-1 hover:bg-emerald-500/20">
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
