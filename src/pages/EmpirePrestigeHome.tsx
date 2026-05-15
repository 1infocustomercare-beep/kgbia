import { useEffect } from "react";
import { getLenis, destroyLenis } from "@/lib/lenis-singleton";

import EmpireSplash from "@/components/empire-home/v2/EmpireSplash";
import AuroraBackground from "@/components/empire-home/v2/AuroraBackground";
import V2Theme from "@/components/empire-home/v2/V2Theme";
import V2Nav from "@/components/empire-home/v2/V2Nav";
import V2Hero from "@/components/empire-home/v2/V2Hero";
import {
  V2Story, V2Services, V2Sectors, V2Portfolio, V2Process, V2Agents,
} from "@/components/empire-home/v2/V2Sections";
import V2Pricing from "@/components/empire-home/v2/V2Pricing";
import V2Team from "@/components/empire-home/v2/V2Team";
import { V2Guarantee, V2Testimonials, V2Faq, V2CTA } from "@/components/empire-home/v2/V2Funnel";
import { CinematicFooter } from "@/components/empire-21st/MotionFooter";

/**
 * Empire AI — Homepage v2 (rebuild totale).
 * Splash → Aurora BG → Nav (logo nuovo) → Hero pinned → Story Caos→Empire pinned →
 * Services alternati → Settori → Portfolio carosello+modale → Process → Agents →
 * Pricing reali → Team con foto AI → Guarantee → Testimonials → FAQ → CTA finale.
 */
export default function EmpirePrestigeHome() {
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    try { getLenis(); } catch (e) { console.warn("Lenis init failed", e); }
    return () => { destroyLenis(); };
  }, []);

  return (
    <>
      <EmpireSplash />
      <V2Theme />
      <div className="empire-v2 relative min-h-screen overflow-x-hidden">
        <AuroraBackground />
        <div className="relative z-[1]">
          <V2Nav />
          <V2Hero />
          <V2Story />
          <V2Services />
          <V2Sectors />
          <V2Portfolio />
          <V2Process />
          <V2Agents />
          <V2Pricing />
          <V2Team />
          <V2Guarantee />
          <V2Testimonials />
          <V2Faq />
          <V2CTA />
          <CinematicFooter />
        </div>
      </div>
    </>
  );
}
