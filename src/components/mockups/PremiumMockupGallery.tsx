/**
 * PremiumMockupGallery — /portfolio gallery (livello agenzia premium).
 *
 * Upgrade competitivo (benchmark: portfolio agenzia di riferimento):
 * - Card "progetto": DUE iPhone Pro Max affiancati (hero + seconda schermata),
 *   chip settore + sottocategoria stile, titolo brand, descrizione, hover CTA.
 * - Toolbar: ricerca testuale, filtro settore, filtro tier, contatore risultati.
 * - Deep-link condivisibile: /portfolio?p=<sector>-<variantId> apre il progetto.
 * - SEO: title/description/canonical + JSON-LD ItemList.
 * - CTA finale di conversione.
 *
 * Nessun iPhone dentro un altro iPhone: ogni frame mostra una webapp reale.
 */

import { useEffect, useMemo, useState } from "react";
import { Sparkles, Layers, Search, ArrowRight, MonitorSmartphone, X } from "lucide-react";
import { Link } from "react-router-dom";
import IPhoneProMaxFrame from "./IPhoneProMaxFrame";
import { SECTOR_MOCKUPS } from "@/data/sector-mockups";
import GlassBackButton from "@/components/glass/GlassBackButton";

type TierFilter = "all" | "primary" | "extended";

const TIER_LABELS: Record<TierFilter, string> = {
  all: "Tutti i progetti",
  primary: "Collezione Studio",
  extended: "Collezione estesa",
};

