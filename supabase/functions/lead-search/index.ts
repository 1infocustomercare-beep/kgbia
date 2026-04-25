import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ═══════════════════════════════════════════════════════
   SECTOR SEARCH TERMS — expanded with synonyms & deep variants
   ═══════════════════════════════════════════════════════ */
const SECTOR_TERMS: Record<string, string[]> = {
  food: ["ristorante", "pizzeria", "trattoria", "osteria", "bar", "pub", "bistrot", "sushi", "gelateria", "pasticceria", "enoteca", "restaurant", "cafe", "bakery", "fast food", "tavola calda", "rosticceria", "kebab", "poke", "hamburger", "gastronomia", "street food", "agriristoro", "birreria", "wine bar", "cocktail bar", "caffe", "caffetteria", "focacceria", "piadineria", "friggitoria"],
  beauty: ["parrucchiere", "centro estetico", "salone bellezza", "nail salon", "barbiere", "spa", "beauty salon", "hairdresser", "barber shop", "acconciature", "solarium", "centro abbronzatura", "trucco permanente", "makeup artist", "extension ciglia", "depilazione laser", "centro benessere"],
  ncc: ["NCC noleggio conducente", "taxi", "transfer aeroporto", "limousine service", "autonoleggio", "car rental", "servizio auto", "chauffeur", "bus turistico", "minibus", "shuttle", "transfer porto"],
  healthcare: ["dentista", "studio medico", "clinica", "farmacia", "fisioterapia", "ambulatorio", "dentist", "pharmacy", "doctor clinic", "oculista", "dermatologo", "psicologo", "osteopata", "poliambulatorio", "centro diagnostico", "laboratorio analisi", "ortopedico", "cardiologo", "ginecologo"],
  retail: ["negozio abbigliamento", "boutique", "gioielleria", "ottica", "profumeria", "clothing store", "jewelry shop", "shoe store", "calzature", "pelletteria", "merceria", "cartoleria", "ferramenta", "casalinghi", "arredamento", "antiquariato", "libreria"],
  fitness: ["palestra", "gym", "crossfit", "yoga studio", "piscina", "padel", "fitness center", "swimming pool", "sport center", "tennis club", "centro sportivo", "pilates", "danza", "arti marziali", "boxe", "climbing"],
  hospitality: ["hotel", "bed and breakfast", "albergo", "hostel", "resort", "agriturismo", "guest house", "pensione", "motel", "residence", "casa vacanze", "affittacamere", "dimora storica"],
  beach: ["stabilimento balneare", "lido", "beach club", "beach resort", "bagno", "chiosco spiaggia", "noleggio ombrelloni"],
  plumber: ["idraulico", "plumber", "termoidraulica", "impianti idraulici", "caldaie", "condizionamento"],
  electrician: ["elettricista", "electrician", "impianti elettrici", "fotovoltaico", "domotica", "automazione"],
  veterinary: ["veterinario", "clinica veterinaria", "pet clinic", "toelettatura", "pet shop", "negozio animali"],
  tattoo: ["tattoo studio", "tatuaggi", "piercing studio", "ink studio", "body art"],
  photography: ["fotografo", "studio fotografico", "photographer", "photo studio", "videomaker", "wedding photographer"],
  events: ["location eventi", "catering", "wedding planner", "event venue", "banqueting", "sala ricevimenti", "feste", "animazione"],
  construction: ["impresa edile", "ristrutturazioni", "construction company", "builder", "muratore", "geometra", "architetto"],
  gardening: ["vivaio", "garden center", "fiorista", "florist", "giardiniere", "paesaggista", "manutenzione verde"],
  legal: ["avvocato", "studio legale", "notaio", "lawyer", "law firm", "consulente legale"],
  accounting: ["commercialista", "consulente fiscale", "accountant", "tax advisor", "centro CAF", "patronato"],
  agriturismo: ["agriturismo", "fattoria didattica", "cantina vini", "wine cellar", "masseria", "azienda agricola"],
  cleaning: ["impresa pulizie", "lavanderia", "laundry", "cleaning service", "tintoria", "sanificazione"],
  garage: ["officina meccanica", "autofficina", "gommista", "car repair", "autolavaggio", "car wash", "carrozzeria", "elettrauto", "revisione auto"],
};

/* ═══ OSM Amenity/Shop tags per sector (for Overpass) ═══ */
const SECTOR_OSM_TAGS: Record<string, string[]> = {
  food: ['amenity=restaurant', 'amenity=fast_food', 'amenity=cafe', 'amenity=bar', 'amenity=pub', 'amenity=ice_cream', 'shop=bakery', 'shop=pastry', 'shop=confectionery'],
  beauty: ['shop=hairdresser', 'shop=beauty', 'amenity=beauty', 'shop=cosmetics', 'leisure=spa'],
  ncc: ['amenity=taxi', 'amenity=car_rental'],
  healthcare: ['amenity=dentist', 'amenity=doctors', 'amenity=clinic', 'amenity=pharmacy', 'amenity=hospital', 'healthcare=physiotherapist'],
  retail: ['shop=clothes', 'shop=shoes', 'shop=jewelry', 'shop=optician', 'shop=boutique', 'shop=gift', 'shop=books'],
  fitness: ['leisure=fitness_centre', 'leisure=sports_centre', 'leisure=swimming_pool', 'sport=tennis', 'sport=padel'],
  hospitality: ['tourism=hotel', 'tourism=guest_house', 'tourism=hostel', 'tourism=motel'],
  beach: ['leisure=beach_resort', 'amenity=beach', 'natural=beach'],
  plumber: ['craft=plumber'],
  electrician: ['craft=electrician'],
  veterinary: ['amenity=veterinary', 'shop=pet'],
  tattoo: ['shop=tattoo'],
  photography: ['craft=photographer', 'shop=photo'],
  events: ['amenity=events_venue', 'amenity=conference_centre'],
  construction: ['craft=builder', 'office=construction_company'],
  gardening: ['shop=garden_centre', 'shop=florist'],
  legal: ['office=lawyer', 'office=notary'],
  accounting: ['office=accountant', 'office=tax_advisor'],
  agriturismo: ['tourism=farm_stay'],
  cleaning: ['shop=laundry', 'shop=dry_cleaning'],
  garage: ['shop=car_repair', 'shop=car', 'amenity=car_wash', 'shop=tyres'],
};

