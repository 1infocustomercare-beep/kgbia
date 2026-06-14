import React, { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import { getLenis, destroyLenis } from "@/lib/lenis-singleton";

import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import PrestigeEffects from "@/components/empire-home/prestige/PrestigeEffects";
import PrestigeHero from "@/components/empire-home/prestige/PrestigeHero";
import PrestigeStoryPinned from "@/components/empire-home/prestige/PrestigeStoryPinned";
import PrestigeMarquee from "@/components/empire-home/prestige/PrestigeMarquee";
import PrestigeServices from "@/components/empire-home/prestige/PrestigeServices";
import PrestigeIndustries from "@/components/empire-home/prestige/PrestigeIndustries";
import PrestigePortfolioCarousel from "@/components/empire-home/prestige/PrestigePortfolioCarousel";
import PrestigeProcess from "@/components/empire-home/prestige/PrestigeProcess";
import PrestigeProof from "@/components/empire-home/prestige/PrestigeProof";
import PrestigeCTA from "@/components/empire-home/prestige/PrestigeCTA";
import PrestigeProgressBar from "@/components/empire-home/prestige/PrestigeProgressBar";
import { PrestigeLangProvider } from "@/components/empire-home/prestige/PrestigeLang";

import { CinematicFooter } from "@/components/empire-21st/MotionFooter";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";
import { HomepageContentProvider, useHomepageContent } from "@/hooks/useHomepageContent";

/** Voice agent memoised so it never re-renders with the page scroll. */
const SafeVoiceAgent = React.memo(() => <EmpireVoiceAgent />, () => true);

/**
 * Emerald Prestige Home — Lowengeld-style luxury agency homepage.
 * Sezioni alternate dark/light, copy persuasivo bilingue IT/EN, effetti scroll
 * sincronizzati via ScrollDirector + storytelling Caos→Empire pinnato.
 * Additivo: film grain cinematico, Arianna voice agent, brand HSL overrides.
 */
function EmpirePrestigeHomeInner() {
  const { content, isPreview } = useHomepageContent();

  // Brand HSL overrides (parity con LandingPage)
  useEffect(() => {
    const b = content.brand ?? {};
    const root = document.documentElement;
    const apply = (cssVar: string, hsl?: string) => {
      if (hsl && hsl.trim()) root.style.setProperty(cssVar, hsl);
    };
    apply("--primary", b.primaryHsl);
    apply("--accent", b.accentHsl);
    apply("--gold", b.goldHsl);
  }, [content.brand]);

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
      <PrestigeProgressBar />
      <div className="prestige-root min-h-screen overflow-x-hidden">
        {/* Cinematic film grain — purely decorative, pointer-events:none */}
        <div className="prestige-noise" aria-hidden="true" />

        <LandingNav />
        <PrestigeHero />
        <PrestigeMarquee />
        <PrestigeStoryPinned />
        <PrestigeServices />
        <PrestigeIndustries />
        <PrestigePortfolioCarousel />
        <PrestigeProcess />
        <PrestigeProof />
        <PrestigeCTA />
        <div className="prestige-dark">
          <CinematicFooter />
        </div>

        {!isPreview && <SafeVoiceAgent />}
      </div>
    </>
  );
}

export default function EmpirePrestigeHome() {
  return (
    <HomepageContentProvider>
      <PrestigeLangProvider>
        <EmpirePrestigeHomeInner />
      </PrestigeLangProvider>
    </HomepageContentProvider>
  );
}
