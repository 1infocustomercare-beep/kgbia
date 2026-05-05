import LandingNav from "@/components/landing/LandingNav";
import MockupCatalog from "@/components/empire-home/MockupCatalog";
import FilmGrain from "@/components/empire-home/FilmGrain";

export default function MockupCatalogPage() {
  return (
    <main className="landing-dark force-dark relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <LandingNav />
      <MockupCatalog mode="page" />
      <FilmGrain />
    </main>
  );
}
