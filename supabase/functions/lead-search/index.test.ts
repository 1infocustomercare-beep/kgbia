/**
 * End-to-end tests per la edge function `lead-search`.
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
 *  - guardia di autenticazione (401 senza Bearer utente valido)
 *  - validazione payload (400 senza city/query/coords)
 *  - sincronizzazione `country_code` (filter ISO-2)
 *  - deduplica via `existing_names`
 *  - struttura risposta (success, results[], mode, sources, has_more)
 *
 * NOTA AUTH:
 *  La edge function valida il Bearer token via `auth.getUser()`. L'anon key
 *  da sola NON è sufficiente: serve un JWT utente reale.
 *  - Senza JWT: vengono eseguiti solo i test di security guard (401/CORS).
 *  - Con `TEST_USER_JWT` impostato nell'env: viene eseguita l'intera suite.
 *  Per ottenere un JWT di test puoi loggarti in preview e copiarlo da
 *  localStorage `sb-<ref>-auth-token`, oppure usare un account dedicato.
 */
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assert, assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY =
  Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
const TEST_USER_JWT = Deno.env.get("TEST_USER_JWT") ?? "";
const FN_URL = `${SUPABASE_URL}/functions/v1/lead-search`;

const HAS_AUTH = TEST_USER_JWT.length > 20;

interface LeadSearchResponse {
  success: boolean;
  results?: any[];
  mode?: string;
  sources?: Record<string, number>;
  has_more?: boolean;
  error?: string;
  page?: number;
}

/** Chiamata autenticata (richiede TEST_USER_JWT). */
async function callAuthed(body: Record<string, unknown>): Promise<{ status: number; data: LeadSearchResponse }> {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TEST_USER_JWT}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as LeadSearchResponse;
  return { status: res.status, data };
}

/** Chiamata anonima (anon key, senza utente). */
async function callAnon(body: Record<string, unknown>): Promise<{ status: number; data: LeadSearchResponse }> {
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
/*  SECURITY GUARDS — sempre eseguiti                           */
/* ─────────────────────────────────────────────────────────── */

Deno.test("security: rifiuta richieste senza Authorization header", async () => {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city: "Roma", sector: "food" }),
  });
  await res.text();
  assert(res.status === 401 || res.status === 403, `expected 401/403, got ${res.status}`);
});

Deno.test("security: rifiuta richieste con solo anon key (no user JWT)", async () => {
  const { status, data } = await callAnon({ city: "Roma", sector: "food" });
  assertEquals(status, 401);
  assertExists(data.error);
});

Deno.test("CORS: la richiesta OPTIONS risponde correttamente", async () => {
  const res = await fetch(FN_URL, { method: "OPTIONS" });
  await res.text();
  assertEquals(res.status, 200);
  assertExists(res.headers.get("access-control-allow-origin"));
});

/* ─────────────────────────────────────────────────────────── */
/*  TEST AUTENTICATI — richiedono TEST_USER_JWT nell'env        */
/* ─────────────────────────────────────────────────────────── */

const authedTest = HAS_AUTH ? Deno.test : Deno.test.ignore;

if (!HAS_AUTH) {
  console.warn(
    "\n[lead-search tests] TEST_USER_JWT non impostato → saltati i test E2E completi.\n" +
      "  Per eseguire l'intera suite: aggiungi TEST_USER_JWT=<jwt> al .env e ri-esegui.\n",
  );
}

/* ── VALIDAZIONE PAYLOAD ── */

authedTest("validazione: payload vuoto (no city/query/coords) → 400", async () => {
  const { status, data } = await callAuthed({ sector: "food" });
  assertEquals(status, 400);
  assertEquals(data.success, false);
  assertExists(data.error);
});

/* ── MODE 1: NAME-ONLY ── */

