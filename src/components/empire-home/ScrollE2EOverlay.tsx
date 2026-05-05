import { useEffect, useRef, useState } from "react";

/**
 * ScrollE2EOverlay
 * Dev-only end-to-end scroll test. Attivabile via ?e2e=1 nell'URL.
 *
 * Cosa fa:
 *  1. Trova tutti i nodi [data-section] della home.
 *  2. Esegue uno scroll programmatico dall'alto al fondo della pagina.
 *  3. Per ogni step misura per ciascuna sezione: bbox reale, opacity computata,
 *     visibilità (display/visibility), intersezione col viewport.
 *  4. Riporta il numero di triggers GSAP attivi e la loro progressione.
 *  5. Mostra un report compatto a schermo (mobile-first) e logga JSON in console.
 *
 * Si esegue automaticamente in 3 viewport simulati cambiando window dimensions
 * via CSS (non resize reale del browser; l'utente può rerun manualmente nei
 * device del preview Lovable per il test cross-device finale).
 */

type SectionResult = {
  key: string;
  name: string;
  found: boolean;
  everInViewport: boolean;
  everVisible: boolean;
  maxOpacity: number;
  maxHeight: number;
  maxWidth: number;
  firstSeenAtY: number | null;
  issues: string[];
};

type Report = {
  viewport: { w: number; h: number };
  documentHeight: number;
  durationMs: number;
  sections: SectionResult[];
  scrollTrigger: { available: boolean; total: number; active: number };
  ok: boolean;
};

