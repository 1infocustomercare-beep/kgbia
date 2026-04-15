import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SECTOR_KEYWORDS: Record<string, string[]> = {
  food: ["restaurant", "pizzeria", "trattoria", "bar", "cafe", "osteria", "pub", "bakery", "gelateria"],
  beauty: ["hairdresser", "beauty salon", "barber", "nail salon", "spa"],
  ncc: ["taxi", "car rental", "limousine", "transfer"],
  healthcare: ["dentist", "doctor", "clinic", "pharmacy", "physiotherapy", "hospital"],
  retail: ["shop", "boutique", "clothing store", "jewelry", "store"],
  fitness: ["gym", "fitness", "crossfit", "yoga", "swimming pool", "padel"],
  hospitality: ["hotel", "bed and breakfast", "hostel", "resort", "guest house"],
  beach: ["beach club", "lido", "stabilimento balneare"],
  plumber: ["plumber", "idraulico"],
  electrician: ["electrician", "elettricista"],
  veterinary: ["veterinary", "pet clinic", "veterinario"],
  tattoo: ["tattoo studio", "tattoo", "piercing"],
  photography: ["photographer", "photo studio", "fotografo"],
  events: ["event venue", "catering", "wedding planner"],
  construction: ["construction company", "builder", "impresa edile"],
  gardening: ["garden center", "florist", "nursery"],
  legal: ["lawyer", "law firm", "avvocato", "notary"],
  accounting: ["accountant", "tax advisor", "commercialista"],
};

/* ─── Geocode city to get coordinates ─── */
async function geocodeCity(city: string): Promise<{ lat: number; lon: number; bbox: number[] } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    const resp = await fetch(url, { headers: { "User-Agent": "EmpireAI-LeadScout/2.0 (info@empireaigroup.com)" } });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.length) return null;
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      bbox: data[0].boundingbox?.map(Number) || [],
    };
  } catch { return null; }
}

/* ─── Nominatim POI search with viewbox ─── */
async function searchNominatimPOI(city: string, sector: string, userQuery: string, geo: { lat: number; lon: number; bbox: number[] }): Promise<any[]> {
  const keywords = SECTOR_KEYWORDS[sector] || [sector];
  const results: any[] = [];
  const seen = new Set<string>();

  // Build viewbox from city bbox (south,north,west,east → west,north,east,south for Nominatim)
  const [south, north, west, east] = geo.bbox.length >= 4 ? geo.bbox : [geo.lat - 0.1, geo.lat + 0.1, geo.lon - 0.1, geo.lon + 0.1];
  const viewbox = `${west},${north},${east},${south}`;

  // Run 2-3 parallel searches with different keywords
  const searches: string[] = [];
  if (userQuery) searches.push(userQuery);
  searches.push(...keywords.slice(0, 3));

  const fetchOne = async (term: string) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(term)}&format=json&addressdetails=1&extratags=1&limit=20&viewbox=${viewbox}&bounded=1`;
      const resp = await fetch(url, { headers: { "User-Agent": "EmpireAI-LeadScout/2.0 (info@empireaigroup.com)" } });
      if (!resp.ok) return [];
      return await resp.json();
    } catch { return []; }
  };

  const allData = await Promise.all(searches.map(s => fetchOne(s)));

  for (const data of allData) {
    for (const item of data) {
      if (["boundary", "place", "highway", "railway", "waterway", "natural", "landuse", "residential"].includes(item.class)) continue;
      const name = item.display_name?.split(",")[0]?.trim() || "";
      if (!name || name.length < 2) continue;
      const key = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
      if (seen.has(key)) continue;
      seen.add(key);

      const tags = item.extratags || {};
      const addr = item.address || {};
      results.push({
        source: "openstreetmap",
        name,
        full_address: item.display_name || "",
        city: addr.city || addr.town || addr.village || addr.municipality || city,
        zone: addr.suburb || addr.neighbourhood || addr.quarter || "",
        lat: parseFloat(item.lat), lon: parseFloat(item.lon),
        phone: tags.phone || tags["contact:phone"] || null,
        website: tags.website || tags["contact:website"] || null,
        email: tags.email || tags["contact:email"] || null,
        opening_hours: tags.opening_hours || null,
        osm_type: item.type || item.class,
        instagram: tags["contact:instagram"] || null,
        google_maps_url: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`,
      });
    }
  }
  return results;
}

