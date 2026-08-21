import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { ArrowRight, CalendarDays, ChevronDown, Plane, Sparkles } from "lucide-react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import jetBackground from "@/assets/hero-cinematic/private-jet-hangar.jpg";
import jetFlyby from "@/assets/hero-cinematic/private-jet.png";
import { LuxeDivider, LuxeGrain, LuxePanel, LuxeStat } from "@/components/public/luxe";
import JetFilmScrub from "@/components/public/aurea-jet/JetFilmScrub";
import JetFlightDeck from "@/components/public/aurea-jet/JetFlightDeck";
import JetCurtainSequence from "@/components/public/aurea-jet/JetCurtainSequence";
import { ScrollMarquee } from "@/components/public/aurea-jet/JetScrollKit";
import JetPlateStrip from "@/components/public/aurea-jet/JetPlateStrip";
import JetQuoteConsole from "@/components/public/aurea-jet/JetQuoteConsole";
import JetServiceSuite from "@/components/public/aurea-jet/JetServiceSuite";
import JetTopNav from "@/components/public/aurea-jet/JetTopNav";
import JetConciergeFab from "@/components/public/aurea-jet/JetConciergeFab";
import JetScatterTrio from "@/components/public/aurea-jet/JetScatterTrio";
import JetAtmosphereSelector from "@/components/public/aurea-jet/JetAtmosphereSelector";
import JetWindowDive from "@/components/public/aurea-jet/JetWindowDive";
import JetFleetGrid from "@/components/public/aurea-jet/JetFleetGrid";
import JetAppDock from "@/components/public/aurea-jet/JetAppDock";
import JetCircleForm from "@/components/public/aurea-jet/JetCircleForm";
import { getLenis, destroyLenis } from "@/lib/lenis-singleton";
import heroClouds from "@/assets/aurea-jet/hero-clouds.jpg";
import { JET_SCROLL } from "@/components/public/aurea-jet/jet-motion";

