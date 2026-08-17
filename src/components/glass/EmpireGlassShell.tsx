import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";
import { applyPerfTier } from "@/lib/perf-tier";

/**
 * EmpireGlassShell — applica la skin "Empire Liquid Glass" a TUTTE le pagine
 * della web app Empire (home, portfolio, pacchetti, vendor, partner, superadmin,
 * onboarding, legali...) senza toccare i siti demo/vetrine cliente, che restano
 * varianti di stile indipendenti.
 *
 * Come funziona: monta i token Prestige + la skin globale (solo CSS, scoped) e
 * aggiunge le classi `pglass-scope pglass-app` al <body> sulle rotte ammesse.
 * Nessun markup wrappato → zero rischio su layout, GSAP pin e scroll effects.
 */

/** Rotte che NON devono ricevere la skin Empire (siti demo, vetrine tenant, preview cliente). */
const EXCLUDED = [
  /^\/demo\//,
  /^\/demo-admin\//,
  /^\/preview\//,
  /^\/ncc-demo\//,
  /^\/r\//,
  /^\/b\//,
  /^\/t\//,
  /^\/kitchen/,
  /^\/staff/,
];

export function isEmpireGlassRoute(pathname: string) {
  return !EXCLUDED.some((re) => re.test(pathname));
}

export default function EmpireGlassShell() {
  const { pathname } = useLocation();
  const enabled = isEmpireGlassRoute(pathname);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    if (!enabled) return;
    body.classList.add("pglass-scope", "pglass-app");
    return () => {
      body.classList.remove("pglass-scope", "pglass-app");
    };
  }, [enabled]);

  if (!enabled) return null;
  return <PrestigeTheme />;
}
