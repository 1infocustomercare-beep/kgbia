import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ─── Sector-specific search terms (localized for precision) ─── */
const SECTOR_TERMS: Record<string, string[]> = {
  food: ["ristorante", "pizzeria", "trattoria", "bar caffetteria", "osteria", "pub", "sushi", "gelateria", "pasticceria", "bistrot", "hamburger", "fast food", "enoteca", "restaurant", "cafe"],
  beauty: ["parrucchiere", "salone bellezza", "centro estetico", "nail salon", "barbiere", "spa", "beauty salon", "hairdresser"],
  ncc: ["NCC noleggio conducente", "taxi", "transfer aeroporto", "limousine service", "car rental", "autonoleggio"],
  healthcare: ["dentista", "studio medico", "clinica", "farmacia", "fisioterapia", "osteopata", "ambulatorio", "dentist", "doctor clinic", "pharmacy"],
  retail: ["negozio abbigliamento", "boutique", "gioielleria", "ottica", "profumeria", "clothing store", "jewelry shop"],
  fitness: ["palestra", "gym", "crossfit", "yoga studio", "piscina", "padel", "fitness center", "swimming pool"],
  hospitality: ["hotel", "bed and breakfast", "albergo", "hostel", "resort", "guest house", "agriturismo"],
  beach: ["stabilimento balneare", "lido", "beach club"],
  plumber: ["idraulico", "plumber", "termoidraulica"],
  electrician: ["elettricista", "electrician", "impianti elettrici"],
  veterinary: ["veterinario", "clinica veterinaria", "pet clinic", "toelettatura"],
  tattoo: ["tattoo studio", "tatuaggi", "piercing studio"],
  photography: ["fotografo", "studio fotografico", "photo studio", "photographer"],
  events: ["location eventi", "catering", "wedding planner", "event venue"],
  construction: ["impresa edile", "ristrutturazioni", "construction company", "builder"],
  gardening: ["vivaio", "garden center", "fiorista", "florist", "giardiniere"],
  legal: ["avvocato", "studio legale", "notaio", "lawyer", "law firm"],
  accounting: ["commercialista", "studio commerciale", "consulente fiscale", "accountant", "tax advisor"],
  agriturismo: ["agriturismo", "fattoria didattica", "cantina vini"],
  cleaning: ["impresa pulizie", "lavanderia", "laundry", "cleaning service"],
  garage: ["officina meccanica", "autofficina", "gommista", "car repair", "autolavaggio"],
};

/* ─── Geocode city → get lat/lon + bbox ─── */
async function geocodeCity(city: string): Promise<{ lat: number; lon: number; bbox: number[] } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    const resp = await fetch(url, { headers: { "User-Agent": "EmpireAI-LeadScout/3.0 (info@empireaigroup.com)" } });
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

/* ─── Nominatim POI search with viewbox constraint ─── */
async function searchNominatim(city: string, sector: string, userQuery: string, geo: { lat: number; lon: number; bbox: number[] }): Promise<any[]> {
  const terms = SECTOR_TERMS[sector] || [sector];
  const results: any[] = [];
  const seen = new Set<string>();

  // Viewbox from city bbox
  const [south, north, west, east] = geo.bbox.length >= 4
    ? geo.bbox
    : [geo.lat - 0.05, geo.lat + 0.05, geo.lon - 0.05, geo.lon + 0.05];
  const viewbox = `${west},${north},${east},${south}`;

  // Build search terms: user query first, then sector-specific terms
  const searches: string[] = [];
  if (userQuery) searches.push(`${userQuery} ${city}`);
  // Add city-qualified sector terms for precision
  searches.push(...terms.slice(0, 5).map(t => `${t} ${city}`));

  const fetchOne = async (term: string) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(term)}&format=json&addressdetails=1&extratags=1&limit=40&viewbox=${viewbox}&bounded=1`;
      const resp = await fetch(url, { headers: { "User-Agent": "EmpireAI-LeadScout/3.0 (info@empireaigroup.com)" } });
      if (!resp.ok) return [];
      return await resp.json();
    } catch { return []; }
  };

  // Run max 4 parallel searches to respect Nominatim rate limits
  const batches = [];
  for (let i = 0; i < searches.length; i += 4) {
    batches.push(searches.slice(i, i + 4));
  }

  for (const batch of batches) {
    const allData = await Promise.all(batch.map(s => fetchOne(s)));

    for (const data of allData) {
      for (const item of data) {
        // Filter out non-POI results
        if (["boundary", "place", "highway", "railway", "waterway", "natural", "landuse", "residential", "administrative"].includes(item.class)) continue;
        const name = item.display_name?.split(",")[0]?.trim() || "";
        if (!name || name.length < 3) continue;

        const key = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25);
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
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          phone: tags.phone || tags["contact:phone"] || null,
          website: tags.website || tags["contact:website"] || null,
          email: tags.email || tags["contact:email"] || null,
          opening_hours: tags.opening_hours || null,
          osm_type: item.type || item.class,
          instagram: tags["contact:instagram"] || null,
          facebook: tags["contact:facebook"] || null,
          cuisine: tags.cuisine || null,
          google_maps_url: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`,
        });
      }
    }

    // If we already have plenty of results, stop early
    if (results.length >= 50) break;

    // Small delay between batches to respect rate limits
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  return results;
}

/* ─── Google Places API (premium) ─── */
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
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.location,places.types,places.businessStatus",
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
        phone: p.nationalPhoneNumber || null,
        website: p.websiteUri || null,
        email: null,
        google_rating: p.rating || 0,
        google_reviews: p.userRatingCount || 0,
        google_maps_url: p.googleMapsUri || null,
        business_status: p.businessStatus || "OPERATIONAL",
        types: p.types || [],
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

    // 2. Nominatim POI search (free, unlimited, viewbox-constrained)
    const osmResults = await searchNominatim(searchCity, searchSector, searchQuery, geo);
    console.log(`Nominatim: ${osmResults.length} for "${searchCity}" / "${searchSector}"`);

    // 3. Google Places (premium, if key present)
    let googleResults: any[] = [];
    if (use_google) {
      googleResults = await searchGooglePlaces(searchQuery, searchCity, searchSector);
      console.log(`Google: ${googleResults.length}`);
    }

    // Merge + deduplicate (Google first for richer data)
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