export default function PrivateJetPublicSite() {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end end"] });

  // Smooth scrolling cinematografico + font serif esclusivo (solo su questa demo)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    getLenis();
    return () => destroyLenis();
  }, []);

  useEffect(() => {
    const id = "aurea-jet-serif";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap";
    document.head.appendChild(link);
  }, []);


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
      className="jet-lux min-h-screen overflow-x-clip bg-background text-foreground"
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
      <style>{`
.jet-serif{font-family:'Playfair Display',Georgia,serif;font-weight:500;letter-spacing:-0.01em}

/* ═══ Aurea Liquid Glass — livello vetro luxury coerente su tutto il sito ═══ */
.jet-lux .jet-glass,
.jet-lux [class*="bg-card/"],
.jet-lux [class*="bg-background/"]{
  -webkit-backdrop-filter:blur(20px) saturate(150%);
  backdrop-filter:blur(20px) saturate(150%);
}
.jet-lux .jet-glass{
  position:relative;
  background:
    linear-gradient(160deg,hsl(40 40% 92% / 0.08) 0%,hsl(30 10% 8% / 0.55) 42%,hsl(30 10% 6% / 0.72) 100%);
  border:1px solid hsl(40 45% 80% / 0.14);
  box-shadow:
    inset 0 1px 0 hsl(40 60% 92% / 0.14),
    inset 0 -1px 0 hsl(30 10% 4% / 0.6),
    0 24px 70px -38px hsl(30 20% 2% / 0.9);
}
/* riflesso obliquo che scorre sul vetro all'hover */
.jet-lux .jet-sheen::after{
  content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;
  background:linear-gradient(115deg,transparent 34%,hsl(40 70% 90% / 0.16) 46%,transparent 58%);
  transform:translateX(-120%);
  transition:transform 1.1s cubic-bezier(.16,1,.3,1);
}
.jet-lux .jet-sheen:hover::after{transform:translateX(120%)}

/* pannelli/card esistenti ereditano lo stesso vetro champagne */
.jet-lux section [class*="bg-card/"]{
  border-color:hsl(40 45% 80% / 0.13);
  box-shadow:inset 0 1px 0 hsl(40 60% 92% / 0.1),0 22px 60px -40px hsl(30 20% 2% / 0.85);
}
.jet-lux ::selection{background:hsl(40 58% 62% / 0.28)}

/* Mobile: vetro più leggero per performance, nessun overflow orizzontale */
@media (max-width:640px){
  .jet-lux .jet-glass,
  .jet-lux [class*="bg-card/"],
  .jet-lux [class*="bg-background/"]{
    -webkit-backdrop-filter:blur(12px) saturate(130%);
    backdrop-filter:blur(12px) saturate(130%);
  }
  .jet-lux .jet-sheen::after{display:none}
  .jet-lux img{max-width:100%}
}
@media (prefers-reduced-motion:reduce){
  .jet-lux .jet-sheen::after{display:none}
}
      `}</style>


      <BackButton to="/demo" label="Tutte le demo" variant="floating" theme="glass" className="!h-11 !w-11" />

      <section ref={heroRef} className={`relative bg-background ${JET_SCROLL.heroHeight}`}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.img
            src={heroClouds}
            alt="Jet privato che emerge dalle nuvole al tramonto"
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
            style={reducedMotion ? undefined : { scale: backdropScale, y: backdropY }}
          />
          <motion.img
            src={jetBackground}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-[60%_center] opacity-20 mix-blend-luminosity"
            style={reducedMotion ? undefined : { scale: backdropScale }}
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
            <motion.div
              className="max-w-3xl pt-16"
              initial={{ opacity: 0, y: 46 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                <Sparkles className="h-4 w-4" /> Noleggio e vendita jet privati
              </p>
              <h1 className="jet-serif max-w-3xl text-[clamp(2.6rem,7.4vw,6.8rem)] leading-[0.9]">
                Il tempo non si compra.<br /><span className="italic text-primary">Si domina.</span>
              </h1>

              <p className="mt-7 max-w-xl text-sm leading-relaxed text-foreground/75 sm:text-lg">
                Charter executive progettati intorno al tuo tempo. Un unico flight advisor, dalla richiesta all’atterraggio.
              </p>
            </motion.div>

          </motion.div>

          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-end px-5 sm:px-10 lg:px-16"
            style={{ opacity: reducedMotion ? 0 : revealOpacity, y: reducedMotion ? 0 : revealY }}
          >
            <div className="mt-24 max-w-lg border-l border-primary/55 pl-6 text-right sm:pl-10">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">Your aircraft. Your schedule.</p>
              <h2 className="jet-serif text-4xl leading-none sm:text-6xl">Decolla quando<br /><span className="italic text-primary">decidi tu.</span></h2>
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

      {/* ═══ 01 · Apertura editoriale leggera ═══ */}
      <JetScatterTrio />

      {/* ═══ 02 · Primo atto immersivo: ingresso nella suite ═══ */}
      <JetWindowDive />

      {/* ═══ 03 · Flotta: il prodotto arriva prima della metà pagina ═══ */}
      <JetFleetGrid />

      {/* ═══ 04 · Atmosfere di bordo: swatch + crossfade + liste spec ═══ */}
      <JetAtmosphereSelector />

      {/* ═══ 05 · Aurea Journey: unico film, scrubbato e sincronizzato ═══ */}
      <JetFilmScrub />

      {/* ═══ 06 · Nastro destinazioni come pausa editoriale ═══ */}
      <ScrollMarquee
        items={["Milano Linate", "Nizza", "Ibiza", "Olbia", "Ginevra", "Dubai", "Saint-Tropez", "Mykonos", "Londra Luton"]}
      />

      {/* ═══ 07 · Sequenza a tendina + contatori ═══ */}
      <JetCurtainSequence />

      {/* ═══ 08 · (rimosso dal flusso: sezione atelier non pertinente al sito agenzia) ═══ */}


      {/* ═══ 09 · Materiali: nastro orizzontale con snap ═══ */}
      <JetPlateStrip />

      {/* ═══ 10 · Configuratore preventivo live ═══ */}
      <JetQuoteConsole />

      {/* ═══ 11 · La web-app Aurea Deck (console operativa reale) ═══ */}
      <JetFlightDeck />

      {/* ═══ 12 · Servizi, sicurezza, clienti, FAQ, concierge ═══ */}
      <JetServiceSuite />

      {/* ═══ 13 · Cerchio esclusivo: rotte off-market ═══ */}
      <JetCircleForm />



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
      {/* ═══ Concierge fisso + dock applicativo ═══ */}
      <JetConciergeFab />
      <JetAppDock />
      <div aria-hidden className="h-20 sm:h-16" />

    </main>

  );
}

