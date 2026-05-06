import { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import { getLenis, destroyLenis } from "@/lib/lenis-singleton";

import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import PrestigeHero from "@/components/empire-home/prestige/PrestigeHero";
import PrestigeStorytelling from "@/components/empire-home/prestige/PrestigeStorytelling";
import PrestigeServices from "@/components/empire-home/prestige/PrestigeServices";
import PrestigeIndustries from "@/components/empire-home/prestige/PrestigeIndustries";
import PrestigePortfolioCarousel from "@/components/empire-home/prestige/PrestigePortfolioCarousel";
import PrestigeProcess from "@/components/empire-home/prestige/PrestigeProcess";
import PrestigeProof from "@/components/empire-home/prestige/PrestigeProof";
import PrestigeCTA from "@/components/empire-home/prestige/PrestigeCTA";

import { CinematicFooter } from "@/components/empire-21st/MotionFooter";

/**
 * Emerald Prestige Home — Lowengeld-style luxury agency homepage.
 * Sezioni alternate dark/light, copy persuasivo, effetti sincronizzati con ScrollDirector.
 */
export default function EmpirePrestigeHome() {
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    try {
      getLenis();
    } catch (e) {
      console.warn("Lenis init failed", e);
    }
    return () => {
      destroyLenis();
    };
  }, []);

  return (
    <>
      <PrestigeTheme />
      <div className="prestige-root min-h-screen overflow-x-hidden">
        <LandingNav />
        <PrestigeHero />
        <PrestigeStorytelling />
        <PrestigeServices />
        <PrestigeIndustries />
        <PrestigePortfolioCarousel />
        <PrestigeProcess />
        <PrestigeProof />
        <PrestigeCTA />
        <div className="prestige-dark">
          <CinematicFooter />
        </div>
      </div>
    </>
  );
}