function useSeoHead(projectCount: number, styleCount: number) {
  useEffect(() => {
    const title = `Portfolio Empire — ${projectCount} progetti webapp per ${SECTOR_MOCKUPS.length} settori`;
    const description = `Portfolio Empire: ${projectCount} progetti e ${styleCount} schermate di webapp reali per ristorazione, beauty, hospitality, NCC, sport, cliniche, edilizia e retail.`;
    document.title = title.slice(0, 60);

    const setMeta = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        document.head.appendChild(el);
      }
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
      return el;
    };

    setMeta('meta[name="description"]', { name: "description", content: description.slice(0, 158) });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description.slice(0, 158) });
    setMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}/portfolio`;

    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.dataset.portfolioLd = "true";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: `${window.location.origin}/portfolio`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: projectCount,
        itemListElement: SECTOR_MOCKUPS.flatMap((g, gi) =>
          g.variants.slice(0, 4).map((v, vi) => ({
            "@type": "ListItem",
            position: gi * 10 + vi + 1,
            name: `${v.brand} — ${v.style}`,
            description: v.description,
          })),
        ),
      },
    });
    document.head.appendChild(ld);

    return () => {
      document.head.querySelectorAll('script[data-portfolio-ld="true"]').forEach((n) => n.remove());
    };
  }, [projectCount, styleCount]);
}

export default function PremiumMockupGallery() {
  const [activeSector, setActiveSector] = useState<string>("all");
  const [tier, setTier] = useState<TierFilter>("all");
  const [query, setQuery] = useState("");

  const sectors = useMemo(
    () => [{ id: "all", label: "Tutti" }, ...SECTOR_MOCKUPS.map((s) => ({ id: s.id, label: s.label }))],
    [],
  );

  const allCards = useMemo(
    () =>
      SECTOR_MOCKUPS.flatMap((g) =>
        g.variants.map((v, i) => ({
          ...v,
          sectorId: g.id,
          sectorLabel: g.label,
          sectorTagline: g.tagline,
          group: g,
          index: i,
        })),
      ),
    [],
  );

  const totalScreens = useMemo(
    () => allCards.reduce((sum, c) => sum + (c.screens?.length || 1), 0),
    [allCards],
  );

  useSeoHead(allCards.length, totalScreens);

  const cards = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allCards.filter((c) => {
      if (activeSector !== "all" && c.sectorId !== activeSector) return false;
      if (tier !== "all" && c.tier !== tier) return false;
      if (!q) return true;
      return [c.brand, c.style, c.palette, c.description, c.sectorLabel, ...(c.features || [])]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [allCards, activeSector, tier, query]);

  return (
    <section className="pglass-scope pglass-bg min-h-screen pb-28 pt-28 text-white sm:pt-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <GlassBackButton to="/" label="Home" variant="inline" className="px-4 text-xs" />
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/80">
              <Sparkles size={12} />
              Our Work · Portfolio Empire
            </div>
          </div>

          <h1 className="font-heading text-[2.1rem] font-black leading-[1.04] sm:text-5xl md:text-6xl">
            Un progetto per ogni settore.
            <br />
            <span className="bg-gradient-to-r from-[#8ef3e6] via-[#2ec4b6] to-[#0d6c7e] bg-clip-text text-transparent">
              Uno stile per ogni esigenza.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            {allCards.length} progetti, {totalScreens} schermate disegnate una per una: colore, layout,
            componenti e funzioni sono studiati sul settore. Tocca uno stile per aprire il case study completo,
            confrontare le interfacce e vedere l'intero flusso della webapp.
          </p>

          {/* Stats strip */}
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              {SECTOR_MOCKUPS.length} settori
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              {allCards.length} progetti
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              {totalScreens} schermate
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              Mobile + admin 1:1
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca brand, stile, palette o funzione…"
              aria-label="Cerca nel portfolio"
              className="h-11 w-full rounded-full border border-white/15 bg-white/[0.04] pl-9 pr-9 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/35 focus:bg-white/[0.07]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Cancella ricerca"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(TIER_LABELS) as TierFilter[]).map((t) => {
              const active = t === tier;
              return (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className="rounded-full border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition"
                  style={
                    active
                      ? { background: "rgba(255,255,255,0.14)", color: "#fff", borderColor: "rgba(255,255,255,0.45)" }
                      : { background: "transparent", color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.12)" }
                  }
                >
                  {TIER_LABELS[t]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sector filter */}
        <div className="mb-4 -mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {sectors.map((s) => {
            const active = s.id === activeSector;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSector(s.id)}
                className="shrink-0 snap-start rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition"
                style={
                  active
                    ? { background: "white", color: "#0a0b12", borderColor: "white" }
                    : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)", borderColor: "rgba(255,255,255,0.15)" }
                }
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <p className="mb-8 text-xs text-white/50" aria-live="polite">
          {cards.length} {cards.length === 1 ? "progetto" : "progetti"} in vista
          {activeSector !== "all" && ` · ${sectors.find((s) => s.id === activeSector)?.label}`}
          {query && ` · "${query}"`}
        </p>

        {/* Grid */}
        {cards.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center">
            <p className="text-sm text-white/70">Nessun progetto con questi filtri.</p>
            <button
              onClick={() => {
                setQuery("");
                setActiveSector("all");
                setTier("all");
              }}
              className="mt-4 rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0a0b12]"
            >
              Azzera filtri
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => {
              const second = c.screens?.[1]?.image;
              return (
                <Link
                  key={`${c.sectorId}-${c.id}`}
                  to={`/portfolio/${c.sectorId}?style=${encodeURIComponent(c.id)}`}
                  className="pglass group cursor-pointer overflow-hidden transition duration-500 hover:-translate-y-1"
                  aria-label={`Apri il progetto ${c.brand}`}
                >
                  {/* Preview: due iPhone affiancati, verticali, su pannello chiaro (leggibilità max) */}
                  <div
                    className="relative flex h-[340px] items-center justify-center gap-2.5 overflow-hidden px-5 pt-7 sm:h-[370px]"
                    style={{
                      background:
                        "radial-gradient(120% 90% at 50% 0%, #f4f5f7 0%, #e7e9ee 55%, #d8dbe2 100%)",
                    }}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-[0.10]"
                      style={{
                        backgroundImage: "radial-gradient(circle, #0a0b12 1px, transparent 1.5px)",
                        backgroundSize: "18px 18px",
                      }}
                    />
                    <div className="translate-y-0 transition-transform duration-500 group-hover:-translate-y-2">
                      <IPhoneProMaxFrame
                        src={c.screen}
                        alt={`${c.brand} — ${c.style} · schermata principale`}
                        width={138}
                        glow={false}
                      />
                    </div>
                    {second && (
                      <div className="translate-y-5 transition-transform duration-500 group-hover:translate-y-3">
                        <IPhoneProMaxFrame
                          src={second}
                          alt={`${c.brand} — ${c.screens[1].label}`}
                          width={138}
                          glow={false}
                        />
                      </div>
                    )}

                    <span className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#0a0b12]/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                      Vedi progetto <ArrowRight size={11} />
                    </span>
                  </div>


                  {/* Info */}
                  <div className="border-t border-white/10 px-5 pb-5 pt-4">
                    <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/80">
                        {c.sectorLabel}
                      </span>
                      <span className="rounded-full border border-white/12 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/60">
                        {c.style}
                      </span>
                    </div>
                    <h2 className="text-base font-semibold text-white sm:text-lg">{c.brand}</h2>
                    <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-white/60 sm:text-xs">
                      {c.description}
                    </p>
                    <div className="mt-3.5 flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-white/55">
                      <span className="inline-flex items-center gap-1.5">
                        <MonitorSmartphone size={11} />
                        {c.screens?.length || 1} schermate · {c.palette}
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold uppercase tracking-[0.14em] text-white/70 transition group-hover:gap-2">
                        Apri <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA finale */}
        <div className="mt-20 overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent px-6 py-10 text-center sm:px-12 sm:py-14">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/75">
            <Layers size={12} /> Il prossimo progetto è il tuo
          </div>
          <h2 className="mx-auto max-w-2xl font-heading text-2xl font-black leading-tight sm:text-4xl">
            Scegli lo stile, noi consegniamo la webapp identica al mockup.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/65">
            Ogni progetto del portfolio è replicabile 1:1 sul tuo brand: sito, area clienti, admin e agenti AI.
            Ti mostriamo il mockup prima di iniziare, senza impegno.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#0a0b12] transition hover:bg-white/90"
            >
              Richiedi il tuo mockup <ArrowRight size={13} />
            </a>
            <a
              href="/#pricing"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white/85 transition hover:bg-white/10"
            >
              Vedi i pacchetti
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}
