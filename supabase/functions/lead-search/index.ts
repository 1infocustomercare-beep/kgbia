import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Nominatim (OpenStreetMap) — FREE, no API key needed
async function searchNominatim(query: string, city: string, sector: string): Promise<any[]> {
  const sectorMap: Record<string, string[]> = {
    food: ["restaurant", "cafe", "fast_food", "bar", "pub", "ice_cream", "bakery"],
    beauty: ["hairdresser", "beauty", "cosmetics"],
    ncc: ["car_rental", "taxi"],
    healthcare: ["dentist", "doctors", "clinic", "hospital", "pharmacy"],
    retail: ["clothes", "shoes", "boutique", "shop", "supermarket"],
    fitness: ["fitness_centre", "gym", "sports_centre"],
    hospitality: ["hotel", "hostel", "guest_house", "motel"],
    beach: ["beach_resort", "swimming_pool"],
    plumber: ["plumber"],
    electrician: ["electrician"],
    veterinary: ["veterinary"],
  };

  const osmTypes = sectorMap[sector] || ["shop", "office", "amenity"];
  const results: any[] = [];

  // Search with Nominatim structured query
  const searchQuery = query || `${osmTypes[0]} ${city}`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery + " " + city)}&format=json&addressdetails=1&limit=30&countrycodes=it&extratags=1`;

  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "EmpireAI-LeadScout/1.0 (info@empireaigroup.com)" },
    });
    if (!resp.ok) throw new Error(`Nominatim ${resp.status}`);
    const data = await resp.json();

    for (const item of data) {
      const tags = item.extratags || {};
      const addr = item.address || {};
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

  // Also try Overpass API for more results
  try {
    const overpassQuery = `[out:json][timeout:10];area["name"="${city}"]["admin_level"~"[4-8]"]->.searchArea;(node["amenity"~"${osmTypes.join("|")}"](area.searchArea);node["shop"~"${osmTypes.join("|")}"](area.searchArea););out body 20;`;
    const overpassResp = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (overpassResp.ok) {
      const overpassData = await overpassResp.json();
      for (const el of overpassData.elements || []) {
        const tags = el.tags || {};
        if (!tags.name) continue;
        // Avoid duplicates
        if (results.some((r) => r.name === tags.name)) continue;
        results.push({
          source: "overpass",
          name: tags.name,
          full_address: `${tags["addr:street"] || ""} ${tags["addr:housenumber"] || ""}, ${tags["addr:city"] || city}`.trim(),
          city: tags["addr:city"] || city,
          zone: tags["addr:suburb"] || tags["addr:neighbourhood"] || "",
          lat: el.lat,
          lon: el.lon,
          phone: tags.phone || tags["contact:phone"] || null,
          website: tags.website || tags["contact:website"] || null,
          email: tags.email || tags["contact:email"] || null,
          opening_hours: tags.opening_hours || null,
          osm_type: tags.amenity || tags.shop || "unknown",
          instagram: tags["contact:instagram"] || null,
        });
      }
    }
  } catch (e) {
    console.error("Overpass error:", e);
  }

  return results;
}

// Google Places API — requires GOOGLE_PLACES_API_KEY secret
async function searchGooglePlaces(query: string, city: string, sector: string): Promise<any[]> {
  const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!apiKey) return [];

  const sectorKeywords: Record<string, string> = {
    food: "ristorante OR pizzeria OR trattoria OR bar",
    beauty: "parrucchiere OR centro estetico OR beauty",
    ncc: "noleggio con conducente OR NCC OR taxi",
    healthcare: "dentista OR medico OR fisioterapista OR clinica",
    retail: "negozio OR boutique OR shop",
    fitness: "palestra OR gym OR fitness",
    hospitality: "hotel OR B&B OR albergo",
    beach: "stabilimento balneare OR lido",
  };

  const searchText = query || (sectorKeywords[sector] || sector);
  const results: any[] = [];

  try {
    // Use Text Search (New) API
    const resp = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.location,places.types,places.businessStatus",
      },
      body: JSON.stringify({
        textQuery: `${searchText} ${city} Italia`,
        languageCode: "it",
        maxResultCount: 20,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("Google Places error:", resp.status, errText);
      return [];
    }

    const data = await resp.json();
    for (const place of data.places || []) {
      results.push({
        source: "google_places",
        name: place.displayName?.text || "N/A",
        full_address: place.formattedAddress || "",
        city: city,
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

    let results: any[] = [];

    // Always try Nominatim (free)
    const nominatimResults = await searchNominatim(query || "", city || "", sector || "");
    results.push(...nominatimResults);

    // Optionally use Google Places if key is available and requested
    if (use_google) {
      const googleResults = await searchGooglePlaces(query || "", city || "", sector || "");
      results.push(...googleResults);
    }

    // Deduplicate by name similarity
    const seen = new Set<string>();
    const deduped = results.filter((r) => {
      const key = r.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log(`Lead search: query="${query}", city="${city}", sector="${sector}" → ${deduped.length} results (nominatim: ${nominatimResults.length}, google: ${results.length - nominatimResults.length})`);

    return new Response(
      JSON.stringify({
        success: true,
        results: deduped,
        sources: {
          nominatim: nominatimResults.length,
          google: results.length - nominatimResults.length,
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
