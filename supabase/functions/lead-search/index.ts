import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SECTOR_KEYWORDS: Record<string, string[]> = {
  food: ["ristorante", "pizzeria", "trattoria", "bar", "caffè", "osteria", "pub", "bistrot", "pasticceria", "gelateria", "bakery", "restaurant", "cafe"],
  beauty: ["parrucchiere", "salone", "estetica", "beauty", "hair salon", "barber", "nail"],
  ncc: ["noleggio", "taxi", "transfer", "limousine", "car rental"],
  healthcare: ["dentista", "medico", "clinica", "farmacia", "fisioterapia", "ospedale", "dentist", "doctor", "clinic", "pharmacy"],
  retail: ["negozio", "boutique", "abbigliamento", "scarpe", "gioielleria", "shop", "store", "clothing"],
  fitness: ["palestra", "gym", "crossfit", "yoga", "pilates", "fitness", "piscina", "padel"],
  hospitality: ["hotel", "albergo", "B&B", "hostel", "resort", "pensione", "bed and breakfast"],
  beach: ["stabilimento balneare", "lido", "beach club", "bagno"],
  plumber: ["idraulico", "plumber", "termoidraulica"],
  electrician: ["elettricista", "electrician", "impianti elettrici"],
  veterinary: ["veterinario", "clinica veterinaria", "pet", "animali"],
  tattoo: ["tatuaggio", "tattoo", "piercing"],
  photography: ["fotografo", "studio fotografico", "photography"],
  events: ["eventi", "catering", "wedding planner", "location eventi"],
  construction: ["impresa edile", "ristrutturazione", "costruzioni"],
  gardening: ["giardiniere", "vivaio", "garden", "florist"],
  legal: ["avvocato", "studio legale", "notaio", "lawyer"],
  accounting: ["commercialista", "contabile", "tributarista", "accountant"],
};

/* ─── Multi-query Nominatim search ─── */
async function fetchNominatimQuery(searchTerm: string): Promise<any[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json&addressdetails=1&limit=20&extratags=1`;
    const resp = await fetch(url, {
      headers: { "User-Agent": "EmpireAI-LeadScout/2.0 (info@empireaigroup.com)" },
    });
    if (!resp.ok) return [];
    return await resp.json();
  } catch { return []; }
}

async function searchNominatim(city: string, sector: string, userQuery: string): Promise<any[]> {
  const keywords = SECTOR_KEYWORDS[sector] || [sector];
  
  // Build 2 search queries max (run in parallel to avoid timeout)
  const searches: string[] = [];
  if (userQuery) {
    searches.push(`${userQuery} ${city}`);
  }
  // Use top 2 keywords combined
  searches.push(`${keywords.slice(0, 2).join(" ")} ${city}`);
  if (keywords.length > 2) {
    searches.push(`${keywords.slice(2, 4).join(" ")} ${city}`);
  }

  // Run all searches in parallel
  const allData = await Promise.all(searches.map(s => fetchNominatimQuery(s)));

  const results: any[] = [];
  const seen = new Set<string>();

  for (const data of allData) {
    for (const item of data) {
      if (["boundary", "place", "highway", "railway", "waterway", "natural", "landuse"].includes(item.class)) continue;
      
      const name = item.display_name?.split(",")[0]?.trim() || "";
      if (!name || name.length < 2) continue;
      
      const key = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
      if (seen.has(key)) continue;
      seen.add(key);

      const tags = item.extratags || {};
      const addr = item.address || {};
      
      results.push({
        source: "nominatim",
        name,
        full_address: item.display_name || "",
        city: addr.city || addr.town || addr.village || addr.municipality || city,
        zone: addr.suburb || addr.neighbourhood || addr.quarter || addr.hamlet || "",
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        phone: tags.phone || tags["contact:phone"] || null,
        website: tags.website || tags["contact:website"] || null,
        email: tags.email || tags["contact:email"] || null,
        opening_hours: tags.opening_hours || null,
        osm_type: item.type || item.class,
        instagram: tags["contact:instagram"] || null,
        cuisine: tags.cuisine || null,
        google_maps_url: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`,
      });
    }
  }

  return results;
}

/* ─── Google Places API (premium) ─── */
async function searchGooglePlaces(query: string, city: string, sector: string): Promise<any[]> {
  const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!apiKey) return [];

  const sectorKw: Record<string, string> = {
    food: "ristorante OR pizzeria OR trattoria OR bar",
    beauty: "parrucchiere OR centro estetico",
    ncc: "noleggio con conducente OR NCC OR taxi",
    healthcare: "dentista OR medico OR clinica",
    retail: "negozio OR boutique",
    fitness: "palestra OR gym",
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
    if (!resp.ok) {
      console.error("Google Places error:", resp.status, await resp.text());
      return [];
    }
    const data = await resp.json();
    for (const p of data.places || []) {
      results.push({
        source: "google_places",
        name: p.displayName?.text || "N/A",
        full_address: p.formattedAddress || "",
        city,
        zone: "",
        lat: p.location?.latitude,
        lon: p.location?.longitude,
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
  } catch (e) {
    console.error("Google Places fetch error:", e);
  }

  return results;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, city, sector, use_google } = await req.json();

    if (!city && !query) {
      return new Response(
        JSON.stringify({ success: false, error: "City or query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const searchCity = (city || "").trim();
    const searchQuery = (query || "").trim();
    const searchSector = sector || "food";

    // 1. Nominatim multi-keyword search
    const nominatimResults = await searchNominatim(searchCity, searchSector, searchQuery);
    console.log(`Nominatim: ${nominatimResults.length} results for "${searchCity}" / "${searchSector}"`);

    // 2. Google Places (optional premium)
    let googleResults: any[] = [];
    if (use_google) {
      googleResults = await searchGooglePlaces(searchQuery, searchCity, searchSector);
      console.log(`Google Places: ${googleResults.length} results`);
    }

    // Merge + deduplicate
    const allResults = [...nominatimResults, ...googleResults];
    const seen = new Set<string>();
    const deduped = allResults.filter((r) => {
      const key = r.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`Lead search: city="${searchCity}", sector="${searchSector}" → ${deduped.length} unique (nominatim: ${nominatimResults.length}, google: ${googleResults.length})`);

    return new Response(
      JSON.stringify({
        success: true,
        results: deduped,
        sources: { nominatim: nominatimResults.length, google: googleResults.length },
        has_google_key: !!Deno.env.get("GOOGLE_PLACES_API_KEY"),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("lead-search error:", e);
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
