/**
 * Active Tenant management — Empire Tenant-Isolated Login
 * 
 * Stores the currently active restaurant slug + id in localStorage and
 * broadcasts changes across browser tabs via BroadcastChannel + storage
 * events. RLS on Supabase tables is the real security barrier — this layer
 * ensures the UI never confuses one tenant's data for another and that
 * logout/switch in one tab kills sessions in all other tabs.
 */

const STORAGE_KEY = "empire.activeTenant";
const CHANNEL_NAME = "empire-tenant-channel";

export interface ActiveTenant {
  restaurantId: string;
  slug: string;
  name: string;
  userId: string;
  setAt: number;
}

type TenantEvent =
  | { type: "set"; tenant: ActiveTenant }
  | { type: "clear"; reason?: string };

let channel: BroadcastChannel | null = null;
const listeners = new Set<(event: TenantEvent) => void>();

const getChannel = (): BroadcastChannel | null => {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null;
  if (!channel) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.addEventListener("message", (msg) => {
        const data = msg.data as TenantEvent;
        listeners.forEach((cb) => cb(data));
      });
    } catch {
      channel = null;
    }
  }
  return channel;
};

export const getActiveTenant = (): ActiveTenant | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveTenant;
    if (!parsed?.restaurantId || !parsed?.slug || !parsed?.userId) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const setActiveTenant = (tenant: ActiveTenant): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tenant));
    getChannel()?.postMessage({ type: "set", tenant } satisfies TenantEvent);
  } catch (err) {
    console.error("[ActiveTenant] Failed to persist", err);
  }
};

export const clearActiveTenant = (reason?: string): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    getChannel()?.postMessage({ type: "clear", reason } satisfies TenantEvent);
  } catch (err) {
    console.error("[ActiveTenant] Failed to clear", err);
  }
};

/**
 * Subscribe to tenant changes across tabs. Returns an unsubscribe fn.
 * Combines BroadcastChannel (modern) + storage event (fallback).
 */
export const subscribeActiveTenant = (cb: (event: TenantEvent) => void): (() => void) => {
  listeners.add(cb);
  getChannel(); // ensure channel is initialized

  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    if (!e.newValue) {
      cb({ type: "clear", reason: "storage_event" });
    } else {
      try {
        const tenant = JSON.parse(e.newValue) as ActiveTenant;
        cb({ type: "set", tenant });
      } catch {
        // ignore malformed
      }
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
};