/* ═══ GEOCODE (city or full address) — picks best match in country ═══ */
async function geocodeCity(city: string, countryCode?: string): Promise<{ lat: number; lon: number; bbox: number[]; country_code?: string; matched_name?: string; place_type?: string; parent_name?: string } | null> {
  try {
    const cc = countryCode ? `&countrycodes=${countryCode.toLowerCase()}` : "";
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=8&addressdetails=1${cc}`,
      { headers: { "User-Agent": "EmpireAI-LeadScout/6.0 (info@empireaigroup.com)" } }
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.length) return null;
    // Prefer admin places (city/town/village/hamlet/municipality/suburb) over POIs
    const placeRanks: Record<string, number> = {
      city: 0, town: 1, municipality: 1, village: 2, hamlet: 3, suburb: 4, neighbourhood: 5,
      administrative: 6, county: 7, state: 8,
    };
    const sorted = [...data].sort((a, b) => {
      const ra = placeRanks[a.type] ?? placeRanks[a.class] ?? 99;
      const rb = placeRanks[b.type] ?? placeRanks[b.class] ?? 99;
      if (ra !== rb) return ra - rb;
      return (parseFloat(b.importance ?? "0")) - (parseFloat(a.importance ?? "0"));
    });
    const best = sorted[0];
    const addr = best.address || {};
    // Detect parent municipality (for fallback when small villages have no POIs)
    const parentName = addr.municipality || addr.town || addr.city || addr.county || null;
    return {
      lat: parseFloat(best.lat),
      lon: parseFloat(best.lon),
      bbox: best.boundingbox?.map(Number) || [],
      country_code: (addr.country_code || "").toLowerCase(),
      matched_name: best.display_name,
      place_type: best.type || best.class,
      parent_name: parentName && parentName.toLowerCase() !== city.toLowerCase().trim() ? parentName : undefined,
    };
  } catch { return null; }
}

/* ═══ HAVERSINE distance (km) ═══ */
function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ═══ GLOBAL NAME SEARCH — find a business by name everywhere (Nominatim, no bbox) ═══ */
async function searchByNameGlobal(name: string, countryCode?: string): Promise<any[]> {
  if (!name || name.trim().length < 2) return [];
  const cc = countryCode ? `&countrycodes=${countryCode.toLowerCase()}` : "";
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&addressdetails=1&extratags=1&limit=30${cc}`,
      { headers: { "User-Agent": "EmpireAI-LeadScout/6.0 (info@empireaigroup.com)" }, signal: AbortSignal.timeout(9000) }
    );
    if (!resp.ok) return [];
    const data = await resp.json();
    const results: any[] = [];
    const seen = new Set<string>();
    for (const item of data) {
      if (["boundary", "place", "highway", "railway", "waterway", "natural", "landuse", "administrative"].includes(item.class)) continue;
      const dispName = item.display_name?.split(",")[0]?.trim() || "";
      if (!dispName || dispName.length < 2) continue;
      const key = dispName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
      if (seen.has(key)) continue;
      seen.add(key);
      const tags = item.extratags || {};
      const addr = item.address || {};
      results.push({
        source: "nominatim", name: dispName,
        full_address: item.display_name || "",
        city: addr.city || addr.town || addr.village || addr.municipality || "",
        zone: addr.suburb || addr.neighbourhood || addr.quarter || "",
        lat: parseFloat(item.lat), lon: parseFloat(item.lon),
        phone: tags.phone || tags["contact:phone"] || null,
        website: tags.website || tags["contact:website"] || tags.url || null,
        email: tags.email || tags["contact:email"] || null,
        opening_hours: tags.opening_hours || null,
        instagram: tags["contact:instagram"] || null,
        facebook: tags["contact:facebook"] || null,
        cuisine: tags.cuisine || null,
        osm_type: item.type || item.class,
        google_maps_url: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`,
        search_google: `https://www.google.com/search?q=${encodeURIComponent(dispName + " " + (addr.city || addr.country || ""))}`,
        search_instagram: `https://www.instagram.com/explore/tags/${encodeURIComponent(dispName.replace(/\s+/g, "").toLowerCase())}/`,
        search_facebook: `https://www.facebook.com/search/pages/?q=${encodeURIComponent(dispName)}`,
      });
    }
    return results;
  } catch { return []; }
}

