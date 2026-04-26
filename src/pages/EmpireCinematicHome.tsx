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
    // Init smooth scroll
    try { getLenis(); } catch (e) { console.warn("Lenis init failed", e); }

    // Refresh ScrollTrigger after layout/fonts/images settle
    const refresh = () => {
      try { ScrollTrigger.refresh(); } catch {}
    };
    const timers = [
      window.setTimeout(refresh, 400),
      window.setTimeout(refresh, 1500),
      window.setTimeout(refresh, 3500),
    ];

    // Refresh on full load
    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh, { once: true });
    }

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", refresh);
      try {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      } catch {}
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
          <HeroExplosion />
          <MarqueeManifesto />
          <ShiftSection />
          <ParallaxDepth />
          <EcosystemGrid />
          <StickyAgentsReveal />
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
