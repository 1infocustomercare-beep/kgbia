import { useEffect, lazy, Suspense } from "react";
import LandingNav from "@/components/landing/LandingNav";
import { getLenis, destroyLenis } from "@/lib/lenis-singleton";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeroExplosion from "@/components/empire-home/HeroExplosion";
import CaseStudySliders from "@/components/empire-home/CaseStudySliders";
import ShiftSection from "@/components/empire-home/ShiftSection";
import MockupShowcase from "@/components/empire-home/MockupShowcase";
import InteractiveSectorReel from "@/components/empire-home/InteractiveSectorReel";
import AgentsCatalog from "@/components/empire-home/AgentsCatalog";
import ProofHorizontal from "@/components/empire-home/ProofHorizontal";
import MagneticCTA from "@/components/empire-home/MagneticCTA";
import FilmGrain from "@/components/empire-home/FilmGrain";
import CinematicCursor from "@/components/empire-home/CinematicCursor";
import HomeQAGuard from "@/components/empire-home/HomeQAGuard";

// 12 componenti adattati da 21st.dev — lazy per non bloccare LCP
const NeonOrbs = lazy(() => import("@/components/empire-21st/NeonOrbs").then(m => ({ default: m.NeonOrbs })));
const NeonFlow = lazy(() => import("@/components/empire-21st/NeonFlow"));
const FlowFieldBackground = lazy(() => import("@/components/empire-21st/FlowFieldBackground"));
const MountainScene = lazy(() => import("@/components/empire-21st/MountainScene"));
const GlowyWavesHero = lazy(() => import("@/components/empire-21st/GlowyWavesHero").then(m => ({ default: m.GlowyWavesHero })));
const ScrollMorphHero = lazy(() => import("@/components/empire-21st/ScrollMorphHero"));
const StackedPanels = lazy(() => import("@/components/empire-21st/StackedPanels"));
const FeatureCarousel = lazy(() => import("@/components/empire-21st/FeatureCarousel"));
const CinematicHero21 = lazy(() => import("@/components/empire-21st/CinematicHero21").then(m => ({ default: m.CinematicHero })));
const CursorParticlesTypo = lazy(() => import("@/components/empire-21st/CursorParticlesTypo").then(m => ({ default: m.CursorDrivenParticleTypography })));
const CardStack = lazy(() => import("@/components/empire-21st/CardStack").then(m => ({ default: m.CardStack })));
const MotionFooter = lazy(() => import("@/components/empire-21st/MotionFooter").then(m => ({ default: m.CinematicFooter })));

import { createMockupPool } from "@/lib/mockup-pool";

// Pool unico per la home: ogni sezione che pesca riceve mockup freschi
const homePool = createMockupPool();
const cardStackImages = homePool.images(6);
const featuredMockups = homePool.images(8);


/**
 * Empire Cinematic Home — Aurora edition
 * Ogni sezione ha un'interazione scroll DIVERSA:
 *  1. HeroExplosion         → esplosione + parallax mouse
 *  2. MarqueeManifesto      → scrub orizzontale outline
 *  3. ShiftSection          → pinned scrub Caos→Empire
 *  4. MockupShowcase        → sticky 3D stack iPhone reali (NUOVO)
 *  5. AgentsCatalog         → bento masonry + color morph (NUOVO)
 *  6. SectorsLive           → tabs con iframe live demo (NUOVO)
 *  7. ProofHorizontal       → pin orizzontale numeri/quotes
 *  8. MagneticCTA           → magnetic snap finale
 */