/* ═══ REVERSE GEOCODE (coords → city name) ═══ */
async function reverseGeocode(lat: number, lon: number): Promise<{ city: string; address: string } | null> {
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&zoom=14`,
      { headers: { "User-Agent": "EmpireAI-LeadScout/6.0 (info@empireaigroup.com)" } }
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    const addr = data.address || {};
    const cityName = addr.city || addr.town || addr.village || addr.municipality || addr.county || "";
    return { city: cityName, address: data.display_name || "" };
  } catch { return null; }
}

/* ═══ BBOX from center + radius km (1° lat ≈ 111km) ═══ */
function bboxFromRadius(lat: number, lon: number, radiusKm: number): number[] {
  const dLat = radiusKm / 111;
  const dLon = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
  return [lat - dLat, lat + dLat, lon - dLon, lon + dLon]; // [south, north, west, east]
}

async function searchPhoton(city: string, sector: string, geo: { lat: number; lon: number; bbox: number[] }, page: number, specializationQuery = "", maxDistanceKm = 25, countryCode = ""): Promise<any[]> {
  const baseTerms = SECTOR_TERMS[sector] || [sector];
  const terms = specializationQuery ? [specializationQuery, ...baseTerms.filter(t => t !== specializationQuery)] : baseTerms;
  const results: any[] = [];
  const seen = new Set<string>();

  // Different terms per page for deeper results
  const startIdx = page * 5;
  const searchTerms = terms.slice(startIdx, startIdx + 6);
  if (searchTerms.length === 0) return [];

  // Photon supports bbox: minLon,minLat,maxLon,maxLat
  // Use slightly enlarged bbox around center for accuracy
  const dLat = maxDistanceKm / 111;
  const dLon = maxDistanceKm / (111 * Math.cos((geo.lat * Math.PI) / 180));
  const bboxParam = `&bbox=${(geo.lon - dLon).toFixed(5)},${(geo.lat - dLat).toFixed(5)},${(geo.lon + dLon).toFixed(5)},${(geo.lat + dLat).toFixed(5)}`;
  const langParam = countryCode === "it" ? "&lang=it" : "";

  const fetchPhoton = async (q: string) => {
    try {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=${geo.lat}&lon=${geo.lon}&limit=40${bboxParam}${langParam}`;
      const resp = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (!resp.ok) return [];
      const data = await resp.json();
      return data.features || [];
    } catch { return []; }
  };

  const searches = searchTerms.map(term => `${term} ${city}`);
  const allData = await Promise.all(searches.map(s => fetchPhoton(s)));

  for (const features of allData) {
    for (const f of features) {
      const props = f.properties || {};
      const name = props.name;
      if (!name || name.length < 3) continue;
      if (["city", "district", "state", "country", "street", "locality", "county"].includes(props.osm_value)) continue;
      if (["boundary", "place", "highway", "railway", "waterway", "natural", "landuse"].includes(props.osm_key)) continue;

      // Country filter
      if (countryCode && props.countrycode && props.countrycode.toLowerCase() !== countryCode.toLowerCase()) continue;

      const coords = f.geometry?.coordinates || [];
      const lat = coords[1], lon = coords[0];
      // Distance filter — drop results too far from search center
      if (typeof lat === "number" && typeof lon === "number") {
        const dist = distanceKm(geo.lat, geo.lon, lat, lon);
        if (dist > maxDistanceKm) continue;
      }

      const key = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25);
      if (seen.has(key)) continue;
      seen.add(key);

      results.push({
        source: "photon", name,
        full_address: [props.street, props.housenumber, props.postcode, props.city || props.county].filter(Boolean).join(", "),
        city: props.city || props.county || city,
        zone: props.district || props.locality || "",
        lat, lon,
        phone: null, website: null, email: null, opening_hours: null,
        instagram: null, facebook: null, cuisine: null,
        osm_type: props.osm_value || props.osm_key || "",
        google_maps_url: lat && lon ? `https://www.google.com/maps/search/?api=1&query=${lat},${lon}` : null,
        search_google: `https://www.google.com/search?q=${encodeURIComponent(name + " " + (props.city || city))}`,
        search_instagram: `https://www.instagram.com/explore/tags/${encodeURIComponent(name.replace(/\s+/g, "").toLowerCase())}/`,
        search_facebook: `https://www.facebook.com/search/pages/?q=${encodeURIComponent(name)}`,
      });
    }
  }
  return results;
}

/* ═══ SOURCE 2: NOMINATIM ═══ */
async function searchNominatim(city: string, sector: string, userQuery: string, geo: { lat: number; lon: number; bbox: number[] }, page: number, countryCode?: string, maxDistanceKm = 25): Promise<any[]> {
  const terms = SECTOR_TERMS[sector] || [sector];
  const results: any[] = [];
  const seen = new Set<string>();

  // bbox from geocode is [south, north, west, east] (Nominatim boundingbox order)
  const [south, north, west, east] = geo.bbox.length >= 4
    ? geo.bbox
    : [geo.lat - 0.08, geo.lat + 0.08, geo.lon - 0.08, geo.lon + 0.08];

  // Expand search area on deeper pages — keep bbox VALID (south<north, west<east)
  const expansion = page * 0.03;
  const sExp = Number(south) - expansion;
  const nExp = Number(north) + expansion;
  const wExp = Number(west) - expansion;
  const eExp = Number(east) + expansion;
  // Nominatim viewbox format: lon_min,lat_max,lon_max,lat_min  (= west,north,east,south)
  const viewbox = `${wExp},${nExp},${eExp},${sExp}`;
  const cc = countryCode ? `&countrycodes=${countryCode.toLowerCase()}` : "";

  const startIdx = page * 6;
  const searches: string[] = [];
  if (userQuery && page === 0) searches.push(`${userQuery} ${city}`);
  searches.push(...terms.slice(startIdx, startIdx + 8).map(t => `${t} ${city}`));
  if (searches.length === 0) return [];

  const fetchOne = async (term: string) => {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(term)}&format=json&addressdetails=1&extratags=1&limit=50&viewbox=${viewbox}&bounded=1${cc}`,
        { headers: { "User-Agent": "EmpireAI-LeadScout/6.0 (info@empireaigroup.com)" }, signal: AbortSignal.timeout(8000) }
      );
      if (!resp.ok) return [];
      return await resp.json();
    } catch { return []; }
  };


  for (let i = 0; i < searches.length; i += 2) {
    const batch = searches.slice(i, i + 2);
    const allData = await Promise.all(batch.map(s => fetchOne(s)));
    for (const data of allData) {
      for (const item of data) {
        if (["boundary", "place", "highway", "railway", "waterway", "natural", "landuse", "residential", "administrative"].includes(item.class)) continue;
        const name = item.display_name?.split(",")[0]?.trim() || "";
        if (!name || name.length < 3) continue;

        const tags = item.extratags || {};
        const addr = item.address || {};

        // Country filter — drop results outside expected country
        if (countryCode && addr.country_code && addr.country_code.toLowerCase() !== countryCode.toLowerCase()) continue;

        // Distance filter — drop results too far from search center
        const itemLat = parseFloat(item.lat), itemLon = parseFloat(item.lon);
        if (!isNaN(itemLat) && !isNaN(itemLon)) {
          const dist = distanceKm(geo.lat, geo.lon, itemLat, itemLon);
          if (dist > maxDistanceKm) continue;
        }

        const key = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25);
        if (seen.has(key)) continue;
        seen.add(key);

        results.push({
          source: "nominatim", name,
          full_address: item.display_name || "",
          city: addr.city || addr.town || addr.village || addr.municipality || city,
          zone: addr.suburb || addr.neighbourhood || addr.quarter || "",
          lat: itemLat, lon: itemLon,
          phone: tags.phone || tags["contact:phone"] || tags["phone:mobile"] || null,
          website: tags.website || tags["contact:website"] || tags.url || null,
          email: tags.email || tags["contact:email"] || null,
          opening_hours: tags.opening_hours || null,
          instagram: tags["contact:instagram"] || null,
          facebook: tags["contact:facebook"] || null,
          cuisine: tags.cuisine || null,
          osm_type: item.type || item.class,
          google_maps_url: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`,
          search_google: `https://www.google.com/search?q=${encodeURIComponent(name + " " + city)}`,
          search_instagram: `https://www.instagram.com/explore/tags/${encodeURIComponent(name.replace(/\s+/g, "").toLowerCase())}/`,
          search_facebook: `https://www.facebook.com/search/pages/?q=${encodeURIComponent(name)}`,
        });
      }
    }
    if (results.length >= 80) break;
    if (i + 2 < searches.length) await new Promise(r => setTimeout(r, 400));
  }
  return results;
}

