/**
 * Returns the canonical public origin used for sharing links with leads/clients.
 *
 * Why: When a Partner is inside the Lovable preview iframe (id-preview--*.lovable.app
 * or *.lovableproject.com), `window.location.origin` points at the sandbox/preview
 * URL which requires Lovable auth and does NOT serve mockup/demo content properly
 * to public visitors. Sharing those URLs makes recipients land on a stock auth-bridge
 * page or, in the wrong sandbox build, on an unrelated template.
 *
 * For shareable links we always want the published Empire AI domain.
 */
const PUBLIC_HOSTS_ALLOWLIST = [
  "empireia.lovable.app",
];

export function getPublicShareOrigin(): string {
  if (typeof window === "undefined") return "https://empireia.lovable.app";
  const host = window.location.hostname;

  // Already on a public/published host → use as-is so cross-domain rules stay correct.
  if (PUBLIC_HOSTS_ALLOWLIST.includes(host)) return window.location.origin;

  // Custom domain in the future: pass-through if it's not the preview sandbox.
  const isPreviewSandbox =
    host.endsWith("lovableproject.com") ||
    host.endsWith("lovable.dev") ||
    host.includes("id-preview--") ||
    host.endsWith("lovable.app") === false ? false : host.startsWith("id-preview--");

  if (isPreviewSandbox) return "https://empireia.lovable.app";

  // Fallback: keep current origin (covers custom domains we add later).
  return window.location.origin;
}

/** Build a /preview/mockup/{slug} link that works for public viewers. */
export function buildPublicMockupUrl(slug: string): string {
  return `${getPublicShareOrigin()}/preview/mockup/${slug}`;
}

/** Build a /preview/custom/{slug} link that works for public viewers. */
export function buildPublicCustomPreviewUrl(slug: string): string {
  return `${getPublicShareOrigin()}/preview/custom/${slug}`;
}
