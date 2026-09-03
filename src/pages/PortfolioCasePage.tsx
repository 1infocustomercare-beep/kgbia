/**
 * PortfolioCasePage — case study per SINGOLO SETTORE.
 *
 * Struttura allineata ai case study di riferimento (lowengeldagency.com/<progetto>),
 * con il design system glass Empire:
 *  1. Barra alta compatta: "← Portfolio / Settore"
 *  2. Tabs stile sticky: "Tutti" + un tab per stile + tab Desktop
 *  3. Hero: card scura (badge, titolo, descrizione, meta Cliente/Anno/Piattaforma) + iPhone hero
 *  4. "TUTTE LE SCHERMATE": per ogni stile una riga di 4 iPhone con etichetta sotto
 *  5. Riga Desktop nativa del settore
 *  6. Click su qualsiasi schermata → apertura fullscreen con frecce e contatore
 *
 * Additivo: non modifica /portfolio (catalogo) né la home.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CalendarDays, Layers, Monitor, Smartphone, Sparkles, UserRound } from "lucide-react";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import IPhoneProMaxFrame from "@/components/mockups/IPhoneProMaxFrame";
import DesktopBrowserFrame from "@/components/mockups/DesktopBrowserFrame";
import CaseScreenLightbox, { type CaseScreenItem } from "@/components/mockups/CaseScreenLightbox";
import { SECTOR_MOCKUPS, getSectorGroup, type SectorMockupVariant } from "@/data/sector-mockups";
import { getSectorDesktopShot } from "@/data/sector-desktop-mockups";

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Accenti coerenti col brand Empire (glass midnight) ma NON tutti blu:
 * ogni stile riceve il proprio accento, così la pagina respira colore.
 */
const ACCENTS = [
  "178 74% 48%", // aqua Empire
  "160 62% 46%", // smeraldo
  "43 88% 60%",  // oro
  "14 84% 62%",  // corallo
  "268 72% 68%", // viola liquido
  "199 88% 58%", // azzurro elettrico
  "334 74% 64%", // rosa magenta
  "88 58% 52%",  // lime
];
const accentAt = (i: number) => ACCENTS[((i % ACCENTS.length) + ACCENTS.length) % ACCENTS.length];

/**
 * Il catalogo interno contiene anche prove, identità generate e vecchie cover.
 * Nella pagina pubblica entrano soltanto set editoriali completi, con quattro
 * schermate realmente appartenenti allo stesso progetto. La firma delle URL
 * impedisce inoltre che lo stesso set venga esposto più volte con nomi diversi.
 */
const curatePublicVariants = (items: SectorMockupVariant[]): SectorMockupVariant[] => {
  const approvedStudio = items.filter(
    (variant) =>
      (variant.screens?.length ?? 0) >= 4 &&
      variant.source === "studio" &&
      !variant.id.startsWith("studio-"),
  );
  const candidates = approvedStudio.length
    ? approvedStudio
    : items.filter(
        (variant) =>
          (variant.screens?.length ?? 0) >= 4 &&
          variant.source === "reference",
      );
  const signatures = new Set<string>();
  return candidates.filter((variant) => {
    const screens = variant.screens ?? [];
    const signature = screens.map((screen) => screen.image).join("|");
    if (signatures.has(signature)) return false;
    signatures.add(signature);
    return true;
  });
};

