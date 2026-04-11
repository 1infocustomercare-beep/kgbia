import React, { lazy, Suspense } from "react";
import LandingNav from "@/components/landing/LandingNav";
import LandingHero from "@/components/landing/LandingHero";
import LandingTicker from "@/components/landing/LandingTicker";
import LandingSectors from "@/components/landing/LandingSectors";
import LandingServices from "@/components/landing/LandingServices";
import LandingMetrics from "@/components/landing/LandingMetrics";
import LandingWhyUs from "@/components/landing/LandingWhyUs";
import LandingPricing from "@/components/landing/LandingPricing";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";

const SafeVoiceAgent = React.memo(() => <EmpireVoiceAgent />, () => true);

export default function LandingPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden relative"
      style={{
        background: "radial-gradient(120% 80% at 50% 35%, hsl(228 22% 8%) 0%, hsl(230 24% 7%) 40%, hsl(232 20% 6%) 64%, hsl(234 26% 5%) 100%)",
      }}
    >
      {/* Ambient background particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[250px] opacity-[0.02] bg-primary -top-[200px] left-1/4" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[200px] opacity-[0.015] bg-accent top-[50vh] -right-[100px]" />
      </div>

      {/* Navigation */}
      <LandingNav />

      {/* Hero */}
      <LandingHero />

      {/* Trust ticker */}
      <LandingTicker />

      {/* Metrics */}
      <LandingMetrics />

      {/* Sectors */}
      <LandingSectors />

      {/* Services / Platform */}
      <LandingServices />

      {/* Why Empire */}
      <LandingWhyUs />

      {/* Pricing */}
      <LandingPricing />

      {/* FAQ */}
      <LandingFAQ />

      {/* Final CTA */}
      <LandingCTA />

      {/* Footer */}
      <LandingFooter />

      {/* Voice Agent */}
      <SafeVoiceAgent />
    </div>
  );
}
