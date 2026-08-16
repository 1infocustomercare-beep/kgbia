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

function CinematicGlow({ progress, travel = false }: BackdropProps & { travel?: boolean }) {
  const opacity = useTransform(progress, [0, 0.45, 1], [0.18, 0.62, 0.2]);
  const x = useTransform(progress, [0, 1], travel ? ["-35%", "35%"] : ["0%", "0%"]);
  return (
    <motion.div
      className="absolute left-[15%] top-[12%] h-[76%] w-[70%] rounded-full blur-3xl"
      style={{
        opacity,
        x,
        background: "radial-gradient(circle, color-mix(in srgb, var(--sig-accent) 40%, transparent), transparent 68%)",
      }}
    />
  );
}

/* FOOD — il piatto attraversa il calore, poi arriva in tavola in primo piano. */
export function FoodFlameSweep({ progress }: BackdropProps) {
  const x = useTransform(progress, [0, 0.18, 0.58, 1], ["74vw", "38vw", "7vw", "-16vw"]);
  const y = useTransform(progress, [0, 0.5, 1], ["20vh", "2vh", "13vh"]);
  const scale = useTransform(progress, [0, 0.55, 1], [0.52, 1.15, 1.42]);
  const rotate = useTransform(progress, [0, 0.55, 1], [9, -3, -9]);
  const opacity = useTransform(progress, [0, 0.08, 0.88, 1], [0, 1, 1, 0.15]);
  const flameRotate = useTransform(progress, [0, 1], [-35, 125]);
  return (
    <div className={layer} aria-hidden>
      <CinematicGlow progress={progress} travel />
      <motion.div
        className="absolute right-[4%] top-[17%] h-[62vh] w-[62vh] rounded-full border border-[color:var(--sig-accent)]/50"
        style={{ rotate: flameRotate, background: "conic-gradient(from 40deg, transparent, var(--sig-accent), transparent 38%)", filter: "blur(10px)" }}
      />
      <motion.img src={foodDish} alt="" width={1024} height={1024} className="absolute left-0 top-[16%] w-[min(74vw,920px)] object-contain drop-shadow-2xl" style={{ x, y, scale, rotate, opacity }} />
    </div>
  );
}

/* BAKERY — il croissant ruota fuori dal forno e libera una nuvola di farina. */
export function BakeryOvenDoors({ progress }: BackdropProps) {
  const y = useTransform(progress, [0, 0.48, 1], ["72vh", "4vh", "-38vh"]);
  const x = useTransform(progress, [0, 0.55, 1], ["-24vw", "8vw", "26vw"]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.35, 1.24, 1.52]);
  const rotate = useTransform(progress, [0, 1], [-28, 22]);
  const doorLeft = useTransform(progress, [0.08, 0.62], ["0%", "-105%"]);
  const doorRight = useTransform(progress, [0.08, 0.62], ["0%", "105%"]);
  return (
    <div className={layer} aria-hidden>
      <CinematicGlow progress={progress} />
      <motion.div className="absolute inset-y-0 left-0 w-1/2 border-r border-border/40 bg-background/90" style={{ x: doorLeft }} />
      <motion.div className="absolute inset-y-0 right-0 w-1/2 border-l border-border/40 bg-background/90" style={{ x: doorRight }} />
      <motion.img src={bakeryCroissant} alt="" width={1024} height={1024} className="absolute left-[20%] top-[12%] w-[min(62vw,760px)] object-contain drop-shadow-2xl" style={{ x, y, scale, rotate }} />
      {[0, 1, 2, 3, 4].map((i) => <FlourParticle key={i} progress={progress} index={i} />)}
    </div>
  );
}

function FlourParticle({ progress, index }: BackdropProps & { index: number }) {
  const y = useTransform(progress, [0.18, 1], [40, -260 - index * 35]);
  const x = useTransform(progress, [0.18, 1], [0, (index - 2) * 85]);
  const opacity = useTransform(progress, [0.15, 0.42, 1], [0, 0.55, 0]);
  return <motion.span className="absolute left-1/2 top-[62%] h-2 w-2 rounded-full bg-foreground/60 blur-[1px]" style={{ x, y, opacity }} />;
}

