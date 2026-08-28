/**
 * GDPR / Garante Privacy cookie consent helpers.
 *
 * The `CookieBanner` writes the user's choice under `gdpr_cookie_consent`.
 * Non-essential scripts (analytics, marketing pixels, remarketing tags)
 * MUST call `hasConsent("analytics" | "marketing")` before loading —
 * this is the "prior consent" requirement of the Italian Garante (2021 guidelines)
 * and art. 6/7 GDPR (Reg. UE 2016/679).
 */
export type CookieCategory = "necessary" | "analytics" | "marketing";

const CONSENT_KEY = "gdpr_cookie_consent";
export const COOKIE_CONSENT_EVENT = "gdpr:reopen-cookie-banner";

export interface CookieConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function readConsent(): CookieConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Consenso valido max 13 mesi (Provv. Garante 10/06/2021).
    if (parsed.savedAt && Date.now() - Number(parsed.savedAt) > 13 * 30 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    return {
      necessary: true,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
    };
  } catch {
    return null;
  }
}

/** True only when the user has explicitly granted the given category. */
export function hasConsent(category: CookieCategory): boolean {
  if (category === "necessary") return true;
  const c = readConsent();
  return c ? c[category] === true : false;
}

/** Re-open the cookie banner so the user can withdraw/change consent. */
export function openCookiePreferences(): void {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {}
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT));
}
