import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SECTOR_AMENITIES: Record<string, string[]> = {
  food: ["restaurant", "cafe", "fast_food", "bar", "pub", "ice_cream", "bakery", "biergarten"],
  beauty: ["hairdresser", "beauty"],
  ncc: ["car_rental", "taxi"],
  healthcare: ["dentist", "doctors", "clinic", "hospital", "pharmacy", "veterinary"],
  retail: ["clothes", "shoes", "boutique", "supermarket", "convenience", "jewelry"],
  fitness: ["fitness_centre", "sports_centre", "swimming_pool"],
  hospitality: ["hotel", "hostel", "guest_house", "motel"],
  beach: ["beach_resort", "swimming_pool"],
  plumber: ["plumber"],
  electrician: ["electrician"],
  veterinary: ["veterinary"],
  tattoo: ["tattoo"],
  photography: ["photographer"],
  events: ["events_venue", "conference_centre"],
  construction: ["construction"],
  gardening: ["garden_centre"],
  legal: ["lawyer"],
  accounting: ["accountant"],
};

const SECTOR_SHOP_TYPES: Record<string, string[]> = {
  beauty: ["hairdresser", "beauty", "cosmetics", "nails"],
  retail: ["clothes", "shoes", "jewelry", "boutique", "optician", "gift", "bag", "perfumery"],
  fitness: ["sports"],
  veterinary: ["pet"],
  tattoo: ["tattoo"],
  photography: ["photo"],
  gardening: ["garden_centre", "florist"],
};

const SECTOR_KEYWORDS_IT: Record<string, string> = {
  food: "ristorante pizzeria trattoria",
  beauty: "parrucchiere centro estetico",
  ncc: "noleggio con conducente NCC",
  healthcare: "dentista medico clinica",
  retail: "negozio boutique",
  fitness: "palestra gym",
  hospitality: "hotel albergo B&B",
  beach: "stabilimento balneare lido",
  plumber: "idraulico",
  electrician: "elettricista",
  veterinary: "veterinario",
  tattoo: "tatuaggio tattoo studio",
  photography: "fotografo studio fotografico",
  events: "organizzazione eventi catering",
  construction: "impresa edile ristrutturazione",
  gardening: "giardiniere vivaio",
  legal: "avvocato studio legale",
  accounting: "commercialista studio contabile",
};

/* ─── Overpass API (most reliable for structured POI search) ─── */
async function searchOverpass(city: string, sector: string, query: string): Promise<any[]> {
  const amenities = SECTOR_AMENITIES[sector] || ["restaurant", "shop", "office"];
  const shopTypes = SECTOR_SHOP_TYPES[sector] || [];
  const results: any[] = [];

  // Use only top 3 amenities and top 2 shop types to keep query fast
  const topAmenities = amenities.slice(0, 3);
  const topShops = shopTypes.slice(0, 2);

  const amenityRegex = topAmenities.join("|");
  const shopRegex = topShops.length > 0 ? topShops.join("|") : "";

  const overpassQuery = `[out:json][timeout:15];
{{geocodeArea:${city}}}->.searchArea;
(
  node["amenity"~"${amenityRegex}"](area.searchArea);
  ${shopRegex ? `node["shop"~"${shopRegex}"](area.searchArea);` : ""}
);
out body 40;`;

  try {
    const resp = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (!resp.ok) {
      console.error("Overpass HTTP error:", resp.status);
      return [];
    }
    const data = await resp.json();
    for (const el of data.elements || []) {
      const tags = el.tags || {};
      if (!tags.name) continue;
      results.push({
        source: "overpass",
        name: tags.name,
        full_address: [tags["addr:street"], tags["addr:housenumber"], tags["addr:city"] || city].filter(Boolean).join(", ") || city,
        city: tags["addr:city"] || city,
        zone: tags["addr:suburb"] || tags["addr:neighbourhood"] || tags["addr:quarter"] || "",
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        phone: tags.phone || tags["contact:phone"] || null,
        website: tags.website || tags["contact:website"] || null,
        email: tags.email || tags["contact:email"] || null,
        opening_hours: tags.opening_hours || null,
        osm_type: tags.amenity || tags.shop || tags.tourism || tags.craft || "unknown",
        instagram: tags["contact:instagram"] || null,
        facebook: tags["contact:facebook"] || null,
        cuisine: tags.cuisine || null,
      });
    }
  } catch (e) {
    console.error("Overpass error:", e);
  }

  return results;
}

