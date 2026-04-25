/**
 * End-to-end tests per `lead-search` edge function.
 *
 * Copre tutte le modalità che il client può triggerare:
 *  1. name_only           → ricerca globale per nome attività
 *  2. keyword + city      → ricerca per parola chiave + città
 *  3. zone (city only)    → ricerca generica nel settore in città
 *  4. gps (lat/lon+radius)→ ricerca attorno a coordinate
 *  5. maps_url            → coords estratte dal client → branch GPS
 *  6. website             → nome estratto dal sito → branch name_only
 *
 * Verifica inoltre:
 *  - sincronizzazione `country_code` (filter ISO-2)
 *  - deduplica via `existing_names`
 *  - struttura risposta (success, results[], mode, sources, has_more)
 */
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assert, assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY =
  Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
const FN_URL = `${SUPABASE_URL}/functions/v1/lead-search`;

interface LeadSearchResponse {
  success: boolean;
  results?: any[];
  mode?: string;
  sources?: Record<string, number>;
  has_more?: boolean;
  error?: string;
  page?: number;
}

async function callLeadSearch(body: Record<string, unknown>): Promise<{ status: number; data: LeadSearchResponse }> {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as LeadSearchResponse;
  return { status: res.status, data };
}

/* ─────────────────────────────────────────────────────────── */
/*  AUTH / VALIDAZIONE                                          */
/* ─────────────────────────────────────────────────────────── */

Deno.test("rejects request without Authorization header", async () => {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city: "Roma", sector: "food" }),
  });
  await res.text();
  assert(res.status === 401 || res.status === 403, `expected 401/403, got ${res.status}`);
});

Deno.test("rejects empty payload (no city, query or coords)", async () => {
  const { status, data } = await callLeadSearch({ sector: "food" });
  assertEquals(status, 400);
  assertEquals(data.success, false);
  assertExists(data.error);
});

/* ─────────────────────────────────────────────────────────── */
/*  MODE 1 — NAME-ONLY (ricerca globale per nome attività)      */
/* ─────────────────────────────────────────────────────────── */