/* BEAUTY — il flacone emerge in una rotazione lenta, con nastri di luce verticali. */
export function BeautySilkVeils({ progress }: BackdropProps) {
  const y = useTransform(progress, [0, 0.5, 1], ["58vh", "-2vh", "-20vh"]);
  const x = useTransform(progress, [0, 0.5, 1], ["36vw", "7vw", "-8vw"]);
  const scale = useTransform(progress, [0, 0.55, 1], [0.48, 1.08, 1.3]);
  const rotate = useTransform(progress, [0, 1], [16, -12]);
  const veil = useTransform(progress, [0, 1], ["-30%", "115%"]);
  return (
    <div className={layer} aria-hidden>
      <CinematicGlow progress={progress} />
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="absolute top-[-20%] h-[135%] w-[18%] blur-2xl" style={{ left: `${18 + i * 27}%`, x: veil, rotate: `${i % 2 ? 12 : -10}deg`, background: "linear-gradient(180deg, transparent, var(--sig-accent), transparent)", opacity: 0.18 }} />
      ))}
      <motion.img src={beautySerum} alt="" width={1024} height={1024} className="absolute left-[18%] top-[2%] w-[min(58vw,690px)] object-contain drop-shadow-2xl" style={{ x, y, scale, rotate }} />
    </div>
  );
}

/* FITNESS — il manubrio scatta verso camera con accelerazione e scie cinetiche. */
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

/* HEALTHCARE — il cuore si avvicina e pulsa mentre la diagnostica si espande. */
export function HealthcareDilation({ progress }: BackdropProps) {
  const scale = useTransform(progress, [0, 0.38, 0.46, 0.54, 1], [0.62, 1, 1.1, 1, 1.34]);
  const rotate = useTransform(progress, [0, 1], [-8, 10]);
  const y = useTransform(progress, [0, 1], ["16vh", "-16vh"]);
  return (
    <div className={layer} aria-hidden>
      <CinematicGlow progress={progress} />
      {[0, 1, 2].map((i) => <DiagnosticRing key={i} progress={progress} index={i} />)}
      <motion.img src={healthcareHeart} alt="" width={1024} height={1024} className="absolute left-1/2 top-[8%] w-[min(52vw,620px)] -translate-x-1/2 object-contain drop-shadow-2xl" style={{ y, scale, rotate }} />
    </div>
  );
}

function DiagnosticRing({ progress, index }: BackdropProps & { index: number }) {
  const scale = useTransform(progress, [0, 1], [0.35 + index * 0.18, 1.2 + index * 0.25]);
  const opacity = useTransform(progress, [0, 0.6, 1], [0.5, 0.2, 0]);
  return <motion.span className="absolute left-1/2 top-1/2 aspect-square w-[42vw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--sig-accent)]" style={{ scale, opacity }} />;
}

/* HOTEL — la chiave scende, oscilla e apre una fascia di luce come una suite. */
export function HotelCurtainRise({ progress }: BackdropProps) {
  const y = useTransform(progress, [0, 0.58, 1], ["-82vh", "-4vh", "28vh"]);
  const x = useTransform(progress, [0, 1], ["30vw", "-8vw"]);
  const rotate = useTransform(progress, [0, 0.5, 1], [-26, 13, -8]);
  const scale = useTransform(progress, [0, 0.58, 1], [0.6, 1.18, 1.36]);
  const curtain = useTransform(progress, [0.08, 0.72], ["0%", "-104%"]);
  return (
    <div className={layer} aria-hidden>
      <CinematicGlow progress={progress} />
      <motion.div className="absolute inset-0 border-b border-border/40 bg-background/90" style={{ y: curtain }} />
      <motion.img src={hotelKey} alt="" width={1024} height={1024} className="absolute left-[22%] top-[8%] w-[min(58vw,690px)] origin-top object-contain drop-shadow-2xl" style={{ x, y, scale, rotate }} />
    </div>
  );
}

