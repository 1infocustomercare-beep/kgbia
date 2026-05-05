import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Grid2X2, Monitor, Smartphone, Sparkles } from "lucide-react";
import { SECTOR_PORTFOLIO, type SectorPortfolio } from "@/data/sector-mockup-images";
import type { IndustryId } from "@/config/industry-config";
import RealisticIPhonePreview from "@/components/empire-home/RealisticIPhonePreview";

type CatalogItem = {
  id: string;
  sectorId: IndustryId;
  sectorLabel: string;
  brand: string;
  style: string;
  thumbnail: string;
  screens: string[];
  desktopScreens?: string[];
  description: string;
};

const SECTOR_COPY: Partial<Record<IndustryId, string>> = {
  food: "Menu, ordini, prenotazioni, carrello e pagamenti per ristoranti, pizzerie, sushi e locali premium.",
  beauty: "Servizi, trattamenti, agenda, pacchetti e schede cliente per saloni, spa, nail studio e centri estetici.",
  ncc: "Flotta, preventivi, itinerari, booking e richieste rapide per NCC, charter, yacht e trasporti premium.",
  veterinary: "Servizi, pet resort, prenotazioni e profili animali per cliniche veterinarie e strutture pet care.",
  childcare: "Programmi, attività, team, pasti e iscrizioni per asili, nursery e servizi dedicati alle famiglie.",
  fitness: "Corsi, prenotazioni, coach, abbonamenti e schede attività per palestre, padel e centri sportivi.",
  healthcare: "Servizi, agenda, richieste paziente e percorsi clinici per studi medici e strutture sanitarie.",
  construction: "Dashboard, cantieri, unità, manutenzioni e community per edilizia, real estate e facility.",
  hospitality: "Esperienze, camere, escursioni, concierge e prenotazioni per hotel, resort e hospitality.",
  plumber: "Servizi, interventi, preventivi e booking urgente per artigiani e imprese tecniche.",
  retail: "Vetrina, shop, dettaglio prodotto e carrello per retail, profumerie, fashion e negozi verticali.",
  beach: "Attività, prenotazioni, pacchetti e vendita esperienze per stabilimenti balneari e watersport.",
};

const flattenPortfolio = (portfolio: SectorPortfolio[]): CatalogItem[] =>
  portfolio.flatMap((sector) =>
    sector.brands.flatMap((brand) =>
      brand.styles.map((style, index) => ({
        id: `${sector.sectorId}-${brand.name}-${style.name}-${index}`,
        sectorId: sector.sectorId,
        sectorLabel: sector.sectorLabel,
        brand: brand.name,
        style: style.name,
        thumbnail: style.thumbnail,
        screens: style.screens,
        desktopScreens: style.desktopScreens,
        description:
          SECTOR_COPY[sector.sectorId] ??
          "Mockup settoriale con schermate operative per presentare servizi, contenuti, conversione e gestione clienti.",
      }))
    )
  );