authedTest("mode=name_only → ricerca globale ritorna mode='name_only'", async () => {
  const { status, data } = await callAuthed({
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
  assertEquals(typeof data.has_more, "boolean");
});

authedTest("mode=name_only: query troppo corta (<2) cade in branch geo → 400 senza city", async () => {
  const { status, data } = await callAuthed({
    query: "a",
    sector: "food",
    name_only: true,
  });
  assertEquals(status, 400);
  assertEquals(data.success, false);
});

/* ── MODE 2: KEYWORD + CITY ── */

authedTest("mode=keyword+city → ricerca con parola chiave e città", async () => {
  const { status, data } = await callAuthed({
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

/* ── MODE 3: ZONE (city only) ── */

authedTest("mode=zone → city only ritorna risultati settoriali", async () => {
  const { status, data } = await callAuthed({
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

authedTest("mode=zone: località inesistente → success=false con messaggio", async () => {
  const { status, data } = await callAuthed({
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

/* ── MODE 4: GPS ── */

authedTest("mode=gps → ricerca attorno a coordinate (Colosseo, Roma)", async () => {
  const { status, data } = await callAuthed({
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

authedTest("mode=gps: radius oltre 100km viene clampato senza errore", async () => {
  const { status, data } = await callAuthed({
    lat: 45.4642,
    lon: 9.19,
    radius_km: 999,
    sector: "food",
    sources: ["nominatim"],
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
});

/* ── MODE 5: MAPS_URL (client estrae coords) ── */

authedTest("mode=maps_url → simula coords estratte dal client (branch GPS)", async () => {
  // Il client parsifica "https://www.google.com/maps/@45.4642,9.19,15z"
  // in lat/lon e li passa come parametri GPS standard.
  const { status, data } = await callAuthed({
    lat: 45.4642,
    lon: 9.19,
    radius_km: 1,
    sector: "food",
    sources: ["nominatim"],
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
  assertEquals(data.mode, "geo");
});

/* ── MODE 6: WEBSITE (client estrae nome) ── */

authedTest("mode=website → simula nome estratto dal dominio (branch name_only)", async () => {
  // Il client riceve "https://mcdonalds.it" → estrae "mcdonalds" → name_only.
  const { status, data } = await callAuthed({
    query: "Mcdonalds",
    sector: "food",
    name_only: true,
    country_code: "IT",
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
  assertEquals(data.mode, "name_only");
});

/* ── COUNTRY_CODE: sincronizzazione ── */

authedTest("country_code='IT' filtra correttamente la geocodifica città", async () => {
  const { status, data } = await callAuthed({
    city: "Milano",
    sector: "food",
    country_code: "IT",
    sources: ["nominatim"],
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
});

authedTest("country_code invalido (non ISO-2) viene ignorato silenziosamente", async () => {
  const { status, data } = await callAuthed({
    city: "Roma",
    sector: "food",
    country_code: "ITALIA",
    sources: ["nominatim"],
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
});

authedTest("country_code passato in name_only filtra Nominatim per paese", async () => {
  const { status, data } = await callAuthed({
    query: "Lidl",
    sector: "food",
    name_only: true,
    country_code: "DE",
  });
  assertEquals(status, 200);
  assertEquals(data.success, true);
  assertEquals(data.mode, "name_only");
});

/* ── DEDUP ── */

authedTest("existing_names esclude i nomi già presenti nel client", async () => {
  const first = await callAuthed({
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
    console.warn("[dedup] nessun risultato base, skip assertion forte");
    return;
  }

  const second = await callAuthed({
    city: "Roma",
    sector: "food",
    country_code: "IT",
    sources: ["nominatim"],
    existing_names: firstNames,
  });
  assertEquals(second.status, 200);
  assertEquals(second.data.success, true);

  const returnedKeys = new Set(
    (second.data.results ?? []).map((r: any) =>
      r.name?.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30),
    ),
  );
  for (const n of firstNames) {
    const key = n.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
    assert(!returnedKeys.has(key), `dedup fallito: "${n}" presente anche dopo existing_names`);
  }
});

authedTest("dedup interno: nessun nome duplicato nello stesso payload", async () => {
  const { data } = await callAuthed({
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

/* ── STRUTTURA RISPOSTA ── */

authedTest("risposta: contiene sempre success, results, mode, sources, has_more", async () => {
  const { data } = await callAuthed({
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
    assert("total_merged" in (data.sources as any));
    assertEquals(typeof data.has_more, "boolean");
  }
});