/* BEACH — lo yacht taglia l'orizzonte e solleva una marea luminosa. */
export function BeachTideRise({ progress }: BackdropProps) {
  const x = useTransform(progress, [0, 0.52, 1], ["-78vw", "8vw", "104vw"]);
  const y = useTransform(progress, [0, 0.5, 1], ["20vh", "3vh", "-5vh"]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.55, 1.2, 0.86]);
  const tide = useTransform(progress, [0, 1], ["82%", "48%"]);
  return (
    <div className={layer} aria-hidden>
      <CinematicGlow progress={progress} travel />
      <motion.div className="absolute inset-x-0 bottom-0 bg-[color:var(--sig-accent)]/15 backdrop-blur-sm" style={{ top: tide }} />
      <motion.img src={beachYacht} alt="" width={1024} height={1024} className="absolute left-0 top-[21%] w-[min(76vw,980px)] object-contain drop-shadow-2xl" style={{ x, y, scale }} />
    </div>
  );
}

/* RETAIL — la sneaker sale dalla vetrina e compie una rotazione prodotto. */
export function RetailShutterGrid({ progress }: BackdropProps) {
  const y = useTransform(progress, [0, 0.5, 1], ["68vh", "-2vh", "-28vh"]);
  const scale = useTransform(progress, [0, 0.55, 1], [0.42, 1.18, 1.48]);
  const rotate = useTransform(progress, [0, 1], [-14, 20]);
  const x = useTransform(progress, [0, 1], ["-18vw", "18vw"]);
  const plinthY = useTransform(progress, [0, 0.7], ["30vh", "4vh"]);
  return (
    <div className={`${layer} [perspective:1200px]`} aria-hidden>
      <CinematicGlow progress={progress} />
      <motion.div className="absolute bottom-[12%] left-1/2 h-20 w-[52vw] -translate-x-1/2 rounded-[50%] border border-border/50 bg-card/60 blur-[1px]" style={{ y: plinthY, rotateX: 68 }} />
      <motion.img src={retailSneaker} alt="" width={1024} height={1024} className="absolute left-[20%] top-[3%] w-[min(62vw,760px)] object-contain drop-shadow-2xl" style={{ x, y, scale, rotate }} />
    </div>
  );
}

type TradeScene = {
  asset: string;
  x: [string, string, string];
  y: [string, string, string];
  scale: [number, number, number];
  rotate: [number, number, number];
  atmosphere: "circuit" | "ripple" | "build" | "grow" | "prism" | "speed" | "focus" | "pulse" | "ink" | "float" | "pages" | "spotlight" | "route" | "sun" | "columns" | "chart";
};

