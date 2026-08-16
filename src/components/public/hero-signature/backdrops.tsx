/**
 * ═══ SECTOR BACKDROPS ═══
 *
 * Ogni settore ha una MECCANICA visiva diversa (non solo un soggetto diverso):
 * mosaico a colonne, filmstrip, wipe, tracciato ECG, veneziana, parallasse
 * d'orizzonte, marquee, blueprint disegnato, iride, tracking shot.
 *
 * NON TOCCARE: `FitnessKineticBlades` (approvato) e il jet (pagina dedicata).
 */
import { motion, type MotionValue, useTransform } from "framer-motion";
import foodDish from "@/assets/hero-cinematic/food-flame-dish.png";
import bakeryCroissant from "@/assets/hero-cinematic/bakery-croissant.png";
import beautySerum from "@/assets/hero-cinematic/beauty-serum.png";
import fitnessDumbbell from "@/assets/hero-cinematic/fitness-dumbbell.png";
import healthcareHeart from "@/assets/hero-cinematic/healthcare-heart.png";
import hotelKey from "@/assets/hero-cinematic/hotel-key.png";
import beachYacht from "@/assets/hero-cinematic/beach-yacht.png";
import retailSneaker from "@/assets/hero-cinematic/retail-sneaker.png";
import tradesTool from "@/assets/hero-cinematic/trades-tool.png";
import luxuryWatch from "@/assets/hero-cinematic/luxury-watch.png";
import nccSedan from "@/assets/hero-cinematic/ncc-sedan-single.png";
import tradesElectrician from "@/assets/hero-cinematic/trades-electrician.png";
import tradesPlumber from "@/assets/hero-cinematic/trades-plumber.png";
import tradesConstruction from "@/assets/hero-cinematic/trades-construction.png";
import tradesGardening from "@/assets/hero-cinematic/trades-gardening.png";
import tradesCleaning from "@/assets/hero-cinematic/trades-cleaning.png";
import tradesGarage from "@/assets/hero-cinematic/trades-garage.png";
import tradesPhotography from "@/assets/hero-cinematic/trades-photography.png";
import tradesVeterinary from "@/assets/hero-cinematic/trades-veterinary.png";
import tradesTattoo from "@/assets/hero-cinematic/trades-tattoo.png";
import tradesChildcare from "@/assets/hero-cinematic/trades-childcare.png";
import tradesEducation from "@/assets/hero-cinematic/trades-education.png";
import tradesEvents from "@/assets/hero-cinematic/trades-events.png";
import tradesLogistics from "@/assets/hero-cinematic/trades-logistics.png";
import tradesAgriturismo from "@/assets/hero-cinematic/trades-agriturismo.png";
import tradesLegal from "@/assets/hero-cinematic/trades-legal.png";
import tradesAccounting from "@/assets/hero-cinematic/trades-accounting.png";

const layer = "pointer-events-none absolute inset-0 overflow-hidden";
export type BackdropProps = { progress: MotionValue<number>; reduced?: boolean; industry?: string };

/* ═══════════════ FOOD — CAROSELLO ORBITALE 3D (camera che ruota attorno al piatto) ═══════════════ */
export function FoodFlameSweep({ progress }: BackdropProps) {
  const { px, py } = usePointerParallax();
  const spin = useTransform(progress, [0, 1], [-24, 96]);
  const orbitY = useTransform([spin, px] as const, ([s, p]: number[]) => s + p * 18);
  const orbitX = useTransform([progress, py] as const, ([p, y]: number[]) => -6 + p * 10 + y * -8);
  const dolly = useTransform(progress, [0, 0.5, 1], [0.72, 1.02, 1.28]);
  const heat = useTransform(progress, [0, 0.5, 1], [0.08, 0.42, 0.16]);
  const cards = [0, 1, 2, 3, 4, 5];
  return (
    <div className={`${layer} [perspective:1500px]`} aria-hidden>
      <motion.div
        className="absolute left-1/2 top-1/2 h-[44vh] w-[34vw] -translate-x-1/2 -translate-y-1/2"
        style={{ rotateY: orbitY, rotateX: orbitX, scale: dolly, transformStyle: "preserve-3d" }}
      >
        {cards.map((i) => (
          <div
            key={i}
            className="absolute inset-0 overflow-hidden rounded-md border border-[color:var(--sig-accent)]/40 bg-background/30 shadow-2xl"
            style={{
              transform: `rotateY(${(360 / cards.length) * i}deg) translateZ(30vw)`,
              backfaceVisibility: "hidden",
            }}
          >
            <img
              src={foodDish}
              alt=""
              className="h-full w-full scale-[1.3] object-cover"
              style={{ objectPosition: `${12 + i * 15}% ${30 + (i % 3) * 20}%` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,hsl(var(--background)/0.72))]" />
          </div>
        ))}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: heat,
          background: "radial-gradient(120% 60% at 50% 108%, var(--sig-accent), transparent 62%)",
          filter: "blur(26px)",
        }}
      />
    </div>
  );
}

