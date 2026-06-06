import React, { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";
import RevolutionaryLanding from "@/components/empire-home/RevolutionaryLanding";

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
    <div className="landing-dark force-dark min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <LandingNav />
      <RevolutionaryLanding />
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
