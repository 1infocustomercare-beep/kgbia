import React, { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import { getLenis, destroyLenis } from "@/lib/lenis-singleton";

import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import PrestigeEffects from "@/components/empire-home/prestige/PrestigeEffects";
import PrestigeHero from "@/components/empire-home/prestige/PrestigeHero";
import PrestigeMarquee from "@/components/empire-home/prestige/PrestigeMarquee";
import PrestigeUnifiedNarrative from "@/components/empire-home/prestige/PrestigeUnifiedNarrative";
import PrestigeIndustries from "@/components/empire-home/prestige/PrestigeIndustries";
import PrestigeCapabilities from "@/components/empire-home/prestige/PrestigeCapabilities";
import PrestigeCinematic3D from "@/components/empire-home/prestige/PrestigeCinematic3D";

import PrestigePortfolioCarousel from "@/components/empire-home/prestige/PrestigePortfolioCarousel";
import PrestigeProof from "@/components/empire-home/prestige/PrestigeProof";
import PrestigeProgressBar from "@/components/empire-home/prestige/PrestigeProgressBar";
import { PrestigeLangProvider } from "@/components/empire-home/prestige/PrestigeLang";
import {
  PrestigeAriannaDemo,
  PrestigePricing,
  PrestigeFAQ,
  PrestigeLeadForm,
  PrestigeStickyCTA,
} from "@/components/empire-home/prestige/PrestigeConversion";

import PrestigeFooter from "@/components/empire-home/prestige/PrestigeFooter";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";
import { HomepageContentProvider, useHomepageContent } from "@/hooks/useHomepageContent";

/** Voice agent memoised so it never re-renders with the page scroll. */
const SafeVoiceAgent = React.memo(() => <EmpireVoiceAgent />, () => true);

/**
 * Empire AI — Single canonical agency homepage (route: `/`).
 *
 * Direzione: "Cinematic editorial luxury" (v3).
 * Flusso conversione lineare, denso, monumentale. Niente duplicazioni di sezioni,
 * niente cataloghi pesanti, niente splash. Una sola home, pulita e professionale.
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
    // Smooth-scroll Lenis: pilota la CSS var --empire-progress per i parallax.
    getLenis();
    return () => {
      destroyLenis();
    };
  }, []);

  return (
    <>
      <PrestigeTheme />
      <PrestigeProgressBar />
      <div className="prestige-root min-h-screen [overflow-x:clip]">
        {/* Aurora background + scroll-reveal + tilt + magnetic + count-up */}
        <PrestigeEffects />
        {/* Cinematic film grain — purely decorative */}
        <div className="prestige-noise" aria-hidden="true" />

        <LandingNav />

        {/* ── HERO monumentale ── */}
        <PrestigeHero />

        {/* ── Marquee settori ── */}
        <PrestigeMarquee />

        {/* ── Problema → Soluzione → Come (unified) ── */}
        <PrestigeUnifiedNarrative />

        {/* ── Showcase settoriale (bento denso) ── */}
        <PrestigeIndustries />

        {/* ── Capabilities: cosa fa Empire per te (12 superpoteri) ── */}
        <PrestigeCapabilities />

        {/* ── 3D cinematic pinned scene ── */}
        <PrestigeCinematic3D />

        {/* ── Portfolio mockup (carousel curato) ── */}
        <PrestigePortfolioCarousel />


        {/* ── Arianna voice — strip prominente, non solo FAB ── */}
        <PrestigeAriannaDemo />

        {/* ── Proof numerico monumentale ── */}
        <PrestigeProof />

        {/* ── Pricing tactile ── */}
        <PrestigePricing />

        {/* ── FAQ "I tuoi dubbi, risolti." ── */}
        <PrestigeFAQ />

        {/* ── Lead form inline ── */}
        <PrestigeLeadForm />

        {/* ── Footer pulito ── */}
        <PrestigeFooter />

        {/* Sticky CTA mobile + FAB Arianna */}
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
