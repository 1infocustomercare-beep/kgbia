import { useEffect } from "react";

/**
 * Premium effects layer — PURE ADDITIVE.
 * Mounted once inside EmpirePrestigeHome. Auto-binds to existing DOM nodes:
 *  - Renders fixed aurora/mesh background + light beams + grain (behind content)
 *  - Scroll-reveal on every <section data-section="..."> via IntersectionObserver
 *  - 3D tilt on .prestige-card / .prestige-card-gilt (desktop pointer only)
 *  - Magnetic micro-interaction on .prestige-cta / .prestige-cta-ghost
 *  - Count-up on elements marked [data-countup] (auto-detects leading digits)
 * All effects respect prefers-reduced-motion and (pointer: coarse) media queries.
 * No layout changes, no component duplication, no new heavy dependencies.
 */
export default function PrestigeEffects() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;

    // ── Scroll reveal ────────────────────────────────────────────────
    const revealTargets = document.querySelectorAll<HTMLElement>(
      "[data-section]:not([data-no-reveal])"
    );
    revealTargets.forEach((el) => el.classList.add("prestige-reveal"));

    const reveal = (el: Element) => el.classList.add("is-revealed");
    if (prefersReduced || isCoarse) {
      revealTargets.forEach(reveal);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        });
      },
      // Fire as soon as ANY part of the section enters the viewport (top-only trigger)
      { threshold: 0, rootMargin: "0px 0px -5% 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));

    // Safety fallback: on every scroll, force-reveal anything whose top is above the viewport bottom.
    // Guards against IntersectionObserver missing tall pinned sections under Lenis smooth-scroll.
    const onScrollFallback = () => {
      const vh = window.innerHeight;
      revealTargets.forEach((el) => {
        if (el.classList.contains("is-revealed")) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.95) reveal(el);
      });
    };
    onScrollFallback();
    window.addEventListener("scroll", onScrollFallback, { passive: true });


    // ── 3D tilt on cards (desktop only) ──────────────────────────────
    const tiltCleanups: Array<() => void> = [];
    if (!prefersReduced && !isCoarse) {
      const cards = document.querySelectorAll<HTMLElement>(
        ".prestige-card, .prestige-card-gilt"
      );
      cards.forEach((card) => {
        card.classList.add("prestige-tilt");
        let rafId = 0;
        const onMove = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            card.style.setProperty("--tilt-x", (y * -6).toFixed(2) + "deg");
            card.style.setProperty("--tilt-y", (x * 8).toFixed(2) + "deg");
            card.style.setProperty("--spot-x", (x * 100 + 50).toFixed(1) + "%");
            card.style.setProperty("--spot-y", (y * 100 + 50).toFixed(1) + "%");
          });
        };
        const onLeave = () => {
          cancelAnimationFrame(rafId);
          card.style.setProperty("--tilt-x", "0deg");
          card.style.setProperty("--tilt-y", "0deg");
        };
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        tiltCleanups.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
          card.classList.remove("prestige-tilt");
        });
      });
    }

    // ── Magnetic CTA (desktop only) ──────────────────────────────────
    const magCleanups: Array<() => void> = [];
    if (!prefersReduced && !isCoarse) {
      const ctas = document.querySelectorAll<HTMLElement>(
        ".prestige-cta, .prestige-cta-ghost"
      );
      ctas.forEach((btn) => {
        btn.classList.add("prestige-magnetic");
        const onMove = (e: PointerEvent) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          btn.style.setProperty("--mag-x", (x * 10).toFixed(1) + "px");
          btn.style.setProperty("--mag-y", (y * 6).toFixed(1) + "px");
        };
        const onLeave = () => {
          btn.style.setProperty("--mag-x", "0px");
          btn.style.setProperty("--mag-y", "0px");
        };
        btn.addEventListener("pointermove", onMove);
        btn.addEventListener("pointerleave", onLeave);
        magCleanups.push(() => {
          btn.removeEventListener("pointermove", onMove);
          btn.removeEventListener("pointerleave", onLeave);
        });
      });
    }

    // ── Count-up on [data-countup] ───────────────────────────────────
    const countTargets = document.querySelectorAll<HTMLElement>("[data-countup]");
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const raw = el.textContent || "";
          const match = raw.match(/(\D*)([\d.,]+)(.*)/);
          if (!match) {
            countIO.unobserve(el);
            return;
          }
          const [, prefix, numStr, suffix] = match;
          const sep = numStr.includes(".") && numStr.lastIndexOf(".") < numStr.length - 3 ? "." : "";
          const clean = numStr.replace(/[.,](?=\d{3}\b)/g, "");
          const target = parseFloat(clean.replace(",", "."));
          if (!isFinite(target)) {
            countIO.unobserve(el);
            return;
          }
          if (prefersReduced) {
            countIO.unobserve(el);
            return;
          }
          const duration = 1400;
          const t0 = performance.now();
          const decimals = (clean.split(".")[1] || "").length;
          const fmt = (n: number) => {
            const fixed = n.toFixed(decimals);
            if (!sep) return fixed;
            const [int, dec] = fixed.split(".");
            return int.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (dec ? "." + dec : "");
          };
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + fmt(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          countIO.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    countTargets.forEach((el) => countIO.observe(el));

    // ── Parallax on [data-parallax="<depth-px>"] ─────────────────────
    const parallaxNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let parallaxRaf = 0;
    const onParallaxScroll = () => {
      if (prefersReduced) return;
      if (parallaxRaf) return;
      parallaxRaf = requestAnimationFrame(() => {
        parallaxRaf = 0;
        const vh = window.innerHeight;
        parallaxNodes.forEach((el) => {
          const depth = parseFloat(el.dataset.parallax || "40");
          const r = el.getBoundingClientRect();
          const center = r.top + r.height / 2;
          const progress = (center - vh / 2) / vh; // -1..1 across viewport
          const y = Math.max(-1.2, Math.min(1.2, progress)) * -depth;
          el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
        });
      });
    };
    onParallaxScroll();
    window.addEventListener("scroll", onParallaxScroll, { passive: true });
    window.addEventListener("resize", onParallaxScroll);

    return () => {
      io.disconnect();
      countIO.disconnect();
      window.removeEventListener("scroll", onScrollFallback);
      window.removeEventListener("scroll", onParallaxScroll);
      window.removeEventListener("resize", onParallaxScroll);
      if (parallaxRaf) cancelAnimationFrame(parallaxRaf);
      tiltCleanups.forEach((fn) => fn());
      magCleanups.forEach((fn) => fn());
    };

  }, []);

  return (
    <>
      {/* Aurora mesh + light beams — fixed, behind all content, pointer-events:none */}
      <div className="prestige-aurora" aria-hidden="true">
        <div className="prestige-aurora__layer prestige-aurora__layer--a" />
        <div className="prestige-aurora__layer prestige-aurora__layer--b" />
        <div className="prestige-aurora__layer prestige-aurora__layer--c" />
        <div className="prestige-aurora__beam prestige-aurora__beam--1" />
        <div className="prestige-aurora__beam prestige-aurora__beam--2" />
      </div>
    </>
  );
}
