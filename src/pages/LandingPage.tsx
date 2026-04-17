import React, { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import CinematicHero from "@/components/landing/v2/CinematicHero";
import ManifestoSection from "@/components/landing/v2/ManifestoSection";
import SectorsCarousel from "@/components/landing/v2/SectorsCarousel";
import HorizontalPortfolio from "@/components/landing/v2/HorizontalPortfolio";
import AgentsBento from "@/components/landing/v2/AgentsBento";
import ProcessSection from "@/components/landing/v2/ProcessSection";
import CustomizationSection from "@/components/landing/v2/CustomizationSection";
import AboutSection from "@/components/landing/v2/AboutSection";
import TeamSection from "@/components/landing/v2/TeamSection";
import PricingSection from "@/components/landing/v2/PricingSection";
import GuaranteeSection from "@/components/landing/v2/GuaranteeSection";
import TestimonialsSection from "@/components/landing/v2/TestimonialsSection";
import FaqSection from "@/components/landing/v2/FaqSection";
import ContactCTA from "@/components/landing/v2/ContactCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";
import CinematicCursor from "@/components/landing/v2/CinematicCursor";

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
    <div className="landing-dark force-dark landing-shell min-h-screen overflow-x-hidden bg-background text-foreground">
      <CinematicCursor />
      <LandingNav />
      <CinematicHero />
      <ManifestoSection />
      <SectorsCarousel />
      <HorizontalPortfolio />
      <AgentsBento />
      <ProcessSection />
      <CustomizationSection />
      <AboutSection />
      <TeamSection />
      <PricingSection />
      <GuaranteeSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactCTA />
      <LandingFooter />
      <SafeVoiceAgent />
    </div>
  );
}
