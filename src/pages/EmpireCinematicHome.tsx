import { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import { getLenis, destroyLenis } from "@/lib/lenis-singleton";

import HeroExplosion from "@/components/empire-home/HeroExplosion";
import MarqueeManifesto from "@/components/empire-home/MarqueeManifesto";
import ShiftSection from "@/components/empire-home/ShiftSection";
import EcosystemGrid from "@/components/empire-home/EcosystemGrid";
import ProofHorizontal from "@/components/empire-home/ProofHorizontal";
import MagneticCTA from "@/components/empire-home/MagneticCTA";
import ThermalBackground from "@/components/empire-home/ThermalBackground";
import FilmGrain from "@/components/empire-home/FilmGrain";
import CinematicCursor from "@/components/empire-home/CinematicCursor";

export default function EmpireCinematicHome() {
  useEffect(() => {
    const lenis = getLenis();
    return () => {
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
      `}</style>

      <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white selection:bg-[#a78bfa] selection:text-black">
        {/* WebGL thermal layer */}
        <ThermalBackground intensity={0.85} />
        {/* Atmosphere overlay */}
        <div className="pointer-events-none fixed inset-0 z-[1]" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(126,183,190,0.10), transparent 60%), linear-gradient(180deg, rgba(5,5,5,0.4), rgba(5,5,5,0.85))",
        }} />

        <div className="relative z-[2]">
          <LandingNav />

          <HeroExplosion />
          <MarqueeManifesto />
          <ShiftSection />
          <EcosystemGrid />
          <ProofHorizontal />
          <MagneticCTA />

          <LandingFooter />
        </div>

        <FilmGrain />
        <CinematicCursor />
      </div>
    </>
  );
}