/* ─── Google Places API (premium — best data) ─── */
async function searchGooglePlaces(query: string, city: string, sector: string): Promise<any[]> {
  const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!apiKey) return [];
  const sectorKw: Record<string, string> = {
    food: "ristorante OR pizzeria OR trattoria OR bar",
    beauty: "parrucchiere OR centro estetico",
    ncc: "noleggio con conducente OR NCC OR taxi",
    healthcare: "dentista OR medico OR clinica",
    retail: "negozio OR boutique", fitness: "palestra OR gym",
    hospitality: "hotel OR B&B OR albergo",
    beach: "stabilimento balneare OR lido",
  };
  const searchText = query || (sectorKw[sector] || sector);
  const results: any[] = [];
  try {
    const resp = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.location,places.types,places.businessStatus",
      },
      body: JSON.stringify({ textQuery: `${searchText} ${city}`, languageCode: "it", maxResultCount: 20 }),
    });
    if (!resp.ok) { console.error("Google Places error:", resp.status); return []; }
    const data = await resp.json();
    for (const p of data.places || []) {
      results.push({
        source: "google_places", name: p.displayName?.text || "N/A",
        full_address: p.formattedAddress || "", city, zone: "",
        lat: p.location?.latitude, lon: p.location?.longitude,
        phone: p.nationalPhoneNumber || null, website: p.websiteUri || null, email: null,
        google_rating: p.rating || 0, google_reviews: p.userRatingCount || 0,
        google_maps_url: p.googleMapsUri || null,
        business_status: p.businessStatus || "OPERATIONAL", types: p.types || [],
      });
    }
  } catch (e) { console.error("Google Places error:", e); }
  return results;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, city, sector, use_google } = await req.json();
    if (!city && !query) {
      return new Response(JSON.stringify({ success: false, error: "City or query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const searchCity = (city || "").trim();
    const searchQuery = (query || "").trim();
    const searchSector = sector || "food";

    // 1. Geocode city
    const geo = await geocodeCity(searchCity);

    // 2. Nominatim POI search (with viewbox)
    let osmResults: any[] = [];
    if (geo) {
      osmResults = await searchNominatimPOI(searchCity, searchSector, searchQuery, geo);
    }
    console.log(`OSM: ${osmResults.length} for "${searchCity}" / "${searchSector}"`);

    // 3. Google Places (premium)
    let googleResults: any[] = [];
    if (use_google) {
      googleResults = await searchGooglePlaces(searchQuery, searchCity, searchSector);
      console.log(`Google: ${googleResults.length}`);
    }

    // Merge + deduplicate
    const all = [...googleResults, ...osmResults]; // Google first (better data)
    const seen = new Set<string>();
    const deduped = all.filter(r => {
      const key = r.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const hasGoogleKey = !!Deno.env.get("GOOGLE_PLACES_API_KEY");
    console.log(`Lead search: "${searchCity}" "${searchSector}" → ${deduped.length} results (osm:${osmResults.length} google:${googleResults.length})`);

    return new Response(JSON.stringify({
      success: true,
      results: deduped,
      sources: { nominatim: osmResults.length, google: googleResults.length },
      has_google_key: hasGoogleKey,
      tip: !hasGoogleKey && deduped.length < 5 ? "Aggiungi GOOGLE_PLACES_API_KEY per risultati più precisi con rating, telefono e sito web reali." : undefined,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("lead-search error:", e);
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
