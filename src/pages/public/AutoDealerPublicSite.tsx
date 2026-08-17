import { lazy, Suspense, useCallback, useEffect, useState } from "react";
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
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { LuxeDivider, LuxeGrain, LuxePanel, LuxeStat, LuxeTag } from "@/components/public/luxe";
import showroomShot from "@/assets/demo-aurelia/aurelia-showroom.jpg";
import schedaShot from "@/assets/demo-aurelia/aurelia-scheda.jpg";
import testdriveShot from "@/assets/demo-aurelia/aurelia-testdrive.jpg";
import permutaShot from "@/assets/demo-aurelia/aurelia-permuta.jpg";
import officinaShot from "@/assets/demo-aurelia/aurelia-officina.jpg";
import garageShot from "@/assets/demo-aurelia/aurelia-garage.jpg";
import crmShot from "@/assets/demo-aurelia/aurelia-crm.jpg";
import desktopShot from "@/assets/demo-aurelia/aurelia-desktop.jpg";

const HeroScrub = lazy(() => import("@/components/public/HeroScrub"));

const PILLARS = [
  {
    icon: Car,
    title: "Vetrina 360°",
    text: "Ogni vettura con giro completo, scheda tecnica, storico e finanziamento calcolato in tempo reale.",
  },
  {
    icon: Wrench,
    title: "Officina connessa",
    text: "Agenda ponti, avanzamento lavori, preventivi firmati dal cliente dal telefono. Zero telefonate.",
  },
  {
    icon: ShieldCheck,
    title: "Usato garantito",
    text: "Perizia, tagliandi e garanzia certificata visibili prima ancora del test drive.",
  },
];

const SCREENS = [
  {
    src: showroomShot,
    tag: "Cliente",
    title: "Vetrina",
    text: "Filtri usato garantito, Km 0, elettriche e ibride. Badge 360° su ogni vettura.",
  },
  {
    src: schedaShot,
    tag: "Cliente",
    title: "Scheda veicolo",
    text: "Gallery immersiva, specifiche, rata mensile e doppia call to action test drive / permuta.",
  },
  {
    src: testdriveShot,
    tag: "Cliente",
    title: "Test drive",
    text: "Calendario slot reali, sede, consulente assegnato e conferma automatica su WhatsApp.",
  },
  {
    src: permutaShot,
    tag: "IA",
    title: "Permuta con stima IA",
    text: "Targa, km e condizioni: valutazione stimata in 30 secondi, valida 7 giorni.",
  },
  {
    src: officinaShot,
    tag: "Staff",
    title: "Officina · ponti",
    text: "Timeline dei ponti, stato ricambi, avanzamento lavori e preventivi in attesa di firma.",
  },
  {
    src: garageShot,
    tag: "Cliente",
    title: "Il mio garage",
    text: "Garanzia attiva, prossimo tagliando, storico interventi con fatture PDF scaricabili.",
  },
  {
    src: crmShot,
    tag: "Admin",
    title: "CRM vendite",
    text: "Vetture vendute, margine, canali di acquisizione e lead ordinati per temperatura.",
  },
];

const JOURNEY = [
  { step: "01", title: "Scopre", text: "Arriva dai portali o da Google e ruota l'auto a 360° dal telefono." },
  { step: "02", title: "Configura", text: "Simula la rata, chiede la permuta e riceve la stima IA immediata." },
  { step: "03", title: "Prenota", text: "Blocca lo slot del test drive: entra in agenda con promemoria automatici." },
  { step: "04", title: "Ritorna", text: "Tagliandi, garanzia e preventivi restano nel suo garage digitale." },
];

