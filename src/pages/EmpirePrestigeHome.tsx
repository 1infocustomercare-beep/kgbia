import React, { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import { getLenis, destroyLenis } from "@/lib/lenis-singleton";

import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import PrestigeEffects from "@/components/empire-home/prestige/PrestigeEffects";
import PrestigeHero from "@/components/empire-home/prestige/PrestigeHero";
import PrestigeProofBar from "@/components/empire-home/prestige/PrestigeProofBar";
import PrestigeServices from "@/components/empire-home/prestige/PrestigeServices";
import PrestigeIndustries from "@/components/empire-home/prestige/PrestigeIndustries";
import PrestigePortfolio from "@/components/empire-home/prestige/PrestigePortfolio";
import PrestigeParallaxCarousel from "@/components/empire-home/prestige/PrestigeParallaxCarousel";
import PrestigeSectorLive from "@/components/empire-home/prestige/PrestigeSectorLive";
import PrestigeStyleGallery from "@/components/empire-home/prestige/PrestigeStyleGallery";

import PrestigeAgents from "@/components/empire-home/prestige/PrestigeAgents";
import PrestigeFinalCTA from "@/components/empire-home/prestige/PrestigeFinalCTA";
import PrestigeProgressBar from "@/components/empire-home/prestige/PrestigeProgressBar";
import { PrestigeLangProvider } from "@/components/empire-home/prestige/PrestigeLang";
import {
  PrestigeHowItWorks,
  PrestigePricing,
  PrestigeFAQ,
  PrestigeLeadForm,
  PrestigeStickyCTA,
} from "@/components/empire-home/prestige/PrestigeConversion";

import PrestigeFooter from "@/components/empire-home/prestige/PrestigeFooter";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";
import EmpireLogoSplash from "@/components/empire-home/EmpireLogoSplash";
import { HomepageContentProvider, useHomepageContent } from "@/hooks/useHomepageContent";

/** Voice agent memoised so it never re-renders with the page scroll. */
const SafeVoiceAgent = React.memo(() => <EmpireVoiceAgent />, () => true);

/**
 * Empire AI — homepage editoriale (route: `/`).
 * Funnel lineare: hero → proof → servizi → settori → portfolio →
 * come funziona → agents → prezzi → faq → CTA finale → footer.
 * Nessuna sezione pinnata: lo scroll resta sempre libero.
 */
function EmpirePrestigeHomeInner() {
  const { content, isPreview } = useHomepageContent();

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
    getLenis();
    return () => {
      destroyLenis();
    };
  }, []);

  return (
    <>
      <EmpireLogoSplash />
      <PrestigeTheme />
      <PrestigeProgressBar />
      <div className="prestige-root min-h-screen [overflow-x:clip]">
        <PrestigeEffects />
        <div className="prestige-noise" aria-hidden="true" />

        <LandingNav />

        {/* HERO */}
        <div id="hero">
          <PrestigeHero />
        </div>

        {/* PROOF BAR onesto */}
        <PrestigeProofBar />

        {/* SERVIZI bento */}
        <div id="services">
          <PrestigeServices />
        </div>

        {/* SETTORI */}
        <div id="sectors">
          <PrestigeIndustries />
        </div>

        {/* SITI SETTORE LIVE — navigabili, cliccabili */}
        <PrestigeSectorLive />

        {/* PORTFOLIO */}
        <div id="portfolio">
          <PrestigePortfolio />
        </div>

        {/* ARCHIVIO STILI — griglia esplorabile, click apre demo live */}
        <div id="styles">
          <PrestigeStyleGallery />
        </div>

        {/* CAROSELLO PARALLAX — autoplay + drag + pausa hover/touch */}
        <PrestigeParallaxCarousel />




        {/* COME FUNZIONA — 3 step con linea di progresso */}
        <div id="how">
          <PrestigeHowItWorks />
        </div>

        {/* AI AGENTS marquee */}
        <PrestigeAgents />

        {/* PREZZI */}
        <div id="pricing">
          <PrestigePricing />
        </div>

        {/* FAQ */}
        <div id="faq">
          <PrestigeFAQ />
        </div>

        {/* LEAD FORM (ancora #lead per Parla con un consulente) */}
        <div id="lead">
          <PrestigeLeadForm />
        </div>

        {/* CTA FINALE (ancora #contatti per la navbar) */}
        <PrestigeFinalCTA />

        {/* FOOTER */}
        <PrestigeFooter />

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
