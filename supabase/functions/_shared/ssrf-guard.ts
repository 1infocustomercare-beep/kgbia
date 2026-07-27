// SSRF guard: validate a user-supplied URL before server-side fetch.
// - Only http/https schemes
// - Reject private, loopback, link-local, and cloud metadata addresses
// - Resolves DNS and rechecks every resolved IP
// - Provides safeFetch with timeout + response size cap

const PRIVATE_V4 = [
  /^0\./,
  /^10\./,
  /^127\./,
  /^169\.254\./,          // link-local incl. 169.254.169.254
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // 100.64/10 CGNAT
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^192\.0\.0\./,
  /^192\.0\.2\./,
  /^198\.(1[89])\./,
  /^198\.51\.100\./,
  /^203\.0\.113\./,
  /^22[4-9]\./, /^23\d\./, // multicast
  /^24\d\./, /^25[0-5]\./, // reserved/broadcast
];

function isPrivateIPv4(ip: string): boolean {
  return PRIVATE_V4.some((r) => r.test(ip));
}

function isPrivateIPv6(ip: string): boolean {
  const s = ip.toLowerCase();
  if (s === "::1" || s === "::" ) return true;
  if (s.startsWith("fe80:") || s.startsWith("fc") || s.startsWith("fd")) return true;
  // IPv4-mapped
  const m = s.match(/::ffff:(\d+\.\d+\.\d+\.\d+)/);
  if (m) return isPrivateIPv4(m[1]);
  return false;
}

function isIPv4(host: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
}

async function resolveHost(host: string): Promise<string[]> {
  // Deno.resolveDns is available on Deno Deploy / Supabase Edge
  try {
    // deno-lint-ignore no-explicit-any
    const D: any = (globalThis as any).Deno;
    if (!D?.resolveDns) return [];
    const [a, aaaa] = await Promise.allSettled([
      D.resolveDns(host, "A"),
      D.resolveDns(host, "AAAA"),
    ]);
    const ips: string[] = [];
    if (a.status === "fulfilled") ips.push(...a.value);
    if (aaaa.status === "fulfilled") ips.push(...aaaa.value);
    return ips;
  } catch {
    return [];
  }
}

export interface SsrfCheckResult {
  ok: boolean;
  reason?: string;
  url?: URL;
}

export async function assertSafeUrl(rawUrl: string): Promise<SsrfCheckResult> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { ok: false, reason: "invalid_url" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, reason: "unsupported_scheme" };
  }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (!host) return { ok: false, reason: "empty_host" };
  const lower = host.toLowerCase();
  if (lower === "localhost" || lower.endsWith(".localhost") || lower.endsWith(".internal") || lower.endsWith(".local")) {
    return { ok: false, reason: "internal_host" };
  }
  // Literal IP in hostname
  if (isIPv4(host) && isPrivateIPv4(host)) return { ok: false, reason: "private_ip" };
  if (host.includes(":") && isPrivateIPv6(host)) return { ok: false, reason: "private_ip" };

  // Resolve DNS and re-check
  const ips = await resolveHost(host);
  for (const ip of ips) {
    if (isIPv4(ip) ? isPrivateIPv4(ip) : isPrivateIPv6(ip)) {
      return { ok: false, reason: "resolves_to_private_ip" };
    }
  }
  return { ok: true, url };
}

export async function safeFetch(
  rawUrl: string,
  init: RequestInit = {},
  opts: { timeoutMs?: number; maxBytes?: number } = {},
): Promise<Response> {
  const check = await assertSafeUrl(rawUrl);
  if (!check.ok) {
    throw new Error(`ssrf_blocked:${check.reason}`);
  }
  const timeoutMs = opts.timeoutMs ?? 10_000;
  const maxBytes = opts.maxBytes ?? 5_000_000; // 5MB cap
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch(check.url!.toString(), {
      ...init,
      signal: ctrl.signal,
      redirect: "manual", // block redirects to internal targets
    });
    // If server tried to redirect, validate the target before following
    if (resp.status >= 300 && resp.status < 400) {
      const loc = resp.headers.get("location");
      if (!loc) return resp;
      const nextUrl = new URL(loc, check.url!).toString();
      clearTimeout(t);
      return await safeFetch(nextUrl, init, { timeoutMs, maxBytes });
    }
    // Cap response size
    const len = Number(resp.headers.get("content-length") || 0);
    if (len && len > maxBytes) {
      throw new Error("ssrf_response_too_large");
    }
    return resp;
  } finally {
    clearTimeout(t);
  }
}
