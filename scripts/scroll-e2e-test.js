/**
 * E2E Scroll Test (browser-injected)
 * Valuta per ogni sezione della home:
 *  - presenza nel DOM
 *  - bounding box reale (width/height > 0)
 *  - visibilità computata (display/opacity/visibility)
 *  - intersezione con viewport durante scroll progressivo
 *  - sincronizzazione effetti GSAP (ScrollTrigger triggers attivi)
 *
 * Restituisce un JSON serializzabile via window.__SCROLL_E2E_RESULT__
 */
(async () => {
  const VIEWPORT = { w: window.innerWidth, h: window.innerHeight };

  // Selettori delle 20 sezioni della home (per ordine di apparizione)
  const sectionTargets = [
    { name: "1. Hero V3",            sel: "#hero-v2, [data-section='hero-v3'], section:has(> div h1)" },
    { name: "2. Glowy Waves",        sel: "#manifesto-waves" },
    { name: "3. Shift Section",      sel: "[data-section='shift']" },
    { name: "4. Cursor Particles",   sel: "canvas + p, section canvas" },
    { name: "5. Mockup Showcase",    sel: "#mockups, [data-section='mockup-showcase']" },
    { name: "6. Stacked Panels",     sel: "#stacked-mockups" },
    { name: "7. Mountain Scene",     sel: "[data-section='mountain']" },
    { name: "8. Sector Reel",        sel: "#sector-reel, [data-section='sector-reel']" },
    { name: "8B. Mockup Catalog",    sel: "[data-section='mockup-catalog']" },
    { name: "9. Scroll Morph Hero",  sel: "[data-section='scroll-morph']" },
    { name: "10. Case Study",        sel: "#case-study, [data-section='case-study']" },
    { name: "11. Flow Field",        sel: "[data-section='flow-field']" },
    { name: "12. Feature Carousel",  sel: "#features" },
    { name: "13. Agents Catalog",    sel: "[data-section='agents']" },
    { name: "14. Card Stack",        sel: "[data-section='card-stack']" },
    { name: "15. Neon Orbs",         sel: "[data-section='neon-orbs']" },
    { name: "16. Proof Horizontal",  sel: "[data-section='proof']" },
    { name: "17. Neon Flow",         sel: "[data-section='neon-flow']" },
    { name: "18. Cinematic Hero 21", sel: "[data-section='cinematic-21']" },
    { name: "19. Magnetic CTA",      sel: "[data-section='magnetic-cta']" },
    { name: "20. Footer",            sel: "footer, [data-section='footer']" },
  ];

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Step 1: scrolla lentamente fino in fondo per triggerare LazyMount + GSAP
  const totalH = document.documentElement.scrollHeight;
  const steps = 30;
  const stepPx = totalH / steps;
  const visibilityLog = {};

  // Disattiva eventuale Lenis per scroll diretto
  try { window.scrollTo({ top: 0, behavior: "auto" }); } catch {}
  await sleep(400);

  for (let i = 0; i <= steps; i++) {
    const y = Math.min(stepPx * i, totalH - VIEWPORT.h);
    window.scrollTo({ top: y, behavior: "auto" });
    await sleep(180);

    sectionTargets.forEach((t) => {
      const el = document.querySelector(t.sel);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const inView = r.bottom > 0 && r.top < VIEWPORT.h && r.width > 0 && r.height > 0;
      if (inView) {
        const cs = getComputedStyle(el);
        const opacity = parseFloat(cs.opacity);
        const visible = cs.display !== "none" && cs.visibility !== "hidden" && opacity > 0.05;
        visibilityLog[t.name] = visibilityLog[t.name] || {
          firstSeenAtY: y, maxOpacity: 0, hadSize: false, everVisible: false, height: 0, width: 0,
        };
        const log = visibilityLog[t.name];
        log.maxOpacity = Math.max(log.maxOpacity, opacity);
        log.hadSize = log.hadSize || (r.width > 50 && r.height > 50);
        log.everVisible = log.everVisible || visible;
        log.height = Math.max(log.height, r.height);
        log.width = Math.max(log.width, r.width);
      }
    });
  }

  // Step 2: esamina ScrollTrigger
  let stInfo = { available: false, count: 0, triggers: [] };
  if (window.ScrollTrigger || (window.gsap && window.gsap.core)) {
    try {
      const ST = window.ScrollTrigger || (window.gsap && window.gsap.ScrollTrigger);
      if (ST && ST.getAll) {
        const triggers = ST.getAll();
        stInfo.available = true;
        stInfo.count = triggers.length;
        stInfo.triggers = triggers.slice(0, 30).map((t, idx) => ({
          idx,
          trigger: t.trigger ? (t.trigger.id || t.trigger.tagName + (t.trigger.className ? "." + String(t.trigger.className).split(" ")[0] : "")) : "n/a",
          start: t.start, end: t.end, progress: +t.progress.toFixed(2), isActive: t.isActive,
        }));
      }
    } catch (e) { stInfo.error = String(e); }
  }

  // Step 3: report finale
  const report = {
    viewport: VIEWPORT,
    documentHeight: totalH,
    sectionsTotal: sectionTargets.length,
    sectionsFound: 0,
    sectionsVisible: 0,
    issues: [],
    perSection: {},
    scrollTrigger: stInfo,
  };

  sectionTargets.forEach((t) => {
    const el = document.querySelector(t.sel);
    const log = visibilityLog[t.name];
    if (!el) {
      report.issues.push(`❌ NOT FOUND: ${t.name} (selector: ${t.sel})`);
      report.perSection[t.name] = { found: false };
      return;
    }
    report.sectionsFound++;
    if (!log) {
      report.issues.push(`⚠️ NEVER IN VIEWPORT: ${t.name}`);
      report.perSection[t.name] = { found: true, everVisible: false };
      return;
    }
    if (!log.everVisible) {
      report.issues.push(`⚠️ INVISIBLE (opacity/display): ${t.name}`);
    } else {
      report.sectionsVisible++;
    }
    if (!log.hadSize) {
      report.issues.push(`⚠️ NO SIZE: ${t.name}`);
    }
    if (log.height < 100) {
      report.issues.push(`⚠️ TOO SMALL (h=${Math.round(log.height)}px): ${t.name}`);
    }
    report.perSection[t.name] = { found: true, ...log };
  });

  window.__SCROLL_E2E_RESULT__ = report;
  console.log("=== E2E SCROLL TEST COMPLETE ===");
  console.log(JSON.stringify(report, null, 2));
  return report;
})();