export default function AutoDealerPublicSite() {
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);

  const close = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, close]);

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <BackButton to="/demo" label="Tutte le demo" variant="floating" theme="glass" className="!h-11 !w-11" />

      {/* ═══ Hero cinematografico: 90 frame, rotazione 360° reale ═══ */}
      <Suspense fallback={<div className="h-[100svh] w-full bg-black" />}>
        <HeroScrub
          frameCount={90}
          frameUrl={(i) => `/frames/showroom/${String(i + 1).padStart(3, "0")}.jpg`}
          titleTop="AURELIA"
          titleBottom="MOTORI"
          accentHex="#0d5a52"
          bgClassName="bg-black"
          defaultAspect={16 / 9}
        />
      </Suspense>

      {/* ═══ Manifesto ═══ */}
      <section className="relative px-5 py-20 sm:px-8 sm:py-28">
        <LuxeGrain opacity={0.04} />
        <div className="relative mx-auto max-w-4xl text-center">
          <LuxeTag className="mx-auto"><Sparkles className="h-3 w-3" /> Concessionaria &amp; officina · Milano</LuxeTag>
          <h1 className="mt-6 font-heading text-3xl font-semibold leading-[1.05] sm:text-6xl">
            Il tuo salone gira a 360°.
            <br />
            <span className="text-primary">Anche alle 2 di notte.</span>
          </h1>
          <LuxeDivider className="mx-auto max-w-xs" />
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Vetrina, test drive, permuta con stima IA, officina e CRM in un&apos;unica webapp. Il cliente ruota l&apos;auto,
            prenota il ponte e approva il preventivo senza una sola telefonata.
          </p>
        </div>
      </section>

      <section className="relative border-y border-border/50 bg-card/60">
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-border/50 sm:grid-cols-4 sm:divide-y-0">
          <LuxeStat value="360°" label="Ogni vettura" />
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

      {/* ═══ Tutte le interfacce ═══ */}
      <section className="relative px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col items-start gap-4">
            <LuxeTag><Gauge className="h-3 w-3" /> 7 interfacce · cliente, staff, admin</LuxeTag>
            <h2 className="font-heading text-3xl font-semibold sm:text-5xl">Il lavoro finito, schermata per schermata.</h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Tocca una schermata per aprirla a tutto schermo.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SCREENS.map((s) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setLightbox({ src: s.src, title: s.title })}
                className="group text-left"
                aria-label={`Apri a tutto schermo la schermata ${s.title}`}
              >
                <LuxePanel glass className="overflow-hidden p-5 transition-transform duration-500 group-hover:-translate-y-1 sm:p-7">
                  <img
                    src={s.src}
                    alt={`Aurelia Motori — interfaccia ${s.title}`}
                    loading="lazy"
                    width={1024}
                    height={1280}
                    className="mx-auto w-full max-w-[300px] rounded-2xl"
                  />
                  <span className="mt-6 inline-block text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
                    {s.tag}
                  </span>
                  <h3 className="mt-2 font-heading text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </LuxePanel>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Versione desktop ═══ */}
      <section className="relative border-y border-border/50 bg-card/40 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col items-start gap-4">
            <LuxeTag><Monitor className="h-3 w-3" /> Desktop</LuxeTag>
            <h2 className="font-heading text-3xl font-semibold sm:text-4xl">Stessa anima, schermo grande.</h2>
          </div>
          <button
            type="button"
            onClick={() => setLightbox({ src: desktopShot, title: "Vetrina desktop" })}
            className="group block w-full"
            aria-label="Apri a tutto schermo la versione desktop"
          >
            <LuxePanel glass glow className="overflow-hidden p-4 sm:p-8">
              <img
                src={desktopShot}
                alt="Aurelia Motori — sito desktop della concessionaria"
                loading="lazy"
                width={1536}
                height={1024}
                className="w-full rounded-xl transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </LuxePanel>
          </button>
        </div>
      </section>

      {/* ═══ Journey ═══ */}
      <section className="relative px-5 py-20 sm:px-8 sm:py-28">
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
            Vetrina 360°, agenda officina, permuta IA e follow-up automatici: la tua concessionaria non chiude mai.
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

      {/* ═══ Lightbox fullscreen ═══ */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          onClick={close}
          className="fixed inset-0 z-[9999] flex animate-fade-in items-center justify-center bg-background/95 p-4 backdrop-blur-xl"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Chiudi"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card/80 text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightbox.src}
            alt={`Aurelia Motori — ${lightbox.title} a tutto schermo`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92svh] w-auto max-w-full rounded-2xl object-contain"
          />
          <p className="absolute bottom-5 left-0 right-0 text-center text-xs uppercase tracking-[0.28em] text-muted-foreground">
            {lightbox.title}
          </p>
        </div>
      )}
    </main>
  );
}
