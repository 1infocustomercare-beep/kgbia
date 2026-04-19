/**
 * useDemoCompleteness
 * ─────────────────────────────────────────────────────────────────────
 * Hook che fornisce ai componenti admin/demo un riepilogo della
 * completezza del settore: agenti richiesti, moduli, blocchi sito,
 * dataset minimi attesi, e un helper `isSeed(moduleId, count)` che dice
 * se i dati attualmente presenti sono "esempio" (seed) o "reali" del lead.
 */
import { useMemo } from "react";
import {
  getDemoCompleteness,
  type SectorCompleteness,
} from "@/config/sectorCompleteness";

export interface CompletenessHelpers extends SectorCompleteness {
  /**
   * True se il modulo è popolato da seed (count <= soglia seed minima
   * dichiarata per il settore) — quindi va mostrato il badge esempio.
   */
  isSeed: (moduleId: string, currentCount: number) => boolean;
  /** True se il modulo è "critico" per la demo del settore. */
  isCritical: (moduleId: string) => boolean;
  /** Soglia di dataset attesa per il settore (semplice fast-access). */
  expected: {
    clients: number;
    orders: number;
    catalog: number;
    reviews: number;
  };
}

const moduleSeedThresholdMap = (c: SectorCompleteness): Record<string, number> => ({
  clients: c.seed.minClients,
  customers: c.seed.minClients,
  patients: c.seed.minClients,
  guests: c.seed.minClients,
  members: c.seed.minClients,
  orders: c.seed.minOrders,
  appointments: c.seed.minOrders,
  bookings: c.seed.minOrders,
  reservations: c.seed.minOrders,
  interventions: c.seed.minOrders,
  shipments: c.seed.minOrders,
  menu: c.seed.minCatalog,
  catalog: c.seed.minCatalog,
  services: c.seed.minCatalog,
  rooms: c.seed.minCatalog,
  fleet: c.seed.minCatalog,
  classes: c.seed.minCatalog,
  treatments: c.seed.minCatalog,
  products: c.seed.minCatalog,
  inventory: c.seed.minCatalog,
  reviews: c.seed.minReviews,
});

export function useDemoCompleteness(sectorId: string): CompletenessHelpers {
  return useMemo(() => {
    const completeness = getDemoCompleteness(sectorId);
    const thresholds = moduleSeedThresholdMap(completeness);
    const criticalIds = new Set(
      completeness.modules.filter((m) => m.critical).map((m) => m.id.toLowerCase()),
    );

    return {
      ...completeness,
      expected: {
        clients: completeness.seed.minClients,
        orders: completeness.seed.minOrders,
        catalog: completeness.seed.minCatalog,
        reviews: completeness.seed.minReviews,
      },
      isSeed: (moduleId: string, currentCount: number) => {
        const threshold = thresholds[moduleId.toLowerCase()];
        if (threshold == null) return currentCount > 0; // se non sappiamo, presumi seed quando ha dati
        return currentCount > 0 && currentCount <= threshold;
      },
      isCritical: (moduleId: string) => criticalIds.has(moduleId.toLowerCase()),
    };
  }, [sectorId]);
}