/* ═══════════════ BAKERY — DOLLY LATERALE CON RACK FOCUS (banco che sfila a fuoco variabile) ═══════════════ */
export function BakeryOvenDoors({ progress }: BackdropProps) {
  const { px } = usePointerParallax(45, 20);
  const baseX = useTransform(progress, [0, 1], [18, -72]);
  const x = useTransform([baseX, px] as const, ([b, p]: number[]) => `${b + p * -5}%`);
  const skew = useTransform(progress, [0, 0.5, 1], [7, 0, -7]);
  const warmth = useTransform(progress, [0, 0.5, 1], [0.1, 0.32, 0.1]);
  const frames = [0, 1, 2, 3, 4, 5, 6];
  return (
    <div className={`${layer} [perspective:1200px]`} aria-hidden>
      <motion.div className="absolute left-0 top-[24%] flex h-[50vh] items-center gap-6" style={{ x, rotateY: skew, transformStyle: "preserve-3d" }}>
        {frames.map((i) => (
          <BakeryFrame key={i} progress={progress} index={i} total={frames.length} />
        ))}
      </motion.div>
      <motion.div className="absolute inset-0" style={{ opacity: warmth, background: "linear-gradient(180deg, var(--sig-accent), transparent 58%)" }} />
      <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_50%,transparent,hsl(var(--background)/0.7))]" />
    </div>
  );
}

function BakeryFrame({ progress, index, total }: BackdropProps & { index: number; total: number }) {
  const focus = index / (total - 1);
  const blur = useTransform(progress, [Math.max(0, focus - 0.22), focus, Math.min(1, focus + 0.22)], [7, 0, 7]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const z = useTransform(progress, [Math.max(0, focus - 0.25), focus, Math.min(1, focus + 0.25)], [-90, 40, -90]);
  return (
    <motion.div
      className="relative h-full w-[34vw] shrink-0 overflow-hidden border border-border/40 bg-background/40"
      style={{ filter, z, transformStyle: "preserve-3d" }}
    >
      <img src={bakeryCroissant} alt="" className="h-full w-full scale-[1.18] object-cover" style={{ objectPosition: `${12 + index * 13}% 50%` }} />
      <span className="absolute bottom-3 left-3 h-px w-10 bg-[color:var(--sig-accent)]" />
    </motion.div>
  );
}

/* ═══════════════ BEAUTY — IRIDE VERTICALE + LUCE CHE SEGUE IL PUNTATORE ═══════════════ */
export function BeautySilkVeils({ progress }: BackdropProps) {
  const { px, py } = usePointerParallax(70, 16);
  const inset = useTransform(progress, [0, 0.78], [46, 0]);
  const clip = useTransform(inset, (v) => `inset(${v * 0.4}% ${v}% ${v * 0.4}% ${v}%)`);
  const seam = useTransform(progress, [0, 0.7], [0.9, 0]);
  const zoom = useTransform(progress, [0, 1], [1.26, 1.02]);
  const lightX = useTransform(px, (p) => `${50 + p * 26}%`);
  const lightY = useTransform(py, (p) => `${45 + p * 20}%`);
  const glare = useTransform(
    [lightX, lightY] as const,
    ([lx, ly]: string[]) => `radial-gradient(42% 46% at ${lx} ${ly}, color-mix(in srgb, var(--sig-accent) 42%, transparent), transparent 70%)`,
  );
  return (
    <div className={layer} aria-hidden>
      <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
        <motion.img src={beautySerum} alt="" className="h-full w-full object-cover" style={{ scale: zoom }} />
        <motion.div className="absolute inset-0 mix-blend-screen" style={{ background: glare, opacity: 0.7 }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,hsl(var(--background)/0.55))]" />
      </motion.div>
      <motion.div
        className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[color:var(--sig-accent)]"
        style={{ opacity: seam, boxShadow: "0 0 40px var(--sig-accent)" }}
      />
    </div>
  );
}


