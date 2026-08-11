/**
 * PrestigeSectorLive — "Siti settore live · navigabili"
 *
 * Griglia premium (smeraldo/avorio/oro) di siti settore reali, cliccabili.
 * Ogni card mostra un mockup rotante del settore e apre la demo pubblica
 * corrispondente (/r/:slug per food, /b/:slug per gli altri).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MousePointerClick, Sparkles } from "lucide-react";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { SECTOR_MOCKUPS } from "@/data/sector-mockups";
import { getPublicSiteBasePath } from "@/lib/public-site-path";

type Item = {
  id: IndustryId;
  label: string;
  href: string;
  images: string[];
};

const FEATURED_ORDER: IndustryId[] = [
  "food", "ncc", "beauty", "hospitality", "fitness", "healthcare",
  "construction", "veterinary", "childcare",
];

function pickImages(id: IndustryId): string[] {
  const set = new Set<string>();
  const group = SECTOR_MOCKUPS.find((g) => g.id === id);
  group?.variants
    .filter((v) => v.tier === "primary" && v.source === "studio")
    .forEach((v) => {
      const screens = v.screens.length ? v.screens : [{ image: v.screen }];
      screens.forEach((screen) => screen.image && set.add(screen.image));
    });
  return Array.from(set).slice(0, 5);
}

function buildItems(): Item[] {
  return FEATURED_ORDER
    .filter((id) => INDUSTRY_CONFIGS[id] && DEMO_SLUGS[id])
    .map((id) => {
      const slug = DEMO_SLUGS[id];
      const base = getPublicSiteBasePath(id);
      return {
        id,
        label: INDUSTRY_CONFIGS[id].label,
        href: `/${base}/${slug}`,
        images: pickImages(id),
      };
    })
    .filter((i) => i.images.length > 0);
}

/* ── Card with rotating mockup + tilt on hover ─────────────────────── */
function SectorCard({ item, index }: { item: Item; index: number }) {
  const [i, setI] = useState(0);
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const images = useMemo(
    () => item.images.filter((u) => !broken.has(u)),
    [item.images, broken],
  );
  const active = images[i % Math.max(1, images.length)];

  // Reveal on scroll
  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.unobserve(el);
        }
      },
      { rootMargin: "-8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Autoplay image cycling — staggered per card so grid feels alive
  useEffect(() => {
    if (images.length <= 1) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(
      () => setI((v) => (v + 1) % images.length),
      3600 + (index % 5) * 260,
    );
    return () => clearInterval(t);
  }, [images.length, index]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 6, ry: px * 8 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <Link
      to={item.href}
      aria-label={`Apri il sito settore ${item.label}`}
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--pr-gold))]/70 rounded-[26px]"
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="prestige-sector-card relative flex flex-col overflow-hidden rounded-[26px]"
        style={{
          transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${visible ? 0 : 24}px)`,
          opacity: visible ? 1 : 0,
          transition:
            "transform 620ms cubic-bezier(.22,1,.36,1), opacity 700ms ease",
          transitionDelay: `${Math.min(index, 8) * 70}ms`,
        }}
      >
        {/* Mockup canvas */}
        <div
          className="relative aspect-[9/12] w-full overflow-hidden"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, hsl(var(--pr-emerald-mid)/.75), hsl(var(--pr-emerald-deep)) 70%)",
          }}
        >
          {/* gold sheen */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(60% 40% at 80% 10%, hsl(var(--pr-gold)/.18), transparent 60%), radial-gradient(50% 35% at 10% 90%, hsl(var(--pr-emerald-glow)/.16), transparent 65%)",
            }}
          />

          {/* iPhone-ish mockup */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[28px] overflow-hidden"
            style={{
              width: "68%",
              aspectRatio: "9/19.5",
              boxShadow:
                "0 26px 70px -24px rgba(0,0,0,.7), 0 0 0 1px hsl(var(--pr-gold)/.25), 0 0 40px -14px hsl(var(--pr-gold)/.45)",
              border: "3px solid hsl(0 0% 4% / .9)",
              background: "#0a0a0a",
              transform: `translate(calc(-50% + ${tilt.ry * 1.2}px), calc(-50% + ${tilt.rx * 1.2}px))`,
              transition: "transform 300ms ease",
            }}
          >
            {/* notch */}
            <div
              aria-hidden
              className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl z-10"
              style={{ width: "34%", height: "3.2%", background: "#0a0a0a" }}
            />
            {active ? (
              <img
                key={active}
                src={active}
                alt={`Mockup ${item.label}`}
                loading="lazy"
                draggable={false}
                onError={() =>
                  setBroken((s) => {
                    const n = new Set(s);
                    n.add(active);
                    return n;
                  })
                }
                className="absolute inset-0 h-full w-full object-cover object-top"
                style={{
                  animation: "prestige-sector-fade 900ms ease both",
                }}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-[hsl(var(--pr-ivory))]/70 text-xs">
                Preview
              </div>
            )}
            {/* home indicator */}
            <div
              aria-hidden
              className="absolute bottom-[2%] left-1/2 -translate-x-1/2 rounded-full"
              style={{ width: "30%", height: "3px", background: "rgba(255,255,255,.22)" }}
            />
          </div>

          {/* dots indicating multiple screens */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.slice(0, 5).map((_, k) => (
                <span
                  key={k}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: k === i % images.length ? 16 : 6,
                    background:
                      k === i % images.length
                        ? "hsl(var(--pr-gold))"
                        : "hsl(var(--pr-ivory)/.35)",
                  }}
                />
              ))}
            </div>
          )}

          {/* live pill */}
          <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--pr-gold))]/40 bg-[hsl(var(--pr-emerald-deep))]/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--pr-ivory))]/85 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--pr-gold-light))] shadow-[0_0_10px_hsl(var(--pr-gold))]" />
            Live
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-3 border-t border-[hsl(var(--pr-gold))]/12 bg-[hsl(var(--pr-emerald-deep))]/85 px-4 py-3.5">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-[hsl(var(--pr-ivory))]">
              {item.label}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--pr-ivory))]/55">
              <MousePointerClick className="h-3 w-3" /> Navigabile
            </div>
          </div>
          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--pr-gold))]/45 bg-[hsl(var(--pr-gold))]/10 text-[hsl(var(--pr-gold-light))] transition-all group-hover:bg-[hsl(var(--pr-gold))] group-hover:text-[hsl(var(--pr-emerald-deep))] group-hover:scale-105"
            aria-hidden
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Section ────────────────────────────────────────────────────────── */
export default function PrestigeSectorLive() {
  const items = useMemo(buildItems, []);
  const [headVisible, setHeadVisible] = useState(false);
  const headRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!headRef.current) return;
    const el = headRef.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeadVisible(true);
          io.unobserve(el);
        }
      },
      { rootMargin: "-12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="settori-live"
      className="prestige-sector-live relative overflow-hidden py-24 sm:py-32"
      aria-labelledby="settori-live-title"
    >
      <style>{`
        @keyframes prestige-sector-fade { from { opacity: 0; transform: scale(1.03); } to { opacity: 1; transform: scale(1); } }
        @keyframes prestige-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .prestige-sector-card {
          background: linear-gradient(180deg, hsl(var(--pr-emerald)/.5), hsl(var(--pr-emerald-deep)/.9));
          border: 1px solid hsl(var(--pr-gold)/.14);
          box-shadow: 0 22px 60px -30px hsl(var(--pr-emerald-deep)), inset 0 1px 0 hsl(var(--pr-gold)/.08);
          will-change: transform, opacity;
        }
        .prestige-sector-card:hover {
          border-color: hsl(var(--pr-gold)/.45);
          box-shadow: 0 30px 80px -30px hsl(var(--pr-gold)/.35), inset 0 1px 0 hsl(var(--pr-gold)/.16);
        }
        .prestige-sector-live::before {
          content: "";
          position: absolute; inset: 0;
          background:
            radial-gradient(80% 50% at 20% 0%, hsl(var(--pr-emerald-glow)/.10), transparent 60%),
            radial-gradient(60% 40% at 90% 100%, hsl(var(--pr-gold)/.10), transparent 65%);
          pointer-events: none;
        }
        .prestige-sector-marquee {
          animation: prestige-marquee 42s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .prestige-sector-marquee, .prestige-sector-card { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headRef}
          className="mx-auto max-w-3xl text-center"
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(24px)",
            transition: "all 720ms cubic-bezier(.22,1,.36,1)",
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--pr-gold))]/30 bg-[hsl(var(--pr-emerald))]/40 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[hsl(var(--pr-gold-light))] backdrop-blur">
            <Sparkles className="h-3 w-3" /> Piattaforma reale
          </div>
          <h2
            id="settori-live-title"
            className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-[hsl(var(--pr-ivory))] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Siti settore live ·{" "}
            <span className="prestige-gold-text bg-clip-text text-transparent">
              navigabili
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-[hsl(var(--pr-ivory))]/70 sm:text-base">
            <span className="text-[hsl(var(--pr-ivory))]">Apri ogni settore.</span>{" "}
            Non screenshot finti: qui il prospect vede una piattaforma reale,
            cliccabile, già pronta per il proprio mercato.
          </p>
        </div>

        {/* Marquee of sector labels */}
        <div className="mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="prestige-sector-marquee flex w-max gap-10 whitespace-nowrap">
            {[...items, ...items].map((it, k) => (
              <span
                key={`${it.id}-${k}`}
                className="text-[11px] uppercase tracking-[0.34em] text-[hsl(var(--pr-ivory))]/45"
              >
                {it.label}
                <span className="mx-6 text-[hsl(var(--pr-gold))]/40">◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, i) => (
            <SectorCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
          <Link
            to="/demo"
            className="prestige-cta inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
          >
            Vedi tutti i settori <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--pr-gold))]/35 px-6 py-3.5 text-sm font-semibold text-[hsl(var(--pr-ivory))]/85 transition hover:border-[hsl(var(--pr-gold))]/70 hover:text-[hsl(var(--pr-ivory))]"
          >
            Esplora i mockup premium
          </Link>
        </div>
      </div>
    </section>
  );
}
