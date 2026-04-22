/**
 * Demo Studio — Hub centrale per generare e gestire siti demo Full Power
 * /partner/demo-studio
 *
 * REGOLA D'ORO: niente generazione "standard". Ogni sito demo nasce da un
 * mockup approvato (catalogo Mockup Suite) e ne è la replica 1:1 al 100%
 * (design, palette, font, layout, copy).
 *
 * Pannelli:
 *  1. Mockup approvati pronti → bottone "Genera Sito Demo Full Power"
 *  2. Siti demo già generati → preview/admin/WhatsApp + riuso
 */
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Rocket,
  Eye,
  MessageCircle,
  ArrowLeft,
  ExternalLink,
  Loader2,
  RefreshCw,
  Smartphone,
  Sparkles,
  Layers,
  Repeat2,
  Star,
  Trash2,
  Wand2,
} from "lucide-react";
import { useDemoVault, type VaultDemo } from "@/hooks/useDemoVault";
import { useMockupSuiteVault, type VaultMockupSuite } from "@/hooks/useMockupSuiteVault";
import { GenerateSiteFromMockupDialog } from "@/components/partner/GenerateSiteFromMockupDialog";
import { DemoStudioPresentationMode } from "@/components/partner/DemoStudioPresentationMode";
import { toast } from "sonner";
import { Play } from "lucide-react";

