/**
 * ═══ JET FOOTER ═══
 * Footer editoriale luxury: monogramma inciso, colonne tipografiche,
 * flight desk live, riga legale. Vetro champagne coerente col resto del sito.
 * ADDITIVO — solo presentazione, nessun backend.
 */
import { useEffect, useState } from "react";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone, Plane } from "lucide-react";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Esperienza",
    links: [
      { label: "Flotta", href: "#flotta" },
      { label: "Atmosfere di bordo", href: "#atmosfere" },
      { label: "Aurea Deck", href: "#app" },
      { label: "Servizi", href: "#servizi" },
    ],
  },
  {
    title: "Operativo",
    links: [
      { label: "Configura rotta", href: "#preventivo" },
      { label: "Flight desk", href: "#richiesta" },
      { label: "Cerchio esclusivo", href: "#cerchio" },
      { label: "Sicurezza e standard", href: "#servizi" },
    ],
  },
];

const CITIES = ["Milano", "Roma", "Nizza", "Ginevra", "Olbia", "Dubai"];

export default function JetFooter() {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const sync = () =>
      setClock(
        new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      );
    sync();
    const id = window.setInterval(sync, 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-primary/15 bg-background">
      {/* alone champagne di chiusura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-64"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 100%, hsl(40 58% 62% / 0.14) 0%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-16 sm:px-10 sm:pt-24">
        {/* riga superiore: claim + CTA */}
        <div className="flex flex-col gap-8 border-b border-border/40 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-primary">
              Aurea Jet · Private Aviation
            </p>
            <h2 className="jet-serif mt-5 text-[clamp(1.9rem,5vw,3.4rem)] leading-[0.98]">
              Ogni volo è un capitolo.
              <br />
              <span className="italic text-primary">Il tuo inizia adesso.</span>
            </h2>
          </div>
          <a
            href="#preventivo"
            className="jet-glass jet-sheen group inline-flex min-h-14 items-center justify-between gap-6 overflow-hidden rounded-full px-7 text-[11px] font-medium uppercase tracking-[0.24em] text-foreground"
          >
            Configura la tua rotta
            <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>

        {/* griglia colonne */}
        <div className="grid gap-12 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-card/40">
              <Plane className="h-[18px] w-[18px] text-primary" strokeWidth={1.25} />
            </span>
            <p className="jet-serif mt-5 text-2xl">
              Aurea <span className="italic text-primary">Jet</span>
            </p>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              Advisory indipendente per charter executive, elicotteri e gestione aeromobili. Un unico
              referente, dalla richiesta all’atterraggio.
            </p>
          </div>

          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-primary/80">
                {col.title}
              </p>
              <ul className="mt-5 space-y-1">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="group flex min-h-11 items-center gap-2 text-[13px] tracking-wide text-foreground/70 transition-colors hover:text-primary"
                    >
                      <span className="h-px w-0 bg-primary transition-all duration-500 group-hover:w-4" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-primary/80">
              Flight desk
            </p>
            <div className="mt-5 space-y-4 text-[13px] text-foreground/75">
              <p className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 text-primary" strokeWidth={1.25} />
                <span className="tracking-wide">Attivo 24/7 · {clock} CET</span>
              </p>
              <a href="tel:+390200000000" className="flex min-h-11 items-center gap-3 hover:text-primary">
                <Phone className="h-4 w-4 text-primary" strokeWidth={1.25} />
                +39 02 000 0000
              </a>
              <a href="mailto:fly@aureajet.it" className="flex min-h-11 items-center gap-3 hover:text-primary">
                <Mail className="h-4 w-4 text-primary" strokeWidth={1.25} />
                fly@aureajet.it
              </a>
              <p className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" strokeWidth={1.25} />
                Milano Linate · Roma Ciampino · Olbia Costa Smeralda
              </p>
            </div>
          </div>
        </div>

        {/* nastro basi operative */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border/40 py-6">
          {CITIES.map((c) => (
            <span
              key={c}
              className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70"
            >
              {c}
            </span>
          ))}
        </div>

        {/* riga legale */}
        <div className="flex flex-col gap-3 pt-8 text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Aurea Jet — Sito dimostrativo Empire</p>
          <p>Tariffe, disponibilità e dati di volo sono esemplificativi</p>
        </div>
      </div>
    </footer>
  );
}
