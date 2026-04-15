import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ─── Overpass amenity/shop tags per sector ─── */
const SECTOR_OVERPASS: Record<string, { amenity?: string[]; shop?: string[]; tourism?: string[]; leisure?: string[]; craft?: string[]; office?: string[]; healthcare?: string[] }> = {
  food: { amenity: ["restaurant", "cafe", "bar", "fast_food", "pub", "ice_cream", "biergarten"] },
  beauty: { shop: ["beauty", "hairdresser", "cosmetics"], amenity: ["beauty", "hairdresser"] },
  ncc: { amenity: ["taxi", "car_rental"] },
  healthcare: { amenity: ["dentist", "doctors", "clinic", "pharmacy", "hospital"], healthcare: ["doctor", "dentist", "physiotherapist", "optometrist"] },
  retail: { shop: ["clothes", "shoes", "jewelry", "boutique", "department_store", "bag", "fashion_accessories", "optician", "gift", "books"] },
  fitness: { leisure: ["fitness_centre", "sports_centre", "swimming_pool"], amenity: ["gym"] },
  hospitality: { tourism: ["hotel", "guest_house", "hostel", "motel", "apartment"] },
  beach: { leisure: ["beach_resort"], amenity: ["beach_resort"], tourism: ["beach_resort"] },
  plumber: { craft: ["plumber"] },
  electrician: { craft: ["electrician"] },
  veterinary: { amenity: ["veterinary"] },
  tattoo: { shop: ["tattoo"] },
  photography: { craft: ["photographer"], shop: ["photo"] },
  events: { amenity: ["events_venue", "conference_centre"], office: ["event_management"] },
  construction: { craft: ["builder", "carpenter", "roofer"], office: ["construction_company"] },
  gardening: { shop: ["garden_centre", "florist"] },
  legal: { office: ["lawyer", "notary"] },
  accounting: { office: ["accountant", "tax_advisor"] },
  agriturismo: { tourism: ["farm", "agriturismo"] },
  cleaning: { shop: ["laundry", "dry_cleaning"] },
  garage: { shop: ["car_repair", "car_parts"], amenity: ["car_wash"] },
};

/* ─── Geocode city → lat/lon using Nominatim ─── */
async function geocodeCity(city: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    const resp = await fetch(url, { headers: { "User-Agent": "EmpireAI-LeadScout/3.0 (info@empireaigroup.com)" } });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch { return null; }
}

/* ─── Build Overpass QL query ─── */
function buildOverpassQuery(lat: number, lon: number, sector: string, radiusMeters: number, nameFilter?: string): string {
  const tags = SECTOR_OVERPASS[sector] || SECTOR_OVERPASS.food;
  const around = `(around:${radiusMeters},${lat},${lon})`;
  const lines: string[] = [];

  // Build compact regex filter per tag type to reduce query complexity
  for (const [tagKey, values] of Object.entries(tags)) {
    const regex = (values as string[]).join("|");
    if (nameFilter) {
      lines.push(`nwr["${tagKey}"~"^(${regex})$"]["name"~"${nameFilter}",i]${around};`);
    } else {
      lines.push(`nwr["${tagKey}"~"^(${regex})$"]["name"]${around};`);
    }
  }

  return `[out:json][timeout:20];(\n${lines.join("\n")}\n);out center tags 60;`;
}

/* ─── Query Overpass API ─── */
async function searchOverpass(lat: number, lon: number, sector: string, query?: string): Promise<any[]> {
  const results: any[] = [];
  const seen = new Set<string>();

  // Two passes: first with name filter if query provided, then broader
  const queries: string[] = [];
  if (query && query.length > 2) {
    queries.push(buildOverpassQuery(lat, lon, sector, 15000, query));
  }
  queries.push(buildOverpassQuery(lat, lon, sector, 10000));

  for (const overpassQL of queries) {
    try {
      const resp = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "EmpireAI-LeadScout/3.0" },
        body: `data=${encodeURIComponent(overpassQL)}`,
      });
      if (!resp.ok) { console.error("Overpass error:", resp.status); continue; }
      const data = await resp.json();

      for (const el of data.elements || []) {
        const tags = el.tags || {};
        const name = tags.name || tags["name:en"] || "";
        if (!name || name.length < 2) continue;

        const key = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25);
        if (seen.has(key)) continue;
        seen.add(key);

        const elLat = el.lat ?? el.center?.lat;
        const elLon = el.lon ?? el.center?.lon;

        // Build full address from addr tags
        const addrParts = [tags["addr:street"], tags["addr:housenumber"], tags["addr:city"], tags["addr:postcode"]].filter(Boolean);
        const fullAddress = addrParts.length > 0 ? addrParts.join(", ") : (tags["addr:full"] || "");

        results.push({
          source: "openstreetmap",
          name,
          full_address: fullAddress || `${name} — ${tags["addr:city"] || ""}`,
          city: tags["addr:city"] || tags["addr:municipality"] || "",
          zone: tags["addr:suburb"] || tags["addr:neighbourhood"] || tags["addr:quarter"] || "",
          lat: elLat,
          lon: elLon,
          phone: tags.phone || tags["contact:phone"] || null,
          website: tags.website || tags["contact:website"] || null,
          email: tags.email || tags["contact:email"] || null,
          opening_hours: tags.opening_hours || null,
          osm_type: tags.amenity || tags.shop || tags.tourism || tags.leisure || tags.craft || tags.office || tags.healthcare || "",
          instagram: tags["contact:instagram"] || null,
          facebook: tags["contact:facebook"] || null,
          cuisine: tags.cuisine || null,
          brand: tags.brand || null,
          operator: tags.operator || null,
          google_maps_url: elLat && elLon ? `https://www.google.com/maps/search/?api=1&query=${elLat},${elLon}` : null,
        });
      }
    } catch (e) { console.error("Overpass fetch error:", e); }

    // If first query with name filter already got good results, skip broader search
    if (results.length >= 30) break;
  }

  return results;
}

/* ─── Google Places API (premium — best data) ─── */
async function searchGooglePlaces(query: string, city: string, sector: string): Promise<any[]> {
  const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!apiKey) return [];
  const sectorKw: Record<string, string> = {
    food: "ristorante OR pizzeria OR trattoria OR bar OR cafe",
    beauty: "parrucchiere OR centro estetico OR nail salon",
    ncc: "noleggio con conducente OR NCC OR taxi",
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
    const geo = await geocodeCity(searchCity || searchQuery);
    if (!geo) {
      return new Response(JSON.stringify({ success: false, error: `Città "${searchCity || searchQuery}" non trovata. Controlla l'ortografia.`, results: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 2. Overpass API search (precise POI data from OpenStreetMap)
    const osmResults = await searchOverpass(geo.lat, geo.lon, searchSector, searchQuery || undefined);
    console.log(`Overpass: ${osmResults.length} for "${searchCity}" / "${searchSector}"`);

    // 3. Google Places (premium)
    let googleResults: any[] = [];
    if (use_google) {
      googleResults = await searchGooglePlaces(searchQuery, searchCity, searchSector);
      console.log(`Google: ${googleResults.length}`);
    }

    // Merge + deduplicate (Google first for better data)
    const all = [...googleResults, ...osmResults];
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
      sources: { overpass: osmResults.length, google: googleResults.length },
      has_google_key: hasGoogleKey,
      tip: !hasGoogleKey && deduped.length < 5 ? "Aggiungi GOOGLE_PLACES_API_KEY per risultati più precisi con rating, telefono e sito web reali." : undefined,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("lead-search error:", e);
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
