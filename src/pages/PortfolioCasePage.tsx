/**
 * PortfolioCasePage — pagina caso studio per SINGOLO SETTORE.
 *
 * Struttura (ispirata a lowengeldagency.com/<progetto>, migliorata):
 *  1. Breadcrumb + hero editoriale: settore, claim, descrizione, meta (Cliente / Anno / Piattaforma / Stili)
 *  2. Chip filtro stile ("Tutti" + un chip per ogni variante) sticky
 *  3. Per ogni stile: header con brand, palette, features, poi la RIGA COMPLETA
 *     di tutte le schermate in iPhone Pro Max con etichetta sotto (confronto 1:1)
 *  4. Ogni schermata è mostrata in chiaro (mobile, tablet, desktop): nessun overlay
 *
 * Additivo: non modifica /portfolio (catalogo) né la home.
 */

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CalendarDays, Layers, Smartphone, Sparkles, UserRound } from "lucide-react";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import IPhoneProMaxFrame from "@/components/mockups/IPhoneProMaxFrame";
import DesktopBrowserFrame from "@/components/mockups/DesktopBrowserFrame";
import IPadProFrame from "@/components/mockups/IPadProFrame";
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

export default function PortfolioCasePage() {
  const { sectorId = "" } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const group = useMemo(() => getSectorGroup(sectorId), [sectorId]);
  const desktopShot = useMemo(() => getSectorDesktopShot(sectorId), [sectorId]);


  const variants = useMemo<SectorMockupVariant[]>(() => {
    if (!group) return [];
    // La pagina settore deve mostrare TUTTO il catalogo del settore. Prima
    // venivano esclusi gli stili extended quando era presente anche un solo
    // progetto Studio: il click dal portfolio poteva quindi aprire una pagina vuota.
    return [...group.variants].sort((a, b) => {
      if (a.tier !== b.tier) return a.tier === "primary" ? -1 : 1;
      return (b.screens?.length ?? 1) - (a.screens?.length ?? 1);
    });
  }, [group]);


  const styleParam = params.get("style") ?? "all";
  const [filter, setFilter] = useState<string>(styleParam);
  useEffect(() => setFilter(styleParam), [styleParam]);


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
    () => (filter === "all" ? selected.filter((v) => (v.screens?.length ?? 1) > 1) : selected),
    [selected, filter],
  );
  /** Stili con una sola schermata: griglia compatta di confronto. */
  const compact = useMemo(
    () => (filter === "all" ? selected.filter((v) => (v.screens?.length ?? 1) <= 1) : []),
    [selected, filter],
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
          <Link
            to="/portfolio"
            className="pglass-btn"
          >
            Vai al portfolio
          </Link>
        </div>
      </div>
    );
  }

  const lead = variants[0];
  const featured = filter === "all" ? lead : variants.find((v) => v.id === filter) ?? lead;
  const totalScreens = variants.reduce((n, v) => n + (v.screens?.length || 1), 0);
  const otherSectors = SECTOR_MOCKUPS.filter(
    (g) => g.id !== group.id && g.variants.some((v) => v.source === "studio"),
  ).slice(0, 8);

  const meta = [
    { icon: UserRound, k: "Cliente tipo", v: lead.brand },
    { icon: CalendarDays, k: "Anno", v: String(CURRENT_YEAR) },
    { icon: Smartphone, k: "Piattaforma", v: "iOS · Web app" },
    { icon: Layers, k: "Stili", v: `${variants.length} · ${totalScreens} schermate` },
  ];

  return (
    <div className="pglass-scope pglass-bg min-h-screen">
      <PrestigeTheme />

      {/* ───────── HERO EDITORIALE ───────── */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 75% at 12% 0%, hsl(var(--pr-emerald) / 0.6), transparent 62%), radial-gradient(80% 60% at 88% 4%, hsl(var(--acc-hero) / 0.22), transparent 66%), radial-gradient(70% 60% at 62% 100%, hsl(43 88% 60% / 0.10), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-10 lg:px-10 lg:pt-14">
          <div className="flex flex-wrap items-center gap-3">
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

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div
                className="prestige-eyebrow flex items-center gap-2"
                style={{ color: "hsl(var(--acc-hero))" }}
              >
                <Sparkles size={12} /> Settore · {variants.length} direzioni visive
              </div>
              <h1
                className="prestige-display mt-4 text-4xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl"
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
              <p
                className="mt-5 max-w-2xl text-base leading-relaxed sm:text-lg"
                style={{ color: "hsl(var(--pr-gold-light) / 0.72)" }}
              >
                {group.tagline}
              </p>
              <p
                className="mt-3 max-w-2xl text-sm leading-relaxed"
                style={{ color: "hsl(var(--pr-gold-light) / 0.55)" }}
              >
                Ogni stile qui sotto è un sistema completo: tipografia, palette, griglie, componenti e
                micro-interazioni diverse — con la sequenza integrale delle schermate, così puoi confrontarli
                fianco a fianco e scegliere la direzione del tuo progetto.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-3">
              {meta.map(({ icon: Icon, k, v }) => (
                <div
                  key={k}
                  className="pglass p-4"
                >
                  <dt
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: "hsl(var(--pr-gold) / 0.85)" }}
                  >
                    <Icon size={12} /> {k}
                  </dt>
                  <dd
                    className="mt-1.5 text-sm font-semibold"
                    style={{ color: "hsl(var(--pr-gold-light))" }}
                  >
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      {/* ───────── FILTRO STILI (sticky) ───────── */}
      <div
        className="pglass-stickybar sticky top-0 z-30"
      >
        <div className="mx-auto max-w-7xl overflow-x-auto px-5 py-3 [scrollbar-width:none] lg:px-10 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-2">
            {[{ id: "all", label: `Tutti · ${variants.length}` }, ...variants.map((v) => ({ id: v.id, label: v.style }))].map(
              (chip) => {
                const on = filter === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setStyle(chip.id)}
                    aria-pressed={on}
                    className="pglass-chip pglass-chip-dark"
                  >
                    {chip.label}
                  </button>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* ───────── COVER: desktop + mobile dello stile principale ───────── */}
      <section className="mx-auto max-w-7xl px-5 pt-12 lg:px-10">
        <div className="pglass overflow-hidden p-5 sm:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <DesktopBrowserFrame
              src={desktopShot ?? featured.screens?.[0]?.image ?? featured.screen}
              native={Boolean(desktopShot)}
              alt={`${featured.brand} — versione desktop`}
              label={`${featured.brand.toLowerCase().replace(/[^a-z0-9]+/g, "")}.it`}
            />

            <div className="mx-auto w-[62%] max-w-[240px] lg:w-full">
              <IPhoneProMaxFrame
                src={featured.screens?.[1]?.image ?? featured.screens?.[0]?.image ?? featured.screen}
                alt={`${featured.brand} — versione mobile`}
                width={230}
                className="mx-auto !w-full"
                style={{ width: "100%", height: "auto", aspectRatio: "9 / 19.5" }}
              />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]">
            <span className="pglass-tag pglass-tag-accent">Desktop · iPad · mobile 1:1</span>
            <span className="pglass-tag">{featured.brand}</span>
            <span className="pglass-tag">{featured.palette}</span>
          </div>
        </div>
      </section>

      {/* ───────── RIGHE STILE: TUTTE LE SCHERMATE A CONFRONTO ───────── */}
      <main className="mx-auto max-w-7xl px-5 pb-24 lg:px-10">
        {shown.map((v) => {
          const idx = variants.findIndex((x) => x.id === v.id);
          const screens = v.screens?.length ? v.screens : [{ label: "Home", caption: "", image: v.screen }];
          return (
            <section key={v.id} className="pglass my-8 p-5 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.26em]"
                    style={{ color: "hsl(var(--pr-gold))" }}
                  >
                    {v.style}
                  </div>
                  <h2
                    className="prestige-display mt-2 text-2xl sm:text-3xl"
                    style={{ color: "hsl(var(--pr-gold-light))" }}
                  >
                    {v.brand}
                  </h2>
                  <p
                    className="mt-2 max-w-2xl text-sm leading-relaxed"
                    style={{ color: "hsl(var(--pr-gold-light) / 0.62)" }}
                  >
                    {v.description}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="pglass-tag pglass-tag-accent"
                  >
                    {v.palette}
                  </span>
                  <span
                    className="pglass-tag"
                  >
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
                        background: "hsl(var(--pr-gold-light) / 0.04)",
                        color: "hsl(var(--pr-gold-light) / 0.7)",
                        border: "1px solid hsl(var(--pr-gold-light) / 0.1)",
                      }}
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              {/* Versioni desktop + tablet dello stile */}
              <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
                <DesktopBrowserFrame
                  src={desktopShot ?? screens[0].image}
                  native={Boolean(desktopShot)}
                  alt={`${v.brand} — ${v.style} — desktop`}
                  label={`${v.brand.toLowerCase().replace(/[^a-z0-9]+/g, "")}.it`}
                />
                <figure className="mx-auto w-full max-w-[420px]">
                  <div
                    className="overflow-hidden rounded-[26px] bg-black p-2.5"
                    style={{
                      border: "1px solid hsl(var(--pr-gold-light) / 0.18)",
                      boxShadow: "0 24px 60px -30px rgba(0,0,0,0.8)",
                    }}
                  >
                    <div className="overflow-hidden rounded-[18px]" style={{ aspectRatio: "3 / 4" }}>
                      <img
                        src={desktopShot ?? screens[Math.min(1, screens.length - 1)].image}
                        alt={`${v.brand} — ${v.style} — tablet`}
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full object-top ${desktopShot ? "scale-[1.35] object-cover object-left-top" : "object-cover"}`}
                      />
                    </div>
                  </div>

                  <figcaption
                    className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.22em]"
                    style={{ color: "hsl(var(--pr-gold-light) / 0.7)" }}
                  >
                    iPad · Tablet
                  </figcaption>
                </figure>
              </div>

              {/* Griglia schermate: confronto integrale */}
              <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {screens.map((s, si) => (
                  <figure key={`${v.id}-${si}`} className="group flex flex-col items-center">
                    <div
                      className="pglass w-full p-3 group-hover:-translate-y-1.5"
                    >
                      <IPhoneProMaxFrame
                        src={s.image}
                        alt={`${v.brand} — ${v.style} — ${s.label}`}
                        width={200}
                        className="mx-auto !w-full"
                        style={{ width: "100%", height: "auto", aspectRatio: "9 / 19.5" }}
                      />
                    </div>
                    <figcaption
                      className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.22em]"
                      style={{ color: "hsl(var(--pr-gold-light) / 0.72)" }}
                    >
                      {s.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          );
        })}

        {/* ───────── GRIGLIA COMPATTA: altre direzioni visive ───────── */}
        {compact.length > 0 && (
          <section className="pglass my-8 p-5 sm:p-8">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.26em]"
              style={{ color: "hsl(var(--pr-gold))" }}
            >
              Altre direzioni visive · {compact.length}
            </div>
            <h2
              className="prestige-display mt-2 text-2xl sm:text-3xl"
              style={{ color: "hsl(var(--pr-gold-light))" }}
            >
              Confronto rapido degli stili
            </h2>
            <p
              className="mt-2 max-w-2xl text-sm"
              style={{ color: "hsl(var(--pr-gold-light) / 0.6)" }}
            >
              Ogni stile ha tipografia, palette e componenti
              completamente diversi tra una direzione e l'altra.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {compact.map((v) => {
                const idx = variants.findIndex((x) => x.id === v.id);
                return (
                  <figure key={v.id} className="group flex flex-col items-center">
                    <div
                      className="pglass w-full p-2.5 group-hover:-translate-y-1.5"
                    >
                      <IPhoneProMaxFrame
                        src={v.screens?.[0]?.image ?? v.screen}
                        alt={`${v.brand} — ${v.style}`}
                        width={170}
                        className="mx-auto !w-full"
                        style={{ width: "100%", height: "auto", aspectRatio: "9 / 19.5" }}
                      />
                    </div>
                    <figcaption className="mt-3 text-center">
                      <span
                        className="block text-xs font-semibold"
                        style={{ color: "hsl(var(--pr-gold-light))" }}
                      >
                        {v.brand}
                      </span>
                      <span
                        className="mt-0.5 block text-[10px] uppercase tracking-[0.16em]"
                        style={{ color: "hsl(var(--pr-gold) / 0.75)" }}
                      >
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
            <h2
              className="prestige-display text-2xl sm:text-3xl"
              style={{ color: "hsl(var(--pr-gold-light))" }}
            >
              Altri settori
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {otherSectors.map((g) => (
                <Link
                  key={g.id}
                  to={`/portfolio/${g.id}`}
                  className="pglass-chip pglass-chip-dark"
                >
                  {g.label} <ArrowUpRight size={13} />
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/demo"
                className="pglass-btn"
              >
                Apri i siti demo live <ArrowUpRight size={16} />
              </Link>
              <Link
                to="/portfolio"
                className="pglass-btn-ghost"
              >
                Portfolio completo <ArrowUpRight size={16} />
              </Link>
            </div>
          </section>
        )}
      </main>

    </div>
  );
}
