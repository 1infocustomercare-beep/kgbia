import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SECTOR_AMENITIES: Record<string, string[]> = {
  food: ["restaurant", "cafe", "fast_food", "bar", "pub", "ice_cream", "bakery"],
  beauty: ["hairdresser", "beauty"],
  ncc: ["car_rental", "taxi"],
  healthcare: ["dentist", "doctors", "clinic", "hospital", "pharmacy"],
  retail: ["clothes", "shoes", "supermarket", "convenience"],
  fitness: ["fitness_centre", "sports_centre"],
  hospitality: ["hotel", "hostel", "guest_house", "motel"],
  beach: ["beach_resort"],
  plumber: ["plumber"],
  electrician: ["electrician"],
  veterinary: ["veterinary"],
  tattoo: ["tattoo"],
};

const SECTOR_SHOPS: Record<string, string[]> = {
  beauty: ["hairdresser", "beauty", "cosmetics"],
  retail: ["clothes", "shoes", "jewelry", "boutique", "optician"],
  fitness: ["sports"],
  veterinary: ["pet"],
  tattoo: ["tattoo"],
};

/* ─── Step 1: Geocode city to get bounding box ─── */
async function geocodeCity(city: string): Promise<{ lat: number; lon: number; bbox: [number, number, number, number] } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&addressdetails=1`;
    const resp = await fetch(url, {
      headers: { "User-Agent": "EmpireAI-LeadScout/2.0 (info@empireaigroup.com)" },
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    if (!data.length) return null;
    const item = data[0];
    const bb = item.boundingbox; // [south, north, west, east]
    return {
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      bbox: [parseFloat(bb[0]), parseFloat(bb[2]), parseFloat(bb[1]), parseFloat(bb[3])], // south, west, north, east
    };
  } catch (e) {
    console.error("Geocode error:", e);
    return null;
  }
}

/* ─── Step 2: Overpass with bounding box (reliable for any city) ─── */
async function searchOverpass(bbox: [number, number, number, number], sector: string, query: string): Promise<any[]> {
  const amenities = SECTOR_AMENITIES[sector] || ["restaurant", "cafe", "bar"];
  const shops = SECTOR_SHOPS[sector] || [];
  const results: any[] = [];

  const [south, west, north, east] = bbox;
  const amenityRegex = amenities.slice(0, 4).join("|");
  const shopRegex = shops.length > 0 ? shops.slice(0, 3).join("|") : "";

  let overpassQL = `[out:json][timeout:12];
(
  node["amenity"~"${amenityRegex}"](${south},${west},${north},${east});
  ${shopRegex ? `node["shop"~"${shopRegex}"](${south},${west},${north},${east});` : ""}
);
out body 50;`;

  try {
    const resp = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(overpassQL)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (!resp.ok) {
      console.error("Overpass HTTP error:", resp.status);
      return [];
    }
    const data = await resp.json();
    for (const el of data.elements || []) {
      const t = el.tags || {};
      if (!t.name) continue;
      // If query specified, filter by name match
      if (query && !t.name.toLowerCase().includes(query.toLowerCase())) continue;
      results.push({
        source: "overpass",
        name: t.name,
        full_address: [t["addr:street"], t["addr:housenumber"], t["addr:city"]].filter(Boolean).join(", ") || "",
        city: t["addr:city"] || "",
        zone: t["addr:suburb"] || t["addr:neighbourhood"] || "",
        lat: el.lat,
        lon: el.lon,
        phone: t.phone || t["contact:phone"] || null,
        website: t.website || t["contact:website"] || null,
        email: t.email || t["contact:email"] || null,
        opening_hours: t.opening_hours || null,
        osm_type: t.amenity || t.shop || t.tourism || t.craft || "unknown",
        instagram: t["contact:instagram"] || null,
        cuisine: t.cuisine || null,
      });
    }
  } catch (e) {
    console.error("Overpass error:", e);
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

    const searchCity = city || "";
    const searchQuery = query || "";
    const searchSector = sector || "food";

    // 1. Geocode city to get bounding box
    let overpassResults: any[] = [];
    const geo = await geocodeCity(searchCity);
    if (geo) {
      // Expand bbox slightly for better coverage (~5km padding)
      const pad = 0.05;
      const expandedBbox: [number, number, number, number] = [
        geo.bbox[0] - pad,
        geo.bbox[1] - pad,
        geo.bbox[2] + pad,
        geo.bbox[3] + pad,
      ];
      overpassResults = await searchOverpass(expandedBbox, searchSector, searchQuery);
      console.log(`Overpass: ${overpassResults.length} results for "${searchCity}" bbox`);
    } else {
      console.log(`Geocode failed for "${searchCity}"`);
    }

    // 2. Google Places (optional)
    let googleResults: any[] = [];
    if (use_google) {
      googleResults = await searchGooglePlaces(searchQuery, searchCity, searchSector);
      console.log(`Google Places: ${googleResults.length} results`);
    }

    // Merge + deduplicate
    const allResults = [...overpassResults, ...googleResults];
    const seen = new Set<string>();
    const deduped = allResults.filter((r) => {
      const key = r.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`Lead search: city="${searchCity}", sector="${searchSector}", query="${searchQuery}" → ${deduped.length} unique (osm: ${overpassResults.length}, google: ${googleResults.length})`);

    return new Response(
      JSON.stringify({
        success: true,
        results: deduped,
        sources: { nominatim: overpassResults.length, google: googleResults.length },
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
