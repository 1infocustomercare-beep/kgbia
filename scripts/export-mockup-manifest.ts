/**
 * Esporta il manifest completo (identità + style matrix + prompt per schermata)
 * consumato da scripts/mockup-generate.py.
 *
 * Uso: bun scripts/export-mockup-manifest.ts /tmp/mockups/manifest.json
 */
import { FULL_IDENTITIES, FULL_IDENTITY_MATRIX, assertRegistryIntegrity, screenCoverage } from "../src/lib/mockup-identity-registry";
import { referencesForIdentity, buildReferenceBrief, referenceCoverage } from "../src/lib/mockup-lowengeld-bridge";
import { STYLE_RULES, assertStyleVariance, buildScreenPrompt } from "../src/lib/mockup-style-rules";

const out = process.argv[2] ?? "/tmp/mockups/manifest.json";

const registry = assertRegistryIntegrity();
const variance = assertStyleVariance();

const coverage = screenCoverage(FULL_IDENTITIES);
const refs = referenceCoverage(FULL_IDENTITY_MATRIX);
const indexInSector = new Map<string, number>();
(Object.values(FULL_IDENTITY_MATRIX) as (typeof FULL_IDENTITIES)[]).forEach((list) =>
  list.forEach((identity, i) => indexInSector.set(identity.id, i)),
);

const jobs = FULL_IDENTITIES.flatMap((identity) =>
  identity.screens.map((screen, index) => ({
    identityId: identity.id,
    sector: identity.sector,
    family: identity.family,
    brand: identity.brand,
    screenKey: screen.key,
    index,
    surface: screen.surface,
    styleSignature: STYLE_RULES[identity.id]?.signature,
    prompt: [
      buildScreenPrompt(identity, screen.key),
      buildReferenceBrief(referencesForIdentity(identity, indexInSector.get(identity.id) ?? 0)),
    ].filter(Boolean).join("\n"),
  })),
);

await Bun.write(
  out,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      identities: FULL_IDENTITIES.length,
      jobs: jobs.length,
      integrity: { registry, variance, coverage, refs },
      jobs_list: jobs,
    },
    null,
    2,
  ),
);

console.log(`manifest → ${out}`);
console.log(`identità: ${FULL_IDENTITIES.length} · schermate: ${jobs.length}`);
console.log(`registro ok: ${registry.ok} · varianza stile ok: ${variance.ok}`);
console.log(`7 schermate ok: ${coverage.ok} · riferimenti Lowengeld usati: ${refs.used}/${refs.total}`);
if (!refs.ok) console.log("riferimenti non usati:", refs.missing.join(", "));
if (!registry.ok) console.log(registry);
if (!variance.ok) console.log(variance.duplicates.slice(0, 5));