/* ═══ SOURCE 3: OVERPASS API (OSM structured tags) ═══ */
async function searchOverpass(sector: string, geo: { lat: number; lon: number; bbox: number[] }, page: number): Promise<any[]> {
  const tags = SECTOR_OSM_TAGS[sector];
  if (!tags || tags.length === 0) return [];

  const [south, north, west, east] = geo.bbox.length >= 4
    ? geo.bbox
    : [geo.lat - 0.06, geo.lat + 0.06, geo.lon - 0.06, geo.lon + 0.06];

  const expansion = page * 0.025;
  const bbox = `${Number(south) - expansion},${Number(west) - expansion},${Number(north) + expansion},${Number(east) + expansion}`;

  // Select different tags per page
  const startIdx = page * 3;
  const pageTags = tags.slice(startIdx, startIdx + 4);
  if (pageTags.length === 0) return [];

  const tagFilters = pageTags.map(t => {
    const [k, v] = t.split('=');
    return `node["${k}"="${v}"](${bbox});way["${k}"="${v}"](${bbox});`;
  }).join('');

  const query = `[out:json][timeout:10];(${tagFilters});out center 80;`;

  try {
    const resp = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(12000),
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    const results: any[] = [];
    const seen = new Set<string>();

    for (const el of (data.elements || [])) {
      const tags = el.tags || {};
      const name = tags.name;
      if (!name || name.length < 3) continue;
      const key = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25);
      if (seen.has(key)) continue;
      seen.add(key);

      const lat = el.lat || el.center?.lat;
      const lon = el.lon || el.center?.lon;

      results.push({
        source: "overpass", name,
        full_address: [tags["addr:street"], tags["addr:housenumber"], tags["addr:postcode"], tags["addr:city"]].filter(Boolean).join(", "),
        city: tags["addr:city"] || tags["addr:municipality"] || "",
        zone: tags["addr:suburb"] || tags["addr:neighbourhood"] || "",
        lat, lon,
        phone: tags.phone || tags["contact:phone"] || null,
        website: tags.website || tags["contact:website"] || null,
        email: tags.email || tags["contact:email"] || null,
        opening_hours: tags.opening_hours || null,
        instagram: tags["contact:instagram"] || null,
        facebook: tags["contact:facebook"] || null,
        cuisine: tags.cuisine || null,
        osm_type: tags.amenity || tags.shop || tags.craft || tags.leisure || tags.tourism || "",
        google_maps_url: lat && lon ? `https://www.google.com/maps/search/?api=1&query=${lat},${lon}` : null,
        search_google: `https://www.google.com/search?q=${encodeURIComponent(name + " " + (tags["addr:city"] || ""))}`,
        search_instagram: `https://www.instagram.com/explore/tags/${encodeURIComponent(name.replace(/\s+/g, "").toLowerCase())}/`,
        search_facebook: `https://www.facebook.com/search/pages/?q=${encodeURIComponent(name)}`,
      });
    }
    return results;
  } catch (e) {
    console.error("Overpass error:", e);
    return [];
  }
}

/* ═══ SOURCE 4: GOOGLE PLACES (premium) ═══ */
async function searchGooglePlaces(query: string, city: string, sector: string, page: number): Promise<any[]> {
  const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!apiKey) return [];
  const sectorKw: Record<string, string[]> = {
    food: ["ristorante", "pizzeria", "trattoria", "bar caffè", "pasticceria", "gelateria"],
    beauty: ["parrucchiere", "centro estetico", "nail salon", "barbiere", "spa"],
    ncc: ["NCC noleggio conducente", "taxi", "transfer"],
    healthcare: ["dentista", "studio medico", "clinica", "farmacia", "fisioterapia"],
    retail: ["negozio abbigliamento", "boutique", "gioielleria", "ottica"],
    fitness: ["palestra", "gym", "crossfit", "piscina", "padel"],
    hospitality: ["hotel", "bed and breakfast", "albergo"],
    beach: ["stabilimento balneare", "lido"],
    plumber: ["idraulico", "termoidraulica"],
    electrician: ["elettricista", "impianti elettrici"],
    veterinary: ["veterinario", "pet shop"],
    tattoo: ["tattoo studio", "tatuaggi"],
    photography: ["fotografo", "studio fotografico"],
    events: ["location eventi", "catering", "wedding planner"],
    construction: ["impresa edile", "ristrutturazioni"],
    gardening: ["vivaio", "garden center", "fiorista"],
    legal: ["avvocato", "studio legale"],
    accounting: ["commercialista", "consulente fiscale"],
  };

  const terms = sectorKw[sector] || [sector];
  const searchText = query || terms[page % terms.length] || sector;

  const results: any[] = [];
  try {
    const resp = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.location,places.types,places.businessStatus,places.regularOpeningHours",
      },
      body: JSON.stringify({ textQuery: `${searchText} ${city}`, languageCode: "it", maxResultCount: 20 }),
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    for (const p of data.places || []) {
      results.push({
        source: "google_places",
        name: p.displayName?.text || "N/A",
        full_address: p.formattedAddress || "",
        city, zone: "",
        lat: p.location?.latitude, lon: p.location?.longitude,
        phone: p.nationalPhoneNumber || p.internationalPhoneNumber || null,
        website: p.websiteUri || null,
        email: null,
        google_rating: p.rating || 0,
        google_reviews: p.userRatingCount || 0,
        google_maps_url: p.googleMapsUri || null,
        opening_hours: p.regularOpeningHours?.weekdayDescriptions?.join("; ") || null,
        business_status: p.businessStatus || "OPERATIONAL",
        types: p.types || [],
        search_google: `https://www.google.com/search?q=${encodeURIComponent((p.displayName?.text || "") + " " + city)}`,
        search_instagram: `https://www.instagram.com/explore/tags/${encodeURIComponent((p.displayName?.text || "").replace(/\s+/g, "").toLowerCase())}/`,
        search_facebook: `https://www.facebook.com/search/pages/?q=${encodeURIComponent(p.displayName?.text || "")}`,
      });
    }
  } catch (e) { console.error("Google Places error:", e); }
  return results;
}

