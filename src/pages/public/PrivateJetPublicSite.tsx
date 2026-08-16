import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CalendarDays, ChevronDown, Globe2, Plane, ShieldCheck, Sparkles } from "lucide-react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import jetBackground from "@/assets/hero-cinematic/private-jet-hangar.jpg";
import jetFlyby from "@/assets/hero-cinematic/private-jet.png";
import { LuxeDivider, LuxeGrain, LuxePanel, LuxeStat, LuxeTag } from "@/components/public/luxe";

const services = [
  { icon: Plane, title: "Charter su misura", text: "Rotta, aeromobile e orari costruiti intorno alla tua agenda." },
  { icon: Globe2, title: "Copertura globale", text: "Accesso a oltre 5.000 aeroporti e terminal riservati." },
  { icon: ShieldCheck, title: "Standard verificati", text: "Operatori certificati, assistenza dedicata e privacy assoluta." },
];

export default function PrivateJetPublicSite() {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end end"] });

  const planeX = useTransform(scrollYProgress, [0, 0.12, 0.48, 0.72, 1], ["-74vw", "-38vw", "24vw", "86vw", "118vw"]);
  const planeY = useTransform(scrollYProgress, [0, 0.48, 1], ["30vh", "1vh", "-18vh"]);
  const planeScale = useTransform(scrollYProgress, [0, 0.42, 0.72, 1], [0.62, 1.18, 1.42, 0.82]);
  const planeRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-8, 1, 7]);
  const planeOpacity = useTransform(scrollYProgress, [0, 0.08, 0.82, 1], [0, 1, 1, 0]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.18, 0.34], [1, 1, 0]);
  const revealOpacity = useTransform(scrollYProgress, [0.34, 0.56, 0.92], [0, 1, 1]);
  const revealY = useTransform(scrollYProgress, [0.34, 0.62], [70, 0]);
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1.03, 1.14]);
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, 52]);
  const veilOpacity = useTransform(scrollYProgress, [0, 0.58, 1], [0.56, 0.72, 0.42]);
  const trailOpacity = useTransform(scrollYProgress, [0.08, 0.44, 0.78], [0, 0.85, 0]);

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <BackButton to="/demo" label="Tutte le demo" variant="floating" theme="glass" className="!h-11 !w-11" />

      <section ref={heroRef} className="relative h-[240svh] bg-background">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.img
            src={jetBackground}
            alt="Jet privato sulla pista al tramonto"
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover object-[60%_center]"
            style={reducedMotion ? undefined : { scale: backdropScale, y: backdropY }}
          />
          <motion.div
            className="absolute inset-0 bg-background"
            style={{ opacity: reducedMotion ? 0.58 : veilOpacity }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--background)/0.94)_0%,hsl(var(--background)/0.48)_48%,transparent_78%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

          <header className="absolute inset-x-0 top-0 z-40 flex h-20 items-center justify-between border-b border-border/30 px-5 sm:px-10 lg:px-16">
            <div className="ml-12 flex items-center gap-3 sm:ml-0">
              <div className="flex h-10 w-10 items-center justify-center border border-primary/45 bg-background/55 backdrop-blur-xl">
                <Plane className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em]">Aurea Jet</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Private Aviation</p>
              </div>
            </div>
            <Button asChild size="sm" className="min-h-11 rounded-none px-5 uppercase tracking-[0.14em]">
              <a href="#richiesta">Richiedi un volo</a>
            </Button>
          </header>

          <motion.div
            className="absolute inset-0 z-10 flex items-center px-5 sm:px-10 lg:px-16"
            style={{ opacity: reducedMotion ? 1 : introOpacity }}
          >
            <div className="max-w-3xl pt-16">
              <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                <Sparkles className="h-4 w-4" /> Noleggio jet privato
              </p>
              <h1 className="max-w-3xl font-heading text-[clamp(2.9rem,8vw,7.5rem)] font-semibold leading-[0.86]">
                Il mondo,<br /><span className="text-primary">senza attese.</span>
              </h1>
              <p className="mt-7 max-w-xl text-sm leading-relaxed text-foreground/75 sm:text-lg">
                Charter executive progettati intorno al tuo tempo. Un unico flight advisor, dalla richiesta all’atterraggio.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-end px-5 sm:px-10 lg:px-16"
            style={{ opacity: reducedMotion ? 0 : revealOpacity, y: reducedMotion ? 0 : revealY }}
          >
            <div className="mt-24 max-w-lg border-l border-primary/55 pl-6 text-right sm:pl-10">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Your aircraft. Your schedule.</p>
              <h2 className="font-heading text-4xl font-semibold leading-none sm:text-6xl">Decolla quando<br />decidi tu.</h2>
              <p className="ml-auto mt-6 max-w-md text-sm leading-relaxed text-foreground/70 sm:text-base">
                Disponibilità reale, preventivo trasparente, concierge e transfer coordinati in un’unica esperienza digitale.
              </p>
            </div>
          </motion.div>

          {!reducedMotion && (
            <>
              <motion.div
                className="absolute left-[-12vw] top-[51%] z-[24] h-px w-[78vw] origin-right bg-gradient-to-r from-transparent via-primary/35 to-primary"
                style={{ opacity: trailOpacity, x: planeX, filter: "blur(1px)" }}
              />
              <motion.img
                src={jetFlyby}
                alt=""
                aria-hidden="true"
                width={1536}
                height={1024}
                className="pointer-events-none absolute left-0 top-[20%] z-[25] w-[min(74vw,1080px)] object-contain drop-shadow-2xl"
                style={{ x: planeX, y: planeY, scale: planeScale, rotate: planeRotate, opacity: planeOpacity }}
              />
            </>
          )}

          <motion.div className="absolute bottom-7 left-1/2 z-30 -translate-x-1/2 text-center" style={{ opacity: introOpacity }}>
            <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/60">Scorri per decollare</span>
            <ChevronDown className="mx-auto mt-2 h-5 w-5 animate-bounce text-primary" />
          </motion.div>
        </div>
      </section>

      {/* ═══ Stat strip — instrument panel ═══ */}
      <section className="relative border-y border-border/50 bg-card/60">
        <LuxeGrain opacity={0.04} />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border/50 sm:grid-cols-4">
          <LuxeStat value="5.000+" label="Aeroporti" />
          <LuxeStat value="< 2 h" label="Tempo di attivazione" />
          <LuxeStat value="24/7" label="Flight desk" />
          <LuxeStat value="100%" label="Operatori certificati" />
        </div>
      </section>

      {/* ═══ Services — premium framed panels ═══ */}
      <section className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-start gap-5">
            <LuxeTag><Sparkles className="h-3 w-3" /> Servizio privato</LuxeTag>
            <h2 className="max-w-2xl font-heading text-3xl font-semibold leading-tight sm:text-5xl">
              Un solo referente. Ogni dettaglio già previsto.
            </h2>
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

      {/* ═══ Request — VIP console ═══ */}
      <section id="richiesta" className="relative px-5 pb-24 sm:px-8 sm:pb-36">
        <LuxePanel glass glow className="mx-auto max-w-5xl px-6 py-16 text-center sm:px-14 sm:py-24">
          <CalendarDays className="mx-auto mb-7 h-8 w-8 text-primary" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Flight desk 24/7</p>
          <h2 className="mx-auto mt-5 max-w-3xl font-heading text-3xl font-semibold sm:text-6xl">
            Dimmi dove. Al resto pensiamo noi.
          </h2>
          <LuxeDivider className="mx-auto max-w-xs" />
          <p className="mx-auto max-w-xl text-muted-foreground">
            Ricevi una proposta personalizzata per rotta, passeggeri e preferenze di bordo.
          </p>
          <Button asChild size="lg" className="mt-9 min-h-12 rounded-none px-8 uppercase tracking-[0.16em]">
            <Link to="/auth">Parla con un flight advisor <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </LuxePanel>
      </section>
    </main>
  );
}
