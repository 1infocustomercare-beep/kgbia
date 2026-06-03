import React, { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import { CinematicHero as NewCinematicHero } from "@/components/ui/cinematic-hero";
import LandingFooter from "@/components/landing/LandingFooter";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";
import EmpireDiagnostic from "@/components/empire-home/EmpireDiagnostic";
import MinimalPackages from "@/components/empire-home/MinimalPackages";
import MinimalFinalCTA from "@/components/empire-home/MinimalFinalCTA";
import { HomepageContentProvider, useHomepageContent } from "@/hooks/useHomepageContent";
import { PrestigeLangProvider } from "@/components/empire-home/prestige/PrestigeLang";

const SafeVoiceAgent = React.memo(() => <EmpireVoiceAgent />, () => true);

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

      {/* HERO — pinned 7000px, content below appears naturally after */}
      <NewCinematicHero />

      {/* DIAGNOSTICO — questionario AI personalizzato */}
      <section id="diagnostic" className="relative w-full bg-[#0a0d12]">
        <EmpireDiagnostic />
      </section>

      {/* PACCHETTI */}
      <MinimalPackages />

      {/* CTA FINALE */}
      <MinimalFinalCTA />

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