/* ═══ HTML cleanup helpers ═══ */
function decodeEntities(s: string): string {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}
function stripTags(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

/* ═══ SOURCE 5: DUCKDUCKGO HTML (free, no key) ═══
   Cerca aziende sul web tramite il rendering HTML di DuckDuckGo.
   Estrae title + URL del sito, poi prova a riconciliare con il geo center via dominio. */
async function searchDuckDuckGo(query: string, sector: string, city: string, countryCode = ""): Promise<any[]> {
  const baseTerms = SECTOR_TERMS[sector] || [sector];
  const term = baseTerms[0] || sector;
  const q = `${term} ${city || query}`.trim();
  if (!q) return [];
  const ccParam = countryCode ? `&kl=${countryCode.toLowerCase()}-${countryCode.toLowerCase()}` : "";
  try {
    const resp = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}${ccParam}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EmpireAI-LeadScout/6.0; +https://empireaigroup.com)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok) return [];
    const html = await resp.text();
    const out: any[] = [];
    const seen = new Set<string>();
    // Match: <a class="result__a" href="...">Title</a>
    const re = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) && out.length < 25) {
      let href = m[1];
      // DuckDuckGo wraps real URL in /l/?uddg=
      const uddg = href.match(/uddg=([^&]+)/);
      if (uddg) { try { href = decodeURIComponent(uddg[1]); } catch {} }
      const title = stripTags(m[2]);
      if (!title || title.length < 3) continue;
      // Skip directory aggregator domains (we want real businesses)
      const skipDomains = ["wikipedia.org", "tripadvisor.", "facebook.com", "instagram.com", "yelp.", "youtube.com", "linkedin.com", "google.", "duckduckgo."];
      if (skipDomains.some(d => href.includes(d))) continue;
      const key = title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
      if (key.length < 3 || seen.has(key)) continue;
      seen.add(key);
      out.push({
        source: "duckduckgo",
        name: title.split(/[·\-|]/)[0].trim().slice(0, 80),
        full_address: city,
        city, zone: "",
        lat: null, lon: null,
        phone: null, website: href, email: null, instagram: null, facebook: null,
        google_maps_url: null,
        search_google: `https://www.google.com/search?q=${encodeURIComponent(title + " " + city)}`,
      });
    }
    return out;
  } catch (e) { console.error("DuckDuckGo error:", e); return []; }
}

/* ═══ SOURCE 6: PAGINE GIALLE (IT directory, scraping) ═══ */
async function searchPagineGialle(sector: string, city: string): Promise<any[]> {
  if (!city) return [];
  const baseTerms = SECTOR_TERMS[sector] || [sector];
  const term = baseTerms[0] || sector;
  try {
    const url = `https://www.paginegialle.it/ricerca/${encodeURIComponent(term)}/${encodeURIComponent(city)}`;
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept-Language": "it-IT,it;q=0.9",
      },
      signal: AbortSignal.timeout(9000),
    });
    if (!resp.ok) return [];
    const html = await resp.text();
    const out: any[] = [];
    const seen = new Set<string>();
    // Estrai blocchi <h2 ...>Nome</h2> e telefoni vicini
    const itemRe = /<h2[^>]*class="[^"]*search-itm__rag[^"]*"[^>]*>([\s\S]*?)<\/h2>([\s\S]{0,1200}?)(?=<h2|$)/g;
    let m: RegExpExecArray | null;
    while ((m = itemRe.exec(html)) && out.length < 25) {
      const name = stripTags(m[1]);
      const block = m[2];
      if (!name || name.length < 3) continue;
      const key = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
      if (key.length < 3 || seen.has(key)) continue;
      seen.add(key);
      const phoneM = block.match(/(?:tel:|telefono[^0-9]{0,15})((?:\+?39\s*)?(?:0\d{1,3}[\s\-./]?\d{5,9}|3\d{2}[\s\-./]?\d{6,7}))/i);
      const addrM = block.match(/<span[^>]*class="[^"]*search-itm__adr[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
      const websiteM = block.match(/href="(https?:\/\/(?!www\.paginegialle\.it)[^"]+)"[^>]*[^>]*class="[^"]*(?:lnk-sito|website)[^"]*"/i);
      out.push({
        source: "pagine_gialle",
        name,
        full_address: addrM ? stripTags(addrM[1]) : city,
        city, zone: "",
        lat: null, lon: null,
        phone: phoneM ? phoneM[1].replace(/\s+/g, " ").trim() : null,
        website: websiteM ? websiteM[1] : null,
        email: null, instagram: null, facebook: null,
        google_maps_url: null,
        search_google: `https://www.google.com/search?q=${encodeURIComponent(name + " " + city)}`,
      });
    }
    return out;
  } catch (e) { console.error("PagineGialle error:", e); return []; }
}

/* ═══ SOURCE 7: EUROPAGES B2B (scraping) ═══ */
async function searchEuropages(sector: string, city: string, countryCode = ""): Promise<any[]> {
  if (!city && !countryCode) return [];
  const baseTerms = SECTOR_TERMS[sector] || [sector];
  const term = baseTerms[0] || sector;
  try {
    const cc = countryCode || "it";
    const url = `https://www.europages.${cc}/aziende/${encodeURIComponent(term)}/${encodeURIComponent(city || "")}.html`;
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept-Language": `${cc}-${cc.toUpperCase()},${cc};q=0.9,en;q=0.5`,
      },
      signal: AbortSignal.timeout(9000),
    });
    if (!resp.ok) return [];
    const html = await resp.text();
    const out: any[] = [];
    const seen = new Set<string>();
    // Generic title extraction
    const titleRe = /<a[^>]+(?:data-test="company-name"|class="[^"]*company-name[^"]*")[^>]*>([\s\S]*?)<\/a>/g;
    let m: RegExpExecArray | null;
    while ((m = titleRe.exec(html)) && out.length < 25) {
      const name = stripTags(m[1]);
      if (!name || name.length < 3) continue;
      const key = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
      if (key.length < 3 || seen.has(key)) continue;
      seen.add(key);
      out.push({
        source: "europages",
        name,
        full_address: city,
        city, zone: "",
        lat: null, lon: null,
        phone: null, website: null, email: null, instagram: null, facebook: null,
        google_maps_url: null,
        search_google: `https://www.google.com/search?q=${encodeURIComponent(name + " " + city)}`,
      });
    }
    return out;
  } catch (e) { console.error("Europages error:", e); return []; }
}

