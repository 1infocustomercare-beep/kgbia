import { useEffect, useState } from "react";
import {
  getActiveTenant,
  subscribeActiveTenant,
  type ActiveTenant,
} from "@/lib/active-tenant";

/**
 * React hook exposing the current active tenant + reacting to cross-tab
 * changes. Use inside guards / layouts that depend on tenant context.
 */
export const useActiveTenant = () => {
  const [tenant, setTenant] = useState<ActiveTenant | null>(() => getActiveTenant());

  useEffect(() => {
    const unsub = subscribeActiveTenant((event) => {
      if (event.type === "set") setTenant(event.tenant);
      else setTenant(null);
    });
    // Re-sync on mount in case storage changed before listener attached
    setTenant(getActiveTenant());
    return unsub;
  }, []);

  return tenant;
};
