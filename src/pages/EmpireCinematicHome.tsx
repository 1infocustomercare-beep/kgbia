import { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import { getLenis, destroyLenis } from "@/lib/lenis-singleton";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import EmpireHeroV2 from "@/components/empire-home/EmpireHeroV2";
import ShiftSection from "@/components/empire-home/ShiftSection";
import MockupShowcase from "@/components/empire-home/MockupShowcase";
import InteractiveSectorReel from "@/components/empire-home/InteractiveSectorReel";
import CaseStudySliders from "@/components/empire-home/CaseStudySliders";
import AgentsCatalog from "@/components/empire-home/AgentsCatalog";
import ProofHorizontal from "@/components/empire-home/ProofHorizontal";
import MagneticCTA from "@/components/empire-home/MagneticCTA";
import FilmGrain from "@/components/empire-home/FilmGrain";
import HomeQAGuard from "@/components/empire-home/HomeQAGuard";

// Componenti 21st STABILI (no WebGL, no canvas heavy che crashano lo scroll)
import StackedPanels from "@/components/empire-21st/StackedPanels";
import ScrollMorphHero from "@/components/empire-21st/ScrollMorphHero";
import FeatureCarousel from "@/components/empire-21st/FeatureCarousel";
import { CardStack } from "@/components/empire-21st/CardStack";
import { CinematicFooter } from "@/components/empire-21st/MotionFooter";

import { createMockupPool } from "@/lib/mockup-pool";

const homePool = createMockupPool();
const cardStackImages = homePool.images(6);

/**
 * Empire Home v3 — funnel pulito, mockup ruotati, niente claim falsi.
 * Tutti i componenti pesanti sono mount sincroni (no Suspense) per evitare
 * gli errori `insertBefore` causati da Lenis/GSAP che entrano in conflitto
 * con il mount lazy quando l'utente scrolla rapidamente.
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
          0%, 100% { transform: translate3d(0,0,0) rotate(0deg); opacity: 0.55; }
          50% { transform: translate3d(2%, -3%, 0) rotate(8deg); opacity: 0.8; }
        }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }

        /* Micro-interazioni globali */
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
        {/* Aurora background fissa, leggera */}
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

          {/* 1. HERO V2 — primo schermo d'impatto, mockup reali, no WebGL */}
          <EmpireHeroV2 />

          {/* 2. CAOS → EMPIRE — pinned scrub */}
          <ShiftSection />

          {/* 3. MOCKUP SHOWCASE — iPhone stack reali */}
          <MockupShowcase />

          {/* 4. STACKED PANELS — 22 mockup unici scroll-driven */}
          <section id="stacked-mockups" className="relative">
            <StackedPanels />
          </section>

          {/* 5. REEL SETTORI — orizzontale */}
          <InteractiveSectorReel />

          {/* 6. SCROLL MORPH HERO — mockup che si compongono */}
          <section className="relative">
            <ScrollMorphHero />
          </section>

          {/* 7. CASO STUDIO interattivo (slider risultati) */}
          <CaseStudySliders />

          {/* 8. FEATURE CAROUSEL — 8 servizi Empire */}
          <section id="features" className="relative">
            <FeatureCarousel />
          </section>

          {/* 9. AGENTI / Cosa fa Empire */}
          <AgentsCatalog />

          {/* 10. CARD STACK — testimonianze con mockup veri */}
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
              autoAdvance
              intervalMs={4000}
              showDots
            />
          </section>

          {/* 11. PROOF orizzontale */}
          <ProofHorizontal />

          {/* 12. CTA finale magnetica */}
          <MagneticCTA />

          {/* 13. FOOTER cinematografico */}
          <CinematicFooter />
        </div>

        <FilmGrain />
        <HomeQAGuard />
      </div>
    </>
  );
}
