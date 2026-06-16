import React, { useEffect, useState } from "react";
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

// ─── Cinematic extras + catalogs (additive, lazy-mounted) ───
import LazyMount from "@/components/empire-home/LazyMount";
import MockupCatalog from "@/components/empire-home/MockupCatalog";
import AgentsCatalog from "@/components/empire-home/AgentsCatalog";
import StackedPanels from "@/components/empire-21st/StackedPanels";
import { CardStack } from "@/components/empire-21st/CardStack";
import { NeonOrbs } from "@/components/empire-21st/NeonOrbs";
import SplashScreen from "@/components/SplashScreen";
import { createMockupPool } from "@/lib/mockup-pool";

import { CinematicFooter } from "@/components/empire-21st/MotionFooter";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";
import { HomepageContentProvider, useHomepageContent } from "@/hooks/useHomepageContent";

/** Voice agent memoised so it never re-renders with the page scroll. */
const SafeVoiceAgent = React.memo(() => <EmpireVoiceAgent />, () => true);

const homePool = createMockupPool();
const cardStackImages = homePool.images(6).map((src, i) => ({
  id: i,
  title: `Empire ${i + 1}`,
  imageSrc: src,
}));



/**
 * Emerald Prestige Home — Lowengeld-style luxury agency homepage.
 * Sezioni alternate dark/light, copy persuasivo bilingue IT/EN, effetti scroll
 * sincronizzati via ScrollDirector + storytelling Caos→Empire pinnato.
 * Additivo: film grain cinematico, Arianna voice agent, brand HSL overrides.
 */
function EmpirePrestigeHomeInner() {
  const { content, isPreview } = useHomepageContent();

  // Cinematic splash — shown once per browser session, bypassed in preview/iframe.
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.self !== window.top) return false; // iframe
    try {
      return sessionStorage.getItem("empire-splash-seen") !== "1";
    } catch {
      return false;
    }
  });
  const dismissSplash = () => {
    try { sessionStorage.setItem("empire-splash-seen", "1"); } catch {}
    setShowSplash(false);
  };


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
    // Cinematic smooth-scroll (Lenis) for the public home — drives the
    // --empire-progress CSS var used by parallax/scroll transitions.
    getLenis();
    return () => {
      destroyLenis();
    };
  }, []);

  return (
    <>
      {showSplash && !isPreview && <SplashScreen onComplete={dismissSplash} />}
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

        {/* ─── Cinematic accent: stacked panels + 3D card stack ─── */}
        <LazyMount minHeight="80vh" rootMargin="400px 0px" className="prestige-dark overflow-hidden">
          <StackedPanels />
        </LazyMount>
        <LazyMount minHeight="70vh" rootMargin="400px 0px" className="prestige-dark overflow-hidden">
          <CardStack images={cardStackImages} />
        </LazyMount>

        {/* ─── Mockup vault (catalog completo) ─── */}
        <LazyMount minHeight="100vh" rootMargin="500px 0px" id="mockups" className="prestige-dark overflow-hidden">
          <MockupCatalog />
        </LazyMount>

        <PrestigeCases />
        <PrestigeProof />

        {/* ─── 98 Agenti AI catalog ─── */}
        <LazyMount minHeight="100vh" rootMargin="500px 0px" id="agents" className="prestige-dark overflow-hidden">
          <AgentsCatalog />
        </LazyMount>

        {/* ─── Neon orbs cinematic accent ─── */}
        <LazyMount minHeight="60vh" rootMargin="400px 0px" className="prestige-dark overflow-hidden">
          <NeonOrbs />
        </LazyMount>

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
