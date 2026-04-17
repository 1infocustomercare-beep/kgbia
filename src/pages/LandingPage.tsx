import React, { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import HeroScrollStack from "@/components/landing/v2/HeroScrollStack";
import AboutSection from "@/components/landing/v2/AboutSection";
import TeamSection from "@/components/landing/v2/TeamSection";
import SectorsCarousel from "@/components/landing/v2/SectorsCarousel";
import AgentsBento from "@/components/landing/v2/AgentsBento";
import PortfolioCarousel from "@/components/landing/v2/PortfolioCarousel";
import CustomizationSection from "@/components/landing/v2/CustomizationSection";
import PricingSection from "@/components/landing/v2/PricingSection";
import FaqSection from "@/components/landing/v2/FaqSection";
import ContactCTA from "@/components/landing/v2/ContactCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";

const SafeVoiceAgent = React.memo(() => <EmpireVoiceAgent />, () => true);

export default function LandingPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('[style*="opacity: 0"]').forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#020204", color: "#f0f0f5" }}>
      <LandingNav />
      <HeroScrollStack />
      <AboutSection />
      <SectorsCarousel />
      <PortfolioCarousel />
      <AgentsBento />
      <CustomizationSection />
      <TeamSection />
      <PricingSection />
      <FaqSection />
      <ContactCTA />
      <LandingFooter />
      <SafeVoiceAgent />
    </div>
  );
}