/* ═══════════════ FITNESS — INVARIATO (approvato dal cliente) ═══════════════ */
export function FitnessKineticBlades({ progress }: BackdropProps) {
  const x = useTransform(progress, [0, 0.5, 1], ["-66vw", "4vw", "70vw"]);
  const y = useTransform(progress, [0, 0.5, 1], ["30vh", "0vh", "-18vh"]);
  const scale = useTransform(progress, [0, 0.46, 0.72, 1], [0.32, 1.3, 1.62, 0.7]);
  const rotate = useTransform(progress, [0, 1], [-32, 34]);
  const streakX = useTransform(progress, [0, 1], ["-90%", "120%"]);
  return (
    <div className={layer} aria-hidden>
      <motion.div className="absolute inset-y-0 w-[80%] skew-x-[-18deg]" style={{ x: streakX, background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--sig-accent) 30%, transparent), transparent)" }} />
      <motion.img src={fitnessDumbbell} alt="" width={1024} height={1024} className="absolute left-[10%] top-[10%] w-[min(68vw,820px)] object-contain drop-shadow-2xl" style={{ x, y, scale, rotate }} />
    </div>
  );
}

/* ═══════════════ HEALTHCARE — TRACCIATO ECG DISEGNATO (stroke draw) ═══════════════ */
export function HealthcareDilation({ progress }: BackdropProps) {
  const pathLength = useTransform(progress, [0.02, 0.85], [0, 1]);
  const gridOpacity = useTransform(progress, [0, 0.5, 1], [0.05, 0.2, 0.07]);
  const imgOpacity = useTransform(progress, [0.35, 0.8], [0, 0.35]);
  const imgScale = useTransform(progress, [0.35, 1], [1.1, 1]);
  return (
    <div className={layer} aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: gridOpacity,
          background:
            "repeating-linear-gradient(0deg, var(--sig-accent) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, var(--sig-accent) 0 1px, transparent 1px 40px)",
        }}
      />
      <motion.img
        src={healthcareHeart}
        alt=""
        className="absolute left-1/2 top-1/2 w-[min(46vw,540px)] -translate-x-1/2 -translate-y-1/2 object-contain"
        style={{ opacity: imgOpacity, scale: imgScale }}
      />
      <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="absolute inset-x-0 top-1/2 h-[42vh] w-full -translate-y-1/2">
        <motion.path
          d="M0 200 H160 l30 -8 l24 16 l26 -120 l30 236 l28 -124 l30 0 H520 l26 -14 l24 22 l26 -108 l30 214 l28 -114 h34 H1200"
          fill="none"
          stroke="var(--sig-accent)"
          strokeWidth={3}
          strokeLinejoin="round"
          style={{ pathLength, filter: "drop-shadow(0 0 12px var(--sig-accent))" }}
        />
      </svg>
    </div>
  );
}

/* ═══════════════ HOTEL — VENEZIANA (lamelle che si aprono sulla suite) ═══════════════ */
export function HotelCurtainRise({ progress }: BackdropProps) {
  const slats = [0, 1, 2, 3, 4, 5, 6, 7];
  const zoom = useTransform(progress, [0, 1], [1.18, 1.03]);
  return (
    <div className={`${layer} [perspective:1400px]`} aria-hidden>
      <motion.img src={hotelKey} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" style={{ scale: zoom }} />
      <div className="absolute inset-0 flex flex-col">
        {slats.map((i) => (
          <HotelSlat key={i} progress={progress} index={i} total={slats.length} />
        ))}
      </div>
    </div>
  );
}