export default function PortfolioCasePage() {
  const { sectorId = "" } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const group = useMemo(() => getSectorGroup(sectorId), [sectorId]);

  const variants = useMemo<SectorMockupVariant[]>(() => {
    if (!group) return [];
    return curatePublicVariants(group.variants).sort((a, b) => {
      if (a.tier !== b.tier) return a.tier === "primary" ? -1 : 1;
      return (b.screens?.length ?? 1) - (a.screens?.length ?? 1);
    });
  }, [group]);

  const styleParam = params.get("style") ?? "all";
  const [filter, setFilter] = useState<string>(styleParam);
  useEffect(() => setFilter(styleParam), [styleParam]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [sectorId]);

  useEffect(() => {
    if (!group) return;
    document.title = `${group.label} · Portfolio mockup premium | Empire IA`;
    const desc = `${variants.length} stili di webapp per ${group.label}: ${group.tagline}`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc.slice(0, 158));
  }, [group, variants.length]);

  const selected = useMemo(
    () => (filter === "all" ? variants : variants.filter((v) => v.id === filter)),
    [variants, filter],
  );
  /** Stili con sequenza completa: riga dedicata con tutte le schermate. */
  const shown = useMemo(
    () => (filter === "desktop" ? [] : selected.filter((v) => (v.screens?.length ?? 1) > 1)),
    [selected, filter],
  );
  /** Stili con una sola schermata: griglia compatta di confronto. */
  const compact = useMemo(
    () => (filter === "all" ? selected.filter((v) => (v.screens?.length ?? 1) <= 1) : []),
    [selected, filter],
  );

  const desktopShot = getSectorDesktopShot(group?.id);
  const showDesktopRow = Boolean(desktopShot) && (filter === "all" || filter === "desktop");

  /**
   * Lista piatta di TUTTE le schermate visibili: il fullscreen scorre l'intera
   * pagina (mobile + desktop) con contatore progressivo, come nei riferimenti.
   */
  const lightboxItems = useMemo<CaseScreenItem[]>(() => {
    const items: CaseScreenItem[] = [];
    shown.forEach((v) => {
      (v.screens ?? []).forEach((s) => {
        items.push({ image: s.image, label: s.label, brand: v.brand, style: v.style, kind: "mobile" });
      });
    });
    compact.forEach((v) => {
      items.push({
        image: v.screens?.[0]?.image ?? v.screen,
        label: v.palette,
        brand: v.brand,
        style: v.style,
        kind: "mobile",
      });
    });
    if (showDesktopRow && desktopShot && group) {
      items.push({
        image: desktopShot,
        label: "Versione desktop",
        brand: variants[0]?.brand ?? group.label,
        style: `${group.label} Desktop`,
        kind: "desktop",
      });
    }
    return items;
  }, [shown, compact, showDesktopRow, desktopShot, group, variants]);

  const openScreen = useCallback(
    (image: string) => {
      const i = lightboxItems.findIndex((item) => item.image === image);
      setLightboxIndex(i >= 0 ? i : 0);
    },
    [lightboxItems],
  );

  const setStyle = (id: string) => {
    setFilter(id);
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("style");
    else next.set("style", id);
    setParams(next, { replace: true });
  };

  if (!group || variants.length === 0) {
    return (
      <div className="pglass-scope pglass-bg min-h-screen">
        <PrestigeTheme />
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 py-32 text-center">
          <h1 className="prestige-display text-3xl" style={{ color: "hsl(var(--pr-gold-light))" }}>
            Settore non trovato
          </h1>
          <p className="text-sm" style={{ color: "hsl(var(--pr-gold-light) / 0.7)" }}>
            Scegli un settore dal portfolio completo.
          </p>
          <Link to="/portfolio" className="pglass-btn">
            Vai al portfolio
          </Link>
        </div>
      </div>
    );
  }

  const sectorIndex = SECTOR_MOCKUPS.findIndex((g) => g.id === group.id);
  const heroAccent = accentAt(sectorIndex);
  const lead = variants[0];
  const heroScreen = lead.screens?.[0]?.image ?? lead.screen;
  const totalScreens = variants.reduce((n, v) => n + (v.screens?.length || 1), 0);
  const otherSectors = SECTOR_MOCKUPS.filter(
    (g) => g.id !== group.id && g.variants.some((v) => v.source === "studio"),
  ).slice(0, 8);

  const meta = [
    { icon: UserRound, k: "Cliente", v: lead.brand },
    { icon: CalendarDays, k: "Anno", v: String(CURRENT_YEAR) },
    { icon: Smartphone, k: "Piattaforma", v: "iOS · Web app" },
    { icon: Layers, k: "Stili", v: `${variants.length} · ${totalScreens} schermate` },
  ];

  return (
    <div
      className="pglass-scope pglass-bg min-h-screen"
      style={{ ["--acc-hero" as string]: heroAccent }}
    >
      <PrestigeTheme />

      {/* ───────── BARRA ALTA: breadcrumb compatto ───────── */}
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-5 pt-7 lg:px-10">
        <button
          type="button"
          onClick={() => navigate("/portfolio")}
          className="pglass-btn-ghost pglass-press group !px-4 !py-2 !text-[11px] !tracking-[0.2em]"
          aria-label="Torna al portfolio"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Portfolio
        </button>
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em]">
          <span style={{ color: "hsl(var(--pr-text-on-dark) / 0.4)" }}>/</span>
          <span style={{ color: "hsl(var(--acc-hero))" }}>{group.label}</span>
        </div>
      </div>

      {/* ───────── TABS STILE (sticky) ───────── */}
      <div className="pglass-stickybar sticky top-0 z-30 mt-5">
        <div className="mx-auto max-w-7xl overflow-x-auto px-5 py-3 [scrollbar-width:none] lg:px-10 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-2">
            {[
              { id: "all", label: `Tutti · ${variants.length}` },
              ...variants.map((v) => ({ id: v.id, label: v.style })),
              ...(desktopShot ? [{ id: "desktop", label: "Desktop" }] : []),
            ].map((chip) => {
              const on = filter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setStyle(chip.id)}
                  aria-pressed={on}
                  className="pglass-chip pglass-chip-dark"
                  style={
                    on
                      ? {
                          borderColor: "hsl(var(--acc-hero) / 0.55)",
                          background: "hsl(var(--acc-hero) / 0.16)",
                          color: "hsl(var(--acc-hero))",
                        }
                      : undefined
                  }
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ───────── HERO: card editoriale + iPhone ───────── */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 75% at 12% 0%, hsl(var(--pr-emerald) / 0.55), transparent 62%), radial-gradient(80% 60% at 88% 4%, hsl(var(--acc-hero) / 0.22), transparent 66%), radial-gradient(70% 60% at 62% 100%, hsl(43 88% 60% / 0.10), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-10 lg:px-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            {/* card scura */}
            <div
              className="pglass p-6 sm:p-9"
              style={{
                ["--acc" as string]: "var(--acc-hero)",
                borderColor: "hsl(var(--acc-hero) / 0.3)",
                boxShadow: "0 50px 120px -80px hsl(var(--acc-hero) / 0.95), inset 0 1px 0 hsl(0 0% 100% / 0.08)",
              }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="pglass-tag"
                  style={{
                    background: "linear-gradient(160deg, hsl(var(--acc-hero) / 0.24), hsl(var(--acc-hero) / 0.06))",
                    borderColor: "hsl(var(--acc-hero) / 0.45)",
                    color: "hsl(var(--acc-hero))",
                  }}
                >
                  App design
                </span>
                <span className="pglass-tag">{lead.palette}</span>
                <span className="pglass-tag">
                  <Sparkles size={11} /> {variants.length} direzioni visive
                </span>
              </div>

              <h1
                className="prestige-display mt-5 text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl"
                style={{
                  background:
                    "linear-gradient(115deg, hsl(var(--pr-ivory)) 0%, hsl(var(--acc-hero)) 46%, hsl(43 88% 66%) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {group.label}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: "hsl(var(--pr-text-on-dark) / 0.88)" }}>
                {group.tagline}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-dark) / 0.72)" }}>
                Ogni stile è un sistema completo — tipografia, palette, griglie, componenti e micro-interazioni —
                con la sequenza integrale delle schermate mobile e la versione desktop, così puoi confrontarli
                fianco a fianco e aprirli a tutto schermo.
              </p>

              <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {meta.map(({ icon: Icon, k, v }, mi) => (
                  <div
                    key={k}
                    className="rounded-2xl border p-3"
                    style={{
                      ["--acc" as string]: accentAt(mi + sectorIndex + 1),
                      borderColor: "hsl(var(--acc) / 0.26)",
                      background: "hsl(var(--acc) / 0.06)",
                    }}
                  >
                    <dt
                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: "hsl(var(--acc))" }}
                    >
                      <Icon size={11} /> {k}
                    </dt>
                    <dd className="mt-1.5 text-[13px] font-semibold" style={{ color: "hsl(var(--pr-text-on-dark))" }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* iPhone hero */}
            <div className="flex justify-center lg:justify-end">
              <IPhoneProMaxFrame
                src={heroScreen}
                alt={`${lead.brand} — ${lead.style}`}
                width={300}
                loading="eager"
                onClick={() => openScreen(heroScreen)}
                className="max-w-[290px]"
                style={{ width: "100%", height: "auto", aspectRatio: "9 / 19.5" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ───────── TUTTE LE SCHERMATE ───────── */}
      <main className="mx-auto max-w-7xl px-5 pb-24 lg:px-10">
        <div
          className="flex items-center gap-3 pb-2 pt-4 text-[10px] font-bold uppercase tracking-[0.3em]"
          style={{ color: "hsl(var(--pr-muted-on-dark) / 0.6)" }}
        >
          Tutte le schermate
          <span aria-hidden className="h-px flex-1" style={{ background: "hsl(var(--acc-hero) / 0.22)" }} />
        </div>

        {shown.map((v) => {
          const idx = variants.findIndex((x) => x.id === v.id);
          const screens = v.screens?.length ? v.screens : [{ label: "Home", caption: "", image: v.screen }];
          return (
            <section
              key={v.id}
              className="pglass my-8 p-5 sm:p-8"
              style={{
                ["--acc" as string]: accentAt(idx + sectorIndex + 1),
                borderColor: "hsl(var(--acc) / 0.3)",
                boxShadow: "0 44px 110px -70px hsl(var(--acc) / 0.9), inset 0 1px 0 hsl(0 0% 100% / 0.08)",
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.26em]"
                    style={{ color: "hsl(var(--acc))" }}
                  >
                    <span
                      aria-hidden
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: "hsl(var(--acc))", boxShadow: "0 0 12px hsl(var(--acc) / 0.9)" }}
                    />
                    {v.style}
                  </div>
                  <h2
                    className="prestige-display mt-2 text-2xl sm:text-3xl"
                    style={{
                      background: "linear-gradient(110deg, hsl(var(--pr-ivory)), hsl(var(--acc)) 92%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {v.brand}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-dark) / 0.8)" }}>
                    {v.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="pglass-tag"
                    style={{
                      background: "linear-gradient(160deg, hsl(var(--acc) / 0.22), hsl(var(--acc) / 0.06))",
                      borderColor: "hsl(var(--acc) / 0.42)",
                      color: "hsl(var(--acc))",
                    }}
                  >
                    {v.palette}
                  </span>
                  <span className="pglass-tag">
                    {screens.length} {screens.length === 1 ? "schermata" : "schermate"}
                  </span>
                </div>
              </div>

              {v.features?.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {v.features.slice(0, 6).map((f) => (
                    <li
                      key={f}
                      className="rounded-lg px-2.5 py-1 text-[11px]"
                      style={{
                        background: "hsl(var(--acc) / 0.07)",
                        color: "hsl(var(--pr-text-on-dark) / 0.82)",
                        border: "1px solid hsl(var(--acc) / 0.22)",
                      }}
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              {/* Griglia schermate: confronto integrale, click = fullscreen */}
              <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-4">
                {screens.map((s, si) => (
                  <figure key={`${v.id}-${si}`} className="group flex flex-col items-center">
                    <div
                      className="pglass w-full p-3 transition-transform duration-300 group-hover:-translate-y-1.5"
                      style={{ borderColor: "hsl(var(--acc) / 0.24)" }}
                    >
                      <IPhoneProMaxFrame
                        src={s.image}
                        alt={`${v.brand} — ${v.style} — ${s.label}`}
                        width={200}
                        onClick={() => openScreen(s.image)}
                        className="mx-auto !w-full"
                        style={{ width: "100%", height: "auto", aspectRatio: "9 / 19.5" }}
                      />
                    </div>
                    <figcaption
                      className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.22em]"
                      style={{ color: "hsl(var(--acc) / 0.9)" }}
                    >
                      {s.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          );
        })}

        {/* ───────── RIGA DESKTOP NATIVA ───────── */}
        {showDesktopRow && desktopShot && (
          <section
            className="pglass my-8 p-5 sm:p-8"
            style={{
              ["--acc" as string]: accentAt(sectorIndex + 2),
              borderColor: "hsl(var(--acc) / 0.3)",
            }}
          >
            <div
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.26em]"
              style={{ color: "hsl(var(--acc))" }}
            >
              <Monitor size={12} /> Versione desktop
            </div>
            <h2 className="prestige-display mt-2 text-2xl sm:text-3xl" style={{ color: "hsl(var(--pr-ivory))" }}>
              {group.label} · layout desktop
            </h2>
            <p className="mt-2 max-w-2xl text-sm" style={{ color: "hsl(var(--pr-muted-on-dark) / 0.78)" }}>
              Lo stesso sistema visivo su schermo grande: griglia estesa, navigazione persistente e sezioni
              editoriali. Clicca per aprirlo a tutto schermo.
            </p>
            <div className="mt-7">
              <DesktopBrowserFrame
                src={desktopShot}
                alt={`${group.label} — versione desktop`}
                label={`${group.id}.empire-ia.app`}
                native
                onClick={() => openScreen(desktopShot)}
              />
            </div>
          </section>
        )}

        {/* ───────── GRIGLIA COMPATTA: altre direzioni visive ───────── */}
        {compact.length > 0 && (
          <section className="pglass my-8 p-5 sm:p-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.26em]" style={{ color: "hsl(43 88% 62%)" }}>
              Altre direzioni visive · {compact.length}
            </div>
            <h2 className="prestige-display mt-2 text-2xl sm:text-3xl" style={{ color: "hsl(var(--pr-ivory))" }}>
              Confronto rapido degli stili
            </h2>
            <p className="mt-2 max-w-2xl text-sm" style={{ color: "hsl(var(--pr-muted-on-dark) / 0.75)" }}>
              Ogni stile ha tipografia, palette e componenti completamente diversi tra una direzione e l'altra.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {compact.map((v) => {
                const idx = variants.findIndex((x) => x.id === v.id);
                const img = v.screens?.[0]?.image ?? v.screen;
                return (
                  <figure
                    key={v.id}
                    className="group flex flex-col items-center"
                    style={{ ["--acc" as string]: accentAt(idx + sectorIndex + 1) }}
                  >
                    <div
                      className="pglass w-full p-2.5 transition-transform duration-300 group-hover:-translate-y-1.5"
                      style={{ borderColor: "hsl(var(--acc) / 0.26)" }}
                    >
                      <IPhoneProMaxFrame
                        src={img}
                        alt={`${v.brand} — ${v.style}`}
                        width={170}
                        onClick={() => openScreen(img)}
                        className="mx-auto !w-full"
                        style={{ width: "100%", height: "auto", aspectRatio: "9 / 19.5" }}
                      />
                    </div>
                    <figcaption className="mt-3 text-center">
                      <span className="block text-xs font-semibold" style={{ color: "hsl(var(--pr-ivory))" }}>
                        {v.brand}
                      </span>
                      <span className="mt-0.5 block text-[10px] uppercase tracking-[0.16em]" style={{ color: "hsl(var(--acc))" }}>
                        {v.palette}
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        )}

        {/* ───────── ALTRI SETTORI ───────── */}
        {otherSectors.length > 0 && (
          <section className="py-16">
            <h2 className="prestige-display text-2xl sm:text-3xl" style={{ color: "hsl(var(--pr-ivory))" }}>
              Altri settori
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {otherSectors.map((g) => (
                <Link key={g.id} to={`/portfolio/${g.id}`} className="pglass-chip pglass-chip-dark">
                  {g.label} <ArrowUpRight size={13} />
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/demo" className="pglass-btn">
                Apri i siti demo live <ArrowUpRight size={16} />
              </Link>
              <Link to="/portfolio" className="pglass-btn-ghost">
                Portfolio completo <ArrowUpRight size={16} />
              </Link>
            </div>
          </section>
        )}
      </main>

      <CaseScreenLightbox
        items={lightboxItems}
        index={lightboxIndex}
        accent={heroAccent}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