export default function DemoStudioPage() {
  const vault = useDemoVault();
  const mockupVault = useMockupSuiteVault();
  const [generateSuite, setGenerateSuite] = useState<VaultMockupSuite | null>(null);
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [presentationInitialId, setPresentationInitialId] = useState<string | undefined>();
  const [search, setSearch] = useState("");

  const refresh = async () => {
    await Promise.all([vault.fetchAll(), mockupVault.fetchAll?.() ?? Promise.resolve()]);
  };

  const readyMockups = useMemo(
    () =>
      mockupVault.suites
        .filter((s) => s.status === "complete")
        .filter(
          (s) =>
            !search.trim() ||
            s.business_name.toLowerCase().includes(search.toLowerCase()) ||
            (s.business_sector || "").toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
    [mockupVault.suites, search],
  );

  const generatedSites = useMemo(
    () =>
      vault.demos
        .filter(
          (d) =>
            !search.trim() ||
            d.display_name.toLowerCase().includes(search.toLowerCase()) ||
            d.original_lead_name.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => {
          if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1;
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }),
    [vault.demos, search],
  );

  const stats = {
    mockupsReady: mockupVault.suites.filter((s) => s.status === "complete").length,
    sitesGenerated: vault.demos.length,
    totalReuses: vault.demos.reduce((sum, d) => sum + (d.reuse_count || 0), 0),
    favorites: vault.demos.filter((d) => d.is_favorite).length,
  };

  const loading = vault.loading || mockupVault.loading;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/partner"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Partner
          </Link>
          <button
            onClick={refresh}
            className="p-2 rounded-lg hover:bg-muted"
            aria-label="Aggiorna"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-2">
              <Rocket className="w-7 h-7 text-amber-400" /> Demo Studio Full Power
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ogni sito demo nasce da un <span className="text-amber-300 font-semibold">mockup approvato</span> e ne è la replica 1:1 — zero template generici.
            </p>
          </div>
          <button
            onClick={() => {
              setPresentationInitialId(undefined);
              setPresentationOpen(true);
            }}
            disabled={stats.mockupsReady === 0}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-violet-500/30 hover:from-violet-400 hover:to-fuchsia-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-white" /> Pronta da mostrare
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Mockup pronti", value: stats.mockupsReady, color: "text-violet-300", icon: Smartphone },
            { label: "Siti generati", value: stats.sitesGenerated, color: "text-emerald-300", icon: Layers },
            { label: "Riusi totali", value: stats.totalReuses, color: "text-blue-300", icon: Repeat2 },
            { label: "Preferiti", value: stats.favorites, color: "text-amber-300", icon: Star },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="p-4 rounded-2xl bg-card border border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-muted-foreground">{s.label}</span>
                  <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                </div>
                <div className={`text-2xl font-display font-bold mt-1 ${s.color}`}>{s.value}</div>
              </div>
            );
          })}
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca per nome attività, settore o lead..."
          className="w-full px-4 py-2.5 rounded-xl bg-card border border-border text-sm outline-none focus:border-amber-500/50"
        />

        {/* SECTION 1: Mockup approvati pronti per generare */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-display font-bold flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-violet-400" />
              Mockup pronti per generare ({readyMockups.length})
            </h2>
            <Link
              to="/partner/preview"
              className="text-xs text-violet-300 hover:text-violet-200 flex items-center gap-1"
            >
              <Wand2 className="w-3 h-3" /> Nuovo mockup
            </Link>
          </div>

          {loading && readyMockups.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : readyMockups.length === 0 ? (
            <div className="p-8 rounded-2xl bg-card border border-dashed border-border text-center">
              <Smartphone className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm font-semibold">Nessun mockup approvato</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Crea un Mockup Suite prima — il sito demo ne replicherà ogni dettaglio.
              </p>
              <Link
                to="/partner/preview"
                className="inline-block px-4 py-2 rounded-lg bg-violet-500 text-white text-sm font-semibold"
              >
                Apri Mockup Suite Generator
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {readyMockups.map((suite, i) => (
                <motion.div
                  key={suite.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-2xl bg-card border border-border/50 hover:border-amber-500/40 transition-colors space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: suite.primary_color || "#a78bfa" }}
                    >
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{suite.business_name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-muted-foreground">
                        {suite.template_variant && (
                          <span className="px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300">
                            {suite.template_variant}
                          </span>
                        )}
                        {suite.business_sector && (
                          <span className="px-1.5 py-0.5 rounded bg-muted">{suite.business_sector}</span>
                        )}
                        {suite.business_city && <span>· {suite.business_city}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setGenerateSuite(suite)}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold flex items-center justify-center gap-1.5 hover:from-amber-400 hover:to-amber-500 transition-colors"
                    >
                      <Rocket className="w-3.5 h-3.5" /> Genera Sito
                    </button>
                    <button
                      onClick={() => {
                        setPresentationInitialId(suite.id);
                        setPresentationOpen(true);
                      }}
                      className="px-3 py-2 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-200 text-xs font-bold flex items-center gap-1.5 hover:bg-violet-500/25 transition-colors"
                      title="Modalità presentazione cliente"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Mostra
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2: Siti già generati */}
        <section className="space-y-3">
          <h2 className="text-base font-display font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Siti demo generati ({generatedSites.length})
          </h2>

          {generatedSites.length === 0 ? (
            <div className="p-8 rounded-2xl bg-card border border-dashed border-border text-center">
              <Layers className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm font-semibold">Nessun sito demo generato</p>
              <p className="text-xs text-muted-foreground mt-1">
                Scegli un mockup qui sopra e premi <strong>Genera</strong>. Ogni sito è la replica 1:1 del mockup.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {generatedSites.map((site, i) => (
                <DemoSiteRow
                  key={site.id}
                  site={site}
                  delay={i * 0.03}
                  onToggleFav={() => vault.toggleFavorite(site.id, site.is_favorite)}
                  onArchive={async () => {
                    if (!confirm("Archiviare questo sito demo?")) return;
                    await vault.archiveDemo(site.id);
                    toast.success("Archiviato");
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Dialog generazione 1:1 dal mockup (replica esatta) */}
      <GenerateSiteFromMockupDialog
        open={!!generateSuite}
        onOpenChange={(o) => !o && setGenerateSuite(null)}
        suite={generateSuite}
      />
    </div>
  );
}

function DemoSiteRow({
  site,
  delay,
  onToggleFav,
  onArchive,
}: {
  site: VaultDemo;
  delay: number;
  onToggleFav: () => void;
  onArchive: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-4 rounded-2xl bg-card border border-border/50 space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">{site.display_name}</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              ready
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
            <span className="uppercase">{site.sector}</span>
            {site.template_variant && (
              <>
                <span>•</span>
                <span className="text-violet-300">{site.template_variant}</span>
              </>
            )}
            <span>•</span>
            <span>{new Date(site.created_at).toLocaleDateString("it-IT")}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleFav}
            className="p-1.5 rounded hover:bg-muted"
            aria-label="Preferito"
          >
            <Star
              className={`w-3.5 h-3.5 ${site.is_favorite ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`}
            />
          </button>
          <button
            onClick={onArchive}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-red-400"
            aria-label="Archivia"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" /> Lead originale: {site.original_lead_name}
        </span>
        {site.reuse_count > 0 && <span>♻️ {site.reuse_count} riusi</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        {site.preview_url && (
          <a
            href={site.preview_url}
            target="_blank"
            rel="noopener"
            className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium flex items-center gap-1 hover:bg-blue-500/20"
          >
            <ExternalLink className="w-3 h-3" /> Apri Preview
          </a>
        )}
        {site.admin_url && (
          <a
            href={site.admin_url}
            target="_blank"
            rel="noopener"
            className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium flex items-center gap-1 hover:bg-violet-500/20"
          >
            <Sparkles className="w-3 h-3" /> Admin
          </a>
        )}
        {site.outreach_payload?.whatsapp_link && (
          <a
            href={site.outreach_payload.whatsapp_link}
            target="_blank"
            rel="noopener"
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-1 hover:bg-emerald-500/20"
          >
            <MessageCircle className="w-3 h-3" /> WhatsApp
          </a>
        )}
      </div>
    </motion.div>
  );
}
