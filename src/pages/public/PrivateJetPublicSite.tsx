import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CalendarDays, ChevronDown, Plane, Sparkles } from "lucide-react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import jetBackground from "@/assets/hero-cinematic/private-jet-hangar.jpg";
import jetFlyby from "@/assets/hero-cinematic/private-jet.png";
import { LuxeDivider, LuxeGrain, LuxePanel, LuxeStat } from "@/components/public/luxe";
import JetFilmScrub from "@/components/public/aurea-jet/JetFilmScrub";
import JetManifestoStack from "@/components/public/aurea-jet/JetManifestoStack";
import JetFilmPortal from "@/components/public/aurea-jet/JetFilmPortal";
import JetEditorial from "@/components/public/aurea-jet/JetEditorial";
import JetCabinStage from "@/components/public/aurea-jet/JetCabinStage";
import JetFlightDeck from "@/components/public/aurea-jet/JetFlightDeck";
import JetCurtainSequence from "@/components/public/aurea-jet/JetCurtainSequence";
import { ScrollMarquee } from "@/components/public/aurea-jet/JetScrollKit";
import JetPlateStrip from "@/components/public/aurea-jet/JetPlateStrip";
import JetDestinationsRail from "@/components/public/aurea-jet/JetDestinationsRail";
import JetQuoteConsole from "@/components/public/aurea-jet/JetQuoteConsole";
import JetServiceSuite from "@/components/public/aurea-jet/JetServiceSuite";
import JetTopNav from "@/components/public/aurea-jet/JetTopNav";
import JetConciergeFab from "@/components/public/aurea-jet/JetConciergeFab";
import JetScatterTrio from "@/components/public/aurea-jet/JetScatterTrio";
import JetAtmosphereSelector from "@/components/public/aurea-jet/JetAtmosphereSelector";
import JetSignatureCards from "@/components/public/aurea-jet/JetSignatureCards";
import JetCollectionTabs from "@/components/public/aurea-jet/JetCollectionTabs";
import JetDailyPick from "@/components/public/aurea-jet/JetDailyPick";




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
  const veilOpacity = useTransform(scrollYProgress, [0, 0.58, 1], [0.42, 0.58, 0.34]);
  const trailOpacity = useTransform(scrollYProgress, [0.08, 0.44, 0.78], [0, 0.85, 0]);

  return (
    <main
      id="top"
      className="min-h-screen overflow-x-clip bg-background text-foreground"
      style={{
        // Scoped luxury palette (champagne gold on deep graphite) — demo-only, does not affect Empire webapp
        ["--background" as string]: "30 8% 6%",
        ["--foreground" as string]: "40 26% 95%",
        ["--card" as string]: "30 8% 9%",
        ["--card-foreground" as string]: "40 26% 95%",
        ["--muted" as string]: "30 6% 14%",
        ["--muted-foreground" as string]: "38 12% 68%",
        ["--primary" as string]: "40 58% 62%",
        ["--primary-foreground" as string]: "30 12% 8%",
        ["--accent" as string]: "40 58% 62%",
        ["--accent-foreground" as string]: "30 12% 8%",
        ["--border" as string]: "38 16% 22%",
        ["--input" as string]: "38 16% 22%",
        ["--ring" as string]: "40 58% 62%",
      }}
    >

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

          <JetTopNav />


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

      {/* ═══ Film cinematografico scrubbato dallo scroll ═══ */}
      <JetFilmScrub />

      {/* ═══ Trio di foto sfalsate + manifesto (blocco d'apertura stile riferimento) ═══ */}
      <JetScatterTrio />

      {/* ═══ Manifesto sticky con frasi in dissolvenza (stile riferimento) ═══ */}
      <JetManifestoStack />

      {/* ═══ Film portal: fotogramma + player a schermo pieno ═══ */}
      <JetFilmPortal />

      {/* ═══ Atmosfere di bordo: swatch + crossfade + liste spec (stile Elixir) ═══ */}
      <JetAtmosphereSelector />

      {/* ═══ Manifesto editoriale + triptych parallasse ═══ */}
      <JetEditorial />

      {/* ═══ Card editoriali full-bleed con prezzo (L'icona / Il classico / L'accessibile) ═══ */}
      <JetSignatureCards />

      {/* ═══ Flotta: palco sticky + pannelli scroll-linked ═══ */}
      <JetCabinStage />

      {/* ═══ Nastro con velocità legata allo scroll (stile riferimento) ═══ */}
      <ScrollMarquee
        items={["Milano Linate", "Nizza", "Ibiza", "Olbia", "Ginevra", "Dubai", "Saint-Tropez", "Mykonos", "Londra Luton"]}
      />

      {/* ═══ Collezione flotta a tab con carosello trascinabile ═══ */}
      <JetCollectionTabs />

      {/* ═══ Sequenza a tendina + contatori ═══ */}
      <JetCurtainSequence />

      {/* ═══ La rotta del giorno (blocco Cultura del riferimento) ═══ */}
      <JetDailyPick />

      {/* ═══ La web-app Aurea Deck (console reale, full-bleed) ═══ */}
      <JetFlightDeck />

      {/* ═══ Allestimenti: nastro orizzontale con snap ═══ */}
      <JetPlateStrip />


      {/* ═══ Destinazioni: rail orizzontale pinnato ═══ */}
      <JetDestinationsRail />

      {/* ═══ Configuratore preventivo live ═══ */}
      <JetQuoteConsole />

      {/* ═══ Servizi, sicurezza, clienti, FAQ, concierge ═══ */}
      <JetServiceSuite />


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
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="min-h-12 rounded-none px-8 uppercase tracking-[0.16em]">
              <Link to="/auth">Parla con un flight advisor <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-12 rounded-none px-8 uppercase tracking-[0.16em]">
              <a href="#preventivo">Configura la tua rotta</a>
            </Button>
          </div>
        </LuxePanel>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="relative border-t border-border/50 px-5 py-14 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="flex items-center gap-2 font-heading text-lg font-semibold uppercase tracking-[0.2em]">
              <Plane className="h-4 w-4 text-primary" /> Aurea Jet
            </p>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Private aviation advisory. Charter, elicotteri, yacht e gestione aeromobili con un unico referente.
            </p>
          </div>
          <nav className="grid gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <a href="#flotta" className="min-h-9">Flotta</a>
            <a href="#servizi" className="min-h-9">Servizi</a>
            <a href="#preventivo" className="min-h-9">Preventivo</a>
            <a href="#richiesta" className="min-h-9">Contatti</a>
          </nav>
          <div className="text-xs text-muted-foreground">
            <p>Flight desk 24/7</p>
            <p className="mt-2 text-foreground">+39 02 000 0000</p>
            <p className="mt-1">fly@aureajet.it</p>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
          Sito dimostrativo Empire · dati, tariffe e disponibilità sono esemplificativi
        </p>
      </footer>
      {/* ═══ Concierge fisso (pattern del sito di riferimento) ═══ */}
      <JetConciergeFab />
    </main>

  );
}

