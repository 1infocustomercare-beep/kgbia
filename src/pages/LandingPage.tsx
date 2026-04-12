import React from "react";
import LandingNav from "@/components/landing/LandingNav";
import LandingHero from "@/components/landing/LandingHero";
import LandingTicker from "@/components/landing/LandingTicker";
import LandingSectors from "@/components/landing/LandingSectors";
import LandingServices from "@/components/landing/LandingServices";
import LandingWordReveal from "@/components/landing/LandingWordReveal";
import LandingMetrics from "@/components/landing/LandingMetrics";
import LandingPortfolio from "@/components/landing/LandingPortfolio";
import LandingResults from "@/components/landing/LandingResults";
import LandingPricing from "@/components/landing/LandingPricing";
import LandingAgents from "@/components/landing/LandingAgents";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";

const SafeVoiceAgent = React.memo(() => <EmpireVoiceAgent />, () => true);

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ background: "#020204" }}>
      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      <LandingNav />
      <LandingHero />
      <LandingTicker />
      <LandingSectors />
      <LandingServices />
      <LandingWordReveal />
      <LandingMetrics />
      <LandingPortfolio />
      <LandingResults />
      <LandingPricing />
      <LandingAgents />
      <LandingFAQ />
      <LandingCTA />
      <LandingFooter />
      <SafeVoiceAgent />
    </div>
  );
}
