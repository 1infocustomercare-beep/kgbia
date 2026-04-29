import { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import { getLenis, destroyLenis } from "@/lib/lenis-singleton";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeroExplosion from "@/components/empire-home/HeroExplosion";
import MarqueeManifesto from "@/components/empire-home/MarqueeManifesto";
import JungleParallax from "@/components/empire-home/JungleParallax";
import ShiftSection from "@/components/empire-home/ShiftSection";
import MockupShowcase from "@/components/empire-home/MockupShowcase";
import Orbit3D from "@/components/empire-home/Orbit3D";
import AgentsCatalog from "@/components/empire-home/AgentsCatalog";
import SectorsLive from "@/components/empire-home/SectorsLive";
import Web3Carousel from "@/components/empire-home/Web3Carousel";
import ProofHorizontal from "@/components/empire-home/ProofHorizontal";
import MagneticCTA from "@/components/empire-home/MagneticCTA";
import FilmGrain from "@/components/empire-home/FilmGrain";
import CinematicCursor from "@/components/empire-home/CinematicCursor";

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
          <HeroExplosion />              {/* 1. Esplosione cinematografica */}
          <MarqueeManifesto />           {/* 2. Marquee scrub orizzontale */}
          <JungleParallax />             {/* 3. Giungla urbana parallax 3D */}
          <ShiftSection />               {/* 4. Pinned chaos→empire */}
          <MockupShowcase />             {/* 5. Sticky 3D iPhone stack */}
          <Orbit3D />                    {/* 6. Portfolio orbitale 3D */}
          <AgentsCatalog />              {/* 7. Bento + color morph */}
          <SectorsLive />                {/* 8. Live iframe demo */}
          <Web3Carousel />               {/* 9. Carousel pinned orizzontale */}
          <ProofHorizontal />            {/* 10. Numeri pinned */}
          <MagneticCTA />                {/* 11. CTA magnetica */}
          <LandingFooter />
        </div>

        <FilmGrain />
        <CinematicCursor />
      </div>
    </>
  );
}