export default function EmpireCinematicHome() {
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    try { getLenis(); } catch (e) { console.warn("Lenis init failed", e); }

    const refresh = () => { try { ScrollTrigger.refresh(); } catch {} };
    const timers = [
      window.setTimeout(refresh, 400),
      window.setTimeout(refresh, 1500),
      window.setTimeout(refresh, 3500),
    ];

    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", refresh);
      try { ScrollTrigger.getAll().forEach((t) => t.kill()); } catch {}
      destroyLenis();
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes auroraShift {
          0%, 100% { transform: translate3d(0,0,0) rotate(0deg); opacity: 0.6; }
          50% { transform: translate3d(2%, -3%, 0) rotate(8deg); opacity: 0.85; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }

        /* Micro-interazioni globali home — sottili, no overlap */
        #hero a, #hero button,
        #mockups button, #sector-reel button,
        #case-study button {
          transition: transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease, filter 0.3s ease;
        }
        #hero a:focus-visible, #hero button:focus-visible,
        #mockups button:focus-visible, #sector-reel button:focus-visible,
        #case-study button:focus-visible {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 3px;
          border-radius: 12px;
        }
        @media (hover: hover) {
          #sector-reel [data-reel-card]:hover {
            transform: translateY(-4px) scale(1.02) !important;
            filter: brightness(1.08);
          }
          #case-study .group:hover svg { transform: scale(1.12) rotate(-4deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          #hero a, #hero button, #sector-reel button, #case-study button {
            transition: none !important;
          }
        }
      `}</style>

      <div className="relative min-h-screen overflow-x-hidden bg-[#050813] text-white selection:bg-[#22d3ee] selection:text-black">
        {/* Aurora living background — 3 blob morbidi che si muovono */}
        <div className="pointer-events-none fixed inset-0 z-[1]">
          <div
            className="absolute -left-[20%] -top-[10%] h-[80vh] w-[80vh] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(34,211,238,0.22), transparent 60%)",
              filter: "blur(80px)",
              animation: "auroraShift 18s ease-in-out infinite",
            }}
          />
          <div
            className="absolute right-[-15%] top-[30%] h-[70vh] w-[70vh] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(74,222,128,0.18), transparent 60%)",
              filter: "blur(90px)",
              animation: "auroraShift 22s ease-in-out -7s infinite reverse",
            }}
          />
          <div
            className="absolute bottom-[-10%] left-[20%] h-[60vh] w-[60vh] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(167,139,250,0.20), transparent 60%)",
              filter: "blur(100px)",
              animation: "auroraShift 26s ease-in-out -12s infinite",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34,211,238,0.08), transparent 60%), linear-gradient(180deg, rgba(8,12,24,0.4), rgba(8,12,24,0.85))",
            }}
          />
        </div>

        <div className="relative z-[2]">
          <LandingNav />

          {/* 1. HERO — explosion cinematografica Empire */}
          <HeroExplosion />

          {/* 2. WOW BACKGROUND — Glowy Waves Hero (21st) come "manifesto" */}
          <Suspense fallback={<div className="h-[60vh] bg-[#050813]" />}>
            <section id="manifesto-waves" className="relative">
              <GlowyWavesHero />
            </section>
          </Suspense>

          {/* 3. PRIMA vs DOPO */}
          <ShiftSection />

          {/* 4. CURSOR PARTICLES TYPO — manifesto interattivo */}
          <Suspense fallback={null}>
            <section className="relative h-[80vh] w-full overflow-hidden bg-[#05070d] flex flex-col items-center justify-center">
              <div className="absolute inset-0">
                <CursorParticlesTypo text="EMPIRE" color="#22d3ee" />
              </div>
              <p className="relative z-10 mt-[40vh] px-6 text-center text-base md:text-xl text-white/70 max-w-2xl pointer-events-none">
                Sostituisci i dipendenti ripetitivi con AI che lavora 24/7. Muovi il cursore.
              </p>
            </section>
          </Suspense>

          {/* 5. MOCKUP SHOWCASE — iPhone stack reali */}
          <MockupShowcase />

          {/* 6. STACKED PANELS (21st) — 22 mockup unici scroll-driven */}
          <Suspense fallback={null}>
            <section id="stacked-mockups" className="relative">
              <StackedPanels />
            </section>
          </Suspense>

          {/* 6b. INTERLUDIO — Mountain Scene generativa (transizione visiva) */}
          <Suspense fallback={null}>
            <section className="relative h-[35vh] w-full overflow-hidden bg-[#020308]">
              <MountainScene />
              <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-10">
                <p className="text-center text-xs md:text-sm uppercase tracking-[0.4em] text-white/60">
                  La tua azienda — vista dall'alto
                </p>
              </div>
            </section>
          </Suspense>

          {/* 7. REEL settori orizzontale */}
          <InteractiveSectorReel />

          {/* 8. SCROLL MORPH HERO (21st) — mockup che si compongono */}
          <Suspense fallback={null}>
            <section className="relative">
              <ScrollMorphHero />
            </section>
          </Suspense>

          {/* 9. CASO STUDIO interattivo (slider risultati) */}
          <CaseStudySliders />

          {/* 9b. INTERLUDIO — Flow Field neurale (background sotto titolo) */}
          <Suspense fallback={null}>
            <section className="relative h-[40vh] w-full overflow-hidden bg-[#04060c]">
              <FlowFieldBackground />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <h3 className="text-3xl md:text-5xl font-black text-white">
                  Una rete neurale che<br /><span className="text-emerald-300">capisce il tuo settore</span>
                </h3>
                <p className="mt-3 text-white/60 text-sm md:text-base max-w-xl">
                  30+ verticali pre-configurate. La tua attività trova subito il proprio posto.
                </p>
              </div>
            </section>
          </Suspense>

          {/* 10. FEATURE CAROUSEL (21st) — 8 servizi Empire */}
          <Suspense fallback={null}>
            <section id="features-21st" className="relative">
              <FeatureCarousel />
            </section>
          </Suspense>

          {/* 11. AGENTI CATALOG */}
          <AgentsCatalog />

          {/* 12. CARD STACK (21st) — testimonianze + casi reali */}
          <Suspense fallback={null}>
            <section className="relative w-full py-24 px-4 bg-gradient-to-b from-[#05070d] via-[#0a0f1f] to-[#05070d]">
              <div className="max-w-6xl mx-auto text-center mb-12">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
                  Storie che parlano da sole
                </h2>
                <p className="text-white/60 text-lg">
                  Aziende che hanno automatizzato vendite, prenotazioni e supporto.
                </p>
              </div>
              <CardStack
                items={[
                  { id: 1, title: "Strapizzami", description: "+38% ordini WhatsApp in 30 giorni", imageSrc: cardStackImages[0], tag: "Pizzeria", ctaLabel: "Vedi demo", href: "/demo/strapizzami" },
                  { id: 2, title: "Paperfish", description: "Prenotazioni gestite 24/7 dall'AI", imageSrc: cardStackImages[1], tag: "Sushi", ctaLabel: "Vedi demo", href: "/demo/paperfish" },
                  { id: 3, title: "Batey Pacifico", description: "Yacht charter senza staff telefono", imageSrc: cardStackImages[2], tag: "Boat", ctaLabel: "Vedi demo", href: "/demo/batey" },
                  { id: 4, title: "NCC Luxury", description: "Voice agent multilingua per booking", imageSrc: cardStackImages[3], tag: "NCC", ctaLabel: "Vedi demo", href: "/demo/ncc" },
                  { id: 5, title: "Beauty Studio", description: "Agenda piena, zero no-show", imageSrc: cardStackImages[4], tag: "Beauty", ctaLabel: "Vedi demo", href: "/demo/beauty" },
                  { id: 6, title: "Fitness Club", description: "Onboarding membri automatico", imageSrc: cardStackImages[5], tag: "Fitness", ctaLabel: "Vedi demo", href: "/demo/fitness" },
                ]}
                cardWidth={300}
                cardHeight={420}
                autoAdvance
                intervalMs={4000}
                showDots
              />
            </section>
          </Suspense>

          {/* 12b. INTERLUDIO — Neon Orbs (background generativo leggero) */}
          <Suspense fallback={null}>
            <section className="relative h-[40vh] w-full overflow-hidden bg-black">
              <NeonOrbs />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <h3 className="text-center text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_2px_30px_rgba(34,211,238,0.6)]">
                  Un solo cervello AI.<br />
                  <span className="text-[#22d3ee]">Tutta la tua azienda.</span>
                </h3>
              </div>
            </section>
          </Suspense>

          {/* 13. PROOF orizzontale — numeri */}
          <ProofHorizontal />

          {/* 13b. INTERLUDIO — Neon Flow tubes (transizione luminosa verso CTA) */}
          <Suspense fallback={null}>
            <section className="relative h-[35vh] w-full overflow-hidden bg-black">
              <NeonFlow />
            </section>
          </Suspense>

          {/* 14. CINEMATIC HERO 21 — bridge verso CTA */}
          <Suspense fallback={null}>
            <section className="relative">
              <CinematicHero21
                brandName="Empire"
                tagline1="Il tuo impero,"
                tagline2="su pilota automatico."
                cardHeading="L'AI che lavora mentre dormi."
                cardDescription={
                  <>
                    <span className="text-white font-semibold">Empire</span> automatizza WhatsApp, telefonate, prenotazioni
                    e pagamenti per ristoranti, NCC, beauty, fitness e altri 25+ settori.
                    Stripe integrato, demo in 60 secondi.
                  </>
                }
                metricValue={3500}
                metricLabel="Aziende automatizzate"
                ctaHeading="Vuoi vedere la tua azienda dentro?"
                ctaDescription="Genera il tuo sito demo personalizzato in 60 secondi. Gratis, no carta."
              />
            </section>
          </Suspense>

          {/* 15. CTA finale magnetica */}
          <MagneticCTA />

          {/* 16. FOOTER cinematografico (21st curtain reveal) */}
          <Suspense fallback={null}>
            <MotionFooter />
          </Suspense>
        </div>

        <FilmGrain />
        <CinematicCursor />
        <HomeQAGuard />
      </div>
    </>
  );
}
