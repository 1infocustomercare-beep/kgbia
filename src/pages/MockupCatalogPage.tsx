import PremiumMockupGallery from "@/components/mockups/PremiumMockupGallery";
import LandingNav from "@/components/landing/LandingNav";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import GlassBackButton from "@/components/glass/GlassBackButton";

export default function MockupCatalogPage() {
  return (
    <main className="pglass-scope pglass-bg min-h-screen">
      <PrestigeTheme />
      {/* Nav condivisa con la home: da /portfolio le ancore riportano in home */}
      <LandingNav />
      <GlassBackButton to="/" label="Home" variant="floating" belowNav />
      <PremiumMockupGallery />
    </main>
  );
}