function HotelSlat({ progress, index, total }: BackdropProps & { index: number; total: number }) {
  const start = 0.05 + (index / total) * 0.45;
  const rotateX = useTransform(progress, [start, start + 0.4], [0, -88]);
  const opacity = useTransform(progress, [start, start + 0.4], [1, 0]);
  return (
    <motion.div
      className="flex-1 origin-top border-b border-border/30 bg-background/95"
      style={{ rotateX, opacity, transformStyle: "preserve-3d" }}
    />
  );
}

/* ═══════════════ BEACH — PARALLASSE D'ORIZZONTE (strati a velocità diverse) ═══════════════ */
export function BeachTideRise({ progress }: BackdropProps) {
  const sky = useTransform(progress, [0, 1], ["0%", "-12%"]);
  const sea = useTransform(progress, [0, 1], ["0%", "18%"]);
  const foam = useTransform(progress, [0, 1], ["0%", "42%"]);
  const boat = useTransform(progress, [0, 1], ["-6%", "10%"]);
  const sun = useTransform(progress, [0, 1], ["18%", "40%"]);
  return (
    <div className={layer} aria-hidden>
      <motion.div className="absolute inset-x-0 top-0 h-[62%]" style={{ y: sky, background: "linear-gradient(180deg, color-mix(in srgb, var(--sig-accent) 30%, transparent), transparent)" }} />
      <motion.div className="absolute left-1/2 h-[24vmin] w-[24vmin] -translate-x-1/2 rounded-full blur-2xl" style={{ top: sun, background: "radial-gradient(circle, var(--sig-accent), transparent 70%)", opacity: 0.5 }} />
      <motion.img src={beachYacht} alt="" className="absolute left-[12%] top-[42%] w-[min(52vw,620px)] object-contain opacity-90" style={{ x: boat }} />
      <motion.div className="absolute inset-x-[-10%] top-[58%] h-[30%] rounded-t-[50%] bg-[color:var(--sig-accent)]/25 backdrop-blur-[2px]" style={{ y: sea }} />
      <motion.div className="absolute inset-x-[-14%] top-[74%] h-[34%] rounded-t-[50%] bg-foreground/10" style={{ y: foam }} />
    </div>
  );
}

/* ═══════════════ RETAIL — MARQUEE A DUE BINARI (vetrina infinita) ═══════════════ */
export function RetailShutterGrid({ progress }: BackdropProps) {
  const rowA = useTransform(progress, [0, 1], ["0%", "-46%"]);
  const rowB = useTransform(progress, [0, 1], ["-40%", "4%"]);
  const rows = [rowA, rowB];
  return (
    <div className={layer} aria-hidden>
      {rows.map((x, r) => (
        <motion.div
          key={r}
          className="absolute flex h-[30vh] items-center gap-4"
          style={{ x, top: r === 0 ? "16%" : "56%" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="relative h-full w-[26vw] shrink-0 overflow-hidden rounded-lg border border-border/40 bg-card/40">
              <img
                src={retailSneaker}
                alt=""
                className="h-full w-full scale-[1.15] object-cover"
                style={{ objectPosition: `${(i * 17 + r * 40) % 100}% 50%` }}
              />
              <span className="absolute bottom-2 left-2 h-1 w-8 rounded-full bg-[color:var(--sig-accent)]" />
            </div>
          ))}
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,transparent,hsl(var(--background)/0.75))]" />
    </div>
  );
}

type TradeScene = {
  asset: string;
  /** Geometria tecnica disegnata (stroke-draw) diversa per mestiere. */
  path: string;
  frame: "left" | "right" | "center";
  grid: "square" | "lines" | "dots";
};

