/**
 * Tenant login brute-force protection (client-side).
 *
 * Tracks failed login attempts per tenant slug + email in localStorage and
 * applies progressive lockouts. This is a defense-in-depth layer on top of
 * Supabase's own auth checks — server-side rate limiting will be added when
 * proper backend primitives are available.
 *
 * Lockout policy:
 *   - 1–2 failures: warn user, no lock
 *   - 3 failures: 30s lock
 *   - 4 failures: 2m lock
 *   - 5 failures: 10m lock
 *   - 6+ failures: 30m lock (escalates further by 30m each attempt)
 */

const STORAGE_KEY = "empire.tenant_login_attempts";
const MAX_TRACKED_ENTRIES = 50;

export interface LoginAttemptRecord {
  key: string;            // `${slug}:${emailLower}`
  slug: string;
  email: string;
  failures: number;
  lastFailureAt: number;  // epoch ms
  lockedUntil: number | null;
}

export interface ThrottleStatus {
  locked: boolean;
  remainingMs: number;     // 0 if not locked
  failures: number;
  warning: string | null;  // optional pre-lock warning message (italian)
  message: string | null;  // localized lockout message when locked
}

interface Store {
  entries: Record<string, LoginAttemptRecord>;
}

function readStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: {} };
    const parsed = JSON.parse(raw) as Store;
    if (!parsed || typeof parsed !== "object" || !parsed.entries) return { entries: {} };
    return parsed;
  } catch {
    return { entries: {} };
  }
}

function writeStore(store: Store): void {
  try {
    // Bound the size: keep the most recent N entries by lastFailureAt
    const all = Object.values(store.entries);
    if (all.length > MAX_TRACKED_ENTRIES) {
      all.sort((a, b) => b.lastFailureAt - a.lastFailureAt);
      const trimmed: Record<string, LoginAttemptRecord> = {};
      for (const e of all.slice(0, MAX_TRACKED_ENTRIES)) trimmed[e.key] = e;
      store = { entries: trimmed };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota / private mode errors
  }
}

function buildKey(slug: string, email: string): string {
  return `${slug.toLowerCase()}:${email.trim().toLowerCase()}`;
}

/** Lockout duration (ms) after `failures` consecutive failures. */
function lockoutMsForFailures(failures: number): number {
  if (failures <= 2) return 0;
  if (failures === 3) return 30 * 1000;            // 30s
  if (failures === 4) return 2 * 60 * 1000;        // 2m
  if (failures === 5) return 10 * 60 * 1000;       // 10m
  // 6+ → 30m, escalating by +30m per extra failure (cap at 4h)
  const base = 30 * 60 * 1000;
  const extra = (failures - 6) * 30 * 60 * 1000;
  return Math.min(base + extra, 4 * 60 * 60 * 1000);
}

function formatRemaining(ms: number): string {
  const totalSec = Math.max(1, Math.ceil(ms / 1000));
  if (totalSec < 60) return `${totalSec} second${totalSec === 1 ? "o" : "i"}`;
  const min = Math.ceil(totalSec / 60);
  return `${min} minut${min === 1 ? "o" : "i"}`;
}

/** Inspect current throttle state without mutating it. */
export function getLoginThrottleStatus(slug: string, email: string): ThrottleStatus {
  if (!slug || !email) {
    return { locked: false, remainingMs: 0, failures: 0, warning: null, message: null };
  }
  const store = readStore();
  const rec = store.entries[buildKey(slug, email)];
  if (!rec) return { locked: false, remainingMs: 0, failures: 0, warning: null, message: null };

  const now = Date.now();
  if (rec.lockedUntil && rec.lockedUntil > now) {
    const remainingMs = rec.lockedUntil - now;
    return {
      locked: true,
      remainingMs,
      failures: rec.failures,
      warning: null,
      message: `Troppi tentativi di accesso. Riprova tra ${formatRemaining(remainingMs)}.`,
    };
  }

  // Not locked: surface a soft warning if user is close to a lockout
  let warning: string | null = null;
  if (rec.failures === 1) {
    warning = "Credenziali errate. Restano 2 tentativi prima del blocco temporaneo.";
  } else if (rec.failures === 2) {
    warning = "Attenzione: un altro tentativo errato attiverà un blocco temporaneo.";
  }
  return { locked: false, remainingMs: 0, failures: rec.failures, warning, message: null };
}

/** Register a failed login attempt; returns the new throttle status. */
export function registerLoginFailure(slug: string, email: string): ThrottleStatus {
  if (!slug || !email) {
    return { locked: false, remainingMs: 0, failures: 0, warning: null, message: null };
  }
  const store = readStore();
  const key = buildKey(slug, email);
  const now = Date.now();
  const prev = store.entries[key];

  // If a previous lock has fully expired and 1h has passed, soft-reset failures
  let failures = prev?.failures ?? 0;
  if (prev?.lastFailureAt && now - prev.lastFailureAt > 60 * 60 * 1000) {
    failures = 0;
  }
  failures += 1;

  const lockMs = lockoutMsForFailures(failures);
  const lockedUntil = lockMs > 0 ? now + lockMs : null;

  store.entries[key] = {
    key,
    slug: slug.toLowerCase(),
    email: email.trim().toLowerCase(),
    failures,
    lastFailureAt: now,
    lockedUntil,
  };
  writeStore(store);

  if (lockedUntil) {
    return {
      locked: true,
      remainingMs: lockedUntil - now,
      failures,
      warning: null,
      message: `Troppi tentativi falliti (${failures}). Accesso bloccato per ${formatRemaining(lockedUntil - now)}.`,
    };
  }

  const remainingBeforeLock = Math.max(0, 3 - failures);
  return {
    locked: false,
    remainingMs: 0,
    failures,
    warning:
      remainingBeforeLock > 0
        ? `Credenziali errate. Restano ${remainingBeforeLock} tentativ${remainingBeforeLock === 1 ? "o" : "i"} prima del blocco.`
        : "Attenzione: un altro tentativo errato attiverà un blocco temporaneo.",
    message: null,
  };
}

/** Clear throttle state for a tenant+email after a successful login. */
export function clearLoginThrottle(slug: string, email: string): void {
  if (!slug || !email) return;
  const store = readStore();
  const key = buildKey(slug, email);
  if (store.entries[key]) {
    delete store.entries[key];
    writeStore(store);
  }
}
