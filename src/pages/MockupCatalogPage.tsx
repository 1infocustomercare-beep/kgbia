import PremiumMockupGallery from "@/components/mockups/PremiumMockupGallery";
import LandingNav from "@/components/landing/LandingNav";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";

export default function MockupCatalogPage() {
  return (
    <main className="pglass-scope pglass-bg min-h-screen">
      <PrestigeTheme />
      {/* Nav condivisa con la home: da /portfolio le ancore riportano in home */}
      <LandingNav />
      <PremiumMockupGallery />
    </main>
  );
}