const TRADE_SCENES: Record<string, TradeScene> = {
  electrician: { asset: tradesElectrician, path: "M60 320 H240 l40 -80 l40 80 l40 -80 l40 80 H700 l60 -120 H1140", frame: "right", grid: "square" },
  plumber: { asset: tradesPlumber, path: "M80 80 V260 h280 v-120 h240 v300 h420", frame: "left", grid: "lines" },
  construction: { asset: tradesConstruction, path: "M80 360 L300 90 L520 360 M180 240 H420 M300 90 V360 M600 360 V140 H1080 V360", frame: "center", grid: "square" },
  gardening: { asset: tradesGardening, path: "M600 380 C600 240 480 200 440 120 M600 380 C600 250 720 210 780 130 M600 380 V150", frame: "left", grid: "dots" },
  cleaning: { asset: tradesCleaning, path: "M60 200 Q300 40 540 200 T1020 200", frame: "right", grid: "dots" },
  garage: { asset: tradesGarage, path: "M120 300 h160 l60 -80 h300 l60 80 h200 M240 300 a60 60 0 1 0 0.1 0 M840 300 a60 60 0 1 0 0.1 0", frame: "center", grid: "lines" },
  photography: { asset: tradesPhotography, path: "M240 80 H960 V340 H240 Z M600 210 a110 110 0 1 0 0.1 0", frame: "center", grid: "dots" },
  veterinary: { asset: tradesVeterinary, path: "M300 240 a70 70 0 1 0 0.1 0 M480 140 a55 55 0 1 0 0.1 0 M700 140 a55 55 0 1 0 0.1 0 M880 240 a70 70 0 1 0 0.1 0", frame: "right", grid: "dots" },
  tattoo: { asset: tradesTattoo, path: "M100 380 C320 380 300 60 520 60 S740 380 960 380 S1120 120 1180 120", frame: "left", grid: "lines" },
  childcare: { asset: tradesChildcare, path: "M120 380 Q220 140 320 380 Q420 120 520 380 Q620 160 720 380 Q820 130 920 380", frame: "right", grid: "dots" },
  education: { asset: tradesEducation, path: "M200 320 H1000 M280 320 V140 H920 V320 M400 140 V320 M760 140 V320", frame: "center", grid: "lines" },
  events: { asset: tradesEvents, path: "M600 40 L360 380 M600 40 L840 380 M600 40 L200 300 M600 40 L1000 300", frame: "center", grid: "dots" },
  logistics: { asset: tradesLogistics, path: "M60 300 H420 l80 -140 H900 l60 140 H1160", frame: "left", grid: "lines" },
  agriturismo: { asset: tradesAgriturismo, path: "M60 340 Q300 260 540 340 T1020 340 M300 340 V200 M760 340 V220", frame: "right", grid: "dots" },
  legal: { asset: tradesLegal, path: "M240 340 V120 M420 340 V120 M600 340 V120 M780 340 V120 M960 340 V120 M180 120 H1020", frame: "center", grid: "lines" },
  accounting: { asset: tradesAccounting, path: "M120 360 V180 h120 v180 M320 360 V100 h120 v260 M520 360 V240 h120 v120 M720 360 V60 h120 v300", frame: "left", grid: "square" },
};

const DEFAULT_TRADE: TradeScene = {
  asset: tradesTool,
  path: "M100 320 H400 l80 -160 h300 l80 160 h200",
  frame: "center",
  grid: "square",
};

/* ═══════════════ TRADES — BLUEPRINT DISEGNATO + foto in cornice tecnica ═══════════════ */
export function TradesBlueprintDraw({ progress, industry }: BackdropProps) {
  const scene = TRADE_SCENES[industry ?? ""] ?? DEFAULT_TRADE;
  const pathLength = useTransform(progress, [0.03, 0.8], [0, 1]);
  const gridOpacity = useTransform(progress, [0, 0.5, 1], [0.05, 0.22, 0.08]);
  const revealW = useTransform(progress, [0.15, 0.7], ["0%", "100%"]);
  const frameOpacity = useTransform(progress, [0.12, 0.45], [0, 1]);
  const gridBg =
    scene.grid === "square"
      ? "repeating-linear-gradient(0deg, var(--sig-accent) 0 1px, transparent 1px 44px), repeating-linear-gradient(90deg, var(--sig-accent) 0 1px, transparent 1px 44px)"
      : scene.grid === "lines"
        ? "repeating-linear-gradient(90deg, var(--sig-accent) 0 1px, transparent 1px 76px)"
        : "radial-gradient(var(--sig-accent) 1px, transparent 1.6px) 0 0/34px 34px";
  const framePos =
    scene.frame === "left" ? "left-[6%]" : scene.frame === "right" ? "right-[6%]" : "left-1/2 -translate-x-1/2";
  return (
    <div className={layer} aria-hidden>
      <motion.div className="absolute inset-0" style={{ opacity: gridOpacity, background: gridBg }} />
      <svg viewBox="0 0 1200 420" preserveAspectRatio="none" className="absolute inset-x-0 top-1/2 h-[52vh] w-full -translate-y-1/2">
        <motion.path
          d={scene.path}
          fill="none"
          stroke="var(--sig-accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          style={{ pathLength, filter: "drop-shadow(0 0 10px var(--sig-accent))" }}
        />
      </svg>
      <motion.div
        className={`absolute bottom-[10%] ${framePos} h-[38vh] w-[min(46vw,460px)] overflow-hidden border border-[color:var(--sig-accent)]/50 bg-background/40`}
        style={{ opacity: frameOpacity }}
      >
        <motion.div className="h-full overflow-hidden" style={{ width: revealW }}>
          <img src={scene.asset} alt="" className="h-full w-[min(46vw,460px)] object-cover" />
        </motion.div>
        <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-[color:var(--sig-accent)]" />
        <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[color:var(--sig-accent)]" />
      </motion.div>
    </div>
  );
}

