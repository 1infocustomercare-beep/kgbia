import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Car, Gauge, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { LuxeDivider, LuxeGrain, LuxePanel, LuxeStat, LuxeTag } from "@/components/public/luxe";
import showroomShot from "@/assets/demo-aurelia/aurelia-showroom.jpg";
import officinaShot from "@/assets/demo-aurelia/aurelia-officina.jpg";

const HeroScrub = lazy(() => import("@/components/public/HeroScrub"));

const services = [
  { icon: Car, title: "Showroom digitale", text: "Ogni vettura con schede complete, 360° reale, prezzo e finanziamento in chiaro." },
  { icon: Wrench, title: "Officina connessa", text: "Agenda ponti, avanzamento lavori e preventivi approvati dal cliente in un tap." },
  { icon: ShieldCheck, title: "Usato garantito", text: "Storico tagliandi, perizia e garanzia certificata visibili prima del test drive." },
];

const screens = [
  { src: showroomShot, title: "Showroom", text: "Vetrina veicoli con filtri usato garantito, Km 0 ed elettriche." },
  { src: officinaShot, title: "Officina", text: "Timeline dei ponti, stato interventi e preventivi in tempo reale." },
];

export default function AutoDealerPublicSite() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <BackButton to="/demo" label="Tutte le demo" variant="floating" theme="glass" className="!h-11 !w-11" />

      {/* ═══ Hero 360° — scroll-scrubbed turntable ═══ */}
      <Suspense fallback={<div className="h-[100svh] w-full bg-black" />}>
        <HeroScrub
          frameCount={90}
          frameUrl={(i) => `/frames/showroom/${String(i + 1).padStart(3, "0")}.jpg`}
          titleTop="AURELIA"
          titleBottom="MOTORI"
          accentHex="#0e5f5a"
          bgClassName="bg-black"
          defaultAspect={16 / 9}
        />
      </Suspense>

      <section className="relative border-y border-border/50 bg-card/60">
        <LuxeGrain opacity={0.04} />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border/50 sm:grid-cols-4">
          <LuxeStat value="360°" label="Ogni vettura" />
          <LuxeStat value="24 h" label="Permuta valutata" />
          <LuxeStat value="12" label="Ponti in agenda" />
          <LuxeStat value="100%" label="Storico verificato" />
        </div>
      </section>

      {/* ═══ Intro ═══ */}
      <section className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-start gap-5">
            <LuxeTag><Sparkles className="h-3 w-3" /> Concessionaria &amp; officina</LuxeTag>
            <h2 className="max-w-2xl font-heading text-3xl font-semibold leading-tight sm:text-5xl">
              Il tuo salone, girato a 360°.<br />
              <span className="text-primary">Anche di notte.</span>
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Vetrina, test drive, permuta e officina in un&apos;unica webapp. Il cliente ruota l&apos;auto, prenota il ponte e
              approva il preventivo senza una telefonata.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {services.map(({ icon: Icon, title, text }) => (
              <LuxePanel key={title} glass glow className="p-7 sm:p-9">
                <Icon className="mb-8 h-7 w-7 text-primary" />
                <h3 className="font-heading text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </LuxePanel>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Mockup premium ═══ */}
      <section className="relative px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex flex-col items-start gap-4">
            <LuxeTag><Gauge className="h-3 w-3" /> Interfacce reali</LuxeTag>
            <h2 className="font-heading text-3xl font-semibold sm:text-4xl">Due mondi, una sola app.</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {screens.map((s) => (
              <LuxePanel key={s.title} glass className="p-6 text-center sm:p-8">
                <img
                  src={s.src}
                  alt={`Aurelia Motori — schermata ${s.title}`}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="mx-auto w-full max-w-xs rounded-2xl"
                />
                <h3 className="mt-6 font-heading text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </LuxePanel>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="richiesta" className="relative px-5 pb-24 sm:px-8 sm:pb-36">
        <LuxePanel glass glow className="mx-auto max-w-5xl px-6 py-16 text-center sm:px-14 sm:py-24">
          <CalendarDays className="mx-auto mb-7 h-8 w-8 text-primary" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Test drive in 30 secondi</p>
          <h2 className="mx-auto mt-5 max-w-3xl font-heading text-3xl font-semibold sm:text-6xl">
            Scegli l&apos;auto. Al resto pensa la webapp.
          </h2>
          <LuxeDivider className="mx-auto max-w-xs" />
          <p className="mx-auto max-w-xl text-muted-foreground">
            Vetrina, agenda officina, permuta e follow-up automatici: la tua concessionaria aperta 24/7.
          </p>
          <Button asChild size="lg" className="mt-9 min-h-12 rounded-none px-8 uppercase tracking-[0.16em]">
            <Link to="/auth">Attiva la tua demo <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </LuxePanel>
      </section>
    </main>
  );
}
