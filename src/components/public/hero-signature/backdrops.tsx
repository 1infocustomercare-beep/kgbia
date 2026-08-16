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

const layer = "pointer-events-none absolute inset-0 overflow-hidden";
export type BackdropProps = { progress: MotionValue<number>; reduced?: boolean };

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

/* TRADES — utensile e progetto entrano in diagonale mentre il disegno si traccia. */
export function TradesBlueprintDraw({ progress }: BackdropProps) {
  const x = useTransform(progress, [0, 0.55, 1], ["80vw", "8vw", "-36vw"]);
  const y = useTransform(progress, [0, 0.55, 1], ["45vh", "-1vh", "-24vh"]);
  const scale = useTransform(progress, [0, 0.55, 1], [0.38, 1.14, 1.36]);
  const rotate = useTransform(progress, [0, 1], [34, -18]);
  const grid = useTransform(progress, [0, 0.5, 1], [0.05, 0.34, 0.08]);
  return (
    <div className={layer} aria-hidden>
      <motion.div className="absolute inset-0" style={{ opacity: grid, background: "repeating-linear-gradient(0deg, var(--sig-accent) 0 1px, transparent 1px 48px), repeating-linear-gradient(90deg, var(--sig-accent) 0 1px, transparent 1px 48px)" }} />
      <motion.img src={tradesTool} alt="" width={1024} height={1024} className="absolute left-0 top-[8%] w-[min(70vw,850px)] object-contain drop-shadow-2xl" style={{ x, y, scale, rotate }} />
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