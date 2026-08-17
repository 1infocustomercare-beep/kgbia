/**
 * Esporta il manifest completo (identità + style matrix + prompt per schermata)
 * consumato da scripts/mockup-generate.py.
 *
 * Uso: bun scripts/export-mockup-manifest.ts /tmp/mockups/manifest.json
 */
import { FULL_IDENTITIES, assertRegistryIntegrity } from "../src/lib/mockup-identity-registry";
import { STYLE_RULES, assertStyleVariance, buildScreenPrompt } from "../src/lib/mockup-style-rules";

const out = process.argv[2] ?? "/tmp/mockups/manifest.json";

const registry = assertRegistryIntegrity();
const variance = assertStyleVariance();

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
    prompt: buildScreenPrompt(identity, screen.key),
  })),
);

await Bun.write(
  out,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      identities: FULL_IDENTITIES.length,
      jobs: jobs.length,
      integrity: { registry, variance },
      jobs_list: jobs,
    },
    null,
    2,
  ),
);

console.log(`manifest → ${out}`);
console.log(`identità: ${FULL_IDENTITIES.length} · schermate: ${jobs.length}`);
console.log(`registro ok: ${registry.ok} · varianza stile ok: ${variance.ok}`);
if (!registry.ok) console.log(registry);
if (!variance.ok) console.log(variance.duplicates.slice(0, 5));