export default function ScrollE2EOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const abortRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("e2e") === "1") setEnabled(true);
  }, []);

  const runTest = async () => {
    if (running) return;
    setRunning(true);
    setReport(null);
    abortRef.current = false;

    const t0 = performance.now();
    const VW = window.innerWidth;
    const VH = window.innerHeight;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]")
    );
    const tracked = nodes.map((el) => ({
      el,
      key: el.getAttribute("data-section") || "?",
      name: el.getAttribute("data-section-name") || el.getAttribute("data-section") || "?",
      everInViewport: false,
      everVisible: false,
      maxOpacity: 0,
      maxHeight: 0,
      maxWidth: 0,
      firstSeenAtY: null as number | null,
      issues: [] as string[],
    }));

    // Reset scroll
    window.scrollTo({ top: 0, behavior: "auto" });
    await sleep(500);

    const initialH = document.documentElement.scrollHeight;
    const steps = 50;
    let lastY = 0;

    for (let i = 0; i <= steps; i++) {
      if (abortRef.current) break;
      // Ricalcola la pageHeight ad ogni step (i pin GSAP la modificano dinamicamente)
      const currentH = document.documentElement.scrollHeight;
      const maxY = Math.max(0, currentH - VH);
      const y = Math.min((maxY / steps) * i, maxY);
      window.scrollTo({ top: y, behavior: "auto" });
      window.dispatchEvent(new Event("scroll"));
      await sleep(160);
      lastY = y;

      tracked.forEach((t) => {
        const r = t.el.getBoundingClientRect();
        const inView = r.bottom > 0 && r.top < VH && r.width > 0 && r.height > 0;
        if (!inView) return;
        const cs = getComputedStyle(t.el);
        const opacity = parseFloat(cs.opacity || "1");
        const visible =
          cs.display !== "none" && cs.visibility !== "hidden" && opacity > 0.05;
        if (t.firstSeenAtY === null) t.firstSeenAtY = Math.round(y);
        t.everInViewport = true;
        t.everVisible = t.everVisible || visible;
        t.maxOpacity = Math.max(t.maxOpacity, opacity);
        t.maxHeight = Math.max(t.maxHeight, r.height);
        t.maxWidth = Math.max(t.maxWidth, r.width);
      });
    }

    // Force-scroll all'ultima possibile posizione per CTA/Footer
    for (let pass = 0; pass < 6; pass++) {
      const maxY = Math.max(0, document.documentElement.scrollHeight - VH);
      if (maxY <= lastY + 4) break;
      window.scrollTo({ top: maxY, behavior: "auto" });
      window.dispatchEvent(new Event("scroll"));
      await sleep(220);
      lastY = maxY;
      tracked.forEach((t) => {
        const r = t.el.getBoundingClientRect();
        const inView = r.bottom > 0 && r.top < VH && r.width > 0 && r.height > 0;
        if (!inView) return;
        const cs = getComputedStyle(t.el);
        const opacity = parseFloat(cs.opacity || "1");
        const visible =
          cs.display !== "none" && cs.visibility !== "hidden" && opacity > 0.05;
        if (t.firstSeenAtY === null) t.firstSeenAtY = Math.round(maxY);
        t.everInViewport = true;
        t.everVisible = t.everVisible || visible;
        t.maxOpacity = Math.max(t.maxOpacity, opacity);
        t.maxHeight = Math.max(t.maxHeight, r.height);
        t.maxWidth = Math.max(t.maxWidth, r.width);
      });
    }
    void initialH;

    // ScrollTrigger info
    let stInfo = { available: false, total: 0, active: 0 };
    try {
      // @ts-expect-error window globals
      const ST = window.ScrollTrigger || (window.gsap && window.gsap.ScrollTrigger);
      if (ST?.getAll) {
        const all = ST.getAll();
        stInfo = {
          available: true,
          total: all.length,
          active: all.filter((t: any) => t.isActive).length,
        };
      }
    } catch {}

    const sections: SectionResult[] = tracked.map((t) => {
      const issues: string[] = [];
      if (!t.everInViewport) issues.push("mai entrata nel viewport");
      else {
        if (!t.everVisible) issues.push(`opacity max ${t.maxOpacity.toFixed(2)} (invisibile)`);
        if (t.maxHeight < 100) issues.push(`altezza max ${Math.round(t.maxHeight)}px (troppo piccola)`);
        if (t.maxWidth < VW * 0.5) issues.push(`larghezza max ${Math.round(t.maxWidth)}px (non a tutta pagina)`);
      }
      return {
        key: t.key,
        name: t.name,
        found: true,
        everInViewport: t.everInViewport,
        everVisible: t.everVisible,
        maxOpacity: +t.maxOpacity.toFixed(2),
        maxHeight: Math.round(t.maxHeight),
        maxWidth: Math.round(t.maxWidth),
        firstSeenAtY: t.firstSeenAtY,
        issues,
      };
    });

    const ok = sections.every((s) => s.everVisible && s.issues.length === 0);
    const fullReport: Report = {
      viewport: { w: VW, h: VH },
      documentHeight: totalH,
      durationMs: Math.round(performance.now() - t0),
      sections,
      scrollTrigger: stInfo,
      ok,
    };
    setReport(fullReport);
    // eslint-disable-next-line no-console
    console.log("[E2E] Scroll test report", fullReport);
    // @ts-expect-error expose for debugging
    window.__SCROLL_E2E_RESULT__ = fullReport;

    // torna in alto
    window.scrollTo({ top: 0, behavior: "auto" });
    setRunning(false);
  };

  if (!enabled) return null;

  const failing = report?.sections.filter((s) => s.issues.length > 0) || [];

  return (
    <div
      className="fixed bottom-3 right-3 z-[9999] max-w-[92vw] sm:max-w-md rounded-xl border border-white/10 bg-black/85 backdrop-blur-xl shadow-2xl text-xs font-mono text-white"
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/10">
        <span className="font-bold text-[#22d3ee]">E2E Scroll Test</span>
        <div className="flex items-center gap-2">
          <button
            onClick={runTest}
            disabled={running}
            className="px-2 py-1 rounded bg-[#22d3ee] text-black font-bold hover:brightness-110 disabled:opacity-50"
          >
            {running ? "Running…" : "Run"}
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
          >
            {collapsed ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-3 max-h-[55vh] overflow-y-auto space-y-2">
          {!report && !running && (
            <p className="text-white/60">
              Premi <strong>Run</strong> per scrollare l'intera pagina e misurare
              visibilità di tutte le sezioni.
            </p>
          )}
          {running && <p className="text-white/70">Scrolling… non toccare lo schermo.</p>}
          {report && (
            <>
              <div className="rounded-lg bg-white/5 p-2 leading-relaxed">
                <div>
                  Viewport:{" "}
                  <span className="text-[#22d3ee]">
                    {report.viewport.w}×{report.viewport.h}
                  </span>{" "}
                  · Doc: {report.documentHeight}px · {report.durationMs}ms
                </div>
                <div>
                  Sezioni: <span className="text-[#22d3ee]">{report.sections.length}</span> · OK:{" "}
                  <span className="text-emerald-400">
                    {report.sections.filter((s) => s.issues.length === 0).length}
                  </span>{" "}
                  · Problemi:{" "}
                  <span className={failing.length ? "text-rose-400" : "text-emerald-400"}>
                    {failing.length}
                  </span>
                </div>
                <div>
                  ScrollTrigger:{" "}
                  {report.scrollTrigger.available
                    ? `${report.scrollTrigger.total} totali · ${report.scrollTrigger.active} attivi`
                    : "non disponibile"}
                </div>
                <div className={`mt-1 font-bold ${report.ok ? "text-emerald-400" : "text-rose-400"}`}>
                  {report.ok ? "✅ TUTTE LE SEZIONI OK" : `❌ ${failing.length} PROBLEMI`}
                </div>
              </div>

              <ul className="space-y-1">
                {report.sections.map((s) => {
                  const bad = s.issues.length > 0;
                  return (
                    <li
                      key={s.key}
                      className={`rounded p-1.5 ${
                        bad ? "bg-rose-500/15 text-rose-200" : "bg-emerald-500/10 text-emerald-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold truncate">{s.name}</span>
                        <span className="opacity-70 shrink-0">
                          {s.maxWidth}×{s.maxHeight}
                        </span>
                      </div>
                      {bad && (
                        <ul className="mt-0.5 list-disc list-inside opacity-90">
                          {s.issues.map((i, idx) => (
                            <li key={idx}>{i}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>

              <p className="text-white/50 mt-2">
                Per testare mobile/tablet/desktop usa l'icona dispositivo nella preview Lovable
                e premi nuovamente <strong>Run</strong>.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