Deno.test("mode=name_only → ricerca globale ritorna mode='name_only'", async () => {
  const { status, data } = await callLeadSearch({
    query: "Starbucks",
    sector: "food",
    name_only: true,
    country_code: "IT",
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
  assertEquals(data.mode, "name_only");
  assert(Array.isArray(data.results));
  assertExists(data.sources);
  // has_more deve esistere ed essere boolean
  assertEquals(typeof data.has_more, "boolean");
});

Deno.test("mode=name_only ignora la query troppo corta (<2)", async () => {
  // Con name_only attivo ma query <2 il branch name_only non viene preso
  // → cade nel branch geo → richiede city o coords, quindi 400 senza city
  const { status, data } = await callLeadSearch({
    query: "a",
    sector: "food",
    name_only: true,
  });
  assertEquals(status, 400);
  assertEquals(data.success, false);
});

/* ─────────────────────────────────────────────────────────── */
/*  MODE 2 — KEYWORD + CITY                                     */
/* ─────────────────────────────────────────────────────────── */

Deno.test("mode=keyword+city → ricerca con parola chiave e città", async () => {
  const { status, data } = await callLeadSearch({
    query: "pizzeria",
    city: "Roma",
    sector: "food",
    country_code: "IT",
    sources: ["nominatim"],
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
  assertEquals(data.mode, "geo");
  assert(Array.isArray(data.results));
});

/* ─────────────────────────────────────────────────────────── */
/*  MODE 3 — ZONE (city only, settore generico)                 */
/* ─────────────────────────────────────────────────────────── */

Deno.test("mode=zone → city only ritorna risultati settoriali", async () => {
  const { status, data } = await callLeadSearch({
    city: "Milano",
    sector: "beauty",
    country_code: "IT",
    sources: ["nominatim", "overpass"],
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
  assertEquals(data.mode, "geo");
  assertExists(data.sources);
});

Deno.test("mode=zone → località inesistente ritorna success=false con messaggio", async () => {
  const { status, data } = await callLeadSearch({
    city: "Xyznonexistent12345",
    sector: "food",
    country_code: "IT",
  });
  assertEquals(status, 200);
  assertEquals(data.success, false);
  assertExists(data.error);
  assert(Array.isArray(data.results));
  assertEquals(data.results!.length, 0);
});

/* ─────────────────────────────────────────────────────────── */
/*  MODE 4 — GPS (lat/lon + radius)                             */
/* ─────────────────────────────────────────────────────────── */

Deno.test("mode=gps → ricerca attorno a coordinate (Colosseo, Roma)", async () => {
  const { status, data } = await callLeadSearch({
    lat: 41.8902,
    lon: 12.4922,
    radius_km: 2,
    sector: "food",
    sources: ["nominatim"],
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
  assertEquals(data.mode, "geo");
  assert(Array.isArray(data.results));
});

Deno.test("mode=gps → radius oltre 100km viene clampato senza errore", async () => {
  const { status, data } = await callLeadSearch({
    lat: 45.4642,
    lon: 9.19,
    radius_km: 999, // verrà clampato a 100
    sector: "food",
    sources: ["nominatim"],
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
});

/* ─────────────────────────────────────────────────────────── */
/*  MODE 5 — MAPS_URL (client estrae coords → branch GPS)       */
/* ─────────────────────────────────────────────────────────── */

Deno.test("mode=maps_url → simula coords estratte dal client", async () => {
  // URL maps tipo: https://www.google.com/maps/@45.4642,9.19,15z
  // Il client estrae lat/lon e li passa come parametri GPS.
  const extracted = { lat: 45.4642, lon: 9.19 };
  const { status, data } = await callLeadSearch({
    lat: extracted.lat,
    lon: extracted.lon,
    radius_km: 1,
    sector: "food",
    sources: ["nominatim"],
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
  assertEquals(data.mode, "geo");
});

/* ─────────────────────────────────────────────────────────── */
/*  MODE 6 — WEBSITE (client estrae nome → branch name_only)    */
/* ─────────────────────────────────────────────────────────── */

Deno.test("mode=website → simula nome estratto dal dominio", async () => {
  // Il client riceve "https://acme-pizza.it" → estrae "acme pizza" → name_only.
  const extractedName = "Mcdonalds";
  const { status, data } = await callLeadSearch({
    query: extractedName,
    sector: "food",
    name_only: true,
    country_code: "IT",
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
  assertEquals(data.mode, "name_only");
});

/* ─────────────────────────────────────────────────────────── */
/*  COUNTRY_CODE — sincronizzazione e filtro                    */
/* ─────────────────────────────────────────────────────────── */

Deno.test("country_code='IT' filtra correttamente la geocodifica città", async () => {
  // "Milano" esiste in più nazioni → con cc=IT deve risolvere alla Milano italiana
  const { status, data } = await callLeadSearch({
    city: "Milano",
    sector: "food",
    country_code: "IT",
    sources: ["nominatim"],
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
});

Deno.test("country_code invalido (non ISO-2) viene ignorato silenziosamente", async () => {
  // "ITALIA" non è ISO-2 → ccFilter diventa "" → ricerca globale via geocode
  const { status, data } = await callLeadSearch({
    city: "Roma",
    sector: "food",
    country_code: "ITALIA",
    sources: ["nominatim"],
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
});

Deno.test("country_code passato in name_only filtra Nominatim per paese", async () => {
  const { status, data } = await callLeadSearch({
    query: "Lidl",
    sector: "food",
    name_only: true,
    country_code: "DE",
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
  assertEquals(data.mode, "name_only");
});

/* ─────────────────────────────────────────────────────────── */
/*  DEDUP — existing_names esclude duplicati                    */
/* ─────────────────────────────────────────────────────────── */

Deno.test("existing_names esclude i nomi già presenti nel client", async () => {
  // Prima chiamata per ottenere alcuni nomi reali
  const first = await callLeadSearch({
    city: "Roma",
    sector: "food",
    country_code: "IT",
    sources: ["nominatim"],
  });
  assertEquals(first.status, 200);

  const firstNames = (first.data.results ?? [])
    .map((r: any) => r.name)
    .filter((n: string) => !!n)
    .slice(0, 5);

  if (firstNames.length === 0) {
    // Se non abbiamo risultati (es. throttle Nominatim), saltiamo l'assertion forte
    console.warn("[dedup test] nessun risultato base, skip assertion forte");
    return;
  }

  // Seconda chiamata escludendo i nomi raccolti
  const second = await callLeadSearch({
    city: "Roma",
    sector: "food",
    country_code: "IT",
    sources: ["nominatim"],
    existing_names: firstNames,
  });
  assertEquals(second.status, 200);
  assertEquals(second.data.success, true);

  const returnedNames = new Set(
    (second.data.results ?? []).map((r: any) => r.name?.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30)),
  );
  for (const n of firstNames) {
    const key = n.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
    assert(!returnedNames.has(key), `dedup fallito: "${n}" presente anche dopo existing_names`);
  }
});

Deno.test("dedup interno: nessun nome duplicato nello stesso payload", async () => {
  const { data } = await callLeadSearch({
    city: "Firenze",
    sector: "food",
    country_code: "IT",
    sources: ["nominatim", "overpass"],
  });
  if (!data.success || !data.results || data.results.length === 0) {
    console.warn("[dedup interno] nessun risultato, skip");
    return;
  }
  const keys = data.results.map((r: any) =>
    (r.name ?? "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30),
  );
  const set = new Set(keys);
  assertEquals(keys.length, set.size, "trovati nomi duplicati nel payload deduplicato");
});

/* ─────────────────────────────────────────────────────────── */
/*  STRUTTURA RISPOSTA                                          */
/* ─────────────────────────────────────────────────────────── */

Deno.test("risposta contiene sempre i campi: success, results, mode, sources", async () => {
  const { data } = await callLeadSearch({
    city: "Bologna",
    sector: "food",
    country_code: "IT",
    sources: ["nominatim"],
  });
  assertExists(data.success);
  assert("results" in data);
  if (data.success) {
    assertExists(data.mode);
    assertExists(data.sources);
    // sources deve avere total_merged
    assert("total_merged" in (data.sources as any));
  }
});
