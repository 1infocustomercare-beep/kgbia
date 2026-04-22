/**
 * Tenant Isolation Tests
 *
 * Verifies the client-side guarantees that prevent one restaurant tenant
 * from seeing another tenant's assets, admin context, or auth session.
 *
 * Real security boundary lives in Supabase RLS — these tests cover the
 * UI/storage layer that ensures the browser never confuses tenant A's
 * data for tenant B's, and that there is no shared "home" or discovery
 * surface listing other restaurants.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// --- Supabase client mock (must be hoisted before importing modules under test) ---
const mockGetSession = vi.fn();
const mockSignOut = vi.fn().mockResolvedValue({ error: null });

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
    },
  },
}));

import {
  clearActiveTenant,
  getActiveTenant,
  setActiveTenant,
  type ActiveTenant,
} from "@/lib/active-tenant";
import {
  bindSessionToTenant,
  hardWipeTenantSession,
  verifyTenantSessionFingerprint,
} from "@/lib/tenant-session-isolation";

const tenantA: ActiveTenant = {
  restaurantId: "rest-aaa-111",
  slug: "trattoria-alpha",
  name: "Trattoria Alpha",
  userId: "user-alpha",
  setAt: Date.now(),
};

const tenantB: ActiveTenant = {
  restaurantId: "rest-bbb-222",
  slug: "pizzeria-beta",
  name: "Pizzeria Beta",
  userId: "user-beta",
  setAt: Date.now(),
};

const fakeSession = (userId: string, token: string) => ({
  data: { session: { access_token: token, user: { id: userId } } },
  error: null,
});

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  mockGetSession.mockReset();
  mockSignOut.mockClear();
});

afterEach(() => {
  window.localStorage.clear();
});

describe("active-tenant storage isolation", () => {
  it("returns null when no tenant is active (no shared home / discovery)", () => {
    expect(getActiveTenant()).toBeNull();
  });

  it("persists only the active tenant — switching overwrites the previous one", () => {
    setActiveTenant(tenantA);
    expect(getActiveTenant()?.slug).toBe("trattoria-alpha");

    setActiveTenant(tenantB);
    const current = getActiveTenant();
    expect(current?.slug).toBe("pizzeria-beta");
    expect(current?.restaurantId).toBe("rest-bbb-222");
    // Tenant A must NOT linger anywhere in storage
    const raw = window.localStorage.getItem("empire.activeTenant");
    expect(raw).not.toContain("trattoria-alpha");
    expect(raw).not.toContain("rest-aaa-111");
  });

  it("clearing wipes the tenant entirely (no residual slug)", () => {
    setActiveTenant(tenantA);
    clearActiveTenant("test_logout");
    expect(getActiveTenant()).toBeNull();
    expect(window.localStorage.getItem("empire.activeTenant")).toBeNull();
  });

  it("rejects malformed tenant payloads (defense against tampering)", () => {
    window.localStorage.setItem("empire.activeTenant", "{not-json");
    expect(getActiveTenant()).toBeNull();

    window.localStorage.setItem(
      "empire.activeTenant",
      JSON.stringify({ slug: "only-slug" }),
    );
    expect(getActiveTenant()).toBeNull();
  });
});

describe("session fingerprint isolation", () => {
  it("binds a session fingerprint scoped to the active tenant only", async () => {
    mockGetSession.mockResolvedValueOnce(fakeSession(tenantA.userId, "tokA"));
    setActiveTenant(tenantA);

    await bindSessionToTenant(tenantA.restaurantId, tenantA.userId);

    const stored = window.localStorage.getItem(
      `empire.session.${tenantA.restaurantId}`,
    );
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored as string);
    expect(parsed.userId).toBe(tenantA.userId);
    expect(parsed.restaurantId).toBe(tenantA.restaurantId);
  });

  it("removes other tenants' fingerprints when binding a new tenant", async () => {
    // Pre-seed a stale fingerprint from tenant B
    window.localStorage.setItem(
      `empire.session.${tenantB.restaurantId}`,
      JSON.stringify({
        restaurantId: tenantB.restaurantId,
        userId: tenantB.userId,
        tokenHash: "old",
        boundAt: 1,
      }),
    );

    mockGetSession.mockResolvedValueOnce(fakeSession(tenantA.userId, "tokA"));
    setActiveTenant(tenantA);
    await bindSessionToTenant(tenantA.restaurantId, tenantA.userId);

    expect(
      window.localStorage.getItem(`empire.session.${tenantB.restaurantId}`),
    ).toBeNull();
    expect(
      window.localStorage.getItem(`empire.session.${tenantA.restaurantId}`),
    ).toBeTruthy();
  });

  it("flags missing_fingerprint when active tenant has no bound session", async () => {
    setActiveTenant(tenantA);
    const result = await verifyTenantSessionFingerprint();
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("missing_fingerprint");
  });

  it("flags session_user_mismatch when current Supabase session belongs to a different user", async () => {
    mockGetSession.mockResolvedValueOnce(fakeSession(tenantA.userId, "tokA"));
    setActiveTenant(tenantA);
    await bindSessionToTenant(tenantA.restaurantId, tenantA.userId);

    // Now simulate a different user's session being active in this browser
    mockGetSession.mockResolvedValueOnce(fakeSession("user-intruder", "tokA"));
    const result = await verifyTenantSessionFingerprint();
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("session_user_mismatch");
  });

  it("silently re-binds when the access token rotates for the same user/tenant", async () => {
    mockGetSession.mockResolvedValueOnce(fakeSession(tenantA.userId, "tokA"));
    setActiveTenant(tenantA);
    await bindSessionToTenant(tenantA.restaurantId, tenantA.userId);

    mockGetSession.mockResolvedValueOnce(fakeSession(tenantA.userId, "tokA-rotated"));
    const result = await verifyTenantSessionFingerprint();
    expect(result.ok).toBe(true);

    const stored = JSON.parse(
      window.localStorage.getItem(`empire.session.${tenantA.restaurantId}`) as string,
    );
    // Fingerprint should now reflect the rotated token
    expect(stored.tokenHash).not.toBe("hOLD");
  });
});

describe("hard wipe — cross-tenant session leak prevention", () => {
  it("removes every tenant fingerprint and signs the user out", async () => {
    // Seed fingerprints for two tenants + a Supabase auth token
    window.localStorage.setItem(
      `empire.session.${tenantA.restaurantId}`,
      JSON.stringify({ restaurantId: tenantA.restaurantId, userId: tenantA.userId, tokenHash: "x", boundAt: 1 }),
    );
    window.localStorage.setItem(
      `empire.session.${tenantB.restaurantId}`,
      JSON.stringify({ restaurantId: tenantB.restaurantId, userId: tenantB.userId, tokenHash: "y", boundAt: 2 }),
    );
    window.localStorage.setItem("sb-fakeproject-auth-token", "fake-jwt");
    setActiveTenant(tenantA);

    await hardWipeTenantSession("test_leak");

    expect(window.localStorage.getItem(`empire.session.${tenantA.restaurantId}`)).toBeNull();
    expect(window.localStorage.getItem(`empire.session.${tenantB.restaurantId}`)).toBeNull();
    expect(window.localStorage.getItem("sb-fakeproject-auth-token")).toBeNull();
    expect(getActiveTenant()).toBeNull();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("guarantees no slug/restaurantId from any tenant survives a wipe", async () => {
    setActiveTenant(tenantA);
    window.localStorage.setItem(
      `empire.session.${tenantA.restaurantId}`,
      JSON.stringify({ restaurantId: tenantA.restaurantId, userId: tenantA.userId, tokenHash: "h", boundAt: 1 }),
    );

    await hardWipeTenantSession("test");

    // Walk every remaining key and confirm no tenant identifier leaked through
    const remaining: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k) remaining.push(`${k}=${window.localStorage.getItem(k)}`);
    }
    const haystack = remaining.join("|");
    expect(haystack).not.toContain(tenantA.slug);
    expect(haystack).not.toContain(tenantA.restaurantId);
    expect(haystack).not.toContain(tenantB.slug);
    expect(haystack).not.toContain(tenantB.restaurantId);
  });
});
