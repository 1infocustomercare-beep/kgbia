import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Car,
  Gauge,
  MessageCircle,
  Monitor,
  Phone,
  Repeat,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wrench,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { LuxeDivider, LuxeGrain, LuxePanel, LuxeStat, LuxeTag } from "@/components/public/luxe";

const HeroScrub = lazy(() => import("@/components/public/HeroScrub"));
const AureliaApp = lazy(() => import("@/components/public/aurelia/AureliaApp"));
const AureliaLivePhone = lazy(() => import("@/components/public/aurelia/AureliaLivePhone"));

/** Webapp live in due viste: desktop full-width e mobile dentro iPhone 17 Pro Max. */
function AureliaWebappSection() {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <section id="webapp" className="relative px-5 pb-24 sm:px-8">
      <div className="mx-auto mb-8 max-w-6xl">
        <LuxeTag><Gauge className="h-3 w-3" /> Webapp live · cliente, staff, admin</LuxeTag>
        <h2 className="mt-4 font-heading text-3xl font-semibold sm:text-5xl">Provala: funziona davvero.</h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          10 interfacce reali: home cliente, vetrina con filtri, scheda con simulatore rata, test drive, permuta con
          stima IA, consulente IA, agenda ponti officina, magazzino ricambi, garage digitale e CRM vendite.
        </p>

        <div className="mt-6 inline-flex rounded-full border border-border/60 bg-card/60 p-1">
          {([
            { id: "desktop", label: "Desktop", icon: Monitor },
            { id: "mobile", label: "iPhone 17 Pro Max", icon: Smartphone },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setDevice(id)}
              aria-pressed={device === id}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                device === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      {device === "desktop" ? (
        <Suspense fallback={<div className="mx-auto h-[520px] max-w-6xl rounded-3xl border border-border/60 bg-card/40" />}>
          <AureliaApp />
        </Suspense>
      ) : (
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 rounded-3xl border border-border/60 bg-card/40 px-4 py-14 lg:flex-row lg:justify-center lg:gap-16">
          <Suspense fallback={<div className="h-[870px] w-[410px] rounded-[60px] border border-border/60 bg-black" />}>
            <AureliaLivePhone width={390} screenHeight={844} className="origin-top scale-[0.86] sm:scale-100">
              <AureliaApp variant="mobile" />
            </AureliaLivePhone>
          </Suspense>
          <div className="max-w-sm text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Versione mobile 1:1</p>
            <h3 className="mt-4 font-heading text-2xl font-semibold sm:text-3xl">
              Lo stesso mockup, ma vivo nel telefono.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Status bar, header, tab bar in basso e menu &laquo;Altro&raquo; con le aree staff e admin: naviga
              direttamente dentro lo schermo, come farebbe un cliente della concessionaria oggi.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

const PILLARS = [
  {
    icon: Car,
    title: "Vetrina viva",
    text: "Ogni vettura con gallery, scheda tecnica, storico e rata calcolata in tempo reale mentre il cliente scorre.",
  },
  {
    icon: Wrench,
    title: "Officina connessa",
    text: "Agenda ponti, avanzamento lavori, preventivi firmati dal telefono. Zero telefonate.",
  },
  {
    icon: ShieldCheck,
    title: "Usato garantito",
    text: "Perizia, tagliandi e garanzia certificata visibili prima ancora del test drive.",
  },
];

const JOURNEY = [
  { step: "01", title: "Scopre", text: "Arriva dai portali o da Google e apre la vetrina dal telefono." },
  { step: "02", title: "Configura", text: "Simula la rata, chiede la permuta e riceve la stima IA immediata." },
  { step: "03", title: "Prenota", text: "Blocca lo slot del test drive: entra in agenda con promemoria automatici." },
  { step: "04", title: "Ritorna", text: "Tagliandi, garanzia e preventivi restano nel suo garage digitale." },
];

export default function AutoDealerPublicSite() {
  return (
    <main
      className="min-h-screen overflow-x-clip bg-background text-foreground"
      style={{
        // palette locale Aurelia: notte profonda + smeraldo motorsport
        ["--background" as string]: "195 30% 5%",
        ["--foreground" as string]: "40 20% 96%",
        ["--card" as string]: "195 24% 9%",
        ["--card-foreground" as string]: "40 20% 96%",
        ["--muted" as string]: "195 18% 16%",
        ["--muted-foreground" as string]: "180 8% 65%",
        ["--primary" as string]: "170 62% 42%",
        ["--primary-foreground" as string]: "195 40% 6%",
        ["--border" as string]: "180 14% 22%",
        ["--accent" as string]: "170 62% 42%",
        ["--accent-foreground" as string]: "195 40% 6%",
      }}
    >

      <BackButton to="/demo" label="Tutte le demo" variant="floating" theme="glass" className="!h-11 !w-11" />

      {/* ═══ Hero cinematico: dallo showroom dentro l'abitacolo ═══ */}
      <Suspense fallback={<div className="h-[100svh] w-full bg-black" />}>
        <HeroScrub
          frameCount={142}
          frameUrl={(i) => `/frames/aurelia-dolly/${String(i + 1).padStart(3, "0")}.jpg`}
          titleTop="AURELIA"
          titleBottom="MOTORI"
          accentHex="#0d5a52"
          bgClassName="bg-black"
          defaultAspect={1200 / 686}
        />
      </Suspense>

      {/* ═══ Manifesto ═══ */}
      <section className="relative px-5 py-20 sm:px-8 sm:py-28">
        <LuxeGrain opacity={0.04} />
        <div className="relative mx-auto max-w-4xl text-center">
          <LuxeTag className="mx-auto"><Sparkles className="h-3 w-3" /> Concessionaria &amp; officina · Milano</LuxeTag>
          <h1 className="mt-6 font-heading text-3xl font-semibold leading-[1.05] sm:text-6xl">
            Entra nel salone.
            <br />
            <span className="text-primary">Anche alle 2 di notte.</span>
          </h1>
          <LuxeDivider className="mx-auto max-w-xs" />
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Vetrina, test drive, permuta con stima IA, officina e CRM in un&apos;unica webapp. Qui sotto non ci sono
            immagini: è l&apos;app vera, puoi usarla.
          </p>
        </div>
      </section>

      <section className="relative border-y border-border/50 bg-card/60">
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border/50 sm:grid-cols-4 sm:divide-y-0">
          <LuxeStat value="7" label="Interfacce operative" />
          <LuxeStat value="30 s" label="Stima permuta IA" />
          <LuxeStat value="12" label="Ponti in agenda" />
          <LuxeStat value="24/7" label="Salone sempre aperto" />
        </div>
      </section>

      {/* ═══ Pilastri ═══ */}
      <section className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <LuxePanel key={title} glass glow className="p-7 sm:p-9">
              <Icon className="mb-8 h-7 w-7 text-primary" />
              <h3 className="font-heading text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </LuxePanel>
          ))}
        </div>
      </section>

      {/* ═══ Webapp reale e navigabile: desktop + mobile 1:1 col mockup ═══ */}
      <AureliaWebappSection />

      {/* ═══ Journey ═══ */}
      <section className="relative border-t border-border/50 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col items-start gap-4">
            <LuxeTag><Repeat className="h-3 w-3" /> Percorso cliente</LuxeTag>
            <h2 className="font-heading text-3xl font-semibold sm:text-4xl">Dal portale al ponte, senza attriti.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((j) => (
              <LuxePanel key={j.step} glass className="p-7">
                <span className="font-heading text-4xl font-semibold text-primary/70">{j.step}</span>
                <h3 className="mt-5 font-heading text-xl font-semibold">{j.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{j.text}</p>
              </LuxePanel>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="richiesta" className="relative px-5 pb-24 sm:px-8 sm:pb-36">
        <LuxePanel glass glow className="mx-auto max-w-5xl px-6 py-16 text-center sm:px-14 sm:py-24">
          <CalendarDays className="mx-auto mb-7 h-8 w-8 text-primary" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Demo dimostrativa Empire IA</p>
          <h2 className="mx-auto mt-5 max-w-3xl font-heading text-3xl font-semibold sm:text-6xl">
            Scegli l&apos;auto. Al resto pensa la webapp.
          </h2>
          <LuxeDivider className="mx-auto max-w-xs" />
          <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
            Vetrina, agenda officina, permuta IA e follow-up automatici: la tua concessionaria non chiude mai.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="min-h-12 w-full rounded-none px-8 uppercase tracking-[0.16em] sm:w-auto">
              <Link to="/auth">
                Attiva la tua versione <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-12 w-full rounded-none px-8 uppercase tracking-[0.16em] sm:w-auto">
              <Link to="/demo">
                <MessageCircle className="h-4 w-4" /> Vedi altri settori
              </Link>
            </Button>
          </div>
        </LuxePanel>
      </section>

      <footer className="border-t border-border/50 px-5 py-10 text-center text-xs text-muted-foreground sm:px-8">
        <p className="font-heading text-base tracking-[0.3em] text-foreground">AURELIA MOTORI</p>
        <p className="mt-3 inline-flex items-center gap-2">
          <Phone className="h-3.5 w-3.5" /> Demo dimostrativa · nessun dato reale
        </p>
      </footer>
    </main>
  );
}