const TRADE_SCENES: Record<string, TradeScene> = {
  electrician: { asset: tradesElectrician, x: ["-70vw", "10vw", "46vw"], y: ["-25vh", "2vh", "18vh"], scale: [.34, 1.18, .82], rotate: [-42, 8, 68], atmosphere: "circuit" },
  plumber: { asset: tradesPlumber, x: ["34vw", "5vw", "-18vw"], y: ["58vh", "-2vh", "-28vh"], scale: [.46, 1.08, 1.34], rotate: [12, -5, -18], atmosphere: "ripple" },
  construction: { asset: tradesConstruction, x: ["28vw", "4vw", "-12vw"], y: ["58vh", "3vh", "-8vh"], scale: [.28, 1.04, 1.28], rotate: [0, -3, 4], atmosphere: "build" },
  gardening: { asset: tradesGardening, x: ["-16vw", "5vw", "18vw"], y: ["62vh", "4vh", "-12vh"], scale: [.38, 1.04, 1.22], rotate: [-8, 2, 9], atmosphere: "grow" },
  cleaning: { asset: tradesCleaning, x: ["-82vw", "4vw", "92vw"], y: ["28vh", "4vh", "-8vh"], scale: [.42, 1.12, .64], rotate: [-12, 0, 15], atmosphere: "prism" },
  garage: { asset: tradesGarage, x: ["74vw", "7vw", "-52vw"], y: ["18vh", "0vh", "-14vh"], scale: [.4, 1.2, 1.5], rotate: [130, 8, -95], atmosphere: "speed" },
  photography: { asset: tradesPhotography, x: ["8vw", "3vw", "-4vw"], y: ["30vh", "0vh", "-12vh"], scale: [.22, 1.15, 1.65], rotate: [-4, 1, 5], atmosphere: "focus" },
  veterinary: { asset: tradesVeterinary, x: ["-30vw", "5vw", "18vw"], y: ["48vh", "1vh", "-8vh"], scale: [.5, 1.02, 1.16], rotate: [-8, 0, 5], atmosphere: "pulse" },
  tattoo: { asset: tradesTattoo, x: ["70vw", "6vw", "-28vw"], y: ["-34vh", "0vh", "22vh"], scale: [.32, 1.08, 1.42], rotate: [55, -8, -34], atmosphere: "ink" },
  childcare: { asset: tradesChildcare, x: ["-38vw", "4vw", "24vw"], y: ["60vh", "2vh", "-38vh"], scale: [.38, 1.02, .84], rotate: [-16, 3, 22], atmosphere: "float" },
  education: { asset: tradesEducation, x: ["4vw", "2vw", "0vw"], y: ["58vh", "4vh", "-22vh"], scale: [.38, 1.12, 1.34], rotate: [0, 0, -3], atmosphere: "pages" },
  events: { asset: tradesEvents, x: ["-66vw", "5vw", "58vw"], y: ["22vh", "-2vh", "12vh"], scale: [.4, 1.06, .72], rotate: [-22, 7, 34], atmosphere: "spotlight" },
  logistics: { asset: tradesLogistics, x: ["-92vw", "5vw", "108vw"], y: ["20vh", "3vh", "-5vh"], scale: [.42, 1.08, .74], rotate: [-3, 0, 4], atmosphere: "route" },
  agriturismo: { asset: tradesAgriturismo, x: ["22vw", "3vw", "-10vw"], y: ["62vh", "5vh", "-15vh"], scale: [.42, 1.06, 1.24], rotate: [12, -2, -10], atmosphere: "sun" },
  legal: { asset: tradesLegal, x: ["-12vw", "3vw", "10vw"], y: ["-58vh", "1vh", "20vh"], scale: [.38, 1.04, 1.2], rotate: [-5, 0, 4], atmosphere: "columns" },
  accounting: { asset: tradesAccounting, x: ["58vw", "4vw", "-24vw"], y: ["45vh", "1vh", "-18vh"], scale: [.34, 1.08, 1.3], rotate: [14, -3, -10], atmosphere: "chart" },
};

