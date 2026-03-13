const RESTAURANT_PUBLIC_INDUSTRIES = new Set(["food"]);

export function getPublicSiteBasePath(industry?: string | null): "r" | "b" {
  return industry && RESTAURANT_PUBLIC_INDUSTRIES.has(industry) ? "r" : "b";
}

export function buildPublicSiteUrl(slug: string, industry?: string | null): string {
  return `${window.location.origin}/${getPublicSiteBasePath(industry)}/${slug}`;
}
