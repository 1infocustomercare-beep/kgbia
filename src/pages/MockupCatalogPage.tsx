import PremiumMockupGallery from "@/components/mockups/PremiumMockupGallery";
import LandingNav from "@/components/landing/LandingNav";

export default function MockupCatalogPage() {
  return (
    <main className="min-h-screen bg-[#0a0b12]">
      {/* Nav condivisa con la home: da /portfolio le ancore riportano in home */}
      <LandingNav />
      <PremiumMockupGallery />
    </main>
  );
}