/* ═══ SOURCE 8: FIRECRAWL search (AI scraping, requires key) ═══ */
async function searchFirecrawl(sector: string, city: string, query = ""): Promise<any[]> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!apiKey) return [];
  const baseTerms = SECTOR_TERMS[sector] || [sector];
  const term = baseTerms[0] || sector;
  const q = (query || `${term} ${city}`).trim();
  if (!q) return [];
  try {
    const resp = await fetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: q, limit: 20 }),
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) return [];
    const data = await resp.json();
    const items: any[] = data?.data || data?.results || [];
    const out: any[] = [];
    const seen = new Set<string>();
    const skipDomains = ["wikipedia.org", "facebook.com", "instagram.com", "youtube.com", "linkedin.com", "google."];
    for (const it of items) {
      const url = it.url || it.link;
      const title = (it.title || "").toString();
      if (!url || !title) continue;
      if (skipDomains.some(d => url.includes(d))) continue;
      const name = title.split(/[·\-|]/)[0].trim().slice(0, 80);
      const key = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
      if (key.length < 3 || seen.has(key)) continue;
      seen.add(key);
      out.push({
        source: "firecrawl",
        name,
        full_address: city,
        city, zone: "",
        lat: null, lon: null,
        phone: null, website: url, email: null, instagram: null, facebook: null,
        google_maps_url: null,
        search_google: `https://www.google.com/search?q=${encodeURIComponent(name + " " + city)}`,
      });
    }
    return out;
  } catch (e) { console.error("Firecrawl error:", e); return []; }
}

/* ═══ MERGE + DEDUPLICATE ═══ */
function mergeAndDeduplicate(buckets: any[][], existing?: any[]): any[] {
  const all = buckets.flat();
  const seen = new Map<string, any>();

  if (existing) {
    for (const r of existing) {
      const key = r.name?.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
      if (key && key.length >= 3) seen.set(key, null);
    }
  }

  const results: any[] = [];
  for (const r of all) {
    const key = r.name?.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
    if (!key || key.length < 3) continue;

    if (seen.has(key)) {
      const ex = seen.get(key);
      if (ex) {
        for (const field of ["phone", "website", "email", "instagram", "facebook", "opening_hours", "cuisine", "full_address", "zone", "lat", "lon"]) {
          if (!ex[field] && r[field]) ex[field] = r[field];
        }
        if (!ex.google_rating && r.google_rating) ex.google_rating = r.google_rating;
        if (!ex.google_reviews && r.google_reviews) ex.google_reviews = r.google_reviews;
      }
      continue;
    }
    seen.set(key, r);
    results.push(r);
  }

  return results;
}

