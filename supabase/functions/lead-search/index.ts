import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ═══════════════════════════════════════════════════════
   SECTOR SEARCH TERMS (multi-language for global coverage)
   ═══════════════════════════════════════════════════════ */
const SECTOR_TERMS: Record<string, string[]> = {
  food: ["ristorante", "pizzeria", "trattoria", "osteria", "bar", "pub", "bistrot", "sushi", "gelateria", "pasticceria", "enoteca", "restaurant", "cafe", "bakery", "fast food"],
  beauty: ["parrucchiere", "centro estetico", "salone bellezza", "nail salon", "barbiere", "spa", "beauty salon", "hairdresser", "barber shop"],
  ncc: ["NCC noleggio conducente", "taxi", "transfer aeroporto", "limousine service", "autonoleggio", "car rental"],
  healthcare: ["dentista", "studio medico", "clinica", "farmacia", "fisioterapia", "ambulatorio", "dentist", "pharmacy", "doctor clinic"],
  retail: ["negozio abbigliamento", "boutique", "gioielleria", "ottica", "profumeria", "clothing store", "jewelry shop", "shoe store"],
  fitness: ["palestra", "gym", "crossfit", "yoga studio", "piscina", "padel", "fitness center", "swimming pool", "sport center"],
  hospitality: ["hotel", "bed and breakfast", "albergo", "hostel", "resort", "agriturismo", "guest house"],
  beach: ["stabilimento balneare", "lido", "beach club", "beach resort"],
  plumber: ["idraulico", "plumber", "termoidraulica"],
  electrician: ["elettricista", "electrician", "impianti elettrici"],
  veterinary: ["veterinario", "clinica veterinaria", "pet clinic", "toelettatura"],
  tattoo: ["tattoo studio", "tatuaggi", "piercing studio"],
  photography: ["fotografo", "studio fotografico", "photographer", "photo studio"],
  events: ["location eventi", "catering", "wedding planner", "event venue", "banqueting"],
  construction: ["impresa edile", "ristrutturazioni", "construction company", "builder"],
  gardening: ["vivaio", "garden center", "fiorista", "florist", "giardiniere"],
  legal: ["avvocato", "studio legale", "notaio", "lawyer", "law firm"],
  accounting: ["commercialista", "consulente fiscale", "accountant", "tax advisor"],
  agriturismo: ["agriturismo", "fattoria didattica", "cantina vini", "wine cellar"],
  cleaning: ["impresa pulizie", "lavanderia", "laundry", "cleaning service", "tintoria"],
  garage: ["officina meccanica", "autofficina", "gommista", "car repair", "autolavaggio", "car wash"],
};

/* ═══════════════════════════════════════════════════════
   GEOCODE: city → lat/lon/bbox
   ═══════════════════════════════════════════════════════ */
async function geocodeCity(city: string): Promise<{ lat: number; lon: number; bbox: number[] } | null> {
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { "User-Agent": "EmpireAI-LeadScout/5.0 (info@empireaigroup.com)" } }
    );
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), bbox: data[0].boundingbox?.map(Number) || [] };
  } catch { return null; }
}

/* ═══════════════════════════════════════════════════════
   SOURCE 1: PHOTON (Komoot) — fast geocoding search
   No rate limits, extremely fast, returns real businesses
   ═══════════════════════════════════════════════════════ */
