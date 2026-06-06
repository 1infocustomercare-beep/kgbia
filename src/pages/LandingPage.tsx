import React, { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import { CinematicHero as NewCinematicHero } from "@/components/ui/cinematic-hero";
import LandingFooter from "@/components/landing/LandingFooter";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";

// Diagnostic + closing CTA blocks (Empire native)
import EmpireDiagnostic from "@/components/empire-home/EmpireDiagnostic";

// Full "legacy" v2 sections — the rich landing experience
import ManifestoSection from "@/components/landing/v2/ManifestoSection";
import SectorsCarousel from "@/components/landing/v2/SectorsCarousel";
import ProcessSection from "@/components/landing/v2/ProcessSection";
import AgentsBento from "@/components/landing/v2/AgentsBento";
import HorizontalPortfolio from "@/components/landing/v2/HorizontalPortfolio";
import Orbital3DShowcase from "@/components/landing/v2/Orbital3DShowcase";
import PricingSection from "@/components/landing/v2/PricingSection";
import GuaranteeSection from "@/components/landing/v2/GuaranteeSection";
import TestimonialsSection from "@/components/landing/v2/TestimonialsSection";
import CustomizationSection from "@/components/landing/v2/CustomizationSection";
import TeamSection from "@/components/landing/v2/TeamSection";
import FaqSection from "@/components/landing/v2/FaqSection";
import ContactCTA from "@/components/landing/v2/ContactCTA";

import { HomepageContentProvider, useHomepageContent } from "@/hooks/useHomepageContent";
import { PrestigeLangProvider } from "@/components/empire-home/prestige/PrestigeLang";

const SafeVoiceAgent = React.memo(() => <EmpireVoiceAgent />, () => true);

/**
 * Reusable wrapper that guarantees:
 *  - each section is a normal-flow block (no overlap from the previous one)
 *  - its own stacking context (isolate) so internal absolutes never leak
 *  - horizontal clipping so wide carousels/marquees never break layout
 */
function FlowSection({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative isolate w-full overflow-x-clip ${className}`}
    >
      {children}
    </section>
  );
}

function LandingPageInner() {
  const { content, isPreview } = useHomepageContent();

  // Brand HSL overrides
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

  return (
    <div className="landing-dark force-dark min-h-screen w-full overflow-x-hidden bg-[#0a0d12] text-white">
      <LandingNav />

      {/* ═══ HERO — pinned cinematic ═══ */}
      <FlowSection id="hero">
        <NewCinematicHero />
      </FlowSection>

      {/* ═══ DIAGNOSTICO — questionario AI personalizzato ═══ */}
      <FlowSection id="diagnostic" className="bg-[#0a0d12]">
        <EmpireDiagnostic />
      </FlowSection>

      {/* ═══ MANIFESTO ═══ */}
      <FlowSection id="manifesto">
        <ManifestoSection />
      </FlowSection>

      {/* ═══ SETTORI ═══ */}
      <FlowSection id="settori">
        <SectorsCarousel />
      </FlowSection>

      {/* ═══ PROCESSO ═══ */}
      <FlowSection id="processo">
        <ProcessSection />
      </FlowSection>

      {/* ═══ AGENTI AI ═══ */}
      <FlowSection id="agenti">
        <AgentsBento />
      </FlowSection>

      {/* ═══ PORTFOLIO ORIZZONTALE ═══ */}
      <FlowSection id="portfolio">
        <HorizontalPortfolio />
      </FlowSection>

      {/* ═══ 3D ORBITAL SHOWCASE — sticky scroll ═══ */}
      <FlowSection id="orbital">
        <Orbital3DShowcase />
      </FlowSection>

      {/* ═══ CUSTOMIZATION ═══ */}
      <FlowSection id="customization">
        <CustomizationSection />
      </FlowSection>

      {/* ═══ PRICING ═══ */}
      <FlowSection id="pricing">
        <PricingSection />
      </FlowSection>

      {/* ═══ GARANZIA ═══ */}
      <FlowSection id="garanzia">
        <GuaranteeSection />
      </FlowSection>

      {/* ═══ TESTIMONIANZE ═══ */}
      <FlowSection id="testimonianze">
        <TestimonialsSection />
      </FlowSection>

      {/* ═══ TEAM ═══ */}
      <FlowSection id="team">
        <TeamSection />
      </FlowSection>

      {/* ═══ FAQ ═══ */}
      <FlowSection id="faq">
        <FaqSection />
      </FlowSection>

      {/* ═══ CTA FINALE ═══ */}
      <FlowSection id="contatti">
        <ContactCTA />
      </FlowSection>

      <LandingFooter />

      {!isPreview && <SafeVoiceAgent />}
    </div>
  );
}

export default function LandingPage() {
  return (
    <HomepageContentProvider>
      <PrestigeLangProvider>
        <LandingPageInner />
      </PrestigeLangProvider>
    </HomepageContentProvider>
  );
}