/* ═══ Fingerprint helper for credit dedup ═══ */
async function makeFingerprint(payload: Record<string, unknown>): Promise<string> {
  const json = JSON.stringify(payload, Object.keys(payload).sort());
  const buf = new TextEncoder().encode(json);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

/* ═══ MAIN HANDLER ═══ */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // ── Auth guard ──
    const authHeader = req.headers.get("Authorization");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const isInternalServiceCall = !!serviceRoleKey && authHeader === `Bearer ${serviceRoleKey}`;

    let authedUserId: string | null = null;
    if (!isInternalServiceCall) {
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const _authClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
      const { data: { user: _authUser }, error: _authErr } = await _authClient.auth.getUser();
      if (_authErr || !_authUser) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      authedUserId = _authUser.id;
    }

    const {
      query, city, sector, use_google, page = 0, existing_names = [],
      lat, lon, radius_km, specialization_query,
      sources: requestedSources, name_only, country_code,
      skip_credit_charge,
    } = await req.json();
    const hasCoords = typeof lat === "number" && typeof lon === "number";
    if (!city && !query && !hasCoords) {
      return new Response(JSON.stringify({ success: false, error: "Inserisci una città, una query o coordinate GPS" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const searchCity = (city || "").trim();
    const specializationQuery = (specialization_query || "").trim();
    const searchQuery = (query || "").trim();
    const combinedQuery = [specializationQuery, searchQuery].filter(Boolean).join(" ").trim();
    const searchSector = sector || "food";
    const searchPage = Math.max(0, Math.min(page, 10)); // max 10 pages
    const searchRadius = typeof radius_km === "number" ? Math.max(0.5, Math.min(radius_km, 100)) : null;
    const allowedSources: string[] = Array.isArray(requestedSources) && requestedSources.length > 0
      ? requestedSources.map((s: string) => String(s).toLowerCase())
      : ["photon", "nominatim", "overpass", "google"];
    const useSrc = (s: string) => allowedSources.includes(s);
    const isNameOnly = !!name_only && searchQuery.length >= 2;
    const ccFilter = typeof country_code === "string" && country_code.length === 2 ? country_code : "";

    // Build existing names set for dedup
    const existingForDedup = (existing_names || []).map((n: string) => ({ name: n }));

    /* ═══ FINGERPRINT + CREDIT DEDUP (server-side single source of truth) ═══
       Stessa ricerca dello stesso venditore entro 15 minuti = NESSUN addebito,
       riusiamo i risultati cached. `page` viene incluso nel fingerprint
       quindi "Carica altri" è una nuova ricerca legittima. */
    const fingerprintPayload: Record<string, unknown> = {
      mode: isNameOnly ? "name_only" : (hasCoords ? "gps" : "zone"),
      city: searchCity.toLowerCase(),
      query: searchQuery.toLowerCase(),
      sector: searchSector,
      cc: ccFilter,
      sources: [...allowedSources].sort(),
      page: searchPage,
      // GPS arrotondato a 3 decimali (~110m) per non addebitare 2 volte spostamenti minimi
      lat: hasCoords ? Math.round((lat as number) * 1000) / 1000 : null,
      lon: hasCoords ? Math.round((lon as number) * 1000) / 1000 : null,
      r: searchRadius,
      spec: specializationQuery.toLowerCase(),
    };
    const fingerprint = await makeFingerprint(fingerprintPayload);

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")!,
    );

    let creditInfo: Record<string, unknown> = { cached: false, credits_used: 0, charged: false, fingerprint };

    if (authedUserId && !skip_credit_charge) {
      // 1. Cache lookup: hit → restituisco subito i risultati salvati senza addebito
      const { data: cacheData } = await adminClient.rpc("lead_search_cache_get" as any, {
        p_user_id: authedUserId,
        p_fingerprint: fingerprint,
        p_action: "lead_search",
      });

      if (cacheData && (cacheData as any).hit === true) {
        const cachedResults = (cacheData as any).results || [];
        const cachedMeta = (cacheData as any).meta || {};
        await adminClient.rpc("consume_seller_credits_dedup" as any, {
          p_user_id: authedUserId,
          p_action: "lead_search",
          p_fingerprint: fingerprint,
          p_ttl_minutes: 15,
          p_metadata: { source: "lead-search", reason: "cache_hit" },
        });
        console.log(`[lead-search] CACHE HIT user=${authedUserId.slice(0,8)} fp=${fingerprint.slice(0,8)} count=${cachedResults.length}`);
        return new Response(JSON.stringify({
          success: true,
          results: cachedResults,
          page: searchPage,
          has_more: cachedMeta.has_more ?? false,
          sources: cachedMeta.sources || { total_merged: cachedResults.length },
          mode: cachedMeta.mode || fingerprintPayload.mode,
          cached: true,
          cache_expires_at: (cacheData as any).expires_at,
          cache_hit_count: (cacheData as any).hit_count,
          credit: { credits_used: 0, charged: false, cached: true, fingerprint },
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // 2. Nessun cache hit → addebita crediti server-side
      const { data: chargeData, error: chargeErr } = await adminClient.rpc("consume_seller_credits_dedup" as any, {
        p_user_id: authedUserId,
        p_action: "lead_search",
        p_fingerprint: fingerprint,
        p_ttl_minutes: 15,
        p_metadata: fingerprintPayload as any,
      });

      if (chargeErr || !chargeData || (chargeData as any).success === false) {
        const err = (chargeData as any) || { error: chargeErr?.message || "credit_charge_failed" };
        console.warn(`[lead-search] credit charge failed: ${JSON.stringify(err)}`);
        return new Response(JSON.stringify({
          success: false,
          error: err.error || "credit_charge_failed",
          required: err.required,
          balance: err.balance,
          cap: err.cap,
          used: err.used,
        }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      creditInfo = {
        cached: !!(chargeData as any).cached,
        credits_used: (chargeData as any).credits_used ?? 0,
        remaining_balance: (chargeData as any).remaining_balance,
        cost_eur: (chargeData as any).cost_eur,
        owner_bypass: !!(chargeData as any).owner_bypass,
        fingerprint,
        charged: ((chargeData as any).credits_used ?? 0) > 0,
      };
    }

    // helper: salva i risultati in cache per evitare doppi addebiti
    const saveCache = async (results: any[], meta: Record<string, unknown>) => {
      if (!authedUserId || skip_credit_charge) return;
      try {
        await adminClient.rpc("lead_search_cache_put" as any, {
          p_user_id: authedUserId,
          p_fingerprint: fingerprint,
          p_action: "lead_search",
          p_results: results as any,
          p_meta: meta as any,
          p_ttl_minutes: 15,
        });
      } catch (e) {
        console.warn(`[lead-search] cache save failed: ${e instanceof Error ? e.message : e}`);
      }
    };

    // ── BRANCH 1: NAME-ONLY GLOBAL SEARCH (no sector terms, no bbox required) ──
    if (isNameOnly) {
      const nameResults = await searchByNameGlobal(searchQuery, ccFilter);
      const merged = mergeAndDeduplicate([nameResults], existingForDedup.length > 0 ? existingForDedup : undefined);
      console.log(`Name-only search "${searchQuery}" cc=${ccFilter || "*"} → ${merged.length} results`);
      const sourcesObj = { photon: 0, nominatim: nameResults.length, overpass: 0, google: 0, total_merged: merged.length };
      await saveCache(merged, { mode: "name_only", has_more: false, sources: sourcesObj });
      return new Response(JSON.stringify({
        success: true, results: merged, page: 0, has_more: false,
        sources: sourcesObj,
        mode: "name_only",
        cached: false,
        credit: creditInfo,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ── BRANCH 2: NORMAL GEO SEARCH ──
    let geo: { lat: number; lon: number; bbox: number[] } | null;
    let resolvedCity = searchCity;
    if (hasCoords) {
      const r = searchRadius ?? 5;
      geo = { lat, lon, bbox: bboxFromRadius(lat, lon, r) };
      const rev = await reverseGeocode(lat, lon);
      if (rev?.city) resolvedCity = rev.city;
    } else {
      geo = await geocodeCity(searchCity || searchQuery, ccFilter);
      if (geo && searchRadius) {
        geo.bbox = bboxFromRadius(geo.lat, geo.lon, searchRadius);
      }
    }
    if (!geo) {
      return new Response(JSON.stringify({ success: false, error: `Località "${searchCity || searchQuery}" non trovata.`, results: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    // Effective country code: prefer explicit filter, else infer from geocode result
    const effectiveCC = ccFilter || (geo as any).country_code || "";

    // Distance budget: explicit radius wins; otherwise estimate from bbox; default 25km.
    // For small admin places (village/hamlet/suburb) without explicit radius, force min 15km
    // because OSM POI coverage in tiny villages is sparse and bbox is microscopic.
    const smallPlaceTypes = new Set(["village", "hamlet", "suburb", "neighbourhood", "locality", "isolated_dwelling"]);
    const isSmallPlace = !hasCoords && !!(geo as any).place_type && smallPlaceTypes.has((geo as any).place_type);

    let maxDistanceKm = 25;
    if (searchRadius && searchRadius > 0) {
      maxDistanceKm = searchRadius;
    } else if (geo.bbox && geo.bbox.length >= 4) {
      const [s, n, w, e] = geo.bbox;
      const diagKm = distanceKm(Number(s), Number(w), Number(n), Number(e));
      maxDistanceKm = Math.max(8, Math.min(60, diagKm * 0.6));
    }
    if (isSmallPlace && (!searchRadius || searchRadius <= 0)) {
      maxDistanceKm = Math.max(maxDistanceKm, 15);
      // expand bbox so the source-specific queries cover the wider area too
      geo.bbox = bboxFromRadius(geo.lat, geo.lon, maxDistanceKm);
    }

    // 2. Run SELECTED sources in parallel
    let [photonResults, nominatimResults, overpassResults, googleResults, ddgResults, pgResults, epResults, fcResults] = await Promise.all([
      useSrc("photon") ? searchPhoton(resolvedCity || combinedQuery || searchQuery, searchSector, geo, searchPage, specializationQuery, maxDistanceKm, effectiveCC) : Promise.resolve([]),
      useSrc("nominatim") ? searchNominatim(resolvedCity || combinedQuery || searchQuery, searchSector, combinedQuery, geo, searchPage, effectiveCC, maxDistanceKm) : Promise.resolve([]),
      useSrc("overpass") ? searchOverpass(searchSector, geo, searchPage) : Promise.resolve([]),
      ((useSrc("google") || useSrc("google_maps")) && use_google) ? searchGooglePlaces(combinedQuery, resolvedCity || searchCity, searchSector, searchPage) : Promise.resolve([]),
      useSrc("duckduckgo") ? searchDuckDuckGo(combinedQuery || searchQuery, searchSector, resolvedCity || searchCity, effectiveCC) : Promise.resolve([]),
      useSrc("pagine_gialle") ? searchPagineGialle(searchSector, resolvedCity || searchCity) : Promise.resolve([]),
      useSrc("europages") ? searchEuropages(searchSector, resolvedCity || searchCity, effectiveCC) : Promise.resolve([]),
      useSrc("firecrawl") ? searchFirecrawl(searchSector, resolvedCity || searchCity, combinedQuery) : Promise.resolve([]),
    ]);

    console.log(`Sources [page=${searchPage}, gps=${hasCoords}, r=${searchRadius}km, cc=${ccFilter || "*"}, srcs=${allowedSources.join(",")}, small=${isSmallPlace}]: Photon=${photonResults.length} Nominatim=${nominatimResults.length} Overpass=${overpassResults.length} Google=${googleResults.length} DDG=${ddgResults.length} PG=${pgResults.length} EP=${epResults.length} FC=${fcResults.length}`);

    // 3. Merge + deduplicate (excluding existing)
    let merged = mergeAndDeduplicate(
      [googleResults, nominatimResults, photonResults, overpassResults, ddgResults, pgResults, epResults, fcResults],
      existingForDedup.length > 0 ? existingForDedup : undefined,
    );

    // 4. AUTO-FALLBACK: if 0 results and we matched a small village with a parent municipality,
    // retry the search at the parent administrative level (e.g. Arcille → Campagnatico).
    let fallbackUsed: string | null = null;
    if (merged.length === 0 && !hasCoords && (geo as any).parent_name && searchPage === 0) {
      const parent = (geo as any).parent_name as string;
      const parentGeo = await geocodeCity(parent, effectiveCC);
      if (parentGeo) {
        const parentRadius = searchRadius && searchRadius > 0 ? searchRadius : 20;
        if (!parentGeo.bbox || parentGeo.bbox.length < 4) parentGeo.bbox = bboxFromRadius(parentGeo.lat, parentGeo.lon, parentRadius);
        const [fbPhoton, fbNom, fbOver, fbDdg, fbPg, fbEp] = await Promise.all([
          useSrc("photon") ? searchPhoton(parent, searchSector, parentGeo, 0, specializationQuery, parentRadius, effectiveCC) : Promise.resolve([]),
          useSrc("nominatim") ? searchNominatim(parent, searchSector, combinedQuery, parentGeo, 0, effectiveCC, parentRadius) : Promise.resolve([]),
          useSrc("overpass") ? searchOverpass(searchSector, parentGeo, 0) : Promise.resolve([]),
          useSrc("duckduckgo") ? searchDuckDuckGo(combinedQuery || searchQuery, searchSector, parent, effectiveCC) : Promise.resolve([]),
          useSrc("pagine_gialle") ? searchPagineGialle(searchSector, parent) : Promise.resolve([]),
          useSrc("europages") ? searchEuropages(searchSector, parent, effectiveCC) : Promise.resolve([]),
        ]);
        const fbMerged = mergeAndDeduplicate(
          [fbNom, fbPhoton, fbOver, fbDdg, fbPg, fbEp],
          existingForDedup.length > 0 ? existingForDedup : undefined,
        );
        if (fbMerged.length > 0) {
          merged = fbMerged;
          fallbackUsed = parent;
          photonResults = fbPhoton;
          nominatimResults = fbNom;
          overpassResults = fbOver;
          ddgResults = fbDdg;
          pgResults = fbPg;
          epResults = fbEp;
          console.log(`Auto-fallback: "${searchCity}" → "${parent}" produced ${fbMerged.length} results`);
        }
      }
    }

    const hasGoogleKey = !!Deno.env.get("GOOGLE_PLACES_API_KEY");
    const hasMorePages = (SECTOR_TERMS[searchSector]?.length || 0) > (searchPage + 1) * 6;

    console.log(`Lead search: "${searchCity}" "${searchSector}" page=${searchPage} → ${merged.length} new unique results${fallbackUsed ? ` (via fallback ${fallbackUsed})` : ""}`);

    return new Response(JSON.stringify({
      success: true,
      results: merged,
      page: searchPage,
      has_more: hasMorePages,
      sources: {
        photon: photonResults.length,
        nominatim: nominatimResults.length,
        overpass: overpassResults.length,
        google: googleResults.length,
        duckduckgo: ddgResults.length,
        pagine_gialle: pgResults.length,
        europages: epResults.length,
        firecrawl: fcResults.length,
        total_merged: merged.length,
      },
      has_google_key: hasGoogleKey,
      mode: "geo",
      matched_place: (geo as any).matched_name || null,
      place_type: (geo as any).place_type || null,
      fallback_used: fallbackUsed,
      effective_radius_km: maxDistanceKm,
      tip: fallbackUsed
        ? `"${searchCity}" è una piccola località senza attività mappate — risultati estesi al comune di "${fallbackUsed}".`
        : (!hasGoogleKey && merged.length < 10
          ? "Aggiungi GOOGLE_PLACES_API_KEY per rating, recensioni e telefoni verificati da Google."
          : undefined),
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("lead-search error:", e);
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