async function searchPhoton(city: string, sector: string, geo: { lat: number; lon: number }): Promise<any[]> {
  const terms = SECTOR_TERMS[sector] || [sector];
  const results: any[] = [];
  const seen = new Set<string>();

  // Run searches for top 4 terms in parallel
  const searches = terms.slice(0, 4).map(term => `${term} ${city}`);

  const fetchPhoton = async (q: string) => {
    try {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=${geo.lat}&lon=${geo.lon}&limit=30`;
      const resp = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!resp.ok) return [];
      const data = await resp.json();
      return data.features || [];
    } catch { return []; }
  };

  // Run all in parallel (Photon has no rate limits)
  const allData = await Promise.all(searches.map(s => fetchPhoton(s)));

  for (const features of allData) {
    for (const f of features) {
      const props = f.properties || {};
      const name = props.name;
      if (!name || name.length < 3) continue;
      // Skip non-business results
      if (["city", "district", "state", "country", "street", "locality", "county"].includes(props.osm_value)) continue;
      if (["boundary", "place", "highway", "railway", "waterway", "natural", "landuse"].includes(props.osm_key)) continue;

      const key = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25);
      if (seen.has(key)) continue;
      seen.add(key);

      const coords = f.geometry?.coordinates || [];
      const lon = coords[0];
      const lat = coords[1];

      results.push({
        source: "photon",
        name,
        full_address: [props.street, props.housenumber, props.postcode, props.city || props.county].filter(Boolean).join(", "),
        city: props.city || props.county || city,
        zone: props.district || props.locality || "",
        lat, lon,
        phone: null, website: null, email: null,
        opening_hours: null,
        instagram: null, facebook: null,
        cuisine: null,
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

/* ═══════════════════════════════════════════════════════
   SOURCE 2: NOMINATIM — precise viewbox-bounded POI search
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
  searches.push(...terms.slice(0, 6).map(t => `${t} ${city}`));

  const fetchOne = async (term: string) => {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(term)}&format=json&addressdetails=1&extratags=1&limit=40&viewbox=${viewbox}&bounded=1`,
        { headers: { "User-Agent": "EmpireAI-LeadScout/5.0 (info@empireaigroup.com)" }, signal: AbortSignal.timeout(8000) }
      );
      if (!resp.ok) return [];
      return await resp.json();
    } catch { return []; }
  };

  // Batches of 2 (Nominatim rate limit: 1 req/sec, but we push 2)
  for (let i = 0; i < searches.length; i += 2) {
    const batch = searches.slice(i, i + 2);
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
    if (results.length >= 60) break;
    if (i + 2 < searches.length) await new Promise(r => setTimeout(r, 500));
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
   MERGE + DEDUPLICATE (priority: Google > Nominatim > Photon)
   Cross-source data enrichment
   ═══════════════════════════════════════════════════════ */
function mergeAndDeduplicate(google: any[], nominatim: any[], photon: any[]): any[] {
  const all = [...google, ...nominatim, ...photon];
  const seen = new Map<string, any>();

  for (const r of all) {
    const key = r.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
    if (!key || key.length < 3) continue;

    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, r);
    } else {
      // Cross-source enrichment: fill missing fields
      for (const field of ["phone", "website", "email", "instagram", "facebook", "opening_hours", "cuisine", "full_address", "zone"]) {
        if (!existing[field] && r[field]) existing[field] = r[field];
      }
      if (!existing.google_rating && r.google_rating) existing.google_rating = r.google_rating;
      if (!existing.google_reviews && r.google_reviews) existing.google_reviews = r.google_reviews;
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

    // 2. Run ALL sources in parallel for maximum coverage + speed
    const [photonResults, nominatimResults, googleResults] = await Promise.all([
      searchPhoton(searchCity, searchSector, geo),
      searchNominatim(searchCity, searchSector, searchQuery, geo),
      use_google ? searchGooglePlaces(searchQuery, searchCity, searchSector) : Promise.resolve([]),
    ]);

    console.log(`Sources: Photon=${photonResults.length} Nominatim=${nominatimResults.length} Google=${googleResults.length}`);

    // 3. Merge + deduplicate with cross-source enrichment
    const merged = mergeAndDeduplicate(googleResults, nominatimResults, photonResults);

    const hasGoogleKey = !!Deno.env.get("GOOGLE_PLACES_API_KEY");
    console.log(`Lead search: "${searchCity}" "${searchSector}" → ${merged.length} unique results`);

    return new Response(JSON.stringify({
      success: true,
      results: merged,
      sources: {
        photon: photonResults.length,
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