/* ─── Nominatim (fallback / supplementary) ─── */
async function searchNominatim(city: string, sector: string, query: string): Promise<any[]> {
  const results: any[] = [];
  const keyword = SECTOR_KEYWORDS_IT[sector] || sector;
  const searchTerm = query || keyword;
  
  // Search with structured query for better precision
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&city=${encodeURIComponent(city)}&format=json&addressdetails=1&limit=40&extratags=1`;

  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "EmpireAI-LeadScout/2.0 (info@empireaigroup.com)" },
    });
    if (!resp.ok) return [];
    const data = await resp.json();

    for (const item of data) {
      const tags = item.extratags || {};
      const addr = item.address || {};
      // Skip results that are just cities/regions (not businesses)
      if (item.class === "boundary" || item.class === "place" || item.class === "highway") continue;
      
      results.push({
        source: "nominatim",
        name: item.display_name?.split(",")[0] || "N/A",
        full_address: item.display_name,
        city: addr.city || addr.town || addr.village || city,
        zone: addr.suburb || addr.neighbourhood || addr.quarter || "",
        lat: item.lat,
        lon: item.lon,
        phone: tags.phone || tags["contact:phone"] || null,
        website: tags.website || tags["contact:website"] || null,
        email: tags.email || tags["contact:email"] || null,
        opening_hours: tags.opening_hours || null,
        osm_type: item.type || item.class,
        instagram: tags["contact:instagram"] || null,
      });
    }
  } catch (e) {
    console.error("Nominatim error:", e);
  }

  return results;
}

/* ─── Google Places API (premium, requires key) ─── */
async function searchGooglePlaces(query: string, city: string, sector: string): Promise<any[]> {
  const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!apiKey) return [];

  const sectorKeywords: Record<string, string> = {
    food: "ristorante OR pizzeria OR trattoria OR bar OR caffè",
    beauty: "parrucchiere OR centro estetico OR beauty salon",
    ncc: "noleggio con conducente OR NCC OR taxi OR transfer",
    healthcare: "dentista OR medico OR fisioterapista OR clinica",
    retail: "negozio OR boutique OR shop",
    fitness: "palestra OR gym OR fitness OR crossfit",
    hospitality: "hotel OR B&B OR albergo OR resort",
    beach: "stabilimento balneare OR lido OR beach club",
    plumber: "idraulico OR plumber",
    electrician: "elettricista OR electrician",
    veterinary: "veterinario OR clinica veterinaria",
    tattoo: "tatuaggio OR tattoo studio",
  };

  const searchText = query || (sectorKeywords[sector] || sector);
  const results: any[] = [];

  try {
    const resp = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.location,places.types,places.businessStatus",
      },
      body: JSON.stringify({
        textQuery: `${searchText} ${city}`,
        languageCode: "it",
        maxResultCount: 20,
      }),
    });

    if (!resp.ok) {
      console.error("Google Places error:", resp.status, await resp.text());
      return [];
    }

    const data = await resp.json();
    for (const place of data.places || []) {
      results.push({
        source: "google_places",
        name: place.displayName?.text || "N/A",
        full_address: place.formattedAddress || "",
        city,
        zone: "",
        lat: place.location?.latitude,
        lon: place.location?.longitude,
        phone: place.nationalPhoneNumber || null,
        website: place.websiteUri || null,
        email: null,
        google_rating: place.rating || 0,
        google_reviews: place.userRatingCount || 0,
        google_maps_url: place.googleMapsUri || null,
        business_status: place.businessStatus || "OPERATIONAL",
        types: place.types || [],
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
    const { query, city, sector, mode, use_google } = await req.json();

    if (!city && !query) {
      return new Response(
        JSON.stringify({ success: false, error: "City or query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const searchCity = city || "";
    const searchQuery = query || "";
    const searchSector = sector || "food";

    // 1. Primary: Overpass (most reliable for POI data)
    const overpassResults = await searchOverpass(searchCity, searchSector, searchQuery);
    console.log(`Overpass: ${overpassResults.length} results for "${searchCity}" / "${searchSector}"`);

    // 2. Secondary: Nominatim (supplementary)
    const nominatimResults = await searchNominatim(searchCity, searchSector, searchQuery);
    console.log(`Nominatim: ${nominatimResults.length} results`);

    // 3. Optional: Google Places
    let googleResults: any[] = [];
    if (use_google) {
      googleResults = await searchGooglePlaces(searchQuery, searchCity, searchSector);
      console.log(`Google Places: ${googleResults.length} results`);
    }

    // Merge all results, deduplicate by name similarity
    const allResults = [...overpassResults, ...nominatimResults, ...googleResults];
    const seen = new Set<string>();
    const deduped = allResults.filter((r) => {
      const key = r.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const osmCount = overpassResults.length + nominatimResults.length;

    console.log(`Lead search: city="${searchCity}", sector="${searchSector}", query="${searchQuery}" → ${deduped.length} unique results (osm: ${osmCount}, google: ${googleResults.length})`);

    return new Response(
      JSON.stringify({
        success: true,
        results: deduped,
        sources: {
          nominatim: osmCount,
          google: googleResults.length,
        },
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