/* Shared renderer, but every trade has its own subject, trajectory and visual grammar. */
export function TradesBlueprintDraw({ progress, industry }: BackdropProps) {
  const scene = TRADE_SCENES[industry ?? ""] ?? { asset: tradesTool, x: ["80vw", "8vw", "-36vw"], y: ["45vh", "-1vh", "-24vh"], scale: [.38, 1.14, 1.36], rotate: [34, -4, -18], atmosphere: "build" as const };
  const x = useTransform(progress, [0, 0.55, 1], scene.x);
  const y = useTransform(progress, [0, 0.55, 1], scene.y);
  const scale = useTransform(progress, [0, 0.55, 1], scene.scale);
  const rotate = useTransform(progress, [0, 0.55, 1], scene.rotate);
  const atmosphere = useTransform(progress, [0, 0.5, 1], [0.04, 0.38, 0.08]);
  const sweep = useTransform(progress, [0, 1], ["-110%", "135%"]);
  const ringScale = useTransform(progress, [0, 1], [.35, 1.7]);
  return (
    <div className={layer} aria-hidden>
      {(scene.atmosphere === "build" || scene.atmosphere === "circuit" || scene.atmosphere === "chart") && <motion.div className="absolute inset-0" style={{ opacity: atmosphere, background: scene.atmosphere === "chart" ? "repeating-linear-gradient(0deg, var(--sig-accent) 0 1px, transparent 1px 64px)" : "repeating-linear-gradient(0deg, var(--sig-accent) 0 1px, transparent 1px 48px), repeating-linear-gradient(90deg, var(--sig-accent) 0 1px, transparent 1px 48px)" }} />}
      {(scene.atmosphere === "ripple" || scene.atmosphere === "pulse" || scene.atmosphere === "focus") && <motion.div className="absolute left-1/2 top-1/2 aspect-square w-[58vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--sig-accent)]" style={{ scale: ringScale, opacity: atmosphere }} />}
      {(scene.atmosphere === "prism" || scene.atmosphere === "speed" || scene.atmosphere === "route" || scene.atmosphere === "spotlight") && <motion.div className="absolute inset-y-[-20%] w-[28%] skew-x-[-18deg] blur-xl" style={{ x: sweep, opacity: atmosphere, background: "linear-gradient(90deg, transparent, var(--sig-accent), transparent)" }} />}
      {(scene.atmosphere === "grow" || scene.atmosphere === "float" || scene.atmosphere === "pages" || scene.atmosphere === "sun" || scene.atmosphere === "columns" || scene.atmosphere === "ink") && <motion.div className="absolute bottom-[-22%] left-[18%] h-[75%] w-[64%] rounded-[50%] blur-3xl" style={{ opacity: atmosphere, scale: ringScale, background: "radial-gradient(circle, var(--sig-accent), transparent 68%)" }} />}
      <motion.img src={scene.asset} alt="" width={1024} height={1024} className="absolute left-[10%] top-[7%] w-[min(72vw,880px)] object-contain drop-shadow-2xl" style={{ x, y, scale, rotate }} />
    </div>
  );
}

/* LUXURY — macro orologio: rotazione lenta, avvicinamento e lama di luce. */
export function LuxuryMonolith({ progress }: BackdropProps) {
  const scale = useTransform(progress, [0, 0.56, 1], [0.48, 1.18, 1.7]);
  const rotate = useTransform(progress, [0, 1], [-22, 28]);
  const x = useTransform(progress, [0, 0.56, 1], ["-30vw", "6vw", "26vw"]);
  const y = useTransform(progress, [0, 1], ["26vh", "-18vh"]);
  const sheen = useTransform(progress, [0, 1], ["-30%", "120%"]);
  return (
    <div className={layer} aria-hidden>
      <CinematicGlow progress={progress} />
      <motion.img src={luxuryWatch} alt="" width={1024} height={1024} className="absolute left-[18%] top-[5%] w-[min(58vw,700px)] object-contain drop-shadow-2xl" style={{ x, y, scale, rotate }} />
      <motion.div className="absolute inset-y-0 w-[18%] skew-x-[-18deg] bg-foreground/10 blur-xl" style={{ x: sheen }} />
    </div>
  );
}

/* NCC — la limousine percorre la scena sull'orizzonte, come un tracking shot. */
export function NccRoadSweep({ progress }: BackdropProps) {
  const x = useTransform(progress, [0, 0.16, 0.6, 1], ["-96vw", "-48vw", "12vw", "112vw"]);
  const y = useTransform(progress, [0, 0.6, 1], ["22vh", "4vh", "-4vh"]);
  const scale = useTransform(progress, [0, 0.55, 1], [0.54, 1.12, 0.82]);
  const opacity = useTransform(progress, [0, 0.08, 0.9, 1], [0, 1, 1, 0]);
  const road = useTransform(progress, [0, 1], ["-45%", "40%"]);
  return (
    <div className={layer} aria-hidden>
      <CinematicGlow progress={progress} travel />
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