/* ═══════════════ LUXURY — IRIDE (diaframma che si apre sul dettaglio) ═══════════════ */
export function LuxuryMonolith({ progress }: BackdropProps) {
  const radius = useTransform(progress, [0, 0.8], ["10%", "78%"]);
  const clip = useTransform(radius, (r) => `circle(${r} at 50% 45%)`);
  const zoom = useTransform(progress, [0, 1], [1.35, 1.05]);
  const rimRotate = useTransform(progress, [0, 1], [0, 120]);
  const sheen = useTransform(progress, [0, 1], ["-30%", "120%"]);
  return (
    <div className={layer} aria-hidden>
      <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
        <motion.img src={luxuryWatch} alt="" className="h-full w-full object-cover" style={{ scale: zoom }} />
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-[45%] aspect-square w-[86vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--sig-accent)]/40"
        style={{ rotate: rimRotate, background: "conic-gradient(from 0deg, transparent, color-mix(in srgb, var(--sig-accent) 22%, transparent), transparent 30%)" }}
      />
      <motion.div className="absolute inset-y-0 w-[16%] skew-x-[-18deg] bg-foreground/10 blur-xl" style={{ x: sheen }} />
    </div>
  );
}

/* ═══════════════ NCC — TRACKING SHOT (invariato, coerente col settore) ═══════════════ */
export function NccRoadSweep({ progress }: BackdropProps) {
  const x = useTransform(progress, [0, 0.16, 0.6, 1], ["-96vw", "-48vw", "12vw", "112vw"]);
  const y = useTransform(progress, [0, 0.6, 1], ["22vh", "4vh", "-4vh"]);
  const scale = useTransform(progress, [0, 0.55, 1], [0.54, 1.12, 0.82]);
  const opacity = useTransform(progress, [0, 0.08, 0.9, 1], [0, 1, 1, 0]);
  const road = useTransform(progress, [0, 1], ["-45%", "40%"]);
  return (
    <div className={layer} aria-hidden>
      <motion.div className="absolute bottom-[18%] h-px w-[145%] bg-gradient-to-r from-transparent via-[color:var(--sig-accent)] to-transparent" style={{ x: road }} />
      <motion.img src={nccSedan} alt="" width={1280} height={768} className="absolute left-0 top-[24%] w-[min(82vw,1080px)] object-contain drop-shadow-2xl" style={{ x, y, scale, opacity }} />
    </div>
  );
}

export const BACKDROPS = {
  food: FoodFlameSweep,
  bakery: BakeryOvenDoors,
  beauty: BeautySilkVeils,
  fitness: FitnessKineticBlades,
  healthcare: HealthcareDilation,
  hotel: HotelCurtainRise,
  beach: BeachTideRise,
  retail: RetailShutterGrid,
  trades: TradesBlueprintDraw,
  luxury: LuxuryMonolith,
  ncc: NccRoadSweep,
} as const;

export type SignatureVariant = keyof typeof BACKDROPS;
