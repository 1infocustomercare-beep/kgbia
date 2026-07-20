import { useEffect } from "react";

const REF_KEY = "empire_ref";
const REF_TS_KEY = "empire_ref_ts";
const TTL_DAYS = 30;

/** Captures ?ref=<slug> from URL and persists it for 30 days. */
export function useReferralCapture() {
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const ref = url.searchParams.get("ref");
      if (ref && /^[a-z0-9-]{2,60}$/i.test(ref)) {
        localStorage.setItem(REF_KEY, ref.toLowerCase());
        localStorage.setItem(REF_TS_KEY, String(Date.now()));
      }
    } catch {}
  }, []);
}

/** Returns the current referral slug or null if expired/missing. */
export function getReferralSlug(): string | null {
  try {
    const ref = localStorage.getItem(REF_KEY);
    const ts = Number(localStorage.getItem(REF_TS_KEY) || 0);
    if (!ref || !ts) return null;
    if (Date.now() - ts > TTL_DAYS * 86400_000) {
      localStorage.removeItem(REF_KEY);
      localStorage.removeItem(REF_TS_KEY);
      return null;
    }
    return ref;
  } catch {
    return null;
  }
}
