import React, { useEffect } from "react";
import LandingNav from "@/components/landing/LandingNav";
import CinematicHero from "@/components/landing/v2/CinematicHero";
import ManifestoSection from "@/components/landing/v2/ManifestoSection";
import SectorsCarousel from "@/components/landing/v2/SectorsCarousel";
import HorizontalPortfolio from "@/components/landing/v2/HorizontalPortfolio";
import Orbital3DShowcase from "@/components/landing/v2/Orbital3DShowcase";
import AgentsBento from "@/components/landing/v2/AgentsBento";
import AgentsAlaCarte from "@/components/landing/v2/AgentsAlaCarte";
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
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import PrestigeStoryPinned from "@/components/empire-home/prestige/PrestigeStoryPinned";
import { PrestigeLangProvider } from "@/components/empire-home/prestige/PrestigeLang";

const SafeVoiceAgent = React.memo(() => <EmpireVoiceAgent />, () => true);

export default function LandingPage() {
  // Resilienza Framer Motion: invece di un setTimeout cieco a 4s, sblocca le
  // sezioni "stuck" solo quando entrano in viewport e non sono ancora visibili.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const cs = getComputedStyle(el);
          if (parseFloat(cs.opacity) < 0.05) {
            el.style.opacity = "1";
            el.style.transform = "none";
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>('[style*="opacity: 0"]')
        .forEach((el) => io.observe(el));
    };
    scan();
    // Riscansiona dopo i mount tardivi delle sezioni cinematiche
    const t1 = setTimeout(scan, 1200);
    const t2 = setTimeout(scan, 3000);

    // Safety net finale: se dopo 6s qualcosa è ancora invisibile, lo sblocca
    const safety = setTimeout(() => {
      document.querySelectorAll<HTMLElement>('[style*="opacity: 0"]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.5) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
    }, 6000);

    return () => {
      io.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(safety);
    };
  }, []);

  return (
    <PrestigeLangProvider>
      {/* Tokens Prestige (pr-gold, pr-emerald…) per la sezione Story Pinned */}
      <PrestigeTheme />
      <div className="landing-dark force-dark landing-shell min-h-screen overflow-x-hidden bg-background text-foreground">
        <CinematicCursor />
        <LandingNav />
        <CinematicHero />
        <ManifestoSection />
        {/* Storytelling cinematico Caos → Empire (pinned + horizontal split) */}
        <div className="prestige-root">
          <PrestigeStoryPinned />
        </div>
        <SectorsCarousel />
        <HorizontalPortfolio />
        <Orbital3DShowcase />
        <AgentsBento />
        <AgentsAlaCarte />
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
      </div>
      {/* Voice Agent fuori dal landing-shell per evitare break di position:fixed
          dovuti a transform/filter degli antenati cinematici */}
      <SafeVoiceAgent />
    </PrestigeLangProvider>
  );
}
