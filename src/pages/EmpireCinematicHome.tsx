import { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import { getLenis, destroyLenis } from "@/lib/lenis-singleton";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import EmpireHeroV3 from "@/components/empire-home/EmpireHeroV3";
import ShiftSection from "@/components/empire-home/ShiftSection";
import MockupShowcase from "@/components/empire-home/MockupShowcase";
import InteractiveSectorReel from "@/components/empire-home/InteractiveSectorReel";
import CaseStudySliders from "@/components/empire-home/CaseStudySliders";
import AgentsCatalog from "@/components/empire-home/AgentsCatalog";
import ProofHorizontal from "@/components/empire-home/ProofHorizontal";
import MagneticCTA from "@/components/empire-home/MagneticCTA";
import MockupCatalog from "@/components/empire-home/MockupCatalog";
import FilmGrain from "@/components/empire-home/FilmGrain";
import HomeQAGuard from "@/components/empire-home/HomeQAGuard";
import LazyMount from "@/components/empire-home/LazyMount";
import ScrollE2EOverlay from "@/components/empire-home/ScrollE2EOverlay";

import StackedPanels from "@/components/empire-21st/StackedPanels";
import ScrollMorphHero from "@/components/empire-21st/ScrollMorphHero";
import FeatureCarousel from "@/components/empire-21st/FeatureCarousel";
import { CardStack } from "@/components/empire-21st/CardStack";
import { CinematicFooter } from "@/components/empire-21st/MotionFooter";
import { GlowyWavesHero } from "@/components/empire-21st/GlowyWavesHero";
import { CursorDrivenParticleTypography } from "@/components/empire-21st/CursorParticlesTypo";
import { NeonOrbs } from "@/components/empire-21st/NeonOrbs";
import NeonFlow from "@/components/empire-21st/NeonFlow";
import FlowFieldBackground from "@/components/empire-21st/FlowFieldBackground";
import MountainScene from "@/components/empire-21st/MountainScene";
import { CinematicHero as CinematicHero21 } from "@/components/empire-21st/CinematicHero21";

import { createMockupPool } from "@/lib/mockup-pool";

const homePool = createMockupPool();
const cardStackImages = homePool.images(6);

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
      window.setTimeout(refresh, 6000),
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
          0%, 100% { transform: translate3d(0,0,0) rotate(0deg); opacity: 0.55; }
          50% { transform: translate3d(2%, -3%, 0) rotate(8deg); opacity: 0.8; }
        }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }

        #hero-v2 button, #mockups button, #sector-reel button, #case-study button {
          transition: transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease, filter 0.3s ease;
        }
        #hero-v2 button:focus-visible,
        #mockups button:focus-visible,
        #sector-reel button:focus-visible,
        #case-study button:focus-visible {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 3px;
          border-radius: 12px;
        }
        @media (prefers-reduced-motion: reduce) {
          #hero-v2 button, #sector-reel button, #case-study button {
            transition: none !important;
          }
        }
      `}</style>

      <div className="relative min-h-screen overflow-x-hidden bg-[#050813] text-white selection:bg-[#22d3ee] selection:text-black">
        <div className="pointer-events-none fixed inset-0 z-[1]">
          <div
            className="absolute -left-[20%] -top-[10%] h-[80vh] w-[80vh] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(34,211,238,0.18), transparent 60%)",
              filter: "blur(80px)",
              animation: "auroraShift 18s ease-in-out infinite",
            }}
          />
          <div
            className="absolute right-[-15%] top-[40%] h-[70vh] w-[70vh] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(167,139,250,0.16), transparent 60%)",
              filter: "blur(90px)",
              animation: "auroraShift 22s ease-in-out -7s infinite reverse",
            }}
          />
        </div>

        <div className="relative z-[2]">
          <LandingNav />

          <div data-section="hero-v3" data-section-name="Hero V3"><EmpireHeroV3 /></div>

          <div data-section="glowy-waves" data-section-name="Glowy Waves Hero">
            <LazyMount minHeight="80vh" id="manifesto-waves">
              <GlowyWavesHero />
            </LazyMount>
          </div>

          <div data-section="shift" data-section-name="Caos → Empire"><ShiftSection /></div>

          <div data-section="cursor-particles" data-section-name="Cursor Particles">
            <LazyMount minHeight="70vh">
              <section className="relative h-[70vh] w-full overflow-hidden bg-[#05070d] flex items-center justify-center">
                <div className="absolute inset-0">
                  <CursorDrivenParticleTypography text="EMPIRE" color="#22d3ee" />
                </div>
                <p className="pointer-events-none relative z-10 mt-[40vh] px-6 text-center text-base text-white/70 sm:text-lg max-w-2xl">
                  Sostituisci i dipendenti ripetitivi con AI 24/7. Muovi il dito o il cursore.
                </p>
              </section>
            </LazyMount>
          </div>

          <div data-section="mockup-showcase" data-section-name="Mockup Showcase"><MockupShowcase /></div>

          <div data-section="stacked-panels" data-section-name="Stacked Panels (22 mockup)">
            <LazyMount minHeight="100vh" id="stacked-mockups">
              <StackedPanels />
            </LazyMount>
          </div>

          <div data-section="mountain" data-section-name="Mountain Scene">
            <LazyMount minHeight="35vh">
              <section className="relative h-[35vh] w-full overflow-hidden bg-[#020308]">
                <MountainScene />
                <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-10">
                  <p className="text-center text-xs uppercase tracking-[0.4em] text-white/60 sm:text-sm">
                    La tua azienda — vista dall'alto
                  </p>
                </div>
              </section>
            </LazyMount>
          </div>

          <div data-section="sector-reel" data-section-name="Reel Settori"><InteractiveSectorReel /></div>

          <div data-section="mockup-catalog" data-section-name="Catalogo Mockup"><MockupCatalog /></div>

          <div data-section="scroll-morph" data-section-name="Scroll Morph Hero">
            <LazyMount minHeight="260svh">
              <ScrollMorphHero />
            </LazyMount>
          </div>

          <div data-section="case-study" data-section-name="Case Study"><CaseStudySliders /></div>

          <div data-section="flow-field" data-section-name="Flow Field">
            <LazyMount minHeight="40vh">
              <section className="relative h-[40vh] w-full overflow-hidden bg-[#04060c]">
                <FlowFieldBackground />
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <h3 className="text-3xl font-black text-white sm:text-5xl">
                    Una rete neurale che<br />
                    <span className="text-emerald-300">capisce il tuo settore</span>
                  </h3>
                  <p className="mt-3 max-w-xl text-sm text-white/60 sm:text-base">
                    30+ verticali pre-configurate.
                  </p>
                </div>
              </section>
            </LazyMount>
          </div>

          <div data-section="feature-carousel" data-section-name="Feature Carousel">
            <LazyMount minHeight="260svh" id="features">
              <FeatureCarousel />
            </LazyMount>
          </div>

          <div data-section="agents" data-section-name="Agents Catalog"><AgentsCatalog /></div>

          <div data-section="card-stack" data-section-name="Card Stack Testimonianze">
            <LazyMount minHeight="80vh">
              <section className="relative w-full py-20 px-4 bg-gradient-to-b from-[#05070d] via-[#0a0f1f] to-[#05070d]">
                <div className="mx-auto mb-10 max-w-4xl text-center">
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-3">
                    Storie reali, risultati reali
                  </h2>
                  <p className="text-white/60 text-base md:text-lg">
                    Aziende che hanno automatizzato vendite, prenotazioni e supporto.
                  </p>
                </div>
                <CardStack
                  items={[
                    { id: 1, title: "Strapizzami", description: "Pizzeria · Ordini WhatsApp gestiti dall'AI", imageSrc: cardStackImages[0], tag: "Food", ctaLabel: "Vedi mockup", href: "/demo/strapizzami" },
                    { id: 2, title: "Paperfish", description: "Sushi · Prenotazioni 24/7 senza staff al telefono", imageSrc: cardStackImages[1], tag: "Sushi", ctaLabel: "Vedi mockup", href: "/demo/paperfish" },
                    { id: 3, title: "Batey Pacifico", description: "Yacht charter · Booking con voice agent multilingua", imageSrc: cardStackImages[2], tag: "Boat", ctaLabel: "Vedi mockup", href: "/demo/batey" },
                    { id: 4, title: "NCC Luxury", description: "Trasporti · Centralino AI per preventivi e corse", imageSrc: cardStackImages[3], tag: "NCC", ctaLabel: "Vedi mockup", href: "/demo/ncc" },
                    { id: 5, title: "Beauty Studio", description: "Estetica · Agenda piena, zero no-show", imageSrc: cardStackImages[4], tag: "Beauty", ctaLabel: "Vedi mockup", href: "/demo/beauty" },
                    { id: 6, title: "Fitness Club", description: "Palestra · Onboarding membri automatico", imageSrc: cardStackImages[5], tag: "Fitness", ctaLabel: "Vedi mockup", href: "/demo/fitness" },
                  ]}
                  cardWidth={300}
                  cardHeight={420}
                  scrollDriven
                  intervalMs={4000}
                  showDots
                />
              </section>
            </LazyMount>
          </div>

          <div data-section="neon-orbs" data-section-name="Neon Orbs">
            <LazyMount minHeight="40vh">
              <section className="relative h-[40vh] w-full overflow-hidden bg-black">
                <NeonOrbs />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
                  <h3 className="text-center text-3xl font-black tracking-tight text-white sm:text-5xl drop-shadow-[0_2px_30px_rgba(34,211,238,0.6)]">
                    Un solo cervello AI.<br />
                    <span className="text-[#22d3ee]">Tutta la tua azienda.</span>
                  </h3>
                </div>
              </section>
            </LazyMount>
          </div>

          <div data-section="proof" data-section-name="Proof Horizontal"><ProofHorizontal /></div>

          <div data-section="neon-flow" data-section-name="Neon Flow">
            <LazyMount minHeight="35vh">
              <section className="relative h-[35vh] w-full overflow-hidden bg-black">
                <NeonFlow />
              </section>
            </LazyMount>
          </div>

          <div data-section="cinematic-21" data-section-name="Cinematic Hero 21">
            <LazyMount minHeight="100vh">
              <CinematicHero21
                brandName="Empire"
                tagline1="Il tuo impero,"
                tagline2="su pilota automatico."
                cardHeading="L'AI che lavora mentre dormi."
                cardDescription={
                  <>
                    <span className="text-white font-semibold">Empire</span> automatizza WhatsApp,
                    telefonate, prenotazioni e pagamenti per ristoranti, NCC, beauty, fitness e altri
                    25+ settori. Stripe integrato.
                  </>
                }
                metricValue={3500}
                metricLabel="Aziende automatizzate"
                ctaHeading="Vuoi vedere la tua azienda dentro?"
                ctaDescription="Setup guidato. Cancelli quando vuoi."
              />
            </LazyMount>
          </div>

          <div data-section="magnetic-cta" data-section-name="Magnetic CTA"><MagneticCTA /></div>

          <div data-section="footer" data-section-name="Footer"><CinematicFooter /></div>
        </div>

        <FilmGrain />
        <HomeQAGuard />
        <ScrollE2EOverlay />
      </div>
    </>
  );
}
