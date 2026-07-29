import { HomepageContentProvider } from "@/hooks/useHomepageContent";
import PrestigeEffects from "@/components/empire-home/prestige/PrestigeEffects";
import PrestigeHero from "@/components/empire-home/prestige/PrestigeHero";
import { PrestigeLangProvider } from "@/components/empire-home/prestige/PrestigeLang";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";

/**
 * Legacy compatibility wrapper.
 * If any stale route/editor preview still resolves this old hero, it now renders
 * the official Prestige homepage hero instead of the deprecated dark headline.
 */
export default function HeroExplosion() {
  return (
    <HomepageContentProvider>
      <PrestigeLangProvider>
        <PrestigeTheme />
        <div className="prestige-root min-h-screen [overflow-x:clip]">
          <PrestigeEffects />
          <div className="prestige-noise" aria-hidden="true" />
          <PrestigeHero />
        </div>
      </PrestigeLangProvider>
    </HomepageContentProvider>
  );
}
