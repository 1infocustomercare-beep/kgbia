import React from "react";
import LandingNav from "@/components/landing/LandingNav";
import LandingHero from "@/components/landing/LandingHero";
import LandingTicker from "@/components/landing/LandingTicker";
import LandingMetrics from "@/components/landing/LandingMetrics";
import LandingSectors from "@/components/landing/LandingSectors";
import LandingServices from "@/components/landing/LandingServices";
import LandingPortfolio from "@/components/landing/LandingPortfolio";
import LandingWhyUs from "@/components/landing/LandingWhyUs";
import LandingPricing from "@/components/landing/LandingPricing";
import LandingAgents from "@/components/landing/LandingAgents";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingTeamContact from "@/components/landing/LandingTeamContact";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";

const SafeVoiceAgent = React.memo(() => <EmpireVoiceAgent />, () => true);

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#020204", color: "#f0f0f5" }}>
      <LandingNav />
      <LandingHero />
      <LandingTicker />
      <LandingMetrics />
      <LandingSectors />
      <LandingServices />
      <LandingPortfolio />
      <LandingWhyUs />
      <LandingPricing />
      <LandingAgents />
      <LandingFAQ />
      <LandingTeamContact />
      <LandingCTA />
      <LandingFooter />
      <SafeVoiceAgent />
    </div>
  );
}
