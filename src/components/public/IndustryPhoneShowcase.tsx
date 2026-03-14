import { motion } from "framer-motion";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { DEMO_INDUSTRY_DATA, DEMO_SLUGS } from "@/data/demo-industries";

interface PhoneScreen {
  label: string;
  type: "hero" | "services" | "dashboard" | "booking";
}

const SCREEN_CONFIGS: Record<string, PhoneScreen[]> = {
  default: [
    { label: "Home", type: "hero" },
    { label: "Servizi", type: "services" },
    { label: "Prenotazioni", type: "booking" },
    { label: "Dashboard", type: "dashboard" },
  ],
};

/** Renders a mini iPhone Pro frame with styled placeholder content */
function IPhoneFrame({ 
  screen, color, emoji, companyName, services, index 
}: { 
  screen: PhoneScreen; color: string; emoji: string; companyName: string; 
  services: { name: string; emoji?: string; price: number }[]; index: number;
}) {
  return (
    <motion.div
      className="flex-shrink-0 w-[140px] sm:w-[160px]"
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
    >
      {/* iPhone frame */}
      <div className="relative rounded-[20px] sm:rounded-[24px] border-[2px] border-white/15 overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(15,15,15,1) 100%)" }}>
        
        {/* Dynamic Island */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-[50px] h-[14px] bg-black rounded-full border border-white/10" />
        </div>

        {/* Screen content */}
        <div className="aspect-[9/16] overflow-hidden relative" style={{ minHeight: 220 }}>
          {screen.type === "hero" && (
            <div className="h-full flex flex-col">
              <div className="flex-1 relative flex flex-col items-center justify-center p-3 text-center"
                style={{ background: `linear-gradient(180deg, ${color}22 0%, ${color}08 100%)` }}>
                <span className="text-2xl mb-1.5">{emoji}</span>
                <p className="text-[9px] font-bold text-white/90 leading-tight">{companyName}</p>
                <p className="text-[7px] text-white/40 mt-0.5">Benvenuti</p>
                <div className="mt-2 px-3 py-1 rounded-full text-[7px] font-semibold text-white"
                  style={{ backgroundColor: color }}>
                  Scopri di più
                </div>
              </div>
              <div className="p-2 space-y-1">
                {[1,2,3].map(i => (
                  <div key={i} className="h-2 rounded-full bg-white/5" style={{ width: `${90 - i * 15}%` }} />
                ))}
              </div>
            </div>
          )}

          {screen.type === "services" && (
            <div className="h-full p-2.5 space-y-1.5">
              <p className="text-[8px] font-bold text-white/80 mb-1">Servizi</p>
              {services.slice(0, 5).map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 p-1.5 rounded-lg"
                  style={{ backgroundColor: `${color}12`, border: `1px solid ${color}20` }}>
                  <span className="text-[10px]">{s.emoji || "✨"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[7px] font-medium text-white/80 truncate">{s.name}</p>
                  </div>
                  <span className="text-[7px] font-bold" style={{ color }}>€{s.price}</span>
                </div>
              ))}
            </div>
          )}

          {screen.type === "booking" && (
            <div className="h-full p-2.5 flex flex-col">
              <p className="text-[8px] font-bold text-white/80 mb-2">Prenotazione</p>
              <div className="space-y-1.5 flex-1">
                {["Nome", "Telefono", "Data", "Ora"].map((f, i) => (
                  <div key={i} className="h-5 rounded-md bg-white/5 border border-white/10 px-1.5 flex items-center">
                    <span className="text-[6px] text-white/25">{f}</span>
                  </div>
                ))}
                <div className="h-5 rounded-md flex items-center justify-center text-[7px] font-semibold text-white mt-1"
                  style={{ backgroundColor: color }}>
                  Conferma
                </div>
              </div>
              <div className="flex gap-1 mt-2">
                {[1,2,3].map(i => (
                  <div key={i} className="flex-1 h-1 rounded-full" 
                    style={{ backgroundColor: i === 1 ? color : `${color}30` }} />
                ))}
              </div>
            </div>
          )}

          {screen.type === "dashboard" && (
            <div className="h-full p-2.5 space-y-1.5">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <p className="text-[7px] font-bold text-white/70">Dashboard</p>
              </div>
              {/* KPI cards */}
              <div className="grid grid-cols-2 gap-1">
                {[
                  { label: "Oggi", val: "€1.240" },
                  { label: "Ordini", val: "34" },
                  { label: "Clienti", val: "128" },
                  { label: "Rating", val: "4.8★" },
                ].map((kpi, i) => (
                  <div key={i} className="p-1.5 rounded-md bg-white/5 border border-white/8">
                    <p className="text-[5px] text-white/30">{kpi.label}</p>
                    <p className="text-[8px] font-bold" style={{ color }}>{kpi.val}</p>
                  </div>
                ))}
              </div>
              {/* Mini chart */}
              <div className="mt-1 h-8 rounded-md bg-white/3 border border-white/5 flex items-end gap-[2px] p-1">
                {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: `${color}${i === 5 ? 'CC' : '55'}` }} />
                ))}
              </div>
              <div className="h-2 w-16 rounded-full bg-white/5 mt-1" />
            </div>
          )}

          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 20%, ${color}08 0%, transparent 70%)` }} />
        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-1.5">
          <div className="w-8 h-1 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Label */}
      <p className="text-center text-[9px] sm:text-[10px] text-white/40 mt-2 font-medium">{screen.label}</p>
    </motion.div>
  );
}

interface IndustryPhoneShowcaseProps {
  industryId: IndustryId;
  className?: string;
  compact?: boolean;
}

export default function IndustryPhoneShowcase({ industryId, className = "", compact = false }: IndustryPhoneShowcaseProps) {
  const cfg = INDUSTRY_CONFIGS[industryId];
  const demo = DEMO_INDUSTRY_DATA[industryId];
  const screens = SCREEN_CONFIGS.default;
  const color = cfg.defaultPrimaryColor;

  return (
    <div className={`${className}`}>
      <div className={`flex items-end justify-center gap-3 sm:gap-5 ${compact ? "scale-[0.85] origin-center" : ""}`}>
        {screens.map((screen, i) => (
          <IPhoneFrame
            key={screen.type}
            screen={screen}
            color={color}
            emoji={cfg.emoji}
            companyName={demo.companyName}
            services={demo.services}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

/** Full section with title + phone showcase for use in demo pages & partner dashboards */
export function IndustryShowcaseSection({ 
  industryId, 
  onViewDemo,
  showDemoLink = true,
}: { 
  industryId: IndustryId; 
  onViewDemo?: () => void;
  showDemoLink?: boolean;
}) {
  const cfg = INDUSTRY_CONFIGS[industryId];
  const demo = DEMO_INDUSTRY_DATA[industryId];
  const slug = DEMO_SLUGS[industryId];

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{cfg.emoji}</span>
          <div>
            <h3 className="text-sm font-bold text-white">{cfg.label}</h3>
            <p className="text-[10px] text-white/40">{demo.companyName}</p>
          </div>
        </div>
        {showDemoLink && (
          <motion.button
            onClick={onViewDemo}
            className="px-3 py-1.5 rounded-lg text-[10px] font-semibold text-white/80 border border-white/10 hover:border-white/30 transition"
            whileTap={{ scale: 0.95 }}
          >
            Apri Demo →
          </motion.button>
        )}
      </div>
      <IndustryPhoneShowcase industryId={industryId} />
    </div>
  );
}

/** Grid of all industries with phone showcases — used in partner dashboards */
export function AllIndustriesShowcase({ onViewDemo }: { onViewDemo?: (id: IndustryId, slug: string) => void }) {
  const allIds = Object.keys(INDUSTRY_CONFIGS) as IndustryId[];

  return (
    <div className="space-y-2">
      {allIds.map(id => {
        const slug = DEMO_SLUGS[id];
        return (
          <div key={id} className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 hover:border-white/10 transition">
            <IndustryShowcaseSection
              industryId={id}
              onViewDemo={() => onViewDemo?.(id, slug)}
            />
          </div>
        );
      })}
    </div>
  );
}
