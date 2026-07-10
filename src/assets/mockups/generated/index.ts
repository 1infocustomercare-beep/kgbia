/**
 * Empire premium mockups — generated with Nano Banana Pro (google/gemini-3-pro-image).
 * Screen-only iPhone UI artwork (no phone frame), served from CDN.
 * PrestigePhone wraps them into the shared iPhone bezel.
 */
// Batch 1 — sector base
import steakhouseHome from "./food/steakhouse-home.png.asset.json";
import steakhouseDetail from "./food/steakhouse-detail.png.asset.json";
import sushiHome from "./food/sushi-home.png.asset.json";
import pizzeriaHome from "./food/pizzeria-home.png.asset.json";
import nailHome from "./beauty/nail-home.png.asset.json";
import spaHome from "./beauty/spa-home.png.asset.json";
import chauffeurHome from "./ncc/chauffeur-home.png.asset.json";
import chauffeurFleet from "./ncc/chauffeur-fleet.png.asset.json";
import hotelHome from "./hospitality/boutique-hotel-home.png.asset.json";
import hotelSuite from "./hospitality/spa-suite.png.asset.json";
import padelHome from "./fitness/padel-home.png.asset.json";
import gymHome from "./fitness/gym-home.png.asset.json";
import realestateHome from "./realestate/luxury-home.png.asset.json";
import realestateDetail from "./realestate/unit-detail.png.asset.json";
import atelierHome from "./retail/atelier-home.png.asset.json";
import atelierDetail from "./retail/product-detail.png.asset.json";
import agencyHome from "./agency/dashboard-home.png.asset.json";

// Batch 2 — style variants (editorial luxury, dark noir, glassmorphism, bento acid, monochrome, neo-brutalist)
import nailLavenderEditorial from "./beauty/nail-lavender-editorial.png.asset.json";
import spaGlassVisionpro from "./beauty/spa-glass-visionpro.png.asset.json";
import steakhouseNoir from "./food/steakhouse-noir.png.asset.json";
import gymBentoAcid from "./fitness/gym-bento-acid.png.asset.json";
import padelGlassPastel from "./fitness/padel-glass-pastel.png.asset.json";
import chauffeurEditorialMagazine from "./ncc/chauffeur-editorial-magazine.png.asset.json";
import villaLevanteCinematic from "./hospitality/villa-levante-cinematic.png.asset.json";
import dimoraNeoBrutalist from "./realestate/dimora-neo-brutalist.png.asset.json";
import atelierMonochromeEditorial from "./retail/atelier-monochrome-editorial.png.asset.json";
import empireStudioBento from "./agency/empire-studio-bento.png.asset.json";

export const EMPIRE_MOCKUPS = {
  food: {
    steakhouseHome: steakhouseHome.url,
    steakhouseDetail: steakhouseDetail.url,
    steakhouseNoir: steakhouseNoir.url,
    sushiHome: sushiHome.url,
    pizzeriaHome: pizzeriaHome.url,
  },
  beauty: {
    nailHome: nailHome.url,
    nailLavenderEditorial: nailLavenderEditorial.url,
    spaHome: spaHome.url,
    spaGlassVisionpro: spaGlassVisionpro.url,
  },
  ncc: {
    chauffeurHome: chauffeurHome.url,
    chauffeurFleet: chauffeurFleet.url,
    chauffeurEditorial: chauffeurEditorialMagazine.url,
  },
  hospitality: {
    hotelHome: hotelHome.url,
    suiteDetail: hotelSuite.url,
    villaLevanteCinematic: villaLevanteCinematic.url,
  },
  fitness: {
    padelHome: padelHome.url,
    padelGlassPastel: padelGlassPastel.url,
    gymHome: gymHome.url,
    gymBentoAcid: gymBentoAcid.url,
  },
  realestate: {
    home: realestateHome.url,
    detail: realestateDetail.url,
    dimoraNeoBrutalist: dimoraNeoBrutalist.url,
  },
  retail: {
    atelierHome: atelierHome.url,
    productDetail: atelierDetail.url,
    atelierMonochromeEditorial: atelierMonochromeEditorial.url,
  },
  agency: {
    dashboardHome: agencyHome.url,
    empireStudioBento: empireStudioBento.url,
  },
} as const;

/** Flat arrays grouped by sector for showcase carousels — style-diverse for client picks. */
export const EMPIRE_MOCKUPS_BY_SECTOR: Record<string, string[]> = {
  food: [
    steakhouseNoir.url,
    steakhouseHome.url,
    sushiHome.url,
    pizzeriaHome.url,
    steakhouseDetail.url,
  ],
  beauty: [
    nailLavenderEditorial.url,
    spaGlassVisionpro.url,
    nailHome.url,
    spaHome.url,
  ],
  ncc: [
    chauffeurEditorialMagazine.url,
    chauffeurHome.url,
    chauffeurFleet.url,
  ],
  hospitality: [
    villaLevanteCinematic.url,
    hotelHome.url,
    hotelSuite.url,
  ],
  fitness: [
    gymBentoAcid.url,
    padelGlassPastel.url,
    padelHome.url,
    gymHome.url,
  ],
  realestate: [
    dimoraNeoBrutalist.url,
    realestateHome.url,
    realestateDetail.url,
  ],
  retail: [
    atelierMonochromeEditorial.url,
    atelierHome.url,
    atelierDetail.url,
  ],
  agency: [
    empireStudioBento.url,
    agencyHome.url,
  ],
};
