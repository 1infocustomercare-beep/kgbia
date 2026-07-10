/**
 * Empire premium mockups — generated with Nano Banana Pro (google/gemini-3-pro-image).
 * Original iPhone screen artwork, served from CDN.
 */
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

export const EMPIRE_MOCKUPS = {
  food: {
    steakhouseHome: steakhouseHome.url,
    steakhouseDetail: steakhouseDetail.url,
    sushiHome: sushiHome.url,
    pizzeriaHome: pizzeriaHome.url,
  },
  beauty: {
    nailHome: nailHome.url,
    spaHome: spaHome.url,
  },
  ncc: {
    chauffeurHome: chauffeurHome.url,
    chauffeurFleet: chauffeurFleet.url,
  },
  hospitality: {
    hotelHome: hotelHome.url,
    suiteDetail: hotelSuite.url,
  },
  fitness: {
    padelHome: padelHome.url,
    gymHome: gymHome.url,
  },
  realestate: {
    home: realestateHome.url,
    detail: realestateDetail.url,
  },
  retail: {
    atelierHome: atelierHome.url,
    productDetail: atelierDetail.url,
  },
  agency: {
    dashboardHome: agencyHome.url,
  },
} as const;

/** Flat arrays grouped by sector for showcase carousels. */
export const EMPIRE_MOCKUPS_BY_SECTOR: Record<string, string[]> = {
  food: [
    steakhouseHome.url,
    sushiHome.url,
    pizzeriaHome.url,
    steakhouseDetail.url,
  ],
  beauty: [nailHome.url, spaHome.url],
  ncc: [chauffeurHome.url, chauffeurFleet.url],
  hospitality: [hotelHome.url, hotelSuite.url],
  fitness: [padelHome.url, gymHome.url],
  realestate: [realestateHome.url, realestateDetail.url],
  retail: [atelierHome.url, atelierDetail.url],
  agency: [agencyHome.url],
};
