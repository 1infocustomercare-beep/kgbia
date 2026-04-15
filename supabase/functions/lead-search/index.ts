import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ═══════════════════════════════════════════════════════
   SECTOR → OSM TAG MAPPING (Overpass-precise)
   ═══════════════════════════════════════════════════════ */
const SECTOR_OVERPASS: Record<string, string[]> = {
  food: [
    'amenity~"restaurant|fast_food|cafe|bar|pub|ice_cream|food_court|biergarten"',
    'shop~"bakery|pastry|confectionery|deli|butcher|greengrocer|seafood|cheese"',
    'cuisine',
  ],
  beauty: [
    'shop~"hairdresser|beauty|cosmetics|perfumery|tattoo"',
    'amenity~"beauty|hairdresser"',
    'leisure~"spa"',
  ],
  ncc: [
    'amenity~"taxi|car_rental"',
    'shop~"car_rental"',
  ],
  healthcare: [
    'amenity~"dentist|doctors|clinic|pharmacy|hospital|veterinary"',
    'healthcare',
  ],
  retail: [
    'shop~"clothes|shoes|jewelry|boutique|fashion|optician|gift|department_store|supermarket|convenience|electronics|mobile_phone|florist|furniture|sports|toys|books|stationery"',
  ],
  fitness: [
    'leisure~"fitness_centre|sports_centre|swimming_pool|stadium"',
    'sport',
    'amenity~"gym"',
  ],
  hospitality: [
    'tourism~"hotel|motel|hostel|guest_house|apartment|camp_site|chalet"',
  ],
  beach: [
    'leisure~"beach_resort|bathing_place"',
    'amenity~"beach_resort"',
    'natural~"beach"',
  ],
  plumber: ['craft~"plumber|hvac"'],
  electrician: ['craft~"electrician|electronics_repair"'],
  veterinary: ['amenity~"veterinary"', 'shop~"pet|pet_grooming"'],
  tattoo: ['shop~"tattoo"'],
  photography: ['craft~"photographer"', 'shop~"photo"'],
  events: ['amenity~"events_venue|conference_centre"', 'cuisine~"catering"'],
  construction: ['craft~"builder|roofer|carpenter|plasterer|painter"', 'office~"architect|construction_company"'],
  gardening: ['shop~"garden_centre|florist"', 'craft~"gardener"'],
  legal: ['office~"lawyer|notary"'],
  accounting: ['office~"accountant|tax_advisor|financial_advisor"'],
  agriturismo: ['tourism~"guest_house"', 'leisure~"garden"'],
  cleaning: ['shop~"laundry|dry_cleaning"', 'craft~"cleaning"'],
  garage: ['shop~"car_repair|car_parts|tyres"', 'amenity~"car_wash|fuel"', 'craft~"car_body_repair"'],
};

/* Nominatim fallback keywords */
const SECTOR_TERMS: Record<string, string[]> = {
  food: ["ristorante", "pizzeria", "trattoria", "bar", "osteria", "pub", "pasticceria", "bistrot", "sushi", "gelateria", "restaurant", "cafe"],
  beauty: ["parrucchiere", "centro estetico", "salone bellezza", "nail salon", "barbiere", "spa", "beauty salon", "hairdresser"],
  ncc: ["NCC noleggio conducente", "taxi", "transfer aeroporto", "limousine service", "autonoleggio"],
  healthcare: ["dentista", "studio medico", "clinica", "farmacia", "fisioterapia", "ambulatorio", "dentist", "pharmacy"],
  retail: ["negozio abbigliamento", "boutique", "gioielleria", "ottica", "profumeria", "clothing store"],
  fitness: ["palestra", "gym", "crossfit", "yoga studio", "piscina", "padel", "fitness center"],
  hospitality: ["hotel", "bed and breakfast", "albergo", "hostel", "resort", "agriturismo"],
  beach: ["stabilimento balneare", "lido", "beach club"],
  plumber: ["idraulico", "plumber", "termoidraulica"],
  electrician: ["elettricista", "electrician", "impianti elettrici"],
  veterinary: ["veterinario", "clinica veterinaria", "pet clinic"],
  tattoo: ["tattoo studio", "tatuaggi", "piercing"],
  photography: ["fotografo", "studio fotografico", "photographer"],
  events: ["location eventi", "catering", "wedding planner"],
  construction: ["impresa edile", "ristrutturazioni", "construction"],
  gardening: ["vivaio", "garden center", "fiorista", "florist"],
  legal: ["avvocato", "studio legale", "notaio", "lawyer"],
  accounting: ["commercialista", "consulente fiscale", "accountant"],
  agriturismo: ["agriturismo", "fattoria didattica", "cantina vini"],
  cleaning: ["impresa pulizie", "lavanderia", "cleaning service"],
  garage: ["officina meccanica", "autofficina", "gommista", "car repair"],
};