export default function MockupCatalog({ mode = "section" }: { mode?: "section" | "page" }) {
  const navigate = useNavigate();
  const isPage = mode === "page";
  const [expanded, setExpanded] = useState(isPage);
  const [sector, setSector] = useState<IndustryId | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);

  const allItems = useMemo(() => flattenPortfolio(SECTOR_PORTFOLIO), []);
  const sectors = useMemo(
    () => SECTOR_PORTFOLIO.map((s) => ({ id: s.sectorId, label: s.sectorLabel })),
    []
  );
  const filtered = sector === "all" ? allItems : allItems.filter((item) => item.sectorId === sector);
  const visible = expanded ? filtered : filtered.slice(0, 12);
  const screensCount = allItems.reduce((sum, item) => sum + item.screens.length + (item.desktopScreens?.length ?? 0), 0);

  return (
    <section id="mockup-catalog" className={`relative overflow-hidden px-4 sm:px-6 ${isPage ? "min-h-screen pb-24 pt-28 sm:pt-32" : "py-20 sm:py-28"}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, hsl(var(--primary) / 0.18), transparent 68%), linear-gradient(180deg, hsl(var(--background)), hsl(var(--deep-black)))",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="mb-8 flex flex-col gap-6 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[3px] text-primary">
              <Grid2X2 className="h-3.5 w-3.5" />
              Catalogo mockup reale · {allItems.length} stili · {screensCount} schermate
            </div>
            <h2 className="font-heading text-[clamp(2.1rem,6vw,5.2rem)] font-black uppercase leading-[0.95] tracking-normal text-foreground">
              Apri il catalogo.
              <span className="block bg-[linear-gradient(110deg,hsl(var(--primary)),hsl(var(--gold)),hsl(var(--accent)))] bg-clip-text text-transparent">
                Trova il tuo settore.
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/65 sm:text-base">
              Ogni card mostra mockup reali già organizzati per settore, brand, stile e schermate: home, servizi, dettaglio, booking, carrello o dashboard quando disponibili.
            </p>
          </div>

          <button
            type="button"
            onClick={() => (isPage ? navigate("/home#mockup-catalog") : navigate("/catalogo"))}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary px-5 py-3 text-sm font-black uppercase tracking-[2px] text-primary-foreground shadow-[0_18px_60px_-24px_hsl(var(--primary))] transition-transform active:scale-[0.98]"
          >
            {isPage ? "Torna alla home" : "Apri pagina catalogo"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-7 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setSector("all")}
            className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[2px] transition-all ${sector === "all" ? "border-primary bg-primary text-primary-foreground" : "border-foreground/15 bg-foreground/[0.04] text-foreground/70"}`}
          >
            Tutti
          </button>
          {sectors.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSector(s.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[2px] transition-all ${sector === s.id ? "border-primary bg-primary text-primary-foreground" : "border-foreground/15 bg-foreground/[0.04] text-foreground/70"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((item, index) => {
            const isSelected = selected === item.id;
            const previewScreens = item.screens.slice(0, isSelected ? item.screens.length : 3);
            return (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-[1.35rem] border border-foreground/10 bg-foreground/[0.035] shadow-[0_24px_80px_-48px_hsl(0_0%_0%)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="relative flex min-h-[390px] items-center justify-center overflow-hidden bg-muted px-4 pt-8">
                  <RealisticIPhonePreview
                    src={item.thumbnail}
                    alt={`${item.brand} ${item.style}`}
                    size="lg"
                    priority={index < 8}
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)_/_0)_45%,hsl(var(--background)_/_0.9)_100%)]" />
                  <div className="absolute left-3 top-3 rounded-full border border-background/40 bg-background/80 px-2 py-1 text-[9px] font-black uppercase tracking-[2px] text-primary">
                    {item.sectorLabel}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-heading text-xl font-black uppercase leading-none text-foreground">{item.brand}</h3>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[2px] text-foreground/55">{item.style}</p>
                  </div>
                </div>

                <div className="p-4">
                  <p className="min-h-[54px] text-xs leading-relaxed text-foreground/62">{item.description}</p>
                  <div className="mt-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[2px] text-foreground/55">
                    <span className="inline-flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5 text-primary" />{item.screens.length} mobile</span>
                    {item.desktopScreens?.length ? <span className="inline-flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5 text-gold" />{item.desktopScreens.length} desktop</span> : null}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {previewScreens.map((screen, i) => (
                      <button
                        key={`${item.id}-${screen}-${i}`}
                        type="button"
                        onClick={() => setSelected(isSelected ? null : item.id)}
                        className="relative flex min-h-[118px] items-center justify-center overflow-hidden rounded-lg border border-foreground/10 bg-muted transition-transform active:scale-[0.98]"
                        aria-label={`Mostra schermate ${item.brand}`}
                      >
                        <RealisticIPhonePreview src={screen} alt={`${item.brand} schermata ${i + 1}`} size="sm" />
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelected(isSelected ? null : item.id)}
                    className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-background/70 px-3 py-2 text-[11px] font-black uppercase tracking-[2px] text-foreground transition-colors hover:border-primary/40"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    {isSelected ? "Chiudi schermate" : "Vedi schermate"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {!expanded && filtered.length > visible.length ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="min-h-[48px] rounded-full border border-foreground/15 bg-foreground/[0.05] px-6 py-3 text-xs font-black uppercase tracking-[2px] text-foreground transition-colors hover:border-primary/40"
            >
              Mostra altri {filtered.length - visible.length} mockup
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
