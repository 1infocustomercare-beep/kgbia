import { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import { getLenis, destroyLenis } from "@/lib/lenis-singleton";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeroExplosion from "@/components/empire-home/HeroExplosion";
import MarqueeManifesto from "@/components/empire-home/MarqueeManifesto";
import ShiftSection from "@/components/empire-home/ShiftSection";
import ParallaxDepth from "@/components/empire-home/ParallaxDepth";
import EcosystemGrid from "@/components/empire-home/EcosystemGrid";
import StickyAgentsReveal from "@/components/empire-home/StickyAgentsReveal";
import ProofHorizontal from "@/components/empire-home/ProofHorizontal";
import MagneticCTA from "@/components/empire-home/MagneticCTA";
import ThermalBackground from "@/components/empire-home/ThermalBackground";
import FilmGrain from "@/components/empire-home/FilmGrain";
import CinematicCursor from "@/components/empire-home/CinematicCursor";

export default function EmpireCinematicHome() {
  useEffect(() => {
    getLenis();
    // Refresh ScrollTrigger after layout settles
    const r1 = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    const r2 = window.setTimeout(() => ScrollTrigger.refresh(), 1500);
    const r3 = window.setTimeout(() => ScrollTrigger.refresh(), 3500);
    return () => {
      clearTimeout(r1); clearTimeout(r2); clearTimeout(r3);
      destroyLenis();
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes grain {
          0% { transform: translate(0,0); }
          20% { transform: translate(-3%, 5%); }
          40% { transform: translate(2%, -4%); }
          60% { transform: translate(-2%, 3%); }
          80% { transform: translate(4%, 2%); }
          100% { transform: translate(0,0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
      `}</style>

      <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white selection:bg-[#a78bfa] selection:text-black">
        <ThermalBackground intensity={0.85} />
        <div className="pointer-events-none fixed inset-0 z-[1]" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(126,183,190,0.10), transparent 60%), linear-gradient(180deg, rgba(5,5,5,0.4), rgba(5,5,5,0.85))",
        }} />

        <div className="relative z-[2]">
          <LandingNav />

          {/* 01 — Hero esplosivo */}
          <HeroExplosion />

          {/* 02 — Marquee orizzontale scrubbed */}
          <MarqueeManifesto />

          {/* 03 — Shift pinned (chaos -> empire) */}
          <ShiftSection />

          {/* 04 — Parallax depth con strati */}
          <ParallaxDepth />

          {/* 05 — Griglia servizi con glow magnetico */}
          <EcosystemGrid />

          {/* 06 — Sticky agents (visual fissato + scroll panels) */}
          <StickyAgentsReveal />

          {/* 07 — Proof horizontal scroll */}
          <ProofHorizontal />

          {/* 08 — CTA magnetica */}
          <MagneticCTA />

          <LandingFooter />
        </div>

        <FilmGrain />
        <CinematicCursor />
      </div>
    </>
  );
}