/* ═══════════════════════════════════════════════════════
   GEOCODE city → lat/lon/bbox
   ═══════════════════════════════════════════════════════ */
async function geocodeCity(city: string): Promise<{ lat: number; lon: number; bbox: number[] } | null> {
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { "User-Agent": "EmpireAI-LeadScout/4.0 (info@empireaigroup.com)" } }
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), bbox: data[0].boundingbox?.map(Number) || [] };
  } catch { return null; }
}

/* ═══════════════════════════════════════════════════════
   SOURCE 1: OVERPASS API — precise POI from OSM database
   Returns real businesses with full metadata
   ═══════════════════════════════════════════════════════ */
async function searchOverpass(sector: string, geo: { lat: number; lon: number; bbox: number[] }): Promise<any[]> {
  const tags = SECTOR_OVERPASS[sector];
  if (!tags || !tags.length) return [];

  // Use a smaller search radius (~5km around center) to avoid Overpass timeouts on big cities
  const radius = 5000;
  const around = `(around:${radius},${geo.lat},${geo.lon})`;

  // Build Overpass QL: query nodes & ways with name + sector tags
  const tagQueries = tags.slice(0, 2).map(t => {
    if (t.includes("~")) {
      const [key, val] = t.split("~");
      return `node[${key}~${val}]["name"]${around};\nway[${key}~${val}]["name"]${around};`;
    }
    // Simple tag existence (e.g. "cuisine", "sport")
    return `node["${t}"]["name"]${around};\nway["${t}"]["name"]${around};`;
  }).join("\n");

  const query = `[out:json][timeout:10];\n(\n${tagQueries}\n);\nout center tags 100;`;

  try {
    const resp = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    });
    if (!resp.ok) {
      console.error(`Overpass error: ${resp.status}`);
      return [];
    }
    const data = await resp.json();
    const results: any[] = [];

    for (const el of data.elements || []) {
      const tags = el.tags || {};
      const name = tags.name;
      if (!name || name.length < 2) continue;

      const lat = el.lat || el.center?.lat;
      const lon = el.lon || el.center?.lon;

      results.push({
        source: "overpass",
        name,
        full_address: [tags["addr:street"], tags["addr:housenumber"], tags["addr:postcode"], tags["addr:city"]].filter(Boolean).join(", ") || "",
        city: tags["addr:city"] || tags["addr:municipality"] || "",
        zone: tags["addr:suburb"] || tags["addr:neighbourhood"] || tags["addr:quarter"] || "",
        lat, lon,
        phone: tags.phone || tags["contact:phone"] || tags["phone:mobile"] || null,
        website: tags.website || tags["contact:website"] || tags.url || null,
        email: tags.email || tags["contact:email"] || null,
        opening_hours: tags.opening_hours || null,
        instagram: tags["contact:instagram"] || null,
        facebook: tags["contact:facebook"] || null,
        cuisine: tags.cuisine || null,
        brand: tags.brand || null,
        operator: tags.operator || null,
        osm_type: tags.amenity || tags.shop || tags.craft || tags.office || tags.tourism || tags.leisure || "",
        google_maps_url: lat && lon ? `https://www.google.com/maps/search/?api=1&query=${lat},${lon}` : null,
        // Enrich with social media search links
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

/* ═══════════════════════════════════════════════════════
   SOURCE 2: NOMINATIM — backup search for wider coverage
   ═══════════════════════════════════════════════════════ */
async function searchNominatim(city: string, sector: string, userQuery: string, geo: { lat: number; lon: number; bbox: number[] }): Promise<any[]> {
  const terms = SECTOR_TERMS[sector] || [sector];
  const results: any[] = [];
  const seen = new Set<string>();

  const [south, north, west, east] = geo.bbox.length >= 4
    ? geo.bbox
    : [geo.lat - 0.08, geo.lat + 0.08, geo.lon - 0.08, geo.lon + 0.08];
  const viewbox = `${west},${north},${east},${south}`;

  const searches: string[] = [];
  if (userQuery) searches.push(`${userQuery} ${city}`);
  searches.push(...terms.slice(0, 4).map(t => `${t} ${city}`));

  const fetchOne = async (term: string) => {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(term)}&format=json&addressdetails=1&extratags=1&limit=40&viewbox=${viewbox}&bounded=1`,
        { headers: { "User-Agent": "EmpireAI-LeadScout/4.0 (info@empireaigroup.com)" } }
      );
      if (!resp.ok) return [];
      return await resp.json();
    } catch { return []; }
  };

  // Parallel batches of 3
  for (let i = 0; i < searches.length; i += 3) {
    const batch = searches.slice(i, i + 3);
    const allData = await Promise.all(batch.map(s => fetchOne(s)));
    for (const data of allData) {
      for (const item of data) {
        if (["boundary", "place", "highway", "railway", "waterway", "natural", "landuse", "residential", "administrative"].includes(item.class)) continue;
        const name = item.display_name?.split(",")[0]?.trim() || "";
        if (!name || name.length < 3) continue;
        const key = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25);
        if (seen.has(key)) continue;
        seen.add(key);

        const tags = item.extratags || {};
        const addr = item.address || {};
        results.push({
          source: "nominatim",
          name,
          full_address: item.display_name || "",
          city: addr.city || addr.town || addr.village || addr.municipality || city,
          zone: addr.suburb || addr.neighbourhood || addr.quarter || "",
          lat: parseFloat(item.lat), lon: parseFloat(item.lon),
          phone: tags.phone || tags["contact:phone"] || null,
          website: tags.website || tags["contact:website"] || null,
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
    if (results.length >= 40) break;
    if (i + 3 < searches.length) await new Promise(r => setTimeout(r, 400));
  }
  return results;
}

/* ═══════════════════════════════════════════════════════
   SOURCE 3: GOOGLE PLACES (premium, optional)
   ═══════════════════════════════════════════════════════ */
async function searchGooglePlaces(query: string, city: string, sector: string): Promise<any[]> {
  const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!apiKey) return [];
  const sectorKw: Record<string, string> = {
    food: "ristorante OR pizzeria OR trattoria OR bar OR cafe",
    beauty: "parrucchiere OR centro estetico OR nail salon",
    ncc: "NCC OR taxi OR transfer",
    healthcare: "dentista OR medico OR clinica OR farmacia",
    retail: "negozio OR boutique OR abbigliamento",
    fitness: "palestra OR gym OR crossfit",
    hospitality: "hotel OR B&B OR albergo",
    beach: "stabilimento balneare OR lido",
    plumber: "idraulico OR plumber",
    electrician: "elettricista OR electrician",
    veterinary: "veterinario OR pet clinic",
    tattoo: "tattoo studio",
    photography: "fotografo OR photo studio",
    events: "event venue OR catering",
    construction: "impresa edile OR construction",
    gardening: "vivaio OR garden center OR florist",
    legal: "avvocato OR studio legale",
    accounting: "commercialista OR accountant",
  };
  const searchText = query || (sectorKw[sector] || sector);
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
    if (!resp.ok) { console.error("Google Places error:", resp.status); return []; }
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

/* ═══════════════════════════════════════════════════════
   DEDUPLICATION & MERGE (Google > Overpass > Nominatim)
   ═══════════════════════════════════════════════════════ */
function mergeAndDeduplicate(google: any[], overpass: any[], nominatim: any[]): any[] {
  // Priority: Google (richest) → Overpass (precise) → Nominatim (widest)
  const all = [...google, ...overpass, ...nominatim];
  const seen = new Map<string, any>();

  for (const r of all) {
    const key = r.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
    if (!key || key.length < 3) continue;

    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, r);
    } else {
      // Merge: fill missing fields from new source
      if (!existing.phone && r.phone) existing.phone = r.phone;
      if (!existing.website && r.website) existing.website = r.website;
      if (!existing.email && r.email) existing.email = r.email;
      if (!existing.instagram && r.instagram) existing.instagram = r.instagram;
      if (!existing.facebook && r.facebook) existing.facebook = r.facebook;
      if (!existing.opening_hours && r.opening_hours) existing.opening_hours = r.opening_hours;
      if (!existing.google_rating && r.google_rating) existing.google_rating = r.google_rating;
      if (!existing.google_reviews && r.google_reviews) existing.google_reviews = r.google_reviews;
      if (!existing.full_address && r.full_address) existing.full_address = r.full_address;
      if (!existing.zone && r.zone) existing.zone = r.zone;
    }
  }

  return Array.from(seen.values());
}

/* ═══════════════════════════════════════════════════════
   MAIN HANDLER
   ═══════════════════════════════════════════════════════ */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, city, sector, use_google } = await req.json();
    if (!city && !query) {
      return new Response(JSON.stringify({ success: false, error: "Inserisci una città o una query di ricerca" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const searchCity = (city || "").trim();
    const searchQuery = (query || "").trim();
    const searchSector = sector || "food";

    // 1. Geocode city
    const geo = await geocodeCity(searchCity || searchQuery);
    if (!geo) {
      return new Response(JSON.stringify({ success: false, error: `Città "${searchCity || searchQuery}" non trovata. Controlla l'ortografia.`, results: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 2. Run ALL sources in parallel — Overpass with timeout fallback
    const overpassWithTimeout = Promise.race([
      searchOverpass(searchSector, geo),
      new Promise<any[]>(r => setTimeout(() => r([]), 8000)), // 8s timeout
    ]);

    const [overpassResults, nominatimResults, googleResults] = await Promise.all([
      overpassWithTimeout,
      searchNominatim(searchCity, searchSector, searchQuery, geo),
      use_google ? searchGooglePlaces(searchQuery, searchCity, searchSector) : Promise.resolve([]),
    ]);

    console.log(`Sources: Overpass=${overpassResults.length} Nominatim=${nominatimResults.length} Google=${googleResults.length}`);

    // 3. Merge + deduplicate with data enrichment
    const merged = mergeAndDeduplicate(googleResults, overpassResults, nominatimResults);

    const hasGoogleKey = !!Deno.env.get("GOOGLE_PLACES_API_KEY");
    console.log(`Lead search: "${searchCity}" "${searchSector}" → ${merged.length} results`);

    return new Response(JSON.stringify({
      success: true,
      results: merged,
      sources: {
        overpass: overpassResults.length,
        nominatim: nominatimResults.length,
        google: googleResults.length,
        total_merged: merged.length,
      },
      has_google_key: hasGoogleKey,
      tip: !hasGoogleKey && merged.length < 10
        ? "Aggiungi GOOGLE_PLACES_API_KEY per rating, recensioni e telefoni verificati da Google."
        : undefined,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("lead-search error:", e);
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
