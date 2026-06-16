import React, { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import { getLenis, destroyLenis } from "@/lib/lenis-singleton";

import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import PrestigeEffects from "@/components/empire-home/prestige/PrestigeEffects";
import PrestigeHero from "@/components/empire-home/prestige/PrestigeHero";
import PrestigeMarquee from "@/components/empire-home/prestige/PrestigeMarquee";
import PrestigeUnifiedNarrative from "@/components/empire-home/prestige/PrestigeUnifiedNarrative";
import PrestigeServices from "@/components/empire-home/prestige/PrestigeServices";
import PrestigeIndustries from "@/components/empire-home/prestige/PrestigeIndustries";
import PrestigePortfolioCarousel from "@/components/empire-home/prestige/PrestigePortfolioCarousel";
import PrestigeProof from "@/components/empire-home/prestige/PrestigeProof";
import PrestigeCTA from "@/components/empire-home/prestige/PrestigeCTA";
import PrestigeProgressBar from "@/components/empire-home/prestige/PrestigeProgressBar";
import { PrestigeLangProvider } from "@/components/empire-home/prestige/PrestigeLang";
import {
  PrestigeAriannaDemo,
  PrestigeCases,
  PrestigeRoiCalculator,
  PrestigeComparison,
  PrestigePricing,
  PrestigeFAQ,
  PrestigeLeadForm,
  PrestigeStickyCTA,
} from "@/components/empire-home/prestige/PrestigeConversion";

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
    // Disabled Lenis smooth-scroll on the public home: natural browser scroll
    // is required to avoid scroll-jacking, black gaps and stutter on mobile.
    destroyLenis();
  }, []);

  return (
    <>
      <PrestigeTheme />
      <PrestigeProgressBar />
      <div className="prestige-root min-h-screen overflow-x-hidden">
        {/* Premium effects layer: aurora background + scroll-reveal + tilt + magnetic + count-up */}
        <PrestigeEffects />
        {/* Cinematic film grain — purely decorative, pointer-events:none */}
        <div className="prestige-noise" aria-hidden="true" />


        <LandingNav />
        <PrestigeHero />
        <PrestigeMarquee />
        {/* ─── Conversion flow: problem + solution + how (unified) → services ─── */}
        <PrestigeUnifiedNarrative />
        <PrestigeServices />
        <PrestigeIndustries />
        <PrestigeAriannaDemo />
        <PrestigePortfolioCarousel />
        <PrestigeCases />
        <PrestigeProof />
        <PrestigeRoiCalculator />
        <PrestigeComparison />
        <PrestigePricing />
        <PrestigeFAQ />
        <PrestigeLeadForm />
        <PrestigeCTA />
        <div className="prestige-dark">
          <CinematicFooter />
        </div>

        {/* Sticky mobile CTA — appears after first viewport */}
        <PrestigeStickyCTA />

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
